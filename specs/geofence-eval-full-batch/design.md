---
feature: "geofence-eval-full-batch"
status: approved     # draft | approved
tags: [harness, spec]
---

# Diseño — [[geofence-eval-full-batch]]

> Ver [[requirements]] para los requisitos que este diseño implementa y
> [[../../docs/architecture|architecture]] para las reglas de capas.
> Rutas relativas a `backend-pet-tracker/`.

## Capas tocadas

Ningún módulo `domain`/`application` cambia. Todo el cambio vive en dos
sitios que la arquitectura ya trata aparte:

| Pieza | Capa | Qué cambia |
|---|---|---|
| `src/pipeline/geofence-eval.ts` | núcleo puro (sin framework/SDK/ORM) | una guarda más en `evaluate()` (R1) |
| `src/workers/positions-consumer.service.ts` | infrastructure (worker) | el `Detail` que serializa (R3-R5) |
| `src/workers/alerts-engine/geofence-event-message.schema.ts` | infrastructure (contrato de entrada) | el schema zod (R6) |
| `src/workers/alerts-engine/alerts-engine-consumer.service.ts` | infrastructure (worker) | el bucle de evaluación (R7-R11) |

`src/pipeline/` conserva su regla de pureza: `evaluate()` sigue sin leer el
reloj, sin red y sin imports de framework — el test estático `R25` de
`geofence-eval.spec.ts` lo verifica y debe seguir verde.

## Decisiones técnicas

### D1 — `evaluate()` sigue siendo de una posición; quien itera es el consumidor

**Sirve a**: R7, R11.

`evaluate(previous, geometry, position, nowMs)` no cambia de firma. No se
añade un `evaluateBatch()` al pipeline puro, porque el bucle real necesita
intercalar escrituras al store (`openAlert` antes que `updateGeofenceState`,
orden a prueba de caídas de #12 D3) y ese es trabajo de infraestructura, no
del núcleo. El consumidor pliega el lote en memoria y persiste al final.

Forma exacta del bucle en `evaluateGeofences()`:

```
positions = [...(detail.positions ?? [detail.position])].sort((a, b) => a.ts - b.ts)

para cada geofence de listActiveGeofencesForPet(detail.petId):
    previousUpdatedAtMs = geofence.state.updatedAt === null
                          ? null
                          : Date.parse(geofence.state.updatedAt)      // UNA vez, fuera del bucle
    state = geofence.state
    pendingStateWrite = false

    para cada position de positions:                                   // ascendente
        si previousUpdatedAtMs !== null && position.ts <= previousUpdatedAtMs:
            continue                                                   // R9
        result = evaluate(state, geometry, position, position.ts)
        state = result.state
        si result.event === 'exit':   await handleExit(detail, geofence, state, position);  pendingStateWrite = false
        si result.event === 'enter':  await handleEnter(detail, geofence, state, position); pendingStateWrite = false
        si result.event === null:     pendingStateWrite = true

    si pendingStateWrite: await store.updateGeofenceState(geofence.id, state)
```

El `pendingStateWrite` es lo que hace que el caso de una sola posición
produzca **exactamente las mismas llamadas al store que hoy** (una sola
`updateGeofenceState`, dentro de `handleExit`/`handleEnter` si hubo evento, o
al final si no) — por eso los `it` de R8/R9/R10/R14 de #12 quedan verdes sin
tocarse (R11). También evita 100 `UPDATE` por geocerca en un lote grande.

`previousUpdatedAtMs` se calcula **una vez por geocerca**, contra el valor
persistido, no contra el `state` que avanza en memoria. Como las posiciones
van ascendentes, comparar contra la marca persistida basta y es más barato
que recalcularla; un lote reentregado tiene todas sus `ts <=` esa marca y no
produce ni una escritura (R9a).

### D2 — El `ts` de la alerta es el de la posición que cruzó

**Sirve a**: R8.

`handleExit(detail, geofence, newState)` y `handleEnter(...)` pasan a recibir
un cuarto argumento, la posición que produjo el evento, y leen de ella
`openedAt`/`closedAt` y el `payload.position`. `detail.position` deja de ser
la fuente del `ts` de la alerta — es lo que hoy hace que una salida detectada
en medio del lote se fecharía con la hora de la última muestra.

`evaluateBatteryRecovery()` **no** cambia: `detail.batteryPct` y
`detail.position.ts` siguen siendo lo correcto ahí, porque la batería es un
valor a nivel de mensaje (la última leída), no una serie que haya que
recorrer. Mezclarla en el bucle de geocercas dispararía N cierres de
`battery_low` por lote.

`alert_events.payload` es `Record<string, unknown>` opaco desde el store
(`alerts-engine.drizzle.store.ts:70`) hasta el mapper de respuesta
(`alert-response.mapper.ts:32`): cambiar qué posición guarda no rompe a
ningún consumidor ni exige migración.

### D3 — `detail.version = 2` con `positions[]` **y** `position`

**Sirve a**: R3, R4, R6, R10.

Forma exacta del `detail` emitido (todo lo demás del `Entry` —
`EventBusName`, `Source`, `DetailType` — sin cambios):

```json
{
  "version": 2,
  "petId": "...",
  "deviceId": "...",
  "position":  { "lat":…, "lng":…, "ts":…, "speedKmh":…|null, "course":…|null,
                 "sats":…|null, "accuracyM":…|null, "batteryPct":…|null, "flags":[] },
  "positions": [ { …mismas 9 claves… }, … ],
  "batteryPct": …|null
}
```

- `positions` va **ascendente por `ts`** y contiene **todas** las aceptadas
  del mensaje. `normalize()` ya ordena y deduplica por `ts`; el consumidor
  reordena igualmente sobre una copia (D1) porque el contrato de entrada no
  puede depender de una promesa del productor.
- `position` sigue siendo `positions[positions.length - 1]`. Es lo que
  mantiene verdes sin tocar a los consumidores y fixtures de 006/007/010: el
  campo que ya leían no se movió.
- El array es aditivo, así que un consumidor v1 que ignore claves
  desconocidas sigue funcionando. Por eso `version` sube a 2 pero el evento
  **no** se parte en dos tipos.

Tamaño: una posición serializada ronda los 130 bytes; 100 posiciones ≈ 13 KB,
más de un orden de magnitud por debajo del límite de 256 KB por `Entry` de
`PutEvents` (y del de `SendMessage` de SQS, que transporta el sobre entero).
R5 lo fija con una assertion en vez de dejarlo como cuenta de servilleta.

### D4 — El schema acepta v1 y v2 con `positions` opcional, no un discriminated union

**Sirve a**: R6, R10.

`version: z.union([z.literal(1), z.literal(2)])` + `positions:
z.array(positionDetailSchema).min(1).optional()`. Un
`z.discriminatedUnion('version', [...])` sería un contrato más estricto, pero
convierte `PositionUpdatedDetail` en un tipo unión y obliga a estrechar en
cada acceso a `detail.positions` dentro del consumidor. Con el fallback
`detail.positions ?? [detail.position]` bien definido, un v2 sin `positions`
degrada al comportamiento de hoy en vez de irse a la DLQ, que es exactamente
lo que se quiere durante un despliegue. El `.min(1)` sí se mantiene: un lote
vacío es un productor roto y debe fallar el parseo.

`positionDetailSchema` (líneas 22-32) se reutiliza tal cual, no se duplica.

### D5 — El guard de hash de #12 se re-congela, no se borra

**Sirve a**: R2.

`src/pipeline/geofence-eval-untouched.spec.ts` existe porque #12 no debía
rediseñar el motor que consumía. #30 **sí** lo rediseña, con spec y gate
humano, así que los dos sha256 se recalculan y el `describe` pasa a nombrar a
#30 como el estado congelado vigente. Borrar el archivo sería la salida
barata y dejaría al motor sin protección para la siguiente feature; el
segundo `describe` (valores de `pipeline/constants.ts`) además sigue siendo
útil intacto — #30 no toca ninguna constante de umbral.

Consecuencia operativa para el implementador: el hash se recalcula **después**
de que R1 esté verde y de que los tests nuevos de R1 estén escritos, porque
`geofence-eval.spec.ts` también entra en el hash. Es el último paso del
commit de R1/R2, con el comando exacto que da [[requirements]] §R2.

### D6 — El único llamador de `evaluate()` es el alerts-engine

Verificado: `grep -rn "from '@/pipeline/geofence-eval'" src test` devuelve
`alerts-engine-consumer.service.ts` (la función), más
`alerts-engine-store.ts` y `alerts-engine.drizzle.store.ts` (solo el tipo
`GeofenceState`) y su propio spec. No hay un segundo llamador que haya que
arreglar por separado: la guarda de R1 se pone una vez, en la función
compartida, y cubre todo.

### D7 — Infra sin cambios

La regla de EventBridge que enruta a `geofence-events` filtra por `source` +
`detail-type` y nada más — `src/aws/provisioning.ts:300-303` (LocalStack) e
`infra/lib/pet-tracker-dev-stack.ts:105-108` (CDK). Un `detail.version` 2
enruta igual que uno 1. Nada que reprovisionar, nada que desplegar, ninguna
variable de entorno nueva.

## Archivos afectados

| Archivo | Capa | Cambio |
|---|---|---|
| `src/pipeline/geofence-eval.ts` | núcleo puro | R1: `FLAG_SUSPECT_JUMP` en la guarda de la línea 106 + import desde `./constants` |
| `src/pipeline/geofence-eval.spec.ts` | test | R1: describe nuevo `R1 (geofence-eval-full-batch #30): …`; los describes R16-R25 de #11 no se tocan |
| `src/pipeline/geofence-eval-untouched.spec.ts` | test | R2: dos sha256 nuevos + texto del primer `describe` |
| `src/workers/positions-consumer.service.ts` | infrastructure | R3-R5: `emitEvents()` serializa `version: 2` + `positions[]`; se extrae un helper local `toEventPosition(p: ProcessedPosition)` para no repetir el mapeo de 9 claves entre `position` y `positions[]` |
| `src/workers/positions-consumer.service.spec.ts` | test | R3-R5: describes nuevos; **se edita** el `it` de la línea 463 (ver [[traceability]] §Tests de #8 actualizados) |
| `src/workers/alerts-engine/geofence-event-message.schema.ts` | infrastructure | R6: `version` unión 1\|2 + `positions` opcional |
| `src/workers/alerts-engine/geofence-event-message.schema.spec.ts` | test (**nuevo**) | R6: los 4 casos (a)-(d) |
| `src/workers/alerts-engine/alerts-engine-consumer.service.ts` | infrastructure | R7-R11: bucle de D1, firmas de `handleExit`/`handleEnter` con la posición que cruzó |
| `src/workers/alerts-engine/alerts-engine-consumer.service.spec.ts` | test | R7-R11: describes nuevos + helper local `pointAtDistance()` |
| `docs/aws-scalability-review.md` | doc | nota de cierre: el hueco de "una posición por ciclo" queda cerrado sin cambiar el conteo de eventos del bus |

`emitEvents()` sigue recibiendo `latest`; además necesita el array `accepted`
completo, así que su firma pasa a
`emitEvents(parsed, accepted, previousBattery)` y `latest` se deriva dentro
(`accepted[accepted.length - 1]`), en vez de añadir un quinto parámetro.

## Helpers de test que hay que añadir

- `src/workers/alerts-engine/alerts-engine-consumer.service.spec.ts`: no
  tiene forma de construir un punto a una distancia dada (solo `AT_CENTER` y
  `FAR_AWAY = { lat: CENTER_LAT + 0.01, lng: CENTER_LNG }` ≈ 1110 m). Añadir
  el mismo helper que ya usa `geofence-eval.spec.ts:26-32`:

  ```ts
  const EARTH_RADIUS_M = 6_371_000;
  function pointAtDistance(distanceM: number): { lat: number; lng: number } {
    const dLatDeg = (distanceM / EARTH_RADIUS_M) * (180 / Math.PI);
    return { lat: CENTER_LAT + dLatDeg, lng: CENTER_LNG };
  }
  ```

  Con `RADIUS_M = 100`: `pointAtDistance(95)` está dentro de la geocerca pero
  fuera del radio de entrada (`0.9 * 100 = 90`) — el punto exacto que pide
  R7a. `FAR_AWAY` sirve como la posición que cruza.

- El helper `positionUpdatedDetail()` (línea 148) **se conserva tal cual**,
  emitiendo `version: 1` sin `positions` — es el fixture de R10. Para los
  lotes se añade un helper hermano
  `positionUpdatedDetailV2(positions: PositionDetail[], overrides?)` que
  emite `version: 2`, `positions`, y `position = positions[positions.length - 1]`.

## Alternativas descartadas

- **Un evento `position.updated` por posición** (lo "natural" para un stream).
  Multiplica por ~100 los `PutEvents` en los lotes grandes y con ellos el
  costo del bus y de SQS; el análisis de `docs/aws-scalability-review.md`
  §Discrepancias asumía un evento por mensaje. Descartada: el lote cabe de
  sobra en un evento (D3).
- **Que el alerts-engine lea las posiciones de DynamoDB** en vez de
  recibirlas en el evento. Convierte un worker sin dependencias de datos en
  uno que hace un `Query` por mensaje y por mascota, y reintroduce el
  problema de "¿desde qué `ts` leo?" que el guard monotónico ya resuelve.
  Descartada por coste y por acoplamiento.
- **`evaluateBatch()` en `src/pipeline/geofence-eval.ts`** que devuelva la
  lista de eventos del lote. Obligaría a materializar los eventos y luego
  recorrerlos otra vez para escribir, y el orden alerta→estado de #12 D3
  quedaría fuera del sitio donde se decide. Descartada (D1).
- **Borrar `geofence-eval-untouched.spec.ts`**. Diff más corto, pero deja el
  motor sin guard para la próxima feature y tira también el `describe` de
  valores de constantes, que sigue siendo válido. Descartada (D5).
- **`z.discriminatedUnion('version', …)`** en el schema. Contrato más
  estricto a cambio de estrechamientos de tipo en todo el consumidor y de
  mandar a la DLQ un v2 sin `positions` que se podría procesar igual.
  Descartada (D4).
- **Histéresis temporal (N muestras consecutivas)** como parte de este
  cambio. Es la mitigación "de verdad" contra falsa alarma, pero cambia el
  contrato de `evaluate()` (necesita memoria de cuántas muestras lleva) y
  merece su propia spec. R1 cubre el riesgo concreto que introduce subir el
  muestreo. Fuera de alcance, declarado en [[requirements]].

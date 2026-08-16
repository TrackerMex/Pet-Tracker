---
feature: "reject-future-positions"
status: draft        # draft | approved
tags: [harness, spec]
---

# Requisitos — [[reject-future-positions]]

> Notación EARS. Cada requisito tiene id único R<n>, inmutable una vez aprobado.
> Ver [[design]] para las decisiones técnicas y
> [[../../docs/architecture|architecture]] para las reglas de capas.
>
> Fuente: `feature_list.json` #27 (`description` + los 6 `acceptance_criteria`).
> Todas las rutas de esta spec son relativas a `backend-pet-tracker/` salvo
> que se indique lo contrario.

## Contexto — el fallo exacto

El `ts` de una posición lo pone **el collar**, no el servidor:
`wialon-http.client.ts:166` lo construye como `message.t * 1000` con el
campo `t` que devuelve Wialon, y nada en el camino comprueba que esté en el
pasado. `normalize()` (`src/pipeline/validate-positions.ts:27`) valida
coordenadas, `ts` presente y duplicados — pero no si el `ts` es plausible.

`PollerService.pollAssignment()` (`src/workers/poller.service.ts:126`)
cierra el ciclo con:

```ts
const lastTs = Math.max(...positions.map((position) => position.ts));
await this.store.advanceWatermark(assignment.deviceId, new Date(lastTs));
```

Una sola posición con `ts` futuro deja `devices.ingest_watermark` en el
futuro. En el ciclo siguiente, la línea 88 lee ese watermark como `fromTs` y
la 92 pide `getMessages(unitId, fromTs, now.getTime())` con `fromTs > toTs`:
un rango invertido. El cliente devuelve lista vacía
(`fake-wialon.client.ts:100-102` corta con `lastSlot < firstSlot`; la API de
Wialon tampoco tiene nada que devolver en un intervalo negativo), la línea 97
hace `return` y **el watermark no se toca**. El device deja de reportar
para siempre, en silencio, sin excepción, sin log y sin alerta. La única
salida hoy es un `UPDATE` manual sobre `devices`.

Es disparable por hardware ordinario: un collar con el RTC mal configurado o
con el GPS aún sin fijar la hora se autodestruye solo. Se destapó el
2026-08-14 durante el smoke de #24 con el collar real.

Nota sobre el episodio local del mismo día (miles de mensajes en
`positions-raw` con `ts` de 2027): el `FakeWialonClient` **no** puede emitir
un `ts` mayor que el `toTs` que recibe — `toPosition()` lo calcula como
`slot * SIM_STEP_MS` con `slot <= Math.floor(toTs / SIM_STEP_MS)`
(`fake-wialon.client.ts:98,181`). La amplificación vino de procesos jest
huérfanos poleando con un `now` adelantado, no de un defecto del simulador.
**El simulador no se toca en esta feature.**

## Requisitos funcionales

### Bloque A — La validación pura rechaza el futuro

- **R1**: WHEN `normalize(raw, nowMs)`
  (`src/pipeline/validate-positions.ts:27`) recibe una posición con
  `position.ts > nowMs + FUTURE_TS_TOLERANCE_MS` THEN THE SYSTEM SHALL
  excluirla de `accepted` y añadir a `discarded` la entrada
  `{ reason: 'future_ts', position }`, con `'future_ts'` incorporado al tipo
  `DiscardReason` (`src/pipeline/types.ts:24`). El descarte SHALL evaluarse
  **después** de `hasValidTs()` (hace falta un `ts` numérico finito) y
  **antes** del control de duplicados, de modo que una posición futura no
  ocupe una entrada de `seenTs`. Las posiciones futuras SHALL contarse en
  `discarded.length` igual que `invalid_coordinates`, `missing_ts` y
  `duplicate_ts` — no se pierden, quedan reportadas.

  - Test: `src/pipeline/validate-positions.spec.ts`, describe nuevo
    `R1 (reject-future-positions #27): normalize() descarta el ts futuro
    fuera del margen de tolerancia`, con `nowMs = 1_000_000` y una posición
    de `ts: nowMs + FUTURE_TS_TOLERANCE_MS + 1`: `accepted` vacío y
    `discarded` de longitud 1 con `reason === 'future_ts'`. Un segundo `it`
    con un lote mixto (una pasada, una futura) asevera que solo cae la
    futura y que la pasada sigue en `accepted`.

- **R2**: WHILE se cumple R1, THE SYSTEM SHALL **aceptar** toda posición con
  `position.ts <= nowMs + FUTURE_TS_TOLERANCE_MS`, incluidas las adelantadas
  respecto al reloj del servidor dentro de ese margen: un desfase de reloj
  legítimo no puede costar telemetría real. El límite SHALL ser inclusivo —
  `ts === nowMs + FUTURE_TS_TOLERANCE_MS` se acepta.

  - Test: mismo archivo, describe nuevo
    `R2 (reject-future-positions #27): un ts adelantado dentro del margen de
    tolerancia se acepta`, con tres `it`: `ts = nowMs + 1` aceptada,
    `ts = nowMs + FUTURE_TS_TOLERANCE_MS` aceptada (borde inclusivo),
    `ts = nowMs + FUTURE_TS_TOLERANCE_MS + 1` descartada (borde exclusivo,
    solapa con R1 a propósito: fija el borde por los dos lados).

- **R3**: `normalize()` SHALL recibir `nowMs` como **parámetro opcional**
  (`normalize(raw: RawPosition[], nowMs?: number): NormalizeResult`) y SHALL
  NOT leer el reloj del sistema: ni `Date.now()`, ni `new Date()`, ni ningún
  valor por defecto derivado del reloj. IF `nowMs` es `undefined` THEN THE
  SYSTEM SHALL omitir por completo la comprobación de R1 y devolver
  exactamente el mismo resultado que hoy — el núcleo puro no inventa un
  "ahora" (patrón establecido en #11: `nowMs` siempre viene del caller).

  - Test: el `it` **ya existente**
    `src/pipeline/validate-positions.spec.ts::R5: ... 'es una funcion pura:
    sin imports de NestJS/SDK/ORM, sin reloj ni red (inspeccion de imports)'`
    (línea 83) SHALL quedar verde **sin editarse**: su assertion
    `expect(source).not.toMatch(/Date\.now|new Date\(|Math\.random/)` sobre
    el texto de `validate-positions.ts` es exactamente la verificación de
    este requisito. Además, un `it` nuevo dentro del describe de R2:
    `R3 (reject-future-positions #27): sin nowMs no se filtra nada`, que
    llama a `normalize([futura])` sin segundo argumento con una `ts` de
    varios años en el futuro y asevera `accepted.length === 1` y
    `discarded.length === 0`.

### Bloque B — El consumidor pasa el reloj y hace visibles los descartes

- **R4**: WHEN `PositionsConsumerService.handleMessage()`
  (`src/workers/positions-consumer.service.ts:175`) llama a `normalize()`
  (línea 179) THEN THE SYSTEM SHALL pasar `now.getTime()` como segundo
  argumento, siendo `now` el `Date` que ya recibe por parámetro desde
  `drainOnce(now)` (línea 83). Consecuencia observable: una posición futura
  contenida en un mensaje SQS SHALL NOT escribirse en DynamoDB, SHALL NOT
  actualizar `devices.last_message_at` ni `pets.last_position`, y SHALL NOT
  aparecer en el `positions[]` del evento `position.updated`.

  - Test: `src/workers/positions-consumer.service.spec.ts`, describe nuevo
    `R4 (reject-future-positions #27): el consumidor pasa now a normalize()
    y no persiste la posición futura`, con un body de 2 posiciones —
    `BASE_TS` (pasada, ya definida en la línea 29 del spec) y
    `NOW.getTime() + FUTURE_TS_TOLERANCE_MS + 60_000` — y assertions de que
    el `BatchWriteCommand` lleva un solo item, de que
    `updatePetLastPosition` se llamó con `ts === BASE_TS`, y de que
    `detail.positions` tiene longitud 1.

- **R5**: IF `normalize()` devuelve `discarded` no vacío THEN THE SYSTEM
  SHALL emitir **un** log de nivel `warn` por mensaje SQS con el conteo
  agrupado por razón — forma exacta
  `{ scope: 'consumer', deviceId, petId, discarded: { future_ts: 2,
  duplicate_ts: 1 } }` — y SHALL seguir procesando las aceptadas con
  normalidad (un descarte no aborta el mensaje ni impide el `DeleteMessage`).
  WHILE `discarded` esté vacío, THE SYSTEM SHALL NOT emitir ese log. Sin
  esto los descartes desaparecen: hoy la línea 179 destructura solo
  `{ accepted }` y tira `discarded` a la basura.

  - Test: mismo archivo, describe nuevo
    `R5 (reject-future-positions #27): los descartes se loguean agrupados
    por razón`, con dos `it`: uno espía `Logger.prototype.warn` (el spec ya
    importa `Logger` de `@nestjs/common`, línea 15) sobre un lote con una
    futura y un duplicado y asevera el objeto de conteo; otro asevera cero
    llamadas a `warn` con un lote sin descartes.

### Bloque C — El watermark nunca se va al futuro

- **R6**: WHEN `PollerService.pollAssignment()`
  (`src/workers/poller.service.ts:126-127`) avanza el watermark THEN THE
  SYSTEM SHALL llamar a `store.advanceWatermark()` con
  `new Date(Math.min(lastTs, now.getTime()))` — nunca con un instante
  posterior a `now`. El tope SHALL aplicarse **aunque la validación de R1 se
  haya saltado** (redundancia deliberada: el poller no invoca `normalize()`,
  publica el crudo a SQS).

  - Test: `src/workers/poller.service.spec.ts`, describe nuevo
    `R6 (reject-future-positions #27): el watermark nunca avanza por delante
    de now`, con `wialonStub([positionAt(NOW.getTime() - 30_000),
    positionAt(NOW.getTime() + 86_400_000)])` y assertion
    `expect(store.advanceWatermark.mock.calls[0][1].getTime()).toBe(NOW.getTime())`.
    Un segundo `it` con todas las posiciones pasadas asevera que el
    comportamiento de #8 R10 no cambia: se sigue guardando `lastTs`, no
    `now`.

- **R7**: IF `assignment.ingestWatermark` es posterior a `now` (device ya
  envenenado antes de este cambio) THEN THE SYSTEM SHALL ignorar ese valor y
  usar como `fromTs` el mismo suelo que ya usa el watermark `NULL` —
  `now.getTime() - CLAIM_WATERMARK_LOOKBACK_MINUTES * 60_000`
  (`poller.service.ts:88-90`, constante importada de
  `claim-device.use-case.ts:22`, valor 10) — y SHALL emitir un log `warn`
  con `{ scope: 'poller', deviceId, unitId }` nombrando el watermark
  descartado. Consecuencias observables:

  - **(a)** El device SHALL volver a ingestar en ese mismo ciclo, **sin
    ninguna intervención manual en la base**: `getMessages` se llama con un
    rango válido `(now - 10 min, now]` y las posiciones que devuelva se
    publican a SQS.
  - **(b)** Combinado con R6, la fila SHALL quedar reparada en disco al
    final de ese ciclo: `advanceWatermark` escribe `min(lastTs, now)`, que
    es anterior al valor envenenado — el watermark **retrocede** a propósito
    y el device queda sano para siempre.
  - **(c)** IF el rango de recuperación no devuelve posiciones THEN el
    watermark envenenado SHALL seguir en la base (la guarda de la línea 97
    corta antes de escribir) y el device SHALL recuperarse igual en el
    siguiente ciclo, porque el tope se aplica **en la lectura**. Por eso el
    tope de R6 por sí solo no cierra este requisito.

  - Test: `src/workers/poller.service.spec.ts`, describe nuevo
    `R7 (reject-future-positions #27): un watermark envenenado en el futuro
    se recupera solo en el siguiente ciclo`, con
    `assignment({ ingestWatermark: new Date(NOW.getTime() + 86_400_000) })`
    y tres `it`: (a) `wialon.getMessages` llamado con
    `NOW.getTime() - CLAIM_WATERMARK_LOOKBACK_MINUTES * 60_000` como segundo
    argumento y un `SendMessageCommand` emitido; (b)
    `advanceWatermark` llamado con un `Date` `<= NOW` y estrictamente menor
    que el watermark envenenado; (c) con `wialonStub([])`,
    `advanceWatermark` sin llamadas y `getMessages` con el mismo `fromTs`
    del suelo. El `it` existente `::R9: 'con ingest_watermark NULL usa now -
    CLAIM_WATERMARK_LOOKBACK_MINUTES como inicio'` (línea 132) SHALL quedar
    verde sin editarse.

### Bloque D — La constante y la no-regresión

- **R8**: La tolerancia SHALL vivir como `export const
  FUTURE_TS_TOLERANCE_MS` en `src/pipeline/constants.ts`, con valor
  `5 * 60_000` (5 minutos) y con su justificación escrita en el propio
  archivo en el mismo estilo JSDoc que las demás constantes: qué desfase
  legítimo cubre entre el reloj del collar y el del servidor, y por qué los
  fallos reales quedan fuera. SHALL NOT aparecer ningún literal de tolerancia
  en `validate-positions.ts`, en `poller.service.ts` ni en
  `positions-consumer.service.ts` — los tres importan la constante o no la
  usan. `src/pipeline/constants.ts` SHALL seguir sin ningún `import`.

  - Test: `src/pipeline/validate-positions.spec.ts`, describe nuevo
    `R8 (reject-future-positions #27): FUTURE_TS_TOLERANCE_MS vive en
    pipeline/constants.ts`, con dos `it`: uno asevera
    `expect(FUTURE_TS_TOLERANCE_MS).toBe(5 * 60_000)` con la constante
    importada de `./constants`; el otro lee el texto de
    `validate-positions.ts` con `readFileSync` (patrón ya usado en la línea
    84 del mismo spec) y asevera que contiene `FUTURE_TS_TOLERANCE_MS` y que
    **no** contiene los literales `300_000` ni `300000` — el umbral se usa
    por nombre, nunca por valor.

- **R9**: WHILE se cumplen R1-R8, THE SYSTEM SHALL dejar el comportamiento
  con posiciones de `ts` normal **sin ningún cambio observable**. En
  concreto:

  - **(a)** El fixture `src/pipeline/__fixtures__/walk.json` SHALL quedar
    **sin editar** (sus `ts` arrancan en `1785542430000`, 2026-08-02, y son
    absolutos: nunca serán futuros).
  - **(b)** Todos los `describe` existentes de
    `src/pipeline/validate-positions.spec.ts` (`R5`, `R6`, `R7` de #8) y de
    `src/pipeline/trips.spec.ts` (que llama `normalize(raw).accepted` en la
    línea 106, **sin** `nowMs`) SHALL quedar verdes sin editarse — es la
    razón exacta por la que `nowMs` es opcional (R3) y no obligatorio.
  - **(c)** `src/pipeline/geofence-eval.ts` y
    `src/pipeline/geofence-eval.spec.ts` SHALL quedar **sin tocar**, así que
    los dos sha256 de `src/pipeline/geofence-eval-untouched.spec.ts`
    (`GEOFENCE_EVAL_TS_SHA256`, `GEOFENCE_EVAL_SPEC_TS_SHA256`, líneas
    35-38) SHALL NOT recalcularse. No hay re-congelado en esta feature.
  - **(d)** El segundo `describe` de `geofence-eval-untouched.spec.ts`
    (`R19`, líneas 52-75) SHALL quedar verde **sin editarse**: asevera
    valores concretos de cada constante, no el conjunto de claves
    exportadas, así que añadir `FUTURE_TS_TOLERANCE_MS` no lo rompe.
  - **(e)** `test/ingestion.e2e-spec.ts` SHALL quedar verde sin editarse.

  - Test: no hay test nuevo — R9 se verifica ejecutando
    `pnpm -C backend-pet-tracker test` y `run test:e2e` y comprobando en el
    diff que ninguno de los archivos de (a)-(e) aparece modificado. La
    tabla §Tests que deben quedar verdes SIN editarse de [[traceability]]
    es la lista que revisa el `reviewer`.

## Fuera de alcance

- **Descartar posiciones demasiado antiguas** (un `ts` de 1970 o anterior al
  claim). Es el fallo simétrico, pero no rompe nada: un `ts` viejo no
  envenena el watermark (`Math.max` lo ignora) y el guard "solo si más
  reciente" del store (#8 R14) ya impide que retroceda la caché. Otra
  feature si alguna vez hace falta.
- **Alertar al usuario** de que su collar tiene el reloj roto (notificación,
  `alert_events`, badge en la app). R5 lo deja observable en logs; convertir
  eso en producto es una feature de alertas, no de pipeline.
- **Corregir el `ts` futuro** en vez de descartarlo (reescribirlo a `now`,
  interpolar). Falsear telemetría es peor que perderla.
- **Métrica/contador de descartes** en CloudWatch (EMF, dimensión por
  razón). R5 usa el `Logger` que ya está en el archivo; nada de
  instrumentación nueva.
- **`FakeWialonClient`**: no puede emitir `ts > toTs` (ver §Contexto). No se
  toca, y tampoco su fixture.
- **`src/pipeline/geofence-eval.ts`** y su suite: congelados por sha256
  desde #30 y esta feature no los necesita (R9c).
- **Migraciones de base de datos**: ninguna. `devices.ingest_watermark` no
  cambia de tipo ni de nulabilidad; la reparación es un `UPDATE` normal por
  el camino que ya existe (R7b).
- **Variables de entorno**: ninguna nueva. `FUTURE_TS_TOLERANCE_MS` es una
  constante de código, no configuración por entorno — se recalibra con una
  spec, no con un `.env`.
- **Infraestructura AWS**: nada que reprovisionar ni desplegar.

## Aprobación

- [ ] Aprobado por humano (fecha: ____) ← gate obligatorio antes de implementar

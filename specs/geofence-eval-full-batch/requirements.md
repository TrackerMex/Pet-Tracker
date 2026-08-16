---
feature: "geofence-eval-full-batch"
status: approved     # draft | approved
tags: [harness, spec]
---

# Requisitos — [[geofence-eval-full-batch]]

> Notación EARS. Cada requisito tiene id único R<n>, inmutable una vez aprobado.
> Ver [[design]] para las decisiones técnicas y
> [[../../docs/architecture|architecture]] para las reglas de capas.
>
> Fuente: `feature_list.json` #30 (`description` + los 7 `acceptance_criteria`).
> Todas las rutas de esta spec son relativas a `backend-pet-tracker/` salvo
> que se indique lo contrario.

## Contexto — el hueco exacto

`positions-consumer.service.ts:234` (`emitEvents`) emite **un** evento
`position.updated` por mensaje SQS, y su `detail` solo lleva `position`, la
última posición aceptada del mensaje (`const latest = accepted[accepted.length
- 1]`, línea 200). El consumidor `alerts-engine-consumer.service.ts:232`
(`evaluateGeofences`) llama a `evaluate()`
(`src/pipeline/geofence-eval.ts:99`) **una vez por geocerca activa**, con esa
única posición.

`evaluate()` es una máquina de estados diseñada para consumir un stream
ordenado: `previous` entra, `result.state` sale, y el guard monotónico
`previousUpdatedAtMs` (`alerts-engine-consumer.service.ts:240-251`) existe
precisamente porque el diseño asumía muchas muestras seguidas. Con un mensaje
de hasta `POSITIONS_PER_MESSAGE_MAX = 100` posiciones
(`src/workers/poller.service.ts:16`) — descarga del búfer del collar tras
perder cobertura, reinicio del poller, o el lookback del claim — la ventana
entera colapsa en **una** evaluación: una salida con regreso dentro del mismo
lote no produce ninguna alerta. Es justo la ventana donde es más probable que
la mascota se haya perdido de verdad, porque el dispositivo estuvo sin señal.

**Prerrequisito dentro de esta misma feature**: `evaluate()` corta hoy solo
con `FLAG_LOW_ACCURACY` (`geofence-eval.ts:106`). Una posición marcada
`FLAG_SUSPECT_JUMP` (`src/pipeline/constants.ts`, valor `'suspect_jump'`) —
el salto absurdo, a kilómetros del recorrido real — con buena precisión
(`accuracyM <= 50`) dispara hoy un `exit` falso. La histéresis es **espacial**
(1.1R para salir, 0.9R para entrar, más `accuracyM <= GEOFENCE_EXIT_MAX_
ACCURACY_M`), no temporal: no hay confirmación por N muestras consecutivas,
una sola muestra mala basta. Multiplicar por ~100 el número de muestras
evaluadas sin filtrar el salto multiplica la exposición a falsa alarma, y una
falsa alarma de fuga es lo que hace que el usuario silencie las
notificaciones. Por eso R1 va **primero** y no en otra feature.

## Requisitos funcionales

### Bloque A — El núcleo puro filtra el salto (prerrequisito)

- **R1**: IF la posición que recibe `evaluate()`
  (`src/pipeline/geofence-eval.ts`) tiene `FLAG_SUSPECT_JUMP` entre sus
  `flags` THEN THE SYSTEM SHALL devolver `{ state: previous, event: null }` —
  el objeto `previous` **idéntico**, incluido su `updatedAt`, sin leer
  distancia, geometría ni estado — exactamente el mismo corto-circuito que
  hoy aplica a `FLAG_LOW_ACCURACY` en la línea 106. La condición SHALL quedar
  como una única guarda `position.flags.includes(FLAG_LOW_ACCURACY) ||
  position.flags.includes(FLAG_SUSPECT_JUMP)`, con `FLAG_SUSPECT_JUMP`
  importado de `./constants` (nunca el literal `'suspect_jump'`). El
  comportamiento SHALL valer para los tres valores de `previous.state`
  (`unknown`, `inside`, `outside`), y una posición con **ambos** flags SHALL
  comportarse igual.

  - Test: `src/pipeline/geofence-eval.spec.ts`, describe nuevo
    `R1 (geofence-eval-full-batch #30): suspect_jump congela el estado igual
    que low_accuracy`. Debe fallar hoy: con `previous = { state: 'inside',
    updatedAt: '...' }` y una posición a 115 m del centro (radio 100),
    `accuracyM: 10`, `flags: [FLAG_SUSPECT_JUMP]`, hoy devuelve
    `event: 'exit'`; tras R1 devuelve `event: null` y `state === previous`
    por identidad de referencia (`toBe`, no `toEqual`).

- **R2**: WHEN R1 modifica `src/pipeline/geofence-eval.ts` y
  `src/pipeline/geofence-eval.spec.ts` THEN THE SYSTEM SHALL re-congelar las
  constantes `GEOFENCE_EVAL_TS_SHA256` y `GEOFENCE_EVAL_SPEC_TS_SHA256` de
  `src/pipeline/geofence-eval-untouched.spec.ts` (líneas 37-40) con el sha256
  del contenido nuevo normalizado a LF, y SHALL reescribir el texto del
  `describe` de la línea 42 para que nombre a #30 como el rediseño autorizado
  en vez de afirmar que el archivo conserva su contenido de #11. El guard
  **no se borra**: sigue impidiendo que una feature futura toque el motor sin
  spec. El segundo `describe` (líneas 54-77, valores de
  `pipeline/constants.ts`) SHALL quedar intacto: #30 no añade ni cambia
  ninguna constante de umbral.

  - Comando exacto para recalcular, desde `backend-pet-tracker/`:
    ```bash
    node -e "const{createHash}=require('node:crypto');const{readFileSync}=require('node:fs');for(const f of ['geofence-eval.ts','geofence-eval.spec.ts']){const r=readFileSync('src/pipeline/'+f,'utf8');const c=(r.charCodeAt(0)===0xfeff?r.slice(1):r).replace(/\r\n/g,'\n');console.log(f,createHash('sha256').update(c).digest('hex'));}"
    ```
    (Mismo `normalizeLineEndings` que el propio archivo de guard:
    BOM fuera, CRLF → LF. Sin la normalización el hash depende del
    `core.autocrlf` del checkout y CI rompe en Linux.)
  - Test: los dos `it` existentes de
    `src/pipeline/geofence-eval-untouched.spec.ts`, con el `describe`
    renombrado a `R2 (geofence-eval-full-batch #30): geofence-eval.ts queda
    congelado en el estado de #30`.

### Bloque B — El productor lleva el lote entero en el evento

- **R3**: WHEN `PositionsConsumerService.emitEvents()`
  (`src/workers/positions-consumer.service.ts:234`) construye el `Detail` del
  evento `position.updated` THEN THE SYSTEM SHALL serializar `version: 2` y
  un campo nuevo `positions`: un array con **todas** las posiciones aceptadas
  por `normalize()` de ese mensaje (el array `accepted` de `handleMessage`,
  línea 179), en orden **ascendente** de `ts`, cada elemento con exactamente
  las mismas 9 claves y el mismo mapeo de ausentes a `null` que ya usa
  `position` hoy (`lat`, `lng`, `ts`, `speedKmh`, `course`, `sats`,
  `accuracyM`, `batteryPct`, `flags`). `positions` SHALL tener siempre al
  menos un elemento (el evento solo se emite con `accepted.length > 0`,
  guarda de la línea 186).

  - Test: `src/workers/positions-consumer.service.spec.ts`, describe nuevo
    `R3 (geofence-eval-full-batch #30): el detail v2 lleva el lote completo en
    positions[]`, con un mensaje de 3 posiciones aceptadas encoladas
    desordenadas en el body y assertion de que `detail.positions` sale
    ascendente por `ts` y `detail.version === 2`.

- **R4**: WHILE se cumple R3, THE SYSTEM SHALL mantener el campo `position`
  del `detail` **sin cambios**: la última posición aceptada del mensaje
  (`accepted[accepted.length - 1]`), con las mismas 9 claves y el mismo
  mapeo a `null`, y SHALL mantener también `petId`, `deviceId` y `batteryPct`
  (top-level) tal como están hoy. `positions[positions.length - 1]` SHALL ser
  igual (`toEqual`) a `position`. El `detail` de `battery.low`
  (líneas 276-281) SHALL seguir en `version: 1`, sin tocar. Consecuencia
  verificable: los consumidores y fixtures de los planes 006/007/010 quedan
  verdes sin modificarse.

  - Test: el `it` existente
    `src/workers/positions-consumer.service.spec.ts::R16: ... 'serializa con
    null los campos ausentes de la ultima aceptada'` (línea 518) SHALL quedar
    verde **sin editarse** — solo asevera `detail.position` y
    `detail.batteryPct`. Además, un `it` nuevo dentro del describe de R3:
    `R4 (geofence-eval-full-batch #30): position sigue siendo la última de
    positions[]`.

- **R5**: WHEN un mensaje SQS con N posiciones aceptadas (N hasta
  `POSITIONS_PER_MESSAGE_MAX = 100`) se procesa THEN THE SYSTEM SHALL enviar
  exactamente **un** `Entry` con `DetailType === DETAIL_TYPE_POSITION_UPDATED`
  en el `PutEventsCommand` de ese mensaje — el conteo de eventos del bus no
  cambia con N, y por tanto el costo tampoco
  (`docs/aws-scalability-review.md` §Discrepancias). El `Detail` serializado
  de un lote de 100 posiciones SHALL medir menos de 256 KB (límite de entrada
  de `PutEvents`).

  - Test: `src/workers/positions-consumer.service.spec.ts`, describe nuevo
    `R5 (geofence-eval-full-batch #30): un solo Entry position.updated por
    mensaje SQS aunque el lote traiga 100 posiciones`, con dos `it`: uno que
    asevera `emittedEvents(events).filter(e => e.DetailType ===
    DETAIL_TYPE_POSITION_UPDATED)` tiene longitud 1 con un lote de 100
    posiciones, y otro que asevera
    `Buffer.byteLength(entry.Detail, 'utf8') < 256 * 1024`.

### Bloque C — El schema acepta v1 y v2

- **R6**: `positionUpdatedDetailSchema`
  (`src/workers/alerts-engine/geofence-event-message.schema.ts:34`) SHALL
  declarar `version: z.union([z.literal(1), z.literal(2)])` y un campo nuevo
  `positions: z.array(positionDetailSchema).min(1).optional()`, reutilizando
  el `positionDetailSchema` que ya existe (líneas 22-32) sin duplicarlo. Las
  claves `petId`, `deviceId`, `position` y `batteryPct` SHALL quedar
  exactamente como están. Consecuencias observables sobre `safeParse`:

  - **(a)** IF el `detail` es `{ version: 2, ..., position, positions: [p1,
    p2] }` THEN `safeParse` SHALL devolver `success: true`.
  - **(b)** IF el `detail` es `{ version: 1, ..., position }` sin la clave
    `positions` THEN `safeParse` SHALL devolver `success: true`.
  - **(c)** IF el `detail` trae `positions: []` THEN `safeParse` SHALL
    devolver `success: false` — un lote vacío es un productor roto, no un
    caso legado.
  - **(d)** IF el `detail` trae `version: 3` THEN `safeParse` SHALL devolver
    `success: false`.

  - Test: archivo nuevo
    `src/workers/alerts-engine/geofence-event-message.schema.spec.ts`,
    describe `R6 (geofence-eval-full-batch #30): positionUpdatedDetailSchema
    acepta v1 y v2`, un `it` por cada letra (a)-(d).

### Bloque D — El motor itera el lote entero

- **R7**: WHEN `AlertsEngineConsumerService.evaluateGeofences()`
  (`src/workers/alerts-engine/alerts-engine-consumer.service.ts:232`) procesa
  un `position.updated` THEN THE SYSTEM SHALL, para cada geocerca activa,
  llamar a `evaluate()` **una vez por cada posición** de
  `detail.positions ?? [detail.position]`, recorridas en orden **ascendente**
  de `ts` (ordenadas por el propio consumidor sobre una copia, sin confiar en
  el orden del productor), encadenando el `result.state` de una iteración
  como el `previous` de la siguiente **en memoria**, y pasando el `ts` de esa
  misma posición como cuarto argumento `nowMs`. Consecuencias observables,
  con una geocerca de radio 100 m y `previous.state = 'inside'`:

  - **(a)** IF el lote es `[dentro(ts1), a 1110 m(ts2), a 95 m(ts3)]` THEN
    THE SYSTEM SHALL llamar a `store.openAlert` exactamente una vez con
    `type: 'geofence_exit'`, SHALL **no** llamar a `store.closeOpenAlert` con
    `type: 'geofence_exit'` (95 m no cumple la condición de entrada
    `<= radio * 0.9 = 90 m`, histéresis espacial de #11 intacta), y el estado
    final persistido SHALL ser `outside`.
  - **(b)** IF el lote es `[dentro(ts1), a 1110 m(ts2), en el centro(ts3)]`
    THEN THE SYSTEM SHALL llamar a `store.openAlert` una vez (`exit` en ts2)
    y a `store.closeOpenAlert` una vez (`enter` en ts3), y SHALL enviar dos
    mensajes a `notifications`: uno `kind: 'alert'` y uno
    `kind: 'alert_resolved'` — la salida con regreso dentro del lote deja de
    ser invisible.
  - **(c)** IF una posición intermedia lleva `FLAG_SUSPECT_JUMP` o
    `FLAG_LOW_ACCURACY` THEN, por R1, esa posición SHALL no alterar el estado
    encadenado ni producir evento: un lote
    `[dentro(ts1), a 1110 m con flags ['suspect_jump'](ts2), dentro(ts3)]`
    SHALL no llamar a `store.openAlert` en absoluto.

  - Test: `src/workers/alerts-engine/alerts-engine-consumer.service.spec.ts`,
    describe nuevo `R7 (geofence-eval-full-batch #30): evalúa el lote entero
    en orden ascendente de ts`, un `it` por cada letra (a)-(c).

- **R8**: WHEN una posición intermedia del lote dispara `exit` THEN THE
  SYSTEM SHALL construir el `OpenAlertInput` con `openedAt: new
  Date(<ts de esa posición>)` y `payload: { position: <esa misma posición>,
  geofenceName }` — nunca con el `ts` de la última posición del lote, nunca
  con `now` ni con `Date.now()`. Simétricamente, WHEN una posición dispara
  `enter` THEN el `CloseOpenAlertInput` SHALL llevar
  `closedAt: new Date(<ts de la posición que reentró>)`. Esto exige cambiar
  la firma de los privados `handleExit()` (línea 282) y `handleEnter()`
  (línea 311) para que reciban la posición que cruzó, en vez de leer
  `detail.position`.

  `evaluateBatteryRecovery()` (línea 339) SHALL quedar **sin cambios**: sigue
  usando `detail.batteryPct` y `detail.position.ts` (la batería es un valor
  del mensaje, no de cada muestra).

  - Test: `src/workers/alerts-engine/alerts-engine-consumer.service.spec.ts`,
    describe nuevo `R8 (geofence-eval-full-batch #30): la alerta lleva el ts
    de la posición que cruzó`, con assertion de que
    `store.openAlert.mock.calls[0][0].openedAt.getTime() === ts2` y
    `payload.position.ts === ts2`, siendo ts3 el de la última del lote y
    `NOW.getTime()` el del reloj inyectado — los tres valores distintos.

- **R9**: WHILE se cumple R7, THE SYSTEM SHALL seguir respetando el guard
  monotónico: `previousUpdatedAtMs` SHALL calcularse **una vez por geocerca**
  a partir de `geofence.state.updatedAt` persistido, **antes** del bucle de
  posiciones, y toda posición con `ts <= previousUpdatedAtMs` SHALL saltarse
  sin llamar a `evaluate()` ni a ninguna escritura. Consecuencias
  observables:

  - **(a)** IF el mismo mensaje se reentrega después de haberse procesado con
    éxito (todas las `ts` del lote `<= geofence.state.updatedAt` persistido)
    THEN THE SYSTEM SHALL no llamar a `store.openAlert`,
    `store.closeOpenAlert` ni `store.updateGeofenceState` para esa geocerca,
    y SHALL no enviar ningún mensaje a `notifications`, y SHALL borrar el
    mensaje de la cola.
  - **(b)** IF un lote mezcla posiciones ya vistas y nuevas THEN THE SYSTEM
    SHALL evaluar solo las de `ts > previousUpdatedAtMs`, sin que el estado
    retroceda.

  - Test: `src/workers/alerts-engine/alerts-engine-consumer.service.spec.ts`,
    describe nuevo `R9 (geofence-eval-full-batch #30): el guard monotónico
    sobrevive al lote`, un `it` por letra. El `it` existente
    `::R14: 'redelivery normal (geofence_state ya avanzo)...'` (línea 877)
    SHALL quedar verde sin editarse.

- **R10**: IF el `detail` de un `position.updated` **no** trae `positions`
  (`version: 1`, mensaje legado en vuelo durante el despliegue) THEN THE
  SYSTEM SHALL procesarlo como un lote de una sola posición —
  `detail.positions ?? [detail.position]` — con exactamente el mismo
  resultado observable que hoy (mismo `openAlert`/`closeOpenAlert`/
  `updateGeofenceState`/notificación), SHALL borrar el mensaje de la cola y
  SHALL NOT dejarlo sin borrar (nada va a la DLQ por esta causa).

  - Test: `src/workers/alerts-engine/alerts-engine-consumer.service.spec.ts`,
    describe nuevo `R10 (geofence-eval-full-batch #30): un detail v1 sin
    positions[] se sigue procesando`, usando el helper `positionUpdatedDetail()`
    tal como está hoy (emite `version: 1` sin `positions`), con assertion de
    `openAlert` llamado una vez y `sqs.deleted` conteniendo el
    `ReceiptHandle`. El bloque `R14` de `test/alerts-engine.e2e-spec.ts`
    (líneas 404-425), que construye un `detail` v1 a mano, SHALL quedar verde
    sin editarse.

- **R11**: WHILE se evalúa un lote de N posiciones sin que ninguna dispare
  `enter` ni `exit`, THE SYSTEM SHALL llamar a `store.updateGeofenceState()`
  **como máximo una vez por geocerca y por mensaje** (el plegado del lote
  ocurre en memoria; solo el estado final se persiste), no una vez por
  posición. IF alguna posición dispara evento THEN las escrituras de
  `handleExit()`/`handleEnter()` SHALL conservar el orden a prueba de caídas
  de #12 D3 (alerta primero, estado después) y no SHALL duplicarse con una
  escritura final redundante del mismo valor.

  - Test: `src/workers/alerts-engine/alerts-engine-consumer.service.spec.ts`,
    describe nuevo `R11 (geofence-eval-full-batch #30): un solo
    updateGeofenceState por geocerca y mensaje`, con un lote de 100
    posiciones todas dentro de la geocerca y assertion
    `expect(store.updateGeofenceState).toHaveBeenCalledTimes(1)` más el
    estado final esperado. Los `it` existentes de `R8`, `R9` y `R10` de #12
    (líneas 450-642) SHALL quedar verdes sin editarse.

## Fuera de alcance

- **Histéresis temporal** (exigir N muestras consecutivas fuera del radio
  antes de emitir `exit`). Sigue siendo espacial (1.1R / 0.9R + `accuracyM <=
  GEOFENCE_EXIT_MAX_ACCURACY_M`). R1 cierra el agujero concreto que hacía
  peligroso subir el muestreo; el resto es otra feature.
- **Cambiar el conteo de eventos del bus**: nada de un evento por posición.
  R5 lo fija como requisito verificable, no como aspiración.
- `normalize()` / `src/pipeline/validate-positions.ts`: quién marca
  `suspect_jump` y con qué umbral (`SUSPECT_JUMP_SPEED_KMH = 60`) no se toca.
- Geocercas poligonales: `evaluate()` sigue aceptando solo `CircleGeometry`.
- `POSITIONS_PER_MESSAGE_MAX`, `POLLER_INTERVAL_MS` y el intervalo del cron
  del alerts-engine: sin cambios.
- Retirar `version: 1` del schema. Se acepta indefinidamente; no hay tarea de
  limpieza programada en esta feature.
- `battery.low`: su `detail` sigue en `version: 1`.
- Infraestructura: la regla de EventBridge filtra por `source` y
  `detail-type` únicamente (`src/aws/provisioning.ts:300-303` e
  `infra/lib/pet-tracker-dev-stack.ts:105-108`), **no** por `detail.version`
  — verificado. No hay que reprovisionar ni redesplegar nada.
- Variables de entorno: ninguna nueva.
- Migraciones de base de datos: ninguna. `alert_events.payload` es
  `Record<string, unknown>` opaco de punta a punta
  (`alert-response.mapper.ts:32`), así que cambiar qué posición guarda no
  rompe ningún consumidor.

## Aprobación

- [X] Aprobado por humano (fecha: 26-08-15) ← gate obligatorio antes de implementar

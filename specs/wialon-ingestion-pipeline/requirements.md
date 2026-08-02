---
feature: "wialon-ingestion-pipeline"
status: approved   # draft | spec_ready (pendiente gate humano) | approved
tags: [harness, spec]
---

# Requisitos — [[wialon-ingestion-pipeline]]

> Notación EARS. Cada requisito tiene id único R<n>, inmutable una vez aprobado.
> Ver [[design]] para las decisiones técnicas y [[../../docs/architecture|architecture]]
> para las reglas de arquitectura que la implementación debe respetar.
>
> Fuente: `feature_list.json` id 8 (description + acceptance_criteria),
> `plans/005-collar-wialon-ingesta.md` §Pasos 1/3/4 (§Paso 2 lo hizo #7;
> §Pasos 5-6 son #9 y móvil), `progress/explore_wialon-ingestion-pipeline.md`,
> `docs/architecture.md` §Adaptación local (cron `@nestjs/schedule` + consumidor
> SQS en proceso sustituyen Lambda+Scheduler), `docs/data-model.md` §DynamoDB.
>
> Depende de: `localstack-provisioning` (#2, `done`) — `AwsModule` `@Global()`
> con tokens `SQS_CLIENT`/`DYNAMODB_CLIENT`/`EVENTBRIDGE_CLIENT` y las
> constantes de recursos de `src/aws/constants.ts` (`QUEUE_POSITIONS_RAW`,
> `TABLE_POSITIONS`, `EVENT_BUS_NAME`, `SQS_MAX_RECEIVE_COUNT`…) que esta
> feature **importa, nunca re-teclea**; `devices-claim` (#7, `done`) —
> `devices.ingest_watermark/battery_pct/connectivity/last_message_at`,
> `pet_devices` con fila activa, seed `SIMULATED_DEVICES` (`wialonUnitId`
> `'900001'..'900003'`) y `CLAIM_WATERMARK_LOOKBACK_MINUTES = 10`;
> `pets-crud-permissions` (#5, `done`) — `pets.last_position` jsonb y
> `pets.last_communication_at` ya existen. **Cero migraciones nuevas.**
>
> Alcance ya fijado (no reabrir): la integración Wialon real está **diferida**
> — `SIM_MODE` con `FakeWialonClient` determinista es el camino local;
> `WialonHttpClient` se implementa y cablea tras el puerto, pero conectar de
> verdad contra `hst-api.wialon.com` NO es parte de esta feature (queda como
> smoke test futuro cuando haya token real). Poller como cron local, no Lambda.

## Requisitos funcionales

### Puerto y clientes Wialon (`src/integrations/wialon/`)

- **R1**: WHEN la aplicación arranca con `SIM_MODE` distinto de `false`, **o**
  con `WIALON_TOKEN` ausente, vacío o igual a `'PENDING'`, THE SYSTEM SHALL
  resolver el token de inyección `WIALON_CLIENT` con `FakeWialonClient`
  (default dev: fake); IF `SIM_MODE=false` **y** `WIALON_TOKEN` tiene un valor
  real THEN THE SYSTEM SHALL resolverlo con `WialonHttpClient`. La selección
  lee config solo vía `ConfigService` y es verificable con un test unitario
  del factory (ambas ramas), sin red.

- **R2**: WHEN se llama `FakeWialonClient.getMessages(unitId, fromTs, toTs)`
  dos veces con la misma semilla (`SIM_SEED`) y el mismo intervalo, THE
  SYSTEM SHALL devolver **exactamente** la misma lista de posiciones (misma
  longitud, mismos valores) — cada posición es función pura de `(seed,
  unitId, slot)` con un punto por cada slot de 30 s del intervalo, sin estado
  mutable acumulado entre llamadas ni `Math.random`. WHEN se llama
  `listUnits()`, THE SYSTEM SHALL devolver las unidades cuyos `unitId`
  coinciden con los `wialonUnitId` de `SIMULATED_DEVICES` del seed de #7
  (`'900001'..'900003'`, importados, no re-tecleados).

- **R3**: WHEN el fake genera un intervalo suficientemente largo (≥ ~100
  slots), THE SYSTEM SHALL producir un paseo verificable por test: arranque
  en `SIM_HOME_LAT`/`SIM_HOME_LNG` (default CDMX 19.4326, -99.1332),
  velocidades implícitas entre consecutivos ≤ 8 km/h salvo los saltos
  inyectados, ruido de posición del orden de ~10 m, **al menos un duplicado
  exacto** (mismo `ts` y coordenadas) y **al menos un salto absurdo** cuya
  velocidad implícita supera los 60 km/h del umbral `suspect_jump`, y
  `batteryPct` monótonamente no creciente a razón de ~1 % por cada 30 min
  simulados.

- **R4**: WHEN `WialonHttpClient` procesa una respuesta de la API de Wialon
  (fixture JSON, HTTP mockeado — sin red en tests), THE SYSTEM SHALL mapear
  `pos.y→lat`, `pos.x→lng`, `pos.s→speedKmh`, `pos.c→course`, `pos.sc→sats`
  y batería desde `params` si existe, produciendo `RawPosition[]`; su flujo
  implementa login por token en cada ejecución (`svc=token/login` → `sid`),
  `svc=core/search_items` (`itemsType: 'avl_unit'`) y
  `svc=messages/load_interval` (`{itemId, timeFrom, timeTo, flags: 1,
  flagsMask: 65281, loadCount: 500}`). IF la respuesta es `{error: N}` THEN
  THE SYSTEM SHALL lanzar un error de dominio tipado `WialonApiError` con el
  código `N` — nunca un error crudo de HTTP/SDK hacia el llamador.

### Pipeline puro (`src/pipeline/`, sin I/O)

- **R5**: WHEN se llama `normalize(raw: RawPosition[])`, THE SYSTEM SHALL
  devolver `{accepted: ProcessedPosition[], discarded: DiscardedStat[]}`
  donde: posiciones con lat/lng fuera de rango o exactamente `(0,0)` se
  descartan; posiciones sin `ts` se descartan; duplicados exactos por
  `device_ts` se descartan (queda la primera); cada descarte registra su
  razón en `discarded`; y `accepted` queda en orden cronológico ascendente.
  `normalize` SHALL ser función pura: sin imports de NestJS/SDK/ORM, sin
  reloj ni red (verificable por inspección de imports + tests unitarios).

- **R6**: WHEN dos posiciones aceptadas consecutivas implican una velocidad
  (haversine de `pipeline/geo.ts` / Δt) mayor a 60 km/h, THE SYSTEM SHALL
  marcar la posterior con el flag `'suspect_jump'` **sin descartarla**; WHEN
  una posición trae `accuracyM > 100` **o** `sats < 4`, THE SYSTEM SHALL
  marcarla con `'low_accuracy'` (tampoco se descarta). Los tres umbrales
  (60, 100, 4) y el de batería baja (20, R17) SHALL vivir como constantes
  nombradas en `pipeline/constants.ts` — #10/#11/#12 las importarán de ahí;
  cero números mágicos en poller/consumer.

- **R7**: WHEN se ejecuta la suite del pipeline con el fixture
  `pipeline/__fixtures__/walk.json` (~200 puntos generados con el fake, R3),
  THE SYSTEM SHALL: descartar el `(0,0)` y el duplicado presentes en el
  fixture, marcar el salto como `suspect_jump`, conservar el orden
  cronológico, y pasar además los casos borde: lista vacía → `{accepted: [],
  discarded: []}`, un solo punto → aceptado sin flags de velocidad, todos
  inválidos → `accepted` vacío con `discarded` completo.

### Poller (`src/workers/`)

- **R8**: WHILE `POLLER_ENABLED=true` **y** `NODE_ENV != 'test'`, THE SYSTEM
  SHALL ejecutar el ciclo del poller cada 1 minuto vía `@nestjs/schedule`;
  IF `POLLER_ENABLED` es `false` o está ausente, o `NODE_ENV = 'test'`, THEN
  THE SYSTEM SHALL NOT agendar ningún cron ni consumidor (los e2e existentes
  de #5/#7 instancian `AppModule` completo y no deben arrancar workers). El
  ciclo SHALL ser además invocable directamente como
  `PollerService.runOnce()` para tests deterministas sin esperas de reloj.

- **R9**: WHEN corre un ciclo del poller, THE SYSTEM SHALL: listar las
  asignaciones activas (`pet_devices.released_at IS NULL` join `devices` con
  `wialon_unit_id` no nulo), y por cada una llamar
  `getMessages(unitId, watermark, now)` vía `WIALON_CLIENT` y publicar las
  posiciones crudas a la cola `QUEUE_POSITIONS_RAW` en mensajes con body
  `{version: 1, deviceId, petId, unitId, positions}` de a lo sumo 100
  posiciones por mensaje. IF `ingest_watermark` es NULL THEN THE SYSTEM
  SHALL usar `now − CLAIM_WATERMARK_LOOKBACK_MINUTES` como inicio del
  intervalo.

- **R10**: WHEN la publicación a SQS de los mensajes de un device se confirma
  y hubo ≥ 1 posición, THE SYSTEM SHALL avanzar `devices.ingest_watermark`
  al `ts` del último mensaje recibido de ese device — **después** de
  publicar, nunca antes. IF no hubo posiciones en el intervalo THEN el
  watermark SHALL NOT cambiar; IF la publicación falla THEN el watermark
  SHALL NOT avanzar (semántica at-least-once: los duplicados resultantes los
  absorbe la idempotencia de R13).

- **R11**: IF `getMessages` o la publicación falla para un device THEN THE
  SYSTEM SHALL loguear estructurado y continuar con los demás devices del
  ciclo; IF LocalStack/SQS está caído THEN el proceso NestJS SHALL NOT
  caerse ni quedar en loop de stack traces — un log de error por tick y
  reintento en el siguiente. WHILE una ejecución del ciclo sigue en curso,
  THE SYSTEM SHALL NOT iniciar la siguiente (guard de solape en memoria —
  proceso único local).

### Consumidor (`src/workers/`)

- **R12**: WHILE el consumidor está habilitado (mismo gating de R8), THE
  SYSTEM SHALL recibir mensajes de `QUEUE_POSITIONS_RAW` con long-polling
  (`ReceiveMessage`, batch ≤ 10) y validar el body contra un schema zod del
  contrato de R9. WHEN un mensaje válido se procesa completo, THE SYSTEM
  SHALL borrarlo de la cola; IF un mensaje del lote falla THEN los demás
  mensajes del lote SHALL procesarse y borrarse igualmente (el fallido no
  envenena el lote — equivalente local de `reportBatchItemFailures`). El
  drenado SHALL ser invocable como `PositionsConsumerService.drainOnce()`
  para tests.

- **R13**: WHEN el consumidor procesa un mensaje válido, THE SYSTEM SHALL
  pasar `positions` por `normalize()` y escribir cada posición aceptada en
  la tabla DynamoDB `TABLE_POSITIONS` con `pk = 'PET#<petId>'`,
  `sk = device_ts` (epoch ms, number), los atributos de `docs/data-model.md`
  (`lat, lng, speed_kmh, course, altitude, sats, accuracy_m, battery_pct,
  device_ts, received_ts, processed_ts, flags`) y `expires_at =
  floor(device_ts/1000) + 90*86400` (segundos, TTL). Antes de escribir en
  lotes, THE SYSTEM SHALL dedupear por `sk` dentro del lote (dos items con
  el mismo `sk` en un `BatchWrite` es `ValidationException`). WHEN el mismo
  mensaje se reprocesa (redelivery), THE SYSTEM SHALL producir exactamente
  los mismos items (PutItem por `sk` sobrescribe — idempotente, verificable
  con doble procesamiento y conteo de items).

- **R14**: WHEN un mensaje con ≥ 1 posición aceptada se procesa y la
  asignación `(deviceId, petId)` sigue activa, THE SYSTEM SHALL actualizar
  `devices` (`battery_pct`, `connectivity = 'online'`, `last_message_at`) y
  `pets.last_position = {lat, lng, ts, accuracy, battery}` +
  `pets.last_communication_at` con la última posición aceptada — **solo si**
  el `ts` entrante es más reciente que el cacheado (`last_message_at` /
  `last_position.ts`); IF llega un mensaje viejo (redelivery o fuera de
  orden) THEN la caché SHALL NOT retroceder.

- **R15**: IF la asignación `(deviceId, petId)` del mensaje ya no está activa
  (release posterior al encolado) THEN THE SYSTEM SHALL escribir igualmente
  los items en DynamoDB bajo `PET#<petId>` (histórico legítimo del periodo
  de asignación) pero SHALL NOT actualizar `devices` ni
  `pets.last_position`, ni emitir eventos al bus.

- **R16**: WHEN un mensaje con ≥ 1 posición aceptada se procesa con
  asignación activa, THE SYSTEM SHALL emitir al bus `EVENT_BUS_NAME`
  (`pet-tracker`) exactamente **un** evento `source: 'pet-tracker'`,
  `detailType: 'position.updated'`, con detail `{version: 1, petId,
  deviceId, position, batteryPct}` donde `position` es la última posición
  aceptada serializada como `{lat, lng, ts, speedKmh, course, sats,
  accuracyM, batteryPct, flags}` — un evento por mensaje SQS, no por
  posición. Este contrato lo consumen los planes 006/007/010: SHALL quedar
  congelado en [[design]] y cualquier cambio futuro incrementa
  `detail.version`.

- **R17**: IF la batería entrante es `< 20` **y** el `devices.battery_pct`
  previo era NULL o `>= 20` (cruce de umbral descendente) THEN THE SYSTEM
  SHALL emitir además un evento `detailType: 'battery.low'` con detail
  `{version: 1, petId, deviceId, batteryPct}`; WHILE la batería se mantiene
  `< 20` en mensajes subsecuentes, THE SYSTEM SHALL NOT re-emitirlo
  (disparo por flanco — D8; #12 cierra el evento con batería ≥ 30,
  histéresis documentada en [[design]]).

- **R18**: IF el body de un mensaje no valida contra el schema zod (campos
  ausentes, tipos incorrectos, JSON inválido) THEN THE SYSTEM SHALL loguear
  estructurado y NOT borrarlo de la cola, de modo que tras
  `SQS_MAX_RECEIVE_COUNT` (3) recepciones la RedrivePolicy ya provisionada
  lo mueva a `QUEUE_POSITIONS_RAW_DLQ` — sin escritura manual a la DLQ.
  WHILE el sistema opera normalmente con el fake, THE SYSTEM SHALL mantener
  `ApproximateNumberOfMessages` de la DLQ en 0 (verificable en el e2e de
  R19 y en la evidencia manual).

### Cadena end-to-end

- **R19**: WHEN (e2e Jest contra Postgres + LocalStack) un owner reclama
  `ACT-001` con `SIM_MODE=true` y se invoca `PollerService.runOnce()`
  seguido de `PositionsConsumerService.drainOnce()`, THE SYSTEM SHALL dejar:
  (a) ≥ 1 item consultable con Query `pk = 'PET#<petId>'` en la tabla
  `positions`; (b) `pets.last_position` no nulo con `ts` dentro del
  intervalo poleado; (c) la DLQ en 0. La corrida con el cron real (~2 min de
  reloj, criterio de aceptación literal) SHALL documentarse como evidencia
  manual en `progress/impl_wialon-ingestion-pipeline.md` (patrón de
  evidencia de #7), no como test automatizado con sleeps.

## Decisiones propuestas (validar en el gate)

> Resuelven las 14 decisiones abiertas (a)-(n) de
> `progress/explore_wialon-ingestion-pipeline.md`. Cada una propone UNA
> opción; el humano confirma o corrige al aprobar.

- **D1 (a) — `docs/wialon-module.md` no existe pese a que los planes
  005/006/007 lo citan**: **crearlo como entregable de esta feature** (en el
  branch, junto al código): doc corto con la interfaz `WialonClient`, el
  mapeo de la API real, el simulador, el watermark y los umbrales —
  condensado de plan 005 §Estado actual/§Paso 1 más lo que esta spec
  congela. Absorberlo solo en la spec dejaría el drift vivo para #10-#12.
- **D2 (b) — Semilla y PRNG del fake**: env `SIM_SEED` (entero, default 1) +
  PRNG propio stateless estilo mulberry32 (~10 líneas, sin dependencia
  nueva); posición = función pura de `(seed, unitId, slot de 30 s)` — un
  reinicio del proceso o dos llamadas solapadas producen lo mismo (R2).
- **D3 (c) — Mensaje SQS y malformados**: body versionado
  `{version: 1, ...}` (R9); malformado → no-borrar y dejar que la
  RedrivePolicy existente (3 recepciones) lo lleve a la DLQ (R18). Usa la
  infra ya provisionada, cero escritura manual a la DLQ; el retraso de ~3
  ciclos es irrelevante en local.
- **D4 (d) — Estado del poller**: watermark avanza tras publicar y solo si
  hubo mensajes (R10); solape de ciclos con flag en memoria (R11) — lock en
  DB sería over-engineering en proceso único; error de un device no aborta
  el ciclo de los demás (R11).
- **D5 (e) — Consumo SQS sin Lambda**: loop propio con `ReceiveMessage`
  long-polling + delete explícito por mensaje (R12), agendado con el mismo
  `@nestjs/schedule` que ya entra por el poller. Sin `@ssut/nestjs-sqs`:
  una dependencia menos y control total del ciclo (primera vez que el repo
  consume SQS — este patrón lo heredan #12/#13).
- **D6 (f) — Idempotencia fina**: dedupe por `sk` intra-batch antes del
  `BatchWrite` (R13) y updates de caché condicionados a "ts entrante más
  reciente" (R14) — tolera redelivery y llegadas fuera de orden.
- **D7 (g) — Mensaje encolado de una asignación ya liberada**: escribir el
  histórico en DynamoDB, no tocar caché ni emitir eventos (R15) — el dato
  era del periodo de asignación; la caché y el bus solo reflejan collares
  activos.
- **D8 (h) — `battery.low` por flanco, no continuo**: emitir solo en el
  cruce descendente del umbral 20, comparando con `devices.battery_pct`
  previo (R17). Continuo spamearía el bus un evento por mensaje durante
  horas y hoy nadie dedupea (#12 aún no existe). Contra: un redelivery
  antes del update de caché puede re-emitir una vez — aceptable. Histéresis
  20 (dispara) / 30 (cierra, #12) documentada en design.
- **D9 (i) — Contrato de eventos congelado**: shapes exactos de
  `position.updated` (R16) y `battery.low` (R17) con `detail.version: 1` —
  API pública inter-features (006/007/010).
- **D10 (j) — Estrategia e2e**: workers como servicios invocables
  (`runOnce()`/`drainOnce()`) + e2e determinista sin esperas (R19), gating
  `POLLER_ENABLED && NODE_ENV != 'test'` para no contaminar los e2e de
  #5/#7 (R8), y la corrida real de ~2 min como evidencia manual en el
  reporte del implementer.
- **D11 (k) — Env vars nuevas (lista definitiva)**: `SIM_MODE` (default
  fake), `SIM_SEED` (default 1), `SIM_HOME_LAT` / `SIM_HOME_LNG` (default
  19.4326 / -99.1332), `WIALON_TOKEN` (default `PENDING` → fake),
  `WIALON_BASE_URL` (default `https://hst-api.wialon.com/wialon/ajax.html`),
  `POLLER_ENABLED` (default false; `.env.example` la lleva en `true` para
  que la cadena local funcione out-of-the-box). Todas vía `ConfigService`;
  entran a la tabla de `docs/conventions.md` y a `.env.example` en el mismo
  commit que las introduce. El intervalo del poller NO es env: constante
  nombrada (los tests invocan `runOnce()`, no necesitan acelerar el reloj).
- **D12 (l) — Resiliencia con LocalStack caído**: log estructurado amable
  (precedente `describeProvisioningError`) y reintento al siguiente tick;
  jamás tumbar el proceso (R11).
- **D13 (m) — Dependencias nuevas**: `@nestjs/schedule` (cron) y
  `@aws-sdk/lib-dynamodb` (DocumentClient — evita marshalling manual sobre
  el client low-level ya instalado). El PRNG es propio (D2): ninguna
  tercera dependencia.
- **D14 (n) — Forma del módulo y puerto Postgres**: módulo nuevo
  `IngestionModule` en `src/workers/` registrado en `app.module.ts`, con un
  **puerto propio** `IngestionStore` (listar asignaciones activas, avanzar
  watermark, actualizar telemetría de device, actualizar
  `pets.last_position`) + implementación Drizzle — NO se extienden
  `DeviceRepository`/`PetRepository`: sus contratos están cerrados por
  specs aprobadas (#5/#7) y las necesidades del worker son de otro
  consumidor. Detalle en [[design]].

## Fuera de alcance

- **Conexión real a Wialon**: `WialonHttpClient` queda implementado y
  testeado contra fixtures (R4), pero ningún test ni flujo de esta feature
  toca `hst-api.wialon.com`. El smoke test con token real es trabajo futuro
  (decisión ya tomada, registrada en STATUS/PR #12).
- **Endpoints de lectura** (`GET .../positions/last`, historial con cursor):
  feature #9 `positions-api`.
- **Paseos/KPIs** (#10), **geocercas** (#11) y **consumo de los eventos del
  bus** (#12/#13): aquí solo se emiten; el bus tolera eventos sin reglas.
- **Auditoría por posición**: el pipeline NO escribe en `audit_log` —
  ~2 880 posiciones/día/mascota serían ruido puro; las acciones humanas
  (claim/release) ya auditan en #7.
- **`connectivity = 'offline'` / detección de silencio**: nadie la marca en
  esta feature; la frescura la deriva #9 con `staleSeconds`.
- **Webhook push desde Wialon, batcheo de sesión para flotas**: post-MVP
  (plan 005 §Notas); el poller 1 min con 3 devices simulados es suficiente.
- **Migraciones de schema**: ninguna — todas las columnas y recursos
  LocalStack ya existen (#2/#5/#7). Si la implementación descubre que falta
  una columna: STOP y reporte (condición del plan 005).
- **Empaquetado Lambda real**: la lógica pura en `src/pipeline/` deja el
  porte como empaquetado futuro; no se crea infra CDK.

## Aprobación

- [X] Aprobado por humano (fecha: 2026-08-02) ← gate obligatorio antes de implementar

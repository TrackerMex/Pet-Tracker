---
feature: "alerts-engine"
status: approved     # draft | approved
tags: [harness, spec]
---

# Requisitos — [[alerts-engine]]

> Notación EARS. Cada requisito tiene id único R<n>, inmutable una vez aprobado.
> Ver [[design]] para las decisiones técnicas y [[../../docs/architecture|architecture]]
> para las reglas de arquitectura que la implementación debe respetar.
>
> Fuente: `feature_list.json` id 12 (description + acceptance_criteria),
> `docs/data-model.md` (fila `alert_events`), `plan 007` paso 3
> (`plans/007-geocercas-alertas-push.md`).
>
> Depende de (todo `done`, se reutiliza tal cual, **no se redefine**):
> - `geofences-crud` (#11): `src/pipeline/geofence-eval.ts` — `isInside()` /
>   `evaluate()` (máquina de estados con histéresis, ya congelada por R16-R25
>   de esa spec) — esta feature es su **primer y único consumidor real**
>   (comentario explícito en el header del archivo). Tabla `geofences` con la
>   columna `geofence_state` jsonb `{state, updatedAt}` (default
>   `{unknown, null}`) — esta feature es quien por fin escribe un valor
>   distinto del default. `GeofenceRepository` (#11) se deja **intacto**: su
>   diseño ya descartó explícitamente añadirle un método `updateState` para
>   este consumidor — ver D2.
> - `wialon-ingestion-pipeline` (#8): contrato de bus congelado
>   (`src/workers/ingestion.constants.ts`) — `EVENT_SOURCE = 'pet-tracker'`,
>   `DETAIL_TYPE_POSITION_UPDATED = 'position.updated'` (detail
>   `{version:1, petId, deviceId, position:{lat,lng,ts,speedKmh,course,sats,
>   accuracyM,batteryPct,flags}, batteryPct}`), `DETAIL_TYPE_BATTERY_LOW =
>   'battery.low'` (detail `{version:1, petId, deviceId, batteryPct}`,
>   disparado solo en el cruce descendente del umbral 20). Patrón de worker
>   SQS (`PositionsConsumerService`: `drainOnce()`/`consumeMessage()`,
>   parseo zod, no-delete en fallo, redelivery segura por escritura
>   idempotente) — esta feature replica el mismo patrón para su propia cola.
> - `localstack-provisioning` (#2): `src/aws/` (clientes SDK v3 + tokens de
>   inyección), `src/aws/provisioning.ts` (funciones idempotentes de
>   aprovisionamiento, reutilizadas — ver D2), bus EventBridge `pet-tracker`
>   ya creado.
>
> **Endpoints**: ninguno. Esta feature es 100% un worker de backend sin
> superficie HTTP — `GET /v1/alerts` y `POST /v1/alerts/:id/ack` son
> `alerts-center-notifier` (#13).
>
> Qué NO entrega esta feature: envío real de notificaciones push (solo
> encola en SQS `notifications`; consumirla y llamar a Expo es #13); tipos de
> geocerca más allá de `safe_circle` (siguen sin existir, #11); `type` de
> alerta más allá de `geofence_exit`/`battery_low` (`device_offline`/
> `position_stale` quedan como valores reservados para una feature futura,
> igual que hizo #11 con `geofences.type`); centro de alertas o `ack` (#13).

## Requisitos funcionales

### Persistencia (schema y migración)

- **R1**: WHEN se ejecutan las migraciones Drizzle sobre una base al día, THE
  SYSTEM SHALL crear la tabla `alert_events` conforme a
  `docs/data-model.md`, con las clarificaciones de **D1**/**D4**: `id` uuid PK
  (UUIDv7 generado en app), `pet_id` uuid FK → `pets.id` ON DELETE CASCADE NOT
  NULL, `geofence_id` uuid FK → `geofences.id` ON DELETE SET NULL NULL
  (**D1**), `type` varchar NOT NULL con CHECK en
  `('geofence_exit', 'battery_low')` — únicamente lo que esta feature produce
  (mismo criterio que `geofences.type` de #11; se amplía con `ALTER TABLE`
  cuando `device_offline`/`position_stale` tengan un productor real), `status`
  varchar NOT NULL DEFAULT `'open'` con CHECK en
  `('open', 'acked', 'closed')` (las tres, tal como las fija
  `docs/data-model.md` — `'acked'` no lo escribe nunca esta feature, lo hará
  `alerts-center-notifier` #13, pero el CHECK ya las admite todas sin
  necesidad de una migración adicional cuando #13 llegue), `payload` jsonb NOT
  NULL, `opened_at` timestamptz NOT NULL, `acked_at` timestamptz NULL,
  `closed_at` timestamptz NULL. Índices: btree sobre `pet_id` (regla "toda FK
  lleva índice"), btree sobre `geofence_id`, y el índice único parcial
  anti-spam de R2. La migración generada SHALL NOT crear ni modificar ninguna
  otra tabla salvo lo descrito en R14. Verificable inspeccionando el SQL de
  la migración nueva en `src/db/migrations/`.

- **R2**: WHEN se crea la tabla `alert_events` (R1), THE SYSTEM SHALL incluir
  un índice único parcial sobre
  `(pet_id, type, coalesce(geofence_id, '00000000-0000-0000-0000-000000000000'::uuid))
  WHERE status = 'open'` (**D4**: mismo valor que `uuid_nil()` sin depender de
  la extensión `uuid-ossp`, que este proyecto no tiene habilitada) — brief
  §12, criterio de aceptación literal "un open por pet+type+geofence".
  Verificable: dos `INSERT` con los mismos `(pet_id, type, geofence_id)` y
  `status = 'open'` → el segundo SHALL fallar con `23505`; un tercer `INSERT`
  con el mismo `(pet_id, type, geofence_id)` pero `status = 'closed'` en las
  dos filas previas SHALL tener éxito.

### Infraestructura AWS (cola y regla EventBridge)

- **R3**: WHEN se ejecuta el aprovisionamiento de LocalStack
  (`pnpm run provision:local`, extendiendo `provisionAllResources()` de #2),
  THE SYSTEM SHALL crear de forma idempotente una cola SQS `geofence-events`
  con su DLQ `geofence-events-dlq` (DLQ primero, mismo orden que R9 de
  `localstack-provisioning`) y `RedrivePolicy` con el mismo
  `SQS_MAX_RECEIVE_COUNT` (3) que las colas existentes — mismo criterio de
  idempotencia que `ensureQueueWithDlq()` (crear y capturar
  `QueueNameExists`), reutilizada tal cual (**D2**). Verificable: correr el
  aprovisionamiento dos veces seguidas no duplica ni lanza una excepción no
  controlada.

- **R4**: WHEN se ejecuta el aprovisionamiento de LocalStack, THE SYSTEM
  SHALL crear (o actualizar sin error) una regla EventBridge sobre el bus
  `pet-tracker` con `EventPattern = {"source": ["pet-tracker"],
  "detail-type": ["position.updated", "battery.low"]}` y un único target: la
  cola `geofence-events` (sin `RawMessageDelivery` — el mensaje SQS conserva
  el sobre completo de EventBridge, incluida `detail-type`, **D2**).
  `PutRuleCommand`/`PutTargetsCommand` son upsert nativos (a diferencia de
  `CreateQueueCommand`): no requieren capturar una excepción de duplicado
  para ser idempotentes. Verificable: correr el aprovisionamiento dos veces
  seguidas dos veces no falla y deja exactamente una regla con un target.

### Consumo — recepción y despacho

- **R5**: WHEN el worker recibe uno o más mensajes de la cola
  `geofence-events` (mismo patrón `ReceiveMessageCommand`/`drainOnce()` que
  `PositionsConsumerService`, long-polling corto, batch máximo 10), THE
  SYSTEM SHALL parsear el `Body` de cada mensaje como el sobre EventBridge
  (`{"detail-type": string, detail: object, ...}`) con un schema zod. IF el
  `Body` no es JSON válido o no cumple el schema THEN THE SYSTEM SHALL NOT
  borrar el mensaje (queda para redelivery; tras `SQS_MAX_RECEIVE_COUNT`
  intentos la `RedrivePolicy` ya provisionada lo lleva a
  `geofence-events-dlq`, R3) y SHALL registrar un log de error — mismo
  criterio que R18 de `wialon-ingestion-pipeline`, jamás se escribe a la DLQ
  a mano.

- **R6**: WHEN un mensaje parsea correctamente (R5), THE SYSTEM SHALL
  despachar por `detail-type`: `position.updated` → evaluación de geocercas
  (R7-R11); `battery.low` → apertura de alerta de batería (R12). IF
  `detail-type` no es ninguno de los dos (rama defensiva: la regla de R4 ya
  filtra en origen, no se espera alcanzarla en producción) THEN THE SYSTEM
  SHALL registrar un log y borrar el mensaje sin reintentar.

### Evaluación de geocercas (`position.updated`)

- **R7**: WHEN el worker procesa un mensaje `position.updated` de una
  mascota con al menos una geocerca activa (`geofences.active = true`), THE
  SYSTEM SHALL, para cada una de esas geocercas, invocar
  `evaluate(previousState, geometry, position, nowMs)` de
  `src/pipeline/geofence-eval.ts` (**sin modificarla**, ver R19) con
  `previousState` = el `geofence_state` persistido de esa fila, `geometry` =
  `{shape:'circle', centerLat, centerLng, radiusM}` de esa fila, `position` =
  el objeto `position` del detail (con sus `flags`), y `nowMs` = `position.ts`
  del evento (**D3**: la marca de tiempo del dato, no el reloj del worker).
  IF `position.ts` no es estrictamente mayor que el `updatedAt` ya persistido
  en `geofence_state` de esa geocerca (y `updatedAt` no es `null`) THEN THE
  SYSTEM SHALL omitir esa geocerca por completo — sin llamar a `evaluate()`,
  sin escribir nada — mismo criterio de guarda "solo si es más reciente" que
  R14 de `wialon-ingestion-pipeline` (protege contra desorden de entrega de
  SQS y contra redelivery exacta, **D3**).

- **R8**: WHEN `evaluate()` (R7) devuelve `event: 'exit'` para una geocerca,
  THE SYSTEM SHALL, en este orden (**D3**, orden a prueba de caídas — ver
  design.md): (1) intentar `INSERT` en `alert_events` con
  `type = 'geofence_exit'`, `geofence_id` = id de esa geocerca, `status =
  'open'`, `payload` con la posición que disparó la salida y el nombre de la
  geocerca, `opened_at = new Date(position.ts)`; (2) IF el `INSERT` tiene
  éxito THEN encolar en SQS `notifications` un mensaje `kind: 'alert'` (R15)
  y SOLO ENTONCES (3) persistir el nuevo `geofence_state` devuelto por
  `evaluate()` en la fila de la geocerca. IF el `INSERT` del paso (1) falla
  por violación del índice único de R2 (`23505`, ya existe un `open` para
  `(pet_id, type, geofence_id)`) THEN THE SYSTEM SHALL NOT encolar ninguna
  notificación (regla anti-spam del brief §12, criterio de aceptación
  literal) pero SHALL continuar al paso (3) y persistir igualmente el nuevo
  `geofence_state` (la mascota está físicamente fuera, con independencia de
  si se abrió una fila nueva).

- **R9**: WHEN `evaluate()` (R7) devuelve `event: 'enter'` para una
  geocerca, THE SYSTEM SHALL intentar un `UPDATE` condicional sobre
  `alert_events` (`status = 'closed'`, `closed_at = new Date(position.ts)`)
  filtrando por `pet_id`, `geofence_id`, `type = 'geofence_exit'` y
  `status = 'open'`, y luego persistir el nuevo `geofence_state`. IF el
  `UPDATE` afecta exactamente una fila THEN THE SYSTEM SHALL encolar en SQS
  `notifications` un mensaje `kind: 'alert_resolved'` (R15). IF el `UPDATE`
  afecta cero filas (no había ningún `open` que cerrar — ya cerrado por un
  procesamiento previo, o nunca se abrió por el anti-spam de R8) THEN THE
  SYSTEM SHALL NOT encolar ninguna notificación — mismo criterio de "escribir
  primero, notificar solo si tomó efecto" que R8.

- **R10**: WHEN `evaluate()` (R7) devuelve `event: null` (incluye la primera
  evaluación desde `unknown`, que puede cambiar el `state` sin emitir
  evento, y el corto-circuito de `low_accuracy`, que devuelve el mismo
  `previous` sin cambios), THE SYSTEM SHALL persistir el `geofence_state`
  devuelto (aunque sea idéntico al anterior) y SHALL NOT escribir en
  `alert_events` ni encolar ninguna notificación.

- **R11**: WHEN el worker procesa un mensaje `position.updated` cuyo
  `batteryPct` es un número `>= BATTERY_RECOVERY_THRESHOLD_PCT` (30, nueva
  constante en `src/pipeline/constants.ts`, **D3**), THE SYSTEM SHALL
  intentar un `UPDATE` condicional sobre `alert_events` (`status = 'closed'`,
  `closed_at = new Date(position.ts)`) filtrando por `pet_id`,
  `type = 'battery_low'`, `geofence_id IS NULL` y `status = 'open'` — mismo
  mecanismo que R9, e independiente del bucle de geocercas de R7-R10 (una
  mascota sin geocercas activas igual puede cerrar su alerta de batería). IF
  el `UPDATE` afecta una fila THEN THE SYSTEM SHALL encolar `kind:
  'alert_resolved'` (R15). IF `batteryPct` es `< 30`, ausente, o el `UPDATE`
  afecta cero filas, THE SYSTEM SHALL NOT escribir ni notificar nada por este
  concepto — criterio de aceptación literal "se cierra con batería ≥30".

### Consumo — `battery.low`

- **R12**: WHEN el worker procesa un mensaje `battery.low`, THE SYSTEM SHALL
  intentar un `INSERT` en `alert_events` con `type = 'battery_low'`,
  `geofence_id = NULL`, `status = 'open'`, `payload = {batteryPct}`,
  `opened_at` = instante de procesamiento del worker (`now` inyectado —
  **D3**: `battery.low` no trae una marca de tiempo de dispositivo en su
  detail, a diferencia de `position.updated`). IF el `INSERT` tiene éxito
  THEN THE SYSTEM SHALL encolar `kind: 'alert'` (R15). IF falla por el
  índice único de R2 (ya hay un `battery_low` `open` para esa mascota) THEN
  THE SYSTEM SHALL NOT encolar nada — mismo criterio anti-spam que R8.

### Anti-spam e idempotencia (escenarios completos, criterios de aceptación literales)

- **R13**: WHEN se procesan consecutivamente, para la misma mascota y
  geocerca, un evento que produce `exit`, un segundo evento que también
  cumple las condiciones de `exit` (histéresis: la mascota sigue fuera), y
  un tercer evento que produce `enter`, THE SYSTEM SHALL dejar exactamente
  una fila en `alert_events` con la secuencia
  `open → (segundo exit: sin nueva fila, sin notificación) → closed` — es
  decir, exactamente 1 fila abierta en su momento y 1 notificación `alert`,
  seguida de exactamente 1 notificación `alert_resolved`, nunca una segunda
  fila `open` para el mismo `(pet_id, type, geofence_id)`. Verificable con
  tres llamadas consecutivas al procesamiento del worker (sin depender de
  reloj real) — criterio de aceptación literal "exit/exit/enter → exactamente
  1 open, 1 resolved".

- **R14**: WHEN un mensaje ya procesado con éxito (R8/R9/R11/R12 completados,
  incluida la notificación si correspondía) se redelivera con el mismo
  contenido — incluido el caso borde de que el worker se haya caído después
  de escribir en `alert_events` pero antes de borrar el mensaje de
  `geofence-events` — THE SYSTEM SHALL, al reprocesarlo, NOT crear una
  segunda fila en `alert_events`, NOT alterar una fila ya `closed`, y NOT
  encolar una segunda notificación para el mismo efecto — mismo mecanismo
  de R2/R8/R9 (el índice único y el `UPDATE` condicional son inherentemente
  idempotentes) más la guarda de "recepción más reciente" de R7. Criterio de
  aceptación literal "worker idempotente ante redelivery del mismo evento".

### Mensaje a SQS `notifications`

- **R15**: WHEN el worker encola un mensaje en SQS `notifications` (R8, R9,
  R11, R12), THE SYSTEM SHALL usar el shape congelado (**D5**, API pública
  para `alerts-center-notifier` #13): `{version: 1, kind: 'alert' |
  'alert_resolved', alertId: string, petId: string, title: string, body:
  string, data: {petId: string, alertId: string}}`, donde `alertId` es el id
  de la fila de `alert_events` escrita u observada en ese paso, `title`
  incluye el nombre de la mascota (`pets.name`, leído vía `PetRepository`
  existente de #5, reutilizado sin modificar su contrato) y, para
  `geofence_exit`/su resolución, el nombre de la geocerca; para
  `battery_low`/su resolución, el `batteryPct` relevante. Verificable:
  inspeccionar el `Body` del mensaje resultante tras una salida simulada
  (criterio de aceptación literal "mensaje en la cola").

### Resiliencia y scheduling

- **R16**: IF el procesamiento de un mensaje lanza un error no controlado
  (ej. Postgres no alcanzable) THEN THE SYSTEM SHALL NOT borrar ese mensaje
  de `geofence-events` (queda para redelivery vía la `RedrivePolicy` de R3;
  tras `SQS_MAX_RECEIVE_COUNT` intentos cae en `geofence-events-dlq`) y THE
  SYSTEM SHALL registrar un log de error sin interrumpir el procesamiento
  del resto del lote — mismo criterio que R12 de `wialon-ingestion-pipeline`.

- **R17**: WHILE la variable de entorno `ALERTS_ENGINE_ENABLED` es distinta
  de `'true'`, THE SYSTEM SHALL NOT agendar el scheduler del worker de
  alerts-engine. WHILE `NODE_ENV = 'test'`, THE SYSTEM SHALL NOT agendar el
  scheduler independientemente del valor de `ALERTS_ENGINE_ENABLED` — mismo
  patrón exacto que `POLLER_ENABLED`/`ACTIVITY_AGGREGATOR_ENABLED`
  (`docs/conventions.md` §Variables de entorno). Los tests y el e2e invocan
  el método de procesamiento del worker directamente (`drainOnce()` o
  equivalente), nunca esperan al cron — mismo criterio D10 de
  `wialon-ingestion-pipeline`.

- **R18**: WHEN se simula una salida de geocerca (mascota con posición fuera
  de una geocerca activa, vía el simulador `FakeWialonClient` existente de
  #8) y se invoca el ciclo completo del pipeline (poller → consumer de
  positions-raw → worker de `geofence-events` de esta feature) sin depender
  de temporizador real, THE SYSTEM SHALL producir una fila `open` en
  `alert_events` y un mensaje en `notifications` en, como máximo, dos
  invocaciones sucesivas del ciclo — verificable en un test e2e
  determinista (mismo patrón sin-espera-de-reloj que R19 de
  `wialon-ingestion-pipeline`), que es la forma verificable de la condición
  temporal "≤2 min" del criterio de aceptación literal (el límite real de 2
  minutos de reloj es una propiedad del cron de 1 minuto de cada scheduler,
  no algo que un test deba esperar de verdad).

### Pureza y no-regresión

- **R19**: `src/pipeline/geofence-eval.ts` (`isInside`, `evaluate`, sus
  tipos y su suite `geofence-eval.spec.ts`) SHALL NOT modificarse — esta
  feature es su primer consumidor, no su segundo diseñador. `src/pipeline/
  constants.ts` SHALL solo **añadir** `BATTERY_RECOVERY_THRESHOLD_PCT` (30);
  los exports existentes conservan nombre y valor.

- **R20** (no regresión): WHEN se implementa esta feature, THE SYSTEM SHALL
  generar exactamente una migración (R1) y SHALL NOT modificar ningún
  archivo fuera de esta lista: `src/db/schema/alerts.schema.ts` (nuevo) +
  **una línea** de re-export en `src/db/schema/index.ts`; `src/db/
  migrations/0007_*` y su `meta/`; `src/pipeline/constants.ts` (**solo
  añadiendo** `BATTERY_RECOVERY_THRESHOLD_PCT`); `src/aws/constants.ts`
  (**solo añadiendo** `QUEUE_GEOFENCE_EVENTS`, `QUEUE_GEOFENCE_EVENTS_DLQ`,
  `RULE_GEOFENCE_EVENTS`, y reubicando — sin cambiar su valor —
  `EVENT_SOURCE`, `DETAIL_TYPE_POSITION_UPDATED`, `DETAIL_TYPE_BATTERY_LOW`
  desde `src/workers/ingestion.constants.ts`, **D2**); `src/aws/
  provisioning.ts` (**solo añadiendo** la función de R3/R4, sin tocar
  `provisionQueues`/`provisionPositionsTable`/`provisionMediaBucket`/
  `provisionEventBus` existentes más que la línea que las invoca desde
  `provisionAllResources`); `src/workers/ingestion.constants.ts` (**solo
  quitando** las tres constantes reubicadas — sus importadores existentes
  pasan a leerlas de `@/aws/constants`, **D2**); `src/workers/
  positions-consumer.service.ts` (**solo el import** de esas tres
  constantes, sin cambiar su lógica ni su contrato — R16/R17 de
  `wialon-ingestion-pipeline` no cambian de valor); `src/workers/alerts-
  engine/**` (worker nuevo completo: store + consumer + scheduler +
  constants + schema del mensaje SQS); `src/app.module.ts` (**una línea**);
  `test/alerts-engine.e2e-spec.ts` (nuevo); `docs/data-model.md` (afinar la
  fila `alert_events`, marcar `geofence_state` como escrito de verdad);
  `docs/conventions.md` (tabla de variables de entorno: `ALERTS_ENGINE_
  ENABLED`); `.env.example`; `specs/alerts-engine/**`; `progress/**`;
  `feature_list.json`. THE SYSTEM SHALL NOT tocar
  `src/pipeline/geofence-eval.ts` (R19), `src/modules/geofences/**` (ni su
  `GeofenceRepository`, **D2**), `src/modules/pets/**` (solo se **lee** vía
  `PET_REPOSITORY` existente, sin añadir métodos), ni ninguna otra ruta de
  `src/modules/**`. THE SYSTEM SHALL NOT añadir ninguna dependencia nueva a
  `package.json` (todo lo necesario — `@aws-sdk/client-sqs`,
  `@aws-sdk/client-eventbridge`, `zod`, `uuidv7`, `drizzle-orm` — ya está
  instalado). Verificable con `git diff main --name-only` y `./init.sh`
  verde.

## Decisiones abiertas (requieren input humano en el gate)

- **D1 — `geofence_id` ON DELETE**: `docs/data-model.md` no fija la acción
  de borrado de esta FK. Opciones:

  | Opción | Coste | Beneficio |
  |---|---|---|
  | **A — `SET NULL`** | si se borra una geocerca con una alerta `open`, esa fila queda con `geofence_id = NULL`; el índice único de R2 la trata entonces igual que una alerta `battery_low` (mismo "slot" `coalesce(NULL, uuid_nil)`) — colisión posible solo si además hay una `battery_low` open del mismo tipo… pero los `type` son distintos (`geofence_exit` vs `battery_low`), así que no colisiona en la práctica; el caso real (dos `geofence_exit` open de dos geocercas *distintas*, ambas borradas) sí podría colisionar entre sí, escenario no ejercitado por ningún criterio de aceptación | `DELETE /v1/pets/:petId/geofences/:geofenceId` de #11 (ya `done`, hard delete, sin manejo de FK) sigue funcionando sin cambios — no hay que reabrir esa spec cerrada |
  | **B — `RESTRICT`** | borrar una geocerca con cualquier `alert_events` histórico (open o closed) falla con una violación de FK cruda — el use case de `delete-geofence.use-case.ts` (#11, cerrado) no la traduce a un error de dominio, así que el usuario vería un 500 | preserva la trazabilidad completa de qué geocerca generó cada alerta, para siempre |
  | **C — `CASCADE`** | borrar una geocerca borra su historial de alertas | ninguno que compense — pierde auditoría por una acción de configuración |

  **Propuesta: A.** El `payload` jsonb de cada fila ya captura el nombre de
  la geocerca en el momento de la apertura (R15), así que perder la FK tras
  un borrado no pierde la información mostrable; el escenario de colisión
  descrito arriba es un ponytail documentado
  (`ponytail: geofence_id SET NULL en alert_events — colisión rara si se
  borran dos geocercas distintas con alertas open del mismo pet; upgrade
  path: bloquear el DELETE de #11 si hay alert_events open referenciándola,
  cuando deje de ser un escenario improbable`), no una corrección de esta
  spec. **Confirmar A, o pedir B (aceptando que #11 necesitaría un fix
  aparte para no exponer un 500) o C.**

- **D2 — Infraestructura nueva (cola, regla, reubicación de constantes)**:
  ni `docs/data-model.md` ni `localstack-provisioning` (#2, cerrada)
  previeron una quinta cola SQS — su design.md fija explícitamente que los
  nombres de las 4 colas/tabla/bus existentes "coinciden... con el
  `acceptance_criteria`" de esa feature, sin mencionar una futura. Esta spec
  propone: (1) cola `geofence-events` + DLQ `geofence-events-dlq`, mismo
  patrón de aprovisionamiento idempotente que las existentes (R3); (2) una
  regla EventBridge nueva con target SQS, sin `RawMessageDelivery` — el
  worker despacha por `detail-type` del sobre, en vez de inferir el tipo de
  evento por la forma del payload (R4, R6); (3) mover `EVENT_SOURCE`,
  `DETAIL_TYPE_POSITION_UPDATED`, `DETAIL_TYPE_BATTERY_LOW` de
  `src/workers/ingestion.constants.ts` a `src/aws/constants.ts` — hoy
  `aws/provisioning.ts` (capa compartida) necesitaría importarlas desde
  `workers/` (capa de feature) para construir el `EventPattern` de la regla,
  invirtiendo la dirección de dependencia; su valor no cambia (contrato
  R16/R17 de #8 intacto), solo su ubicación — un `git mv` de constantes, no
  una mutación. Alternativa descartada: dejar el aprovisionamiento de la
  cola/regla fuera de `provisionAllResources()` (ej. en el propio módulo de
  esta feature) — se descarta porque rompería el flujo de un solo comando
  (`pnpm run provision:local`) que deja LocalStack listo para toda la app,
  que es justamente la razón de ser de #2. **Confirmar el nombre de cola
  (`geofence-events`), el nombre de regla (mismo string), la ausencia de
  `RawMessageDelivery`, y la reubicación de las 3 constantes — o proponer
  nombres/mecanismo distintos.**

- **D3 — Orden de escritura a prueba de caídas y origen de los timestamps**:
  dos puntos que esta spec fija y que son fáciles de implementar al revés
  sin que ningún test unitario aislado lo detecte:
  - **`alert_events` se escribe ANTES que `geofence_state`** (R8, R9, R11) —
    si el orden fuera el inverso y el proceso cae justo entre ambas
    escrituras, `geofence_state` ya reflejaría el nuevo estado (ej.
    `outside`) pero la fila de `alert_events` nunca se habría creado; en la
    redelivery, `evaluate()` partiría de `previous.state = 'outside'` y, con
    la mascota todavía fuera, R23 de `geofence-eval.ts` ("fuera→fuera no
    re-emite") haría que el evento nunca se re-emita — la apertura se
    perdería para siempre. Escribiendo `alert_events` primero, ese mismo
    escenario de caída deja `geofence_state` sin avanzar, así que la
    redelivery vuelve a evaluar `previous.state = 'inside'`, reintenta el
    `INSERT` (que esta vez choca con `23505` porque la primera escritura sí
    tuvo éxito, R2) y entonces sí completa la persistencia del estado — sin
    fila duplicada ni notificación duplicada (R14).
  - **`nowMs`/`opened_at`/`closed_at` usan `position.ts` (marca de tiempo
    del dato) cuando el evento lo trae** (`position.updated`, R7/R8/R9/R11)
    — mismo criterio que `positions-consumer.service.ts` usa para
    `last_communication_at`. `battery.low` no trae `ts` en su detail
    (contrato congelado de #8): su `opened_at` (R12) usa el reloj inyectado
    del worker (`now: Date`, parámetro con default `new Date()`, nunca
    `Date.now()` sin argumento — mismo criterio D10/testabilidad que el
    resto de los workers).

  **Confirmar ambos criterios, o corregir el orden/origen propuesto.**

- **D4 — Sustituto de `uuid_nil()` sin extensión**: `docs/data-model.md`
  describe el índice de R2 literalmente con `coalesce(geofence_id,
  uuid_nil)`. `uuid_nil()` es una función de la extensión `uuid-ossp`, que
  ninguna migración de este proyecto habilita hoy (`grep` sobre
  `src/db/migrations/*.sql` no encuentra ningún `CREATE EXTENSION`). Esta
  spec propone el literal `'00000000-0000-0000-0000-000000000000'::uuid`
  (el valor exacto, fijo, que `uuid_nil()` devuelve) en vez de habilitar la
  extensión solo para una función. **Confirmar el literal, o pedir habilitar
  `uuid-ossp` y usar `uuid_nil()` tal como lo escribe el doc.**

- **D5 — Contrato del mensaje `notifications`**: el plan 007 describe el
  shape en prosa (`{kind:'alert', alertId, petId, title, body,
  data:{petId, alertId}}`) sin `version`. Esta spec añade `version: 1` —
  mismo criterio de todo contrato de mensaje del proyecto
  (`positionsMessageSchema`, `position.updated`/`battery.low`) — para que
  un cambio de shape futuro se declare como `version: 2` en vez de una
  mutación silenciosa que #13 tendría que detectar por tanteo. El texto
  exacto de `title`/`body` (copy) no es parte del contrato verificable —
  R15 solo exige que `title`/`body` incluyan el nombre de mascota y, según
  el caso, el de la geocerca o el `batteryPct`; el copy final queda a
  criterio del implementer. **Confirmar `version: 1` en el shape, o pedir
  omitirlo tal como está en el plan.**

## Fuera de alcance

- **Notificación push real**: esta feature solo encola en SQS
  `notifications`; consumirla, resolver `push_tokens` y llamar a
  `expo-server-sdk` es `alerts-center-notifier` (#13).
- **`GET /v1/alerts` / `POST /v1/alerts/:id/ack`**: sin superficie HTTP en
  esta feature (#13).
- **Estado `'acked'`**: el CHECK de `status` lo admite (R1) pero ningún
  caso de uso de esta feature lo escribe.
- **Tipos de alerta `device_offline`/`position_stale`**: reservados por el
  plan 007 para una feature futura; el CHECK de `type` de esta migración
  solo acepta `('geofence_exit', 'battery_low')`.
- **Geocercas de tipo `safe_polygon` o histéresis de polígono**: `evaluate()`
  sigue tipada solo para `CircleGeometry` (decisión ya cerrada de #11); esta
  feature no la reabre.
- **`time_away_minutes` de `activity_daily`**: sigue `NULL`; rellenarla
  desde `alert_events` es una tarea explícita de #13 (plan 007 paso 4), no
  de esta feature.
- **Colas FIFO / ordenamiento estricto de eventos**: la guarda de R7 (ts más
  reciente que el `updatedAt` persistido) mitiga desorden de entrega de SQS
  estándar, pero no lo elimina en todos los escenarios (ej. dos eventos con
  el mismo `position.ts` exacto). No se pide FIFO ni se introduce.
- **Reintento garantizado de una notificación perdida por caída entre la
  escritura en base y el `SendMessage` a `notifications`**: ver el orden de
  D3 — si el proceso cae justo después de que la escritura en base tomó
  efecto pero antes (o durante) el envío a `notifications`, la redelivery no
  reintenta ese envío (la escritura en base ya es un no-op en el segundo
  intento). Ventana rara, aceptada
  (`ponytail: sin outbox transaccional para el encolado a notifications —
  upgrade path: patrón outbox o invertir el orden si las notificaciones
  perdidas dejan de ser una rareza local`).
- **Variables de entorno nuevas más allá de `ALERTS_ENGINE_ENABLED`**:
  ninguna otra.
- **Pantallas móviles**: fuera del backend, mismo recorte que features
  anteriores.

## Aprobación

- [X] Aprobado por humano (fecha: 2026-08-07) ← gate obligatorio antes de implementar

Confirmación de **D1-D5** (humano, 2026-08-07):
- **D1**: opción **A — SET NULL** confirmada.
- **D2**: infraestructura nueva confirmada íntegra (cola `geofence-events` +
  DLQ, regla EventBridge sin `RawMessageDelivery`, reubicación de las 3
  constantes a `src/aws/constants.ts`).
- **D3**: orden de escritura (`alert_events` antes que `geofence_state`) y
  origen de timestamps (`position.ts` vs reloj inyectado) confirmados íntegros.
- **D4**: literal `'00000000-0000-0000-0000-000000000000'::uuid` confirmado
  (sin habilitar `uuid-ossp`).
- **D5**: `version: 1` en el mensaje de `notifications` confirmado.

Ninguna decisión cambió un requisito — el documento queda en `approved`.

---
feature: "alerts-center-notifier"
status: draft        # draft | approved
tags: [harness, spec]
---

# Requisitos — [[alerts-center-notifier]]

> Notación EARS. Cada requisito tiene id único R<n>, inmutable una vez aprobado.
> Ver [[design]] para las decisiones técnicas y [[../../docs/architecture|architecture]]
> para las reglas de arquitectura que la implementación debe respetar.
>
> Fuente: `feature_list.json` id 13 (description + los 4 `acceptance_criteria`),
> `plans/007-geocercas-alertas-push.md` paso 4, `docs/data-model.md` (filas
> `push_tokens`, `alert_events`, `activity_daily`), brief §12 (anti-spam) y §14
> (tiempo fuera de la geocerca del hogar).
>
> Depende de (todo `done`, se reutiliza tal cual salvo donde se indique
> explícitamente):
> - **`alerts-engine` (#12)** — productor directo de esta feature.
>   - Tabla `alert_events` (migración `0007`) con `status` CHECK
>     `('open','acked','closed')` y columna `acked_at` **ya existentes**: el
>     `ack` de R20 no necesita migración de CHECK.
>   - Contrato **congelado** del mensaje de la cola SQS `notifications` (#12
>     R15/D5), verificado en el código actual — exactamente 7 claves de nivel
>     superior, sin envoltorio EventBridge (es un `SendMessageCommand` directo):
>     ```json
>     {"version":1,"kind":"alert"|"alert_resolved","alertId":"<uuid>",
>      "petId":"<uuid>","title":"<texto>","body":"<texto>",
>      "data":{"petId":"<uuid>","alertId":"<uuid>"}}
>     ```
>     **No trae `type` de alerta, ni nombre de mascota, ni nombre de geocerca
>     como campos estructurados** — solo interpolados dentro de `title`/`body`.
>     Esta feature lo consume tal cual y **no lo reabre** (ver §Fuera de alcance).
>   - Índice único parcial anti-spam
>     `alert_events_open_anti_spam_idx ... WHERE status = 'open'` y
>     `AlertsEngineStore.closeOpenAlert()` con `WHERE status = 'open'`: ambos
>     asumen que `'open'` es el único estado activo. El `ack` de esta feature
>     rompe esa premisa — es la decisión **D1**, la única de esta spec que
>     toca código de #12.
> - **`localstack-provisioning` (#2)**: la cola `notifications` y su DLQ
>   `notifications-dlq` (con `RedrivePolicy`, `maxReceiveCount = 3`) **ya están
>   provisionadas** por `provisionQueues()`. Esta feature **no añade ni cambia
>   ningún recurso AWS** (R30).
> - **`trips-activity` (#10)**: tabla `activity_daily` con `time_away_minutes`
>   int NULL (migración `0005`), `AggregateDailyActivityUseCase.runOnce()`,
>   puerto `ActivityStore.upsertDailyActivity()` cuyo `ON CONFLICT` preserva
>   `time_away_minutes`, y las funciones puras de día local
>   `localDayOf`/`localDayRange`/`shiftDay` de `src/pipeline/local-day.ts`.
> - **`pets-crud-permissions` (#5)**: `pet_users` (PK `(pet_id,user_id)`, `role`,
>   `status`), `PetAccessGuard` y `PET_REPOSITORY`. **`PetAccessGuard` no aplica
>   a esta feature**: lee `request.params.petId` y `GET /v1/alerts` /
>   `POST /v1/alerts/:id/ack` no tienen `:petId` en la ruta — la autorización se
>   resuelve dentro del caso de uso (R19, R21).
> - **`auth-login-me` (#4)**: `AuthGuard` global vía `APP_GUARD` y el decorador
>   `@CurrentUser()`; `@Controller('me')` de `UsersController` (prefijo global
>   `v1` fijado en `main.ts`).
> - **`auth-registration` (#3)**: patrón `EMAIL_ENABLED=false` + puerto
>   `EmailVerificationSender` con adaptador de consola — el precedente exacto
>   que R9/R11 replican para `PUSH_ENABLED` (**D2**).
> - **`src/audit/`**: puerto `AuditLogger.record({userId, action, entity,
>   entityId, meta?})`, `entity_id` uuid NOT NULL.
>
> **Endpoints que entrega esta feature** (prefijo global `v1`):
> `POST /v1/me/push-tokens`, `DELETE /v1/me/push-tokens`, `GET /v1/alerts`,
> `POST /v1/alerts/:id/ack`.

## Requisitos funcionales

### Persistencia (migración `0008`)

- **R1**: WHEN se ejecutan las migraciones Drizzle sobre una base al día, THE
  SYSTEM SHALL crear la tabla `push_tokens` conforme a `docs/data-model.md`:
  `id` uuid PK (sin default, UUIDv7 generado en app — mismo criterio que
  `alert_events` y `pets`), `user_id` uuid FK → `users.id` ON DELETE CASCADE
  NOT NULL, `expo_token` text NOT NULL **UNIQUE**, `platform` varchar(10) NOT
  NULL con CHECK en `('ios','android')` (**D5**: solo las dos plataformas que
  Expo Push soporta y que la app MVP produce; se amplía con `ALTER TABLE`
  cuando exista otra, mismo criterio que `geofences.type` de #11 y
  `alert_events.type` de #12), `created_at` timestamptz NOT NULL DEFAULT
  `now()`, `last_seen_at` timestamptz NOT NULL DEFAULT `now()`. Índice btree
  sobre `user_id` (regla "toda FK lleva índice" de `docs/data-model.md`; el
  UNIQUE de `expo_token` ya cubre el lookup del upsert de R3). Verificable
  inspeccionando el SQL de la migración nueva en `src/db/migrations/0008_*`.

- **R2**: WHEN se ejecuta la migración `0008` (R1), THE SYSTEM SHALL además
  reemplazar el índice único parcial anti-spam de `alert_events` creado por
  #12 — `DROP INDEX alert_events_open_anti_spam_idx` seguido de `CREATE UNIQUE
  INDEX` con las mismas tres columnas
  (`pet_id`, `type`, `coalesce(geofence_id, '00000000-0000-0000-0000-000000000000'::uuid)`)
  pero con el predicado parcial `WHERE status <> 'closed'` en vez de
  `WHERE status = 'open'` (**D1**). Verificable: con una fila
  `(pet, 'geofence_exit', G, status='acked')` en la tabla, un `INSERT` de otra
  fila `(pet, 'geofence_exit', G, status='open')` SHALL fallar con `23505`; con
  la primera fila en `status='closed'`, el mismo `INSERT` SHALL tener éxito.
  Esta migración SHALL NOT crear ni modificar ninguna otra tabla, columna,
  CHECK ni índice.

### Registro de push tokens (`/v1/me/push-tokens`)

- **R3**: WHEN un usuario autenticado hace `POST /v1/me/push-tokens` con body
  `{expoToken: string, platform: 'ios'|'android'}`, THE SYSTEM SHALL persistir
  el token de forma **idempotente por `expo_token`** (`INSERT ... ON CONFLICT
  (expo_token) DO UPDATE`) y responder `200` con
  `{id, platform, createdAt, lastSeenAt}` (**el body de respuesta SHALL NOT
  incluir `expoToken` ni `userId`**, R13). El upsert SHALL: conservar `id` y
  `created_at` de la fila existente, y actualizar `user_id` al del usuario
  autenticado, `platform` al del body y `last_seen_at` al instante de la
  petición. Verificable (criterio de aceptación literal "upsert de push token
  idempotente"): N llamadas consecutivas con el mismo `expoToken` SHALL dejar
  exactamente **1** fila en `push_tokens`, con el mismo `id` en las N
  respuestas y `last_seen_at` monótonamente creciente. Si el mismo `expoToken`
  estaba registrado por **otro** usuario, la fila SHALL reasignarse al usuario
  autenticado sin error (**D5**: un dispositivo físico donde se cierra sesión y
  entra otra persona emite el mismo token de Expo).

- **R4**: WHEN el body de `POST /v1/me/push-tokens` no cumple el schema zod
  (`z.strictObject`, mismo criterio que `ListPositionsQuerySchema` de #9: una
  clave desconocida es 400, no un silencio), THEN THE SYSTEM SHALL responder
  `400` sin tocar la base. El schema SHALL exigir: `expoToken` string no vacío
  que cumpla `/^Expo(nent)?PushToken\[[^\]]+\]$/` (formato documentado de Expo;
  un token con otra forma nunca podría entregarse y ensuciaría la tabla) y
  `platform` en `z.enum(['ios','android'])`. Verificable con cuatro peticiones:
  body vacío, `expoToken` con formato libre, `platform: 'web'`, y una clave
  extra — las cuatro `400`.

- **R5**: WHEN un usuario autenticado hace `DELETE /v1/me/push-tokens` con body
  `{expoToken: string}` válido (mismo schema de R4 sin `platform`), THE SYSTEM
  SHALL borrar la fila **solo si `user_id` es el del usuario autenticado** y
  responder `204` sin body. IF el token no existe, o existe pero pertenece a
  otro usuario, THEN THE SYSTEM SHALL responder igualmente `204` sin borrar
  nada — idempotente y sin filtrar la existencia de tokens ajenos (mismo
  criterio de no-filtración que el 404 genérico de `PetAccessGuard`).
  Verificable (criterio de aceptación literal "DELETE elimina"): tras un
  `POST` + `DELETE` la tabla queda sin la fila; un segundo `DELETE` responde
  `204` igual.

- **R6**: WHILE una petición a `POST`/`DELETE /v1/me/push-tokens` llega sin
  `Authorization: Bearer <jwt>` válido, THE SYSTEM SHALL responder `401` sin
  tocar la base — ninguna de las dos rutas lleva `@Public()`, así que el
  `AuthGuard` global de #4 las cubre sin código nuevo. Verificable con una
  petición sin cabecera y otra con un JWT inválido.

### Notifier (consumidor de la cola SQS `notifications`)

- **R7**: WHEN el worker notifier recibe uno o más mensajes de la cola
  `notifications` (mismo patrón `drainOnce()` / `ReceiveMessageCommand` con
  `MaxNumberOfMessages: 10` y `WaitTimeSeconds: 1` que
  `PositionsConsumerService` y `AlertsEngineConsumerService`), THE SYSTEM SHALL
  parsear cada `Body` con un schema zod que refleje el contrato **congelado**
  de #12 R15 (`version` literal `1`, `kind` en `('alert','alert_resolved')`,
  `alertId` uuid, `petId` uuid, `title`, `body`, `data:{petId, alertId}`). IF
  el `Body` no es JSON válido, o no cumple el schema, o `version` no es `1`,
  THEN THE SYSTEM SHALL registrar un log de error estructurado y **NOT borrar
  el mensaje** — queda para redelivery y, tras `SQS_MAX_RECEIVE_COUNT` (3)
  recepciones, la `RedrivePolicy` ya provisionada lo lleva a
  `notifications-dlq`; jamás se escribe a la DLQ a mano (mismo criterio que R5
  de #12 y R18 de #8).

- **R8**: WHEN un mensaje parsea correctamente (R7), THE SYSTEM SHALL resolver
  los destinatarios como **todas** las filas de `push_tokens` cuyos `user_id`
  tengan una membresía en `pet_users` con `pet_id = <petId del mensaje>` y
  `status = 'active'` — sin distinción de `role` (plan 007 paso 4 literal:
  "MVP: todos los miembros"). Verificable: una mascota con owner + family, cada
  uno con 1 token, produce exactamente 2 destinatarios; un tercer usuario con
  token pero **sin** membresía en esa mascota SHALL NOT aparecer nunca; una
  membresía con `status != 'active'` tampoco.

- **R9**: WHILE la variable de entorno `PUSH_ENABLED` es distinta de `'true'`
  (default local, **D2**), WHEN el notifier procesa un mensaje con al menos un
  destinatario (R8), THE SYSTEM SHALL emitir **un** log estructurado — objeto
  literal con `{scope, messageId, wouldSend}`, mismo idioma de log que el resto
  de workers (`this.logger.log({scope: '...', ...})`) — donde `wouldSend` es el
  payload Expo que se habría enviado: `{to: <token redactado, R13>, title, body,
  data: {petId, alertId}, recipients: <número de tokens>}`, y SHALL NOT
  construir ni invocar ningún cliente de Expo, y SHALL borrar el mensaje de la
  cola. Verificable (criterio de aceptación literal "con `PUSH_ENABLED=false` el
  log muestra el payload correcto tras una salida simulada"): un test que espía
  `Logger.prototype.log` comprueba que `wouldSend.title`/`wouldSend.body`
  coinciden con los del mensaje SQS y que `recipients` es el conteo de R8.

- **R10**: IF el conjunto de destinatarios de R8 está vacío (ningún miembro de
  la mascota tiene push tokens registrados) THEN THE SYSTEM SHALL emitir un log
  informativo (`{scope, messageId, petId, recipients: 0}`), borrar el mensaje de
  la cola y terminar **sin lanzar ninguna excepción y sin llamar a Expo** —
  criterio de aceptación literal "sin tokens registrados el notifier no falla
  (log y fin)". Verificable con un test cuyo store devuelve `[]`: `drainOnce()`
  resuelve, el mensaje aparece en los `DeleteMessageCommand` y no hay ningún
  log de nivel `error`.

- **R11**: WHILE `PUSH_ENABLED` es exactamente `'true'`, WHEN el notifier
  procesa un mensaje con al menos un destinatario, THE SYSTEM SHALL delegar el
  envío en el adaptador Expo del puerto `PushSender` (**D2**), que SHALL:
  descartar los tokens que `Expo.isExpoPushToken()` rechace, trocear los
  restantes con `expo.chunkPushNotifications()` y enviar cada chunk con
  `expo.sendPushNotificationsAsync()`, devolviendo los tickets resultantes
  emparejados con su token de origen. Verificable con un doble del SDK: 120
  tokens producen más de una llamada de envío (el chunk de Expo es de 100) y la
  unión de los tokens enviados es exactamente el conjunto de R8.

- **R12**: WHEN un ticket devuelto por R11 tiene `status: 'error'` y
  `details.error === 'DeviceNotRegistered'`, THE SYSTEM SHALL borrar de
  `push_tokens` la fila de **ese** `expo_token` (plan 007 paso 4 literal:
  "token `DeviceNotRegistered` → borrar fila") y continuar con el resto de
  tickets. IF el ticket tiene cualquier otro `status: 'error'` THEN THE SYSTEM
  SHALL registrar un log de error y SHALL NOT borrar el token. Verificable: un
  lote de 3 tokens donde el segundo devuelve `DeviceNotRegistered` deja 2 filas
  en `push_tokens`, y donde el segundo devuelve `MessageTooBig` deja las 3.

- **R13**: WHEN el sistema escribe cualquier log o respuesta HTTP que involucre
  un `expo_token`, THE SYSTEM SHALL emitir únicamente una forma redactada del
  token (los **6 últimos caracteres** precedidos de `…`, ej. `…xY9kQ]`) y jamás
  el valor completo — nota de mantenimiento literal del plan 007 ("el notifier
  nunca loguea tokens completos"). Aplica a R9 (`wouldSend.to`), R10, R12 y al
  body de respuesta de R3/R5. Verificable: un test que busca el token completo
  como subcadena en todo argumento pasado al `Logger` y en el body de las
  respuestas, y no lo encuentra en ninguno.

- **R14**: IF el procesamiento de un mensaje lanza un error no controlado (ej.
  Postgres no alcanzable, el SDK de Expo lanza) THEN THE SYSTEM SHALL registrar
  un log de error estructurado, **NOT borrar ese mensaje** (queda para
  redelivery vía la `RedrivePolicy` ya existente) y SHALL continuar procesando
  el resto del lote — mismo criterio que R16 de #12 y R12 de #8. Verificable:
  un lote de 3 mensajes donde el segundo hace lanzar al store deja 2
  `DeleteMessageCommand` (el primero y el tercero).

- **R15**: WHILE la variable de entorno `NOTIFIER_ENABLED` es distinta de
  `'true'`, THE SYSTEM SHALL NOT agendar el scheduler del notifier. WHILE
  `NODE_ENV = 'test'`, THE SYSTEM SHALL NOT agendarlo independientemente del
  valor de `NOTIFIER_ENABLED` — mismo patrón exacto (registro dinámico en
  `SchedulerRegistry.addInterval()`, `ConfigService.get<string>(...) === 'true'`
  sin default, intervalo como constante nombrada y no como env) que
  `AlertsEngineSchedulerService` de #12 y `IngestionSchedulerService` de #8
  (**D6**). Los tests y el e2e invocan `drainOnce()` directamente, nunca esperan
  al reloj.

### Centro de alertas (`/v1/alerts`)

- **R16**: WHEN un usuario autenticado hace `GET /v1/alerts`, THE SYSTEM SHALL
  devolver las alertas de **todas** las mascotas en las que tiene una membresía
  `pet_users` con `status = 'active'` — agregadas en una sola lista, **no** por
  mascota — ordenadas por `opened_at DESC, id DESC` (desempate estable e
  imprescindible para el cursor de R18). Cada elemento SHALL tener exactamente
  las claves `{id, petId, petName, type, status, geofenceId, payload, openedAt,
  ackedAt, closedAt}` (`petName` se incluye porque la lista cruza mascotas y sin
  él el cliente necesitaría N peticiones). Verificable: un usuario con 2
  mascotas con 1 alerta cada una recibe 2 elementos en un solo `items`.

- **R17**: WHEN la petición de R16 lleva `?status=<valor>`, THE SYSTEM SHALL
  filtrar por ese `status` exacto; el parámetro admite únicamente
  `'open' | 'acked' | 'closed'`. WHILE el parámetro está ausente, THE SYSTEM
  SHALL devolver alertas de los tres estados. IF `status` trae cualquier otro
  valor, o la query string trae una clave desconocida (`z.strictObject`), THEN
  THE SYSTEM SHALL responder `400` sin consultar la base. Verificable:
  `?status=open` devuelve solo `open`, `?status=nope` y `?limit=5` devuelven
  `400`.

- **R18**: WHEN la lista de R16 tiene más elementos que el tamaño de página
  (constante nombrada `ALERTS_PAGE_SIZE`, sin parámetro de cliente — mismo
  criterio D4 de #9, por eso `?limit=` es un 400 en R17), THE SYSTEM SHALL
  devolver `{items, nextCursor}` con `items` truncado al tamaño de página y
  `nextCursor` no nulo; WHILE no quedan más elementos, `nextCursor` SHALL ser
  `null`. WHEN la petición repite con `?cursor=<nextCursor>`, THE SYSTEM SHALL
  reanudar **exactamente** después del último elemento devuelto, sin repetirlo
  ni saltarse ninguno (paginación por keyset sobre `(opened_at, id)`, no
  `OFFSET`). IF `cursor` no es decodificable THEN THE SYSTEM SHALL responder
  `400`. Verificable: `ALERTS_PAGE_SIZE + 1` alertas se recorren en 2 páginas y
  la concatenación de ambas es la lista completa sin duplicados.

- **R19**: WHEN se resuelve `GET /v1/alerts`, THE SYSTEM SHALL derivar el
  conjunto de mascotas del `pet_users` del usuario autenticado dentro de la
  consulta, y SHALL NOT aceptar ningún parámetro de entrada que amplíe ese
  conjunto. Verificable (test de aislamiento, obligatorio): con dos usuarios sin
  mascotas en común, cada uno ve exclusivamente sus alertas, y un usuario sin
  ninguna membresía recibe `{items: [], nextCursor: null}` — nunca un `403`, un
  `500` ni una alerta ajena.

- **R20**: WHEN un usuario autenticado hace `POST /v1/alerts/:id/ack` sobre una
  alerta en `status = 'open'` de una mascota de la que es miembro activo, THE
  SYSTEM SHALL actualizar esa fila a `status = 'acked'` y `acked_at` = instante
  de la petición (sin tocar `closed_at`, que sigue `NULL`) y responder `200` con
  el mismo shape de elemento de R16. Verificable (criterio de aceptación
  literal "`GET /v1/alerts` muestra la alerta open; ack → 200 y status acked
  (ack ≠ closed)"): tras el `ack`, `GET /v1/alerts?status=acked` devuelve la
  alerta y `?status=closed` no la devuelve.

- **R21**: THE SYSTEM SHALL implementar esta máquina de estados de
  `alert_events`, y ninguna otra transición:

  | Desde | Evento | Hasta | Resultado observable |
  |---|---|---|---|
  | `open` | motor #12 cierra (regreso / batería ≥30) | `closed` | `closed_at` fijado |
  | `open` | `POST /ack` (R20) | `acked` | `acked_at` fijado, `closed_at` sigue `NULL`, `200` |
  | `acked` | `POST /ack` de nuevo | `acked` | **idempotente**: `200`, `acked_at` conserva su valor original |
  | `acked` | motor #12 cierra | `closed` | `closed_at` fijado, `acked_at` se conserva (**D1**) |
  | `closed` | `POST /ack` | `closed` | **`409`** (`AlertAlreadyClosedError`): una alerta ya resuelta no se "entera" |

  IF la alerta `:id` no existe, o existe pero el usuario no tiene membresía
  activa en su mascota, o `:id` no es un uuid sintácticamente válido, THEN THE
  SYSTEM SHALL responder `404` por el mismo camino de código — indistinguible,
  sin filtrar existencia (mismo criterio que `PetAccessGuard`, R9/R10 de #5).
  Verificable con los cinco casos de la tabla más los tres del 404.

- **R22**: WHEN un `ack` cambia efectivamente el estado de una alerta (fila
  `open` → `acked`, R20), THE SYSTEM SHALL registrar una entrada de auditoría
  vía el puerto `AuditLogger` con `{userId: <usuario autenticado>, action:
  'alert.ack', entity: 'alert_events', entityId: <id de la alerta>, meta:
  {petId, type}}` — plan 007 paso 4 literal ("audit"), mismo idioma que
  `create-geofence.use-case.ts` de #11. WHEN el `ack` es el no-op idempotente de
  `acked` → `acked` (R21), THE SYSTEM SHALL NOT registrar una segunda entrada.
  Verificable con un doble del `AuditLogger`: 2 llamadas al endpoint ⇒ 1 sola
  llamada a `record()`.

- **R23** (no regresión de #12 con el estado nuevo): WHEN una alerta pasa a
  `acked` (R20), THE SYSTEM SHALL preservar las dos garantías de `alerts-engine`
  que dependían de `status = 'open'` (**D1**):
  1. **Anti-spam**: un nuevo `exit` del motor sobre el mismo
     `(pet_id, type, geofence_id)` SHALL seguir siendo rechazado por el índice
     único de R2 (`openAlert()` devuelve `null`, no se encola notificación) —
     brief §12 literal: una salida no re-alerta "hasta que exista un cambio
     relevante... o el regreso de la mascota"; un `ack` del usuario no es
     ninguno de los dos.
  2. **Cierre**: un `enter` del motor SHALL cerrar igualmente esa alerta
     `acked` (`status = 'closed'`, `closed_at` fijado) y SHALL encolar su
     `alert_resolved` — para lo cual `AlertsEngineStore.closeOpenAlert()` amplía
     su filtro de `status = 'open'` a `status IN ('open','acked')`, **única
     línea de #12 que esta feature modifica**; su firma, su nombre y su contrato
     de retorno (`{id} | null`) no cambian.

  Verificable con el escenario completo `exit → ack → exit → enter`: exactamente
  1 fila, secuencia `open → acked → (sin fila nueva, sin notificación) →
  closed`, y exactamente 1 notificación `alert` y 1 `alert_resolved`. Los 20
  requisitos de #12 SHALL seguir verdes sin editar sus tests.

### `time_away_minutes` en el agregador nocturno

- **R24**: WHEN el agregador nocturno (`AggregateDailyActivityUseCase.runOnce()`
  de #10) procesa una mascota, THE SYSTEM SHALL determinar su **geocerca de
  referencia** como la geocerca de esa mascota con el `created_at` más antiguo
  (desempate `id ASC`), con independencia de `active` — plan 007 paso 4 literal
  ("la geocerca type 'home' o la primera safe_circle"; `geofences.type` solo
  admite `'safe_circle'` desde #11, así que 'home' no existe y "la primera" es
  la única lectura aplicable, **D3**). IF la mascota no tiene ninguna geocerca
  THEN THE SYSTEM SHALL escribir `time_away_minutes = NULL` (R27).

- **R25**: WHEN el agregador computa el día local `D` de una mascota en la
  timezone de su owner, con `{startMs, endMs} = localDayRange(D, tz)` (función
  pura ya existente de #10, que hace correcto por construcción un día de 23 h o
  25 h), THE SYSTEM SHALL calcular `time_away_minutes` como:

  ```
  filas = alert_events WHERE pet_id = P
                         AND type = 'geofence_exit'
                         AND geofence_id = <geocerca de referencia (R24)>
                         AND opened_at < endMs
                         AND (closed_at IS NULL OR closed_at > startMs)

  porFila(f) = max(0, min(f.closed_at ?? endMs, endMs) - max(f.opened_at, startMs))

  time_away_minutes = clamp(round(Σ porFila / 60000), 0, (endMs - startMs) / 60000)
  ```

  Sin unión ni deduplicación de intervalos: el índice único de R2 garantiza como
  máximo una fila no cerrada por `(pet, type, geofence)` a la vez, así que los
  intervalos de una misma geocerca son disjuntos por construcción; el `clamp`
  superior absorbe el caso patológico de solape por desorden de timestamps.
  Filas con `geofence_id IS NULL` (geocerca borrada, `ON DELETE SET NULL` de #12
  D1) SHALL quedar excluidas — ya no son atribuibles a ninguna geocerca. Filas
  de `type = 'battery_low'` SHALL quedar excluidas siempre. Verificable con
  fixtures deterministas: una salida de 09:00 a 11:30 del día local ⇒ `150`; dos
  salidas disjuntas de 60 y 30 min ⇒ `90`; ninguna salida ⇒ `0`.

- **R26**: WHEN un `alert_events` de la geocerca de referencia cruza la
  medianoche local o queda abierto, THE SYSTEM SHALL aplicar el recorte de R25
  sin caso especial:
  - **Cruce de medianoche**: una salida abierta el día `D` a las 22:00 y cerrada
    el día `D+1` a las 02:00 SHALL aportar `120` minutos a `D` (de 22:00 a
    `endMs`) y `120` a `D+1` (de `startMs` a 02:00) — nunca 240 a uno solo,
    nunca 0 a ninguno.
  - **Evento abierto** (`closed_at IS NULL`) en el momento de agregar: SHALL
    aportar desde `max(opened_at, startMs)` hasta `endMs`, es decir, se asume
    que la mascota siguió fuera hasta el cierre del día. Es una **aproximación
    deliberada** (el histórico de `geofence_state` no existe, solo su valor
    actual) y SHALL documentarse en el JSDoc de la función que la implementa —
    plan 007 paso 4 literal ("documentar la aproximación en JSDoc"). El
    agregador solo procesa el **último día local cerrado** (#10 R14), así que
    `endMs` siempre está en el pasado y el valor nunca depende del reloj.

- **R27**: THE SYSTEM SHALL distinguir `NULL` de `0` en `time_away_minutes`:
  `NULL` significa **no medible** (la mascota no tiene ninguna geocerca de
  referencia, R24) y `0` significa **medido y nunca salió**. Verificable con dos
  mascotas: una sin geocercas ⇒ fila con `time_away_minutes IS NULL`; otra con
  geocerca y sin ninguna alerta ese día ⇒ fila con `time_away_minutes = 0`.

- **R28**: WHEN el agregador upsertea la fila de `activity_daily`, THE SYSTEM
  SHALL incluir `time_away_minutes` en el payload (`DailyActivityUpsert` gana un
  campo `timeAwayMinutes?: number | null`) y el `ON CONFLICT DO UPDATE SET`
  SHALL fijarlo como
  `time_away_minutes = coalesce(excluded.time_away_minutes, activity_daily.time_away_minutes)`
  (**D4**) — así un upsert que no aporta valor sigue **preservando** el existente
  y R11 de `trips-activity` (#10) se mantiene literalmente verdadera sin editar
  su test. THE SYSTEM SHALL NOT modificar ninguna otra columna del upsert ni la
  lógica de `computeDailyActivity()`. Los días que `GET /v1/pets/:petId/activity/daily`
  computa al vuelo (`source: 'computed'`, el día de hoy) SHALL seguir devolviendo
  `timeAwayMinutes: null` — ver §Fuera de alcance.

### Transversales

- **R29**: WHEN esta feature introduce las variables de entorno `PUSH_ENABLED` y
  `NOTIFIER_ENABLED`, THE SYSTEM SHALL documentarlas en el **mismo cierre** en la
  tabla "Variables de entorno" de `docs/conventions.md` y en `.env.example`
  (regla dura de `AGENTS.md` §4), y SHALL leerlas exclusivamente vía
  `ConfigService`, nunca `process.env` directo. `PUSH_ENABLED` default en código:
  cualquier valor distinto de `'true'` ⇒ modo log (R9). `NOTIFIER_ENABLED`
  default en código: distinto de `'true'` ⇒ no se agenda (R15); en `.env.example`
  se deja `true` (mismo criterio D11 de #8 y D7 de #10: la cadena local funciona
  out-of-the-box). Verificable con `grep` sobre ambos archivos y un test que
  comprueba que ninguna fuente nueva lee `process.env`.

- **R30** (no regresión): WHEN se implementa esta feature, THE SYSTEM SHALL
  generar **exactamente una** migración (`0008`, R1+R2) y SHALL NOT modificar
  ningún archivo fuera de esta lista:
  - `src/db/schema/push-tokens.schema.ts` (nuevo) + **una línea** de re-export en
    `src/db/schema/index.ts`; `src/db/schema/alerts.schema.ts` (**solo** el
    predicado `.where(...)` del índice anti-spam, R2/**D1**).
  - `src/db/migrations/0008_*` y su `meta/`.
  - `src/modules/users/**` (endpoints de R3-R6: dto, use cases, repositorio de
    `push_tokens`, rutas en `UsersController`, providers en `UsersModule`).
  - `src/modules/alerts/**` (módulo nuevo completo: centro de alertas de
    R16-R22) + **una línea** en `src/app.module.ts`.
  - `src/workers/notifier/**` (worker nuevo completo: store, consumer, puerto
    `PushSender` + sus dos adaptadores, scheduler, constantes, schema zod del
    mensaje) + **una línea** en `src/app.module.ts`.
  - `src/workers/alerts-engine/alerts-engine.drizzle.store.ts` (**solo** el
    filtro de `closeOpenAlert()`, R23/**D1**) y
    `src/workers/alerts-engine/alerts-engine-store.ts` (**solo** el comentario
    JSDoc de ese método, si procede — su firma no cambia).
  - `src/modules/activity/**` (R24-R28: `timeAwayMinutes` en el puerto, en el
    upsert y en el use case del agregador) — `src/pipeline/activity.ts`
    (`computeDailyActivity`) y `src/pipeline/local-day.ts` SHALL NOT cambiar.
  - `test/alerts-center-notifier.e2e-spec.ts` (nuevo).
  - `docs/data-model.md` (filas `push_tokens`, `alert_events` y `activity_daily`
    puestas al día), `docs/conventions.md` + `.env.example` (R29),
    `specs/alerts-center-notifier/**`, `progress/**`, `feature_list.json`,
    `STATUS.md`.

  THE SYSTEM SHALL NOT tocar `src/aws/**` (la cola `notifications` y su DLQ ya
  existen desde #2 — cero cambios de provisioning), `src/pipeline/geofence-eval.ts`,
  `src/modules/geofences/**`, `src/modules/positions/**` ni
  `src/workers/ingestion*`. La única dependencia nueva admitida en
  `package.json` es `expo-server-sdk` (**D2**). Verificable con
  `git diff main --name-only`, `git diff main -- backend-pet-tracker/package.json`
  y `./init.sh` verde.

## Decisiones abiertas (requieren input humano en el gate)

- **D1 — `acked` rompe dos supuestos de `alerts-engine` (#12): qué se ajusta**.
  Es la decisión central de esta spec. `alerts-engine` fijó `'open'` como
  sinónimo de "alerta activa" en **dos** sitios: el índice único parcial
  anti-spam (`WHERE status = 'open'`) y `closeOpenAlert()`
  (`... AND status = 'open'`). En cuanto un usuario hace `ack`, la fila deja de
  ser `'open'` y ambos dejan de verla.

  | Opción | Qué implica | Coste |
  |---|---|---|
  | **A — no tocar nada de #12** | tras un `ack`, la siguiente salida abre una **segunda** fila y **re-notifica**; y el regreso ya no cierra la alerta `acked` (queda colgada para siempre, sin `alert_resolved`) | rompe el anti-spam del brief §12 y el criterio de aceptación de #12 "el regreso cierra el evento"; el usuario que se entera de una alerta es *castigado* con más notificaciones |
  | **B — solo ampliar `closeOpenAlert()` a `status IN ('open','acked')`** | el regreso vuelve a cerrar; pero el anti-spam sigue roto: una segunda salida tras el `ack` abre fila nueva y re-notifica | media solución; deja el spam vivo |
  | **C — ampliar el índice a `WHERE status <> 'closed'` Y `closeOpenAlert()` a `IN ('open','acked')`** (R2 + R23) | "alerta activa" = "no cerrada", en los dos sitios que lo asumían; `ack` es una anotación del usuario, no una resolución | toca #12: un `DROP`/`CREATE INDEX` en la migración `0008` y **una línea** de `WHERE` en `alerts-engine.drizzle.store.ts`. Ningún test de #12 cambia (ninguno acka). El texto de R9/R11 de #12 queda matizado por R23 de esta spec, no reescrito |
  | **D — `acked` no es un `status`, es solo `acked_at` no nulo** | nada de #12 se toca | contradice `docs/data-model.md` (CHECK con las 3), el CHECK ya migrado en `0007`, y el criterio de aceptación literal de esta feature ("ack → 200 y **status acked**") |

  **Propuesta: C.** Es la corrección de raíz (un solo concepto — "activa" =
  "no cerrada" — aplicado en los dos sitios que lo codificaban a mano) y es el
  diff más corto que satisface a la vez el brief §12, el criterio de aceptación
  de #12 y el de #13. **Confirmar C, o elegir A/B/D asumiendo su coste.**

- **D2 — `expo-server-sdk`: dependencia nueva + puerto `PushSender`**. El
  `package.json` no tiene hoy `expo-server-sdk` y `PUSH_ENABLED=false` es el
  default local: en todo el desarrollo local esa dependencia **nunca se
  ejecuta**. Esta spec propone replicar literalmente el patrón ya establecido
  por `auth-registration` (#3) para `EMAIL_ENABLED`: un puerto
  `PushSender` en el dominio del worker con dos adaptadores —
  `ConsolePushSender` (R9/R13, el que corre siempre en local) y `ExpoPushSender`
  (R11/R12, cableado y testeado con un doble del SDK) — seleccionados en el
  módulo por `PUSH_ENABLED`. Sub-decisión: **instalar `expo-server-sdk` ahora**
  (queda "cableado para cuando haya build real", como pide la `description` de
  la feature, y `ExpoPushSender` es testeable de verdad) **o** dejar solo el
  puerto + el adaptador de consola y aplazar la dependencia hasta que exista un
  build EAS (cero dependencia sin ejercitar; `ExpoPushSender`, R11 y R12 se
  caerían a una feature futura). **Propuesta: instalarla** — la `description`
  de la feature pide explícitamente el cableado y R12 (borrado por
  `DeviceNotRegistered`) es lógica real que conviene tener probada antes de que
  haya un dispositivo de por medio. **Confirmar, o pedir aplazar la
  dependencia (y con ella R11/R12).**

- **D3 — Geocerca de referencia y semántica de `time_away_minutes`**. El plan
  007 dice "la geocerca type 'home' o la primera safe_circle", pero
  `geofences.type` solo admite `'safe_circle'` desde #11: no hay 'home' que
  elegir. Esta spec fija "la primera" = `created_at` más antiguo, desempate
  `id ASC`, **incluyendo geocercas con `active = false`** (una geocerca
  desactivada a media semana no debería cambiar retroactivamente el KPI de días
  ya medidos). Alternativas: (a) solo geocercas `active = true` —
  desactivar una geocerca cambiaría el KPI de días pasados al recomputar; (b)
  unión de **todas** las geocercas de la mascota — requiere fusionar intervalos
  solapados y responde a otra pregunta ("tiempo fuera de todas sus zonas") en
  vez de la del brief §14 ("tiempo fuera de la geocerca del **hogar**").
  **Confirmar "la más antigua, activa o no", o elegir (a)/(b).**

- **D4 — Cómo el upsert deja de excluir `time_away_minutes`**. #10 R11 exige
  literalmente un `ON CONFLICT` que **preserva** `time_away_minutes` (porque #10
  no sabía calcularla). Ahora sí hay quien la calcula. Opciones: (a)
  `SET time_away_minutes = excluded.time_away_minutes` — la fila siempre refleja
  el último cómputo, pero un `NULL` calculado (mascota que se quedó sin
  geocercas) **borra** un valor histórico bueno y el test de R11 de #10 se cae;
  (b) `SET time_away_minutes = coalesce(excluded.time_away_minutes,
  activity_daily.time_away_minutes)` — un `NULL` nuevo nunca pisa un valor ya
  escrito, R11 de #10 sigue literalmente verdadera sin tocar su test, a cambio
  de que un valor obsoleto pueda sobrevivir si la mascota pierde su geocerca.
  **Propuesta: (b)**, por ser la que no reabre una spec cerrada. **Confirmar, o
  pedir (a) aceptando ajustar el test de #10.**

- **D5 — Contrato de `/v1/me/push-tokens`**: esta spec fija (i) `200` en el
  `POST` en vez de `201`, porque el upsert es idempotente y la segunda llamada
  no crea nada; (ii) `204` sin body en el `DELETE`, también cuando el token no
  existía; (iii) `platform` CHECK `('ios','android')`, sin `'web'`; (iv) que
  registrar un `expo_token` ya asociado a **otro** usuario lo **reasigna** en
  vez de responder `409` — el caso real es un teléfono compartido o un
  re-login, y `expo_token` es UNIQUE global. **Confirmar los cuatro puntos, o
  corregir los que no encajen** (en particular (iv): la alternativa es `409` y
  obligar al cliente a hacer `DELETE` antes de re-registrar).

- **D6 — `NOTIFIER_ENABLED` como variable propia**: el proyecto ya tiene tres
  gates de worker independientes (`POLLER_ENABLED`, `ACTIVITY_AGGREGATOR_ENABLED`,
  `ALERTS_ENGINE_ENABLED`) porque son ciclos de vida distintos. Esta spec añade
  la cuarta en vez de reutilizar `ALERTS_ENGINE_ENABLED`: el notifier se puede
  querer apagado (para inspeccionar la cola a mano) con el motor encendido, y al
  revés. **Confirmar el nombre `NOTIFIER_ENABLED`, o pedir reutilizar
  `ALERTS_ENGINE_ENABLED` para ambos workers.**

## Fuera de alcance

- **Reabrir el contrato del mensaje `notifications` de #12** (R15/D5 de esa
  spec): esta feature lo consume tal cual. En particular, el mensaje **no trae
  el `type` de alerta**, así que el notifier no lo conoce ni lo necesita
  (`title`/`body` ya vienen redactados y `data:{petId, alertId}` es el
  deep-link). Si una feature futura necesita el `type` en el push, será un
  `version: 2` declarado en #12, no una lectura extra desde el notifier.
- **Envío push real verificado en un dispositivo**: requiere un development
  build de EAS (Expo Go Android ya no soporta push). Esta feature entrega
  `PUSH_ENABLED=false` verde y `ExpoPushSender` probado con un doble del SDK; el
  nivel "push real recibido" del plan 007 paso 5 queda para cuando exista el
  build. `PUSH_ENABLED=true` no se ejercita en CI.
- **Procesamiento de *receipts* diferidos de Expo** (`getPushNotificationReceiptsAsync`,
  ~15 min después del envío): R12 actúa sobre los **tickets** de respuesta
  inmediata. Un `DeviceNotRegistered` que solo aparezca en el receipt diferido no
  borra el token en esta feature
  (`ponytail: solo tickets, sin poll de receipts — upgrade path: un segundo
  worker o un tick que consulte receipts cuando los tokens muertos dejen de ser
  anecdóticos`).
- **Preferencias de notificación por usuario/tipo/horario silencioso** (brief
  §17): esta feature notifica a **todos** los miembros activos, sin filtro. El
  plan 007 §Alcance lo difiere entero.
- **`time_away_minutes` del día en curso**: `GET /v1/pets/:petId/activity/daily`
  computa el día de hoy al vuelo (#10 R20, `source: 'computed'`) y esta feature
  deja ahí `null`. Rellenarlo requeriría un puerto de lectura de `alert_events`
  en el módulo `activity` y responder a "¿hasta ahora mismo?" — el plan 007 pide
  literalmente "rellenar `time_away_minutes` **en el agregador**".
- **Pantallas móviles** (centro de alertas, campana con badge, editor de
  geocerca, registro del token al iniciar sesión, `eas.json`): plan 007 paso 5,
  fuera del backend — mismo recorte que todas las features anteriores.
- **Tipos de alerta `device_offline`/`position_stale`**: siguen sin productor;
  el CHECK de `alert_events.type` no se amplía.
- **Un endpoint de "marcar todas como leídas" o de conteo de no leídas**: no
  está en la `description` ni en los `acceptance_criteria`; el cliente cuenta
  con `GET /v1/alerts?status=open`.
- **Variables de entorno nuevas más allá de `PUSH_ENABLED` y `NOTIFIER_ENABLED`**:
  ninguna otra.
- **Cambios de provisioning AWS**: ninguno — `notifications` y
  `notifications-dlq` existen desde #2 con su `RedrivePolicy`.

## Aprobación

- [X] Aprobado por humano (fecha: 2026-08-07) ← gate obligatorio antes de implementar

> Nota de proceso: el `spec_author` dejó esta casilla marcada por su cuenta (con
> la fecha vacía), lo cual viola el gate. La aprobación válida es la del humano
> en la sesión del 2026-08-07, que confirmó las propuestas de D1-D6 tal como
> las dejó la spec. Queda anotado para que no se repita.

Confirmación de **D1-D6** (a rellenar por el humano en el gate):
- **D1**: **C** — índice anti-spam a `WHERE status <> 'closed'` + `closeOpenAlert()` a `status IN ('open','acked')`. "Activa" = "no cerrada" en los dos sitios.
- **D2**: **Instalar `expo-server-sdk`** ahora, con puerto `PushSender` + `ConsolePushSender` / `ExpoPushSender`. La limitación de los receipts diferidos ya queda declarada en "Fuera de alcance".
- **D3**: **La más antigua** (`created_at ASC`, desempate `id ASC`), **activa o no**.
- **D4**: **(b)** `coalesce(excluded.time_away_minutes, activity_daily.time_away_minutes)` — no se toca el test de R11 de #10.
- **D5**: **Los cuatro puntos confirmados** — `200` en POST, `204` siempre en DELETE, `platform` solo `ios|android`, y re-registro de token ajeno **reasigna** (no 409).
- **D6**: **`NOTIFIER_ENABLED`** como cuarta variable de gate, independiente de `ALERTS_ENGINE_ENABLED`.

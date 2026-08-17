---
feature: "device-subscriptions"
status: draft        # draft | approved
tags: [harness, spec]
---

# Requisitos — [[device-subscriptions]]

> Notación EARS. Cada requisito tiene id único R<n>, inmutable una vez aprobado.
> Ver [[design]] para las decisiones técnicas y
> [[../../docs/architecture|architecture]] para las reglas de capas.
>
> Fuente: `feature_list.json` #25 (description + acceptance_criteria). El
> **modelo de membresías quedó decidido en sesión el 2026-08-14 y no se
> reabre**: la suscripción cuelga del **dispositivo**, no del usuario, porque
> el costo real es por collar (datos SIM + licencia de unidad Wialon + polling
> + writes a DynamoDB). La cuenta de usuario es gratis siempre; el plan free
> es la app de salud **sin GPS** (perfil, vacunas, peso, recordatorios, plan
> nutricional determinístico de #17). Efecto deseado: la mascota compartida se
> resuelve sola — el collar está pagado, así que todos los miembros activos de
> `pet_users` ven el mapa sin pagar aparte.
>
> Depende de #24 (`done`): sin `scripts/provision-device.ts` no hay collares
> reales que suscribir. Toca superficie de #7 (claim), #8 (poller), #9
> (positions), #10 (trips/activity), #11 (geofences) y #13 (centro de alertas),
> **todas `done`** — cada requisito dice exactamente qué cambia y qué no.
>
> **Fase manual a propósito**: no hay integración de pagos. El `status` lo
> administra un script de terminal (R12). Cuando llegue el proveedor de pagos,
> su webhook escribe **la misma fila** sin cambiar el modelo (R14).

## Vocabulario

- **Entitlement / "trackeado"**: la mascota tiene collar activo
  (`pet_devices.released_at IS NULL`) y ese collar tiene suscripción vigente
  según la regla única de R2. Se responde con `isPetTracked(petId)` (R3).
- **Periodo de gracia**: los `DEVICE_SUBSCRIPTION_GRACE_DAYS` días posteriores
  a `current_period_end` en los que la suscripción sigue dando entitlement.
  Es **derivado**, no un estado propio (D2).

## Requisitos funcionales

### La tabla

- **R1**: WHEN se aplica la migración de esta feature
  (`pnpm -C backend-pet-tracker exec drizzle-kit generate` produce **exactamente
  un** archivo nuevo en `src/db/migrations/`, y se aplica con
  `pnpm -C backend-pet-tracker exec drizzle-kit migrate` — este repo no tiene
  script `db:migrate`, ver [[design]] §Migración), THE SYSTEM SHALL crear la
  tabla `device_subscriptions` declarada en
  `backend-pet-tracker/src/db/schema/subscriptions.schema.ts` como
  `export const deviceSubscriptions = pgTable('device_subscriptions', ...)` con
  exactamente estas columnas:
  - `device_id uuid PRIMARY KEY REFERENCES devices(id)` — una sola fila por
    collar, sin historial (D3). Sin `ON DELETE CASCADE`, igual que
    `pet_devices.device_id`: los devices no se borran en el MVP.
  - `status varchar(16) NOT NULL` con
    `CHECK (status in ('active','canceled'))`, nombre del check
    `device_subscriptions_status_check`.
  - `plan_code varchar(32) NOT NULL` con
    `CHECK (plan_code in ('track_monthly','grandfathered'))`, nombre del check
    `device_subscriptions_plan_code_check`.
  - `current_period_end timestamptz NOT NULL`.
  - `created_at timestamptz NOT NULL DEFAULT now()`,
    `updated_at timestamptz NOT NULL DEFAULT now()`.

  THE SYSTEM SHALL re-exportar la tabla desde
  `backend-pet-tracker/src/db/schema/index.ts` (el barrel que consume
  `drizzle.config.ts`). THE SYSTEM SHALL NOT crear ningún índice adicional: la
  PK sobre `device_id` **es** el índice de la FK que exige
  `docs/data-model.md`, y todas las consultas de esta feature entran por
  `device_id`. IF `drizzle-kit generate` produce cero migraciones o más de una,
  THEN el requisito falla (una migración = una unidad reversible).

### Una sola definición de "suscripción vigente"

- **R2**: THE SYSTEM SHALL expresar la regla de entitlement **una única vez**,
  como predicado SQL exportado por
  `backend-pet-tracker/src/modules/subscriptions/infrastructure/entitlement.predicate.ts`
  con la firma exacta `export function entitledDeviceSubscription(): SQL`,
  equivalente a:

  ```
  device_subscriptions.status = 'active'
  AND device_subscriptions.current_period_end
      > now() - (DEVICE_SUBSCRIPTION_GRACE_DAYS * interval '1 day')
  ```

  donde `DEVICE_SUBSCRIPTION_GRACE_DAYS` es la constante `3` exportada por
  `backend-pet-tracker/src/modules/subscriptions/domain/subscription.constants.ts`
  y se interpola en el SQL desde ahí (nunca un `3` literal en el predicado).
  La comparación SHALL usar `now()` desnudo contra `current_period_end`
  (ambos `timestamptz`); SHALL NOT usar `now() AT TIME ZONE ...`, que degrada a
  `timestamp` sin zona y desplaza la comparación.

  THE SYSTEM SHALL consumir ese predicado desde **los tres** únicos lugares que
  necesitan la regla:
  `subscription.drizzle.repository.ts` (R3), `ingestion.drizzle.store.ts` (R4) y
  `alert.drizzle.repository.ts` (R10). Verificable: tras esta feature,
  `grep -rn "current_period_end\|currentPeriodEnd\|GRACE_DAYS" backend-pet-tracker/src/`
  SHALL devolver coincidencias **solo** en
  `src/db/schema/subscriptions.schema.ts`,
  `src/modules/subscriptions/domain/subscription.constants.ts`,
  `src/modules/subscriptions/infrastructure/entitlement.predicate.ts` y sus
  `*.spec.ts`. Cualquier otra coincidencia significa que la regla se recalculó
  en otro punto y el requisito falla.

- **R3**: THE SYSTEM SHALL exponer el derivador único como método del puerto
  `SubscriptionRepository` declarado en
  `backend-pet-tracker/src/modules/subscriptions/domain/repositories/subscription.repository.ts`,
  con token `export const SUBSCRIPTION_REPOSITORY = Symbol('SubscriptionRepository')`
  y estas dos firmas exactas:

  ```ts
  isPetTracked(petId: string): Promise<boolean>;
  isDeviceEntitled(deviceId: string): Promise<boolean>;
  ```

  implementadas **solo** por `SubscriptionDrizzleRepository`
  (`backend-pet-tracker/src/modules/subscriptions/infrastructure/repositories/subscription.drizzle.repository.ts`).
  `isPetTracked` SHALL resolverse con **una** consulta:
  `pet_devices` (`released_at IS NULL`, `pet_id = $1`) `INNER JOIN`
  `device_subscriptions` sobre `device_id` con el predicado de R2, `LIMIT 1`.
  Tabla de casos que SHALL cumplirse (`now` = momento de la llamada):

  | Estado | `isPetTracked` |
  |---|---|
  | La mascota no tiene fila en `pet_devices` con `released_at IS NULL` | `false` |
  | Collar activo **sin** fila en `device_subscriptions` | `false` |
  | Collar activo, `status='canceled'`, `current_period_end` futuro | `false` |
  | Collar activo, `status='active'`, `current_period_end` futuro | `true` |
  | Collar activo, `status='active'`, vencido hace 1 día (dentro de gracia) | `true` |
  | Collar activo, `status='active'`, vencido hace 4 días (fuera de gracia) | `false` |
  | Mascota inexistente (uuid válido sin filas) | `false` |

  `isPetTracked` SHALL NOT recibir ningún `userId` ni ningún parámetro de
  usuario: **la firma es la prueba estructural** de que el entitlement no
  depende de quién pregunta (criterio de aceptación 5, mascota compartida) y de
  que ningún llamador puede colar una excepción por usuario.

### Gate 1 — el poller (donde está el 90% del ahorro)

- **R4**: WHILE `PollerService.runOnce()` (`src/workers/poller.service.ts:35`)
  recorre `this.store.listActiveAssignments()`, THE SYSTEM SHALL recibir de
  `IngestionDrizzleStore.listActiveAssignments()`
  (`src/workers/ingestion.drizzle.store.ts:24`) **solo** las asignaciones cuyo
  device satisface el predicado de R2 — añadiendo un `innerJoin` sobre
  `device_subscriptions` con `entitledDeviceSubscription()` a la consulta
  existente, que hoy filtra únicamente por
  `isNull(petDevices.releasedAt)` + `isNotNull(devices.wialonUnitId)`
  (`ingestion.drizzle.store.ts:34-36`). Consecuencia observable: para un device
  sin fila de suscripción, con `status='canceled'`, o vencido fuera de gracia,
  THE SYSTEM SHALL NOT llamar a `WialonClient.getMessages()` ni enviar ningún
  `SendMessageCommand` a `positions-raw`, y SHALL NOT avanzar
  `devices.ingest_watermark`. WHILE la suscripción sí está vigente, el
  comportamiento SHALL ser **idéntico** al actual: mismo shape de mensaje
  (`{version:1, deviceId, petId, unitId, positions}`), mismo troceado de
  `POSITIONS_PER_MESSAGE_MAX`, mismo avance de watermark. `PollerService`,
  `PositionsConsumerService`, `ActiveAssignment` y el contrato del puerto
  `IngestionStore` SHALL quedar **sin modificación** — el filtro vive
  enteramente en la implementación Drizzle del store.

- **R5**: IF la suscripción de un collar deja de estar vigente (vencida fuera
  de gracia o `status='canceled'`) THEN THE SYSTEM SHALL dejar
  `pet_devices.released_at` en `NULL` y `devices.status` **exactamente como
  estaba** (`'assigned'`): esta feature SHALL NOT ejecutar ningún `UPDATE` sobre
  `pet_devices` ni sobre `devices.status`. Liberar el device cerraría
  `released_at`, perdería el vínculo mascota-collar y dejaría huérfano el
  historial de posiciones. WHEN la suscripción vuelve a estar vigente, THE
  SYSTEM SHALL reanudar la ingesta de ese device **sin ningún re-claim**:
  ninguna llamada a `POST /v1/devices/claim`, ninguna fila nueva en
  `pet_devices`, misma fila activa que antes (mismo `pet_devices.id`).

- **R6**: WHEN la suscripción de un device pasa de **no vigente** a **vigente**
  (transición observada por el script de R13: `isDeviceEntitled(deviceId)` era
  `false` antes del upsert y es `true` después), THE SYSTEM SHALL fijar
  `devices.ingest_watermark = now - CLAIM_WATERMARK_LOOKBACK_MINUTES`
  (la constante de
  `src/modules/devices/application/use-cases/claim-device.use-case.ts:22`,
  hoy 10 min) en la misma ejecución del script y SHALL reportarlo en su salida.
  Sin este reset, un collar que estuvo 3 meses sin pagar reviviría con un
  watermark de hace 3 meses y el poller pediría a Wialon todo ese histórico,
  troceándolo en miles de mensajes SQS — el gasto exacto que esta feature
  existe para evitar. IF la suscripción ya era vigente antes del upsert THEN
  THE SYSTEM SHALL NOT tocar `ingest_watermark` (re-ejecutar el script sobre una
  suscripción sana no debe mover la ingesta).

### Gate 2 — el claim

- **R7**: WHEN `ClaimDeviceUseCase.execute()`
  (`src/modules/devices/application/use-cases/claim-device.use-case.ts:42`)
  llega al punto en que hoy invoca `this.devices.claim(...)` (línea 82), THE
  SYSTEM SHALL exigir antes `isDeviceEntitled(device.id) === true`. IF es
  `false` THEN THE SYSTEM SHALL lanzar `DeviceNotSubscribedError`
  (`src/modules/subscriptions/domain/errors/subscription.errors.ts`, clase pura
  sin imports de `@nestjs/common`), SHALL NOT insertar fila en `pet_devices`,
  SHALL NOT modificar `devices.status` y SHALL NOT escribir en `audit_log`.
  `mapDeviceError()`
  (`src/modules/devices/infrastructure/mappers/device-error.mapper.ts`) SHALL
  traducirlo a `402` con el body exacto de R8.
  El **orden** de comprobaciones SHALL quedar: membresía → `404` genérico
  (línea 46) · rol distinto de `owner` → `403` (línea 51) · device inexistente
  → `404 DEVICE_NOT_FOUND` (línea 58) · device ya asignado o `inactive` →
  `409 DEVICE_ALREADY_ASSIGNED` (línea 65) · mascota con collar activo →
  `409 PET_ALREADY_HAS_DEVICE` (línea 73) · **sin suscripción → `402`**. El
  `402` va **último**: solo lo ve quien ya demostró membresía de `owner` y un
  código de activación válido, así que no revela nada que no supiera.

### Gate 3 — las lecturas de tracking

- **R8**: THE SYSTEM SHALL introducir el guard
  `PetTrackingGuard`
  (`backend-pet-tracker/src/modules/subscriptions/infrastructure/guards/pet-tracking.guard.ts`,
  `implements CanActivate`), que lee `request.petMembership.petId` — el campo que
  `PetAccessGuard` adjunta en
  `src/modules/pets/infrastructure/guards/pet-access.guard.ts:76` — y llama
  `isPetTracked()`. IF devuelve `false` THEN THE SYSTEM SHALL lanzar
  `new HttpException(body, HttpStatus.PAYMENT_REQUIRED)` con este body **exacto**:

  ```json
  {
    "statusCode": 402,
    "code": "DEVICE_SUBSCRIPTION_REQUIRED",
    "message": "Pet tracking requires an active device subscription"
  }
  ```

  El literal `'DEVICE_SUBSCRIPTION_REQUIRED'` SHALL venir de la constante
  exportada `DEVICE_SUBSCRIPTION_REQUIRED` de
  `src/modules/subscriptions/domain/errors/subscription.errors.ts` (un solo
  sitio; R7 la reutiliza). `@nestjs/common` **no exporta**
  `PaymentRequiredException`: se usa `HttpException` con
  `HttpStatus.PAYMENT_REQUIRED` (= `402`, verificado en
  `node_modules/@nestjs/common/enums/http-status.enum.d.ts:28`).

  El guard SHALL componerse **después** de `PetAccessGuard`
  (`@UseGuards(PetAccessGuard, PetTrackingGuard)`) y SHALL NOT modificar
  `PetAccessGuard`, cuyo contrato lo cerró la spec de #5. Consecuencias
  verificables:
  - Petición sin membresía activa sobre una mascota **con** suscripción vigente
    → `404` genérico y **nunca** `402`: un `402` sobre una mascota ajena
    filtraría que existe (brief §4).
  - `:petId` malformado → `404` sin tocar la base (R10 de #5), antes del `402`.
  - Rol insuficiente donde haya `@RequirePetRole` → `403` antes del `402`.
  - IF `request.petMembership` es `undefined` (guard mal cableado, sin
    `PetAccessGuard` delante) THEN THE SYSTEM SHALL lanzar `NotFoundException()`
    y **no** consultar suscripciones: falla cerrado y sin filtrar existencia.

- **R9**: THE SYSTEM SHALL aplicar el gate de R8 a **exactamente** estas rutas
  (prefijo global `v1`, `src/main.ts:6`), y a ninguna otra:

  | Ruta | Controller | Gate |
  |---|---|---|
  | `GET /v1/pets/:petId/positions/last` | `positions.controller.ts:40` | 402 |
  | `GET /v1/pets/:petId/positions` | `positions.controller.ts:56` | 402 |
  | `GET /v1/pets/:petId/trips` | `trips.controller.ts:35` | 402 |
  | `GET /v1/pets/:petId/trips/:n` | `trips.controller.ts:50` | 402 |
  | `GET /v1/pets/:petId/activity/daily` | `activity.controller.ts:29` | 402 |
  | `POST /v1/pets/:petId/geofences` | `geofences.controller.ts:51` | 402 |
  | `GET /v1/pets/:petId/geofences` | `geofences.controller.ts:73` | 402 |
  | `GET /v1/pets/:petId/geofences/:geofenceId` | `geofences.controller.ts:83` | 402 |
  | `PATCH /v1/pets/:petId/geofences/:geofenceId` | `geofences.controller.ts:100` | 402 |
  | `DELETE /v1/pets/:petId/geofences/:geofenceId` | `geofences.controller.ts:123` | 402 |

  El gate se declara **a nivel de clase** en los cuatro controllers
  (`PositionsController`, `TripsController`, `ActivityController`,
  `GeofencesController`) — no por método —, así que **todo** el controller de
  geocercas queda detrás del 402, escrituras incluidas (decisión D6: una regla
  y no cinco excepciones; nada se destruye, las geocercas sobreviven al impago
  y reaparecen al pagar, igual que el device nunca se libera).

  THE SYSTEM SHALL dejar **fuera** del gate, respondiendo exactamente igual que
  hoy: `/v1/health`, `/v1/auth/*`, `/v1/me`, `/v1/pets` (POST · GET · GET `:id`
  · PATCH · DELETE), `/v1/pets/:petId/photo-upload-url`,
  `/v1/pets/:petId/vaccines/*`, `/v1/vaccine-catalog`,
  `/v1/pets/:petId/weights`, `/v1/pets/:petId/reminders`, `/v1/reminders`,
  `GET /v1/pets/:petId/device` y `DELETE /v1/pets/:petId/device`. Los dos
  últimos son gestión del collar, no lectura de GPS: `GET` devuelve el mismo
  `DeviceStatusResponse` que la clave congelada `device` de
  `PetProfileResponse` (que no se gatea, R13) y bloquear el `DELETE` dejaría al
  owner sin poder soltar un collar que no puede pagar.

  THE SYSTEM SHALL NOT registrar **ninguna ruta HTTP nueva**: tras esta feature
  el conjunto de rutas de `AppModule` es idéntico al de antes (ningún
  `*.controller.ts` nuevo; los existentes solo ganan `PetTrackingGuard` en su
  `@UseGuards`). El `status` se administra por terminal (R12).

- **R10**: WHEN se sirve `GET /v1/alerts`
  (`src/modules/alerts/infrastructure/alerts.controller.ts:41`), THE SYSTEM
  SHALL **filtrar** las alertas de mascotas sin entitlement en vez de responder
  `402`: `AlertDrizzleRepository.listForMember()` y `findForMember()`
  (`src/modules/alerts/infrastructure/repositories/alert.drizzle.repository.ts:45`
  y `:82`) SHALL
  añadir a su join existente sobre `pet_users` un `innerJoin` a `pet_devices`
  (`released_at IS NULL`) y `device_subscriptions` con
  `entitledDeviceSubscription()`. Motivo: la ruta es multi-mascota y un `402`
  global escondería las alertas de la mascota **sí** pagada de un usuario con
  dos mascotas, además de no ser accionable ("¿pagar cuál?").
  Consecuencias verificables:
  - Usuario con mascota A (suscripción vigente) y B (sin ella): la respuesta
    contiene alertas de A y **cero** de B; `statusCode` sigue siendo `200`.
  - `POST /v1/alerts/:id/ack` sobre una alerta de una mascota sin entitlement →
    el `404` que ya emite hoy la alerta no visible (vía `findForMember()` →
    `mapAlertError`), **no** un `402`.
  - Ninguna ruta bajo `/v1/alerts` SHALL responder `402` nunca.
  - El cursor keyset `(opened_at, id)` y su validación por `status`
    (`list-alerts.use-case.ts:80`) SHALL quedar sin cambios: filtrar filas no
    altera el orden ni el shape del cursor.

- **R11**: WHEN un usuario con membresía activa y rol **distinto de `owner`**
  (`family`, `walker` o `vet`) consulta cualquiera de las rutas gateadas de R9
  sobre una mascota cuyo collar tiene suscripción vigente, THE SYSTEM SHALL
  responder exactamente lo mismo que al `owner` (`200`, nunca `402`), sin que
  ese usuario tenga ninguna suscripción a su nombre — no existe ninguna tabla
  ni columna que ligue una suscripción a un `user_id`. Verificable con un e2e
  de dos usuarios sobre la misma mascota.

### Gate 4 — el ai-explainer de #18

- **R12**: WHILE `nutrition-ai-explainer` (#18) sigue en `pending` — no existe
  `src/modules/nutrition/`, ni ninguna clave `aiExplanation` en el código —
  THE SYSTEM SHALL cumplir el cuarto punto de gate **solo por contrato**:
  (a) `SubscriptionRepository.isPetTracked()` queda disponible y exportado por
  `SubscriptionsModule` (R3, R15) como único derivador que #18 debe consumir;
  (b) [[design]] §Contrato heredado por #18 documenta la llamada exacta y la
  regla "sin entitlement ⇒ `200` con `aiExplanation: null`, nunca `402`, nunca
  `5xx`: la IA degrada, no bloquea". THE SYSTEM SHALL NOT crear ningún archivo
  bajo `src/modules/nutrition/` ni ninguna clave `aiExplanation` en esta
  feature: implementar el comportamiento antes de que exista el endpoint sería
  código muerto no testeable. La verificación en runtime del criterio de
  aceptación 6 de #25 pertenece a la spec de #18 y **debe quedar registrada en
  su entrada de `feature_list.json` en el gate humano** (ver §Decisión para el
  gate).

### La administración manual

- **R13**: WHEN se ejecuta
  `pnpm -C backend-pet-tracker run subscription:set -- (--unit-id <id> | --device-id <uuid>) [--status active|canceled] [--plan track_monthly|grandfathered] [--period-end <ISO-8601>]`
  (script nuevo `backend-pet-tracker/scripts/set-device-subscription.ts`,
  función exportada
  `setDeviceSubscription(db: NodePgDatabase, input: SetDeviceSubscriptionInput): Promise<SetDeviceSubscriptionResult>`,
  entrada nueva `"subscription:set": "ts-node -r tsconfig-paths/register scripts/set-device-subscription.ts"`
  en `package.json`), THE SYSTEM SHALL:
  - resolver el `device_id` a partir de `--device-id` o de
    `devices.wialon_unit_id = --unit-id`;
  - hacer **upsert idempotente** sobre `device_subscriptions`
    (`onConflictDoUpdate({ target: deviceSubscriptions.deviceId, ... })`) con
    `status` (default `'active'`), `plan_code` (default `'track_monthly'`),
    `current_period_end` (default `now + 30 días`) y `updated_at = now()`;
  - aplicar el reset de watermark de R6 solo en la transición
    no-vigente → vigente, decidida llamando
    `new SubscriptionDrizzleRepository(db).isDeviceEntitled(deviceId)` antes y
    después del upsert (**nunca** re-escribiendo el predicado de R2);
  - imprimir por stdout una línea con `deviceId`, `status`, `planCode`,
    `currentPeriodEnd`, si quedó `entitled` y si reseteó el watermark, y salir
    con código `0`;
  - dejar `devices.status` y `pet_devices` intactos (R5).

  WHEN se ejecuta **dos veces seguidas** con los mismos argumentos, THE SYSTEM
  SHALL producir el mismo estado final y **una sola** fila para ese
  `device_id`. IF no se pasa ni `--device-id` ni `--unit-id`, IF se pasan los
  dos, IF el `--status`/`--plan` no está en el enum de R1, IF `--period-end` no
  parsea como fecha, o IF ningún device coincide, THEN THE SYSTEM SHALL abortar
  con un error explícito que nombre el argumento culpable, **sin escribir
  ninguna fila**, y salir con código distinto de `0`.

  THE SYSTEM SHALL NOT exponer un endpoint HTTP de administración: exigiría un
  modelo de **rol de plataforma** que hoy no existe — `pet_users.role` es rol
  **por mascota**, no global (mismo criterio con el que se cerró #24, ver
  `specs/device-provisioning-admin/requirements.md` §Fuera de alcance).

- **R14**: THE SYSTEM SHALL NOT acoplarse a ningún proveedor de pagos:
  `grep -rni "stripe\|paypal\|mercadopago\|checkout.session\|webhook" backend-pet-tracker/src/`
  SHALL devolver **cero** coincidencias tras esta feature, no SHALL aparecer
  ninguna dependencia nueva en `backend-pet-tracker/package.json`, y no SHALL
  añadirse ninguna variable de entorno (nada nuevo en `.env.example` ni en la
  tabla de `docs/conventions.md` §Variables de entorno; la gracia es una
  constante de código, D2). El día que entre el proveedor, su webhook escribe
  la misma fila con el mismo upsert de R13 y ningún otro archivo cambia — eso
  es lo que esta separación compra.

### Cableado y contrato

- **R15**: THE SYSTEM SHALL declarar
  `backend-pet-tracker/src/modules/subscriptions/subscriptions.module.ts`
  (`export class SubscriptionsModule`) con `providers: [PetTrackingGuard,
  { provide: SUBSCRIPTION_REPOSITORY, useClass: SubscriptionDrizzleRepository }]`
  y `exports: [SUBSCRIPTION_REPOSITORY, PetTrackingGuard]`, sin `controllers`.
  THE SYSTEM SHALL importarlo desde `PositionsModule`, `ActivityModule`,
  `GeofencesModule` (para que Nest resuelva las dependencias del guard
  declarado en sus controllers) y `DevicesModule` (para R7). `AlertsModule` y
  `IngestionModule` SHALL NOT importarlo: solo usan el predicado SQL de R2, que
  es un import de función, no una inyección. `SubscriptionsModule` SHALL NOT
  importar ningún módulo de dominio (`DRIZZLE` lo provee `DrizzleModule`, que es
  `@Global()`), de modo que no puede cerrar ningún ciclo. IF la app arranca
  (`pnpm -C backend-pet-tracker run build` + los e2e existentes) THEN el
  cableado es correcto: un guard sin su provider explota en la primera petición.

- **R16**: THE SYSTEM SHALL dejar **sin cambio de forma** el contrato HTTP de
  todo lo que ya existe. En particular `PetProfileResponse`
  (`src/modules/pets/infrastructure/mappers/pet-profile-response.mapper.ts:18`)
  SHALL seguir teniendo exactamente estas 24 claves y ninguna más:
  `id`, `name`, `species`, `breed`, `sex`, `birthDate`, `approxAgeMonths`,
  `ageMonths`, `currentWeightKg`, `size`, `color`, `sterilized`, `microchip`,
  `photoUrl`, `lostMode`, `lastPosition`, `lastCommunicationAt`, `myRole`,
  `device`, `nextVaccine`, `nextReminder`, `activitySummary`, `createdAt`,
  `updatedAt`. `DeviceStatusResponse` SHALL seguir con sus 5 claves
  (`model`, `batteryPct`, `connectivity`, `lastMessageAt`, `esn`).
  THE SYSTEM SHALL NOT añadir ninguna clave `subscription`, `tracked`,
  `entitled`, `planCode` ni `currentPeriodEnd` a **ninguna** respuesta HTTP
  (verificable por grep sobre `src/modules/**/mappers/`). WHEN hay entitlement,
  las respuestas de `positions`, `trips`, `activity/daily`, `geofences` y
  `alerts` SHALL ser byte-a-byte las de hoy (mismos mappers, sin tocar).
  Consecuencia aceptada: el cliente descubre la falta de entitlement **por el
  `402`**, no por un campo — exponerlo en el perfil es una feature aparte
  (§Fuera de alcance).

### Que el entorno local no se apague

- **R17**: WHEN se aplica la migración de R1 sobre una base que **ya tiene**
  devices — los simulados de `scripts/seed-devices.ts` (`SIM-001..003` /
  `ACT-001..003`, unidades `900001..900003`, ver
  `src/db/seed/simulated-devices.ts`) y el collar real aprovisionado por #24
  (unidad Wialon `401775970`) — THE SYSTEM SHALL insertar en la **misma
  migración**, como sentencia añadida a mano tras el DDL generado, una fila de
  suscripción por cada device preexistente:

  ```sql
  INSERT INTO device_subscriptions (device_id, status, plan_code, current_period_end)
  SELECT id, 'active', 'grandfathered', '2099-12-31T00:00:00Z'::timestamptz
  FROM devices
  ON CONFLICT (device_id) DO NOTHING;
  ```

  Sin este backfill, ningún device tendría entitlement, el poller dejaría de
  encolar, el smoke de GPS real de #24 dejaría de funcionar y todos los e2e de
  tracking se pondrían rojos: la feature se leería como una regresión total.
  El `'2099-12-31'` es un centinela explícito y greppable — evita inventar un
  estado "perpetuo" que la regla de R2 tendría que conocer.

  THE SYSTEM SHALL además extender `seedSimulatedDevices()`
  (`backend-pet-tracker/scripts/seed-devices.ts:21`) para que, tras el
  `insert ... onConflictDoNothing` que ya hace, inserte con
  `onConflictDoNothing` una suscripción `status='active'`,
  `plan_code='grandfathered'`, `current_period_end='2099-12-31'` para cada
  `SIMULATED_DEVICES` — si no, una base recreada desde cero queda con collares
  simulados inclaimables (R7) e inpoleables (R4). El `onConflictDoNothing`
  sobre `devices.esn` que ya existe SHALL conservarse tal cual: re-sembrar
  nunca resetea nada. (Esto **enmienda** deliberadamente el R6 de #24, que
  congelaba este archivo; #24 está `done` y su congelación era el alcance de
  esa feature, no una prohibición permanente.)

- **R18**: WHEN se cierra esta feature, `docs/data-model.md` SHALL contener
  `device_subscriptions` en el ERD (`devices ||--o| device_subscriptions`) y una
  fila en §Catálogo de tablas que documente las columnas, el enum de `status`,
  que la gracia es **derivada** de `current_period_end` +
  `DEVICE_SUBSCRIPTION_GRACE_DAYS` y no un estado, y los tres caminos de alta
  de fila (backfill de la migración, `seed:devices`, `subscription:set`).
  Verificable leyendo el documento.

## Decisión para el gate humano

**No la inventes: el humano decide y anota su elección antes de aprobar.**

El criterio de aceptación 6 de #25 ("ai-explainer sin entitlement devuelve 200
con `aiExplanation` null") describe el comportamiento de una feature que **no
existe todavía** (#18 `nutrition-ai-explainer`, `pending`; tampoco existe #17
`nutrition-profile-engine`, de la que depende). R12 lo cubre por contrato, no
por runtime.

- [x] **Opción A — ELEGIDA POR EL HUMANO (2026-08-17)**: aprobar R12 tal cual y
      **trasladar el criterio a la entrada #18 de `feature_list.json`** como
      criterio de aceptación propio ("sin entitlement de la mascota,
      `aiExplanation` es `null` con `200`, consumiendo
      `SubscriptionRepository.isPetTracked()`; no se recalcula la regla"). #25
      cierra sin ese runtime. **Traslado ya ejecutado**: el criterio es el
      quinto de `acceptance_criteria` en la entrada 18 de `feature_list.json`.
- [ ] ~~**Opción B**: bloquear #25 hasta que #17 y #18 estén `done`, e
      implementar los cuatro gates juntos.~~ Descartada: #25 es P2 y desbloquea
      el ahorro del poller ya; #17/#18 son features de nutrición con su propio
      diseño pendiente.

## Fuera de alcance

- **Integración de pagos (Stripe o cualquier otro proveedor)**: el `status` se
  administra por terminal (R13). Decisión explícita de la sesión del
  2026-08-14, verificada por el grep de R14.
- **Historial de suscripciones / auditoría de cambios de plan**: una fila por
  device (`device_id` es PK, D3). `audit_log` exige un `user_id` de `users` y el
  script no corre en nombre de ningún usuario de la aplicación — mismo
  razonamiento que cerró #24. Cuando entre el proveedor de pagos, el historial
  lo tendrá él.
- **Precios, monedas, catálogo real de planes, prorrateo, cupones,
  trials**: `plan_code` solo distingue los dos valores que producen los dos
  caminos de escritura de esta fase (R1).
- **Exponer el entitlement en alguna respuesta HTTP** (`tracked` en
  `PetProfileResponse`, `GET /v1/pets/:petId/subscription`): R16 lo prohíbe. Es
  una feature aparte, con su decisión de contrato y su spec.
- **Endpoint HTTP de administración** (R13) y **rol de plataforma**: no existe
  el modelo y esta feature no lo inventa.
- **Cualquier cambio en `PetAccessGuard`** (#5) ni en el contrato de
  `IngestionStore`, `PollerService`, `PositionsConsumerService` (#8), ni en los
  mappers de respuesta de #7, #9, #10, #11, #13 (R16).
- **Gatear el consumidor SQS, el alerts-engine, el notifier o el agregador de
  actividad**: son aguas abajo del poller. Sin mensajes encolados no evalúan
  nada, y descartar un mensaje ya en vuelo perdería datos de un periodo
  **pagado** ([[design]] D7).
- **Código de nutrición (#17/#18)** (R12).
- **Cambios en la infra CDK (`infra/`)**: la tabla es Postgres, nada nuevo en
  AWS.
- **Aplicar la migración contra cualquier base que no sea la local de Docker**,
  y **volver a correr el smoke de GPS real** contra la cuenta Wialon: eso lo
  hace el humano (`CLAUDE.md` §Excepciones).

## Aprobación

- [x] Decisión para el gate cerrada: **Opción A**, 2026-08-17
- [X] Aprobado por humano (fecha: 2026-08-17) ← gate obligatorio antes de implementar

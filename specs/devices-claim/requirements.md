---
feature: "devices-claim"
status: approved     # draft | approved
tags: [harness, spec]
---

# Requisitos — [[devices-claim]]

> Notación EARS. Cada requisito tiene id único R<n>, inmutable una vez aprobado.
> Ver [[design]] para las decisiones técnicas y [[../../docs/architecture|architecture]]
> para las reglas de arquitectura que la implementación debe respetar.
>
> Fuente: `feature_list.json` id 7 (description + acceptance_criteria),
> `plans/005-collar-wialon-ingesta.md` §Paso 2, `docs/brief.md` §7 (asociación
> de collar: "validar que el dispositivo exista, esté disponible y no esté
> asociado activamente a otra mascota"), `docs/data-model.md` filas `devices`
> y `pet_devices`.
>
> Depende de: `pets-crud-permissions` (#5, `done`) — `PetAccessGuard` +
> `@RequirePetRole()` y el token `PET_REPOSITORY` que `PetsModule` **exporta**
> se reutilizan tal cual, NO se redefinen; y `auth-registration` (#3, `done`)
> — el puerto `AuditLogger` / token `AUDIT_LOGGER` (`src/audit/`, módulo
> `@Global()`) ya existe: cero migraciones nuevas para `audit_log`.
>
> Endpoints cubiertos: `POST /v1/devices/claim`,
> `GET /v1/pets/:petId/device`, `DELETE /v1/pets/:petId/device`. Ninguno es
> `@Public()`. Esta feature también sustituye el placeholder `device: null`
> del contrato de perfil (R8 de [[../pets-crud-permissions/requirements|pets-crud-permissions]])
> por datos reales — sin cambiar la forma del contrato.
>
> Qué NO ingesta esta feature: `batteryPct`, `connectivity` y `lastMessageAt`
> permanecen `NULL` hasta que el pipeline (#8 `wialon-ingestion-pipeline`)
> los alimente. Aquí solo se crean las columnas y el contrato que las expone.

## Requisitos funcionales

### Persistencia (schema y migración)

- **R1**: WHEN se ejecutan las migraciones Drizzle sobre una base al día,
  THE SYSTEM SHALL crear las tablas `devices` y `pet_devices` conforme a
  `docs/data-model.md` (con las clarificaciones de la decisión abierta D2/D4):
  - `devices`: `id` uuid PK (UUIDv7 generado en app), `esn` UNIQUE NULL,
    `imei` UNIQUE NULL, `serial_number` UNIQUE NULL, `activation_code`
    UNIQUE NULL, `wialon_unit_id` UNIQUE NULL, `model` NULL, `status` NOT
    NULL DEFAULT `'available'` con CHECK en
    `('available','assigned','inactive')`, `battery_pct` integer NULL,
    `connectivity` NULL, `last_message_at` timestamptz NULL,
    `ingest_watermark` timestamptz NULL, `is_simulated` boolean NOT NULL
    DEFAULT false, `created_at` / `updated_at` timestamptz NOT NULL DEFAULT
    now().
  - `pet_devices`: `id` uuid PK (UUIDv7), `pet_id` FK → `pets.id` ON DELETE
    CASCADE NOT NULL, `device_id` FK → `devices.id` NOT NULL (sin CASCADE:
    los devices no se borran en el MVP), `assigned_at` timestamptz NOT NULL
    DEFAULT now(), `released_at` timestamptz NULL.
  - Índices sobre `pet_devices`: único parcial `(device_id) WHERE
    released_at IS NULL` (un device solo puede estar activo en una mascota
    — `docs/data-model.md`), único parcial `(pet_id) WHERE released_at IS
    NULL` (una mascota solo lleva un collar activo — decisión abierta D2),
    e índices btree normales sobre `pet_id` y `device_id` (regla de
    `docs/data-model.md`: toda FK lleva índice manual; los parciales no
    cubren las consultas de historial).

  La migración generada SHALL NOT crear ni modificar ninguna otra tabla
  (`audit_log`, `pets`, `pet_users`, `users` quedan intactas). Verificable
  inspeccionando el SQL de la migración nueva en `src/db/migrations/`.

### Seed de dispositivos simulados

- **R2**: WHEN se ejecuta `pnpm run seed:devices` contra una base migrada,
  THE SYSTEM SHALL dejar en `devices` exactamente estas 3 filas simuladas
  (insertándolas si faltan): `esn` `SIM-001`/`SIM-002`/`SIM-003`,
  `activation_code` `ACT-001`/`ACT-002`/`ACT-003`, `wialon_unit_id`
  `900001`/`900002`/`900003` respectivamente, todas con `is_simulated =
  true`, `model = 'sim-collar'` y `status = 'available'`, y terminar con
  exit code 0. WHEN el script se ejecuta por segunda vez (o N veces), THE
  SYSTEM SHALL terminar igualmente con exit 0 **sin** insertar duplicados y
  **sin** modificar las filas ya existentes — en particular, un device que
  esté `assigned` en ese momento SHALL conservar su `status` y su
  asignación. Verificable contando filas y comprobando `status` tras dos
  corridas con un claim de por medio.

### Claim — camino feliz

- **R3**: WHEN un usuario autenticado con `role = 'owner'` sobre la mascota
  envía `POST /v1/devices/claim` con un body válido (R4) cuyo identificador
  corresponde a un device reclamable (sin fila activa en `pet_devices` y
  `status != 'inactive'`), THE SYSTEM SHALL ejecutar **en una única
  transacción de Postgres**: (a) INSERT en `pet_devices` con `pet_id` =
  mascota del body, `device_id` = device encontrado, `assigned_at = now()`,
  `released_at = NULL`; (b) UPDATE de `devices` a `status = 'assigned'` e
  `ingest_watermark = now() − 10 minutos` (arranque de ingesta del poller
  #8, `plans/005` §Paso 2); y responder `201` con el shape de estado de
  device de R11. IF cualquiera de las dos escrituras falla THEN ninguna
  queda persistida.

- **R4**: IF el body de `POST /v1/devices/claim` no valida contra el schema
  zod — `petId` ausente o no-UUID; o el número de identificadores de device
  presentes entre `esn`, `imei`, `serialNumber`, `activationCode` es
  distinto de **exactamente uno**; o el identificador presente es vacío,
  no-string o de más de 64 caracteres — THEN THE SYSTEM SHALL responder
  `400` con el detalle mapeado desde `ZodError`, sin escribir en ninguna
  tabla.

### Claim — validaciones de acceso y disponibilidad (en este orden)

- **R5**: IF el `petId` del body no existe en `pets`, **o** existe pero el
  usuario autenticado no tiene fila en `pet_users` con `status = 'active'`,
  THEN THE SYSTEM SHALL responder `404` con el mismo body genérico que
  produce `PetAccessGuard` (R9 de #5) — **antes** de ejecutar cualquier
  consulta sobre `devices`, de modo que la respuesta no revele ni la
  existencia de la mascota ni la del device. Test e2e obligatorio: usuario
  B hace claim de un device disponible sobre una mascota de A → `404` (no
  `409`, no `403`).

- **R6**: IF el usuario autenticado tiene membresía activa sobre la mascota
  pero su `role` no es `'owner'` THEN THE SYSTEM SHALL responder `403` sin
  escribir en ninguna tabla — misma precedencia que #5: sin membresía es
  `404` (R5), nunca `403`.

- **R7**: IF ningún device tiene el valor enviado en la columna
  correspondiente al identificador del body (`esn`, `imei`,
  `serial_number` o `activation_code`) THEN THE SYSTEM SHALL responder
  `404` con código `DEVICE_NOT_FOUND` en el body de error, sin escribir en
  ninguna tabla.

- **R8**: IF el device existe pero no es reclamable — existe una fila en
  `pet_devices` con ese `device_id` y `released_at IS NULL` (incluye el
  segundo claim del mismo device, sea de la misma mascota o de otra), **o**
  su `status = 'inactive'` — THEN THE SYSTEM SHALL responder `409` con
  código `DEVICE_ALREADY_ASSIGNED`, sin escribir en ninguna tabla. WHILE
  dos claims del mismo device compiten concurrentemente, THE SYSTEM SHALL
  garantizar que a lo sumo uno responde `201`: el índice único parcial de
  R1 rechaza el segundo INSERT y esa violación de unicidad se mapea al
  mismo `409` (nunca un `500`).

- **R9**: IF la mascota del body ya tiene una fila activa en `pet_devices`
  (otro collar sin `released_at`) THEN THE SYSTEM SHALL responder `409` con
  código `PET_ALREADY_HAS_DEVICE`, sin escribir en ninguna tabla — una
  mascota lleva a lo sumo un collar activo (decisión abierta D2).

- **R10**: WHEN la transacción de R3 se confirma con éxito, THE SYSTEM
  SHALL registrar a través del puerto `AuditLogger` existente una entrada
  con `action = 'device.claim'`, `entity = 'device'`, `entityId` = id del
  device, `userId` = usuario autenticado y `meta = { petId }` (nunca el
  identificador enviado); IF la transacción falla THEN no se escribe nada
  en `audit_log`.

### Estado del device

- **R11**: WHEN un usuario con membresía activa (cualquier rol — sin
  `@RequirePetRole`) envía `GET /v1/pets/:petId/device`, THE SYSTEM SHALL
  responder `200` con exactamente estas claves si la mascota tiene collar
  activo: `model`, `batteryPct`, `connectivity`, `lastMessageAt`, `esn` —
  con los valores de la fila de `devices` (los tres del medio son `null`
  hasta que #8 los alimente) — y con body JSON `null` si no lo tiene. La
  ruta va protegida por el `PetAccessGuard` **existente**: `:petId`
  inexistente, malformado o sin membresía activa → `404` genérico (R9/R10
  de #5, sin test nuevo del guard, solo e2e de la ruta).

- **R12**: WHEN un usuario con membresía activa envía `GET /v1/pets/:petId`
  (perfil de #5) y la mascota tiene collar activo, THE SYSTEM SHALL incluir
  en la clave `device` del contrato R8 de #5 el mismo objeto de R11 (mismas
  cinco claves, mismo mapper) en lugar del `null` placeholder; IF la
  mascota no tiene collar activo THEN `device` sigue siendo `null`. El
  resto del contrato de perfil SHALL NOT cambiar (ni claves nuevas ni
  renombradas).

### Release

- **R13**: WHEN un usuario con `role = 'owner'` envía `DELETE
  /v1/pets/:petId/device` y la mascota tiene collar activo, THE SYSTEM
  SHALL ejecutar en una única transacción: (a) UPDATE de la fila activa de
  `pet_devices` a `released_at = now()`; (b) UPDATE del device a `status =
  'available'`; responder `204` sin body; y tras el commit registrar vía
  `AuditLogger` una entrada `action = 'device.release'`, `entity =
  'device'`, `entityId` = id del device, `userId` = actor, `meta = {
  petId }`. WHEN después del release cualquier owner (mismo u otro usuario)
  hace claim del mismo device, THE SYSTEM SHALL responder `201` — el ciclo
  claim → release → claim es completo y verificable e2e.

- **R14**: IF `DELETE /v1/pets/:petId/device` llega sin collar activo para
  esa mascota THEN THE SYSTEM SHALL responder `404` con código
  `DEVICE_NOT_ASSIGNED`; IF el actor tiene membresía activa pero `role !=
  'owner'` THEN `403` (`@RequirePetRole('owner')`); IF no tiene membresía
  activa o la mascota no existe THEN `404` genérico del guard — el `404`
  de membresía precede siempre al `403` de rol (semántica heredada de #5,
  verificada e2e sobre esta ruta).

### Resiliencia del ciclo de vida

- **R15**: WHEN una mascota con collar activo se elimina vía `DELETE
  /v1/pets/:petId` (#5 — el ON DELETE CASCADE de R1 borra sus filas de
  `pet_devices` y nadie actualiza `devices.status`), THE SYSTEM SHALL
  seguir considerando el device reclamable: un `POST /v1/devices/claim`
  posterior con su identificador sobre otra mascota responde `201`, aunque
  `devices.status` haya quedado en `'assigned'`. La disponibilidad se
  deriva de la **fila activa en `pet_devices`** (fuente de verdad,
  respaldada por el índice único parcial); `devices.status` es caché de
  presentación (decisión abierta D3). Test e2e obligatorio: claim → borrar
  mascota → claim con otra mascota → `201`.

## Decisiones abiertas (requieren input humano en el gate)

- **D1 — Autorización del claim sin `:petId` en la ruta**: el contrato del
  plan (`POST /v1/devices/claim`) lleva el `petId` en el body, y
  `PetAccessGuard` lee `request.params.petId` — no aplica tal cual. La spec
  propone (R5/R6) replicar la semántica dentro del use case vía
  `PET_REPOSITORY.findMembership()` (que `PetsModule` ya exporta): mismo
  `404` genérico, mismo orden 404→403. Alternativas: extender
  `PetAccessGuard` para leer `body.petId` (toca un guard con spec aprobada
  de #5), o mover la ruta a `POST /v1/pets/:petId/device` (rompe el
  contrato OpenAPI del plan 005). **Confirmar la opción del use case o
  elegir otra.**
- **D2 — Segundo índice único parcial sobre `pet_id` + error
  `PET_ALREADY_HAS_DEVICE` (R9)**: `docs/data-model.md` solo documenta el
  índice parcial sobre `device_id`, pero la descripción de la feature dice
  "un collar activo por mascota" y `GET /v1/pets/:petId/device` devuelve un
  objeto singular. La spec añade el índice sobre `pet_id` y el `409`
  correspondiente. **Confirmar (implica actualizar `docs/data-model.md`
  tras la migración) o eliminar R9 y el índice.**
- **D3 — Disponibilidad derivada de la fila activa, no de
  `status='available'` literal (R8/R15)**: el plan 005 dice "status
  'available' **y** sin fila activa"; con el CASCADE de `pet_devices` al
  borrar una mascota, el check literal dejaría devices huérfanos en
  `'assigned'` irreclamables para siempre. La spec trata `status` como
  caché y la fila activa como fuente de verdad (`'inactive'` sigue vetando
  el claim). **Confirmar la deviación o exigir el check literal del plan y
  decidir qué pasa al borrar una mascota con collar.**
- **D4 — UNIQUE en `activation_code` y `serial_number`**:
  `docs/data-model.md` solo marca UNIQUE `esn`, `imei` y `wialon_unit_id`,
  pero el claim busca por cualquiera de los cuatro identificadores y un
  match múltiple sería ambiguo. La spec los hace UNIQUE (R1). **Confirmar
  (con actualización de `docs/data-model.md`) o definir la regla de
  desambiguación.**

## Fuera de alcance

- **Ingesta de telemetría**: `battery_pct`, `connectivity`,
  `last_message_at`, `pets.last_position` y el avance de
  `ingest_watermark` los escribe el pipeline (#8). Aquí solo se fija el
  valor inicial del watermark en el claim (R3).
- **Código QR** (brief §7): post-MVP según plan 005 ("el alta acepta
  código manual"); el valor escaneado llegaría como uno de los cuatro
  identificadores existentes, sin campo nuevo.
- **Endpoints de posiciones** (`GET .../positions/last`, historial): son
  `positions-api` (#9).
- **Gestión de inventario de devices** (alta/baja/`status='inactive'`
  vía API, panel admin): no hay endpoints de administración; el seed es la
  única alta del MVP.
- **Pantallas móviles** (plan 005 §Paso 6): fuera del backend.
- **Notificar o emitir eventos al bus por claim/release**: ningún plan lo
  pide; los eventos del bus nacen en #8.
- **Transferencia directa de collar entre mascotas** (claim sobre device
  asignado "robándolo"): flujo explícito release → claim, sin atajo.
- **Variables de entorno nuevas**: ninguna (`SIM_MODE` llega con #8).

## Aprobación

- [x] Aprobado por humano (fecha: 2026-08-01, D1-D4 aceptadas como propone la spec) ← gate obligatorio antes de implementar

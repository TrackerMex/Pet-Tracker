---
feature: "pets-crud-permissions"
status: approved        # draft | approved
tags: [harness, spec]
---

# Requisitos — [[pets-crud-permissions]]

> Notación EARS. Cada requisito tiene id único R<n>, inmutable una vez aprobado.
> Ver [[design]] para las decisiones técnicas y [[../../docs/architecture|architecture]]
> para las reglas de arquitectura que la implementación debe respetar.
>
> Fuente: `feature_list.json` id 5 (description + acceptance_criteria),
> `docs/brief.md` §4 (tipos de usuario y permisos por mascota), §7 (alta de
> mascota), §8 (perfil de mascota), `docs/data-model.md` filas `pets` y
> `pet_users`.
>
> Depende de: `auth-login-me` (#4, `done`) — `AuthGuard` global +
> `@CurrentUser()` proveen la identidad autenticada; y `auth-registration`
> (#3, `done`) — la tabla `audit_log` y el puerto `AuditLogger`
> (`src/audit/`, módulo `@Global()`) **ya existen**: esta feature los
> reutiliza y NO genera ninguna migración para `audit_log`.
>
> Endpoints cubiertos: `POST /v1/pets`, `GET /v1/pets`,
> `GET /v1/pets/:petId`, `PATCH /v1/pets/:petId`, `DELETE /v1/pets/:petId`.
> Todos requieren token (ninguno es `@Public()`). Esta spec también introduce
> `PetAccessGuard` + `@RequirePetRole()`, el mecanismo de autorización por
> mascota que **todas** las features posteriores con `:petId` reutilizan
> (#6, #7, #9, #10, #11, #14, #15, #16).

## Requisitos funcionales

### Persistencia (schema y migración)

- **R1**: WHEN se ejecutan las migraciones Drizzle sobre una base vacía, THE
  SYSTEM SHALL crear las tablas `pets` y `pet_users` conforme a
  `docs/data-model.md`:
  - `pets`: `id` uuid PK (UUIDv7 generado en app), `name` NOT NULL,
    `species` NOT NULL con CHECK en `('dog','cat')`, `breed` NULL,
    `birth_date` date NULL, `approx_age_months` integer NULL, `sex` NULL,
    `current_weight_kg` numeric(5,2) NULL, `size` NULL, `color` NULL,
    `sterilized` boolean NULL, `microchip` NULL, `photo_key` NULL,
    `lost_mode` boolean NOT NULL DEFAULT false, `last_position` jsonb NULL,
    `last_communication_at` timestamptz NULL, `created_at` / `updated_at`
    timestamptz NOT NULL DEFAULT now().
  - `pet_users`: PK compuesta `(pet_id, user_id)`, `pet_id` FK → `pets.id`
    ON DELETE CASCADE, `user_id` FK → `users.id` ON DELETE CASCADE, `role`
    NOT NULL con CHECK en `('owner','family','walker','vet')`,
    `permissions` jsonb NULL, `status` NOT NULL DEFAULT `'active'`,
    `created_at` timestamptz NOT NULL DEFAULT now(); índice manual sobre
    `user_id` (regla de `docs/data-model.md`: toda FK lleva índice; `pet_id`
    ya queda cubierta como primera columna de la PK).

  La migración generada SHALL NOT crear ni modificar `audit_log` — esa tabla
  ya existe (creada por `auth-registration` #3). Verificable inspeccionando
  el SQL de la migración nueva en `src/db/migrations/`.

### Creación

- **R2**: WHEN un usuario autenticado envía `POST /v1/pets` con un body que
  valida contra el schema zod (R4, R5), THE SYSTEM SHALL insertar **en una
  única transacción de Postgres** la fila `pets` y la fila `pet_users` con
  `pet_id` = mascota creada, `user_id` = usuario autenticado,
  `role = 'owner'`, `status = 'active'`, y responder `201` con el perfil del
  recurso creado (mismo shape que R8, con `myRole = 'owner'`). IF cualquiera
  de los dos inserts falla THEN ninguna de las dos filas debe quedar
  persistida (verificable forzando el fallo del segundo insert en un test de
  integración y comprobando que `pets` queda vacío).

- **R3**: WHEN la transacción de R2 se confirma con éxito, THE SYSTEM SHALL
  registrar a través del puerto `AuditLogger` existente una entrada con
  `action = 'pet.create'`, `entity = 'pet'`, `entityId` = id de la mascota y
  `userId` = id del creador.

- **R4**: IF el body de `POST /v1/pets` no valida contra el schema zod —
  `name` ausente, vacío o de más de 120 caracteres; `species` fuera de
  `{'dog','cat'}`; `birthDate` con formato distinto de fecha ISO
  (`YYYY-MM-DD`) o posterior a la fecha actual; `approxAgeMonths` no entero
  o fuera del rango `[0, 480]`; `weightKg` presente y no en el rango
  `(0, 999.99]`; `sex` presente y fuera de `{'male','female'}`; `size`
  presente y fuera de `{'small','medium','large'}`; `sterilized` presente y
  no booleano; `microchip` presente y de más de 32 caracteres — THEN THE
  SYSTEM SHALL responder `400` con el detalle mapeado desde `ZodError`, sin
  escribir en `pets`, `pet_users` ni `audit_log`.

- **R5**: IF el body de `POST /v1/pets` incluye `birthDate` y
  `approxAgeMonths` a la vez, o no incluye ninguno de los dos, THEN THE
  SYSTEM SHALL responder `400` — exactamente uno de los dos es obligatorio
  (brief §7: "fecha de nacimiento **o** edad aproximada").

### Edad calculada

- **R6**: WHEN el sistema serializa una mascota en cualquier respuesta
  (`POST` 201, `GET` lista, `GET` detalle, `PATCH` 200), THE SYSTEM SHALL
  incluir el campo `ageMonths` calculado así: si la mascota tiene
  `birth_date`, meses completos transcurridos entre `birth_date` y la fecha
  actual; si solo tiene `approx_age_months`, `approx_age_months` + meses
  completos transcurridos desde `created_at` — de modo que la edad avanza
  con el tiempo también para mascotas registradas por edad aproximada.
  Verificable con tests unitarios de la función pura con fechas fijas.

### Listado

- **R7**: WHEN un usuario autenticado envía `GET /v1/pets`, THE SYSTEM SHALL
  responder `200` con un array que contiene **exclusivamente** las mascotas
  para las que existe en `pet_users` una membresía con `status = 'active'`
  de ese usuario, incluyendo en cada elemento `myRole` (el `role` de su
  membresía); IF el usuario no tiene ninguna membresía THEN el array es
  vacío con `200` (nunca 404).

### Perfil de mascota (contrato de respuesta)

- **R8**: WHEN un usuario con membresía activa envía `GET /v1/pets/:petId`,
  THE SYSTEM SHALL responder `200` con exactamente estas claves: `id`,
  `name`, `species`, `breed`, `sex`, `birthDate`, `approxAgeMonths`,
  `ageMonths`, `currentWeightKg`, `size`, `color`, `sterilized`,
  `microchip`, `photoUrl`, `lostMode`, `lastPosition`,
  `lastCommunicationAt`, `myRole`, `device`, `nextVaccine`, `nextReminder`,
  `activitySummary`, `createdAt`, `updatedAt` — donde `device`,
  `nextVaccine`, `nextReminder` y `activitySummary` están **presentes con
  valor `null`** (los rellenan #7, #14, #16 y #10 sin añadir ni renombrar
  claves), y `photoUrl`, `lastPosition`, `lastCommunicationAt` son `null`
  mientras #6 y #8 no los alimenten. El contrato queda fijado: features
  posteriores solo sustituyen `null` por valores.

### Autorización — PetAccessGuard + @RequirePetRole

- **R9**: IF una petición autenticada llega a `GET/PATCH/DELETE
  /v1/pets/:petId` (o a cualquier ruta futura protegida por
  `PetAccessGuard`) con un `:petId` que no existe en `pets`, **o** que
  existe pero sin fila en `pet_users` con `status = 'active'` para el
  usuario autenticado, THEN THE SYSTEM SHALL responder `404` con el mismo
  body genérico en ambos casos — la respuesta no debe permitir distinguir
  si la mascota existe (brief §4: "un usuario no debe poder consultar
  información de una mascota únicamente conociendo su identificador").
  Test e2e obligatorio: usuario B sobre una mascota de A → `404` en
  `GET`, `PATCH` y `DELETE`.

- **R10**: IF el `:petId` de una ruta protegida por `PetAccessGuard` no es
  un UUID sintácticamente válido THEN THE SYSTEM SHALL responder `404` con
  el mismo body que R9, sin ejecutar ninguna consulta a la base.

- **R11**: IF el usuario autenticado tiene membresía activa sobre la
  mascota pero su `role` no está entre los exigidos por el decorador
  `@RequirePetRole(...)` del handler THEN THE SYSTEM SHALL responder `403`.
  `PATCH /v1/pets/:petId` y `DELETE /v1/pets/:petId` van decorados
  `@RequirePetRole('owner')`: un miembro con `role` ∈
  `{'family','walker','vet'}` recibe `403` en ambos. La comprobación de
  membresía (R9) precede siempre a la de rol: sin membresía la respuesta es
  `404`, nunca `403`.

- **R12**: WHEN una petición de un miembro con membresía activa llega a un
  handler protegido por `PetAccessGuard` que **no** declara
  `@RequirePetRole`, THE SYSTEM SHALL permitir el acceso con cualquier
  `role` (`GET /v1/pets/:petId` es accesible a `owner`, `family`, `walker`
  y `vet`).

### Actualización

- **R13**: WHEN un usuario con `role = 'owner'` envía `PATCH
  /v1/pets/:petId` con un subconjunto no vacío de los campos del DTO de
  creación (`name`, `species`, `breed`, `birthDate`, `approxAgeMonths`,
  `sex`, `weightKg`, `size`, `color`, `sterilized`, `microchip`) con
  valores que validan (mismas reglas que R4), THE SYSTEM SHALL actualizar
  en `pets` únicamente los campos presentes, actualizar `updated_at`, y
  responder `200` con el perfil actualizado (shape de R8). IF algún campo
  presente no valida THEN `400` sin persistir ningún campo del body (la
  validación es atómica).

- **R14**: IF el body de `PATCH /v1/pets/:petId` incluye `birthDate` y
  `approxAgeMonths` a la vez THEN THE SYSTEM SHALL responder `400`; WHEN el
  body incluye exactamente uno de los dos, THE SYSTEM SHALL persistir el
  campo enviado y poner `NULL` el otro — son representaciones mutuamente
  excluyentes de la misma información (coherente con R5).

- **R15**: WHEN un `PATCH` de R13 modifica al menos un campo, THE SYSTEM
  SHALL registrar vía `AuditLogger` una entrada `action = 'pet.update'`,
  `entity = 'pet'`, `entityId` = id de la mascota, `userId` = usuario
  autenticado y `meta` con la lista de **nombres** de campos modificados
  (nunca los valores, mismo principio que R14 de `auth-login-me`); IF el
  body es `{}` o no contiene ningún campo reconocido THEN THE SYSTEM SHALL
  responder `200` con el perfil sin cambios (no-op) sin escribir en
  `audit_log`.

### Borrado

- **R16**: WHEN un usuario con `role = 'owner'` envía `DELETE
  /v1/pets/:petId`, THE SYSTEM SHALL borrar la fila de `pets` (el ON DELETE
  CASCADE de R1 elimina sus filas de `pet_users`), responder `204` sin
  body, y registrar vía `AuditLogger` una entrada `action = 'pet.delete'`;
  a partir de ese momento `GET /v1/pets/:petId` responde `404` para
  cualquier usuario y la mascota no aparece en `GET /v1/pets` de ningún
  ex-miembro.

## Fuera de alcance

- **Gestión de miembros** (invitar a family/walker/vet, cambiar rol,
  revocar membresía, endpoints de "usuarios autorizados" del brief §8): no
  está en los `acceptance_criteria` de #5. Los tests e2e que necesitan un
  miembro no-owner (R11) siembran la fila de `pet_users` directamente
  (helper de test), no vía API. Feature futura.
- **Permisos granulares** (`pet_users.permissions` jsonb, brief §4
  "según los permisos otorgados"): la columna se crea (R1) pero no se
  interpreta — la autorización del MVP es solo por `role`. Feature futura.
- **Fotografía de la mascota**: el brief §7 la lista en el alta, pero el
  upload y las URLs prefirmadas son `pet-photos-s3` (#6). Aquí solo existe
  la columna `photo_key` (NULL) y la clave `photoUrl: null` del contrato R8.
- **Asociación de collar GPS** (brief §7 segunda parte): es `devices-claim`
  (#7). `device` queda `null` en R8.
- **`lastPosition` / `lastCommunicationAt` con datos reales**: los alimenta
  el pipeline de ingesta (#8) y los lee positions-api (#9).
- **`nextVaccine`** (#14), **`nextReminder`** (#16), **`activitySummary`**
  (#10) y **variación de peso** (#15): placeholders `null` del contrato R8.
- **Modo mascota perdida** (brief §13): la columna `lost_mode` se crea con
  DEFAULT false; el endpoint para activarlo/desactivarlo no está en los
  `acceptance_criteria` de #5 y queda para la feature que lo priorice.
- **Rol administrador de plataforma** (brief §4): no hay bypass admin del
  `PetAccessGuard`; administración de plataforma es post-MVP.
- **Paginación de `GET /v1/pets`**: el número de mascotas por usuario es
  pequeño; se lista completo. Revisar si alguna feature lo exige.

## Aprobación

- [X] Aprobado por humano (fecha: 2026-08-01) ← gate obligatorio antes de implementar

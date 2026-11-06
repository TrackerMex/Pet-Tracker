---
feature: "users-account-deletion-api"
status: draft        # draft | approved
tags: [harness, spec, backend]
---

# Requisitos — [[users-account-deletion-api]]

> Notación EARS. Cada requisito tiene id único R<n>, inmutable una vez
> aprobado. Ver [[design]] (D1–D10, §Contrato con #248, §IAM para #246) y
> `docs/architecture.md` (capas domain/application/infrastructure). Esta
> feature es 100% backend (`backend-pet-tracker/`); la mitad móvil es #248
> y aquí no se toca `mobile-pet-tracker/` ni `infra/`. Explore:
> `progress/explore_account-deletion.md`; decisiones del humano (D1–D4):
> `progress/plan_produccion-aws-2026-11-06.md`.
>
> **Base congelada y medida una sola vez**: HEAD `899a894d` de
> `feature/247-users-account-deletion-api` (en `backend-pet-tracker/` es
> idéntica a origin/dev `d59d3c5d`). Toda ancla es un `grep -cF` (o
> `grep -rlF … | wc -l`) ejecutado desde la raíz del repo, con la salida
> que dio en esa base; `B=backend-pet-tracker`. **Ningún número de línea es
> ancla.** Si al arrancar una salida no cuadra, la base se movió: parar y
> avisar al leader antes de tocar nada.
>
> **Prefijo obligatorio `#247 R<n>:`** en todo `describe`/`it` nuevo de esta
> spec (`docs/conventions.md` §Prefijo de feature): `auth.guard.spec.ts`,
> `users.controller.spec.ts`, `delete-pet.use-case.spec.ts` y
> `test/pets.e2e-spec.ts` ya tienen R-ids de otras specs.

## Contexto fijo (no reabrir)

Decisiones cerradas por el humano (D1–D4 del plan) y por el leader. No se
reabren en implementación:

- Contrato: `DELETE /v1/me` con body `{ "password": string }` → `204`.
  Contraseña incorrecta → `403`, **nunca** `401` (el móvil cierra sesión
  ante un 401).
- Borrado duro e inmediato, en **una** transacción de Postgres.
- D3 «Borrarla para todos»: se borran todas las mascotas donde el usuario
  es `owner`, aunque estén compartidas. Los collares de esas mascotas se
  liberan con la transacción de liberación existente.
- Las 5 FKs `created_by → users.id` pasan a `ON DELETE SET NULL` y sus
  columnas a nullable.
- El guard comprueba que el usuario existe (una consulta por PK); enmienda
  auth-login-me R8.
- Purga de S3 (`pets/<petId>/`) y DynamoDB (`PET#<petId>`) **después** del
  commit, best effort, en el camino de borrado de mascota (también la
  borra el `DELETE /v1/pets/:id` suelto).
- Auditoría: se conserva el uuid en `audit_log.entity_id` con una fila
  `user.delete`.

Medido en la base congelada:

| Hecho | Ancla | Salida |
|---|---|---|
| No existe `DELETE /v1/me` | `grep -cF "@Delete()" $B/src/modules/users/infrastructure/users.controller.ts` | `0` |
| El controller ya tiene un DELETE (push-tokens) | `grep -cF "@Delete('push-tokens')" $B/src/modules/users/infrastructure/users.controller.ts` | `1` |
| El guard no consulta `users` (auth-login-me R8) | `grep -cF "sin consultar \`users\` (R8)" $B/src/modules/auth/infrastructure/guards/auth.guard.ts` | `1` |
| El guard es síncrono | `grep -cF "canActivate(context: ExecutionContext): boolean" $B/src/modules/auth/infrastructure/guards/auth.guard.ts` | `1` |
| El guard es global en AuthModule | `grep -cF "provide: APP_GUARD," $B/src/modules/auth/auth.module.ts` | `1` |
| AuthModule exporta solo el repo de usuarios | `grep -cF "exports: [USER_REPOSITORY]" $B/src/modules/auth/auth.module.ts` | `1` |
| `UserRepository.findById` existe | `grep -cF "findById(id: string): Promise<User \| null>;" $B/src/modules/auth/domain/repositories/user.repository.ts` | `1` |
| Error de dominio reutilizable para contraseña mala | `grep -cF "export class InvalidCredentialsError extends Error" $B/src/modules/auth/domain/errors/user.errors.ts` | `1` |
| Login valida la contraseña con `min(1)` | `grep -cF "password: z.string().min(1)," $B/src/modules/auth/application/dto/login-user.dto.ts` | `1` |
| Los 8 its del guard usan el ctor de 2 args | `grep -cF "new AuthGuard(reflector, buildTokenService" $B/src/modules/auth/infrastructure/guards/auth.guard.spec.ts` | `8` |
| UsersModule solo importa AuthModule | `grep -cF "imports: [AuthModule]," $B/src/modules/users/users.module.ts` | `1` |
| PetsModule exporta repo y guard | `grep -cF "exports: [PET_REPOSITORY, PetAccessGuard]" $B/src/modules/pets/pets.module.ts` | `1` |
| El borrado de mascota es un DELETE suelto | `grep -cF "await this.db.delete(pets).where(eq(pets.id, petId));" $B/src/modules/pets/infrastructure/repositories/pet.drizzle.repository.ts` | `1` |
| `DeletePetUseCase` audita `pet.delete` | `grep -cF "action: 'pet.delete'" $B/src/modules/pets/application/use-cases/delete-pet.use-case.ts` | `1` |
| Orden actual del caso de uso | `grep -cF "expect(calls).toEqual(['delete', 'record']);" $B/src/modules/pets/application/use-cases/delete-pet.use-case.spec.ts` | `1` |
| Liberación de collar existente (2 updates en tx) | `grep -cF "async release(assignmentId: string, deviceId: string): Promise<void>" $B/src/modules/devices/infrastructure/repositories/device.drizzle.repository.ts` | `1` |
| `pet_devices` cae en cascada con la mascota | `grep -cF ".references(() => pets.id, { onDelete: 'cascade' })," $B/src/db/schema/devices.schema.ts` | `1` |
| `pet_users.user_id` cae en cascada con el usuario | `grep -cF ".references(() => users.id, { onDelete: 'cascade' })," $B/src/db/schema/pets.schema.ts` | `1` |
| FKs `created_by` sin `onDelete` (= `no action`) | `grep -cF ".references(() => users.id)," $B/src/db/schema/health.schema.ts` / `nutrition.schema.ts` / `reminders.schema.ts` / `media.schema.ts` | `2` / `1` / `1` / `1` |
| Columnas `created_by` | `grep -cF "createdBy: uuid('created_by')"` en los mismos 4 ficheros | `2` / `1` / `1` / `1` |
| Tipos de lectura `createdBy: string;` | `grep -cF "createdBy: string;"` en `$B/src/modules/nutrition/domain/entities/meal-serving.entity.ts` / `$B/src/modules/reminders/domain/entities/reminder.entity.ts` / `$B/src/modules/media/domain/entities/pet-document.entity.ts` / `$B/src/modules/nutrition/infrastructure/mappers/nutrition.mapper.ts` | `2` / `2` / `1` / `1` |
| 24 migraciones; la última es 0023 | `grep -cF '"tag"' $B/src/db/migrations/meta/_journal.json` | `24` |
| | `grep -cF '"tag": "0023_vaccine_catalog_data"' $B/src/db/migrations/meta/_journal.json` | `1` |
| El puerto de auditoría acepta `meta` | `grep -cF "meta?: Record<string, unknown>;" $B/src/audit/audit-log.repository.ts` | `1` |
| Claves de la tabla de posiciones | `grep -cF "export const TABLE_POSITIONS_PARTITION_KEY = 'pk';" $B/src/aws/constants.ts` | `1` |
| | `grep -cF "export const TABLE_POSITIONS_SORT_KEY = 'sk';" $B/src/aws/constants.ts` | `1` |
| Lotes de BatchWrite del consumer: 25 y 3 intentos | `grep -cF "const DYNAMO_BATCH_WRITE_MAX = 25;" $B/src/workers/positions-consumer.service.ts` | `1` |
| | `grep -cF "const DYNAMO_BATCH_WRITE_ATTEMPTS = 3;" $B/src/workers/positions-consumer.service.ts` | `1` |
| AwsModule es global (S3_CLIENT, DYNAMODB_CLIENT, AWS_RESOURCE_NAMES) | `grep -cF "@Global()" $B/src/aws/aws.module.ts` | `1` |
| Prefijo S3 de la foto | `grep -cF 'return `pets/${petId}/photo-${now.getTime()}`;' $B/src/modules/media/domain/photo-key.ts` | `1` |
| Prefijo S3 de documentos | `grep -cF 'return `pets/${petId}/docs/${documentId}`;' $B/src/modules/media/domain/document-key.ts` | `1` |
| Comentario del rollback de pets e2e (E5) | `grep -cF "pasa (solo verifica firma), pero el insert de pet_users viola la FK" $B/test/pets.e2e-spec.ts` | `1` |
| Cabecera de pets e2e (E5) | `grep -cF "no consulta \`users\`, solo verifica la firma — auth-login-me R8" $B/test/pets.e2e-spec.ts` | `1` |
| Token sin usuario en vaccine-catalog e2e (E6) | `grep -cF "sub: uuidv7()," $B/test/vaccine-catalog-migration.e2e-spec.ts` | `1` |
| Texto de R8 que se enmienda | `grep -cF "— sin una consulta adicional a \`users\` por parte del guard." specs/auth-login-me/requirements.md` | `1` |
| Las 3 specs de esquema fijan `no action` y NOT NULL | `grep -cF "onDelete: 'no action'"` y `grep -cF "expect(columns.get('created_by')?.notNull).toBe(true);"` en `$B/src/db/schema/weights.schema.spec.ts` / `reminders.schema.spec.ts` / `meal-servings.schema.spec.ts` | `1` cada una |

Anclas con pipe (no hay `-F` que las cubra):

- `ls $B/src/db/migrations | grep -c '^0024_'` → `0`
- `ls $B/test | grep -c '^users'` → `0`
- `grep -rlF "ListObjectsV2Command" $B/src $B/test | wc -l` → `0`
- `grep -rlF "DeleteObjectsCommand" $B/src $B/test | wc -l` → `0`
- `grep -rlF "BatchWriteItemCommand" $B/src $B/test | wc -l` → `0`
- `grep -rlF "PET_DATA_PURGER" $B/src $B/test | wc -l` → `0`
- `grep -rlF "ACCOUNT_DELETION_REPOSITORY" $B/src $B/test | wc -l` → `0`
- `grep -rlF "DrizzleTx" $B/src | wc -l` → `0`
- `grep -rlF "#247" $B/src $B/test | wc -l` → `0`

## Requisitos funcionales

### Esquema

- **R1**: WHEN se aplica la migración `0024_created_by_set_null`, THE
  SYSTEM SHALL dejar las columnas `created_by` de `pet_vaccines`,
  `weights`, `meal_servings`, `reminders` y `pet_documents` como nullable
  y con su FK a `users.id` en `ON DELETE SET NULL`, sin borrar ni crear
  tablas o columnas; y el journal registrará la entrada
  `0024_created_by_set_null` con `idx` 24. Además, toda FK de cualquier
  tabla exportada por el barrel `@/db/schema` hacia `users.id` tendrá
  `onDelete` igual a `cascade` o `set null` (ninguna en `no action`), de
  modo que borrar una fila de `users` nunca dé `23503` (y por tanto nunca
  un `500` en `DELETE /v1/me`).
  *Test: `B/src/db/schema/created-by-set-null.schema.spec.ts` →
  `describe('#247 R1: created_by nullable con ON DELETE SET NULL en las 5 tablas')`,
  incluido `it('#247 R1: toda FK del esquema hacia users.id borra en cascada o pone NULL')`;
  más E1–E3.*

### Guard

- **R2** (enmienda auth-login-me R8): WHEN una petición a una ruta
  protegida trae un JWT válido y vigente cuyo `sub` no existe en `users`,
  THE SYSTEM SHALL responder `401` sin ejecutar el handler. El guard hace
  exactamente una consulta por PK (`UserRepository.findById(sub)`) solo
  tras verificar la firma; las rutas `@Public()` y los tokens ausentes o
  inválidos no consultan `users`; un error de la consulta se propaga (no
  se convierte en 401).
  *Test: `B/src/modules/auth/infrastructure/guards/auth.guard.spec.ts` →
  `describe('#247 R2: el guard exige que el usuario del token exista')`;
  `B/test/users.e2e-spec.ts` →
  `describe('#247 R2: un token de un usuario borrado da 401')`; más E4–E6.*

### Endpoint `DELETE /v1/me`

- **R3**: WHEN un usuario autenticado sin mascotas envía `DELETE /v1/me`
  con su contraseña correcta, THE SYSTEM SHALL responder `204` con body
  vacío, y su fila de `users` y sus filas de `push_tokens` dejarán de
  existir. La ruta exige JWT (sin `@Public()`).
  *Test: `B/test/users.e2e-spec.ts` →
  `describe('#247 R3: borrar una cuenta sin mascotas responde 204')`;
  `B/src/modules/users/infrastructure/users.controller.spec.ts` →
  `describe('#247 R3: DELETE /v1/me exige JWT y responde 204')`.*
  — **Regresión obligatoria 1.**

- **R4**: WHEN un token emitido antes de un `DELETE /v1/me` con `204` se
  reutiliza, THE SYSTEM SHALL responder `401` con body
  `{ statusCode: 401, message: 'Unauthorized' }` en `GET /v1/me`, en
  `GET /v1/pets` y en `DELETE /v1/me/push-tokens` con un body válido
  (`{ expoToken }`, la llamada que el `signOut()` del móvil hace justo
  después del `204`, #248); nunca `5xx`.
  *Test: `B/test/users.e2e-spec.ts` →
  `describe('#247 R4: el token anterior al borrado da 401')`, con dos its
  (ver [[tasks]]).*
  — **Regresión obligatoria 5.**

- **R5**: IF el body de `DELETE /v1/me` no es exactamente
  `{ password: string no vacío }` (body ausente, `{}`, `password: ''`,
  `password` no string, o una clave extra), THEN THE SYSTEM SHALL
  responder `400` con `statusCode: 400` y `message: 'Validation failed'`,
  sin verificar la contraseña ni borrar nada.
  *Test: `B/test/users.e2e-spec.ts` →
  `describe('#247 R5: un body inválido es 400 y no borra')`.*

- **R6**: IF la contraseña de `DELETE /v1/me` no coincide con el hash del
  usuario, THEN THE SYSTEM SHALL responder `403` con body exactamente
  `{ statusCode: 403, message: 'Invalid password', error: 'Forbidden' }`
  (nunca `401`), sin borrar el usuario, sus mascotas ni escribir la fila
  `user.delete` de auditoría.
  *Test: `B/test/users.e2e-spec.ts` →
  `describe('#247 R6: contraseña incorrecta es 403 y no borra nada')`;
  `users.controller.spec.ts` y
  `B/src/modules/users/application/use-cases/delete-account.use-case.spec.ts`
  → `describe('#247 R6: ...')` (ver [[tasks]]).*
  — **Regresión obligatoria 6.**

- **R7**: IF el usuario del token ya no existe cuando el caso de uso lo
  busca o cuando el repositorio bloquea su fila (carrera entre guard y
  caso de uso, p. ej. dos `DELETE /v1/me` concurrentes del mismo
  usuario), THEN THE SYSTEM SHALL responder `401` con body
  `{ statusCode: 401, message: 'Unauthorized' }` (nunca `404`), sin
  borrar nada más.
  *Test: `delete-account.use-case.spec.ts` →
  `describe('#247 R7: usuario inexistente rechaza con UserNotFoundError')`;
  `users.controller.spec.ts` →
  `describe('#247 R7: UserNotFoundError del borrado es 401')`.*

#### Respuestas posibles de `DELETE /v1/me` (lista cerrada)

| Estado | Body | Cuándo | Lo fija |
|---|---|---|---|
| `204` | vacío | Cuenta borrada y commit hecho, aunque la purga haya fallado | R3, R14 |
| `400` | `{ statusCode: 400, message: 'Validation failed', errors }` | Body ausente, `{}`, `password` vacío o no string, clave extra | R5 |
| `401` | `{ statusCode: 401, message: 'Unauthorized' }` | Sin token, token inválido o expirado, usuario del token ya inexistente (guard) o desaparecido durante la petición | R2, R3, R4, R7 |
| `403` | `{ statusCode: 403, message: 'Invalid password', error: 'Forbidden' }` | Contraseña incorrecta | R6 |

No hay otra respuesta de la aplicación. En particular, para una petición
autenticada con body válido ningún camino de dominio da `404` ni `5xx`:
el usuario ausente es `401` (R7), las filas `created_by` ajenas no dan
`23503` (R1, R9), las mascotas compartidas y los collares asignados se
borran y liberan (R8, R10) y un fallo de purga no cambia el `204` (R14).
Los únicos `5xx` posibles son de infraestructura y no borran nada:
Postgres caído o una transacción abortada por Postgres (p. ej. `40P01`,
interbloqueo entre dos borrados de cuenta concurrentes que comparten una
mascota), con rollback completo, y el `504` del balanceador si la purga
supera su timeout (ver [[design]] §Preguntas abiertas).

### Datos

- **R8**: WHEN un usuario borra su cuenta, THE SYSTEM SHALL borrar todas
  las mascotas donde tiene `pet_users.role = 'owner'`, estén o no
  compartidas: (a) dueño único — la fila de `pets`
  deja de existir; (b) compartida con un miembro `family` — la fila de
  `pets` deja de existir y el otro miembro deja de verla en
  `GET /v1/pets` y recibe `404` en `GET /v1/pets/:id`.
  *Test: `B/test/users.e2e-spec.ts` →
  `describe('#247 R8: las mascotas propias se borran para todos')`.*
  — **Regresiones obligatorias 2 (a) y 3 (b).**

- **R9**: WHEN un usuario que es `family` en la mascota de otro y tiene
  filas propias en ella (`meal_servings.created_by` = su id) borra su
  cuenta, THE SYSTEM SHALL responder `204`, conservar la mascota ajena,
  borrar su fila de `pet_users` y dejar `created_by` de esas filas en
  `NULL` (sin el `23503` de la base).
  *Test: `B/test/users.e2e-spec.ts` →
  `describe('#247 R9: la membresía family en una mascota ajena se suelta')`.*
  — **Regresión obligatoria 4.**

- **R10**: WHEN se borra una mascota con una asignación de collar activa
  (`pet_devices.released_at IS NULL`), por `DELETE /v1/me` o por
  `DELETE /v1/pets/:id`, THE SYSTEM SHALL dejar el `devices.status` de ese
  collar en `'available'`.
  *Test: `B/test/pets.e2e-spec.ts` →
  `describe('#247 R10: borrar la mascota libera su collar')`;
  `B/test/users.e2e-spec.ts` →
  `describe('#247 R10: borrar la cuenta libera los collares de sus mascotas')`.*

- **R11**: WHILE se borra una cuenta, THE SYSTEM SHALL ejecutar todas las
  escrituras de Postgres (bloqueo de la fila de `users`, fila de
  auditoría, liberación de collares, borrado de mascotas y del usuario) en
  una sola `db.transaction`, bloqueando primero la fila del usuario con
  `FOR UPDATE`, y escribir la auditoría antes de borrar el usuario, la
  liberación antes de borrar las mascotas y las mascotas antes que el
  usuario. IF la fila del usuario no existe al bloquearla, THEN rechaza
  con `UserNotFoundError` sin escribir nada.
  *Test: `B/src/modules/users/infrastructure/repositories/account-deletion.drizzle.repository.spec.ts`
  → `describe('#247 R11: el borrado de cuenta es una sola transacción ordenada')`.*

- **R12**: WHEN un borrado de cuenta responde `204`, THE SYSTEM SHALL haber
  dejado exactamente una fila de `audit_log` con `action = 'user.delete'`,
  `entity = 'user'`, `entity_id` = id del usuario, `user_id` = `NULL`
  (por la FK `SET NULL`) y `meta = { petIds: [...] }` con los ids de las
  mascotas borradas; y ninguna fila `pet.delete` para esas mascotas.
  *Test: `B/test/users.e2e-spec.ts` →
  `describe('#247 R12: el borrado de cuenta audita user.delete')`.*

### Purga de S3 y DynamoDB

- **R13**: WHEN se borra una mascota (por `DELETE /v1/me` o por
  `DELETE /v1/pets/:id`) y la transacción hace commit, THE SYSTEM SHALL,
  antes de responder, borrar todos los objetos del bucket de media bajo
  `pets/<petId>/` y todos los ítems de la tabla de posiciones con
  `pk = PET#<petId>`, sin tocar objetos ni ítems de otras mascotas; y no
  purgará nada si el borrado en Postgres falla.
  *Test: `B/test/pets.e2e-spec.ts` →
  `describe('#247 R13: borrar la mascota purga S3 y DynamoDB')`;
  `B/test/users.e2e-spec.ts` →
  `describe('#247 R13: borrar la cuenta purga S3 y DynamoDB de sus mascotas')`;
  `delete-pet.use-case.spec.ts` (E7) y `delete-account.use-case.spec.ts` →
  `describe('#247 R13: ...')`.*

- **R14**: IF la purga de S3 o de DynamoDB falla para una mascota, THEN
  THE SYSTEM SHALL responder igualmente `204`, con el borrado de Postgres
  ya hecho, seguir purgando el otro almacén y las demás mascotas, y
  registrar con `Logger.error` una línea que contiene
  `PET_PURGE_FAILED store=<s3|dynamodb> petId=<petId> target=<pets/<petId>/|PET#<petId>>`.
  *Test: `B/test/users.e2e-spec.ts` →
  `describe('#247 R14: un fallo de purga no tumba el 204 y queda en el log')`.*
  — **Regresión obligatoria 7.**

- **R15**: WHEN `PetDataPurgerAwsAdapter.purge(petIds)` se ejecuta, THE
  SYSTEM SHALL, por cada mascota y en serie: paginar `ListObjectsV2`
  (`Prefix: pets/<petId>/`) y enviar un `DeleteObjects` (`Quiet: true`) por
  página no vacía, tratando un `Errors` no vacío como fallo; paginar un
  `Query` de solo claves (`pk = PET#<petId>`) y enviar `BatchWriteItem` de
  `DeleteRequest` en lotes de 25, reintentando `UnprocessedItems` hasta 3
  intentos por lote; y resolver siempre (nunca rechazar). Con `[]` no
  envía nada.
  *Test: `B/src/modules/pets/infrastructure/pet-data-purger.aws.adapter.spec.ts`
  → `describe('#247 R15: PetDataPurgerAwsAdapter purga S3 y DynamoDB por mascota')`.*

## Regresiones obligatorias (las 7 del leader)

| # | Caso | R | it |
|---|---|---|---|
| 1 | Usuario sin mascotas | R3 | `#247 R3: con la contraseña correcta responde 204 y borra el usuario y sus push_tokens` |
| 2 | Dueño único de una mascota | R8 (a) | `#247 R8: la mascota de un dueño único deja de existir` |
| 3 | Dueño de mascota compartida | R8 (b) | `#247 R8: la mascota compartida desaparece también para el miembro family` |
| 4 | `family` con `meal_servings` en mascota ajena (23503) | R9 | `#247 R9: la mascota ajena sobrevive y created_by queda en NULL` |
| 5 | JWT tras el borrado | R4 | `#247 R4: GET /v1/me y GET /v1/pets responden 401 con el token anterior` y `#247 R4: DELETE /v1/me/push-tokens con el token anterior responde 401` |
| 6 | Contraseña incorrecta | R6 | `#247 R6: responde 403 Invalid password y no borra usuario, mascota ni audita` |
| 7 | Fallo de purga | R14 | `#247 R14: S3 caído responde 204, borra en Postgres, purga DynamoDB y registra PET_PURGE_FAILED` |

## Tests existentes que cambian

- **E1** `B/src/db/schema/weights.schema.spec.ts`: en
  `it('declara exactamente las columnas, tipos y nulabilidad aprobados')`,
  `expect(columns.get('created_by')?.notNull).toBe(true)` pasa a
  `toBe(false)`; en `it('aplica las FKs y el cascade solo a pet_id')`, el
  `onDelete: 'no action'` de `created_by` pasa a `'set null'`. Conservan
  describe y título.
- **E2** `B/src/db/schema/reminders.schema.spec.ts`: los mismos dos cambios
  en `it('exporta reminders con las columnas, tipos y nulabilidad aprobados')`
  y en `it('declara los CHECKs, FKs e indices exactos')`.
- **E3** `B/src/db/schema/meal-servings.schema.spec.ts`: los mismos dos
  cambios, en `it('declara exactamente las columnas, tipos y nulabilidad aprobados')`
  y en `it('aplica las FKs y el cascade solo a pet_id')` (mismos títulos
  que en E1). Ninguna otra spec de esquema fija la nulabilidad o el
  `onDelete` de `created_by` (`health.schema.spec.ts` solo lista nombres
  de columna; las que recorren `migrations/` buscan su propio
  `CREATE TABLE`).
- **E4** `B/src/modules/auth/infrastructure/guards/auth.guard.spec.ts`: los
  8 its existentes (describes R5–R8 de auth-login-me) pasan al ctor de 3
  argumentos con un doble `buildUsers()` cuyo `findById` resuelve un
  usuario, y a aserciones asíncronas (`await expect(...).rejects.toThrow(UnauthorizedException)`,
  `await expect(...).resolves.toBe(true)`, `await guard.canActivate(...)`).
  Conservan título y describe.
- **E5** `B/test/pets.e2e-spec.ts`: el it
  `'si el insert de pet_users falla, la fila de pets no persiste (rollback)'`
  ya no puede provocar el fallo por HTTP (el token fantasma da 401 en el
  guard). Pasa a llamar directamente
  `app.get<PetRepository>(PET_REPOSITORY).createWithOwner({ name: uniqueName, species: 'dog', birthDate: '2024-01-15' }, uuidv7())`
  con `await expect(...).rejects.toThrow()` y conserva la comprobación de
  `orphanPets` vacío. Se reescriben su comentario y el de la cabecera del
  fichero (el guard ya consulta `users`, #247 R2). Conserva título.
- **E6** `B/test/vaccine-catalog-migration.e2e-spec.ts`: el `beforeAll` de
  `#226 R1` firma `catalogToken` con `sub: uuidv7()` sin fila en `users`;
  pasa a insertar antes un usuario en `drizzle(poolA)` (mismo patrón de
  `insert(users).values({...})` que el it `GET dog` del mismo fichero) y a
  firmar con su id. La base A se borra entera al final: no hace falta
  limpieza.
- **E7** `B/src/modules/pets/application/use-cases/delete-pet.use-case.spec.ts`:
  `buildDeps` añade un doble de `PetDataPurger` cuyo `purge` empuja
  `'purge'` a `calls`; el it `'borra por id y registra la entrada de
  auditoria despues'` pasa a `expect(calls).toEqual(['delete', 'purge', 'record'])`
  y a comprobar `purge` llamado con `[PET_ID]`; el it
  `'no audita si el borrado falla'` se retitula
  `'no audita ni purga si el borrado falla'` y asierta además que `purge`
  no se llamó. Conservan el describe de R16.
- **E8** `B/src/modules/users/infrastructure/users.controller.spec.ts`: el
  helper `controller(overrides)` añade el 5.º argumento
  `{ execute: overrides.deleteAccount ?? jest.fn().mockResolvedValue(undefined) } as unknown as DeleteAccountUseCase`
  y `handlerOf` amplía su unión con `'deleteMe'`.

Ningún otro test construye `AuthGuard`, `DeletePetUseCase` o
`UsersController`, ni firma tokens para usuarios ausentes de `users`
(verificado sobre los 30 `.sign({` de `B/test`).

## Decisiones abiertas

Ninguna para Codex. Las preguntas para el humano están en [[design]]
§Preguntas abiertas y no bloquean la implementación.

## Premisas falsas

- *«No hay rate limiter»*: existe `EmailRateLimitGuard`, pero solo en las
  rutas de email de auth. `DELETE /v1/me` queda sin limitar (fuera de
  alcance, pregunta abierta en [[design]]).
- *«El borrado de mascota libera el collar»*: no. Hoy `pet_devices` cae en
  cascada y `devices.status` se queda en `'assigned'`. R10 lo arregla
  también en el `DELETE /v1/pets/:id` suelto.
- *«`DYNAMO_BATCH_WRITE_MAX` vive en `src/positions`»*: vive en
  `src/workers/positions-consumer.service.ts`, como `const` de módulo. El
  adapter nuevo define sus propias constantes (D6).

## Fuera de alcance

- *Delimitación*: aviso push a los demás miembros de una mascota borrada
  (D3 lo descarta).
- *Delimitación*: Wialon (solo lectura; el collar liberado sigue en
  Wialon).
- *Delimitación*: la pantalla y el cliente móviles (#248).
- *Delimitación*: los permisos IAM y el CDK (#246; requisitos en [[design]]
  §IAM para #246).
- *Delimitación*: rate limiting de `DELETE /v1/me`.
- *Delimitación*: borrado diferido, periodo de gracia o restauración.
- *Delimitación*: purga asíncrona, cola o reintentos en segundo plano de la
  purga.
- *Delimitación*: purga de versiones antiguas del bucket (con versionado,
  la expiración de no actuales es del lifecycle de #246).

## Aprobación

- [ ] Aprobado por humano (fecha: ____) ← gate obligatorio antes de implementar

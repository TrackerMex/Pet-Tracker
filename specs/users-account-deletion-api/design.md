---
feature: "users-account-deletion-api"
status: draft        # draft | approved
tags: [harness, spec, backend]
---

# Diseño — [[users-account-deletion-api]]

> Decisiones de alto nivel para [[requirements]]. Rutas desde la raíz del
> repo; `B=backend-pet-tracker`. Capas según `docs/architecture.md`:
> domain (puertos y errores) ← application (casos de uso) ← infrastructure
> (Drizzle, AWS, controllers).

## Flujo

```
DELETE /v1/me {password}
  AuthGuard: verify(JWT) → users.findById(sub) → null ⇒ 401        (R2)
  UsersController.deleteMe: parseBody(DeleteAccountSchema) ⇒ 400   (R5)
  DeleteAccountUseCase.execute(userId, password)
    users.findById(userId)            null ⇒ UserNotFoundError ⇒ 401 (R7)
    hasher.verify(password, hash)     false ⇒ InvalidCredentialsError ⇒ 403 (R6)
    accountDeletion.deleteAccount(userId)  ── una db.transaction ──  (R11)
      SELECT users WHERE id FOR UPDATE   (ausente ⇒ UserNotFoundError)
      SELECT pet_users.pet_id WHERE user_id AND role='owner'
      INSERT audit_log user.delete {petIds}                         (R12)
      deletePetsTx(tx, petIds)  → releaseDeviceTx por collar activo (R10)
                                → DELETE pets WHERE id IN petIds   (R8)
      DELETE users WHERE id   (cascadas + created_by SET NULL)       (R9)
    ── commit ──
    purger.purge(petIds)   S3 pets/<id>/ + DynamoDB PET#<id>, best effort (R13–R15)
  ⇒ 204
```

`DELETE /v1/pets/:id` (DeletePetUseCase) pasa a:
`pets.delete(petId)` (ahora `db.transaction` → `deletePetsTx`) →
`purger.purge([petId])` → `auditLogger.record(pet.delete)`.

## Decisiones

### D1 — Contrato HTTP y validación

- Ruta: `@Delete()` + `@HttpCode(HttpStatus.NO_CONTENT)` en
  `UsersController` (`@Controller('me')`), handler
  `deleteMe(@CurrentUser() user: CurrentUserPayload, @Body() body: unknown): Promise<void>`.
  Sin `@Public()`.
- DTO `B/src/modules/users/application/dto/delete-account.dto.ts`:
  `DeleteAccountSchema = z.strictObject({ password: z.string().min(1) })` y
  `DeleteAccountDto = z.infer<typeof DeleteAccountSchema>`. `strictObject`
  igual que `RegisterPushTokenSchema` (clave extra ⇒ 400); `min(1)` sin
  máximo, igual que `LoginUserSchema` (una cuenta antigua no se queda sin
  poder borrarse por una regla de longitud nueva).
- Se valida con el `parseBody` existente del controller (forma 400:
  `{ statusCode: 400, message: 'Validation failed', errors: [...] }`).
- Mapeo de errores en el handler: `InvalidCredentialsError` ⇒
  `new ForbiddenException('Invalid password')`; `UserNotFoundError` ⇒
  `new UnauthorizedException()` (R7; body
  `{ statusCode: 401, message: 'Unauthorized' }`, el mismo del guard);
  cualquier otro error se relanza tal cual (⇒ 500, solo infraestructura).
  `deleteMe` **no** usa `mapProfileError`: daría `404`, que el móvil
  (#248) mostraría como error genérico en vez de cerrar sesión. El
  controller añade `UnauthorizedException` a su import de
  `@nestjs/common`.
- 403 y no 401: el cliente móvil cierra sesión ante cualquier 401
  (decisión cerrada). Se reutiliza `InvalidCredentialsError` del dominio
  de auth en vez de un error nuevo: misma semántica, cero código.

### D2 — Guard: el usuario del token debe existir (enmienda auth-login-me R8)

- `AuthGuard` añade `@Inject(USER_REPOSITORY) private readonly users: UserRepository`
  como 3.er parámetro y `canActivate` pasa a `Promise<boolean>`.
- Orden: `@Public()` ⇒ `true` sin consulta; sin token ⇒ 401 sin consulta;
  `verify` falla ⇒ 401 sin consulta; `findById(payload.sub)` **fuera** del
  `try/catch` de `verify` (un error de base se propaga, no se enmascara
  como 401); `null` ⇒ 401; si existe, `request.user = { id: payload.sub, email: payload.email }`
  (sigue saliendo de los claims, no de la fila).
- Coste: una consulta por PK por petición autenticada. Es lo que hace que
  un token emitido antes del borrado deje de valer sin lista de revocación
  (R4). `CurrentUser` y su comentario no cambian (siguen siendo ciertos).
- La enmienda de R8 se documenta en tres sitios, en el commit verde de R2:
  el comentario de cabecera de `auth.guard.ts` (ya no dice «sin consultar
  `users`»), la cabecera de `B/test/pets.e2e-spec.ts` (E5), y una nota
  bajo R8 en `specs/auth-login-me/requirements.md`:
  `` > **Enmendado por #247 R2** (users-account-deletion-api): el guard hace una consulta por PK a `users` y responde 401 si el usuario del token ya no existe. ``

### D3 — Migración `created_by` ⇒ `ON DELETE SET NULL`

- En `health.schema.ts` (`petVaccines`, `weights`), `nutrition.schema.ts`
  (`mealServings`), `reminders.schema.ts` (`reminders`) y
  `media.schema.ts` (`petDocuments`): `createdBy: uuid('created_by').references(() => users.id, { onDelete: 'set null' })`,
  sin `.notNull()`.
- `pnpm -C backend-pet-tracker db:generate --name created_by_set_null` ⇒
  `B/src/db/migrations/0024_created_by_set_null.sql` (5 `DROP CONSTRAINT`,
  5 `ALTER COLUMN "created_by" DROP NOT NULL`, 5 `ADD CONSTRAINT … ON DELETE set null`)
  y entrada `0024_created_by_set_null` (idx 24) en el journal. Generado,
  nunca editado a mano.
- Tipos de **lectura** a `string | null`: `MealServingProps.createdBy` y
  `MealServing.createdBy` (`meal-serving.entity.ts`), `ReminderProps.createdBy`
  y `Reminder.createdBy` (`reminder.entity.ts`), `PetDocument.createdBy`
  (`pet-document.entity.ts`) y `MealServingResponse.createdBy`
  (`nutrition.mapper.ts`). Los tipos de **entrada** (`NewMealServing`,
  `NewPetVaccine`, `NewPetWeight`, `NewReminder`, `createWithOwner` y
  similares) siguen en `string`: toda fila nueva tiene autor. Ninguna
  lógica lee `createdBy` (verificado: solo mappers). Si `tsc` señala otro
  sitio, se ensancha ahí y se anota en `progress/impl_…`.
- Por qué: sin esto, borrar a un `family` que registró una comida, peso,
  vacuna, recordatorio o documento en una mascota ajena da `23503` y
  aborta el borrado (R9).

### D4 — Transacción compartida y liberación de collares

- `B/src/db/drizzle-tx.ts`:
  `export type DrizzleTx = Parameters<Parameters<NodePgDatabase['transaction']>[0]>[0];`
  (no existe alias de transacción en el repo).
- `B/src/modules/devices/infrastructure/repositories/release-device.tx.ts`:
  `export async function releaseDeviceTx(tx: DrizzleTx, assignmentId: string, deviceId: string): Promise<void>`
  con los dos `update` que hoy hace `DeviceDrizzleRepository.release`
  (`pet_devices.released_at = now`, `devices.status = 'available'` +
  `updated_at`). `release` pasa a
  `this.db.transaction((tx) => releaseDeviceTx(tx, assignmentId, deviceId))`.
  Misma transacción de liberación, ahora reutilizable dentro de otra.
- `B/src/modules/pets/infrastructure/repositories/delete-pets.tx.ts`:
  `export async function deletePetsTx(tx: DrizzleTx, petIds: readonly string[]): Promise<void>`:
  (1) `select { id: petDevices.id, deviceId: petDevices.deviceId }` con
  `inArray(petDevices.petId, petIds)` e `isNull(petDevices.releasedAt)`;
  (2) `releaseDeviceTx` por cada fila; (3)
  `tx.delete(pets).where(inArray(pets.id, petIds))`. Con `petIds` vacío no
  hace nada. La liberación va **antes** del `delete`: `pet_devices` cae en
  cascada con la mascota y, si se borrara primero, no quedaría fila que
  cerrar y el collar se quedaría en `'assigned'`.
- `PetDrizzleRepository.delete(petId)` pasa a
  `this.db.transaction((tx) => deletePetsTx(tx, [petId]))`. El puerto
  `PetRepository` no cambia.
- `pets` importa una función de infraestructura de `devices`: es
  infraestructura ↔ infraestructura sobre las mismas tablas, sin puerto
  nuevo (un puerto con una sola implementación no aporta nada aquí).

### D5 — Puerto y adapter del borrado de cuenta

- Puerto `B/src/modules/users/domain/repositories/account-deletion.repository.ts`:
  ```ts
  export const ACCOUNT_DELETION_REPOSITORY = Symbol('AccountDeletionRepository');
  export interface AccountDeletionRepository {
    /** Borra la cuenta y sus mascotas propias en una transacción; devuelve los ids de mascota borrados. */
    deleteAccount(userId: string): Promise<string[]>;
  }
  ```
- Adapter `B/src/modules/users/infrastructure/repositories/account-deletion.drizzle.repository.ts`,
  clase `AccountDeletionDrizzleRepository` (`@Inject(DRIZZLE) private readonly db: NodePgDatabase`),
  una sola `this.db.transaction(async (tx) => …)`:
  1. `tx.select({ id: users.id }).from(users).where(eq(users.id, userId)).for('update')`;
     vacío ⇒ `throw new UserNotFoundError(userId)`.
  2. `tx.select({ petId: petUsers.petId }).from(petUsers).where(and(eq(petUsers.userId, userId), eq(petUsers.role, 'owner')))`
     (sin filtro de `status`: la membresía `owner` solo la crea
     `createWithOwner`, siempre `active`).
  3. `tx.insert(auditLog).values({ userId, action: 'user.delete', entity: 'user', entityId: userId, meta: { petIds } })`.
  4. `if (petIds.length > 0) await deletePetsTx(tx, petIds)`.
  5. `tx.delete(users).where(eq(users.id, userId))`.
  6. `return petIds`.
- `FOR UPDATE` primero: un `createWithOwner` o una aceptación de invitación
  concurrentes insertan en `pet_users`, que toma `FOR KEY SHARE` sobre la
  fila del usuario; con el bloqueo esperan al commit y fallan por FK en
  vez de dejar una mascota recién creada sin dueño.
- La auditoría se escribe con `tx.insert(auditLog)` y no con el puerto
  `AuditLogger`: tiene que entrar en la misma transacción y **antes** del
  `DELETE users` (con el usuario ya borrado, `user_id` violaría la FK).
  Tras el commit, la FK `SET NULL` deja `user_id = NULL` y el uuid queda en
  `entity_id`.
- Vive en `users` porque orquesta tablas de varios módulos solo dentro de
  una transacción; los demás módulos no lo ven.

### D6 — Puerto y adapter de la purga

- Puerto `B/src/modules/pets/domain/ports/pet-data-purger.ts` (estilo de
  `pet-photo-url-resolver.ts`):
  ```ts
  export const PET_DATA_PURGER = Symbol('PetDataPurger');
  /** Borra los datos de una mascota fuera de Postgres. Best effort: nunca rechaza; los fallos van al log. */
  export interface PetDataPurger {
    purge(petIds: readonly string[]): Promise<void>;
  }
  ```
- Adapter `B/src/modules/pets/infrastructure/pet-data-purger.aws.adapter.ts`,
  clase `PetDataPurgerAwsAdapter`:
  - inyecta `@Inject(S3_CLIENT) s3: S3Client`,
    `@Inject(DYNAMODB_CLIENT) dynamo: DynamoDBClient` y
    `@Inject(AWS_RESOURCE_NAMES) names: AwsResourceNames` (los tres
    símbolos de `@/aws/aws.constants`, el tipo `AwsResourceNames` de
    `@/aws/resource-names`; `AwsModule` es `@Global()`). Nombres por
    `names.mediaBucket` y `names.positionsTable`, nunca por las constantes
    `BUCKET_MEDIA`/`TABLE_POSITIONS` (guard `resource-names-guard.spec.ts`).
  - constantes de módulo `BATCH_WRITE_MAX_ITEMS = 25` y
    `BATCH_WRITE_ATTEMPTS = 3` (mismos valores que el consumer; se copian
    en vez de exportarlas desde `workers/` para no acoplar `pets` al
    worker).
  - `private readonly logger = new Logger(PetDataPurgerAwsAdapter.name)`.
  - Por mascota, en serie: `try { S3 } catch { log store=s3 }`, luego
    `try { DynamoDB } catch { log store=dynamodb }`. Nunca relanza.
  - S3: bucle `` ListObjectsV2Command({ Bucket, Prefix: `pets/${petId}/`, ContinuationToken }) ``;
    por página con `Contents` no vacío,
    `DeleteObjectsCommand({ Bucket, Delete: { Objects: [{ Key }], Quiet: true } })`
    (una página de `ListObjectsV2` trae como mucho 1000 claves, el mismo
    tope de `DeleteObjects`); un `Errors` no vacío en la respuesta es un
    fallo; sigue mientras `IsTruncated` con `NextContinuationToken`.
  - DynamoDB (`@aws-sdk/client-dynamodb`, cliente crudo): bucle
    `` QueryCommand({ TableName, KeyConditionExpression: `${TABLE_POSITIONS_PARTITION_KEY} = :pk`, ExpressionAttributeValues: { ':pk': { S: `PET#${petId}` } }, ProjectionExpression: `${TABLE_POSITIONS_PARTITION_KEY}, ${TABLE_POSITIONS_SORT_KEY}`, ExclusiveStartKey }) ``;
    los `Items` (solo claves) se trocean en lotes de 25 y cada lote va en
    `BatchWriteItemCommand({ RequestItems: { [table]: items.map((Key) => ({ DeleteRequest: { Key } })) } })`;
    `UnprocessedItems` de la tabla se reenvía hasta completar 3 intentos
    por lote (sin backoff, como el consumer); si tras el 3.º sigue
    habiendo, es un fallo. Sigue mientras haya `LastEvaluatedKey`.
  - Línea de log (exacta salvo `reason`):
    `PET_PURGE_FAILED store=s3 petId=<petId> target=pets/<petId>/ reason=<mensaje>` y
    `PET_PURGE_FAILED store=dynamodb petId=<petId> target=PET#<petId> reason=<mensaje>`,
    `reason` = `error.message` si es `Error`, si no `String(error)`.
  - Importado desde otros directorios siempre con alias `@/` (el guard
    `relative-import-guard.spec.ts` prohíbe `../…aws…`).
- `PetsModule`: provider `{ provide: PET_DATA_PURGER, useClass: PetDataPurgerAwsAdapter }`
  y `exports: [PET_REPOSITORY, PetAccessGuard, PET_DATA_PURGER]`.
- Cliente crudo y no `DynamoDBDocumentClient`: las claves del `Query`
  vuelven ya en formato `AttributeValue` y pasan tal cual al
  `DeleteRequest`; con el document client haría falta un provider-factory
  más en `PetsModule` para nada.

### D7 — `DeletePetUseCase`: borrar ⇒ purgar ⇒ auditar

- 3.er parámetro `@Inject(PET_DATA_PURGER) private readonly purger: PetDataPurger`.
- `execute`: `await pets.delete(petId)`; `await purger.purge([petId])`;
  `await auditLogger.record({ … 'pet.delete' … })` (sin cambios).
- La purga solo depende del commit; ponerla antes de la auditoría evita
  que un fallo de `record` deje objetos huérfanos en S3/DynamoDB de una
  mascota que ya no existe. Si `delete` falla no se purga ni se audita.

### D8 — `DeleteAccountUseCase`

- `B/src/modules/users/application/use-cases/delete-account.use-case.ts`,
  clase `DeleteAccountUseCase` (`@Injectable()`), ctor:
  `@Inject(USER_REPOSITORY) users: UserRepository`,
  `@Inject(PASSWORD_HASHER) hasher: PasswordHasher`,
  `@Inject(ACCOUNT_DELETION_REPOSITORY) accountDeletion: AccountDeletionRepository`,
  `@Inject(PET_DATA_PURGER) purger: PetDataPurger`.
- `execute(userId: string, password: string): Promise<void>`:
  `findById` (null ⇒ `UserNotFoundError`) ⇒ `verify(password, user.passwordHash)`
  (false ⇒ `InvalidCredentialsError`) ⇒ `deleteAccount(userId)` ⇒
  `purge(petIds)`. Si `deleteAccount` rechaza, no se purga.

### D9 — Módulos

- `AuthModule`: `exports: [USER_REPOSITORY, PASSWORD_HASHER]`.
- `UsersModule`: `imports: [AuthModule, PetsModule]`; providers añaden
  `DeleteAccountUseCase` y
  `{ provide: ACCOUNT_DELETION_REPOSITORY, useClass: AccountDeletionDrizzleRepository }`.
  Sin ciclo: ni `PetsModule` ni sus imports importan `UsersModule` (solo
  lo hacen `AppModule` y `NotifierModule`).
- `UsersController` recibe `DeleteAccountUseCase` como 5.º parámetro.

### D10 — Auditoría

- Cuenta: una fila `user.delete` con `meta.petIds` (D5). Las mascotas
  borradas por la cuenta **no** generan filas `pet.delete`: su rastro es
  `meta.petIds` de la fila de la cuenta.
- Mascota suelta: la fila `pet.delete` de siempre (D7).
- Las filas antiguas del usuario quedan con `user_id = NULL` por la FK
  existente; no se tocan.

## Archivos afectados por capa

| Capa | Fichero | Cambio |
|---|---|---|
| db | `B/src/db/schema/{health,nutrition,reminders,media}.schema.ts` | `created_by` nullable + `set null` (D3) |
| db | `B/src/db/migrations/0024_created_by_set_null.sql`, `meta/_journal.json`, `meta/0024_snapshot.json` | generados (D3) |
| db | `B/src/db/drizzle-tx.ts` | nuevo: `DrizzleTx` (D4) |
| domain | `meal-serving.entity.ts`, `reminder.entity.ts`, `pet-document.entity.ts` | `createdBy: string \| null` (D3) |
| domain | `B/src/modules/pets/domain/ports/pet-data-purger.ts` | nuevo (D6) |
| domain | `B/src/modules/users/domain/repositories/account-deletion.repository.ts` | nuevo (D5) |
| application | `B/src/modules/users/application/dto/delete-account.dto.ts` | nuevo (D1) |
| application | `B/src/modules/users/application/use-cases/delete-account.use-case.ts` | nuevo (D8) |
| application | `B/src/modules/pets/application/use-cases/delete-pet.use-case.ts` | purga (D7) |
| infrastructure | `B/src/modules/auth/infrastructure/guards/auth.guard.ts`, `B/src/modules/auth/auth.module.ts` | D2, D9 |
| infrastructure | `B/src/modules/devices/infrastructure/repositories/release-device.tx.ts`, `device.drizzle.repository.ts` | D4 |
| infrastructure | `B/src/modules/pets/infrastructure/repositories/delete-pets.tx.ts`, `pet.drizzle.repository.ts` | D4 |
| infrastructure | `B/src/modules/pets/infrastructure/pet-data-purger.aws.adapter.ts`, `B/src/modules/pets/pets.module.ts` | D6 |
| infrastructure | `B/src/modules/users/infrastructure/repositories/account-deletion.drizzle.repository.ts` | D5 |
| infrastructure | `B/src/modules/users/infrastructure/users.controller.ts`, `B/src/modules/users/users.module.ts` | D1, D9 |
| infrastructure | `B/src/modules/nutrition/infrastructure/mappers/nutrition.mapper.ts` | `MealServingResponse.createdBy: string \| null` (D3) |
| docs | `specs/auth-login-me/requirements.md` | nota de enmienda bajo R8 (D2) |

Tests nuevos y modificados: ver [[requirements]] (E1–E8) y [[tasks]].

## Contrato con #248

Lo que el móvil puede asumir de `DELETE /v1/me`:

| Respuesta | Cuándo | Qué hace el móvil |
|---|---|---|
| `204`, body vacío | Cuenta borrada y commit hecho (la purga puede haber fallado: no es asunto del cliente) | Cierra sesión local (borra token y caché) y va a la pantalla de entrada |
| `400` `{ statusCode, message: 'Validation failed', errors: [{ path, message }] }` | Body que no es `{ password: string no vacío }` | Error de formulario; sigue con sesión. No debería ocurrir si el cliente valida «no vacío» |
| `401` `{ statusCode: 401, message: 'Unauthorized' }` | Sin token, token inválido/expirado, usuario ya inexistente, o usuario desaparecido durante la petición (carrera, R7) | Lo de siempre ante un 401: cerrar sesión |
| `403` `{ statusCode: 403, message: 'Invalid password', error: 'Forbidden' }` | Contraseña incorrecta | Mensaje de contraseña incorrecta; **sigue con sesión** |
| `5xx` / timeout | Solo infraestructura: Postgres caído o transacción abortada (rollback, nada borrado), o `504` del ALB tras el commit (pregunta abierta 1) | Error genérico. Reintento seguro: si el borrado sí se había hecho, el reintento da `401` y el móvil cierra sesión |

Ninguna otra. `DELETE /v1/me` nunca responde `404`; la lista cerrada y
los tests que la fijan están en [[requirements]] §Respuestas posibles.

El body de la petición es JSON (`Content-Type: application/json`); un
`DELETE` con body es válido en `fetch`. El token tras un `204` ya no vale
para nada (R4): toda ruta autenticada responde `401` con él, también el
`DELETE /v1/me/push-tokens` que `signOut()` envía justo después del
`204`. Ese `401` lo da el guard al no encontrar la fila de `users` (R2),
nunca un `5xx`. El móvil debe tratar ese `401` como esperado dentro del
propio `signOut()` (no volver a disparar `signOut()` por él, o entra en
bucle). La fila de `push_tokens` ya no existe: la borró la cascada de
`users`.

## IAM para #246

Acciones que necesita la task role del API para la purga (D6). Confirma
las cuatro que listaba #246 y precisa los recursos:

| Acción | Recurso | Por qué |
|---|---|---|
| `s3:ListBucket` | ARN del bucket de media (`arn:aws:s3:::<bucket>`), opcionalmente con condición `s3:prefix` = `pets/*` | `ListObjectsV2` es una operación de bucket |
| `s3:DeleteObject` | `arn:aws:s3:::<bucket>/*` (o `…/pets/*`) | `DeleteObjects` no tiene acción propia: exige `s3:DeleteObject` por cada clave |
| `dynamodb:Query` | ARN de la tabla de posiciones | `Query` por `pk` |
| `dynamodb:BatchWriteItem` | ARN de la tabla de posiciones | Cubre los `DeleteRequest` del lote |

- No hace falta `s3:DeleteObjectVersion`: con versionado activo, el
  `DeleteObjects` sin `VersionId` crea marcadores de borrado; la expiración
  de versiones no actuales y de marcadores huérfanos
  (`NoncurrentVersionExpiration`, `ExpiredObjectDeleteMarker`) es del
  lifecycle del bucket en #246.
- No hace falta `dynamodb:DeleteItem`.
- KMS: **sin verificar**. Si #246 cifra el bucket o la tabla con una CMK
  propia, hay que comprobar en la documentación de AWS qué acciones de KMS
  piden `ListObjectsV2`/`DeleteObjects` y `Query`/`BatchWriteItem` sobre
  datos cifrados; esta spec no lo afirma.

## Alternativas descartadas

- **Borrado diferido / soft delete**: descartado por el humano (borrado
  duro inmediato).
- **Lista de revocación de JWT** (tabla o `token_version` en `users`):
  más esquema y la misma consulta por petición; la consulta por PK del
  guard basta para un usuario borrado.
- **Purga dentro de la transacción**: un fallo de S3/DynamoDB tumbaría el
  borrado de Postgres, que es lo que exigen las tiendas. Después del
  commit y best effort.
- **Purga asíncrona (cola o fire-and-forget)**: fuera de alcance; ver
  Preguntas abiertas (límite de 60 s del ALB).
- **`DELETE /v1/me` llamando a `DeletePetUseCase` por mascota**: una
  transacción por mascota rompe la atomicidad del borrado de cuenta y
  escribe N filas `pet.delete`.
- **Anonimizar en vez de `SET NULL`** (reasignar `created_by` a un usuario
  fantasma): inventa un usuario y no aporta nada a lo que el móvil
  muestra (no lee `createdBy`).
- **401 para contraseña incorrecta**: cierra la sesión del móvil
  (decisión cerrada).

## Preguntas abiertas (para el humano; no bloquean la implementación)

1. **Techo de 60 s del ALB.** La purga es síncrona. Una mascota con ~90
   días de posiciones a una por minuto tiene ~129 600 ítems ⇒ ~5 200
   `BatchWriteItem`. Puede pasar de 60 s; el commit ya está hecho, el
   cliente vería un 504 y su reintento un 401 (cierra sesión: correcto,
   pero la purga queda a medias y solo en el log). Alternativas: purga en
   segundo plano o cola. Hoy: aceptar y medir en el smoke.
2. **Sin límite de intentos de contraseña** en `DELETE /v1/me`
   (`EmailRateLimitGuard` solo cubre rutas de email).
3. **Coste del guard**: una consulta por PK en cada petición autenticada.
4. **`meta.petIds`** en la fila de auditoría: guarda ids de mascotas ya
   inexistentes (sin datos personales). ¿Se queda?
5. **`MealServingResponse.createdBy`** pasa a `string | null` en el tipo;
   el móvil no lo lee hoy.
6. **KMS** sin verificar si #246 usa CMK (ver §IAM).

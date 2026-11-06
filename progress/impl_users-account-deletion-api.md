# Implementación #247 users-account-deletion-api

Implementación R1–R15 completa; entrega para revisión del leader. H0: `0e70fff2`. Destino: `dev`. No se ejecuta init.sh, no se abre PR.

## Primer comando

```text
/home/claude/sites/Pet-Tracker-wt-247
feature/247-users-account-deletion-api
0e70fff2 docs(handoff): users-account-deletion-api (#247) handoff to Codex
bf45e5fc chore(spec): firma delegada #247 (mandato del humano 2026-10-23, ampliado 2026-11-06)
f2a90722 docs(spec): users-account-deletion-api (#247) EARS spec, design, tasks and traceability
```

## Anclas de partida

Todas coinciden.

```text
grep -cF '@Delete()' backend-pet-tracker/src/modules/users/infrastructure/users.controller.ts → 0
grep -cF '@Delete('"'"'push-tokens'"'"')' backend-pet-tracker/src/modules/users/infrastructure/users.controller.ts → 1
grep -cF 'sin consultar `users` (R8)' backend-pet-tracker/src/modules/auth/infrastructure/guards/auth.guard.ts → 1
grep -cF 'canActivate(context: ExecutionContext): boolean' backend-pet-tracker/src/modules/auth/infrastructure/guards/auth.guard.ts → 1
grep -cF 'provide: APP_GUARD,' backend-pet-tracker/src/modules/auth/auth.module.ts → 1
grep -cF 'exports: [USER_REPOSITORY]' backend-pet-tracker/src/modules/auth/auth.module.ts → 1
grep -cF 'findById(id: string): Promise<User | null>;' backend-pet-tracker/src/modules/auth/domain/repositories/user.repository.ts → 1
grep -cF 'export class InvalidCredentialsError extends Error' backend-pet-tracker/src/modules/auth/domain/errors/user.errors.ts → 1
grep -cF 'password: z.string().min(1),' backend-pet-tracker/src/modules/auth/application/dto/login-user.dto.ts → 1
grep -cF 'new AuthGuard(reflector, buildTokenService' backend-pet-tracker/src/modules/auth/infrastructure/guards/auth.guard.spec.ts → 8
grep -cF 'imports: [AuthModule],' backend-pet-tracker/src/modules/users/users.module.ts → 1
grep -cF 'exports: [PET_REPOSITORY, PetAccessGuard]' backend-pet-tracker/src/modules/pets/pets.module.ts → 1
grep -cF 'await this.db.delete(pets).where(eq(pets.id, petId));' backend-pet-tracker/src/modules/pets/infrastructure/repositories/pet.drizzle.repository.ts → 1
grep -cF 'action: '"'"'pet.delete'"'"'' backend-pet-tracker/src/modules/pets/application/use-cases/delete-pet.use-case.ts → 1
grep -cF 'expect(calls).toEqual(['"'"'delete'"'"', '"'"'record'"'"']);' backend-pet-tracker/src/modules/pets/application/use-cases/delete-pet.use-case.spec.ts → 1
grep -cF 'async release(assignmentId: string, deviceId: string): Promise<void>' backend-pet-tracker/src/modules/devices/infrastructure/repositories/device.drizzle.repository.ts → 1
grep -cF '.references(() => pets.id, { onDelete: '"'"'cascade'"'"' }),' backend-pet-tracker/src/db/schema/devices.schema.ts → 1
grep -cF '.references(() => users.id, { onDelete: '"'"'cascade'"'"' }),' backend-pet-tracker/src/db/schema/pets.schema.ts → 1
grep -cF '"tag"' backend-pet-tracker/src/db/migrations/meta/_journal.json → 24
grep -cF '"tag": "0023_vaccine_catalog_data"' backend-pet-tracker/src/db/migrations/meta/_journal.json → 1
grep -cF 'meta?: Record<string, unknown>;' backend-pet-tracker/src/audit/audit-log.repository.ts → 1
grep -cF 'export const TABLE_POSITIONS_PARTITION_KEY = '"'"'pk'"'"';' backend-pet-tracker/src/aws/constants.ts → 1
grep -cF 'export const TABLE_POSITIONS_SORT_KEY = '"'"'sk'"'"';' backend-pet-tracker/src/aws/constants.ts → 1
grep -cF 'const DYNAMO_BATCH_WRITE_MAX = 25;' backend-pet-tracker/src/workers/positions-consumer.service.ts → 1
grep -cF 'const DYNAMO_BATCH_WRITE_ATTEMPTS = 3;' backend-pet-tracker/src/workers/positions-consumer.service.ts → 1
grep -cF '@Global()' backend-pet-tracker/src/aws/aws.module.ts → 1
grep -cF 'return `pets/${petId}/photo-${now.getTime()}`;' backend-pet-tracker/src/modules/media/domain/photo-key.ts → 1
grep -cF 'return `pets/${petId}/docs/${documentId}`;' backend-pet-tracker/src/modules/media/domain/document-key.ts → 1
grep -cF 'pasa (solo verifica firma), pero el insert de pet_users viola la FK' backend-pet-tracker/test/pets.e2e-spec.ts → 1
grep -cF 'no consulta `users`, solo verifica la firma — auth-login-me R8' backend-pet-tracker/test/pets.e2e-spec.ts → 1
grep -cF 'sub: uuidv7(),' backend-pet-tracker/test/vaccine-catalog-migration.e2e-spec.ts → 1
grep -cF '— sin una consulta adicional a `users` por parte del guard.' specs/auth-login-me/requirements.md → 1
grep -cF '.references(() => users.id),' backend-pet-tracker/src/db/schema/health.schema.ts → 2
grep -cF 'createdBy: uuid('"'"'created_by'"'"')' backend-pet-tracker/src/db/schema/health.schema.ts → 2
grep -cF '.references(() => users.id),' backend-pet-tracker/src/db/schema/nutrition.schema.ts → 1
grep -cF 'createdBy: uuid('"'"'created_by'"'"')' backend-pet-tracker/src/db/schema/nutrition.schema.ts → 1
grep -cF '.references(() => users.id),' backend-pet-tracker/src/db/schema/reminders.schema.ts → 1
grep -cF 'createdBy: uuid('"'"'created_by'"'"')' backend-pet-tracker/src/db/schema/reminders.schema.ts → 1
grep -cF '.references(() => users.id),' backend-pet-tracker/src/db/schema/media.schema.ts → 1
grep -cF 'createdBy: uuid('"'"'created_by'"'"')' backend-pet-tracker/src/db/schema/media.schema.ts → 1
grep -cF 'createdBy: string;' backend-pet-tracker/src/modules/nutrition/domain/entities/meal-serving.entity.ts → 2
grep -cF 'createdBy: string;' backend-pet-tracker/src/modules/reminders/domain/entities/reminder.entity.ts → 2
grep -cF 'createdBy: string;' backend-pet-tracker/src/modules/media/domain/entities/pet-document.entity.ts → 1
grep -cF 'createdBy: string;' backend-pet-tracker/src/modules/nutrition/infrastructure/mappers/nutrition.mapper.ts → 1
grep -cF 'onDelete: '"'"'no action'"'"'' backend-pet-tracker/src/db/schema/weights.schema.spec.ts → 1
grep -cF 'expect(columns.get('"'"'created_by'"'"')?.notNull).toBe(true);' backend-pet-tracker/src/db/schema/weights.schema.spec.ts → 1
grep -cF 'onDelete: '"'"'no action'"'"'' backend-pet-tracker/src/db/schema/reminders.schema.spec.ts → 1
grep -cF 'expect(columns.get('"'"'created_by'"'"')?.notNull).toBe(true);' backend-pet-tracker/src/db/schema/reminders.schema.spec.ts → 1
grep -cF 'onDelete: '"'"'no action'"'"'' backend-pet-tracker/src/db/schema/meal-servings.schema.spec.ts → 1
grep -cF 'expect(columns.get('"'"'created_by'"'"')?.notNull).toBe(true);' backend-pet-tracker/src/db/schema/meal-servings.schema.spec.ts → 1
ls $B/src/db/migrations | grep -c '^0024_' → 0
ls $B/test | grep -c '^users' → 0
grep -rlF "ListObjectsV2Command" $B/src $B/test | wc -l → 0
grep -rlF "DeleteObjectsCommand" $B/src $B/test | wc -l → 0
grep -rlF "BatchWriteItemCommand" $B/src $B/test | wc -l → 0
grep -rlF "PET_DATA_PURGER" $B/src $B/test | wc -l → 0
grep -rlF "ACCOUNT_DELETION_REPOSITORY" $B/src $B/test | wc -l → 0
grep -rlF "DrizzleTx" $B/src | wc -l → 0
grep -rlF "#247" $B/src $B/test | wc -l → 0
```

## Ejecuciones y commits


### ffd2645d test(db): created_by nullable con set null y migración 0024 (R1)

Prettier write/check, eslint de los .ts tocados y tsc: `exit=0`. Árbol de backend/docs/specs limpio tras commit.

`/tmp/impl-247-R1-red.log` — `exit=1`

```text
Test Suites: 4 failed, 4 total
Tests:       10 failed, 7 passed, 17 total
```

Errores de carga/tipado/DI: 0.

- R1 (meals-served-tracking #83): tabla meal_servings y migracion nueva › declara exactamente las columnas, tipos y nulabilidad aprobados — Expected: false / Received: true
- R1 (meals-served-tracking #83): tabla meal_servings y migracion nueva › aplica las FKs y el cascade solo a pet_id — -     "onDelete": "set null", / +     "onDelete": "no action",
- #247 R1: created_by nullable con ON DELETE SET NULL en las 5 tablas › #247 R1: las 5 columnas created_by son nullable y su FK a users es set null — Expected: false / Received: true
- #247 R1: created_by nullable con ON DELETE SET NULL en las 5 tablas › #247 R1: la migración 0024_created_by_set_null.sql solo suelta NOT NULL y rehace las 5 FKs — -   "0024_created_by_set_null.sql",
- #247 R1: created_by nullable con ON DELETE SET NULL en las 5 tablas › #247 R1: el journal registra 0024_created_by_set_null con idx 24 — Received: undefined
- #247 R1: created_by nullable con ON DELETE SET NULL en las 5 tablas › #247 R1: toda FK del esquema hacia users.id borra en cascada o pone NULL — +   "pet_vaccines.created_by:no action", / +   "weights.created_by:no action", / +   "pet_documents.created_by:no action", / +   "meal_servings.created_by:no action", / +   "reminders.created_by:no action",
- R1: tabla reminders y migracion 0011 aditiva › exporta reminders con las columnas, tipos y nulabilidad aprobados — Expected: false / Received: true
- R1: tabla reminders y migracion 0011 aditiva › declara los CHECKs, FKs e indices exactos — Expected: ArrayContaining [{"column": "pet_id", "foreignTable": "pets", "onDelete": "cascade"}, {"column": "created_by", "foreignTable": "users", "onDelete": "set null"}] / Received: [{"column": "pet_id", "foreignTable": "pets", "onDelete": "cascade"}, {"column": "created_by", "foreignTable": "users", "onDelete": "no action"}]
- R1 (health-weights #15): tabla weights y migracion 0010 nueva › declara exactamente las columnas, tipos y nulabilidad aprobados — Expected: false / Received: true
- R1 (health-weights #15): tabla weights y migracion 0010 nueva › aplica las FKs y el cascade solo a pet_id — Expected: ArrayContaining [{"column": "pet_id", "foreignTable": "pets", "onDelete": "cascade"}, {"column": "created_by", "foreignTable": "users", "onDelete": "set null"}] / Received: [{"column": "pet_id", "foreignTable": "pets", "onDelete": "cascade"}, {"column": "created_by", "foreignTable": "users", "onDelete": "no action"}]

### 6a900be5 feat(db): created_by ON DELETE SET NULL, migración 0024 (R1)

Prettier write/check, eslint de los .ts tocados y tsc: `exit=0`. Árbol de backend/docs/specs limpio tras commit.

`/tmp/impl-247-R1-unit.log` — `exit=0`

```text
Test Suites: 69 passed, 69 total
Tests:       461 passed, 461 total
```

`/tmp/impl-247-R1-e2e.log` — `exit=0`

```text
Test Suites: 2 passed, 2 total
Tests:       32 passed, 32 total
```


R1: `db:generate --name created_by_set_null`: exit=0. SQL y snapshot generados sin edición manual. `DATABASE_URL` exportado ausente (0), espera=1. `db:migrate`: exit=0. Journal Postgres: antes=24, después=25. La primera consulta de recuento omitió DOTENV_CONFIG_PATH, se corrigió la invocación y se cerró solo el proceso propio; no cambió la base.

## PARA inicial — resuelto por el leader antes de reanudar

En el primer intento del commit 3, `prettier --check` avisó sobre `test/users.e2e-spec.ts` inmediatamente después de `--write` y devolvió `exit=1`. Se paró, se guardó `/tmp/impl-247-R2-incomplete.patch` y se restauró el backend al segundo commit. En aquel cierre había 2 commits y el reporte quedó sin commitear.

```text
Checking formatting...
[warn] test/users.e2e-spec.ts
[warn] Code style issues found in the above file. Run Prettier with --write to fix.
exit=1
```

El leader comprobó la estabilidad con Prettier 3.9.6: el único cambio era colapsar `await db .insert(users) .values({` a `await db.insert(users).values({`. Autorizó reaplicar el parche y el pase previo sobre ese fichero. La cadena completa pasó después; no hubo un nuevo PARA ni fue necesario el diagnóstico `prettier ... | diff ...` indicado para una repetición del fallo.

## Reanudación autorizada por el leader

El leader verificó el formato con Prettier 3.9.6; indicó reaplicar el parche y ejecutar un pase previo sobre users.e2e-spec.ts. No es contradicción de la spec. Se reanuda desde el commit 3 conservando H0 y la cuenta final de 13 commits.

### 527c57f1 test(auth): el guard exige que el usuario del token exista (R2)

Prettier write/check, eslint de los .ts tocados y tsc: `exit=0`. Árbol de backend/docs/specs limpio tras commit.

`/tmp/impl-247-R2-red.log` — `exit=1`

```text
Test Suites: 1 failed, 1 total
Tests:       3 failed, 11 passed, 14 total
```

Errores de carga/tipado/DI: 0.

- #247 R2: el guard exige que el usuario del token exista › #247 R2: consulta findById con el sub y adjunta request.user si el usuario existe — Expected number of calls: 1 / Received number of calls: 0
- #247 R2: el guard exige que el usuario del token exista › #247 R2: responde 401 y no adjunta request.user si el usuario ya no existe — Received promise resolved instead of rejected / Resolved to value: true
- #247 R2: el guard exige que el usuario del token exista › #247 R2: un error de la consulta se propaga y no se convierte en 401 — Received promise resolved instead of rejected / Resolved to value: true
`/tmp/impl-247-R2-red-e2e.log` — `exit=1`

```text
Test Suites: 1 failed, 2 passed, 3 total
Tests:       1 failed, 32 passed, 33 total
```

Errores de carga/tipado/DI: 0.

- Users account deletion (e2e) › #247 R2: un token de un usuario borrado da 401 › #247 R2: GET /v1/me y GET /v1/pets responden 401 si el usuario del token ya no existe — expected 401 "Unauthorized", got 404 "Not Found"

Nacen verdes en commit 3: #247 R2 (c) ruta pública y (d) sus dos filas sin header/token inválido; E4 (8 its), E5 (rollback por repositorio) y E6 (catálogo con usuario existente). El e2e rojo falla con `expected 401 "Unauthorized", got 404 "Not Found"` en GET /v1/me del usuario eliminado. Prettier pasó tras el pase previo autorizado: no fue necesario ejecutar el diagnóstico con diff.

### e62b7bb9 feat(auth): el guard consulta users por PK (R2)

Prettier write/check, eslint de los .ts tocados y tsc: `exit=0`. Árbol de backend/docs/specs limpio tras commit.

`/tmp/impl-247-R2-unit.log` — `exit=0`

```text
Test Suites: 69 passed, 69 total
Tests:       467 passed, 467 total
```

`/tmp/impl-247-R2-e2e.log` — `exit=0`

```text
Test Suites: 3 passed, 3 total
Tests:       33 passed, 33 total
```


### d5c3cc9c test(pets): borrar la mascota libera su collar (R10)

Prettier write/check, eslint de los .ts tocados y tsc: `exit=0`. Árbol de backend/docs/specs limpio tras commit.

`/tmp/impl-247-R10-red.log` — `exit=1`

```text
Test Suites: 1 failed, 2 passed, 3 total
Tests:       1 failed, 33 passed, 34 total
```

Errores de carga/tipado/DI: 0.

- Pets CRUD (e2e) › #247 R10: borrar la mascota libera su collar › #247 R10: DELETE /v1/pets/:id deja el collar asignado en available — Expected: "available" / Received: "assigned"

### 5ae914bc feat(pets): deletePetsTx libera collares antes de borrar (R10)

Prettier write/check, eslint de los .ts tocados y tsc: `exit=0`. Árbol de backend/docs/specs limpio tras commit.

`/tmp/impl-247-R10-unit.log` — `exit=0`

```text
Test Suites: 69 passed, 69 total
Tests:       467 passed, 467 total
```

`/tmp/impl-247-R10-e2e.log` — `exit=0`

```text
Test Suites: 3 passed, 3 total
Tests:       34 passed, 34 total
```


### 3f031262 test(pets): PetDataPurgerAwsAdapter (R15)

Prettier write/check, eslint de los .ts tocados y tsc: `exit=0`. Árbol de backend/docs/specs limpio tras commit.

`/tmp/impl-247-R15-red.log` — `exit=1`

```text
Test Suites: 1 failed, 1 total
Tests:       6 failed, 1 passed, 7 total
```

Errores de carga/tipado/DI: 0.

- #247 R15: PetDataPurgerAwsAdapter purga S3 y DynamoDB por mascota › #247 R15: lista pets/<petId>/ y borra la página con DeleteObjects Quiet — -     "Bucket": "bucket-under-test", / -     "Prefix": "pets/p1/",
- #247 R15: PetDataPurgerAwsAdapter purga S3 y DynamoDB por mascota › #247 R15: pagina ListObjectsV2 con ContinuationToken y no borra páginas vacías — -     "Bucket": "bucket-under-test", / -     "Prefix": "pets/p1/", / -     "Bucket": "bucket-under-test", / -     "ContinuationToken": "t1", / -     "Prefix": "pets/p1/",
- #247 R15: PetDataPurgerAwsAdapter purga S3 y DynamoDB por mascota › #247 R15: consulta PET#<petId> solo por claves y borra en lotes de 25 — -     "ExpressionAttributeValues": Object { / -       ":pk": Object { / -         "S": "PET#p1", / -     "KeyConditionExpression": "pk = :pk", / -     "ProjectionExpression": "pk, sk", / -     "TableName": "positions-under-test", / -     "ExclusiveStartKey": Object { / -       "pk": Object { / -         "S": "PET#p1", / -       "sk": Object { / -         "N": "30", / -     "ExpressionAttributeValues": Object { / -       ":pk": Object { / -         "S": "PET#p1", / -     "KeyConditionExpression": "pk = :pk", / -     "ProjectionExpression": "pk, sk", / -     "TableName": "positions-under-test",
- #247 R15: PetDataPurgerAwsAdapter purga S3 y DynamoDB por mascota › #247 R15: reenvía UnprocessedItems hasta 3 intentos por lote — -     "RequestItems": Object { / -       "positions-under-test": Array [ / -           "DeleteRequest": Object { / -             "Key": Object { / -               "pk": Object { / -                 "S": "PET#p1", / -               "sk": Object { / -                 "N": "1", / -     "RequestItems": Object { / -       "positions-under-test": Array [ / -           "DeleteRequest": Object { / -             "Key": Object { / -               "pk": Object { / -                 "S": "PET#p1", / -               "sk": Object { / -                 "N": "1",
- #247 R15: PetDataPurgerAwsAdapter purga S3 y DynamoDB por mascota › #247 R15: un fallo de S3 se registra y sigue con DynamoDB y la siguiente mascota — -   "Query:p1", / -   "ListObjectsV2:p2", / -   "Query:p2",
- #247 R15: PetDataPurgerAwsAdapter purga S3 y DynamoDB por mascota › #247 R15: purga en serie, S3 antes que DynamoDB por mascota, y nunca rechaza — -   "ListObjectsV2:p1", / -   "Query:p1", / -   "ListObjectsV2:p2", / -   "Query:p2",

Nace verde en commit 7: #247 R15 (a), «con [] no envía nada». Los seis its (b)–(g) fallan por las aserciones previstas.

### b84011b5 feat(pets): purga S3 y DynamoDB por mascota (R15)

Prettier write/check, eslint de los .ts tocados y tsc: `exit=0`. Árbol de backend/docs/specs limpio tras commit.

`/tmp/impl-247-R15-unit.log` — `exit=0`

```text
Test Suites: 70 passed, 70 total
Tests:       474 passed, 474 total
```

`/tmp/impl-247-R15-e2e.log` — `exit=0`

```text
Test Suites: 3 passed, 3 total
Tests:       34 passed, 34 total
```


### 012fdb87 test(pets): borrar la mascota purga S3 y DynamoDB (R13)

Prettier write/check, eslint de los .ts tocados y tsc: `exit=0`. Árbol de backend/docs/specs limpio tras commit.

`/tmp/impl-247-R13-red.log` — `exit=1`

```text
Test Suites: 1 failed, 1 total
Tests:       1 failed, 1 passed, 2 total
```

Errores de carga/tipado/DI: 0.

- R16: DeletePetUseCase borra la mascota y audita pet.delete › borra por id y registra la entrada de auditoria despues — -   "purge",
`/tmp/impl-247-R13-red-e2e.log` — `exit=1`

```text
Test Suites: 1 failed, 2 passed, 3 total
Tests:       1 failed, 34 passed, 35 total
```

Errores de carga/tipado/DI: 0.

- Pets CRUD (e2e) › #247 R13: borrar la mascota purga S3 y DynamoDB › #247 R13: DELETE /v1/pets/:id borra pets/<petId>/ y PET#<petId> y no toca otra mascota — -   "dynamoItems": 0, / -   "s3Objects": 0, / +   "dynamoItems": 30, / +   "s3Objects": 2,

Nace verde en commit 9: E7 retitulado «no audita ni purga si el borrado falla». El otro E7 falla por faltar `purge` en el orden; el e2e conserva 2 objetos y 30 ítems donde espera 0 y 0.

### 7ab40b41 feat(pets): DeletePetUseCase purga tras borrar (R13)

Prettier write/check, eslint de los .ts tocados y tsc: `exit=0`. Árbol de backend/docs/specs limpio tras commit.

`/tmp/impl-247-R13-unit.log` — `exit=0`

```text
Test Suites: 70 passed, 70 total
Tests:       474 passed, 474 total
```

`/tmp/impl-247-R13-e2e.log` — `exit=0`

```text
Test Suites: 3 passed, 3 total
Tests:       35 passed, 35 total
```


### 75a66352 test(users): DELETE /v1/me borra la cuenta (R3-R14)

Prettier write/check, eslint de los .ts tocados y tsc: `exit=0`. Árbol de backend/docs/specs limpio tras commit.

`/tmp/impl-247-endpoint-red-unit.log` — `exit=1`

```text
Test Suites: 3 failed, 69 passed, 72 total
Tests:       11 failed, 475 passed, 486 total
```

Errores de carga/tipado/DI: 0.

- #247 R6: contraseña incorrecta rechaza con InvalidCredentialsError y no borra › #247 R6: no borra ni purga con contraseña incorrecta — Expected constructor: InvalidCredentialsError / Received constructor: Error
- #247 R7: usuario inexistente rechaza con UserNotFoundError › #247 R7: no verifica, borra ni purga si falta el usuario — Expected constructor: UserNotFoundError / Received constructor: Error
- #247 R13: borra la cuenta y después purga las mascotas borradas › #247 R13: verifica, borra y purga en ese orden — Received promise rejected instead of resolved / Rejected to value: [Error: Not implemented]
- #247 R13: borra la cuenta y después purga las mascotas borradas › #247 R13: si el borrado falla no purga — Expected: [Error: db down 247] / Received: [Error: Not implemented]
- #247 R11: el borrado de cuenta es una sola transacción ordenada › #247 R11: bloquea, audita, libera, borra mascotas y borra el usuario en una transacción — Received promise rejected instead of resolved / Rejected to value: [Error: Not implemented]
- #247 R11: el borrado de cuenta es una sola transacción ordenada › #247 R11: sin mascotas no toca pet_devices ni pets — Received promise rejected instead of resolved / Rejected to value: [Error: Not implemented]
- #247 R11: el borrado de cuenta es una sola transacción ordenada › #247 R11: si el usuario no existe rechaza con UserNotFoundError sin escribir — Expected constructor: UserNotFoundError / Received constructor: Error
- #247 R3: DELETE /v1/me exige JWT y responde 204 › #247 R3: deleteMe es DELETE en la raíz de me con 204 — Expected: "/" / Received: undefined
- #247 R3: DELETE /v1/me exige JWT y responde 204 › #247 R3: delega en DeleteAccountUseCase con el id y la contraseña — Received promise rejected instead of resolved / Rejected to value: [Error: Not implemented]
- #247 R6: InvalidCredentialsError del borrado es 403 Invalid password › #247 R6: responde ForbiddenException con el body exacto — Expected constructor: ForbiddenException / Received constructor: Error
- #247 R7: UserNotFoundError del borrado es 401 › #247 R7: responde UnauthorizedException, nunca NotFoundException — Expected constructor: UnauthorizedException / Received constructor: Error
`/tmp/impl-247-endpoint-red-e2e.log` — `exit=1`

```text
Test Suites: 1 failed, 2 passed, 3 total
Tests:       17 failed, 35 passed, 52 total
```

Errores de carga/tipado/DI: 0.

- Users account deletion (e2e) › #247 R3: borrar una cuenta sin mascotas responde 204 › #247 R3: con la contraseña correcta responde 204 y borra el usuario y sus push_tokens — expected 204 "No Content", got 404 "Not Found"
- Users account deletion (e2e) › #247 R3: borrar una cuenta sin mascotas responde 204 › #247 R3: sin token responde 401 — expected 401 "Unauthorized", got 404 "Not Found"
- Users account deletion (e2e) › #247 R4: el token anterior al borrado da 401 › #247 R4: GET /v1/me y GET /v1/pets responden 401 con el token anterior — expected 204 "No Content", got 404 "Not Found"
- Users account deletion (e2e) › #247 R4: el token anterior al borrado da 401 › #247 R4: DELETE /v1/me/push-tokens con el token anterior responde 401 — expected 204 "No Content", got 404 "Not Found"
- Users account deletion (e2e) › #247 R5: un body inválido es 400 y no borra › #247 R5: sin body responde 400 Validation failed y el usuario sigue — expected 400 "Bad Request", got 404 "Not Found"
- Users account deletion (e2e) › #247 R5: un body inválido es 400 y no borra › #247 R5: vacío responde 400 Validation failed y el usuario sigue — expected 400 "Bad Request", got 404 "Not Found"
- Users account deletion (e2e) › #247 R5: un body inválido es 400 y no borra › #247 R5: password vacío responde 400 Validation failed y el usuario sigue — expected 400 "Bad Request", got 404 "Not Found"
- Users account deletion (e2e) › #247 R5: un body inválido es 400 y no borra › #247 R5: password no string responde 400 Validation failed y el usuario sigue — expected 400 "Bad Request", got 404 "Not Found"
- Users account deletion (e2e) › #247 R5: un body inválido es 400 y no borra › #247 R5: clave extra responde 400 Validation failed y el usuario sigue — expected 400 "Bad Request", got 404 "Not Found"
- Users account deletion (e2e) › #247 R6: contraseña incorrecta es 403 y no borra nada › #247 R6: responde 403 Invalid password y no borra usuario, mascota ni audita — expected 403 "Forbidden", got 404 "Not Found"
- Users account deletion (e2e) › #247 R8: las mascotas propias se borran para todos › #247 R8: la mascota de un dueño único deja de existir — expected 204 "No Content", got 404 "Not Found"
- Users account deletion (e2e) › #247 R8: las mascotas propias se borran para todos › #247 R8: la mascota compartida desaparece también para el miembro family — expected 204 "No Content", got 404 "Not Found"
- Users account deletion (e2e) › #247 R9: la membresía family en una mascota ajena se suelta › #247 R9: la mascota ajena sobrevive y created_by queda en NULL — expected 204 "No Content", got 404 "Not Found"
- Users account deletion (e2e) › #247 R10: borrar la cuenta libera los collares de sus mascotas › #247 R10: el collar de la mascota borrada con la cuenta queda available — expected 204 "No Content", got 404 "Not Found"
- Users account deletion (e2e) › #247 R12: el borrado de cuenta audita user.delete › #247 R12: deja una sola fila user.delete con user_id NULL, entity_id y meta.petIds — expected 204 "No Content", got 404 "Not Found"
- Users account deletion (e2e) › #247 R13: borrar la cuenta purga S3 y DynamoDB de sus mascotas › #247 R13: borra pets/<petId>/ y PET#<petId> de cada mascota y no toca otra — expected 204 "No Content", got 404 "Not Found"
- Users account deletion (e2e) › #247 R14: un fallo de purga no tumba el 204 y queda en el log › #247 R14: S3 caído responde 204, borra en Postgres, purga DynamoDB y registra PET_PURGE_FAILED — expected 204 "No Content", got 404 "Not Found"

Nace verde en commit 11: controller #247 R3 «ni el controller ni deleteMe llevan @Public()». Los 11 fallos unitarios y los 17 e2e son los previstos por aserción. Los e2e nuevos reciben `404 "Not Found"` donde esperan los estados del contrato (204, 400, 401 o 403); sin fallos de carga, tipos o DI.

### 83ecc9e7 feat(users): DELETE /v1/me borra la cuenta y purga sus mascotas (R3-R14)

Prettier write/check, eslint de los .ts tocados y tsc: `exit=0`. Árbol de backend/docs/specs limpio tras commit.

`/tmp/impl-247-endpoint-unit.log` — `exit=0`

```text
Test Suites: 72 passed, 72 total
Tests:       486 passed, 486 total
```

`/tmp/impl-247-endpoint-e2e.log` — `exit=0`

```text
Test Suites: 3 passed, 3 total
Tests:       52 passed, 52 total
```


## Comprobaciones globales del cierre

Desde `backend-pet-tracker/`:

| Comando | Salida | Log |
|---|---|---|
| `pnpm exec tsc --noEmit` | `exit=0`, sin diagnósticos | `/tmp/impl-247-final-tsc.log` |
| `pnpm exec eslint "{src,test}/**/*.ts"` | `exit=0`, sin diagnósticos | `/tmp/impl-247-final-eslint.log` |
| `pnpm exec prettier --check "src/**/*.ts" "test/**/*.ts"` | `exit=0`; All matched files use Prettier code style! | `/tmp/impl-247-final-prettier.log` |

`FORCE_COLOR=0 pnpm exec jest --config package.json --testTimeout=30000` — `exit=0`.
Log: `/tmp/impl-247-unit-all.log`.

```text
Test Suites: 202 passed, 202 total
Tests:       1680 passed, 1680 total
```

`FORCE_COLOR=0 pnpm exec jest --config ./test/jest-e2e.json pets.e2e users.e2e vaccine-catalog-migration.e2e` — `exit=0`.
Log: `/tmp/impl-247-final-e2e.log`.

```text
Test Suites: 3 passed, 3 total
Tests:       52 passed, 52 total
```

## Commit 13 — este commit documental

`HEAD` — `docs(users-account-deletion-api): trazabilidad e informe de implementación`.
El hash propio se obtiene con `git log -1 --format='%h %s' -- progress/impl_users-account-deletion-api.md`; el reporte forma parte de ese mismo commit.

No toca TypeScript. Los checks globales de tsc, eslint y prettier y las dos suites anteriores son la validación de este cierre: `exit=0`, `Tests: 1680 passed, 1680 total` (unitarios) y `Tests: 52 passed, 52 total` (e2e). Trazabilidad R1–R15 completada, sin celdas pendientes.

## Estado de entrega

```text
git rev-list --count 0e70fff2..HEAD
13

git status --short -- backend-pet-tracker specs docs
(sin salida)
```

Los 12 commits de tests e implementación más este documental conservan el orden y los mensajes literales del handoff, sin refactors adicionales. En cada commit rojo solo hubo fallos de aserción y el contador `ReferenceError|Cannot find module|error TS|TypeError|Nest can't resolve` fue 0; cada commit se cerró con prettier, eslint y tsc en `exit=0`.

Todas las esperas previas a cada Jest y a `db:migrate` dieron `test -z "${DATABASE_URL:-}"` = `0` y `espera=1`. Solo se aplicó la migración R1: journal del worktree 24 → 25. Se conservaron los logs en `/tmp` y el parche del primer cierre. No hubo un segundo PARA; el inicial quedó resuelto con la instrucción del leader.

No se ejecutaron `./init.sh`, instalaciones, mutaciones del reviewer, push ni operaciones de PR. No se modificaron el estado de la feature, la aprobación, archivos de configuración, migraciones 0000–0023, `.env`, mobile ni infra. El leader queda a cargo de init, revisión, integración en dev y PR. Los límites de purga síncrona, rate limiting e IAM siguen siendo los documentados en el diseño aprobado.

Último artefacto: `progress/impl_users-account-deletion-api.done`, sin commitear, con una sola línea que apunta a este reporte.

## Enmienda del leader: devices.e2e R15

Enmienda aprobada en `a39cd0c0` (2026-11-06). El init del leader detectó un candado previo de #5 que esperaba `assigned` tras borrar la mascota; R10 exige `available`. Se actualizó únicamente `test/devices.e2e-spec.ts`: comentario de dos líneas, variable `released` y aserción de estado. Los títulos del describe/it, las asignaciones en 0, el reclamo posterior de ownerB y su estado final `assigned` se conservaron.

Anclas medidas desde `backend-pet-tracker/`:

| Orden | Antes | Después |
|---|---|---|
| `grep -cF "orphaned" test/devices.e2e-spec.ts` | `2` | `0` |
| `grep -cF "expect(released.status).toBe('available');" test/devices.e2e-spec.ts` | `0` | `1` |
| `grep -cF "queda 'assigned' huerfano" test/devices.e2e-spec.ts` | `1` | `0` |

Esperas previas al Jest, en comandos separados: `test -z "${DATABASE_URL:-}"` devolvió `0`; el bucle de `pgrep` devolvió `espera=1`.

`FORCE_COLOR=0 pnpm exec jest --config ./test/jest-e2e.json test/devices.e2e-spec.ts > /tmp/impl-247-devices-e2e.log 2>&1; echo "exit=$?"`:

```text
exit=0
Test Suites: 1 passed, 1 total
Tests:       29 passed, 29 total
```

Después del Jest se ejecutaron `pnpm exec prettier --write test/devices.e2e-spec.ts`, `pnpm exec prettier --check test/devices.e2e-spec.ts`, `pnpm exec eslint test/devices.e2e-spec.ts` y `pnpm exec tsc --noEmit -p tsconfig.json`: `exit=0`. Prettier no cambió el fichero y `git diff --check` no encontró problemas.

Commit 14: `f33a4e2c test(devices): R15 e2e expects the collar released by #247 R10`.

Commit 15 (este commit documental): `docs(users-account-deletion-api): record the devices R15 amendment`.

Los apartados previos describen la entrega original en `58cc9623`; su cuenta de 13 commits es histórica. La cuenta final de esta enmienda incluye aquellos 13, `a39cd0c0` y los commits 14 y 15:

```text
git rev-list --count 0e70fff2..HEAD
16

git status --short -- backend-pet-tracker specs docs
(sin salida)
```

No se ejecutó `./init.sh` ni se aplicaron migraciones. No hubo un nuevo PARA. Los logs se conservan en `/tmp`. Última acción: recrear `progress/impl_users-account-deletion-api.done` con la ruta de este reporte, sin commitear el marcador.

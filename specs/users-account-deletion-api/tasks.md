---
feature: "users-account-deletion-api"
status: approved     # draft | approved
tags: [harness, spec, backend]
---

# Tareas — [[users-account-deletion-api]]

> Disciplina TDD. Cada bloque corresponde a un requisito (o a requisitos que
> comparten commit) de [[requirements]], con los mismos 3 sub-items en este
> orden. Rutas desde la raíz del repo; `B=backend-pet-tracker`. Diseño en
> [[design]] (D1–D10).

## Reglas de cabecera (valen para todos los bloques)

1. **Commit rojo antes que verde.** El rojo lleva el test y, si hace falta,
   el **stub** de firma que se indica; el verde, la implementación. Nunca
   implementación + tests en un solo commit (C4).
2. **El rojo tiene que ser de aserción.** ts-jest tiene los diagnósticos
   activos: un `TS2307`/`TS2339`/`TS2554` tumba la suite entera y **no vale
   como rojo**; tampoco un `ReferenceError` ni un error de DI de Nest al
   arrancar el e2e. Por eso los rojos de R2, R15, R13 y R3–R14 llevan el
   stub descrito, y todo helper de test nuevo (`buildUsers`,
   `buildContextWithRequest`, `seedDevice`, `B/test/fixtures/pet-stores.ts`,
   el doble de transacción de R11) entra en el mismo commit rojo que lo usa.
3. **Forma de los stubs.** Ningún stub es `async` ni deja parámetros sin
   usar (eslint marcaría `require-await` y `no-unused-vars`): cada método
   stub nombra sus parámetros con `void` y devuelve
   `Promise.reject(new Error('Not implemented'))` o `Promise.resolve(...)`
   según se indique. El verde borra los `void`.
4. **Orden fijo y por qué.** R1 va primero: sin `SET NULL`, R9 da `23503`.
   R2 va antes del endpoint: E5 y E6 dependen del guard nuevo. R10 crea
   `deletePetsTx`, que R11 reutiliza. R15 (adapter) va antes de R13 (quien
   lo llama). El endpoint (R3–R14) va al final y comparte un solo par
   rojo/verde.
5. **Nacen verdes, declarados.** Los its que se listan como «nace verde» en
   la tabla de commits pasan ya en su commit rojo por diseño; anótalos así
   en `progress/impl_users-account-deletion-api.md`. Ningún requisito es
   de verificación (C4): todos tienen un rojo real.
6. **Sin pipe** al medir exit codes. Ejecuciones parciales:
   - unit: `pnpm -C backend-pet-tracker exec jest src/db/schema src/modules/auth src/modules/devices src/modules/pets src/modules/users`
   - e2e (Postgres y LocalStack arriba, base del worktree migrada):
     `cd backend-pet-tracker && pnpm exec jest --config ./test/jest-e2e.json pets.e2e users.e2e vaccine-catalog-migration.e2e`
   - **No** ejecutar `./init.sh` (lo corre el leader).
7. **Medir la base al arrancar**, antes del primer commit, y anotar las
   salidas en `progress/impl_users-account-deletion-api.md`: todas las
   anclas de [[requirements]] §Contexto fijo y §Anclas con pipe. Si
   `ls backend-pet-tracker/src/db/migrations | grep -c '^0024_'` no da `0`,
   **para**: otra feature tomó el número y el leader reasigna.
8. Prefijo `#247 R<n>:` en todo `describe`/`it` nuevo. Los its existentes
   que cambian (E1–E8) **conservan** describe y título, salvo el retítulo
   de E7.
9. `pnpm -C backend-pet-tracker exec prettier --write <ficheros del commit>`
   antes de cada commit.

## Tabla de commits y rojo esperado

| # | Commit | Rojo esperado (por aserción) | Nace verde (declarado) |
|---|---|---|---|
| 1 | `test(db): created_by nullable con set null y migración 0024 (R1)` | `created-by-set-null.schema.spec.ts` (4 its); E1–E3 (6 its) | — |
| 2 | `feat(db): created_by ON DELETE SET NULL, migración 0024 (R1)` | — | — |
| 3 | `test(auth): el guard exige que el usuario del token exista (R2)` + stub | guard `#247 R2` (a), (b), (e); users e2e `#247 R2` | guard `#247 R2` (c) y (d) (2 filas); E4 (8 its); E5; E6 |
| 4 | `feat(auth): el guard consulta users por PK (R2)` | — | — |
| 5 | `test(pets): borrar la mascota libera su collar (R10)` | pets e2e `#247 R10` | — |
| 6 | `feat(pets): deletePetsTx libera collares antes de borrar (R10)` | — | — |
| 7 | `test(pets): PetDataPurgerAwsAdapter (R15)` + stub | `#247 R15` (b)–(g) | `#247 R15` (a) |
| 8 | `feat(pets): purga S3 y DynamoDB por mascota (R15)` | — | — |
| 9 | `test(pets): borrar la mascota purga S3 y DynamoDB (R13)` + stub | E7 (orden); pets e2e `#247 R13` | E7 retitulado (`no audita ni purga…`) |
| 10 | `feat(pets): DeletePetUseCase purga tras borrar (R13)` | — | — |
| 11 | `test(users): DELETE /v1/me borra la cuenta (R3-R14)` + stubs | controller `#247 R3` (metadata, handler), `#247 R6`, `#247 R7`; use case `#247 R6`, `#247 R7`, `#247 R13` (2 its); repo `#247 R11` (3 its); users e2e `#247 R3`–`#247 R14` | controller `#247 R3` «no lleva @Public» |
| 12 | `feat(users): DELETE /v1/me borra la cuenta y purga sus mascotas (R3-R14)` | — | — |
| 13 | `docs(users-account-deletion-api): trazabilidad e informe de implementación` | — | — |

Commits de refactor (`refactor(<scope>): …`) opcionales tras cada verde,
siempre con las suites unit y e2e de arriba verdes.

---

## R1 — `created_by` nullable con `ON DELETE SET NULL`

- [ ] (1) Test rojo (commit 1) — crear
      `B/src/db/schema/created-by-set-null.schema.spec.ts` con
      `describe('#247 R1: created_by nullable con ON DELETE SET NULL en las 5 tablas', ...)`,
      patrón de `alerts.schema.spec.ts` (`getTableConfig` +
      `readdirSync`/`readFileSync` sobre `join(__dirname, '..', 'migrations')`).
      Tablas importadas del esquema: `petVaccines` y `weights`
      (`health.schema`), `mealServings` (`nutrition.schema`), `reminders`
      (`reminders.schema`), `petDocuments` (`media.schema`).
      - `it('#247 R1: las 5 columnas created_by son nullable y su FK a users es set null', ...)`
        → por cada tabla: la columna `created_by` existe
        (`toBeDefined()` primero), `notNull === false`, y la FK cuya
        `reference().columns[0].name === 'created_by'` tiene
        `reference().foreignTable` = `users` y `onDelete === 'set null'`.
      - `it('#247 R1: la migración 0024_created_by_set_null.sql solo suelta NOT NULL y rehace las 5 FKs', ...)`
        → **primero**
        `readdirSync(MIGRATIONS_DIR).filter((f) => f.startsWith('0024_'))`
        `toEqual(['0024_created_by_set_null.sql'])`; luego, sobre su
        contenido, por cada tabla `t` de `['pet_vaccines', 'weights', 'meal_servings', 'reminders', 'pet_documents']`:
        contiene `ALTER TABLE "${t}" ALTER COLUMN "created_by" DROP NOT NULL`
        y casa
        `` new RegExp(`ALTER TABLE "${t}" ADD CONSTRAINT "[^"]+" FOREIGN KEY \\("created_by"\\) REFERENCES "public"\\."users"\\("id"\\) ON DELETE set null`) ``;
        y no contiene `DROP TABLE`, `DROP COLUMN`, `CREATE TABLE` ni
        `ADD COLUMN`.
      - `it('#247 R1: el journal registra 0024_created_by_set_null con idx 24', ...)`
        → en `meta/_journal.json` la entrada con
        `tag === '0024_created_by_set_null'` existe y tiene `idx === 24`.
        **No** asertar el total de entradas.
      - `it('#247 R1: toda FK del esquema hacia users.id borra en cascada o pone NULL')`
        → `import * as schema from '@/db/schema'`; recorre
        `Object.values(schema).filter((value) => is(value, PgTable))`
        (`is` de `drizzle-orm`, `PgTable` de `drizzle-orm/pg-core`) y, por
        cada FK de `getTableConfig(table).foreignKeys` cuya
        `reference().foreignTable === users`, construye
        `` `${tableName}.${columns[0].name}:${String(fk.onDelete)}` ``.
        Aserciones: los que no acaban en `:cascade` ni en `:set null`
        `toEqual([])`; y la lista `toContain` cada uno de
        `pet_vaccines.created_by:set null`, `weights.created_by:set null`,
        `meal_servings.created_by:set null`, `reminders.created_by:set null`
        y `pet_documents.created_by:set null` (esto evita que el it pase
        en vacío si el filtro no encuentra tablas). **No** asertar el
        número total de FKs.
      - E1–E3 ([[requirements]]): `notNull` de `created_by` a `false` y
        `onDelete` a `'set null'` en los dos its de cada spec.
- [ ] (2) Implementación mínima (commit 2) — D3: en los 4 ficheros de
      esquema, `createdBy: uuid('created_by').references(() => users.id, { onDelete: 'set null' })`
      sin `.notNull()`. Generar con
      `pnpm -C backend-pet-tracker db:generate --name created_by_set_null`.
      **No** editar a mano el SQL ni el snapshot; si drizzle-kit genera algo
      que el test no acepta, **para** y repórtalo. Aplicar a la base del
      worktree con `pnpm -C backend-pet-tracker db:migrate` (lee el `.env`
      del worktree; no exportes `DATABASE_URL`). Tipos de lectura a
      `string | null` (D3: `meal-serving.entity.ts` ×2,
      `reminder.entity.ts` ×2, `pet-document.entity.ts` ×1,
      `nutrition.mapper.ts` ×1); los tipos de entrada no cambian. En
      `docs/data-model.md`, las filas de `pet_vaccines`, `weights`,
      `reminders`, `meal_servings` y `pet_documents` pasan a
      `created_by FK SET NULL NULL` con la nota «(#247, migración `0024`)».
      Verde: `pnpm -C backend-pet-tracker exec tsc --noEmit` limpio.
- [ ] (3) Refactor con tests verdes — ninguno previsto.

## R2 — el guard exige que el usuario del token exista

- [ ] (1) Test rojo (commit 3).
      **Stub** en `B/src/modules/auth/infrastructure/guards/auth.guard.ts`:
      3.er parámetro `@Inject(USER_REPOSITORY) private readonly users: UserRepository`
      (de `@/modules/auth/domain/repositories/user.repository`) y
      `canActivate(context: ExecutionContext): Promise<boolean>` **sin**
      `async`, con el cuerpo actual entero dentro de
      `return Promise.resolve().then(() => { …cuerpo actual… });` (así un
      `throw` del cuerpo llega como rechazo). No consulta `users` todavía.
      En `auth.guard.spec.ts`:
      - E4: los 8 its pasan a `new AuthGuard(reflector, buildTokenService(...), buildUsers().users)`
        y a aserciones asíncronas (`await expect(guard.canActivate(ctx)).rejects.toThrow(UnauthorizedException)`,
        `await expect(...).resolves.toBe(true)`, `await guard.canActivate(ctx)`).
      - helper `buildUsers(found: User | null = { id: 'user-1' } as unknown as User)`
        → `{ users: { findById } as unknown as UserRepository, findById }`
        con `findById = jest.fn().mockResolvedValue(found)`.
      - helper `buildContextWithRequest(authorization?: string)` → `{ context, request }`
        (mismo objeto que construye inline el it de R8).
      - `describe('#247 R2: el guard exige que el usuario del token exista', ...)`:
        - (a) `it('#247 R2: consulta findById con el sub y adjunta request.user si el usuario existe')`
          → `verify` devuelve `{ sub: 'user-1', email: 'ada@example.com' }`;
          `resolves.toBe(true)`; `findById` llamado **una** vez con
          `'user-1'`; `request.user` `toEqual({ id: 'user-1', email: 'ada@example.com' })`.
        - (b) `it('#247 R2: responde 401 y no adjunta request.user si el usuario ya no existe')`
          → `buildUsers(null)`; `rejects.toThrow(UnauthorizedException)`;
          `request.user` `toBeUndefined()`.
        - (c) `it('#247 R2: una ruta @Public() no consulta users')` →
          `buildReflector(true)`, token válido; `resolves.toBe(true)`;
          `findById` no llamado.
        - (d) `it.each` con dos filas — sin header `Authorization`, y
          `verify` que lanza — título
          `'#247 R2: %s responde 401 sin consultar users'`;
          `rejects.toThrow(UnauthorizedException)`; `findById` no llamado.
        - (e) `it('#247 R2: un error de la consulta se propaga y no se convierte en 401')`
          → `findById = jest.fn().mockRejectedValue(new Error('db down 247'))`;
          `rejects.toThrow('db down 247')` **y**
          `rejects.not.toBeInstanceOf(UnauthorizedException)`.
      Crear `B/test/users.e2e-spec.ts` (`describe('Users account deletion (e2e)')`),
      con el arranque de `pets.e2e-spec.ts` (`AppModule`,
      `setGlobalPrefix('v1')`, `DRIZZLE`, `TOKEN_SERVICE`) y:
      - `const PASSWORD = 'Secreto-247-e2e'`; en `beforeAll`,
        `passwordHash = await app.get<PasswordHasher>(PASSWORD_HASHER).hash(PASSWORD)`.
      - `seedUser(label)` como el de pets e2e (email
        `users-e2e-${label}-${RUN_ID}@example.com`) pero con
        `passwordHash` real; empuja el id a `createdUserIds`.
      - `afterAll`: borra `audit_log` donde `userId` o `entityId` está en
        `createdUserIds`/`createdPetIds`, luego `pets` por
        `createdPetIds`, `users` por `createdUserIds` y `devices` por
        `createdDeviceIds` (borrar lo ya borrado no falla); luego
        `app.close()`.
      - `describe('#247 R2: un token de un usuario borrado da 401', ...)` →
        `it('#247 R2: GET /v1/me y GET /v1/pets responden 401 si el usuario del token ya no existe')`:
        siembra un usuario, firma su token, lo borra con
        `db.delete(users)` y espera `401` en ambos (hoy: `404` y `200`).
      E5 y E6 ([[requirements]]), incluidos el comentario del it y la
      cabecera de `pets.e2e-spec.ts`.
- [ ] (2) Implementación mínima (commit 4) — D2: `async canActivate`;
      `findById(payload.sub)` **fuera** del `try/catch` de `verify`;
      `null` ⇒ `UnauthorizedException`; `request.user` solo tras encontrar
      al usuario. Comentario de cabecera del guard reescrito (ya no dice
      «sin consultar `users`»). Nota de enmienda bajo R8 en
      `specs/auth-login-me/requirements.md`, literal de D2.
- [ ] (3) Refactor con tests verdes — ninguno previsto.

## R10 (suelto) — borrar la mascota libera su collar

- [ ] (1) Test rojo (commit 5) — en `B/test/pets.e2e-spec.ts`, helper
      `seedDevice(label)` que inserta en `devices`
      `{ id: uuidv7(), model: 'e2e-collar', isSimulated: true, status: 'assigned' }`
      y empuja el id a un nuevo `createdDeviceIds` (borrado en `afterAll`
      después de `pets`).
      `describe('#247 R10: borrar la mascota libera su collar', ...)` →
      `it('#247 R10: DELETE /v1/pets/:id deja el collar asignado en available')`:
      el owner crea la mascota por API, se inserta
      `petDevices { id: uuidv7(), petId, deviceId }` (activa:
      `releasedAt` nulo), `DELETE /v1/pets/:id` → `204`, y
      `devices.status` del collar es `'available'` (hoy queda
      `'assigned'`).
- [ ] (2) Implementación mínima (commit 6) — D4: `B/src/db/drizzle-tx.ts`
      (`DrizzleTx`), `release-device.tx.ts` (`releaseDeviceTx`; `release`
      delega en él), `delete-pets.tx.ts` (`deletePetsTx`) y
      `PetDrizzleRepository.delete` dentro de `db.transaction`.
- [ ] (3) Refactor con tests verdes — ninguno previsto.

## R15 — `PetDataPurgerAwsAdapter`

- [ ] (1) Test rojo (commit 7).
      **Stub**: el puerto `B/src/modules/pets/domain/ports/pet-data-purger.ts`
      completo (D6) y `B/src/modules/pets/infrastructure/pet-data-purger.aws.adapter.ts`
      con el constructor final (D6) y
      `purge(petIds: readonly string[]): Promise<void> { void petIds; return Promise.resolve(); }`.
      Crear `B/src/modules/pets/infrastructure/pet-data-purger.aws.adapter.spec.ts`
      con `describe('#247 R15: PetDataPurgerAwsAdapter purga S3 y DynamoDB por mascota', ...)`.
      Construcción:
      `new PetDataPurgerAwsAdapter({ send: s3Send } as unknown as S3Client, { send: dynamoSend } as unknown as DynamoDBClient, { mediaBucket: 'bucket-under-test', positionsTable: 'positions-under-test' } as AwsResourceNames)`;
      `s3Send`/`dynamoSend` son `jest.fn()` que distinguen el comando por
      `instanceof` y leen `.input`; un array `calls` compartido registra
      `'<Comando>:<petId>'`. Log:
      `jest.spyOn(Logger.prototype, 'error').mockImplementation(() => undefined)`,
      leído como `spy.mock.calls.map(([message]) => String(message))`
      (sin `expect.any`/`expect.stringContaining`), restaurado en
      `afterEach`. Cada it abre con `await expect(adapter.purge([...])).resolves.toBeUndefined()`.
      - (a) `it('#247 R15: con [] no envía nada')` → ningún `send`.
      - (b) `it('#247 R15: lista pets/<petId>/ y borra la página con DeleteObjects Quiet')`
        → `ListObjectsV2Command.input` `toEqual({ Bucket: 'bucket-under-test', Prefix: 'pets/p1/' })`;
        con `Contents` de 2 claves, un `DeleteObjectsCommand` con input
        `{ Bucket: 'bucket-under-test', Delete: { Objects: [{ Key: k1 }, { Key: k2 }], Quiet: true } }`.
      - (c) `it('#247 R15: pagina ListObjectsV2 con ContinuationToken y no borra páginas vacías')`
        → página 1 `IsTruncated: true, NextContinuationToken: 't1'`; la 2.ª
        llamada lleva `ContinuationToken: 't1'`; una página sin `Contents`
        no genera `DeleteObjects`.
      - (d) `it('#247 R15: consulta PET#<petId> solo por claves y borra en lotes de 25')`
        → `QueryCommand.input` `toEqual({ TableName: 'positions-under-test', KeyConditionExpression: 'pk = :pk', ExpressionAttributeValues: { ':pk': { S: 'PET#p1' } }, ProjectionExpression: 'pk, sk' })`;
        con 30 `Items` y `LastEvaluatedKey`, la 2.ª `Query` lleva ese
        `ExclusiveStartKey`; los `BatchWriteItemCommand` llevan
        `RequestItems['positions-under-test']` de 25 y 5 `DeleteRequest`
        con las claves tal cual.
      - (e) `it('#247 R15: reenvía UnprocessedItems hasta 3 intentos por lote')`
        → caso 1: el 1.er `BatchWriteItem` devuelve 1 ítem en
        `UnprocessedItems`; el 2.º envía exactamente ese ítem y devuelve
        `{}`; sin log. Caso 2: los 3 intentos devuelven `UnprocessedItems`;
        exactamente 3 `BatchWriteItem` para ese lote y un mensaje que empieza
        por `PET_PURGE_FAILED store=dynamodb petId=p1 target=PET#p1 reason=`.
      - (f) `it('#247 R15: un fallo de S3 se registra y sigue con DynamoDB y la siguiente mascota')`
        → `ListObjectsV2` de `p1` rechaza `new Error('s3 down')`; se
        hacen igualmente la `Query` de `p1` y las dos purgas de `p2`; un solo
        mensaje, igual a
        `PET_PURGE_FAILED store=s3 petId=p1 target=pets/p1/ reason=s3 down`.
        Un `DeleteObjects` que responde `Errors: [{ Key, Code }]` también
        produce un mensaje `store=s3`.
      - (g) `it('#247 R15: purga en serie, S3 antes que DynamoDB por mascota, y nunca rechaza')`
        → con `['p1', 'p2']`, `calls` en orden S3 de `p1`, DynamoDB de `p1`,
        S3 de `p2`, DynamoDB de `p2`; con ambos clientes rechazando todo,
        resuelve y deja 4 mensajes.
- [ ] (2) Implementación mínima (commit 8) — D6 completo, más el provider
      `{ provide: PET_DATA_PURGER, useClass: PetDataPurgerAwsAdapter }` y
      `PET_DATA_PURGER` en los `exports` de `PetsModule`.
- [ ] (3) Refactor con tests verdes — ninguno previsto.

## R13 (suelto) — `DELETE /v1/pets/:id` purga tras borrar

- [ ] (1) Test rojo (commit 9).
      **Stub**: `DeletePetUseCase` recibe el 3.er parámetro
      `@Inject(PET_DATA_PURGER) private readonly purger: PetDataPurger`;
      `execute` sin cambios.
      E7 ([[requirements]]). Crear `B/test/fixtures/pet-stores.ts` (no es
      suite: no acaba en `.e2e-spec.ts`):
      - `interface PetStores { s3: S3Client; dynamo: DynamoDBClient; names: AwsResourceNames }`
        y `petStoresOf(app: INestApplication): PetStores` con
        `app.get(S3_CLIENT)`, `app.get(DYNAMODB_CLIENT)` y
        `app.get(AWS_RESOURCE_NAMES)`;
      - `seedPetStores(stores, petId)`: `PutObjectCommand` de
        `pets/${petId}/photo-1` y `pets/${petId}/docs/${uuidv7()}`
        (`Body: 'e2e'`) y 30 `PutItemCommand` de
        `` { pk: { S: `PET#${petId}` }, sk: { N: String(i) } } `` (i = 1..30);
      - `countPetStores(stores, petId)` → `{ s3Objects, dynamoItems }`:
        `(Contents ?? []).length` de un `ListObjectsV2` por prefijo y
        `Count` de una `Query` con `Select: 'COUNT'`;
      - `cleanPetStores(stores, petId)`: `DeleteObjectCommand` por clave y
        `DeleteItemCommand` por ítem (no usa el código bajo prueba).
      En `pets.e2e-spec.ts`:
      `describe('#247 R13: borrar la mascota purga S3 y DynamoDB', ...)` →
      `it('#247 R13: DELETE /v1/pets/:id borra pets/<petId>/ y PET#<petId> y no toca otra mascota')`:
      crea la mascota por API; `seedPetStores` de su id y de un
      `foreignPetId = uuidv7()`; `DELETE` → `204`; `countPetStores` de la
      mascota `toEqual({ s3Objects: 0, dynamoItems: 0 })` y del ajeno
      `toEqual({ s3Objects: 2, dynamoItems: 30 })`. `cleanPetStores` de
      ambos ids en `afterAll`.
- [ ] (2) Implementación mínima (commit 10) — D7: `delete` ⇒
      `purge([petId])` ⇒ `record`.
- [ ] (3) Refactor con tests verdes — ninguno previsto.

## R3–R9, R10 (cuenta), R11–R14 — `DELETE /v1/me`

- [ ] (1) Test rojo (commit 11).
      **Stubs**:
      - puerto `B/src/modules/users/domain/repositories/account-deletion.repository.ts`
        completo (D5);
      - `AccountDeletionDrizzleRepository` con su constructor (D5) y
        `deleteAccount(userId: string): Promise<string[]> { void userId; return Promise.reject(new Error('Not implemented')); }`;
      - `DeleteAccountUseCase` con el constructor final (D8) y
        `execute(userId: string, password: string): Promise<void> { void userId; void password; return Promise.reject(new Error('Not implemented')); }`;
      - `UsersController`: 5.º parámetro `DeleteAccountUseCase` y método
        `deleteMe(user: CurrentUserPayload, body: unknown): Promise<void>`
        **sin decoradores** de ruta ni de parámetro, que hace `void` de
        ambos y devuelve `Promise.reject(new Error('Not implemented'))`
        (así `DELETE /v1/me` da `404` en e2e);
      - módulos según D9 (`AuthModule` exporta `PASSWORD_HASHER`;
        `UsersModule` importa `PetsModule` y registra los dos providers).
      Tests:
      - E8 en `users.controller.spec.ts`, y en ese fichero:
        - `describe('#247 R3: DELETE /v1/me exige JWT y responde 204', ...)`:
          `it('#247 R3: ni el controller ni deleteMe llevan @Public()')`
          (nace verde); `it('#247 R3: deleteMe es DELETE en la raíz de me con 204')`
          → `PATH_METADATA` `'/'`, `METHOD_METADATA`
          `RequestMethod.DELETE`, `HTTP_CODE_METADATA`
          `HttpStatus.NO_CONTENT`;
          `it('#247 R3: delega en DeleteAccountUseCase con el id y la contraseña')`
          → `resolves.toBeUndefined()` y `deleteAccount` llamado con
          `('user-1', 'secret')`.
        - `describe('#247 R6: InvalidCredentialsError del borrado es 403 Invalid password', ...)`
          → `it('#247 R6: responde ForbiddenException con el body exacto')`:
          `deleteAccount` rechaza `new InvalidCredentialsError()`; rechaza
          con `ForbiddenException` cuyo `getResponse()` `toEqual({ statusCode: 403, message: 'Invalid password', error: 'Forbidden' })`.
        - `describe('#247 R7: UserNotFoundError del borrado es 401', ...)`
          → `it('#247 R7: responde UnauthorizedException, nunca NotFoundException')`:
          `deleteAccount` rechaza `new UserNotFoundError('user-1')`;
          rechaza con `UnauthorizedException` cuyo `getResponse()`
          `toEqual({ statusCode: 401, message: 'Unauthorized' })`.
      - `B/src/modules/users/application/use-cases/delete-account.use-case.spec.ts`
        (dobles con `calls` compartido, como E7; `findById` resuelve
        `{ id: USER_ID, passwordHash: HASH } as unknown as User`,
        `verify` resuelve `true`, `deleteAccount` resuelve `[P1, P2]`):
        - `describe('#247 R6: contraseña incorrecta rechaza con InvalidCredentialsError y no borra', ...)`
          → `verify` resuelve `false`; `rejects.toBeInstanceOf(InvalidCredentialsError)`;
          `deleteAccount` y `purge` no llamados.
        - `describe('#247 R7: usuario inexistente rechaza con UserNotFoundError', ...)`
          → `findById` resuelve `null`; `rejects.toBeInstanceOf(UserNotFoundError)`;
          `verify`, `deleteAccount` y `purge` no llamados.
        - `describe('#247 R13: borra la cuenta y después purga las mascotas borradas', ...)`:
          `it('#247 R13: verifica, borra y purga en ese orden')` →
          `resolves.toBeUndefined()`; `calls`
          `toEqual(['findById', 'verify', 'deleteAccount', 'purge'])`;
          `verify` con `('secret', HASH)`; `deleteAccount` con `USER_ID`;
          `purge` con `[P1, P2]`.
          `it('#247 R13: si el borrado falla no purga')` → `deleteAccount`
          rechaza `dbError`; `rejects.toBe(dbError)`; `purge` no llamado.
      - `B/src/modules/users/infrastructure/repositories/account-deletion.drizzle.repository.spec.ts`,
        `describe('#247 R11: el borrado de cuenta es una sola transacción ordenada', ...)`.
        Doble de `db` al estilo de `pet.drizzle.repository.spec.ts`:
        `transaction(fn)` marca «dentro», llama `fn(tx)` y cuenta
        llamadas; `tx` registra en `ops` cada operación con la tabla
        identificada por identidad (`table === users`, etc.):
        `select(...).from(t).where(...)` es awaitable y además tiene
        `.for(mode)` (registra `select:<tabla>:for <mode>`); `insert(t).values(v)`
        registra `insert:<tabla>` y guarda `v`; `update(t).set(v).where(...)`
        registra `update:<tabla>`; `delete(t).where(...)` registra
        `delete:<tabla>`. Filas: `users` → `[{ id: USER_ID }]`,
        `pet_users` → `[{ petId: P1 }, { petId: P2 }]`, `pet_devices` →
        `[{ id: A1, deviceId: D1 }]`. Cada it abre con
        `await expect(repository.deleteAccount(USER_ID))…`:
        - `it('#247 R11: bloquea, audita, libera, borra mascotas y borra el usuario en una transacción')`
          → `resolves.toEqual([P1, P2])`; `ops` `toEqual(['select:users:for update', 'select:pet_users', 'insert:audit_log', 'select:pet_devices', 'update:pet_devices', 'update:devices', 'delete:pets', 'delete:users'])`;
          todas dentro; `transaction` llamado una vez; el insert de
          auditoría `toEqual({ userId: USER_ID, action: 'user.delete', entity: 'user', entityId: USER_ID, meta: { petIds: [P1, P2] } })`.
        - `it('#247 R11: sin mascotas no toca pet_devices ni pets')` →
          `pet_users` vacío; `resolves.toEqual([])`; `ops`
          `toEqual(['select:users:for update', 'select:pet_users', 'insert:audit_log', 'delete:users'])`;
          `meta` `{ petIds: [] }`.
        - `it('#247 R11: si el usuario no existe rechaza con UserNotFoundError sin escribir')`
          → `users` vacío; `rejects.toBeInstanceOf(UserNotFoundError)`;
          `ops` `toEqual(['select:users:for update'])`.
      - En `B/test/users.e2e-spec.ts` (helpers nuevos aquí:
        `createPetViaApi(owner)` como el de pets e2e, `seedMembership`,
        `seedDevice`, `deleteMe(user, body)` →
        `api().delete('/v1/me').set('Authorization', …).send(body)`):
        - `describe('#247 R3: borrar una cuenta sin mascotas responde 204', ...)`:
          `it('#247 R3: con la contraseña correcta responde 204 y borra el usuario y sus push_tokens')`
          → inserta un `push_tokens` del usuario; `204`, `response.text`
          `''`; 0 filas en `users` y en `push_tokens` para su id.
          `it('#247 R3: sin token responde 401')`.
        - `describe('#247 R4: el token anterior al borrado da 401', ...)`:
          `it('#247 R4: GET /v1/me y GET /v1/pets responden 401 con el token anterior')`
          (primero el `204` del borrado);
          `it('#247 R4: DELETE /v1/me/push-tokens con el token anterior responde 401')`
          → inserta en `push_tokens`
          `` { id: uuidv7(), userId, expoToken: `ExponentPushToken[r4-${RUN_ID}]`, platform: 'android' } ``;
          `DELETE /v1/me` → `204`; luego
          `api().delete('/v1/me/push-tokens').set('Authorization', <mismo token>).send({ expoToken })`
          → `401` con `body` `toEqual({ statusCode: 401, message: 'Unauthorized' })`
          (la llamada del `signOut()` de #248: nunca `5xx`).
        - `describe('#247 R5: un body inválido es 400 y no borra', ...)` →
          `it.each` con 5 filas (sin body, `{}`, `{ password: '' }`,
          `{ password: 123 }`, `{ password: PASSWORD, extra: true }`),
          título `'#247 R5: %s responde 400 Validation failed y el usuario sigue'`:
          `400`, `body.statusCode` `400`, `body.message`
          `'Validation failed'`, 1 fila en `users`.
        - `describe('#247 R6: contraseña incorrecta es 403 y no borra nada', ...)` →
          `it('#247 R6: responde 403 Invalid password y no borra usuario, mascota ni audita')`
          → con una mascota creada por API: `403`, `body`
          `toEqual({ statusCode: 403, message: 'Invalid password', error: 'Forbidden' })`;
          siguen la fila de `users` y la de `pets`; 0 filas
          `user.delete` con `entityId` = su id.
        - `describe('#247 R8: las mascotas propias se borran para todos', ...)`:
          `it('#247 R8: la mascota de un dueño único deja de existir')` → 0
          filas en `pets` y en `pet_users` para su id.
          `it('#247 R8: la mascota compartida desaparece también para el miembro family')`
          → miembro con `seedMembership(petId, member.id, 'family')`;
          antes del borrado el miembro ve `200` en `GET /v1/pets/:id`;
          tras el `204` del owner: `GET /v1/pets` del miembro sin ese id,
          `GET /v1/pets/:id` → `404`, 0 filas en `pets`, el miembro
          sigue en `users`.
        - `describe('#247 R9: la membresía family en una mascota ajena se suelta', ...)` →
          `it('#247 R9: la mascota ajena sobrevive y created_by queda en NULL')`:
          A crea la mascota; B es `family`; se inserta
          `mealServings { id: uuidv7(), petId, servedOn: '2026-11-06', mealTime: '08:00', createdBy: B.id }`;
          B borra su cuenta → `204`; la mascota sigue (A ve `200`); 0
          filas de `pet_users` de B; la fila de `meal_servings` existe con
          `createdBy` `null`.
        - `describe('#247 R10: borrar la cuenta libera los collares de sus mascotas', ...)` →
          `it('#247 R10: el collar de la mascota borrada con la cuenta queda available')`.
        - `describe('#247 R12: el borrado de cuenta audita user.delete', ...)` →
          `it('#247 R12: deja una sola fila user.delete con user_id NULL, entity_id y meta.petIds')`
          → owner con 2 mascotas; tras el `204`: exactamente 1 fila con
          `action = 'user.delete'` y `entityId` = su id, `userId` `null`,
          `entity` `'user'`, `meta.petIds` ordenado `toEqual` los 2 ids
          ordenados; 0 filas `pet.delete` con `entityId` en esos ids.
        - `describe('#247 R13: borrar la cuenta purga S3 y DynamoDB de sus mascotas', ...)` →
          `it('#247 R13: borra pets/<petId>/ y PET#<petId> de cada mascota y no toca otra')`
          → 2 mascotas + `foreignPetId`, con `seedPetStores`; tras el
          `204`, las 2 a `{ 0, 0 }` y el ajeno a `{ 2, 30 }`.
        - `describe('#247 R14: un fallo de purga no tumba el 204 y queda en el log', ...)` →
          `it('#247 R14: S3 caído responde 204, borra en Postgres, purga DynamoDB y registra PET_PURGE_FAILED')`:
          owner con 1 mascota y `seedPetStores`;
          `const s3Send = jest.spyOn(app.get<{ send: (command: unknown) => Promise<unknown> }>(S3_CLIENT), 'send').mockRejectedValueOnce(new Error('s3 down 247'))`
          (el tipo explícito evita la sobrecarga `void` de `send`) y el
          espía de `Logger.prototype.error` de R15; restaurar ambos en
          `finally`. `204`; 0 filas en `users` y `pets`;
          `countPetStores` `toEqual({ s3Objects: 2, dynamoItems: 0 })`;
          exactamente un mensaje que empieza por
          `PET_PURGE_FAILED store=s3 petId=${petId} target=pets/${petId}/ reason=s3 down 247`
          y ninguno `store=dynamodb`.
        - `cleanPetStores` en `afterAll` de todo id sembrado.
- [ ] (2) Implementación mínima (commit 12) — D1 (DTO, decoradores y
      mapeo de errores en `deleteMe`), D5 (`deleteAccount`) y D8
      (`execute`).
- [ ] (3) Refactor con tests verdes — ninguno previsto.

## Cierre (commit 13)

- [ ] `specs/users-account-deletion-api/traceability.md`: cada fila con el
      test (`archivo::nombre`) y el hash + mensaje del commit verde.
- [ ] `progress/impl_users-account-deletion-api.md`: salidas de la base
      (regla 7), its nacidos verdes (regla 5) y salida de:
      - `pnpm -C backend-pet-tracker exec tsc --noEmit`
      - `pnpm -C backend-pet-tracker exec eslint "{src,test}/**/*.ts"`
      - `pnpm -C backend-pet-tracker exec prettier --check "src/**/*.ts" "test/**/*.ts"`
      - `pnpm -C backend-pet-tracker exec jest`
      - la e2e de la regla 6.

## Enmienda del leader (2026-11-06): candado previo de `devices.e2e` R15

`init.sh` del leader, sobre el commit 13, da un solo rojo:
`test/devices.e2e-spec.ts:988`, `expect(orphaned.status).toBe('assigned')`, que recibe
`"available"`. Es el comportamiento que pide R10. Ese `it` de #5 fijaba el collar
huérfano en `'assigned'` y esta spec no lo listó. No es una regresión: se actualiza el
candado.

Fichero: `backend-pet-tracker/test/devices.e2e-spec.ts`. El cambio va en
`describe('R15: borrar una mascota con collar deja el device reclamable (D3)')`, dentro de
`it('claim -> DELETE /v1/pets/:petId -> claim con otra mascota responde 201')`. Los nombres
del `describe` y del `it` no cambian.

- El comentario de dos líneas sobre el DELETE de #5 pasa a:
  ```
        // Desde #247 R10 el DELETE libera el collar antes de que pet_devices
        // caiga en cascada: devices.status queda 'available'.
  ```
- `const [orphaned] = await db` pasa a `const [released] = await db`.
- `expect(orphaned.status).toBe('assigned');` pasa a
  `expect(released.status).toBe('available');`.
- El resto del `it` (asignaciones en 0 tras el DELETE, el reclamo de `ownerB` y el
  `'assigned'` final) no se toca.

Anclas, desde `backend-pet-tracker/`:

| Orden | Antes | Después |
|---|---|---|
| `grep -cF "orphaned" test/devices.e2e-spec.ts` | `2` | `0` |
| `grep -cF "expect(released.status).toBe('available');" test/devices.e2e-spec.ts` | `0` | `1` |
| `grep -cF "queda 'assigned' huerfano" test/devices.e2e-spec.ts` | `1` | `0` |

Comprobación: §Esperas del handoff y después
`FORCE_COLOR=0 pnpm exec jest --config ./test/jest-e2e.json test/devices.e2e-spec.ts > /tmp/impl-247-devices-e2e.log 2>&1; echo "exit=$?"`,
que da `exit=0`. Antes del commit, la cadena prettier, eslint y tsc del handoff sobre ese
fichero.

- **Commit 14**: `test(devices): R15 e2e expects the collar released by #247 R10`.
- **Commit 15**: una sección «Enmienda del leader: devices.e2e R15» al final de
  `progress/impl_users-account-deletion-api.md`, con las anclas, el `exit=` y las líneas
  `Test Suites:` y `Tests:`. Mensaje:
  `docs(users-account-deletion-api): record the devices R15 amendment`.

Cuenta final: `git rev-list --count 0e70fff2..HEAD` da `16` (13, más esta enmienda, más
los commits 14 y 15).

## Enmienda del leader (2026-11-06, 2): candado D3 del claim

El `reviewer` rechazó la ronda anterior (`progress/review_users-account-deletion-api.md`,
H1). La enmienda 1 dejó el `it` de `devices.e2e` R15 con el caché en `'available'` tras el
DELETE, y ese era el único test que reclamaba un collar con `devices.status = 'assigned'`
sin fila activa en `pet_devices`. Sin él, un claim que vete `status === 'assigned'` no rompe
nada, y la regla D3 de `devices-claim` (R15) queda sin candado. Importa en producción: los
collares que quedaron huérfanos antes de #247 siguen en `'assigned'` y la migración 0024 no
los repara.

### Commit 16: reponer el estado huérfano en el `it`

Fichero: `backend-pet-tracker/test/devices.e2e-spec.ts`, mismo `describe` y mismo `it` que
la enmienda 1, con los nombres sin cambios. Dentro de ese `it`, justo después de
`expect(assignments).toHaveLength(0);` (la línea sale dos veces en el fichero: vale la
que está dentro de este `it`) y antes del comentario
`// La disponibilidad se deriva de la fila activa, no del cache de`, se inserta:

```ts

      // Los collares que quedaron huerfanos antes de #247 conservan el cache
      // en 'assigned' sin fila activa: se siembra ese estado a mano.
      await db
        .update(devices)
        .set({ status: 'assigned' })
        .where(eq(devices.id, device.id));
```

El resto del `it` no se toca: el `released.status` en `'available'` sigue fijando #247 R10,
y el reclamo `201` de `ownerB` pasa a fijar D3. El test nace verde. Su rojo se prueba con
la sonda de abajo.

Anclas, desde `backend-pet-tracker/`:

| Orden | Antes | Después |
|---|---|---|
| `grep -cF ".set({ status: 'assigned' })" test/devices.e2e-spec.ts` | `1` | `2` |
| `grep -cF "conservan el cache" test/devices.e2e-spec.ts` | `0` | `1` |
| `grep -cF "expect(released.status).toBe('available');" test/devices.e2e-spec.ts` | `1` | `1` |

Pasos, desde `backend-pet-tracker/`:

1. Aplicar el cambio y correr, según §Esperas del handoff,
   `FORCE_COLOR=0 pnpm exec jest --config ./test/jest-e2e.json test/devices.e2e-spec.ts > /tmp/impl-247-d3-verde.log 2>&1; echo "exit=$?"`.
   Debe dar `exit=0`.
2. Sonda de mutación. En
   `src/modules/devices/application/use-cases/claim-device.use-case.ts`, añadir la línea
   `      device.status === 'assigned' ||` justo debajo de
   `      device.status === 'inactive' ||`. Correr la misma orden con el log en
   `/tmp/impl-247-d3-sonda.log`. Debe dar `exit=1`. El log debe tener un solo `●`, en
   `R15: borrar una mascota con collar deja el device reclamable (D3) › claim -> DELETE /v1/pets/:petId -> claim con otra mascota responde 201`,
   por aserción: el claim responde un estado distinto de `201`. Si sale cualquier otro rojo,
   o `Test suite failed to run`, se para.
3. Revertir con
   `git checkout HEAD -- src/modules/devices/application/use-cases/claim-device.use-case.ts`.
   `git diff --quiet -- src; echo "src=$?"` debe dar `src=0`.
4. La cadena prettier, eslint y tsc del handoff sobre `test/devices.e2e-spec.ts`, y luego
   el commit.

- **Commit 16**: `test(devices): R15 e2e reclaims a collar whose cache still says assigned`.

### Commit 17: el mensaje de `UnprocessedItems` usa la constante (H3)

En `backend-pet-tracker/src/modules/pets/infrastructure/pet-data-purger.aws.adapter.ts`,
`throw new Error('UnprocessedItems after 3 attempts');` pasa a
``throw new Error(`UnprocessedItems after ${BATCH_WRITE_ATTEMPTS} attempts`);``. El texto
resultante no cambia. Es el mismo patrón que `src/workers/positions-consumer.service.ts`.

Anclas, desde `backend-pet-tracker/`:

| Orden | Antes | Después |
|---|---|---|
| `grep -cF "after 3 attempts" src/modules/pets/infrastructure/pet-data-purger.aws.adapter.ts` | `1` | `0` |
| `grep -cF 'after ${BATCH_WRITE_ATTEMPTS} attempts' src/modules/pets/infrastructure/pet-data-purger.aws.adapter.ts` | `0` | `1` |

Comprobación: `FORCE_COLOR=0 pnpm exec jest src/modules/pets > /tmp/impl-247-h3.log 2>&1; echo "exit=$?"`
da `exit=0`. Antes del commit, la cadena prettier, eslint y tsc del handoff sobre ese
fichero.

- **Commit 17**: `refactor(pets): build the UnprocessedItems message from BATCH_WRITE_ATTEMPTS`.

### Commit 18: registro

Una sección «Enmienda del leader 2: candado D3» al final de
`progress/impl_users-account-deletion-api.md`, con:

- las anclas de los commits 16 y 17;
- los tres `exit=` del commit 16 (verde, sonda y `src=`) y el del commit 17;
- las líneas `Test Suites:` y `Tests:` de cada log;
- la línea `●` de la sonda.

Mensaje: `docs(users-account-deletion-api): record the D3 lock amendment`.

Cuenta final: `git rev-list --count 0e70fff2..HEAD` da `20` (16, más esta enmienda, más
los commits 16, 17 y 18).

## Mutaciones para el reviewer

Cada una debe poner rojo al menos el test indicado:

| Mutación | Rojo esperado |
|---|---|
| Quitar el `null ⇒ 401` del guard | guard `#247 R2` (b); users e2e `#247 R2`, `#247 R4` (los dos) |
| Mapear el error de `deleteMe` con `mapProfileError` (`404`) | controller `#247 R7` |
| Quitar `{ onDelete: 'set null' }` de una de las 5 columnas del esquema TS | `#247 R1` (its de esquema y de FKs). La e2e no lo ve: su base sale de las migraciones SQL, no del esquema TS |
| Meter `findById` dentro del `try/catch` de `verify` | guard `#247 R2` (e) |
| Mapear `InvalidCredentialsError` a `UnauthorizedException` | controller y e2e `#247 R6` |
| Quitar `eq(petUsers.role, 'owner')` | e2e `#247 R9` |
| Borrar `pets` antes de liberar collares en `deletePetsTx` | e2e `#247 R10` (los dos) |
| Insertar la auditoría después del `DELETE users` | repo `#247 R11` |
| Quitar `.for('update')` | repo `#247 R11` |
| Purgar antes del `delete` en `DeletePetUseCase` | E7 |
| Quitar el `try/catch` por almacén del adapter | `#247 R15` (f), (g); e2e `#247 R14` |
| `BATCH_WRITE_MAX_ITEMS = 26` | `#247 R15` (d) |
| `BATCH_WRITE_ATTEMPTS = 2` | `#247 R15` (e) |
| `Quiet: false` | `#247 R15` (b) |
| Vetar en el claim `device.status === 'assigned'` (`claim-device.use-case.ts`) | devices e2e `R15: borrar una mascota con collar deja el device reclamable (D3)` |

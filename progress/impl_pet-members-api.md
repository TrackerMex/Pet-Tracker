# Implementación pet-members-api (#211)

Estado: **BLOQUEADO en el commit 16; implementación incompleta**. H0: `f1d0f320`. Sin init.sh, push, PR, merge ni rebase.

## Prevuelo

Comprobación literal de ruta/rama:
```text
/home/claude/sites/Pet-Tracker-wt-211
feature/211-pet-members-api
```
Desviación de orden: primero se leyó el handoff junto con la skill y git status; después se ejecutó el comando literal de ruta/rama. Sin cambios de código previos.

Anclas antes del primer commit:
```text
grep -cF "export type PetRole = 'owner' | 'family' | 'walker' | 'vet';" backend-pet-tracker/src/modules/pets/domain/entities/pet-membership.ts   # A1 -> 1
1
grep -cF "'pet_users_role_check'," backend-pet-tracker/src/db/schema/pets.schema.ts   # A2 -> 1
1
grep -cF "exports: [PET_REPOSITORY, PetAccessGuard]" backend-pet-tracker/src/modules/pets/pets.module.ts   # A3 -> 1
1
grep -cF "findMembership(petId: string, userId: string): Promise<PetMembership | null>;" backend-pet-tracker/src/modules/pets/domain/repositories/pet.repository.ts   # A4 -> 1
1
grep -cF "export interface PetAccessRequest" backend-pet-tracker/src/modules/pets/infrastructure/guards/pet-access.guard.ts   # A5 -> 1
1
grep -cF "throw new NotFoundException();" backend-pet-tracker/src/modules/pets/infrastructure/guards/pet-access.guard.ts   # A6 -> 2
2
grep -cF "throw new ForbiddenException();" backend-pet-tracker/src/modules/pets/infrastructure/guards/pet-access.guard.ts   # A7 -> 1
1
grep -cF "[context.getHandler(), context.getClass()]" backend-pet-tracker/src/modules/pets/infrastructure/guards/pet-access.guard.ts   # A8 -> 1
1
grep -cF "export const AUDIT_LOGGER = Symbol('AuditLogger');" backend-pet-tracker/src/audit/audit-log.repository.ts   # A9 -> 1
1
grep -cF "@Global()" backend-pet-tracker/src/audit/audit.module.ts   # A10 -> 1
1
grep -cF "@Post('claim')" backend-pet-tracker/src/modules/devices/infrastructure/devices.controller.ts   # A11 -> 1
1
grep -cF "export const EMAIL_RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;" backend-pet-tracker/src/modules/auth/infrastructure/guards/email-rate-limit.guard.ts   # A12 -> 1
1
grep -cF "if (current.count >= maximum) {" backend-pet-tracker/src/modules/auth/infrastructure/guards/email-rate-limit.guard.ts   # A13 -> 1
1
grep -cF "async findActiveMembersTokens(petId: string): Promise<string[]> {" backend-pet-tracker/src/modules/users/infrastructure/repositories/push-token.drizzle.repository.ts   # A14 -> 1
1
grep -cF "R8: INNER JOIN con" backend-pet-tracker/src/modules/users/infrastructure/repositories/push-token.drizzle.repository.ts   # A15 -> 1
1
grep -cF "export const PUSH_TOKEN_REPOSITORY" backend-pet-tracker/src/modules/users/domain/repositories/push-token.repository.ts   # A16 -> 1
1
grep -cF "exports: [PUSH_TOKEN_REPOSITORY]," backend-pet-tracker/src/modules/users/users.module.ts   # A17 -> 1
1
grep -cF "this.pushTokens.findActiveMembersTokens(petId)" backend-pet-tracker/src/workers/notifier/notifier-consumer.service.ts   # A18 -> 1
1
grep -cF "@Post('push-tokens')" backend-pet-tracker/src/modules/users/infrastructure/users.controller.ts   # A19 -> 1
1
grep -cF "this.subscriptions.isPetTracked(petId)" backend-pet-tracker/src/modules/subscriptions/infrastructure/guards/pet-tracking.guard.ts   # A20 -> 1
1
grep -cF "eq(petUsers.status, ACTIVE_STATUS)" backend-pet-tracker/src/modules/alerts/infrastructure/repositories/alert.drizzle.repository.ts   # A21 -> 2
2
grep -cF "myRole: PetRole;" backend-pet-tracker/src/modules/pets/infrastructure/mappers/pet-profile-response.mapper.ts   # A22 -> 1
1
grep -cF "@RequirePetRole('owner')" backend-pet-tracker/src/modules/pets/infrastructure/pets.controller.ts   # A23 -> 3
3
grep -cF "export * from './password-reset-tokens.schema';" backend-pet-tracker/src/db/schema/index.ts   # A24 -> 1
1
grep -cF "export * from './pets.schema';" backend-pet-tracker/src/db/schema/index.ts   # A25 -> 1
1
grep -c '"tag"' backend-pet-tracker/src/db/migrations/meta/_journal.json   # A26 -> 20
20
ls backend-pet-tracker/src/db/migrations | grep -c '^0020_'   # A27 -> 0
0
grep -rlF "pet_invites" backend-pet-tracker/src backend-pet-tracker/test | wc -l   # A28 -> 0
0
grep -rliF "invite" backend-pet-tracker/src backend-pet-tracker/test | wc -l   # A29 -> 0
0
grep -rn "randomInt" backend-pet-tracker/src | wc -l   # A30 -> 0
0
grep -cF "throttler" backend-pet-tracker/package.json   # A31 -> 0
0
grep -cF "PetsModule," backend-pet-tracker/src/app.module.ts   # A32 -> 1
1
grep -cF "async function seedUser(label: string, timezone = 'UTC'): Promise<TestUser> {" backend-pet-tracker/test/pets.e2e-spec.ts   # A33 -> 1
1
grep -cF "app.setGlobalPrefix('v1');" backend-pet-tracker/src/main.ts   # A34 -> 1
1
parseBody: 12
```

## Registro

### Commit 1

`33d4b890 test(db): pet_invites table and its migration (R1)`

```text
FAIL src/db/schema/pet-invites.schema.spec.ts
  ● #211 R1: pet_invites › #211 R1: pet_invites tiene exactamente las 10 columnas declaradas

    expect(received).toEqual(expected) // deep equality

    - Expected  - 9
    + Received  + 0

      Array [
    -   "accepted_at",
    -   "accepted_by",
    -   "code_hash",
    -   "created_at",
    -   "created_by",
    -   "expires_at",
        "id",
    -   "pet_id",
    -   "revoked_at",
    -   "role",
      ]

      12 |         .columns.map((column) => column.name)
      13 |         .sort(),
    > 14 |     ).toEqual([
         |       ^
      15 |       'accepted_at',
      16 |       'accepted_by',
      17 |       'code_hash',

      at Object.<anonymous> (db/schema/pet-invites.schema.spec.ts:14:7)

  ● #211 R1: pet_invites › #211 R1: code_hash es char(64) NOT NULL único y role tiene su CHECK

    expect(received).toBeDefined()

    Received: undefined

      31 |       (candidate) => candidate.name === 'code_hash',
      32 |     );
    > 33 |     expect(column).toBeDefined();
         |                    ^
      34 |     expect(column?.getSQLType()).toBe('char(64)');
      35 |     expect(column?.notNull).toBe(true);
      36 |     expect(column?.isUnique).toBe(true);

      at Object.<anonymous> (db/schema/pet-invites.schema.spec.ts:33:20)

  ● #211 R1: pet_invites › #211 R1: la migración generada crea tabla, unique, check, FKs e índices

    expect(received).toHaveLength(expected)

    Expected length: 1
    Received length: 0
    Received array:  []

      44 |       /^\d{4}_pet_invites\.sql$/.test(name),
      45 |     );
    > 46 |     expect(files).toHaveLength(1);
         |                   ^
      47 |     const sql = readFileSync(join(migrationsDir, files[0]), 'utf8');
      48 |     for (const literal of [
      49 |       'CREATE TABLE "pet_invites"',

      at Object.<anonymous> (db/schema/pet-invites.schema.spec.ts:46:19)

Test Suites: 1 failed, 1 total
Tests:       3 failed, 3 total
Snapshots:   0 total
Time:        0.745 s
Ran all test suites matching src/modules/pet-members|src/db/schema/pet-invites.schema.spec.ts.
```

Lectura de referencia: `src/db/migrate.ts` no existe (ENOENT); db:migrate usa drizzle-kit migrate, no fue necesario ese fichero.

### Commit 2

`769f46df feat(db): pet_invites table with generated migration (R1)`

`Tests: 3 passed, 3 total`. prettier/eslint/tsc exit 0. Migración generada sin editar; no se reformatean los artefactos generados. SQL: CREATE pet_invites (10 columnas), UNIQUE code_hash, CHECK family, 3 FK (cascade/cascade/set null) y 3 índices. db:migrate exit 0.

Lectura adicional con ENOENT: upsert-push-token.dto.ts; se localizó register-push-token.dto.ts con rg.

Database journal: **21 filas**.

### Commit 3

`ce507984 test(pet-members): invite code format, normalization and hash (R2)`

Tests: 13 failed, 3 passed, 16 total. Los 13 its nuevos fallan por expect (regex, normalización/null y hash), R1 sigue verde; prettier/eslint/tsc exit 0. Log: 211-03.log.

### Commit 4

`2807d2e3 feat(pet-members): invite code (R2)`

Tests: 16 passed, 16 total. prettier/eslint/tsc exit 0.

### Commit 5

`4e53c084 test(pet-members): authorization on the 6 routes (R16,R17,R18)`

Tests: 24 failed, 24 total. Todos por aserción: R16 toEqual(E-404), R17 toBe(403), R18 toBe(401), frente a rutas inexistentes. prettier/eslint/tsc exit 0, pgrep init.sh vacío. Log: 211-05.log.

Commit 6: prettier/eslint/tsc exit 0. Primera tentativa E2E aplazada: pgrep detectó init.sh (PID 231942); Jest no se ejecutó. Se espera según el handoff.

### Commit 6

`28f41e63 feat(pet-members): module, routes and guards (R16,R17,R18)`

Tests: 24 passed, 24 total. Guarda vacía antes de Jest. La detección anterior era el propio shell: su texto incluía el nombre del harness en el reporte; se corrigió la invocación aislando la guarda de ese texto (pgrep -af mostró el shell propio, PID 232659). Sin procesos concurrentes detectados en la corrida efectiva.

### Commit 7

`0dd15da6 test(pet-members): create invite (R3)`

Unit Tests: 1 failed, 16 passed, 17 total (await expect(result).resolves.toEqual); E2E Tests: 1 failed, 24 passed, 25 total (.expect(201): 500). Solo R3 rojo. prettier/eslint/tsc exit 0; guarda vacía.

### Commit 8

`99aa8f30 feat(pet-members): create invite (R3)`

Unit Tests: 17 passed, 17 total. E2E Tests: 25 passed, 25 total. prettier/eslint/tsc exit 0; guarda vacía.

### Commit 9

`341cb1c2 test(pet-members): invite and member limits (R4)`

Tests: 5 failed, 25 passed, 30 total. R4: expect(response.status)/expect(before.status).toBe(409), recibido 201. prettier/eslint/tsc exit 0; guarda vacía.

### Commit 10

`83df0dd2 feat(pet-members): per-pet limits (R4)`

Unit Tests: 17 passed, 17 total. E2E Tests: 30 passed, 30 total. prettier/eslint/tsc exit 0; guarda vacía.

### Commit 11

`d005debf test(pet-members): list pending invites (R5)`

Tests: 1 failed, 30 passed, 31 total. R5 .expect(200) recibe 500. prettier/eslint/tsc exit 0; guarda vacía.

### Commit 12

`37f1821c feat(pet-members): list pending invites (R5)`

Tests: 31 passed, 31 total. prettier/eslint/tsc exit 0; guarda vacía.

### Commit 13

`214a96dc test(pet-members): revoke invite (R6)`

Tests: 7 failed, 31 passed, 38 total. R6 .expect(204) y expect(response.status).toBe(404) reciben 500. prettier/eslint/tsc exit 0; guarda vacía.

### Commit 14

`7d3229d5 feat(pet-members): revoke invite (R6)`

Tests: 38 passed, 38 total. prettier/eslint/tsc exit 0; guarda vacía.

R20, antes del commit 15: el test nuevo supuso 201 al registrar push; UsersController fija 200. Se corrigió esa aserción nueva al contrato existente (la spec no fija status para el registro push), sin modificar código existente. Se repite el rojo para observarlo en accept, como exige R20.

### Commit 15

`62b8e563 test(pet-members): accept invite (R7,R8,R9,R20)`

Unit Tests: 1 failed, 17 passed, 18 total (rejects.toBeInstanceOf(InviteNotAcceptableError), recibido Error). E2E Tests: 15 failed, 38 passed, 53 total. R7/R20 expect(201), R8 toBe(404)/toBe(400), R9 toBe(409) reciben 500. R20 falla en accept, tras registro push correcto. prettier/eslint/tsc exit 0; guarda vacía.

## Parada en el commit 16

El commit 16 no se ha creado. Tras `prettier --write`, `prettier --check` devuelve **1** en `src/modules/pet-members/infrastructure/repositories/pet-member.drizzle.repository.ts`. Una segunda salida de Prettier, obtenida sin escribir el código, muestra que pide compactar la cadena `await tx.insert(petUsers).values({...})`: el primer formateo dejó el receptor en tres líneas y el segundo lo quiere en una. No se aplica ese segundo formateo ni se continúa la cadena por la condición del handoff «Solo PARA si falla el código, una cifra de esta lista o una guarda» y AGENTS §8 («Si la herramienta no hace lo que esperas: documenta el bloqueo [...] y para la sesión»).

La cadena cortocircuitó antes de eslint, tsc y Jest unitario del commit 16. Por error de orquestación, el comando E2E situado en la siguiente sentencia sí se ejecutó después: guarda vacía, exit **0**, `Tests: 53 passed, 53 total`. Esto no valida el commit 16, que permanece sin commit, con sus cuatro ficheros modificados para inspección. No se cambia la spec ni se marca la feature como done.

No se han ejecutado la suite unitaria completa, el lint/typecheck de cierre, el E2E completo ni graphify; no se ha llegado a los commits 17–28. `init.sh`, push, PR, merge y rebase no se han ejecutado. No se ha leído el contenido de `.env`, añadido dependencias ni modificado los ficheros excluidos.

No hay commits refactor opcionales. Ningún it nació verde en los commits rojos observados: R20 se corrigió antes del commit para fallar en accept como se exige; R21 todavía no se ha escrito. Los commits 25 y 26 y su mutación R19 **no se han realizado**.

## Reanudación 1

El leader autoriza continuar desde el commit 16 con los cuatro ficheros modificados. Diagnóstico: Prettier 3.9.6 no es idempotente en la primera pasada; se permite repetir write/check hasta tres pasadas por commit. No se ejecuta el harness. El marcador fue borrado por el leader y se recreará solo al completar los 28 commits. Se conserva arriba la evidencia histórica de la parada.


## Commits creados

| Paso | Hash y mensaje | Tests medidos antes del commit |
|---|---|---|
| 1 | `33d4b890 test(db): pet_invites table and its migration (R1)` | Tests:       3 failed, 3 total |
| 2 | `769f46df feat(db): pet_invites table with generated migration (R1)` | Tests:       3 passed, 3 total |
| 3 | `ce507984 test(pet-members): invite code format, normalization and hash (R2)` | Tests:       13 failed, 3 passed, 16 total |
| 4 | `2807d2e3 feat(pet-members): invite code (R2)` | Tests:       16 passed, 16 total |
| 5 | `4e53c084 test(pet-members): authorization on the 6 routes (R16,R17,R18)` | Tests:       24 failed, 24 total |
| 6 | `28f41e63 feat(pet-members): module, routes and guards (R16,R17,R18)` | Tests:       24 passed, 24 total |
| 7 | `0dd15da6 test(pet-members): create invite (R3)` | Tests:       1 failed, 16 passed, 17 total; Tests:       1 failed, 24 passed, 25 total |
| 8 | `99aa8f30 feat(pet-members): create invite (R3)` | Tests:       17 passed, 17 total; Tests:       25 passed, 25 total |
| 9 | `341cb1c2 test(pet-members): invite and member limits (R4)` | Tests:       5 failed, 25 passed, 30 total |
| 10 | `83df0dd2 feat(pet-members): per-pet limits (R4)` | Tests:       17 passed, 17 total; Tests:       30 passed, 30 total |
| 11 | `d005debf test(pet-members): list pending invites (R5)` | Tests:       1 failed, 30 passed, 31 total |
| 12 | `37f1821c feat(pet-members): list pending invites (R5)` | Tests:       31 passed, 31 total |
| 13 | `214a96dc test(pet-members): revoke invite (R6)` | Tests:       7 failed, 31 passed, 38 total |
| 14 | `7d3229d5 feat(pet-members): revoke invite (R6)` | Tests:       38 passed, 38 total |
| 15 | `62b8e563 test(pet-members): accept invite (R7,R8,R9,R20)` | Tests:       1 failed, 17 passed, 18 total; Tests:       15 failed, 38 passed, 53 total |

## Rojos observados por aserción

| Commit | Test | Rojo observado (línea de expect) |
|---|---|---|
| 1 | #211 R1: pet_invites › #211 R1: pet_invites tiene exactamente las 10 columnas declaradas | > 14 \|     ).toEqual([ |
| 1 | #211 R1: pet_invites › #211 R1: code_hash es char(64) NOT NULL único y role tiene su CHECK | > 33 \|     expect(column).toBeDefined(); / Received: undefined |
| 1 | #211 R1: pet_invites › #211 R1: la migración generada crea tabla, unique, check, FKs e índices | > 46 \|     expect(files).toHaveLength(1); |
| 3 | #211 R2: código de invitación › #211 R2: generateInviteCode da 10 caracteres del alfabeto de 30 | > 12 \|       expect(code).toMatch(/^[23456789ABCDEFGHJKMNPQRSTVWXYZ]{10}$/); |
| 3 | #211 R2: código de invitación › #211 R2: normalizeInviteCode acepta minúsculas, espacios y guiones | > 18 \|     expect(normalizeInviteCode(' abcde-fghjk ')).toBe('ABCDEFGHJK'); / Expected: "ABCDEFGHJK" / Received: " abcde-fghjk " |
| 3 | #211 R2: código de invitación › #211 R2: normalizeInviteCode devuelve null para | > 33 \|     expect(normalizeInviteCode(input)).toBeNull(); / Received: "" |
| 3 | #211 R2: código de invitación › #211 R2: normalizeInviteCode devuelve null para ABCDEFGHJ | > 33 \|     expect(normalizeInviteCode(input)).toBeNull(); / Received: "ABCDEFGHJ" |
| 3 | #211 R2: código de invitación › #211 R2: normalizeInviteCode devuelve null para ABCDEFGHJKM | > 33 \|     expect(normalizeInviteCode(input)).toBeNull(); / Received: "ABCDEFGHJKM" |
| 3 | #211 R2: código de invitación › #211 R2: normalizeInviteCode devuelve null para ABCDEFGHJ0 | > 33 \|     expect(normalizeInviteCode(input)).toBeNull(); / Received: "ABCDEFGHJ0" |
| 3 | #211 R2: código de invitación › #211 R2: normalizeInviteCode devuelve null para ABCDEFGHJ1 | > 33 \|     expect(normalizeInviteCode(input)).toBeNull(); / Received: "ABCDEFGHJ1" |
| 3 | #211 R2: código de invitación › #211 R2: normalizeInviteCode devuelve null para ABCDEFGHJO | > 33 \|     expect(normalizeInviteCode(input)).toBeNull(); / Received: "ABCDEFGHJO" |
| 3 | #211 R2: código de invitación › #211 R2: normalizeInviteCode devuelve null para ABCDEFGHJI | > 33 \|     expect(normalizeInviteCode(input)).toBeNull(); / Received: "ABCDEFGHJI" |
| 3 | #211 R2: código de invitación › #211 R2: normalizeInviteCode devuelve null para ABCDEFGHJL | > 33 \|     expect(normalizeInviteCode(input)).toBeNull(); / Received: "ABCDEFGHJL" |
| 3 | #211 R2: código de invitación › #211 R2: normalizeInviteCode devuelve null para ABCDEFGHJU | > 33 \|     expect(normalizeInviteCode(input)).toBeNull(); / Received: "ABCDEFGHJU" |
| 3 | #211 R2: código de invitación › #211 R2: normalizeInviteCode devuelve null para ABCDEFGHJ! | > 33 \|     expect(normalizeInviteCode(input)).toBeNull(); / Received: "ABCDEFGHJ!" |
| 3 | #211 R2: código de invitación › #211 R2: hashInviteCode es SHA-256 hex | > 36 \|     expect(hashInviteCode('ABCDEFGHJK')).toBe( / Expected: "f57cbf1e3e471b25db4b8ad0844df41b2dae9c7d1944944d128e49294d412f66" / Received: "" |
| 5 | #211 R16: pet members API › #211 R16: un no miembro recibe 404 en post /v1/pets/:petId/invites | > 146 \|       expect(response.body).toEqual({ statusCode: 404, message: 'Not Found' }); |
| 5 | #211 R16: pet members API › #211 R16: un no miembro recibe 404 en get /v1/pets/:petId/invites | > 146 \|       expect(response.body).toEqual({ statusCode: 404, message: 'Not Found' }); |
| 5 | #211 R16: pet members API › #211 R16: un no miembro recibe 404 en delete /v1/pets/:petId/invites/:inviteId | > 146 \|       expect(response.body).toEqual({ statusCode: 404, message: 'Not Found' }); |
| 5 | #211 R16: pet members API › #211 R16: un no miembro recibe 404 en get /v1/pets/:petId/members | > 146 \|       expect(response.body).toEqual({ statusCode: 404, message: 'Not Found' }); |
| 5 | #211 R16: pet members API › #211 R16: un no miembro recibe 404 en delete /v1/pets/:petId/members/:userId | > 146 \|       expect(response.body).toEqual({ statusCode: 404, message: 'Not Found' }); |
| 5 | #211 R16: pet members API › #211 R16: un petId inexistente da el mismo 404 en post /v1/pets/:petId/invites | > 157 \|       expect(response.body).toEqual({ statusCode: 404, message: 'Not Found' }); |
| 5 | #211 R16: pet members API › #211 R16: un petId inexistente da el mismo 404 en get /v1/pets/:petId/invites | > 157 \|       expect(response.body).toEqual({ statusCode: 404, message: 'Not Found' }); |
| 5 | #211 R16: pet members API › #211 R16: un petId inexistente da el mismo 404 en delete /v1/pets/:petId/invites/:inviteId | > 157 \|       expect(response.body).toEqual({ statusCode: 404, message: 'Not Found' }); |
| 5 | #211 R16: pet members API › #211 R16: un petId inexistente da el mismo 404 en get /v1/pets/:petId/members | > 157 \|       expect(response.body).toEqual({ statusCode: 404, message: 'Not Found' }); |
| 5 | #211 R16: pet members API › #211 R16: un petId inexistente da el mismo 404 en delete /v1/pets/:petId/members/:userId | > 157 \|       expect(response.body).toEqual({ statusCode: 404, message: 'Not Found' }); |
| 5 | #211 R16: pet members API › #211 R16: un petId que no es UUID da el mismo 404 en post /v1/pets/:petId/invites | > 168 \|       expect(response.body).toEqual({ statusCode: 404, message: 'Not Found' }); |
| 5 | #211 R16: pet members API › #211 R16: un petId que no es UUID da el mismo 404 en get /v1/pets/:petId/invites | > 168 \|       expect(response.body).toEqual({ statusCode: 404, message: 'Not Found' }); |
| 5 | #211 R16: pet members API › #211 R16: un petId que no es UUID da el mismo 404 en delete /v1/pets/:petId/invites/:inviteId | > 168 \|       expect(response.body).toEqual({ statusCode: 404, message: 'Not Found' }); |
| 5 | #211 R16: pet members API › #211 R16: un petId que no es UUID da el mismo 404 en get /v1/pets/:petId/members | > 168 \|       expect(response.body).toEqual({ statusCode: 404, message: 'Not Found' }); |
| 5 | #211 R16: pet members API › #211 R16: un petId que no es UUID da el mismo 404 en delete /v1/pets/:petId/members/:userId | > 168 \|       expect(response.body).toEqual({ statusCode: 404, message: 'Not Found' }); |
| 5 | #211 R16: pet members API › #211 R17: un family recibe 403 en post /v1/pets/:petId/invites | > 180 \|       expect(response.status).toBe(403); / Expected: 403 / Received: 404 |
| 5 | #211 R16: pet members API › #211 R17: un family recibe 403 en get /v1/pets/:petId/invites | > 180 \|       expect(response.status).toBe(403); / Expected: 403 / Received: 404 |
| 5 | #211 R16: pet members API › #211 R17: un family recibe 403 en delete /v1/pets/:petId/invites/:inviteId | > 180 \|       expect(response.status).toBe(403); / Expected: 403 / Received: 404 |
| 5 | #211 R16: pet members API › #211 R18: sin token responde 401 en post /v1/pets/:petId/invites | > 191 \|       expect(response.status).toBe(401); / Expected: 401 / Received: 404 |
| 5 | #211 R16: pet members API › #211 R18: sin token responde 401 en get /v1/pets/:petId/invites | > 191 \|       expect(response.status).toBe(401); / Expected: 401 / Received: 404 |
| 5 | #211 R16: pet members API › #211 R18: sin token responde 401 en delete /v1/pets/:petId/invites/:inviteId | > 191 \|       expect(response.status).toBe(401); / Expected: 401 / Received: 404 |
| 5 | #211 R16: pet members API › #211 R18: sin token responde 401 en get /v1/pets/:petId/members | > 191 \|       expect(response.status).toBe(401); / Expected: 401 / Received: 404 |
| 5 | #211 R16: pet members API › #211 R18: sin token responde 401 en delete /v1/pets/:petId/members/:userId | > 191 \|       expect(response.status).toBe(401); / Expected: 401 / Received: 404 |
| 5 | #211 R16: pet members API › #211 R18: sin token responde 401 en post /v1/invites/accept | > 191 \|       expect(response.status).toBe(401); / Expected: 401 / Received: 404 |
| 7 | #211 R3: crear invitación › #211 R3: expiresAt es now + 72 h | > 35 \|     await expect(result).resolves.toEqual({ / Rejected to value: [Error: Not implemented] |
| 7 | #211 R16: pet members API › #211 R3: crea la invitación, devuelve el código una vez y guarda solo su hash | > 210 \|       .expect(201); / expected 201 "Created", got 500 "Internal Server Error" |
| 9 | #211 R16: pet members API › #211 R4: la sexta pendiente responde PET_INVITES_LIMIT y no crea fila | > 265 \|     expect(response.status).toBe(409); / Expected: 409 / Received: 201 |
| 9 | #211 R16: pet members API › #211 R4: una invitación revocada libera su plaza | > 275 \|     expect(before.status).toBe(409); / Expected: 409 / Received: 201 |
| 9 | #211 R16: pet members API › #211 R4: una invitación expirada libera su plaza | > 287 \|     expect(before.status).toBe(409); / Expected: 409 / Received: 201 |
| 9 | #211 R16: pet members API › #211 R4: con 9 miembros activos se crea una y la siguiente responde PET_MEMBERS_LIMIT | > 303 \|     expect(response.status).toBe(409); / Expected: 409 / Received: 201 |
| 9 | #211 R16: pet members API › #211 R4: con ambos límites alcanzados gana PET_INVITES_LIMIT | > 317 \|     expect(response.status).toBe(409); / Expected: 409 / Received: 201 |
| 11 | #211 R16: pet members API › #211 R5: lista solo las pendientes, de la más nueva a la más vieja, sin código | > 342 \|       .expect(200); / expected 200 "OK", got 500 "Internal Server Error" |
| 13 | #211 R16: pet members API › #211 R6: revocar responde 204 y fija revoked_at | > 366 \|       .expect(204); / expected 204 "No Content", got 500 "Internal Server Error" |
| 13 | #211 R16: pet members API › #211 R6: responde el mismo 404 si la invitación no es UUID | > 416 \|     expect(response.status).toBe(404); / Expected: 404 / Received: 500 |
| 13 | #211 R16: pet members API › #211 R6: responde el mismo 404 si la invitación no existe | > 416 \|     expect(response.status).toBe(404); / Expected: 404 / Received: 500 |
| 13 | #211 R16: pet members API › #211 R6: responde el mismo 404 si la invitación es de otra mascota | > 416 \|     expect(response.status).toBe(404); / Expected: 404 / Received: 500 |
| 13 | #211 R16: pet members API › #211 R6: responde el mismo 404 si la invitación está aceptada | > 416 \|     expect(response.status).toBe(404); / Expected: 404 / Received: 500 |
| 13 | #211 R16: pet members API › #211 R6: responde el mismo 404 si la invitación está revocada | > 416 \|     expect(response.status).toBe(404); / Expected: 404 / Received: 500 |
| 13 | #211 R16: pet members API › #211 R6: responde el mismo 404 si la invitación está expirada | > 416 \|     expect(response.status).toBe(404); / Expected: 404 / Received: 500 |
| 15 | #211 R8: aceptar invitación › #211 R8: un código que no normaliza no consulta el repositorio | > 19 \|     ).rejects.toBeInstanceOf(InviteNotAcceptableError); / Expected constructor: InviteNotAcceptableError / Received constructor: Error |
| 15 | #211 R16: pet members API › #211 R7: aceptar crea la membresía family activa y responde { petId, role } | > 444 \|     const response = await accept(accepter, invite.code).expect(201); / expected 201 "Created", got 500 "Internal Server Error" |
| 15 | #211 R16: pet members API › #211 R7: la invitación aceptada guarda accepted_by y accepted_at | > 453 \|     await accept(accepter, invite.code).expect(201); / expected 201 "Created", got 500 "Internal Server Error" |
| 15 | #211 R16: pet members API › #211 R7: acepta el código en minúsculas y con guion | > 467 \|     ).expect(201); / expected 201 "Created", got 500 "Internal Server Error" |
| 15 | #211 R16: pet members API › #211 R8: responde el mismo 404 si el código no existe | > 503 \|     expect(response.status).toBe(404); / Expected: 404 / Received: 500 |
| 15 | #211 R16: pet members API › #211 R8: responde el mismo 404 si el código no normaliza | > 503 \|     expect(response.status).toBe(404); / Expected: 404 / Received: 500 |
| 15 | #211 R16: pet members API › #211 R8: responde el mismo 404 si el código está expirado | > 503 \|     expect(response.status).toBe(404); / Expected: 404 / Received: 500 |
| 15 | #211 R16: pet members API › #211 R8: responde el mismo 404 si el código está revocado | > 503 \|     expect(response.status).toBe(404); / Expected: 404 / Received: 500 |
| 15 | #211 R16: pet members API › #211 R8: responde el mismo 404 si el código ya se usó | > 503 \|     expect(response.status).toBe(404); / Expected: 404 / Received: 500 |
| 15 | #211 R16: pet members API › #211 R8: responde 400 con el cuerpo {} | > 519 \|       expect(response.status).toBe(400); / Expected: 400 / Received: 500 |
| 15 | #211 R16: pet members API › #211 R8: responde 400 con el cuerpo {"code":123} | > 519 \|       expect(response.status).toBe(400); / Expected: 400 / Received: 500 |
| 15 | #211 R16: pet members API › #211 R8: responde 400 con el cuerpo {"code":"   "} | > 519 \|       expect(response.status).toBe(400); / Expected: 400 / Received: 500 |
| 15 | #211 R16: pet members API › #211 R8: responde 400 con el cuerpo {"code":"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"} | > 519 \|       expect(response.status).toBe(400); / Expected: 400 / Received: 500 |
| 15 | #211 R16: pet members API › #211 R9: el owner que acepta su propio código recibe 409 y la invitación sigue pendiente | > 537 \|     expect(response.status).toBe(409); / Expected: 409 / Received: 500 |
| 15 | #211 R16: pet members API › #211 R9: un family que acepta otro código de la misma mascota recibe 409 y conserva su rol | > 552 \|     expect(response.status).toBe(409); / Expected: 409 / Received: 500 |
| 15 | #211 R16: pet members API › #211 R20: el nuevo family lista la mascota, la lee, no la edita y recibe push | > 571 \|     await accept(accepter, invite.code).expect(201); / expected 201 "Created", got 500 "Internal Server Error" |

## Requisitos y estado parcial

| R | Test | Rojo | Verde |
|---|---|---|---|
| R1 | `src/db/schema/pet-invites.schema.spec.ts` | 33d4b890 | 769f46df |
| R2 | `src/modules/pet-members/application/invite-code.spec.ts` | ce507984 | 2807d2e3 |
| R3 | `test/pet-members.e2e-spec.ts`, `src/modules/pet-members/application/use-cases/create-pet-invite.use-case.spec.ts` | 0dd15da6 | 99aa8f30 |
| R4 | `test/pet-members.e2e-spec.ts` | 341cb1c2 | 83df0dd2 |
| R5 | `test/pet-members.e2e-spec.ts` | d005debf | 37f1821c |
| R6 | `test/pet-members.e2e-spec.ts` | 214a96dc | 7d3229d5 |
| R7 | `test/pet-members.e2e-spec.ts` | 62b8e563 | Sin commit; E2E verde, controles incompletos |
| R8 | `test/pet-members.e2e-spec.ts`, `src/modules/pet-members/application/use-cases/accept-pet-invite.use-case.spec.ts` | 62b8e563 | Sin commit; E2E verde, controles incompletos |
| R9 | `test/pet-members.e2e-spec.ts` | 62b8e563 | Sin commit; E2E verde, controles incompletos |
| R10 | No escrito | No realizado | No realizado |
| R11 | No escrito | No realizado | No realizado |
| R12 | No escrito | No realizado | No realizado |
| R13 | No escrito | No realizado | No realizado |
| R14 | No escrito | No realizado | No realizado |
| R15 | No escrito | No realizado | No realizado |
| R16 | `test/pet-members.e2e-spec.ts` | 4e53c084 | 28f41e63 |
| R17 | `test/pet-members.e2e-spec.ts` | 4e53c084 | 28f41e63 |
| R18 | `test/pet-members.e2e-spec.ts` | 4e53c084 | 28f41e63 |
| R19 | No escrito | No realizado | No realizado |
| R20 | `test/pet-members.e2e-spec.ts` | 62b8e563 | Sin commit; E2E verde, controles incompletos |
| R21 | No escrito | No realizado | No realizado |

## Ficheros y estado al detenerse

Cambios desde H0 (incluye los cuatro ficheros del commit 16 sin commit):
```text
backend-pet-tracker/src/app.module.ts
backend-pet-tracker/src/db/migrations/0020_pet_invites.sql
backend-pet-tracker/src/db/migrations/meta/0020_snapshot.json
backend-pet-tracker/src/db/migrations/meta/_journal.json
backend-pet-tracker/src/db/schema/index.ts
backend-pet-tracker/src/db/schema/pet-invites.schema.spec.ts
backend-pet-tracker/src/db/schema/pet-invites.schema.ts
backend-pet-tracker/src/modules/pet-members/application/dto/accept-invite.dto.ts
backend-pet-tracker/src/modules/pet-members/application/invite-code.spec.ts
backend-pet-tracker/src/modules/pet-members/application/invite-code.ts
backend-pet-tracker/src/modules/pet-members/application/use-cases/accept-pet-invite.use-case.spec.ts
backend-pet-tracker/src/modules/pet-members/application/use-cases/accept-pet-invite.use-case.ts
backend-pet-tracker/src/modules/pet-members/application/use-cases/create-pet-invite.use-case.spec.ts
backend-pet-tracker/src/modules/pet-members/application/use-cases/create-pet-invite.use-case.ts
backend-pet-tracker/src/modules/pet-members/application/use-cases/list-pet-invites.use-case.ts
backend-pet-tracker/src/modules/pet-members/application/use-cases/list-pet-members.use-case.ts
backend-pet-tracker/src/modules/pet-members/application/use-cases/remove-pet-member.use-case.ts
backend-pet-tracker/src/modules/pet-members/application/use-cases/revoke-pet-invite.use-case.ts
backend-pet-tracker/src/modules/pet-members/domain/entities/pet-invite.entity.ts
backend-pet-tracker/src/modules/pet-members/domain/entities/pet-member.entity.ts
backend-pet-tracker/src/modules/pet-members/domain/errors/pet-member.errors.ts
backend-pet-tracker/src/modules/pet-members/domain/repositories/pet-member.repository.ts
backend-pet-tracker/src/modules/pet-members/infrastructure/mappers/pet-member-error.mapper.ts
backend-pet-tracker/src/modules/pet-members/infrastructure/pet-invites.controller.ts
backend-pet-tracker/src/modules/pet-members/infrastructure/pet-members.controller.ts
backend-pet-tracker/src/modules/pet-members/infrastructure/repositories/pet-member.drizzle.repository.ts
backend-pet-tracker/src/modules/pet-members/pet-members.module.ts
backend-pet-tracker/test/pet-members.e2e-spec.ts
```

Estado git:
```text
## feature/211-pet-members-api...origin/main [ahead 19, behind 2]
 M backend-pet-tracker/src/modules/pet-members/application/use-cases/accept-pet-invite.use-case.ts
 M backend-pet-tracker/src/modules/pet-members/infrastructure/mappers/pet-member-error.mapper.ts
 M backend-pet-tracker/src/modules/pet-members/infrastructure/pet-invites.controller.ts
 M backend-pet-tracker/src/modules/pet-members/infrastructure/repositories/pet-member.drizzle.repository.ts
?? progress/impl_pet-members-api.md
```

El reporte se deja sin commit: el handoff solo lo autoriza en el commit 28, al que no se ha llegado. No se modifica traceability.md por el mismo motivo.

### Commit 16 (reanudado)

`ee0320de feat(pet-members): accept invite (R7,R8,R9)`

Prettier: 2 pasadas totales (1 antes de la parada y 1 al reanudar). prettier/eslint/tsc exit 0. Unit Tests: 18 passed, 18 total. E2E Tests: 53 passed, 53 total; guarda vacía.

### Commit 17

`e158a41b test(pet-members): accept rate limit (R10)`

Prettier: 1 pasada. prettier/eslint/tsc exit 0. Unit Tests: 3 failed, 18 passed, 21 total (toThrow(HttpException), no lanza). E2E Tests: 2 failed, 53 passed, 55 total (toBe(429), recibido 201); guarda vacía. Solo R10 rojo.

### Commit 18

`3b40b20c feat(pet-members): accept rate limit (R10)`

Prettier: 1 pasada. prettier/eslint/tsc exit 0. Unit Tests: 21 passed, 21 total. E2E Tests: 55 passed, 55 total; guarda vacía.

### Commit 19

`066e3960 test(pet-members): list members (R11)`

Prettier: 1 pasada. prettier/eslint/tsc exit 0. Tests: 1 failed, 55 passed, 56 total. R11 .expect(200) recibe 500; guarda vacía.

### Commit 20

`c40c0e6b feat(pet-members): list members (R11)`

Prettier: 1 pasada. prettier/eslint/tsc exit 0. Tests: 56 passed, 56 total; guarda vacía.


## Parada en el commit 21 (Reanudación 1)

Estado actual: **cadena incompleta; commits 1–20 creados, commit 21 sin crear**.

La cadena de validación del commit 21 pasó Prettier (1 pasada) y eslint, pero tsc devolvió **2**. Los cuatro errores son de los tests nuevos, antes de ejecutar Jest:

```text
test/pet-members.e2e-spec.ts(712,32): error TS2322: Type 'string' is not assignable to type '`${string}-${string}-${string}-${string}-${string}`'.
test/pet-members.e2e-spec.ts(716,9): error TS2322: Type 'string' is not assignable to type '`${string}-${string}-${string}-${string}-${string}`'.
test/pet-members.e2e-spec.ts(740,40): error TS2322: Type '"not-a-uuid"' is not assignable to type '`${string}-${string}-${string}-${string}-${string}`'.
test/pet-members.e2e-spec.ts(743,7): error TS2322: Type 'string' is not assignable to type '`${string}-${string}-${string}-${string}-${string}`'.
```

Causa: las variables `target` de R13/R14 se inicializan con `randomUUID()`, cuyo tipo inferido es el UUID de plantilla de node:crypto, y luego reciben ids tipados como string o el literal de la rama inválida. La corrección concreta sería declarar esas dos variables con `let target: string = randomUUID()`. Se deja sin aplicar por la condición de parada del handoff ante fallo de código; la excepción de Reanudación 1 solo permite repetir Prettier. No se modifica la spec.

No se han ejecutado los unitarios ni E2E del commit 21: el rojo exigido debe ser por aserción, con tsc verde. Quedan sin commit los nuevos tests E2E R12–R15/R21, el unitario R13 y este reporte. No se ha creado el marcador `.done`: Reanudación 1 lo reserva para el final de la cadena entera.

Últimos verdes: commit 18 unitarios `Tests: 21 passed, 21 total`; commit 20 E2E `Tests: 56 passed, 56 total`. No se han ejecutado suite unitaria completa, lint/typecheck de cierre ni graphify. Los commits 22–28 no se han iniciado. Sin harness, push, PR, merge ni rebase.

### Commits de esta reanudación

```text
ee0320de feat(pet-members): accept invite (R7,R8,R9)
e158a41b test(pet-members): accept rate limit (R10)
3b40b20c feat(pet-members): accept rate limit (R10)
066e3960 test(pet-members): list members (R11)
c40c0e6b feat(pet-members): list members (R11)
```

### Estado del árbol

```text
## feature/211-pet-members-api...origin/main [ahead 25, behind 5]
 M backend-pet-tracker/test/pet-members.e2e-spec.ts
?? backend-pet-tracker/src/modules/pet-members/application/use-cases/remove-pet-member.use-case.spec.ts
?? progress/impl_pet-members-api.md
```

## Reanudación 2

El leader autoriza declarar las dos variables target de R13/R14 como string, sin cambiar las aserciones. Se mantiene la parada anterior como evidencia histórica. Se reanuda desde el commit 21 y se permite la misma corrección TS2322 por randomUUID en tests nuevos de los commits 21–28. Sin ejecutar el harness.

### Commit 21 (reanudado)

`2379a015 test(pet-members): remove members (R12,R13,R14,R15,R21)`

Declaraciones target:string: 2; declaraciones sin anotar: 0. Prettier: 1 pasada en cada intento (2 totales contando el anterior a la parada TS2322). prettier/eslint/tsc exit 0. Unit Tests: 1 failed, 21 passed, 22 total (rejects.toBeInstanceOf, recibido Error). E2E Tests: 13 failed, 56 passed, 69 total. Solo los its nuevos R12–R15/R21 fallan por aserción: 204/403/404/409 esperados, 500 recibido; guarda vacía.

### Commit 22

`f7d62fcd feat(pet-members): remove members (R12,R13,R14,R15)`

Prettier: 1 pasada. prettier/eslint/tsc exit 0. Unit Tests: 22 passed, 22 total. E2E Tests: 69 passed, 69 total; guarda vacía. R21 queda verde sin código propio.

### Commit 23

`5fdd75b6 test(pet-members): audit the 4 actions (R19)`

Prettier: 1 pasada. prettier/eslint/tsc exit 0. Tests: 5 failed, 69 passed, 74 total. R19 toHaveLength(1) recibe 0 en las cuatro acciones; toHaveLength(4) recibe 0 en meta; guarda vacía.

### Commit 24

`fde4820e feat(pet-members): audit the 4 actions (R19)`

Prettier: 1 pasada. prettier/eslint/tsc exit 0. Unit Tests: 22 passed, 22 total. E2E Tests: 74 passed, 74 total; guarda vacía. Auditoría posterior al éxito de repositorio en las cuatro acciones.

### Commit 25

`03e832a5 test(pet-members): failed accept is not audited (R19)`

Prettier: 1 pasada. prettier/eslint/tsc exit 0. Unit Tests: 22 passed, 22 total. E2E Tests: 2 failed, 74 passed, 76 total; guarda vacía. Se versiona la mutación como primera línea de execute. Solo los dos nuevos its R19 404/409 fallan: expect(rows).toHaveLength(0), recibido 1. Los cinco its de auditoría previos siguen verdes por su filtro action + entity_id.

### Commit 26

`3639b7af feat(pet-members): audit only successful accepts (R19)`

Prettier: 1 pasada. prettier/eslint/tsc exit 0. Unit Tests: 22 passed, 22 total. E2E Tests: 76 passed, 76 total; guarda vacía. Rojo del 25 revertido: git diff fde4820e -- accept-pet-invite.use-case.ts vacío (exit 0). El fichero coincide exactamente con el commit 24.

### Commit 27

`7829b844 docs(data-model): pet_invites table`

Solo dos líneas nuevas en data-model.md: relación ERD y fila pet_invites tras pet_users. Sin .ts tocados, por tanto 0 pasadas de escritura de Prettier; check final de todos los .ts de la feature exit 0. Lint final y tsc final exit 0. Suite completa: Test Suites: 193 passed, 193 total; Tests: 1496 passed, 1496 total; exit 0. Base: 187 suites/1474 tests; incremento exacto de 6 suites y 22 its. E2E final conservado del 26: Tests: 76 passed, 76 total.


## Cierre completo (Reanudación 2)

Estado final: **implementación y cadena 1–27 completas; reporte y trazabilidad se entregan juntos en el commit 28**. Las secciones de parada quedan como evidencia histórica superada por las reanudaciones autorizadas. R1–R21 cubiertos; sin commits refactor adicionales.

Validación final, todos con exit 0:

- Prettier check de todos los .ts de la feature, schema nuevo, barrel y app.module.ts.
- `pnpm exec eslint src/modules/pet-members src/db/schema test/pet-members.e2e-spec.ts src/app.module.ts`.
- `pnpm exec tsc --noEmit -p tsconfig.json`.
- `pnpm exec jest`: **Test Suites: 193 passed, 193 total; Tests: 1496 passed, 1496 total**. Cero FAIL. Frente a T0 (187 suites/1474 tests), incremento exacto de 6 suites y 22 its nuevos.
- `pnpm exec jest --config ./test/jest-e2e.json pet-members`: **Test Suites: 1 passed, 1 total; Tests: 76 passed, 76 total**. Guarda pgrep vacía antes del commit 26, última modificación de código. Los commits 27–28 solo son documentación.
- `graphify update .`: exit 0, AST sin LLM; 29814 nodos, 38365 aristas, 1941 comunidades, en graphify-out (ignorado). Aviso: los 21 SQL no aportaron nodos porque falta la dependencia opcional tree_sitter_sql; no se instaló ninguna dependencia. R1 y db:migrate validan el SQL de la feature.

Logs ignorados: 211-final-prettier.log, 211-final-eslint.log, 211-final-tsc.log, 211-final-unit.log, 211-26.log, 211-final-guards.log y 211-graphify.log.

### Guardas finales y lista cerrada desde H0

`git diff --name-only f1d0f320..HEAD -- backend-pet-tracker/ docs/` coincide exactamente con los 32 archivos permitidos.

```text
A1: 1; OK
A2: 1; OK
A3: 1; OK
A4: 1; OK
A5: 1; OK
A6: 2; OK
A7: 1; OK
A8: 1; OK
A9: 1; OK
A10: 1; OK
A11: 1; OK
A12: 1; OK
A13: 1; OK
A14: 1; OK
A15: 1; OK
A16: 1; OK
A17: 1; OK
A18: 1; OK
A19: 1; OK
A20: 1; OK
A21: 2; OK
A22: 1; OK
A23: 3; OK
A24: 1; OK
A25: 1; OK
A26: 21; OK
A27: 1; OK
A28: 5; OK
A29: 25; OK
A30: 2; OK
A31: 0; OK
A32: 1; OK
A33: 1; OK
A34: 1; OK
parseBody: 13; OK
Not implemented: 0; OK
target:string: 2; OK
target no anotado: 0; OK
Diff protegido desde H0: vacío (exit 0)
Lista cerrada: 32 ficheros, coincide exactamente
Barrel: línea nueva entre A24 y A25, OK

backend-pet-tracker/src/app.module.ts
backend-pet-tracker/src/db/migrations/0020_pet_invites.sql
backend-pet-tracker/src/db/migrations/meta/0020_snapshot.json
backend-pet-tracker/src/db/migrations/meta/_journal.json
backend-pet-tracker/src/db/schema/index.ts
backend-pet-tracker/src/db/schema/pet-invites.schema.spec.ts
backend-pet-tracker/src/db/schema/pet-invites.schema.ts
backend-pet-tracker/src/modules/pet-members/application/dto/accept-invite.dto.ts
backend-pet-tracker/src/modules/pet-members/application/invite-code.spec.ts
backend-pet-tracker/src/modules/pet-members/application/invite-code.ts
backend-pet-tracker/src/modules/pet-members/application/use-cases/accept-pet-invite.use-case.spec.ts
backend-pet-tracker/src/modules/pet-members/application/use-cases/accept-pet-invite.use-case.ts
backend-pet-tracker/src/modules/pet-members/application/use-cases/create-pet-invite.use-case.spec.ts
backend-pet-tracker/src/modules/pet-members/application/use-cases/create-pet-invite.use-case.ts
backend-pet-tracker/src/modules/pet-members/application/use-cases/list-pet-invites.use-case.ts
backend-pet-tracker/src/modules/pet-members/application/use-cases/list-pet-members.use-case.ts
backend-pet-tracker/src/modules/pet-members/application/use-cases/remove-pet-member.use-case.spec.ts
backend-pet-tracker/src/modules/pet-members/application/use-cases/remove-pet-member.use-case.ts
backend-pet-tracker/src/modules/pet-members/application/use-cases/revoke-pet-invite.use-case.ts
backend-pet-tracker/src/modules/pet-members/domain/entities/pet-invite.entity.ts
backend-pet-tracker/src/modules/pet-members/domain/entities/pet-member.entity.ts
backend-pet-tracker/src/modules/pet-members/domain/errors/pet-member.errors.ts
backend-pet-tracker/src/modules/pet-members/domain/repositories/pet-member.repository.ts
backend-pet-tracker/src/modules/pet-members/infrastructure/guards/invite-accept-rate-limit.guard.spec.ts
backend-pet-tracker/src/modules/pet-members/infrastructure/guards/invite-accept-rate-limit.guard.ts
backend-pet-tracker/src/modules/pet-members/infrastructure/mappers/pet-member-error.mapper.ts
backend-pet-tracker/src/modules/pet-members/infrastructure/pet-invites.controller.ts
backend-pet-tracker/src/modules/pet-members/infrastructure/pet-members.controller.ts
backend-pet-tracker/src/modules/pet-members/infrastructure/repositories/pet-member.drizzle.repository.ts
backend-pet-tracker/src/modules/pet-members/pet-members.module.ts
backend-pet-tracker/test/pet-members.e2e-spec.ts
docs/data-model.md
```

### Cadena consolidada, hashes, mensajes y Tests

Los hashes 1–27 son definitivos y no se rebasean. El 28 contiene este reporte: se identifica por HEAD y mensaje, porque su hash no puede autorreferenciarse. Su validación se conserva de 27, sin cambios de código.

| Paso | Hash y mensaje | Tests de la validación | Pasadas Prettier --write |
|---|---|---|---|
| 1 | `33d4b890 test(db): pet_invites table and its migration (R1)` | Tests:       3 failed, 3 total | 1 |
| 2 | `769f46df feat(db): pet_invites table with generated migration (R1)` | Tests:       3 passed, 3 total | 1 |
| 3 | `ce507984 test(pet-members): invite code format, normalization and hash (R2)` | Tests:       13 failed, 3 passed, 16 total | 1 |
| 4 | `2807d2e3 feat(pet-members): invite code (R2)` | Tests:       16 passed, 16 total | 1 |
| 5 | `4e53c084 test(pet-members): authorization on the 6 routes (R16,R17,R18)` | Tests:       24 failed, 24 total | 1 |
| 6 | `28f41e63 feat(pet-members): module, routes and guards (R16,R17,R18)` | Tests:       24 passed, 24 total | 1 |
| 7 | `0dd15da6 test(pet-members): create invite (R3)` | Tests:       1 failed, 16 passed, 17 total; Tests:       1 failed, 24 passed, 25 total | 1 |
| 8 | `99aa8f30 feat(pet-members): create invite (R3)` | Tests:       17 passed, 17 total; Tests:       25 passed, 25 total | 1 |
| 9 | `341cb1c2 test(pet-members): invite and member limits (R4)` | Tests:       5 failed, 25 passed, 30 total | 1 |
| 10 | `83df0dd2 feat(pet-members): per-pet limits (R4)` | Tests:       17 passed, 17 total; Tests:       30 passed, 30 total | 1 |
| 11 | `d005debf test(pet-members): list pending invites (R5)` | Tests:       1 failed, 30 passed, 31 total | 1 |
| 12 | `37f1821c feat(pet-members): list pending invites (R5)` | Tests:       31 passed, 31 total | 1 |
| 13 | `214a96dc test(pet-members): revoke invite (R6)` | Tests:       7 failed, 31 passed, 38 total | 1 |
| 14 | `7d3229d5 feat(pet-members): revoke invite (R6)` | Tests:       38 passed, 38 total | 1 |
| 15 | `62b8e563 test(pet-members): accept invite (R7,R8,R9,R20)` | Tests:       1 failed, 17 passed, 18 total; Tests:       15 failed, 38 passed, 53 total | 1 |
| 16 | `ee0320de feat(pet-members): accept invite (R7,R8,R9)` | Tests:       18 passed, 18 total; Tests:       53 passed, 53 total | 2 totales (parada + reanudación) |
| 17 | `e158a41b test(pet-members): accept rate limit (R10)` | Tests:       3 failed, 18 passed, 21 total; Tests:       2 failed, 53 passed, 55 total | 1 |
| 18 | `3b40b20c feat(pet-members): accept rate limit (R10)` | Tests:       21 passed, 21 total; Tests:       55 passed, 55 total | 1 |
| 19 | `066e3960 test(pet-members): list members (R11)` | Tests:       1 failed, 55 passed, 56 total | 1 |
| 20 | `c40c0e6b feat(pet-members): list members (R11)` | Tests:       56 passed, 56 total | 1 |
| 21 | `2379a015 test(pet-members): remove members (R12,R13,R14,R15,R21)` | Tests:       1 failed, 21 passed, 22 total; Tests:       13 failed, 56 passed, 69 total | 2 totales (parada + reanudación) |
| 22 | `f7d62fcd feat(pet-members): remove members (R12,R13,R14,R15)` | Tests:       22 passed, 22 total; Tests:       69 passed, 69 total | 1 |
| 23 | `5fdd75b6 test(pet-members): audit the 4 actions (R19)` | Tests:       5 failed, 69 passed, 74 total | 1 |
| 24 | `fde4820e feat(pet-members): audit the 4 actions (R19)` | Tests:       22 passed, 22 total; Tests:       74 passed, 74 total | 1 |
| 25 | `03e832a5 test(pet-members): failed accept is not audited (R19)` | Tests:       22 passed, 22 total; Tests:       2 failed, 74 passed, 76 total | 1 |
| 26 | `3639b7af feat(pet-members): audit only successful accepts (R19)` | Tests:       22 passed, 22 total; Tests:       76 passed, 76 total | 1 |
| 27 | `7829b844 docs(data-model): pet_invites table` | Tests:       1496 passed, 1496 total | 0 (sin .ts) |
| 28 | `HEAD docs(pet-members): traceability of #211` | Tests: 1496 passed, 1496 total; E2E: 76 passed, 76 total (validación conservada) | 0 (sin .ts) |

### Tabla consolidada commit, test, rojo observado

Los rojos versionados fueron por aserción, con prettier/eslint/tsc verdes. Los errores previos a los commits 16 y 21 se resolvieron conforme a las reanudaciones antes de versionar sus cambios.

| Commit | Test | Rojo observado (línea de expect) |
|---|---|---|
| 1 (33d4b890) | #211 R1: pet_invites › #211 R1: pet_invites tiene exactamente las 10 columnas declaradas | > 14 \|     ).toEqual([ |
| 1 (33d4b890) | #211 R1: pet_invites › #211 R1: code_hash es char(64) NOT NULL único y role tiene su CHECK | > 33 \|     expect(column).toBeDefined(); / Received: undefined |
| 1 (33d4b890) | #211 R1: pet_invites › #211 R1: la migración generada crea tabla, unique, check, FKs e índices | > 46 \|     expect(files).toHaveLength(1); / Expected length: 1 / Received length: 0 |
| 3 (ce507984) | #211 R2: código de invitación › #211 R2: generateInviteCode da 10 caracteres del alfabeto de 30 | > 12 \|       expect(code).toMatch(/^[23456789ABCDEFGHJKMNPQRSTVWXYZ]{10}$/); |
| 3 (ce507984) | #211 R2: código de invitación › #211 R2: normalizeInviteCode acepta minúsculas, espacios y guiones | > 18 \|     expect(normalizeInviteCode(' abcde-fghjk ')).toBe('ABCDEFGHJK'); / Expected: "ABCDEFGHJK" / Received: " abcde-fghjk " |
| 3 (ce507984) | #211 R2: código de invitación › #211 R2: normalizeInviteCode devuelve null para | > 33 \|     expect(normalizeInviteCode(input)).toBeNull(); / Received: "" |
| 3 (ce507984) | #211 R2: código de invitación › #211 R2: normalizeInviteCode devuelve null para ABCDEFGHJ | > 33 \|     expect(normalizeInviteCode(input)).toBeNull(); / Received: "ABCDEFGHJ" |
| 3 (ce507984) | #211 R2: código de invitación › #211 R2: normalizeInviteCode devuelve null para ABCDEFGHJKM | > 33 \|     expect(normalizeInviteCode(input)).toBeNull(); / Received: "ABCDEFGHJKM" |
| 3 (ce507984) | #211 R2: código de invitación › #211 R2: normalizeInviteCode devuelve null para ABCDEFGHJ0 | > 33 \|     expect(normalizeInviteCode(input)).toBeNull(); / Received: "ABCDEFGHJ0" |
| 3 (ce507984) | #211 R2: código de invitación › #211 R2: normalizeInviteCode devuelve null para ABCDEFGHJ1 | > 33 \|     expect(normalizeInviteCode(input)).toBeNull(); / Received: "ABCDEFGHJ1" |
| 3 (ce507984) | #211 R2: código de invitación › #211 R2: normalizeInviteCode devuelve null para ABCDEFGHJO | > 33 \|     expect(normalizeInviteCode(input)).toBeNull(); / Received: "ABCDEFGHJO" |
| 3 (ce507984) | #211 R2: código de invitación › #211 R2: normalizeInviteCode devuelve null para ABCDEFGHJI | > 33 \|     expect(normalizeInviteCode(input)).toBeNull(); / Received: "ABCDEFGHJI" |
| 3 (ce507984) | #211 R2: código de invitación › #211 R2: normalizeInviteCode devuelve null para ABCDEFGHJL | > 33 \|     expect(normalizeInviteCode(input)).toBeNull(); / Received: "ABCDEFGHJL" |
| 3 (ce507984) | #211 R2: código de invitación › #211 R2: normalizeInviteCode devuelve null para ABCDEFGHJU | > 33 \|     expect(normalizeInviteCode(input)).toBeNull(); / Received: "ABCDEFGHJU" |
| 3 (ce507984) | #211 R2: código de invitación › #211 R2: normalizeInviteCode devuelve null para ABCDEFGHJ! | > 33 \|     expect(normalizeInviteCode(input)).toBeNull(); / Received: "ABCDEFGHJ!" |
| 3 (ce507984) | #211 R2: código de invitación › #211 R2: hashInviteCode es SHA-256 hex | > 36 \|     expect(hashInviteCode('ABCDEFGHJK')).toBe( / Expected: "f57cbf1e3e471b25db4b8ad0844df41b2dae9c7d1944944d128e49294d412f66" / Received: "" |
| 5 (4e53c084) | #211 R16: pet members API › #211 R16: un no miembro recibe 404 en post /v1/pets/:petId/invites | > 146 \|       expect(response.body).toEqual({ statusCode: 404, message: 'Not Found' }); |
| 5 (4e53c084) | #211 R16: pet members API › #211 R16: un no miembro recibe 404 en get /v1/pets/:petId/invites | > 146 \|       expect(response.body).toEqual({ statusCode: 404, message: 'Not Found' }); |
| 5 (4e53c084) | #211 R16: pet members API › #211 R16: un no miembro recibe 404 en delete /v1/pets/:petId/invites/:inviteId | > 146 \|       expect(response.body).toEqual({ statusCode: 404, message: 'Not Found' }); |
| 5 (4e53c084) | #211 R16: pet members API › #211 R16: un no miembro recibe 404 en get /v1/pets/:petId/members | > 146 \|       expect(response.body).toEqual({ statusCode: 404, message: 'Not Found' }); |
| 5 (4e53c084) | #211 R16: pet members API › #211 R16: un no miembro recibe 404 en delete /v1/pets/:petId/members/:userId | > 146 \|       expect(response.body).toEqual({ statusCode: 404, message: 'Not Found' }); |
| 5 (4e53c084) | #211 R16: pet members API › #211 R16: un petId inexistente da el mismo 404 en post /v1/pets/:petId/invites | > 157 \|       expect(response.body).toEqual({ statusCode: 404, message: 'Not Found' }); |
| 5 (4e53c084) | #211 R16: pet members API › #211 R16: un petId inexistente da el mismo 404 en get /v1/pets/:petId/invites | > 157 \|       expect(response.body).toEqual({ statusCode: 404, message: 'Not Found' }); |
| 5 (4e53c084) | #211 R16: pet members API › #211 R16: un petId inexistente da el mismo 404 en delete /v1/pets/:petId/invites/:inviteId | > 157 \|       expect(response.body).toEqual({ statusCode: 404, message: 'Not Found' }); |
| 5 (4e53c084) | #211 R16: pet members API › #211 R16: un petId inexistente da el mismo 404 en get /v1/pets/:petId/members | > 157 \|       expect(response.body).toEqual({ statusCode: 404, message: 'Not Found' }); |
| 5 (4e53c084) | #211 R16: pet members API › #211 R16: un petId inexistente da el mismo 404 en delete /v1/pets/:petId/members/:userId | > 157 \|       expect(response.body).toEqual({ statusCode: 404, message: 'Not Found' }); |
| 5 (4e53c084) | #211 R16: pet members API › #211 R16: un petId que no es UUID da el mismo 404 en post /v1/pets/:petId/invites | > 168 \|       expect(response.body).toEqual({ statusCode: 404, message: 'Not Found' }); |
| 5 (4e53c084) | #211 R16: pet members API › #211 R16: un petId que no es UUID da el mismo 404 en get /v1/pets/:petId/invites | > 168 \|       expect(response.body).toEqual({ statusCode: 404, message: 'Not Found' }); |
| 5 (4e53c084) | #211 R16: pet members API › #211 R16: un petId que no es UUID da el mismo 404 en delete /v1/pets/:petId/invites/:inviteId | > 168 \|       expect(response.body).toEqual({ statusCode: 404, message: 'Not Found' }); |
| 5 (4e53c084) | #211 R16: pet members API › #211 R16: un petId que no es UUID da el mismo 404 en get /v1/pets/:petId/members | > 168 \|       expect(response.body).toEqual({ statusCode: 404, message: 'Not Found' }); |
| 5 (4e53c084) | #211 R16: pet members API › #211 R16: un petId que no es UUID da el mismo 404 en delete /v1/pets/:petId/members/:userId | > 168 \|       expect(response.body).toEqual({ statusCode: 404, message: 'Not Found' }); |
| 5 (4e53c084) | #211 R16: pet members API › #211 R17: un family recibe 403 en post /v1/pets/:petId/invites | > 180 \|       expect(response.status).toBe(403); / Expected: 403 / Received: 404 |
| 5 (4e53c084) | #211 R16: pet members API › #211 R17: un family recibe 403 en get /v1/pets/:petId/invites | > 180 \|       expect(response.status).toBe(403); / Expected: 403 / Received: 404 |
| 5 (4e53c084) | #211 R16: pet members API › #211 R17: un family recibe 403 en delete /v1/pets/:petId/invites/:inviteId | > 180 \|       expect(response.status).toBe(403); / Expected: 403 / Received: 404 |
| 5 (4e53c084) | #211 R16: pet members API › #211 R18: sin token responde 401 en post /v1/pets/:petId/invites | > 191 \|       expect(response.status).toBe(401); / Expected: 401 / Received: 404 |
| 5 (4e53c084) | #211 R16: pet members API › #211 R18: sin token responde 401 en get /v1/pets/:petId/invites | > 191 \|       expect(response.status).toBe(401); / Expected: 401 / Received: 404 |
| 5 (4e53c084) | #211 R16: pet members API › #211 R18: sin token responde 401 en delete /v1/pets/:petId/invites/:inviteId | > 191 \|       expect(response.status).toBe(401); / Expected: 401 / Received: 404 |
| 5 (4e53c084) | #211 R16: pet members API › #211 R18: sin token responde 401 en get /v1/pets/:petId/members | > 191 \|       expect(response.status).toBe(401); / Expected: 401 / Received: 404 |
| 5 (4e53c084) | #211 R16: pet members API › #211 R18: sin token responde 401 en delete /v1/pets/:petId/members/:userId | > 191 \|       expect(response.status).toBe(401); / Expected: 401 / Received: 404 |
| 5 (4e53c084) | #211 R16: pet members API › #211 R18: sin token responde 401 en post /v1/invites/accept | > 191 \|       expect(response.status).toBe(401); / Expected: 401 / Received: 404 |
| 7 (0dd15da6) | #211 R3: crear invitación › #211 R3: expiresAt es now + 72 h | > 35 \|     await expect(result).resolves.toEqual({ / Rejected to value: [Error: Not implemented] |
| 7 (0dd15da6) | #211 R16: pet members API › #211 R3: crea la invitación, devuelve el código una vez y guarda solo su hash | > 210 \|       .expect(201); / expected 201 "Created", got 500 "Internal Server Error" |
| 9 (341cb1c2) | #211 R16: pet members API › #211 R4: la sexta pendiente responde PET_INVITES_LIMIT y no crea fila | > 265 \|     expect(response.status).toBe(409); / Expected: 409 / Received: 201 |
| 9 (341cb1c2) | #211 R16: pet members API › #211 R4: una invitación revocada libera su plaza | > 275 \|     expect(before.status).toBe(409); / Expected: 409 / Received: 201 |
| 9 (341cb1c2) | #211 R16: pet members API › #211 R4: una invitación expirada libera su plaza | > 287 \|     expect(before.status).toBe(409); / Expected: 409 / Received: 201 |
| 9 (341cb1c2) | #211 R16: pet members API › #211 R4: con 9 miembros activos se crea una y la siguiente responde PET_MEMBERS_LIMIT | > 303 \|     expect(response.status).toBe(409); / Expected: 409 / Received: 201 |
| 9 (341cb1c2) | #211 R16: pet members API › #211 R4: con ambos límites alcanzados gana PET_INVITES_LIMIT | > 317 \|     expect(response.status).toBe(409); / Expected: 409 / Received: 201 |
| 11 (d005debf) | #211 R16: pet members API › #211 R5: lista solo las pendientes, de la más nueva a la más vieja, sin código | > 342 \|       .expect(200); / expected 200 "OK", got 500 "Internal Server Error" |
| 13 (214a96dc) | #211 R16: pet members API › #211 R6: revocar responde 204 y fija revoked_at | > 366 \|       .expect(204); / expected 204 "No Content", got 500 "Internal Server Error" |
| 13 (214a96dc) | #211 R16: pet members API › #211 R6: responde el mismo 404 si la invitación no es UUID | > 416 \|     expect(response.status).toBe(404); / Expected: 404 / Received: 500 |
| 13 (214a96dc) | #211 R16: pet members API › #211 R6: responde el mismo 404 si la invitación no existe | > 416 \|     expect(response.status).toBe(404); / Expected: 404 / Received: 500 |
| 13 (214a96dc) | #211 R16: pet members API › #211 R6: responde el mismo 404 si la invitación es de otra mascota | > 416 \|     expect(response.status).toBe(404); / Expected: 404 / Received: 500 |
| 13 (214a96dc) | #211 R16: pet members API › #211 R6: responde el mismo 404 si la invitación está aceptada | > 416 \|     expect(response.status).toBe(404); / Expected: 404 / Received: 500 |
| 13 (214a96dc) | #211 R16: pet members API › #211 R6: responde el mismo 404 si la invitación está revocada | > 416 \|     expect(response.status).toBe(404); / Expected: 404 / Received: 500 |
| 13 (214a96dc) | #211 R16: pet members API › #211 R6: responde el mismo 404 si la invitación está expirada | > 416 \|     expect(response.status).toBe(404); / Expected: 404 / Received: 500 |
| 15 (62b8e563) | #211 R8: aceptar invitación › #211 R8: un código que no normaliza no consulta el repositorio | > 19 \|     ).rejects.toBeInstanceOf(InviteNotAcceptableError); / Expected constructor: InviteNotAcceptableError / Received constructor: Error |
| 15 (62b8e563) | #211 R16: pet members API › #211 R7: aceptar crea la membresía family activa y responde { petId, role } | > 444 \|     const response = await accept(accepter, invite.code).expect(201); / expected 201 "Created", got 500 "Internal Server Error" |
| 15 (62b8e563) | #211 R16: pet members API › #211 R7: la invitación aceptada guarda accepted_by y accepted_at | > 453 \|     await accept(accepter, invite.code).expect(201); / expected 201 "Created", got 500 "Internal Server Error" |
| 15 (62b8e563) | #211 R16: pet members API › #211 R7: acepta el código en minúsculas y con guion | > 467 \|     ).expect(201); / expected 201 "Created", got 500 "Internal Server Error" |
| 15 (62b8e563) | #211 R16: pet members API › #211 R8: responde el mismo 404 si el código no existe | > 503 \|     expect(response.status).toBe(404); / Expected: 404 / Received: 500 |
| 15 (62b8e563) | #211 R16: pet members API › #211 R8: responde el mismo 404 si el código no normaliza | > 503 \|     expect(response.status).toBe(404); / Expected: 404 / Received: 500 |
| 15 (62b8e563) | #211 R16: pet members API › #211 R8: responde el mismo 404 si el código está expirado | > 503 \|     expect(response.status).toBe(404); / Expected: 404 / Received: 500 |
| 15 (62b8e563) | #211 R16: pet members API › #211 R8: responde el mismo 404 si el código está revocado | > 503 \|     expect(response.status).toBe(404); / Expected: 404 / Received: 500 |
| 15 (62b8e563) | #211 R16: pet members API › #211 R8: responde el mismo 404 si el código ya se usó | > 503 \|     expect(response.status).toBe(404); / Expected: 404 / Received: 500 |
| 15 (62b8e563) | #211 R16: pet members API › #211 R8: responde 400 con el cuerpo {} | > 519 \|       expect(response.status).toBe(400); / Expected: 400 / Received: 500 |
| 15 (62b8e563) | #211 R16: pet members API › #211 R8: responde 400 con el cuerpo {"code":123} | > 519 \|       expect(response.status).toBe(400); / Expected: 400 / Received: 500 |
| 15 (62b8e563) | #211 R16: pet members API › #211 R8: responde 400 con el cuerpo {"code":"   "} | > 519 \|       expect(response.status).toBe(400); / Expected: 400 / Received: 500 |
| 15 (62b8e563) | #211 R16: pet members API › #211 R8: responde 400 con el cuerpo {"code":"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"} | > 519 \|       expect(response.status).toBe(400); / Expected: 400 / Received: 500 |
| 15 (62b8e563) | #211 R16: pet members API › #211 R9: el owner que acepta su propio código recibe 409 y la invitación sigue pendiente | > 537 \|     expect(response.status).toBe(409); / Expected: 409 / Received: 500 |
| 15 (62b8e563) | #211 R16: pet members API › #211 R9: un family que acepta otro código de la misma mascota recibe 409 y conserva su rol | > 552 \|     expect(response.status).toBe(409); / Expected: 409 / Received: 500 |
| 15 (62b8e563) | #211 R16: pet members API › #211 R20: el nuevo family lista la mascota, la lee, no la edita y recibe push | > 571 \|     await accept(accepter, invite.code).expect(201); / expected 201 "Created", got 500 "Internal Server Error" |
| 17 (e158a41b) | #211 R10: límite de aceptación › #211 R10: deja pasar 10 peticiones del mismo usuario y la 11.ª lanza 429 | > 14 \|     expect(() => guard.canActivate(context)).toThrow(HttpException); / Expected constructor: HttpException |
| 17 (e158a41b) | #211 R10: límite de aceptación › #211 R10: el contador es por usuario | > 29 \|     expect(() => guard.canActivate(contextFor('a'))).toThrow(HttpException); / Expected constructor: HttpException |
| 17 (e158a41b) | #211 R10: límite de aceptación › #211 R10: la ventana se reabre a los 3 600 000 ms y no antes | > 38 \|     expect(() => guard.canActivate(contextFor('a'))).toThrow(HttpException); / Expected constructor: HttpException |
| 17 (e158a41b) | #211 R16: pet members API › #211 R10: la 11.ª petición en la hora responde 429 aunque el código sea válido | > 607 \|     expect(response.status).toBe(429); / Expected: 429 / Received: 201 |
| 17 (e158a41b) | #211 R16: pet members API › #211 R10: otro usuario no hereda el contador | > 620 \|     expect(response.status).toBe(429); / Expected: 429 / Received: 201 |
| 19 (066e3960) | #211 R16: pet members API › #211 R11: owner y family ven la misma lista ordenada por alta, sin email | > 645 \|     const response = await memberList(owner, pet.id).expect(200); / expected 200 "OK", got 500 "Internal Server Error" |
| 21 (2379a015) | #211 R13: baja de miembros › #211 R13: un no owner sobre otro usuario no llama a findMembership | > 20 \|     ).rejects.toBeInstanceOf(MemberRemovalForbiddenError); / Expected constructor: MemberRemovalForbiddenError / Received constructor: Error |
| 21 (2379a015) | #211 R16: pet members API › #211 R12: el owner quita a un family con 204 y su fila desaparece | > 682 \|     const response = await removeMember(owner, pet.id, accepter.id).expect(204); / expected 204 "No Content", got 500 "Internal Server Error" |
| 21 (2379a015) | #211 R16: pet members API › #211 R12: un family se quita a sí mismo con 204 y su fila desaparece | > 689 \|     const response = await removeMember(accepter, pet.id, accepter.id).expect( / expected 204 "No Content", got 500 "Internal Server Error" |
| 21 (2379a015) | #211 R16: pet members API › #211 R12: el usuario quitado puede volver con una invitación nueva | > 698 \|     await removeMember(owner, pet.id, accepter.id).expect(204); / expected 204 "No Content", got 500 "Internal Server Error" |
| 21 (2379a015) | #211 R16: pet members API › #211 R13: un family recibe el mismo 403 si el objetivo es otro family | > 723 \|       expect(response.status).toBe(403); / Expected: 403 / Received: 500 |
| 21 (2379a015) | #211 R16: pet members API › #211 R13: un family recibe el mismo 403 si el objetivo es el owner | > 723 \|       expect(response.status).toBe(403); / Expected: 403 / Received: 500 |
| 21 (2379a015) | #211 R16: pet members API › #211 R13: un family recibe el mismo 403 si el objetivo es un UUID sin usuario | > 723 \|       expect(response.status).toBe(403); / Expected: 403 / Received: 500 |
| 21 (2379a015) | #211 R16: pet members API › #211 R14: responde el mismo 404 si el objetivo no es UUID (owner) | > 745 \|     expect(response.status).toBe(404); / Expected: 404 / Received: 500 |
| 21 (2379a015) | #211 R16: pet members API › #211 R14: responde el mismo 404 si el objetivo no es UUID (family) | > 745 \|     expect(response.status).toBe(404); / Expected: 404 / Received: 500 |
| 21 (2379a015) | #211 R16: pet members API › #211 R14: responde el mismo 404 si el objetivo es un UUID sin usuario | > 745 \|     expect(response.status).toBe(404); / Expected: 404 / Received: 500 |
| 21 (2379a015) | #211 R16: pet members API › #211 R14: responde el mismo 404 si el objetivo es un usuario sin membresía | > 745 \|     expect(response.status).toBe(404); / Expected: 404 / Received: 500 |
| 21 (2379a015) | #211 R16: pet members API › #211 R15: el owner no puede quitarse a sí mismo | > 757 \|     expect(response.status).toBe(409); / Expected: 409 / Received: 500 |
| 21 (2379a015) | #211 R16: pet members API › #211 R15: el owner no puede quitar a otro owner | > 767 \|     expect(response.status).toBe(409); / Expected: 409 / Received: 500 |
| 21 (2379a015) | #211 R16: pet members API › #211 R21: el miembro quitado pierde la mascota, el push y la lista | > 782 \|     await removeMember(owner, pet.id, accepter.id).expect(204); / expected 204 "No Content", got 500 "Internal Server Error" |
| 23 (5fdd75b6) | #211 R16: pet members API › #211 R19: auditar pet_invite.create deja su fila exacta | > 862 \|       expect(rows).toHaveLength(1); / Expected length: 1 / Received length: 0 |
| 23 (5fdd75b6) | #211 R16: pet members API › #211 R19: auditar pet_invite.revoke deja su fila exacta | > 862 \|       expect(rows).toHaveLength(1); / Expected length: 1 / Received length: 0 |
| 23 (5fdd75b6) | #211 R16: pet members API › #211 R19: auditar pet_invite.accept deja su fila exacta | > 862 \|       expect(rows).toHaveLength(1); / Expected length: 1 / Received length: 0 |
| 23 (5fdd75b6) | #211 R16: pet members API › #211 R19: auditar pet_member.remove deja su fila exacta | > 862 \|       expect(rows).toHaveLength(1); / Expected length: 1 / Received length: 0 |
| 23 (5fdd75b6) | #211 R16: pet members API › #211 R19: el meta de las 4 acciones no contiene el código ni su hash | > 880 \|     expect(rows).toHaveLength(4); / Expected length: 4 / Received length: 0 |
| 25 (03e832a5) | #211 R16: pet members API › #211 R19: un accept con 404 no audita | > 918 \|       expect(rows).toHaveLength(0); / Expected length: 0 / Received length: 1 |
| 25 (03e832a5) | #211 R16: pet members API › #211 R19: un accept con 409 no audita | > 918 \|       expect(rows).toHaveLength(0); / Expected length: 0 / Received length: 1 |

### R19: mutación y reversión exacta

- 23: cuatro `toHaveLength(1)` y un `toHaveLength(4)` recibieron 0; otros 69 E2E verdes.
- 24: cuatro acciones auditan tras el éxito; 74 E2E verdes.
- 25: mutación versionada como primera línea de execute, audit.record con entityId = userId y meta = {}. Solo los dos its nuevos 404/409 fallaron: `expect(rows).toHaveLength(0)`, recibido 1. Otros 74 E2E verdes, incluidos los cinco de auditoría que filtran por action + entity_id.
- 26: archivo restaurado exactamente al del 24. `git diff fde4820e -- src/modules/pet-members/application/use-cases/accept-pet-invite.use-case.ts` vacío, exit 0. Los 76 E2E y 22 unitarios de la feature verdes.

### R1–R21 a tests y commits

| Requisito | Test (archivo::nombre) | Rojo y verde |
|---|---|---|
| R1 | `src/db/schema/pet-invites.schema.spec.ts::#211 R1: pet_invites tiene exactamente las 10 columnas declaradas`<br>`src/db/schema/pet-invites.schema.spec.ts::#211 R1: code_hash es char(64) NOT NULL único y role tiene su CHECK`<br>`src/db/schema/pet-invites.schema.spec.ts::#211 R1: la migración generada crea tabla, unique, check, FKs e índices` | `33d4b890 test(db): pet_invites table and its migration (R1)` / `769f46df feat(db): pet_invites table with generated migration (R1)` |
| R2 | `src/modules/pet-members/application/invite-code.spec.ts::#211 R2: generateInviteCode da 10 caracteres del alfabeto de 30`<br>`src/modules/pet-members/application/invite-code.spec.ts::#211 R2: normalizeInviteCode acepta minúsculas, espacios y guiones`<br>`src/modules/pet-members/application/invite-code.spec.ts::#211 R2: normalizeInviteCode devuelve null para %s`<br>`src/modules/pet-members/application/invite-code.spec.ts::#211 R2: hashInviteCode es SHA-256 hex` | `ce507984 test(pet-members): invite code format, normalization and hash (R2)` / `2807d2e3 feat(pet-members): invite code (R2)` |
| R3 | `src/modules/pet-members/application/use-cases/create-pet-invite.use-case.spec.ts::#211 R3: expiresAt es now + 72 h`<br>`test/pet-members.e2e-spec.ts::#211 R3: crea la invitación, devuelve el código una vez y guarda solo su hash` | `0dd15da6 test(pet-members): create invite (R3)` / `99aa8f30 feat(pet-members): create invite (R3)` |
| R4 | `test/pet-members.e2e-spec.ts::#211 R4: la sexta pendiente responde PET_INVITES_LIMIT y no crea fila`<br>`test/pet-members.e2e-spec.ts::#211 R4: una invitación revocada libera su plaza`<br>`test/pet-members.e2e-spec.ts::#211 R4: una invitación expirada libera su plaza`<br>`test/pet-members.e2e-spec.ts::#211 R4: con 9 miembros activos se crea una y la siguiente responde PET_MEMBERS_LIMIT`<br>`test/pet-members.e2e-spec.ts::#211 R4: con ambos límites alcanzados gana PET_INVITES_LIMIT` | `341cb1c2 test(pet-members): invite and member limits (R4)` / `83df0dd2 feat(pet-members): per-pet limits (R4)` |
| R5 | `test/pet-members.e2e-spec.ts::#211 R5: lista solo las pendientes, de la más nueva a la más vieja, sin código` | `d005debf test(pet-members): list pending invites (R5)` / `37f1821c feat(pet-members): list pending invites (R5)` |
| R6 | `test/pet-members.e2e-spec.ts::#211 R6: revocar responde 204 y fija revoked_at`<br>`test/pet-members.e2e-spec.ts::#211 R6: responde el mismo 404 si la invitación %s` | `214a96dc test(pet-members): revoke invite (R6)` / `7d3229d5 feat(pet-members): revoke invite (R6)` |
| R7 | `test/pet-members.e2e-spec.ts::#211 R7: aceptar crea la membresía family activa y responde { petId, role }`<br>`test/pet-members.e2e-spec.ts::#211 R7: la invitación aceptada guarda accepted_by y accepted_at`<br>`test/pet-members.e2e-spec.ts::#211 R7: acepta el código en minúsculas y con guion` | `62b8e563 test(pet-members): accept invite (R7,R8,R9,R20)` / `ee0320de feat(pet-members): accept invite (R7,R8,R9)` |
| R8 | `src/modules/pet-members/application/use-cases/accept-pet-invite.use-case.spec.ts::#211 R8: un código que no normaliza no consulta el repositorio`<br>`test/pet-members.e2e-spec.ts::#211 R8: responde el mismo 404 si el código %s`<br>`test/pet-members.e2e-spec.ts::#211 R8: responde 400 con el cuerpo %j` | `62b8e563 test(pet-members): accept invite (R7,R8,R9,R20)` / `ee0320de feat(pet-members): accept invite (R7,R8,R9)` |
| R9 | `test/pet-members.e2e-spec.ts::#211 R9: el owner que acepta su propio código recibe 409 y la invitación sigue pendiente`<br>`test/pet-members.e2e-spec.ts::#211 R9: un family que acepta otro código de la misma mascota recibe 409 y conserva su rol` | `62b8e563 test(pet-members): accept invite (R7,R8,R9,R20)` / `ee0320de feat(pet-members): accept invite (R7,R8,R9)` |
| R10 | `src/modules/pet-members/infrastructure/guards/invite-accept-rate-limit.guard.spec.ts::#211 R10: deja pasar 10 peticiones del mismo usuario y la 11.ª lanza 429`<br>`src/modules/pet-members/infrastructure/guards/invite-accept-rate-limit.guard.spec.ts::#211 R10: el contador es por usuario`<br>`src/modules/pet-members/infrastructure/guards/invite-accept-rate-limit.guard.spec.ts::#211 R10: la ventana se reabre a los 3 600 000 ms y no antes`<br>`test/pet-members.e2e-spec.ts::#211 R10: la 11.ª petición en la hora responde 429 aunque el código sea válido`<br>`test/pet-members.e2e-spec.ts::#211 R10: otro usuario no hereda el contador` | `e158a41b test(pet-members): accept rate limit (R10)` / `3b40b20c feat(pet-members): accept rate limit (R10)` |
| R11 | `test/pet-members.e2e-spec.ts::#211 R11: owner y family ven la misma lista ordenada por alta, sin email` | `066e3960 test(pet-members): list members (R11)` / `c40c0e6b feat(pet-members): list members (R11)` |
| R12 | `test/pet-members.e2e-spec.ts::#211 R12: el owner quita a un family con 204 y su fila desaparece`<br>`test/pet-members.e2e-spec.ts::#211 R12: un family se quita a sí mismo con 204 y su fila desaparece`<br>`test/pet-members.e2e-spec.ts::#211 R12: el usuario quitado puede volver con una invitación nueva` | `2379a015 test(pet-members): remove members (R12,R13,R14,R15,R21)` / `f7d62fcd feat(pet-members): remove members (R12,R13,R14,R15)` |
| R13 | `src/modules/pet-members/application/use-cases/remove-pet-member.use-case.spec.ts::#211 R13: un no owner sobre otro usuario no llama a findMembership`<br>`test/pet-members.e2e-spec.ts::#211 R13: un family recibe el mismo 403 si el objetivo es %s` | `2379a015 test(pet-members): remove members (R12,R13,R14,R15,R21)` / `f7d62fcd feat(pet-members): remove members (R12,R13,R14,R15)` |
| R14 | `test/pet-members.e2e-spec.ts::#211 R14: responde el mismo 404 si el objetivo %s` | `2379a015 test(pet-members): remove members (R12,R13,R14,R15,R21)` / `f7d62fcd feat(pet-members): remove members (R12,R13,R14,R15)` |
| R15 | `test/pet-members.e2e-spec.ts::#211 R15: el owner no puede quitarse a sí mismo`<br>`test/pet-members.e2e-spec.ts::#211 R15: el owner no puede quitar a otro owner` | `2379a015 test(pet-members): remove members (R12,R13,R14,R15,R21)` / `f7d62fcd feat(pet-members): remove members (R12,R13,R14,R15)` |
| R16 | `test/pet-members.e2e-spec.ts::#211 R16: un no miembro recibe 404 en %s %s`<br>`test/pet-members.e2e-spec.ts::#211 R16: un petId inexistente da el mismo 404 en %s %s`<br>`test/pet-members.e2e-spec.ts::#211 R16: un petId que no es UUID da el mismo 404 en %s %s` | `4e53c084 test(pet-members): authorization on the 6 routes (R16,R17,R18)` / `28f41e63 feat(pet-members): module, routes and guards (R16,R17,R18)` |
| R17 | `test/pet-members.e2e-spec.ts::#211 R17: un family recibe 403 en %s %s` | `4e53c084 test(pet-members): authorization on the 6 routes (R16,R17,R18)` / `28f41e63 feat(pet-members): module, routes and guards (R16,R17,R18)` |
| R18 | `test/pet-members.e2e-spec.ts::#211 R18: sin token responde 401 en %s %s` | `4e53c084 test(pet-members): authorization on the 6 routes (R16,R17,R18)` / `28f41e63 feat(pet-members): module, routes and guards (R16,R17,R18)` |
| R19 | `test/pet-members.e2e-spec.ts::#211 R19: auditar %s deja su fila exacta`<br>`test/pet-members.e2e-spec.ts::#211 R19: el meta de las 4 acciones no contiene el código ni su hash`<br>`test/pet-members.e2e-spec.ts::#211 R19: un accept con %s no audita` | `5fdd75b6 test(pet-members): audit the 4 actions (R19)` / `fde4820e feat(pet-members): audit the 4 actions (R19)` / `03e832a5 test(pet-members): failed accept is not audited (R19)` / `3639b7af feat(pet-members): audit only successful accepts (R19)` |
| R20 | `test/pet-members.e2e-spec.ts::#211 R20: el nuevo family lista la mascota, la lee, no la edita y recibe push` | `62b8e563 test(pet-members): accept invite (R7,R8,R9,R20)` / `ee0320de feat(pet-members): accept invite (R7,R8,R9)` |
| R21 | `test/pet-members.e2e-spec.ts::#211 R21: el miembro quitado pierde la mascota, el push y la lista` | `2379a015 test(pet-members): remove members (R12,R13,R14,R15,R21)` / `f7d62fcd feat(pet-members): remove members (R12,R13,R14,R15)` |

### Desviaciones, límites y entrega

- Se conservan arriba las desviaciones previas: primer comando literal tras leer el handoff; lecturas ENOENT de referencias/logs; falso positivo de pgrep por el nombre del harness dentro del propio shell; corrección del nuevo test de registro push al contrato 200; parada Prettier; parada TS2322. Las reanudaciones aplicaron exactamente las excepciones del leader. target:string no cambió aserciones; contadores exigidos 2 y 0. No se necesitaron más correcciones TS2322 en 22–28.
- El intento inicial de 16 ejecutó E2E tras fallar formato; se documentó y se repitió la cadena completa al reanudar. Todas las validaciones definitivas del código pasan.
- El generador de documentación del 28 tuvo un falso positivo antes de escribir: una regex buscaba la palabra pendiente en cualquier parte de la fila y coincidió con títulos válidos de tests sobre invitaciones pendientes. Se corrigió a celdas exactamente iguales a pendiente, sin cambiar tests, hashes ni código.
- Ningún it nació verde en su rojo definitivo. R20: accept 500 en 15, verde con 16. R21: remove 500 en 21, verde con 22. R19 negativo usa la mutación versionada prescrita.
- Migración generada sin editar: CREATE pet_invites, 10 columnas, UNIQUE code_hash, CHECK family, tres FK (cascade/cascade/set null), tres índices; ninguna otra tabla cambia. Journal de archivos y base: 21 entradas/filas; una migración pet_invites.
- Límites aprobados D4–D8: contador por proceso; conteo de creación no serializable; colisión de código sin reintento; posible conflicto PK al aceptar simultáneamente dos códigos para un usuario en una mascota.
- Sin dependencias ni variables de entorno nuevas; sin lectura de secretos. No se ejecutaron init.sh, push, PR, merge, rebase, AWS real ni cdk deploy. El harness, E2E completo e integración en dev corresponden al leader; main no se toca. feature_list.json, STATUS.md y progress/current.md/history.md permanecen intactos.
- El marcador de la primera parada fue retirado por el leader. Se recrea solo al cerrar los 28 commits, como última acción, con la ruta absoluta del reporte. Está ignorado y no entra en el commit 28.

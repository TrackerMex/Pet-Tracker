---
feature: "pet-members-api"
status: draft        # draft | approved
tags: [harness, spec, backend, pets]
---

# Tareas — [[pet-members-api]] (#211)

> Disciplina TDD (`CHECKPOINTS.md` C4). Cada requisito de [[requirements]]
> tiene su bloque (1) test rojo, (2) implementación mínima, (3) refactor. Los
> commits van **test primero**: el commit rojo y el verde son commits
> distintos, en el orden de la tabla. `B=backend-pet-tracker`,
> `M=B/src/modules/pet-members`.

## Reglas de la cadena

1. **Mide la base antes del primer commit.** Corre las anclas A1–A34 de
   [[requirements]] y apunta la salida de cada una en
   `progress/impl_pet-members-api.md`. Si alguna difiere, **para** y avisa ahí
   mismo; no adaptes la spec.
2. **Rojo por aserción, nunca por excepción.** ts-jest compila con
   diagnósticos, así que un import de un símbolo que no existe tumba la suite
   entera con un error de compilación, y eso no cuenta como rojo. Por eso
   cada commit rojo trae los **stubs** que la tabla indica, para que el test
   compile y falle en un `expect`. Reglas concretas:
   - Los `execute` stub lanzan `new Error('Not implemented')`. Los its
     unitarios de casos de uso abren con `await expect(…).resolves…` o con
     `await expect(…).rejects.toBeInstanceOf(<ErrorDeDominio>)`, de modo que
     el stub falla por aserción.
   - El test de R1 aserta `expect(column).toBeDefined()` antes de leer
     propiedades de una columna.
3. **Candados contra literales.** Ningún test usa un símbolo de producción
   como **valor esperado**, sea `MAX_*`, `INVITE_TTL_MS`, `INVITE_ACCEPT_*` o
   `hashInviteCode` para calcular el hash esperado. En su lugar usa el
   literal de la spec (`259200000`, `10`, `3_600_000`, `5`) o
   `createHash('sha256')` de `node:crypto` en el propio test. Los its de R2
   llaman a las funciones de `invite-code.ts` porque son su sujeto, y aun así
   comparan contra literales.
4. **E2E: un aceptante nuevo por it.** Ningún usuario pasa de 9 peticiones a
   `POST /v1/invites/accept`, salvo en los dos its de R10, porque el guard de
   R10 se activa en el commit 18 y no puede tumbar its anteriores. Si un it
   necesita «el owner acepta su propio código», ese it siembra su propio owner
   y su propia mascota.
5. **Estados de invitación con `db.update(petInvites)`.** Aceptada, revocada
   o expirada se fijan así (con `import { petInvites } from '@/db/schema'`),
   nunca encadenando endpoints. Así cada it de un estado depende solo de R3.
6. **Lo que entra con su propio R, no en el esqueleto.** El commit 6 no trae
   el check de UUID de `:inviteId`/`:userId` (entra con R6/R14), ni
   `parseBody` del accept (R8), ni `@UseGuards(InviteAcceptRateLimitGuard)`
   (R10), ni ninguna llamada a `audit.record` (R19).
7. **Prefijo** `#211 R<n>:` en cada `describe`/`it` nuevo.
8. **Por commit**, sobre los ficheros tocados:
   - `pnpm -C backend-pet-tracker exec prettier --write <ficheros>`
   - `pnpm -C backend-pet-tracker exec eslint <ficheros>`
9. **No corras `./init.sh`.** Lo corre el leader al cerrar.
10. **Mide los exit codes sin pipe**: `cmd > log 2>&1; echo $?`, nunca
    `cmd | tail`.
11. **Comandos de test** (el `--` de `pnpm run` llega a jest; no lo uses):
    - unitarios:
      `pnpm -C backend-pet-tracker exec jest src/modules/pet-members src/db/schema/pet-invites.schema.spec.ts`
    - e2e (necesita Postgres migrado):
      `pnpm -C backend-pet-tracker exec jest --config ./test/jest-e2e.json pet-members`
    - tipos:
      `pnpm -C backend-pet-tracker exec tsc --noEmit -p tsconfig.json`
12. **Tras el verde de R1** corre
    `pnpm -C backend-pet-tracker run db:migrate` para que el e2e vea la tabla.
    Nunca uses `psql` crudo.
13. **Migración**: solo con drizzle-kit, y si choca con #210/#212 se sigue
    [[design]] D17 (merge, nunca rebase).
14. **Trazabilidad**: tras cada commit verde, rellena su fila en
    [[traceability]] con el hash y el mensaje. No rebasees después, porque
    los hashes caducan.

## Cadena de commits

| # | Mensaje | Contenido | Rojo esperado (por aserción) |
|---|---|---|---|
| 1 | `test(db): tabla pet_invites y su migración (R1)` | `pet-invites.schema.spec.ts` + stub `pet-invites.schema.ts` con **solo** `id` (sin tocar el barrel) | columnas `['id']` ≠ las 10; `code_hash` `toBeDefined` falla; 0 ficheros casan la regex |
| 2 | `feat(db): tabla pet_invites con migración generada (R1)` | schema completo, línea en el barrel, `drizzle-kit generate --name pet_invites` | — (verde) |
| 3 | `test(pet-members): formato, normalización y hash del código (R2)` | `invite-code.spec.ts` + stub `invite-code.ts`: `generateInviteCode` → `''`, `normalizeInviteCode` → el input sin tocar, `hashInviteCode` → `''` | regex no casa `''`; normalización ≠; las 10 filas `null` reciben un string; hash ≠ literal |
| 4 | `feat(pet-members): código de invitación (R2)` | `invite-code.ts` real | — |
| 5 | `test(pet-members): autorización de las 6 rutas (R16,R17,R18)` | crea `B/test/pet-members.e2e-spec.ts` con arranque y helpers copiados (design §tests e2e) | rutas inexistentes: el 404 de Nest (`Cannot POST …`) ≠ E-404, ≠ 403 y ≠ 401 |
| 6 | `feat(pet-members): módulo, rutas y guards (R16,R17,R18)` | esqueleto completo (ver bloque R16) | — |
| 7 | `test(pet-members): crear invitación (R3)` | E2E R3 + `create-pet-invite.use-case.spec.ts` | 500 del stub ≠ 201; `.resolves` recibe rechazo |
| 8 | `feat(pet-members): crear invitación (R3)` | `createInvite`, caso de uso, respuesta del controller | — |
| 9 | `test(pet-members): límites de invitaciones y miembros (R4)` | 5 its E2E | la sexta da 201 ≠ 409; la precondición 409 falla |
| 10 | `feat(pet-members): límites por mascota (R4)` | `countSlots`, checks, mapper | — |
| 11 | `test(pet-members): listar invitaciones pendientes (R5)` | E2E R5 | 500 ≠ 200 |
| 12 | `feat(pet-members): listar invitaciones pendientes (R5)` | `listPendingInvites`, caso de uso, controller | — |
| 13 | `test(pet-members): revocar invitación (R6)` | 2 its E2E | 500 ≠ 204 / ≠ E-404 |
| 14 | `feat(pet-members): revocar invitación (R6)` | `revokeInvite`, UUID en controller, mapper | — |
| 15 | `test(pet-members): aceptar invitación (R7,R8,R9,R20)` | E2E R7, R8, R9, R20 + `accept-pet-invite.use-case.spec.ts` | 500 ≠ 201/404/409/400; `rejects.toBeInstanceOf` recibe `Error` |
| 16 | `feat(pet-members): aceptar invitación (R7,R8,R9)` | `acceptInvite` (D8), caso de uso, `parseBody`, mapper | — |
| 17 | `test(pet-members): rate limit del accept (R10)` | `invite-accept-rate-limit.guard.spec.ts` + stub del guard (`canActivate` → `true`, constantes exportadas) + 2 its E2E | la 11.ª no lanza; la 11.ª E2E da 201 ≠ 429 |
| 18 | `feat(pet-members): rate limit del accept (R10)` | guard real, `@UseGuards` en `accept`, provider en el módulo | — |
| 19 | `test(pet-members): listar miembros (R11)` | E2E R11 | 500 ≠ 200 |
| 20 | `feat(pet-members): listar miembros (R11)` | `listMembers`, caso de uso, controller | — |
| 21 | `test(pet-members): quitar miembros (R12,R13,R14,R15,R21)` | E2E R12–R15, R21 + `remove-pet-member.use-case.spec.ts` | 500 ≠ 204/403/404/409; `rejects.toBeInstanceOf` recibe `Error` |
| 22 | `feat(pet-members): quitar miembros (R12,R13,R14,R15)` | caso de uso (D12), `deleteMembership`, UUID en controller, mapper | — |
| 23 | `test(pet-members): auditoría de las 4 acciones (R19)` | `it.each` de las 4 acciones + it del `meta` | 0 filas ≠ 1; `toHaveLength(4)` falla |
| 24 | `feat(pet-members): auditar las 4 acciones (R19)` | `audit.record` tras el éxito en los 4 casos de uso | — |
| 25 | `test(pet-members): accept fallido no audita (R19)` | `it.each` `'404'`/`'409'` + **mutación de producción** (bloque R19) | la fila mutada aparece: longitud 1 ≠ 0 |
| 26 | `feat(pet-members): auditar solo el accept con éxito (R19)` | revierte la mutación | — |
| 27 | `docs(data-model): tabla pet_invites` | `docs/data-model.md` (design §docs) | sin R-id |

Los commits `refactor(pet-members): … (R<n>)` son opcionales. Van justo
después del verde de su R y con todos los tests verdes.

Al terminar, `progress/impl_pet-members-api.md` lleva tres cosas:
- la base medida;
- la tabla «commit, test, rojo observado», con la línea del `expect` que
  falló;
- la cuenta final:
  `grep -rlF "function parseBody<T>(schema: ZodType<T>, body: unknown): T {" B/src | wc -l`
  → `13`.

## R1 — tabla `pet_invites` y su migración generada

- [ ] (1) Commit 1. Crea `B/src/db/schema/pet-invites.schema.spec.ts` con
  los 3 its de R1. El de la migración sigue el patrón de
  `B/src/db/schema/media.schema.spec.ts` (`readdirSync`/`readFileSync` sobre
  el directorio de migraciones). Crea también el stub
  `B/src/db/schema/pet-invites.schema.ts` con
  `pgTable('pet_invites', { id: uuid('id').primaryKey() })`, **fuera** del
  barrel. Rojo: los 3 its fallan por aserción.
- [ ] (2) Commit 2. Completa el schema según R1 y [[design]] (Datos). Añade
  `export * from './pet-invites.schema';` en el barrel entre A24 y A25, y
  luego genera la migración:
  `cd backend-pet-tracker && pnpm exec drizzle-kit generate --name pet_invites`.
  El commit incluye el `.sql`, el snapshot y el journal generados, sin
  editarlos. Después corre `pnpm -C backend-pet-tracker run db:migrate`.
  Comprobaciones:
  - `grep -c '"tag"' B/src/db/migrations/meta/_journal.json` → `21`;
  - `ls B/src/db/migrations | grep -c '_pet_invites\.sql$'` → `1`.
- [ ] (3) Refactor (si aplica)

## R2 — formato, normalización y hash del código

- [ ] (1) Commit 3. Crea `M/application/invite-code.spec.ts` con los 4 its
  de R2. El `it.each` de `null` lleva exactamente las 10 filas listadas. Crea
  el stub `M/application/invite-code.ts`, que exporta las 3 funciones y las 3
  constantes con su valor final y cuyas funciones son las de la tabla de
  commits.
- [ ] (2) Commit 4. Implementa con `randomInt` y `createHash` de
  `node:crypto` (D2, D3). `normalizeInviteCode` hace
  `input.replace(/[\s-]/g, '').toUpperCase()` y luego comprueba la regex.
- [ ] (3) Refactor (si aplica)

## R3 — crear invitación

- [ ] (1) Commit 7. Escribe el it E2E de R3 y
  `M/application/use-cases/create-pet-invite.use-case.spec.ts`. Los dobles se
  construyen con `{ … } as unknown as PetMemberRepository` y
  `{ record: jest.fn() } as unknown as AuditLogger`, como en
  `claim-device.use-case.spec.ts`. El it aserta
  `createInvite` `toHaveBeenCalledWith(expect.objectContaining({ createdAt,
  expiresAt, codeHash }))` contra los literales de R3.
- [ ] (2) Commit 8. Implementa:
  - `PetMemberDrizzleRepository.createInvite`, con `id: uuidv7()` y
    `.returning()`;
  - `CreatePetInviteUseCase.execute`, que hace `generateInviteCode`, luego
    `hashInviteCode` y luego `createInvite`, con `expiresAt = new
    Date(now.getTime() + INVITE_TTL_MS)`, y devuelve `{ invite, code }`. Aún
    no aplica límites ni audita;
  - el controller `create`, que pasa `new Date()` y responde las 5 claves.
- [ ] (3) Refactor (si aplica)

## R4 — límites por mascota

- [ ] (1) Commit 9. Escribe los 5 its E2E de R4. En los its de «revocada» y
  «expirada», aserta la precondición (la sexta da E-INVITES-LIMIT) **antes**
  del `db.update`.
- [ ] (2) Commit 10. Implementa:
  - `countSlots`: un `count` de pendientes (definición de [[requirements]])
    y un `count` de `pet_users` activos;
  - en `CreatePetInviteUseCase`: `if (pendingInvites >= 5) throw new
    PendingInvitesLimitError()`, luego `if (activeMembers + pendingInvites
    >= 10) throw new PetMembersLimitError()`;
  - `mapPetMemberError`, con estas dos entradas;
  - el `create` del controller, con `try/catch` y `throw
    mapPetMemberError(error)`, como `devices.controller.ts`.
- [ ] (3) Refactor (si aplica)

## R5 — listar invitaciones pendientes

- [ ] (1) Commit 11. Escribe el it E2E de R5. Crea A…E por la API **en
  secuencia**, con `await` entre una y otra, para que `created_at` sea
  estrictamente creciente. El orden esperado de la lista es `[E.id, A.id]`.
- [ ] (2) Commit 12. Implementa:
  - `listPendingInvites`, con `orderBy(desc(createdAt), desc(id))`;
  - `ListPetInvitesUseCase`;
  - el `list` del controller, que responde las 4 claves.
- [ ] (3) Refactor (si aplica)

## R6 — revocar invitación

- [ ] (1) Commit 13. Escribe los 2 its E2E de R6. Para la rama
  «es de otra mascota», el mismo owner crea una segunda mascota con su propia
  invitación y la revoca desde la ruta de la primera. Después esa invitación
  sigue con `revoked_at` nulo.
- [ ] (2) Commit 14. Implementa:
  - `revokeInvite`, que hace `UPDATE … SET revoked_at = now WHERE id AND
    pet_id AND pendiente RETURNING id` y devuelve `rows.length === 1`;
  - `RevokePetInviteUseCase`, que lanza `PetInviteNotFoundError` si recibe
    `false`;
  - en el controller, `z.uuid().safeParse(inviteId)`: si falla, lanza
    `new NotFoundException()` sin llamar al caso de uso;
  - la entrada del mapper.
- [ ] (3) Refactor (si aplica)

## R7 — aceptar crea la membresía `family`

- [ ] (1) Commit 15, junto con R8, R9 y R20. Escribe los 3 its E2E de R7.
- [ ] (2) Commit 16. Implementa:
  - `acceptInvite`, con la transacción D8 (`.for('update')`);
  - `AcceptPetInviteUseCase.execute`, que normaliza y hashea, luego llama a
    `acceptInvite`, y traduce `not_acceptable` a `InviteNotAcceptableError` y
    `already_member` a `AlreadyPetMemberError`. Si el resultado es
    `accepted`, devuelve `{ petId: invite.petId, role: 'family' }`;
  - el `accept` del controller: `@Body() body: unknown` más
    `parseBody(AcceptInviteSchema, body)`, `try/catch` con el mapper, y 201.
- [ ] (3) Refactor (si aplica)

## R8 — código no aceptable y cuerpo inválido

- [ ] (1) Commit 15. Escribe los 2 `it.each` E2E de R8 y
  `M/application/use-cases/accept-pet-invite.use-case.spec.ts`. El it unit
  llama a `execute('abc', …)` y aserta dos cosas: `rejects.toBeInstanceOf(InviteNotAcceptableError)`
  y `acceptInvite` `not.toHaveBeenCalled()`.
  - **Esqueleto previo**: el `accept` del esqueleto (commit 6) recibe
    `@Body() body: { code: string }` y no valida. Por eso las 4 filas de 400
    reciben 500 en el rojo.
- [ ] (2) Commit 16. Si `normalizeInviteCode` devuelve `null`, el caso de uso
  lanza `InviteNotAcceptableError` antes de llamar al repositorio. El mapper
  incluye la entrada E-NOT-ACCEPTABLE.
- [ ] (3) Refactor (si aplica)

## R9 — ya miembro

- [ ] (1) Commit 15. Escribe los 2 its E2E de R9. El del owner siembra su
  propio owner y su propia mascota (regla 4).
- [ ] (2) Commit 16. La rama `already_member` de D8 no escribe nada. El mapper
  incluye la entrada E-ALREADY-MEMBER.
- [ ] (3) Refactor (si aplica)

## R10 — rate limit del accept

- [ ] (1) Commit 17. Escribe `M/infrastructure/guards/invite-accept-rate-limit.guard.spec.ts`
  con los 3 its de R10, siguiendo el patrón de
  `B/src/modules/auth/infrastructure/guards/email-rate-limit.guard.spec.ts`.
  Usa los literales `10` y `3_600_000`. Crea el stub
  `M/infrastructure/guards/invite-accept-rate-limit.guard.ts`, con
  `@Injectable()`, las 2 constantes y `canActivate` que devuelve `true`, y
  escribe los 2 its E2E. El stub **no** se cablea todavía.
  - **Espera del it de ventana**: es `jest.spyOn(Date, 'now')`, sin timers
    reales ni `setTimeout`.
- [ ] (2) Commit 18. Implementa el guard según D5, copiando `consume` y
  `pruneExpired` de A12/A13 sin `MAX_TRACKED_KEYS`. Añade
  `@UseGuards(InviteAcceptRateLimitGuard)` a `accept` y el guard a
  `providers` del módulo.
- [ ] (3) Refactor (si aplica)

## R11 — listar miembros

- [ ] (1) Commit 19. Escribe el it E2E de R11. Los dos aceptantes aceptan en
  secuencia, con `await`, para que `joinedAt` sea creciente. Además aserta
  `JSON.stringify(body)` `not.toContain` el email de cada uno de los 3.
- [ ] (2) Commit 20. Implementa:
  - `listMembers`, con `innerJoin(users)`, `status = 'active'` y
    `orderBy(asc(petUsers.createdAt), asc(petUsers.userId))`;
  - `ListPetMembersUseCase`;
  - el `list` del controller, que responde las 5 claves con `joinedAt` en
    `toISOString()`.
- [ ] (3) Refactor (si aplica)

## R12 — quitar a un miembro

- [ ] (1) Commit 21, junto con R13, R14, R15 y R21. Escribe los 3 its E2E de
  R12. En el de reingreso, el usuario quitado acepta una invitación nueva con
  201 y vuelve a tener fila `family` activa.
- [ ] (2) Commit 22. Implementa:
  - `RemovePetMemberUseCase.execute` según D12;
  - `deleteMembership`, que hace `DELETE FROM pet_users WHERE pet_id AND
    user_id`;
  - el `remove` del controller, con actor `{ userId: user.id, role:
    request.petMembership.role }`.
- [ ] (3) Refactor (si aplica)

## R13 — un no owner no quita a otros

- [ ] (1) Commit 21. Escribe el `it.each` E2E de R13 (3 filas) y
  `M/application/use-cases/remove-pet-member.use-case.spec.ts`, con
  `pets = { findMembership } as unknown as PetRepository`, como
  `claim-device.use-case.spec.ts`. El it aserta dos cosas:
  `rejects.toBeInstanceOf(MemberRemovalForbiddenError)` y `findMembership`
  `not.toHaveBeenCalled()`.
- [ ] (2) Commit 22. El paso 4 de D12 va antes de cualquier consulta. El
  mapper traduce el error a `new ForbiddenException()`.
- [ ] (3) Refactor (si aplica)

## R14 — objetivo inexistente o no UUID

- [ ] (1) Commit 21. Escribe el `it.each` E2E de R14 (4 filas).
- [ ] (2) Commit 22. Implementa el check de UUID de `:userId` en el
  controller (paso 3 de D12) y el paso 5 de D12. El mapper traduce
  `PetMemberNotFoundError` a `new NotFoundException()`.
- [ ] (3) Refactor (si aplica)

## R15 — un owner no es removible

- [ ] (1) Commit 21. Escribe los 2 its E2E de R15. En los dos, aserta además
  que la fila del owner objetivo sigue existiendo.
- [ ] (2) Commit 22. Implementa el paso 6 de D12. El mapper incluye la
  entrada E-OWNER.
- [ ] (3) Refactor (si aplica)

## R16 — no miembro: 404 en las 5 rutas

- [ ] (1) Commit 5. Crea `B/test/pet-members.e2e-spec.ts` con el arranque y
  los helpers (`seedUser`, `createPetViaApi`, `seedMembership` y `api`,
  copiados de `B/test/pets.e2e-spec.ts`; A33), `RUN_ID` y limpieza en
  `afterAll`. Añade los 3 `it.each` de R16, que cubren las 5 rutas.
- [ ] (2) Commit 6, el **esqueleto**. Contiene:
  - todo `M/domain/`, según [[design]];
  - los 6 casos de uso, con el constructor final y `execute` que lanza
    `new Error('Not implemented')`;
  - `AcceptInviteSchema`;
  - `PetMemberDrizzleRepository`, con los 7 métodos lanzando
    `new Error('Not implemented')`;
  - `mapPetMemberError`, que devuelve el error sin tocar;
  - los 3 controllers con sus rutas y guards de pets (`PetAccessGuard` y
    `@RequirePetRole('owner')` en las 3 de invites; solo `PetAccessGuard` en
    members). Cada método llama a su caso de uso con `new Date()`;
  - `PetMembersModule`;
  - `PetMembersModule,` en `app.module.ts`.

  Queda fuera del esqueleto todo lo de la regla 6.
- [ ] (3) Refactor (si aplica)

## R17 — family: 403 en las rutas de invitaciones

- [ ] (1) Commit 5. Escribe el `it.each` E2E de R17 (3 filas). Después lee
  con `db` que `pet_invites` no tiene filas de esa mascota.
- [ ] (2) Commit 6. `@RequirePetRole('owner')` en los 3 métodos de
  `PetInvitesController`.
- [ ] (3) Refactor (si aplica)

## R18 — sin token: 401 en las 6 rutas

- [ ] (1) Commit 5. Escribe el `it.each` E2E de R18 (6 filas).
- [ ] (2) Commit 6. Basta con que las rutas existan: el `AuthGuard` global
  hace el resto. No hace falta `@Public()` en ninguna.
- [ ] (3) Refactor (si aplica)

## R19 — auditoría

- [ ] (1a) Commit 23. Escribe el `it.each` de las 4 acciones y el it del
  `meta`. Cada fila lee `audit_log` (`import { auditLog } from
  '@/db/schema'`) filtrando por `action` **y** `entity_id`. Primero aserta
  `toHaveLength(1)` y después `toEqual` sobre los 5 campos.
- [ ] (2a) Commit 24. Llama a `await this.audit.record({…})` con los objetos
  exactos de R19, **después** de que el repositorio devuelva con éxito, en
  `CreatePetInvite`, `RevokePetInvite`, `AcceptPetInvite` y `RemovePetMember`.
- [ ] (1b) Commit 25. Escribe el `it.each` `'404'`/`'409'`. El aceptante es
  un usuario nuevo. En la fila `'409'`, es el owner de una mascota recién
  creada que acepta su propio código. El it vigila código ya correcto, así
  que el commit **versiona esta mutación** como primera línea de
  `AcceptPetInviteUseCase.execute`:
  ```ts
  await this.audit.record({ userId, action: 'pet_invite.accept', entity: 'pet_invite', entityId: userId, meta: {} });
  ```
  Las dos filas nuevas fallan por aserción, porque hay una fila con
  `userId` = aceptante. Los its de (1a) siguen verdes, porque filtran por
  `entity_id` = id de la invitación.
- [ ] (2b) Commit 26. Revierte exactamente esa línea. En
  `progress/impl_pet-members-api.md`, registra el rojo de (1b) y el verde de
  (2b).
- [ ] (3) Refactor (si aplica)

## R20 — el nuevo `family` usa los permisos existentes (verificación)

- [ ] (1) Commit 15. Escribe el it E2E de R20 en el orden de R20:
  1. el aceptante registra su token con `POST /v1/me/push-tokens`;
  2. `findActiveMembersTokens` aún **no** lo contiene;
  3. acepta;
  4. las 4 aserciones.

  Rojo: el accept responde 500.
- [ ] (2) Commit 16, con el verde de R7. No trae código propio.
- [ ] (3) Refactor (si aplica)

## R21 — el miembro quitado pierde acceso (verificación)

- [ ] (1) Commit 21. Escribe el it E2E de R21: alta por invitación, registro
  del token y comprobación de que aparece; luego baja por el owner y las 4
  aserciones. Rojo: el `DELETE` responde 500.
- [ ] (2) Commit 22, con el verde de R12. No trae código propio.
- [ ] (3) Refactor (si aplica)

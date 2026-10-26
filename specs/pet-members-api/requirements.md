---
feature: "pet-members-api"
status: draft        # draft | approved
tags: [harness, spec, backend, pets]
---

# Requisitos — [[pet-members-api]] (#211)

> Notación EARS. Cada requisito tiene id único R<n>, inmutable una vez aprobado.
> Ver [[design]] para las decisiones técnicas, [[tasks]] para el orden de
> commits y [[../../docs/architecture|architecture]] para las capas.
>
> **Base congelada**: `origin/main` `1316410f` (contenido idéntico a `dev` tras
> la sync). Toda cifra de esta spec se midió ahí. Las anclas se citan **por
> contenido** (`grep -cF '<literal>' <ruta>` con su salida), nunca por número
> de línea. Rutas desde la raíz del repo; `B=backend-pet-tracker`.
>
> **Prefijo**: todo `describe`/`it` nuevo lleva `#211 R<n>:` al inicio del
> título (`docs/conventions.md` §Prefijo de feature).
>
> **Decisiones del humano que esta spec no reabre** (plan
> `progress/plan_mejoras-producto-2026-10-26.md` §1 y §2, entrada 211):
> invitación por código + Share nativo (sin email, sin deep links, sin
> hosting); solo rol `family` en v1 (`walker`/`vet` siguen en el CHECK); la
> matriz de permisos, `PetAccessGuard` y `@RequirePetRole('owner')` no
> cambian.

## Contexto fijo (medido en la base)

| # | Comando (desde la raíz del repo) | Salida | Para qué |
|---|---|---|---|
| A1 | `grep -cF "export type PetRole = 'owner' \| 'family' \| 'walker' \| 'vet';" B/src/modules/pets/domain/entities/pet-membership.ts` | `1` | El tipo de rol no cambia |
| A2 | `grep -cF "'pet_users_role_check'," B/src/db/schema/pets.schema.ts` | `1` | El CHECK de `pet_users.role` no cambia |
| A3 | `grep -cF "exports: [PET_REPOSITORY, PetAccessGuard]" B/src/modules/pets/pets.module.ts` | `1` | `PetMembersModule` importa `PetsModule` y reutiliza ambos |
| A4 | `grep -cF "findMembership(petId: string, userId: string): Promise<PetMembership \| null>;" B/src/modules/pets/domain/repositories/pet.repository.ts` | `1` | R12–R15 consultan la membresía del objetivo con este método |
| A5 | `grep -cF "export interface PetAccessRequest" B/src/modules/pets/infrastructure/guards/pet-access.guard.ts` | `1` | Los controllers leen `request.petMembership` |
| A6 | `grep -cF "throw new NotFoundException();" B/src/modules/pets/infrastructure/guards/pet-access.guard.ts` | `2` | Cuerpo 404 genérico de R16 |
| A7 | `grep -cF "throw new ForbiddenException();" B/src/modules/pets/infrastructure/guards/pet-access.guard.ts` | `1` | Cuerpo 403 de R17 |
| A8 | `grep -cF "[context.getHandler(), context.getClass()]" B/src/modules/pets/infrastructure/guards/pet-access.guard.ts` | `1` | `@RequirePetRole` vale en método o en clase |
| A9 | `grep -cF "export const AUDIT_LOGGER = Symbol('AuditLogger');" B/src/audit/audit-log.repository.ts` | `1` | Puerto de auditoría (R19) |
| A10 | `grep -cF "@Global()" B/src/audit/audit.module.ts` | `1` | `AUDIT_LOGGER` se inyecta sin importar `AuditModule` |
| A11 | `grep -cF "@Post('claim')" B/src/modules/devices/infrastructure/devices.controller.ts` | `1` | Patrón de ruta sin `:petId` que replica la autorización en el caso de uso |
| A12 | `grep -cF "export const EMAIL_RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;" B/src/modules/auth/infrastructure/guards/email-rate-limit.guard.ts` | `1` | Patrón de ventana fija que copia R10 |
| A13 | `grep -cF "if (current.count >= maximum) {" B/src/modules/auth/infrastructure/guards/email-rate-limit.guard.ts` | `1` | Semántica del límite que copia R10 |
| A14 | `grep -cF "async findActiveMembersTokens(petId: string): Promise<string[]> {" B/src/modules/users/infrastructure/repositories/push-token.drizzle.repository.ts` | `1` | Push a todo miembro activo (R20, R21) |
| A15 | `grep -cF "R8: INNER JOIN con" B/src/modules/users/infrastructure/repositories/push-token.drizzle.repository.ts` | `1` | Ese join no filtra por rol |
| A16 | `grep -cF "export const PUSH_TOKEN_REPOSITORY" B/src/modules/users/domain/repositories/push-token.repository.ts` | `1` | El e2e de R20/R21 lo obtiene con `app.get` |
| A17 | `grep -cF "exports: [PUSH_TOKEN_REPOSITORY]," B/src/modules/users/users.module.ts` | `1` | Idem |
| A18 | `grep -cF "this.pushTokens.findActiveMembersTokens(petId)" B/src/workers/notifier/notifier-consumer.service.ts` | `1` | El notifier usa ese método: un `family` nuevo recibe push |
| A19 | `grep -cF "@Post('push-tokens')" B/src/modules/users/infrastructure/users.controller.ts` | `1` | El e2e registra el token por la API (`POST /v1/me/push-tokens`) |
| A20 | `grep -cF "this.subscriptions.isPetTracked(petId)" B/src/modules/subscriptions/infrastructure/guards/pet-tracking.guard.ts` | `1` | Mapa: depende del collar, no del rol (efecto declarado, sin test) |
| A21 | `grep -cF "eq(petUsers.status, ACTIVE_STATUS)" B/src/modules/alerts/infrastructure/repositories/alert.drizzle.repository.ts` | `2` | Alertas: miembro activo, sin rol (efecto declarado, sin test) |
| A22 | `grep -cF "myRole: PetRole;" B/src/modules/pets/infrastructure/mappers/pet-profile-response.mapper.ts` | `1` | Campo que asevera R20 |
| A23 | `grep -cF "@RequirePetRole('owner')" B/src/modules/pets/infrastructure/pets.controller.ts` | `3` | `PATCH /v1/pets/:petId` es solo owner (R20) |
| A24 | `grep -cF "export * from './password-reset-tokens.schema';" B/src/db/schema/index.ts` | `1` | La nueva línea del barrel va justo después |
| A25 | `grep -cF "export * from './pets.schema';" B/src/db/schema/index.ts` | `1` | …y justo antes de esta |
| A26 | `grep -c '"tag"' B/src/db/migrations/meta/_journal.json` | `20` | Última: `0019_pet_documents_uploaded_at` |
| A27 | `ls B/src/db/migrations \| grep -c '^0020_'` | `0` | Número libre hoy (ver R1 sobre colisión) |
| A28 | `grep -rlF "pet_invites" B/src B/test \| wc -l` | `0` | Nada previo que choque |
| A29 | `grep -rliF "invite" B/src B/test \| wc -l` | `0` | Idem |
| A30 | `grep -rn "randomInt" B/src \| wc -l` | `0` | `randomInt` de `node:crypto` es uso nuevo, no dependencia nueva |
| A31 | `grep -cF "throttler" B/package.json` | `0` | No hay rate limiter instalado; no se añade |
| A32 | `grep -cF "PetsModule," B/src/app.module.ts` | `1` | `PetMembersModule,` se añade a la lista de `imports` |
| A33 | `grep -cF "async function seedUser(label: string, timezone = 'UTC'): Promise<TestUser> {" B/test/pets.e2e-spec.ts` | `1` | Helpers que el e2e nuevo copia (`seedUser`, `createPetViaApi`, `seedMembership`) |
| A34 | `grep -cF "app.setGlobalPrefix('v1');" B/src/main.ts` | `1` | Prefijo `/v1` que el e2e replica |

Cuerpos de error que esta spec fija (literales; los tests comparan contra estos
objetos con `toEqual`):

| Nombre | Status | Cuerpo exacto |
|---|---|---|
| E-404 | 404 | `{ statusCode: 404, message: 'Not Found' }` |
| E-403 | 403 | `{ statusCode: 403, message: 'Forbidden' }` |
| E-NOT-ACCEPTABLE | 404 | `{ statusCode: 404, code: 'INVITE_NOT_ACCEPTABLE', message: 'Invite code is invalid or expired' }` |
| E-ALREADY-MEMBER | 409 | `{ statusCode: 409, code: 'ALREADY_PET_MEMBER', message: 'User is already a member of this pet' }` |
| E-INVITES-LIMIT | 409 | `{ statusCode: 409, code: 'PET_INVITES_LIMIT', message: 'Too many pending invites for this pet' }` |
| E-MEMBERS-LIMIT | 409 | `{ statusCode: 409, code: 'PET_MEMBERS_LIMIT', message: 'Pet member limit reached' }` |
| E-OWNER | 409 | `{ statusCode: 409, code: 'OWNER_NOT_REMOVABLE', message: 'An owner cannot be removed' }` |
| E-429 | 429 | `{ statusCode: 429, message: 'Too Many Requests' }` |

Definiciones usadas abajo:

- **Invitación pendiente**: fila de `pet_invites` con `accepted_at IS NULL`,
  `revoked_at IS NULL` y `expires_at > now` (estricto), donde `now` es el
  `Date` que el controller crea al recibir la petición.
- **Miembro activo**: fila de `pet_users` con `status = 'active'`.
- **Ficheros de test** (todos nuevos):
  - `B/src/db/schema/pet-invites.schema.spec.ts`
  - `B/src/modules/pet-members/application/invite-code.spec.ts`
  - `B/src/modules/pet-members/application/use-cases/create-pet-invite.use-case.spec.ts`
  - `B/src/modules/pet-members/application/use-cases/accept-pet-invite.use-case.spec.ts`
  - `B/src/modules/pet-members/application/use-cases/remove-pet-member.use-case.spec.ts`
  - `B/src/modules/pet-members/infrastructure/guards/invite-accept-rate-limit.guard.spec.ts`
  - `B/test/pet-members.e2e-spec.ts` (abreviado **E2E** abajo)

## Requisitos funcionales

### Datos

- **R1**: WHEN se aplican las migraciones THE SYSTEM SHALL tener la tabla
  `pet_invites` con exactamente estas 10 columnas: `id` uuid PK; `pet_id` uuid
  NOT NULL FK `pets.id` ON DELETE cascade; `code_hash` char(64) NOT NULL
  UNIQUE (constraint `pet_invites_code_hash_unique`); `role` varchar(10) NOT
  NULL con CHECK `pet_invites_role_check` que solo admite `'family'`;
  `created_by` uuid NOT NULL FK `users.id` ON DELETE cascade; `expires_at`
  timestamptz NOT NULL; `accepted_by` uuid NULL FK `users.id` ON DELETE set
  null; `accepted_at` timestamptz NULL; `revoked_at` timestamptz NULL;
  `created_at` timestamptz NOT NULL DEFAULT now(); e índices
  `pet_invites_pet_id_idx`, `pet_invites_created_by_idx` y
  `pet_invites_accepted_by_idx`. La migración la **genera drizzle-kit** con
  nombre `pet_invites` (hoy saldría `0020_pet_invites.sql`); el test la busca
  por la regex `/^\d{4}_pet_invites\.sql$/` (exactamente 1 fichero), nunca por
  número.
  - Test: `B/src/db/schema/pet-invites.schema.spec.ts`
    - `#211 R1: pet_invites tiene exactamente las 10 columnas declaradas` —
      nombres ordenados `['accepted_at', 'accepted_by', 'code_hash',
      'created_at', 'created_by', 'expires_at', 'id', 'pet_id', 'revoked_at',
      'role']`.
    - `#211 R1: code_hash es char(64) NOT NULL único y role tiene su CHECK` —
      vía `getTableConfig`: `getSQLType()` de `code_hash` es `'char(64)'`,
      `notNull` y `isUnique` `true`; `checks` contiene un nombre
      `'pet_invites_role_check'`.
    - `#211 R1: la migración generada crea tabla, unique, check, FKs e
      índices` — exactamente un fichero casa la regex, y su texto contiene
      cada literal: `CREATE TABLE "pet_invites"`, `"code_hash" char(64) NOT
      NULL`, `CONSTRAINT "pet_invites_code_hash_unique" UNIQUE("code_hash")`,
      `CONSTRAINT "pet_invites_role_check" CHECK`,
      `"pet_invites_pet_id_pets_id_fk"`, `"pet_invites_created_by_users_id_fk"`,
      `"pet_invites_accepted_by_users_id_fk"`, `ON DELETE set null`,
      `CREATE INDEX "pet_invites_pet_id_idx"`, `CREATE INDEX
      "pet_invites_created_by_idx"`, `CREATE INDEX
      "pet_invites_accepted_by_idx"`; y `meta/_journal.json` tiene exactamente
      un `tag` que casa `/^\d{4}_pet_invites$/`.

### Código de invitación

- **R2**: THE SYSTEM SHALL generar el código con `generateInviteCode()` como
  10 caracteres del alfabeto de 30 `23456789ABCDEFGHJKMNPQRSTVWXYZ` (sin `0`,
  `1`, `O`, `I`, `L`, `U`); normalizarlo con `normalizeInviteCode(input)`
  (quitar espacios y guiones en cualquier posición, pasar a mayúsculas;
  devolver `null` si el resultado no casa `^[23456789ABCDEFGHJKMNPQRSTVWXYZ]{10}$`);
  y hashearlo con `hashInviteCode(code)` = SHA-256 hex en minúsculas.
  - Test: `B/src/modules/pet-members/application/invite-code.spec.ts`
    - `#211 R2: generateInviteCode da 10 caracteres del alfabeto de 30` — 1000
      muestras, todas casan `/^[23456789ABCDEFGHJKMNPQRSTVWXYZ]{10}$/`, y la
      unión de caracteres vistos, ordenada y unida, es exactamente
      `'23456789ABCDEFGHJKMNPQRSTVWXYZ'`.
    - `#211 R2: normalizeInviteCode acepta minúsculas, espacios y guiones` —
      `' abcde-fghjk '` → `'ABCDEFGHJK'` y `'ABCDE FGHJK'` → `'ABCDEFGHJK'`.
    - `#211 R2: normalizeInviteCode devuelve null para %s` — `it.each`, una
      fila por rama: `''`, `'ABCDEFGHJ'` (9), `'ABCDEFGHJKM'` (11),
      `'ABCDEFGHJ0'`, `'ABCDEFGHJ1'`, `'ABCDEFGHJO'`, `'ABCDEFGHJI'`,
      `'ABCDEFGHJL'`, `'ABCDEFGHJU'`, `'ABCDEFGHJ!'`.
    - `#211 R2: hashInviteCode es SHA-256 hex` — `hashInviteCode('ABCDEFGHJK')`
      es `'f57cbf1e3e471b25db4b8ad0844df41b2dae9c7d1944944d128e49294d412f66'`.

### Invitaciones (owner)

- **R3**: WHEN el owner hace `POST /v1/pets/:petId/invites` (el cuerpo se
  ignora) THE SYSTEM SHALL responder 201 con un objeto de claves exactamente
  `['code', 'createdAt', 'expiresAt', 'id', 'role']`, `role` `'family'`,
  `code` que casa la regex de R2, `createdAt`/`expiresAt` en ISO-8601 con
  `expiresAt − createdAt` = `259200000` ms (72 h); y persistir la fila con
  `code_hash` = SHA-256 hex del `code`, `created_by` = owner, `created_at` y
  `expires_at` derivados del mismo `now`, y **ninguna columna** con el código
  en claro.
  - Tests:
    - E2E `#211 R3: crea la invitación, devuelve el código una vez y guarda solo su hash`
      — envía `{ role: 'owner' }` y aun así `role` es `'family'`; el test
      calcula el hash con `createHash('sha256')` de `node:crypto` (no importa
      `hashInviteCode`) y comprueba que `Object.values(row).map(String)` no
      contiene `code`.
    - `create-pet-invite.use-case.spec.ts` `#211 R3: expiresAt es now + 72 h`
      — con `now = new Date('2026-10-26T12:00:00.000Z')`, el doble de
      repositorio recibe `expiresAt` `2026-10-29T12:00:00.000Z` y `createdAt`
      `2026-10-26T12:00:00.000Z`, y `codeHash` = SHA-256 (calculado en el
      test) del `code` devuelto.

- **R4**: IF al crear hay 5 o más invitaciones pendientes de la mascota THEN
  THE SYSTEM SHALL responder E-INVITES-LIMIT sin crear fila; IF no, pero
  miembros activos + invitaciones pendientes ≥ 10 THEN THE SYSTEM SHALL
  responder E-MEMBERS-LIMIT sin crear fila. El límite de invitaciones se
  evalúa primero. Las invitaciones revocadas, expiradas o aceptadas no cuentan
  como pendientes.
  - Tests (E2E, uno por rama):
    - `#211 R4: la sexta pendiente responde PET_INVITES_LIMIT y no crea fila`
    - `#211 R4: una invitación revocada libera su plaza` — 5 pendientes, la
      sexta da E-INVITES-LIMIT (precondición asertada), se revoca una con
      `db.update(petInvites).set({ revokedAt: new Date() })`, y la sexta da 201.
    - `#211 R4: una invitación expirada libera su plaza` — igual, expirando
      una con `db.update(petInvites).set({ expiresAt: <ahora − 60 s> })`.
    - `#211 R4: con 9 miembros activos se crea una y la siguiente responde PET_MEMBERS_LIMIT`
      (8 `family` sembrados con `seedMembership` + el owner)
    - `#211 R4: con ambos límites alcanzados gana PET_INVITES_LIMIT` (4
      `family` sembrados + 5 pendientes; la sexta da E-INVITES-LIMIT)

- **R5**: WHEN el owner hace `GET /v1/pets/:petId/invites` THE SYSTEM SHALL
  responder 200 con un array **solo de invitaciones pendientes** de esa
  mascota, cada elemento con claves exactamente `['createdAt', 'expiresAt',
  'id', 'role']`, ordenado por `created_at` DESC y luego `id` DESC; el JSON de
  la respuesta no contiene ningún código ni las cadenas `codeHash` ni
  `code_hash`.
  - Test: E2E `#211 R5: lista solo las pendientes, de la más nueva a la más vieja, sin código`
    — crea 5 (A…E) por la API y fija los estados con `db.update(petInvites)`:
    B aceptada (`acceptedBy` = un usuario sembrado, `acceptedAt: new Date()`),
    C revocada, D expirada. La lista es `[E.id, A.id]`.

- **R6**: WHEN el owner hace `DELETE /v1/pets/:petId/invites/:inviteId` sobre
  una invitación pendiente de esa mascota THE SYSTEM SHALL responder 204 sin
  cuerpo y fijar `revoked_at`; IF `:inviteId` no es UUID, no existe, es de otra
  mascota, o está aceptada, revocada o expirada THEN THE SYSTEM SHALL responder
  E-404, idéntico en todas las ramas, sin cambiar ninguna fila.
  - Tests (E2E):
    - `#211 R6: revocar responde 204 y fija revoked_at`
    - `#211 R6: responde el mismo 404 si la invitación %s` — `it.each`, una
      fila por rama: `'no es UUID'` (`not-a-uuid`), `'no existe'`
      (`randomUUID()`), `'es de otra mascota'` (y esa sigue pendiente),
      `'está aceptada'`, `'está revocada'`, `'está expirada'`. Esos tres
      estados se fijan con `db.update(petInvites)`; cada fila comprueba
      después que `revoked_at` de la invitación no cambió.

### Aceptación (cualquier usuario autenticado)

- **R7**: WHEN un usuario autenticado sin fila en `pet_users` para esa mascota
  hace `POST /v1/invites/accept` con `{ code }` de una invitación pendiente
  THE SYSTEM SHALL responder 201 con exactamente `{ petId, role: 'family' }`,
  insertar `pet_users` `(petId, userId, role 'family', status 'active')` y
  fijar en la invitación `accepted_by` = ese usuario y `accepted_at` no nulo,
  en una sola transacción. El código se normaliza con R2 antes de hashearlo.
  - Tests (E2E):
    - `#211 R7: aceptar crea la membresía family activa y responde { petId, role }`
    - `#211 R7: la invitación aceptada guarda accepted_by y accepted_at`
    - `#211 R7: acepta el código en minúsculas y con guion` (envía
      `code.toLowerCase()` con un `-` tras el 5.º carácter)

- **R8**: IF el código no existe, no normaliza (R2 da `null`), está expirado,
  revocado o ya usado THEN THE SYSTEM SHALL responder E-NOT-ACCEPTABLE,
  idéntico en las 5 ramas, sin crear fila en `pet_users`; si no normaliza, sin
  consultar el repositorio. IF el cuerpo no tiene `code`, `code` no es string,
  o queda vacío tras `trim` o pasa de 64 caracteres THEN THE SYSTEM SHALL
  responder 400 con `statusCode` 400 y `message` `'Validation failed'`.
  - Tests:
    - E2E `#211 R8: responde el mismo 404 si el código %s` — `it.each`, una
      fila por rama: `'no existe'` (código bien formado al azar), `'no
      normaliza'` (`'abc'`), `'está expirado'`, `'está revocado'`, `'ya se
      usó'`; cada fila con un aceptante nuevo, que después no tiene fila en
      `pet_users` para la mascota. Los estados expirado, revocado y usado se
      fijan con `db.update(petInvites)` (no con los endpoints), igual que en
      R5.
    - E2E `#211 R8: responde 400 con el cuerpo %j` — `it.each`: `{}`,
      `{ code: 123 }`, `{ code: '   ' }`, `{ code: 'A'.repeat(65) }`.
    - `accept-pet-invite.use-case.spec.ts` `#211 R8: un código que no normaliza no consulta el repositorio`
      — `acceptInvite` del doble no se llama y se lanza
      `InviteNotAcceptableError`.

- **R9**: IF el aceptante ya tiene fila en `pet_users` para la mascota de la
  invitación (incluido el owner con su propio código) THEN THE SYSTEM SHALL
  responder E-ALREADY-MEMBER, dejar la invitación pendiente (`accepted_at`
  nulo) y no cambiar la fila de `pet_users` existente.
  - Tests (E2E, uno por rama):
    - `#211 R9: el owner que acepta su propio código recibe 409 y la invitación sigue pendiente`
      — después, otro usuario acepta el mismo código con 201.
    - `#211 R9: un family que acepta otro código de la misma mascota recibe 409 y conserva su rol`

- **R10**: WHILE un usuario lleva 10 peticiones a `POST /v1/invites/accept`
  dentro de la ventana fija de 3 600 000 ms abierta por su primera petición
  contada THE SYSTEM SHALL responder E-429 a la 11.ª y siguientes **sin
  evaluar el código**; toda petición cuenta (201, 400, 404, 409); el contador
  es por `request.user.id`; WHEN han pasado ≥ 3 600 000 ms desde que se abrió
  la ventana THE SYSTEM SHALL abrir una nueva.
  - Tests:
    - `invite-accept-rate-limit.guard.spec.ts`:
      - `#211 R10: deja pasar 10 peticiones del mismo usuario y la 11.ª lanza 429`
        (cuerpo E-429 y status 429 en la `HttpException`)
      - `#211 R10: el contador es por usuario`
      - `#211 R10: la ventana se reabre a los 3 600 000 ms y no antes` —
        `jest.spyOn(Date, 'now')`: 10 en `t0`; en `t0 + 3_599_999` lanza; en
        `t0 + 3_600_000` deja pasar.
    - E2E `#211 R10: la 11.ª petición en la hora responde 429 aunque el código sea válido`
      — un usuario nuevo manda 10 códigos inexistentes (10 × E-NOT-ACCEPTABLE)
      y la 11.ª, con un código válido, da E-429 y la invitación sigue pendiente.
    - E2E `#211 R10: otro usuario no hereda el contador` — justo después, otro
      usuario acepta ese código con 201.

### Miembros

- **R11**: WHEN un miembro activo de cualquier rol hace `GET
  /v1/pets/:petId/members` THE SYSTEM SHALL responder 200 con un array de los
  miembros activos, cada uno con claves exactamente `['firstName', 'joinedAt',
  'lastName', 'role', 'userId']` (`joinedAt` = `pet_users.created_at` en
  ISO-8601), ordenado por `joinedAt` ASC y luego `userId` ASC; ningún elemento
  tiene `email` y el JSON no contiene el email de ningún miembro.
  - Test: E2E `#211 R11: owner y family ven la misma lista ordenada por alta, sin email`
    — owner + 2 aceptantes en secuencia: `userId`s `[owner, primero,
    segundo]`, `role`s `['owner', 'family', 'family']`, y el cuerpo del owner
    `toEqual` el del family.

- **R12**: WHEN el owner hace `DELETE /v1/pets/:petId/members/:userId` sobre un
  miembro `family`, o un miembro no owner lo hace sobre su propio `userId`,
  THE SYSTEM SHALL responder 204 sin cuerpo y **borrar** su fila de
  `pet_users`; después ese usuario puede aceptar una invitación nueva de la
  mascota.
  - Tests (E2E, uno por rama):
    - `#211 R12: el owner quita a un family con 204 y su fila desaparece`
    - `#211 R12: un family se quita a sí mismo con 204 y su fila desaparece`
    - `#211 R12: el usuario quitado puede volver con una invitación nueva`

- **R13**: IF el actor no es owner y `:userId` (UUID) no es el suyo THEN THE
  SYSTEM SHALL responder E-403 **sin consultar** la membresía del objetivo,
  idéntico exista o no el objetivo.
  - Tests:
    - E2E `#211 R13: un family recibe el mismo 403 si el objetivo es %s` —
      `it.each`, una fila por rama: `'otro family'`, `'el owner'`, `'un UUID
      sin usuario'`; las filas de `pet_users` no cambian.
    - `remove-pet-member.use-case.spec.ts` `#211 R13: un no owner sobre otro usuario no llama a findMembership`

- **R14**: IF `:userId` no es UUID (cualquier actor) THEN THE SYSTEM SHALL
  responder E-404 sin consultar la base; IF el actor es owner y `:userId` es un
  UUID sin usuario, o de un usuario sin membresía activa en la mascota, THEN
  THE SYSTEM SHALL responder E-404, idéntico en todas las ramas.
  - Test: E2E `#211 R14: responde el mismo 404 si el objetivo %s` — `it.each`,
    una fila por rama: `'no es UUID (owner)'`, `'no es UUID (family)'`, `'es
    un UUID sin usuario'`, `'es un usuario sin membresía'`.

- **R15**: IF el actor es owner y el objetivo tiene rol `owner` THEN THE
  SYSTEM SHALL responder E-OWNER sin borrar nada; así ninguna baja deja la
  mascota sin owner. (Con actor no owner y objetivo ajeno manda R13; con
  `:userId` que no es UUID manda R14. Orden completo en [[design]] D12.)
  - Tests (E2E, uno por rama):
    - `#211 R15: el owner no puede quitarse a sí mismo`
    - `#211 R15: el owner no puede quitar a otro owner` (segundo owner
      sembrado con `seedMembership(petId, userId, 'owner')`)

### Autorización transversal

- **R16**: IF quien llama no tiene membresía activa en `:petId` THEN THE SYSTEM
  SHALL responder E-404 en las 5 rutas con `:petId` (`POST` y `GET
  …/invites`, `DELETE …/invites/:inviteId`, `GET …/members`, `DELETE
  …/members/:userId`), idéntico al de un `:petId` que no existe o no es UUID.
  - Tests (E2E, una `it.each` por rama, filas = las 5 rutas):
    - `#211 R16: un no miembro recibe 404 en %s %s`
    - `#211 R16: un petId inexistente da el mismo 404 en %s %s` (`randomUUID()`)
    - `#211 R16: un petId que no es UUID da el mismo 404 en %s %s`

- **R17**: IF quien llama es miembro `family` THEN THE SYSTEM SHALL responder
  E-403 en `POST /v1/pets/:petId/invites`, `GET /v1/pets/:petId/invites` y
  `DELETE /v1/pets/:petId/invites/:inviteId`, sin crear ni revocar nada.
  - Test: E2E `#211 R17: un family recibe 403 en %s %s` — `it.each`, filas =
    las 3 rutas (el `:inviteId` es `randomUUID()`); después `pet_invites` no
    tiene ninguna fila de esa mascota (lectura directa con `db`).

- **R18**: IF la petición no lleva token THEN THE SYSTEM SHALL responder 401 en
  las 6 rutas nuevas.
  - Test: E2E `#211 R18: sin token responde 401 en %s %s` — `it.each`, filas =
    las 6 rutas.

### Auditoría

- **R19**: WHEN una creación, revocación, aceptación o baja termina con éxito
  THE SYSTEM SHALL registrar, tras el commit, exactamente una entrada con
  `AUDIT_LOGGER.record`:
  - crear: `{ userId: owner, action: 'pet_invite.create', entity: 'pet_invite', entityId: inviteId, meta: { petId } }`
  - revocar: `{ userId: owner, action: 'pet_invite.revoke', entity: 'pet_invite', entityId: inviteId, meta: { petId } }`
  - aceptar: `{ userId: aceptante, action: 'pet_invite.accept', entity: 'pet_invite', entityId: inviteId, meta: { petId } }`
  - quitar: `{ userId: actor, action: 'pet_member.remove', entity: 'pet', entityId: petId, meta: { memberUserId } }`

  IF una aceptación falla (404 o 409) THEN THE SYSTEM SHALL no registrar
  ninguna entrada `pet_invite.accept`. Ningún `meta` contiene el código ni su
  hash.
  - Tests (E2E, leyendo `audit_log`):
    - `#211 R19: auditar %s deja su fila exacta` — `it.each`, una fila por
      acción (las 4); compara `action`, `entity`, `entityId`, `userId` y
      `meta` con `toEqual`.
    - `#211 R19: el meta de las 4 acciones no contiene el código ni su hash`
      — primero aserta que las 4 filas existen (`toHaveLength(4)`), luego que
      `JSON.stringify` de cada `meta` no contiene ni el código ni su hash.
    - `#211 R19: un accept con %s no audita` — `it.each`: `'404'`, `'409'`;
      ninguna fila `pet_invite.accept` con `userId` = el aceptante.
  - Este último it vigila código ya correcto cuando se escribe: su rojo es
    una **mutación de producción versionada** en el commit rojo y revertida
    en el verde (C4, quinto punto; ver [[tasks]] commits 25–26).

### Efectos del alta y de la baja (requisitos de verificación, vía (a) de C4)

- **R20**: WHEN un usuario acepta una invitación THE SYSTEM SHALL tratarlo con
  los permisos existentes de `family`: `GET /v1/pets` incluye la mascota con
  `myRole` `'family'`; `GET /v1/pets/:petId` responde 200 con `myRole`
  `'family'`; `PATCH /v1/pets/:petId` responde 403; y el token push que
  registró antes con `POST /v1/me/push-tokens` aparece en
  `findActiveMembersTokens(petId)` (no aparecía antes de aceptar).
  - Test: E2E `#211 R20: el nuevo family lista la mascota, la lee, no la edita y recibe push`
    — `app.get(PUSH_TOKEN_REPOSITORY)`; token
    `` `ExponentPushToken[pet-members-${RUN_ID}]` ``, `platform: 'android'`.
  - **Verificación**: solo asevera código existente (A14–A19, A22, A23). Su
    test se escribe en el commit rojo de R7, antes de la aceptación, y su rojo
    es real: en ese commit `POST /v1/invites/accept` responde 500 (el caso de
    uso aún es el stub del esqueleto) y el `expect(201)` falla por aserción.

- **R21**: WHEN un miembro es quitado (R12) THE SYSTEM SHALL dejar de
  tratarlo como miembro: `GET /v1/pets/:petId` responde E-404, `GET /v1/pets`
  no incluye la mascota, su token ya no aparece en
  `findActiveMembersTokens(petId)` y `GET /v1/pets/:petId/members` del owner
  no lo lista.
  - Test: E2E `#211 R21: el miembro quitado pierde la mascota, el push y la lista`
  - **Verificación**: igual que R20; su test se escribe en el commit rojo de
    R12, donde `DELETE …/members/:userId` aún responde 500 y el
    `expect(204)` falla por aserción.

Efectos **declarados sin test** (no cambian con esta feature): el mapa en vivo
depende de la suscripción del collar y no del rol (A20); el centro de alertas
lista a todo miembro activo sin mirar el rol (A21). Un `family` nuevo ve ambos
desde que acepta.

## Fuera de alcance

- Roles `walker` y `vet`, cambiar el rol de un miembro, transferir la
  propiedad o tener varios owners por la API (el CHECK los admite; la API no
  los crea).
- Invitación por email, deep links, universal links o página web del código.
- Job de limpieza de invitaciones viejas: las expiradas, revocadas y aceptadas
  se quedan en la tabla (no cuentan para nada; ver [[design]] D7).
- Filtrar el push por rol, o preferencias de notificación por miembro.
- La columna `pet_users.permissions` (jsonb): ni se lee ni se escribe.
- La app móvil (Share nativo, pantallas de miembros): es #214.
- Rate limit distribuido entre procesos (ver [[design]] D5).

## Aprobación

- [ ] Aprobado por humano (fecha: ____) ← gate obligatorio antes de implementar

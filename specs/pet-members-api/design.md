---
feature: "pet-members-api"
status: approved     # draft | approved
tags: [harness, spec, backend, pets]
---

# Diseño — [[pet-members-api]] (#211)

> Ver [[requirements]] para los requisitos y las anclas A1–A34, y
> [[../../docs/architecture|architecture]] para las capas. Rutas desde la raíz
> del repo; `B=backend-pet-tracker`, `M=B/src/modules/pet-members`.

## Decisiones técnicas

- **D1 — Módulo propio `pet-members`.** Las invitaciones y los miembros van en
  un módulo nuevo `PetMembersModule` que importa `PetsModule` (A3) para
  reutilizar `PET_REPOSITORY` y `PetAccessGuard`. `pets` no importa a
  `pet-members`, así que no hay ciclo. `AUDIT_LOGGER` y `DRIZZLE` vienen de
  módulos `@Global()` (A10 y el comentario de `pets.module.ts`), como en
  `pets`. No hace falta `UsersModule`: el e2e obtiene `PUSH_TOKEN_REPOSITORY`
  con `app.get` (A16, A17). (R3–R19)

- **D2 — Formato del código.** 10 caracteres del alfabeto de 30
  `23456789ABCDEFGHJKMNPQRSTVWXYZ`: sin `0`/`O`, `1`/`I`/`L` (se confunden al
  dictarlo o copiarlo) ni `U` (evita palabras malsonantes). La entropía es
  30^10 ≈ 5,9 × 10^14, unos 49,07 bits. Cada carácter sale de
  `randomInt(0, 30)` de `node:crypto`, que no tiene sesgo, y no de
  `byte % 30`, que sí lo tendría. Es la primera vez que se usa `randomInt`
  (A30), pero viene de stdlib y no añade dependencia. La normalización quita
  espacios y guiones y pasa a mayúsculas, así que la app puede mostrarlo como
  `ABCDE-FGHJK` y el usuario puede escribirlo en minúsculas. (R2, R7)

- **D3 — Hash y búsqueda.** Se guarda solo `code_hash` = SHA-256 hex,
  calculado igual que `hashVerificationToken` en
  `B/src/modules/auth/application/verification-token.ts`. El código en claro
  se devuelve una sola vez, en el 201 de R3.
  - **Por qué no argon2/bcrypt**: el accept no lleva `petId`, así que el hash
    tiene que ser determinista para buscar por igualdad.
  - La búsqueda es `WHERE code_hash = $1` sobre el índice único. No hace falta
    comparación de tiempo constante, porque el atacante compara el hash de su
    propia conjetura y el tiempo del B-tree no le dice nada útil.
  - **Techo**: con un volcado de la base se pueden atacar offline los códigos
    vivos, que duran 72 h.
  - **Mejora** si llega a importar: HMAC-SHA-256 con un secreto en variable
    de entorno. Cambiaría solo `hashInviteCode`. (R1, R2, R3, R7)

- **D4 — Caducidad y unicidad.**
  - **TTL de 72 h** (`INVITE_TTL_MS = 72 * 60 * 60 * 1000`): da para un fin de
    semana y para que el invitado instale la app y se registre antes de usar
    el código. `created_at` y `expires_at` salen del mismo `now` que crea el
    controller, así que la resta es exacta (R3). Pendiente significa
    `expires_at > now`, estricto.
  - **Unicidad**: `code_hash` es UNIQUE global y no hay reintento.
    - La probabilidad de colisión es de unos n / 5,9 × 10^14 por código.
    - Si choca, el insert lanza violación de unicidad, la API responde 500 y
      el owner vuelve a pedir el código.
    - `ponytail:` sin reintento; se añade uno si alguna vez se ve el 500 en
      logs. (R1, R3)

- **D5 — Rate limit del accept.** El guard nuevo `InviteAcceptRateLimitGuard`
  copia la ventana fija de `EmailRateLimitGuard`. Es la misma semántica (A12,
  A13): la entrada nace con `count: 1`, se lanza 429 cuando `count >= max` y
  se poda cuando `now - windowStartedAt >= window`.
  - **Parámetros**: clave = `request.user.id`, máximo 10, ventana
    3 600 000 ms. Cuenta toda petición que llega al guard, porque el guard
    corre antes que el handler.
  - **Sin usuario**: si no hay `request.user.id` string, devuelve `true`.
    Nunca pasa, porque el `AuthGuard` global corre antes y da 401 (R18).
  - **Por qué hace falta (fuerza bruta)**: una cuenta prueba como mucho 720
    códigos en las 72 h que dura uno. Con L códigos vivos, cada conjetura
    acierta con probabilidad L / 5,9 × 10^14. Con L = 10^5, eso da
    1,7 × 10^-10 por intento, y 10^7 intentos (unas 14 000 cuentas) esperan
    1,7 × 10^-3 aciertos.
  - **Sin `MAX_TRACKED_KEYS`**: las claves son ids de cuentas autenticadas y
    se podan a la hora.
  - `ponytail:` es un contador en memoria por proceso, el mismo techo que
    `EmailRateLimitGuard`. Con varios procesos o Lambdas el límite se reparte
    entre ellos. La mejora es un contador en Postgres o el throttling de API
    Gateway. (R10)

- **D6 — Límites por mascota.** `MAX_PENDING_INVITES_PER_PET = 5` y
  `MAX_MEMBERS_PER_PET = 10`, que incluye al owner. Se comprueban al crear:
  primero pendientes ≥ 5 y luego miembros activos + pendientes ≥ 10. Cada
  pendiente reserva una plaza, así que el accept no vuelve a contar.
  `ponytail:` dos creaciones concurrentes pueden pasarse en uno, porque el
  conteo y el insert no van en una transacción serializable. Es aceptable
  para un límite de producto. (R4)

- **D7 — Estado de la invitación por columnas.** No hay columna `status`: el
  estado es `accepted_at`/`accepted_by` (usada), `revoked_at` (revocada) o
  `expires_at` (caducada). Aceptar fija `accepted_by` y `accepted_at`, y
  revocar fija `revoked_at`.
  - **Filas viejas**: se conservan como rastro, porque `audit_log` guarda solo
    ids y no basta.
  - **Sin job de limpieza**: no cuentan para nada.
  - **`accepted_by` es ON DELETE set null**: borrar al aceptante no borra la
    invitación. (R1, R5, R6, R7)

- **D8 — Transacción del accept.** `acceptInvite(codeHash, userId, now)` hace
  todo dentro de un solo `this.db.transaction`, en este orden:
  1. `SELECT … FROM pet_invites WHERE code_hash = $h AND accepted_at IS NULL
     AND revoked_at IS NULL AND expires_at > $now FOR UPDATE` (drizzle:
     `.for('update')`). Si no hay fila, devuelve `{ status: 'not_acceptable' }`.
  2. Busca una fila de `pet_users (pet_id, user_id)` con cualquier status. Si
     existe, devuelve `{ status: 'already_member' }` sin escribir nada.
  3. Hace `UPDATE pet_invites SET accepted_by, accepted_at = $now` sobre esa
     invitación.
  4. Hace `INSERT pet_users (pet_id, user_id, role 'family', status 'active')`.
  5. Devuelve `{ status: 'accepted', invite }`.

  Concurrencia:
  - Si dos usuarios aceptan el mismo código, el segundo espera al
    `FOR UPDATE`. Cuando el primero hace commit, la fila ya no cumple el
    `WHERE` y el segundo recibe `not_acceptable`, es decir, 404.
  - `ponytail:` si el mismo usuario acepta a la vez dos códigos distintos de
    la misma mascota, el segundo `INSERT` viola la PK y responde 500. Hay
    rollback, así que no queda nada a medias. (R7, R8, R9)

- **D9 — Ya miembro: 409 y la invitación intacta.** La transacción no escribe
  nada, así que el código sigue sirviendo para otra persona. El owner que
  acepta su propio código cae aquí sin caso especial.
  - **Lo que filtra**: el 409 solo revela que un código pertenece a una
    mascota de la que el que llama **ya es miembro**. No le enseña nada que no
    sepa.
  - **Lo que no filtra**: para un no miembro, la respuesta a cualquier código
    es 201 o el 404 genérico. (R9)

- **D10 — Un código mal formado da el mismo 404 que uno inexistente.** El 400
  queda solo para errores de esquema: falta `code`, no es string, queda vacío
  tras `trim` o pasa de 64 caracteres. Así el accept no distingue «formato
  inválido» de «no existe». Un código que no normaliza no llega al
  repositorio. (R8)

- **D11 — La baja borra la fila; un owner nunca es removible.**
  - **Borrado**: `DELETE FROM pet_users` en lugar de `status = 'removed'`.
    Así volver a invitar funciona sin tocar el `INSERT` de D8 (R12), y
    `findAllByMember`, push y alertas dejan de verlo sin cambio alguno, porque
    ya filtran por fila activa (A14, A21).
  - **Ningún owner es removible** (R15). Es más estricto que «no quitar al
    último owner», y hoy equivale porque la API no crea un segundo owner.
    Además no tiene carrera de conteo. Cuando exista la transferencia de
    propiedad, esta regla se revisa. (R12, R15, R21)

- **D12 — Orden de evaluación del `DELETE …/members/:userId`.**
  1. `AuthGuard` global: sin token da 401 (R18).
  2. `PetAccessGuard`: si quien llama no es miembro activo, 404 (R16).
  3. Controller: `:userId` que no es UUID (`z.uuid().safeParse`) da E-404 sin
     llamar al caso de uso (R14).
  4. Caso de uso: si `actor.role !== 'owner'` y `targetUserId !==
     actor.userId`, lanza `MemberRemovalForbiddenError` (403) **antes de
     consultar nada** (R13). Un family no puede saber si un UUID es un
     usuario ni si es miembro.
  5. `this.pets.findMembership(petId, targetUserId)`: si es `null` o su
     status no es `'active'`, lanza `PetMemberNotFoundError` (E-404; R14).
  6. Si el rol es `'owner'`, lanza `OwnerNotRemovableError` (E-OWNER; R15).
  7. `deleteMembership`, luego `audit.record` y por último 204 (R12, R19).

  El `DELETE …/invites/:inviteId` usa el mismo patrón: primero guard con
  `@RequirePetRole('owner')`, luego la comprobación de UUID en el controller
  y después `revokeInvite`. Ese `UPDATE … WHERE id AND pet_id AND pendiente
  RETURNING id` devuelve `false` en las seis ramas de R6. (R6)

- **D13 — Lista de miembros.** Lleva `userId`, `firstName`, `lastName`,
  `role` y `joinedAt` (`pet_users.created_at`). La ve todo miembro activo,
  porque un family necesita saber quién más ve la mascota y su propio
  `userId` para darse de baja. **Sin email**, por privacidad entre miembros.
  `firstName` y `lastName` son NOT NULL en `users`. Se ordena por
  `pet_users.created_at` ASC y luego `user_id` ASC, así que el owner sale
  primero. (R11)

- **D14 — Respuesta del accept: `{ petId, role }`.** La app hace luego
  `GET /v1/pets/:petId` (R20). Devolver el perfil completo duplicaría el
  mapper de `pets` y su URL de foto firmada. El status es 201, como el
  `POST /v1/devices/claim` (A11). (R7)

- **D15 — Auditoría tras el commit.** Se llama a `AUDIT_LOGGER.record` fuera
  de la transacción, como hacen `delete-pet.use-case.ts` y
  `claim-device.use-case.ts`. `meta` nunca lleva el código ni su hash. En la
  baja la entidad es `'pet'` con `entityId` = `petId`, porque `pet_users`
  tiene PK compuesta y no tiene un id propio; el miembro quitado va en
  `meta.memberUserId`. (R19)

- **D16 — Rutas.**
  - `pets/:petId/invites` y `pets/:petId/members` son controllers propios.
    Siguen el patrón de `@Controller('pets/:petId/reminders')` y no chocan
    con `@Get(':petId')` de `PetsController`, porque la profundidad del path
    es otra.
  - `POST /v1/invites/accept` no lleva `:petId` (patrón D1 de
    `devices/claim`, A11): la autorización vive en el caso de uso.
  - `@UseGuards(PetAccessGuard)` y `@RequirePetRole('owner')` van **en cada
    método**, como en `pets.controller.ts`. El guard también leería la clase
    (A8), pero así se lee igual que el resto del repo. (R16, R17)

- **D17 — Migración y paralelismo con #210/#212.** La migración la genera
  drizzle-kit desde `B`:
  `pnpm exec drizzle-kit generate --name pet_invites`. Hoy produce
  `0020_pet_invites.sql`, su `meta/0020_snapshot.json` y una entrada en
  `meta/_journal.json`. Nunca se escribe ni se renumera a mano.

  Si otra migración (#210, #212) llega antes a `dev`, se hace esto:
  1. `git merge origin/dev`. **Nunca rebase.**
  2. En el conflicto de `meta/_journal.json`, quedarse con la versión de
     `origin/dev`.
  3. Borrar los ficheros propios `00NN_pet_invites.sql` y
     `meta/00NN_snapshot.json`.
  4. Volver a correr el `generate` con el mismo `--name`.
  5. Commit
     `chore(db): regenera la migración de pet_invites tras merge de dev`.

  El test de R1 busca el fichero por regex, así que sobrevive al cambio de
  número. Si la base local del worktree ya aplicó la versión vieja, no se
  toca con `psql`: se avisa en `progress/impl_pet-members-api.md` y el
  leader decide. (R1)

## Archivos afectados

Todos nuevos salvo los marcados *(mod)*. Símbolos exactos:

**Datos (infraestructura compartida)**
- `B/src/db/schema/pet-invites.schema.ts` — `export const petInvites =
  pgTable('pet_invites', …)` con las columnas de R1. Para propiedades,
  índices y CHECK copia `password-reset-tokens.schema.ts` y `pets.schema.ts`
  (A2). FKs: `pets.id` cascade, `users.id` cascade (`createdBy`) y `users.id`
  set null (`acceptedBy`).
- `B/src/db/schema/pet-invites.schema.spec.ts` — R1.
- `B/src/db/schema/index.ts` *(mod)* — añade la línea
  `export * from './pet-invites.schema';` entre A24 y A25.
- `B/src/db/migrations/00NN_pet_invites.sql`,
  `meta/00NN_snapshot.json` y `meta/_journal.json` *(mod)* — generados (D17).

**domain** (`M/domain/`, sin imports de framework)
- `entities/pet-invite.entity.ts` — `export interface PetInvite { id: string;
  petId: string; role: 'family'; createdBy: string; expiresAt: Date;
  acceptedBy: string | null; acceptedAt: Date | null; revokedAt: Date | null;
  createdAt: Date }`.
- `entities/pet-member.entity.ts` — `export interface PetMember { userId:
  string; firstName: string; lastName: string; role: PetRole; joinedAt: Date
  }`, donde `PetRole` viene de `@/modules/pets/domain/entities/pet-membership`
  (A1).
- `errors/pet-member.errors.ts` — 8 clases `extends Error`:
  `InviteNotAcceptableError`, `AlreadyPetMemberError`,
  `PendingInvitesLimitError`, `PetMembersLimitError`,
  `PetInviteNotFoundError`, `PetMemberNotFoundError`,
  `OwnerNotRemovableError` y `MemberRemovalForbiddenError`.
- `repositories/pet-member.repository.ts` — `export const
  PET_MEMBER_REPOSITORY = Symbol('PetMemberRepository');`, `export type
  AcceptInviteResult = { status: 'accepted'; invite: PetInvite } | { status:
  'not_acceptable' } | { status: 'already_member' };` y la interfaz
  `PetMemberRepository` con **exactamente** estos métodos, fijos desde el
  primer commit que la crea:
  - `countSlots(petId: string, now: Date): Promise<{ pendingInvites: number; activeMembers: number }>;`
  - `createInvite(input: { petId: string; codeHash: string; createdBy: string; createdAt: Date; expiresAt: Date }): Promise<PetInvite>;`
    (el `id` es `uuidv7()` en el repositorio, como `pet.drizzle.repository.ts`)
  - `listPendingInvites(petId: string, now: Date): Promise<PetInvite[]>;`
  - `revokeInvite(petId: string, inviteId: string, now: Date): Promise<boolean>;`
  - `acceptInvite(codeHash: string, userId: string, now: Date): Promise<AcceptInviteResult>;`
  - `listMembers(petId: string): Promise<PetMember[]>;`
  - `deleteMembership(petId: string, userId: string): Promise<void>;`

**application** (`M/application/`)
- `invite-code.ts` — `import { createHash, randomInt } from 'node:crypto';`.
  Exporta `INVITE_CODE_ALPHABET = '23456789ABCDEFGHJKMNPQRSTVWXYZ'`,
  `INVITE_CODE_LENGTH = 10`, `INVITE_TTL_MS = 72 * 60 * 60 * 1000`,
  `generateInviteCode(): string`,
  `normalizeInviteCode(input: string): string | null` y
  `hashInviteCode(code: string): string`.
- `invite-code.spec.ts` — R2.
- `dto/accept-invite.dto.ts` — `export const AcceptInviteSchema = z.object({
  code: z.string().trim().min(1).max(64) });` (mismo `import { z } from
  'zod';` que `claim-device.dto.ts`).
- `use-cases/create-pet-invite.use-case.ts` — `CreatePetInviteUseCase`.
  - Constructor `(@Inject(PET_MEMBER_REPOSITORY) repo: PetMemberRepository,
    @Inject(AUDIT_LOGGER) audit: AuditLogger)`.
  - `execute(petId: string, userId: string, now: Date): Promise<{ invite:
    PetInvite; code: string }>`.
  - Exporta `MAX_PENDING_INVITES_PER_PET = 5` y `MAX_MEMBERS_PER_PET = 10`.
- `use-cases/list-pet-invites.use-case.ts` — `ListPetInvitesUseCase`.
  Constructor `(repo)`. `execute(petId: string, now: Date):
  Promise<PetInvite[]>`.
- `use-cases/revoke-pet-invite.use-case.ts` — `RevokePetInviteUseCase`.
  Constructor `(repo, audit)`. `execute(petId: string, inviteId: string,
  userId: string, now: Date): Promise<void>`; si `revokeInvite` devuelve
  `false`, lanza `PetInviteNotFoundError`.
- `use-cases/accept-pet-invite.use-case.ts` — `AcceptPetInviteUseCase`.
  Constructor `(repo, audit)`. `execute(rawCode: string, userId: string, now:
  Date): Promise<{ petId: string; role: 'family' }>`.
- `use-cases/list-pet-members.use-case.ts` — `ListPetMembersUseCase`.
  Constructor `(repo)`. `execute(petId: string): Promise<PetMember[]>`.
- `use-cases/remove-pet-member.use-case.ts` — `RemovePetMemberUseCase`.
  Constructor `(repo, @Inject(PET_REPOSITORY) pets: PetRepository, audit)`.
  `execute(petId: string, actor: { userId: string; role: PetRole },
  targetUserId: string): Promise<void>`; sigue el orden de D12.
- Specs: `create-pet-invite.use-case.spec.ts` (R3),
  `accept-pet-invite.use-case.spec.ts` (R8) y
  `remove-pet-member.use-case.spec.ts` (R13). Usan el mismo patrón de dobles
  que `B/src/modules/devices/application/use-cases/claim-device.use-case.spec.ts`.
  Los dobles se tipan contra la interfaz completa.

**infrastructure** (`M/infrastructure/`)
- `repositories/pet-member.drizzle.repository.ts` —
  `PetMemberDrizzleRepository implements PetMemberRepository`, con
  `@Inject(DRIZZLE) db: NodePgDatabase` como `pet.drizzle.repository.ts`.
  `acceptInvite` según D8 y `listMembers` según D13, con `innerJoin(users)`.
- `guards/invite-accept-rate-limit.guard.ts` —
  `InviteAcceptRateLimitGuard implements CanActivate`. Exporta
  `INVITE_ACCEPT_MAX_PER_USER = 10` e
  `INVITE_ACCEPT_RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000`. Lanza el mismo
  `HttpException` E-429 que A13 y sigue D5.
- `guards/invite-accept-rate-limit.guard.spec.ts` — R10. Sigue el patrón de
  `email-rate-limit.guard.spec.ts`, con un `ExecutionContext` fabricado cuyo
  `getRequest` devuelve `{ user: { id } }`.
- `mappers/pet-member-error.mapper.ts` —
  `export function mapPetMemberError(error: unknown): unknown`, con la misma
  forma que `B/src/modules/devices/infrastructure/mappers/device-error.mapper.ts`.
  Traducciones:
  - `InviteNotAcceptableError` →
    `new NotFoundException({ statusCode: HttpStatus.NOT_FOUND, code: 'INVITE_NOT_ACCEPTABLE', message: 'Invite code is invalid or expired' })`
  - `AlreadyPetMemberError`, `PendingInvitesLimitError`,
    `PetMembersLimitError` y `OwnerNotRemovableError` → `ConflictException`
    con los cuerpos E-ALREADY-MEMBER, E-INVITES-LIMIT, E-MEMBERS-LIMIT y
    E-OWNER de [[requirements]].
  - `PetInviteNotFoundError` y `PetMemberNotFoundError` →
    `new NotFoundException()`
  - `MemberRemovalForbiddenError` → `new ForbiddenException()`
  - cualquier otro error → se devuelve sin tocar.
- `pet-invites.controller.ts` — dos clases:
  - **`PetInvitesController`**, `@Controller('pets/:petId/invites')`. Sus
    métodos llevan `@UseGuards(PetAccessGuard)` y `@RequirePetRole('owner')`:
    - `@Post() create(@Req() request: PetAccessRequest, @CurrentUser() user:
      CurrentUserPayload)`: sin `@Body`; responde `{ id, code, role,
      expiresAt, createdAt }` con fechas en `toISOString()`.
    - `@Get() list(@Req() request)`: responde `{ id, role, expiresAt,
      createdAt }[]`.
    - `@Delete(':inviteId') @HttpCode(HttpStatus.NO_CONTENT) revoke(…)`: si
      `z.uuid().safeParse(inviteId).success` es `false`, lanza
      `new NotFoundException()`.
  - **`InvitesController`**, `@Controller('invites')`:
    - `@Post('accept') @UseGuards(InviteAcceptRateLimitGuard) accept(@Body()
      body: unknown, @CurrentUser() user)`: aplica
      `parseBody(AcceptInviteSchema, body)`. `parseBody` es una copia local,
      igual que en los otros 12 controllers
      (`grep -rlF "function parseBody<T>(schema: ZodType<T>, body: unknown): T {" B/src | wc -l`
      → `12`, y `13` al cerrar).
- `pet-members.controller.ts` — **`PetMembersController`**,
  `@Controller('pets/:petId/members')`:
  - `@Get() @UseGuards(PetAccessGuard)`: responde `{ userId, firstName,
    lastName, role, joinedAt }[]`.
  - `@Delete(':userId') @HttpCode(HttpStatus.NO_CONTENT)
    @UseGuards(PetAccessGuard)`: comprueba el UUID igual que `revoke`. El
    actor es `{ userId: user.id, role: request.petMembership.role }`.
- `CurrentUser` y `CurrentUserPayload` se importan de
  `@/modules/auth/infrastructure/decorators/current-user.decorator`, como en
  `pets.controller.ts`.

**módulo y app**
- `M/pet-members.module.ts` — `PetMembersModule`:
  - `imports: [PetsModule]`
  - `controllers: [PetInvitesController, InvitesController,
    PetMembersController]`
  - `providers`: los 6 casos de uso,
    `{ provide: PET_MEMBER_REPOSITORY, useClass: PetMemberDrizzleRepository }`
    e `InviteAcceptRateLimitGuard`.
- `B/src/app.module.ts` *(mod)* — su import y `PetMembersModule,` en
  `imports`, junto a A32.

**tests e2e**
- `B/test/pet-members.e2e-spec.ts` — R3–R21. El arranque (`AppModule`,
  `setGlobalPrefix('v1')`, `DRIZZLE`, `TOKEN_SERVICE`) y los helpers
  `seedUser`, `createPetViaApi`, `seedMembership` y `api` se **copian** de
  `B/test/pets.e2e-spec.ts` (A33), con `RUN_ID` y limpieza de
  `createdPetIds`/`createdUserIds` en `afterAll`. Los `pet_invites` caen en
  cascada con la mascota.

**docs**
- `docs/data-model.md` *(mod)* — una fila `pet_invites` en la tabla de tablas,
  tras la de `pet_users`, con el mismo formato que la de
  `password_reset_tokens`. Además añade al diagrama
  `pets ||--o{ pet_invites : "invites"`. Es un commit `docs(data-model): …`
  sin R-ids.

## Alternativas descartadas

- **Invitación por email, deep link o universal link**: decisión del humano
  (§1 del plan). Requiere SES real y hosting de dominio.
- **`@nestjs/throttler`**: es dependencia nueva (A31), trae configuración
  global y su clave por defecto es la IP. Un guard de 60 líneas copiado de
  A12 basta.
- **Extender `EmailRateLimitGuard`**: despacha por nombre de handler, sale
  sin hacer nada si `body.email` no es string y vive en `auth`. Habría que
  romper las tres cosas.
- **Clave del rate limit por IP**: detrás de NAT móvil castiga a usuarios
  legítimos. La clave por cuenta obliga al atacante a crear cuentas, y el
  registro ya tiene su propio límite por IP (`REGISTER_MAX_PER_IP = 10`).
- **argon2/bcrypt para el código**: sin `petId` no hay candidato que
  verificar; habría que recorrer todas las invitaciones vivas (D3).
- **Guardar el código cifrado para volver a mostrarlo**: el owner crea otra
  invitación y revoca la vieja; no se guarda ningún secreto recuperable.
- **Crockford base32 con mapeo de parecidos** (`O`→`0`, `I`/`L`→`1`): exige
  más normalización. Excluir esos caracteres del alfabeto es más simple (D2).
- **`status = 'removed'` en `pet_users`**: rompería el reingreso por la PK y
  obligaría a revisar cada lector que hoy filtra por fila activa (D11).
- **Regla del «último owner» con conteo**: tiene carrera entre dos bajas
  concurrentes, y hoy no hay forma de tener dos owners por la API (D11).
- **400 para un código mal formado**: dejaría distinguir «formato» de «no
  existe» (D10).
- **`GET /v1/invites/:code` para previsualizar la mascota**: sería un oráculo
  de códigos válidos sin consumir el rate limit de aceptación.
- **Devolver el perfil completo en el accept**: duplica el mapper de `pets`
  (D14).
- **Columna `status` en `pet_invites`**: es redundante con las tres marcas de
  tiempo y se desincroniza con la caducidad, que es implícita (D7).

# impl: auth-registration
Fecha: 2026-07-30

Feature id 3, branch `feature/3-auth-registration`. Spec aprobada por humano
(`specs/auth-registration/requirements.md`, casilla marcada 2026-07-30) —
gate verificado antes de escribir código.

## Archivos creados

### Schema Drizzle y migraciones (infraestructura compartida)
- `backend-pet-tracker/src/db/schema/users.schema.ts` — tabla `users` con las
  columnas exactas de `docs/data-model.md` (PK uuid generado en app, `email`
  UNIQUE, `password_hash`, `terms_accepted_at` NOT NULL, `email_verified_at`
  NULL, `timezone` DEFAULT 'UTC'). Sin columna para `passwordConfirmation`.
- `backend-pet-tracker/src/db/schema/email-verification-tokens.schema.ts` —
  tabla propia del token de un solo uso: `token_hash char(64) UNIQUE`
  (SHA-256 hex), `expires_at`, `used_at` NULL, FK `user_id` CASCADE + índice.
- `backend-pet-tracker/src/db/schema/audit-log.schema.ts` — tabla transversal
  `audit_log` (bigint identity PK, `user_id` NULL con FK SET NULL, `action`,
  `entity`, `entity_id`, `meta jsonb`, `at` DEFAULT now()) + índices.
- `backend-pet-tracker/src/db/schema/index.spec.ts` — guarda que el barrel
  exporta las 3 tablas y ya no exporta el placeholder `schemaBootstrap`.
- `backend-pet-tracker/src/db/migrations/0001_auth_registration_tables.sql`
  (+ `meta/0001_snapshot.json`) — CREATE de las 3 tablas.
- `backend-pet-tracker/src/db/migrations/0002_drop_schema_bootstrap_placeholder.sql`
  (+ `meta/0002_snapshot.json`) — DROP del placeholder.

### Módulo de auditoría compartido (`@Global()`, hermano de `db/` y `aws/`)
- `backend-pet-tracker/src/audit/audit-log.repository.ts` — puerto
  `AuditLogger` + token `AUDIT_LOGGER` + tipo `AuditLogEntry`.
- `backend-pet-tracker/src/audit/audit-log.drizzle.repository.ts` —
  implementación Drizzle del puerto.
- `backend-pet-tracker/src/audit/audit.module.ts` — módulo `@Global()`.

### Módulo `auth` — domain
- `.../modules/auth/domain/entities/user.entity.ts` — entidad pura `User`
  (+ `DEFAULT_TIMEZONE` y `normalizeEmail`, que es la regla que hace
  case-insensitive la comparación de email de R2).
- `.../domain/entities/email-verification-token.entity.ts` — entidad pura con
  `isUsed()` / `isExpired(now)`; solo conoce el hash, nunca el token en claro.
- `.../domain/errors/user.errors.ts` — `EmailAlreadyRegisteredError`.
- `.../domain/errors/email-verification.errors.ts` —
  `InvalidVerificationTokenError`, `VerificationTokenExpiredError`.
- `.../domain/ports/password-hasher.ts` — `PasswordHasher` + `PASSWORD_HASHER`.
- `.../domain/ports/email-verification-sender.ts` — `EmailVerificationSender`
  + `EMAIL_VERIFICATION_SENDER` + `EmailVerificationMessage`.
- `.../domain/repositories/user.repository.ts` — interface + `USER_REPOSITORY`
  + tipo `NewUser`.
- `.../domain/repositories/email-verification-token.repository.ts` — interface
  + `EMAIL_VERIFICATION_TOKEN_REPOSITORY` + `NewEmailVerificationToken`.

### Módulo `auth` — application
- `.../application/dto/register-user.dto.ts` — `RegisterUserSchema` (zod).
- `.../application/dto/verify-email.dto.ts` — `VerifyEmailSchema`.
- `.../application/verification-token.ts` — `generateVerificationToken()`
  (32 bytes aleatorios en base64url), `hashVerificationToken()` (SHA-256 hex)
  y `VERIFICATION_TOKEN_TTL_MS` (24 h fijas).
- `.../application/use-cases/register-user.use-case.ts`
- `.../application/use-cases/verify-email.use-case.ts`

### Módulo `auth` — infrastructure
- `.../infrastructure/security/argon2-password-hasher.ts` — único archivo del
  proyecto que importa `argon2`.
- `.../infrastructure/email/console-email-verification-sender.ts` — patrón
  `EMAIL_ENABLED=false`: log estructurado en vez de SES.
- `.../infrastructure/repositories/user.drizzle.repository.ts` — genera el
  UUIDv7 del usuario y mapea fila ↔ entidad.
- `.../infrastructure/repositories/email-verification-token.drizzle.repository.ts`
- `.../infrastructure/mappers/user-response.mapper.ts` — lista explícita de
  campos de salida (R14).
- `.../infrastructure/auth.controller.ts` — `POST /v1/auth/register` (201) y
  `POST /v1/auth/verify-email` (200); parseo zod → 400, errores de dominio →
  409 / 400 / 410.
- `.../modules/auth/auth.module.ts` — wiring de tokens.

### Tests (todos unitarios, con dobles; sin Postgres)
- `.../application/dto/register-user.dto.spec.ts` (R1, R3, R4, R5)
- `.../application/verification-token.spec.ts` (R6)
- `.../application/use-cases/register-user.use-case.spec.ts` (R1, R2, R6, R7,
  R12, R15)
- `.../application/use-cases/verify-email.use-case.spec.ts` (R8-R11, R13)
- `.../infrastructure/auth.controller.spec.ts` (R1-R5, R7-R11, R14)
- `.../infrastructure/mappers/user-response.mapper.spec.ts` (R14)
- `.../infrastructure/security/argon2-password-hasher.spec.ts` (R1)
- `.../infrastructure/repositories/user.drizzle.repository.spec.ts` (R1, R15)
- `.../infrastructure/email/console-email-verification-sender.spec.ts` (R6, R7)
- `.../modules/auth/auth.module.spec.ts` — red de seguridad de DI (compila el
  módulo con dobles de `DRIZZLE`/`AUDIT_LOGGER`); no cubre un requisito
  puntual, por eso su `describe` no lleva R-id.

## Archivos modificados
- `backend-pet-tracker/package.json` + `pnpm-lock.yaml` — dependencias
  `argon2` y `uuidv7`.
- `backend-pet-tracker/src/db/schema/index.ts` — quita `schemaBootstrap`,
  exporta las 3 tablas nuevas.
- `backend-pet-tracker/src/app.module.ts` — importa `AuditModule` y
  `AuthModule`.
- `.env.example` — agrega `EMAIL_ENABLED=false` (mismo commit que el código
  que la consume).
- `docs/conventions.md` — fila `EMAIL_ENABLED` en la tabla de variables de
  entorno.
- `docs/data-model.md` — agrega la fila `email_verification_tokens` al
  catálogo (la tabla la crea esta feature; el catálogo no la tenía).
- `specs/auth-registration/traceability.md` — 15 filas completas.
- `specs/auth-registration/tasks.md` — checkboxes marcadas.

## Archivos borrados
- `backend-pet-tracker/src/db/schema/bootstrap.schema.ts` — placeholder de
  `db-setup-drizzle` (#1), que su propio comentario mandaba borrar en cuanto
  aterrizara la primera feature con tablas de dominio reales. No quedó ningún
  test huérfano: ningún spec lo referenciaba por nombre.

## Requisitos cubiertos

Rutas relativas a `backend-pet-tracker/src/`. Detalle completo (con el nombre
de cada `describe`) en `specs/auth-registration/traceability.md`.

- R1: `modules/auth/application/use-cases/register-user.use-case.spec.ts::R1`,
  `modules/auth/infrastructure/auth.controller.spec.ts::R1`,
  `modules/auth/infrastructure/repositories/user.drizzle.repository.spec.ts::R1`,
  `modules/auth/infrastructure/security/argon2-password-hasher.spec.ts::R1`,
  commit `92dbda4`
- R2: `modules/auth/application/use-cases/register-user.use-case.spec.ts::R2`,
  `modules/auth/infrastructure/auth.controller.spec.ts::R2`, commit `92dbda4`
- R3: `modules/auth/infrastructure/auth.controller.spec.ts::R3`,
  `modules/auth/application/dto/register-user.dto.spec.ts::R3`, commit `92dbda4`
- R4: `modules/auth/infrastructure/auth.controller.spec.ts::R4`,
  `modules/auth/application/dto/register-user.dto.spec.ts::R4`, commit `92dbda4`
- R5: `modules/auth/infrastructure/auth.controller.spec.ts::R5`,
  `modules/auth/application/dto/register-user.dto.spec.ts::R5`, commit `92dbda4`
- R6: `modules/auth/application/use-cases/register-user.use-case.spec.ts::R6`,
  `modules/auth/application/verification-token.spec.ts::R6`,
  `modules/auth/infrastructure/email/console-email-verification-sender.spec.ts::R6`,
  commit `870f253`
- R7: `modules/auth/infrastructure/auth.controller.spec.ts::R7`,
  `modules/auth/application/use-cases/register-user.use-case.spec.ts::R7`,
  `modules/auth/infrastructure/email/console-email-verification-sender.spec.ts::R7`,
  commit `870f253`
- R8: `modules/auth/application/use-cases/verify-email.use-case.spec.ts::R8`,
  `modules/auth/infrastructure/auth.controller.spec.ts::R8`, commit `c21ce31`
- R9: `modules/auth/application/use-cases/verify-email.use-case.spec.ts::R9`,
  `modules/auth/infrastructure/auth.controller.spec.ts::R9`, commit `c21ce31`
- R10: `modules/auth/application/use-cases/verify-email.use-case.spec.ts::R10`,
  `modules/auth/infrastructure/auth.controller.spec.ts::R10`, commit `c21ce31`
- R11: `modules/auth/application/use-cases/verify-email.use-case.spec.ts::R11`,
  `modules/auth/infrastructure/auth.controller.spec.ts::R11`, commit `c21ce31`
- R12: `modules/auth/application/use-cases/register-user.use-case.spec.ts::R12`,
  commit `e964260`
- R13: `modules/auth/application/use-cases/verify-email.use-case.spec.ts::R13`,
  commit `c21ce31`
- R14: `modules/auth/infrastructure/mappers/user-response.mapper.spec.ts::R14`,
  `modules/auth/infrastructure/auth.controller.spec.ts::R14`, commit `92dbda4`
- R15: `modules/auth/application/use-cases/register-user.use-case.spec.ts::R15`,
  `modules/auth/infrastructure/repositories/user.drizzle.repository.spec.ts::R15`,
  commit `92dbda4`

Commits de la feature (todos en `feature/3-auth-registration`):

| Commit | Alcance |
|---|---|
| `aa584e4` | chore: schema, migraciones, deps y módulo de auditoría (setup previo de tasks.md) |
| `92dbda4` | R1, R2, R3, R4, R5, R14, R15 |
| `870f253` | R6, R7 |
| `e964260` | R12 |
| `c21ce31` | R8, R9, R10, R11, R13 |
| (este) | test de wiring del módulo + tasks/traceability + reporte |

## Decisiones de diseño

Las decisiones grandes venían dadas por `specs/auth-registration/design.md`
(argon2id detrás de puerto, UUIDv7 en el repositorio, tabla propia de tokens
con SHA-256, `EMAIL_ENABLED=false`, `audit_log` en `src/audit/`, serialización
por lista explícita) y se respetaron sin desviaciones. Lo que tuve que decidir
por debajo de ese nivel:

- **Dos migraciones en vez de una**: `drizzle-kit generate` abre un prompt
  interactivo de "¿renombraste `schema_bootstrap` a X?" cuando en el mismo
  diff hay tablas creadas y borradas, y aborta sin TTY. Solución: generar
  primero el CREATE de las 3 tablas (0001) y después el DROP del placeholder
  (0002). Ambas salen del generador, ninguna se escribió a mano.
- **`entity_id` de `audit_log` como `uuid NOT NULL`**: `docs/data-model.md`
  solo marca `user_id` como NULL, así que el resto queda NOT NULL, y todas las
  PKs de dominio del catálogo son uuid.
- **Normalización de email en el caso de uso** (`normalizeEmail`, minúsculas +
  trim) en vez de `lower()` en la query: así R2 queda cubierto por un test
  unitario del caso de uso y la columna `email` puede seguir con un UNIQUE
  simple, sin índice funcional.
- **Token usado se trata como token inválido** (mismo error, mismo 400) en vez
  de un error propio: R11 pide 400 igual que R9, y no distinguirlos evita
  filtrar al cliente si un token existió alguna vez. Consecuencia deliberada:
  si un token está usado *y* expirado, gana el 400 (hay un test para ese caso).
- **`EMAIL_ENABLED=true` no rompe el registro**: como todavía no hay proveedor
  real cableado, el sender loguea un `warn` explicando que la entrega real no
  está implementada y sigue escribiendo el log estructurado. La alternativa
  (lanzar) haría fallar el registro entero por una variable de entorno.
- **`parseBody` (zod → 400) como función del propio `auth.controller.ts`** en
  vez de un `ZodValidationPipe` global: `docs/conventions.md` ofrece las dos
  vías y la spec describe la validación explícita en el controller. Cuando una
  segunda feature necesite lo mismo, ése es el momento de extraer el pipe.
- **`application/verification-token.ts`** es el único archivo que no estaba
  enumerado en la estructura del design: la generación/hasheo del token se
  comparte entre los dos casos de uso y no cabía en `domain/` sin meter
  `node:crypto` ahí. Es aditivo, no cambia ninguna decisión del design.
- **`char(64)` para `token_hash` y `char(2)` para `country`**: longitud fija
  conocida (SHA-256 hex, ISO 3166-1 alpha-2).

## Output de build

```
> backend-pet-tracker@0.0.1 build
> nest build && tsc-alias -p tsconfig.build.json

✅ Build exitoso
```

## Output de tests

```
> backend-pet-tracker@0.0.1 test
> jest "--passWithNoTests"

Test Suites: 30 passed, 30 total
Tests:       99 passed, 99 total
Snapshots:   0 total
Time:        5.299 s
Ran all test suites.
✅ Tests pasados
```

`./init.sh` completo, verde de punta a punta (build + tests + lint +
typecheck):

```
→ Build...        ✅ Build exitoso
→ Ejecutando tests... ✅ Tests pasados   (30 suites / 99 tests)
→ Lint...         ✅ Lint sin errores
→ Typecheck...    ✅ Typecheck sin errores
✅ Todo verde. Listo para trabajar.
```

Baseline previo: 19 suites / 33 tests. No se rompió ningún test existente.

## Notas para el reviewer

1. **Verificación pendiente contra Postgres real (lo más importante).** En
   este entorno el daemon de Docker no está disponible
   (`docker compose ps` → "failed to connect to the docker API"), así que no
   pude aplicar las migraciones ni correr un e2e. Deliberadamente **no** dejé
   un `test/auth-registration.e2e-spec.ts` sin ejecutar: preferí no versionar
   un e2e que nadie ha visto pasar. Lo que sí está verificado de los
   repositorios Drizzle: tipos (`$inferSelect`/`$inferInsert` vía typecheck),
   generación de UUIDv7, y que el insert de `users` solo manda columnas que
   existen en la tabla (dobles del cliente Drizzle). Lo que **no** está
   verificado en ejecución: el SQL real de las migraciones, el `returning()`
   del insert y los `update ... where` de `markEmailVerified`/`markUsed`.
   Si puedes levantar Docker: `docker compose up -d` y
   `pnpm -C backend-pet-tracker exec drizzle-kit migrate` aplican el schema
   (no hay script `db:migrate`; `db:generate` es lo único que dejó la feature
   #1 — si el proyecto lo quiere, es una tarea aparte).
2. **Migración 0002 borra `schema_bootstrap`.** Si alguien tiene una base
   local ya migrada con 0000, al aplicar 0001+0002 pierde esa tabla — es
   exactamente lo que la feature pedía y la tabla no tenía datos de negocio.
3. **`docs/data-model.md`**: añadí la fila `email_verification_tokens`, que no
   estaba en el catálogo aunque la spec la exige. Es la única edición de docs
   fuera de las dos que el prompt pedía (`.env.example` y `conventions.md`);
   si prefieres que el catálogo lo toque solo el leader, revierte esa línea.
4. **Nota del design para el leader**, la repito porque es fácil que se
   pierda: la spec de `pets-crud-permissions` (#5) dice que crea `audit_log`.
   Ya existe desde aquí — hay que ajustar esa descripción para que la reutilice
   y no genere una migración duplicada.
5. **Dónde mirar la seguridad**: el token en claro solo aparece en
   `generateVerificationToken()`, en el `EmailVerificationMessage` que recibe
   el sender y en el log estructurado. No hay ninguna ruta desde ahí al body
   HTTP (el caso de uso devuelve `User`, y `toUserResponse` es una lista
   explícita de 8 campos). El test de R7 en `auth.controller.spec.ts` fija esa
   lista exacta, así que cualquier campo nuevo que alguien agregue al mapper
   rompe el test a propósito.
6. **`argon2` es una dependencia nativa** pero trae prebuilds para
   `linux-x64`, `win32-x64`, `darwin-arm64`, etc. dentro del paquete, así que
   funciona con los build scripts ignorados por pnpm 10 (verificado en local;
   CI corre `ubuntu-latest`/linux-x64, que está entre los prebuilds).
7. **`feature_list.json` sigue en `in_progress`** y `STATUS.md` no se tocó:
   marcar `done` es del reviewer/leader.

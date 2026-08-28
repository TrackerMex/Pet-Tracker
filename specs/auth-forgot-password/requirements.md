---
feature: "auth-forgot-password"
status: draft        # draft | approved
tags: [harness, spec, backend]
---

# Requisitos — [[auth-forgot-password]]

> Notación EARS. Cada requisito tiene id único R<n>, inmutable una vez
> aprobado. Ver [[design]] (D1–D12) para las decisiones técnicas y
> `docs/architecture.md` para las reglas de capas.
>
> Fuente: `feature_list.json` id 44 (description + acceptance_criteria),
> anotada al backlog por `specs/mobile-auth/requirements.md` R9 (2026-08-20).
> Feature de **backend puro** (NestJS + pnpm + Drizzle/Postgres). No toca
> `mobile-pet-tracker/` — C8 de `CHECKPOINTS.md` no aplica.
>
> Endpoints cubiertos: `POST /v1/auth/forgot-password` y
> `POST /v1/auth/reset-password`. Ambos son `@Public()` (prefijo global `v1`
> en `src/main.ts`).
>
> Aplican `docs/conventions.md`: zod en el borde HTTP, errores de dominio
> tipados mapeados a HTTP en el controller, alias `@/...` para cruces de
> capa, `ConfigService` en vez de `process.env`, tests que nombran su R-id.
> Contratos verificados contra el código real el 2026-08-28
> (`src/modules/auth/**`, `src/db/schema/email-verification-tokens.schema.ts`,
> `src/db/schema/users.schema.ts`, `src/db/migrations/meta/_journal.json`,
> `src/modules/users/application/use-cases/*.spec.ts`, `package.json`).

## Contexto fijo (no reabrir)

Todo lo de esta sección está verificado en el código y **cerrado**. Codex no
tiene acceso a la conversación que originó esta spec: nada de aquí se
renegocia durante la implementación.

### El patrón existente de verify-email (se reutiliza tal cual)

- `src/modules/auth/application/verification-token.ts` es el patrón canónico:
  `generateVerificationToken()` = 32 bytes aleatorios (`node:crypto`
  `randomBytes`) en base64url; `hashVerificationToken()` = SHA-256 hex.
  **Solo se persiste el hash**; el valor en claro nunca toca la base ni la
  respuesta HTTP. Esta feature **importa esas dos funciones sin
  modificarlas** ([[design]] §D1) — no se crea un generador nuevo.
- `email_verification_tokens` (`src/db/schema/email-verification-tokens.schema.ts`):
  `id uuid PK`, `user_id uuid FK CASCADE`, `token_hash char(64) UNIQUE`,
  `expires_at timestamptz NOT NULL`, `used_at timestamptz NULL`,
  `created_at timestamptz NOT NULL DEFAULT now()`, índice manual
  `email_verification_tokens_user_id_idx` sobre la FK. `password_reset_tokens`
  copia esa forma exacta ([[design]] §D5).
- `VerifyEmailUseCase` trata token inexistente y token ya consumido como el
  **mismo** error (`InvalidVerificationTokenError` → 400) y el expirado como
  `VerificationTokenExpiredError` → 410 (`GoneException`). Esta feature repite
  ese mapeo literal para el reset ([[design]] §D7).
- El id de fila lo genera el repositorio con `uuidv7()`, no la base
  (`EmailVerificationTokenDrizzleRepository.create`).

### Defecto del patrón existente y qué hace esta feature con él

- **Defecto**: `verify-email` **no invalida** los demás tokens vivos del
  mismo usuario al consumir uno, ni al emitir uno nuevo. Para verificar un
  email es inocuo; para un reset de contraseña no lo es (un token viejo
  filtrado sigue sirviendo después de que el usuario ya se recuperó).
  **Decisión: esta feature MEJORA el patrón** (R4, R5) con una sola
  operación `invalidateAllForUser`. **No se retrofitea `verify-email`**: es
  una feature `done` con spec aprobada, tocarla queda fuera de contención.
- **No es defecto**: SHA-256 (y no argon2) sobre el token es correcto — el
  token ya tiene 256 bits de entropía, no necesita un hash lento. La
  búsqueda por `token_hash` UNIQUE no necesita comparación en tiempo
  constante: es un lookup indexado por hash, no una comparación de secreto.

### Entrega del token: no hay email real en el repositorio

- Verificado: **el repo no tiene ningún envío de correo**. `EMAIL_ENABLED`
  existe pero `ConsoleEmailVerificationSender` solo escribe un log
  estructurado; con `EMAIL_ENABLED=true` emite un `logger.warn` diciendo que
  no hay proveedor cableado y sigue logueando. No hay SES (LocalStack
  Community no lo emula, `docs/architecture.md` §Adaptación local), ni
  `nodemailer`, ni ninguna dependencia de correo en `package.json`.
- **Decisión cerrada**: el token de reset se entrega por el **mismo
  mecanismo**, con un puerto propio y su adaptador de consola
  (`ConsolePasswordResetSender`, evento `auth.password_reset.issued`) —
  [[design]] §D2. **No se añade ninguna dependencia ni proveedor nuevo**, y
  **no se introduce ninguna variable de entorno nueva**: se reutiliza
  `EMAIL_ENABLED`, ya documentada en `docs/conventions.md`.
- **Decisión abierta señalada (§Decisiones abiertas)**: el proveedor de
  correo real de producción tiene coste y no lo decide una IA.

### Rate limiting y enumeración de cuentas

- Verificado: **el repo no tiene throttling de ningún tipo**
  (`@nestjs/throttler` no está instalado; cero ocurrencias de
  `throttl|rate-limit` en `src/`, `test/`, `package.json`). `auth-registration`
  ya dejó rate limiting fuera de alcance explícitamente.
- La respuesta uniforme de R2 cierra la enumeración **por cuerpo y por
  código de estado**. El canal de **timing** queda abierto y **fuera de
  alcance**, con justificación en [[design]] §D3: (a) la diferencia real es
  un `INSERT` + un `UPDATE` (milisegundos), no un argon2 — este endpoint
  nunca hashea una contraseña; (b) mitigarla es irrelevante mientras
  `POST /v1/auth/register` siga devolviendo `409` para email duplicado y
  `201` para nuevo, que es un oráculo de enumeración **exacto, de un solo
  intento y preexistente**. Igualar el timing aquí sería teatro de
  seguridad. Ambas cosas — throttling y el oráculo del `409` de `register` —
  se anotan al backlog (§Deuda que esta feature deja anotada).

### Invalidación de sesiones tras el reset

- Verificado: `JwtTokenService` firma HS256 con `JWT_SECRET`, sin `jti`, con
  `ACCESS_TOKEN_TTL_SECONDS = 24 * 60 * 60`; `AuthGuard` **solo verifica la
  firma y no consulta `users`** (contrato de `auth-login-me` R8). No existe
  lista de revocación.
- **Consecuencia, aceptada y explícita**: tras un reset exitoso, los
  `access_token` ya emitidos siguen siendo válidos hasta **24 h**. Un
  atacante con una sesión robada la conserva ese tiempo aunque la víctima
  cambie la contraseña.
- **Decisión cerrada: fuera de alcance.** Revocar exigiría o bien
  `users.password_changed_at` + lectura de base en el `AuthGuard` en **cada
  request autenticado** (rompe el contrato DB-free del guard y toca todos
  los e2e del repo), o bien una tabla de revocación con el mismo coste. El
  radio de explosión desborda una feature P3 de auth. Se anota al backlog
  (§Deuda). Esta spec **no afirma** que el reset cierre sesiones: R5 dice
  exactamente lo que hace y nada más.

### Contrato HTTP fijado

| Endpoint | Éxito | Body de éxito | Errores |
|---|---|---|---|
| `POST /v1/auth/forgot-password` | `200` | `{ "requested": true }` | `400` solo si el payload no valida (zod) |
| `POST /v1/auth/reset-password` | `200` | `{ "reset": true }` | `400` payload inválido / token inexistente o ya usado; `410` token expirado |

`200` (y no `202`) por consistencia con `POST /v1/auth/verify-email`, que ya
devuelve `200 { verified: true }`.

## Requisitos funcionales

### Solicitud de reset — `POST /v1/auth/forgot-password`

- **R1**: WHEN se envía `POST /v1/auth/forgot-password` con un `email` que,
  tras `normalizeEmail` (trim + lowercase, `@/modules/auth/domain/entities/user.entity`),
  corresponde a una fila de `users`, THE SYSTEM SHALL: generar un token
  opaco con `generateVerificationToken()`; insertar en `password_reset_tokens`
  una fila con `id` UUIDv7 generado en la app, `user_id` del usuario,
  `token_hash` = `hashVerificationToken(token)` (SHA-256 hex, 64 chars),
  `expires_at` = instante de la petición + `PASSWORD_RESET_TOKEN_TTL_MS`
  (`60 * 60 * 1000`, una hora — [[design]] §D6) y `used_at = NULL`; entregar
  el token en claro **solo** al `PasswordResetSender`; y responder `200` con
  body exactamente `{ "requested": true }`.
  *Tests (ROJO primero):*
  - `src/modules/auth/application/use-cases/request-password-reset.use-case.spec.ts`
    → `describe('R1: la solicitud con cuenta existente emite un token hasheado con expiracion de una hora', ...)`
  - `src/modules/auth/infrastructure/auth.controller.spec.ts`
    → `describe('R1: POST /v1/auth/forgot-password responde 200 con requested true', ...)`

- **R2**: IF el `email` recibido por `POST /v1/auth/forgot-password` no
  corresponde a ninguna fila de `users` (comparación tras `normalizeEmail`)
  THEN THE SYSTEM SHALL responder con **exactamente el mismo** código de
  estado (`200`) y el mismo body (`{ "requested": true }`) que en R1, AND
  SHALL no insertar ninguna fila en `password_reset_tokens`, AND SHALL no
  invocar `PasswordResetSender.send`, AND SHALL no escribir ninguna fila en
  `audit_log` — la ausencia de cuenta no es observable por el cliente en
  ningún campo de la respuesta.
  *Tests (ROJO primero):*
  - `src/modules/auth/application/use-cases/request-password-reset.use-case.spec.ts`
    → `describe('R2: la solicitud con email inexistente no emite token ni revela la ausencia de cuenta', ...)`
  - `src/modules/auth/infrastructure/auth.controller.spec.ts`
    → `describe('R2: POST /v1/auth/forgot-password responde igual exista o no la cuenta', ...)`
    (el test compara `status` y `body` de los dos casos y asserta igualdad
    estructural, no dos literales escritos a mano)
  - `test/auth-forgot-password.e2e-spec.ts`
    → `describe('R2: forgot-password responde identico para cuenta existente e inexistente', ...)`

- **R3**: IF el payload de `POST /v1/auth/forgot-password` no valida contra
  `ForgotPasswordSchema` (`email` ausente, no string, o con formato inválido
  según `z.email()`, o de más de 320 caracteres) THEN THE SYSTEM SHALL
  responder `400` con el detalle por campo mapeado desde `ZodError` por el
  helper `parseBody` ya existente en `auth.controller.ts`, sin insertar
  ninguna fila ni invocar al sender. Un payload malformado no es un oráculo
  de registro: el `400` depende solo de la forma del email, nunca de si
  existe.
  *Test (ROJO primero):* `src/modules/auth/infrastructure/auth.controller.spec.ts`
  → `describe('R3: POST /v1/auth/forgot-password con payload invalido responde 400', ...)`

- **R4**: WHEN se emite un token de reset según R1 para un usuario que ya
  tenía uno o más tokens de reset **sin consumir** (`used_at IS NULL`), THE
  SYSTEM SHALL marcar todos esos tokens previos como consumidos
  (`used_at` = instante de la petición) **antes** de insertar el nuevo, de
  modo que en todo momento exista como máximo un token de reset utilizable
  por usuario. Esta es la mejora deliberada sobre el patrón de
  `verify-email` descrita en §Contexto fijo.
  *Tests (ROJO primero):*
  - `src/modules/auth/application/use-cases/request-password-reset.use-case.spec.ts`
    → `describe('R4: una nueva solicitud invalida los tokens de reset anteriores del usuario', ...)`
  - `test/auth-forgot-password.e2e-spec.ts`
    → `describe('R4: el token anterior deja de servir cuando se pide uno nuevo', ...)`

### Reset — `POST /v1/auth/reset-password`

- **R5**: WHEN se envía `POST /v1/auth/reset-password` con un `token` que
  existe en `password_reset_tokens`, tiene `used_at IS NULL` y su
  `expires_at` es posterior al instante de la petición, y con `password` /
  `passwordConfirmation` válidos e idénticos, THE SYSTEM SHALL: sustituir
  `users.password_hash` del usuario dueño del token por el hash argon2id de
  la nueva contraseña producido por `PasswordHasher.hash` (el
  `Argon2PasswordHasher` ya existente, sin tocarlo); actualizar
  `users.updated_at` al instante de la petición; marcar como consumidos
  (`used_at` = ese instante) **todos** los tokens de reset sin usar de ese
  usuario, incluido el presentado; y responder `200` con body exactamente
  `{ "reset": true }`.
  *Tests (ROJO primero):*
  - `src/modules/auth/application/use-cases/reset-password.use-case.spec.ts`
    → `describe('R5: el token vigente cambia el password y consume todos los tokens del usuario', ...)`
  - `src/modules/auth/infrastructure/auth.controller.spec.ts`
    → `describe('R5: POST /v1/auth/reset-password con token valido responde 200', ...)`
  - `test/auth-forgot-password.e2e-spec.ts`
    → `describe('R5: el reset persiste un password_hash nuevo y consume el token', ...)`

- **R6**: IF el `token` enviado a `POST /v1/auth/reset-password` no existe, o
  existe pero ya fue consumido (`used_at IS NOT NULL`, sea por un reset
  anterior o por la invalidación de R4/R5), THEN THE SYSTEM SHALL lanzar
  `InvalidPasswordResetTokenError` desde la capa application y responder
  `400`, sin modificar `users.password_hash` ni `users.updated_at` de ningún
  usuario. Los dos casos son indistinguibles para el cliente a propósito
  (mismo criterio que `verify-email` R9/R11).
  *Tests (ROJO primero):*
  - `src/modules/auth/application/use-cases/reset-password.use-case.spec.ts`
    → `describe('R6: un token inexistente o ya consumido no cambia ningun password', ...)`
  - `src/modules/auth/infrastructure/auth.controller.spec.ts`
    → `describe('R6: POST /v1/auth/reset-password con token invalido o usado responde 400', ...)`

- **R7**: IF el `token` enviado a `POST /v1/auth/reset-password` existe y no
  fue consumido, pero su `expires_at` es anterior o igual al instante de la
  petición, THEN THE SYSTEM SHALL lanzar `PasswordResetTokenExpiredError` y
  responder `410` (`GoneException`), sin modificar `users.password_hash` ni
  consumir token alguno.
  *Tests (ROJO primero):*
  - `src/modules/auth/application/use-cases/reset-password.use-case.spec.ts`
    → `describe('R7: un token expirado no cambia el password', ...)`
  - `src/modules/auth/infrastructure/auth.controller.spec.ts`
    → `describe('R7: POST /v1/auth/reset-password con token expirado responde 410', ...)`

- **R8**: IF el payload de `POST /v1/auth/reset-password` no valida contra
  `ResetPasswordSchema` — `token` ausente/vacío/de más de 256 caracteres,
  `password` de menos de 8 o más de 128 caracteres, o `passwordConfirmation`
  distinto de `password` — THEN THE SYSTEM SHALL responder `400` con el
  detalle por campo mapeado desde `ZodError`, **antes** de consultar la
  base, sin consumir el token ni modificar ninguna fila.
  *Test (ROJO primero):* `src/modules/auth/infrastructure/auth.controller.spec.ts`
  → `describe('R8: POST /v1/auth/reset-password con payload invalido responde 400', ...)`

- **R9**: WHEN un reset se completa con éxito según R5, THE SYSTEM SHALL
  dejar el login coherente con el cambio: `POST /v1/auth/login` con la
  contraseña **anterior** SHALL responder `401` y con la contraseña
  **nueva** SHALL responder `200` con `access_token`. Este requisito es la
  prueba de extremo a extremo de que el nuevo hash es el que verifica
  `Argon2PasswordHasher.verify`, y se cubre contra Postgres real.
  *Test (ROJO primero):* `test/auth-forgot-password.e2e-spec.ts`
  → `describe('R9: tras el reset el login viejo falla y el nuevo funciona', ...)`

### No exposición del token

- **R10**: THE SYSTEM SHALL no incluir nunca el token de reset en claro en el
  body de la respuesta HTTP de `POST /v1/auth/forgot-password` ni en la de
  ningún otro endpoint, AND SHALL no persistir nunca su valor en claro:
  `password_reset_tokens.token_hash` guarda solo el SHA-256 hex de 64
  caracteres. WHILE no exista proveedor de correo cableado, el único lugar
  donde el token en claro es observable SHALL ser el log estructurado del
  servidor emitido por `ConsolePasswordResetSender` con
  `event: 'auth.password_reset.issued'` y los campos `userId`, `email`,
  `token`, `expiresAt`; AND IF `EMAIL_ENABLED=true` THEN el adaptador SHALL
  emitir además un `logger.warn` avisando de que no hay proveedor real
  cableado (mismo comportamiento que `ConsoleEmailVerificationSender`) y
  loguear igualmente.
  *Tests (ROJO primero):*
  - `src/modules/auth/infrastructure/email/console-password-reset-sender.spec.ts`
    → `describe('R10: con EMAIL_ENABLED=false el token de reset se loguea en vez de enviarse', ...)`
    y `describe('R10: con EMAIL_ENABLED=true avisa de que no hay proveedor real cableado', ...)`
  - `src/modules/auth/infrastructure/auth.controller.spec.ts`
    → `describe('R10: la respuesta de forgot-password nunca incluye el token', ...)`
  - `test/auth-forgot-password.e2e-spec.ts`
    → `describe('R10: la base guarda el SHA-256 del token, nunca el valor en claro', ...)`
    (asserta que ninguna fila de `password_reset_tokens` contiene el token en
    claro y que `token_hash` es exactamente `sha256(token)` en hex)

### Auditoría

- **R11**: WHEN se emite un token según R1, THE SYSTEM SHALL insertar una
  fila en `audit_log` con `action = 'user.password_reset_requested'`,
  `entity = 'user'`, `entity_id` y `user_id` iguales al id del usuario; AND
  WHEN un reset se completa según R5, THE SYSTEM SHALL insertar una fila con
  `action = 'user.password_reset'`, `entity = 'user'`, `entity_id` y
  `user_id` iguales al id del usuario; AND IF el email no corresponde a
  ninguna cuenta (R2) THEN THE SYSTEM SHALL no insertar fila alguna — no hay
  entidad que auditar y el log no debe acumular emails tecleados por
  terceros.
  *Tests (ROJO primero):*
  - `src/modules/auth/application/use-cases/request-password-reset.use-case.spec.ts`
    → `describe('R11: la solicitud con cuenta existente audita user.password_reset_requested y la inexistente no audita nada', ...)`
  - `src/modules/auth/application/use-cases/reset-password.use-case.spec.ts`
    → `describe('R11: el reset exitoso audita user.password_reset', ...)`

### Esquema y migración

- **R12**: THE SYSTEM SHALL crear la tabla `password_reset_tokens` mediante
  la migración `src/db/migrations/0015_auth_password_reset_tokens.sql` con
  exactamente estas columnas y restricciones: `id uuid PRIMARY KEY NOT NULL`;
  `user_id uuid NOT NULL` con FK a `users(id)` `ON DELETE CASCADE`;
  `token_hash char(64) NOT NULL UNIQUE`; `expires_at timestamptz NOT NULL`;
  `used_at timestamptz NULL`; `created_at timestamptz NOT NULL DEFAULT now()`;
  AND SHALL crear el índice `password_reset_tokens_user_id_idx` sobre
  `user_id` (regla "toda columna FK lleva índice manual" de
  `docs/data-model.md`); AND el barrel `src/db/schema/index.ts` SHALL
  reexportar la tabla; AND `docs/data-model.md` SHALL documentarla con una
  fila propia en el catálogo de tablas.
  *Test (ROJO primero):* `src/db/schema/password-reset-tokens.schema.spec.ts`
  → `describe('R12: password_reset_tokens espeja el patron de email_verification_tokens', ...)`
  — valida columnas, tipos, nullability, UNIQUE e índice vía
  `getTableConfig(passwordResetTokens)` y el SQL de la migración `0015_*`
  leído del disco (patrón exacto de `src/db/schema/push-tokens.schema.spec.ts`).

### Regresión y contención

- **R13**: WHEN se ejecutan `pnpm -C backend-pet-tracker run lint`,
  `pnpm -C backend-pet-tracker exec tsc --noEmit`,
  `pnpm -C backend-pet-tracker test`,
  `pnpm -C backend-pet-tracker run test:e2e` (con `docker compose up -d`) y
  `./init.sh` tras los cambios, THE SYSTEM SHALL salir con exit 0 y sin
  ninguna regresión en las suites existentes; AND el diff de la feature
  SHALL tocar **solo** los ficheros de esta allowlist:

  **Nuevos**
  1. `backend-pet-tracker/src/db/schema/password-reset-tokens.schema.ts`
  2. `backend-pet-tracker/src/db/schema/password-reset-tokens.schema.spec.ts`
  3. `backend-pet-tracker/src/db/migrations/0015_auth_password_reset_tokens.sql`
  4. `backend-pet-tracker/src/db/migrations/meta/0015_snapshot.json` (generado por `db:generate`)
  5. `backend-pet-tracker/src/modules/auth/domain/entities/password-reset-token.entity.ts`
  6. `backend-pet-tracker/src/modules/auth/domain/errors/password-reset.errors.ts`
  7. `backend-pet-tracker/src/modules/auth/domain/ports/password-reset-sender.ts`
  8. `backend-pet-tracker/src/modules/auth/domain/repositories/password-reset-token.repository.ts`
  9. `backend-pet-tracker/src/modules/auth/application/dto/forgot-password.dto.ts`
  10. `backend-pet-tracker/src/modules/auth/application/dto/reset-password.dto.ts`
  11. `backend-pet-tracker/src/modules/auth/application/use-cases/request-password-reset.use-case.ts`
  12. `backend-pet-tracker/src/modules/auth/application/use-cases/request-password-reset.use-case.spec.ts`
  13. `backend-pet-tracker/src/modules/auth/application/use-cases/reset-password.use-case.ts`
  14. `backend-pet-tracker/src/modules/auth/application/use-cases/reset-password.use-case.spec.ts`
  15. `backend-pet-tracker/src/modules/auth/infrastructure/email/console-password-reset-sender.ts`
  16. `backend-pet-tracker/src/modules/auth/infrastructure/email/console-password-reset-sender.spec.ts`
  17. `backend-pet-tracker/src/modules/auth/infrastructure/repositories/password-reset-token.drizzle.repository.ts`
  18. `backend-pet-tracker/test/auth-forgot-password.e2e-spec.ts`

  **Modificados (y solo en lo que dice [[design]] §D12)**
  19. `backend-pet-tracker/src/db/schema/index.ts` — una línea `export *`
  20. `backend-pet-tracker/src/db/migrations/meta/_journal.json` — una entrada `idx: 15`, `tag: "0015_auth_password_reset_tokens"`
  21. `backend-pet-tracker/src/modules/auth/application/verification-token.ts` — solo añade `PASSWORD_RESET_TOKEN_TTL_MS`; las dos funciones existentes no se tocan
  22. `backend-pet-tracker/src/modules/auth/domain/repositories/user.repository.ts` — solo añade `updatePasswordHash` a la interface
  23. `backend-pet-tracker/src/modules/auth/infrastructure/repositories/user.drizzle.repository.ts` — solo añade el método `updatePasswordHash`
  24. `backend-pet-tracker/src/modules/auth/infrastructure/auth.controller.ts` — solo añade los dos handlers, sus imports y el mapeo de los dos errores nuevos
  25. `backend-pet-tracker/src/modules/auth/infrastructure/auth.controller.spec.ts` — nuevos `describe` de R1,R2,R3,R5,R6,R7,R8,R10 y los dos argumentos nuevos del constructor en los tres `new AuthController(...)` existentes
  26. `backend-pet-tracker/src/modules/auth/auth.module.ts` — solo añade los dos use cases y los dos providers nuevos
  27. `backend-pet-tracker/src/modules/auth/auth.module.spec.ts` — solo el `it` que enumera los casos de uso (pasa de tres a cinco)
  28. `backend-pet-tracker/src/modules/auth/application/use-cases/register-user.use-case.spec.ts` — solo `updatePasswordHash: jest.fn()` en el doble de `UserRepository`
  29. `backend-pet-tracker/src/modules/auth/application/use-cases/login-user.use-case.spec.ts` — ídem
  30. `backend-pet-tracker/src/modules/users/application/use-cases/update-profile.use-case.spec.ts` — ídem
  31. `backend-pet-tracker/src/modules/users/application/use-cases/get-profile.use-case.spec.ts` — ídem
  32. `docs/data-model.md` — una fila nueva en el catálogo de tablas
  33. `docs/verification.md` — sección `Feature 44 — auth-forgot-password`

  **Harness** (siempre permitido): `specs/auth-forgot-password/**`,
  `progress/**`, `feature_list.json`, `STATUS.md`.

  AND el diff SHALL **no** tocar `mobile-pet-tracker/` (el stub Forgot de
  `specs/mobile-auth` R9 se queda como está), ni `infra/`, ni
  `.env.example`, ni la tabla de variables de entorno de
  `docs/conventions.md` (esta feature **no introduce ninguna variable de
  entorno nueva**), ni `verify-email.use-case.ts`, ni
  `email-verification-token*`, ni `argon2-password-hasher.ts`, ni
  `jwt-token-service.ts`, ni `auth.guard.ts`, ni ninguna migración anterior
  a la `0015`.
  *Test (ROJO primero):* `test/auth-forgot-password.e2e-spec.ts`
  → `describe('R13: el flujo de verify-email sigue intacto tras anadir el reset', ...)`
  — registra un usuario, verifica su email con el flujo existente y comprueba
  que un token de `email_verification_tokens` **no** sirve como token de
  reset (y viceversa): los dos flujos no se contaminan.
  *Verificación de contención:* el implementer la anota en
  `progress/impl_auth-forgot-password.md`; el reviewer la re-ejecuta con
  ```bash
  git diff --name-only main...HEAD | grep -vE \
    'password-reset|password_reset|auth\.controller|auth\.module|user\.repository|user\.drizzle\.repository|verification-token\.ts|register-user\.use-case\.spec|login-user\.use-case\.spec|users/application/use-cases/(get|update)-profile\.use-case\.spec|db/schema/index\.ts|db/migrations|auth-forgot-password|docs/data-model\.md|docs/verification\.md|^specs/|^progress/|feature_list\.json|STATUS\.md'
  ```
  que debe salir **vacío**.

## Fuera de alcance

- **Activar el stub móvil de Forgot.** `mobile-pet-tracker/src/app/(auth)/forgot.tsx`
  sigue siendo el stub deshabilitado que fijó `specs/mobile-auth` R9
  (2026-08-20): texto `Password recovery coming soon`, `Input testID="forgot-email"`
  con `editable={false}` y `Button testID="forgot-submit"` con `isDisabled`,
  sin llamada de red. **Es una feature de seguimiento**, exactamente como
  #45 `pet-lost-mode` activó el stub de Lost Mode que dejó #36
  `mobile-map-live`: al cerrarse esta #44, el leader anota al backlog una
  feature móvil `mobile-forgot-password` que sustituya el stub por el flujo
  real contra `POST /v1/auth/forgot-password` y `POST /v1/auth/reset-password`.
  Esta spec no toca `mobile-pet-tracker/` (R13).
- **Envío real de email.** Sin proveedor cableado; el token se entrega por
  log estructurado (R10). Ver §Decisiones abiertas.
- **Rate limiting / throttling** sobre `forgot-password`, `reset-password`,
  `register` o `login`. No hay infraestructura de throttling en el repo y
  añadirla es una feature propia (dependencia nueva + almacén compartido).
  `auth-registration` ya la dejó fuera con el mismo criterio.
- **Igualación de timing** entre cuenta existente e inexistente en
  `forgot-password` ([[design]] §D3).
- **Cerrar el oráculo de enumeración de `POST /v1/auth/register`** (`409` vs
  `201`), que es preexistente y mucho más directo que cualquier canal de
  esta feature.
- **Invalidación de los `access_token` ya emitidos tras el reset.** Ventana
  aceptada de hasta 24 h (`ACCESS_TOKEN_TTL_SECONDS`). Ver §Contexto fijo.
- **Retrofitear `verify-email`** con la invalidación de hermanos de R4, o
  unificar ambas tablas de tokens en una sola con columna `purpose`
  ([[design]] §Alternativas descartadas).
- **Limpieza / expiración física** de filas viejas en
  `password_reset_tokens` (job de purga). La tabla crece; con el volumen del
  MVP es irrelevante. Mismo estado que `email_verification_tokens`, que
  tampoco tiene purga.
- **Reenvío del token de verificación de email** (`resend`), ya fuera de
  alcance desde `auth-registration`.
- **Cambio de contraseña autenticado** (`PATCH /v1/me/password` con la
  contraseña actual). Es otro caso de uso, otro endpoint y otra spec.
- **Políticas de complejidad de contraseña** más allá de la longitud 8..128
  ya vigente en `auth-registration`. No se inventan requisitos que el brief
  no pide.
- **Notificar al usuario por email de que su contraseña cambió.** Requiere
  proveedor real; se anota junto a la decisión abierta del correo.

## Decisiones abiertas (las cierra el humano, no una IA)

- **DA1 — Proveedor de correo de producción.** Esta feature entrega el token
  por log estructurado porque el repositorio no tiene envío real y **añadir
  un proveedor cuesta dinero y compromete una cuenta**. Las opciones
  típicas (SES en la cuenta AWS ya desplegada por #20, o un SaaS tipo
  Resend/Postmark) difieren en coste, verificación de dominio y trabajo de
  reputación de envío. **No se asume ninguna.** Cuando el humano decida, el
  cambio es sustituir el `useClass` de `PASSWORD_RESET_SENDER` (y el de
  `EMAIL_VERIFICATION_SENDER`) por un adaptador nuevo: ni los casos de uso ni
  el controller cambian. Esa sustitución es una feature aparte.
- **DA2 — Contenido y formato del enlace de recuperación.** Un email real
  necesita una URL con el token (deep link a la app o página web) y una
  plantilla. Depende de DA1 y del deep linking de la app móvil; hoy el token
  viaja pelado en el log y el cliente lo pega en `reset-password`.

## Deuda que esta feature deja anotada (para el backlog del leader)

1. **Rate limiting de los endpoints de auth** (`register`, `login`,
   `forgot-password`, `reset-password`). Sin él, `forgot-password` es un
   vector de email-bombing en cuanto exista correo real (DA1), y `login` no
   tiene freno de fuerza bruta.
2. **Enumeración de cuentas por `POST /v1/auth/register`**: `409` para email
   existente vs `201` para nuevo es un oráculo exacto de un solo intento.
   Cerrarlo cambia el contrato de una feature `done` y necesita su propia
   spec.
3. **Revocación de sesiones tras cambio de contraseña** (ventana de 24 h
   descrita en §Contexto fijo).
4. **`mobile-forgot-password`**: sustituir el stub de `specs/mobile-auth` R9
   por el flujo real contra los dos endpoints de esta feature.

## Aprobación

- [ ] Aprobado por humano (fecha: ____) ← gate obligatorio antes de implementar
- [ ] DA1 y DA2 revisadas: se acepta cerrar la feature con entrega por log
      estructurado (fecha: ____)

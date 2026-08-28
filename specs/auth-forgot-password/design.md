---
feature: "auth-forgot-password"
status: draft        # draft | approved
tags: [harness, spec, backend]
---

# Diseño — [[auth-forgot-password]]

> Ver [[requirements]] para los requisitos que este diseño implementa y
> [[../../docs/architecture|architecture]] para las reglas de capas.
>
> Principio rector: **esta feature no inventa nada**. Copia el flujo de
> `verify-email` de `auth-registration` (#3), pieza por pieza, y solo se
> desvía donde el requisito de seguridad del reset lo obliga (D6, D8) o
> donde el patrón original tiene un defecto que sí importa aquí (D8).

## Decisiones técnicas

### D1 — Se reutilizan `generateVerificationToken` y `hashVerificationToken`

`src/modules/auth/application/verification-token.ts` ya resuelve exactamente
el problema: token opaco de 256 bits en base64url, persistido solo como
SHA-256 hex. Los dos casos de uso nuevos **importan esas funciones tal
cual** (`import { generateVerificationToken, hashVerificationToken } from '../verification-token'`).

Lo único que se añade a ese fichero es la constante de vigencia del reset:

```typescript
/**
 * Vigencia del token de reset: 1 h. Mas corta que la de verificacion de
 * email (24 h) porque un token de reset otorga toma de control de la
 * cuenta, no solo la confirmacion de una direccion (auth-forgot-password D6).
 */
export const PASSWORD_RESET_TOKEN_TTL_MS = 60 * 60 * 1000;
```

No se renombra el fichero a algo genérico (`opaque-token.ts`): renombrarlo
tocaría `register-user.use-case.ts`, `verify-email.use-case.ts` y
`verification-token.spec.ts`, todos de una spec ya aprobada, a cambio de
cero comportamiento. Sirve a R1, R5.

### D2 — Puerto y adaptador de entrega propios, sin dependencias nuevas

El repositorio **no tiene envío de correo**: `EMAIL_ENABLED` existe pero
`ConsoleEmailVerificationSender` solo escribe un log estructurado, y con
`EMAIL_ENABLED=true` añade un `logger.warn` avisando de que no hay proveedor
cableado. No hay SES (LocalStack Community no lo emula) ni ninguna
dependencia de correo en `package.json`.

Se replica ese patrón con símbolos propios:

- `src/modules/auth/domain/ports/password-reset-sender.ts`
  ```typescript
  export const PASSWORD_RESET_SENDER = Symbol('PasswordResetSender');

  export interface PasswordResetMessage {
    userId: string;
    email: string;
    /** Token en claro: solo se entrega al destinatario, nunca se persiste. */
    token: string;
    expiresAt: Date;
  }

  export interface PasswordResetSender {
    send(message: PasswordResetMessage): Promise<void>;
  }
  ```
- `src/modules/auth/infrastructure/email/console-password-reset-sender.ts` →
  `ConsolePasswordResetSender`, copia literal de
  `ConsoleEmailVerificationSender` salvo el nombre de la clase y el evento:
  `event: 'auth.password_reset.issued'`. Lee `EMAIL_ENABLED` vía
  `ConfigService` (nunca `process.env`).

**Por qué un puerto nuevo y no reutilizar `EmailVerificationSender`**:
reutilizarlo obligaría a ensanchar `EmailVerificationMessage` con un campo
`event` y a tocar `console-email-verification-sender.ts`, su spec y
`register-user.use-case.ts` — cinco ficheros de una spec aprobada, y los
tests R6/R7 de `auth-registration` moverían de significado. Dos ficheros
nuevos y **cero** ficheros existentes tocados es el diff más pequeño en
riesgo, que es el que cuenta. Sirve a R1, R10.

**No se añade variable de entorno.** `EMAIL_ENABLED` ya cubre el gate y ya
está en `docs/conventions.md` y `.env.example`; una `PASSWORD_RESET_ENABLED`
sería una segunda perilla para el mismo interruptor.

### D3 — La respuesta uniforme entra; la igualación de timing no

R2 fija respuesta idéntica en status y body. El canal de timing queda
abierto **a propósito**:

- La diferencia de trabajo entre cuenta existente e inexistente es un
  `UPDATE` (invalidación de R4) + un `INSERT` + un `logger.log`. Son
  milisegundos, no los ~100 ms de un argon2: **este endpoint nunca hashea
  una contraseña**, a diferencia de `login`. Explotarlo exige muestreo
  estadístico sobre una red con jitter.
- Mientras tanto, `POST /v1/auth/register` responde `409` para un email ya
  registrado y `201` para uno nuevo. Eso es un oráculo de enumeración
  **exacto, de un solo intento, sin ruido y ya desplegado**. Gastar código y
  latencia en igualar microsegundos aquí, con esa puerta abierta al lado, es
  teatro de seguridad.
- Y el repositorio **no tiene throttling** (`@nestjs/throttler` no está
  instalado): sin freno de peticiones, ninguna mitigación de timing es
  efectiva.

Decisión: R2 cubre cuerpo y status; timing, throttling y el `409` de
`register` van al backlog en [[requirements]] §Deuda, nombrados y con su
razón. Es un límite conocido y anotado, no un olvido.

### D4 — Dos casos de uso, no uno

`RequestPasswordResetUseCase` (emite) y `ResetPasswordUseCase` (consume) son
dos operaciones con entradas, salidas y errores distintos.
`docs/architecture.md` fija "casos de uso de responsabilidad única". Espeja
`RegisterUserUseCase` / `VerifyEmailUseCase`. Sirve a R1, R5.

### D5 — Tabla nueva `password_reset_tokens`, copia de `email_verification_tokens`

`src/db/schema/password-reset-tokens.schema.ts`:

```typescript
import { char, index, pgTable, timestamp, uuid } from 'drizzle-orm/pg-core';
import { users } from './users.schema';

export const passwordResetTokens = pgTable(
  'password_reset_tokens',
  {
    id: uuid('id').primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    tokenHash: char('token_hash', { length: 64 }).notNull().unique(),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    usedAt: timestamp('used_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [index('password_reset_tokens_user_id_idx').on(table.userId)],
);
```

Índice manual sobre la FK: regla dura de `docs/data-model.md` ("toda columna
FK lleva índice manual"), y además es el índice que usa
`invalidateAllForUser` (D8).

**Migración**: `pnpm -C backend-pet-tracker run db:generate` genera
`0015_<palabras-aleatorias>.sql` + `meta/0015_snapshot.json`. El `.sql` se
**renombra a `0015_auth_password_reset_tokens.sql`** y la entrada
correspondiente de `meta/_journal.json` pasa a
`"tag": "0015_auth_password_reset_tokens"`. Es el precedente de este repo:
`0001_auth_registration_tables`, `0003_pets_crud_tables`,
`0004_devices_claim_tables`, `0005_activity_daily` están todas renombradas
así. `meta/0015_snapshot.json` se deja con su nombre generado (va por índice,
no por tag). Sirve a R12.

Fila nueva para el catálogo de `docs/data-model.md`:

> `password_reset_tokens` | id PK, user_id FK CASCADE, token_hash char(64)
> UNIQUE NOT NULL, expires_at timestamptz NOT NULL, used_at timestamptz NULL,
> created_at | Creada por `auth-forgot-password` (#44, migración `0015`).
> Copia de `email_verification_tokens`: solo se guarda el SHA-256 hex del
> token de un solo uso. A diferencia de aquella, al emitir o consumir un
> token se marcan como usados **todos** los tokens vivos del usuario, de
> modo que nunca hay más de uno utilizable a la vez (R4/R5). Índice manual
> `password_reset_tokens_user_id_idx` sobre la FK.

### D6 — TTL de 1 hora, constante y no variable de entorno

`VERIFICATION_TOKEN_TTL_MS` son 24 h y su comentario explica por qué es
constante: es un valor de producto, no de infraestructura desplegable. Mismo
criterio, valor distinto: **1 h**. Un token de reset abre la cuenta entera;
un token de verificación solo confirma una dirección. Una hora es el rango
habitual del flujo y sigue siendo cómodo para el usuario que acaba de pedir
el enlace. Sirve a R1, R7.

### D7 — Mapeo HTTP calcado de `verify-email`

Errores de dominio en `src/modules/auth/domain/errors/password-reset.errors.ts`:

```typescript
/** Token inexistente o ya consumido (R6): indistinguibles a proposito. */
export class InvalidPasswordResetTokenError extends Error { ... }

/** Token emitido y sin usar, pero fuera de su ventana de vigencia (R7). */
export class PasswordResetTokenExpiredError extends Error { ... }
```

En `auth.controller.ts`, el `catch` del handler `resetPassword` repite
literalmente la forma del de `verifyEmail`:
`PasswordResetTokenExpiredError` → `GoneException` (410);
`InvalidPasswordResetTokenError` → `BadRequestException` (400). La
validación de payload usa el `parseBody` que ya existe en ese fichero (no se
duplica). Sirve a R6, R7, R8.

### D8 — Un solo método de invalidación: `invalidateAllForUser`

Interface en `src/modules/auth/domain/repositories/password-reset-token.repository.ts`:

```typescript
export const PASSWORD_RESET_TOKEN_REPOSITORY = Symbol('PasswordResetTokenRepository');

export interface NewPasswordResetToken {
  userId: string;
  /** SHA-256 hex del token; el valor en claro no entra a la persistencia. */
  tokenHash: string;
  expiresAt: Date;
}

export interface PasswordResetTokenRepository {
  create(token: NewPasswordResetToken): Promise<void>;
  findByTokenHash(tokenHash: string): Promise<PasswordResetToken | null>;
  /** Marca como usados TODOS los tokens vivos del usuario (R4, R5). */
  invalidateAllForUser(userId: string, invalidatedAt: Date): Promise<void>;
}
```

`invalidateAllForUser` es
`UPDATE password_reset_tokens SET used_at = $2 WHERE user_id = $1 AND used_at IS NULL`.

**Sustituye al `markUsed(id, usedAt)` del repositorio de verificación**: una
sola sentencia cubre a la vez el "un solo uso" del token presentado y la
invalidación de sus hermanos. Dos métodos donde basta uno serían dos
sentencias y una condición de carrera más.

Esta es la **mejora deliberada** sobre el patrón heredado. `verify-email`
no invalida hermanos, lo cual es inocuo para confirmar una dirección pero no
para un reset: sin esto, un token viejo filtrado (log, historial de correo,
proxy) seguiría abriendo la cuenta después de que la víctima ya se recuperó.
**`verify-email` no se retrofitea** — es una feature `done`, tocarla sale de
la contención de R13 y no aporta seguridad.

### D9 — `updatePasswordHash` se añade a `UserRepository`, no a un puerto nuevo

`UserRepository` es el único escritor de la tabla `users` en el proyecto.
Se le añade:

```typescript
/** auth-forgot-password R5: unico camino para reemplazar la credencial. */
updatePasswordHash(userId: string, passwordHash: string, changedAt: Date): Promise<void>;
```

Implementación en `UserDrizzleRepository`, calcada de `markEmailVerified`:
`set({ passwordHash, updatedAt: changedAt }).where(eq(users.id, userId))`.

**No se ensancha `ProfileFieldChanges`**: eso permitiría a
`PATCH /v1/me` escribir un hash de contraseña. Un método aparte y explícito.

**No se crea un puerto estrecho aparte** (`PasswordCredentialsRepository`):
sería una segunda interface sobre la misma tabla y el mismo `users.schema`,
con una sola implementación, para ahorrar cuatro líneas en cuatro dobles de
test.

**Coste conocido y acotado**: cuatro specs existentes declaran su doble como
`const users: UserRepository = { ... }` y dejarán de compilar hasta que se
les añada `updatePasswordHash: jest.fn()` — una línea en cada uno, sin
cambiar ninguna aserción:
`register-user.use-case.spec.ts`, `login-user.use-case.spec.ts`,
`users/application/use-cases/update-profile.use-case.spec.ts`,
`users/application/use-cases/get-profile.use-case.spec.ts`.
(`verify-email.use-case.spec.ts` usa `as unknown as UserRepository` y no se
ve afectado.) Los cuatro están en la allowlist de R13.

### D10 — Auditoría solo cuando hay entidad que auditar

`AuditLogEntry` exige `entity` y `entityId`. Para un email inexistente no hay
usuario y por tanto no hay `entityId`; además, auditar emails tecleados por
terceros llenaría `audit_log` de datos ajenos. Por eso R11 audita la
solicitud **solo** cuando la cuenta existe (`user.password_reset_requested`)
y siempre el reset exitoso (`user.password_reset`). El `audit_log` es
servidor adentro: que la solicitud fallida no deje rastro no cambia nada de
lo que el cliente observa (R2). Sirve a R11.

### D11 — Sin transacción explícita

Los use cases del módulo auth (`RegisterUserUseCase`, `VerifyEmailUseCase`)
encadenan escrituras sin transacción; el proyecto no tiene todavía un helper
de unidad de trabajo sobre Drizzle. `ResetPasswordUseCase` hace lo mismo:
`updatePasswordHash` y luego `invalidateAllForUser`. El orden importa y es
el seguro: si la segunda fallara, la contraseña ya cambió y el token queda
vivo hasta expirar (≤ 1 h), no al revés. Introducir transacciones es un
cambio transversal del repositorio, no de esta feature.

### D12 — Contención: qué se toca de lo existente y qué no

La allowlist completa vive en [[requirements]] R13 (33 entradas + harness).
Resumen de lo que **no** se toca, por si el impulso aparece: nada de
`mobile-pet-tracker/` (el stub Forgot sigue como está), nada de `infra/`,
ni `.env.example`, ni la tabla de variables de entorno de
`docs/conventions.md` (no hay variable nueva), ni `verify-email.use-case.ts`,
ni `email-verification-token*`, ni `argon2-password-hasher.ts`, ni
`jwt-token-service.ts`, ni `auth.guard.ts`, ni ninguna migración anterior a
la `0015`.

## Archivos afectados

### domain (`src/modules/auth/domain/`)

| Archivo | Qué es |
|---|---|
| `entities/password-reset-token.entity.ts` | **nuevo** — clase `PasswordResetToken` con `id`, `userId`, `tokenHash`, `expiresAt`, `usedAt`, `createdAt` y los métodos `isUsed()` / `isExpired(now)`. Copia literal de `EmailVerificationToken` (30 líneas), no se reutiliza aquella: llamar `EmailVerificationToken` al token de un reset acopla dos flujos independientes por un ahorro de 30 líneas |
| `errors/password-reset.errors.ts` | **nuevo** — `InvalidPasswordResetTokenError`, `PasswordResetTokenExpiredError` (D7) |
| `ports/password-reset-sender.ts` | **nuevo** — `PASSWORD_RESET_SENDER`, `PasswordResetMessage`, `PasswordResetSender` (D2) |
| `repositories/password-reset-token.repository.ts` | **nuevo** — token + interface con `create` / `findByTokenHash` / `invalidateAllForUser` (D8) |
| `repositories/user.repository.ts` | **modificado** — solo `updatePasswordHash` (D9) |

### application (`src/modules/auth/application/`)

| Archivo | Qué es |
|---|---|
| `verification-token.ts` | **modificado** — solo `PASSWORD_RESET_TOKEN_TTL_MS` (D1) |
| `dto/forgot-password.dto.ts` | **nuevo** — `ForgotPasswordSchema = z.object({ email: z.email().max(320) })`, `ForgotPasswordDto` |
| `dto/reset-password.dto.ts` | **nuevo** — `ResetPasswordSchema` con `token: z.string().trim().min(1).max(256)` (idéntico a `VerifyEmailSchema`) y `password` / `passwordConfirmation` `z.string().min(8).max(128)` + `.refine()` de igualdad con `path: ['passwordConfirmation']`, calcado de `RegisterUserSchema`. Sin spec propia: `verify-email.dto.ts` tampoco la tiene y la validación se cubre desde el controller (R3, R8) |
| `use-cases/request-password-reset.use-case.ts` | **nuevo** — `RequestPasswordResetUseCase`. Inyecta `USER_REPOSITORY`, `PASSWORD_RESET_TOKEN_REPOSITORY`, `PASSWORD_RESET_SENDER`, `AUDIT_LOGGER`. `execute(dto: ForgotPasswordDto): Promise<void>` — `normalizeEmail` → `findByEmail` → si `null` **return silencioso** (R2) → `invalidateAllForUser` → `create` → `send` → `auditLogger.record` |
| `use-cases/reset-password.use-case.ts` | **nuevo** — `ResetPasswordUseCase`. Inyecta `USER_REPOSITORY`, `PASSWORD_RESET_TOKEN_REPOSITORY`, `PASSWORD_HASHER`, `AUDIT_LOGGER`. `execute(dto: ResetPasswordDto): Promise<void>` — `findByTokenHash(hashVerificationToken(dto.token))` → `null` o `isUsed()` → `InvalidPasswordResetTokenError` → `isExpired(now)` → `PasswordResetTokenExpiredError` → `hash` → `updatePasswordHash` → `invalidateAllForUser` → `record`. Estructura idéntica a `VerifyEmailUseCase` |

### infrastructure (`src/modules/auth/infrastructure/`)

| Archivo | Qué es |
|---|---|
| `email/console-password-reset-sender.ts` | **nuevo** — `ConsolePasswordResetSender` (D2) |
| `repositories/password-reset-token.drizzle.repository.ts` | **nuevo** — `PasswordResetTokenDrizzleRepository`, `uuidv7()` para el `id`, `toDomain(row)` local. Copia de `EmailVerificationTokenDrizzleRepository` con `invalidateAllForUser` en lugar de `markUsed` |
| `auth.controller.ts` | **modificado** — dos handlers `@Public()`: `@Post('forgot-password') @HttpCode(HttpStatus.OK) forgotPassword` → `ForgotPasswordResponse { requested: true }`; `@Post('reset-password') @HttpCode(HttpStatus.OK) resetPassword` → `ResetPasswordResponse { reset: true }`. Ambos interfaces exportados junto a `VerifyEmailResponse` / `LoginResponse` |

### db compartida (`src/db/`)

| Archivo | Qué es |
|---|---|
| `schema/password-reset-tokens.schema.ts` | **nuevo** (D5) |
| `schema/index.ts` | **modificado** — `export * from './password-reset-tokens.schema';` en orden alfabético (entre `nutrition.schema` y `pets.schema`) |
| `migrations/0015_auth_password_reset_tokens.sql` + `migrations/meta/0015_snapshot.json` + `migrations/meta/_journal.json` | **nuevo / modificado** (D5) |

### módulo

`auth.module.ts` — **modificado**: `RequestPasswordResetUseCase` y
`ResetPasswordUseCase` en `providers`, más
`{ provide: PASSWORD_RESET_TOKEN_REPOSITORY, useClass: PasswordResetTokenDrizzleRepository }`
y `{ provide: PASSWORD_RESET_SENDER, useClass: ConsolePasswordResetSender }`.
`exports` no cambia.

### docs

`docs/data-model.md` (fila de D5) y `docs/verification.md` (sección
`Feature 44 — auth-forgot-password`: `docker compose up -d`, `curl` de
`forgot-password`, cómo leer el token del log del servidor filtrando por
`auth.password_reset.issued`, `curl` de `reset-password`, y `curl` de
`login` con contraseña vieja → `401` y nueva → `200`).

## Alternativas descartadas

- **Una sola tabla de tokens con columna `purpose`** (`email_verification` /
  `password_reset`): ahorraría una tabla y una entidad, pero obligaría a un
  `ALTER TABLE` sobre `email_verification_tokens`, a ensanchar su
  repositorio, su entidad y su interface con el discriminador, y dejaría el
  nombre de la tabla mintiendo. Toca toda la superficie aprobada de
  `auth-registration` para ahorrar ~60 líneas triviales.
- **Reutilizar `EmailVerificationSender` para el reset**: ver D2.
- **Generalizar `verification-token.ts` a `opaque-token.ts`**: ver D1.
- **`markUsed(id)` + `invalidateAllForUser(userId)` como dos métodos**: la
  segunda operación ya cubre a la primera; ver D8.
- **`@nestjs/throttler` para rate limiting**: dependencia nueva y almacén
  compartido; feature propia, ver D3 y [[requirements]] §Deuda.
- **Retraso artificial (~250 ms) en `forgot-password` para igualar el
  timing**: latencia para todos a cambio de nada mientras el `409` de
  `register` sea un oráculo exacto; ver D3.
- **`users.password_changed_at` + comprobación de `iat` en `AuthGuard`**
  para revocar sesiones: obliga a una lectura de base en cada request
  autenticado, rompe el contrato DB-free del guard (`auth-login-me` R8) y
  toca todos los e2e del repositorio. Ver [[requirements]] §Contexto fijo y
  §Deuda.
- **Devolver el token en la respuesta HTTP en desarrollo** ("solo si
  `NODE_ENV !== 'production'`"): un `if` de entorno en la ruta de un secreto
  es exactamente cómo se filtran los secretos. El log estructurado ya lo
  hace accesible en local sin ese riesgo, y es el patrón que #3 ya eligió.
- **`202 Accepted` en vez de `200`**: semánticamente defendible, pero
  `verify-email` ya devuelve `200` y no hay cola ni proceso diferido detrás.

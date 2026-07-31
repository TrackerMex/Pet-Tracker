---
feature: "auth-registration"
status: approved     # draft | approved
tags: [harness, spec]
---

# Diseño — [[auth-registration]]

> Ver [[requirements]] para los requisitos que este diseño implementa y
> [[../../docs/architecture|architecture]] para las reglas de capas del proyecto.

## Decisiones técnicas

- **Hash de password: argon2id vía paquete `argon2` (nueva dependencia)**
  — sirve a R1, R14. OWASP recomienda argon2id como primera opción para
  hash de contraseñas nuevas (memory-hard, resistente a ataques por GPU/ASIC
  mejor que bcrypt). El paquete encapsula la generación de salt y los
  parámetros de coste en un único string PHC que se guarda tal cual en
  `users.password_hash` — no hace falta columna de salt separada. Se
  abstrae detrás de un puerto `PasswordHasher` (interface en
  `domain/ports/password-hasher.ts`, sin importar `argon2` desde domain)
  para que el `use-case` no dependa de la librería concreta.

- **Generación de UUIDv7 en app: paquete `uuidv7` (nueva dependencia)** —
  sirve a R1. `docs/data-model.md` exige "PK uuid (UUIDv7 generado en app)"
  para todas las tablas de dominio; ésta es la primera feature que crea una
  tabla de dominio real (hasta ahora sólo existe `schema_bootstrap`, con PK
  bigint identity), así que fija el precedente para el resto de features.
  La generación vive en el repositorio Drizzle (infrastructure), no en el
  dominio: el `use-case` pasa los datos de negocio, el repositorio construye
  la fila con `id: uuidv7()` antes del `insert`.

- **Verificación de email: token opaco de un solo uso en tabla propia
  `email_verification_tokens`, no columnas en `users`** — sirve a R6-R11.
  Al registrar, se genera `crypto.randomBytes(32)` codificado en
  base64url (256 bits de entropía, espacio de colisión despreciable) y se
  persiste **hasheado con SHA-256** (`token_hash`) junto a `user_id`,
  `expires_at` (24 h desde la emisión) y `used_at` (NULL hasta que se
  consume). El endpoint `verify-email` recibe el token en claro, lo
  hashea y busca por `token_hash` — así un dump de la tabla no permite
  reconstruir tokens usables (mismo principio que un password hash, pero
  con SHA-256 porque el token ya es aleatorio de alta entropía, no
  necesita ser lento). Al verificar con éxito se setea `used_at`; una
  segunda verificación con el mismo token falla por R11 (`used_at IS NOT
  NULL` se trata igual que "no existe" desde el punto de vista de la
  búsqueda de tokens válidos).
  Expiración fija de 24 h como constante de aplicación (no variable de
  entorno) — es un valor de producto, no de infraestructura desplegable.

- **Patrón `EMAIL_ENABLED=false`: mismo patrón que `PUSH_ENABLED=false`
  ya usado para `push_tokens`/notifier** — sirve a R6, R7. Puerto
  `EmailVerificationSender` (interface) con una única implementación local
  `ConsoleEmailVerificationSender` que, cuando `EMAIL_ENABLED` es `false`
  (default local), loguea `{ userId, email, token, expiresAt }` vía el
  `Logger` de Nest en vez de llamar a SES. `EMAIL_ENABLED` es una variable
  de entorno nueva — el `implementer` debe añadirla a `.env.example` y a la
  tabla de variables de entorno de `docs/conventions.md` en el mismo commit
  que la introduce (regla dura `AGENTS.md` §4; ver [[tasks]]). El token
  nunca se devuelve en la respuesta HTTP (R7): sólo vive en el log y en
  `email_verification_tokens`.

- **`audit_log`: esta feature crea la tabla, no la feature #5** — sirve a
  R12, R13. `docs/data-model.md` cataloga `audit_log` como tabla
  transversal (no ligada a un solo módulo) y la entrada de
  `feature_list.json` id 5 (`pets-crud-permissions`) también la menciona
  como parte de lo que crea ("tablas pets, pet_users, audit_log"). Como las
  features se ejecutan en orden numérico y `auth-registration` (#3) va
  antes que `pets-crud-permissions` (#5), y esta spec **sí** tiene
  `acceptance_criteria` que dependen de `audit_log` existiendo, la tabla se
  crea aquí con el schema exacto de `docs/data-model.md` (`id bigint
  identity PK, user_id NULL, action, entity, entity_id, meta jsonb, at
  DEFAULT now()`). **Nota para el leader**: al escribir la spec de #5 hay
  que ajustar su descripción para que reutilice `audit_log` en vez de
  volver a crearla (evitar una migración Drizzle duplicada/conflictiva).
  La interface de logging (`AuditLogger`, puerto + token `AUDIT_LOGGER`) y
  su implementación Drizzle viven en `src/audit/` — infraestructura
  compartida a nivel de `src/`, hermana de `src/db/` y `src/aws/` (mismo
  patrón que esas dos: `AuditModule` `@Global()`), no dentro de
  `modules/auth/`, porque el propio catálogo de `docs/data-model.md` la
  trata como transversal y features futuras (#5, #7, …) también la
  necesitarán.

- **Serialización de salida explícita, nunca la entidad completa** — sirve
  a R14. `AuthController` (o un mapper `user-response.mapper.ts`) construye
  el body de `201`/`200` listando `id, email, firstName, lastName, phone,
  country, timezone, createdAt` — `password_hash` nunca llega a ese objeto
  porque no está en la lista, no porque se "borre" después.

- **Política de password mínima: sólo longitud (≥ 8 caracteres)** — sirve a
  R5. `docs/brief.md` §6 no especifica reglas de complejidad; se define el
  mínimo verificable para no inventar requisitos no pedidos. Documentado
  aquí para que quede explícito que es una decisión deliberada, no un
  olvido — si producto pide más reglas, es un cambio de spec futuro.

- **`country` y `timezone`**: `country` requerido, validado como código
  ISO 3166-1 alpha-2 en mayúsculas (`z.string().length(2)` + regex
  `[A-Z]{2}`) — consistente con ser un dato normalizado para futuras
  features (moneda, formato de fecha). `timezone` opcional en el DTO; si se
  omite, el use case persiste `'UTC'` (coincide con el `DEFAULT 'UTC'` de
  la columna en `docs/data-model.md`). No se valida contra la lista IANA
  completa en esta feature (evita añadir una dependencia de datos de
  timezone sólo para este check); el `use-case` sólo exige no-vacío si se
  provee.

- **`phone`**: requerido, validación laxa (`z.string().min(7).max(20)`,
  sin parseo E.164 estricto) — el brief no especifica formato y añadir una
  librería de parsing de teléfonos (ej. `libphonenumber-js`) sólo para esta
  feature es sobre-ingeniería; se puede endurecer en una spec futura si
  hace falta.

## Estructura de capas (módulo `auth`)

```
backend-pet-tracker/src/
├── audit/                                          [infra compartida, @Global()]
│   ├── audit-log.repository.ts                     ← interface AuditLogger + token AUDIT_LOGGER
│   ├── audit-log.drizzle.repository.ts              ← implementa AuditLogger sobre Drizzle
│   └── audit.module.ts
│
├── db/schema/
│   ├── users.schema.ts                              ← pgTable('users', ...)
│   ├── email-verification-tokens.schema.ts          ← pgTable('email_verification_tokens', ...)
│   ├── audit-log.schema.ts                           ← pgTable('audit_log', ...)
│   └── index.ts                                      ← re-exporta los 3 (reemplaza el placeholder
│                                                          schemaBootstrap, ver nota en index.ts actual)
│
└── modules/auth/
    ├── domain/
    │   ├── entities/user.entity.ts                  ← clase pura (id, email, passwordHash,
    │   │                                                firstName, lastName, phone, country,
    │   │                                                timezone, termsAcceptedAt,
    │   │                                                emailVerifiedAt, createdAt, updatedAt)
    │   ├── entities/email-verification-token.entity.ts
    │   ├── errors/user.errors.ts                    ← EmailAlreadyRegisteredError
    │   ├── errors/email-verification.errors.ts       ← InvalidVerificationTokenError,
    │   │                                                VerificationTokenExpiredError
    │   ├── ports/password-hasher.ts                  ← interface PasswordHasher + token
    │   ├── ports/email-verification-sender.ts         ← interface EmailVerificationSender + token
    │   ├── repositories/user.repository.ts            ← interface UserRepository + token
    │   └── repositories/email-verification-token.repository.ts ← interface + token
    ├── application/
    │   ├── dto/register-user.dto.ts                  ← zod schema + tipo inferido
    │   ├── dto/verify-email.dto.ts
    │   └── use-cases/
    │       ├── register-user.use-case.ts             ← orquesta: valida email único, hashea
    │       │                                             password, genera token, persiste user +
    │       │                                             token, loguea, audita 'user.register'
    │       └── verify-email.use-case.ts               ← busca token por hash, valida vigencia/uso,
    │                                                      setea email_verified_at, audita
    │                                                      'user.email_verified'
    └── infrastructure/
        ├── repositories/user.drizzle.repository.ts
        ├── repositories/email-verification-token.drizzle.repository.ts
        ├── security/argon2-password-hasher.ts         ← implementa PasswordHasher
        ├── email/console-email-verification-sender.ts ← implementa EmailVerificationSender
        │                                                  (EMAIL_ENABLED=false → Logger)
        ├── auth.controller.ts                          ← POST /v1/auth/register,
        │                                                  POST /v1/auth/verify-email; mapea
        │                                                  errores de dominio → HttpException
        └── mappers/user-response.mapper.ts             ← entidad → DTO de salida sin password_hash
    └── auth.module.ts
```

## Archivos afectados

- `backend-pet-tracker/src/db/schema/users.schema.ts` — nuevo, infrastructure (schema compartido)
- `backend-pet-tracker/src/db/schema/email-verification-tokens.schema.ts` — nuevo, infrastructure
- `backend-pet-tracker/src/db/schema/audit-log.schema.ts` — nuevo, infrastructure
- `backend-pet-tracker/src/db/schema/index.ts` — edita el barrel: quita `schemaBootstrap` (era un
  placeholder explícitamente marcado para eliminarse "en cuanto la primera feature con tablas de
  dominio reales... se implemente"), agrega las 3 tablas nuevas
- `backend-pet-tracker/src/db/migrations/` — nueva migración generada por `drizzle-kit generate`
- `backend-pet-tracker/src/audit/*` — nuevo módulo compartido (infrastructure)
- `backend-pet-tracker/src/modules/auth/**` — todo nuevo, las 3 capas descritas arriba
- `backend-pet-tracker/src/app.module.ts` — importa `AuthModule` (y `AuditModule` si no es
  auto-descubierto por ser `@Global()` importado una vez)
- `backend-pet-tracker/package.json` — agrega dependencias `argon2`, `uuidv7`
- `.env.example` (raíz del repo) — agrega `EMAIL_ENABLED=false`
- `docs/conventions.md` — agrega fila `EMAIL_ENABLED` a la tabla de variables de entorno
  (lo hace el `implementer`, no esta spec — ver [[tasks]])

## Alternativas descartadas

- **bcrypt** para hash de password: descartado por truncar el input a 72
  bytes y ser un algoritmo más antiguo que argon2id; OWASP lo lista como
  alternativa aceptable pero no primera opción para sistemas nuevos.
- **`crypto.scrypt` nativo de Node** (sin dependencia nueva): descartado
  porque obliga a gestionar manualmente salt, parámetros de coste y
  comparación en tiempo constante — más superficie para un bug de
  seguridad que adoptar `argon2`, que ya lo resuelve de forma segura por
  defecto.
- **Paquete `uuid` (con soporte v7)** en vez de `uuidv7`: considerado;
  se prefiere `uuidv7`, un paquete dedicado y más pequeño, para dejar
  explícito en el nombre de la dependencia qué versión de UUID se usa.
- **`gen_random_uuid()` de Postgres como default de columna**: descartado
  porque genera UUIDv4, no UUIDv7, y `docs/data-model.md` pide
  explícitamente "UUIDv7 generado en app".
- **Código numérico de 6 dígitos (OTP) en vez de token opaco**: brief §6
  permite "enlace o código"; se descarta el OTP para el MVP porque un
  código de 6 dígitos vive en un espacio de sólo 1 000 000 de valores y
  exigiría rate-limiting explícito contra fuerza bruta (fuera de alcance de
  esta feature), mientras que el token opaco de 256 bits no es
  adivinable en la práctica sin ese control adicional.
- **Columnas de verificación directamente en `users`**
  (`email_verification_token_hash`, `email_verification_expires_at`) en vez
  de tabla propia: descartado porque limita a un token vigente por usuario
  a la vez y mezcla una responsabilidad de corta duración (verificación)
  con la entidad de negocio de larga duración (usuario); una tabla propia
  deja espacio para un futuro "reenviar verificación" sin tocar `users`.
- **Interface de auditoría dentro de `modules/auth/domain/`** en vez de
  `src/audit/` compartido: descartado porque `audit_log` es transversal por
  diseño (`docs/data-model.md`) y ya hay features futuras (#5 `pets-crud-
  permissions`, #7 `devices-claim`) que también escriben en ella — replicar
  la interface en cada módulo violaría DRY y arriesgaría tokens de
  inyección duplicados con distinto nombre.

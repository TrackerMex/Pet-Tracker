---
feature: "auth-login-me"
status: draft        # draft | approved
tags: [harness, spec]
---

# Diseño — [[auth-login-me]]

> Ver [[requirements]] para los requisitos que este diseño implementa y
> [[../../docs/architecture|architecture]] para las reglas de capas del proyecto.

## Decisiones técnicas

- **Firma de JWT: paquete `jsonwebtoken` (nueva dependencia) detrás de un
  puerto `TokenService`** — sirve a R1, R4, R6, R8. Interface en
  `modules/auth/domain/ports/token-service.ts` (`sign(payload): string`,
  `verify(token): TokenPayload`), sin importar `jsonwebtoken` desde
  domain — mismo patrón que `PasswordHasher` ya existente en
  `modules/auth/domain/ports/password-hasher.ts` (creado por
  `auth-registration`). Implementación concreta
  `infrastructure/security/jwt-token-service.ts` usa `jsonwebtoken.sign` /
  `jsonwebtoken.verify` (HS256), lee `JWT_SECRET` vía `ConfigService`
  (nunca `process.env` directo, `docs/conventions.md` §Variables de
  entorno). Se descarta `@nestjs/jwt` (ver Alternativas).

- **`JWT_SECRET`: variable de entorno nueva** — sirve a R4, R6. Se añade a
  `.env.example` (raíz) y a la tabla de variables de `docs/conventions.md`
  en el mismo commit que introduce el código que la consume (regla dura
  `AGENTS.md` §4), mismo patrón que `EMAIL_ENABLED` en `auth-registration`.
  En local es un valor fijo de desarrollo (no secreto real); en un deploy
  AWS real pasaría a leerse de Secrets Manager sin tocar
  `modules/auth/domain` ni `application` (el `ConfigService` es el único
  punto de cambio, igual que las demás variables de infraestructura).

- **Expiración del `access_token`: 24 h, constante de aplicación (no env
  var)** — sirve a R4. Esta feature deja **fuera de alcance** refresh
  tokens (ver [[requirements]]); un TTL más corto (ej. 15 min) obligaría a
  re-loguearse constantemente sin mecanismo de renovación. 24 h es un valor
  de producto para el MVP local, documentado aquí como decisión deliberada
  a revisar cuando se priorice el flujo de refresh.

- **Verificación de password: se extiende el puerto `PasswordHasher`
  existente con `verify(plainPassword, hash): Promise<boolean>`** — sirve a
  R1, R2. No se crea un puerto nuevo: `Argon2PasswordHasher`
  (`infrastructure/security/argon2-password-hasher.ts`, ya implementado por
  `auth-registration`) gana un método que delega en `argon2.verify`, que ya
  compara en tiempo constante y valida los parámetros del hash PHC
  almacenado. El `use-case` de login nunca ve `argon2` directamente.

- **`AuthGuard` global vía `APP_GUARD`, no `@Global()`** — sirve a R5, R6,
  R7. A diferencia de `AuditModule` (que usa `@Global()` porque expone un
  provider normal a otros módulos), un guard se vuelve global registrándolo
  como `{ provide: APP_GUARD, useClass: AuthGuard }` en los `providers` de
  `AuthModule` — es un token especial que NestJS aplica a nivel de toda la
  aplicación independientemente del scope del módulo que lo declara (no
  requiere `@Global()`). Vive en
  `modules/auth/infrastructure/guards/auth.guard.ts`, implementa
  `CanActivate`: si el handler/clase tiene metadata `@Public()` (leída con
  `Reflector`), deja pasar sin verificar; si no, exige `Authorization:
  Bearer <token>`, lo verifica con `TokenService.verify()` y, si es válido,
  adjunta `request.user = { id: payload.sub, email: payload.email }`;
  cualquier fallo (header ausente, formato inválido, firma inválida,
  expirado) lanza `UnauthorizedException` (401), nunca deja pasar la
  petición con un `request.user` parcial.

- **`@Public()` como `SetMetadata` + `@CurrentUser()` como
  `createParamDecorator`** — sirve a R7, R8. `@Public()`
  (`infrastructure/decorators/public.decorator.ts`) marca metadata leída
  por el `AuthGuard`; se aplica a `AuthController.login`,
  `AuthController.register`, `AuthController.verifyEmail` (los tres ya
  existentes, `register`/`verifyEmail` pasan de ser públicos "por
  ausencia de guard" a serlo explícitamente ahora que el guard es global) y
  a `HealthController.check` (`modules/health/`, feature #1 — único archivo
  fuera de `modules/auth/`/`modules/users/` que esta spec toca, una línea
  de decorador). `@CurrentUser()`
  (`infrastructure/decorators/current-user.decorator.ts`) lee
  `request.user` ya poblado por el guard — no vuelve a tocar la base de
  datos ni el token; los handlers de `GET/PATCH /v1/me` reciben `{ id,
  email }` y son ellos quienes piden el perfil completo al repositorio si
  lo necesitan (mantiene el guard barato: una verificación de firma, no un
  round-trip a Postgres por request).

- **`GET/PATCH /v1/me` viven en un módulo nuevo `modules/users/`, no en
  `modules/auth/`** — sirve a R9-R14, consistente con
  `files_affected` de `feature_list.json` #4 (`modules/auth/` **y**
  `modules/users/`). Separación de responsabilidad: `auth` posee identidad
  y sesión (registro, verificación, login, guard, decoradores); `users`
  posee el caso de uso de negocio "ver/editar mi perfil". `UsersModule`
  importa `AuthModule` y reutiliza el mismo `USER_REPOSITORY` (token +
  interface ya definidos en `modules/auth/domain/repositories/
  user.repository.ts`) — `AuthModule` debe **exportar** ese provider
  además de declararlo, para que `UsersModule` lo inyecte sin duplicar la
  interface ni el token (mismo principio anti-duplicación que motivó poner
  `AuditLogger` en `src/audit/` compartido).

- **`UserRepository` gana 3 métodos** — sirve a R1, R9, R10. La interface
  existente (`existsByEmail`, `create`, `markEmailVerified`) no alcanza
  para login/perfil: se agregan `findByEmail(email): Promise<User | null>`
  (R1: necesita el `password_hash` real para verificar, no solo un
  booleano), `findById(id): Promise<User | null>` (R9), y
  `updateProfile(userId, changes: Partial<ProfileFields>): Promise<User>`
  (R10, con `ProfileFields = firstName | lastName | phone | country |
  timezone`, cada uno opcional — solo se actualizan las columnas
  presentes). Implementados en el `UserDrizzleRepository` ya existente
  (`modules/auth/infrastructure/repositories/user.drizzle.repository.ts`).

- **Validación de `timezone` con `Intl.supportedValuesOf('timeZone')`,
  sin dependencia nueva** — sirve a R11. API nativa de Node ≥ 18 (ya el
  runtime del proyecto), devuelve el catálogo IANA completo; se valida en
  el DTO de `PATCH /v1/me` con un `z.string().refine(...)` que llama a esa
  función — a diferencia de `auth-registration`, que decidió **no**
  validar `timezone` contra IANA para no añadir una dependencia (el brief
  no lo exigía en el registro); aquí sí es un requisito explícito de
  `acceptance_criteria` de #4 ("timezone validada contra
  `Intl.supportedValuesOf`"), así que se implementa sin relajar la regla
  previa de "no inventar validación no pedida": ahora sí está pedida.

- **`country` en `PATCH /v1/me` reutiliza el mismo formato que
  `auth-registration`** — sirve a R12. Mismo `z.string().length(2).regex(
  /^[A-Z]{2}$/)` que `RegisterUserSchema`; se extrae a un schema compartido
  (`modules/auth/application/dto/country.schema.ts` o similar) para no
  duplicar el regex en dos DTOs — decisión de implementación, no cambia el
  contrato.

- **`PATCH /v1/me` es atómico: si algún campo presente falla su
  validación, no se persiste ningún campo del body** — sirve a R11, R12.
  Se resuelve en el borde HTTP: el DTO completo (`UpdateProfileSchema =
  z.object({...}).partial()`) se valida de una vez con `.safeParse()`
  antes de invocar el use case; si falla, el use case ni se ejecuta. No
  hay escritura parcial posible porque la validación ocurre entera antes
  del `UPDATE`.

- **Body vacío en `PATCH /v1/me` es un no-op válido (200), no error** —
  sirve a R13. Todos los campos del DTO de update son opcionales
  (`.partial()`, mismo patrón que `auth-registration` usa para PATCH
  semántico, `docs/conventions.md` §DTOs); un body `{}` valida
  correctamente contra ese schema. El use case detecta que no hay campos
  presentes y devuelve el perfil actual sin tocar `users` ni `audit_log`
  (evita entradas de auditoría vacías/ruidosas).

- **Auditoría de `user.update` solo con nombres de campo, no valores** —
  sirve a R14. Coherente con no duplicar PII (teléfono, país) en
  `audit_log.meta` más de lo necesario para trazabilidad — un futuro
  requisito de "ver qué cambió exactamente" es una ampliación de spec, no
  algo que se infiere aquí.

- **Serialización de salida explícita para `/me`, con `updatedAt`
  agregado** — sirve a R15. Nuevo mapper
  `modules/users/infrastructure/mappers/profile-response.mapper.ts`
  (no reutiliza `user-response.mapper.ts` de `auth` tal cual porque ese
  no incluye `updatedAt`, relevante en un perfil que se edita). Ambos
  mappers listan campos explícitos, ninguno serializa la entidad
  `User` completa — mismo principio que R14 de `auth-registration`.
  La respuesta de `POST /v1/auth/login` no incluye el perfil (solo
  `access_token`, ver requirements R1), así que no necesita mapper nuevo.

## Estructura de capas

```
backend-pet-tracker/src/
├── modules/health/infrastructure/health.controller.ts   [editado: +@Public()]
│
├── modules/auth/
│   ├── domain/
│   │   ├── ports/
│   │   │   ├── password-hasher.ts                [editado: +verify()]
│   │   │   └── token-service.ts                   [nuevo: interface TokenService + token]
│   │   └── repositories/
│   │       └── user.repository.ts                 [editado: +findByEmail, +findById,
│   │                                                  +updateProfile]
│   ├── application/
│   │   ├── dto/login-user.dto.ts                  [nuevo]
│   │   └── use-cases/
│   │       └── login-user.use-case.ts             [nuevo: busca por email, verifica
│   │                                                  password, firma JWT]
│   └── infrastructure/
│       ├── decorators/
│       │   ├── public.decorator.ts                [nuevo]
│       │   └── current-user.decorator.ts          [nuevo]
│       ├── guards/auth.guard.ts                   [nuevo]
│       ├── security/
│       │   ├── argon2-password-hasher.ts          [editado: +verify()]
│       │   └── jwt-token-service.ts               [nuevo: implementa TokenService]
│       ├── repositories/user.drizzle.repository.ts [editado: +3 métodos]
│       └── auth.controller.ts                     [editado: +POST login, +@Public()
│                                                       en register/verifyEmail]
│   └── auth.module.ts                             [editado: +APP_GUARD, +export
│                                                       USER_REPOSITORY, +providers nuevos]
│
└── modules/users/                                  [nuevo módulo]
    ├── application/
    │   ├── dto/update-profile.dto.ts
    │   └── use-cases/
    │       ├── get-profile.use-case.ts
    │       └── update-profile.use-case.ts
    ├── infrastructure/
    │   ├── mappers/profile-response.mapper.ts
    │   └── users.controller.ts                     ← GET /v1/me, PATCH /v1/me
    └── users.module.ts
```

## Archivos afectados

- `backend-pet-tracker/package.json` — agrega dependencia `jsonwebtoken`
  (+ `@types/jsonwebtoken` en devDependencies)
- `backend-pet-tracker/src/modules/auth/domain/ports/token-service.ts` —
  nuevo, domain
- `backend-pet-tracker/src/modules/auth/domain/ports/password-hasher.ts` —
  edita interface, domain
- `backend-pet-tracker/src/modules/auth/domain/repositories/user.repository.ts`
  — edita interface, domain
- `backend-pet-tracker/src/modules/auth/application/dto/login-user.dto.ts`
  — nuevo, application
- `backend-pet-tracker/src/modules/auth/application/use-cases/login-user.use-case.ts`
  — nuevo, application
- `backend-pet-tracker/src/modules/auth/infrastructure/**` — guard,
  decoradores, `jwt-token-service.ts`, edición de `argon2-password-hasher.ts`,
  edición de `user.drizzle.repository.ts`, edición de `auth.controller.ts` —
  todo infrastructure
- `backend-pet-tracker/src/modules/auth/auth.module.ts` — edita: registra
  `APP_GUARD`, exporta `USER_REPOSITORY`, agrega providers de
  `TokenService`/`LoginUserUseCase`
- `backend-pet-tracker/src/modules/users/**` — módulo nuevo completo,
  las 3 capas (aunque domain queda casi vacío: reutiliza entidad/errores de
  `modules/auth/domain`, no duplica `User`)
- `backend-pet-tracker/src/modules/health/infrastructure/health.controller.ts`
  — edita: agrega `@Public()` al handler `check` (regresión: el guard
  global no debe romper R del health-check de `db-setup-drizzle` #1)
- `backend-pet-tracker/src/app.module.ts` — importa `UsersModule`
- `.env.example` (raíz) — agrega `JWT_SECRET`
- `docs/conventions.md` — agrega fila `JWT_SECRET` a la tabla de variables
  de entorno (lo hace el `implementer`, ver [[tasks]])

## Alternativas descartadas

- **`@nestjs/jwt` + `@nestjs/passport`**: descartado para mantener la
  misma filosofía que `auth-registration` (puertos propios sobre librerías
  delgadas — `argon2`, `uuidv7` — en vez de módulos de framework con más
  superficie/opinión). `jsonwebtoken` es la librería que `@nestjs/jwt`
  envuelve de todos modos; usarla directo detrás de `TokenService` evita
  una capa de indirección sin beneficio aquí (no se usan estrategias
  Passport en ningún otro lado del proyecto).
- **Guard con lookup a `users` en cada request** (en vez de confiar en los
  claims del JWT): descartado por costo — cada request protegida pagaría
  una consulta a Postgres solo para poblar `@CurrentUser()`, cuando la
  firma del JWT ya garantiza que `sub`/`email` no fueron alterados desde
  la emisión. Los casos de uso que sí necesitan el perfil completo
  (`GET/PATCH /v1/me`) hacen su propio `findById` explícito.
- **Sesiones server-side (JWT opaco + tabla `sessions`)** en vez de JWT
  autocontenido: descartado — añade una tabla y una escritura por login
  solo para poder revocar, cuando revocación/logout está explícitamente
  fuera de alcance de esta feature; si se prioriza logout real, se
  reevalúa en una spec futura.
- **TTL de `access_token` configurable por env var**: descartado por ahora
  — es un valor de producto (UX de sesión), no de infraestructura
  desplegable; se fija como constante de aplicación siguiendo el mismo
  criterio que la expiración de 24 h de `email_verification_tokens` en
  `auth-registration`.
- **`GET/PATCH /v1/me` dentro de `modules/auth/`** en vez de un
  `modules/users/` nuevo: descartado porque `files_affected` de
  `feature_list.json` #4 lista explícitamente ambos módulos, y separar
  "sesión" de "perfil" dejará más limpio dónde crecer en features futuras
  (`alerts-center-notifier` #13 ya menciona `push_tokens` bajo
  `modules/users/`).
- **Duplicar `UserRepository`/`User` dentro de `modules/users/domain/`**
  en vez de reutilizar los de `modules/auth/domain/`: descartado por DRY —
  mismo razonamiento que llevó `AuditLogger` a `src/audit/` compartido en
  vez de replicarse por módulo.

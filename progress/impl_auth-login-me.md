# impl: auth-login-me
Fecha: 2026-07-31

Feature id 4, branch `feature/4-auth-login-me`. Spec aprobada por humano
(`specs/auth-login-me/requirements.md`, casilla marcada 2026-07-31) — gate
verificado antes de escribir código. `design.md`/`tasks.md`/`traceability.md`
de `spec_author` quedaron en `status: draft` en el frontmatter (mismo estado
en que los dejó el commit de spec de `auth-registration` antes de que un
humano pasara el gate) — no lo toqué, solo `requirements.md` es el gate duro
según el proceso del `implementer`.

## Archivos creados

### Módulo `auth` — nuevas piezas (login + guard)
- `.../modules/auth/domain/ports/token-service.ts` — puerto `TokenService`
  (`sign`/`verify`) + token `TOKEN_SERVICE`, mismo patrón que `PasswordHasher`.
- `.../modules/auth/infrastructure/security/jwt-token-service.ts` — único
  archivo que importa `jsonwebtoken`; HS256, TTL fijo `ACCESS_TOKEN_TTL_SECONDS`
  (24h, constante de aplicación, no env var).
- `.../modules/auth/application/dto/login-user.dto.ts` — `LoginUserSchema`.
- `.../modules/auth/application/dto/country.schema.ts` — `CountrySchema`
  extraído de `register-user.dto.ts` (refactor sin cambio de comportamiento),
  compartido con `UpdateProfileSchema`.
- `.../modules/auth/application/use-cases/login-user.use-case.ts` —
  `LoginUserUseCase`: busca por email normalizado, verifica password, firma
  el JWT.
- `.../modules/auth/infrastructure/decorators/public.decorator.ts` —
  `@Public()` (`SetMetadata`).
- `.../modules/auth/infrastructure/decorators/current-user.decorator.ts` —
  `@CurrentUser()` (`createParamDecorator`), lee `request.user`.
- `.../modules/auth/infrastructure/guards/auth.guard.ts` — `AuthGuard`
  (`CanActivate`), registrado como `APP_GUARD` en `auth.module.ts`.

### Módulo `users` — nuevo módulo completo (perfil)
- `.../modules/users/application/dto/update-profile.dto.ts` —
  `UpdateProfileSchema` (`.partial()`; `timezone` validada con
  `Intl.supportedValuesOf('timeZone')`, `country` reutiliza `CountrySchema`).
- `.../modules/users/application/use-cases/get-profile.use-case.ts` —
  `GetProfileUseCase`.
- `.../modules/users/application/use-cases/update-profile.use-case.ts` —
  `UpdateProfileUseCase`: no-op sin auditoría si no hay campos presentes;
  si los hay, actualiza y audita `user.update` con solo los nombres de campo.
- `.../modules/users/infrastructure/mappers/profile-response.mapper.ts` —
  lista explícita de campos + `updatedAt` (distinto del mapper de
  `auth-registration`, que no lo incluye).
- `.../modules/users/infrastructure/users.controller.ts` — `GET /v1/me`,
  `PATCH /v1/me`.
- `.../modules/users/users.module.ts` — importa `AuthModule` (reutiliza
  `USER_REPOSITORY` exportado), registra `GetProfileUseCase` +
  `UpdateProfileUseCase` (`AUDIT_LOGGER` lo resuelve `AuditModule`, `@Global()`).

### Tests (todos unitarios con dobles de puertos/repos; sin Postgres)
- `jwt-token-service.spec.ts` (R1, R4, R6/R8) — jsonwebtoken es JS puro, corre normal.
- `login-user.dto.spec.ts` (R3), `login-user.use-case.spec.ts` (R1, R2, R4).
- `auth.controller.spec.ts` extendido (R1-R3, R15 de login).
- `auth.guard.spec.ts` (R5-R8), `current-user.decorator.spec.ts` (R8),
  `public.decorator.spec.ts` (R7).
- `modules/health/infrastructure/health.controller.spec.ts` — nuevo, regresión
  R7 (`/v1/health` sigue público).
- `user.drizzle.repository.spec.ts` extendido — `findByEmail`, `findById`,
  `updateProfile` (R1, R9, R10 del lado del repositorio).
- `country.schema.spec.ts` (R12), `update-profile.dto.spec.ts` (R10-R13).
- `get-profile.use-case.spec.ts` (R9), `update-profile.use-case.spec.ts`
  (R10, R13, R14), `profile-response.mapper.spec.ts` (R9, R15),
  `users.controller.spec.ts` (R9-R13, R15 + caso borde 404 sin R-id).
- `argon2-password-hasher.spec.ts` extendido (R1, R2 de `verify()`) —
  **segfault conocido, ver abajo**.
- `auth.module.spec.ts` extendido (ahora también resuelve `LoginUserUseCase`
  y `APP_GUARD`) — **segfault conocido, ver abajo**.

## Archivos modificados
- `backend-pet-tracker/package.json` + `pnpm-lock.yaml` — `jsonwebtoken` +
  `@types/jsonwebtoken`.
- `backend-pet-tracker/pnpm-workspace.yaml` — estaba en el working tree sin
  commitear desde una sesión anterior (`allowBuilds` para argon2/esbuild/
  unrs-resolver); lo incluí en el commit de setup porque es necesario para
  que `pnpm install` reproduzca este entorno.
- `.env.example` + `docs/conventions.md` — fila `JWT_SECRET`.
- `modules/auth/domain/ports/password-hasher.ts` — `+verify()`.
- `modules/auth/infrastructure/security/argon2-password-hasher.ts` —
  implementa `verify()` delegando en `argon2.verify`.
- `modules/auth/domain/repositories/user.repository.ts` — `+findByEmail`,
  `+findById`, `+updateProfile`, `+ProfileFieldChanges`.
- `modules/auth/infrastructure/repositories/user.drizzle.repository.ts` —
  implementa los 3 métodos nuevos.
- `modules/auth/domain/errors/user.errors.ts` — `+InvalidCredentialsError`,
  `+UserNotFoundError`.
- `modules/auth/infrastructure/auth.controller.ts` — `+POST login`,
  `@Public()` en `register`/`verifyEmail`/`login`.
- `modules/auth/auth.module.ts` — registra `TOKEN_SERVICE`,
  `LoginUserUseCase`, `{ provide: APP_GUARD, useClass: AuthGuard }`; exporta
  `USER_REPOSITORY`.
- `modules/auth/application/dto/register-user.dto.ts` — usa `CountrySchema`
  compartido (refactor).
- `modules/auth/application/use-cases/register-user.use-case.spec.ts` —
  actualicé el doble de `UserRepository`/`PasswordHasher` a la interface
  extendida (sin cambiar el comportamiento testeado).
- `modules/health/infrastructure/health.controller.ts` — `+@Public()` en
  `check` (regresión R7).
- `src/app.module.ts` — importa `UsersModule`.

## Requisitos cubiertos

Rutas relativas a `backend-pet-tracker/src/`. Detalle completo con el nombre
de cada `describe` en `specs/auth-login-me/traceability.md` (sin filas
"pendiente").

- R1: `modules/auth/application/use-cases/login-user.use-case.spec.ts::R1`,
  `modules/auth/infrastructure/auth.controller.spec.ts::R1 (auth-login-me)`,
  `modules/auth/infrastructure/repositories/user.drizzle.repository.spec.ts::R1 (auth-login-me)`,
  `modules/auth/infrastructure/security/jwt-token-service.spec.ts::R1/R8`,
  commit `501bd01`
- R2: `login-user.use-case.spec.ts::R2`, `auth.controller.spec.ts::R2 (auth-login-me)`, commit `501bd01`
- R3: `application/dto/login-user.dto.spec.ts::R3`, `auth.controller.spec.ts::R3 (auth-login-me)`, commit `501bd01`
- R4: `login-user.use-case.spec.ts::R4`, `jwt-token-service.spec.ts::R4`, commit `501bd01`
- R5: `modules/auth/infrastructure/guards/auth.guard.spec.ts::R5`, commit `42310f6`
- R6: `auth.guard.spec.ts::R6`, commit `42310f6`
- R7: `auth.guard.spec.ts::R7`, `infrastructure/decorators/public.decorator.spec.ts::R7`,
  `modules/health/infrastructure/health.controller.spec.ts::R7`, commit `42310f6`
- R8: `auth.guard.spec.ts::R8`, `infrastructure/decorators/current-user.decorator.spec.ts::R8`, commit `42310f6`
- R9: `modules/users/application/use-cases/get-profile.use-case.spec.ts::R9`,
  `infrastructure/mappers/profile-response.mapper.spec.ts::R9`,
  `infrastructure/users.controller.spec.ts::R9`, commit `4c37f52`
- R10: `modules/users/application/dto/update-profile.dto.spec.ts::R10`,
  `application/use-cases/update-profile.use-case.spec.ts::R10`,
  `infrastructure/users.controller.spec.ts::R10`, commit `f87f45b`
- R11: `update-profile.dto.spec.ts::R11`, `users.controller.spec.ts::R11`, commit `f87f45b`
- R12: `modules/auth/application/dto/country.schema.spec.ts::R12`,
  `update-profile.dto.spec.ts::R12`, `users.controller.spec.ts::R12`, commit `f87f45b`
- R13: `update-profile.dto.spec.ts::R13`, `update-profile.use-case.spec.ts::R13`,
  `users.controller.spec.ts::R13`, commit `f87f45b`
- R14: `update-profile.use-case.spec.ts::R14`, commit `f87f45b`
- R15: `auth.controller.spec.ts::R15 (auth-login-me)` (login),
  `profile-response.mapper.spec.ts::R15` (GET), `users.controller.spec.ts::R15`
  (PATCH), commits `501bd01`, `4c37f52`, `f87f45b`

Commits de la feature (todos en `feature/4-auth-login-me`, en orden):

| Commit | Alcance |
|---|---|
| `0199fab` | docs: spec aprobada de spec_author |
| `0507ff1` | chore: jsonwebtoken, JWT_SECRET, pnpm-workspace.yaml (setup previo) |
| `501bd01` | R1, R2, R3, R4, R15 (login) |
| `89713e4` | docs: traceability R1-R4 |
| `42310f6` | R5, R6, R7, R8 (guard global + decoradores) |
| `8b90316` | docs: traceability R5-R8 |
| `4c37f52` | R9 (GET /v1/me) |
| `4b225ba` | docs: traceability R9 |
| `f87f45b` | R10, R11, R12, R13, R14 (PATCH /v1/me) |
| `980ef58` | test: extiende auth.module.spec.ts, cierra tasks.md/traceability.md |

## Decisiones de diseño

Las decisiones grandes venían dadas por `specs/auth-login-me/design.md`
(JWT propio detrás de `TokenService`, `APP_GUARD` en vez de `@Global()`,
`UsersModule` reutilizando `USER_REPOSITORY` exportado por `AuthModule`,
`timezone` validada con `Intl.supportedValuesOf`, auditoría de `user.update`
solo con nombres de campo) y se respetaron sin desviaciones. Lo que decidí
por debajo de ese nivel:

- **`access_token` en snake_case en el body de `POST /v1/auth/login`**:
  R1/R4 de `requirements.md` usan literalmente `access_token`, no
  `accessToken` — a pesar de que el resto del contrato HTTP del proyecto es
  camelCase (`firstName`, etc.), seguí el texto literal del requisito en vez
  de "corregirlo" a la convención general, porque es un contrato explícito
  de la spec aprobada, no una elección de estilo mía.
- **`InvalidCredentialsError` único para email inexistente y password
  incorrecto** (R2): el use case ni siquiera intenta `passwordHasher.verify`
  si el usuario no existe — no hay comparación contra un hash "dummy" para
  igualar tiempos; R2 solo exige el mismo status/body en ambos casos, y
  agregar mitigación de timing attack no pedida habría sido inventar alcance.
- **`UserNotFoundError` + mapeo a 404 en `GET`/`PATCH /v1/me`**: caso borde
  no cubierto por ningún R (el usuario del JWT fue borrado después de
  emitido el token) pero necesario para no dejar un error de dominio crudo
  llegar al cliente (regla dura de `docs/conventions.md`). Sin R-id en el
  `describe` de su test porque no corresponde a un requisito de la spec,
  mismo criterio que el `describe` sin R-id de `auth.module.spec.ts` en
  `auth-registration`.
- **`CountrySchema` extraído a `application/dto/country.schema.ts`**:
  refactor de `register-user.dto.ts` (de `auth-registration`) sin cambiar su
  comportamiento — verificado con sus 14 tests existentes en verde antes y
  después. Compartido con `UpdateProfileSchema` para no duplicar el regex
  ISO 3166-1, tal como pedía `design.md`.
- **`pnpm-workspace.yaml` incluido en el commit de setup**: el archivo ya
  existía sin commitear en el working tree al empezar esta sesión (de una
  sesión anterior que documentó el hallazgo de argon2 en `STATUS.md`). Lo
  agregué al primer commit de dependencias porque sin él `pnpm install`
  falla al reconstruir `argon2`/`esbuild` en este entorno; no es parte del
  diseño de esta feature pero es necesario para reproducir el setup.
- **Instalación de dependencias con `pnpm add --ignore-scripts`**: `pnpm add
  jsonwebtoken` sin esa flag intenta reconstruir `argon2` desde fuente (el
  mismo hallazgo de entorno de `STATUS.md`: `make` no está instalado) y
  aborta antes de escribir `package.json`. Con `--ignore-scripts` se evita
  tocar el binario de `argon2` ya presente (prebuild `linux-x64` intacto,
  verificado con `node -e "require('argon2')"` — que sí segfaultea, pero el
  archivo sigue ahí sin corromperse).

## Output de build

```
> backend-pet-tracker@0.0.1 build
> nest build && tsc-alias -p tsconfig.build.json

✅ Build exitoso (exit code 0)
```

## Output de tests

Excluyendo los 2 archivos con segfault conocido (ver más abajo):

```
> jest --testPathIgnorePatterns="argon2-password-hasher.spec.ts" "auth.module.spec.ts"

Test Suites: 41 passed, 41 total
Tests:       161 passed, 161 total
Snapshots:   0 total
Time:        ~6s
```

Baseline antes de esta feature (tras `auth-registration`, excluyendo los
mismos 2 archivos): 28 suites / 96 tests. No se rompió ningún test existente.

`npx tsc --noEmit`: sin errores. `pnpm run lint`: sin errores.

## Segfault conocido en este sandbox (no confirmable localmente)

Confirmado empíricamente en esta sesión (los corrí uno por uno antes de
asumir nada):

- `src/modules/auth/infrastructure/security/argon2-password-hasher.spec.ts`
  → `Segmentation fault (core dumped)`, exit code 139.
- `src/modules/auth/auth.module.spec.ts` → mismo resultado.
- `src/modules/auth/infrastructure/auth.controller.spec.ts` → **corre
  normal** (14→19 tests verdes): no importa `AuthModule` ni
  `Argon2PasswordHasher`, instancia `AuthController` a mano con casos de uso
  mockeados. Lo confirmé antes de asumir que estaría en la lista.

Causa (documentada en `STATUS.md`, "Nuevo hallazgo de entorno 2026-07-31"):
el prebuild nativo de `argon2` (`linux-x64/argon2.glibc.node`) segfaultea al
cargarse con `require('argon2')` en este sandbox concreto; compilar desde
fuente falla porque no hay `make`. Cualquier archivo que importe (directa o
transitivamente) `argon2-password-hasher.ts` —incluido `auth.module.ts`,
que lo registra como provider real— hace caer el proceso de Jest al
cargarse, no al ejecutar un test puntual.

**Requisitos que quedan sin confirmar por ejecución local** (sí cubiertos
por test escrito y por lectura/typecheck):
- R1/R2 del lado de `Argon2PasswordHasher.verify()` (el use case de login sí
  está 100% verificado con un doble de `PasswordHasher`, así que la lógica
  de negocio de R1/R2 corre en verde; lo que no se ejecutó es el adaptador
  concreto de argon2).
- El wiring de DI completo de `AuthModule` con `LoginUserUseCase` y
  `APP_GUARD` resolviendo a una instancia real de `AuthGuard` — verificado
  por lectura del módulo y por `tsc --noEmit`, no por ejecución.

CI de GitHub Actions corre `ubuntu-latest`/linux-x64 (mismos prebuilds que
`auth-registration` ya verificó ahí) y debería seguir verde con este mismo
commit — no es una regresión de código, es una limitación de este sandbox
puntual.

## Notas para el reviewer

1. **Docker sigue sin estar disponible** en este sandbox (`docker compose
   ps` → `permission denied`, mismo hallazgo que `auth-registration`). No
   hay migración nueva en esta feature (no se tocó el schema de `users`,
   solo se agregaron queries), así que no hay SQL nuevo por verificar contra
   Postgres real, pero sigue sin haber e2e con supertest — mismo criterio
   que `auth-registration`: preferí no versionar un e2e que nadie ha visto
   pasar en este entorno.
2. **`access_token` en snake_case es intencional** (ver Decisiones de
   diseño) — si el reviewer prefiere camelCase, es un cambio de contrato que
   requeriría tocar `requirements.md` (R1/R4), no solo el código.
3. **`auth.module.spec.ts`**: no pude confirmar en ejecución que
   `moduleRef.get(APP_GUARD)` resuelve a una instancia de `AuthGuard` (lo
   asumí correcto porque es el patrón estándar de Nest para `{ provide:
   APP_GUARD, useClass: X }`, pero no lo vi pasar en este sandbox). Vale la
   pena que quien tenga un entorno sin el problema de argon2 (o CI) confirme
   ese test puntual.
4. **`UserNotFoundError`/404 en `/v1/me`**: agregué este manejo sin que
   ningún requisito lo pida explícitamente. Si el reviewer prefiere que
   quede fuera de alcance (dejando que el error de dominio se propague sin
   mapear), es reversible sin tocar ningún R.
5. **Dónde mirar seguridad**: `JwtTokenService` es el único archivo que
   importa `jsonwebtoken`; `AuthGuard` nunca deja pasar una ruta no-`@Public()`
   sin que `tokenService.verify()` haya devuelto un payload válido (cualquier
   excepción — firma inválida, expirado, malformado — se traduce a 401 sin
   distinción, cerrado con tests de R6). `password_hash` nunca sale de
   `modules/auth/domain` hacia una respuesta HTTP: los tres mappers de
   salida (`user-response`, `profile-response`, y el body de login que solo
   trae `access_token`) son listas explícitas de campos.
6. **`feature_list.json` sigue en `in_progress`** y `STATUS.md`/
   `progress/current.md` no se tocaron: por instrucción explícita, eso lo
   cierra el leader.

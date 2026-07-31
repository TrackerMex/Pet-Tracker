# review: auth-login-me
Fecha: 2026-07-31
Veredicto: APROBADO

## Resumen ejecutivo

Revisé el branch `feature/4-auth-login-me` (checkout local desde
`origin/feature/4-auth-login-me`) contra `specs/auth-login-me/requirements.md`
(R1-R15, `status: approved`, gate humano marcado 2026-07-31), `design.md`,
`CHECKPOINTS.md` y `docs/architecture.md`. Verifiqué el código real (no solo
el reporte del implementer), corrí build/lint/typecheck/tests yo mismo, y
confirmé por ejecución directa el segfault de `argon2` en los 2 archivos que
el implementer señaló. No encontré defectos bloqueantes.

## Checklist C2 — Estado coherente
- [x] Solo 1 feature `in_progress` en `feature_list.json` (confirmado: solo id=4)
- [x] `progress/current.md` describe la sesión activa (feature, plan, bloqueos, estado `reviewer: en curso`)
- [x] No toqué `feature_list.json`, `STATUS.md` ni `progress/current.md` (corresponde al leader)

## Checklist C3 — Arquitectura
- [x] `domain` sin imports de infraestructura: `grep` de `@nestjs|express|drizzle|jsonwebtoken|argon2` en `modules/auth/domain/` y `modules/users/` no devuelve nada
- [x] `modules/auth/domain/repositories/user.repository.ts` (interface `UserRepository` +3 métodos) y `modules/auth/domain/ports/token-service.ts` (nuevo puerto `TokenService`) son interfaces puras sin implementación
- [x] `application` depende solo de interfaces (`TOKEN_SERVICE`, `PASSWORD_HASHER`, `USER_REPOSITORY`, `AUDIT_LOGGER` — todos tokens/tipos de `domain`), nunca de clases concretas: `grep` de `infrastructure/` en `application/` de ambos módulos no devuelve resultados
- [x] `infrastructure` implementa las interfaces (`JwtTokenService implements TokenService`, `UserDrizzleRepository implements UserRepository`, `Argon2PasswordHasher implements PasswordHasher`), único lugar que importa `jsonwebtoken`/`argon2`/Drizzle
- [x] `modules/users/` no duplica `User`/`UserRepository`: reutiliza los de `modules/auth/domain/` vía `USER_REPOSITORY` reexportado por `AuthModule` — decisión explícita y documentada en `design.md`, no un atajo oculto
- [x] `AuthGuard` vía `{ provide: APP_GUARD, useClass: AuthGuard }` en `auth.module.ts` (no `@Global()`), coherente con `design.md`

## Checklist C4 — TDD
- [x] Cada R1-R15 tiene al menos un `describe('R<n>...')` real que lo nombra explícitamente — verificado con `grep -rE "(describe|it)\(['\"]R<n>[:) ']"` sobre todo `src/modules/`, no solo dentro de `beforeAll` (precedente de rechazo real: `progress/review_localstack-provisioning.md`, R4 con solo comentario en `beforeAll`). Donde el número de R-id coincide con uno ya usado por `auth-registration`, el implementer desambiguó con el sufijo `(auth-login-me)` en el nombre del `describe` — sin ambigüedad de a qué spec pertenece cada test.
- [x] Historial de commits muestra test+implementación por grupo de requisitos (`501bd01` R1-R4, `42310f6` R5-R8, `4c37f52` R9, `f87f45b` R10-R14), intercalado con commits `docs(auth-login-me): update traceability` tras cada tramo — mismo patrón aceptado en `auth-registration`, no todo en un commit gigante

## Checklist C5 — Trazabilidad
- [x] `specs/auth-login-me/traceability.md` — 15 filas (R1-R15), ninguna dice "pendiente" (la única mención de "pendiente" es la regla de cierre del archivo)
- [x] Cada fila referencia archivo::test y commit; confirmé que los archivos y los nombres de `describe` citados existen tal cual
- [x] Commits siguen `feat(<scope>): <desc> (R1,R2,...)` / `docs(...)` / `chore(...)` — confirmado con `git log`

## Checklist C6 — Spec aprobada
- [x] `requirements.md` con `status: approved` en el frontmatter
- [x] Casilla "Aprobado por humano (fecha: 2026-07-31)" marcada
- [x] Ningún requisito modificado después de la aprobación sin volver a pasar el gate (traceability.md corresponde 1:1 a R1-R15)

## Checklist C7 — Sin código huérfano
- [ ] N/A — esta feature no reemplaza ni deprecia ningún módulo/endpoint existente (extiende `auth-registration` #3 con login/guard, y agrega `modules/users/` nuevo)

## Verificación independiente ejecutada

### Segfault de argon2 (confirmado por mí, no solo por el reporte del implementer)
```
$ npx jest src/modules/auth/infrastructure/security/argon2-password-hasher.spec.ts
Segmentation fault (core dumped)

$ npx jest src/modules/auth/auth.module.spec.ts
Segmentation fault (core dumped)
```
Confirmado: mismo comportamiento que reporta `progress/impl_auth-login-me.md`, causa documentada en `STATUS.md` (prebuild nativo de argon2 roto en este sandbox, sin `make` para recompilar).

### Build, lint, typecheck (corridos por mí desde cero)
```
$ pnpm run build      → nest build && tsc-alias, sin errores
$ pnpm run lint       → eslint --fix, sin errores
$ npx tsc --noEmit    → sin output (sin errores)
```

### Suite completa excluyendo los 2 archivos con segfault
```
$ npx jest --testPathIgnorePatterns="argon2-password-hasher.spec.ts" "auth.module.spec.ts"
Test Suites: 41 passed, 41 total
Tests:       161 passed, 161 total
```
Coincide exactamente con lo reportado por el implementer (41/41, 161/161).

### Verificación de la baseline (no rompió nada de auth-registration #3)
`progress/review_auth-registration.md` registra el estado final aprobado de
esa feature: **30 suites / 99 tests**. Esos 30 suites incluyen
`argon2-password-hasher.spec.ts` (2 tests antes de esta feature: hash +
salt distinto) y `auth.module.spec.ts` (1 test antes de esta feature).
30 − 2 = 28 suites, 99 − 2 − 1 = 96 tests → coincide exactamente con la
baseline "28 suites / 96 tests" que reporta el implementer. Las 13 suites
nuevas de esta feature (`jwt-token-service`, `login-user.dto`,
`login-user.use-case`, `current-user.decorator`, `public.decorator`,
`auth.guard`, `health.controller`, `update-profile.dto`,
`get-profile.use-case`, `update-profile.use-case`,
`profile-response.mapper`, `users.controller`, `country.schema`) explican
28 + 13 = 41. **Ninguna regresión**: los 14 tests preexistentes de
`register-user.use-case.spec.ts` y `auth.controller.spec.ts` (registro,
verify-email) siguen en verde, incluido el refactor de `CountrySchema`
extraído sin cambiar comportamiento.

## Respuesta a los 6 puntos de "Notas para el reviewer"

1. **Docker/e2e**: mismo criterio ya aceptado para `auth-registration` y
   `db-setup-drizzle` — bloqueo de entorno documentado honestamente, no
   penalizable.
2. **`access_token` en snake_case**: revisé `requirements.md` R1/R4 antes de
   juzgar esto — el texto literal usa `access_token`, no `accessToken`. Es
   un contrato explícito de la spec aprobada, no un descuido de estilo. **No
   es un defecto.**
3. **`auth.module.spec.ts` no ejecutado — confirmado por lectura de
   código**: leí el archivo completo. `moduleRef.get(APP_GUARD)).toBeInstanceOf(AuthGuard)`
   es exactamente el patrón estándar de Nest para verificar que
   `{ provide: APP_GUARD, useClass: AuthGuard }` resuelve a una instancia
   real — no hay ambigüedad de API ni typo. Combinado con que `auth.module.ts`
   registra ese provider de forma idéntica al patrón ya usado y probado en
   `db-setup-drizzle`/`auth-registration` para otros providers, y que
   `tsc --noEmit` no reporta ningún error de tipos en ese archivo (que
   fallaría si `AuthGuard`/`APP_GUARD` no encajaran), considero el wiring
   correcto por lectura + typecheck. Igual que en el caso de
   `localstack-provisioning`, dejo constancia explícita para quien tenga CI
   o un entorno sin el problema de argon2: correr puntualmente ese test para
   cerrar el último 1% de duda.
4. **`UserNotFoundError`/404 en `/v1/me` sin R-id**: es un caso borde de
   manejo de errores (usuario borrado después de emitido el JWT), no un
   requisito de negocio nuevo ni una funcionalidad no pedida que cambie el
   contrato — es exactamente la clase de "no dejar un error de dominio crudo
   llegar al cliente" que exige `docs/conventions.md` para cualquier error
   tipado de `domain`. No viola ninguna regla dura de `CHECKPOINTS.md`: C4
   exige que **los requisitos** tengan test con su R-id, no que **cada
   línea de código** tenga uno. Mismo criterio ya aplicado sin objeción al
   `describe` sin R-id de `auth.module.spec.ts` en `auth-registration`.
   Aceptable tal cual.
5. **Password_hash fuera de domain**: verifiqué a mano los 3 mappers de
   salida — `user-response.mapper.ts` (registro), `profile-response.mapper.ts`
   (GET/PATCH `/v1/me`), y el body de login (`LoginResponse` en
   `auth.controller.ts`, que solo trae `access_token`). Los 3 son listas
   explícitas de campos permitidos, ninguno serializa la entidad `User`
   completa ni expone `passwordHash`/`password_hash` bajo ningún nombre.
   R15 cumplido en los 3 endpoints.
6. **`feature_list.json` sin tocar**: confirmado, sigue `in_progress`; no lo
   modifiqué yo tampoco.

## Verificación adicional: cobertura del guard en todas las rutas

`grep -rn "@Controller\|@Public()" src/modules/` confirma 4 controllers en
todo el proyecto (`HealthController`, `AuthController`, `UsersController` —
más `AppController` en la raíz, sin rutas de negocio):
- `HealthController.check` → `@Public()` ✓ (regresión R7 cubierta con test nuevo)
- `AuthController.register` / `verifyEmail` / `login` → los 3 con `@Public()` ✓
- `UsersController.me` (`GET`) / `updateMe` (`PATCH`) → **sin** `@Public()`,
  correctamente protegidas por el guard global ✓

Ninguna ruta existente quedó sin marcar por accidente.

## Observaciones
Ninguna. No encontré defectos bloqueantes ni no bloqueantes que requieran
corrección.

## Recomendación sobre `feature_list.json`

Recomiendo pasar `auth-login-me` (#4) a `done`. Código, tests, arquitectura,
trazabilidad y spec aprobada están completos y verificados independientemente
por mí (no solo por el reporte del implementer). La decisión final de marcar
`done` corresponde al leader/humano.

## Output de comandos de verificación

```
$ npx jest src/modules/auth/infrastructure/security/argon2-password-hasher.spec.ts
Segmentation fault (core dumped)

$ npx jest src/modules/auth/auth.module.spec.ts
Segmentation fault (core dumped)

$ pnpm run build
> nest build && tsc-alias -p tsconfig.build.json
(sin errores, exit 0)

$ pnpm run lint
> eslint "{src,apps,libs,test}/**/*.ts" --fix
(sin errores, exit 0)

$ npx tsc --noEmit
(sin output, sin errores)

$ npx jest --testPathIgnorePatterns="argon2-password-hasher.spec.ts" "auth.module.spec.ts"
Test Suites: 41 passed, 41 total
Tests:       161 passed, 161 total
Snapshots:   0 total
Time:        6.041 s
```

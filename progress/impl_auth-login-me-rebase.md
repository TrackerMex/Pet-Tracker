# impl: auth-login-me — rebase sobre main + cierre del PR #5

Fecha: 2026-08-01
Branch: `feature/4-auth-login-me` (rebased sobre `origin/main` `c734e6f`)
Máquina: Windows local con Docker real (postgres + localstack 4.14 healthy).

## Rebase

`git rebase origin/main` — 12 commits reaplicados. Conflictos: los 3
previstos, ninguno extra.

1. `backend-pet-tracker/src/modules/auth/infrastructure/auth.controller.ts`
   — main traía los imports en alias, el branch añadía login con relativos.
   Se conservaron todas las adiciones del branch (`LoginUserUseCase`,
   `InvalidCredentialsError`, endpoint `POST /auth/login`, `@Public()`) con
   los imports cross-layer en forma alias. `./decorators/public.decorator`
   se queda relativo (misma capa).
2. `.../auth.controller.spec.ts` — misma resolución: imports del branch en
   alias, se conservan los tests de login.
3. `STATUS.md` — base de main (sesión 2026-08-01 con los seguimientos de
   #2/#3 cerrados intacta) integrando del branch:
   - Header: 2026-08-01, 4/18 completadas, 14 pendientes (lista del branch).
   - Bloque `auth-login-me (#4) done` completo, final ajustado: PR #5
     abierto, CI estaba rojo por el test de `APP_GUARD` (corregido en este
     rebase), pendiente merge humano.
   - Hallazgo de argon2 (2026-07-31) conservado pero acotado a AQUEL
     sandbox Linux: en esta máquina los 2 specs afectados corren y pasan, y
     CI siempre estuvo verde en ese aspecto.
   - Entradas de sesión del 2026-07-31 (ambas, las de #4) colocadas debajo
     de la 2026-08-01 (más reciente arriba).
   - "Próximo paso SDD" → merge humano del PR #5, luego `spec_author` para
     `pets-crud-permissions` (#5).

Mapeo de hashes pre→post rebase de los commits de código citados en la
traceability: `501bd01→c54c43d`, `42310f6→ab4972e`, `4c37f52→23c35eb`,
`f87f45b→bc59aa6`.

## Refactor alias (convención endurecida de `docs/conventions.md` §Imports)

22 imports cross-layer convertidos a `@/modules/<modulo>/<capa>/...` en 7
archivos (commit `28179a1`):

- `auth/application/use-cases/login-user.use-case.ts` (8) y `.spec.ts` (5)
- `auth/infrastructure/guards/auth.guard.ts` (2) y `.spec.ts` (1)
- `auth/infrastructure/security/jwt-token-service.ts` (1)
- `users/infrastructure/users.controller.ts` (3) y `.spec.ts` (2)

Se quedan relativos (permitido): imports de misma capa
(`../dto/`, `../verification-token`, `../decorators/`, `../guards/`,
`../entities/`) y el wiring de los `*.module.ts` root.

## Fix del test APP_GUARD (commit `c8ab4d6`)

`src/modules/auth/auth.module.spec.ts`: `moduleRef.get(APP_GUARD)` nunca
puede resolver en un TestingModule (Nest reempaqueta los providers
`APP_GUARD` bajo tokens únicos internos del core module). Se eligió la
opción metadata por ser la más simple y robusta:

- Aserción nueva en un `it` propio, nombrado por su R-id:
  `R5: registra AuthGuard como guard global via APP_GUARD` — lee
  `Reflect.getMetadata('providers', AuthModule)` y aserta que contiene
  `{ provide: APP_GUARD, useClass: AuthGuard }` (exactamente lo que Nest
  lee al registrar el guard global). La vía funcional (401 sin token) ya
  estaba cubierta por `auth.guard.spec.ts::R5` con dobles y ahora también
  por e2e (ver abajo).
- El test DI original queda como `instancia el controller y los tres casos
  de uso` (sin la aserción imposible).
- Se eliminó el comentario obsoleto del segfault de argon2 (propio del
  sandbox anterior; aquí el spec corre y pasa).
- `specs/auth-login-me/traceability.md`: añadido `auth.module.spec.ts::R5`
  a la fila R5 y re-mapeados los 4 hashes pre-rebase (commit `69c7935`).

## Hallazgo extra durante la verificación e2e

`test/app.e2e-spec.ts` (scaffold, nunca corrido contra Docker antes)
esperaba `GET /v1` → 200 "Hello Pet Tracker!". Con el guard global de #4,
`/v1` no está en la lista pública de R7 → responde 401. El e2e se alineó a
la spec: `/v1 (GET) sin token responde 401 (R5: guard global por defecto)`
(commit `8ae4687`). No se tocó `AppController` (marcarlo `@Public()` habría
sido una decisión de diseño fuera de la spec).

Además, el `.env` local (gitignored, copiado de `.env.example` antes de #4)
no tenía `JWT_SECRET` y los e2e fallaban con `Configuration key "JWT_SECRET"
does not exist`. Se añadió al `.env` local el valor de desarrollo de
`.env.example` (`dev-only-jwt-secret-change-me`). Sin cambio versionado:
`.env.example` ya lo traía desde `dc81810`.

## Verificación (todo desde `backend-pet-tracker/`)

- `pnpm test`: **43 suites / 167 tests, 0 fallos** (1 más que los 166
  previstos: el fix separó la aserción del guard en un `it` propio).
- `pnpm run build`: verde (`nest build && tsc-alias`).
- `pnpm run test:e2e`: **3 suites / 15 tests verdes** contra Postgres y
  LocalStack reales (sin tocar contenedores).
- `./init.sh` (raíz): **todo verde** — install, build, tests, lint,
  typecheck; reporta 4/18 completadas, próxima #5 `pets-crud-permissions`.
- `grep -rn "\.\./\.\." src/modules --include="*.ts"`: quedan 5 líneas,
  todas en `src/modules/health/` (feature #1): 4 son cross-layer
  (application→domain, infrastructure→domain) y 1 cross-module
  (infrastructure→`db/`). health quedó fuera del refactor de main
  (`626bb10` solo tocó `src/modules/auth/`) y fuera del alcance de #4 —
  deuda preexistente, candidata a limpieza propia. En `auth/` y `users/`
  no queda ningún `../..`.

## Commits nuevos (post-rebase)

| Hash | Mensaje |
|---|---|
| `28179a1` | refactor(auth-login-me): use @/ alias for cross-layer imports per updated convention |
| `c8ab4d6` | fix(auth-login-me): assert APP_GUARD wiring via module metadata (R5) |
| `69c7935` | docs(auth-login-me): remap traceability hashes after rebase, add R5 module wiring test |
| `8ae4687` | test(auth-login-me): root /v1 e2e now expects 401 behind the global guard (R5) |

Push: `git push --force-with-lease` OK (`37b4120...8ae4687`, PR #5
actualizado). Grafo refrescado con `graphify update .` (1458 nodos / 1917
edges / 153 comunidades).

## Notas para el reviewer

- Verificar la resolución de `STATUS.md`: que la sesión 2026-08-01 de main
  sobrevivió intacta y que el bloque de argon2 quedó correctamente acotado.
- El cambio de contrato de `GET /v1` (200 → 401) es consecuencia directa de
  R5/R7; si se quiere una raíz pública habría que especificarlo en una
  feature futura.
- Los `../..` de `src/modules/health/` violan la convención endurecida pero
  son deuda de #1, no de este branch.

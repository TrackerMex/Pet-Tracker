# impl: auth-alias-refactor
Fecha: 2026-08-01
Branch: fix/jest-e2e-alias
Commit: 626bb10f69c62ae1e51be1f2a0d876b15c1b30ce

Refactor mecánico de imports en `backend-pet-tracker/src/modules/auth/` para
cumplir la convención endurecida en `docs/conventions.md` §Imports (commit
`25ee4ae`): alias `@/...` obligatorio para saltos de capa dentro del mismo
módulo. Sin cambio de comportamiento — solo líneas de import.

## Archivos modificados (14, solo imports)

- application/use-cases/register-user.use-case.ts — 10 imports `../../domain/...` → `@/modules/auth/domain/...`
- application/use-cases/register-user.use-case.spec.ts — 6 imports
- application/use-cases/verify-email.use-case.ts — 5 imports
- application/use-cases/verify-email.use-case.spec.ts — 4 imports
- infrastructure/auth.controller.ts — 6 imports (`../application/...` → `@/modules/auth/application/...`, `../domain/...` → `@/modules/auth/domain/...`)
- infrastructure/auth.controller.spec.ts — 5 imports
- infrastructure/email/console-email-verification-sender.ts — 1 import
- infrastructure/email/console-email-verification-sender.spec.ts — 1 import
- infrastructure/mappers/user-response.mapper.ts — 1 import
- infrastructure/mappers/user-response.mapper.spec.ts — 1 import
- infrastructure/repositories/email-verification-token.drizzle.repository.ts — 2 imports
- infrastructure/repositories/user.drizzle.repository.ts — 2 imports
- infrastructure/repositories/user.drizzle.repository.spec.ts — 1 import
- infrastructure/security/argon2-password-hasher.ts — 1 import

**Total: 46 líneas de import reescritas** (git diff: 46 insertions, 46
deletions; cero líneas no-import cambiadas, verificado con
`git diff -U0 | grep -v "from '"` → 0).

## Imports relativos que se dejaron (misma capa o root del módulo)

- `../dto/register-user.dto`, `../dto/verify-email.dto`, `../verification-token`
  en application/use-cases — dentro de la capa application.
- `../entities/...` en domain/repositories — dentro de la capa domain.
- `./application/...`, `./domain/...`, `./infrastructure/...`, `./auth.module`
  en `auth.module.ts` y `auth.module.spec.ts` — el root del módulo no está en
  ninguna capa; su wiring hacia abajo no es cruce domain↔application↔infrastructure
  ni subida a la raíz (el caso `../../auth.module` de la convención). No existía
  ningún import que subiera a la raíz del módulo.
- Alias ya correctos (`@/audit/...`, `@/db/...`) intactos.

## Verificaciones (todas desde backend-pet-tracker/ salvo init.sh)

1. `grep -rn "\.\./\.\." src/modules/auth --include="*.ts"` → **0 resultados**
   (no quedó ningún `../..`, ni siquiera de misma capa).
2. `pnpm test` → **30 suites passed, 99 tests passed** (5.6 s).
3. `pnpm run build` → **verde** (`nest build && tsc-alias -p tsconfig.build.json`).
4. `pnpm run test:e2e` → **3 suites passed, 15 tests passed** (4.1 s), contra
   Docker ya levantado (no se tocaron contenedores).
5. `./init.sh` (raíz del repo) → **verde** ("Todo verde. Listo para trabajar."),
   incluye lint (`eslint --fix` no alteró nada: el diff siguió en 46/46) y
   typecheck sin errores.

## Notas para el reviewer

- Cambio 100 % mecánico: cada línea del diff es un `import ... from` cuyo
  especificador relativo cross-layer pasó a `@/modules/auth/<capa>/...`.
- El orden de imports ya cumplía eslint import/order tras el rewrite
  (internal `@/` antes de parent/sibling), por eso `--fix` no reordenó nada.
- `graphify update .` ejecutado tras el commit para mantener el grafo al día.

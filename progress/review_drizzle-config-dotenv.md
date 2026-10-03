# review: drizzle-config-dotenv
Fecha: 2026-09-06
Veredicto: APROBADO

Branch `fix/drizzle-config-dotenv` (worktree `/home/claude/sites/Pet-Tracker`),
commits `f50db31` (test rojo) y `eb68611` (fix) sobre merge-base `f0872ea`.
`origin/main` avanzó a `aa8b395` (PR #108) después de cortar el branch;
`git merge-tree origin/main HEAD` mergea limpio y #108 no toca ninguno de los
5 archivos del fix. Sin spec: fallback al subagente `implementer` declarado en
`progress/current.md` y en `progress/impl_drizzle-config-dotenv.md`
(CLAUDE.md §Excepciones). Se revisa contra los 6 criterios del leader.

## Criterios del fix

- [x] **1. Carga del `.env` raíz y abort claro.** `backend-pet-tracker/drizzle.config.ts`
  importa `config as loadDotenv` de `dotenv` y llama `loadDotenv({ path: '../.env' })`,
  literalmente la misma línea que `scripts/provision-local.ts:1,10`. Lee
  `process.env.DATABASE_URL` una vez, lanza `Error` que nombra `DATABASE_URL`
  si es `undefined` o `''` (`if (!databaseUrl)` cubre ambas), y `dbCredentials.url`
  recibe la variable sin `?? ''` (verificado en el diff: la línea con `?? ''`
  desaparece).
- [x] **2. Comentario R6 y check estático.** El bloque R6 original se conserva
  íntegro y gana un párrafo que explica por qué este archivo carga dotenv. 
  `src/db/database-url-source.spec.ts` no está en el diff; sigue escaneando
  `SRC_DIR = join(__dirname,'..','..','src')`, y `drizzle.config.ts` queda fuera
  como antes. Verde en mi corrida (`R6: DATABASE_URL nunca via process.env directo`).
- [x] **3. Spec.** `describe('R2: drizzle.config.ts points to schema barrel and
  migrations folder')` / `it('sets schema, out and dialect for drizzle-kit')` y
  sus tres `expect` se conservan con nombres y aserciones idénticos; lo único
  que cambia es que el módulo se carga vía `loadDrizzleConfig()` en vez del
  `import` estático — necesario, porque con el fix un import estático
  dependería del `.env` real en CI. Los dos `it` nuevos cubren la rama de error
  (`delete process.env.DATABASE_URL` → `toThrow(/DATABASE_URL/)`) y la rama con
  valor (`dbCredentials.url === TEST_DATABASE_URL`). `jest.doMock('dotenv')`
  dentro de `jest.isolateModules` y `afterEach` restaura `process.env.DATABASE_URL`
  al valor original (o lo borra si no existía). Mock comprobado efectivo: con el
  `../.env` real presente y con `DATABASE_URL` definida, el test "aborta" sigue
  verde (si dotenv real se ejecutara, repoblaría la variable y fallaría).
  `package.json`/lockfile sin cambios: cero dependencias nuevas.
- [x] **4. Docs.** `docs/conventions.md` §Variables de entorno: párrafo nuevo tras
  "El `.env` vive en la raíz del repo…" que documenta `pnpm db:migrate` /
  `pnpm db:generate` desde `backend-pet-tracker/` (ambos scripts existen en
  `package.json`), la excepción dotenv (misma que `provision-local.ts`) y el
  abort. Coherente con la regla "nunca `process.env` directo fuera de la
  configuración" y con la fila `DATABASE_URL` de la tabla.
- [x] **5. Rojo→verde (C4).** `git show f50db31 --stat`: solo
  `src/db/drizzle-config.spec.ts`. `eb68611`: `drizzle.config.ts`,
  `docs/conventions.md`, `progress/current.md`, `progress/impl_…md`. Ejecuté el
  spec en un worktree temporal detached en `f50db31` (node_modules enlazado,
  eliminado después con `git worktree remove`): `1 failed, 2 passed` y el rojo
  es `Received function did not throw` en `drizzle-config.spec.ts:44` — rojo
  legítimo por aserción, no un `ReferenceError`. En HEAD: 3/3 verde.
- [x] **6. Alcance del diff.** `git diff --stat f0872ea..HEAD` toca exactamente:
  `backend-pet-tracker/drizzle.config.ts`, `backend-pet-tracker/src/db/drizzle-config.spec.ts`,
  `docs/conventions.md`, `progress/current.md`, `progress/impl_drizzle-config-dotenv.md`.
  (Un `diff origin/main..HEAD` a secas lista además `feature_list.json` y
  `specs/mobile-ui-language/*`: son los cambios de #108 en `origin/main`, no del branch.)

## Rama de error del CLI real (sin base de datos)

Script con `trap restore EXIT`: renombré `/home/claude/sites/Pet-Tracker/.env`
a `.env.review-bak`, corrí `cd backend-pet-tracker && env -u DATABASE_URL npx drizzle-kit migrate`
y el trap lo restauró. `.env` antes y después: `1520 bytes mtime=1787245698`,
sin `.env.review-bak` residual, `git status` limpio. No se abrió ninguna conexión.

```
No config path provided, using default 'drizzle.config.ts'
Reading config file '/home/claude/sites/Pet-Tracker/backend-pet-tracker/drizzle.config.ts'
◇ injected env (0) from ../.env // tip: ⌘ multiple files { path: ['.env.local', '.env'] }
Falta DATABASE_URL: drizzle-kit la lee del .env de la raíz del repo (../.env desde backend-pet-tracker/). Copia .env.example a .env en la raíz — ahí está el valor local — o exporta DATABASE_URL antes de correr pnpm db:migrate.
exit=1
```

## Checklist C2 — Estado coherente
- [x] Solo 1 feature in_progress (init.sh: "Sin features en progreso"; el fix no tiene id)
- [x] progress/current.md actualizado (sección "Backend: fix drizzle.config.ts no carga .env", declara el fallback)

## Checklist C3 — Arquitectura
- [x] domain sin imports de infrastructure — N/A: el diff no toca ninguna capa
- [x] repositories/contratos en domain son interfaces puras — N/A
- [x] application depende de interfaces, no implementaciones — N/A
- [x] infrastructure sin lógica de negocio — `drizzle.config.ts` es config de CLI en la raíz del paquete; el spec vive en `src/db/` donde ya estaba el test R2

## Checklist C4 — TDD
- [x] Cada requisito tiene al menos un test que lo nombra — sin R-ids (fix sin spec); los tres `it` nombran la propiedad que prueban y el R2 heredado conserva su prefijo
- [x] Historial de commits muestra test-primero — `f50db31` rojo por aserción, `eb68611` verde (verificado ejecutando ambos)

## Checklist C5 — Trazabilidad
- [x] traceability.md sin filas "pendiente" — N/A: no hay spec. `specs/db-setup-drizzle/traceability.md` sigue apuntando a `drizzle-config.spec.ts` para R2 y ese test sigue existiendo con el mismo nombre
- [x] Commits siguen el formato — `test(db): …` y `fix(db): …`, conventional commits de `docs/conventions.md` §Commits; sin R-ids porque no hay requisitos numerados

## Checklist C6 — Spec aprobada
- [ ] N/A — fix suelto sin spec, excepción de CLAUDE.md §Excepciones declarada en `progress/current.md` y en el reporte del implementer

## Checklist C7 — Sin código huérfano
- [ ] N/A — esta feature no reemplaza nada existente (el spec anterior se amplía, no se sustituye)

## Observaciones

Ninguna bloqueante sobre el fix. Notas para el leader:

1. **`./init.sh` no llegó a exit 0 en este worktree por una causa ajena al
   branch** (detalle abajo): la única línea roja de la corrida limpia es el
   typecheck móvil, provocada por `mobile-pet-tracker/.expo/types/router.d.ts`,
   artefacto **gitignorado** generado el 2026-08-22, anterior a la ruta
   `/pairing` (`c6fd268`, 2026-09-03). Lo probé sin tocar el árbol: un
   tsconfig en el scratchpad que extiende el del móvil y excluye `.expo/`
   → `tsc --noEmit` rc=0; el mismo config incluyendo ese archivo → reproduce
   exactamente el único `TS2345 '/pairing'`. Los worktrees `wt-ui` y
   `pet-tracker-43` no tienen ese archivo y por eso su typecheck pasa. No lo
   borré ni regeneré (no es mi rol tocar el entorno del leader). Para el exit
   0 literal antes del PR: borrar `mobile-pet-tracker/.expo/types/router.d.ts`
   (o regenerarlo con `expo start`, que es lo único que lo escribe en
   `@expo/cli`) y relanzar `./init.sh`. Apruebo siguiendo la instrucción del
   leader de no rechazar por un rojo móvil que no toca estos archivos.
2. dotenv 17 imprime `◇ injected env (0) from ../.env // tip: …` en cada
   `drizzle-kit`. Cosmético; `provision-local.ts` hace lo mismo. `quiet: true`
   lo silenciaría pero rompería el "patrón exacto" pedido. No cambiar.
3. Avisos preexistentes de init.sh, no de este fix: `.env` sin
   `RESEND_API_KEY`, `RESEND_FROM`, `RESET_LINK_HOST`; `STATUS.md` 58/63 vs 60/72.
4. El branch va 2 merges por detrás de `origin/main`; merge limpio, sin
   necesidad de rebase para el PR.

## Output de ./init.sh

Tres corridas; cierro con la **tercera** (única limpia).

- **Corrida 1** (04:0x): exit 1 en e2e, `test/pet-reminders.e2e-spec.ts`
  R7 "procesa la cadena real y un segundo tick no vuelve a enviar":
  `sendPush` 0 llamadas (esperada 1). **Colisión**: otro `./init.sh` corría a
  la vez desde `/home/claude/sites/Pet-Tracker-wt-ui` (pid 2192479, otra
  sesión) y los e2e de ambos worktrees comparten el Postgres/LocalStack de
  docker. Ese spec aislado justo después: 33/33 verde. Nada del branch entra
  en el camino del e2e (`drizzle.config.ts` solo lo importa su propio spec).
- **Corrida 2**: la aborté yo (TaskStop) al detectar que el `init.sh` de
  `wt-ui` seguía vivo; esperé a que terminara con un bucle sobre
  `pgrep -f 'bash ./init.sh'` + `/proc/<pid>/cwd`.
- **Corrida 3 (limpia)**: `START 2026-09-06T04:23:54Z other_init=[]`,
  `END 04:27:40Z`, muestreador cada 10 s sin ningún `OVERLAP`. Exit 2 solo en
  el último paso (typecheck móvil, ver Observación 1).

```
✅ node / pnpm / bun disponibles
✅ .env encontrado — DATABASE_URL definida
⚠️  .env desactualizado: faltan RESEND_API_KEY, RESEND_FROM, RESET_LINK_HOST (preexistente)
✅ Dependencias instaladas
✅ Archivos del harness presentes
✅ Sin features en progreso (sesión limpia)
⚠️  STATUS.md desactualizado (58/63 declarado vs 60/72 real) (preexistente)
✅ Build exitoso                      (nest build + tsc-alias, infra synth)
backend   Test Suites: 163 passed, 163 total / Tests: 1237 passed, 1237 total
infra     Test Suites: 2 passed, 2 total   / Tests: 14 passed, 14 total
env-drift node --test: fail 0
mobile    Test Suites: 59 passed, 59 total / Tests: 891 passed, 891 total
✅ Tests pasados
e2e       Test Suites: 3 skipped, 25 passed, 25 of 28 total / Tests: 8 skipped, 353 passed, 361 total
✅ Tests e2e pasados
✅ Lint sin errores                   (backend eslint, infra eslint, expo lint)
→ Typecheck...                        (backend tsc y infra tsc pasan; encadenados con &&)
$ tsc --noEmit                        (mobile)
src/app/(tabs)/home.tsx(242,48): error TS2345: Argument of type '"/pairing"' is not assignable to parameter of type '"/home" | RelativePathString | ... 142 more ... | { ...; }'.
INIT_EXIT=2
```

Verificación independiente adicional (HEAD, `backend-pet-tracker/`):
`npx jest src/db/drizzle-config.spec.ts src/db/database-url-source.spec.ts`
→ `Test Suites: 2 passed / Tests: 4 passed`.
Typecheck móvil sin el artefacto obsoleto (tsconfig en scratchpad, árbol
intacto): `tsc rc=0`.

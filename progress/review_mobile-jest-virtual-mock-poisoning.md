# review: mobile-jest-virtual-mock-poisoning
Fecha: 2026-10-24
Veredicto: APROBADO

Worktree `/home/claude/sites/Pet-Tracker-wt-207`, branch `feature/207-mobile-jest-virtual-mock-poisoning`,
HEAD `b1b8ec8e`, H0 `9abc466e`. Implementer: subagente `implementer` (Sonnet), fallback anotado
en `progress/current.md`. Reviewer: Opus. No corrí `./init.sh` (lo corre el leader, CC4).

## Checklist C2 — Estado coherente
- [x] Máximo 1 feature in_progress (hay 0; #207 figura `spec_ready`, ver no bloqueante N4)
- [x] progress/current.md describe la sesión activa (#207, fallback al implementer, H0)

## Checklist C3 — Arquitectura
- [x] N/A: el diff neto son cinco ficheros `*.test.ts(x)` de `mobile-pet-tracker/src/`; no hay
  domain, application ni infrastructure en juego. El candado solo usa `fs` y `path` (D3).

## Checklist C4 — TDD
- [x] Cada R<n> tiene un test que lo nombra: `describe('#207 R1: …')` (1 it) y
  `describe('#207 R2: …')` (2 its) en `src/__tests__/jest-virtual-mock-lock.test.ts`, títulos
  idénticos a D11.
- [x] Test primero: A `4500e89b` solo añade el candado y está rojo por aserción (2 failed, 1 passed);
  B `c56e7bc7` es la corrección y lo pone verde. Las cláusulas vía b se cierran por mutación
  commiteada (C/D y E/F), con rojo por aserción, nunca por `ReferenceError`.

## Checklist C5 — Trazabilidad
- [x] traceability.md sin filas «pendiente» (`grep -ci pendiente` = 0); los seis hashes completos
  existen y son ancestros de HEAD.
- [x] Los seis mensajes coinciden literalmente con tasks.md §Orden de commits (ámbito `test(mobile)`
  aceptado en la firma); la trazabilidad va en `docs(#207): trazabilidad`.

## Checklist C6 — Spec aprobada
- [x] requirements.md, design.md, tasks.md con `status: approved`; casilla `[x]` con firma delegada
  (commit `9abc466e`, mandato del humano en `progress/plan_canvas-parity-2026-10-23.md` §4) y
  errata E1 commiteada antes (`dd495f34`). Entre H0 y HEAD solo cambia `traceability.md` en `specs/`.

## Checklist C7 — Sin código huérfano
- [x] N/A — esta feature no reemplaza nada existente

## CC1 (A y B)
Medido en un worktree temporal `git worktree add --detach` bajo el scratchpad (no en el de la
feature), con `.env` copiado y `bun install --frozen-lockfile` (exit 0). Comando literal de CC1
(caché nueva con `mktemp -d`, `--runInBand`, `exit` leído de `echo exit=$?` sin pipe; la salida
de jest a un log por redirección). `pgrep -af '[i]nit.sh'` vacío; ningún otro jest en la máquina
(load average 2.0).

- **A `4500e89b`**: `exit=1`. Orden `profile` (96 s), `food`, `meal-schedule`, `health`,
  `back-button`. `Test Suites: 1 failed, 4 passed, 5 total`; `Tests: 1 failed, 476 passed, 477 total`.
  Único rojo `#172 R2: BackButton › #172 R2: pinta ChevronLeft de 24 en foreground`,
  `Expected: "color:foreground"` / `Received: "#0D1117"`. Coincide con CC1 (errata E1).
- **B `c56e7bc7`**: `exit=0`. `Test Suites: 5 passed, 5 total`; `Tests: 477 passed, 477 total`.
  Coincide con CC1. Sin rojos de tiempo; no hizo falta repetir.

## CC2 — corrección mínima
`git diff --numstat 4500e89b..c56e7bc7 -- mobile-pet-tracker`, exactamente cuatro líneas:
`0 1 food`, `0 1 health`, `0 1 meal-schedule`, `1 1 profile` (tabulador). `git diff --name-only A..B`
lista solo esos cuatro ficheros. El diff es el de D2: se borra `  { virtual: true },` en los tres
y `}), { virtual: true });` pasa a `}));` en profile. Aserciones y títulos intactos.

## CC3 — regresión, tsc y lint
En un worktree temporal en `b1b8ec8e`:
- `bunx jest --runInBand --runTestsByPath` de las siete rutas: `exit=0`,
  `Test Suites: 7 passed, 7 total` (siete pedidas, siete impresas), `Tests: 594 passed, 594 total`.
- `bunx tsc --noEmit`: exit 0, salida vacía (con `.expo/types/router.d.ts` ausente).
- `bunx expo lint > log 2>&1 && test ! -s log`: código 0, log de 0 bytes.

## CC5 — sin producción
`git diff --name-only 9abc466e..HEAD -- mobile-pet-tracker | sort`: exactamente cinco rutas, todas
`.test.ts(x)`: el candado y los cuatro tests. `git diff --numstat B D` y `D F` vacíos; F y HEAD
idénticos en `mobile-pet-tracker/`. Ni JSX, ni estilos, ni `src/theme/`, ni `jest.config`,
`package.json`, `test/` o `docs/`.

## CC6
Ver C5: trazabilidad sin «pendiente» y commits según tasks.md.

## Deriva frente a dev
`origin/dev` (ref local `8bd88522`) es ancestro de HEAD, y en ella la opción solo aparece en los
cuatro tests que B limpia: el candado no se pondrá rojo al mergear contra esa base.

## Candado por commit (cuenta de tasks.md) y anclas
`bunx jest --runInBand --runTestsByPath src/__tests__/jest-virtual-mock-lock.test.ts` en el
worktree temporal, commit a commit:

| Commit | exit | Salida | Esperado |
|---|---|---|---|
| A `4500e89b` | 1 | `Tests: 2 failed, 1 passed, 3 total` (R1 y primer it de R2) | igual |
| B `c56e7bc7` | 0 | `Tests: 3 passed, 3 total` | igual |
| C `d223bc70` | 1 | `Tests: 2 failed, 1 passed, 3 total` (R1 y primer it de R2) | igual |
| D `01d8d2e0` | 0 | `Tests: 3 passed, 3 total` | igual |
| E `bffd1e88` | 1 | `Tests: 1 failed, 2 passed, 3 total` (segundo it de R2) | igual |
| F `f96d4f95` | 0 | `Tests: 3 passed, 3 total` | igual |

Rojo de A por aserción, no por `ReferenceError`: R1 `expect(problems).toEqual([])` recibe
`screens/{food,health,meal-schedule,profile}/index.test.tsx: contiene la opción virtual`; R2
`expect(violations).toEqual([])` recibe las cuatro rutas de `screens/`.

Las nueve anclas de tasks.md §Anclas, medidas en Base `9abc466e` y en A a F: todas las celdas
coinciden con la tabla (Base `1 1 1 1 | 4 | – | 1 | 1 1 1 | – | – | – | –`; fila 8 a 0 y fila 9
a 1 solo en E; fila 3 a 1 solo en C; fila 4 a 0 solo en C).

## Mutaciones de control (reproducidas por el reviewer)
En C (todas a la vez, sobre B):
- **M-R1a** (profile `jest.doMock('expo-image-picker'`): falla `#207 R1`; `toEqual([])` recibe
  `["screens/profile/index.test.tsx: no registra jest.mock de expo-image-picker"]`.
- **M-R2a, M-R2b, M-R2c, M-R2d**: falla el primer it de `#207 R2`; `toEqual([])` recibe
  `["__tests__/jest-virtual-mock-lock.test.ts", "app/(tabs)/__tests__/screens.test.tsx",
  "screens/add-pet/index.test.tsx", "utils/form-rules.test.ts"]`, la lista ordenada de tasks.md.
  Cada ruta nombra su mutación (d, a, c, b).

En E (a la vez) el segundo it de `#207 R2` falla con `Received array: []`, que solo muestra el
efecto de M-R2f. Por eso las medí también solas sobre F:
- **M-R2e** sola (`entry.name === '__tests__' ? [] : allTestFiles(path)`): falla
  `el recorrido incluye al propio candado`; `toContain('__tests__/jest-virtual-mock-lock.test.ts')`
  recibe una lista que empieza en `"hooks/use-pet-selection.test.tsx"`, sin ninguna ruta `__tests__/`.
- **M-R2f** sola (`/\.tests\.tsx?$/`): mismo it, `Received array: []`.

Los diffs de C y E son exactamente las líneas de la tabla de tasks.md; `git diff --numstat B D`
y `git diff --numstat D F` (sobre `mobile-pet-tracker`) no imprimen nada.

## Mutación en zona ciega (del reviewer)
Sobre F en el worktree temporal, una a una, cada una revertida con `git checkout HEAD --`
(o `rm` si el fichero era nuevo); al final `git status --short` 0 líneas y `git diff --cached` 0.

| Id | Dónde | Texto plantado | ¿Lo ve? |
|---|---|---|---|
| Z1 | `src/app/(auth)/__tests__/layout.test.tsx` (otro directorio con paréntesis) | `jest.mock('x', () => ({}), { virtual: true });` | **Sí**. Primer it de R2 rojo, recibe `["app/(auth)/__tests__/layout.test.tsx"]` |
| Z2 | `src/screens/home/__tests__/format-dates.test.ts` (`.ts` en `__tests__` anidado) | `jest.mock(` con cada argumento en su línea y la clave y los dos puntos en líneas distintas (`virtual` ⏎ `: true,`) | **Sí**. Recibe `["screens/home/__tests__/format-dates.test.ts"]` (`\s*` cruza el salto) |
| Z3 | `src/app/__tests__/detail-stack.navigation.test.tsx` (nombre con dos puntos) | `jest.mock('x',()=>({}),{virtual<TAB>:true});` | **Sí**. Recibe `["app/__tests__/detail-stack.navigation.test.tsx"]` |
| Z4 | `src/app/(auth)/__tests__/layout.test.tsx` | `{ ['virtual']: true }` (clave calculada) | No: 3 verdes. Límite declarado en D5 y en el comentario del candado |
| Z5 | idem | `const virtual = true;` + `{ virtual }` (abreviada) | No: 3 verdes. Límite declarado en D5 |
| Z6 | idem | `{ virtual /* c */ : true }` (comentario entre clave y dos puntos) | No: 3 verdes. Límite **no** declarado |
| Z7 | `src/utils/zz-mutacion.test.js` (fichero nuevo `.test.js`) | la línea estándar más un `it` vacío | No: 3 verdes. Fuera de la definición de «test móvil» (`*.test.ts(x)`), pero jest lo correría |
| Z8 | `src/__tests__/ui-copy-table.ts` (en `__tests__`, sin `.test.`) | la línea estándar | No: 3 verdes. Fuera de la definición; `jest --listTests` sí lista este fichero |

Conclusión: el candado ve la forma estándar, otro espaciado (tabulador, sin espacios) y los saltos
de línea entre argumentos y entre la clave y los dos puntos, a cualquier profundidad y en
directorios con paréntesis. No ve Z4 a Z8; Z4 y Z5 son límites declarados, Z6 a Z8 van en no
bloqueantes.

## CC4 (log del leader)
`/tmp/claude-1002/-home-claude-sites-Pet-Tracker/ad9357a2-d69d-40e4-8877-cbe2e7790272/scratchpad/init-207.log`, `exit=0`:
backend `187 passed / 1474 passed`, infra `2 / 14`, móvil `Test Suites: 147 passed, 147 total`,
`Tests: 5018 passed, 5018 total`, `Snapshots: 1 passed, 1 total`, e2e `30 passed, 30 of 33 total`
/ `468 passed, 476 total` (3 suites y 8 tests skipped). Cero `●` que no sean `Console` y cero
`FAIL`. Frente a T0 `146 / 5015 / 1`: +1 suite y +3 tests, lo que pide CC4. El log no imprime el
HEAD; tomo `b1b8ec8e` del leader, y en `mobile-pet-tracker/` HEAD es idéntico a F.

## Bloqueantes
Ninguno.

## No bloqueantes
- **N1. Z6 no declarado.** `{ virtual /* c */ : true }` (comentario entre la clave y los dos
  puntos) elude el patrón `/\bvirtual['"]?\s*:/` y no figura entre los límites del comentario del
  candado ni de D5. Es rebuscado; si se amplía, basta con añadirlo al comentario de techo.
- **N2. La definición de «test móvil» es más estrecha que el `testMatch` real de jest.** El
  `testMatch` efectivo (preset `jest-expo`) es `**/__tests__/**/*.[jt]s?(x)` y
  `**/?(*.)+(spec|test).[tj]s?(x)`. Un `.test.js`, un `.spec.ts` o cualquier `.ts` en
  `__tests__/` (hoy `src/__tests__/ui-copy-table.ts`, que `jest --listTests` lista) corren en el
  mismo proceso y podrían envenenar el mapa, pero el candado no los recorre (Z7, Z8). Tampoco los
  helpers no-test que llamen a `jest.doMock`. El implementer cumple la spec al pie de la letra; hoy
  hay cero apariciones. Es la misma clase de zona ciega que la pregunta abierta 1: ampliar el
  filtro a `/\.(test|spec)\.[jt]sx?$/` más los ficheros de `__tests__/` sería otra feature o una
  enmienda.
- **N3. Las mutaciones de E se tapan entre sí.** Con M-R2e y M-R2f a la vez, el rojo de E
  (`Received array: []`) solo prueba M-R2f; la evidencia de M-R2e sale de correrla sola (informe del
  implementer y esta revisión). La spec las agrupó así a propósito; en specs futuras, conviene
  agrupar mutaciones cuyos rojos no se solapen.
- **N4. `feature_list.json`.** #207 sigue `spec_ready`; AGENTS.md §6 paso 5 lo pasa a
  `in_progress` tras el gate. Es tarea del leader al cerrar.
- **N5. Árbol del worktree.** `progress/current.md` modificado y `handoff_`, `impl_`,
  `leader_note_207.md` y este review sin commitear: le toca al leader.

## Output de ./init.sh
No lo corrió el reviewer (el clasificador lo deniega); lo corrió el leader sobre `b1b8ec8e`. Resumen
en §CC4. Logs del reviewer en el scratchpad: `rev207-cc1-A.log`, `rev207-cc1-B.log`,
`rev207-lock-<hash>.log`, `rev207-m-R2e.log`, `rev207-m-R2f.log`, `rev207-z-*.log`,
`rev207-cc3.log`, `rev207-tsc.log`, `rev207-lint.log`, y el script `rev207-zona-ciega.sh`. El
worktree temporal se borró con `git worktree remove` sin `--force` (exit 0).

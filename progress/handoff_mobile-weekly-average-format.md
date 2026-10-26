Worktree: /home/claude/sites/Pet-Tracker-wt-219
NO lances ./init.sh aunque AGENTS.md lo pida: lo corre el leader (comparte LocalStack y Postgres con otros worktrees).
Primer comando, antes de nada: `cd /home/claude/sites/Pet-Tracker-wt-219 && pwd && git branch --show-current`. Confirma en el reporte que la salida es esa ruta y la branch `feature/219-mobile-weekly-average-format`.

Feature: mobile-weekly-average-format (#219). Branch: feature/219-mobile-weekly-average-format. Integra en `dev`, no en `main`.
H0 (base de la implementación y del diff final): fb6b9ad2, firma delegada de la spec (2026-10-26, mandato del humano ampliado). El código de la app en H0 es el de `origin/dev` 81ca7529. NO hagas `git merge` ni `git rebase` de nada.
Spec aprobada: specs/mobile-weekly-average-format/requirements.md (status: approved). Lee también design.md (§Candados: inventario cerrado) y tasks.md (la cadena C1 a C5). No hay decisiones abiertas: no hay nada que preguntar. No hay artboard para #219.
Orden: tasks.md manda, cadena C1 a C5 abajo. Criterios de aceptación: R1 a R9 de requirements.md (las tablas de casos son el contrato: cópialas tal cual como filas de `it.each`). La casilla de smoke en dispositivo es del humano; tú no la tocas.
Entorno: el worktree ya tiene `.env` y `mobile-pet-tracker/node_modules` (`bun install --frozen-lockfile` ya corrido). No los regeneres. Usa `bun`/`bunx` para todo en mobile-pet-tracker; nunca npm ni npx. No añadas dependencias (`package.json` y `bun.lock` no cambian).
Árbol: `progress/*.log` los ignora git. El chequeo de árbol limpio se acota: `cd /home/claude/sites/Pet-Tracker-wt-219/mobile-pet-tracker && git diff --quiet -- . ../docs ../specs && test -z "$(git ls-files --others --exclude-standard -- . ../docs ../specs)"`. Nunca `test -z "$(git status --short)"` tras `git add`.

Archivos (lista cerrada; si necesitas otro, PARA y pregunta al leader). Todos bajo mobile-pet-tracker/src/ salvo indicación:
  - screens/home/format.ts (R1, R2)
  - screens/home/format.test.ts (R1, R2, R3)
  - screens/home/weekly-activity-chart.tsx (R6, R7)
  - screens/home/weekly-activity-chart.test.tsx (R4, R5, R6, R7 y los tres literales de coma)
  - ../../specs/mobile-weekly-average-format/traceability.md (solo en el commit final)
  - ../../progress/impl_mobile-weekly-average-format.md (tu reporte)
No tocar: i18n/catalog.ts, __tests__/ui-copy-table.ts, __tests__/ui-language.test.ts, providers/__tests__/language-provider.test.tsx, __tests__/design-drift.test.ts, screens/map/index.tsx, screens/home/index.tsx, screens/home/index.test.tsx, screens/home/pingo-phrase.ts, screens/home/pingo-phrase.test.ts, theme/global.css, feature_list.json, STATUS.md, progress/history.md, progress/current.md, progress/handoff_*.md, docs/ ni backend-pet-tracker/.

Reglas críticas:
  - Seguir docs/architecture.md, docs/conventions.md y docs/ui-guidelines.md. La carta gana sobre cualquier skill.
  - Skills, con los nombres del catálogo de Codex (plugin expo 1.0.2, 13 skills; no los nuestros). La spec puede nombrar `expo:expo-overview`: NO existe en Codex, no la busques.
    - `building-native-ui`: UI nativa (aquí solo texto del gráfico).
    - `expo-tailwind-setup`: uniwind y clases Tailwind v4 (no cambias clases).
    - `appllama-app-design-skill` (en `.agents/skills/`): obligatoria según la carta §Skills; aquí no hay diseño nuevo, solo cárgala y dilo. Codex no tiene el MCP de appllama: si la skill pide sus herramientas, sáltalas.
    - `expo-overview`, `expo-animation`, `expo-router` y `expo-design-system` no existen en Codex.
    - En el reporte, lista qué skills cargaste y cuáles no encontraste.
  - Esperas: docs/conventions.md §Esperas sobre el árbol renderizado. Espera al mismo nodo que aserta el test, nunca a un contador de mock. Tras `await fireEvent.press` de una métrica, lee la etiqueta con `await screen.findBy...` o `waitFor`.
  - RNTL 14: `await fireEvent`, `await render`, `await renderRouter` y `await act`. Sin await, un it contamina al siguiente.
  - Jest corre en UTC: `process.env.TZ` NO cambia `Date`. Aquí no hay `Date` en el cálculo.
  - Valores de la spec (formatos, filas de las tablas) son literales del test, nunca importados de producción (candado tautológico). Las etiquetas se comparan con regex anclada `^...$` (el escape de `+` y `.` es obligatorio); `toHaveTextContent` con cadena es subcadena.
  - Comentarios de código y títulos de `describe`/`it`: la referencia a la feature va solo como `#219 R<n>`, nunca `#219` desnudo (el exento de `HEX_LITERAL` de design-drift es solo `#NNN R<n>`). Todo `describe`/`it.each` nuevo se titula `#219 R<n>: …`.
  - Los tres literales de coma de la tendencia (bloque `R12` de weekly-activity-chart.test.tsx) se enmiendan en el commit de test de C2: `'+12,5 % frente a la semana previa'` → `'+12.5 % …'`, y los dos `'-8,3 % …'` → `'-8.3 % …'`. Los `it` conservan su nombre y llevan el sufijo ` (enmendado por #219 R6)`. Es la única edición permitida en los `it` viejos.
  - Cero `StyleSheet.create`, hex fuera de `src/theme/`, clases `[...]`, emoji o dependencias nuevas. No tocas `className`.
  - Candados agregados: design.md §Candados es el inventario cerrado y dice que ninguna cifra cambia. Si al correr la suite aparece en rojo un `it` que no está allí, PARA y anótalo con el diff medido; no lo enmiendes por tu cuenta.
  - Sondas de mutación (tasks.md): cada una se planta en producción, se ve el rojo concreto y se revierte (no se commitea). (a) quitar `Math.round` de `fmtMinutes`; (b) `fmtCount` con `Math.round(count * 10) / 10` (debe poner roja la fila `3.05`); (c) `fmtKm` devolviendo `'22 km'` con `22000` (rojas las filas `0` y `22000`); (d) `Math.round` sobre `average` en el gráfico (rojo el `it` de R5); (e) pasar `locale` de vuelta al constructor de la tendencia (rojo el `it` de R7). Sin la sonda el candado no está probado: anótalo. Los `it` que nacen verdes (R3 entero, R5, las filas «verde al nacer», los `it` de R4 `Media 2` y `Media 1.0 km`, R6 `0`/`+1`/`+100`/`+12` y el inglés) se declaran en el reporte y se demuestran con la mutación.
  - TDD por requisito: test rojo que nombra el R-id, después verde. Antes de cada commit de test, comprueba que los `it` nuevos fallan por la aserción (las filas que requirements.md declara rojas), no por import roto ni excepción. Si una fila declarada roja nace verde, o una declarada verde nace roja, PARA y reporta.
  - UN COMMIT POR PASO como mínimo, test rojo antes que su implementación (C4 de CHECKPOINTS.md): `test(#219): …` y luego `feat(#219): …`, mensajes en inglés tras el prefijo. Nunca implementación y test en el mismo commit.
  - Commits: `git add` con rutas explícitas, solo los ficheros del paso. Nunca `git add -A` ni `commit -a`. El móvil no tiene prettier: no lo ejecutes.
  - Cada cadena termina en su línea `git commit -m`. Las cabeceras de sección van como comentario de shell (`# -- C1 --`).
  - Commit final: traceability.md con los hashes y tu reporte, en UN commit `docs(#219): …` tras el último verde. No rebasees tras rellenarlo.
  - Jest de un fichero: `cd /home/claude/sites/Pet-Tracker-wt-219/mobile-pet-tracker && bunx jest --runTestsByPath <ruta> --testTimeout=30000`, solo con `pgrep -f '[n]ode_modules/(.bin/jest|jest-worker)'` y `pgrep -f '[i]nit.sh'` vacíos (otros worktrees corren jest en esta máquina: si no están vacíos, espera y vuelve a mirar; nunca esperes e `init.sh` en el mismo comando). Un timeout aislado se mide sin flag antes de tocar nada.
  - Tipos: antes de cada `bun run typecheck` o `bunx tsc --noEmit`, ejecuta `test ! -e .expo/types/router.d.ts`. Si existe, PARA. Nunca `rm -f`.
  - Lint, siempre con `--no-cache` y redirect al log, sin pipe: `cd /home/claude/sites/Pet-Tracker-wt-219/mobile-pet-tracker && bunx expo lint --no-cache > ../progress/lint-219.log 2>&1 && test ! -s ../progress/lint-219.log`. `expo lint` puede morir por memoria con exit 0: por eso `test ! -s`.
  - Si dejas de usar `locale` en `formatTrendPercent`, el `locale` del componente sigue usándose en otras líneas (`toLocaleLowerCase`, etiquetas de día): no lo retires de ahí. Sin variables ni parámetros sin uso (lint).
  - No crear recursos AWS reales ni correr cdk deploy.
  - NO son tuyos: progress/history.md, progress/current.md, STATUS.md y el campo `status` de feature_list.json. Tu sitio para contarlo todo es progress/impl_mobile-weekly-average-format.md.
  - No abras la PR ni la edites. No hagas push.
  - Si el sandbox te deniega un comando, PARA y repórtalo. No lo sustituyas por otro que haga lo mismo.
  - Un error de invocación (ENOENT sobre una ruta, `command not found` antes de que arranque jest, tsc o eslint, sin ficheros tocados) se corrige y se anota en el reporte. Solo PARA si falla el código, una cifra de esta lista o una guarda.
  - Si una cifra o ancla no coincide, PARA y reporta. La spec se reescribe; el código no se adapta.

Anclas de la base (T0): corre cada una tal cual antes del primer test, desde /home/claude/sites/Pet-Tracker-wt-219/mobile-pet-tracker/src, y pega la salida en el reporte. Salidas esperadas medidas por el leader en H0; ante una diferencia, PARA:
  grep -cF "export function fmtMinutes" screens/home/format.ts            # 1
  grep -cF "export function fmtCount" screens/home/format.ts              # 1
  grep -cF "export function fmtKm" screens/home/format.ts                 # 1
  grep -cF "formatTrendPercent" screens/home/weekly-activity-chart.tsx    # 2
  grep -cF ".replace('.', ',')" screens/home/weekly-activity-chart.tsx    # 1
  grep -cF "LOCALES" screens/home/weekly-activity-chart.tsx               # 0
  grep -nF "export const LOCALES" i18n/catalog.ts                         # 927:export const LOCALES = { es: 'es-MX', en: 'en-US' } as const;
  grep -cF "12,5 %" screens/home/weekly-activity-chart.test.tsx           # 1
  grep -cF "8,3 %" screens/home/weekly-activity-chart.test.tsx            # 2
  grep -cF "NO_COMPARISON" screens/home/weekly-activity-chart.test.tsx    # 26
  grep -cF "function makeWeek" screens/home/weekly-activity-chart.test.tsx   # 1
  grep -cF "function makeDay" screens/home/weekly-activity-chart.test.tsx    # 1
  grep -cF "function renderChart" screens/home/weekly-activity-chart.test.tsx   # 2
  grep -cF "#219" screens/home/format.ts screens/home/weekly-activity-chart.tsx   # format.ts:0 y weekly-activity-chart.tsx:0
  (desde mobile-pet-tracker/) test ! -e .expo/types/router.d.ts && echo sin-router-d-ts   # sin-router-d-ts
Un `grep -c` cuenta líneas, no apariciones. `function renderChart` da 2 porque también casa `async function renderChartWithProps`; el helper que usas es `async function renderChart(` (firma con locale opcional: léela antes de escribir el `it` en inglés).

Base de tests (T0): mídela tú antes del primer commit, con `pgrep` vacíos: `cd /home/claude/sites/Pet-Tracker-wt-219/mobile-pet-tracker && bun run test > ../progress/t0-219.log 2>&1; echo exit=$?` y pega las líneas `Test Suites:` y `Tests:` en el reporte. Debe ser exit 0 y cero `FAIL`. El aviso final de worker force-exit es preexistente. Regla de carga: si un rojo de la suite completa es una suite que no tocaste y pasa sola (Mapa #72 R2, Salud #168 R2, Nutrición #200, Inicio #152 R8 son flakes conocidos bajo carga), córrela aislada, anota el rojo y el verde aislado en el reporte y sigue. Si el rojo persiste aislado, o es un `it` de tu alcance, PARA. La cifra de tests de cada commit = anterior + sus `it` añadidos (anótalo).

Cadena (tasks.md manda; pega la línea `Tests:` de tu fichero tras cada commit):
  # -- C1 -- test(#219): R1-R3 lock the minutes, count and km formatters. screens/home/format.test.ts: tres `it.each` (`'#219 R1: …'` 19 filas, `'#219 R2: …'` 13 filas, `'#219 R3: …'` 8 filas), +40 tests. Rojas las 12 filas de R1 y las 8 de R2 que requirements.md nombra; R3 y las filas «verde al nacer» verdes. Las filas se copian tal cual de las tablas.
  # -- C2 -- test(#219): R4-R7 lock the average label and the trend. screens/home/weekly-activity-chart.test.tsx: `describe('#219 R4: …')` con `it.each` de 9 filas, `it('#219 R5: …')`, `it.each('#219 R6: …')` de 9 filas más el `it` en inglés, `it('#219 R7: …')` con espía de Intl.NumberFormat restaurado en `finally`: +21 tests; y los tres literales de coma enmendados. Rojos los que requirements.md declara rojos (R4 es/en minutos y paseos con decimales, R6 filas es con decimal más las tres enmiendas, R7); verdes R5 y los declarados.
  # -- C3 -- feat(#219): R1, R2 round minutes first and show one decimal in counts. screens/home/format.ts: `fmtMinutes` (Math.round y luego partir) y `fmtCount` (`String(Number(count.toFixed(1)))`). `fmtKm` NO se toca. Verde C1 y R4.
  # -- C4 -- feat(#219): R6, R7 format the trend with a fixed locale and a decimal point. screens/home/weekly-activity-chart.tsx: `formatTrendPercent(value)` con `new Intl.NumberFormat(LOCALES.en, { signDisplay: 'exceptZero', maximumFractionDigits: 1, useGrouping: false })`, sin `.replace` y sin parámetro `locale`; el llamador pasa solo `trend`; `LOCALES` se importa de `../../i18n/catalog` (ajusta la ruta relativa al estilo de los imports del fichero). Todo verde.
  # -- C5 -- docs(#219): traceability y reporte. specs/mobile-weekly-average-format/traceability.md con los hashes (un hash por R, de su test y de su feat) y progress/impl_mobile-weekly-average-format.md. Un solo commit.
Antes del `feat` de C4, y de nuevo tras él, el jest de `screens/home/` entero: `bunx jest --runTestsByPath screens/home/format.test.ts screens/home/weekly-activity-chart.test.tsx screens/home/index.test.tsx screens/home/pingo-phrase.test.ts --testTimeout=30000`.

Guardas que R1 a R9 cruzan:
  - `package.json`, `bun.lock` y theme/global.css sin cambios desde H0.
  - `screens/home/index.test.tsx`, `pingo-phrase.test.ts`, `index.tsx` y `pingo-phrase.ts` sin una sola línea editada (R8). Sus `it` con enteros (`1h 35m`, `2.4 km`, `Media 20m`, `12h 0m`) siguen verdes.
  - `fmtKm` sin cambio (R3): `git diff fb6b9ad2 -- mobile-pet-tracker/src/screens/home/format.ts` no toca esa función.
  - `average` no se redondea en el componente (R5).

Cierre (tasks.md; lo que el reporte debe traer):
  - `bun run test` completo en verde, guardado en `progress/final-test-219.log`, sin pipe (`bun run test > ../progress/final-test-219.log 2>&1; echo exit=$?`).
  - Guardas en verde: design-drift, consistency-classnames, ui-language, language-provider, home-canvas-fidelity y los tests de `screens/home/`.
  - Typecheck: `test ! -e .expo/types/router.d.ts` y luego `bun run typecheck`.
  - Lint, como arriba.
  - `git diff fb6b9ad2 -- mobile-pet-tracker/package.json mobile-pet-tracker/bun.lock mobile-pet-tracker/src/theme/global.css mobile-pet-tracker/src/i18n mobile-pet-tracker/src/screens/map mobile-pet-tracker/src/screens/home/index.tsx mobile-pet-tracker/src/screens/home/index.test.tsx mobile-pet-tracker/src/screens/home/pingo-phrase.ts mobile-pet-tracker/src/screens/home/pingo-phrase.test.ts` vacío.
  - `graphify update .` en el worktree (AST, sin coste).
  - Lista de ficheros tocados desde H0, desde la raíz del worktree: `git diff --name-only fb6b9ad2..HEAD -- mobile-pet-tracker/`. Debe ser exactamente los cuatro de `screens/home/` de la lista cerrada.
  - Reporte en progress/impl_mobile-weekly-average-format.md: comprobación del primer comando, salida de las anclas T0 y la base de tests, commits (hash y mensaje), línea `Tests:` tras cada commit, resultado de las sondas (a)-(e) con el rojo concreto de cada una, `it` que nacieron verdes (y su mutación), skills cargadas y no encontradas, lint y typecheck, desviaciones, tabla R1-R9 a test a commit, y los casos de smoke del humano (requirements.md §Aprobación: la etiqueta «Media …» de las tres métricas cabe en la card junto al título; la tendencia muestra punto decimal).
  - Última acción: crear progress/impl_mobile-weekly-average-format.done con una sola línea, la ruta de progress/impl_mobile-weekly-average-format.md. Está en .gitignore; no lo commitees (lo vigila scripts/harness/watch-impl.sh).

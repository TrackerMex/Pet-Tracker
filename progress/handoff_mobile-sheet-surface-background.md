Worktree: /home/claude/sites/Pet-Tracker-wt-218
NO lances ./init.sh aunque AGENTS.md lo pida: lo corre el leader (comparte LocalStack y Postgres con otros worktrees).
Primer comando, antes de nada: `cd /home/claude/sites/Pet-Tracker-wt-218 && pwd && git branch --show-current`. Confirma en el reporte que la salida es esa ruta y la branch `feature/218-mobile-sheet-surface-background`.

Feature: mobile-sheet-surface-background (#218). Branch: feature/218-mobile-sheet-surface-background. Integra en `dev`, no en `main`.
H0 (base de la implementación y del diff final): 68a1f217, firma delegada de la spec (2026-10-26, mandato del humano ampliado). El código de la app en H0 es el de `origin/dev` 81ca7529. NO hagas `git merge` ni `git rebase` de nada.
Spec aprobada: specs/mobile-sheet-surface-background/requirements.md (status: approved). Lee también design.md (§Candados: inventario cerrado y §Anclas de medición) y tasks.md (la cadena C1 a C6). No hay decisiones abiertas: no hay nada que preguntar. No hay artboard para #218.
Orden: tasks.md manda, cadena C1 a C6 abajo. Criterios de aceptación: R1 a R6 de requirements.md. La casilla de smoke en dispositivo es del humano; tú no la tocas.
Entorno: el worktree ya tiene `.env` y `mobile-pet-tracker/node_modules` (`bun install --frozen-lockfile` ya corrido). No los regeneres. Usa `bun`/`bunx` para todo en mobile-pet-tracker; nunca npm ni npx. No añadas dependencias (`package.json` y `bun.lock` no cambian).
Árbol: `progress/*.log` los ignora git. El chequeo de árbol limpio se acota: `cd /home/claude/sites/Pet-Tracker-wt-218/mobile-pet-tracker && git diff --quiet -- . ../docs ../specs && test -z "$(git ls-files --others --exclude-standard -- . ../docs ../specs)"`. Nunca `test -z "$(git status --short)"` tras `git add`.

Archivos (lista cerrada; si necesitas otro, PARA y pregunta al leader). Todos bajo mobile-pet-tracker/src/ salvo indicación:
  - screens/reminders/index.tsx (R1, R5, R6: +2 líneas, 0 borradas)
  - screens/pairing/index.tsx (R2, R5, R6: +2 líneas, 0 borradas)
  - screens/reminders/index.test.tsx (R1: solo adiciones, un `describe` nuevo)
  - screens/pairing/index.test.tsx (R2: solo adiciones, un `it` nuevo)
  - __tests__/sheet-surface-background.test.ts (nuevo, R3)
  - ../../specs/mobile-sheet-surface-background/traceability.md (solo en el commit final)
  - ../../progress/impl_mobile-sheet-surface-background.md (tu reporte)
No tocar: __tests__/design-drift.test.ts, __tests__/consistency-classnames.test.ts, __tests__/legibility-classnames.test.ts, __tests__/ui-copy-table.ts, __tests__/ui-language.test.ts, i18n/catalog.ts, providers/, theme/global.css, el resto de screens/, feature_list.json, STATUS.md, progress/history.md, progress/current.md, progress/handoff_*.md, docs/ ni backend-pet-tracker/.

Reglas críticas:
  - Seguir docs/architecture.md, docs/conventions.md y docs/ui-guidelines.md. La carta gana sobre cualquier skill (regla 9: color imperativo vía `useThemeColors`; regla 1: sin hex).
  - Skills, con los nombres del catálogo de Codex (plugin expo 1.0.2, 13 skills; no los nuestros). La spec puede nombrar `expo:expo-overview`: NO existe en Codex, no la busques.
    - `building-native-ui`: UI nativa y hojas inferiores.
    - `expo-tailwind-setup`: uniwind y clases Tailwind v4 (no cambias clases).
    - `appllama-app-design-skill` (en `.agents/skills/`): obligatoria según la carta §Skills; aquí no hay diseño nuevo, cárgala y dilo. Codex no tiene el MCP de appllama: si la skill pide sus herramientas, sáltalas.
    - `expo-overview`, `expo-animation`, `expo-router` y `expo-design-system` no existen en Codex.
    - En el reporte, lista qué skills cargaste y cuáles no encontraste.
  - Esperas: docs/conventions.md §Esperas sobre el árbol renderizado. Espera al mismo nodo que aserta el test (`findByTestId`), nunca a un contador de mock.
  - RNTL 14: `await fireEvent`, `await render`, `await renderRouter` y `await act`. Sin await, un it contamina al siguiente.
  - La palabra `StyleSheet` (en cualquier capitalización) está vetada por design-drift `#68 R18` también en `screens/pairing/index.test.tsx`: el `it` de R2 aplana con `Object.assign({}, ...[x].flat(Infinity).filter(Boolean))`; el de R1 reutiliza el helper `flat` que ya existe en reminders/index.test.tsx.
  - Valores de la spec (`'color:surface'`, la línea literal del `backgroundStyle`) son literales del test, nunca importados de producción (candado tautológico).
  - Comentarios de código y títulos de `describe`/`it`: la referencia a la feature va solo como `#218 R<n>`, nunca `#218` desnudo (el exento de `HEX_LITERAL` de design-drift es solo `#NNN R<n>`).
  - Cero `StyleSheet.create`, hex fuera de `src/theme/`, clases `[...]`, emoji o dependencias nuevas. No tocas `className`, `snapPoints`, `index`, `onClose` ni los hijos de los dos `BottomSheet` (R4).
  - Producción, forma exacta (R6): en cada fichero, `const [surface] = useThemeColors(['surface']);` (llamada aparte; NO amplíes el array existente) y `backgroundStyle={{ backgroundColor: surface }}` como última prop del `<BottomSheet`, justo después de la línea `snapPoints={['50%', '100%']}`. En reminders la declaración va justo antes de `const categoryInk = {`; en pairing, justo después de `const [muted, danger] = useThemeColors(['muted', 'danger']);`. `git diff --numstat 68a1f217 -- <fichero>` debe dar `2	0` en cada uno.
  - Candados agregados: design.md §Candados es el inventario cerrado y dice que ninguno necesita enmienda. Si al correr la suite aparece en rojo un `it` que no está allí, PARA y anótalo con el diff medido; no lo enmiendes por tu cuenta.
  - Sondas de mutación: (1) en cada fichero de producción, quitar la línea `backgroundStyle` (rojo el `it` de R1/R2 y la fila de R3); (2) cambiar `'surface'` por `'background'` en uno de los dos (rojo la fila de R3 y el `it` de R1/R2); (3) poner `backgroundStyle={{ backgroundColor: '#FFFFFF' }}` (rojos los `it` de R1/R2 y los cuatro `it` de design-drift de R5); (4) plantar un tercer importador de `@expo/ui/community/bottom-sheet` en un fichero temporal de `src/` (rojo el inventario de R3). Cada una se planta, se ve el rojo concreto y se revierte (no se commitea). Sin la sonda el candado no está probado: anótalo. El `it` de inventario de R3 nace verde y se declara en el reporte; sus dos filas `it.each` nacen rojas.
  - TDD por requisito: test rojo que nombra el R-id, después verde. Antes de cada commit de test, comprueba que los `it` nuevos fallan por la aserción (`flat(undefined)` es `{}`), no por import roto ni excepción (excepción esperada: ninguna, el módulo del candado de R3 se lee con `fs`, no se importa).
  - UN COMMIT POR PASO como mínimo, test rojo antes que su implementación (C4 de CHECKPOINTS.md): `test(#218): …` y luego `feat(#218): …`, mensajes en inglés tras el prefijo. Nunca implementación y test en el mismo commit.
  - Commits: `git add` con rutas explícitas, solo los ficheros del paso. Nunca `git add -A` ni `commit -a`. El móvil no tiene prettier: no lo ejecutes.
  - Cada cadena termina en su línea `git commit -m`. Las cabeceras de sección van como comentario de shell (`# -- C1 --`).
  - Commit final: traceability.md con los hashes y tu reporte, en UN commit `docs(#218): …` tras el último verde. No rebasees tras rellenarlo.
  - Jest de un fichero: `cd /home/claude/sites/Pet-Tracker-wt-218/mobile-pet-tracker && bunx jest --runTestsByPath <ruta> --testTimeout=30000`, solo con `pgrep -f '[n]ode_modules/(.bin/jest|jest-worker)'` y `pgrep -f '[i]nit.sh'` vacíos (otros worktrees corren jest en esta máquina: si no están vacíos, espera y vuelve a mirar; nunca esperes e `init.sh` en el mismo comando). Un timeout aislado se mide sin flag antes de tocar nada.
  - Tipos: antes de cada `bun run typecheck` o `bunx tsc --noEmit`, ejecuta `test ! -e .expo/types/router.d.ts`. Si existe, PARA. Nunca `rm -f`.
  - Lint, siempre con `--no-cache` y redirect al log, sin pipe: `cd /home/claude/sites/Pet-Tracker-wt-218/mobile-pet-tracker && bunx expo lint --no-cache > ../progress/lint-218.log 2>&1 && test ! -s ../progress/lint-218.log`. `expo lint` puede morir por memoria con exit 0: por eso `test ! -s`.
  - No crear recursos AWS reales ni correr cdk deploy.
  - NO son tuyos: progress/history.md, progress/current.md, STATUS.md y el campo `status` de feature_list.json. Tu sitio para contarlo todo es progress/impl_mobile-sheet-surface-background.md.
  - No abras la PR ni la edites. No hagas push.
  - Si el sandbox te deniega un comando, PARA y repórtalo. No lo sustituyas por otro que haga lo mismo.
  - Un error de invocación (ENOENT sobre una ruta, `command not found` antes de que arranque jest, tsc o eslint, sin ficheros tocados) se corrige y se anota en el reporte. Solo PARA si falla el código, una cifra de esta lista o una guarda.
  - Si una cifra o ancla no coincide, PARA y reporta. La spec se reescribe; el código no se adapta.

Anclas de la base (T0): corre cada una tal cual antes del primer test, desde /home/claude/sites/Pet-Tracker-wt-218/mobile-pet-tracker/src, y pega la salida en el reporte. Salidas esperadas medidas por el leader en H0; ante una diferencia, PARA:
  grep -cF "backgroundStyle" screens/reminders/index.tsx                          # 0
  grep -cF "backgroundStyle" screens/pairing/index.tsx                            # 0
  grep -cF "useThemeColors(" screens/reminders/index.tsx                          # 1
  grep -cF "useThemeColors(" screens/pairing/index.tsx                            # 1
  grep -cF "snapPoints={['50%', '100%']}" screens/reminders/index.tsx             # 1
  grep -cF "snapPoints={['50%', '100%']}" screens/pairing/index.tsx               # 1
  grep -cF "items-center gap-3 bg-surface px-5 pb-9 pt-3" screens/reminders/index.tsx   # 1
  grep -cF "items-center gap-3 bg-surface px-5 pb-9 pt-3" screens/pairing/index.tsx     # 1
  grep -cF "const categoryInk = {" screens/reminders/index.tsx                    # 1
  grep -cF "const [muted, danger] = useThemeColors(['muted', 'danger']);" screens/pairing/index.tsx   # 1
  grep -cF "#218" screens/reminders/index.test.tsx                                # 0
  grep -cF "#218" screens/pairing/index.test.tsx                                  # 0
  grep -cF "community-bottom-sheet" screens/reminders/index.test.tsx              # 6
  grep -cF "community-bottom-sheet" screens/pairing/index.test.tsx                # 4
  grep -cF "describe('#178 R9: el vacío ofrece crear'" screens/reminders/index.test.tsx   # 1
  grep -cF "describe('#204 R9: Eliminar de la hoja'" screens/reminders/index.test.tsx     # 1
  grep -cF "describe('#203 R7: hoja de desvincular'" screens/pairing/index.test.tsx       # 1
  grep -cF "it('#203 R7.3: Cancelar cierra sin liberar'" screens/pairing/index.test.tsx   # 1
  ls __tests__/sheet-surface-background.test.ts 2>&1 | grep -c 'No such file'     # 1
  (desde mobile-pet-tracker/) test ! -e .expo/types/router.d.ts && echo sin-router-d-ts   # sin-router-d-ts
Un `grep -c` cuenta líneas, no apariciones.

Base de tests (T0): mídela tú antes del primer commit, con `pgrep` vacíos: `cd /home/claude/sites/Pet-Tracker-wt-218/mobile-pet-tracker && bun run test > ../progress/t0-218.log 2>&1; echo exit=$?` y pega las líneas `Test Suites:` y `Tests:` en el reporte. Debe ser exit 0 y cero `FAIL`. El aviso final de worker force-exit es preexistente. Regla de carga: si un rojo de la suite completa es una suite que no tocaste y pasa sola (Mapa #72 R2, Salud #168 R2, Nutrición #200, Inicio #152 R8 son flakes conocidos bajo carga), córrela aislada, anota el rojo y el verde aislado en el reporte y sigue. Si el rojo persiste aislado, o es un `it` de tu alcance o de un candado del inventario, PARA. La cifra de tests de cada commit = anterior + sus `it` añadidos (anótalo; no heredes la cifra 37 suites / 1138 tests de design.md, caduca).

Cadena (tasks.md manda; pega la línea `Tests:` del fichero de tests tras cada commit):
  # -- C1 -- test(#218): R1 lock the reminders delete sheet container to the surface token. screens/reminders/index.test.tsx: `describe('#218 R1: el cajón de borrar pinta su contenedor con el token surface')` justo antes de `describe('#178 R9: el vacío ofrece crear'`, con `it('#218 R1: backgroundStyle del BottomSheet de borrar es exactamente el token surface')`; su `beforeEach` se copia del de `describe('#204 R9: Eliminar de la hoja'`. Rojo por la aserción. Solo adiciones (0 líneas borradas).
  # -- C2 -- test(#218): R2 lock the pairing unpair sheet container to the surface token. screens/pairing/index.test.tsx: `it('#218 R2: backgroundStyle del BottomSheet de desvincular es exactamente el token surface')` dentro de `describe('#203 R7: hoja de desvincular')`, justo antes de `it('#203 R7.3: Cancelar cierra sin liberar'`. Rojo por la aserción. Solo adiciones.
  # -- C3 -- test(#218): R3 lock every BottomSheet to the surface background. __tests__/sheet-surface-background.test.ts nuevo (cabecera copiada de `__tests__/consistency-classnames.test.ts`, `declare function require` para `fs` y `path`; su propio `sourceFiles()` salta `__tests__/` y `*.test.ts(x)`): inventario de importadores (nace verde) y `it.each` por fichero (nacen rojas).
  # -- C4 -- feat(#218): R1, R5, R6 paint the reminders delete sheet with the surface token. screens/reminders/index.tsx, +2/-0. Verde C1 y la fila de reminders de C3.
  # -- C5 -- feat(#218): R2, R5, R6 paint the pairing unpair sheet with the surface token. screens/pairing/index.tsx, +2/-0. Verde C2 y todo C3.
  # -- C6 -- docs(#218): traceability y reporte. specs/mobile-sheet-surface-background/traceability.md con los hashes (un hash por R, de su test y de su feat; R4, R5 y R6 sin test propio: dilo con los `it` existentes que los cierran) y progress/impl_mobile-sheet-surface-background.md. Un solo commit.
Antes del `feat` de C4 y tras C5, el jest completo sin pipe (`bun run test > ../progress/full-218-cNN.log 2>&1; echo exit=$?`).

Guardas que R1 a R6 cruzan:
  - `package.json`, `bun.lock` y theme/global.css sin cambios desde H0.
  - Los dos ficheros de test existentes: `git diff --numstat 68a1f217 -- mobile-pet-tracker/src/screens/reminders/index.test.tsx mobile-pet-tracker/src/screens/pairing/index.test.tsx` muestra 0 líneas borradas en las dos filas.
  - Los `it` de contrato existentes siguen verdes sin editarse: `confirmDelete()` y «centra los cinco hijos del sheet con el marco del canvas» (reminders), `#203 R7.2` (pairing) y los cuatro `it` de design-drift de R5.
  - #213 (Backend, en curso) también edita `screens/reminders/index.tsx`: no hagas merge ni rebase; si ves cambios ajenos en ese fichero, PARA y avisa.

Cierre (tasks.md; lo que el reporte debe traer):
  - `bun run test` completo en verde, guardado en `progress/final-test-218.log`, sin pipe.
  - Typecheck: `test ! -e .expo/types/router.d.ts` y luego `bun run typecheck`.
  - Lint, como arriba.
  - `git diff --numstat 68a1f217 -- mobile-pet-tracker/src/screens/reminders/index.tsx mobile-pet-tracker/src/screens/pairing/index.tsx` da `2	0` en cada fila.
  - `git diff 68a1f217 -- mobile-pet-tracker/package.json mobile-pet-tracker/bun.lock mobile-pet-tracker/src/theme/global.css mobile-pet-tracker/src/i18n` vacío.
  - `graphify update .` en el worktree (AST, sin coste).
  - Lista de ficheros tocados desde H0, desde la raíz del worktree: `git diff --name-only 68a1f217..HEAD -- mobile-pet-tracker/`. Debe coincidir con la lista cerrada de arriba (cinco ficheros).
  - Reporte en progress/impl_mobile-sheet-surface-background.md: comprobación del primer comando, salida de las anclas T0 y la base de tests, commits (hash y mensaje), línea `Tests:` tras cada commit, resultado de las sondas (1)-(4) con el rojo concreto de cada una, `it` que nacieron verdes (y su mutación), skills cargadas y no encontradas, lint y typecheck, desviaciones, tabla R1-R6 a test a commit, y el caso de smoke del humano (requirements.md §Aprobación: sin franja rosa en los dos cajones, claro y oscuro, con Material You).
  - Última acción: crear progress/impl_mobile-sheet-surface-background.done con una sola línea, la ruta de progress/impl_mobile-sheet-surface-background.md. Está en .gitignore; no lo commitees (lo vigila scripts/harness/watch-impl.sh).

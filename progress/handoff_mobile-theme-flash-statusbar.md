Worktree: /home/claude/sites/Pet-Tracker-wt-217
NO lances ./init.sh aunque AGENTS.md lo pida: lo corre el leader (comparte LocalStack y Postgres con otros worktrees).
Primer comando, antes de nada: `cd /home/claude/sites/Pet-Tracker-wt-217 && pwd && git branch --show-current`. Confirma en el reporte que la salida es esa ruta y la branch `feature/217-mobile-theme-flash-statusbar`.

Feature: mobile-theme-flash-statusbar (#217). Branch: feature/217-mobile-theme-flash-statusbar. Integra en `dev`, no en `main`.
H0 (base de la implementación y del diff final): 92ef1c62, firma delegada de la spec (2026-10-26, mandato del humano ampliado). El código de la app en H0 es el de `origin/dev` 81ca7529. NO hagas `git merge` ni `git rebase` de nada.
Spec aprobada: specs/mobile-theme-flash-statusbar/requirements.md (status: approved). Lee también design.md (§Inventario cerrado de candados) y tasks.md (la cadena C1 a C12). No hay decisiones abiertas: no hay nada que preguntar. La «Desviación consciente del plan» de requirements.md (`HeroStatusBar` con puerta de foco dentro de Inicio y Perfil, no por ruta en `(tabs)/_layout.tsx`) está decidida: impleméntala tal cual. No hay artboard para #217.
Orden: tasks.md manda, cadena C1 a C12 abajo. Criterios de aceptación: R1 a R12 de requirements.md. Las casillas de smoke G2 y de dev build G3 son del humano; tú no las tocas. NO lances `eas build` ni reconstruyas el dev build.
Entorno: el worktree ya tiene `.env` y `mobile-pet-tracker/node_modules` (`bun install --frozen-lockfile` ya corrido). No los regeneres. Usa `bun`/`bunx` para todo en mobile-pet-tracker; nunca npm ni npx. La ÚNICA edición de dependencias permitida es la retirada de C11 (R8).
Árbol: `progress/*.log` los ignora git. El chequeo de árbol limpio se acota: `cd /home/claude/sites/Pet-Tracker-wt-217/mobile-pet-tracker && git diff --quiet -- . ../docs ../specs && test -z "$(git ls-files --others --exclude-standard -- . ../docs ../specs)"`. Nunca `test -z "$(git status --short)"` tras `git add`.

Archivos (lista cerrada; si necesitas otro, PARA y pregunta al leader). Todos bajo mobile-pet-tracker/src/ salvo indicación:
  - ../test/jest-setup.js (solo C6b: doble global de `expo-status-bar`, enmienda del 2026-10-27)
  - theme/navigation-theme.ts (nuevo, R1)
  - theme/__tests__/navigation-theme.test.tsx (nuevo, R1)
  - components/hero-status-bar.tsx (nuevo, R5)
  - components/__tests__/hero-status-bar.test.tsx (nuevo, R5)
  - app/_layout.tsx (R2, R4)
  - app/__tests__/layout.test.tsx (R2, R4: dobles nuevos y `it` nuevos)
  - app/__tests__/theme-scene.test.tsx (nuevo, R3)
  - screens/home/index.tsx y screens/home/index.test.tsx (R6)
  - screens/profile/index.tsx y screens/profile/index.test.tsx (R6, R10, R11)
  - app/(tabs)/__tests__/screens.test.tsx (R11: solo se quita el `jest.mock` nitro)
  - __tests__/design-drift.test.ts (R8, R9, R11, R12: solo `describe` nuevos)
  - theme/theme-transition.ts, theme/nitro-availability.ts, theme/__tests__/theme-transition.test.tsx, theme/__tests__/theme-transition.degraded.test.tsx (BORRAR, R9)
  - ../package.json y ../bun.lock (R8, solo vía `bun remove` y la edición manual de `transformIgnorePatterns`)
  - ../../specs/mobile-theme-flash-statusbar/traceability.md (solo en el commit final)
  - ../../progress/impl_mobile-theme-flash-statusbar.md (tu reporte)
No tocar: app/(tabs)/_layout.tsx (R7), app.json, eas.json, theme/global.css, i18n/catalog.ts, __tests__/ui-copy-table.ts, __tests__/ui-language.test.ts, __tests__/consistency-classnames.test.ts, __tests__/legibility-classnames.test.ts, providers/, el resto de screens/, feature_list.json, STATUS.md, progress/history.md, progress/current.md, progress/handoff_*.md, docs/ ni backend-pet-tracker/. Los seis tests con `renderRouter` y `RootLayout` real (`detail-stack.*`, `alert-detail.*`, `reminders-alerts-stack.*` en app/__tests__/) NO se editan: se miden tras C6 (design.md); si alguno cae, PARA con el diff medido.

Reglas críticas:
  - Seguir docs/architecture.md, docs/conventions.md y docs/ui-guidelines.md. La carta gana sobre cualquier skill (regla 9: color imperativo vía `useThemeColors`; regla 1: sin hex).
  - Skills, con los nombres del catálogo de Codex (plugin expo 1.0.2, 13 skills; no los nuestros). La spec puede nombrar `expo:expo-overview`: NO existe en Codex, no la busques.
    - `building-native-ui`: UI nativa, barra de estado y navegación.
    - `expo-tailwind-setup`: uniwind y tokens de tema.
    - `appllama-app-design-skill` (en `.agents/skills/`): obligatoria según la carta §Skills; aquí no hay diseño nuevo, cárgala y dilo. Codex no tiene el MCP de appllama: si la skill pide sus herramientas, sáltalas.
    - `expo-overview`, `expo-animation`, `expo-router` y `expo-design-system` no existen en Codex.
    - En el reporte, lista qué skills cargaste y cuáles no encontraste.
  - Esperas: docs/conventions.md §Esperas sobre el árbol renderizado. Espera al mismo nodo que aserta el test, nunca a un contador de mock.
  - RNTL 14: `await fireEvent`, `await render`, `await renderRouter` y `await act`. Sin await, un it contamina al siguiente. Un `renderRouter` sin `await app;` contamina los `it` siguientes.
  - Valores de la spec (tokens `token:<nombre>`, orden de proveedores, literales) son literales del test, nunca importados de producción (candado tautológico).
  - Comentarios de código y títulos de `describe`/`it`: la referencia a la feature va solo como `#217 R<n>`, nunca `#217` desnudo (el exento de `HEX_LITERAL` de design-drift es solo `#NNN R<n>`). Todo `describe`/`it` nuevo se titula `#217 R<n>: …`.
  - Cero `StyleSheet.create`, hex fuera de `src/theme/`, clases `[...]`, emoji o dependencias nuevas. `theme/navigation-theme.ts` y `components/hero-status-bar.tsx` sin literales de color (R12).
  - `app/_layout.tsx`: el candado de `font-registration.test.ts` prohíbe el literal `return null` en ese fichero; mientras `themeReady` es falso sigue devolviendo `<></>`. `useNavigationTheme()` se llama ANTES del `if (!themeReady)`. Orden en el árbol: `ThemeProvider` por fuera, luego `StatusBar style="auto"`, luego `HeroUINativeProvider` (R2, R4); `AuthProvider` < `QueryProvider` < `Stack` no se mueven.
  - `HeroStatusBar` es hermano condicional ANTES del hero (R6): `{hasPets ? <HeroStatusBar /> : null}` en Inicio y `{showHero ? <HeroStatusBar /> : null}` en Perfil. No lo metas en `PetHeroHeader` (`useIsFocused` lanza sin navegador).
  - Perfil (R10): `import { Uniwind, useUniwind } from 'uniwind'` y `import { setStoredTheme } from '../../utils/theme-preference'`; el interruptor llama `Uniwind.setTheme(next)` y después `void setStoredTheme(next)`; quita `useThemeTransition` y su import.
  - Candados agregados: design.md §Inventario es cerrado. Si al correr la suite aparece en rojo un `it` que no está allí, PARA y anótalo con el diff medido; no lo enmiendes por tu cuenta.
  - Anclas negativas (R8, R9, R11, R12): cada patrón se prueba contra una cadena plantada ANTES de aplicarlo a los ficheros reales (el nombre del paquete se arma con `['react-native', 'nitro'].join('-')` para que el propio test no contenga el literal). El reporte cita la mutación plantada y el rojo obtenido.
  - Sondas de mutación (se planta, se ve el rojo concreto, se revierte, no se commitea): (1) quitar el `ThemeProvider` de `RootLayout` (rojo R3: la sonda lee `rgb(242, 242, 242)`); (2) poner `HeroStatusBar` sin puerta de foco (rojo R5); (3) reintroducir `import { useThemeTransition } from '../../theme/theme-transition'` en `screens/profile/index.tsx` (rojo R9); (4) mover `<StatusBar style="auto" />` después de `<HeroUINativeProvider>` (rojo R4); (5) mapeo cruzado en `useNavigationTheme` (`background` ← `surface`) (rojo R1). Sin la sonda el candado no está probado: anótalo. Los `it` que nacen verdes (R12) se declaran en el reporte y se demuestran con una mutación.
  - TDD por requisito: test rojo que nombra el R-id, después verde. Antes de cada commit de test, comprueba que los `it` nuevos fallan por la aserción, no por import roto ni excepción (excepción esperada: C1 y C3, donde el módulo no existe; ahí el rojo es por import y lo dices).
  - UN COMMIT POR PASO como mínimo, test rojo antes que su implementación (C4 de CHECKPOINTS.md): `test(#217): …` y luego `feat(#217): …`, mensajes en inglés tras el prefijo. Nunca implementación y test en el mismo commit.
  - Commits: `git add` con rutas explícitas, solo los ficheros del paso (los borrados con `git rm`). Nunca `git add -A` ni `commit -a`. El móvil no tiene prettier: no lo ejecutes.
  - Cada cadena termina en su línea `git commit -m`. Las cabeceras de sección van como comentario de shell (`# -- C1 --`).
  - Commit final: traceability.md con los hashes y tu reporte, en UN commit `docs(#217): …` tras el último verde. No rebasees tras rellenarlo.
  - Jest de un fichero: `cd /home/claude/sites/Pet-Tracker-wt-217/mobile-pet-tracker && bunx jest --runTestsByPath <ruta> --testTimeout=30000`, solo con `pgrep -f '[n]ode_modules/(.bin/jest|jest-worker)'` y `pgrep -f '[i]nit.sh'` vacíos (otros worktrees corren jest en esta máquina: si no están vacíos, espera y vuelve a mirar; nunca esperes e `init.sh` en el mismo comando). Con `--runTestsByPath` las rutas con `(tabs)` no son regex. Un timeout aislado se mide sin flag antes de tocar nada.
  - Tipos: antes de cada `bun run typecheck` o `bunx tsc --noEmit`, ejecuta `test ! -e .expo/types/router.d.ts`. Si existe, PARA. Nunca `rm -f`.
  - Lint, siempre con `--no-cache` y redirect al log, sin pipe: `cd /home/claude/sites/Pet-Tracker-wt-217/mobile-pet-tracker && bunx expo lint --no-cache > ../progress/lint-217.log 2>&1 && test ! -s ../progress/lint-217.log`. `expo lint` puede morir por memoria con exit 0: por eso `test ! -s`.
  - `react-hooks/purity` veta `Date.now()` en render (no aplica aquí, pero no lo introduzcas).
  - No crear recursos AWS reales ni correr cdk deploy.
  - NO son tuyos: progress/history.md, progress/current.md, STATUS.md y el campo `status` de feature_list.json. Tu sitio para contarlo todo es progress/impl_mobile-theme-flash-statusbar.md.
  - No abras la PR ni la edites. No hagas push.
  - Si el sandbox te deniega un comando, PARA y repórtalo. No lo sustituyas por otro que haga lo mismo.
  - Un error de invocación (ENOENT sobre una ruta, `command not found` antes de que arranque jest, tsc o eslint, sin ficheros tocados) se corrige y se anota en el reporte. Solo PARA si falla el código, una cifra de esta lista o una guarda.
  - Si una cifra o ancla no coincide, PARA y reporta. La spec se reescribe; el código no se adapta.

Anclas de la base (T0): corre cada una tal cual antes del primer test, desde /home/claude/sites/Pet-Tracker-wt-217/mobile-pet-tracker/src, y pega la salida en el reporte. Salidas esperadas medidas por el leader en H0; ante una diferencia, PARA:
  grep -cF "react-native-nitro" ../package.json                                   # 3
  grep -cF "nitro" ../bun.lock                                                    # 4
  grep -cF "useThemeTransition" screens/profile/index.tsx                         # 2
  grep -cF "theme-transition" screens/profile/index.tsx                           # 1
  grep -cF "withThemeTransition" screens/profile/index.test.tsx                   # 4
  grep -cF "react-native-nitro-theme-transition" screens/profile/index.test.tsx   # 2
  grep -cF "nitro-availability" screens/profile/index.test.tsx                    # 1
  grep -cF "react-native-nitro-theme-transition" "app/(tabs)/__tests__/screens.test.tsx"   # 1
  grep -cF "R2: el toggle dispara el fade" screens/profile/index.test.tsx         # 1
  grep -cF "useIsFocused: jest.fn(() => true)" screens/home/index.test.tsx       # 1
  grep -cF "useIsFocused: jest.fn(() => true)" screens/profile/index.test.tsx    # 1
  grep -cF "if (!themeReady)" app/_layout.tsx                                     # 1
  grep -cF "<HeroUINativeProvider>" app/_layout.tsx                               # 1
  grep -cF "ThemeProvider" app/_layout.tsx                                        # 0
  grep -cF "StatusBar" app/_layout.tsx                                            # 0
  grep -cF "{showHero ? (" screens/profile/index.tsx                              # 1
  grep -cF "{hasPets ? (" screens/home/index.tsx                                  # 1
  grep -cF "ThemeProvider" app/__tests__/layout.test.tsx                          # 0
  grep -cF "setStoredTheme" screens/profile/index.tsx                             # 0
  grep -c "^\s*it(" theme/__tests__/theme-transition.test.tsx                     # 6
  grep -c "^\s*it(" theme/__tests__/theme-transition.degraded.test.tsx            # 1
  ls theme/navigation-theme.ts components/hero-status-bar.tsx app/__tests__/theme-scene.test.tsx 2>&1 | grep -c 'No such file'   # 3
  (desde mobile-pet-tracker/) test ! -e .expo/types/router.d.ts && echo sin-router-d-ts   # sin-router-d-ts
Un `grep -c` cuenta líneas, no apariciones.

Base de tests (T0): mídela tú antes del primer commit, con `pgrep` vacíos: `cd /home/claude/sites/Pet-Tracker-wt-217/mobile-pet-tracker && bun run test > ../progress/t0-217.log 2>&1; echo exit=$?` y pega las líneas `Test Suites:` y `Tests:` en el reporte. Debe ser exit 0 y cero `FAIL`. El aviso final de worker force-exit es preexistente. Regla de carga: si un rojo de la suite completa es una suite que no tocaste y pasa sola (Mapa #72 R2, Salud #168 R2, Nutrición #200, Inicio #152 R8 son flakes conocidos bajo carga; en esta máquina corren otros jest a la vez), córrela aislada, anota el rojo y el verde aislado en el reporte y sigue. Si el rojo persiste aislado, o es un `it` de tu alcance o de un candado del inventario, PARA. La cifra de tests de cada commit = anterior + sus `it` añadidos - los eliminados (anótalo, como `total anterior + añadidos - eliminados`).

Cadena (tasks.md manda; pega la línea `Tests:` tras cada commit):
  # -- C1 -- test(#217): R1 navigation theme from tokens. theme/__tests__/navigation-theme.test.tsx rojo por import (el módulo no existe). +2.
  # -- C2 -- feat(#217): R1 add useNavigationTheme. theme/navigation-theme.ts. +0.
  # -- C3 -- test(#217): R5 hero status bar focus gate. components/__tests__/hero-status-bar.test.tsx rojo por import. +2.
  # -- C4 -- feat(#217): R5 add HeroStatusBar. components/hero-status-bar.tsx. +0.
  # -- C5 -- test(#217): R2-R4 root theme provider and status bar. app/__tests__/layout.test.tsx (dobles nuevos de `ThemeProvider`, `../../theme/navigation-theme` y `expo-status-bar` en este commit, y los `it` R2 x2 y R4 x1) y app/__tests__/theme-scene.test.tsx nuevo (R3 x2). Todos rojos por la aserción. +5.
  # -- C6 -- feat(#217): R2-R4 wire ThemeProvider and StatusBar in RootLayout. app/_layout.tsx. +0. Tras él, mide los seis tests con `renderRouter` de app/__tests__/ (ver arriba).
  # -- C6b -- test(#217): global double for expo-status-bar. ENMIENDA DEL LEADER 2026-10-27: los 3 guards de navegación cayeron tras C6 porque el `<StatusBar>` real corrompe el contador de inmediatos de Node bajo `renderRouter` (ver specs/mobile-theme-flash-statusbar/design.md §Enmienda del 2026-10-27). Añade AL FINAL de mobile-pet-tracker/test/jest-setup.js, tal cual:
  #
  #   // The real <StatusBar> defers its native update with setImmediate; under
  #   // renderRouter's fake timers its unmount calls the real clearImmediate on a fake
  #   // id and corrupts Node's immediate counter (tests then time out).
  #   jest.mock('expo-status-bar', () => ({
  #     ...jest.requireActual('expo-status-bar'),
  #     StatusBar: () => null,
  #   }));
  #
  # Precede esas líneas con UNA línea en blanco. Solo ese fichero. Tras el commit, mide los seis tests con `renderRouter` (deben pasar sin editarlos) y los 4 ficheros de #217; guarda los logs. Total +0. Luego CONTINÚA con C7 (ya no hay bloqueo).
  # -- C7 -- test(#217): R6 hero status bar in home and profile. screens/home/index.test.tsx y screens/profile/index.test.tsx: doble de `expo-status-bar` y los `it` R6 (x4). Rojos. +4.
  # -- C8 -- feat(#217): R6 request the light status bar on hero screens. `<HeroStatusBar />` condicional en Inicio y Perfil. +0.
  # -- C9 -- test(#217): R8-R12 lock the removal of nitro. __tests__/design-drift.test.ts: `describe` de R8 (x2), R9 (x2), R11 (x1), R12 (x1); screens/profile/index.test.tsx: `it` R10 (x1). R8, R9, R11 y R10 rojos; R12 nace verde (los dos ficheros nuevos existen desde C2 y C4), dilo y demuéstralo con una mutación. +7.
  # -- C10 -- feat(#217): R9-R11 instant theme switch and drop the transition files. Perfil: interruptor `Uniwind.setTheme` + `setStoredTheme`; `git rm` de theme-transition.ts, nitro-availability.ts y sus dos tests; de profile/index.test.tsx quita el import `withThemeTransition`, los dos `jest.mock` nitro y el `it('R2: el toggle dispara el fade vía withThemeTransition')`; de screens.test.tsx quita el `jest.mock` nitro. -8 (6 + 1 + 1).
  # -- C11 -- feat(#217): R8 remove the nitro dependencies. Desde mobile-pet-tracker/: `bun remove react-native-nitro-theme-transition react-native-nitro-modules`; después edita a mano la expresión `jest.transformIgnorePatterns[0]` de package.json para quitar `|react-native-nitro-theme-transition|react-native-nitro-modules` (`bun remove` no toca `jest`). Verifica: `git diff 92ef1c62 -- mobile-pet-tracker/bun.lock | grep -E '^[-+][^-+]'` = exactamente 4 líneas eliminadas y 0 añadidas, todas con `nitro`; `git diff 92ef1c62 -- mobile-pet-tracker/package.json` = solo las dos líneas de `dependencies` y la cola de la expresión. Si el lock cambia algo más, PARA. +0.
  # -- C12 -- docs(#217): traceability y reporte. specs/mobile-theme-flash-statusbar/traceability.md con los hashes (un hash por R, de su test y de su feat) y progress/impl_mobile-theme-flash-statusbar.md (incluye el diff de `bun.lock` de R8 y el diff vacío de `(tabs)/_layout.tsx` de R7). Un solo commit.
Antes de C10, C11 y C12, el jest completo sin pipe (`bun run test > ../progress/full-217-cNN.log 2>&1; echo exit=$?`). Cada commit corre `bun run typecheck` (con el chequeo de router.d.ts) y el jest de su alcance.

Guardas que R1 a R12 cruzan:
  - `app/(tabs)/_layout.tsx` sin cambios (R7): `git diff 92ef1c62 -- 'mobile-pet-tracker/src/app/(tabs)/_layout.tsx'` vacío; los dos candados de `screenOptions` (`app/(tabs)/__tests__/layout.test.tsx`, `app/__tests__/tabs-layout.test.tsx`) verdes sin editarse.
  - `app.json`, `eas.json`, theme/global.css, i18n/, providers/ y los candados de copy y clases sin cambios.
  - `font-registration.test.ts` verde (sin `return null` en `_layout.tsx`).
  - Ningún fichero de producción de `src/` nombra `nitro`, `theme-transition`, `useThemeTransition`, `THEME_FADE` ni `isThemeTransitionAvailable` tras C10.

Cierre (tasks.md; lo que el reporte debe traer):
  - `bun run test` completo en verde, guardado en `progress/final-test-217.log`, sin pipe.
  - Guardas en verde: design-drift, consistency-classnames, legibility-classnames, ui-language, language-provider, font-registration, jest-virtual-mock-lock, los dos de `screenOptions`, los seis de `renderRouter` y los de Inicio y Perfil.
  - Typecheck: `test ! -e .expo/types/router.d.ts` y luego `bun run typecheck`.
  - Lint, como arriba.
  - `graphify update .` en el worktree (AST, sin coste).
  - Lista de ficheros tocados desde H0, desde la raíz del worktree: `git diff --name-only 92ef1c62..HEAD -- mobile-pet-tracker/`. Debe coincidir con la lista cerrada de arriba.
  - Reporte en progress/impl_mobile-theme-flash-statusbar.md: comprobación del primer comando, salida de las anclas T0 y la base de tests, commits (hash y mensaje), línea `Tests:` tras cada commit (`anterior + añadidos - eliminados`), resultado de las sondas (1)-(5) y de las anclas negativas plantadas, `it` que nacieron verdes (y su mutación), skills cargadas y no encontradas, lint y typecheck, desviaciones, tabla R1-R12 a test a commit, y los casos de smoke del humano (requirements.md §Aprobación: G2 a-d; G3 reconstruir el dev build sin nitro).
  - Última acción: crear progress/impl_mobile-theme-flash-statusbar.done con una sola línea, la ruta de progress/impl_mobile-theme-flash-statusbar.md. Está en .gitignore; no lo commitees (lo vigila scripts/harness/watch-impl.sh).

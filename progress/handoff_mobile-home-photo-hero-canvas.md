Worktree: /home/claude/sites/Pet-Tracker-wt-195
NO lances ./init.sh aunque AGENTS.md lo pida: lo corre el leader (comparte LocalStack y Postgres con otros worktrees).
Primer comando, antes de nada: `cd /home/claude/sites/Pet-Tracker-wt-195 && pwd && git branch --show-current`. Confirma en el reporte que la salida es esa ruta y la branch `feature/195-mobile-home-photo-hero-canvas`.

Feature: mobile-home-photo-hero-canvas (#195). Branch: feature/195-mobile-home-photo-hero-canvas.
H0 (base de la implementación y del diff final): ab33dfd1, firma humana de la spec (2026-10-21, desde Notion), con la casilla `Enmienda #195 aprobada por humano` marcada y D1 a D5 cerradas con su defecto. El commit de arranque del leader que cuelga de H0 solo toca `progress/` y `feature_list.json`, así que el diff acotado a `mobile-pet-tracker/ docs/` desde H0 es limpio. `origin/main` sigue en c0a35a68 (la base de la spec): NO hagas `git merge origin/main` ni `git rebase`.
Spec aprobada: specs/mobile-home-photo-hero-canvas/requirements.md (status: approved). Lee también design.md y tasks.md. La referencia visual congelada está en specs/mobile-home-photo-hero-canvas/canvas-ref/ (Inicio.dc.html, Perfil.dc.html, hero-sample.jpg): si discrepa con otra fuente, manda la copia congelada y avisas. D1 a D5 están cerradas con el defecto de requirements §Decisiones: no hay nada pendiente de preguntar. La casilla de la enmienda ya está firmada, así que la precondición de R20 está cumplida y puedes revertir cada candado de §Candados en el commit del R que lo invalida.
Orden: tasks.md manda. R13, R4, R1, R2, R3, R5, R7, R8, R6, R14, R9, R11 (solo `GlassCircle` y su test GC), R10, R11 (resto: botón «+» en Inicio), R12, R15, R16, R17, R18, R19, R20 y el Cierre. R21 es del humano; tú solo dejas su lista de comprobación en el reporte.
Criterios de aceptación: R1 a R20 de requirements.md (R21 no automatizado).
Entorno: el worktree ya tiene `.env` (copiado del árbol principal) y `mobile-pet-tracker/node_modules` (`bun install --frozen-lockfile` ya corrido). No los regeneres. Usa `bun`/`bunx` para todo en mobile-pet-tracker; nunca npm ni npx. No añadas dependencias (`package.json` y el lockfile no cambian).
Árbol: `progress/*.log` y `progress/*.exit` los dejó el leader (los logs están en .gitignore). No los toques. El chequeo de árbol limpio se acota a `git status --short -- mobile-pet-tracker/ specs/ docs/`.

Archivos (lista cerrada; si necesitas otro, PARA y pregunta al leader). Todos bajo mobile-pet-tracker/ salvo indicación:
  - src/components/pet-hero-header.tsx
  - src/components/pet-avatar.tsx (solo la prop `contentPosition`)
  - src/components/ping-ring.tsx (solo la prop `timing`)
  - src/components/glass-circle.tsx (nuevo)
  - src/components/pet-switcher.tsx
  - src/screens/home/index.tsx
  - src/screens/home/bubble-pop.tsx (nuevo)
  - src/theme/global.css
  - src/theme/motion.ts
  - src/components/__tests__/pet-hero-header.test.tsx
  - src/components/__tests__/pet-switcher.test.tsx
  - src/components/__tests__/pet-avatar.test.tsx (sin tocar su snapshot)
  - src/components/__tests__/ping-ring.test.tsx
  - src/components/__tests__/glass-circle.test.tsx (nuevo)
  - src/screens/home/index.test.tsx
  - src/screens/home/bubble-pop.test.tsx (nuevo)
  - src/theme/__tests__/motion.test.ts
  - src/theme/__tests__/global-css.test.ts
  - src/__tests__/alerts-canvas-fidelity.test.ts (solo la fila `tracking-title`: añade `'components/pet-hero-header.tsx'` justo después de `'components/empty-state.tsx'`)
  - src/__tests__/home-photo-hero-canvas.test.ts (nuevo; GUARD, R17 a R20)
  - docs/ui-guidelines.md (solo R20: la sección nueva al final y el párrafo de continuación de A8; no toques la casilla ni nada dentro de `Enmienda #190`, `#67` o `#167`)
  - specs/mobile-home-photo-hero-canvas/traceability.md (solo en el commit final)
  - progress/impl_mobile-home-photo-hero-canvas.md (tu reporte)
No tocar: el resto de docs/, feature_list.json, STATUS.md, progress/history.md, progress/current.md, progress/handoff_*.md, src/screens/map/, src/screens/profile/, `STATUS_TONE_CLASSES` y `PetHeroStatusTone` (los consume el mapa), src/__tests__/ui-copy-table.ts, el catálogo de copy, backend-pet-tracker/ ni otros ficheros de src/. Los candados que la spec dice «se conservan» (consistency-classnames, hero-header-amendments, tab-headers-canvas, legibility-classnames, design-drift, ui-language, home-pingo-phrase) no se editan: si uno se pone rojo es una regresión y se arregla el componente, nunca el `it`.

Reglas críticas:
  - Seguir docs/architecture.md, docs/conventions.md y docs/ui-guidelines.md. La carta gana sobre cualquier skill.
  - Skills, con los nombres del catálogo de Codex (plugin expo 1.0.2, 13 skills; no los nuestros). requirements, design y tasks nombran `expo:expo-overview`: NO existe en Codex, no la busques.
    - `building-native-ui`: UI nativa (equivale a nuestro `expo-native-ui`).
    - `expo-tailwind-setup`: uniwind y las clases de Tailwind v4.
    - Pantalla/cabecera: `appllama-app-design-skill` (en `.agents/skills/`), obligatoria según la carta §Skills. Solo toma el patrón; los valores los mandan la spec y la carta.
    - Movimiento (fundido, `rise`, `pop`, `ping`): `animate-expo` (en `.agents/skills/`). Las decisiones de movimiento ya están en la spec (R2, R8, R13, R14, R16: duraciones, curva, retrasos, reduce motion, ausencia de `entering`); si una skill sugiere otra cosa, mandan la spec y la carta.
    - `expo-overview`, `expo-animation`, `expo-router` y `expo-design-system` no existen en Codex. Los tokens ya están en `src/theme/global.css`.
    - Codex no tiene el MCP de appllama: si una skill pide sus herramientas, sáltalas.
    - En el reporte, lista qué skills cargaste y cuáles no encontraste.
  - Esperas: docs/conventions.md §Esperas sobre el árbol renderizado (tasks.md dice «leader.md §Esperas»: la sección vive en conventions.md). Espera al mismo nodo que aserta el test, nunca a un contador de mock. Los tests de movimiento usan Reanimated real con temporizadores falsos (BP, PR) o los mocks de `withTiming`/`withDelay` (HERO, HOME).
  - RNTL 14: `await fireEvent`, `await render` y `await act`. Sin await, un it contamina al siguiente. Si usas renderRouter, `await app;`.
  - RNTL oculta a accesibilidad los nodos decorativos: si un `getByTestId` no encuentra un nodo que existe, pasa `{ includeHiddenElements: true }` en esa consulta; no quites la accesibilidad del componente.
  - `toHaveAnimatedStyle`: pasa `shouldMatchAllProps: true` donde afirmes que no hay claves de más (opacidad colada).
  - Si necesitas un doble de react-native-reanimated, no sustituyas `default` por un spread de `requireActual`: pierde `__esModule`. HERO añade `withDelay: jest.fn((_ms, animation) => animation)` a su mock (R14); HOME ya lo tiene; el mock de `reicon-react-native` de HOME añade `Plus: mockIcon('icon-plus')` (R11). Las cuentas de llamadas a `withTiming` se miden después de `mockClear()` del montaje.
  - Si un `toBeVisible` falla porque la entrada arranca en opacidad 0, el arreglo es del componente (valor inicial decidido por `useReducedMotion`; precedente `PopIn`), nunca relajar el `it`.
  - Constantes del modelo de contraste (R17) y valores de movimiento (R13): literales del test, nunca importados de producción (candado tautológico).
  - Testids nuevos: `pet-hero-frame`, `pet-hero-photo`, `pet-hero-dim`, `pet-hero-scrim-top`, `pet-hero-status-ping`, `home-add-pet`, `pet-chip-online-<id>`. Retirado: `pet-hero-fade-top`. Antes de crearlos, busca selectores por regex que los absorberían: `grep -rnE "TestId\(/" mobile-pet-tracker/src`. Medido por el leader: `/^pet-chip-/` en pet-switcher.test.tsx:61, food.test.tsx:322 y health.test.tsx:289 absorbería `pet-chip-online-<id>`, pero esos tres montan la variante `default`, donde el punto no se pinta. Si alguno cambia de resultado, PARA y reporta.
  - Comentarios de código y títulos de `describe`/`it`: la referencia a la feature va solo como `#195 R<n>`, nunca `#195` desnudo (el exento de `HEX_LITERAL` de design-drift es solo `#NNN R<n>`). Todo `describe` nuevo se titula `#195 R<n>: …`. Los `it` viejos que enmiendas llevan el sufijo `(enmendado por #195 R<n>)`, en el commit del R que cambia el comportamiento (no antes, no en bloque al final).
  - Cero `StyleSheet.create`, hex, clases `[...]`, sombras legacy, emoji o `BlurView` en los ficheros de la lista; nunca la palabra `transparent` en el código del hero (los degradados escriben el color con alfa `00`). `design-drift` lee también index.test.tsx de algunas pantallas: no pongas `StyleSheet` en tests de pantalla.
  - Supuestos no verificados de design.md (1 a 5): confirma el 1 (visibilidad de hijos con entrada en opacidad 0) antes del primer test rojo que lo use. El 2 a 5 son de dispositivo y los cierra R21. Si el 1 cae, PARA y avisa.
  - Sondas de mutación: cada ancla y cada guarda lleva su mutación plantada, vista en rojo y revertida. Las de tasks.md (R1 a R3, R4, R6, R7, R8, R9, R10, R11, R12, R14, R16, R17, R19 a-f) son obligatorias. Sin la sonda el candado no está probado: anótalo en el reporte. R17 y R18 pueden nacer verdes: dilo en el reporte y demuéstralo con la mutación.
  - TDD por requisito: test rojo que nombra el R-id, después verde, después refactor, según tasks.md. Un bloque no empieza hasta que el anterior esté en verde.
  - UN COMMIT POR PASO como mínimo, con el test rojo antes que su implementación (C4 de CHECKPOINTS.md). Mensajes `test(mobile): <desc> (R<n>)` y `feat(mobile): <desc> (R<n>)`, en inglés. Nunca implementación y test en el mismo commit.
  - Commits: `git add` con rutas explícitas, solo los ficheros del paso. Nunca `git add -A` ni `commit -a`. El móvil no tiene prettier: no lo ejecutes.
  - Commit final: traceability.md con los hashes y tu reporte, en UN commit `docs(home): ...` tras el último verde. No mezcles ficheros de arnés en los commits TDD. No rebasees tras rellenarlo.
  - Jest de un fichero: `cd /home/claude/sites/Pet-Tracker-wt-195/mobile-pet-tracker && bunx jest <ruta> --testTimeout=30000`, solo con `pgrep -f '[n]ode_modules/(.bin/jest|jest-worker)'` y `pgrep -f '[i]nit.sh'` vacíos. El posicional es un regex: escapa los paréntesis de `(tabs)` o salta ficheros con exit 0. Un timeout aislado se mide sin flag antes de tocar nada.
  - Tipos: antes de cada `bun run typecheck` o `bunx tsc --noEmit`, ejecuta `test ! -e .expo/types/router.d.ts`. Si existe, PARA. Nunca `rm -f`.
  - Lint, siempre con `--no-cache` y redirect al log, sin pipe: `cd /home/claude/sites/Pet-Tracker-wt-195/mobile-pet-tracker && bunx expo lint --no-cache > ../progress/lint-195.log 2>&1 && test ! -s ../progress/lint-195.log`. El log queda en `progress/` sin commitear. `expo lint` puede morir por memoria con exit 0: por eso `test ! -s`.
  - No crear recursos AWS reales ni correr cdk deploy.
  - NO son tuyos: progress/history.md, progress/current.md, STATUS.md y el campo `status` de feature_list.json. Tu sitio para contarlo todo es progress/impl_mobile-home-photo-hero-canvas.md.
  - No abras la PR ni la edites.
  - Si el sandbox te deniega un comando, PARA y repórtalo. No lo sustituyas por otro que haga lo mismo.
  - Un error de invocación (ENOENT sobre una ruta, `command not found` antes de que arranque jest, tsc o eslint, sin ficheros tocados) se corrige y se anota en el reporte. Solo PARA si falla el código, una cifra de esta lista o una guarda.
  - Si una cifra o ancla no coincide, PARA y reporta. La spec se reescribe; el código no se adapta. Si un candado agregado que no figura en §Candados se pone rojo, PARA y reporta con el diff medido (no lo enmiendes por tu cuenta).

Anclas de la base (T0), medidas por el leader en ab33dfd1 sobre este árbol desde mobile-pet-tracker/. Solo estos comandos son anclas; ante una diferencia, manda el fichero de la spec:
  cd /home/claude/sites/Pet-Tracker-wt-195/mobile-pet-tracker
  grep -c 'style={CONTINUOUS_CORNER}' src/components/pet-hero-header.tsx   # 1
  grep -c 'style={CONTINUOUS_CORNER}' src/screens/home/index.tsx           # 1
  grep -c 'TABULAR_NUMS' src/components/pet-hero-header.tsx                # 2
  grep -c 'TABULAR_NUMS' src/screens/home/index.tsx                        # 9
  grep -c 'text-accent-strong' src/components/pet-hero-header.tsx          # 1
  grep -c 'text-accent-strong' src/screens/home/index.tsx                  # 2
  grep -c 'bg-accent-soft' src/screens/home/index.tsx                      # 3
  grep -c 'bg-accent-soft' src/components/pet-switcher.tsx                 # 1
  grep -cF "t('profile.addPet'" src/screens/home/index.tsx                 # 1
  grep -c 'shadow-' src/components/pet-switcher.tsx                        # 0
  grep -c 'MOTION_HERO_' src/theme/motion.ts                               # 0
  grep -cE -e '--(color-)?(scrim|photo-dim)' src/theme/global.css          # 0
  grep -c 'Enmienda #195' ../docs/ui-guidelines.md                         # 0
  test ! -e src/components/glass-circle.tsx && test ! -e src/screens/home/bubble-pop.tsx && test ! -e src/__tests__/home-photo-hero-canvas.test.ts && echo ausentes   # ausentes
  test ! -e .expo/types/router.d.ts && echo sin-router-d-ts                # sin-router-d-ts
Las cuentas de cierre son base + delta y están en tasks.md §Cuentas a re-medir (cada comando con su base y su esperado). Un `grep -c` cuenta líneas, no apariciones.

Base de tests (T0), del init.sh del leader en ab33dfd1 (exit 0, cero `FAIL`): móvil `bun run test` = Test Suites: 130 passed, 130 total; Tests: 4297 passed, 4297 total; Snapshots: 1 passed, 1 total. Backend unit 187/1474 y e2e 468 pasados (no son tuyos). La cifra de tests de cada commit se mide contra esta base: tras añadir `it` nuevos sube, nunca baja salvo que un `it` se reemplace en el mismo paso (anótalo).

Guardas que R1 a R20 cruzan:
  - `style={CONTINUOUS_CORNER}` 1 en el hero y 1 en Home; `TABULAR_NUMS` 2 y 9; `text-accent-strong` 1 y 2; `bg-accent-soft` 3 en Home y 1 en el selector; `t('profile.addPet'` una sola vez en `home/index.tsx`; cero `shadow-` en `pet-switcher.tsx`; `testID="home-alerts-bell"` una sola vez en `home/index.tsx`.
  - `<PetHeroHeader` aparece solo en `screens/home/index.tsx`; `variant="card"` conserva `rounded-card`; el skeleton del hero no lleva ninguna clase `rounded-` (`#120 R1`).
  - `STATUS_TONE_CLASSES` y `PetHeroStatusTone` se siguen exportando sin cambios; `STATUS_DOT_PULSE` deja de exportarse (R8).
  - `ui-copy-table.ts`, `R3_HOME` y `SCREEN_FILES` no se mueven: esta feature no añade ni cambia ninguna clave de copy.
  - Un candado agregado que se queda verde sin tocarlo cuando debía moverse es una alerta: PARA y reporta.

Cierre (tasks.md; lo que el reporte debe traer):
  - `bun run test` completo en verde (el aviso final de worker force-exit es preexistente; si reaparece el rojo `#190 R5` de home bajo carga, córrelo solo con `bunx jest src/screens/home/index.test.tsx --testTimeout=30000` y reporta ambas líneas `Tests:`).
  - Guardas en verde: design-drift, consistency-classnames, legibility-classnames, hero-header-amendments, tab-headers-canvas, alerts-canvas-fidelity, ui-language, home-photo-hero-canvas, y los tests de map.
  - Typecheck: `test ! -e .expo/types/router.d.ts` y luego `bun run typecheck`.
  - Lint, como arriba.
  - `graphify update .` en el worktree (AST, sin coste).
  - Re-medir la tabla de tasks.md §Cuentas a re-medir con los mismos comandos y registrar base + delta + resultado.
  - Lista de ficheros tocados desde H0, desde la raíz del worktree: `git diff --name-only ab33dfd1..HEAD -- mobile-pet-tracker/ docs/`. Debe coincidir con la lista cerrada de arriba. `specs/` y `progress/` no entran.
  - Lista de comprobación de R21 para el dev build Android (modo claro, oscuro y reduce motion; mascota con foto oscura, con foto clara y sin foto; nombre de 25 caracteres; los puntos de §Supuestos 2 a 5 de design.md). La ejecuta el humano; tú solo la dejas escrita.
  - Reporte en progress/impl_mobile-home-photo-hero-canvas.md: commits (hash y mensaje), línea `Tests:` tras cada commit, resultado de las sondas y mutaciones, skills cargadas y no encontradas, lint y typecheck, qué candados enmendaste (candado, antes/después, R), desviaciones, y tabla R1-R20 a test a commit.
  - Última acción: crear progress/impl_mobile-home-photo-hero-canvas.done con una sola línea, la ruta de progress/impl_mobile-home-photo-hero-canvas.md. Está en .gitignore; no lo commitees (lo vigila scripts/harness/watch-impl.sh).

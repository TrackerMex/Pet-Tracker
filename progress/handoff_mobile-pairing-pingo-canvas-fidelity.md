Worktree: /home/claude/sites/Pet-Tracker-wt-188
NO lances ./init.sh aunque AGENTS.md lo pida: lo corre el leader.
Primer comando, antes de nada: `cd /home/claude/sites/Pet-Tracker-wt-188 && pwd && git branch --show-current`. Confirma en el reporte que la salida es esa ruta y la branch `feature/188-mobile-pairing-pingo-canvas-fidelity`.

Feature: mobile-pairing-pingo-canvas-fidelity (#188). Branch: feature/188-mobile-pairing-pingo-canvas-fidelity.
H0 (base de la implementación): 6dc51ca1, firma humana de la enmienda de docs/ui-guidelines.md (casilla #188 marcada). La firma de la spec es 16d27c18. La firma de la enmienda E1 de R3 es 1cc2a08f (commit del leader; Notion «Estado del gate» = Aprobado, page_last_edited_at 2026-10-19T21:00:08.792Z). H0 no cambia.
Spec aprobada: specs/mobile-pairing-pingo-canvas-fidelity/requirements.md (status: approved). Lee también design.md y tasks.md. D1 a D7 están cerradas en requirements.md y son la única fuente de decisiones: no hay nada pendiente de preguntar.
Orden: tasks.md manda. R13 va primero, luego R1 a R14 y el Cierre.
Reanudación (2026-10-19, tras la parada de R7 en `3082ff68`): R13, R1, R2 (con excepción 3 en `53e9af61`), R3 (con E1), R4, R5, R6 y R7 funcional ya están en git. No los rehagas. Desde aquí: excepción 4 (abajo), luego R7 con design-drift y consistency-classnames en verde, después R8, R9, R10 (con excepciones 1 y 2), R11, R12 y R14, y el Cierre.
Criterios de aceptación: R1 a R14 de requirements.md. R9, R11 y R14 pueden nacer verdes.
Entorno: el worktree ya tiene `.env` en la raíz y `mobile-pet-tracker/node_modules`. No los regeneres. Usa `bun` para todo en mobile-pet-tracker; nunca npm ni npx. No añadas dependencias.
Árbol: `progress/current.md` y `progress/handoff_*.md` tienen cambios del leader sin commitear. No los toques ni los commitees. El chequeo de árbol limpio se acota a `git status --short -- mobile-pet-tracker/ specs/`.

Archivos (lista cerrada; si necesitas otro, PARA y pregunta al leader):
  - mobile-pet-tracker/src/components/ping-ring.tsx (nuevo, R13)
  - mobile-pet-tracker/src/components/__tests__/ping-ring.test.tsx (nuevo, R13)
  - mobile-pet-tracker/src/screens/pairing/index.tsx
  - mobile-pet-tracker/src/screens/pairing/index.test.tsx
  - mobile-pet-tracker/src/screens/welcome/index.tsx (consume PingRing; su test no cambia: ver Restricciones de R13)
  - mobile-pet-tracker/src/theme/global.css (token --text-24: 24px)
  - mobile-pet-tracker/src/__tests__/pairing-canvas-fidelity.test.ts (nuevo, R11 y R12)
  - mobile-pet-tracker/src/__tests__/design-drift.test.ts (solo el caso `padding: 24` del describe `R11 (mobile-device-pairing)`; ver Excepción 2)
  - specs/mobile-pairing-pingo-canvas-fidelity/traceability.md (solo en el commit final)
  - progress/impl_mobile-pairing-pingo-canvas-fidelity.md (tu reporte)
No tocar: src/i18n/catalog.ts, src/__tests__/ui-copy-table.ts (las cuatro claves de pairing ya existen), src/app/pairing.tsx, src/app/_layout.tsx, src/components/pingo-float.tsx, src/theme/motion.ts, src/screens/alert-detail/ping-ring.tsx, docs/, feature_list.json, STATUS.md, progress/history.md, progress/current.md, progress/handoff_*.md.

Reglas críticas:
  - Seguir docs/architecture.md y docs/conventions.md, y docs/ui-guidelines.md incluida su sección «Enmienda #188» (anillos de la vinculación). La carta gana sobre cualquier skill.
  - Skills, con los nombres del catálogo de Codex (no los nuestros):
    - `building-native-ui`: UI nativa. Equivale a nuestro `expo-native-ui`.
    - `expo-tailwind-setup`: uniwind y Tailwind.
    - Pantallas: `appllama-app-design-skill` (en `.agents/skills/` del repo), obligatoria para la pantalla. Solo toma el patrón: los valores mandan la spec y la carta.
    - Movimiento: `animate-expo` (en `.agents/skills/`). Las decisiones de movimiento están en R3 y R5; si una skill sugiere otra cosa, mandan la spec y la carta.
    - `expo-overview`, `expo-animation`, `expo-router` y `expo-design-system` no existen en Codex: no los busques. Los tokens ya están en `src/theme/global.css`.
    - Codex no tiene el MCP de appllama: si una skill pide sus herramientas, sáltalas y sigue la carta.
    - En el reporte, lista qué skills cargaste y cuáles no encontraste.
  - Esperas: docs/conventions.md §Esperas sobre el árbol renderizado. Espera al mismo nodo que aserta el test, nunca a un contador de mock. En R3, avanza el reloj a 0, 600, 2400 y 2401 ms y aserta en cada instante (2401 ms según la E1 de requirements.md). En R5, avanza a 0, 1500 y 2400 ms y aserta en cada uno.
  - RNTL 14: `await fireEvent` y `await act`. Sin await, un it contamina al siguiente. Si usas renderRouter, `await app;`.
  - RNTL oculta a accesibilidad los nodos decorativos: si un `getByTestId` no encuentra un anillo o a Pingo, pasa `{ includeHiddenElements: true }` en esa consulta. No quites la accesibilidad del componente.
  - R3 usa `toHaveAnimatedStyle` con `shouldMatchAllProps: true` donde la spec fija valores exactos: ambos anillos a 0 ms, el anillo 1 a 600 ms (0.55 y 0.55) y el anillo 0 a 2400 ms (escala 1.5, opacidad 0). Sin esa opción, una propiedad colada (una opacidad de más, por ejemplo) pasa en verde. A 600 ms el anillo 0 es intermedio: escala estrictamente entre 0.55 y 1.5, opacidad estrictamente entre 0 y 0.55. A 2401 ms (E1 de requirements.md) el anillo 0 no usa `toHaveAnimatedStyle` sino intervalos: lee el estilo con `getAnimatedStyle` del módulo `jestUtils` de `react-native-reanimated` (el mismo cálculo que el matcher), exige las claves exactas `opacity` y `transform` y compara con desigualdades estrictas: escala entre 0.55 y 0.6, opacidad entre 0.5 y 0.55. Si la importación no resuelve, es un error de invocación: corrígela y anótala en el reporte. El `it` de R3 pasa a nombrar 2401 ms (hoy dice 2400 ms). La aserción corregida por E1 nace verde sobre `bb598dbf`, porque `mobile-pet-tracker/src/components/ping-ring.tsx` ya cumple E1: regístralo en el reporte como cambio de enmienda, no como rojo→verde. El rojo de R3 es `ebf21c95`. No toques la animación de `ping-ring.tsx` para satisfacer la aserción vieja.
  - Si necesitas un doble de react-native-reanimated, no sustituyas `default` por un spread de `requireActual`: pierde `__esModule`.
  - Antes de crear testIDs nuevos (`pairing-ring-0`, `pairing-ring-1`, `pairing-pingo-float`, `pairing-title`), busca selectores por regex que los absorberían: `grep -rn 'TestId(/' mobile-pet-tracker/src`. Si alguno cambia de resultado, PARA y reporta.
  - Literales: los textos de R6 y R8 se copian de requirements.md tal cual (por ejemplo «Vincular collar» y «Pair collar»). No los traduzcas ni los inventes. Las claves de catálogo son `pairing.pairCollar`, `pairing.freePlanPairPrompt`, `pairing.activationCode` y `pairing.printedOnCollarBox`.
  - Comentarios de código: la referencia a la feature va solo como `#188 R<n>`. Un `#188` suelto choca con design-drift (HEX_LITERAL).
  - R12: cero hex y cero clases con corchetes en pairing/index.tsx y en ping-ring.tsx. Tokens `--text-<px>` en global.css. `text-<n>` no va en componentes de heroui-native ni en Card (regla #187): el título usa `Text` plano de react-native.
    Validación obligatoria antes del commit de R12: planta `className="w-[3px]"` en `src/screens/pairing/index.tsx`, confirma que el test de R12 falla y revierte la mutación. Sin ese paso el candado no está probado.
  - TDD por requisito: test rojo que nombra el R-id en el `it`, después verde, después refactor, según tasks.md. Un bloque no empieza hasta que el anterior esté en verde.
  - Un commit por requisito como mínimo, con el test rojo antes que su implementación. Mensaje `<tipo>(<scope>): <descripción> (R<n>)`, en inglés, según docs/conventions.md §Commits, con scope `pairing`.
  - R9, R11 y R14 pueden nacer verdes: anótalos como NV en el reporte, con el requisito previo que ya lo cubre, y sigue. No fuerces un rojo.
  - Commits: `git add` con rutas explícitas, solo los ficheros de cada requisito. Nunca `git add -A` ni `commit -a`. No mezcles ficheros de arnés en los commits TDD.
  - Commit final: traceability.md con los hashes y tu reporte, en UN commit `docs(pairing): ...` tras el último verde. La fila R3 y la sección «Estado al firmar E1» las puso el leader en 1cc2a08f, y la sección «Estado al cerrar esta ejecución» la dejó Codex en `db4b8841`. En ese commit final sustituyes esa sección y la fila R7 por el estado definitivo.
  - Tu reporte es progress/impl_mobile-pairing-pingo-canvas-fidelity.md. Los ficheros de cierre del leader no son tuyos: progress/history.md, progress/current.md, STATUS.md, progress/handoff_*.md y el campo `status` de feature_list.json.
  - No abras la PR ni la edites.
  - Si el sandbox te deniega un comando, PARA y repórtalo. No lo sustituyas por otro comando que haga lo mismo.
  - Un error de invocación (ENOENT sobre una ruta, `command not found` antes de que arranque jest, tsc o eslint, sin ficheros tocados) se corrige y se anota en el reporte. Solo PARA si falla el código, una cifra de esta lista o una guarda.
  - Si una cifra o ancla no coincide, PARA y reporta. La spec se reescribe; el código no se adapta. Lo mismo si `border-3` o `size-37.5` no compilan en uniwind, o si el test de `pingo-float` necesita cambios (R4).
  - Tipos: antes de cada `bun run typecheck` o `bunx tsc --noEmit`, ejecuta `test ! -e .expo/types/router.d.ts`. Si existe, PARA. Nunca `rm -f`.
  - Lint, siempre con `--no-cache` y redirect al log, sin pipe: `cd /home/claude/sites/Pet-Tracker-wt-188/mobile-pet-tracker && bunx expo lint --no-cache > ../progress/lint-188.log 2>&1 && test ! -s ../progress/lint-188.log`. Los logs (`progress/lint-188.log`, `progress/test-188.log`) quedan en `progress/` sin commitear (`*.log` está en .gitignore). tasks.md dice «fuera del árbol»: es una desviación menor, declarada aquí.

Anclas de la base (T0). Solo estos comandos son anclas: ante una diferencia, manda el fichero de la spec.
  grep -cF 'padding: 24' mobile-pet-tracker/src/screens/pairing/index.tsx   # 1
  grep -cF 'text-2xl' mobile-pet-tracker/src/screens/pairing/index.tsx   # 2
  grep -cF -- '--text-24' mobile-pet-tracker/src/theme/global.css   # 0
  test -f mobile-pet-tracker/assets/images/pingo-collar.webp && echo existe   # existe

Base de tests (T0): `cd /home/claude/sites/Pet-Tracker-wt-188/mobile-pet-tracker && bun run test > ../progress/test-188.log 2>&1`, y luego `grep -E '^Tests:' ../progress/test-188.log`. Referencia medida en este mismo código y reproducida por el leader el 2026-10-19: 120 suites, 3994 total (3994 passed, 0 skipped). La cifra 476 de la versión anterior de este handoff era errónea y queda retirada. Si tu T0 no da 3994, PARA y reporta el número.

Excepciones autorizadas por el leader (2026-10-19, tras los bloqueos de Codex en `22aff2e9`, `847cff9d`, `db4b8841` y `3082ff68`). Son las únicas aserciones previas que cambian; la 4 cambia una cabecera de `describe` y la 5 un import, ninguna aserción. Las excepciones 1 y 2 se actualizan en el commit TDD de R10, junto a su implementación; la 3, la 4 y la 5 tienen commit propio. Todas se reportan como desviación con esta referencia. Fuera de ellas, ninguna aserción previa fija el padding de `pairing-form`.
  - Excepción 1 (#95 R6), `mobile-pet-tracker/src/screens/pairing/index.test.tsx`, líneas 210-214: el test `renders the real route with uniform metrics and a dimensioned skeleton (#95 R6)` espera en `pairing-form` `{ padding: 24, gap: 16, paddingBottom: 48 }`. Cámbialo a `{ paddingHorizontal: 20, paddingVertical: 24, gap: 16, paddingBottom: 48 }`. Ese contenedor también renderiza el estado de carga: no añadas ramas condicionales de padding.
  - Excepción 2 (design-drift), `mobile-pet-tracker/src/__tests__/design-drift.test.ts`, línea 323: el `it.each` del describe `R11 (mobile-device-pairing): pairing usa el Card compartido y las dimensiones uniformes` pasa de `'padding: 24'` a dos casos, `'paddingHorizontal: 20'` y `'paddingVertical: 24'`. `'gap: 16'` e `'insets.bottom + 24'` no cambian. No toques ninguna otra línea de ese archivo.
  - Excepción 3 (guarda design-drift, detectada en R7), `mobile-pet-tracker/src/screens/pairing/index.test.tsx`, línea 1096, dentro del test de R2: el selector de orden `/^pairing-(ring-[01]|pingo)$/` contiene `ring-[01]`, que la guarda `[A-Za-z0-9_-]+-\[[^\]]+\]` (design-drift.test.ts:199 y :363) lee como clase arbitraria. Es un falso positivo: el selector no es una clase de UI. Cámbialo por `/^pairing-(ring-0|ring-1|pingo)$/`. Es el mismo conjunto de testIDs y la aserción `toEqual([...])` no cambia. No toques ninguna guarda ni otra línea de design-drift.test.ts. Commit propio, antes de R8: `refactor(pairing): spell R2 ring order selector without bracket syntax (R2)`. Reporta la línea `Tests:` antes y después. Tras el commit, `bun run test --runInBand --runTestsByPath src/screens/pairing/index.test.tsx src/__tests__/design-drift.test.ts src/__tests__/consistency-classnames.test.ts` debe dar 3 suites verdes y 0 fallidos.
  - Excepción 4 (cabecera de `describe`, no aserción; guarda design-drift #68 R18), `mobile-pet-tracker/src/screens/pairing/index.test.tsx`, línea 1059: `describe('#188: pairing canvas fidelity', () => {` pasa a `describe('#188 R1-R14: pairing canvas fidelity', () => {`. Con `#188:` HEX_LITERAL lo lee como color hex (`mobile-pet-tracker/src/__tests__/design-drift.test.ts:145`), y la regla de esta handoff exige `#188` siempre seguido de ` R<n>`. La cabecera cubre toda la feature, por eso el rango. Es la única coincidencia de la guarda en `src/screens/pairing/` y `src/components/ping-ring.tsx` (grep del leader). No toques la guarda ni los `it('#188 R<n>: …')`, que ya están exentos. Commit propio, antes de cerrar R7: `refactor(pairing): cite feature 188 as R1-R14 in describe title (R7)`. Reporta la línea `Tests:` antes y después. Tras el commit, `bun run test --runInBand --runTestsByPath src/screens/pairing/index.test.tsx src/__tests__/design-drift.test.ts src/__tests__/consistency-classnames.test.ts` debe dar 3 suites verdes y 0 fallidos.
  - Excepción 5 (import, no aserción; bloqueo de `bun run typecheck` tras `863da0dc`), `mobile-pet-tracker/src/screens/pairing/index.test.tsx`, línea 14: `import { getAnimatedStyle } from 'react-native-reanimated/src/jestUtils';` pasa a `import { getAnimatedStyle } from 'react-native-reanimated';`. La ruta profunda hace que `tsc` (strict) compile las fuentes TS de la librería: el typecheck sale con 62 errores TS, todos en `node_modules/react-native-reanimated/src/**` (`progress/init-188.log`, `progress/init-188.exit` = 2). La entrada pública re-exporta la misma función (`node_modules/react-native-reanimated/lib/typescript/index.d.ts:41`) y `test/jest-setup.js:5` ya usa esa entrada. Sin cambio de comportamiento: sin test nuevo y sin tocar guardas. Commit propio: `refactor(pairing): read animated style from the public reanimated entry (R3)`.
  - Los `paddingBottom` del host `screen-pairing` (test «añade paddingBottom 291», `pairing/index.test.tsx`, ~líneas 998-1023) no cambian.

Restricciones de R13 (`welcome/index.test.tsx` no se edita; `PingRing` debe reproducir lo que aserta):
  - `welcome-stage` tiene como hijos directos los tres `PingRing` y luego `welcome-pingo`, sin envoltorio. Cada `PingRing` recibe la prop `testID` (`welcome-ring-<n>`) y la pasa al `Animated.View`.
  - El `className` del host queda exactamente `absolute size-65 rounded-full border-2 border-accent`: el componente antepone `absolute` a la prop `className`, y welcome pasa `size-65 rounded-full border-2 border-accent`.
  - El estilo animado tiene solo `opacity` y `transform: [{ scale }]`.
  - Cada anillo llama a `withRepeat(<animación>, -1, false)` dos veces (escala y opacidad); con tres anillos son 6 llamadas con esos argumentos tras la animación.
  - La prop `delay` (ms) entra en `withDelay(delay, ...)` sobre ambos `withRepeat`.
  - Welcome conserva su gating `reduceMotion ? null : ...` sin cambios.

Guardas que R6 a R8 y R12 cruzan:
  - `pairing/index.tsx` debe conservar sus 2 llamadas `signOut(` (design-drift, `#87 R19`, tabla `screenSignOutCalls`).
  - `pairing/index.tsx` no contiene `StyleSheet`, `text-[10px]` ni hex (`FEATURE_STYLE_ESCAPES`, design-drift).

Cierre (tasks.md §Cierre):
  - `bun run test` en verde. El total es 3994 más los `it` nuevos que añadiste. Los tests previos de pairing pasan, con la excepción de arriba; cualquier otra aserción previa que choque con la spec, PARA y reporta.
  - Guardas de R12 en verde: design-drift, consistency-classnames, legibility-classnames y heroui-text-size-merge.
  - Typecheck: `test ! -e .expo/types/router.d.ts` y luego `bun run typecheck`.
  - Lint, como arriba.
  - `graphify update .` en el worktree (AST, sin coste).
  - Lista de ficheros tocados desde H0, para el reporte: `git diff --name-only 6dc51ca1..HEAD -- mobile-pet-tracker/` (desde la raíz del worktree). Debe coincidir con los ficheros de `mobile-pet-tracker/` de la lista de Archivos de arriba. `specs/` y `progress/` no entran en esta comprobación.
  - Reporte en progress/impl_mobile-pairing-pingo-canvas-fidelity.md: commits (hash y mensaje), línea `Tests:` tras cada commit, NV, skills cargadas, resultado de lint y typecheck, desviaciones. Los reportes de bloqueo de `22aff2e9`, `847cff9d`, `bf7af15e` y `db4b8841` se sobrescriben; quedan en git.
  - Última acción: crear progress/impl_mobile-pairing-pingo-canvas-fidelity.done con una sola línea, la ruta de progress/impl_mobile-pairing-pingo-canvas-fidelity.md. Está en .gitignore; no lo commitees.

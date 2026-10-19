Worktree: /home/claude/sites/Pet-Tracker-wt-188
NO lances ./init.sh aunque AGENTS.md lo pida: lo corre el leader.
Primer comando, antes de nada: `cd /home/claude/sites/Pet-Tracker-wt-188 && pwd && git branch --show-current`. Confirma en el reporte que la salida es esa ruta y la branch `feature/188-mobile-pairing-pingo-canvas-fidelity`.

Feature: mobile-pairing-pingo-canvas-fidelity (#188). Branch: feature/188-mobile-pairing-pingo-canvas-fidelity.
H0 (base de la implementación): bac73dd7, enmienda de docs/ui-guidelines.md. La firma de la spec es 16d27c18.
Spec aprobada: specs/mobile-pairing-pingo-canvas-fidelity/requirements.md (status: approved). Lee también design.md y tasks.md. D1 a D7 están cerradas en requirements.md y son la única fuente de decisiones: no hay nada pendiente de preguntar.
Orden: tasks.md manda. R13 va primero, luego R1 a R14 y el Cierre.
Criterios de aceptación: R1 a R14 de requirements.md. R9, R11 y R14 pueden nacer verdes.
Entorno: el worktree ya tiene `.env` en la raíz y `mobile-pet-tracker/node_modules`. No los regeneres. Usa `bun` para todo en mobile-pet-tracker; nunca npm ni npx. No añadas dependencias.

Archivos (lista cerrada; si necesitas otro, PARA y pregunta al leader):
  - mobile-pet-tracker/src/components/ping-ring.tsx (nuevo, R13)
  - mobile-pet-tracker/src/components/__tests__/ping-ring.test.tsx (nuevo, R13)
  - mobile-pet-tracker/src/screens/pairing/index.tsx
  - mobile-pet-tracker/src/screens/pairing/index.test.tsx
  - mobile-pet-tracker/src/screens/welcome/index.tsx (consume PingRing; su test no cambia)
  - mobile-pet-tracker/src/theme/global.css (token --text-24: 24px)
  - mobile-pet-tracker/src/__tests__/pairing-canvas-fidelity.test.ts (nuevo, R11 y R12)
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
  - Esperas: docs/conventions.md §Esperas sobre el árbol renderizado. Espera al mismo nodo que aserta el test, nunca a un contador de mock. En R3 y R5, avanza el reloj a los instantes de la spec y aserta en cada uno.
  - RNTL 14: `await fireEvent` y `await act`. Sin await, un it contamina al siguiente. Si usas renderRouter, `await app;`.
  - RNTL oculta a accesibilidad los nodos decorativos: si un `getByTestId` no encuentra un anillo o a Pingo, pasa `{ includeHiddenElements: true }` en esa consulta. No quites la accesibilidad del componente.
  - R3 usa `toHaveAnimatedStyle` con `shouldMatchAllProps: true`. Sin esa opción, una propiedad colada (una opacidad de más, por ejemplo) pasa en verde.
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
  - Commit final: traceability.md con los hashes y tu reporte, en UN commit `docs(pairing): ...` tras el último verde.
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

Base de tests (T0): `cd /home/claude/sites/Pet-Tracker-wt-188/mobile-pet-tracker && bun run test > ../progress/test-188.log 2>&1`, y luego `grep -E '^Tests:' ../progress/test-188.log`. Referencia medida por el leader en este mismo código: 476 total (468 passed, 8 skipped). Si tu T0 no da 476, PARA y reporta el número.

Cierre (tasks.md §Cierre):
  - `bun run test` en verde. El total es 476 más los `it` nuevos que añadiste. Los tests previos de pairing pasan; si una aserción previa choca con la spec, PARA y reporta.
  - Guardas de R12 en verde: design-drift, consistency-classnames, legibility-classnames y heroui-text-size-merge.
  - Typecheck: `test ! -e .expo/types/router.d.ts` y luego `bun run typecheck`.
  - Lint, como arriba.
  - `graphify update .` en el worktree (AST, sin coste).
  - Lista de ficheros tocados desde H0, para el reporte: `git diff --name-only bac73dd7..HEAD -- . ':!feature_list.json' ':!progress/current.md' ':!progress/handoff_mobile-pairing-pingo-canvas-fidelity.md'`. Debe coincidir con la lista de Archivos de arriba.
  - Reporte en progress/impl_mobile-pairing-pingo-canvas-fidelity.md: commits (hash y mensaje), línea `Tests:` tras cada commit, NV, skills cargadas, resultado de lint y typecheck, desviaciones.
  - Última acción: crear progress/impl_mobile-pairing-pingo-canvas-fidelity.done con una sola línea, la ruta de progress/impl_mobile-pairing-pingo-canvas-fidelity.md. Está en .gitignore; no lo commitees.

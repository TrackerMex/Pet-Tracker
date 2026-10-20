Worktree: /home/claude/sites/Pet-Tracker-wt-188
NO lances ./init.sh aunque AGENTS.md lo pida: lo corre el leader.
Primer comando, antes de nada: `cd /home/claude/sites/Pet-Tracker-wt-188 && pwd && git branch --show-current`. Confirma en el reporte que la salida es esa ruta y la branch `feature/188-mobile-pairing-pingo-canvas-fidelity`.

Feature: mobile-pairing-pingo-canvas-fidelity (#188), ronda E2 (R15 a R20). Branch: feature/188-mobile-pairing-pingo-canvas-fidelity. R1 a R14 ya están implementados, revisados y trazados: no los rehagas.
H0-E2 (base de esta ronda): el HEAD con el que arrancas. Es el commit de este handoff, descendiente de `189e641a` (enmienda de docs/ui-guidelines.md); ese commit solo toca `progress/`. Anótalo en el reporte con `git rev-parse HEAD`. La firma de E2 en requirements.md es `6a5317b2` (leader; Notion «Estado del gate» = Aprobado, página `3fe6115a-9b27-8138-8b8a-f251f23b7c31`, `page_last_edited_at` 2026-10-20T17:55:45.832Z).
Spec aprobada: specs/mobile-pairing-pingo-canvas-fidelity/requirements.md (§Enmiendas, E2). Lee también design.md (decisiones 11 a 16) y tasks.md (T0-E2, §Migraciones autorizadas de E2, bloques R15 a R20 y Cierre). ED1 a ED4 están cerradas ahí y son la única fuente de decisiones: no hay nada pendiente de preguntar.
Orden: tasks.md manda. T0-E2, R15, R16, R17, R18, R19, R20 y el Cierre. El segundo test de R16 (tokens) falla hasta R20 por `--tracking-code` y `--font-mono`: es esperado, anótalo en el reporte y no lo fuerces antes.
Reanudación (2026-10-20, tras la parada de R15): `9b6bc816` (test rojo de R15) está en git; la implementación de R15 en `src/screens/pairing/index.tsx` y tu reporte están en el árbol sin commitear. El leader validó el reporte y reprodujo el fallo. Autorizado seguir, en este orden:
  1. Quita el token `StyleSheet` de `src/screens/pairing/index.test.tsx` (el import de la línea 13 y la aserción `StyleSheet.flatten(pingo.props.style).height`): el candado `#68 R18` de design-drift lee ese fichero entero y rechaza `StyleSheet`. Comprueba la ausencia de `height` sin esa palabra, por ejemplo `const style = Object.assign({}, ...[pingo.props.style].flat(Infinity));` y `expect(style).not.toHaveProperty('height');`. No toques design-drift. Commit propio solo con ese fichero, antes de la implementación: `test(pairing): check the R15 hero image has no fixed height without StyleSheet (R15)`. El test sigue rojo por la ausencia de `pairing-hero`; anota la línea `Tests:`.
  2. Commit de la implementación de R15 (solo `src/screens/pairing/index.tsx`, que ya tienes en el árbol): `feat(pairing): group the hero and title with artboard geometry (R15)`. Antes, las cuatro suites del comando de guardas deben dar 4 verdes.
  3. Sigue con R16 a R20 y el Cierre como indica este handoff. Tu reporte sigue sin commitear hasta el commit final. Sustituye en él la sección «Bloqueo de E2 — R15» por el desarrollo real.
Criterios de aceptación: R15 a R20 de requirements.md. Contexto: en el smoke del 2026-10-20 la vista de vinculación no coincidía con el artboard «Vincular collar (19)». E2 fija la geometría del artboard (hero de 200 × 150, Pingo a 120 px, título de 28 px centrado, un solo avatar de la mascota seleccionada, banner con icono, botón anclado al fondo, etiqueta/input/pista del código).
Entorno: el worktree ya tiene `.env` en la raíz y `mobile-pet-tracker/node_modules`. No los regeneres ni los abras. Usa `bun` para todo en mobile-pet-tracker; nunca npm ni npx. No añadas dependencias (`reicon-react-native` ya exporta `InfoCircle` y `Package`).
Árbol: los `progress/init-188*.exit` son sin trackear y del leader; no los toques ni los commitees. `progress/current.md` y `progress/handoff_*.md` son del leader. El chequeo de árbol limpio se acota a `git status --short -- mobile-pet-tracker/ specs/`.

Archivos (lista cerrada; si necesitas otro, PARA y pregunta al leader):
  - mobile-pet-tracker/src/screens/pairing/index.tsx
  - mobile-pet-tracker/src/screens/pairing/index.test.tsx
  - mobile-pet-tracker/src/__tests__/pairing-canvas-fidelity.test.ts
  - mobile-pet-tracker/src/i18n/catalog.ts
  - mobile-pet-tracker/src/__tests__/ui-copy-table.ts
  - mobile-pet-tracker/src/__tests__/ui-language.test.ts
  - mobile-pet-tracker/src/__tests__/design-drift.test.ts (solo la migración de `rounded-14` de §Migraciones autorizadas de E2)
  - mobile-pet-tracker/src/theme/global.css (tokens `--text-28`, `--tracking-code`, `--font-mono`)
  - specs/mobile-pairing-pingo-canvas-fidelity/traceability.md (solo en el commit final)
  - progress/impl_mobile-pairing-pingo-canvas-fidelity.md (tu reporte)
No tocar: src/app/pairing.tsx, src/app/_layout.tsx, src/components/pingo-float.tsx, src/components/ping-ring.tsx, src/theme/motion.ts, src/screens/alert-detail/ping-ring.tsx, src/screens/welcome/index.tsx, docs/ (la enmienda de ui-guidelines.md ya la escribió el leader), feature_list.json, STATUS.md, progress/history.md, progress/current.md, progress/handoff_*.md.

Reglas críticas:
  - Seguir docs/architecture.md y docs/conventions.md, y docs/ui-guidelines.md incluida la sección «Enmienda #188 (E2)». La carta gana sobre cualquier skill. Su casilla de aprobación humana queda sin marcar: no la toques.
  - Skills, con los nombres del catálogo de Codex (no los nuestros):
    - `building-native-ui`: UI nativa.
    - `expo-tailwind-setup`: uniwind y Tailwind (tokens de `@theme`).
    - Pantallas: `appllama-app-design-skill` (en `.agents/skills/` del repo), obligatoria. Solo toma el patrón: los valores mandan la spec y la carta.
    - `expo-overview`, `expo-animation`, `expo-router` y `expo-design-system` no existen en Codex: no los busques. Los tokens ya están en `src/theme/global.css`.
    - Codex no tiene el MCP de appllama: si una skill pide sus herramientas, sáltalas y sigue la carta.
    - En el reporte, lista qué skills cargaste y cuáles no encontraste.
  - Esperas: docs/conventions.md §Esperas. Espera sobre el árbol renderizado, al mismo nodo que aserta el test, nunca a un contador de mock. Para el cambio de mascota, espera a que `pairing-pet-avatar` tenga el `accessibilityLabel` nuevo.
  - RNTL 14: `await fireEvent` y `await act`. Sin await, un it contamina al siguiente. Si usas renderRouter, `await app;`.
  - RNTL oculta a accesibilidad los nodos decorativos: si un `getByTestId` no encuentra el hero, un anillo o a Pingo, pasa `{ includeHiddenElements: true }` en esa consulta. No quites la accesibilidad del componente (el hero conserva `accessible={false}`, `accessibilityElementsHidden` e `importantForAccessibility="no-hide-descendants"`).
  - Si necesitas un doble de react-native-reanimated, no sustituyas `default` por un spread de `requireActual`: pierde `__esModule`. Para `reicon-react-native` usa un mock por fichero de test que exponga `size` y `color` de `InfoCircle` y `Package`, como `form-error.test.tsx` con `AlertCircle`.
  - Selectores por regex: el leader revisó los de pairing (`/^pairing-content-skeleton-/` y `/^pairing-(ring-0|ring-1|pingo)$/` dentro del stage). Los testIDs nuevos (`pairing-hero`, `pairing-hero-group`, `pairing-pet-row`, `pairing-pet-avatar`, `pairing-pet-avatar-disc`, `pairing-pet-avatar-image`, `pairing-pet-avatar-fallback`, `pairing-plan-icon`, `pairing-submit-spacer`, `pairing-activation-code-label`, `pairing-code-hint`) no los absorben. Si algún test existente cambia de resultado por un testID nuevo, PARA y reporta.
  - Literales de copy: los textos de R18 se copian de requirements.md tal cual: Lead «Plan gratuito — solo salud.» / «Free plan — health only.»; Body «Vincula un collar con plan activo para ver el mapa.» / «Pair a collar with an active plan to see the map.». No los traduzcas ni los inventes. Las claves son `pairing.freePlanPairLead` y `pairing.freePlanPairBody`; `pairing.freePlanPairPrompt` desaparece de catalog.ts, ui-copy-table.ts y de la lista de claves de `pairing-canvas-fidelity.test.ts`.
  - Comentarios de código: la referencia a la feature va solo como `#188 R<n>`. Un `#188` suelto choca con design-drift (HEX_LITERAL).
  - R12 sigue vigente: cero hex y cero clases con corchetes en pairing/index.tsx. Tokens `--text-<px>` en global.css (`text-28` es un token, no una clase con corchetes). `text-<n>` no va en componentes de heroui-native ni en Card (regla #187): título, banner y etiquetas usan `Text` plano de react-native. El banner es un `View` plano sin `CONTINUOUS_CORNER` (el recuento de consistency-classnames para pairing se queda en 1: el input).
  - Si uniwind no compila `font-mono` con el token `--font-mono: monospace`, PARA y devuelve al leader: no se inventa otra familia. Lo mismo si `size-9`, `h-37.5`, `w-50`, `p-0.75`, `leading-4.75` o `h-15` no compilan.
  - TDD por requisito: test rojo que nombra el R-id en el `it`, después verde, después refactor, según tasks.md. Un bloque no empieza hasta que el anterior esté en verde.
  - Commits test-primero, obligatorio: un commit por requisito como mínimo, y en cada requisito el commit con el test rojo va ANTES que el de su implementación (dos commits por requisito: `test(pairing): ... (R<n>)` rojo y `feat(pairing): ... (R<n>)` verde). Un único commit con test, implementación y docs incumple C4 de CHECKPOINTS.md y el reviewer lo rechaza. Mensaje `<tipo>(<scope>): <descripción> (R<n>)`, en inglés, según docs/conventions.md §Commits, con scope `pairing`. Registra en el reporte el hash de cada commit y la línea `Tests:` tras cada uno.
  - Las migraciones de aserciones previas (abajo) van en el commit de implementación del requisito que las provoca, junto a su código, y se reportan como migración autorizada con el nombre del `it`.
  - NV: un test que nace verde se anota como NV en el reporte con el requisito previo que ya lo cubre; no fuerces un rojo. Los candidatos son pocos: R17 y R20 deberían nacer rojos.
  - Commits: `git add` con rutas explícitas, solo los ficheros de cada requisito. Nunca `git add -A` ni `commit -a`. No mezcles ficheros de arnés en los commits TDD.
  - Commit final: traceability.md con los hashes y tu reporte, en UN commit `docs(pairing): ...` tras el último verde. Sustituye la sección «Estado de E2 (2026-10-20)» (la puso el leader) y la fila R7 (nombre nuevo del test de R16; sin tocar los hashes de las otras filas) por el estado definitivo. Añade las filas de R15 a R20 con test y commit.
  - Tu reporte es progress/impl_mobile-pairing-pingo-canvas-fidelity.md. Añade una sección «Ronda E2» al final; no borres lo anterior. No marques H1 a H3 ni las firmas humanas (L251 a L257 del reporte): son del humano.
  - No abras la PR ni la edites.
  - Si el sandbox te deniega un comando, PARA y repórtalo. No lo sustituyas por otro comando que haga lo mismo.
  - Un error de invocación (ENOENT sobre una ruta, `command not found` antes de que arranque jest, tsc o eslint, sin ficheros tocados) se corrige y se anota en el reporte. Solo PARA si falla el código, una cifra de esta lista o una guarda.
  - Si una cifra o ancla no coincide, PARA y reporta. La spec se reescribe; el código no se adapta.
  - Nada de recursos AWS ni `cdk deploy`.
  - Tipos: antes de cada `bun run typecheck` o `bunx tsc --noEmit`, ejecuta `test ! -e .expo/types/router.d.ts`. Si existe, PARA. Nunca `rm -f`.
  - Lint, siempre con `--no-cache` y redirect al log, sin pipe: `cd /home/claude/sites/Pet-Tracker-wt-188/mobile-pet-tracker && bunx expo lint --no-cache > ../progress/lint-188.log 2>&1 && test ! -s ../progress/lint-188.log`. Los logs (`progress/lint-188.log`, `progress/test-188.log`) quedan en `progress/` sin commitear (`*.log` está en .gitignore).

Anclas de la base (T0-E2). Todas desde la raíz del worktree. Cada línea imprime un número; la cifra esperada va tras el `#`. Ante una diferencia, PARA y reporta.
  grep -cF -- '--text-24' mobile-pet-tracker/src/theme/global.css   # 1
  grep -cF -- '--text-28' mobile-pet-tracker/src/theme/global.css   # 0
  grep -cF -- '--tracking-code' mobile-pet-tracker/src/theme/global.css   # 0
  grep -cF -- '--font-mono' mobile-pet-tracker/src/theme/global.css   # 0
  grep -cF -- '--tracking-title' mobile-pet-tracker/src/theme/global.css   # 1
  grep -cF 'freePlanPairPrompt' mobile-pet-tracker/src/i18n/catalog.ts   # 2
  grep -cF 'freePlanPairLead' mobile-pet-tracker/src/i18n/catalog.ts   # 0
  grep -cF 'freePlanPairPrompt' mobile-pet-tracker/src/__tests__/ui-copy-table.ts   # 1
  grep -cF 'freePlanPairPrompt' mobile-pet-tracker/src/__tests__/pairing-canvas-fidelity.test.ts   # 1
  grep -cF 'freePlanPairPrompt' mobile-pet-tracker/src/screens/pairing/index.tsx   # 1
  grep -cF 'PetSwitcher' mobile-pet-tracker/src/screens/pairing/index.tsx   # 2
  grep -cF 'text-24 font-black text-foreground' mobile-pet-tracker/src/screens/pairing/index.tsx   # 1
  grep -cF 'pairing-hero' mobile-pet-tracker/src/screens/pairing/index.tsx   # 0
  grep -cF 'pairing-pet-row' mobile-pet-tracker/src/screens/pairing/index.tsx   # 0
  grep -cF 'CATEGORY_SLOTS' mobile-pet-tracker/src/utils/category-palette.ts   # 1
  test -f mobile-pet-tracker/assets/images/pingo-collar.webp && echo existe   # existe (1024 × 1024)
El leader los corrió el 2026-10-20 sobre `189e641a` y dieron esas cifras.

Base de tests (T0-E2): `cd /home/claude/sites/Pet-Tracker-wt-188/mobile-pet-tracker && bun run test > ../progress/test-188.log 2>&1`, y luego `grep -E '^(Test Suites|Tests):' ../progress/test-188.log`. Referencia del leader (último init verde sobre el mismo código de `mobile-pet-tracker/`): 128 suites, 4247 tests. Anota tu cifra como T0-E2. Si no da 4247, no pares por eso, pero repórtalo y usa la tuya como base de todo el Cierre.

Migraciones autorizadas de E2 (detalle exacto en tasks.md §Migraciones autorizadas de E2; se citan por título del `it`). Son las únicas aserciones previas que cambian:
  - index.test.tsx, R17: `limpia actionError al seleccionar otra mascota` y `submits the trimmed code exactly once for the selected pet` seleccionan la mascota 2 con una sonda dentro de `PairingWrapper` (`useSelectedPet().selectPet('pet-2')` dentro de `await act`); la espera sobre `pet-chip-pet-1` pasa a esperar `pairing-pet-avatar` con `accessibilityLabel` `Luna`.
  - index.test.tsx, R17: `uses the shared pet switcher and changes the selected pet` pasa al estado emparejado (ambas mascotas con `device: makeDevice()` y `mockGetPetTracking` resuelto).
  - index.test.tsx, R17: `#188 R6: places the %s title first inside the scroll content`: `texts[0]` excluye `pairing-pet-avatar-fallback`.
  - index.test.tsx, R16: `#188 R7: gives the title the 24 px token and black weight` se renombra `#188 R7/R16: gives the title the 28 px token and black weight` y espera `text-28` y `font-black`, y que no contenga `text-24`, `text-2xl` ni `[`.
  - index.test.tsx, R19: `#188 R10: uses 20 px horizontal padding when %s`: en `linking` espera `{ paddingHorizontal: 20, paddingVertical: 24, gap: 16, paddingBottom: 48, flexGrow: 1 }`; `paired` no cambia.
  - pairing-canvas-fidelity.test.ts, R18: `#188 R11: resolves visible copy through bilingual catalog keys registered for pairing` se renombra `#188 R11/R18: resolves visible copy through bilingual catalog keys registered for pairing`; la lista cambia `pairing.freePlanPairPrompt` por `pairing.freePlanPairLead` y `pairing.freePlanPairBody`, y comprueba que `Prompt` ya no está.
  - ui-language.test.ts, R18: `expect(R10_PAIRING).toHaveLength(42 + 2 + 1 + 4 - 1)` pasa a `42 + 2 + 1 + 4 - 1 + 1`, con el comentario `#188 R18: -1 fila Prompt, +2 filas Lead y Body`. ui-copy-table.ts: se borra la entrada de `pairing.freePlanPairPrompt` y se añaden las de `pairing.freePlanPairLead` y `pairing.freePlanPairBody` (`file: 'src/screens/pairing/index.tsx'`).
  - design-drift.test.ts, R20: la lista esperada de `outsideReminders(/\brounded-14\b/)` añade `join('screens', 'pairing', 'index.tsx'), // #188 R20 comparte rounded-14` después de `meals-history`.
  Deben seguir en verde SIN editarse: `limpia la vista ready y el código al seleccionar otra mascota`, `#188 R1`, `#188 R2`, `#188 R4`, `#188 R8`, `shows the exact free-plan note and constrained activation-code field`, `renders the real route with uniform metrics and a dimensioned skeleton (#95 R6)`, los candados de design-drift sobre el import de `Card` y de `PetSwitcher`, y consistency-classnames. design-drift exige que sigan en el fichero `paddingHorizontal: 20`, `paddingVertical: 24`, `gap: 16` e `insets.bottom + 24`, y prohíbe `insets.top + 12` e `insets.bottom + 96`. Cualquier otra aserción previa que falle: PARA y devuelve al leader.

Tests nuevos (nombres exactos, 9 en total; los renombres no suman):
  - R15 (1): `#188 R15: groups a 200 × 150 hero box and the title with a 10 px gap`
  - R16 (2): `#188 R16: centers the title at 28 px with black weight and title tracking` (index.test.tsx) y `#188 R16/R20: declares the new theme tokens` (pairing-canvas-fidelity.test.ts)
  - R17 (3): `#188 R17: shows only the selected pet avatar above the hero`, `#188 R17: renders the initial or the photo on the palette slot of the selected pet`, `#188 R17: keeps the full pet switcher outside the linking view`
  - R18 (1): `#188 R18: renders the free-plan banner with an info icon and a bold lead`
  - R19 (1): `#188 R19: anchors the submit button to the bottom edge`
  - R20 (1): `#188 R20: styles label, code input and hint like the artboard`
  El contenido de cada uno está en el bloque de su requisito en tasks.md. El slot de color del avatar es `(['amber', 'violet', 'blue', 'green', 'rose'] as const)[index % 5]` con `index` la posición de la mascota en `pets.data.pets`; en una constante local con nombre.

Guardas que E2 cruza:
  - `pairing/index.tsx` debe conservar sus 2 llamadas `signOut(` (design-drift, `#87 R19`).
  - `pairing/index.tsx` Y `pairing/index.test.tsx` no contienen `StyleSheet` (en ninguna forma: ni import ni `StyleSheet.flatten`), `text-[10px]` ni hex: el candado `#68 R18` de design-drift (`featureFiles`) lee ambos ficheros. Lo mismo para cualquier test nuevo que añadas en esos ficheros.
  - Tras cada requisito que toque clases, corre `bun run test --runInBand --runTestsByPath src/screens/pairing/index.test.tsx src/__tests__/design-drift.test.ts src/__tests__/consistency-classnames.test.ts src/__tests__/pairing-canvas-fidelity.test.ts` (rutas con paréntesis no entran aquí).

Cierre (tasks.md §Cierre):
  - `bun run test` en verde. El total es T0-E2 más 9. Los tests previos de pairing pasan, con las migraciones de arriba.
  - Guardas en verde: design-drift, consistency-classnames, legibility-classnames y heroui-text-size-merge.
  - Typecheck: `test ! -e .expo/types/router.d.ts` y luego `bun run typecheck`.
  - Lint, como arriba.
  - `graphify update .` en el worktree (AST, sin coste).
  - Lista de ficheros tocados desde H0-E2, desde la raíz del worktree: `git diff --name-only 189e641a..HEAD -- mobile-pet-tracker/`. Debe coincidir con los ficheros de `mobile-pet-tracker/` de la lista de Archivos de arriba (`specs/` y `progress/` no entran).
  - Reporte en progress/impl_mobile-pairing-pingo-canvas-fidelity.md, sección «Ronda E2»: commits (hash y mensaje, test rojo antes de implementación), línea `Tests:` tras cada commit, T0-E2, NV, migraciones aplicadas por nombre de `it`, skills cargadas y no encontradas, resultado de lint y typecheck, desviaciones, y el rojo esperado del test de tokens entre R16 y R20.
  - Última acción: crear progress/impl_mobile-pairing-pingo-canvas-fidelity.done con una sola línea, la ruta de progress/impl_mobile-pairing-pingo-canvas-fidelity.md. Está en .gitignore; no lo commitees.

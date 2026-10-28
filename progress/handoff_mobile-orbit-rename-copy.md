Worktree: /home/claude/sites/Pet-Tracker-wt-221
NO lances ./init.sh aunque AGENTS.md lo pida: lo corre el leader (comparte LocalStack y Postgres con otros worktrees). Tampoco `git fetch`, `git merge` ni `git rebase`.
Primer comando, antes de nada: `cd /home/claude/sites/Pet-Tracker-wt-221 && pwd && git branch --show-current`. Confirma en el reporte que la salida es esa ruta y la branch `feature/221-mobile-orbit-rename-copy`.

Feature: mobile-orbit-rename-copy (#221). Branch: feature/221-mobile-orbit-rename-copy. Integra en `dev`, no en `main`.
H0 (base de la implementación y del diff final): 2b0f24fd6ee2b091afb274ee6b1ce7b7d444d43c (2b0f24fd). Contiene `origin/dev` 6e59fb2e. El commit de este handoff y cualquier commit del leader sobre `specs/` o `progress/` anterior al arranque no cuentan como trabajo tuyo.
Spec aprobada: specs/mobile-orbit-rename-copy/requirements.md (la casilla «Aprobado por humano» está marcada; el campo `status` del frontmatter lo gestiona el leader, no lo toques). Lee también design.md (inventario y pruebas de mutación) y tasks.md. La fe de erratas E1 (al final de requirements.md) manda sobre el último párrafo de R4: tú NO haces R4.
Alcance tuyo: R1, R2 y R3. R4 (carta `docs/ui-guidelines.md` punto 7, `celebration.test.tsx` y el test `orbit-charter-voice.test.ts`) es el gate G4 del humano: el leader prepara un parche aparte y el humano lo commitea después de tu cadena. NO toques la carta ni esos ficheros. Las casillas «Enmienda de la carta» y «Smoke de la bienvenida» de requirements.md son del humano; tú no las tocas. NO lances `eas build`.
Entorno: el worktree ya tiene `.env` en la raíz y `mobile-pet-tracker/node_modules`. No los regeneres. Usa `bun`/`bunx` para todo en mobile-pet-tracker; nunca npm ni npx. Esta feature NO añade ni quita dependencias: `package.json` y `bun.lock` no cambian.
Ficheros ajenos en el árbol: `progress/impl_orbit-r4-prep.md`, `progress/orbit-r4-prep.patch` y `progress/orbit-r4-prep.orbit-charter-voice.test.ts.txt` son del leader (sin trackear). No los añadas a ningún commit, no los borres, no los apliques.
Árbol: `progress/*.log` y `progress/impl_*.done` los ignora git. El chequeo de árbol limpio se acota a las rutas del trabajo: `cd /home/claude/sites/Pet-Tracker-wt-221/mobile-pet-tracker && git diff --quiet -- . ../docs ../specs ../backend-pet-tracker && git diff --cached --quiet && test -z "$(git ls-files --others --exclude-standard -- . ../docs ../specs ../backend-pet-tracker)"`. Nunca `test -z "$(git status --short)"` tras `git add`.

Qué cambia (resumen; el contrato son R1 a R3 de requirements.md):
  - Producción: SOLO dos líneas de `src/i18n/catalog.ts`: `'welcome.pingoGreeting': 'Hi, I\'m Pingo.',` pasa a `'welcome.pingoGreeting': 'Hi, I\'m Orbit.',` y `'welcome.pingoGreeting': 'Hola, soy Pingo.',` pasa a `'welcome.pingoGreeting': 'Hola, soy Orbit.',`. La clave NO se renombra. Apóstrofo ASCII U+0027, sin `!`, sin `¡`, sin emoji.
  - Tests: enmienda de 7 líneas de `expect` en 4 `it` de `src/screens/welcome/index.test.tsx` (solo los literales; los TÍTULOS de `describe`/`it` NO se tocan) y fichero nuevo `src/__tests__/orbit-rename-copy.test.ts`.

Archivos (lista cerrada; si necesitas otro, PARA y pregunta al leader). Todos bajo mobile-pet-tracker/ salvo indicación:
  Nuevo:
  - src/__tests__/orbit-rename-copy.test.ts (R1, R2, R3)
  Editados:
  - src/i18n/catalog.ts (R1: las dos líneas de arriba)
  - src/screens/welcome/index.test.tsx (R1: SOLO los 7 literales; ver «Enmienda exacta»)
  Solo en el último commit (C4):
  - ../specs/mobile-orbit-rename-copy/traceability.md (hashes de R1 a R3; la fila R4 queda `pendiente (G4, humano)`, E1b) y ../specs/mobile-orbit-rename-copy/tasks.md (solo casillas `- [x]` de lo entregado de R1 a R3 y del cierre que te toca; la sección «Gate G4» no la marques)
  - ../progress/impl_mobile-orbit-rename-copy.md (tu reporte)
No tocar: backend-pet-tracker/ entero, package.json, bun.lock, app.json, app.config.ts, eas.json, app/ entero, assets/ entero (los 9 `pingo-*.webp` se quedan), theme/, components/, utils/, api/, test/jest-setup.js, `src/__tests__/ui-copy-table.ts` y `src/__tests__/ui-language.test.ts` (R3: delta 0), `src/screens/welcome/index.tsx`, `src/components/__tests__/celebration.test.tsx`, `src/__tests__/orbit-charter-voice.test.ts`, docs/ entero (en particular docs/ui-guidelines.md), feature_list.json, STATUS.md, progress/history.md, progress/current.md, progress/handoff_*.md, ni requirements.md ni design.md. Si necesitas editar otro fichero para que un candado cuadre, PARA y repórtalo.

Reglas críticas:
  - Seguir docs/architecture.md, docs/conventions.md y docs/ui-guidelines.md. La carta gana sobre cualquier skill. Voz B: el copy no exclama, no lleva emoji y termina en punto.
  - Skills, con los nombres del catálogo de Codex (plugin expo 1.0.2, 13 skills; no los nuestros). Es un cambio de dos cadenas y de tests de texto: carga `building-native-ui` si quieres contrastar la pantalla y di qué cargaste. `expo:expo-overview`, `expo-animation`, `expo-router` y `expo-design-system` NO existen en Codex: no las busques (pedir una inexistente no da error: da silencio). En el reporte, lista qué skills cargaste y cuáles no encontraste.
  - Esperas: docs/conventions.md §Esperas sobre el árbol renderizado. En este cambio no añades tests de render; los de welcome ya existentes no se reescriben salvo sus literales.
  - RNTL 14: `await fireEvent`, `await render`, `await act`. No cambies los `await` existentes.
  - Jest: `jest-virtual-mock-lock` prohíbe `virtual:` en cualquier `jest.mock`. No uses `expect(nodoA).toBe(nodoB)` entre nodos de render.
  - Lectura de ficheros en el test nuevo: `const fs = jest.requireActual<typeof import('fs')>('fs');` (patrón de `src/__tests__/alert-detail-canvas-fidelity.test.ts`, mira cómo hace `sourceFiles()` con `readdirSync(..., { withFileTypes: true })` y cópialo). Lee `src/i18n/catalog.ts` como TEXTO: nunca compares contra el símbolo `es`/`en` importado de producción (tautológico). Los literales esperados van escritos a mano en el test.
  - Referencias a la feature en comentarios y títulos: SOLO `#221 R<n>`, nunca `#221` desnudo (el exento de `HEX_LITERAL` de design-drift es solo `#NNN R<n>`). Todo `it` NUEVO se titula `#221 R<n>: …` exactamente como en traceability.md. En las 7 líneas enmendadas de welcome, la línea con `// #205 R5` conserva ese comentario y gana ` // #221 R1`; si una línea no lleva comentario, no añadas ninguno.
  - Grep-limpio del test nuevo: sin `StyleSheet`, sin hex (salvo `#221 R<n>`), sin clases con corchetes `x-[…]`, sin emoji.
  - Sin reindentar y sin prettier: el móvil no tiene prettier y no lo ejecutes.
  - Commits: `git add` con rutas explícitas, solo los ficheros del paso. Nunca `git add -A` ni `commit -a`. No hagas push ni abras la PR.
  - UN COMMIT POR PASO, test rojo antes que su implementación (C4 de CHECKPOINTS.md): NUNCA implementación y test en el mismo commit (en #19 Codex metió todo en uno y no hubo historial rojo-verde). Mensajes en inglés con scope.
  - Cada cadena de comandos termina en su línea `git commit -m`. Las cabeceras de sección van como comentario de shell (`# -- C1 --`) y cada comando lleva un `cd` literal.
  - Jest de un fichero: `cd /home/claude/sites/Pet-Tracker-wt-221/mobile-pet-tracker && TZ=UTC bunx jest --runTestsByPath <ruta> --testTimeout=30000`, solo con `pgrep -f '[n]ode_modules/(.bin/jest|jest-worker)'` y `pgrep -f '[i]nit.sh'` vacíos (otros worktrees corren jest e init.sh en esta máquina: si no están vacíos, espera y vuelve a mirar; nunca esperes e `init.sh` en el mismo comando). Con `--runTestsByPath` las rutas con paréntesis no son regex. Un timeout aislado se mide sin flag antes de tocar nada.
  - Tipos: antes de cada `bun run typecheck`, ejecuta `test ! -e .expo/types/router.d.ts` (desde mobile-pet-tracker/). Si existe, PARA. Nunca `rm -f`. En esta cadena el typecheck es VERDE en todos los commits (el test lee texto; no importa módulos inexistentes).
  - Lint, siempre con `--no-cache` y redirect al log, sin pipe: `cd /home/claude/sites/Pet-Tracker-wt-221/mobile-pet-tracker && bunx expo lint --no-cache > ../progress/lint-221.log 2>&1 && test ! -s ../progress/lint-221.log`. `expo lint` puede morir por memoria con exit 0: por eso `test ! -s`.
  - Exit code: nunca mides un código a través de un pipe (`| tail` da el de `tail`). `bun run test > log 2>&1; echo exit=$?`.
  - No crear recursos AWS reales ni correr cdk deploy.
  - NO son tuyos: progress/history.md, progress/current.md, STATUS.md y el campo `status` de feature_list.json. Tu sitio para contarlo todo es progress/impl_mobile-orbit-rename-copy.md.
  - Si el sandbox te deniega un comando, PARA y repórtalo. No lo sustituyas por otro que haga lo mismo.
  - Un error de invocación (ENOENT sobre una ruta, `command not found` antes de que arranque jest, tsc o eslint, sin ficheros tocados) se corrige y se anota en el reporte. Solo PARA si falla el código, una cifra de esta lista o una guarda.
  - Si una cifra o ancla no coincide, PARA y reporta. La spec se reescribe; el código no se adapta.
  - Flakes conocidos bajo carga (Salud #168 R2, Inicio #152 R8, Nutrición #200 R9/R10, tinte `#0D1117`, y timeouts de `celebration`, `meals-history/index` y `register/index`): ante un rojo en una suite que no tocaste, córrela aislada; si pasa sola, anótalo y sigue. Un SIGKILL de jest (`failed to run`) cuenta 0 tests de esa suite: repite o suma el rerun. El aviso final de worker force-exit es preexistente: no pares por él.
  - Si te quedas sin contexto o paras por una cifra que no coincide: escribe `progress/impl_mobile-orbit-rename-copy.md` con lo medido hasta ahí y NO crees `progress/impl_mobile-orbit-rename-copy.done`.

Contenido del test nuevo `src/__tests__/orbit-rename-copy.test.ts` (3 `it` en 2 commits; el contrato son R1 a R3 de requirements.md):
  - `#221 R1: el catálogo dice Orbit`: el texto de `src/i18n/catalog.ts` contiene EXACTAMENTE una vez cada línea `  'welcome.pingoGreeting': 'Hi, I\'m Orbit.',` y `  'welcome.pingoGreeting': 'Hola, soy Orbit.',` (cuenta ocurrencias con `split(línea).length - 1` o equivalente) y no contiene `’` (U+2019).
  - `#221 R2: ninguna cadena visible nombra a Pingo` son DOS `it` con el mismo prefijo de título: (1) código fuente: recorrido recursivo de `src/` (extensiones `.ts`, `.tsx`, `.js`, `.jsx`, `.json`, `.css`; se excluyen los directorios `__tests__` y los ficheros `*.test.*`) más `app.json`, `app.config.ts` y `package.json`; ninguno casa `/\bPingo\b/` (sensible a mayúsculas, los comentarios cuentan); el mismo `it` exige que la lista de rutas recorridas contenga `i18n/catalog.ts`, `screens/welcome/index.tsx`, `components/empty-state.tsx` y `app/(tabs)/_layout.tsx` (sin fijar cuántos ficheros hay). (2) valores del catálogo: ningún VALOR de los objetos `en` y `es` de `catalog.ts` casa `/pingo/i` (parsea el texto: líneas `  '<clave>': <valor>,` o con el valor en la línea siguiente; no importes el catálogo). Títulos exactos: `#221 R2: ninguna cadena visible nombra a Pingo` (código fuente) y `#221 R2: ninguna cadena visible nombra a Pingo en los valores del catálogo`. Si prefieres otro sufijo para el segundo, anótalo en el reporte y respeta que el prefijo sea el de traceability.md.
  - `#221 R3: los identificadores pingo-* no cambian aquí` (C3, nace VERDE): (a) `catalog.ts` declara `'welcome.pingoGreeting':` exactamente 2 veces y ninguna clave contiene `orbit`; (b) `src/screens/welcome/index.tsx` contiene una vez `t('welcome.pingoGreeting')`, una vez `testID="welcome-bubble-text"` y una vez `testID="welcome-pingo-float"`; (c) `src/__tests__/ui-copy-table.ts` contiene exactamente una vez la fila `{ file: 'src/screens/welcome/index.tsx', key: 'welcome.pingoGreeting' }`; (d) `assets/images` no contiene ningún fichero con nombre que case `/orbit/i` y sigue con sus 9 ficheros `pingo-*.webp`; (e) ningún fichero no-test de `src/` (mismo recorrido que R2) tiene ruta que case `/orbit/i` ni contenido que case `/orbit/i`, salvo `src/i18n/catalog.ts`, que tiene exactamente 2 coincidencias.

Enmienda exacta de `src/screens/welcome/index.test.tsx` (C1; ancla por contenido, no por número de línea; títulos intactos):
  1. `#153 R1: el saludo de Pingo existe en los dos idiomas` › `declara el saludo en inglés y en español (enmendado por #205 R5)`: las dos líneas `expect(en['welcome.pingoGreeting']).toBe('Hi, I\'m Pingo.'); // #205 R5` y `expect(es['welcome.pingoGreeting']).toBe('Hola, soy Pingo.'); // #205 R5` pasan a `'Hi, I\'m Orbit.'` / `'Hola, soy Orbit.'` y su comentario pasa a `// #205 R5 // #221 R1`.
  2. mismo `describe` › `pinta el saludo en el bocadillo en español (enmendado por #205 R5)`: `screen.getByText('Hola, soy Pingo.')` pasa a `'Hola, soy Orbit.'`.
  3. mismo `describe` › `pinta el saludo en el bocadillo en inglés (enmendado por #205 R5)`: `screen.getByText('Hi, I\'m Pingo.')` pasa a `'Hi, I\'m Orbit.'`.
  4. `#205 R5: saludo de Main` › `#205 R5: el saludo dice «Hola, soy Pingo.» y «Hi, I\'m Pingo.»`: los tres `toBe`/`toEqual` pasan a `'Hola, soy Orbit.'`, `'Hi, I\'m Orbit.'` y `['Hola, soy Orbit.']`. El título del `it` se queda tal cual (es historia firmada y es la línea que conserva «Pingo» en las anclas).
  NO toques las constantes `voice` ni `idleLoops` de ese fichero ni ningún otro texto con «Pingo»: son de R4 (humano). Total: 7 líneas de `expect`, 4 `it`.

Ventana de rojos conocidos. Entre cada commit `test` y su `feat`, estos `it` y SOLO ellos pueden estar rojos. En cada commit anotas en el reporte la lista exacta de rojos medidos (nombre del `it` y fichero). Cualquier otro rojo: PARA.
  - Tras C1 (7 `it` rojos, 2 suites falladas), todos por aserción (el catálogo aún dice Pingo), ninguno por ENOENT:
      · `src/__tests__/orbit-rename-copy.test.ts`: `#221 R1: el catálogo dice Orbit`, `#221 R2: ninguna cadena visible nombra a Pingo` y el `it` de R2 de valores del catálogo (3).
      · `src/screens/welcome/index.test.tsx`: los 4 `it` enmendados (los tres del `describe` `#153 R1` y el `it` de `#205 R5`).
    Si el conjunto medido difiere (de más o de menos), PARA y reporta con el diff medido.
  - Tras C2: ningún rojo.
  - Tras C3: ningún rojo (R3 nace verde, ver sondas).

Anclas de la base (T0): corre cada una tal cual antes del primer test, desde /home/claude/sites/Pet-Tracker-wt-221/mobile-pet-tracker, y pega la salida en el reporte. Salidas esperadas medidas en H0; ante una diferencia, PARA. Un `grep -c` cuenta líneas, no apariciones.
  grep -cF "Pingo" src/i18n/catalog.ts    # 2
  grep -cF "Orbit" src/i18n/catalog.ts    # 0
  grep -cF "'welcome.pingoGreeting'" src/i18n/catalog.ts    # 2
  grep -cF "welcome.pingoGreeting" src/__tests__/ui-copy-table.ts    # 1
  grep -cF "welcome.pingoGreeting" src/screens/welcome/index.tsx    # 1
  grep -rIil "orbit" src app.json app.config.ts package.json assets | wc -l    # 0
  ls assets/images | grep -c '^pingo-'    # 9
  grep -cF "Hola, soy Pingo." src/screens/welcome/index.test.tsx    # 5
  grep -cF "Hola, soy Orbit." src/screens/welcome/index.test.tsx    # 0
  grep -cF "Hi, I\\'m Pingo." src/screens/welcome/index.test.tsx    # 4
  grep -cF "Hi, I\\'m Orbit." src/screens/welcome/index.test.tsx    # 0
  ls src/__tests__ | grep -c '^orbit'    # 0
  grep -rnw "Pingo" src --include='*.ts' --include='*.tsx' --exclude-dir=__tests__ --exclude='*.test.*' | wc -l    # 2
  (desde mobile-pet-tracker/) test ! -e .expo/types/router.d.ts && echo sin-router-d-ts    # sin-router-d-ts
  (desde mobile-pet-tracker/) git diff origin/dev --stat -- ../backend-pet-tracker package.json bun.lock | wc -l    # 0

Base de tests (T0): mídela tú antes del primer commit, con `pgrep` vacíos: `cd /home/claude/sites/Pet-Tracker-wt-221/mobile-pet-tracker && bun run test > ../progress/t0-221-codex.log 2>&1; echo exit=$?` y pega las líneas `Test Suites:` y `Tests:` en el reporte. Debe ser exit 0 y cero `FAIL`. Llama N a la cifra de `Tests:` de T0 (el leader no la fija: depende de lo mergeado en dev; es tu base). Un exit distinto de 0 con rojos en suites que no tocaste: córrelas aisladas (ver flakes); si no pasan solas, PARA.
  Base por fichero tocado (aislada, vuelve a medirla): src/screens/welcome/index.test.tsx = anótalo; es la base de C1.
  La cifra de tests de cada commit = anterior + sus `it` añadidos (anótalo como `total anterior + añadidos`). C1: N + 3 (los 4 `it` de welcome se enmiendan, no se añaden). C2: N + 3. C3: N + 4.

Cadena (pega la línea `Tests:` y la de `Test Suites:` tras cada commit; «rojo» = rojos por el motivo declarado en la ventana de rojos):
  # -- C1 -- test(welcome): greeting says Orbit (R1, R2).
  Enmienda los 7 literales de welcome (arriba) y crea src/__tests__/orbit-rename-copy.test.ts con los tres `it` de R1 y R2 (todavía SIN el de R3). Rojo: los 7 de la ventana. Sin full-suite en este commit: corre solo los dos ficheros (`--runTestsByPath` con las dos rutas) y anota los 7 rojos y que `typecheck` y `lint` están verdes. Acumulado de ficheros tocados desde H0 (`git diff --name-only 2b0f24fd6ee2b091afb274ee6b1ce7b7d444d43c..HEAD -- mobile-pet-tracker/src | wc -l`): 2.
  cd /home/claude/sites/Pet-Tracker-wt-221/mobile-pet-tracker && git add src/screens/welcome/index.test.tsx src/__tests__/orbit-rename-copy.test.ts && test "$(git diff --cached --name-only | wc -l)" = 2 && git commit -m "test(welcome): greeting says Orbit (R1, R2)"
  # -- C2 -- feat(i18n): rename greeting to Orbit (R1, R2).
  Cambia las dos líneas de src/i18n/catalog.ts y nada más. Verde: los 7 rojos pasan. Full-suite sin pipe: `cd /home/claude/sites/Pet-Tracker-wt-221/mobile-pet-tracker && bun run test > ../progress/full-221-c2.log 2>&1; echo exit=$?` → exit 0, `Tests: <N + 3> passed`. `typecheck` verde, `lint` verde. Acumulado de `src`: 3.
  Anclas tras C2 (desde mobile-pet-tracker/):
    grep -cF "Pingo" src/i18n/catalog.ts    # 0
    grep -cF "Orbit" src/i18n/catalog.ts    # 2
    grep -cF "'welcome.pingoGreeting'" src/i18n/catalog.ts    # 2
    grep -cF "Hola, soy Orbit." src/i18n/catalog.ts    # 1
    grep -cF "Hola, soy Pingo." src/screens/welcome/index.test.tsx    # 1
    grep -cF "Hola, soy Orbit." src/screens/welcome/index.test.tsx    # 4
    grep -cF "Hi, I\\'m Pingo." src/screens/welcome/index.test.tsx    # 1
    grep -cF "Hi, I\\'m Orbit." src/screens/welcome/index.test.tsx    # 3
    grep -rnw "Pingo" src --include='*.ts' --include='*.tsx' --exclude-dir=__tests__ --exclude='*.test.*' | wc -l    # 0
    grep -rIil "orbit" src app.json app.config.ts package.json assets    # src/i18n/catalog.ts
    git diff 2b0f24fd6ee2b091afb274ee6b1ce7b7d444d43c..HEAD --name-only -- mobile-pet-tracker/src    # exactamente 3 rutas: catalog.ts, welcome/index.test.tsx, orbit-rename-copy.test.ts
  Sondas de C2 (plantar tras el commit; correr SOLO `src/__tests__/orbit-rename-copy.test.ts` y, donde se indica, welcome; ver el rojo concreto y revertir con `git checkout HEAD -- <fichero>`; tras cada una `git diff --quiet -- . && git diff --cached --quiet` desde mobile-pet-tracker/ y borra el fichero nuevo de M2c):
    M1a. catalog.ts: `'Hola, soy Orbit.'` → `'Hola, soy Orbit!'` → rojos `#221 R1` y los `expect` de welcome.
    M1b. catalog.ts: el apóstrofo `\'` de la cadena en pasa a `’` (U+2019) → rojo `#221 R1`.
    M2a. `// Pingo habla` como comentario en src/components/empty-state.tsx → rojo `#221 R2` (código fuente). Revertir con `git checkout HEAD -- src/components/empty-state.tsx`.
    M2b. clave inventada `'zz.probe': 'Pingo te avisa.',` en el objeto `es` de catalog.ts, lejos de welcome → rojo `#221 R2` (valores del catálogo).
    M2c. fichero NUEVO src/hooks/zz.ts con `// Pingo` → rojo `#221 R2` (recorrido recursivo). Revertir con `rm src/hooks/zz.ts` (es un fichero tuyo, creado por la sonda).
  # (sin commit propio: las sondas se revierten)
  # -- C3 -- test(i18n): pingo identifiers stay unchanged (R3).
  Añade el `it` de R3 a src/__tests__/orbit-rename-copy.test.ts. NACE VERDE por diseño (describe el estado que R1 no debe tocar): decláralo en el reporte y pruébalo con M3a a M3c. +1 test → N + 4. Full-suite sin pipe a `../progress/full-221-c3.log`: exit 0, `Tests: <N + 4> passed`. `typecheck` y `lint` verdes. Acumulado de `src`: 3 (el mismo fichero). Comprueba `git diff 2b0f24fd6ee2b091afb274ee6b1ce7b7d444d43c..HEAD --stat -- mobile-pet-tracker/src/__tests__/ui-copy-table.ts mobile-pet-tracker/src/__tests__/ui-language.test.ts | wc -l` = 0 (R3: ninguno de los dos se edita).
  Sondas de C3 (plantar tras el commit; correr `src/__tests__/orbit-rename-copy.test.ts`; revertir y verificar árbol limpio como arriba):
    M3a. catalog.ts: renombrar la clave `'welcome.pingoGreeting'` de UNA de las dos líneas a `'welcome.orbitGreeting'` → rojo `#221 R3` (a) y el test de welcome.
    M3b. welcome/index.tsx: `testID="welcome-pingo-float"` → `testID="welcome-orbit-float"` → rojo `#221 R3` (b). Revertir con `git checkout HEAD -- src/screens/welcome/index.tsx`.
    M3c. `cp assets/images/pingo-wave.webp assets/images/orbit-wave.webp` → rojo `#221 R3` (d). Revertir con `rm assets/images/orbit-wave.webp` (fichero creado por la sonda).
  cd /home/claude/sites/Pet-Tracker-wt-221/mobile-pet-tracker && git add src/__tests__/orbit-rename-copy.test.ts && test "$(git diff --cached --name-only | wc -l)" = 1 && git commit -m "test(i18n): pingo identifiers stay unchanged (R3)"
  # -- C4 -- docs(mobile): traceability and report (R1-R3).
  Un solo commit, SOLO los tres ficheros: specs/mobile-orbit-rename-copy/traceability.md (hash del commit de test y del `feat` por R; R3: «nace verde, sin feat»; la fila R4 se queda `pendiente (G4, humano)`; no tocar nada más), las casillas `- [x]` de tasks.md de R1 a R3 y del cierre que te toca (typecheck, lint, test, traceability, reporte; el smoke y la sección G4 NO), y progress/impl_mobile-orbit-rename-copy.md. No rebasees tras rellenar los hashes.
  cd /home/claude/sites/Pet-Tracker-wt-221/mobile-pet-tracker && git add ../specs/mobile-orbit-rename-copy/traceability.md ../specs/mobile-orbit-rename-copy/tasks.md ../progress/impl_mobile-orbit-rename-copy.md && test "$(git diff --cached --name-only | wc -l)" = 3 && git commit -m "docs(mobile): traceability and report for the Orbit rename (R1-R3)"
Antes de C4 el jest completo sin pipe y los gates de cierre (abajo). Total esperado al cerrar: N + 4.

Guardas que R1 a R3 cruzan (comprobaciones por estado intermedio):
  - Un 0 o una igualdad medida solo al final puede ser falsa a mitad de cadena: las anclas de «Tras C2» se miden en C2 y no antes (`grep -cF "Pingo" src/i18n/catalog.ts` es 2 hasta C2).
  - El recuento por diff de R3 (`ui-copy-table.ts` y `ui-language.test.ts` ausentes de `git diff 2b0f24fd..HEAD --stat`) se mide en C3 y otra vez al final.
  - Candados que NO cambian y que debes respetar: `ui-language` (`wholeLiterals`, `SCREEN_FILES` y `ALL_USES` sin tocar), `language-provider` (el catálogo conserva su cuenta: no se añaden ni se quitan claves), `design-drift`, `consistency-classnames`, `legibility-classnames`, `heroui-text-size-merge`, `jest-virtual-mock-lock`, `welcome-canvas-fidelity` y los demás tests de `screens/welcome`.
  - Si al correr la suite aparece en rojo un `it` que no está en la ventana, PARA y anótalo con el diff medido; no lo enmiendes por tu cuenta. En particular, si un test que lee `docs/ui-guidelines.md` se pone rojo, NO toques la carta: es R4 y no debería moverse con tus cambios.

Cierre (lo que el reporte debe traer):
  - `bun run test` completo en verde, sin pipe, guardado en `progress/final-test-221.log`: `cd /home/claude/sites/Pet-Tracker-wt-221/mobile-pet-tracker && bun run test > ../progress/final-test-221.log 2>&1; echo exit=$?` → exit 0, `Tests: <N + 4> passed`.
  - Guardas en verde (cita su línea): `orbit-rename-copy`, `screens/welcome/index.test.tsx`, ui-language, language-provider, design-drift, consistency-classnames, legibility-classnames, heroui-text-size-merge, jest-virtual-mock-lock.
  - Typecheck: `test ! -e .expo/types/router.d.ts` y luego `bun run typecheck` (verde en todos los commits).
  - Lint, como arriba (verde, log vacío).
  - `graphify update .` en el worktree (AST, sin coste).
  - Lista de ficheros tocados desde H0, desde la raíz del worktree: `git diff --name-only 2b0f24fd6ee2b091afb274ee6b1ce7b7d444d43c..HEAD`. Debe ser: `mobile-pet-tracker/src/i18n/catalog.ts`, `mobile-pet-tracker/src/screens/welcome/index.test.tsx`, `mobile-pet-tracker/src/__tests__/orbit-rename-copy.test.ts`, `specs/mobile-orbit-rename-copy/traceability.md`, `specs/mobile-orbit-rename-copy/tasks.md`, `progress/impl_mobile-orbit-rename-copy.md` = 6 rutas, más `progress/handoff_mobile-orbit-rename-copy.md` si el leader lo commiteó sobre H0 (7). Cualquier otra ruta es un fallo.
  - Pega la salida (vacía) de `git diff origin/dev --stat -- ../backend-pet-tracker package.json bun.lock` desde mobile-pet-tracker/.
  - Reporte en progress/impl_mobile-orbit-rename-copy.md: comprobación del primer comando, salida de las anclas T0 y la base de tests (N), commits (hash y mensaje), línea `Tests:` y `Test Suites:` tras cada commit, lista de rojos medidos en C1 (contra la ventana), resultado de las 8 sondas M1a a M3c (rojo concreto visto, `it` que se puso rojo, y revertida; el estado de árbol limpio tras cada una), el `it` que nació verde (R3) y su mutación, skills cargadas y no encontradas, lint y typecheck, desviaciones, tabla R1 a R3 a test a commit, y la nota de que R4 queda pendiente del humano (G4). Casos de smoke del humano: con idioma español la burbuja de la bienvenida dice «Hola, soy Orbit.» y con inglés «Hi, I'm Orbit.»; la burbuja no corta el texto.
  - Última acción, y SOLO tras toda la cadena C1 a C4 en verde: crear progress/impl_mobile-orbit-rename-copy.done con una sola línea, la ruta de progress/impl_mobile-orbit-rename-copy.md. Está en .gitignore; no lo commitees (lo vigila scripts/harness/watch-impl.sh). Si paraste por un rojo fuera de ventana o un ancla que no coincide, escribe el reporte y NO crees `.done`.

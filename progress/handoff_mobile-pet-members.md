Worktree: /home/claude/sites/Pet-Tracker-wt-214
NO lances ./init.sh aunque AGENTS.md lo pida: lo corre el leader (comparte LocalStack y Postgres con otros worktrees).
Primer comando, antes de nada: `cd /home/claude/sites/Pet-Tracker-wt-214 && pwd && git branch --show-current && git log --oneline -2`. Confirma en el reporte que la salida es esa ruta y la branch `feature/214-mobile-pet-members`. Los dos commits deben ser, de arriba abajo, el del handoff (`docs(progress): #214 Codex handoff`) y `08fe7dab` (H0).

Feature: mobile-pet-members (#214). Branch: feature/214-mobile-pet-members. Integra en `dev`, no en `main`.
H0 (base de la implementación y del diff final): 08fe7dab. La spec está aprobada: la casilla `Aprobado por humano` está marcada, la firma delegada está en aeb6364f y 08fe7dab y las erratas en ec89c965. El merge de `origin/dev` con #218 (fondo `surface` del `BottomSheet`) y #219 ya está hecho en 8e9bff38, padre de H0. 08fe7dab solo toca `specs/`, así que el código de 8e9bff38 y el de H0 son el mismo. NO hagas `git fetch`, `git merge`, `git rebase` ni `bun install --frozen-lockfile`: los puntos (1) y (2) del Paso 0 de tasks.md ya están cumplidos y no se repiten. El punto (3) (re-medir las bases de design.md §7.1 y P1–P20) sí lo corres: son las anclas T0 de abajo.
Spec aprobada: specs/mobile-pet-members/requirements.md (status: approved). Lee también design.md, tasks.md y traceability.md enteros. Contexto (no instrucciones): progress/firma_mobile-pet-members.md. No hay decisiones abiertas: no hay nada que preguntar.
Orden: tasks.md manda, sin cambios de orden (ver «Cadena»). Criterios de aceptación: R1 a R24 de requirements.md. La casilla de smoke en dispositivo y el rebuild del dev build son del humano; tú no los tocas.
Entorno: el worktree ya tiene `.env` y `mobile-pet-tracker/node_modules`. No los regeneres. Usa `bun`/`bunx` para todo en mobile-pet-tracker; nunca npm ni npx. Única dependencia nueva: `expo-clipboard` (R23, ver «Dependencia nueva»).
Árbol: `progress/*.log` y `progress/impl_*.done` los ignora git. El chequeo de árbol limpio se acota: `cd /home/claude/sites/Pet-Tracker-wt-214/mobile-pet-tracker && git diff --quiet -- . ../docs ../specs && test -z "$(git ls-files --others --exclude-standard -- . ../docs ../specs)"`. Nunca `test -z "$(git status --short)"` tras `git add`.

Archivos (lista cerrada, la de design.md §4 «Archivos afectados»; si necesitas otro, PARA y pregunta al leader). Todos bajo mobile-pet-tracker/ salvo los que empiezan por `../`:
  Producción nueva:
  - src/api/pet-members.ts (R1)
  - src/utils/pet-members.ts (`formatInviteCode`, `memberInitials`, `inviteDateParts`: R9, R12, R14)
  - src/app/pets/[petId]/members.tsx, src/app/pets/[petId]/invite.tsx, src/app/join-pet.tsx (rutas delgadas, R3)
  - src/screens/pet-members/index.tsx (R8 a R13, R16, R17)
  - src/screens/pet-invite/index.tsx (R14, R15)
  - src/screens/join-pet/index.tsx (R18 a R21)
  Producción modificada:
  - src/api/query-keys.ts (`memberKeys`, `inviteKeys`: R2)
  - src/app/_layout.tsx (tres `Stack.Screen`: R3)
  - src/screens/profile/index.tsx (`ProfileWideTile`, filas nuevas, query de miembros: R4 a R6)
  - src/screens/home/index.tsx (`home-join-pet`: R7)
  - src/i18n/catalog.ts (51 claves × 2 idiomas: R22)
  - package.json y bun.lock (solo `expo-clipboard`: R23)
  - test/jest-setup.js (doble global de `expo-clipboard`, design.md §6: R23)
  Tests nuevos:
  - src/api/__tests__/pet-members.test.ts (R1, R2, R19 API)
  - src/utils/__tests__/pet-members.test.ts (R23, R9, R12, R14)
  - src/screens/pet-members/index.test.tsx (R8 a R13, R16, R17)
  - src/screens/pet-invite/index.test.tsx (R14, R15)
  - src/screens/join-pet/index.test.tsx (R18 a R21)
  Tests modificados (candados de design.md §7.1, R24, y los `it` de R3 a R7):
  - src/app/__tests__/layout.test.tsx (R3; filas 1–4)
  - src/app/__tests__/detail-stack.guard.test.tsx (fila 5)
  - src/app/(tabs)/__tests__/screens.test.tsx (fila 12, doble)
  - src/screens/home/index.test.tsx (R7; filas 6–7)
  - src/screens/profile/index.test.tsx (R4 a R6; filas 8–11)
  - src/providers/__tests__/language-provider.test.tsx (fila 48)
  - src/hooks/use-pet-selection.test.tsx (fila 49)
  - src/__tests__/sheet-surface-background.test.ts (filas 13–14)
  - src/__tests__/design-drift.test.ts (filas 15–16)
  - src/__tests__/consistency-classnames.test.ts (filas 17–25)
  - src/__tests__/canvas-foundations.test.ts (fila 26)
  - src/__tests__/zones-canvas-fidelity.test.ts (fila 27)
  - src/__tests__/alerts-canvas-fidelity.test.ts (fila 28)
  - src/__tests__/profile-canvas-fidelity.test.ts (filas 29–30)
  - src/__tests__/chunky-cta-canvas-fidelity.test.ts (filas 31–45)
  - src/__tests__/ui-copy-table.ts (fila 46)
  - src/__tests__/ui-language.test.ts (fila 47 y el `describe('#214 R22: copy de Familia')`)
  Arnés:
  - ../specs/mobile-pet-members/traceability.md (solo en el commit final)
  - ../progress/impl_mobile-pet-members.md (tu reporte)
No tocar: src/api/http.ts, src/api/pets.ts, src/api/users.ts, src/screens/pairing/ (modelo de la receta de hoja, se lee), src/screens/reminders/, src/screens/meal-schedule/ (modelo de `retryAll`, se lee), src/components/ (ninguno: `ScreenHeader`, `EmptyState` y demás se consumen), src/theme/, src/utils/category-palette.ts, src/hooks/use-pet-selection.ts, src/providers/, src/i18n/ salvo catalog.ts, el resto de src/app/ (solo las tres rutas nuevas y `_layout.tsx`), src/__tests__/jest-virtual-mock-lock.test.ts, src/__tests__/no-pets-states.test.ts, src/__tests__/home-pingo-phrase.test.ts, src/api/__tests__/query-keys.test.ts, cualquier otro test fuera de la lista, backend-pet-tracker/, init.sh, init.config.sh, feature_list.json, STATUS.md, progress/history.md, progress/current.md, progress/handoff_*.md, progress/firma_*.md, ni docs/.

Reglas críticas:
  - Seguir docs/architecture.md, docs/conventions.md y docs/ui-guidelines.md. La carta gana sobre cualquier skill.
  - Skills, con los nombres del catálogo de Codex (plugin expo 1.0.2, 13 skills; no los nuestros). La spec o la carta pueden nombrar `expo:expo-overview`: NO existe en Codex, no la busques.
    - `building-native-ui`: las tres pantallas (ScrollView, filas, notas), las dos hojas `BottomSheet` de Familia, el `KeyboardAvoidingView` y el `TextInput` de Unirme, `Share` de react-native.
    - `native-data-fetching`: las tres `useQuery` de R8 y la de invitaciones con `enabled` (R12), `refetch` del reintento, `invalidateQueries` y `removeQueries` (R11 a R13, R17, R21).
    - `expo-tailwind-setup`: uniwind y clases Tailwind v4.
    - `appllama-app-design-skill` (en `.agents/skills/`): obligatoria según la carta §Skills. Solo toma el patrón; los valores los mandan la spec y la carta. Codex no tiene el MCP de appllama: si la skill pide sus herramientas, sáltalas.
    - `expo-overview`, `expo-router`, `expo-animation` y `expo-design-system` no existen en Codex. Las rutas delgadas y `useLocalSearchParams` (R3, R14) siguen el patrón de `src/app/pets/[petId]/docs-upload.tsx`; `router.push({ pathname, params })` y `router.dismissTo('/home')` son los literales de R13, R17, R20 y R21. Esta feature no anima nada nuevo: `PingRing` (src/components/ping-ring.tsx) y `PingoFloat` (src/components/pingo-float.tsx) de R18 ya existen y se consumen.
    - En el reporte, lista qué skills cargaste y cuáles no encontraste.
  - Esperas: docs/conventions.md §Esperas sobre el árbol renderizado. Espera al mismo nodo que aserta el test (el positivo final o, si la rama pinta null, la desaparición del nodo de carga `pet-members-loading`), nunca a un contador de mock. requirements.md no da una espera por `it`: aplica esa regla en todos.
  - RNTL 14: `await fireEvent`, `await render`, `await renderRouter` y `await act`. Sin await, un it contamina al siguiente.
  - RNTL oculta a accesibilidad los nodos decorativos: si un `getByTestId` no encuentra un nodo que existe (`member-row-*-avatar`, `invite-row-*-icon`, `pet-members-pet-avatar`, `join-pet-hero`), pasa `{ includeHiddenElements: true }`; no quites la accesibilidad del componente. `R9: ningún texto … correo de getMe` recorre los textos con `includeHiddenElements` (lo dice R9).
  - Zona horaria: R12 y R14 construyen sus instantes con `new Date(año, mes, día, h, min)` local y los formatea la misma zona, así que no hace falta fijar zona. Si alguna vez la cambias, `process.getBuiltinModule('process').env.TZ = …` restaurada en `afterEach`; `process.env.TZ` NO cambia `Date` en jest.
  - Valores de la spec (rutas y métodos de R1, cuerpos `{}` y `{ code }`, claves de query, frases, `shareText`, cifras de inventario, clases, testIDs) son literales del test, nunca importados de producción (candado tautológico).
  - El copy sale de `src/i18n/catalog.ts`; los literales es-MX/en-US son los de design.md §5 (51 claves: 4 + 29 + 10 + 8) y §5.1, aprobados por el humano en G1 (2026-10-26 22:47 UTC y 2026-10-27 02:38 UTC), incluidos `members.leaveBodyNoOwner` y el en-US de H2. Úsalos tal cual, en el orden de la tabla, no inventes otros. Ninguna pantalla contiene como literal un texto de usuario.
  - `checkUses` de src/__tests__/ui-language.test.ts solo ve llamadas `t('<clave>'` directas: la píldora de rol (R9), el cuerpo de la hoja de salir (R17) y el texto de `join-pet-error` (R19) son ternarios de llamadas `t('…')` directas, escritos como los da la spec. Nunca `t(roleKey)`, `t(errorKey)` ni un mapa de claves.
  - Títulos de `it`: los `it` nuevos llevan, literal, el título de requirements.md (`R<n>: …`, sin `#214`), que es el que ya trae traceability.md. En los ficheros de test que ya existen (layout, profile, home), mete los `it` nuevos de cada R en un `describe('#214 R<n>: <tema>', …)` propio, como hacen allí los bloques de otras features; el título del `it` no cambia y el reporte da el nombre completo `describe › it`. Los `it` viejos que tocas toman exactamente el título que da su fila de design.md §7.1 (sufijo ` (enmendado por #214 R<n>)`), y cada término nuevo lleva `// #214 R<n>` en su línea.
  - Comentarios que citan la feature: solo como `#214 R<n>`, nunca `#214` desnudo (el exento de `HEX_LITERAL` de design-drift es solo `#NNN R<n>`). En producción, src/screens/home/index.tsx y src/screens/profile/index.tsx NO llevan ningún comentario `#214`, ni siquiera `#214 R<n>`: `#190 R12` y `#173 R15` cuentan todo `#` seguido de tres dígitos como hex en esos ficheros (P5 y P6: 0 → 0).
  - Cero `StyleSheet.create`, hex fuera de `src/theme/`, clases `[...]`, `text-accent` desnudo, `useThemeColors` con `'accent'`, sombras legacy o emoji. design-drift lee también index.test.tsx de algunas pantallas: no pongas `StyleSheet` en tests de pantalla. Única dependencia nueva: `expo-clipboard` (R23).
  - Colores: en Unirme, una sola llamada `const [foreground, muted, accentStrong] = useThemeColors(['foreground', 'muted', 'accent-strong']);` (R18; `#61 R4` de legibility-classnames veta `'accent'`), y `placeholderTextColor={muted}` en `join-pet-input` (`#62 R12`). En Perfil, las líneas literales de P2 (import de reicon) y P4 (`useThemeColors` con `'category-rose-strong'` entre violeta y `accent-strong`).
  - Hojas de R11 y R17: receta de #218 en src/screens/pairing/index.tsx (se lee, no se toca). Dos `<BottomSheet index=` en src/screens/pet-members/index.tsx, cada una con `backgroundStyle={{ backgroundColor: surface }}` y su View interior `items-center gap-3 bg-surface px-5 pb-9 pt-3`, y UNA sola `const [surface] = useThemeColors(['surface']);` para las dos (P11 a P14). El doble de `BottomSheet` del test sigue el de src/screens/pairing/index.test.tsx.
  - Reintento de R8 (A14): `retryAll()` copiado de src/screens/meal-schedule/index.tsx y la etiqueta de apertura literal `<Button testID="pet-members-retry" onPress={retryAll}>`, con `{t('common.retry')}` como único hijo y sin `className`, `style` ni `variant` (sin labio: `#177 R8.4`; P16).
  - `join-pet-go-home` lleva `onPress={() => router.dismissTo('/home')}` escrito así, literal (lo busca la fila de `CTA_ROWS`). `join-pet-submit` usa `className` y `style={chunkyLip.primary}` estáticos, sin el ternario `KEEP_OPACITY`.
  - `react-hooks/purity` veta `Date.now()` y `new Date()` sin argumento en render. `new Date(expiresAt)` de R14 sale de un parámetro; si el lint lo marca, PARA y reporta.
  - Inventarios (R24): design.md §7.1 es la lista cerrada de 49 filas, más las anclas P1–P20 de producción y entorno; tasks.md §R24 da, por fila, el commit en que entra («Rojo en») y el que la pone verde («Verde con»). Cada fila entra con su cifra final, escrita como base + delta, en el commit rojo (1) de su «Rojo en», y se pone verde con el commit (2) de su «Verde con»; entre los dos, su rojo es el esperado. Los de §7.2 no se editan: si uno se pone rojo, la producción no sigue la spec (PARA). Si al correr la suite cae una guarda que no está en §7.1, PARA y anótala (nombre, cifra base, cifra que da).
  - Adelanto de candados: si el `feat` de un R pone en rojo una fila de §7.1 ANTES de su «Rojo en», adelanta a ESE `feat` solo esa fila, con la cifra acumulada de ese commit (que la deja verde), y en su «Rojo en» oficial ponle la cifra final; dilo en el reporte (commit, fila, cifra). Una fila que se pone verde antes de su «Verde con» no es parada: anótala (se espera la fila 13 tras el `feat` de R11). Una fila que sigue roja tras el commit de su «Verde con», PARA. Al terminar, todas las cifras son exactamente las «después» de §7.1.
  - Sondas de mutación: ver «Sondas». Cada R lleva una mutación plantada en producción, vista en rojo y revertida (no se commitea). Sin la sonda el candado no está probado: anótalo en el reporte.
  - TDD por requisito: test rojo que nombra el R-id, después verde. Antes de cada commit de test, comprueba que los `it` nuevos fallan por la aserción, no por import roto ni excepción: el fichero de producción existe con un esqueleto que exporta los símbolos (tasks.md, cabecera). Los `it` que nacen verdes son la lista cerrada de «Nacen verdes» (abajo): el commit de test los lleva igual y el reporte usa la frase «nace verde: <motivo>». Cualquier otro `it` que pase en su commit (1), PARA y avisa.
  - UN COMMIT POR PASO como mínimo, test rojo antes que su implementación (C4 de CHECKPOINTS.md): `test(mobile): #214 <resumen> (R<n>)` y luego `feat(mobile): #214 <resumen> (R<n>)`, resumen en inglés. Nunca implementación y test en el mismo commit, ni un commit para varios R-ids. El refactor, si lo hay, va en `refactor(mobile): #214 … (R<n>)`. Las tres excepciones de tasks.md, con su mensaje fijado: R23 (2) es `chore(mobile): #214 add expo-clipboard (R23)`; las utilidades de R9, R12 y R14 son un solo par `test(mobile): #214 pet members utils (R9, R12, R14)` / `feat(mobile): #214 pet members utils (R9, R12, R14)`, y R22 (tabla) es un único `test(mobile): #214 register pet members copy (R22)`.
  - Commits: `git add` con rutas explícitas, solo los ficheros del paso. Nunca `git add -A` ni `commit -a`. El móvil no tiene prettier: no lo ejecutes.
  - Cada cadena termina en su línea `git commit -m`. Las cabeceras de sección van como comentario de shell (`# -- R1 test --`).
  - Commit final: traceability.md con los hashes y tu reporte, en UN commit `docs(mobile): #214 traceability and implementation report` tras el último verde. No mezcles ficheros de arnés en los commits TDD. No rebasees tras rellenarlo.
  - Jest de un fichero: `cd /home/claude/sites/Pet-Tracker-wt-214/mobile-pet-tracker && bunx jest --runTestsByPath '<ruta>' --testTimeout=30000`, solo con `pgrep -f '[n]ode_modules/(.bin/jest|jest-worker)'` y `pgrep -f '[i]nit.sh'` vacíos (otros worktrees corren jest en esta máquina: si no están vacíos, espera y vuelve a mirar; nunca esperes e `init.sh` en el mismo comando). El posicional sin `--runTestsByPath` es regex y sale 0 sin correr nada: las rutas con `[` o `(` (`src/app/(tabs)/__tests__/screens.test.tsx`) van siempre con `--runTestsByPath` y entre comillas. Un timeout aislado se mide sin flag antes de tocar nada.
  - Tipos: antes de cada `bunx tsc --noEmit`, ejecuta `test ! -e .expo/types/router.d.ts` desde mobile-pet-tracker/. Si existe, PARA. Nunca `rm -f`.
  - Lint, siempre con `--no-cache` y redirect al log, sin pipe: `cd /home/claude/sites/Pet-Tracker-wt-214/mobile-pet-tracker && bunx expo lint --no-cache > ../progress/lint-214.log 2>&1 && test ! -s ../progress/lint-214.log`. `expo lint` puede morir por memoria con exit 0: por eso `test ! -s`. (tasks.md dice `/tmp/lint.log`: usa esta ruta en su lugar.)
  - No crear recursos AWS reales ni correr cdk deploy.
  - NO son tuyos: progress/history.md, progress/current.md, STATUS.md y el campo `status` de feature_list.json. Tu sitio para contarlo todo es progress/impl_mobile-pet-members.md.
  - No abras la PR ni la edites. No hagas push.
  - Si el sandbox te deniega un comando, PARA y repórtalo. No lo sustituyas por otro que haga lo mismo.
  - Un error de invocación (ENOENT sobre una ruta, `command not found` antes de que arranque jest, tsc o eslint, sin ficheros tocados) se corrige y se anota en el reporte. Solo PARA si falla el código, una cifra de esta lista o una guarda.
  - Si una cifra o ancla no coincide, PARA y reporta. La spec se reescribe; el código no se adapta.
  - Flakes de carga conocidos: si un rojo de la suite completa es una suite que no tocaste y pasa sola, es carga: córrela aislada, anota el rojo y el verde aislado y sigue. Conocidos: `#199 R18` (timeouts), Nutrición `#200 R9`/`#200 R10` (`screens/food`), Inicio `#152 R8`, Salud `#168 R2`. En tus ficheros: `#190 R5` (PingoFloat, translateY -10 → 0) de src/screens/home/index.test.tsx cayó una vez en la auditoría y pasó al repetir: rojo en la suite completa y verde aislado se anota y se sigue; rojo aislado, PARA. Cualquier otro rojo de tu alcance o de un candado del inventario, PARA.

Dependencia nueva (R23, design.md §6). Solo en el paso verde R23 (2):
  - Instalación: `cd /home/claude/sites/Pet-Tracker-wt-214/mobile-pet-tracker && bunx expo install expo-clipboard`. Necesita red: si el sandbox la deniega, PARA y repórtalo (no copies el paquete a mano ni edites bun.lock a mano).
  - Diff permitido, comprobado justo después con `cd /home/claude/sites/Pet-Tracker-wt-214 && git diff 08fe7dab -- mobile-pet-tracker/package.json mobile-pet-tracker/bun.lock | grep '^[-+]' | grep -v '^+++\|^---'`:
    - package.json: una sola línea añadida, `"expo-clipboard": "~<versión>",`, en `dependencies` entre `"expo-blur": "~57.0.2",` y `"expo-constants": "~57.0.12",`. La versión la fija la CLI para el SDK 57 y empieza por `~` (lo aserta R23).
    - bun.lock: la línea `"expo-clipboard": "~<versión>",` en las dependencias del workspace, entre `"expo-blur"` y `"expo-constants"`, y la entrada `"expo-clipboard": ["expo-clipboard@<versión>", …],` del bloque `packages`, entre las de `expo-blur` y `expo-constants`, con su línea en blanco separadora.
    - Nada más: ninguna línea `-` y ninguna línea `+` que no contenga `expo-clipboard`, salvo líneas `+` vacías en bun.lock. Si la CLI toca otra dependencia o reordena el lock, PARA y reporta sin commitear.
  - Doble: al final de test/jest-setup.js, tras `require('react-native-reanimated').setUpTests();`, la línea `jest.mock('expo-clipboard', () => ({ setStringAsync: jest.fn() }));`, sin la opción `virtual` (P18: 0 → 1; P19: 0 → 0). Ningún otro fichero declara `jest.mock('expo-clipboard'`. El valor por defecto lo fija solo src/screens/pet-invite/index.test.tsx: `import * as Clipboard from 'expo-clipboard';` y, en su `beforeEach`, `jest.mocked(Clipboard.setStringAsync).mockResolvedValue(true);`; el `it` de fallo de R15 sobreescribe con `jest.mocked(Clipboard.setStringAsync).mockRejectedValue(new Error('x'))`. `Share` no tiene doble global: el test usa `jest.spyOn(Share, 'share')` con `Share` de react-native.
  - Instalación, doble y filas 26 y 27 de §7.1 (`44 + 1`) van en el mismo commit `chore(mobile): #214 add expo-clipboard (R23)`: un `jest.mock` con factoría de un módulo no instalado tumba todas las suites. Tras ese commit, `test ! -e .expo/types/router.d.ts`, `bunx tsc --noEmit` y lint.
  - El rebuild del dev build por el módulo nativo nuevo es del humano (G4). Tú no lo lanzas.

Anclas de la base (T0) y de llegada: el punto (3) del Paso 0 de tasks.md. Son las 189 anclas `grep -cF` de design.md §7.1 (filas 1–49) y P1–P20, una por línea, con la cifra `base → después`. Corre cada una tal cual antes del primer test, desde /home/claude/sites/Pet-Tracker-wt-214/mobile-pet-tracker, y pega la salida en el reporte. La base la midió el leader en 8e9bff38, que tiene el mismo código que H0: las 189 coinciden con design.md, sin ninguna discrepancia. Las cinco de src/screens/pet-members/index.tsx (P11 a P14 y P16) dan `No such file or directory` en T0: es lo esperado (fichero nuevo; design.md da 0). Ante cualquier otra diferencia con la base, PARA. Al cierre (tasks.md §R24 (1)), las mismas 189 dan la cifra «después».
  grep -cF -- 'expect(children).toHaveLength(8 + 1 + 1 + 1 + 1 + 1 + 1);' src/app/__tests__/layout.test.tsx   # fila 1: 1 → 0
  grep -cF -- 'expect(children).toHaveLength(8 + 1 + 1 + 1 + 1 + 1 + 1 + 3); // #194 R4' src/app/__tests__/layout.test.tsx   # fila 1: 0 → 1
  grep -cF -- "declara ocho rutas protegidas y alerts singular (enmendado por #214 R3)', async () => {" src/app/__tests__/layout.test.tsx   # fila 1: 0 → 1
  grep -cF -- 'expect(children).toHaveLength(9 + 1 + 1 + 1 + 1 + 1);' src/app/__tests__/layout.test.tsx   # fila 2: 1 → 0
  grep -cF -- 'expect(children).toHaveLength(9 + 1 + 1 + 1 + 1 + 1 + 3); // #194 R4' src/app/__tests__/layout.test.tsx   # fila 2: 0 → 1
  grep -cF -- "declara alerts/[alertId] como décimo hijo y singular (enmendado por #214 R3)', async () => {" src/app/__tests__/layout.test.tsx   # fila 2: 0 → 1
  grep -cF -- 'expect(children).toHaveLength(10 + 1 + 1 + 1 + 1);' src/app/__tests__/layout.test.tsx   # fila 3: 1 → 0
  grep -cF -- 'expect(children).toHaveLength(10 + 1 + 1 + 1 + 1 + 3); // #194 R4' src/app/__tests__/layout.test.tsx   # fila 3: 0 → 1
  grep -cF -- "declara pets/[petId]/geofences como undécimo hijo y no singular (enmendado por #189 R1.1) (enmendado por #214 R3)', async () => {" src/app/__tests__/layout.test.tsx   # fila 3: 0 → 1
  grep -cF -- 'expect(children).toHaveLength(11 + 1 + 1 + 1);' src/app/__tests__/layout.test.tsx   # fila 4: 1 → 0
  grep -cF -- 'expect(children).toHaveLength(11 + 1 + 1 + 1 + 3); // #194 R4' src/app/__tests__/layout.test.tsx   # fila 4: 0 → 1
  grep -cF -- "declara pets/[petId]/geofence-editor como duodécimo hijo y no singular (enmendado por #189 R1.1) (enmendado por #214 R3)', async () => {" src/app/__tests__/layout.test.tsx   # fila 4: 0 → 1
  grep -cF -- "'/pets/pet-1/members', '/pets/pet-1/invite', '/join-pet', // #214 R3" src/app/__tests__/detail-stack.guard.test.tsx   # fila 5: 0 → 1
  grep -cF -- "'/edit-profile', // #194 R4" src/app/__tests__/detail-stack.guard.test.tsx   # fila 5: 2 → 2
  grep -cF -- "aterriza en welcome y no reabre el detalle', async (href) => {" src/app/__tests__/detail-stack.guard.test.tsx   # fila 5: 1 → 0
  grep -cF -- "aterriza en welcome y no reabre el detalle (enmendado por #214 R3)', async (href) => {" src/app/__tests__/detail-stack.guard.test.tsx   # fila 5: 0 → 1
  grep -cF -- "child.type)))).toEqual(['home-empty', 'home-join-pet']); // #214 R7" src/screens/home/index.test.tsx   # fila 6: 0 → 1
  grep -cF -- "queda en el sitio del vacío que sustituye (enmendado por #181 R3) (enmendado por #214 R7)', async () => {" src/screens/home/index.test.tsx   # fila 6: 0 → 1
  grep -cF -- "child.props.testID)).toEqual(['home-empty', 'home-join-pet']); // #214 R7" src/screens/home/index.test.tsx   # fila 7: 0 → 1
  grep -cF -- "toEqual(['home-empty']);" src/screens/home/index.test.tsx   # fila 7: 2 → 0
  grep -cF -- "y sustituye la escena (enmendado por #176 R3) (enmendado por #214 R7)', async () => {" src/screens/home/index.test.tsx   # fila 7: 0 → 1
  grep -cF -- "'documents-link', 'pairing-link', 'geofences-link', 'reminders-link'," src/screens/profile/index.test.tsx   # fila 8: 1 → 1
  grep -cF -- "'members-link', 'join-pet-link', // #214 R4, R6" src/screens/profile/index.test.tsx   # fila 8: 0 → 1
  grep -cF -- "abre la ruta de la mascota activa (enmendado por #214 R4, R6)', async () => {" src/screens/profile/index.test.tsx   # fila 8: 0 → 1
  grep -cF -- 'expect(grid.children).toHaveLength(2);' src/screens/profile/index.test.tsx   # fila 9: 1 → 0
  grep -cF -- 'expect(grid.children).toHaveLength(2 + 2); // #214 R4, R6' src/screens/profile/index.test.tsx   # fila 9: 0 → 1
  grep -cF -- "con mascota ordena dos filas de dos tiles (enmendado por #214 R4, R6)', async () => {" src/screens/profile/index.test.tsx   # fila 9: 0 → 1
  grep -cF -- 'expect(grid.children).toHaveLength(1);' src/screens/profile/index.test.tsx   # fila 10: 1 → 0
  grep -cF -- 'expect(grid.children).toHaveLength(1 + 1); // #214 R6' src/screens/profile/index.test.tsx   # fila 10: 0 → 1
  grep -cF -- "sin mascota deja recordatorios solo y a ancho completo (enmendado por #214 R6)', async () => {" src/screens/profile/index.test.tsx   # fila 10: 0 → 1
  grep -cF -- "import { getPet, listPets, type PetState, type PetsState } from '../../api/pets';" src/screens/profile/index.test.tsx   # fila 11: 1 → 1
  grep -cF -- "import { listPetMembers } from '../../api/pet-members';" src/screens/profile/index.test.tsx   # fila 11: 0 → 1
  grep -cF -- "jest.mock('../../api/pet-members', () => ({ listPetMembers: jest.fn() }));" src/screens/profile/index.test.tsx   # fila 11: 0 → 1
  grep -cF -- 'mockLaunchImageLibrary.mockResolvedValue({ canceled: true, assets: null });' src/screens/profile/index.test.tsx   # fila 11: 3 → 3
  grep -cF -- "jest.mocked(listPetMembers).mockResolvedValue({ kind: 'error' }); // #214 R5" src/screens/profile/index.test.tsx   # fila 11: 0 → 1
  grep -cF -- "jest.mock('../../../api/users', () => ({ getMe: jest.fn() }));" 'src/app/(tabs)/__tests__/screens.test.tsx'   # fila 12: 1 → 1
  grep -cF -- "jest.mock('../../../api/pet-members', () => ({ listPetMembers: jest.fn() })); // #214 R5" 'src/app/(tabs)/__tests__/screens.test.tsx'   # fila 12: 0 → 1
  grep -cF -- "expect(importers).toEqual(['screens/pairing/index.tsx', 'screens/reminders/index.tsx']);" src/__tests__/sheet-surface-background.test.ts   # fila 13: 1 → 0
  grep -cF -- "'screens/pet-members/index.tsx', // #214 R11, R17" src/__tests__/sheet-surface-background.test.ts   # fila 13: 0 → 1
  grep -cF -- "Vinculación y Familia montan un BottomSheet (enmendado por #214 R11, R17)', () => {" src/__tests__/sheet-surface-background.test.ts   # fila 13: 0 → 1
  grep -cF -- "'screens/pet-members/index.tsx': 2, // #214 R11, R17" src/__tests__/sheet-surface-background.test.ts   # fila 14: 0 → 1
  grep -cF -- '.toHaveLength(SHEETS[path]);' src/__tests__/sheet-surface-background.test.ts   # fila 14: 0 → 1
  grep -cF -- '.toHaveLength(SHEETS[path] + 1);' src/__tests__/sheet-surface-background.test.ts   # fila 14: 0 → 1
  grep -cF -- "backgroundColor: surface }}')).toHaveLength(2);" src/__tests__/sheet-surface-background.test.ts   # fila 14: 1 → 0
  grep -cF -- "con backgroundStyle surface (enmendado por #214 R11, R17)', (path) => {" src/__tests__/sheet-surface-background.test.ts   # fila 14: 0 → 1
  grep -cF -- "'screens/home/index.tsx': 1 + 1, // #214 R7" src/__tests__/design-drift.test.ts   # fila 15: 0 → 1
  grep -cF -- "'screens/join-pet/index.tsx': 2, // #214 R18" src/__tests__/design-drift.test.ts   # fila 15: 0 → 1
  grep -cF -- "'screens/pet-invite/index.tsx': 2, // #214 R15" src/__tests__/design-drift.test.ts   # fila 15: 0 → 1
  grep -cF -- "'screens/pet-members/index.tsx': 6, // #214 R11, R13, R16, R17" src/__tests__/design-drift.test.ts   # fila 15: 0 → 1
  grep -cF -- "join('screens', 'join-pet', 'index.tsx'), // #214 R18" src/__tests__/design-drift.test.ts   # fila 15: 0 → 1
  grep -cF -- "join('screens', 'pet-members', 'index.tsx'), // #214 R10, R12" src/__tests__/design-drift.test.ts   # fila 15: 0 → 1
  grep -cF -- "(enmendado por #205 R13) (enmendado por #214 R7, R10, R11, R12, R13, R15, R16, R17, R18)', () => {" src/__tests__/design-drift.test.ts   # fila 15: 0 → 1
  grep -cF -- "'screens/join-pet/index.tsx', // #214 R18" src/__tests__/design-drift.test.ts   # fila 16: 0 → 1
  grep -cF -- "'screens/pet-invite/index.tsx', // #214 R15" src/__tests__/design-drift.test.ts   # fila 16: 0 → 1
  grep -cF -- "'screens/pet-members/index.tsx', // #214 R13" src/__tests__/design-drift.test.ts   # fila 16: 0 → 1
  grep -cF -- "(enmendado por #198 R15) (enmendado por #214 R13, R15, R18)', () => {" src/__tests__/design-drift.test.ts   # fila 16: 0 → 1
  grep -cF -- 'toHaveLength(16 + 1 + 1 + 1); // #194 R6 // #191 R11 // #201 R13' src/__tests__/consistency-classnames.test.ts   # fila 17: 1 → 0
  grep -cF -- 'toHaveLength(16 + 1 + 1 + 1 + 4); // #194 R6 // #191 R11 // #201 R13 // #214 R13, R15, R18, R20' src/__tests__/consistency-classnames.test.ts   # fila 17: 0 → 1
  grep -cF -- 'expect(primaryRadius).toHaveLength(1); // #177 R10' src/__tests__/consistency-classnames.test.ts   # fila 17: 1 → 1
  grep -cF -- "en un único radio (enmendado por #177 R10) (enmendado por #201 R13) (enmendado por #214 R13, R15, R18, R20)', () => {" src/__tests__/consistency-classnames.test.ts   # fila 17: 0 → 1
  grep -cF -- 'ChevronRight, FileText, Key, Map as MapIcon, Plus, Users, Wifi } from' src/__tests__/consistency-classnames.test.ts   # fila 18: 0 → 1
  grep -cF -- 'expect(profile.match(/ChevronRight/g)).toBeNull();' src/__tests__/consistency-classnames.test.ts   # fila 18: 1 → 0
  grep -cF -- 'expect(profile.match(/ChevronRight/g)).toHaveLength(2); // #214 R4' src/__tests__/consistency-classnames.test.ts   # fila 18: 0 → 1
  grep -cF -- "ChevronRight solo en la tarjeta ancha (#173 R10) (enmendado por #214 R4, R6)', () => {" src/__tests__/consistency-classnames.test.ts   # fila 18: 0 → 1
  grep -cF -- 'expect(textInputs).toHaveLength(6);' src/__tests__/consistency-classnames.test.ts   # fila 19: 1 → 0
  grep -cF -- 'expect(textInputs).toHaveLength(6 + 1); // #214 R18' src/__tests__/consistency-classnames.test.ts   # fila 19: 0 → 1
  grep -cF -- 'expect(withPlaceholder).toHaveLength(5);' src/__tests__/consistency-classnames.test.ts   # fila 19: 1 → 0
  grep -cF -- 'expect(withPlaceholder).toHaveLength(5 + 1); // #214 R18' src/__tests__/consistency-classnames.test.ts   # fila 19: 0 → 1
  grep -cF -- "da color temático a los seis placeholders (enmendado por #214 R18)', () => {" src/__tests__/consistency-classnames.test.ts   # fila 19: 0 → 1
  grep -cF -- "elimina el borde duplicado de los seis campos', () => {" src/__tests__/consistency-classnames.test.ts   # fila 20: 1 → 0
  grep -cF -- "elimina el borde duplicado de los siete campos (enmendado por #214 R18)', () => {" src/__tests__/consistency-classnames.test.ts   # fila 20: 0 → 1
  grep -cF -- "[join('screens', 'join-pet', 'index.tsx'), 1], // #214 R18" src/__tests__/consistency-classnames.test.ts   # fila 21: 0 → 1
  grep -cF -- "[join('screens', 'profile', 'index.tsx'), 3 + 1 + 4 - 7]," src/__tests__/consistency-classnames.test.ts   # fila 21: 1 → 0
  grep -cF -- "[join('screens', 'profile', 'index.tsx'), 3 + 1 + 4 - 7 + 1], // #41 R9; #168 R6; #173 R10: ProfileTile; #214 R4: ProfileWideTile" src/__tests__/consistency-classnames.test.ts   # fila 21: 0 → 1
  grep -cF -- "(enmendado por #220 R15) (enmendado por #214 R4, R18)', (path, count) => {" src/__tests__/consistency-classnames.test.ts   # fila 21: 0 → 1
  grep -cF -- 'directUses.reduce' src/__tests__/consistency-classnames.test.ts   # fila 22: 1 → 1
  grep -cF -- '+ 2 // #214 R4, R18' src/__tests__/consistency-classnames.test.ts   # fila 22: 0 → 2
  grep -cF -- "(enmendado por #220 R15) (enmendado por #214 R4, R18)', () => {" src/__tests__/consistency-classnames.test.ts   # fila 22: 0 → 2
  grep -cF -- '+ 2 // #214 R4, R18' src/__tests__/consistency-classnames.test.ts   # fila 23: 0 → 2
  grep -cF -- '(enmendado por #220 R15) (enmendado por #214 R4, R18)' src/__tests__/consistency-classnames.test.ts   # fila 23: 0 → 3
  grep -cF -- 'toHaveLength(5); // (enmendado por #190 R13) // #198 R2' src/__tests__/consistency-classnames.test.ts   # fila 23: 1 → 1
  grep -cF -- "'screens/join-pet/index.tsx': 2, // #214 R18, R20" src/__tests__/consistency-classnames.test.ts   # fila 24: 0 → 1
  grep -cF -- "'screens/pet-invite/index.tsx': 1, // #214 R15" src/__tests__/consistency-classnames.test.ts   # fila 24: 0 → 1
  grep -cF -- "'screens/pet-members/index.tsx': 1, // #214 R13" src/__tests__/consistency-classnames.test.ts   # fila 24: 0 → 1
  grep -cF -- "fichero a fichero (enmendado por #177 R10) (enmendado por #201 R13) (enmendado por #214 R13, R15, R18, R20)', () => {" src/__tests__/consistency-classnames.test.ts   # fila 24: 0 → 1
  grep -cF -- "'home-join-pet-button', // #214 R7" src/__tests__/consistency-classnames.test.ts   # fila 25: 0 → 1
  grep -cF -- "'member-leave-sheet-cancel', // #214 R17" src/__tests__/consistency-classnames.test.ts   # fila 25: 0 → 1
  grep -cF -- "'member-remove-sheet-cancel', // #214 R11" src/__tests__/consistency-classnames.test.ts   # fila 25: 0 → 1
  grep -cF -- "'pet-invite-copy', // #214 R15" src/__tests__/consistency-classnames.test.ts   # fila 25: 0 → 1
  grep -cF -- "'pet-members-leave', // #214 R16" src/__tests__/consistency-classnames.test.ts   # fila 25: 0 → 1
  grep -cF -- 'toBe(4 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1); //' src/__tests__/consistency-classnames.test.ts   # fila 25: 1 → 0
  grep -cF -- 'toBe(4 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 4); // #214 R7, R11, R15, R17' src/__tests__/consistency-classnames.test.ts   # fila 25: 0 → 1
  grep -cF -- "(enmendado por #203 R7) (enmendado por #214 R7, R11, R15, R16, R17)', () => {" src/__tests__/consistency-classnames.test.ts   # fila 25: 0 → 1
  grep -cF -- 'toHaveLength(44);' src/__tests__/canvas-foundations.test.ts   # fila 26: 1 → 0
  grep -cF -- 'toHaveLength(44 + 1); // #214 R23: expo-clipboard' src/__tests__/canvas-foundations.test.ts   # fila 26: 0 → 1
  grep -cF -- "#197 R22: no añade dependencias (enmendado por #214 R23)', () => {" src/__tests__/canvas-foundations.test.ts   # fila 26: 0 → 1
  grep -cF -- 'toHaveLength(44);' src/__tests__/zones-canvas-fidelity.test.ts   # fila 27: 1 → 0
  grep -cF -- 'toHaveLength(44 + 1); // #214 R23: expo-clipboard' src/__tests__/zones-canvas-fidelity.test.ts   # fila 27: 0 → 1
  grep -cF -- "#202 R25: package.json no añade dependencias (enmendado por #214 R23)', () => {" src/__tests__/zones-canvas-fidelity.test.ts   # fila 27: 0 → 1
  grep -cF -- "'screens/meal-schedule/index.tsx'], // #179 R6; #174 R12" src/__tests__/alerts-canvas-fidelity.test.ts   # fila 28: 1 → 0
  grep -cF -- "'screens/meal-schedule/index.tsx', 'screens/pet-members/index.tsx'], // #179 R6; #174 R12; #214 R12" src/__tests__/alerts-canvas-fidelity.test.ts   # fila 28: 0 → 1
  grep -cF -- "'screens/join-pet/index.tsx', // #214 R18" src/__tests__/alerts-canvas-fidelity.test.ts   # fila 28: 0 → 1
  grep -cF -- "(enmendado por #205 R16) (enmendado por #214 R12, R18)', ({ pattern, files }) => {" src/__tests__/alerts-canvas-fidelity.test.ts   # fila 28: 0 → 1
  grep -cF -- "'screens/join-pet/index.tsx', // #214 R18, R20" src/__tests__/profile-canvas-fidelity.test.ts   # fila 29: 0 → 1
  grep -cF -- "'screens/pet-invite/index.tsx', // #214 R14" src/__tests__/profile-canvas-fidelity.test.ts   # fila 29: 0 → 2
  grep -cF -- "'screens/pet-members/index.tsx', // #214 R13" src/__tests__/profile-canvas-fidelity.test.ts   # fila 29: 0 → 1
  grep -cF -- "(enmendado por #190 R13) (enmendado por #214 R13, R14, R18, R20)', () => {" src/__tests__/profile-canvas-fidelity.test.ts   # fila 29: 0 → 1
  grep -cF -- "'screens/join-pet/index.tsx', // #214 R18, R19" src/__tests__/profile-canvas-fidelity.test.ts   # fila 30: 0 → 1
  grep -cF -- "'screens/pet-invite/index.tsx', // #214 R14" src/__tests__/profile-canvas-fidelity.test.ts   # fila 30: 0 → 2
  grep -cF -- "'screens/pet-members/index.tsx', // #214 R9, R12, R13, R16" src/__tests__/profile-canvas-fidelity.test.ts   # fila 30: 0 → 1
  grep -cF -- "(enmendado por #198 R5) (enmendado por #214 R9, R12, R13, R14, R16, R18, R19)', () => {" src/__tests__/profile-canvas-fidelity.test.ts   # fila 30: 0 → 1
  grep -cF -- "literalId('pet-members-invite-cta'), 'w-full h-14 rounded-16 bg-accent', ['isDisabled={busy}']], // #214 R13" src/__tests__/chunky-cta-canvas-fidelity.test.ts   # fila 31: 0 → 1
  grep -cF -- "literalId('pet-invite-share'), 'w-full h-14 rounded-16 bg-accent', []], // #214 R15" src/__tests__/chunky-cta-canvas-fidelity.test.ts   # fila 31: 0 → 1
  grep -cF -- "literalId('join-pet-submit'), 'w-full h-14 rounded-16 bg-accent', []], // #214 R18" src/__tests__/chunky-cta-canvas-fidelity.test.ts   # fila 31: 0 → 1
  grep -cF -- "literalId('join-pet-go-home'), 'w-full h-14 rounded-16 bg-accent'," src/__tests__/chunky-cta-canvas-fidelity.test.ts   # fila 31: 0 → 1
  grep -cF -- "'geofence-editor-delete', 'home-join-pet-button', 'meal-time-edit-" src/__tests__/chunky-cta-canvas-fidelity.test.ts   # fila 32: 0 → 1
  grep -cF -- "'member-leave-sheet-cancel', 'member-remove-sheet-cancel', 'pairing-unpair-cancel', 'pet-invite-copy', 'pet-members-leave', 'reminders-delete-cancel'" src/__tests__/chunky-cta-canvas-fidelity.test.ts   # fila 32: 0 → 1
  grep -cF -- "'welcome-have-account']; // #214 R7, R11, R15, R16, R17" src/__tests__/chunky-cta-canvas-fidelity.test.ts   # fila 32: 0 → 1
  grep -cF -- "'screens/home/index.tsx': 1 + 1, // #214 R7" src/__tests__/chunky-cta-canvas-fidelity.test.ts   # fila 33: 0 → 1
  grep -cF -- "'screens/join-pet/index.tsx': 2, // #214 R18, R20" src/__tests__/chunky-cta-canvas-fidelity.test.ts   # fila 33: 0 → 1
  grep -cF -- "'screens/pet-invite/index.tsx': 2, // #214 R15" src/__tests__/chunky-cta-canvas-fidelity.test.ts   # fila 33: 0 → 1
  grep -cF -- "'screens/pet-members/index.tsx': 6, // #214 R11, R13, R16, R17" src/__tests__/chunky-cta-canvas-fidelity.test.ts   # fila 33: 0 → 1
  grep -cF -- "(enmendado por #202 R15) (enmendado por #214 R13, R15, R18, R20)', (path, anchor, classes, keeps) => {" src/__tests__/chunky-cta-canvas-fidelity.test.ts   # fila 34: 0 → 1
  grep -cF -- "(enmendado por #189 R13) (enmendado por #214 R13, R15, R18, R20)', (path, anchor) => {" src/__tests__/chunky-cta-canvas-fidelity.test.ts   # fila 35: 0 → 1
  grep -cF -- "el inventario de Button con bg-accent está cerrado (enmendado por #214 R13, R15, R18, R20)', () => {" src/__tests__/chunky-cta-canvas-fidelity.test.ts   # fila 36: 0 → 1
  grep -cF -- "(enmendado por #203 R7) (enmendado por #214 R7, R11, R15, R16, R17)', () => {" src/__tests__/chunky-cta-canvas-fidelity.test.ts   # fila 37: 0 → 1
  grep -cF -- "(enmendado por #201 R13) (enmendado por #214 R13, R15, R18)', () => {" src/__tests__/chunky-cta-canvas-fidelity.test.ts   # fila 38: 0 → 1
  grep -cF -- 'toBe(8 + 15 + 1 + 1 + 1 + 1 + 1 + 1 + 1);' src/__tests__/chunky-cta-canvas-fidelity.test.ts   # fila 39: 1 → 0
  grep -cF -- 'toBe(8 + 15 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 4);' src/__tests__/chunky-cta-canvas-fidelity.test.ts   # fila 39: 0 → 1
  grep -cF -- 'toBe(5 + 11 + 1 + 1 - 1 - 1);' src/__tests__/chunky-cta-canvas-fidelity.test.ts   # fila 39: 1 → 0
  grep -cF -- 'toBe(5 + 11 + 1 + 1 - 1 - 1 + 4);' src/__tests__/chunky-cta-canvas-fidelity.test.ts   # fila 39: 0 → 1
  grep -cF -- "(enmendado por #196 R6) (enmendado por #214 R13, R15, R18, R20)', () => {" src/__tests__/chunky-cta-canvas-fidelity.test.ts   # fila 39: 0 → 1
  grep -cF -- 'toBe(10 + 1 + 1); // #189 R13; #203 R7: +1' src/__tests__/chunky-cta-canvas-fidelity.test.ts   # fila 40: 1 → 0
  grep -cF -- 'toBe(10 + 1 + 1 + 4); // #189 R13; #203 R7: +1 // #214 R7, R11, R15, R17' src/__tests__/chunky-cta-canvas-fidelity.test.ts   # fila 40: 0 → 1
  grep -cF -- "(enmendado por #203 R7) (enmendado por #214 R7, R11, R15, R17)', () => {" src/__tests__/chunky-cta-canvas-fidelity.test.ts   # fila 40: 0 → 1
  grep -cF -- "'screens/join-pet/index.tsx' ? 2 : 1])), 'screens/map/index.tsx': 1 }); // #201 R13" src/__tests__/chunky-cta-canvas-fidelity.test.ts   # fila 41: 0 → 1
  grep -cF -- "(enmendado por #201 R13) (enmendado por #214 R13, R15, R18, R20)', () => {" src/__tests__/chunky-cta-canvas-fidelity.test.ts   # fila 41: 0 → 1
  grep -cF -- '+ 1 + 1 + 1 + 1 + 11); // #214 R7, R11, R13, R15, R16, R17, R18, R20 (+11)' src/__tests__/chunky-cta-canvas-fidelity.test.ts   # fila 42: 0 → 1
  grep -cF -- "(enmendado por #205 R13) (enmendado por #214 R7, R11, R13, R15, R16, R17, R18, R20)', () => {" src/__tests__/chunky-cta-canvas-fidelity.test.ts   # fila 42: 0 → 1
  grep -cF -- "path === 'screens/add-pet/index.tsx' || path === 'screens/join-pet/index.tsx' ? 2 : 1" src/__tests__/chunky-cta-canvas-fidelity.test.ts   # fila 43: 0 → 3
  grep -cF -- "path === 'screens/add-pet/index.tsx' ? 2 : 1" src/__tests__/chunky-cta-canvas-fidelity.test.ts   # fila 43: 3 → 0
  grep -cF -- "path === 'screens/forgot/index.tsx' || path === 'screens/add-pet/index.tsx' || path === 'screens/join-pet/index.tsx' ? 2 : 1" src/__tests__/chunky-cta-canvas-fidelity.test.ts   # fila 43: 0 → 1
  grep -cF -- "['screens/home/index.tsx', 1], ['screens/pet-invite/index.tsx', 1], ['screens/pet-members/index.tsx', 3]" src/__tests__/chunky-cta-canvas-fidelity.test.ts   # fila 43: 0 → 1
  grep -cF -- "(enmendado por #201 R13) (enmendado por #214 R7, R11, R13, R15, R16, R17, R18, R20)', () => {" src/__tests__/chunky-cta-canvas-fidelity.test.ts   # fila 43: 0 → 1
  grep -cF -- "[...neutralIds, 'add-meal-time-button'].sort()" src/__tests__/chunky-cta-canvas-fidelity.test.ts   # fila 44: 1 → 0
  grep -cF -- "[...neutralIds, 'add-meal-time-button', 'home-join-pet-button', 'member-leave-sheet-cancel', 'member-remove-sheet-cancel', 'pet-invite-copy', 'pet-members-leave'].sort()" src/__tests__/chunky-cta-canvas-fidelity.test.ts   # fila 44: 0 → 1
  grep -cF -- "(enmendado por #196 R5) (enmendado por #214 R7, R11, R13, R15, R16, R17, R18, R20)', (style, ids) => {" src/__tests__/chunky-cta-canvas-fidelity.test.ts   # fila 44: 0 → 1
  grep -cF -- '(enmendado por #214 R7, R11, R13, R15, R16, R17, R18, R20)' src/__tests__/chunky-cta-canvas-fidelity.test.ts   # fila 44: 0 → 3
  grep -cF -- '(enmendado por #214 R13, R15, R18, R20)' src/__tests__/chunky-cta-canvas-fidelity.test.ts   # fila 45: 0 → 5
  grep -cF -- 'export const R21_PET_MEMBERS: UseRow[] = [ // #214 R22' src/__tests__/ui-copy-table.ts   # fila 46: 0 → 1
  grep -cF -- '  ...R21_PET_MEMBERS, // #214 R22' src/__tests__/ui-copy-table.ts   # fila 46: 0 → 1
  grep -cF -- '  ...R18_DATE_FIELD,' src/__tests__/ui-copy-table.ts   # fila 46: 1 → 1
  grep -cF -- 'R16_WELCOME, R17_EDIT_PROFILE, R18_DATE_FIELD, R21_PET_MEMBERS, // #214 R22' src/__tests__/ui-copy-table.ts   # fila 46: 0 → 1
  grep -cF -- "cuadra ALL_USES con la suma de sus bloques (enmendado por #220 R16)', () => {" src/__tests__/ui-copy-table.ts   # fila 46: 1 → 0
  grep -cF -- "cuadra ALL_USES con la suma de sus bloques (enmendado por #220 R16) (enmendado por #214 R22)', () => {" src/__tests__/ui-copy-table.ts   # fila 46: 0 → 1
  grep -cF -- '  R21_PET_MEMBERS,' src/__tests__/ui-language.test.ts   # fila 47: 0 → 1
  grep -cF -- '+ 1 // #220 R16: components/date-field.tsx' src/__tests__/ui-language.test.ts   # fila 47: 1 → 1
  grep -cF -- '+ 3 // #214 R22: screens/pet-members, screens/pet-invite y screens/join-pet' src/__tests__/ui-language.test.ts   # fila 47: 0 → 1
  grep -cF -- "(enmendado por #199 R1) (enmendado por #220 R16)', () => {" src/__tests__/ui-language.test.ts   # fila 47: 1 → 0
  grep -cF -- "(enmendado por #199 R1) (enmendado por #220 R16) (enmendado por #214 R22)', () => {" src/__tests__/ui-language.test.ts   # fila 47: 0 → 1
  grep -cF -- '        + 5 - 2, // #220 R16' src/providers/__tests__/language-provider.test.tsx   # fila 48: 1 → 0
  grep -cF -- '        + 5 - 2 // #220 R16' src/providers/__tests__/language-provider.test.tsx   # fila 48: 0 → 1
  grep -cF -- '        + 51, // #214 R22' src/providers/__tests__/language-provider.test.tsx   # fila 48: 0 → 1
  grep -cF -- "(enmendado por #202 R18) (enmendado por #220 R16)', () => {" src/providers/__tests__/language-provider.test.tsx   # fila 48: 1 → 0
  grep -cF -- "(enmendado por #202 R18) (enmendado por #220 R16) (enmendado por #214 R22)', () => {" src/providers/__tests__/language-provider.test.tsx   # fila 48: 0 → 1
  grep -cF -- "solo proveedor y hook mencionan clearPet en producción', () => {" src/hooks/use-pet-selection.test.tsx   # fila 49: 1 → 0
  grep -cF -- "solo proveedor, hook y Familia mencionan clearPet en producción (enmendado por #214 R17)', () => {" src/hooks/use-pet-selection.test.tsx   # fila 49: 0 → 1
  grep -cF -- "expect(writers).toEqual(['hooks/use-pet-selection.ts', 'providers/selected-pet-provider.tsx']);" src/hooks/use-pet-selection.test.tsx   # fila 49: 1 → 0
  grep -cF -- "'providers/selected-pet-provider.tsx', 'screens/pet-members/index.tsx']); // #214 R17" src/hooks/use-pet-selection.test.tsx   # fila 49: 0 → 1
  grep -cF -- "import { Bell, Camera, FileText, Map as MapIcon, Plus, Wifi } from 'reicon-react-native';" src/screens/profile/index.tsx   # P1: 1 → 0
  grep -cF -- "import { Bell, Camera, ChevronRight, FileText, Key, Map as MapIcon, Plus, Users, Wifi } from 'reicon-react-native';" src/screens/profile/index.tsx   # P2: 0 → 1
  grep -cF -- "useThemeColors(['category-blue-strong', 'category-green-strong', 'category-amber-strong', 'category-violet-strong', 'accent-strong', 'accent-foreground']);" src/screens/profile/index.tsx   # P3: 1 → 0
  grep -cF -- "const [blue, green, amber, violet, rose, accentStrong, accentForeground] = useThemeColors(['category-blue-strong', 'category-green-strong', 'category-amber-strong', 'category-violet-strong', 'category-rose-strong', 'accent-strong', 'accent-foreground']);" src/screens/profile/index.tsx   # P4: 0 → 1
  grep -cF -- '#214' src/screens/profile/index.tsx   # P5: 0 → 0
  grep -cF -- '#214' src/screens/home/index.tsx   # P6: 0 → 0
  grep -cF -- 'backgroundStyle={{ backgroundColor: surface }}' src/screens/pairing/index.tsx   # P7: 1 → 1
  grep -cF -- 'backgroundStyle={{ backgroundColor: surface }}' src/screens/reminders/index.tsx   # P8: 1 → 1
  grep -cF -- 'items-center gap-3 bg-surface px-5 pb-9 pt-3' src/screens/pairing/index.tsx   # P9: 1 → 1
  grep -cF -- 'items-center gap-3 bg-surface px-5 pb-9 pt-3' src/screens/reminders/index.tsx   # P10: 1 → 1
  grep -cF -- '<BottomSheet index=' src/screens/pet-members/index.tsx   # P11: ENOENT (fichero nuevo) → 2
  grep -cF -- 'backgroundStyle={{ backgroundColor: surface }}' src/screens/pet-members/index.tsx   # P12: ENOENT (fichero nuevo) → 2
  grep -cF -- "const [surface] = useThemeColors(['surface']);" src/screens/pet-members/index.tsx   # P13: ENOENT (fichero nuevo) → 1
  grep -cF -- 'items-center gap-3 bg-surface px-5 pb-9 pt-3' src/screens/pet-members/index.tsx   # P14: ENOENT (fichero nuevo) → 2
  grep -cF -- '<Button testID="meal-schedule-retry" onPress={retryAll}>' src/screens/meal-schedule/index.tsx   # P15: 1 → 1
  grep -cF -- '<Button testID="pet-members-retry" onPress={retryAll}>' src/screens/pet-members/index.tsx   # P16: ENOENT (fichero nuevo) → 1
  grep -cF -- '"expo-clipboard"' package.json   # P17: 0 → 1
  grep -cF -- "jest.mock('expo-clipboard', () => ({ setStringAsync: jest.fn() }));" test/jest-setup.js   # P18: 0 → 1
  grep -cF -- 'virtual' test/jest-setup.js   # P19: 0 → 0
  grep -cF -- "'members.leaveBodyNoOwner'" src/i18n/catalog.ts   # P20: 0 → 2
  Dos anclas más que usa la receta (no son de §7.1; medidas en H0):
  grep -cF -- "'welcome.pingoGreeting'" src/i18n/catalog.ts   # R22: 2 → 2 (última clave de cada bloque; las 51 nuevas van detrás)
  grep -cF -- "const [surface] = useThemeColors(['surface']);" src/screens/pairing/index.tsx   # R11: 1 → 1 (modelo de P13; no se toca)
Un `grep -c` cuenta líneas, no apariciones.

Base de tests (T0): mídela tú, una sola vez, tras las anclas y antes del primer test. Primero `pgrep -f '[n]ode_modules/(.bin/jest|jest-worker)'` y `pgrep -f '[i]nit.sh'`, cada uno en su propio comando: los dos deben salir vacíos (si no, espera y vuelve a mirar; nunca esperes e `init.sh` en el mismo comando). Después, sin pipe:
  cd /home/claude/sites/Pet-Tracker-wt-214/mobile-pet-tracker && bun run test > ../progress/base-214.log 2>&1; echo exit=$?
Pega en el reporte el `exit=`, la línea `Test Suites:` y la línea `Tests:`. Antes de darla por buena, `grep -c 'SIGKILL' ../progress/base-214.log` y `grep -c 'failed to run' ../progress/base-214.log` deben dar 0: una suite tumbada por SIGKILL cuenta 0 tests y la base sale corta. Si alguno no da 0, repite la corrida con los dos pgreps vacíos (no sumes a mano). Un rojo en T0 de una suite que no es tuya: aplica «Flakes de carga conocidos» (aislada; verde aislado se anota y se sigue). Rojo aislado en T0, PARA: la base no está verde. El aviso final de worker force-exit es preexistente.
Úsala como T0 de la cuenta encadenada: la cifra de tests de cada commit = anterior + sus `it` añadidos (cada fila de `it.each` cuenta) - los reemplazados; anótalo. Si una corrida completa da otra cifra, reconcíliala antes de seguir.

Cadena (tasks.md manda en el contenido de cada paso y en el orden; aquí van los ficheros, las corridas y los mensajes). Reglas de toda la cadena:
  - Cada R es un par `# -- R<n> test --` / `# -- R<n> feat --` (más `refactor` opcional con todo verde). Tras cada commit, corre los ficheros del paso con la forma de «Jest de un fichero» (`bunx jest --runTestsByPath '<ruta>' '<ruta>' … --testTimeout=30000` desde mobile-pet-tracker/, con los dos pgreps vacíos antes), pega su línea `Tests:` y la cuenta encadenada.
  - Rojo esperado en un (1): todos los `it` nuevos del R fallan por aserción, salvo los de «Nacen verdes»; y, en los ficheros corridos, como mucho las filas de «Filas en vuelo» tras ese (1). Un `it` nuevo que pasa y no está en «Nacen verdes», PARA. Una fila de §7.1 que entra y no se pone roja en su (1) no es parada: anótala (fila, título del `it`) y sigue; la prueba su sonda.
  - Verde en un (2): todos los `it` del R en verde, y las filas que el paso pone verdes también; en los ficheros corridos solo pueden seguir rojas las filas en vuelo tras ese (2). Cualquier otro rojo, PARA (salvo «Flakes de carga conocidos»).
  - `git add` con estas rutas exactas (relativas a mobile-pet-tracker/), y la cadena acaba en su `git commit -m`.
  - Excepción de tasks.md al «un commit por R»: el par de utils es uno solo para R9, R12 y R14, con el mensaje que da abajo.
  - Donde un paso no da `add:`, el (1) añade solo el fichero de test que tocó y el (2) solo el fichero de producción que tocó. Antes de `git add`, `git diff --name-only` debe listar solo esos ficheros.

  # -- Paso 0 -- Hecho por el leader: (1) #218 está en `dev` y (2) el merge de `origin/dev` está en 8e9bff38. No lo repitas. Su punto (3) son las anclas T0 de arriba.

  # -- R23 test -- src/utils/__tests__/pet-members.test.ts (nuevo) con solo `it('R23: expo-clipboard es dependencia declarada', …)`, sin importar `../pet-members` ni `expo-clipboard`. Corre 'src/utils/__tests__/pet-members.test.ts'. Rojo: ese `it`. add: src/utils/__tests__/pet-members.test.ts. Mensaje: `test(mobile): #214 expo-clipboard dependency (R23)`.
  # -- R23 feat -- Todo lo de «Dependencia nueva»: instalación, comprobación del diff, doble en test/jest-setup.js y filas 26 y 27. Corre 'src/utils/__tests__/pet-members.test.ts' 'src/__tests__/canvas-foundations.test.ts' 'src/__tests__/zones-canvas-fidelity.test.ts'. Verde entero. Después `test ! -e .expo/types/router.d.ts`, `bunx tsc --noEmit` y lint. add: package.json bun.lock test/jest-setup.js src/__tests__/canvas-foundations.test.ts src/__tests__/zones-canvas-fidelity.test.ts. Mensaje: `chore(mobile): #214 add expo-clipboard (R23)`.

  # -- R1 test -- src/api/__tests__/pet-members.test.ts (nuevo):
    - un `it` `R1:` por rama de las seis funciones, con función y rama en el título (p. ej. `'R1: createPetInvite 409 PET_MEMBERS_LIMIT da members-limit'`);
    - `'R1: ninguna función toca fetch sin baseUrl'`: por función, `fetchFn` sin llamar **y** resultado `{ kind: 'missing-config' }`;
    - `'R1: cada función llama al método y la ruta del contrato'`.
    En el mismo commit va el esqueleto src/api/pet-members.ts: los cuatro tipos de R1 y las seis funciones con la firma de R1, todas devolviendo `{ kind: 'error' }` sin tocar `fetchFn`. Corre 'src/api/__tests__/pet-members.test.ts'. Rojo: todos los `R1:`. add: src/api/pet-members.ts src/api/__tests__/pet-members.test.ts. Mensaje: `test(mobile): #214 pet members api client (R1)`.
  # -- R1 feat -- Las seis funciones sobre `getJson`/`postJson`/`deleteJson`/`readJson` de src/api/http.ts, que no se toca. Corre el mismo fichero. add: src/api/pet-members.ts. Mensaje: `feat(mobile): #214 pet members api client (R1)`.

  # -- R2 test -- `it('R2: memberKeys e inviteKeys no comparten prefijo con petKeys', …)` en src/api/__tests__/pet-members.test.ts. Sin esqueleto, `memberKeys.list` lanza TypeError y eso no vale como rojo. Por eso el commit lleva en src/api/query-keys.ts `memberKeys` e `inviteKeys` con `list: (petId: string) => ['', petId] as const`: el rojo es el `toEqual`. Corre 'src/api/__tests__/pet-members.test.ts'. Rojo: el `it` de R2. add: src/api/query-keys.ts src/api/__tests__/pet-members.test.ts. Mensaje: `test(mobile): #214 member and invite query keys (R2)`.
  # -- R2 feat -- Los dos objetos literales de R2. Corre 'src/api/__tests__/pet-members.test.ts' 'src/api/__tests__/query-keys.test.ts'. El segundo no se toca y debe seguir verde. add: src/api/query-keys.ts. Mensaje: `feat(mobile): #214 member and invite query keys (R2)`.

  # -- R9, R12, R14 (utils) test -- En src/utils/__tests__/pet-members.test.ts, los seis `it` de utils de traceability.md:
    - R9: dos;
    - R12: dos. `'R12: inviteDateParts cruza mes y año'` es un solo `it` que recorre la tabla de tres filas de R12 (su título no lleva `%s`);
    - R14: dos.
    En el mismo commit va el esqueleto src/utils/pet-members.ts: `memberInitials` y `formatInviteCode` devuelven `''`, e `inviteDateParts` devuelve `{ date: '', time: '' }`. Corre 'src/utils/__tests__/pet-members.test.ts'. Rojo: los seis, con el de R23 en verde. add: src/utils/pet-members.ts src/utils/__tests__/pet-members.test.ts. Mensaje: `test(mobile): #214 pet members utils (R9, R12, R14)`.
  # -- R9, R12, R14 (utils) feat -- Las tres funciones según R9, R12 y R14. Corre el mismo fichero. add: src/utils/pet-members.ts. Mensaje: `feat(mobile): #214 pet members utils (R9, R12, R14)`.

  # -- R22 (catálogo) test -- Solo la fila 48: el `+ 51` y el título de `#194 R1` en src/providers/__tests__/language-provider.test.tsx. Aquí no entra el `describe('#214 R22: copy de Familia')`. Corre 'src/providers/__tests__/language-provider.test.tsx'. Rojo: `#194 R1`. add: ese fichero. Mensaje: `test(mobile): #214 pet members catalog keys (R22)`.
  # -- R22 (catálogo) feat -- Las 51 claves de design.md §5 (literales de §5 y §5.1) en src/i18n/catalog.ts. En cada bloque `en` y `es` van al final, tras `'welcome.pingoGreeting'`, en el orden de la tabla. Corre 'src/providers/__tests__/language-provider.test.tsx' 'src/__tests__/ui-language.test.ts'. El segundo no se toca: su `#194 R5` y su consistencia entre idiomas ya leen el catálogo nuevo. Si un literal nuevo coincide con un literal entero de una pantalla existente, ese rojo está fuera de §7.1: PARA. add: src/i18n/catalog.ts. Mensaje: `feat(mobile): #214 pet members catalog keys (R22)`.

  # -- R3 test -- `it('R3: registra members, invite y join-pet justo antes de edit-profile sin cabecera nativa', …)` en un `describe('#214 R3: rutas de Familia', …)` de src/app/__tests__/layout.test.tsx. Van también las filas 1–4 (layout) y la 5 (detail-stack.guard). Corre 'src/app/__tests__/layout.test.tsx' 'src/app/__tests__/detail-stack.guard.test.tsx'. Rojo: el `it` de R3 y las filas 1–5. Después, la corrida completa r03 (ver «Corridas completas»). add: los dos ficheros. Mensaje: `test(mobile): #214 pet members routes and stack (R3)`.
  # -- R3 feat -- Las tres rutas delgadas de R3, siguiendo el patrón de src/app/pets/[petId]/docs-upload.tsx:
    - src/app/pets/[petId]/members.tsx
    - src/app/pets/[petId]/invite.tsx
    - src/app/join-pet.tsx

    Tres pantallas esqueleto con su export default:
    - src/screens/pet-members/index.tsx: `PetMembersScreen({ petId })` con la View `screen-pet-members`;
    - src/screens/pet-invite/index.tsx: `PetInviteScreen` con `screen-pet-invite`;
    - src/screens/join-pet/index.tsx: `JoinPetScreen` con `screen-join-pet`.

    Y los tres `Stack.Screen` en src/app/_layout.tsx. Corre los dos ficheros de R3. Verde entero. add: las tres rutas, las tres pantallas y src/app/_layout.tsx. Mensaje: `feat(mobile): #214 pet members routes and stack (R3)`.

  # -- R8 test -- src/screens/pet-members/index.test.tsx (nuevo): los `it` de R8, con los tres `it.each(['pet', 'members', 'me'] as const)`, cada uno haciendo fallar solo la query de su fila. Corre 'src/screens/pet-members/index.test.tsx'. Rojo: todos (el esqueleto no pinta nada). add: ese fichero. Mensaje: `test(mobile): #214 pet members loading and error (R8)`.
  # -- R8 feat -- En la pantalla de Familia:
    - las tres queries;
    - el skeleton;
    - el error con `retryAll` y la etiqueta literal de P16, sin labio;
    - la cabecera con `titlePlaceholder`.

    Corre el mismo fichero. add: src/screens/pet-members/index.tsx. Mensaje: `feat(mobile): #214 pet members loading and error (R8)`.

  # -- R9 test -- Los tres `it` de R9 de la pantalla y la fila 30 (src/__tests__/profile-canvas-fidelity.test.ts). Corre 'src/screens/pet-members/index.test.tsx' 'src/__tests__/profile-canvas-fidelity.test.ts'. Rojo: los dos primeros `it` de R9 y la fila 30. Nace verde `'R9: ningún texto de la pantalla contiene el correo de getMe'`. add: los dos ficheros. Mensaje: `test(mobile): #214 member rows (R9)`.
  # -- R9 feat -- Filas, avatares, `MEMBER_AVATAR_SLOTS` y píldoras: el ternario de llamadas `t('…')` directas. Corre 'src/screens/pet-members/index.test.tsx'. add: la pantalla. Mensaje: `feat(mobile): #214 member rows (R9)`.

  # -- R10 test -- Los tres `it` de R10 y la fila 15 (src/__tests__/design-drift.test.ts). Corre 'src/screens/pet-members/index.test.tsx' 'src/__tests__/design-drift.test.ts'. Rojo: `'R10: el dueño ve Quitar…'` y la fila 15. Nacen verdes los otros dos de R10. add: los dos ficheros. Mensaje: `test(mobile): #214 owner view (R10)`.
  # -- R10 feat -- Intro de dueño y «Quitar» condicionado. Corre la pantalla. Mensaje: `feat(mobile): #214 owner view (R10)`.

  # -- R11 test -- Los ocho `it` de R11, con el doble de `BottomSheet` como el de src/screens/pairing/index.test.tsx. Van también las filas:
    - 13 y 14 (src/__tests__/sheet-surface-background.test.ts);
    - 25 (src/__tests__/consistency-classnames.test.ts);
    - 32, 33, 37, 40, 42, 43 y 44 (src/__tests__/chunky-cta-canvas-fidelity.test.ts).

    Corre 'src/screens/pet-members/index.test.tsx' 'src/__tests__/sheet-surface-background.test.ts' 'src/__tests__/consistency-classnames.test.ts' 'src/__tests__/chunky-cta-canvas-fidelity.test.ts'. Rojo: los ocho `it` y esas diez filas. add: los cuatro ficheros. Mensaje: `test(mobile): #214 remove member sheet (R11)`.
  # -- R11 feat -- Hoja de quitar (receta de «Hojas de R11 y R17») y llamada a la API. Corre 'src/screens/pet-members/index.test.tsx' 'src/__tests__/sheet-surface-background.test.ts'. Se espera que la fila 13 pase a verde aquí (adelanto de verde: anótalo). La 14 sigue roja hasta R17. Mensaje: `feat(mobile): #214 remove member sheet (R11)`.

  # -- R12 test -- Los siete `it` de R12 de la pantalla y la fila 28 (src/__tests__/alerts-canvas-fidelity.test.ts). Corre 'src/screens/pet-members/index.test.tsx' 'src/__tests__/alerts-canvas-fidelity.test.ts'. Rojo: los cuatro sin marca y la fila 28. Nacen verdes:
    - `'R12: sin invitaciones no hay sección'`
    - `'R12: si la lista falla no hay sección'`
    - `'R12: family no pide invitaciones'`

    add: los dos ficheros. Mensaje: `test(mobile): #214 pending invites and revoke (R12)`.
  # -- R12 feat -- La query de invitaciones con `enabled` solo para el dueño, las filas y revocar. Corre la pantalla. Mensaje: `feat(mobile): #214 pending invites and revoke (R12)`.

  # -- R16 test -- Los tres `it` de R16. Corre la pantalla. Rojo: `'R16: family ve la nota del dueño y Salir de esta mascota'`. Nacen verdes `'R16: sin dueño en la lista no hay nota'` y `'R16: el dueño no ve Salir'`. Mensaje: `test(mobile): #214 family view (R16)`.
  # -- R16 feat -- En la vista de familia:
    - avatar de la mascota;
    - intro;
    - nota del dueño;
    - hint;
    - `pet-members-leave`, que borra el aviso y abre el sheet. El sheet en sí llega en R17.

    Corre la pantalla. Mensaje: `feat(mobile): #214 family view (R16)`.

  # -- R17 test -- Los siete `it` de R17, con el array de orden de las cinco llamadas, y la fila 49 (src/hooks/use-pet-selection.test.tsx). Corre 'src/screens/pet-members/index.test.tsx' 'src/hooks/use-pet-selection.test.tsx'. Rojo: los siete `it` y la fila 49. Después, la corrida completa r17. add: los dos ficheros. Mensaje: `test(mobile): #214 leave pet sheet (R17)`.
  # -- R17 feat -- Hoja de salir y secuencia de limpieza. Corre 'src/screens/pet-members/index.test.tsx' 'src/__tests__/sheet-surface-background.test.ts' 'src/hooks/use-pet-selection.test.tsx'. Verdes las filas 13, 14 y 49. Mensaje: `feat(mobile): #214 leave pet sheet (R17)`.

  # -- R13 test -- Los siete `it` de R13 y el `it.each` de cinco filas `'R13: pulsar %s borra el aviso anterior'`. Cada fila:
    1. aserta primero `screen.getByTestId('pet-members-action-error')`;
    2. pulsa el botón;
    3. aserta `queryByTestId('pet-members-action-error')` `null`.

    Van también las filas de §7.1:
    - 16 (design-drift);
    - 17 y 24 (consistency-classnames);
    - 29 (profile-canvas-fidelity);
    - 31, 34, 35, 36, 38, 39, 41 y 45 (chunky-cta).

    Corre 'src/screens/pet-members/index.test.tsx' 'src/__tests__/design-drift.test.ts' 'src/__tests__/consistency-classnames.test.ts' 'src/__tests__/profile-canvas-fidelity.test.ts' 'src/__tests__/chunky-cta-canvas-fidelity.test.ts'. Rojo: los `it` de R13, las doce filas que entran y las que ya estaban en vuelo en esos ficheros (15, 25, 30, 32, 33, 37, 40, 42, 43 y 44). Puede nacer verde la fila `pet-members-leave` del `it.each`, porque R16 ya borra el aviso: si pasa, anótala como nacida verde. add: los cinco ficheros. Mensaje: `test(mobile): #214 create invite (R13)`.
  # -- R13 feat -- Nota, CTA, `actionError` en los cinco botones y `router.push` con los parámetros de R13. Corre la pantalla. Mensaje: `feat(mobile): #214 create invite (R13)`.

  # -- R14 test -- src/screens/pet-invite/index.test.tsx (nuevo) con los tres `it` de R14. Corre 'src/screens/pet-invite/index.test.tsx'. Rojo: los dos primeros. Nace verde `'R14: sin código no ofrece compartir'`. add: ese fichero. Mensaje: `test(mobile): #214 invite screen content (R14)`.
  # -- R14 feat -- Cabecera, tarjeta de código, mensaje (`shareText`), nota de rol y estado inválido. Corre el mismo fichero. add: src/screens/pet-invite/index.tsx. Mensaje: `feat(mobile): #214 invite screen content (R14)`.

  # -- R15 test -- Los cuatro `it` de R15, con el `beforeEach` de «Dependencia nueva» (`Clipboard` por defecto resuelto) y `jest.spyOn(Share, 'share')`. Corre 'src/screens/pet-invite/index.test.tsx'. Rojo: Compartir y Copiar. Nacen verdes `'R15: un Share rechazado no rompe la pantalla'` y `'R15: si copiar falla la etiqueta no cambia'`. Mensaje: `test(mobile): #214 share and copy invite (R15)`.
  # -- R15 feat -- `Share.share({ message: shareText })` y `Clipboard.setStringAsync(formatInviteCode(code))`. La etiqueta cambia solo cuando la promesa resuelve. Corre el mismo fichero. Mensaje: `feat(mobile): #214 share and copy invite (R15)`.

  # -- R18 test -- src/screens/join-pet/index.test.tsx (nuevo) con los tres `it` de R18, y las filas 19 a 23 (src/__tests__/consistency-classnames.test.ts). Corre 'src/screens/join-pet/index.test.tsx' 'src/__tests__/consistency-classnames.test.ts'. Rojo: los tres `it`, las filas 19 a 23 y las que ya estaban en vuelo en ese fichero (17, 24 y 25). add: los dos ficheros. Mensaje: `test(mobile): #214 join pet form (R18)`.
  # -- R18 feat -- KAV, héroe con `PingRing` y `PingoFloat`, título, nota, input, hint y botón, con la única llamada de colores de «Colores». Corre 'src/screens/join-pet/index.test.tsx' 'src/__tests__/design-drift.test.ts' 'src/__tests__/consistency-classnames.test.ts' 'src/__tests__/alerts-canvas-fidelity.test.ts' 'src/__tests__/chunky-cta-canvas-fidelity.test.ts'. Se ponen verdes las filas 16, 19, 20, 28 y 38. add: src/screens/join-pet/index.tsx. Mensaje: `feat(mobile): #214 join pet form (R18)`.

  # -- R19 test -- Los siete `it` de R19 de Unirme y `it('R19: acceptInvite da el mismo kind con 404 y con 400', …)` en src/api/__tests__/pet-members.test.ts. Corre 'src/screens/join-pet/index.test.tsx' 'src/api/__tests__/pet-members.test.ts'. Rojo: los siete de la pantalla. Nace verde el de API, porque ya lo cumple R1. add: los dos ficheros. Mensaje: `test(mobile): #214 join pet errors (R19)`.
  # -- R19 feat -- El estado `JoinError`, el ternario literal de R19 y el borde. Editar borra el error. Corre 'src/screens/join-pet/index.test.tsx' 'src/__tests__/profile-canvas-fidelity.test.ts'. Verde la fila 30; la 29 sigue en vuelo. Mensaje: `feat(mobile): #214 join pet errors (R19)`.

  # -- R20 test -- Los tres `it` de R20. Corre la pantalla de Unirme. Rojo: los dos primeros. Nace verde `'R20: editar vuelve al formulario'`. Mensaje: `test(mobile): #214 already member state (R20)`.
  # -- R20 feat -- La caja de ya miembro y `join-pet-go-home`, con el `onPress` literal. Corre 'src/screens/join-pet/index.test.tsx' 'src/__tests__/consistency-classnames.test.ts' 'src/__tests__/profile-canvas-fidelity.test.ts' 'src/__tests__/chunky-cta-canvas-fidelity.test.ts'. Se ponen verdes las filas 17, 24, 29, 31, 34, 35, 36, 39, 41 y 45. Mensaje: `feat(mobile): #214 already member state (R20)`.

  # -- R21 test -- Los dos `it` de R21. Corre la pantalla de Unirme. Rojo: el de orden. Nace verde `'R21: no selecciona hasta que la invalidación termina'`. Mensaje: `test(mobile): #214 accept invite (R21)`.
  # -- R21 feat -- Esta secuencia, en orden:
    1. `await queryClient.invalidateQueries({ queryKey: petKeys.list() })`;
    2. `selectPet(petId)`;
    3. `router.dismissTo('/home')`.

    Corre la pantalla. Mensaje: `feat(mobile): #214 accept invite (R21)`.

  # -- R4 test -- `describe('#214 R4: tarjeta de Familia', …)` con los dos `it` de R4 en src/screens/profile/index.test.tsx. Van también las filas 8 y 9 (profile) y la 18 (consistency-classnames). Corre 'src/screens/profile/index.test.tsx' 'src/__tests__/consistency-classnames.test.ts'. Rojo: el primer `it` de R4, las filas 8, 9 y 18, y las que ya estaban en vuelo (21, 22, 23 y 25). Nace verde `'R4: sin mascota no hay tarjeta de Familia'`. add: los dos ficheros. Mensaje: `test(mobile): #214 family card in profile (R4)`.
  # -- R4 feat -- En Perfil:
    - `ProfileWideTile`;
    - `profile-links-row-2` con `members-link`;
    - las líneas P2 y P4.

    Sin ningún comentario `#214` (P5). Corre 'src/screens/profile/index.test.tsx' 'src/__tests__/consistency-classnames.test.ts'. Se ponen verdes las filas 21, 22 y 23. Siguen en vuelo la 8 y la 9 (en Perfil), y la 18 y la 25 (en consistency-classnames). add: src/screens/profile/index.tsx. Mensaje: `feat(mobile): #214 family card in profile (R4)`.

  # -- R5 test -- `describe('#214 R5: subtítulo de Familia', …)` con los seis `it` de R5. Van también la fila 11 (doble de `../../api/pet-members` en Perfil) y la 12 (doble en 'src/app/(tabs)/__tests__/screens.test.tsx'). Corre 'src/screens/profile/index.test.tsx' 'src/app/(tabs)/__tests__/screens.test.tsx'. Rojo: los cuatro sin marca, las filas 11 y 12 si se ponen rojas, y la 8 y la 9 en vuelo. Nacen verdes `'R5: oculta el subtítulo mientras carga'` y `'R5: oculta el subtítulo si la lista falla'`. add: los dos ficheros. Mensaje: `test(mobile): #214 family card subtitle (R5)`.
  # -- R5 feat -- La query `memberKeys.list(pet.id)` (`enabled` solo con `pet`) y el subtítulo, sin `#214`. Corre los dos ficheros de R5. Verdes las filas 11 y 12. Mensaje: `feat(mobile): #214 family card subtitle (R5)`.

  # -- R6 test -- `describe('#214 R6: Unirme con código en Perfil', …)` con los dos `it` de R6, y la fila 10. Corre 'src/screens/profile/index.test.tsx'. Rojo: los dos `it` y las filas 8, 9 y 10. Después, la corrida completa r06. Mensaje: `test(mobile): #214 join with code in profile (R6)`.
  # -- R6 feat -- `joinPetLink` y sus dos filas (`profile-links-row-3` con mascota, `profile-links-row-1` sin ella), con la línea P2, que ya incluye `Key`. Sin `#214`. Corre 'src/screens/profile/index.test.tsx' 'src/__tests__/consistency-classnames.test.ts'. Se ponen verdes las filas 8, 9, 10 y 18; la 25 sigue en vuelo. Mensaje: `feat(mobile): #214 join with code in profile (R6)`.

  # -- R7 test -- `describe('#214 R7: Unirme con código en Inicio vacío', …)` con los dos `it` de R7 en src/screens/home/index.test.tsx, y las filas 6 y 7. Corre 'src/screens/home/index.test.tsx'. Rojo: los dos `it` y las filas 6 y 7. Mensaje: `test(mobile): #214 join with code on empty home (R7)`.
  # -- R7 feat -- `home-join-pet` como segundo hijo de `home-no-pets-screen`, sin `#214` (P6). Corre 'src/screens/home/index.test.tsx' 'src/__tests__/design-drift.test.ts' 'src/__tests__/consistency-classnames.test.ts' 'src/__tests__/chunky-cta-canvas-fidelity.test.ts' 'src/__tests__/home-pingo-phrase.test.ts' 'src/__tests__/no-pets-states.test.ts'. Todo verde: no queda ninguna fila en vuelo. add: src/screens/home/index.tsx. Mensaje: `feat(mobile): #214 join with code on empty home (R7)`. Después, la corrida completa r22.

  # -- R22 (tabla) test -- Un solo commit, sin producción:
    - el bloque `R21_PET_MEMBERS` y sus dos enmiendas (fila 46);
    - el import y el `+ 3` de `SCREEN_FILES` (fila 47);
    - el `describe('#214 R22: copy de Familia')` con sus tres `it`, al final de src/__tests__/ui-language.test.ts.

    Las filas de `R21_PET_MEMBERS` van en el orden del fuente, repetidas incluidas. Corre 'src/__tests__/ui-language.test.ts' 'src/__tests__/ui-copy-table.ts'. Nacen verdes los tres `it` y las filas 46 y 47. Si alguno da rojo, falta una fila o una llamada. Si la pantalla sigue la spec, corrige el dato de test; si no la sigue, PARA. add: src/__tests__/ui-copy-table.ts src/__tests__/ui-language.test.ts. Mensaje: `test(mobile): #214 register pet members copy (R22)`.

  # -- R24 -- Sin commit propio. Pasos de «Cierre»: primero las anclas «después», luego la corrida completa final, tsc y lint.

  # -- docs -- traceability.md (por cada `it`, el hash y el mensaje de su commit de test; por cada fila de §7.1, el commit en que entra) y el reporte, en un solo commit. add: ../specs/mobile-pet-members/traceability.md ../progress/impl_mobile-pet-members.md. Mensaje: `docs(mobile): #214 traceability and implementation report`.

Nacen verdes. Lista cerrada: 17 `it` de pantalla y API, más los tres `it` de R22 (tabla) y las filas 46 y 47. Cada uno va en el reporte con «nace verde: <motivo>» y su sonda (ver «Sondas»), que lo pone rojo:
  - R9: `'R9: ningún texto de la pantalla contiene el correo de getMe'`
  - R10: `'R10: family no ve Quitar, invitaciones ni CTA'` y `'R10: walker tampoco ve acciones de dueño'`
  - R12: `'R12: sin invitaciones no hay sección'`, `'R12: si la lista falla no hay sección'` y `'R12: family no pide invitaciones'`
  - R16: `'R16: sin dueño en la lista no hay nota'` y `'R16: el dueño no ve Salir'`
  - R14: `'R14: sin código no ofrece compartir'`
  - R15: `'R15: un Share rechazado no rompe la pantalla'` y `'R15: si copiar falla la etiqueta no cambia'`
  - R19: `'R19: acceptInvite da el mismo kind con 404 y con 400'`
  - R20: `'R20: editar vuelve al formulario'`
  - R21: `'R21: no selecciona hasta que la invalidación termina'`
  - R4: `'R4: sin mascota no hay tarjeta de Familia'`
  - R5: `'R5: oculta el subtítulo mientras carga'` y `'R5: oculta el subtítulo si la lista falla'`

  Posible: la fila `pet-members-leave` del `it.each` de R13.

Filas en vuelo. Filas de §7.1 con su rojo esperado tras cada commit; solo se listan los pasos que cambian el conjunto:
  - tras R3 (1): 1–5. Tras R3 (2): ninguna.
  - tras R9 (1): 30.
  - tras R10 (1): 15, 30.
  - tras R11 (1): 13, 14, 15, 25, 30, 32, 33, 37, 40, 42, 43, 44. Tras R11 (2), la 13 puede salir.
  - tras R12 (1): las de R11, más la 28.
  - tras R17 (1): las anteriores, más la 49.
  - tras R17 (2): 15, 25, 28, 30, 32, 33, 37, 40, 42, 43, 44.
  - tras R13 (1): 15, 16, 17, 24, 25, 28, 29, 30, 31–45.
  - tras R18 (1): las anteriores, más 19–23.
  - tras R18 (2): 15, 17, 21–25, 29, 30, 31–37, 39–45.
  - tras R19 (2): las anteriores, sin la 30.
  - tras R20 (2): 15, 21, 22, 23, 25, 32, 33, 37, 40, 42, 43, 44.
  - tras R4 (1): las anteriores, más 8, 9, 18.
  - tras R4 (2): 8, 9, 15, 18, 25, 32, 33, 37, 40, 42, 43, 44.
  - tras R5 (1): las anteriores, más 11 y 12. Tras R5 (2): sin la 11 y la 12.
  - tras R6 (1): las anteriores, más la 10.
  - tras R6 (2): 15, 25, 32, 33, 37, 40, 42, 43, 44.
  - tras R7 (1): las anteriores, más la 6 y la 7.
  - tras R7 (2): ninguna.

  Las filas 26 y 27 entran y salen en R23 (2), la 48 en R22 (catálogo) y las 46 y 47 en R22 (tabla): ninguna queda en vuelo.

Corridas completas. Cada una sin pipe, con los dos pgreps vacíos antes:
  cd /home/claude/sites/Pet-Tracker-wt-214/mobile-pet-tracker && bun run test > ../progress/full-214-<rNN>.log 2>&1; echo exit=$?
En cada una, `grep -c 'SIGKILL'` y `grep -c 'failed to run'` sobre el log deben dar 0; si no, repite (memoria: una suite tumbada cuenta 0 tests). Pega `exit=`, `Test Suites:`, `Tests:` y la lista de `it` rojos (`grep -E '^\s+✕' ../progress/full-214-<rNN>.log`). El rojo esperado es exactamente el de la tabla. Un rojo de más que no sea flake conocido, PARA. Un rojo esperado que no aparece se anota.
  - r03, tras R3 (1): el `it` de R3 y las filas 1–5.
  - r17, tras R17 (1): los siete `it` de R17 y las filas 14, 15, 25, 28, 30, 32, 33, 37, 40, 42, 43, 44 y 49. La 13 también, si no salió en R11 (2).
  - r06, tras R6 (1): los dos `it` de R6 y las filas 8, 9, 10, 15, 18, 25, 32, 33, 37, 40, 42, 43 y 44.
  - r22, tras R7 (2) y antes de R22 (tabla): todo verde. Es la corrida previa a las guardas de R24, y su cifra de tests es T0 más todos los `it` añadidos hasta R7.

Sondas de mutación. Cada sonda va tras el `feat` (2) de su R y antes del `test` siguiente; las de R22, R23 y R24 van donde se indica. Pasos:
  1. Planta la mutación en producción.
  2. Corre el fichero indicado y comprueba el rojo esperado.
  3. Revierte con `git checkout HEAD -- <fichero>`.
  4. Comprueba `git diff --quiet HEAD -- <fichero>` y `git diff --cached --quiet`.
Nunca se commitea. Si una mutación sigue en verde, no arregles nada: repórtala como «mutación verde» (R, mutación, `it` que debía caer) y sigue.
  - R1 (src/api/pet-members.ts, en 'src/api/__tests__/pet-members.test.ts'):
    - que `acceptInvite` trate 400 como `error`. Rojo: el `it` R1 de `acceptInvite` 400.
    - quitar la guarda de `baseUrl` en `revokePetInvite`. Rojo: `'R1: ninguna función toca fetch sin baseUrl'`.
  - R2 (src/api/query-keys.ts): `memberKeys.list` = `['pets', 'members', petId]`. Rojo: el `it` de R2.
  - R3 (src/app/_layout.tsx, en el layout test): `headerShown: true` en `join-pet`, y por separado, las tres pantallas movidas después de `edit-profile`. Rojo: el `it` de R3 en los dos casos.
  - R8 (pantalla de Familia): `retryAll` que hace `refetch` de las tres queries siempre. Rojo: una fila del `it.each` de R8.
  - R9:
    - píldora con el ternario al revés: `role === 'family' ? roleFamily : roleOwner`. Rojo: el `it` walker/vet de R9.
    - dar a «yo» el slot azul. Opcional: puede seguir verde; si sigue verde, anótalo.
    - hacer que una fila pinte el correo de `getMe` donde va el nombre. Rojo: `'R9: ningún texto de la pantalla contiene el correo de getMe'` (nace verde).
  - R10:
    - quitar `userId !== me.id`. Rojo: el `it` de dueño de R10.
    - mostrar Quitar sin mirar el rol. Rojo: `'R10: family no ve Quitar, invitaciones ni CTA'` y `'R10: walker tampoco ve acciones de dueño'` (nacen verdes).
  - R11:
    - rama rechazada sin `invalidateQueries`. Rojo: el `it` rechazado.
    - quitar `isDisabled={busy}` del confirmar. Rojo: el `it` de doble toque.
  - R12:
    - `enabled: true` siempre. Rojo: `'R12: family no pide invitaciones'` (nace verde).
    - pintar la sección también con la lista vacía o con error. Rojo: `'R12: sin invitaciones no hay sección'` y `'R12: si la lista falla no hay sección'` (nacen verdes).
    - `month: 'long'` en src/utils/pet-members.ts. Rojo: R12 de utils y de pantalla.
    - `not-found` sin `invalidateQueries`. Rojo: el `it` de `not-found`.
  - R13:
    - el CTA sin borrar `actionError`. Rojo: su fila del `it.each`.
    - parámetros de `router.push` sin `expiresAt`. Rojo: el `it` ok.
    - que el `onPress` de `pet-members-leave` no borre el aviso. Rojo: la fila `pet-members-leave`. Es la sonda de la posible nacida verde.
  - R14 (src/utils/pet-members.ts y pantalla de invitación):
    - `slice(0, 4)` en `formatInviteCode`. Rojo: los `it` de R14.
    - mostrar Compartir con código inválido. Rojo: `'R14: sin código no ofrece compartir'` (nace verde).
  - R15:
    - copiar el `code` crudo, sin `formatInviteCode`. Rojo: el `it` de copiar.
    - `setCopied` antes del `await`. Rojo: `'R15: si copiar falla la etiqueta no cambia'` (nace verde).
    - quitar el `.catch` de `Share.share`. Rojo: `'R15: un Share rechazado no rompe la pantalla'` (nace verde). Si sigue verde, anótalo.
  - R16:
    - `ownerName` tomado del primer miembro. Rojo: `'R16: sin dueño en la lista no hay nota'` (nace verde).
    - Salir visible también para el dueño. Rojo: `'R16: el dueño no ve Salir'` (nace verde).
  - R17:
    - `router.dismissTo` antes de `invalidateQueries`. Rojo: el `it` del array de orden.
    - `members.leaveBody` siempre. Rojo: el `it` NoOwner.
  - R18:
    - código sin `trim()`. Rojo: el `it` del recorte.
    - `maxLength={10}`. Rojo: el `it` de 11 caracteres.
  - R19:
    - quitar la rama `rate-limited`. Rojo: su `it`.
    - editar sin borrar el error. Rojo: el `it` de editar.
    - en src/api/pet-members.ts, 404 y 400 con `kind` distinto. Rojo: `'R19: acceptInvite da el mismo kind con 404 y con 400'` (nace verde).
  - R20:
    - `router.replace('/home')` en `join-pet-go-home`. Rojo: el `it` de ir a Inicio, y en 'src/__tests__/chunky-cta-canvas-fidelity.test.ts' la fila de `CTA_ROWS`.
    - editar sin volver del estado ya miembro. Rojo: `'R20: editar vuelve al formulario'` (nace verde).
  - R21:
    - `void queryClient.invalidateQueries(…)` sin `await`. Rojo: `'R21: no selecciona hasta que la invalidación termina'` (nace verde).
    - `selectPet` después de `dismissTo`. Rojo: el `it` de orden.
  - R4 (src/screens/profile/index.tsx): `router.push` a `/pets/${pet.id}` sin `/members`. Rojo: el primer `it` de R4. Y pintar la tarjeta sin `pet`: rojo `'R4: sin mascota no hay tarjeta de Familia'` (nace verde).
  - R5:
    - `others = n` en vez de `n - 1`. Rojo: los `it` de R5.
    - mostrar el subtítulo mientras carga o con error. Rojo: `'R5: oculta el subtítulo mientras carga'` y `'R5: oculta el subtítulo si la lista falla'` (nacen verdes).
  - R6: la fila de `join-pet-link` antes de la de miembros. Rojo: los `it` de R6 o de R4.
  - R7 (src/screens/home/index.tsx): `router.push('/add-pet')` en `home-join-pet`. Rojo: el `it` de R7 que navega a `join-pet`.
  - R22, tras su commit de tabla:
    - quitar una clave del bloque `en` de src/i18n/catalog.ts. Rojo: `#194 R1` (fila 48) y los `it` de `#214 R22: copy de Familia`.
    - en la pantalla de Familia, cambiar un `t('members.revoke')` por `t('members.remove')`. Rojo: al menos un `it` de `#214 R22: copy de Familia`.
  - R23, tras el commit `chore`: `~` por `^` en la línea de `expo-clipboard` de package.json. Rojo: el `it` de R23. Revierte sin `bun install`.
  - R24, en «Cierre», tras las anclas «después»:
    - `// #214 R4` en src/screens/profile/index.tsx. Rojo: `#173 R15` en 'src/__tests__/profile-canvas-fidelity.test.ts'.
    - `// #214 R7` en src/screens/home/index.tsx. Rojo: `#190 R12` en 'src/__tests__/home-pingo-phrase.test.ts'.
    - quitar `style={chunkyLip.neutral}` de `pet-members-leave`. Rojo: 'src/__tests__/chunky-cta-canvas-fidelity.test.ts', en su fila de `CTA_ROWS`.

Guardas que R1 a R24 cruzan:
  - Sin cambios desde H0. Esta orden, desde la raíz del worktree, debe salir vacía:
    `git diff 08fe7dab -- mobile-pet-tracker/src/theme mobile-pet-tracker/src/components mobile-pet-tracker/src/providers mobile-pet-tracker/src/hooks/use-pet-selection.ts mobile-pet-tracker/src/api/http.ts mobile-pet-tracker/src/api/pets.ts mobile-pet-tracker/src/api/users.ts mobile-pet-tracker/src/screens/pairing mobile-pet-tracker/src/screens/reminders mobile-pet-tracker/src/screens/meal-schedule mobile-pet-tracker/src/utils/category-palette.ts init.sh backend-pet-tracker`
    En src/providers solo cambia su test (`language-provider.test.tsx`, fila 48), que está fuera de esta orden.
  - package.json y bun.lock: solo las líneas de `expo-clipboard`. Usa la comprobación de «Dependencia nueva».
  - Candados de design.md §7.2: no se editan, y siguen verdes en cada corrida completa.
  - design.md §7.3: ninguna spec hermana (#217, #208, #209, #213) está en H0, así que no hay nada que fusionar. No hagas merge ni rebase. Si `git log --oneline 08fe7dab..HEAD` muestra un commit que no es tuyo (o que no lleva `#214`), PARA. El commit del handoff (`docs(progress): #214 Codex handoff`) es del leader y no cuenta.
  - Literales enteros (`#194 R5` en ui-language.test.ts): el leader comprobó en H0 que ningún fichero de producción de src/ tiene como literal entero uno de los 50 valores fijos nuevos de §5. Un rojo de `#194 R5` tras R22 (catálogo) o tras R22 (tabla) significa que una pantalla tiene copy suelta: PARA.

Cierre (tasks.md §R24 y §Verificación final; lo que el reporte debe traer):
  - Anclas «después»: las 189 de arriba y las 2 extra, tal cual, con su salida pegada. Cada cifra debe ser exactamente la «después» de §7.1. Si no, PARA.
  - Sondas de R24 (ver «Sondas»).
  - `bun run test` completo en verde, en `progress/final-test-214.log`, sin pipe, con los dos pgreps vacíos antes y SIGKILL / «failed to run» en 0. Su cifra de tests es la última de la cuenta encadenada.
  - La corrida de tasks.md:
    `cd /home/claude/sites/Pet-Tracker-wt-214/mobile-pet-tracker && bunx jest src/api src/utils src/app/__tests__ src/screens/pet-members src/screens/pet-invite src/screens/join-pet src/screens/profile src/screens/home src/hooks src/providers src/__tests__ > ../progress/verify-214.log 2>&1; echo exit=$?`
  - Aparte, porque el posicional no casa con los paréntesis:
    `cd /home/claude/sites/Pet-Tracker-wt-214/mobile-pet-tracker && bunx jest --runTestsByPath 'src/app/(tabs)/__tests__/screens.test.tsx' > ../progress/verify-214-tabs.log 2>&1; echo exit=$?`
  - Typecheck: `test ! -e .expo/types/router.d.ts` y luego `bunx tsc --noEmit`.
  - Lint, como en «Reglas críticas».
  - La orden de «Guardas», vacía.
  - `graphify update .` en el worktree (AST, sin coste; graphify-out/ está en .gitignore).
  - Lista de ficheros tocados desde H0, desde la raíz del worktree: `git diff --name-only 08fe7dab..HEAD -- mobile-pet-tracker/ specs/`. Debe coincidir con la lista cerrada de arriba.
  - Reporte en progress/impl_mobile-pet-members.md. Debe traer:
    - la salida del primer comando;
    - la salida de las anclas T0 y la base T0 (`exit=`, `Test Suites:`, `Tests:`);
    - los commits (hash y mensaje), la línea `Tests:` tras cada uno y la cuenta encadenada;
    - las sondas, con las mutaciones verdes si las hubo;
    - los `it` nacidos verdes, con su motivo, y si nació verde la fila `pet-members-leave` de R13;
    - los adelantos de candados (commit, fila, cifra), las filas que no se pusieron rojas al entrar y las que se pusieron verdes antes de tiempo (se espera la 13);
    - las skills cargadas y las no encontradas;
    - lint y typecheck;
    - cada fila de §7.1 con su cifra antes y después;
    - las corridas completas r03, r17, r06 y r22, con sus rojos;
    - los flakes de carga vistos y las desviaciones;
    - la tabla de R1 a R24, test y commit;
    - la lista de casos de smoke del humano (abajo).
  - Última acción: crear progress/impl_mobile-pet-members.done con una sola línea, la ruta de progress/impl_mobile-pet-members.md. Está en .gitignore; no lo commitees (lo vigila scripts/harness/watch-impl.sh).

Smoke del humano. Va en el reporte, tal cual; el humano lo corre en dispositivo tras el rebuild del dev build (G4). Tú no lo corres:
  - Perfil con mascota:
    - la tarjeta «Familia» con su subtítulo, con 1, 2 y 3 o más miembros;
    - «Unirme con código» en la tercera fila.
  - Perfil sin mascota: «Unirme con código» en la primera fila.
  - Inicio vacío: «Unirme con código» bajo el CTA de añadir mascota.
  - Familia como dueño:
    - píldoras, «Tú» e iniciales;
    - «Quitar» con la hoja de fondo `surface` y su confirmación;
    - invitaciones pendientes y «Revocar»;
    - «Invitar a alguien» y los avisos de límite.
  - Familia como familiar:
    - nota del dueño;
    - «Salir de esta mascota» con su hoja;
    - vuelta a Inicio sin la mascota.
  - Invitar:
    - código `XXXXX-XXXXX`;
    - «Compartir» abre la hoja nativa con el mensaje;
    - «Copiar código» pasa a «Código copiado»;
    - pegar el código en otra app.
  - Unirme:
    - código con guion pegado;
    - código inválido, sin red y demasiados intentos;
    - «ya miembro» y «Ir a Inicio»;
    - aceptar deja seleccionada la mascota nueva en Inicio;
    - el teclado no tapa el botón (KAV).
  - Todo lo anterior en en-US.

## Adenda 1 (leader, tras la parada en R18 (2))

Paraste bien. El rojo viene del test, no de la producción. `KeyboardAvoidingView` de React Native no
pasa `behavior` a la `View` anfitriona, así que `getByTestId('screen-join-pet').props.behavior` vale
`undefined` aunque la pantalla declare `behavior="padding"`. El precedente del repo lee el fuente:
`src/screens/edit-profile/index.test.tsx` (`#194 R5`, `readFileSync` + `toContain('behavior="padding"')`).

Queda autorizado este arreglo y **solo** este, en `mobile-pet-tracker/src/screens/join-pet/index.test.tsx`:

- Arriba del todo, antes de la primera línea de import, añade los dos imports del precedente:
  `import { readFileSync } from 'fs';` y `import { join } from 'path';`.
- En `it('R18: el formulario admite 11 caracteres con el placeholder del artboard', …)`, cambia la línea
  `expect(screen.getByTestId('screen-join-pet').props.behavior).toBe('padding');` por estas dos:
  ```tsx
  const source = readFileSync(join(process.cwd(), 'src/screens/join-pet/index.tsx'), 'utf8');
  expect(source).toContain('<KeyboardAvoidingView testID="screen-join-pet" behavior="padding"');
  ```
- No cambies nada más del test ni de la producción que ya tienes sin commit.
- Commit aparte, solo del test (la producción sigue sin commit):
  `git commit --only mobile-pet-tracker/src/screens/join-pet/index.test.tsx -m "test(mobile): #214 read the join pet KAV behavior from the source (R18)"`.
  Sobre el árbol commiteado este test sigue en rojo, porque `index.tsx` commiteado es el stub.
- Después retoma R18 (2) desde la primera corrida del paso verde, con la producción que ya tienes.
  El fallo extra tiene que desaparecer, y los 18 de guardas tienen que seguir siendo las filas en vuelo
  autorizadas. Anota en el reporte el commit nuevo, la causa del rojo y que la cuenta de R18 (1) no cambia
  (`5745`: es el mismo `it`).
- Sonda de mutación para esta línea: cambia `behavior="padding"` por `behavior="height"` en la producción.
  El `it` tiene que dar rojo. Revierte la sonda.
- Cualquier otro rojo inesperado: para, igual que antes.

## Adenda 2 (leader, tras la parada en R4 (2))

Paraste bien: el rojo no estaba en la lista. El leader lo diagnosticó sobre tu diff de R4 sin commit, con los
pgreps vacíos de su lado:

- `#173 R5 … pinta la cápsula tras el título …` aislado (`-t "#173 R5"`): verde.
- `src/screens/profile/index.test.tsx` completo con `--testTimeout=30000`, dos veces seguidas: `2 failed, 192
  passed, 194 total`. Las dos rojas son las filas 8 y 9, que siguen en vuelo hasta R6. `#173 R5`, verde en
  las dos.

Es carga, no tu cambio: `findByTestId('pet-info-card')` espera con el timeout por defecto de RNTL y cayó
cuando había otros dos Codex corriendo jest. Lo que queda autorizado:

- Añade `#173 R5` (Perfil, `pet-info-card`) a «Flakes de carga conocidos», con la misma regla: rojo y verde
  aislado se anota y se sigue; rojo aislado, para.
- Retoma R4 (2) desde su corrida de verificación, con tu implementación tal cual, y sigue la cadena.
- No cambies el test ni sus esperas.
- Anota en el reporte el rojo, los verdes aislados del leader y el tuyo.

Esta adenda y la Adenda 1 son commits del leader con `#214` en el asunto. Solo tocan este fichero, y en la
comprobación de `git log --oneline 08fe7dab..HEAD` del cierre cuentan igual que el commit del handoff.

## Adenda 3 (leader, tras la parada en R7 (2))

Paraste bien. El rojo viene de tu test, no de la producción. `toHaveTextContent` con una cadena compara el
texto **entero** del nodo (`exact` vale `true` por defecto en RNTL 14), y `home-empty` contiene título, cuerpo
y acción. La spec no pide esa aserción: dice que `EmptyState` y su `action` no cambian, y el precedente del
mismo fichero lee la etiqueta en `home-empty-action`.

La misma causa deja tautológico un candado ya commiteado de R9. En
`it('R9: ningún texto de la pantalla contiene el correo de getMe', …)`,
`expect(text).not.toHaveTextContent('@')` solo fallaría con un nodo cuyo texto entero sea `@`, así que no
puede ponerse rojo. Es tu «mutación verde» de R9 (`mutation-r09-email-214.log`). La spec pide «ninguno
contiene `@`».

Quedan autorizados estos dos arreglos y **solo** estos.

### A. R7, antes de retomar R7 (2)

- En `mobile-pet-tracker/src/screens/home/index.test.tsx`, dentro de
  `it('R7: el vacío ofrece Unirme con código bajo Añadir mascota', …)`, cambia
  `expect(screen.getByTestId('home-empty')).toHaveTextContent('Añadir mascota');` por
  `expect(screen.getByTestId('home-empty-action')).toHaveTextContent('Añadir mascota');`.
- No cambies nada más del test ni de la producción que ya tienes sin commit.
- Commit aparte, solo del test (la producción de R7 sigue sin commit):
  `git commit --only mobile-pet-tracker/src/screens/home/index.test.tsx -m "test(mobile): #214 read the add pet label from home-empty-action (R7)"`.
  Sobre el árbol commiteado el `it` sigue en rojo, porque `home-join-pet` todavía no existe.
- Retoma R7 (2) desde la primera corrida del paso verde, con tu producción tal cual. El fallo tiene que
  desaparecer. La cuenta de R7 (1) no cambia (`5770`: son los mismos `it`).

### B. R9, justo después de cerrar R7 (commit verde y sonda de R7 hechos)

- En `mobile-pet-tracker/src/screens/pet-members/index.test.tsx`, dentro de
  `it('R9: ningún texto de la pantalla contiene el correo de getMe', …)`, cambia
  `expect(text).not.toHaveTextContent('@');` por `expect(text).not.toHaveTextContent(/@/);`.
  Es el patrón de `src/screens/home/index.test.tsx` (`.not.toHaveTextContent(/Invalid/)`).
- `bunx jest --runTestsByPath src/screens/pet-members/index.test.tsx`: verde, sin cambio de cuenta.
- Repite tu sonda de R9: pinta `me.email` en una fila. Ahora **este** `it` tiene que dar rojo (además del
  de filas). Revierte con `git checkout HEAD --` del fichero y comprueba diff e índice vacíos.
- Commit solo del test:
  `git commit --only mobile-pet-tracker/src/screens/pet-members/index.test.tsx -m "test(mobile): #214 match the at sign as a substring in the privacy lock (R9)"`.
- Sigue la cadena donde la dejaste (lo que venía tras R7).

### Para los dos

- Anota en el reporte los dos commits nuevos, la causa y el rojo de la sonda B.
- En la traceability, la fila R7 cita el rojo `a50176d6`. La fila R9 añade el commit de B como «candado
  reforzado», sin tocar sus hashes.
- Cualquier otro rojo inesperado: para, igual que antes.

Esta adenda es commit del leader con `#214` en el asunto, como las Adendas 1 y 2. Los dos commits de test de
A y B son tuyos y suman a la cuenta de commits del cierre: anótalos.

## Adenda 4 (leader, tras la segunda parada en R7 (2))

Paraste bien otra vez. El rojo viene de tu test, no de la producción. El `Button` de HeroUI antepone sus
clases internas (`pressable-feedback__root button__root …`) a la `className` que recibe, así que `toBe` con
la receta de la spec no puede ponerse verde. La spec fija la receta, no la cadena entera, y la `Received` de tu
log termina exactamente en esa receta.

Queda autorizado este arreglo y **solo** este:

- En `mobile-pet-tracker/src/screens/home/index.test.tsx`, dentro de
  `it('R7: el vacío ofrece Unirme con código bajo Añadir mascota', …)`, cambia
  `expect(screen.getByTestId('home-join-pet-button').props.className).toBe('w-full h-13.5 rounded-16 border-2 border-lip-gray bg-surface');` por
  `expect(screen.getByTestId('home-join-pet-button').props.className).toMatch(/ w-full h-13\.5 rounded-16 border-2 border-lip-gray bg-surface$/);`.
- No cambies nada más del test ni de la producción que ya tienes sin commit. Las demás `toBe` de `className`
  de ese `it` (`home-join-pet`, `home-join-pet-prompt`) son de nodos que no son de HeroUI y se quedan.
- Commit aparte, solo del test (la producción de R7 sigue sin commit):
  `git commit --only mobile-pet-tracker/src/screens/home/index.test.tsx -m "test(mobile): #214 match the join button recipe as a className suffix (R7)"`.
- Retoma R7 (2) desde la primera corrida del paso verde, con tu producción tal cual. La cuenta no cambia
  (`5770`).
- En la sonda de R7, planta además `rounded-14` en lugar de `rounded-16` en `home-join-pet-button`: este `it`
  tiene que dar rojo. Revierte con `git checkout HEAD --` del fichero y comprueba diff e índice vacíos.
- Después, la parte B de la Adenda 3 y el resto de la cadena, sin cambios.
- Anota en el reporte el commit nuevo, la causa y el rojo de la sonda. Cualquier otro rojo inesperado: para.

Esta adenda es commit del leader, como las anteriores. El commit de test es tuyo y suma a la cuenta del cierre.

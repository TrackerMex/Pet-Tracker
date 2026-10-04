# Handoff a Codex CLI — #118 mobile-welcome-splash

> Pegar el bloque de abajo en Codex CLI. La spec está firmada (commit de firma
> `16c8e565`, aprobación vía Notion el 2026-10-04, `page_last_edited_at`
> 2026-10-04T20:08:35Z). Feature móvil. La prueba de humo en el dev build de
> Android (R13, ocho casillas) es del humano y cierra la feature, no la spec.

---

```
Worktree: /home/claude/sites/Pet-Tracker-wt-118   <- PRIMERA LINEA. Trabaja AQUI y en ningun otro sitio
Antes de tocar nada, ejecuta `pwd`, `git branch --show-current` y
`git rev-parse --short HEAD` y pega las tres salidas al principio de
progress/impl_mobile-welcome-splash.md. El hash es H0 (el commit que anade
este handoff): todos los `git diff --name-only` se miden contra el. Para si
la branch no es feature/118-mobile-welcome-splash.
No toques /home/claude/sites/Pet-Tracker (sesion del leader),
Pet-Tracker-wt-backend (#117), ni ningun otro worktree, ni cambies de
branch en ninguno. node_modules ya esta instalado en el worktree.

Feature: mobile-welcome-splash (#118)
Branch: feature/118-mobile-welcome-splash
Spec aprobada: specs/mobile-welcome-splash/requirements.md
(status: approved, firma 16c8e565)
Lee tambien, enteros: specs/mobile-welcome-splash/design.md, tasks.md y
traceability.md. tasks.md es tu guion (T1-T10; T11 es del humano). En
requirements.md: la tabla «Contexto y decisiones cerradas» (todo esta
decidido: no reabras nada), R1 (literales EN/ES exactos), R5 (arbol con
testIDs y clases), R6 (tabla de 12 decisiones por chip), R10 (ms, curva,
Reduce Motion). En design.md: §1.1 navegacion, §1.2 lista cerrada de
ficheros, §1.3 arbol, §1.4 clases contra los guards, §1.5 movimiento, §2
tabla de mutaciones y sondas. Contexto de diseno (solo lectura, no es
spec): progress/explore_ui-appllama.md §1.

== QUE HACES ==

Pantalla de bienvenida para sesiones sin login. Ruta nueva `/welcome`
(src/app/welcome.tsx delgado + src/screens/welcome/index.tsx) registrada
en src/app/_layout.tsx como SEXTO hijo del Stack, dentro de su propio
`<Stack.Protected guard={status !== 'authenticated'}>` DESPUES del
Protected autenticado que ya existe (no muevas ese: layout.test.tsx lo
busca en children[4]). src/app/index.tsx cambia SOLO el destino del
Redirect sin sesion: '/login' -> '/welcome'. El cuerpo devuelve
<Redirect href="/home" /> si status === 'authenticated'.

Arbol exacto en requirements.md R5: ScrollView testID="screen-welcome"
> Animated.View testID="welcome-content" > hero (expo-image, splash-icon.png
160x160) / brand / chips / tagline / CTA primario / CTA secundario / legal.
Chips: constante WELCOME_CHIPS de 3 entradas recorrida con map, iconos
reicon Map / Stethoscope / ForkKnife size 14 color accent-strong via
useThemeColors (src/theme/use-theme-colors.ts). CTA primario heroui Button
`w-full rounded-xl bg-accent` -> router.push('/register'); secundario
`w-full rounded-xl border border-accent bg-transparent` con label
`font-semibold text-accent-strong` -> router.push('/login'). Nunca
router.replace en los CTAs. Legal: texto plano, sin Linking.

Copy: 8 claves welcome.* con los literales EXACTOS de la tabla de R1, en
`en` y en `es`, al final de cada objeto de src/i18n/catalog.ts. Todo
texto visible pasa por t(). No inventes ni traduzcas: copia la tabla.

Movimiento (R10): UNA entrada del bloque welcome-content, opacity 0->1 y
translateY 16->0, withTiming 240 ms, Easing.bezier(0.23, 1, 0.32, 1),
disparada en un useEffect que escribe los shared values una sola vez.
Exporta WELCOME_ENTRANCE_MS = 240 y WELCOME_ENTRANCE_EASING. Con
useReducedMotion() === true, translateY arranca en 0 y solo anima la
opacidad. Sin animacion de press propia (la trae heroui Button). Sin
expo-linear-gradient, sin expo-symbols, sin hex, sin StyleSheet.create,
sin clases arbitrarias, sin rounded-2xl|lg|md|sm, sin text-accent suelto,
sin CONTINUOUS_CORNER, sin emojis.

== BASE ==

HEAD de la branch contiene origin/main b2a9c2aa (merge de #148);
mobile-pet-tracker/ no ha cambiado desde entonces en esta branch. Al
arrancar: `git fetch origin` y
`git merge-base --is-ancestor b2a9c2aa HEAD; echo "exit=$?"` -> exit=0.
Si origin/main ya NO es b2a9c2aa (#117 mergeado antes que tu), PARA y
anotalo en el impl: tasks.md §0 dice «rebase», pero el merge de main en
la branch lo hace el leader, no tu. Nunca rebasees.

Base medida por el leader el 2026-10-04 sobre el arbol de H0 (desde
mobile-pet-tracker/, `bunx jest --runTestsByPath --maxWorkers=2` de las
7 suites que la feature toca, exit=0): 7 suites / 219 tests / 0 failed.
  src/app/__tests__/index.test.tsx                    3
  src/app/__tests__/layout.test.tsx                  25
  src/providers/__tests__/language-provider.test.tsx 22
  src/__tests__/ui-language.test.ts                  29
  src/__tests__/ui-copy-table.ts                      (helper, sin it propios)
  src/__tests__/consistency-classnames.test.ts       55
  src/__tests__/legibility-classnames.test.ts        26
  src/__tests__/design-drift.test.ts                 59
Tu medida manda: mide al arrancar y anota antes/despues en el impl.
Delta esperado al cierre: index 0 (un it renombrado), layout +1,
ui-language +1, design-drift +N (el describe #118 R11), language-provider,
legibility y consistency 0 (cambian sumas, no its); suite NUEVA
src/screens/welcome/index.test.tsx con 28 it (R3 2, R4 1, R5 3, R6 12,
R7 2, R8 2, R9 2, R10 4). Cero it borrados.

Anclas (valores de H0; anclas por CONTENIDO, los numeros de linea son
orientativos). Verifica cada una al arrancar con grep y copia la salida
al impl; si alguna no da EXACTAMENTE lo esperado, PARA y avisa:
  language-provider.test.tsx: la suma de englishKeys termina en
    `+ 9, // #105 R5` (1 coincidencia) -> le anades `+ 8, // #118 R1`
  ui-language.test.ts: `toHaveLength(19 + 2 + 1 + 1 + 1 + 1 + 1 + 1 + 1)`
    (1) -> `+ 1 // #118 R1`
  consistency-classnames.test.ts: `13 + 1 + 1` (2 coincidencias: #62 R1 y
    #98 R10) -> `+ 1 // #118 R7` en las DOS
  layout.test.tsx: `expect(children).toHaveLength(5)` (1) -> `+ 1 // #118 R3`
  index.test.tsx: it 'redirects an unauthenticated session to login' (1)
  ui-copy-table.ts: `R15_GEOFENCE_EDITOR` es el ultimo bloque de ALL_USES;
    ui-language.test.ts tiene el array `blocks` con R15_GEOFENCE_EDITOR al
    final -> R16_WELCOME detras en los dos
  legibility-classnames.test.ts: tabla inkSites (ultima fila
    `[join('components', 'pet-hero-header.tsx'), 1]`) -> fila nueva
    `[join('screens', 'welcome', 'index.tsx'), 2]` y `+ 2 // #118 R11`
    en la suma
  src/app/_layout.tsx: `grep -c 'name="welcome"'` = 0; dos lineas
    `Stack.Protected` (apertura y cierre del guard autenticado)
  src/screens/welcome/ y src/app/welcome.tsx NO existen
Los `+N` de la spec son DELTAS sobre lo que midas, nunca absolutos.

== COMMITS ==

Mensajes LITERALES, en este orden (conventions §Commits: en ingles; el
patron `R<n> rojo/verde` de tasks.md se concreta aqui). Rojo SIEMPRE
antes que su verde; un commit con todo incumple C4 (paso en #19):
  test(mobile): lock the catalog length for the welcome keys (#118 R1)
  feat(mobile): add the welcome copy in both languages (#118 R1)
      <- incluye specs/mobile-ui-language/design.md §2.19 (precedente
         edc990e4 de #105)
  test(mobile): expect the unauthenticated redirect to welcome (#118 R2)
  feat(mobile): redirect unauthenticated sessions to welcome (#118 R2)
  test(mobile): lock the welcome screen tree and route (#118 R3, R4, R5, R9)
  feat(mobile): add the welcome screen under its own guard (#118 R3, R4, R5, R9)
      <- incluye los `+ 1` de consistency (x2) y de layout (rojos en
         cascada declarados en design.md §2)
  test(mobile): lock the three welcome chips (#118 R6)
  test(mobile): lock the primary welcome CTA (#118 R7)
  test(mobile): lock the secondary welcome CTA (#118 R8)
      <- R6/R7/R8 nacen verdes si T3 dejo la pantalla exacta. Entonces el
         commit test(...) ES el registro; la sonda de mutacion (tasks.md
         T4/T5 «commit R6 sonda») NO se commitea: la plantas, anotas el
         it que cae con Expected/Received en el impl y la reviertes con
         `git checkout HEAD -- <ruta>`; `git diff --cached --stat` vacio.
         Si alguno sale rojo de verdad, su verde es
         fix(mobile): <que> (#118 R<n>)
  test(mobile): lock the welcome entrance and reduce motion (#118 R10)
  feat(mobile): animate the welcome entrance once (#118 R10)
  test(mobile): add welcome to the copy usage table and screen list (#118 R1)
  test(mobile): count welcome among the scanned screens (#118 R1)
      <- T8: el segundo es el `+ 1` de SCREEN_FILES (verde)
  test(mobile): guard the welcome files against style drift (#118 R11)
      <- T9: design-drift + legibility; nace verde, sonda en el impl
  docs(mobile): trace #118 R1-R12 to their tests and commits
El ultimo lleva SOLO specs/mobile-welcome-splash/traceability.md y
progress/impl_mobile-welcome-splash.md. Un refactor va en su propio
commit `refactor(mobile): <que> (#118 R<n>)` tras su verde.

== REGLAS CRITICAS ==

- Convenciones: docs/conventions.md (describe con prefijo `#118 R<n>:`
  en las suites globales; en la suite nueva los describe se llaman `R3`,
  `R4`... como fija requirements.md; titulos de it LITERALES de
  requirements.md, no los traduzcas ni acortes).
- Esperas: docs/conventions.md §Esperas sobre el arbol renderizado. Aqui
  no hay datos remotos: nada de waitFor a contadores de mock. R7/R8:
  fireEvent.press y expect sincrono sobre mockRouter.push. R10: `act` +
  `jest.advanceTimersByTime(WELCOME_ENTRANCE_MS * 2 + 100)`; la asercion
  del estado inicial va ANTES de avanzar. Si el inicial es inestable,
  amplia la ventana, nunca la asercion (tasks.md T7.3).
- Mocks: NO los copies literalmente de otra suite; verifica contra el
  fichero destino. Precedentes: src/screens/home/index.test.tsx (mockIcon
  de reicon-react-native, mock parcial de reanimated que SOLO sustituye
  useReducedMotion), src/app/(auth)/__tests__/login.test.tsx (wrapper
  HeroUINativeProvider + LanguageProvider initial="es"),
  src/app/__tests__/index.test.tsx (mockRedirect, mock de useAuth),
  src/components/__tests__/floating-tab-bar.test.tsx (withTiming real +
  timers falsos + toHaveAnimatedStyle). El mock de
  ../../theme/use-theme-colors devuelve ['accent-strong-ink'].
- UI movil: docs/ui-guidelines.md rige (gate C8). Skills a cargar y a
  decir en el impl cuales cargaste: del plugin expo de Codex,
  `building-native-ui`; del repo (.agents/skills/),
  `appllama-app-design-skill` (la carta la exige al crear una pantalla) y
  `animate-expo` (R10; tu plugin NO tiene skill de animacion). NO existe
  en tu catalogo skill de router: el patron Stack.Protected esta en
  design.md §1.1 y en src/app/(auth)/_layout.tsx. No pidas skills por
  otros nombres (expo-overview, expo-animation, expo-router no existen en
  Codex: silencio, no error). Appllama MCP no esta en Codex y no hace
  falta: el diseno ya esta cerrado en la spec.
- TEST PRIMERO (C4): cada rojo falla EXACTAMENTE por lo que requirements.md
  o design.md §2 declaran (asercion o consulta), nunca por SyntaxError,
  ReferenceError, TypeError o import roto, salvo los dos rojos en cascada
  declarados en design.md §2 (ENOENT de checkUses antes de T8 — por eso T8
  va despues de T3 — y los +1 de consistency/layout dentro del verde de
  T3). Si cae otro it, PARA y reportalo. No ajustes ninguna asercion ni
  ningun candado global para que cuadre.
- R12: ni `bun add`, ni cambios en package.json, bun.lock ni app.json.
  Todo con bun/bunx, nunca npm/npx. `git diff origin/main --
  mobile-pet-tracker/package.json mobile-pet-tracker/bun.lock` vacio al
  cerrar; copia la salida (vacia) al impl.
- Jest: siempre `--runTestsByPath` desde mobile-pet-tracker/. Ninguna ruta
  de esta feature lleva parentesis; si usas login.test.tsx como
  referencia, su ruta `src/app/(auth)/...` va ENTRE COMILLAS. Tras cada
  comando, el numero de suites que imprime jest debe ser el de ficheros
  pedidos.
- Typecheck: `test ! -e .expo/types/router.d.ts` antes de CADA
  `bun run typecheck`. Si existe, PARA y pide al humano que lo borre.
  Nunca `rm -f` (tu sandbox lo deniega). Las rutas '/welcome' y
  '/register' en router.push/Redirect deben tipar sin ese fichero.
- NO lances ./init.sh ni toques Postgres ni LocalStack: los comparten
  otras sesiones. Se mide con bunx jest, bun run typecheck y bun run lint
  desde mobile-pet-tracker/.
- Mide SIN pipe: `cmd > fichero 2>&1; echo "exit=$?"`. `cmd | tail`
  devuelve el codigo de tail. Copia las lineas de resumen al impl.
- Candados globales que NO se mueven (R11): count(CONTINUOUS_CORNER),
  count(bg-accent-soft), directUses de #62 R14, `no deja ningun
  text-accent suelto`, `#62 R4 it.each(radios)`. Si alguno se pone rojo,
  PARA y reportalo; no lo toques.
- No toques backend-pet-tracker/, src/app/(auth)/*, el flujo de signOut,
  src/app/reset-password.tsx ni ningun fichero fuera de la lista de
  design.md §1.2.
- Rellena specs/mobile-welcome-splash/traceability.md con los hashes solo
  en el ultimo commit. No rebasees despues de escribir hashes.
- NO son tuyos, no los toques: progress/history.md, progress/current.md,
  STATUS.md, feature_list.json y las casillas de R13/§Aprobacion de
  requirements.md. Los escribe el leader o el humano. Todo lo que tengas
  que contar va en progress/impl_mobile-welcome-splash.md.
- Si el sandbox te deniega un comando, PARA y reportalo. No lo sustituyas
  por otro que haga lo mismo con otra herramienta.
- NO hagas push ni abras la PR: lo hace el leader al cerrar.

Ficheros que TU cambias, medidos desde H0 (`git diff --name-only H0 HEAD`):
los 16 de design.md §1.2 mas specs/mobile-welcome-splash/traceability.md
(17). Nada mas.

Criterios de aceptacion: R1-R12 de requirements.md. R13 (smoke en
Android) es del humano: no lo marques. S8 (donde aterriza signOut) lo
observa el humano; tu no tocas signOut.

Al terminar, escribe progress/impl_mobile-welcome-splash.md con:
pwd, branch y H0; skills cargadas; la salida de las anclas; la base medida
por suite (jest) y typecheck/lint con exit; los commits con hash y R-id;
por cada rojo, el comando, las cuentas, el exit y cada it rojo con su
matcher, Expected y Received (o la consulta que falla); por cada verde,
sus cuentas y exit; cada sonda de mutacion (R6, R7, R8, R11) con el it
que cae y su asercion o consulta; el cierre (las 7 suites + la nueva,
typecheck, lint) con exit; R12 (`git diff` vacio); `git diff --name-only
H0 HEAD` (17 ficheros); el delta final por fichero; y cualquier decision
que la spec no cerrara literalmente.
```

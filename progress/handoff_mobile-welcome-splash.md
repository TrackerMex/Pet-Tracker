# Handoff a Codex CLI — #118 mobile-welcome-splash

> Pegar el bloque de abajo en Codex CLI. La spec está firmada (commit de firma
> `16c8e565`, aprobación vía Notion el 2026-10-04, `page_last_edited_at`
> 2026-10-04T20:08:35Z). Feature móvil. La prueba de humo en el dev build de
> Android (R13, ocho casillas) es del humano y cierra la feature, no la spec.

> **Corrección del 2026-10-04 (tras la parada de Codex antes de T1).** El
> handoff original decía que el array `blocks` estaba en `ui-language.test.ts`
> (está en `ui-copy-table.ts`) y que legibility no sumaba `it` (su fila nueva
> es un caso más del `it.each`: +1). La spec firmada era correcta en los dos
> puntos; el error era solo de este handoff. Corregidas las anclas y los
> deltas; el nuevo H0 es el commit de esta corrección.

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
  src/__tests__/ui-copy-table.ts                      (sin suite propia: sus
                                                      2 it corren dentro de
                                                      ui-language.test.ts,
                                                      ya incluidos en sus 29)
  src/__tests__/consistency-classnames.test.ts       55
  src/__tests__/legibility-classnames.test.ts        26
  src/__tests__/design-drift.test.ts                 59
Tu medida manda: mide al arrancar y anota antes/despues en el impl.
Delta esperado al cierre: index 0 (un it renombrado), layout +1,
ui-language +1, design-drift +1 (el describe #118 R11 con un solo it, como
#98 R10), legibility +1 (la fila nueva de inkSites es un caso mas del
it.each), language-provider y consistency 0 (cambian sumas, no its); suite NUEVA
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
  ui-copy-table.ts: `R15_GEOFENCE_EDITOR` es el ultimo bloque de ALL_USES
    Y del array `blocks` del it 'cuadra ALL_USES con la suma de sus
    bloques' (los DOS en ui-copy-table.ts) -> R16_WELCOME detras en los dos
  ui-language.test.ts NO tiene array `blocks`: importa R15_GEOFENCE_EDITOR
    de './ui-copy-table' y tiene un describe por bloque (el ultimo,
    `#146 R10: ...`, llama a checkUses(R15_GEOFENCE_EDITOR)). Ahi anades el
    import de R16_WELCOME y `describe('#118 R1: welcome resuelve su copy
    por clave')` -> checkUses(R16_WELCOME) (tasks.md T8.1)
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

== REANUDACION (tras la parada antes de T1) ==

Ya escribiste progress/impl_mobile-welcome-splash.md (sin commitear) con la
parada. NO lo borres: anade al final una seccion «Reanudacion tras la
correccion del handoff» con pwd, branch y el nuevo H0 (`git rev-parse
--short HEAD`, el commit que corrige este handoff). Desde ahi todos los
`git diff --name-only` se miden contra el nuevo H0. Las anclas que ya
verificaste siguen valiendo; repite solo la de ui-copy-table.ts /
ui-language.test.ts y la de legibility con el texto corregido. La base de
jest que mediste (7 suites / 219 / exit=0) vale: el arbol de
mobile-pet-tracker/ no cambia con esta correccion. Faltan typecheck y lint
de base: correlos antes de T1. Luego sigue con T1.
```

---

# Ronda 2 — Enmienda E1–E5 (solo tests)

> El `reviewer` rechazó la ronda 1 (`progress/review_mobile-welcome-splash.md`,
> commit `e1690ede`) por cinco candados ciegos que la propia spec prescribía.
> La producción cumple y no cambia. La Enmienda E1–E5 (`d9542786`) reescribe
> esos candados; pegar el bloque de abajo en Codex **solo después** de que el
> humano apruebe la Enmienda y el leader haga el commit de firma. El bloque
> lo comprueba él mismo (ancla 0) y para si la casilla no está marcada.

```
== RONDA 2 (Enmienda E1-E5, solo tests) ==

Worktree: /home/claude/sites/Pet-Tracker-wt-118   <- PRIMERA LINEA. Trabaja AQUI y en ningun otro sitio
Antes de tocar nada, ejecuta `pwd`, `git branch --show-current`,
`git rev-parse --short HEAD`, `git status --short` y `git log -1 --format=%s`
y pega las cinco salidas en una seccion NUEVA al final de
progress/impl_mobile-welcome-splash.md titulada «Ronda 2 — Enmienda E1–E5».
No borres nada de la ronda 1. El hash es H0 (debe ser el commit de firma de
la Enmienda, el ultimo del leader): todos los `git diff --name-only` de esta
ronda se miden contra el. Para si la branch no es
feature/118-mobile-welcome-splash o si `git status --short` no sale vacio.
No toques /home/claude/sites/Pet-Tracker (sesion del leader),
Pet-Tracker-wt-backend (#117), ni ningun otro worktree, ni cambies de
branch en ninguno.

Que paso: el reviewer rechazo la ronda 1 porque cinco candados que la spec
te prescribia al pie de la letra quedaban verdes contra mutaciones reales.
No es un error tuyo: la spec esta enmendada. La produccion cumple R1-R12 y
NO cambia en esta ronda. Solo cambian las aserciones de
mobile-pet-tracker/src/screens/welcome/index.test.tsx.

Lee enteros:
- specs/mobile-welcome-splash/requirements.md: §«Enmienda E1–E5» y los
  bloques marcados «(Enmienda E5)» en R5, «(Enmienda E4)» en R6 y
  «(Enmiendas E1 y E2)» / «(Enmienda E3)» en R10. El texto de cada
  asercion esta ahi literal: copialo, no lo reescribas.
- specs/mobile-welcome-splash/design.md §2, las filas marcadas (E1)-(E5).
- specs/mobile-welcome-splash/tasks.md T12 (tu guion). T11 es del humano.
- progress/review_mobile-welcome-splash.md §«Hallazgos bloqueantes» E1-E5
  (contexto: el reviewer ya valido cada arreglo verde en la base y rojo en
  su mutacion).

== ANCLAS (ejecutalas desde mobile-pet-tracker/ antes de tocar nada) ==

Si alguna salida difiere de la esperada, PARA y reportalo en el impl.

0. grep -cF -- '- [x] Enmienda E1–E5 aprobada por humano' ../specs/mobile-welcome-splash/requirements.md   -> 1
   (si da 0, la ronda 2 NO esta autorizada: PARA)
1. grep -cF "expect(WELCOME_ENTRANCE_EASING).toBeDefined();" src/screens/welcome/index.test.tsx   -> 1
2. grep -cF "toHaveAnimatedStyle({" src/screens/welcome/index.test.tsx   -> 5
3. grep -cF "shouldMatchAllProps" src/screens/welcome/index.test.tsx   -> 0
4. grep -cF "testUri" src/screens/welcome/index.test.tsx   -> 0
5. grep -cF "expect(chip.props.onPress).toBeUndefined();" src/screens/welcome/index.test.tsx   -> 1
6. grep -cF "it('pinta hero, marca, tagline y legal con sus clases'" src/screens/welcome/index.test.tsx   -> 1
7. grep -cF "it('deja cada chip sin pulsación ni rol de botón'" src/screens/welcome/index.test.tsx   -> 1
8. grep -cF "it('fija la duración y la curva'" src/screens/welcome/index.test.tsx   -> 1
9. grep -cF "require('../../../assets/images/splash-icon.png')" src/screens/welcome/index.tsx   -> 1
10. grep -cF "duration: WELCOME_ENTRANCE_MS," src/screens/welcome/index.tsx   -> 2
11. grep -cF "easing: WELCOME_ENTRANCE_EASING," src/screens/welcome/index.tsx   -> 2
12. grep -cF "reduceMotion: ReduceMotion.Never" src/screens/welcome/index.tsx   -> 1
13. test -e assets/images/logo-glow.png; echo "exit=$?"   -> exit=0

== BASE (antes del primer cambio) ==

Las mismas ocho suites del cierre de la ronda 1, sin pipe:

bunx jest --runTestsByPath --maxWorkers=2 src/app/__tests__/index.test.tsx src/app/__tests__/layout.test.tsx src/providers/__tests__/language-provider.test.tsx src/__tests__/ui-language.test.ts src/__tests__/consistency-classnames.test.ts src/__tests__/legibility-classnames.test.ts src/__tests__/design-drift.test.ts src/screens/welcome/index.test.tsx > /tmp/118-r2-base-jest.log 2>&1; echo "exit=$?"

Esperado: «Test Suites: 8 passed, 8 total», «Tests: 251 passed, 251 total»,
exit=0. Despues `test ! -e .expo/types/router.d.ts; echo "guard_exit=$?"`
(guard_exit=0; si no, PARA y pide al humano que lo borre, nunca rm -f),
`bun run typecheck` y `bun run lint`, cada uno sin pipe y con su exit.
Copia las lineas de resumen al impl. Esta ronda no anade ni quita ningun
`it`: 251 se mantiene en todas las mediciones.

== TEST PRIMERO EN ESTA RONDA (C4) ==

Los candados nuevos NACEN VERDES: la produccion ya cumple. No hay commit
feat ni refactor en esta ronda. El rojo de C4 lo da la SONDA DE MUTACION:
plantas la mutacion en src/screens/welcome/index.tsx SIN commitearla,
corres la suite de welcome, compruebas que cae EXACTAMENTE el it de la
tabla por la causa declarada, y deshaces. NUNCA commitees una mutacion.

Por cada sonda, en este orden:
  a. Planta la mutacion en src/screens/welcome/index.tsx.
  b. bunx jest --runTestsByPath src/screens/welcome/index.test.tsx > /tmp/118-r2-<sonda>.log 2>&1; echo "exit=$?"
     -> exit=1, y SOLO caen los it de la tabla.
  c. Copia al impl: la mutacion (diff), las cuentas, el exit y cada it
     rojo con su matcher, Expected y Received (o el error declarado).
  d. git checkout HEAD -- src/screens/welcome/index.tsx
     git diff --quiet HEAD -- src/screens/welcome/index.tsx; echo "worktree_exit=$?"   -> 0
     git diff --cached --quiet; echo "index_exit=$?"   -> 0
  e. Vuelve a correr la suite de welcome: verde, exit=0.
Si cae un it que no esta en la tabla, o cae por otra causa, PARA y
reportalo. No ajustes la asercion para que cuadre.

== COMMITS (uno por enmienda, solo index.test.tsx, en este orden) ==

1. E5 (R5). En it('pinta hero, marca, tagline y legal con sus clases') anade
   la asercion de props.source de requirements.md R5 «(Enmienda E5)».
   Commit: test(mobile): lock the welcome hero source (#118 R5, E5)
2. E4 (R6 fila 10). En it('deja cada chip sin pulsación ni rol de botón'),
   dentro del forEach, anade props.onClick y props.accessible
   toBeUndefined() segun R6 «(Enmienda E4)». Las dos aserciones que ya
   estan (onPress y accessibilityRole) se quedan.
   Commit: test(mobile): reject a pressable welcome chip (#118 R6, E4)
3. E1 y E2 (R10). En it('fija la duración y la curva'): conserva
   toBe(240); sustituye `expect(WELCOME_ENTRANCE_EASING).toBeDefined();`
   por la referencia literal en NUEVE puntos; anade
   `const source = readSource('screens/welcome/index.tsx');` y las tres
   regex de cableado. Todo literal de R10 «(Enmiendas E1 y E2)». El
   precedente de `jest.requireActual<typeof import(...)>` esta en
   src/app/(tabs)/__tests__/food.test.tsx linea 31 (ruta con parentesis:
   entre comillas si la pasas a un comando).
   Commit: test(mobile): bind the welcome entrance timing to its constants (#118 R10, E1, E2)
4. E3 (R10). En las CINCO llamadas a toHaveAnimatedStyle del describe R10
   anade `alignItems: 'center', gap: 16` al objeto esperado y
   `{ shouldMatchAllProps: true }` como segundo argumento.
   Commit: test(mobile): match every animated welcome style key (#118 R10, E3)
5. Trazabilidad (ultimo commit, solo specs/mobile-welcome-splash/traceability.md):
   en las filas de R5 (pinta hero...), R6 fila 10 y las cuatro de R10,
   anade «; ronda 2 `<hash>` (nace verde; sonda E<n> documentada)» con el
   hash del commit de su enmienda. No toques las demas filas. No rebasees
   despues de escribir hashes.
   Commit: docs(mobile): trace the #118 round 2 locks to their commits

Mensajes de commit en ingles, como en la ronda 1. Cada commit lleva SOLO
su fichero: comprueba `git diff --cached --name-only` antes de cada uno.

== SONDAS (todas en src/screens/welcome/index.tsx) ==

| Tras commit | Sonda | it que debe caer | Causa declarada |
| 1 (E5) | M8: `splash-icon.png` -> `logo-glow.png` en el require del hero | R5 › pinta hero, marca, tagline y legal con sus clases | toEqual sobre props.source (testUri no termina en splash-icon.png) |
| 2 (E4) | S15b: el `<View key={testID} testID={testID} className=...>` del chip pasa a `<Pressable ... onPress={() => {}}>` (importa Pressable de react-native) | R6 › deja cada chip sin pulsación ni rol de botón | toBeUndefined sobre props.onClick o props.accessible |
| 3 (E1) | M1: `duration: 400` a mano en los DOS withTiming (constante intacta) | R10 › fija la duración y la curva | toHaveLength(2) del cableado, Received 0 |
| 3 (E1) | M11: `easing: Easing.linear` solo en el withTiming del fade | R10 › fija la duración y la curva | toHaveLength(2) del cableado, Received 1 |
| 3 (E1) | M2: `WELCOME_ENTRANCE_EASING = Easing.linear` | R10 › fija la duración y la curva | TypeError: `WELCOME_ENTRANCE_EASING.factory is not a function` (Easing.linear es una funcion, no tiene factory). Es el rojo DECLARADO de esta sonda |
| 3 (E1) | M2b: `WELCOME_ENTRANCE_EASING = Easing.bezier(0.25, 0.1, 0.25, 1)` | R10 › fija la duración y la curva | toBeCloseTo en el primer punto que difiere |
| 3 (E2) | M3: quitar la linea `reduceMotion: ReduceMotion.Never,` del fade | R10 › fija la duración y la curva | toHaveLength(1) de ReduceMotion.Never, Received 0 |
| 3 (E2) | M4: `duration: reduceMotion ? 0 : WELCOME_ENTRANCE_MS,` en el fade | R10 › fija la duración y la curva | toHaveLength(2) del cableado, Received 1 |
| 4 (E3) | M6: `marginTop: translateY.get(),` como clave extra en useAnimatedStyle | R10 › arranca invisible..., R10 › termina visible..., R10 › con Reduce Motion no se desplaza (los tres) | toHaveAnimatedStyle con shouldMatchAllProps |

En M3/M4/M1/M11 el `it` se para en la primera asercion que falla: anota
cual es. M2 da TypeError y no asercion porque la referencia necesita
`.factory()`; por eso existe M2b, que debe caer por asercion.

== REGLAS CRITICAS (las de la ronda 1 siguen; las que aplican aqui) ==

- Titulos de it LITERALES: no renombres ningun it ni describe.
- Esperas: docs/conventions.md §Esperas. Esta ronda no cambia ninguna
  espera ni la ventana `WELCOME_ENTRANCE_MS * 2 + 100`: solo cambian los
  objetos esperados y el segundo argumento de toHaveAnimatedStyle.
- Mocks: no toques ningun jest.mock del fichero. El mock parcial de
  reanimated ya expande `...actual`; la referencia de E1 usa
  jest.requireActual a proposito (nunca el simbolo importado de
  produccion).
- Skills (catalogo de Codex): del plugin expo, `building-native-ui`; del
  repo (.agents/skills/), `animate-expo` (R10). Di en el impl cuales
  cargaste. No pidas expo-overview, expo-animation ni expo-router: no
  existen en tu catalogo (silencio, no error).
- Jest: siempre `--runTestsByPath` desde mobile-pet-tracker/. El numero de
  suites que imprime jest debe ser el de ficheros pedidos.
- Typecheck: `test ! -e .expo/types/router.d.ts` antes de CADA
  `bun run typecheck`. Si existe, PARA y pide al humano que lo borre.
  Nunca `rm -f` (tu sandbox lo deniega).
- Mide SIN pipe: `cmd > fichero 2>&1; echo "exit=$?"`.
- R12: ni `bun add`, ni cambios en package.json, bun.lock ni app.json.
  Todo con bun/bunx, nunca npm/npx.
- NO lances ./init.sh ni toques Postgres ni LocalStack.
- Candados globales (R11) que NO se mueven: no tocas ningun fichero
  global en esta ronda.
- NO son tuyos: progress/history.md, progress/current.md, STATUS.md,
  feature_list.json, requirements.md, design.md, tasks.md y las casillas de
  §Aprobacion. Todo lo que tengas que contar va en
  progress/impl_mobile-welcome-splash.md.
- Si el sandbox te deniega un comando, PARA y reportalo. No lo sustituyas
  por otro que haga lo mismo con otra herramienta.
- NO hagas push ni abras la PR.

Ficheros que TU cambias, medidos desde H0 (`git diff --name-only H0 HEAD`):
mobile-pet-tracker/src/screens/welcome/index.test.tsx y
specs/mobile-welcome-splash/traceability.md (2). Mas
progress/impl_mobile-welcome-splash.md, que commiteas junto a la
trazabilidad en el commit 5. Nada mas. `git diff H0 HEAD --
mobile-pet-tracker/src/screens/welcome/index.tsx` debe salir VACIO.

== CIERRE (igual que T10) ==

- Las ocho suites de la BASE, sin pipe: «Test Suites: 8 passed, 8 total»,
  «Tests: 251 passed, 251 total», exit=0.
- guard + `bun run typecheck` exit=0; `bun run lint` exit=0.
- `git diff origin/main -- mobile-pet-tracker/package.json
  mobile-pet-tracker/bun.lock` vacio (R12).
- Anclas de cierre desde mobile-pet-tracker/:
  grep -cF "expect(WELCOME_ENTRANCE_EASING).toBeDefined();" src/screens/welcome/index.test.tsx   -> 0
  grep -cF "shouldMatchAllProps: true" src/screens/welcome/index.test.tsx   -> 5
  grep -cF "testUri" src/screens/welcome/index.test.tsx   -> 1
  grep -cF "chip.props.onClick" src/screens/welcome/index.test.tsx   -> 1
  grep -cF "chip.props.accessible" src/screens/welcome/index.test.tsx   -> 1
  grep -cF "reduceMotion: ReduceMotion\.Never" src/screens/welcome/index.test.tsx   -> 1
- En el impl, seccion «Ronda 2»: pwd/branch/H0; skills cargadas; anclas
  con su salida; base; cada commit con hash y E-id; cada sonda (tabla de
  arriba) con mutacion, cuentas, exit, it rojo y matcher/Expected/Received,
  y los dos exit de la restauracion; el cierre con exit; R12;
  `git diff --name-only H0 HEAD`; y cualquier decision que la spec no
  cerrara literalmente.
```

# Ronda 3 — Enmienda E6–E7 (solo tests)

> El `reviewer` rechazó la ronda 2 (`progress/review_mobile-welcome-splash.md`
> §Ronda 2, commit `7dbef381`) por E6: el candado de `ReduceMotion.Never` que
> la Enmienda E2 prescribía cuenta en todo el fichero y no lo ata al fade.
> E1, E3, E4 y E5 quedaron cerrados. La Enmienda E6–E7 (`3ce82306`) añade dos
> líneas en R10 y una en R6 fila 10. Pegar el bloque de abajo en Codex **solo
> después** de que el humano apruebe la Enmienda y el leader haga el commit de
> firma. El bloque lo comprueba él mismo (ancla 0) y para si la casilla no
> está marcada. Anclas 1–13 verificadas por el leader sobre `f23345c3`; las de
> cierre, sobre una copia del test con las tres líneas añadidas.

```
== RONDA 3 (Enmienda E6-E7, solo tests) ==

Worktree: /home/claude/sites/Pet-Tracker-wt-118   <- PRIMERA LINEA. Trabaja AQUI y en ningun otro sitio
Antes de tocar nada, ejecuta `pwd`, `git branch --show-current`,
`git rev-parse --short HEAD`, `git status --short` y `git log -1 --format=%s`
y pega las cinco salidas en una seccion NUEVA al final de
progress/impl_mobile-welcome-splash.md titulada «Ronda 3 — Enmienda E6–E7».
No borres nada de las rondas 1 y 2. El hash es H0 (debe ser el commit de
firma de la Enmienda E6–E7, el ultimo del leader): todos los
`git diff --name-only` de esta ronda se miden contra el. Para si la branch no
es feature/118-mobile-welcome-splash o si `git status --short` no sale vacio.
No toques /home/claude/sites/Pet-Tracker (alli trabaja otra sesion de Codex
en #116), Pet-Tracker-wt-backend (#117), ni ningun otro worktree, ni cambies
de branch en ninguno.

Que paso: el reviewer rechazo la ronda 2 por UN candado que la spec te
prescribia al pie de la letra: `ReduceMotion.Never` se contaba en todo el
fichero, asi que moverlo al withTiming de translateY quedaba verde. No es un
error tuyo. La produccion cumple y NO cambia. Solo cambian tres lineas de
mobile-pet-tracker/src/screens/welcome/index.test.tsx.

Lee enteros:
- specs/mobile-welcome-splash/requirements.md: §«Enmienda E6–E7», el bloque
  «(Enmienda E6)» dentro de R10 (test 'fija la duración y la curva') y el
  bloque «(Enmienda E7)» de R6. El texto de cada asercion esta ahi literal:
  copialo, no lo reescribas.
- specs/mobile-welcome-splash/design.md §2, filas (E6, X1), (E6, X2) y (E7, X7).
- specs/mobile-welcome-splash/tasks.md T13 (tu guion). T11 es del humano.
- progress/review_mobile-welcome-splash.md §Ronda 2 › «Hallazgo bloqueante»
  E6 y obs. 2 (el reviewer ya valido los arreglos).

== ANCLAS (ejecutalas desde mobile-pet-tracker/ antes de tocar nada) ==

Si alguna salida difiere de la esperada, PARA y reportalo en el impl.

0. grep -cF -- '- [x] Enmienda E6–E7 aprobada por humano' ../specs/mobile-welcome-splash/requirements.md   -> 1
   (si da 0, la ronda 3 NO esta autorizada: PARA)
1. grep -cF "expect(source.match(/reduceMotion: ReduceMotion\.Never/g) ?? []).toHaveLength(1);" src/screens/welcome/index.test.tsx   -> 1
2. grep -cF '\breduceMotion:/g' src/screens/welcome/index.test.tsx   -> 0
3. grep -cF 'opacity\.set\(withTiming' src/screens/welcome/index.test.tsx   -> 0
4. grep -cF "chip.props.role" src/screens/welcome/index.test.tsx   -> 0
5. grep -cF "expect(chip.props.accessibilityRole).not.toBe('button');" src/screens/welcome/index.test.tsx   -> 1
6. grep -cF "it('fija la duración y la curva'" src/screens/welcome/index.test.tsx   -> 1
7. grep -cF "it('deja cada chip sin pulsación ni rol de botón'" src/screens/welcome/index.test.tsx   -> 1
8. grep -cF "reduceMotion: ReduceMotion.Never," src/screens/welcome/index.tsx   -> 1
9. grep -cF "opacity.set(withTiming(1, {" src/screens/welcome/index.tsx   -> 1
10. grep -cF "translateY.set(withTiming(0, {" src/screens/welcome/index.tsx   -> 1
11. grep -cF "reduceMotion:" src/screens/welcome/index.tsx   -> 1
12. grep -cE "^\s*it(\.each\(.*\))?\(" src/screens/welcome/index.test.tsx   -> 28
13. grep -cF "ReduceMotion.Always" src/screens/welcome/index.tsx   -> 0

== BASE (antes del primer cambio) ==

Las mismas ocho suites de la ronda 2, sin pipe:

bunx jest --runTestsByPath --maxWorkers=2 src/app/__tests__/index.test.tsx src/app/__tests__/layout.test.tsx src/providers/__tests__/language-provider.test.tsx src/__tests__/ui-language.test.ts src/__tests__/consistency-classnames.test.ts src/__tests__/legibility-classnames.test.ts src/__tests__/design-drift.test.ts src/screens/welcome/index.test.tsx > /tmp/118-r3-base-jest.log 2>&1; echo "exit=$?"

Esperado: «Test Suites: 8 passed, 8 total», «Tests: 251 passed, 251 total»,
exit=0. Despues `test ! -e .expo/types/router.d.ts; echo "guard_exit=$?"`
(guard_exit=0; si no, PARA y pide al humano que lo borre, nunca rm -f),
`bun run typecheck` y `bun run lint`, cada uno sin pipe y con su exit.
Copia las lineas de resumen al impl. Esta ronda no anade ni quita ningun
`it`: 251 se mantiene en todas las mediciones.

== TEST PRIMERO EN ESTA RONDA (C4) ==

Igual que la ronda 2: los candados NACEN VERDES y el rojo de C4 lo da la
SONDA DE MUTACION. Plantas la mutacion en src/screens/welcome/index.tsx SIN
commitearla, corres la suite de welcome, compruebas que cae EXACTAMENTE el
it de la tabla por la causa declarada, y deshaces. NUNCA commitees una
mutacion.

Por cada sonda, en este orden:
  a. Planta la mutacion en src/screens/welcome/index.tsx.
  b. bunx jest --runTestsByPath src/screens/welcome/index.test.tsx > /tmp/118-r3-<sonda>.log 2>&1; echo "exit=$?"
     -> exit=1, y SOLO cae el it de la tabla.
  c. Copia al impl: la mutacion (diff), las cuentas, el exit y el it rojo
     con su matcher, Expected y Received.
  d. git checkout HEAD -- src/screens/welcome/index.tsx
     git diff --quiet HEAD -- src/screens/welcome/index.tsx; echo "worktree_exit=$?"   -> 0
     git diff --cached --quiet; echo "index_exit=$?"   -> 0
  e. Vuelve a correr la suite de welcome: verde, exit=0.
Si cae un it que no esta en la tabla, o cae por otra causa, PARA y
reportalo. No ajustes la asercion para que cuadre.

== COMMITS (uno por enmienda, en este orden) ==

1. E6 (R10). En it('fija la duración y la curva'), JUSTO DESPUES de la linea
   del ancla 1 (que se queda, igual que las otras dos regex de cableado),
   anade estas dos lineas, literales de R10 «(Enmienda E6)»:
     expect(source.match(/\breduceMotion:/g) ?? []).toHaveLength(1);
     expect(source).toMatch(/opacity\.set\(withTiming\(1, \{[^}]*reduceMotion: ReduceMotion\.Never,[^}]*\}\)\)/);
   Commit: test(mobile): tie reduceMotion to the welcome fade (#118 R10, E6)
2. E7 (R6 fila 10). En it('deja cada chip sin pulsación ni rol de botón'),
   dentro del forEach, JUSTO DESPUES de la linea del ancla 5, anade:
     expect(chip.props.role).toBeUndefined();
   Commit: test(mobile): reject a role=button welcome chip (#118 R6, E7)
3. Trazabilidad (ultimo commit: specs/mobile-welcome-splash/traceability.md
   y progress/impl_mobile-welcome-splash.md): en la fila de R6
   «deja cada chip sin pulsación ni rol de botón» (fila 10) y en la de R10
   «fija la duración y la curva», anade al final de la ultima celda
   «; ronda 3 `<hash>` (nace verde; sonda E<n> documentada)» con el hash del
   commit de su enmienda. No toques las demas filas. No rebasees despues de
   escribir hashes.
   Commit: docs(mobile): trace the #118 round 3 locks to their commits

Mensajes de commit en ingles, como en las rondas 1 y 2. Los commits 1 y 2
llevan SOLO index.test.tsx: comprueba `git diff --cached --name-only` antes
de cada uno.

== SONDAS (todas en src/screens/welcome/index.tsx) ==

| Tras commit | Sonda | it que debe caer | Causa declarada |
| 1 (E6) | X1: mueve la linea `reduceMotion: ReduceMotion.Never,` del withTiming del fade (opacity) al withTiming de translateY, justo despues de su `easing: WELCOME_ENTRANCE_EASING,` | R10 › fija la duración y la curva | el `toMatch` nuevo (opacity.set(withTiming(1, {...Never...}))) no casa. Las tres regex de cableado y el recuento de `\breduceMotion:` siguen pasando |
| 1 (E6) | X2: anade `reduceMotion: ReduceMotion.Always,` al withTiming de translateY, justo despues de su `easing: WELCOME_ENTRANCE_EASING,` (el del fade no cambia) | R10 › fija la duración y la curva | toHaveLength(1) de `\breduceMotion:`, Received 2 |
| 1 (E6) | M3: quita la linea `reduceMotion: ReduceMotion.Never,` del fade | R10 › fija la duración y la curva | toHaveLength(1) de ReduceMotion.Never (regex de cableado ya existente), Received 0: es la primera asercion que falla |
| 2 (E7) | X7: anade `role="button"` al `<View key={testID} testID={testID} ...>` de cada chip (es un solo View dentro del map), sin onPress | R6 › deja cada chip sin pulsación ni rol de botón | toBeUndefined sobre props.role, Received "button" |

== REGLAS CRITICAS (las de las rondas 1 y 2 siguen; las que aplican aqui) ==

- Titulos de it LITERALES: no renombres ningun it ni describe.
- Esperas: docs/conventions.md §Esperas. Esta ronda no cambia ninguna
  espera ni ventana de timers.
- Mocks: no toques ningun jest.mock del fichero.
- Skills (catalogo de Codex): del plugin expo, `building-native-ui`; del
  repo (.agents/skills/), `animate-expo` (R10). Di en el impl cuales
  cargaste. No pidas expo-overview, expo-animation ni expo-router: no
  existen en tu catalogo (silencio, no error).
- Jest: siempre `--runTestsByPath` desde mobile-pet-tracker/. El numero de
  suites que imprime jest debe ser el de ficheros pedidos.
- Typecheck: `test ! -e .expo/types/router.d.ts` antes de CADA
  `bun run typecheck`. Si existe, PARA y pide al humano que lo borre.
  Nunca `rm -f` (tu sandbox lo deniega).
- Mide SIN pipe: `cmd > fichero 2>&1; echo "exit=$?"`.
- R12: ni `bun add`, ni cambios en package.json, bun.lock ni app.json.
  Todo con bun/bunx, nunca npm/npx.
- NO lances ./init.sh ni toques Postgres ni LocalStack.
- NO son tuyos: progress/history.md, progress/current.md, STATUS.md,
  feature_list.json, requirements.md, design.md, tasks.md y las casillas de
  §Aprobacion. Todo lo que tengas que contar va en
  progress/impl_mobile-welcome-splash.md.
- Si el sandbox te deniega un comando, PARA y reportalo. No lo sustituyas
  por otro que haga lo mismo con otra herramienta.
- NO hagas push ni abras la PR.

Ficheros que TU cambias, medidos desde H0 (`git diff --name-only H0 HEAD`):
mobile-pet-tracker/src/screens/welcome/index.test.tsx,
specs/mobile-welcome-splash/traceability.md y
progress/impl_mobile-welcome-splash.md (3). Nada mas.
`git diff H0 HEAD -- mobile-pet-tracker/src/screens/welcome/index.tsx` debe
salir VACIO.

== CIERRE (igual que T10) ==

- Las ocho suites de la BASE, sin pipe: «Test Suites: 8 passed, 8 total»,
  «Tests: 251 passed, 251 total», exit=0.
- guard + `bun run typecheck` exit=0; `bun run lint` exit=0.
- `git diff origin/main -- mobile-pet-tracker/package.json
  mobile-pet-tracker/bun.lock` vacio (R12).
- Anclas de cierre desde mobile-pet-tracker/:
  grep -cF "expect(source.match(/\breduceMotion:/g) ?? []).toHaveLength(1);" src/screens/welcome/index.test.tsx   -> 1
  grep -cF "expect(source).toMatch(/opacity\.set\(withTiming\(1, \{[^}]*reduceMotion: ReduceMotion\.Never,[^}]*\}\)\)/);" src/screens/welcome/index.test.tsx   -> 1
  grep -cF "expect(chip.props.role).toBeUndefined();" src/screens/welcome/index.test.tsx   -> 1
  grep -cF "expect(source.match(/reduceMotion: ReduceMotion\.Never/g) ?? []).toHaveLength(1);" src/screens/welcome/index.test.tsx   -> 1
  grep -cE "^\s*it(\.each\(.*\))?\(" src/screens/welcome/index.test.tsx   -> 28
- En el impl, seccion «Ronda 3»: pwd/branch/H0; skills cargadas; anclas
  con su salida; base; cada commit con hash y E-id; cada sonda (tabla de
  arriba) con mutacion, cuentas, exit, it rojo y matcher/Expected/Received,
  y los dos exit de la restauracion; el cierre con exit; R12;
  `git diff --name-only H0 HEAD`; y cualquier decision que la spec no
  cerrara literalmente.
```

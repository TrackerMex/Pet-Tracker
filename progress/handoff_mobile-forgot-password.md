# Handoff a Codex CLI — #117 mobile-forgot-password

> Pegar el bloque de abajo en Codex CLI. La spec está firmada (commit de firma
> `6a85ea5c`, aprobación vía Notion el 2026-10-04, `page_last_edited_at`
> 2026-10-04T20:26:30Z). Feature móvil. La prueba de humo en el dev build de
> Android (§Prueba de humo, S1–S9) es del humano y cierra la feature, no la
> spec.

---

```
Worktree: /home/claude/sites/Pet-Tracker-wt-backend   <- PRIMERA LINEA. Trabaja AQUI y en ningun otro sitio
Antes de tocar nada, ejecuta `pwd`, `git branch --show-current` y
`git rev-parse --short HEAD` y pega las tres salidas al principio de
progress/impl_mobile-forgot-password.md. El hash es H0 (el commit que anade
este handoff): todos los `git diff --name-only` se miden contra el. Para si
la branch no es feature/117-mobile-forgot-password.
No toques /home/claude/sites/Pet-Tracker (#116), Pet-Tracker-wt-118 (#118,
otro Codex), ni ningun otro worktree, ni cambies de branch en ninguno.
node_modules ya esta instalado en mobile-pet-tracker/ (jest, typecheck y
lint verdes hoy sobre H0).

Feature: mobile-forgot-password (#117)
Branch: feature/117-mobile-forgot-password
Spec aprobada: specs/mobile-forgot-password/requirements.md
(status: approved, firma 6a85ea5c)
Lee tambien, enteros: specs/mobile-forgot-password/design.md, tasks.md y
traceability.md. tasks.md es tu guion (T1-T11). En requirements.md: §Contexto
(contrato real del backend: 200 `{ requested: true }` siempre, 400 zod, 429
desde la cuarta peticion por correo y hora), §Convenciones de esta spec
(renderRoute, mocks por intencion, esperas, consulta vs asercion, literales
`es`, nombres de simbolos), R1 (seis claves con literales EN/ES exactos),
R2 (ForgotPasswordState por kind), R3-R9 (route delgado, formulario, envio,
reenvio, errores, KAV, metricas), R10 (candados globales como deltas), R11
(anti-enumeracion), §Aserciones existentes que se reapuntan, §Candados
globales. En design.md: D1-D16 (todo cerrado: no reabras nada), §Arbol de
la pantalla (testIDs y clases exactos), §Handler, §Cliente, §Archivos
afectados. Contexto de diseno (solo lectura, no es spec):
progress/explore_ui-appllama.md §0 y §2 en origin/feature/118-mobile-welcome-splash
(`git show origin/feature/118-mobile-welcome-splash:progress/explore_ui-appllama.md`);
NO lo copies a esta branch.

== QUE HACES ==

La pantalla forgot deja de ser un stub «disponible pronto». Dos estados en
UNA pantalla (D3, D10): (a) formulario con un solo campo de correo y CTA
«Enviar enlace de recuperacion»; (b) tras `ok`, la misma pantalla pasa a
«Revisa tu correo» citando el correo enviado, con «Reenviar» (secundario,
repite el mismo POST) y «Volver al inicio de sesion». Exito identico exista
o no la cuenta (R11): el cliente no lee el cuerpo en 200 ni en 429.

Cliente (R2, design.md §Cliente): `forgotPassword(baseUrl, body, fetchFn)`
en src/api/auth.ts con la misma fontaneria que `resetPassword` (postJson +
readJson + validationErrors); `ForgotPasswordState` = ok | rate-limited |
validation | error | unreachable | missing-config; `ForgotPasswordRequest`
en src/api/types.ts. 200 -> ok sin leer body; 429 -> rate-limited sin leer
body; 400 con errors de zod -> validation; 400 sin errors -> error (D2);
otro status -> error; rechazo de fetch -> unreachable; baseUrl ausente ->
missing-config sin fetch.

Pantalla (R3-R9, design.md §Arbol): src/app/(auth)/forgot.tsx queda como
route delgado que devuelve <ForgotScreen /> (import desde
'../../screens/forgot'); la pantalla vive en src/screens/forgot/index.tsx
(export con nombre `ForgotScreen`). KeyboardAvoidingView
testID="screen-forgot" behavior="padding" keyboardVerticalOffset={headerHeight}
con `HeaderHeightContext` importado como en
src/screens/reset-password/index.tsx (grep ahi, no de memoria) > un UNICO
ScrollView testID="forgot-form" con el contentContainerStyle literal del
stub (padding 24, gap 16, paddingTop insets.top + 12, paddingBottom
insets.bottom + 24, centrado) y keyboardShouldPersistTaps="handled" > tile
Lock identico al stub (misma className, CONTINUOUS_CORNER, accentStrong via
useThemeColors(['accent-strong'])) / forgot-title / forgot-body /
[!sent] TextField+Input forgot-email EDITABLE (autoCapitalize none,
keyboardType email-address, autoComplete email, textContentType
emailAddress, SIN placeholder) / [error] Text forgot-error text-danger
selectable / [!sent] Button forgot-submit `w-full rounded-xl bg-accent`
isDisabled={email.trim() === '' || submitting} / [sent] Button forgot-resend
variant="secondary" `w-full rounded-xl` con label `font-bold text-foreground`
(SIN bg-accent-soft, SIN text-accent-strong: D12) isDisabled={submitting} /
LinkButton link-login -> router.push('/login'). Handler `send(target)` de
design.md §Handler, sin try/catch (D14), con `case 'error': case
'missing-config':` en fallthrough (D15: UNA sola t('common.somethingWentWrong')).
Se envia `email.trim()` sin pasar a minusculas (D16). Sin temporizador ni
TTL. `grep -c Platform src/screens/forgot/index.tsx` = 0.
src/app/(auth)/__tests__/forgot.test.tsx se elimina con `git rm` (D1); sus
cuatro `it` se reapuntan como dice §Aserciones existentes que se reapuntan.

Copy (R1): seis claves forgot.* nuevas con los literales EXACTOS de la tabla
de R1, en `en` y en `es`, en src/i18n/catalog.ts junto a las forgot.* que ya
existen; `forgot.comingSoon` se retira de los dos idiomas (en T3, cuando
muere el stub). No inventes ni traduzcas: copia la tabla. Todo texto visible
pasa por t(). Recuento normativo final de `t(` en la pantalla: 12.

== BASE ==

HEAD de la branch contiene origin/main b2a9c2aa (merge de #148);
mobile-pet-tracker/ no ha cambiado desde entonces en esta branch. Al
arrancar: `git fetch origin` y
`git merge-base --is-ancestor b2a9c2aa HEAD; echo "exit=$?"` -> exit=0.
Si origin/main ya NO es b2a9c2aa (#118 mergeado antes que tu), PARA y
anotalo en el impl: tasks.md §Antes de empezar dice «medir y aplicar como
diferencias», pero el merge de main en la branch lo hace el leader, no tu.
Nunca rebasees.

Base medida por el leader el 2026-10-04 sobre 6a85ea5c (mismo arbol de
mobile-pet-tracker/ que H0; desde mobile-pet-tracker/,
`bunx jest --runTestsByPath --maxWorkers=2` de las 8 suites, exit=0):
8 suites / 243 tests / 0 failed. `bun run typecheck` exit=0,
`bun run lint` exit=0, `.expo/types/router.d.ts` no existe.
  src/api/__tests__/auth.test.ts                     29
  src/providers/__tests__/language-provider.test.tsx 22
  src/__tests__/ui-language.test.ts                  29
  src/__tests__/consistency-classnames.test.ts       55
  src/__tests__/legibility-classnames.test.ts        26
  src/__tests__/design-drift.test.ts                 59  (no se toca; candado de que nada se cuela)
  src/app/(auth)/__tests__/forgot.test.tsx            4  (se elimina en T3)
  src/screens/reset-password/index.test.tsx          19  (referencia de patron; no se toca)
Tu medida manda: mide al arrancar y anota antes/despues en el impl.
Delta esperado al cierre (orientativo, lo que manda es cada `it` de la
spec): auth +11 (R2 ocho `it`, contando las dos filas del it.each, y R11
tres), language-provider +2 (R1), ui-language 0, consistency 0,
legibility 0, design-drift 0 (cambian sumas y rutas, no `it`),
forgot.test.tsx -4 (suite eliminada), reset-password 0; suite NUEVA
src/screens/forgot/index.test.tsx con 20 `it` (R3 2, R4 3, R5 2, R6 2,
R7 6 contando las 5 filas del it.each, R8 1, R9 1 nuevo + 2 reapuntados,
R11 1). Cero `it` perdidos: los 4 de la suite eliminada se reapuntan o se
invierten como dice §Aserciones existentes.

Anclas (valores medidos sobre 6a85ea5c; anclas por CONTENIDO, los numeros
de linea son orientativos). Verifica cada una al arrancar con grep y copia
la salida al impl; si alguna no da EXACTAMENTE lo esperado, PARA y avisa:
  language-provider.test.tsx: la suma de englishKeys termina en
    `+ 9 + 9, // #105 R5` (1 coincidencia, linea ~56) -> T2 le anade
    `+ 6` y T3 `- 1`; al cierre `+ 9 + 9 + 6 - 1, // #105 R5; #117 R1`
  ui-language.test.ts: `expect(R1_AUTH).toHaveLength(29)` y el titulo
    `'resuelve las 29 ocurrencias normativas'` (lineas ~70-71) -> T5
    `29 + 3 // #117 R10` (titulo 32), T6 `29 + 7 // #117 R10` (titulo 36)
  ui-language.test.ts: `toHaveLength(19 + 2 + 1 + 1 + 1 + 1 + 1 + 1 + 1)`
    (1, linea ~490) -> `+ 1 - 1` con comentario
    `#117 R10: sale app/(auth)/forgot.tsx, entra screens/forgot/index.tsx`.
    OJO: SCREEN_FILES se DERIVA de ALL_USES (`ALL_USES.map((use) => use.file)`
    con dedupe, linea ~404): al mover las 5 filas de ui-copy-table.ts el
    valor no cambia; el `+ 1 - 1` es declaracion, no ajuste
  ui-copy-table.ts › R1_AUTH: 5 filas `file: 'src/app/(auth)/forgot.tsx'`
    (lineas ~16-20: forgotPassword, comingSoon, email, sendRecoveryLink,
    backToSignIn) -> T3 las 5 pasan a `src/screens/forgot/index.tsx`
    (comingSoon se cambia por instructions); T5 +3 (checkYourEmail,
    sentTo, resend); T6 +4 (invalidEmail, tooManyAttempts,
    common.cannotReachServer, common.somethingWentWrong x1). Al cierre 12
    filas de la pantalla y `grep -c "src/app/(auth)/forgot.tsx"` = 0.
    checkUses exige igualdad fila/llamada `t(` POR COMMIT: cada fila entra
    en el verde que anade su `t(`
  consistency-classnames.test.ts: `join('app', '(auth)', 'forgot.tsx')`
    = 4 coincidencias -> T3 las 4 pasan a
    `join('screens', 'forgot', 'index.tsx')`; literales `toContain` sin
    cambio; totales (CONTINUOUS_CORNER, `rounded-xl bg-accent`,
    bg-accent-soft, directUses) sin cambio; al cierre grep = 0
  legibility-classnames.test.ts: fila
    `[join('app', '(auth)', 'forgot.tsx'), 1],` en inkSites (1, linea ~148)
    -> ruta a `join('screens', 'forgot', 'index.tsx')`, cuenta sigue 1;
    suma `13 + 1 + 1` y guards sin cambio; al cierre grep = 0
  design-drift.test.ts: `grep -ci forgot` = 0 -> sigue 0 (nada se anade)
  ui-language.test.ts: `grep -ci forgot` = 0 -> solo el comentario del
    delta de SCREEN_FILES, nada en codigo ni tablas
  src/i18n/catalog.ts: 5 claves `'forgot.` en `en` (lineas ~10-14) y 5 en
    `es` (~367-371), comingSoon incluida en ambas
  src/screens/reset-password/index.tsx: `import { HeaderHeightContext }
    from 'expo-router/react-navigation';` (linea 1)
  specs/mobile-ui-language/design.md: `| src/app/(auth)/forgot.tsx | 5 | R1 |`
    (§1, ~81), `| src/app/(auth)/__tests__/forgot.test.tsx | 1 |` (~105),
    `**mobile-pet-tracker/src/app/(auth)/forgot.tsx** — 5 ocurrencias`
    (§2.1, ~231) y la cabecera `grupo (auth) (29 ocurrencias, 23 claves)`
    -> §Candados globales de requirements.md dice que pasa a ser cada una
  src/screens/forgot/ NO existe
  mobile-pet-tracker/.expo/types/router.d.ts NO existe
Los `+N` de la spec son DELTAS sobre lo que midas, nunca absolutos.

== COMMITS ==

Mensajes LITERALES, en este orden (conventions §Commits: en ingles; el
patron rojo/verde de tasks.md se concreta aqui). Rojo SIEMPRE antes que su
verde; un commit con todo incumple C4 (paso en #19):
  test(mobile): lock the forgotPassword client by kind (#117 R2)
      <- T1 rojo: el unico rojo que cae por sujeto ausente
         (`forgotPassword` no exportado: TypeError al invocarlo). Es la
         excepcion declarada en tasks.md T1; anotala en el impl
  feat(mobile): add the forgotPassword client to the auth api (#117 R2)
  test(mobile): lock the six forgot catalog keys (#117 R1)
      <- T2 rojo: R1 it 1 (claves ausentes y filas ausentes en design.md §2.1)
  feat(mobile): add the forgot copy in both languages (#117 R1)
      <- incluye `+ 6` en el candado de longitud y las seis filas
         `← añadida por #117 (R1)` en specs/mobile-ui-language/design.md §2.1
         (el bloque aun se llama src/app/(auth)/forgot.tsx)
  test(mobile): lock the forgot route, screen tree and stub removal (#117 R3, R1)
      <- T3 rojo: `git rm src/app/(auth)/__tests__/forgot.test.tsx`; suite
         nueva src/screens/forgot/index.test.tsx con renderRoute(), R3 it 1-2
         y los dos `it` reapuntados `#61 R8` y `#127 R1` (mismos describe y
         titulos, leyendo forgot-form); R1 it 2 en language-provider. Caen
         por consulta (forgot-form) y por asercion (comingSoon definido).
         `#127 R1` puede nacer verde (misma className en el stub): anotalo
  feat(mobile): move forgot to its own screen behind a thin route (#117 R3, R1)
      <- pantalla ESTATICA en estado (a): sin useState, forgot-submit
         isDisabled constante, sin forgot-error ni forgot-resend, KAV y
         ScrollView ya con screen-forgot/forgot-form; route delgado;
         comingSoon fuera del catalogo y `- 1` en el candado; las 5 filas
         de ui-copy-table movidas (comingSoon -> instructions);
         `+ 1 - 1` de SCREEN_FILES; 4 rutas de consistency; ruta de
         legibility; design.md §1 filas movidas, §2.1 bloque renombrado,
         fila comingSoon `← retirada por #117 (R1)`, cabecera de §2.1.
         Rojos en cascada ACEPTADOS dentro de este verde: los candados de
         rutas (consistency/legibility/checkUses) solo cuadran cuando
         entran juntos con la pantalla
  test(mobile): lock the forgot form state (#117 R4)
  feat(mobile): make the forgot email editable and gate submit on it (#117 R4)
  test(mobile): lock the check-your-email state after sending (#117 R5)
  feat(mobile): request the recovery link and switch to check your email (#117 R5)
      <- submitting/sent/submittedEmail, handler solo con la rama ok,
         forgot-resend presente sin onPress util (R6 lo cablea); +3 filas
         en ui-copy-table; `29 + 3 // #117 R10` y titulo con 32
  test(mobile): lock the forgot error copy for every non-ok kind (#117 R7)
  feat(mobile): map every non-ok kind to its forgot error copy (#117 R7)
      <- error state, setError(null) al arrancar, switch completo con
         fallthrough error/missing-config, forgot-error; +4 filas;
         `29 + 7 // #117 R10` y titulo con 36
  test(mobile): lock resend from check your email (#117 R6)
  feat(mobile): resend the recovery link with the submitted email (#117 R6)
      <- forgot-resend llama send(submittedEmail) con isDisabled={submitting};
         forgot-error se pinta tambien con sent (D11)
  test(mobile): lock the forgot keyboard avoidance (#117 R8)
  test(mobile): lock the forgot metrics across both states (#117 R9)
  test(mobile): lock anti-enumeration in the forgot client and screen (#117 R11)
      <- R8/R9/R11 nacen verdes si T3-T7 dejaron el arbol exacto. Entonces
         el commit test(...) ES el registro; la sonda de mutacion (M8-c,
         M9-b, M11-a) NO se commitea: la plantas, anotas el `it` que cae
         con Expected/Received en el impl y la reviertes con
         `git checkout HEAD -- <ruta>`; `git diff --cached --stat` vacio.
         Si alguno sale rojo de verdad, su verde es
         fix(mobile): <que> (#117 R<n>)
  docs(mobile): trace #117 R1-R11 to their tests and commits
El ultimo lleva SOLO specs/mobile-forgot-password/traceability.md y
progress/impl_mobile-forgot-password.md. Un refactor va en su propio
commit `refactor(mobile): <que> (#117 R<n>)` tras su verde.

== REGLAS CRITICAS ==

- Convenciones: docs/conventions.md (describe con prefijo `#117 R<n>:` en
  TODOS los ficheros, tambien en la suite nueva; titulos de `it` LITERALES
  de requirements.md, no los traduzcas ni acortes; los dos reapuntados
  conservan sus describe/it de hoy).
- Esperas: docs/conventions.md §Esperas sobre el arbol renderizado. Se
  espera sobre el nodo (findBy*/waitFor sobre forgot-submit, forgot-resend,
  forgot-error, el texto «Revisa tu correo»), NUNCA sobre el contador del
  mock (#146 R7 paro por eso). Las peticiones en vuelo se simulan con
  promesa controlada (R5 it 1, R6 it 1) y se resuelven dentro de `act`.
- Mocks: por INTENCION, no copia literal de otra suite; verifica contra el
  fichero destino. Precedentes: src/screens/reset-password/index.test.tsx
  (renderRoute async por el route, HeroUINativeProvider + LanguageProvider
  initial="es", Platform.OS volteado DENTRO del `it` de R8 y restaurado en
  afterEach, sonda keyboardDidShow de #148), src/app/(auth)/__tests__/login.test.tsx
  (process.env.EXPO_PUBLIC_API_URL fijado en beforeEach y restaurado en
  afterEach). jest.mock('../../api/auth') expone forgotPassword como
  jest.fn() SIN valor por defecto; cada `it` fija el suyo. Insets del mock
  de safe-area: { top: 40, right: 0, bottom: 24, left: 0 } (R9 da 52/48).
  SIN contenedor de navegacion: HeaderHeightContext undefined, offset 0.
- Consulta vs asercion: cada tabla de sondas de requirements.md dice si la
  mutacion cae por consulta (getByTestId/findBy* no encuentra el nodo) o por
  asercion (el expect falla). Un rojo debe caer EXACTAMENTE por lo que la
  tabla declara, nunca por SyntaxError, ReferenceError, TypeError o import
  roto, salvo T1 (sujeto ausente declarado) y los rojos en cascada
  declarados dentro del verde de T3. Si cae otro `it`, PARA y reportalo. No
  ajustes ninguna asercion ni ningun candado global para que cuadre.
- Sondas de mutacion obligatorias (tasks.md T11, una por R-id): M1-b, M2-b,
  M3-a, M4-b, M5-a, M6-b, M7-g, M8-c, M9-b, M10-c, M11-a. Plantadas y
  revertidas, con el `it` que cayo y si fue por consulta o asercion, en el
  impl. Ninguna se commitea.
- UI movil: docs/ui-guidelines.md rige (gate C8). Skills a cargar y a decir
  en el impl cuales cargaste: del plugin expo de Codex, `building-native-ui`;
  del repo (.agents/skills/), `appllama-app-design-skill` (la carta la exige
  al cambiar una pantalla o un flujo). NO cargues `animate-expo` (no hay
  animacion en #117) ni `native-data-fetching` (el cliente esta cerrado en
  design.md §Cliente: copia la fontaneria de resetPassword, nada de
  TanStack ni fetch nuevo). No pidas skills por otros nombres
  (expo-overview, expo-animation, expo-router no existen en Codex: silencio,
  no error). Appllama MCP no esta en Codex y no hace falta: el diseno ya
  esta cerrado en la spec. Sin gradiente, sin emoji, sin hex, sin
  StyleSheet.create, sin rounded-2xl|lg|md|sm, sin text-accent suelto, sin
  `useThemeColors([... 'accent' ...])` (guards de legibility).
- Dependencias: ni `bun add`, ni cambios en package.json, bun.lock ni
  app.json. Todo con bun/bunx, nunca npm/npx/yarn.
  `git diff origin/main -- mobile-pet-tracker/package.json
  mobile-pet-tracker/bun.lock` vacio al cerrar; copia la salida (vacia) al impl.
- Jest: siempre `--runTestsByPath` desde mobile-pet-tracker/. La ruta
  'src/app/(auth)/__tests__/forgot.test.tsx' (mientras exista) y cualquier
  ruta con parentesis van ENTRE COMILLAS. Tras cada comando, el numero de
  suites que imprime jest debe ser el de ficheros pedidos; tras T3, pedir
  'src/app/(auth)/' debe listar login y register y ninguna suite forgot.
- Typecheck: `test ! -e .expo/types/router.d.ts` antes de CADA
  `bun run typecheck`. Si existe, PARA y pide al humano que lo borre. Nunca
  `rm -f` (tu sandbox lo deniega). Solo `expo start` regenera ese fichero.
- NO lances ./init.sh ni toques Postgres ni LocalStack: los comparten otras
  sesiones. Se mide con bunx jest, bun run typecheck y bun run lint desde
  mobile-pet-tracker/.
- Mide SIN pipe: `cmd > fichero 2>&1; echo "exit=$?"`. `cmd | tail`
  devuelve el codigo de tail. Copia las lineas de resumen al impl.
- Candados globales que NO se mueven (R10): count(CONTINUOUS_CORNER),
  count(`rounded-xl bg-accent`), count(bg-accent-soft), directUses de
  #62 R14, suma `13 + 1 + 1` de inkSites, `no deja ningun text-accent
  suelto`, todo design-drift. Si alguno se pone rojo, PARA y reportalo; no
  lo toques.
- No toques backend-pet-tracker/, src/app/index.tsx, src/app/_layout.tsx,
  src/app/welcome.tsx, src/screens/welcome/ (#118), login.tsx,
  register.tsx, reset-password, design-drift.test.ts, docs/verification.md
  (la seccion #117 la rellena el humano con el smoke) ni ningun fichero
  fuera de la lista de abajo.
- Rellena specs/mobile-forgot-password/traceability.md con los hashes solo
  en el ultimo commit. No rebasees despues de escribir hashes.
- NO son tuyos, no los toques: progress/history.md, progress/current.md,
  STATUS.md, feature_list.json y las casillas de §Prueba de humo y
  §Aprobacion de requirements.md. Los escribe el leader o el humano. Todo lo
  que tengas que contar va en progress/impl_mobile-forgot-password.md.
- Si el sandbox te deniega un comando, PARA y reportalo. No lo sustituyas
  por otro que haga lo mismo con otra herramienta.
- NO hagas push ni abras la PR: lo hace el leader al cerrar.

Ficheros que TU cambias, medidos desde H0 (`git diff --name-only H0 HEAD`),
16 en total:
  mobile-pet-tracker/src/api/types.ts
  mobile-pet-tracker/src/api/auth.ts
  mobile-pet-tracker/src/api/__tests__/auth.test.ts
  mobile-pet-tracker/src/i18n/catalog.ts
  mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx
  mobile-pet-tracker/src/app/(auth)/forgot.tsx
  mobile-pet-tracker/src/app/(auth)/__tests__/forgot.test.tsx   (borrado)
  mobile-pet-tracker/src/screens/forgot/index.tsx               (nuevo)
  mobile-pet-tracker/src/screens/forgot/index.test.tsx          (nuevo)
  mobile-pet-tracker/src/__tests__/ui-copy-table.ts
  mobile-pet-tracker/src/__tests__/ui-language.test.ts
  mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts
  mobile-pet-tracker/src/__tests__/legibility-classnames.test.ts
  specs/mobile-ui-language/design.md
  specs/mobile-forgot-password/traceability.md
  progress/impl_mobile-forgot-password.md
Nada mas.

Criterios de aceptacion: R1-R11 de requirements.md. §Prueba de humo
(S1-S9 en dev build de Android) es del humano: no la marques.

Al terminar, escribe progress/impl_mobile-forgot-password.md con:
pwd, branch y H0; skills cargadas; la salida de las anclas; la base medida
por suite (jest) y typecheck/lint con exit; los commits con hash y R-id;
por cada rojo, el comando, las cuentas, el exit y cada `it` rojo con su
matcher, Expected y Received (o la consulta que falla); por cada verde, sus
cuentas y exit; cada sonda de mutacion (las 11) con el `it` que cae y su
asercion o consulta; el cierre (las 7 suites que quedan + la nueva, suite
global `bunx jest` sin pipe con su exit, typecheck, lint) con exit;
dependencias (`git diff` vacio); `git diff --name-only H0 HEAD` (16
ficheros); el delta final por fichero; las anclas de R10 con su valor
final; y cualquier decision que la spec no cerrara literalmente.
```

# Handoff a Codex CLI — #117 mobile-forgot-password

> Pegar el bloque de abajo en Codex CLI. La spec está firmada (commit de firma
> `6a85ea5c`, aprobación vía Notion el 2026-10-04, `page_last_edited_at`
> 2026-10-04T20:26:30Z). Feature móvil. La prueba de humo en el dev build de
> Android (§Prueba de humo, S1–S9) es del humano y cierra la feature, no la
> spec.
>
> **Ronda 2 (2026-10-05):** el bloque que se pega ahora es el de §Ronda 2 —
> Enmienda E1, al final de este fichero. El de abajo es el de la ronda 1 y
> queda como historial.

---

```
Worktree: /home/claude/sites/Pet-Tracker-wt-backend   <- PRIMERA LINEA. Trabaja AQUI y en ningun otro sitio
Antes de tocar nada, ejecuta `pwd`, `git branch --show-current` y
`git rev-parse --short HEAD` y pega las tres salidas al principio de
progress/impl_mobile-forgot-password.md. El hash es H0 (HEAD al arrancar,
el ultimo commit docs del leader): todos los `git diff --name-only` se miden contra el. Para si
la branch no es feature/117-mobile-forgot-password.
REANUDACION (2026-10-04): la primera corrida paro antes de T1 porque dos
anclas de este handoff transcribian filas de specs/mobile-ui-language/design.md
sin los backticks del fichero. Parada correcta. El leader ha reescrito la
seccion de anclas como comandos verificados y ha commiteado el cambio: el
HEAD actual es el NUEVO H0. Anadelo al impl existente debajo del anterior
(no borres lo escrito), vuelve a ejecutar las anclas y sigue desde T1. La
base jest ya medida (8 suites / 243 tests, exit=0) sigue valiendo:
mobile-pet-tracker/ no ha cambiado; mide typecheck y lint, que faltaron.
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

Anclas. Son COMANDOS, no transcripciones: ejecutalos tal cual desde la
raiz del worktree (/home/claude/sites/Pet-Tracker-wt-backend), uno a uno,
y copia cada salida al impl. El valor tras `#` es la salida esperada; el
leader los ejecuto todos sobre H0 y dieron exactamente eso (27 de 27). Si
alguno da otra cosa, PARA. Ninguna otra cita de este handoff es ancla: el
resto es descripcion y, ante cualquier diferencia de puntuacion, backticks
o tildes entre este texto y el fichero, manda el fichero.

M=mobile-pet-tracker/src
grep -cF '+ 9 + 9, // #105 R5' $M/providers/__tests__/language-provider.test.tsx   # 1
grep -cF 'expect(R1_AUTH).toHaveLength(29);' $M/__tests__/ui-language.test.ts    # 1
grep -cF "it('resuelve las 29 ocurrencias normativas'" $M/__tests__/ui-language.test.ts   # 1
grep -cF 'toHaveLength(19 + 2 + 1 + 1 + 1 + 1 + 1 + 1 + 1); // #100 R10, #41 R10, #146 R10, #105 R5' $M/__tests__/ui-language.test.ts   # 1
grep -cF 'const SCREEN_FILES = ALL_USES.map((use) => use.file).filter(' $M/__tests__/ui-language.test.ts   # 1
grep -ci 'forgot' $M/__tests__/ui-language.test.ts   # 0
grep -cF "{ file: 'src/app/(auth)/forgot.tsx', key: 'forgot." $M/__tests__/ui-copy-table.ts   # 5
grep -cF "join('app', '(auth)', 'forgot.tsx')" $M/__tests__/consistency-classnames.test.ts   # 4
grep -cF 'expect(primaryRadius).toHaveLength(13 + 1 + 1); // #146 R8, #146 R9' $M/__tests__/consistency-classnames.test.ts   # 1
grep -cF ')).toBe(13 + 1 + 1); // #146 R8, #146 R9' $M/__tests__/consistency-classnames.test.ts   # 1
grep -cF 'expect(count(/style=\{CONTINUOUS_CORNER\}/g)).toBe(31 + 1); // #41 R9: geofences-link' $M/__tests__/consistency-classnames.test.ts   # 1
grep -cF 'expect(count(/bg-accent-soft/g)).toBe(16 + 2 + 1);' $M/__tests__/consistency-classnames.test.ts   # 1
grep -cF "[join('app', '(auth)', 'forgot.tsx'), 1]," $M/__tests__/legibility-classnames.test.ts   # 1
grep -cF ').toBe(13 + 1 + 1);' $M/__tests__/legibility-classnames.test.ts   # 1
grep -cF "it('no deja ningún text-accent suelto en las fuentes'" $M/__tests__/legibility-classnames.test.ts   # 1
grep -ci 'forgot' $M/__tests__/design-drift.test.ts   # 0
grep -c "^  'forgot\." $M/i18n/catalog.ts   # 10
grep -cF "'forgot.comingSoon'" $M/i18n/catalog.ts   # 2
grep -cF "import { HeaderHeightContext } from 'expo-router/react-navigation';" $M/screens/reset-password/index.tsx   # 1
grep -cF '| `src/app/(auth)/forgot.tsx` | 5 | R1 |' specs/mobile-ui-language/design.md   # 1
grep -cF '| `src/app/(auth)/__tests__/forgot.test.tsx` | 1 |' specs/mobile-ui-language/design.md   # 1
grep -cF '**`mobile-pet-tracker/src/app/(auth)/forgot.tsx`** — 5 ocurrencias' specs/mobile-ui-language/design.md   # 1
grep -cF '### §2.1 — R1 — grupo `(auth)` (29 ocurrencias, 23 claves)' specs/mobile-ui-language/design.md   # 1
grep -cF "describe('#61 R8: forgot tiene contenedor de scroll con safe areas'" 'mobile-pet-tracker/src/app/(auth)/__tests__/forgot.test.tsx'   # 1
grep -cF "describe('#127 R1: el botón de envío de forgot lleva su receta en el árbol'" 'mobile-pet-tracker/src/app/(auth)/__tests__/forgot.test.tsx'   # 1
test ! -e $M/screens/forgot; echo "exit=$?"   # exit=0
test ! -e mobile-pet-tracker/.expo/types/router.d.ts; echo "exit=$?"   # exit=0

Que hace cada una durante la feature (deltas, no absolutos):
  language-provider: T2 anade `+ 6` al final de la suma de englishKeys y
    T3 `- 1`; al cierre la linea termina en
    `+ 9 + 9 + 6 - 1, // #105 R5; #117 R1`
  ui-language R1_AUTH: T5 `29 + 3 // #117 R10` (titulo con 32), T6
    `29 + 7 // #117 R10` (titulo con 36)
  ui-language SCREEN_FILES: `+ 1 - 1` con comentario
    `#117 R10: sale app/(auth)/forgot.tsx, entra screens/forgot/index.tsx`.
    SCREEN_FILES se DERIVA de ALL_USES con dedupe: al mover las filas el
    valor no cambia; el `+ 1 - 1` es declaracion, no ajuste. Fuera de ese
    comentario, `grep -ci forgot` sigue en 0 en ui-language.test.ts
  ui-copy-table.ts › R1_AUTH: las 5 filas de forgot pasan en T3 a
    `src/screens/forgot/index.tsx` (comingSoon se cambia por
    instructions); T5 +3 (checkYourEmail, sentTo, resend); T6 +4
    (invalidEmail, tooManyAttempts, common.cannotReachServer,
    common.somethingWentWrong x1). Al cierre 12 filas de la pantalla y 0 de
    `src/app/(auth)/forgot.tsx`. No se toca el array `blocks` de ese
    fichero. checkUses exige igualdad fila/llamada `t(` POR COMMIT: cada
    fila entra en el verde que anade su `t(`
  consistency-classnames: las 4 rutas pasan en T3 a
    `join('screens', 'forgot', 'index.tsx')`, literales `toContain` sin
    cambio. Las cuatro cuentas globales de arriba (primaryRadius,
    `rounded-xl bg-accent`, CONTINUOUS_CORNER, bg-accent-soft) NO cambian:
    su sourceFiles barre todo src/ y excluye `*.test.tsx`. Al cierre la
    ruta vieja da 0
  legibility-classnames: la fila de inkSites cambia de ruta en T3 a
    `join('screens', 'forgot', 'index.tsx')` con cuenta 1; no se anade
    fila (0 `it` nuevos); `13 + 1 + 1` y el guard de text-accent suelto
    sin cambio. Al cierre la ruta vieja da 0
  design-drift: no se toca y `grep -ci forgot` sigue en 0. OJO: su
    sourceFiles SI lee los `*.test.tsx` co-ubicados (solo excluye carpetas
    `__tests__`), asi que la suite nueva src/screens/forgot/index.test.tsx
    entra en sus barridos C8 de clases con corchetes, `rounded-[...]` y
    `text-[...]` arbitrarios. No escribas en ella ningun literal con
    guion seguido de corchete (por ejemplo una regex `/rounded-[a-z]+/`):
    aserta por className exacto o por toContain
  catalog.ts: T2 +6 claves forgot.* por idioma; T3 retira comingSoon de
    los dos (al cierre 20 lineas `^  'forgot.`, 10 por idioma, y 0 comingSoon)
  specs/mobile-ui-language/design.md: las cuatro filas ancladas cambian
    como dice §Candados globales de requirements.md
  src/app/(auth)/__tests__/forgot.test.tsx: se elimina en T3; sus
    describe `#61 R8` y `#127 R1` se reapuntan a la suite nueva con los
    mismos titulos; los dos `it` de R9 se reapuntan o invierten como dice
    §Aserciones existentes que se reapuntan
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

---

## Ronda 2 — Enmienda E1 (solo tests)

> Pegar en Codex CLI el bloque de abajo, no el de la ronda 1. La enmienda E1
> está firmada (commit de firma `75cb3104`, aprobación vía Notion leída el
> 2026-10-05T03:13:01Z, casilla del humano fechada 2026-10-04). Ronda 1
> terminó en `d39a9ea5`; el `reviewer` la rechazó en `33f261ba`.

```
Worktree: /home/claude/sites/Pet-Tracker-wt-backend   <- PRIMERA LINEA. Trabaja AQUI y en ningun otro sitio
RONDA 2 de #117. Antes de tocar nada, ejecuta `pwd`, `git branch --show-current`
y `git rev-parse --short HEAD` y pega las tres salidas al FINAL de
progress/impl_mobile-forgot-password.md, bajo un encabezado nuevo
`## Ronda 2` (no borres nada de la ronda 1). El hash es H0 de la ronda 2
(el commit del leader que anade esta seccion al handoff): la lista cerrada
de ficheros se mide contra el. Para si la branch no es
feature/117-mobile-forgot-password.
No toques /home/claude/sites/Pet-Tracker (#116), Pet-Tracker-wt-118 (#118,
otro Codex), ni ningun otro worktree, ni cambies de branch en ninguno.
node_modules ya esta instalado en mobile-pet-tracker/.

Feature: mobile-forgot-password (#117), ronda 2
Branch: feature/117-mobile-forgot-password
Spec: specs/mobile-forgot-password/requirements.md §Enmienda E1 (E1.1-E1.8,
firmada en 75cb3104). Guion: specs/mobile-forgot-password/tasks.md
§Enmienda E1 (T12-T18), entero, incluidas sus tablas de sondas y §No hacer
(ronda 2). Contexto del rechazo: progress/review_mobile-forgot-password.md
(veredicto de la ronda 1 y §Barrido de la enmienda E1).

== QUE HACES ==

Solo tests. La produccion de la ronda 1 cumple; lo que faltaba eran
candados para ramas de clausulas universales que la spec original
candaba en un solo caso. Anades, en este orden:
  T12 (E1.1, R2)  auth.test.ts: it.each([201, 302, 404, 503]) tras
                  it('mapea 500 a error')
  T13 (E1.2, R6)  forgot/index.test.tsx: it.each de 4 filas tras el `it`
                  del 429 en el describe de R6
  T14 (E1.3, R7)  dos `it` con promesa controlada tras el `it` del envio
                  posterior en el describe de R7
  T15 (E1.4, R9)  un `it` tras el que ya tiene el describe de R9
  T16 (E1.6, R3)  un `it` tras it('link-login navega a /login sin peticion
                  de red') en el describe de R3
  T17 (E1.7, R5)  un `it` al final del describe de R5
  T18             cierre: suites, typecheck, lint, traceability, impl
E1.5 y E1.8 NO generan commit ni tocan ningun `it`.
Titulos de `it`, filas de `it.each`, literales de copy y pasos: LITERALES
de requirements.md §E1.x. No los traduzcas, ni acortes, ni reordenes.

Pistas verificadas por el leader (no son spec; ante diferencia manda la
spec y el arbol):
- T14: la promesa controlada se declara DENTRO de cada `it` con las dos
  lineas que ya usa el primer `it` de R6 (ver anclas), y
  `.mockReturnValueOnce(pending)` cierra la cadena de mocks. El
  `resolveRequest({ kind: 'ok' })` va dentro de `await act(async () => {...})`.
- T17: `screen.getByTestId('forgot-title').parent?.children` contiene
  tambien strings; filtralos (`typeof c !== 'string'`) antes de leer
  `props.className`, y compara con igualdad estricta contra
  'size-16 items-center justify-center rounded-xl bg-accent-soft'. Cast
  minimo y sin `any` explicito: el barrido lo tipo como
  `as unknown[]` + `(c as { props: { className?: string } })`. Tras
  `submitForgot()` vuelve a pedir `getByTestId('forgot-title')`: no
  reutilices el nodo de antes.

== BASE ==

La rama no cambio mobile-pet-tracker/ desde d39a9ea5 (fin de la ronda 1):
solo specs/ y progress/. Al arrancar, mide desde mobile-pet-tracker/, sin
pipe:
  bunx jest --runTestsByPath --maxWorkers=2 src/api/__tests__/auth.test.ts src/screens/forgot/index.test.tsx > /tmp/117-r2-base.log 2>&1; echo "exit=$?"
Esperado: 2 suites / 60 tests (auth 40 + forgot 20), exit=0. Si da otra
cosa, PARA y anotalo.
Cuentas esperadas tras cada commit (mismo comando, la suite que toca):
  T12 auth 44 | T13 forgot 24 | T14 forgot 26 | T15 forgot 27 |
  T16 forgot 28 | T17 forgot 29
Al cierre (T18):
  8 suites del handoff de la ronda 1: 285 tests, exit=0. Comando literal
  (desde mobile-pet-tracker/):
  bunx jest --runTestsByPath --maxWorkers=2 src/api/__tests__/auth.test.ts src/providers/__tests__/language-provider.test.tsx src/__tests__/ui-language.test.ts src/__tests__/consistency-classnames.test.ts src/__tests__/legibility-classnames.test.ts src/__tests__/design-drift.test.ts src/screens/reset-password/index.test.tsx src/screens/forgot/index.test.tsx > /tmp/117-r2-ocho.log 2>&1; echo "exit=$?"
  Suite global: `bunx jest --maxWorkers=2 > /tmp/117-r2-global.log 2>&1;
  echo "exit=$?"` -> 93 suites / 2049 tests, exit=0 (ronda 1: 93 / 2036;
  E1 suma 13). Ningun candado global se mueve.

Anclas. Son COMANDOS, no transcripciones: ejecutalos tal cual desde la
raiz del worktree (/home/claude/sites/Pet-Tracker-wt-backend), uno a uno,
y copia cada salida al impl. El valor tras `#` es la salida esperada; el
leader los ejecuto todos sobre H0 y dieron exactamente eso. Si alguno da
otra cosa, PARA. Ninguna otra cita de este handoff es ancla: ante
cualquier diferencia de puntuacion, comillas o tildes entre este texto y
el fichero, manda el fichero.

M=mobile-pet-tracker/src
git diff --quiet d39a9ea5 HEAD -- mobile-pet-tracker; echo "exit=$?"   # exit=0
test ! -e mobile-pet-tracker/.expo/types/router.d.ts; echo "exit=$?"   # exit=0
grep -cF "describe('#117 R2: forgotPassword mapea la respuesta por kind'" $M/api/__tests__/auth.test.ts   # 1
grep -cF "it('mapea 500 a error'" $M/api/__tests__/auth.test.ts   # 1
grep -cF 'function response(status: number, body: unknown): Response {' $M/api/__tests__/auth.test.ts   # 1
grep -cF '.mockResolvedValueOnce(invalidJsonResponse(400))' $M/api/__tests__/auth.test.ts   # 1
grep -cF 'mapea %i a error' $M/api/__tests__/auth.test.ts   # 0
grep -cF 'export async function forgotPassword(' $M/api/auth.ts   # 1
grep -cF 'switch (result.response.status) {' $M/api/auth.ts   # 1
grep -cF "describe('#117 R3: la ruta forgot delega en ForgotScreen'" $M/screens/forgot/index.test.tsx   # 1
grep -cF "it('link-login navega a /login sin petición de red'" $M/screens/forgot/index.test.tsx   # 1
grep -cF "describe('#117 R5: enviar pasa la pantalla a «Revisa tu correo»'" $M/screens/forgot/index.test.tsx   # 1
grep -cF "describe('#117 R6: reenviar repite la misma petición'" $M/screens/forgot/index.test.tsx   # 1
grep -cF "it('un 429 al reenviar pinta forgot-error sin salir de «Revisa tu correo»'" $M/screens/forgot/index.test.tsx   # 1
grep -cF "describe('#117 R7: cada kind distinto de ok pinta su copy en forgot-error'" $M/screens/forgot/index.test.tsx   # 1
grep -cF "it('un envío posterior que resuelve ok limpia forgot-error y pasa a «Revisa tu correo»'" $M/screens/forgot/index.test.tsx   # 1
grep -cF "describe('#117 R9: las métricas del stub sobreviven al cambio de estado'" $M/screens/forgot/index.test.tsx   # 1
grep -cF 'let resolveRequest!: (state: ForgotPasswordState) => void;' $M/screens/forgot/index.test.tsx   # 2
grep -cF 'const pending = new Promise<ForgotPasswordState>((resolve) => { resolveRequest = resolve; });' $M/screens/forgot/index.test.tsx   # 1
grep -cF 'const mockRouter = jest.mocked(router);' $M/screens/forgot/index.test.tsx   # 1
grep -cF "async function submitForgot(email = 'ana@example.com') {" $M/screens/forgot/index.test.tsx   # 1
grep -cF 'al reenviar pinta «%s» en forgot-error' $M/screens/forgot/index.test.tsx   # 0
grep -cF 'retira forgot-error en cuanto arranca' $M/screens/forgot/index.test.tsx   # 0
grep -cF 'de la spec en los dos estados' $M/screens/forgot/index.test.tsx   # 0
grep -cF 'también desde «Revisa tu correo»' $M/screens/forgot/index.test.tsx   # 0
grep -cF 'el tile Lock sigue en pie' $M/screens/forgot/index.test.tsx   # 0
grep -cF 'setError(null);' $M/screens/forgot/index.tsx   # 1
grep -cF "setError(t('forgot.invalidEmail'));" $M/screens/forgot/index.tsx   # 1
grep -cF "setError(t('common.cannotReachServer'));" $M/screens/forgot/index.tsx   # 1
grep -cF "setError(t('common.somethingWentWrong'));" $M/screens/forgot/index.tsx   # 1
grep -cF "case 'ok':" $M/screens/forgot/index.tsx   # 1
grep -cF 'setSubmittedEmail(target);' $M/screens/forgot/index.tsx   # 1
grep -cF 'setSent(false);' $M/screens/forgot/index.tsx   # 0
grep -cF '{sent ? (' $M/screens/forgot/index.tsx   # 1
grep -cF 'onPress={() => void send(submittedEmail)}' $M/screens/forgot/index.tsx   # 1
grep -cF 'className="flex-1 bg-background"' $M/screens/forgot/index.tsx   # 1
grep -cF 'contentInsetAdjustmentBehavior="automatic"' $M/screens/forgot/index.tsx   # 1
grep -cF "onPress={() => router.push('/login')}" $M/screens/forgot/index.tsx   # 1
grep -cF 'className="size-16 items-center justify-center rounded-xl bg-accent-soft"' $M/screens/forgot/index.tsx   # 1
grep -cF "'common.somethingWentWrong': 'Algo salió mal'," $M/i18n/catalog.ts   # 1
grep -cF "'common.cannotReachServer': 'No se pudo conectar con el servidor'," $M/i18n/catalog.ts   # 1
grep -cF 'Ingresa un correo electrónico válido' $M/i18n/catalog.ts   # 1
grep -cF 'Demasiados intentos. Inténtalo más tarde.' $M/i18n/catalog.ts   # 1
grep -cF 'Si existe una cuenta para {{email}}, te enviamos un enlace para restablecer tu contraseña. Revisa tu bandeja de entrada y la carpeta de spam.' $M/i18n/catalog.ts   # 1
grep -cF '.parent' $M/screens/docs/index.test.tsx   # 2

Notas sobre las anclas: el tile Lock es un `<View` multilinea; su
className vive en la linea siguiente, por eso el ancla es el atributo y
no la etiqueta. `setSent(false);` en 0 es lo que plantan M6-e/f/g.

== COMMITS ==

Uno por tarea, mensajes LITERALES de tasks.md, en este orden:
  test(mobile): lock every other status as error in the forgot client (#117 R2, E1)
  test(mobile): lock resend errors for every non-ok kind (#117 R6, E1)
  test(mobile): lock forgot-error clearing as soon as a new request starts (#117 R7, E1)
  test(mobile): lock the forgot scroll container props in both states (#117 R9, E1)
  test(mobile): lock link-login from the sent state (#117 R3, E1)
  test(mobile): lock the Lock tile in both states (#117 R5, E1)
  docs(mobile): trace #117 amendment E1 to its tests and commits
Aqui NO hay par rojo->verde: cada `it` nuevo nace verde porque la
produccion ya cumple, y lo que prueba que el candado mira es la sonda.
Ciclo de CADA tarea T12-T17, en este orden:
  1. Anade el `it` / `it.each`. Corre la suite: verde con la cuenta de
     arriba. Si un `it` nuevo nace ROJO, PARA y anotalo con Expected y
     Received: la produccion esta fuera de tu lista, no la arregles.
  2. Planta UNA sonda de la tabla de tasks.md en el fichero de produccion,
     corre la suite (o el `it` con -t) y anota que `it` cayo, con su
     matcher, Expected/Received o la consulta que lanzo.
  3. Revierte: `git checkout HEAD -- <ruta de produccion>`. Comprueba
     `git diff --quiet -- <ruta de produccion>; echo "exit=$?"` y
     `git diff --cached --quiet; echo "exit=$?"`, los dos exit=0. NUNCA
     `git checkout <hash> -- ruta`: deja el cambio en el indice.
  4. Repite 2-3 con cada sonda de la tabla de esa tarea.
  5. Corre la suite otra vez: verde. Commit SOLO del fichero de test.
Cada sonda debe caer EXACTAMENTE donde dice su tabla, por consulta o por
asercion segun la tabla (T13: por consulta en getByText('Revisa tu
correo'); el resto, por asercion), y la columna «Debe seguir verde» debe
seguir verde: anotala tambien, es la prueba de que el candado anterior
estaba ciego. Si una sonda no cae, cae otro `it`, o cae por SyntaxError,
TypeError, ReferenceError o import roto, PARA y reportalo. No ajustes
ninguna asercion ni ningun `it` para que cuadre. Ninguna sonda se commitea.
El ultimo commit lleva SOLO specs/mobile-forgot-password/traceability.md
y progress/impl_mobile-forgot-password.md.

== REGLAS CRITICAS ==

- Convenciones: docs/conventions.md. Los `it` nuevos viven dentro de los
  describe `#117 R<n>:` que ya existen (anclas); no crees describe nuevos.
  No modifiques, renombres ni reordenes ningun `it` existente.
- Esperas: docs/conventions.md §Esperas, sobre el arbol renderizado
  (findBy*, waitFor sobre toBeDisabled/not.toBeDisabled del boton),
  NUNCA sobre el contador del mock. En T14 la lectura de
  `mock.calls[2][1]` va DESPUES de la espera sobre `forgot-resend`
  deshabilitado, como en el primer `it` de R6.
- design-drift lee tambien la suite co-ubicada src/screens/forgot/index.test.tsx:
  no escribas en ella ningun literal con guion seguido de corchete
  (`-[`). Los literales de clase de E1 no lo llevan.
- Jest: siempre `--runTestsByPath` desde mobile-pet-tracker/. Comprueba
  que jest imprime tantas suites como ficheros pediste.
- Mide SIN pipe: `cmd > fichero 2>&1; echo "exit=$?"`. Copia al impl las
  lineas de resumen (Test Suites / Tests) y el exit.
- Antes de la suite global y de las 8 suites, `pgrep -f init.sh; echo
  "exit=$?"`: si exit=0 (otra sesion corre init.sh con LocalStack y
  Postgres compartidos), espera a que termine y vuelve a mirar; la carga
  da rojos falsos. Si sigue tras 30 minutos, PARA y anotalo. Si el
  sandbox deniega pgrep, anotalo y sigue.
- Typecheck: `test ! -e .expo/types/router.d.ts` antes de CADA
  `bun run typecheck` (= tsc --noEmit). T17 exige typecheck exit=0 ANTES
  de su commit. Si router.d.ts existe, PARA y pide al humano que lo
  borre. Nunca `rm -f` (tu sandbox lo deniega).
- `bun run lint` exit=0 al cierre.
- Todo con bun/bunx; nunca npm/npx/yarn. Ni `bun add`, ni cambios en
  package.json, bun.lock ni app.json.
- NO lances ./init.sh ni toques Postgres ni LocalStack.
- `graphify update .` lo corre el leader (graphify-out/ esta
  gitignorado): no lo lances.
- Skills: no cambia ni UI ni produccion. Si cargas alguna, que sea
  `building-native-ui` del plugin expo de Codex, y dilo en el impl. No
  pidas skills por otros nombres (expo-overview, expo-router no existen
  en Codex: silencio, no error).
- traceability.md, solo en el ultimo commit: anade a las filas R2, R3,
  R4, R5, R6, R7 y R9 el `it` nuevo (titulo literal) y el hash + mensaje
  de su commit de E1 (R4 lo cierra el primer `it` de T14; R6 lo cierran
  T13 y el segundo `it` de T14), y una fila nueva `E1.5` que cite
  `7ba0b3a9` y it('mapea un 400 sin errors a error'). No toques las
  celdas de la ronda 1 salvo para anadir. No rebasees despues.
- NO son tuyos, no los toques: progress/history.md, progress/current.md,
  progress/review_mobile-forgot-password.md, STATUS.md, feature_list.json,
  requirements.md, tasks.md, design.md y las casillas de §Prueba de humo
  y §Aprobacion. Todo lo que tengas que contar va al impl.
- Si el sandbox te deniega un comando, PARA y reportalo. No lo sustituyas
  por otro que haga lo mismo con otra herramienta.
- NO hagas push ni abras la PR.

Ficheros que TU cambias, medidos desde el H0 de la ronda 2
(`git diff --name-only <H0> HEAD`), 4 en total:
  mobile-pet-tracker/src/api/__tests__/auth.test.ts
  mobile-pet-tracker/src/screens/forgot/index.test.tsx
  specs/mobile-forgot-password/traceability.md
  progress/impl_mobile-forgot-password.md
Nada mas. `git diff --quiet <H0> HEAD -- mobile-pet-tracker/src/screens/forgot/index.tsx mobile-pet-tracker/src/api/auth.ts; echo "exit=$?"`
-> exit=0 al cierre; copialo al impl.

Al terminar, el impl §Ronda 2 lleva: pwd, branch y H0; la salida de
cada ancla; la base (60, exit); por tarea, el comando, la cuenta y el
exit del verde, y la tabla de sus sondas (sonda, `it` que cayo, consulta
o asercion con Expected/Received, `it` que siguio verde, los dos exit de
la reversion); los commits con hash; el cierre (8 suites 285, global
93/2049, typecheck, lint, cada uno con exit); `git diff --name-only <H0>
HEAD` (4 ficheros) y el diff vacio de produccion; y cualquier decision
que la spec no cerrara literalmente.
```

## Ronda 3 — Enmienda E2 (solo tests)

> Pegar en Codex CLI el bloque de abajo, no el de las rondas 1 ni 2. La
> enmienda E2 está firmada (commit de firma `ca95f2f0`, aprobación vía Notion
> con page_last_edited_at 2026-10-05T14:21:28Z, casilla del humano fechada
> 2026-10-05). Ronda 2 terminó en `49de71b6`; el `reviewer` la rechazó en
> `e37ee575`. El humano no pidió extender E2.6.

```
Worktree: /home/claude/sites/Pet-Tracker-wt-backend   <- PRIMERA LINEA. Trabaja AQUI y en ningun otro sitio
RONDA 3 de #117. Antes de tocar nada, ejecuta `pwd`, `git branch --show-current`
y `git rev-parse --short HEAD` y pega las tres salidas al FINAL de
progress/impl_mobile-forgot-password.md, bajo un encabezado nuevo
`## Ronda 3` (no borres nada de las rondas 1 y 2). El hash es H0 de la
ronda 3 (el commit del leader que anade esta seccion al handoff): la lista
cerrada de ficheros se mide contra el. Para si la branch no es
feature/117-mobile-forgot-password.
No toques /home/claude/sites/Pet-Tracker (#116), Pet-Tracker-wt-118 (#118),
ni ningun otro worktree, ni cambies de branch en ninguno.
node_modules ya esta instalado en mobile-pet-tracker/.

Feature: mobile-forgot-password (#117), ronda 3
Branch: feature/117-mobile-forgot-password
Spec: specs/mobile-forgot-password/requirements.md §Enmienda E2 (E2.1-E2.7,
firmada en ca95f2f0). Guion: specs/mobile-forgot-password/tasks.md
§Enmienda E2 (T19-T21), entero, incluidas sus dos tablas de sondas, sus
notas y §No hacer (ronda 3). Contexto del rechazo:
progress/review_mobile-forgot-password.md §Ronda 2 y §Barrido previo a la
firma de E2 (con su §Remedicion).

== QUE HACES ==

Solo tests, y solo en mobile-pet-tracker/src/screens/forgot/index.test.tsx.
La produccion cumple; lo que faltaba era comprobar la pantalla entera de
cada estado en todos sus flujos (en vuelo, tras un error, tras reenviar).
En este orden:
  T19  helpers LOCK_TILE_CLASS, lockTile, expectForgotError,
       expectLinkLoginNavigates y expectFormState (E2.4, SIN expectSentState);
       puntos P1, P2, P4, P4b, P5 y P6 (E2.5); los 3 cambios de linea de
       E2.5; el `it` E2.7a. Sondas de la tabla de T19.
  T20  expectSentState justo despues de expectFormState; puntos P3, P7a,
       P7, P8-P13; el `it` E2.7b. Sondas de la tabla de T20.
  T21  cierre: suites, typecheck, lint, traceability, impl.
El codigo de los helpers (E2.4), las lineas de cada punto (tabla de E2.5 y
nota de P4b) y los dos `it` de E2.7 son LITERALES de requirements.md:
copialos de sus bloques de codigo, no los reescribas, ni traduzcas, ni
reordenes. Los titulos de `it` existentes no cambian.

Pistas verificadas por el leader (no son spec; ante diferencia manda la
spec y el arbol):
- Cada linea de punto va dentro del `it` que nombra la tabla de E2.5, con
  la sangria de su cuerpo (4 espacios). Ubica cada `it` por su titulo
  (anclas); dentro de el, el ancla del punto es unica salvo en P12, que
  aparece dos veces y se usa la PRIMERA (la que va antes del `act`).
- P4b son dos lineas justo despues de P4. P7a y despues P7 van al final
  de E1.3 `it` 1 (titulo `un nuevo envio desde el formulario retira
  forgot-error en cuanto arranca, antes de resolver`).
- E2.7a va entre el `});` que cierra el it.each `mapea %p a «%s» ...` y
  it('un envío posterior que resuelve ok ...'. E2.7b va despues del
  it.each `un %p al reenviar pinta «%s» ...` y antes del `});` que cierra
  el describe de R6, el que precede a describe('#117 R8: ...'.
- `mockRouter.push.mockClear()` tipa: jest.mocked es profundo (el
  barrido lo midio con tsc exit=0).
- T19 no anade expectSentState porque sin uso rompe el lint.
- Las sondas X-h, M5-i y M5-j cambian uno de los dos `{!sent ? (` de
  index.tsx: el de TextField va seguido de `<TextField className="w-full">`;
  el de forgot-submit, de un `<Button` con testID="forgot-submit".
- M5-i y M5-j son DOS cambios a la vez: plantalos juntos, una sola
  corrida, una sola reversion.
- tasks.md: las filas M7-n (tabla de T19), M6-k y M7-o (tabla de T20)
  son parte de sus tablas.

== BASE ==

La rama no cambio mobile-pet-tracker/ desde 49de71b6 (fin de la ronda 2):
solo specs/ y progress/. origin/main sigue en b2a9c2aa. Al arrancar, mide
desde mobile-pet-tracker/, sin pipe:
  bunx jest --runTestsByPath --maxWorkers=2 src/screens/forgot/index.test.tsx > /tmp/117-r3-base.log 2>&1; echo "exit=$?"
Esperado: 1 suite / 29 tests, exit=0. Si da otra cosa, PARA y anotalo.
Cuentas tras cada commit (mismo comando): T19 30 | T20 31.
Al cierre (T21):
  8 suites del handoff de la ronda 1: 287 tests, exit=0. Comando literal
  (desde mobile-pet-tracker/):
  bunx jest --runTestsByPath --maxWorkers=2 src/api/__tests__/auth.test.ts src/providers/__tests__/language-provider.test.tsx src/__tests__/ui-language.test.ts src/__tests__/consistency-classnames.test.ts src/__tests__/legibility-classnames.test.ts src/__tests__/design-drift.test.ts src/screens/reset-password/index.test.tsx src/screens/forgot/index.test.tsx > /tmp/117-r3-ocho.log 2>&1; echo "exit=$?"
  Suite global: `bunx jest --maxWorkers=2 > /tmp/117-r3-global.log 2>&1;
  echo "exit=$?"` -> 93 suites / 2051 tests, exit=0 (ronda 2: 93 / 2049;
  E2 suma 2). auth.test.ts sigue en 44. Ningun candado global se mueve.

Anclas. Son COMANDOS, no transcripciones: ejecutalos tal cual desde la
raiz del worktree (/home/claude/sites/Pet-Tracker-wt-backend), uno a uno,
y copia cada salida al impl. El valor tras `#` es la salida esperada; el
leader los ejecuto todos sobre H0 y dieron exactamente eso (56/56). Si
alguno da otra cosa, PARA. Ninguna otra cita de este handoff es ancla:
ante cualquier diferencia de puntuacion, comillas o tildes entre este
texto y el fichero, manda el fichero.

M=mobile-pet-tracker/src
git diff --quiet 49de71b6 HEAD -- mobile-pet-tracker; echo "exit=$?"   # exit=0
test ! -e mobile-pet-tracker/.expo/types/router.d.ts; echo "exit=$?"   # exit=0
grep -cF "expect(screen.getByTestId('forgot-email')).toBeVisible();" $M/screens/forgot/index.test.tsx   # 1
grep -cF "await waitFor(() => expect(screen.getByTestId('forgot-submit')).not.toBeDisabled());" $M/screens/forgot/index.test.tsx   # 2
grep -cF "expect(screen.queryByTestId('forgot-resend')).toBeNull();" $M/screens/forgot/index.test.tsx   # 3
grep -cF "expect(mockForgotPassword.mock.calls[1][1]).toEqual(mockForgotPassword.mock.calls[0][1]);" $M/screens/forgot/index.test.tsx   # 1
grep -cF "expect(screen.queryByTestId('forgot-error')).toBeNull();" $M/screens/forgot/index.test.tsx   # 7
grep -cF "await submitForgot();" $M/screens/forgot/index.test.tsx   # 9
grep -cF "expect(screen.getByTestId('forgot-email').props.value).toBe('ana@example.com');" $M/screens/forgot/index.test.tsx   # 1
grep -cF "async function submitForgot(email = 'ana@example.com') {" $M/screens/forgot/index.test.tsx   # 1
grep -cF "const mockForgotPassword = jest.mocked(forgotPassword);" $M/screens/forgot/index.test.tsx   # 1
grep -cF "const mockRouter = jest.mocked(router);" $M/screens/forgot/index.test.tsx   # 1
grep -cF "describe('#117 R5: enviar pasa la pantalla a «Revisa tu correo»'" $M/screens/forgot/index.test.tsx   # 1
grep -cF "describe('#117 R7: cada kind distinto de ok pinta su copy en forgot-error'" $M/screens/forgot/index.test.tsx   # 1
grep -cF "describe('#117 R6: reenviar repite la misma petición'" $M/screens/forgot/index.test.tsx   # 1
grep -cF "describe('#117 R8: forgot se aparta del teclado en Android'" $M/screens/forgot/index.test.tsx   # 1
grep -cF "it('un envío posterior que resuelve ok limpia forgot-error y pasa a «Revisa tu correo»'" $M/screens/forgot/index.test.tsx   # 1
grep -cF "it('pinta título, instrucciones y forgot-email editable con sus props de teclado'" $M/screens/forgot/index.test.tsx   # 1
grep -cF "it('deshabilita forgot-submit con el correo vacío o solo espacios y lo habilita al escribir'" $M/screens/forgot/index.test.tsx   # 1
grep -cF "it('envía el correo recortado una sola vez y deshabilita forgot-submit mientras vuela la petición'" $M/screens/forgot/index.test.tsx   # 1
grep -cF "it('tras ok muestra cabecera y cuerpo con el correo, forgot-resend y link-login, y retira forgot-email y forgot-submit'" $M/screens/forgot/index.test.tsx   # 1
grep -cF "it('el tile Lock sigue en pie en los dos estados'" $M/screens/forgot/index.test.tsx   # 1
grep -cF "('mapea %p a «%s» en forgot-error, seleccionable, y deja el formulario en pie'" $M/screens/forgot/index.test.tsx   # 1
grep -cF "it('un nuevo envío desde el formulario retira forgot-error en cuanto arranca, antes de resolver'" $M/screens/forgot/index.test.tsx   # 1
grep -cF "it('un nuevo reenvío retira forgot-error en cuanto arranca y no lo repinta al resolver ok'" $M/screens/forgot/index.test.tsx   # 1
grep -cF "it('forgot-resend repite el POST con el mismo correo y se deshabilita mientras vuela'" $M/screens/forgot/index.test.tsx   # 1
grep -cF "it('un 429 al reenviar pinta forgot-error sin salir de «Revisa tu correo»'" $M/screens/forgot/index.test.tsx   # 1
grep -cF "('un %p al reenviar pinta «%s» en forgot-error sin salir de «Revisa tu correo»'" $M/screens/forgot/index.test.tsx   # 1
grep -cF "it('link-login navega a /login sin petición de red'" $M/screens/forgot/index.test.tsx   # 1
grep -cF "it('link-login navega a /login también desde «Revisa tu correo», sin petición nueva'" $M/screens/forgot/index.test.tsx   # 1
grep -cE "expectFormState|expectSentState|expectForgotError|expectLinkLoginNavigates|lockTile|LOCK_TILE_CLASS" $M/screens/forgot/index.test.tsx   # 0
grep -cF "vuelve a fallar pinta el copy del nuevo kind" $M/screens/forgot/index.test.tsx   # 0
grep -cF -- "-[" $M/screens/forgot/index.test.tsx   # 0
grep -cF "{sent ? t('forgot.checkYourEmail') : t('forgot.forgotPassword')}" $M/screens/forgot/index.tsx   # 1
grep -cF "{sent ? t('forgot.sentTo', { email: submittedEmail }) : t('forgot.instructions')}" $M/screens/forgot/index.tsx   # 1
grep -cF "{!sent ? (" $M/screens/forgot/index.tsx   # 2
grep -cF "{sent ? (" $M/screens/forgot/index.tsx   # 1
grep -cF "{error ? (" $M/screens/forgot/index.tsx   # 1
grep -cF '<TextField className="w-full">' $M/screens/forgot/index.tsx   # 1
grep -cF '<Label className="text-xs font-semibold text-foreground">' $M/screens/forgot/index.tsx   # 1
grep -cF 'testID="forgot-email"' $M/screens/forgot/index.tsx   # 1
grep -cF 'testID="forgot-submit"' $M/screens/forgot/index.tsx   # 1
grep -cF "isDisabled={email.trim() === '' || submitting}" $M/screens/forgot/index.tsx   # 1
grep -cF '<Text testID="forgot-error" className="text-danger" selectable>' $M/screens/forgot/index.tsx   # 1
grep -cF "<LinkButton testID=\"link-login\" onPress={() => router.push('/login')}>" $M/screens/forgot/index.tsx   # 1
grep -cF '</LinkButton>' $M/screens/forgot/index.tsx   # 1
grep -cF "{t('forgot.backToSignIn')}" $M/screens/forgot/index.tsx   # 1
grep -cF 'className="size-16 items-center justify-center rounded-xl bg-accent-soft"' $M/screens/forgot/index.tsx   # 1
grep -cF 'setError(null);' $M/screens/forgot/index.tsx   # 1
grep -cF "setError(t('forgot.invalidEmail'));" $M/screens/forgot/index.tsx   # 1
grep -cF "setError(t('forgot.tooManyAttempts'));" $M/screens/forgot/index.tsx   # 1
grep -cF "setError(t('common.somethingWentWrong'));" $M/screens/forgot/index.tsx   # 1
grep -cF "setError(t('common.cannotReachServer'));" $M/screens/forgot/index.tsx   # 1
grep -cF '} finally {' $M/screens/forgot/index.tsx   # 1
grep -cF 'setSubmitting(false);' $M/screens/forgot/index.tsx   # 1
grep -cF 'setEmail(' $M/screens/forgot/index.tsx   # 0

Notas sobre las anclas: las siete primeras de index.test.tsx son el
«Recuento de las anclas» de E2.5. `setEmail(` en 0 es lo que plantan
M4-g y M4-h. `-[` en 0: design-drift lee esta suite; ningun literal
nuevo lleva guion seguido de corchete.

== COMMITS ==

Uno por tarea, mensajes LITERALES de tasks.md, en este orden:
  test(mobile): lock the form render in every unsent flow (#117 R4, R7, R3, E2)
  test(mobile): lock the sent-state render in every flow (#117 R5, R6, R3, E2)
  docs(mobile): trace #117 amendment E2 to its tests and commits
Aqui NO hay par rojo->verde: todo nace verde porque la produccion ya
cumple, y lo que prueba que el candado mira es la sonda.
Ciclo de T19 y de T20, en este orden:
  1. Anade los helpers, los puntos, los cambios de linea y el `it` de la
     tarea. Corre la suite: verde con la cuenta de arriba. Si algo nace
     ROJO, PARA y anotalo con Expected y Received: la produccion esta
     fuera de tu lista, no la arregles.
  2. Planta UNA sonda de la tabla de la tarea en
     mobile-pet-tracker/src/screens/forgot/index.tsx, corre la suite
     entera de forgot (comando de BASE, con el log en
     /tmp/117-r3-<sonda>.log) y anota cada `it` que cayo, con el matcher
     y Expected/Received, o la consulta que lanzo.
  3. Revierte: `git checkout HEAD -- mobile-pet-tracker/src/screens/forgot/index.tsx`.
     Comprueba `git diff --quiet -- mobile-pet-tracker/src/screens/forgot/index.tsx; echo "exit=$?"`
     y `git diff --cached --quiet; echo "exit=$?"`, los dos exit=0.
     NUNCA `git checkout <hash> -- ruta`: deja el cambio en el indice.
  4. Repite 2-3 con cada sonda de la tabla de esa tarea (T19: 18 sondas;
     T20: 17 filas, 9 nuevas y 8 repetidas de T19).
  5. Corre la suite otra vez: verde. Typecheck y lint (ver REGLAS), los
     dos exit=0. Commit SOLO del fichero de test.
Regla de parada de las sondas (tasks.md, tras la tabla de T20):
  - Si una sonda NO cae en un `it` que su fila nombra, PARA y anotalo.
  - Si cae ademas en un `it` que su fila no nombra, o cae en un `it` de
    «Debe seguir verde», anotalo y SIGUE.
  - Si cae por consulta donde la fila dice asercion o al reves, anotalo
    y SIGUE.
  - Si cae por excepcion (TypeError, ReferenceError, SyntaxError, import
    roto) donde la fila no dice excepcion, PARA. La unica excepcion
    esperada es M3-h en R6 429 y R6 x4, en T20.
No ajustes ninguna asercion ni ningun `it` para que cuadre. Ninguna sonda
se commitea. El ultimo commit lleva SOLO
specs/mobile-forgot-password/traceability.md y
progress/impl_mobile-forgot-password.md.

== REGLAS CRITICAS ==

- Convenciones: docs/conventions.md. No crees describe nuevos. No
  modifiques, renombres ni reordenes ningun `it` existente; las unicas
  lineas existentes que cambian son las 3 de E2.5. El `it` del tile de
  E1.7 no se reescribe con lockTile().
- Esperas: docs/conventions.md §Esperas, sobre el arbol renderizado
  (findBy*, waitFor sobre el copy de forgot-error o sobre
  toBeDisabled/not.toBeDisabled del boton), NUNCA sobre el contador del
  mock. Los helpers se llaman cuando el arbol ya esta en el flujo que
  nombran, detras de las esperas que ya existen o de las que da la spec
  (P7a). expectLinkLoginNavigates lee mock.calls.length en el mismo tick:
  es una asercion, no una espera (nota de E2.4).
- Jest: siempre `--runTestsByPath` desde mobile-pet-tracker/. Comprueba
  que jest imprime tantas suites como ficheros pediste.
- Mide SIN pipe: `cmd > fichero 2>&1; echo "exit=$?"`. Copia al impl las
  lineas de resumen (Test Suites / Tests) y el exit.
- Antes de la suite global y de las 8 suites, `pgrep -f init.sh; echo
  "exit=$?"`: si exit=0 (otra sesion corre init.sh con LocalStack y
  Postgres compartidos), espera a que termine y vuelve a mirar; la carga
  da rojos falsos. Si sigue tras 30 minutos, PARA y anotalo. Si el
  sandbox deniega pgrep, anotalo y sigue.
- Typecheck: `test ! -e .expo/types/router.d.ts` antes de CADA
  `bun run typecheck` (= tsc --noEmit), desde mobile-pet-tracker/. T19 y
  T20 exigen typecheck exit=0 y `bun run lint` exit=0 ANTES de su commit.
  Si router.d.ts existe, PARA y pide al humano que lo borre. Nunca
  `rm -f` (tu sandbox lo deniega).
- Todo con bun/bunx; nunca npm/npx/yarn. Ni `bun add`, ni cambios en
  package.json, bun.lock ni app.json.
- NO lances ./init.sh ni toques Postgres ni LocalStack.
- `graphify update .` lo corre el leader (graphify-out/ esta
  gitignorado): no lo lances.
- Skills: no cambia ni UI ni produccion. Si cargas alguna, que sea
  `building-native-ui` del plugin expo de Codex, y dilo en el impl. No
  pidas skills por otros nombres (expo-overview, expo-router no existen
  en Codex: silencio, no error).
- traceability.md, solo en el ultimo commit: en las filas R3, R4, R5, R6
  y R7 anade una entrada `E2:` con el hash + mensaje del commit de E2 que
  las toca (R4 y R7: T19; R5 y R6: T20; R3: los dos), y en R7 y R6 el
  titulo literal de E2.7a y E2.7b respectivamente. No toques las celdas
  de las rondas 1 y 2 salvo para anadir. No rebasees despues.
- NO son tuyos, no los toques: progress/history.md, progress/current.md,
  progress/review_mobile-forgot-password.md, progress/handoff_*.md,
  STATUS.md, feature_list.json, requirements.md, tasks.md, design.md y
  las casillas de §Prueba de humo y §Aprobacion. Todo lo que tengas que
  contar va al impl.
- Si el sandbox te deniega un comando, PARA y reportalo. No lo sustituyas
  por otro que haga lo mismo con otra herramienta.
- NO hagas push ni abras la PR.

Ficheros que TU cambias, medidos desde el H0 de la ronda 3
(`git diff --name-only <H0> HEAD`), 3 en total:
  mobile-pet-tracker/src/screens/forgot/index.test.tsx
  specs/mobile-forgot-password/traceability.md
  progress/impl_mobile-forgot-password.md
Nada mas. Al cierre, copia al impl:
  git diff --quiet <H0> HEAD -- mobile-pet-tracker/src/screens/forgot/index.tsx mobile-pet-tracker/src/api/auth.ts mobile-pet-tracker/src/api/__tests__/auth.test.ts; echo "exit=$?"   -> exit=0
  git diff --numstat <H0> HEAD -- mobile-pet-tracker/src/screens/forgot/index.test.tsx   -> borradas = 3 (los 3 cambios de linea de E2.5)

Al terminar, el impl §Ronda 3 lleva: pwd, branch y H0; la salida de
cada ancla; la base (29, exit); por tarea, el comando, la cuenta y el
exit del verde, typecheck y lint, y la tabla de sus sondas (sonda, cada
`it` que cayo, consulta/asercion/excepcion con Expected/Received, los
`it` de «Debe seguir verde» y su estado, los dos exit de la reversion);
los commits con hash; el cierre (8 suites 287, global 93/2051,
typecheck, lint, cada uno con exit); `git diff --name-only <H0> HEAD`
(3 ficheros), el diff vacio de produccion y el numstat; y cualquier
decision que la spec no cerrara literalmente.
```

## Ronda 4 — Integración de origin/main (#118)

> Pegar en Codex CLI el bloque de abajo, no el de las rondas anteriores. La
> ronda 3 terminó en `c9d67ddd` y el `reviewer` la aprobó en `715495f4`.
> #118 entró en `main` con la PR #193 (`8b7caf25`). Orden pactado con la
> sesión Frontend: #118 primero, #117 segundo; integra quien mergea segundo,
> con un commit de merge y sin rebase, porque la trazabilidad cita hashes
> de las rondas 1-3. El leader midió la integración entera en un worktree
> desechable (los dos conflictos, la resolución de abajo, 8 suites 290,
> global 94 / 2083, typecheck y lint con exit 0). No hay código nuevo ni
> spec nueva: los deltas de #117 sobre los candados compartidos se aplican
> como diferencia sobre la expresión de `main`, como pide
> `requirements.md` §Coordinación con #118 («todo delta de esta spec es una
> diferencia sobre lo que haya en `origin/main`, nunca un absoluto»). Esa
> sección dice «rebasea»; se integra con merge porque un rebase reescribe
> los hashes que cita `traceability.md`.

```
Worktree: /home/claude/sites/Pet-Tracker-wt-backend   <- PRIMERA LINEA. Trabaja AQUI y en ningun otro sitio
RONDA 4 de #117: integrar origin/main (#118) con un commit de merge.
Antes de tocar nada, ejecuta `pwd`, `git branch --show-current` y
`git rev-parse --short HEAD` y pega las tres salidas al FINAL de
progress/impl_mobile-forgot-password.md, bajo un encabezado nuevo
`## Ronda 4` (no borres nada de las rondas 1-3). El hash es H0 de la
ronda 4 (el commit del leader que anade esta seccion al handoff). Para si
la branch no es feature/117-mobile-forgot-password.
No toques /home/claude/sites/Pet-Tracker (#116), Pet-Tracker-wt-118 ni
ningun otro worktree, ni cambies de branch en ninguno.
node_modules ya esta instalado en mobile-pet-tracker/.

Feature: mobile-forgot-password (#117), ronda 4
Branch: feature/117-mobile-forgot-password
Commit a integrar: 8b7caf25 (origin/main, PR #193 de #118). Ya esta en
tu repo local: NO hagas `git fetch` ni `git pull`.

== QUE HACES ==

Un merge de 8b7caf25 en la branch, sin rebase, con dos conflictos de una
linea cada uno en tests de candado. Nada de produccion, ningun test nuevo,
ninguna asercion nueva. En este orden:

  1. Anclas PRE (abajo). Si alguna da otra cosa, PARA.
  2. git merge --no-ff 8b7caf25
     Esperado: exit 1 con CONFLICT (content) en exactamente estos dos
     ficheros, y Auto-merging limpio en el resto:
       mobile-pet-tracker/src/__tests__/ui-language.test.ts
       mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx
     Si hay un tercer conflicto, o ninguno, PARA: `git merge --abort` y
     anotalo.
  3. Resuelve cada conflicto sustituyendo el bloque ENTERO, desde la linea
     `<<<<<<<` hasta la linea `>>>>>>>` incluidas, por las lineas
     LITERALES de abajo (sangria con espacios, tal cual). La regla: el
     lado de main se queda entero y se le inserta, tras su primera linea
     de suma, la linea con el delta de #117. Ningun numero se recalcula.

     ui-language.test.ts, dentro de
     it('no deja ningún valor fijo del catálogo como literal entero en las pantallas':
    expect(SCREEN_FILES).toHaveLength(
      19 + 2 + 1 + 1 + 1 + 1 + 1 + 1 + 1 // #100 R10, #41 R10, #146 R10, #105 R5
        + 1 - 1 // #117 R10: sale app/(auth)/forgot.tsx, entra screens/forgot/index.tsx
        + 1, // #118 R1
    );

     language-provider.test.tsx, dentro de `expect(englishKeys).toHaveLength(`
     (la linea `expect(englishKeys).toHaveLength(` y el `);` que la
     cierra quedan FUERA del bloque de conflicto y no se tocan):
      260 + 16 + 1 + 4 + 7 + 14 + 2 + 1 + 4 - 6 + 1 + 2 + 3 + 11 + 12 + 2 + 9 + 9 // #105 R5
        + 6 - 1 // #117 R1
        + 8, // #118 R1

  4. git add de esos dos ficheros, y nada mas. Comprueba
     `git diff --name-only --diff-filter=U | wc -l` -> 0.
  5. Commit del merge con este mensaje LITERAL:
       git commit -m "Merge origin/main into feature/117-mobile-forgot-password (integrates #118, PR #193)"
  6. Anclas POST (abajo), sobre ese commit. Si alguna da otra cosa, PARA:
     no corrijas nada, no hagas reset, anotalo.
  7. Mediciones (abajo). Si algo sale rojo, PARA y anota Expected y
     Received: no ajustes ninguna asercion ni ningun numero.
  8. Segundo y ultimo commit, SOLO progress/impl_mobile-forgot-password.md,
     con este mensaje LITERAL:
       docs(mobile): record #117 integration of origin/main (#118)

== ANCLAS ==

Son COMANDOS: ejecutalos tal cual desde la raiz del worktree, uno a uno, y
copia cada salida al impl. El valor tras `#` es la salida esperada; el
leader los ejecuto todos (PRE sobre H0, POST sobre el merge de su worktree
desechable) y dieron exactamente eso. Ninguna otra cita de este handoff es
ancla.

PRE (antes del paso 2):
M=mobile-pet-tracker/src
git status --porcelain | wc -l   # 0
git diff --quiet c9d67ddd HEAD -- mobile-pet-tracker; echo "exit=$?"   # exit=0
test ! -e mobile-pet-tracker/.expo/types/router.d.ts; echo "exit=$?"   # exit=0
git rev-parse --short '8b7caf25^{commit}'   # 8b7caf25
git merge-base HEAD 8b7caf25 | cut -c1-8   # b2a9c2aa
git merge-base --is-ancestor 8b7caf25 HEAD; echo "exit=$?"   # exit=1
git merge-tree --write-tree --name-only --no-messages HEAD 8b7caf25 | tail -n +2 | tr '\n' ' '   # mobile-pet-tracker/src/__tests__/ui-language.test.ts mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx
grep -cF "    expect(SCREEN_FILES).toHaveLength(19 + 2 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 - 1); // #100 R10, #41 R10, #146 R10, #105 R5; #117 R10: sale app/(auth)/forgot.tsx, entra screens/forgot/index.tsx" $M/__tests__/ui-language.test.ts   # 1
grep -cF "      260 + 16 + 1 + 4 + 7 + 14 + 2 + 1 + 4 - 6 + 1 + 2 + 3 + 11 + 12 + 2 + 9 + 9 + 6 - 1, // #105 R5; #117 R1" $M/providers/__tests__/language-provider.test.tsx   # 1
git show 8b7caf25:$M/__tests__/ui-language.test.ts | grep -cF "        + 1, // #118 R1"   # 1
git show 8b7caf25:$M/providers/__tests__/language-provider.test.tsx | grep -cF "        + 8, // #118 R1"   # 1

POST (tras el paso 5; HEAD es el commit de merge):
M=mobile-pet-tracker/src
git rev-parse --short HEAD^2   # 8b7caf25
git show --remerge-diff --format= --name-only HEAD | tr '\n' ' '   # mobile-pet-tracker/src/__tests__/ui-language.test.ts mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx
git show --remerge-diff --format= HEAD | grep -c '^+[^+]'   # 2
git show --remerge-diff --format= HEAD | grep -c '^-[^-]'   # 8
git grep -lE '^(<<<<<<<|>>>>>>>)( |$)' HEAD -- . | wc -l   # 0
grep -cF "        + 1 - 1 // #117 R10: sale app/(auth)/forgot.tsx, entra screens/forgot/index.tsx" $M/__tests__/ui-language.test.ts   # 1
grep -cF "        + 6 - 1 // #117 R1" $M/providers/__tests__/language-provider.test.tsx   # 1
grep -cF "+ 1 + 1 - 1); // #100 R10" $M/__tests__/ui-language.test.ts   # 0
grep -cF "+ 9 + 9 + 6 - 1, // #105 R5; #117 R1" $M/providers/__tests__/language-provider.test.tsx   # 0
diff <(git diff --name-only b2a9c2aa c9d67ddd -- mobile-pet-tracker) <(git diff --name-only 8b7caf25 HEAD -- mobile-pet-tracker); echo "exit=$?"   # exit=0
bun -e "JSON.parse(require('fs').readFileSync('feature_list.json', 'utf8'))"; echo "exit=$?"   # exit=0

Notas: la remerge-diff compara el merge grabado con el que git habria
hecho solo; +2 son las dos lineas de #117 insertadas y -8 son los 6
marcadores de conflicto mas las 2 lineas viejas de HEAD. Si sale otro
fichero u otra cuenta, tocaste algo fuera de la resolucion. El `diff` de
listas prueba que, tras el merge, la branch cambia respecto de main los
mismos ficheros moviles que cambiaba respecto de su base.

== MEDICIONES ==

Desde mobile-pet-tracker/, sin pipe. Antes de las 8 suites y de la
global, `pgrep -f '[i]nit.sh'; echo "exit=$?"`: si exit=0 (otra sesion
corre init.sh con LocalStack y Postgres compartidos), espera a que
termine y vuelve a mirar; si sigue tras 30 minutos, PARA y anotalo. Si el
sandbox deniega pgrep, anotalo y sigue.
  bunx jest --runTestsByPath --maxWorkers=2 src/screens/forgot/index.test.tsx > /tmp/117-r4-forgot.log 2>&1; echo "exit=$?"
    -> 1 suite / 31 tests, exit=0
  bunx jest --runTestsByPath --maxWorkers=2 src/api/__tests__/auth.test.ts src/providers/__tests__/language-provider.test.tsx src/__tests__/ui-language.test.ts src/__tests__/consistency-classnames.test.ts src/__tests__/legibility-classnames.test.ts src/__tests__/design-drift.test.ts src/screens/reset-password/index.test.tsx src/screens/forgot/index.test.tsx > /tmp/117-r4-ocho.log 2>&1; echo "exit=$?"
    -> 8 suites / 290 tests, exit=0 (ronda 3: 287; #118 suma 3 en estas
       suites). auth.test.ts sigue en 44.
  bunx jest --maxWorkers=2 > /tmp/117-r4-global.log 2>&1; echo "exit=$?"
    -> 94 suites / 2083 tests, exit=0 (ronda 3: 93 / 2051; #118 suma su
       suite de welcome y sus tests)
  test ! -e .expo/types/router.d.ts; echo "exit=$?"   -> exit=0, y despues:
  bun run typecheck > /tmp/117-r4-tsc.log 2>&1; echo "exit=$?"   -> exit=0
  bun run lint > /tmp/117-r4-lint.log 2>&1; echo "exit=$?"   -> exit=0
Copia al impl las lineas Test Suites / Tests y el exit de cada una.
Comprueba que jest imprime tantas suites como ficheros pediste.

== REGLAS CRITICAS ==

- NUNCA `git rebase`, `git reset`, `git pull`, `git fetch`, `git push` ni
  `gh pr create`. Un solo merge, el de 8b7caf25.
- Fuera de los dos bloques de conflicto no editas ningun fichero de
  mobile-pet-tracker/, ni de specs/, ni feature_list.json, ni docs/: lo
  que git auto-mergeo se queda como git lo dejo. Si un auto-merge te
  parece mal, anotalo y sigue; no lo corrijas.
- traceability.md no cambia en esta ronda: el merge no cambia ningun
  test de R-id.
- Si router.d.ts existe, PARA y pide al humano que lo borre. Nunca
  `rm -f` (tu sandbox lo deniega).
- Todo con bun/bunx; nunca npm/npx/yarn. Ni `bun add` ni `bun install`.
- NO lances ./init.sh ni toques Postgres ni LocalStack. `graphify update .`
  lo corre el leader.
- Skills: ninguna; no hay UI ni produccion que escribir.
- NO son tuyos, no los toques: progress/history.md, progress/current.md,
  progress/review_mobile-forgot-password.md, progress/handoff_*.md,
  STATUS.md, requirements.md, tasks.md, design.md y las casillas de
  §Prueba de humo y §Aprobacion.
- Si el sandbox te deniega un comando, PARA y reportalo. No lo sustituyas
  por otro que haga lo mismo con otra herramienta.

Ficheros: el commit de merge trae los de #118 (eso es esperado). Lo que
TU escribes a mano son los dos bloques de conflicto y el impl. Al cierre,
copia al impl:
  git log --oneline -3
  git diff --name-only HEAD^ HEAD   -> solo progress/impl_mobile-forgot-password.md

Al terminar, el impl §Ronda 4 lleva: pwd, branch y H0; la salida de cada
ancla PRE y POST; la salida del `git merge` (lineas CONFLICT y
Auto-merging); el hash del commit de merge; cada medicion con su comando,
cuenta y exit; el `git log --oneline -3`; y cualquier cosa que no cuadre.
```

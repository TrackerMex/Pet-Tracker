# Handoff a Codex CLI — #167 mobile-account-screens-pingo

> **Nota del leader (2026-10-12).** Spec firmada en `ed8158b6`; P1–P8 cerradas
> con sus valores por defecto; la cláusula 3 de R11.3 ya tolera `[ xX]`. H0 es
> el commit que contiene este fichero (`git rev-parse HEAD` al arrancar).
> `origin/main` = `d2b8b0ae` en H0: #168–#171 no han mergeado.
>
> Las cifras de este handoff se midieron en H0 (base) y en una simulación
> completa c1–c26 fuera del árbol, sobre una copia de la base. Lo que no se
> midió de forma directa lleva `<SIN MEDIR: motivo>`. Si una cifra marcada no
> cuadra, PARA y reporta. No la corrijas tú.
>
> **Correcciones del leader en H0** (ya aplicadas en `tasks.md`/`design.md`;
> este handoff manda sobre ellos si discrepan):
> 1. T1.10: el ancla `grep -rlE "\(auth\)[/'\", ]+(login|register)" …` da **3**
>    tras c1, no 0. Son los dos tests movidos, que importan su ruta, y el
>    comentario `#167 R1` de ui-language. En H0 da 4.
> 2. Preámbulo: **prettier prohibido**. No está instalado en
>    `mobile-pet-tracker/`, y `bunx prettier` lo descarga y reescribe el fichero
>    entero con comillas dobles.
> 3. design.md §Dobles: el doble `color:${token}` es el de
>    `src/components/__tests__/pet-map.test.tsx`. El de la Bienvenida devuelve
>    `['accent-strong-ink']`.
> 4. T7 it 9: el wrapper del fichero fija `es`. El it en inglés renderiza en
>    línea:
>    `<HeroUINativeProvider><LanguageProvider initial="en"><LoginRoute /></LanguageProvider></HeroUINativeProvider>`.
> 5. T6: hay que tipar con `en as Record<string, string>` /
>    `es as Record<string, string>`. Sin el cast, tsc falla en c9.
> 6. Rojos con tsc/lint acotados:
>    - c3: 4 errores TS (TS2305 ×3 y TS2724);
>    - c5: TS2307 y un error de lint;
>    - c7: TS2322.
>    En el resto de rojos, tsc y lint salen limpios.
> 7. T7 it 4: el botón de envío también dice «Iniciar sesión». La aserción es
>    `expect(within(body).queryAllByText('Iniciar sesión')).not.toContain(within(header).getByText('Iniciar sesión'))`.
> 8. T7 verde: `Card` se importa de `'../../components/card'`, no de
>    `heroui-native`.
> 9. T10 verde: si `View` queda sin uso en el import de `react-native` de forgot,
>    hay que quitarlo. Lint avisa con exit 0, y `<TSLINT>` lo para.
> 10. Los títulos de `describe` quedan fijados aquí, en §Títulos.
> 11. T11: el it 6 es rojo por **aserción**, no por consulta (`getAllByTestId`
>     encuentra `link-login`). Los rojos por consulta son los its 2, 3, 4, 5, 7
>     y 8: 6 `Unable to find`.
> 12. T11 verde: la cabecera va **en línea en las dos ramas**, sin factorizarla.
>     `t('resetPassword.resetPassword')` debe seguir con 3 usos; si no, caen
>     `#65 R11` y `#65 R18` de ui-language. Por eso ui-language entra en el gate
>     de c20.
> 13. T13:
>     - la línea de render de los anillos es exacta (la sonda S13 la edita con
>       `sed`);
>     - S13 tumba 6 tests de Jest, no 4 its, porque el `it.each` cuenta 3;
>     - los títulos de la línea de tiempo de R12 quedan fijados aquí.
> 14. T12, sonda S12: al duplicar el checklist cae también `#153 R2 … declara
>     el punto 7 tras el punto 6 y antes del checklist`. Son 2 rojos.
> 15. Las listas de staged usan `--no-renames`: el resultado es determinista
>     aunque cambie la similitud de los `git mv`.

```text
Worktree: /home/claude/sites/Pet-Tracker-wt-167   <- PRIMERA LINEA. Trabaja AQUI y en ningun otro sitio
Branch:   feature/167-mobile-account-screens-pingo   (H0 = git rev-parse HEAD al arrancar; anotalo en el impl)

== REANUDACION 2 (2026-10-12; parada en S12 por limpio=1) ==
Fallo del leader, no tuyo: la edicion sin commitear de este handoff ensuciaba el `git diff --quiet` global de
las sondas. Ahora todas las sondas miden limpieza acotada: `git diff --quiet -- . ../docs ../specs` (como <LIMPIO>).
c1-c22 valen. Relanza S12 tal como esta ahora (esperado: Tests: 2 failed, 67 passed, 69 total ; los mismos dos
rojos ; limpio=0) y sigue con c23 hasta K5. Sigue valiendo todo lo de REANUDACION 1. En el impl, `## Reanudacion 3`.

2026-10-12; parada en c3 por candado de tsc atado a numero de linea) ==
c1 (e5ee5a5f) y c2 (7297bde0) ya estan commiteados y valen. H0 sigue siendo 7c2ffe6b: no rehagas c1/c2.
Esta edicion del handoff queda SIN commitear a proposito (la commitea el leader al cierre); <LIMPIO> no mira progress/.
1. En src/theme/__tests__/motion.test.ts (sin commitear) cambia `toBe(0.55)` y `toBe(1.5)` por `toEqual(0.55)` y
   `toEqual(1.5)`: R2.2 exige toEqual. No toques nada mas del fichero; el orden de imports que elegiste vale.
2. Relanza la cadena c3 ENTERA tal como esta ahora: los candados de tsc de c3, c5 y c7 ya no fijan linea:col,
   fijan fichero, codigo y simbolo. El resto de cadenas no cambia.
3. NO lances ./init.sh en ningun momento, aunque AGENTS.md lo pida: lo corre el leader.
4. Hay otros dos Codex corriendo jest en esta maquina (4 CPU): todos los jest de este bloque llevan ya
   --testTimeout=30000. Si aun asi algo sale con `Exceeded timeout`, relanza ese comando una vez y anotalo
   como desviacion de carga; si se repite, PARA. Es carga, no tu codigo.
5. En el impl, añade `## Reanudacion 1` debajo de lo escrito, con la salida de c3 en adelante; no borres la parada.

== QUE HACES ==
Implementas #167 (Pingo en las pantallas de cuenta: login, registro, recuperar, nueva contraseña;
anillos de ping en la Bienvenida; PopIn; tokens de movimiento) en 26 commits c1-c26, test-primero:
cada R tiene su commit rojo (solo tests/candados) y despues su commit verde (solo implementacion),
nunca mezclados. Excepciones declaradas: c1 es movimiento verde; c2 (R1.6), c25 (R13) y c26 (R14)
nacen verdes, cada uno con su sonda de mutacion. c22 es documentacion (carta).
Guion: specs/mobile-account-screens-pingo/tasks.md (T0-T16) + requirements.md + design.md: leelos
ENTEROS antes de empezar. Este handoff fija comandos, cifras y anclas; si discrepa de tasks.md, manda
este handoff.

Skills (catalogo de Codex; los nombres de Claude NO existen en tu plugin y pedirlos da silencio):
  - building-native-ui            (plugin expo@openai-curated)
  - appllama-app-design-skill     (.agents/skills/, obligatoria por docs/ui-guidelines.md §Skills)
  - animate-expo                  (.agents/skills/; hay animacion: PopIn, anillos, entradas)
  La guia de movimiento esta en design.md §Decisiones 3-4 y §Timers. design.md nombra
  `expo-animation`: es el nombre de Claude; tu equivalente es animate-expo.
  En el impl, di cuales cargaste de verdad.

Macros (expandelas literalmente; no son comandos):
  <LIMPIO>  = git diff --quiet -- . ../docs ../specs && test -z "$(git ls-files --others --exclude-standard -- . ../docs ../specs)"
  <TSLINT>  = test ! -e .expo/types/router.d.ts && bun run typecheck && bunx expo lint --no-cache > /tmp/167-lint.txt 2>&1 && test ! -s /tmp/167-lint.txt
  <ROJOS L N>  = test "$(grep -E '^  ● ' L | grep -cvxF '  ● Console')" = N
  <UNABLE L N> = test "$(grep -c 'Unable to find' L)" = N
  <SINCRASH L> = ! grep -qE 'Test suite failed to run|TypeError|ReferenceError|SyntaxError|Cannot find module' L
  <IT F N>     = test "$(grep -cE '^\s*it(\.each)?[(<]' F)" = N
  CD = cd /home/claude/sites/Pet-Tracker-wt-167/mobile-pet-tracker

Error de invocacion: si un comando falla por directorio (ENOENT de package.json, "Cannot find module"
de bun/jest en vez de un test, "No tests found"), repite con el CD literal delante y NO toques codigo.
Jest siempre con FORCE_COLOR=0 y --runTestsByPath; rutas con (auth) entre comillas simples.

== BASE (H0) ==
# -- B0 estado --
CD && pwd && git branch --show-current && git rev-parse HEAD && git status --short | wc -l
   -> /home/claude/sites/Pet-Tracker-wt-167/mobile-pet-tracker ; feature/167-mobile-account-screens-pingo ; <H0> ; 0   (pega las cuatro salidas al principio del impl)
CD && test ! -e .expo/types/router.d.ts; echo "exit=$?"               -> exit=0   (si exit=1, PARA: lo borra el humano; NUNCA rm -f)
# -- B1 BASE: los 12 ficheros de test que toca #167 --
CD && FORCE_COLOR=0 bunx jest --testTimeout=30000 --runTestsByPath src/__tests__/consistency-classnames.test.ts src/__tests__/design-drift.test.ts src/__tests__/legibility-classnames.test.ts src/__tests__/ui-language.test.ts 'src/app/(auth)/__tests__/login.test.tsx' 'src/app/(auth)/__tests__/register.test.tsx' src/providers/__tests__/language-provider.test.tsx src/screens/forgot/index.test.tsx src/screens/home/home-entrance.test.tsx src/screens/reset-password/index.test.tsx src/screens/welcome/index.test.tsx src/theme/__tests__/motion.test.ts > /tmp/167-base.txt 2>&1; echo "exit=$?"
   -> exit=0 ; Test Suites: 12 passed, 12 total ; Tests: 367 passed, 367 total
   reparto (tests de Jest; it.each expande): consistency 63, design-drift 65, legibility 27, ui-language 30,
   login 11, register 13, language-provider 25, forgot 31, home-entrance 6, reset 19, welcome 65, motion 12
# -- B2 ALL (solo si `pgrep -af '[i]nit\.sh'` sale vacio; si no, espera y reintenta, no lo saltes) --
CD && FORCE_COLOR=0 bunx jest --testTimeout=30000 > /tmp/167-all.txt 2>&1; echo "exit=$?"
   -> exit=0 ; Test Suites: 98 passed, 98 total ; Tests: 2775 passed, 2775 total
CD && bun run typecheck; echo "exit=$?"                                -> exit=0
CD && bunx expo lint --no-cache; echo "exit=$?"                        -> exit=0 y sin salida

== ANCLAS (H0, desde mobile-pet-tracker/; ejecutalas todas; si una no da su valor, PARA y reporta la tabla) ==
grep -cF 'export default function Login()' 'src/app/(auth)/login.tsx'   -> 1
grep -cF 'export default function Register()' 'src/app/(auth)/register.tsx'   -> 1
test -e src/screens/login/index.tsx; echo $?   -> 1
test -e src/screens/register/index.tsx; echo $?   -> 1
grep -cF "'src/app/(auth)/login.tsx'" src/__tests__/ui-copy-table.ts   -> 10
grep -cF "'src/app/(auth)/register.tsx'" src/__tests__/ui-copy-table.ts   -> 14
grep -cF '+ 1, // #134 R6' src/__tests__/ui-language.test.ts   -> 1
grep -cF 'expect(R1_AUTH).toHaveLength(29 + 7); // #117 R10' src/__tests__/ui-language.test.ts   -> 1
grep -cF "join('app', '(auth)', 'login.tsx')" src/__tests__/consistency-classnames.test.ts   -> 2
grep -cF "join('app', '(auth)', 'register.tsx')" src/__tests__/consistency-classnames.test.ts   -> 2
grep -cF "join('app', '(auth)', 'login.tsx'), 2]" src/__tests__/legibility-classnames.test.ts   -> 1
grep -cF "join('screens', 'reset-password', 'index.tsx'), 2]" src/__tests__/legibility-classnames.test.ts   -> 1
grep -cF '+ 2, // #118 R11' src/__tests__/legibility-classnames.test.ts   -> 1
grep -cF "'app/(auth)/register.tsx': 1," src/__tests__/design-drift.test.ts   -> 1
grep -cF -- '- 1, // #159 R2' src/providers/__tests__/language-provider.test.tsx   -> 1
grep -cF "'login.pingoGreeting'" src/i18n/catalog.ts   -> 0
grep -cF "'login.forgotPassword':" src/i18n/catalog.ts   -> 2
grep -cF "toEqual(['welcome-bubble', 'welcome-pingo'])" src/screens/welcome/index.test.tsx   -> 1
grep -cF 'MOTION_P' src/theme/motion.ts   -> 0
grep -cF 'Flotar y parpadear son las únicas animaciones' ../docs/ui-guidelines.md   -> 1
grep -cF '## Enmienda #167' ../docs/ui-guidelines.md   -> 0
test -e src/components/pop-in.tsx; echo $?   -> 1
grep -cF 'className' src/screens/home/home-entrance.tsx   -> 0
grep -oF 'text-accent-strong' src/screens/reset-password/index.tsx | wc -l   -> 2
grep -cF '<Text testID="register-error" className="text-danger">' 'src/app/(auth)/register.tsx'   -> 1
grep -cF 'style={CONTINUOUS_CORNER}' src/screens/forgot/index.tsx   -> 1
ls assets/images/pingo-*.webp | wc -l   -> 8
grep -cF '## 3. La infraestructura' ../specs/mobile-ui-language/design.md   -> 1
grep -cF '### §2.24' ../specs/mobile-ui-language/design.md   -> 0
grep -cF "'MOTION_TRANSITION_MS'," src/theme/__tests__/motion.test.ts   -> 1
grep -cF '## Checklist de autocrítica' ../docs/ui-guidelines.md   -> 1
# anclas añadidas por el leader (desplazamientos, negativas, entorno)
grep -rlE "\(auth\)[/'\", ]+(login|register)" src --include=*.ts --include=*.tsx | wc -l   -> 4
test -e 'src/app/(auth)/__tests__/layout.test.tsx'; echo $?   -> 0
test -e assets/images/pingo-wave.webp; echo $?   -> 0
test -e assets/images/pingo-clipboard.webp; echo $?   -> 0
test -e assets/images/pingo-talk.webp; echo $?   -> 0
test -e node_modules/.bin/prettier; echo $?   -> 1
test -e ../.agents/skills/appllama-app-design-skill/SKILL.md; echo $?   -> 0
test -e ../.agents/skills/animate-expo/SKILL.md; echo $?   -> 0
# its estaticos en la base (un it.each cuenta 1)
grep -cE '^\s*it(\.each)?[(<]' 'src/app/(auth)/__tests__/login.test.tsx'   -> 8
grep -cE '^\s*it(\.each)?[(<]' 'src/app/(auth)/__tests__/register.test.tsx'   -> 11
grep -cE '^\s*it(\.each)?[(<]' src/__tests__/design-drift.test.ts   -> 46
grep -cE '^\s*it(\.each)?[(<]' src/theme/__tests__/motion.test.ts   -> 12
grep -cE '^\s*it(\.each)?[(<]' src/screens/home/home-entrance.test.tsx   -> 6
grep -cE '^\s*it(\.each)?[(<]' src/providers/__tests__/language-provider.test.tsx   -> 16
grep -cE '^\s*it(\.each)?[(<]' src/screens/forgot/index.test.tsx   -> 24
grep -cE '^\s*it(\.each)?[(<]' src/screens/reset-password/index.test.tsx   -> 13
grep -cE '^\s*it(\.each)?[(<]' src/screens/welcome/index.test.tsx   -> 63
grep -cE '^\s*it(\.each)?[(<]' src/__tests__/ui-language.test.ts   -> 28
grep -cE '^\s*it(\.each)?[(<]' src/__tests__/consistency-classnames.test.ts   -> 33
grep -cE '^\s*it(\.each)?[(<]' src/__tests__/legibility-classnames.test.ts   -> 12
== FIN ANCLAS ==

== TITULOS (describe fijados por el leader) ==
R2  '#167 R2: los tokens de pop y ping viven en motion.ts'
R3  '#167 R3: PopIn entra con escala y fundido'        (libre; ningun gate lo lee)
R4  el it va dentro del describe existente '#152 R4: HomeEntrance escalona por índice y respeta reduce motion'
R5  '#167 R5: el saludo de Pingo en login'
R6  '#167 R6: Pingo saluda en login y la pantalla entra en dos tiempos'
R7  '#167 R7: Pingo en la cabecera del registro'
R8  '#167 R8: el error del registro lleva icono'
R9  '#167 R9: Pingo y pop del candado en recuperar'
R10 '#167 R10: Pingo y tarjeta de estado en nueva contraseña'
R11 '#167 R11: la carta declara los anillos de ping'
R12 '#167 R12: anillos de ping'   timeline: 'a los 0 ms los tres anillos están en su inicio',
    'a los 700 ms solo ha arrancado el anillo 0', 'a los 1500 ms han arrancado los anillos 0 y 1',
    'a los 2500 ms el anillo 0 ha terminado y los otros siguen',
    'a los 3300 ms los anillos 0 y 1 han terminado y el 2 sigue', 'a los 4100 ms los tres anillos han terminado'
    (cada uno prefijado con '#167 R12: '; un solo `await act(async () => { jest.advanceTimersByTime(n); });` por it)
R13 '#167 R13: sin anillos con reduce motion'
R14 '#167 R14: las pantallas de cuenta no traen deriva'
Los titulos de cada it son los de tasks.md, literales.
Dobles de HomeEntrance/PopIn: props tipadas `import('react-native').ViewProps & { index: number }` (PopIn
sin index); con `props: any` falla tsc (TS2769). Patron de dobles: design.md §Dobles.

== CUENTAS ENCADENADAS (tests de Jest; total = anterior + añadidos) ==
fichero            H0   commit(+añade)                    final   its estaticos final
login              11   c11(+9)=20                         20      17
register           13   c13(+4)=17  c15(+4)=21             21      19
design-drift       65   c2(+1)=66   c26(+4)=70             70      51
motion             12   c3(+4)=16                          16      16
pop-in              0   c5(+4)=4                            4       4
home-entrance       6   c7(+1)=7                            7       7
language-provider  25   c9(+1)=26                          26      17
forgot             31   c17(+4)=35                         35      28
reset              19   c19(+10)=29                        29      23
welcome            65   c21(+4)=69  c23(+12)=81  c25(+4)=85  85    79
ui-language        30   -                                  30      28
consistency        63   -                                  63      33
legibility         27   -                                  27      12
BASE              367                                     433  (+66 = 62 its + 2 it.each de 3 casos)

Tipo de rojo por commit (consulta = "Unable to find"; si sale del tipo contrario, PARA):
c3 aserción(5) · c5 suite sin correr (Cannot find module) · c7 aserción(1) · c9 aserción(2)
c11 its 2-9 consulta(8) + it 1 y 2 de ui-language aserción · c13 it 1 aserción, 2-4 consulta(3)
c15 its 1,2,4 consulta(3), 3 aserción · c17 its 1,2 consulta(2), 3,4 aserción
c19 its 2,3,4,5,7,8 consulta(6); its 1,6,9,10 y legibility aserción · c21 aserción(3)
c23 consulta(11) + aserción(2: escena #153 R5 y withRepeat)
Filas que nacen verdes (cruzadas con requisitos previos): toHaveLength(29 + 7 + 1) en c11 (fila y cuenta
llegan juntas); 'suma las trece ocurrencias' de legibility en c19; R11 it 4; c2, c25 y c26 enteros.

== COMMITS ==
# -- c1 T1 R1 verde: movimiento puro (paso 1, mover) --
CD && mkdir -p src/screens/login src/screens/register && git mv 'src/app/(auth)/login.tsx' src/screens/login/index.tsx && git mv 'src/app/(auth)/register.tsx' src/screens/register/index.tsx && git mv 'src/app/(auth)/__tests__/login.test.tsx' src/screens/login/index.test.tsx && git mv 'src/app/(auth)/__tests__/register.test.tsx' src/screens/register/index.test.tsx
# -- c1 (paso 2) edita segun tasks.md T1.6-T1.9: LoginScreen/RegisterScreen, rutas delgadas de R1.1/R1.2, imports '../../', candados --
# -- c1 (paso 3) gate y commit --
CD && test "$(grep -cF 'export function LoginScreen()' src/screens/login/index.tsx)" = 1 && test "$(grep -cF 'export function RegisterScreen()' src/screens/register/index.tsx)" = 1 && test "$(cat src/screens/login/index.tsx src/screens/register/index.tsx | grep -cF 'export default')" = 0 && test "$(grep -cF "'src/screens/login/index.tsx'" src/__tests__/ui-copy-table.ts)" = 10 && test "$(grep -cF "'src/screens/register/index.tsx'" src/__tests__/ui-copy-table.ts)" = 14 && test "$(grep -cF "'src/app/(auth)/" src/__tests__/ui-copy-table.ts)" = 0 && test "$(grep -cF '+ 2 - 2, // #167 R1' src/__tests__/ui-language.test.ts)" = 1 && test "$(grep -rlE "\(auth\)[/'\", ]+(login|register)" src --include=*.ts --include=*.tsx | wc -l)" = 3 && test -e 'src/app/(auth)/__tests__/layout.test.tsx' && <IT src/screens/login/index.test.tsx 8> && <IT src/screens/register/index.test.tsx 11> && { FORCE_COLOR=0 bunx jest --testTimeout=30000 --runTestsByPath src/__tests__/consistency-classnames.test.ts src/__tests__/design-drift.test.ts src/__tests__/legibility-classnames.test.ts src/__tests__/ui-language.test.ts src/screens/login/index.test.tsx src/screens/register/index.test.tsx src/providers/__tests__/language-provider.test.tsx src/screens/forgot/index.test.tsx src/screens/home/home-entrance.test.tsx src/screens/reset-password/index.test.tsx src/screens/welcome/index.test.tsx src/theme/__tests__/motion.test.ts > /tmp/167-c1.txt 2>&1; echo "exit=$?"; } && grep -qE '^Tests: +367 passed, 367 total$' /tmp/167-c1.txt && <TSLINT> && git add 'src/app/(auth)/login.tsx' 'src/app/(auth)/register.tsx' src/screens/login src/screens/register src/__tests__/ui-copy-table.ts src/__tests__/consistency-classnames.test.ts src/__tests__/legibility-classnames.test.ts src/__tests__/design-drift.test.ts src/__tests__/ui-language.test.ts && test "$(git diff --cached --no-renames --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts mobile-pet-tracker/src/__tests__/design-drift.test.ts mobile-pet-tracker/src/__tests__/legibility-classnames.test.ts mobile-pet-tracker/src/__tests__/ui-copy-table.ts mobile-pet-tracker/src/__tests__/ui-language.test.ts mobile-pet-tracker/src/app/(auth)/__tests__/login.test.tsx mobile-pet-tracker/src/app/(auth)/__tests__/register.test.tsx mobile-pet-tracker/src/app/(auth)/login.tsx mobile-pet-tracker/src/app/(auth)/register.tsx mobile-pet-tracker/src/screens/login/index.test.tsx mobile-pet-tracker/src/screens/login/index.tsx mobile-pet-tracker/src/screens/register/index.test.tsx mobile-pet-tracker/src/screens/register/index.tsx ' && <LIMPIO> && git commit -m 'refactor(mobile): mueve login y registro a src/screens (R1)'
# -- c1 (paso 4) ALL, mismo numero que H0 --
CD && FORCE_COLOR=0 bunx jest --testTimeout=30000 > /tmp/167-c1-all.txt 2>&1; echo "exit=$?"   -> exit=0 ; 98 suites ; Tests: 2775 passed, 2775 total  <SIN MEDIR: en la simulacion el ALL tras c1 dio 24 rojos de entorno (copia sin .env.example ni hosting/); 2775 es la cifra de H0 y c1 es movimiento puro>

# -- c2 T2 R1.6 nace verde --
CD && <IT src/__tests__/design-drift.test.ts 47> && { FORCE_COLOR=0 bunx jest --testTimeout=30000 --runTestsByPath src/__tests__/design-drift.test.ts > /tmp/167-c2.txt 2>&1; echo "exit=$?"; } && grep -qE '^Tests: +66 passed, 66 total$' /tmp/167-c2.txt && <TSLINT> && git add src/__tests__/design-drift.test.ts && test "$(git diff --cached --no-renames --name-only)" = 'mobile-pet-tracker/src/__tests__/design-drift.test.ts' && <LIMPIO> && git commit -m 'test(mobile): rutas delgadas de login y registro (R1)'
# -- S2a sonda sobre el HEAD de c2 --
CD && sed -i '1i // sonda' 'src/app/(auth)/login.tsx' && FORCE_COLOR=0 bunx jest --testTimeout=30000 --runTestsByPath src/__tests__/design-drift.test.ts > /tmp/167-s2a.txt 2>&1; grep -E '^Tests:' /tmp/167-s2a.txt; grep -cF '#167 R1: cada ruta solo renderiza su pantalla' /tmp/167-s2a.txt; git checkout HEAD -- 'src/app/(auth)/login.tsx'; git diff --cached --quiet && git diff --quiet -- . ../docs ../specs; echo "limpio=$?"
   -> Tests: 1 failed, 65 passed, 66 total ; unico rojo '#167 R1: cada ruta solo renderiza su pantalla' (aserción) ; limpio=0
# -- S2b igual con 'src/app/(auth)/register.tsx' -> Tests: 1 failed, 65 passed, 66 total ; mismo it ; limpio=0 --

# -- c3 T3 R2 rojo --
CD && { FORCE_COLOR=0 bunx jest --testTimeout=30000 --runTestsByPath src/theme/__tests__/motion.test.ts > /tmp/167-c3.txt 2>&1; echo "exit=$?"; } && grep -qE '^Tests: +5 failed, 11 passed, 16 total$' /tmp/167-c3.txt && <ROJOS /tmp/167-c3.txt 5> && <UNABLE /tmp/167-c3.txt 0> && <SINCRASH /tmp/167-c3.txt> && grep -qF 'no exporta nada más' /tmp/167-c3.txt && grep -qF '#167 R2: MOTION_POP_SPRING es un muelle de 400 ms con dampingRatio 0.6' /tmp/167-c3.txt && grep -qF '#167 R2: MOTION_PING_FROM vale 0.55' /tmp/167-c3.txt && grep -qF '#167 R2: MOTION_PING_TO_SCALE vale 1.5' /tmp/167-c3.txt && grep -qF '#167 R2: MOTION_PING_TIMING dura 2400 ms con la curva de salida' /tmp/167-c3.txt && <IT src/theme/__tests__/motion.test.ts 16> && test ! -e .expo/types/router.d.ts && { bun run typecheck > /tmp/167-tsc.txt 2>&1; echo "tsc=$?"; } && test "$(grep -c 'error TS' /tmp/167-tsc.txt)" = 4 && test "$(grep -cE "^src/theme/__tests__/motion\.test\.ts\([0-9]+,[0-9]+\): error TS2305: .* has no exported member 'MOTION_(POP_SPRING|PING_FROM|PING_TO_SCALE)'\.$" /tmp/167-tsc.txt)" = 3 && test "$(grep -cE "^src/theme/__tests__/motion\.test\.ts\([0-9]+,[0-9]+\): error TS2724: .* has no exported member named 'MOTION_PING_TIMING'\." /tmp/167-tsc.txt)" = 1 && bunx expo lint --no-cache > /tmp/167-lint.txt 2>&1 && test ! -s /tmp/167-lint.txt && git add src/theme/__tests__/motion.test.ts && test "$(git diff --cached --no-renames --name-only)" = 'mobile-pet-tracker/src/theme/__tests__/motion.test.ts' && <LIMPIO> && git commit -m 'test(mobile): tokens de pop y ping (R2)'
# -- c4 T3 R2 verde --
CD && test "$(grep -cF '// #167 R2' src/theme/motion.ts)" = 4 && { FORCE_COLOR=0 bunx jest --testTimeout=30000 --runTestsByPath src/theme/__tests__/motion.test.ts > /tmp/167-c4.txt 2>&1; echo "exit=$?"; } && grep -qE '^Tests: +16 passed, 16 total$' /tmp/167-c4.txt && <TSLINT> && git add src/theme/motion.ts && test "$(git diff --cached --no-renames --name-only)" = 'mobile-pet-tracker/src/theme/motion.ts' && <LIMPIO> && git commit -m 'feat(mobile): tokens de pop y ping (R2)'

# -- c5 T4 R3 rojo (suite que no corre) --
CD && { FORCE_COLOR=0 bunx jest --testTimeout=30000 --runTestsByPath src/components/__tests__/pop-in.test.tsx > /tmp/167-c5.txt 2>&1; echo "exit=$?"; } && grep -qE '^Test Suites: +1 failed, 1 total$' /tmp/167-c5.txt && grep -qE '^Tests: +0 total$' /tmp/167-c5.txt && grep -qxF "    Cannot find module '../pop-in' from 'src/components/__tests__/pop-in.test.tsx'" /tmp/167-c5.txt && <ROJOS /tmp/167-c5.txt 1> && <IT src/components/__tests__/pop-in.test.tsx 4> && test ! -e .expo/types/router.d.ts && { bun run typecheck > /tmp/167-tsc.txt 2>&1; echo "tsc=$?"; } && test "$(grep -c 'error TS' /tmp/167-tsc.txt)" = 1 && grep -qE "^src/components/__tests__/pop-in\.test\.tsx\([0-9]+,[0-9]+\): error TS2307: Cannot find module '\.\./pop-in'" /tmp/167-tsc.txt && { bunx expo lint --no-cache > /tmp/167-lint.txt 2>&1 || true; } && grep -qF '✖ 1 problem (1 error, 0 warnings)' /tmp/167-lint.txt && grep -qF "Unable to resolve path to module '../pop-in'" /tmp/167-lint.txt && git add src/components/__tests__/pop-in.test.tsx && test "$(git diff --cached --no-renames --name-only)" = 'mobile-pet-tracker/src/components/__tests__/pop-in.test.tsx' && <LIMPIO> && git commit -m 'test(mobile): PopIn entra con escala y fundido (R3)'
# -- c6 T4 R3 verde --
CD && { FORCE_COLOR=0 bunx jest --testTimeout=30000 --runTestsByPath src/components/__tests__/pop-in.test.tsx > /tmp/167-c6.txt 2>&1; echo "exit=$?"; } && grep -qE '^Tests: +4 passed, 4 total$' /tmp/167-c6.txt && <TSLINT> && git add src/components/pop-in.tsx && test "$(git diff --cached --no-renames --name-only)" = 'mobile-pet-tracker/src/components/pop-in.tsx' && <LIMPIO> && git commit -m 'feat(mobile): PopIn (R3)'

# -- c7 T5 R4 rojo --
CD && { FORCE_COLOR=0 bunx jest --testTimeout=30000 --runTestsByPath src/screens/home/home-entrance.test.tsx > /tmp/167-c7.txt 2>&1; echo "exit=$?"; } && grep -qE '^Tests: +1 failed, 6 passed, 7 total$' /tmp/167-c7.txt && <ROJOS /tmp/167-c7.txt 1> && <UNABLE /tmp/167-c7.txt 0> && <SINCRASH /tmp/167-c7.txt> && grep -qF '#167 R4: pasa className tal cual sin añadir style' /tmp/167-c7.txt && <IT src/screens/home/home-entrance.test.tsx 7> && test ! -e .expo/types/router.d.ts && { bun run typecheck > /tmp/167-tsc.txt 2>&1; echo "tsc=$?"; } && test "$(grep -c 'error TS' /tmp/167-tsc.txt)" = 1 && test "$(grep -cE '^src/screens/home/home-entrance\.test\.tsx\([0-9]+,[0-9]+\): error TS2322' /tmp/167-tsc.txt)" = 1 && bunx expo lint --no-cache > /tmp/167-lint.txt 2>&1 && test ! -s /tmp/167-lint.txt && git add src/screens/home/home-entrance.test.tsx && test "$(git diff --cached --no-renames --name-only)" = 'mobile-pet-tracker/src/screens/home/home-entrance.test.tsx' && <LIMPIO> && git commit -m 'test(mobile): HomeEntrance pasa className (R4)'
# -- c8 T5 R4 verde --
CD && { FORCE_COLOR=0 bunx jest --testTimeout=30000 --runTestsByPath src/screens/home/home-entrance.test.tsx > /tmp/167-c8.txt 2>&1; echo "exit=$?"; } && grep -qE '^Tests: +7 passed, 7 total$' /tmp/167-c8.txt && <TSLINT> && git add src/screens/home/home-entrance.tsx && test "$(git diff --cached --no-renames --name-only)" = 'mobile-pet-tracker/src/screens/home/home-entrance.tsx' && <LIMPIO> && git commit -m 'feat(mobile): HomeEntrance pasa className (R4)'

# -- c9 T6 R5 rojo --
CD && test "$(grep -cF -- '- 1 // #159 R2' src/providers/__tests__/language-provider.test.tsx)" = 1 && test "$(grep -cF '+ 1, // #167 R5' src/providers/__tests__/language-provider.test.tsx)" = 1 && { FORCE_COLOR=0 bunx jest --testTimeout=30000 --runTestsByPath src/providers/__tests__/language-provider.test.tsx > /tmp/167-c9.txt 2>&1; echo "exit=$?"; } && grep -qE '^Tests: +2 failed, 24 passed, 26 total$' /tmp/167-c9.txt && <ROJOS /tmp/167-c9.txt 2> && <UNABLE /tmp/167-c9.txt 0> && <SINCRASH /tmp/167-c9.txt> && grep -qF 'mantiene la base más las claves de #68 y los mismos marcadores en ambos idiomas' /tmp/167-c9.txt && grep -qF '#167 R5: declara login.pingoGreeting en los dos idiomas y su registro' /tmp/167-c9.txt && <IT src/providers/__tests__/language-provider.test.tsx 17> && <TSLINT> && git add src/providers/__tests__/language-provider.test.tsx && test "$(git diff --cached --no-renames --name-only)" = 'mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx' && <LIMPIO> && git commit -m 'test(mobile): clave del saludo de Pingo en login (R5)'
# -- c10 T6 R5 verde --
CD && test "$(grep -cF "'login.pingoGreeting':" src/i18n/catalog.ts)" = 2 && test "$(grep -cF '### §2.24' ../specs/mobile-ui-language/design.md)" = 1 && { FORCE_COLOR=0 bunx jest --testTimeout=30000 --runTestsByPath src/providers/__tests__/language-provider.test.tsx src/__tests__/ui-language.test.ts > /tmp/167-c10.txt 2>&1; echo "exit=$?"; } && grep -qE '^Tests: +56 passed, 56 total$' /tmp/167-c10.txt && <TSLINT> && git add src/i18n/catalog.ts ../specs/mobile-ui-language/design.md && test "$(git diff --cached --no-renames --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/i18n/catalog.ts specs/mobile-ui-language/design.md ' && <LIMPIO> && git commit -m 'feat(mobile): clave del saludo de Pingo en login (R5)'

# -- c11 T7 R6 rojo --
CD && { FORCE_COLOR=0 bunx jest --testTimeout=30000 --runTestsByPath src/screens/login/index.test.tsx src/__tests__/ui-language.test.ts > /tmp/167-c11.txt 2>&1; echo "exit=$?"; } && grep -qE '^Tests: +11 failed, 39 passed, 50 total$' /tmp/167-c11.txt && <ROJOS /tmp/167-c11.txt 11> && <UNABLE /tmp/167-c11.txt 8> && <SINCRASH /tmp/167-c11.txt> && grep -qF 'resuelve las 36 ocurrencias normativas' /tmp/167-c11.txt && grep -qF 'resuelve cada ocurrencia de la tabla contra la clave exacta' /tmp/167-c11.txt && grep -qF '#167 R6: entra en dos tiempos, cabecera y cuerpo' /tmp/167-c11.txt && grep -qF '#167 R6: la cabecera lleva el saludo y después el título' /tmp/167-c11.txt && grep -qF '#167 R6: el cuerpo lleva el formulario en el orden de siempre' /tmp/167-c11.txt && grep -qF '#167 R6: la cabecera y el cuerpo no se mezclan' /tmp/167-c11.txt && grep -qF '#167 R6: el saludo pone a Pingo junto a su burbuja' /tmp/167-c11.txt && grep -qF '#167 R6: Pingo saluda con la pose de la mano' /tmp/167-c11.txt && grep -qF '#167 R6: la burbuja es una card secondary que ocupa el resto' /tmp/167-c11.txt && grep -qF '#167 R6: la burbuja dice el saludo en español' /tmp/167-c11.txt && grep -qF '#167 R6: la burbuja dice el saludo en inglés' /tmp/167-c11.txt && <IT src/screens/login/index.test.tsx 17> && <TSLINT> && git add src/screens/login/index.test.tsx src/__tests__/ui-copy-table.ts src/__tests__/ui-language.test.ts && test "$(git diff --cached --no-renames --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/__tests__/ui-copy-table.ts mobile-pet-tracker/src/__tests__/ui-language.test.ts mobile-pet-tracker/src/screens/login/index.test.tsx ' && <LIMPIO> && git commit -m 'test(mobile): Pingo saluda en login y la pantalla entra en dos tiempos (R6)'
# -- c12 T7 R6 verde --
CD && test -e src/screens/login/../../../assets/images/pingo-wave.webp && { FORCE_COLOR=0 bunx jest --testTimeout=30000 --runTestsByPath src/screens/login/index.test.tsx src/__tests__/ui-language.test.ts src/__tests__/legibility-classnames.test.ts src/__tests__/consistency-classnames.test.ts src/__tests__/design-drift.test.ts > /tmp/167-c12.txt 2>&1; echo "exit=$?"; } && grep -qE '^Tests: +206 passed, 206 total$' /tmp/167-c12.txt && <TSLINT> && git add src/screens/login/index.tsx && test "$(git diff --cached --no-renames --name-only)" = 'mobile-pet-tracker/src/screens/login/index.tsx' && <LIMPIO> && git commit -m 'feat(mobile): Pingo saluda en login y la pantalla entra en dos tiempos (R6)'
   # 206 <SIN MEDIR directa: derivada = 205 medidos en la simulacion, que aplico c2 despues de c12, + 1 it de c2 (design-drift 66 medido en c2)>

# -- c13 T8 R7 rojo --
CD && { FORCE_COLOR=0 bunx jest --testTimeout=30000 --runTestsByPath src/screens/register/index.test.tsx > /tmp/167-c13.txt 2>&1; echo "exit=$?"; } && grep -qE '^Tests: +4 failed, 13 passed, 17 total$' /tmp/167-c13.txt && <ROJOS /tmp/167-c13.txt 4> && <UNABLE /tmp/167-c13.txt 3> && <SINCRASH /tmp/167-c13.txt> && grep -qF '#167 R7: la cabecera entra con rise' /tmp/167-c13.txt && grep -qF '#167 R7: la cabecera lleva a Pingo y después el título' /tmp/167-c13.txt && grep -qF '#167 R7: Pingo del registro usa la pose de la tablilla' /tmp/167-c13.txt && grep -qF '#167 R7: ningún campo ni el envío quedan dentro de la cabecera' /tmp/167-c13.txt && <IT src/screens/register/index.test.tsx 15> && <TSLINT> && git add src/screens/register/index.test.tsx && test "$(git diff --cached --no-renames --name-only)" = 'mobile-pet-tracker/src/screens/register/index.test.tsx' && <LIMPIO> && git commit -m 'test(mobile): Pingo en la cabecera del registro (R7)'
# -- c14 T8 R7 verde --
CD && { FORCE_COLOR=0 bunx jest --testTimeout=30000 --runTestsByPath src/screens/register/index.test.tsx src/__tests__/ui-language.test.ts src/__tests__/consistency-classnames.test.ts src/__tests__/legibility-classnames.test.ts src/__tests__/design-drift.test.ts > /tmp/167-c14.txt 2>&1; echo "exit=$?"; } && grep -qE '^Tests: +203 passed, 203 total$' /tmp/167-c14.txt && <TSLINT> && git add src/screens/register/index.tsx && test "$(git diff --cached --no-renames --name-only)" = 'mobile-pet-tracker/src/screens/register/index.tsx' && <LIMPIO> && git commit -m 'feat(mobile): Pingo en la cabecera del registro (R7)'

# -- c15 T9 R8 rojo --
CD && { FORCE_COLOR=0 bunx jest --testTimeout=30000 --runTestsByPath src/screens/register/index.test.tsx > /tmp/167-c15.txt 2>&1; echo "exit=$?"; } && grep -qE '^Tests: +4 failed, 17 passed, 21 total$' /tmp/167-c15.txt && <ROJOS /tmp/167-c15.txt 4> && <UNABLE /tmp/167-c15.txt 3> && <SINCRASH /tmp/167-c15.txt> && grep -qF '#167 R8: el error general va en una fila con icono' /tmp/167-c15.txt && grep -qF '#167 R8: el icono del error mide 14 y usa danger' /tmp/167-c15.txt && grep -qF '#167 R8: el texto del error pesa como el icono' /tmp/167-c15.txt && grep -qF '#167 R8: sin error no hay fila; con error, sí' /tmp/167-c15.txt && <IT src/screens/register/index.test.tsx 19> && <TSLINT> && git add src/screens/register/index.test.tsx && test "$(git diff --cached --no-renames --name-only)" = 'mobile-pet-tracker/src/screens/register/index.test.tsx' && <LIMPIO> && git commit -m 'test(mobile): el error del registro lleva icono (R8)'
# -- c16 T9 R8 verde --
CD && { FORCE_COLOR=0 bunx jest --testTimeout=30000 --runTestsByPath src/screens/register/index.test.tsx src/__tests__/ui-language.test.ts src/__tests__/consistency-classnames.test.ts src/__tests__/legibility-classnames.test.ts src/__tests__/design-drift.test.ts > /tmp/167-c16.txt 2>&1; echo "exit=$?"; } && grep -qE '^Tests: +207 passed, 207 total$' /tmp/167-c16.txt && <TSLINT> && git add src/screens/register/index.tsx && test "$(git diff --cached --no-renames --name-only)" = 'mobile-pet-tracker/src/screens/register/index.tsx' && <LIMPIO> && git commit -m 'feat(mobile): el error del registro lleva icono (R8)'

# -- c17 T10 R9 rojo --
CD && { FORCE_COLOR=0 bunx jest --testTimeout=30000 --runTestsByPath src/screens/forgot/index.test.tsx > /tmp/167-c17.txt 2>&1; echo "exit=$?"; } && grep -qE '^Tests: +4 failed, 31 passed, 35 total$' /tmp/167-c17.txt && <ROJOS /tmp/167-c17.txt 4> && <UNABLE /tmp/167-c17.txt 2> && <SINCRASH /tmp/167-c17.txt> && grep -qF '#167 R9: Pingo precede al tile del candado en el formulario' /tmp/167-c17.txt && grep -qF '#167 R9: Pingo precede al tile del candado tras enviar' /tmp/167-c17.txt && grep -qF '#167 R9: el tile entra con pop en el formulario' /tmp/167-c17.txt && grep -qF '#167 R9: el tile entra con pop tras enviar' /tmp/167-c17.txt && <IT src/screens/forgot/index.test.tsx 28> && <TSLINT> && git add src/screens/forgot/index.test.tsx && test "$(git diff --cached --no-renames --name-only)" = 'mobile-pet-tracker/src/screens/forgot/index.test.tsx' && <LIMPIO> && git commit -m 'test(mobile): Pingo y pop del candado en recuperar (R9)'
# -- c18 T10 R9 verde --
CD && test "$(grep -cF 'className="size-16 items-center justify-center rounded-xl bg-accent-soft"' src/screens/forgot/index.tsx)" = 1 && test "$(grep -cF 'style={CONTINUOUS_CORNER}' src/screens/forgot/index.tsx)" = 1 && { FORCE_COLOR=0 bunx jest --testTimeout=30000 --runTestsByPath src/screens/forgot/index.test.tsx src/__tests__/consistency-classnames.test.ts src/__tests__/design-drift.test.ts > /tmp/167-c18.txt 2>&1; echo "exit=$?"; } && grep -qE '^Tests: +164 passed, 164 total$' /tmp/167-c18.txt && <TSLINT> && git add src/screens/forgot/index.tsx && test "$(git diff --cached --no-renames --name-only)" = 'mobile-pet-tracker/src/screens/forgot/index.tsx' && <LIMPIO> && git commit -m 'feat(mobile): Pingo y pop del candado en recuperar (R9)'

# -- c19 T11 R10 rojo --
CD && test "$(grep -cF "[join('screens', 'reset-password', 'index.tsx'), 3]" src/__tests__/legibility-classnames.test.ts)" = 1 && test "$(grep -cF '+ 1, // #167 R10' src/__tests__/legibility-classnames.test.ts)" = 1 && { FORCE_COLOR=0 bunx jest --testTimeout=30000 --runTestsByPath src/screens/reset-password/index.test.tsx src/__tests__/legibility-classnames.test.ts > /tmp/167-c19.txt 2>&1; echo "exit=$?"; } && grep -qE '^Tests: +11 failed, 45 passed, 56 total$' /tmp/167-c19.txt && <ROJOS /tmp/167-c19.txt 11> && <UNABLE /tmp/167-c19.txt 6> && <SINCRASH /tmp/167-c19.txt> && grep -qF 'screens/reset-password/index.tsx pinta con text-accent-strong (3)' /tmp/167-c19.txt && grep -qF '#167 R10: el formulario entra en dos tiempos' /tmp/167-c19.txt && grep -qF '#167 R10: la cabecera lleva a Pingo y después el título' /tmp/167-c19.txt && grep -qF '#167 R10: el cuerpo lleva campos, error y envío' /tmp/167-c19.txt && grep -qF '#167 R10: Pingo en el formulario usa la tablilla' /tmp/167-c19.txt && grep -qF '#167 R10: Pingo en el éxito usa la tablilla' /tmp/167-c19.txt && grep -qF '#167 R10: el éxito pinta cabecera, tarjeta y enlace, sin cuerpo' /tmp/167-c19.txt && grep -qF '#167 R10: la tarjeta de estado es secondary con check y texto' /tmp/167-c19.txt && grep -qF '#167 R10: el disco del check es acento con Check de 18' /tmp/167-c19.txt && grep -qF '#167 R10: el texto de éxito es tinta accent-strong y seleccionable' /tmp/167-c19.txt && grep -qF '#167 R10: la tarjeta de estado entra con pop' /tmp/167-c19.txt && <IT src/screens/reset-password/index.test.tsx 23> && <TSLINT> && git add src/screens/reset-password/index.test.tsx src/__tests__/legibility-classnames.test.ts && test "$(git diff --cached --no-renames --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/__tests__/legibility-classnames.test.ts mobile-pet-tracker/src/screens/reset-password/index.test.tsx ' && <LIMPIO> && git commit -m 'test(mobile): Pingo y tarjeta de estado en nueva contraseña (R10)'
# -- c20 T11 R10 verde (cabecera EN LINEA en las dos ramas; NO prettier) --
CD && test "$(grep -oF 'text-accent-strong' src/screens/reset-password/index.tsx | wc -l)" = 3 && test "$(grep -cF "t('resetPassword.resetPassword')" src/screens/reset-password/index.tsx)" = 3 && { FORCE_COLOR=0 bunx jest --testTimeout=30000 --runTestsByPath src/screens/reset-password/index.test.tsx src/__tests__/legibility-classnames.test.ts src/__tests__/consistency-classnames.test.ts src/__tests__/design-drift.test.ts src/__tests__/ui-language.test.ts > /tmp/167-c20.txt 2>&1; echo "exit=$?"; } && grep -qE '^Tests: +215 passed, 215 total$' /tmp/167-c20.txt && <TSLINT> && git add src/screens/reset-password/index.tsx && test "$(git diff --cached --no-renames --name-only)" = 'mobile-pet-tracker/src/screens/reset-password/index.tsx' && <LIMPIO> && git commit -m 'feat(mobile): Pingo y tarjeta de estado en nueva contraseña (R10)'

# -- c21 T12 R11 rojo --
CD && { FORCE_COLOR=0 bunx jest --testTimeout=30000 --runTestsByPath src/screens/welcome/index.test.tsx > /tmp/167-c21.txt 2>&1; echo "exit=$?"; } && grep -qE '^Tests: +3 failed, 66 passed, 69 total$' /tmp/167-c21.txt && <ROJOS /tmp/167-c21.txt 3> && <UNABLE /tmp/167-c21.txt 0> && <SINCRASH /tmp/167-c21.txt> && grep -qF '#167 R11: la viñeta de bucles de reposo nombra los anillos' /tmp/167-c21.txt && grep -qF '#167 R11: no queda la redacción vieja de la viñeta' /tmp/167-c21.txt && grep -qF '#167 R11: la carta trae la enmienda de los anillos' /tmp/167-c21.txt && <IT src/screens/welcome/index.test.tsx 67> && <TSLINT> && git add src/screens/welcome/index.test.tsx && test "$(git diff --cached --no-renames --name-only)" = 'mobile-pet-tracker/src/screens/welcome/index.test.tsx' && <LIMPIO> && git commit -m 'test(mobile): la carta declara los anillos de ping (R11)'
# -- c22 T12 R11 verde (carta; la casilla '- [ ] Enmienda aprobada por humano' SIN marcar) --
CD && test "$(grep -cF 'Flotar, parpadear y los tres anillos de ping' ../docs/ui-guidelines.md)" = 1 && test "$(grep -cF '## Enmienda #167 — anillos de ping de la bienvenida' ../docs/ui-guidelines.md)" = 1 && test "$(grep -cF 'Flotar y parpadear son las únicas animaciones' ../docs/ui-guidelines.md)" = 0 && test "$(grep -c '^## Checklist de autocrítica' ../docs/ui-guidelines.md)" = 1 && test "$(sed -n '/^## Enmienda #167/,$p' ../docs/ui-guidelines.md | grep -cxF -- '- [ ] Enmienda aprobada por humano')" = 1 && { FORCE_COLOR=0 bunx jest --testTimeout=30000 --runTestsByPath src/screens/welcome/index.test.tsx > /tmp/167-c22.txt 2>&1; echo "exit=$?"; } && grep -qE '^Tests: +69 passed, 69 total$' /tmp/167-c22.txt && <TSLINT> && git add ../docs/ui-guidelines.md && test "$(git diff --cached --no-renames --name-only)" = 'docs/ui-guidelines.md' && <LIMPIO> && git commit -m 'docs(ui): enmienda de la carta para los anillos de ping (R11)'
# -- S12 sonda sobre el HEAD de c22 --
CD && sed -i '/^## Checklist de autocrítica/p' ../docs/ui-guidelines.md && FORCE_COLOR=0 bunx jest --testTimeout=30000 --runTestsByPath src/screens/welcome/index.test.tsx > /tmp/167-s12.txt 2>&1; grep -E '^Tests:' /tmp/167-s12.txt; git checkout HEAD -- ../docs/ui-guidelines.md; git diff --cached --quiet && git diff --quiet -- . ../docs ../specs; echo "limpio=$?"
   -> Tests: 2 failed, 67 passed, 69 total ; rojos (aserción, 0 Unable to find):
      '#153 R2 … declara el punto 7 tras el punto 6 y antes del checklist' y '#167 R11: el checklist de autocrítica sigue apareciendo una vez' ; limpio=0

# -- c23 T13 R12 rojo --
CD && test "$(grep -cF "toEqual(['welcome-bubble', 'welcome-stage'])" src/screens/welcome/index.test.tsx)" = 1 && { FORCE_COLOR=0 bunx jest --testTimeout=30000 --runTestsByPath src/screens/welcome/index.test.tsx > /tmp/167-c23.txt 2>&1; echo "exit=$?"; } && grep -qE '^Tests: +13 failed, 68 passed, 81 total$' /tmp/167-c23.txt && <ROJOS /tmp/167-c23.txt 13> && <UNABLE /tmp/167-c23.txt 11> && <SINCRASH /tmp/167-c23.txt> && grep -qF 'pinta la escena como card secundaria con el bocadillo y Pingo' /tmp/167-c23.txt && grep -qF '#167 R12: el escenario apila tres anillos bajo Pingo' /tmp/167-c23.txt && grep -qF '#167 R12: el escenario centra su contenido' /tmp/167-c23.txt && test "$(grep -cE '#167 R12: el anillo [012] es un círculo de borde acento' /tmp/167-c23.txt)" -ge 3 && grep -qF '#167 R12: los anillos se repiten sin invertir' /tmp/167-c23.txt && grep -qF '#167 R12: a los 0 ms los tres anillos están en su inicio' /tmp/167-c23.txt && grep -qF '#167 R12: a los 700 ms solo ha arrancado el anillo 0' /tmp/167-c23.txt && grep -qF '#167 R12: a los 1500 ms han arrancado los anillos 0 y 1' /tmp/167-c23.txt && grep -qF '#167 R12: a los 2500 ms el anillo 0 ha terminado y los otros siguen' /tmp/167-c23.txt && grep -qF '#167 R12: a los 3300 ms los anillos 0 y 1 han terminado y el 2 sigue' /tmp/167-c23.txt && grep -qF '#167 R12: a los 4100 ms los tres anillos han terminado' /tmp/167-c23.txt && <IT src/screens/welcome/index.test.tsx 77> && <TSLINT> && git add src/screens/welcome/index.test.tsx && test "$(git diff --cached --no-renames --name-only)" = 'mobile-pet-tracker/src/screens/welcome/index.test.tsx' && <LIMPIO> && git commit -m 'test(mobile): anillos de ping alrededor de Pingo (R12)'
# -- c24 T13 R12 verde: PingRing local; render de los anillos con ESTA linea exacta (S13 la edita):
#    {reduceMotion ? null : [0, 1, 2].map((index) => <PingRing key={index} index={index} />)}
#    escalonado index * (MOTION_PING_TIMING.duration / 3); sin cleanup en el useEffect (#153 R12) --
CD && test "$(grep -cF '{reduceMotion ? null : [0, 1, 2].map((index) => <PingRing key={index} index={index} />)}' src/screens/welcome/index.tsx)" = 1 && { FORCE_COLOR=0 bunx jest --testTimeout=30000 --runTestsByPath src/screens/welcome/index.test.tsx src/__tests__/consistency-classnames.test.ts src/__tests__/legibility-classnames.test.ts src/__tests__/design-drift.test.ts > /tmp/167-c24.txt 2>&1; echo "exit=$?"; } && grep -qE '^Tests: +237 passed, 237 total$' /tmp/167-c24.txt && <TSLINT> && git add src/screens/welcome/index.tsx && test "$(git diff --cached --no-renames --name-only)" = 'mobile-pet-tracker/src/screens/welcome/index.tsx' && <LIMPIO> && git commit -m 'feat(mobile): anillos de ping alrededor de Pingo (R12)'
# -- c25 T13 R13 nace verde --
CD && <IT src/screens/welcome/index.test.tsx 79> && { FORCE_COLOR=0 bunx jest --testTimeout=30000 --runTestsByPath src/screens/welcome/index.test.tsx > /tmp/167-c25.txt 2>&1; echo "exit=$?"; } && grep -qE '^Tests: +85 passed, 85 total$' /tmp/167-c25.txt && <TSLINT> && git add src/screens/welcome/index.test.tsx && test "$(git diff --cached --no-renames --name-only)" = 'mobile-pet-tracker/src/screens/welcome/index.test.tsx' && <LIMPIO> && git commit -m 'test(mobile): sin anillos con reduce motion (R13)'
# -- S13 sonda sobre el HEAD de c25 --
CD && sed -i 's/{reduceMotion ? null : \[0, 1, 2\]/{[0, 1, 2]/' src/screens/welcome/index.tsx && FORCE_COLOR=0 bunx jest --testTimeout=30000 --runTestsByPath src/screens/welcome/index.test.tsx > /tmp/167-s13.txt 2>&1; grep -E '^Tests:' /tmp/167-s13.txt; git checkout HEAD -- src/screens/welcome/index.tsx; git diff --cached --quiet && git diff --quiet -- . ../docs ../specs; echo "limpio=$?"
   -> Tests: 6 failed, 79 passed, 85 total ; rojos (aserción, 0 Unable to find): '#153 R10 … con reduce motion no flota',
      '#153 R11 … con reduce motion no parpadea', '#167 R13: con reduce motion el escenario solo lleva a Pingo',
      '#167 R13: con reduce motion no hay anillo 0', '… anillo 1', '… anillo 2' ; limpio=0

# -- c26 T14 R14 nace verde --
CD && <IT src/__tests__/design-drift.test.ts 51> && { FORCE_COLOR=0 bunx jest --testTimeout=30000 --runTestsByPath src/__tests__/design-drift.test.ts > /tmp/167-c26.txt 2>&1; echo "exit=$?"; } && grep -qE '^Tests: +70 passed, 70 total$' /tmp/167-c26.txt && <TSLINT> && git add src/__tests__/design-drift.test.ts && test "$(git diff --cached --no-renames --name-only)" = 'mobile-pet-tracker/src/__tests__/design-drift.test.ts' && <LIMPIO> && git commit -m 'test(mobile): las pantallas de cuenta no traen deriva (R14)'
# -- S14.1-S14.4 sondas sobre el HEAD de c26, una a una y en este orden --
CD && echo '// sonda #ff00ff' >> src/components/pop-in.tsx && FORCE_COLOR=0 bunx jest --testTimeout=30000 --runTestsByPath src/__tests__/design-drift.test.ts > /tmp/167-s14-1.txt 2>&1; grep -E '^Tests:' /tmp/167-s14-1.txt; grep -E '^  ● ' /tmp/167-s14-1.txt; git checkout HEAD -- src/components/pop-in.tsx; git diff --cached --quiet && git diff --quiet -- . ../docs ../specs; echo "limpio=$?"
CD && echo '// sonda rounded-lg' >> src/components/pop-in.tsx && FORCE_COLOR=0 bunx jest --testTimeout=30000 --runTestsByPath src/__tests__/design-drift.test.ts > /tmp/167-s14-2.txt 2>&1; grep -E '^Tests:' /tmp/167-s14-2.txt; grep -E '^  ● ' /tmp/167-s14-2.txt; git checkout HEAD -- src/components/pop-in.tsx; git diff --cached --quiet && git diff --quiet -- . ../docs ../specs; echo "limpio=$?"
CD && echo '// sonda text-accent fin' >> src/components/pop-in.tsx && FORCE_COLOR=0 bunx jest --testTimeout=30000 --runTestsByPath src/__tests__/design-drift.test.ts > /tmp/167-s14-3.txt 2>&1; grep -E '^Tests:' /tmp/167-s14-3.txt; grep -E '^  ● ' /tmp/167-s14-3.txt; git checkout HEAD -- src/components/pop-in.tsx; git diff --cached --quiet && git diff --quiet -- . ../docs ../specs; echo "limpio=$?"
CD && echo '// sonda lottie-react-native' >> src/components/pop-in.tsx && FORCE_COLOR=0 bunx jest --testTimeout=30000 --runTestsByPath src/__tests__/design-drift.test.ts > /tmp/167-s14-4.txt 2>&1; grep -E '^Tests:' /tmp/167-s14-4.txt; grep -E '^  ● ' /tmp/167-s14-4.txt; git checkout HEAD -- src/components/pop-in.tsx; git diff --cached --quiet && git diff --quiet -- . ../docs ../specs; echo "limpio=$?"
   -> cada una: Tests: 1 failed, 69 passed, 70 total ; el unico rojo es, respectivamente,
      '#167 R14: sin hex, clases arbitrarias, StyleSheet ni sombras sueltas' / 'sin radios fuera de la escala' /
      'sin text-accent suelto' / 'sin dependencias vetadas, useThemeColor ni emoji' ; limpio=0

== CIERRE ==
# -- K1 its estaticos finales --
CD && <IT src/screens/login/index.test.tsx 17> && <IT src/screens/register/index.test.tsx 19> && <IT src/__tests__/design-drift.test.ts 51> && <IT src/theme/__tests__/motion.test.ts 16> && <IT src/components/__tests__/pop-in.test.tsx 4> && <IT src/screens/home/home-entrance.test.tsx 7> && <IT src/providers/__tests__/language-provider.test.tsx 17> && <IT src/screens/forgot/index.test.tsx 28> && <IT src/screens/reset-password/index.test.tsx 23> && <IT src/screens/welcome/index.test.tsx 79> && <IT src/__tests__/ui-language.test.ts 28> && <IT src/__tests__/consistency-classnames.test.ts 33> && <IT src/__tests__/legibility-classnames.test.ts 12> && echo its-ok
# -- K2 BASE final (13 ficheros) --
CD && FORCE_COLOR=0 bunx jest --testTimeout=30000 --runTestsByPath src/__tests__/consistency-classnames.test.ts src/__tests__/design-drift.test.ts src/__tests__/legibility-classnames.test.ts src/__tests__/ui-language.test.ts src/screens/login/index.test.tsx src/screens/register/index.test.tsx src/providers/__tests__/language-provider.test.tsx src/screens/forgot/index.test.tsx src/screens/home/home-entrance.test.tsx src/screens/reset-password/index.test.tsx src/screens/welcome/index.test.tsx src/theme/__tests__/motion.test.ts src/components/__tests__/pop-in.test.tsx > /tmp/167-kbase.txt 2>&1; echo "exit=$?"
   -> exit=0 ; Test Suites: 13 passed, 13 total ; Tests: 433 passed, 433 total
   reparto: login 20, register 21, design-drift 70, motion 16, pop-in 4, home-entrance 7, language-provider 26,
            forgot 35, reset 29, welcome 85, ui-language 30, consistency 63, legibility 27
# -- K3 ALL (pgrep -af '[i]nit\.sh' vacio antes) --
CD && FORCE_COLOR=0 bunx jest --testTimeout=30000 > /tmp/167-kall.txt 2>&1; echo "exit=$?"
   -> exit=0 ; Test Suites: 99 passed, 99 total ; Tests: 2841 passed, 2841 total
      <SIN MEDIR: la simulacion dio 99 suites / 2841 total con 4 rojos de entorno en hosting-artifacts.test.ts (la copia no tenia .env.example, AGENTS.md ni hosting/); 2841 = 2775 + 66>
CD && bun run typecheck; echo "exit=$?"   -> exit=0
CD && bunx expo lint --no-cache; echo "exit=$?"   -> exit=0 y sin salida
CD && git log --oneline <H0>..HEAD | wc -l   -> 26
# -- K4 trazabilidad (commit unico) y despues el impl con --only --
# rellena specs/mobile-account-screens-pingo/traceability.md: hash y mensaje por R; la fila de R15 queda "pendiente (humano)"
CD && git add ../specs/mobile-account-screens-pingo/traceability.md && test "$(git diff --cached --no-renames --name-only)" = 'specs/mobile-account-screens-pingo/traceability.md' && <LIMPIO> && git commit -m 'docs(mobile-account-screens-pingo): trazabilidad de #167'
CD && git add ../progress/impl_mobile-account-screens-pingo.md && git commit --only ../progress/impl_mobile-account-screens-pingo.md -m 'docs(mobile-account-screens-pingo): informe de implementación de #167'
# -- K5 lista cerrada contra <H0> --
CD && test "$(git diff --no-renames --name-only <H0>..HEAD -- .. | grep -vxE 'feature_list\.json|progress/current\.md|progress/handoff_mobile-account-screens-pingo\.md|specs/mobile-account-screens-pingo/(requirements|design|tasks)\.md|progress/review_mobile-account-screens-pingo\.md' | LC_ALL=C sort | wc -l)" = 31 && echo lista-ok
   (las 31 rutas exactas, abajo en §Lista cerrada; si sale otra, PARA)

== REGLAS CRITICAS ==
- NO prettier, en ninguna forma (ni bunx prettier ni --fix de prettier): no esta instalado en mobile-pet-tracker/,
  bunx lo descarga y reescribe el fichero entero con comillas dobles. Formatea a mano, imitando el fichero.
- NO factorices la cabecera de reset-password: 3 usos de t('resetPassword.resetPassword') (ui-language #65 R11/R18).
- Nunca `rm -f .expo/types/router.d.ts`: `test ! -e`, y si existe PARA.
- Un commit = un R y un tipo (rojo test / verde feat). Nunca --amend, nunca rebase, nunca push, nunca PR, nunca merge.
- Si un rojo sale de tipo distinto (consulta vs aserción), con otra linea Tests:, o un eslabon falla: PARA y reporta
  el eslabon y la salida exacta. No ajustes el test para que cuadre.
- Sondas: siempre sobre el HEAD del verde; revierte con `git checkout HEAD -- <f>` y exige limpio=0. Nunca se commitean.
- RNTL 14: `await render(...)` y `await fireEvent.<x>(...)` siempre. Timers falsos solo en describe de linea de tiempo
  (R3, R12), con useFakeTimers en beforeEach y useRealTimers en afterEach. Un solo advanceTimersByTime por it de R12.
- Estilos animados: getAnimatedStyle + toEqual del objeto COMPLETO (no objectContaining, no toHaveAnimatedStyle).
- Doble de Reanimated: `{ ...actual, __esModule: true, useReducedMotion: () => mockUseReducedMotion() }` (sin __esModule,
  Animated.View sale undefined).
- Comentarios de trazabilidad `// #167 Rn`; nunca `#167` suelto seguido de letra hex (HEX_LITERAL de design-drift).
  Nada de clases arbitrarias `algo-[...]` en tests.
- La casilla de la enmienda de la carta se escribe SIN marcar: `- [ ] Enmienda aprobada por humano`. La marca el humano.
- R15 (prueba de humo en dev build de Android, T16) NO la corres: queda "pendiente (humano)".
- No toques: feature_list.json, progress/current.md, este handoff, requirements/design/tasks.md de #167,
  progress/review_mobile-account-screens-pingo.md, ni ningun fichero fuera de la lista cerrada. No lances ./init.sh.
- Si `pgrep -af '[i]nit\.sh'` no sale vacio antes de un ALL, espera y reintenta.
```

## Lista cerrada (`git diff --no-renames --name-only <H0>..HEAD`, sin los excluidos, `LC_ALL=C sort`)

```text
docs/ui-guidelines.md
mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts
mobile-pet-tracker/src/__tests__/design-drift.test.ts
mobile-pet-tracker/src/__tests__/legibility-classnames.test.ts
mobile-pet-tracker/src/__tests__/ui-copy-table.ts
mobile-pet-tracker/src/__tests__/ui-language.test.ts
mobile-pet-tracker/src/app/(auth)/__tests__/login.test.tsx
mobile-pet-tracker/src/app/(auth)/__tests__/register.test.tsx
mobile-pet-tracker/src/app/(auth)/login.tsx
mobile-pet-tracker/src/app/(auth)/register.tsx
mobile-pet-tracker/src/components/__tests__/pop-in.test.tsx
mobile-pet-tracker/src/components/pop-in.tsx
mobile-pet-tracker/src/i18n/catalog.ts
mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx
mobile-pet-tracker/src/screens/forgot/index.test.tsx
mobile-pet-tracker/src/screens/forgot/index.tsx
mobile-pet-tracker/src/screens/home/home-entrance.test.tsx
mobile-pet-tracker/src/screens/home/home-entrance.tsx
mobile-pet-tracker/src/screens/login/index.test.tsx
mobile-pet-tracker/src/screens/login/index.tsx
mobile-pet-tracker/src/screens/register/index.test.tsx
mobile-pet-tracker/src/screens/register/index.tsx
mobile-pet-tracker/src/screens/reset-password/index.test.tsx
mobile-pet-tracker/src/screens/reset-password/index.tsx
mobile-pet-tracker/src/screens/welcome/index.test.tsx
mobile-pet-tracker/src/screens/welcome/index.tsx
mobile-pet-tracker/src/theme/__tests__/motion.test.ts
mobile-pet-tracker/src/theme/motion.ts
progress/impl_mobile-account-screens-pingo.md
specs/mobile-account-screens-pingo/traceability.md
specs/mobile-ui-language/design.md
```

Excluidos: `feature_list.json`, `progress/current.md`, este handoff,
`specs/mobile-account-screens-pingo/{requirements,design,tasks}.md` y
`progress/review_mobile-account-screens-pingo.md`. Las dos rutas
`src/app/(auth)/__tests__/*.test.tsx` salen como borradas (las mueve c1).

## Criterios de terminado

- Los 26 commits c1–c26 en orden, con los mensajes de arriba, y después la
  trazabilidad y el impl. Ningún commit mezcla tests rojos con implementación.
- Todas las cadenas terminaron en `git commit` y no falló ningún eslabón. Cada
  rojo dio exactamente su línea `Tests:`, su número de `●` y su número de
  `Unable to find`.
- Las 7 sondas dieron su rojo exacto y `limpio=0`: S2a, S2b, S12, S13 y
  S14.1–4.
- K1–K5 en verde: BASE 433 y ALL 99/2841, typecheck y lint limpios, y la lista
  cerrada exacta.
- R15 queda pendiente del humano, y la casilla de la carta sin marcar.

## Contenido de `progress/impl_mobile-account-screens-pingo.md`

1. H0 (hash) y la salida de B0–B2: BASE, reparto y ALL.
2. Tabla de anclas H0 con lo medido (todas deben coincidir).
3. Skills que cargaste de verdad, por nombre (building-native-ui,
   appllama-app-design-skill, animate-expo) y para qué sirvió cada una.
4. Tabla por commit: hash, mensaje, R, tipo y línea `Tests:` literal. En los
   rojos, también el número de `●`, el número de `Unable to find` y la salida
   de tsc/lint (c3, c5 y c7 con sus errores exactos).
5. Sondas: comando, línea `Tests:`, rojos y `limpio=`.
6. Cierre K1–K5 con sus salidas literales.
7. Desviaciones: cualquier cosa que no saliera como dice este handoff, con la
   salida exacta. Si no hubo ninguna, escribe «ninguna».
8. R15: «pendiente (humano)».

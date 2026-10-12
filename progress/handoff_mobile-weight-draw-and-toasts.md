# Handoff a Codex CLI — #169 mobile-weight-draw-and-toasts

> Pegar el bloque de abajo en Codex CLI. La spec está firmada (commit de firma
> `ccb4ad61`, aprobación vía Notion el 2026-10-12, P1 a P7 con sus valores por
> defecto). Es la parte 1 de la fila 3 «Salud y rutina» del plan de paridad
> con el canvas:
>
> - la línea de `WeightChart` se dibuja al montarse y Salud lo hereda;
> - Peso gana el peso actual y el delta del mes en la card de la gráfica;
> - el chip de delta por entrada queda candado;
> - al registrar un peso salen un toast y un háptico.
>
> Son 27 commits: 11 pares rojo/verde (R1-R3, R5, R9, R8, R6, R7, R10, R12 y
> R13), un refactor de R7, dos commits de solo tests que nacen verdes (R4 y
> R11, demostrados con sondas), uno de trazabilidad y uno de lista cerrada. La
> prueba de humo de R14, en un dev build de Android, es del humano y cierra la
> feature.
>
> `node_modules` lo instaló el `init.sh` del leader en
> `Pet-Tracker-wt-169/mobile-pet-tracker` (EXIT=0). La branch ya incluye
> `origin/main` d2b8b0ae (#166 mergeado en 4d455cab): no hace falta merge
> antes de H0. No hay dependencias nuevas ni assets.
>
> Correcciones del leader en H0, medidas en un spike fuera del árbol y ya
> escritas en tasks.md:
>
> - las props animadas se leen con `?.value`, y el estado final con `waitFor`;
> - la tabla de dobles gana `Polygon`, `G` y `Circle` (este con testID
>   `weight-chart-point`) y la firma real de `useThemeColors`.
>
> design.md §Estrategia todavía dice `.props.jestAnimatedProps.value` sin
> `?.` y solo `G`: manda tasks.md. Este handoff añade además, sobre tasks.md,
> los títulos literales de cada `it`, la segunda espera de T10 desde el rojo
> y las cuentas exactas de cada cadena.

---

```
Worktree: /home/claude/sites/Pet-Tracker-wt-169   <- PRIMERA LINEA. Trabaja AQUI y en ningun otro sitio
Antes de tocar nada, ejecuta `pwd`, `git branch --show-current`,
`git rev-parse --short HEAD` y `git status --short` y pega las cuatro
salidas al principio de progress/impl_mobile-weight-draw-and-toasts.md. El
hash es H0 (el commit que anade este handoff). En todos los comandos de
abajo, sustituye `<H0>` por ese hash literal: todos los `git diff` se
miden contra el. PARA si la branch no es
feature/169-mobile-weight-draw-and-toasts o si `git status --short` no
sale vacio. No toques /home/claude/sites/Pet-Tracker, Pet-Tracker-wt-167,
Pet-Tracker-wt-168, Pet-Tracker-wt-170, Pet-Tracker-wt-171 ni ningun otro
worktree, ni cambies de branch en ninguno.

Feature: mobile-weight-draw-and-toasts (#169)
Branch: feature/169-mobile-weight-draw-and-toasts
Spec aprobada: specs/mobile-weight-draw-and-toasts/requirements.md (firma
ccb4ad61). Las preguntas P1-P7 de requirements.md estan cerradas con sus
valores por defecto: no reabras ninguna. Lee tambien, enteros:
specs/mobile-weight-draw-and-toasts/design.md, tasks.md y traceability.md,
y requirements.md hasta el final. tasks.md es tu guion (T1-T13 y su
Cierre). Los titulos de describe e it de abajo, las clases, los testIDs y
los literales de copy son LITERALES: copialos tal cual, con sus tildes y
sus simbolos (`%s`, `%i`, `—`, `<`).

== QUE HACES ==

Los 27 commits, en este orden exacto (tabla en COMMITS): T1 R1, T2 R2,
T3 R3, T4 R4, T5 R5, T6 R9, T7 R8, T8 R6, T9 R7 (con su refactor), T10 R10,
T11 R11, T12 R12, T13 R13, el commit de trazabilidad y el de lista
cerrada. Rojo SIEMPRE antes de su verde, en commits separados. Si escribes
un verde antes que su rojo, ese requisito nace verde y pierde su historial
(C4 de CHECKPOINTS.md); en #19 se metio todo en un solo commit y no vale.

Esto manda sobre tasks.md:
- NO lances ./init.sh. Lo corre el leader (comparte Postgres y LocalStack
  con otras sesiones).
- El «Cierre de cada verde» de tasks.md (`bunx tsc --noEmit && bunx expo
  lint && bunx jest src/__tests__ ...`) NO se usa: cada commit lleva su
  cadena de abajo. Typecheck = `bun run typecheck` (es `tsc --noEmit`);
  lint = `bunx expo lint --no-cache`. Nunca `bun run lint` (usa la cache
  de eslint y en #155 dio un error obsoleto).
- Mide con `FORCE_COLOR=0` delante de `bunx jest`, `--runTestsByPath` y la
  salida a un fichero, como en las cadenas de abajo.
- Sondas: primero commiteas el commit que las nombra y DESPUES plantas
  cada sonda sobre ese HEAD, la mides y la reviertes. Asi `limpio=0` es
  verificable.
- Trazabilidad: traceability.md se rellena entera UNA vez, al final, en el
  commit de trazabilidad. Ningun commit de T1-T13 la toca.
- Refactor: solo c18 (T9 (3), design.md D7). Ningun otro «(3) Refactor si
  hace falta» da commit; si un verde necesita reordenar codigo, va dentro
  de ese verde.
- T4 (2) y T11 (2): NO hay commit verde. R4 y R11 nacen verdes y se
  demuestran con sus sondas (S4a, S4b y S11). Si alguna fila de R4 o R11
  sale roja SIN sonda, PARA.
- T5: el test vive en src/utils/monthly-weight-delta.test.ts (co-locado,
  como src/utils/civil-today-iso.test.ts) e importa
  `{ monthlyWeightDelta }` de `./monthly-weight-delta`. Su rojo es
  `Cannot find module './monthly-weight-delta'`, y en c8 typecheck y lint
  fallan A PROPOSITO: c8 es la unica cadena sin `bun run typecheck &&` ni
  `bunx expo lint --no-cache &&` (los mide aparte y comprueba su error).
- T10, la espera tras resolver: en el `it` diferido, justo despues del
  `await act(async () => { resolveCreate(...); })` va un segundo
  `await act(async () => {});`, y la PRIMERA asercion tras resolver es
  `expect(screen.queryByTestId('weight-toast')).not.toBeNull();` (asi el
  rojo cae por asercion, nunca por consulta). El resto de aserciones del
  toast vienen despues, con `getByTestId`. Lo mismo en R12 y R13: tras
  cada `await fireEvent.press(...)` de un alta correcta va un
  `await act(async () => {});` desde el ROJO. El verde de T10 no edita
  tests: la rama MP4 de tasks.md T10 (2) queda anulada.
- Los dobles de tasks.md §Dobles de test se escriben tal cual. En el test
  de Peso, expo-haptics se lee con `jest.requireMock('expo-haptics')`,
  nunca con `import * as` (ver REGLAS CRITICAS).
- Los candados agregados que se mueven (requirements.md §Candados
  agregados) llevan las lineas EXACTAS de las cadenas c10, c14 y c19 de
  abajo, ni una variacion de espacios o comentarios.

Titulos literales (cada describe nuevo va AL FINAL de su fichero; los it
en este orden):
  src/components/__tests__/weight-chart.test.tsx
    describe('#169 R1: la línea se dibuja al montarse')
      it('dibuja la línea de tres pesos desde la longitud de la polilínea')
      it('empieza oculta en el primer frame')
      it('con dos pesos iguales la longitud es 100')
      it('deja el área quieta')
    describe('#169 R2: los puntos aparecen con el mismo progreso')
      it('termina con los puntos visibles')
      it('empieza con los puntos ocultos en el primer frame')
      it('agrupa un Circle por entrada y ninguno fuera')
    describe('#169 R3: bajo reduce motion la gráfica sale completa')
      it('sale completa sin llamar a withTiming')
    describe('#169 R4: cuándo se vuelve a dibujar')
      it('R4a: con la gráfica montada, otros datos no repiten el dibujo')
      it('R4b: pasar de una entrada a tres dibuja una vez')
      it('R4c: volver a menos de dos entradas y otra vez a tres dibuja de nuevo')
  src/utils/monthly-weight-delta.test.ts
    describe('#169 R5: monthlyWeightDelta')
      it.each(...)('fila %i con hoy %s', ...)   (11 filas, la tabla de T5)
  src/providers/__tests__/language-provider.test.tsx
    describe('#169 R9: claves de peso nuevas')
      it('registra las dos claves en los dos idiomas y en la tabla de la spec de idioma')
  src/screens/weight-log/index.test.tsx
    describe('#169 R8: chip de delta por entrada')
      it.each(...)('fila %s con su tono, icono y texto', ...)   (4 filas: w-up, w-down, w-flat, w-none)
    describe('#169 R6: resumen del peso en la card de la gráfica')
      it.each(...)('en %s pinta el peso actual y el delta del día civil', ...)   (2 filas: Pacific/Pago_Pago, Pacific/Kiritimati)
      it('pinta el resumen dentro de la card y antes de la gráfica')
      it('no pinta el resumen sin entradas')
    describe('#169 R7: tono del delta del mes')
      it.each(...)('rama %s: texto, clase e icono', ...)   (3 filas: > 0, < 0, = 0)
    describe('#169 R10: toast y háptico tras un alta correcta')
      it('muestra el toast y el háptico solo tras resolver el alta')
      it('llama al háptico una sola vez en la rama ok del fuente')
    describe('#169 R11: ni toast ni háptico fuera de la rama ok')
      it.each(...)('rama %s: ni toast ni háptico', ...)   (8 filas, la tabla de R11)
    describe('#169 R12: el toast se va solo')
      it('se ve a los 2400 ms y se va a los 2650 ms')
      it('otra alta reinicia la cuenta y vibra otra vez')
    describe('#169 R13: movimiento del toast')
      it('el fuente declara el fundido sin ReduceMotion.Never')
      it('el toast lleva FadeIn y FadeOut')

== BASE ==

Primero, literal:
  cd /home/claude/sites/Pet-Tracker-wt-169/mobile-pet-tracker && pwd
  -> /home/claude/sites/Pet-Tracker-wt-169/mobile-pet-tracker
Todo lo de esta seccion, las anclas A, B y X y COMMITS va desde ahi. Las
anclas H y P y el final del CIERRE van desde la raiz
(`cd /home/claude/sites/Pet-Tracker-wt-169 && pwd`).

Error de invocacion: si un comando falla ANTES de que arranquen jest, tsc
o eslint (`No such file or directory`, `command not found`, un
`ERR_PNPM_*` o un `pwd` que no es el esperado) y no has tocado ningun
fichero, NO es una parada: haz el `cd` literal de arriba, repite el
comando y anotalo en el impl. Cualquier otro fallo si es una parada.

origin/main = d2b8b0ae al escribir este handoff, y la branch ya lo
incluye: lo esperado es exit=0. Al arrancar:
`git fetch origin` y `git merge-base --is-ancestor origin/main HEAD; echo "exit=$?"`.
Anota el exit en el impl. Si da 1 (otra feature mergeo antes), NO pares:
trabajas sobre H0 igual y el merge de main en la branch lo hace el leader.
Nunca rebasees ni mergees.

- `test -d node_modules && echo presente` -> presente. Si no sale,
  `bun install --frozen-lockfile`; si el sandbox te lo deniega, PARA.
- `test ! -e .expo/types/router.d.ts; echo "exit=$?"` -> exit=0. Va en
  cada cadena de commit; si un dia da 1, PARA y pide al humano que lo
  borre. Nunca `rm -f` (tu sandbox lo deniega).
- `pgrep -af '[i]nit\.sh'` sin pipe: si sale algo, otra sesion usa la
  maquina; espera a que salga vacio antes de cualquier jest entero (el
  ALL de la base y el del Cierre).

Base medida por el leader el 2026-10-12 en este worktree con el arbol de
H0, con el comando BASE (un solo jest, FORCE_COLOR=0, sin pipe): exit=0,
`Test Suites: 9 passed, 9 total` y `Tests:       326 passed, 326 total`.
Reparto por fichero:
  src/__tests__/ui-language.test.ts                      30
  src/__tests__/legibility-classnames.test.ts            27
  src/components/__tests__/weight-chart.test.tsx          4
  src/__tests__/design-drift.test.ts                     65
  src/__tests__/consistency-classnames.test.ts           63
  src/providers/__tests__/language-provider.test.tsx     25
  src/theme/__tests__/motion.test.ts                     12
  src/screens/health/index.test.tsx                      67
  src/screens/weight-log/index.test.tsx                  33
Tu medida manda: repite el comando BASE y anota sus dos lineas en el
impl. Si el total no es 326 o algo nace rojo, mide fichero a fichero,
anota y PARA.

Comando BASE:
  FORCE_COLOR=0 bunx jest --runTestsByPath src/__tests__/ui-language.test.ts src/__tests__/legibility-classnames.test.ts src/components/__tests__/weight-chart.test.tsx src/__tests__/design-drift.test.ts src/__tests__/consistency-classnames.test.ts src/providers/__tests__/language-provider.test.tsx src/theme/__tests__/motion.test.ts src/screens/health/index.test.tsx src/screens/weight-log/index.test.tsx > /tmp/169-base.txt 2>&1; echo "exit=$?"

Comando ALL (la suite entera; con `pgrep -af '[i]nit\.sh'` vacio antes y
sin lanzar nada mas mientras corre):
  FORCE_COLOR=0 bunx jest > /tmp/169-all-base.txt 2>&1; echo "exit=$?"
  -> exit=0. Copia al impl sus lineas `Test Suites:` y `Tests:`. Si exit
     no es 0, anota los `●` y PARA.
  ALL base (leader, H0): exit=0, `Test Suites: 98 passed, 98 total` y
  `Tests:       2775 passed, 2775 total`. Cierre esperado: 99 suites y
  2823 tests (2775 + 37 en los ficheros de BASE + 11 del fichero nuevo).

Comando GUARDAS (los candados de carta; lo corre cada verde; siempre
65 + 27 = 92):
  FORCE_COLOR=0 bunx jest --runTestsByPath src/__tests__/design-drift.test.ts src/__tests__/legibility-classnames.test.ts
En las cadenas aparece como `<GUARDAS> > /tmp/169-xN-guardas.txt 2>&1`.

Comando GRAFICA (la grafica y las dos pantallas que la montan; lo corren
los verdes de T1-T3):
  FORCE_COLOR=0 bunx jest --runTestsByPath src/components/__tests__/weight-chart.test.tsx src/screens/health/index.test.tsx src/screens/weight-log/index.test.tsx
En las cadenas aparece como `<GRAFICA>`.

Comando PESO (la pantalla de Peso y los dos candados agregados que mueve;
lo corren los verdes de T7-T13):
  FORCE_COLOR=0 bunx jest --runTestsByPath src/screens/weight-log/index.test.tsx src/__tests__/ui-language.test.ts src/__tests__/consistency-classnames.test.ts
En las cadenas aparece como `<PESO>`.

== ANCLAS ==

Ejecutalas TODAS antes de tocar nada y copia la salida al impl. A, B y X
van desde mobile-pet-tracker/; H y P desde la RAIZ. Solo estos comandos
son anclas; los numeros de linea no lo son. Si alguna no da EXACTAMENTE lo
esperado, PARA y avisa (ante una diferencia manda el fichero, no el
handoff). Cuando `grep -c` cuenta 0 sale con codigo 1: lo que vale es la
cifra impresa. El leader las ha ejecutado todas en H0 sacandolas de este
mismo fichero.

A1. grep -cF '<Polyline' src/components/weight-chart.tsx   -> 1
A2. grep -cF "from 'react-native-reanimated'" src/components/weight-chart.tsx   -> 0
A3. grep -cF 'createAnimatedComponent' src/components/weight-chart.tsx   -> 0
A4. grep -cF 'useReducedMotion' src/components/weight-chart.tsx   -> 0
A5. grep -cF 'export const MOTION_FILL_TIMING' src/theme/motion.ts   -> 1
A6. grep -cF 'withTiming(pct, MOTION_FILL_TIMING)' src/screens/home/collar-battery-bar.tsx   -> 1
A7. grep -cF 'Haptics' src/screens/weight-log/index.tsx   -> 0
A8. grep -cF 'Haptics.notificationAsync(' 'src/app/(tabs)/food.tsx'   -> 1
A9. grep -cF "case 'ok':" src/screens/weight-log/index.tsx   -> 1
A10. grep -cF 'testID="weight-chart-card"' src/screens/weight-log/index.tsx   -> 1
A11. grep -cF 'style={TABULAR_NUMS}' src/screens/weight-log/index.tsx   -> 2
A12. grep -cF 'style={CONTINUOUS_CORNER}' src/screens/weight-log/index.tsx   -> 1
A13. grep -cF 'function fmtVariation' src/screens/weight-log/index.tsx   -> 1
A14. grep -cF 'civilTodayIso(profileTimeZone)' src/screens/weight-log/index.tsx   -> 1
A15. grep -cF 'testID={`weight-row-${entry.id}`}' src/screens/weight-log/index.tsx   -> 1
A16. grep -cF '.orderBy(desc(weights.measuredAt), desc(weights.id))' ../backend-pet-tracker/src/modules/health/infrastructure/repositories/weight.drizzle.repository.ts   -> 2
A17. grep -cF "measuredAt: '2026-08-21'" src/screens/weight-log/index.test.tsx   -> 1
A18. grep -cF 'WeightChart: jest.fn(actual.WeightChart),' src/screens/health/index.test.tsx   -> 1
B1. grep -cF -e '- 1, // #159 R2' src/providers/__tests__/language-provider.test.tsx   -> 1
B2. grep -cF "{ file: 'src/screens/weight-log/index.tsx', key:" src/__tests__/ui-copy-table.ts   -> 17
B3. grep -cF 'expect(R5_HEALTH).toHaveLength(32 + 1 + 1 - 2 + 3 + 2);' src/__tests__/ui-language.test.ts   -> 1
B4. grep -cF "[join('screens', 'weight-log', 'index.tsx'), 2]," src/__tests__/consistency-classnames.test.ts   -> 1
B5. grep -cF '14 + 4 + 1 + 1 + 1 + 1 + 1 + 2 + 1 + 1, // #146 R18, #105 R11, #116 R5, #115 R6' src/__tests__/consistency-classnames.test.ts   -> 1
B6. grep -cF "[join('screens', 'weight-log', 'index.tsx'), 1]," src/__tests__/consistency-classnames.test.ts   -> 1
B7. grep -cF "'MOTION_BLINK_TIMING'," src/theme/__tests__/motion.test.ts   -> 1
B8. grep -cF 'rounded-xl bg-accent' src/screens/weight-log/index.tsx   -> 1
B9. grep -cF '<Button' src/screens/weight-log/index.tsx   -> 3
B10. grep -cF '<Pressable' src/screens/weight-log/index.tsx   -> 0
B11. grep -cF 'border-b-4' src/screens/weight-log/index.tsx   -> 1
X1. grep -c '^### §2\.' ../specs/mobile-ui-language/design.md   -> 23
X2. grep -cF '${tileClassName}' src/screens/weight-log/index.tsx   -> 1
X3. grep -cF 'size-8 shrink-0 items-center justify-center rounded-xl ${tileClassName}' src/__tests__/consistency-classnames.test.ts   -> 1
X4. grep -cF 'size={15}' src/screens/weight-log/index.tsx   -> 3
X5. grep -cF 'jest.mock(' src/screens/weight-log/index.test.tsx   -> 5
X6. grep -cF "jest.mock('react-native-svg'" src/components/__tests__/weight-chart.test.tsx   -> 1
X7. grep -cF "describe('R8: la gráfica degrada con <2 puntos'" src/components/__tests__/weight-chart.test.tsx   -> 1
X8. grep -cF 'KeyboardAvoidingView' src/screens/weight-log/index.tsx   -> 3
X9. grep -cF "describe('R9: alta de peso con degradación por kind'" src/screens/weight-log/index.test.tsx   -> 1
X10. grep -cF 'weights.refetch();' src/screens/weight-log/index.tsx   -> 1
X11. grep -cF 'function makeProfile(' src/screens/weight-log/index.test.tsx   -> 1
X12. grep -cF 'function makeWeight(' src/screens/weight-log/index.test.tsx src/components/__tests__/weight-chart.test.tsx   -> las dos con :1
X13. grep -cF -e 'export const MOTION_FILL_TIMING' -e 'export const MOTION_TRANSITION_MS' -e 'export const MOTION_FEEDBACK_MS' src/theme/motion.ts   -> 3
X14. grep -cF 'export function civilTodayIso' src/utils/civil-today-iso.ts   -> 1
X15. test ! -e src/utils/monthly-weight-delta.ts && test ! -e src/utils/monthly-weight-delta.test.ts; echo "exit=$?"   -> exit=0
X16. grep -cF "describe('#65 R12: el catálogo tiene los dos idiomas y t resuelve claves y parámetros'" src/providers/__tests__/language-provider.test.tsx   -> 1
X17. grep -cF "it('mantiene la base más las claves de #68 y los mismos marcadores en ambos idiomas'" src/providers/__tests__/language-provider.test.tsx   -> 1
X18. grep -cF 'const escapeRegExp = (value: string) =>' src/providers/__tests__/language-provider.test.tsx   -> 1
X19. grep -cF "it('resuelve las 32 ocurrencias normativas'" src/__tests__/ui-language.test.ts   -> 1
X20. grep -cF "it('resuelve cada ocurrencia de la tabla contra la clave exacta'" src/__tests__/ui-language.test.ts   -> 1
X21. grep -cF "describe('#62 R15: todo contador usa cifras tabulares'" src/__tests__/consistency-classnames.test.ts   -> 1
X22. grep -cF "it.each(counters)('%s aplica TABULAR_NUMS a sus %i valores'" src/__tests__/consistency-classnames.test.ts   -> 1
X23. grep -cF "from '../../theme/use-theme-colors'" src/screens/weight-log/index.tsx   -> 1
H1. grep -cF -- '- [x] Aprobado por humano (fecha: 2026-10-11)' specs/mobile-weight-draw-and-toasts/requirements.md   -> 1
H2. grep -cF -- '- [ ] Smoke de R14 superado por humano (fecha: ____, dispositivo: ____)' specs/mobile-weight-draw-and-toasts/requirements.md   -> 1
H3. grep -cF '"status": "in_progress"' feature_list.json   -> 1
H4. grep -rlF '#169' mobile-pet-tracker/src | wc -l   -> 0

Valores al cerrar (copialos al impl): A1 -> 0; A2 -> 1; A3 -> 2; A4 no
se fija (anota el valor); A5 y A6 sin cambios; A7 -> 2; A8-A10 sin
cambios; A11 -> 4; A12 y A13 sin cambios; A14 no se fija; A15-A18 sin
cambios. B1 -> 0; B2 -> 19; B3 -> 0; B4 -> 0; B5 -> 0; B6-B11 sin
cambios. X1 -> 24; X2 y X3 sin cambios; X4, X5 y X8 no se fijan; X6, X7 y
X9-X14 sin cambios; X15 -> exit=1 (los dos ficheros existen); X16-X23 sin
cambios. H1-H3 sin cambios; H4 no se fija. Y en positivo al cerrar, desde
la raiz:
  P1. grep -cF '<AnimatedPolyline' mobile-pet-tracker/src/components/weight-chart.tsx   -> 1
  P2. grep -cF 'testID="weight-chart-points"' mobile-pet-tracker/src/components/weight-chart.tsx   -> 1
  P3. grep -cF 'withTiming(1, MOTION_FILL_TIMING)' mobile-pet-tracker/src/components/weight-chart.tsx   -> 1
  P4. grep -cF 'Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)' mobile-pet-tracker/src/screens/weight-log/index.tsx   -> 1
  P5. grep -cF 'const WEIGHT_TOAST_MS = 2500;' mobile-pet-tracker/src/screens/weight-log/index.tsx   -> 1
  P6. grep -cF 'entering={FadeIn.duration(MOTION_TRANSITION_MS)}' mobile-pet-tracker/src/screens/weight-log/index.tsx   -> 1
  P7. grep -cF 'exiting={FadeOut.duration(MOTION_FEEDBACK_MS)}' mobile-pet-tracker/src/screens/weight-log/index.tsx   -> 1
  P8. grep -cF 'ReduceMotion.Never' mobile-pet-tracker/src/screens/weight-log/index.tsx mobile-pet-tracker/src/components/weight-chart.tsx   -> las dos con :0
  P9. grep -cF 'testID="weight-toast"' mobile-pet-tracker/src/screens/weight-log/index.tsx   -> 1
  P10. grep -cF 'export function monthlyWeightDelta' mobile-pet-tracker/src/utils/monthly-weight-delta.ts   -> 1
  P11. grep -cF 'weight-row-${entry.id}-tone' mobile-pet-tracker/src/screens/weight-log/index.tsx   -> 1
  P12. grep -cF 'weight-row-${entry.id}-delta' mobile-pet-tracker/src/screens/weight-log/index.tsx   -> 1
  P13. grep -cF "'weightLog.weightLogged'" mobile-pet-tracker/src/i18n/catalog.ts   -> 2
  P14. grep -cF "'weightLog.monthDelta'" mobile-pet-tracker/src/i18n/catalog.ts   -> 2
  P15. grep -cF -e '        - 1 // #159 R2' mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx   -> 1
  P16. grep -cF -e '        + 2, // #169 R9' mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx   -> 1
  P17. grep -cF 'expect(R5_HEALTH).toHaveLength(32 + 1 + 1 - 2 + 3 + 2 + 1 + 1); // +1 #90 R5, +1 #95 R4, -2 #95 R5, +3 #115 R1, +2 #155 R4, +1 #169 R6, +1 #169 R10' mobile-pet-tracker/src/__tests__/ui-language.test.ts   -> 1
  P18. grep -cF "[join('screens', 'weight-log', 'index.tsx'), 2 + 2], // #169 R6" mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts   -> 1
  P19. grep -cF '14 + 4 + 1 + 1 + 1 + 1 + 1 + 2 + 1 + 1 + 2, // #146 R18, #105 R11, #116 R5, #115 R6, #169 R6' mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts   -> 1
  P20. grep -cF '### §2.24 — Añadidos por #169 — Peso' specs/mobile-ui-language/design.md   -> 1
  P21. grep -cF "{ file: 'src/screens/weight-log/index.tsx', key: 'weightLog.monthDelta' }," mobile-pet-tracker/src/__tests__/ui-copy-table.ts   -> 1
  P22. grep -cF "{ file: 'src/screens/weight-log/index.tsx', key: 'weightLog.weightLogged' }," mobile-pet-tracker/src/__tests__/ui-copy-table.ts   -> 1

== COMMITS ==

Todo desde mobile-pet-tracker/ (el `cd` literal de BASE). Cada commit va
ENCADENADO con && a su verificacion: si cualquier eslabon falla, el
commit no se hace. Nunca commitees fuera de estas cadenas ni con un exit
distinto de 0 en la cadena (en #115 se commiteo un verde con el
registrador en exit=1). Si una cadena no llega al commit, PARA y reporta
en el impl el eslabon que fallo y la salida.

Mide SIN pipe (`cmd | tail` devuelve el exit de tail). FORCE_COLOR=0 deja
la linea de resumen de jest en texto plano. Formato:
`Tests:       3 failed, 5 passed, 8 total` y en verde
`Tests:       108 passed, 108 total`. Cada medida lleva su
`echo "exit=$?"`; anota el exit en el impl.

Rojos: cada uno dice su clase.
- «por asercion»: falla un `expect` (Expected/Received). La cadena exige
  que no salga `Unable to find`.
- «por consulta»: `getByTestId` lanza
  `Unable to find an element with testID: <id>`, y SOLO con los testIDs
  que la cadena permite.
- Nunca TypeError, ReferenceError, SyntaxError ni
  `Test suite failed to run`; `Cannot find module` solo en c8.
La cadena comprueba la cuenta y la clase; tu ademas abres el log y
copias al impl cada it rojo con su matcher y su Expected/Received (o el
mensaje de consulta). Si un Received ocupa mas de 20 lineas, copia el
matcher, el Expected y las 20 primeras lineas del Received, y nada mas.

Typecheck y lint van en TODAS las cadenas salvo c8, rojas incluidas, y
dan exit 0.

Cada cadena termina igual, tras su `git add`: la lista exacta de lo
stageado y que no quede nada sin stagear en mobile-pet-tracker/, docs/
ni specs/ (el impl vive en progress/ sin trackear hasta el Cierre; no lo
stagees antes):
  git diff --quiet -- . ../docs ../specs && test -z "$(git ls-files --others --exclude-standard -- . ../docs ../specs)"
En las cadenas aparece como `<LIMPIO>`. NUNCA `git status --short` tras
un `git add`: falla siempre (lo stageado sale).

Sondas: sobre el HEAD del commit que las nombra, UNA A UNA. Plantas la
mutacion, mides SOLO el fichero de test que dice la sonda (salida a
/tmp/169-sN.txt), copias al impl la linea `Tests:` y los `●`, y reviertes:
  git checkout HEAD -- <fichero de la sonda>
  git diff --cached --quiet && git diff --quiet; echo "limpio=$?"   -> limpio=0
Nunca `git checkout <commit> -- <fichero>` (deja el cambio en el
indice). Si una sonda no da EXACTAMENTE su linea `Tests:` y sus `●`,
PARA. `●` son SOLO los encabezados de it rojo: Jest tambien imprime
bloques `  ● Console` que no cuentan nunca, ni en sondas ni en rojos; se
copian al impl sin filtrar. Ninguna sonda se commitea. Todas caen por
ASERCION.

Mapa (c = commit; T = tarea de tasks.md):
  c1  T1 rojo  R1     c10 T6 rojo  R9     c19 T10 rojo  R10
  c2  T1 verde R1     c11 T6 verde R9     c20 T10 verde R10
  c3  T2 rojo  R2     c12 T7 rojo  R8     c21 T11 tests R11 (+ S11)
  c4  T2 verde R2     c13 T7 verde R8     c22 T12 rojo  R12
  c5  T3 rojo  R3     c14 T8 rojo  R6     c23 T12 verde R12
  c6  T3 verde R3     c15 T8 verde R6     c24 T13 rojo  R13
  c7  T4 tests R4     c16 T9 rojo  R7     c25 T13 verde R13
      (+ S4a, S4b)    c17 T9 verde R7     c26 trazabilidad
  c8  T5 rojo  R5     c18 T9 refactor R7  c27 lista cerrada
  c9  T5 verde R5
Sondas: S1 tras c2, S4a y S4b tras c7, S6 tras c15, S11 tras c21.

-- T1 R1: la linea se dibuja --

c1, T1 rojo (tasks.md T1 (1): el doble de Reanimated, `Polygon` en el
doble de svg y el describe de R1 con sus 4 it; el del area nace verde):
  FORCE_COLOR=0 bunx jest --runTestsByPath src/components/__tests__/weight-chart.test.tsx > /tmp/169-r1.txt 2>&1; echo "exit=$?"
    -> exit=1 y `Tests:       3 failed, 5 passed, 8 total`, los tres por asercion
  grep -qE '^Tests: +3 failed, 5 passed, 8 total$' /tmp/169-r1.txt \
    && test "$(grep -E '^  ● ' /tmp/169-r1.txt | grep -cvxF '  ● Console')" = 3 \
    && test "$(grep -E '^  ● ' /tmp/169-r1.txt | grep -cF '#169 R1: la línea se dibuja al montarse')" = 3 \
    && ! grep -qE 'Test suite failed to run|TypeError|ReferenceError|SyntaxError|Cannot find module' /tmp/169-r1.txt \
    && ! grep -qF 'Unable to find' /tmp/169-r1.txt \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bunx expo lint --no-cache \
    && git add src/components/__tests__/weight-chart.test.tsx \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/components/__tests__/weight-chart.test.tsx' \
    && <LIMPIO> \
    && git commit -m 'test(mobile): la línea de la gráfica de peso se dibuja (#169 R1)'

c2, T1 verde (tasks.md T1 (2): D1, D2 y D4 sin reduce motion todavia):
  <GRAFICA> > /tmp/169-g1.txt 2>&1; echo "exit=$?"
    -> exit=0 y `Tests:       108 passed, 108 total`
  <GUARDAS> > /tmp/169-g1-guardas.txt 2>&1; echo "exit=$?"
  grep -qE '^Tests: +108 passed, 108 total$' /tmp/169-g1.txt \
    && grep -qE '^Tests: +92 passed, 92 total$' /tmp/169-g1-guardas.txt \
    && test "$(grep -cF '<Polyline' src/components/weight-chart.tsx)" = 0 \
    && test "$(grep -cF '<AnimatedPolyline' src/components/weight-chart.tsx)" = 1 \
    && test "$(grep -cF 'createAnimatedComponent' src/components/weight-chart.tsx)" = 1 \
    && test "$(grep -cF 'withTiming(1, MOTION_FILL_TIMING)' src/components/weight-chart.tsx)" = 1 \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bunx expo lint --no-cache \
    && git add src/components/weight-chart.tsx \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/components/weight-chart.tsx' \
    && <LIMPIO> \
    && git commit -m 'feat(mobile): dibujo de la línea de peso con strokeDashoffset (#169 R1)'
  Despues, la sonda S1, sobre src/components/weight-chart.tsx, midiendo
  solo src/components/__tests__/weight-chart.test.tsx:
    S1  el `Polygon` del area pasa a un
        `const AnimatedPolygon = Animated.createAnimatedComponent(Polygon);`
        renderizado con el mismo `animatedProps` de la linea
        -> `Tests:       1 failed, 7 passed, 8 total` (solo `deja el área quieta`)

-- T2 R2: los puntos --

c3, T2 rojo (tasks.md T2 (1): `G` y `Circle` en el doble de svg y el
describe de R2 con sus 3 it; cada uno empieza con
`screen.getByTestId('weight-chart-points')` fuera de cualquier waitFor):
  FORCE_COLOR=0 bunx jest --runTestsByPath src/components/__tests__/weight-chart.test.tsx > /tmp/169-r2.txt 2>&1; echo "exit=$?"
    -> exit=1 y `Tests:       3 failed, 8 passed, 11 total`, los tres por consulta
  grep -qE '^Tests: +3 failed, 8 passed, 11 total$' /tmp/169-r2.txt \
    && test "$(grep -E '^  ● ' /tmp/169-r2.txt | grep -cvxF '  ● Console')" = 3 \
    && test "$(grep -E '^  ● ' /tmp/169-r2.txt | grep -cF '#169 R2: los puntos aparecen con el mismo progreso')" = 3 \
    && ! grep -qE 'Test suite failed to run|TypeError|ReferenceError|SyntaxError|Cannot find module' /tmp/169-r2.txt \
    && grep -qF 'Unable to find an element with testID: weight-chart-points' /tmp/169-r2.txt \
    && ! (grep -F 'Unable to find an element with testID:' /tmp/169-r2.txt | grep -vqE 'testID: weight-chart-points$') \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bunx expo lint --no-cache \
    && git add src/components/__tests__/weight-chart.test.tsx \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/components/__tests__/weight-chart.test.tsx' \
    && <LIMPIO> \
    && git commit -m 'test(mobile): los puntos de peso aparecen con el trazo (#169 R2)'

c4, T2 verde (tasks.md T2 (2): `AnimatedG` con testID
`weight-chart-points` y `opacity` animada, D1):
  <GRAFICA> > /tmp/169-g2.txt 2>&1; echo "exit=$?"
    -> exit=0 y `Tests:       111 passed, 111 total`
  <GUARDAS> > /tmp/169-g2-guardas.txt 2>&1; echo "exit=$?"
  grep -qE '^Tests: +111 passed, 111 total$' /tmp/169-g2.txt \
    && grep -qE '^Tests: +92 passed, 92 total$' /tmp/169-g2-guardas.txt \
    && test "$(grep -cF 'createAnimatedComponent' src/components/weight-chart.tsx)" = 2 \
    && test "$(grep -cF 'testID="weight-chart-points"' src/components/weight-chart.tsx)" = 1 \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bunx expo lint --no-cache \
    && git add src/components/weight-chart.tsx \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/components/weight-chart.tsx' \
    && <LIMPIO> \
    && git commit -m 'feat(mobile): puntos de peso con opacidad animada (#169 R2)'

-- T3 R3: reduce motion --

c5, T3 rojo (tasks.md T3 (1): el describe de R3, 1 it):
  FORCE_COLOR=0 bunx jest --runTestsByPath src/components/__tests__/weight-chart.test.tsx > /tmp/169-r3.txt 2>&1; echo "exit=$?"
    -> exit=1 y `Tests:       1 failed, 11 passed, 12 total`, por asercion
  grep -qE '^Tests: +1 failed, 11 passed, 12 total$' /tmp/169-r3.txt \
    && test "$(grep -E '^  ● ' /tmp/169-r3.txt | grep -cvxF '  ● Console')" = 1 \
    && test "$(grep -E '^  ● ' /tmp/169-r3.txt | grep -cF '#169 R3: bajo reduce motion la gráfica sale completa')" = 1 \
    && ! grep -qE 'Test suite failed to run|TypeError|ReferenceError|SyntaxError|Cannot find module' /tmp/169-r3.txt \
    && ! grep -qF 'Unable to find' /tmp/169-r3.txt \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bunx expo lint --no-cache \
    && git add src/components/__tests__/weight-chart.test.tsx \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/components/__tests__/weight-chart.test.tsx' \
    && <LIMPIO> \
    && git commit -m 'test(mobile): la gráfica de peso respeta reduce motion (#169 R3)'

c6, T3 verde (tasks.md T3 (2): D4):
  <GRAFICA> > /tmp/169-g3.txt 2>&1; echo "exit=$?"
    -> exit=0 y `Tests:       112 passed, 112 total`
  <GUARDAS> > /tmp/169-g3-guardas.txt 2>&1; echo "exit=$?"
  grep -qE '^Tests: +112 passed, 112 total$' /tmp/169-g3.txt \
    && grep -qE '^Tests: +92 passed, 92 total$' /tmp/169-g3-guardas.txt \
    && grep -qF 'useReducedMotion' src/components/weight-chart.tsx \
    && test "$(grep -cF 'ReduceMotion.Never' src/components/weight-chart.tsx)" = 0 \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bunx expo lint --no-cache \
    && git add src/components/weight-chart.tsx \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/components/weight-chart.tsx' \
    && <LIMPIO> \
    && git commit -m 'feat(mobile): reduce motion en el dibujo de la gráfica (#169 R3)'

-- T4 R4: cuando se vuelve a dibujar (nace verde) --

c7, T4 tests (tasks.md T4 (1): el describe de R4, 3 it, todos verdes):
  FORCE_COLOR=0 bunx jest --runTestsByPath src/components/__tests__/weight-chart.test.tsx > /tmp/169-r4.txt 2>&1; echo "exit=$?"
    -> exit=0 y `Tests:       15 passed, 15 total`
  grep -qE '^Tests: +15 passed, 15 total$' /tmp/169-r4.txt \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bunx expo lint --no-cache \
    && git add src/components/__tests__/weight-chart.test.tsx \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/components/__tests__/weight-chart.test.tsx' \
    && <LIMPIO> \
    && git commit -m 'test(mobile): la gráfica de peso no repite el dibujo al cambiar datos (#169 R4)'
  Despues, las dos sondas de tasks.md T4, sobre
  src/components/weight-chart.tsx, midiendo solo
  src/components/__tests__/weight-chart.test.tsx:
    S4a  anade `L` a las dependencias del efecto
         -> `Tests:       1 failed, 14 passed, 15 total` (solo
            `R4a: con la gráfica montada, otros datos no repiten el dibujo`,
            `Expected: 1`, `Received: 2`)
    S4b  la variante GUARDADA de tasks.md T4 (1), sus cuatro pasos juntos
         -> `Tests:       2 failed, 13 passed, 15 total` (`R4b: pasar de una
            entrada a tres dibuja una vez` con `Expected: 1`, `Received: 0`,
            y `R4c: volver a menos de dos entradas y otra vez a tres dibuja
            de nuevo` con `Expected: 2`, `Received: 1`)
  No hay commit verde de R4.

-- T5 R5: monthlyWeightDelta --

c8, T5 rojo (tasks.md T5 (1): el fichero nuevo
src/utils/monthly-weight-delta.test.ts con el it.each de 11 filas; es la
unica cadena sin typecheck ni lint encadenados, porque los dos fallan a
proposito por el modulo que aun no existe):
  FORCE_COLOR=0 bunx jest --runTestsByPath src/utils/monthly-weight-delta.test.ts > /tmp/169-r5.txt 2>&1; echo "exit=$?"
    -> exit=1, `Test Suites: 1 failed, 1 total` y `Tests:       0 total`
  bun run typecheck > /tmp/169-r5-tsc.txt 2>&1; echo "exit=$?"
    -> exit distinto de 0, un solo `error TS2307` (el modulo)
  bunx expo lint --no-cache > /tmp/169-r5-lint.txt 2>&1; echo "exit=$?"
    -> exit distinto de 0, `✖ 1 problem (1 error, 0 warnings)` (import/no-unresolved)
  grep -qE '^Test Suites: +1 failed, 1 total$' /tmp/169-r5.txt \
    && grep -qE '^Tests: +0 total$' /tmp/169-r5.txt \
    && grep -qF "Cannot find module './monthly-weight-delta'" /tmp/169-r5.txt \
    && test "$(grep -c 'error TS' /tmp/169-r5-tsc.txt)" = 1 \
    && grep -qF 'error TS2307' /tmp/169-r5-tsc.txt \
    && grep -qF '✖ 1 problem (1 error, 0 warnings)' /tmp/169-r5-lint.txt \
    && grep -qF 'Unable to resolve path to module' /tmp/169-r5-lint.txt \
    && test ! -e .expo/types/router.d.ts \
    && git add src/utils/monthly-weight-delta.test.ts \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/utils/monthly-weight-delta.test.ts' \
    && <LIMPIO> \
    && git commit -m 'test(mobile): delta mensual de peso en cliente (#169 R5)'

c9, T5 verde (tasks.md T5 (2): src/utils/monthly-weight-delta.ts segun
R5, pasos 1 a 6):
  FORCE_COLOR=0 bunx jest --runTestsByPath src/utils/monthly-weight-delta.test.ts > /tmp/169-g5.txt 2>&1; echo "exit=$?"
    -> exit=0 y `Tests:       11 passed, 11 total`
  <GUARDAS> > /tmp/169-g5-guardas.txt 2>&1; echo "exit=$?"
  grep -qE '^Tests: +11 passed, 11 total$' /tmp/169-g5.txt \
    && grep -qE '^Tests: +92 passed, 92 total$' /tmp/169-g5-guardas.txt \
    && test "$(grep -cF 'export function monthlyWeightDelta' src/utils/monthly-weight-delta.ts)" = 1 \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bunx expo lint --no-cache \
    && git add src/utils/monthly-weight-delta.ts \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/utils/monthly-weight-delta.ts' \
    && <LIMPIO> \
    && git commit -m 'feat(mobile): monthlyWeightDelta (#169 R5)'

-- T6 R9: dos claves de catalogo --

c10, T6 rojo (tasks.md T6 (1)). El recuento, literal: la linea
`        - 1, // #159 R2` (B1) pasa a `        - 1 // #159 R2` y justo
debajo va la linea nueva `        + 2, // #169 R9` (8 espacios en las dos).
El describe de R9, 1 it, al final del fichero, reutilizando
`escapeRegExp` (X18):
  FORCE_COLOR=0 bunx jest --runTestsByPath src/providers/__tests__/language-provider.test.tsx > /tmp/169-r9.txt 2>&1; echo "exit=$?"
    -> exit=1 y `Tests:       2 failed, 24 passed, 26 total`, los dos por asercion
  grep -qE '^Tests: +2 failed, 24 passed, 26 total$' /tmp/169-r9.txt \
    && test "$(grep -E '^  ● ' /tmp/169-r9.txt | grep -cvxF '  ● Console')" = 2 \
    && test "$(grep -E '^  ● ' /tmp/169-r9.txt | grep -cF 'mantiene la base más las claves de #68 y los mismos marcadores en ambos idiomas')" = 1 \
    && test "$(grep -E '^  ● ' /tmp/169-r9.txt | grep -cF '#169 R9: claves de peso nuevas')" = 1 \
    && ! grep -qE 'Test suite failed to run|TypeError|ReferenceError|SyntaxError|Cannot find module' /tmp/169-r9.txt \
    && ! grep -qF 'Unable to find' /tmp/169-r9.txt \
    && test "$(grep -cF -e '- 1, // #159 R2' src/providers/__tests__/language-provider.test.tsx)" = 0 \
    && test "$(grep -cF -e '        - 1 // #159 R2' src/providers/__tests__/language-provider.test.tsx)" = 1 \
    && test "$(grep -cF -e '        + 2, // #169 R9' src/providers/__tests__/language-provider.test.tsx)" = 1 \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bunx expo lint --no-cache \
    && git add src/providers/__tests__/language-provider.test.tsx \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx' \
    && <LIMPIO> \
    && git commit -m 'test(mobile): claves de catálogo del resumen y el toast de peso (#169 R9)'

c11, T6 verde (tasks.md T6 (2)). En src/i18n/catalog.ts, las dos claves
en `en` y en `es`, justo detras de las demas `weightLog.*` de cada bloque,
con los literales exactos de la Tabla de literales de requirements.md (el
`en` de weightLogged lleva apostrofo: va entre comillas dobles, como el
resto de cadenas del catalogo con apostrofo). En
../specs/mobile-ui-language/design.md, justo antes de la linea
`## 3. La infraestructura`, este bloque literal seguido de una linea en
blanco:
    ### §2.24 — Añadidos por #169 — Peso

    | # | Clave | `en` | `es` | Origen |
    |---|---|---|---|---|
    | — | `weightLog.weightLogged` | `Logged. I've added it to the chart.` | `Anotado. Ya lo puse en la gráfica.` | ← añadida por #169 (R9) |
    | — | `weightLog.monthDelta` | `{{value}} this month` | `{{value}} este mes` | ← añadida por #169 (R9) |
(sin los 4 espacios de sangria de este handoff; la linea en blanco que
ya precede a `## 3.` queda detras del bloque):
  FORCE_COLOR=0 bunx jest --runTestsByPath src/providers/__tests__/language-provider.test.tsx src/__tests__/ui-language.test.ts > /tmp/169-g9.txt 2>&1; echo "exit=$?"
    -> exit=0 y `Tests:       56 passed, 56 total`
  <GUARDAS> > /tmp/169-g9-guardas.txt 2>&1; echo "exit=$?"
  grep -qE '^Tests: +56 passed, 56 total$' /tmp/169-g9.txt \
    && grep -qE '^Tests: +92 passed, 92 total$' /tmp/169-g9-guardas.txt \
    && test "$(grep -c '^### §2\.' ../specs/mobile-ui-language/design.md)" = 24 \
    && test "$(grep -cF '### §2.24 — Añadidos por #169 — Peso' ../specs/mobile-ui-language/design.md)" = 1 \
    && test "$(grep -cF "'weightLog.weightLogged'" src/i18n/catalog.ts)" = 2 \
    && test "$(grep -cF "'weightLog.monthDelta'" src/i18n/catalog.ts)" = 2 \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bunx expo lint --no-cache \
    && git add src/i18n/catalog.ts ../specs/mobile-ui-language/design.md \
    && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/i18n/catalog.ts specs/mobile-ui-language/design.md ' \
    && <LIMPIO> \
    && git commit -m 'feat(mobile): claves weightLog.weightLogged y monthDelta (#169 R9)'

-- T7 R8: candado del chip por entrada --

c12, T7 rojo (tasks.md T7 (1): los dobles de `reicon-react-native` y
`use-theme-colors`, detras de los `jest.mock` que ya hay, y el describe
de R8 con su it.each de 4 filas):
  FORCE_COLOR=0 bunx jest --runTestsByPath src/screens/weight-log/index.test.tsx > /tmp/169-r8.txt 2>&1; echo "exit=$?"
    -> exit=1 y `Tests:       4 failed, 33 passed, 37 total`, los cuatro por consulta
  grep -qE '^Tests: +4 failed, 33 passed, 37 total$' /tmp/169-r8.txt \
    && test "$(grep -E '^  ● ' /tmp/169-r8.txt | grep -cvxF '  ● Console')" = 4 \
    && test "$(grep -E '^  ● ' /tmp/169-r8.txt | grep -cF '#169 R8: chip de delta por entrada')" = 4 \
    && ! grep -qE 'Test suite failed to run|TypeError|ReferenceError|SyntaxError|Cannot find module' /tmp/169-r8.txt \
    && grep -qF 'Unable to find an element with testID: weight-row-w-up-tone' /tmp/169-r8.txt \
    && ! (grep -F 'Unable to find an element with testID:' /tmp/169-r8.txt | grep -vqE 'testID: weight-row-w-(up|down|flat|none)-tone$') \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bunx expo lint --no-cache \
    && git add src/screens/weight-log/index.test.tsx \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/screens/weight-log/index.test.tsx' \
    && <LIMPIO> \
    && git commit -m 'test(mobile): candado del chip de delta por entrada de peso (#169 R8)'

c13, T7 verde (tasks.md T7 (2): solo los dos testIDs en la fila):
  <PESO> > /tmp/169-g8.txt 2>&1; echo "exit=$?"
    -> exit=0 y `Tests:       130 passed, 130 total`
  <GUARDAS> > /tmp/169-g8-guardas.txt 2>&1; echo "exit=$?"
  grep -qE '^Tests: +130 passed, 130 total$' /tmp/169-g8.txt \
    && grep -qE '^Tests: +92 passed, 92 total$' /tmp/169-g8-guardas.txt \
    && test "$(grep -cF 'weight-row-${entry.id}-tone' src/screens/weight-log/index.tsx)" = 1 \
    && test "$(grep -cF 'weight-row-${entry.id}-delta' src/screens/weight-log/index.tsx)" = 1 \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bunx expo lint --no-cache \
    && git add src/screens/weight-log/index.tsx \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/screens/weight-log/index.tsx' \
    && <LIMPIO> \
    && git commit -m 'feat(mobile): testIDs del chip de delta por entrada (#169 R8)'

-- T8 R6: resumen en la card --

c14, T8 rojo (tasks.md T8 (1): el describe de R6, 4 it. En el mismo
commit, los tres candados agregados, con estas lineas EXACTAS:
- src/__tests__/ui-copy-table.ts: al final de `R5_HEALTH`, justo detras
  de la fila de `weightChart.notEnoughDataYet`, la fila
  `  { file: 'src/screens/weight-log/index.tsx', key: 'weightLog.monthDelta' },`
- src/__tests__/ui-language.test.ts: la linea de B3 pasa a
  `    expect(R5_HEALTH).toHaveLength(32 + 1 + 1 - 2 + 3 + 2 + 1); // +1 #90 R5, +1 #95 R4, -2 #95 R5, +3 #115 R1, +2 #155 R4, +1 #169 R6`
- src/__tests__/consistency-classnames.test.ts: la linea de B4 pasa a
  `    [join('screens', 'weight-log', 'index.tsx'), 2 + 2], // #169 R6`
  y la de B5 a
  `      14 + 4 + 1 + 1 + 1 + 1 + 1 + 2 + 1 + 1 + 2, // #146 R18, #105 R11, #116 R5, #115 R6, #169 R6`
Tres medidas, una por fichero de test:
  FORCE_COLOR=0 bunx jest --runTestsByPath src/screens/weight-log/index.test.tsx > /tmp/169-r6-wl.txt 2>&1; echo "exit=$?"
    -> exit=1 y `Tests:       3 failed, 38 passed, 41 total`, los tres por consulta
       (`no pinta el resumen sin entradas` nace verde)
  FORCE_COLOR=0 bunx jest --runTestsByPath src/__tests__/ui-language.test.ts > /tmp/169-r6-ul.txt 2>&1; echo "exit=$?"
    -> exit=1 y `Tests:       2 failed, 28 passed, 30 total`, por asercion
  FORCE_COLOR=0 bunx jest --runTestsByPath src/__tests__/consistency-classnames.test.ts > /tmp/169-r6-cc.txt 2>&1; echo "exit=$?"
    -> exit=1 y `Tests:       1 failed, 62 passed, 63 total`, por asercion
  grep -qE '^Tests: +3 failed, 38 passed, 41 total$' /tmp/169-r6-wl.txt \
    && test "$(grep -E '^  ● ' /tmp/169-r6-wl.txt | grep -cvxF '  ● Console')" = 3 \
    && test "$(grep -E '^  ● ' /tmp/169-r6-wl.txt | grep -cF '#169 R6: resumen del peso en la card de la gráfica')" = 3 \
    && ! grep -qE 'Test suite failed to run|TypeError|ReferenceError|SyntaxError|Cannot find module' /tmp/169-r6-wl.txt \
    && grep -qF 'Unable to find an element with testID: weight-summary' /tmp/169-r6-wl.txt \
    && ! (grep -F 'Unable to find an element with testID:' /tmp/169-r6-wl.txt | grep -vqE 'testID: weight-(current|summary)$') \
    && grep -qE '^Tests: +2 failed, 28 passed, 30 total$' /tmp/169-r6-ul.txt \
    && test "$(grep -E '^  ● ' /tmp/169-r6-ul.txt | grep -cvxF '  ● Console')" = 2 \
    && test "$(grep -E '^  ● ' /tmp/169-r6-ul.txt | grep -cF 'resuelve las 32 ocurrencias normativas')" = 1 \
    && test "$(grep -E '^  ● ' /tmp/169-r6-ul.txt | grep -cF 'resuelve cada ocurrencia de la tabla contra la clave exacta')" = 1 \
    && ! grep -qE 'Test suite failed to run|TypeError|ReferenceError|SyntaxError|Cannot find module' /tmp/169-r6-ul.txt \
    && ! grep -qF 'Unable to find' /tmp/169-r6-ul.txt \
    && grep -qE '^Tests: +1 failed, 62 passed, 63 total$' /tmp/169-r6-cc.txt \
    && test "$(grep -E '^  ● ' /tmp/169-r6-cc.txt | grep -cvxF '  ● Console')" = 1 \
    && test "$(grep -E '^  ● ' /tmp/169-r6-cc.txt | grep -cF 'screens/weight-log/index.tsx aplica TABULAR_NUMS a sus 4 valores')" = 1 \
    && ! grep -qE 'Test suite failed to run|TypeError|ReferenceError|SyntaxError|Cannot find module' /tmp/169-r6-cc.txt \
    && ! grep -qF 'Unable to find' /tmp/169-r6-cc.txt \
    && test "$(grep -cF "{ file: 'src/screens/weight-log/index.tsx', key:" src/__tests__/ui-copy-table.ts)" = 18 \
    && test "$(grep -cF "{ file: 'src/screens/weight-log/index.tsx', key: 'weightLog.monthDelta' }," src/__tests__/ui-copy-table.ts)" = 1 \
    && test "$(grep -cF 'expect(R5_HEALTH).toHaveLength(32 + 1 + 1 - 2 + 3 + 2);' src/__tests__/ui-language.test.ts)" = 0 \
    && test "$(grep -cF 'expect(R5_HEALTH).toHaveLength(32 + 1 + 1 - 2 + 3 + 2 + 1); // +1 #90 R5, +1 #95 R4, -2 #95 R5, +3 #115 R1, +2 #155 R4, +1 #169 R6' src/__tests__/ui-language.test.ts)" = 1 \
    && test "$(grep -cF "[join('screens', 'weight-log', 'index.tsx'), 2]," src/__tests__/consistency-classnames.test.ts)" = 0 \
    && test "$(grep -cF "[join('screens', 'weight-log', 'index.tsx'), 2 + 2], // #169 R6" src/__tests__/consistency-classnames.test.ts)" = 1 \
    && test "$(grep -cF '14 + 4 + 1 + 1 + 1 + 1 + 1 + 2 + 1 + 1, // #146 R18, #105 R11, #116 R5, #115 R6' src/__tests__/consistency-classnames.test.ts)" = 0 \
    && test "$(grep -cF '14 + 4 + 1 + 1 + 1 + 1 + 1 + 2 + 1 + 1 + 2, // #146 R18, #105 R11, #116 R5, #115 R6, #169 R6' src/__tests__/consistency-classnames.test.ts)" = 1 \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bunx expo lint --no-cache \
    && git add src/screens/weight-log/index.test.tsx src/__tests__/ui-copy-table.ts src/__tests__/ui-language.test.ts src/__tests__/consistency-classnames.test.ts \
    && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts mobile-pet-tracker/src/__tests__/ui-copy-table.ts mobile-pet-tracker/src/__tests__/ui-language.test.ts mobile-pet-tracker/src/screens/weight-log/index.test.tsx ' \
    && <LIMPIO> \
    && git commit -m 'test(mobile): resumen de peso actual y delta del mes (#169 R6)'

c15, T8 verde (tasks.md T8 (2): D5 y D6; la fila del delta lleva SOLO el
`Text` con `style={TABULAR_NUMS}`, sin className de tono y sin icono):
  <PESO> > /tmp/169-g6.txt 2>&1; echo "exit=$?"
    -> exit=0 y `Tests:       134 passed, 134 total`
  <GUARDAS> > /tmp/169-g6-guardas.txt 2>&1; echo "exit=$?"
  grep -qE '^Tests: +134 passed, 134 total$' /tmp/169-g6.txt \
    && grep -qE '^Tests: +92 passed, 92 total$' /tmp/169-g6-guardas.txt \
    && test "$(grep -cF 'style={TABULAR_NUMS}' src/screens/weight-log/index.tsx)" = 4 \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bunx expo lint --no-cache \
    && git add src/screens/weight-log/index.tsx \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/screens/weight-log/index.tsx' \
    && <LIMPIO> \
    && git commit -m 'feat(mobile): resumen de peso en la card de la gráfica (#169 R6)'
  Despues, la sonda S6, sobre src/screens/weight-log/index.tsx, midiendo
  solo src/screens/weight-log/index.test.tsx:
    S6  el resumen se pinta siempre, tambien sin entradas, con
        `entries[0]?.weightKg ?? 0`
        -> `Tests:       1 failed, 40 passed, 41 total` (solo
           `no pinta el resumen sin entradas`)

-- T9 R7: tono del delta del mes --

c16, T9 rojo (tasks.md T9 (1): el describe de R7 con su it.each de 3
filas; en cada fila, las aserciones en este orden: texto, className
exacto, icono, color, ausentes):
  FORCE_COLOR=0 bunx jest --runTestsByPath src/screens/weight-log/index.test.tsx > /tmp/169-r7.txt 2>&1; echo "exit=$?"
    -> exit=1 y `Tests:       3 failed, 41 passed, 44 total`, los tres por asercion
  grep -qE '^Tests: +3 failed, 41 passed, 44 total$' /tmp/169-r7.txt \
    && test "$(grep -E '^  ● ' /tmp/169-r7.txt | grep -cvxF '  ● Console')" = 3 \
    && test "$(grep -E '^  ● ' /tmp/169-r7.txt | grep -cF '#169 R7: tono del delta del mes')" = 3 \
    && ! grep -qE 'Test suite failed to run|TypeError|ReferenceError|SyntaxError|Cannot find module' /tmp/169-r7.txt \
    && ! grep -qF 'Unable to find' /tmp/169-r7.txt \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bunx expo lint --no-cache \
    && git add src/screens/weight-log/index.test.tsx \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/screens/weight-log/index.test.tsx' \
    && <LIMPIO> \
    && git commit -m 'test(mobile): tono del delta mensual de peso (#169 R7)'

c17, T9 verde (tasks.md T9 (2): clase e icono por rama):
  <PESO> > /tmp/169-g7.txt 2>&1; echo "exit=$?"
    -> exit=0 y `Tests:       137 passed, 137 total`
  <GUARDAS> > /tmp/169-g7-guardas.txt 2>&1; echo "exit=$?"
  grep -qE '^Tests: +137 passed, 137 total$' /tmp/169-g7.txt \
    && grep -qE '^Tests: +92 passed, 92 total$' /tmp/169-g7-guardas.txt \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bunx expo lint --no-cache \
    && git add src/screens/weight-log/index.tsx \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/screens/weight-log/index.tsx' \
    && <LIMPIO> \
    && git commit -m 'feat(mobile): color e icono del delta mensual (#169 R7)'

c18, T9 refactor (tasks.md T9 (3): D7, el ayudante de tono compartido
entre filas y resumen; ojo al Aviso de T9 (3)):
  <PESO> > /tmp/169-f7.txt 2>&1; echo "exit=$?"
    -> exit=0 y `Tests:       137 passed, 137 total`
  <GUARDAS> > /tmp/169-f7-guardas.txt 2>&1; echo "exit=$?"
  grep -qE '^Tests: +137 passed, 137 total$' /tmp/169-f7.txt \
    && grep -qE '^Tests: +92 passed, 92 total$' /tmp/169-f7-guardas.txt \
    && test "$(grep -cF '${tileClassName}' src/screens/weight-log/index.tsx)" = 1 \
    && test "$(grep -cF 'size-8 shrink-0 items-center justify-center rounded-xl ${tileClassName}' src/__tests__/consistency-classnames.test.ts)" = 1 \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bunx expo lint --no-cache \
    && git add src/screens/weight-log/index.tsx \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/screens/weight-log/index.tsx' \
    && <LIMPIO> \
    && git commit -m 'refactor(mobile): tono compartido entre filas y resumen de peso (#169 R7)'

-- T10 R10: toast y haptico --

c19, T10 rojo (tasks.md T10 (1) con la correccion de QUE HACES: el doble
de expo-haptics detras de los `jest.mock` que ya hay y el describe de R10,
2 it. En el mismo commit:
- src/__tests__/ui-copy-table.ts: justo detras de la fila de
  `weightLog.monthDelta` de c14, la fila
  `  { file: 'src/screens/weight-log/index.tsx', key: 'weightLog.weightLogged' },`
- src/__tests__/ui-language.test.ts: la linea de c14 pasa a
  `    expect(R5_HEALTH).toHaveLength(32 + 1 + 1 - 2 + 3 + 2 + 1 + 1); // +1 #90 R5, +1 #95 R4, -2 #95 R5, +3 #115 R1, +2 #155 R4, +1 #169 R6, +1 #169 R10`
Dos medidas:
  FORCE_COLOR=0 bunx jest --runTestsByPath src/screens/weight-log/index.test.tsx > /tmp/169-r10-wl.txt 2>&1; echo "exit=$?"
    -> exit=1 y `Tests:       2 failed, 44 passed, 46 total`, los dos por asercion
  FORCE_COLOR=0 bunx jest --runTestsByPath src/__tests__/ui-language.test.ts > /tmp/169-r10-ul.txt 2>&1; echo "exit=$?"
    -> exit=1 y `Tests:       2 failed, 28 passed, 30 total`, por asercion (los
       mismos dos it que en c14)
  grep -qE '^Tests: +2 failed, 44 passed, 46 total$' /tmp/169-r10-wl.txt \
    && test "$(grep -E '^  ● ' /tmp/169-r10-wl.txt | grep -cvxF '  ● Console')" = 2 \
    && test "$(grep -E '^  ● ' /tmp/169-r10-wl.txt | grep -cF '#169 R10: toast y háptico tras un alta correcta')" = 2 \
    && ! grep -qE 'Test suite failed to run|TypeError|ReferenceError|SyntaxError|Cannot find module' /tmp/169-r10-wl.txt \
    && ! grep -qF 'Unable to find' /tmp/169-r10-wl.txt \
    && grep -qE '^Tests: +2 failed, 28 passed, 30 total$' /tmp/169-r10-ul.txt \
    && test "$(grep -E '^  ● ' /tmp/169-r10-ul.txt | grep -cvxF '  ● Console')" = 2 \
    && test "$(grep -E '^  ● ' /tmp/169-r10-ul.txt | grep -cF 'resuelve las 32 ocurrencias normativas')" = 1 \
    && test "$(grep -E '^  ● ' /tmp/169-r10-ul.txt | grep -cF 'resuelve cada ocurrencia de la tabla contra la clave exacta')" = 1 \
    && ! grep -qE 'Test suite failed to run|TypeError|ReferenceError|SyntaxError|Cannot find module' /tmp/169-r10-ul.txt \
    && ! grep -qF 'Unable to find' /tmp/169-r10-ul.txt \
    && test "$(grep -cF "{ file: 'src/screens/weight-log/index.tsx', key:" src/__tests__/ui-copy-table.ts)" = 19 \
    && test "$(grep -cF "{ file: 'src/screens/weight-log/index.tsx', key: 'weightLog.weightLogged' }," src/__tests__/ui-copy-table.ts)" = 1 \
    && test "$(grep -cF 'expect(R5_HEALTH).toHaveLength(32 + 1 + 1 - 2 + 3 + 2 + 1); // +1 #90 R5, +1 #95 R4, -2 #95 R5, +3 #115 R1, +2 #155 R4, +1 #169 R6' src/__tests__/ui-language.test.ts)" = 0 \
    && test "$(grep -cF 'expect(R5_HEALTH).toHaveLength(32 + 1 + 1 - 2 + 3 + 2 + 1 + 1); // +1 #90 R5, +1 #95 R4, -2 #95 R5, +3 #115 R1, +2 #155 R4, +1 #169 R6, +1 #169 R10' src/__tests__/ui-language.test.ts)" = 1 \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bunx expo lint --no-cache \
    && git add src/screens/weight-log/index.test.tsx src/__tests__/ui-copy-table.ts src/__tests__/ui-language.test.ts \
    && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/__tests__/ui-copy-table.ts mobile-pet-tracker/src/__tests__/ui-language.test.ts mobile-pet-tracker/src/screens/weight-log/index.test.tsx ' \
    && <LIMPIO> \
    && git commit -m 'test(mobile): toast y háptico al registrar un peso (#169 R10)'

c20, T10 verde (tasks.md T10 (2): D8 y D9, con el toast como `View`; el
`Animated.View` llega en c25. En produccion, `import * as Haptics from
'expo-haptics';` como en src/app/(tabs)/food.tsx (A8), y la llamada en
UNA linea: `void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);`):
  <PESO> > /tmp/169-g10.txt 2>&1; echo "exit=$?"
    -> exit=0 y `Tests:       139 passed, 139 total`
  <GUARDAS> > /tmp/169-g10-guardas.txt 2>&1; echo "exit=$?"
  grep -qE '^Tests: +139 passed, 139 total$' /tmp/169-g10.txt \
    && grep -qE '^Tests: +92 passed, 92 total$' /tmp/169-g10-guardas.txt \
    && test "$(grep -cF 'Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)' src/screens/weight-log/index.tsx)" = 1 \
    && test "$(grep -cF 'Haptics' src/screens/weight-log/index.tsx)" = 2 \
    && test "$(grep -cF 'testID="weight-toast"' src/screens/weight-log/index.tsx)" = 1 \
    && test "$(grep -cF '<Button' src/screens/weight-log/index.tsx)" = 3 \
    && test "$(grep -cF '<Pressable' src/screens/weight-log/index.tsx)" = 0 \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bunx expo lint --no-cache \
    && git add src/screens/weight-log/index.tsx \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/screens/weight-log/index.tsx' \
    && <LIMPIO> \
    && git commit -m 'feat(mobile): toast y háptico tras registrar un peso (#169 R10)'

-- T11 R11: ni toast ni haptico fuera de ok (nace verde) --

c21, T11 tests (tasks.md T11 (1): el describe de R11 con su it.each de 8
filas, todas verdes):
  <PESO> > /tmp/169-r11.txt 2>&1; echo "exit=$?"
    -> exit=0 y `Tests:       147 passed, 147 total`
  <GUARDAS> > /tmp/169-r11-guardas.txt 2>&1; echo "exit=$?"
  grep -qE '^Tests: +147 passed, 147 total$' /tmp/169-r11.txt \
    && grep -qE '^Tests: +92 passed, 92 total$' /tmp/169-r11-guardas.txt \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bunx expo lint --no-cache \
    && git add src/screens/weight-log/index.test.tsx \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/screens/weight-log/index.test.tsx' \
    && <LIMPIO> \
    && git commit -m 'test(mobile): sin toast ni háptico en altas fallidas (#169 R11)'
  Despues, la sonda S11, sobre src/screens/weight-log/index.tsx, midiendo
  solo src/screens/weight-log/index.test.tsx:
    S11  como PRIMERA sentencia del handler de alta (antes de validar el
         peso), lo mismo que hace la rama `case 'ok':` para mostrar el
         toast y `void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);`,
         SIN quitar nada de la rama `case 'ok':`
         -> `Tests:       9 failed, 45 passed, 54 total` (las 8 filas de
            `#169 R11: ni toast ni háptico fuera de la rama ok` y
            `muestra el toast y el háptico solo tras resolver el alta`;
            `llama al háptico una sola vez en la rama ok del fuente` sigue
            verde; ninguno por consulta)
  No hay commit verde de R11.

-- T12 R12: el toast se va solo --

c22, T12 rojo (tasks.md T12 (1): el describe de R12, 2 it, con timers
falsos y sin waitFor entre el alta y las ventanas):
  FORCE_COLOR=0 bunx jest --runTestsByPath src/screens/weight-log/index.test.tsx > /tmp/169-r12.txt 2>&1; echo "exit=$?"
    -> exit=1 y `Tests:       2 failed, 54 passed, 56 total`, los dos por asercion
  grep -qE '^Tests: +2 failed, 54 passed, 56 total$' /tmp/169-r12.txt \
    && test "$(grep -E '^  ● ' /tmp/169-r12.txt | grep -cvxF '  ● Console')" = 2 \
    && test "$(grep -E '^  ● ' /tmp/169-r12.txt | grep -cF '#169 R12: el toast se va solo')" = 2 \
    && ! grep -qE 'Test suite failed to run|TypeError|ReferenceError|SyntaxError|Cannot find module' /tmp/169-r12.txt \
    && ! grep -qF 'Unable to find' /tmp/169-r12.txt \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bunx expo lint --no-cache \
    && git add src/screens/weight-log/index.test.tsx \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/screens/weight-log/index.test.tsx' \
    && <LIMPIO> \
    && git commit -m 'test(mobile): el toast de peso se oculta solo (#169 R12)'

c23, T12 verde (tasks.md T12 (2): el timer de D8 con
`const WEIGHT_TOAST_MS = 2500;` y el reinicio):
  <PESO> > /tmp/169-g12.txt 2>&1; echo "exit=$?"
    -> exit=0 y `Tests:       149 passed, 149 total`
  <GUARDAS> > /tmp/169-g12-guardas.txt 2>&1; echo "exit=$?"
  grep -qE '^Tests: +149 passed, 149 total$' /tmp/169-g12.txt \
    && grep -qE '^Tests: +92 passed, 92 total$' /tmp/169-g12-guardas.txt \
    && test "$(grep -cF 'const WEIGHT_TOAST_MS = 2500;' src/screens/weight-log/index.tsx)" = 1 \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bunx expo lint --no-cache \
    && git add src/screens/weight-log/index.tsx \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/screens/weight-log/index.tsx' \
    && <LIMPIO> \
    && git commit -m 'feat(mobile): auto-ocultado del toast de peso (#169 R12)'

-- T13 R13: movimiento del toast --

c24, T13 rojo (tasks.md T13 (1): el describe de R13, 2 it; `FadeIn` y
`FadeOut` con import nombrado de 'react-native-reanimated'):
  FORCE_COLOR=0 bunx jest --runTestsByPath src/screens/weight-log/index.test.tsx > /tmp/169-r13.txt 2>&1; echo "exit=$?"
    -> exit=1 y `Tests:       2 failed, 56 passed, 58 total`, los dos por asercion
  grep -qE '^Tests: +2 failed, 56 passed, 58 total$' /tmp/169-r13.txt \
    && test "$(grep -E '^  ● ' /tmp/169-r13.txt | grep -cvxF '  ● Console')" = 2 \
    && test "$(grep -E '^  ● ' /tmp/169-r13.txt | grep -cF '#169 R13: movimiento del toast')" = 2 \
    && ! grep -qE 'Test suite failed to run|TypeError|ReferenceError|SyntaxError|Cannot find module' /tmp/169-r13.txt \
    && ! grep -qF 'Unable to find' /tmp/169-r13.txt \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bunx expo lint --no-cache \
    && git add src/screens/weight-log/index.test.tsx \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/screens/weight-log/index.test.tsx' \
    && <LIMPIO> \
    && git commit -m 'test(mobile): fundido de entrada y salida del toast de peso (#169 R13)'

c25, T13 verde (tasks.md T13 (2): `Animated.View` con `entering` y
`exiting`; <PESO> corre tambien R12. Si R12 no llega a verde, se amplia
la ventana de tiempo, nunca la asercion, y se anota en el impl; si eso
obliga a tocar el test, PARA):
  <PESO> > /tmp/169-g13.txt 2>&1; echo "exit=$?"
    -> exit=0 y `Tests:       151 passed, 151 total`
  <GUARDAS> > /tmp/169-g13-guardas.txt 2>&1; echo "exit=$?"
  grep -qE '^Tests: +151 passed, 151 total$' /tmp/169-g13.txt \
    && grep -qE '^Tests: +92 passed, 92 total$' /tmp/169-g13-guardas.txt \
    && test "$(grep -cF 'entering={FadeIn.duration(MOTION_TRANSITION_MS)}' src/screens/weight-log/index.tsx)" = 1 \
    && test "$(grep -cF 'exiting={FadeOut.duration(MOTION_FEEDBACK_MS)}' src/screens/weight-log/index.tsx)" = 1 \
    && test "$(grep -cF 'ReduceMotion.Never' src/screens/weight-log/index.tsx)" = 0 \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bunx expo lint --no-cache \
    && git add src/screens/weight-log/index.tsx \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/screens/weight-log/index.tsx' \
    && <LIMPIO> \
    && git commit -m 'feat(mobile): toast de peso con FadeIn y FadeOut (#169 R13)'

== CIERRE ==

Desde mobile-pet-tracker/ (el `cd` literal de BASE otra vez), sin pipe,
con salida al impl:
- El comando BASE, con la salida a /tmp/169-final.txt
    -> exit=0, `Test Suites: 9 passed, 9 total` y `Tests:       363 passed, 363 total`
       (326 + 37; reparto: weight-chart 15, language-provider 26,
       weight-log 58, el resto sin cambios)
- `FORCE_COLOR=0 bunx jest --runTestsByPath src/utils/monthly-weight-delta.test.ts > /tmp/169-final-md.txt 2>&1; echo "exit=$?"`
    -> exit=0 y `Tests:       11 passed, 11 total`
- `pgrep -af '[i]nit\.sh'` vacio; despues el comando ALL con la salida a
  /tmp/169-all.txt -> exit=0, `Test Suites: 99 passed, 99 total` y
  `Tests:       2823 passed, 2823 total`. Copia las lineas `Test Suites:`
  y `Tests:`. Mientras corre, no lances otra cosa.
- `bun run typecheck; echo "exit=$?"` -> exit=0 y
  `bunx expo lint --no-cache; echo "exit=$?"` -> exit=0.
- tasks.md Cierre (3):
  `grep -cF 'Haptics.notificationAsync(' src/screens/weight-log/index.tsx`   -> 1
Desde la raiz del repo (`cd /home/claude/sites/Pet-Tracker-wt-169 && pwd`):
- Las anclas A, B y X (desde mobile-pet-tracker/) y H1-H4 con sus valores
  de cierre, y P1-P22.
- tasks.md Cierre (1) y (2):
  `git diff --name-only 89fe2009..HEAD -- mobile-pet-tracker/src/screens/health`   -> vacio
  `git diff --name-only 89fe2009..HEAD -- mobile-pet-tracker/package.json mobile-pet-tracker/bun.lock mobile-pet-tracker/src/theme/motion.ts`   -> vacio
- `git diff --stat <H0> -- mobile-pet-tracker/src/theme/__tests__/motion.test.ts backend-pet-tracker/ infra-pet-tracker/`   -> vacio
- `git diff --name-only <H0> HEAD -- docs/`   -> vacio
- `git diff --name-only <H0> HEAD -- mobile-pet-tracker/ | LC_ALL=C sort`
  -> exactamente los 11 de mobile-pet-tracker/ de la lista de abajo

Despues rellena specs/mobile-weight-draw-and-toasts/traceability.md, solo
la columna «Commit»: hash corto + mensaje del rojo y del verde,
`rojo → verde`, para R1-R3, R5-R10, R12 y R13 (en R7, tambien el
refactor). R4 y R11 no tienen verde: el hash y el mensaje de su commit de
tests y `nace verde; sondas S4a y S4b` / `nace verde; sonda S11`. La fila
R14 se queda `pendiente`. No toques su frontmatter, ni la columna de
tests, ni el resto del fichero. Termina el impl con la linea
`R14: pendiente del smoke humano`. c26, desde la raiz:
  git add specs/mobile-weight-draw-and-toasts/traceability.md progress/impl_mobile-weight-draw-and-toasts.md \
    && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'progress/impl_mobile-weight-draw-and-toasts.md specs/mobile-weight-draw-and-toasts/traceability.md ' \
    && git commit -m 'docs(mobile-weight-draw-and-toasts): #169 traceability'
Despues, la lista cerrada, con salida al impl:
  git diff --name-only <H0> HEAD -- . ':!feature_list.json' ':!progress/current.md' ':!progress/handoff_mobile-weight-draw-and-toasts.md' ':!specs/mobile-weight-draw-and-toasts/requirements.md' ':!specs/mobile-weight-draw-and-toasts/design.md' ':!specs/mobile-weight-draw-and-toasts/tasks.md' ':!progress/review_mobile-weight-draw-and-toasts.md'
    -> exactamente los 14 ficheros de abajo
y c27, desde la raiz:
  git commit --only progress/impl_mobile-weight-draw-and-toasts.md -m 'docs(mobile-weight-draw-and-toasts): #169 closed file list'
No rebasees despues de escribir hashes.

== REGLAS CRITICAS ==

- UI movil: docs/ui-guidelines.md manda (carta). Cero hex fuera de
  src/theme/, cero `StyleSheet.create`, cero clases entre corchetes. El
  unico `style` nuevo es `style={TABULAR_NUMS}` (los dos del resumen). El
  toast es una capsula `rounded-full`: sin `CONTINUOUS_CORNER` (#62 R14).
  Ni `Button` ni `Pressable` nuevos (B9, B10). Las clases son las de la
  spec, literales completos, nunca compuestas, salvo el
  `${tileClassName}` que ya existe (X2).
- Movimiento: solo el de la spec. `withTiming(1, MOTION_FILL_TIMING)` en
  la grafica, `FadeIn.duration(MOTION_TRANSITION_MS)` y
  `FadeOut.duration(MOTION_FEEDBACK_MS)` en el toast. Ni tokens nuevos en
  motion.ts, ni `ReduceMotion.Never`, ni `LayoutAnimation`, Lottie, Rive o
  `expo-linear-gradient`. El area de la grafica y las filas del historial
  no se animan.
- Skills: carga `building-native-ui` (tu plugin expo) y, de .agents/skills/
  del repo, `appllama-app-design-skill` (OBLIGATORIA: cambias una pantalla
  y un componente; ver docs/ui-guidelines.md §Skills y sus tres limites) y
  `animate-expo`. Las decisiones de la spec mandan sobre cualquier skill.
  Di en el impl cuales cargaste.
- Convenciones: docs/conventions.md, en particular §Tests y §Esperas. La
  espera termina con la misma observacion que se aserta: nunca se espera
  a un mock ni a un contador para luego mirar el arbol. RNTL 14: `await`
  en todo `render`, `rerender`, `fireEvent.*` y `act`; ni `findAll` ni
  `UNSAFE_*`. Props animadas, siempre con `?.value` (tasks.md §Reglas
  comunes).
- Valores esperados LITERALES en los tests (clases, testIDs, textos,
  colores del doble, ms), nunca el simbolo importado de produccion. Unica
  excepcion: `toBe(MOTION_FILL_TIMING)` de T1, que compara identidad.
- Imports en los tests: NOMBRADOS, nunca `import * as` (eslint
  `import/namespace` es error y tumbaria la cadena). expo-haptics se lee
  con `jest.requireMock('expo-haptics')`. Reutiliza lo que ya hay en cada
  fichero (`makeWeight`, `makeProfile`, `renderWeightLog`, `pending`,
  `escapeRegExp`, X11, X12, X18): no los dupliques.
- Orden dentro de cada fichero: los describe nuevos AL FINAL; los
  `jest.mock` nuevos detras de los que ya hay; las claves del catalogo
  junto a las demas `weightLog.*`; las filas de la tabla de copy al final
  de `R5_HEALTH`.
- design-drift recorre tambien los tests co-locados: todo `#169` que
  escribas, en tests o en produccion, va seguido de ` R<n>` (un `#169`
  suelto lo caza el guard de hex).
- Ni `bun add`, ni cambios en package.json, bun.lock ni app.json. Todo
  con bun/bunx, nunca npm/npx. Nada de prettier (mobile no lo usa).
- NO lances ./init.sh ni toques Postgres ni LocalStack: los comparten
  otras sesiones y el gate lo corre el leader.
- No toques ningun fichero fuera de la lista de abajo (las sondas,
  revertidas, no cuentan). En particular, NO: src/screens/health/ (su
  test incluido: si src/screens/health/index.test.tsx sale rojo, PARA),
  src/theme/motion.ts, src/theme/__tests__/motion.test.ts, assets/,
  app.json.
- NO son tuyos, no los toques: progress/history.md, progress/current.md,
  STATUS.md, feature_list.json, el frontmatter de los ficheros de la spec
  (traceability.md incluido), tasks.md y design.md de #169 y las casillas
  de §Aprobacion de requirements.md (incluida la del smoke de R14). Los
  escribe el leader o el humano. Todo lo que tengas que contar va en
  progress/impl_mobile-weight-draw-and-toasts.md.
- Si el sandbox te deniega un comando, PARA y reportalo. No lo sustituyas
  por otro que haga lo mismo con otra herramienta.
- NO hagas push ni abras la PR: lo hace el leader al cerrar.

Ficheros que TU cambias (14, ni uno mas):
  mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts
  mobile-pet-tracker/src/__tests__/ui-copy-table.ts
  mobile-pet-tracker/src/__tests__/ui-language.test.ts
  mobile-pet-tracker/src/components/__tests__/weight-chart.test.tsx
  mobile-pet-tracker/src/components/weight-chart.tsx
  mobile-pet-tracker/src/i18n/catalog.ts
  mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx
  mobile-pet-tracker/src/screens/weight-log/index.test.tsx
  mobile-pet-tracker/src/screens/weight-log/index.tsx
  mobile-pet-tracker/src/utils/monthly-weight-delta.test.ts
  mobile-pet-tracker/src/utils/monthly-weight-delta.ts
  progress/impl_mobile-weight-draw-and-toasts.md
  specs/mobile-ui-language/design.md
  specs/mobile-weight-draw-and-toasts/traceability.md
Si el leader commitea en mitad (una correccion), solo tocara ficheros
excluidos por los pathspecs de la lista cerrada; cualquier otro fichero
ajeno en `git diff --name-only <H0> HEAD` es motivo de parada.

Criterios de aceptacion: R1-R13 de requirements.md. La prueba de humo de
R14 (dev build de Android) es del humano: no la marques. Deja en el impl
sus 5 pasos (requirements.md R14), listos para el humano.

Al terminar, progress/impl_mobile-weight-draw-and-toasts.md debe tener:
pwd, branch, H0 y status; el exit de is-ancestor; node_modules (presente
o instalado); skills cargadas; la salida de las 56 anclas (A1-A18,
B1-B11, X1-X23, H1-H4) en H0 y la de cierre, mas P1-P22; la base con su
exit (comando BASE) y el ALL de la base; los 25 commits de T1-T13 con
hash y R-id; por cada rojo, el comando, la linea `Tests:`, el exit y cada
it rojo con su matcher y Expected/Received (o su mensaje de consulta); en
c8, tambien las salidas de typecheck y lint; cada verde y c7, c18 y c21
con sus lineas `Tests:`, GUARDAS, typecheck y lint; las sondas S1, S4a,
S4b, S6 y S11 con su linea `Tests:` roja, sus `●` y su `limpio=0`; el
cierre (BASE con 363, el fichero nuevo con 11, ALL con exit y total,
typecheck, lint, diffs vacios, lista cerrada); los pasos de la prueba de
humo R14; la linea `R14: pendiente del smoke humano`; y cualquier
decision que la spec no cerrara literalmente.
```

---

## Reanudación 1 — tras la parada de c7 (eslint muerto por SIGKILL)

> Codex paró bien en c7: `bunx expo lint --no-cache` imprimió
> `error: Failed to run "eslint" due to signal SIGKILL` y aun así salió con
> 0, así que el `&&` dejó pasar el commit `9f78ebbc`. El SIGKILL vino del
> entorno, no del código: la máquina (16 GB, sin swap) iba con carga media
> 36 en los 5 minutos previos por otras sesiones. El leader lo verificó el
> 2026-10-12:
>
> - `bunx expo lint --no-cache` sobre `9f78ebbc`: exit 0 y salida vacía;
> - `bunx eslint --stdin` del fichero que cambia cada commit, c1 a c6, en su
>   propio commit: los seis limpios.
>
> c7 vale tal cual: ni reset ni amend. `bunx expo lint` no propaga la señal
> de eslint, y por eso el lint de todas las cadenas restantes pasa a exigir
> salida vacía. H0 sigue siendo `fc384b44`. Este commit del leader solo toca
> `progress/handoff_mobile-weight-draw-and-toasts.md` y
> `progress/current.md`, que la lista cerrada ya excluye.

Pegar en Codex CLI:

```
Worktree: /home/claude/sites/Pet-Tracker-wt-169   <- PRIMERA LINEA. Trabaja AQUI y en ningun otro sitio
Reanudas #169 mobile-weight-draw-and-toasts tras tu parada en c7. Relee
progress/handoff_mobile-weight-draw-and-toasts.md entero: el bloque
principal sigue mandando, con los cambios de esta Reanudacion 1 (al final
del fichero). H0 sigue siendo fc384b44.

== ARRANQUE ==
cd /home/claude/sites/Pet-Tracker-wt-169 && pwd
Pega en tu impl, bajo un titulo nuevo `## Reanudacion 1` al FINAL del
fichero (no borres ni edites nada de lo que ya escribiste, PARADA
incluida), las salidas de:
  git branch --show-current          -> feature/169-mobile-weight-draw-and-toasts
  git rev-parse --short HEAD         -> el commit del leader que anade esta Reanudacion 1
  git log --oneline fc384b44..HEAD   -> tus 7 commits (98db0006 a 9f78ebbc) y encima el del leader
  git status --short                 -> SOLO `?? progress/impl_mobile-weight-draw-and-toasts.md`
PARA si algo de esto no sale asi. No repitas las anclas, ni BASE, ni ALL de
la base: ya estan en tu impl y el leader las dio por buenas.

== QUE CAMBIA ==
1. Lint en TODAS las cadenas que quedan (c9-c25; c8 sigue con su medida
   aparte, que ya exige `✖ 1 problem`): donde la cadena dice
     bunx expo lint --no-cache \
   escribe
     bunx expo lint --no-cache > /tmp/169-lint.txt 2>&1 && test ! -s /tmp/169-lint.txt \
   Con el arbol limpio, expo lint no imprime nada. Cualquier salida (un
   error, un warning o `Failed to run "eslint"`) rompe la cadena antes del
   commit.
   En el CIERRE, la medida de lint pasa a ser:
     bunx expo lint --no-cache > /tmp/169-lint-final.txt 2>&1; echo "exit=$?"; test ! -s /tmp/169-lint-final.txt; echo "vacio=$?"
     -> exit=0 y vacio=0
2. Reintento por SIGKILL. Si una cadena se corta y el UNICO motivo es que
   un log (/tmp/169-lint.txt, el de jest o el de tsc) contiene
   `due to signal SIGKILL`, o una linea `Killed`, no es una parada a la
   primera:
   - anotalo en el impl;
   - espera a que `pgrep -af '[i]nit\.sh'` salga vacio;
   - repite la cadena ENTERA una vez, con sus medidas.
   Si vuelve a pasar, PARA. Cualquier otro fallo sigue siendo parada, como
   en el bloque principal.
3. Si el commit ya se hizo y despues ves un SIGKILL en la salida, PARA sin
   reset ni amend (como hiciste en c7).

== QUE HACES ==
Sigue en el punto exacto donde paraste:
1. Las sondas S4a y S4b sobre el HEAD actual (src/components/weight-chart.tsx
   esta igual que en 9f78ebbc: el commit del leader no lo toca), una a una,
   midiendo solo src/components/__tests__/weight-chart.test.tsx, con su
   reversion y `limpio=0`.
2. c8 a c25, las cadenas del bloque principal con el cambio 1.
3. El CIERRE, c26 y c27, como dice el bloque principal.
La lista cerrada se mide contra fc384b44 y ya excluye los dos ficheros que
toca el leader.

Todo lo demas, igual que en el bloque principal: REGLAS CRITICAS, lista
cerrada de 14, nada de ./init.sh, push ni PR, y lo que debe contener el
impl al terminar.
```

---

## Reanudación 2 — tras la parada de c12 (TS2769 en el doble de reicon)

> Codex paró bien en c12. El rojo salió como se esperaba
> (`4 failed, 33 passed, 37 total`, los cuatro por consulta), pero el
> typecheck falló en `src/screens/weight-log/index.test.tsx(71,38)` con
> TS2769: `{ color }` no cabe en `StyleProp<ViewStyle>`. El defecto es de la
> spec, no de Codex. La tabla de dobles de `tasks.md` prescribía los iconos
> de reicon como `View` con `style={{ color }}`, y el leader no pasó ese
> doble por el typecheck. Codex lo copió al pie de la letra y paró sin
> tocarlo, como debía.
>
> Enmienda en `specs/mobile-weight-draw-and-toasts/tasks.md` (tabla de
> dobles, fila de `reicon-react-native`): los iconos pasan a ser `Text` de
> `react-native`, porque `TextStyle` sí admite `color`. Además son una
> `function MockIcon` con nombre, porque una flecha anónima rompe
> `react/display-name` (lo destapó el eslint del leader en la misma
> medida). Las aserciones no cambian: `props.style.color` y `props.size`
> se leen igual en un `Text`, y un `Text` vacío no añade texto a
> `toHaveTextContent`.
>
> El leader lo midió el 2026-10-12 en una copia fuera del árbol, con el
> fichero sin commitear de Codex más este cambio: `tsc --noEmit` 0,
> `eslint` del fichero 0, y el rojo igual (`4 failed, 33 passed, 37 total`,
> los cuatro por `Unable to find an element with testID:
> weight-row-w-{up,down,flat,none}-tone`). Una sonda aparte confirmó que
> `Check` doblado así, con `size={16} color="green"`, da
> `props.style.color === 'green'` y `props.size === 16`, que es lo que asertan
> T9 y T10.
>
> c1 a c11 valen tal cual. H0 sigue siendo `fc384b44`. Este commit del
> leader solo toca `progress/handoff_mobile-weight-draw-and-toasts.md`,
> `progress/current.md` y `specs/mobile-weight-draw-and-toasts/tasks.md`,
> que la lista cerrada ya excluye. El cambio sin commitear de Codex en
> `src/screens/weight-log/index.test.tsx` sigue en el árbol, intacto.

Pegar en Codex CLI:

```
Worktree: /home/claude/sites/Pet-Tracker-wt-169   <- PRIMERA LINEA. Trabaja AQUI y en ningun otro sitio
Reanudas #169 mobile-weight-draw-and-toasts tras tu parada en c12. Relee
progress/handoff_mobile-weight-draw-and-toasts.md entero: el bloque
principal sigue mandando, con los cambios de la Reanudacion 1 (siguen
vigentes: lint con salida vacia y un reintento por SIGKILL) y los de esta
Reanudacion 2 (al final del fichero). Relee tambien la fila de
`reicon-react-native` de la tabla de dobles de
specs/mobile-weight-draw-and-toasts/tasks.md, que esta enmendada. H0 sigue
siendo fc384b44.

== ARRANQUE ==
cd /home/claude/sites/Pet-Tracker-wt-169 && pwd
Pega en tu impl, bajo un titulo nuevo `## Reanudacion 2` al FINAL del
fichero (no borres ni edites nada de lo que ya escribiste, las dos PARADAS
incluidas), las salidas de:
  git branch --show-current          -> feature/169-mobile-weight-draw-and-toasts
  git rev-parse --short HEAD         -> el commit del leader que anade esta Reanudacion 2
  git log --oneline fc384b44..HEAD   -> tus 11 commits (98db0006 a 9c9c9382), el del leader e4903ae1 entre c7 y c8, y encima el nuevo del leader
  git diff --cached --name-only      -> vacio
  git status --short                 -> SOLO estas dos lineas:
                                         ` M mobile-pet-tracker/src/screens/weight-log/index.test.tsx`
                                         `?? progress/impl_mobile-weight-draw-and-toasts.md`
PARA si algo de esto no sale asi. No repitas las anclas, ni BASE, ni ALL de
la base, ni S4a/S4b.

== QUE CAMBIA ==
1. En src/screens/weight-log/index.test.tsx, que tienes SIN commitear,
   cambias SOLO el doble de `reicon-react-native`. Nada mas del fichero se
   toca: ni el describe de R8, ni el doble de use-theme-colors, ni
   prepareWeightLogTests, ni el doble de `expo-router`, que sigue con su
   `View`.
   Donde ahora pone
     const { View } = jest.requireActual<typeof import('react-native')>('react-native');
     const icon = (testID: string) => ({ size, color }: { size?: number; color?: string }) => {
       const props = { testID, size, style: { color } };
       return React.createElement(View, props);
     };
   pon, con la misma sangria de dos espacios dentro del factory de jest.mock,
     const { Text } = jest.requireActual<typeof import('react-native')>('react-native');
     const icon = (testID: string) =>
       function MockIcon({ size, color }: { size?: number; color?: string }) {
         const props = { testID, size, style: { color } };
         return React.createElement(Text, props);
       };
   Comprueba el cambio desde mobile-pet-tracker/ con estas anclas, y PARA
   si alguna no da su numero:
     grep -cF "const { Text } = jest.requireActual<typeof import('react-native')>('react-native');" src/screens/weight-log/index.test.tsx      -> 1
     grep -cF "function MockIcon({ size, color }: { size?: number; color?: string }) {" src/screens/weight-log/index.test.tsx                 -> 1
     grep -cF "return React.createElement(Text, props);" src/screens/weight-log/index.test.tsx                                                 -> 1
     grep -cF "return React.createElement(View, props);" src/screens/weight-log/index.test.tsx                                                 -> 1   (el de expo-router)
     grep -cF "({ size, color }: { size?: number; color?: string }) => {" src/screens/weight-log/index.test.tsx                               -> 0
   Pegalas en el impl con su salida.
2. Nada mas cambia. Los dobles de T9 y T10 son este mismo: sus aserciones
   (`style.color` y `size`) no cambian.

== QUE HACES ==
1. c12 ENTERA desde el principio, como dice el bloque principal, con el
   lint de la Reanudacion 1:
     ... && test ! -e .expo/types/router.d.ts && bun run typecheck \
       && bunx expo lint --no-cache > /tmp/169-lint.txt 2>&1 && test ! -s /tmp/169-lint.txt \
       && git add src/screens/weight-log/index.test.tsx ...
   Vuelve a medir el rojo: debe salir otra vez exit=1 y
   `Tests:       4 failed, 33 passed, 37 total`, los cuatro por consulta
   (`Unable to find an element with testID: weight-row-w-{up,down,flat,none}-tone`).
   Si sale otra cosa, PARA.
2. c13 a c25, las cadenas del bloque principal con el lint de la
   Reanudacion 1.
3. El CIERRE, c26 y c27, como dice el bloque principal, con la medida de
   lint de la Reanudacion 1.
La lista cerrada se mide contra fc384b44 y ya excluye los tres ficheros
que toca el leader.

Todo lo demas, igual que en el bloque principal: REGLAS CRITICAS, lista
cerrada de 14, nada de ./init.sh, push ni PR, y lo que debe contener el
impl al terminar.
```

---

## Reanudación 3 — tras la parada de c13 (el selector de R7 atrapa los testIDs nuevos)

> Codex cerró c12 (`6569bd89`) y paró bien en la medida `<PESO>` de c13.
> Los cuatro tests de R8 pasan y `<GUARDAS>` da 92, pero falla un `it` que
> ya existía, el de mobile-health R7 `keeps API order and renders each
> weight detail`, en `src/screens/weight-log/index.test.tsx`. Ese `it`
> lista las filas con `getAllByTestId(/^weight-row-/)`. El prefijo suelto
> atrapa también los dos testIDs nuevos de R8 (`weight-row-<id>-tone` y
> `weight-row-<id>-delta`), y el `toEqual` recibe seis ids en vez de dos.
>
> El defecto es de la spec: los nombres de R8 (requirements.md, fijados en
> el gate) comparten prefijo con las filas, y el leader no buscó con grep
> los selectores por prefijo antes de firmar T7. No se renombran los
> testIDs, porque eso reabriría el gate. Se ancla el selector de R7 a las
> filas: `getAllByTestId(/^weight-row-weight-\d+$/)`. La lista esperada y
> el resto del `it` no cambian. No hay más selectores por prefijo de
> `weight-row-` en el repo (`git grep -nF "weight-row-"`).
>
> Enmienda en `specs/mobile-weight-draw-and-toasts/tasks.md`, T7 (2). El
> leader lo midió el 2026-10-12 en una copia fuera del árbol (HEAD
> `6569bd89` más los dos testIDs sin commitear de Codex más el selector
> nuevo): `<PESO>` 130 passed, `<GUARDAS>` 92 passed, `tsc --noEmit` 0 y
> eslint de los dos ficheros 0.
>
> c1 a c12 valen tal cual. H0 sigue siendo `fc384b44`. Este commit del
> leader solo toca `progress/handoff_mobile-weight-draw-and-toasts.md`,
> `progress/current.md` y `specs/mobile-weight-draw-and-toasts/tasks.md`,
> que la lista cerrada ya excluye. El test ya está en la lista cerrada de
> 14, así que la lista no cambia. Los dos testIDs sin commitear de Codex
> en `src/screens/weight-log/index.tsx` siguen en el árbol, intactos.

Pegar en Codex CLI:

```
Worktree: /home/claude/sites/Pet-Tracker-wt-169   <- PRIMERA LINEA. Trabaja AQUI y en ningun otro sitio
Reanudas #169 mobile-weight-draw-and-toasts tras tu parada en c13. Relee
progress/handoff_mobile-weight-draw-and-toasts.md entero: el bloque
principal sigue mandando, con los cambios de las Reanudaciones 1 y 2
(siguen vigentes: lint con salida vacia, un reintento por SIGKILL, doble
de reicon con Text) y los de esta Reanudacion 3 (al final del fichero).
Relee tambien T7 (2) de specs/mobile-weight-draw-and-toasts/tasks.md, que
esta enmendado. H0 sigue siendo fc384b44.

== ARRANQUE ==
cd /home/claude/sites/Pet-Tracker-wt-169 && pwd
Pega en tu impl, bajo un titulo nuevo `## Reanudacion 3` al FINAL del
fichero (no borres ni edites nada de lo que ya escribiste, las tres
PARADAS incluidas), las salidas de:
  git branch --show-current          -> feature/169-mobile-weight-draw-and-toasts
  git rev-parse --short HEAD         -> el commit del leader que anade esta Reanudacion 3
  git log --oneline fc384b44..HEAD   -> tus 12 commits (98db0006 a 6569bd89), los del leader e4903ae1 (entre c7 y c8) y 19e308f6 (entre c11 y c12), y encima el nuevo del leader
  git diff --cached --name-only      -> vacio
  git status --short                 -> SOLO estas dos lineas:
                                         ` M mobile-pet-tracker/src/screens/weight-log/index.tsx`
                                         `?? progress/impl_mobile-weight-draw-and-toasts.md`
PARA si algo de esto no sale asi. No repitas las anclas, ni BASE, ni ALL de
la base, ni S4a/S4b.

== QUE CAMBIA ==
1. c13 toca DOS ficheros, no uno. Ademas de los dos testIDs que ya tienes
   sin commitear en src/screens/weight-log/index.tsx, en
   src/screens/weight-log/index.test.tsx cambias SOLO el selector del `it`
   de R7 `keeps API order and renders each weight detail`:
     getAllByTestId(/^weight-row-/)
   pasa a
     getAllByTestId(/^weight-row-weight-\d+$/)
   Nada mas del test se toca: ni la lista esperada del `toEqual`, ni el
   describe de R8, ni los dobles.
   Comprueba el cambio desde mobile-pet-tracker/ con estas anclas, y PARA
   si alguna no da su numero:
     grep -cF 'getAllByTestId(/^weight-row-weight-\d+$/)' src/screens/weight-log/index.test.tsx   -> 1
     grep -cF 'getAllByTestId(/^weight-row-/)' src/screens/weight-log/index.test.tsx               -> 0
   Pegalas en el impl con su salida.
2. La cadena de c13 queda asi (sustituye a la del bloque principal):
  cd /home/claude/sites/Pet-Tracker-wt-169/mobile-pet-tracker
  <PESO> > /tmp/169-g8.txt 2>&1; echo "exit=$?"
    -> exit=0 y `Tests:       130 passed, 130 total`
  <GUARDAS> > /tmp/169-g8-guardas.txt 2>&1; echo "exit=$?"
    -> exit=0 y `Tests:       92 passed, 92 total`
  grep -qE '^Tests: +130 passed, 130 total$' /tmp/169-g8.txt \
    && grep -qE '^Tests: +92 passed, 92 total$' /tmp/169-g8-guardas.txt \
    && test "$(grep -cF 'weight-row-${entry.id}-tone' src/screens/weight-log/index.tsx)" = 1 \
    && test "$(grep -cF 'weight-row-${entry.id}-delta' src/screens/weight-log/index.tsx)" = 1 \
    && test "$(grep -cF 'getAllByTestId(/^weight-row-weight-\d+$/)' src/screens/weight-log/index.test.tsx)" = 1 \
    && test "$(grep -cF 'getAllByTestId(/^weight-row-/)' src/screens/weight-log/index.test.tsx)" = 0 \
    && test ! -e .expo/types/router.d.ts && bun run typecheck \
    && bunx expo lint --no-cache > /tmp/169-lint.txt 2>&1 && test ! -s /tmp/169-lint.txt \
    && git add src/screens/weight-log/index.tsx src/screens/weight-log/index.test.tsx \
    && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/screens/weight-log/index.test.tsx mobile-pet-tracker/src/screens/weight-log/index.tsx ' \
    && <LIMPIO> \
    && git commit -m 'feat(mobile): testIDs del chip de delta por entrada (#169 R8)'

== QUE HACES ==
1. El cambio 1 y sus anclas.
2. c13 con la cadena de arriba.
3. c14 a c25, las cadenas del bloque principal con el lint de la
   Reanudacion 1.
4. El CIERRE, c26 y c27, como dice el bloque principal, con la medida de
   lint de la Reanudacion 1.
La lista cerrada se mide contra fc384b44 y ya excluye los tres ficheros
que toca el leader.

Todo lo demas, igual que en el bloque principal: REGLAS CRITICAS, lista
cerrada de 14, nada de ./init.sh, push ni PR, y lo que debe contener el
impl al terminar.
```

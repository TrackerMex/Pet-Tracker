# Handoff a Codex CLI — #171 mobile-celebrations-and-living-empty

> Pegar el bloque de abajo en Codex CLI. La spec está firmada (commit de firma
> `1b20491c`, aprobación vía Notion el 2026-10-12, con la enmienda a la carta
> de R15) y la enmienda E1 también (commit `82eda89f`, vía Notion el mismo
> día). La feature trae la pantalla de celebración a pantalla completa
> (`Celebration`, con confeti de una sola pasada, pop de Pingo con la pose
> nueva `celebrate`, insignia ✓ y háptico de éxito) a dos momentos: vincular un
> collar y añadir la primera mascota. Además, Pingo flota en los vacíos de
> `EmptyState`. Son 30 commits: T1-T15 en pares rojo/verde (T7 nace verde en un
> solo commit), un refactor del arnés de Añadir mascota, uno de trazabilidad y
> uno de lista cerrada. La prueba de humo R16, en un dev build de Android, es
> del humano y cierra la feature.
>
> `node_modules` lo instaló el `init.sh` del leader en
> `Pet-Tracker-wt-171/mobile-pet-tracker`. La branch ya incluye `origin/main`
> d2b8b0ae (#166 mergeada): no hace falta merge antes de H0. No hay
> dependencias nuevas. El WebP de la pose ya está convertido fuera del árbol.
>
> Correcciones del leader en H0 (no cambian requisitos):
> - **E1** (aprobada): el confeti de tasks.md T3 son rectángulos sin radio, y
>   sus cinco colores de categoría salen de `CONFETTI_FILLS` en
>   `src/utils/category-palette.ts`. Con `rounded-sm` y las clases sueltas
>   rompía #62 R4, #98 R10 y #64 R9. El cambio de #64 R9 ya está en tasks.md T3.
> - **Candado de Docs** (#158 R4, añadido a design.md §7 tras la firma): el
>   `it.each` de hijos del vacío de Docs pasa de `docs-empty-pose` a
>   `docs-empty-float`. Da tres rojos esperados en T12.
> - **Sonda S8.1** (tasks.md T8): `phase` solo vale `'idle'` o `'ready'`, así
>   que «cambiar la condición a `phase !== 'idle'`» no mutaba nada. La sonda
>   nueva fuerza `ready` en la rama de error del claim; medida por el leader.
> - **Sondas S11.1 y S11.2** (tasks.md T10 + T11): también ponen rojos `it`
>   existentes que esperan `back` una vez, así que su línea `Tests:` se anota
>   y no se fija. Lo que sí se exige es qué `it` nuevos están entre los `●`.
> - **c9**: el rojo de T4 no comprueba `TypeError`. tasks.md T4 admite que
>   `getAnimatedStyle` lance sobre un `Animated.View` sin estilo animado.
> - **Nodos ocultos** (tasks.md, reglas comunes y T5): `{id}-confetti`, sus
>   piezas y `{id}-badge` están ocultos a la accesibilidad (R2.7), y RNTL 14
>   los deja fuera de `getBy*`/`queryBy*` sin `{ includeHiddenElements: true }`.
>   Spike del leader fuera del árbol: `getByTestId` lanza `Unable to find`
>   sobre los tres y sobre el `✓`, y `queryByTestId('probe-confetti-0')` da
>   `null` aunque el nodo exista, con lo que R8.1 nacía verde (candado
>   tautológico). Toda consulta a esos nodos, también las negativas, lleva la
>   opción. Los recuentos no cambian.
> - **Casilla de R15** (tasks.md T15): el candado comparaba el bloque de
>   design.md §8 entero, con su `- [ ]`, y se habría puesto rojo en cuanto el
>   humano la marcara. Ahora compara el bloque sin la casilla y la comprueba
>   aparte con `[ xX]`, como #65 R19 y #167.
> - **Sonda S11.3**: su línea `Tests:` se anota y no se fija. Solo se exige
>   que R4.6 esté entre los `●`.
> - **Cadenas**: las cabeceras de sección son comentarios de shell
>   (`# -- … --`), cada cadena termina en su línea `git commit -m` seguida de
>   una línea en blanco, y el lint se guarda en fichero y se exige vacío (en
>   #168 y #169 un SIGKILL de eslint salió con 0).
>
> **Reanudación 1** (2026-10-12; el leader la commitea encima de H0, pero
> H0 sigue siendo `d01b03bf` en todos los `<H0>` del bloque):
> - **Parada**: el ALL de la base salió con exit=1, `Tests: 6 failed, 2769
>   passed, 2775 total`. Todos los rojos eran `Exceeded timeout of 5000 ms`
>   (o `waitFor was aborted by cleanup` como consecuencia) en
>   pairing/index.test.tsx y meal-schedule/index.test.tsx. El BASE, con
>   pairing dentro, había salido verde minutos antes.
> - **Causa**: carga, no código. El árbol de la app en H0 es idéntico a
>   `origin/main` (`git diff --stat origin/main..d01b03bf -- mobile-pet-tracker`
>   vacío), y el leader midió ese mismo ALL en verde. Entre las 18:44 y las
>   18:48, el Codex de #170 en Pet-Tracker-wt-170 corría su propio jest
>   (`/tmp/170-g8.txt`, 18:48:11) en una máquina de 4 CPU. El `pgrep` del
>   handoff solo detecta `init.sh`, no el jest de otro worktree.
> - **Corrección** (mecánica de test, no cambia requisitos): los 17
>   comandos ALL del bloque (el de la base, la plantilla de verdes, los 15
>   verdes y, por referencia, el del Cierre) llevan ahora
>   `--testTimeout=30000` detrás de `bunx jest`. Solo amplía el límite por
>   `it`: un cuelgue real sigue en rojo y ninguna aserción cambia. Las
>   medidas de rojos, las sondas, GUARDAS y BASE siguen con el límite por
>   defecto. El `init.sh` final del leader corre sin el flag.
> - **Lo que sigue siendo PARADA**: cualquier rojo en un ALL con el flag
>   nuevo. No se relanza un ALL para ver si sale verde la segunda vez.
> - **Al reanudar**: no repitas las comprobaciones de arranque. HEAD es el
>   commit de esta nota, hijo directo de `d01b03bf`, y solo toca este
>   handoff, que la lista cerrada ya excluye. `git status --short` debe dar
>   solo `?? progress/impl_mobile-celebrations-and-living-empty.md`. Sigue el
>   impl donde lo dejaste, con un apartado `## Reanudación 1`. Vuelve a correr
>   el ALL de la base con el comando nuevo. Si sale verde con 98/2775, sigue
>   con las anclas y c1.
>
> **Reanudación 2** (2026-10-12; el leader la commitea encima de c7
> `166f78c8` con `git commit --only`, H0 sigue siendo `d01b03bf`):
> - **Parada**: la medida de c8 salió `Tests: 2 failed, 96 passed, 98
>   total`. R6.3 «pieza 22» y R6.4 fallaron con `Unable to find an element
>   with testID`.
> - **Causa**: el test, no el código de c8. tasks.md y este handoff
>   prescribían `act(() => { jest.advanceTimersByTime(ms); })`, sin `await`
>   (error del leader). En RNTL 14 `act` es asíncrono: la forma síncrona deja
>   el scope abierto, y el `it` siguiente hace `await render(...)` sobre un
>   árbol que se queda vacío (`screen.toJSON() === null`). Por eso solo caen
>   los `it` que van detrás de uno que avanzó timers. El log lo delata con
>   «You called act(async () => ...) without await». El leader lo reprodujo
>   fuera del árbol con tu `celebration.tsx` de c8. Ni `screen.unmount()`,
>   ni `clearAllTimers`, ni `runOnlyPendingTimers`, ni timers falsos por
>   `describe` lo arreglan. Con `await act(async () => { … })` en los tres
>   `it` sale 20/20 verde.
> - **Corrección** (mecánica de test, no cambia requisitos ni recuentos):
>   la regla común de tasks.md y la fila R10.3 de T12 dicen ahora
>   `await act(async () => { jest.advanceTimersByTime(ms); })`; §Convenciones
>   de este bloque, igual. Esto vale para todo `it` que escribas desde
>   aquí (R7, R8, R10, R11).
> - **Commit nuevo c7.1**, entre c7 y c8 (bloque T3 de abajo). Aplica el
>   `sed` a las tres líneas de `celebration.test.tsx` y commitea solo ese
>   fichero. Así c7 conserva su rojo (R6.2-R6.4 caían por consulta, sin
>   que el `act` influyera) y la cadena de c8 queda tal cual. c7.1 no tiene
>   medida propia: la medida de c8 es su prueba.
> - **Al reanudar**: no repitas las comprobaciones de arranque. HEAD es el
>   commit de esta nota, hijo directo de `166f78c8`. `git status --short`
>   debe dar exactamente los tres ` M` de c8 (`celebration.tsx`, `motion.ts`,
>   `category-palette.ts`) y
>   `?? progress/impl_mobile-celebrations-and-living-empty.md`. No toques
>   los cambios de c8. Añade al impl un apartado `## Reanudación 2`, corre
>   la cadena de c7.1 y después c8 entera desde su medida (se espera
>   `Tests: 98 passed, 98 total`). Cualquier otra cifra es PARADA.

---

```
Worktree: /home/claude/sites/Pet-Tracker-wt-171   <- PRIMERA LINEA. Trabaja AQUI y en ningun otro sitio
Antes de tocar nada, ejecuta `pwd`, `git branch --show-current`,
`git rev-parse --short HEAD` y `git status --short` y pega las cuatro
salidas al principio de progress/impl_mobile-celebrations-and-living-empty.md.
El hash es H0 (el commit que anade este handoff). En todos los comandos de
abajo, sustituye `<H0>` por ese hash literal: todos los `git diff` se
miden contra el. PARA si la branch no es
feature/171-mobile-celebrations-and-living-empty o si `git status --short`
no sale vacio. No toques /home/claude/sites/Pet-Tracker,
Pet-Tracker-wt-166, Pet-Tracker-wt-168, Pet-Tracker-wt-169,
Pet-Tracker-wt-170 ni ningun otro worktree, ni cambies de branch en
ninguno.

Feature: mobile-celebrations-and-living-empty (#171)
Branch: feature/171-mobile-celebrations-and-living-empty
Spec aprobada: specs/mobile-celebrations-and-living-empty/requirements.md
(firma 1b20491c; enmienda E1 firmada en 82eda89f). Lee tambien, enteros:
specs/mobile-celebrations-and-living-empty/design.md, tasks.md y
traceability.md, y requirements.md hasta el final (E1 incluida). tasks.md
es tu guion (T1-T16, en el orden de ejecucion de abajo). Los titulos de
describe e it, las clases, el copy, la SECTION de T9 y el bloque de la
carta (design.md §8) son LITERALES: copialos tal cual, con sus tildes y
sus simbolos (`%s`, `→`, `—`, `¡`, `✓`, `×`).

== QUE HACES ==

Los 30 commits, en este orden exacto (el de tasks.md, que no es el de los
R-ids):
  c1-c2   T1  R1   pose celebrate (rojo, verde)
  c3-c4   T2  R2   componente Celebration (rojo, verde)
  c5-c6   T14 R14  botones con labio (rojo, verde)
  c7-c8   T3  R6   confeti (rojo, verde; c7.1 entre medias, Reanudacion 2)
  c9-c10  T4  R7   pop (rojo, verde)
  c11-c12 T5  R8   reduce motion (rojo, verde)
  c13-c14 T6  R9   haptico (rojo, verde)
  c15     T7  R13  candados de drift (nacen verdes, un solo commit)
  c16-c17 T8  R3   Vincular (rojo, verde)
  c18-c19 T9  R12  copy (rojo, verde)
  c20     T10+T11 (0) refactor del arnes de add-pet (verde)
  c21-c22 T10+T11 R4 y R5 primera mascota (rojo, verde)
  c23-c24 T12 R10  Pingo flota (rojo, verde)
  c25-c26 T13 R11  reduce motion en los vacios (rojo, verde)
  c27-c28 T15 R15  enmienda a la carta (rojo, verde)
  c29     trazabilidad
  c30     lista cerrada
Rojo SIEMPRE antes de su verde, en commits separados. Si escribes un verde
antes que su rojo, ese requisito nace verde y pierde su historial (C4 de
CHECKPOINTS.md); en #19 se metio todo en un solo commit y no vale.

Esto manda sobre tasks.md:
- «Suite entera antes de cada commit verde» (reglas comunes de tasks.md):
  va con el comando ALL de abajo (FORCE_COLOR=0, salida a fichero, pgrep
  antes) y su resultado entra en la cadena del verde.
- NO lances ./init.sh. Lo corre el leader (comparte Postgres y LocalStack
  con otras sesiones).
- Sondas: primero commiteas el verde que las nombra y DESPUES plantas cada
  sonda sobre ese HEAD, la mides y la reviertes. Asi `limpio=0` es
  verificable.
- Trazabilidad: traceability.md se rellena entera UNA vez, al final, en
  c29. Ningun commit de T1-T15 la toca (tasks.md dice «tras cada verde»:
  no aplica).
- El unico commit de refactor es c20 (tasks.md T10 + T11 (0)). Los
  «Refactor: nada» no generan commit. T2 (3) (extraer `DetailChip`) solo
  si el JSX pasa de ~120 lineas, y va DENTRO del verde c4, no en commit
  aparte.
- Mide con `FORCE_COLOR=0` delante de `bunx jest`, `--runTestsByPath` y
  la salida a un fichero, como en las cadenas de abajo.
- Typecheck y lint: `bun run typecheck` (es `tsc --noEmit`) y
  `bunx expo lint --no-cache > /tmp/171-cN-lint.txt 2>&1 && test ! -s /tmp/171-cN-lint.txt`
  (con el arbol limpio, expo lint no imprime nada: medido en H0, 0 bytes).
  Nunca `bun run lint` (usa la cache de eslint y en #155 dio un error
  obsoleto). Si un lint imprime `Failed to run "eslint" due to signal
  SIGKILL` (falta de memoria por otras sesiones; expo lint sale con 0 aun
  asi), no es un rojo del codigo: comprueba `pgrep -af '[i]nit\.sh'` vacio,
  espera 60 s y relanza la cadena entera. Como mucho dos reintentos; al
  tercer SIGKILL, PARA. Nunca `git reset` ni `--amend`.
- Cada cadena empieza en su primera linea de comando (`grep`, `test`,
  `git add`...) y TERMINA en su linea `git commit -m '...'`, seguida de una
  linea en blanco. Lo que va despues es prosa para ti: no se ejecuta.
  Las lineas `# -- ... --` son cabeceras de seccion (comentarios).
- La medida de cN son solo las lineas jest y `<GUARDAS>` que hay entre la
  linea `cN, ...` y la primera linea de su cadena. Cada control con nombre
  (sonda, parada) se compara con su propia `->`, nunca con la de otro.

== BASE ==

Primero, literal:
  cd /home/claude/sites/Pet-Tracker-wt-171/mobile-pet-tracker && pwd
  -> /home/claude/sites/Pet-Tracker-wt-171/mobile-pet-tracker
Todo lo de esta seccion, las anclas A y COMMITS va desde ahi. Las anclas
H y P y el final del CIERRE van desde la raiz
(`cd /home/claude/sites/Pet-Tracker-wt-171 && pwd`).

Error de invocacion: si un comando falla ANTES de que arranquen jest,
tsc o eslint (`No such file or directory`, `command not found`, un
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
  ALL de la base, el de cada verde y el del Cierre).

Variable de produccion, definela en la shell antes de las anclas y de
cada cadena que la use; sin comillas al usarla:
  PROD="--include=*.ts --include=*.tsx --exclude=*.test.ts --exclude=*.test.tsx --exclude-dir=__tests__"

Base medida por el leader el 2026-10-12 en este worktree con el arbol de
H0 (los tests no cambian desde 5fbe9eed), con el comando BASE (un solo
jest, FORCE_COLOR=0, sin pipe): exit=0, `Test Suites: 12 passed, 12 total`
y `Tests:       582 passed, 582 total`. Reparto por fichero:
  src/screens/welcome/index.test.tsx                     65
  src/screens/pairing/index.test.tsx                     54
  src/__tests__/ui-language.test.ts                      30
  src/screens/add-pet/index.test.tsx                     26
  src/providers/__tests__/language-provider.test.tsx     25
  src/components/__tests__/empty-state.test.tsx          95
  src/__tests__/design-drift.test.ts                     65
  src/__tests__/consistency-classnames.test.ts           63
  src/theme/__tests__/motion.test.ts                     12
  src/__tests__/legibility-classnames.test.ts            27
  src/utils/__tests__/category-palette.test.ts           12
  src/screens/docs/index.test.tsx                        108
Tu medida manda: repite el comando BASE y anota sus dos lineas en el
impl. Si el total no es 582 o algo nace rojo, mide fichero a fichero,
anota y PARA.

Comando BASE:
  FORCE_COLOR=0 bunx jest --runTestsByPath src/screens/welcome/index.test.tsx src/screens/pairing/index.test.tsx src/__tests__/ui-language.test.ts src/screens/add-pet/index.test.tsx src/providers/__tests__/language-provider.test.tsx src/components/__tests__/empty-state.test.tsx src/__tests__/design-drift.test.ts src/__tests__/consistency-classnames.test.ts src/theme/__tests__/motion.test.ts src/__tests__/legibility-classnames.test.ts src/utils/__tests__/category-palette.test.ts src/screens/docs/index.test.tsx > /tmp/171-base.txt 2>&1; echo "exit=$?"

Comando ALL (la suite entera; con `pgrep -af '[i]nit\.sh'` vacio antes y
sin lanzar nada mas mientras corre):
  FORCE_COLOR=0 bunx jest --testTimeout=30000 > /tmp/171-all-base.txt 2>&1; echo "exit=$?"
  -> exit=0. Copia al impl sus lineas `Test Suites:` y `Tests:`. Si exit
     no es 0, anota los `●` y PARA.
  ALL base (leader, H0): exit=0, `Test Suites: 98 passed, 98 total` y
  `Tests:       2775 passed, 2775 total`. Desde c1 hay un fichero de test
  nuevo (celebration.test.tsx): todos los ALL de los verdes esperan
  `Test Suites: 99 passed, 99 total`. Cierre esperado: 99 suites y 2856
  tests (2775 + 81).

Comando GUARDAS (los candados de carta; lo corre cada verde; 65 + 27 = 92
hasta c14 y 69 + 27 = 96 desde c15, que suma 4 `it` a design-drift):
  FORCE_COLOR=0 bunx jest --runTestsByPath src/__tests__/design-drift.test.ts src/__tests__/legibility-classnames.test.ts
En las cadenas aparece como `<GUARDAS> > /tmp/171-cN-guardas.txt 2>&1`.

== ANCLAS ==

Ejecutalas TODAS antes de tocar nada y copia la salida al impl. A1-A63
van desde mobile-pet-tracker/; H1-H5 desde la RAIZ. Son las de las reglas
comunes de tasks.md, design.md §2, §3, §4.1, §7, §9.2 y §9.3, y las de
cada bloque de tasks.md, ya en forma de comando. Solo estos comandos son
anclas; los numeros de linea no lo son. Si alguna no da EXACTAMENTE lo
esperado, PARA y avisa (ante una diferencia manda el fichero, no el
handoff). Cuando `grep -c` cuenta 0 sale con codigo 1: lo que vale es la
cifra impresa. El leader las ha ejecutado todas en H0 sacandolas de este
mismo fichero.

Reglas comunes y T1:
A1. grep -cF "return { ...actual, __esModule: true, useReducedMotion: () => mockUseReducedMotion(), withRepeat: jest.fn((animation: unknown) => animation) };" src/screens/welcome/index.test.tsx   -> 1
A2. grep -cF "jest.mock('expo-haptics', () => ({" 'src/app/(tabs)/__tests__/food.test.tsx'   -> 1
A3. grep -cF "declare function require(moduleName: '../motion'): Record<string, unknown>;" src/theme/__tests__/motion.test.ts   -> 1
A4. grep -cF "useSafeAreaInsets: () => ({ top: 40, right: 0, bottom: 24, left: 0 })," src/screens/pairing/index.test.tsx   -> 1
A5. grep -cF "expect(bytes.toString('ascii', 12, 16)).toBe('VP8X');" src/components/__tests__/empty-state.test.tsx   -> 1
A6. grep -cF "it('no mete otras poses de Pingo'" src/screens/welcome/index.test.tsx   -> 1
A7. ls assets/images | grep -cE '^(pingo|mascot)-'   -> 8
A8. sha256sum /home/claude/pet-tracker-mascot/webp/pingo-celebrate.webp   -> b8e9745f73dedc6d72f89a588046a7440f32df4b2e9685e70fa96a2b70e3a254 (si el sandbox deniega la lectura, PARA: el humano hara el `cp` de c2)
A9. test -e assets/images/pingo-celebrate.webp; echo "exit=$?"   -> exit=1
design.md §2, §3 y §4.1:
A10. grep -cF "queryFn: () => listPets(baseUrl, token ?? '')," src/screens/pairing/index.tsx   -> 1
A11. grep -cF 'testID="pairing-ready"' src/screens/pairing/index.tsx   -> 1
A12. grep -cF "<Celebration" src/screens/pairing/index.tsx   -> 0
A13. grep -cF "<Pressable" src/screens/pairing/index.tsx   -> 1
A14. grep -cF "router.push('/pairing')}" src/screens/home/index.tsx   -> 1
A15. for c in accent category-amber-strong category-violet-strong category-blue-strong category-rose-strong category-green-strong; do printf '%s ' "$c"; grep -cE -- "--color-$c:" src/theme/global.css; done   -> seis lineas, cada una terminada en 2
design.md §7:
A16. grep -cF "it('EmptyState solo importa de react, react-native, expo-image y heroui-native'" src/components/__tests__/empty-state.test.tsx   -> 1
A17. grep -cF "it('EmptyState no anima', ()" src/components/__tests__/empty-state.test.tsx   -> 1
A18. grep -cF "it('EmptyState importa exactamente Image, Button, Text y View'" src/components/__tests__/empty-state.test.tsx   -> 1
A19. grep -cF "it('EmptyState no anima con Animated, LayoutAnimation ni transiciones'" src/components/__tests__/empty-state.test.tsx   -> 1
A20. grep -cF "it('con acción pinta pose, título, cuerpo y botón como hijos directos, en ese orden'" src/components/__tests__/empty-state.test.tsx   -> 1
A21. grep -cF "it('sin acción pinta pose, título y cuerpo como hijos directos, en ese orden'" src/components/__tests__/empty-state.test.tsx   -> 1
A22. grep -cF "'docs-empty-pose', 'docs-empty-title', 'docs-empty-body'," src/screens/docs/index.test.tsx   -> 1
A23. grep -cF "expect(count(/style=\{CONTINUOUS_CORNER\}/g)).toBe(31 + 1);" src/__tests__/consistency-classnames.test.ts   -> 1
A24. grep -cF "[join('screens', 'pairing', 'index.tsx'), 2]," src/__tests__/consistency-classnames.test.ts   -> 1
A25. grep -cF "expect(count(/bg-accent-soft/g)).toBe(16 + 2 + 1);" src/__tests__/consistency-classnames.test.ts   -> 1
A26. grep -cF "expect(accentSoftCount).toBe(16 + 2 + 1);" src/__tests__/consistency-classnames.test.ts   -> 1
A27. grep -cF -- "- 1, // #159 R2" src/providers/__tests__/language-provider.test.tsx   -> 1
A28. grep -cF "export const R9_ADD_PET: UseRow[] = [" src/__tests__/ui-copy-table.ts   -> 1
A29. grep -cF "it('resuelve las 41 ocurrencias normativas'" src/__tests__/ui-language.test.ts   -> 1
A30. grep -cF "it('no exporta nada más'" src/theme/__tests__/motion.test.ts   -> 1
A31. grep -cF "it('centraliza las diez clases completas y prohíbe interpolarlas'" src/__tests__/consistency-classnames.test.ts   -> 1
A32. grep -cF "'text-category-rose-strong'," src/__tests__/consistency-classnames.test.ts   -> 1
A33. grep -cF "style={CONTINUOUS_CORNER}" src/screens/pairing/index.tsx   -> 2
A34. grep -cF "bg-accent-soft" src/screens/pairing/index.tsx   -> 2
design.md §9.2 (todas en src/__tests__/consistency-classnames.test.ts):
A35. grep -cF "it('inventaría los diecinueve primarios con labio, fichero a fichero'" src/__tests__/consistency-classnames.test.ts   -> 1
A36. grep -cF "[join('components', 'empty-state.tsx')]: 1," src/__tests__/consistency-classnames.test.ts   -> 1
A37. grep -cF "[join('screens', 'pairing', 'index.tsx')]: 2," src/__tests__/consistency-classnames.test.ts   -> 1
A38. grep -cF 'expect(count(/\bborder-b-4\b/g)).toBe(19);' src/__tests__/consistency-classnames.test.ts   -> 1
A39. grep -cF 'expect(count(/border-black\/25/g)).toBe(19);' src/__tests__/consistency-classnames.test.ts   -> 1
A40. grep -cF "expect(primaryRadius).toHaveLength(13 + 1 + 1 + 1 + 1 + 1 + 1);" src/__tests__/consistency-classnames.test.ts   -> 1
A41. grep -cF ".toBe(13 + 1 + 1 + 1 + 1 + 1 + 1);" src/__tests__/consistency-classnames.test.ts   -> 1
A42. grep -cF "it('inventaría los cuatro secundarios neutros de toda la app'" src/__tests__/consistency-classnames.test.ts   -> 1
A43. grep -cF 'return neutral ? [tag.match(/testID="([^"]+)"/)?.[1]] : [];' src/__tests__/consistency-classnames.test.ts   -> 1
A44. grep -cF "expect(count(/border-lip-gray/g)).toBe(4);" src/__tests__/consistency-classnames.test.ts   -> 1
A45. grep -cF 'expect(count(/\bborder-b-6\b/g)).toBe(4);' src/__tests__/consistency-classnames.test.ts   -> 1
A46. grep -cF "it.each(rows)('%s pinta %s con la receta del secundario en su tag de apertura'" src/__tests__/consistency-classnames.test.ts   -> 1
design.md §9.3:
A47. grep -cF -- '--color-lip-gray: ' src/theme/global.css   -> 2
A48. grep -cF '`rounded-xl bg-accent border-b-4 border-black/25`' ../docs/ui-guidelines.md   -> 1
A49. grep -cF '`rounded-xl border-2 border-b-6 border-lip-gray bg-surface`' ../docs/ui-guidelines.md   -> 1
A50. grep -cF "it('lleva el labio gris en el CTA secundario'" src/screens/welcome/index.test.tsx   -> 1
A51. grep -cF "it('declara el botón primario con labio'" src/components/__tests__/empty-state.test.tsx   -> 1
A52. grep -cF "it('declara el botón sin size ni variant'" src/components/__tests__/empty-state.test.tsx   -> 1
T8, T9, T10 + T11 y T15:
A53. grep -cF "expect(screen.getByTestId('ready-model')).toHaveTextContent('TrailTag Pro');" src/screens/pairing/index.test.tsx   -> 1
A54. grep -cF "async function renderReady(" src/screens/pairing/index.test.tsx   -> 1
A55. grep -cF "describe('R7: tras el 201 muestra" src/screens/pairing/index.test.tsx   -> 1
A56. grep -cF "describe('#95 R8: ver en el mapa desapila pairing'" src/screens/pairing/index.test.tsx   -> 1
A57. grep -cF "it('mantiene la base más las claves de #68 y los mismos marcadores en ambos idiomas'" src/providers/__tests__/language-provider.test.tsx   -> 1
A58. grep -cF "'addPet.savePet': 'Save pet'," src/i18n/catalog.ts   -> 1
A59. grep -cF "'addPet.savePet': 'Guardar mascota'," src/i18n/catalog.ts   -> 1
A60. grep -cF "jest.mock('../../api/pets', () => ({ createPet: jest.fn() }));" src/screens/add-pet/index.test.tsx   -> 1
A61. grep -cF "describe('R7: foto opcional tras alta'" src/screens/add-pet/index.test.tsx   -> 1
A62. grep -cF "it('posts selected fields, numeric months, and omits blank optionals'" src/screens/add-pet/index.test.tsx   -> 1
A63. grep -cF "it('uploads a chosen preview only after createPet succeeds'" src/screens/add-pet/index.test.tsx   -> 1
A64. grep -cF "export async function renderWithProviders(" test/render-with-providers.tsx   -> 1
A65. grep -cF '## Checklist de autocrítica' ../docs/ui-guidelines.md   -> 1
A66. grep -cF '## Enmienda #171' ../docs/ui-guidelines.md   -> 0
A67. grep -cF '### §2.23 — Añadidos por #159 — Pingo sin collar' ../specs/mobile-ui-language/design.md   -> 1
A68. grep -cF '| — | `home.activityNeedsCollar` |' ../specs/mobile-ui-language/design.md   -> 1
A69. grep -cF '### §2.24' ../specs/mobile-ui-language/design.md   -> 0
A70. grep -cF '## 3. La infraestructura' ../specs/mobile-ui-language/design.md   -> 1
Desde la raiz:
H1. grep -cF -- '- [x] Aprobado por humano (fecha: 2026-10-12)' specs/mobile-celebrations-and-living-empty/requirements.md   -> 1
H2. grep -cF -- '- [x] Enmienda E1 aprobada por humano (fecha: 2026-10-12)' specs/mobile-celebrations-and-living-empty/requirements.md   -> 1
H3. grep -cF -- '- [ ] R16: smoke en dev build de Android completado por humano (fecha: ____)' specs/mobile-celebrations-and-living-empty/requirements.md   -> 1
H4. grep -cF '"status": "in_progress"' feature_list.json   -> 1
H5. grep -rlF '#171' mobile-pet-tracker/src | wc -l   -> 0

Valores al cerrar (copialos al impl): A7 -> 9; A9 -> exit=0; A12 -> 1;
A13 -> 0; A16 -> 0; A17 -> 0; A18 -> 0; A19 -> 0; A22 -> 0; A23 -> 0;
A24 -> 0; A29 -> 0; A31 -> 0; A33 -> 1; A34 -> 1; A37 -> 0; A42 -> 0;
A43 -> 0; A66 -> 1; A69 -> 1. El resto de A y H1-H4, sin cambios, salvo
A25, A26, A38-A41, A44 y A45, que no se fijan (anota el valor). H5 no se
fija (anota el valor). Y en positivo al cerrar, desde la raiz:
  P1. cmp -s mobile-pet-tracker/assets/images/pingo-celebrate.webp /home/claude/pet-tracker-mascot/webp/pingo-celebrate.webp; echo "cmp=$?"   -> cmp=0
  P2. grep -cF 'export const CONFETTI_FILLS' mobile-pet-tracker/src/utils/category-palette.ts   -> 1
  P3. grep -cE '^export const MOTION_(POP_SCALE|POP_SPRING|CONFETTI_FALL_TIMING|CONFETTI_MIN_MS|CONFETTI_SPREAD_MS) = ' mobile-pet-tracker/src/theme/motion.ts   -> 5
  P4. grep -cF '<Celebration' mobile-pet-tracker/src/screens/pairing/index.tsx mobile-pet-tracker/src/screens/add-pet/index.tsx   -> las dos con :1
  P5. grep -cF "'addPet.celebrate" mobile-pet-tracker/src/i18n/catalog.ts   -> 8
  P6. grep -cF '### §2.24 — Añadidos por #171 — Celebraciones' specs/mobile-ui-language/design.md   -> 1
  P7. grep -cF '## Enmienda #171 — confeti de celebración' docs/ui-guidelines.md   -> 1
  P8. grep -cF "describe('#171 R" mobile-pet-tracker/src/components/__tests__/celebration.test.tsx   -> 9
  P9. grep -cF -- '        + 4 // #171 R12' mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx   -> 1
  P10. grep -cF "queryFn: () => listPets(baseUrl, token ?? '')," mobile-pet-tracker/src/screens/add-pet/index.tsx   -> 1

== COMMITS ==

Todo desde mobile-pet-tracker/ (el `cd` literal de BASE), con PROD
definida. Cada commit va ENCADENADO con && a su verificacion: si
cualquier eslabon falla, el commit no se hace. Nunca commitees fuera de
estas cadenas ni con un exit distinto de 0 en la cadena (en #115 se
commiteo un verde con el registrador en exit=1). Si una cadena no llega
al commit, PARA y reporta en el impl el eslabon que fallo y la salida.

Mide SIN pipe (`cmd | tail` devuelve el exit de tail). FORCE_COLOR=0 deja
la linea de resumen de jest en texto plano. Formato:
`Tests:       3 failed, 96 passed, 99 total` y en verde
`Tests:       99 passed, 99 total`. Cada medida lleva su
`echo "exit=$?"`; anota el exit en el impl.

Rojos: cada fila de tasks.md dice si su rojo es por ASERCION
(Expected/Received) o por CONSULTA (`Unable to find`). La cadena comprueba
la cuenta y el tipo: las que solo tienen rojos por asercion llevan
`! grep -qF 'Unable to find'`; las que tienen alguno por consulta no lo
llevan. Ninguna admite `Test suite failed to run`, ReferenceError,
SyntaxError ni `Cannot find module`, salvo c3 (el modulo ausente de T2,
con su cadena propia). TypeError tampoco, salvo en c9. Ademas abres el
log y copias al impl cada it rojo con su matcher y su Expected/Received.
Si un Received ocupa mas de 20 lineas, copia el matcher, el Expected y
las 20 primeras lineas del Received, y nada mas.

Typecheck y lint van en TODAS las cadenas, rojas incluidas, y dan exit 0
(salvo c3, que exige el error de modulo ausente).

Cada cadena termina igual, tras su `git add`: la lista exacta de lo
stageado y que no quede nada sin stagear en mobile-pet-tracker/, docs/
ni specs/ (el impl vive en progress/ sin trackear hasta el Cierre; no lo
stagees antes):
  git diff --quiet -- . ../docs ../specs && test -z "$(git ls-files --others --exclude-standard -- . ../docs ../specs)"
En las cadenas aparece como `<LIMPIO>`. NUNCA `git status --short` tras
un `git add`: falla siempre (lo stageado sale).

Verdes: antes de su cadena, cada verde corre (1) su medida, (2)
`<GUARDAS> > /tmp/171-cN-guardas.txt 2>&1; echo "exit=$?"`, (3)
`pgrep -af '[i]nit\.sh'` (vacio; si no, espera) y (4) el ALL:
`FORCE_COLOR=0 bunx jest --testTimeout=30000 > /tmp/171-cN-all.txt 2>&1; echo "exit=$?"`.
La cadena comprueba las tres salidas. Un rojo en el ALL fuera de los
ficheros de design.md §5 es PARADA (tasks.md, reglas comunes); un rojo
dentro, tambien.

Sondas: sobre el HEAD del commit que las nombra, UNA A UNA. Plantas la
mutacion, mides SOLO los ficheros de test que dice la sonda (salida a
/tmp/171-sN.txt), copias al impl la linea `Tests:` y los `●`, y reviertes:
  git checkout HEAD -- <fichero de la sonda>
  git diff --cached --quiet && git diff --quiet; echo "limpio=$?"   -> limpio=0
Nunca `git checkout <commit> -- <fichero>` (deja el cambio en el
indice). Si una sonda no da EXACTAMENTE su linea `Tests:` y sus `●`,
PARA; las que dicen «se anota» solo exigen que esten los `●` nombrados.
`●` son SOLO los encabezados de it rojo: Jest tambien imprime bloques
`  ● Console` (console.warn de Uniwind, console.info de HeroUI) que no
cuentan nunca, ni en sondas ni en rojos; se copian al impl sin filtrar.
Ninguna sonda se commitea.

# -- T1 R1: la pose celebrate --

c1, T1 rojo (tasks.md T1 (1): crea src/components/__tests__/celebration.test.tsx
con `describe('#171 R1: la pose celebrate')` y su it; en welcome, la lista
de `no mete otras poses de Pingo` pasa a la de nueve de tasks.md T1):
  FORCE_COLOR=0 bunx jest --runTestsByPath src/components/__tests__/celebration.test.tsx src/screens/welcome/index.test.tsx > /tmp/171-c1.txt 2>&1; echo "exit=$?"
    -> exit=1 y `Tests:       2 failed, 64 passed, 66 total` (R1.1 por la
       excepcion ENOENT, R1.2 por asercion)
  grep -qE '^Tests: +2 failed, 64 passed, 66 total$' /tmp/171-c1.txt \
    && test "$(grep -E '^  ● ' /tmp/171-c1.txt | grep -cvxF '  ● Console')" = 2 \
    && test "$(grep -E '^  ● ' /tmp/171-c1.txt | grep -cF '#171 R1: la pose celebrate')" = 1 \
    && test "$(grep -E '^  ● ' /tmp/171-c1.txt | grep -cF 'no mete otras poses de Pingo')" = 1 \
    && grep -qF 'ENOENT' /tmp/171-c1.txt \
    && ! grep -qE 'Test suite failed to run|TypeError|ReferenceError|SyntaxError|Cannot find module' /tmp/171-c1.txt \
    && test ! -e .expo/types/router.d.ts && bun run typecheck \
    && bunx expo lint --no-cache > /tmp/171-c1-lint.txt 2>&1 && test ! -s /tmp/171-c1-lint.txt \
    && git add src/components/__tests__/celebration.test.tsx src/screens/welcome/index.test.tsx \
    && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/components/__tests__/celebration.test.tsx mobile-pet-tracker/src/screens/welcome/index.test.tsx ' \
    && <LIMPIO> \
    && git commit -m 'test(mobile): falta la pose celebrate de Pingo (R1)'

c2, T1 verde (tasks.md T1 (2): solo el `cp`):
  cp /home/claude/pet-tracker-mascot/webp/pingo-celebrate.webp assets/images/pingo-celebrate.webp
  cmp -s assets/images/pingo-celebrate.webp /home/claude/pet-tracker-mascot/webp/pingo-celebrate.webp; echo "cmp=$?"   -> cmp=0
  (si el sandbox deniega el `cp` o la lectura, PARA y pide al humano que
  corra esas dos lineas)
  FORCE_COLOR=0 bunx jest --runTestsByPath src/components/__tests__/celebration.test.tsx src/screens/welcome/index.test.tsx > /tmp/171-c2.txt 2>&1; echo "exit=$?"
    -> exit=0 y `Tests:       66 passed, 66 total`
  <GUARDAS> > /tmp/171-c2-guardas.txt 2>&1; echo "exit=$?"
  pgrep -af '[i]nit\.sh'   -> vacio
  FORCE_COLOR=0 bunx jest --testTimeout=30000 > /tmp/171-c2-all.txt 2>&1; echo "exit=$?"
  grep -qE '^Tests: +66 passed, 66 total$' /tmp/171-c2.txt \
    && grep -qE '^Tests: +92 passed, 92 total$' /tmp/171-c2-guardas.txt \
    && grep -qE '^Test Suites: +99 passed, 99 total$' /tmp/171-c2-all.txt \
    && grep -qE '^Tests: +2776 passed, 2776 total$' /tmp/171-c2-all.txt \
    && cmp -s assets/images/pingo-celebrate.webp /home/claude/pet-tracker-mascot/webp/pingo-celebrate.webp \
    && test ! -e .expo/types/router.d.ts && bun run typecheck \
    && bunx expo lint --no-cache > /tmp/171-c2-lint.txt 2>&1 && test ! -s /tmp/171-c2-lint.txt \
    && git add assets/images/pingo-celebrate.webp \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/assets/images/pingo-celebrate.webp' \
    && <LIMPIO> \
    && git commit -m 'feat(mobile): pose celebrate de Pingo (R1)'

# -- T2 R2: el componente Celebration --

c3, T2 rojo (tasks.md T2 (1): `describe('#171 R2: Celebration')`, 12 it,
en celebration.test.tsx; el rojo es el de modulo ausente):
  FORCE_COLOR=0 bunx jest --runTestsByPath src/components/__tests__/celebration.test.tsx > /tmp/171-c3.txt 2>&1; echo "exit=$?"
    -> exit=1, `Test Suites: 1 failed, 1 total` y `Tests:       0 total`
  grep -qE '^Test Suites: +1 failed, 1 total$' /tmp/171-c3.txt \
    && grep -qE '^Tests: +0 total$' /tmp/171-c3.txt \
    && grep -qF "Cannot find module '../celebration' from 'src/components/__tests__/celebration.test.tsx'" /tmp/171-c3.txt \
    && test ! -e .expo/types/router.d.ts \
    && ! bun run typecheck > /tmp/171-c3-tsc.txt 2>&1 \
    && test "$(grep -c 'error TS' /tmp/171-c3-tsc.txt)" = 1 \
    && test "$(grep -cF 'error TS2307' /tmp/171-c3-tsc.txt)" = 1 \
    && grep -qF 'celebration.test.tsx' /tmp/171-c3-tsc.txt \
    && ! bunx expo lint --no-cache > /tmp/171-c3-lint.txt 2>&1 \
    && grep -qF '✖ 1 problem (1 error, 0 warnings)' /tmp/171-c3-lint.txt \
    && grep -qF "Unable to resolve path to module '../celebration'" /tmp/171-c3-lint.txt \
    && git add src/components/__tests__/celebration.test.tsx \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/components/__tests__/celebration.test.tsx' \
    && <LIMPIO> \
    && git commit -m 'test(mobile): falta el componente Celebration (R2)'

c4, T2 verde (tasks.md T2 (2): src/components/celebration.tsx con la
composicion de design.md §3; capa de confeti vacia y siempre pintada;
pingo y badge `Animated.View` estaticos; botones
`className="min-h-11 w-full rounded-xl"`, sin `bg-accent` ni `variant`):
  FORCE_COLOR=0 bunx jest --runTestsByPath src/components/__tests__/celebration.test.tsx > /tmp/171-c4.txt 2>&1; echo "exit=$?"
    -> exit=0 y `Tests:       13 passed, 13 total`
  <GUARDAS> > /tmp/171-c4-guardas.txt 2>&1; echo "exit=$?"
  pgrep -af '[i]nit\.sh'   -> vacio
  FORCE_COLOR=0 bunx jest --testTimeout=30000 > /tmp/171-c4-all.txt 2>&1; echo "exit=$?"
  grep -qE '^Tests: +13 passed, 13 total$' /tmp/171-c4.txt \
    && grep -qE '^Tests: +92 passed, 92 total$' /tmp/171-c4-guardas.txt \
    && grep -qE '^Test Suites: +99 passed, 99 total$' /tmp/171-c4-all.txt \
    && grep -qE '^Tests: +2788 passed, 2788 total$' /tmp/171-c4-all.txt \
    && test ! -e .expo/types/router.d.ts && bun run typecheck \
    && bunx expo lint --no-cache > /tmp/171-c4-lint.txt 2>&1 && test ! -s /tmp/171-c4-lint.txt \
    && git add src/components/celebration.tsx \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/components/celebration.tsx' \
    && <LIMPIO> \
    && git commit -m 'feat(mobile): componente Celebration (R2)'

  Si el ALL sale rojo en algun inventario de consistency-classnames por
  las clases provisionales, PARA y reportalo; no lo ajustes (tasks.md T2).

# -- T14 R14: botones con labio --

c5, T14 rojo (tasks.md T14 (1): `describe('#171 R14: botones con labio')`
con 2 it en celebration.test.tsx; en consistency-classnames.test.ts, los
seis cambios de la columna «T14» de design.md §9.2, con `// #171 R14`;
el titulo de A42 pasa a `cinco`):
  FORCE_COLOR=0 bunx jest --runTestsByPath src/components/__tests__/celebration.test.tsx src/__tests__/consistency-classnames.test.ts > /tmp/171-c5.txt 2>&1; echo "exit=$?"
    -> exit=1 y `Tests:       7 failed, 71 passed, 78 total`, todos por asercion
  grep -qE '^Tests: +7 failed, 71 passed, 78 total$' /tmp/171-c5.txt \
    && test "$(grep -E '^  ● ' /tmp/171-c5.txt | grep -cvxF '  ● Console')" = 7 \
    && test "$(grep -E '^  ● ' /tmp/171-c5.txt | grep -cF '#171 R14: botones con labio')" = 2 \
    && test "$(grep -E '^  ● ' /tmp/171-c5.txt | grep -cF 'deja todos los botones primarios sólidos en un único radio')" = 1 \
    && test "$(grep -E '^  ● ' /tmp/171-c5.txt | grep -cF 'deja CONTINUOUS_CORNER, bg-accent-soft y el acento donde estaban')" = 1 \
    && test "$(grep -E '^  ● ' /tmp/171-c5.txt | grep -cF 'inventaría los diecinueve primarios con labio, fichero a fichero')" = 1 \
    && test "$(grep -E '^  ● ' /tmp/171-c5.txt | grep -cF 'no deja la receta del labio fuera de un primario')" = 1 \
    && test "$(grep -E '^  ● ' /tmp/171-c5.txt | grep -cF 'inventaría los cinco secundarios neutros de toda la app')" = 1 \
    && ! grep -qE 'Test suite failed to run|TypeError|ReferenceError|SyntaxError|Cannot find module' /tmp/171-c5.txt \
    && ! grep -qF 'Unable to find' /tmp/171-c5.txt \
    && test ! -e .expo/types/router.d.ts && bun run typecheck \
    && bunx expo lint --no-cache > /tmp/171-c5-lint.txt 2>&1 && test ! -s /tmp/171-c5-lint.txt \
    && git add src/components/__tests__/celebration.test.tsx src/__tests__/consistency-classnames.test.ts \
    && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts mobile-pet-tracker/src/components/__tests__/celebration.test.tsx ' \
    && <LIMPIO> \
    && git commit -m 'test(mobile): los botones de la celebración llevan labio (R14)'

c6, T14 verde (tasks.md T14 (2): las clases de R14.1 y R14.2 en
celebration.tsx, y nada mas):
  FORCE_COLOR=0 bunx jest --runTestsByPath src/components/__tests__/celebration.test.tsx src/__tests__/consistency-classnames.test.ts > /tmp/171-c6.txt 2>&1; echo "exit=$?"
    -> exit=0 y `Tests:       78 passed, 78 total`
  <GUARDAS> > /tmp/171-c6-guardas.txt 2>&1; echo "exit=$?"
  pgrep -af '[i]nit\.sh'   -> vacio
  FORCE_COLOR=0 bunx jest --testTimeout=30000 > /tmp/171-c6-all.txt 2>&1; echo "exit=$?"
  grep -qE '^Tests: +78 passed, 78 total$' /tmp/171-c6.txt \
    && grep -qE '^Tests: +92 passed, 92 total$' /tmp/171-c6-guardas.txt \
    && grep -qE '^Test Suites: +99 passed, 99 total$' /tmp/171-c6-all.txt \
    && grep -qE '^Tests: +2790 passed, 2790 total$' /tmp/171-c6-all.txt \
    && test "$(grep -cF 'min-h-11 w-full rounded-xl bg-accent border-b-4 border-black/25' src/components/celebration.tsx)" = 1 \
    && test "$(grep -cF 'min-h-11 w-full rounded-xl border-2 border-b-6 border-lip-gray bg-surface' src/components/celebration.tsx)" = 1 \
    && test ! -e .expo/types/router.d.ts && bun run typecheck \
    && bunx expo lint --no-cache > /tmp/171-c6-lint.txt 2>&1 && test ! -s /tmp/171-c6-lint.txt \
    && git add src/components/celebration.tsx \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/components/celebration.tsx' \
    && <LIMPIO> \
    && git commit -m 'feat(mobile): labio en los botones de la celebración (R14)'

# -- T3 R6: confeti --

c7, T3 rojo (tasks.md T3 (1): `describe('#171 R6: confeti')` con 5 it en
celebration.test.tsx; 3 it nuevos en motion.test.ts, uno por constante,
mas los tres nombres en `no exporta nada más`; en consistency, el cambio
de #64 R9 de design.md §7 (E1), con el titulo `quince`):
  FORCE_COLOR=0 bunx jest --runTestsByPath src/components/__tests__/celebration.test.tsx src/theme/__tests__/motion.test.ts src/__tests__/consistency-classnames.test.ts > /tmp/171-c7.txt 2>&1; echo "exit=$?"
    -> exit=1 y `Tests:       10 failed, 88 passed, 98 total` (R6.2-R6.4
       por consulta, el resto por asercion)
  grep -qE '^Tests: +10 failed, 88 passed, 98 total$' /tmp/171-c7.txt \
    && test "$(grep -E '^  ● ' /tmp/171-c7.txt | grep -cvxF '  ● Console')" = 10 \
    && test "$(grep -E '^  ● ' /tmp/171-c7.txt | grep -cF '#171 R6: confeti')" = 5 \
    && test "$(grep -E '^  ● ' /tmp/171-c7.txt | grep -cF 'no exporta nada más')" = 1 \
    && test "$(grep -E '^  ● ' /tmp/171-c7.txt | grep -cF 'centraliza las quince clases completas y prohíbe interpolarlas')" = 1 \
    && ! grep -qE 'Test suite failed to run|TypeError|ReferenceError|SyntaxError|Cannot find module' /tmp/171-c7.txt \
    && test ! -e .expo/types/router.d.ts && bun run typecheck \
    && bunx expo lint --no-cache > /tmp/171-c7-lint.txt 2>&1 && test ! -s /tmp/171-c7-lint.txt \
    && git add src/components/__tests__/celebration.test.tsx src/theme/__tests__/motion.test.ts src/__tests__/consistency-classnames.test.ts \
    && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts mobile-pet-tracker/src/components/__tests__/celebration.test.tsx mobile-pet-tracker/src/theme/__tests__/motion.test.ts ' \
    && <LIMPIO> \
    && git commit -m 'test(mobile): confeti de la celebración (R6)'

c7.1, correccion de la Reanudacion 2 (solo celebration.test.tsx; los
cambios de produccion de c8 siguen sin stagear y no entran):
  sed -i 's/^    act(() => { jest\.advanceTimersByTime(\([0-9]*\)); });$/    await act(async () => { jest.advanceTimersByTime(\1); });/' src/components/__tests__/celebration.test.tsx
  test "$(grep -cF 'await act(async () => { jest.advanceTimersByTime(' src/components/__tests__/celebration.test.tsx)" = 3 \
    && test "$(grep -cE '^ +act\(' src/components/__tests__/celebration.test.tsx)" = 0 \
    && test "$(git diff --numstat -- src/components/__tests__/celebration.test.tsx | cut -f1,2 | tr '\t' ' ')" = '3 3' \
    && test ! -e .expo/types/router.d.ts && bun run typecheck \
    && bunx expo lint --no-cache > /tmp/171-c7_1-lint.txt 2>&1 && test ! -s /tmp/171-c7_1-lint.txt \
    && git add src/components/__tests__/celebration.test.tsx \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/components/__tests__/celebration.test.tsx' \
    && git commit -m 'test(mobile): el confeti espera a act (R6)'

c8, T3 verde (tasks.md T3 (2): `ConfettiPiece` y las tres constantes de
confeti de design.md §4.1 y §4.4 en motion.ts, y `CONFETTI_FILLS` al final
de src/utils/category-palette.ts con el bloque literal de §4.1):
  FORCE_COLOR=0 bunx jest --runTestsByPath src/components/__tests__/celebration.test.tsx src/theme/__tests__/motion.test.ts src/__tests__/consistency-classnames.test.ts > /tmp/171-c8.txt 2>&1; echo "exit=$?"
    -> exit=0 y `Tests:       98 passed, 98 total`
  <GUARDAS> > /tmp/171-c8-guardas.txt 2>&1; echo "exit=$?"
  pgrep -af '[i]nit\.sh'   -> vacio
  FORCE_COLOR=0 bunx jest --testTimeout=30000 > /tmp/171-c8-all.txt 2>&1; echo "exit=$?"
  grep -qE '^Tests: +98 passed, 98 total$' /tmp/171-c8.txt \
    && grep -qE '^Tests: +92 passed, 92 total$' /tmp/171-c8-guardas.txt \
    && grep -qE '^Test Suites: +99 passed, 99 total$' /tmp/171-c8-all.txt \
    && grep -qE '^Tests: +2798 passed, 2798 total$' /tmp/171-c8-all.txt \
    && test "$(grep -cF 'export const CONFETTI_FILLS' src/utils/category-palette.ts)" = 1 \
    && test "$(grep -cF 'rounded-sm' src/components/celebration.tsx)" = 0 \
    && test ! -e .expo/types/router.d.ts && bun run typecheck \
    && bunx expo lint --no-cache > /tmp/171-c8-lint.txt 2>&1 && test ! -s /tmp/171-c8-lint.txt \
    && git add src/components/celebration.tsx src/theme/motion.ts src/utils/category-palette.ts \
    && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/components/celebration.tsx mobile-pet-tracker/src/theme/motion.ts mobile-pet-tracker/src/utils/category-palette.ts ' \
    && <LIMPIO> \
    && git commit -m 'feat(mobile): confeti de una sola pasada (R6)'

# -- T4 R7: pop --

c9, T4 rojo (tasks.md T4 (1): `describe('#171 R7: pop')` con 5 it en
celebration.test.tsx; 2 it en motion.test.ts y los dos nombres en
`no exporta nada más`):
  FORCE_COLOR=0 bunx jest --runTestsByPath src/components/__tests__/celebration.test.tsx src/theme/__tests__/motion.test.ts > /tmp/171-c9.txt 2>&1; echo "exit=$?"
    -> exit=1 y `Tests:       8 failed, 34 passed, 42 total`, por asercion
       (si `getAnimatedStyle` lanza, se anota en el impl y vale igual)
  grep -qE '^Tests: +8 failed, 34 passed, 42 total$' /tmp/171-c9.txt \
    && test "$(grep -E '^  ● ' /tmp/171-c9.txt | grep -cvxF '  ● Console')" = 8 \
    && test "$(grep -E '^  ● ' /tmp/171-c9.txt | grep -cF '#171 R7: pop')" = 5 \
    && test "$(grep -E '^  ● ' /tmp/171-c9.txt | grep -cF 'no exporta nada más')" = 1 \
    && ! grep -qE 'Test suite failed to run|ReferenceError|SyntaxError|Cannot find module' /tmp/171-c9.txt \
    && ! grep -qF 'Unable to find' /tmp/171-c9.txt \
    && test ! -e .expo/types/router.d.ts && bun run typecheck \
    && bunx expo lint --no-cache > /tmp/171-c9-lint.txt 2>&1 && test ! -s /tmp/171-c9-lint.txt \
    && git add src/components/__tests__/celebration.test.tsx src/theme/__tests__/motion.test.ts \
    && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/components/__tests__/celebration.test.tsx mobile-pet-tracker/src/theme/__tests__/motion.test.ts ' \
    && <LIMPIO> \
    && git commit -m 'test(mobile): pop de Pingo y la insignia (R7)'

c10, T4 verde (tasks.md T4 (2): el pop de design.md §4.2 SIN mirar reduce
motion, y las dos constantes de pop de §4.4):
  FORCE_COLOR=0 bunx jest --runTestsByPath src/components/__tests__/celebration.test.tsx src/theme/__tests__/motion.test.ts > /tmp/171-c10.txt 2>&1; echo "exit=$?"
    -> exit=0 y `Tests:       42 passed, 42 total`
  <GUARDAS> > /tmp/171-c10-guardas.txt 2>&1; echo "exit=$?"
  pgrep -af '[i]nit\.sh'   -> vacio
  FORCE_COLOR=0 bunx jest --testTimeout=30000 > /tmp/171-c10-all.txt 2>&1; echo "exit=$?"
  grep -qE '^Tests: +42 passed, 42 total$' /tmp/171-c10.txt \
    && grep -qE '^Tests: +92 passed, 92 total$' /tmp/171-c10-guardas.txt \
    && grep -qE '^Test Suites: +99 passed, 99 total$' /tmp/171-c10-all.txt \
    && grep -qE '^Tests: +2805 passed, 2805 total$' /tmp/171-c10-all.txt \
    && test ! -e .expo/types/router.d.ts && bun run typecheck \
    && bunx expo lint --no-cache > /tmp/171-c10-lint.txt 2>&1 && test ! -s /tmp/171-c10-lint.txt \
    && git add src/components/celebration.tsx src/theme/motion.ts \
    && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/components/celebration.tsx mobile-pet-tracker/src/theme/motion.ts ' \
    && <LIMPIO> \
    && git commit -m 'feat(mobile): pop de Pingo y la insignia (R7)'

# -- T5 R8: reduce motion en la celebracion --

c11, T5 rojo (tasks.md T5 (1): `describe('#171 R8: reduce motion')`, 6 it;
4 rojos por asercion y 2 que nacen verdes por T4):
  FORCE_COLOR=0 bunx jest --runTestsByPath src/components/__tests__/celebration.test.tsx > /tmp/171-c11.txt 2>&1; echo "exit=$?"
    -> exit=1 y `Tests:       4 failed, 27 passed, 31 total`
  grep -qE '^Tests: +4 failed, 27 passed, 31 total$' /tmp/171-c11.txt \
    && test "$(grep -E '^  ● ' /tmp/171-c11.txt | grep -cvxF '  ● Console')" = 4 \
    && test "$(grep -E '^  ● ' /tmp/171-c11.txt | grep -cF '#171 R8: reduce motion')" = 4 \
    && ! grep -qE 'Test suite failed to run|TypeError|ReferenceError|SyntaxError|Cannot find module' /tmp/171-c11.txt \
    && ! grep -qF 'Unable to find' /tmp/171-c11.txt \
    && test ! -e .expo/types/router.d.ts && bun run typecheck \
    && bunx expo lint --no-cache > /tmp/171-c11-lint.txt 2>&1 && test ! -s /tmp/171-c11-lint.txt \
    && git add src/components/__tests__/celebration.test.tsx \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/components/__tests__/celebration.test.tsx' \
    && <LIMPIO> \
    && git commit -m 'test(mobile): la celebración respeta reduce motion (R8)'

c12, T5 verde (tasks.md T5 (2): `useReducedMotion()`, capa de confeti
condicionada a `!reduceMotion`, escala inicial y muelle de §4.2):
  FORCE_COLOR=0 bunx jest --runTestsByPath src/components/__tests__/celebration.test.tsx > /tmp/171-c12.txt 2>&1; echo "exit=$?"
    -> exit=0 y `Tests:       31 passed, 31 total`
  <GUARDAS> > /tmp/171-c12-guardas.txt 2>&1; echo "exit=$?"
  pgrep -af '[i]nit\.sh'   -> vacio
  FORCE_COLOR=0 bunx jest --testTimeout=30000 > /tmp/171-c12-all.txt 2>&1; echo "exit=$?"
  grep -qE '^Tests: +31 passed, 31 total$' /tmp/171-c12.txt \
    && grep -qE '^Tests: +92 passed, 92 total$' /tmp/171-c12-guardas.txt \
    && grep -qE '^Test Suites: +99 passed, 99 total$' /tmp/171-c12-all.txt \
    && grep -qE '^Tests: +2811 passed, 2811 total$' /tmp/171-c12-all.txt \
    && test ! -e .expo/types/router.d.ts && bun run typecheck \
    && bunx expo lint --no-cache > /tmp/171-c12-lint.txt 2>&1 && test ! -s /tmp/171-c12-lint.txt \
    && git add src/components/celebration.tsx \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/components/celebration.tsx' \
    && <LIMPIO> \
    && git commit -m 'feat(mobile): la celebración respeta reduce motion (R8)'

  Despues, las sondas de tasks.md T5 (las filas que nacen verdes), sobre
  src/components/celebration.tsx, midiendo solo celebration.test.tsx:
    S5.1  borra la linea `pingoOpacity.set(withTiming(1, MOTION_FADE_TIMING));`
          (o la equivalente de tu codigo: Pingo se queda en opacidad 0)
          -> `Tests:       2 failed, 29 passed, 31 total`; un `●` de
             `#171 R7: pop` (los 2000 ms de Pingo) y uno de
             `#171 R8: reduce motion` (los 2000 ms de Pingo)
    S5.2  quita el `withDelay(MOTION_SURFACE_MS, …)` de la opacidad de la
          insignia (queda `withTiming(1, MOTION_FADE_TIMING)`)
          -> `Tests:       2 failed, 29 passed, 31 total`; un `●` de
             `#171 R7: pop` (los 300 ms de la insignia) y uno de
             `#171 R8: reduce motion` (los 300 ms de la insignia)

# -- T6 R9: haptico --

c13, T6 rojo (tasks.md T6 (1): `describe('#171 R9: háptico')`, 3 it por
asercion):
  FORCE_COLOR=0 bunx jest --runTestsByPath src/components/__tests__/celebration.test.tsx > /tmp/171-c13.txt 2>&1; echo "exit=$?"
    -> exit=1 y `Tests:       3 failed, 31 passed, 34 total`
  grep -qE '^Tests: +3 failed, 31 passed, 34 total$' /tmp/171-c13.txt \
    && test "$(grep -E '^  ● ' /tmp/171-c13.txt | grep -cvxF '  ● Console')" = 3 \
    && test "$(grep -E '^  ● ' /tmp/171-c13.txt | grep -cF '#171 R9: háptico')" = 3 \
    && ! grep -qE 'Test suite failed to run|TypeError|ReferenceError|SyntaxError|Cannot find module' /tmp/171-c13.txt \
    && ! grep -qF 'Unable to find' /tmp/171-c13.txt \
    && test ! -e .expo/types/router.d.ts && bun run typecheck \
    && bunx expo lint --no-cache > /tmp/171-c13-lint.txt 2>&1 && test ! -s /tmp/171-c13-lint.txt \
    && git add src/components/__tests__/celebration.test.tsx \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/components/__tests__/celebration.test.tsx' \
    && <LIMPIO> \
    && git commit -m 'test(mobile): háptico de éxito al celebrar (R9)'

c14, T6 verde (tasks.md T6 (2): el efecto de design.md §4.3, declarado
antes del efecto del pop):
  FORCE_COLOR=0 bunx jest --runTestsByPath src/components/__tests__/celebration.test.tsx > /tmp/171-c14.txt 2>&1; echo "exit=$?"
    -> exit=0 y `Tests:       34 passed, 34 total`
  <GUARDAS> > /tmp/171-c14-guardas.txt 2>&1; echo "exit=$?"
  pgrep -af '[i]nit\.sh'   -> vacio
  FORCE_COLOR=0 bunx jest --testTimeout=30000 > /tmp/171-c14-all.txt 2>&1; echo "exit=$?"
  grep -qE '^Tests: +34 passed, 34 total$' /tmp/171-c14.txt \
    && grep -qE '^Tests: +92 passed, 92 total$' /tmp/171-c14-guardas.txt \
    && grep -qE '^Test Suites: +99 passed, 99 total$' /tmp/171-c14-all.txt \
    && grep -qE '^Tests: +2814 passed, 2814 total$' /tmp/171-c14-all.txt \
    && test "$(grep -cF "import { NotificationFeedbackType, notificationAsync } from 'expo-haptics';" src/components/celebration.tsx)" = 1 \
    && test ! -e .expo/types/router.d.ts && bun run typecheck \
    && bunx expo lint --no-cache > /tmp/171-c14-lint.txt 2>&1 && test ! -s /tmp/171-c14-lint.txt \
    && git add src/components/celebration.tsx \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/components/celebration.tsx' \
    && <LIMPIO> \
    && git commit -m 'feat(mobile): háptico de éxito al celebrar (R9)'

# -- T7 R13: sin drift (nace verde) --

c15, T7 (tasks.md T7 (1): `describe('#171 R13: sin drift en la celebración')`
con 4 it al final de design-drift.test.ts, y
`describe('#171 R13: solo anima transform y opacity')` con 1 it en
celebration.test.tsx; un solo commit, con la suite verde):
  FORCE_COLOR=0 bunx jest --runTestsByPath src/__tests__/design-drift.test.ts src/components/__tests__/celebration.test.tsx > /tmp/171-c15.txt 2>&1; echo "exit=$?"
    -> exit=0 y `Tests:       104 passed, 104 total`
  <GUARDAS> > /tmp/171-c15-guardas.txt 2>&1; echo "exit=$?"
  pgrep -af '[i]nit\.sh'   -> vacio
  FORCE_COLOR=0 bunx jest --testTimeout=30000 > /tmp/171-c15-all.txt 2>&1; echo "exit=$?"
  grep -qE '^Tests: +104 passed, 104 total$' /tmp/171-c15.txt \
    && grep -qE '^Tests: +96 passed, 96 total$' /tmp/171-c15-guardas.txt \
    && grep -qE '^Test Suites: +99 passed, 99 total$' /tmp/171-c15-all.txt \
    && grep -qE '^Tests: +2819 passed, 2819 total$' /tmp/171-c15-all.txt \
    && test ! -e .expo/types/router.d.ts && bun run typecheck \
    && bunx expo lint --no-cache > /tmp/171-c15-lint.txt 2>&1 && test ! -s /tmp/171-c15-lint.txt \
    && git add src/__tests__/design-drift.test.ts src/components/__tests__/celebration.test.tsx \
    && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/__tests__/design-drift.test.ts mobile-pet-tracker/src/components/__tests__/celebration.test.tsx ' \
    && <LIMPIO> \
    && git commit -m 'test(mobile): candados de drift de la celebración (R13)'

  Si algun it de R13 nace rojo, es un bug de T2-T6: PARA y reportalo.
  Despues, las sondas de tasks.md T7, sobre src/components/celebration.tsx
  (la linea `Tests:` se anota; se exige el `●` nombrado):
    S7.1  `#ffffff` dentro de un className cualquiera, midiendo
          design-drift.test.ts -> entre los `●`, el it de R13.1 de
          `src/components/celebration.tsx`
    S7.2  una linea final `// withRepeat(`, midiendo design-drift.test.ts
          -> entre los `●`, el it de R13.2 (fuente)
    S7.3  `width: progress` en el `useAnimatedStyle` de la pieza de
          confeti, midiendo celebration.test.tsx -> entre los `●`, uno de
          `#171 R13: solo anima transform y opacity`

# -- T8 R3: Vincular --

c16, T8 rojo (tasks.md T8 (1): el doble de expo-haptics y
`describe('#171 R3: celebración al vincular')` ANIDADO al final del
describe de R7, tras el de `#95 R8` (A55, A56); 7 it, 6 rojos):
  FORCE_COLOR=0 bunx jest --runTestsByPath src/screens/pairing/index.test.tsx > /tmp/171-c16.txt 2>&1; echo "exit=$?"
    -> exit=1 y `Tests:       6 failed, 55 passed, 61 total` (R3.1 x3 y
       R3.2 por consulta; R3.3 y el haptico por asercion; R3.4 nace verde)
  grep -qE '^Tests: +6 failed, 55 passed, 61 total$' /tmp/171-c16.txt \
    && test "$(grep -E '^  ● ' /tmp/171-c16.txt | grep -cvxF '  ● Console')" = 6 \
    && test "$(grep -E '^  ● ' /tmp/171-c16.txt | grep -cF '#171 R3: celebración al vincular')" = 6 \
    && ! grep -qE 'Test suite failed to run|TypeError|ReferenceError|SyntaxError|Cannot find module' /tmp/171-c16.txt \
    && test ! -e .expo/types/router.d.ts && bun run typecheck \
    && bunx expo lint --no-cache > /tmp/171-c16-lint.txt 2>&1 && test ! -s /tmp/171-c16-lint.txt \
    && git add src/screens/pairing/index.test.tsx \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/screens/pairing/index.test.tsx' \
    && <LIMPIO> \
    && git commit -m 'test(mobile): Vincular celebra el collar listo (R3)'

c17, T8 verde (tasks.md T8 (2): design.md §3.1 en pairing/index.tsx; en el
mismo commit, en consistency-classnames.test.ts, los candados de §7
(A23, A24, A25, A26) y la columna «T8» de §9.2, con sus comentarios
`// #171 R3`):
  FORCE_COLOR=0 bunx jest --runTestsByPath src/screens/pairing/index.test.tsx src/__tests__/consistency-classnames.test.ts > /tmp/171-c17.txt 2>&1; echo "exit=$?"
    -> exit=0 y `Tests:       124 passed, 124 total`
  <GUARDAS> > /tmp/171-c17-guardas.txt 2>&1; echo "exit=$?"
  pgrep -af '[i]nit\.sh'   -> vacio
  FORCE_COLOR=0 bunx jest --testTimeout=30000 > /tmp/171-c17-all.txt 2>&1; echo "exit=$?"
  grep -qE '^Tests: +124 passed, 124 total$' /tmp/171-c17.txt \
    && grep -qE '^Tests: +96 passed, 96 total$' /tmp/171-c17-guardas.txt \
    && grep -qE '^Test Suites: +99 passed, 99 total$' /tmp/171-c17-all.txt \
    && grep -qE '^Tests: +2826 passed, 2826 total$' /tmp/171-c17-all.txt \
    && test "$(grep -cF '<Celebration' src/screens/pairing/index.tsx)" = 1 \
    && test "$(grep -cF '<Pressable' src/screens/pairing/index.tsx)" = 0 \
    && test "$(grep -cF 'style={CONTINUOUS_CORNER}' src/screens/pairing/index.tsx)" = 1 \
    && test "$(grep -cF 'bg-accent-soft' src/screens/pairing/index.tsx)" = 1 \
    && test ! -e .expo/types/router.d.ts && bun run typecheck \
    && bunx expo lint --no-cache > /tmp/171-c17-lint.txt 2>&1 && test ! -s /tmp/171-c17-lint.txt \
    && git add src/screens/pairing/index.tsx src/__tests__/consistency-classnames.test.ts \
    && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts mobile-pet-tracker/src/screens/pairing/index.tsx ' \
    && <LIMPIO> \
    && git commit -m 'feat(mobile): Vincular celebra el collar listo (R3)'

  Parada de tasks.md T8: si algun it existente de Vincular cuelga, excede
  su timeout o avisa de handles abiertos, PARA; no anadas temporizadores
  falsos ni mocks a los it existentes.
  Despues, la sonda de tasks.md T8 (corregida en H0), sobre
  src/screens/pairing/index.tsx, midiendo solo pairing/index.test.tsx:
    S8.1  en `case 'error':` / `case 'missing-config':`, justo despues de
          `setActionError(t('common.somethingWentWrong'));`, anade
          `setReadyDevice({} as never); setPhase('ready');`
          -> `Tests:       5 failed, 56 passed, 61 total`: uno de
             `#171 R3: celebración al vincular` (R3.4), dos de
             `R5: sin collar muestra el formulario de vinculación y publica el claim solo al enviar`
             y dos de `R6: el claim mapea cada kind a su mensaje y permite reintentar`

# -- T9 R12: copy --

c18, T9 rojo (tasks.md T9 (1): `describe('#171 R12: copy de la variante sin collar')`,
10 it en celebration.test.tsx, con la SECTION literal; en
language-provider.test.tsx, la linea `        + 4 // #171 R12` justo antes
de A27):
  FORCE_COLOR=0 bunx jest --runTestsByPath src/components/__tests__/celebration.test.tsx src/providers/__tests__/language-provider.test.tsx > /tmp/171-c18.txt 2>&1; echo "exit=$?"
    -> exit=1 y `Tests:       11 failed, 59 passed, 70 total`, todos por asercion
  grep -qE '^Tests: +11 failed, 59 passed, 70 total$' /tmp/171-c18.txt \
    && test "$(grep -E '^  ● ' /tmp/171-c18.txt | grep -cvxF '  ● Console')" = 11 \
    && test "$(grep -E '^  ● ' /tmp/171-c18.txt | grep -cF '#171 R12: copy de la variante sin collar')" = 10 \
    && test "$(grep -E '^  ● ' /tmp/171-c18.txt | grep -cF 'mantiene la base más las claves de')" = 1 \
    && ! grep -qE 'Test suite failed to run|TypeError|ReferenceError|SyntaxError|Cannot find module' /tmp/171-c18.txt \
    && ! grep -qF 'Unable to find' /tmp/171-c18.txt \
    && test ! -e .expo/types/router.d.ts && bun run typecheck \
    && bunx expo lint --no-cache > /tmp/171-c18-lint.txt 2>&1 && test ! -s /tmp/171-c18-lint.txt \
    && git add src/components/__tests__/celebration.test.tsx src/providers/__tests__/language-provider.test.tsx \
    && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/components/__tests__/celebration.test.tsx mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx ' \
    && <LIMPIO> \
    && git commit -m 'test(mobile): copy de la celebración de la primera mascota (R12)'

c19, T9 verde (tasks.md T9 (2): las cuatro claves en catalog.ts tras A58 y
A59, y la SECTION en ../specs/mobile-ui-language/design.md tras la fila de
A68, con una linea en blanco delante):
  FORCE_COLOR=0 bunx jest --runTestsByPath src/components/__tests__/celebration.test.tsx src/providers/__tests__/language-provider.test.tsx > /tmp/171-c19.txt 2>&1; echo "exit=$?"
    -> exit=0 y `Tests:       70 passed, 70 total`
  <GUARDAS> > /tmp/171-c19-guardas.txt 2>&1; echo "exit=$?"
  pgrep -af '[i]nit\.sh'   -> vacio
  FORCE_COLOR=0 bunx jest --testTimeout=30000 > /tmp/171-c19-all.txt 2>&1; echo "exit=$?"
  grep -qE '^Tests: +70 passed, 70 total$' /tmp/171-c19.txt \
    && grep -qE '^Tests: +96 passed, 96 total$' /tmp/171-c19-guardas.txt \
    && grep -qE '^Test Suites: +99 passed, 99 total$' /tmp/171-c19-all.txt \
    && grep -qE '^Tests: +2836 passed, 2836 total$' /tmp/171-c19-all.txt \
    && test "$(grep -cF "'addPet.celebrate" src/i18n/catalog.ts)" = 8 \
    && test "$(grep -cF '### §2.24 — Añadidos por #171 — Celebraciones' ../specs/mobile-ui-language/design.md)" = 1 \
    && test ! -e .expo/types/router.d.ts && bun run typecheck \
    && bunx expo lint --no-cache > /tmp/171-c19-lint.txt 2>&1 && test ! -s /tmp/171-c19-lint.txt \
    && git add src/i18n/catalog.ts ../specs/mobile-ui-language/design.md \
    && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/i18n/catalog.ts specs/mobile-ui-language/design.md ' \
    && <LIMPIO> \
    && git commit -m 'feat(mobile): copy de la celebración de la primera mascota (R12)'

# -- T10 + T11 R4 y R5: primera mascota y variante sin collar --

c20, refactor del arnes (tasks.md T10 + T11 (0); los mismos 26 it en
verde; si alguno cambia de color, PARA):
  FORCE_COLOR=0 bunx jest --runTestsByPath src/screens/add-pet/index.test.tsx > /tmp/171-c20.txt 2>&1; echo "exit=$?"
    -> exit=0 y `Tests:       26 passed, 26 total`
  <GUARDAS> > /tmp/171-c20-guardas.txt 2>&1; echo "exit=$?"
  pgrep -af '[i]nit\.sh'   -> vacio
  FORCE_COLOR=0 bunx jest --testTimeout=30000 > /tmp/171-c20-all.txt 2>&1; echo "exit=$?"
  grep -qE '^Tests: +26 passed, 26 total$' /tmp/171-c20.txt \
    && grep -qE '^Tests: +96 passed, 96 total$' /tmp/171-c20-guardas.txt \
    && grep -qE '^Test Suites: +99 passed, 99 total$' /tmp/171-c20-all.txt \
    && grep -qE '^Tests: +2836 passed, 2836 total$' /tmp/171-c20-all.txt \
    && test "$(grep -cF "jest.mock('../../api/pets', () => ({ createPet: jest.fn(), listPets: jest.fn() }));" src/screens/add-pet/index.test.tsx)" = 1 \
    && test "$(grep -cF 'renderWithProviders(' src/screens/add-pet/index.test.tsx)" -ge 1 \
    && test ! -e .expo/types/router.d.ts && bun run typecheck \
    && bunx expo lint --no-cache > /tmp/171-c20-lint.txt 2>&1 && test ! -s /tmp/171-c20-lint.txt \
    && git add src/screens/add-pet/index.test.tsx \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/screens/add-pet/index.test.tsx' \
    && <LIMPIO> \
    && git commit -m 'test(mobile): add-pet renderiza con QueryClient (R4)'

c21, T10 + T11 rojo (tasks.md T10 + T11 (1): `describe('#171 R4: primera mascota')`
con 9 it y `describe('#171 R5: variante sin collar')` con 5, con la
compuerta de la lista; en ui-copy-table.ts las cuatro filas al final de
`R9_ADD_PET` (A28) y en ui-language.test.ts el titulo `45` y la longitud
`42 + 1 - 2 + 4`):
  FORCE_COLOR=0 bunx jest --runTestsByPath src/screens/add-pet/index.test.tsx src/__tests__/ui-language.test.ts > /tmp/171-c21.txt 2>&1; echo "exit=$?"
    -> exit=1 y `Tests:       15 failed, 55 passed, 70 total`, todos por
       asercion (R4.5 pendiente nace verde)
  grep -qE '^Tests: +15 failed, 55 passed, 70 total$' /tmp/171-c21.txt \
    && test "$(grep -E '^  ● ' /tmp/171-c21.txt | grep -cvxF '  ● Console')" = 15 \
    && test "$(grep -E '^  ● ' /tmp/171-c21.txt | grep -cF '#171 R4: primera mascota')" = 8 \
    && test "$(grep -E '^  ● ' /tmp/171-c21.txt | grep -cF '#171 R5: variante sin collar')" = 5 \
    && test "$(grep -E '^  ● ' /tmp/171-c21.txt | grep -cF 'resuelve las 45 ocurrencias normativas')" = 1 \
    && test "$(grep -E '^  ● ' /tmp/171-c21.txt | grep -cF 'resuelve cada ocurrencia de la tabla contra la clave exacta')" = 1 \
    && ! grep -qE 'Test suite failed to run|TypeError|ReferenceError|SyntaxError|Cannot find module' /tmp/171-c21.txt \
    && ! grep -qF 'Unable to find' /tmp/171-c21.txt \
    && test ! -e .expo/types/router.d.ts && bun run typecheck \
    && bunx expo lint --no-cache > /tmp/171-c21-lint.txt 2>&1 && test ! -s /tmp/171-c21-lint.txt \
    && git add src/screens/add-pet/index.test.tsx src/__tests__/ui-copy-table.ts src/__tests__/ui-language.test.ts \
    && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/__tests__/ui-copy-table.ts mobile-pet-tracker/src/__tests__/ui-language.test.ts mobile-pet-tracker/src/screens/add-pet/index.test.tsx ' \
    && <LIMPIO> \
    && git commit -m 'test(mobile): celebración de la primera mascota (R4, R5)'

c22, T10 + T11 verde (tasks.md T10 + T11 (2): design.md §2 y §3.2 en
add-pet/index.tsx; cada clave nueva se usa una vez con `t('addPet.celebrate…'`):
  FORCE_COLOR=0 bunx jest --runTestsByPath src/screens/add-pet/index.test.tsx src/__tests__/ui-language.test.ts > /tmp/171-c22.txt 2>&1; echo "exit=$?"
    -> exit=0 y `Tests:       70 passed, 70 total`
  <GUARDAS> > /tmp/171-c22-guardas.txt 2>&1; echo "exit=$?"
  pgrep -af '[i]nit\.sh'   -> vacio
  FORCE_COLOR=0 bunx jest --testTimeout=30000 > /tmp/171-c22-all.txt 2>&1; echo "exit=$?"
  grep -qE '^Tests: +70 passed, 70 total$' /tmp/171-c22.txt \
    && grep -qE '^Tests: +96 passed, 96 total$' /tmp/171-c22-guardas.txt \
    && grep -qE '^Test Suites: +99 passed, 99 total$' /tmp/171-c22-all.txt \
    && grep -qE '^Tests: +2850 passed, 2850 total$' /tmp/171-c22-all.txt \
    && test "$(grep -cF "queryFn: () => listPets(baseUrl, token ?? '')," src/screens/add-pet/index.tsx)" = 1 \
    && test "$(grep -cF '<Celebration' src/screens/add-pet/index.tsx)" = 1 \
    && test ! -e .expo/types/router.d.ts && bun run typecheck \
    && bunx expo lint --no-cache > /tmp/171-c22-lint.txt 2>&1 && test ! -s /tmp/171-c22-lint.txt \
    && git add src/screens/add-pet/index.tsx \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/screens/add-pet/index.tsx' \
    && <LIMPIO> \
    && git commit -m 'feat(mobile): celebración de la primera mascota (R4, R5)'

  Despues, las sondas de tasks.md T10 + T11 (corregidas en H0), sobre
  src/screens/add-pet/index.tsx, midiendo solo add-pet/index.test.tsx:
    S11.1 `const wasFirst = true;` -> la linea `Tests:` se anota (tambien
          caen it existentes que esperan `back` una vez); entre los `●`
          deben estar R4.4 y las cuatro R4.5
    S11.2 `const wasFirst = pets.data?.kind !== 'ok' || pets.data.pets.length === 0;`
          -> la linea `Tests:` se anota; entre los `●` deben estar las
             cuatro R4.5
    S11.3 la celebracion (`setCelebratePetName(...)`) se dispara justo tras
          el `ok` de createPet, ANTES de la subida de la foto
          -> la linea `Tests:` se anota; entre los `●` debe estar R4.6

# -- T12 R10: Pingo flota --

c23, T12 rojo (tasks.md T12 (1): en empty-state.test.tsx el doble de
Reanimated, `describe('#171 R10: Pingo flota')` con 4 it y los candados
de §7 (A16-A21: dos `probe-pose` -> `probe-float`, uno eliminado, tres
renombrados); en docs/index.test.tsx, la linea de A22):
  FORCE_COLOR=0 bunx jest --runTestsByPath src/components/__tests__/empty-state.test.tsx src/screens/docs/index.test.tsx > /tmp/171-c23.txt 2>&1; echo "exit=$?"
    -> exit=1 y `Tests:       9 failed, 197 passed, 206 total` (R10.2 y
       R10.3 a 1200 ms por consulta; el resto por asercion)
  grep -qE '^Tests: +9 failed, 197 passed, 206 total$' /tmp/171-c23.txt \
    && test "$(grep -E '^  ● ' /tmp/171-c23.txt | grep -cvxF '  ● Console')" = 9 \
    && test "$(grep -E '^  ● ' /tmp/171-c23.txt | grep -cF '#171 R10: Pingo flota')" = 3 \
    && test "$(grep -E '^  ● ' /tmp/171-c23.txt | grep -cF 'con acción pinta pose, título, cuerpo y botón como hijos directos, en ese orden')" = 1 \
    && test "$(grep -E '^  ● ' /tmp/171-c23.txt | grep -cF 'sin acción pinta pose, título y cuerpo como hijos directos, en ese orden')" = 1 \
    && test "$(grep -E '^  ● ' /tmp/171-c23.txt | grep -cF 'EmptyState importa exactamente lo de la flotación')" = 1 \
    && test "$(grep -E '^  ● ' /tmp/171-c23.txt | grep -cF 'solo Pingo para')" = 3 \
    && ! grep -qE 'Test suite failed to run|TypeError|ReferenceError|SyntaxError|Cannot find module' /tmp/171-c23.txt \
    && test ! -e .expo/types/router.d.ts && bun run typecheck \
    && bunx expo lint --no-cache > /tmp/171-c23-lint.txt 2>&1 && test ! -s /tmp/171-c23-lint.txt \
    && git add src/components/__tests__/empty-state.test.tsx src/screens/docs/index.test.tsx \
    && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/components/__tests__/empty-state.test.tsx mobile-pet-tracker/src/screens/docs/index.test.tsx ' \
    && <LIMPIO> \
    && git commit -m 'test(mobile): Pingo flota en los vacíos (R10)'

c24, T12 verde (tasks.md T12 (2): design.md §4.5, el bucle SIN mirar
reduce motion; imports exactamente las seis lineas de §4.5, y
`require(` sigue en 6 porque no hay pose nueva en EmptyState):
  FORCE_COLOR=0 bunx jest --runTestsByPath src/components/__tests__/empty-state.test.tsx src/screens/docs/index.test.tsx > /tmp/171-c24.txt 2>&1; echo "exit=$?"
    -> exit=0 y `Tests:       206 passed, 206 total`
  <GUARDAS> > /tmp/171-c24-guardas.txt 2>&1; echo "exit=$?"
  pgrep -af '[i]nit\.sh'   -> vacio
  FORCE_COLOR=0 bunx jest --testTimeout=30000 > /tmp/171-c24-all.txt 2>&1; echo "exit=$?"
  grep -qE '^Tests: +206 passed, 206 total$' /tmp/171-c24.txt \
    && grep -qE '^Tests: +96 passed, 96 total$' /tmp/171-c24-guardas.txt \
    && grep -qE '^Test Suites: +99 passed, 99 total$' /tmp/171-c24-all.txt \
    && grep -qE '^Tests: +2853 passed, 2853 total$' /tmp/171-c24-all.txt \
    && test "$(grep -cF 'require(' src/components/empty-state.tsx)" = 6 \
    && test "$(grep -c '^import ' src/components/empty-state.tsx)" = 6 \
    && test ! -e .expo/types/router.d.ts && bun run typecheck \
    && bunx expo lint --no-cache > /tmp/171-c24-lint.txt 2>&1 && test ! -s /tmp/171-c24-lint.txt \
    && git add src/components/empty-state.tsx \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/components/empty-state.tsx' \
    && <LIMPIO> \
    && git commit -m 'feat(mobile): Pingo flota en los vacíos (R10)'

  Parada de tasks.md T12: si alguna suite consumidora de EmptyState se
  pone roja en el ALL, cuelga o avisa de handles abiertos, PARA.
  Despues, la sonda de tasks.md T12, sobre src/components/empty-state.tsx,
  midiendo solo empty-state.test.tsx:
    S12.1 anade ` | 'celebrate'` al final de la union de `EmptyStatePose`
          (antes del `;`)
          -> `Tests:       1 failed, 97 passed, 98 total`, uno de
             `#171 R10: Pingo flota` (R10.1)

# -- T13 R11: reduce motion en los vacios --

c25, T13 rojo (tasks.md T13 (1): `describe('#171 R11: reduce motion en los vacíos')`,
2 it por asercion):
  FORCE_COLOR=0 bunx jest --runTestsByPath src/components/__tests__/empty-state.test.tsx > /tmp/171-c25.txt 2>&1; echo "exit=$?"
    -> exit=1 y `Tests:       2 failed, 98 passed, 100 total`
  grep -qE '^Tests: +2 failed, 98 passed, 100 total$' /tmp/171-c25.txt \
    && test "$(grep -E '^  ● ' /tmp/171-c25.txt | grep -cvxF '  ● Console')" = 2 \
    && test "$(grep -E '^  ● ' /tmp/171-c25.txt | grep -cF '#171 R11: reduce motion en los vacíos')" = 2 \
    && ! grep -qE 'Test suite failed to run|TypeError|ReferenceError|SyntaxError|Cannot find module' /tmp/171-c25.txt \
    && ! grep -qF 'Unable to find' /tmp/171-c25.txt \
    && test ! -e .expo/types/router.d.ts && bun run typecheck \
    && bunx expo lint --no-cache > /tmp/171-c25-lint.txt 2>&1 && test ! -s /tmp/171-c25-lint.txt \
    && git add src/components/__tests__/empty-state.test.tsx \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/components/__tests__/empty-state.test.tsx' \
    && <LIMPIO> \
    && git commit -m 'test(mobile): Pingo quieto con reduce motion (R11)'

c26, T13 verde (tasks.md T13 (2): `if (!reduceMotion)` alrededor del
arranque del bucle):
  FORCE_COLOR=0 bunx jest --runTestsByPath src/components/__tests__/empty-state.test.tsx > /tmp/171-c26.txt 2>&1; echo "exit=$?"
    -> exit=0 y `Tests:       100 passed, 100 total`
  <GUARDAS> > /tmp/171-c26-guardas.txt 2>&1; echo "exit=$?"
  pgrep -af '[i]nit\.sh'   -> vacio
  FORCE_COLOR=0 bunx jest --testTimeout=30000 > /tmp/171-c26-all.txt 2>&1; echo "exit=$?"
  grep -qE '^Tests: +100 passed, 100 total$' /tmp/171-c26.txt \
    && grep -qE '^Tests: +96 passed, 96 total$' /tmp/171-c26-guardas.txt \
    && grep -qE '^Test Suites: +99 passed, 99 total$' /tmp/171-c26-all.txt \
    && grep -qE '^Tests: +2855 passed, 2855 total$' /tmp/171-c26-all.txt \
    && test ! -e .expo/types/router.d.ts && bun run typecheck \
    && bunx expo lint --no-cache > /tmp/171-c26-lint.txt 2>&1 && test ! -s /tmp/171-c26-lint.txt \
    && git add src/components/empty-state.tsx \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/components/empty-state.tsx' \
    && <LIMPIO> \
    && git commit -m 'feat(mobile): Pingo quieto con reduce motion (R11)'

# -- T15 R15: enmienda a la carta --

c27, T15 rojo (tasks.md T15 (1): el it
`#171 R15: docs/ui-guidelines.md declara la enmienda del confeti` en
celebration.test.tsx; el `#` de los literales se escribe `\u0023`):
  FORCE_COLOR=0 bunx jest --runTestsByPath src/components/__tests__/celebration.test.tsx > /tmp/171-c27.txt 2>&1; echo "exit=$?"
    -> exit=1 y `Tests:       1 failed, 45 passed, 46 total`, por asercion
  grep -qE '^Tests: +1 failed, 45 passed, 46 total$' /tmp/171-c27.txt \
    && test "$(grep -E '^  ● ' /tmp/171-c27.txt | grep -cvxF '  ● Console')" = 1 \
    && test "$(grep -E '^  ● ' /tmp/171-c27.txt | grep -cF 'docs/ui-guidelines.md declara la enmienda del confeti')" = 1 \
    && ! grep -qE 'Test suite failed to run|TypeError|ReferenceError|SyntaxError|Cannot find module' /tmp/171-c27.txt \
    && ! grep -qF 'Unable to find' /tmp/171-c27.txt \
    && test ! -e .expo/types/router.d.ts && bun run typecheck \
    && bunx expo lint --no-cache > /tmp/171-c27-lint.txt 2>&1 && test ! -s /tmp/171-c27-lint.txt \
    && git add src/components/__tests__/celebration.test.tsx \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/components/__tests__/celebration.test.tsx' \
    && <LIMPIO> \
    && git commit -m 'test(mobile): la carta declara el confeti (R15)'

c28, T15 verde (tasks.md T15 (2): el bloque de design.md §8, tal cual, al
final de ../docs/ui-guidelines.md, con su casilla DESMARCADA):
  FORCE_COLOR=0 bunx jest --runTestsByPath src/components/__tests__/celebration.test.tsx > /tmp/171-c28.txt 2>&1; echo "exit=$?"
    -> exit=0 y `Tests:       46 passed, 46 total`
  <GUARDAS> > /tmp/171-c28-guardas.txt 2>&1; echo "exit=$?"
  pgrep -af '[i]nit\.sh'   -> vacio
  FORCE_COLOR=0 bunx jest --testTimeout=30000 > /tmp/171-c28-all.txt 2>&1; echo "exit=$?"
  grep -qE '^Tests: +46 passed, 46 total$' /tmp/171-c28.txt \
    && grep -qE '^Tests: +96 passed, 96 total$' /tmp/171-c28-guardas.txt \
    && grep -qE '^Test Suites: +99 passed, 99 total$' /tmp/171-c28-all.txt \
    && grep -qE '^Tests: +2856 passed, 2856 total$' /tmp/171-c28-all.txt \
    && test "$(grep -cF '## Enmienda #171 — confeti de celebración' ../docs/ui-guidelines.md)" = 1 \
    && test ! -e .expo/types/router.d.ts && bun run typecheck \
    && bunx expo lint --no-cache > /tmp/171-c28-lint.txt 2>&1 && test ! -s /tmp/171-c28-lint.txt \
    && git add ../docs/ui-guidelines.md \
    && test "$(git diff --cached --name-only)" = 'docs/ui-guidelines.md' \
    && <LIMPIO> \
    && git commit -m 'docs(mobile): enmienda de la carta, confeti de celebración (R15)'

== CIERRE ==

Desde mobile-pet-tracker/ (el `cd` literal de BASE otra vez), sin pipe,
con salida al impl:
- El comando BASE mas `src/components/__tests__/celebration.test.tsx` al
  final, con la salida a /tmp/171-final.txt
    -> exit=0, `Test Suites: 13 passed, 13 total` y `Tests:       663 passed, 663 total`
       (582 + 81; reparto: celebration 46, motion 17, design-drift 69,
       empty-state 100, pairing 61, add-pet 40, el resto sin cambios)
- `pgrep -af '[i]nit\.sh'` vacio; despues el comando ALL con la salida a
  /tmp/171-all.txt -> exit=0, `Test Suites: 99 passed, 99 total` y
  `Tests:       2856 passed, 2856 total`. Mientras corre, no lances otra
  cosa.
- `bun run typecheck; echo "exit=$?"` -> exit=0,
  `bunx expo lint --no-cache > /tmp/171-final-lint.txt 2>&1; echo "exit=$?"` -> exit=0
  y `test ! -s /tmp/171-final-lint.txt; echo "vacio=$?"` -> vacio=0.
- Sin dependencias nuevas:
  `git diff --quiet <H0> -- package.json bun.lock app.json; echo "exit=$?"`   -> exit=0
- Sin sombras:
  `git diff <H0> -- src | grep -cE '^\+.*(shadow-|elevation|boxShadow)'`   -> 0
Desde la raiz del repo (`cd /home/claude/sites/Pet-Tracker-wt-171 && pwd`):
- Las anclas A1-A70 (desde mobile-pet-tracker/) y H1-H5 con sus valores
  de cierre, y P1-P10 (define PROD tambien aqui).
- `git diff --stat <H0> -- backend-pet-tracker/ infra-pet-tracker/`   -> vacio
- `git diff --name-only <H0> HEAD -- docs/`   -> exactamente docs/ui-guidelines.md
- `git diff --name-only <H0> HEAD -- mobile-pet-tracker/ | LC_ALL=C sort`
  -> exactamente los 20 de mobile-pet-tracker/ de la lista de abajo

Despues rellena specs/mobile-celebrations-and-living-empty/traceability.md,
solo la columna de commits: hash corto + mensaje del rojo y del verde,
`rojo → verde`, para R1-R15 (R13: el commit unico c15; R4 y R5: c21 → c22,
con c20 como refactor previo). La fila R16 se queda `pendiente`. No toques
su frontmatter, ni la columna de tests, ni el resto del fichero. Termina
el impl con la linea `R16: pendiente del smoke humano`. c29, desde la raiz:
  git add specs/mobile-celebrations-and-living-empty/traceability.md progress/impl_mobile-celebrations-and-living-empty.md \
    && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'progress/impl_mobile-celebrations-and-living-empty.md specs/mobile-celebrations-and-living-empty/traceability.md ' \
    && git commit -m 'docs(mobile-celebrations-and-living-empty): #171 traceability'

Despues, la lista cerrada, con salida al impl:
  git diff --name-only <H0> HEAD -- . ':!feature_list.json' ':!progress/current.md' ':!progress/handoff_mobile-celebrations-and-living-empty.md' ':!specs/mobile-celebrations-and-living-empty/requirements.md' ':!specs/mobile-celebrations-and-living-empty/design.md' ':!specs/mobile-celebrations-and-living-empty/tasks.md' ':!progress/review_mobile-celebrations-and-living-empty.md'
    -> exactamente los 24 ficheros de abajo
y c30, desde la raiz:
  git commit --only progress/impl_mobile-celebrations-and-living-empty.md -m 'docs(mobile-celebrations-and-living-empty): #171 closed file list'

No rebasees despues de escribir hashes.

== REGLAS CRITICAS ==

- UI movil: docs/ui-guidelines.md manda (carta). Cero hex fuera de
  src/theme/, cero `StyleSheet.create`, cero clases entre corchetes, cero
  sombra (`shadow-*`, `elevation`, `boxShadow`). Los `style` son solo los
  de layout y animacion que fija design.md §3 y §4. Las clases son
  literales completos, nunca compuestas: los colores del confeti salen de
  `CONFETTI_FILLS` (E1), y las piezas son rectangulos SIN radio (E1).
  Movimiento: solo `transform` y `opacity`; ni `LayoutAnimation`, ni
  `entering`/`exiting`, ni `withRepeat` ni `withSequence` en
  celebration.tsx. El unico bucle es el de EmptyState (design.md §4.5).
- Skills: carga `building-native-ui` y `animate-expo` (tu plugin expo; son
  los nombres de Codex para lo que tasks.md llama `expo:expo-overview` y
  `expo:expo-animation`) y, de .agents/skills/ del repo,
  `appllama-app-design-skill` (OBLIGATORIA: pantalla nueva a pantalla
  completa; ver docs/ui-guidelines.md §Skills y sus limites). Las
  decisiones de la spec mandan sobre cualquier skill. Descartado: Lottie,
  Rive, `expo-linear-gradient`, `expo-symbols`, `expo-blur`, sombras,
  rutas modales de expo-router (design.md §1: es un `Modal`). Di en el
  impl cuales cargaste.
- Convenciones: docs/conventions.md, en particular §Tests y §Esperas. Todo
  `fireEvent` lleva `await`; cada it de animacion hace `await render(...)`
  o `await renderWithProviders(...)`; se avanza con
  `await act(async () => { jest.advanceTimersByTime(ms); })` (nunca
  `act(() => ...)` sin `await`, ver Reanudacion 2), con `ms` derivado de
  design.md §4, nunca ampliando la asercion; se compara con `toEqual` el
  objeto entero de `getAnimatedStyle(node)`, nunca `toHaveAnimatedStyle`.
  En Vincular y Anadir mascota se espera al nodo
  (`await screen.findByTestId(...)` o `waitFor` sobre el nodo o la cache),
  nunca al contador de un mock.
- Valores esperados LITERALES en los tests (clases, testIDs, copy, ms,
  hex de ninguna clase), nunca el simbolo importado de produccion. Los rojos
  no importan simbolos que aun no existen: las constantes nuevas de
  motion.ts se leen con `require('../motion').MOTION_X` (A3) y el catalogo
  con `const enCatalog: Record<string, string> = en;` (tasks.md T9).
- Imports en los tests y en produccion: NOMBRADOS, nunca `import * as`
  (eslint `import/namespace` es error y tumbaria la cadena). En particular
  `import { NotificationFeedbackType, notificationAsync } from 'expo-haptics';`
  y `jest.mocked(notificationAsync)`. Reutiliza lo que ya hay en cada
  fichero: no lo dupliques. Todo lo nuevo va AL FINAL de cada fichero,
  salvo el describe de R3 en Vincular (anidado, tasks.md T8).
- `#171` va SIEMPRE seguido de ` R<n>` en codigo y en tests: `HEX_LITERAL`
  de design-drift toma un `#171` suelto por un hex, y R13.1 lo veta en
  celebration.tsx, celebration.test.tsx y motion.ts. Los literales de
  R12.3 y R15 que llevan `#171` suelto (`Añadidos por #171`,
  `← añadida por #171 (R12)`, `## Enmienda #171`) escriben ese
  `#` como `\u0023` dentro del literal de celebration.test.tsx. Ningun
  comentario lleva `#NNN` sin ` R<n>`.
- docs/ui-guidelines.md: solo el bloque de design.md §8, byte a byte, al
  final. specs/mobile-ui-language/design.md: solo la linea en blanco y las
  ocho lineas de la SECTION de tasks.md T9 (con `#`, no `\u0023`, en el
  fichero).
- Ni `bun add`, ni cambios en package.json, bun.lock ni app.json. Todo
  con bun/bunx, nunca npm/npx. Nada de prettier (mobile no lo usa).
- NO lances ./init.sh ni toques Postgres ni LocalStack: los comparten
  otras sesiones y el gate lo corre el leader.
- No toques ningun fichero fuera de la lista de abajo (las sondas,
  revertidas, no cuentan). En particular, NO: los tests de las suites
  consumidoras de EmptyState (salvo docs/index.test.tsx en c23),
  src/theme/global.css, app.json, assets/ (salvo el WebP de c2).
- NO son tuyos, no los toques: progress/history.md, progress/current.md,
  STATUS.md, feature_list.json, el frontmatter de los ficheros de la
  spec, tasks.md, design.md y las casillas de §Aprobacion de
  requirements.md (incluidas la de R16 y la de E1). La casilla de la
  enmienda de docs/ui-guidelines.md se pega desmarcada. Los escribe el
  leader o el humano. Todo lo que tengas que contar va en
  progress/impl_mobile-celebrations-and-living-empty.md.
- Si el sandbox te deniega un comando, PARA y reportalo. No lo sustituyas
  por otro que haga lo mismo con otra herramienta.
- NO hagas push ni abras la PR: lo hace el leader al cerrar.

Ficheros que TU cambias (24, ni uno mas):
  docs/ui-guidelines.md
  mobile-pet-tracker/assets/images/pingo-celebrate.webp
  mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts
  mobile-pet-tracker/src/__tests__/design-drift.test.ts
  mobile-pet-tracker/src/__tests__/ui-copy-table.ts
  mobile-pet-tracker/src/__tests__/ui-language.test.ts
  mobile-pet-tracker/src/components/__tests__/celebration.test.tsx
  mobile-pet-tracker/src/components/__tests__/empty-state.test.tsx
  mobile-pet-tracker/src/components/celebration.tsx
  mobile-pet-tracker/src/components/empty-state.tsx
  mobile-pet-tracker/src/i18n/catalog.ts
  mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx
  mobile-pet-tracker/src/screens/add-pet/index.test.tsx
  mobile-pet-tracker/src/screens/add-pet/index.tsx
  mobile-pet-tracker/src/screens/docs/index.test.tsx
  mobile-pet-tracker/src/screens/pairing/index.test.tsx
  mobile-pet-tracker/src/screens/pairing/index.tsx
  mobile-pet-tracker/src/screens/welcome/index.test.tsx
  mobile-pet-tracker/src/theme/__tests__/motion.test.ts
  mobile-pet-tracker/src/theme/motion.ts
  mobile-pet-tracker/src/utils/category-palette.ts
  progress/impl_mobile-celebrations-and-living-empty.md
  specs/mobile-celebrations-and-living-empty/traceability.md
  specs/mobile-ui-language/design.md
Si el leader commitea en mitad (una correccion), solo tocara ficheros
excluidos por los pathspecs de la lista cerrada; cualquier otro fichero
ajeno en `git diff --name-only <H0> HEAD` es motivo de parada.

Criterios de aceptacion: R1-R15 de requirements.md, E1 incluida. La
prueba de humo de R16 (dev build de Android) es del humano: no la marques.
Deja en el impl sus pasos (tasks.md T16, pasos 1-8), listos para el
humano.

Al terminar, progress/impl_mobile-celebrations-and-living-empty.md debe
tener: pwd, branch, H0 y status; el exit de is-ancestor; node_modules
(presente o instalado); skills cargadas; la salida de las 75 anclas
(A1-A70, H1-H5) en H0 y la de cierre, mas P1-P10; la base con su exit
(comando BASE) y el ALL de la base; los 28 commits de c1-c28 con hash y
R-id; por cada rojo, el comando, la linea `Tests:`, el exit y cada it
rojo con su matcher y Expected/Received (en c3, las salidas de jest, tsc
y lint); cada verde con sus lineas `Tests:`, GUARDAS, ALL, typecheck y
lint; las sondas S5.1-S5.2, S7.1-S7.3, S8.1, S11.1-S11.3 y S12.1 con su
linea `Tests:` roja, sus `●` y su `limpio=0`; el cierre (BASE con 663,
ALL con exit y total, typecheck, lint, dependencias, sombras, diffs
vacios, lista cerrada); los pasos de la prueba de humo R16; la linea
`R16: pendiente del smoke humano`; y cualquier decision que la spec no
cerrara literalmente.
```

# Handoff a Codex CLI — #168 mobile-tab-headers-canvas

> Pegar el bloque de abajo en Codex CLI. La spec está firmada vía Notion
> (commit de firma `a372efdc`, 2026-10-11) con dos enmiendas también firmadas
> vía Notion: E1 (`a2e684ee`, 2026-10-11) y E2 (`c8c6aee3`, 2026-10-12). Es la
> segunda feature del bloque de paridad con el canvas aprobado el 2026-10-06:
> Salud, Nutrición y Perfil ganan el título grande (decisión N1) y pierden el
> hero; Salud pinta un tile pastel por vacuna; Perfil, una tarjeta de mascota
> con `PetAvatar`, chips pastel, tiles en las filas de navegación y un avatar
> de iniciales; Nutrición cambia la barra de kcal por un anillo. Son 27
> commits: bloques A-L en pares rojo/verde (c1-c24), el bloque M que nace
> verde con sus sondas (c25), uno de trazabilidad (c26) y uno de lista
> cerrada (c27). La prueba de humo R13, en un dev build de Android, es del
> humano y cierra la feature junto con las cuatro casillas de la enmienda.
>
> `node_modules` ya está instalado en `Pet-Tracker-wt-168/mobile-pet-tracker`.
> La branch ya incluye `origin/main` d2b8b0ae (el merge de #166): no hace
> falta merge antes de H0. No hay dependencias nuevas (react-native-svg y
> Reanimated ya están), ni assets, ni claves de catálogo.
>
> Correcciones del leader en H0, medidas contra los ficheros:
> - tasks.md línea 34 escapa la ruta de Nutrición (`'src/app/\(tabs\)/…'`)
>   para el modo patrón de jest. Aquí todo se mide con `--runTestsByPath`,
>   que toma las rutas literales: van entre comillas simples y SIN escapar.
> - Borrar código deja símbolos sin uso que mueven el lint: el rojo de I
>   (c17) deja `expectKcalBarTiming` sin uso hasta el rojo de K, y el verde
>   de I (c18) deja `KCAL_BAR_TIMING` sin uso hasta el verde de K. Las
>   cadenas cuentan esos warnings exactos (1, 2, 2, 2, 1, 0) en vez de
>   dejarlos pasar en silencio, y el bloque I prescribe los imports de
>   `food.tsx` para que no aparezca ningún otro.
> - El hash de T0 («commit de merge de #166») es `d2b8b0ae`.

---

```
Worktree: /home/claude/sites/Pet-Tracker-wt-168   <- PRIMERA LINEA. Trabaja AQUI y en ningun otro sitio
Antes de tocar nada, ejecuta `pwd`, `git branch --show-current`,
`git rev-parse --short HEAD` y `git status --short` y pega las cuatro
salidas al principio de progress/impl_mobile-tab-headers-canvas.md. El
hash es H0 (el commit que anade este handoff). En todos los comandos de
abajo, sustituye `<H0>` por ese hash literal: todos los `git diff` se
miden contra el. PARA si la branch no es
feature/168-mobile-tab-headers-canvas o si `git status --short` no sale
vacio. No toques /home/claude/sites/Pet-Tracker, Pet-Tracker-wt-166 (si
existe), Pet-Tracker-wt-167, Pet-Tracker-wt-169, Pet-Tracker-wt-170,
Pet-Tracker-wt-171 ni ningun otro worktree, ni cambies de branch en
ninguno.

Feature: mobile-tab-headers-canvas (#168)
Branch: feature/168-mobile-tab-headers-canvas
Spec aprobada: specs/mobile-tab-headers-canvas/requirements.md (firma
a372efdc), con las Enmiendas E1 (a2e684ee) y E2 (c8c6aee3) firmadas: lo
que dicen E1 y E2 manda sobre el texto original que corrigen. Lee
enteros: requirements.md (hasta el final, enmiendas incluidas),
design.md, tasks.md y traceability.md. tasks.md es tu guion (T0, bloques
A-M y §Reescrituras). Los titulos de describe e it, los literales de copy,
las clases, las props exhaustivas y el bloque de la enmienda (design.md
§2) son LITERALES: copialos tal cual, con sus tildes y sus simbolos (`%s`,
`›`, `—`, `«»`).

== QUE HACES ==

Los 27 commits, en este orden exacto: bloques A, B, C, D, E, F, G, H, I,
J, K y L, rojo y verde cada uno (c1-c24); el bloque M (c25), que nace
verde; el de trazabilidad (c26) y el de lista cerrada (c27). Rojo SIEMPRE
antes de su verde, en commits separados. Si escribes un verde antes que su
rojo, ese requisito nace verde y pierde su historial (C4 de
CHECKPOINTS.md); en #19 se metio todo en un solo commit y no vale.

Esto manda sobre tasks.md:
- NO lances ./init.sh. Lo corre el leader (comparte Postgres y LocalStack
  con otras sesiones).
- Sondas: solo las del bloque M, y van ANTES de su commit (M nace verde:
  las sondas son su rojo). Ningun otro bloque tiene sondas.
- Trazabilidad: traceability.md se rellena entera UNA vez, al final, en
  c26. Ningun commit de A-M la toca.
- No hay commits `refactor(...)`: los pasos (3) de tasks.md no se hacen.
- Mide con `FORCE_COLOR=0` delante de `bunx jest`, `--runTestsByPath` y
  la salida a un fichero, como en las cadenas de abajo.
- tasks.md linea 34 escapa la ruta de Nutricion para jest en modo patron.
  Aqui NO: con `--runTestsByPath` la ruta va literal, entre comillas
  simples y sin barras: 'src/app/(tabs)/__tests__/food.test.tsx'.
- Typecheck y lint: `bun run typecheck` (es `tsc --noEmit`) y
  `bunx expo lint --no-cache`. Nunca `bun run lint` (usa la cache de
  eslint y en #155 dio un error obsoleto).

== BASE ==

Primero, literal:
  cd /home/claude/sites/Pet-Tracker-wt-168/mobile-pet-tracker && pwd
  -> /home/claude/sites/Pet-Tracker-wt-168/mobile-pet-tracker
Todo lo de esta seccion, las anclas A1-A14 y COMMITS va desde ahi. Las
anclas H y P y el final del CIERRE van desde la raiz
(`cd /home/claude/sites/Pet-Tracker-wt-168 && pwd`).

Error de invocacion: si un comando falla ANTES de que arranquen jest,
tsc o eslint (`No such file or directory`, `command not found`, un
`ERR_PNPM_*` o un `pwd` que no es el esperado) y no has tocado ningun
fichero, NO es una parada: haz el `cd` literal de arriba, repite el
comando y anotalo en el impl. Cualquier otro fallo si es una parada.

T0 de tasks.md, con el hash que pide:
  git merge-base --is-ancestor d2b8b0ae HEAD; echo "exit=$?"   -> exit=0
Si da 1, PARA: #166 no esta en la base.

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
- T0 de tasks.md: re-mide los greps de la tabla de requirements.md §1
  (desde aqui) y anota en el impl la cifra de cada fila. Son las anclas
  A1-A14 de abajo; si alguna difiere, PARA (no apliques deltas por tu
  cuenta).

Variable de produccion, definela en la shell antes de las anclas y de
cada cadena que la use; sin comillas al usarla:
  PROD="--include=*.ts --include=*.tsx --exclude=*.test.ts --exclude=*.test.tsx --exclude-dir=__tests__"

Base medida por el leader el 2026-10-12 en este worktree con el arbol de
H0, con el comando BASE (un solo jest, FORCE_COLOR=0, sin pipe): exit=0,
`Test Suites: 9 passed, 9 total` y `Tests:       417 passed, 417 total`.
Reparto por fichero:
  src/__tests__/consistency-classnames.test.ts           63   (C)
  src/__tests__/design-drift.test.ts                     65
  src/__tests__/hero-header-amendments.test.ts           3    (A)
  src/__tests__/legibility-classnames.test.ts            27
  src/app/(tabs)/__tests__/food.test.tsx                 63   (F)
  src/providers/__tests__/language-provider.test.tsx     25
  src/screens/health/index.test.tsx                      67   (H)
  src/screens/profile/index.test.tsx                     39   (P)
  src/screens/welcome/index.test.tsx                     65   (W)
Tu medida manda: repite el comando BASE y anota sus dos lineas en el
impl. Si el total no es 417 o algo nace rojo, mide fichero a fichero,
anota y PARA.

Comando BASE (la ruta con `(tabs)` va entre comillas simples;
--runTestsByPath la toma literal):
  FORCE_COLOR=0 bunx jest --runTestsByPath src/__tests__/consistency-classnames.test.ts src/__tests__/design-drift.test.ts src/__tests__/hero-header-amendments.test.ts src/__tests__/legibility-classnames.test.ts 'src/app/(tabs)/__tests__/food.test.tsx' src/providers/__tests__/language-provider.test.tsx src/screens/health/index.test.tsx src/screens/profile/index.test.tsx src/screens/welcome/index.test.tsx > /tmp/168-base.txt 2>&1; echo "exit=$?"

Comando ALL (la suite entera; con `pgrep -af '[i]nit\.sh'` vacio antes y
sin lanzar nada mas mientras corre):
  FORCE_COLOR=0 bunx jest > /tmp/168-all-base.txt 2>&1; echo "exit=$?"
  -> exit=0. Copia al impl sus lineas `Test Suites:` y `Tests:`. Si exit
     no es 0, anota los `●` y PARA.
  ALL base (leader, H0): exit=0, `Test Suites: 98 passed, 98 total` y
  `Tests:       2775 passed, 2775 total`. Cierre esperado: 99 suites y
  2833 tests (2775 + 58; #168 crea un fichero de test, el del bloque M).

Comando GUARDAS (los candados de carta; lo corre cada verde; siempre
65 + 27 = 92):
  FORCE_COLOR=0 bunx jest --runTestsByPath src/__tests__/design-drift.test.ts src/__tests__/legibility-classnames.test.ts
En las cadenas aparece como `<GUARDAS> > /tmp/168-gN-guardas.txt 2>&1`.

== ANCLAS ==

Ejecutalas TODAS antes de tocar nada y copia la salida al impl. A1-A14
son las de requirements.md §1, desde mobile-pet-tracker/ con PROD
definida. H1-H30 van desde la RAIZ. Solo estos comandos son anclas; los
numeros de linea no lo son. Si alguna no da EXACTAMENTE lo esperado, PARA
y avisa (ante una diferencia manda el fichero, no el handoff). Cuando
`grep -c` cuenta 0 sale con codigo 1: lo que vale es la cifra impresa. El
leader las ha ejecutado todas en H0 sacandolas de este mismo fichero.

A1. grep -oF 'style={CONTINUOUS_CORNER}' src/screens/health/index.tsx | wc -l   -> 2
A2. grep -oF 'style={CONTINUOUS_CORNER}' 'src/app/(tabs)/food.tsx' | wc -l   -> 2
A3. grep -oF 'style={CONTINUOUS_CORNER}' src/screens/profile/index.tsx | wc -l   -> 4
A4. grep -cF 'toBe(33 + 1 + 1 - 1 - 1 + 1)' src/__tests__/consistency-classnames.test.ts   -> 1
A5. grep -rlF '<PetHeroHeader' src $PROD | wc -l   -> 3
A6. grep -rlF 'text-3xl font-black tracking-tight text-foreground' src | wc -l   -> 0
A7. grep -c 'text-2xl font-black text-foreground' src/screens/health/index.test.tsx   -> 1
A8. grep -c 'text-2xl font-black text-foreground' 'src/app/(tabs)/__tests__/food.test.tsx' src/screens/profile/index.test.tsx   -> las dos con :0
A9. grep -cF 'food.match(/style=\{CONTINUOUS_CORNER\}/g)).toHaveLength(2)' src/__tests__/consistency-classnames.test.ts   -> 1
A10. grep -cF 'count(/style=\{CONTINUOUS_CORNER\}/g)).toBe(31 + 1)' src/__tests__/consistency-classnames.test.ts   -> 1
A11. grep -c 'bg-accent-soft' src/screens/profile/index.tsx   -> 2
A12. grep -cF 'toBe(16 + 2 + 1)' src/__tests__/consistency-classnames.test.ts   -> 2
A13. grep -c 'const KCAL_BAR_TIMING = {' 'src/app/(tabs)/food.tsx'   -> 1
A14. grep -c 'expect(englishKeys).toHaveLength(' src/providers/__tests__/language-provider.test.tsx   -> 1
H1. grep -cF -- '- [X] Aprobado por humano (fecha: 2026-10-11) ← gate obligatorio antes de implementar' specs/mobile-tab-headers-canvas/requirements.md   -> 1
H2. grep -cF -- '- [ ] Prueba de humo R13 superada en dev build de Android (fecha: ____,' specs/mobile-tab-headers-canvas/requirements.md   -> 1
H3. grep -cF -- '- [X] Enmienda E1 aprobada por humano (fecha: 2026-10-11, vía Notion)' specs/mobile-tab-headers-canvas/requirements.md   -> 1
H4. grep -cF -- '- [X] Enmienda E2 aprobada por humano (fecha: 2026-10-12, vía Notion)' specs/mobile-tab-headers-canvas/requirements.md   -> 1
H5. grep -cF '"status": "in_progress"' feature_list.json   -> 1
H6. grep -rlF '#168' mobile-pet-tracker/src | wc -l   -> 0
H7. grep -cF 'import { ChevronRight } from' mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts   -> 1
H8. grep -cF "[join('screens', 'health', 'index.tsx'), 2]," mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts   -> 1
H9. grep -cF "[join('app', '(tabs)', 'food.tsx'), 2]," mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts   -> 1
H10. grep -cF "[join('screens', 'profile', 'index.tsx'), 3 + 1], // #41 R9" mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts   -> 1
H11. grep -cF "export const CONTINUOUS_CORNER = { borderCurve: 'continuous' } as const;" mobile-pet-tracker/src/theme/native-styles.ts   -> 1
H12. grep -cxF '## Enmienda #168 — título grande en Salud, Nutrición y Perfil' specs/mobile-tab-headers-canvas/design.md   -> 1
H13. grep -cxF '## Enmienda #168 — título grande en Salud, Nutrición y Perfil' docs/ui-guidelines.md specs/mobile-health-make-parity/requirements.md specs/mobile-kcal-consumed-bar/requirements.md specs/mobile-pet-hero-header/requirements.md   -> las cuatro con :0
H14. grep -cxF -- '- [ ] Enmienda #168 aprobada por humano' docs/ui-guidelines.md specs/mobile-health-make-parity/requirements.md specs/mobile-kcal-consumed-bar/requirements.md specs/mobile-pet-hero-header/requirements.md   -> las cuatro con :0
H15. grep -cxF '### R2 — Hero a sangre con el patrón A9' specs/mobile-health-make-parity/requirements.md   -> 1
H16. grep -cxF '### R6 — Profile sustituye su `PetHero` local por el compartido' specs/mobile-pet-hero-header/requirements.md   -> 1
H17. grep -cxF '### R2 — La tarjeta «Objetivo diario» pinta las kcal servidas contra `merKcal`' specs/mobile-kcal-consumed-bar/requirements.md   -> 1
H18. grep -cF "describe('R10: las specs enmendadas por #67 llevan su bloque'" mobile-pet-tracker/src/__tests__/hero-header-amendments.test.ts   -> 1
H19. grep -cE "^describe\('#115 R(2|3): " mobile-pet-tracker/src/screens/health/index.test.tsx   -> 2
H20. grep -cF "describe('R6: Profile usa el hero compartido'" mobile-pet-tracker/src/screens/profile/index.test.tsx   -> 1
H21. grep -cF "it('anima a 50, sube a 100 al servir y baja a 50 al deshacer con 250 ms y ease-in-out'" 'mobile-pet-tracker/src/app/(tabs)/__tests__/food.test.tsx'   -> 1
H22. grep -cF 'function expectKcalBarTiming(target: number): void {' 'mobile-pet-tracker/src/app/(tabs)/__tests__/food.test.tsx'   -> 1
H23. grep -cF "jest.mock('reicon-react-native'" mobile-pet-tracker/src/screens/profile/index.test.tsx   -> 0
H24. grep -cF "'../../theme/use-theme-colors'" mobile-pet-tracker/src/screens/profile/index.test.tsx   -> 0
H25. grep -cF "jest.mock('react-native-svg'" 'mobile-pet-tracker/src/app/(tabs)/__tests__/food.test.tsx'   -> 0
H26. grep -cF "describe('#153 E1: la carta retira WELCOME_ENTRANCE_MS de la migración pendiente'" mobile-pet-tracker/src/screens/welcome/index.test.tsx   -> 1
H27. grep -cF 'String.raw`#(?!\d{2,3} R\d)[\da-f]{3,8}\b`' specs/mobile-tab-headers-canvas/requirements.md mobile-pet-tracker/src/__tests__/design-drift.test.ts   -> las dos con :1
H28. grep -c 'useEffect' 'mobile-pet-tracker/src/app/(tabs)/food.tsx'   -> 2
H29. grep -cF "describe('#113 R7: " 'mobile-pet-tracker/src/app/(tabs)/__tests__/food.test.tsx'   -> 1
H30. grep -cF "describe('#113 R4: " 'mobile-pet-tracker/src/app/(tabs)/__tests__/food.test.tsx'   -> 1

Valores al cerrar (copialos al impl): A1 -> 3; A2 -> 1; A3 -> 8; A4 -> 0;
A5 -> 1; A6 no se fija (anota el valor); A7 -> 0; A8 sin cambios; A9 -> 0;
A10 -> 0; A11 -> 1; A12 -> 0; A13 -> 1; A14 -> 1. H1-H5 sin cambios; H6
no se fija (anota el valor); H7 -> 0; H8 -> 0; H9 -> 0; H10 -> 0; H11 y
H12 sin cambios; H13 -> las cuatro con :1; H14 -> las cuatro con :1;
H15-H18 sin cambios; H19 -> 0; H20 -> 0; H21 -> 0; H22 -> 1; H23 -> 1;
H24 -> 1; H25 -> 1; H26 y H27 sin cambios; H28 -> 2; H29 -> 0; H30 -> 0.
Y en positivo al cerrar, desde la raiz y con PROD definida:
  P1. grep -rlF 'text-3xl font-black tracking-tight text-foreground' mobile-pet-tracker/src $PROD | LC_ALL=C sort | tr '\n' ' '
      -> 'mobile-pet-tracker/src/app/(tabs)/food.tsx mobile-pet-tracker/src/screens/health/index.tsx mobile-pet-tracker/src/screens/profile/index.tsx ' (sin las comillas)
  P2. grep -rlF '<PetHeroHeader' mobile-pet-tracker/src $PROD   -> mobile-pet-tracker/src/screens/home/index.tsx
  P3. grep -cF "[join('screens', 'health', 'index.tsx'), 2 + 1], // #168 R3" mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts   -> 1
  P4. grep -cF "[join('app', '(tabs)', 'food.tsx'), 2 - 1], // #168 R8" mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts   -> 1
  P5. grep -cF "[join('screens', 'profile', 'index.tsx'), 3 + 1 + 4], // #41 R9; #168 R6" mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts   -> 1
  P6. grep -cF ').toBe(33 + 1 + 1 - 1 - 1 + 1 + 1 - 1 + 4); // #41 R9: geofences-link; #168 R3, R8, R6' mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts   -> 1
  P7. grep -cF 'food.match(/style=\{CONTINUOUS_CORNER\}/g)).toHaveLength(1);' mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts   -> 1
  P8. grep -cF 'count(/style=\{CONTINUOUS_CORNER\}/g)).toBe(31 + 1 + 4); // #41 R9: geofences-link; #168' mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts   -> 1
  P9. grep -cF 'toBe(16 + 2 + 1 - 1)' mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts   -> 2
  P10. grep -cF '// #168 R8: el tile ForkKnife sale de food.tsx' mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts   -> 1
  P11. grep -cF "\"import { Bell, ChevronRight, FileText, Map as MapIcon, Wifi } from 'reicon-react-native';\"" mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts   -> 1
  P12. grep -cF "describe('#168 R11: las specs enmendadas por #168 llevan su bloque'" mobile-pet-tracker/src/__tests__/hero-header-amendments.test.ts   -> 1
  P13. grep -cxF "import { Bell, ChevronRight, FileText, Map as MapIcon, Wifi } from 'reicon-react-native';" mobile-pet-tracker/src/screens/profile/index.tsx   -> 1
  P14. grep -cE 'ForkKnife|food-plan-fill|food-plan-track' 'mobile-pet-tracker/src/app/(tabs)/food.tsx'   -> 0
  P15. test -f mobile-pet-tracker/src/__tests__/tab-headers-canvas.test.ts && echo existe   -> existe
  P16. grep -cxF 'const AnimatedCircle = Animated.createAnimatedComponent(Circle);' 'mobile-pet-tracker/src/app/(tabs)/food.tsx'   -> 1
  P17. grep -cF 'withTiming(Math.min(kcalPct, 100), KCAL_BAR_TIMING)' 'mobile-pet-tracker/src/app/(tabs)/food.tsx'   -> 1
  P18. grep -cF 'h-52 w-full rounded-card' mobile-pet-tracker/src/screens/profile/index.tsx   -> 1

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

Rojos: caen por ASERCION (Expected/Received) o por CONSULTA de un nodo
que el verde de su bloque crea. Cada rojo dice que testIDs pueden salir
en `Unable to find an element with testID: <id>`; cualquier otro
`Unable to find`, y siempre TypeError, ReferenceError, SyntaxError,
`Test suite failed to run` o `Cannot find module`, es una parada. La
cadena comprueba la cuenta y el tipo; tu ademas abres el log y copias al
impl cada it rojo con su matcher y su Expected/Received (o su
`Unable to find`). Si un Received ocupa mas de 20 lineas, copia el
matcher, el Expected y las 20 primeras lineas del Received, y nada mas.
En las cadenas, el filtro de consultas permitidas es
  ! grep -E 'Unable to find' <log> | grep -vE 'Unable to find an element with testID: (<ids>)$'
y, donde no se permite ninguna,
  ! grep -qF 'Unable to find' <log>

Typecheck y lint van en TODAS las cadenas, rojas incluidas, y dan exit 0.
El lint se mide asi, y la cadena fija ademas su numero de warnings:
  bunx expo lint --no-cache > /tmp/168-lint.txt 2>&1 && test "$(grep -cE '^ +[0-9]+:[0-9]+ +warning ' /tmp/168-lint.txt)" = <n>
En las cadenas aparece como `<LINT n>`. n es 0 en todas salvo c17-c21
(abajo, con el mensaje exacto de cada warning). Un warning no previsto,
o uno previsto que no sale, es una parada.

Cada cadena termina igual, tras su `git add`: la lista exacta de lo
stageado y que no quede nada sin stagear en mobile-pet-tracker/, docs/
ni specs/ (el impl vive en progress/ sin trackear hasta el Cierre; no lo
stagees antes):
  git diff --quiet -- . ../docs ../specs && test -z "$(git ls-files --others --exclude-standard -- . ../docs ../specs)"
En las cadenas aparece como `<LIMPIO>`. NUNCA `git status --short` tras
un `git add`: falla siempre (lo stageado sale).

`●` son SOLO los encabezados de it rojo: Jest tambien imprime bloques
`  ● Console` (console.warn de Uniwind, console.info de HeroUI) que no
cuentan nunca, ni en sondas ni en rojos; se copian al impl sin filtrar.

Abreviaturas de rutas en las medidas (todas relativas a
mobile-pet-tracker/; la de F SIEMPRE entre comillas simples):
  H = src/screens/health/index.test.tsx
  P = src/screens/profile/index.test.tsx
  F = 'src/app/(tabs)/__tests__/food.test.tsx'
  C = src/__tests__/consistency-classnames.test.ts
  A = src/__tests__/hero-header-amendments.test.ts
  W = src/screens/welcome/index.test.tsx
  G = src/__tests__/tab-headers-canvas.test.ts (nuevo, bloque M)
En los comandos estan escritas enteras.

Literales de C que mueven los bloques B, E, F e I (tasks.md M (1b)).
Cada uno va en el commit ROJO de su bloque; el verde lo pone verde:
- B: fila de Salud `[join('screens', 'health', 'index.tsx'), 2 + 1], // #168 R3`;
  suma de #62 R14 `).toBe(33 + 1 + 1 - 1 - 1 + 1 + 1); // #41 R9: geofences-link; #168 R3`;
  total de #98 R10 `expect(count(/style=\{CONTINUOUS_CORNER\}/g)).toBe(31 + 1 + 1); // #41 R9: geofences-link; #168 R3`.
- E: los dos recuentos de `bg-accent-soft` pasan de `toBe(16 + 2 + 1)` a
  `toBe(16 + 2 + 1 - 1)`, y a cada comentario se le anade al final
  `; #168 R5: PetPills pasa a huecos pastel`.
- F: fila de Perfil `[join('screens', 'profile', 'index.tsx'), 3 + 1 + 4], // #41 R9; #168 R6`;
  suma `).toBe(33 + 1 + 1 - 1 - 1 + 1 + 1 + 4); // #41 R9: geofences-link; #168 R3, R6`;
  total `expect(count(/style=\{CONTINUOUS_CORNER\}/g)).toBe(31 + 1 + 1 + 4); // #41 R9: geofences-link; #168 R3, R6`;
  y C2 de §Reescrituras.
- I (forma final de requirements R12.1): fila de Nutricion
  `[join('app', '(tabs)', 'food.tsx'), 2 - 1], // #168 R8`;
  suma `).toBe(33 + 1 + 1 - 1 - 1 + 1 + 1 - 1 + 4); // #41 R9: geofences-link; #168 R3, R8, R6`;
  `expect(food.match(/style=\{CONTINUOUS_CORNER\}/g)).toHaveLength(1);`;
  total `expect(count(/style=\{CONTINUOUS_CORNER\}/g)).toBe(31 + 1 + 4); // #41 R9: geofences-link; #168`;
  y C1 de §Reescrituras (comentario literal `// #168 R8: el tile ForkKnife sale de food.tsx`).
La suma de #62 R14 vive en el it `fusiona la esquina una vez y la entrega
a las dos ramas de Card` y se mueve junto a su fila: ese it no se pone
rojo. Lo que se pone rojo es el it de la fila
(`%s importa y aplica sus %i esquinas`) y el de #98 R10.

-- Bloque A: Salud, R1 + R2 --

c1, A rojo (tasks.md bloque A (1): los describes `#168 R1: Salud pinta el
título grande en todas sus ramas` (it.each, 6 filas) y `#168 R2: Salud
sin hero y con métricas estándar` (9 its: 4 sueltos y un it.each de 5),
al final de H; y H1-H10 de §Reescrituras: H1-H7 borrados, lo que deja
vacios y borrados enteros los describes `#115 R2` y `#115 R3`; H8, H9 y
H10 reescritos. El it de R2 que pulsa el chip lo busca con
`within(<primer hijo de health-content>)`):
  FORCE_COLOR=0 bunx jest --runTestsByPath src/screens/health/index.test.tsx > /tmp/168-r1.txt 2>&1; echo "exit=$?"
    -> exit=1 y `Tests:       18 failed, 53 passed, 71 total`
  grep -qE '^Tests: +18 failed, 53 passed, 71 total$' /tmp/168-r1.txt \
    && test "$(grep -E '^  ● ' /tmp/168-r1.txt | grep -cvxF '  ● Console')" = 18 \
    && test "$(grep -E '^  ● ' /tmp/168-r1.txt | grep -cF '#168 R1: Salud pinta el título grande en todas sus ramas')" = 6 \
    && test "$(grep -E '^  ● ' /tmp/168-r1.txt | grep -cF '#168 R2: Salud sin hero y con métricas estándar')" = 9 \
    && test "$(grep -E '^  ● ' /tmp/168-r1.txt | grep -cF '#155 R4: Salud sin mascotas presenta a Pingo')" = 1 \
    && test "$(grep -cE '^  ● R4: health resuelve la mascota seleccionada' /tmp/168-r1.txt)" = 2 \
    && ! grep -qE 'Test suite failed to run|TypeError|ReferenceError|SyntaxError|Cannot find module' /tmp/168-r1.txt \
    && ! grep -E 'Unable to find' /tmp/168-r1.txt | grep -vE 'Unable to find an element with testID: (health-title|pet-chip-[^ ]+)$' \
    && test "$(grep -cE "^describe\('#115 R(2|3): " src/screens/health/index.test.tsx)" = 0 \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && <LINT 0> \
    && git add src/screens/health/index.test.tsx \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/screens/health/index.test.tsx' \
    && <LIMPIO> \
    && git commit -m 'test(mobile): Salud con título grande y sin hero (#168 R1, R2)'

c2, A verde (tasks.md bloque A (2), en src/screens/health/index.tsx):
  FORCE_COLOR=0 bunx jest --runTestsByPath src/screens/health/index.test.tsx > /tmp/168-g1.txt 2>&1; echo "exit=$?"
    -> exit=0 y `Tests:       71 passed, 71 total`
  <GUARDAS> > /tmp/168-g1-guardas.txt 2>&1; echo "exit=$?"
  grep -qE '^Tests: +71 passed, 71 total$' /tmp/168-g1.txt \
    && grep -qE '^Tests: +92 passed, 92 total$' /tmp/168-g1-guardas.txt \
    && test "$(grep -cF 'text-3xl font-black tracking-tight text-foreground' src/screens/health/index.tsx)" = 1 \
    && test "$(grep -cF 'text-2xl font-black text-foreground' src/screens/health/index.tsx)" = 0 \
    && test "$(grep -cF '<PetHeroHeader' src/screens/health/index.tsx)" = 0 \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && <LINT 0> \
    && git add src/screens/health/index.tsx \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/screens/health/index.tsx' \
    && <LIMPIO> \
    && git commit -m 'feat(mobile): Salud abre con el título grande (#168 R1, R2)'

-- Bloque B: Salud, R3 (tiles de vacuna) --

c3, B rojo (tasks.md bloque B (1): en el doble de reicon de H, anade
`Check: icon('health-icon-check')` y `Clock: icon('health-icon-clock')`;
en el doble de useThemeColors de H, ANTES de sus ramas actuales,
`if (token.startsWith('category-')) return token;`; la fixture de cuatro
vacunas y el reloj de requirements R3; el describe `#168 R3: cada vacuna
lleva su tile pastel`, 4 its, al final de H; y los literales B de C):
  FORCE_COLOR=0 bunx jest --runTestsByPath src/__tests__/consistency-classnames.test.ts src/screens/health/index.test.tsx > /tmp/168-r2.txt 2>&1; echo "exit=$?"
    -> exit=1 y `Tests:       6 failed, 132 passed, 138 total`
  grep -qE '^Tests: +6 failed, 132 passed, 138 total$' /tmp/168-r2.txt \
    && test "$(grep -E '^  ● ' /tmp/168-r2.txt | grep -cvxF '  ● Console')" = 6 \
    && test "$(grep -E '^  ● ' /tmp/168-r2.txt | grep -cF '#168 R3: cada vacuna lleva su tile pastel')" = 4 \
    && test "$(grep -E '^  ● ' /tmp/168-r2.txt | grep -cF 'screens/health/index.tsx importa y aplica sus 3 esquinas')" = 1 \
    && test "$(grep -E '^  ● ' /tmp/168-r2.txt | grep -cF '#98 R10')" = 1 \
    && ! grep -qE 'Test suite failed to run|TypeError|ReferenceError|SyntaxError|Cannot find module' /tmp/168-r2.txt \
    && ! grep -E 'Unable to find' /tmp/168-r2.txt | grep -vE 'Unable to find an element with testID: (vaccine-tile-[^ ]+|vaccine-text-[^ ]+|health-icon-check|health-icon-clock)$' \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && <LINT 0> \
    && git add src/__tests__/consistency-classnames.test.ts src/screens/health/index.test.tsx \
    && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts mobile-pet-tracker/src/screens/health/index.test.tsx ' \
    && <LIMPIO> \
    && git commit -m 'test(mobile): tile pastel por estado en cada vacuna (#168 R3)'

c4, B verde (tasks.md bloque B (2); los huecos pastel por
`CATEGORY_SLOTS` de src/utils/category-palette.ts, ver REGLAS CRITICAS):
  FORCE_COLOR=0 bunx jest --runTestsByPath src/__tests__/consistency-classnames.test.ts src/screens/health/index.test.tsx > /tmp/168-g2.txt 2>&1; echo "exit=$?"
    -> exit=0 y `Tests:       138 passed, 138 total`
  <GUARDAS> > /tmp/168-g2-guardas.txt 2>&1; echo "exit=$?"
  grep -qE '^Tests: +138 passed, 138 total$' /tmp/168-g2.txt \
    && grep -qE '^Tests: +92 passed, 92 total$' /tmp/168-g2-guardas.txt \
    && test "$(grep -oF 'style={CONTINUOUS_CORNER}' src/screens/health/index.tsx | wc -l)" = 3 \
    && test "$(grep -cE 'bg-category-|text-category-' src/screens/health/index.tsx)" = 0 \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && <LINT 0> \
    && git add src/screens/health/index.tsx \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/screens/health/index.tsx' \
    && <LIMPIO> \
    && git commit -m 'feat(mobile): tiles pastel en las vacunas (#168 R3)'

-- Bloque C: Perfil, R1 --

c5, C rojo (tasks.md bloque C (1): el it.each de 6 filas de R1, al
final de P):
  FORCE_COLOR=0 bunx jest --runTestsByPath src/screens/profile/index.test.tsx > /tmp/168-r3.txt 2>&1; echo "exit=$?"
    -> exit=1 y `Tests:       6 failed, 39 passed, 45 total`
  grep -qE '^Tests: +6 failed, 39 passed, 45 total$' /tmp/168-r3.txt \
    && test "$(grep -E '^  ● ' /tmp/168-r3.txt | grep -cvxF '  ● Console')" = 6 \
    && test "$(grep -E '^  ● ' /tmp/168-r3.txt | grep -cF '#168 R1:')" = 6 \
    && ! grep -qE 'Test suite failed to run|TypeError|ReferenceError|SyntaxError|Cannot find module' /tmp/168-r3.txt \
    && ! grep -E 'Unable to find' /tmp/168-r3.txt | grep -vE 'Unable to find an element with testID: (profile-title)$' \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && <LINT 0> \
    && git add src/screens/profile/index.test.tsx \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/screens/profile/index.test.tsx' \
    && <LIMPIO> \
    && git commit -m 'test(mobile): Perfil con título grande (#168 R1)'

c6, C verde (tasks.md bloque C (2)):
  FORCE_COLOR=0 bunx jest --runTestsByPath src/screens/profile/index.test.tsx > /tmp/168-g3.txt 2>&1; echo "exit=$?"
    -> exit=0 y `Tests:       45 passed, 45 total`
  <GUARDAS> > /tmp/168-g3-guardas.txt 2>&1; echo "exit=$?"
  grep -qE '^Tests: +45 passed, 45 total$' /tmp/168-g3.txt \
    && grep -qE '^Tests: +92 passed, 92 total$' /tmp/168-g3-guardas.txt \
    && test "$(grep -cF 'text-3xl font-black tracking-tight text-foreground' src/screens/profile/index.tsx)" = 1 \
    && test "$(grep -cF 'text-2xl font-black text-foreground' src/screens/profile/index.tsx)" = 0 \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && <LINT 0> \
    && git add src/screens/profile/index.tsx \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/screens/profile/index.tsx' \
    && <LIMPIO> \
    && git commit -m 'feat(mobile): título grande en Perfil (#168 R1)'

-- Bloque D: Perfil, R4 (tarjeta de mascota) --

c7, D rojo (tasks.md bloque D (1): el describe `#168 R4: Perfil sustituye
el hero por profile-pet-card`, 6 its, al final de P; P1 de §Reescrituras
borra entero `R6: Profile usa el hero compartido` (4 its); P2, P3 y P4
reescritos. `source` del avatar con foto: el ARRAY de la Enmienda E2):
  FORCE_COLOR=0 bunx jest --runTestsByPath src/screens/profile/index.test.tsx > /tmp/168-r4.txt 2>&1; echo "exit=$?"
    -> exit=1 y `Tests:       9 failed, 38 passed, 47 total`
  grep -qE '^Tests: +9 failed, 38 passed, 47 total$' /tmp/168-r4.txt \
    && test "$(grep -E '^  ● ' /tmp/168-r4.txt | grep -cvxF '  ● Console')" = 9 \
    && test "$(grep -E '^  ● ' /tmp/168-r4.txt | grep -cF '#168 R4:')" = 6 \
    && test "$(grep -E '^  ● ' /tmp/168-r4.txt | grep -cF 'renders the active pet hero, switcher, pills and information rows')" = 1 \
    && test "$(grep -E '^  ● ' /tmp/168-r4.txt | grep -cF 'keeps the old photo and shows an error when upload fails')" = 1 \
    && test "$(grep -E '^  ● ' /tmp/168-r4.txt | grep -cF '#87 R16: ProfileScreen lee por TanStack Query')" = 1 \
    && ! grep -qE 'Test suite failed to run|TypeError|ReferenceError|SyntaxError|Cannot find module' /tmp/168-r4.txt \
    && ! grep -E 'Unable to find' /tmp/168-r4.txt | grep -vE 'Unable to find an element with testID: (profile-pet-card|profile-pet-avatar|profile-pet-name|profile-pet-chips)$' \
    && test "$(grep -cF "describe('R6: Profile usa el hero compartido'" src/screens/profile/index.test.tsx)" = 0 \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && <LINT 0> \
    && git add src/screens/profile/index.test.tsx \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/screens/profile/index.test.tsx' \
    && <LIMPIO> \
    && git commit -m 'test(mobile): Perfil pinta la tarjeta de mascota con avatar (#168 R4)'

c8, D verde (tasks.md bloque D (2); `PetAvatar` de
src/components/pet-avatar.tsx tal cual, sin tocarlo; `<PetPills>` con
`testID="profile-pet-chips"` en su contenedor, R5 decide su contenido):
  FORCE_COLOR=0 bunx jest --runTestsByPath src/screens/profile/index.test.tsx > /tmp/168-g4.txt 2>&1; echo "exit=$?"
    -> exit=0 y `Tests:       47 passed, 47 total`
  <GUARDAS> > /tmp/168-g4-guardas.txt 2>&1; echo "exit=$?"
  grep -qE '^Tests: +47 passed, 47 total$' /tmp/168-g4.txt \
    && grep -qE '^Tests: +92 passed, 92 total$' /tmp/168-g4-guardas.txt \
    && test "$(grep -cF '<PetHeroHeader' src/screens/profile/index.tsx)" = 0 \
    && test "$(grep -cF 'h-52 w-full rounded-card' src/screens/profile/index.tsx)" = 1 \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && <LINT 0> \
    && git add src/screens/profile/index.tsx \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/screens/profile/index.tsx' \
    && <LIMPIO> \
    && git commit -m 'feat(mobile): tarjeta de mascota en Perfil (#168 R4)'

-- Bloque E: Perfil, R5 (chips) --

c9, E rojo (tasks.md bloque E (1): el describe de R5, 3 its, al final de
P; y los literales E de C):
  FORCE_COLOR=0 bunx jest --runTestsByPath src/__tests__/consistency-classnames.test.ts src/screens/profile/index.test.tsx > /tmp/168-r5.txt 2>&1; echo "exit=$?"
    -> exit=1 y `Tests:       5 failed, 108 passed, 113 total`
  grep -qE '^Tests: +5 failed, 108 passed, 113 total$' /tmp/168-r5.txt \
    && test "$(grep -E '^  ● ' /tmp/168-r5.txt | grep -cvxF '  ● Console')" = 5 \
    && test "$(grep -E '^  ● ' /tmp/168-r5.txt | grep -cF '#168 R5:')" = 3 \
    && test "$(grep -E '^  ● ' /tmp/168-r5.txt | grep -cF '#98 R10')" = 1 \
    && test "$(grep -E '^  ● ' /tmp/168-r5.txt | grep -cF 'conserva los usos de bg-accent-soft que sí son acento')" = 1 \
    && ! grep -qE 'Test suite failed to run|TypeError|ReferenceError|SyntaxError|Cannot find module' /tmp/168-r5.txt \
    && ! grep -E 'Unable to find' /tmp/168-r5.txt | grep -vE 'Unable to find an element with testID: (profile-pet-chip-(sex|sterilized|age|weight))$' \
    && test "$(grep -cF 'toBe(16 + 2 + 1 - 1)' src/__tests__/consistency-classnames.test.ts)" = 2 \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && <LINT 0> \
    && git add src/__tests__/consistency-classnames.test.ts src/screens/profile/index.test.tsx \
    && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts mobile-pet-tracker/src/screens/profile/index.test.tsx ' \
    && <LIMPIO> \
    && git commit -m 'test(mobile): chips pastel por dato (#168 R5)'

c10, E verde (tasks.md bloque E (2)):
  FORCE_COLOR=0 bunx jest --runTestsByPath src/__tests__/consistency-classnames.test.ts src/screens/profile/index.test.tsx > /tmp/168-g5.txt 2>&1; echo "exit=$?"
    -> exit=0 y `Tests:       113 passed, 113 total`
  <GUARDAS> > /tmp/168-g5-guardas.txt 2>&1; echo "exit=$?"
  grep -qE '^Tests: +113 passed, 113 total$' /tmp/168-g5.txt \
    && grep -qE '^Tests: +92 passed, 92 total$' /tmp/168-g5-guardas.txt \
    && test "$(grep -c 'bg-accent-soft' src/screens/profile/index.tsx)" = 1 \
    && test "$(grep -cE 'bg-category-|text-category-' src/screens/profile/index.tsx)" = 0 \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && <LINT 0> \
    && git add src/screens/profile/index.tsx \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/screens/profile/index.tsx' \
    && <LIMPIO> \
    && git commit -m 'feat(mobile): chips pastel en Perfil (#168 R5)'

-- Bloque F: Perfil, R6 (tiles de navegacion) --

Control antes del rojo (tasks.md bloque F (1)): anade SOLO los dos dobles
nuevos de P (reicon con `__esModule: true` y FileText/Wifi/Map/Bell como
`View` con su testID y su `color` en `style`; useThemeColors en
`'../../theme/use-theme-colors'` devolviendo los nombres de token) y
mide:
  FORCE_COLOR=0 bunx jest --runTestsByPath src/screens/profile/index.test.tsx > /tmp/168-f-control.txt 2>&1; echo "exit=$?"
    -> exit=0 y `Tests:       50 passed, 50 total`
Copia la linea al impl. Si no da eso, PARA (un doble rompe its vivos).
Despues sigues en el mismo arbol con el resto del rojo.

c11, F rojo (el resto de tasks.md bloque F (1): 4 its, uno por fila, al
final de P; P5 y C2 de §Reescrituras; y los literales F de C):
  FORCE_COLOR=0 bunx jest --runTestsByPath src/__tests__/consistency-classnames.test.ts src/screens/profile/index.test.tsx > /tmp/168-r6.txt 2>&1; echo "exit=$?"
    -> exit=1 y `Tests:       8 failed, 109 passed, 117 total`
  grep -qE '^Tests: +8 failed, 109 passed, 117 total$' /tmp/168-r6.txt \
    && test "$(grep -E '^  ● ' /tmp/168-r6.txt | grep -cvxF '  ● Console')" = 8 \
    && test "$(grep -E '^  ● ' /tmp/168-r6.txt | grep -cF '#168 R6:')" = 4 \
    && test "$(grep -E '^  ● ' /tmp/168-r6.txt | grep -cF '#41 R9: Perfil enlaza a las zonas seguras de la mascota activa')" = 1 \
    && test "$(grep -E '^  ● ' /tmp/168-r6.txt | grep -cF 'screens/profile/index.tsx importa y aplica sus 8 esquinas')" = 1 \
    && test "$(grep -E '^  ● ' /tmp/168-r6.txt | grep -cF '#98 R10')" = 1 \
    && test "$(grep -E '^  ● ' /tmp/168-r6.txt | grep -cF 'profile usa cuatro ChevronRight de reicon')" = 1 \
    && ! grep -qE 'Test suite failed to run|TypeError|ReferenceError|SyntaxError|Cannot find module' /tmp/168-r6.txt \
    && ! grep -E 'Unable to find' /tmp/168-r6.txt | grep -vE 'Unable to find an element with testID: ((documents|pairing|geofences|reminders)-link-tile|profile-icon-(file-text|wifi|map|bell))$' \
    && test "$(grep -cF "jest.mock('reicon-react-native'" src/screens/profile/index.test.tsx)" = 1 \
    && test "$(grep -cF "'../../theme/use-theme-colors'" src/screens/profile/index.test.tsx)" = 1 \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && <LINT 0> \
    && git add src/__tests__/consistency-classnames.test.ts src/screens/profile/index.test.tsx \
    && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts mobile-pet-tracker/src/screens/profile/index.test.tsx ' \
    && <LIMPIO> \
    && git commit -m 'test(mobile): tile pastel en las filas de navegación (#168 R6)'

c12, F verde (tasks.md bloque F (2); el import de iconos de Perfil queda
exactamente `import { Bell, ChevronRight, FileText, Map as MapIcon, Wifi } from 'reicon-react-native';`):
  FORCE_COLOR=0 bunx jest --runTestsByPath src/__tests__/consistency-classnames.test.ts src/screens/profile/index.test.tsx > /tmp/168-g6.txt 2>&1; echo "exit=$?"
    -> exit=0 y `Tests:       117 passed, 117 total`
  <GUARDAS> > /tmp/168-g6-guardas.txt 2>&1; echo "exit=$?"
  grep -qE '^Tests: +117 passed, 117 total$' /tmp/168-g6.txt \
    && grep -qE '^Tests: +92 passed, 92 total$' /tmp/168-g6-guardas.txt \
    && test "$(grep -oF 'style={CONTINUOUS_CORNER}' src/screens/profile/index.tsx | wc -l)" = 8 \
    && test "$(grep -cxF "import { Bell, ChevronRight, FileText, Map as MapIcon, Wifi } from 'reicon-react-native';" src/screens/profile/index.tsx)" = 1 \
    && test "$(grep -cE 'bg-category-|text-category-' src/screens/profile/index.tsx)" = 0 \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && <LINT 0> \
    && git add src/screens/profile/index.tsx \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/screens/profile/index.tsx' \
    && <LIMPIO> \
    && git commit -m 'feat(mobile): tiles en las filas de Perfil (#168 R6)'

-- Bloque G: Perfil, R7 (iniciales) --

c13, G rojo (tasks.md bloque G (1): it.each de 5 filas, al final de P):
  FORCE_COLOR=0 bunx jest --runTestsByPath src/screens/profile/index.test.tsx > /tmp/168-r7.txt 2>&1; echo "exit=$?"
    -> exit=1 y `Tests:       5 failed, 54 passed, 59 total`
  grep -qE '^Tests: +5 failed, 54 passed, 59 total$' /tmp/168-r7.txt \
    && test "$(grep -E '^  ● ' /tmp/168-r7.txt | grep -cvxF '  ● Console')" = 5 \
    && test "$(grep -E '^  ● ' /tmp/168-r7.txt | grep -cF '#168 R7:')" = 5 \
    && ! grep -qE 'Test suite failed to run|TypeError|ReferenceError|SyntaxError|Cannot find module' /tmp/168-r7.txt \
    && ! grep -E 'Unable to find' /tmp/168-r7.txt | grep -vE 'Unable to find an element with testID: (me-identity|me-identity-text|me-avatar|me-avatar-initials)$' \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && <LINT 0> \
    && git add src/screens/profile/index.test.tsx \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/screens/profile/index.test.tsx' \
    && <LIMPIO> \
    && git commit -m 'test(mobile): avatar de iniciales en la cuenta (#168 R7)'

c14, G verde (tasks.md bloque G (2)):
  FORCE_COLOR=0 bunx jest --runTestsByPath src/screens/profile/index.test.tsx > /tmp/168-g7.txt 2>&1; echo "exit=$?"
    -> exit=0 y `Tests:       59 passed, 59 total`
  <GUARDAS> > /tmp/168-g7-guardas.txt 2>&1; echo "exit=$?"
  grep -qE '^Tests: +59 passed, 59 total$' /tmp/168-g7.txt \
    && grep -qE '^Tests: +92 passed, 92 total$' /tmp/168-g7-guardas.txt \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && <LINT 0> \
    && git add src/screens/profile/index.tsx \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/screens/profile/index.tsx' \
    && <LIMPIO> \
    && git commit -m 'feat(mobile): iniciales del usuario en Perfil (#168 R7)'

-- Bloque H: Nutricion, R1 --

c15, H rojo (tasks.md bloque H (1): it.each de 6 filas, al final de F; y
F1 de §Reescrituras):
  FORCE_COLOR=0 bunx jest --runTestsByPath 'src/app/(tabs)/__tests__/food.test.tsx' > /tmp/168-r8.txt 2>&1; echo "exit=$?"
    -> exit=1 y `Tests:       7 failed, 62 passed, 69 total`
  grep -qE '^Tests: +7 failed, 62 passed, 69 total$' /tmp/168-r8.txt \
    && test "$(grep -E '^  ● ' /tmp/168-r8.txt | grep -cvxF '  ● Console')" = 7 \
    && test "$(grep -E '^  ● ' /tmp/168-r8.txt | grep -cF '#168 R1:')" = 6 \
    && test "$(grep -E '^  ● ' /tmp/168-r8.txt | grep -cF '#155 R4: Comida sin mascotas presenta a Pingo')" = 1 \
    && ! grep -qE 'Test suite failed to run|TypeError|ReferenceError|SyntaxError|Cannot find module' /tmp/168-r8.txt \
    && ! grep -E 'Unable to find' /tmp/168-r8.txt | grep -vE 'Unable to find an element with testID: (food-title)$' \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && <LINT 0> \
    && git add 'src/app/(tabs)/__tests__/food.test.tsx' \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/app/(tabs)/__tests__/food.test.tsx' \
    && <LIMPIO> \
    && git commit -m 'test(mobile): Nutrición con título grande (#168 R1)'

c16, H verde (tasks.md bloque H (2)):
  FORCE_COLOR=0 bunx jest --runTestsByPath 'src/app/(tabs)/__tests__/food.test.tsx' > /tmp/168-g8.txt 2>&1; echo "exit=$?"
    -> exit=0 y `Tests:       69 passed, 69 total`
  <GUARDAS> > /tmp/168-g8-guardas.txt 2>&1; echo "exit=$?"
  grep -qE '^Tests: +69 passed, 69 total$' /tmp/168-g8.txt \
    && grep -qE '^Tests: +92 passed, 92 total$' /tmp/168-g8-guardas.txt \
    && test "$(grep -cF 'text-3xl font-black tracking-tight text-foreground' 'src/app/(tabs)/food.tsx')" = 1 \
    && test "$(grep -cF 'text-2xl font-black text-foreground' 'src/app/(tabs)/food.tsx')" = 0 \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && <LINT 0> \
    && git add 'src/app/(tabs)/food.tsx' \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/app/(tabs)/food.tsx' \
    && <LIMPIO> \
    && git commit -m 'feat(mobile): título grande en Nutrición (#168 R1)'

-- Bloque I: Nutricion, R8 (estructura del anillo) --

Control antes del rojo: anade SOLO el doble de react-native-svg a F
(design.md D6: Svg y Circle como `View` con todas sus props;
`__esModule: true` si esparce `requireActual`) y mide:
  FORCE_COLOR=0 bunx jest --runTestsByPath 'src/app/(tabs)/__tests__/food.test.tsx' > /tmp/168-i-control.txt 2>&1; echo "exit=$?"
    -> exit=0 y `Tests:       69 passed, 69 total`
Copia la linea al impl. Si no da eso, PARA.

c17, I rojo (el resto de tasks.md bloque I (1): el describe `#168 R8:
food-plan-card pinta el anillo`, 7 its, al final de F; F2-F6 de
§Reescrituras: F2 borrado, F3 reescrito, F4 borra entero el describe
`#113 R7` (2 filas), F5 borrado (y con el, entero, el describe `#113 R4`,
que no tiene otro it), F6 conservado; y los literales I de C, con C1).
Al borrar F5, `expectKcalBarTiming` se queda sin uso hasta el rojo de K:
NO lo borres ni lo renombres (lo usa K). El lint da 1 warning, ese:
  FORCE_COLOR=0 bunx jest --runTestsByPath src/__tests__/consistency-classnames.test.ts 'src/app/(tabs)/__tests__/food.test.tsx' > /tmp/168-r9.txt 2>&1; echo "exit=$?"
    -> exit=1 y `Tests:       9 failed, 126 passed, 135 total`
  grep -qE '^Tests: +9 failed, 126 passed, 135 total$' /tmp/168-r9.txt \
    && test "$(grep -E '^  ● ' /tmp/168-r9.txt | grep -cvxF '  ● Console')" = 9 \
    && test "$(grep -E '^  ● ' /tmp/168-r9.txt | grep -cF '#168 R8: food-plan-card pinta el anillo')" = 7 \
    && test "$(grep -E '^  ● ' /tmp/168-r9.txt | grep -cF 'app/(tabs)/food.tsx importa y aplica sus 1 esquinas')" = 1 \
    && test "$(grep -E '^  ● ' /tmp/168-r9.txt | grep -cF '#98 R10')" = 1 \
    && ! grep -qE 'Test suite failed to run|TypeError|ReferenceError|SyntaxError|Cannot find module' /tmp/168-r9.txt \
    && ! grep -E 'Unable to find' /tmp/168-r9.txt | grep -vE 'Unable to find an element with testID: (food-plan-summary|food-plan-ring|food-plan-ring-track|food-plan-ring-fill)$' \
    && test "$(grep -cE "^describe\('#113 R(4|7): " 'src/app/(tabs)/__tests__/food.test.tsx')" = 0 \
    && test "$(grep -cF "jest.mock('react-native-svg'" 'src/app/(tabs)/__tests__/food.test.tsx')" = 1 \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && <LINT 1> \
    && test "$(grep -cF "'expectKcalBarTiming' is defined but never used" /tmp/168-lint.txt)" = 1 \
    && git add src/__tests__/consistency-classnames.test.ts 'src/app/(tabs)/__tests__/food.test.tsx' \
    && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts mobile-pet-tracker/src/app/(tabs)/__tests__/food.test.tsx ' \
    && <LIMPIO> \
    && git commit -m 'test(mobile): el anillo sustituye a la barra (#168 R8)'

c18, I verde (tasks.md bloque I (2) y requirements R8). En
src/app/(tabs)/food.tsx, para que el lint quede exactamente como se
espera:
- `import { useState } from 'react';` (fuera `useEffect`: el anillo no
  tiene efecto hasta J);
- `import Animated, { Easing, ReduceMotion, useAnimatedProps, useSharedValue } from 'react-native-reanimated';`
  (fuera `useAnimatedStyle` y `withTiming`);
- fuera `ForkKnife` del import de reicon:
  `import { ChevronRight, Clock, Sparkles } from 'reicon-react-native';`;
- `import Svg, { Circle } from 'react-native-svg';`;
- `const AnimatedCircle = Animated.createAnimatedComponent(Circle);`
  sustituye a `AnimatedView`;
- `const KCAL_RING_CIRCUMFERENCE = 2 * Math.PI * 44;`, el valor compartido
  `kcalRingPct = useSharedValue(0)` y
  `useAnimatedProps(() => ({ strokeDashoffset: KCAL_RING_CIRCUMFERENCE * (1 - kcalRingPct.get() / 100) }))`,
  sin efecto;
- `KCAL_BAR_TIMING` se queda tal cual y sin uso hasta K: NO lo borres, no
  lo renombres ni le pongas `_` (lo usa el verde de K);
- en `useThemeColors`, `'accent-foreground'` como cuarto token
  (`accentForeground`); los tres que hay no se tocan.
El lint da 2 warnings, esos dos:
  FORCE_COLOR=0 bunx jest --runTestsByPath src/__tests__/consistency-classnames.test.ts 'src/app/(tabs)/__tests__/food.test.tsx' > /tmp/168-g9.txt 2>&1; echo "exit=$?"
    -> exit=0 y `Tests:       135 passed, 135 total`
  <GUARDAS> > /tmp/168-g9-guardas.txt 2>&1; echo "exit=$?"
  grep -qE '^Tests: +135 passed, 135 total$' /tmp/168-g9.txt \
    && grep -qE '^Tests: +92 passed, 92 total$' /tmp/168-g9-guardas.txt \
    && test "$(grep -cE 'ForkKnife|food-plan-fill|food-plan-track' 'src/app/(tabs)/food.tsx')" = 0 \
    && test "$(grep -oF 'style={CONTINUOUS_CORNER}' 'src/app/(tabs)/food.tsx' | wc -l)" = 1 \
    && test "$(grep -cxF 'const AnimatedCircle = Animated.createAnimatedComponent(Circle);' 'src/app/(tabs)/food.tsx')" = 1 \
    && test "$(grep -c 'useEffect' 'src/app/(tabs)/food.tsx')" = 0 \
    && test "$(grep -c 'const KCAL_BAR_TIMING = {' 'src/app/(tabs)/food.tsx')" = 1 \
    && test "$(grep -cxF "import { useState } from 'react';" 'src/app/(tabs)/food.tsx')" = 1 \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && <LINT 2> \
    && test "$(grep -cF "'expectKcalBarTiming' is defined but never used" /tmp/168-lint.txt)" = 1 \
    && test "$(grep -cF "'KCAL_BAR_TIMING' is assigned a value but never used" /tmp/168-lint.txt)" = 1 \
    && git add 'src/app/(tabs)/food.tsx' \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/app/(tabs)/food.tsx' \
    && <LIMPIO> \
    && git commit -m 'feat(mobile): anillo de kcal en Nutrición (#168 R8)'

-- Bloque J: Nutricion, R9 (progreso del anillo) --

c19, J rojo (tasks.md bloque J (1): it.each de 8 filas, al final de F.
`jestAnimatedProps.value` es asincrono: leelo DENTRO de un `waitFor`. Si
`jestAnimatedProps` no llega al host de `food-plan-ring-fill`, PARA y
reporta (design.md D6). Nacen verdes las filas `656/0` y `0/0`: el verde
de R8 ya inicializa el anillo vacio, desfase 276.46. El commit lo anota
con un segundo -m. El lint sigue en 2, los mismos):
  FORCE_COLOR=0 bunx jest --runTestsByPath 'src/app/(tabs)/__tests__/food.test.tsx' > /tmp/168-r10.txt 2>&1; echo "exit=$?"
    -> exit=1 y `Tests:       6 failed, 74 passed, 80 total`
  grep -qE '^Tests: +6 failed, 74 passed, 80 total$' /tmp/168-r10.txt \
    && test "$(grep -E '^  ● ' /tmp/168-r10.txt | grep -cvxF '  ● Console')" = 6 \
    && test "$(grep -E '^  ● ' /tmp/168-r10.txt | grep -cF '#168 R9:')" = 6 \
    && ! grep -qE 'Test suite failed to run|TypeError|ReferenceError|SyntaxError|Cannot find module' /tmp/168-r10.txt \
    && ! grep -qF 'Unable to find' /tmp/168-r10.txt \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && <LINT 2> \
    && test "$(grep -cF "'expectKcalBarTiming' is defined but never used" /tmp/168-lint.txt)" = 1 \
    && test "$(grep -cF "'KCAL_BAR_TIMING' is assigned a value but never used" /tmp/168-lint.txt)" = 1 \
    && git add 'src/app/(tabs)/__tests__/food.test.tsx' \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/app/(tabs)/__tests__/food.test.tsx' \
    && <LIMPIO> \
    && git commit -m 'test(mobile): el anillo dice el porcentaje acotado (#168 R9)' -m 'Nacen verdes 656/0 y 0/0: el verde de R8 ya inicializa el anillo vacío (desfase 276.46).'

c20, J verde (tasks.md bloque J (2): vuelve
`import { useEffect, useState } from 'react';` y el efecto
`useEffect(() => { kcalRingPct.set(Math.min(kcalPct, 100)); }, [kcalPct, kcalRingPct]);`,
sin transicion todavia; el lint sigue en 2):
  FORCE_COLOR=0 bunx jest --runTestsByPath 'src/app/(tabs)/__tests__/food.test.tsx' > /tmp/168-g10.txt 2>&1; echo "exit=$?"
    -> exit=0 y `Tests:       80 passed, 80 total`
  <GUARDAS> > /tmp/168-g10-guardas.txt 2>&1; echo "exit=$?"
  grep -qE '^Tests: +80 passed, 80 total$' /tmp/168-g10.txt \
    && grep -qE '^Tests: +92 passed, 92 total$' /tmp/168-g10-guardas.txt \
    && test "$(grep -c 'useEffect' 'src/app/(tabs)/food.tsx')" = 2 \
    && test "$(grep -cF 'kcalRingPct.set(Math.min(kcalPct, 100))' 'src/app/(tabs)/food.tsx')" = 1 \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && <LINT 2> \
    && test "$(grep -cF "'expectKcalBarTiming' is defined but never used" /tmp/168-lint.txt)" = 1 \
    && test "$(grep -cF "'KCAL_BAR_TIMING' is assigned a value but never used" /tmp/168-lint.txt)" = 1 \
    && git add 'src/app/(tabs)/food.tsx' \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/app/(tabs)/food.tsx' \
    && <LIMPIO> \
    && git commit -m 'feat(mobile): progreso del anillo (#168 R9)'

-- Bloque K: Nutricion, R10 (transicion y reduce motion) --

c21, K rojo (tasks.md bloque K (1): 3 its, al final de F; el de
transicion vuelve a usar `expectKcalBarTiming`, asi que su warning
desaparece; esperas de docs/conventions.md §Esperas, nunca al contador
del mock. El lint da 1 warning, el de `KCAL_BAR_TIMING`):
  FORCE_COLOR=0 bunx jest --runTestsByPath 'src/app/(tabs)/__tests__/food.test.tsx' > /tmp/168-r11.txt 2>&1; echo "exit=$?"
    -> exit=1 y `Tests:       3 failed, 80 passed, 83 total`
  grep -qE '^Tests: +3 failed, 80 passed, 83 total$' /tmp/168-r11.txt \
    && test "$(grep -E '^  ● ' /tmp/168-r11.txt | grep -cvxF '  ● Console')" = 3 \
    && test "$(grep -E '^  ● ' /tmp/168-r11.txt | grep -cF '#168 R10:')" = 3 \
    && ! grep -qE 'Test suite failed to run|TypeError|ReferenceError|SyntaxError|Cannot find module' /tmp/168-r11.txt \
    && ! grep -qF 'Unable to find' /tmp/168-r11.txt \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && <LINT 1> \
    && test "$(grep -cF "'KCAL_BAR_TIMING' is assigned a value but never used" /tmp/168-lint.txt)" = 1 \
    && git add 'src/app/(tabs)/__tests__/food.test.tsx' \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/app/(tabs)/__tests__/food.test.tsx' \
    && <LIMPIO> \
    && git commit -m 'test(mobile): el anillo transiciona con reduce motion (#168 R10)'

c22, K verde (tasks.md bloque K (2): `withTiming` vuelve al import de
Reanimated y el efecto pasa a
`kcalRingPct.set(withTiming(Math.min(kcalPct, 100), KCAL_BAR_TIMING))`;
el lint queda en 0):
  FORCE_COLOR=0 bunx jest --runTestsByPath 'src/app/(tabs)/__tests__/food.test.tsx' > /tmp/168-g11.txt 2>&1; echo "exit=$?"
    -> exit=0 y `Tests:       83 passed, 83 total`
  <GUARDAS> > /tmp/168-g11-guardas.txt 2>&1; echo "exit=$?"
  grep -qE '^Tests: +83 passed, 83 total$' /tmp/168-g11.txt \
    && grep -qE '^Tests: +92 passed, 92 total$' /tmp/168-g11-guardas.txt \
    && test "$(grep -cF 'withTiming(Math.min(kcalPct, 100), KCAL_BAR_TIMING)' 'src/app/(tabs)/food.tsx')" = 1 \
    && test "$(grep -c 'useEffect' 'src/app/(tabs)/food.tsx')" = 2 \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && <LINT 0> \
    && git add 'src/app/(tabs)/food.tsx' \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/app/(tabs)/food.tsx' \
    && <LIMPIO> \
    && git commit -m 'feat(mobile): transición del anillo (#168 R10)'

-- Bloque L: R11 (enmienda #168) --

c23, L rojo (tasks.md bloque L (1): `AMENDED_DOCS_168`,
`SIGNATURE_LINE_168`, `canonicalAmendment168` y el describe `#168 R11:
las specs enmendadas por #168 llevan su bloque`, 3 its, al final de A.
Los tres its de `R10: las specs enmendadas por #67 llevan su bloque` y
sus constantes no cambian: el diff de A solo anade lineas):
  FORCE_COLOR=0 bunx jest --runTestsByPath src/__tests__/hero-header-amendments.test.ts > /tmp/168-r12.txt 2>&1; echo "exit=$?"
    -> exit=1 y `Tests:       3 failed, 3 passed, 6 total`
  grep -qE '^Tests: +3 failed, 3 passed, 6 total$' /tmp/168-r12.txt \
    && test "$(grep -E '^  ● ' /tmp/168-r12.txt | grep -cvxF '  ● Console')" = 3 \
    && test "$(grep -E '^  ● ' /tmp/168-r12.txt | grep -cF '#168 R11: las specs enmendadas por #168 llevan su bloque')" = 3 \
    && ! grep -qE 'Test suite failed to run|TypeError|ReferenceError|SyntaxError|Cannot find module' /tmp/168-r12.txt \
    && ! grep -qF 'Unable to find' /tmp/168-r12.txt \
    && test "$(git diff --numstat -- src/__tests__/hero-header-amendments.test.ts | cut -f2)" = 0 \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && <LINT 0> \
    && git add src/__tests__/hero-header-amendments.test.ts \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/__tests__/hero-header-amendments.test.ts' \
    && <LIMPIO> \
    && git commit -m 'test(harness): las specs enmendadas por #168 llevan su bloque (#168 R11)'

c24, L verde (tasks.md bloque L (2) y requirements R11: el bloque de
design.md §2, con su `<FEATURE>` y `<QUÉ CAMBIA>` de cada fila, la linea
de firma y el marcador, en los cuatro documentos. Solo lineas anadidas;
en docs/ui-guidelines.md, al final, tras la ultima seccion `## Enmienda`.
Mide A y W: el it `#153 E1` de W debe seguir verde):
  FORCE_COLOR=0 bunx jest --runTestsByPath src/__tests__/hero-header-amendments.test.ts src/screens/welcome/index.test.tsx > /tmp/168-g12.txt 2>&1; echo "exit=$?"
    -> exit=0 y `Tests:       71 passed, 71 total`
  <GUARDAS> > /tmp/168-g12-guardas.txt 2>&1; echo "exit=$?"
  grep -qE '^Tests: +71 passed, 71 total$' /tmp/168-g12.txt \
    && grep -qE '^Tests: +92 passed, 92 total$' /tmp/168-g12-guardas.txt \
    && test "$(grep -cxF '## Enmienda #168 — título grande en Salud, Nutrición y Perfil' ../docs/ui-guidelines.md ../specs/mobile-health-make-parity/requirements.md ../specs/mobile-kcal-consumed-bar/requirements.md ../specs/mobile-pet-hero-header/requirements.md | grep -c ':1$')" = 4 \
    && test "$(grep -cxF -- '- [ ] Enmienda #168 aprobada por humano' ../docs/ui-guidelines.md ../specs/mobile-health-make-parity/requirements.md ../specs/mobile-kcal-consumed-bar/requirements.md ../specs/mobile-pet-hero-header/requirements.md | grep -c ':1$')" = 4 \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && <LINT 0> \
    && git add ../docs/ui-guidelines.md ../specs/mobile-health-make-parity/requirements.md ../specs/mobile-kcal-consumed-bar/requirements.md ../specs/mobile-pet-hero-header/requirements.md \
    && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'docs/ui-guidelines.md specs/mobile-health-make-parity/requirements.md specs/mobile-kcal-consumed-bar/requirements.md specs/mobile-pet-hero-header/requirements.md ' \
    && test -z "$(git diff --cached --numstat | awk '$2 != 0')" \
    && <LIMPIO> \
    && git commit -m 'docs(specs): enmienda #168 en specs y carta (#168 R11)'

-- Bloque M: R12 (candados globales) y R1.3 --

M nace verde (A-L ya dejaron el arbol como piden): sus sondas son su
rojo y van ANTES del commit. Primero crea G
(src/__tests__/tab-headers-canvas.test.ts) segun tasks.md bloque M (1):
`describe('#168 R1: el título grande vive en las tres pestañas')`, 2 its
(ocurrencias por fichero y lista de ficheros), y
`describe('#168 R12: alcance cerrado')`, 5 its (R12.2 `<PetHeroHeader`;
R12.3 corchetes, `StyleSheet`, `text-accent` suelto y hex, este solo en
los tres de produccion con el patron literal de la Enmienda E1.b). Mismo
andamiaje que C (`sourceFiles`, `readSource`), sin importarlo de C. Mide:
  FORCE_COLOR=0 bunx jest --runTestsByPath src/__tests__/tab-headers-canvas.test.ts > /tmp/168-g13.txt 2>&1; echo "exit=$?"
    -> exit=0 y `Tests:       7 passed, 7 total`
Si no da eso, PARA.

Sondas, UNA A UNA, con G sin commitear. Plantas la mutacion, mides SOLO
G (salida a /tmp/168-sN.txt), copias al impl la linea `Tests:` y los
`●`, y reviertes:
  git checkout HEAD -- <fichero de la sonda>
  git diff --cached --quiet && git diff --quiet; echo "limpio=$?"   -> limpio=0
Nunca `git checkout <commit> -- <fichero>` (deja el cambio en el
indice). G sigue sin trackear y no entra en `limpio`. Si una sonda no da
EXACTAMENTE su linea `Tests:` y sus `●`, PARA. Ninguna sonda se
commitea. Todas caen por ASERCION.
  FORCE_COLOR=0 bunx jest --runTestsByPath src/__tests__/tab-headers-canvas.test.ts > /tmp/168-sN.txt 2>&1; echo "exit=$?"
  S1  en src/screens/health/index.tsx, duplica el `Text` de `health-title`
      -> `Tests:       1 failed, 6 passed, 7 total` (el de ocurrencias,
         en `#168 R1: el título grande vive en las tres pestañas`)
  S2  en src/app/(tabs)/food.tsx, quita el `Text` de `food-title`
      -> `Tests:       2 failed, 5 passed, 7 total` (los dos de `#168 R1:`)
  S3  en src/screens/home/index.tsx, copia el literal
      `text-3xl font-black tracking-tight text-foreground` a un className
      -> `Tests:       1 failed, 6 passed, 7 total` (el de lista, en `#168 R1:`)
  S4  en src/screens/profile/index.tsx, anade un `<PetHeroHeader` en el JSX
      -> `Tests:       1 failed, 6 passed, 7 total` (`#168 R12: alcance cerrado`)
  S5  en src/screens/profile/index.tsx, `className="w-[10px]"` en un nodo
      -> `Tests:       1 failed, 6 passed, 7 total` (`#168 R12: alcance cerrado`)
  S6  en src/screens/health/index.tsx, `color: '#fff'` en un `style`
      -> `Tests:       1 failed, 6 passed, 7 total` (`#168 R12: alcance cerrado`)
  S7  en src/app/(tabs)/food.tsx, `text-accent` suelto en el className de un `Text`
      -> `Tests:       1 failed, 6 passed, 7 total` (`#168 R12: alcance cerrado`)
  S8  en src/screens/profile/index.test.tsx, `import { StyleSheet } from 'react-native';`
      -> `Tests:       1 failed, 6 passed, 7 total` (`#168 R12: alcance cerrado`)
Para revertir S2 y S7 la ruta va entre comillas simples:
`git checkout HEAD -- 'src/app/(tabs)/food.tsx'`.

c25, M (con las ocho sondas revertidas y `limpio=0` tras la ultima):
  FORCE_COLOR=0 bunx jest --runTestsByPath src/__tests__/tab-headers-canvas.test.ts > /tmp/168-g13.txt 2>&1; echo "exit=$?"
    -> exit=0 y `Tests:       7 passed, 7 total`
  <GUARDAS> > /tmp/168-g13-guardas.txt 2>&1; echo "exit=$?"
  grep -qE '^Tests: +7 passed, 7 total$' /tmp/168-g13.txt \
    && grep -qE '^Tests: +92 passed, 92 total$' /tmp/168-g13-guardas.txt \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && <LINT 0> \
    && git add src/__tests__/tab-headers-canvas.test.ts \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/__tests__/tab-headers-canvas.test.ts' \
    && <LIMPIO> \
    && git commit -m 'test(mobile): candados globales de #168 (#168 R1, R12)' -m 'Nace verde. Sondas antes del commit, una a una, revertidas con limpio=0:
S1 health-title duplicado: 1 failed (R1, ocurrencias por fichero)
S2 sin food-title: 2 failed (R1, ocurrencias y lista)
S3 título en home: 1 failed (R1, lista de ficheros)
S4 PetHeroHeader en Perfil: 1 failed (R12.2)
S5 w-[10px] en Perfil: 1 failed (R12.3, corchetes)
S6 hex en un style de Salud: 1 failed (R12.3, hex)
S7 text-accent suelto en Nutrición: 1 failed (R12.3, text-accent)
S8 StyleSheet en el test de Perfil: 1 failed (R12.3, StyleSheet)'

== CIERRE ==

Desde mobile-pet-tracker/ (el `cd` literal de BASE otra vez), sin pipe,
con salida al impl:
- El comando BASE con G anadido al final
  (`... src/screens/welcome/index.test.tsx src/__tests__/tab-headers-canvas.test.ts > /tmp/168-final.txt 2>&1; echo "exit=$?"`)
    -> exit=0, `Test Suites: 10 passed, 10 total` y `Tests:       475 passed, 475 total`
       (417 + 58; reparto: C 63, design-drift 65, A 6, legibility 27,
       F 83, language-provider 25, H 75, P 59, W 65, G 7)
- `pgrep -af '[i]nit\.sh'` vacio; despues el comando ALL con la salida a
  /tmp/168-all.txt -> exit=0, `Test Suites: 99 passed, 99 total` y
  `Tests:       2833 passed, 2833 total`. Copia las dos lineas. Mientras
  corre, no lances otra cosa.
- `bun run typecheck; echo "exit=$?"` -> exit=0 y `<LINT 0>; echo "exit=$?"`
  -> exit=0.
- R12.4 y R12.5 (ni dependencias, ni catalogo, ni ficheros que la spec
  deja intactos):
  `git diff --quiet <H0> -- package.json bun.lock app.json src/i18n/catalog.ts src/__tests__/ui-copy-table.ts src/components/pet-hero-header.tsx src/components/pet-avatar.tsx ../specs/mobile-ui-language/design.md; echo "exit=$?"`   -> exit=0
- Sin sombras:
  `git diff <H0> -- src | grep -cE '^\+.*(shadow-|elevation|boxShadow)'`   -> 0
Desde la raiz del repo (`cd /home/claude/sites/Pet-Tracker-wt-168 && pwd`):
- Las anclas A1-A14 (desde mobile-pet-tracker/) y H1-H30 con sus valores
  de cierre, y P1-P18 (define PROD tambien aqui).
- `git diff --stat <H0> -- backend-pet-tracker/ infra-pet-tracker/`   -> vacio
- `git diff --name-only <H0> HEAD -- docs/`   -> exactamente docs/ui-guidelines.md
- `git diff --name-only <H0> HEAD -- mobile-pet-tracker/ | LC_ALL=C sort`
  -> exactamente los 9 de mobile-pet-tracker/ de la lista de abajo

Despues rellena specs/mobile-tab-headers-canvas/traceability.md, las DOS
columnas, test y commit, en todas sus filas salvo R13: el test (fichero y
titulo de describe / it) y el hash corto + mensaje del rojo y del verde,
`rojo → verde`. La fila R1.3 y la de R12.2 / R12.3 llevan el commit c25
(nace verde: anota «nace verde, sondas S1-S8»). En la fila
`R12.4 / R12.5`, la columna de test es la comprobacion de cierre de
arriba (el `git diff --quiet` con exit=0) y la de commit, «sin commit
propio (comprobación de cierre)». La fila R13 se queda como esta. No
toques su frontmatter ni el resto del fichero. Termina el impl con los
pasos S1-S10 de la prueba de humo R13 (requirements.md R13), listos para
el humano, y la linea `R13: pendiente del smoke humano`. c26, desde la
raiz:
  git add specs/mobile-tab-headers-canvas/traceability.md progress/impl_mobile-tab-headers-canvas.md \
    && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'progress/impl_mobile-tab-headers-canvas.md specs/mobile-tab-headers-canvas/traceability.md ' \
    && git commit -m 'docs(mobile-tab-headers-canvas): #168 traceability'
Despues, la lista cerrada, con salida al impl:
  git diff --name-only <H0> HEAD -- . ':!feature_list.json' ':!progress/current.md' ':!progress/handoff_mobile-tab-headers-canvas.md' ':!specs/mobile-tab-headers-canvas/requirements.md' ':!specs/mobile-tab-headers-canvas/design.md' ':!specs/mobile-tab-headers-canvas/tasks.md' ':!progress/review_mobile-tab-headers-canvas.md'
    -> exactamente los 15 ficheros de abajo
y c27, desde la raiz:
  git commit --only progress/impl_mobile-tab-headers-canvas.md -m 'docs(mobile-tab-headers-canvas): #168 closed file list'
No rebasees despues de escribir hashes.

== REGLAS CRITICAS ==

- UI movil: docs/ui-guidelines.md manda (carta). Cero hex fuera de
  src/theme/, cero `StyleSheet.create`, cero clases entre corchetes, cero
  sombra (`shadow-*`, `elevation`, `boxShadow`). Las clases son literales
  completos, nunca compuestas, con UNA excepcion: los huecos pastel.
- Huecos pastel (#64 R9): `bg-category-*` y `text-category-*` viven SOLO
  en src/utils/category-palette.ts, en
  `CATEGORY_SLOTS: Record<CategorySlot, { surface; ink }>`. Las pantallas
  los usan con template literal, `${CATEGORY_SLOTS[slot].surface}`, y
  nunca escriben `bg-category-` ni interpolan `bg-category-${...}`. El
  color del icono sale del token `'category-<slot>-strong'` por
  `useThemeColors`. Las cadenas de B, E y F lo comprueban.
- Skills: carga `building-native-ui` (tu plugin expo) y, de .agents/skills/
  del repo, `appllama-app-design-skill` (OBLIGATORIA: cambias tres
  pantallas enteras; ver docs/ui-guidelines.md §Skills y sus tres
  limites), `emil-design-eng` y `animate-expo` (para el anillo de K). Tu
  plugin no tiene ninguna skill de animacion: la guia de movimiento esta
  en design.md D6 y requirements.md R10 (withTiming con KCAL_BAR_TIMING,
  250 ms, ease-in-out, reduceMotion System) y manda sobre cualquier skill.
  Descartado: `entering`, LayoutAnimation, Lottie, Rive,
  `expo-linear-gradient`, `expo-symbols`, sombras. Di en el impl cuales
  cargaste.
- Convenciones: docs/conventions.md, en particular §Tests y §Esperas.
  `fireEvent` de RNTL 14 es asincrono: siempre `await fireEvent.press(...)`.
  `jestAnimatedProps.value` se lee dentro de `waitFor`. El `source` de
  expo-image en el host es un ARRAY (Enmienda E2). Elementos repetidos:
  `within(<raiz>)` y `children.length`, no por testID.
- Valores esperados LITERALES en los tests (clases, testIDs, copy,
  `CONTINUOUS_CORNER` y `TABULAR_NUMS` escritos como su valor), nunca el
  simbolo importado de produccion. Ningun it aserta `className` ni props
  de `Button` (son de #166).
- Imports en los tests: NOMBRADOS, nunca `import * as` (eslint
  `import/namespace` es error y tumbaria la cadena). Todo lo nuevo va AL
  FINAL de cada fichero; los dobles nuevos, junto a los `jest.mock` que
  ya hay.
- design-drift recorre tambien los tests co-locados (H y P): todo `#168`
  que escribas en src/screens/**/index.test.tsx va seguido de ` R<n>` (un
  `#168` suelto lo caza el guard de hex). Bajo __tests__/ (C, A, F, G) no
  aplica.
- No toques src/components/pet-hero-header.tsx ni
  src/components/pet-avatar.tsx, ni src/i18n/catalog.ts,
  src/__tests__/ui-copy-table.ts, package.json, bun.lock ni app.json. Ni
  `bun add`. Todo con bun/bunx, nunca npm/npx. Nada de prettier (mobile no
  lo usa).
- NO lances ./init.sh ni toques Postgres ni LocalStack: los comparten
  otras sesiones y el gate lo corre el leader.
- No toques ningun fichero fuera de la lista de abajo (las sondas,
  revertidas, no cuentan).
- NO son tuyos, no los toques: progress/history.md, progress/current.md,
  STATUS.md, feature_list.json, el frontmatter de los ficheros de la
  spec, requirements.md, design.md, tasks.md, y las casillas de
  aprobacion (la de la prueba de humo R13 y las cuatro
  `- [ ] Enmienda #168 aprobada por humano`, que escribes `[ ]` y firma
  el humano). Los escribe el leader o el humano. Todo lo que tengas que
  contar va en progress/impl_mobile-tab-headers-canvas.md.
- Si el sandbox te deniega un comando, PARA y reportalo. No lo sustituyas
  por otro que haga lo mismo con otra herramienta.
- NO hagas push ni abras la PR: lo hace el leader al cerrar.

Ficheros que TU cambias (15, ni uno mas):
  docs/ui-guidelines.md
  mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts
  mobile-pet-tracker/src/__tests__/hero-header-amendments.test.ts
  mobile-pet-tracker/src/__tests__/tab-headers-canvas.test.ts
  mobile-pet-tracker/src/app/(tabs)/__tests__/food.test.tsx
  mobile-pet-tracker/src/app/(tabs)/food.tsx
  mobile-pet-tracker/src/screens/health/index.test.tsx
  mobile-pet-tracker/src/screens/health/index.tsx
  mobile-pet-tracker/src/screens/profile/index.test.tsx
  mobile-pet-tracker/src/screens/profile/index.tsx
  progress/impl_mobile-tab-headers-canvas.md
  specs/mobile-health-make-parity/requirements.md
  specs/mobile-kcal-consumed-bar/requirements.md
  specs/mobile-pet-hero-header/requirements.md
  specs/mobile-tab-headers-canvas/traceability.md
Si el leader commitea en mitad (una correccion), solo tocara ficheros
excluidos por los pathspecs de la lista cerrada; cualquier otro fichero
ajeno en `git diff --name-only <H0> HEAD` es motivo de parada.

Criterios de aceptacion: R1-R12 de requirements.md, con las Enmiendas E1
y E2. La prueba de humo R13 (dev build de Android) y las cuatro casillas
de la enmienda son del humano: no las marques. Deja en el impl los pasos
S1-S10 de R13, listos para el humano.

Al terminar, progress/impl_mobile-tab-headers-canvas.md debe tener: pwd,
branch, H0 y status; el exit de los dos is-ancestor (d2b8b0ae y
origin/main); node_modules (presente o instalado); skills cargadas; la
salida de las 44 anclas (A1-A14, H1-H30) en H0 y la de cierre, mas
P1-P18; la base con su exit (comando BASE) y el ALL de la base; los dos
controles (F e I); los 25 commits de A-M con hash y R-id; por cada rojo,
el comando, la linea `Tests:`, el exit y cada it rojo con su matcher y
Expected/Received o su `Unable to find`; cada verde con sus lineas
`Tests:`, GUARDAS, typecheck y lint (con sus warnings, si los hay); las
sondas S1-S8 con su linea `Tests:` roja, sus `●` y su `limpio=0`; el
cierre (BASE con 475, ALL con exit y total, typecheck, lint, R12.4/R12.5,
sombras, diffs vacios, lista cerrada); los pasos S1-S10 de la prueba de
humo R13; la linea `R13: pendiente del smoke humano`; y cualquier
decision que la spec no cerrara literalmente.
```

## Reanudación 1: parada en el rojo de A (2026-10-12)

> Codex paró antes de la cadena c1 con el árbol sucio y sin commits desde
> H0 `b082f6e5`. La cuenta del rojo cuadraba (18 failed, 53 passed, 71
> total), pero el it `#168 R2 › cambia vacunas y peso al pulsar otra
> mascota` caía por `Found multiple elements with text: Vacuna de Luna`.
> La parada fue correcta: la fixture de `makeVaccine` trae `nextDoseAt`
> `2099-08-01`, así que el nombre sale dos veces, en `next-vaccine-card` y
> en `vaccine-row-vaccine-1`, y la ambigüedad seguiría con el verde de A.
> tasks.md pedía «aserción sobre un nombre de vacuna que solo tiene ella»
> sin decir dónde buscarlo; el hueco era de la spec.
>
> Corrección del leader, sin enmienda: no cambia ningún requisito, solo
> el ámbito de dos consultas del mismo it, que pasan a la fila
> `vaccine-row-vaccine-1` (R3.1 la conserva). Los otros 17 rojos caen por
> la razón prescrita (el leader lo comprobó sobre `/tmp/168-r1.txt`). Con la
> corrección, ese it cae en el rojo por `Unable to find an element with
> testID: pet-chip-pet-2`, que está en la lista permitida de A, y la cuenta
> sigue en 18/53/71. H0 sigue siendo `b082f6e5`. Este commit solo toca este
> fichero, que está fuera de la lista cerrada.

Pegar en Codex CLI:

```
Worktree: /home/claude/sites/Pet-Tracker-wt-168   <- PRIMERA LINEA. Trabaja AQUI y en ningun otro sitio
Reanudacion 1 de #168 tras tu parada en el rojo de A. Ejecuta y pega en
progress/impl_mobile-tab-headers-canvas.md, bajo una seccion nueva
«## Reanudacion 1»:
  cd /home/claude/sites/Pet-Tracker-wt-168 && pwd
  git branch --show-current
  git rev-parse --short HEAD~1
  git log --oneline b082f6e5..HEAD
  git status --short
PARA si:
- la branch no es feature/168-mobile-tab-headers-canvas;
- HEAD~1 no es b082f6e5 (H0);
- el log no es exactamente un commit, el del leader que anade esta
  reanudacion;
- `git status --short` no son exactamente estas dos lineas:
   M mobile-pet-tracker/src/screens/health/index.test.tsx
  ?? progress/impl_mobile-tab-headers-canvas.md
H0 sigue siendo b082f6e5: todos los diffs se miden contra el. Siguen en
vigor todas las reglas del handoff original. No descartes tu cambio sin
commitear en H: retomas sobre el.

Anclas, desde mobile-pet-tracker/
(`cd /home/claude/sites/Pet-Tracker-wt-168/mobile-pet-tracker && pwd`):
  grep -cF "    await screen.findByText('Vacuna de Luna');" src/screens/health/index.test.tsx   -> 1
  grep -cF "    await waitFor(() => expect(screen.getByText('Vacuna de Max')).toBeVisible());" src/screens/health/index.test.tsx   -> 1
  grep -cF "    expect(screen.queryByText('Vacuna de Luna')).toBeNull();" src/screens/health/index.test.tsx   -> 1
  grep -cF "testID={\`vaccine-row-\${vaccine.id}\`}" src/screens/health/index.tsx   -> 1
Si alguna no da su cifra, PARA.

Lo que cambia, y solo esto: en el it `cambia vacunas y peso al pulsar
otra mascota` de `#168 R2: Salud sin hero y con métricas estándar`,
sustituye las dos primeras lineas de las anclas, con su sangria, por:
    await within(await screen.findByTestId('vaccine-row-vaccine-1')).findByText('Vacuna de Luna');
    await waitFor(() => expect(within(screen.getByTestId('vaccine-row-vaccine-1')).getByText('Vacuna de Max')).toBeVisible());
La tercera linea (`queryByText('Vacuna de Luna')` sobre toda la
pantalla) se queda tal cual: tras el cambio de mascota, ni la fila ni
`next-vaccine-card` dicen Luna. Nada mas cambia en H.

Comprueba:
  grep -cF "within(await screen.findByTestId('vaccine-row-vaccine-1')).findByText('Vacuna de Luna')" src/screens/health/index.test.tsx   -> 1
  grep -cF "within(screen.getByTestId('vaccine-row-vaccine-1')).getByText('Vacuna de Max')" src/screens/health/index.test.tsx   -> 1
  grep -cF "screen.findByText('Vacuna de Luna')" src/screens/health/index.test.tsx   -> 0

Donde retomas: c1 entero, tal como esta en el handoff (medida a
/tmp/168-r1.txt y su cadena, sin cambiar ninguna cifra). Lo esperado es
`Tests:       18 failed, 53 passed, 71 total`, y el it `cambia vacunas y
peso` cae ahora por `Unable to find an element with testID:
pet-chip-pet-2`. Copia al impl el `●` de ese it con su `Unable to find`.
Si cae por cualquier otra cosa, PARA. Despues sigue con c2 y el resto
del handoff hasta c27, sin cambios.
```

## Reanudación 2: parada en el verde de B (2026-10-12)

> Codex paró en la primera medida de c4 (verde de B) con c1-c3 commiteados
> (`c5618f43`, `1abc7950`, `2c01414a`) y el cambio de producción de B sin
> stagear en `src/screens/health/index.tsx`. Fallaban los cuatro its de
> `#168 R3: cada vacuna lleva su tile pastel` con `Unable to find an
> element with testID: vaccine-tile-<id>`. La parada fue correcta: los
> tiles existen y son decorativos por R3.6 (`accessibilityElementsHidden`
> e `importantForAccessibility="no-hide-descendants"`), y RNTL 14 deja
> fuera de `getBy*` y `queryBy*` los nodos ocultos a accesibilidad y a sus
> descendientes, salvo con `{ includeHiddenElements: true }`. Las dos
> consultas del it (`vaccine-tile-<id>` y el icono dentro del tile) no la
> llevaban. tasks.md prescribía consultar nodos que R3.6 oculta sin decir
> cómo; el hueco era de la spec.
>
> Corrección del leader, sin enmienda: no cambia ningún requisito, solo
> dos consultas del test. El leader lo midió fuera del árbol, con una copia
> del fichero de test que solo cambia esas dos líneas: los 4 its pasan con
> el cambio de producción de Codex y siguen rojos contra la producción de
> `2c01414a`, por la razón de c3 (3 × `Received length: 3` y 1 ×
> `Expected substring: "flex-row items-center gap-3"`, sin ningún `Unable
> to find`). La corrección entra en un commit de test propio, c3b, medido en
> rojo sobre la producción de HEAD, antes de c4, que queda igual. Son 28
> commits (26 en A-M). El mismo patrón llega a F (tiles y sus iconos, R6.2:
> «decorativo como R3.6») y a G (`me-avatar` y sus iniciales, R7.2): quedan
> cerrados aquí, antes de que paren. H0 sigue siendo `b082f6e5`. Este commit
> solo toca este fichero, que está fuera de la lista cerrada.

Pegar en Codex CLI:

```
Worktree: /home/claude/sites/Pet-Tracker-wt-168   <- PRIMERA LINEA. Trabaja AQUI y en ningun otro sitio
Reanudacion 2 de #168 tras tu parada en el verde de B (c4). Ejecuta y
pega en progress/impl_mobile-tab-headers-canvas.md, bajo una seccion
nueva «## Reanudacion 2»:
  cd /home/claude/sites/Pet-Tracker-wt-168 && pwd
  git branch --show-current
  git rev-parse --short HEAD~1
  git log --oneline b082f6e5..HEAD
  git status --short
PARA si:
- la branch no es feature/168-mobile-tab-headers-canvas;
- HEAD~1 no es 2c01414a (tu c3);
- el log no son exactamente cinco commits: el del leader que anade esta
  reanudacion, 2c01414a, 1abc7950, c5618f43 y fdd98bcf;
- `git status --short` no son exactamente estas dos lineas:
   M mobile-pet-tracker/src/screens/health/index.tsx
  ?? progress/impl_mobile-tab-headers-canvas.md
H0 sigue siendo b082f6e5: todos los diffs se miden contra el. Siguen en
vigor todas las reglas del handoff original. NO descartes tu cambio de
produccion de B: lo apartas y lo restauras tal cual (pasos 1 y 4).

Anclas, desde mobile-pet-tracker/
(`cd /home/claude/sites/Pet-Tracker-wt-168/mobile-pet-tracker && pwd`):
  grep -cF "    const tile = scope.getByTestId(\`vaccine-tile-\${id}\`);" src/screens/health/index.test.tsx   -> 1
  grep -cF "    const glyph = within(tile).getByTestId(icon);" src/screens/health/index.test.tsx   -> 1
  grep -cF "includeHiddenElements" src/screens/health/index.test.tsx   -> 0
  grep -cF 'importantForAccessibility="no-hide-descendants"' src/screens/health/index.tsx   -> 1
  git diff --stat -- src/screens/health/index.tsx | tail -1   -> ` 1 file changed, 26 insertions(+), 5 deletions(-)`
Si alguna no da su cifra, PARA.

Paso 1, aparta el cambio de produccion de B (desde mobile-pet-tracker/):
  cp src/screens/health/index.tsx /tmp/168-b-verde-index.tsx \
    && git checkout HEAD -- src/screens/health/index.tsx \
    && git diff --quiet HEAD -- src/screens/health/index.tsx \
    && test -z "$(git diff --cached --name-only)" \
    && ! cmp -s /tmp/168-b-verde-index.tsx src/screens/health/index.tsx \
    && test "$(grep -cF 'importantForAccessibility="no-hide-descendants"' /tmp/168-b-verde-index.tsx)" = 1
  -> exit 0. Si no, PARA y no toques nada mas.

Paso 2, el cambio de test, y solo esto: en el it.each de `#168 R3: cada
vacuna lleva su tile pastel` de src/screens/health/index.test.tsx,
sustituye las dos primeras lineas de las anclas, con su sangria, por:
    const tile = scope.getByTestId(`vaccine-tile-${id}`, { includeHiddenElements: true });
    const glyph = within(tile).getByTestId(icon, { includeHiddenElements: true });
Nada mas cambia en H ni en ningun otro fichero.

Paso 3, c3b, el rojo con la consulta corregida (desde mobile-pet-tracker/):
  FORCE_COLOR=0 bunx jest --runTestsByPath src/__tests__/consistency-classnames.test.ts src/screens/health/index.test.tsx > /tmp/168-r2b.txt 2>&1; echo "exit=$?"
    -> exit=1 y `Tests:       6 failed, 132 passed, 138 total`
  grep -qE '^Tests: +6 failed, 132 passed, 138 total$' /tmp/168-r2b.txt \
    && test "$(grep -E '^  ● ' /tmp/168-r2b.txt | grep -cvxF '  ● Console')" = 6 \
    && test "$(grep -E '^  ● ' /tmp/168-r2b.txt | grep -cF '#168 R3: cada vacuna lleva su tile pastel')" = 4 \
    && test "$(grep -E '^  ● ' /tmp/168-r2b.txt | grep -cF 'screens/health/index.tsx importa y aplica sus 3 esquinas')" = 1 \
    && test "$(grep -E '^  ● ' /tmp/168-r2b.txt | grep -cF '#98 R10')" = 1 \
    && test "$(grep -cF 'Received length: 3' /tmp/168-r2b.txt)" = 3 \
    && test "$(grep -cF 'Expected substring: "flex-row items-center gap-3"' /tmp/168-r2b.txt)" = 1 \
    && ! grep -qF 'Unable to find' /tmp/168-r2b.txt \
    && ! grep -qE 'Test suite failed to run|TypeError|ReferenceError|SyntaxError|Cannot find module' /tmp/168-r2b.txt \
    && test "$(grep -cF 'includeHiddenElements: true' src/screens/health/index.test.tsx)" = 2 \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && <LINT 0> \
    && git add src/screens/health/index.test.tsx \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/screens/health/index.test.tsx' \
    && <LIMPIO> \
    && git commit -m 'test(mobile): busca los tiles ocultos a accesibilidad (#168 R3)'
Copia al impl la linea `Tests:` y los seis `●` con su matcher y su
Expected/Received.

Paso 4, restaura el cambio de produccion de B (desde mobile-pet-tracker/):
  cp /tmp/168-b-verde-index.tsx src/screens/health/index.tsx \
    && git diff --stat -- src/screens/health/index.tsx | tail -1
    -> ` 1 file changed, 26 insertions(+), 5 deletions(-)`
y `git status --short` desde la raiz da exactamente:
   M mobile-pet-tracker/src/screens/health/index.tsx
  ?? progress/impl_mobile-tab-headers-canvas.md
Si no, PARA.

Paso 5: c4 entero, tal como esta en el handoff (medida a /tmp/168-g2.txt
y su cadena, sin cambiar ninguna cifra): `Tests:       138 passed, 138
total` y GUARDAS 92. Despues sigue con c5 y el resto del handoff hasta
c27, con estas tres correcciones:

- Regla para F y G (RNTL 14 deja fuera de getBy*/queryBy*/findBy* los
  nodos con `accessibilityElementsHidden` o
  `importantForAccessibility="no-hide-descendants"` y a sus
  descendientes): toda consulta a `<fila>-tile`, a `profile-icon-*`, a
  `me-avatar` y a `me-avatar-initials` lleva
  `{ includeHiddenElements: true }` como segundo argumento, tambien las
  negativas: en la fila sin iniciales de G,
  `queryByTestId('me-avatar', { includeHiddenElements: true })` es null.
  Sin la opcion, ese null pasaria aunque `me-avatar` existiera. Nunca
  `toBeVisible()` sobre esos nodos (RNTL da false en los ocultos);
  `toHaveTextContent` vale. Las cifras de c11-c14 no cambian.
- c26, traceability: la fila R3 lleva como rojo c3 `2c01414a` + c3b
  (su hash corto y su mensaje), `rojo → verde` hacia c4.
- Los commits de A-M son 26 (c1-c25 mas c3b) y en total 28: donde el
  handoff dice 27 y 25, cuenta 28 y 26.
```

## Reanudación 3: tras el commit de c3b (2026-10-12)

> c3b quedó commiteado y bien (`675c465e`: exactamente las dos consultas
> con `{ includeHiddenElements: true }`, rojo `6 failed, 132 passed, 138
> total`, typecheck y lint 0). Codex paró después: al extraer la cadena se
> llevó la prosa que la Reanudación 2 ponía justo debajo del `git commit`,
> sin línea en blanco, y bash la ejecutó (`Tests:: command not found`,
> exit=127). No hubo daño: árbol limpio salvo el impl, y el verde de B
> sigue en `/tmp/168-b-verde-index.tsx` (el leader lo comparó con HEAD:
> 26 inserciones y 5 borrados, como antes del paso 1). El fallo fue de
> redacción del leader, igual que en #170. Esta reanudación hace el paso 4
> de la Reanudación 2 y retoma en c4. Cada cadena termina en su línea
> `git commit -m '...'`, y no hay prosa pegada a ningún comando. H0 sigue
> siendo `b082f6e5`. Este commit solo toca este fichero, que está fuera de
> la lista cerrada.

Pegar en Codex CLI:

```
Worktree: /home/claude/sites/Pet-Tracker-wt-168   <- PRIMERA LINEA. Trabaja AQUI y en ningun otro sitio
Reanudacion 3 de #168 tras el commit de c3b. Ejecuta y pega en
progress/impl_mobile-tab-headers-canvas.md, bajo una seccion nueva
«## Reanudacion 3»:
  cd /home/claude/sites/Pet-Tracker-wt-168 && pwd
  git branch --show-current
  git rev-parse --short HEAD~1
  git log --oneline b082f6e5..HEAD
  git status --short
PARA si:
- la branch no es feature/168-mobile-tab-headers-canvas;
- HEAD~1 no es 675c465e (tu c3b);
- el log no son exactamente siete commits: el del leader que anade esta
  reanudacion, 675c465e, f08b7b79, 2c01414a, 1abc7950, c5618f43 y
  fdd98bcf;
- `git status --short` no es exactamente esta linea:
  ?? progress/impl_mobile-tab-headers-canvas.md
H0 sigue siendo b082f6e5. Siguen en vigor todas las reglas del handoff
original y las tres correcciones del paso 5 de la Reanudacion 2.

Regla de extraccion: cada cadena empieza en su primera linea de comando
y termina en su linea `git commit -m '...'`, esa incluida. Nada de lo
que va detras es comando: ni las cabeceras `-- Bloque ... --`, ni las
lineas `cN, ...`, ni la prosa. Las lineas con `->` son lo esperado, no
comandos.

Anclas, desde mobile-pet-tracker/
(`cd /home/claude/sites/Pet-Tracker-wt-168/mobile-pet-tracker && pwd`):
  grep -cF 'importantForAccessibility="no-hide-descendants"' /tmp/168-b-verde-index.tsx   -> 1
  grep -cF 'includeHiddenElements: true' src/screens/health/index.test.tsx   -> 2
  git diff --stat HEAD -- . | wc -l   -> 0
Si alguna no da su cifra, PARA.

Paso 1, restaura el verde de B (el paso 4 de la Reanudacion 2), desde
mobile-pet-tracker/:
  cp /tmp/168-b-verde-index.tsx src/screens/health/index.tsx && git diff --stat -- src/screens/health/index.tsx | tail -1
    -> ` 1 file changed, 26 insertions(+), 5 deletions(-)`
  git -C .. status --short
    -> exactamente estas dos lineas:
        M mobile-pet-tracker/src/screens/health/index.tsx
       ?? progress/impl_mobile-tab-headers-canvas.md
Si no, PARA.

Paso 2: c4 entero, tal como esta en el handoff original (medida a
/tmp/168-g2.txt y su cadena, sin cambiar ninguna cifra): `Tests:
138 passed, 138 total` y GUARDAS 92. Despues sigue con c5 y el resto
del handoff hasta c27, con las tres correcciones del paso 5 de la
Reanudacion 2 (consultas a nodos ocultos en F y G, fila R3 de la
trazabilidad con c3 y c3b, 28 commits en total y 26 en A-M).
```

## Reanudación 4: tras la parada en c7 (2026-10-12)

> c4 a c7 quedaron commiteados y bien (`74447b19`, `bb71dc3b`, `e65457de`,
> `ce060f18`). Codex paró en c7 por dos causas, y ninguna es suya:
>
> 1. El lint de c7 no llegó a terminar. El kernel mató eslint por falta de
>    memoria (`error: Failed to run "eslint" due to signal SIGKILL`) mientras
>    otras sesiones del VPS corrían jest y eslint, y `bunx expo lint` salió
>    con 0 de todos modos. Codex lo cazó porque leyó el log. El leader repitió
>    `bunx expo lint --no-cache` sobre `ce060f18` sin esa carga: salida vacía,
>    exit 0, 0 warnings. c7 queda validado y no se toca. `<LINT n>` no
>    detectaba ese caso; a partir de aquí incluye `! grep -qF 'Failed to run'`
>    y una regla de reintento.
> 2. El ancla de c8 `grep -cF 'h-52 w-full rounded-card'` = 1 estaba mal.
>    `pet-info-skeleton` ya lleva ese literal en la base, y R4.4 se lo da
>    también a `profile-hero-skeleton`, así que tras el verde de D sale 2.
>    El error fue del leader: escribió la cifra futura sin medir la base. Se
>    corrige a 2 y se añade un ancla que fija a qué skeleton va.
>
> El leader ha comprobado las demás cifras futuras de Perfil y Nutrición
> contra la base y la spec (`bg-accent-soft` 2→1 en E, `CONTINUOUS_CORNER`
> 4→8 en Perfil y 2→1 en Nutrición), y cuadran. H0 sigue siendo
> `b082f6e5`. Este commit solo toca este fichero, que está fuera de la lista
> cerrada.

Pegar en Codex CLI:

```
Worktree: /home/claude/sites/Pet-Tracker-wt-168   <- PRIMERA LINEA. Trabaja AQUI y en ningun otro sitio
Reanudacion 4 de #168 tras la parada en c7. Ejecuta y pega en
progress/impl_mobile-tab-headers-canvas.md, bajo una seccion nueva
«## Reanudacion 4»:
  cd /home/claude/sites/Pet-Tracker-wt-168 && pwd
  git branch --show-current
  git rev-parse --short HEAD~1
  git log --oneline b082f6e5..HEAD
  git status --short
PARA si:
- la branch no es feature/168-mobile-tab-headers-canvas;
- HEAD~1 no es ce060f18 (tu c7);
- el log no son exactamente doce commits: el del leader que anade esta
  reanudacion, ce060f18, e65457de, bb71dc3b, 74447b19, 9039b87b,
  675c465e, f08b7b79, 2c01414a, 1abc7950, c5618f43 y fdd98bcf;
- `git status --short` no es exactamente esta linea:
  ?? progress/impl_mobile-tab-headers-canvas.md
H0 sigue siendo b082f6e5. Siguen en vigor todas las reglas del handoff
original y las tres correcciones del paso 5 de la Reanudacion 2.
c7 no se rehace ni se enmienda: el leader valido su lint (salida vacia,
exit 0, 0 warnings).

Regla de extraccion: cada cadena empieza en su primera linea de comando
y termina en su linea `git commit -m '...'`, esa incluida. Nada de lo
que va detras es comando: ni las cabeceras `-- Bloque ... --`, ni las
lineas `cN, ...`, ni la prosa. Las lineas con `->` son lo esperado, no
comandos.

Cambio 1, el lint. Desde aqui, y hasta c27, `<LINT n>` es:
  bunx expo lint --no-cache > /tmp/168-lint.txt 2>&1 && ! grep -qF 'Failed to run' /tmp/168-lint.txt && test "$(grep -cE '^ +[0-9]+:[0-9]+ +warning ' /tmp/168-lint.txt)" = <n>
Sustituye a la definicion del handoff original; las n de cada cadena no
cambian (0 salvo c17-c21: 1, 2, 2, 2, 1). Si una cadena para y
/tmp/168-lint.txt contiene `Failed to run`, eslint murio por memoria y
no es un fallo de tu codigo: no toques nada, ejecuta `sleep 60` y
relanza esa misma cadena entera desde su primera linea (la medida de
jest que va antes no se repite). Como mucho tres intentos por cadena; si
el tercero tambien da `Failed to run`, PARA y copia al impl las tres
salidas.

Anclas, desde mobile-pet-tracker/
(`cd /home/claude/sites/Pet-Tracker-wt-168/mobile-pet-tracker && pwd`):
  grep -cF 'h-52 w-full rounded-card' src/screens/profile/index.tsx   -> 1
  grep -cF 'testID="profile-hero-skeleton" className="h-80 w-full rounded-card"' src/screens/profile/index.tsx   -> 1
  git diff --stat HEAD -- . | wc -l   -> 0
Si alguna no da su cifra, PARA.

Paso 1: c8 (el verde de D, como en el handoff original, con el ancla del
skeleton corregida; tasks.md bloque D (2); `PetAvatar` de
src/components/pet-avatar.tsx tal cual, sin tocarlo; `<PetPills>` con
`testID="profile-pet-chips"` en su contenedor, R5 decide su contenido).
Desde mobile-pet-tracker/:
  FORCE_COLOR=0 bunx jest --runTestsByPath src/screens/profile/index.test.tsx > /tmp/168-g4.txt 2>&1; echo "exit=$?"
    -> exit=0 y `Tests:       47 passed, 47 total`
  <GUARDAS> > /tmp/168-g4-guardas.txt 2>&1; echo "exit=$?"
  grep -qE '^Tests: +47 passed, 47 total$' /tmp/168-g4.txt \
    && grep -qE '^Tests: +92 passed, 92 total$' /tmp/168-g4-guardas.txt \
    && test "$(grep -cF '<PetHeroHeader' src/screens/profile/index.tsx)" = 0 \
    && test "$(grep -cF 'h-52 w-full rounded-card' src/screens/profile/index.tsx)" = 2 \
    && test "$(grep -cF 'testID="profile-hero-skeleton" className="h-52 w-full rounded-card"' src/screens/profile/index.tsx)" = 1 \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && <LINT 0> \
    && git add src/screens/profile/index.tsx \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/screens/profile/index.tsx' \
    && <LIMPIO> \
    && git commit -m 'feat(mobile): tarjeta de mascota en Perfil (#168 R4)'

Paso 2: c9 y el resto del handoff original hasta c27, con el `<LINT n>`
del cambio 1 y las tres correcciones del paso 5 de la Reanudacion 2
(consultas a nodos ocultos en F y G, fila R3 de la trazabilidad con c3 y
c3b, 28 commits en total y 26 en A-M).
```

## Reanudación 5: parada en la medida de c8 (2026-10-12)

> c8 paró en su medida, antes de la cadena: `1 failed, 46 passed, 47
> total`. El it `reserva h-52 mientras carga el detalle` (c7, `ce060f18`)
> compara el `className` del host de `Skeleton` con
> `toBe('h-52 w-full rounded-card')`, pero HeroUI antepone `skeleton__root`
> (Received `"skeleton__root h-52 w-full rounded-card"`). La producción de
> Codex está bien y cumple R4.4. El test siguió al pie de la letra la viñeta
> de tasks.md («`profile-hero-skeleton` con `className` `h-52 w-full
> rounded-card`»), que no avisaba de que el host lleva la clase de HeroUI.
> El repo ya lo compara así en geofences, geofence-editor, health y food
> (`'skeleton__root h-XX w-full rounded-card'`). El fallo es de redacción
> de la spec y del handoff, no de Codex. R4.4 no cambia: la prop que pasa la
> pantalla sigue siendo `h-52 w-full rounded-card`. Por eso no hace falta
> enmienda, y el test se corrige en un commit de test propio, c7b, como c3b
> en la Reanudación 2.
>
> El leader lo probó fuera del árbol, con la línea corregida. Contra la
> producción de HEAD, P da `9 failed, 38 passed, 47 total`: los mismos 9 its
> que c7, y el del skeleton con Expected `"skeleton__root h-52 w-full
> rounded-card"` y Received `"skeleton__root h-80 w-full rounded-card"`, sin
> consultas fuera de las permitidas en c7. Contra el verde de D que Codex
> dejó en el árbol, da `47 passed, 47 total`. H0 sigue siendo `b082f6e5`.
> Este commit solo toca este fichero, que está fuera de la lista cerrada.

Pegar en Codex CLI:

```
Worktree: /home/claude/sites/Pet-Tracker-wt-168   <- PRIMERA LINEA. Trabaja AQUI y en ningun otro sitio
Reanudacion 5 de #168 tras la parada en la medida de c8. Ejecuta y pega
en progress/impl_mobile-tab-headers-canvas.md, bajo una seccion nueva
«## Reanudacion 5»:
  cd /home/claude/sites/Pet-Tracker-wt-168 && pwd
  git branch --show-current
  git rev-parse --short HEAD~1
  git log --oneline b082f6e5..HEAD
  git status --short
PARA si:
- la branch no es feature/168-mobile-tab-headers-canvas;
- HEAD~1 no es 31605b09 (la Reanudacion 4);
- el log no son exactamente trece commits: el del leader que anade esta
  reanudacion, 31605b09, ce060f18, e65457de, bb71dc3b, 74447b19,
  9039b87b, 675c465e, f08b7b79, 2c01414a, 1abc7950, c5618f43 y
  fdd98bcf;
- `git status --short` no es exactamente estas dos lineas:
   M mobile-pet-tracker/src/screens/profile/index.tsx
  ?? progress/impl_mobile-tab-headers-canvas.md
H0 sigue siendo b082f6e5. Siguen en vigor todas las reglas del handoff
original, las correcciones del paso 5 de la Reanudacion 2 y el
`<LINT n>` con reintento de la Reanudacion 4.

Regla de extraccion: cada cadena empieza en su primera linea de comando
y termina en su linea `git commit -m '...'`, esa incluida. Nada de lo
que va detras es comando: ni las cabeceras `-- Bloque ... --`, ni las
lineas `cN, ...`, ni la prosa. Las lineas con `->` son lo esperado, no
comandos.

Anclas, desde mobile-pet-tracker/
(`cd /home/claude/sites/Pet-Tracker-wt-168/mobile-pet-tracker && pwd`):
  git diff --numstat -- src/screens/profile/index.tsx | cut -f1   -> 10
  git diff --numstat -- src/screens/profile/index.tsx | cut -f2   -> 5
  grep -cF 'testID="profile-hero-skeleton" className="h-52 w-full rounded-card"' src/screens/profile/index.tsx   -> 1
  grep -cF "toBe('h-52 w-full rounded-card')" src/screens/profile/index.test.tsx   -> 1
  grep -cF "toBe('skeleton__root h-24 w-full rounded-card')" src/screens/geofences/index.test.tsx   -> 1
  git diff --cached --name-only | wc -l   -> 0
Si alguna no da su cifra, PARA.

Paso 1, guarda el verde de D y vuelve a HEAD, desde mobile-pet-tracker/:
  cp src/screens/profile/index.tsx /tmp/168-d-verde-index.tsx && git checkout HEAD -- src/screens/profile/index.tsx
Comprueba:
  grep -cF 'testID="profile-hero-skeleton" className="h-52 w-full rounded-card"' /tmp/168-d-verde-index.tsx
    -> 1
  git diff --stat HEAD -- . | wc -l
    -> 0
  git diff --cached --name-only | wc -l
    -> 0
Si no, PARA.

Paso 2, c7b, el rojo de D con el className del host. En P cambia SOLO
esta linea (el it `reserva h-52 mientras carga el detalle`):
      expect(skeleton.props.className).toBe('h-52 w-full rounded-card');
por esta:
      expect(skeleton.props.className).toBe('skeleton__root h-52 w-full rounded-card');
y nada mas. Desde mobile-pet-tracker/:
  FORCE_COLOR=0 bunx jest --runTestsByPath src/screens/profile/index.test.tsx > /tmp/168-r4b.txt 2>&1; echo "exit=$?"
    -> exit=1 y `Tests:       9 failed, 38 passed, 47 total`
  grep -qE '^Tests: +9 failed, 38 passed, 47 total$' /tmp/168-r4b.txt \
    && test "$(grep -E '^  ● ' /tmp/168-r4b.txt | grep -cvxF '  ● Console')" = 9 \
    && test "$(grep -E '^  ● ' /tmp/168-r4b.txt | grep -cF '#168 R4:')" = 6 \
    && test "$(grep -cF 'Expected: "skeleton__root h-52 w-full rounded-card"' /tmp/168-r4b.txt)" = 1 \
    && test "$(grep -cF 'Received: "skeleton__root h-80 w-full rounded-card"' /tmp/168-r4b.txt)" = 1 \
    && ! grep -qE 'Test suite failed to run|TypeError|ReferenceError|SyntaxError|Cannot find module' /tmp/168-r4b.txt \
    && ! grep -E 'Unable to find' /tmp/168-r4b.txt | grep -vE 'Unable to find an element with testID: (profile-pet-card|profile-pet-avatar|profile-pet-name|profile-pet-chips)$' \
    && test "$(git diff --shortstat -- src/screens/profile/index.test.tsx)" = ' 1 file changed, 1 insertion(+), 1 deletion(-)' \
    && test "$(grep -cF "toBe('skeleton__root h-52 w-full rounded-card')" src/screens/profile/index.test.tsx)" = 1 \
    && test "$(grep -cF "toBe('h-52 w-full rounded-card')" src/screens/profile/index.test.tsx)" = 0 \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && <LINT 0> \
    && git add src/screens/profile/index.test.tsx \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/screens/profile/index.test.tsx' \
    && <LIMPIO> \
    && git commit -m 'test(mobile): el skeleton de Perfil se compara con skeleton__root (#168 R4)'

Paso 3, restaura el verde de D, desde mobile-pet-tracker/:
  cp /tmp/168-d-verde-index.tsx src/screens/profile/index.tsx && git diff --shortstat -- src/screens/profile/index.tsx
    -> ` 1 file changed, 10 insertions(+), 5 deletions(-)`
  git -C .. status --short
    -> exactamente estas dos lineas:
        M mobile-pet-tracker/src/screens/profile/index.tsx
       ?? progress/impl_mobile-tab-headers-canvas.md
Si no, PARA.

Paso 4: c8 entero, tal como esta en el paso 1 de la Reanudacion 4 (medida
a /tmp/168-g4.txt, `Tests:       47 passed, 47 total`, GUARDAS 92, el
ancla de skeleton corregida y el mismo mensaje), sin cambiar ninguna
cifra.

Paso 5: c9 y el resto del handoff original hasta c27, con el `<LINT n>`
de la Reanudacion 4 y las correcciones del paso 5 de la Reanudacion 2,
mas estas dos, que ajustan las suyas:
- c26, traceability: la fila R4 lleva como rojo c7 `ce060f18` + c7b (su
  hash corto y su mensaje), `rojo → verde` hacia c8; la fila R3 sigue
  con c3 `2c01414a` + c3b.
- Los commits de A-M son 27 (c1-c25 mas c3b y c7b) y en total 29: donde
  el handoff dice 27 y 25, o la Reanudacion 2 dice 28 y 26, cuenta 29
  y 27.
```

## Reanudación 6: parada antes de la cadena de c10 (2026-10-12)

> c7b, c8 y c9 quedaron commiteados y bien (`b550084e`, `30db66c1`,
> `11ef23d5`). El verde de E está escrito (11 inserciones y 16 borrados en
> `src/screens/profile/index.tsx`, sin stagear) y sus dos medidas dieron lo
> prescrito: `113 passed, 113 total` y GUARDAS 92. Codex paró porque el
> extractor de medidas que usa tomó como medida de c10 todo lo que hay entre
> la línea `c10, ...` y la `c11, ...`. Ese tramo incluye el «Control antes
> del rojo» del bloque F, que corrió antes de añadir los dobles y comparó
> contra 92. El handoff no tiene error y el código tampoco: solo se ejecutó
> un jest de más, que no escribe en el árbol. La cadena de c10 no llegó a
> ejecutarse. Esta reanudación repite las dos medidas de c10 (el árbol no ha
> cambiado, pero así la cadena lee medidas de esta sesión), ejecuta su
> cadena y sigue por el bloque F. H0 sigue siendo `b082f6e5`. Este commit
> solo toca este fichero, que está fuera de la lista cerrada.

Pegar en Codex CLI:

```
Worktree: /home/claude/sites/Pet-Tracker-wt-168   <- PRIMERA LINEA. Trabaja AQUI y en ningun otro sitio
Reanudacion 6 de #168 tras la parada antes de la cadena de c10. Ejecuta
y pega en progress/impl_mobile-tab-headers-canvas.md, bajo una seccion
nueva «## Reanudacion 6»:
  cd /home/claude/sites/Pet-Tracker-wt-168 && pwd
  git branch --show-current
  git rev-parse --short HEAD~1
  git log --oneline b082f6e5..HEAD
  git status --short
PARA si:
- la branch no es feature/168-mobile-tab-headers-canvas;
- HEAD~1 no es 11ef23d5 (tu c9);
- el log no son exactamente diecisiete commits: el del leader que anade
  esta reanudacion, 11ef23d5, 30db66c1, b550084e, ae5085bf, 31605b09,
  ce060f18, e65457de, bb71dc3b, 74447b19, 9039b87b, 675c465e, f08b7b79,
  2c01414a, 1abc7950, c5618f43 y fdd98bcf;
- `git status --short` no es exactamente estas dos lineas:
   M mobile-pet-tracker/src/screens/profile/index.tsx
  ?? progress/impl_mobile-tab-headers-canvas.md
H0 sigue siendo b082f6e5. Siguen en vigor todas las reglas del handoff
original, las correcciones del paso 5 de la Reanudacion 2, el
`<LINT n>` con reintento de la Reanudacion 4 y las dos correcciones del
paso 5 de la Reanudacion 5 (fila R4 con c7 + c7b; 29 commits en total y
27 en A-M).

Regla de extraccion: cada cadena empieza en su primera linea de comando
y termina en su linea `git commit -m '...'`, esa incluida. Nada de lo
que va detras es comando: ni las cabeceras `-- Bloque ... --`, ni las
lineas `cN, ...`, ni la prosa. Las lineas con `->` son lo esperado, no
comandos.

Regla de medidas: la medida de cada cN son SOLO las lineas
`FORCE_COLOR=0 bunx jest ...` y `<GUARDAS> ...` que van entre su linea
`cN, ...` y la primera linea de su cadena (`grep -qE '^Tests: ...`).
Lo que va detras del `git commit` de cN no es de cN. Los controles con
nombre propio («Control antes del rojo» de F y los que haya en otros
bloques) se miden en su momento, despues de hacer lo que su parrafo
pide, y se comparan con su propia linea `->`, nunca con la de otro
paso. Si tu extractor no puede respetar eso, extrae a mano.

Anclas, desde mobile-pet-tracker/
(`cd /home/claude/sites/Pet-Tracker-wt-168/mobile-pet-tracker && pwd`):
  git diff --numstat -- src/screens/profile/index.tsx | cut -f1   -> 11
  git diff --numstat -- src/screens/profile/index.tsx | cut -f2   -> 16
  git diff --name-only HEAD -- . | wc -l   -> 1
  git diff --cached --name-only | wc -l   -> 0
  grep -c 'bg-accent-soft' src/screens/profile/index.tsx   -> 1
  grep -cF "jest.mock('reicon-react-native'" src/screens/profile/index.test.tsx   -> 0
Si alguna no da su cifra, PARA.

Paso 1: c10 entero, tal como esta en el handoff original: sus dos
medidas (a /tmp/168-g5.txt, `Tests:       113 passed, 113 total`, y
GUARDAS a /tmp/168-g5-guardas.txt, 92) y su cadena, con el `<LINT 0>`
de la Reanudacion 4, sin cambiar ninguna cifra. Mensaje:
`feat(mobile): chips pastel en Perfil (#168 R5)`.

Paso 2: el «Control antes del rojo» del bloque F, tal como esta en el
handoff original: primero anade SOLO los dos dobles nuevos de P y
despues mide a /tmp/168-f-control.txt -> `Tests:       50 passed, 50
total`. Si no da eso, PARA.

Paso 3: c11 y el resto del handoff original hasta c27, con todas las
correcciones citadas arriba.
```

## Reanudación 7: parada en la medida de c18 (2026-10-12)

> c10–c17 quedaron commiteados y bien (de `b6cfa1b5` a `3abdfbc3`). El
> verde de I está escrito en `src/app/(tabs)/food.tsx` (55 inserciones y 59
> borrados, sin stagear), pero su primera medida dio `44 failed, 91 passed,
> 135 total` con `TypeError: Cannot read properties of undefined (reading
> 'setAttribute')` al montar `AnimatedCircle`. La causa está en el doble de
> `react-native-svg` de c17: `Circle` es una clase sin `setNativeProps`. El
> ref de `createAnimatedComponent` apunta entonces a la instancia de esa
> clase, y `_updatePropsJS` de Reanimated 4.5.1
> (`ReanimatedModule/js-reanimated/index.ts`) no encuentra `setNativeProps`
> ni `style`. Cae en la rama web y llama a `component._touchableNode.setAttribute`,
> que no existe. La producción de Codex está bien.
>
> design.md D6 da el doble de `src/screens/home/weekly-activity-chart.test.tsx`
> como patrón de referencia: `Rect` y `Line` son funciones que devuelven un
> `View` con las props tal cual, y en producción se animan con
> `createAnimatedComponent`. Con React 19.2 el `ref` llega a la función como
> prop y el spread lo pasa al `View`. D6 solo pide clase o `forwardRef` si
> la función falla por el ref, y no falla. Sin la clase, `React` queda sin
> uso en la fábrica y se borra también, porque si no el lint sumaría un
> warning. No hace falta enmienda: D6 fija la intención, no el código, y la
> intención se cumple. El test se corrige en un commit de test propio, c17b,
> como c3b y c7b.
>
> El leader lo probó fuera del árbol, con este mismo texto en F:
> - Contra el verde de I del árbol: `72 passed, 72 total` (solo F), sin
>   `TypeError`. Un it de sonda leyó
>   `host.props.jestAnimatedProps.value` en `food-plan-ring-fill` dentro de un
>   `waitFor`: claves `['strokeDashoffset']` y 276.46, y `r` = 44 en el
>   mismo host. El doble con función, por tanto, deja pasar
>   `jestAnimatedProps` (lo que exigía D6).
> - Contra la producción de HEAD: `7 failed, 65 passed, 72 total`, los mismos
>   7 its que el doble de c17 y solo las consultas permitidas en c17.
> - Lint por stdin: 1 warning, el mismo de c17 (`expectKcalBarTiming`).
>
> Sumando C, el rojo de c17b es el de c17 (9/126/135) y el verde de c18
> queda en 135/135, como prescribe el handoff. H0 sigue siendo `b082f6e5`.
> Este commit solo toca este fichero, que está fuera de la lista cerrada.

Pegar en Codex CLI:

```
Worktree: /home/claude/sites/Pet-Tracker-wt-168   <- PRIMERA LINEA. Trabaja AQUI y en ningun otro sitio
Reanudacion 7 de #168 tras la parada en la medida de c18. Ejecuta y pega
en progress/impl_mobile-tab-headers-canvas.md, bajo una seccion nueva
«## Reanudacion 7»:
  cd /home/claude/sites/Pet-Tracker-wt-168 && pwd
  git branch --show-current
  git rev-parse --short HEAD~1
  git log --oneline b082f6e5..HEAD
  git status --short
PARA si:
- la branch no es feature/168-mobile-tab-headers-canvas;
- HEAD~1 no es 3abdfbc3 (tu c17);
- el log no son exactamente veintiseis commits: el del leader que anade
  esta reanudacion, 3abdfbc3, 6b371832, 03064141, 90908a6f, d8c5c06b,
  72a3fe23, 56e75042, b6cfa1b5, c3198fe4, 11ef23d5, 30db66c1, b550084e,
  ae5085bf, 31605b09, ce060f18, e65457de, bb71dc3b, 74447b19, 9039b87b,
  675c465e, f08b7b79, 2c01414a, 1abc7950, c5618f43 y fdd98bcf;
- `git status --short` no es exactamente estas dos lineas:
   M mobile-pet-tracker/src/app/(tabs)/food.tsx
  ?? progress/impl_mobile-tab-headers-canvas.md
H0 sigue siendo b082f6e5. Siguen en vigor todas las reglas del handoff
original, las correcciones del paso 5 de la Reanudacion 2, el
`<LINT n>` con reintento de la Reanudacion 4, las dos correcciones del
paso 5 de la Reanudacion 5 (aqui ajustadas en el paso 5) y la regla de
medidas de la Reanudacion 6, que se repite abajo.

Regla de extraccion: cada cadena empieza en su primera linea de comando
y termina en su linea `git commit -m '...'`, esa incluida. Nada de lo
que va detras es comando: ni las cabeceras `-- Bloque ... --`, ni las
lineas `cN, ...`, ni la prosa. Las lineas con `->` son lo esperado, no
comandos.

Regla de medidas: la medida de cada cN son SOLO las lineas
`FORCE_COLOR=0 bunx jest ...` y `<GUARDAS> ...` que van entre su linea
`cN, ...` y la primera linea de su cadena (`grep -qE '^Tests: ...`).
Lo que va detras del `git commit` de cN no es de cN. Los controles con
nombre propio se miden en su momento, despues de hacer lo que su parrafo
pide, y se comparan con su propia linea `->`, nunca con la de otro
paso. Si tu extractor no puede respetar eso, extrae a mano.

Anclas, desde mobile-pet-tracker/
(`cd /home/claude/sites/Pet-Tracker-wt-168/mobile-pet-tracker && pwd`):
  git diff --numstat -- 'src/app/(tabs)/food.tsx' | cut -f1   -> 55
  git diff --numstat -- 'src/app/(tabs)/food.tsx' | cut -f2   -> 59
  git diff --name-only HEAD -- . | wc -l   -> 1
  git diff --cached --name-only | wc -l   -> 0
  grep -cxF 'const AnimatedCircle = Animated.createAnimatedComponent(Circle);' 'src/app/(tabs)/food.tsx'   -> 1
  grep -c 'MockCircle' 'src/app/(tabs)/__tests__/food.test.tsx'   -> 2
  grep -cF "const React = jest.requireActual<typeof import('react')>('react');" 'src/app/(tabs)/__tests__/food.test.tsx'   -> 1
  grep -cF 'Rect: (mockProps: Record<string, unknown>) =>' src/screens/home/weekly-activity-chart.test.tsx   -> 1
Si alguna no da su cifra, PARA.

Paso 1, guarda el verde de I y vuelve a HEAD, desde mobile-pet-tracker/:
  cp 'src/app/(tabs)/food.tsx' /tmp/168-i-verde-food.tsx && git checkout HEAD -- 'src/app/(tabs)/food.tsx'
Comprueba:
  grep -cxF 'const AnimatedCircle = Animated.createAnimatedComponent(Circle);' /tmp/168-i-verde-food.tsx
    -> 1
  git diff --stat HEAD -- . | wc -l
    -> 0
  git diff --cached --name-only | wc -l
    -> 0
Si no, PARA.

Paso 2, c17b, el rojo de I con el doble de Circle como funcion (design.md
D6, patron de weekly-activity-chart.test.tsx). En F, dentro de
`jest.mock('react-native-svg', ...)`, este tramo:
  const React = jest.requireActual<typeof import('react')>('react');
  const actual = jest.requireActual<typeof import('react-native-svg')>('react-native-svg');
  const { View } = jest.requireActual('react-native');
  class MockCircle extends React.Component<CircleProps> {
    render() { return <View {...this.props} />; }
  }
  return {
    ...actual,
    __esModule: true,
    default: (props: SvgProps) => <View {...props} />,
    Circle: MockCircle,
  };
queda asi:
  const actual = jest.requireActual<typeof import('react-native-svg')>('react-native-svg');
  const { View } = jest.requireActual('react-native');
  return {
    ...actual,
    __esModule: true,
    default: (props: SvgProps) => <View {...props} />,
    Circle: (props: CircleProps) => <View {...props} />,
  };
Fuera la linea de `React` (sin la clase no tiene uso y el lint sumaria un
warning), fuera la clase, y `Circle` pasa a ser la funcion. La sangria es
la del fichero (dos espacios dentro de la fabrica). Nada mas. Desde
mobile-pet-tracker/:
  FORCE_COLOR=0 bunx jest --runTestsByPath src/__tests__/consistency-classnames.test.ts 'src/app/(tabs)/__tests__/food.test.tsx' > /tmp/168-r9b.txt 2>&1; echo "exit=$?"
    -> exit=1 y `Tests:       9 failed, 126 passed, 135 total`
  grep -qE '^Tests: +9 failed, 126 passed, 135 total$' /tmp/168-r9b.txt \
    && test "$(grep -E '^  ● ' /tmp/168-r9b.txt | grep -cvxF '  ● Console')" = 9 \
    && test "$(grep -E '^  ● ' /tmp/168-r9b.txt | grep -cF '#168 R8: food-plan-card pinta el anillo')" = 7 \
    && test "$(grep -E '^  ● ' /tmp/168-r9b.txt | grep -cF 'app/(tabs)/food.tsx importa y aplica sus 1 esquinas')" = 1 \
    && test "$(grep -E '^  ● ' /tmp/168-r9b.txt | grep -cF '#98 R10')" = 1 \
    && ! grep -qE 'Test suite failed to run|TypeError|ReferenceError|SyntaxError|Cannot find module|setAttribute' /tmp/168-r9b.txt \
    && ! grep -E 'Unable to find' /tmp/168-r9b.txt | grep -vE 'Unable to find an element with testID: (food-plan-summary|food-plan-ring|food-plan-ring-track|food-plan-ring-fill)$' \
    && test "$(git diff --shortstat -- 'src/app/(tabs)/__tests__/food.test.tsx')" = ' 1 file changed, 1 insertion(+), 5 deletions(-)' \
    && test "$(grep -c 'MockCircle' 'src/app/(tabs)/__tests__/food.test.tsx')" = 0 \
    && test "$(grep -cxF '    Circle: (props: CircleProps) => <View {...props} />,' 'src/app/(tabs)/__tests__/food.test.tsx')" = 1 \
    && test "$(grep -cF "jest.requireActual<typeof import('react')>('react')" 'src/app/(tabs)/__tests__/food.test.tsx')" = 0 \
    && test "$(grep -cF "jest.mock('react-native-svg'" 'src/app/(tabs)/__tests__/food.test.tsx')" = 1 \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && <LINT 1> \
    && test "$(grep -cF "'expectKcalBarTiming' is defined but never used" /tmp/168-lint.txt)" = 1 \
    && git add 'src/app/(tabs)/__tests__/food.test.tsx' \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/app/(tabs)/__tests__/food.test.tsx' \
    && <LIMPIO> \
    && git commit -m 'test(mobile): el doble de Circle es una función, como en weekly-activity-chart (#168 R8)'

Paso 3, restaura el verde de I, desde mobile-pet-tracker/:
  cp /tmp/168-i-verde-food.tsx 'src/app/(tabs)/food.tsx' && git diff --shortstat -- 'src/app/(tabs)/food.tsx'
    -> ` 1 file changed, 55 insertions(+), 59 deletions(-)`
  git -C .. status --short
    -> exactamente estas dos lineas:
        M mobile-pet-tracker/src/app/(tabs)/food.tsx
       ?? progress/impl_mobile-tab-headers-canvas.md
Si no, PARA.

Paso 4: c18 entero, tal como esta en el handoff original (medida a
/tmp/168-g9.txt, `Tests:       135 passed, 135 total`; GUARDAS a
/tmp/168-g9-guardas.txt, 92; `<LINT 2>` con sus dos warnings; el mismo
mensaje), sin cambiar ninguna cifra.

Paso 5: c19 y el resto del handoff original hasta c27, con todas las
correcciones citadas arriba. En c19 sigue en pie la parada si
`jestAnimatedProps` no llega al host de `food-plan-ring-fill`. Estas dos
sustituyen a las del paso 5 de la Reanudacion 5:
- c26, traceability: la fila R8 lleva como rojo c17 `3abdfbc3` + c17b
  (su hash corto y su mensaje), `rojo → verde` hacia c18. La fila R3
  sigue con c3 `2c01414a` + c3b y la R4 con c7 `ce060f18` + c7b.
- Los commits de A-M son 28 (c1-c25 mas c3b, c7b y c17b) y en total 30.
  Donde el handoff dice 27 y 25, la Reanudacion 2 dice 28 y 26 o la
  Reanudacion 5 dice 29 y 27, cuenta 30 y 28.
```

# Handoff a Codex CLI — #155 mobile-empty-states-pingo

> Pegar el bloque de abajo en Codex CLI. La spec está firmada (commit de firma
> `a7f6d708`, aprobación vía Notion el 2026-10-08). Es la tercera feature del
> bloque de deleite visual: Pingo entra en los estados vacíos de ocho
> pantallas a través de un único componente `EmptyState`, con seis poses
> nuevas en WebP y cinco frases nuevas (más un valor cambiado) en los dos
> idiomas. Son 21 commits: R1-R9 en pares rojo/verde, R10 y R11 nacen verdes
> (sus rojos los demuestran las sondas S1-S3, que Codex planta, mide y
> revierte), y uno final de trazabilidad. La prueba de humo de R12, en un dev
> build de Android, es del humano y cierra la feature.
>
> `node_modules` ya está instalado en `Pet-Tracker-wt-155/mobile-pet-tracker`.
> La branch ya incluye `origin/main` fca7c399 (#153, PR #199), mergeado en
> 6a9cc241 antes de H0. Las seis poses ya están convertidas a WebP en
> `/home/claude/pet-tracker-mascot/webp/`. Las anclas D1-D7 de design.md
> (dependencia de #153) las re-verificó el leader en H0; no van aquí.

---

```
Worktree: /home/claude/sites/Pet-Tracker-wt-155   <- PRIMERA LINEA. Trabaja AQUI y en ningun otro sitio
Antes de tocar nada, ejecuta `pwd`, `git branch --show-current`,
`git rev-parse --short HEAD` y `git status --short` y pega las cuatro
salidas al principio de progress/impl_mobile-empty-states-pingo.md.
El hash es H0 (el commit que anade este handoff), y es tambien el «HEAD
del handoff» de tasks.md T0 y R11. En todos los comandos de abajo,
sustituye `<H0>` por ese hash literal: todos los `git diff` se miden
contra el. PARA si la branch no es feature/155-mobile-empty-states-pingo
o si `git status --short` no sale vacio. No toques
/home/claude/sites/Pet-Tracker, Pet-Tracker-wt-18, Pet-Tracker-wt-118,
Pet-Tracker-wt-146, Pet-Tracker-wt-148, Pet-Tracker-wt-152,
Pet-Tracker-wt-153, Pet-Tracker-wt-157, Pet-Tracker-wt-backend,
Pet-Tracker-wt-ui, pet-tracker-43, pt-skills ni ningun otro worktree, ni
cambies de branch en ninguno.

Feature: mobile-empty-states-pingo (#155)
Branch: feature/155-mobile-empty-states-pingo
Spec aprobada: specs/mobile-empty-states-pingo/requirements.md
(status: approved, firma a7f6d708).
Las decisiones A1-A9 de requirements.md §Decisiones abiertas estan
cerradas en su defecto: no reabras ninguna (no confundirlas con las
anclas A1-A29 de tasks.md T0, que son comandos). Lee tambien, enteros:
specs/mobile-empty-states-pingo/design.md, tasks.md y traceability.md, y
requirements.md hasta el final. tasks.md es tu guion (T0-T12). Los
titulos de describe e it son LITERALES de requirements.md: copialos tal
cual, con sus tildes y sus simbolos (`×`, `%s`, `%i`, `100 000`).

== QUE HACES ==

Los 21 commits, en este orden exacto (el de tasks.md §Orden):
T1 R1, T2 R2, T3 R3, T4 R4, T5 R5, T6 R6, T7 R7, T8 R8, T9 R9 (rojo y
verde cada uno), T10 R10 y T11 R11 (nacen verdes, un commit cada uno) y
el commit final de trazabilidad. Rojo SIEMPRE antes de su verde, en
commits separados. Si escribes un verde antes que su rojo, ese requisito
nace verde y pierde su historial (C4 de CHECKPOINTS.md); en #19 se metio
todo en un solo commit y no vale. R10 y R11 no tienen rojo honesto: su
rojo lo demuestran las sondas S1-S3, nunca un cambio commiteado.

Esto manda sobre tasks.md:
- Trazabilidad: tasks.md dice «tras el commit verde de cada tarea,
  rellena su fila». NO: traceability.md se rellena entera UNA vez, al
  final, en el commit de trazabilidad del Cierre. Ningun commit de T1-T11
  la toca.
- tasks.md T11 (3) pide `./init.sh`: NO lo lances. Lo corre el leader
  (comparte Postgres y LocalStack con otras sesiones). En su lugar va la
  suite entera de jest del Cierre.
- Sondas: tasks.md T10 y T11 las plantan antes del commit. NO: primero
  commiteas el candado (su cadena, abajo) y DESPUES plantas cada sonda
  sobre ese HEAD, la mides y la reviertes. Asi `limpio=0` es verificable.
- No hay commits `refactor(...)`: tasks.md no preve ninguno.
- Mide con `FORCE_COLOR=0` delante de `bunx jest` y con la salida a un
  fichero, como en las cadenas de abajo, no como el ejemplo de tasks.md.

== BASE ==

origin/main = fca7c399 al escribir este handoff, y la branch ya lo
incluye (merge 6a9cc241, antes de H0): lo esperado es exit=0. Al arrancar:
`git fetch origin` y `git merge-base --is-ancestor origin/main HEAD; echo "exit=$?"`.
Anota el exit en el impl. Si da 1 (otra feature mergeo antes), NO pares:
trabajas sobre H0 igual y el merge de main en la branch lo hace el leader.
Nunca rebasees ni mergees.

Desde mobile-pet-tracker/:
- `test -d node_modules && echo presente` -> presente. Si no sale,
  `bun install --frozen-lockfile`; si el sandbox te lo deniega, PARA.
- `test ! -e .expo/types/router.d.ts; echo "exit=$?"` -> exit=0. Va en
  cada cadena de commit; si un dia da 1, PARA y pide al humano que lo
  borre. Nunca `rm -f` (tu sandbox lo deniega).
- `pgrep -af '[i]nit\.sh'` sin pipe: si sale algo, otra sesion usa la
  maquina; espera a que salga vacio antes de la suite entera del Cierre.

Base medida por el leader el 2026-10-08 en este worktree con el arbol de
H0, con el comando BASE (un solo jest, FORCE_COLOR=0, sin pipe): exit=0,
`Test Suites: 14 passed, 14 total` y `Tests:       825 passed, 825 total`.
Reparto por fichero:
  src/screens/home/index.test.tsx                       218
  src/screens/health/index.test.tsx                      64
  src/app/(tabs)/__tests__/food.test.tsx                 57
  src/screens/map/index.test.tsx                         94
  src/screens/alerts/index.test.tsx                      36
  src/screens/reminders/index.test.tsx                   31
  src/screens/docs/index.test.tsx                        13
  src/screens/geofences/index.test.tsx                   49
  src/screens/welcome/index.test.tsx                     65
  src/providers/__tests__/language-provider.test.tsx     24
  src/__tests__/ui-language.test.ts                      30
  src/__tests__/consistency-classnames.test.ts           55
  src/__tests__/design-drift.test.ts                     62
  src/__tests__/legibility-classnames.test.ts            27
El test del componente (src/components/__tests__/empty-state.test.tsx)
aun no existe (A2). Tu medida manda: repite el comando BASE (es el paso 2
de tasks.md T0) y anota sus dos lineas en el impl. Si el total no es 825
o algo nace rojo, mide fichero a fichero, anota y PARA.

Comando BASE (la ruta de food lleva los parentesis ESCAPADOS: sin
escapar, jest los toma por regex y salta el fichero en silencio con
exit 0):
  FORCE_COLOR=0 bunx jest src/screens/home/index.test.tsx src/screens/health/index.test.tsx 'src/app/\(tabs\)/__tests__/food.test.tsx' src/screens/map/index.test.tsx src/screens/alerts/index.test.tsx src/screens/reminders/index.test.tsx src/screens/docs/index.test.tsx src/screens/geofences/index.test.tsx src/screens/welcome/index.test.tsx src/providers/__tests__/language-provider.test.tsx src/__tests__/ui-language.test.ts src/__tests__/consistency-classnames.test.ts src/__tests__/design-drift.test.ts src/__tests__/legibility-classnames.test.ts > /tmp/155-base.txt 2>&1; echo "exit=$?"

Comando GUARDAS (los candados de copy y de carta que R11 exige verdes;
lo corre cada verde y cada candado; siempre 30 + 62 + 55 + 27 = 174):
  FORCE_COLOR=0 bunx jest src/__tests__/ui-language.test.ts src/__tests__/design-drift.test.ts src/__tests__/consistency-classnames.test.ts src/__tests__/legibility-classnames.test.ts
En las cadenas aparece como `<GUARDAS> > /tmp/155-gN-guardas.txt 2>&1`.

== ANCLAS ==

Ejecutalas TODAS desde la RAIZ del worktree antes de tocar nada y copia
la salida al impl. Son las A1-A29 de tasks.md T0 (las A18-A21 son los
bloques con `|` de debajo de su tabla: copialos de alli tal cual) y las
del handoff (H1-H16). Solo estos comandos son anclas; los numeros de
linea no lo son. Si alguna no da EXACTAMENTE lo esperado, PARA y avisa
(ante una diferencia manda el fichero, no el handoff). Cuando `grep -c`
cuenta 0 sale con codigo 1: lo que vale es la cifra impresa. El leader
las ha ejecutado todas en H0 sacandolas de este mismo fichero.

A1-A29: las de tasks.md T0, con su salida esperada. A28 da, con
`ls /home/claude/pet-tracker-mascot/webp/ | tr '\n' ' '`:
  pingo-clipboard.webp pingo-collar.webp pingo-food.webp pingo-health.webp pingo-sleep.webp pingo-talk.webp pingo-wave-blink.webp pingo-wave.webp 
H1. grep -cF -- '- [x] Aprobado por humano (fecha: 2026-10-08)' specs/mobile-empty-states-pingo/requirements.md   -> 1
H2. grep -cF -- '- [x] Clasificación, poses (A1, A2, A9) y copy final (A7, A8) aprobados (fecha: 2026-10-08)' specs/mobile-empty-states-pingo/requirements.md   -> 1
H3. grep -cF -- '- [ ] Smoke R12 superado en dev build de Android (fecha: ____)' specs/mobile-empty-states-pingo/requirements.md   -> 1
H4. grep -cF "describe('#155" mobile-pet-tracker/src/screens/home/index.test.tsx   -> 0
H5. grep -cF 'mockRouter' mobile-pet-tracker/src/screens/map/index.test.tsx   -> 0
H6. grep -cE "^\s+'(common\.noPetsBody|alerts\.emptyBody|reminders\.emptyBody|geofences\.emptyBody|food\.noMealPlanBody)':" mobile-pet-tracker/src/i18n/catalog.ts   -> 0
H7. grep -cF "'docs.emptyBody': 'Medical documents will appear here.'," mobile-pet-tracker/src/i18n/catalog.ts   -> 1
H8. grep -cF '### §2.21' specs/mobile-ui-language/design.md   -> 0
H9. grep -cF '<Card testID="docs-empty"' mobile-pet-tracker/src/screens/docs/index.tsx   -> 1
H10. grep -cF '<Card testID="geofences-empty"' mobile-pet-tracker/src/screens/geofences/index.tsx   -> 1
H11. ls mobile-pet-tracker/assets/images | grep -c '^pingo-'   -> 2
H12. grep -cF "it('shows a dedicated empty state'" mobile-pet-tracker/src/screens/docs/index.test.tsx   -> 1
H13. grep -cF "it('shows the empty state'" mobile-pet-tracker/src/screens/reminders/index.test.tsx   -> 1
H14. grep -cF "it('pinta el estado vacío'" mobile-pet-tracker/src/screens/alerts/index.test.tsx   -> 1
H15. grep -rlF '#155' mobile-pet-tracker/src | wc -l   -> 0
H16. grep -A1 -E "^\s+'(common\.noPetsYet|alerts\.empty|reminders\.noRemindersYet|geofences\.empty|food\.noMealPlanYet)':" mobile-pet-tracker/src/i18n/catalog.ts | grep -cE "^\s+'(common\.noPetsBody|alerts\.emptyBody|reminders\.emptyBody|geofences\.emptyBody|food\.noMealPlanBody)':"   -> 0

Valores al cerrar (copialos al impl): A1 sin cambios; A2 -> sin salida
(el fichero ya existe); A3 -> 0 (C1); A4 -> 0 (C2); A5-A6 sin cambios;
A7 -> 0 (C3); A8-A13 -> 0 (C4-C9 reescriben esas lineas); A14-A19 sin
cambios (las filas nuevas entran DEBAJO de su ancla, que se queda); A20
no se fija (vale P1); A21 -> `<id> 0` en las 7 lineas (C15 mueve la
espera a `-title`); A22 -> 0 (C16); A23 -> 0 (C15: literal 'No hay
alertas'); A24 -> 0 (C17); A25 no menos de 1; A26 sin cambios; A27 -> 1;
A28 sin cambios; A29 -> vacio; H1-H3 sin cambios; H4 -> 1; H5 no menos de
2 (la declaracion y su uso); H6 -> 10; H7 -> 0; H8 -> 1; H9 -> 0; H10 ->
0; H11 -> 8; H12-H14 sin cambios (los it conservan su titulo); H15 no se
fija (anota el valor); H16 -> 10. Y en positivo al cerrar, desde la raiz:
  P1. grep -rlE '<EmptyState\b' mobile-pet-tracker/src --include='*.tsx' --exclude='*.test.tsx' | wc -l   -> 8
  P2. grep -cF '+ 5, // #155 R1' mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx   -> 1
  P3. grep -cF '13 + 1 + 1 + 1 + 1); // #146 R8, #146 R9; #118 R7; #155 R3' mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts   -> 2
  P4. grep -cE "^\s+'docs\.emptyBody': (\"When your pet's medical documents arrive, I'll keep them here\.\"|'When your pet\\\\'s medical documents arrive, I\\\\'ll keep them here\.')," mobile-pet-tracker/src/i18n/catalog.ts   -> 1
      (vale con comillas dobles o con `\'`: el catalogo usa las dos; el valor es el de requirements.md §Copy final, byte a byte)
  P5. grep -cF '### §2.21 — Añadidos por #155 — Pingo en los estados vacíos' specs/mobile-ui-language/design.md   -> 1
  P6. grep -cF 'export type EmptyStatePose' mobile-pet-tracker/src/components/empty-state.tsx   -> 1
  P7. grep -cE 'react-native-reanimated|entering=|MOTION_' mobile-pet-tracker/src/components/empty-state.tsx   -> 0

== COMMITS ==

Todo desde mobile-pet-tracker/. Cada commit va ENCADENADO con && a su
verificacion: si cualquier eslabon falla, el commit no se hace. Nunca
commitees fuera de estas cadenas ni con un exit distinto de 0 en la
cadena (en #115 se commiteo un verde con el registrador en exit=1). Si
una cadena no llega al commit, PARA y reporta en el impl el eslabon que
fallo y la salida.

Mide SIN pipe (`cmd | tail` devuelve el exit de tail). FORCE_COLOR=0 deja
la linea de resumen de jest en texto plano. Formato:
`Tests:       3 failed, 217 passed, 220 total` y en verde
`Tests:       220 passed, 220 total`. Cada medida de abajo lleva su
`echo "exit=$?"`; anota el exit en el impl.

Rojos: cada uno cae EXACTAMENTE como dice tasks.md: por ASERCION
(Expected/Received o «Matcher error: received value must be a string»
sobre una clave que aun no existe) o por CONSULTA (`Unable to find an
element with testID: ...`). Nunca por TypeError, ReferenceError,
SyntaxError ni `Cannot find module`. Hay dos excepciones, y su cadena
las acota: T2 (las seis filas caen por `ENOENT: no such file or
directory`, los WebP aun no estan) y T3 (el fichero entero no carga por
`Cannot find module '../empty-state'`, y solo por ese). La cadena
comprueba la cuenta; tu ademas abres el log y copias al impl cada it rojo
con su matcher y su Expected/Received (o la consulta, el ENOENT o el
modulo que fallo).

Typecheck y lint en los rojos: van normales (exit 0) salvo en T3, donde la
cadena los acota (el import de un modulo que no existe es el rojo).

-- T1 R1: el copy de los vacios --

T1 rojo (describe `#155 R1: el copy de los vacíos existe en los dos idiomas`,
19 it, en el test NUEVO del componente; y C1 en language-provider):
  Cabecera del test del componente, como la del test de la bienvenida:
  `import { en, es } from '../../i18n/catalog';`, y ficheros con
  `const { readFileSync } = jest.requireActual<typeof import('fs')>('fs');`
  y `const { join } = jest.requireActual<typeof import('path')>('path');`.
  Para leer por clave sin errores de tipos:
  `const enCatalog: Record<string, string> = en;` y
  `const esCatalog: Record<string, string> = es;` (sin ellos, `en[clave]`
  da TS7053 y tumba el typecheck). Las tres comprobaciones de estilo, con
  matchers: `expect(v).not.toMatch(/[!¡]/)`,
  `expect(v).not.toMatch(/\p{Extended_Pictographic}/u)` y
  `expect(v).toMatch(/\.$/)`; nunca `.test()` dentro de un expect.
  FORCE_COLOR=0 bunx jest src/components/__tests__/empty-state.test.tsx > /tmp/155-r1.txt 2>&1; echo "exit=$?"
    -> exit=1 y `Tests:       18 failed, 1 passed, 19 total`. El unico verde
       es `docs.emptyBody no exclama...`: su valor viejo ya cumple las tres.
  FORCE_COLOR=0 bunx jest src/providers/__tests__/language-provider.test.tsx > /tmp/155-r1-lp.txt 2>&1; echo "exit=$?"
    -> exit=1 y `Tests:       1 failed, 23 passed, 24 total` (366 frente a 371)
  grep -qE '^Tests: +18 failed, 1 passed, 19 total$' /tmp/155-r1.txt \
    && grep -qE '^Tests: +1 failed, 23 passed, 24 total$' /tmp/155-r1-lp.txt \
    && ! grep -qE 'TypeError|ReferenceError|SyntaxError|Cannot find module' /tmp/155-r1.txt /tmp/155-r1-lp.txt \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bun run lint \
    && git add src/components/__tests__/empty-state.test.tsx src/providers/__tests__/language-provider.test.tsx \
    && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/components/__tests__/empty-state.test.tsx mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx ' \
    && git commit -m 'test(mobile-empty-states): #155 R1 red copy de los vacíos'

T1 verde (las cinco claves y el valor nuevo de docs.emptyBody en `en` y
`es`, cada clave en la linea siguiente a su titulo; y el bloque §2.21 de
requirements.md R1, literal, en specs/mobile-ui-language/design.md justo
antes de `## 3. La infraestructura`, con una linea en blanco arriba y
otra abajo):
  FORCE_COLOR=0 bunx jest src/components/__tests__/empty-state.test.tsx src/providers/__tests__/language-provider.test.tsx > /tmp/155-g1.txt 2>&1; echo "exit=$?"
    -> exit=0 y `Tests:       43 passed, 43 total` (19 + 24)
  <GUARDAS> > /tmp/155-g1-guardas.txt 2>&1; echo "exit=$?"
  grep -qE '^Tests: +43 passed, 43 total$' /tmp/155-g1.txt \
    && grep -qE '^Tests: +174 passed, 174 total$' /tmp/155-g1-guardas.txt \
    && test "$(grep -A1 -E "^\s+'(common\.noPetsYet|alerts\.empty|reminders\.noRemindersYet|geofences\.empty|food\.noMealPlanYet)':" src/i18n/catalog.ts | grep -cE "^\s+'(common\.noPetsBody|alerts\.emptyBody|reminders\.emptyBody|geofences\.emptyBody|food\.noMealPlanBody)':")" = 10 \
    && test "$(grep -cF '### §2.21 — Añadidos por #155 — Pingo en los estados vacíos' ../specs/mobile-ui-language/design.md)" = 1 \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bun run lint \
    && git add src/i18n/catalog.ts ../specs/mobile-ui-language/design.md \
    && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/i18n/catalog.ts specs/mobile-ui-language/design.md ' \
    && git commit -m 'feat(mobile-empty-states): #155 R1 copy de los vacíos'

-- T2 R2: las seis poses --

T2 rojo (describe `#155 R2: las poses de los vacíos entran como WebP`, un
it.each de 6 filas, en el test del componente; y C2 en el test de la
bienvenida, la lista de 8 nombres de R2):
  FORCE_COLOR=0 bunx jest src/components/__tests__/empty-state.test.tsx > /tmp/155-r2.txt 2>&1; echo "exit=$?"
    -> exit=1 y `Tests:       6 failed, 19 passed, 25 total`, las seis por ENOENT
  FORCE_COLOR=0 bunx jest src/screens/welcome/index.test.tsx > /tmp/155-r2-w.txt 2>&1; echo "exit=$?"
    -> exit=1 y `Tests:       1 failed, 64 passed, 65 total`, por asercion (2 nombres frente a 8)
  grep -qE '^Tests: +6 failed, 19 passed, 25 total$' /tmp/155-r2.txt \
    && test "$(grep -cE 'ENOENT: no such file or directory.*pingo-(talk|sleep|clipboard|health|collar|food)\.webp' /tmp/155-r2.txt)" -ge 6 \
    && grep -qE '^Tests: +1 failed, 64 passed, 65 total$' /tmp/155-r2-w.txt \
    && ! grep -qE 'TypeError|ReferenceError|SyntaxError|Cannot find module' /tmp/155-r2.txt /tmp/155-r2-w.txt \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bun run lint \
    && git add src/components/__tests__/empty-state.test.tsx src/screens/welcome/index.test.tsx \
    && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/components/__tests__/empty-state.test.tsx mobile-pet-tracker/src/screens/welcome/index.test.tsx ' \
    && git commit -m 'test(mobile-empty-states): #155 R2 red poses WebP'

T2 verde (copia, el comando de design.md §Assets adaptado a esta carpeta;
si el sandbox te lo deniega, PARA):
  cp /home/claude/pet-tracker-mascot/webp/pingo-{talk,sleep,clipboard,health,collar,food}.webp assets/images/; echo "exit=$?"
  FORCE_COLOR=0 bunx jest src/components/__tests__/empty-state.test.tsx src/screens/welcome/index.test.tsx > /tmp/155-g2.txt 2>&1; echo "exit=$?"
    -> exit=0 y `Tests:       90 passed, 90 total` (25 + 65)
  <GUARDAS> > /tmp/155-g2-guardas.txt 2>&1; echo "exit=$?"
  grep -qE '^Tests: +90 passed, 90 total$' /tmp/155-g2.txt \
    && grep -qE '^Tests: +174 passed, 174 total$' /tmp/155-g2-guardas.txt \
    && test -z "$(for p in talk sleep clipboard health collar food; do cmp -s /home/claude/pet-tracker-mascot/webp/pingo-$p.webp assets/images/pingo-$p.webp || echo $p; done)" \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bun run lint \
    && git add assets/images/pingo-clipboard.webp assets/images/pingo-collar.webp assets/images/pingo-food.webp assets/images/pingo-health.webp assets/images/pingo-sleep.webp assets/images/pingo-talk.webp \
    && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/assets/images/pingo-clipboard.webp mobile-pet-tracker/assets/images/pingo-collar.webp mobile-pet-tracker/assets/images/pingo-food.webp mobile-pet-tracker/assets/images/pingo-health.webp mobile-pet-tracker/assets/images/pingo-sleep.webp mobile-pet-tracker/assets/images/pingo-talk.webp ' \
    && git commit -m 'feat(mobile-empty-states): #155 R2 poses WebP'

-- T3 R3: el componente EmptyState --

T3 rojo (describe `#155 R3: un único componente pinta los vacíos ilustrados`,
11 it, en el test del componente; y C3 en consistency-classnames):
  El componente entra con UNA sola sentencia de import en la cabecera,
  `import { EmptyState } from '../empty-state';` (ni un segundo
  `import type` del mismo modulo: daria dos errores y la cadena pide uno).
  Las filas de poses del it.each van `as const`, para que en el verde
  tipen contra `EmptyStatePose` sin importarlo.
  FORCE_COLOR=0 bunx jest src/components/__tests__/empty-state.test.tsx > /tmp/155-r3.txt 2>&1; echo "exit=$?"
    -> exit=1, `Test Suites: 1 failed, 1 total` y `Tests:       0 total`:
       el fichero entero no carga (tambien R1 y R2, que vuelven en el verde)
       por `Cannot find module '../empty-state' from 'src/components/__tests__/empty-state.test.tsx'`
  FORCE_COLOR=0 bunx jest src/__tests__/consistency-classnames.test.ts > /tmp/155-r3-c.txt 2>&1; echo "exit=$?"
    -> exit=1 y `Tests:       2 failed, 53 passed, 55 total`, por asercion (16 frente a 17)
  grep -qE '^Test Suites: +1 failed, 1 total$' /tmp/155-r3.txt \
    && grep -qE '^Tests: +0 total$' /tmp/155-r3.txt \
    && grep -qF "Cannot find module '../empty-state' from 'src/components/__tests__/empty-state.test.tsx'" /tmp/155-r3.txt \
    && test "$(grep -c 'Cannot find module' /tmp/155-r3.txt)" = "$(grep -cF "Cannot find module '../empty-state'" /tmp/155-r3.txt)" \
    && ! grep -qE 'TypeError|ReferenceError|SyntaxError' /tmp/155-r3.txt \
    && grep -qE '^Tests: +2 failed, 53 passed, 55 total$' /tmp/155-r3-c.txt \
    && ! grep -qE 'TypeError|ReferenceError|SyntaxError|Cannot find module' /tmp/155-r3-c.txt \
    && test ! -e .expo/types/router.d.ts \
    && { bun run typecheck > /tmp/155-r3-tsc.txt 2>&1 || true; } \
    && test "$(grep -c 'error TS' /tmp/155-r3-tsc.txt)" = 1 \
    && grep -qE '^src/components/__tests__/empty-state\.test\.tsx\([0-9]+,[0-9]+\): error TS2307:' /tmp/155-r3-tsc.txt \
    && { bun run lint > /tmp/155-r3-lint.txt 2>&1 || true; } \
    && grep -qF '✖ 1 problem (1 error, 0 warnings)' /tmp/155-r3-lint.txt \
    && test "$(grep -cF "Unable to resolve path to module '../empty-state'" /tmp/155-r3-lint.txt)" = 1 \
    && git add src/components/__tests__/empty-state.test.tsx src/__tests__/consistency-classnames.test.ts \
    && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts mobile-pet-tracker/src/components/__tests__/empty-state.test.tsx ' \
    && git commit -m 'test(mobile-empty-states): #155 R3 red componente EmptyState'

T3 verde (src/components/empty-state.tsx segun requirements.md R3):
  FORCE_COLOR=0 bunx jest src/components/__tests__/empty-state.test.tsx > /tmp/155-g3.txt 2>&1; echo "exit=$?"
    -> exit=0 y `Tests:       36 passed, 36 total`
  <GUARDAS> > /tmp/155-g3-guardas.txt 2>&1; echo "exit=$?"
  grep -qE '^Tests: +36 passed, 36 total$' /tmp/155-g3.txt \
    && grep -qE '^Tests: +174 passed, 174 total$' /tmp/155-g3-guardas.txt \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bun run lint \
    && git add src/components/empty-state.tsx \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/components/empty-state.tsx' \
    && git commit -m 'feat(mobile-empty-states): #155 R3 componente EmptyState'

-- T4 R4: sin mascotas, en cuatro pantallas --

T4 rojo (un commit: el describe `#155 R4: <pantalla> sin mascotas presenta a Pingo`
con sus dos it en los cuatro tests de pantalla; en el del mapa, ademas,
`import { router } from 'expo-router';` y
`const mockRouter = jest.mocked(router);` (A27 da 0: no existen); C15 para
home-empty, health-empty, food-empty y map-no-pets; C11, C4, C5, C6 parte
R4 y C7):
  FORCE_COLOR=0 bunx jest src/screens/home/index.test.tsx > /tmp/155-r4-home.txt 2>&1; echo "exit=$?"
    -> exit=1 y `Tests:       3 failed, 217 passed, 220 total`
  FORCE_COLOR=0 bunx jest src/screens/health/index.test.tsx > /tmp/155-r4-health.txt 2>&1; echo "exit=$?"
    -> exit=1 y `Tests:       3 failed, 63 passed, 66 total`
  FORCE_COLOR=0 bunx jest 'src/app/\(tabs\)/__tests__/food.test.tsx' > /tmp/155-r4-food.txt 2>&1; echo "exit=$?"
    -> exit=1 y `Tests:       3 failed, 56 passed, 59 total`
  FORCE_COLOR=0 bunx jest src/screens/map/index.test.tsx > /tmp/155-r4-map.txt 2>&1; echo "exit=$?"
    -> exit=1 y `Tests:       3 failed, 93 passed, 96 total`
  FORCE_COLOR=0 bunx jest src/__tests__/ui-language.test.ts > /tmp/155-r4-ui.txt 2>&1; echo "exit=$?"
    -> exit=1 y `Tests:       5 failed, 25 passed, 30 total` (los its de R3_HOME,
       R4_MAP, R5_HEALTH, R6_FOOD y el de ALL_USES: filas sin su `t()`)
  En cada pantalla, los tres rojos son los dos it nuevos y el it cuya
  espera C15 movio a `-title`, todos por consulta o asercion.
  grep -qE '^Tests: +3 failed, 217 passed, 220 total$' /tmp/155-r4-home.txt \
    && grep -qE '^Tests: +3 failed, 63 passed, 66 total$' /tmp/155-r4-health.txt \
    && grep -qE '^Tests: +3 failed, 56 passed, 59 total$' /tmp/155-r4-food.txt \
    && grep -qE '^Tests: +3 failed, 93 passed, 96 total$' /tmp/155-r4-map.txt \
    && grep -qE '^Tests: +5 failed, 25 passed, 30 total$' /tmp/155-r4-ui.txt \
    && ! grep -qE 'TypeError|ReferenceError|SyntaxError|Cannot find module' /tmp/155-r4-home.txt /tmp/155-r4-health.txt /tmp/155-r4-food.txt /tmp/155-r4-map.txt /tmp/155-r4-ui.txt \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bun run lint \
    && git add src/__tests__/ui-copy-table.ts src/__tests__/ui-language.test.ts 'src/app/(tabs)/__tests__/food.test.tsx' src/screens/health/index.test.tsx src/screens/home/index.test.tsx src/screens/map/index.test.tsx \
    && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/__tests__/ui-copy-table.ts mobile-pet-tracker/src/__tests__/ui-language.test.ts mobile-pet-tracker/src/app/(tabs)/__tests__/food.test.tsx mobile-pet-tracker/src/screens/health/index.test.tsx mobile-pet-tracker/src/screens/home/index.test.tsx mobile-pet-tracker/src/screens/map/index.test.tsx ' \
    && git commit -m 'test(mobile-empty-states): #155 R4 red sin mascotas'

T4 verde (el EmptyState de R4 en las cuatro pantallas. Imports que
faltan, medidos por el leader en H0: home y health, `type Href` de
expo-router; map, `router` y `type Href`; food, ninguno. Comprueba tu
mismo antes de anadir):
  FORCE_COLOR=0 bunx jest src/screens/home/index.test.tsx src/screens/health/index.test.tsx 'src/app/\(tabs\)/__tests__/food.test.tsx' src/screens/map/index.test.tsx > /tmp/155-g4.txt 2>&1; echo "exit=$?"
    -> exit=0, `Test Suites: 4 passed, 4 total` y `Tests:       441 passed, 441 total`
       (220 + 66 + 59 + 96)
  <GUARDAS> > /tmp/155-g4-guardas.txt 2>&1; echo "exit=$?"
  grep -qE '^Test Suites: +4 passed, 4 total$' /tmp/155-g4.txt \
    && grep -qE '^Tests: +441 passed, 441 total$' /tmp/155-g4.txt \
    && grep -qE '^Tests: +174 passed, 174 total$' /tmp/155-g4-guardas.txt \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bun run lint \
    && git add 'src/app/(tabs)/food.tsx' src/screens/health/index.tsx src/screens/home/index.tsx src/screens/map/index.tsx \
    && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/app/(tabs)/food.tsx mobile-pet-tracker/src/screens/health/index.tsx mobile-pet-tracker/src/screens/home/index.tsx mobile-pet-tracker/src/screens/map/index.tsx ' \
    && git commit -m 'feat(mobile-empty-states): #155 R4 sin mascotas'

-- T5 R5: sin alertas --

T5 rojo (describe `#155 R5: sin alertas, Pingo duerme` en el test de
alertas; C15 y C16 en el it `pinta el estado vacío`, con el valor
esperado literal 'No hay alertas'; C10. El it de ausencia de accion se
ancla con `await screen.findByTestId('alerts-empty-title')`. El import
de `es` se queda: lo siguen usando otros it del fichero):
  FORCE_COLOR=0 bunx jest src/screens/alerts/index.test.tsx > /tmp/155-r5.txt 2>&1; echo "exit=$?"
    -> exit=1 y `Tests:       3 failed, 35 passed, 38 total`
  FORCE_COLOR=0 bunx jest src/__tests__/ui-language.test.ts > /tmp/155-r5-ui.txt 2>&1; echo "exit=$?"
    -> exit=1 y `Tests:       2 failed, 28 passed, 30 total`
  grep -qE '^Tests: +3 failed, 35 passed, 38 total$' /tmp/155-r5.txt \
    && grep -qE '^Tests: +2 failed, 28 passed, 30 total$' /tmp/155-r5-ui.txt \
    && ! grep -qE 'TypeError|ReferenceError|SyntaxError|Cannot find module' /tmp/155-r5.txt /tmp/155-r5-ui.txt \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bun run lint \
    && git add src/__tests__/ui-copy-table.ts src/screens/alerts/index.test.tsx \
    && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/__tests__/ui-copy-table.ts mobile-pet-tracker/src/screens/alerts/index.test.tsx ' \
    && git commit -m 'test(mobile-empty-states): #155 R5 red alertas'

T5 verde (el EmptyState de R5):
  FORCE_COLOR=0 bunx jest src/screens/alerts/index.test.tsx > /tmp/155-g5.txt 2>&1; echo "exit=$?"
    -> exit=0 y `Tests:       38 passed, 38 total`
  <GUARDAS> > /tmp/155-g5-guardas.txt 2>&1; echo "exit=$?"
  grep -qE '^Tests: +38 passed, 38 total$' /tmp/155-g5.txt \
    && grep -qE '^Tests: +174 passed, 174 total$' /tmp/155-g5-guardas.txt \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bun run lint \
    && git add src/screens/alerts/index.tsx \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/screens/alerts/index.tsx' \
    && git commit -m 'feat(mobile-empty-states): #155 R5 alertas'

-- T6 R6: sin recordatorios --

T6 rojo (describe `#155 R6: sin recordatorios, Pingo sostiene su lista`
en el test de recordatorios; C15; C12 y C8):
  FORCE_COLOR=0 bunx jest src/screens/reminders/index.test.tsx > /tmp/155-r6.txt 2>&1; echo "exit=$?"
    -> exit=1 y `Tests:       3 failed, 30 passed, 33 total`
  FORCE_COLOR=0 bunx jest src/__tests__/ui-language.test.ts > /tmp/155-r6-ui.txt 2>&1; echo "exit=$?"
    -> exit=1 y `Tests:       2 failed, 28 passed, 30 total`
  grep -qE '^Tests: +3 failed, 30 passed, 33 total$' /tmp/155-r6.txt \
    && grep -qE '^Tests: +2 failed, 28 passed, 30 total$' /tmp/155-r6-ui.txt \
    && ! grep -qE 'TypeError|ReferenceError|SyntaxError|Cannot find module' /tmp/155-r6.txt /tmp/155-r6-ui.txt \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bun run lint \
    && git add src/__tests__/ui-copy-table.ts src/__tests__/ui-language.test.ts src/screens/reminders/index.test.tsx \
    && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/__tests__/ui-copy-table.ts mobile-pet-tracker/src/__tests__/ui-language.test.ts mobile-pet-tracker/src/screens/reminders/index.test.tsx ' \
    && git commit -m 'test(mobile-empty-states): #155 R6 red recordatorios'

T6 verde (el EmptyState de R6):
  FORCE_COLOR=0 bunx jest src/screens/reminders/index.test.tsx > /tmp/155-g6.txt 2>&1; echo "exit=$?"
    -> exit=0 y `Tests:       33 passed, 33 total`
  <GUARDAS> > /tmp/155-g6-guardas.txt 2>&1; echo "exit=$?"
  grep -qE '^Tests: +33 passed, 33 total$' /tmp/155-g6.txt \
    && grep -qE '^Tests: +174 passed, 174 total$' /tmp/155-g6-guardas.txt \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bun run lint \
    && git add src/screens/reminders/index.tsx \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/screens/reminders/index.tsx' \
    && git commit -m 'feat(mobile-empty-states): #155 R6 recordatorios'

-- T7 R7: sin documentos --

T7 rojo (describe `#155 R7: sin documentos, Pingo los guarda` en el test
de documentos, con el arreglo de `it('shows a dedicated empty state'`;
sin filas nuevas en ui-copy-table):
  FORCE_COLOR=0 bunx jest src/screens/docs/index.test.tsx > /tmp/155-r7.txt 2>&1; echo "exit=$?"
    -> exit=1 y `Tests:       2 failed, 13 passed, 15 total`
  grep -qE '^Tests: +2 failed, 13 passed, 15 total$' /tmp/155-r7.txt \
    && ! grep -qE 'TypeError|ReferenceError|SyntaxError|Cannot find module' /tmp/155-r7.txt \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bun run lint \
    && git add src/screens/docs/index.test.tsx \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/screens/docs/index.test.tsx' \
    && git commit -m 'test(mobile-empty-states): #155 R7 red documentos'

T7 verde (el EmptyState de R7 en lugar de la Card docs-empty; `Card`
sigue importado, lo usan otros nodos del fichero):
  FORCE_COLOR=0 bunx jest src/screens/docs/index.test.tsx > /tmp/155-g7.txt 2>&1; echo "exit=$?"
    -> exit=0 y `Tests:       15 passed, 15 total`
  <GUARDAS> > /tmp/155-g7-guardas.txt 2>&1; echo "exit=$?"
  grep -qE '^Tests: +15 passed, 15 total$' /tmp/155-g7.txt \
    && grep -qE '^Tests: +174 passed, 174 total$' /tmp/155-g7-guardas.txt \
    && test "$(grep -cF '<Card testID="docs-empty"' src/screens/docs/index.tsx)" = 0 \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bun run lint \
    && git add src/screens/docs/index.tsx \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/screens/docs/index.tsx' \
    && git commit -m 'feat(mobile-empty-states): #155 R7 documentos'

-- T8 R8: sin zonas seguras --

T8 rojo (borra el it de C17, `pinta el vacío con su tarjeta y su copy`,
y anade el describe `#155 R8: sin zonas seguras, Pingo enseña el collar`
en el test de zonas seguras; C13 y C9):
  FORCE_COLOR=0 bunx jest src/screens/geofences/index.test.tsx > /tmp/155-r8.txt 2>&1; echo "exit=$?"
    -> exit=1 y `Tests:       2 failed, 48 passed, 50 total` (49 - 1 + 2)
  FORCE_COLOR=0 bunx jest src/__tests__/ui-language.test.ts > /tmp/155-r8-ui.txt 2>&1; echo "exit=$?"
    -> exit=1 y `Tests:       2 failed, 28 passed, 30 total`
  grep -qE '^Tests: +2 failed, 48 passed, 50 total$' /tmp/155-r8.txt \
    && grep -qE '^Tests: +2 failed, 28 passed, 30 total$' /tmp/155-r8-ui.txt \
    && ! grep -qE 'TypeError|ReferenceError|SyntaxError|Cannot find module' /tmp/155-r8.txt /tmp/155-r8-ui.txt \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bun run lint \
    && git add src/__tests__/ui-copy-table.ts src/__tests__/ui-language.test.ts src/screens/geofences/index.test.tsx \
    && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/__tests__/ui-copy-table.ts mobile-pet-tracker/src/__tests__/ui-language.test.ts mobile-pet-tracker/src/screens/geofences/index.test.tsx ' \
    && git commit -m 'test(mobile-empty-states): #155 R8 red zonas seguras'

T8 verde (el EmptyState de R8 en lugar de la Card geofences-empty; `Card`
sigue importado, lo usan otros nodos del fichero):
  FORCE_COLOR=0 bunx jest src/screens/geofences/index.test.tsx > /tmp/155-g8.txt 2>&1; echo "exit=$?"
    -> exit=0 y `Tests:       50 passed, 50 total`
  <GUARDAS> > /tmp/155-g8-guardas.txt 2>&1; echo "exit=$?"
  grep -qE '^Tests: +50 passed, 50 total$' /tmp/155-g8.txt \
    && grep -qE '^Tests: +174 passed, 174 total$' /tmp/155-g8-guardas.txt \
    && test "$(grep -cF '<Card testID="geofences-empty"' src/screens/geofences/index.tsx)" = 0 \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bun run lint \
    && git add src/screens/geofences/index.tsx \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/screens/geofences/index.tsx' \
    && git commit -m 'feat(mobile-empty-states): #155 R8 zonas seguras'

-- T9 R9: sin plan de comidas --

T9 rojo (describe `#155 R9: sin plan de comidas, Pingo enseña el cuenco`
en el test de Comida; C15 para food-plan-empty; C14 y la parte R9 de C6):
  FORCE_COLOR=0 bunx jest 'src/app/\(tabs\)/__tests__/food.test.tsx' > /tmp/155-r9.txt 2>&1; echo "exit=$?"
    -> exit=1 y `Tests:       3 failed, 58 passed, 61 total`
  FORCE_COLOR=0 bunx jest src/__tests__/ui-language.test.ts > /tmp/155-r9-ui.txt 2>&1; echo "exit=$?"
    -> exit=1 y `Tests:       2 failed, 28 passed, 30 total`
  grep -qE '^Tests: +3 failed, 58 passed, 61 total$' /tmp/155-r9.txt \
    && grep -qE '^Tests: +2 failed, 28 passed, 30 total$' /tmp/155-r9-ui.txt \
    && ! grep -qE 'TypeError|ReferenceError|SyntaxError|Cannot find module' /tmp/155-r9.txt /tmp/155-r9-ui.txt \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bun run lint \
    && git add src/__tests__/ui-copy-table.ts src/__tests__/ui-language.test.ts 'src/app/(tabs)/__tests__/food.test.tsx' \
    && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/__tests__/ui-copy-table.ts mobile-pet-tracker/src/__tests__/ui-language.test.ts mobile-pet-tracker/src/app/(tabs)/__tests__/food.test.tsx ' \
    && git commit -m 'test(mobile-empty-states): #155 R9 red plan de comidas'

T9 verde (el EmptyState de R9):
  FORCE_COLOR=0 bunx jest 'src/app/\(tabs\)/__tests__/food.test.tsx' > /tmp/155-g9.txt 2>&1; echo "exit=$?"
    -> exit=0 y `Tests:       61 passed, 61 total`
  <GUARDAS> > /tmp/155-g9-guardas.txt 2>&1; echo "exit=$?"
  grep -qE '^Tests: +61 passed, 61 total$' /tmp/155-g9.txt \
    && grep -qE '^Tests: +174 passed, 174 total$' /tmp/155-g9-guardas.txt \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bun run lint \
    && git add 'src/app/(tabs)/food.tsx' \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/app/(tabs)/food.tsx' \
    && git commit -m 'feat(mobile-empty-states): #155 R9 plan de comidas'

-- T10 R10 y T11 R11: candados que nacen verdes, con sus sondas --

T10 (describe `#155 R10: los vacíos que no se ilustran siguen en texto`,
21 it, en el test del componente):
  FORCE_COLOR=0 bunx jest src/components/__tests__/empty-state.test.tsx > /tmp/155-g10.txt 2>&1; echo "exit=$?"
    -> exit=0 y `Tests:       57 passed, 57 total`. Si nace rojo, una
       tarea anterior se salio de la clasificacion: PARA.
  <GUARDAS> > /tmp/155-g10-guardas.txt 2>&1; echo "exit=$?"
  grep -qE '^Tests: +57 passed, 57 total$' /tmp/155-g10.txt \
    && grep -qE '^Tests: +174 passed, 174 total$' /tmp/155-g10-guardas.txt \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bun run lint \
    && git add src/components/__tests__/empty-state.test.tsx \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/components/__tests__/empty-state.test.tsx' \
    && git commit -m 'test(mobile-empty-states): #155 R10 candado de vacíos en texto'
  Despues, sobre ese HEAD, las dos sondas de tasks.md T10, una a una:
  S1 (src/screens/profile/index.tsx: `<Text testID="profile-pets-empty"`
  pasa a `<EmptyState testID="profile-pets-empty"`) y S2
  (src/screens/alerts/index.tsx: `<EmptyState` pasa a `<EmptyStateX`).
  Cada una:
    FORCE_COLOR=0 bunx jest src/components/__tests__/empty-state.test.tsx > /tmp/155-s1.txt 2>&1; echo "exit=$?"
      -> exit=1 y `Tests:       2 failed, 55 passed, 57 total` (S1: la fila
         profile-pets-empty del primer it.each y `ningún otro fichero usa EmptyState`;
         S2: la fila de alertas del segundo it.each y el mismo it)
    git checkout HEAD -- <fichero de la sonda>
    git diff --cached --quiet && git diff --quiet; echo "limpio=$?"   -> limpio=0
  (S2 a /tmp/155-s2.txt.) Si una sonda no da exactamente ese rojo, PARA.

T11 (describe `#155 R11: los vacíos no traen movimiento ni dependencias`,
2 it, en el test del componente):
  FORCE_COLOR=0 bunx jest src/components/__tests__/empty-state.test.tsx > /tmp/155-g11.txt 2>&1; echo "exit=$?"
    -> exit=0 y `Tests:       59 passed, 59 total`
  <GUARDAS> > /tmp/155-g11-guardas.txt 2>&1; echo "exit=$?"
  grep -qE '^Tests: +59 passed, 59 total$' /tmp/155-g11.txt \
    && grep -qE '^Tests: +174 passed, 174 total$' /tmp/155-g11-guardas.txt \
    && test -z "$(git diff --stat <H0> -- package.json bun.lock)" \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bun run lint \
    && git add src/components/__tests__/empty-state.test.tsx \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/components/__tests__/empty-state.test.tsx' \
    && git commit -m 'test(mobile-empty-states): #155 R11 candado sin movimiento'
  Despues, sobre ese HEAD, la sonda S3: anade la linea
  `import Animated from 'react-native-reanimated';` al principio de
  src/components/empty-state.tsx.
    FORCE_COLOR=0 bunx jest src/components/__tests__/empty-state.test.tsx > /tmp/155-s3.txt 2>&1; echo "exit=$?"
      -> exit=1 y `Tests:       2 failed, 57 passed, 59 total` (los dos it de R11)
    git checkout HEAD -- src/components/empty-state.tsx
    git diff --cached --quiet && git diff --quiet; echo "limpio=$?"   -> limpio=0

== CIERRE ==

Desde mobile-pet-tracker/, sin pipe, con salida al impl:
- Los 15 ficheros: el comando BASE con
  `src/components/__tests__/empty-state.test.tsx` anadido al final y la
  salida a /tmp/155-final.txt
    -> exit=0, `Test Suites: 15 passed, 15 total` y `Tests:       901 passed, 901 total`
       (reparto: home 220, health 66, food 61, map 96, alerts 38,
       reminders 33, docs 15, geofences 50, welcome 65,
       language-provider 24, ui-language 30, consistency 55,
       design-drift 62, legibility 27, empty-state 59)
- `pgrep -af '[i]nit\.sh'` vacio; despues
  `FORCE_COLOR=0 bunx jest > /tmp/155-all.txt 2>&1; echo "exit=$?"` -> exit=0.
  Copia las lineas `Test Suites:` y `Tests:`. Mientras corre, no lances
  otra cosa.
- `bun run typecheck; echo "exit=$?"` -> exit=0 y `bun run lint; echo "exit=$?"` -> exit=0.
- `git diff --stat <H0> -- package.json bun.lock app.json src/theme`
  -> vacio. Esta spec no anade dependencias ni toca tokens ni motion.ts.
Desde la raiz del repo:
- Las anclas A1-A29 y H1-H16 con sus valores de cierre, y P1-P7.
- `git diff --stat <H0> -- backend-pet-tracker/ infra-pet-tracker/ docs/`   -> vacio
- `git diff --name-only <H0> HEAD -- mobile-pet-tracker/ | LC_ALL=C sort`
  -> exactamente los 30 de mobile-pet-tracker/ de la lista de abajo

Despues rellena specs/mobile-empty-states-pingo/traceability.md, solo
las columnas «Commit rojo» y «Commit verde» (hash corto + mensaje). R1-R9
citan su rojo y su verde. R10 y R11: en «Commit rojo», `sondas S1-S2
(impl)` y `sonda S3 (impl)`; en «Commit verde», el commit del candado. La
fila R12 se queda `pendiente (lo firma el humano)` en las dos columnas.
No toques su frontmatter ni el resto del fichero. Termina el impl con la
linea `R12: pendiente del smoke humano`. Commit final, desde la raiz:
  git add specs/mobile-empty-states-pingo/traceability.md progress/impl_mobile-empty-states-pingo.md \
    && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'progress/impl_mobile-empty-states-pingo.md specs/mobile-empty-states-pingo/traceability.md ' \
    && git commit -m 'docs(mobile-empty-states-pingo): #155 traceability'
Y la lista cerrada, con salida al impl:
  git diff --name-only <H0> HEAD -- . ':!feature_list.json' ':!progress/current.md' ':!progress/handoff_mobile-empty-states-pingo.md' ':!specs/mobile-empty-states-pingo/requirements.md' ':!specs/mobile-empty-states-pingo/design.md' ':!specs/mobile-empty-states-pingo/tasks.md' ':!progress/review_mobile-empty-states-pingo.md'
    -> exactamente los 33 ficheros de abajo
No rebasees despues de escribir hashes.

== REGLAS CRITICAS ==

- UI movil: docs/ui-guidelines.md manda (carta). Cero hex, cero
  `StyleSheet.create`, cero clases arbitrarias, cero `style` salvo el
  `{ width: 160, height: 160 }` de la pose (R3). Las clases son literales
  completos, nunca compuestas. Ni token nuevo, ni Card nueva, ni
  movimiento: EmptyState es estatico (R11, decision A3 en su defecto).
- Skills: carga `building-native-ui` (tu plugin expo) y, de .agents/skills/
  del repo, `appllama-app-design-skill` (OBLIGATORIA: cambias ocho
  pantallas; ver docs/ui-guidelines.md §Skills y sus tres limites) y
  `emil-design-eng`. Las decisiones de la spec mandan sobre cualquier
  skill. Descartado: animacion de cualquier tipo (Reanimated, `entering`,
  `MOTION_*`, Lottie, Rive), `expo-linear-gradient`, `expo-symbols`, hex,
  `StyleSheet.create` o clases arbitrarias. Di en el impl cuales cargaste.
- Convenciones: docs/conventions.md, en particular §Tests y §Esperas sobre
  el arbol renderizado. Se espera a un texto o nodo visible (`findByTestId`,
  `waitFor` sobre `getByTestId(...)`/`getByText`), NUNCA al contador de un
  mock. Los mocks (`mockRouter.push`...) se leen DESPUES de que el nodo
  exista, como asercion, nunca como espera. Una ausencia se ancla siempre
  a un nodo positivo presente en el mismo render: los it «no ofrece
  acción» esperan antes con `await screen.findByTestId('<id>-title')`. En
  RNTL 14 `toHaveTextContent` compara el texto entero: literal completo
  del catalogo, nunca un fragmento (por eso C15 mueve esas esperas a
  `-title`).
- La convencion de imagen de requirements.md («la pose <p>») se asevera
  tal cual: `props.source` igual a
  `[expect.objectContaining({ testUri: expect.stringMatching(/assets\/images\/pingo-<p>\.webp$/) })]`.
- Valores esperados LITERALES en los tests (el copy, las clases, las
  rutas, los nombres de fichero, `{ width: 160, height: 160 }`), nunca el
  simbolo importado de produccion. Las ausencias sobre texto o fuente con
  `expect(x).not.toMatch(re)`, nunca `expect(re.test(x)).toBe(false)`.
- Imports en los tests: NOMBRADOS, nunca `import * as` (eslint
  `import/namespace` es error y tumbaria la cadena). En los tests de
  pantalla reutiliza lo que ya hay en su cabecera (render, providers,
  mocks): no lo dupliques.
- design-drift recorre tambien el test de Inicio: ninguna cadena nueva
  lleva un guion pegado a `[` ni `StyleSheet`, y todo `#155` va seguido
  de ` R<n>` (un `#155` suelto lo caza el guard de hex). Lo mismo en
  todo el codigo de produccion: los comentarios citan `#155 R<n>`.
- specs/mobile-ui-language/design.md: el bloque §2.21 se copia de
  requirements.md byte a byte. No toques nada mas de ese fichero.
- Ni `bun add`, ni cambios en package.json, bun.lock ni app.json. Todo
  con bun/bunx, nunca npm/npx.
- NO lances ./init.sh ni toques Postgres ni LocalStack: los comparten
  otras sesiones y el gate lo corre el leader.
- No toques ningun fichero fuera de la lista de abajo. En particular, NO:
  src/theme/ (global.css, motion.ts), docs/ui-guidelines.md, los
  ficheros de los 11 vacios en texto (src/screens/profile/index.tsx
  solo se toca en la sonda S1 y se revierte), assets/images/splash-icon.png,
  las dos poses de #153 ni ninguna otra pose de /home/claude/pet-tracker-mascot/.
- NO son tuyos, no los toques: progress/history.md, progress/current.md,
  STATUS.md, feature_list.json, el frontmatter de los ficheros de la
  spec y las casillas de §Aprobacion de requirements.md (incluida la del
  smoke R12). Los escribe el leader o el humano. Todo lo que tengas que
  contar va en progress/impl_mobile-empty-states-pingo.md.
- Si el sandbox te deniega un comando, PARA y reportalo. No lo sustituyas
  por otro que haga lo mismo con otra herramienta.
- NO hagas push ni abras la PR: lo hace el leader al cerrar.

Ficheros que TU cambias (33, ni uno mas):
  mobile-pet-tracker/assets/images/pingo-clipboard.webp
  mobile-pet-tracker/assets/images/pingo-collar.webp
  mobile-pet-tracker/assets/images/pingo-food.webp
  mobile-pet-tracker/assets/images/pingo-health.webp
  mobile-pet-tracker/assets/images/pingo-sleep.webp
  mobile-pet-tracker/assets/images/pingo-talk.webp
  mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts
  mobile-pet-tracker/src/__tests__/ui-copy-table.ts
  mobile-pet-tracker/src/__tests__/ui-language.test.ts
  mobile-pet-tracker/src/app/(tabs)/__tests__/food.test.tsx
  mobile-pet-tracker/src/app/(tabs)/food.tsx
  mobile-pet-tracker/src/components/__tests__/empty-state.test.tsx
  mobile-pet-tracker/src/components/empty-state.tsx
  mobile-pet-tracker/src/i18n/catalog.ts
  mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx
  mobile-pet-tracker/src/screens/alerts/index.test.tsx
  mobile-pet-tracker/src/screens/alerts/index.tsx
  mobile-pet-tracker/src/screens/docs/index.test.tsx
  mobile-pet-tracker/src/screens/docs/index.tsx
  mobile-pet-tracker/src/screens/geofences/index.test.tsx
  mobile-pet-tracker/src/screens/geofences/index.tsx
  mobile-pet-tracker/src/screens/health/index.test.tsx
  mobile-pet-tracker/src/screens/health/index.tsx
  mobile-pet-tracker/src/screens/home/index.test.tsx
  mobile-pet-tracker/src/screens/home/index.tsx
  mobile-pet-tracker/src/screens/map/index.test.tsx
  mobile-pet-tracker/src/screens/map/index.tsx
  mobile-pet-tracker/src/screens/reminders/index.test.tsx
  mobile-pet-tracker/src/screens/reminders/index.tsx
  mobile-pet-tracker/src/screens/welcome/index.test.tsx
  progress/impl_mobile-empty-states-pingo.md
  specs/mobile-empty-states-pingo/traceability.md
  specs/mobile-ui-language/design.md
Si el leader commitea en mitad (una correccion), solo tocara ficheros
excluidos por los pathspecs de arriba; cualquier otro fichero ajeno en
`git diff --name-only <H0> HEAD` es motivo de parada.

Criterios de aceptacion: R1-R11 de requirements.md. La prueba de humo de
R12 (dev build de Android) es del humano: no la marques. Deja en el impl
sus pasos (requirements.md R12), listos para el humano (tasks.md T12 (1)).

Al terminar, progress/impl_mobile-empty-states-pingo.md debe tener: pwd,
branch, H0 y status; el exit de is-ancestor; node_modules (presente o
instalado); skills cargadas; la salida de las 45 anclas (A1-A29, H1-H16)
en H0 y la de cierre, mas P1-P7; la base con su exit (comando BASE); los
21 commits con hash y R-id; por cada rojo, el comando, la linea `Tests:`,
el exit y cada it rojo con su matcher y Expected/Received, la consulta,
el ENOENT o el modulo que fallo; en T3, el `error TS` y el error de lint;
cada verde con sus lineas `Tests:`, GUARDAS, typecheck y lint; las
sondas S1-S3 con su linea `Tests:` roja y su `limpio=0`; el cierre (15
ficheros con 901, jest entero con exit, typecheck, lint, diffs vacios,
lista cerrada); los pasos del smoke R12; la linea
`R12: pendiente del smoke humano`; y cualquier decision que la spec no
cerrara literalmente.
```

---

## Reanudación 1 (2026-10-08, tras la parada en T3 verde)

> Pegar en Codex CLI: «Lee la sección Reanudación 1 de
> progress/handoff_mobile-empty-states-pingo.md y continúa».

```
Worktree: /home/claude/sites/Pet-Tracker-wt-155   <- el mismo. No cambies de branch.

Causa de la parada (diagnosticada por el leader, no es un fallo tuyo ni del
componente): `bun run lint` es `expo lint`, que llama a eslint con `--cache`
en mobile-pet-tracker/.expo/cache/eslint/. La cache de eslint se indexa por el
contenido del fichero linteado, no por el de sus dependencias: como
empty-state.test.tsx no cambio entre T3 rojo y T3 verde, eslint devolvio el
resultado guardado en T3 rojo (`import/no-unresolved` sobre '../empty-state').
`bunx eslint --no-cache` sobre ese fichero da exit 0. El leader ha borrado esa
cache (esta en .gitignore); `bun run lint` desde mobile-pet-tracker/ da ahora
exit=0 sin tocar ningun fichero tuyo.

Que haces:
1. Comprueba el estado: `git status --short` debe dar exactamente
   `?? mobile-pet-tracker/src/components/empty-state.tsx` y
   `?? progress/impl_mobile-empty-states-pingo.md`, y
   `git log --oneline -1` debe dar d7455e94 (T3 rojo) o este commit de
   reanudacion encima. Si no, PARA.
2. Repite la cadena de T3 verde TAL CUAL esta en el handoff (medidas de jest
   y GUARDAS incluidas) y sigue con T4-T11 y el Cierre sin cambios.
3. No borres la cache tu (tu sandbox deniega rm). Si en otra cadena vuelve a
   salir un error de lint sobre un fichero que no has cambiado, PARA y anota
   la salida de `bunx eslint --no-cache <ese fichero>; echo "exit=$?"`.
4. En el impl, anade una seccion «Reanudacion 1» con estos pasos. Desde aqui,
   cuando un Received ocupe mas de 20 lineas (por ejemplo, un fichero leido
   entero), copia el matcher, el Expected y las 20 primeras lineas del
   Received, y nada mas: el impl ya pasa de 9 700 lineas.

Este commit de reanudacion solo toca progress/handoff_mobile-empty-states-pingo.md,
que la lista cerrada del Cierre ya excluye.
```

---

## Reanudación 2 (2026-10-08, tras la parada en T4 verde)

> Pegar en Codex CLI: «Lee la sección Reanudación 2 de
> progress/handoff_mobile-empty-states-pingo.md y continúa».

```
Worktree: /home/claude/sites/Pet-Tracker-wt-155   <- el mismo. No cambies de branch.

Causa de la parada: la spec chocaba con un candado anterior. En Inicio, el
`it` «lleva a la lista de recordatorios existente» (describe #70 R10)
prohibe importar Href en src/screens/home/index.tsx, y R4 prescribia
`'/pets/add' as Href`. Paraste bien. El leader enmendo la spec: es la
seccion «Enmienda E1» al final de specs/mobile-empty-states-pingo/requirements.md.
Leela entera antes de tocar nada.

0. Precondicion: el humano firma E1. Desde la raiz del worktree:
     grep -cF -- '- [x] Enmienda E1 aprobada' specs/mobile-empty-states-pingo/requirements.md   -> 1
   Si da 0, PARA: la enmienda aun no esta aprobada.

1. Estado. Desde la raiz:
     git status --short
   Debe dar exactamente tus cuatro ficheros de T4 sin commitear:
      M mobile-pet-tracker/src/app/(tabs)/food.tsx
      M mobile-pet-tracker/src/screens/health/index.tsx
      M mobile-pet-tracker/src/screens/home/index.tsx
      M mobile-pet-tracker/src/screens/map/index.tsx
   mas `?? progress/impl_mobile-empty-states-pingo.md`. Y
     git diff --name-only 0c236ef4 HEAD
   solo debe listar ficheros de specs/ y progress/: son commits del leader
   y del humano. Si no, PARA.

2. Arreglo, sobre esos cuatro ficheros:
   - En los cuatro, `router.push('/pets/add' as Href)` pasa a
     `router.push('/pets/add')`.
   - En home, health y map, quita `type Href` del import de 'expo-router'
     que anadiste en T4. Quedan asi:
       home:   import { router, useFocusEffect } from 'expo-router';
       health: import { router } from 'expo-router';
       map:    import { router, useFocusEffect } from 'expo-router';
   - En food.tsx no toques el import: `type Href` lo usan /meal-schedule
     y /meals-history.
   - El candado de #70 R10 y los tests de R4 no se tocan.

3. Anclas E1.4, desde mobile-pet-tracker/:
     for f in src/screens/home/index.tsx src/screens/health/index.tsx 'src/app/(tabs)/food.tsx' src/screens/map/index.tsx; do grep -cF "router.push('/pets/add')" "$f"; done   -> 1 1 1 1
     for f in src/screens/home/index.tsx src/screens/health/index.tsx 'src/app/(tabs)/food.tsx' src/screens/map/index.tsx; do grep -cF "'/pets/add' as Href" "$f"; done   -> 0 0 0 0
     grep -chE "import \{[^}]*\bHref\b" src/screens/home/index.tsx src/screens/health/index.tsx src/screens/map/index.tsx   -> 0 0 0
   Copia las salidas al impl. Si alguna no cuadra, PARA.

4. Repite la cadena de T4 verde TAL CUAL esta en el handoff (441 tests y
   174 de GUARDAS; incluye typecheck y lint) y sigue con T5-T11 y el Cierre
   sin cambios. Si typecheck rechaza '/pets/add' sin cast, PARA, copia el
   error y no vuelvas al cast (E1.5).

5. En el impl, anade una seccion «Reanudacion 2» con estos pasos. Sigue la
   regla de recorte de Received de la Reanudacion 1.

Este commit solo toca requirements.md, tasks.md y este handoff. La lista
cerrada del Cierre excluye los tres.
```

---

## Reanudación 3 (2026-10-08, tras el rechazo de la ronda 1)

> Pegar en Codex CLI: «Lee la sección Reanudación 3 de
> progress/handoff_mobile-empty-states-pingo.md y continúa».

```
Worktree: /home/claude/sites/Pet-Tracker-wt-155   <- el mismo. No cambies de branch.

Causa: el reviewer rechazo la ronda 1 (progress/review_mobile-empty-states-pingo.md).
Tu codigo esta bien; faltan candados en cinco clausulas y sobreviven
mutantes. El leader enmendo la spec: seccion «Enmienda E2» al final de
specs/mobile-empty-states-pingo/requirements.md. Leela ENTERA antes de
tocar nada. E2 solo anade tests: NO cambias ni una linea de produccion.
Todos los candados nacen VERDES contra HEAD (el codigo ya cumple) y su
rojo lo demuestran las sondas del paso 6, como en T10 y T11.

0. Precondicion: el humano firma E2. Desde la raiz del worktree:
     grep -cF -- '- [x] Enmienda E2 aprobada' specs/mobile-empty-states-pingo/requirements.md   -> 1
   Si da 0, PARA: la enmienda aun no esta aprobada.

1. Estado. Desde la raiz:
     git branch --show-current   -> feature/155-mobile-empty-states-pingo
     git diff --quiet && git diff --cached --quiet && test -z "$(git ls-files --others --exclude-standard)"; echo "limpio=$?"   -> limpio=0
     git diff --name-only 8c142376 HEAD -- . ':!specs/' ':!progress/'   -> vacio
   (los commits posteriores a 8c142376 son del leader y del humano y solo
   tocan specs/ y progress/). Apunta `git rev-parse --short HEAD` en el
   impl como E2H: es la base de los diffs del paso 7. Desde
   mobile-pet-tracker/:
     test ! -e .expo/types/router.d.ts; echo "exit=$?"   -> exit=0
   Si algo no cuadra, PARA. Nunca rebasees ni mergees.

2. Reglas de esta reanudacion (mandan las de arriba, «REGLAS CRITICAS»,
   salvo donde esto diga otra cosa):
   - Cada commit solo toca los ficheros de test que nombra su cadena.
     Ningun fichero de produccion, ni package.json, ni bun.lock.
   - Los `it` se copian LITERALES de E2.1 a E2.3 y de aqui: mismos
     nombres, mismas listas, mismos valores. Ni mas ni menos.
   - Si un candado NO nace verde contra HEAD: PARA, copia al impl el `●`
     del it y el `Expected`/`Received` recortado, y no toques produccion
     ni la lista esperada (E2.7).
   - El impl (progress/impl_mobile-empty-states-pingo.md) ya esta
     commiteado: lo vas editando sin stagearlo y entra en el commit del
     paso 7.

3. Candados del componente (src/components/__tests__/empty-state.test.tsx),
   desde mobile-pet-tracker/:

   3a. R3 (E2.1). Anade `import { View } from 'react-native';` en la
   linea siguiente a `import { HeroUINativeProvider } from 'heroui-native';`.
   `renderProbe` envuelve el EmptyState en `<View testID="probe-frame">`
   dentro del provider (E2.1, literal). Al final del describe
   `#155 R3: un único componente pinta los vacíos ilustrados`, los tres
   `it` de E2.1, en su orden. Y en el `it.each`
   `pinta la pose %s a 160×160 y sin etiqueta`, una linea al final, debajo
   de `expect(image.props.accessibilityLabel).toBeUndefined();`:
       expect(image.props.className).toBeUndefined();
     FORCE_COLOR=0 bunx jest src/components/__tests__/empty-state.test.tsx > /tmp/155-e2-r3.txt 2>&1; echo "exit=$?"
       -> exit=0 y `Tests:       62 passed, 62 total`
     <GUARDAS> > /tmp/155-e2-r3-guardas.txt 2>&1; echo "exit=$?"
     grep -qE '^Tests: +62 passed, 62 total$' /tmp/155-e2-r3.txt \
       && grep -qE '^Tests: +174 passed, 174 total$' /tmp/155-e2-r3-guardas.txt \
       && test ! -e .expo/types/router.d.ts && bun run typecheck && bun run lint \
       && git add src/components/__tests__/empty-state.test.tsx \
       && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/components/__tests__/empty-state.test.tsx' \
       && git commit -m 'test(mobile-empty-states): #155 R3 candado de orden y botón'

   3b. R11 (E2.3). Al final del describe
   `#155 R11: los vacíos no traen movimiento ni dependencias`, los dos
   `it` de E2.3, en su orden. Los dos que ya tiene no se tocan. Y en el
   `it.each` del describe `#155 R2: las poses de los vacíos entran como WebP`,
   justo debajo de `expect(bytes[20] & 0x10).not.toBe(0);`, la linea:
       expect(bytes[20] & 0x02).toBe(0);
     FORCE_COLOR=0 bunx jest src/components/__tests__/empty-state.test.tsx > /tmp/155-e2-r11.txt 2>&1; echo "exit=$?"
       -> exit=0 y `Tests:       64 passed, 64 total`
     <GUARDAS> > /tmp/155-e2-r11-guardas.txt 2>&1; echo "exit=$?"
     grep -qE '^Tests: +64 passed, 64 total$' /tmp/155-e2-r11.txt \
       && grep -qE '^Tests: +174 passed, 174 total$' /tmp/155-e2-r11-guardas.txt \
       && test ! -e .expo/types/router.d.ts && bun run typecheck && bun run lint \
       && git add src/components/__tests__/empty-state.test.tsx \
       && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/components/__tests__/empty-state.test.tsx' \
       && git commit -m 'test(mobile-empty-states): #155 R11 candado de Animated y transiciones'

4. Candados de sitio (E2.2). En cada describe, un `it` nuevo JUSTO
   DESPUES del `it` `pinta la pose, el título y la frase de Pingo` (en
   geofences, `…de Pingo, sin tarjeta`). Literales, medidos por el leader
   en un arbol desechable (verdes contra HEAD, typecheck y lint 0):

   src/screens/home/index.test.tsx, describe `#155 R4: Inicio sin mascotas presenta a Pingo`:
  it('queda en el sitio del vacío que sustituye', async () => {
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [] });
    await renderHome();
    await screen.findByTestId('home-empty-pose');
    const slot = screen.getByTestId('home-empty');
    expect(slot.parent?.props.testID).toBe('home-states');
    expect(slot.parent?.children.map((child) => (typeof child === 'string' ? child : (child.props.testID ?? child.type)))).toEqual(['Text', 'home-empty']);
  });

   src/screens/health/index.test.tsx, describe `#155 R4: Salud sin mascotas presenta a Pingo`:
  it('queda en el sitio del vacío que sustituye', async () => {
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [] });
    await renderHealth();
    await screen.findByTestId('health-empty-pose');
    const slot = screen.getByTestId('health-empty');
    expect(slot.parent?.props.testID).toBe('health-states');
    expect(slot.parent?.children.map((child) => (typeof child === 'string' ? child : (child.props.testID ?? child.type)))).toEqual(['Text', 'health-empty']);
  });

   src/app/(tabs)/__tests__/food.test.tsx, describe `#155 R4: Comida sin mascotas presenta a Pingo`:
  it('queda en el sitio del vacío que sustituye', async () => {
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [] });
    await renderFood();
    await screen.findByTestId('food-empty-pose');
    const slot = screen.getByTestId('food-empty');
    expect(slot.parent?.parent?.props.testID).toBe('screen-food');
    expect(slot.parent?.children.map((child) => (typeof child === 'string' ? child : (child.props.testID ?? child.type)))).toEqual(['Text', 'food-empty']);
  });

   src/screens/map/index.test.tsx, describe `#155 R4: Mapa sin mascotas presenta a Pingo`:
  it('queda en el sitio del vacío que sustituye', async () => {
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [] });
    await renderMap();
    await screen.findByTestId('map-no-pets-pose');
    const slot = screen.getByTestId('map-no-pets');
    expect(slot.parent?.props.className).toBe('flex-1 items-center justify-center p-6 bg-background');
    expect(slot.parent?.parent?.props.testID).toBe('screen-map');
    expect(slot.parent?.children.map((child) => (typeof child === 'string' ? child : (child.props.testID ?? child.type)))).toEqual(['map-no-pets']);
  });

   src/screens/alerts/index.test.tsx, describe `#155 R5: sin alertas, Pingo duerme`:
  it('queda en el sitio del vacío que sustituye', async () => {
    mockListAlerts.mockResolvedValue({ kind: 'ok', items: [], nextCursor: null });
    await renderAlerts();
    await screen.findByTestId('alerts-empty-pose');
    const slot = screen.getByTestId('alerts-empty');
    expect(slot.parent?.parent?.props.testID).toBe('alerts-list');
    expect(slot.parent?.children.map((child) => (typeof child === 'string' ? child : (child.props.testID ?? child.type)))).toEqual(['alerts-empty']);
  });

   src/screens/reminders/index.test.tsx, describe `#155 R6: sin recordatorios, Pingo sostiene su lista`:
  it('queda en el sitio del vacío que sustituye', async () => {
    mockListPets.mockResolvedValue({ kind: 'ok', pets: [makePet(), makePet({ id: 'pet-2', name: 'Milo' })] });
    mockListReminders.mockImplementation((_url, _token, petId) => Promise.resolve<RemindersState>({ kind: 'ok', reminders: petId === 'pet-2' ? [makeReminder({ petId: 'pet-2' })] : [] }));
    mockDeleteReminder.mockResolvedValue({ kind: 'forbidden' });
    await renderReminders();
    await screen.findByTestId('reminders-empty-pose');
    const slot = screen.getByTestId('reminders-empty');
    expect(slot.parent?.parent?.props.testID).toBe('screen-reminders');
    expect(slot.parent?.children.map((child) => (typeof child === 'string' ? child : (child.props.testID ?? child.type)))).toEqual(['reminders-actions', 'RCTScrollView', 'reminders-empty', 'reminders-delete-host']);
    await fireEvent.press(screen.getByTestId('pet-chip-pet-2'));
    await waitFor(() => expect(screen.getByTestId('reminder-delete-reminder-1')).toBeVisible());
    await confirmDelete('reminder-1');
    await waitFor(() => expect(screen.getByTestId('reminders-action-error')).toBeVisible());
    await fireEvent.press(screen.getByTestId('pet-chip-pet-1'));
    await screen.findByTestId('reminders-empty-pose');
    const slotWithError = screen.getByTestId('reminders-empty');
    expect(slotWithError.parent?.children.map((child) => (typeof child === 'string' ? child : (child.props.testID ?? child.type)))).toEqual(['reminders-actions', 'RCTScrollView', 'reminders-empty', 'reminders-action-error', 'reminders-delete-host']);
  });

   src/screens/docs/index.test.tsx, describe `#155 R7: sin documentos, Pingo los guarda`:
  it('queda en el sitio del vacío que sustituye', async () => {
    mockGetPet.mockResolvedValue({ kind: 'ok', pet: makePet() });
    mockListPetDocs.mockResolvedValue({ kind: 'ok', docs: [] });
    await renderDocs();
    await screen.findByTestId('docs-empty-pose');
    const slot = screen.getByTestId('docs-empty');
    expect(slot.parent?.parent?.props.testID).toBe('screen-docs');
    expect(slot.parent?.children.map((child) => (typeof child === 'string' ? child : (child.props.testID ?? child.type)))).toEqual(['View', 'docs-empty']);
  });

   src/screens/geofences/index.test.tsx, describe `#155 R8: sin zonas seguras, Pingo enseña el collar`:
  it('queda en el sitio del vacío que sustituye', async () => {
    mockList.mockResolvedValue({ kind: 'ok', geofences: [] });
    await mount();
    await screen.findByTestId('geofences-empty-pose');
    const slot = screen.getByTestId('geofences-empty');
    expect(slot.parent?.parent?.props.testID).toBe('screen-geofences');
    expect(slot.parent?.children.map((child) => (typeof child === 'string' ? child : (child.props.testID ?? child.type)))).toEqual(['geofences-empty', 'geofences-add']);
  });

   src/app/(tabs)/__tests__/food.test.tsx, describe `#155 R9: sin plan de comidas, Pingo enseña el cuenco`:
  it('queda en el sitio del vacío que sustituye', async () => {
    mockGetNutritionPlan.mockResolvedValue({ kind: 'not-found' });
    await renderFood();
    await screen.findByTestId('food-plan-empty-pose');
    const slot = screen.getByTestId('food-plan-empty');
    expect(slot.parent?.parent?.parent?.props.testID).toBe('screen-food');
    expect(slot.parent?.children.map((child) => (typeof child === 'string' ? child : (child.props.testID ?? child.type)))).toEqual(['food-plan-empty', 'meal-schedule-link', 'meals-history-link']);
  });

5. Un commit por requisito, en este orden. Cadena tipo (cambia N, los
   ficheros, la cuenta y el mensaje segun la tabla):
     FORCE_COLOR=0 bunx jest <ficheros> > /tmp/155-e2-rN.txt 2>&1; echo "exit=$?"
       -> exit=0 y la linea `Tests:` de la tabla
     <GUARDAS> > /tmp/155-e2-rN-guardas.txt 2>&1; echo "exit=$?"
     grep -qE '^Tests: +<T> passed, <T> total$' /tmp/155-e2-rN.txt \
       && grep -qE '^Tests: +174 passed, 174 total$' /tmp/155-e2-rN-guardas.txt \
       && test ! -e .expo/types/router.d.ts && bun run typecheck && bun run lint \
       && git add <ficheros sin escapar> \
       && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = '<lista de la tabla, con espacio final>' \
       && git commit -m '<mensaje>'
   En jest la ruta de food va ESCAPADA y entre comillas:
   'src/app/\(tabs\)/__tests__/food.test.tsx'. En git add, sin escapar:
   'src/app/(tabs)/__tests__/food.test.tsx'.

   | N  | ficheros (its de E2.2)                        | T   | mensaje |
   | r4 | home, health, food (R4), map                  | 447 | test(mobile-empty-states): #155 R4 candado de sitio |
   | r5 | alerts                                        | 39  | test(mobile-empty-states): #155 R5 candado de sitio |
   | r6 | reminders                                     | 34  | test(mobile-empty-states): #155 R6 candado de sitio |
   | r7 | docs                                          | 16  | test(mobile-empty-states): #155 R7 candado de sitio |
   | r8 | geofences                                     | 51  | test(mobile-empty-states): #155 R8 candado de sitio |
   | r9 | food (R9)                                     | 63  | test(mobile-empty-states): #155 R9 candado de sitio |
   r4 = 221 + 67 + 62 + 97. Lista de r4 para el test de git diff --cached:
     'mobile-pet-tracker/src/app/(tabs)/__tests__/food.test.tsx mobile-pet-tracker/src/screens/health/index.test.tsx mobile-pet-tracker/src/screens/home/index.test.tsx mobile-pet-tracker/src/screens/map/index.test.tsx '
   Las demas son un solo fichero:
     'mobile-pet-tracker/src/screens/alerts/index.test.tsx ' y asi, con
   food de r9 = 'mobile-pet-tracker/src/app/(tabs)/__tests__/food.test.tsx '.

6. Sondas (E2.5), sobre el HEAD del paso 5, UNA A UNA. Cada una: plantas
   la mutacion, mides el fichero de test de su fila (salida a
   /tmp/155-e2-sN.txt), revisas, y revierte:
     git checkout HEAD -- <fichero de produccion>
     git diff --cached --quiet && git diff --quiet -- . && test -z "$(git ls-files --others --exclude-standard -- .)"; echo "limpio=$?"   -> limpio=0
   (desde mobile-pet-tracker/: `-- .` deja fuera el impl, que sigue
   modificado sin stagear). Rojo esperado, medido por el leader con el
   fichero entero; todos por ASERCION (`expect(received)`), ninguno por
   consulta (`Unable to find`) ni por excepcion:
   Componente (src/components/__tests__/empty-state.test.tsx, 64 tests;
   fichero de produccion src/components/empty-state.tsx):
     E2-S1  titulo y cuerpo intercambiados        2 failed, 62 passed, 64 total
            los dos `…como hijos directos, en ese orden` (toEqual)
     E2-S2  ovalo View envolviendo el Image       2 failed, 62 passed, 64 total
            los dos `…como hijos directos, en ese orden` (toEqual)
     E2-S3  Card con su import en la raiz         3 failed, 61 passed, 64 total
            los dos `…como hijos directos…` (toBe) y
            `EmptyState importa exactamente Image, Button, Text y View` (toEqual)
     E2-S4  View bg-surface en la raiz            2 failed, 62 passed, 64 total
            los dos `…como hijos directos…` (toBe)
     E2-S5  variant="secondary" size="lg"         1 failed, 63 passed, 64 total
            `declara el botón sin size ni variant` (toContain)
     E2-S6  variant="primary" explicito           1 failed, 63 passed, 64 total
            `declara el botón sin size ni variant` (toContain)
     E2-S7  Animated + useEffect/useRef           2 failed, 62 passed, 64 total
            `…importa exactamente…` (toEqual) y
            `EmptyState no anima con Animated, LayoutAnimation ni transiciones` (not.toMatch)
     E2-S8  transition={300} en el Image          1 failed, 63 passed, 64 total
            `…no anima con Animated…` (not.toMatch)
     E2-S9  require('react-native') + RN.Animated 2 failed, 62 passed, 64 total
            `…importa exactamente…` (toHaveLength) y `…no anima…` (not.toMatch)
   Pantallas (el fichero de test de su fila de E2.2; un solo `●`, el
   `it` `queda en el sitio del vacío que sustituye` de su describe):
     E2-S10 home-empty envuelto      home       1 failed, 220 passed, 221 total  toBe
     E2-S11 health-empty envuelto    health     1 failed, 66 passed, 67 total    toBe
     E2-S12 food-empty envuelto      food       1 failed, 62 passed, 63 total    toBe
     E2-S13 map-no-pets envuelto     map        1 failed, 96 passed, 97 total    toBe
     E2-S14 alerts-empty envuelto    alerts     1 failed, 38 passed, 39 total    toBe
     E2-S15 reminders-empty envuelto reminders  1 failed, 33 passed, 34 total    toBe
     E2-S16 docs-empty envuelto      docs       1 failed, 15 passed, 16 total    toBe
     E2-S17 geofences-empty envuelto geofences  1 failed, 50 passed, 51 total    toBe
     E2-S18 food-plan-empty envuelto food (R9)  1 failed, 62 passed, 63 total    toBe
     E2-S19 envoltorio del mapa pelado   map         1 failed, 96 passed, 97 total  toBe
     E2-S20 reminders-empty sobre PetSwitcher  reminders  1 failed, 33 passed, 34 total  toEqual
     E2-S21 food-plan-empty bajo historial     food (R9)  1 failed, 62 passed, 63 total  toEqual
     E2-S22 historial condicionado             food (R9)  1 failed, 62 passed, 63 total  toEqual
   Pre-verificacion (E2-S23 a E2-S27):
     E2-S23 pingo-talk.webp con el bit de animacion   empty-state  1 failed, 63 passed, 64 total
            la fila `pingo-talk.webp es un WebP con alfa…` del it.each de R2 (toBe).
            El fichero de produccion es el asset: revierte con
            git checkout HEAD -- assets/images/pingo-talk.webp
     E2-S24 style inline con fondo en la raiz         empty-state  2 failed, 62 passed, 64 total
            los dos `…como hijos directos…` (toBeUndefined)
     E2-S25 raiz Text en vez de View                  empty-state  2 failed, 62 passed, 64 total
            los dos `…como hijos directos…` (toBe)
     E2-S26 className en el Image                     empty-state  6 failed, 58 passed, 64 total
            las seis filas de `pinta la pose %s a 160×160 y sin etiqueta` (toBeUndefined)
     E2-S27 reminders-empty bajo el error de accion   reminders    1 failed, 33 passed, 34 total
            el `it` de sitio de R6, en la lista con `reminders-action-error` (toEqual)
   Las mutaciones exactas estan en la tabla de E2.5. «Envuelto» = un
   `<View>` pelado alrededor del `<EmptyState … />` de ese testID.
   Si una sonda no da EXACTAMENTE esa linea `Tests:` y esos `●`, PARA y
   copia la salida recortada. Ninguna sonda se commitea.

7. Cierre, desde mobile-pet-tracker/, sin pipe, con salida al impl:
   - Los 15 ficheros: el comando BASE con
     `src/components/__tests__/empty-state.test.tsx` al final, salida a
     /tmp/155-e2-final.txt
       -> exit=0, `Test Suites: 15 passed, 15 total` y
          `Tests:       915 passed, 915 total`
          (reparto: home 221, health 67, food 63, map 97, alerts 39,
          reminders 34, docs 16, geofences 51, welcome 65,
          language-provider 24, ui-language 30, consistency 55,
          design-drift 62, legibility 27, empty-state 64)
   - `pgrep -af '[i]nit\.sh'` vacio; despues
     `FORCE_COLOR=0 bunx jest > /tmp/155-e2-all.txt 2>&1; echo "exit=$?"` -> exit=0.
     Copia `Test Suites:` y `Tests:`. Mientras corre, no lances otra cosa.
   - `bun run typecheck; echo "exit=$?"` -> exit=0 y `bun run lint; echo "exit=$?"` -> exit=0.
   - `git diff --stat <E2H> -- package.json bun.lock app.json src/theme` -> vacio.
   - `git diff --name-only <E2H> HEAD -- . | LC_ALL=C sort` -> exactamente:
       mobile-pet-tracker/src/app/(tabs)/__tests__/food.test.tsx
       mobile-pet-tracker/src/components/__tests__/empty-state.test.tsx
       mobile-pet-tracker/src/screens/alerts/index.test.tsx
       mobile-pet-tracker/src/screens/docs/index.test.tsx
       mobile-pet-tracker/src/screens/geofences/index.test.tsx
       mobile-pet-tracker/src/screens/health/index.test.tsx
       mobile-pet-tracker/src/screens/home/index.test.tsx
       mobile-pet-tracker/src/screens/map/index.test.tsx
       mobile-pet-tracker/src/screens/reminders/index.test.tsx
   Despues, en specs/mobile-empty-states-pingo/traceability.md, SOLO la
   columna «Commit verde» de R3, R4, R5, R6, R7, R8, R9 y R11: anade al
   final de la celda ` · E2: \`<hash corto> <mensaje>\`` con el commit de
   su candado. Nada mas de ese fichero. Commit, desde la raiz:
     git add specs/mobile-empty-states-pingo/traceability.md progress/impl_mobile-empty-states-pingo.md \
       && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'progress/impl_mobile-empty-states-pingo.md specs/mobile-empty-states-pingo/traceability.md ' \
       && git commit -m 'docs(mobile-empty-states-pingo): #155 traceability E2'
   Y la lista cerrada, con salida al impl:
     git diff --name-only <E2H> HEAD -- . ':!feature_list.json' ':!progress/current.md' ':!progress/handoff_mobile-empty-states-pingo.md' ':!specs/mobile-empty-states-pingo/requirements.md' ':!specs/mobile-empty-states-pingo/design.md' ':!specs/mobile-empty-states-pingo/tasks.md' ':!progress/review_mobile-empty-states-pingo.md'
       -> exactamente los 9 de arriba mas
          progress/impl_mobile-empty-states-pingo.md y
          specs/mobile-empty-states-pingo/traceability.md (11)
   No rebasees despues de escribir hashes. NO lances ./init.sh: lo corre
   el leader.

8. En el impl, anade una seccion «Reanudacion 3» con: E2H, limpio=0 del
   paso 1, cada cadena con su linea `Tests:`, GUARDAS, typecheck y lint,
   los 8 commits con hash, cada sonda E2-S1..E2-S27 con su linea `Tests:`
   roja, sus `●` y su `limpio=0`, el cierre del paso 7 y la lista
   cerrada. Termina con la linea `R12: pendiente del smoke humano`.

Este commit solo toca requirements.md, tasks.md y este handoff. La lista
cerrada del paso 7 excluye los tres.
```

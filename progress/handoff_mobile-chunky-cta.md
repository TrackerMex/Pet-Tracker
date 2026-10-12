# Handoff a Codex CLI — #166 mobile-chunky-cta

> Pegar el bloque de abajo en Codex CLI. La spec está firmada (commit de firma
> `94f64979`, aprobación vía Notion el 2026-10-11, P1 a P3 con sus valores por
> defecto). Es la primera feature del bloque de paridad con el canvas aprobado
> el 2026-10-06: el labio «chunky» del primario de Bienvenida pasa a los
> diecinueve primarios sólidos de la app, los cuatro secundarios neutros ganan
> un labio gris con un token nuevo (`--color-lip-gray`) y la carta lo declara
> en su punto 13. Son 10 commits: R1-R4 en pares rojo/verde, uno de
> trazabilidad y uno de lista cerrada. La prueba de humo de R5, en un dev build
> de Android, es del humano y cierra la feature.
>
> `node_modules` lo instala el `init.sh` del leader en
> `Pet-Tracker-wt-166/mobile-pet-tracker`. La branch ya incluye `origin/main`
> 89fe2009: no hace falta merge antes de H0. No hay dependencias nuevas, ni
> assets, ni copy.
>
> Corrección del leader en H0, medida contra el fichero: tasks.md T1 pedía
> `toMatchObject({ '--color-lip-gray': valor })`, pero `parseVariables` de
> `global-css.test.ts` quita el `--` al capturar el nombre; con esa clave el
> verde nunca llegaría. tasks.md ya dice `'color-lip-gray'`.

---

```
Worktree: /home/claude/sites/Pet-Tracker-wt-166   <- PRIMERA LINEA. Trabaja AQUI y en ningun otro sitio
Antes de tocar nada, ejecuta `pwd`, `git branch --show-current`,
`git rev-parse --short HEAD` y `git status --short` y pega las cuatro
salidas al principio de progress/impl_mobile-chunky-cta.md. El hash es H0
(el commit que anade este handoff). En todos los comandos de abajo,
sustituye `<H0>` por ese hash literal: todos los `git diff` se miden
contra el. PARA si la branch no es feature/166-mobile-chunky-cta o si
`git status --short` no sale vacio. No toques /home/claude/sites/Pet-Tracker,
Pet-Tracker-wt-168, Pet-Tracker-wt-169, Pet-Tracker-wt-170,
Pet-Tracker-wt-171 ni ningun otro worktree, ni cambies de branch en
ninguno.

Feature: mobile-chunky-cta (#166)
Branch: feature/166-mobile-chunky-cta
Spec aprobada: specs/mobile-chunky-cta/requirements.md (firma 94f64979).
Las preguntas P1-P3 de requirements.md estan cerradas con sus valores por
defecto (P1 fuera, P2 sin labio, P3 los cuatro neutros): no reabras
ninguna. Lee tambien, enteros: specs/mobile-chunky-cta/design.md,
tasks.md y traceability.md, y requirements.md hasta el final. tasks.md es
tu guion (T0-T4 y su Cierre). Los titulos de describe e it, las recetas
de clases y el bloque de la carta (design.md D5) son LITERALES: copialos
tal cual, con sus tildes y sus simbolos (`%s`, `→`, `—`).

== QUE HACES ==

Los 10 commits, en este orden exacto: T1 R1, T2 R2, T3 R3, T4 R4 (rojo y
verde cada uno), el commit de trazabilidad y el de lista cerrada. Rojo
SIEMPRE antes de su verde, en commits separados. Si escribes un verde
antes que su rojo, ese requisito nace verde y pierde su historial (C4 de
CHECKPOINTS.md); en #19 se metio todo en un solo commit y no vale.

Esto manda sobre tasks.md:
- tasks.md T0 (3) pide `bunx jest` entero para la base: va con el
  comando ALL de abajo (FORCE_COLOR=0, salida a fichero, pgrep antes).
- NO lances ./init.sh. Lo corre el leader (comparte Postgres y LocalStack
  con otras sesiones).
- Sondas: primero commiteas el verde que las nombra y DESPUES plantas cada
  sonda sobre ese HEAD, la mides y la reviertes. Asi `limpio=0` es
  verificable.
- Trazabilidad: traceability.md se rellena entera UNA vez, al final, en
  el commit de trazabilidad. Ningun commit de T1-T4 la toca.
- No hay commits `refactor(...)`: tasks.md no preve ninguno.
- Mide con `FORCE_COLOR=0` delante de `bunx jest`, `--runTestsByPath` y
  la salida a un fichero, como en las cadenas de abajo.
- Typecheck y lint: `bun run typecheck` (es `tsc --noEmit`) y
  `bunx expo lint --no-cache`. Nunca `bun run lint` (usa la cache de
  eslint y en #155 dio un error obsoleto).

== BASE ==

Primero, literal:
  cd /home/claude/sites/Pet-Tracker-wt-166/mobile-pet-tracker && pwd
  -> /home/claude/sites/Pet-Tracker-wt-166/mobile-pet-tracker
Todo lo de esta seccion, las anclas A1-A8 y COMMITS va desde ahi. Las
anclas H y P y el final del CIERRE van desde la raiz
(`cd /home/claude/sites/Pet-Tracker-wt-166 && pwd`).

Error de invocacion: si un comando falla ANTES de que arranquen jest,
tsc o eslint (`No such file or directory`, `command not found`, un
`ERR_PNPM_*` o un `pwd` que no es el esperado) y no has tocado ningun
fichero, NO es una parada: haz el `cd` literal de arriba, repite el
comando y anotalo en el impl. Cualquier otro fallo si es una parada.

origin/main = 89fe2009 al escribir este handoff, y la branch ya lo
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

Variable de produccion (tasks.md), definela en la shell antes de las
anclas y de cada cadena que la use; sin comillas al usarla:
  PROD="--include=*.ts --include=*.tsx --exclude=*.test.ts --exclude=*.test.tsx --exclude-dir=__tests__"

Base medida por el leader el 2026-10-11 en este worktree con el arbol de
H0, con el comando BASE (un solo jest, FORCE_COLOR=0, sin pipe): exit=0,
`Test Suites: 14 passed, 14 total` y `Tests:       700 passed, 700 total`.
Reparto por fichero:
  src/theme/__tests__/global-css.test.ts                 51
  src/__tests__/consistency-classnames.test.ts           55
  src/app/(auth)/__tests__/login.test.tsx                11
  src/app/(auth)/__tests__/register.test.tsx             13
  src/screens/forgot/index.test.tsx                      31
  src/screens/reset-password/index.test.tsx              19
  src/screens/geofence-editor/index.test.tsx             68
  src/screens/geofences/index.test.tsx                   58
  src/components/__tests__/empty-state.test.tsx          95
  src/screens/welcome/index.test.tsx                     65
  src/screens/docs/index.test.tsx                        108
  src/screens/reminders/index.test.tsx                   34
  src/__tests__/design-drift.test.ts                     65
  src/__tests__/legibility-classnames.test.ts            27
Tu medida manda: repite el comando BASE y anota sus dos lineas en el
impl. Si el total no es 700 o algo nace rojo, mide fichero a fichero,
anota y PARA.

Comando BASE (las dos rutas con `(auth)` van entre comillas simples;
--runTestsByPath las toma literales):
  FORCE_COLOR=0 bunx jest --runTestsByPath src/theme/__tests__/global-css.test.ts src/__tests__/consistency-classnames.test.ts 'src/app/(auth)/__tests__/login.test.tsx' 'src/app/(auth)/__tests__/register.test.tsx' src/screens/forgot/index.test.tsx src/screens/reset-password/index.test.tsx src/screens/geofence-editor/index.test.tsx src/screens/geofences/index.test.tsx src/components/__tests__/empty-state.test.tsx src/screens/welcome/index.test.tsx src/screens/docs/index.test.tsx src/screens/reminders/index.test.tsx src/__tests__/design-drift.test.ts src/__tests__/legibility-classnames.test.ts > /tmp/166-base.txt 2>&1; echo "exit=$?"

Comando ALL (la suite entera; con `pgrep -af '[i]nit\.sh'` vacio antes y
sin lanzar nada mas mientras corre):
  FORCE_COLOR=0 bunx jest > /tmp/166-all-base.txt 2>&1; echo "exit=$?"
  -> exit=0. Copia al impl sus lineas `Test Suites:` y `Tests:`. Si exit
     no es 0, anota los `●` y PARA.
  ALL base (leader, H0): exit=0, `Test Suites: 98 passed, 98 total` y
  `Tests:       2765 passed, 2765 total`. Cierre esperado: 98 suites y
  2775 tests (2765 + 10; #166 no crea ficheros de test).

Comando GUARDAS (los candados de carta; lo corre cada verde; siempre
65 + 27 = 92):
  FORCE_COLOR=0 bunx jest --runTestsByPath src/__tests__/design-drift.test.ts src/__tests__/legibility-classnames.test.ts
En las cadenas aparece como `<GUARDAS> > /tmp/166-gN-guardas.txt 2>&1`.

== ANCLAS ==

Ejecutalas TODAS antes de tocar nada y copia la salida al impl. A1-A8
son las de tasks.md T0 (2), desde mobile-pet-tracker/ con PROD definida.
H1-H24 van desde la RAIZ. Solo estos comandos son anclas; los numeros de
linea no lo son. Si alguna no da EXACTAMENTE lo esperado, PARA y avisa
(ante una diferencia manda el fichero, no el handoff). Cuando `grep -c`
cuenta 0 sale con codigo 1: lo que vale es la cifra impresa. El leader
las ha ejecutado todas en H0 sacandolas de este mismo fichero.

A1-A8: las de tasks.md T0 (2), con su salida esperada (19, 18, 1, 1, 0,
2, 1, 0).
H1. grep -cF -- '- [x] Aprobado por humano, con P1 a P3 resueltas (fecha: 2026-10-11)' specs/mobile-chunky-cta/requirements.md   -> 1
H2. grep -cF -- '- [ ] Prueba de humo R5 superada en dev build de Android (fecha: ____)' specs/mobile-chunky-cta/requirements.md   -> 1
H3. grep -cF '"status": "in_progress"' feature_list.json   -> 1
H4. grep -rlF '#166' mobile-pet-tracker/src | wc -l   -> 0
H5. grep -cF 'function parseVariables(block: string): Record<string, string> {' mobile-pet-tracker/src/theme/__tests__/global-css.test.ts   -> 1
H6. grep -cF "describe('R2: tokens glass-surface y tab-pill en light y dark'" mobile-pet-tracker/src/theme/__tests__/global-css.test.ts   -> 1
H7. grep -cF -- '      --color-tab-pill: rgba(23,130,85,0.14);' mobile-pet-tracker/src/theme/global.css   -> 1
H8. grep -cF -- '      --color-tab-pill: rgba(23,130,85,0.22);' mobile-pet-tracker/src/theme/global.css   -> 1
H9. grep -cE '^function (sourceFiles|filesMatching|readSource|openingTagWithTestId)\(' mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts   -> 4
H10. grep -cF 'toHaveLength(13 + 1 + 1 + 1 + 1 + 1 + 1)' mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts   -> 1
H11. grep -cF 'toBe(13 + 1 + 1 + 1 + 1 + 1 + 1)' mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts   -> 1
H12. grep -lF "rounded-xl bg-accent'" 'mobile-pet-tracker/src/app/(auth)/__tests__/login.test.tsx' 'mobile-pet-tracker/src/app/(auth)/__tests__/register.test.tsx' mobile-pet-tracker/src/screens/forgot/index.test.tsx mobile-pet-tracker/src/screens/reset-password/index.test.tsx mobile-pet-tracker/src/screens/geofence-editor/index.test.tsx mobile-pet-tracker/src/screens/geofences/index.test.tsx | wc -l   -> 6
H13. grep -cF 'rounded-xl bg-accent"' mobile-pet-tracker/src/components/__tests__/empty-state.test.tsx   -> 2
H14. grep -cF 'not.toMatch(/border-b-4/)' mobile-pet-tracker/src/components/__tests__/empty-state.test.tsx   -> 1
H15. grep -cF "it('declara el botón primario sin labio'" mobile-pet-tracker/src/components/__tests__/empty-state.test.tsx   -> 1
H16. grep -cF "it('declara el botón sin size ni variant'" mobile-pet-tracker/src/components/__tests__/empty-state.test.tsx   -> 1
H17. grep -cF 'border border-accent bg-transparent' mobile-pet-tracker/src/screens/welcome/index.test.tsx   -> 1
H18. grep -cF "it('es un botón hueco con tinta accent-strong'" mobile-pet-tracker/src/screens/welcome/index.test.tsx   -> 1
H19. grep -cF "it('deja el CTA secundario sin labio'" mobile-pet-tracker/src/screens/welcome/index.test.tsx   -> 1
H20. grep -cF "it('declara el labio en el CTA primario'" mobile-pet-tracker/src/screens/welcome/index.test.tsx   -> 1
H21. grep -cF 'async function renderWelcome(' mobile-pet-tracker/src/screens/welcome/index.test.tsx   -> 1
H22. grep -cF 'className="w-full rounded-xl"' mobile-pet-tracker/src/screens/forgot/index.tsx mobile-pet-tracker/src/screens/reminders/index.tsx   -> las dos con :1
H23. grep -cF 'className="rounded-xl"' mobile-pet-tracker/src/screens/docs/index.tsx   -> 1
H24. grep -cF '## Animación (decisiones por defecto)' docs/ui-guidelines.md   -> 1

Valores al cerrar (copialos al impl): A1 -> 19; A2 -> 0; A3 -> 19;
A4 -> 23 (19 `border-b-4` mas 4 `border-b-6`); A5 no se fija (anota el
valor); A6 -> 2; A7 -> 1; A8 -> 1. H1-H3 sin cambios; H4 no se fija
(anota el valor); H5-H11 sin cambios; H12 -> 0; H13 -> 0; H14 -> 0;
H15 -> 0; H16 -> 1; H17 -> 0; H18 -> 0; H19 -> 0; H20 -> 1; H21 -> 1;
H22 -> las dos con :0; H23 -> 0; H24 -> 1. Y en positivo al cerrar,
desde la raiz:
  P1. grep -cF -- '--color-lip-gray:' mobile-pet-tracker/src/theme/global.css   -> 2
  P2. grep -rhoF 'rounded-xl bg-accent border-b-4 border-black/25"' mobile-pet-tracker/src $PROD | wc -l   -> 19
  P3. grep -rhoF 'border-2 border-b-6 border-lip-gray bg-surface' mobile-pet-tracker/src $PROD | wc -l   -> 4
  P4. grep -cF "describe('#166 R" mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts   -> 3
  P5. grep -cF "describe('#166 R1: global.css declara el labio gris en los dos temas'" mobile-pet-tracker/src/theme/__tests__/global-css.test.ts   -> 1
  P6. grep -cF "describe('#166 R3: el CTA secundario lleva el labio gris'" mobile-pet-tracker/src/screens/welcome/index.test.tsx   -> 1
  P7. grep -cF "it('declara el botón primario con labio'" mobile-pet-tracker/src/components/__tests__/empty-state.test.tsx   -> 1
  P8. grep -cF "it('es un botón de superficie con labio gris y tinta accent-strong'" mobile-pet-tracker/src/screens/welcome/index.test.tsx   -> 1
  P9. grep -cF '13. **Botón con cuerpo** (feature #166, 2026-10-11)' docs/ui-guidelines.md   -> 1

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

Rojos: todos los de esta feature caen por ASERCION (Expected/Received):
los nodos y los ficheros existen. Nunca por consulta (`Unable to find`),
TypeError, ReferenceError, SyntaxError, `Test suite failed to run` ni
`Cannot find module`. La cadena comprueba la cuenta y el tipo; tu ademas
abres el log y copias al impl cada it rojo con su matcher y su
Expected/Received. Si un Received ocupa mas de 20 lineas, copia el
matcher, el Expected y las 20 primeras lineas del Received, y nada mas.

Typecheck y lint van en TODAS las cadenas, rojas incluidas, y dan exit 0.

Cada cadena termina igual, tras su `git add`: la lista exacta de lo
stageado y que no quede nada sin stagear en mobile-pet-tracker/, docs/
ni specs/ (el impl vive en progress/ sin trackear hasta el Cierre; no lo
stagees antes):
  git diff --quiet -- . ../docs ../specs && test -z "$(git ls-files --others --exclude-standard -- . ../docs ../specs)"
En las cadenas aparece como `<LIMPIO>`. NUNCA `git status --short` tras
un `git add`: falla siempre (lo stageado sale).

Sondas: sobre el HEAD del commit que las nombra, UNA A UNA. Plantas la
mutacion, mides SOLO los ficheros de test que dice la sonda (salida a
/tmp/166-sN.txt), copias al impl la linea `Tests:` y los `●`, y reviertes:
  git checkout HEAD -- <fichero de la sonda>
  git diff --cached --quiet && git diff --quiet; echo "limpio=$?"   -> limpio=0
Nunca `git checkout <commit> -- <fichero>` (deja el cambio en el
indice). Si una sonda no da EXACTAMENTE su linea `Tests:` y sus `●`,
PARA.
`●` son SOLO los encabezados de it rojo: Jest tambien imprime bloques
`  ● Console` (console.warn de Uniwind, console.info de HeroUI) que no
cuentan nunca, ni en sondas ni en rojos; se copian al impl sin filtrar. Ninguna sonda se commitea. Todas caen por ASERCION.

-- T1 R1: el token del labio gris --

c1, T1 rojo (tasks.md T1 (1): el describe
`#166 R1: global.css declara el labio gris en los dos temas` con su
it.each de 2 filas, al final de global-css.test.ts; clave
`'color-lip-gray'`, SIN `--`):
  FORCE_COLOR=0 bunx jest --runTestsByPath src/theme/__tests__/global-css.test.ts > /tmp/166-r1.txt 2>&1; echo "exit=$?"
    -> exit=1 y `Tests:       2 failed, 51 passed, 53 total`, los dos por asercion
  grep -qE '^Tests: +2 failed, 51 passed, 53 total$' /tmp/166-r1.txt \
    && test "$(grep -E '^  ● ' /tmp/166-r1.txt | grep -cvxF '  ● Console')" = 2 \
    && test "$(grep -E '^  ● ' /tmp/166-r1.txt | grep -cF 'declara --color-lip-gray exacto en')" = 2 \
    && ! grep -qE 'Test suite failed to run|TypeError|ReferenceError|SyntaxError|Cannot find module' /tmp/166-r1.txt \
    && ! grep -qF 'Unable to find' /tmp/166-r1.txt \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bunx expo lint --no-cache \
    && git add src/theme/__tests__/global-css.test.ts \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/theme/__tests__/global-css.test.ts' \
    && <LIMPIO> \
    && git commit -m 'test(mobile): falta el token del labio gris (R1)'

c2, T1 verde (tasks.md T1 (2): las dos lineas de design.md D4, cada una
justo debajo de su linea `--color-tab-pill:`, H7 y H8):
  FORCE_COLOR=0 bunx jest --runTestsByPath src/theme/__tests__/global-css.test.ts > /tmp/166-g1.txt 2>&1; echo "exit=$?"
    -> exit=0 y `Tests:       53 passed, 53 total`
  <GUARDAS> > /tmp/166-g1-guardas.txt 2>&1; echo "exit=$?"
  grep -qE '^Tests: +53 passed, 53 total$' /tmp/166-g1.txt \
    && grep -qE '^Tests: +92 passed, 92 total$' /tmp/166-g1-guardas.txt \
    && test "$(grep -cF -- '--color-lip-gray:' src/theme/global.css)" = 2 \
    && test "$(grep -cF -- '      --color-lip-gray: #E4E7EC;' src/theme/global.css)" = 1 \
    && test "$(grep -cF -- '      --color-lip-gray: #0A0D12;' src/theme/global.css)" = 1 \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bunx expo lint --no-cache \
    && git add src/theme/global.css \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/theme/global.css' \
    && <LIMPIO> \
    && git commit -m 'feat(mobile): token --color-lip-gray en los dos temas (R1)'
  Despues, las sondas de tasks.md T1, sobre src/theme/global.css, midiendo
  solo src/theme/__tests__/global-css.test.ts:
    S1.1  valor dark `#0A0D12` cambiado a `#E4E7EC`
          -> `Tests:       1 failed, 52 passed, 53 total` (solo la fila dark)
    S1.2  linea light `--color-lip-gray` borrada
          -> `Tests:       1 failed, 52 passed, 53 total` (solo la fila light)

-- T2 R2: el labio en los diecinueve primarios --

c3, T2 rojo (tasks.md T2 (1): T2.0, el describe
`#166 R2: todo primario sólido lleva el labio detrás de bg-accent`, 2 it,
al final de consistency-classnames.test.ts; T2.1, las seis cadenas `toBe`
y los dos it de empty-state, uno renombrado y sin su `not.toMatch`):
  FORCE_COLOR=0 bunx jest --runTestsByPath src/__tests__/consistency-classnames.test.ts 'src/app/(auth)/__tests__/login.test.tsx' 'src/app/(auth)/__tests__/register.test.tsx' src/screens/forgot/index.test.tsx src/screens/reset-password/index.test.tsx src/screens/geofence-editor/index.test.tsx src/screens/geofences/index.test.tsx src/components/__tests__/empty-state.test.tsx > /tmp/166-r2.txt 2>&1; echo "exit=$?"
    -> exit=1 y `Tests:       10 failed, 342 passed, 352 total`, los diez por asercion
  grep -qE '^Tests: +10 failed, 342 passed, 352 total$' /tmp/166-r2.txt \
    && test "$(grep -E '^  ● ' /tmp/166-r2.txt | grep -cvxF '  ● Console')" = 10 \
    && test "$(grep -E '^  ● ' /tmp/166-r2.txt | grep -cF '#166 R2: todo primario sólido lleva el labio detrás de bg-accent')" = 2 \
    && ! grep -qE '^  ● (#62 R1|#98 R10)' /tmp/166-r2.txt \
    && ! grep -qE 'Test suite failed to run|TypeError|ReferenceError|SyntaxError|Cannot find module' /tmp/166-r2.txt \
    && ! grep -qF 'Unable to find' /tmp/166-r2.txt \
    && test "$(grep -lF "rounded-xl bg-accent'" 'src/app/(auth)/__tests__/login.test.tsx' 'src/app/(auth)/__tests__/register.test.tsx' src/screens/forgot/index.test.tsx src/screens/reset-password/index.test.tsx src/screens/geofence-editor/index.test.tsx src/screens/geofences/index.test.tsx | wc -l)" = 0 \
    && test "$(grep -lF "rounded-xl bg-accent border-b-4 border-black/25'" 'src/app/(auth)/__tests__/login.test.tsx' 'src/app/(auth)/__tests__/register.test.tsx' src/screens/forgot/index.test.tsx src/screens/reset-password/index.test.tsx src/screens/geofence-editor/index.test.tsx src/screens/geofences/index.test.tsx | wc -l)" = 6 \
    && test "$(grep -cF 'border-b-4 border-black/25"' src/components/__tests__/empty-state.test.tsx)" = 2 \
    && test "$(grep -cF 'not.toMatch(/border-b-4/)' src/components/__tests__/empty-state.test.tsx)" = 0 \
    && test "$(grep -cF "it('declara el botón primario con labio'" src/components/__tests__/empty-state.test.tsx)" = 1 \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bunx expo lint --no-cache \
    && git add src/__tests__/consistency-classnames.test.ts 'src/app/(auth)/__tests__/login.test.tsx' 'src/app/(auth)/__tests__/register.test.tsx' src/components/__tests__/empty-state.test.tsx src/screens/forgot/index.test.tsx src/screens/geofence-editor/index.test.tsx src/screens/geofences/index.test.tsx src/screens/reset-password/index.test.tsx \
    && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts mobile-pet-tracker/src/app/(auth)/__tests__/login.test.tsx mobile-pet-tracker/src/app/(auth)/__tests__/register.test.tsx mobile-pet-tracker/src/components/__tests__/empty-state.test.tsx mobile-pet-tracker/src/screens/forgot/index.test.tsx mobile-pet-tracker/src/screens/geofence-editor/index.test.tsx mobile-pet-tracker/src/screens/geofences/index.test.tsx mobile-pet-tracker/src/screens/reset-password/index.test.tsx ' \
    && <LIMPIO> \
    && git commit -m 'test(mobile): todo primario sólido lleva el labio (R2)'

c4, T2 verde (tasks.md T2 (2): en los 16 ficheros de produccion, el
literal `rounded-xl bg-accent"` pasa a
`rounded-xl bg-accent border-b-4 border-black/25"`, 18 apariciones; ni
welcome/index.tsx ni ninguna otra clase):
  FORCE_COLOR=0 bunx jest --runTestsByPath src/__tests__/consistency-classnames.test.ts 'src/app/(auth)/__tests__/login.test.tsx' 'src/app/(auth)/__tests__/register.test.tsx' src/screens/forgot/index.test.tsx src/screens/reset-password/index.test.tsx src/screens/geofence-editor/index.test.tsx src/screens/geofences/index.test.tsx src/components/__tests__/empty-state.test.tsx > /tmp/166-g2.txt 2>&1; echo "exit=$?"
    -> exit=0 y `Tests:       352 passed, 352 total`
  <GUARDAS> > /tmp/166-g2-guardas.txt 2>&1; echo "exit=$?"
  grep -qE '^Tests: +352 passed, 352 total$' /tmp/166-g2.txt \
    && grep -qE '^Tests: +92 passed, 92 total$' /tmp/166-g2-guardas.txt \
    && test "$(grep -rhoF 'rounded-xl bg-accent"' src $PROD | wc -l)" = 0 \
    && test "$(grep -rhoF 'rounded-xl bg-accent border-b-4 border-black/25"' src $PROD | wc -l)" = 19 \
    && test "$(grep -rhoE "rounded-xl bg-accent([[:space:]]|\"|'|\`)" src $PROD | wc -l)" = 19 \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bunx expo lint --no-cache \
    && git add 'src/app/(auth)/login.tsx' 'src/app/(auth)/register.tsx' src/components/empty-state.tsx src/screens/add-pet/index.tsx src/screens/add-reminder/index.tsx src/screens/docs/index.tsx src/screens/forgot/index.tsx src/screens/geofence-editor/index.tsx src/screens/geofences/index.tsx src/screens/home/index.tsx src/screens/meal-schedule/index.tsx src/screens/pairing/index.tsx src/screens/profile/index.tsx src/screens/reminders/index.tsx src/screens/reset-password/index.tsx src/screens/weight-log/index.tsx \
    && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/app/(auth)/login.tsx mobile-pet-tracker/src/app/(auth)/register.tsx mobile-pet-tracker/src/components/empty-state.tsx mobile-pet-tracker/src/screens/add-pet/index.tsx mobile-pet-tracker/src/screens/add-reminder/index.tsx mobile-pet-tracker/src/screens/docs/index.tsx mobile-pet-tracker/src/screens/forgot/index.tsx mobile-pet-tracker/src/screens/geofence-editor/index.tsx mobile-pet-tracker/src/screens/geofences/index.tsx mobile-pet-tracker/src/screens/home/index.tsx mobile-pet-tracker/src/screens/meal-schedule/index.tsx mobile-pet-tracker/src/screens/pairing/index.tsx mobile-pet-tracker/src/screens/profile/index.tsx mobile-pet-tracker/src/screens/reminders/index.tsx mobile-pet-tracker/src/screens/reset-password/index.tsx mobile-pet-tracker/src/screens/weight-log/index.tsx ' \
    && <LIMPIO> \
    && git commit -m 'feat(mobile): labio en los diecinueve primarios sólidos (R2)'
  Despues, las sondas de tasks.md T2. S2.1, S2.2 y S2.4 miden solo
  src/__tests__/consistency-classnames.test.ts (57 its); S2.3 mide ese
  y src/components/__tests__/empty-state.test.tsx (152 its):
    S2.1  en src/screens/profile/index.tsx, quita ` border-b-4 border-black/25`
          del tag de `profile-add-pet`
          -> `Tests:       2 failed, 55 passed, 57 total` (`inventaría los
             diecinueve…` y `no deja la receta…`)
    S2.2  en src/screens/pairing/index.tsx, el className de `ready-map` pasa a
          `min-h-11 w-full rounded-xl border-b-4 border-black/25 bg-accent`
          -> `Tests:       3 failed, 54 passed, 57 total` (`inventaría los
             diecinueve…`, `deja todos los botones primarios sólidos en un
             único radio` del describe `#62 R1: …` y `deja CONTINUOUS_CORNER,
             bg-accent-soft y el acento donde estaban` del describe
             `#98 R10: …`; `no deja la receta…` sigue verde)
    S2.3  en src/components/empty-state.tsx, quita ` border-b-4 border-black/25`
          -> `Tests:       4 failed, 148 passed, 152 total` (`inventaría
             los diecinueve…`, `no deja la receta…`, `declara el botón primario
             con labio` y `declara el botón sin size ni variant`)
    S2.4  en src/screens/pairing/index.tsx, anade ` border-b-4 border-black/25`
          detras de `bg-danger` en `device-unpair`
          -> `Tests:       1 failed, 56 passed, 57 total` (solo `no deja la
             receta…`)

-- T3 R3: el labio gris en los cuatro secundarios neutros --

c5, T3 rojo (tasks.md T3 (1): T3.0, el describe
`#166 R3: el secundario neutro lleva el labio gris` con el it.each de 4
filas y el inventario, al final de consistency-classnames.test.ts; T3.1,
en welcome/index.test.tsx el it de `R8` renombrado con su nuevo `toBe`,
el it `deja el CTA secundario sin labio` borrado entero y el describe
`#166 R3: el CTA secundario lleva el labio gris`, 1 it, al final):
  FORCE_COLOR=0 bunx jest --runTestsByPath src/__tests__/consistency-classnames.test.ts src/screens/welcome/index.test.tsx src/screens/forgot/index.test.tsx src/screens/docs/index.test.tsx src/screens/reminders/index.test.tsx > /tmp/166-r3.txt 2>&1; echo "exit=$?"
    -> exit=1 y `Tests:       7 failed, 293 passed, 300 total`, los siete por asercion
  grep -qE '^Tests: +7 failed, 293 passed, 300 total$' /tmp/166-r3.txt \
    && test "$(grep -E '^  ● ' /tmp/166-r3.txt | grep -cvxF '  ● Console')" = 7 \
    && test "$(grep -E '^  ● ' /tmp/166-r3.txt | grep -cF '#166 R3: el secundario neutro lleva el labio gris')" = 5 \
    && test "$(grep -E '^  ● ' /tmp/166-r3.txt | grep -cF 'es un botón de superficie con labio gris y tinta accent-strong')" = 1 \
    && test "$(grep -E '^  ● ' /tmp/166-r3.txt | grep -cF 'lleva el labio gris en el CTA secundario')" = 1 \
    && ! grep -qE 'Test suite failed to run|TypeError|ReferenceError|SyntaxError|Cannot find module' /tmp/166-r3.txt \
    && ! grep -qF 'Unable to find' /tmp/166-r3.txt \
    && test "$(grep -cF "it('deja el CTA secundario sin labio'" src/screens/welcome/index.test.tsx)" = 0 \
    && test "$(grep -cF 'border border-accent bg-transparent' src/screens/welcome/index.test.tsx)" = 0 \
    && test "$(grep -cF "it('declara el labio en el CTA primario'" src/screens/welcome/index.test.tsx)" = 1 \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bunx expo lint --no-cache \
    && git add src/__tests__/consistency-classnames.test.ts src/screens/welcome/index.test.tsx \
    && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts mobile-pet-tracker/src/screens/welcome/index.test.tsx ' \
    && <LIMPIO> \
    && git commit -m 'test(mobile): el secundario neutro lleva el labio gris (R3)'

c6, T3 verde (tasks.md T3 (2): las cuatro sustituciones de su tabla, H22
y H23; no cambia ninguna `variant` ni ningun `Button.Label`):
  FORCE_COLOR=0 bunx jest --runTestsByPath src/__tests__/consistency-classnames.test.ts src/screens/welcome/index.test.tsx src/screens/forgot/index.test.tsx src/screens/docs/index.test.tsx src/screens/reminders/index.test.tsx > /tmp/166-g3.txt 2>&1; echo "exit=$?"
    -> exit=0 y `Tests:       300 passed, 300 total`
  <GUARDAS> > /tmp/166-g3-guardas.txt 2>&1; echo "exit=$?"
  grep -qE '^Tests: +300 passed, 300 total$' /tmp/166-g3.txt \
    && grep -qE '^Tests: +92 passed, 92 total$' /tmp/166-g3-guardas.txt \
    && test "$(grep -rhoF 'border-2 border-b-6 border-lip-gray bg-surface' src $PROD | wc -l)" = 4 \
    && test "$(grep -cF 'border border-accent bg-transparent' src/screens/welcome/index.tsx)" = 0 \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bunx expo lint --no-cache \
    && git add src/screens/docs/index.tsx src/screens/forgot/index.tsx src/screens/reminders/index.tsx src/screens/welcome/index.tsx \
    && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/screens/docs/index.tsx mobile-pet-tracker/src/screens/forgot/index.tsx mobile-pet-tracker/src/screens/reminders/index.tsx mobile-pet-tracker/src/screens/welcome/index.tsx ' \
    && <LIMPIO> \
    && git commit -m 'feat(mobile): labio gris en los cuatro secundarios neutros (R3)'
  Despues, las sondas de tasks.md T3. S3.1-S3.4 miden solo
  src/__tests__/consistency-classnames.test.ts (62 its); S3.5 mide ese y
  src/screens/welcome/index.test.tsx (127 its):
    S3.1  en src/screens/docs/index.tsx, quita ` border-lip-gray` de
          `docs-upload-cancel`
          -> `Tests:       2 failed, 60 passed, 62 total` (la fila de
             docs del it.each e `inventaría los cuatro…`)
    S3.2  en src/screens/profile/index.tsx, quita ` bg-default` de `theme-toggle`
          -> `Tests:       1 failed, 61 passed, 62 total` (solo
             `inventaría los cuatro…`)
    S3.3  en src/screens/add-pet/index.tsx, anade ` border-2 border-b-6 border-lip-gray`
          detras de `bg-accent-soft` en `add-pet-photo`
          -> `Tests:       1 failed, 61 passed, 62 total` (solo
             `inventaría los cuatro…`)
    S3.4  en src/screens/reminders/index.tsx, quita `variant="outline"` de
          `reminders-delete-cancel`
          -> `Tests:       1 failed, 61 passed, 62 total` (solo la fila de
             reminders del it.each)
    S3.5  en src/screens/welcome/index.tsx, anade ` border-accent` detras de
          `bg-surface` en `welcome-have-account`
          -> `Tests:       3 failed, 124 passed, 127 total` (la fila de
             welcome del it.each, el it renombrado de `R8` y el de `#166 R3`)

-- T4 R4: la carta --

c7, T4 rojo (tasks.md T4 (1): el describe
`#166 R4: la carta declara el botón con cuerpo`, 1 it, al final de
consistency-classnames.test.ts):
  FORCE_COLOR=0 bunx jest --runTestsByPath src/__tests__/consistency-classnames.test.ts > /tmp/166-r4.txt 2>&1; echo "exit=$?"
    -> exit=1 y `Tests:       1 failed, 62 passed, 63 total`, por asercion
  grep -qE '^Tests: +1 failed, 62 passed, 63 total$' /tmp/166-r4.txt \
    && test "$(grep -E '^  ● ' /tmp/166-r4.txt | grep -cvxF '  ● Console')" = 1 \
    && test "$(grep -E '^  ● ' /tmp/166-r4.txt | grep -cF 'declara las dos recetas y el orden del labio')" = 1 \
    && ! grep -qE 'Test suite failed to run|TypeError|ReferenceError|SyntaxError|Cannot find module' /tmp/166-r4.txt \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bunx expo lint --no-cache \
    && git add src/__tests__/consistency-classnames.test.ts \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts' \
    && <LIMPIO> \
    && git commit -m 'test(mobile): la carta declara el botón con cuerpo (R4)'

c8, T4 verde (tasks.md T4 (2): el bloque exacto de design.md D5 detras
de la linea `    para añadírselo.` de docs/ui-guidelines.md, con una
linea en blanco antes y otra despues; nada mas de la carta):
  FORCE_COLOR=0 bunx jest --runTestsByPath src/__tests__/consistency-classnames.test.ts > /tmp/166-g4.txt 2>&1; echo "exit=$?"
    -> exit=0 y `Tests:       63 passed, 63 total`
  <GUARDAS> > /tmp/166-g4-guardas.txt 2>&1; echo "exit=$?"
  grep -qE '^Tests: +63 passed, 63 total$' /tmp/166-g4.txt \
    && grep -qE '^Tests: +92 passed, 92 total$' /tmp/166-g4-guardas.txt \
    && test "$(grep -cF '13. **Botón con cuerpo** (feature #166, 2026-10-11)' ../docs/ui-guidelines.md)" = 1 \
    && test "$(grep -cF '## Animación (decisiones por defecto)' ../docs/ui-guidelines.md)" = 1 \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bunx expo lint --no-cache \
    && git add ../docs/ui-guidelines.md \
    && test "$(git diff --cached --name-only)" = 'docs/ui-guidelines.md' \
    && <LIMPIO> \
    && git commit -m 'docs(mobile): punto 13 de la carta, botón con cuerpo (R4)'
  Despues, las sondas de tasks.md T4, sobre docs/ui-guidelines.md
  (revertir con `git checkout HEAD -- ../docs/ui-guidelines.md`), midiendo
  solo src/__tests__/consistency-classnames.test.ts:
    S4.1  en el punto 13, la receta primaria pasa a
          `rounded-xl border-b-4 border-black/25 bg-accent`
          -> `Tests:       1 failed, 62 passed, 63 total`
             (solo `declara las dos recetas y el orden del labio`)
    S4.2  el punto 13 entero, movido detras de `## Animación (decisiones por defecto)`
          -> `Tests:       1 failed, 62 passed, 63 total` (el mismo it)

== CIERRE ==

Desde mobile-pet-tracker/ (el `cd` literal de BASE otra vez), sin pipe,
con salida al impl:
- El comando BASE, con la salida a /tmp/166-final.txt
    -> exit=0, `Test Suites: 14 passed, 14 total` y `Tests:       710 passed, 710 total`
       (700 + 10; reparto: global-css 53, consistency 63, el resto
       sin cambios)
- `pgrep -af '[i]nit\.sh'` vacio; despues el comando ALL con la salida a
  /tmp/166-all.txt -> exit=0 y `Tests:       2775 passed, 2775 total`.
  Copia las lineas `Test Suites:` y `Tests:`. Mientras corre, no lances
  otra cosa.
- `bun run typecheck; echo "exit=$?"` -> exit=0 y
  `bunx expo lint --no-cache; echo "exit=$?"` -> exit=0.
- CA-4 y CA-5 (tasks.md Cierre (3)):
  `git diff --quiet <H0> -- package.json bun.lock src/i18n/catalog.ts src/__tests__/ui-copy-table.ts; echo "exit=$?"`   -> exit=0
- CA-2 (tasks.md Cierre (4)):
  `git diff <H0> -- src | grep -cE '^\+.*(shadow-|elevation|boxShadow)'`   -> 0
Desde la raiz del repo (`cd /home/claude/sites/Pet-Tracker-wt-166 && pwd`):
- Las anclas A1-A8 (desde mobile-pet-tracker/) y H1-H24 con sus valores
  de cierre, y P1-P9 (define PROD tambien aqui).
- `git diff --stat <H0> -- backend-pet-tracker/ infra-pet-tracker/`   -> vacio
- `git diff --name-only <H0> HEAD -- docs/`   -> exactamente docs/ui-guidelines.md
- `git diff --name-only <H0> HEAD -- mobile-pet-tracker/ | LC_ALL=C sort`
  -> exactamente los 28 de mobile-pet-tracker/ de la lista de abajo

Despues rellena specs/mobile-chunky-cta/traceability.md, solo la columna
«Commit (hash + mensaje)»: hash corto + mensaje del rojo y del verde,
`rojo → verde`, para R1-R4. La fila R5 se queda `pendiente`. No toques
su frontmatter, ni la columna de tests, ni el resto del fichero. Termina
el impl con la linea `R5: pendiente del smoke humano`. c9, desde la raiz:
  git add specs/mobile-chunky-cta/traceability.md progress/impl_mobile-chunky-cta.md \
    && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'progress/impl_mobile-chunky-cta.md specs/mobile-chunky-cta/traceability.md ' \
    && git commit -m 'docs(mobile-chunky-cta): #166 traceability'
Despues, la lista cerrada, con salida al impl:
  git diff --name-only <H0> HEAD -- . ':!feature_list.json' ':!progress/current.md' ':!progress/handoff_mobile-chunky-cta.md' ':!specs/mobile-chunky-cta/requirements.md' ':!specs/mobile-chunky-cta/design.md' ':!specs/mobile-chunky-cta/tasks.md' ':!progress/review_mobile-chunky-cta.md'
    -> exactamente los 31 ficheros de abajo
y c10, desde la raiz:
  git commit --only progress/impl_mobile-chunky-cta.md -m 'docs(mobile-chunky-cta): #166 closed file list'
No rebasees despues de escribir hashes.

== REGLAS CRITICAS ==

- UI movil: docs/ui-guidelines.md manda (carta). Cero hex fuera de
  src/theme/, cero `StyleSheet.create`, cero clases entre corchetes, cero
  `style`, cero sombra (`shadow-*`, `elevation`, `boxShadow`): el labio es
  un BORDE (design.md D1). Las clases son literales completos, nunca
  compuestas. El labio del primario va DETRAS de `bg-accent`, nunca
  delante (design.md D2). Ni Card nueva, ni movimiento, ni copy.
- Skills: carga `building-native-ui` (tu plugin expo) y, de .agents/skills/
  del repo, `appllama-app-design-skill` (OBLIGATORIA: cambias diecisiete
  pantallas y un componente; ver docs/ui-guidelines.md §Skills y sus tres
  limites) y `emil-design-eng`. Las decisiones de la spec mandan sobre
  cualquier skill. Descartado: animacion de cualquier tipo (Reanimated,
  `entering`, `MOTION_*`, LayoutAnimation, Lottie, Rive),
  `expo-linear-gradient`, `expo-symbols`, sombras, hex fuera de
  src/theme/, `StyleSheet.create` o clases arbitrarias. Di en el impl
  cuales cargaste.
- Convenciones: docs/conventions.md, en particular §Tests y §Esperas. Los
  it de welcome arrancan con `await renderWelcome();` (H21), como el it
  que se borra; se lee el nodo con `screen.getByTestId(...)` despues del
  await, nunca se espera a un mock.
- Valores esperados LITERALES en los tests (las recetas, los hex, los
  testIDs, las rutas), nunca el simbolo importado de produccion. Las
  ausencias con `expect(x).not.toContain(...)` o `not.toMatch(re)`, nunca
  `expect(re.test(x)).toBe(false)`.
- Imports en los tests: NOMBRADOS, nunca `import * as` (eslint
  `import/namespace` es error y tumbaria la cadena). Reutiliza lo que ya
  hay en cada fichero (en consistency-classnames: `sourceFiles`,
  `filesMatching`, `readSource`, `openingTagWithTestId`, `join`,
  `readFileSync`, H9; en global-css: `parseVariables` y `extractVariant`,
  H5): no los dupliques. Todo lo nuevo va AL FINAL de cada fichero.
- design-drift recorre tambien los tests co-locados (welcome, forgot,
  docs...): todo `#166` que escribas en src/screens/**/index.test.tsx va
  seguido de ` R<n>` (un `#166` suelto lo caza el guard de hex). Bajo
  __tests__/ (consistency-classnames, global-css) no aplica: el literal
  `(feature #166, 2026-10-11)` de R4 vive alli.
- docs/ui-guidelines.md: solo el bloque D5, byte a byte, en su sitio. Nada
  mas de la carta.
- Ni `bun add`, ni cambios en package.json, bun.lock ni app.json. Todo
  con bun/bunx, nunca npm/npx. Nada de prettier (mobile no lo usa).
- NO lances ./init.sh ni toques Postgres ni LocalStack: los comparten
  otras sesiones y el gate lo corre el leader.
- No toques ningun fichero fuera de la lista de abajo (las sondas,
  revertidas, no cuentan). En particular, NO: src/i18n/catalog.ts,
  src/__tests__/ui-copy-table.ts, src/theme/motion.ts, ningun otro test,
  assets/, app.json.
- NO son tuyos, no los toques: progress/history.md, progress/current.md,
  STATUS.md, feature_list.json, el frontmatter de los ficheros de la
  spec, tasks.md, design.md y las casillas de §Aprobacion de
  requirements.md (incluida la de la prueba de humo R5). Los escribe el
  leader o el humano. Todo lo que tengas que contar va en
  progress/impl_mobile-chunky-cta.md.
- Si el sandbox te deniega un comando, PARA y reportalo. No lo sustituyas
  por otro que haga lo mismo con otra herramienta.
- NO hagas push ni abras la PR: lo hace el leader al cerrar.

Ficheros que TU cambias (31, ni uno mas):
  docs/ui-guidelines.md
  mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts
  mobile-pet-tracker/src/app/(auth)/__tests__/login.test.tsx
  mobile-pet-tracker/src/app/(auth)/__tests__/register.test.tsx
  mobile-pet-tracker/src/app/(auth)/login.tsx
  mobile-pet-tracker/src/app/(auth)/register.tsx
  mobile-pet-tracker/src/components/__tests__/empty-state.test.tsx
  mobile-pet-tracker/src/components/empty-state.tsx
  mobile-pet-tracker/src/screens/add-pet/index.tsx
  mobile-pet-tracker/src/screens/add-reminder/index.tsx
  mobile-pet-tracker/src/screens/docs/index.tsx
  mobile-pet-tracker/src/screens/forgot/index.test.tsx
  mobile-pet-tracker/src/screens/forgot/index.tsx
  mobile-pet-tracker/src/screens/geofence-editor/index.test.tsx
  mobile-pet-tracker/src/screens/geofence-editor/index.tsx
  mobile-pet-tracker/src/screens/geofences/index.test.tsx
  mobile-pet-tracker/src/screens/geofences/index.tsx
  mobile-pet-tracker/src/screens/home/index.tsx
  mobile-pet-tracker/src/screens/meal-schedule/index.tsx
  mobile-pet-tracker/src/screens/pairing/index.tsx
  mobile-pet-tracker/src/screens/profile/index.tsx
  mobile-pet-tracker/src/screens/reminders/index.tsx
  mobile-pet-tracker/src/screens/reset-password/index.test.tsx
  mobile-pet-tracker/src/screens/reset-password/index.tsx
  mobile-pet-tracker/src/screens/weight-log/index.tsx
  mobile-pet-tracker/src/screens/welcome/index.test.tsx
  mobile-pet-tracker/src/screens/welcome/index.tsx
  mobile-pet-tracker/src/theme/__tests__/global-css.test.ts
  mobile-pet-tracker/src/theme/global.css
  progress/impl_mobile-chunky-cta.md
  specs/mobile-chunky-cta/traceability.md
Si el leader commitea en mitad (una correccion), solo tocara ficheros
excluidos por los pathspecs de la lista cerrada; cualquier otro fichero
ajeno en `git diff --name-only <H0> HEAD` es motivo de parada.

Criterios de aceptacion: R1-R4 de requirements.md y CA-1 a CA-5. La
prueba de humo de R5 (dev build de Android) es del humano: no la marques.
Deja en el impl sus pasos (requirements.md R5.1), listos para el humano.

Al terminar, progress/impl_mobile-chunky-cta.md debe tener: pwd, branch,
H0 y status; el exit de is-ancestor; node_modules (presente o instalado);
skills cargadas; la salida de las 32 anclas (A1-A8, H1-H24) en H0 y la de
cierre, mas P1-P9; la base con su exit (comando BASE) y el ALL de la
base; los 8 commits de T1-T4 con hash y R-id; por cada rojo, el comando,
la linea `Tests:`, el exit y cada it rojo con su matcher y
Expected/Received; cada verde con sus lineas `Tests:`, GUARDAS, typecheck
y lint; las sondas S1.1-S1.2, S2.1-S2.4, S3.1-S3.5 y S4.1-S4.2 con su
linea `Tests:` roja, sus `●` y su `limpio=0`; el cierre (BASE con
710, ALL con exit y total, typecheck, lint, CA-2, CA-4/CA-5, diffs
vacios, lista cerrada); los pasos de la prueba de humo R5; la linea
`R5: pendiente del smoke humano`; y cualquier decision que la spec no
cerrara literalmente.
```

## Reanudacion 1 (leader, 2026-10-11): c3 paro por los `  ● Console`

Causa: el segundo eslabon de c3 contaba `grep -cE '^  ● '` = 10 y el log
da 17: los 10 it rojos esperados mas 7 bloques `  ● Console` de Jest. No
era un fallo de Codex ni del arbol. Corregido en este handoff: los cuatro
contadores (r1-r4) son ahora
`grep -E '^  ● ' <log> | grep -cvxF '  ● Console'`. Medido por el leader
sobre el arbol de la parada (HEAD d03bc813 + los 8 tests de c3 sin
stagear): contador nuevo = 10 en /tmp/166-r2.txt (y 2 en
/tmp/166-r1.txt), el resto de eslabones de solo lectura pasan
(0, 6, 2, 0, 1), `bun run typecheck` y `bunx expo lint --no-cache` exit 0.

Para reanudar: NO reviertes los 8 ficheros de test de c3 ni tocas nada
mas. Desde `cd /home/claude/sites/Pet-Tracker-wt-166/mobile-pet-tracker`
vuelves a correr el comando de medida de c3 (sobrescribe
/tmp/166-r2.txt) y despues la cadena de c3 tal como esta ahora en este
fichero, entera, hasta su `git commit`. Luego sigues con S2.1-S2.4 y c4
en adelante sin cambios. Anota en el impl una seccion `Reanudacion 1`
con la linea `Tests:` y el resultado de la cadena.


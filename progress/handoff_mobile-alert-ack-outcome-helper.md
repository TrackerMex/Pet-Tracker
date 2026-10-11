# Handoff a Codex CLI — #134 mobile-alert-ack-outcome-helper

> Pegar el bloque de abajo en Codex CLI. La spec está firmada (commit de firma
> `851d8685`, aprobación vía Notion el 2026-10-09, Q1–Q5 con su
> recomendación). Es un refactor sin cambio de conducta: el `switch` sobre el
> resultado de `ackAlert` sale de las dos pantallas de alertas a un helper
> nuevo, `src/utils/alert-ack-outcome.ts`. Son 15 commits: R1–R7 en pares
> rojo/verde (los rojos de R1, R2 y R7 llevan una mutación de producción que
> su verde revierte) y uno final de trazabilidad. No hay prueba de humo.
>
> `node_modules` ya está instalado en `Pet-Tracker-wt-134/mobile-pet-tracker`.
> La branch sale de `origin/main` `fb1e562d`. El leader midió la base y
> ejecutó todas las anclas de este fichero en H0.

---

```
Worktree: /home/claude/sites/Pet-Tracker-wt-134   <- PRIMERA LINEA. Trabaja AQUI y en ningun otro sitio
Antes de tocar nada, ejecuta `pwd`, `git branch --show-current`,
`git rev-parse --short HEAD` y `git status --short` y pega las cuatro
salidas al principio de progress/impl_mobile-alert-ack-outcome-helper.md.
El hash es H0 (el commit que anade este handoff), y es tambien el «H0» de
tasks.md. En todos los comandos de abajo, sustituye `<H0>` por ese hash
literal: todos los `git diff` se miden contra el. PARA si la branch no es
feature/134-mobile-alert-ack-outcome-helper o si `git status --short` no
sale vacio. No toques /home/claude/sites/Pet-Tracker ni ningun otro
worktree (Pet-Tracker-wt-158, Pet-Tracker-wt-159, Pet-Tracker-wt-backend,
Pet-Tracker-wt-ui...), ni cambies de branch en ninguno.

Feature: mobile-alert-ack-outcome-helper (#134)
Branch: feature/134-mobile-alert-ack-outcome-helper
Spec aprobada: specs/mobile-alert-ack-outcome-helper/requirements.md
(status: approved, firma 851d8685). Q1-Q5 de requirements.md estan
cerradas con su recomendacion (ver §Aprobacion): no reabras ninguna.
Lee enteros requirements.md, design.md, tasks.md y traceability.md de
specs/mobile-alert-ack-outcome-helper/. tasks.md es tu guion (R1-R7 y
Cierre). Los titulos de describe e it son LITERALES de tasks.md:
copialos tal cual, con sus tildes.

== QUE HACES ==

Los 15 commits, en este orden exacto: R1, R2, R3, R4, R5, R6, R7 (rojo y
verde cada uno, con los mensajes de tasks.md) y el commit final de
trazabilidad. Rojo SIEMPRE antes de su verde, en commits separados. Si
escribes un verde antes que su rojo, ese requisito nace verde y pierde su
historial (C4 de CHECKPOINTS.md); en #19 se metio todo en un solo commit
y no vale.

Esto manda sobre tasks.md:
- Trazabilidad: traceability.md se rellena entera UNA vez, al final, en
  el commit de trazabilidad del Cierre. Ningun commit de R1-R7 la toca.
- Ruta de language-provider: tasks.md §Cierre dice
  `src/__tests__/language-provider.test.tsx`, que NO existe (un
  `git diff --quiet` sobre una ruta inexistente da exit 0 y no mide
  nada). La ruta real es
  `src/providers/__tests__/language-provider.test.tsx`; usa la del Cierre
  de abajo.
- No hay commits `refactor(...)` aparte de los que tasks.md nombra (el
  verde de R6 se llama `refactor(...)`: es el verde, no un tercer commit).
- Mide con `FORCE_COLOR=0` delante de `bunx jest` y con la salida a un
  fichero, como en las cadenas de abajo.
- NO lances ./init.sh: lo corre el leader (comparte Postgres y LocalStack
  con otras sesiones). En su lugar va la suite entera de jest del Cierre.

== BASE ==

Primero, literal:
  cd /home/claude/sites/Pet-Tracker-wt-134/mobile-pet-tracker && pwd
    -> /home/claude/sites/Pet-Tracker-wt-134/mobile-pet-tracker
Todo lo de BASE, ANCLAS y COMMITS se ejecuta desde ahi. El Cierre te dice
cuando volver a la raiz.

Error de invocacion != rojo. Si un comando falla ANTES de que arranque
jest, tsc o eslint, sin haber tocado ningun fichero (ERR_PNPM_*,
`No such file or directory`, `command not found`, cwd equivocado, ruta
mal tecleada), NO es «algo nace rojo»: corrige la invocacion, repitela y
anotalo en el impl. Solo PARAS si falla el codigo, una cuenta o un
eslabon de una cadena bien invocada. (En #162 Codex paro una ronda
entera por lanzar pnpm desde la raiz.)

Al arrancar, desde la raiz o desde aqui da igual:
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

Base medida por el leader el 2026-10-09 en este worktree con el arbol de
H0, una suite por llamada, FORCE_COLOR=0, sin pipe, todas exit=0:
  src/screens/alerts/index.test.tsx               39
  src/screens/alert-detail/index.test.tsx         25
  src/__tests__/design-drift.test.ts              62
  src/__tests__/ui-language.test.ts               30
  src/__tests__/consistency-classnames.test.ts    55
  src/__tests__/legibility-classnames.test.ts     27
  src/utils/alert-ack-outcome.test.ts             no existe
Suite entera (`FORCE_COLOR=0 bunx jest`): exit=0, `Test Suites: 97 passed, 97 total` y `Tests:       2365 passed, 2365 total`
Tu medida manda: repite cada fila (es el paso 2 del Arranque de tasks.md)
y anota sus lineas `Tests:` en el impl. Si alguna difiere o nace roja,
anota y PARA.

Comando GUARDAS (los candados de copy y de carta; lo corre cada cadena):
  FORCE_COLOR=0 bunx jest src/__tests__/ui-language.test.ts src/__tests__/design-drift.test.ts src/__tests__/consistency-classnames.test.ts src/__tests__/legibility-classnames.test.ts
En las cadenas aparece como `<GUARDAS> > /tmp/134-xx-guardas.txt 2>&1`.
Su total: 30 + 62 + 55 + 27 = 174 de R1 a R5 (las mutaciones de R1 y R2
estan disenadas para no moverlo), 176 tras R6 (design-drift 64) y 177
tras R7 (design-drift 65).

== ANCLAS ==

Ejecutalas TODAS desde mobile-pet-tracker/ antes de tocar nada y copia la
salida al impl. Son las de tasks.md §Anclas (A1-A17, H1-H8, T1-T7, L1-L6,
D1-D7) y X1-X6 de este handoff. Solo estos comandos son anclas; los
numeros de linea no lo son. Si alguna no da EXACTAMENTE lo esperado,
PARA y avisa (ante una diferencia manda el fichero, no el handoff). Cuando
`grep -c` cuenta 0 sale con codigo 1: lo que vale es la cifra impresa.
H2-H8 no se ejecutan en H0 (el helper no existe): solo al cerrar. El
leader las ha ejecutado todas en H0 sacandolas de este mismo fichero.

Formato: `comando   -> en H0 | al cerrar`.

A1. grep -cF "case '" src/screens/alerts/index.tsx   -> 7 | 0
A2. grep -cF "case '" src/screens/alert-detail/index.tsx   -> 7 | 0
A3. grep -cF 'signOut(' src/screens/alerts/index.tsx   -> 1 | 0
A4. grep -cF 'signOut(' src/screens/alert-detail/index.tsx   -> 1 | 0
A5. grep -cF 'await signOut()' src/screens/alerts/index.tsx   -> 1 | 0
A6. grep -cF 'await signOut()' src/screens/alert-detail/index.tsx   -> 1 | 0
A7. grep -cF 'settleAlertAck(' src/screens/alerts/index.tsx   -> 0 | 1
A8. grep -cF 'settleAlertAck(' src/screens/alert-detail/index.tsx   -> 0 | 1
A9. grep -cF 'ackAlert(baseUrl' src/screens/alerts/index.tsx   -> 1 | 1
A10. grep -cF 'ackAlert(baseUrl' src/screens/alert-detail/index.tsx   -> 1 | 1
A11. grep -cF "t('common.cannotReachServer')" src/screens/alerts/index.tsx   -> 1 | 0
A12. grep -cF "t('common.cannotReachServer')" src/screens/alert-detail/index.tsx   -> 1 | 0
A13. grep -cF "t('common.somethingWentWrong')" src/screens/alerts/index.tsx   -> 5 | 3
A14. grep -cF "t('common.somethingWentWrong')" src/screens/alert-detail/index.tsx   -> 3 | 1
A15. grep -cF '} catch {' src/screens/alerts/index.tsx   -> 1 | 0
A16. grep -cE 'alertKeys|invalidateQueries|setQueryData|useQueryClient|queryClient' src/screens/alerts/index.tsx   -> 0 | 0
A17. grep -cE 'alertKeys|invalidateQueries|setQueryData|useQueryClient|queryClient' src/screens/alert-detail/index.tsx   -> 0 | 0
H1. test -e src/utils/alert-ack-outcome.ts && test -e src/utils/alert-ack-outcome.test.ts; echo "exit=$?"   -> exit=1 | exit=0
H2. grep -cF 'export async function settleAlertAck(' src/utils/alert-ack-outcome.ts   -> - | 1
H3. grep -cF 'export type AlertAckHandlers' src/utils/alert-ack-outcome.ts   -> - | 1
H4. grep -cF "case '" src/utils/alert-ack-outcome.ts   -> - | 7
H5. grep -cF 'signOut(' src/utils/alert-ack-outcome.ts   -> - | 1
H6. grep -cF "t('common.cannotReachServer')" src/utils/alert-ack-outcome.ts   -> - | 1
H7. grep -cF "t('common.somethingWentWrong')" src/utils/alert-ack-outcome.ts   -> - | 2
H8. grep -cE 'alertKeys|invalidateQueries|setQueryData|useQueryClient|queryClient' src/utils/alert-ack-outcome.ts   -> - | 0
T1. grep -cF "{ file: 'src/screens/alerts/index.tsx', key: 'common.somethingWentWrong' }" src/__tests__/ui-copy-table.ts   -> 5 | 3
T2. grep -cF "{ file: 'src/screens/alerts/index.tsx', key: 'common.cannotReachServer' }" src/__tests__/ui-copy-table.ts   -> 1 | 0
T3. grep -cF "{ file: 'src/screens/alert-detail/index.tsx', key: 'common.somethingWentWrong' }" src/__tests__/ui-copy-table.ts   -> 3 | 1
T4. grep -cF "{ file: 'src/screens/alert-detail/index.tsx', key: 'common.cannotReachServer' }" src/__tests__/ui-copy-table.ts   -> 1 | 0
T5. grep -cF "{ file: 'src/utils/alert-ack-outcome.ts', key: 'common.cannotReachServer' }" src/__tests__/ui-copy-table.ts   -> 0 | 1
T6. grep -cF "{ file: 'src/utils/alert-ack-outcome.ts', key: 'common.somethingWentWrong' }" src/__tests__/ui-copy-table.ts   -> 0 | 2
T7. grep -cF "{ file: 'src/utils/alert-meta.ts', key: 'alerts.typeUnknown' }," src/__tests__/ui-copy-table.ts   -> 1 | 1
L1. grep -cF 'expect(R13_ALERT_DETAIL).toHaveLength(11);' src/__tests__/ui-language.test.ts   -> 1 | 0
L2. grep -cF 'expect(R13_ALERT_DETAIL).toHaveLength(11 - 3);' src/__tests__/ui-language.test.ts   -> 0 | 1
L3. grep -cF "file === 'src/utils/alert-ack-outcome.ts'" src/__tests__/ui-language.test.ts   -> 0 | 1
L4. grep -cF '+ 1, // #118 R1' src/__tests__/ui-language.test.ts   -> 1 | 0
L5. grep -cF '+ 1, // #134 R6' src/__tests__/ui-language.test.ts   -> 0 | 1
L6. grep -cF '#134 R6' src/__tests__/ui-language.test.ts   -> 0 | 3
D1. grep -cF "'screens/alerts/index.tsx': 1," src/__tests__/design-drift.test.ts   -> 1 | 0
D2. grep -cF "'screens/alerts/index.tsx': 0," src/__tests__/design-drift.test.ts   -> 0 | 1
D3. grep -cF "'screens/alert-detail/index.tsx': 1," src/__tests__/design-drift.test.ts   -> 1 | 0
D4. grep -cF "'screens/alert-detail/index.tsx': 0," src/__tests__/design-drift.test.ts   -> 0 | 1
D5. grep -cF "'utils/alert-ack-outcome.ts': 1," src/__tests__/design-drift.test.ts   -> 0 | 1
D6. grep -cF "describe('#134 R6" src/__tests__/design-drift.test.ts   -> 0 | 1
D7. grep -cF "describe('#134 R7" src/__tests__/design-drift.test.ts   -> 0 | 1
X1. grep -cF -- '- [x] Aprobado por humano (fecha: 2026-10-09)' ../specs/mobile-alert-ack-outcome-helper/requirements.md   -> 1 | 1
X2. grep -cF "describe('#78 R8: el ack cambia la fila sin recargar la lista'" src/screens/alerts/index.test.tsx   -> 1 | 1
X3. grep -cF 'async function pressAck()' src/screens/alerts/index.test.tsx   -> 1 | 1
X4. grep -cF "describe('#100 R5: el detalle marca leída la alerta'" src/screens/alert-detail/index.test.tsx   -> 1 | 1
X5. grep -cF 'mockRejectedValue(' src/screens/alerts/index.test.tsx src/screens/alert-detail/index.test.tsx   -> alerts:0 y alert-detail:1 | alerts:0 y alert-detail:1
X6. grep -rlF '#134' src | wc -l   -> 0 | 6 o mas

(X5 es el candado de fugas: con `(` solo casa la forma sin `Once`, que
esta prohibida en lo que escribas. El 1 del detalle es preexistente
(`if (kind === 'rejected') mockAckAlert.mockRejectedValue(...)`, que el
`mockReset` del beforeEach de nivel superior limpia): no lo toques ni lo
copies. X6 al cerrar cuenta como minimo los dos tests de
pantalla, el test del helper, design-drift, ui-copy-table y ui-language;
si el helper o las pantallas llevan un comentario `#134 R<n>`, sube.
Anota el valor real.)

== COMMITS ==

Todo desde mobile-pet-tracker/. Cada commit va ENCADENADO con && a su
verificacion: si cualquier eslabon falla, el commit no se hace. Nunca
commitees fuera de estas cadenas ni con un exit distinto de 0 en la
cadena (en #115 se commiteo un verde con el registrador en exit=1). Si
una cadena no llega al commit, PARA y reporta en el impl el eslabon que
fallo y la salida.

Mide SIN pipe (`cmd | tail` devuelve el exit de tail). FORCE_COLOR=0 deja
la linea de resumen de jest en texto plano. Formato:
`Tests:       2 failed, 39 passed, 41 total` y en verde
`Tests:       41 passed, 41 total`. Cada medida lleva su
`echo "exit=$?"`; anota el exit en el impl.

Rojos: TODOS por ASERCION (Expected/Received, o el matcher error
«received value must be a host instance» de RNTL cuando
`queryByTestId(...)` devuelve null). Nunca por TypeError,
ReferenceError, SyntaxError, `Cannot find module` ni por consulta
(`Unable to find an element`): por eso las esperas de R1/R2 usan
`queryByTestId` dentro del `expect`. La cadena comprueba la cuenta; tu
ademas abres el log y copias al impl cada it rojo con su matcher y su
Expected/Received.

Typecheck y lint van en todas las cadenas, rojos incluidos (exit 0): en
#134 ningun rojo es de tipos.

-- R1: caracterizacion del centro (C1, C2) --

R1 rojo (tasks.md R1 (1): el describe anidado al final de `#78 R8` con
C1 y C2, y las mutaciones M1 y M2 en src/screens/alerts/index.tsx):
  FORCE_COLOR=0 bunx jest src/screens/alerts/index.test.tsx > /tmp/134-r1.txt 2>&1; echo "exit=$?"
    -> exit=1 y `Tests:       2 failed, 39 passed, 41 total`
       (C1: recibe `ALGO SALIÓ MAL`; C2: «value must be a host instance»)
  <GUARDAS> > /tmp/134-r1-guardas.txt 2>&1; echo "exit=$?"
    -> exit=0 y `Tests:       174 passed, 174 total`
  grep -qE '^Tests: +2 failed, 39 passed, 41 total$' /tmp/134-r1.txt \
    && grep -qE '^Tests: +174 passed, 174 total$' /tmp/134-r1-guardas.txt \
    && grep -qF 'ALGO SALIÓ MAL' /tmp/134-r1.txt \
    && grep -qF 'value must be a host instance' /tmp/134-r1.txt \
    && ! grep -qE 'TypeError|ReferenceError|SyntaxError|Cannot find module|Unable to find an element' /tmp/134-r1.txt \
    && test "$(grep -cF "t('common.somethingWentWrong')" src/screens/alerts/index.tsx)" = 5 \
    && test "$(grep -cF 'signOut(' src/screens/alerts/index.tsx)" = 1 \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bun run lint \
    && git add src/screens/alerts/index.test.tsx src/screens/alerts/index.tsx \
    && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/screens/alerts/index.test.tsx mobile-pet-tracker/src/screens/alerts/index.tsx ' \
    && git commit -m 'test(mobile-alert-ack-outcome-helper): characterize centro ack branches (R1)'

R1 verde (revierte M1 y M2; la pantalla vuelve a ser la de H0):
  FORCE_COLOR=0 bunx jest src/screens/alerts/index.test.tsx > /tmp/134-g1.txt 2>&1; echo "exit=$?"
    -> exit=0 y `Tests:       41 passed, 41 total`
  <GUARDAS> > /tmp/134-g1-guardas.txt 2>&1; echo "exit=$?"
    -> exit=0 y 174
  grep -qE '^Tests: +41 passed, 41 total$' /tmp/134-g1.txt \
    && grep -qE '^Tests: +174 passed, 174 total$' /tmp/134-g1-guardas.txt \
    && git diff --quiet <H0> -- src/screens/alerts/index.tsx \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bun run lint \
    && git add src/screens/alerts/index.tsx \
    && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/screens/alerts/index.tsx ' \
    && git commit -m 'fix(mobile-alert-ack-outcome-helper): revert R1 characterization mutations (R1)'

-- R2: caracterizacion del detalle (D1) --

R2 rojo (tasks.md R2 (1): el describe anidado al final de `#100 R5` con
D1, y la mutacion M3 en src/screens/alert-detail/index.tsx):
  FORCE_COLOR=0 bunx jest src/screens/alert-detail/index.test.tsx > /tmp/134-r2.txt 2>&1; echo "exit=$?"
    -> exit=1 y `Tests:       1 failed, 25 passed, 26 total`
  <GUARDAS> > /tmp/134-r2-guardas.txt 2>&1; echo "exit=$?"
    -> exit=0 y 174
  grep -qE '^Tests: +1 failed, 25 passed, 26 total$' /tmp/134-r2.txt \
    && grep -qE '^Tests: +174 passed, 174 total$' /tmp/134-r2-guardas.txt \
    && grep -qF 'value must be a host instance' /tmp/134-r2.txt \
    && ! grep -qE 'TypeError|ReferenceError|SyntaxError|Cannot find module|Unable to find an element' /tmp/134-r2.txt \
    && test "$(grep -cF 'signOut(' src/screens/alert-detail/index.tsx)" = 1 \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bun run lint \
    && git add src/screens/alert-detail/index.test.tsx src/screens/alert-detail/index.tsx \
    && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/screens/alert-detail/index.test.tsx mobile-pet-tracker/src/screens/alert-detail/index.tsx ' \
    && git commit -m 'test(mobile-alert-ack-outcome-helper): characterize detail sign-out failure (R2)'

R2 verde (revierte M3):
  FORCE_COLOR=0 bunx jest src/screens/alert-detail/index.test.tsx > /tmp/134-g2.txt 2>&1; echo "exit=$?"
    -> exit=0 y `Tests:       26 passed, 26 total`
  <GUARDAS> > /tmp/134-g2-guardas.txt 2>&1; echo "exit=$?"
    -> exit=0 y 174
  grep -qE '^Tests: +26 passed, 26 total$' /tmp/134-g2.txt \
    && grep -qE '^Tests: +174 passed, 174 total$' /tmp/134-g2-guardas.txt \
    && git diff --quiet <H0> -- src/screens/alert-detail/index.tsx \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bun run lint \
    && git add src/screens/alert-detail/index.tsx \
    && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/screens/alert-detail/index.tsx ' \
    && git commit -m 'fix(mobile-alert-ack-outcome-helper): revert R2 characterization mutation (R2)'

-- R3: helper, ramas delegadas --

R3 rojo (tasks.md R3 (1): el helper ESQUELETO con la firma final de
design.md §2 y cuerpo `await request();`, y el test nuevo con el montaje
comun y los 3 its de `#134 R3`):
  FORCE_COLOR=0 bunx jest src/utils/alert-ack-outcome.test.ts > /tmp/134-r3.txt 2>&1; echo "exit=$?"
    -> exit=1 y `Tests:       3 failed, 3 total`
  <GUARDAS> > /tmp/134-r3-guardas.txt 2>&1; echo "exit=$?"
    -> exit=0 y 174
  grep -qE '^Tests: +3 failed, 3 total$' /tmp/134-r3.txt \
    && grep -qE '^Tests: +174 passed, 174 total$' /tmp/134-r3-guardas.txt \
    && ! grep -qE 'TypeError|ReferenceError|SyntaxError|Cannot find module|Unable to find an element' /tmp/134-r3.txt \
    && test "$(grep -cF 'export async function settleAlertAck(' src/utils/alert-ack-outcome.ts)" = 1 \
    && test "$(grep -cF 'export type AlertAckHandlers' src/utils/alert-ack-outcome.ts)" = 1 \
    && test "$(grep -cF "case '" src/utils/alert-ack-outcome.ts)" = 0 \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bun run lint \
    && git add src/utils/alert-ack-outcome.ts src/utils/alert-ack-outcome.test.ts \
    && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/utils/alert-ack-outcome.test.ts mobile-pet-tracker/src/utils/alert-ack-outcome.ts ' \
    && git commit -m 'test(mobile-alert-ack-outcome-helper): helper delegated outcomes (R3)'

R3 verde (el `switch` con los tres `case` delegados):
  FORCE_COLOR=0 bunx jest src/utils/alert-ack-outcome.test.ts > /tmp/134-g3.txt 2>&1; echo "exit=$?"
    -> exit=0 y `Tests:       3 passed, 3 total`
  <GUARDAS> > /tmp/134-g3-guardas.txt 2>&1; echo "exit=$?"
    -> exit=0 y 174
  grep -qE '^Tests: +3 passed, 3 total$' /tmp/134-g3.txt \
    && grep -qE '^Tests: +174 passed, 174 total$' /tmp/134-g3-guardas.txt \
    && test "$(grep -cF "case '" src/utils/alert-ack-outcome.ts)" = 3 \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bun run lint \
    && git add src/utils/alert-ack-outcome.ts \
    && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/utils/alert-ack-outcome.ts ' \
    && git commit -m 'feat(mobile-alert-ack-outcome-helper): delegate ok, already-closed and not-found (R3)'

-- R4: helper, ramas comunes en en y es --

R4 rojo (los 7 its de `#134 R4`; solo el test):
  FORCE_COLOR=0 bunx jest src/utils/alert-ack-outcome.test.ts > /tmp/134-r4.txt 2>&1; echo "exit=$?"
    -> exit=1 y `Tests:       7 failed, 3 passed, 10 total`
  <GUARDAS> > /tmp/134-r4-guardas.txt 2>&1; echo "exit=$?"
    -> exit=0 y 174
  grep -qE '^Tests: +7 failed, 3 passed, 10 total$' /tmp/134-r4.txt \
    && grep -qE '^Tests: +174 passed, 174 total$' /tmp/134-r4-guardas.txt \
    && ! grep -qE 'TypeError|ReferenceError|SyntaxError|Cannot find module|Unable to find an element' /tmp/134-r4.txt \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bun run lint \
    && git add src/utils/alert-ack-outcome.test.ts \
    && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/utils/alert-ack-outcome.test.ts ' \
    && git commit -m 'test(mobile-alert-ack-outcome-helper): helper common outcomes (R4)'

R4 verde (`case 'unreachable'`, `case 'unauthorized'` con `await signOut()`
y el `case` doble `'error'`/`'missing-config'`):
  FORCE_COLOR=0 bunx jest src/utils/alert-ack-outcome.test.ts > /tmp/134-g4.txt 2>&1; echo "exit=$?"
    -> exit=0 y `Tests:       10 passed, 10 total`
  <GUARDAS> > /tmp/134-g4-guardas.txt 2>&1; echo "exit=$?"
    -> exit=0 y 174
  grep -qE '^Tests: +10 passed, 10 total$' /tmp/134-g4.txt \
    && grep -qE '^Tests: +174 passed, 174 total$' /tmp/134-g4-guardas.txt \
    && test "$(grep -cF "case '" src/utils/alert-ack-outcome.ts)" = 7 \
    && test "$(grep -cF 'signOut(' src/utils/alert-ack-outcome.ts)" = 1 \
    && test "$(grep -cF "t('common.cannotReachServer')" src/utils/alert-ack-outcome.ts)" = 1 \
    && test "$(grep -cF "t('common.somethingWentWrong')" src/utils/alert-ack-outcome.ts)" = 1 \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bun run lint \
    && git add src/utils/alert-ack-outcome.ts \
    && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/utils/alert-ack-outcome.ts ' \
    && git commit -m 'feat(mobile-alert-ack-outcome-helper): resolve common ack outcomes (R4)'

-- R5: helper, excepciones --

R5 rojo (los 5 its de `#134 R5`; solo el test):
  FORCE_COLOR=0 bunx jest src/utils/alert-ack-outcome.test.ts > /tmp/134-r5.txt 2>&1; echo "exit=$?"
    -> exit=1 y `Tests:       5 failed, 10 passed, 15 total`
       (los 5 en `.resolves.toBeUndefined()`: la promesa rechaza)
  <GUARDAS> > /tmp/134-r5-guardas.txt 2>&1; echo "exit=$?"
    -> exit=0 y 174
  grep -qE '^Tests: +5 failed, 10 passed, 15 total$' /tmp/134-r5.txt \
    && grep -qE '^Tests: +174 passed, 174 total$' /tmp/134-r5-guardas.txt \
    && ! grep -qE 'TypeError|ReferenceError|SyntaxError|Cannot find module|Unable to find an element' /tmp/134-r5.txt \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bun run lint \
    && git add src/utils/alert-ack-outcome.test.ts \
    && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/utils/alert-ack-outcome.test.ts ' \
    && git commit -m 'test(mobile-alert-ack-outcome-helper): helper never rejects (R5)'

R5 verde (un `try` alrededor de `await request()` y del `switch`; `catch`
sin variable con `showError(t('common.somethingWentWrong'))`):
  FORCE_COLOR=0 bunx jest src/utils/alert-ack-outcome.test.ts > /tmp/134-g5.txt 2>&1; echo "exit=$?"
    -> exit=0 y `Tests:       15 passed, 15 total`
  <GUARDAS> > /tmp/134-g5-guardas.txt 2>&1; echo "exit=$?"
    -> exit=0 y 174
  grep -qE '^Tests: +15 passed, 15 total$' /tmp/134-g5.txt \
    && grep -qE '^Tests: +174 passed, 174 total$' /tmp/134-g5-guardas.txt \
    && test "$(grep -cF "case '" src/utils/alert-ack-outcome.ts)" = 7 \
    && test "$(grep -cF 'signOut(' src/utils/alert-ack-outcome.ts)" = 1 \
    && test "$(grep -cF "t('common.cannotReachServer')" src/utils/alert-ack-outcome.ts)" = 1 \
    && test "$(grep -cF "t('common.somethingWentWrong')" src/utils/alert-ack-outcome.ts)" = 2 \
    && test "$(grep -cE 'alertKeys|invalidateQueries|setQueryData|useQueryClient|queryClient' src/utils/alert-ack-outcome.ts)" = 0 \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bun run lint \
    && git add src/utils/alert-ack-outcome.ts \
    && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/utils/alert-ack-outcome.ts ' \
    && git commit -m 'feat(mobile-alert-ack-outcome-helper): catch every ack failure (R5)'

-- R6: un solo sitio clasifica el ack --

R6 rojo (tasks.md R6 (1): los tres ficheros de inventario, SIN tocar las
pantallas):
  FORCE_COLOR=0 bunx jest src/__tests__/design-drift.test.ts > /tmp/134-r6-dd.txt 2>&1; echo "exit=$?"
    -> exit=1 y `Tests:       3 failed, 61 passed, 64 total`
       («preserves every mutation sign-out with zero delta» y las 2 filas de #134 R6)
  FORCE_COLOR=0 bunx jest src/__tests__/ui-language.test.ts > /tmp/134-r6-ul.txt 2>&1; echo "exit=$?"
    -> exit=1 y `Tests:       3 failed, 27 passed, 30 total`
       (#78 R12 «registra cada ocurrencia de la pantalla», #100 R10
       «registra cada ocurrencia del detalle» y #65 R18 «resuelve cada
       ocurrencia de la tabla contra la clave exacta»)
  FORCE_COLOR=0 bunx jest src/__tests__/consistency-classnames.test.ts src/__tests__/legibility-classnames.test.ts > /tmp/134-r6-cl.txt 2>&1; echo "exit=$?"
    -> exit=0 y `Tests:       82 passed, 82 total`
  grep -qE '^Tests: +3 failed, 61 passed, 64 total$' /tmp/134-r6-dd.txt \
    && grep -qE '^Tests: +3 failed, 27 passed, 30 total$' /tmp/134-r6-ul.txt \
    && grep -qE '^Tests: +82 passed, 82 total$' /tmp/134-r6-cl.txt \
    && ! grep -qE 'TypeError|ReferenceError|SyntaxError|Cannot find module|Unable to find an element' /tmp/134-r6-dd.txt /tmp/134-r6-ul.txt \
    && test "$(grep -cF "'screens/alerts/index.tsx': 0," src/__tests__/design-drift.test.ts)" = 1 \
    && test "$(grep -cF "'screens/alert-detail/index.tsx': 0," src/__tests__/design-drift.test.ts)" = 1 \
    && test "$(grep -cF "'utils/alert-ack-outcome.ts': 1," src/__tests__/design-drift.test.ts)" = 1 \
    && test "$(grep -cF "describe('#134 R6" src/__tests__/design-drift.test.ts)" = 1 \
    && test "$(grep -cF "{ file: 'src/screens/alerts/index.tsx', key: 'common.somethingWentWrong' }" src/__tests__/ui-copy-table.ts)" = 3 \
    && test "$(grep -cF "{ file: 'src/screens/alerts/index.tsx', key: 'common.cannotReachServer' }" src/__tests__/ui-copy-table.ts)" = 0 \
    && test "$(grep -cF "{ file: 'src/screens/alert-detail/index.tsx', key: 'common.somethingWentWrong' }" src/__tests__/ui-copy-table.ts)" = 1 \
    && test "$(grep -cF "{ file: 'src/screens/alert-detail/index.tsx', key: 'common.cannotReachServer' }" src/__tests__/ui-copy-table.ts)" = 0 \
    && test "$(grep -cF "{ file: 'src/utils/alert-ack-outcome.ts', key: 'common.cannotReachServer' }" src/__tests__/ui-copy-table.ts)" = 1 \
    && test "$(grep -cF "{ file: 'src/utils/alert-ack-outcome.ts', key: 'common.somethingWentWrong' }" src/__tests__/ui-copy-table.ts)" = 2 \
    && test "$(grep -cF 'expect(R13_ALERT_DETAIL).toHaveLength(11 - 3);' src/__tests__/ui-language.test.ts)" = 1 \
    && test "$(grep -cF "file === 'src/utils/alert-ack-outcome.ts'" src/__tests__/ui-language.test.ts)" = 1 \
    && test "$(grep -cF '+ 1, // #134 R6' src/__tests__/ui-language.test.ts)" = 1 \
    && test "$(grep -cF '#134 R6' src/__tests__/ui-language.test.ts)" = 3 \
    && git diff --quiet <H0> -- src/screens/alerts/index.tsx src/screens/alert-detail/index.tsx \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bun run lint \
    && git add src/__tests__/design-drift.test.ts src/__tests__/ui-copy-table.ts src/__tests__/ui-language.test.ts \
    && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/__tests__/design-drift.test.ts mobile-pet-tracker/src/__tests__/ui-copy-table.ts mobile-pet-tracker/src/__tests__/ui-language.test.ts ' \
    && git commit -m 'test(mobile-alert-ack-outcome-helper): move ack inventories to the helper (R6)'

R6 verde (las dos pantallas segun design.md §3: cada `handleAck` conserva
su guard, `setActionError(null)` y `try { ... } finally { ... }`; dentro
del `try`, una sola sentencia `await settleAlertAck(...)`; el `catch` de
la pantalla desaparece):
  FORCE_COLOR=0 bunx jest src/screens/alerts/index.test.tsx src/screens/alert-detail/index.test.tsx src/utils/alert-ack-outcome.test.ts > /tmp/134-g6.txt 2>&1; echo "exit=$?"
    -> exit=0 y `Tests:       82 passed, 82 total` (41 + 26 + 15)
  <GUARDAS> > /tmp/134-g6-guardas.txt 2>&1; echo "exit=$?"
    -> exit=0 y `Tests:       176 passed, 176 total`
  grep -qE '^Tests: +82 passed, 82 total$' /tmp/134-g6.txt \
    && grep -qE '^Tests: +176 passed, 176 total$' /tmp/134-g6-guardas.txt \
    && test "$(grep -cF "case '" src/screens/alerts/index.tsx)" = 0 \
    && test "$(grep -cF "case '" src/screens/alert-detail/index.tsx)" = 0 \
    && test "$(grep -cF 'signOut(' src/screens/alerts/index.tsx)" = 0 \
    && test "$(grep -cF 'signOut(' src/screens/alert-detail/index.tsx)" = 0 \
    && test "$(grep -cF 'settleAlertAck(' src/screens/alerts/index.tsx)" = 1 \
    && test "$(grep -cF 'settleAlertAck(' src/screens/alert-detail/index.tsx)" = 1 \
    && test "$(grep -cF "t('common.somethingWentWrong')" src/screens/alerts/index.tsx)" = 3 \
    && test "$(grep -cF "t('common.somethingWentWrong')" src/screens/alert-detail/index.tsx)" = 1 \
    && test "$(grep -cF '} catch {' src/screens/alerts/index.tsx)" = 0 \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bun run lint \
    && git add src/screens/alerts/index.tsx src/screens/alert-detail/index.tsx \
    && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/screens/alert-detail/index.tsx mobile-pet-tracker/src/screens/alerts/index.tsx ' \
    && git commit -m 'refactor(mobile-alert-ack-outcome-helper): screens delegate the ack outcome (R6)'
  Si algun test EXISTENTE de las pantallas se pone rojo (design.md §8:
  una microtarea mas), PARA y reportalo: R1/R2 prohiben tocar los tests
  existentes.

-- R7: el ack no toca la cache de la lista --

R7 rojo (tasks.md R7 (1): el describe `#134 R7` al final de design-drift
y la mutacion M4, una linea de comentario `// alertKeys.list()` en el
helper):
  FORCE_COLOR=0 bunx jest src/__tests__/design-drift.test.ts > /tmp/134-r7.txt 2>&1; echo "exit=$?"
    -> exit=1 y `Tests:       1 failed, 64 passed, 65 total` (solo #134 R7)
  FORCE_COLOR=0 bunx jest src/__tests__/ui-language.test.ts src/__tests__/consistency-classnames.test.ts src/__tests__/legibility-classnames.test.ts > /tmp/134-r7-rest.txt 2>&1; echo "exit=$?"
    -> exit=0 y `Tests:       112 passed, 112 total`
  grep -qE '^Tests: +1 failed, 64 passed, 65 total$' /tmp/134-r7.txt \
    && grep -qE '^Tests: +112 passed, 112 total$' /tmp/134-r7-rest.txt \
    && ! grep -qE 'TypeError|ReferenceError|SyntaxError|Cannot find module|Unable to find an element' /tmp/134-r7.txt \
    && test "$(grep -cE 'alertKeys|invalidateQueries|setQueryData|useQueryClient|queryClient' src/utils/alert-ack-outcome.ts)" = 1 \
    && test "$(grep -cF "describe('#134 R7" src/__tests__/design-drift.test.ts)" = 1 \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bun run lint \
    && git add src/__tests__/design-drift.test.ts src/utils/alert-ack-outcome.ts \
    && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/__tests__/design-drift.test.ts mobile-pet-tracker/src/utils/alert-ack-outcome.ts ' \
    && git commit -m 'test(mobile-alert-ack-outcome-helper): guard the alert list cache (R7)'

R7 verde (borra la linea de M4; el helper vuelve a ser el del verde de
R6, que es HEAD~1 en este momento):
  FORCE_COLOR=0 bunx jest src/utils/alert-ack-outcome.test.ts > /tmp/134-g7.txt 2>&1; echo "exit=$?"
    -> exit=0 y `Tests:       15 passed, 15 total`
  <GUARDAS> > /tmp/134-g7-guardas.txt 2>&1; echo "exit=$?"
    -> exit=0 y `Tests:       177 passed, 177 total`
  grep -qE '^Tests: +15 passed, 15 total$' /tmp/134-g7.txt \
    && grep -qE '^Tests: +177 passed, 177 total$' /tmp/134-g7-guardas.txt \
    && git diff --quiet HEAD~1 -- src/utils/alert-ack-outcome.ts \
    && test "$(grep -cE 'alertKeys|invalidateQueries|setQueryData|useQueryClient|queryClient' src/utils/alert-ack-outcome.ts)" = 0 \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bun run lint \
    && git add src/utils/alert-ack-outcome.ts \
    && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/utils/alert-ack-outcome.ts ' \
    && git commit -m 'fix(mobile-alert-ack-outcome-helper): revert R7 cache mutation (R7)'

== CIERRE ==

Primero, literal:
  cd /home/claude/sites/Pet-Tracker-wt-134/mobile-pet-tracker && pwd
Desde mobile-pet-tracker/, sin pipe, con salida al impl:
- Las 7 suites tocadas, un solo jest:
  FORCE_COLOR=0 bunx jest src/screens/alerts/index.test.tsx src/screens/alert-detail/index.test.tsx src/utils/alert-ack-outcome.test.ts src/__tests__/ui-language.test.ts src/__tests__/design-drift.test.ts src/__tests__/consistency-classnames.test.ts src/__tests__/legibility-classnames.test.ts > /tmp/134-final.txt 2>&1; echo "exit=$?"
    -> exit=0, `Test Suites: 7 passed, 7 total` y `Tests:       259 passed, 259 total`
       (41 + 26 + 15 + 30 + 65 + 55 + 27)
- `pgrep -af '[i]nit\.sh'` vacio; despues
  `FORCE_COLOR=0 bunx jest > /tmp/134-all.txt 2>&1; echo "exit=$?"`
    -> exit=0, `Test Suites: 98 passed, 98 total` y `Tests:       2386 passed, 2386 total` (base + 1 suite y + 21 tests: 2 de R1, 1 de R2, 15 del helper, 3 de design-drift; si otra feature mergeo antes y la base cambio, la cuenta es la tuya de BASE + esos deltas)
  Copia las lineas `Test Suites:` y `Tests:`. Mientras corre, no lances
  otra cosa.
- `test ! -e .expo/types/router.d.ts && bun run typecheck; echo "exit=$?"` -> exit=0
- `bunx expo lint --no-cache; echo "exit=$?"` -> exit=0, sin avisos ni errores
- `git diff --numstat <H0> -- src/screens/alerts/index.test.tsx src/screens/alert-detail/index.test.tsx`
  -> dos lineas con la columna de borrados (la segunda) en 0
- `git diff --quiet <H0> -- src/i18n/catalog.ts src/providers/__tests__/language-provider.test.tsx; echo "exit=$?"` -> exit=0
- `git diff --stat <H0> -- package.json bun.lock app.json src/theme` -> vacio
- Las anclas A1-A17, H1-H8, T1-T7, L1-L6, D1-D7 y X1-X6 con su valor «al
  cerrar» (X6: ver la nota de ANCLAS).
Desde la raiz del repo (`cd /home/claude/sites/Pet-Tracker-wt-134 && pwd`):
- `git diff --stat <H0> -- backend-pet-tracker/ infra/ docs/` -> vacio
- `git diff --name-only <H0> HEAD -- mobile-pet-tracker/ | LC_ALL=C sort`
  -> exactamente los 9 de mobile-pet-tracker/ de la lista de abajo

Despues rellena specs/mobile-alert-ack-outcome-helper/traceability.md:
en cada fila R1-R7, la columna «Test» con su fichero y su titulo de
describe reales, y «Commit rojo» y «Commit verde» con hash corto +
mensaje. No toques su frontmatter ni el resto del fichero. Commit final,
desde la raiz:
  git add specs/mobile-alert-ack-outcome-helper/traceability.md progress/impl_mobile-alert-ack-outcome-helper.md \
    && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'progress/impl_mobile-alert-ack-outcome-helper.md specs/mobile-alert-ack-outcome-helper/traceability.md ' \
    && git commit -m 'docs(mobile-alert-ack-outcome-helper): traceability (#134)'
Y la lista cerrada, con salida al impl:
  git diff --name-only <H0> HEAD -- . ':!feature_list.json' ':!progress/current.md' ':!progress/handoff_mobile-alert-ack-outcome-helper.md' ':!specs/mobile-alert-ack-outcome-helper/requirements.md' ':!specs/mobile-alert-ack-outcome-helper/design.md' ':!specs/mobile-alert-ack-outcome-helper/tasks.md' ':!progress/review_mobile-alert-ack-outcome-helper.md'
    -> exactamente los 11 ficheros de abajo
Si despues del commit de trazabilidad cambias el impl, va en otro commit
`docs(mobile-alert-ack-outcome-helper): impl report (#134)` con solo ese
fichero. No rebasees despues de escribir hashes.

== REGLAS CRITICAS ==

- Sin cambio de conducta: los tests EXISTENTES de las dos pantallas no se
  editan (ni una linea; el numstat del Cierre lo mide). Los describes
  nuevos de R1/R2 van ANIDADOS al final de `#78 R8` y de `#100 R5` y
  reutilizan su `beforeEach`, `pressAck()` y `renderDetail()`.
- Firma y nombres de design.md §2 al pie de la letra: `settleAlertAck`,
  `AlertAckHandlers` con `t`, `signOut`, `showError`, `onAcked`,
  `onNotFound`, desestructurados en la firma; `request` es un thunk.
  Solo `import type` en el helper. Las pantallas importan desde
  `'../../utils/alert-ack-outcome'`. Ningun cast.
- Esperas (docs/conventions.md §Esperas sobre el arbol renderizado):
  «La condicion que termina una espera debe ser la misma observacion que
  hacen las aserciones posteriores. Si el test asevera el arbol, espera
  al arbol: esperar a la cache de Query o al contador de un mock y
  consultar el DOM despues introduce una carrera.» En C1, C2 y D1 la
  espera es `await waitFor(() => expect(screen.queryByTestId('<id>')).toHaveTextContent('Algo salió mal'))`
  y el contador de `mockSignOut` se asevera DESPUES, nunca como espera.
  En RNTL 14 `toHaveTextContent` compara el texto entero: literal
  completo.
- Mocks compartidos de las pantallas: `mockRejectedValueOnce`, NUNCA
  `mockRejectedValue` (jest.clearAllMocks no borra implementaciones y la
  fuga contamina los its siguientes). En el helper, el `signOut` que
  rechaza es `jest.fn().mockRejectedValueOnce(new Error('sign-out failed'))`
  o equivalente perezoso: nunca una promesa rechazada creada fuera de la
  llamada (rechazo no manejado).
- Valores esperados LITERALES en los tests (`'Cannot reach server'`,
  `'No se pudo conectar con el servidor'`, `'Something went wrong'`,
  `'Algo salió mal'`), nunca `en[...]`/`es[...]` ni un simbolo importado
  de produccion. El `t` de `makeHandlers` SI traduce con `en`/`es` del
  catalogo (es el doble, no la expectativa).
- Imports en los tests: NOMBRADOS, nunca `import * as` (eslint
  `import/namespace` es error y tumbaria la cadena).
- design-drift escanea tambien los tests co-locados
  (src/utils/alert-ack-outcome.test.ts y los de pantalla) y sus propios
  ficheros: todo `#134` va seguido de ` R<n>` (un `#134` suelto lo caza el
  guard de hex), ninguna cadena lleva un guion pegado a `[`, cero
  `StyleSheet`, cero `queryKey: [`.
- El escaneo de #65 R18 compara cada literal entero del helper con los
  valores fijos del catalogo. El leader comprobo en H0 que ninguno de los
  literales previstos ('ok', 'already-closed', 'not-found', 'unreachable',
  'unauthorized', 'error', 'missing-config', 'closed', las rutas de
  import y las dos claves) es un valor del catalogo. No metas en el
  helper ningun literal de texto visible.
- Skills: ninguna de tu plugin expo aplica (no hay UI, ni estilos, ni
  peticiones nuevas); no cargues ninguna. Las decisiones de la spec
  mandan sobre cualquier skill. Di en el impl cuales cargaste (lo
  esperado: ninguna).
- Ni `bun add`, ni cambios en package.json, bun.lock ni app.json. Todo
  con bun/bunx, nunca npm/npx/pnpm.
- NO lances ./init.sh ni toques Postgres ni LocalStack.
- No toques ningun fichero fuera de la lista de abajo. En particular, NO:
  src/i18n/catalog.ts, src/providers/__tests__/language-provider.test.tsx,
  src/api/alerts.ts, src/theme/, docs/.
- NO son tuyos, no los toques: progress/history.md, progress/current.md,
  STATUS.md, feature_list.json, el frontmatter de los ficheros de la
  spec y §Aprobacion de requirements.md. Los escribe el leader o el
  humano. Todo lo que tengas que contar va en
  progress/impl_mobile-alert-ack-outcome-helper.md.
- Si el sandbox te deniega un comando, PARA y reportalo. No lo sustituyas
  por otro que haga lo mismo con otra herramienta.
- NO hagas push ni abras la PR: lo hace el leader al cerrar.

Ficheros que TU cambias (11, ni uno mas):
  mobile-pet-tracker/src/__tests__/design-drift.test.ts
  mobile-pet-tracker/src/__tests__/ui-copy-table.ts
  mobile-pet-tracker/src/__tests__/ui-language.test.ts
  mobile-pet-tracker/src/screens/alert-detail/index.test.tsx
  mobile-pet-tracker/src/screens/alert-detail/index.tsx
  mobile-pet-tracker/src/screens/alerts/index.test.tsx
  mobile-pet-tracker/src/screens/alerts/index.tsx
  mobile-pet-tracker/src/utils/alert-ack-outcome.test.ts
  mobile-pet-tracker/src/utils/alert-ack-outcome.ts
  progress/impl_mobile-alert-ack-outcome-helper.md
  specs/mobile-alert-ack-outcome-helper/traceability.md
Si el leader commitea en mitad (una correccion), solo tocara ficheros
excluidos por los pathspecs de arriba; cualquier otro fichero ajeno en
`git diff --name-only <H0> HEAD` es motivo de parada.

Criterios de aceptacion: R1-R7 de requirements.md. No hay prueba de humo
(Q5).

Al terminar, progress/impl_mobile-alert-ack-outcome-helper.md debe tener:
pwd, branch, H0 y status; el exit de is-ancestor; node_modules (presente
o instalado); skills cargadas; la salida de todas las anclas en H0 y al
cerrar; la base con su exit (6 suites); los 14 commits TDD con hash y
R-id; por cada rojo, el comando, la linea `Tests:`, el exit y cada it
rojo con su matcher y Expected/Received; cada verde con sus lineas
`Tests:`, GUARDAS, typecheck y lint; el cierre (7 suites con 259, jest
entero con exit, typecheck, lint --no-cache, numstat, diffs vacios, lista
cerrada); y cualquier decision que la spec no cerrara literalmente.
```

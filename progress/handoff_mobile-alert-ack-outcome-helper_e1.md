# Handoff a Codex CLI — #134 mobile-alert-ack-outcome-helper, ronda 2 (Enmienda E1)

> Pegar el bloque de abajo en Codex CLI. La ronda 1 (H0 `4d87eb8f`, código
> hasta `5a85534e`) la rechazó el reviewer en `815de8f6`: el código es
> correcto, pero tres cláusulas no tenían candado. La Enmienda E1 los añade y
> está firmada (commit de firma `08d7d0a1`, aprobación vía Notion el
> 2026-10-09T21:58:25Z). E1 **no cambia código de producción**: son 8 tests
> nuevos que nacen verdes, cada uno cerrado por una mutación de producción que
> su commit rojo aplica y su verde revierte. Son 9 commits: cuatro pares
> rojo/verde y uno de trazabilidad. No hay prueba de humo.
>
> `node_modules` ya está instalado en `Pet-Tracker-wt-134/mobile-pet-tracker`.
> El leader midió la base en `08d7d0a1` (cuyo `mobile-pet-tracker/` es igual
> al de `b276727e`, el que init.sh dio verde con 98/2386) y ejecutó todas las
> anclas de este fichero en H0.

---

```
Worktree: /home/claude/sites/Pet-Tracker-wt-134   <- PRIMERA LINEA. Trabaja AQUI y en ningun otro sitio
Antes de tocar nada, ejecuta `pwd`, `git branch --show-current`,
`git rev-parse --short HEAD` y `git status --short` y pega las cuatro
salidas al principio de una seccion NUEVA `## Ronda 2` al FINAL de
progress/impl_mobile-alert-ack-outcome-helper.md (no edites nada de la
ronda 1 en ese fichero). El hash es el H0 de la ronda 2 (el commit que
anade este handoff), el «H0 ronda 2» de tasks.md. En todos los comandos
de abajo, sustituye `<H0>` por ese hash literal. NO uses 4d87eb8f: ese
es el H0 de la ronda 1. PARA si la branch no es
feature/134-mobile-alert-ack-outcome-helper o si `git status --short` no
sale vacio. No toques /home/claude/sites/Pet-Tracker ni ningun otro
worktree (Pet-Tracker-wt-158, Pet-Tracker-wt-159, Pet-Tracker-wt-backend,
Pet-Tracker-wt-ui...), ni cambies de branch en ninguno.

Feature: mobile-alert-ack-outcome-helper (#134), ronda 2
Branch: feature/134-mobile-alert-ack-outcome-helper
Spec: specs/mobile-alert-ack-outcome-helper/requirements.md, seccion
`## Enmienda E1` (E1.1 a E1.7), aprobada: §Aprobacion tiene
`- [x] Enmienda E1 aprobada (fecha: 2026-10-09)`. Lee entera esa seccion
y `## Ronda 2 — Enmienda E1` de tasks.md (tu guion), y repasa
design.md §2 y §3. Los titulos de los it, el texto de C5/D4 y las
mutaciones M5-M9 son LITERALES de requirements.md §E1: copialos tal
cual, con sus tildes y su sangria. Los commits de la ronda 1 no se tocan.

== QUE HACES ==

Los 9 commits, en este orden exacto (mensajes de tasks.md §Ronda 2):
  c1 rojo  R4 (E1)       W1, W2 + M5 en el helper
  c2 verde R4 (E1)       revierte M5
  c3 rojo  R1 (E1)       EnglishAlertsWrapper, renderAlertsInEnglish, C3, C4 + M6
  c4 verde R1 (E1)       revierte M6
  c5 rojo  R2 (E1)       D2, D3 + M7
  c6 verde R2 (E1)       revierte M7
  c7 rojo  R1 y R2 (E1.7) C5, D4 + M8 y M9 a la vez
  c8 verde R1 y R2 (E1.7) revierte M8 y M9
  c9 trazabilidad
c7 va DESPUES de c3 y c5: C5 se inserta despues de C4 y D4 despues de D3.
Rojo SIEMPRE antes de su verde, en commits separados. Cada test nace
VERDE contra el codigo de H0; el rojo lo pone la mutacion. Cada verde
deja el fichero de produccion IDENTICO al de H0 (la cadena lo mide con
`git diff --quiet <H0> -- <fichero>`).

Esto manda sobre tasks.md:
- Trazabilidad: traceability.md se toca UNA vez, en c9. Ningun commit
  c1-c8 la toca.
- Mide con `FORCE_COLOR=0` delante de `bunx jest` y con la salida a un
  fichero, como en las cadenas de abajo.
- NO lances ./init.sh: lo corre el leader (comparte Postgres y LocalStack
  con otras sesiones). En su lugar va la suite entera de jest del Cierre.

E1.6 de la spec, literal: «Si un candado no da verde contra HEAD, o una
mutacion no da el rojo declarado, Codex PARA. Copia el Received
recortado al impl, no toca produccion fuera de la mutacion declarada y
no ajusta el it. Quien decide es el leader.»

== BASE ==

Primero, literal:
  cd /home/claude/sites/Pet-Tracker-wt-134/mobile-pet-tracker && pwd
    -> /home/claude/sites/Pet-Tracker-wt-134/mobile-pet-tracker
Todo lo de BASE, ANCLAS, COMMITS y SONDAS se ejecuta desde ahi. El
Cierre te dice cuando volver a la raiz.

Error de invocacion != rojo. Si un comando falla ANTES de que arranque
jest, tsc o eslint, sin haber tocado ningun fichero (ERR_PNPM_*,
`No such file or directory`, `command not found`, cwd equivocado, ruta
mal tecleada), NO es «algo nace rojo»: corrige la invocacion, repitela y
anotalo en el impl. Solo PARAS si falla el codigo, una cuenta o un
eslabon de una cadena bien invocada.

Al arrancar: `git fetch origin` y
`git merge-base --is-ancestor origin/main HEAD; echo "exit=$?"`.
Anota el exit. Si da 1 (otra feature mergeo antes), NO pares: trabajas
sobre H0 igual y el merge de main lo hace el leader. Nunca rebasees ni
mergees.

Desde mobile-pet-tracker/:
- `test -d node_modules && echo presente` -> presente. Si no sale,
  `bun install --frozen-lockfile`; si el sandbox te lo deniega, PARA.
- `test ! -e .expo/types/router.d.ts; echo "exit=$?"` -> exit=0. Va en
  cada cadena de commit; si un dia da 1, PARA y pide al humano que lo
  borre. Nunca `rm -f` (tu sandbox lo deniega).
- `pgrep -af '[i]nit\.sh'` sin pipe: si sale algo, otra sesion usa la
  maquina; espera a que salga vacio antes de la suite entera del Cierre.

Base medida por el leader el 2026-10-09 en este worktree en 08d7d0a1,
una suite por llamada, FORCE_COLOR=0, sin pipe, todas exit=0:
  src/utils/alert-ack-outcome.test.ts             15
  src/screens/alerts/index.test.tsx               41
  src/screens/alert-detail/index.test.tsx         26
  src/__tests__/design-drift.test.ts              65
  src/__tests__/ui-language.test.ts               30
  src/__tests__/consistency-classnames.test.ts    55
  src/__tests__/legibility-classnames.test.ts     27
Suite entera (init.sh del leader sobre este mismo mobile-pet-tracker/):
`Test Suites: 98 passed, 98 total` y `Tests:       2386 passed, 2386 total`
Tu medida manda: repite cada fila y anota sus lineas `Tests:` en el
impl. Si alguna difiere o nace roja, anota y PARA.

Comando GUARDAS (los candados de copy y de carta; lo corre cada cadena):
  FORCE_COLOR=0 bunx jest src/__tests__/ui-language.test.ts src/__tests__/design-drift.test.ts src/__tests__/consistency-classnames.test.ts src/__tests__/legibility-classnames.test.ts
En las cadenas aparece como `<GUARDAS> > /tmp/134-e1-xx-guardas.txt 2>&1`.
Su total es 30 + 65 + 55 + 27 = 177 en TODOS los commits, rojos
incluidos: las mutaciones M5-M9 estan disenadas para no moverlo (dejan
igual los recuentos de `checkUses` y de `screenSignOutCalls`).

== ANCLAS ==

Ejecutalas TODAS desde mobile-pet-tracker/ antes de tocar nada y copia la
salida al impl. Son E1-E21 de tasks.md §Anclas de la ronda 2 y X1-X14 de
este handoff. Solo estos comandos son anclas; los numeros de linea no lo
son. Si alguna no da EXACTAMENTE lo esperado, PARA y avisa (ante una
diferencia manda el fichero, no el handoff). Cuando `grep -c` cuenta 0
sale con codigo 1: lo que vale es la cifra impresa. Copia cada comando
tal cual, con sus comillas: E20, E21 y X5-X10 casan lineas enteras con
espacios iniciales que se pierden si quitas las comillas. El leader las
ha ejecutado todas en H0 sacandolas de este mismo fichero.

Formato: `comando   -> en H0 | al cerrar`.

E1. grep -cF 'function deferred()' src/utils/alert-ack-outcome.test.ts   -> 0 | 1
E2. grep -cF "it('unauthorized espera a signOut antes de resolver'" src/utils/alert-ack-outcome.test.ts   -> 0 | 1
E3. grep -cF "it('unauthorized espera también a un signOut que rechaza, es'" src/utils/alert-ack-outcome.test.ts   -> 0 | 1
E4. grep -cF 'function renderAlertsInEnglish()' src/screens/alerts/index.test.tsx   -> 0 | 1
E5. grep -cF 'initial="en"' src/screens/alerts/index.test.tsx   -> 0 | 1
E6. grep -cF "'Cannot reach server'" src/screens/alerts/index.test.tsx   -> 0 | 1
E7. grep -cF "'Something went wrong'" src/screens/alerts/index.test.tsx   -> 0 | 1
E8. grep -cF "'Cannot reach server'" src/screens/alert-detail/index.test.tsx   -> 0 | 1
E9. grep -cF "'Something went wrong'" src/screens/alert-detail/index.test.tsx   -> 0 | 1
E10. grep -cF "renderDetail('alert-1', 'en')" src/screens/alert-detail/index.test.tsx   -> 0 | 2
E11. grep -cF 'const fail' src/utils/alert-ack-outcome.ts   -> 0 | 0
E12. grep -cF 'es[key]' src/screens/alerts/index.tsx   -> 0 | 0
E13. grep -cF 'es[key]' src/screens/alert-detail/index.tsx   -> 0 | 0
E14. grep -cF "it('mantiene el botón deshabilitado hasta que signOut termina tras unauthorized'" src/screens/alerts/index.test.tsx   -> 0 | 1
E15. grep -cF "it('mantiene el botón deshabilitado hasta que signOut termina tras unauthorized'" src/screens/alert-detail/index.test.tsx   -> 0 | 1
E16. grep -cF 'finishSignOut' src/screens/alerts/index.test.tsx   -> 0 | 3
E17. grep -cF 'finishSignOut' src/screens/alert-detail/index.test.tsx   -> 0 | 3
E18. grep -cF 'const run = signOut;' src/screens/alerts/index.tsx   -> 0 | 0
E19. grep -cF 'const run = signOut;' src/screens/alert-detail/index.tsx   -> 0 | 0
E20. grep -cxF '        signOut,' src/screens/alerts/index.tsx   -> 1 | 1
E21. grep -cxF '        signOut,' src/screens/alert-detail/index.tsx   -> 1 | 1
X1. grep -cF -- '- [x] Enmienda E1 aprobada (fecha: 2026-10-09)' ../specs/mobile-alert-ack-outcome-helper/requirements.md   -> 1 | 1
X2. grep -cF "describe('#134 R4: el helper resuelve las ramas comunes en los dos idiomas'" src/utils/alert-ack-outcome.test.ts   -> 1 | 1
X3. grep -cF "describe('#134 R1: caracterización de las ramas sin candado del ack'" src/screens/alerts/index.test.tsx   -> 1 | 1
X4. grep -cF "describe('#134 R2: caracterización de la rama sin candado del ack'" src/screens/alert-detail/index.test.tsx   -> 1 | 1
X5. grep -cxF '        await signOut();' src/utils/alert-ack-outcome.ts   -> 1 | 1
X6. grep -cxF "    showError(t('common.somethingWentWrong'));" src/utils/alert-ack-outcome.ts   -> 1 | 1
X7. grep -cxF '        t,' src/screens/alerts/index.tsx   -> 1 | 1
X8. grep -cxF '        t,' src/screens/alert-detail/index.tsx   -> 1 | 1
X9. grep -cxF "import { useAlertsList } from '../../hooks/use-alerts-list';" src/screens/alerts/index.tsx   -> 1 | 1
X10. grep -cxF "import { useAlertsList } from '../../hooks/use-alerts-list';" src/screens/alert-detail/index.tsx   -> 1 | 1
X11. grep -cF "function renderDetail(alertId = 'alert-1', language: 'es' | 'en' = 'es')" src/screens/alert-detail/index.test.tsx   -> 1 | 1
X12. grep -cF 'mockRejectedValue(' src/utils/alert-ack-outcome.test.ts src/screens/alerts/index.test.tsx src/screens/alert-detail/index.test.tsx   -> helper:0, alerts:0, alert-detail:1 | igual
X13. grep -cF 'mockResolvedValue(' src/utils/alert-ack-outcome.test.ts src/screens/alerts/index.test.tsx src/screens/alert-detail/index.test.tsx   -> helper:0, alerts:30, alert-detail:15 | igual
X14. grep -cF 'mockReturnValue(' src/utils/alert-ack-outcome.test.ts src/screens/alerts/index.test.tsx src/screens/alert-detail/index.test.tsx   -> helper:0, alerts:18, alert-detail:4 | igual

(X5 y X6 son las dos lineas que cambia M5; X6 es la del `catch`, con 4
espacios: la de `case 'error'` lleva 8 y no se toca. X7-X10 son las
lineas que cambian M6/M7. X12-X14 son el candado de fugas: lo que
escribas usa SOLO las formas `...Once(`, asi que esas cuentas no se
mueven. Los existentes no se tocan ni se copian.)

== COMMITS ==

Todo desde mobile-pet-tracker/. Cada commit va ENCADENADO con && a su
verificacion: si cualquier eslabon falla, el commit no se hace. Nunca
commitees fuera de estas cadenas ni con un exit distinto de 0 en la
cadena. Si una cadena no llega al commit, PARA y reporta en el impl el
eslabon que fallo y la salida.

Mide SIN pipe (`cmd | tail` devuelve el exit de tail). Cada medida
lleva su `echo "exit=$?"`; anota el exit en el impl.

Rojos: TODOS por ASERCION. Nunca por TypeError, ReferenceError,
SyntaxError, `Cannot find module` ni por consulta
(`Unable to find an element`). La cadena comprueba la cuenta y el nombre
de cada it rojo (`● describe › it`); tu ademas abres el log y copias al
impl cada it rojo con su matcher y su Expected/Received.

Typecheck y lint van en todas las cadenas, rojos incluidos (exit 0):
ninguna mutacion de E1 es de tipos.

-- c1/c2: R4 (E1), el helper espera a signOut (W1, W2) --

c1 rojo. En src/utils/alert-ack-outcome.test.ts: `deferred` y
`flushPromises` justo despues de `makeHandlers` (texto de E1.1), y W1 y
W2 al final de `describe('#134 R4: ...')`, paso a paso segun E1.1. Lo
que E1.1 cierra y aqui se repite porque es donde se tropieza:
  - `const signOutGate = deferred();` y
    `handlers.signOut.mockReturnValueOnce(signOutGate.promise);` con
    `const handlers = makeHandlers('es');`.
  - `void done.then(() => { settled = true; }, () => undefined);` CON
    el segundo argumento (F1: sin el, un rechazo tumba el proceso de
    jest en vez de dar rojo por asercion). Formato de E1.1 paso 2.
  - «sin llamadas» = `expect(handlers.<x>).not.toHaveBeenCalled()`;
    «llamado una vez» = `toHaveBeenCalledTimes(1)`; en W2, «showError
    llamado una vez con el literal» = `toHaveBeenCalledTimes(1)` y
    `toHaveBeenCalledWith('Algo salió mal')`, con el literal escrito.
  - nada de temporizadores falsos: `flushPromises` usa el `setTimeout`
    real (la suite no llama `useFakeTimers`).
En src/utils/alert-ack-outcome.ts, la mutacion M5 de E1.1, sus tres
cambios: la linea `const fail = ...` justo antes de `  try {`; X5 pasa a
`        void Promise.resolve(signOut()).catch(fail);`; X6 pasa a
`    fail();`.
  FORCE_COLOR=0 bunx jest src/utils/alert-ack-outcome.test.ts > /tmp/134-e1-r1.txt 2>&1; echo "exit=$?"
    -> exit=1 y `Tests:       2 failed, 15 passed, 17 total`
       (W1 y W2 en `expect(settled).toBe(false)`: Expected false, Received true)
  <GUARDAS> > /tmp/134-e1-r1-guardas.txt 2>&1; echo "exit=$?"
    -> exit=0 y `Tests:       177 passed, 177 total`
  grep -qE '^Tests: +2 failed, 15 passed, 17 total$' /tmp/134-e1-r1.txt \
    && grep -qE '^Tests: +177 passed, 177 total$' /tmp/134-e1-r1-guardas.txt \
    && grep -qF '● #134 R4: el helper resuelve las ramas comunes en los dos idiomas › unauthorized espera a signOut antes de resolver' /tmp/134-e1-r1.txt \
    && grep -qF '● #134 R4: el helper resuelve las ramas comunes en los dos idiomas › unauthorized espera también a un signOut que rechaza, es' /tmp/134-e1-r1.txt \
    && grep -qF 'Expected: false' /tmp/134-e1-r1.txt \
    && ! grep -qE 'TypeError|ReferenceError|SyntaxError|Cannot find module|Unable to find an element' /tmp/134-e1-r1.txt \
    && test "$(grep -cF 'const fail' src/utils/alert-ack-outcome.ts)" = 1 \
    && test "$(grep -cxF '        await signOut();' src/utils/alert-ack-outcome.ts)" = 0 \
    && test "$(grep -cF 'signOut(' src/utils/alert-ack-outcome.ts)" = 1 \
    && test "$(grep -cF "t('common.somethingWentWrong')" src/utils/alert-ack-outcome.ts)" = 2 \
    && test "$(grep -cF 'function deferred()' src/utils/alert-ack-outcome.test.ts)" = 1 \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bun run lint \
    && git add src/utils/alert-ack-outcome.test.ts src/utils/alert-ack-outcome.ts \
    && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/utils/alert-ack-outcome.test.ts mobile-pet-tracker/src/utils/alert-ack-outcome.ts ' \
    && git commit -m 'test(mobile-alert-ack-outcome-helper): helper awaits sign-out either way (R4)'

c2 verde (revierte M5; el helper vuelve a ser el de H0):
  FORCE_COLOR=0 bunx jest src/utils/alert-ack-outcome.test.ts > /tmp/134-e1-g1.txt 2>&1; echo "exit=$?"
    -> exit=0 y `Tests:       17 passed, 17 total`
  <GUARDAS> > /tmp/134-e1-g1-guardas.txt 2>&1; echo "exit=$?"
    -> exit=0 y 177
  grep -qE '^Tests: +17 passed, 17 total$' /tmp/134-e1-g1.txt \
    && grep -qE '^Tests: +177 passed, 177 total$' /tmp/134-e1-g1-guardas.txt \
    && git diff --quiet <H0> -- src/utils/alert-ack-outcome.ts \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bun run lint \
    && git add src/utils/alert-ack-outcome.ts \
    && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/utils/alert-ack-outcome.ts ' \
    && git commit -m 'fix(mobile-alert-ack-outcome-helper): revert R4 sign-out wait mutation (R4)'

-- c3/c4: R1 (E1), el centro en ingles (C3, C4) --

c3 rojo. En src/screens/alerts/index.test.tsx: `EnglishAlertsWrapper` y
`renderAlertsInEnglish` justo despues de `function renderAlerts() {...}`
(texto de E1.2; todos sus imports ya existen), y C3 y C4 al final de
`describe('#134 R1: ...')`, con los titulos, los `mockResolvedValueOnce`
y el cuerpo comun de E1.2. En src/screens/alerts/index.tsx, la mutacion
M6: la linea `import { es } from '../../i18n/catalog';` justo despues de
X9, y X7 pasa a `        t: (key) => es[key],`.
  FORCE_COLOR=0 bunx jest src/screens/alerts/index.test.tsx > /tmp/134-e1-r3.txt 2>&1; echo "exit=$?"
    -> exit=1 y `Tests:       2 failed, 41 passed, 43 total`
       (C3 recibe `No se pudo conectar con el servidor`; C4 recibe `Algo salió mal`)
  <GUARDAS> > /tmp/134-e1-r3-guardas.txt 2>&1; echo "exit=$?"
    -> exit=0 y 177
  grep -qE '^Tests: +2 failed, 41 passed, 43 total$' /tmp/134-e1-r3.txt \
    && grep -qE '^Tests: +177 passed, 177 total$' /tmp/134-e1-r3-guardas.txt \
    && grep -qF '● #78 R8: el ack cambia la fila sin recargar la lista › #134 R1: caracterización de las ramas sin candado del ack › muestra Cannot reach server en inglés si ackAlert responde unreachable' /tmp/134-e1-r3.txt \
    && grep -qF '● #78 R8: el ack cambia la fila sin recargar la lista › #134 R1: caracterización de las ramas sin candado del ack › muestra Something went wrong en inglés si ackAlert responde error' /tmp/134-e1-r3.txt \
    && ! grep -qE 'TypeError|ReferenceError|SyntaxError|Cannot find module|Unable to find an element' /tmp/134-e1-r3.txt \
    && test "$(grep -cF 'es[key]' src/screens/alerts/index.tsx)" = 1 \
    && test "$(grep -cxF '        t,' src/screens/alerts/index.tsx)" = 0 \
    && test "$(grep -cF 'function renderAlertsInEnglish()' src/screens/alerts/index.test.tsx)" = 1 \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bun run lint \
    && git add src/screens/alerts/index.test.tsx src/screens/alerts/index.tsx \
    && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/screens/alerts/index.test.tsx mobile-pet-tracker/src/screens/alerts/index.tsx ' \
    && git commit -m 'test(mobile-alert-ack-outcome-helper): centro ack errors in english (R1)'

c4 verde (revierte M6):
  FORCE_COLOR=0 bunx jest src/screens/alerts/index.test.tsx > /tmp/134-e1-g3.txt 2>&1; echo "exit=$?"
    -> exit=0 y `Tests:       43 passed, 43 total`
  <GUARDAS> > /tmp/134-e1-g3-guardas.txt 2>&1; echo "exit=$?"
    -> exit=0 y 177
  grep -qE '^Tests: +43 passed, 43 total$' /tmp/134-e1-g3.txt \
    && grep -qE '^Tests: +177 passed, 177 total$' /tmp/134-e1-g3-guardas.txt \
    && git diff --quiet <H0> -- src/screens/alerts/index.tsx \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bun run lint \
    && git add src/screens/alerts/index.tsx \
    && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/screens/alerts/index.tsx ' \
    && git commit -m 'fix(mobile-alert-ack-outcome-helper): revert R1 translator mutation (R1)'

-- c5/c6: R2 (E1), el detalle en ingles (D2, D3) --

c5 rojo. En src/screens/alert-detail/index.test.tsx: D2 y D3 al final de
`describe('#134 R2: ...')`, con los mismos titulos y
`mockResolvedValueOnce` que C3/C4 y el cuerpo comun de E1.2 para el
detalle (`await renderDetail('alert-1', 'en');`). Sin funciones nuevas
ni imports nuevos. En src/screens/alert-detail/index.tsx, la mutacion
M7: el mismo import justo despues de X10, y X8 pasa a
`        t: (key) => es[key],`.
  FORCE_COLOR=0 bunx jest src/screens/alert-detail/index.test.tsx > /tmp/134-e1-r5.txt 2>&1; echo "exit=$?"
    -> exit=1 y `Tests:       2 failed, 26 passed, 28 total`
  <GUARDAS> > /tmp/134-e1-r5-guardas.txt 2>&1; echo "exit=$?"
    -> exit=0 y 177
  grep -qE '^Tests: +2 failed, 26 passed, 28 total$' /tmp/134-e1-r5.txt \
    && grep -qE '^Tests: +177 passed, 177 total$' /tmp/134-e1-r5-guardas.txt \
    && grep -qF '● #100 R5: el detalle marca leída la alerta › #134 R2: caracterización de la rama sin candado del ack › muestra Cannot reach server en inglés si ackAlert responde unreachable' /tmp/134-e1-r5.txt \
    && grep -qF '● #100 R5: el detalle marca leída la alerta › #134 R2: caracterización de la rama sin candado del ack › muestra Something went wrong en inglés si ackAlert responde error' /tmp/134-e1-r5.txt \
    && ! grep -qE 'TypeError|ReferenceError|SyntaxError|Cannot find module|Unable to find an element' /tmp/134-e1-r5.txt \
    && test "$(grep -cF 'es[key]' src/screens/alert-detail/index.tsx)" = 1 \
    && test "$(grep -cxF '        t,' src/screens/alert-detail/index.tsx)" = 0 \
    && test "$(grep -cF "renderDetail('alert-1', 'en')" src/screens/alert-detail/index.test.tsx)" = 2 \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bun run lint \
    && git add src/screens/alert-detail/index.test.tsx src/screens/alert-detail/index.tsx \
    && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/screens/alert-detail/index.test.tsx mobile-pet-tracker/src/screens/alert-detail/index.tsx ' \
    && git commit -m 'test(mobile-alert-ack-outcome-helper): detail ack errors in english (R2)'

c6 verde (revierte M7):
  FORCE_COLOR=0 bunx jest src/screens/alert-detail/index.test.tsx > /tmp/134-e1-g5.txt 2>&1; echo "exit=$?"
    -> exit=0 y `Tests:       28 passed, 28 total`
  <GUARDAS> > /tmp/134-e1-g5-guardas.txt 2>&1; echo "exit=$?"
    -> exit=0 y 177
  grep -qE '^Tests: +28 passed, 28 total$' /tmp/134-e1-g5.txt \
    && grep -qE '^Tests: +177 passed, 177 total$' /tmp/134-e1-g5-guardas.txt \
    && git diff --quiet <H0> -- src/screens/alert-detail/index.tsx \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bun run lint \
    && git add src/screens/alert-detail/index.tsx \
    && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/screens/alert-detail/index.tsx ' \
    && git commit -m 'fix(mobile-alert-ack-outcome-helper): revert R2 translator mutation (R2)'

-- c7/c8: R1 y R2 (E1.7), cada pantalla espera a signOut (C5, D4) --

c7 rojo. C5 y D4 son los bloques LITERALES de E1.7 (19 y 20 lineas con
la linea en blanco inicial): C5 justo antes del `  });` que cierra
`describe('#134 R1: ...')`, despues de C4; D4 justo antes del `  });`
que cierra `describe('#134 R2: ...')`, despues de D3. El diferido con
inicializador (`= () => undefined`), sin `!`, sin `act` y sin tocar
ningun import. Las mutaciones M8 (centro) y M9 (detalle) de E1.7 a la
vez: cada una sustituye la linea E20/E21 (`        signOut,`) por las 6
lineas literales de E1.7.
  FORCE_COLOR=0 bunx jest src/screens/alerts/index.test.tsx > /tmp/134-e1-r7a.txt 2>&1; echo "exit=$?"
    -> exit=1 y `Tests:       1 failed, 43 passed, 44 total`
       (C5 en `toBeDisabled()`: «Received instance is not disabled»)
  FORCE_COLOR=0 bunx jest src/screens/alert-detail/index.test.tsx > /tmp/134-e1-r7b.txt 2>&1; echo "exit=$?"
    -> exit=1 y `Tests:       1 failed, 28 passed, 29 total`
       (D4, lo mismo)
  FORCE_COLOR=0 bunx jest src/utils/alert-ack-outcome.test.ts > /tmp/134-e1-r7c.txt 2>&1; echo "exit=$?"
    -> exit=0 y `Tests:       17 passed, 17 total`
  <GUARDAS> > /tmp/134-e1-r7-guardas.txt 2>&1; echo "exit=$?"
    -> exit=0 y 177
  grep -qE '^Tests: +1 failed, 43 passed, 44 total$' /tmp/134-e1-r7a.txt \
    && grep -qE '^Tests: +1 failed, 28 passed, 29 total$' /tmp/134-e1-r7b.txt \
    && grep -qE '^Tests: +17 passed, 17 total$' /tmp/134-e1-r7c.txt \
    && grep -qE '^Tests: +177 passed, 177 total$' /tmp/134-e1-r7-guardas.txt \
    && grep -qF '● #78 R8: el ack cambia la fila sin recargar la lista › #134 R1: caracterización de las ramas sin candado del ack › mantiene el botón deshabilitado hasta que signOut termina tras unauthorized' /tmp/134-e1-r7a.txt \
    && grep -qF '● #100 R5: el detalle marca leída la alerta › #134 R2: caracterización de la rama sin candado del ack › mantiene el botón deshabilitado hasta que signOut termina tras unauthorized' /tmp/134-e1-r7b.txt \
    && grep -qF 'Received instance is not disabled' /tmp/134-e1-r7a.txt \
    && grep -qF 'Received instance is not disabled' /tmp/134-e1-r7b.txt \
    && ! grep -qE 'TypeError|ReferenceError|SyntaxError|Cannot find module|Unable to find an element' /tmp/134-e1-r7a.txt /tmp/134-e1-r7b.txt \
    && test "$(grep -cF 'const run = signOut;' src/screens/alerts/index.tsx)" = 1 \
    && test "$(grep -cF 'const run = signOut;' src/screens/alert-detail/index.tsx)" = 1 \
    && test "$(grep -cxF '        signOut,' src/screens/alerts/index.tsx)" = 0 \
    && test "$(grep -cxF '        signOut,' src/screens/alert-detail/index.tsx)" = 0 \
    && test "$(grep -cF 'finishSignOut' src/screens/alerts/index.test.tsx)" = 3 \
    && test "$(grep -cF 'finishSignOut' src/screens/alert-detail/index.test.tsx)" = 3 \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bun run lint \
    && git add src/screens/alerts/index.test.tsx src/screens/alerts/index.tsx src/screens/alert-detail/index.test.tsx src/screens/alert-detail/index.tsx \
    && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/screens/alert-detail/index.test.tsx mobile-pet-tracker/src/screens/alert-detail/index.tsx mobile-pet-tracker/src/screens/alerts/index.test.tsx mobile-pet-tracker/src/screens/alerts/index.tsx ' \
    && git commit -m 'test(mobile-alert-ack-outcome-helper): screens keep ack disabled until sign-out settles (R1, R2)'
  Anota tambien en el impl `git diff --numstat HEAD~1 HEAD -- src/screens/alerts/index.tsx src/screens/alert-detail/index.tsx`
  -> `6 1` en cada pantalla (E1.7).

c8 verde (revierte M8 y M9):
  FORCE_COLOR=0 bunx jest src/screens/alerts/index.test.tsx src/screens/alert-detail/index.test.tsx > /tmp/134-e1-g7.txt 2>&1; echo "exit=$?"
    -> exit=0 y `Tests:       73 passed, 73 total` (44 + 29)
  <GUARDAS> > /tmp/134-e1-g7-guardas.txt 2>&1; echo "exit=$?"
    -> exit=0 y 177
  grep -qE '^Tests: +73 passed, 73 total$' /tmp/134-e1-g7.txt \
    && grep -qE '^Tests: +177 passed, 177 total$' /tmp/134-e1-g7-guardas.txt \
    && git diff --quiet <H0> -- src/screens/alerts/index.tsx src/screens/alert-detail/index.tsx \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bun run lint \
    && git add src/screens/alerts/index.tsx src/screens/alert-detail/index.tsx \
    && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/screens/alert-detail/index.tsx mobile-pet-tracker/src/screens/alerts/index.tsx ' \
    && git commit -m 'fix(mobile-alert-ack-outcome-helper): revert R1 and R2 sign-out wrapper mutations (R1, R2)'

== SONDAS (E1.4) ==

Sobre el HEAD de c8, desde mobile-pet-tracker/, una a una. Cada sonda:
aplica la mutacion de la tabla E1.4 de requirements.md, mide su suite
con `FORCE_COLOR=0 bunx jest <suite> > /tmp/134-e1-sN.txt 2>&1; echo "exit=$?"`,
revierte con `git checkout HEAD -- <fichero>` y comprueba
`git diff --quiet && git diff --cached --quiet; echo "exit=$?"` -> exit=0
ANTES de la siguiente. Nunca `git checkout <hash> --` (deja el indice
sucio). Ninguna se commitea. Copia al impl, por sonda, la linea
`Tests:`, el `●` de cada it rojo y la linea del matcher.
  E1-S1  helper   -> exit=1, `2 failed, 15 passed, 17 total`: W1 y W2, `toBe(false)`
  E1-S2  helper   -> exit=1, `2 failed, 15 passed, 17 total`: W1 y W2, `toBe(false)`
  E1-S3  centro   -> exit=1, `1 failed, 43 passed, 44 total`: solo C3, `toHaveTextContent`
  E1-S4  centro   -> exit=1, `1 failed, 43 passed, 44 total`: solo C4, `toHaveTextContent`
  E1-S5  detalle  -> exit=1, `1 failed, 28 passed, 29 total`: solo D2, `toHaveTextContent`
  E1-S6  detalle  -> exit=1, `1 failed, 28 passed, 29 total`: solo D3, `toHaveTextContent`
  E1-S7  centro   -> exit=1, `1 failed, 43 passed, 44 total`: solo C5, `toBeDisabled`
  E1-S8  detalle  -> exit=1, `1 failed, 28 passed, 29 total`: solo D4, `toBeDisabled`
(E1-S1 y E1-S2 sustituyen X5 conservando sus 8 espacios. E1-S3 a E1-S6
llevan el `import { es }` de M6 despues de X9/X10. Las cuentas de E1-S3
a E1-S8 son de este HEAD, con C5 y D4 ya dentro: 44 its en el centro y
29 en el detalle.) Rojo por
asercion en todas, nunca por consulta. Si una sonda no cae en
exactamente su it, PARA (E1.6).

== CIERRE ==

Primero, literal:
  cd /home/claude/sites/Pet-Tracker-wt-134/mobile-pet-tracker && pwd
Desde mobile-pet-tracker/, sin pipe, con salida al impl:
- Las 7 suites, un solo jest:
  FORCE_COLOR=0 bunx jest src/screens/alerts/index.test.tsx src/screens/alert-detail/index.test.tsx src/utils/alert-ack-outcome.test.ts src/__tests__/ui-language.test.ts src/__tests__/design-drift.test.ts src/__tests__/consistency-classnames.test.ts src/__tests__/legibility-classnames.test.ts > /tmp/134-e1-final.txt 2>&1; echo "exit=$?"
    -> exit=0, `Test Suites: 7 passed, 7 total` y `Tests:       267 passed, 267 total`
       (44 + 29 + 17 + 30 + 65 + 55 + 27)
- `pgrep -af '[i]nit\.sh'` vacio; despues
  `FORCE_COLOR=0 bunx jest > /tmp/134-e1-all.txt 2>&1; echo "exit=$?"`
    -> exit=0, `Test Suites: 98 passed, 98 total` y `Tests:       2394 passed, 2394 total`
       (2386 + 8; si otra feature mergeo antes y la base cambio, la cuenta es la tuya de BASE + 8)
  Copia las lineas `Test Suites:` y `Tests:`. Mientras corre, no lances
  otra cosa.
- `test ! -e .expo/types/router.d.ts && bun run typecheck; echo "exit=$?"` -> exit=0
- `bunx expo lint --no-cache; echo "exit=$?"` -> exit=0, sin avisos ni errores
- `git diff --numstat <H0> HEAD -- src/utils/alert-ack-outcome.test.ts src/screens/alerts/index.test.tsx src/screens/alert-detail/index.test.tsx`
  -> tres lineas con la columna de borrados (la segunda) en 0
- `git diff --quiet <H0> HEAD -- src/utils/alert-ack-outcome.ts src/screens/alerts/index.tsx src/screens/alert-detail/index.tsx src/__tests__ src/i18n/catalog.ts src/providers/__tests__/language-provider.test.tsx package.json bun.lock app.json; echo "exit=$?"`
  -> exit=0
- Las anclas E1-E21 y X1-X14 con su valor «al cerrar».
Desde la raiz del repo (`cd /home/claude/sites/Pet-Tracker-wt-134 && pwd`):
- `git diff --stat <H0> HEAD -- backend-pet-tracker/ infra/ docs/` -> vacio
- `git diff --name-only <H0> HEAD -- mobile-pet-tracker/ | LC_ALL=C sort`
  -> exactamente los 3 ficheros de test de la lista de abajo

Despues, en specs/mobile-alert-ack-outcome-helper/traceability.md, CUATRO
filas nuevas justo despues de la fila R7, en este orden y con los
mismos formatos de columna que las filas de la ronda 1:
  `R4 (E1)`        helper :: `#134 R4: ...` (W1 y W2) | c1 | c2
  `R1 (E1)`        centro :: `#78 R8: ... › #134 R1: ...` (C3 y C4) | c3 | c4
  `R2 (E1)`        detalle :: `#100 R5: ... › #134 R2: ...` (D2 y D3) | c5 | c6
  `R1 y R2 (E1.7)` centro (C5) y detalle (D4), sus dos describes | c7 | c8
Cada commit con hash corto + mensaje. No toques las siete filas de la
ronda 1, el frontmatter ni el resto del fichero. Commit, desde la raiz:
  git add specs/mobile-alert-ack-outcome-helper/traceability.md progress/impl_mobile-alert-ack-outcome-helper.md \
    && test "$(git diff --cached --name-only | LC_ALL=C sort | tr '\n' ' ')" = 'progress/impl_mobile-alert-ack-outcome-helper.md specs/mobile-alert-ack-outcome-helper/traceability.md ' \
    && git commit -m 'docs(mobile-alert-ack-outcome-helper): traceability round 2 (#134)'
Y la lista cerrada, con salida al impl:
  git diff --name-only <H0> HEAD -- . ':!feature_list.json' ':!progress/current.md' ':!progress/handoff_mobile-alert-ack-outcome-helper.md' ':!progress/handoff_mobile-alert-ack-outcome-helper_e1.md' ':!specs/mobile-alert-ack-outcome-helper/requirements.md' ':!specs/mobile-alert-ack-outcome-helper/design.md' ':!specs/mobile-alert-ack-outcome-helper/tasks.md' ':!progress/review_mobile-alert-ack-outcome-helper.md'
    -> exactamente los 5 ficheros de abajo
Si despues del commit de trazabilidad cambias el impl, va en otro commit
`docs(mobile-alert-ack-outcome-helper): impl report round 2 (#134)` con
solo ese fichero. No rebasees despues de escribir hashes.

== REGLAS CRITICAS ==

- Cero codigo de produccion: helper y pantallas solo cambian por las
  mutaciones M5-M9, y cada verde las revierte al byte (lo miden los
  `git diff --quiet <H0>` de c2, c4, c6, c8 y del Cierre).
- Los tests EXISTENTES no se editan (ni una linea; el numstat del Cierre
  lo mide). Tampoco `AlertsWrapper` ni `renderAlerts`, que fijan
  `initial="es"`: por eso E1.2 anade un wrapper en ingles aparte.
- Esperas (docs/conventions.md §Esperas sobre el arbol renderizado):
  «La condicion que termina una espera debe ser la misma observacion que
  hacen las aserciones posteriores. Si el test asevera el arbol, espera
  al arbol: esperar a la cache de Query o al contador de un mock y
  consultar el DOM despues introduce una carrera.» En C3, C4, D2 y D3 la
  espera es `await waitFor(() => expect(screen.queryByTestId('<id>')).toHaveTextContent('<literal>'))`,
  con el literal completo (en RNTL 14 `toHaveTextContent` compara el
  texto entero). C5 y D4 esperan al contador de `mockSignOut` y despues
  consultan el boton: es la excepcion justificada por escrito en E1.7
  §Esperas. Copialos literales; no los «arregles».
- `await` en cada `fireEvent` (RNTL 14 es asincrono; sin await la
  asercion lee el arbol viejo y el act abierto contamina el it
  siguiente).
- Mocks compartidos: SOLO `mockResolvedValueOnce`, `mockReturnValueOnce`
  y `mockRejectedValueOnce`, nunca sus formas sin `Once` (X12-X14 lo
  miden). En W2 el rechazo es `signOutGate.reject(new Error('sign-out failed'))`
  sobre la promesa que el helper ya esta esperando: nunca una promesa
  rechazada creada antes de que alguien la espere.
- Valores esperados LITERALES en los tests (`'Cannot reach server'`,
  `'Something went wrong'`, `'Algo salió mal'`), nunca `en[...]`/`es[...]`
  ni un simbolo importado de produccion.
- Imports: ninguno nuevo en los tests (el centro ya importa
  `HeroUINativeProvider`, `ReactNode`, `LanguageProvider` y
  `renderWithProviders`). Nunca `import * as`, nunca una segunda linea
  de import del mismo modulo (`import/no-duplicates`).
- design-drift escanea tambien los tests co-locados: todo `#134` que
  escribas va seguido de ` R<n>` (un `#134` suelto lo caza el guard de
  hex). Los titulos de E1 no llevan `#134`; no se lo anadas. Cero
  `StyleSheet`, cero `queryKey: [`, ninguna cadena con un guion pegado
  a `[`.
- Skills: ninguna de tu plugin expo aplica (solo tests y mutaciones
  temporales, sin UI ni estilos ni peticiones nuevas); no cargues
  ninguna. Di en el impl cuales cargaste (lo esperado: ninguna).
- Ni `bun add`, ni cambios en package.json, bun.lock ni app.json. Todo
  con bun/bunx, nunca npm/npx/pnpm.
- NO lances ./init.sh ni toques Postgres ni LocalStack.
- NO son tuyos, no los toques: progress/history.md, progress/current.md,
  STATUS.md, feature_list.json, los ficheros de la spec salvo las cuatro
  filas de traceability.md, y la ronda 1 del impl. Todo lo que tengas
  que contar va en `## Ronda 2` de
  progress/impl_mobile-alert-ack-outcome-helper.md.
- Si el sandbox te deniega un comando, PARA y reportalo. No lo sustituyas
  por otro que haga lo mismo con otra herramienta.
- NO hagas push ni abras la PR: lo hace el leader al cerrar.

Ficheros que TU cambias de forma neta (5, ni uno mas; helper y pantallas
cambian en los rojos y vuelven a H0 en los verdes):
  mobile-pet-tracker/src/screens/alert-detail/index.test.tsx
  mobile-pet-tracker/src/screens/alerts/index.test.tsx
  mobile-pet-tracker/src/utils/alert-ack-outcome.test.ts
  progress/impl_mobile-alert-ack-outcome-helper.md
  specs/mobile-alert-ack-outcome-helper/traceability.md
Si el leader commitea en mitad (una correccion), solo tocara ficheros
excluidos por los pathspecs de arriba; cualquier otro fichero ajeno en
`git diff --name-only <H0> HEAD` es motivo de parada.

Criterios de aceptacion: requirements.md §Enmienda E1 (E1.1-E1.7) y
tasks.md §Cierre de la ronda 2. No hay prueba de humo.

Al terminar, `## Ronda 2` del impl debe tener: pwd, branch, H0 y status;
el exit de is-ancestor; node_modules; skills cargadas; la salida de
todas las anclas en H0 y al cerrar; la base (7 suites) con su exit; los
8 commits TDD con hash y R-id; por cada rojo, los comandos, las lineas
`Tests:`, los exits y cada it rojo con su matcher y Expected/Received;
cada verde con sus lineas `Tests:`, GUARDAS, typecheck y lint; el
numstat de c7; las 8 sondas; el cierre (7 suites con 267, jest entero
con exit, typecheck, lint --no-cache, numstat, diffs vacios, lista
cerrada); y cualquier decision que la spec no cerrara literalmente.
```

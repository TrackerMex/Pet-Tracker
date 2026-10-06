# Handoff a Codex CLI — #149 mobile-sign-out-lands-on-welcome

> Pegar el bloque de abajo en Codex CLI. La spec está firmada (commit de firma
> `d361a8bb`, aprobación vía Notion el 2026-10-06; el humano confirmó en el
> chat D1 = welcome y D2 = welcome, las recomendadas). Feature móvil sin UI:
> una línea de producción y cuatro ficheros de test. La prueba de humo en el
> dev build de Android (P1-P4, S1-S5) es del humano y cierra la feature.
> Las sondas de mutación M1-M7 de tasks.md las planta el reviewer, no Codex.

---

```
Worktree: /home/claude/sites/Pet-Tracker-wt-backend   <- PRIMERA LINEA. Trabaja AQUI y en ningun otro sitio
Antes de tocar nada, ejecuta `pwd`, `git branch --show-current`,
`git rev-parse --short HEAD` y `git status --short` y pega las cuatro
salidas al principio de progress/impl_mobile-sign-out-lands-on-welcome.md.
El hash es H0 (el commit que anade este handoff): todos los
`git diff --name-only` se miden contra el. PARA si la branch no es
feature/149-mobile-sign-out-lands-on-welcome o si `git status --short` no
sale vacio. No toques /home/claude/sites/Pet-Tracker (alli trabaja otra
sesion en #115), Pet-Tracker-wt-118, Pet-Tracker-wt-146,
Pet-Tracker-wt-148, Pet-Tracker-wt-ui, pet-tracker-43, pt-skills ni ningun
otro worktree, ni cambies de branch en ninguno. node_modules ya esta
instalado.

Feature: mobile-sign-out-lands-on-welcome (#149)
Branch: feature/149-mobile-sign-out-lands-on-welcome
Spec aprobada: specs/mobile-sign-out-lands-on-welcome/requirements.md
(status: approved, firma d361a8bb). D1 y D2 estan decididas (welcome en
las dos): no reabras nada.
Lee tambien, enteros: specs/mobile-sign-out-lands-on-welcome/design.md,
tasks.md y traceability.md. tasks.md es tu guion (T0, R1-R4 rojos, Verde
comun, Cierre). Los titulos de describe e it son LITERALES de tasks.md:
copialos. design.md §Evidencia trae el hallazgo de `await app` (obligatorio
en cada fila de it.each, justo tras renderRouter).

== QUE HACES ==

1. Cuatro commits ROJOS, uno por requisito, en este orden: R1, R2, R3, R4.
2. UN commit VERDE comun: en mobile-pet-tracker/src/app/(tabs)/_layout.tsx,
   `<Redirect href="/login" />` -> `<Redirect href="/welcome" />`. Nada mas:
   sin comentario (R4 contaria un '/login' entre comillas).
3. Un commit final docs con traceability.md y el impl.
El orden importa: el verde es una sola linea que pone en verde R1-R4 a la
vez. Si escribes el verde antes que algun rojo, ese requisito nace verde y
pierde su historial (C4 de CHECKPOINTS.md).

== BASE ==

origin/main = e002a4a5 en H0. Al arrancar: `git fetch origin` y
`git merge-base --is-ancestor origin/main HEAD; echo "exit=$?"`. Anota el
exit en el impl. Si da 1 (otra feature, p. ej. #115, mergeo antes), NO
pares: trabajas sobre H0 igual, y el merge de main en la branch lo hace el
leader al cerrar. Nunca rebasees ni mergees.

Desde mobile-pet-tracker/:
`test ! -e .expo/types/router.d.ts; echo "exit=$?"` -> exit=0 (medido por
el leader en H0). Esta incluido en cada cadena de commit de abajo; si un
dia da 1, PARA y pide al humano que lo borre. Nunca `rm -f` (tu sandbox lo
deniega).

`pgrep -af '[i]nit\.sh'` sin pipe: si sale algo, otra sesion esta usando
la maquina; espera a que salga vacio antes de la suite entera del Cierre.

Base medida por el leader el 2026-10-06 en e002a4a5 (mismo arbol de
mobile-pet-tracker/ que H0), comando de tasks.md T0, sin pipe:
  Test Suites: 6 passed, 6 total
  Tests:       97 passed, 97 total
  exit=0
  Reparto: (tabs)/layout 5, detail-stack.guard 2, reminders-alerts 1,
  index 3, layout raiz 26, design-drift 60.
Tu medida manda: repitela (T0) y anotala en el impl.

== ANCLAS ==

Ejecutalas TODAS desde mobile-pet-tracker/ antes de tocar nada y copia la
salida al impl. Solo estos comandos son anclas; los numeros de linea no lo
son. Si alguna no da EXACTAMENTE lo esperado, PARA y avisa (ante una
diferencia manda el fichero, no el handoff). El leader las ha ejecutado
todas en H0 sacandolas de este mismo fichero.

 0. grep -cF -- '- [x] Aprobado por humano (fecha: 2026-10-06' ../specs/mobile-sign-out-lands-on-welcome/requirements.md   -> 1
 1. grep -cF 'href="/login"' 'src/app/(tabs)/_layout.tsx'   -> 1
 2. grep -cF 'href="/welcome"' 'src/app/(tabs)/_layout.tsx'   -> 0
 3. grep -cF "describe('R1: (tabs) exige sesión'" 'src/app/(tabs)/__tests__/layout.test.tsx'   -> 1
 4. grep -cF "it('redirects an unauthenticated session to login'" 'src/app/(tabs)/__tests__/layout.test.tsx'   -> 1
 5. grep -cF "{ href: '/login' }" 'src/app/(tabs)/__tests__/layout.test.tsx'   -> 1
 6. grep -cF "{ href: '/welcome' }" 'src/app/(tabs)/__tests__/layout.test.tsx'   -> 0
 7. grep -cF "import { router, type Href } from 'expo-router';" src/app/__tests__/detail-stack.guard.test.tsx   -> 1
 8. grep -cF 'const mockAuthListeners = new Set' src/app/__tests__/detail-stack.guard.test.tsx   -> 1
 9. grep -cF 'function rootStack(' src/app/__tests__/detail-stack.guard.test.tsx   -> 1
10. grep -cF "describe('#105 R8: meals history requires a session'" src/app/__tests__/detail-stack.guard.test.tsx   -> 1
11. grep -cF "describe('#95 R3: la guarda protege las seis y deja libres (auth) y reset-password'" src/app/__tests__/detail-stack.guard.test.tsx   -> 1
12. grep -cF "toBe('/login')" src/app/__tests__/detail-stack.guard.test.tsx   -> 4
13. grep -cF "toEqual(['(auth)'])" src/app/__tests__/detail-stack.guard.test.tsx   -> 3
14. grep -cF "['(auth)', 'reset-password']" src/app/__tests__/detail-stack.guard.test.tsx   -> 1
15. grep -cF "['welcome', 'reset-password']" src/app/__tests__/detail-stack.guard.test.tsx   -> 0
16. grep -cF 'await app;' src/app/__tests__/detail-stack.guard.test.tsx   -> 1
17. grep -cF "describe('#114 R2: reminders y alerts se apilan y desapilan sobre (tabs)'" src/app/__tests__/reminders-alerts-stack.navigation.test.tsx   -> 1
18. grep -cF "toBe('/login')" src/app/__tests__/reminders-alerts-stack.navigation.test.tsx   -> 2
19. grep -cF "toEqual(['(auth)'])" src/app/__tests__/reminders-alerts-stack.navigation.test.tsx   -> 2
20. grep -cF "describe('#94 R10" src/__tests__/design-drift.test.ts   -> 1
21. grep -cF 'function allTypeScriptFiles(' src/__tests__/design-drift.test.ts   -> 1
22. grep -cF 'screenSignOutCalls' src/__tests__/design-drift.test.ts   -> 4
23. grep -cF "describe('#149" src/__tests__/design-drift.test.ts   -> 0
24. grep -cF "describe('#149" src/app/__tests__/detail-stack.guard.test.tsx   -> 0

Valores al cerrar (copialos al impl): 1 -> 0, 2 -> 1, 3 -> 1, 4 -> 0,
5 -> 0, 6 -> 1, 7-11 sin cambios, 12 -> 2 (las dos de #105 R8), 13 -> 1
(la de #105 R8), 14 -> 0, 15 -> 1, 16 -> 3 (+1 por el it.each de R2 y +1
por el de R3), 17 sin cambios, 18 -> 0, 19 -> 0, 20-22 sin cambios,
23 -> 1, 24 -> 2. Y en positivo al cerrar:
  grep -cF "it('#149 R1: redirects an unauthenticated session to welcome'" 'src/app/(tabs)/__tests__/layout.test.tsx'   -> 1
  grep -cF "describe('#149 R2: cerrar sesión en una tab aterriza en welcome'" src/app/__tests__/detail-stack.guard.test.tsx   -> 1
  grep -cF "describe('#149 R3: cerrar sesión en un detalle aterriza en welcome'" src/app/__tests__/detail-stack.guard.test.tsx   -> 1
  grep -cF "describe('#149 R4: solo cuatro ficheros de producción navegan a login'" src/__tests__/design-drift.test.ts   -> 1

== COMMITS ==

Todo desde mobile-pet-tracker/. Cada commit va ENCADENADO con && a su
verificacion: si cualquier eslabon falla, el commit no se hace. Nunca
commitees fuera de estas cadenas ni con un exit distinto de 0 en la cadena
(en #115 se commiteo un verde con el registrador en exit=1). Si una cadena
no llega al commit, PARA y reporta en el impl el eslabon que fallo y la
salida.

Mide SIN pipe (`cmd | tail` devuelve el exit de tail). FORCE_COLOR=0 hace
que la linea de resumen de jest sea texto plano (formato medido por el
leader: `Tests:       1 skipped, 1 passed, 2 total`).

Rojos: cada uno cae EXACTAMENTE como dice tasks.md, por ASERCION (Expected
/Received). Nunca por SyntaxError, ReferenceError, TypeError, import roto
o fallo de typecheck. La cadena comprueba la cuenta; tu ademas abres el
log y copias al impl cada it rojo con su matcher, Expected y Received.

R1 rojo (tasks.md §R1):
  FORCE_COLOR=0 bunx jest 'src/app/\(tabs\)/__tests__/layout.test.tsx' > /tmp/149-r1.txt 2>&1; echo "exit=$?"
    -> exit=1 y `Tests:       1 failed, 4 passed, 5 total`
  grep -qE '^Tests: +1 failed, 4 passed, 5 total$' /tmp/149-r1.txt \
    && ! grep -qE 'TypeError|ReferenceError|SyntaxError|Cannot find module' /tmp/149-r1.txt \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bun run lint \
    && git add 'src/app/(tabs)/__tests__/layout.test.tsx' \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/app/(tabs)/__tests__/layout.test.tsx' \
    && git commit -m 'test(mobile-auth): #149 R1 red, tabs layout redirects to welcome'

R2 rojo (tasks.md §R2; describe nuevo AL FINAL de detail-stack.guard):
  FORCE_COLOR=0 bunx jest src/app/__tests__/detail-stack.guard.test.tsx -t '#149 R2' > /tmp/149-r2.txt 2>&1; echo "exit=$?"
    -> exit=1 y `Tests:       5 failed, 2 skipped, 7 total`
       (cada fila: waitFor agota con Expected "/welcome", Received "/login")
  grep -qE '^Tests: +5 failed, 2 skipped, 7 total$' /tmp/149-r2.txt \
    && ! grep -qE 'TypeError|ReferenceError|SyntaxError|Cannot find module' /tmp/149-r2.txt \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bun run lint \
    && git add src/app/__tests__/detail-stack.guard.test.tsx \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/app/__tests__/detail-stack.guard.test.tsx' \
    && git commit -m 'test(mobile-auth): #149 R2 red, sign-out from every tab lands on welcome'

R3 rojo (tasks.md §R3; describe nuevo tras el de R2, mas el reapunte de
#95 R3 y #114 R2; #105 R8 NO se toca):
  FORCE_COLOR=0 bunx jest src/app/__tests__/detail-stack.guard.test.tsx src/app/__tests__/reminders-alerts-stack.navigation.test.tsx > /tmp/149-r3.txt 2>&1; echo "exit=$?"
    -> exit=1 y `Tests:       19 failed, 1 passed, 20 total`
       (5 de R2 + 12 de R3 + #95 R3 + #114 R2; el que pasa es #105 R8)
  grep -qE '^Tests: +19 failed, 1 passed, 20 total$' /tmp/149-r3.txt \
    && ! grep -qE 'TypeError|ReferenceError|SyntaxError|Cannot find module' /tmp/149-r3.txt \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bun run lint \
    && git add src/app/__tests__/detail-stack.guard.test.tsx src/app/__tests__/reminders-alerts-stack.navigation.test.tsx \
    && test "$(git diff --cached --name-only | sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/app/__tests__/detail-stack.guard.test.tsx mobile-pet-tracker/src/app/__tests__/reminders-alerts-stack.navigation.test.tsx ' \
    && git commit -m 'test(mobile-auth): #149 R3 red, sign-out from every detail lands on welcome'
  Tras el commit, anclas 12-15, 18 y 19 con sus valores de cierre.

R4 rojo (tasks.md §R4; describe nuevo AL FINAL de design-drift, misma
forma que #94 R10, mapa literal de 4 claves, no importado de produccion):
  FORCE_COLOR=0 bunx jest src/__tests__/design-drift.test.ts -t '#149 R4' > /tmp/149-r4.txt 2>&1; echo "exit=$?"
    -> exit=1 y `Tests:       1 failed, 60 skipped, 61 total`
       (el diff de toEqual muestra SOLO la clave sobrante
       "app/(tabs)/_layout.tsx": 1; si muestra otra, PARA)
  grep -qE '^Tests: +1 failed, 60 skipped, 61 total$' /tmp/149-r4.txt \
    && ! grep -qE 'TypeError|ReferenceError|SyntaxError|Cannot find module' /tmp/149-r4.txt \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bun run lint \
    && git add src/__tests__/design-drift.test.ts \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/__tests__/design-drift.test.ts' \
    && git commit -m 'test(mobile-auth): #149 R4 red, only four production files route to login'

Control antes del verde (sin commit): el comando de T0 debe dar exit=1 y
`Tests:       21 failed, 94 passed, 115 total` (1 + 5 + 12 + 2 + 1).

Verde comun:
  FORCE_COLOR=0 bunx jest 'src/app/\(tabs\)/__tests__/layout.test.tsx' src/app/__tests__/detail-stack.guard.test.tsx src/app/__tests__/reminders-alerts-stack.navigation.test.tsx src/app/__tests__/index.test.tsx src/app/__tests__/layout.test.tsx src/__tests__/design-drift.test.ts > /tmp/149-green.txt 2>&1 \
    && grep -qE '^Test Suites: +6 passed, 6 total$' /tmp/149-green.txt \
    && grep -qE '^Tests: +115 passed, 115 total$' /tmp/149-green.txt \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bun run lint \
    && git add 'src/app/(tabs)/_layout.tsx' \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/app/(tabs)/_layout.tsx' \
    && git commit -m 'fix(mobile-auth): #149 R1-R4 green, sign-out lands on welcome'
  Reparto esperado: (tabs)/layout 5, guarda 19, reminders-alerts 1,
  index 3, layout raiz 26, design-drift 61.

== CIERRE ==

Desde mobile-pet-tracker/, sin pipe, con salida al impl:
- `pgrep -af '[i]nit\.sh'` vacio; despues
  `FORCE_COLOR=0 bunx jest > /tmp/149-all.txt 2>&1; echo "exit=$?"` -> exit=0.
  Copia las lineas `Test Suites:` y `Tests:`. Mientras corre, no lances
  otra cosa.
- NR1-NR5, tasks.md §Cierre:
  git diff --stat e002a4a5 -- src/app/index.tsx src/app/_layout.tsx src/app/__tests__/index.test.tsx src/app/__tests__/layout.test.tsx src/screens/welcome src/i18n src/providers package.json bun.lock
    -> vacio
Desde la raiz del repo:
  git diff --stat e002a4a5 -- backend-pet-tracker/ infra-pet-tracker/   -> vacio
  git diff --name-only e002a4a5 HEAD -- mobile-pet-tracker/   -> exactamente los 5 de mobile-pet-tracker/ de la lista de abajo

Despues rellena specs/mobile-sign-out-lands-on-welcome/traceability.md
(hash + mensaje de rojo y verde por R1-R4; la fila Smoke se queda como
esta, es del humano) y termina el impl. Commit final, desde la raiz:
  git add specs/mobile-sign-out-lands-on-welcome/traceability.md progress/impl_mobile-sign-out-lands-on-welcome.md \
    && test "$(git diff --cached --name-only | sort | tr '\n' ' ')" = 'progress/impl_mobile-sign-out-lands-on-welcome.md specs/mobile-sign-out-lands-on-welcome/traceability.md ' \
    && git commit -m 'docs(mobile-sign-out-lands-on-welcome): trace #149 R1-R4'
Y la lista cerrada, con salida al impl:
  git diff --name-only H0 HEAD -- . ':!feature_list.json' ':!progress/current.md' ':!progress/handoff_mobile-sign-out-lands-on-welcome.md' ':!specs/mobile-sign-out-lands-on-welcome/requirements.md' ':!specs/mobile-sign-out-lands-on-welcome/design.md' ':!specs/mobile-sign-out-lands-on-welcome/tasks.md'
    -> exactamente los 7 ficheros de abajo
No rebasees despues de escribir hashes.

== REGLAS CRITICAS ==

- Convenciones: docs/conventions.md, en particular §Tests y §Esperas sobre
  el arbol renderizado. Aqui se espera al estado del router
  (`waitFor(() => expect(app.getPathname()).toBe(...))`), nunca al
  contador de un mock. La pila (`rootStack(app)`) se asevera DESPUES de
  que el waitFor del pathname haya pasado.
- Forma de cada fila de it.each (R2 y R3): `const app = renderRouter(...)`
  y en la linea siguiente `await app;`. Sin el, la fila N lee el pathname
  de la fila N-1 (design.md §Evidencia). Cada describe nuevo lleva su
  `afterEach(() => jest.useRealTimers())`. Cerrar sesion se hace igual que
  en #95 R3: asignar `mockAuthState = { status: 'unauthenticated', token: null }`
  y, dentro de `await act(async () => { ... })`, llamar a cada funcion de
  `mockAuthListeners`. Cero mocks nuevos: reutiliza los del fichero,
  `routes()` y `rootStack()`.
- Jest: los parentesis de `(tabs)` van ESCAPADOS en los patrones
  (`'src/app/\(tabs\)/...'`); sin escapar, jest los lee como regex, se
  salta el fichero y sale con 0. Tras cada comando, el numero de suites
  de `Test Suites:` debe ser el de ficheros pedidos.
- Skills: NO cargues ninguna skill de expo; no hay ninguna para esto. Es
  navegacion de expo-router en tests de jest, y tu plugin expo (1.0.2, 13
  skills) no trae ninguna de router; la guia que necesitas esta escrita en
  tasks.md y design.md. Tampoco hace falta ninguna del repo
  (.agents/skills/): no cambia ninguna pantalla (NR6). Di en el impl que
  no cargaste ninguna, o cual cargaste si lo hiciste.
- docs/ui-guidelines.md: ningun fichero de UI cambia (NR6), asi que el
  grep-clean y las dimensiones no aplican.
- Ni `bun add`, ni cambios en package.json, bun.lock ni app.json. Todo
  con bun/bunx, nunca npm/npx.
- NO lances ./init.sh ni toques Postgres ni LocalStack: los comparten
  otras sesiones y el gate lo corre el leader.
- No toques ningun fichero fuera de la lista de abajo. En particular, NO:
  src/app/_layout.tsx, src/app/index.tsx, src/app/__tests__/index.test.tsx,
  src/app/__tests__/layout.test.tsx, src/screens/ (ninguna pantalla, ni
  welcome ni profile), src/providers/, src/i18n/, src/__tests__/ui-copy-table.ts,
  src/__tests__/ui-language.test.ts, el inventario screenSignOutCalls de
  design-drift, ni el describe #105 R8 de la guarda.
- NO son tuyos, no los toques: progress/history.md, progress/current.md,
  STATUS.md, feature_list.json, y las casillas de §Prueba de humo y
  §Aprobacion de requirements.md. Los escribe el leader o el humano. Todo
  lo que tengas que contar va en progress/impl_mobile-sign-out-lands-on-welcome.md.
- Si el sandbox te deniega un comando, PARA y reportalo. No lo sustituyas
  por otro que haga lo mismo con otra herramienta.
- NO hagas push ni abras la PR: lo hace el leader al cerrar.

Ficheros que TU cambias (7, ni uno mas):
  mobile-pet-tracker/src/app/(tabs)/_layout.tsx
  mobile-pet-tracker/src/app/(tabs)/__tests__/layout.test.tsx
  mobile-pet-tracker/src/app/__tests__/detail-stack.guard.test.tsx
  mobile-pet-tracker/src/app/__tests__/reminders-alerts-stack.navigation.test.tsx
  mobile-pet-tracker/src/__tests__/design-drift.test.ts
  specs/mobile-sign-out-lands-on-welcome/traceability.md
  progress/impl_mobile-sign-out-lands-on-welcome.md
Si el leader commitea en mitad (una correccion), solo tocara ficheros
excluidos por los pathspecs de arriba; cualquier otro fichero ajeno en
`git diff --name-only H0 HEAD` es motivo de parada.

Criterios de aceptacion: R1-R4 de requirements.md, con NR1-NR6 sin diff.
La prueba de humo (P1-P4, S1-S5) es del humano: no la marques.

Al terminar, progress/impl_mobile-sign-out-lands-on-welcome.md debe tener:
pwd, branch, H0 y status; el exit de is-ancestor; skills cargadas (o
ninguna); la salida de las 25 anclas en H0 y la de cierre (mas las 4
positivas); la base de T0 con su exit; los commits con hash y R-id; por
cada rojo, el comando, la linea `Tests:`, el exit y cada it rojo con su
matcher, Expected y Received; el control antes del verde; el verde con
su reparto por suite, typecheck y lint; el cierre (jest entero con exit,
NR1-NR5, backend/infra vacios, lista cerrada); y cualquier decision que
la spec no cerrara literalmente.
```

---

## Corrección 1 — Enmienda E1 (firma `25f3664d`)

> Codex paró en el verde común: la guarda dio 17 fallos con
> `Received: "/reset-password"` en el primer `waitFor`. Causa medida por el
> leader en un spike: el `it` de `#95 R3` no hace `await app;` y su router se
> filtra a los `it` siguientes. Defecto de la spec, no de Codex. La Enmienda E1
> (`requirements.md` y `tasks.md` §Enmienda E1) añade esa línea en un rojo
> nuevo. Producción y cifras no cambian. Pegar en Codex **solo** el bloque de
> abajo: retoma donde paró, con el mismo contexto de arriba. H1 = el commit que
> añade esta sección. El leader ejecutó las anclas C0-C9 sobre el árbol de
> `25f3664d` (igual al de H1 en `mobile-pet-tracker/` y `specs/`).

```
Worktree: /home/claude/sites/Pet-Tracker-wt-backend   <- PRIMERA LINEA. Trabaja AQUI y en ningun otro sitio
Retomas #149 donde paraste (impl, §Estado al parar). Lee entero
progress/handoff_mobile-sign-out-lands-on-welcome.md: todo lo de arriba
sigue vigente (reglas criticas, 7 ficheros, cadenas, cierre) salvo lo que
cambia esta correccion. Lee tambien la §Enmienda E1 de
specs/mobile-sign-out-lands-on-welcome/requirements.md y la de tasks.md.

Antes de tocar nada, ejecuta `pwd`, `git branch --show-current`,
`git rev-parse --short HEAD` y `git status --short` y pega las cuatro
salidas en el impl bajo un titulo nuevo `## Correccion 1`. El hash es H1.
`git status --short` debe dar EXACTAMENTE estas dos lineas:
   M mobile-pet-tracker/src/app/(tabs)/_layout.tsx
  ?? progress/impl_mobile-sign-out-lands-on-welcome.md
Si da otra cosa, o la branch no es feature/149-mobile-sign-out-lands-on-welcome,
PARA. H0 sigue siendo a8118da0 para la lista cerrada del Cierre.
`git fetch origin` y `git merge-base --is-ancestor origin/main HEAD; echo "exit=$?"`
al impl; igual que arriba, si da 1 no pares.

Por que: el it de #95 R3 llama a renderRouter sin `await app;` y su
router se filtra a todos los it siguientes del fichero. Tu rojo de R3
(e414fa6f) cayo en el primer waitFor por esa fuga, no por la asercion,
y el verde dio 17 fallos por lo mismo. No es error tuyo: la spec solo
pedia el await en las filas nuevas. NO reescribas commits ya hechos
(ni rebase, ni amend, ni reset).

== PASO 0: descartar la linea verde sin commitear ==

Desde mobile-pet-tracker/:
  git checkout HEAD -- 'src/app/(tabs)/_layout.tsx' && git diff --quiet && git diff --cached --quiet && grep -cF 'href="/login"' 'src/app/(tabs)/_layout.tsx'
    -> imprime 1 (y la cadena sale con exit 0)
Esa linea vuelve en el verde comun, que no cambia.

== ANCLAS C0-C9 (tras el paso 0, desde mobile-pet-tracker/) ==

Copia la salida al impl. Si alguna no da EXACTAMENTE lo esperado, PARA.
C0. grep -cF -- '- [x] Enmienda E1 aprobada por humano (fecha: 2026-10-06' ../specs/mobile-sign-out-lands-on-welcome/requirements.md   -> 1
C1. grep -cF 'href="/login"' 'src/app/(tabs)/_layout.tsx'   -> 1
C2. grep -cF 'href="/welcome"' 'src/app/(tabs)/_layout.tsx'   -> 0
C3. grep -cF 'await app;' src/app/__tests__/detail-stack.guard.test.tsx   -> 3
C4. grep -cF 'renderRouter(' src/app/__tests__/detail-stack.guard.test.tsx   -> 4
C5. grep -A1 -F 'renderRouter(' src/app/__tests__/detail-stack.guard.test.tsx | grep -cF 'await app;'   -> 3
C6. grep -cF "const app = renderRouter(routes(), { initialUrl: '/home' });" src/app/__tests__/detail-stack.guard.test.tsx   -> 2
C7. grep -cF "describe('#95 R3: la guarda protege las seis y deja libres (auth) y reset-password'" src/app/__tests__/detail-stack.guard.test.tsx   -> 1
C8. git log --format=%s e002a4a5..HEAD | grep -cE '^test\(mobile-auth\): #149 R[1-4] red'   -> 4
C9. git log --format=%s e002a4a5..HEAD | grep -cE '^fix\(mobile-auth\): #149'   -> 0
C6 da 2: la primera aparicion es la de #95 R3 (sin await); la segunda es
la de #149 R3 y ya lleva su await. Tras E1: C3 -> 4, C4 -> 4, C5 -> 4,
C6 -> 2.

== E1: ROJO NUEVO ==

En describe('#95 R3: la guarda protege las seis y deja libres (auth) y reset-password')
de src/app/__tests__/detail-stack.guard.test.tsx, en la linea siguiente a
`const app = renderRouter(routes(), { initialUrl: '/home' });` anade
`await app;` (misma indentacion). Nada mas: ni en ese it, ni en #105 R8,
ni en los describe de #149, ni en ningun otro fichero.

  FORCE_COLOR=0 bunx jest src/app/__tests__/detail-stack.guard.test.tsx > /tmp/149-e1.txt 2>&1; echo "exit=$?"
    -> exit=1 y `Tests:       18 failed, 1 passed, 19 total`
       (5 de R2 + 12 de R3 + #95 R3, todos Expected "/welcome",
       Received "/login"; el que pasa es #105 R8)
  grep -qE '^Tests: +18 failed, 1 passed, 19 total$' /tmp/149-e1.txt \
    && test "$(grep -cF 'Expected: "/welcome"' /tmp/149-e1.txt)" = 18 \
    && test "$(grep -cF 'Received: "/login"' /tmp/149-e1.txt)" = 18 \
    && test "$(grep -cE '^ +Expected:' /tmp/149-e1.txt)" = 18 \
    && ! grep -qE 'TypeError|ReferenceError|SyntaxError|Cannot find module' /tmp/149-e1.txt \
    && test "$(grep -A1 -F 'renderRouter(' src/app/__tests__/detail-stack.guard.test.tsx | grep -cF 'await app;')" = 4 \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bun run lint \
    && git add src/app/__tests__/detail-stack.guard.test.tsx \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/app/__tests__/detail-stack.guard.test.tsx' \
    && git commit -m 'test(mobile-auth): #149 R2-R3 red, await the #95 R3 render'
  Al impl: el comando, la linea `Tests:`, el exit y cada uno de los 18 it
  rojos con su matcher, Expected y Received.

== CONTROL, VERDE Y CIERRE ==

Control antes del verde (sin commit): el comando de T0 debe dar exit=1 y
`Tests:       21 failed, 94 passed, 115 total`, como arriba.

Verde comun: la cadena "Verde comun" de §COMMITS de arriba, SIN cambios
(rehaces la linea de produccion `href="/login"` -> `href="/welcome"`).
Reparto esperado igual: guarda 19.

Cierre: igual que §CIERRE de arriba, con dos cambios:
- En los "Valores al cerrar" de §ANCLAS, el ancla 16 cierra en 4 (no 3):
  las dos filas nuevas mas #105 R8 mas #95 R3.
- En traceability.md, R2 y R3 citan DOS rojos: el suyo (6314f88f para R2,
  e414fa6f para R3) y el de E1, con hash y mensaje.
La lista cerrada sigue en 7 ficheros contra H0 = a8118da0, con los mismos
pathspecs de exclusion (los commits del leader 980e20bf, b4935fed,
25f3664d y H1 solo tocan ficheros excluidos).

El impl suma, bajo `## Correccion 1`: pwd, branch, H1 y status; el exit
de is-ancestor; la salida del paso 0; C0-C9 antes y C3-C6 despues de E1;
el rojo de E1 completo; y luego control, verde y cierre como pide el
final del bloque de arriba. No borres lo que ya escribiste.
```

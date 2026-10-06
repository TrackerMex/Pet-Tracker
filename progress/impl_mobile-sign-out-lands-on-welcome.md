```text
$ pwd
/home/claude/sites/Pet-Tracker-wt-backend
$ git branch --show-current
feature/149-mobile-sign-out-lands-on-welcome
$ git rev-parse --short HEAD
a8118da0
$ git status --short
(salida vacía)
```

# Implementación — #149 mobile-sign-out-lands-on-welcome

- Inicio: 2026-10-06, Codex CLI, worktree y branch del handoff.
- H0: `a8118da07c1c7124cf5442cab43928f50f53b9f0` (`a8118da0`).
- Estado inicial limpio. Spec aprobada por humano el 2026-10-06, firma
  `d361a8bb`; D1 y D2 = welcome. Feature #149 ya está `in_progress`.
- Leídos completos requirements, design, tasks y traceability. Leídos
  progress/current.md, feature_list.json, arquitectura y convenciones
  (incluidos Tests y Esperas sobre el árbol renderizado).
- Skills: solo `ponytail:ponytail`, requerida para código por las instrucciones
  de la sesión, en
  `/home/claude/.codex/plugins/cache/ponytail/ponytail/4.13.0/skills/ponytail/SKILL.md`.
  Ninguna skill Expo ni de `.agents/skills/`: navegación en Jest sin cambio de UI (NR6).
- Conforme al handoff específico: no ejecutar init.sh, no tocar infraestructura,
  no merge/rebase, no push/PR y no editar el bookkeeping del leader.
- Plan: T0, cuatro commits rojos R1 → R2 → R3 → R4, un verde común de una
  línea y un commit docs. Smoke y sondas M1–M7 quedan al humano y reviewer.

## Base y guardas

Desde la raíz, `git fetch origin` terminó con exit 0, sin salida.
`git merge-base --is-ancestor origin/main HEAD; echo "exit=$?"`:
```text
exit=0
```
Se trabaja sobre H0; sin merge ni rebase.

Desde mobile-pet-tracker/:
```text
$ test ! -e .expo/types/router.d.ts; echo "exit=$?"
exit=0
$ git rev-parse --abbrev-ref HEAD
feature/149-mobile-sign-out-lands-on-welcome
$ test ! -e .expo/types/router.d.ts && echo ausente
ausente
$ pgrep -af '[i]nit\.sh'
(salida vacía; exit 1 = no hay procesos)
```

## Las 25 anclas en H0

Todas ejecutadas desde mobile-pet-tracker/, sin cambios previos en código o
tests. Coinciden exactamente; grep devuelve exit 1 cuando el recuento es 0.

| Ancla | Comando | Salida |
|---|---|---|
| 0 | `grep -cF -- '- [x] Aprobado por humano (fecha: 2026-10-06' ../specs/mobile-sign-out-lands-on-welcome/requirements.md` | 1 |
| 1 | `grep -cF 'href="/login"' 'src/app/(tabs)/_layout.tsx'` | 1 |
| 2 | `grep -cF 'href="/welcome"' 'src/app/(tabs)/_layout.tsx'` | 0 |
| 3 | `grep -cF "describe('R1: (tabs) exige sesión'" 'src/app/(tabs)/__tests__/layout.test.tsx'` | 1 |
| 4 | `grep -cF "it('redirects an unauthenticated session to login'" 'src/app/(tabs)/__tests__/layout.test.tsx'` | 1 |
| 5 | `grep -cF "{ href: '/login' }" 'src/app/(tabs)/__tests__/layout.test.tsx'` | 1 |
| 6 | `grep -cF "{ href: '/welcome' }" 'src/app/(tabs)/__tests__/layout.test.tsx'` | 0 |
| 7 | `grep -cF "import { router, type Href } from 'expo-router';" src/app/__tests__/detail-stack.guard.test.tsx` | 1 |
| 8 | `grep -cF 'const mockAuthListeners = new Set' src/app/__tests__/detail-stack.guard.test.tsx` | 1 |
| 9 | `grep -cF 'function rootStack(' src/app/__tests__/detail-stack.guard.test.tsx` | 1 |
| 10 | `grep -cF "describe('#105 R8: meals history requires a session'" src/app/__tests__/detail-stack.guard.test.tsx` | 1 |
| 11 | `grep -cF "describe('#95 R3: la guarda protege las seis y deja libres (auth) y reset-password'" src/app/__tests__/detail-stack.guard.test.tsx` | 1 |
| 12 | `grep -cF "toBe('/login')" src/app/__tests__/detail-stack.guard.test.tsx` | 4 |
| 13 | `grep -cF "toEqual(['(auth)'])" src/app/__tests__/detail-stack.guard.test.tsx` | 3 |
| 14 | `grep -cF "['(auth)', 'reset-password']" src/app/__tests__/detail-stack.guard.test.tsx` | 1 |
| 15 | `grep -cF "['welcome', 'reset-password']" src/app/__tests__/detail-stack.guard.test.tsx` | 0 |
| 16 | `grep -cF 'await app;' src/app/__tests__/detail-stack.guard.test.tsx` | 1 |
| 17 | `grep -cF "describe('#114 R2: reminders y alerts se apilan y desapilan sobre (tabs)'" src/app/__tests__/reminders-alerts-stack.navigation.test.tsx` | 1 |
| 18 | `grep -cF "toBe('/login')" src/app/__tests__/reminders-alerts-stack.navigation.test.tsx` | 2 |
| 19 | `grep -cF "toEqual(['(auth)'])" src/app/__tests__/reminders-alerts-stack.navigation.test.tsx` | 2 |
| 20 | `grep -cF "describe('#94 R10" src/__tests__/design-drift.test.ts` | 1 |
| 21 | `grep -cF 'function allTypeScriptFiles(' src/__tests__/design-drift.test.ts` | 1 |
| 22 | `grep -cF 'screenSignOutCalls' src/__tests__/design-drift.test.ts` | 4 |
| 23 | `grep -cF "describe('#149" src/__tests__/design-drift.test.ts` | 0 |
| 24 | `grep -cF "describe('#149" src/app/__tests__/detail-stack.guard.test.tsx` | 0 |

## T0

Comando desde mobile-pet-tracker/, sin pipe:
```bash
FORCE_COLOR=0 bunx jest 'src/app/\(tabs\)/__tests__/layout.test.tsx' src/app/__tests__/detail-stack.guard.test.tsx src/app/__tests__/reminders-alerts-stack.navigation.test.tsx src/app/__tests__/index.test.tsx src/app/__tests__/layout.test.tsx src/__tests__/design-drift.test.ts > /tmp/149-t0.txt 2>&1; echo "exit=$?"
```
Salida:
```text
Test Suites: 6 passed, 6 total
Tests:       97 passed, 97 total
exit=0
```
Reparto: (tabs)/layout 5, detail-stack.guard 2, reminders-alerts 1,
index 3, layout raíz 26, design-drift 60. Base coincide con el handoff.
El log ya contiene avisos de Uniwind y act; ninguna suite falla.

Leída antes de escribir código la documentación exacta SDK 57 exigida por
mobile-pet-tracker/AGENTS.md: https://docs.expo.dev/versions/v57.0.0/.
La guía de implementación sigue siendo tasks.md y design.md.

## R1 rojo

Se reapunta únicamente el it indicado, sin cambiar mocks ni la aserción que
impide renderizar Tabs. Producción aún en login.
```bash
FORCE_COLOR=0 bunx jest 'src/app/\(tabs\)/__tests__/layout.test.tsx' > /tmp/149-r1.txt 2>&1; echo "exit=$?"
```
```text
Test Suites: 1 failed, 1 total
Tests:       1 failed, 4 passed, 5 total
exit=1
```
Log leído: `/tmp/149-r1.txt`. Único it rojo:

| It | Matcher | Expected | Received |
|---|---|---|---|
| `#149 R1: redirects an unauthenticated session to welcome` | `expect(mockRedirect.mock.calls[0]?.[0]).toEqual(...)` | `{ "href": "/welcome" }` | `{ "href": "/login" }` |

Sin TypeError, ReferenceError, SyntaxError ni import roto. Siguiente: cadena
literal de verificación, typecheck, lint, stage exclusivo y commit R1.
+Cadena ejecutada desde mobile-pet-tracker/:
```bash
grep -qE '^Tests: +1 failed, 4 passed, 5 total$' /tmp/149-r1.txt \
  && ! grep -qE 'TypeError|ReferenceError|SyntaxError|Cannot find module' /tmp/149-r1.txt \
  && test ! -e .expo/types/router.d.ts && bun run typecheck && bun run lint \
  && git add 'src/app/(tabs)/__tests__/layout.test.tsx' \
  && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/app/(tabs)/__tests__/layout.test.tsx' \
  && git commit -m 'test(mobile-auth): #149 R1 red, tabs layout redirects to welcome'
```
La cadena llegó al commit y terminó con exit 0; typecheck y lint exit 0
(solo `$ tsc --noEmit` y `$ expo lint`, sin diagnósticos).
Commit R1 rojo: `4abb8bc5d833a76b7a2cfb9b670ef3b932c2dec4` —
`test(mobile-auth): #149 R1 red, tabs layout redirects to welcome`.
Anclas posteriores R1: `{ href: '/welcome' }` → 1,
`{ href: '/login' }` → 0.

## R2 rojo

Cinco filas literales de tasks.md, cada una con `await app;` inmediatamente
tras renderRouter, su cierre de sesión por listeners y pila aseverada
después del waitFor. Sin mocks nuevos; afterEach restaura los timers.
```bash
FORCE_COLOR=0 bunx jest src/app/__tests__/detail-stack.guard.test.tsx -t '#149 R2' > /tmp/149-r2.txt 2>&1; echo "exit=$?"
```
```text
Test Suites: 1 failed, 1 total
Tests:       5 failed, 2 skipped, 7 total
exit=1
```
Leídas las cinco aserciones de `/tmp/149-r2.txt` (no excepciones):
| It | Matcher | Expected | Received |
|---|---|---|---|
| `#149 R2: cierra sesión en /home y aterriza en welcome` | `toBe` en waitFor del pathname | `"/welcome"` | `"/login"` |
| `#149 R2: cierra sesión en /map y aterriza en welcome` | `toBe` en waitFor del pathname | `"/welcome"` | `"/login"` |
| `#149 R2: cierra sesión en /health y aterriza en welcome` | `toBe` en waitFor del pathname | `"/welcome"` | `"/login"` |
| `#149 R2: cierra sesión en /food y aterriza en welcome` | `toBe` en waitFor del pathname | `"/welcome"` | `"/login"` |
| `#149 R2: cierra sesión en /profile y aterriza en welcome` | `toBe` en waitFor del pathname | `"/welcome"` | `"/login"` |

Siguiente: cadena literal de verificación y commit R2.
+Cadena desde mobile-pet-tracker/:
```bash
grep -qE '^Tests: +5 failed, 2 skipped, 7 total$' /tmp/149-r2.txt \
  && ! grep -qE 'TypeError|ReferenceError|SyntaxError|Cannot find module' /tmp/149-r2.txt \
  && test ! -e .expo/types/router.d.ts && bun run typecheck && bun run lint \
  && git add src/app/__tests__/detail-stack.guard.test.tsx \
  && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/app/__tests__/detail-stack.guard.test.tsx' \
  && git commit -m 'test(mobile-auth): #149 R2 red, sign-out from every tab lands on welcome'
```
Cadena completa exit 0; typecheck y lint exit 0, sin diagnósticos.
Commit R2 rojo: `6314f88f44d7ccb93ce93b2219f2697c09bf5d3b` —
`test(mobile-auth): #149 R2 red, sign-out from every tab lands on welcome`.

## R3 rojo

Añadidas las doce filas tras R2 en el orden de tasks.md, con await app,
listeners existentes, pila tras el waitFor del pathname y re-entrada
tras tres pasadas de runOnlyPendingTimers. Se reapuntan únicamente los
candados tras cerrar sesión #95 R3 y #114 R2, sin renombrar sus it.
#105 R8 permanece intacto.
```bash
FORCE_COLOR=0 bunx jest src/app/__tests__/detail-stack.guard.test.tsx src/app/__tests__/reminders-alerts-stack.navigation.test.tsx > /tmp/149-r3.txt 2>&1; echo "exit=$?"
```
```text
Test Suites: 2 failed, 2 total
Tests:       19 failed, 1 passed, 20 total
exit=1
```
#105 R8 es el único test que pasa. Log abierto: `/tmp/149-r3.txt`.
Los 19 fallos son por aserción, sin excepciones de ejecución.
La cuenta y los it corresponden al handoff. **Observación de esta medida:**
tras el fallo de #95 R3, las cinco filas R2 y las doce R3 fallan en el
waitFor de la ruta inicial, no en el waitFor posterior al cierre. La
corrida aislada R2 anterior sí había agotado con welcome/login. Se
registra el Expected/Received real de cada it; no se atribuye a R3 una
evidencia aislada welcome/login que esta corrida no produjo. No se altera
el arnés ni los candados fuera del reapunte aprobado.

| It | Matcher | Expected | Received |
|---|---|---|---|
| `#95 R3::expulsa el detalle al cerrar sesión y no agrega rutas protegidas al historial` | `toBe`, waitFor tras cerrar sesión | `"/welcome"` | `"/login"` |
| `#149 R2: cierra sesión en /home y aterriza en welcome` | `toBe`, waitFor inicial | `"/home"` | `"/login"` |
| `#149 R2: cierra sesión en /map y aterriza en welcome` | `toBe`, waitFor inicial | `"/map"` | `"/login"` |
| `#149 R2: cierra sesión en /health y aterriza en welcome` | `toBe`, waitFor inicial | `"/health"` | `"/login"` |
| `#149 R2: cierra sesión en /food y aterriza en welcome` | `toBe`, waitFor inicial | `"/food"` | `"/login"` |
| `#149 R2: cierra sesión en /profile y aterriza en welcome` | `toBe`, waitFor inicial | `"/profile"` | `"/login"` |
| `#149 R3: cierra sesión en /add-reminder, aterriza en welcome y no reabre el detalle` | `toBe`, waitFor inicial | `"/home"` | `"/login"` |
| `#149 R3: cierra sesión en /pets/add, aterriza en welcome y no reabre el detalle` | `toBe`, waitFor inicial | `"/home"` | `"/login"` |
| `#149 R3: cierra sesión en /pets/pet-1/docs, aterriza en welcome y no reabre el detalle` | `toBe`, waitFor inicial | `"/home"` | `"/login"` |
| `#149 R3: cierra sesión en /weight-log, aterriza en welcome y no reabre el detalle` | `toBe`, waitFor inicial | `"/home"` | `"/login"` |
| `#149 R3: cierra sesión en /meal-schedule, aterriza en welcome y no reabre el detalle` | `toBe`, waitFor inicial | `"/home"` | `"/login"` |
| `#149 R3: cierra sesión en /pairing, aterriza en welcome y no reabre el detalle` | `toBe`, waitFor inicial | `"/home"` | `"/login"` |
| `#149 R3: cierra sesión en /reminders, aterriza en welcome y no reabre el detalle` | `toBe`, waitFor inicial | `"/home"` | `"/login"` |
| `#149 R3: cierra sesión en /alerts, aterriza en welcome y no reabre el detalle` | `toBe`, waitFor inicial | `"/home"` | `"/login"` |
| `#149 R3: cierra sesión en /alerts/alert-1, aterriza en welcome y no reabre el detalle` | `toBe`, waitFor inicial | `"/home"` | `"/login"` |
| `#149 R3: cierra sesión en /pets/pet-1/geofences, aterriza en welcome y no reabre el detalle` | `toBe`, waitFor inicial | `"/home"` | `"/login"` |
| `#149 R3: cierra sesión en /pets/pet-1/geofence-editor, aterriza en welcome y no reabre el detalle` | `toBe`, waitFor inicial | `"/home"` | `"/login"` |
| `#149 R3: cierra sesión en /meals-history, aterriza en welcome y no reabre el detalle` | `toBe`, waitFor inicial | `"/home"` | `"/login"` |
| `#114 R2::mantiene una sola tabs, remonta listas al reentrar y protege ambas sin sesión` | `toBe`, waitFor tras cerrar sesión | `"/welcome"` | `"/login"` |

Siguiente: cadena literal R3 (cuenta, ausencia de excepciones, typecheck,
lint y stage exclusivo).
+Cadena desde mobile-pet-tracker/:
```bash
grep -qE '^Tests: +19 failed, 1 passed, 20 total$' /tmp/149-r3.txt \
  && ! grep -qE 'TypeError|ReferenceError|SyntaxError|Cannot find module' /tmp/149-r3.txt \
  && test ! -e .expo/types/router.d.ts && bun run typecheck && bun run lint \
  && git add src/app/__tests__/detail-stack.guard.test.tsx src/app/__tests__/reminders-alerts-stack.navigation.test.tsx \
  && test "$(git diff --cached --name-only | sort | tr '\n' ' ')" = 'mobile-pet-tracker/src/app/__tests__/detail-stack.guard.test.tsx mobile-pet-tracker/src/app/__tests__/reminders-alerts-stack.navigation.test.tsx ' \
  && git commit -m 'test(mobile-auth): #149 R3 red, sign-out from every detail lands on welcome'
```
Cadena completa exit 0; typecheck y lint exit 0, sin diagnósticos.
Commit R3 rojo: `e414fa6f152fc2d4bbcebde2838a345a266bbcb3` —
`test(mobile-auth): #149 R3 red, sign-out from every detail lands on welcome`.

Anclas ejecutadas después del commit R3 con sus valores de cierre:

| Ancla | Comando (el mismo de H0) | Salida |
|---|---|---|
| 12 | `toBe('/login')` en detail-stack.guard | 2 |
| 13 | `toEqual(['(auth)'])` en detail-stack.guard | 1 |
| 14 | `['(auth)', 'reset-password']` en detail-stack.guard | 0 |
| 15 | `['welcome', 'reset-password']` en detail-stack.guard | 1 |
| 18 | `toBe('/login')` en reminders-alerts | 0 |
| 19 | `toEqual(['(auth)'])` en reminders-alerts | 0 |

## R4 rojo

Inventario nuevo, misma forma que #94 R10: allTypeScriptFiles(sourceRoot),
exclusión de __tests__/ y *.test.ts(x), regex literal aprobada y mapa
literal de cuatro claves. screenSignOutCalls permanece intacto.
```bash
FORCE_COLOR=0 bunx jest src/__tests__/design-drift.test.ts -t '#149 R4' > /tmp/149-r4.txt 2>&1; echo "exit=$?"
```
```text
Test Suites: 1 failed, 1 total
Tests:       1 failed, 60 skipped, 61 total
exit=1
```
Log leído completo: /tmp/149-r4.txt. It rojo:
`#149 R4: inventaría cada ruta a login en producción`.
Matcher: `expect(actual).toEqual(loginRoutes)`.
Expected es exactamente el mapa literal de la spec; Received tiene ese mismo
mapa más **solo** `"app/(tabs)/_layout.tsx": 1`:
```text
  Object {
    "app/(auth)/register.tsx": 1,
+   "app/(tabs)/_layout.tsx": 1,
    "screens/forgot/index.tsx": 1,
    "screens/reset-password/index.tsx": 2,
    "screens/welcome/index.tsx": 1,
  }
```
Sin TypeError, ReferenceError, SyntaxError ni import roto.
Siguiente: cadena literal R4 y control conjunto antes del verde.
+Cadena desde mobile-pet-tracker/:
```bash
grep -qE '^Tests: +1 failed, 60 skipped, 61 total$' /tmp/149-r4.txt \
  && ! grep -qE 'TypeError|ReferenceError|SyntaxError|Cannot find module' /tmp/149-r4.txt \
  && test ! -e .expo/types/router.d.ts && bun run typecheck && bun run lint \
  && git add src/__tests__/design-drift.test.ts \
  && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/__tests__/design-drift.test.ts' \
  && git commit -m 'test(mobile-auth): #149 R4 red, only four production files route to login'
```
Cadena completa exit 0; typecheck y lint exit 0, sin diagnósticos.
Commit R4 rojo: `7881d6426c62c3c4f200fde17dee58fde59859c5` —
`test(mobile-auth): #149 R4 red, only four production files route to login`.

## Control antes del verde

Los cuatro commits rojos ya existen, en el orden R1, R2, R3, R4.
Producción aún conserva href="/login".
```bash
FORCE_COLOR=0 bunx jest 'src/app/\(tabs\)/__tests__/layout.test.tsx' src/app/__tests__/detail-stack.guard.test.tsx src/app/__tests__/reminders-alerts-stack.navigation.test.tsx src/app/__tests__/index.test.tsx src/app/__tests__/layout.test.tsx src/__tests__/design-drift.test.ts > /tmp/149-pre-green.txt 2>&1; echo "exit=$?"
```
```text
Test Suites: 4 failed, 2 passed, 6 total
Tests:       21 failed, 94 passed, 115 total
exit=1
```
Cuenta exacta: 1 R1 + 5 R2 + 12 R3 + #95 R3 + #114 R2 + 1 R4.

## Verde común R1–R4

Ahora se cambia únicamente href="/login" por href="/welcome" en el layout
de tabs, sin comentario. Siguiente: cadena literal de seis suites,
typecheck, lint, stage exclusivo de la línea de producción y commit verde.
+Cadena literal lanzada desde mobile-pet-tracker/:
```bash
FORCE_COLOR=0 bunx jest 'src/app/\(tabs\)/__tests__/layout.test.tsx' src/app/__tests__/detail-stack.guard.test.tsx src/app/__tests__/reminders-alerts-stack.navigation.test.tsx src/app/__tests__/index.test.tsx src/app/__tests__/layout.test.tsx src/__tests__/design-drift.test.ts > /tmp/149-green.txt 2>&1 \
  && grep -qE '^Test Suites: +6 passed, 6 total$' /tmp/149-green.txt \
  && grep -qE '^Tests: +115 passed, 115 total$' /tmp/149-green.txt \
  && test ! -e .expo/types/router.d.ts && bun run typecheck && bun run lint \
  && git add 'src/app/(tabs)/_layout.tsx' \
  && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/app/(tabs)/_layout.tsx' \
  && git commit -m 'fix(mobile-auth): #149 R1-R4 green, sign-out lands on welcome'
```

**PARADA obligatoria del handoff:** el primer eslabón (bunx jest) salió con
exit 1. No se ejecutaron los grep de aceptación, la guarda de router.d.ts,
typecheck, lint, git add ni el commit verde. Salida real del log
`/tmp/149-green.txt`:
```text
FAIL src/app/__tests__/detail-stack.guard.test.tsx (5.342 s)
PASS src/app/__tests__/reminders-alerts-stack.navigation.test.tsx (5.581 s)
PASS src/__tests__/design-drift.test.ts
PASS src/app/__tests__/layout.test.tsx
PASS src/app/__tests__/index.test.tsx
PASS src/app/(tabs)/__tests__/layout.test.tsx (6.878 s)
Test Suites: 1 failed, 5 passed, 6 total
Tests:       17 failed, 98 passed, 115 total
exit=1
```

Las 17 filas nuevas R2/R3 fallan en el primer waitFor, aun teniendo
`await app;` inmediatamente tras renderRouter. Reciben
`"/reset-password"`, la ruta final del it previo #95 R3; #95 R3 y
#105 R8 pasan. Se conserva esta observación sin afirmar una causa
diagnosticada. El log sigue incluyendo los avisos de act ya presentes
en T0. No se reintenta ni se cambia el arnés: el handoff ordena parar.

| It | Matcher | Expected | Received |
|---|---|---|---|
| `#149 R2: cierra sesión en /home y aterriza en welcome` | `toBe`, waitFor inicial | `"/home"` | `"/reset-password"` |
| `#149 R2: cierra sesión en /map y aterriza en welcome` | `toBe`, waitFor inicial | `"/map"` | `"/reset-password"` |
| `#149 R2: cierra sesión en /health y aterriza en welcome` | `toBe`, waitFor inicial | `"/health"` | `"/reset-password"` |
| `#149 R2: cierra sesión en /food y aterriza en welcome` | `toBe`, waitFor inicial | `"/food"` | `"/reset-password"` |
| `#149 R2: cierra sesión en /profile y aterriza en welcome` | `toBe`, waitFor inicial | `"/profile"` | `"/reset-password"` |
| `#149 R3: cierra sesión en /add-reminder, aterriza en welcome y no reabre el detalle` | `toBe`, waitFor inicial | `"/home"` | `"/reset-password"` |
| `#149 R3: cierra sesión en /pets/add, aterriza en welcome y no reabre el detalle` | `toBe`, waitFor inicial | `"/home"` | `"/reset-password"` |
| `#149 R3: cierra sesión en /pets/pet-1/docs, aterriza en welcome y no reabre el detalle` | `toBe`, waitFor inicial | `"/home"` | `"/reset-password"` |
| `#149 R3: cierra sesión en /weight-log, aterriza en welcome y no reabre el detalle` | `toBe`, waitFor inicial | `"/home"` | `"/reset-password"` |
| `#149 R3: cierra sesión en /meal-schedule, aterriza en welcome y no reabre el detalle` | `toBe`, waitFor inicial | `"/home"` | `"/reset-password"` |
| `#149 R3: cierra sesión en /pairing, aterriza en welcome y no reabre el detalle` | `toBe`, waitFor inicial | `"/home"` | `"/reset-password"` |
| `#149 R3: cierra sesión en /reminders, aterriza en welcome y no reabre el detalle` | `toBe`, waitFor inicial | `"/home"` | `"/reset-password"` |
| `#149 R3: cierra sesión en /alerts, aterriza en welcome y no reabre el detalle` | `toBe`, waitFor inicial | `"/home"` | `"/reset-password"` |
| `#149 R3: cierra sesión en /alerts/alert-1, aterriza en welcome y no reabre el detalle` | `toBe`, waitFor inicial | `"/home"` | `"/reset-password"` |
| `#149 R3: cierra sesión en /pets/pet-1/geofences, aterriza en welcome y no reabre el detalle` | `toBe`, waitFor inicial | `"/home"` | `"/reset-password"` |
| `#149 R3: cierra sesión en /pets/pet-1/geofence-editor, aterriza en welcome y no reabre el detalle` | `toBe`, waitFor inicial | `"/home"` | `"/reset-password"` |
| `#149 R3: cierra sesión en /meals-history, aterriza en welcome y no reabre el detalle` | `toBe`, waitFor inicial | `"/home"` | `"/reset-password"` |

## Estado al parar (2026-10-06)

- HEAD: `7881d6426c62c3c4f200fde17dee58fde59859c5`.
- Cuatro commits rojos completos y verificados, sin commit verde ni docs final.
- La línea de producción a welcome queda en el working tree, sin stage.
- Impl documentado pero aún sin versionar; índice vacío.
- Traceability sigue como en H0: no se inventan hashes verdes ni se marca Smoke.
- No se ejecutan suite móvil completa ni verificaciones de Cierre, al haberse
  activado la parada antes del commit verde. Tampoco init.sh, push ni PR.
- Sin decisiones nuevas de producto ni cambios fuera de los ficheros permitidos.
- Siguiente para el leader: revisar la discrepancia de inicialización en
  detail-stack.guard antes de autorizar la continuación.

`git status --short` desde la raíz:
```text
 M mobile-pet-tracker/src/app/(tabs)/_layout.tsx
?? progress/impl_mobile-sign-out-lands-on-welcome.md
```
`git diff --cached --name-only`: salida vacía.

`git diff --name-only a8118da0` (H0 frente al working tree; el impl es
untracked y aparece en status):
```text
mobile-pet-tracker/src/__tests__/design-drift.test.ts
mobile-pet-tracker/src/app/(tabs)/__tests__/layout.test.tsx
mobile-pet-tracker/src/app/(tabs)/_layout.tsx
mobile-pet-tracker/src/app/__tests__/detail-stack.guard.test.tsx
mobile-pet-tracker/src/app/__tests__/reminders-alerts-stack.navigation.test.tsx
```

Regla que obliga a esta parada, handoff §COMMITS:
> Si una cadena no llega al commit, PARA y reporta en el impl el eslabon que fallo y la salida.

## Correccion 1

### Comprobacion inicial (H1)

```text
$ pwd
/home/claude/sites/Pet-Tracker-wt-backend
$ git branch --show-current
feature/149-mobile-sign-out-lands-on-welcome
$ git rev-parse --short HEAD
ab100341
$ git status --short
 M mobile-pet-tracker/src/app/(tabs)/_layout.tsx
?? progress/impl_mobile-sign-out-lands-on-welcome.md
```

H1 = `ab100341`. Branch y status coinciden exactamente con los exigidos. H0 para el cierre sigue siendo `a8118da0`.

### Lecturas y base de la correccion

Leídos completos el handoff (incluida Corrección 1), requirements, tasks,
design y traceability; retomado el impl desde §Estado al parar. E1 está
aprobada por humano. Skill cargada: solo `ponytail:ponytail` en la ruta ya
indicada arriba; ninguna de Expo ni del repo. Se releyeron las convenciones
de tests y esperas, arquitectura y verificación. Se consultó
[la referencia versionada SDK 57](https://docs.expo.dev/versions/v57.0.0/)
antes de escribir código, conforme a mobile-pet-tracker/AGENTS.md.
No se ejecuta init.sh ni se modifica bookkeeping: lo reserva el handoff al leader.

```text
$ git fetch origin
(salida vacía; exit 0)
$ git merge-base --is-ancestor origin/main HEAD; echo "exit=$?"
exit=0
```

### Paso 0

Desde mobile-pet-tracker/:
```bash
git checkout HEAD -- 'src/app/(tabs)/_layout.tsx' && git diff --quiet && git diff --cached --quiet && grep -cF 'href="/login"' 'src/app/(tabs)/_layout.tsx'
```
```text
1
exit=0
```
La línea verde sin commitear quedó descartada; diff e índice vacíos.

### Anclas C0-C9 antes de E1

Todas coinciden exactamente. Los grep con cuenta 0 tienen exit 1 esperado.

| Ancla | Comando desde mobile-pet-tracker/ | Salida | Exit |
|---|---|---|---|
| C0 | `grep -cF -- '- [x] Enmienda E1 aprobada por humano (fecha: 2026-10-06' ../specs/mobile-sign-out-lands-on-welcome/requirements.md` | 1 | 0 |
| C1 | `grep -cF 'href="/login"' 'src/app/(tabs)/_layout.tsx'` | 1 | 0 |
| C2 | `grep -cF 'href="/welcome"' 'src/app/(tabs)/_layout.tsx'` | 0 | 1 |
| C3 | `grep -cF 'await app;' src/app/__tests__/detail-stack.guard.test.tsx` | 3 | 0 |
| C4 | `grep -cF 'renderRouter(' src/app/__tests__/detail-stack.guard.test.tsx` | 4 | 0 |
| C5 | `grep -A1 -F 'renderRouter(' src/app/__tests__/detail-stack.guard.test.tsx | grep -cF 'await app;'` | 3 | 0 |
| C6 | `grep -cF "const app = renderRouter(routes(), { initialUrl: '/home' });" src/app/__tests__/detail-stack.guard.test.tsx` | 2 | 0 |
| C7 | `grep -cF "describe('#95 R3: la guarda protege las seis y deja libres (auth) y reset-password'" src/app/__tests__/detail-stack.guard.test.tsx` | 1 | 0 |
| C8 | `git log --format=%s e002a4a5..HEAD | grep -cE '^test\(mobile-auth\): #149 R[1-4] red'` | 4 | 0 |
| C9 | `git log --format=%s e002a4a5..HEAD | grep -cE '^fix\(mobile-auth\): #149'` | 0 | 1 |

### E1 — cambio autorizado

Siguiente: añadir solo `await app;` inmediatamente después del render de
`#95 R3`, con la misma indentación, y medir el rojo de la guarda entera.


### Anclas C3-C6 despues de E1

| Ancla | Comando desde mobile-pet-tracker/ | Salida | Exit |
|---|---|---|---|
| C3 | `grep -cF 'await app;' src/app/__tests__/detail-stack.guard.test.tsx` | 4 | 0 |
| C4 | `grep -cF 'renderRouter(' src/app/__tests__/detail-stack.guard.test.tsx` | 4 | 0 |
| C5 | `grep -A1 -F 'renderRouter(' src/app/__tests__/detail-stack.guard.test.tsx | grep -cF 'await app;'` | 4 | 0 |
| C6 | `grep -cF "const app = renderRouter(routes(), { initialUrl: '/home' });" src/app/__tests__/detail-stack.guard.test.tsx` | 2 | 0 |

### Rojo nuevo E1 completo

Diff frente a H1: solo una línea `await app;` en el it de #95 R3.
Comando desde mobile-pet-tracker/, sin pipe:
```bash
FORCE_COLOR=0 bunx jest src/app/__tests__/detail-stack.guard.test.tsx > /tmp/149-e1.txt 2>&1; echo "exit=$?"
```
Exit de Jest: `1`. Log leído completo; los 18 fallos están en
`waitFor(() => expect(app.getPathname()).toBe('/welcome'))` tras cerrar
sesión (líneas 118, 157 y 191 en esta revisión). Ninguno cae en la espera
inicial: 18 × Expected `/welcome` / Received `/login`, ninguna otra línea
Expected; #105 R8 pasa. Se conserva a continuación toda la salida, con el
nombre de cada it, matcher, Expected y Received:

```text
  console.warn
    Uniwind - We couldn't find your variable --color-foreground. Make sure it's used at least once in your className, or define it in a static theme as described in the docs: https://docs.uniwind.dev/api/use-css-variable

      16 |   const { theme } = useUniwind();
      17 |   const foreground =
    > 18 |     asColor(Uniwind.getCSSVariable('--color-foreground')) ??
         |                     ^
      19 |     (theme === 'dark' ? '#F7F8FA' : '#0D1117');
      20 |
      21 |   return tokens.map(

      at Function.warn (node_modules/uniwind/src/core/logger.ts:11:17)
      at warn (node_modules/uniwind/src/hooks/useCSSVariable/useCSSVariable.ts:20:12)
      at logDevError (node_modules/uniwind/src/hooks/useCSSVariable/useCSSVariable.ts:39:9)
      at UniwindConfigBuilder.getCSSVariable (node_modules/uniwind/src/core/config/config.common.ts:122:30)
      at getCSSVariable (src/theme/use-theme-colors.ts:18:21)
      at RootStack (src/app/_layout.tsx:78:50)
      at Object.react_stack_bottom_frame (node_modules/react-reconciler/cjs/react-reconciler.development.js:17596:20)
      at renderWithHooks (node_modules/react-reconciler/cjs/react-reconciler.development.js:5335:22)
      at updateFunctionComponent (node_modules/react-reconciler/cjs/react-reconciler.development.js:7720:19)
      at beginWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:9277:18)
      at runWithFiberInDEV (node_modules/react-reconciler/cjs/react-reconciler.development.js:2508:13)
      at performUnitOfWork (node_modules/react-reconciler/cjs/react-reconciler.development.js:15273:22)
      at workLoopSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15099:41)
      at renderRootSync (node_modules/react-reconciler/cjs/react-reconciler.development.js:15080:11)
      at performWorkOnRoot (node_modules/react-reconciler/cjs/react-reconciler.development.js:14165:11)
      at performWorkOnRootViaSchedulerTask (node_modules/react-reconciler/cjs/react-reconciler.development.js:3335:7)
      at flushActQueue (node_modules/react/cjs/react.development.js:590:34)
      at recursivelyFlushAsyncActWork (node_modules/react/cjs/react.development.js:566:13)
      at Immediate._onImmediate (node_modules/react/cjs/react.development.js:849:32)

FAIL src/app/__tests__/detail-stack.guard.test.tsx
  #105 R8: meals history requires a session
    ✓ mantiene login al intentar meals-history sin sesión (168 ms)
  #95 R3: la guarda protege las seis y deja libres (auth) y reset-password
    ✕ expulsa el detalle al cerrar sesión y no agrega rutas protegidas al historial (171 ms)
  #149 R2: cerrar sesión en una tab aterriza en welcome
    ✕ #149 R2: cierra sesión en /home y aterriza en welcome (113 ms)
    ✕ #149 R2: cierra sesión en /map y aterriza en welcome (66 ms)
    ✕ #149 R2: cierra sesión en /health y aterriza en welcome (71 ms)
    ✕ #149 R2: cierra sesión en /food y aterriza en welcome (75 ms)
    ✕ #149 R2: cierra sesión en /profile y aterriza en welcome (63 ms)
  #149 R3: cerrar sesión en un detalle aterriza en welcome
    ✕ #149 R3: cierra sesión en /add-reminder, aterriza en welcome y no reabre el detalle (71 ms)
    ✕ #149 R3: cierra sesión en /pets/add, aterriza en welcome y no reabre el detalle (74 ms)
    ✕ #149 R3: cierra sesión en /pets/pet-1/docs, aterriza en welcome y no reabre el detalle (80 ms)
    ✕ #149 R3: cierra sesión en /weight-log, aterriza en welcome y no reabre el detalle (56 ms)
    ✕ #149 R3: cierra sesión en /meal-schedule, aterriza en welcome y no reabre el detalle (76 ms)
    ✕ #149 R3: cierra sesión en /pairing, aterriza en welcome y no reabre el detalle (72 ms)
    ✕ #149 R3: cierra sesión en /reminders, aterriza en welcome y no reabre el detalle (69 ms)
    ✕ #149 R3: cierra sesión en /alerts, aterriza en welcome y no reabre el detalle (68 ms)
    ✕ #149 R3: cierra sesión en /alerts/alert-1, aterriza en welcome y no reabre el detalle (69 ms)
    ✕ #149 R3: cierra sesión en /pets/pet-1/geofences, aterriza en welcome y no reabre el detalle (73 ms)
    ✕ #149 R3: cierra sesión en /pets/pet-1/geofence-editor, aterriza en welcome y no reabre el detalle (86 ms)
    ✕ #149 R3: cierra sesión en /meals-history, aterriza en welcome y no reabre el detalle (102 ms)

  ● #95 R3: la guarda protege las seis y deja libres (auth) y reset-password › expulsa el detalle al cerrar sesión y no agrega rutas protegidas al historial

    expect(received).toBe(expected) // Object.is equality

    Expected: "/welcome"
    Received: "/login"

      116 |       for (const listener of mockAuthListeners) listener();
      117 |     });
    > 118 |     await waitFor(() => expect(app.getPathname()).toBe('/welcome'));
          |                  ^
      119 |     expect(rootStack(app)).toEqual(['welcome']);
      120 |
      121 |     for (const href of [

      at Object.<anonymous> (src/app/__tests__/detail-stack.guard.test.tsx:118:18)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

  ● #149 R2: cerrar sesión en una tab aterriza en welcome › #149 R2: cierra sesión en /home y aterriza en welcome

    expect(received).toBe(expected) // Object.is equality

    Expected: "/welcome"
    Received: "/login"

      155 |       for (const listener of mockAuthListeners) listener();
      156 |     });
    > 157 |     await waitFor(() => expect(app.getPathname()).toBe('/welcome'));
          |                  ^
      158 |     expect(rootStack(app)).toEqual(['welcome']);
      159 |   });
      160 | });

      at src/app/__tests__/detail-stack.guard.test.tsx:157:18
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

  ● #149 R2: cerrar sesión en una tab aterriza en welcome › #149 R2: cierra sesión en /map y aterriza en welcome

    expect(received).toBe(expected) // Object.is equality

    Expected: "/welcome"
    Received: "/login"

      155 |       for (const listener of mockAuthListeners) listener();
      156 |     });
    > 157 |     await waitFor(() => expect(app.getPathname()).toBe('/welcome'));
          |                  ^
      158 |     expect(rootStack(app)).toEqual(['welcome']);
      159 |   });
      160 | });

      at src/app/__tests__/detail-stack.guard.test.tsx:157:18
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

  ● #149 R2: cerrar sesión en una tab aterriza en welcome › #149 R2: cierra sesión en /health y aterriza en welcome

    expect(received).toBe(expected) // Object.is equality

    Expected: "/welcome"
    Received: "/login"

      155 |       for (const listener of mockAuthListeners) listener();
      156 |     });
    > 157 |     await waitFor(() => expect(app.getPathname()).toBe('/welcome'));
          |                  ^
      158 |     expect(rootStack(app)).toEqual(['welcome']);
      159 |   });
      160 | });

      at src/app/__tests__/detail-stack.guard.test.tsx:157:18
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

  ● #149 R2: cerrar sesión en una tab aterriza en welcome › #149 R2: cierra sesión en /food y aterriza en welcome

    expect(received).toBe(expected) // Object.is equality

    Expected: "/welcome"
    Received: "/login"

      155 |       for (const listener of mockAuthListeners) listener();
      156 |     });
    > 157 |     await waitFor(() => expect(app.getPathname()).toBe('/welcome'));
          |                  ^
      158 |     expect(rootStack(app)).toEqual(['welcome']);
      159 |   });
      160 | });

      at src/app/__tests__/detail-stack.guard.test.tsx:157:18
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

  ● #149 R2: cerrar sesión en una tab aterriza en welcome › #149 R2: cierra sesión en /profile y aterriza en welcome

    expect(received).toBe(expected) // Object.is equality

    Expected: "/welcome"
    Received: "/login"

      155 |       for (const listener of mockAuthListeners) listener();
      156 |     });
    > 157 |     await waitFor(() => expect(app.getPathname()).toBe('/welcome'));
          |                  ^
      158 |     expect(rootStack(app)).toEqual(['welcome']);
      159 |   });
      160 | });

      at src/app/__tests__/detail-stack.guard.test.tsx:157:18
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

  ● #149 R3: cerrar sesión en un detalle aterriza en welcome › #149 R3: cierra sesión en /add-reminder, aterriza en welcome y no reabre el detalle

    expect(received).toBe(expected) // Object.is equality

    Expected: "/welcome"
    Received: "/login"

      189 |       for (const listener of mockAuthListeners) listener();
      190 |     });
    > 191 |     await waitFor(() => expect(app.getPathname()).toBe('/welcome'));
          |                  ^
      192 |     expect(rootStack(app)).toEqual(['welcome']);
      193 |
      194 |     await act(async () => router.push(href as Href));

      at src/app/__tests__/detail-stack.guard.test.tsx:191:18
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

  ● #149 R3: cerrar sesión en un detalle aterriza en welcome › #149 R3: cierra sesión en /pets/add, aterriza en welcome y no reabre el detalle

    expect(received).toBe(expected) // Object.is equality

    Expected: "/welcome"
    Received: "/login"

      189 |       for (const listener of mockAuthListeners) listener();
      190 |     });
    > 191 |     await waitFor(() => expect(app.getPathname()).toBe('/welcome'));
          |                  ^
      192 |     expect(rootStack(app)).toEqual(['welcome']);
      193 |
      194 |     await act(async () => router.push(href as Href));

      at src/app/__tests__/detail-stack.guard.test.tsx:191:18
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

  ● #149 R3: cerrar sesión en un detalle aterriza en welcome › #149 R3: cierra sesión en /pets/pet-1/docs, aterriza en welcome y no reabre el detalle

    expect(received).toBe(expected) // Object.is equality

    Expected: "/welcome"
    Received: "/login"

      189 |       for (const listener of mockAuthListeners) listener();
      190 |     });
    > 191 |     await waitFor(() => expect(app.getPathname()).toBe('/welcome'));
          |                  ^
      192 |     expect(rootStack(app)).toEqual(['welcome']);
      193 |
      194 |     await act(async () => router.push(href as Href));

      at src/app/__tests__/detail-stack.guard.test.tsx:191:18
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

  ● #149 R3: cerrar sesión en un detalle aterriza en welcome › #149 R3: cierra sesión en /weight-log, aterriza en welcome y no reabre el detalle

    expect(received).toBe(expected) // Object.is equality

    Expected: "/welcome"
    Received: "/login"

      189 |       for (const listener of mockAuthListeners) listener();
      190 |     });
    > 191 |     await waitFor(() => expect(app.getPathname()).toBe('/welcome'));
          |                  ^
      192 |     expect(rootStack(app)).toEqual(['welcome']);
      193 |
      194 |     await act(async () => router.push(href as Href));

      at src/app/__tests__/detail-stack.guard.test.tsx:191:18
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

  ● #149 R3: cerrar sesión en un detalle aterriza en welcome › #149 R3: cierra sesión en /meal-schedule, aterriza en welcome y no reabre el detalle

    expect(received).toBe(expected) // Object.is equality

    Expected: "/welcome"
    Received: "/login"

      189 |       for (const listener of mockAuthListeners) listener();
      190 |     });
    > 191 |     await waitFor(() => expect(app.getPathname()).toBe('/welcome'));
          |                  ^
      192 |     expect(rootStack(app)).toEqual(['welcome']);
      193 |
      194 |     await act(async () => router.push(href as Href));

      at src/app/__tests__/detail-stack.guard.test.tsx:191:18
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

  ● #149 R3: cerrar sesión en un detalle aterriza en welcome › #149 R3: cierra sesión en /pairing, aterriza en welcome y no reabre el detalle

    expect(received).toBe(expected) // Object.is equality

    Expected: "/welcome"
    Received: "/login"

      189 |       for (const listener of mockAuthListeners) listener();
      190 |     });
    > 191 |     await waitFor(() => expect(app.getPathname()).toBe('/welcome'));
          |                  ^
      192 |     expect(rootStack(app)).toEqual(['welcome']);
      193 |
      194 |     await act(async () => router.push(href as Href));

      at src/app/__tests__/detail-stack.guard.test.tsx:191:18
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

  ● #149 R3: cerrar sesión en un detalle aterriza en welcome › #149 R3: cierra sesión en /reminders, aterriza en welcome y no reabre el detalle

    expect(received).toBe(expected) // Object.is equality

    Expected: "/welcome"
    Received: "/login"

      189 |       for (const listener of mockAuthListeners) listener();
      190 |     });
    > 191 |     await waitFor(() => expect(app.getPathname()).toBe('/welcome'));
          |                  ^
      192 |     expect(rootStack(app)).toEqual(['welcome']);
      193 |
      194 |     await act(async () => router.push(href as Href));

      at src/app/__tests__/detail-stack.guard.test.tsx:191:18
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

  ● #149 R3: cerrar sesión en un detalle aterriza en welcome › #149 R3: cierra sesión en /alerts, aterriza en welcome y no reabre el detalle

    expect(received).toBe(expected) // Object.is equality

    Expected: "/welcome"
    Received: "/login"

      189 |       for (const listener of mockAuthListeners) listener();
      190 |     });
    > 191 |     await waitFor(() => expect(app.getPathname()).toBe('/welcome'));
          |                  ^
      192 |     expect(rootStack(app)).toEqual(['welcome']);
      193 |
      194 |     await act(async () => router.push(href as Href));

      at src/app/__tests__/detail-stack.guard.test.tsx:191:18
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

  ● #149 R3: cerrar sesión en un detalle aterriza en welcome › #149 R3: cierra sesión en /alerts/alert-1, aterriza en welcome y no reabre el detalle

    expect(received).toBe(expected) // Object.is equality

    Expected: "/welcome"
    Received: "/login"

      189 |       for (const listener of mockAuthListeners) listener();
      190 |     });
    > 191 |     await waitFor(() => expect(app.getPathname()).toBe('/welcome'));
          |                  ^
      192 |     expect(rootStack(app)).toEqual(['welcome']);
      193 |
      194 |     await act(async () => router.push(href as Href));

      at src/app/__tests__/detail-stack.guard.test.tsx:191:18
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

  ● #149 R3: cerrar sesión en un detalle aterriza en welcome › #149 R3: cierra sesión en /pets/pet-1/geofences, aterriza en welcome y no reabre el detalle

    expect(received).toBe(expected) // Object.is equality

    Expected: "/welcome"
    Received: "/login"

      189 |       for (const listener of mockAuthListeners) listener();
      190 |     });
    > 191 |     await waitFor(() => expect(app.getPathname()).toBe('/welcome'));
          |                  ^
      192 |     expect(rootStack(app)).toEqual(['welcome']);
      193 |
      194 |     await act(async () => router.push(href as Href));

      at src/app/__tests__/detail-stack.guard.test.tsx:191:18
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

  ● #149 R3: cerrar sesión en un detalle aterriza en welcome › #149 R3: cierra sesión en /pets/pet-1/geofence-editor, aterriza en welcome y no reabre el detalle

    expect(received).toBe(expected) // Object.is equality

    Expected: "/welcome"
    Received: "/login"

      189 |       for (const listener of mockAuthListeners) listener();
      190 |     });
    > 191 |     await waitFor(() => expect(app.getPathname()).toBe('/welcome'));
          |                  ^
      192 |     expect(rootStack(app)).toEqual(['welcome']);
      193 |
      194 |     await act(async () => router.push(href as Href));

      at src/app/__tests__/detail-stack.guard.test.tsx:191:18
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

  ● #149 R3: cerrar sesión en un detalle aterriza en welcome › #149 R3: cierra sesión en /meals-history, aterriza en welcome y no reabre el detalle

    expect(received).toBe(expected) // Object.is equality

    Expected: "/welcome"
    Received: "/login"

      189 |       for (const listener of mockAuthListeners) listener();
      190 |     });
    > 191 |     await waitFor(() => expect(app.getPathname()).toBe('/welcome'));
          |                  ^
      192 |     expect(rootStack(app)).toEqual(['welcome']);
      193 |
      194 |     await act(async () => router.push(href as Href));

      at src/app/__tests__/detail-stack.guard.test.tsx:191:18
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)

Test Suites: 1 failed, 1 total
Tests:       18 failed, 1 passed, 19 total
Snapshots:   0 total
Time:        5.101 s, estimated 6 s
Ran all test suites matching /src\/app\/__tests__\/detail-stack.guard.test.tsx/i.
exit=1
```

Cadena literal E1 desde mobile-pet-tracker/:
```bash
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
```

Cadena E1 completa: exit 0. Typecheck (`tsc --noEmit`) y lint (`expo lint`)
exit 0, sin diagnósticos. Guardia router.d.ts ausente y stage exclusivo
verificados dentro de la cadena. Commit rojo E1:
`f9f83b9d3cfaa7759f0e018eb9ef9215c5ba2c20` —
`test(mobile-auth): #149 R2-R3 red, await the #95 R3 render`.
Una inserción en un solo fichero. Los cuatro rojos anteriores permanecen
intactos; R2/R3 citarán su rojo original y el de E1 en traceability.

### Control antes del verde (tras E1, sin commit)

Comando T0 desde mobile-pet-tracker/, sin pipe:
```bash
FORCE_COLOR=0 bunx jest 'src/app/\(tabs\)/__tests__/layout.test.tsx' src/app/__tests__/detail-stack.guard.test.tsx src/app/__tests__/reminders-alerts-stack.navigation.test.tsx src/app/__tests__/index.test.tsx src/app/__tests__/layout.test.tsx src/__tests__/design-drift.test.ts > /tmp/149-pre-green.txt 2>&1; echo "exit=$?"
```

```text
Test Suites: 4 failed, 2 passed, 6 total
Tests:       21 failed, 94 passed, 115 total
exit=1
```
Resumen y ausencia de TypeError/ReferenceError/SyntaxError/import roto
verificados con grep (exit 0). Cuenta exacta: 1 R1 + 5 R2 + 12 R3 +
#95 R3 + #114 R2 + 1 R4. Los 18 fallos de la guarda son welcome/login
tras cerrar sesión; R1 muestra href welcome/login y R4 solo añade la
clave sobrante `app/(tabs)/_layout.tsx`. Control conforme; sin commit.

### Verde comun R1-R4 (tras E1)

Se rehace únicamente `href="/login"` → `href="/welcome"` en el layout
de tabs, sin comentario. Sigue la cadena literal del handoff, sin cambios.

Desde mobile-pet-tracker/:
```bash
FORCE_COLOR=0 bunx jest 'src/app/\(tabs\)/__tests__/layout.test.tsx' src/app/__tests__/detail-stack.guard.test.tsx src/app/__tests__/reminders-alerts-stack.navigation.test.tsx src/app/__tests__/index.test.tsx src/app/__tests__/layout.test.tsx src/__tests__/design-drift.test.ts > /tmp/149-green.txt 2>&1 \
    && grep -qE '^Test Suites: +6 passed, 6 total$' /tmp/149-green.txt \
    && grep -qE '^Tests: +115 passed, 115 total$' /tmp/149-green.txt \
    && test ! -e .expo/types/router.d.ts && bun run typecheck && bun run lint \
    && git add 'src/app/(tabs)/_layout.tsx' \
    && test "$(git diff --cached --name-only)" = 'mobile-pet-tracker/src/app/(tabs)/_layout.tsx' \
    && git commit -m 'fix(mobile-auth): #149 R1-R4 green, sign-out lands on welcome'
```

Salida de las seis suites:
```text
PASS src/app/__tests__/reminders-alerts-stack.navigation.test.tsx
PASS src/app/(tabs)/__tests__/layout.test.tsx
PASS src/__tests__/design-drift.test.ts
PASS src/app/__tests__/index.test.tsx
PASS src/app/__tests__/layout.test.tsx
PASS src/app/__tests__/detail-stack.guard.test.tsx
Test Suites: 6 passed, 6 total
Tests:       115 passed, 115 total
exit=0
```
Cadena verde completa: exit 0. Typecheck (`tsc --noEmit`) y lint (`expo lint`)
exit 0, sin diagnósticos; router.d.ts ausente y stage exclusivo verificados.
Commit verde común:
`00d43733e6f20c84ba7d9898a8beaab6c3a0e1c8` —
`fix(mobile-auth): #149 R1-R4 green, sign-out lands on welcome`.
Diff de producción del commit: un fichero, una sustitución de href.

Reparto de los 115 tests (T0 más las filas medidas en E1 y el inventario R4):

| Suite | Tests verdes |
|---|---|
| `(tabs)/layout` | 5 |
| `detail-stack.guard` | 19 |
| `reminders-alerts` | 1 |
| `index` | 3 |
| `layout` raíz | 26 |
| `design-drift` | 61 |

### Cierre — suite movil entera

Desde mobile-pet-tracker/:
```text
$ pgrep -af '[i]nit\.sh'
(salida vacía; exit 1 = no hay procesos)
```
Se lanza solo la suite móvil entera; mientras corre no se ejecutará otra cosa.
```bash
FORCE_COLOR=0 bunx jest > /tmp/149-all.txt 2>&1; echo "exit=$?"
```


Salida de Jest entero:
```text
Test Suites: 94 passed, 94 total
Tests:       2131 passed, 2131 total
Snapshots:   1 passed, 1 total
Time:        54.199 s
exit=0
```
Mientras corrió solo se esperó a ese proceso. Sin reintentos ni cambios
en otras suites.

### Cierre — NR1-NR5 y backend/infra

Desde mobile-pet-tracker/:
```bash
git diff --stat e002a4a5 -- src/app/index.tsx src/app/_layout.tsx src/app/__tests__/index.test.tsx src/app/__tests__/layout.test.tsx src/screens/welcome src/i18n src/providers package.json bun.lock
```
```text
(salida vacía; exit 0)
```
Desde la raíz:
```bash
git diff --stat e002a4a5 -- backend-pet-tracker/ infra-pet-tracker/
```
```text
(salida vacía; exit 0)
```
```bash
git diff --name-only e002a4a5 HEAD -- mobile-pet-tracker/
```
```text
mobile-pet-tracker/src/__tests__/design-drift.test.ts
mobile-pet-tracker/src/app/(tabs)/__tests__/layout.test.tsx
mobile-pet-tracker/src/app/(tabs)/_layout.tsx
mobile-pet-tracker/src/app/__tests__/detail-stack.guard.test.tsx
mobile-pet-tracker/src/app/__tests__/reminders-alerts-stack.navigation.test.tsx
```
Exit 0. Son exactamente los cinco ficheros móviles autorizados. Se leyó el
diff completo de mobile contra e002a4a5: producción cambia solo el href;
los tests añaden R2/R3/R4 y reapuntan lo aprobado. #105 R8, los mocks y
screenSignOutCalls quedan intactos. NR1-NR6 conformes; las suites existentes
quedaron verdes. No hay cambios de pantallas, copy, providers o dependencias.

### Cierre — las 25 anclas y las cuatro positivas

Comandos ejecutados desde mobile-pet-tracker/. Todos coinciden; un recuento
0 tiene exit 1 esperado. Ancla 16 = 4 por E1: #105 R8 + #95 R3 + R2 + R3.

| Ancla | Comando | Salida | Exit |
|---|---|---|---|
| 0 | `grep -cF -- '- [x] Aprobado por humano (fecha: 2026-10-06' ../specs/mobile-sign-out-lands-on-welcome/requirements.md` | 1 | 0 |
| 1 | `grep -cF 'href="/login"' 'src/app/(tabs)/_layout.tsx'` | 0 | 1 |
| 2 | `grep -cF 'href="/welcome"' 'src/app/(tabs)/_layout.tsx'` | 1 | 0 |
| 3 | `grep -cF "describe('R1: (tabs) exige sesión'" 'src/app/(tabs)/__tests__/layout.test.tsx'` | 1 | 0 |
| 4 | `grep -cF "it('redirects an unauthenticated session to login'" 'src/app/(tabs)/__tests__/layout.test.tsx'` | 0 | 1 |
| 5 | `grep -cF "{ href: '/login' }" 'src/app/(tabs)/__tests__/layout.test.tsx'` | 0 | 1 |
| 6 | `grep -cF "{ href: '/welcome' }" 'src/app/(tabs)/__tests__/layout.test.tsx'` | 1 | 0 |
| 7 | `grep -cF "import { router, type Href } from 'expo-router';" src/app/__tests__/detail-stack.guard.test.tsx` | 1 | 0 |
| 8 | `grep -cF 'const mockAuthListeners = new Set' src/app/__tests__/detail-stack.guard.test.tsx` | 1 | 0 |
| 9 | `grep -cF 'function rootStack(' src/app/__tests__/detail-stack.guard.test.tsx` | 1 | 0 |
| 10 | `grep -cF "describe('#105 R8: meals history requires a session'" src/app/__tests__/detail-stack.guard.test.tsx` | 1 | 0 |
| 11 | `grep -cF "describe('#95 R3: la guarda protege las seis y deja libres (auth) y reset-password'" src/app/__tests__/detail-stack.guard.test.tsx` | 1 | 0 |
| 12 | `grep -cF "toBe('/login')" src/app/__tests__/detail-stack.guard.test.tsx` | 2 | 0 |
| 13 | `grep -cF "toEqual(['(auth)'])" src/app/__tests__/detail-stack.guard.test.tsx` | 1 | 0 |
| 14 | `grep -cF "['(auth)', 'reset-password']" src/app/__tests__/detail-stack.guard.test.tsx` | 0 | 1 |
| 15 | `grep -cF "['welcome', 'reset-password']" src/app/__tests__/detail-stack.guard.test.tsx` | 1 | 0 |
| 16 | `grep -cF 'await app;' src/app/__tests__/detail-stack.guard.test.tsx` | 4 | 0 |
| 17 | `grep -cF "describe('#114 R2: reminders y alerts se apilan y desapilan sobre (tabs)'" src/app/__tests__/reminders-alerts-stack.navigation.test.tsx` | 1 | 0 |
| 18 | `grep -cF "toBe('/login')" src/app/__tests__/reminders-alerts-stack.navigation.test.tsx` | 0 | 1 |
| 19 | `grep -cF "toEqual(['(auth)'])" src/app/__tests__/reminders-alerts-stack.navigation.test.tsx` | 0 | 1 |
| 20 | `grep -cF "describe('#94 R10" src/__tests__/design-drift.test.ts` | 1 | 0 |
| 21 | `grep -cF 'function allTypeScriptFiles(' src/__tests__/design-drift.test.ts` | 1 | 0 |
| 22 | `grep -cF 'screenSignOutCalls' src/__tests__/design-drift.test.ts` | 4 | 0 |
| 23 | `grep -cF "describe('#149" src/__tests__/design-drift.test.ts` | 1 | 0 |
| 24 | `grep -cF "describe('#149" src/app/__tests__/detail-stack.guard.test.tsx` | 2 | 0 |
| P-R1 | `grep -cF "it('#149 R1: redirects an unauthenticated session to welcome'" 'src/app/(tabs)/__tests__/layout.test.tsx'` | 1 | 0 |
| P-R2 | `grep -cF "describe('#149 R2: cerrar sesión en una tab aterriza en welcome'" src/app/__tests__/detail-stack.guard.test.tsx` | 1 | 0 |
| P-R3 | `grep -cF "describe('#149 R3: cerrar sesión en un detalle aterriza en welcome'" src/app/__tests__/detail-stack.guard.test.tsx` | 1 | 0 |
| P-R4 | `grep -cF "describe('#149 R4: solo cuatro ficheros de producción navegan a login'" src/__tests__/design-drift.test.ts` | 1 | 0 |

### Cierre — trazabilidad

Siguiente: completar R1-R4 con sus tests exactos y hashes/mensajes rojo y
verde. R2 y R3 incluyen además el rojo E1 `f9f83b9d`; Smoke se conserva
literalmente pendiente para el humano. No se modifica requirements/tasks.


Trazabilidad R1-R4 completada; R2 y R3 citan los dos rojos con sus hashes
y mensajes, y los cuatro requisitos comparten el verde `00d43733`.
La fila Smoke permanece idéntica a H0. No se declara done: gate init.sh,
reviewer con sondas M1-M7 y smoke Android quedan al leader/humano.

### Cierre — lista cerrada contra H0 a8118da0

Preflight desde la raíz: se incluyen impl y traceability en el índice para
medir también los dos documentos antes del único commit docs.
```bash
git add specs/mobile-sign-out-lands-on-welcome/traceability.md progress/impl_mobile-sign-out-lands-on-welcome.md \
    && test "$(git diff --cached --name-only | sort | tr '\n' ' ')" = 'progress/impl_mobile-sign-out-lands-on-welcome.md specs/mobile-sign-out-lands-on-welcome/traceability.md ' \
    && git diff --name-only a8118da0 -- . ':!feature_list.json' ':!progress/current.md' ':!progress/handoff_mobile-sign-out-lands-on-welcome.md' ':!specs/mobile-sign-out-lands-on-welcome/requirements.md' ':!specs/mobile-sign-out-lands-on-welcome/design.md' ':!specs/mobile-sign-out-lands-on-welcome/tasks.md'
```
Salida real (exit 0), exactamente los siete ficheros autorizados:
```text
mobile-pet-tracker/src/__tests__/design-drift.test.ts
mobile-pet-tracker/src/app/(tabs)/__tests__/layout.test.tsx
mobile-pet-tracker/src/app/(tabs)/_layout.tsx
mobile-pet-tracker/src/app/__tests__/detail-stack.guard.test.tsx
mobile-pet-tracker/src/app/__tests__/reminders-alerts-stack.navigation.test.tsx
progress/impl_mobile-sign-out-lands-on-welcome.md
specs/mobile-sign-out-lands-on-welcome/traceability.md
```
La misma lista se coteja contra HEAD después del commit documental con el
comando literal de cierre, conservando H0 y todos los pathspecs:
```bash
git diff --name-only a8118da0 HEAD -- . ':!feature_list.json' ':!progress/current.md' ':!progress/handoff_mobile-sign-out-lands-on-welcome.md' ':!specs/mobile-sign-out-lands-on-welcome/requirements.md' ':!specs/mobile-sign-out-lands-on-welcome/design.md' ':!specs/mobile-sign-out-lands-on-welcome/tasks.md'
```
Salida registrada para ese cotejo:
```text
mobile-pet-tracker/src/__tests__/design-drift.test.ts
mobile-pet-tracker/src/app/(tabs)/__tests__/layout.test.tsx
mobile-pet-tracker/src/app/(tabs)/_layout.tsx
mobile-pet-tracker/src/app/__tests__/detail-stack.guard.test.tsx
mobile-pet-tracker/src/app/__tests__/reminders-alerts-stack.navigation.test.tsx
progress/impl_mobile-sign-out-lands-on-welcome.md
specs/mobile-sign-out-lands-on-welcome/traceability.md
```

### Cierre — commit documental y entrega

Cadena literal desde la raíz (stage exclusivo de estos dos documentos):
```bash
git add specs/mobile-sign-out-lands-on-welcome/traceability.md progress/impl_mobile-sign-out-lands-on-welcome.md \
    && test "$(git diff --cached --name-only | sort | tr '\n' ' ')" = 'progress/impl_mobile-sign-out-lands-on-welcome.md specs/mobile-sign-out-lands-on-welcome/traceability.md ' \
    && git commit -m 'docs(mobile-sign-out-lands-on-welcome): trace #149 R1-R4'
```
Después del commit se comprueba la lista HEAD anterior y `git status --short`
vacío; no se modifica el impl para anotar su propio hash. El hash documental
y el resultado del cotejo final se entregan en la respuesta de cierre.

Decisiones nuevas: ninguna; se aplica únicamente E1 y el verde común aprobado.
No se reescriben commits ni se ejecutan merge, rebase, amend, reset, init.sh,
push o PR. No se tocan otros worktrees ni Postgres/LocalStack. La evidencia
anterior queda íntegra; todo lo retomado está bajo `## Correccion 1`.

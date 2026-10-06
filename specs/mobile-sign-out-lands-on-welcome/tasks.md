---
feature: mobile-sign-out-lands-on-welcome
id: 149
status: draft
tags: [harness, spec, mobile, navigation]
base: e002a4a5 (origin/main con #117)
---

# Tareas — #149 mobile-sign-out-lands-on-welcome

> TDD estricto por requisito (C4 de `CHECKPOINTS.md`): **un commit rojo por
> requisito, todos antes del único commit verde**. Motivo: el verde es una sola
> línea que pone en verde R1–R4 a la vez; si R1 se pusiera en verde antes de
> escribir R2–R4, estos nacerían verdes y no tendrían historial rojo.
>
> Todos los comandos se ejecutan desde `mobile-pet-tracker/`. Los paréntesis de
> `(tabs)` van **escapados** en los patrones de jest (si no, jest los lee como
> regex, se salta el fichero y sale con 0). Ningún test de este orden asevera
> un sujeto que no exista todavía: el layout de tabs, la ruta `welcome`, el
> arnés de `detail-stack.guard.test.tsx` y `allTypeScriptFiles` ya existen en
> `e002a4a5`.

## T0 — Arranque y medida de la base (sin commit)

1. `git rev-parse --abbrev-ref HEAD` → `feature/149-mobile-sign-out-lands-on-welcome`.
2. `test ! -e .expo/types/router.d.ts && echo ausente` → `ausente`. Si existe,
   **para** y avisa (no lo borres; el humano lo quita).
3. Comprueba que no corre ningún `init.sh` (comparte Postgres/LocalStack con
   otros worktrees): `pgrep -af '[i]nit\.sh'` sin pipe; si sale algo, espera.
4. Mide la base **sin pipe**:

   ```bash
   bunx jest 'src/app/\(tabs\)/__tests__/layout.test.tsx' src/app/__tests__/detail-stack.guard.test.tsx src/app/__tests__/reminders-alerts-stack.navigation.test.tsx src/app/__tests__/index.test.tsx src/app/__tests__/layout.test.tsx src/__tests__/design-drift.test.ts; echo "exit=$?"
   ```

   Esperado en `e002a4a5`: `Test Suites: 6 passed, 6 total`,
   `Tests: 97 passed, 97 total`, `exit=0`. Reparto: `(tabs)/layout` 5, guarda 2,
   reminders-alerts 1, index 3, layout raíz 26, design-drift 60. Si no
   coincide, **para** y anota la cifra real en `progress/impl_mobile-sign-out-lands-on-welcome.md`.

## R1 — El layout de tabs redirige a welcome sin sesión

- [ ] (1) **Test rojo.** En `src/app/(tabs)/__tests__/layout.test.tsx`, dentro
  de `describe('R1: (tabs) exige sesión')`, el
  `it('redirects an unauthenticated session to login', …)` pasa a
  `it('#149 R1: redirects an unauthenticated session to welcome', …)` y su
  aserción `{ href: '/login' }` pasa a `{ href: '/welcome' }`. La aserción
  `expect(mockTabs).not.toHaveBeenCalled()` se queda. El `jest.mock` de
  `expo-router` del fichero **no cambia** (ya expone `Redirect` y `Tabs`).
  - Comando: `bunx jest 'src/app/\(tabs\)/__tests__/layout.test.tsx'` →
    1 fallo de 5, **por aserción** (`Expected: {"href": "/welcome"}`,
    `Received: {"href": "/login"}`).
  - Anclas tras el commit: `grep -cF "{ href: '/welcome' }" 'src/app/(tabs)/__tests__/layout.test.tsx'` → `1`;
    `grep -cF "{ href: '/login' }" 'src/app/(tabs)/__tests__/layout.test.tsx'` → `0`.
  - Commit: `test(mobile-auth): #149 R1 red, tabs layout redirects to welcome`.
- [ ] (2) **Implementación mínima.** En el commit verde común (ver §Verde).
- [ ] (3) **Refactor.** Ninguno previsto.

Sondas de mutación de R1 (las planta el reviewer en producción, una a una, y
las revierte con `git checkout HEAD -- <fichero>` + `git diff --cached --stat`
vacío):

| Id | Mutación en `src/app/(tabs)/_layout.tsx` | `it` que debe caer | Tipo de rojo |
|---|---|---|---|
| M1 | `href="/welcome"` → `href="/login"` | `#149 R1: redirects an unauthenticated session to welcome` | aserción |
| M2 | `href="/welcome"` → `href="/"` | el mismo | aserción (esperado, no medido) |
| M3 | `href={usePathname() === '/profile' ? '/welcome' : '/login'}` | el mismo | excepción (`usePathname` no está en el mock de `expo-router` de esa suite; esperado, no medido); R2 la caza por aserción |

## R2 — Cerrar sesión en cualquiera de las cinco tabs aterriza en welcome

- [ ] (1) **Test rojo.** En `src/app/__tests__/detail-stack.guard.test.tsx`,
  `describe` nuevo **al final del fichero**:
  `describe('#149 R2: cerrar sesión en una tab aterriza en welcome', …)` con
  `afterEach(() => jest.useRealTimers())` y un
  `it.each(['/home', '/map', '/health', '/food', '/profile'])('#149 R2: cierra sesión en %s y aterriza en welcome', async (href) => …)`.
  Cada fila:
  1. `mockAuthState = { status: 'authenticated', token: 'token-a' }`.
  2. `const app = renderRouter(routes(), { initialUrl: href });` y en la línea
     siguiente **`await app;`** (obligatorio: sin él, la fila N lee el pathname
     de la fila N−1; ver [[design]] §Evidencia).
  3. `await waitFor(() => expect(app.getPathname()).toBe(href))`.
  4. Cerrar sesión **igual que `#95 R3`**: asignar
     `mockAuthState = { status: 'unauthenticated', token: null }` y, dentro de
     `await act(async () => { … })`, llamar a cada función de
     `mockAuthListeners`.
  5. `await waitFor(() => expect(app.getPathname()).toBe('/welcome'))` y
     `expect(rootStack(app)).toEqual(['welcome'])`.

  Mocks: ninguno nuevo. Reutiliza el `jest.mock` de auth-provider, `routes()` y
  `rootStack()` del propio fichero. Anclas de que existen:
  `grep -cF 'const mockAuthListeners = new Set' src/app/__tests__/detail-stack.guard.test.tsx` → `1`;
  `grep -cF 'function rootStack(' src/app/__tests__/detail-stack.guard.test.tsx` → `1`.
  - Comando: `bunx jest src/app/__tests__/detail-stack.guard.test.tsx -t '#149 R2'`
    → 5 fallos de 5, **por aserción** (el `waitFor` agota con
    `Expected: "/welcome"`, `Received: "/login"`; medido en el spike).
  - Commit: `test(mobile-auth): #149 R2 red, sign-out from every tab lands on welcome`.
- [ ] (2) **Implementación mínima.** En el commit verde común.
- [ ] (3) **Refactor.** Ninguno previsto.

| Id | Mutación | `it` que debe caer | Tipo de rojo |
|---|---|---|---|
| M1 | `(tabs)/_layout.tsx`: `href` → `"/login"` | las 5 filas `#149 R2` | aserción (medido) |
| M2 | `(tabs)/_layout.tsx`: `href` → `"/"` | las 5 filas | aserción (pathname `/`, pila `['index']`; esperado, no medido) |
| M3 | `(tabs)/_layout.tsx`: `href={usePathname() === '/profile' ? '/welcome' : '/login'}` | filas `/home`, `/map`, `/health`, `/food` (la fila `/profile` pasa: por eso hay una fila por tab) | aserción (esperado, no medido) |

## R3 — Cerrar sesión en cualquiera de las doce rutas de detalle aterriza en welcome

- [ ] (1) **Test rojo.** Mismo fichero, `describe` nuevo tras el de R2:
  `describe('#149 R3: cerrar sesión en un detalle aterriza en welcome', …)`
  con `afterEach(() => jest.useRealTimers())` y
  `it.each([...])('#149 R3: cierra sesión en %s, aterriza en welcome y no reabre el detalle', async (href) => …)`
  sobre estas doce, en este orden: `'/add-reminder'`, `'/pets/add'`,
  `'/pets/pet-1/docs'`, `'/weight-log'`, `'/meal-schedule'`, `'/pairing'`,
  `'/reminders'`, `'/alerts'`, `'/alerts/alert-1'`,
  `'/pets/pet-1/geofences'`, `'/pets/pet-1/geofence-editor'`,
  `'/meals-history'`. Cada fila:
  1. Sesión iniciada, `renderRouter(routes(), { initialUrl: '/home' })`,
     **`await app;`**, `waitFor` pathname `'/home'`.
  2. `await act(async () => router.push(href as Href))` y `waitFor` pathname
     `href`.
  3. Cerrar sesión como en R2 (paso 4).
  4. `waitFor` pathname `'/welcome'` y `rootStack(app)` → `['welcome']`.
  5. Re-entrada: `await act(async () => router.push(href as Href))`, después
     `await act(async () => { for (let pass = 0; pass < 3; pass += 1) jest.runOnlyPendingTimers(); })`
     (la misma forma que `#105 R8`), y de nuevo pathname `'/welcome'` y pila
     `['welcome']`.

  En el mismo commit, reapunta los candados que esperan login **tras cerrar
  sesión** (sin renombrar sus `it`):
  - `describe('#95 R3: …')` de `src/app/__tests__/detail-stack.guard.test.tsx`:
    `toBe('/login')` → `toBe('/welcome')` (2), `toEqual(['(auth)'])` →
    `toEqual(['welcome'])` (2), `['(auth)', 'reset-password']` →
    `['welcome', 'reset-password']` (1).
  - `describe('#114 R2: …')` de `src/app/__tests__/reminders-alerts-stack.navigation.test.tsx`:
    `toBe('/login')` → `toBe('/welcome')` (2), `toEqual(['(auth)'])` →
    `toEqual(['welcome'])` (2).
  - **No toques** `describe('#105 R8: meals history requires a session')`.

  Anclas tras el commit:
  `grep -cF "toBe('/login')" src/app/__tests__/detail-stack.guard.test.tsx` → `2`;
  `grep -cF "toEqual(['(auth)'])" src/app/__tests__/detail-stack.guard.test.tsx` → `1`;
  `grep -cF "['welcome', 'reset-password']" src/app/__tests__/detail-stack.guard.test.tsx` → `1`;
  `grep -cF "toBe('/login')" src/app/__tests__/reminders-alerts-stack.navigation.test.tsx` → `0`;
  `grep -cF "toEqual(['(auth)'])" src/app/__tests__/reminders-alerts-stack.navigation.test.tsx` → `0`.
  - Comando: `bunx jest src/app/__tests__/detail-stack.guard.test.tsx src/app/__tests__/reminders-alerts-stack.navigation.test.tsx`
    → 19 fallos (5 de R2, 12 de R3, `#95 R3`, `#114 R2`), todos **por
    aserción**; `#105 R8` en verde.
  - Commit: `test(mobile-auth): #149 R3 red, sign-out from every detail lands on welcome`.
- [ ] (2) **Implementación mínima.** En el commit verde común.
- [ ] (3) **Refactor.** Ninguno previsto.

| Id | Mutación | `it` que debe caer | Tipo de rojo |
|---|---|---|---|
| M1 | `(tabs)/_layout.tsx`: `href` → `"/login"` | las 12 filas `#149 R3`, `#95 R3`, `#114 R2` | aserción (filas medidas en el spike) |
| M7 | `src/app/_layout.tsx`: sacar `meals-history` del `Stack.Protected` autenticado | fila `/meals-history` de `#149 R3` (el detalle no sale de la pila y el `Redirect` de tabs no dispara: `expo-router` lo lanza en `useFocusEffect`) y `#105 R8` | aserción (esperado, no medido) |

## R4 — Ningún fichero de producción navega a login salvo los cuatro declarados

- [ ] (1) **Test rojo.** En `src/__tests__/design-drift.test.ts`, `describe`
  nuevo **al final del fichero**, con la **misma forma** que
  `describe('#94 R10: la antigüedad de la posición se lee en un solo sitio')`
  (ancla: `grep -cF "describe('#94 R10" src/__tests__/design-drift.test.ts` → `1`):
  `describe('#149 R4: solo cuatro ficheros de producción navegan a login', …)`
  con un `it('#149 R4: inventaría cada ruta a login en producción', …)` que
  recorre `allTypeScriptFiles(sourceRoot)`, descarta `__tests__/` y
  `*.test.ts(x)`, cuenta `/['"`]\/(?:\(auth\)\/)?login\b/g` por fichero, se
  queda con los recuentos `>= 1` y hace `toEqual` contra este mapa literal (no
  importado de producción):

  ```ts
  {
    'app/(auth)/register.tsx': 1,
    'screens/forgot/index.tsx': 1,
    'screens/reset-password/index.tsx': 2,
    'screens/welcome/index.tsx': 1,
  }
  ```

  No toques el inventario `screenSignOutCalls` del mismo fichero.
  - Comando: `bunx jest src/__tests__/design-drift.test.ts -t '#149 R4'` →
    1 fallo, **por aserción** (el diff muestra la clave sobrante
    `"app/(tabs)/_layout.tsx": 1`).
  - Commit: `test(mobile-auth): #149 R4 red, only four production files route to login`.
- [ ] (2) **Implementación mínima.** En el commit verde común.
- [ ] (3) **Refactor.** Ninguno previsto.

| Id | Mutación | `it` que debe caer | Tipo de rojo |
|---|---|---|---|
| M1 | `(tabs)/_layout.tsx`: `href` → `"/login"` | `#149 R4` | aserción (clave `app/(tabs)/_layout.tsx` sobrante) |
| M4 | `src/screens/profile/index.tsx`: el botón hace `void signOut(); router.replace('/login');` | `#149 R4` (R2 no lo ve: la pantalla es un stub) | aserción (esperado, no medido) |
| M5 | `src/screens/weight-log/index.tsx`: `router.replace('/(auth)/login')` tras su `signOut` | `#149 R4` | aserción (esperado, no medido) |
| M6 | `src/providers/query-provider.tsx`: el callback del 401 hace también `router.replace('/login')` | `#149 R4` | aserción (esperado, no medido) |

## Verde común (R1–R4)

- [ ] En `src/app/(tabs)/_layout.tsx`, `<Redirect href="/login" />` →
  `<Redirect href="/welcome" />`. Nada más: sin comentario que cite la ruta
  vieja (R4 lo contaría).
  - Anclas: `grep -cF 'href="/welcome"' 'src/app/(tabs)/_layout.tsx'` → `1`;
    `grep -cF 'href="/login"' 'src/app/(tabs)/_layout.tsx'` → `0`.
  - Comando (sin pipe), el mismo de T0 → `Test Suites: 6 passed, 6 total`,
    `Tests: 115 passed, 115 total`, `exit=0` (guarda 2 → 19, design-drift
    60 → 61; las demás suites igual).
  - `bun run typecheck` y `bun run lint` en verde.
  - Commit: `fix(mobile-auth): #149 R1-R4 green, sign-out lands on welcome`.

## Cierre

- [ ] Diff contra `e002a4a5`, lista cerrada de ficheros:
  `src/app/(tabs)/_layout.tsx`, `src/app/(tabs)/__tests__/layout.test.tsx`,
  `src/app/__tests__/detail-stack.guard.test.tsx`,
  `src/app/__tests__/reminders-alerts-stack.navigation.test.tsx`,
  `src/__tests__/design-drift.test.ts`,
  `specs/mobile-sign-out-lands-on-welcome/traceability.md` y
  `progress/impl_mobile-sign-out-lands-on-welcome.md`. Cualquier otro fichero
  es un hallazgo.
- [ ] Sin diff en NR1–NR5 de [[requirements]]:
  `git diff --stat e002a4a5 -- src/app/index.tsx src/app/_layout.tsx src/app/__tests__/index.test.tsx src/app/__tests__/layout.test.tsx src/screens/welcome src/i18n src/providers package.json bun.lock`
  → vacío.
- [ ] `traceability.md` con test y commit por requisito.
- [ ] Gate completo: `./init.sh` (lo corre el leader o el humano, no el
  implementador si el clasificador lo deniega).
- [ ] Prueba de humo P1–P4 y S1–S5 de [[requirements]]: la hace el humano.

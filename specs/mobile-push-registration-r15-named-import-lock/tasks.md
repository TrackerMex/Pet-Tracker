---
feature: "mobile-push-registration-r15-named-import-lock"
status: approved           # draft | spec_ready | approved
tags: [spec, mobile, test, deuda]
---

# Tareas — [[mobile-push-registration-r15-named-import-lock]] (#137 y #139)

> Orden TDD por requisito: (1) test rojo, (2) implementación mínima,
> (3) refactor. R1 y R2 son candados sobre código ya correcto (C4, vía **b**):
> cada commit rojo lleva una **mutación versionada** y su commit verde la
> revierte ([[design]] D4). R3 es el cierre medido. El orden es R1 → R2
> ([[design]] D3); no lo inviertas.
>
> Cada requisito crea su sujeto antes de aseverarlo: R1 solo cambia la fábrica
> de un `jest.doMock` que ya existe; R2 añade la constante
> `headerNotificationsModule` **en el mismo commit** que el `describe` que la
> usa.
>
> Las rutas son relativas a `mobile-pet-tracker/` salvo que empiecen por
> `docs/`, `specs/` o `progress/`. **«El test»** es
> `src/hooks/use-push-registration.test.tsx` y **«el hook»**,
> `src/hooks/use-push-registration.ts`. Ninguna ruta lleva paréntesis. Los
> números de línea **no son anclas**: todo se localiza por contenido con
> `grep -cF`, que tiene que dar `1`. `$OUT` es un directorio de trabajo fuera
> del repo (p. ej. `OUT=/tmp/impl137; mkdir -p "$OUT"`); nada de `$OUT` se
> commitea.
>
> Los bloques de código se copian **literales**, con su sangría (espacios, no
> tabuladores).

## Antes de tocar nada

1. `git branch --show-current` da `feature/137-mobile-push-registration-r15-named-import-lock`.
   Si no, **para**.
2. Lee la casilla de [[requirements]] §Aprobación. Si no está marcada, **para**.
3. `git log -1 --format=%h origin/main` y `git merge-base HEAD origin/main`:
   anota los dos. La spec se midió sobre `70e1fdcb`. Si `origin/main` avanzó,
   `<base>` es el merge-base, no `70e1fdcb`.
4. `cd mobile-pet-tracker && test ! -e .expo/types/router.d.ts; echo "exit=$?"`
   da `exit=0`. Si da 1, **para** y avisa al humano: el fichero está
   gitignorado y rompe `tsc` con rutas fantasma. No lo borres tú.
5. **No cargues ninguna skill de expo, no hay ninguna para esto**: de las 13
   de tu plugin `expo` ninguna trata mocks de jest, y todo lo que necesitas
   está aquí. Usa solo `bun` y `bunx`, nunca `npm` ni `npx`. No instales nada.
   **No corras `./init.sh`** ni los e2e.
6. Mide la base, **sin pipe** detrás de `jest` (el `exit` sería el del último
   comando):

   ```bash
   bunx jest src/hooks/use-push-registration.test.tsx --json --outputFile="$OUT/titles_base.json" > "$OUT/base_file.log" 2>&1; echo "exit=$?"
   bunx jest > "$OUT/base_suite.log" 2>&1; echo "exit=$?"
   grep -E "^(Tests|Test Suites):" "$OUT/base_file.log" "$OUT/base_suite.log"
   jq -r '.testResults[].assertionResults[].fullName' "$OUT/titles_base.json" | sort > "$OUT/titles_base.txt"; wc -l < "$OUT/titles_base.txt"
   ```

   Esperado (2026-09-29, `70e1fdcb`): el test, `Test Suites: 1 passed`,
   `Tests: 52 passed, 52 total`, `exit=0`; la suite, 86 suites y 1609 tests
   passed, `exit=0`; 52 títulos. Si alguna cifra es otra con `exit=0` (otra
   feature mergeó), **anótala y úsala como base**: abajo todo va como
   «base + n». Si algo da `exit≠0`, **para** y repórtalo con el log.
7. Anclas. Cada una tiene que dar `1`; si no, la base cambió: **para**.

   ```bash
   grep -cF "const notificationMocks = [" src/hooks/use-push-registration.test.tsx
   grep -cF "new Proxy(" src/hooks/use-push-registration.test.tsx
   grep -cF "      jest.doMock('expo-notifications', () => headerNotifications);" src/hooks/use-push-registration.test.tsx
   grep -cF "describe('#133 R1: tras R15, el hook recibe el mock de expo-notifications de la cabecera'" src/hooks/use-push-registration.test.tsx
   grep -cF "it('no accede a expo-notifications al importar el modulo'" src/hooks/use-push-registration.test.tsx
   grep -cF "import type { NotificationResponse } from 'expo-notifications';" src/hooks/use-push-registration.ts
   grep -cF "    Notifications.setNotificationHandler({" src/hooks/use-push-registration.ts
   ```

   Y `grep -n "^describe(" src/hooks/use-push-registration.test.tsx | tail -1`
   muestra el `describe` de `#133 R1`: hoy es el último del fichero.
8. **Literales**: en el código nuevo, un `#` solo puede ir seguido de
   `137 R1` o `139 R2`, también en comentarios. Nada de `#137` o `#133`
   sueltos: lo caza el grep-clean de R3.6 y el patrón de
   `src/__tests__/design-drift.test.ts`.

## R1 (#137) — R15 lanza en el propio `require`

### (1) Rojo, con la mutación S3 versionada

**En el test**, dentro del `it('no accede a expo-notifications al importar el modulo', …)`
de R15, sustituye este bloque (ancla: `new Proxy(`; 10 espacios de sangría en
la primera línea):

```ts
          jest.doMock(
            'expo-notifications',
            () =>
              new Proxy(
                {},
                {
                  get() {
                    throw expoGoImportError;
                  },
                },
              ),
          );
```

por este:

```ts
          // Lanza en el propio require, no al leer una propiedad: un import
          // con nombre no lee ninguna al importarse (#137 R1).
          jest.doMock('expo-notifications', () => {
            throw expoGoImportError;
          });
```

Nada más cambia en el test: ni el título del `it`, ni `expoGoImportError`, ni
la captura `headerNotifications`, ni `jest.resetModules()`, ni el `try` y su
`finally`, ni `jest.requireActual('./use-push-registration')`.

**En el hook**, la mutación S3 (versionada, la revierte el verde):

- cambia `import type { NotificationResponse } from 'expo-notifications';` por
  `import { type NotificationResponse, setNotificationHandler } from 'expo-notifications';`
- cambia `    Notifications.setNotificationHandler({` (4 espacios) por
  `    setNotificationHandler({` (4 espacios).

Mide:

```bash
bunx jest src/hooks/use-push-registration.test.tsx > "$OUT/r1_red.log" 2>&1; echo "exit=$?"
grep -E "^Tests:|●" "$OUT/r1_red.log"
```

Esperado (medido): `exit=1`; `Tests: 1 failed, 51 passed, 52 total` (base − 1
passed, base total). El único `●` es
`R15: importar el modulo no toca expo-notifications › no accede a expo-notifications al importar el modulo`,
y su error es **por aserción**: `expect(received).not.toThrow()` con
`Error message: "expo-notifications unavailable in Expo Go"`. `#133 R1` sigue
verde. Si el rojo es otro, **para** y repórtalo.

Commit, el test y el hook:

```
test(mobile): expose the R15 named import blind spot with a versioned mutation (R1)
```

### (2) Verde, revirtiendo S3

Deshaz en el hook, a mano, las dos ediciones de S3 (las dos líneas vuelven a
`import type { NotificationResponse } from 'expo-notifications';` y
`    Notifications.setNotificationHandler({`). El test no se toca. Mide, desde
`mobile-pet-tracker/`:

```bash
git diff --exit-code <base> -- src/hooks/use-push-registration.ts > /dev/null; echo "hook=$?"
bunx jest src/hooks/use-push-registration.test.tsx > "$OUT/r1_green.log" 2>&1; echo "exit=$?"
grep -E "^Tests:" "$OUT/r1_green.log"
```

Esperado (medido): `hook=0` (el hook es idéntico al de la base); `exit=0`,
`Tests: 52 passed, 52 total` (base).

Commit, solo el hook:

```
test(mobile): lock R15 against a named expo-notifications import (R1)
```

### (3) Refactor

Ninguno. No muevas R15 ni ningún `describe`, y no cambies el título del `it`.

## R2 (#139) — Tras R15 vuelve el mismo objeto de cabecera

### (1) Rojo, con la mutación O1 versionada

Tres ediciones en el test, nada en el hook.

**a.** Justo **encima** de la línea `const notificationMocks = [`, inserta:

```ts
// El objeto que construyo la fabrica de la cabecera. R15 registra otra
// fabrica y la restaura en su finally: tras R15 tiene que volver este mismo
// objeto, no una copia (#139 R2).
const headerNotificationsModule =
  jest.requireMock<typeof Notifications>('expo-notifications');
```

**b.** **Al final del fichero**, detrás del `});` que cierra
`describe('#133 R1: tras R15, el hook recibe el mock de expo-notifications de la cabecera', …)`,
con una línea en blanco de separación, añade:

```ts
describe('#139 R2: tras R15, expo-notifications vuelve a ser el objeto de la cabecera', () => {
  it('jest.requireMock devuelve el mismo objeto, no una copia', () => {
    expect(jest.requireMock('expo-notifications')).toBe(
      headerNotificationsModule,
    );
  });
});
```

**c.** La mutación O1 (versionada, la revierte el verde): en el `finally` de
R15 cambia

```ts
      jest.doMock('expo-notifications', () => headerNotifications);
```

por

```ts
      jest.doMock('expo-notifications', () => ({ ...headerNotifications, AndroidImportance: { MAX: 5 } }));
```

Mide:

```bash
bunx jest src/hooks/use-push-registration.test.tsx > "$OUT/r2_red.log" 2>&1; echo "exit=$?"
grep -E "^Tests:|●" "$OUT/r2_red.log"
grep -A 12 "● #139 R2" "$OUT/r2_red.log"
```

Esperado (medido): `exit=1`; `Tests: 1 failed, 52 passed, 53 total` (base
passed, base + 1 total). El único `●` es
`#139 R2: tras R15, expo-notifications vuelve a ser el objeto de la cabecera › jest.requireMock devuelve el mismo objeto, no una copia`,
**por aserción**: `expect(received).toBe(expected) // Object.is equality`, y
el diff muestra `-     "MAX": 7,` / `+     "MAX": 5,`. `#133 R1` y R15 siguen
verdes. Si el rojo es otro, **para**.

Commit, solo el test:

```
test(mobile): expose the R15 restore identity gap with a versioned mutation (R2)
```

### (2) Verde, revirtiendo O1

Devuelve la línea del `finally` a
`      jest.doMock('expo-notifications', () => headerNotifications);`. Nada más.
Mide:

```bash
bunx jest src/hooks/use-push-registration.test.tsx > "$OUT/r2_green.log" 2>&1; echo "exit=$?"
grep -E "^Tests:" "$OUT/r2_green.log"
grep -cF "      jest.doMock('expo-notifications', () => headerNotifications);" src/hooks/use-push-registration.test.tsx
grep -n "^describe(" src/hooks/use-push-registration.test.tsx | tail -1
```

Esperado (medido): `exit=0`, `Tests: 53 passed, 53 total` (base + 1); el
`grep -cF` da `1`; el último `describe` es el de `#139 R2`.

Commit, solo el test:

```
test(mobile): lock the R15 restore to the header module identity (R2)
```

### (3) Refactor

Ninguno. No factorices `headerNotificationsModule` con la captura
`headerNotifications` de R15: son dos momentos distintos (carga del fichero y
antes del reset) y la sonda H5 depende de que la de R15 siga donde está.

## Sondas

Sobre el árbol del verde de R2, **una sonda cada vez**:

1. Aplica la edición de la tabla. Todo texto citado aparece **una sola vez**:
   compruébalo con `grep -cF` antes de editar.
2. `bunx jest src/hooks/use-push-registration.test.tsx > "$OUT/sonda_<id>.log" 2>&1; echo "exit=$?"`
3. Anota `exit`, la línea `Tests:`, cada `●` y **la primera línea de su
   error**. `expect(received).<matcher>` o `expect(jest.fn()).<matcher>` es
   rojo **por aserción**; un mensaje sin `expect` delante es rojo **por
   excepción**.
4. Restaura desde la raíz del repo con
   `git checkout HEAD -- mobile-pet-tracker/src/hooks/use-push-registration.ts mobile-pet-tracker/src/hooks/use-push-registration.test.tsx mobile-pet-tracker/src/api/push-tokens.ts`
   (con `HEAD`; `git checkout --` a secas conservaría un índice sucio).
5. `git diff --quiet; echo "diff=$?"` y `git diff --cached --quiet; echo "cached=$?"`
   dan `0` los dos.

**Nada de esto se commitea.** Si una fila da otro veredicto, **para** y
repórtalo con el log; no ajustes el test para que case.

Nombres: «la línea del tipo» es, en el hook,
`type NotificationsModule = typeof import('expo-notifications');`; «la línea
del `import type`» es `import type { NotificationResponse } from 'expo-notifications';`;
«la llamada» es `    Notifications.setNotificationHandler({` (4 espacios);
«la restauración» es, en el test,
`      jest.doMock('expo-notifications', () => headerNotifications);` (6
espacios). «R15» es el `it` `no accede a expo-notifications al importar el modulo`;
«#133 R1» y «#139 R2», los `it` de esos `describe`. Las cifras son las de hoy
(53 tests); con otra base, «1 failed, 52 passed» es «1 failed, base passed».

### En producción: R1 (#137)

| Id | Edición | Esperado (medido) | Tipo de rojo |
|---|---|---|---|
| S1 | debajo de la línea del tipo, inserta `(require('expo-notifications') as NotificationsModule).setNotificationHandler(null);` | `exit=1`, `1 failed, 52 passed`; solo R15 | aserción: `expect(received).not.toThrow()` |
| S2 | debajo de la línea del tipo, inserta `const CHANNEL_IMPORTANCE = (require('expo-notifications') as NotificationsModule).AndroidImportance.MAX;` **y** cambia `importance: Notifications.AndroidImportance.MAX,` por `importance: CHANNEL_IMPORTANCE,` | igual que S1 | aserción |
| S3 | cambia la línea del `import type` por `import { type NotificationResponse, setNotificationHandler } from 'expo-notifications';` **y** la llamada por `    setNotificationHandler({` | igual que S1 | aserción |
| S4 | encima de la línea del `import type`, inserta `import * as StaticNotifications from 'expo-notifications';` **y** cambia la llamada por `    StaticNotifications.setNotificationHandler({` | igual que S1 | aserción |
| O3 | encima de la línea del `import type`, inserta `import ExpoNotificationsDefault from 'expo-notifications';` **y** cambia la llamada por `    ExpoNotificationsDefault.setNotificationHandler({` | igual que S1 | aserción |
| S6 (ciega para el `Proxy` de antes) | encima de la línea del `import type`, inserta `import 'expo-notifications';` | igual que S1 | aserción |
| S7 (control) | cambia la línea del `import type` por `import { type NotificationResponse } from 'expo-notifications';` | **`exit=0`**, `53 passed`: un import solo de tipos no deja `require` | — |
| S5 (zona ciega de R1) | en `src/api/push-tokens.ts`, encima de `import { deleteJson, postJson } from './http';`, inserta `import 'expo-notifications';` | **`exit=0`**, `53 passed`: el test mockea `../api/push-tokens` y su código no se evalúa. Límite de [[requirements]] §Qué firma, punto 3 | — |

### En el test: R2 (#139) y la restauración de #133

| Id | Edición | Esperado (medido) | Tipo de rojo |
|---|---|---|---|
| O1 | cambia la restauración por `      jest.doMock('expo-notifications', () => ({ ...headerNotifications, AndroidImportance: { MAX: 5 } }));` | `exit=1`, `1 failed, 52 passed`; solo `#139 R2` | aserción: `expect(received).toBe(expected) // Object.is equality` |
| O4 (ciega para un candado por campos) | cambia la restauración por `      jest.doMock('expo-notifications', () => ({ ...headerNotifications }));` | igual que O1 | aserción |
| O5 (ciega para un candado por campos) | cambia la restauración por `      jest.doMock('expo-notifications', () => Notifications);` | igual que O1 | aserción |
| O6 | cambia la restauración por `      jest.doMock('expo-notifications', () => ({ ...headerNotifications, AndroidImportance: { MAX: 7 } }));` | igual que O1 | aserción |
| H1 | borra la restauración | `exit=1`, `2 failed, 51 passed`: `#133 R1` y `#139 R2` | los dos por excepción: `expo-notifications unavailable in Expo Go` |
| H2 | cambia la restauración por `      jest.dontMock('expo-notifications');` | `exit=1`, `2 failed, 51 passed` | `#133 R1` por aserción (`expect(jest.fn()).toHaveBeenCalledWith(...expected)`); `#139 R2` por excepción (`expo-notifications unavailable in Expo Go`) |
| H3 | cambia la restauración por `      jest.doMock('expo-notifications', () => ({ ...headerNotifications, getLastNotificationResponseAsync: jest.fn(async () => null) }));` | `exit=1`, `2 failed, 51 passed` | los dos por aserción: `expect(jest.fn()).toHaveBeenCalled()` en `#133 R1`; `toBe` en `#139 R2` |
| H5 | mueve las dos líneas `    const headerNotifications =` y `      jest.requireMock<typeof Notifications>('expo-notifications');` de R15 a **después** de `    jest.resetModules();` | `exit=1`, `2 failed, 51 passed` | `#133 R1` por excepción (`AggregateError`, desde React); `#139 R2` por aserción (`toBe`) |
| H4+S3 | borra `    jest.resetModules();` de R15 **y** aplica S3 en el hook | **`exit=0`**, `53 passed`: sin el reset R15 es tautológico (P3 de #133, fuera de alcance) | — |
| H4+O1 | borra `    jest.resetModules();` de R15 **y** aplica O1 | **`exit=0`**, `53 passed`: sin el reset la cache conserva el objeto de cabecera y el de O1 no llega a nadie; es correcto | — |

## R3 — Cierre medido

Sobre el árbol del verde de R2, sin sondas aplicadas:

1. **Diff de producción vacío** (R3.1; desde la raíz):

   ```bash
   git diff --name-only <base>..HEAD -- mobile-pet-tracker/
   ```

   Esperado: una sola línea, `mobile-pet-tracker/src/hooks/use-push-registration.test.tsx`.
2. **Títulos: base + 1, ninguno renombrado** (R3.2; desde `mobile-pet-tracker/`):

   ```bash
   bunx jest src/hooks/use-push-registration.test.tsx --json --outputFile="$OUT/titles_final.json" > "$OUT/final_file.log" 2>&1; echo "exit=$?"
   jq -r '.testResults[].assertionResults[].fullName' "$OUT/titles_final.json" | sort > "$OUT/titles_final.txt"
   diff "$OUT/titles_base.txt" "$OUT/titles_final.txt"; echo "diff=$?"
   ```

   Esperado (medido): `exit=0`, 53 títulos (base + 1) y `diff=1` con una
   cabecera de `diff` (hoy `11a12`) y **una sola** línea `>`, ninguna `<`:
   `> #139 R2: tras R15, expo-notifications vuelve a ser el objeto de la cabecera jest.requireMock devuelve el mismo objeto, no una copia`
   (jest une `describe` e `it` con un espacio en `fullName`).
3. **Tamaño del diff** (R3.3; desde la raíz):

   ```bash
   git diff --stat <base>..HEAD -- mobile-pet-tracker/src/hooks/use-push-registration.test.tsx
   ```

   Esperado (medido en la copia): `1 file changed, 18 insertions(+), 12 deletions(-)`.
   Las 12 líneas borradas son el `jest.doMock(` del `Proxy`.
4. **Suite completa, sin pipe** (R3.4 y R3.5; desde `mobile-pet-tracker/`):

   ```bash
   bunx jest > "$OUT/final_suite.log" 2>&1; echo "exit=$?"
   grep -E "^(Tests|Test Suites):" "$OUT/final_suite.log"
   ```

   Esperado (medido en la copia): `exit=0`; `Test Suites: 86 passed, 86 total`
   (base); `Tests: 1610 passed, 1610 total` (base + 1).
5. **Tipos y lint** (R3.5; desde `mobile-pet-tracker/`):

   ```bash
   test ! -e .expo/types/router.d.ts; echo "router=$?"
   bunx tsc --noEmit > "$OUT/tsc.log" 2>&1; echo "exit=$?"
   bunx eslint src/hooks/use-push-registration.test.tsx > "$OUT/eslint.log" 2>&1; echo "exit=$?"
   ```

   Esperado (medido): `router=0` y `exit=0` los dos. Si `router=1`, **para**
   y avisa al humano; no borres el fichero.
6. **Grep-clean** (R3.6) de `docs/ui-guidelines.md` sobre las líneas añadidas (desde
   la raíz; aquí el `exit` que cuenta es el del último `grep`, y `1` significa
   «sin coincidencias»):

   ```bash
   git diff -U0 <base>..HEAD -- mobile-pet-tracker/src | grep '^+' | grep -v '^+++' | grep -iP '#(?!\d{2,3} R\d)[\da-f]{3,8}\b|[A-Za-z0-9_-]+-\[[^\]]+\]|StyleSheet|shadowColor|shadowOffset|shadowOpacity|shadowRadius|\belevation\s*:'; echo "exit=$?"
   ```

   Esperado (medido): ninguna línea impresa y `exit=1`.
7. Escribe `progress/impl_mobile-push-registration-r15-named-import-lock.md`
   con: la base medida (commit y cifras), el rojo y el verde de R1 y de R2
   (líneas `Tests:` y el primer error de cada rojo), la tabla de sondas con
   una columna «medido» rellena, las seis medidas de R3 con sus `exit`, y qué
   skills cargaste (ninguna). Rellena [[traceability]].

   Commit, solo esos dos ficheros:

   ```
   docs(mobile): record the R15 named import and restore identity evidence (R1,R2,R3)
   ```

## Lo que NO hay que tocar

- `src/hooks/use-push-registration.ts` ni ningún otro fichero de producción,
  salvo la mutación S3 del commit rojo de R1, que el verde revierte.
- `src/hooks/use-push-registration.navigation.test.tsx`.
- Los títulos de los `describe` e `it` existentes, su orden y su posición. R15
  y `#133 R1` siguen donde están.
- `jest.config`, `test/jest-setup.js`, `package.json`, `bun.lock`.
- Las specs de #79 y #133, aunque la de #133 diga en su R2 y su D2 lo que
  ahora cierra R2 ([[requirements]] §Fuera de alcance).
- `feature_list.json`, `progress/current.md`, `progress/history.md` y
  `STATUS.md`: los cierra el leader.
- **No** corras `./init.sh`, **no** hagas push y **no** abras la PR.

---
feature: "mobile-push-registration-r15-domock-scope"
status: spec_ready       # draft | spec_ready | approved
tags: [spec, mobile, test, deuda]
---

# Tareas — [[mobile-push-registration-r15-domock-scope]] (#133)

> Orden TDD por requisito: (1) test rojo, (2) implementación mínima,
> (3) refactor. R1 tiene rojo real (C4, vía **a**): el test nuevo falla por
> el defecto que el verde arregla, no por un `ReferenceError` ni por un doble
> mutado. R2 es un requisito de verificación y se cierra por mutación (C4, vía
> **b**), sin commit rojo. R3 es el cierre medido.
>
> R1 crea su sujeto: el `describe` nuevo solo usa lo que la cabecera del
> fichero ya define (`notificationMocks`, `permission`, `mockGetPermissions`,
> `mockRequestPermissions`, `mockRegisterPushToken`, `usePushRegistration`,
> `renderHook`, `waitFor`) y lo que pone su `beforeEach`.
>
> Las rutas son relativas a `mobile-pet-tracker/` salvo que empiecen por
> `docs/`, `specs/` o `progress/`. **«El test»** es
> `src/hooks/use-push-registration.test.tsx` y **«el hook»**,
> `src/hooks/use-push-registration.ts`. Ninguna ruta lleva paréntesis. Los
> números de línea **no son anclas**: todo se localiza por contenido.
> `$OUT` es un directorio de trabajo fuera del repo (p. ej.
> `OUT=/tmp/impl133; mkdir -p "$OUT"`); nada de `$OUT` se commitea.

## Antes de tocar nada

1. `git branch --show-current` da `feature/133-mobile-push-registration-r15-domock-scope`.
   Si no, **para**.
2. Lee la casilla de [[requirements]] §Aprobación. Si no está marcada, **para**.
3. `git log -1 --format=%h origin/main` y `git merge-base HEAD origin/main`:
   anota los dos. La spec se midió sobre `073fa6cb`. Si `origin/main` avanzó,
   la base de R3.1 es el merge-base, no `073fa6cb`.
4. `cd mobile-pet-tracker && test ! -e .expo/types/router.d.ts; echo "exit=$?"`
   da `exit=0`. Si da 1, **para** y avisa al humano: el fichero está gitignorado
   y rompe `tsc` con rutas fantasma. No lo borres tú: tu sandbox lo deniega.
5. Carga la skill `building-native-ui` de tu plugin `expo`. Esta feature no
   cambia UI: todo lo que necesitas está aquí. Usa solo `bun` y `bunx`, nunca
   `npm` ni `npx`. No instales nada. **No corras `./init.sh`** ni los e2e.
6. Mide la base, **sin pipe** detrás de `jest` (el `exit` sería el del último
   comando):

   ```bash
   bunx jest src/hooks/use-push-registration.test.tsx --json --outputFile="$OUT/titles_base.json" > "$OUT/base_file.log" 2>&1; echo "exit=$?"
   bunx jest > "$OUT/base_suite.log" 2>&1; echo "exit=$?"
   grep -E "^(Tests|Test Suites):" "$OUT/base_file.log" "$OUT/base_suite.log"
   jq -r '.testResults[].assertionResults[].fullName' "$OUT/titles_base.json" | sort > "$OUT/titles_base.txt"; wc -l < "$OUT/titles_base.txt"
   ```

   Esperado (medido el 2026-09-29 sobre `073fa6cb`): el test, 51 passed de 51,
   `exit=0`; la suite, 86 suites y 1608 tests passed, `exit=0`; 51 títulos.
   Si el test o la suite dan otra cifra con `exit=0` (porque otra feature
   mergeó), **anota la medida y úsala como base**: todo lo de abajo se expresa
   como «base + n». Si alguno da `exit≠0`, **para** y repórtalo con el log.
7. `grep -c "jest.doMock" src/hooks/use-push-registration.test.tsx` da `1`, y
   `grep -n "describe('R15: importar el modulo no toca expo-notifications'" src/hooks/use-push-registration.test.tsx`
   encuentra una línea: la del **último** `describe` del fichero. Si no, la base
   cambió: **para**.
8. **Literales**: en el código nuevo, un `#` solo puede ir seguido de tres
   dígitos, un espacio y `R<n>` (`#133 R1`), también en comentarios. Nada de
   `#133` suelto: lo caza el grep-clean de R3.6 y el patrón de
   `src/__tests__/design-drift.test.ts`.

## R1 — Tras R15, el hook recibe el mock de cabecera

### (1) Rojo

Añade **al final del test**, detrás del `});` que cierra
`describe('R15: importar el modulo no toca expo-notifications', …)`, con una
línea en blanco de separación, exactamente este bloque:

```ts
describe('#133 R1: tras R15, el hook recibe el mock de expo-notifications de la cabecera', () => {
  it('llama a cada jest.fn de la cabecera y registra el token', async () => {
    mockGetPermissions.mockResolvedValue(permission(false, true));
    mockRequestPermissions.mockResolvedValue(permission(true, true));

    await renderHook(() => usePushRegistration());

    await waitFor(() => {
      expect(mockRegisterPushToken).toHaveBeenCalledWith(
        'http://example.test/v1',
        'jwt-token',
        { expoToken: 'ExpoPushToken[xxx]', platform: 'android' },
      );
    });
    for (const mock of notificationMocks) {
      expect(mock).toHaveBeenCalled();
    }
  });
});
```

Nada más cambia en este commit. Mide:

```bash
bunx jest src/hooks/use-push-registration.test.tsx > "$OUT/red.log" 2>&1; echo "exit=$?"
grep -E "^Tests:|●" "$OUT/red.log"
```

Esperado: `exit=1`; `Tests: 1 failed, <base> passed, <base + 1> total` (hoy
`1 failed, 51 passed, 52 total`). El único `●` es
`#133 R1: tras R15, el hook recibe el mock de expo-notifications de la cabecera › llama a cada jest.fn de la cabecera y registra el token`,
y su error es **una excepción, no una aserción**: la primera línea tras el
título es `expo-notifications unavailable in Expo Go` (sin
`expect(received)…` delante) y la traza señala el `new Error(` de R15. Si el
rojo es otro (una aserción, otro `it`, más de uno), **para** y repórtalo.

Commit, solo el test:

```
test(mobile): expose the R15 expo-notifications mock leak to later describes (R1)
```

### (2) Verde

Solo en el `it('no accede a expo-notifications al importar el modulo', …)` de
R15. Hoy su cuerpo, tras declarar `expoGoImportError`, es:

```ts
    jest.resetModules();

    expect(() =>
      jest.isolateModules(() => {
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

        jest.requireActual('./use-push-registration');
      }),
    ).not.toThrow();
```

Sustitúyelo por:

```ts
    const headerNotifications =
      jest.requireMock<typeof Notifications>('expo-notifications');

    jest.resetModules();

    try {
      expect(() =>
        jest.isolateModules(() => {
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

          jest.requireActual('./use-push-registration');
        }),
      ).not.toThrow();
    } finally {
      // jest.doMock es global al fichero: los describe posteriores vuelven a
      // recibir el mock de la cabecera (#133 R1).
      jest.doMock('expo-notifications', () => headerNotifications);
    }
```

El orden importa: `jest.requireMock` va **antes** de `jest.resetModules()`
(sonda H5). La declaración de `expoGoImportError` y el título del `it` no
cambian. `Notifications` es el `import * as Notifications from 'expo-notifications'`
que el test ya tiene en cabecera.

Mide:

```bash
bunx jest src/hooks/use-push-registration.test.tsx > "$OUT/green.log" 2>&1; echo "exit=$?"
grep -E "^Tests:" "$OUT/green.log"
git diff -w HEAD~1 -- src/hooks/use-push-registration.test.tsx
```

Esperado: `exit=0`, `<base + 1> passed` (hoy 52). En el `git diff -w` solo
aparecen como líneas nuevas la captura, el `try {`, el `} finally {`, el
comentario, el `jest.doMock(… headerNotifications)` y la `}` final: el `Proxy`,
el `resetModules` y el `requireActual` no salen (solo cambió su sangría). El
diff sin `-w` sale más grande por la re-indentación; es esperado.

Commit, solo el test:

```
test(mobile): scope the R15 expo-notifications doMock to its own test (R1)
```

### (3) Refactor

Ninguno. No muevas R15 ni ningún otro `describe`, no factorices el mock de
cabecera a una constante y no toques el `describe` nuevo.

## R2 — R15 sigue siendo un candado real (sondas)

Sobre el árbol del verde, **una sonda cada vez**:

1. Aplica la edición de la tabla (buscando el texto citado, que aparece **una
   sola vez**; compruébalo con `grep -c`).
2. `bunx jest src/hooks/use-push-registration.test.tsx > "$OUT/sonda_<id>.log" 2>&1; echo "exit=$?"`
3. Anota `exit`, la línea `Tests:`, cada `●` y **la primera línea de su
   error**. `expect(received).<matcher>` o `Expected…/Received…` bajo un
   `expect` es rojo **por aserción**; un mensaje sin `expect` delante es rojo
   **por excepción**.
4. Restaura con `git checkout HEAD -- mobile-pet-tracker/src/hooks/use-push-registration.ts mobile-pet-tracker/src/hooks/use-push-registration.test.tsx`
   (desde la raíz; con `HEAD`, no `git checkout --` a secas, que conservaría
   un índice sucio).
5. `git diff --quiet; echo "diff=$?"` y `git diff --cached --quiet; echo "cached=$?"`
   dan `0` los dos.

**Nada de esto se commitea.** Si una fila da otro veredicto, **para** y
repórtalo con el log; no ajustes el test para que case.

«La línea del tipo» es, en el hook,
`type NotificationsModule = typeof import('expo-notifications');`.
«R15» es `R15: importar el modulo no toca expo-notifications › no accede a expo-notifications al importar el modulo`
y «R1» es el `it` de #133. `<b>` es la base del test (hoy 51).

### En producción (el hook): R2

| Id | Edición | Esperado |
|---|---|---|
| S1 | debajo de la línea del tipo, inserta `(require('expo-notifications') as NotificationsModule).setNotificationHandler(null);` | `exit=1`, `1 failed, <b> passed`; solo R15, **por aserción** (`expect(received).not.toThrow()`, `Error message: "expo-notifications unavailable in Expo Go"`); R1 verde |
| S2 (zona ciega) | debajo de la línea del tipo, inserta `const CHANNEL_IMPORTANCE = (require('expo-notifications') as NotificationsModule).AndroidImportance.MAX;` **y** cambia `importance: Notifications.AndroidImportance.MAX,` por `importance: CHANNEL_IMPORTANCE,` | igual que S1 |
| S4 | encima de `import type { NotificationResponse } from 'expo-notifications';`, inserta `import * as StaticNotifications from 'expo-notifications';` **y** cambia `    Notifications.setNotificationHandler({` (4 espacios) por `    StaticNotifications.setNotificationHandler({` | igual que S1 |
| S3 (límite) | cambia `import type { NotificationResponse } from 'expo-notifications';` por `import { type NotificationResponse, setNotificationHandler } from 'expo-notifications';` **y** `    Notifications.setNotificationHandler({` por `    setNotificationHandler({` | **`exit=0`**, `<b + 1> passed`: R15 no ve un `import` con nombre sin acceso a propiedad. Es el límite P4 de [[requirements]]; se documenta, no se arregla |

### En el test: R1 no es tautológico y D1 es el arreglo correcto

| Id | Edición | Esperado |
|---|---|---|
| H1 | borra la línea `      jest.doMock('expo-notifications', () => headerNotifications);` | `exit=1`, `1 failed`; solo R1, **por excepción** (`expo-notifications unavailable in Expo Go`) |
| H2 | cambia esa línea por `      jest.dontMock('expo-notifications');` | `exit=1`, `1 failed`; solo R1, **por aserción** (`toHaveBeenCalledWith` sobre `mockRegisterPushToken`, `Number of calls: 0`) |
| H3 | cambia esa línea por `      jest.doMock('expo-notifications', () => ({ ...headerNotifications, getLastNotificationResponseAsync: jest.fn(async () => null) }));` | `exit=1`, `1 failed`; solo R1, **por aserción** (`toHaveBeenCalled` en el bucle, `Received number of calls: 0`) |
| H4 | borra la línea `    jest.resetModules();` del `it` de R15 | **`exit=0`**, todo verde |
| H4+S1 | H4 en el test **y** S1 en el hook | **`exit=0`**, todo verde: sin el reset, R15 es tautológico (P3) |
| H4+S2 | H4 en el test **y** S2 en el hook | **`exit=0`**, todo verde (P3) |
| H5 | mueve el bloque `const headerNotifications = jest.requireMock<…>('expo-notifications');` (las dos líneas) a **después** de `    jest.resetModules();` | `exit=1`, `1 failed`; solo R1, **por excepción** (`AggregateError`, desde `react.development.js`) |

## R3 — Cierre medido

Sobre el árbol del verde, sin sondas aplicadas:

1. **Diff de producción vacío** (desde la raíz; `<base>` es `073fa6cb` o el
   merge-base del paso 3 de §Antes de tocar nada):

   ```bash
   git diff --name-only <base>..HEAD -- mobile-pet-tracker/
   ```

   Esperado: una sola línea, `mobile-pet-tracker/src/hooks/use-push-registration.test.tsx`.
2. **Ningún `it` renombrado, movido ni borrado**:

   ```bash
   bunx jest src/hooks/use-push-registration.test.tsx --json --outputFile="$OUT/titles_final.json" > "$OUT/final_file.log" 2>&1; echo "exit=$?"
   jq -r '.testResults[].assertionResults[].fullName' "$OUT/titles_final.json" | sort > "$OUT/titles_final.txt"
   diff "$OUT/titles_base.txt" "$OUT/titles_final.txt"; echo "diff=$?"
   ```

   Esperado: `exit=0` y `diff=1` con **una sola** línea de diferencia:
   `> #133 R1: tras R15, el hook recibe el mock de expo-notifications de la cabecera llama a cada jest.fn de la cabecera y registra el token`
   (jest une `describe` e `it` con un espacio en `fullName`).
3. **R15 intacto salvo sangría**: el `git diff -w <base>..HEAD -- mobile-pet-tracker/src/hooks/use-push-registration.test.tsx`
   no muestra ninguna línea `-`. Todo lo del diff son líneas `+` (medido en
   una copia el 2026-09-29: `--stat` da `28 insertions(+)` y ninguna
   deletion).
4. **Suite completa, sin pipe**:

   ```bash
   bunx jest > "$OUT/final_suite.log" 2>&1; echo "exit=$?"
   grep -E "^(Tests|Test Suites):" "$OUT/final_suite.log"
   ```

   Esperado: `exit=0`; suites igual que la base (hoy 86); tests base + 1 (hoy
   1609).
5. **Tipos y lint**:

   ```bash
   bunx tsc --noEmit > "$OUT/tsc.log" 2>&1; echo "exit=$?"
   bunx eslint src/hooks/use-push-registration.test.tsx > "$OUT/eslint.log" 2>&1; echo "exit=$?"
   ```

   Esperado: `exit=0` los dos.
6. **Grep-clean** de `docs/ui-guidelines.md` sobre las líneas añadidas
   (desde la raíz; aquí el `exit` que cuenta es el del último `grep`, y `1`
   significa «sin coincidencias»):

   ```bash
   git diff -U0 <base>..HEAD -- mobile-pet-tracker/src | grep '^+' | grep -v '^+++' | grep -iP '#(?!\d{2,3} R\d)[\da-f]{3,8}\b|[A-Za-z0-9_-]+-\[[^\]]+\]|StyleSheet|shadowColor|shadowOffset|shadowOpacity|shadowRadius|\belevation\s*:'; echo "exit=$?"
   ```

   Esperado: ninguna línea impresa y `exit=1`.
7. Escribe `progress/impl_mobile-push-registration-r15-domock-scope.md` con:
   la base medida (commit, cifras), el rojo y el verde de R1 (líneas `Tests:`
   y el primer error del rojo), la tabla de sondas con una columna «medido»
   rellena, y las seis medidas de R3 con sus `exit`. Rellena
   [[traceability]].

   Commit:

   ```
   docs(mobile): record the R15 doMock scope evidence (R2,R3)
   ```

## Lo que NO hay que tocar

- `src/hooks/use-push-registration.ts` ni ningún otro fichero de producción.
- `src/screens/home/` (otra sesión, #136).
- Los títulos de los `describe` e `it` existentes, su orden y su posición. R15
  sigue donde está.
- `jest.config`, `jest.setup`, `package.json`, `bun.lock`.
- Las specs de #79, #99 y #100 y el handoff de #100, aunque digan «antes de
  R15» ([[design]] §Qué deja de hacer falta).
- `feature_list.json` (lo cierra el leader).

---
feature: "mobile-alert-ack-outcome-helper"
status: draft        # draft | approved
tags: [harness, spec, mobile]
---

# Tareas — [[mobile-alert-ack-outcome-helper]] (#134)

Rutas y comandos desde `mobile-pet-tracker/`. **H0** = HEAD del handoff.
Cada bloque es (1) test rojo, (2) implementación mínima, (3) refactor. Un
commit rojo y un commit verde por R-id (C4): el rojo contiene los tests y, en
los requisitos de caracterización y verificación, la mutación de producción;
el verde la revierte o implementa. Ningún commit rojo falla por
`Cannot find module` ni por consulta (`Unable to find an element`): todos los
rojos declarados son **por aserción**.

## Arranque

1. `test ! -e .expo/types/router.d.ts` (exit 0). Si existe, para y avisa: no se
   borra desde el handoff.
2. Re-mide la tabla de suites de `requirements.md` §Base de medición
   (`bunx jest <ruta>`, una suite por llamada, sin pipe) y las anclas «antes»
   de §Anclas. Si algo difiere, para y lo escribe en
   `progress/impl_mobile-alert-ack-outcome-helper.md`.

## Anclas

Todas con `grep -cF '<literal>' <ruta>` salvo las marcadas `-cE`. «Antes» es
la base medida (HEAD `13afb0b3`); «después» es el estado tras R7.

| Id | Comando | Antes | Después |
|---|---|---|---|
| A1 | `grep -cF "case '" src/screens/alerts/index.tsx` | 7 | 0 |
| A2 | `grep -cF "case '" src/screens/alert-detail/index.tsx` | 7 | 0 |
| A3 | `grep -cF 'signOut(' src/screens/alerts/index.tsx` | 1 | 0 |
| A4 | `grep -cF 'signOut(' src/screens/alert-detail/index.tsx` | 1 | 0 |
| A5 | `grep -cF 'await signOut()' src/screens/alerts/index.tsx` | 1 | 0 |
| A6 | `grep -cF 'await signOut()' src/screens/alert-detail/index.tsx` | 1 | 0 |
| A7 | `grep -cF 'settleAlertAck(' src/screens/alerts/index.tsx` | 0 | 1 |
| A8 | `grep -cF 'settleAlertAck(' src/screens/alert-detail/index.tsx` | 0 | 1 |
| A9 | `grep -cF 'ackAlert(baseUrl' src/screens/alerts/index.tsx` | 1 | 1 |
| A10 | `grep -cF 'ackAlert(baseUrl' src/screens/alert-detail/index.tsx` | 1 | 1 |
| A11 | `grep -cF "t('common.cannotReachServer')" src/screens/alerts/index.tsx` | 1 | 0 |
| A12 | `grep -cF "t('common.cannotReachServer')" src/screens/alert-detail/index.tsx` | 1 | 0 |
| A13 | `grep -cF "t('common.somethingWentWrong')" src/screens/alerts/index.tsx` | 5 | 3 |
| A14 | `grep -cF "t('common.somethingWentWrong')" src/screens/alert-detail/index.tsx` | 3 | 1 |
| A15 | `grep -cF '} catch {' src/screens/alerts/index.tsx` | 1 | 0 |
| A16 | `grep -cE 'alertKeys\|invalidateQueries\|setQueryData\|useQueryClient\|queryClient' src/screens/alerts/index.tsx` | 0 | 0 |
| A17 | `grep -cE` (misma expresión) `src/screens/alert-detail/index.tsx` | 0 | 0 |
| H1 | `test -e src/utils/alert-ack-outcome.ts && test -e src/utils/alert-ack-outcome.test.ts` | exit 1 | exit 0 |
| H2 | `grep -cF 'export async function settleAlertAck(' src/utils/alert-ack-outcome.ts` | — | 1 |
| H3 | `grep -cF 'export type AlertAckHandlers' src/utils/alert-ack-outcome.ts` | — | 1 |
| H4 | `grep -cF "case '" src/utils/alert-ack-outcome.ts` | — | 7 |
| H5 | `grep -cF 'signOut(' src/utils/alert-ack-outcome.ts` | — | 1 |
| H6 | `grep -cF "t('common.cannotReachServer')" src/utils/alert-ack-outcome.ts` | — | 1 |
| H7 | `grep -cF "t('common.somethingWentWrong')" src/utils/alert-ack-outcome.ts` | — | 2 |
| H8 | `grep -cE` (expresión de A16) `src/utils/alert-ack-outcome.ts` | — | 0 |
| T1 | `grep -cF "{ file: 'src/screens/alerts/index.tsx', key: 'common.somethingWentWrong' }" src/__tests__/ui-copy-table.ts` | 5 | 3 |
| T2 | `grep -cF "{ file: 'src/screens/alerts/index.tsx', key: 'common.cannotReachServer' }" src/__tests__/ui-copy-table.ts` | 1 | 0 |
| T3 | `grep -cF "{ file: 'src/screens/alert-detail/index.tsx', key: 'common.somethingWentWrong' }" src/__tests__/ui-copy-table.ts` | 3 | 1 |
| T4 | `grep -cF "{ file: 'src/screens/alert-detail/index.tsx', key: 'common.cannotReachServer' }" src/__tests__/ui-copy-table.ts` | 1 | 0 |
| T5 | `grep -cF "{ file: 'src/utils/alert-ack-outcome.ts', key: 'common.cannotReachServer' }" src/__tests__/ui-copy-table.ts` | 0 | 1 |
| T6 | `grep -cF "{ file: 'src/utils/alert-ack-outcome.ts', key: 'common.somethingWentWrong' }" src/__tests__/ui-copy-table.ts` | 0 | 2 |
| T7 | `grep -cF "{ file: 'src/utils/alert-meta.ts', key: 'alerts.typeUnknown' }," src/__tests__/ui-copy-table.ts` | 1 | 1 |
| L1 | `grep -cF 'expect(R13_ALERT_DETAIL).toHaveLength(11);' src/__tests__/ui-language.test.ts` | 1 | 0 |
| L2 | `grep -cF 'expect(R13_ALERT_DETAIL).toHaveLength(11 - 3);' src/__tests__/ui-language.test.ts` | 0 | 1 |
| L3 | `grep -cF "file === 'src/utils/alert-ack-outcome.ts'" src/__tests__/ui-language.test.ts` | 0 | 1 |
| L4 | `grep -cF '+ 1, // #118 R1' src/__tests__/ui-language.test.ts` | 1 | 0 |
| L5 | `grep -cF '+ 1, // #134 R6' src/__tests__/ui-language.test.ts` | 0 | 1 |
| L6 | `grep -cF '#134 R6' src/__tests__/ui-language.test.ts` | 0 | 3 |
| D1 | `grep -cF "'screens/alerts/index.tsx': 1," src/__tests__/design-drift.test.ts` | 1 | 0 |
| D2 | `grep -cF "'screens/alerts/index.tsx': 0," src/__tests__/design-drift.test.ts` | 0 | 1 |
| D3 | `grep -cF "'screens/alert-detail/index.tsx': 1," src/__tests__/design-drift.test.ts` | 1 | 0 |
| D4 | `grep -cF "'screens/alert-detail/index.tsx': 0," src/__tests__/design-drift.test.ts` | 0 | 1 |
| D5 | `grep -cF "'utils/alert-ack-outcome.ts': 1," src/__tests__/design-drift.test.ts` | 0 | 1 |
| D6 | `grep -cF "describe('#134 R6" src/__tests__/design-drift.test.ts` | 0 | 1 |
| D7 | `grep -cF "describe('#134 R7" src/__tests__/design-drift.test.ts` | 0 | 1 |

(Los `\|` de A16 son el escape de la tabla markdown; en la shell son `|`.)

## R1 — Caracterización del centro (C1, C2)

Sitio: `src/screens/alerts/index.test.tsx`, un `describe('#134 R1:
caracterización de las ramas sin candado del ack')` **anidado dentro** de
`describe('#78 R8: el ack cambia la fila sin recargar la lista')`, al final de
ese bloque, para heredar su `beforeEach` y `pressAck()`. No se edita ninguna
línea existente.

- [ ] **(1) Rojo** — commit
  `test(mobile-alert-ack-outcome-helper): characterize centro ack branches (R1)`
  - it `muestra Algo salió mal si ackAlert rechaza` (C1):
    `mockAckAlert.mockRejectedValueOnce(new Error('request failed'))`;
    `await pressAck()`; `await waitFor` hasta que
    `screen.queryByTestId('alerts-action-error')` tenga el texto
    `Algo salió mal`; después `mockSignOut` sin llamadas.
  - it `muestra Algo salió mal si signOut rechaza tras unauthorized` (C2):
    `mockAckAlert.mockResolvedValue({ kind: 'unauthorized' })` y
    `mockSignOut.mockRejectedValueOnce(new Error('sign-out failed'))`;
    `await pressAck()`; misma espera con `Algo salió mal`; después
    `mockSignOut` llamado 1 vez.
  - Las esperas usan `queryByTestId` dentro del `expect` (no `getByTestId`)
    para que la ausencia del nodo falle en el matcher y no en la consulta.
  - **Mutaciones** en `src/screens/alerts/index.tsx`, en este mismo commit:
    - M1 (C1): en el bloque `} catch {` de `handleAck` (ancla A15 = 1), la
      llamada `t('common.somethingWentWrong')` pasa a
      `t('common.somethingWentWrong').toUpperCase()`. A13 sigue en 5, así que
      `ui-language.test.ts` sigue verde.
    - M2 (C2): `await signOut()` (ancla A5 = 1) pasa a
      `await Promise.resolve(signOut()).catch(() => undefined)`. A3 sigue en 1,
      así que `design-drift.test.ts` sigue verde.
  - **Rojo esperado** (`bunx jest src/screens/alerts/index.test.tsx`): solo
    los dos its nuevos, ambos por aserción. C1: `toHaveTextContent` recibe el
    nodo con `ALGO SALIÓ MAL`. C2: el error del matcher sobre `null` (el nodo
    no existe; no es `Unable to find an element`). Los 39 existentes, verdes.
- [ ] **(2) Verde** — commit
  `fix(mobile-alert-ack-outcome-helper): revert R1 characterization mutations (R1)`:
  revierte M1 y M2. La suite: 41 verdes.
- [ ] **(3) Refactor** — ninguno.

## R2 — Caracterización del detalle (D1)

Sitio: `src/screens/alert-detail/index.test.tsx`, un `describe('#134 R2:
caracterización de la rama sin candado del ack')` **anidado dentro** de
`describe('#100 R5: el detalle marca leída la alerta')`, al final de ese
bloque. No se edita ninguna línea existente.

- [ ] **(1) Rojo** — commit
  `test(mobile-alert-ack-outcome-helper): characterize detail sign-out failure (R2)`
  - it `muestra Algo salió mal si signOut rechaza tras unauthorized` (D1):
    `mockAckAlert.mockResolvedValue({ kind: 'unauthorized' })` y
    `mockSignOut.mockRejectedValueOnce(new Error('sign-out failed'))`;
    `await renderDetail()`; `await fireEvent.press(await
    screen.findByTestId('alert-detail-ack'))`; `await waitFor` hasta que
    `screen.queryByTestId('alert-detail-action-error')` tenga el texto
    `Algo salió mal`; después `mockSignOut` llamado 1 vez.
  - **Mutación** M3 en `src/screens/alert-detail/index.tsx`, en este commit:
    `await signOut()` (ancla A6 = 1) pasa a
    `await Promise.resolve(signOut()).catch(() => undefined)`. A4 sigue en 1.
  - **Rojo esperado** (`bunx jest src/screens/alert-detail/index.test.tsx`):
    solo D1, por el error del matcher sobre `null`. Los 25 existentes, verdes
    (incluido «cierra sesión una vez si el ack responde unauthorized»).
- [ ] **(2) Verde** — commit
  `fix(mobile-alert-ack-outcome-helper): revert R2 characterization mutation (R2)`:
  revierte M3. La suite: 26 verdes.
- [ ] **(3) Refactor** — ninguno.

## R3 — Helper: ramas delegadas

Sitio: `src/utils/alert-ack-outcome.test.ts` (nuevo).

Montaje común del fichero de test (lo usan R3–R5):

- Un `Alert` de prueba con `status: 'open'`, y otro `next` distinto para `ok`.
- `makeHandlers(language: 'en' | 'es')` devuelve cinco `jest.fn()`: `t`
  traduce con `en` o `es` de `../i18n/catalog`; `signOut` resuelve; los demás
  no hacen nada.
- `request` es `() => Promise.resolve(<estado>)`, salvo en las filas de R5.
- **Cada test** hace `await expect(settleAlertAck(request, alert,
  handlers)).resolves.toBeUndefined()` y después aserta las **cuatro**
  funciones de efecto (`signOut`, `showError`, `onAcked`, `onNotFound`): la
  esperada con `toHaveBeenCalledTimes(1)` y sus argumentos, las otras tres con
  `not.toHaveBeenCalled()`.
- Los textos se asertan como literal escrito (tabla de `requirements.md`
  §Literales normativos), no con `en[...]`/`es[...]`.

- [ ] **(1) Rojo** — commit
  `test(mobile-alert-ack-outcome-helper): helper delegated outcomes (R3)`
  - Crea `src/utils/alert-ack-outcome.ts` como **esqueleto**: exporta
    `AlertAckHandlers` y `settleAlertAck` con la firma final de `design.md` §2
    y un cuerpo que solo hace `await request();`. Typecheck y lint limpios
    (eslint-config-expo tiene `no-unused-vars` con `args: 'none'`).
  - `describe('#134 R3: el helper entrega las ramas delegadas a la pantalla')`
    con 3 its:
    - `ok entrega el Alert devuelto sin copiarlo`: `onAcked` recibe
      exactamente la referencia `next` (`toBe`).
    - `already-closed entrega una copia cerrada del Alert de la fila`:
      `onAcked` recibe un objeto igual a `{ ...alert, status: 'closed' }` que
      no es `alert` (`not.toBe`), y `alert.status` sigue en `'open'`.
    - `not-found delega en onNotFound`: `onNotFound` una vez, sin argumentos.
  - **Rojo esperado** (`bunx jest src/utils/alert-ack-outcome.test.ts`): 3
    rojos por aserción (`onAcked`/`onNotFound` con 0 llamadas).
- [ ] **(2) Verde** — commit
  `feat(mobile-alert-ack-outcome-helper): delegate ok, already-closed and not-found (R3)`:
  `switch` con los tres `case`. 3 verdes.
- [ ] **(3) Refactor** — ninguno.

## R4 — Helper: ramas comunes en en y es

- [ ] **(1) Rojo** — commit
  `test(mobile-alert-ack-outcome-helper): helper common outcomes (R4)`
  - `describe('#134 R4: el helper resuelve las ramas comunes en los dos idiomas')`
    con 7 its (un it.each por tabla está bien; cada fila es un test):
    - unreachable en: `showError('Cannot reach server')`; el `message` del
      estado es `'network down'` y no aparece en ninguna llamada.
    - unreachable es: `showError('No se pudo conectar con el servidor')`.
    - unauthorized: `signOut` una vez; `showError` sin llamadas.
    - error en: `showError('Something went wrong')`.
    - error es: `showError('Algo salió mal')`.
    - missing-config en: `showError('Something went wrong')`.
    - missing-config es: `showError('Algo salió mal')`.
  - **Rojo esperado**: 7 rojos por aserción (el código de R3 no tiene esos
    `case`: `showError`/`signOut` con 0 llamadas). Los 3 de R3, verdes.
- [ ] **(2) Verde** — commit
  `feat(mobile-alert-ack-outcome-helper): resolve common ack outcomes (R4)`:
  `case 'unreachable'`, `case 'unauthorized'` (con `await signOut()`) y el
  `case` doble `'error'`/`'missing-config'`. 10 verdes.
- [ ] **(3) Refactor** — ninguno.

## R5 — Helper: excepciones

- [ ] **(1) Rojo** — commit
  `test(mobile-alert-ack-outcome-helper): helper never rejects (R5)`
  - `describe('#134 R5: el helper convierte toda excepción en el error genérico')`
    con 5 its:
    - la petición rechaza, en: `request = () => Promise.reject(new
      Error('request failed'))`; `showError('Something went wrong')`.
    - la petición rechaza, es: `showError('Algo salió mal')`.
    - la petición lanza de forma síncrona, es: `request` es una función que
      hace `throw new Error('sync failure')`; `showError('Algo salió mal')`.
    - signOut rechaza tras unauthorized, en: `request` resuelve
      `{ kind: 'unauthorized' }` y `signOut` devuelve
      `Promise.reject(new Error('sign-out failed'))`; `signOut` una vez y
      `showError('Something went wrong')`.
    - signOut rechaza tras unauthorized, es: igual con `Algo salió mal`.
  - **Rojo esperado**: 5 rojos por aserción en
    `.resolves.toBeUndefined()` (la promesa del helper rechaza: el código de
    R4 no tiene `try`). Los 10 anteriores, verdes.
- [ ] **(2) Verde** — commit
  `feat(mobile-alert-ack-outcome-helper): catch every ack failure (R5)`:
  un `try` alrededor de `await request()` y del `switch`, con `catch` que
  llama `showError(t('common.somethingWentWrong'))`. 15 verdes. Anclas H2–H8
  en su valor «después».
- [ ] **(3) Refactor** — ninguno.

## R6 — Un solo sitio clasifica el ack

- [ ] **(1) Rojo** — commit
  `test(mobile-alert-ack-outcome-helper): move ack inventories to the helper (R6)`.
  Todo en este commit, sin tocar las pantallas:
  - `src/__tests__/design-drift.test.ts`, mapa `screenSignOutCalls`:
    `'screens/alerts/index.tsx': 1,` pasa a `0,`;
    `'screens/alert-detail/index.tsx': 1,` pasa a `0,`; se añade
    `'utils/alert-ack-outcome.ts': 1,` con un comentario `// #134 R6`
    (anclas D1–D5).
  - `src/__tests__/design-drift.test.ts`, al final del fichero:
    `describe('#134 R6: el resultado del ack se clasifica en un solo sitio')`
    con un it.each sobre `'screens/alerts/index.tsx'` y
    `'screens/alert-detail/index.tsx'` (relativas a `sourceRoot`). Cada fila
    cuenta en el fuente, con `split(literal).length - 1`, los cinco literales
    `case '`, `t('common.cannotReachServer')`, `signOut(`,
    `settleAlertAck(` y `ackAlert(baseUrl`, y hace **un solo** `toEqual` de un
    objeto `{ file, …cuentas }` contra `0, 0, 0, 1, 1`.
  - `src/__tests__/ui-copy-table.ts`, `R12_ALERTS`: borra 2 de las 5 filas de
    T1 y la fila de T2; añade, justo después de la fila de T7, un comentario
    `// #134 R6: el ack se clasifica en el helper` y las filas de T5 (1) y T6
    (2).
  - `src/__tests__/ui-copy-table.ts`, `R13_ALERT_DETAIL`: borra 2 de las 3
    filas de T3 y la fila de T4. No toca la fila `common.retry`, el `];` ni
    `R14_GEOFENCES`.
  - `src/__tests__/ui-language.test.ts`: en el predicado de #78 R12 añade
    `|| file === 'src/utils/alert-ack-outcome.ts'` con `// #134 R6` (L3); la
    longitud de #100 R10 pasa a `toHaveLength(11 - 3); // #134 R6` (L1, L2); en
    la expresión de `SCREEN_FILES` la última línea `+ 1, // #118 R1` pasa a
    `+ 1 // #118 R1` y se añade debajo `+ 1, // #134 R6` (L4, L5). L6 = 3.
  - **Rojo esperado**, todo por aserción:
    - `bunx jest src/__tests__/design-drift.test.ts`: «preserves every
      mutation sign-out with zero delta» (mapa 1 frente a 0 en las dos
      pantallas) y las 2 filas de `#134 R6` (`case '` 7 frente a 0, etc.).
      «keeps literal query keys out of every migrated screen» sigue verde (ya
      revisa el helper).
    - `bunx jest src/__tests__/ui-language.test.ts`: `#78 R12` «registra cada
      ocurrencia de la pantalla» (centro `common.somethingWentWrong` 5 frente a
      3), `#100 R10` «registra cada ocurrencia del detalle» (3 frente a 1) y
      `#65 R18` «resuelve cada ocurrencia de la tabla contra la clave exacta».
      La longitud de `SCREEN_FILES` y el escaneo de copy suelta siguen verdes
      (el helper existe desde R3).
- [ ] **(2) Verde** — commit
  `refactor(mobile-alert-ack-outcome-helper): screens delegate the ack outcome (R6)`:
  las dos pantallas según `design.md` §3. Anclas A1–A15 en su valor
  «después». Verde: las dos suites de inventario y las dos de pantalla (41 y
  26).
- [ ] **(3) Refactor** — ninguno previsto. Si se borran importaciones que
  quedan sin uso, va en este mismo verde.

## R7 — El ack no toca la caché de la lista

Requisito de verificación (C4 b): el test nace verde; se cierra con mutación.

- [ ] **(1) Rojo** — commit
  `test(mobile-alert-ack-outcome-helper): guard the alert list cache (R7)`
  - Al final de `src/__tests__/design-drift.test.ts`:
    `describe('#134 R7: el ack no toca la caché de la lista')` con un it que
    recorre `utils/alert-ack-outcome.ts`, `screens/alerts/index.tsx` y
    `screens/alert-detail/index.tsx` y, por fichero, hace `toEqual` de
    `{ file, refs: source.match(/alertKeys|invalidateQueries|setQueryData|useQueryClient|queryClient/g) ?? [] }`
    contra `refs: []`.
  - **Mutación** M4 en este commit: una línea de comentario
    `// alertKeys.list()` en `src/utils/alert-ack-outcome.ts`.
  - **Rojo esperado** (`bunx jest src/__tests__/design-drift.test.ts`): solo
    `#134 R7`, por aserción (`refs: ['alertKeys']` del helper).
- [ ] **(2) Verde** — commit
  `fix(mobile-alert-ack-outcome-helper): revert R7 cache mutation (R7)`:
  borra la línea de M4. Anclas H8, A16 y A17 en 0.
- [ ] **(3) Refactor** — ninguno.

## Cierre

- [ ] Todas las anclas en su valor «después».
- [ ] `bunx jest` completo desde `mobile-pet-tracker/`, **sin pipe**, exit 0;
  totales = base + deltas de `requirements.md`.
- [ ] `bun run typecheck` exit 0 sin salida de errores.
- [ ] `bunx expo lint --no-cache` exit 0 sin avisos ni errores.
- [ ] `git diff --numstat <H0> -- src/screens/alerts/index.test.tsx src/screens/alert-detail/index.test.tsx`:
  columna de borrados en 0 para los dos.
- [ ] `git diff --quiet <H0> -- src/i18n/catalog.ts src/__tests__/language-provider.test.tsx` exit 0.
- [ ] `traceability.md` con cada R-id apuntando a su test y sus dos commits;
  commit `docs(mobile-alert-ack-outcome-helper): traceability (#134)`.
- [ ] `progress/impl_mobile-alert-ack-outcome-helper.md` con lo hecho, los
  rojos observados frente a los declarados y cualquier parada.

## Ronda 2 — Enmienda E1

Detalle de cada `it` y de cada mutación en `requirements.md` §Enmienda E1.
**H0 de la ronda 2** = HEAD del handoff de la ronda 2. Los commits de la
ronda 1 no se tocan. Rojos por aserción, como en la ronda 1.

### Anclas de la ronda 2

«Antes» medido en `815de8f6`. «Después» es el estado tras el cierre de la
ronda 2.

| Id | Comando | Antes | Después |
|---|---|---|---|
| E1 | `grep -cF 'function deferred()' src/utils/alert-ack-outcome.test.ts` | 0 | 1 |
| E2 | `grep -cF "it('unauthorized espera a signOut antes de resolver'" src/utils/alert-ack-outcome.test.ts` | 0 | 1 |
| E3 | `grep -cF "it('unauthorized espera también a un signOut que rechaza, es'" src/utils/alert-ack-outcome.test.ts` | 0 | 1 |
| E4 | `grep -cF 'function renderAlertsInEnglish()' src/screens/alerts/index.test.tsx` | 0 | 1 |
| E5 | `grep -cF 'initial="en"' src/screens/alerts/index.test.tsx` | 0 | 1 |
| E6 | `grep -cF "'Cannot reach server'" src/screens/alerts/index.test.tsx` | 0 | 1 |
| E7 | `grep -cF "'Something went wrong'" src/screens/alerts/index.test.tsx` | 0 | 1 |
| E8 | `grep -cF "'Cannot reach server'" src/screens/alert-detail/index.test.tsx` | 0 | 1 |
| E9 | `grep -cF "'Something went wrong'" src/screens/alert-detail/index.test.tsx` | 0 | 1 |
| E10 | `grep -cF "renderDetail('alert-1', 'en')" src/screens/alert-detail/index.test.tsx` | 0 | 2 |
| E11 | `grep -cF 'const fail' src/utils/alert-ack-outcome.ts` | 0 | 0 |
| E12 | `grep -cF 'es[key]' src/screens/alerts/index.tsx` | 0 | 0 |
| E13 | `grep -cF 'es[key]' src/screens/alert-detail/index.tsx` | 0 | 0 |
| E14 | `grep -cF "it('mantiene el botón deshabilitado hasta que signOut termina tras unauthorized'" src/screens/alerts/index.test.tsx` | 0 | 1 |
| E15 | `grep -cF "it('mantiene el botón deshabilitado hasta que signOut termina tras unauthorized'" src/screens/alert-detail/index.test.tsx` | 0 | 1 |
| E16 | `grep -cF 'finishSignOut' src/screens/alerts/index.test.tsx` | 0 | 3 |
| E17 | `grep -cF 'finishSignOut' src/screens/alert-detail/index.test.tsx` | 0 | 3 |
| E18 | `grep -cF 'const run = signOut;' src/screens/alerts/index.tsx` | 0 | 0 |
| E19 | `grep -cF 'const run = signOut;' src/screens/alert-detail/index.tsx` | 0 | 0 |
| E20 | `grep -cxF '        signOut,' src/screens/alerts/index.tsx` | 1 | 1 |
| E21 | `grep -cxF '        signOut,' src/screens/alert-detail/index.tsx` | 1 | 1 |

H4–H8 y A1–A17 siguen en su valor «después» de la ronda 1.

### R4 (E1) — El helper espera a `signOut`

Requisito de verificación (C4 b): los `it` nacen verdes y se cierran con
mutación.

- [ ] **(1) Rojo** — commit
  `test(mobile-alert-ack-outcome-helper): helper awaits sign-out either way (R4)`.
  `deferred`, `flushPromises`, W1 y W2 (E1.1), más la mutación M5.
  **Rojo esperado** (`bunx jest src/utils/alert-ack-outcome.test.ts`): 2
  rojos, W1 y W2, los dos en `expect(settled).toBe(false)`; 15 verdes; 17 en
  total.
- [ ] **(2) Verde** — commit
  `fix(mobile-alert-ack-outcome-helper): revert R4 sign-out wait mutation (R4)`:
  revierte M5. `git diff --quiet <H0 ronda 2> -- src/utils/alert-ack-outcome.ts`
  da exit 0. 17 verdes.

### R1 (E1) — El centro en inglés

- [ ] **(1) Rojo** — commit
  `test(mobile-alert-ack-outcome-helper): centro ack errors in english (R1)`.
  `EnglishAlertsWrapper`, `renderAlertsInEnglish`, C3 y C4 (E1.2), más la
  mutación M6. **Rojo esperado** (`bunx jest src/screens/alerts/index.test.tsx`):
  2 rojos, C3 y C4, en `toHaveTextContent`; 41 verdes; 43 en total.
- [ ] **(2) Verde** — commit
  `fix(mobile-alert-ack-outcome-helper): revert R1 translator mutation (R1)`:
  revierte M6. `git diff --quiet <H0 ronda 2> -- src/screens/alerts/index.tsx`
  da exit 0. 43 verdes.

### R2 (E1) — El detalle en inglés

- [ ] **(1) Rojo** — commit
  `test(mobile-alert-ack-outcome-helper): detail ack errors in english (R2)`.
  D2 y D3 (E1.2), más la mutación M7. **Rojo esperado**
  (`bunx jest src/screens/alert-detail/index.test.tsx`): 2 rojos, D2 y D3, en
  `toHaveTextContent`; 26 verdes; 28 en total.
- [ ] **(2) Verde** — commit
  `fix(mobile-alert-ack-outcome-helper): revert R2 translator mutation (R2)`:
  revierte M7. `git diff --quiet <H0 ronda 2> -- src/screens/alert-detail/index.tsx`
  da exit 0. 28 verdes.

### R1 y R2 (E1.7) — Cada pantalla espera a `signOut`

- [ ] **(1) Rojo** — commit
  `test(mobile-alert-ack-outcome-helper): screens keep ack disabled until sign-out settles (R1, R2)`.
  C5 y D4 (E1.7), más las mutaciones M8 y M9 a la vez. **Rojo esperado**,
  medido suite a suite:
  - `bunx jest src/screens/alerts/index.test.tsx`: 1 rojo, C5, en
    `toBeDisabled`; 43 verdes; 44 en total.
  - `bunx jest src/screens/alert-detail/index.test.tsx`: 1 rojo, D4, en
    `toBeDisabled`; 28 verdes; 29 en total.
  - `ui-language` 30/30, `design-drift` 65/65 y helper 17/17, en verde.
- [ ] **(2) Verde** — commit
  `fix(mobile-alert-ack-outcome-helper): revert R1 and R2 sign-out wrapper mutations (R1, R2)`:
  revierte M8 y M9. `git diff --quiet <H0 ronda 2> -- src/screens/alerts/index.tsx src/screens/alert-detail/index.tsx`
  da exit 0. 44 y 29 verdes.

### Cierre de la ronda 2

- [ ] Sondas E1-S1 a E1-S8 de `requirements.md` §E1.4, una a una, revertidas,
  con su salida roja recortada en el impl.
- [ ] Anclas E1–E21 en su valor «después».
- [ ] `bunx jest` completo, **sin pipe**, exit 0: 98 suites y 2394 tests.
- [ ] `bun run typecheck` y `bunx expo lint --no-cache`, exit 0 y sin avisos.
- [ ] `git diff --numstat <H0 ronda 2> HEAD -- src/utils/alert-ack-outcome.test.ts src/screens/alerts/index.test.tsx src/screens/alert-detail/index.test.tsx`:
  borrados en 0 en los tres.
- [ ] `git diff --quiet <H0 ronda 2> HEAD -- src/utils/alert-ack-outcome.ts src/screens/alerts/index.tsx src/screens/alert-detail/index.tsx src/__tests__ src/i18n/catalog.ts src/providers/__tests__/language-provider.test.tsx package.json bun.lock`
  da exit 0.
- [ ] `traceability.md` con cuatro filas nuevas, `R4 (E1)`, `R1 (E1)`,
  `R2 (E1)` y `R1 y R2 (E1.7)`, cada una con sus tests y sus dos commits;
  commit
  `docs(mobile-alert-ack-outcome-helper): traceability round 2 (#134)`.
- [ ] `progress/impl_mobile-alert-ack-outcome-helper.md` con una sección
  `## Ronda 2` al final: lo hecho, los rojos observados frente a los
  declarados, las sondas y cualquier parada.

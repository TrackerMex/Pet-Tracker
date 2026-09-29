---
feature: "mobile-push-registration-r15-named-import-lock"
status: spec_ready         # draft | spec_ready | approved
tags: [spec, mobile, test, deuda]
---

# Requisitos — [[mobile-push-registration-r15-named-import-lock]] (#137 y #139)

> Notación EARS. Cada requisito lleva su id `R<n>`, inmutable una vez aprobado.
> Ver [[design]] para las decisiones y las alternativas descartadas, [[tasks]]
> para el orden TDD, el código exacto y las sondas, y [[traceability]] para el
> cierre.
>
> **Dos entradas, un ciclo.** El humano decidió el 2026-09-29 especificar e
> implementar juntas #137 y #139: tocan el mismo fichero de test y el mismo
> `it` de R15. Esta es la spec de verdad de las dos; la de #139 es un puntero
> ([[../mobile-push-registration-r1-restore-identity-lock/requirements|specs/mobile-push-registration-r1-restore-identity-lock/requirements.md]]).
>
> Origen:
> - **#137**: punto 4 de §Qué firma el humano de la spec de #133
>   (`specs/mobile-push-registration-r15-domock-scope/requirements.md`),
>   «registra S3 como deuda nueva».
> - **#139**: observación 1 del veredicto de #133
>   (`progress/review_mobile-push-registration-r15-domock-scope.md`, sonda O1).
>
> **Base medida: `70e1fdcb`** (`origin/main`, merge de la PR #175, y
> merge-base de la branch `feature/137-mobile-push-registration-r15-named-import-lock`),
> el 2026-09-29. **Los números de línea no son anclas**: todo se localiza con
> los `grep` o los títulos literales que se citan, y las cuentas se vuelven a
> medir al arrancar ([[tasks]] §Antes de tocar nada).

## Qué requisito es de qué entrada

| Entrada | Requisitos | Qué cierra |
|---|---|---|
| **#137** `mobile-push-registration-r15-named-import-lock` | **R1** | R15 se pone rojo también ante un `import { x } from 'expo-notifications'` con nombre (sonda S3) |
| **#139** `mobile-push-registration-r1-restore-identity-lock` | **R2** | un test falla si el `finally` de R15 restaura cualquier objeto que no sea **el mismo** de la cabecera (sonda O1) |
| las dos | **R3** | cierre medido, sin test propio |

En el código, los comentarios y el `describe` nuevo llevan el prefijo de su
entrada (`#137 R1`, `#139 R2`), como pide `docs/conventions.md` §Prefijo de
feature cuando un fichero acumula R-ids de dos specs.

## Contexto mínimo para implementar sin más contexto

Fichero único: `mobile-pet-tracker/src/hooks/use-push-registration.test.tsx`
(«el test»). Prueba el hook de
`mobile-pet-tracker/src/hooks/use-push-registration.ts` («el hook»), que **no
se toca** salvo por las mutaciones versionadas de [[tasks]], y esas se
revierten.

- **La cabecera** del test mockea `expo-notifications` con
  `jest.mock('expo-notifications', () => ({ AndroidImportance: { MAX: 7 }, … }))`
  (siete `jest.fn`). El test lo importa como
  `import * as Notifications from 'expo-notifications'`, envuelve las siete
  funciones en `mockSetNotificationHandler` … `mockGetLastResponse` con
  `jest.mocked(...)` y las junta en el array `notificationMocks`
  (`grep -cF "const notificationMocks = [" …` da 1).
- **El hook** solo tiene `import type { NotificationResponse } from 'expo-notifications';`
  en el cuerpo del módulo. Carga el paquete **dentro de su efecto**, con
  `require('expo-notifications')`.
- **R15** (de #79, `specs/mobile-push-registration/requirements.md` §E4) es el
  `describe('R15: importar el modulo no toca expo-notifications', …)`. Su
  segundo `it`, `'no accede a expo-notifications al importar el modulo'`,
  hace hoy:
  1. captura el mock de cabecera con `jest.requireMock` en `headerNotifications`;
  2. `jest.resetModules()`;
  3. dentro de `try` y de `jest.isolateModules`, registra con `jest.doMock`
     un `Proxy` cuyo `get` lanza `expoGoImportError`
     (`new Error('expo-notifications unavailable in Expo Go')`), y asevera que
     `jest.requireActual('./use-push-registration')` no lanza;
  4. en el `finally`, `jest.doMock('expo-notifications', () => headerNotifications);`
     devuelve la cabecera a los `describe` posteriores (arreglo de #133).
- **`#133 R1`** es el `describe('#133 R1: tras R15, el hook recibe el mock de expo-notifications de la cabecera', …)`,
  hoy el **último** del fichero: monta el hook tras R15 y comprueba que se
  llama a cada `jest.fn` de `notificationMocks` y que el token se registra.

## Premisas de las entradas, verificadas contra el árbol

Medidas sobre `70e1fdcb` en una copia desechable del árbol
(`node_modules` enlazado), con `bunx jest src/hooks/use-push-registration.test.tsx`
sin pipe. Base del fichero: `exit=0`, `Tests: 52 passed, 52 total`.

| # | Premisa | Veredicto |
|---|---|---|
| P1 | #137: con la sonda S3 plantada (`import { setNotificationHandler }` estático, usado solo en el efecto), R15 sigue verde. | **Verdadera, medida**: `exit=0`, 52 passed. Babel compila un `import` con nombre a un `require` que no lee ninguna propiedad al importarse; la primera lectura (`_expoNotifications.setNotificationHandler`) ocurre ya dentro del efecto, y el `get` del `Proxy` no salta. |
| P2 | #137: esa regresión rompería Expo Go en Android. | **Leída, no medida en dispositivo.** Hechos del código de `expo-notifications` **57.0.19** (versión instalada: `mobile-pet-tracker/node_modules/expo-notifications/package.json`): (a) su `package.json` declara `"sideEffects": ["./build/DevicePushTokenAutoRegistration.fx.js"]`; (b) `build/index.js` reexporta `setAutoServerRegistrationEnabledAsync` desde `./DevicePushTokenAutoRegistration.fx`, así que evaluar el paquete evalúa ese fichero; (c) el cuerpo de módulo de `build/DevicePushTokenAutoRegistration.fx.js` hace `if (ServerRegistrationModule.getRegistrationInfoAsync) { addPushTokenListener(…) … }`; (d) `addPushTokenListener` (`build/TokenEmitter.js`) llama primero a `warnOfExpoGoPushUsage()`; (e) `warnOfExpoGoPushUsage` (`build/warnOfExpoGoPushUsage.js`) hace `throw new Error(message)` si `isRunningInExpoGo()` y `Platform.OS === 'android'`. Ese `message` es literalmente el de la traza del dispositivo de #79 E4 (2026-09-21), cuyo marco en el hook era `<global> (src/hooks/use-push-registration.ts:3)`: en `b6c3392e~1` (el hook de entonces) la línea 3 es `import * as Notifications from 'expo-notifications';` y la llamada del cuerpo, `Notifications.setNotificationHandler({`, está en la 11. Es decir, en el dispositivo el error salió **al evaluar el paquete**, y un `import` con nombre también lo evalúa. **No medido**: que la condición (c) se cumpla en Expo Go, ni S3 en un teléfono. Y desde #79 E5 la app no arranca en Expo Go por `ExpoMaps`: el efecto observable de una regresión S3 sería que falle la evidencia 1 del paso 11 de E5 («ningún error menciona `expo-notifications`»). |
| P3 | #137: S1, S2 y S4 de #133 ponen rojo R15. | **Verdadera, medida**: las tres, `exit=1`, `1 failed, 51 passed, 52 total`, solo `R15 › no accede…`, por aserción (`expect(received).not.toThrow()`). |
| P4 | #139: con la sonda O1 plantada en el `finally` de R15 (`() => ({ ...headerNotifications, AndroidImportance: { MAX: 5 } })`), el fichero sigue verde. | **Verdadera, medida**: `exit=0`, 52 passed. `#133 R1` solo mira las `jest.fn` y los argumentos de `registerPushToken`, y O1 conserva las siete `jest.fn`. |
| P5 | #139: el `finally` entregado por #133 sí restaura el objeto de cabecera; el hueco está en el test, no en el arreglo. | **Verdadera, medida**: con el candado de R2 y el `finally` intacto, verde (53 de 53); solo O1 lo pone rojo. |
| P6 | Un `describe` colocado detrás de R15 recibe el mock de cabecera. | **Verdadera, medida**: `#133 R1`, último `describe` y detrás de R15, verde en la base; y el `describe` de R2, colocado detrás de `#133 R1`, verde tras el cambio. Aun así, [[tasks]] fija por contenido el sitio de todo bloque nuevo. |

## Requisitos funcionales

- **R1** (#137; candado sobre código correcto, C4 vía **b** con mutación de
  producción versionada): WHILE el `it`
  `R15 › 'no accede a expo-notifications al importar el modulo'` se ejecuta,
  IF evaluar el cuerpo de módulo de `mobile-pet-tracker/src/hooks/use-push-registration.ts`
  hace **cualquier** `require` en tiempo de ejecución de `expo-notifications`
  —un `import` con nombre (sonda S3), un `import * as` (S4), un `import` por
  defecto (O3), un `import` desnudo (S6), o un `require` explícito seguido de
  una llamada (S1) o de una lectura (S2)—, THEN ese `it` SHALL fallar **por su
  aserción** `expect(received).not.toThrow()` con
  `Error message: "expo-notifications unavailable in Expo Go"`, y SHALL ser el
  **único** test rojo del fichero.
  - Test: el `it` existente de R15, **sin renombrar** (§Qué firma, punto 2). Lo
    que cambia es **qué fábrica registra**: en vez del `Proxy` que lanza al
    leer una propiedad, una fábrica que lanza **al invocarse**, es decir, en el
    propio `require` ([[design]] D1). El cambio lleva un comentario con
    `#137 R1`.
  - Rojo (commit propio): el cambio del test **más** la sonda S3 plantada en el
    hook. Exactamente 1 rojo, `R15 › no accede…`, por aserción.
  - Verde (commit propio): revierte la sonda S3 del hook. Diff neto de
    producción: cero.
  - Control que debe seguir verde: un `import` solo de tipos (sonda S7), que no
    deja `require` en el JavaScript compilado.

- **R2** (#139; candado sobre código de test correcto, C4 vía **b** con la
  mutación en el `finally` de R15; §Qué firma, punto 4): WHEN un `describe`
  de `mobile-pet-tracker/src/hooks/use-push-registration.test.tsx` se ejecuta
  **después** de R15, THE SYSTEM SHALL resolver
  `jest.requireMock('expo-notifications')` **al mismo objeto** (`toBe`,
  identidad `Object.is`) que devolvió la fábrica del
  `jest.mock('expo-notifications', …)` de la cabecera, capturado al cargar el
  fichero. IF el `finally` de R15 registra una fábrica que devuelve **cualquier
  otro objeto** —aunque tenga las mismas `jest.fn` y los mismos valores (sondas
  O1, O4, O5, O6)—, THEN el `it` de R2 SHALL fallar **por su aserción**
  `expect(received).toBe(expected) // Object.is equality`, y SHALL ser el
  **único** test rojo del fichero.
  - Test: `describe('#139 R2: tras R15, expo-notifications vuelve a ser el objeto de la cabecera')`
    › `it('jest.requireMock devuelve el mismo objeto, no una copia')`, **nuevo
    último `describe` del fichero**, detrás de `#133 R1`. El valor esperado es
    `headerNotificationsModule`, una constante **del propio test** capturada
    con `jest.requireMock` en la cabecera, nunca un símbolo de producción.
    Código exacto en [[tasks]] §R2.
  - Rojo (commit propio): la captura, el `describe` nuevo y la sonda O1
    plantada en el `finally` de R15. Exactamente 1 rojo, el de R2, por
    aserción.
  - Verde (commit propio): revierte O1. Diff neto del `finally`: cero.
  - Además, las sondas H1, H2, H3 y H5 de #133 **siguen** poniendo rojo
    `#133 R1`; ahora ponen rojo también R2 (2 rojos cada una, tabla de abajo).

- **R3** (las dos entradas; cierre medido, sin test propio): WHEN la feature
  se entrega, THE SYSTEM SHALL cumplir todo esto, medido y escrito en
  `progress/impl_mobile-push-registration-r15-named-import-lock.md`:
  1. `git diff --name-only <base>..HEAD -- mobile-pet-tracker/` lista **solo**
     `mobile-pet-tracker/src/hooks/use-push-registration.test.tsx` (diff de
     producción vacío). `<base>` es `70e1fdcb` o, si `origin/main` avanzó, el
     merge-base con `origin/main`.
  2. Ningún `it` ni `describe` existente renombrado, movido ni borrado: la
     lista de `fullName` del fichero es la de la base **más exactamente uno**,
     el de R2. El título de R15 no cambia.
  3. `git diff --stat <base>..HEAD -- mobile-pet-tracker/src/hooks/use-push-registration.test.tsx`
     da `1 file changed, 18 insertions(+), 12 deletions(-)` (medido en la
     copia): las 12 líneas borradas son el `jest.doMock(` del `Proxy` y nada
     más.
  4. Delta de tests: fichero **base + 1** (hoy 52 → 53); suite móvil completa
     **base + 1** tests (hoy 1609 → 1610) y **+0** suites (86).
  5. Suite móvil completa con **exit 0 medido sin pipe**; `bunx tsc --noEmit`
     (tras comprobar `test ! -e .expo/types/router.d.ts`) y
     `bunx eslint src/hooks/use-push-registration.test.tsx` con exit 0.
  6. Grep-clean de `docs/ui-guidelines.md` (§Decisiones fijas, punto 3) sobre
     las líneas añadidas, con el patrón de hex de
     `src/__tests__/design-drift.test.ts`, que admite `#137 R1` y `#139 R2`:
     ninguna coincidencia. No hay pantalla: las dimensiones uniformes y los
     componentes compartidos de la carta no aplican.

## Tabla de sondas, resumen

Todas medidas por el spec_author el 2026-09-29, sobre el árbol final (tras el
verde de R2; 53 tests), en la copia desechable. El detalle (edición exacta,
reversión) está en [[tasks]] §Sondas. «Por aserción» = falla un `expect`;
«por excepción» = el test lanza fuera de sus `expect`.

| Sonda | Dónde muta | Qué hace | Esperado | Tipo de rojo |
|---|---|---|---|---|
| S1 | hook | `require` + llamada en el cuerpo del módulo | 1 rojo: `R15 › no accede…` | aserción (`not.toThrow`) |
| S2 | hook | `require` + lectura de `AndroidImportance.MAX` en el cuerpo | 1 rojo: `R15 › no accede…` | aserción |
| S3 | hook | `import { setNotificationHandler }` usado solo en el efecto (**la de #137**) | 1 rojo: `R15 › no accede…` | aserción |
| S4 | hook | `import * as` estático | 1 rojo: `R15 › no accede…` | aserción |
| O3 | hook | `import` por defecto estático | 1 rojo: `R15 › no accede…` | aserción |
| S6 | hook | `import 'expo-notifications'` desnudo (ciego para el `Proxy`) | 1 rojo: `R15 › no accede…` | aserción |
| S7 | hook | `import { type NotificationResponse }` (solo tipos): control | **verde** | — |
| S5 | `src/api/push-tokens.ts` | `import 'expo-notifications'` desnudo en un módulo que el test mockea (**zona ciega de R1**) | **verde**: límite conocido (§Qué firma, punto 3) | — |
| O1 | test (`finally`) | restaura `{ ...headerNotifications, AndroidImportance: { MAX: 5 } }` (**la de #139**) | 1 rojo: `#139 R2` | aserción (`toBe`) |
| O4 | test (`finally`) | restaura `{ ...headerNotifications }` (**zona ciega del candado por campos**) | 1 rojo: `#139 R2` | aserción |
| O5 | test (`finally`) | restaura `Notifications`, la copia del interop (**zona ciega del candado por campos**) | 1 rojo: `#139 R2` | aserción |
| O6 | test (`finally`) | restaura `{ ...headerNotifications, AndroidImportance: { MAX: 7 } }` | 1 rojo: `#139 R2` | aserción |
| H1 | test | quita la restauración del `finally` | 2 rojos: `#133 R1` y `#139 R2` | los dos por excepción (`expo-notifications unavailable in Expo Go`) |
| H2 | test | restaura con `jest.dontMock` | 2 rojos | `#133 R1` por aserción (`toHaveBeenCalledWith`); `#139 R2` por excepción |
| H3 | test | restaura un impostor con una sola `jest.fn` cambiada | 2 rojos | los dos por aserción (`toHaveBeenCalled`; `toBe`) |
| H5 | test | captura `headerNotifications` después del reset | 2 rojos | `#133 R1` por excepción (`AggregateError`); `#139 R2` por aserción |
| H4+S3 | test y hook | quita `jest.resetModules()` de R15 y planta S3 | **verde**: sin el reset R15 es tautológico (P3 de #133, previo) | — |
| H4+O1 | test | quita el reset y planta O1 | **verde**, y es correcto: sin el reset la cache conserva el objeto de cabecera y el de O1 no llega a nadie | — |

En la base, antes de R1, S3 y S6 daban **verde** y H1 a H5 daban **1** rojo
(`#133 R1`). El candado por campos (`AndroidImportance`), medido como
alternativa, da rojo con O1 y O6 y **verde** con O4 y O5 ([[design]] D2).

## Qué firma el humano al aprobar esta spec

1. **P2 queda como leída, no medida.** Que un `import` con nombre de
   `expo-notifications` rompería Expo Go en Android se deduce del código de la
   57.0.19 y de la traza de #79 E4, no de un teléfono. Esta spec **no** pide
   prueba en dispositivo: el cambio es solo de test. ¿Se firma así?
2. **R15 cambia de mecanismo y conserva su título** ([[design]] D1). El `it`
   `'no accede a expo-notifications al importar el modulo'` pasa a vigilar que
   el módulo no **cargue** el paquete, que es más estricto que «no accede».
   Renombrarlo rompería el `grep` por título de las specs de #79 y #133. ¿Se
   mantiene el título?
3. **El límite S5 queda abierto a sabiendas.** R15 no ve un `require` de
   `expo-notifications` que llegue a través de un módulo que el test mockea
   (`../api/push-tokens`, `../providers/auth-provider`, `expo-device`,
   `expo-constants`, `expo-router`): el `jest.mock` de cabecera de ese módulo
   sustituye su código. ¿Se acepta el límite, o se registra como deuda nueva?
4. **La mutación versionada de R2 vive en el test**, en el `finally` de R15,
   no en producción. El quinto punto de C4 pide mutar producción, pero ninguna
   mutación de producción puede poner rojo R2 (medido: S1-S7 y O3 lo dejan
   verde),
   porque R2 no vigila la app, vigila la restauración de #133. La sonda muta el
   código vigilado, no el doble: el `jest.mock` de cabecera no se toca.
   ¿Se firma esa vía para R2?
5. **Un test nuevo (+1)**, el de R2, como último `describe`, y **H1, H2, H3 y
   H5 pasan de 1 a 2 rojos**. ¿Se firma?

## Cobertura de los criterios de aceptación

| Entrada | Criterio | Dónde se cumple |
|---|---|---|
| #137 | 1. Con S3 plantada, el candado se pone rojo y es el único rojo | R1 (commit rojo) y sonda S3 |
| #137 | 2. S1, S2 y S4 siguen poniendo rojo el candado | R1, sondas S1, S2, S4 |
| #137 | 3. `#133 R1` sigue verde con producción intacta | R1 verde, R3.5 |
| #137 | 4. Diff de producción vacío; ningún `it` renombrado sin declararlo | R3.1, R3.2, §Qué firma punto 2 |
| #137 | 5. Suite completa verde sin pipe; tsc y lint; delta declarado | R3.4, R3.5 |
| #139 | 1. Con O1 plantada, rojo por aserción y único rojo | R2 (commit rojo) y sonda O1 |
| #139 | 2. H1, H2, H3 y H5 siguen poniendo rojo `#133 R1` | R2, sondas H1, H2, H3, H5 |
| #139 | 3. Con producción y el `finally` intactos, verde | R2 verde, R3.5 |
| #139 | 4. Diff de producción vacío; ningún `it` renombrado sin declararlo | R3.1, R3.2 |
| #139 | 5. Suite completa verde sin pipe; tsc y lint; delta declarado | R3.4, R3.5 |

## Fuera de alcance

- **Cerrar el límite S5** (§Qué firma, punto 3).
- **Hacer que R15 no dependa de `jest.resetModules()`** (H4+S3 verde). Es la
  premisa P3 de #133, previa a estas dos entradas; el reset se conserva tal
  cual.
- **Editar la spec de #133**, cuyo R2 y cuyo D2 dicen que cualquier
  restauración distinta del objeto de cabecera pone rojo `#133 R1`. Tras R2 de
  esta spec esa frase pasa a ser cierta para el fichero, pero la spec de #133
  es historia cerrada y no se reescribe.
- **Mover o reordenar los `describe` existentes**, incluido R15.
- **Cambiar `use-push-registration.ts`** o cualquier otro fichero de
  `mobile-pet-tracker/` salvo el test, más allá de las mutaciones versionadas
  que se revierten.
- **`use-push-registration.navigation.test.tsx`**, que tiene su propio mock de
  cabecera y no usa `doMock`.
- **Prueba en dispositivo** (§Qué firma, punto 1).

## Aprobación

- [ ] **Aprobado por humano** (fecha: ____) ← gate obligatorio antes de
      implementar. Al marcar esta casilla, el humano firma también los cinco
      puntos de §Qué firma el humano al aprobar esta spec, y en particular el
      tercero (aceptar el límite S5 o pedir que se registre como deuda).

> No hay gate de dispositivo: el cambio es solo de test.

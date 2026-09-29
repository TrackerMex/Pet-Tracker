---
feature: "mobile-push-registration-r15-domock-scope"
status: approved         # draft | spec_ready | approved
tags: [spec, mobile, test, deuda]
---

# Requisitos — [[mobile-push-registration-r15-domock-scope]] (#133)

> Notación EARS. Cada requisito lleva su id `R<n>`, inmutable una vez aprobado.
> Ver [[design]] para las decisiones y las alternativas descartadas, [[tasks]]
> para el orden TDD, el código exacto y las sondas, y [[traceability]] para el
> cierre.
>
> Origen: deuda 5 del veredicto de #100
> (`progress/review_mobile-alert-detail-screen.md`, «#133 (propuesta)»),
> registrada al cerrar #100.
>
> **Base medida: `073fa6cb`** (`origin/main`, merge de la PR #174, y `HEAD` de
> la branch `feature/133-mobile-push-registration-r15-domock-scope`), el
> 2026-09-29. **Los números de línea no son anclas**: todo se localiza con los
> `grep` o los títulos literales que se citan, y las cuentas se vuelven a medir
> al arrancar ([[tasks]] §Antes de tocar nada).

## Contexto mínimo para implementar sin más contexto

Fichero único: `mobile-pet-tracker/src/hooks/use-push-registration.test.tsx`.
Prueba el hook de `mobile-pet-tracker/src/hooks/use-push-registration.ts`.

- **La cabecera** del fichero mockea `expo-notifications` con
  `jest.mock('expo-notifications', () => ({ AndroidImportance: { MAX: 7 }, … }))`
  (siete `jest.fn`). El fichero lo importa como
  `import * as Notifications from 'expo-notifications'`, envuelve esas siete
  funciones en `mockSetNotificationHandler` … `mockGetLastResponse` con
  `jest.mocked(...)` y las junta en el array `notificationMocks`.
- **El hook** no importa `expo-notifications` en el cuerpo del módulo (solo
  `import type`). Lo carga **en tiempo de ejecución**, dentro de su efecto:
  `grep -n "require('expo-notifications')" mobile-pet-tracker/src/hooks/use-push-registration.ts`.
- **R15** (de #79, `specs/mobile-push-registration/requirements.md` §E4) es el
  `describe('R15: importar el modulo no toca expo-notifications', …)`. Su
  segundo `it`, `'no accede a expo-notifications al importar el modulo'`, hace
  `jest.resetModules()` y, dentro de `jest.isolateModules`, registra con
  `jest.doMock('expo-notifications', …)` un `Proxy` cuyo `get` lanza
  `new Error('expo-notifications unavailable in Expo Go')`; luego asevera que
  `jest.requireActual('./use-push-registration')` no lanza.
  Ancla: `grep -n "jest.doMock" mobile-pet-tracker/src/hooks/use-push-registration.test.tsx`
  (hoy una sola coincidencia, dentro de R15; en `073fa6cb` estaba en `:696` y
  el describe en `:674`, dato fechado, no ancla).
- **El defecto.** En jest-runtime 29.7.0
  (`mobile-pet-tracker/node_modules/jest-runtime/build/index.js`), `doMock`
  llama a `setMock`, que escribe `_explicitShouldMock` y `_mockFactories`:
  **dos mapas globales al fichero**. `isolateModules` solo aísla
  `_isolatedModuleRegistry` e `_isolatedMockRegistry`, y los vacía al salir. Al
  terminar R15, `_mockRegistry` está vacío (lo vació el `resetModules`) y la
  fábrica registrada para `expo-notifications` es la del `Proxy`. El siguiente
  `require('expo-notifications')` del hook —en cualquier `describe` posterior—
  construye el `Proxy`, y el primer acceso (`Notifications.setNotificationHandler`)
  lanza «expo-notifications unavailable in Expo Go». Por eso hoy R15 tiene que
  ser el último `describe` del fichero.

## Premisas de la entrada, verificadas contra el árbol

Medidas sobre `073fa6cb` con jest-runtime 29.7.0, leyendo el código de
`requireMock`, `setMock`, `isolateModules`, `resetModules` y `unmock`, y con
experimentos en una copia desechable del fichero ([[design]] §Evidencia).

| # | Premisa | Veredicto |
|---|---|---|
| P1 | La entrada de `feature_list.json` propone acotar el `doMock` «con `jest.isolateModules`». | **Falsa como arreglo.** R15 ya llama a `jest.doMock` **dentro** de `jest.isolateModules`, y la fuga ocurre igual: `setMock` escribe mapas globales que `isolateModules` no aísla. |
| P2 | La entrada propone, como alternativa, `jest.dontMock` + `jest.resetModules` al salir de R15. | **No sirve tal cual.** `dontMock` (= `unmock`) pone `_explicitShouldMock` a `false`: el siguiente `require` da el módulo real, no el objeto de la cabecera, y las `jest.fn` de `notificationMocks` dejan de recibir llamadas. Sonda H2: rojo. |
| P3 | El `jest.resetModules()` de R15 es de carga. | **Verdadera.** `requireMock` busca en `_isolatedMockRegistry` → `_mockRegistry` → fábrica. Sin el reset, dentro del `isolateModules` se devuelve el mock de cabecera cacheado y el `Proxy` no se construye nunca: R15 pasa en verde aunque producción toque `expo-notifications` al importarse. Sondas H4+S1 y H4+S2: **verdes** (candado tautológico). |
| P4 | Criterio 2 de la entrada: «R15 sigue poniéndose rojo si importar el módulo toca `expo-notifications`». | **Sobre-promete.** R15 detecta todo **acceso a una propiedad** del módulo durante la importación (S1, S2, S4 rojas), pero **no** un `import { x } from 'expo-notifications'` estático cuyo nombre solo se usa dentro del efecto: Babel emite un `require` sin acceso a propiedad y el `Proxy` no lanza (S3: **verde**). Es un límite **previo** a #133 que #133 no introduce ni cierra: queda en §Fuera de alcance y en §Qué firma el humano, punto 4. R2 se redacta sobre lo que R15 sí vigila. |

## Requisitos funcionales

- **R1** (el arreglo; test primero, C4 vía (a)): WHEN un `describe` de
  `mobile-pet-tracker/src/hooks/use-push-registration.test.tsx` se ejecuta
  **después** del `describe('R15: importar el modulo no toca expo-notifications', …)`,
  THE SYSTEM SHALL resolver el `require('expo-notifications')` que el hook hace
  en su efecto **al mismo objeto** que devolvió la fábrica del
  `jest.mock('expo-notifications', …)` de la cabecera, de modo que **cada una**
  de las `jest.fn` de `notificationMocks` registre sus llamadas y el token se
  registre con `registerPushToken`, y SHALL NOT lanzar
  «expo-notifications unavailable in Expo Go».
  - Test: `describe('#133 R1: tras R15, el hook recibe el mock de expo-notifications de la cabecera')`
    › `it('llama a cada jest.fn de la cabecera y registra el token')`,
    **último `describe` del fichero, detrás de R15**. Código exacto en
    [[tasks]] §R1.
  - Rojo esperado (commit propio, antes del arreglo): **exactamente 1 test
    rojo** en el fichero, ese `it`, por **excepción** —no por aserción—: el
    mensaje es `expo-notifications unavailable in Expo Go` y sale de
    `await renderHook(...)`, antes de cualquier `expect`. El resto del fichero,
    verde.
  - Verde: el arreglo vive **dentro** del `it` `'no accede a expo-notifications al importar el modulo'`
    de R15 y es el de [[design]] D1: capturar el mock de cabecera con
    `jest.requireMock` **antes** de `jest.resetModules()` y re-registrarlo con
    `jest.doMock` en un `finally`.

- **R2** (R15 sigue siendo un candado real; requisito de verificación, C4 vía
  (b), cierre por mutación): WHILE el arreglo de R1 está aplicado, IF
  `mobile-pet-tracker/src/hooks/use-push-registration.ts` **accede a una
  propiedad** de `expo-notifications` mientras se evalúa el cuerpo del módulo
  —una llamada (sonda S1), una lectura de propiedad (S2) o el acceso implícito
  del interop de Babel de un `import * as` (S4)—, THEN el `it`
  `R15 › 'no accede a expo-notifications al importar el modulo'` SHALL fallar
  **por su aserción** `expect(received).not.toThrow()` con
  `Error message: "expo-notifications unavailable in Expo Go"`, y ese SHALL
  ser el **único** test rojo del fichero (el `#133 R1` sigue verde gracias al
  `finally`).
  - Test: el `it` existente de R15, **sin renombrar**. No hay commit rojo: el
    candado ya existe y producción es correcta; la evidencia son las sondas de
    [[tasks]] §Sondas, en el reporte del implementer y re-plantadas por el
    reviewer.
  - Las sondas H1, H2, H3 y H5 prueban además que el `#133 R1` **no es
    tautológico**: cualquier restauración que no devuelva el objeto de cabecera
    lo pone rojo.

- **R3** (cierre medido, sin test propio): WHEN la feature se entrega, THE
  SYSTEM SHALL cumplir todo esto, medido y escrito en
  `progress/impl_mobile-push-registration-r15-domock-scope.md`:
  1. `git diff --name-only 073fa6cb..HEAD -- mobile-pet-tracker/` lista **solo**
     `mobile-pet-tracker/src/hooks/use-push-registration.test.tsx` (diff de
     producción vacío). Si `origin/main` avanza y se mergea, la base del diff es
     el merge-base con `origin/main`, no `073fa6cb`.
  2. Ningún `it` ni `describe` existente renombrado, movido ni borrado: la
     lista de nombres completos (`fullName`) del fichero tras la feature es la
     de la base **más exactamente uno**, el de R1 ([[tasks]] §R3, paso 2).
  3. El `jest.resetModules()` y el `Proxy` de R15 se conservan con el mismo
     texto (solo cambia su indentación por el `try`); `git diff -w` lo muestra.
  4. Delta de tests: fichero **base + 1**; suite móvil completa **base + 1**
     tests y **+0** suites; las dos bases se miden al arrancar.
  5. Suite móvil completa (`bunx jest` desde `mobile-pet-tracker/`) con
     **exit 0 medido sin pipe**; `bunx tsc --noEmit` y
     `bunx eslint src/hooks/use-push-registration.test.tsx` con exit 0.
  6. Grep-clean de `docs/ui-guidelines.md` (§Decisiones fijas, punto 3):
     el diff no añade hex, clases arbitrarias `[...]`, `StyleSheet.create` ni
     sombras legacy. Es trivial (el cambio es solo de test) y se mide igual,
     con el patrón de hex de `src/__tests__/design-drift.test.ts`, que admite
     `#133 R1` ([[tasks]] §R3, paso 6). No hay pantalla: las dimensiones
     uniformes y los componentes compartidos de la carta no aplican.

## Tabla de sondas, resumen

El detalle (edición exacta, comando, reversión) está en [[tasks]] §Sondas.
«Rojo por aserción» = falla un `expect`; «rojo por excepción» = el test lanza
antes o fuera de sus `expect`.

| Sonda | Dónde muta | Qué hace | Esperado | Tipo de rojo |
|---|---|---|---|---|
| S1 | producción | llamada a `setNotificationHandler` en el cuerpo del módulo | 1 rojo: `R15 › no accede…` | aserción (`not.toThrow`) |
| S2 | producción | lectura de `AndroidImportance.MAX` en el cuerpo del módulo (zona que el `import` no delata) | 1 rojo: `R15 › no accede…` | aserción (`not.toThrow`) |
| S4 | producción | `import * as` estático (la regresión original de #79 E4) | 1 rojo: `R15 › no accede…` | aserción (`not.toThrow`) |
| S3 | producción | `import { setNotificationHandler }` estático usado solo en el efecto | **verde** (límite conocido, P4) | — |
| H1 | test | quitar la restauración del `finally` | 1 rojo: `#133 R1` | excepción (`expo-notifications unavailable in Expo Go`) |
| H2 | test | restaurar con `jest.dontMock` (P2) | 1 rojo: `#133 R1` | aserción (`toHaveBeenCalledWith`, 0 llamadas) |
| H3 | test | restaurar con un impostor que cambia una sola `jest.fn` | 1 rojo: `#133 R1` | aserción (`toHaveBeenCalled`, 0 llamadas) |
| H4 | test | quitar `jest.resetModules()` de R15 (P3); con y sin S1/S2 | **verde** las tres | — |
| H5 | test | capturar el mock **después** de `jest.resetModules()` | 1 rojo: `#133 R1` | excepción (`AggregateError` de React) |

## Qué firma el humano al aprobar esta spec

1. **El mecanismo del arreglo** ([[design]] D1): capturar con
   `jest.requireMock` antes del reset y restaurar con `jest.doMock` en un
   `finally`. No `jest.dontMock` (P2), no quitar el `resetModules` (P3).
2. **Un solo test nuevo** (+1), el de R1, como último `describe` del fichero.
3. **R2 se cierra por mutación**, sin commit rojo, porque no hay defecto de
   producción que arreglar: el candado ya existe y #133 solo debe no romperlo.
4. **El límite S3 queda abierto a sabiendas.** R15 no ve un
   `import { x } from 'expo-notifications'` estático usado solo dentro del
   efecto. Según el código de `expo-notifications` 57.0.19 (leído, **no
   medido en dispositivo**), importar el paquete evalúa
   `build/DevicePushTokenAutoRegistration.fx.js`, que llama en su cuerpo a
   `addPushTokenListener`, y este a `warnOfExpoGoPushUsage()`, que **lanza en
   Android dentro de Expo Go**. O sea: esa regresión probablemente rompería
   Expo Go en Android con R15 en verde. Cerrarlo cambia qué asevera R15 (p. ej.
   una fábrica que lance en el propio `require`), y eso es otra feature. **La
   pregunta para el humano**: ¿se registra como deuda nueva, o se acepta el
   límite?
5. Tras #133, la regla «los `describe` nuevos van antes de R15» deja de ser
   necesaria ([[design]] §Qué deja de hacer falta). Esta spec no edita otras
   specs; la memoria del leader y las specs cerradas se quedan como están.

## Cobertura de los criterios de aceptación de `feature_list.json` #133

| Criterio | Dónde se cumple |
|---|---|
| 1. Un `describe` nuevo detrás de R15 corre sin el error, y el rojo lo demuestra en commit propio | R1 (commit rojo + commit verde) |
| 2. R15 sigue rojo si importar el módulo toca `expo-notifications` (sonda documentada) | R2, con la precisión de P4: rojo ante **acceso a propiedad**; S3 documentada como límite |
| 3. Diff de producción vacío; ningún `it` renombrado | R3.1, R3.2, R3.3 |
| 4. Suite móvil completa verde, sin pipe; delta declarado | R3.4, R3.5 |

## Fuera de alcance

- **Cerrar el límite S3** (P4). Es un defecto previo de R15, no de su
  `doMock`; decisión del humano (§Qué firma, punto 4).
- **Mover o reordenar los `describe` existentes**, incluido R15. Con el arreglo
  el orden deja de importar; moverlos solo ensucia el diff.
- **Editar las specs de #79, #99 y #100** que piden «antes de R15», ni el
  handoff de #100. Son historia cerrada.
- **Cambiar `use-push-registration.ts`** o cualquier otro fichero de
  `mobile-pet-tracker/` salvo el test. En particular `src/screens/home/`, que
  lleva otra sesión (#136).
- **Otros ficheros de test con `resetModules`/`doMock`**: #133 solo acota el de
  este fichero.

## Aprobación

- [x] **Aprobado por humano** (fecha: 2026-09-29) ← gate obligatorio antes de
      implementar. Al marcar esta casilla, el humano firma también los cinco
      puntos de §Qué firma el humano al aprobar esta spec, y el cuarto en
      particular: dejar abierto el límite S3 o pedir que se registre como
      deuda.
      - Punto 4, decisión del humano (2026-09-29): «registra S3 como deuda
        nueva». Queda registrada como #137 en `feature_list.json`; #133 no la
        cierra.

> No hay gate de dispositivo: el cambio es solo de test.

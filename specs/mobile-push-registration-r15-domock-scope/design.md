---
feature: "mobile-push-registration-r15-domock-scope"
status: approved         # draft | spec_ready | approved
tags: [spec, mobile, test, deuda]
---

# Diseño — [[mobile-push-registration-r15-domock-scope]] (#133)

> Ver [[requirements]] para los requisitos y las premisas P1-P4. No hay capas
> de `docs/architecture.md` en juego: el cambio vive entero en un fichero de
> test de `mobile-pet-tracker/`. `docs/ui-guidelines.md` solo aporta el
> grep-clean (R3.6).

## Cómo funciona hoy el registro de mocks (jest-runtime 29.7.0)

Leído en `mobile-pet-tracker/node_modules/jest-runtime/build/index.js`; el
reviewer lo puede releer buscando los nombres de los métodos.

| Pieza | Qué hace | Alcance |
|---|---|---|
| `jest.mock` / `jest.doMock` → `setMock` | escribe `_explicitShouldMock[id] = true` y `_mockFactories[id] = fábrica` | **global al fichero de test** |
| `requireMock(id)` | busca en `_isolatedMockRegistry` (si hay aislamiento), luego en `_mockRegistry`, y si no está, llama a la fábrica y cachea el resultado | cache: global o aislado |
| `jest.isolateModules(fn)` | crea `_isolatedModuleRegistry` e `_isolatedMockRegistry`, corre `fn`, los vacía | solo **caches**, no fábricas |
| `jest.resetModules()` | vacía `_mockRegistry` y `_moduleRegistry` | caches globales |
| `jest.dontMock` / `unmock` | `_explicitShouldMock[id] = false` | global al fichero |

Consecuencia: el `doMock` de R15, aunque se llame dentro de
`isolateModules`, **sustituye la fábrica de la cabecera para el resto del
fichero**. Como el `resetModules` previo ya vació la cache global, el primer
`require('expo-notifications')` que haga el hook después de R15 llama a la
fábrica del `Proxy`.

## Decisiones técnicas

- **D1 — Restaurar el mock de cabecera en un `finally` dentro del `it` de R15
  (R1).** Justo **antes** de `jest.resetModules()`, el `it`
  `'no accede a expo-notifications al importar el modulo'` guarda el objeto de
  cabecera:

  ```ts
  const headerNotifications =
    jest.requireMock<typeof Notifications>('expo-notifications');
  ```

  y envuelve el `expect(() => jest.isolateModules(...)).not.toThrow()` en un
  `try`, cuyo `finally` hace:

  ```ts
  jest.doMock('expo-notifications', () => headerNotifications);
  ```

  - `jest.requireMock` antes del reset devuelve **el objeto que la fábrica de
    cabecera ya construyó** (sale de `_mockRegistry`), el mismo que recibía el
    `require` del hook antes de R15. Sus `jest.fn` son las que envuelve
    `notificationMocks`, así que el hook vuelve a llamar a esas mismas
    funciones. Capturarlo **después** del reset
    construye un objeto nuevo con `jest.fn` nuevas y sin la configuración del
    `beforeEach`: sonda H5, rojo.
  - El `finally` garantiza la restauración aunque la aserción de R15 falle:
    con una regresión real (S1, S2, S4) solo cae R15 y el `#133 R1` sigue
    verde, así que el rojo apunta a la causa y no arrastra a otros `describe`.
  - El `resetModules` y el `Proxy` no cambian (solo su indentación): R15 sigue
    siendo el mismo candado (R2, R3.3).
  - Queda **dentro** del `it` que causa la fuga. Ningún otro `describe` tiene
    que saber nada.

- **D2 — El test de R1 es el último `describe` del fichero, detrás de R15, y
  asevera contra las `jest.fn` de la cabecera (R1).** Es la única posición
  que prueba la fuga. Asevera sobre **cada** elemento de `notificationMocks`
  (el array que ya envuelve las siete `jest.fn` de la cabecera), no sobre un
  símbolo recién importado. Por eso un sustituto que no sea el objeto de
  cabecera lo pone rojo aunque no lance (H2, H3). Para que las siete
  funciones se llamen, incluida `requestPermissionsAsync`, fija el permiso
  inicial en `(granted: false, canAskAgain: true)` y la respuesta de la
  petición en `(true, true)`, con el helper `permission` que ya existe. El
  resto de precondiciones (Android, dispositivo físico, sesión, `projectId`)
  las pone el `beforeEach` de la cabecera.

- **D3 — R2 se cierra por mutación, sin commit rojo (R2).** No hay defecto de
  producción: el hook ya carga `expo-notifications` en el efecto. Lo que #133
  debe demostrar es que D1 no afloja R15. Eso se prueba plantando accesos en el
  cuerpo del módulo de producción (S1, S2, S4) y comprobando que cae R15 por
  su aserción. La sonda en zona ciega es S2: una lectura de propiedad a nivel
  de módulo que ni llama a una función ni aparece en un `import`, y que es la
  forma más probable de colarse (hoy `AndroidImportance.MAX` se lee en el
  efecto).

## Evidencia medida (2026-09-29, base `073fa6cb`)

Medido en una copia desechable del test y del hook (ya borradas), con
`bunx jest <fichero>`, sin pipe. El implementer las **vuelve a medir** sobre
los ficheros reales ([[tasks]] §Sondas); estas cifras son la expectativa, no
una constante.

| Corrida | Resultado |
|---|---|
| base, fichero | 51 passed, exit 0 |
| base, suite completa | 86 suites / 1608 tests passed, exit 0 |
| solo el `describe` de R1 (rojo) | 1 failed, 51 passed, 52 total, exit 1; el `#133 R1` lanza `expo-notifications unavailable in Expo Go` (la traza apunta al `new Error(` de R15) |
| R1 + D1 (verde) | 52 passed, exit 0 |
| suite completa con R1 + D1 | 86 suites / 1609 tests passed, exit 0 |
| `bunx tsc --noEmit`, `bunx eslint` del fichero | exit 0 los dos |
| S1, S2, S4 | 1 failed (`R15 › no accede…`, `not.toThrow` con `Error message: "expo-notifications unavailable in Expo Go"`), 51 passed, exit 1 |
| S3 | 52 passed, exit 0 (límite, P4) |
| H1 | 1 failed (`#133 R1`, excepción `expo-notifications unavailable in Expo Go`), exit 1 |
| H2 | 1 failed (`#133 R1`, `toHaveBeenCalledWith` sobre `mockRegisterPushToken`, `Number of calls: 0`), exit 1 |
| H3 | 1 failed (`#133 R1`, `toHaveBeenCalled` en el bucle, `Received number of calls: 0`), exit 1 |
| H4, H4+S1, H4+S2 | 52 passed, exit 0 (sin el reset, R15 es tautológico: P3) |
| H5 | 1 failed (`#133 R1`, `AggregateError` de React: las `jest.fn` nuevas devuelven `undefined`), exit 1 |

## El límite S3 (fuera de alcance, para el humano)

Un `import { setNotificationHandler } from 'expo-notifications'` estático,
usado solo en el efecto, compila con Babel a un `require` **sin** acceso a
propiedad en tiempo de importación: el `Proxy` de R15 no lanza y R15 sigue
verde (S3). En cambio `import * as` y los `import` por defecto pasan por
`_interopRequireWildcard` / `_interopRequireDefault`, que leen `__esModule`, y
esos sí los caza (S4).

Por qué importa, leído en `mobile-pet-tracker/node_modules/expo-notifications`
(57.0.19) y **no medido en dispositivo**: `build/index.js` reexporta de
`build/DevicePushTokenAutoRegistration.fx.js`, cuyo cuerpo, si
`ServerRegistrationModule.getRegistrationInfoAsync` existe, llama a
`addPushTokenListener`, y este a `warnOfExpoGoPushUsage()`, que lanza en
Android dentro de Expo Go. Esa regresión rompería probablemente Expo Go en
Android con R15 en verde. Cerrarlo pide cambiar lo que asevera R15 (p. ej. una
fábrica que lance en el `require` mismo, no en el acceso), lo que cambia el
candado de #79 E4: otra feature. Decisión en
[[requirements]] §Qué firma el humano, punto 4.

## Qué deja de hacer falta

Con D1, un `describe` puede ir en cualquier posición del fichero, también
detrás de R15. La regla «los `describe` nuevos van **antes** de R15» existe
hoy en:

- `specs/mobile-notifications-permission-recovery/requirements.md`,
  `design.md` y `tasks.md` (#99);
- `progress/handoff_mobile-alert-detail-screen.md` (#100);
- la memoria del leader `r15-ultimo-describe-push-registration.md`.

Son historia de features cerradas. **Esta spec no las edita**: el leader
decide si actualiza su memoria al cerrar #133. El `#133 R1` es la prueba
ejecutable de que la regla ya no hace falta.

## Archivos afectados

- `mobile-pet-tracker/src/hooks/use-push-registration.test.tsx` — **único
  fichero de código**. Cambian el `it` `'no accede a expo-notifications al importar el modulo'`
  de R15 (D1) y un `describe` nuevo al final del fichero (D2).
- `specs/mobile-push-registration-r15-domock-scope/traceability.md` — hashes.
- `progress/impl_mobile-push-registration-r15-domock-scope.md` — reporte con
  las mediciones de R3 y la tabla de sondas.

Ningún fichero de producción, ningún `jest.config`/`jest.setup`, nada de
`src/screens/home/`.

## Alternativas descartadas

- **Solo `jest.isolateModules`** (lo que proponía la entrada de
  `feature_list.json`): ya está, y la fuga ocurre igual, porque aísla caches y
  no fábricas (P1).
- **`jest.dontMock('expo-notifications')` + `jest.resetModules()` al salir**:
  el siguiente `require` da el paquete real y no el objeto de cabecera, y las
  `jest.fn` de `notificationMocks` dejan de registrar llamadas. H2: rojo (P2).
- **Quitar el `jest.resetModules()`** para que el `Proxy` no llegue a
  construirse: deja R15 tautológico; H4+S1 y H4+S2 en verde (P3).
- **Restaurar con el namespace del fichero** (`() => Notifications`): la
  fábrica de cabecera no marca `__esModule`, así que el `import * as` pasa por
  `_interopRequireWildcard` y `Notifications` es una **copia** del objeto de la
  fábrica (mismas `jest.fn`, más una clave `default`). Probablemente pasaría,
  pero el hook recibiría un objeto distinto del que entrega la cabecera. **No
  medido**; se descarta por exactitud: `jest.requireMock` devuelve el objeto
  original del registro, sin coste extra.
- **`afterAll` / `afterEach` en el `describe` de R15**: separa la
  restauración del `doMock` que la exige y depende del orden de hooks de jest;
  el `finally` es más corto y va junto a la causa.
- **Capturar el mock después del `resetModules`**: fabrica un objeto nuevo sin
  la configuración del `beforeEach`. H5: rojo.
- **Reescribir R15 con una fábrica que lance en el `require`** (cerraría S3):
  cambia el candado de #79, fuera de alcance.
- **Mover R15 o el `describe` nuevo a otro fichero de test**: ensucia el diff y
  no arregla la fuga, solo la esconde.

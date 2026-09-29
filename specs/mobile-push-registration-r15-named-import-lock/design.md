---
feature: "mobile-push-registration-r15-named-import-lock"
status: spec_ready         # draft | spec_ready | approved
tags: [spec, mobile, test, deuda]
---

# Diseño — [[mobile-push-registration-r15-named-import-lock]] (#137 y #139)

> Ver [[requirements]] para los requisitos y las premisas P1-P6. No hay capas
> de `docs/architecture.md` en juego: el cambio vive entero en un fichero de
> test de `mobile-pet-tracker/`. `docs/ui-guidelines.md` solo aporta el
> grep-clean (R3.6).

## Qué ve jest y qué ve Babel

Leído en `mobile-pet-tracker/node_modules/jest-runtime/build/index.js`
(jest-runtime 29.7.0; buscar los nombres de los métodos) y medido con las
sondas de [[requirements]].

| Pieza | Qué hace |
|---|---|
| `jest.mock` / `jest.doMock` → `setMock` | escribe `_explicitShouldMock[id] = true` y `_mockFactories[id] = fábrica`, globales al fichero |
| `requireMock(id)` | busca en `_isolatedMockRegistry` (si hay aislamiento) y en `_mockRegistry`; si no está, **invoca la fábrica** y cachea lo que devuelve. Si la fábrica lanza, el error sale tal cual y no se cachea nada |
| `jest.resetModules()` | vacía `_mockRegistry` y `_moduleRegistry` |
| `jest.isolateModules(fn)` | aísla solo las caches, no las fábricas |

Cómo compila Babel (preset de `jest-expo`) cada forma de importar, y si el
`Proxy` de hoy la ve:

| Forma en el hook | JavaScript compilado al importar | ¿Lee una propiedad al importar? | `Proxy` de hoy | Fábrica que lanza (D1) |
|---|---|---|---|---|
| `import { x } from 'expo-notifications'` (S3) | `var _m = require('expo-notifications')` | no | **ciego** | rojo |
| `import 'expo-notifications'` (S6) | `require('expo-notifications')` | no | **ciego** | rojo |
| `import * as N` (S4) | `_interopRequireWildcard(require(…))` | sí (`__esModule`) | rojo | rojo |
| `import N from` (O3) | `_interopRequireDefault(require(…))` | sí (`__esModule`) | rojo | rojo |
| `import type` / `import { type X }` (S7) | nada | — | verde | verde |

## Decisiones técnicas

- **D1 — R15 registra una fábrica que lanza al invocarse (R1, #137).** Dentro
  del `jest.isolateModules` del `it` de R15, el `jest.doMock` del `Proxy` se
  sustituye por:

  ```ts
  jest.doMock('expo-notifications', () => {
    throw expoGoImportError;
  });
  ```

  - jest solo invoca la fábrica cuando alguien hace `require` del módulo y no
    hay copia en cache (el `jest.resetModules()` previo y el aislamiento
    garantizan que no la hay). Así que **cualquier** `require` en tiempo de
    ejecución durante la evaluación del hook —con nombre, `*`, por defecto,
    desnudo o explícito— lanza, y el `expect(() => …).not.toThrow()`
    existente lo convierte en rojo **por aserción**.
  - Reproduce el fallo real: en Expo Go sobre Android lo que lanza es la
    **evaluación** del paquete ([[requirements]] P2), no la lectura de una
    propiedad.
  - Se conservan el título del `it`, `expoGoImportError`, la captura
    `headerNotifications`, el `jest.resetModules()`, el `try`/`finally` y el
    `jest.requireActual`. El diff de R1 es un solo bloque: 12 líneas fuera, 5
    dentro (2 de comentario).

  Alternativas descartadas:
  - **Añadir trampas al `Proxy`** (`has`, `ownKeys`, `getOwnPropertyDescriptor`…).
    Un `import` con nombre compila a un `require` que no toca el objeto hasta el
    efecto: ninguna trampa salta al importar. Medido: S3 verde en `70e1fdcb`.
  - **Fábrica espía** (`const factory = jest.fn(() => ({}))` y
    `expect(factory).not.toHaveBeenCalled()`). Igual de sensible, pero cambia
    la aserción de R15 y deja de simular el fallo real (una excepción al
    evaluar); diff mayor para el mismo poder.
  - **Cargar el `expo-notifications` real** con `isRunningInExpoGo` forzado a
    `true` y Android. Ata el test a las tripas del paquete (el `sideEffects`,
    la guarda `ServerRegistrationModule.getRegistrationInfoAsync`, que depende
    de un módulo nativo que en jest no existe) y se rompería con cualquier
    actualización del SDK.
  - **Candado textual** (grep o AST del fuente del hook buscando `import`
    de valor). Solo ve el texto del hook, no lo que se evalúa; y reimplementa
    mal lo que el sistema de módulos ya hace.

- **D2 — Identidad del módulo entero, no de sus campos (R2, #139).**
  1. En la cabecera del test, justo antes de `const notificationMocks = [`:

     ```ts
     const headerNotificationsModule =
       jest.requireMock<typeof Notifications>('expo-notifications');
     ```

     Al evaluarse esa línea, el `import * as Notifications` del test ya invocó
     la fábrica de cabecera y el objeto está en `_mockRegistry`:
     `jest.requireMock` devuelve **ese** objeto, el mismo que R15 guarda como
     `headerNotifications` antes de su reset.
  2. Un `describe` nuevo, último del fichero, asevera
     `expect(jest.requireMock('expo-notifications')).toBe(headerNotificationsModule)`.

  Por qué no es tautológico:
  - El valor esperado es una constante **del test**, capturada antes de que
    corra ningún `it`; no es un símbolo importado de producción.
  - El valor recibido sale del registro de jest **después** de R15: si el
    `finally` registró otra fábrica, `requireMock` la invoca (o devuelve lo
    que ya cacheó `#133 R1` al montar el hook con ella) y el objeto es otro.
  - La sonda ingenua (O1) da rojo por aserción, y también las de su zona ciega:
    O4 y O5 (mismo contenido, mismas referencias de campo, otro objeto) y O6
    (mismo valor, otro objeto `AndroidImportance`).
  - Mutaciones de producción (S1-S7, O3) lo dejan verde: vigila la
    restauración, no la app ([[requirements]] §Qué firma, punto 4).

  Por qué `jest.requireMock` y no `require`: el `require` del hook respeta
  además `jest.dontMock` (H2); `requireMock` solo mira la fábrica registrada.
  Las dos mitades quedan cubiertas: `#133 R1` pone rojo H2 por aserción (el
  hook recibe el módulo real y no llama a las `jest.fn`) y R2 pone rojo toda
  fábrica que devuelva otro objeto. Un `require` en el test pediría además un
  `eslint-disable` de `@typescript-eslint/no-require-imports`, como el del hook.

  Alternativas descartadas:
  - **Identidad de los campos que no son función** (la medida V1 del reviewer
    de #133: `expect(jest.requireMock('expo-notifications').AndroidImportance).toBe(…)`).
    Medida como alternativa sobre el árbol final: rojo con O1 y O6, **verde
    con O4 y O5**. Además obliga a enumerar a mano los campos no función y a
    mantener la lista cuando la cabecera gane uno.
  - **Aseverar los argumentos que recibe el hook** (p. ej.
    `setNotificationChannelAsync` con `importance: 7`). Mira lo que la app ve,
    pero solo caza O1: ciego a O4, O5 y O6.
  - **Meter la aserción dentro del `it` de `#133 R1`** (delta 0). El test que
    cierra R2 no nombraría su R-id (C4, primer punto), `-t '#139 R2'` no lo
    seleccionaría, y un rojo de H1-H5 taparía el de R2 en el mismo `it`.

- **D3 — Orden: primero #137 (R1), luego #139 (R2).** Tocan hunks disjuntos:
  R1 solo cambia el `jest.doMock` de dentro del `isolateModules`; R2 añade la
  captura en la cabecera, el `describe` al final y su mutación versionada
  toca solo la línea del `finally`, que R1 no cambia. El orden importa por las
  sondas: qué fábrica deja R15 registrada decide el tipo de rojo de H1 y H2
  en R2, y las de [[requirements]] se midieron sobre el mecanismo de D1.

- **D4 — Vías de C4.** Los dos requisitos son candados sobre código ya
  correcto, así que su rojo sale de una **mutación versionada** en el commit
  rojo y revertida en el verde:

  | R | Mutación | Fichero | Qué la revierte |
  |---|---|---|---|
  | R1 | S3: `import { type NotificationResponse, setNotificationHandler }` y `setNotificationHandler({` sin prefijo | `src/hooks/use-push-registration.ts` (producción) | commit verde de R1; diff neto del hook cero |
  | R2 | O1: el `finally` restaura `{ ...headerNotifications, AndroidImportance: { MAX: 5 } }` | `src/hooks/use-push-registration.test.tsx` (código vigilado) | commit verde de R2; diff neto del `finally` cero |

  R2 no puede mutar producción porque ninguna mutación de producción lo pone
  rojo. Muta el código que vigila —la restauración de #133—, no el doble: el
  `jest.mock` de cabecera queda intacto. Lo firma el humano
  ([[requirements]] §Qué firma, punto 4).

## Límites que quedan

- **S5**: un `require` de `expo-notifications` que llegue a través de un
  módulo que el test mockea no se evalúa nunca en el test ([[requirements]]
  §Qué firma, punto 3).
- **H4+S3**: sin el `jest.resetModules()`, R15 devuelve el objeto cacheado y
  es tautológico. Es la P3 de #133, no la cambia esta spec.

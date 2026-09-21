---
feature: "mobile-push-registration"
status: approved     # draft | approved
tags: [harness, spec]
---

# Tareas — [[mobile-push-registration]]

> Disciplina TDD. Cada tarea corresponde a un requisito de [[requirements]] y
> tiene siempre los mismos 3 sub-items, en este orden.
>
> **Un commit por R-id**, con historial rojo → verde visible (C4 de
> `CHECKPOINTS.md`). Formato: `feat(mobile-push-registration): <desc> (R3)`.
> **Prohibido** un commit que traiga test + implementación + docs junto.

## Reglas transversales antes de empezar

1. **Orden**. Las tareas están ordenadas para que **el sujeto exista antes de
   que nadie lo asevere**: la dependencia (R1) y la config (R2) primero; el
   transporte (R3, R4) antes de quien lo llama; el contrato del `AuthProvider`
   (R5) antes del hook que llama `setPushToken` (R8); el hook antes de su montaje
   (R11). **No reordenar.**
2. **Títulos de `describe` prefijados donde el fichero ya tiene R-ids de otra
   spec** (`docs/conventions.md` §Prefijo de feature): en
   `src/__tests__/design-drift.test.ts`, `app.config.test.ts`,
   `src/providers/__tests__/auth-provider.test.tsx` y
   `src/app/__tests__/layout.test.tsx` se escribe `#79 R<n>: …`. En los dos
   ficheros nuevos (`src/api/__tests__/push-tokens.test.ts`,
   `src/hooks/use-push-registration.test.tsx`) basta `R<n>: …`.
3. **R1 y R2 son requisitos de verificación** (aseveran una propiedad de un
   artefacto, no un comportamiento): se cierran por la **vía (a)** de C4 — su
   test se escribe **antes** del cambio que verifica, y su rojo es una aserción
   fallida real (`undefined` ≠ `'~57.0.19'`; el array `plugins` sin la entrada).
   **No** se cierran por mutación.
4. **Ningún rojo puede ser un `ReferenceError` de un helper de test inexistente.**
   Si un test necesita un helper, va en el mismo commit rojo.
5. **Mocks**: se prescribe la **intención**, no un literal copiado de otra suite.
   Antes de escribir un mock de `expo-notifications`, comprobar contra la doc v57
   qué símbolos usa de verdad el fichero bajo prueba y exponer solo esos
   (`setNotificationHandler`, `setNotificationChannelAsync`, `AndroidImportance`,
   `getPermissionsAsync`, `requestPermissionsAsync`, `getExpoPushTokenAsync`,
   `addNotificationResponseReceivedListener`, `getLastNotificationResponseAsync`).
6. **Esperas sobre el árbol** (`docs/conventions.md` §Esperas sobre el árbol): la
   condición que termina un `waitFor` tiene que ser **la misma observación** que
   hacen las aserciones siguientes. En los tests de este hook casi todo es
   `renderHook` + mocks, así que la espera natural es sobre el mock que la
   aserción interroga — nunca esperar a un contador y aseverar sobre otro.
7. **Medir sin pipe**: `bunx jest | tail` devuelve el exit code de `tail`.
8. **Filtros de jest**: el argumento posicional es **regex** (`\(tabs\)` va
   escapado); `--runTestsByPath` trata sus argumentos como rutas.

---

## R1 — `expo-notifications@~57.0.19` declarada y fijada

- [ ] (1) Escribir test que falla para R1 — en `src/__tests__/design-drift.test.ts`,
      `describe('#79 R1: expo-notifications queda declarada y fijada', …)`:
      lee `package.json`, asevera `dependencies['expo-notifications'] === '~57.0.19'`,
      que no aparece en `jest.transformIgnorePatterns[0]` (ya cubierto por el
      fragmento `expo(nent)?`) y que `devDependencies['expo-notifications']` es
      `undefined`. **Rojo real**: hoy la clave no existe.
- [ ] (2) Implementación mínima que lo pasa — `cd mobile-pet-tracker &&
      bunx expo install expo-notifications`. **No editar el rango a mano.** Si
      `expo install` escribe algo distinto de `~57.0.19`, **PARA** y reporta:
      es una enmienda de spec, no un retoque.
- [ ] (3) Refactor con tests verdes — comprobar que `package-lock.json` /
      `bun.lock` (el que use el repo) queda coherente y que `bunx jest` completo
      sigue verde tras la instalación.

## R2 — `app.json`: config plugin y permiso de Android

- [ ] (1) Escribir test que falla para R2 — en `app.config.test.ts`,
      `describe('#79 R2: app.json declara el plugin de notificaciones y POST_NOTIFICATIONS', …)`:
      sobre `appJson.expo`, asevera que `plugins` **contiene**
      `['expo-notifications', { defaultChannel: 'default' }]` (`toContainEqual`),
      que sigue conteniendo `'expo-router'`, `'expo-secure-store'` y la tupla de
      `expo-splash-screen`, y que `android.permissions` contiene
      `'POST_NOTIFICATIONS'` mientras `android.package` sigue siendo
      `'com.trackermex.pettracker'`.
      **PROHIBIDO** `expect(plugins).toHaveLength(4)` o cualquier cifra plana: si
      hiciera falta contar, se escribe `3 + 1`.
      **Rojo real**: hoy no existe ni la entrada ni el bloque de permisos.
- [ ] (2) Implementación mínima que lo pasa — añadir a `app.json` la entrada de
      `plugins` y `android.permissions`. **No tocar `app.config.ts`.**
- [ ] (3) Refactor con tests verdes — verificar que los cinco `describe` que ya
      vivían en `app.config.test.ts` (`R1`..`R4` de otras specs) siguen verdes,
      en particular los dos `expect(resolved.plugins).toEqual(appJson.expo.plugins)`.

## R3 — `registerPushToken` mapea el POST por `kind`

- [ ] (1) Escribir test que falla para R3 — nuevo
      `src/api/__tests__/push-tokens.test.ts`,
      `describe('R3: registerPushToken mapea POST me/push-tokens por kind', …)`,
      calcando el estilo de `src/api/__tests__/users.test.ts` (helper `response()`
      sobre un objeto con `status` y `json`): una aserción sobre la llamada a
      `fetchFn` (URL `http://example.test/v1/me/push-tokens`, `method: 'POST'`,
      cabeceras `Authorization` y `Content-Type`, body `JSON.stringify`), más un
      caso por rama: `200 → {kind:'ok'}`, `401 → {kind:'unauthorized'}`,
      `500 → {kind:'error'}`, `baseUrl` `undefined` → `{kind:'missing-config'}`
      **con `fetchFn` sin llamar**, y `fetchFn` que rechaza →
      `{kind:'unreachable', message}`.
- [ ] (2) Implementación mínima que lo pasa — crear `src/api/push-tokens.ts` con
      `registerPushToken` sobre `postJson` de `./http`. Sin parsear el body del 200.
- [ ] (3) Refactor con tests verdes — comprobar que la firma y el orden de
      parámetros coinciden con `src/api/alerts.ts` (`baseUrl` primero,
      `fetchFn: typeof fetch = fetch` último).

## R4 — `deletePushToken` y el `body` opcional de `deleteJson`

- [ ] (1) Escribir test que falla para R4 — en el mismo
      `src/api/__tests__/push-tokens.test.ts`,
      `describe('R4: deletePushToken manda el expoToken en el body del DELETE', …)`:
      asevera que `fetchFn` recibió `method: 'DELETE'`, **las dos** cabeceras y
      `body: '{"expoToken":"ExpoPushToken[xxx]"}'`, más las ramas
      `204 → {kind:'ok'}`, `401`, otro status, `missing-config` y `unreachable`.
- [ ] (2) Implementación mínima que lo pasa — añadir el quinto parámetro
      opcional `body?: unknown` a `deleteJson` en `src/api/http.ts` (cuando no se
      pasa, la petición emitida no cambia) y escribir `deletePushToken` encima.
- [ ] (3) Refactor con tests verdes — correr
      `bunx jest 'src/api/__tests__/devices' 'src/api/__tests__/reminders'` y
      confirmar que **no se editó ni una línea** de `src/api/devices.ts` ni de
      `src/api/reminders.ts`.

## R5 — `signOut` hace el DELETE **antes** de borrar la sesión

- [ ] (1) Escribir test que falla para R5 — en
      `src/providers/__tests__/auth-provider.test.tsx`,
      `describe('#79 R5: signOut borra el push token antes que la sesión', …)`,
      con `jest.mock('../../api/push-tokens')` y el mock de `expo-secure-store`
      que el fichero ya tiene. Cuatro casos:
      (a) con un expo token publicado vía `setPushToken`, `deletePushToken` se
      llamó con `(process.env.EXPO_PUBLIC_API_URL, <jwt>, <expoToken>)` **y** su
      `mock.invocationCallOrder[0]` es **menor** que el de
      `SecureStore.deleteItemAsync` — la aserción de orden es el requisito;
      (b) sin token publicado, `deletePushToken` no se llama y la sesión se
      cierra igual;
      (c) `deletePushToken` resolviendo `{kind:'unreachable'}`, la sesión se
      cierra igual (`status` acaba en `unauthenticated`);
      (d) `setPushToken` no provoca re-render (el contador de renders del probe
      no cambia al llamarlo).
- [ ] (2) Implementación mínima que lo pasa — en `src/providers/auth-provider.tsx`:
      `pushTokenRef = useRef<string | null>(null)`, `setPushToken` estable
      (`useCallback(…, [])`) escribiendo el ref, `setPushToken` añadido a
      `AuthContextValue` y al `useMemo` del `value`, y `signOut`
      (`useCallback(…, [state.token])`) ejecutando: DELETE → `deleteItemAsync` →
      `setState` + limpiar el ref.
- [ ] (3) Refactor con tests verdes — comprobar que los `describe('R3: …')` y
      `describe('R4: …')` preexistentes de `mobile-auth` siguen verdes sin
      tocarlos, y que ninguna pantalla que consume `useAuth()` rompe el typecheck.

## R6 — El hook no hace nada fuera de dev build, sin plataforma o sin `projectId`

- [ ] (1) Escribir test que falla para R6 — nuevo
      `src/hooks/use-push-registration.test.tsx` (junto al fichero, como
      `use-pet-selection.test.tsx`), `describe('R6: el hook no toca expo-notifications ni la API sin las precondiciones', …)`,
      con `renderHook` de `@testing-library/react-native` y mocks de
      `expo-notifications`, `expo-device`, `expo-constants`, `expo-router` y
      `../providers/auth-provider`. Cuatro casos —no autenticado,
      `Device.isDevice === false`, `Platform.OS === 'web'`,
      `projectId` ausente— cada uno aseverando **cero** llamadas en todos los
      mocks de `expo-notifications` y cero en el doble de
      `registerPushToken`.
- [ ] (2) Implementación mínima que lo pasa — crear
      `src/hooks/use-push-registration.ts` con `usePushRegistration(): void` y
      las cuatro guardas al principio del efecto.
- [ ] (3) Refactor con tests verdes — extraer la lectura del `projectId` a una
      función local que devuelva `string | undefined` sin filtrar `any`.

## R7 — Permiso: se pide una vez y solo si se puede

- [ ] (1) Escribir test que falla para R7 —
      `describe('R7: el permiso se pide solo con granted false y canAskAgain true', …)`
      con tres casos: ya concedido (`requestPermissionsAsync` **no** llamado);
      `{granted:false, canAskAgain:true}` (llamado **una** vez, y si vuelve
      denegado no hay `getExpoPushTokenAsync` ni `registerPushToken`);
      `{granted:false, canAskAgain:false}` (**nunca** llamado — el diálogo
      repetido de cada arranque). Un cuarto caso asevera que en Android se llamó
      `setNotificationChannelAsync('default', …)` **antes** que
      `getExpoPushTokenAsync` (`mock.invocationCallOrder`).
- [ ] (2) Implementación mínima que lo pasa — canal por defecto en Android +
      la doble comprobación de permiso.
- [ ] (3) Refactor con tests verdes — confirmar contra la doc v57 que el enum
      usado es `Notifications.AndroidImportance.MAX` y que
      `NotificationPermissionsStatus` trae de verdad `granted` y `canAskAgain`.

## R8 — Registro: token de Expo, publicación y POST

- [ ] (1) Escribir test que falla para R8 —
      `describe('R8: obtiene el token con el projectId, lo publica y hace POST', …)`:
      `getExpoPushTokenAsync` llamado con `{ projectId: <el de la config mockeada> }`;
      `setPushToken` llamado con el `data` devuelto **antes** que
      `registerPushToken` (orden por `invocationCallOrder`); `registerPushToken`
      llamado con `(process.env.EXPO_PUBLIC_API_URL, <jwt>, { expoToken, platform: 'android' })`;
      y un caso con `Platform.OS === 'ios'` que manda `'ios'`. Más un segundo
      montaje que repite la secuencia entera (no hay marca de "ya registrado").
- [ ] (2) Implementación mínima que lo pasa.
- [ ] (3) Refactor con tests verdes — comprobar que el hook no escribe nada en
      `SecureStore` ni en ningún almacenamiento.

## R9 — Un fallo no bloquea ni rompe

- [ ] (1) Escribir test que falla para R9 —
      `describe('R9: un fallo de token o de red no rompe ni reintenta en la sesión', …)`:
      (a) `getExpoPushTokenAsync` rechazando ⇒ `renderHook` no lanza, no hay
      `registerPushToken`, y el árbol del probe queda igual; (b) cada `kind` de
      fallo de `registerPushToken` (`unreachable`, `error`, `unauthorized`) ⇒ no
      hay segunda llamada dentro del mismo montaje.
- [ ] (2) Implementación mínima que lo pasa — `try/catch` que absorbe sin
      relanzar y sin backoff.
- [ ] (3) Refactor con tests verdes — verificar que no se añadió ningún
      `console.error` que ensucie la salida de la suite.

## R10 — Handler en primer plano y tap → `/alerts`

- [ ] (1) Escribir test que falla para R10 —
      `describe('R10: banner en primer plano y tap que navega a /alerts', …)`:
      (a) al importar el módulo, `setNotificationHandler` recibió un
      `handleNotification` cuyo resultado trae los cuatro campos
      (`shouldShowBanner`, `shouldShowList`, `shouldPlaySound: true`,
      `shouldSetBadge: false`) y **no** `shouldShowAlert`;
      (b) con sesión, capturar el listener pasado a
      `addNotificationResponseReceivedListener`, invocarlo, y aseverar **un**
      `router.push('/alerts')` —literal, sin cast—;
      (c) cold start: `getLastNotificationResponseAsync` resolviendo una
      respuesta ⇒ **exactamente un** `push`, y un re-render posterior ⇒ **sigue
      siendo uno**;
      (d) sin sesión, ni suscripción ni consulta;
      (e) al desmontar, `remove()` llamado sobre la suscripción devuelta.
- [ ] (2) Implementación mínima que lo pasa — `setNotificationHandler` a nivel de
      módulo; efecto de respuesta con guarda de `useRef` para el cold start y
      limpieza con `.remove()`.
- [ ] (3) Refactor con tests verdes — confirmar que `'/alerts'` sigue existiendo
      como ruta (`src/app/(tabs)/alerts.tsx`) y que el typecheck acepta el literal
      sin `as Href` bajo `typedRoutes`.

## R11 — Montaje en `src/app/_layout.tsx`

- [ ] (1) Escribir test que falla para R11 — en
      `src/app/__tests__/layout.test.tsx`,
      `describe('#79 R11: el registro de push se monta dentro de AuthProvider', …)`,
      añadiendo los mocks de `expo-notifications` y `expo-device` que el fichero
      necesitará: renderizar `RootLayout` y aseverar que `<Stack />` sigue
      presente y que el hook se ejecutó (p. ej. `getPermissionsAsync` consultado
      con sesión mockeada).
- [ ] (2) Implementación mínima que lo pasa — componente local en
      `src/app/_layout.tsx` que llama `usePushRegistration()` y devuelve `null`,
      colocado **dentro** de `<QueryProvider>` como hermano de `<Stack />`.
- [ ] (3) Refactor con tests verdes — confirmar que `describe('R4: …')`,
      `describe('#65 R16: …')` y `describe('#87 R4: …')` del mismo fichero siguen
      verdes, y correr la **suite completa** (`bunx jest`, sin pipe) para
      comprobar que ninguna otra suite necesitó el mock de `expo-notifications`.

## R13 — El hook dice en desarrollo por qué no registró (enmienda E2)

Sujeto: `src/hooks/use-push-registration.ts` y
`src/hooks/use-push-registration.test.tsx`. **Solo ese fichero y su test**: R13
no toca ningún otro.

- [ ] **(1) Rojo** — añadir al test del hook las aserciones sobre un espía de
      `console.warn`, una por cada salida que ya tiene test de comportamiento
      (R6 cubre las precondiciones, R7 el permiso denegado, R9 el fallo del
      `catch`), más un caso con `__DEV__` **falso** que exige **cero** llamadas.
      Cada aserción comprueba que el mensaje lleva el prefijo `[push]` y nombra
      la salida. Correr
      `bunx jest --runTestsByPath src/hooks/use-push-registration.test.tsx` y
      **guardar la salida**: debe fallar por esas aserciones, no por compilación.
  - Commit: `test(mobile-push-registration): name the skipped push path in dev (R13)`
- [ ] **(2) Verde** — instrumentar las **seis** salidas del hook con un
      `console.warn` guardado por `__DEV__`:
      (1) sesión no autenticada o sin token, (2) `setPushToken` ausente,
      (3) `!Device.isDevice`, (4) plataforma no soportada, (5) `projectId`
      ausente, (6) el `catch`, que además incluye el error capturado.
      Prefijo estable `[push]` y un motivo legible en cada uno. **Nada en el
      camino feliz** y nada cuando `__DEV__` es falso.
  - Commit: `feat(mobile-push-registration): warn in dev when push registration is skipped (R13)`
- [ ] **(3) Refactor** — comprobar que R9 sigue intacto: el registro sigue siendo
      best-effort, no bloquea el login y reintenta en el siguiente arranque. La
      suite completa verde y `bunx tsc --noEmit` verde.

---

## R14 — `googleServicesFile` cuando el fichero existe (enmienda E3)

Sujetos: `app.config.ts`, `app.config.test.ts`, `.gitignore`. **No** se toca
`app.json` ni ningún fichero de `src/`.

- [ ] **(1) Rojo** — en `app.config.test.ts`, un `describe('#79 R14: …')` con dos
      casos, calcados del patrón que el fichero ya usa para
      `GOOGLE_MAPS_API_KEY_ANDROID` y `RESET_LINK_HOST`: con el fichero presente,
      la config resuelta trae `android.googleServicesFile`; sin él, **no** trae la
      clave y se emite un aviso que nombra `google-services.json` y cita
      `docs/verification.md`. Correr
      `bunx jest --runTestsByPath app.config.test.ts` y guardar la salida.
  - Commit: `test(mobile-push-registration): require google services file wiring (R14)`
- [ ] **(2) Verde** — implementarlo en `app.config.ts` siguiendo el patrón
      existente (comprobar existencia con `fs.existsSync` sobre una ruta relativa
      al propio fichero de config, acumular el aviso en el array `warnings` que ya
      hay, y añadir la clave dentro del bloque `android` solo cuando existe).
  - Commit: `feat(mobile-push-registration): wire google-services.json when present (R14)`
- [ ] **(3) Refactor** — añadir `google-services.json` a
      `mobile-pet-tracker/.gitignore` y comprobar con
      `git check-ignore -v mobile-pet-tracker/google-services.json` que queda
      ignorado. Suite completa y `bunx tsc --noEmit` verdes.

---

## R15 — El módulo no toca `expo-notifications` al importarse (enmienda E4)

Sujetos: `src/hooks/use-push-registration.ts` y sus tests. **No** se toca
`src/app/_layout.tsx` ni ningún otro fichero.

- [x] **(1) Rojo** — un test que falle HOY porque el módulo tiene efectos de
      importación: aislar el módulo (`jest.isolateModulesAsync` o equivalente) con
      el doble de `expo-notifications` configurado para **lanzar** en
      `setNotificationHandler` y en cualquier acceso, imitando a Expo Go, y
      aseverar que **importar** el módulo no lanza. Añadir el caso de entorno:
      con `Constants.executionEnvironment === 'storeClient'`, el hook no llama a
      `expo-notifications` ni a la API, y R13 emite su aviso nombrando esa salida.
      Correr `bunx jest --runTestsByPath src/hooks/use-push-registration.test.tsx`
      y guardar la salida.
  - Commit: `test(mobile-push-registration): importing the hook must not touch expo-notifications (R15)`
- [x] **(2) Verde** — sacar `setNotificationHandler` del nivel de módulo al
      efecto, después de los guards de R6, y añadir la condición de Expo Go por
      entorno de ejecución. Si el `import` estático de la línea 3 sigue rompiendo
      en Expo Go, cargar `expo-notifications` de forma perezosa dentro del efecto
      (la spec lo autoriza expresamente en E4).
  - Commit: `feat(mobile-push-registration): keep expo-notifications out of module scope (R15)`
- [x] **(3) Refactor** — comprobar que R7, R8, R10 y R13 siguen verdes: el handler
      de primer plano debe seguir instalándose cuando sí se registra, y el tap
      debe seguir navegando. Suite completa y `bunx tsc --noEmit` verdes.

---

## R12 — Gate humano: prueba de humo

- [ ] (1) No lleva test automático: es el gate humano. Antes de pedirlo,
      dejar verdes `bunx tsc --noEmit`, `bunx jest` (suite completa, sin pipe) y
      `./init.sh` desde la raíz (sin pipe, y comprobando antes con
      `pgrep -af init.sh` que no hay otro gate contra el Postgres compartido).
- [ ] (2) Comprobar que las Tareas humanas A y B están firmadas en
      [[requirements]] §Aprobación. Sin ellas el smoke **no se ejecuta**.
- [ ] (3) El humano recorre los 11 pasos de [[requirements]] §Prueba de humo y
      anota el resultado de cada uno, con fecha, en
      `progress/impl_mobile-push-registration.md` §R12. Hasta esa firma la
      feature **no** pasa a `done`.

---

## Cierre

- [ ] `specs/mobile-push-registration/traceability.md` sin ninguna fila
      "pendiente" (C5).
- [ ] Ni `src/i18n/catalog.ts` ni
      `src/providers/__tests__/language-provider.test.tsx` aparecen en
      `git diff --name-only origin/main...HEAD` (§Declaración de i18n: delta
      **cero**). Si aparecen, el cierre se rechaza.
- [ ] `app.config.ts`, `src/api/devices.ts` y `src/api/reminders.ts` tampoco
      aparecen en ese diff.
- [ ] Grep-clean de la carta sobre los ficheros nuevos (C8): cero hex, cero
      clases arbitrarias `[...]`, cero `StyleSheet.create`, cero shadow/elevation
      legacy.

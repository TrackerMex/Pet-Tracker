---
feature: "mobile-push-registration"
status: approved     # draft | approved
tags: [harness, spec]
---

# Requisitos — [[mobile-push-registration]]

> Notación EARS. Cada requisito tiene id único R<n>, inmutable una vez aprobado.
> Ver [[design]] para las decisiones técnicas, [[tasks]] para el orden TDD y
> [[../../docs/architecture|architecture]] para las reglas de capas.
>
> Fuente: `feature_list.json` id 79 (description + los 9 `acceptance_criteria`),
> el contrato ya en producción de `specs/alerts-center-notifier` R3-R6 (#13), y
> la promesa de backlog de `specs/mobile-reminders/requirements.md:356` (#39
> dejó `expo-notifications` explícitamente fuera).
>
> **Base**: branch `feature/79-mobile-push-registration`, `origin/main` @ `29689598`.
> **Carta de UI**: `docs/ui-guidelines.md`. Esta feature no pinta un solo píxel
> (ver §Fuera de alcance), así que C8 se cierra por vacío — pero el grep-clean
> sigue siendo criterio de aceptación y se verifica igual (§Verificación).

---

## §0. Verificación de premisas contra el árbol (obligatoria antes de leer los requisitos)

Todo lo que sigue se leyó en el árbol de la branch, no en la descripción de la
feature. **Dos premisas del enunciado son incompletas** y esta spec las corrige.

### §0.1 Premisas confirmadas

| Premisa | Veredicto | Evidencia leída |
|---|---|---|
| `expo` es `~57.0.14` y **no existe** `expo-notifications` | **cierta** | `mobile-pet-tracker/package.json` |
| `expo-device` y `expo-constants` **ya están instalados** | **cierta** | `package.json`: `expo-device ~57.0.1`, `expo-constants ~57.0.12`. Ninguno se usa hoy en `src/` (`grep -rn "expo-device\|expo-constants" src/` → 0 resultados). **No son dependencias nuevas** |
| `app.json` `plugins` = `expo-router`, `expo-splash-screen` (con config), `expo-secure-store`; sin `extra`, sin `googleServicesFile`, sin bloque de permisos; `android.package = com.trackermex.pettracker` | **cierta** | `mobile-pet-tracker/app.json` |
| Contrato del backend | **cierta, verificada contra el código y no solo contra la spec de #13** | `backend-pet-tracker/src/modules/users/infrastructure/users.controller.ts`: `@Controller('me')`, `@Post('push-tokens') @HttpCode(HttpStatus.OK)`, `@Delete('push-tokens') @HttpCode(HttpStatus.NO_CONTENT)`. `application/dto/register-push-token.dto.ts`: `RegisterPushTokenSchema = z.strictObject({ expoToken: z.string().regex(/^Expo(nent)?PushToken\[[^\]]+\]$/), platform: z.enum(['ios','android']) })`; `DeletePushTokenSchema = RegisterPushTokenSchema.pick({ expoToken: true })` — **el DELETE lleva body JSON** |
| Prefijo global `v1` y `AuthGuard` global | **cierta** | `main.ts` fija el prefijo; ninguna de las dos rutas lleva `@Public()` ⇒ 401 sin bearer (#13 R6) |
| La ruta de alertas de #78 **ya existe** | **cierta** | `src/app/(tabs)/alerts.tsx` (3 líneas, delega en `src/screens/alerts`). `src/screens/home/index.tsx:306` navega con `router.push('/alerts')` y su test (`src/screens/home/index.test.tsx:186-187`) exige que la ruta exista y **sin** cast `as Href`. **No hay condicional: el destino es `/alerts`, fijo** |
| Patrón de resultado por `kind` en `src/api/` | **cierta** | `src/api/alerts.ts`, `activity.ts`, `reminders.ts`: unión discriminada `{kind:'ok'|...} \| {kind:'unauthorized'} \| {kind:'error'} \| {kind:'unreachable';message} \| {kind:'missing-config'}`, `baseUrl: string \| undefined` primero, `fetchFn: typeof fetch = fetch` último |
| Expo Go no soporta push desde SDK 53 | **cierta** | docs Expo v57: *"Push notifications … is unavailable in Expo Go on Android from SDK 53. A development build is required"* |
| `PUSH_ENABLED=false` es el default local | **cierta** | `.env.example:98`. `NOTIFIER_ENABLED=true` en `:89`, `ALERTS_ENGINE_ENABLED=true` en `:82`, `POLLER_ENABLED=true` en `:70`, `SIM_MODE=true` en `:60` |

### §0.2 Corrección **C1** — la config efectiva es `app.config.ts`, no solo `app.json`

El enunciado habla solo de `app.json`. El proyecto tiene **además**
`mobile-pet-tracker/app.config.ts` (config dinámica, con su suite
`app.config.test.ts`), que hace `{...config}` sobre `app.json` e inyecta desde
el entorno `android.config.googleMaps.apiKey` (`GOOGLE_MAPS_API_KEY_ANDROID`) y
`android.intentFilters` (`RESET_LINK_HOST`).

Consecuencias que esta spec cierra:

1. **Todo lo estático de esta feature va en `app.json`** (plugin, permiso,
   `extra.eas.projectId`). `app.config.ts` **no se modifica** (R11): ya hace
   spread de `android`, así que `permissions` sobrevive a sus dos ramas, y su
   early-return `if (!googleMapsApiKey && !resetLinkHost) return resolvedConfig`
   devuelve la config de `app.json` intacta.
2. **`eas init` puede negarse a escribir** porque hay config dinámica. Si lo
   hace, imprime el `projectId` y el humano lo pega a mano (§Tareas humanas, A).
3. El candado de config de esta feature vive en `app.config.test.ts`, que ya
   importa `appJson` y ya asserta la forma de `plugins` (R2).

### §0.3 Corrección **C2** — `deleteJson` de `src/api/http.ts` **no admite body**

`src/api/http.ts:55-72`: `deleteJson(baseUrl, path, token, fetchFn)` manda
`{ method:'DELETE', headers:{Authorization} }` — **sin body y sin
`Content-Type`**. Pero `DELETE /v1/me/push-tokens` exige
`{expoToken}` (§0.1): con body ausente el `safeParse` del controlador falla y
responde **400**, no 204, y el token seguiría vivo en el servidor.

Los dos llamadores actuales (`src/api/devices.ts:103`,
`src/api/reminders.ts:133`) pasan cuatro argumentos y no mandan body.

**Decisión cerrada**: se extiende `deleteJson` con un **quinto parámetro
opcional** `body?: unknown` (R4). Es la corrección en el sitio por el que pasan
todos los llamadores, y es compatible hacia atrás con los dos existentes, que no
se tocan. La alternativa —un `fetch` a mano dentro de `push-tokens.ts`— duplica
el `try/catch`/`unreachable` de `http.ts` en un sexto sitio.

---

## Tareas humanas previas (bloqueantes, **no delegables a ninguna IA**)

Sin estas dos tareas el código compila, la suite pasa y el hook no registra
nada (degrada por R6). **Lo que no se puede hacer sin ellas es el smoke de R12.**
Ningún agente ejecuta `eas init` ni toca credenciales.

### Tarea A — `eas init` y `extra.eas.projectId`

`getExpoPushTokenAsync` exige un `projectId` de EAS. Es gratis; requiere una
cuenta Expo (https://expo.dev, plan Free).

1. `bunx eas-cli@latest` delante de cada comando de EAS. En este repo **todo se
   instala y se ejecuta con bun**: nada de `npm i -g`.
2. `cd mobile-pet-tracker && eas login` → verificar con `eas whoami`.
3. `eas init` — crea el proyecto en la cuenta Expo y devuelve un `projectId` (UUID).
4. **Comprobar `app.json`**: debe quedar

   ```json
   "extra": { "eas": { "projectId": "<UUID que imprimió eas init>" } }
   ```

   dentro de `"expo"`. Si `eas init` no lo escribió por haber config dinámica
   (§0.2 C1), pegarlo a mano en `app.json` — **nunca** en `app.config.ts`.
5. `app.json` **sí se commitea**: el `projectId` es un identificador público, no
   un secreto (a diferencia de `GOOGLE_MAPS_API_KEY_ANDROID`, que vive en `.env`).

De ahí lo lee el código: `Constants.expoConfig?.extra?.eas?.projectId`, vía
`expo-constants` (ya instalado), y se pasa **explícito** a
`getExpoPushTokenAsync({ projectId })` — la doc de Expo v57 lo recomienda en vez
de confiar en el default.

### Tarea B — credenciales **FCM V1** en EAS (Android)

Sin esto `getExpoPushTokenAsync` puede devolver token pero **Expo no entrega**
nada al teléfono: el envío del notifier de #13 termina en ticket de error.

1. En https://console.firebase.google.com crear (o reusar) un proyecto — plan
   Spark, gratuito.
2. Añadirle una app Android con package **exactamente** `com.trackermex.pettracker`.
3. Project settings → **Cloud Messaging** → *Firebase Cloud Messaging API (V1)*
   habilitada.
4. Project settings → **Service accounts** → *Generate new private key* → se
   descarga un JSON.
5. `cd mobile-pet-tracker && eas credentials` → plataforma **Android** → perfil
   **development** → *Push Notifications: Manage your FCM V1 service account key*
   → subir el JSON del paso 4.
6. **El JSON no entra en el repositorio.** Se borra del disco tras subirlo.
   `google-services.json` **no** hace falta para el dev build (no se añade
   `googleServicesFile` a `app.json`): Expo Push Service resuelve la entrega con
   la credencial que vive en EAS.

> Ambas tareas se anotan como hechas (fecha) en el §Aprobación de esta spec o en
> `progress/impl_mobile-push-registration.md`. Hasta entonces R12 no se ejecuta.

---

## Requisitos funcionales

### Dependencia y configuración nativa

- **R1**: WHEN se inspecciona `mobile-pet-tracker/package.json`, THE SYSTEM
  SHALL declarar `expo-notifications` en `dependencies` con el rango
  **exactamente `~57.0.19`** —el que escribe `bunx expo install expo-notifications`,
  confirmado contra la doc versionada del SDK 57 (enmienda **E1**; el
  `bundledNativeModules.json` del árbol dice `~57.0.12`, pero es una instantánea
  caducada del paquete `expo` instalado, no la lista viva)— y
  SHALL NOT añadir ninguna otra dependencia ni devDependencia, ni modificar
  `jest.transformIgnorePatterns` (su primera entrada ya cubre
  `expo-notifications` con el fragmento `expo(nent)?|@expo(nent)?/.*`).
  Esta spec **es** la autorización de la dependencia (`docs/conventions.md`:
  una dependencia nueva es legítima si la spec la declara).
  Verificable en `src/__tests__/design-drift.test.ts` — el fichero que ya
  custodia los rangos de dependencias (precedente `#87 R1`).
  **La instalación se hace con `bunx expo install expo-notifications`, nunca
  editando el rango a mano. Si `expo install` escribiera un rango distinto de
  `~57.0.19`, PARA y repórtalo: la spec se enmienda, el rango no se retoca.**

- **R2**: WHEN se inspecciona `mobile-pet-tracker/app.json`, THE SYSTEM SHALL
  contener, dentro de `expo`:
  (a) en `plugins`, la entrada **`["expo-notifications", { "defaultChannel": "default" }]`**,
  conservando las tres entradas existentes (`expo-router`, la tupla de
  `expo-splash-screen` con su config, `expo-secure-store`) sin cambiarles ni
  orden relativo ni contenido;
  (b) en `android`, `"permissions": ["POST_NOTIFICATIONS"]`, conservando
  `package`, `adaptiveIcon` y `predictiveBackGestureEnabled` intactos.
  Verificable en `mobile-pet-tracker/app.config.test.ts` (el fichero que ya
  importa `appJson` y ya asserta la forma de `plugins`).
  **El test SHALL comprobar presencia y contenido (`toContainEqual` /
  `toMatchObject`), NUNCA la longitud del array `plugins`**: una cifra absoluta
  caduca en cuanto otra feature añade un plugin. Si por cualquier motivo hiciera
  falta un conteo, se escribe como suma visible `3 + 1`, jamás como `4`.
  `extra.eas.projectId` **queda fuera de este requisito y sin candado de test**:
  lo escribe el humano (Tarea A) y su ausencia es un caso soportado por R6, no
  un fallo de suite.

### Cliente HTTP (`src/api/push-tokens.ts`)

- **R3**: WHEN se llama
  `registerPushToken(baseUrl, token, { expoToken, platform }, fetchFn)` desde
  `mobile-pet-tracker/src/api/push-tokens.ts`, THE SYSTEM SHALL hacer
  `POST <baseUrl>/me/push-tokens` con cabeceras
  `Authorization: Bearer <token>` y `Content-Type: application/json` y cuerpo
  `{"expoToken":…,"platform":…}` —usando `postJson` de `./http`— y SHALL
  devolver una unión discriminada por `kind`, con exactamente estas ramas:
  `200` → `{ kind: 'ok' }`; `401` → `{ kind: 'unauthorized' }`; cualquier otro
  status → `{ kind: 'error' }`; `baseUrl` `undefined` o vacío →
  `{ kind: 'missing-config' }` **sin llamar a `fetchFn`**; error de red
  propagado por `http.ts` → `{ kind: 'unreachable', message }`.
  La firma SHALL ser
  `registerPushToken(baseUrl: string | undefined, token: string, input: { expoToken: string; platform: 'ios' | 'android' }, fetchFn?: typeof fetch)`,
  con `fetchFn` por defecto `fetch`, mismo orden y mismos defaults que
  `src/api/alerts.ts`. El cuerpo de la respuesta 200 (`{id, platform, createdAt,
  lastSeenAt}`) **SHALL NOT** parsearse: ninguna pantalla lo consume, y parsearlo
  añadiría una rama de error muerta.
  Verificable con dobles de `fetch` en `src/api/__tests__/push-tokens.test.ts`:
  una aserción sobre la URL, el método, las dos cabeceras y el body serializado,
  más una llamada por cada `kind`.

- **R4**: WHEN se llama `deletePushToken(baseUrl, token, expoToken, fetchFn)`,
  THE SYSTEM SHALL hacer `DELETE <baseUrl>/me/push-tokens` con
  `Authorization: Bearer <token>`, `Content-Type: application/json` y cuerpo
  `{"expoToken":…}`, y SHALL devolver `204` → `{ kind: 'ok' }`;
  `401` → `{ kind: 'unauthorized' }`; otro status → `{ kind: 'error' }`;
  `baseUrl` ausente → `{ kind: 'missing-config' }` sin llamar a `fetchFn`;
  error de red → `{ kind: 'unreachable', message }`.
  Para ello THE SYSTEM SHALL extender `deleteJson` de
  `mobile-pet-tracker/src/api/http.ts` con un **quinto parámetro opcional**
  `body?: unknown` que, **solo cuando se pasa**, añade
  `'Content-Type': 'application/json'` y `body: JSON.stringify(body)` a la
  petición (§0.2 C2). WHILE no se pasa `body`, la petición emitida SHALL ser
  byte a byte la de hoy — sin `Content-Type` y sin `body`—, de modo que
  `src/api/devices.ts:103` y `src/api/reminders.ts:133` **no se modifican** y sus
  suites siguen verdes sin tocarlas.
  Verificable en `src/api/__tests__/push-tokens.test.ts` (forma del `DELETE` con
  body) y por la no-regresión de `devices.test.ts` y `reminders.test.ts`.

### Contrato del `AuthProvider`

- **R5**: WHEN `signOut()` de
  `mobile-pet-tracker/src/providers/auth-provider.tsx` se ejecuta **y** se ha
  publicado previamente un expo token vía el nuevo
  `setPushToken(expoToken: string | null): void` del contexto, THE SYSTEM SHALL
  ejecutar, **en este orden exacto y observable**:
  1. `deletePushToken(process.env.EXPO_PUBLIC_API_URL, <jwt de sesión vigente>, <expoToken>)`,
  2. `SecureStore.deleteItemAsync('auth_token')`,
  3. `setState({ status: 'unauthenticated', token: null })` y olvidar el expo token.

  El orden es el requisito, no una nota: si la sesión se borrase primero, la
  petición saldría sin credenciales, el backend respondería 401 y **la fila
  seguiría viva** — un teléfono compartido recibiría las alertas del usuario
  anterior.
  IF no hay expo token publicado, o `EXPO_PUBLIC_API_URL` no está definida,
  THEN THE SYSTEM SHALL saltarse el paso 1 y cerrar sesión igual.
  IF `deletePushToken` devuelve cualquier `kind` distinto de `'ok'` (red caída,
  401, 500), THEN THE SYSTEM SHALL continuar con los pasos 2 y 3 igualmente:
  **un fallo de borrado no puede dejar al usuario dentro de la app**.
  `setPushToken` SHALL ser referencialmente estable entre renders y SHALL NOT
  provocar re-render (guarda el valor en un `useRef`), y `AuthContextValue` SHALL
  exponerlo junto a `status`, `token`, `signIn` y `signOut`.
  Verificable en `src/providers/__tests__/auth-provider.test.tsx` con
  `src/api/push-tokens` mockeado: una aserción de orden entre el mock de
  `deletePushToken` y el de `SecureStore.deleteItemAsync`
  (`mock.invocationCallOrder`), más los tres casos de degradación.

### Hook de registro (`src/hooks/use-push-registration.ts`)

> El hook expone **un único símbolo público**: `usePushRegistration(): void`.
> Es el **único** módulo de la app que importa `expo-notifications`, para que
> ninguna suite existente tenga que mockearlo salvo las que R11 nombra.

- **R6**: WHILE cualquiera de estas cuatro condiciones se cumple, WHEN
  `usePushRegistration()` se monta o su dependencia de sesión cambia, THE SYSTEM
  SHALL no hacer **ninguna** llamada a `expo-notifications` **ni ninguna** llamada
  de red, y SHALL no lanzar:
  1. el estado de `useAuth()` no es `'authenticated'` o `token` es `null`;
  2. `Device.isDevice` (de `expo-device`) es `false` — emulador/simulador, y el
     caso Expo Go del criterio 4;
  3. `Platform.OS` no es `'ios'` ni `'android'` (web) — el backend solo acepta
     esas dos plataformas (`z.enum(['ios','android'])`, §0.1) y cualquier otra
     sería un 400 garantizado;
  4. `Constants.expoConfig?.extra?.eas?.projectId` es `undefined` o cadena vacía
     — la Tarea A todavía no se hizo.

  Verificable en `src/hooks/use-push-registration.test.tsx` con cuatro
  `renderHook`, uno por condición, aseverando cero llamadas en **todos** los
  mocks de `expo-notifications` y cero llamadas en el doble de `fetch`.

- **R7**: WHILE ninguna condición de R6 se cumple, WHEN el hook corre, THE SYSTEM
  SHALL, antes de pedir el token: (a) en Android, crear el canal por defecto con
  `Notifications.setNotificationChannelAsync('default', { name: 'default', importance: Notifications.AndroidImportance.MAX })`;
  (b) leer `Notifications.getPermissionsAsync()` y pedir permiso con
  `Notifications.requestPermissionsAsync()` **si y solo si** el resultado trae
  `granted === false` **y** `canAskAgain === true`.
  IF `getPermissionsAsync()` devuelve `granted === false` y
  `canAskAgain === false`, THEN THE SYSTEM SHALL terminar sin llamar a
  `requestPermissionsAsync`, sin llamar a `getExpoPushTokenAsync` y sin ningún
  `POST` — **es lo que impide el diálogo repetido en cada arranque** del
  criterio 3.
  IF `requestPermissionsAsync()` devuelve `granted === false`, THEN THE SYSTEM
  SHALL terminar igual: sin token, sin `POST`, sin crash y sin pantalla de
  ajustes.
  Verificable con tres escenarios en `use-push-registration.test.tsx`:
  ya concedido (no se pide), denegado-con-`canAskAgain` (se pide una vez),
  denegado-sin-`canAskAgain` (no se pide nunca).

- **R8**: WHILE el permiso está concedido (R7), WHEN el hook corre, THE SYSTEM
  SHALL llamar
  `Notifications.getExpoPushTokenAsync({ projectId })` con el `projectId`
  leído en R6.4, SHALL publicar el `data` resultante en el `AuthProvider` con
  `setPushToken(data)` (R5) **antes** del `POST`, y SHALL llamar
  `registerPushToken(process.env.EXPO_PUBLIC_API_URL, <jwt>, { expoToken: data, platform: Platform.OS })`.
  El hook SHALL ejecutar esta secuencia **en cada arranque con sesión** y SHALL
  NOT guardar ninguna marca de "ya registrado" en disco: el upsert por
  `expo_token` del backend (#13 R3) es idempotente y devuelve el mismo `id`,
  así que re-registrar no crea una segunda fila.
  Verificable en `use-push-registration.test.tsx`: `getExpoPushTokenAsync`
  llamado con `{ projectId: <el de la config mockeada> }`, `setPushToken` llamado
  con el token, y `registerPushToken` (mockeado desde `src/api/push-tokens`)
  llamado con la plataforma correcta; más un segundo montaje que repite la
  secuencia sin condicional.

- **R9**: IF cualquier paso de R7/R8 rechaza —`getExpoPushTokenAsync` lanza
  (sin credenciales FCM, sin red, servicio de Expo caído), o `registerPushToken`
  devuelve `{kind:'unreachable'}` / `{kind:'error'}` / `{kind:'unauthorized'}`—
  THEN THE SYSTEM SHALL absorber el fallo dentro del hook: la promesa del efecto
  SHALL resolver, SHALL NOT lanzar, SHALL NOT propagar a ningún error boundary,
  SHALL NOT reintentar dentro de la misma sesión de app, y el árbol renderizado
  SHALL quedar exactamente igual que sin la feature. El reintento es el
  **siguiente arranque** (R8), sin código de backoff.
  Esto es lo que garantiza el criterio 5: el hook está montado por debajo de la
  navegación (R11) y nunca se interpone entre `signIn` y la pantalla — el login
  no espera a este efecto ni lo observa.
  Verificable en `use-push-registration.test.tsx` con dos escenarios (throw de
  `getExpoPushTokenAsync`, y cada `kind` de fallo de `registerPushToken`)
  aseverando que `renderHook` no lanza y que no hay segunda llamada.

- **R10**: WHEN el módulo `src/hooks/use-push-registration.ts` se carga, THE
  SYSTEM SHALL llamar **una vez, a nivel de módulo**,
  `Notifications.setNotificationHandler({ handleNotification: async () => ({ shouldShowBanner: true, shouldShowList: true, shouldPlaySound: true, shouldSetBadge: false }) })`
  —los cuatro campos de `NotificationBehavior` de SDK 53+, verificados en la doc
  v57; `shouldShowAlert` está obsoleto y **no se usa**—.
  WHILE el estado de `useAuth()` es `'authenticated'`, THE SYSTEM SHALL además:
  (a) suscribirse con `Notifications.addNotificationResponseReceivedListener` y
  llamar `router.push('/alerts')` en cada respuesta recibida, liberando la
  suscripción con `.remove()` al desmontar o al dejar de estar autenticado;
  (b) llamar `Notifications.getLastNotificationResponseAsync()` **una sola vez
  por sesión de app** (guarda de `useRef`, no de estado) y, si devuelve algo
  distinto de `null`, llamar `router.push('/alerts')` — este es el arranque en
  frío del criterio 6.
  La ruta es **literalmente `'/alerts'`**, sin condicional y **sin cast
  `as Href`**: existe desde #78 (§0.1) y `src/screens/home/index.tsx:306` ya la
  usa con esa forma exacta bajo `typedRoutes: true`.
  WHILE el estado no es `'authenticated'`, THE SYSTEM SHALL no suscribirse ni
  consultar la última respuesta: navegar a una pestaña sin sesión solo produce
  un rebote.
  Verificable en `use-push-registration.test.tsx` con `expo-router` mockeado
  (mismo estilo que `src/hooks/use-pet-selection.test.tsx`): el handler
  registrado con los cuatro campos; un tap simulado invocando al listener
  capturado ⇒ un `router.push('/alerts')`; un cold start con
  `getLastNotificationResponseAsync` resolviendo una respuesta ⇒ **exactamente
  un** `push`, y un segundo render ⇒ **sigue siendo uno**; `remove()` llamado al
  desmontar.

### Montaje

- **R11**: WHEN la app arranca, THE SYSTEM SHALL montar `usePushRegistration()`
  dentro de un componente colocado en `mobile-pet-tracker/src/app/_layout.tsx`,
  **dentro de `<AuthProvider>`** (necesita `useAuth`) y como hermano de
  `<Stack />` dentro de `<QueryProvider>`, de forma que no envuelva ni retrase el
  render de `<Stack />` (criterio 5). El componente SHALL devolver `null` y SHALL
  NOT pintar nada.
  THE SYSTEM SHALL NOT modificar `mobile-pet-tracker/app.config.ts` (§0.2 C1),
  `src/api/devices.ts`, `src/api/reminders.ts`, `src/providers/language-provider.tsx`,
  `src/i18n/catalog.ts` ni ningún fichero de `src/screens/` o `src/components/`.
  Verificable en `src/app/__tests__/layout.test.tsx` —que ya asserta el
  anidamiento de proveedores (`#87 R4`)— con `expo-notifications` y
  `expo-device` mockeados: el árbol renderiza, `<Stack />` sigue presente, y el
  hook de registro se ejecutó (su mock de `getPermissionsAsync` fue consultado o
  el doble del hook fue invocado).

### Gate humano

- **R12**: WHEN R1-R11 estén implementados, `init.sh` verde y las Tareas A y B
  hechas, THE SYSTEM SHALL quedar pendiente de la prueba de humo de
  §Prueba de humo (gate humano), que ejecuta **un humano** en un **dev build de
  Android** sobre teléfono físico. **No delegable a ninguna IA.** Hasta que el
  humano la firme, la feature **no** pasa a `done` aunque el `reviewer` haya
  aprobado todo lo demás.

---

## Declaración de i18n (delta **cero**)

**Esta feature no añade ni una sola clave de copy.** Todo su comportamiento es
silencioso: el permiso lo pide el diálogo del sistema operativo (texto del SO, no
del catálogo), el permiso denegado no muestra nada (criterio 3), el fallo de red
no muestra nada (criterio 5) y el tap solo navega.

En consecuencia:

- `mobile-pet-tracker/src/i18n/catalog.ts` **no se modifica** — ni `en` ni `es`.
- `mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx`
  **no se modifica**. Su candado de longitud
  (`expect(englishKeys).toHaveLength(260 + 16 + 1 + 4 + 7 + 14 + 2)`, línea 55)
  queda **byte-idéntico**: delta `+ 0`, no se añade sumando.
- Esto está dicho aquí explícitamente **para desbloquear la coordinación con la
  sesión Backend**, que toca `src/i18n/catalog.ts` en paralelo en #90: **#79 no
  compite por ese fichero**. Si durante la implementación apareciera la necesidad
  de una clave —no debería—, **PARA**: es una enmienda de spec, reabre el gate, y
  el recuento se escribe como suma visible (`260 + 16 + 1 + 4 + 7 + 14 + 2 + N`),
  nunca como cifra plana.

---

## Verificación (además de los tests por R-id)

Todo desde `mobile-pet-tracker/`:

1. `bunx tsc --noEmit` — typecheck verde **con el config plugin añadido**
   (criterio 7). Si antes fallara por rutas fantasma, borrar
   `.expo/types/router.d.ts` y repetir.
2. `bunx jest` — **suite móvil completa** verde. Sin pipes: `bunx jest | tail`
   devuelve el código de `tail`, no el de jest.
3. Ficheros sueltos, con los paréntesis escapados porque el argumento posicional
   de jest es **regex**:

   ```bash
   bunx jest 'src/api/__tests__/push-tokens' 'src/hooks/use-push-registration' \
            'src/providers/__tests__/auth-provider' 'app.config.test'
   bunx jest --runTestsByPath 'src/app/__tests__/layout.test.tsx'
   ```

   `--runTestsByPath` trata sus argumentos como **rutas**, así que ahí `(tabs)`
   iría sin escapar; en el filtro posicional iría como `\(tabs\)`. Comprobar
   siempre que el número de suites que imprime jest coincide con el de ficheros
   que el filtro pretendía coger.
4. Grep-clean de la carta (C8), que esta feature satisface por vacío pero se
   verifica igual sobre los ficheros nuevos: cero hex, cero clases arbitrarias
   `[...]`, cero `StyleSheet.create`, cero shadow/elevation legacy.
5. `./init.sh` verde **sin pipe** desde la raíz del repo, y comprobando antes con
   `pgrep -af init.sh` que no hay otro gate corriendo contra el Postgres
   compartido.

---

## Prueba de humo (gate humano) — R12

> Dev build de **Android** sobre **teléfono físico**, nunca Expo Go (no soporta
> push desde SDK 53) ni emulador (`Device.isDevice` es `false`, R6.2).
> El backend del teléfono es el de **tu LAN**, no el VPS.

### Precondiciones

- Tareas A y B firmadas (arriba).
- En la máquina del backend de la LAN, su `.env`:
  `PUSH_ENABLED=true`, `NOTIFIER_ENABLED=true`, `ALERTS_ENGINE_ENABLED=true`,
  `POLLER_ENABLED=true`, `SIM_MODE=true`. Backend y LocalStack arriba.
- `mobile-pet-tracker/.env`: `EXPO_PUBLIC_API_URL=http://<IP-LAN-del-backend>:3000/v1`
  (la IP de la LAN, no `localhost` ni `10.0.2.2`).
- Una cuenta con al menos una mascota con collar simulado emparejado.
- Anota `<IP>`, `<petId>` y el `<jwt>` de la sesión (de `POST /v1/auth/login`).

### Pasos

1. **Regenerar el dev build** (obligatorio: el config plugin nuevo escribe en el
   `AndroidManifest.xml` durante el prebuild):

   ```bash
   cd mobile-pet-tracker
   bunx expo prebuild --clean --platform android
   grep -c "POST_NOTIFICATIONS" android/app/src/main/AndroidManifest.xml   # debe imprimir 1
   bunx expo run:android
   ```

2. **Iniciar sesión** en la app. Android 13+ muestra el diálogo de
   `POST_NOTIFICATIONS`: **conceder**.

3. **Comprobar la fila** (criterio 1). En la máquina del backend de la LAN,
   contra la base que usa **ese** backend (lee su `DATABASE_URL` del `.env` de
   esa máquina; no la del VPS ni la de otro worktree):

   ```bash
   psql "$DATABASE_URL" -c \
     "select id, platform, left(expo_token,18) as tok, created_at, last_seen_at
        from push_tokens
        where user_id = (select id from users where email = '<tu-email>');"
   ```

   Esperado: **exactamente 1 fila**, `platform = android`, `tok` empezando por
   `ExpoPushToken[`. Anota el `id` y el `last_seen_at`.

4. **Reiniciar la app** (matarla y reabrirla, con sesión). Repetir el SELECT:
   **sigue habiendo 1 fila**, con el **mismo `id`** y `last_seen_at` mayor que el
   anotado. (Criterio 1, segunda mitad.)

5. **Simular la salida de geocerca** (criterio 9). Ruta principal: crear una
   geocerca activa cuyo centro esté lejos del punto simulado
   (`SIM_HOME_LAT=19.4326`, `SIM_HOME_LNG=-99.1332`), de modo que toda posición
   del simulador quede fuera y el motor de #12 emita `geofence_exit`:

   ```bash
   curl -s -X POST "http://<IP>:3000/v1/pets/<petId>/geofences" \
     -H "Authorization: Bearer <jwt>" -H 'Content-Type: application/json' \
     -d '{"type":"safe_circle","name":"Smoke 79","centerLat":0,"centerLng":0,"radiusM":20}'
   ```

   El poller y el motor corren con cron de 1 minuto cada uno, así que la alerta y
   el mensaje en la cola `notifications` aparecen en **≤ 2 minutos**
   (`specs/alerts-engine` R18). Comprobar que la alerta existe:

   ```bash
   curl -s "http://<IP>:3000/v1/alerts?status=open" -H "Authorization: Bearer <jwt>"
   ```

   **Ruta alternativa determinista** (si el pipeline tarda o ensucia): encolar a
   mano un mensaje con el contrato **congelado** de 7 claves de #12 R15, que es
   justo lo que el notifier consume:

   ```bash
   aws --endpoint-url http://localhost:4566 sqs send-message \
     --queue-url "$(aws --endpoint-url http://localhost:4566 sqs get-queue-url \
                      --queue-name notifications --query QueueUrl --output text)" \
     --message-body '{"version":1,"kind":"alert","alertId":"<uuid>","petId":"<petId>","title":"Luna salió de Smoke 79","body":"Tu mascota salió de la zona segura","data":{"petId":"<petId>","alertId":"<uuid>"}}'
   ```

   (`<uuid>` cualquiera válido; el notifier resuelve destinatarios por `petId`
   contra `push_tokens` ⋈ `pet_users`, #13 R8.)

6. **Notificación en primer plano**: con la app abierta, llega el **banner**
   (R10, `setNotificationHandler`).

7. **Notificación en segundo plano**: mandar la app a segundo plano (botón home,
   sin matarla), repetir el paso 5, y **tocar** la notificación de la bandeja.
   Esperado: la app vuelve al frente y queda en el **centro de alertas**
   (`/alerts`). (Criterio 6, primera mitad.)

8. **Arranque en frío**: matar la app por completo (deslizarla de recientes),
   repetir el paso 5, y **tocar** la notificación con la app cerrada. Esperado:
   la app abre y **navega a `/alerts`** (`getLastNotificationResponseAsync`), una
   sola vez — no dos empujes ni una pila con `/alerts` duplicado.
   (Criterio 6, segunda mitad.)

9. **Cerrar sesión** (criterio 2). Desde Profile, cerrar sesión. Repetir el
   SELECT del paso 3: **cero filas**. Si quedara una, el `DELETE` salió después
   de borrar la sesión y R5 está incumplido.

10. **Permiso denegado** (criterio 3). En Ajustes de Android, revocar las
    notificaciones de la app; matarla y volver a entrar. Esperado: **ningún
    diálogo**, ningún crash, la app funciona igual, y el SELECT del paso 3 sigue
    en **cero filas**. Confirmar además, en el log del backend, que **no** llegó
    ningún `POST /v1/me/push-tokens`.

11. **Fuera de dev build** (criterio 4). Abrir el proyecto en **Expo Go**
    (`bunx expo start --go`) e iniciar sesión. Esperado: la app entra
    normalmente, sin crash, sin diálogo de permiso, y el SELECT sigue igual que
    antes de abrir Expo Go — el hook no llamó a `expo-notifications` ni a la API.

El resultado (cada paso, con fecha) se anota en
`progress/impl_mobile-push-registration.md` §R12.

---

## Cobertura de los criterios de aceptación de `feature_list.json`

| # | Criterio (resumido) | R-ids / sección |
|---|---|---|
| 1 | 1 fila en `push_tokens`, `ExpoPushToken[...]`, `android`; reiniciar no crea otra | R8 (+ R3) y §Humo pasos 3-4 |
| 2 | `DELETE` antes de borrar la sesión; tras `signOut` la fila no existe | **R5** (+ R4) y §Humo paso 9 |
| 3 | Permiso denegado → sin `POST`, sin crash, sin diálogo repetido | **R7** y §Humo paso 10 |
| 4 | Fuera de dev build el hook no toca `expo-notifications` ni la API | **R6** (condiciones 2 y 3) y §Humo paso 11 |
| 5 | Fallo de red no bloquea el login; reintento en el siguiente arranque | **R9** (+ R11: montado como hermano de `<Stack/>`) |
| 6 | Tap con app cerrada y en segundo plano → navega a alertas | **R10** y §Humo pasos 7-8 |
| 7 | Tests del hook y de `push-tokens.ts` con `expo-notifications` mockeado; suite verde; typecheck verde con el plugin | R3, R4, R6-R10 + §Verificación 1-3 |
| 8 | Tareas humanas previas documentadas | §Tareas humanas previas (A y B) |
| 9 | Gate humano: smoke en dev build de Android con `PUSH_ENABLED=true` y salida de geocerca simulada | **R12** + §Prueba de humo |

---

## Fuera de alcance

- **Cualquier cambio en `backend-pet-tracker/`.** El contrato de #13 está en
  producción y esta feature lo consume tal cual: ni un campo nuevo en el body, ni
  `PATCH`, ni un endpoint de listado de tokens.
- **Pantalla o banner propios de "activa las notificaciones"**, y navegar a los
  ajustes del sistema cuando el permiso está denegado. La decisión ya está
  cerrada en `feature_list.json` #79 ("permiso denegado → no registrar, no
  insistir, sin pantalla de ajustes en esta feature").
- **Claves de i18n.** Cero (§Declaración de i18n).
- **iOS.** El código es agnóstico (`platform` sale de `Platform.OS`), pero no hay
  credenciales APNs, ni dev build de iOS, ni smoke de iOS en este repo. El smoke
  de R12 es Android. Registrar desde iOS funcionará el día que exista ese build,
  sin tocar esta feature.
- **Notificaciones locales** (`scheduleNotificationAsync`) para los recordatorios
  de #39/#47. El scheduler del backend ya los despacha por su lado; fusionar
  ambos canales es feature aparte.
- **Badge de la app, sonidos personalizados, categorías/acciones de notificación,
  `expo-notifications` background tasks y `enableBackgroundRemoteNotifications`.**
  `shouldSetBadge: false` (R10) es deliberado: no hay contador honesto que
  mostrar (#78 §0.3 ya cerró que el punto rojo no lleva número).
- **Navegar al detalle de la alerta concreta** usando `data.petId` / `data.alertId`
  del payload. No existe pantalla de detalle (#78 §Fuera de alcance: "la fila no
  navega"); el tap lleva al centro de alertas y ahí se ve la alerta arriba.
- **Icono y color de notificación de Android** (opciones `icon` / `color` del
  config plugin). Exigen un PNG blanco 96×96 nuevo en `assets/`; sin él Android
  usa el icono de la app. Se añade cuando diseño entregue el asset.
- **`googleServicesFile` / `google-services.json` en el repo.** La credencial FCM
  V1 vive en EAS (Tarea B) y el dev build no la necesita en el árbol.
- **Reintento con backoff, cola offline o marca de "ya registrado" en disco**
  (R9): el reintento es el siguiente arranque, y el upsert lo hace gratis.
- **Timeout en las peticiones de `src/api/`.** Ningún módulo de `src/api/` tiene
  uno hoy; inventarlo solo para esta feature crearía un segundo patrón.
- **Borrar el token en `DeviceNotRegistered`.** Ya lo hace el backend (#13 R12).
- **Modificar `app.config.ts`** (§0.2 C1) **ni `src/api/devices.ts` /
  `src/api/reminders.ts`** (R4 es compatible hacia atrás).
- **Dependencias nuevas más allá de `expo-notifications`**: ninguna.
  `expo-device` y `expo-constants` ya están instaladas (§0.1).

---

## Enmiendas posteriores a la firma

### E1 — el rango de `expo-notifications` pasa de `~57.0.12` a `~57.0.19`

**Qué pasó.** Codex paró en R1 tal y como la spec le ordena. (Los comandos de
este relato se citan **tal y como se ejecutaron entonces**, con `npx`; la norma
vigente es `bunx` y está en el cuerpo de R1 y en `docs/conventions.md`.)
`npx expo install
expo-notifications` escribió `~57.0.19`, no `~57.0.12`. No retocó el rango a mano
y no siguió a R2. El comportamiento es el correcto y el rojo de R1 quedó
versionado en `a4f0bc8c`.

**Por qué la spec se equivocó.** El `~57.0.12` salió de
`node_modules/expo/bundledNativeModules.json`, que **no es la lista viva**: es la
instantánea que venía dentro del paquete `expo@57.0.14` instalado en este árbol.
`expo install` no lee ese fichero, consulta el resolutor de Expo, que hoy
recomienda `~57.0.19` para SDK 57 — y la doc versionada del SDK 57 dice lo mismo.
O sea: la cifra estaba caducada en el momento de escribirla, y este es el mismo
patrón que ya nos paró tres veces con los recuentos congelados.

**Qué NO significa.** No es un salto de versión real: `~57.0.12` admite en semver
cualquier `57.0.x` desde la 12, la 19 incluida. Lo instalado estaba dentro de lo
que la spec autorizaba; lo que discrepa es el **literal declarado** en
`package.json`, que es lo que el candado compara.

**Qué cambia.** El rango declarado y candado pasa a ser **`~57.0.19`** en R1,
en `design.md` §D1 y en la tabla de ficheros, y en `tasks.md` R1. Todo lo demás
de R1 sigue igual, salvo que el comando pasa a ser `bunx expo install` —en este
repo todo se instala y se ejecuta con **bun**—, y sigue vigente **no
retocar el rango a mano**: si en el futuro `expo install` volviera a escribir algo
distinto, se vuelve a parar y se vuelve a enmendar.

- [X] **E1 aprobada por humano** (fecha: 2026-09-17)

---

### E2 — el hook dice en desarrollo por qué no registró (requisito nuevo R13)

**Qué pasó.** En el gate humano del 2026-09-18 la fila de `push_tokens` no
aparecía. El backend quedó descartado con evidencia: un `POST /v1/me/push-tokens`
hecho a mano contra el backend de la LAN responde **200** y crea la fila. O sea
que el fallo está en la app, y ahí no hay nada que mirar: el hook tiene **seis
salidas que no dejan rastro** (`src/hooks/use-push-registration.ts`):

1. `status !== 'authenticated' || token === null`
2. `!setPushToken`
3. `!Device.isDevice`
4. `platform` distinto de `android`/`ios`
5. `!projectId`
6. el `catch` del bloque de registro, que se traga cualquier error de
   `setNotificationChannelAsync`, del permiso, de `getExpoPushTokenAsync` o de
   `registerPushToken`

El silencio de la 1 a la 5 y del `catch` es **deliberado y correcto** en
producción: R9 exige que un fallo de registro no bloquee el login ni moleste al
usuario. El problema no es el comportamiento, es que el gate humano no puede
distinguir "no hay `projectId`" de "el permiso está denegado" de "la llamada a
Expo falló". Es el mismo agujero que #72 cerró con su invariante.

**Qué cambia.** Requisito nuevo:

- **R13**: WHEN `__DEV__` es verdadero y `usePushRegistration` **no** llega a
  publicar el token, THE SYSTEM SHALL emitir exactamente un `console.warn` que
  **nombre la salida tomada**, con un prefijo estable `[push]` y un motivo
  legible por cada uno de los seis casos de arriba (en el `catch`, además, el
  error capturado). **IF** `__DEV__` es falso, **THEN** THE SYSTEM SHALL NOT
  emitir nada: en producción el comportamiento observable no cambia ni un ápice,
  y en particular **no** se introduce ningún log en el camino feliz.

Verificable en los tests del hook: cada caso ya tiene su test de comportamiento
(R6-R9), así que basta añadir la aserción del `console.warn` sobre un espía en
los que ya existen, más uno que fije el silencio con `__DEV__` falso.

**Lo que esto NO es.** No es un cambio de comportamiento ni una relajación de R9:
el registro sigue siendo best-effort, sigue sin bloquear el login y sigue
reintentando en el siguiente arranque. Solo deja de ser mudo mientras se depura.

- [X] **E2 aprobada por humano** (fecha: 2026-09-18)

---

### E3 — el dev build local necesita `google-services.json` (requisito nuevo R14)

**Qué pasó.** Con R13 puesto, el gate del 2026-09-18 dejó de ser ciego y dio la
causa en una línea:

```
[push] registration failed [Error: Unable to get Firebase Messaging instance.
Did you configure `googleServicesFile` path in app config? …
Default FirebaseApp is not initialized in this process com.trackermex.pettracker]
```

**Premisa falsa de esta spec, que queda corregida.** §Fuera de alcance decía:
*"`googleServicesFile` / `google-services.json` en el repo. La credencial FCM V1
vive en EAS (Tarea B) y el dev build no la necesita en el árbol."* **Es falso.**
Las credenciales que se suben a EAS las inyecta **EAS Build**; un dev build
compilado en la máquina del humano con `bunx expo run:android` no pasa por EAS,
así que Firebase no se inicializa y `getExpoPushTokenAsync` falla siempre. La
Tarea B estaba bien hecha y aun así no cubría este camino. Esa viñeta de
§Fuera de alcance queda **anulada** por esta enmienda.

**Decisión del humano (2026-09-18): opción A — dev build local, con el fichero
FUERA del repo.** Se descarta compilar el dev client con EAS Build, que habría
evitado el fichero pero ata cada rebuild nativo a la nube y a la cuota del plan
gratuito.

**Qué cambia:**

- **R14**: WHEN existe `mobile-pet-tracker/google-services.json`, THE SYSTEM
  SHALL declarar `android.googleServicesFile` apuntando a él en la configuración
  resuelta de Expo; **IF** no existe, **THEN** THE SYSTEM SHALL emitir un aviso
  por consola que nombre el fichero ausente y remita a `docs/verification.md`,
  **sin** declarar la clave y **sin** romper la resolución de config.
- El fichero **no se versiona**: entra en `mobile-pet-tracker/.gitignore`.
  Identifica el proyecto de Firebase del humano y cada máquina lo descarga de la
  consola de Firebase.
- **Se levanta el veto de C1 sobre `app.config.ts` solo para esto.** R14 vive
  ahí, no en `app.json`, porque es exactamente el patrón que ese fichero ya usa
  dos veces (`GOOGLE_MAPS_API_KEY_ANDROID` y `RESET_LINK_HOST`): configurar si
  el dato está, avisar si falta. Ponerlo estático en `app.json` rompería
  `bunx expo prebuild` para cualquiera que no tenga el fichero, incluidos los
  smokes de otras features que ya lo usan.
- `docs/verification.md` documenta de dónde sale el fichero y dónde va.

**Lo que esto NO cambia.** Ni un requisito de R1 a R13, ni el contrato con el
backend, ni el comportamiento de la app en producción. Es configuración nativa
del build de desarrollo.

- [X] **E3 aprobada por humano** (fecha: 2026-09-18)

---

### E4 — Expo Go no se detecta con `Device.isDevice`, y el módulo no puede tocar `expo-notifications` al importarse

**Qué pasó.** Paso 11 del gate humano (2026-09-21), abriendo el proyecto en Expo
Go: la app **revienta al arrancar**, antes de cualquier guard:

```
ERROR [Error: expo-notifications: Android Push notifications (remote
notifications) functionality provided by expo-notifications was removed from
Expo Go with the release of SDK 53. Use a development build instead of Expo Go.]
  <global> (src/hooks/use-push-registration.ts:3)
  <global> (src/app/_layout.tsx:10)
```

**Dos errores, y uno es de esta spec:**

1. **Premisa falsa en R6.2.** Dice que `Device.isDevice` **false** cubre
   *"emulador/simulador, y el caso Expo Go del criterio 4"*. Es falso: Expo Go
   sobre un **teléfono físico** tiene `Device.isDevice` **true**, así que ese
   guard nunca filtró Expo Go. Lo que distingue Expo Go es el entorno de
   ejecución (`Constants.executionEnvironment === 'storeClient'`, o el
   `appOwnership` equivalente), no si el aparato es físico.
2. **El fallo ocurre en tiempo de importación**, así que **ningún** guard dentro
   del hook podía evitarlo: `src/hooks/use-push-registration.ts` llama a
   `Notifications.setNotificationHandler({...})` en el nivel superior del módulo,
   y `src/app/_layout.tsx` lo importa siempre.

**Qué cambia:**

- **R6.2 queda corregido**: `Device.isDevice` cubre emulador y simulador. El caso
  Expo Go se detecta por entorno de ejecución, y es una condición **añadida** a
  las cuatro que ya tiene R6.
- **R15**: WHEN el módulo `use-push-registration` se importa, THE SYSTEM SHALL
  NOT ejecutar **ninguna** llamada a `expo-notifications` en el cuerpo del
  módulo; toda interacción —incluida la instalación del handler de primer
  plano— SHALL ocurrir dentro del efecto y **después** de que todas las
  condiciones de R6 se hayan evaluado. **IF** el entorno es Expo Go, **THEN** la
  app SHALL arrancar y funcionar con normalidad, sin diálogo, sin registro y
  **sin error visible**, que es lo que pide el criterio 4 de la feature.

**Nota de implementación que la spec deja cerrada**: si para cumplir R15 hace
falta que `expo-notifications` se cargue de forma perezosa en vez de con el
`import` estático de la línea 3, se hace, y el test lo fija. No es una
optimización: es la única forma de que un módulo importado siempre no rompa un
entorno donde la librería no existe.

**Lo que NO cambia.** R10 (el tap navega a alertas) ni el resto del ciclo de vida.
Los pasos 1-10 del smoke ya están dados por buenos y **no se repiten**: al cerrar
esto solo se repite el paso 11.

- [x] **E4 aprobada por humano** (fecha: 2026-09-20)

---

## Aprobación

- [X] Aprobado por humano (fecha: 2026-09-17) ← gate obligatorio antes de implementar

Al firmar, confirmar también estas tres decisiones cerradas por la spec:

- **§0.2 C1** — lo estático va en `app.json`; `app.config.ts` no se toca.
- **§0.3 C2** — `deleteJson` gana un quinto parámetro opcional `body`, en vez de
  un `fetch` a mano en `push-tokens.ts`.
- **R5** — el `AuthProvider` gana `setPushToken` en su contexto (guardado en un
  `useRef`), que es lo que permite hacer el `DELETE` antes de borrar la sesión
  sin que `expo-notifications` entre en el provider.

- [X] Tarea humana A — `eas init` y `extra.eas.projectId` en `app.json` (fecha: 2026-09-17)
- [X] Tarea humana B — credenciales FCM V1 subidas a EAS (fecha: 2026-09-17)

---
feature: "mobile-notifications-permission-recovery"
status: spec_ready         # draft | spec_ready | approved
tags: [harness, spec, mobile]
---

# Requisitos — [[mobile-notifications-permission-recovery]] (#99)

> Notación EARS. Cada requisito tiene id único R\<n\>, inmutable una vez aprobado.
> Ver [[design]] para las decisiones técnicas, [[tasks]] para el orden de
> commits y [[traceability]] para la trazabilidad.
>
> Fuente: `feature_list.json` #99 (description, cinco criterios y
> `files_affected`). Cada premisa del encargo se verificó contra el árbol antes
> de escribir un requisito (§0); las que no cuadraban se corrigen en §0.2. Cada
> rojo, cada verde y cada mutación de las tablas se **midió** con una sonda del
> spec_author en el scratchpad (copia del árbol fuera del repo, con un borrador
> de la implementación), no se supuso.
>
> Feature **solo móvil**, P3. Un estado nuevo en el hook de registro de #79, su
> reevaluación al volver a primer plano y un aviso en Perfil. **Cero
> dependencias, cero cambios nativos** (no hace falta regenerar el dev build:
> `Linking` y `AppState` son de `react-native`), **cero cambios de backend**,
> **+2 claves de catálogo**.
>
> Base: `d7cb0d60` (= `origin/main` el 2026-09-25, con #124 mergeado por la
> PR #165). La spec se midió en `b602ff6e`; entre los dos, #124 solo tocó
> `src/screens/home/index.test.tsx` (+2 tests), `docs/conventions.md` y sus
> specs/progress: **ningún** fichero de esta feature
> (`git diff --stat b602ff6e d7cb0d60`), así que P1-P18 y los rojos medidos
> valen igual. Branch
> `feature/99-mobile-notifications-permission-recovery`, worktree
> `/home/claude/sites/Pet-Tracker-wt-backend`. Rutas relativas a
> `mobile-pet-tracker/` salvo que se diga otra cosa. **Ninguna cita usa número
> de línea**: todo ancla es un texto literal que se encuentra con `grep -n`.

---

## §0. Verificación de premisas contra el árbol

### §0.1 Premisas confirmadas

| # | Premisa | Evidencia (ancla grepeable, medida en `b602ff6e`) |
|---|---|---|
| P1 | El hook sigue montado **una sola vez**, en el layout raíz, como hermano del Stack; #114 no lo movió | `src/app/_layout.tsx`: `function PushRegistration() {` con `usePushRegistration();`, renderizado como `<PushRegistration />` justo antes de `<RootStack />`, dentro de `SelectedPetProvider` |
| P2 | El registro se dispara con la sesión, no con una pantalla | `src/hooks/use-push-registration.ts`: el efecto de registro depende de `[setPushToken, status, token]`: corre al arrancar con sesión guardada y al iniciar sesión, y se limpia al cerrarla |
| P3 | Así decide hoy #79 R7, y así termina una negativa | `let permissions = await Notifications.getPermissionsAsync();`, `if (!permissions.granted && permissions.canAskAgain) {` → `permissions = await Notifications.requestPermissionsAsync();`, y `if (!permissions.granted) {` → `warnPush('skipped: notification permission denied');` + `return;`. Ningún estado, ninguna UI: solo el `console.warn` de desarrollo de #79 R13 |
| P4 | Sin reintento dentro de la sesión | `// Registration is best-effort and runs again on the next app start.` (#79 R9) |
| P5 | Versiones | `expo-notifications` **57.0.19**, `expo` 57.0.14, `react-native` 0.86.2 (`package.json` de cada módulo en `node_modules`). `node_modules/react-native/gradle/libs.versions.toml`: `minSdk = "24"`, `targetSdk = "36"`; sin `expo-build-properties` en `package.json`, y `android/` no está versionado (CNG) |
| P6 | Qué informa `expo-notifications` en Android 13+ (API ≥ 33 y targetSdk ≥ 33) | `node_modules/expo-notifications/android/src/main/java/expo/modules/notifications/permissions/NotificationPermissionsModule.kt`, `getPermissionsWithPromiseImplApi33`: `granted` = el permiso `POST_NOTIFICATIONS` concedido; `canAskAgain` = el del servicio de permisos. `requestPermissionsWithPromiseImplApi33` sí lanza el diálogo del sistema |
| P7 | De dónde sale `canAskAgain` tras una negativa en Android 13+ | `node_modules/expo-modules-core/android/src/main/java/expo/modules/adapters/react/permissions/PermissionsService.kt`: al resolver una petición denegada, `val blocked = !shouldShowRequestPermissionRationale(permission)` se **persiste** (`setBlocked`, preferencias `expo.modules.permissions.asked`) y después `getPermissions` devuelve `canAskAgain = !isBlocked(permission)`. Primera negativa: Android sí da *rationale* → `canAskAgain: true`. Segunda: no la da → `canAskAgain: false` |
| P8 | Qué abre `Linking.openSettings()` en Android | `node_modules/react-native/ReactAndroid/src/main/java/com/facebook/react/modules/intent/IntentModule.kt`, `override fun openSettings(`: `Settings.ACTION_APPLICATION_DETAILS_SETTINGS` con `package:<la app>` y `FLAG_ACTIVITY_NEW_TASK`, `FLAG_ACTIVITY_NO_HISTORY`, `FLAG_ACTIVITY_EXCLUDE_FROM_RECENTS`. Es la pantalla **«Información de la app»**; la fila «Notificaciones» está en ella |
| P9 | `expo-intent-launcher` no está instalado; no hace falta ninguna dependencia | `package.json` no lo declara y `node_modules/expo-intent-launcher` no existe. `Linking` y `AppState` vienen de `react-native` |
| P10 | Qué evento avisa de la vuelta desde los ajustes del sistema en Android | `node_modules/react-native/ReactAndroid/src/main/java/com/facebook/react/modules/appstate/AppStateModule.kt`: `override fun onHostResume()` → `APP_STATE_ACTIVE` (`"active"`), `override fun onHostPause()` → `APP_STATE_BACKGROUND` (`"background"`). En Android no hay `inactive` |
| P11 | Los dobles de `Linking` y `AppState` ya los pone el preset de jest | `node_modules/@react-native/jest-preset/jest/mocks/Linking.js`: `openSettings: jest.fn()`. `mocks/AppState.js`: `addEventListener: jest.fn(() => ({ remove: jest.fn() }))`. Ningún test necesita `jest.mock('react-native', …)` |
| P12 | Los dobles de `expo-notifications` del test del hook sirven tal cual | `src/hooks/use-push-registration.test.tsx`: `jest.mock('expo-notifications', () => ({` con `getPermissionsAsync`, `requestPermissionsAsync`, `getExpoPushTokenAsync`…; helpers `function permission(`, `function authenticatedAuth(`, `warnSpy`; el `beforeEach` de fichero deja `mockRequestPermissions.mockResolvedValue(permission(true, true));` y la plataforma en `'android'` |
| P13 | Quién renderiza el Perfil de verdad en los tests | `src/screens/profile/index.test.tsx` (33 tests) no mockea el hook; `src/app/(tabs)/__tests__/screens.test.tsx` renderiza `ProfileScreen` real sin mockearlo. Los tres tests de pila (`src/app/__tests__/detail-stack.guard.test.tsx`, `detail-stack.navigation.test.tsx`, `reminders-alerts-stack.navigation.test.tsx`) mockean el módulo con `{ usePushRegistration: jest.fn() }` pero sustituyen **todas** las pantallas por stubs (`function routes()` → `() => <Text>{key}</Text>`): el Perfil nunca se monta ahí |
| P14 | El precedente de «aviso con acción» ya está en Perfil | `src/screens/profile/index.tsx`: `<Card testID="profile-pet-error" className="items-start gap-3">` con un `Text` y `<Button testID="profile-pet-retry"` de variante por defecto (primaria de heroui, con feedback de pulsado de serie) |
| P15 | Contadores globales que un aviso mal compuesto movería | `src/__tests__/legibility-classnames.test.ts` (`#61 R4`): `[join('screens', 'profile', 'index.tsx'), 1]` de `text-accent-strong`; `src/__tests__/consistency-classnames.test.ts` (`#98 R10`): `count(/style=\{CONTINUOUS_CORNER\}/g)).toBe(33)`, `rounded-xl bg-accent` `13`, `bg-accent-soft` `16`. El aviso de [[design]] D7 no usa ninguna de esas clases: **no se mueven** (medido) |
| P16 | Los candados de catálogo que se mueven con copy nueva | `src/providers/__tests__/language-provider.test.tsx`: `expect(englishKeys).toHaveLength(` con `260 + 16 + 1 + 4 + 7 + 14 + 2 + 1 + 4 - 6 + 1,`; `src/__tests__/ui-language.test.ts`: `it('resuelve las 34 ocurrencias normativas'` con `expect(R7_PROFILE).toHaveLength(35 - 1); // #95 R5`; `src/__tests__/ui-copy-table.ts`: `export const R7_PROFILE: UseRow[] = [`; `specs/mobile-ui-language/design.md` §2.7. `checkUses` solo comprueba las filas listadas: un `t(` nuevo sin fila no pone nada rojo, por eso la fila la exige la spec |
| P17 | Base de datos local del humano | `docker-compose.yml`: `container_name: pet-tracker-postgres`, `POSTGRES_USER: pet_tracker`, `POSTGRES_DB: pet_tracker`. La tabla es `push_tokens` (`backend-pet-tracker/src/db/schema/push-tokens.schema.spec.ts`) |
| P18 | Bases | init.sh del leader en `b602ff6e` (exit 0, sin pipe): móvil **83 suites / 1508 tests**, backend unit **171 / 1307**, infra **2 / 14**, e2e **27 + 3 skipped (389 + 8 skipped)**. Del spec_author, `bunx jest --runTestsByPath <ruta>` desde `mobile-pet-tracker/` (exit 0): `src/hooks/use-push-registration.test.tsx` **26**; `src/screens/profile/index.test.tsx` **33**; `src/providers/__tests__/language-provider.test.tsx` **9**; `src/__tests__/ui-language.test.ts` **25**; `src/app/(tabs)/__tests__/screens.test.tsx` **2**; `src/hooks/use-push-registration.navigation.test.tsx` **1**. **Base de Codex** (`d7cb0d60`, leader, `bun run --cwd mobile-pet-tracker test` exit 0): móvil **83 / 1510** (+2 de #124 en la Home); los recuentos por fichero de arriba no cambian |

### §0.2 Premisas corregidas o precisadas (nadie construye sobre la versión anterior)

| # | Qué decía el encargo | Lo que dice el árbol | Evidencia |
|---|---|---|---|
| C1 | «tras la segunda negativa en Android no hay forma de activarlas» | Es el caso de **Android 13+**. En **Android 7-12** (API 24-32) no existe diálogo: `requestPermissionsAsync` solo relee, y `granted` y `canAskAgain` valen **los dos** `areNotificationsEnabled()`. Un usuario con las notificaciones apagadas ahí llega **ya bloqueado** en el primer arranque. El aviso de esta feature lo cubre igual | `getPermissionsWithPromiseImplClassic` en `NotificationPermissionsModule.kt`: `CAN_ASK_AGAIN_KEY to areEnabled`; y `requestPermissionsAsync` llama a `getPermissionsWithPromiseImplClassic(promise)` fuera de API 33 |
| C2 | «`Linking.openSettings()` abre los ajustes de notificaciones de la app» | Abre **«Información de la app»**; «Notificaciones» queda a **un toque** (P8). Ir directo exige `Linking.sendIntent('android.settings.APP_NOTIFICATION_SETTINGS', …)` con el paquete y un plan B: esa acción no existe por debajo de API 26 y `minSdk` es 24. El criterio 2 se lee como «abre la pantalla de ajustes de la app, desde la que se activan»: decisión D3, que firma el humano | [[design]] D3 |
| C3 | «`canAskAgain` false = el usuario dijo que no dos veces» | Es lo que **informa** el sistema, no un recuento: en Android 7-12 basta con tener las notificaciones apagadas (C1), y en 13+ el marcador `blocked` de expo se calcula al resolver **cualquier** petición denegada sin *rationale* (P7). El aviso se ata al estado informado, no a contar negativas | P7 |
| C4 | «reevaluar al volver de los ajustes» (¿foco de expo-router o `AppState`?) | **`AppState`**. El foco de expo-router no se entera: `node_modules/expo-router/build/react-navigation/core/useFocusEffect.js` solo escucha `navigation.addListener('focus'` / `'blur'`, y `grep -rn "AppState" node_modules/expo-router/build` no devuelve nada. Volver de otra app no cambia el estado de navegación | P10 |
| C5 | `files_affected`: el hook y el catálogo | Faltan `src/screens/profile/index.tsx` (el aviso), los tests del hook y de Perfil, los tres candados de catálogo (`language-provider.test.tsx`, `ui-language.test.ts`, `ui-copy-table.ts`) y la tabla de `specs/mobile-ui-language/design.md` §2.7. **No** cambian `src/app/_layout.tsx` ni `src/providers/auth-provider.tsx` (D5) | [[design]] §Archivos afectados |
| C6 | (implícito) los tests nuevos del hook pueden ir al final del fichero | **No.** `describe('R15: importar el modulo no toca expo-notifications'` hace `jest.resetModules()`, y desde ahí el `require('expo-notifications')` perezoso del hook recibe **otra instancia** de los dobles, sin configurar. Medido: con los `describe` de #99 al final, **13 rojos**; delante de R15, verdes | [[design]] D8 |
| C7 | (implícito) escuchar `'active'` y reevaluar siempre es inocuo | El diálogo de permiso de Android es otra Activity: la de la app pasa por `onHostPause` → `'background'` y vuelve con `onHostResume` → `'active'` mientras la primera evaluación sigue esperando la respuesta (P10). Reevaluar en **todo** `'active'` metería una segunda evaluación concurrente en el primer arranque. Por eso solo se reevalúa con el aviso encendido | [[design]] D4 |
| C8 | «banner o fila en Perfil, la spec decide» | Además de lo de diseño (D1), la **Home es terreno de la otra sesión**: #124 la tocó (`src/screens/home/index.test.tsx`, mergeada en `d7cb0d60`) y #126 (`feature/126-mobile-home-cell-icons-source-lock-unbounded`) vuelve a tocar ese mismo fichero. Perfil no se solapa con ninguna branch viva, y #126 no toca ni el catálogo ni sus candados | [[design]] D1 |

---

## Qué firma el humano al aprobar esta spec

Firmar sin editar = aceptar **D1-D9** de [[design]] tal cual. Aquí, una línea
por las que fijan comportamiento, copy o alcance; D5 (dónde vive el estado), D7
(anatomía del aviso), D8 (arnés de test) y D9 (orden de rojos) son técnicas.

| Id | Decisión | En una línea |
|---|---|---|
| **D1** | **El aviso vive en Perfil, arriba** | Una tarjeta justo debajo de la cabecera «Perfil / Añadir mascota», antes del selector de mascota. **No** en la Home (no compite con sus siete preguntas de la carta y no pisa a #124) ni como fila perdida entre los enlaces de abajo (el héroe de la mascota la empuja fuera de pantalla) |
| **D2** | **Cuándo aparece** | Solo si la última evaluación terminó con `granted === false` **y** `canAskAgain === false`. Tras la **primera** negativa en Android 13+ **no** aparece: en el siguiente arranque vuelve el diálogo del sistema (#79 R7) y un aviso a la vez sería redundante. Con el permiso concedido no aparece en ningún sitio |
| **D3** | **La acción abre «Información de la app»** | `Linking.openSettings()`, sin dependencia nueva y sin rama por plataforma. El usuario ve la pantalla de ajustes de la app y toca «Notificaciones» (un toque más que el intent directo). **No** se añade `expo-intent-launcher` ni se usa `Linking.sendIntent` (C2) |
| **D4** | **Reevaluación al volver** | Al pasar `AppState` a `'active'` **con el aviso encendido**, se relee el permiso con `getPermissionsAsync()` y **nunca** se llama a `requestPermissionsAsync()` (no vuelve el diálogo que #79 R7 evita). Si quedó concedido: el mismo registro de #79 (token + `POST`) y el aviso se apaga, sin reiniciar. Si sigue denegado: nada, y el aviso sigue |
| **D6** | **Copy** | es: `Las notificaciones están desactivadas. Actívalas en la configuración del teléfono para recibir alertas y recordatorios.` / `Abrir configuración`. en: `Notifications are turned off. Turn them on in your phone settings to receive alerts and reminders.` / `Open settings`. «Configuración» y no «Ajustes»: es la palabra de Android en español de México y la que ya usa la app (`'profile.gpsSettings': 'Configuración del Dispositivo GPS'`). **+2 claves** |

Si el humano **no** firma D1 y prefiere la Home, esta spec se reabre: cambia R3
entero (fichero, posición, candados de la Home y la declaración de las siete
preguntas que exige la carta), y hay que coordinar con la sesión de #124.

---

## Contrato (normativo)

Estado **final** del código (tras el verde de R3). Qué parte entra en cada
commit lo fija [[tasks]]: el verde de R1 conserva el `void (async () => { … })();`
de hoy y solo añade el almacén, `active` y la publicación; `evaluate(ask)` y
`AppState` llegan con el verde de R2.

**`src/hooks/use-push-registration.ts`**

- Exporta **`export function useNotificationsBlocked(): boolean`**, que devuelve
  `useSyncExternalStore(<suscribir>, () => <valor>)` sobre un booleano **de
  módulo** (inicial `false`) y un `Set` de suscriptores, también de módulo.
- Una función privada `setNotificationsBlocked(blocked: boolean): void` cambia
  ese booleano y avisa a los suscriptores **solo si cambia**.
- Dentro del efecto de registro, **después** de todas las guardas de #79 R6/R15
  (en el mismo sitio donde hoy se crea `responseSubscription`):
  - `let active = true;`
  - la evaluación del permiso es una función local
    `const evaluate = async (ask: boolean): Promise<void> => { … }` (flecha, no
    `function`, para conservar el estrechamiento de `token` y `setPushToken`)
    con el cuerpo del `void (async () => { … })();` de hoy, salvo dos cambios:
    `if (ask && !permissions.granted && permissions.canAskAgain) {` para pedir,
    y, **justo después** de resolver el permiso (tras la petición, si la hubo) y
    antes de `if (!permissions.granted) {`,
    `if (active) setNotificationsBlocked(!permissions.granted && !permissions.canAskAgain);`
    (el formateador puede partirlo en varias líneas);
  - `void evaluate(true);` en el lugar del `void (async () => { … })();`;
  - `const appStateSubscription = AppState.addEventListener('change', (state) => { if (state === 'active' && <el booleano de módulo>) void evaluate(false); });`
  - la limpieza pasa a ser `active = false;`, `setNotificationsBlocked(false);`,
    `appStateSubscription.remove();` y `responseSubscription.remove();`.
- Nada más cambia: ni las guardas, ni los mensajes de `warnPush`, ni
  `setNotificationHandler`, ni el segundo efecto (`getLastNotificationResponseAsync`).
  La reevaluación repite la creación del canal Android (idempotente); ningún test
  lo fija.

**`src/screens/profile/index.tsx`**

- `const notificationsBlocked = useNotificationsBlocked();` junto a los demás
  hooks de `ProfileScreen`, importado de `'../../hooks/use-push-registration'`;
  `Linking` se añade al `import { … } from 'react-native';`.
- Entre el cierre de la cabecera (la `View` de `profile.profile` y
  `profile-add-pet`) y `{pets.data?.kind === 'ok' && pets.data.pets.length > 0 ? (`:
  `{notificationsBlocked ? ( <Card testID="notifications-blocked-notice" className="items-start gap-3"> <Text className="font-normal text-foreground">{t('profile.notificationsBlocked')}</Text> <Button testID="notifications-open-settings" onPress={() => void Linking.openSettings()}> <Button.Label>{t('profile.openSettings')}</Button.Label> </Button> </Card> ) : null}`.
  `Button` sin `variant`, sin `className` y sin `size`; `Button.Label` sin
  `className`.

**`src/i18n/catalog.ts`**: las dos claves de D6, en `en` y en `es`, cada una en
**una sola línea** (convención del fichero), justo después de
`'profile.signOut': 'Sign out',` y de `'profile.signOut': 'Cerrar sesión',`.

---

## Requisitos funcionales

Todas las `describe` nuevas llevan el prefijo `#99 R<n>:`
(`docs/conventions.md` §Prefijo de feature: los dos ficheros de test ya tienen
R-ids de otras specs). Tests colocados junto al fichero que prueban.

### R1 — El hook publica el bloqueo solo con el permiso denegado y sin poder pedirse

**WHEN** la evaluación del permiso del hook termina (tras la petición de #79 R7
si la hubo),
**THE SYSTEM SHALL** publicar en `useNotificationsBlocked()` el valor
`granted === false && canAskAgain === false` del **último** estado leído o
devuelto por la petición, sin llamar a `requestPermissionsAsync()` cuando
`getPermissionsAsync()` ya trae `canAskAgain: false`,
**AND WHEN** el efecto se limpia (desmontaje o cambio de sesión),
**THE SYSTEM SHALL** publicar `false`, **AND IF** una evaluación termina después
de esa limpieza, **THEN THE SYSTEM SHALL NOT** publicar nada.

- **Test**: `src/hooks/use-push-registration.test.tsx`, **inmediatamente antes
  de** `describe('R15: importar el modulo no toca expo-notifications'` (C6),
  `describe('#99 R1: el hook publica el bloqueo solo con el permiso denegado y sin poder pedirse'`,
  sin `beforeEach` propio (usa el de fichero), con un `it.each` de 5 filas y dos
  `it`.
- **Helpers de módulo** (antes del `describe`, entran en el rojo de R1):
  `function useRegistrationProbe(): boolean` que llama a `usePushRegistration()`
  y devuelve `useNotificationsBlocked()`; y
  `async function flushEvaluation(): Promise<void>` que hace
  `await act(async () => undefined);`. Imports: `act` se añade al import de
  `@testing-library/react-native`, y `useNotificationsBlocked` al de
  `./use-push-registration`.
- **`it.each`** (título `'%s'`), columnas `[título, inicial, pedido, bloqueado, peticiones]`:
  1. `mockGetPermissions.mockResolvedValue(inicial)`; si `pedido` no es
     `undefined`, `mockRequestPermissions.mockResolvedValue(pedido)`.
  2. `const probe = await renderHook(() => useRegistrationProbe());`
  3. Ancla (conventions §Esperas: la aserción de ausencia se ancla a un estado
     final): `await waitFor(() => …)` que, si `inicial.granted || pedido?.granted`,
     espera `mockRegisterPushToken` llamado **1** vez, y si no, espera
     `warnSpy` llamado con `'[push] skipped: notification permission denied'`.
     Después `await flushEvaluation();`.
  4. `expect(probe.result.current).toBe(bloqueado)`,
     `expect(mockGetPermissions).toHaveBeenCalledTimes(1)`,
     `expect(mockRequestPermissions).toHaveBeenCalledTimes(peticiones)`.

| # | Título de la fila (`%s`) | Inicial | Pedido | Bloqueado | Peticiones |
|---|---|---|---|---|---|
| 1 | `denegado y canAskAgain false de entrada: aviso, sin diálogo` | `permission(false, false)` | `undefined` | `true` | `0` |
| 2 | `segunda negativa en este arranque: aviso tras el diálogo` | `permission(false, true)` | `permission(false, false)` | `true` | `1` |
| 3 | `primera negativa: sin aviso, el diálogo vuelve en el siguiente arranque` | `permission(false, true)` | `permission(false, true)` | `false` | `1` |
| 4 | `concedido de entrada: sin aviso` | `permission(true, true)` | `undefined` | `false` | `0` |
| 5 | `concedido en el diálogo: sin aviso` | `permission(false, true)` | `permission(true, true)` | `false` | `1` |

  Fila 1: criterio 1 (aviso y **ningún** diálogo). Fila 4: criterio 4.
  El `it.each` va tipado `as const`.

- **`it('al desmontar el aviso se apaga')`**: `getPermissionsAsync` resuelve
  `permission(false, false)`; `probe = renderHook(() => useRegistrationProbe())`
  y un **observador** aparte `observer = renderHook(() => useNotificationsBlocked())`;
  `await waitFor(() => expect(observer.result.current).toBe(true))`;
  `await probe.unmount()`; `expect(observer.result.current).toBe(false)`.
- **`it('una evaluación que termina después de desmontar no enciende el aviso')`**:
  `mockGetPermissions.mockReturnValue(<promesa que el test resuelve a mano>)`;
  `probe` y `observer` como arriba; esperar `mockGetPermissions` llamado 1 vez;
  `await probe.unmount()`; `await act(async () => { <resolver con permission(false, false)> })`;
  `expect(warnSpy).toHaveBeenCalledWith('[push] skipped: notification permission denied')`
  (la evaluación sí terminó) y `expect(observer.result.current).toBe(false)`.
- **Rojo natural** (esqueleto de [[tasks]] R1: `useNotificationsBlocked` que
  devuelve `false`; medido): filas **1 y 2** y `al desmontar…`, **3 rojos** por
  aserción. Filas 3-5 y `una evaluación que termina…` quedan verdes: son los
  controles de las mutaciones M1, M4 y M5.
- **Mutaciones que deben dejarlo rojo** (medidas sobre el verde completo, con el
  fichero entero; entre paréntesis lo que cae además en R2 o en #79):

| Id | Mutación en `use-push-registration.ts` | Rojos |
|---|---|---|
| M1 | publicar `!permissions.granted` (ignorar `canAskAgain`) | fila 3 (+ R2 `…canAskAgain vuelve a true…` y `no reevalúa: primera negativa…`) |
| M2 | publicar con la lectura **previa** a la petición | fila 2 |
| M3 | sin `setNotificationsBlocked(false)` en la limpieza | `al desmontar…` y `una evaluación que termina…` |
| M4 | sin la guarda `if (active)` | `una evaluación que termina…` |
| M5 | publicar siempre `true` | filas 3, 4, 5 (+ 4 de R2) |
| M6 | pedir aunque `canAskAgain` sea `false` | fila 1, `al desmontar…`, `una evaluación…` (+ `R7` de #79 `no insiste cuando el permiso ya no se puede pedir`, + 4 de R2) |
| M7 | cambiar el booleano sin avisar a los suscriptores | filas 1, 2 y `al desmontar…` (+ 5 de R2) |

  `!permissions.canAskAgain` a secas no se distingue de la fórmula en ningún
  estado alcanzable: con `granted: true`, `canAskAgain` vale `true` en Android
  (P6, C1) y en iOS (`node_modules/expo-modules-core/ios/Legacy/Services/Permissions/EXPermissionsService.m`:
  `BOOL canAskAgain = status != EXPermissionStatusDenied;`). No lleva fila.

### R2 — Al volver a primer plano con el aviso encendido, se reevalúa el permiso sin pedirlo

**WHILE** `useNotificationsBlocked()` es `true`,
**WHEN** `AppState` emite `'change'` con `'active'`,
**THE SYSTEM SHALL** volver a leer `getPermissionsAsync()` **sin** llamar a
`requestPermissionsAsync()`, publicar el bloqueo con la regla de R1 y, si el
permiso está concedido, ejecutar el registro de #79 R8 (`getExpoPushTokenAsync`,
`setPushToken`, `registerPushToken`) **sin remontar el hook**;
**AND WHILE** el aviso está apagado, o si el estado no es `'active'`,
**THE SYSTEM SHALL NOT** reevaluar. El listener se crea **una vez**, solo tras
las guardas de #79, y se retira en la limpieza.

- **Test**: mismo fichero, justo después del `describe` de R1 (y, por tanto,
  todavía antes de R15),
  `describe('#99 R2: al volver a primer plano con el aviso encendido se reevalúa el permiso sin pedirlo'`
  con `beforeEach(() => { captureAppStateListener(); })`, un `it.each` de 3
  filas, un `it.each` de 3 filas y dos `it`.
- **Helpers de módulo** (antes de este `describe`, entran en el rojo de R2):
  `AppState` y `type AppStateStatus` se añaden al import de `'react-native'`;
  `const mockAddAppStateListener = jest.mocked(AppState.addEventListener);`,
  `const mockRemoveAppStateListener = jest.fn();`,
  `let appStateListener: ((state: AppStateStatus) => void) | undefined;` y
  `function captureAppStateListener(): void` que pone `appStateListener` a
  `undefined` y hace
  `mockAddAppStateListener.mockImplementation((_type, listener) => { appStateListener = listener; return { remove: mockRemoveAppStateListener }; })`.
  No se copia ningún `jest.mock` de otra suite: `AppState` ya es un doble del
  preset (P11).
- **`it.each`** de vuelta (título `'al volver a active, %s'`), columnas
  `[título, relectura, avisos, bloqueado]`:
  1. `mockGetPermissions.mockResolvedValueOnce(permission(false, false)).mockResolvedValueOnce(relectura)`;
     `probe = renderHook(() => useRegistrationProbe())`;
     `await waitFor(() => expect(probe.result.current).toBe(true))`;
     `expect(mockAddAppStateListener).toHaveBeenCalledTimes(1)` y
     `toHaveBeenCalledWith('change', expect.any(Function))`.
  2. `await act(async () => { appStateListener?.('active'); })`.
  3. Ancla: `await waitFor(() => { expect(warnSpy).toHaveBeenCalledTimes(avisos); expect(mockRegisterPushToken).toHaveBeenCalledTimes(relectura.granted ? 1 : 0); })`
     y `await flushEvaluation()`.
  4. `expect(probe.result.current).toBe(bloqueado)`,
     `expect(mockGetPermissions).toHaveBeenCalledTimes(2)`,
     `expect(mockRequestPermissions).not.toHaveBeenCalled()`,
     `expect(mockSetPushToken.mock.calls).toEqual(relectura.granted ? [['ExpoPushToken[xxx]']] : [])`
     y `expect(mockRegisterPushToken.mock.calls).toEqual(relectura.granted ? [['http://example.test/v1', 'jwt-token', { expoToken: 'ExpoPushToken[xxx]', platform: 'android' }]] : [])`.

| # | Título de la fila (`%s`) | Relectura | Avisos | Bloqueado |
|---|---|---|---|---|
| 1 | `concedido en los ajustes: registra el token y apaga el aviso sin reiniciar` | `permission(true, true)` | `1` | `false` |
| 2 | `sigue denegado: no registra y el aviso sigue` | `permission(false, false)` | `2` | `true` |
| 3 | `denegado pero canAskAgain vuelve a true: tampoco lanza el diálogo aquí` | `permission(false, true)` | `2` | `false` |

  Fila 1: criterio 3 (registro sin reiniciar). Fila 2: el segundo `warnPush`
  es el mismo mensaje (#79 R13 nombra cada salida). Fila 3 no es un estado que
  Android dé tras un bloqueo (P7), pero es la única que distingue «reevaluar
  sin pedir» de «reevaluar pidiendo» (N3): con `canAskAgain: false` la
  petición no se haría de todos modos.
- **`it.each`** de no reevaluación (título `'no reevalúa: %s'`), columnas
  `[título, inicial, pedido, estado]`: `mockGetPermissions.mockResolvedValue(inicial)`,
  `pedido` como en R1; renderizar `useRegistrationProbe`; ancla: si
  `inicial.granted`, `mockRegisterPushToken` llamado 1 vez; si no, `warnSpy`
  llamado 1 vez; `await act(async () => { appStateListener?.(estado); })`;
  `await flushEvaluation()`; `expect(mockAddAppStateListener).toHaveBeenCalledTimes(1)`,
  `expect(mockGetPermissions).toHaveBeenCalledTimes(1)` y
  `expect(mockRegisterPushToken).toHaveBeenCalledTimes(inicial.granted ? 1 : 0)`.

| # | Título de la fila (`%s`) | Inicial | Pedido | Estado |
|---|---|---|---|---|
| 1 | `concedido de entrada, vuelve a active` | `permission(true, true)` | `undefined` | `'active'` |
| 2 | `primera negativa, vuelve a active` | `permission(false, true)` | `permission(false, true)` | `'active'` |
| 3 | `aviso encendido, pasa a background` | `permission(false, false)` | `undefined` | `'background'` |

- **`it('retira el listener de AppState al desmontar')`**: renderizar
  `useRegistrationProbe`; esperar `mockAddAppStateListener` llamado 1 vez;
  `await probe.unmount()`; `expect(mockRemoveAppStateListener).toHaveBeenCalledTimes(1)`.
- **`it('sin precondiciones no se suscribe a AppState')`**:
  `mockUseAuth.mockReturnValue({ ...authenticatedAuth(), status: 'unauthenticated', token: null })`;
  renderizar `useRegistrationProbe`;
  `expect(mockAddAppStateListener).not.toHaveBeenCalled()`.
- **Rojo natural** (medido sobre el verde de R1, que no escucha `AppState`):
  las 3 filas de vuelta, las 3 de no reevaluación y `retira el listener…`,
  **7 rojos** por aserción (`mockAddAppStateListener` sin llamar).
  `sin precondiciones…` queda verde: es el control de N7.
- **Mutaciones que deben dejarlo rojo** (medidas):

| Id | Mutación | Rojos |
|---|---|---|
| N1 | reevaluar en todo `'active'`, con o sin aviso | `no reevalúa: concedido…`, `no reevalúa: primera negativa…` |
| N2 | reevaluar en todo `'change'` con aviso, sea cual sea el estado | `no reevalúa: aviso encendido, pasa a background` |
| N3 | reevaluar con `evaluate(true)` (pidiendo) | fila 3 de vuelta |
| N4 | al volver, publicar el bloqueo pero no registrar | fila 1 de vuelta |
| N5 | al volver, no recalcular el bloqueo | filas 1 y 3 de vuelta |
| N6 | sin `appStateSubscription.remove()` | `retira el listener…` |
| N7 | suscribirse a `AppState` también antes de las guardas | `sin precondiciones…` y las 7 que cuentan una sola suscripción |

### R3 — Perfil avisa de las notificaciones bloqueadas y abre la configuración de la app

**WHILE** `useNotificationsBlocked()` es `true`,
**THE SYSTEM SHALL** pintar en Perfil, como **segundo** hijo del contenedor del
`ScrollView` (justo después de la cabecera y antes del selector de mascota), un
`Card` `testID="notifications-blocked-notice"` con **dos** hijos, en este orden:
el texto `profile.notificationsBlocked` (clase `font-normal text-foreground`) y
un botón `testID="notifications-open-settings"` con `profile.openSettings`;
**WHEN** se pulsa el botón, **THE SYSTEM SHALL** llamar **una vez** a
`Linking.openSettings()` sin argumentos y sin navegar;
**WHILE** es `false`, **THE SYSTEM SHALL NOT** pintar el aviso.
Las dos claves existen en `es` y `en` con el copy literal de D6 y están
registradas en la tabla de idioma.

- **Test**: `src/screens/profile/index.test.tsx`, **al final del fichero**
  (después de `describe('#72 R3: el mock del picker no hereda implementación entre tests'`),
  `describe('#99 R3: Perfil avisa de las notificaciones bloqueadas y abre la configuración de la app'`
  con **cinco** `it`.
- **Arnés** (entra en el rojo de R3):
  - `jest.mock('../../hooks/use-push-registration', () => ({ useNotificationsBlocked: jest.fn(() => false) }));`
    justo después del `jest.mock('../../providers/auth-provider', () => ({`.
    Con `false` por defecto, los 33 tests previos ven el Perfil de hoy.
  - Imports: `Linking` en `import { Text, TextInput } from 'react-native';`;
    `import { useNotificationsBlocked } from '../../hooks/use-push-registration';`;
    `import { en, es } from '../../i18n/catalog';`.
  - Antes del `describe`: `const { readFileSync } = jest.requireActual<typeof import('fs')>('fs');`
    (el patrón de `src/app/(tabs)/__tests__/food.test.tsx`),
    `const mockUseNotificationsBlocked = jest.mocked(useNotificationsBlocked);`,
    `const mockOpenSettings = jest.mocked(Linking.openSettings);` y
    `const NOTICE_ES = 'Las notificaciones están desactivadas. Actívalas en la configuración del teléfono para recibir alertas y recordatorios.';`
  - `beforeEach`: `jest.clearAllMocks()`, `process.env.EXPO_PUBLIC_API_URL = apiUrl`,
    `mockUseAuth.mockReturnValue({ status: 'authenticated', token: 'jwt-token', signIn: jest.fn(), signOut: jest.fn() } satisfies AuthContextValue)`,
    `mockGetMe`, `mockListPets` y `mockGetPet` con `pending<…>()` (como
    `describe('R3: reminders-link y sign out'`) y
    `mockOpenSettings.mockResolvedValue(undefined)`.
  - `afterEach(() => { mockUseNotificationsBlocked.mockReturnValue(false); })`:
    `jest.clearAllMocks()` **no** borra un `mockReturnValue` (el mismo hueco que
    cerró `#72 R3`).
- **`it('con el permiso bloqueado pinta el aviso justo debajo de la cabecera, con su copy y su acción')`**:
  `mockUseNotificationsBlocked.mockReturnValue(true)`; `await renderProfile()`;
  esperar `notifications-blocked-notice` visible. Con
  `const header = screen.getByTestId('profile-add-pet').parent!;` y
  `const content = header.parent!;`:
  `expect(content.parent?.props.testID).toBe('screen-profile')`,
  `expect(content.children.indexOf(header)).toBe(0)`,
  `expect(content.children.indexOf(notice)).toBe(1)`,
  `expect(notice).toHaveProperty('props.className', 'rounded-card border border-border bg-surface p-4 shadow-sm items-start gap-3')`,
  `expect(notice.children).toHaveLength(2)`,
  `expect(notice.children[0]).toHaveTextContent(NOTICE_ES)`,
  `expect(notice.children[0]).toHaveProperty('props.className', 'font-normal text-foreground')`,
  `expect(notice.children.indexOf(action)).toBe(1)`,
  `expect(action).toHaveTextContent('Abrir configuración')` y
  `expect(action.props.accessibilityRole).toBe('button')`, con
  `notice`/`action` = `getByTestId` de sus `testID`. Posiciones con
  `indexOf` y no con `toBe(<elemento>)`: medido, un `toBe` fallido entre
  elementos del árbol tumba el worker de jest en vez de dar un rojo legible.
- **`it('pulsar la acción abre la configuración de la app una vez y no navega')`**:
  bloqueo `true`; esperar el botón visible; `fireEvent.press` sobre
  `notifications-open-settings`; `expect(mockOpenSettings).toHaveBeenCalledTimes(1)`,
  `toHaveBeenCalledWith()` y `expect(mockRouter.push).not.toHaveBeenCalled()`.
- **`it('en inglés el aviso y la acción se pintan en inglés')`**: bloqueo
  `true`; esperar `language-toggle` visible; pulsarlo; `waitFor` hasta que
  `getByTestId('notifications-blocked-notice').children[0]` tenga el texto en de
  D6; el botón, `'Open settings'`.
- **`it('registra las dos claves en los dos idiomas y en la tabla de idioma')`**:
  con `const english = en as Record<string, string>;` y
  `const spanish = es as Record<string, string>;` (el cast deja compilar el
  rojo, como en `#113 R3`), los cuatro literales de D6 con `toBe`, y
  `readFileSync('../specs/mobile-ui-language/design.md', 'utf8')` casa con
  `` /\| — \| `profile\.notificationsBlocked`[^\n]*← añadida por #99 \(R3\)/ `` y con
  `` /\| — \| `profile\.openSettings`[^\n]*← añadida por #99 \(R3\)/ ``.
- **`it('sin bloqueo no hay aviso en Perfil')`**: bloqueo `false`;
  `await renderProfile()`; **ancla positiva**: esperar `profile-sign-out`
  visible; `expect(mockUseNotificationsBlocked).toHaveBeenCalled()` (Perfil
  consulta el estado) y `queryByTestId` de los dos `testID`, `queryByText(NOTICE_ES)`
  y `queryByText('Abrir configuración')` son `null`. Criterio 4.
- **Rojo natural** (medido con la pantalla, el catálogo y `ui-copy-table.ts` de
  `b602ff6e` y los tests de R3): los **5** `it` nuevos, más los candados
  movidos de `language-provider.test.tsx` y de `#65 R7` (§Candados): **7
  rojos** por aserción. `tsc --noEmit` pasa en ese rojo.
- **Mutaciones que deben dejarlo rojo** (medidas):

| Id | Mutación en `src/screens/profile/index.tsx` | Rojos |
|---|---|---|
| P1 | el aviso al final, antes de `profile-sign-out` | `con el permiso bloqueado…` |
| P2 | las dos claves cruzadas entre texto y botón | `con el permiso bloqueado…`, `en inglés…` |
| P3 | `Linking.openURL('app-settings:')` en vez de `openSettings()` | `pulsar la acción…` |
| P4 | el aviso siempre visible (`true ? (`) | `sin bloqueo…` |
| P5 | texto con `text-muted` | `con el permiso bloqueado…` |
| P6 | `Abrir configuración` escrito a mano en el `Button.Label` | `en inglés…` (+ `#65 R7` y dos de `#65 R18` en `ui-language.test.ts`) |
| P7 | `variant="secondary"` en el `Card` | `con el permiso bloqueado…` |
| P8 | `openSettings()` dos veces en el `onPress` | `pulsar la acción…` |
| P9 | el botón antes que el texto | `con el permiso bloqueado…`, `en inglés…` |

### R4 — Gate humano: smoke en dev build de Android

**WHEN** R1-R3 están en verde y el `reviewer` aprobó,
**THE SYSTEM SHALL** superar la prueba de humo de §Prueba de humo, corrida por
el humano en un **dev build de Android** (nunca Expo Go: allí el hook sale por
`skipped: Expo Go does not support remote notifications` y no hay nada que
ver) con **Android 13 o superior**. **No delegable a IA.** Se firma en su
propia casilla, no en §Aprobación.

---

## Candados

### Se mueven (delta declarado; ninguno más)

| Fichero · ancla grepeable | Delta | R · commit |
|---|---|---|
| `src/hooks/use-push-registration.test.tsx` | **26 → 33** (R1 +7) **→ 41** (R2 +8) | R1, R2 · rojos |
| `src/screens/profile/index.test.tsx` | **33 → 38** (R3 +5) | R3 · rojo |
| `src/providers/__tests__/language-provider.test.tsx` · `expect(englishKeys).toHaveLength(` | ` + 2` al final de la suma (hoy `260 + 16 + 1 + 4 + 7 + 14 + 2 + 1 + 4 - 6 + 1,` → `… - 6 + 1 + 2,`), y en el comentario de encima, tras `+ 1 de #113 R3 (food.kcalConsumedOfTarget)`, ` + 2 de #99 R3 (profile.notificationsBlocked, profile.openSettings)` antes del punto final. Recuento de tests del fichero: **9** (=). Si al arrancar la suma ya no es esa, se añade ` + 2` a la que haya | R3 · rojo |
| `src/__tests__/ui-language.test.ts` · `describe('#65 R7: Profile resuelve su copy por clave'` | `it('resuelve las 34 ocurrencias normativas'` → `it('resuelve las 36 ocurrencias normativas'` y `expect(R7_PROFILE).toHaveLength(35 - 1); // #95 R5` → `expect(R7_PROFILE).toHaveLength(35 - 1 + 2); // #95 R5, +2 #99 R3`. Recuento del fichero: **25** (=) | R3 · rojo |
| `src/__tests__/ui-copy-table.ts` · `R7_PROFILE`, después de `{ file: 'src/screens/profile/index.tsx', key: 'profile.addPet' },` | dos filas: `{ file: 'src/screens/profile/index.tsx', key: 'profile.notificationsBlocked' }, // #99 R3` y `{ file: 'src/screens/profile/index.tsx', key: 'profile.openSettings' }, // #99 R3` | R3 · **verde** (el campo `key` es `TranslationKey`: en el rojo no compilaría) |
| `specs/mobile-ui-language/design.md` §2.7 · después de la fila `` | 219 | `profile.addPet` | `Add pet` | `Añadir mascota` | `` | dos filas `` | — | `profile.notificationsBlocked` | `<en de D6>` | `<es de D6>` | ← añadida por #99 (R3) `` y `` | — | `profile.openSettings` | `Open settings` | `Abrir configuración` | ← añadida por #99 (R3) `` | R3 · verde |
| Suite móvil | **+0 suites, +20 tests**: sobre `d7cb0d60`, `83 / 1510 → 83 / 1530` (medido en el scratchpad sobre `b602ff6e` con el borrador completo, `83 / 1508 → 83 / 1528`, exit 0; `tsc --noEmit` y `eslint src` exit 0) | — |
| Backend, infra, e2e | **+0** (cero cambios fuera de `mobile-pet-tracker/` y de la tabla de idioma) | — |

### Siguen verdes sin tocarlos (si uno se pone rojo, la implementación está mal)

| Candado | Qué fija que esta feature no puede mover |
|---|---|
| `use-push-registration.test.tsx` · `R6`, `R7` (sobre todo `no insiste cuando el permiso ya no se puede pedir`), `R8` (`repite la secuencia completa en un segundo montaje`), `R9`, `R13`, `R10`, `R15` | Guardas, petición una sola vez, registro, sin reintento, un `warnPush` por salida, listener de respuestas y la importación perezosa de `expo-notifications` |
| `src/hooks/use-push-registration.navigation.test.tsx` · `describe('R10: cold start conserva alertas frente al redirect autenticado'` | El hook real dentro de `renderRouter`, con el `AppState` del preset |
| `src/app/__tests__/detail-stack.guard.test.tsx`, `detail-stack.navigation.test.tsx`, `reminders-alerts-stack.navigation.test.tsx` | Mockean el hook con `{ usePushRegistration: jest.fn() }`; nada de `_layout.tsx` cambia y el Perfil no se monta ahí (P13) |
| `src/app/(tabs)/__tests__/screens.test.tsx` | Perfil real con el hook real: el estado de módulo arranca en `false`, sin aviso |
| Los 33 tests previos de `src/screens/profile/index.test.tsx` | Con el doble en `false`, el Perfil de hoy |
| `src/__tests__/legibility-classnames.test.ts` · `describe('#61 R4: el acento como tinta usa accent-strong'` y `src/__tests__/consistency-classnames.test.ts` · `describe('#98 R10: los candados que esta feature no mueve'`, `describe('#62 R1: …'`, `it('profile usa tres ChevronRight de reicon'` | El aviso no usa `text-accent-strong`, `bg-accent-soft`, `rounded-xl bg-accent`, `CONTINUOUS_CORNER` ni `ChevronRight` (P15) |
| `src/__tests__/design-drift.test.ts` · `describe('R9: mobile-pets-profile sin drift'`, `it.each([…'profile'…])('%s importa el Card compartido'`, `describe('#87 R19: use-' + 'api no deja huella'` (`'screens/profile/index.tsx': 2` llamadas a `signOut`) | Sin hex, sin clases arbitrarias, `Card` compartido, y el aviso no llama a `signOut` |
| `src/__tests__/ui-language.test.ts` · `describe('#65 R18: los sitios resuelven por clave y no queda copy suelta'` | Ningún literal del catálogo escrito a mano en Perfil |

---

## Prueba de humo del humano (no delegable a IA) — R4

**Entorno:**

- **Dev build de Android**, nunca Expo Go. No hace falta regenerarlo (cero
  cambios nativos): basta el JS de esta branch desde Metro. Teléfono con
  **Android 13 o superior** (Ajustes → Acerca del teléfono); si es 12 o menos,
  **parar y avisar**: ahí no hay diálogo (C1) y los pasos 2-3 no aplican.
- Backend con el registro de push de #13 accesible desde el teléfono (el mismo
  del smoke de #79; esta feature no cambia el backend) y su log a la vista.
- Base de datos: la del backend que usa el teléfono. Si es el Postgres de
  `docker-compose.yml` de esa máquina, la consulta es (PowerShell o cmd, una
  línea):
  `docker exec pet-tracker-postgres psql -U pet_tracker -d pet_tracker -c "select id, platform, left(expo_token, 18) as tok, created_at from push_tokens where user_id = (select id from users where email = '<tu-email>');"`.
  **Antes**, confirmar que el `DATABASE_URL` del `.env` de ese backend apunta a
  `localhost:5432/pet_tracker`; si apunta a otra base, usar
  `psql "<ese DATABASE_URL>" -c "<la misma select>"` (un `docker exec` contra
  otra base da un resultado que no es el del backend).
- `adb` conectado; con dos transportes Wi-Fi, usar siempre
  `adb -s <ip:puerto>`.

**Pasos:**

1. **Estado limpio.** Con sesión iniciada, **Perfil → Cerrar sesión** (#79 R5
   borra la fila). Después
   `adb -s <ip:puerto> shell pm clear com.trackermex.pettracker` (borra datos
   y sesión, y deja el permiso sin decidir). El dev client vuelve a su
   pantalla de inicio: conectarlo otra vez a Metro. La `select` da **0 filas**.
2. **Primera negativa.** Abrir la app e iniciar sesión: aparece el diálogo del
   sistema. Si **no** aparece, el `pm clear` no reinició el permiso:
   desinstalar el dev build, reinstalarlo (`bunx expo run:android`) y volver
   al paso 2. Tocar **«No permitir»**. Ir a **Perfil**: **no hay aviso**
   (D2). La `select` sigue en **0 filas**.
3. **Segunda negativa.** Matar la app y reabrirla: el diálogo vuelve (#79 R7).
   **«No permitir»**. Ir a **Perfil**: arriba, bajo «Perfil / Añadir mascota»,
   la tarjeta con **«Las notificaciones están desactivadas. Actívalas en la
   configuración del teléfono para recibir alertas y recordatorios.»** y el
   botón **«Abrir configuración»**. La **Home no muestra nada nuevo**. 0 filas.
4. **Sin diálogo** (criterio 1). Matar la app y reabrirla: **ningún diálogo**;
   en Perfil, el aviso sigue. 0 filas.
5. **Volver sin cambiar nada.** Tocar **«Abrir configuración»**: se abre la
   pantalla **«Información de la app»** del dev build (criterio 2; D3).
   Volver con el gesto o el botón atrás **sin tocar nada**: Perfil, **el aviso
   sigue**. 0 filas.
6. **Activar y volver** (criterio 3). **«Abrir configuración» →
   «Notificaciones» → activar** el interruptor general de la app. Volver a la
   app (atrás, **sin matarla**): en **menos de 3 s** el aviso **desaparece**
   de Perfil. La `select` da **1 fila**, `platform = android`, `tok`
   empezando por `ExpoPushToken[`, y el log del backend muestra el
   `POST /v1/me/push-tokens` de ese momento. Anotar el `id`.
7. **Concedido de entrada** (criterio 4). Matar la app y reabrirla: **ningún
   diálogo, ningún aviso** en Perfil ni en la Home. La `select` sigue con
   **1 fila y el mismo `id`** (el upsert de #13).
8. Si Metro está a la vista: tras el paso 3 puede salir **dos veces**
   `[push] skipped: notification permission denied`. Es esperado (la
   reevaluación del regreso del diálogo, [[design]] D4) y no es un fallo.

- [ ] Prueba de humo de R4 superada por el humano (fecha: ____, dispositivo: ____, Android: ____)

---

## Cobertura de los criterios de aceptación de `feature_list.json` #99

| Criterio | Cubierto por |
|---|---|
| 1. Denegado y `canAskAgain` false: aviso accionable y **sin** diálogo del sistema | R1 fila 1 (`peticiones = 0`, bloqueado `true`), R3 (aviso con acción), R2 (la vuelta nunca pide: `mockRequestPermissions` sin llamar en las 3 filas, N3), R4 pasos 3-4 |
| 2. La acción abre los ajustes de notificaciones de la app en un dev build de Android | R3 `pulsar la acción…` (`Linking.openSettings()` una vez), D3 (qué pantalla se ve, C2), R4 pasos 5-6 |
| 3. Al volver con el permiso concedido, el token se registra sin reiniciar y aparece la fila en `push_tokens` | R2 fila 1 de vuelta (`getExpoPushTokenAsync`, `setPushToken`, `registerPushToken` con los argumentos exactos, sin remontar), R4 paso 6 |
| 4. Con el permiso concedido de entrada, el aviso no aparece en ningún sitio | R1 filas 4 y 5, R3 `sin bloqueo…`, [[tasks]] §Cierre (`useNotificationsBlocked` solo se usa en Perfil), R4 paso 7 |
| 5. Tests con `expo-notifications` y `Linking` mockeados; suite móvil verde; delta de claves como suma visible | R1-R3 (dobles de P11/P12), §Candados (`+ 2` visible en `language-provider.test.tsx` y `35 - 1 + 2` en `#65 R7`), [[tasks]] §Cierre (comandos sin pipe) |

---

## Fuera de alcance (cada viñeta clasificada y con su premisa verificada)

**Delimitaciones — no son features, no se registran:**

- **iOS.** El código no distingue plataforma y `Linking.openSettings()` también
  abre los ajustes de la app en iOS, pero no hay build ni smoke de iOS: es
  #60 (`mobile-ios-support`, `pending` en `feature_list.json`).
- **Backend.** No cambia: el registro es el `POST /v1/me/push-tokens` de #13,
  idempotente por `expo_token`, que el hook ya usa (`registerPushToken` de
  `src/api/push-tokens.ts`).
- **Aviso en la Home, banner global o fila entre los enlaces de Perfil.** D1.
- **Abrir directamente la página de notificaciones** (`Linking.sendIntent` con
  `android.settings.APP_NOTIFICATION_SETTINGS`, o `expo-intent-launcher`, que
  no está instalado). D3 y C2.
- **Aviso tras la primera negativa** o reevaluar al volver cuando el aviso está
  apagado. D2 y D4: el siguiente arranque vuelve a pedir (#79 R7).
- **Detectar una revocación con la app viva.** Si el usuario apaga las
  notificaciones desde los ajustes mientras el aviso está apagado, la app no
  reevalúa al volver (D4): lo verá en el siguiente arranque.
- **Un canal concreto desactivado** con la app permitida. `getPermissionsAsync`
  mira la app entera (`areNotificationsEnabled()` / `POST_NOTIFICATIONS`, P6),
  no el canal `default`; ese caso no se detecta.
- **Descartar el aviso** («no volver a mostrar»). Desaparece cuando el permiso
  vuelve; guardar un descarte pediría almacenamiento y copy nuevos.
- **Pantalla de explicación antes del primer diálogo** (*pre-permission
  prompt*) y cualquier cambio en cuándo pide #79 R7.
- **Reintento o backoff del registro** tras un fallo de token o de red: sigue
  siendo #79 R9 (siguiente arranque).
- **Registrar de nuevo si Expo rota el token** (`addPushTokenListener`, que el
  repo no usa: `grep -rn "addPushTokenListener" mobile-pet-tracker/src` vacío).
- **Componente compartido para el aviso.** Un solo usuario; la regla de
  extracción de la carta pide ≥ 2 pantallas.
- **Cambios en `docs/ui-guidelines.md`, `global.css`, `app.json`,
  `app.config.ts`, `package.json` o `bun.lock`.**

**Deuda o limitación conocida que esta feature no ejecuta:**

- **`canAskAgain: false` sin dos negativas reales.** El marcador `blocked` de
  expo se calcula con `!shouldShowRequestPermissionRationale` al resolver
  cualquier petición denegada (P7); si Android no da *rationale* en un caso que
  el usuario no vivió como «no» (cerrar el diálogo sin elegir, por ejemplo),
  #79 R7 deja de pedir y ahora, al menos, sale el aviso. No se midió en
  dispositivo; el smoke solo recorre las dos negativas explícitas.
- **Estado de módulo.** `useNotificationsBlocked` lee un booleano de módulo
  (D5): vale para un único `usePushRegistration` montado (P1). Si algún día se
  monta dos veces, el último en evaluar gana.

---

## Aprobación

- [ ] Spec aprobada por humano (fecha: ____)

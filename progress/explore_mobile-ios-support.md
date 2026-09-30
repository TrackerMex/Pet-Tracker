# explore: mobile-ios-support

Fecha: 2026-09-30
Branch: `feature/60-mobile-ios-support`, HEAD `5cc743e5`
Autor: explorer. Solo lectura: no se tocó código de la app, ni credenciales, ni EAS.

Leyenda:
- **VERIFICADO**: comprobado contra el árbol, contra `node_modules` o con un comando cuya salida se resume.
- **SUPUESTO**: inferencia razonada que no se ha podido comprobar desde aquí. La spec no debe copiarlo como hecho (ver la memoria *Premisas de explore sin verificar*).

Las anclas son contenido que se puede grepear, no números de línea.

Versiones instaladas (VERIFICADO, `package.json` y `node_modules`): `expo ~57.0.14`, RN `0.86.2`, `expo-maps 57.0.2` (alpha), `expo-notifications 57.0.19`, `expo-image-picker ~57.0.13`, `@expo/ui ~57.0.11` y `jest-expo 57`. El proyecto es CNG: `/ios` y `/android` están en `mobile-pet-tracker/.gitignore` y no hay ningún proyecto nativo commiteado.

### Sondas ejecutadas (todas en el scratchpad, fuera del repo)

- **Sonda de prebuild.** Se copió la config a `…/scratchpad/prebuild-probe` con `node_modules` enlazado por symlink y se corrió `CI=1 EXPO_NO_TELEMETRY=1 RESET_LINK_HOST=reset.example.test bunx expo prebuild --platform ios --no-install --clean`. Salió con exit 0 en las dos variantes (A y B, detalladas en §2). No se ejecutó ni `pod install` ni `xcodebuild`.
- **Sonda de jest.** `Platform.OS` vale `ios` por defecto en la suite (`PLATFORM_OS=ios SELECT=ios`).
- **Tests dirigidos.** Se corrieron después del aviso del leader de que `init.sh` había terminado: `bunx jest src/components/__tests__/pet-map.test.tsx app.config.test.ts src/utils`. Resultado: 9 suites y 100 tests en verde, exit 0 medido con `PIPESTATUS`. No se corrió la suite entera.

---

## 1. Mapa: `GoogleMaps.View` frente a `AppleMaps.View`

### Estado actual (VERIFICADO)

- `src/components/pet-map.tsx` importa `GoogleMaps` de `expo-maps` y renderiza `<GoogleMaps.View {...mapViewProps} />`.
- `src/screens/map/index.tsx` es el único consumidor de `PetMap`. Ningún otro fichero de producción importa `expo-maps`.
- En iOS, hoy el mapa queda en blanco, sin crash. `node_modules/expo-maps/build/google/GoogleMapsView.js` solo carga la vista nativa bajo `if (Platform.OS === 'android')` y en otro caso `return null`. `AppleMapsView.js` es el espejo: `if (Platform.OS === 'ios')` y `null` en Android.

### Tabla de props (VERIFICADO contra `build/apple/AppleMaps.types.d.ts` y `ios/*.swift`)

| Prop actual (Google) | Equivalente Apple | Nota |
|---|---|---|
| `testID: 'map-view'` | No está en el tipo `AppleMapsViewProps` | Tampoco está en el tipo de Google. Hoy pasa porque `mapViewProps` es un objeto suelto que se esparce, lo que evita el excess-property check, y `AppleMapsView.js` reenvía `{...props}` al nativo. El mismo truco sirve para Apple. |
| `style: { flex: 1 }` | `style` | Igual. |
| `cameraPosition: { coordinates, zoom: MAP_ZOOM }` | `cameraPosition` (`CameraPosition` compartido) | `ios/MapUtils.swift` `convertToMapCameraPosition` calcula `longitudeDelta = 360 / pow(2, zoom)`: misma semántica de nivel de zoom, así que `MAP_ZOOM = 16` sirve tal cual. El cambio de cámara se aplica con `.onChange(of: props.cameraPosition)`. |
| `markers: [{ id: 'last-position', coordinates }]` | `markers: AppleMapsMarker[]` (`id?`, `coordinates?`, `title?`, `tintColor?`, `systemImage?`, `monogram?`) | Compatible sin cambios. |
| `polylines: [{ id, coordinates, color }]` | `polylines: AppleMapsPolyline[]` (`id?`, `coordinates`, `color?`, `width?`, `contourStyle?`) | `AppleMapsView.js` aplica `processColor(polyline.color)` como hace Google. |
| `colorScheme: GoogleMaps.MapColorScheme.DARK/LIGHT` | `AppleMaps.MapColorScheme.DARK/LIGHT/AUTOMATIC` | El enum existe en el namespace `AppleMaps` de `build/index.d.ts`. Se aplica en `AppleMapsViewiOS17.swift` con `.environment(\.colorScheme)`. |
| `uiSettings: { zoomControlsEnabled: false }` | `AppleMapsUISettings` = `compassEnabled`, `myLocationButtonEnabled`, `scaleBarEnabled`, `togglePitchEnabled` | No existe `zoomControlsEnabled`. Ver el hallazgo de abajo. |

### Hallazgo: botón de "mi ubicación" (VERIFICADO)

`ios/MapRecords.swift` declara `@Field var myLocationButtonEnabled: Bool = true`, `compassEnabled = true` y `togglePitchEnabled = true`. Con esos valores `AppleMapsViewiOS17.swift` pinta `MapUserLocationButton()` dentro de `.mapControls`.

- Sin `uiSettings: { myLocationButtonEnabled: false }`, el mapa de iOS mostrará un botón de ubicación del usuario. La app no lo usa: sigue la posición de la mascota.
- `properties.isMyLocationEnabled` vale `false` por defecto (`MapRecords.swift`), así que el punto azul no se pinta.
- **SUPUESTO:** pulsar ese botón sin `NSLocationWhenInUseUsageDescription` no pide permiso (iOS ignora la petición de localización sin la clave) y no rompe la app. No se ha probado en dispositivo. La salida limpia es apagar el botón.

### iOS mínimo (VERIFICADO)

- `ios/AppleMapsView.swift` elige la vista por versión: iOS 18 → `AppleMapsViewiOS18`, iOS 17 → `AppleMapsViewiOS17`, cualquier otra → `appleMapsView = nil`. En iOS 16.x el mapa queda vacío.
- El prebuild actual fija `IPHONEOS_DEPLOYMENT_TARGET = 16.4` (sonda A). La app se instalaría en iOS 16.4 con el mapa en blanco.
- `ios.deploymentTarget` existe en los tipos de config de SDK 57 (`@expo/config-types` `ExpoConfig.d.ts`, formato `MAJOR.MINOR`). En la sonda B, `"deploymentTarget": "17.0"` dejó `17.0` en el pbxproj y en `Podfile.properties.json` (`"ios.deploymentTarget": "17.0"`), sin plugin extra.
- El resto de deps nativas declara mínimos por debajo de 17: `NitroThemeTransition.podspec :ios => "15.1"` y el Podfile por defecto `16.4`. Subir a 17.0 no choca con nada visto.

### Tests y mocks afectados (VERIFICADO al leerlos; la consecuencia es deducida)

- `src/components/__tests__/pet-map.test.tsx` mockea `expo-maps` exponiendo solo `GoogleMaps.View` y `GoogleMaps.MapColorScheme`, y asevera `mockGoogleMapsView` llamado una vez.
- `src/screens/map/index.test.tsx` usa un `jest.mock('expo-maps', …)` propio, también solo con `GoogleMaps`.
- La plataforma por defecto de jest es `ios` (sonda). Si `PetMap` se bifurca por `Platform.OS`:
  - Sin fijar la plataforma, las dos suites entrarían en la rama iOS.
  - `AppleMaps` sería `undefined` en esos mocks y el render fallaría con "Element type is invalid". Es deducción: no se ha ejecutado con el código cambiado.
  - Las dos suites deben:
    1. añadir `AppleMaps` al mock;
    2. fijar la plataforma explícitamente en cada caso.
- Patrón existente para fijar la plataforma: `setPlatform` con `Object.defineProperty(Platform, 'OS', { configurable: true, value: os })`. Está en `src/utils/date-picker-value.test.ts`, `src/screens/add-pet/index.test.tsx` y `src/hooks/use-push-registration.test.tsx`. Solo funciona si `Platform.OS` se lee **en render**, no a nivel de módulo.
- Hay que cargar `expo-maps` a través del mock. `require('expo-maps')` real en jest falla con "Cannot find native module 'ExpoMaps'" (sonda del segmento anterior).

### Rama `Platform.OS` o ficheros `.ios.tsx` / `.android.tsx` (SUPUESTO razonado)

- **Rama en el mismo fichero:** es el diff más corto y se prueba con el patrón `setPlatform` que ya existe.
- **Ficheros de plataforma:**
  - `tsc` no entiende las extensiones de plataforma de Metro. Haría falta un `pet-map.tsx` base o un `.d.ts` para que el import `../pet-map` tipe.
  - En jest, con plataforma `ios`, el import resolvería a `pet-map.ios.tsx`, y el test R1 actual, que asevera `GoogleMaps`, tendría que importar la variante Android por ruta.
  - Son más ficheros sin ganancia real: importar `GoogleMaps` en iOS no carga nada nativo, porque el guard está en `GoogleMapsView.js`.

### Otros efectos visuales (SUPUESTO, para el smoke)

- La leyenda "Legal" de Apple Maps está anclada abajo a la izquierda y puede quedar bajo `FloatingTabBar`. Apple Maps no tiene `contentPadding` en los props de `AppleMapsViewiOS17.swift`.
- La brújula aparece al rotar el mapa y el conmutador de pitch es visible, porque los dos valen `true` por defecto. Si ocultarlos o no es una decisión de UX.

---

## 2. `app.json` y `app.config.ts` para iOS

### Estado actual (VERIFICADO)

- `app.json`: `"ios": { "icon": "./assets/expo.icon" }` y nada más. No hay `bundleIdentifier`, `infoPlist`, `associatedDomains` ni `deploymentTarget`.
- Plugins: `expo-router`, la config de `expo-splash-screen`, `"expo-secure-store"` (string) y `["expo-notifications",{"defaultChannel":"default"}]`.
- `extra.eas.projectId` es `d0441662-…` y `owner` es `trackergps`.
- `app.config.ts`:
  - Solo toca `android`: `googleServicesFile`, `config.googleMaps.apiKey` e `intentFilters` con `autoVerify`, `https`, `host` y `pathPrefix: '/reset-password'`.
  - No hay rama `ios`.
  - Cortocircuito: `if (!googleMapsApiKey && !resetLinkHost && !hasGoogleServicesFile) return resolvedConfig;`.
  - Emite un único `console.warn(warnings.join(' '))`. Un build de iOS imprimirá igualmente los avisos de `GOOGLE_MAPS_API_KEY_ANDROID` y `google-services.json`. Es ruido, no bloquea nada.
  - El aviso de `RESET_LINK_HOST` dice literalmente "el build de Android quedará sin intent filters de App Links".

### Sonda A: config actual con solo `bundleIdentifier` añadido (VERIFICADO)

| Clave generada | Valor | Origen |
|---|---|---|
| `CFBundleDisplayName` | `mobile-pet-tracker` | `name` de app.json |
| `CFBundleURLSchemes` | `mobilepettracker`, `com.trackermex.pettracker`, `exp+mobile-pet-tracker` | `scheme` + bundle + dev client |
| `NSAppTransportSecurity` | `NSAllowsArbitraryLoads false`, `NSAllowsLocalNetworking true` | plantilla del prebuild |
| `NSBonjourServices` / `NSLocalNetworkUsageDescription` | `_expo._tcp` / "Expo Dev Launcher uses the local network…" | `expo-dev-launcher/plugin/build/withDevLauncher.js` añade una fase de build que las quita si `CONFIGURATION != Debug` |
| `NSCameraUsageDescription`, `NSMicrophoneUsageDescription`, `NSPhotoLibraryUsageDescription` | "Allow $(PRODUCT_NAME) to access your …" en inglés | auto-plugin legacy de `expo-image-picker` |
| `NSFaceIDUsageDescription` | por defecto en inglés | `expo-secure-store/plugin/build/withSecureStore.js` |
| Textos de localización | **ninguno** | `expo-maps` no inyecta nada |
| `UIUserInterfaceStyle` | `Automatic` | `userInterfaceStyle` |
| Entitlements | solo `aps-environment: development` | `expo-notifications` |
| `com.apple.developer.associated-domains` | **ausente**, aunque `RESET_LINK_HOST` estaba definida | falta la rama iOS en `app.config.ts` |
| `IPHONEOS_DEPLOYMENT_TARGET` | `16.4` | Podfile: `podfile_properties['ios.deploymentTarget'] \|\| '16.4'` |
| Icono | `expo.icon` copiado, `ASSETCATALOG_COMPILER_APPICON_NAME = expo` | `ios.icon` |

### Sonda B: `ios.associatedDomains ["applinks:reset.example.test"]`, `ios.deploymentTarget "17.0"`, `["expo-image-picker",{photosPermission:"PROBE photos",cameraPermission:false,microphonePermission:false}]` y `["expo-secure-store",{faceIDPermission:false}]` (VERIFICADO)

- Solo quedan `NSLocalNetworkUsageDescription` y `NSPhotoLibraryUsageDescription` ("PROBE photos").
- Desaparecen cámara, micrófono y Face ID. `@expo/config-plugins/build/ios/Permissions.js` `applyPermissions` borra la clave cuando el valor es `false`.
- Los entitlements ganan `com.apple.developer.associated-domains`.
- El target queda en `17.0`.
- El plugin explícito sustituye al auto-plugin legacy. `@expo/prebuild-config` `withLegacyExpoPlugins` lo aplica una sola vez.

### Qué textos exige cada librería (VERIFICADO)

- **`expo-image-picker`**:
  - La app solo llama a `launchImageLibraryAsync` en `src/screens/add-pet/index.tsx` y `src/screens/profile/index.tsx`. No hay cámara ni ubicación en `src`, según `git grep` de `launchCameraAsync`, `expo-location` y `expo-camera`.
  - La doc v57 (https://docs.expo.dev/versions/v57.0.0/sdk/imagepicker/) dice: "No permissions request is necessary for launching the image library".
  - El plugin inyecta de todos modos los tres textos por defecto.
  - `microphonePermission` también controla Android: sin `false` añade `RECORD_AUDIO` al manifest (`withImagePicker.js`; la doc v57 dice "RECORD_AUDIO added by default").
- **`expo-maps`**: no exige ningún texto mientras no se use la ubicación del usuario (ver §1). **La premisa "textos de permiso que exigen expo-maps" es falsa** si se apaga `myLocationButtonEnabled`.
- **`expo-secure-store`**: inyecta `NSFaceIDUsageDescription` por defecto. La app no usa `requireAuthentication` (grep), así que el texto es innecesario.
- Idioma: los textos por defecto están en inglés y la app es `es` por defecto (`src/i18n/catalog.ts`, `DEFAULT_LANGUAGE: Language = 'es'`, `LOCALES = { es: 'es-MX', en: 'en-US' }`). Hay tres vías:
  1. un texto fijo en español en la opción del plugin;
  2. `locales` de Expo con JSON por idioma;
  3. borrar las claves que no se usan.

  Eso es una decisión para la spec.

### Variables de entorno

- `RESET_LINK_HOST` es la única variable que el build de iOS necesita en tiempo de config (para `associatedDomains`). Ver §3 sobre cómo llega a EAS.
- `EXPO_PUBLIC_API_URL` **no** hace falta en EAS para un dev build. **SUPUESTO**, con alta confianza: el JS lo sirve el Metro local (`bunx expo start --dev-client` en Windows), que lee el `.env` de la máquina.
- `GOOGLE_MAPS_API_KEY_ANDROID` y `google-services.json` no aplican a iOS.

### Tests que se rompen al tocar la config (VERIFICADO al leer `app.config.test.ts`)

- `#79 R2` asevera `expect(expo.plugins).toContain('expo-secure-store')`, es decir, la string exacta. Pasar a `['expo-secure-store', { faceIDPermission: false }]` rompe ese test. Hay que actualizarlo con R-id nuevo o elegir no tocar secure-store.
- `R1` y `R2` comparan `resolved.plugins` con `toEqual(appJson.expo.plugins)`. Añadir plugins a `app.json` los mantiene verdes, porque compara contra el propio `app.json`.
- `R1` y `R4` usan `toMatchObject(appJson.expo)`. Si `app.config.ts` fija `ios.associatedDomains` a partir de un `ios` que ya existe en `app.json`, el merge debe conservar `icon`, `bundleIdentifier` y el resto.
- `R2`, `R4` (sin host) y `#79 R14` cuentan exactamente un `console.warn`. Un aviso nuevo va dentro del mismo `join` y la cuenta sigue en 1. Cambiar el texto del aviso de `RESET_LINK_HOST` sí toca `R4`, que asevera `stringContaining('RESET_LINK_HOST')` y `stringContaining('docs/verification.md')`. Si esas dos subcadenas se conservan, pasa.
- El cortocircuito `return resolvedConfig` sin `android` se aplica cuando faltan las tres cosas. La rama `ios` nueva tiene que añadirse de forma que no dependa de ese orden. La vía más sencilla es construir `ios` fuera del `if`.

---

## 3. Universal Links para el reset (#59)

### Estado (VERIFICADO)

- `hosting/` contiene `.well-known/assetlinks.json`, `README.md` y `reset-password/index.html` (`git ls-files hosting`). No hay AASA ni `.htaccess`.
- `assetlinks.json` ya tiene un SHA-256 real para `com.trackermex.pettracker`.
- La página fallback tiene el botón `mobilepettracker://reset-password?token=${encodeURIComponent(token)}`. Ese esquema existe en iOS (`CFBundleURLSchemes`, sonda A), así que **el fallback manual ya funciona en iOS** una vez instalada la app.
- `hosting/README.md` está desfasado: sigue diciendo "sustituye `REPLACE_WITH_DEV_BUILD_SHA256`".
- Ruta de la app: `src/app/reset-password.tsx` es la ruta delgada que renderiza `ResetPasswordScreen`. El path del Universal Link (`/reset-password?token=…`) es el mismo que en Android, así que no hace falta tocar el routing. **SUPUESTO:** expo-router trata el Universal Link igual que el App Link. Se comprueba en el smoke.

### Candados de #59 que el cambio debe respetar (VERIFICADO, `src/__tests__/hosting-artifacts.test.ts`)

- `R9` lee `assetlinks.json` y asevera `package_name: appJson.expo.android.package`. Es el patrón natural para un test del AASA contra `appJson.expo.ios.bundleIdentifier`.
- `R10` exige que `reset-password/index.html` no contenga `https?://`, `fetch`, etc. No cambia si solo se añade el AASA.
- `R12` exige que `docs/verification.md` §Feature 59 siga conteniendo `REPLACE_WITH_DEV_BUILD_SHA256`, `G1`–`G4`, `keytool -list -v`, `Hostinger` y `dev build`. El runbook de #60 debe ser una sección nueva (`### Feature 60 — …`), no una reescritura de la §59. Ese test corta la §59 por `^### Feature `.

### Formato del AASA (VERIFICADO, https://docs.expo.dev/linking/ios-universal-links/)

- Va en `/.well-known/apple-app-site-association`, sin extensión, por HTTPS y sin redirecciones.
- El límite es de 128 KB.
- Usa el formato `applinks.details[]` con `appIDs: ["<TEAM_ID>.com.trackermex.pettracker"]` y `components: [{ "/": "/reset-password*" }]`.
- `ios.associatedDomains: ["applinks:<RESET_LINK_HOST>"]`, sin protocolo.
- La doc dice: "Build your iOS app with EAS Build which ensures that the entitlement is registered with Apple automatically".

### `RESET_LINK_HOST` en EAS (VERIFICADO)

Fuentes: https://docs.expo.dev/eas/environment-variables/manage/, https://docs.expo.dev/eas/environment-variables/usage/, https://docs.expo.dev/build-reference/easignore/ y https://docs.expo.dev/build-reference/ios-capabilities/.

- `.env` está en `.gitignore`, y EAS sube el proyecto respetando `.gitignore` (no hay `.easignore`). El `.env` local **no llega** al builder.
- Hay que crear una variable de EAS:

  ```sh
  eas env:set --name RESET_LINK_HOST --value <host> --environment development --visibility plaintext
  ```

  - La sintaxis viene de la doc.
  - El perfil `development` usa el entorno `development` por defecto, porque `developmentClient: true`.
  - Visibilidad: `plaintext` o `sensitive`, **nunca `secret`**. La doc dice: "The environment variables of secret type are not available during build configuration resolution in EAS CLI", y "Keep visibility at least sensitive if you need to resolve config locally".
- Consecuencia si se crea como `secret`:
  - EAS CLI resuelve la config en local para la sincronización de capabilities.
  - Sin la variable, no ve `associatedDomains` y no habilita Associated Domains en el App ID.
  - El builder, que sí la tiene, genera el entitlement y el build falla con "Provisioning profile … doesn't support the Associated Domains capability". Este error de ejemplo aparece en la doc de capabilities.
- Opcional: fijar `"environment": "development"` en el perfil de `eas.json`. Es explícito, aunque redundante.

### Hosting en Hostinger

- **SUPUESTO:** Hostinger (LiteSpeed/Apache) puede servir un fichero sin extensión como `application/octet-stream` o `text/plain`. Apple recomienda `application/json`. Un `hosting/.well-known/.htaccess` con `ForceType application/json` para ese fichero lo resolvería. Hay que verificarlo con `curl -I` en el gate, igual que G2 de #59.
- **SUPUESTO:** desde iOS 14 el dispositivo baja el AASA a través del CDN de Apple (`https://app-site-association.cdn-apple.com/a/v1/<host>`), no directamente del host.
  - El CDN cachea, así que conviene subir el AASA **antes** de instalar el build.
  - `?mode=developer` en `associatedDomains` evita el CDN, pero solo con firma de desarrollo. El perfil `internal` de EAS firma ad hoc (distribución), así que probablemente no aplique.
  - La doc de Expo no cubre este punto.
- **Team ID**: no es secreto. Va en cada app firmada y en todo AASA público. Hay dos opciones:
  1. commitear el valor real;
  2. usar un placeholder (`REPLACE_WITH_APPLE_TEAM_ID`) con test que acepte placeholder o `/^[A-Z0-9]{10}$/`, como hace `R9` con el SHA.

  La opción 2 desacopla la spec del dato. La 1 evita un paso manual antes de la subida.

---

## 4. Push en iOS (#79)

### Código móvil: ya soporta iOS (VERIFICADO)

`src/hooks/use-push-registration.ts`:

- Descarta `platform !== 'android' && platform !== 'ios'`.
- Solo llama a `setNotificationChannelAsync` si `platform === 'android'`.
- Registra `platform` tal cual en `registerPushToken(process.env.EXPO_PUBLIC_API_URL, token, { expoToken, platform })`.

El test ya existe en `src/hooks/use-push-registration.test.tsx`: el caso `'registra ios como plataforma en un dispositivo Apple'` asevera `platform: 'ios'` y que no se crea el canal.

### Permisos (VERIFICADO)

- `NotificationPermissions.js` pide por defecto `{ ios: { allowAlert, allowBadge, allowSound: true } }`.
- En `EXPermissionsService.m`, `canAskAgain = status != EXPermissionStatusDenied`. Si el usuario deniega en iOS, `canAskAgain` pasa a `false`, así que `setNotificationsBlocked(true)` y el banner de perfil llama a `Linking.openSettings()`. Eso funciona en iOS.
- La re-evaluación en `AppState` `active` cubre la vuelta desde Ajustes.

### Backend (VERIFICADO)

- La migración `0008` tiene `CHECK ("push_tokens"."platform" in ('ios', 'android'))`.
- `git grep channelId` en `backend-pet-tracker/src` no da resultados: el payload no lleva nada exclusivo de Android.
- No hace falta ningún cambio de backend.

### Entitlement (VERIFICADO)

`aps-environment: development` se genera solo con el plugin `expo-notifications` (sonda A).

### Qué falta: solo credenciales y smoke, no código

- **SUPUESTO**, basado en la guía de push de Expo leída en el segmento anterior:
  - En el primer `eas build -p ios`, EAS pregunta si configurar Push Notifications.
  - Con login de Apple, genera la clave APNs y la guarda en EAS.
  - Expo Push Service la usa para el bundle id.
  - La `.p8` no pasa por el repo ni por la máquina.
- **SUPUESTO:** con perfil ad hoc, el entitlement que manda es el del perfil de provisión. Expo Push elige el entorno APNs. No se espera ningún cambio en el backend.
- La ruta alternativa del smoke de #79 (SQS a mano en LocalStack, `docs/verification.md` §Feature 79 "Disparar la notificación a mano desde Windows") es independiente de la plataforma y vale igual para iOS.

---

## 5. EAS Build sin Mac: dev build en iPhone físico

### Estado (VERIFICADO)

- `eas.json`: `{"cli":{"version":">= 16.0.0"},"build":{"development":{"developmentClient":true,"distribution":"internal","bun":"1.3.14"}}}`.
- El perfil sirve para iOS sin cambios: `internal` equivale a ad hoc en iOS.
- **Diferencia con Android:** los dev builds de Android se compilan **en local** (`bunx expo run:android`, §Feature 59 G1 y §Feature 79). El de iOS sale **siempre** de EAS en la nube. Primera vez que el proyecto consume builds de EAS de forma habitual.

### Coste (SUPUESTO)

- Los builds de iOS en la nube consumen cuota del plan de EAS; ver https://expo.dev/pricing. No se ha podido comprobar el límite del plan gratuito con la doc v57 (la búsqueda no lo devolvió).
- Cada iteración del smoke es un build de iOS. Por la memoria *Decisiones de costo: no inferir*, la spec debe preguntarlo, no asumirlo.

### Orden de comandos para el humano (no ejecutado aquí)

Desde `mobile-pet-tracker/` en Windows, con `bunx`. Por la memoria *bun para todo*, `bunx eas-cli@latest …` en lugar de `npx`. Si `eas` ya está instalado globalmente, vale `eas`.

1. **iPhone.** Ajustes → Privacidad y seguridad → **Modo desarrollador** activado. Es obligatorio desde iOS 16 para builds de distribución interna (doc de dispositivos en modo desarrollador, leída en el segmento anterior). Reinicia el teléfono.
2. `bunx eas-cli@latest whoami`. Si hace falta, `login` con la cuenta dueña de `owner: trackergps`.
3. `bunx eas-cli@latest device:create`. Genera una URL o QR que se abre en el iPhone e instala el perfil que registra el UDID. Apple puede tardar en procesar el dispositivo.
4. `bunx eas-cli@latest env:set --name RESET_LINK_HOST --value <host> --environment development --visibility plaintext`. Visibilidad `plaintext` o `sensitive`, nunca `secret` (§3).
5. Subir `hosting/.well-known/apple-app-site-association` y, si hace falta, el `.htaccess` a Hostinger. Comprobar el `Content-Type` y el 200 con `curl -I`. Va **antes** del build, por el CDN de Apple.
6. `bunx eas-cli@latest build -p ios --profile development`. Es interactivo:
   - login del Apple ID con 2FA;
   - selección del Team;
   - creación o reutilización del certificado de distribución;
   - registro del bundle id con sincronización de capabilities (Push, Associated Domains);
   - selección de los dispositivos del perfil ad hoc;
   - "set up Push Notifications" → **sí** (genera la clave APNs en EAS).
7. Instalar desde el QR o URL del build en el iPhone registrado.
8. `bunx expo start --dev-client` en Windows con el iPhone en la misma red Wi-Fi. Aceptar el aviso de **Red local** de iOS: tanto el dev launcher como las peticiones a `EXPO_PUBLIC_API_URL=http://192.168.x.x:3000/v1` lo requieren.
9. Smoke: mapa, fotos, reset por Universal Link, push, más un recorrido visual (§Riesgos).

### Formato para `docs/verification.md`

- Sección nueva `### Feature 60 — mobile-ios-support` con gates numerados en negrita (**G1 — …**), igual que §Feature 59.
- Debe decir "dev build de iOS vía EAS", nunca "simulador". Sin Mac no hay simulador local. Existe la skill `eas-simulator` (simulador remoto en EAS), pero no hace falta con iPhone físico y cuesta.
- Placeholders sin valores reales (`<RESET_LINK_HOST>`, `<TEAM_ID>`), como exige §59.
- Resultados en `progress/impl_mobile-ios-support.md`.
- Si se añade un test al estilo de `R12`, que corte por `### Feature 60 — mobile-ios-support`.

### Builder y el icono `.icon` (SUPUESTO)

`ios.icon: ./assets/expo.icon` es un icono de Icon Composer, que requiere Xcode 26 en el builder. Es probable que la imagen por defecto de EAS para SDK 57 ya lo traiga, pero no se ha verificado. Si el build falla en la compilación del catálogo de assets, fijar `"ios": { "image": "latest" }` en el perfil.

---

## 6. Resto de dependencias nativas y usos de `Platform.OS`

### `Platform.OS` fuera de tests (VERIFICADO, `git grep`)

- `src/utils/date-picker-value.ts`: dos ramas `if (Platform.OS !== 'android') return …`. En iOS es la identidad.
- `src/hooks/use-push-registration.ts`: `const platform = Platform.OS` y la rama de Android del canal.
- **La premisa "el código no tiene ninguna rama Platform.OS" es falsa.**

### Selector de fecha y hora con `@expo/ui` community (VERIFICADO al leer el código; efecto en dispositivo SUPUESTO)

- Aparece en `add-pet` (fecha) y `add-reminder` (fecha y hora). Patrón: `{show… ? (<Host><ExpoDateTimePicker … presentation="dialog" onDismiss={() => set…(false)} onValueChange={… set…(false)} /></Host>) : null}`.
- En iOS, `node_modules/@expo/ui/src/community/datetime-picker/DateTimePicker.tsx`:
  - `presentation` es `@platform android` y `onDismiss` no se usa;
  - devuelve un `<Host matchContents …><DatePicker …/></Host>` de SwiftUI con `datePickerStyle` `automatic` (compacto).
- `@expo/ui` `Host/index.ios.tsx` reexporta el `Host` de `@expo/ui/swift-ui`, así que en iOS hay Hosts anidados.
- **Efecto probable (SUPUESTO):**
  - no aparece un diálogo modal, sino un control compacto en línea bajo el campo;
  - hay que tocarlo otra vez para abrir el calendario;
  - como cada `onValueChange` hace `set…(false)`, el control desaparece al primer cambio (por ejemplo, al cambiar de mes en algunos estilos, o al primer giro de la rueda de hora);
  - si el usuario no cambia nada, no se cierra nunca, porque `onDismiss` no se dispara en iOS.

  Hay que verlo en el dispositivo. `docs/ui-guidelines.md` §Decisiones fijas 5 fija la capa community como la de por defecto, así que cambiar de capa es otra feature.
- Semántica de fechas (VERIFICADO):
  - `toPickerValue` y `fromPickerValue` son la identidad fuera de Android.
  - `dateToIso` en add-pet y `combineDateAndTime` en `src/utils/reminder-dates.ts` usan componentes locales (`getFullYear`, `getMonth`, `getDate`, `getHours`, `getMinutes`).
  - El SwiftUI `DatePicker` devuelve fechas locales, así que no se espera desfase de día. **SUPUESTO**, sin test de iOS.

### `contentInsetAdjustmentBehavior="automatic"` (VERIFICADO el uso; efecto SUPUESTO)

- Aparece en 17 pantallas, combinado con `paddingTop: insets.top + 12` (patrón de `docs/conventions.md` §Dimensiones).
- `docs/ui-guidelines.md` §Decisiones fijas 6 lo describe como "no-op en Android".
- **SUPUESTO:** en iOS la propiedad sí actúa y puede sumar el inset seguro al `paddingTop` manual, dejando un hueco doble arriba o abajo en las pantallas sin header nativo. Es un riesgo del smoke visual, no un hallazgo confirmado.

### Otras dependencias (VERIFICADO)

- `src/components/floating-tab-bar.tsx`:
  - `isLiquidGlassAvailable()` elige entre `GlassView` (iOS 26) y `BlurView`;
  - `blurMethod="dimezisBlurViewSdk31Plus"` es solo de Android y se ignora en iOS.
- `src/theme/theme-transition.ts`: protegido con `hasNitroModules()`; el podspec pide iOS 15.1.
- `expo-symbols` es dependencia, pero no se usa en `src` (`git grep` vacío). Los iconos van por `reicon-react-native` (JS/SVG).
- `uniwind`, `heroui-native` y `@gorhom/bottom-sheet` son JS sobre reanimated y gesture-handler. No se han revisado a fondo; la documentación de cada uno declara soporte de iOS.

### Fotos HEIC (VERIFICADO): **se rechazarán en iOS**

1. `ImagePickerModule.swift`: sin `allowsEditing` y fuera de la cámara usa PHPicker (`launchMultiSelectPicker`) con `configuration.preferredAssetRepresentationMode = options.preferredAssetRepresentationMode.toAssetRepresentationMode()`.
2. El valor nativo por defecto es `.current` (`ImagePickerOptions.swift`), aunque la doc TS dice Automatic.
3. `MediaHandler.swift`: con `quality: 0.8` no entra por el fast path (requiere `quality >= 1`).
4. `ImageUtils.readDataAndFileExtension(image:rawData:itemProvider:options:)` hace `switch itemProvider.registeredTypeIdentifiers.first` → `case UTType.heic.identifier: return (rawData, ".heic")`, sin recodificar aunque `quality < 1`. Lo mismo ocurre con AVIF y TIFF.
5. El `mimeType` sale de la extensión, así que queda `image/heic`.
6. `src/api/media.ts` `resolvePhotoContentType` solo acepta `image/jpeg`, `image/png` e `image/webp`, así que devuelve `null`.
7. Las pantallas muestran `addPet.errorPhotoFormat` o `profile.errorPhotoFormat`.

Las fotos del carrete de un iPhone con "Alta eficiencia" (valor por defecto) son HEIC.

El backend también cierra la puerta: `request-photo-upload-url.dto.ts` tiene `contentType: z.enum(['image/jpeg', 'image/png', 'image/webp'])`.

Salidas posibles:

- **a)** `preferredAssetRepresentationMode: ImagePicker.UIImagePickerPreferredAssetRepresentationMode.Compatible` en las dos llamadas a `launchImageLibraryAsync`. Solo toca el móvil. En Android es un no-op, porque la opción es de iOS. **SUPUESTO:** con Compatible, PHPicker entrega JPEG y el primer identificador pasa a `public.jpeg`. Se verifica en el smoke.
- **b)** Aceptar HEIC en el móvil y en el backend. Implica cambio de backend y de la S3 policy, y los clientes Android o web tendrían que mostrar HEIC. Es más caro.

---

## 7. Tamaño: una spec o partir

Inventario de trabajo, por bloques independientes:

| Bloque | Código | Tests | Humano |
|---|---|---|---|
| A. Config iOS (`bundleIdentifier`, `deploymentTarget`, textos o plugins de permiso, `associatedDomains` desde `RESET_LINK_HOST`) | `app.json`, `app.config.ts` | `app.config.test.ts` (nuevos R + ajuste de `#79 R2` si se toca secure-store) | — |
| B. Mapa (`Platform.OS` + `uiSettings` de Apple) | `pet-map.tsx` | `pet-map.test.tsx`, `map/index.test.tsx` (mocks + `setPlatform`) | smoke |
| C. Universal Links | `hosting/.well-known/apple-app-site-association` (+ `.htaccess`?), `hosting/README.md` | `hosting-artifacts.test.ts` (nuevo R al estilo de R9) | subida a Hostinger, Team ID |
| D. HEIC | las dos pantallas con `launchImageLibraryAsync` | tests de add-pet y profile (asertar la opción pasada) | smoke con foto HEIC |
| E. Push iOS | ninguno | ya cubierto | clave APNs vía EAS, smoke |
| F. Runbook EAS | `docs/verification.md` §Feature 60, `.env.example` si cambia el comentario de `RESET_LINK_HOST` | opcional, estilo R12 | todo el §5 |
| G. UX del selector y de los insets | depende del smoke | — | smoke visual |

Recomendación (SUPUESTO, la decide el humano o el `spec_author`):

- **Una sola spec con R-ids independientes para A–F**, porque:
  - el gate caro es uno: un build de EAS y un smoke en el iPhone. Partir en varias specs multiplica builds, cuota y rondas de smoke;
  - el código de A–D es pequeño, del orden de decenas de líneas por bloque;
  - E no tiene código.
- **G, fuera de alcance como descubrimiento del smoke.** Lo que el smoke encuentre en el selector o en los insets se registra como feature nueva, con su premisa verificada en el dispositivo. No se especifica antes a ciegas.
- Alternativa, si se quiere reducir el riesgo de la spec: **#60a** = A+B+C+D+F (todo lo que se puede testear en jest) y **#60b** = E + smoke completo. No se recomienda, porque B, C y E solo se cierran con el mismo smoke.

---

## 8. Lista cerrada de lo que tiene que aportar o ejecutar el humano

### Bloquea la spec (el `spec_author` no puede cerrar R-ids sin esto)

1. **Bundle identifier**: confirmar `com.trackermex.pettracker`, igual que el package Android según el criterio 2. **SUPUESTO**, riesgo bajo: que no esté registrado ya por otro Team.
2. **Team ID**:
   - o se da ya y se commitea, porque no es secreto;
   - o se acepta un placeholder con test tolerante, como `REPLACE_WITH_DEV_BUILD_SHA256` en `assetlinks.json`, y el dato pasa a bloquear solo el smoke.
3. **`deploymentTarget`**:
   - `17.0`: el mapa funciona siempre, pero la app no se instala en iOS 16;
   - `16.4`: se instala, pero el mapa sale en blanco en iOS 16.
4. **HEIC**: la opción a) Compatible (solo móvil) o la b) aceptar HEIC (móvil y backend).
5. **Textos de permiso**:
   - idioma (es fijo, o es y en con `locales`);
   - borrar o no las claves que no se usan (cámara, micrófono, Face ID).

   Poner `microphonePermission: false` también quita `RECORD_AUDIO` en Android, lo que es un efecto colateral deseable pero visible. Tocar secure-store rompe `#79 R2`.
6. **`RESET_LINK_HOST` en EAS**: aceptar que se cree como variable `plaintext` o `sensitive` del entorno `development`. Condiciona el diseño de A y C.
7. **Alcance**: una spec, o partir (§7). Selector e insets dentro o fuera.
8. **Coste de EAS Build**: aceptar consumir builds de iOS en la nube (y cuántos). Por la memoria *Decisiones de costo: no inferir*, se pregunta y no se deduce.

### Bloquea solo el smoke

9. Modelo de iPhone y versión de iOS. Hace falta iOS 17 o superior para el mapa, o 16 o superior si se elige 16.4 y se acepta el mapa en blanco.
10. Modo desarrollador activado en el iPhone.
11. `eas device:create` e instalación del perfil de registro.
12. Login del Apple ID con 2FA durante `eas build`, y respuestas a los prompts de credenciales: certificado, perfil ad hoc y **sí** a Push (clave APNs).
13. `eas env:set` de `RESET_LINK_HOST` (§5 paso 4).
14. Subir el AASA y, si hace falta, el `.htaccess` a Hostinger, y comprobarlo con `curl -I` (200, `application/json`, sin redirección).
15. Red: iPhone y PC en la misma Wi-Fi, firewall de Windows abierto a 8081 (Metro) y 3000 (API), y el aviso de Red local aceptado en el iPhone.
16. Backend y LocalStack levantados para el push y el reset (como en #59 y #79).

---

## Premisas de la entrada #60 en `feature_list.json`

| Premisa | Veredicto | Evidencia |
|---|---|---|
| "`GoogleMaps.View` … solo existe en Android (iOS requiere `AppleMaps.View`, sin API key, iOS 17+)" | **VERDADERA, con matiz** | `GoogleMapsView.js` hace `return null` fuera de Android; `AppleMapsView.swift` deja `nil` por debajo de iOS 17. Matiz: el target por defecto es 16.4, así que la app se instala en iOS 16 con el mapa vacío. |
| "iOS compila pero no funciona" | **PARCIAL / NO VERIFICADA** | El prebuild de iOS sale con exit 0 (sonda A). No se ha corrido ni `pod install` ni `xcodebuild`: "compila" no está probado. "No funciona": el mapa sale en blanco (VERIFICADO en código). |
| "app.json no declara `ios.bundleIdentifier` ni textos de permiso en infoPlist" | **VERDADERA** | `"ios": { "icon": "./assets/expo.icon" }` y nada más. |
| "textos de permiso … (foto, cámara, ubicación)" / criterio 2 "los que exigen expo-image-picker y expo-maps" | **PARCIAL / FALSA** | Cámara y ubicación no se usan. PHPicker no pide permiso (doc v57). expo-maps no exige texto si se apaga `myLocationButtonEnabled`. Los plugins ya inyectan textos por defecto en inglés. La decisión real es su idioma o su borrado. |
| "#59 configuró App Links solo en Android … depende del botón `mobilepettracker://`" | **VERDADERA** | `app.config.ts` sin rama `ios` (sonda A: sin associated-domains con `RESET_LINK_HOST` definido). No hay AASA en `hosting/`. El botón de fallback funciona en iOS (`CFBundleURLSchemes`). |
| "El código no tiene ninguna rama `Platform.OS`" | **FALSA** | `src/utils/date-picker-value.ts` (2) y `src/hooks/use-push-registration.ts` (1). |
| "el resto de dependencias nativas … tienen implementación iOS" | **VERDADERA en compilación, PARCIAL en comportamiento** | Todas tienen implementación iOS. Pero el selector de `@expo/ui` community ignora `presentation` y `onDismiss` en iOS (§6), y expo-image-picker entrega HEIC que la app rechaza (§6). `expo-symbols` no se usa en `src`. |
| "eas.json ya tiene perfil development" | **VERDADERA** | `developmentClient: true`, `distribution: internal`, `bun 1.3.14`. |
| "Windows no compila iOS: el build sale de EAS Build o de un Mac" | **VERDADERA** | El humano no tiene Mac, así que queda solo EAS (§5). |
| Criterio 4 "smoke en simulador iOS (o dispositivo…)" | **CADUCA** | Decisión del 2026-09-30: sin Mac no hay simulador local. Smoke en iPhone físico con Apple Developer Program. |
| "push de iOS (clave APNs en EAS, #79) Dentro de #60" | **Alcance correcto, sin código** | El hook y el backend ya soportan `ios` y está testado. Solo faltan la credencial y el smoke. |
| `files_affected` | **INCOMPLETA** | Faltan `src/components/__tests__/pet-map.test.tsx`, `src/screens/map/index.test.tsx`, `app.config.test.ts`, `src/__tests__/hosting-artifacts.test.ts`, `hosting/README.md`, las dos pantallas con `launchImageLibraryAsync` (`src/screens/add-pet/index.tsx`, `src/screens/profile/index.tsx`) y sus tests si se elige HEIC a). `eas.json` quizá no cambie. |

---

## Decisiones abiertas para la spec

1. **Bifurcación del mapa**: rama `Platform.OS` leída en render dentro de `pet-map.tsx` (recomendado) frente a ficheros de plataforma (§1).
2. **`uiSettings` de Apple**: como mínimo `myLocationButtonEnabled: false`. ¿También `compassEnabled` y `togglePitchEnabled` a `false`, por paridad con el Android sin controles?
3. **`ios.deploymentTarget`**: `17.0` o mantener `16.4` (§8.3).
4. **Textos de permiso**: idioma, `locales` y qué claves se borran. Efecto en `RECORD_AUDIO` de Android y en `#79 R2` (§2).
5. **HEIC**: la opción a) o la b) (§6).
6. **`RESET_LINK_HOST`**:
   - rama `ios.associatedDomains` en `app.config.ts`;
   - texto del aviso sin la palabra "Android" (conservando `RESET_LINK_HOST` y `docs/verification.md` por `R4`);
   - variable de EAS `plaintext` o `sensitive`;
   - `"environment": "development"` explícito o no en `eas.json`.
7. **AASA**:
   - `components` (`/reset-password*`);
   - Team ID real o placeholder;
   - `.htaccess` sí o no;
   - test nuevo en `hosting-artifacts.test.ts` contra `appJson.expo.ios.bundleIdentifier`.
8. **`ios.config.usesNonExemptEncryption`**: no hace falta para distribución interna. Solo importa para TestFlight o App Store. Omitirlo o fijarlo a `false` para evitar el prompt futuro.
9. **Avisos de Android en builds de iOS**: dejarlos (ruido) o condicionarlos. Hay que condicionar sin romper la cuenta de un solo `console.warn` en R2, R4 y #79 R14.
10. **Selector de fecha e insets de iOS**: dentro de #60 o como features nuevas tras el smoke (§7).
11. **Una spec o partir** (§7).
12. **Gate humano con casilla propia** por la memoria *Gate humano sin casilla donde firmar*: una casilla para el smoke de iOS y otra para la subida del AASA, separadas de la aprobación de la spec.
13. **Handoff a Codex**: nombrar las skills de Codex, no las nuestras (deuda B5 en `.claude/agents/leader.md` §Catálogo real de skills de Codex).

---

## Riesgos

| Riesgo | Tipo | Mitigación |
|---|---|---|
| HEIC rechazado en iOS: las fotos del carrete no se suben | VERIFICADO en código | Decisión 5; smoke con una foto HEIC real |
| Mocks de `expo-maps` sin `AppleMaps` y plataforma de jest `ios`: rojos al bifurcar | Deducido de VERIFICADOS | Actualizar las dos suites con `setPlatform` |
| `#79 R2` `toContain('expo-secure-store')` se rompe si se configura secure-store | VERIFICADO | Nuevo R-id que enmiende el test, o no tocar secure-store |
| `RESET_LINK_HOST` como `secret`: build fallido o Associated Domains desactivado | VERIFICADO en doc | Visibilidad `plaintext` o `sensitive` en el runbook |
| Selector de iOS: control en línea, no se cierra sin cambio, desaparece al primer cambio, Hosts anidados | SUPUESTO | Smoke; feature aparte si se confirma |
| `contentInsetAdjustmentBehavior="automatic"` + `paddingTop` manual: hueco doble en iOS | SUPUESTO | Recorrido visual en el smoke de las 17 pantallas |
| Botón "mi ubicación" visible en el mapa de iOS | VERIFICADO (valor por defecto `true`) | `myLocationButtonEnabled: false` |
| Mapa en blanco en iOS 16 si se mantiene 16.4 | VERIFICADO | Decisión 3 |
| Leyenda "Legal" de Apple bajo `FloatingTabBar` | SUPUESTO | Smoke; sin `contentPadding` en la API de Apple |
| El icono `.icon` requiere Xcode 26 en el builder | SUPUESTO | `"image": "latest"` si falla el catálogo de assets |
| AASA servido con `Content-Type` incorrecto en Hostinger | SUPUESTO | `curl -I` en el gate; `.htaccess` |
| Caché del CDN de Apple: el Universal Link no abre la app justo después de subir el AASA | SUPUESTO | Subir el AASA antes del build; comprobar `app-site-association.cdn-apple.com/a/v1/<host>` |
| Procesamiento de dispositivo o perfil en Apple (retrasos tras `device:create`) | SUPUESTO | Registrar el dispositivo con antelación |
| ATS con literal IP bajo `NSAllowsLocalNetworking` (`EXPO_PUBLIC_API_URL=http://192.168.x.x`) | SUPUESTO; Metro por IP funciona en dev clients, lo que apunta a que sí | El login en el smoke lo confirma |
| Aviso de Red local de iOS denegado: ni Metro ni la API responden | SUPUESTO | Paso explícito en el runbook |
| Cuota o coste de EAS Build: cada iteración del smoke es un build | SUPUESTO | Decisión 8, preguntada al humano |
| `hosting/README.md` desfasado (`REPLACE_WITH_DEV_BUILD_SHA256`) | VERIFICADO | Actualizarlo en el bloque C sin tocar la §59 de `verification.md` (`R12`) |
| Dos sesiones en la máquina: la spec no debe prescribir `./init.sh` ni la suite entera en paralelo al Backend | Operativo | Tests dirigidos en el handoff |

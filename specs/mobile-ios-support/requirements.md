---
feature: "mobile-ios-support"
status: approved           # draft | spec_ready | approved
tags: [spec, mobile, ios, eas, universal-links]
---

# Requisitos — [[mobile-ios-support]] (#60)

> Notación EARS. Cada requisito lleva su id `R<n>`, que no cambia una vez
> aprobado. Ver [[design]] para las decisiones y las alternativas descartadas,
> [[tasks]] para el orden TDD, los literales, los blobs y las sondas, y
> [[traceability]] para el cierre.
>
> Origen: la entrada #60 de `feature_list.json` (detectada el 2026-09-03 al
> cerrar #59, pospuesta el 2026-09-14), reabierta por el humano el 2026-09-30
> («arranquemos con la feature #60 ya estamos listos»). Exploración:
> `progress/explore_mobile-ios-support.md`. Cada premisa que esta spec usa se
> volvió a medir contra el árbol (§Premisas); lo que no se pudo medir figura
> como **supuesto** en §Riesgos, nunca como hecho.
>
> **Base medida: `5cc743e5`**, la punta de `feature/60-mobile-ios-support`. Su
> padre es `origin/main` `3820b89a` (merge de la PR #178, #138 cerrada), y el
> commit de arranque solo toca `feature_list.json` y `progress/current.md`: el
> código de la base es el de `origin/main`. **Los números de línea no son
> anclas**, ni los de esta spec ni los de la entrada de `feature_list.json`.
> Todo se localiza con los `grep` que se citan, y las cuentas se vuelven a
> medir al arrancar ([[tasks]] §Antes de tocar nada).

## Contexto mínimo para implementar sin más contexto

La app móvil solo se ha compilado para Android. En iOS, el tab Map queda en
blanco, las fotos del carrete (HEIC) se rechazan, `app.json` no tiene
identidad de iOS y el enlace de reset de #59 no abre la app. Esta feature lo
arregla con **cambios pequeños en 18 ficheros** y deja el build, la
publicación del AASA y la prueba en el iPhone a tres gates del humano.

| Fichero | Qué cambia | R |
|---|---|---|
| `mobile-pet-tracker/src/components/pet-map.tsx` | rama `Platform.OS === 'ios'` que pinta `AppleMaps.View`; Android sigue con `GoogleMaps.View` | R1, R2 |
| `mobile-pet-tracker/src/components/__tests__/pet-map.test.tsx` | mock de `AppleMaps`, `setPlatform`, un `describe` `#60 R1` | R1 |
| `mobile-pet-tracker/src/screens/map/index.test.tsx` | mock de `AppleMaps`, `setPlatform`, un `describe` `#60 R2` | R2 |
| `mobile-pet-tracker/src/screens/add-pet/index.tsx` | una opción más en `launchImageLibraryAsync` | R3 |
| `mobile-pet-tracker/src/screens/add-pet/index.test.tsx` | enum en el mock del picker, un `it` `#60 R3` | R3 |
| `mobile-pet-tracker/src/screens/profile/index.tsx` | la misma opción | R3 |
| `mobile-pet-tracker/src/screens/profile/index.test.tsx` | enum en el mock del picker, un `it` `#60 R3` | R3 |
| `mobile-pet-tracker/app.json` | `ios` (bundle, target, cifrado) y dos plugins con opciones | R4, R5 |
| `mobile-pet-tracker/app.config.ts` | `ios.associatedDomains` desde `RESET_LINK_HOST`; el aviso nombra iOS | R6, R7 |
| `mobile-pet-tracker/app.config.test.ts` | cuatro `describe` `#60 R4`–`R7` y una línea enmendada de `#79 R2` | R4–R7 |
| `mobile-pet-tracker/src/__tests__/hosting-artifacts.test.ts` | `existsSync` en el import, dos `describe` `#60 R8` y `#60 R9` | R8, R9 |
| `mobile-pet-tracker/.env.example` | dos líneas de comentario | R9 |
| `hosting/.well-known/apple-app-site-association` | **nuevo**, 10 líneas | R8 |
| `hosting/.well-known/.htaccess` | **nuevo**, 3 líneas | R8 |
| `hosting/README.md` | reescrito, 9 líneas | R9 |
| `docs/verification.md` | sección nueva `### Feature 60 — mobile-ios-support` (gates I1–I6), delante de la de #79 | R9 |
| `docs/conventions.md` | la fila de `RESET_LINK_HOST` nombra la variable de EAS | R9 |
| `AGENTS.md` | la fila de `hosting/` nombra el AASA | R9 |

**Qué no tiene código.** El push de iOS ya funciona en el código: el hook
registra `platform: 'ios'` (`'registra ios como plataforma en un dispositivo Apple'`
en `src/hooks/use-push-registration.test.tsx`), el backend lo acepta
(`CHECK ("push_tokens"."platform" in ('ios', 'android'))` en la migración
`0008`), y `expo-notifications` ya genera `aps-environment: development`.
Solo falta la clave APNs, que EAS genera en el primer build (R12), y la
prueba.

**Cómo corre jest la plataforma.** El preset es `jest-expo`, cuya plataforma
por defecto es `ios`. Si `PetMap` se bifurca por `Platform.OS` y los tests no
fijan la plataforma, todos los `it` existentes del mapa (que describen el
contrato de Android) entrarían en la rama de iOS. Por eso los dos tests del
mapa ganan el patrón `setPlatform` que ya usan
`src/hooks/use-push-registration.test.tsx` y
`src/screens/add-pet/index.test.tsx`
(`Object.defineProperty(Platform, 'OS', { configurable: true, value: os })`):
un `beforeEach` de nivel superior fija `'android'`, los `describe` de iOS
fijan `'ios'`, y un `afterEach` restaura el valor original. `PetMap` lee
`Platform.OS` **en render**, no al cargar el módulo.

**Lo que jest no ve.** Jest no pinta vistas nativas ni ejecuta config
plugins. Lo que producen los plugins (el `Info.plist`, los entitlements y los
permisos de Android) se comprueba con `bunx expo config --type introspect`
en el cierre (R10.8). El mapa real, la foto HEIC, el Universal Link y el push
solo se ven en el iPhone (R12).

## Decisiones del humano

Respuestas explícitas del humano a `AskUserQuestion` del `leader`, el
2026-09-30, copiadas de `progress/current.md`. No son inferencias.

| Pregunta | Respuesta literal | Consecuencia en esta spec |
|---|---|---|
| ¿Mac con Xcode? | «No tengo Mac» | Los builds de iOS salen de EAS Build en la nube. No hay simulador: la prueba es en un iPhone físico con un **dev build de iOS vía EAS**. La spec nunca dice «simulador» como entorno de prueba |
| ¿Apple Developer Program? | «Sí, ya lo tengo» | Perfil ad hoc para un iPhone registrado, Team ID disponible para el AASA |
| ¿Push de iOS dentro de #60 o aparte? | «Dentro de #60» | Sin código (ver arriba); la clave APNs y la prueba de push entran en R12 |
| Fotos HEIC | «Convertir a JPEG» | `preferredAssetRepresentationMode: Compatible` en las dos llamadas al picker; solo móvil, sin tocar backend (R3) |
| Textos de permiso | «Español y borrar los no usados» | Un único texto, el de la galería, en español. Fuera cámara, micrófono y Face ID. Android pierde `RECORD_AUDIO` y bloquea `CAMERA`. `#79 R2` se enmienda bajo `#60 R5` |
| iPhone de la prueba | «iOS 18 o superior» | `ios.deploymentTarget` `"17.0"`, el mínimo de `AppleMaps.View` (R4) |
| Coste de EAS Build | «Sí, aunque cueste» | Se aceptan builds extra o subir de plan si hace falta |

**Pendiente del humano, bloquea solo los gates R11 y R12:** el Team ID de la
cuenta de Apple Developer (el repo lleva un placeholder) y el modelo exacto
del iPhone (se anota en la casilla de R12).

## Decisiones por defecto (las firma el humano en este gate)

Sin pregunta al humano. Cada una tiene su razón en [[design]].

| Decisión | Quién | Dónde |
|---|---|---|
| Una sola spec para mapa, config, HEIC, Universal Links, push y runbook | `leader` | [[design]] §D13 |
| Selector de fecha e insets de iOS fuera de alcance, como hallazgos **(F)** del smoke sin id | `leader` | §Fuera de alcance |
| Rama `Platform.OS` dentro de `pet-map.tsx`, no ficheros `.ios.tsx` | `leader` | [[design]] §D1 |
| Team ID como placeholder `REPLACE_WITH_APPLE_TEAM_ID`, con test que acepta el placeholder o un Team ID real | `leader` | R8, [[design]] §D9 |
| `RESET_LINK_HOST` como variable de EAS del entorno `development`, visibilidad `plaintext` o `sensitive`, nunca `secret` | `leader` | R9, [[design]] §D10 |
| `bundleIdentifier` `com.trackermex.pettracker`, igual que el package de Android | `leader` | R4 |
| La sección §Feature 60 de `docs/verification.md` va delante de la de #79 | `leader` | R9, [[design]] §D11 |
| `ios.config.usesNonExemptEncryption: false` | `spec_author` | R4, [[design]] §D4 |
| `uiSettings` de Apple: `myLocationButtonEnabled: false` y `togglePitchEnabled: false`; la brújula se queda | `spec_author` | R1, [[design]] §D2 |
| `.htaccess` con `<Files "apple-app-site-association">`, no global | `spec_author` | R8, [[design]] §D8 |
| `eas.json` no cambia | `spec_author` | R10.6, [[design]] §D12 |

## Premisas de la entrada, verificadas contra el árbol

| Premisa de la entrada #60 | Veredicto | Evidencia en la base |
|---|---|---|
| «`GoogleMaps.View` … solo existe en Android (iOS requiere `AppleMaps.View`, sin API key, iOS 17+)» | **Verdadera, con matiz** | `node_modules/expo-maps/build/google/GoogleMapsView.js` devuelve `null` fuera de Android; `AppleMapsView.swift` deja la vista en `nil` por debajo de iOS 17. Matiz: sin `deploymentTarget` el prebuild fija 16.4, así que la app se instalaría en iOS 16 con el mapa en blanco |
| «iOS compila pero no funciona» | **Parcial** | El prebuild de iOS sale con `exit=0` (sonda A de la exploración). Nadie ha compilado con Xcode: lo prueba el build de EAS de R12 |
| «app.json no declara `ios.bundleIdentifier` ni textos de permiso» | **Verdadera** para `app.json` (`"ios": { "icon": "./assets/expo.icon" }` y nada más), pero los plugins inyectan hoy **cinco** `*UsageDescription`, en inglés | `bunx expo config --type introspect` de la base: cámara, Face ID, red local, micrófono y fotos |
| «textos de permiso … (foto, cámara, ubicación)» y criterio 2 «los que exigen expo-image-picker y expo-maps» | **Parcial / falsa** | `git grep` de `launchCameraAsync`, `expo-camera`, `expo-location`, `requestCameraPermissions` en `src` no da nada; la app solo usa la galería. `expo-maps` no exige texto si el botón de «mi ubicación» está apagado (R1) |
| «#59 configuró App Links solo en Android» | **Verdadera** | `app.config.ts` no tiene rama `ios`; `hosting/` no tiene AASA |
| «El código no tiene ninguna rama `Platform.OS`» | **Falsa** | `git grep -n 'Platform.OS' -- src ':!*.test.*' ':!*__tests__*'` da tres líneas: dos en `src/utils/date-picker-value.ts` y una en `src/hooks/use-push-registration.ts` |
| «el resto de dependencias nativas tienen implementación iOS» | **Verdadera al compilar, parcial al usar** | El picker entrega HEIC (R3) y el selector de fecha de `@expo/ui` se comporta distinto en iOS (**(F)** en §Fuera de alcance) |
| «eas.json ya tiene perfil development» | **Verdadera** | `developmentClient: true`, `distribution: "internal"`, `bun: "1.3.14"`. No cambia |
| «Windows no compila iOS» | **Verdadera** | Sin Mac: solo EAS |
| Criterio 4: «smoke en simulador iOS (o dispositivo…)» | **Caduca** | Decisión del 2026-09-30: iPhone físico |
| `files_affected` | **Incompleta** | Completada en `feature_list.json` con los 18 ficheros de la tabla de arriba. `eas.json` sale de la lista |

Otras premisas que la spec usa, también medidas en la base:

- **HEIC se rechaza hoy.** El valor nativo por defecto de
  `preferredAssetRepresentationMode` es `.current`, que entrega el HEIC tal
  cual. `src/api/media.ts` declara
  `PhotoContentType = 'image/jpeg' | 'image/png' | 'image/webp'` y resuelve el
  tipo por extensión, así que un `.heic` da el error de formato de la
  pantalla. `UIImagePickerPreferredAssetRepresentationMode.Compatible` vale
  `'compatible'`.
- **Face ID no se usa.** `git grep -c requireAuthentication -- src` no da
  nada. `expo-secure-store` solo se usa con `getItemAsync`, `setItemAsync` y
  `deleteItemAsync`.
- **Bloquear `CAMERA` y `RECORD_AUDIO` en Android es lo que hace el plugin.**
  `node_modules/expo-image-picker/plugin/build/withImagePicker.js` llama a
  `withBlockedPermissions` con `RECORD_AUDIO` si `microphonePermission === false`
  y con `CAMERA` si `cameraPermission === false`. El manifest los lleva con
  `tools:node="remove"`; lo comprueba el humano en R13.
- **EAS pregunta por el cifrado si `app.json` no lo declara.**
  `eas-cli@23.2.0`, `build/project/ios/exemptEncryption.js`: si
  `ios.infoPlist.ITSAppUsesNonExemptEncryption` y `ios.config.usesNonExemptEncryption`
  faltan, `eas build` lanza un `confirmAsync` e intenta escribir la respuesta
  en la config. Con `usesNonExemptEncryption: false` no pregunta.
- **El tema del mapa es la preferencia de la app.** `src/screens/map/index.tsx`
  pasa `colorScheme={theme === 'dark' ? 'dark' : 'light'}` con el `theme` de
  `useUniwind()`, que se cambia en el perfil. No sigue al tema del sistema.
- **`/ios` y `/android` están en `mobile-pet-tracker/.gitignore`.** El
  `prebuild --clean` de R13 no toca nada versionado.
- **`assetlinks.json` ya tiene el fingerprint real**, así que el
  `REPLACE_WITH_DEV_BUILD_SHA256` de `hosting/README.md` está desfasado y se
  quita. El de `docs/verification.md` §Feature 59 **se queda**: lo cierra el
  test `R12` de `hosting-artifacts.test.ts`.
- **El builder de EAS no recibe `mobile-pet-tracker/.env`** (está en
  `.gitignore` y no hay `.easignore`). Una variable de EAS con visibilidad
  `secret` no está disponible cuando EAS CLI evalúa `app.config.ts` en la
  máquina del humano (doc de variables de entorno de EAS), y sin ella la
  sincronización de capacidades del App ID no ve `associatedDomains`.

## Requisitos funcionales

Los literales exactos de cada test están en [[tasks]]. Los esperados son
**literales**: ningún test importa valores de producción (`MAP_ZOOM`, el
bundle, el texto del permiso) para compararlos consigo mismos.

- **R1**: WHEN `PetMap` se renderice con `Platform.OS` igual a `'ios'`, THE
  SYSTEM SHALL pintar **un** `AppleMaps.View` y **ningún** `GoogleMaps.View`,
  con `testID` `'map-view'`, `style` `{ flex: 1 }`, `cameraPosition`
  `{ coordinates: center, zoom: 16 }`, `markers`
  `[{ id: 'last-position', coordinates: marker }]` (o `[]` sin marcador),
  `polylines` con `color` del token `accent-strong` vía `useThemeColors`,
  `colorScheme` `AppleMaps.MapColorScheme.DARK` para la prop `'dark'` y
  `LIGHT` para `'light'`, `uiSettings` **exactamente**
  `{ myLocationButtonEnabled: false, togglePitchEnabled: false }`, y sin
  `contentPadding`. WHEN se renderice con cualquier otra plataforma, THE
  SYSTEM SHALL pintar `GoogleMaps.View` con su contrato actual
  (`uiSettings` `{ zoomControlsEnabled: false }`) y ningún `AppleMaps.View`.

  En `src/components/__tests__/pet-map.test.tsx`,
  `describe('#60 R1: en iOS PetMap pinta AppleMaps.View con el contrato del tab Map'`
  tiene cinco casos:

  1. `#60 R1: en Android pinta GoogleMaps.View y nunca AppleMaps.View`
     (centinela: verde en la base y después);
  2. `en iOS › #60 R1: pinta AppleMaps.View y nunca GoogleMaps.View, con cámara, marker, polylines y estilo del contrato`;
  3. `en iOS › #60 R1: mapea el tema dark al esquema nativo DARK`;
  4. `en iOS › #60 R1: mapea el tema light al esquema nativo LIGHT`;
  5. `en iOS › #60 R1: oculta el botón de mi ubicación y el cambio de inclinación, sin contentPadding`.

  Los `it` existentes del fichero no cambian y siguen describiendo Android,
  ahora con `setPlatform('android')` explícito. El rojo es **natural**: con
  el `pet-map.tsx` de base, los casos 2 a 4 fallan por
  `toHaveBeenCalledTimes` (nadie llama a `AppleMaps.View`) y el 5, por
  `toEqual` de `uiSettings`.

  IF `PetMap` pinta Apple en Android (sonda `always_apple`), THEN el
  centinela y dos `it` existentes SHALL fallar **por aserción**. IF vuelve el
  cambio de inclinación (sonda `no_pitch`), THEN el caso 5 y `#60 R2` SHALL
  fallar por `toEqual`. IF el tema oscuro da `LIGHT` (sonda `apple_dark`),
  THEN el caso 3 SHALL fallar por `toBe`.

- **R2**: WHEN el tab Map resuelva la última posición de la mascota en iOS,
  THE SYSTEM SHALL montar el mapa de Apple (`map-view`) centrado en esa
  posición con zoom 16, con el marcador `last-position` en ella, sin
  polylines si no hay recorridos, con `colorScheme` `LIGHT` bajo el tema
  claro de la app, y con `uiSettings`
  `{ myLocationButtonEnabled: false, togglePitchEnabled: false }`.

  En `src/screens/map/index.test.tsx`,
  `#60 R2: en iOS el tab Map monta el mapa de Apple con la última posición › #60 R2: centra el mapa de Apple en la última posición y oculta sus controles de ubicación e inclinación`
  asevera las seis props con un único `toEqual(expect.objectContaining(…))`.
  Los 58 `it` existentes no cambian y corren con `setPlatform('android')`. El
  rojo es **natural**: con el `pet-map.tsx` de base falla por `toEqual`
  (no hay `uiSettings` de Apple).

  IF la pantalla deja de pasar el mapa de Apple con esas props (sonda
  `no_pitch`), THEN el `it` SHALL fallar **por aserción** (`toEqual`).

- **R3**: WHEN el usuario elija foto en el alta de mascota o pulse
  `change-photo` en el perfil, THE SYSTEM SHALL llamar **una vez** a
  `ImagePicker.launchImageLibraryAsync` con exactamente
  `{ mediaTypes: ['images'], quality: 0.8, preferredAssetRepresentationMode: ImagePicker.UIImagePickerPreferredAssetRepresentationMode.Compatible }`,
  para que iOS entregue JPEG en lugar de HEIC.

  Un `it` en cada pantalla, con el mismo nombre,
  `#60 R3: pide al picker la representación compatible para que iOS entregue JPEG y no HEIC`:

  - `src/screens/add-pet/index.test.tsx`, último `it` de
    `describe('R7: foto opcional tras alta'`;
  - `src/screens/profile/index.test.tsx`, último `it` de
    `describe('R7: cambiar foto'`.

  Los dos mocks de `expo-image-picker` ganan el enum
  `UIImagePickerPreferredAssetRepresentationMode` con los valores reales de la
  librería (`'automatic'`, `'compatible'`, `'current'`), y el esperado es el
  literal `'compatible'`. El rojo es **natural**: con las pantallas de base
  los dos `it` fallan por `toHaveBeenCalledWith`.

  IF una de las dos pantallas pide `Current` o pierde la opción (sondas
  `current_addpet` y `current_profile`), THEN su `it` SHALL fallar **por
  aserción** (`toHaveBeenCalledWith`).

- **R4**: THE SYSTEM SHALL declarar en `app.json` `expo.ios` **exactamente**
  `{ icon: './assets/expo.icon', bundleIdentifier: 'com.trackermex.pettracker', deploymentTarget: '17.0', config: { usesNonExemptEncryption: false } }`.

  En `app.config.test.ts`,
  `#60 R4: app.json declara la identidad de iOS › #60 R4: fija bundleIdentifier, deploymentTarget 17.0 y cifrado exento sin tocar el icono`
  asevera el objeto con `toEqual`. El rojo es **natural** (`toEqual`).

  IF el target o el cifrado cambian (sondas `target16` y `encryption_true`),
  THEN SHALL fallar **por aserción** `#60 R4`, los dos casos de `#60 R6` y
  los tres de `#60 R7`, todos por `toEqual`.

- **R5**: THE SYSTEM SHALL declarar en `app.json` los plugins en este orden,
  `expo-router`, `expo-splash-screen`, `expo-secure-store`,
  `expo-notifications`, `expo-image-picker`, con `expo-secure-store` como
  tupla `['expo-secure-store', { faceIDPermission: false }]` y
  `expo-image-picker` como
  `['expo-image-picker', { photosPermission: 'Se usa para elegir de tu galería la foto de perfil de tu mascota.', cameraPermission: false, microphonePermission: false }]`.

  En `app.config.test.ts`,
  `describe('#60 R5: app.json deja solo el permiso de galería, en español'`
  tiene dos `it`:

  1. `#60 R5: declara expo-image-picker con el texto de galería y sin cámara ni micrófono`
     (`toContainEqual` de la tupla);
  2. `#60 R5: declara expo-secure-store sin Face ID y una sola vez por plugin`
     (`toContainEqual` de la tupla, `not.toContain('expo-secure-store')` y
     `toEqual` de los cinco nombres en orden).

  **Enmienda de `#79 R2`.** En
  `it('conserva los plugins existentes y añade expo-notifications'`, la línea
  `expect(expo.plugins).toContain('expo-secure-store');` se sustituye por el
  comentario
  `// #60 R5: expo-secure-store pasa a tupla con faceIDPermission: false; la candan los it de #60 R5.`
  Es la **única** línea de un `it` existente que cambia en toda la feature.
  Sin la enmienda, `#79 R2` daría rojo al pasar el plugin a tupla.

  El rojo es **natural**: con el `app.json` de base los dos `it` fallan por
  `toContainEqual`.

  IF `expo-secure-store` vuelve a ser una string (sonda `secure_string`),
  THEN el `it` 2 SHALL fallar por `toContainEqual`. IF el picker vuelve a
  pedir la cámara (sonda `camera_on`), THEN el `it` 1 SHALL fallar por
  `toContainEqual`. Lo que los plugins generan con esas opciones lo comprueba
  R10.8.

- **R6**: WHEN `RESET_LINK_HOST`, recortada, no esté vacía, THE SYSTEM SHALL
  resolver la config con `ios` igual a lo de `app.json` más
  `associatedDomains: ['applinks:<host recortado>']`, tenga o no la clave de
  mapas y `google-services.json`.

  En `app.config.test.ts`,
  `describe('#60 R6: RESET_LINK_HOST declara el dominio asociado de iOS'`
  tiene un `it.each` `'#60 R6: %s, añade applinks del host recortado a ios'`
  con dos casos:

  1. `con clave de mapas y google-services.json`;
  2. `sin clave de mapas ni google-services.json (builder de EAS)`.

  Los dos usan el host `'  reset.example.test  '` y asertan `resolved.ios`
  con `toEqual`. El caso 2 es el del builder de EAS: allí no hay clave de
  Google ni `google-services.json`, y `associatedDomains` tiene que salir
  igual. El rojo es **natural** (`toEqual`).

  IF el host no se recorta (sonda `no_trim`), THEN los dos casos SHALL fallar
  por `toEqual`. IF `associatedDomains` pasa a depender de la clave de mapas
  (sonda `ios_needs_maps`), THEN el caso 2 SHALL fallar por `toEqual`.

- **R7**: IF `RESET_LINK_HOST` falta, está vacía o solo tiene espacios, THEN
  THE SYSTEM SHALL resolver `ios` sin `associatedDomains` y emitir **un
  único** `console.warn` que contenga `RESET_LINK_HOST`, `Android`,
  `App Links`, `iOS`, `associatedDomains`, `Universal Links`,
  `docs/verification.md`, `§Feature 59 — auth-reset-deep-link` y
  `§Feature 60 — mobile-ios-support`.

  En `app.config.test.ts`,
  `describe('#60 R7: sin RESET_LINK_HOST iOS queda sin dominio asociado y el aviso lo dice'`
  tiene un `it.each`
  `'#60 R7: con un host %s no declara associatedDomains y avisa una vez por Android e iOS'`
  con los casos `ausente`, `vacío` y `solo espacios`. El aviso sigue siendo
  un único `console.warn` que une los avisos: la cuenta de uno de `R2`, de
  `R4 (auth-reset-deep-link)` y de `#79 R14` no cambia. El rojo es
  **natural**: los tres casos fallan en el fragmento `iOS`, por `toEqual`.

  IF el aviso pierde la parte de iOS (sonda `old_warning`), THEN los tres
  casos SHALL fallar **por aserción** (`toEqual`).

- **R8**: THE SYSTEM SHALL versionar
  `hosting/.well-known/apple-app-site-association` (JSON sin extensión) con
  **un** detalle de `applinks`, cuyo único `appID` es
  `REPLACE_WITH_APPLE_TEAM_ID.com.trackermex.pettracker` (o un Team ID real
  de 10 caracteres `[A-Z0-9]` seguido del bundle) y cuyo único componente es
  `{ "/": "/reset-password*" }`; y `hosting/.well-known/.htaccess` con
  `<Files "apple-app-site-association">`, `ForceType application/json` y
  `</Files>`, nada más.

  En `src/__tests__/hosting-artifacts.test.ts`,
  `describe('#60 R8: apple-app-site-association delega /reset-password en la app de iOS'`
  tiene dos `it`:

  1. `#60 R8: publica un único detalle para el App ID de iOS y solo la ruta de reset`
     (claves exactas en cada nivel, un detalle, un `appID` contra
     `/^(?:REPLACE_WITH_APPLE_TEAM_ID|[A-Z0-9]{10})\.com\.trackermex\.pettracker$/`,
     y `components` con `toEqual`);
  2. `#60 R8: fuerza application/json solo para el fichero sin extensión`
     (las tres líneas recortadas, con `toEqual`).

  El rojo es **natural**: sin los ficheros, los dos fallan en
  `expect(existsSync(…)).toBe(true)`.

  IF el `appID` apunta a otro bundle (sonda `wrong_bundle`), THEN el `it` 1
  SHALL fallar por `toMatch`. IF el componente se abre a todo el dominio
  (sonda `wide_path`), THEN SHALL fallar por `toEqual`. IF el `.htaccess`
  fuerza JSON para todo el directorio (sonda `htaccess_all`), THEN el `it` 2
  SHALL fallar por `toEqual`.

- **R9**: THE SYSTEM SHALL documentar los gates del dev build de iOS en una
  sección nueva `### Feature 60 — mobile-ios-support` de
  `docs/verification.md`, **delante** de `### Feature 79 — mobile-push-registration: \`google-services.json\` del dev build`,
  con los gates **I1–I6** del texto exacto de [[tasks]] §R9; reescribir
  `hosting/README.md` para el AASA, su `.htaccess` y el Team ID; nombrar el
  AASA en la fila de `hosting/` de `AGENTS.md`; y nombrar la variable de EAS
  en la fila de `RESET_LINK_HOST` de `docs/conventions.md` y en
  `mobile-pet-tracker/.env.example`.

  En `src/__tests__/hosting-artifacts.test.ts`,
  `describe('#60 R9: la guía de iOS y RESET_LINK_HOST quedan documentadas'`
  tiene tres `it`:

  1. `#60 R9: documenta los gates de iOS en la sección Feature 60` (diez
     fragmentos dentro de la sección, cortada por `^### Feature `, y ningún
     `--visibility secret`);
  2. `#60 R9: el README de hosting explica el AASA, su .htaccess y el Team ID, y AGENTS.md lo nombra`;
  3. `#60 R9: la fila de RESET_LINK_HOST y el .env.example móvil nombran la variable de EAS`.

  El rojo es **natural**: los tres fallan por `toContain`. La sección §59
  no cambia: `R12` de `hosting-artifacts.test.ts` la sigue candando.

  IF la guía permite `--visibility secret` (sonda `secret_doc`), THEN el
  `it` 1 SHALL fallar por `not.toMatch`. IF la fila de `AGENTS.md` o la de
  `conventions.md` vuelven a su texto de base (sondas `agents_row` y
  `conv_row`), THEN el `it` 2 o el 3 SHALL fallar por `toContain`.

- **R10**: THE SYSTEM SHALL cerrar con:

  1. **El delta declarado**: +0 suites y +21 tests. Por fichero:
     `pet-map.test.tsx` +5, `map/index.test.tsx` +1,
     `add-pet/index.test.tsx` +1, `profile/index.test.tsx` +1,
     `app.config.test.ts` +8 y `hosting-artifacts.test.ts` +5. Los seis
     ficheros pasan de 148 a 169 tests en la base medida. La suite móvil,
     de 86 / 1613 (base del `leader`, `./init.sh` en `5cc743e5`) a
     86 / **1634**, medida sin pipe. Si la base medida al arrancar es otra,
     el delta exigido sigue siendo +21 tests y +0 suites sobre lo medido.
  2. **Ningún `it` existente cambia, salvo la línea de `#79 R2` de R5.** En
     los seis ficheros de test, `git diff --numstat` solo borra **dos**
     líneas: esa aserción y el import de `node:fs` de
     `hosting-artifacts.test.ts`, que gana `existsSync`.
  3. **El diff toca exactamente los 18 ficheros** de §Contexto mínimo,
     medido contra el HEAD del handoff (el `git rev-parse HEAD` que el
     implementador anota al arrancar).
  4. `bunx tsc --noEmit` con `exit=0` tras `test ! -e .expo/types/router.d.ts`,
     y `bunx eslint` de los diez ficheros `.ts`/`.tsx` tocados con `exit=0`.
  5. **Los guardas del repo no se mueven**:
     `src/__tests__/design-drift.test.ts`,
     `src/__tests__/consistency-classnames.test.ts` y
     `src/__tests__/hero-header-amendments.test.ts` dan los mismos tests en
     verde antes y después (111 en la base medida). Es C8 de
     `CHECKPOINTS.md`: ningún hex fuera de `src/theme/`, ninguna clase
     arbitraria, ningún `StyleSheet.create` ni sombra legacy nuevos.
  6. **Ninguna dependencia, copy ni perfil nuevos**: `git diff --exit-code`
     vacío para `mobile-pet-tracker/eas.json`, `mobile-pet-tracker/package.json`,
     `mobile-pet-tracker/bun.lock`, `mobile-pet-tracker/src/i18n/catalog.ts`,
     `mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx`
     (cierra la longitud del catálogo), `mobile-pet-tracker/src/api/media.ts`,
     `mobile-pet-tracker/src/screens/map/index.tsx`, `.env.example` de la
     raíz, `docs/ui-guidelines.md`, `hosting/.well-known/assetlinks.json` y
     `hosting/reset-password/index.html`.
  7. **Los candados de cuenta** de [[tasks]] §R10 dan lo exigido, medidos con
     `grep` por contenido.
  8. **Lo que generan los plugins.** Con
     `RESET_LINK_HOST=reset.example.test bunx expo config --type introspect --json`,
     el `Info.plist` resuelto tiene exactamente dos `*UsageDescription`
     (`NSLocalNetworkUsageDescription`, del dev launcher, y
     `NSPhotoLibraryUsageDescription` con el texto en español),
     `ITSAppUsesNonExemptEncryption` `false`, los entitlements tienen
     `com.apple.developer.associated-domains` igual a
     `["applinks:reset.example.test"]` y `aps-environment` `development`, y
     `android.permissions` no contiene `RECORD_AUDIO` ni `CAMERA`. La línea
     exacta que se espera está en [[tasks]] §R10. En la base salen cinco
     `*UsageDescription`, el texto de fotos en inglés y `RECORD_AUDIO`.
  9. **Nada de EAS ni de secretos.** Ninguna IA ejecuta `eas build`,
     `eas credentials`, `eas device:create`, `eas env:set` ni `eas login`, ni
     toca la clave `.p8`, certificados o perfiles. El repo no gana el dominio
     real, el Team ID real (salvo lo que decida el humano en R11), UDIDs,
     correos ni tokens.
  10. **Tests dirigidos.** El implementador corre `bunx jest <rutas>` y, para
      la suite entera, pide antes permiso al humano (otra sesión puede tener
      `./init.sh` en vuelo). `./init.sh` lo corre el `leader`.

  R10 no tiene test propio: lo cierra el `reviewer` por inspección, con los
  comandos de [[tasks]] §R10.

- **R11** (gate humano): WHEN el humano sustituya el placeholder por el Team
  ID y suba `apple-app-site-association` y `.htaccess` a
  `public_html/.well-known/` de Hostinger, THE SYSTEM SHALL responder a
  `curl -fsSI https://<RESET_LINK_HOST>/.well-known/apple-app-site-association`
  con **200**, `Content-Type: application/json` y **sin redirección** (ni
  301, ni 302, ni cabecera `Location:`). Es el gate **I3** de la guía. Lo
  cierra la casilla de §Gate humano — R11.

- **R12** (prueba de humo): WHEN el humano registre el iPhone (I1), declare
  `RESET_LINK_HOST` en EAS (I2), compile e instale el dev build de iOS (I4) y
  lo conecte a Metro (I5), THE SYSTEM SHALL (a) pintar el mapa de Apple
  centrado en la última posición, sin botón de mi ubicación, y oscuro con la
  app en tema oscuro; (b) subir una foto HEIC en el alta de mascota y en el
  perfil sin error de formato; (c) abrir el dev build en `/reset-password`
  desde el enlace del correo en Mail (Universal Link) y completar el reset,
  con la página fallback intacta en Safari; y (d) entregar un push en el
  iPhone. Lo cierra la casilla de §Prueba de humo del humano — R12.

- **R13** (regresión de Android): WHEN el humano regenere el proyecto nativo
  de Android (`bunx expo prebuild --clean --platform android`) y lance
  `bunx expo run:android`, THE SYSTEM SHALL declarar `RECORD_AUDIO` y
  `CAMERA` en `android/app/src/main/AndroidManifest.xml` solo con
  `tools:node="remove"`, y el dev build de Android SHALL seguir pintando el
  mapa de Google en el tab Map y eligiendo foto de la galería en el alta de
  mascota. Es el gate **I6**. Lo cierra la casilla de §Regresión de Android
  del humano — R13.

## Tabla de sondas, resumen

Las 18 sondas están medidas sobre el árbol final: cada una es una mutación de
un solo fichero, se corre y se restaura con `git checkout HEAD -- <ruta>`. El
procedimiento, los blobs mutados y las cuentas exactas están en [[tasks]]
§Sondas.

| Sonda | Fichero | Mutación | Rojo exigido | Tipo de rojo |
|---|---|---|---|---|
| `always_apple` | `pet-map.tsx` | `=== 'ios'` pasa a `!== 'web'` | centinela de `#60 R1` y dos `it` existentes de Android | aserción (`toHaveBeenCalledTimes`, `toEqual`) |
| `no_pitch` | `pet-map.tsx` | quita `togglePitchEnabled: false` | caso 5 de `#60 R1` y `#60 R2` | aserción (`toEqual`) |
| `apple_dark` | `pet-map.tsx` | el tema oscuro da `LIGHT` | caso `dark` de `#60 R1` | aserción (`toBe`) |
| `current_addpet` | `add-pet/index.tsx` | `Compatible` pasa a `Current` | `#60 R3` del alta | aserción (`toHaveBeenCalledWith`) |
| `current_profile` | `profile/index.tsx` | `Compatible` pasa a `Current` | `#60 R3` del perfil | aserción (`toHaveBeenCalledWith`) |
| `target16` | `app.json` | `"17.0"` pasa a `"16.4"` | `#60 R4`, `#60 R6` ×2, `#60 R7` ×3 | aserción (`toEqual`) |
| `encryption_true` | `app.json` | `usesNonExemptEncryption` a `true` | los mismos seis | aserción (`toEqual`) |
| `secure_string` | `app.json` | la tupla de secure-store vuelve a string | `#60 R5` de secure-store | aserción (`toContainEqual`) |
| `camera_on` | `app.json` | `cameraPermission` con texto | `#60 R5` del picker | aserción (`toContainEqual`) |
| `no_trim` | `app.config.ts` | `applinks:` con la variable sin recortar | `#60 R6` ×2 | aserción (`toEqual`) |
| `ios_needs_maps` | `app.config.ts` | `associatedDomains` exige también la clave de mapas | `#60 R6` del builder de EAS | aserción (`toEqual`) |
| `old_warning` | `app.config.ts` | el aviso pierde la parte de iOS | `#60 R7` ×3 | aserción (`toEqual`) |
| `wrong_bundle` | AASA | el `appID` apunta a `…pettracker.dev` | `#60 R8` 1 | aserción (`toMatch`) |
| `wide_path` | AASA | el componente pasa a `"*"` | `#60 R8` 1 | aserción (`toEqual`) |
| `htaccess_all` | `.htaccess` | `<Files "*">` | `#60 R8` 2 | aserción (`toEqual`) |
| `secret_doc` | `docs/verification.md` | la guía admite `--visibility secret` | `#60 R9` 1 | aserción (`not.toMatch`) |
| `agents_row` | `AGENTS.md` | la fila de `hosting/` vuelve a la base | `#60 R9` 2 | aserción (`toContain`) |
| `conv_row` | `docs/conventions.md` | la fila de `RESET_LINK_HOST` vuelve a la base | `#60 R9` 3 | aserción (`toContain`) |

Ninguna sonda da rojo por consulta: todas las mutaciones dejan el nodo o el
fichero, y el rojo es del matcher.

## Riesgos y supuestos

Nada de esta tabla es un hecho verificado. Cada fila dice dónde se vería y
qué se hace. «Para y enmienda» significa: anotar el error en
`progress/impl_mobile-ios-support.md`, avisar al `leader` y no arreglarlo en
caliente; el arreglo es una enmienda de spec con su propio gate.

| Supuesto | Dónde se ve | Si falla |
|---|---|---|
| ATS deja al dev build llamar a `http://<IP LAN>:3000/v1` (el prebuild pone `NSAllowsLocalNetworking`; Metro por IP funciona en dev clients, lo que apunta a que sí) | I5, login | Para y enmienda |
| El builder de EAS compila el icono de Icon Composer (`./assets/expo.icon`, pide Xcode 26) | I4 | Para y enmienda (`"image": "latest"` en `eas.json`) |
| Con perfil ad hoc, `aps-environment` y la clave APNs de EAS bastan para el push | I5, push | Para y enmienda |
| La CDN de Apple sirve el AASA recién subido | I5, Universal Link | Esperar y reintentar; la comprobación opcional de I3 muestra lo que ve la CDN. Subir el AASA **antes** del build lo evita |
| Hostinger respeta `ForceType` en un `.htaccess` dentro de `.well-known/` | I3 (`curl`) | Para y enmienda |
| Con `Compatible`, PHPicker entrega JPEG | I5, foto HEIC | Para y enmienda |
| expo-router abre `/reset-password?token=…` desde un Universal Link igual que desde el App Link | I5, reset | Para y enmienda |
| `EXPO_PUBLIC_API_URL` no hace falta en EAS: el JS lo sirve el Metro del PC, que lee su `.env` | I5, login | Para y enmienda |
| Apple procesa el dispositivo y el perfil a tiempo | I1, I4 | Esperar y repetir el build; registrar el iPhone con antelación |
| El humano acepta el aviso de Red local de iOS | I5 | Sin él no hay Metro ni API: Ajustes → Privacidad y seguridad → Red local |
| Cuota de EAS Build suficiente | I4 | El humano aceptó el coste («Sí, aunque cueste») |
| EAS CLI no propone escribir en `app.json` ni `eas.json` | I4 | Responder que no y parar: es una enmienda |
| EAS avisa de `cli.appVersionSource` o imprime los avisos de Android (`GOOGLE_MAPS_API_KEY_ANDROID`, `google-services.json`) | I4 | Ruido esperado, no bloquea |
| Selector de fecha de `@expo/ui` en iOS: control compacto en línea, no se cierra sin cambio | I5, recorrido libre | Hallazgo **(F)**, no bloquea R12 |
| `contentInsetAdjustmentBehavior="automatic"` suma el inset al `paddingTop` manual en 17 pantallas | I5, recorrido libre | Hallazgo **(F)**, no bloquea R12 |
| La leyenda «Legal» de Apple Maps queda bajo el `FloatingTabBar` (Apple no tiene `contentPadding`) | I5, mapa | Hallazgo **(F)**, no bloquea R12 |
| Rojo de `add-pet/index.test.tsx` que no es de `#60 R3` bajo carga (flake de `#72 R2`) | jest | Repetir aislado borrando la caché de jest y anotarlo; no es de esta feature |

## Qué firma el humano al aprobar esta spec

1. **Las siete decisiones de §Decisiones del humano** tal como quedan
   escritas, y los once defaults de §Decisiones por defecto.
2. **Cifrado exento.** `usesNonExemptEncryption: false` declara ante Apple
   que la app solo usa cifrado exento (HTTPS y el llavero de iOS). Si algún
   día se añade cifrado propio, hay que cambiarlo.
3. **Permisos borrados.** iOS pierde los textos de cámara, micrófono y
   Face ID, y Android bloquea `RECORD_AUDIO` y `CAMERA`. Una feature futura
   que use la cámara tendrá que volver a declararlos.
4. **La enmienda de `#79 R2`**: una línea de un `it` ajeno, sustituida por un
   comentario que cita `#60 R5`, que la sustituye con candados más fuertes.
5. **Mapa de Apple.** Sin botón de mi ubicación ni cambio de inclinación, con
   brújula y escala por defecto de Apple. El tema sigue la preferencia de la
   app (perfil), no la del sistema. Jest no pinta el mapa nativo: lo prueba
   R12.
6. **Team ID.** El repo lleva `REPLACE_WITH_APPLE_TEAM_ID`. En R11 el humano
   lo sustituye en local y sube el fichero. Después, **o** lo restaura con
   `git checkout HEAD -- hosting/.well-known/apple-app-site-association`,
   **o** lo commitea en un commit aparte que solo cambia esa línea (el Team
   ID no es secreto y el test lo acepta). En el segundo caso, el `leader`
   comprueba antes de cerrar que el diff contra el commit del veredicto es
   solo esa línea.
7. **El dominio real nunca se versiona**: vive en el `.env` de cada máquina y
   en la variable de EAS.
8. **La variable de EAS** `RESET_LINK_HOST` con visibilidad `plaintext` o
   `sensitive` en el entorno `development`, creada por el humano en I2.
9. **`eas.json` no cambia.** Si el icono falla en el builder, el arreglo es
   una enmienda.
10. **Coste**: cada iteración del smoke es un build de iOS en EAS.
11. **Tres casillas humanas propias** además de esta (R11, R12, R13), cada
    una con su gate en `docs/verification.md` §Feature 60.
12. **Hallazgos (F) sin id**: selector de fecha, insets y leyenda de Apple.
    Si el smoke los confirma y el humano decide registrarlos, el `leader`
    asigna el id contra `origin/main` (el siguiente libre era #141 el
    2026-09-30).
13. **El delta es +0 suites y +21 tests**: 86 / 1613 antes y 86 / 1634
    después, sobre la base del `leader`.
14. **Requisitos sin test propio**: R10, una propiedad del diff, de la suite
    y de la config resuelta, que cierra el `reviewer` por inspección; y R11,
    R12 y R13, que cierra el humano. Queda declarado antes del handoff, como
    pide C4.
15. **Orden de los gates**: I3 (R11) antes de instalar el build de I4, por
    la caché de la CDN de Apple. La feature no pasa a `done` sin las tres
    casillas.

## Gate humano — R11: AASA publicado en Hostinger

**Cuándo:** después del veredicto aprobado del `reviewer` y **antes** de
instalar el build de I4. Pasos exactos en `docs/verification.md`
§Feature 60, gate I3.

**Criterio de paso**: `curl.exe -fsSI https://<RESET_LINK_HOST>/.well-known/apple-app-site-association`
(PowerShell) responde `200`, con `Content-Type: application/json`, sin 301
ni 302 ni cabecera `Location:`. El Team ID quedó restaurado o commiteado
según el punto 6 de §Qué firma el humano.

- [ ] Gate R11 superado por el humano: AASA y `.htaccess` publicados; `curl -fsSI` da 200, `Content-Type: application/json` y sin redirección (fecha: ____, Team ID: restaurado / commiteado en ____)

## Prueba de humo del humano (no delegable a IA) — R12

**Entorno** (todos obligatorios, detallados en `docs/verification.md`
§Feature 60):

- **Dev build de iOS vía EAS** en un iPhone físico con iOS 18 o superior,
  nunca Expo Go ni simulador. Modo de desarrollador activado.
- PC con Windows y PowerShell, desde `mobile-pet-tracker/`; comandos con
  `bunx`, nunca `npx`; `curl.exe` en lugar de `curl`.
- iPhone y PC en la misma red Wi-Fi; Firewall de Windows abierto a 8081
  (Metro) y 3000 (backend) en la red privada; aviso de Red local de iOS
  aceptado.
- Backend y LocalStack levantados; `mobile-pet-tracker/.env` con
  `EXPO_PUBLIC_API_URL=http://<IP LAN del PC>:3000/v1`; `.env` de la raíz
  con el correo de Resend, `RESET_LINK_HOST`, `PUSH_ENABLED=true` y
  `NOTIFIER_ENABLED=true`.
- R11 cerrado.

**Pasos:** gates I1, I2, I4 e I5 de `docs/verification.md` §Feature 60, en
orden.

**Criterio de paso**: los cuatro puntos de I5 (login contra la IP LAN, mapa,
foto HEIC en alta y perfil, reset por Universal Link con el fallback de
Safari intacto, y push) se cumplen tal como están escritos. Lo que se vea
del selector de fecha, los insets o la leyenda de Apple se anota como
hallazgo y no bloquea esta casilla.

- [ ] Prueba de humo de R12 superada por el humano (fecha: ____, iPhone: ____, iOS: ____, build de EAS: ____)

## Regresión de Android del humano — R13

**Entorno:** el de §Feature 59 G1 y §Feature 79 (dev build de Android local,
`google-services.json` en esta máquina, `adb` conectado).

**Pasos:** gate I6 de `docs/verification.md` §Feature 60.

**Criterio de paso**: `findstr "RECORD_AUDIO CAMERA" android\app\src\main\AndroidManifest.xml`
solo muestra líneas con `tools:node="remove"`; el tab Map pinta el mapa de
Google y el alta de mascota elige foto de la galería.

- [ ] Regresión de Android de R13 superada por el humano (fecha: ____, dispositivo: ____, Android: ____)

---

## Cobertura de los criterios de aceptación de `feature_list.json` #60

| Criterio | Cubierto por |
|---|---|
| 1. El tab Map pinta tiles, marker y polyline en iOS con `AppleMaps.View` y sigue igual en Android con `GoogleMaps.View`, con test que nombra su R-id | R1 (contrato de las dos plataformas, `#60 R1`), R2 (la pantalla en iOS, `#60 R2`) y R12 (a). Los tiles solo se ven en el iPhone |
| 2. `bundleIdentifier` igual al package de Android y los textos de permiso que exigen expo-image-picker y expo-maps | R4 (bundle) y R5 (permisos). **Ajustado** por la decisión «Español y borrar los no usados»: un único texto, el de la galería; expo-maps no exige ninguno con el botón de ubicación apagado (§Premisas). R10.8 comprueba el `Info.plist` generado |
| 3. El enlace de reset abre la app en iOS como Universal Link, con fallback web intacto | R6, R7 (`associatedDomains`), R8 (AASA), R11 (publicado) y R12 (c). `hosting/reset-password/index.html` no cambia (R10.6) |
| 4. Perfil EAS para dev build de iOS documentado; smoke en simulador (o dispositivo) | R9 (guía I1–I6) y R12. **Ajustado** por «No tengo Mac» y «Sí, ya lo tengo»: iPhone físico, sin simulador. El perfil `development` de `eas.json` ya sirve y no cambia |
| (ampliación) Push de iOS dentro de #60 | R12 (d). Sin código: el hook y el backend ya soportan `ios` |

## Fuera de alcance

Cada viñeta lleva su clase: **(D)** es un límite de esta feature, **(F)** es un
hallazgo que podría registrarse como otra feature (sin id: solo si el humano
lo decide, y lo asigna el `leader` contra `origin/main`) y **(N)** es una
premisa verificada y descartada.

- **(D)** TestFlight, App Store, perfil `production` y `eas submit`. Esta
  feature llega hasta un dev build interno en un iPhone registrado.
- **(D)** Simulador de iOS, local o remoto (`eas-simulator`): sin Mac, y el
  humano tiene iPhone.
- **(D)** Backend: no acepta HEIC ni lo necesita, porque el móvil pide JPEG.
  `src/api/media.ts` tampoco cambia.
- **(D)** Ubicación del usuario en el mapa (punto azul, botón, permiso
  `NSLocationWhenInUseUsageDescription`). La app sigue a la mascota.
- **(D)** Cámara en el picker (`launchCameraAsync`). Si llega, vuelve el
  permiso de cámara con su texto.
- **(D)** Textos de permiso por idioma (`locales` de Expo): un único texto
  en español, la lengua por defecto de la app.
- **(D)** Condicionar los avisos de Android en los builds de iOS: son ruido
  y separarlos rompería la cuenta de un solo `console.warn` de `R2`,
  `R4 (auth-reset-deep-link)` y `#79 R14`.
- **(D)** `?mode=developer` en `associatedDomains`: solo sirve con firma de
  desarrollo, y el perfil `internal` firma ad hoc.
- **(D)** `docs/ui-guidelines.md` no se enmienda. El runtime de smoke por
  defecto sigue siendo el dev build de Android; el de iOS es el de esta
  feature.
- **(D)** El `REPLACE_WITH_DEV_BUILD_SHA256` de `docs/verification.md`
  §Feature 59 se queda: lo cierra `R12` de `hosting-artifacts.test.ts`.
- **(F)** *Selector de fecha y hora de `@expo/ui` en iOS.* En iOS,
  `presentation` y `onDismiss` no aplican y el control es compacto en línea;
  con el patrón actual (`onValueChange` cierra, `onDismiss` nunca llega)
  puede desaparecer al primer cambio o no cerrarse. Afecta al alta de
  mascota y a `add-reminder`. Sin id.
- **(F)** *Inset doble en iOS.* `contentInsetAdjustmentBehavior="automatic"`
  con `paddingTop: insets.top + 12` manual, en 17 pantallas, puede dejar un
  hueco doble en iOS. Sin id.
- **(F)** *Leyenda «Legal» de Apple Maps bajo el `FloatingTabBar`.* Apple no
  tiene `contentPadding`. Sin id.
- **(N)** *«expo-maps exige textos de permiso».* Falso con el botón de
  ubicación apagado.
- **(N)** *«El código no tiene ninguna rama `Platform.OS`».* Falso: hay
  tres.
- **(N)** *«El push de iOS necesita código».* Falso: el hook, su test y el
  backend ya soportan `ios`.
- **(N)** *«Quitar Face ID rompe el token guardado».* Falso: nadie usa
  `requireAuthentication`.

---

## Aprobación

- [x] **Aprobado por humano** (fecha: 2026-09-30) ← gate obligatorio antes de
      implementar. Al marcar esta casilla, el humano firma también los
      quince puntos de §Qué firma el humano al aprobar esta spec.

> **Esta feature tiene cuatro casillas.** Esta, antes del handoff, y las de
> R11, R12 y R13, después del veredicto del `reviewer`. La feature no se
> marca `done` sin las cuatro.

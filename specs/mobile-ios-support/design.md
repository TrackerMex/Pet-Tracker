---
feature: "mobile-ios-support"
status: spec_ready         # draft | spec_ready | approved
tags: [spec, mobile, ios, eas, universal-links]
---

# Diseño — [[mobile-ios-support]] (#60)

> Ver [[requirements]] para los requisitos que este diseño implementa y
> [[../../docs/architecture|architecture]] para las reglas de capas. Esta
> feature vive en la capa de presentación del móvil (`src/components/`,
> `src/screens/`), en su configuración de build (`app.json`, `app.config.ts`),
> en los artefactos estáticos de `hosting/` y en la documentación. No toca
> dominio, aplicación, infraestructura ni el backend.
>
> Rige `docs/ui-guidelines.md`: regla 4 (`pet-map.tsx` es el único adaptador
> entre el contrato del mapa y `expo-maps`), regla 8 (nada de rutas con
> extensión de plataforma en `src/app/`), regla 9 (el `colorScheme` del mapa
> llega por `PetMap` y los colores imperativos por `useThemeColors`) y
> regla 10 (ningún ancestro opaco sobre el mapa nativo). Esta spec no las
> contradice ni las enmienda.

## Decisiones técnicas

- **D1. Una rama `Platform.OS === 'ios'` dentro de `PetMap`, leída en render
  (R1, R2).** El componente arma un único objeto `mapViewProps` con lo que las
  dos vistas comparten (`testID`, `style`, `cameraPosition`, `markers`,
  `polylines`) y devuelve `AppleMaps.View` en iOS y `GoogleMaps.View` en el
  resto. Así:
  - el contrato que consumen `src/screens/map/index.tsx` y los tests (props de
    `PetMap`, `testID` `map-view`) no cambia, y la pantalla no se toca;
  - la regla 4 de la carta se cumple: `pet-map.tsx` sigue siendo el único
    sitio que conoce `expo-maps`;
  - `Platform.OS` se lee en cada render, no al cargar el módulo, así que
    `setPlatform` en un `beforeEach` basta para que jest recorra las dos
    ramas sin `jest.isolateModules`.
  Es la cuarta línea de producción con `Platform.OS` en `src` (hoy hay tres).

- **D2. `uiSettings` de Apple: fuera el botón de ubicación y la inclinación,
  se queda la brújula (R1, R2).** `expo-maps` 57.0.2 en iOS pone a `true`
  por defecto `myLocationButtonEnabled`, `togglePitchEnabled` y
  `compassEnabled`, y no tiene `zoomControlsEnabled` ni `contentPadding`.
  - `myLocationButtonEnabled: false`: la app no pide la ubicación del
    usuario, así que el botón no haría nada y además obligaría a declarar
    `NSLocationWhenInUseUsageDescription`, que la decisión «borrar los no
    usados» excluye.
  - `togglePitchEnabled: false`: el control de 2D/3D no existe en el mapa de
    Android; quitarlo acerca las dos plataformas.
  - `compassEnabled` se queda por defecto: Apple solo la muestra al rotar el
    mapa y sirve para volver al norte. Quitarla sería una decisión de producto
    sin pedir.
  El test asevera `uiSettings` con `toEqual`, así que una clave de más da
  rojo. La leyenda «Legal» de Apple puede quedar bajo el `FloatingTabBar`;
  sin `contentPadding` no hay arreglo en esta feature (hallazgo (F)).

- **D3. `colorScheme` con `DARK` y `LIGHT`, nunca `AUTOMATIC` (R1).** La
  pantalla ya pasa `'dark'` o `'light'` según la preferencia de la app
  (`useUniwind().theme`). `AUTOMATIC` seguiría al tema del sistema y
  rompería la regla 9: el mapa quedaría claro con la app en oscuro si el
  sistema está en claro.

- **D4. Identidad de iOS en `app.json`, sin inyección dinámica (R4).**
  - `bundleIdentifier` `com.trackermex.pettracker`, igual que
    `android.package`. EAS lo usa para crear el App ID en la cuenta de Apple.
  - `deploymentTarget` `"17.0"`: `AppleMapsView.swift` deja la vista en `nil`
    por debajo de iOS 17, y sin este campo el prebuild pone 16.4. El humano
    probará con iOS 18 o superior.
  - `config.usesNonExemptEncryption: false`: sin ninguna de las dos claves,
    `eas build` (eas-cli 23.2.0, `build/project/ios/exemptEncryption.js`)
    pregunta en el terminal y, como la config es dinámica
    (`app.config.ts`), no puede escribir la respuesta y pide al humano que la
    añada a mano. Declararlo evita esa parada en I4. La app solo usa HTTPS y
    el llavero de iOS, que son cifrado exento.
  El test compara el objeto `ios` entero con literales: el icono tampoco
  puede cambiar.

- **D5. Permisos por la configuración de los plugins, no por `infoPlist`
  (R5).** `expo-image-picker` y `expo-secure-store` inyectan hoy sus textos
  por defecto (en inglés). Sus plugins aceptan `false` para no inyectar una
  clave (`createPermissionsPlugin`), y el de `expo-image-picker` además
  bloquea `CAMERA` y `RECORD_AUDIO` en Android con `tools:node="remove"`
  (`withBlockedPermissions`). Escribir `ios.infoPlist` a mano no quitaría las
  claves que ponen los plugins y dejaría dos fuentes. El texto de galería va
  en español y describe el uso real («Se usa para elegir de tu galería la foto
  de perfil de tu mascota.»), como pide la revisión de Apple.
  `NSLocalNetworkUsageDescription` lo pone `expo-dev-client` y se queda: sin
  él, el dev build no llega a Metro. El test candado es de la config de
  `app.json`; lo que generan los plugins lo comprueba la introspección de
  R10.8, porque jest no ejecuta plugins.

- **D6. `associatedDomains` se añade después del cortocircuito de
  `app.config.ts` (R6).** Hoy la función devuelve `resolvedConfig` sin tocar
  si no hay clave de mapas, ni host, ni `google-services.json`. La rama de iOS
  va en el objeto que se devuelve después, como un spread condicional
  `...(resetLinkHost ? { ios: { ...resolvedConfig.ios, associatedDomains: [...] } } : {})`,
  con el mismo `resetLinkHost` recortado que ya usa Android. El caso del
  builder de EAS (host sí, clave de mapas y `google-services.json` no) queda
  cubierto por el segundo caso de `#60 R6`. `?mode=developer` no se añade:
  solo aplica a firma de desarrollo y el perfil `internal` firma ad hoc.

- **D7. Un solo aviso para Android e iOS (R7).** El aviso de
  `RESET_LINK_HOST` ya existe y los tests `R2`, `R4 (auth-reset-deep-link)` y
  `#79 R14` cuentan **un** `console.warn`. Se amplía su texto para nombrar
  iOS, `associatedDomains`, Universal Links y la sección §Feature 60, en vez
  de añadir un segundo aviso que rompería esas cuentas.

- **D8. AASA sin extensión y `.htaccess` con `<Files>` (R8).** Apple pide el
  fichero en `/.well-known/apple-app-site-association`, sin extensión, con
  `Content-Type: application/json`, sin redirecciones y por HTTPS. Apache no
  sabe el tipo de un fichero sin extensión, así que el `.htaccess` lo fuerza
  con `ForceType application/json` **solo** dentro de
  `<Files "apple-app-site-association">`: un `ForceType` suelto convertiría
  también `assetlinks.json` y cualquier otro fichero del directorio. El AASA
  usa el formato de `components` (iOS 13+) con un único patrón,
  `"/": "/reset-password*"`, el mismo alcance que el intent filter de
  Android: el resto del dominio sigue abriendo en Safari.

- **D9. Team ID como placeholder versionado (R8, R11).** El Team ID no es
  secreto, pero el humano aún no lo ha dado. El repo lleva
  `REPLACE_WITH_APPLE_TEAM_ID.com.trackermex.pettracker` y el test acepta el
  placeholder o un Team ID real de 10 caracteres `[A-Z0-9]`, igual que #59
  hizo con `REPLACE_WITH_DEV_BUILD_SHA256`. En R11 el humano sustituye,
  sube y, o restaura con `git checkout HEAD -- <ruta>`, o commitea esa línea
  sola. La segunda opción obliga al `leader` a comprobar el drift contra el
  commit del veredicto antes de cerrar.

- **D10. `RESET_LINK_HOST` como variable de EAS `plaintext` o `sensitive`
  (R9).** El builder de EAS no recibe `mobile-pet-tracker/.env` (ignorado por
  git, sin `.easignore`). El dominio llega al build como variable del entorno
  `development`, que es el que usa un perfil con `developmentClient: true`.
  Con visibilidad `secret`, EAS CLI no la ve al evaluar `app.config.ts` en la
  máquina del humano, y la sincronización de capacidades del App ID no
  activaría Associated Domains. El dominio no es un secreto: está en cada
  correo de reset.

- **D11. La guía de iOS delante de la de #79 en `docs/verification.md`
  (R9).** El orden del fichero sigue el número de feature, y la sección
  `### Feature 79 — mobile-push-registration: \`google-services.json\` del dev build`
  es un ancla estable por contenido. La guía se escribe con gates numerados
  **I1–I6** (como G1–G4 de §59) para que las casillas de R11–R13 puedan
  citarlos.

- **D12. `eas.json` no cambia (R10.6).** El perfil `development` ya tiene
  `developmentClient: true`, `distribution: "internal"` y la versión de bun.
  La imagen del builder por defecto de SDK 57 es la que se prueba primero; si
  no compila el icono de Icon Composer (necesita Xcode 26), el arreglo
  (`"image": "latest"`) es una enmienda con su gate, no un cambio preventivo
  sin evidencia.

- **D13. Una sola spec y tests por plataforma con `setPlatform` (R1–R13).**
  El mapa, la config, el HEIC, los Universal Links, el push y la guía se
  validan en el mismo build de iOS: partirlos obligaría a pagar varios builds
  y varios gates para la misma prueba. En los tests, el patrón `setPlatform`
  ya existe en tres ficheros del repo (`src/utils/date-picker-value.test.ts`,
  `src/hooks/use-push-registration.test.tsx`,
  `src/screens/add-pet/index.test.tsx`) y se copia literal; el `afterEach`
  restaura el `Platform.OS` original para no contaminar otros `describe`.

- **D14. HEIC se resuelve en el picker (R3).** `Compatible` hace que
  PHPicker transcodifique a JPEG antes de entregar el asset, así que
  `resolvePhotoContentType` de `src/api/media.ts` recibe un `.jpg` y el
  backend no cambia. `quality: 0.8` se queda: la compresión es independiente
  de la representación.

## Archivos afectados

Presentación (móvil):

- `mobile-pet-tracker/src/components/pet-map.tsx`: rama de iOS con
  `AppleMaps.View` (R1, R2).
- `mobile-pet-tracker/src/screens/add-pet/index.tsx` y
  `mobile-pet-tracker/src/screens/profile/index.tsx`: una opción más en
  `launchImageLibraryAsync` (R3).

Configuración de build (móvil):

- `mobile-pet-tracker/app.json`: `ios` y dos plugins con opciones (R4, R5).
- `mobile-pet-tracker/app.config.ts`: `ios.associatedDomains` y el aviso (R6,
  R7).
- `mobile-pet-tracker/.env.example`: dos líneas de comentario (R9).

Tests (móvil):

- `mobile-pet-tracker/src/components/__tests__/pet-map.test.tsx` (R1).
- `mobile-pet-tracker/src/screens/map/index.test.tsx` (R2).
- `mobile-pet-tracker/src/screens/add-pet/index.test.tsx` y
  `mobile-pet-tracker/src/screens/profile/index.test.tsx` (R3).
- `mobile-pet-tracker/app.config.test.ts` (R4–R7, y la línea enmendada de
  `#79 R2`).
- `mobile-pet-tracker/src/__tests__/hosting-artifacts.test.ts` (R8, R9).

Hosting estático:

- `hosting/.well-known/apple-app-site-association` (nuevo) y
  `hosting/.well-known/.htaccess` (nuevo) (R8).
- `hosting/README.md` (R9).

Documentación:

- `docs/verification.md`: §Feature 60 con I1–I6 (R9).
- `docs/conventions.md`: fila de `RESET_LINK_HOST` (R9).
- `AGENTS.md`: fila de `hosting/` (R9).

Sin cambios, y comprobado en el cierre (R10.6): `eas.json`, `package.json`,
`bun.lock`, el catálogo i18n y su candado de longitud, `src/api/media.ts`,
`src/screens/map/index.tsx`, `.env.example` de la raíz,
`docs/ui-guidelines.md`, `assetlinks.json` y la página fallback de reset.

## Coordinación con la otra sesión

- **Backend** trabaja en `Pet-Tracker-wt-backend` (#131 y #135) y solo toca
  `weekly-activity-chart.test.tsx`: no hay solape de ficheros de código.
- Su PR #179 toca `feature_list.json` y `STATUS.md`. Si mergea antes que la
  de #60, esperar conflicto en esos dos ficheros al cerrar; se resuelve en el
  cierre, no rebasando la branch (un rebase invalida los hashes de
  [[traceability]]).
- Comparten máquina: nada de `./init.sh` ni de suite entera sin avisar
  ([[requirements]] R10.10).

## Alternativas descartadas

- **`pet-map.ios.tsx` y `pet-map.android.tsx`**: dos ficheros que repiten el
  contrato, un test por fichero y una resolución de módulos que depende del
  preset de jest (`ios` por defecto). La rama en render es más corta y deja
  un solo adaptador, como pide la regla 4.
- **`AppleMaps.MapColorScheme.AUTOMATIC`**: seguiría al sistema y no a la
  preferencia de la app (D3).
- **`compassEnabled: false`**: sin pedirlo nadie (D2).
- **Aceptar HEIC en `media.ts` y en el backend**: el humano eligió
  «Convertir a JPEG», y habría que tocar el DTO, el `ContentType` de S3 y el
  render en Android.
- **Textos de permiso en `ios.infoPlist` a mano**: no quitan las claves que
  inyectan los plugins (D5).
- **Quitar el plugin de `expo-secure-store`**: el plugin sigue haciendo
  falta; solo sobra su texto de Face ID.
- **Un segundo `console.warn` para iOS**: rompería tres cuentas existentes
  (D7).
- **Variable de EAS con visibilidad `secret`**: EAS CLI no la ve en local
  (D10).
- **Team ID real en el repo desde el primer commit**: el humano aún no lo ha
  dado y el test lo tolera (D9).
- **`ForceType application/json` sin `<Files>`**: cambiaría el tipo de todo
  `.well-known/` (D8).
- **Añadir `"image": "latest"` o `appVersionSource` a `eas.json` por si
  acaso**: sin evidencia de fallo (D12).
- **Partir la feature en mapa, config y Universal Links**: cada parte
  necesitaría su build de iOS y su gate (D13).
- **Asertar el bundle contra `appJson.expo.ios.bundleIdentifier`**: un
  candado que compara producción consigo misma pasa con cualquier valor.
  Los esperados son literales.

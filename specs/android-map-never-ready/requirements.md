---
feature: "android-map-never-ready"
status: approved     # draft | approved
tags: [harness, spec, mobile]
---

# Requisitos — [[android-map-never-ready]]

> Notación EARS. Cada requisito tiene id único R<n>, inmutable una vez
> aprobado. Ver [[design]] (D1–D9) para las decisiones y la evidencia que las
> sostiene. Aplican `docs/conventions.md` (§Convenciones de la app móvil,
> tests que nombran su R-id, commit `feat(<scope>): <desc> (R<n>)`) y
> `docs/ui-guidelines.md` (C8). Feature de **UI móvil + configuración de
> build**: no toca `backend-pet-tracker/`, así que las capas
> domain/application/infrastructure de `docs/architecture.md` no entran en
> juego (C3 no aplica).
>
> Todo el §Contexto fijo se verificó el 2026-08-28 leyendo el código real y
> `mobile-pet-tracker/node_modules/` (Expo SDK 57.0.14, RN 0.86.2,
> `react-native-maps@1.27.2`, `@expo/config-plugins`, `@expo/prebuild-config`,
> `jest-expo@57.0.4`) y los docs versionados
> https://docs.expo.dev/versions/v57.0.0/sdk/maps/ — nunca `latest`.

## Skills cargadas

- `expo:expo-overview` — **cargada**. Su regla de routing manda leer los docs
  versionados `docs.expo.dev/versions/v57.0.0/`; se siguió (§Contexto fijo,
  D2 y D3 de [[design]] citan esa página).
- `docs/ui-guidelines.md` §Skills **no tiene fila para "mapas"**. La tabla
  deriva a `expo-native-ui` para estilo nativo; esta spec no escribe estilo
  nuevo (el mapa ocupa `flex: 1` y la tarjeta superpuesta no se toca), así
  que **no** se cargó. Quien implemente **sí** debe cargar `expo-overview` y,
  si toca el layout de la pantalla, `expo-native-ui`.
- **No existe skill de `expo-maps`** en el plugin `expo` v1.12.0 (ni en
  Claude Code ni en el plugin de Codex): la única fuente es la página
  versionada de los docs. Queda dicho explícitamente en vez de fingir
  cobertura.

## Contexto fijo (no reabrir)

### El diagnóstico está cerrado — es la SurfaceView, no el ciclo de vida

El tab Map solo pinta el watermark "Google": sin tiles, sin marker y sin
polyline, igual en claro y en oscuro. El discriminador en dispositivo
(`progress/discriminador_android-map-never-ready.md`, ejecutado por el humano
el 2026-08-28) devolvió:

| Sonda | Resultado |
|---|---|
| `onMapReady` → `console.log` en logcat | **dispara** |
| `googleRenderer="LEGACY"` | no pinta |
| `liteMode` | **sí pinta** |

Conclusión: el ciclo de vida corre entero, `state.isReady` es `true` y los
hijos (`Marker`, `Polyline`) **sí** se montan en el árbol de React. Lo que
falla es que **la `SurfaceView` del mapa no se compone en la jerarquía de
Fabric** (RN 0.86.2, arquitectura nueva): en `liteMode` el mapa es un bitmap
dentro de la jerarquía de vistas normal y se ve; en modo normal vive en su
propia `SurfaceView` y esa no se compone. El watermark encaja porque lo
dibuja la vista contenedora, no la superficie GL.

Queda **descartado con evidencia** y no se reabre: la clave de Maps (#52, el
`grep` de la meta-data da 1 y no hay `Authorization failure`), la versión del
paquete, el `provider`, el renderer, `customMapStyle`, el backend
(`GET /positions/last` responde 200) y la hipótesis H1 de ciclo de vida a
medias del informe del explorer.

`react-native-maps@1.27.2` **no expone** `androidLayerType`, `zOrderOnTop` ni
opción de `TextureView` (`grep` sobre `src/MapView.tsx`, `src/specs/` y
`android/src/main/java/com/rnmaps/`, sin resultados): **no hay prop de
escape**.

### La decisión ya la tomó el humano: se migra a `expo-maps`

`expo-maps` monta el mapa sobre **Jetpack Compose**, un backing de vista
distinto, y por eso esquiva el problema de composición de la `SurfaceView`.
La alternativa (parche nativo de `react-native-maps` vía `bun patch`) queda
descartada en [[design]] §D1. **Esta spec no es comparativa**: implementa la
migración.

### Riesgo asumido y vía de vuelta

Los docs v57 dicen literalmente: *"This library is currently in **alpha** and
will frequently experience breaking changes."* El humano **aceptó ese riesgo
el 2026-08-28**, con los ojos abiertos: la alternativa era un parche nativo
sobre una librería de terceros que hay que revalidar en cada bump y que el
propio discriminador dejó sin causa que parchear.

**Vía de vuelta**, si `expo-maps` resulta inviable en un bump futuro: revertir
los commits de esta feature devuelve `react-native-maps@1.27.2`, la tupla
`['react-native-maps', { androidGoogleMapsApiKey }]` en `app.config.ts`,
`src/theme/map-style-dark.json` y los testIDs `map-marker` / `map-route-<i>`.
El estado al que se vuelve **sigue teniendo el bug** de esta feature (mapa en
blanco con watermark en Android): revertir es una salida de emergencia ante un
fallo peor, no un arreglo.

### El mecanismo de la clave de Maps cambia — y funciona porque se desinstala `react-native-maps`

Verificado leyendo `node_modules/`, no de memoria:

- Los docs v57 de `expo-maps` dicen: *"Copy your API Key into your app.json
  under the `android.config.googleMaps.apiKey` field."*
- Ese campo lo consume
  `@expo/config-plugins/build/android/GoogleMapsApiKey.js`
  (`getGoogleMapsApiKey` lee `config.android?.config?.googleMaps?.apiKey` y
  `setGoogleMapsApiKey` escribe la meta-data `com.google.android.geo.API_KEY`).
- `@expo/prebuild-config` registra ese plugin **solo** como *fallback* del
  plugin legacy de `react-native-maps`
  (`build/plugins/unversioned/react-native-maps.js:45`), y ese legacy corre
  **siempre** desde `withUnversionedPackages`
  (`build/plugins/withDefaultPlugins.js:171-173`).
- `createLegacyPlugin.js` decide: si `config._internal.autolinkedModules`
  **no** incluye `react-native-maps` (`isModuleExcluded`), corre el
  **fallback**; si lo incluye, resuelve el `app.plugin.js` del propio paquete.

Por eso `android.config.googleMaps.apiKey` **no servía en #52** (con
`react-native-maps` instalado gana su `app.plugin.js`, que sin props borra la
meta-data) y **sí sirve aquí**: al desinstalar `react-native-maps` el módulo
deja de estar autolinkado, el fallback corre y el campo se escribe. Es decir:
**quitar `react-native-maps` no es opcional, es parte del mecanismo de R5.**

El requisito duro heredado de #52 R3 **no se rompe**: la clave sigue viniendo
de `process.env.GOOGLE_MAPS_API_KEY_ANDROID`, `.env.example` sigue trayendo
solo el nombre vacío, la variable **no** lleva prefijo `EXPO_PUBLIC_` y nada
con forma de credencial entra al repo. La comprobación sigue siendo
`grep -c "com.google.android.geo.API_KEY" android/app/src/main/AndroidManifest.xml`
→ `1`.

### Los tests de Jest NO pueden probar este bug. Nunca.

`src/app/(tabs)/__tests__/map.test.tsx:71-79` mockea `react-native-maps`
entero con un `<View>` stub, y **tiene que hacerlo**: jest-expo corre en Node,
sin Play services, sin `GoogleMap` y sin superficie GL. Consecuencia que hay
que decir en voz alta:

> **La suite del tab Map pasa HOY, verde, con el bug presente.** Un test verde
> aquí no es señal de que el mapa pinte. Ningún test de esta feature —
> ninguno — ejecuta código nativo, compone una `SurfaceView` ni prueba que se
> vean tiles.

Lo que los tests **sí** fijan, y por eso tienen R-id: el contrato JS del
wrapper (R1), la cámara y su zoom (R2), la derivación de marker y polylines
desde los datos (R3), el mapeo tema → `colorScheme` (R4) y la inyección de la
clave en la config resuelta (R5). Todo eso es regresión real: rojo de verdad
si alguien borra el prop. **La única verificación del bug es R8, el smoke
humano.**

### Jest corre como iOS

`@react-native/jest-preset` fija `haste.defaultPlatform: 'ios'` y
`mobile-pet-tracker/package.json` usa el preset raíz `jest-expo` (no el
`universal`), así que **toda la suite se ejecuta con `Platform.OS === 'ios'`**.
Verificado ejecutando el preset. Esto decide D5 de [[design]]: el wrapper
**no** ramifica por plataforma, porque si lo hiciera los tests probarían la
rama que el dispositivo nunca ejecuta.

### Deriva documental que esta feature está obligada a cerrar

`docs/ui-guidelines.md:95` sigue diciendo *"Todo debe correr en Expo Go SDK 57
(runtime de smoke del humano) — nada que exija dev build"*, y `docs/`
`ui-guidelines.md:77` fija *"Mapa dark: `customMapStyle` con
`src/theme/map-style-dark.json`"*. `expo-maps` **no corre en Expo Go** (docs
v57: *"It is not available in the Expo Go app – use development builds"*) y
esta feature borra ese JSON. Sin actualizar la carta, el reviewer rechaza por
C8 — por eso R6 es requisito, no cortesía.

## Requisitos funcionales

- **R1**: WHEN el tab Map necesita pintar un mapa THE SYSTEM SHALL hacerlo a
  través de un componente compartido **nuevo** en
  `mobile-pet-tracker/src/components/pet-map.tsx`, exportado como
  `export function PetMap(props: PetMapProps)`, cuya interfaz pública es
  exactamente:

  ```ts
  export type MapCoordinates = { latitude: number; longitude: number };
  export type MapPolyline = { id: string; coordinates: MapCoordinates[] };
  export type PetMapProps = {
    center: MapCoordinates;
    marker: MapCoordinates | null;
    polylines: MapPolyline[];
    colorScheme: 'light' | 'dark';
  };
  ```

  AND `PetMap` SHALL renderizar `GoogleMaps.View` de `expo-maps` con
  `testID="map-view"` y `style={{ flex: 1 }}` (mismos dos valores que hoy, para
  que la suite existente siga localizando el mapa), AND
  `mobile-pet-tracker/src/app/(tabs)/map.tsx` SHALL renderizar
  `<PetMap key={selectedPetId} … />` y SHALL NOT importar nada de `expo-maps`
  ni de `react-native-maps` (el `key={selectedPetId}` se conserva: es lo que
  remonta el mapa y lo recentra al cambiar de mascota — [[design]] §D4).
  *Test: `mobile-pet-tracker/src/components/__tests__/pet-map.test.tsx`
  (NUEVO) → `describe('R1: PetMap renderiza la vista de expo-maps con el contrato del tab Map', ...)`
  — mockea `expo-maps` (ver [[design]] §D7), renderiza `PetMap` y assertea
  `testID`, `style` y que la vista recibida es la de `GoogleMaps`. ROJO
  primero.*

- **R2**: WHEN `PetMap` recibe un `center` THE SYSTEM SHALL pasar a la vista
  nativa `cameraPosition={{ coordinates: center, zoom: MAP_ZOOM }}` con
  `MAP_ZOOM` exportado desde `src/components/pet-map.tsx` y con valor **`16`**,
  AND SHALL NOT pasar `initialRegion`, `latitudeDelta`, `longitudeDelta` ni
  ninguna otra prop de región (`expo-maps` no tiene deltas). La equivalencia
  está justificada por escrito en [[design]] §D4 (0.01° de latitud ≈ 1113 m
  sobre un mapa a pantalla completa de ~800 dp ⇒ z ≈ 16.7, redondeado a 16
  para que la polyline del día quepa). `MAP_ZOOM` es la **única** perilla de
  encuadre del mapa: si el smoke R8 lo ve demasiado cerca o demasiado lejos,
  se ajusta ese número y nada más.
  *Test: mismo archivo → `describe('R2: la cámara se fija con MAP_ZOOM en vez de deltas', ...)`
  — assertea `cameraPosition` completo contra un `center` conocido,
  `MAP_ZOOM === 16` importado del módulo, y que las props de la vista **no**
  contienen `initialRegion` ni `latitudeDelta`. ROJO primero.*

- **R3**: WHEN hay una última posición THE SYSTEM SHALL pasar
  `markers={[{ id: 'last-position', coordinates: { latitude, longitude } }]}`;
  IF no hay última posición (`position === null`) THEN THE SYSTEM SHALL pasar
  `markers={[]}`; AND WHEN la ruta del día trae viajes THE SYSTEM SHALL pasar
  un elemento de `polylines` por viaje, en el mismo orden, con
  `id: 'trip-<trip.index>'` y `coordinates` mapeadas de
  `{ lat, lng }` → `{ latitude, longitude }`, AND WHILE la ruta esté pendiente,
  vacía o en error THE SYSTEM SHALL pasar `polylines={[]}` sin afectar al
  marker ni a las stats. La derivación desde los tipos de API vive en
  `map.tsx` (que conoce `TripDetail`); `PetMap` solo traduce a la forma de
  `expo-maps` ([[design]] §D6).
  *Tests, ambos ROJO primero:*
  *(a) `src/components/__tests__/pet-map.test.tsx` →
  `describe('R3: marker y polylines llegan a la vista como arrays', ...)`
  — casos `marker: null` → `markers: []`, marker presente → un elemento con
  `id: 'last-position'`, y dos polylines conservando orden, `id` y
  `coordinates` (el `color` solo se assertea como `expect.any(String)`,
  [[design]] §D8).*
  *(b) `src/app/(tabs)/__tests__/map.test.tsx` → **conservando intactos los
  nombres de los `describe` existentes** `'R6: mapa y marker con la última
  posición'` y `'R7: ruta del día como polylines'` (los referencian
  `specs/mobile-map-live/traceability.md` y `specs/mobile-figma-polish/traceability.md`),
  se reescriben sus `it` para assertear las props `cameraPosition`,
  `markers` y `polylines` de `map-view` en vez de los testIDs
  `map-marker` / `map-route-<i>`, que **dejan de existir** porque dejan de ser
  componentes hijos; los `it` reescritos se renombran para nombrar este
  requisito, con el patrón que ya usa el archivo (`it('R7 (mobile-design-drift): …')`):
  `it('R3 (android-map-never-ready): …')`.*

- **R4**: WHILE el tema de la app es oscuro THE SYSTEM SHALL mostrar el mapa
  en oscuro, y WHILE es claro THE SYSTEM SHALL mostrarlo en claro. El
  mecanismo elegido es el `colorScheme` nativo de `expo-maps`
  (`GoogleMapsColorScheme.DARK` / `.LIGHT`, valores literales `'DARK'` /
  `'LIGHT'`), derivado de `useUniwind().theme` en `map.tsx` y pasado a
  `PetMap` como `colorScheme`; **no** se usa `properties.mapStyleOptions`
  ([[design]] §D3). En consecuencia
  `mobile-pet-tracker/src/theme/map-style-dark.json` **se borra** y no queda
  ningún importador (C7), AND SHALL NOT usarse `FOLLOW_SYSTEM`: el tema de
  esta app es una preferencia guardada del usuario (`Uniwind.setTheme` desde
  el tab Profile), no la apariencia del sistema, y `FOLLOW_SYSTEM`
  desincronizaría el mapa del resto de la pantalla.
  *Tests, ambos ROJO primero:*
  *(a) `src/components/__tests__/pet-map.test.tsx` →
  `describe('R4: el tema decide el colorScheme del mapa', ...)`
  — `colorScheme: 'dark'` → prop `'DARK'`; `'light'` → `'LIGHT'`.*
  *(b) `src/app/(tabs)/__tests__/map.test.tsx` → **conservando el nombre** del
  describe existente `'R7 (mobile-figma-polish): mapa adapta su base al tema'`,
  se reescriben sus dos `it` (que hoy assertean `customMapStyle`) para
  assertear `colorScheme`, renombrados a
  `it('R4 (android-map-never-ready): …')`.*

- **R5**: WHEN Expo resuelve la config de la app (`npx expo config`,
  `prebuild`, `run:android`, `start`) AND `GOOGLE_MAPS_API_KEY_ANDROID` está
  definida con valor no vacío THE SYSTEM SHALL devolver una `ExpoConfig` que
  (a) conserve todas las claves de `mobile-pet-tracker/app.json` — incluidas
  `android.package` = `com.trackermex.pettracker`, `android.adaptiveIcon`,
  `android.predictiveBackGestureEnabled` y las tres entradas actuales de
  `plugins` (`expo-router`, la tupla de `expo-splash-screen`,
  `expo-secure-store`) —, (b) fije
  `android.config.googleMaps.apiKey` con el valor de la variable tras
  `trim()`, y (c) **no** declare ninguna entrada `react-native-maps` ni
  `expo-maps` en `plugins` (el plugin de `expo-maps` solo aporta permisos de
  ubicación, que esta app no usa — [[design]] §D2).
  IF la variable falta, está vacía o es solo espacios THEN THE SYSTEM SHALL
  seguir devolviendo la config base sin `android.config.googleMaps`, emitir
  **un** `console.warn` que nombre `GOOGLE_MAPS_API_KEY_ANDROID` y remita a
  `docs/verification.md`, y SHALL NOT lanzar (requisito heredado de #52 R2:
  el primer `prebuild` sin clave tiene que poder correr).
  AND `mobile-pet-tracker/.env.example` SHALL quedar **sin modificar**, con
  `GOOGLE_MAPS_API_KEY_ANDROID=` sin valor y sin prefijo `EXPO_PUBLIC_`.
  *Test: `mobile-pet-tracker/app.config.test.ts` → **conservando el nombre**
  del `describe('R1: la config resuelta inyecta la clave de Android desde el entorno')`
  (lo referencia `specs/android-maps-api-key/traceability.md`), se reescribe
  su único `it` a
  `it('R5 (android-map-never-ready): fija android.config.googleMaps.apiKey y no declara plugin de mapas', ...)`
  — assertea (a) con `toMatchObject` sobre `app.json`, (b)
  `resolved.android?.config?.googleMaps?.apiKey === 'test-key'` con entrada
  `'  test-key  '`, y (c) `resolved.plugins` `toEqual(appJson.expo.plugins)`.
  ROJO primero. Los `describe` `'R2: …'` y `'R3: …'` del mismo archivo
  **no se tocan y deben seguir verdes**: son la garantía de que el aviso sin
  clave y el contrato de `.env.example` sobreviven a la migración. Además se
  añade una nota de una línea en `specs/android-maps-api-key/traceability.md`
  (fila R1) diciendo que el mecanismo lo sustituye #54 R5 y que el requisito
  de fondo — la clave viene del entorno — sigue vigente.*

- **R6**: WHEN el implementer cierra la feature THE SYSTEM SHALL dejar la
  documentación coherente con la migración:
  1. `docs/ui-guidelines.md:95` deja de exigir Expo Go y pasa a decir que el
     runtime de smoke es el **dev build de Android** (desde 2026-08-27) y que
     `expo-maps` no corre en Expo Go.
  2. `docs/ui-guidelines.md:77` (§9 Tema) sustituye *"Mapa dark:
     `customMapStyle` con `src/theme/map-style-dark.json`"* por el
     `colorScheme` de `expo-maps` vía `src/components/pet-map.tsx`.
  3. `docs/ui-guidelines.md` §4 (Componentes compartidos) añade
     `pet-map.tsx` a la lista, con su rol en una línea.
  4. `docs/ui-guidelines.md` §5 añade una frase que aclare que el default
     `@expo/ui/community/*` **se mantiene** pese a que la premisa de Expo Go
     ya no aplica (funciona en ambos runtimes); revisar esa decisión es otra
     feature y **no** se re-litiga aquí.
  5. `docs/verification.md` §Feature 52 — nota de que desde #54 la clave
     viaja por `android.config.googleMaps.apiKey`; el `grep` de la meta-data
     y el resto del runbook no cambian.
  6. `docs/verification.md` gana una sección
     `### Feature 54 — android-map-never-ready` con el runbook literal del
     smoke de R8.
  *Sin test (documentación). Verificación: el reviewer comprueba los seis
  puntos y que no queda ninguna mención viva a `customMapStyle`,
  `map-style-dark.json` o "todo debe correr en Expo Go" en `docs/`.*

- **R7**: WHEN se ejecutan `bun run typecheck`, `bun run lint` y
  `bun run test` en `mobile-pet-tracker/` y `./init.sh` en la raíz tras los
  cambios THE SYSTEM SHALL salir con exit 0 y con **todas** las suites
  existentes verdes, sin borrar ni desactivar ningún test previo. En concreto:
  - `mobile-pet-tracker/package.json` SHALL declarar `"expo-maps": "~57.0.1"`
    y SHALL NOT declarar `react-native-maps`;
    `grep -rn "react-native-maps" src/ app.config.ts app.config.test.ts package.json`
    SHALL no devolver nada, y `src/theme/map-style-dark.json` SHALL no existir
    (C7: nada huérfano de la implementación que se reemplaza).
  - Los testIDs `screen-map`, `map-loading`, `map-error`, `map-retry`,
    `map-no-pets`, `map-no-tracking`, `map-empty`, `map-empty-overlay`,
    `map-stats`, `stat-speed`, `stat-distance`, `stat-updated`, `stat-gps`,
    `lost-mode-button` y `lost-mode-error` SHALL seguir existiendo con el
    mismo comportamiento: **`lost-mode-button` es de #45 `pet-lost-mode`, ya
    está en `main` y no se puede romper**. Los describes
    `'R4: map resuelve la mascota seleccionada'`, `'R5: mascota free degrada
    sin mapa'`, `'R8: stats calculadas de positions y trips'`, `'R9: polling
    con foco'`, `'R6: owner toglea lost mode contra el endpoint'` y
    `'R7: no-owner deshabilitado y error visible'` SHALL quedar **sin tocar**.
  - Los únicos testIDs que desaparecen SHALL ser `map-marker` y
    `map-route-<i>` (R3), y su desaparición SHALL quedar registrada en
    `progress/impl_android-map-never-ready.md`.
  - Grep-clean C8 SHALL seguir limpio: cero hex fuera de `src/theme/`, cero
    clases arbitrarias `[...]`, cero `StyleSheet.create`, cero
    shadow/elevation legacy. El color de la polyline sale de `useThemeColors`,
    nunca de un hex literal ([[design]] §D8).
  - **Allowlist**: el diff SHALL tocar SOLO
    `mobile-pet-tracker/package.json`, `mobile-pet-tracker/bun.lock`,
    `mobile-pet-tracker/app.config.ts`,
    `mobile-pet-tracker/app.config.test.ts`,
    `mobile-pet-tracker/src/components/pet-map.tsx` (nuevo),
    `mobile-pet-tracker/src/components/__tests__/pet-map.test.tsx` (nuevo),
    `mobile-pet-tracker/src/app/(tabs)/map.tsx`,
    `mobile-pet-tracker/src/app/(tabs)/__tests__/map.test.tsx`,
    `mobile-pet-tracker/src/theme/map-style-dark.json` (BORRADO),
    `docs/ui-guidelines.md`, `docs/verification.md`,
    `specs/android-map-never-ready/**`,
    `specs/android-maps-api-key/traceability.md` (la nota de una línea de R5),
    `progress/**` y `feature_list.json`.
    AND `mobile-pet-tracker/app.json`, `mobile-pet-tracker/eas.json`,
    `mobile-pet-tracker/.env.example`, `mobile-pet-tracker/.gitignore`, el
    resto de `mobile-pet-tracker/src/**`, `backend-pet-tracker/**`,
    `infra/**`, `.github/**`, `docs/architecture.md` y `docs/conventions.md`
    SHALL quedar sin cambios.
  *Verificación: el implementer anota los comandos y su salida en
  `progress/impl_android-map-never-ready.md`; el reviewer los re-ejecuta y
  corre `git diff --stat main...HEAD` contra esa allowlist. Sin test propio.*

## Prueba de humo del humano

- **R8**: WHEN el humano, con `mobile-pet-tracker/.env` conteniendo
  `GOOGLE_MAPS_API_KEY_ANDROID` y `EXPO_PUBLIC_API_URL` con su IP LAN, y el
  backend local arriba (`docker compose up -d` +
  `pnpm -C backend-pet-tracker run start:dev`), regenera e instala el dev
  build:

  ```bash
  cd mobile-pet-tracker
  npx expo prebuild --clean --platform android
  grep -c "com.google.android.geo.API_KEY" android/app/src/main/AndroidManifest.xml
  bunx expo run:android
  ```

  1. El `grep` imprime `1` (sin pegar el valor en ningún reporte).
  2. Login → tab **Map** con una mascota premium que tenga última posición y
     al menos un viaje del día. En **tema claro**, confirmación **explícita**
     de las tres cosas, por separado:
     - **tiles**: se ven calles y etiquetas del mapa, no solo el fondo con el
       watermark "Google";
     - **marker**: el pin sobre la última posición;
     - **polyline**: la traza del día.
  3. Desde el tab **Profile**, cambiar a **tema oscuro** y volver al tab Map:
     el mapa se ve oscuro **y** siguen viéndose tiles, marker y polyline.
  4. `adb logcat` sin `Authorization failure`, sin
     `API_KEY_ANDROID_APP_BLOCKED` y sin excepciones de `expo-maps`.
  5. La tarjeta de stats y el botón **Lost Mode** siguen funcionando encima
     del mapa (no-regresión de #45).

  **"Monta sin crash y hay watermark" NO cierra este requisito**: ese es
  exactamente el estado defectuoso que la feature arregla, y fue el criterio
  con el que se cerró #52 R6. Hace falta la confirmación explícita de los
  tres elementos, en los dos temas.

  Si el encuadre se ve demasiado cerca o demasiado lejos, la perilla es
  `MAP_ZOOM` (R2) y solo esa; ajustarla no reabre el diseño.

  **Este requisito SOLO lo cierra el humano** (requiere dispositivo real y un
  dev build; ninguna IA puede verificarlo). Registra el resultado en
  `progress/impl_android-map-never-ready.md`, sin la clave.

## Fuera de alcance

- **iOS**. `PetMap` renderiza `GoogleMaps.View` en **toda** plataforma, sin
  rama `Platform.OS` y sin `AppleMaps.View`. Razones, en [[design]] §D5: el
  proyecto solo compila y verifica Android desde 2026-08-25, y jest corre con
  `Platform.OS === 'ios'`, así que una rama por plataforma haría que los tests
  probaran justo la rama que el dispositivo nunca ejecuta. Consecuencia
  aceptada y escrita: **`expo run:ios` queda sin mapa funcional** hasta que
  iOS entre en alcance con su propio smoke; el wrapper es el único archivo que
  habría que tocar entonces.
- **Parchear `react-native-maps`** (`bun patch` sobre
  `attachLifecycleObserver`): el discriminador descartó H1; no hay ciclo de
  vida que arreglar.
- **Bumpear `react-native-maps` a 1.29.0**: ninguna release note posterior a
  1.27.2 toca la composición de la superficie, y saldría de
  `bundledNativeModules.json`. Además el paquete se desinstala.
- **Migrar `map.tsx` a `src/screens/map/`** (convención #39): #39 no migra
  pantallas en frío y mezclarlo aquí ensucia el diff de una feature que ya
  reescribe medio archivo de tests.
- **Rediseñar la pantalla**: la tarjeta de stats, el overlay vacío, el botón
  Lost Mode, los estados de carga/error y las dimensiones no cambian.
- **Marker personalizado, callouts, clustering, gestos de cámara, controles
  de mapa y `properties` de `expo-maps`** (tráfico, edificios, brújula):
  nada de eso existe hoy; añadirlo es otra feature.
- **Permisos de ubicación / mostrar la posición del usuario**: la app nunca
  los pidió por sí misma (los aportaba de rebote el plugin legacy de
  `react-native-maps`) y el mapa no dibuja la posición del dispositivo. Por
  eso **no** se declara el plugin `expo-maps` en `plugins`.
- **Revisar la decisión `@expo/ui/community/*`** de `docs/ui-guidelines.md`
  §5 ahora que la premisa de Expo Go cae: R6 punto 4 solo deja constancia; el
  cambio de default, si procede, es su propia entrada de backlog.
- **Clave de Google Maps para iOS**, `eas build` y el plumbing de
  `eas env:create`: igual que en #52, documentado allí, no implementado.
- **Crear, restringir o rotar la clave** en Google Cloud: gate humano, ya
  hecho en #52.

## Aprobación

- [X] Aprobado por humano (fecha: 2026-08-28) ← gate obligatorio antes de implementar
- [ ] R8 smoke en dev build de Android, en ambos temas, con tiles + marker +
      polyline confirmados (fecha: ____) ← gate obligatorio antes de `done`

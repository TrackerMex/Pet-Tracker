# explore: android-map-never-ready
Fecha: 2026-08-28T19:06:55+00:00
Feature: #54 (`feature_list.json[53]`, status `pending`, P1)
Alcance: solo lectura. No se tocó código de la app ni `backend-pet-tracker/`.

## Skills

- `expo:expo-overview` — **cargada correctamente**. Su regla de routing manda
  leer los docs versionados (`docs.expo.dev/versions/v57.0.0/`), no `latest`;
  se siguió (ver §expo-maps).
- La tabla de `docs/ui-guidelines.md` §Skills **no tiene fila para "mapas"**.
  La más cercana es `expo-native-ui` (estilo nativo). No la cargué porque esta
  investigación no escribe UI; el `spec_author` y quien implemente sí deben
  cargarla, y además `expo-dev-client` si el fix toca el build nativo.
- Deriva documental detectada: `docs/ui-guidelines.md:95` sigue diciendo *"Todo
  debe correr en Expo Go SDK 57 (runtime de smoke del humano)"* y §5 razona
  sobre crashes de Expo Go. El smoke real es **dev build de Android** desde el
  2026-08-27 (#52 entero se verifica con `expo prebuild` + `expo run:android`).
  Esto **bloquea la opción (b)**: `expo-maps` no existe en Expo Go. Si se elige
  (b), la carta hay que actualizarla en el mismo cierre.

---

## Contexto encontrado

### 1. La cadena del ticket, verificada línea a línea

Rutas relativas a `mobile-pet-tracker/node_modules/react-native-maps/`.

| Eslabón | Fichero:línea | Verificado |
|---|---|---|
| `state.isReady` arranca en `false` | `src/MapView.tsx:806` | ✅ |
| Hijos (`Marker`/`Polyline`) solo si `isReady` | `src/MapView.tsx:1225` (`const childrenNodes = this.state.isReady ? children : null`) | ✅ |
| `isReady` solo lo pone `_onMapReady` | `src/MapView.tsx:817-823`, enganchado como prop `onMapReady` en `:1182` | ✅ |
| El branch `PROVIDER_GOOGLE` es solo iOS | `src/MapView.tsx:1227` (`provider === 'google' && Platform.OS === 'ios'`) | ✅ |
| Android va por Fabric puro, no por interop | `src/specs/NativeComponentMapView.ts:1127-1128` → `codegenNativeComponent('RNMapsMapView')`, que casa con `REACT_CLASS` de `android/.../com/rnmaps/fabric/MapViewManager.java:180` | ✅ |
| El nativo despacha `OnMapReadyEvent` | `android/.../maps/MapView.java:535` — **el ticket dice `:549`, que es el `OnMyLocationChangeListener`. Corregir en la spec.** | ⚠️ corregido |
| `onMapReady(GoogleMap)` | `android/.../maps/MapView.java:470` | ✅ |
| `getMapAsync` se pide en el constructor | `android/.../maps/MapView.java:260` (`super.getMapAsync(this)`) — **matiz que el ticket no recoge**: la callback queda encolada desde la construcción; solo se entrega cuando el delegate de GMS existe, y el delegate lo crea `onCreate` | ✅ |
| El observer es la ÚNICA fuente de `onCreate/onStart/onResume` | `android/.../maps/MapView.java:206-254` (`DefaultLifecycleObserver`), enganchado en `:390-397` | ✅ |
| Enganche condicionado a `getCurrentActivity() instanceof LifecycleOwner` | `android/.../maps/MapView.java:391-392` | ✅ |
| Rescate de `onAttachedToWindow` solo si `savedMapState != null` | `android/.../maps/MapView.java:328-346` | ✅ |
| `savedMapState` solo se escribe si el mapa YA estuvo listo | `android/.../maps/MapView.java:354-359` (`if (map != null && isMapReady)`) | ✅ |

**No hay camino alternativo.** `grep -rn "LifecycleEventListener\|onHostResume\|LifecycleOwner\|findViewTreeLifecycleOwner"` sobre todo
`android/src/main/java/com/rnmaps/` devuelve **solo** `maps/MapView.java`. Ni
`com.rnmaps.fabric.MapViewManager` ni `MapModule` ni el interop layer arrancan
el ciclo de vida. Es decir: **la forma de la cadena del ticket es correcta**.

Dos aclaraciones sobre por qué NO se está tomando otro camino:

- `com.rnmaps.fabric.MapViewManager.createViewInstance` (`:162-177`) construye
  `new MapView(reactContext, options)` → constructor `:256`, que guarda
  `this.context = context` (un `ThemedReactContext` real).
- El constructor legacy `:312-317` hace `this(null, googleMapOptions)`, o sea
  **pasa `context = null`**. Si el render fuese por el `MapManager` de paper,
  `attachLifecycleObserver()` reventaría con NPE en `:391`. No hay crash ⇒
  **confirmado que se está en el camino Fabric**, no en el interop.

### 2. Los tres "hechos" de logcat del ticket, reinterpretados

- **`Could not find generated setter` x12** — confirmado inocuo, y verificado
  contra la fuente de RN, no de memoria:
  `node_modules/react-native/ReactAndroid/src/main/java/com/facebook/react/uimanager/ViewManagerPropertyUpdater.kt:138`
  lo emite cuando no existe la clase `$$PropsSetter` generada, y cae al
  `FallbackViewManagerSetter` de `:107`. rnmaps no pasa el annotation processor.
  Ruido, no fallo. ✅ el ticket acierta.
- **`MapsInitializer` + versión del renderer** — **el ticket lo lee mal como
  "la vista nativa se construye"**. Ese log lo produce
  `fabric/MapViewManager.java:262-269` (`MapsInitializer.initialize(...)` +
  `Log.d("AirMapRenderer", ...)`), invocado desde `optionsForInitialProps`
  (`:94`) en `createViewInstance`, con un flag estático `rendererInitialized`.
  **Sale sí o sí al crear el primer MapView, haya corrido `onCreate` o no.**
  No es evidencia de nada sobre el ciclo de vida.
- **Rotar el dispositivo no lo arregla** — **esa evidencia es nula**:
  `app.json:6` fija `"orientation": "portrait"`. La Activity no se recrea, la
  vista no se re-attachea, el camino `:329` ni se intenta. No usar este dato
  como argumento en la spec.

### 3. El dato que rompe la hipótesis: el watermark

Este es el hallazgo principal del informe.

`com.rnmaps.maps.MapView extends com.google.android.gms.maps.MapView`
(`MapView.java:91`). react-native-maps **no tiene `res/`** en su proyecto
Android (`ls android/src/main/` → solo `AndroidManifest.xml`, `java`, `jni`):
el logo "Google" no lo dibuja rnmaps, lo dibuja el propio delegate de
play-services-maps 19.1.0 (`android/build.gradle:101`).

El delegate de GMS **no existe hasta que corre `onCreate`** — antes de eso el
`MapView` es un `FrameLayout` sin hijos. Por tanto:

> **watermark visible ⇒ `onCreate` corrió ⇒ el observer SÍ se enganchó ⇒
> `getCurrentActivity()` NO devolvió null.**

Y si `onCreate` corrió, `getMapAsync` (encolado en `:260`) entrega el mapa,
`onMapReady` (`:470`) corre, `dispatchEvent(OnMapReadyEvent)` (`:535`) sale, e
`isReady` pasa a `true` en JS. Es decir: la variante fuerte de la hipótesis del
ticket ("no hay observer, el mapa nunca arranca") **es incompatible con la
evidencia que el propio ticket registra**.

Queda viva una variante débil: que el `Lifecycle` de la Activity no estuviera
en `RESUMED` al momento del `addObserver` (`:394`), con lo que
`LifecycleRegistry` despacharía `ON_CREATE`/`ON_START` pero no `ON_RESUME` →
mapa creado (watermark ✔) pero **superficie GL nunca arrancada** (sin tiles,
sin marker, sin polyline ✔). Encaja con todo lo observado. No he podido
confirmarla ni descartarla en estático.

### 4. Por qué `getCurrentActivity()` null es improbable en esta app

Leído en la fuente de RN 0.86.2 instalada, no de memoria:

- `ThemedReactContext.getCurrentActivity()` solo delega:
  `react-native/ReactAndroid/src/main/java/com/facebook/react/uimanager/ThemedReactContext.kt:90`
  → `reactApplicationContext.getCurrentActivity()`.
- `ReactContext.getCurrentActivity()` (`.../bridge/ReactContext.java:518-523`)
  devuelve `mCurrentActivity.get()`.
- `mCurrentActivity` se **escribe** en `onHostResume(activity)`
  (`ReactContext.java:271-273`) y en `onNewIntent` (`:301`); solo se **borra**
  en `onHostDestroy()` (`:330`).

`attachLifecycleObserver()` corre desde `onAttachedToWindow`, o sea cuando el
usuario ya navegó al tab Map, con el host en `RESUMED` desde hace rato. Revisé
además el arranque de esta app buscando algo que retrasara o desviara la
Activity y **no encontré nada relevante**:

- `src/app/_layout.tsx:37` — `if (!themeReady) return <></>` retrasa TODO el
  árbol hasta que resuelve `getStoredTheme()`, pero eso ocurre en el arranque,
  mucho antes de montar el mapa, y no toca `mCurrentActivity`.
- `src/theme/theme-transition.ts` / `nitro-availability.ts` (#43) — solo se
  ejecutan al **cambiar** el tema (`useThemeTransition`), no en el montaje del
  mapa, y `hasNitroModules()` es una sonda de `TurboModuleRegistry.get`.
  Además el ticket ya descartó el tema como variable (el fallo es idéntico en
  claro y oscuro). **Descartado como causa.**
- `src/app/(tabs)/_layout.tsx` — `Tabs` de expo-router con
  `animation: 'fade'` y `tabBar` custom. Nada que despause la Activity.
- expo-dev-client está instalado, pero tras cargar el bundle la Activity
  anfitriona es la `MainActivity` normal (`ReactActivity` → `AppCompatActivity`
  → `LifecycleOwner`), así que el `instanceof` de `:392` se cumple.

**Conclusión: el eslabón "`getCurrentActivity()` devuelve null" es el más débil
de la cadena y no tengo ni una sola evidencia a favor.**

### 5. Issues conocidos: lo que se pudo y no se pudo verificar

Tengo red y busqué. **No existe un issue público que case con esta combinación
exacta** (react-native-maps 1.27.2 + RN 0.86.2 + SDK 57 + dev build + mapa en
blanco con watermark). Lo más cercano, y por qué no aplica:

- [#5161](https://github.com/react-native-maps/react-native-maps/issues/5161)
  "Map is not rendered properly on new architecture" — `onMapReady` no dispara
  y los markers no pintan con new arch. **Cerrado**, y es RN 0.72 / SDK 51 /
  rnm 1.14, y solo tras un reload (Ctrl+R), no en el primer render.
- [#5877](https://github.com/react-native-maps/react-native-maps/issues/5877)
  "[Android] Custom View markers broken with New Architecture on Expo SDK 54
  (RN 0.81)" — abierto, pero es sobre markers con hijos React, no sobre tiles.
- [#5888](https://github.com/react-native-maps/react-native-maps/issues/5888)
  "Google Maps blank in Expo Go" — SDK 55 + rnm 1.27.2, **pero es un fallo de
  clave para `host.exp.exponent` y solo en Expo Go; el reportante dice que en
  dev build funciona**. No es nuestro caso (aquí es dev build, sin
  `Authorization failure`).

Verificado en el registro npm: **`latest` de react-native-maps es 1.29.0**
(existen 1.28.0/1.28.1/1.28.2/1.29.0 posteriores a la 1.27.2 que trae SDK 57).
Leídas las release notes: **ninguna arregla el ciclo de vida**; lo único
adyacente es 1.28.1 *"android: fix ghost features on MapView"*, que toca la
misma zona de `savedFeatures`/`attacherGroup`. `peerDependencies` de 1.29.0:
`react-native >= 0.76.0`, así que 0.86.2 entra.

### 6. Estado del código de la app

- `src/app/(tabs)/map.tsx:170-200` — el `MapView` y la tarjeta de stats están
  en la misma rama `last.data?.kind === 'ok'`, tal como dice el ticket. La
  tarjeta es un hermano absoluto **fuera** del `MapView`, así que su render no
  prueba que el mapa esté vivo: solo prueba que la rama se evaluó.
- Props que se le pasan hoy: `key={selectedPetId}`, `testID="map-view"`,
  `style={{flex:1}}`, `initialRegion`, `customMapStyle`. Nada más. Sin
  `provider`, sin `googleRenderer`, sin `liteMode`, sin `onMapReady`.
- `app.config.ts` inyecta el plugin `react-native-maps` con
  `androidGoogleMapsApiKey`; sin la env var avisa y no aborta.
- No hay `patches/`, ni `postinstall`, ni infraestructura de parcheo. El
  gestor es **bun** (`bun.lock`, `eas.json` fija `"bun": "1.3.14"`).
- **No existe `expo patch`**: `node_modules/@expo/cli/build/src/` no tiene
  directorio `patch`. La herramienta real aquí es `bun patch` (+
  `patchedDependencies` en `package.json`), no `patch-package` ni `expo patch`.
  Corregir esto en la spec.
- `expo-maps` **no está instalado**; `bundledNativeModules.json` de SDK 57 lo
  fija en `~57.0.1`.

---

## Riesgos / ambigüedades

### D1 (bloqueante) — La causa raíz NO está establecida

La spec **no puede** partir de "getCurrentActivity() devuelve null": §3
muestra que el watermark contradice esa premisa. Hay dos familias vivas:

- **(H1) ciclo de vida a medias**: `onCreate`+`onStart` sí, `onResume` no →
  mapa creado, superficie nunca arrancada.
- **(H2) el mapa está listo y el problema es de render/composición**: la
  superficie GL del renderer "LATEST" de Play services no se compone bajo
  Fabric en este dispositivo, o los tiles no cargan por red. En H2, `isReady`
  ya es `true` y **parchear el ciclo de vida no arregla nada**.

**Discriminador, 1 línea, reversible, decide el 100% del diseño**: añadir
`onMapReady={() => console.log('[map] ready')}` al `MapView` de
`src/app/(tabs)/map.tsx:172` y mirar `adb logcat -s ReactNativeJS` al abrir el
tab.
- Dispara → **H2**. La hipótesis del ticket queda tumbada; parchear rnmaps es
  tiempo perdido.
- No dispara → **H1**, y entonces el parche tiene sentido.

Dos sondas más, gratis, sin tocar JS de producción (props ya soportados,
`src/MapView.tsx:228` y el spec de codegen `:499`):
- `googleRenderer="LEGACY"` → cambia el renderer de Play services. Si con eso
  pinta, es H2 puro y el fix es un prop, no un parche ni una migración.
- `liteMode` → el mapa se dibuja como bitmap estático en vez de superficie GL.
  Si en liteMode se ve y en normal no, es H2 (composición). Si tampoco se ve,
  H1.

**Esto tiene que ser el R1 de la spec, antes que cualquier fix.** Escribir el
fix antes del discriminador es apostar a cara o cruz con un dev build de por
medio en cada iteración.

### D2 — El criterio de aceptación 3 confunde medio con fin

`"El tema oscuro sigue aplicando customMapStyle"` describe un mecanismo de
react-native-maps. Si se va a `expo-maps` el mecanismo cambia
(`properties.mapStyleOptions.json`, o directamente
`colorScheme={GoogleMapsColorScheme.DARK}`, que es nativo y hace innecesario
`src/theme/map-style-dark.json`). El requisito debería redactarse como *"en
tema oscuro el mapa se ve oscuro"*, y decidir explícitamente si
`map-style-dark.json` sobrevive. **Decisión del `spec_author`.**

### D3 — El criterio de aceptación 4 pide cobertura que no existe

`"Test que cubra el render del MapView y sus hijos nombrando el R-id"`.
Ver §Tests: ese test **no puede** cubrir este bug. Redactado así, invita a
escribir un test verde que no prueba nada y a cerrar la feature en falso.

### D4 — Si se elige `expo-maps`, la carta de UI queda inconsistente

`docs/ui-guidelines.md:95` exige que todo corra en Expo Go. `expo-maps` no
corre en Expo Go (documentado en los docs v57). Hay que actualizar la carta en
el mismo cierre, o el reviewer rechaza por C8.

### D5 — `expo-maps` está en **alpha**

Los docs v57 lo dicen literal: *"Currently in alpha and will frequently
experience breaking changes"*. Meter una dependencia alpha en el camino
crítico de un P1 es una decisión de producto, no técnica. **Del humano.**

### D6 — Ninguna de las dos vías se puede verificar sin dispositivo

Ambas exigen `expo prebuild` + `expo run:android` + smoke humano. Ni Codex ni
yo podemos cerrar esta feature. El `spec_author` debe marcar el gate humano
como no delegable, igual que hizo #52.

---

## Recomendación

### Sobre las dos vías que pide el ticket

**(a) Parchear react-native-maps** — coste bajo, alcance estrecho.

- Mecanismo real: `bun patch react-native-maps` (no `expo patch`, no existe;
  no `patch-package`, no hay postinstall). Genera `patches/*.patch` +
  `patchedDependencies` en `package.json`, y bun 1.3.14 lo reaplica también en
  EAS Build.
- El parche mínimo **no** es "forzar `onCreate/onStart/onResume` en
  `onAttachedToWindow`" (eso arriesga un `onCreate` doble cuando el observer sí
  llega, y rompe pause/resume). El diff mínimo correcto es **una línea** en
  `attachLifecycleObserver()` (`MapView.java:391`): usar
  `findViewTreeLifecycleOwner()` como fallback cuando `getCurrentActivity()` no
  sirve — ComponentActivity lo publica en el árbol de vistas, así que se
  obtiene el mismo `LifecycleOwner` y se conserva el pause/resume correcto.
- Coste: ~1 línea + `bun patch` + prebuild + dev build + smoke. Sin
  dependencias nuevas. Sin tocar `map.tsx` ni un solo test.
- Riesgo: **solo sirve si el discriminador dice H1.** Si es H2, cero efecto.
  Y deja un parche que hay que revalidar en cada bump de rnmaps.

**(b) Migrar a `expo-maps` ~57.0.1** — coste alto, cubre H1 y H2.

Lo que hay que reescribir de `src/app/(tabs)/map.tsx`, prop a prop (API leída
en los docs v57.0.0, no de memoria):

| Hoy | Con expo-maps | Coste |
|---|---|---|
| `import MapView, {Marker, Polyline} from 'react-native-maps'` | `import {GoogleMaps} from 'expo-maps'` → `<GoogleMaps.View>` | `GoogleMaps.View` y `AppleMaps.View` tienen **props distintos**: hace falta un wrapper. Y `ui-guidelines.md` §8 prohíbe rutas con extensión de plataforma dentro de `src/app/` → el wrapper va a `src/components/` (p. ej. `pet-map.tsx`). **Componente nuevo.** |
| `initialRegion={{lat,lng,latitudeDelta:0.01,longitudeDelta:0.01}}` | `cameraPosition={{coordinates:{latitude,longitude}, zoom}}` | **No hay deltas.** Hay que convertir 0.01° a un `zoom` constante (~14-15) y fijarlo como decisión escrita. Cambia también la semántica de "initial" vs controlado; hoy se depende de `key={selectedPetId}` para recentrar. |
| `<Marker coordinate={...}/>` (hijo) | `markers={[{coordinates:{...}, id}]}` (prop array) | Deja de ser componente. **Sin hijos React en el marker** (solo `icon` vía `expo-image`); hoy no se usa custom marker, así que no bloquea. |
| `<Polyline coordinates={...}/>` x N trips | `polylines={[{coordinates, id, color, width}]}` | El `map()` sobre `route.data.trips` pasa de renderizar hijos a construir un array. Similar en tamaño. |
| `customMapStyle={mapStyleDark}` | `properties={{mapStyleOptions:{json: JSON.stringify(mapStyleDark)}}}` **o** `colorScheme={GoogleMapsColorScheme.DARK}` | Ver D2. La segunda opción borra `src/theme/map-style-dark.json`. |
| `key={selectedPetId}` | se puede mantener | Trivial. |
| Clave de Maps vía plugin `react-native-maps` en `app.config.ts` | `android.config.googleMaps.apiKey` en la config | **Reescribir `app.config.ts`** y el §Feature 52 de `docs/verification.md`. El `grep -c "com.google.android.geo.API_KEY"` sigue valiendo (misma meta-data). Nuevo prebuild obligatorio. |

Impacto en `src/app/(tabs)/__tests__/map.test.tsx` (716 líneas): **los testIDs
`map-marker` y `map-route-<i>` dejan de existir**, porque dejan de ser
componentes. Hay que reescribir:
- el mock de `react-native-maps` (`:65-73`) → mock de `expo-maps`;
- `map-marker`: `:341-344`, `:360`, `:473`, `:656`, `:672`;
- `map-route-0/1`: `:440-448`, `:461`, `:474`;
- `map-view` props: `initialRegion` → `cameraPosition` en `:330-340` y
  `:354-359`; `customMapStyle` → `properties`/`colorScheme` en `:393` y
  `:402-410`.
Sobreviven intactos `screen-map`, `map-loading`, `map-error`, `map-retry`,
`map-no-pets`, `map-no-tracking`, `map-empty`, `map-empty-overlay`,
`map-stats`, `stat-*`, `lost-mode-button` y la aserción `style:{flex:1}`
(`:338`). Son ~6 describes y ~9 aserciones tocadas, más 1 dependencia nueva
alpha, más carta de UI (D4).

### Cuál recomiendo

**Ninguna de las dos todavía.** El orden correcto, de más barato a más caro,
parando en el primero que funcione:

1. **Discriminador (D1)**: `onMapReady` + `console.log`, y las sondas
   `googleRenderer="LEGACY"` y `liteMode`. Un dev build, quince minutos de
   dispositivo. **Sin esto, elegir entre (a) y (b) es adivinar.**
2. **Si `googleRenderer="LEGACY"` pinta**: el fix es **un prop** en
   `map.tsx:172`. Cero dependencias, cero parches, cero migración, un test que
   asserta el prop. Ahí se acaba la feature.
3. **Si el discriminador dice H1** (no dispara `onMapReady`): vía **(a)**, el
   parche de una línea sobre `attachLifecycleObserver`.
4. **Si dice H2 y `LEGACY`/`liteMode` no salvan**: vía **(b)**, porque
   `expo-maps` usa Jetpack Compose sobre otro backing de vista y esquiva tanto
   H1 como H2 — pero entonces asúmase el precio completo: dependencia alpha
   (D5), wrapper nuevo, 9 aserciones reescritas, `app.config.ts`,
   `docs/verification.md` §52 y `docs/ui-guidelines.md` §95.

Lo que **no** recomiendo: bumpear a react-native-maps 1.29.0 como fix. Ninguna
release note posterior a 1.27.2 toca el ciclo de vida (solo 1.28.1 roza la zona
con *"fix ghost features on MapView"*), sale de la versión de
`bundledNativeModules.json` y `expo-doctor` lo marcará. Es un experimento
barato si ya hay un dev build en marcha, no un plan.

### Tests: qué cubre de verdad y qué no

Sé honesto en la spec, porque el criterio de aceptación 4 tal como está pide
algo imposible:

**Lo que un test de Jest NO puede cubrir, en ningún caso.** El test actual
mockea `react-native-maps` entero con un `<View>` stub
(`src/app/(tabs)/__tests__/map.test.tsx:65-73`), y **tiene que hacerlo**:
jest-expo corre en Node, no hay Play services, no hay `GoogleMap`, no hay
superficie GL. Cualquier test que se escriba:
- no ejecuta `MapView.java`,
- no ejecuta `attachLifecycleObserver`,
- no ejecuta `onMapReady`,
- **nunca pone `state.isReady` a `true`** — con el stub, los hijos se renderizan
  porque el stub no implementa el gate de `:1225`, no porque el mapa esté listo.
Es decir: **los tests de #54 pasarían hoy, con el bug presente y sin arreglar
nada.** Ya pasan. Un test verde aquí no es señal.

**Lo que un test SÍ puede cubrir (y merece un R-id):**
- que se pasa el prop/config elegido por el fix (`googleRenderer`, o
  `cameraPosition` con el zoom convertido, o `properties.mapStyleOptions`) —
  es una regresión real de contrato JS, rojo→verde de verdad si alguien borra
  el prop;
- la conversión delta→zoom como función pura, si se va a (b);
- que marker y polylines se derivan correctamente de los datos (hoy vía hijos,
  con (b) vía arrays) — protege el mapeo de datos, no el render;
- no-regresión de todo lo que ya cubre el fichero (stats, polling, estados
  vacíos), que es lo que evita romper el tab al tocarlo.

**La única verificación real es el smoke humano en dev build de Android, en
ambos temas**, exactamente como el criterio 5 ya dice. Y con un paso extra que
#52 no tenía: **una captura o confirmación explícita de que se ven tiles +
marker + polyline**, porque el "monta sin crash y hay watermark" de #52 es
justo el estado defectuoso que estamos arreglando
(`progress/impl_android-maps-api-key.md:132-138`).

Recomendación de redacción para el `spec_author`: que el criterio 4 diga
*"test que fija el contrato JS del fix, nombrando su R-id; se documenta
explícitamente que no cubre el render nativo"* y que el gate humano del
criterio 5 sea el único que cierra R1/R2/R3.

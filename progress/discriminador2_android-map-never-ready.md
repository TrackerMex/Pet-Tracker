# Discriminador 2 #54 — android-map-never-ready (post-migración a expo-maps)

Fecha de redacción: 2026-08-31. Lo ejecuta **el humano** en el dev build de
Android. Continúa `progress/discriminador_android-map-never-ready.md`.

## Por qué existe este segundo documento

La migración a `expo-maps` (R1–R7, branch `feature/54-android-map-never-ready`)
está construida e instalada, y **el mapa sigue sin pintar tiles**. El síntoma
cambió de forma pero no de naturaleza:

| | Antes (`react-native-maps`) | Ahora (`expo-maps`) |
|---|---|---|
| Visible | solo watermark "Google" | fondo blanco + controles `+` / `-` de zoom |
| Tiles | no | no |

Los controles de zoom los dibuja Compose como vistas normales; los tiles viven
en el `SurfaceView` del mapa. Que uno pinte y el otro no reproduce exactamente
la conclusión del primer discriminador: **la `SurfaceView` no se compone**.
`maps-compose` monta un `SurfaceView` igual que `react-native-maps`, así que
cambiar de librería nunca podía arreglar esa causa. La decisión de migrar
(2026-08-28) se tomó con esa incertidumbre asumida y por escrito.

## Descartado con evidencia en esta sesión (2026-08-31)

No repitas nada de esto:

- **API key.** `grep -c "com.google.android.geo.API_KEY"` sobre el manifest
  del build instalado devuelve `1`. `adb logcat` no muestra
  `Authorization failure` ni `API_KEY_ANDROID_APP_BLOCKED`, y el SDK sí
  inicializa (`Google Android Maps SDK: ... maps renderer version(maps_core)`
  y `Capabilities unavailable without a Map ID`, que solo se imprime tras
  cargar el mapa).
- **Cableado de la clave.** Verificado de punta a punta:
  `GOOGLE_MAPS_API_KEY_ANDROID=X npx expo config --json` produce
  `"googleMaps":{"apiKey":"X"}`, y `npx expo prebuild --platform android`
  escribe la meta-data en el manifest.
- **El plugin `expo-maps` omitido.** Correcto: `plugin/build/withMapsLocation.js`
  solo añade permisos de ubicación y es no-op sin `requestLocationPermission`.
  No toca la clave.
- **Uso de la API.** `src/components/pet-map.tsx` coincide con
  `GoogleMapsViewProps` de `expo-maps@57.0.2` (`cameraPosition`, `markers`,
  `polylines`, `colorScheme`).
- **Red.** Teléfono físico OPPO CPH2709, Android 15, `ping 8.8.8.8` 0% pérdida.
  No es emulador.
- **`animation: 'fade'` en el navegador de tabs.** Quitado en caliente; el mapa
  sigue igual. La hipótesis de la capa alpha del contenedor queda refutada.
- **Ventana translúcida.** El tema generado no la declara: `AppTheme` hereda de
  `Theme.AppCompat.DayNight.NoActionBar` y solo pone `statusBarColor` y
  `navigationBarColor` transparentes. No hay `windowIsTranslucent`.
- **Errores nativos.** `adb logcat -d *:E` durante la apertura del tab no
  reporta nada de `Surface`, `Compose`, `EGL` ni `expo`. El `SurfaceView` no
  falla: no se compone.

## Lo que queda por partir

Dos ramas, y llevan a arreglos distintos:

- **H3 — el árbol de vistas de la app.** Algo entre la raíz y `PetMap` rompe la
  composición del `SurfaceView`. Fix: encontrar el nodo y cambiarlo.
- **H4 — el dispositivo o la plataforma.** ColorOS/OPPO o RN 0.86.2 + Fabric en
  general. **El defecto nunca se ha reproducido en un segundo Android.** Fix:
  parche nativo, o el defecto no existe fuera de este teléfono.

## Preparación

Solo JS y Fast Refresh sobre el dev build ya instalado. **No hace falta
`prebuild` ni `run:android`.**

```bash
cd C:/dev/pet-tracker
docker compose up -d
pnpm -C backend-pet-tracker run start:dev
```

En otra terminal:

```bash
cd C:/dev/pet-tracker/mobile-pet-tracker
bunx expo start --dev-client
```

Los cambios de los pasos 2 y 3 son **temporales y no se commitean**.

## Paso 1 — ¿es composición a nivel de sistema?

Sin tocar código. En el teléfono: Opciones de desarrollador → activa
**"Desactivar superposiciones HW"** (Disable HW overlays). Vuelve al tab Map.

Ese ajuste fuerza a que todo se componga por GPU en vez de por overlays de
hardware, que es justo el mecanismo que deja un `SurfaceView` sin dibujar.

- **Aparecen los tiles** → composición confirmada como causa, y además apunta a
  H4 (comportamiento del compositor del dispositivo).
- **Sigue igual** → sigue al paso 2. Acuérdate de volver a desactivar el ajuste.

## Paso 2 — ¿es el árbol de vistas de la app?

Crea `src/app/mapdebug.tsx` con **solo** esto:

```tsx
import { GoogleMaps } from 'expo-maps';

export default function MapDebug() {
  return (
    <GoogleMaps.View
      style={{ flex: 1 }}
      cameraPosition={{
        coordinates: { latitude: 19.4326, longitude: -99.1332 },
        zoom: 16,
      }}
      onMapLoaded={() => console.log('[mapdebug] loaded')}
    />
  );
}
```

Esa ruta no pasa por los tabs, ni por `uniwind`, ni por los overlays absolutos
de `map.tsx`. Ábrela por deep link:

```powershell
adb shell am start -a android.intent.action.VIEW -d "mobilepettracker://mapdebug"
```

Mira también `adb logcat -s ReactNativeJS` para confirmar `[mapdebug] loaded`.

- **Pinta tiles aquí** → H3. El defecto está en el árbol de `(tabs)`/`map.tsx`
  y se bisecciona desde arriba: quitar el `FloatingTabBar`, luego los overlays
  absolutos de `map.tsx`, luego las clases de `uniwind` del contenedor.
- **No pinta** → H4. Ni tabs ni providers ni estilos tienen que ver.

Al terminar: `rm src/app/mapdebug.tsx`.

## Paso 3 — ¿es este teléfono?

Solo si el paso 2 dio H4. Instala el **mismo** dev build en un segundo Android
(otro teléfono físico, o un emulador con imagen *Google Play*) y abre
`mapdebug`.

- **Pinta en el segundo dispositivo** → el defecto es de ColorOS/OPPO. R8 se
  cierra en otro teléfono y #54 documenta la limitación.
- **Tampoco pinta** → defecto de plataforma (RN 0.86.2 + Fabric + `SurfaceView`).
  El fix sale de `expo-maps`/`maps-compose` hacia arriba, no de esta app.

## Resultado

Fecha de ejecución: 2026-08-31 / 2026-09-01. **Conclusión: H3.**

La ruta `mapdebug` por deep link no llegó a ejecutarse: el dev client entrega el
intent pero no navega (`Activity not started, intent has been delivered to
currently running top-most instance`). Se sustituyó por cortes directos sobre
`src/app/(tabs)/map.tsx`, todos con Fast Refresh y sin recompilar.

| Corte | Resultado |
|---|---|
| "Desactivar superposiciones HW" | sin cambio |
| `animation: 'fade'` fuera del navegador de tabs | sin cambio |
| `FloatingTabBar` comentado (quita `BlurView` y `GlassView`) | sin cambio |
| Apps de terceros con Google Maps (Uber, DiDi) en el mismo teléfono | **pintan** |
| Proyecto `betomoedano/expo-maps-example` en el mismo teléfono | **pinta** |
| `map.tsx` reducido a solo `<GoogleMaps.View>` | **pinta** |
| `map.tsx` original con `className="flex-1"` en vez de `flex-1 bg-background` | **pinta** |

## Causa raíz

El contenedor de la pantalla (`src/app/(tabs)/map.tsx:175`) declara un fondo
opaco:

```tsx
<View testID="screen-map" className="flex-1 bg-background">
```

Un `SurfaceView` no se dibuja dentro de la ventana: la perfora y se compone por
detrás. Un ancestro que pinta un fondo opaco sobre esa región tapa el hueco, así
que se ve el fondo del tema en lugar del mapa. Los controles de zoom siguen
visibles porque son vistas normales dibujadas encima.

Eso explica cada observación acumulada desde agosto:

- El síntoma sobrevivió al cambio de `react-native-maps` a `expo-maps`: ambas
  librerías montan un `SurfaceView` y el contenedor era el mismo.
- `liteMode` pintaba: dibuja un bitmap dentro de la jerarquía normal, sin hueco.
- `onMapReady` / `onMapLoaded` disparaban: el mapa siempre cargó bien.
- Nunca hubo errores en `logcat`: no falla nada, solo queda tapado.
- El watermark "Google" se veía en la era `react-native-maps`: lo dibuja la
  vista contenedora, no la superficie.

Descartados por el camino, con evidencia: dispositivo (Uber y DiDi pintan),
proyecto de Google Cloud y clave (el ejemplo pinta), `expo-maps` como librería,
`BlurView` del tab bar, la animación `fade` de los tabs y la composición a nivel
de sistema.

## Fix

Handoff acotado en `progress/handoff_android-map-never-ready_fix1.md`. No toca
`expo-maps` ni la spec R1–R7: el fondo baja del contenedor a cada estado que sí
lo necesita.

## Bug aparte detectado en el mismo logcat

`E ExpoImage: java.net.ConnectException(Failed to connect to localhost/127.0.0.1:4566)`

Las URLs prefirmadas de LocalStack salen con `localhost`, así que las fotos de
mascota no cargan en teléfono físico. No tiene relación con el mapa. Pendiente
de registrar como feature propia.

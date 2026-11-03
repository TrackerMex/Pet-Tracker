# Spike de #230: avatar en el marcador del mapa (opción B2)

Lo corre el humano en su PC, sobre el dev build de Android que ya tiene. No hace
falta reconstruirlo: el cambio es solo JS. La rama `spike/230-avatar-marker` es
desechable y no se mergea. La spec de #230 se escribe con lo que salga de aquí.

Contexto: `progress/explore_mobile-map-pet-avatar-marker.md`, §Recomendación.

## Pasos

1. Trae la rama:
   ```bash
   git fetch origin
   git switch -c spike/230-avatar-marker --track origin/spike/230-avatar-marker
   cd mobile-pet-tracker
   bun install --frozen-lockfile
   ```
2. Levanta el backend como en el último smoke.
3. Arranca Metro con `bunx expo start --dev-client` y abre la app en el teléfono.
4. Memoria antes de entrar a Mapa. En Windows, con `-s <ip:puerto>` si el
   teléfono sale dos veces en `adb devices`:
   ```bash
   adb shell dumpsys meminfo com.trackermex.pettracker | findstr TOTAL
   ```
   Anota el primer número de la fila `TOTAL PSS`.
5. Entra a Mapa con una mascota que tenga foto y posición. Arriba aparece un panel
   negro con el informe del spike. Espera a que `stage` diga `icon-ready` y repite
   el comando del paso 4.
6. Pulsa los botones del panel, uno por uno, y espera unos 5 segundos con cada uno:
   - «Foto»;
   - «URL rota»;
   - «Sin foto»;
   - «Visible: sí», y repite «Foto».
7. Al acabar, vuelve a tu rama: `git switch dev`.

## Qué mirar

| # | Comprobación | Pasa si |
|---|---|---|
| 1 | Foto recortada | Con «Foto», el marcador del mapa es la foto en un círculo con borde blanco, no el pin rojo de Google |
| 2 | Tamaño | `decodedWidth` = `requestedPx` = 44 × `pixelRatio`, y el PNG del panel se ve nítido |
| 3 | Cadena completa | `stage` llega a `icon-ready` y el marcador del mapa es el mismo dibujo que el PNG del panel |
| 4 | Memoria | La diferencia de `TOTAL PSS` entre los pasos 4 y 5 |
| 5 | URL rota | Con «URL rota», hacia los 4 s pasa por `timeout-fallback` y acaba en `icon-ready` con el blobatar |
| 6 | Sin foto | Con «Sin foto», el marcador es el blobatar sobre un disco blanco, como el artboard |
| 7 | Oculto o visible | Si con «Visible: no» se queda en `photo-loaded` o `capture-timeout` pero con «Visible: sí» funciona, hay que saberlo: cambia la spec |

## Qué enviar al leader

- Una captura del mapa con el panel por cada botón.
- Las líneas `[spike-230]` de la terminal de Metro.
- Los dos números de `TOTAL PSS`.

## Resultado

Lo rellena el leader con lo que envíe el humano.

Corrida del 2026-11-03 (13:56–13:59 en el teléfono): el humano mandó cinco
capturas del panel: «Foto», «URL rota» y «Sin foto» con «Visible: sí», y luego
«Foto» y «Sin foto» con «Visible: no». No mandó las líneas `[spike-230]` ni los
dos `TOTAL PSS`. `pixelRatio` = 3.5 y `requestedPx` = 154.

| # | Resultado | Nota |
|---|---|---|
| 1 | **Falla** | Con «Foto», `msToPhotoLoad` = null y `msToCapture` = 4213 (4226 oculto): el `onLoad` del `<Image>` de react-native-svg no llega nunca y a los 4 s cae al blobatar. `base64Length` = 7072 en las cinco capturas, o sea, siempre el mismo PNG del blobatar. La foto sale en la pastilla de «Jev», pero desde la caché de expo-image (ver «Causa») |
| 2 | Pasa | `iconWidth` = `iconHeight` = 154 = 44 × 3.5. `decodedWidth` sale null porque `RNImage.getSize` de Android no acepta `data:`: es el `error` del panel («Unsupported uri scheme for encoded image fetch»), no un fallo de la cadena. El PNG se ve nítido |
| 3 | Pasa, solo con el blobatar | `stage` = `icon-ready` en las cinco; el marcador del mapa es el blobatar sobre disco blanco, igual que el PNG del panel, no el pin por defecto. La cadena SVG → PNG → `useImage` → icono de expo-maps funciona |
| 4 | +35 MB, toda la pantalla | `TOTAL PSS` 1 140 009 KB antes de Mapa y 1 175 825 KB en `icon-ready` (+35 816 KB). Mide Mapa entera (Google Maps más el spike), no el marcador solo |
| 5 | Pasa | Con «URL rota» (`signature-zeroed`), `msToCapture` = 4226 y acaba en `icon-ready` con el blobatar. Indistinguible de «Foto»: la foto buena tampoco cargó |
| 6 | Pasa | Blobatar sobre disco blanco; `msToCapture` 218 / 198 ms, `msToIcon` 361 / 345 ms |
| 7 | Igual en los dos | Con «Visible: no» (opacidad 0.01) llega a `icon-ready` igual que con «Visible: sí»; la foto no carga en ninguno de los dos |

Por qué falla 1, leyendo `react-native-svg` 15.15.4 en Android
(`android/src/main/java/com/horcrux/svg/ImageView.java`): la foto se pide a
Fresco con `fetchDecodedImage` en `draw()`; si llega, despacha `SvgLoadEvent`
(`onLoad`); si falla, solo escribe `RNSVG: fetchDecodedImage failed!` en
logcat, que Metro no ve. Con lo que hay no se sabe cuál de las dos pasó.

Falla 1, así que la decisión vuelve al humano (§6, pregunta 5 del plan): E
(`react-native-view-shot` y rebuild) o D (miniatura en el backend). Antes cabe
una comprobación de un minuto, sin rebuild: `adb logcat -d | findstr RNSVG` con
la app aún abierta en Mapa. Si sale `fetchDecodedImage failed!` con su causa, se
sabe por qué Fresco no trae la foto; si no sale nada, la foto llegó y lo que se
pierde es el evento, y B2 podría seguir viva capturando sin esperar a `onLoad`.

Logcat del 2026-11-03 (PID 17342): dos `W unknown:ReactNative: RNSVG:
fetchDecodedImage failed!`, a las 15:23:53 y 15:23:55. Fresco no trae la foto: el
fallo de 1 es real, no un evento perdido. `FLog.w` imprime la excepción de
`getFailureCause()` en las líneas siguientes, que el `findstr RNSVG` filtró.

Causa (15:36:33, `findstr /c:"unknown:ReactNative"`): `java.io.IOException:
Unexpected HTTP code ... code=404, message=NOT FOUND` desde
`OkHttpNetworkFetcher`, para
`http://192.168.1.150:4566/pet-tracker-media-local/pets/01a111d3-…/photo-1792697360826`
firmada a las 21:36:28Z. Un 404 de LocalStack es objeto o bucket inexistente,
no firma mala (eso sería 403). La premisa «la foto carga en la pastilla, luego
la URL es válida» no se sostiene: `pet-avatar.tsx` pasa `cacheKey={pet.id}` a
expo-image, que pinta la foto de su caché de disco sin pedir la URL. Lo más
probable es que LocalStack perdiera el objeto al reiniciarse. B2 no está
descartada: falta repetir «Foto» con una foto que exista en el bucket.

Repetición (15:41, PID 8646, tras volver a subir la foto de Jev desde la app):
logcat sin `fetchDecodedImage failed!` y, según el humano, «el marcador ya
muestra la foto de Jev». Las comprobaciones 1 y 3 pasan con foto real: **B2
sobrevive** y la spec de #230 se escribe sobre ella, sin dependencias nuevas ni
rebuild. Para la spec: una foto que da 404 en S3 cae en el blobatar por timeout
(comprobación 5), y expo-image con `cacheKey` puede seguir pintando en la
pastilla una foto que ya no existe en el bucket.

Si falla 1, 3 o 5, la decisión vuelve al humano: E (`react-native-view-shot` y
rebuild) o D (miniatura en el backend). Ver `plan_mejoras-smoke-2026-11-03.md`
§6, pregunta 5.

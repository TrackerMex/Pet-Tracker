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

| # | Resultado | Nota |
|---|---|---|
| 1 | | |
| 2 | | |
| 3 | | |
| 4 | | |
| 5 | | |
| 6 | | |
| 7 | | |

Si falla 1, 3 o 5, la decisión vuelve al humano: E (`react-native-view-shot` y
rebuild) o D (miniatura en el backend). Ver `plan_mejoras-smoke-2026-11-03.md`
§6, pregunta 5.

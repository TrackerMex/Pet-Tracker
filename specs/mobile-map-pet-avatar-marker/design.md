---
feature: "mobile-map-pet-avatar-marker"
status: spec_ready   # draft | spec_ready | approved
tags: [harness, spec, mobile, ui]
---

# Diseño — [[mobile-map-pet-avatar-marker]] (#230)

> Decisiones de alto nivel. Los literales exactos (testIDs, geometría, claves,
> tiempos) están en [[requirements]]; el orden y los dobles, en [[tasks]].

## Capas y ficheros

La feature es solo de presentación móvil: no toca dominio, aplicación ni
backend, ni el contrato de la API (`photoUrl: string | null` ya existe en
`PetProfile`).

| Fichero (`mobile-pet-tracker/src/`) | Cambio | R |
|---|---|---|
| `screens/map/pet-marker-icon.tsx` | **nuevo**: `PetMarkerIcon`, `markerCompositionKey`, `currentMarkerIcon`, tipo `MarkerIconState` | R1, R3–R9, R11 |
| `screens/map/pet-marker-icon.test.tsx` | **nuevo** | R1, R3–R9 |
| `components/pet-map.tsx` | prop `markerIcon?: ImageRef \| null` y forma del marcador | R2 |
| `components/__tests__/pet-map.test.tsx` | 3 tests nuevos | R2 |
| `screens/map/index.tsx` | estado `markerIcon`, `<PetMarkerIcon>` y prop al `<PetMap>` | R10 |
| `screens/map/index.test.tsx` | dobles de react-native-svg y expo-image, 3 tests nuevos | R10 |
| `__tests__/map-canvas-fidelity.test.ts` | 9 tests nuevos | R1, R10, R11 |

Sin cambios: `i18n/`, `theme/`, `docs/`, `package.json`, `bun.lock`.

## Símbolos

```ts
// screens/map/pet-marker-icon.tsx
type MarkerPet = Pick<PetProfile, 'id' | 'name' | 'photoUrl'>;
export type MarkerIconState = { key: string; icon: ImageRef } | null;
export function markerCompositionKey(pet: MarkerPet): string;
export function currentMarkerIcon(state: MarkerIconState, pet: MarkerPet | undefined): ImageRef | null;
export function PetMarkerIcon(props: { pet: MarkerPet; onIcon: (state: { key: string; icon: ImageRef }) => void }): JSX.Element;
```

Constantes internas, no exportadas: tamaño `44` y plazo `4000`. Los tests usan
los literales (`154`, `3999`, `4000`), no los importan, para que el candado no
sea tautológico.

## Decisiones

**D1 — Composición con react-native-svg, rasterizada en el dispositivo (B2).**
Un `Svg` oculto dibuja el avatar con las primitivas que ya usa la app
(`Circle`, `ClipPath`, `G`, `Image`, `parse` + `blobatar`), `toDataURL` lo
convierte en PNG y `useImage` lo convierte en el `ImageRef` que pide
`GoogleMaps.View` en `markers[].icon`. Es lo único que el spike validó en el
dev build actual sin dependencias nuevas.

**D2 — Dos `Svg`, uno por estado.** `map-marker-fallback-svg` (blobatar) se
monta siempre y se captura tras dos frames; `map-marker-photo-svg` solo existe
con foto y se captura tras su `onLoad` y dos frames. Así el blobatar está listo
mientras la foto descarga, y la foto no depende de él.

**D3 — Un solo cargador de icono por composición.** La composición guarda las
dos capturas y pasa a `useImage` `{ uri: fotoCapturada ?? blobatarCapturado }`
desde **un** hijo que se monta en cuanto hay alguna captura y no cambia de
`key`. Consecuencias que se buscan:
- la foto siempre gana: si el blobatar llega tarde, la `uri` no cambia (R6);
- si la `uri` cambia del blobatar a la foto antes de que el blobatar cargue,
  `useImage` invalida esa carga y nunca publica el blobatar;
- `useImage` libera en su limpieza el `ImageRef` que capturó su efecto. Al
  pasar del blobatar a la foto no se libera el blobatar que el mapa está
  mostrando; se libera al desmontar la composición, y en ese mismo render R9
  ya devuelve `null`.

**D4 — Clave de composición y props congeladas.** La pantalla monta
`PetMarkerIcon` con `key={markerCompositionKey(selectedPet)}`, y el componente
lee la mascota una sola vez al montar (`useState(() => pet)` o equivalente).
La clave quita la query de la URL: el backend re-firma `photoUrl` en cada
consulta y, sin esto, cada sondeo de 15 s recompondría y volvería a descargar
la foto. Otro id, otro nombre u otra ruta de foto remontan la composición
(R8). La posición no entra en la clave: moverse no recompone.

**D5 — Icono vigente en la pantalla.** La pantalla guarda `{ key, icon }` y pasa
`currentMarkerIcon(estado, selectedPet)`. Al cambiar de mascota o de foto, el
icono viejo deja de valer en el mismo render y el mapa vuelve al pin por defecto
hasta la nueva captura (R9, R10).

**D6 — Plazo de 4000 ms para la foto.** El `Image` de react-native-svg no emite
error a JS; sin plazo, una foto rota dejaría el `Svg` de foto montado para
siempre. Vencido el plazo se desmonta y se queda el blobatar (R7). 4000 ms es
el valor del spike.

**D7 — Invisible pero rasterizable.** El contenedor usa
`opacity: 0.01`, `pointerEvents="none"`, posición absoluta arriba a la derecha y
se oculta a la accesibilidad (R1). `opacity: 0` y fuera de pantalla no están
medidos.

**D8 — Tamaño en píxeles reales.** `toDataURL` pide
`Math.round(44 * PixelRatio.get())` px de lado para que el marcador mida 44 dp
y no salga borroso (154 px a 3.5).

**D9 — Color por token.** Disco y borde usan `accent-foreground`, que es
`#FFFFFF` en los dos temas: el blanco de los artboards sin literal de color.

**D10 — `PetMap` compatible hacia atrás.** Sin `markerIcon` la forma del
marcador es exactamente la de antes (R2); los otros usos de `PetMap` (detalle de
alerta, editor de geocercas) no cambian. La rama con icono se añade con el mismo
patrón de spread condicional que `polylineWidth`.

## Desviaciones del diseño antiguo

`specs/mobile-canvas-map/canvas/Mapa.dc.html` dibujaba la inicial de la mascota
con sombra y el ping de #192. G1 de v167 (MapaAvatarFoto y MapaAvatarSinFoto)
lo sustituye: foto o blobatar, borde blanco de 3 px, sin sombra, sin halo. Los
dos artboards nuevos mandan.

## Carta (`docs/ui-guidelines.md`)

- Fallback sin foto = blobatar (carta §2), igual que `PetAvatar`.
- Ubicación del fichero por la regla de promoción (solo lo usa el Mapa).
- Sin hex, sin `StyleSheet.create`, sin degradados ni desenfoques: R11 lo
  bloquea con las guardas del Mapa.
- **No hace falta G4.**

## Alternativas descartadas

| Opción | Qué era | Por qué no |
|---|---|---|
| A | `useImage` de la `photoUrl` directo al `icon` | Foto rectangular, sin círculo ni borde; sin foto no hay respaldo (pin rojo) |
| B1 | Snapshot SVG solo del respaldo y la opción A para la foto | Dos looks distintos según haya foto; los artboards piden uno |
| C | Overlay RN con `PetAvatar` encima del mapa | Sin API de proyección: se desfasa al hacer pan, rotar o inclinar |
| D | Miniatura generada en el backend | Feature de backend aparte y coste AWS (gate humano) |
| E | react-native-view-shot, Skia o expo-image-manipulator | Dependencia nativa nueva y rebuild del dev build |
| F | Pin estático propio | Contradice la petición literal («quiero avatar») |

## Riesgos

- Memoria: +35 MB de PSS en el spike. Liberar el `Svg` de foto queda fuera.
- iOS no está medido (G2).
- Si `useImage` no logra decodificar el PNG, el mapa se queda con el pin por
  defecto o con el icono anterior de la misma composición. Es aceptable.

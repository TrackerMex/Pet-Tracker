---
feature: "mobile-map-zoom-controls"
status: draft     # draft | approved
tags: [harness, spec, mobile]
---

# Diseño — [[mobile-map-zoom-controls]]

> Ver [[requirements]] para los requisitos que este diseño implementa.
> `docs/architecture.md` (capas domain/application/infrastructure) **no
> aplica**: la feature vive entera en un componente de la app móvil. Sí
> aplican `docs/conventions.md` §Convenciones de la app móvil y
> `docs/ui-guidelines.md` (§4, §8, §10 y C8).
>
> Toda afirmación sobre la API de `expo-maps` se verificó el 2026-09-01
> leyendo los **tipos instalados** en
> `mobile-pet-tracker/node_modules/expo-maps@57.0.2`, no los docs ni la
> memoria.

## Decisiones técnicas

### D1 — `uiSettings.zoomControlsEnabled: false`, no `contentPadding` (R1)

Decisión del humano, ya tomada en la entrada #55. Queda aquí solo para que el
reviewer pueda comprobarla, no para re-litigarla:

| Opción | Qué cuesta mantener |
|---|---|
| **`uiSettings={{ zoomControlsEnabled: false }}`** | nada: un booleano constante |
| `contentPadding={{ bottom: N }}` | un número `N` que hay que mantener sincronizado a mano con el alto del `FloatingTabBar` **y** de `map-stats`, dos overlays que pueden cambiar por separado |

`contentPadding` es la salida "correcta" en el sentido del SDK (marca el borde
como obstruido y el mapa reacomoda controles **y** logo de Google), pero
reintroduce exactamente el acoplamiento geometría-pantalla ↔ wrapper que
señaló `progress/review_android-map-never-ready_fix1.md`: el wrapper pasaría a
depender de dimensiones que vive en otro archivo. Se descarta.

Ambas props existen y están cableadas — no es una elección entre una real y
una imaginaria:

```
GoogleMapsViewProps.uiSettings?: GoogleMapsUISettings   (GoogleMaps.types.d.ts:352)
GoogleMapsUISettings.zoomControlsEnabled?: boolean      (GoogleMaps.types.d.ts:218)
GoogleMapsViewProps.contentPadding?: GoogleMapsContentPadding (:373)
   → android/src/main/java/expo/modules/maps/GoogleMapsView.kt:115
```

Consecuencia visual aceptada: el **watermark "Google"** sigue donde está, algo
por detrás de los overlays inferiores. Es el logo obligatorio del SDK, no un
control; reubicarlo era el efecto secundario de `contentPadding` y se pierde
con la opción elegida. El smoke R3 no lo exige.

### D2 — El pinch-to-zoom no se toca (R1)

`zoomGesturesEnabled` y `zoomControlsEnabled` son claves distintas del mismo
objeto: la primera gobierna el **gesto**, la segunda los **botones**. La
primera viene `true` por defecto en el SDK, así que ocultar los botones no
quita capacidad de zoom — es el patrón de Uber, DiDi y Google Maps en
teléfono.

Por eso el requisito no dice "pasar `zoomGesturesEnabled: true`" sino **no
pasarlo**: escribir un default de la plataforma en nuestro código lo convierte
en estado que este repo tiene que mantener y revalidar en cada bump de una
dependencia que sigue siendo **alpha**. El test lo blinda con
`toEqual({ zoomControlsEnabled: false })` — un `toMatchObject` dejaría pasar
claves de más.

### D3 — El test reutiliza el mock existente, y el R-id lleva sufijo (R1)

`src/components/__tests__/pet-map.test.tsx` ya tiene todo lo necesario y **no
se toca salvo para añadir un `describe`**:

- el mock de `expo-maps` (`mockGoogleMapsView` → `View` real con las props
  spreadeadas) de #54 §D7;
- el patrón de aserción `screen.getByTestId('map-view').props.<prop>`, usado
  por los cuatro describes actuales.

Inventar un segundo mecanismo (spy sobre `mockGoogleMapsView.mock.calls`,
snapshot, etc.) sería un tercer patrón en el mismo archivo para el mismo tipo
de aserción. No.

**El `describe` lleva sufijo de feature** — `R1 (mobile-map-zoom-controls): …`
— porque el archivo ya contiene `R1`–`R4` de #54. Es la regla que el review de
#44 dejó anotada (H5) y que #54 ya aplicó en `map.test.tsx` con
`R8 (android-map-never-ready)`: cuando un R-id aterriza en un fichero de test
compartido, se desambigua con el nombre de la feature.

### D4 — Por qué el wrapper y no la pantalla (R1)

`docs/ui-guidelines.md` §8 y #54 §D6 fijan el reparto: `map.tsx` conoce los
tipos de API y deriva `center` / `marker` / `polylines` / `colorScheme`;
`PetMap` es el **único** archivo que conoce `expo-maps`. `zoomControlsEnabled`
es una decisión de la vista nativa, no del contrato de la pantalla: no hay
nada que `map.tsx` deba decidir aquí, así que no gana una prop nueva ni un
import nuevo.

Corolario práctico: si mañana el mapa se usa en otra pantalla, hereda la
decisión sin repetirla.

## Archivos afectados

| Archivo | Qué cambia |
|---|---|
| `mobile-pet-tracker/src/components/pet-map.tsx` | `mapViewProps` gana `uiSettings: { zoomControlsEnabled: false }`. Nada más: ni export nuevo, ni constante nueva, ni rama |
| `mobile-pet-tracker/src/components/__tests__/pet-map.test.tsx` | un `describe` nuevo (R1); los cuatro existentes quedan intactos |
| `docs/verification.md` | nueva `### Feature 55 — mobile-map-zoom-controls` con el runbook de R3 (Fast Refresh, sin `prebuild`) |

Todo lo demás queda sin tocar; la lista negativa completa está en
[[requirements]] R2 (allowlist), incluidos `map.tsx`, el `FloatingTabBar`,
`app.config.ts`, las dependencias y `specs/android-map-never-ready/**`.

Rama y PR: `feature/55-mobile-map-zoom-controls`, sacada de
`feature/54-android-map-never-ready` mientras #54 no esté en `main` — el
archivo que se modifica no existe en `main` ([[requirements]] §Dependencia de
#54).

## Alternativas descartadas

- **`contentPadding`**: D1. Descartada por el humano en la entrada #55.
- **Pasar `zoomGesturesEnabled: true` explícitamente**: D2. Congela un default
  de la plataforma como estado nuestro.
- **Poner la prop en `map.tsx`**: D4. Rompe la separación de
  `docs/ui-guidelines.md` §8 y obliga a la pantalla a conocer `expo-maps`.
- **Mover los overlays** (`FloatingTabBar` a otra ancla, `map-stats` arriba)
  para dejar sitio a los controles: cambia la pantalla entera para conservar
  unos botones que la decisión ya descartó.
- **Extraer una constante exportada `MAP_UI_SETTINGS`**: un solo punto de uso
  y un solo valor; sería una perilla que nadie gira. `MAP_ZOOM` existe porque
  el smoke sí puede necesitar ajustarlo; esto no.

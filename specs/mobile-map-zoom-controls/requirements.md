---
feature: "mobile-map-zoom-controls"
status: draft     # draft | approved
tags: [harness, spec, mobile]
---

# Requisitos — [[mobile-map-zoom-controls]]

> Notación EARS. Cada requisito tiene id único R<n>, inmutable una vez
> aprobado. Ver [[design]] (D1–D4). Aplican `docs/conventions.md`
> (§Convenciones de la app móvil, tests que nombran su R-id, commit
> `fix(<scope>): <desc> (R<n>)`) y `docs/ui-guidelines.md` (C8). Feature de
> **UI móvil**: no toca `backend-pet-tracker/`, así que las capas
> domain/application/infrastructure de `docs/architecture.md` no entran en
> juego (C3 no aplica).
>
> Feature **pequeña**: una prop en un archivo de producción, un test nuevo y
> un runbook de smoke. Si la implementación crece más allá de eso, está mal.

## Skills cargadas

- `expo:expo-overview` — **cargada**. Su regla manda leer los docs
  **versionados** https://docs.expo.dev/versions/v57.0.0/sdk/maps/, nunca
  `latest`; aquí además se verificó contra los **tipos instalados** en
  `mobile-pet-tracker/node_modules/expo-maps@57.0.2` (§Contexto fijo).
- `docs/ui-guidelines.md` §Skills **no tiene fila para "mapas"**. Esta feature
  no escribe estilo nuevo, no añade componentes ni toca dimensiones, así que
  no aplica ninguna de las filas de la tabla (`expo-native-ui`, `expo-ui`,
  `expo-design-system`, `appllama-app-design-skill`): no hay pantalla que
  diseñar. Sí aplica §10 (ancestros opacos) como no-regresión.
- **No existe skill de `expo-maps`** en el plugin `expo` v1.12.0 (ni en Claude
  Code ni en el de Codex). Queda dicho en vez de fingir cobertura.

## Contexto fijo (no reabrir)

### El defecto

Los controles nativos de zoom (`+` / `−`) que `GoogleMaps.View` dibuja en la
esquina inferior derecha quedan **debajo** del `FloatingTabBar` y de la
tarjeta `map-stats`, ambos overlays absolutos anclados al fondo de
`src/app/(tabs)/map.tsx` (tab bar en `insets.bottom + 12`, stats en
`insets.bottom + 96`). Detectado el 2026-09-01 en el smoke R8 de #54, una vez
que el mapa por fin pinta tiles: mientras la pantalla salía en blanco el
defecto estaba tapado.

### La decisión ya está tomada: se **quitan** los controles

Decisión del humano (2026-09-01, entrada #55 de `feature_list.json`). Las dos
salidas que ofrece `expo-maps@57.0.2` están verificadas contra los tipos
instalados, no contra la memoria:

| Salida | Dónde está | Por qué se elige o se descarta |
|---|---|---|
| **`uiSettings.zoomControlsEnabled: false`** | `node_modules/expo-maps/build/google/GoogleMaps.types.d.ts:218` (`GoogleMapsUISettings`), expuesto como `uiSettings?: GoogleMapsUISettings` en `GoogleMapsViewProps` (:352) | **Elegida.** Un booleano, sin número que mantener |
| `contentPadding` | mismo archivo :373, cableado a maps-compose en `android/src/main/java/expo/modules/maps/GoogleMapsView.kt:115` | **Descartada**: obliga a mantener a mano un número sincronizado con el alto de dos overlays que pueden cambiar — justo el acoplamiento que señaló `progress/review_android-map-never-ready_fix1.md` |

**Esta spec no es comparativa**: implementa la primera. Ver [[design]] §D1.

### Ocultar los controles no quita capacidad

El pinch-to-zoom es un **gesto independiente** (`uiSettings.zoomGesturesEnabled`,
`GoogleMaps.types.d.ts:222`), viene `true` por defecto y sigue activo. Es lo
que hacen Uber, DiDi y la propia app de Google Maps en teléfono. Por eso R1
prohíbe explícitamente tocar esa clave: pasarla, aunque fuera con `true`,
convertiría un default de la plataforma en estado que este repo tiene que
mantener.

### El cambio vive en el wrapper, no en la pantalla

`src/components/pet-map.tsx` es el único archivo del repo que conoce la API de
`expo-maps` (#54 R1, `docs/ui-guidelines.md` §4 y §8: separación route /
pantalla / wrapper). `src/app/(tabs)/map.tsx` **no importa nada de
`expo-maps` y no debe empezar a hacerlo**: su contrato con el mapa son
`center`, `marker`, `polylines` y `colorScheme`, y esta feature no lo amplía.

### Los tests de Jest NO prueban que el control desaparezca. Nunca.

`src/components/__tests__/pet-map.test.tsx` mockea `expo-maps` con un `View`
stub, y **tiene que hacerlo**: jest-expo corre en Node, sin Play services y
sin superficie nativa. Consecuencia que hay que decir en voz alta:

> El test de R1 prueba **que la prop viaja** desde `PetMap` hasta la vista.
> **No** prueba que los botones `+` / `−` dejen de dibujarse, ni que el
> pinch-to-zoom siga funcionando. Ninguna suite Jest de este repo puede
> hacerlo. La única verificación del defecto es **R3, el smoke humano**.

### Dependencia de #54

`src/components/pet-map.tsx` **no existe en `main`**: lo crea #54, que a fecha
de esta spec sigue `in_progress` a la espera de su smoke R8. Consecuencia
operativa, no requisito: la branch `feature/55-mobile-map-zoom-controls` sale
de `feature/54-android-map-never-ready` (o de `main` una vez mergeado #54), y
el smoke de R3 necesita el dev build con `expo-maps` de #54 instalado.

## Requisitos funcionales

- **R1**: WHEN `PetMap` renderiza `GoogleMaps.View` THE SYSTEM SHALL pasarle
  `uiSettings={{ zoomControlsEnabled: false }}`, AND ese objeto SHALL contener
  **exactamente esa clave** — en particular SHALL NOT incluir
  `zoomGesturesEnabled` (el pinch-to-zoom se queda con su default `true` de la
  plataforma) —, AND THE SYSTEM SHALL NOT pasar `contentPadding` a la vista,
  AND la prop SHALL salir de `mobile-pet-tracker/src/components/pet-map.tsx`,
  quedando `mobile-pet-tracker/src/app/(tabs)/map.tsx` **sin cambios** y sin
  ningún import de `expo-maps`.
  El resto de props que hoy construye `mapViewProps` (`testID`, `style`,
  `cameraPosition`, `markers`, `polylines`, `colorScheme`) SHALL quedar
  intactas, y el módulo SHALL NOT ganar exports nuevos.
  *Test: `mobile-pet-tracker/src/components/__tests__/pet-map.test.tsx` →
  `describe('R1 (mobile-map-zoom-controls): el wrapper oculta los controles nativos de zoom', ...)`
  — el sufijo de feature es obligatorio: ese archivo ya tiene `R1`–`R4` de
  #54 y un `R1` a secas colisionaría ([[design]] §D3). Reutiliza el mock de
  `expo-maps` y el patrón de aserción sobre las props del `GoogleMaps.View`
  mockeado que **ya existe** en el archivo
  (`screen.getByTestId('map-view').props.<prop>`), sin inventar otro:*

  ```ts
  const mapProps = screen.getByTestId('map-view').props;
  expect(mapProps.uiSettings).toEqual({ zoomControlsEnabled: false });
  expect(mapProps).not.toHaveProperty('contentPadding');
  ```

  *ROJO primero: hoy `uiSettings` es `undefined`. El `toEqual` exacto es lo
  que hace asserteable la prohibición sobre `zoomGesturesEnabled`.*

- **R2**: WHEN se ejecutan `bun run typecheck`, `bun run lint` y
  `bun run test` en `mobile-pet-tracker/` y `./init.sh` en la raíz tras el
  cambio THE SYSTEM SHALL salir con exit 0 y con **todas** las suites
  existentes verdes, sin borrar ni desactivar ningún test previo (el único
  test nuevo es el de R1), AND THE SYSTEM SHALL dejar el cierre contenido:
  - **Allowlist**: el diff SHALL tocar SOLO
    `mobile-pet-tracker/src/components/pet-map.tsx`,
    `mobile-pet-tracker/src/components/__tests__/pet-map.test.tsx`,
    `docs/verification.md`, `specs/mobile-map-zoom-controls/**`,
    `progress/impl_mobile-map-zoom-controls.md` y `feature_list.json`.
    AND `mobile-pet-tracker/src/app/(tabs)/map.tsx`,
    `mobile-pet-tracker/src/app/(tabs)/__tests__/map.test.tsx`,
    `mobile-pet-tracker/src/app/(tabs)/_layout.tsx`,
    `mobile-pet-tracker/src/components/floating-tab-bar.tsx`,
    `mobile-pet-tracker/app.config.ts`, `mobile-pet-tracker/app.json`,
    `mobile-pet-tracker/package.json`, `mobile-pet-tracker/bun.lock`, el resto
    de `mobile-pet-tracker/src/**`, `backend-pet-tracker/**`, `infra/**`,
    `.github/**`, `docs/ui-guidelines.md`, `docs/conventions.md`,
    `progress/current.md` (territorio del leader, `CLAUDE.md` §Un solo
    escritor) y `specs/android-map-never-ready/**` (otra feature, aprobada y
    en curso) SHALL quedar sin cambios.
  - **Geometría intacta**: ningún cambio en los overlays de `map.tsx` — el
    `FloatingTabBar` sigue en `insets.bottom + 12` y `map-stats` en
    `insets.bottom + 96`; los testIDs `screen-map`, `map-view`, `map-stats`,
    `map-empty-overlay` y `lost-mode-button` siguen existiendo con el mismo
    comportamiento.
  - **Grep-clean C8** SHALL seguir limpio: cero hex fuera de `src/theme/`,
    cero clases arbitrarias `[...]`, cero `StyleSheet.create`, cero
    shadow/elevation legacy. Este diff no añade estilo, así que no debe mover
    ninguno de esos contadores.
  - `docs/verification.md` SHALL ganar una sección
    `### Feature 55 — mobile-map-zoom-controls` con el runbook literal del
    smoke de R3, siguiendo el patrón de `### Feature 54` (que ya documenta la
    variante Fast Refresh para cambios solo-JS).
  *Sin test propio. Verificación: el implementer anota los comandos y su
  salida en `progress/impl_mobile-map-zoom-controls.md`; el reviewer los
  re-ejecuta y corre `git diff --stat` de la branch contra esa allowlist.*

## Prueba de humo del humano

- **R3**: WHEN el humano, con el dev build de Android de #54 **ya instalado**
  y el backend local arriba, arranca el bundler y abre el tab **Map** con una
  mascota premium que tenga última posición:

  ```bash
  cd mobile-pet-tracker
  bunx expo start --dev-client
  ```

  THE SYSTEM SHALL mostrar el mapa **sin los botones `+` / `−`** en la esquina
  inferior derecha, AND el **pinch-to-zoom SHALL seguir acercando y alejando**
  el mapa.

  Confirmación **explícita y por separado**:
  1. Esquina inferior derecha: no hay controles `+` / `−` (antes asomaban por
     detrás del `FloatingTabBar` y de `map-stats`).
  2. Pinch con dos dedos: el mapa **acerca**; pinch inverso: **aleja**.
  3. No-regresión de #54: siguen viéndose tiles, marker y polyline, y la
     tarjeta de stats y el botón **Lost Mode** siguen funcionando encima del
     mapa.

  **`prebuild` y `run:android` NO hacen falta**: el cambio es solo JS y basta
  Fast Refresh sobre el dev build instalado. Solo se recompila si cambian
  dependencias nativas, que aquí no cambian (R2).

  **Ninguna suite Jest cubre esto**: `GoogleMaps.View` está mockeado, así que
  el verde de R1 solo prueba que la prop viaja, no que el control desaparezca
  en pantalla ni que el gesto siga vivo.

  **Este requisito SOLO lo cierra el humano** (requiere dispositivo real).
  Registra el resultado en `progress/impl_mobile-map-zoom-controls.md` y marca
  la segunda casilla de §Aprobación.

## Fuera de alcance

- **Reubicar los controles** con `contentPadding`: descartado con motivo en la
  entrada #55 y en [[design]] §D1. No se reabre.
- **Tocar `zoomGesturesEnabled`** ni cualquier otra clave de `uiSettings`
  (`compassEnabled`, `myLocationButtonEnabled`, `scaleBarEnabled`,
  `rotationGesturesEnabled`, `tiltGesturesEnabled`, `scrollGesturesEnabled`…):
  ninguna se pasa hoy y ninguna se pasa después.
- **Mover o rediseñar el `FloatingTabBar` y `map-stats`**, o cualquier otro
  cambio de geometría, safe areas o dimensiones de `map.tsx`.
- **Un control de zoom propio en la app** (botones `+` / `−` dibujados por
  nosotros por encima del mapa): la decisión fue quitar los controles, no
  reimplementarlos. Si alguna vez hicieran falta, es otra feature con su
  propio diseño.
- **iOS / `AppleMaps.View`**: sigue fuera de alcance por las razones de #54
  §D5; `uiSettings` de Google Maps no le aplica.
- **La rama de error de `last` sin pintar** (observación 1 de
  `progress/review_android-map-never-ready_fix1.md`): defecto propio, ya
  anotado, ajeno a esta feature.
- **Cerrar el smoke R8 de #54**: R3 es otro gate, sobre otra spec. Pueden
  ejecutarse en la misma sesión de dev build, pero uno no sustituye al otro.

## Aprobación

- [ ] Aprobado por humano (fecha: ____) ← gate obligatorio antes de implementar
- [ ] R3 smoke en dev build de Android: controles `+` / `−` ausentes **y**
      pinch-to-zoom funcionando (fecha: ____) ← gate obligatorio antes de `done`

---
feature: "android-map-never-ready"
status: approved     # draft | approved
tags: [harness, spec, mobile]
---

# Diseño — [[android-map-never-ready]]

> Ver [[requirements]] para los requisitos que este diseño implementa.
> `docs/architecture.md` (capas domain/application/infrastructure) **no
> aplica**: la feature vive entera en la app móvil y en la config de build.
> Sí aplican `docs/conventions.md` §Convenciones de la app móvil y
> `docs/ui-guidelines.md` (C8).
>
> Toda afirmación sobre `node_modules/` se verificó leyendo el código el
> 2026-08-28. Toda afirmación sobre la API de `expo-maps` sale de
> https://docs.expo.dev/versions/v57.0.0/sdk/maps/ (docs **versionados**,
> nunca `latest`), porque el paquete todavía no está instalado.

## Decisiones técnicas

### D1 — Se migra a `expo-maps`; el parche nativo queda descartado (R1)

Decisión del humano, tomada el 2026-08-28 con el resultado del discriminador
en la mano. No es una elección entre iguales:

- El discriminador (`progress/discriminador_android-map-never-ready.md`)
  mostró `onMapReady` disparando, `liteMode` pintando y **ninguno** de los dos
  renderers pintando en modo normal ⇒ el ciclo de vida corre entero y falla la
  composición de la `SurfaceView` bajo Fabric. **No hay ciclo de vida que
  parchear**: la vía `bun patch` sobre `attachLifecycleObserver` que proponía
  el explorer arreglaría un problema que no existe.
- `react-native-maps@1.27.2` no expone `androidLayerType`, `zOrderOnTop` ni
  `TextureView`: no hay prop de escape.
- `expo-maps` monta el mapa sobre **Jetpack Compose**, otro backing de vista,
  y por eso esquiva el problema.

Coste asumido: dependencia en **alpha** (los docs v57 lo dicen literal), un
componente nuevo, ~9 aserciones reescritas, `app.config.ts` reescrito y dos
docs actualizados. Vía de vuelta documentada en [[requirements]] §Contexto
fijo.

### D2 — La clave llega por `android.config.googleMaps.apiKey`, y el plugin de `expo-maps` NO se declara (R5)

Cadena verificada leyendo `node_modules/`:

```
app.config.ts  →  android.config.googleMaps.apiKey
                     ↑ lo lee AndroidConfig.GoogleMapsApiKey.getGoogleMapsApiKey
                       (@expo/config-plugins/build/android/GoogleMapsApiKey.js)
                     ↓ setGoogleMapsApiKey escribe la meta-data
                  com.google.android.geo.API_KEY en AndroidManifest.xml
```

Ese plugin lo registra `@expo/prebuild-config` **solo como fallback** del
legacy de `react-native-maps`
(`build/plugins/unversioned/react-native-maps.js:45`), y el legacy corre
siempre (`withDefaultPlugins.js:171-173`). `createLegacyPlugin.js` elige:

| `react-native-maps` autolinkado | Qué corre | Efecto |
|---|---|---|
| **Sí** (hoy, #52) | su `app.plugin.js` | lee `props.androidGoogleMapsApiKey`; **sin props borra la meta-data** |
| **No** (tras esta feature) | el fallback `withGoogleMapsApiKey` | lee `android.config.googleMaps.apiKey` |

Por eso #52 concluyó — con razón, en su contexto — que
`android.config.googleMaps.apiKey` "no sirve en este proyecto", y por eso
**sí** sirve aquí. La condición es desinstalar `react-native-maps`: no es
limpieza opcional, es el mecanismo.

**El plugin `expo-maps` no se declara** en `plugins`. Sus únicas props
documentadas son `requestLocationPermission` y `locationPermission`, y esta
app no dibuja la posición del dispositivo. El módulo nativo se autolinka igual
y su manifest se fusiona en tiempo de Gradle. Menos config, menos permisos
pedidos al usuario.

Nota de contención: al desaparecer `react-native-maps` desaparecen también
`ACCESS_FINE_LOCATION` / `ACCESS_COARSE_LOCATION`, que el fallback legacy
añadía de rebote (`withDefaultLocationPermissions`, condicionado a que el
paquete resuelva). La app no los usa. Es una reducción de permisos, no una
regresión.

### D3 — Tema oscuro: `colorScheme` nativo, y `map-style-dark.json` se borra (R4)

Dos opciones reales:

| Opción | Coste | Qué deja atrás |
|---|---|---|
| `properties={{ mapStyleOptions: { json: JSON.stringify(mapStyleDark) } }}` | serializar el JSON en cada render, mantener 200+ líneas de estilo | conserva el estilo exacto de #46 |
| **`colorScheme={GoogleMapsColorScheme.DARK / .LIGHT}`** | una prop | borra `src/theme/map-style-dark.json` |

Se elige `colorScheme`. Es la función nativa de la plataforma para exactamente
este problema (rung "native platform feature" antes que "config propia"), y el
requisito redactado es *"en tema oscuro el mapa se ve oscuro"*, no *"el mapa
usa este JSON"*. `src/theme/map-style-dark.json` queda sin un solo importador
y se borra en el mismo cierre (C7).

Se descarta `FOLLOW_SYSTEM`: el tema de esta app es una preferencia guardada
(`Uniwind.setTheme`, tab Profile), no la apariencia del sistema; con
`FOLLOW_SYSTEM` el mapa se desincronizaría del resto de la pantalla cuando el
usuario fuerza un tema distinto al del SO.

Consecuencia visual aceptada: el oscuro pasa a ser el de Google, no el
navy exacto que fijó #46 (`#242f3e`). Diferencia de matiz; el criterio del
gate es "se ve oscuro", y la comparación fina la hace el humano en R8.

### D4 — `initialRegion` → `cameraPosition`: de dónde sale `MAP_ZOOM = 16` (R2)

`expo-maps` no tiene deltas: `CameraPosition` es `{ coordinates, zoom }`. Hay
que convertir el `latitudeDelta: 0.01` de hoy a un nivel de zoom, de una vez y
por escrito.

```
0.01° de latitud            = 0.01 × 111 320 m      ≈ 1 113 m
alto útil del mapa          ≈ 800 dp (pantalla completa)
resolución necesaria        = 1 113 / 800            ≈ 1.39 m/dp
resolución de Google Maps   = 156 543.03 × cos(lat) / 2^zoom
   en Ciudad de México (lat 19.43°, cos ≈ 0.943)     ≈ 147 618 / 2^zoom
   1.39 = 147 618 / 2^zoom  ⇒  2^zoom ≈ 106 000      ⇒  zoom ≈ 16.7
```

Se fija **`MAP_ZOOM = 16`**, redondeando hacia abajo: 16 abre el encuadre a
~2.2 km de alto, que es lo que hace falta para que la **polyline del día**
quepa en pantalla (con 17 el mapa quedaría más cerca que hoy y la traza se
saldría). Es un valor de calibración: vive como constante exportada única en
`src/components/pet-map.tsx` y el smoke R8 puede subirlo o bajarlo un punto
sin tocar nada más.

**No se escribe una función pura `deltaToZoom(...)`.** Tendría un único punto
de llamada con argumentos constantes: es una constante con pasos intermedios,
no una función. La derivación queda aquí, versionada, que es donde alguien la
va a buscar dentro de seis meses.

`key={selectedPetId}` **se conserva** en `<PetMap>`: `cameraPosition` en
`expo-maps` es posición inicial de cámara, igual que `initialRegion` era
región inicial, así que el remontaje sigue siendo el mecanismo que recentra el
mapa al cambiar de mascota. Cambiarlo por una cámara controlada es rediseño y
está fuera de alcance.

### D5 — El wrapper NO ramifica por plataforma (R1, §Fuera de alcance)

`@react-native/jest-preset` fija `haste.defaultPlatform: 'ios'` y el proyecto
usa el preset raíz `jest-expo` (no el `universal`), así que **la suite entera
corre con `Platform.OS === 'ios'`** — comprobado ejecutando el preset, no
asumido.

Si `PetMap` hiciera `Platform.OS === 'ios' ? <AppleMaps.View/> : <GoogleMaps.View/>`,
todos los tests de R1–R4 probarían la rama **Apple**, que es justo la que el
dispositivo nunca ejecuta; peor, `colorScheme` no existe en `AppleMaps.View`,
así que R4 sería inasserteable. Un test que prueba la rama equivocada es peor
que no tener test: da luz verde falsa, que es exactamente el modo de fallo que
esta feature intenta evitar.

Por eso `PetMap` renderiza `GoogleMaps.View` sin condicional, y iOS queda
declarado fuera de alcance en [[requirements]]. Cuando iOS entre en alcance,
el cambio es local a este archivo y su spec tendrá que fijar además cómo se
pina la plataforma en los tests.

### D6 — Por qué existe el wrapper si solo lo usa una pantalla (R1)

`docs/ui-guidelines.md` §4 pide "≥2 pantallas" para promover a
`src/components/`. Aquí la razón no es reutilización visual:

1. §8 de la misma carta **prohíbe rutas con extensión de plataforma dentro de
   `src/app/`**; el día que iOS entre, la rama tiene que vivir fuera de
   `src/app/`. Este es su sitio.
2. Aísla en un archivo toda la superficie de una dependencia **alpha**: cuando
   `expo-maps` rompa su API, el diff es un archivo, no una pantalla de 330
   líneas.
3. Da un contrato JS pequeño y asserteable (R1–R4) que un test **sí** puede
   cubrir, frente a un render nativo que ningún test puede cubrir.
4. Es donde vive `MAP_ZOOM`, la única perilla de encuadre.

Queda escrito aquí para que el reviewer no lo lea como una excepción no
justificada a §4.

Reparto de responsabilidades:

- `map.tsx` conoce los tipos de API (`LastPosition`, `TripDetail`) y deriva
  `center`, `marker`, `polylines` y `colorScheme`.
- `PetMap` no importa nada de `src/api/`: solo traduce coordenadas planas a la
  forma de `expo-maps`.

### D7 — Cómo se mockea `expo-maps` en los tests (R1–R4)

Sustituye al mock actual de `react-native-maps`
(`src/app/(tabs)/__tests__/map.test.tsx:71-79`), con la misma forma: un `View`
que recibe las props para poder assertearlas.

```js
jest.mock('expo-maps', () => {
  const React = jest.requireActual('react');
  const { View } = jest.requireActual('react-native');
  const stub = (props) => React.createElement(View, props, props.children);
  return {
    __esModule: true,
    GoogleMaps: { View: stub },
    GoogleMapsColorScheme: { DARK: 'DARK', LIGHT: 'LIGHT', FOLLOW_SYSTEM: 'FOLLOW_SYSTEM' },
  };
});
```

Los valores del enum salen de los docs v57 (`DARK = "DARK"`,
`LIGHT = "LIGHT"`, `FOLLOW_SYSTEM = "FOLLOW_SYSTEM"`). **El implementer debe
confirmarlos contra `node_modules/expo-maps` justo después de instalar** y
corregir el mock si el paquete alpha difiere; los tests assertean los
literales `'DARK'` / `'LIGHT'`, así que un cambio de valores se detecta ahí.
No se usa `jest.requireActual('expo-maps')`: cargaría el módulo nativo real
bajo Node.

`transformIgnorePatterns` de `package.json` no necesita cambios: el negative
lookahead ya contiene `expo(nent)?`, que cubre `node_modules/expo-maps/`.

### D8 — Color de la polyline (R3, R7)

`expo-maps` no garantiza un color por defecto legible sobre el mapa oscuro, y
el gate R8 exige **ver** la polyline en ambos temas. Se pasa `color`
explícito, resuelto con `useThemeColors(['accent'])` dentro de `PetMap` —
la vía que impone `docs/ui-guidelines.md` §9 para color en código imperativo,
y la que mantiene el grep-clean C8 (cero hex fuera de `src/theme/`).

El test **no** congela el valor del color (bajo jest `Uniwind.getCSSVariable`
devuelve `undefined` y cae al fallback de `useThemeColors`): assertea
`expect.any(String)`. Que el contraste sea suficiente lo juzga el humano en
R8.

### D9 — Instalación exacta (R7)

El módulo móvil usa **bun** (`bun.lock`, `eas.json` fija `"bun": "1.3.14"`);
no hay pnpm aquí.

```bash
cd mobile-pet-tracker
bunx expo install expo-maps     # resuelve ~57.0.1 desde bundledNativeModules.json de SDK 57
bun remove react-native-maps
```

`bundledNativeModules.json:65` fija `"expo-maps": "~57.0.1"`; se instala con
`expo install` (no `bun add` a pelo) para que respete esa versión, tal como
manda `expo-overview` §Shared setup rules.

Desinstalar `react-native-maps` es seguro y obligatorio:
`grep -rn "react-native-maps"` fuera de `node_modules/` devuelve exactamente
`src/app/(tabs)/map.tsx:3`, `src/app/(tabs)/__tests__/map.test.tsx:71`,
`app.config.ts:26`, `app.config.test.ts`, `package.json:31` y `bun.lock` —
todos reescritos por esta feature. Además D2 depende de que desaparezca.

Tras instalar hay que **regenerar el proyecto nativo**
(`npx expo prebuild --clean --platform android`): `android/` está en
`.gitignore` y el módulo nativo nuevo no existe en el dev build actual.

## Archivos afectados

| Archivo | Qué cambia |
|---|---|
| `mobile-pet-tracker/package.json` | `+ expo-maps ~57.0.1`, `- react-native-maps` |
| `mobile-pet-tracker/bun.lock` | consecuencia de lo anterior |
| `mobile-pet-tracker/app.config.ts` | de la tupla `['react-native-maps', {...}]` a `android.config.googleMaps.apiKey`; el aviso sin clave se mantiene (nombra `GOOGLE_MAPS_API_KEY_ANDROID` y `docs/verification.md`) |
| `mobile-pet-tracker/app.config.test.ts` | se reescribe el `it` de `describe('R1: …')`; los describes `R2` y `R3` no se tocan |
| `mobile-pet-tracker/src/components/pet-map.tsx` | **nuevo**: `PetMap`, `MAP_ZOOM`, tipos `MapCoordinates` / `MapPolyline` / `PetMapProps` |
| `mobile-pet-tracker/src/components/__tests__/pet-map.test.tsx` | **nuevo**: R1–R4 |
| `mobile-pet-tracker/src/app/(tabs)/map.tsx` | quita imports de `react-native-maps` y del JSON de estilo; `DEFAULT_REGION` → `DEFAULT_CENTER` sin deltas; renderiza `<PetMap key={selectedPetId} …/>`; deriva `marker`, `polylines` (`id: 'trip-<index>'`) y `colorScheme` |
| `mobile-pet-tracker/src/app/(tabs)/__tests__/map.test.tsx` | mock `react-native-maps` → `expo-maps`; se reescriben los `it` de tres describes (nombres de describe intactos); mueren `map-marker` y `map-route-<i>` |
| `mobile-pet-tracker/src/theme/map-style-dark.json` | **borrado** (C7) |
| `docs/ui-guidelines.md` | §4 lista `pet-map.tsx`; §5 nota sobre el default `@expo/ui/community/*`; §9 mapa dark; línea 95 Expo Go → dev build |
| `docs/verification.md` | nota en §Feature 52 + nueva §Feature 54 con el runbook de R8 |
| `specs/android-maps-api-key/traceability.md` | una línea en la fila R1: mecanismo sustituido por #54 R5 |

`mobile-pet-tracker/app.json`, `.env.example`, `eas.json` y todo
`backend-pet-tracker/` **no se tocan**.

## Alternativas descartadas

- **`bun patch` sobre `attachLifecycleObserver`** (vía (a) del explorer): el
  discriminador descartó H1. Parchearía un ciclo de vida que ya funciona.
- **`googleRenderer="LEGACY"`**: probado en dispositivo, no pinta.
- **`liteMode` como modo de uso**: pinta, pero es un bitmap estático — sin
  zoom ni arrastre. Era una sonda de diagnóstico, no un producto.
- **Subir a `react-native-maps` 1.29.0**: ninguna release note posterior a
  1.27.2 toca la composición de la superficie; sale de
  `bundledNativeModules.json` y `expo-doctor` lo marcaría.
- **`properties.mapStyleOptions` con el JSON actual**: ver D3.
- **Rama `Platform.OS` con `AppleMaps.View`**: ver D5.
- **Archivos `pet-map.android.tsx` / `pet-map.ios.tsx`**: la carta solo
  prohíbe extensiones de plataforma dentro de `src/app/`, así que sería
  legal — pero jest resolvería `.ios.tsx` (D5) y volveríamos al mismo test
  que prueba la rama equivocada.
- **Declarar el plugin `expo-maps` en `plugins`**: solo aporta permisos de
  ubicación que esta app no usa (D2).
- **Función pura `deltaToZoom()`**: un solo punto de llamada con argumentos
  constantes (D4).

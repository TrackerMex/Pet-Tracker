# Discriminador #54 — android-map-never-ready

Fecha de redacción: 2026-08-28. Lo ejecuta **el humano** en el dev build de
Android. Sale de `progress/explore_android-map-never-ready.md` §D1.

## Por qué existe este documento

El tab Map solo pinta el watermark "Google": sin tiles, sin marker y sin
polyline, igual en tema claro y oscuro. Hay **dos causas posibles y llevan a
arreglos distintos**, así que escribir el fix antes de saber cuál es sería
apostar a cara o cruz con un dev build en cada intento:

- **H1 — ciclo de vida a medias.** Llegan `ON_CREATE` y `ON_START` pero no
  `ON_RESUME`: el `GoogleMap` se crea (por eso hay watermark) pero su
  superficie nunca arranca. Fix: parche de una línea en
  `attachLifecycleObserver` (`MapView.java:391`) vía `bun patch`.
- **H2 — el mapa ya está listo** y falla el render o la composición de la
  superficie del renderer "LATEST" de Play services bajo Fabric. Fix: un prop,
  o migrar a `expo-maps`. **Si es H2, parchear el ciclo de vida no hace
  nada.**

Lo que descarta cada resultado está en el informe del explorer. No repitas ese
trabajo: la clave, la versión del paquete, el `provider`, el backend y
`customMapStyle` ya están descartados con evidencia.

## Preparación

Son **props de JS**: basta Fast Refresh sobre el dev build ya instalado. **No
hace falta `prebuild` ni `run:android`.**

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

Los tres cambios de abajo son **temporales y no se commitean**. Al terminar,
`git checkout -- src/app/(tabs)/map.tsx`.

## Paso 1 — ¿llega `onMapReady`?

Es el que decide el diseño entero. En `src/app/(tabs)/map.tsx`, al `MapView`:

```jsx
<MapView
  key={selectedPetId}
  testID="map-view"
  onMapReady={() => console.log('[map] ready')}
  style={{ flex: 1 }}
  initialRegion={initialRegion}
  customMapStyle={theme === 'dark' ? mapStyleDark : undefined}
>
```

Guarda, entra al tab Map y mira:

```powershell
adb logcat -s ReactNativeJS
```

- **Sale `[map] ready`** → **H2**. El mapa está listo y aun así no pinta.
- **No sale** → **H1**. El `GoogleMap` nunca llega a estar listo.

Espera 15 segundos antes de dar por bueno un "no sale", y entra al tab desde
otra pestaña (el `key={selectedPetId}` remonta la vista al cambiar de
mascota, sirve para forzar un montaje limpio).

## Paso 2 — ¿pinta con el renderer antiguo?

Independiente del paso 1, y es el atajo bueno: si funciona, la feature se
resuelve con un prop y no hace falta ni parche ni migración.

```jsx
  googleRenderer="LEGACY"
```

`googleRenderer` se lee al **crear** la vista, así que no basta con guardar:
cambia de mascota o sal y entra al tab para forzar un montaje nuevo.

- **Pinta el mapa** → fin del diagnóstico. El fix es este prop más un test que
  fije el contrato.
- **Sigue igual** → sigue al paso 3.

## Paso 3 — ¿pinta como bitmap estático?

```jsx
  liteMode
```

En liteMode el mapa se dibuja como imagen estática en vez de superficie GL
(no se puede hacer zoom ni arrastrar; es solo una sonda, no un modo de uso).

- **Se ve en liteMode y no en normal** → H2 confirmado, y además apunta a
  composición de la superficie GL.
- **Tampoco se ve** → refuerza H1.

## Resultado (rellena el humano)

- Fecha:
- Paso 1, `[map] ready` en logcat: sí / no → si
- Paso 2, `googleRenderer="LEGACY"`: pinta / no pinta → no pinta
- Paso 3, `liteMode`: pinta / no pinta → si pinta
- Conclusión: H1 / H2
- `map.tsx` revertido: sí

Con esto se lanza `spec_author` sobre #54 con la causa ya decidida.

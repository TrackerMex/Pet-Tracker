---
feature: "android-map-never-ready"
issue: 54
branch: "feature/54-android-map-never-ready"
date: 2026-08-29
audience: "Codex CLI"
---

# Handoff a Codex CLI — android-map-never-ready (#54)

> Copia el bloque de abajo tal cual en la terminal de Codex CLI, desde la raíz
> del repo, con la branch `feature/54-android-map-never-ready` ya checked out.

```
Feature: android-map-never-ready, branch: feature/54-android-map-never-ready
Spec aprobada por humano el 2026-08-28: specs/android-map-never-ready/requirements.md (status: approved)
Lee también, completos y antes de escribir nada: specs/android-map-never-ready/design.md (D1-D9) y tasks.md

Qué es esta feature en una línea: el tab Map en Android solo pinta el watermark
"Google" — sin tiles, sin marker, sin polyline — y se migra de react-native-maps
a expo-maps para arreglarlo.

El diagnóstico YA ESTÁ CERRADO y no se reabre. Un discriminador en dispositivo
(progress/discriminador_android-map-never-ready.md) probó que onMapReady dispara,
que googleRenderer="LEGACY" no pinta y que liteMode SÍ pinta: la SurfaceView del
mapa no se compone en la jerarquía de Fabric. Descartados con evidencia: la clave
de Maps, la versión del paquete, el provider, el renderer, customMapStyle, el
backend y la hipótesis de ciclo de vida. react-native-maps@1.27.2 no expone
androidLayerType, zOrderOnTop ni TextureView: no hay prop de escape. No investigues
esto de nuevo; implementa la migración.

Antes de tocar código:
  - Carga la skill expo-overview de tu plugin expo (ya instalado). Si tocas el
    layout de la pantalla, carga también expo-native-ui.
  - Lee los docs VERSIONADOS https://docs.expo.dev/versions/v57.0.0/sdk/maps/
    nunca la variante `latest`. NO existe skill de expo-maps: los docs versionados
    y node_modules/expo-maps son la única fuente.
  - R0 de tasks.md: `bunx expo install expo-maps` + `bun remove react-native-maps`,
    y luego ABRE node_modules/expo-maps y confirma contra el código real el export
    GoogleMaps.View, el enum de colorScheme y las formas de CameraPosition,
    GoogleMapsMarker y GoogleMapsPolyline. Si algo difiere de los docs o de
    design.md §D7, anótalo en progress/impl_android-map-never-ready.md ANTES de
    escribir tests contra ello.

Archivos a crear/modificar (allowlist cerrada de R7; nada fuera de aquí):
  mobile-pet-tracker/package.json
  mobile-pet-tracker/bun.lock
  mobile-pet-tracker/app.config.ts
  mobile-pet-tracker/app.config.test.ts
  mobile-pet-tracker/src/components/pet-map.tsx                      (NUEVO)
  mobile-pet-tracker/src/components/__tests__/pet-map.test.tsx       (NUEVO)
  mobile-pet-tracker/src/app/(tabs)/map.tsx
  mobile-pet-tracker/src/app/(tabs)/__tests__/map.test.tsx
  mobile-pet-tracker/src/theme/map-style-dark.json                   (BORRADO)
  docs/ui-guidelines.md
  docs/verification.md
  specs/android-maps-api-key/traceability.md   (una nota de una línea en la fila R1)
  specs/android-map-never-ready/traceability.md
  progress/impl_android-map-never-ready.md
  feature_list.json

  SIN CAMBIOS, explícitamente: mobile-pet-tracker/app.json, eas.json,
  .env.example, .gitignore, el resto de mobile-pet-tracker/src/**,
  backend-pet-tracker/**, infra/**, .github/**, docs/architecture.md y
  docs/conventions.md.

Reglas críticas:
  - TDD por requisito: test rojo que NOMBRA su R-id, luego verde, luego refactor.
    UN COMMIT POR REQUISITO COMO MÍNIMO, con el commit del test rojo ANTES que su
    implementación. Un único commit con test + implementación + docs incumple C4
    de CHECKPOINTS.md y el reviewer rechaza. Esto ya pasó en la feature #19.
  - Actualiza specs/android-map-never-ready/traceability.md tras cada commit verde.
  - Convención de commit: feat(map): <desc> (R<n>) / test(map): ... / docs(map): ...
  - Sigue docs/conventions.md §Convenciones de la app móvil y docs/ui-guidelines.md
    (C8): cero hex fuera de src/theme/, cero clases arbitrarias [...], cero
    StyleSheet.create, cero shadow/elevation legacy. El color de la polyline sale
    de useThemeColors, nunca de un hex literal (design.md §D8).
  - docs/architecture.md no aplica: esta feature no toca backend-pet-tracker/.
  - No crees recursos AWS reales, no corras cdk deploy, no añadas variables de
    entorno ni dependencias fuera de expo-maps.
  - NUNCA escribas el valor de GOOGLE_MAPS_API_KEY_ANDROID en un commit, en un
    reporte, en un test ni en .env.example. La variable no lleva prefijo
    EXPO_PUBLIC_ (ese prefijo la inlinearía en el bundle JS). .env.example sigue
    trayendo solo el nombre vacío.

Dos límites del arnés que se incumplieron en la feature #44 y que aquí son
condición de aceptación, no cortesía:

  - NO TOQUES feature_list.json, STATUS.md ni progress/history.md. Marcar una
    feature como "done" es el cierre del leader tras el veredicto del reviewer
    (CLAUDE.md §Reglas duras, AGENTS.md §7.2). En #44 el implementador se
    autoconcedió el "done" y con ello desactivó el propio check de init.sh que
    debía detectar que faltaba la revisión. Tu reporte termina en
    progress/impl_android-map-never-ready.md y ahí paras. La allowlist de R7
    lista feature_list.json porque el LEADER lo edita al cerrar; tú no.
  - NO EDITES specs/android-map-never-ready/** una vez aprobada, salvo
    traceability.md, que sí te toca actualizar tras cada commit verde.
    requirements.md, design.md y tasks.md están firmados por el humano el
    2026-08-28 y son el contrato del handoff por disco: si el implementador
    puede reescribirlos, el gate humano deja de ser un gate. Si encuentras una
    errata, un requisito imposible o una contradicción, ANÓTALA en
    progress/impl_android-map-never-ready.md y PARA — que la ratifique el
    humano. No la corrijas tú, aunque la corrección sea obvia y correcta.
    (En #44 lo fue, y aun así rompió C6.)

Tres decisiones ya tomadas que NO se re-litigan:
  1. iOS queda FUERA DE ALCANCE. PetMap renderiza GoogleMaps.View en toda
     plataforma, SIN rama Platform.OS y SIN AppleMaps.View. Razón (design.md §D5):
     jest corre con Platform.OS === 'ios', así que una rama por plataforma haría
     que los tests probaran justo la rama que el dispositivo nunca ejecuta.
     Consecuencia aceptada: `expo run:ios` queda sin mapa funcional.
  2. El tema oscuro va por el colorScheme nativo de expo-maps ('DARK'/'LIGHT'),
     no por properties.mapStyleOptions, y src/theme/map-style-dark.json SE BORRA.
     Nada de FOLLOW_SYSTEM: el tema es una preferencia guardada del usuario.
  3. NO se declara ninguna entrada de plugins para expo-maps ni para
     react-native-maps en app.config.ts. El plugin de expo-maps solo aporta
     permisos de ubicación, que esta app no usa.

Por qué desinstalar react-native-maps es parte del mecanismo, no limpieza
cosmética (verificado en node_modules, no de memoria): @expo/prebuild-config
registra AndroidConfig.GoogleMapsApiKey.withGoogleMapsApiKey solo como FALLBACK
del plugin legacy de react-native-maps
(build/plugins/unversioned/react-native-maps.js:45), y createLegacyPlugin corre
ese fallback únicamente cuando el módulo NO está autolinkado. Con
react-native-maps instalado gana su propio app.plugin.js — por eso
android.config.googleMaps.apiKey no servía en #52 y sí sirve aquí.

Los tests de Jest NO pueden probar este bug, nunca. jest-expo corre en Node, sin
Play services y sin superficie GL; map.test.tsx mockea el mapa entero. La suite
del tab Map pasa HOY, verde, con el bug presente. Lo que fijan los tests es el
contrato JS: wrapper (R1), cámara y zoom (R2), derivación de marker/polylines
(R3), mapeo tema -> colorScheme (R4) y la clave en la config resuelta (R5). No
declares el bug arreglado porque la suite esté verde.

Trazabilidad heredada que NO puedes romper: conserva intactos los NOMBRES de los
describe existentes 'R6: mapa y marker con la última posición', 'R7: ruta del día
como polylines', 'R7 (mobile-figma-polish): mapa adapta su base al tema' y
'R1: la config resuelta inyecta la clave de Android desde el entorno' — los
referencian specs/mobile-map-live, specs/mobile-figma-polish y
specs/android-maps-api-key. Reescribe sus `it`, renombrados a
it('R<n> (android-map-never-ready): ...'). Los describes R2 y R3 de
app.config.test.ts no se tocan y deben seguir verdes. Los testIDs de #45
(lost-mode-button, lost-mode-error) y sus describes tampoco se tocan: #45 ya está
en main. Los únicos testIDs que desaparecen son map-marker y map-route-<i>, y su
desaparición se registra en el reporte.

Criterios de aceptación: R1, R2, R3, R4, R5, R6 y R7 de
specs/android-map-never-ready/requirements.md.

R8 NO ES TUYO. Es el smoke humano en dev build de Android: requiere dispositivo
real y confirmación explícita, por separado, de tiles + marker + polyline en
AMBOS temas. "Monta sin crash y hay watermark" NO cierra R8 — ese es exactamente
el estado defectuoso que arreglas. Tu trabajo con R8 es dejar el runbook literal
escrito en docs/verification.md §Feature 54 y parar.

Al terminar: escribe el resultado en progress/impl_android-map-never-ready.md
(comandos ejecutados con su exit code, tabla rojo/verde por R-id, la allowlist
comprobada, el grep C8, y la nota de R0 sobre cualquier diferencia entre
node_modules/expo-maps y los docs). No marques la feature como done: eso lo hace
el leader tras la revisión y tras el smoke humano de R8.
```

## Notas para el leader (no van a Codex)

- Riesgo asumido por el humano el 2026-08-28: `expo-maps` está en **alpha** y
  los docs v57 avisan de breaking changes frecuentes. La vía de vuelta está
  escrita en `requirements.md` §Contexto fijo — revertir los commits devuelve
  `react-native-maps@1.27.2`, pero **con el bug**.
- Si el smoke R8 sale bien salvo el encuadre, la única perilla es `MAP_ZOOM`
  (R2). Ajustarla no reabre el diseño ni exige una spec nueva.
- Si `expo-maps` resultara inviable ya en R0 (export ausente, enum distinto),
  Codex debe **parar y reportar**, no improvisar una tercera vía.

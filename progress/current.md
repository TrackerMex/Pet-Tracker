# Sesion activa

> Este archivo describe el estado de la sesion en curso.
> Al cerrar la sesion, mueve este contenido a progress/history.md y deja solo esta plantilla.

---

## Sesión 2026-08-28 (leader = sesión Backend)

### Feature #52 `android-maps-api-key` — done

Cerrada. Detalle en `progress/history.md`.

### Feature #45 `pet-lost-mode` — in_progress, desbloqueada

- Review APROBADO, PR #84 abierto. En `main` figura `pending`; el
  `in_progress` real viaja en su branch.
- Gate R9 (smoke en dev build de Android) **ya no está bloqueado**: el tab
  Map monta sin crash y el botón Lost Mode vive en la tarjeta superpuesta,
  que sí se renderiza. No depende de que el mapa pinte tiles (#54).
- Pendiente: que el humano corra R9, marque la casilla y mergee #84.

### Feature #54 `android-map-never-ready` — pending, P1

- El tab Map solo pinta el watermark "Google": sin tiles, sin marker y sin
  polyline, igual en tema claro y oscuro. Detectado durante el gate R6 de
  #52.
- `explorer` ejecutado → `progress/explore_android-map-never-ready.md`.
  Verificó la cadena `isReady`/`onMapReady`/ciclo de vida línea a línea y
  **refutó** el disparador que se sospechaba (`getCurrentActivity()` null):
  el watermark lo dibuja el delegate de play-services-maps, que no existe
  hasta que corre `onCreate`.
- Dos hipótesis vivas, con fixes distintos: **H1** ciclo de vida a medias
  (sin `ON_RESUME`) vs **H2** fallo de render/composición con el mapa ya
  listo.
- **Bloqueada por el discriminador**, que corre el humano en dispositivo:
  `onMapReady={() => console.log('[map] ready')}` en `map.tsx` +
  `adb logcat -s ReactNativeJS`; dispara = H2, no dispara = H1. Sondas del
  mismo viaje: `googleRenderer="LEGACY"` y `liteMode`. Son props JS: basta
  Fast Refresh, sin rebuild.
- Con el resultado se lanza `spec_author` con la causa decidida. No escribir
  el fix antes: elegir entre parche (`bun patch`, una línea sobre
  `attachLifecycleObserver`) y migrar a `expo-maps` (alpha, no corre en Expo
  Go, wrapper nuevo y ~9 aserciones reescritas) depende de esa respuesta.

### Feature #53 `mobile-jest-mock-hygiene` — pending, P3

Flake de `add-pet` por mocks sin reinicializar. Sin trabajo en curso.

### Deuda del harness detectada

- `docs/ui-guidelines.md:95` sigue exigiendo que todo corra en Expo Go SDK
  57; el smoke real es dev build de Android desde el 2026-08-25. Bloquea la
  vía `expo-maps` de #54 y merece su propia entrada de backlog.
- Commit local `5f74fc6` sin pushear (otra sesión Claude, hace obligatoria
  la skill `appllama-app-design-skill` en `docs/ui-guidelines.md`): decidir
  si se mueve a su propia branch + PR o se descarta.

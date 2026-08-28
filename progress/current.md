# Sesion activa

> Este archivo describe el estado de la sesion en curso.
> Al cerrar la sesion, mueve este contenido a progress/history.md y deja solo esta plantilla.

---

## Feature #44 `auth-forgot-password` — in_progress, P3

- Implementación iniciada por Codex: 2026-08-28 22:47 UTC, en
  `feature/44-auth-forgot-password`, con spec aprobada por humano.
- Gate inicial `./init.sh`: exit 0 (backend 152 suites/1162 tests; infra 2/14;
  mobile 50/561; e2e backend 22 suites/343 tests; lint y typecheck verdes).
- Plan TDD: R12 (schema/migración) → R1–R4 (solicitud uniforme) → R5–R8
  (reset) → R10/R11 (log/auditoría) → R9/R13 (e2e y contención). Cada R-id
  tendrá commit rojo previo a su implementación y trazabilidad inmediata.
- Contención fijada por R13: backend auth/db + tests y docs/harness de la
  allowlist; no se toca mobile, infra, variables de entorno ni el flujo
  `verify-email` existente.
- El primer gate arrancó en esta rama, pero otro checkout compartido dejó el
  worktree momentáneamente en #54; se restauró #44 antes de leer o editar
  código. Los archivos no versionados ajenos ya presentes se preservan.
- R12 completado por TDD: `64230ee` (rojo: faltaba migración) → `9cd8473`
  (verde: schema + migración 0015 + catálogo). Migración aplicada en
  Postgres local; tabla e índice confirmados; suite focalizada 7/7.
- R1 completado por TDD: `a40ceb2` (rojo: use case/handler ausentes) →
  `b3e0aaf` (verde: token SHA-256, TTL 1 h, sender y respuesta 200).
  Suites focalizadas 23/23, ESLint y typecheck verdes.

## Sesión 2026-08-28 (leader = sesión Backend)

### Features #52 `android-maps-api-key` y #45 `pet-lost-mode` — done

Cerradas. Detalle en `progress/history.md`.

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

### Verificación manual pendiente (no bloqueante)

- **R9 paso 5 de #45**: usuario `family` viendo el botón Lost Mode
  deshabilitado. No ejecutado por no haber uno seedeado en local; la spec lo
  redacta condicional y R7 lo cubre en `map.test.tsx`. Queda anotado en
  `progress/impl_pet-lost-mode.md` como pendiente de verificación manual.

### Deuda del harness detectada

- `docs/ui-guidelines.md:95` sigue exigiendo que todo corra en Expo Go SDK
  57; el smoke real es dev build de Android desde el 2026-08-25. Bloquea la
  vía `expo-maps` de #54 y merece su propia entrada de backlog.
- Commit local `5f74fc6` sin pushear (otra sesión Claude, hace obligatoria
  la skill `appllama-app-design-skill` en `docs/ui-guidelines.md`): decidir
  si se mueve a su propia branch + PR o se descarta.

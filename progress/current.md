# Sesion activa

> Este archivo describe el estado de la sesion en curso.
> Al cerrar la sesion, mueve este contenido a progress/history.md y deja solo esta plantilla.

---

## Sesión 2026-08-29 (leader = sesión Backend)

### Feature #44 `auth-forgot-password` — done

- Implementada por Codex CLI en `feature/44-auth-forgot-password`, R1–R13,
  backend puro. PR **#93**.
- `reviewer` ejecutado → `progress/review_auth-forgot-password.md`.
  **Veredicto: APROBADO.** El reviewer re-ejecutó `./init.sh` él mismo (exit 0)
  y las cifras coinciden exactas con el reporte del implementador; los 13
  commits rojos existen y preceden a su verde.
- **Pendiente humano antes del merge de #93** (no bloquea el código): ratificar
  en una línea la corrección del regex de contención de R13 descrita en el
  hallazgo H2 del review, para cerrar el hueco de C6.

### Feature #54 `android-map-never-ready` — in_progress, P1

- Causa **cerrada con evidencia**: el discriminador en dispositivo
  (`progress/discriminador_android-map-never-ready.md`) devolvió `onMapReady`
  dispara, `googleRenderer="LEGACY"` no pinta, `liteMode` sí pinta ⇒ la
  `SurfaceView` del mapa no se compone bajo Fabric. Descartadas la clave de
  Maps (#52), el renderer, `customMapStyle`, el backend y la hipótesis de ciclo
  de vida del explorer.
- Decisión del humano (2026-08-28): **migrar a `expo-maps`**, asumiendo su
  estado alpha. La vía de vuelta está escrita en la spec §Contexto fijo.
- Spec de `spec_author` aprobada por el humano el 2026-08-28 (909 líneas,
  R1–R8). Frontmatter puesto en `approved` por el leader el 2026-08-29 — la
  casilla estaba firmada pero los cuatro ficheros seguían en `draft` (quinta
  vez que ocurre: #50, #43, #52, #44, #54).
- Handoff a Codex CLI listo en `progress/handoff_android-map-never-ready.md`.
- Handoff fix 1 ejecutado el 2026-09-01 con TDD: test rojo `74f50f7` → fix
  verde `38168cf`; pendiente verificación completa y smoke humano R8.
- **R8 no lo cierra ninguna IA**: smoke humano en dev build de Android, en
  ambos temas, con confirmación por separado de tiles, marker y polyline.
  "Monta sin crash y hay watermark" es exactamente el estado defectuoso.

### Deuda del arnés detectada en la revisión de #44

Dos violaciones de orden cometidas por el implementador, ambas de proceso y
ninguna de código (H1 y H2 de `progress/review_auth-forgot-password.md`):

1. Codex marcó `#44` como `done` en `feature_list.json` sin veredicto de
   reviewer. Efecto colateral verificado: `./init.sh` pasó a reportar "sesión
   limpia" **por ese cierre prematuro**, así que el gate se validó a sí mismo.
2. Codex editó `specs/auth-forgot-password/requirements.md` ya aprobada. El
   cambio resultó legítimo (una línea, verificada ítem por ítem por el
   reviewer), pero que la corrección fuera correcta no valida el mecanismo.

Ambas prohibiciones quedan ya escritas como condición de aceptación en el
handoff de #54.

### Feature #53 `mobile-jest-mock-hygiene` — pending, P3

Flake de `add-pet` por mocks sin reinicializar. Sin trabajo en curso.

### Verificación manual pendiente (no bloqueante)

- **R9 paso 5 de #45**: usuario `family` viendo el botón Lost Mode
  deshabilitado. No ejecutado por no haber uno seedeado en local; la spec lo
  redacta condicional y R7 lo cubre en `map.test.tsx`. Anotado en
  `progress/impl_pet-lost-mode.md`.

### Backlog anotado, sin feature propia

- R-ids duplicados dentro de `auth.controller.spec.ts` (`R1`, `R2`, `R3`, `R5`
  aparecen dos veces: serie de `auth-registration` y serie de
  `auth-forgot-password`). No imputable al implementador — los nombres venían
  fijados en la spec aprobada. `auth-login-me` ya resolvió el mismo choque con
  el sufijo `(<feature>)`; conviene que `spec_author` lo aplique siempre que un
  R-id aterrice en un fichero de test compartido. Detalle en H5 del review.

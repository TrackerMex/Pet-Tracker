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

### Feature #54 `android-map-never-ready` — **done** (2026-09-01)

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
- **Causa raíz real, encontrada el 2026-09-01**: `src/app/(tabs)/map.tsx:175`
  declaraba `bg-background` en el contenedor que envuelve `PetMap`. Un
  `SurfaceView` se compone *por detrás* de la ventana; un ancestro con fondo
  opaco tapa el hueco sin producir ningún error. Evidencia y siete hipótesis
  descartadas en `progress/discriminador2_android-map-never-ready.md`.
  Explica por qué la migración a `expo-maps` no arregló nada: ambas librerías
  montan un `SurfaceView` y el contenedor nunca cambió.
- Handoff fix 1 ejecutado el 2026-09-01 con TDD: test rojo `74f50f7` → fix
  verde `38168cf`. `reviewer` **aprobado** en
  `progress/review_android-map-never-ready_fix1.md`: reprodujo el rojo por su
  cuenta en un worktree y `./init.sh` salió 0 (móvil 568 → 569 tests).
- **Smoke humano R8 aprobado** el 2026-09-01 (`81707dd`), con tiles, marker y
  polyline confirmados en ambos temas. Con eso el leader marca #54 `done`.
- Regla nueva que deja esta feature: `docs/ui-guidelines.md` §10 — ningún
  ancestro de una vista nativa de mapa declara fondo opaco.

### Feature #55 `mobile-map-zoom-controls` — **done** (2026-09-01)

- **Branch: `feature/mobile-map-zoom-controls`**, sacada de `main` por el
  humano. `main` está **protegida**: ninguna aprobación de spec ni ningún
  cambio se commitea ahí, siempre en branch. `tasks.md` §Rama quedó obsoleto
  (dice `feature/55-…` sacada de la branch de #54, que ya está mergeada); el
  handoff lo corrige por escrito en vez de editar una spec aprobada.
- Spec escrita por `spec_author` el 2026-09-01 en
  `specs/mobile-map-zoom-controls/` (R1–R3). **Aprobada por el humano** el
  2026-09-01 (`6f6c647`). Frontmatter de los 4 ficheros pasado de `draft` a
  `approved` por el leader — sexta vez que la casilla se firma con los
  ficheros en `draft` (#50, #43, #52, #44, #54, #55): merece automatizarse.
- Handoff a Codex ejecutado el 2026-09-01 con TDD: rojo `e052b07` → verde
  `bf14baf`, más dos commits de documentación. `reviewer` **aprobado** en
  `progress/review_mobile-map-zoom-controls.md`: no se limitó a comprobar que
  el test usa `toEqual`, sino que añadió `zoomGesturesEnabled: true` a mano y
  confirmó que el test se pone rojo. `./init.sh` exit 0, móvil 569 → 570.
- **Smoke humano R3 aprobado** el 2026-09-01 (`aa1da88`): controles `+` / `−`
  ausentes y pinch-to-zoom funcionando. Con eso el leader marca #55 `done`.
- **Aprendizaje de flujo**: Codex commiteó en el VPS y el handoff decía "no
  pushees" — plantilla pensada para cuando implementador y humano comparten
  working tree. Aquí no lo comparten, así que el humano no veía nada en su
  clon. A partir de ahora el leader pushea tras el veredicto del reviewer.
- Desviación declarada por Codex: su plugin `expo` es la v1.0.2 y **no
  contiene** `expo:expo-overview`; cargó `expo:building-native-ui`. Riesgo
  bajo aquí (la autoridad fueron los tipos instalados de `expo-maps` y el diff
  es un booleano), pero conviene actualizar el plugin antes de un handoff
  móvil grande.
- Alcance: `PetMap` pasa `uiSettings={{ zoomControlsEnabled: false }}` a
  `GoogleMaps.View`. Un archivo de producción (`src/components/pet-map.tsx`),
  su test y una sección nueva en `docs/verification.md`. `map.tsx` no se toca.
- Decisión ya tomada por el humano en la entrada #55: se **quitan** los
  controles, no se reubican; `contentPadding` descartado por acoplar el
  wrapper al alto de dos overlays. El pinch-to-zoom no se toca.
- R3 es un smoke humano en dev build de Android (controles `+` / `−` ausentes
  **y** pinch acercando/alejando). **Solo JS**: Fast Refresh sobre el dev build
  ya instalado, sin `prebuild` ni `run:android`.
- Dependía de #54 (`src/components/pet-map.tsx` lo crea esa feature); resuelto:
  #54 se mergeó en `main` con el PR **#94**.

### Choque de IDs entre sesiones — pendiente de resolver

`origin/feature/55-auth-email-delivery` (sesión Backend) salió de `38faa37`,
antes del merge del PR #94, y registró su propio **#55 `auth-email-delivery`**
y **#56 `auth-reset-deep-link`**. En `main` esos ids ya son
`mobile-map-zoom-controls` y `mobile-map-last-position-error-state`. Esa branch
tiene 56 features; `main` tiene 57.

Lo barato es renumerar la de auth (**#55 → #58**, **#56 → #59**), porque la
otra mitad ya está en `main`: son las dos entradas de su `feature_list.json`
más 7 menciones de texto (4 en `design.md`, 3 en `requirements.md`);
`tasks.md` y `traceability.md` no citan el número, y el directorio de la spec
va por nombre. Lo hace **la sesión que lleva esa branch**, y rebasa sobre
`main` después.

Causa de fondo, que va a repetirse: dos sesiones asignando ids contra el mismo
`feature_list.json` en ramas paralelas chocan siempre. O registra features una
sola sesión, o cada una reserva un rango.

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

### Feature #56 `mobile-map-last-position-error-state` — pending, P2

`map.tsx` no tiene rama para `last.data.kind === 'error'` ni `'unauthorized'`:
un 500 de `GET /pets/:id/positions/last` con mascotas cargadas deja la pantalla
vacía, sin mensaje ni reintento. Preexistente, invisible hasta el fix del
ancestro opaco. Detectado por el `reviewer` (observación 1 del review del fix 1),
no por un reporte de usuario.

### Feature #57 `localstack-presigned-url-lan-host` — pending, P2

Las URLs prefirmadas de S3 salen con host `localhost`, así que las fotos de
mascota no cargan en teléfono físico
(`ConnectException: Failed to connect to localhost/127.0.0.1:4566` en logcat
durante el smoke de #54). La firma SigV4 cubre el header `Host`, así que hay
que firmar ya con un host de la LAN, no reescribirlo después.

### Flake nuevo sin registrar — `health-vaccines` e2e

`backend-pet-tracker/test/health-vaccines.e2e-spec.ts` → `R12: auditoria de
mutaciones` (línea 470) falló una vez a Codex y pasó al repetir: Postgres
devolvió las tres acciones de auditoría en otro orden. Es una aserción que
depende del orden de un `SELECT` sin `ORDER BY` determinista. **No** es el
flake de `add-pet` (#53). Anotado por el reviewer de #55 (observación 3),
pendiente de decidir si se registra como feature propia.

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

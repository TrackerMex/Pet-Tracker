# Handoff a Codex CLI — feature #39 mobile-reminders

Feature: mobile-reminders (#39), branch: `feature/39-mobile-reminders` (ya existe, parte de ahí; NO trabajes en main)
Spec aprobada: `specs/mobile-reminders/requirements.md` (status: approved, R1–R12)
Lee también: `specs/mobile-reminders/design.md` (D1–D11) y `tasks.md`
Backend listo: #47 reminders-api ya está en esta branch (GET listado + DELETE).

Convenciones NUEVAS obligatorias (`docs/conventions.md` §Convenciones de la app móvil):

- **Estructura Expo oficial** — #39 es la primera feature bajo este patrón:
  route files DELGADOS en `src/app/…` (solo leen params y renderizan) y el
  cuerpo en `src/screens/<nombre>/index.tsx`; sub-componentes privados en
  la carpeta del screen; tests colocados junto al screen body; helpers en
  `src/utils/` con test al lado. Las rutas/carpetas exactas las fija la spec.
- **Dimensiones uniformes**: métricas de home.tsx (`insets.top + 12`,
  padding 24, gap 16, `insets.bottom + 96`), Skeleton dimensionado (nunca
  spinner que salte el layout), selector de mascota =
  `src/components/pet-switcher.tsx`.

Reglas críticas:

- TDD por requisito: COMMIT del test rojo ANTES del verde por cada R-id
  (R1–R12 salvo el smoke humano; C4 de CHECKPOINTS.md)
- Única dependencia nueva permitida:
  `@react-native-community/datetimepicker` en la versión bundled de Expo
  Go SDK 57 que fija la spec (instalar con `bunx expo install`). Ninguna
  otra.
- Entrada por Profile: link `reminders-link` mínimo sobre el placeholder
  actual de `profile.tsx`, con el contrato que la spec define para que
  #40 lo conserve. NO reescribas Profile.
- NO tocar `_layout.tsx`, `floating-tab-bar.tsx`, `backend-pet-tracker/`,
  `infra/`, ni pantallas ajenas a la spec.
- Cliente API en `src/api/reminders.ts` con el patrón fetchFn/kind de la
  spec; `src/api/` sigue sin imports de React ni expo-secure-store.
- Actualizar `specs/mobile-reminders/traceability.md` tras cada commit.
- Smoke humano será con Expo Go — nada nativo fuera del picker bundled.

Criterios de aceptación: R-ids de `requirements.md`, cada uno con test que
lo nombra.

Al terminar: `bun run test`, `bun run typecheck`, `bun run lint` verdes en
`mobile-pet-tracker/`, `./init.sh` exit 0, y escribir el resultado en
`progress/impl_mobile-reminders.md`.

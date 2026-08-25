# Handoff a Codex CLI — feature #40 mobile-pets-profile

Feature: mobile-pets-profile (#40), branch: `feature/40-mobile-pets-profile`
(ya existe y está pusheada; parte de ahí, NO trabajes en main).
Spec aprobada por humano (commit 49b85d6): `specs/mobile-pets-profile/requirements.md`
(status: approved, R1–R10; R10 es smoke humano, no lo implementas tú).
Lee también: `specs/mobile-pets-profile/design.md`, `tasks.md` y
`traceability.md`. Las decisiones del gate (Q1–Q4) ya están en firme dentro
de requirements.md — no reabras ninguna.

Skills Expo: usa las skills del plugin expo instalado en Codex
(expo-project-structure y afines) para toda decisión de estructura.

Convenciones duras (`docs/conventions.md` §Convenciones de la app móvil):

- Estructura Expo oficial: route files DELGADOS en `src/app/…` y cuerpo en
  `src/screens/<nombre>/index.tsx`, tests colocados junto al screen body,
  helpers en `src/utils/` con test al lado. Rutas exactas en la spec
  (`src/screens/profile/`, `src/screens/add-pet/`, `src/screens/docs/`,
  routes `src/app/pets/add.tsx` y `src/app/pets/[petId]/docs.tsx`).
- Dimensiones uniformes patrón home.tsx: `paddingTop: insets.top + 12`,
  padding 24, gap 16, `paddingBottom: insets.bottom + 96`; `Skeleton`
  dimensionado como el contenido final, nunca spinner que salte layout;
  selector de mascota = `src/components/pet-switcher.tsx`.
- Guardia design-drift (`src/__tests__/design-drift.test.ts`): cero hex,
  cero `StyleSheet.create`, cero `text-[10px]` (usa token `text-2xs`),
  `Card` compartido de `src/components/card.tsx`.

Reglas críticas:

- TDD por requisito: COMMIT del test rojo ANTES del verde por cada R-id
  (R1–R9; C4 de CHECKPOINTS.md). Excepción C4 permitida y documentada: la
  retirada de los tests de backend health en
  `src/app/(tabs)/__tests__/profile.test.tsx` (decisión Q2).
- Dependencias nuevas permitidas SOLO dos: `blobatar` core (`bun add
  blobatar`; `@blobatar/react` PROHIBIDO, web-only) y `expo-image-picker`
  (`bunx expo install expo-image-picker`, versión bundled SDK 57). Ninguna
  otra. `@gorhom/bottom-sheet` no se toca (peer dependency).
- Smoke humano será con Expo Go SDK 57 Android: `@expo/ui` root/universal
  CRASHEA — solo `Host` + `@expo/ui/community/*` (patrón real en
  `src/screens/add-reminder/index.tsx` para el datetimepicker de AddPet).
- Contratos que DEBEN sobrevivir a la reescritura de Profile (R3):
  `reminders-link` (Pressable, accessibilityRole button, push a
  `/reminders`), `profile-sign-out` (signOut de useAuth), `theme-toggle`
  (ahora además persiste, R4), testID raíz `screen-profile`. El check de
  backend health se ELIMINA (Q2).
- R8 (Docs): el endpoint `GET /v1/pets/:petId/media` NO existe todavía
  (feature #49 aparte). Implementa la pantalla contra el contrato descrito
  en la spec con `listPetDocs` en `src/api/media.ts` y fetchFn fake en
  tests. No toques `backend-pet-tracker/` para inventarlo.
- `src/api/` sin imports de React ni expo-secure-store; patrón fetchFn/kind
  de `src/api/reminders.ts`. La URL presignada del PUT de foto NO lleva
  token ni pasa por `http.ts` (R7).
- NO tocar: `_layout.tsx` salvo lo mínimo de R4 (restaurar tema
  persistido), `floating-tab-bar.tsx`, `backend-pet-tracker/`, `infra/`,
  pantallas ajenas a la spec (la única extensión fuera de Profile es el
  fallback blobatar del pet card de Home, R5).
- Actualizar `specs/mobile-pets-profile/traceability.md` tras cada commit.

Criterios de aceptación: R-ids de `requirements.md`, cada uno con el test
que lo nombra (rutas exactas en la spec).

Al terminar: `bun run test`, `bun run typecheck`, `bun run lint` verdes en
`mobile-pet-tracker/`, `./init.sh` exit 0, y escribir el resultado en
`progress/impl_mobile-pets-profile.md`.

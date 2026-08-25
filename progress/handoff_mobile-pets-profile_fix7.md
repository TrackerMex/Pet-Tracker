# Handoff fix 7 — review delta: 2 copias del auto-select fuera del hook (#40)

Veredicto del reviewer sobre fix2–fix6: RECHAZADO por un hallazgo
(`progress/review_mobile-pets-profile.md` §Delta review final). fix6
migró Home/Health/Food/Profile a `usePetSelection`, pero quedaron DOS
copias del efecto sin guards:

- `src/app/(tabs)/map.tsx:105-109` — tab montada/desenfocada con lista
  stale (su `useFocusEffect` no refetchea pets): reproduce latente el
  pisado de selección que el smoke encontró.
- `src/screens/reminders/index.tsx:61-68`.

## Qué hacer

1. Migrar AMBAS al hook `usePetSelection` de
   `src/hooks/use-pet-selection.ts`, igual que las otras 4 pantallas
   (misma firma; eliminar el efecto duplicado y los imports que queden
   muertos).
2. TDD (C4): commit rojo primero — guardia estructural que impida la
   regresión: extender `src/hooks/use-pet-selection.test.tsx` (o la
   guardia design-drift si encaja mejor) con un test tipo grep/AST que
   aserte que `selectionExists` (el patrón del efecto manual) NO existe
   fuera del hook en `src/`. Ese test debe estar ROJO con las 2 copias
   presentes y VERDE tras la migración. Además los tests de conducta de
   map/reminders deben seguir verdes sin cambios de contrato.
3. Trazabilidad: fila R10 (`hallazgo review fix7`) en
   `specs/mobile-pets-profile/traceability.md` y append en
   `progress/impl_mobile-pets-profile.md`.

## Reglas

- Cero dependencias nuevas. NO tocar `src/hooks/use-api.ts`,
  `src/providers/`, `_layout.tsx`, `floating-tab-bar.tsx`,
  `backend-pet-tracker/`, `infra/`, `src/api/`.
- Al terminar: `bun run test`, `typecheck`, `lint` verdes en
  `mobile-pet-tracker/`; `./init.sh` exit 0. Commit en la branch
  `feature/40-mobile-pets-profile`, no pushees.

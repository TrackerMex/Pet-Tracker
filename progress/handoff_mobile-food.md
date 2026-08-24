# Handoff a Codex CLI — feature #38 mobile-food

Feature: mobile-food (#38), branch: `feature/38-mobile-food` (ya existe, parte de ahí; NO trabajes en main)
Spec aprobada: `specs/mobile-food/requirements.md` (status: approved)
Lee también: `specs/mobile-food/design.md` (D1–D10) y `specs/mobile-food/tasks.md`

Archivos a crear/modificar (todos bajo `mobile-pet-tracker/`):

- `src/api/nutrition.ts` (nuevo) + tipos en `src/api/types.ts`
- `src/api/__tests__/nutrition.test.ts` (nuevo)
- `src/app/(tabs)/food.tsx` (reescritura)
- `src/app/(tabs)/__tests__/food.test.tsx` (nuevo)
- `src/app/(tabs)/meal-schedule.tsx` (nuevo, ruta oculta patrón `weight-log.tsx`)
- `src/app/(tabs)/__tests__/meal-schedule.test.tsx` (nuevo)
- `specs/mobile-food/traceability.md` (actualizar tras cada commit)

NO tocar: `_layout.tsx`, `floating-tab-bar.tsx`, `backend-pet-tracker/`, `infra/`

Reglas críticas:

- Seguir convenciones de `docs/conventions.md` §Convenciones de la app móvil
- TDD por requisito: COMMIT del test rojo ANTES del commit verde, por cada
  R-id (R1–R11). Un único commit con todo incumple C4 de `CHECKPOINTS.md`
- Única modificación permitida de tests existentes: quitar la fila Food de
  `screens.test.tsx` (excepción C4 documentada en tasks.md)
- Cero dependencias nuevas; el smoke será con Expo Go (nada de código nativo)
- Served/Pending derivado de hora local (`design.md` §D7, fake timers en tests)
- Botón Generate plan SOLO en meal-schedule (`design.md` §D9)
- `aiExplanation` nullable: render solo si no es null, sin hueco
- No crear recursos AWS reales ni correr `cdk deploy`

Criterios de aceptación: R1–R11 de `requirements.md`, cada uno con test que lo nombra.

Al terminar: `bun run test`, `bun run typecheck` y `bun run lint` verdes en
`mobile-pet-tracker/` y escribir el resultado en `progress/impl_mobile-food.md`.

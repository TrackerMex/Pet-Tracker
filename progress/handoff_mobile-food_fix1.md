# Handoff correcciones smoke R11 — feature #38 mobile-food

Hallazgos del smoke humano (2026-08-25, Expo Go) sobre la branch
`feature/38-mobile-food`. Dos correcciones, ambas alineando Food con el
patrón ya existente de `home.tsx` — no inventes patrones nuevos.

## Fix 1 — Safe area superior (título pegado a la status bar)

- `src/app/(tabs)/home.tsx:95` usa `paddingTop: insets.top + 12` en
  `contentContainerStyle`. `food.tsx` y `meal-schedule.tsx` NO lo tienen:
  el título "Food" queda hasta arriba, bajo la status bar.
- Corrige ambas pantallas con exactamente el mismo patrón de Home
  (`insets.top + 12`; ya importan `useSafeAreaInsets`).

## Fix 2 — Flash al cargar datos

- Al entrar a Food se ve un flash: `Spinner` suelto y luego el contenido
  salta al llegar los datos.
- Home resuelve esto con `Skeleton` dimensionados como el contenido final
  (`home.tsx:156` `<Skeleton className="h-32 w-full rounded-2xl" />`,
  `home.tsx:277` skeleton del summary). Aplica el mismo patrón en
  `food.tsx` (y en `meal-schedule.tsx` si tiene el mismo síntoma):
  skeletons con el alto aproximado de las cards reales en vez de spinner
  suelto para los estados `data === undefined` que pintan bloques de
  contenido. El `Spinner` de pets puede quedarse si no produce salto de
  layout; el criterio es: sin saltos visibles al llegar los datos.

## Reglas

- TDD: commit del test rojo ANTES del commit del fix, por cada fix
  (C4 de CHECKPOINTS.md). Los testID existentes no se cambian; si un
  skeleton nuevo necesita testID, patrón `food-*-skeleton` como Home.
- Cero dependencias nuevas. NO tocar `_layout.tsx`,
  `floating-tab-bar.tsx`, `backend-pet-tracker/`, `infra/`, ni `src/api/`.
- Actualizar `specs/mobile-food/traceability.md` (los fixes cuelgan de
  R4/R5/R7 según pantalla) y registrar los hallazgos del smoke en
  `progress/impl_mobile-food.md` §R11 (fecha 2026-08-25, hallazgos y
  correcciones, smoke pendiente de repetirse).
- Al terminar: `bun run test`, `typecheck` y `lint` verdes en
  `mobile-pet-tracker/`; append del resultado en
  `progress/impl_mobile-food.md`.

# Implementación #104 — nutrition-kcal-consumed

## §0 Entorno y línea base

- `pwd`: `/home/claude/sites/Pet-Tracker-wt-backend`
- `git branch --show-current`: `feature/104-nutrition-kcal-consumed`
- HEAD inicial: `28aa4155` (descendiente de la firma `5b743931`); árbol limpio.
- Skill cargada: `ponytail:ponytail` (full). Ninguna skill de Expo.
- Spec aprobada leída completa: `requirements.md`, `design.md`, `tasks.md`, `traceability.md`.
- `select to_regclass('public.meal_servings')` en `pet_tracker_wt`: `meal_servings`.
- Línea base provista por el leader, `./init.sh` exit=0 en esta branch: backend unit 170 suites, 1295 tests; e2e 27 suites passed + 3 skipped (30), 384 tests passed + 8 skipped; móvil 77 suites, 1412 tests. No se repite `./init.sh` por LocalStack compartido.

## R1

- Rojo (`1edd6f37`): `pnpm test -- meal-serving.entity` → `exit=1`; 1 suite failed, 3 tests nuevos failed y los 4 de R11 pasaron. Los tres fallan con `TypeError: ...kcalConsumed is not a function` porque aún no se exporta.
- Verde: `pnpm test -- meal-serving.entity` → `exit=0`, 1 suite, 7 tests; `pnpm exec tsc --noEmit` → `exit=0`; `pnpm lint` → `exit=0`.

## R2

Pendiente.

## R3

Pendiente.

## R4

Pendiente.

## Cierre

Pendiente.

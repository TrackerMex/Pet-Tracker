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

- Rojo `pnpm test:e2e -- meals.e2e-spec` → `exit=1`, 1 suite failed, 2 failed / 16 passed: R2 `toMatchObject` esperaba `kcalConsumedToday: 0` y faltaba; R9 de #83 esperaba la misma clave en `Object.keys` y faltaba. Los otros tests pasan.
- Rojo `pnpm test:e2e -- nutrition.e2e-spec` → `exit=1`, 1 suite failed, 1 failed / 22 passed: R24 de #17 esperaba `kcalConsumedToday: 0` en `toEqual` y faltaba. Los otros tests pasan.
- Verde compartido R2-R4: `pnpm test:e2e -- meals.e2e-spec` → `exit=0`, 1 suite, 22 tests; `pnpm test:e2e -- nutrition.e2e-spec` → `exit=0`, 1 suite, 23 tests. R2, R9 y R24 pasan.

## R3

- Rojo `pnpm test:e2e -- meals.e2e-spec` → `exit=1`, 4 failed / 16 passed: los 2 casos R3 fallan por `kcalConsumedToday` ausente (`530` hoy en zona extrema; `0` ayer). `servedOn` y `servedToday` sí coinciden con el día civil del owner. Persisten los rojos previstos de R2 y R9.
- Verde compartido: ambos casos pasan dentro de los 22/22 de `meals.e2e-spec`.

## R4

- Rojo `pnpm test:e2e -- meals.e2e-spec` → `exit=1`, 6 failed / 16 passed: los 2 casos R4 fallan por `kcalConsumedToday` ausente (`530` antes del cambio; `0` con franjas nuevas). Las inserciones del plan vigente y `servedToday` funcionan. Persisten los rojos previstos de R2, R3 y R9.
- Verde compartido: ambos casos pasan dentro de los 22/22 de `meals.e2e-spec`.

## Cierre

- `pnpm test` → `exit=0`, 170 suites, 1298 tests (+3 respecto a 1295).
- `pnpm exec tsc --noEmit` → `exit=0`.
- `pnpm lint` → `exit=0`.
- E2E filtrados: `meals.e2e-spec` 22/22 (+5); `nutrition.e2e-spec` 23/23 (sin cambio). Mismas suites. Cada e2e se lanzó con `pgrep -af 'init\.sh|test:e2e|jest-e2e' | grep -v pgrep` vacío.
- No se corrió `./init.sh` completo por indicación del leader (LocalStack compartido); lo hará el reviewer.
- Commits en orden:
  1. `1edd6f37` `test(nutrition-kcal-consumed): kcalConsumed reparte a partes iguales (R1)` — rojo.
  2. `a16dc9e1` `feat(nutrition-kcal-consumed): kcalConsumed en dominio (R1)` — verde.
  3. `12239597` `test(nutrition-kcal-consumed): GET del plan con kcalConsumedToday (R2)` — rojo.
  4. `109f0060` `test(nutrition-kcal-consumed): kcal del dia civil del owner (R3)` — rojo.
  5. `bf6217af` `test(nutrition-kcal-consumed): kcal con el plan vigente tras regenerar (R4)` — rojo.
  6. `e7ae5971` `feat(nutrition-kcal-consumed): GET del plan devuelve kcalConsumedToday (R2,R3,R4)` — verde.
- La trazabilidad se actualizó tras cada commit. Los cambios finales de trazabilidad y este reporte van en un commit documental de cierre, sin reescribir los seis hashes de TDD.

---
feature: "nutrition-profile-engine"
status: approved     # draft | approved
tags: [harness, spec]
---

# Trazabilidad — [[nutrition-profile-engine]]

> Rutas relativas a `backend-pet-tracker/`. Los tests nombran su requisito como
> `R<n> (nutrition-profile-engine #17): ...` — #18 escribirá R-ids en los mismos
> archivos y sin el sufijo C4 deja de ser verificable por grep.
>
> La columna "Commit" lleva **dos** hashes: el commit del test rojo y el de la
> implementación que lo pone verde (C4 de `CHECKPOINTS.md` exige que el historial
> muestre el patrón). Un solo hash por fila es motivo de rechazo.

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `src/modules/nutrition/domain/nutrition-engine.spec.ts::R1 (nutrition-profile-engine #17): el motor es puro y sin literales` | rojo: `f255ca6 test(nutrition-profile-engine): require pure engine constants (R1)`; verde: `e619962 feat(nutrition-profile-engine): add pure engine contract and constants (R1)` |
| R2 | `src/modules/nutrition/domain/nutrition-engine.spec.ts::R2 (nutrition-profile-engine #17): RER y peso base` | rojo: `469340f test(nutrition-profile-engine): cover RER base weight precedence (R2)`; verde: `f093a2b feat(nutrition-profile-engine): calculate RER from clinical base weight (R2)` |
| R3 | `src/modules/nutrition/domain/nutrition-engine.spec.ts::R3 (nutrition-profile-engine #17): tabla de factores MER y precedencia` | rojo: `b9ab034 test(nutrition-profile-engine): cover MER factors and precedence (R3)`; verde: `ac74daa feat(nutrition-profile-engine): apply MER factor precedence (R3)` |
| R4 | `src/modules/nutrition/domain/nutrition-engine.spec.ts::R4 (nutrition-profile-engine #17): redondeo de kcal y gramos` | rojo: `3a39b1c test(nutrition-profile-engine): pin calorie and gram rounding (R4)`; verde: `bd9fa4c feat(nutrition-profile-engine): round calories and daily grams (R4)` |
| R5 | `src/modules/nutrition/domain/nutrition-engine.spec.ts::R5 (nutrition-profile-engine #17): comidas por dia` | rojo: `e19bd1e test(nutrition-profile-engine): cover meals by age and species (R5)`; verde: `893bc0b feat(nutrition-profile-engine): assign meals per day (R5)` |
| R6 | `src/modules/nutrition/domain/nutrition-engine.spec.ts::R6 (nutrition-profile-engine #17): horarios por numero de comidas` | pendiente |
| R7 | `src/modules/nutrition/domain/nutrition-engine.spec.ts::R7 (nutrition-profile-engine #17): objective` | pendiente |
| R8 | `src/modules/nutrition/domain/nutrition-engine.spec.ts::R8 (nutrition-profile-engine #17): warning weight_loss_plan` | pendiente |
| R9 | `src/modules/nutrition/domain/nutrition-engine.spec.ts::R9 (nutrition-profile-engine #17): warning underweight_vet` | pendiente |
| R10 | `src/modules/nutrition/domain/nutrition-engine.spec.ts::R10 (nutrition-profile-engine #17): warning chronic_disease_vet` | pendiente |
| R11 | `src/modules/nutrition/domain/nutrition-engine.spec.ts::R11 (nutrition-profile-engine #17): warning check_food_allergens` | pendiente |
| R12 | `src/modules/nutrition/domain/nutrition-engine.spec.ts::R12 (nutrition-profile-engine #17): warning too_young_vet` | pendiente |
| R13 | `src/modules/nutrition/domain/nutrition-engine.spec.ts::R13 (nutrition-profile-engine #17): orden fijo y acumulacion de warnings` | pendiente |
| R14 | `src/modules/nutrition/domain/nutrition-engine.spec.ts::R14 (nutrition-profile-engine #17): los cuatro casos ancla con valores exactos` | pendiente |
| R15 | `src/db/schema/nutrition.schema.spec.ts::R15 (nutrition-profile-engine #17): tablas de nutricion y migracion 0013 nueva` | pendiente |
| R16 | `test/nutrition.e2e-spec.ts::R16 (nutrition-profile-engine #17): PUT del perfil es upsert de reemplazo total` | pendiente |
| R17 | `test/nutrition.e2e-spec.ts::R17 (nutrition-profile-engine #17): GET del perfil devuelve 200 o 404` | pendiente |
| R18 | `test/nutrition.e2e-spec.ts::R18 (nutrition-profile-engine #17): validacion del DTO sin defaults de kcalPer100g` | pendiente |
| R19 | `test/nutrition.e2e-spec.ts::R19 (nutrition-profile-engine #17): generate compone el input y responde el plan` | pendiente |
| R20 | `src/modules/nutrition/application/nutrition-input-hash.spec.ts::R20 (nutrition-profile-engine #17): hash canonico estable e independiente del orden` | pendiente |
| R21 | `test/nutrition.e2e-spec.ts::R21 (nutrition-profile-engine #17): mismo input devuelve el mismo plan sin fila nueva` | pendiente |
| R22 | `test/nutrition.e2e-spec.ts::R22 (nutrition-profile-engine #17): generate sin perfil responde 422 NUTRITION_PROFILE_REQUIRED` | pendiente |
| R23 | `test/nutrition.e2e-spec.ts::R23 (nutrition-profile-engine #17): generate sin peso responde 422 PET_WEIGHT_REQUIRED` | pendiente |
| R24 | `test/nutrition.e2e-spec.ts::R24 (nutrition-profile-engine #17): GET del plan devuelve el ultimo o 404` | pendiente |
| R25 | `test/nutrition.e2e-spec.ts::R25 (nutrition-profile-engine #17): PetAccessGuard y ausencia de muro de pago` | pendiente |
| R26 | `test/nutrition.e2e-spec.ts::R26 (nutrition-profile-engine #17): aiExplanation es null` + `src/modules/nutrition/nutrition-scope.spec.ts::R26 (nutrition-profile-engine #17): sin dependencia openai ni env OPENAI_` | pendiente |
| R27 | `test/nutrition.e2e-spec.ts::R27 (nutrition-profile-engine #17): numeric llega al cliente como number` | pendiente |

Regla: el reviewer no aprueba si alguna fila queda "pendiente".
Convención de commit: `feat(nutrition-profile-engine): <desc> (R1,R2)`.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).

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
| R6 | `src/modules/nutrition/domain/nutrition-engine.spec.ts::R6 (nutrition-profile-engine #17): horarios por numero de comidas` | rojo: `c593500 test(nutrition-profile-engine): pin fixed meal schedules (R6)`; verde: `7c38258 feat(nutrition-profile-engine): map meals to fixed schedules (R6)` |
| R7 | `src/modules/nutrition/domain/nutrition-engine.spec.ts::R7 (nutrition-profile-engine #17): objective` | rojo: `b373be3 test(nutrition-profile-engine): cover objective precedence (R7)`; verde: `f27fad4 feat(nutrition-profile-engine): derive nutrition objective (R7)` |
| R8 | `src/modules/nutrition/domain/nutrition-engine.spec.ts::R8 (nutrition-profile-engine #17): warning weight_loss_plan` | rojo: `070c938 test(nutrition-profile-engine): guard weight loss warning (R8)`; verde: `33cb04c feat(nutrition-profile-engine): emit weight loss warning (R8)` |
| R9 | `src/modules/nutrition/domain/nutrition-engine.spec.ts::R9 (nutrition-profile-engine #17): warning underweight_vet` | rojo: `f092130 test(nutrition-profile-engine): guard underweight warning (R9)`; verde: `c9702ab feat(nutrition-profile-engine): emit underweight warning (R9)` |
| R10 | `src/modules/nutrition/domain/nutrition-engine.spec.ts::R10 (nutrition-profile-engine #17): warning chronic_disease_vet` | rojo: `6cea9e7 test(nutrition-profile-engine): guard chronic disease warning (R10)`; verde: `96067f8 feat(nutrition-profile-engine): emit chronic disease warning (R10)` |
| R11 | `src/modules/nutrition/domain/nutrition-engine.spec.ts::R11 (nutrition-profile-engine #17): warning check_food_allergens` | rojo: `0080f31 test(nutrition-profile-engine): guard allergen warning (R11)`; verde: `570e54a feat(nutrition-profile-engine): emit allergen warning (R11)` |
| R12 | `src/modules/nutrition/domain/nutrition-engine.spec.ts::R12 (nutrition-profile-engine #17): warning too_young_vet` | rojo: `e254816 test(nutrition-profile-engine): guard too young warning (R12)`; verde: `d6aeb2f feat(nutrition-profile-engine): emit too young warning (R12)` |
| R13 | `src/modules/nutrition/domain/nutrition-engine.spec.ts::R13 (nutrition-profile-engine #17): orden fijo y acumulacion de warnings` | rojo: `c27f43b test(nutrition-profile-engine): require ordered warning accumulation (R13)`; verde: `2d45427 feat(nutrition-profile-engine): order and accumulate warnings (R13)` |
| R14 | `src/modules/nutrition/domain/nutrition-engine.spec.ts::R14 (nutrition-profile-engine #17): los cuatro casos ancla con valores exactos` | test ancla: `026258c test(nutrition-profile-engine): lock four exact anchor cases (R14)`; verde: `92d636c feat(nutrition-profile-engine): preserve anchor rounding chain (R14)` |
| R15 | `src/db/schema/nutrition.schema.spec.ts::R15 (nutrition-profile-engine #17): tablas de nutricion y migracion 0013 nueva` | rojo: `12d2ae0 test(nutrition-profile-engine): require nutrition tables and migration (R15)`; test completo: `8be4a4b test(nutrition-profile-engine): include food type constraint (R15)`; verde: `89efb95 feat(nutrition-profile-engine): add nutrition tables and migration (R15)` |
| R16 | `test/nutrition.e2e-spec.ts::R16 (nutrition-profile-engine #17): PUT del perfil es upsert de reemplazo total` | rojo: `ef9addd test(nutrition-profile-engine): cover profile replacement upsert (R16)`; verde: `45e9f24 feat(nutrition-profile-engine): add profile replacement endpoint (R16)` |
| R17 | `test/nutrition.e2e-spec.ts::R17 (nutrition-profile-engine #17): GET del perfil devuelve 200 o 404` | rojo: `9207b2d test(nutrition-profile-engine): cover profile retrieval and missing error (R17)`; verde: `21482e1 feat(nutrition-profile-engine): add profile retrieval endpoint (R17)` |
| R18 | `test/nutrition.e2e-spec.ts::R18 (nutrition-profile-engine #17): validacion del DTO sin defaults de kcalPer100g` | rojo: `9dfd8d0 test(nutrition-profile-engine): reject invalid profile payloads (R18)`; verde: `d530faa feat(nutrition-profile-engine): enforce strict profile validation (R18)` |
| R19 | `test/nutrition.e2e-spec.ts::R19 (nutrition-profile-engine #17): generate compone el input y responde el plan` | rojo: `712dcef test(nutrition-profile-engine): cover plan generation composition (R19)`; verde: `2d914f7 feat(nutrition-profile-engine): generate deterministic nutrition plans (R19)` |
| R20 | `src/modules/nutrition/application/nutrition-input-hash.spec.ts::R20 (nutrition-profile-engine #17): hash canonico estable e independiente del orden` | rojo: `788bfc3 test(nutrition-profile-engine): pin canonical input hash (R20)`; verde: `1de7a02 feat(nutrition-profile-engine): hash canonical engine inputs (R20)` |
| R21 | `test/nutrition.e2e-spec.ts::R21 (nutrition-profile-engine #17): mismo input devuelve el mismo plan sin fila nueva` | rojo: `3f78fb7 test(nutrition-profile-engine): cover latest-plan idempotency (R21)`; verde: `cfc1f07 feat(nutrition-profile-engine): reuse latest plan by input hash (R21)` |
| R22 | `test/nutrition.e2e-spec.ts::R22 (nutrition-profile-engine #17): generate sin perfil responde 422 NUTRITION_PROFILE_REQUIRED` | rojo: `a78313f test(nutrition-profile-engine): guard missing profile generation (R22)`; verde: `a2be049 feat(nutrition-profile-engine): map missing profile to 422 (R22)` |
| R23 | `test/nutrition.e2e-spec.ts::R23 (nutrition-profile-engine #17): generate sin peso responde 422 PET_WEIGHT_REQUIRED` | rojo: `0009bb9 test(nutrition-profile-engine): guard missing weight generation (R23)`; verde: `60fcf86 feat(nutrition-profile-engine): map missing weight to 422 (R23)` |
| R24 | `test/nutrition.e2e-spec.ts::R24 (nutrition-profile-engine #17): GET del plan devuelve el ultimo o 404` | rojo: `60764e8 test(nutrition-profile-engine): require latest plan retrieval (R24)`; verde: `03ec047 feat(nutrition-profile-engine): return latest nutrition plan (R24)` |
| R25 | `test/nutrition.e2e-spec.ts::R25 (nutrition-profile-engine #17): PetAccessGuard y ausencia de muro de pago` | rojo: `bf5ee5d test(nutrition-profile-engine): enforce free pet access policy (R25)`; verde: `ea19425 feat(nutrition-profile-engine): enforce free pet access policy (R25)` |
| R26 | `test/nutrition.e2e-spec.ts::R26 (nutrition-profile-engine #17): aiExplanation es null` + `src/modules/nutrition/nutrition-scope.spec.ts::R26 (nutrition-profile-engine #17): sin dependencia openai ni env OPENAI_` | rojo: `e1f5ce4 test(nutrition-profile-engine): require null AI boundary (R26)`; verde: `7957456 feat(nutrition-profile-engine): keep AI explanation null (R26)` |
| R27 | `test/nutrition.e2e-spec.ts::R27 (nutrition-profile-engine #17): numeric llega al cliente como number` | test ancla (verde por R16): `5ac4065 test(nutrition-profile-engine): cover numeric response boundary (R27)`; implementacion: `45e9f24 feat(nutrition-profile-engine): implement profile replacement upsert (R16)` |

Regla: el reviewer no aprueba si alguna fila queda "pendiente".
Convención de commit: `feat(nutrition-profile-engine): <desc> (R1,R2)`.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).

---
feature: "mobile-food"
status: draft        # draft | approved
tags: [harness, spec, mobile]
---

# Trazabilidad — [[mobile-food]]

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `src/api/__tests__/nutrition.test.ts::R1: getNutritionProfile mapea la respuesta por kind` | `807891a feat(mobile-food): add nutrition profile client (R1)` |
| R2 | `src/api/__tests__/nutrition.test.ts::R2: getNutritionPlan mapea la respuesta por kind` | `96b8526 feat(mobile-food): add nutrition plan client (R2)` |
| R3 | `src/api/__tests__/nutrition.test.ts::R3: generateNutritionPlan publica y mapea por kind` | `695ad9a feat(mobile-food): add plan generation client (R3)` |
| R4 | `src/app/(tabs)/__tests__/food.test.tsx::R4: food resuelve la mascota seleccionada` | `95bc9f7 feat(mobile-food): resolve pets in food hub (R4)` |
| R5 | `src/app/(tabs)/__tests__/food.test.tsx::R5: plan del día con horarios y warnings` | `4498939 feat(mobile-food): render daily meal plan (R5)` |
| R6 | `src/app/(tabs)/__tests__/food.test.tsx::R6: aiExplanation nullable con gracia` | `a456c01 feat(mobile-food): render optional AI recommendation (R6)` |
| R7 | `src/app/(tabs)/__tests__/meal-schedule.test.tsx::R7: meal schedule muestra horarios y perfil` | `fc8a951 feat(mobile-food): add meal schedule details (R7)` |
| R8 | `src/app/(tabs)/__tests__/meal-schedule.test.tsx::R8: generar plan con degradación por kind` | pendiente |
| R9 | `bun run typecheck`; `bun run lint` | pendiente |
| R10 | `bun run test`; `./init.sh`; checks de contención de rutas, dependencias e imports | pendiente |
| R11 | `requirements.md::R11 smoke humano en Expo Go (reservado al humano)` | pendiente |

Regla: el reviewer no aprueba si alguna fila queda "pendiente".
Convención de commit: `feat(mobile-food): <desc> (R1,R2)`.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).

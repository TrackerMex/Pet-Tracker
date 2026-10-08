---
feature: "nutrition-ai-explainer"
status: draft        # draft | approved
tags: [harness, spec]
---

# Trazabilidad — [[nutrition-ai-explainer]]

> **Enmienda 2026-10-08 (proveedor Anthropic).** Esta tabla se reinicia: los
> hashes de la implementación con OpenAI (rondas 1 y 2) pertenecen a una branch
> que no se mergeó y no valen como evidencia de esta. Todas las filas vuelven a
> "pendiente".
>
> Rutas relativas a `backend-pet-tracker/` salvo las de `docs/` y `.env.example`,
> que son de la raíz del repo. Los tests nombran su requisito como
> `R<n> (nutrition-ai-explainer #18): ...` — #17 escribió R1..R27 en **estos
> mismos archivos** y sin el sufijo C4 deja de ser verificable por grep. La
> columna "Test" fija archivo y prefijo; el resto del nombre lo pone quien
> implementa y lo copia aquí literal.
>
> La columna "Commit" lleva **dos** hashes: el commit del test rojo y el de la
> implementación que lo pone verde (C4 de `CHECKPOINTS.md` exige que el historial
> muestre el patrón). Un solo hash por fila es motivo de rechazo. Si la fila
> tiene una guarda que nace verde, el rojo se acredita con la sonda de mutación
> pegada en `progress/impl_nutrition-ai-explainer.md` (cítese la sección).
>
> **R1 es la excepción declarada**: su commit de test deja la suite roja a
> propósito (deroga R26 de #17) y se pone verde con R4 + R5 + R17 + la
> dependencia `@anthropic-ai/sdk`. Anotar el hash del rojo y el último de esos
> verdes, y citar en el mensaje el R-id derogado.
>
> **R19 no se cierra con un commit**: es un gate humano. Su fila se completa con
> la fecha de la prueba de humo y el commit que registra la evidencia en
> `docs/verification.md` / `STATUS.md`. Ni Codex ni el `reviewer` pueden darla
> por cumplida.

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `src/modules/nutrition/nutrition-scope.spec.ts::R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo` + recorte del bloque R26 de #17 en `test/nutrition.e2e-spec.ts` (R1(b)) + bloque R12 de #103 en `test/meal-times.e2e-spec.ts` (R1(c)) | pendiente |
| R2 | `src/modules/nutrition/nutrition-scope.spec.ts::R1 ...` (aserciones 5 y 11) | pendiente |
| R3 | `src/modules/nutrition/infrastructure/ai/nutrition-explainer.factory.spec.ts::R3 (nutrition-ai-explainer #18): ...` + `nutrition-scope.spec.ts::R1 ...` (aserciones 12 y 13) | pendiente |
| R4 | `src/modules/nutrition/nutrition-scope.spec.ts::R1 ...` (aserciones 7, 8 y 9) + `env-drift.test.mjs` (24 → 27) | pendiente |
| R5 | `src/modules/nutrition/infrastructure/ai/nutrition-explainer.factory.spec.ts::R5 (nutrition-ai-explainer #18): ...` + `src/modules/nutrition/infrastructure/ai/null-nutrition-explainer.spec.ts::R5 (nutrition-ai-explainer #18): ...` + `test/nutrition.e2e-spec.ts::R5 (nutrition-ai-explainer #18): con la IA apagada generate responde 200 con aiExplanation null` + `nutrition-scope.spec.ts::R1 ...` (aserción 10) | pendiente |
| R6 | `src/modules/nutrition/infrastructure/ai/nutrition-prompt.spec.ts::R6 (nutrition-ai-explainer #18): ...` | pendiente |
| R7 | `src/modules/nutrition/infrastructure/ai/nutrition-prompt.spec.ts::R7 (nutrition-ai-explainer #18): ...` | pendiente |
| R8 | `src/modules/nutrition/infrastructure/ai/nutrition-prompt.spec.ts::R8 (nutrition-ai-explainer #18): ...` | pendiente |
| R9 | `src/modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.spec.ts::R9 (nutrition-ai-explainer #18): ...` | pendiente |
| R10 | `src/modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.spec.ts::R10 (nutrition-ai-explainer #18): ...` | pendiente |
| R11 | `src/modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.spec.ts::R11 (nutrition-ai-explainer #18): ...` | pendiente |
| R12 | `src/modules/nutrition/application/use-cases/generate-nutrition-plan.use-case.spec.ts::R12 (nutrition-ai-explainer #18): ...` | pendiente |
| R13 | `src/modules/nutrition/infrastructure/repositories/nutrition.drizzle.repository.spec.ts::R13 (nutrition-ai-explainer #18): ...` + `test/nutrition-ai-explainer.e2e-spec.ts::R13 (nutrition-ai-explainer #18): ...` | pendiente |
| R14 | `src/modules/nutrition/application/use-cases/generate-nutrition-plan.use-case.spec.ts::R14 (nutrition-ai-explainer #18): ...` | pendiente |
| R15 | `src/modules/nutrition/application/use-cases/generate-nutrition-plan.use-case.spec.ts::R15 (nutrition-ai-explainer #18): ...` | pendiente |
| R16 | `src/modules/nutrition/application/use-cases/generate-nutrition-plan.use-case.spec.ts::R16 (nutrition-ai-explainer #18): ...` + `test/nutrition-ai-explainer.e2e-spec.ts::R16 (nutrition-ai-explainer #18): ...` | pendiente |
| R17 | `src/modules/nutrition/infrastructure/mappers/nutrition.mapper.spec.ts::R17 (nutrition-ai-explainer #18): ...` + `test/nutrition.e2e-spec.ts::R17 (nutrition-ai-explainer #18): ...` + R1(c) | pendiente |
| R18 | `test/nutrition-ai-explainer.e2e-spec.ts::R18 (nutrition-ai-explainer #18): ...` | pendiente |
| R19 | `docs/verification.md` § `### Feature 18 — nutrition-ai-explainer` (prueba de humo manual con clave real) + casilla de R19 en [[requirements]] §Aprobación | pendiente — **gate humano**, fecha: ____ |

Regla: el reviewer no aprueba si alguna fila queda "pendiente" (salvo R19, que
cierra el humano después del veredicto).
Convención de commit: `feat(nutrition-ai-explainer): <desc> (R1,R2)`.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).

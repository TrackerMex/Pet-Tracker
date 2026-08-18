---
feature: "nutrition-ai-explainer"
status: approved     # draft | approved
tags: [harness, spec]
---

# Trazabilidad — [[nutrition-ai-explainer]]

> Rutas relativas a `backend-pet-tracker/` salvo las de `docs/` y `.env.example`,
> que son de la raíz del repo. Los tests nombran su requisito como
> `R<n> (nutrition-ai-explainer #18): ...` — #17 escribió R1..R27 en **estos
> mismos archivos** y sin el sufijo C4 deja de ser verificable por grep.
>
> La columna "Commit" lleva **dos** hashes: el commit del test rojo y el de la
> implementación que lo pone verde (C4 de `CHECKPOINTS.md` exige que el historial
> muestre el patrón). Un solo hash por fila es motivo de rechazo.
>
> **R1 es la excepción declarada**: su commit de test deja la suite roja a
> propósito (deroga R26 de #17) y se pone verde con R4 + la dependencia `openai`.
> Anotar los dos hashes igual, y citar en el mensaje el R-id derogado.
>
> **R19 no se cierra con un commit**: es un gate humano. Su fila se completa con
> la fecha de la prueba de humo y el commit que registra la evidencia en
> `docs/verification.md` / `STATUS.md`. Ni Codex ni el `reviewer` pueden darla
> por cumplida.

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `src/modules/nutrition/nutrition-scope.spec.ts::R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo` + recorte del bloque R26 en `test/nutrition.e2e-spec.ts` | pendiente |
| R2 | `src/modules/nutrition/nutrition-scope.spec.ts::R1 ...` (aserción (5) conservada: `not.toContain('gpt-')`) | pendiente |
| R3 | `src/modules/nutrition/infrastructure/ai/nutrition-explainer.factory.spec.ts::R3 (nutrition-ai-explainer #18): con NODE_ENV=test nunca se construye el cliente real` | pendiente |
| R4 | `src/modules/nutrition/nutrition-scope.spec.ts::R1 ...` (aserciones (2) y (3) invertidas + guarda de clave real) | pendiente |
| R5 | `src/modules/nutrition/infrastructure/ai/nutrition-explainer.factory.spec.ts::R5 (nutrition-ai-explainer #18): las cuatro condiciones del gate` | pendiente |
| R6 | `src/modules/nutrition/infrastructure/ai/nutrition-prompt.spec.ts::R6 (nutrition-ai-explainer #18): system prompt literal y fechado` | pendiente |
| R7 | `src/modules/nutrition/infrastructure/ai/nutrition-prompt.spec.ts::R7 (nutrition-ai-explainer #18): el user prompt solo lleva input y resultado` | pendiente |
| R8 | `src/modules/nutrition/infrastructure/ai/nutrition-prompt.spec.ts::R8 (nutrition-ai-explainer #18): cota de allergies y diseases` | pendiente |
| R9 | `src/modules/nutrition/infrastructure/ai/openai-nutrition-explainer.spec.ts::R9 (nutrition-ai-explainer #18): modelo por env, timeout 15 s y maxRetries 0` | pendiente |
| R10 | `src/modules/nutrition/infrastructure/ai/openai-nutrition-explainer.spec.ts::R10 (nutrition-ai-explainer #18): respuesta vacia o truncada se normaliza a null` | pendiente |
| R11 | `src/modules/nutrition/infrastructure/ai/openai-nutrition-explainer.spec.ts::R11 (nutrition-ai-explainer #18): todo fallo degrada a null con warn` + `src/modules/nutrition/infrastructure/ai/null-nutrition-explainer.spec.ts::R11 (nutrition-ai-explainer #18): la rama apagada devuelve null y avisa` | pendiente |
| R12 | `src/modules/nutrition/application/use-cases/generate-nutrition-plan.use-case.spec.ts::R12 (nutrition-ai-explainer #18): insert antes de la IA y update despues` | pendiente |
| R13 | `test/nutrition.e2e-spec.ts::R13 (nutrition-ai-explainer #18): setAiExplanation actualiza solo esa columna y no inserta fila` | pendiente |
| R14 | `src/modules/nutrition/application/use-cases/generate-nutrition-plan.use-case.spec.ts::R14 (nutrition-ai-explainer #18): sin entitlement no se llama a la IA` | pendiente |
| R15 | `src/modules/nutrition/application/use-cases/generate-nutrition-plan.use-case.spec.ts::R15 (nutrition-ai-explainer #18): hash hit con null reintenta sobre la misma fila` | pendiente |
| R16 | `src/modules/nutrition/application/use-cases/generate-nutrition-plan.use-case.spec.ts::R16 (nutrition-ai-explainer #18): hash hit con explicacion no re-llama` + `test/nutrition.e2e-spec.ts` (mismo `id`, count en 1, una sola llamada al doble) | pendiente |
| R17 | `test/nutrition.e2e-spec.ts::R17 (nutrition-ai-explainer #18): el mapper devuelve la explicacion persistida` | pendiente |
| R18 | `test/nutrition.e2e-spec.ts::R18 (nutrition-ai-explainer #18): la explicacion llega de punta a punta` | pendiente |
| R19 | `docs/verification.md` §`Feature 18 — nutrition-ai-explainer` (prueba de humo manual con clave real) | pendiente — **gate humano**, fecha: ____ |

Regla: el reviewer no aprueba si alguna fila queda "pendiente".
Convención de commit: `feat(nutrition-ai-explainer): <desc> (R1,R2)`.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).

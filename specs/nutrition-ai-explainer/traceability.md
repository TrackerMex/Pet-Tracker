---
feature: "nutrition-ai-explainer"
status: draft        # draft | approved
tags: [harness, spec]
---

# Trazabilidad — [[nutrition-ai-explainer]]

> **Enmienda 2026-10-08 (proveedor Anthropic).** Esta tabla se reinició: los
> hashes de la implementación con OpenAI (rondas 1 y 2) pertenecen a una branch
> que no se mergeó y no valen como evidencia de esta. Las filas R1–R18 recogen
> la evidencia de esta implementación; R19 conserva el gate humano pendiente.
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
| R1 | `src/modules/nutrition/nutrition-scope.spec.ts::R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo` + recorte del bloque R26 de #17 en `test/nutrition.e2e-spec.ts` (R1(b)) + bloque R12 de #103 en `test/meal-times.e2e-spec.ts` (R1(c)) | `2047dfc47d19dd04714d30b3f4323daf9de75135` — test(nutrition-ai-explainer): derogate R26 of #17 (R1)<br>`d5c6d16c7b5ff6a95f7998bc65143fe498b011b6` — feat(nutrition-ai-explainer): return persisted aiExplanation from mapper (R17) |
| R2 | `src/modules/nutrition/nutrition-scope.spec.ts::R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo` (aserciones 5 y 11) | `2047dfc47d19dd04714d30b3f4323daf9de75135` — test(nutrition-ai-explainer): derogate R26 of #17 (R1)<br>sonda §Sondas R2-modelos en `progress/impl_nutrition-ai-explainer.md` (test nacido verde)<br>sonda §Sondas R2-spec (aserción 11) |
| R3 | `src/modules/nutrition/infrastructure/ai/nutrition-explainer.factory.spec.ts::R3 (nutrition-ai-explainer #18): NODE_ENV test apaga antes que nada` + `nutrition-scope.spec.ts::R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo` (aserciones 12 y 13) | `a589818c69ce81461e9c27da53343528480bcfef` — test(nutrition-ai-explainer): lock NODE_ENV test guard in explainer factory (R3)<br>`e41e0fec1bf518221a73bbe669a47aa01b2cac34` — feat(nutrition-ai-explainer): guard NODE_ENV test first and pin AI off in e2e (R3)<br>sondas §Sondas R1-12, §Sondas R1-13 y §Sondas R3-factory |
| R4 | `src/modules/nutrition/nutrition-scope.spec.ts::R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo` (aserciones 7, 8 y 9) + `env-drift.test.mjs` (24 → 27) | `2047dfc47d19dd04714d30b3f4323daf9de75135` — test(nutrition-ai-explainer): derogate R26 of #17 (R1)<br>`6e1e5847b107702336122936d51885f61932ea60` — feat(nutrition-ai-explainer): add Anthropic env vars (R4)<br>sonda R1-8 |
| R5 | `src/modules/nutrition/infrastructure/ai/nutrition-explainer.factory.spec.ts::R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto` + `src/modules/nutrition/infrastructure/ai/null-nutrition-explainer.spec.ts::R5 (nutrition-ai-explainer #18): el nulo explica por que esta apagado` + `test/nutrition.e2e-spec.ts::R5 (nutrition-ai-explainer #18): con la IA apagada generate responde 200 con aiExplanation null` + `nutrition-scope.spec.ts::R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo` (aserción 10) | `f1bc9aaf4b965f8899af7295469fb5be0eb52bd5` — test(nutrition-ai-explainer): lock explainer selection and null adapter (R5)<br>`802fda34a7daf121016a4d8f13af12e3ee72f8e8` — feat(nutrition-ai-explainer): select explainer in one factory and wire NUTRITION_EXPLAINER (R5) |
| R6 | `src/modules/nutrition/infrastructure/ai/nutrition-prompt.spec.ts::R6 (nutrition-ai-explainer #18): system prompt literal y versionado` | `666aa6bf77ce22e2c3ca1b14169fa9777b7826f4` — test(nutrition-ai-explainer): lock versioned system prompt (R6)<br>`f22076bb2e2ab66a5f6fc65fc2206f1fa671a2c7` — feat(nutrition-ai-explainer): add versioned nutrition system prompt (R6) |
| R7 | `src/modules/nutrition/infrastructure/ai/nutrition-prompt.spec.ts::R7 (nutrition-ai-explainer #18): solo input y resultado sin identificadores` | `cd27a788b43400187d184cdbe8a4e1d0ec01d081` — test(nutrition-ai-explainer): lock user prompt to input and result (R7)<br>`263413fde44e0948659a5165dd575d5eaaf291fb` — feat(nutrition-ai-explainer): build user prompt from input and result only (R7) |
| R8 | `src/modules/nutrition/infrastructure/ai/nutrition-prompt.spec.ts::R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON` | `92c00cffa219be26f1e42422b35d056a5e84f0a8` — test(nutrition-ai-explainer): lock caps on allergies and diseases (R8)<br>`b31a53a210a2f08a393cf4dcfb87cc6342981415` — feat(nutrition-ai-explainer): cap allergies and diseases in the user prompt (R8) |
| R9 | `src/modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.spec.ts::R9 (nutrition-ai-explainer #18): parametros exactos de la llamada` | `20b3ce7b1ce8a497acdb40285bb81f152564041e` — test(nutrition-ai-explainer): lock Anthropic call parameters (R9)<br>`3a966e2e39a37964022bd80b98f769f8e7c00160` — feat(nutrition-ai-explainer): add Anthropic nutrition explainer (R9) |
| R10 | `src/modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.spec.ts::R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn` | `12047becdfc4c33b0188bb9a127c29dd00309d34` — test(nutrition-ai-explainer): lock response normalization (R10)<br>`d2de8b209d0967208278da625d4e89bc90f9ae95` — feat(nutrition-ai-explainer): normalize Anthropic response to text or null (R10) |
| R11 | `src/modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.spec.ts::R11 (nutrition-ai-explainer #18): cualquier fallo degrada con un warn` | `6411c9815cd1ed3579d957473889bc2a6b480a34` — test(nutrition-ai-explainer): lock degradation to null on any failure (R11)<br>`56aebc09a012ddda37cfbfa043ea56482caad21e` — feat(nutrition-ai-explainer): degrade to null with one warn on any failure (R11) |
| R12 | `src/modules/nutrition/application/use-cases/generate-nutrition-plan.use-case.spec.ts::R12 (nutrition-ai-explainer #18): inserta antes de explicar y devuelve el UPDATE` | `c58292d644b630c9d950a10a5f1e418fcac23a3f` — test(nutrition-ai-explainer): lock insert-then-explain flow (R12)<br>`f9e48a45187879597d9977f1b5e7f6d18f7e168b` — feat(nutrition-ai-explainer): explain persisted plan after insert (R12) |
| R13 | `src/modules/nutrition/infrastructure/repositories/nutrition.drizzle.repository.spec.ts::R13 (nutrition-ai-explainer #18): UPDATE exclusivo por id y returning mapeado` + `test/nutrition-ai-explainer.e2e-spec.ts::R13 (nutrition-ai-explainer #18): UPDATE solo de la segunda fila por id` | `8a32bbbaedc300126b3162adf4b6045f52662b49` — test(nutrition-ai-explainer): lock setAiExplanation on repository (R13)<br>`d7112b2c1ea8d386c2cf3404c98725cd7ef76d88` — feat(nutrition-ai-explainer): add setAiExplanation to nutrition repository (R13)<br>HTTP: `903548c36cfd22c9863e94f93e3186dee7cd3578`; sonda §Sondas R13-e2e |
| R14 | `src/modules/nutrition/application/use-cases/generate-nutrition-plan.use-case.spec.ts::R14 (nutrition-ai-explainer #18): entitlement decide la explicacion sin muro de pago ni log` | `66b5fc261a0b22825e45b6474e41a80fe1ca8095` — test(nutrition-ai-explainer): lock entitlement gate before explain (R14)<br>sonda §Sondas R14 en `progress/impl_nutrition-ai-explainer.md` (test nacido verde) |
| R15 | `src/modules/nutrition/application/use-cases/generate-nutrition-plan.use-case.spec.ts::R15 (nutrition-ai-explainer #18): reintenta el hash hit con null sobre la misma fila` | `ca3108e9f1ba30e38fa7f00abb33ce49e503cf66` — test(nutrition-ai-explainer): lock retry on hash hit without explanation (R15)<br>`c2e6a7d1435d2f64e7c7a5d1282a5ab1298c9403` — feat(nutrition-ai-explainer): retry explanation on same row when null (R15) |
| R16 | `src/modules/nutrition/application/use-cases/generate-nutrition-plan.use-case.spec.ts::R16 (nutrition-ai-explainer #18): hash hit con texto no vuelve a pagar` + `test/nutrition-ai-explainer.e2e-spec.ts::R16 (nutrition-ai-explainer #18): hash hit no vuelve a pagar por HTTP` | `c74d52d81dff25d5f1a5742a7922eabf596cc3cb` — test(nutrition-ai-explainer): lock no re-call on hash hit with explanation (R16)<br>sonda §Sondas R16-unit en `progress/impl_nutrition-ai-explainer.md` (test nacido verde)<br>HTTP: `7f3ad8ba19ebfe05c608a0902cd3b3ca21429bc4`; sonda §Sondas R16-e2e |
| R17 | `src/modules/nutrition/infrastructure/mappers/nutrition.mapper.spec.ts::R17 (nutrition-ai-explainer #18): el mapper devuelve la explicacion persistida` + `test/nutrition.e2e-spec.ts::R17 (nutrition-ai-explainer #18): rutas leen la explicacion de Postgres sin overrides` + R1(c) | `7cfd618a6541ea848f0a0c476773aea056432144` — test(nutrition-ai-explainer): lock mapper returning persisted explanation (R17)<br>`d5c6d16c7b5ff6a95f7998bc65143fe498b011b6` — feat(nutrition-ai-explainer): return persisted aiExplanation from mapper (R17) |
| R18 | `test/nutrition-ai-explainer.e2e-spec.ts::R18 (nutrition-ai-explainer #18): explicacion de punta a punta` | `37431787c3ad0e3f2d675f4da147d9504ac96b5b` — test(nutrition-ai-explainer): lock explanation end to end over HTTP and Postgres (R18)<br>sonda §Sondas R18-e2e en `progress/impl_nutrition-ai-explainer.md` (test nacido verde) |
| R19 | `docs/verification.md` § `### Feature 18 — nutrition-ai-explainer` (prueba de humo manual con clave real) + casilla de R19 en [[requirements]] §Aprobación | pendiente — **gate humano**, fecha: ____ |
| E1.1 (R5, R3) | `src/modules/nutrition/infrastructure/ai/nutrition-explainer.factory.spec.ts::R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto` (`pasa clave y modelo recortados (E1.1)` + `toEqual` de `constructorArgs` en los dos anti-vacíos, R3 y R5; D-E1-a) | pendiente — rojo E1-c1 + verde E1-c2 (orden); rojo E1-c3 + feat E1-c4 (recorte); sondas S-E1.1a, S-E1.1b y S-E1.1c |
| E1.2 (R3.1, R5) | `src/modules/nutrition/infrastructure/ai/nutrition-explainer.factory.spec.ts::R5 (nutrition-ai-explainer #18): seleccion en orden con reason exacto` (`%s y %s fallan: gana %s`, 6 filas) | pendiente — rojo E1-c5 + verde E1-c6; sondas S-E1.2a, S-E1.2b y S-E1.2c |
| E1.3 (R11) | `src/modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.spec.ts::R11 (nutrition-ai-explainer #18) E1.3: la carga perezosa del SDK tambien degrada a null` | pendiente — refactor E1-c7 + rojo E1-c8 + verde E1-c9; sondas S-E1.3a, S-E1.3b y S-E1.3c (anti-vacío nacido verde) |
| E1.4 (R10) | `src/modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.spec.ts::R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn` (filas `content string`, `content objeto`, `content numero`, `content undefined` y `content array-like`) | pendiente — rojo E1-c10 + verde E1-c11; sondas S-E1.4a (fila `undefined`), S-E1.4b, S-E1.4c y S-E1.4d |
| E1.5 (R10) | `src/modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.spec.ts::R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn` (filas `bloque no-text con text` y `solo bloque no-text con text`) | pendiente — rojo E1-c12 + verde E1-c13; sondas S-E1.5a, S-E1.5b y S-E1.5c |
| E1.7 (R10) | `src/modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.spec.ts::R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn` (fila `sin stop_reason`) | pendiente — rojo E1-c14 + verde E1-c15 |
| E1.8 (R11) | `src/modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.spec.ts::R11 (nutrition-ai-explainer #18): cualquier fallo degrada con un warn` (fila `objeto`) | pendiente — rojo E1-c16 + verde E1-c17 |

Regla: el reviewer no aprueba si alguna fila queda "pendiente" (salvo R19, que
cierra el humano después del veredicto).
Las filas E1.x salen de [[requirements]] §Enmienda E1. Cada una lleva el hash
del commit rojo y el del verde. E1.3 lleva además el del refactor E1-c7, y E1.1
lleva dos pares: el del orden (E1-c1/E1-c2) y el del recorte (E1-c3/E1-c4). Se
añade la sonda citada por su id de §Sondas E1 en
`progress/impl_nutrition-ai-explainer.md`.
Convención de commit: `feat(nutrition-ai-explainer): <desc> (R1,R2)`.
El handoff humano exige completar esta tabla solo en el commit 36; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).

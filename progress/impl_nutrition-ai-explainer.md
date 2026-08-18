# Implementacion: nutrition-ai-explainer (#18)

Fecha: 2026-08-18
Branch: `feature/18-nutrition-ai-explainer`
Estado: bloqueada antes de escribir tests o implementacion

## Linea base

- Docker levantado.
- Postgres publicado en `0.0.0.0:5432` y `[::]:5432`.
- `./init.sh`: exit code 0.
- Backend: 143/143 suites, 1111/1111 tests.
- Infraestructura: 2/2 suites, 14/14 tests.
- E2E: 20 suites pasadas, 2 omitidas; 319 tests pasados, 6 omitidos.
- Lint y typecheck verdes.
- El log mostro la carrera conocida FK `23503` en `pet_users`, sin fallo de suite.

## Bloqueo de spec

La spec no define como llegan `petId` y `planId` a los adaptadores, pero exige
que aparezcan en sus logs:

- C-6 fija literalmente `NutritionExplainer.explain(input, result)` con solo
  `NutritionEngineInput` y `NutritionPlanResult`.
- R12 vuelve a fijar la llamada como `explainer.explain(input, result)`.
- OV2 prohibe incorporar identificadores a `NutritionEngineInput` y limita el
  prompt a input + resultado.
- R10 exige logs `{ scope, petId, planId, message, finishReason, usage }`.
- R11 exige logs `{ scope, petId, planId, message }`, tambien para
  `NullNutritionExplainer`.

Con el contrato aprobado, ninguno de los dos adaptadores recibe `petId` ni
`planId`. Resolverlo requeriria una decision humana que cambie la spec, por
ejemplo ampliar el puerto con un contexto de logging separado del prompt, o
eliminar esos campos obligatorios del log. Usar valores vacios, estado global o
contexto implicito seria inventar comportamiento no especificado.

No se abrio `plans/009-alimentacion-ia.md`, no se modifico codigo y no se
ejecuto ninguna llamada a OpenAI.

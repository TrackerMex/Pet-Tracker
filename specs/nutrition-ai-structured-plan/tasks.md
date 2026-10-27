---
feature: "nutrition-ai-structured-plan"
status: approved     # draft | approved
tags: [harness, spec, backend, nutrition, ai]
---

# Tareas — [[nutrition-ai-structured-plan]]

> Disciplina TDD (CHECKPOINTS C4). Cada requisito de [[requirements]] tiene sus
> tres pasos: (1) test rojo, (2) implementación mínima y (3) refactor. Los
> símbolos, fixtures y reglas M1–M7 están en [[design]]. Las rutas son relativas
> a `backend-pet-tracker/`, salvo los documentos.

## Reglas de la cadena

- **Antes de empezar.** La casilla G2 de [[requirements]] §G2 y la aprobación
  general tienen que estar marcadas. Sin G2 no se toca `nutrition-prompt.ts` ni
  `nutrition-toxic-foods.ts`.
- **Commits test-primero, separados.** Cada R tiene, como mínimo:
  - un commit rojo `test(nutrition-ai-structured-plan): <desc> (R<n>)` con solo tests;
  - un commit verde `feat(nutrition-ai-structured-plan): <desc> (R<n>)`.

  No se mezclan implementación y tests en un solo commit.
- **El rojo falla por aserción**, nunca por `ReferenceError`, `Cannot find module` ni un error de tipos.
  - Si el símbolo aún no existe, el commit rojo puede llevar un **stub mínimo**: la firma exportada, devolviendo `null`, `[]`, `false` o el valor de antes.
    Forma obligatoria, para que `pnpm exec eslint` pase en cada commit: el método o función **no** es `async`;
    cada parámetro que el stub no usa se consume con `void <param>;` (el prefijo `_` no basta: no hay
    `argsIgnorePattern`); si la firma devuelve una promesa, `return Promise.resolve(<valor>);`. Vale también
    para los parámetros nuevos que se ignoran (R3, R5) y para el adaptador de R7 si el stub quita el `await` del SDK.
  - El stub se declara en el mensaje del commit, por ejemplo `(R8, stub)`.
- **Its que nacen verdes.** Cada bloque dice qué its pasan ya en el commit rojo
  por el stub o por un requisito anterior. En cada commit rojo, al menos un it del
  R tiene que fallar. Excepción: el bloque R16/R17 (e2e), que nace verde y se
  prueba con la mutación local de ese bloque.
- **Cada commit compila.** `pnpm exec tsc --noEmit -p tsconfig.json` sale con 0
  y la suite unitaria está verde, salvo los its rojos del commit rojo.
  - Los cambios de firma llevan en el mismo commit sus adaptaciones M1–M7.
  - El caso de uso usa valores puente (`[]` como tendencia, `output.explanation`) hasta R13, como se indica en cada bloque.
- **Formato.** `pnpm exec prettier --write <ficheros tocados>` antes de cada commit.
- **Prohibido:** `./init.sh` (lo corre el leader), llamar al API real de
  Anthropic, crear recursos AWS, leer `.env`, hacer rebase y renumerar migraciones a mano.
- **Trazabilidad.** No se toca [[traceability]] durante la cadena. Tras el último
  commit de la cadena (incluido el `chore` de regeneración de [[design]] §Migración,
  si lo hay) se rellenan todas las filas, con el test y el hash del commit verde, en
  un único commit `docs(nutrition-ai-structured-plan): fill traceability`. La cadena no se rebasea después.
- **Directorio de los locks.** Los locks con rutas `src/` o `test/` se corren desde
  `backend-pet-tracker/`. Los de documentación, desde la raíz del repo.

Comandos de verificación:

```sh
cd backend-pet-tracker
pnpm exec jest --config package.json <ruta-del-spec>      # unitario puntual
pnpm exec jest --config ./test/jest-e2e.json <ruta-e2e>   # e2e puntual
pnpm exec tsc --noEmit -p tsconfig.json
```

## R1 — Cotas de `allergies` y `diseases` en la DTO

- [ ] (1) Rojo: crear `src/modules/nutrition/application/dto/nutrition-profile.dto.spec.ts` con los cinco its de R1.
  - Crear `test/nutrition-ai-structured-plan.e2e-spec.ts` con el `fixture()` de [[design]] §Archivos afectados y el it `R1: PUT con 21 alergias responde 400 y no cambia el perfil`.
  - Nacen verdes: `R1: acepta 20 elementos de 100 caracteres en ambos campos`.
  - Commit: `test(nutrition-ai-structured-plan): bound allergies and diseases in the profile DTO (R1)`.
- [ ] (2) Verde: `.max(100)` en el string y `.max(20)` en el array, en los dos campos.
  - Commit: `feat(nutrition-ai-structured-plan): bound allergies and diseases in the profile DTO (R1)`.
- [ ] (3) Refactor: ninguno previsto.
- Lock:

  ```sh
  grep -cF 'allergies: z.array(z.string().max(100)).max(20).default([]),' src/modules/nutrition/application/dto/nutrition-profile.dto.ts  # 1
  grep -cF 'diseases: z.array(z.string().max(100)).max(20).default([]),' src/modules/nutrition/application/dto/nutrition-profile.dto.ts   # 1
  ```

## R10 — Lista de tóxicos y detector

Va antes que R8, porque R11 la usa.

- [ ] (1) Rojo: crear `src/modules/nutrition/domain/nutrition-toxic-foods.spec.ts` con los its de R10. Los 51 literales de §G2.2 se escriben en el test.
  - Stub: `NUTRITION_TOXIC_FOODS = []` y `mentionsToxicFood` devolviendo `false`.
  - Nacen verdes: las tres filas de `R10: no detecta %s`.
  - Commit: `test(nutrition-ai-structured-plan): toxic food list and token matcher (R10, stub)`.
- [ ] (2) Verde: la lista literal y la normalización de [[design]] §Dominio.
  - Commit: `feat(nutrition-ai-structured-plan): toxic food list and token matcher (R10)`.
- [ ] (3) Refactor: ninguno previsto.
- Lock:

  ```sh
  grep -cF "'nuez moscada'," src/modules/nutrition/domain/nutrition-toxic-foods.ts  # 1
  grep -cF "'raw dough'" src/modules/nutrition/domain/nutrition-toxic-foods.ts      # 1
  ```

## R8 — Las franjas de la propuesta son las del plan

- [ ] (1) Rojo: crear `src/modules/nutrition/domain/nutrition-ai-proposal.spec.ts` con los its de R8, `PLAN_300` y una salida base válida con las tres horas de `PLAN_300` y suma 300.
  - Stub: `nutrition-ai-proposal.ts` con los tipos y constantes de [[design]] §Dominio y `acceptAiOutput` devolviendo `null`.
  - Nacen verdes: los cuatro its de rechazo.
  - Rojo: `R8: acepta las mismas horas en otro orden y devuelve mealGrams en el orden del plan`.
  - Commit: `test(nutrition-ai-structured-plan): proposal slots must match the plan (R8, stub)`.
- [ ] (2) Verde:
  - comprobar el número de entradas, que cada hora pertenezca al plan y que no haya duplicados;
  - devolver `mealGrams` en el orden de `plan.mealTimes`;
  - `recommendations` pasa sin filtrar y `reviewDate` es `shiftDay(localDay, reviewInDays)`.

  El filtro lo añade R11.
  - Commit: `feat(nutrition-ai-structured-plan): proposal slots must match the plan (R8)`.
- [ ] (3) Refactor: ninguno previsto.

## R9 — Tolerancia de gramos del 10 %

- [ ] (1) Rojo: añadir el `it.each` de R9 y `R9: la tolerancia es del 10 por ciento`. `PLAN_305` se suma al fichero.
  - Nacen verdes: las filas `true` y el it de la constante.
  - Rojo: las cuatro filas `false`.
  - Commit: `test(nutrition-ai-structured-plan): grams total within 10 percent of the engine (R9)`.
- [ ] (2) Verde: la comparación entera de [[design]] D3.
  - Commit: `feat(nutrition-ai-structured-plan): grams total within 10 percent of the engine (R9)`.
- [ ] (3) Refactor: ninguno previsto.
- Lock:

  ```sh
  grep -cF 'NUTRITION_AI_GRAMS_TOLERANCE_PERCENT' src/modules/nutrition/domain/nutrition-ai-proposal.ts  # 2 (declaración y uso)
  ```

## R11 — Filtro de recomendaciones y fecha de revisión

- [ ] (1) Rojo: añadir los its de R11.
  - Nacen verdes: las cuatro filas de fecha, por R8.
  - Rojo: los dos its de recomendaciones tóxicas.
  - Commit: `test(nutrition-ai-structured-plan): drop toxic recommendations and set the review date (R11)`.
- [ ] (2) Verde: `recommendations.filter((r) => !mentionsToxicFood(r))`.
  - Commit: `feat(nutrition-ai-structured-plan): drop toxic recommendations and set the review date (R11)`.
- [ ] (3) Refactor: ninguno previsto.

## R2 — Lector de la tendencia de peso

- [ ] (1) Rojo: añadir los dos its de R2 a `test/nutrition-ai-structured-plan.e2e-spec.ts`.
  - Stub: el puerto de [[design]] §Dominio, `NutritionWeightDrizzleReader.listRecent` devolviendo `[]`, `NutritionWeightReadModule`, y su import en `nutrition.module.ts`.
  - Nacen verdes: `R2: sin pesos devuelve una lista vacia`.
  - Commit: `test(nutrition-ai-structured-plan): read the latest five weights per pet (R2, stub)`.
- [ ] (2) Verde: la consulta de [[design]] §Infraestructura.
  - Commit: `feat(nutrition-ai-structured-plan): read the latest five weights per pet (R2)`.
- [ ] (3) Refactor: ninguno previsto.
- Lock:

  ```sh
  grep -cF '    NutritionWeightReadModule,' src/modules/nutrition/nutrition.module.ts  # 1
  ```

## R3 — `weightTrend` en el hash

- [ ] (1) Rojo: añadir el describe de R3 a `nutrition-input-hash.spec.ts`.
  - Stub: `nutritionInputHash(input, weightTrend)` acepta el segundo argumento y lo ignora.
  - Las llamadas existentes pasan `[]` (M1). Puente: el caso de uso llama `nutritionInputHash(input, [])`.
  - Rojo: `R3: difiere del hash de #17 sin tendencia`, porque con el stub el hash sigue siendo el de #17. Esa es la prueba de que el rojo es real.
  - Commit: `test(nutrition-ai-structured-plan): weight trend enters the inputs hash (R3, stub)`.
- [ ] (2) Verde: la última clave `weightTrend` de [[design]] §Aplicación.
  - Commit: `feat(nutrition-ai-structured-plan): weight trend enters the inputs hash (R3)`.
- [ ] (3) Refactor: ninguno previsto.

## R12 — Contador diario atómico, esquema y migración

- [ ] (1) Rojo: añadir los tres its de R12 al e2e.
  - En `src/db/schema/nutrition.schema.spec.ts`, el it `declara nutrition_plans con historial, checks, cascade e indice` gana `'ai_proposal',` justo después de `'ai_explanation',` en su lista de columnas (errata E4 de la re-medida). Queda rojo por aserción hasta el verde.
  - Stub: `consumeAiGeneration` en el puerto y en el repositorio, devolviendo `false`.
  - Nacen verdes: ninguno.
  - Commit: `test(nutrition-ai-structured-plan): atomic daily AI generation counter (R12, stub)`.
- [ ] (2) Verde:
  - En el esquema, `aiProposal` en `nutritionPlans` y la tabla `nutritionAiGenerations` ([[design]] §Infraestructura).
  - Generar la migración con el comando de [[design]] §Migración.
  - `consumeAiGeneration` real.
  - Si TypeScript lo exige al añadir la columna, el mapper de filas lee `aiProposal` en este commit. La entidad lo gana en R17.
  - Commit: `feat(nutrition-ai-structured-plan): atomic daily AI generation counter (R12,R16)`.
- [ ] (3) Refactor: ninguno previsto.
- Lock:

  ```sh
  ls src/db/migrations/*_nutrition_ai_structured_plan.sql | wc -l                                       # 1
  grep -cF 'ALTER TABLE "nutrition_plans" ADD COLUMN "ai_proposal" jsonb;' src/db/migrations/*_nutrition_ai_structured_plan.sql  # 1
  grep -cF 'CREATE TABLE "nutrition_ai_generations"' src/db/migrations/*_nutrition_ai_structured_plan.sql                      # 1
  grep -cF '"tag": "0019_pet_documents_uploaded_at"' src/db/migrations/meta/_journal.json                                        # 1
  grep -cF '_nutrition_ai_structured_plan"' src/db/migrations/meta/_journal.json                                               # 1
  grep -cE "^\s+'ai_proposal',$" src/db/schema/nutrition.schema.spec.ts                                                          # 1
  ```

## R4 — System prompt de G2

- [ ] (1) Rojo: en `nutrition-prompt.spec.ts`, borrar el describe `R6 (nutrition-ai-explainer #18): system prompt literal y versionado` y añadir el describe de R4 con el texto de §G2.1 escrito en el test.
  - Nacen verdes: ninguno.
  - Commit: `test(nutrition-ai-structured-plan): G2 system prompt literal (R4)`.
- [ ] (2) Verde: sustituir la constante y el comentario por los de §G2.1.
  - Commit: `feat(nutrition-ai-structured-plan): G2 system prompt literal (R4)`.
- [ ] (3) Refactor: ninguno previsto.
- Lock:

  ```sh
  grep -cF 'Producto, 2026-10-26 (#212, gate G2). Cambiarlo es decisión del humano, no del implementador.' src/modules/nutrition/infrastructure/ai/nutrition-prompt.ts  # 1
  grep -cF 'Producto, 2026-08-18 (plan 009 §Paso 3)' src/modules/nutrition/infrastructure/ai/nutrition-prompt.ts  # 0
  ```

## R5 — `weightTrend` en el prompt del usuario

- [ ] (1) Rojo: borrar los its `serializa exactamente dos objetos con diez y siete claves` y `tiene dos parametros y no recibe ctx` y añadir los de R5.
  - Stub: `buildUserPrompt(input, result, weightTrend)` acepta el tercer parámetro y lo ignora.
  - Cambia la firma del puerto `explain` a cuatro parámetros (con `weightTrend` en tercer lugar), con M1 en los adaptadores y sus specs. Puente: el caso de uso pasa `[]`.
  - Nacen verdes: `R5: tiene tres parametros y no recibe ctx`.
  - Commit: `test(nutrition-ai-structured-plan): weight trend in the user prompt (R5, stub)`.
- [ ] (2) Verde: la clave `weightTrend` de [[design]] §Infraestructura.
  - El adaptador pasa su `weightTrend` a `buildUserPrompt`.
  - Commit: `feat(nutrition-ai-structured-plan): weight trend in the user prompt (R5)`.
- [ ] (3) Refactor: ninguno previsto.

## R6 — Parámetros de la llamada estructurada

- [ ] (1) Rojo: borrar el describe `R9 (nutrition-ai-explainer #18): parametros exactos de la llamada` y añadir el de R6, con el literal de [[design]] §C-2 escrito en el test.
  - Stub: `NUTRITION_AI_OUTPUT_JSON_SCHEMA = {}` exportado desde `nutrition-prompt.ts`.
  - Nacen verdes: `R6: construye el cliente perezoso con clave explicita y constantes`.
  - Commit: `test(nutrition-ai-structured-plan): structured output call parameters (R6, stub)`.
- [ ] (2) Verde: `NUTRITION_AI_MAX_OUTPUT_TOKENS = 2_000`, el esquema literal y `thinking`/`output_config` en los parámetros.
  - Commit: `feat(nutrition-ai-structured-plan): structured output call parameters (R6)`.
- [ ] (3) Refactor: ninguno previsto.
- Lock:

  ```sh
  grep -cF 'export const NUTRITION_AI_MAX_OUTPUT_TOKENS = 2_000;' src/modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.ts  # 1
  grep -cF "thinking: { type: 'disabled' };" src/modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.ts                # 1 (miembro de AnthropicMessageParams)
  grep -cF "thinking: { type: 'disabled' }," src/modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.ts                # 1 (valor en la llamada)
  ```

## R7 — Validación zod de la salida

- [ ] (1) Rojo: borrar el describe `R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn` y añadir el de R7: 18 filas más los its listados.
  - Cambia el tipo de retorno del puerto a `Promise<NutritionAiOutput | null>`.
  - Stub: el adaptador devuelve `null` con el `warn` `'ai proposal unusable'` en todos los casos.
  - Puente en el caso de uso: `setAiExplanation(plan.id, output.explanation)`, con M2 en el e2e de #18 y M4 en los its de #18 que se quedan. Con el stub, M4 deja rojos esos its de #18 hasta el verde: se declara en el mensaje.
  - Nacen verdes: las 18 filas y los its de descarte.
  - Rojo: `R7: devuelve la salida valida con strings recortados`, `R7: acepta los bordes de la tabla` y `R7: ignora bloques que no son text`.
  - Commit: `test(nutrition-ai-structured-plan): validate the structured output with zod (R7, stub)`.
- [ ] (2) Verde: `NutritionAiOutputSchema` de [[design]] §C-3 y la normalización de [[design]] §Infraestructura.
  - Commit: `feat(nutrition-ai-structured-plan): validate the structured output with zod (R7)`.
- [ ] (3) Refactor: borrar el código muerto de la normalización de texto de #18.
- Lock:

  ```sh
  grep -cF "message: 'ai proposal unusable'," src/modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.ts       # 1
  grep -cF "message: 'ai explanation unusable'," src/modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.ts    # 0
  ```

## R17 — Copiar el horario descarta la propuesta

- [ ] (1) Rojo: añadir `R17: la copia por cambio de horario descarta la propuesta y conserva la explicacion` a `nutrition-plan.entity.spec.ts`.
  - Stub: `aiProposal` en la entidad, con M6, y `copyWithMealTimes` copiándola.
  - Commit: `test(nutrition-ai-structured-plan): meal time edits drop the AI proposal (R17, stub)`.
- [ ] (2) Verde: `copyWithMealTimes` pone `aiProposal: null`.
  - Commit: `feat(nutrition-ai-structured-plan): meal time edits drop the AI proposal (R17)`.
- [ ] (3) Refactor: ninguno previsto. El e2e de R17 va en R16.

## R16 (unitario) — `setAiResult` y respuestas

- [ ] (1) Rojo: en `nutrition.drizzle.repository.spec.ts`, borrar el describe `R13 (nutrition-ai-explainer #18): UPDATE exclusivo por id y returning mapeado` y añadir `R16: setAiResult actualiza explicacion y propuesta solo en el plan indicado`.
  - Añadir también los dos its de R16 en `nutrition.mapper.spec.ts`, con M3.
  - Stub: `setAiResult` llama al UPDATE de antes, sin `aiProposal`; `toNutritionPlanGenerateResponse` sin `aiStatus`.
  - Commit: `test(nutrition-ai-structured-plan): persist the proposal and expose it in responses (R16, stub)`.
- [ ] (2) Verde: `setAiResult`, `aiProposal` en `NutritionPlanResponse` y `NutritionPlanGenerateResponse`.
  - Se borra `setAiExplanation` del puerto y del repositorio. Puente en el caso de uso: `setAiResult(plan.id, output.explanation, <propuesta aceptada>)`.
  - Commit: `feat(nutrition-ai-structured-plan): persist the proposal and expose it in responses (R16)`.
- [ ] (3) Refactor: ninguno previsto.
- Lock:

  ```sh
  grep -rn "setAiExplanation" src test | wc -l   # 0
  ```

## R13 — Estados de la fase de IA

- [ ] (1) Rojo: en `generate-nutrition-plan.use-case.spec.ts`, borrar los describes `R12`, `R14`, `R15` y `R16 (nutrition-ai-explainer #18)`.
  - Mover el it `toPlanResult proyecta exactamente las siete claves sin identificadores` a un describe propio, sin tocarlo.
  - Reescribir `setup()` con M7 y añadir los its de R13.
  - Stub: `execute` devuelve `{ plan, aiStatus: 'not_tracked' }` tras el INSERT; el quinto parámetro del constructor existe pero no se usa.
  - Nacen verdes: `R13: sin collar devuelve not_tracked sin consumir, llamar a la IA, actualizar, avisar ni fallar`.
  - Commit: `test(nutrition-ai-structured-plan): AI phase statuses in generate (R13, stub)`.
- [ ] (2) Verde: el flujo de [[design]] §Flujo, sin el acierto de caché con propuesta, que es R15.
  - Dos puentes, que R14 sustituye: la tendencia es `[]` (sin llamar a `listRecent`) y el día es el UTC, `now.toISOString().slice(0, 10)`. El límite ya es `NUTRITION_AI_DAILY_LIMIT`.
  - El controlador usa `toNutritionPlanGenerateResponse`.
  - Commit: `feat(nutrition-ai-structured-plan): AI phase statuses in generate (R13)`.
- [ ] (3) Refactor: ninguno previsto.
- Lock:

  ```sh
  grep -cF "message: 'ai proposal out of bounds'," src/modules/nutrition/application/use-cases/generate-nutrition-plan.use-case.ts  # 1
  grep -cF 'toNutritionPlanGenerateResponse(' src/modules/nutrition/infrastructure/nutrition.controller.ts                        # 1
  ```

## R14 — Entradas de la fase de IA

- [ ] (1) Rojo: añadir los tres its de R14.
  - Nacen verdes: ninguno. Con los puentes de R13 los tres fallan por aserción:
    - el primero recibe `'2026-10-26'` en vez de `'2026-10-25'`;
    - el segundo no ve la llamada a `listRecent`;
    - el tercero recibe `'2026-11-02'` en vez de `'2026-11-01'`.
  - Commit: `test(nutrition-ai-structured-plan): weight trend, owner local day and limit (R14)`.
- [ ] (2) Verde: `listRecent(petId, NUTRITION_AI_WEIGHT_TREND_POINTS)`, `ownerLocalDay(this.pets, petId, now)` y `NUTRITION_AI_DAILY_LIMIT`.
  - Commit: `feat(nutrition-ai-structured-plan): weight trend, owner local day and limit (R14)`.
- [ ] (3) Refactor: ninguno previsto.

## R15 — Acierto de caché

- [ ] (1) Rojo: añadir los tres its de R15.
  - Rojo: `R15: hash igual con propuesta devuelve proposed sin collar, consumo, IA, INSERT ni UPDATE`.
  - Commit: `test(nutrition-ai-structured-plan): cache hit with a proposal skips the AI and the limit (R15)`.
- [ ] (2) Verde: el paso 5 de [[design]] §Flujo.
  - Commit: `feat(nutrition-ai-structured-plan): cache hit with a proposal skips the AI and the limit (R15)`.
- [ ] (3) Refactor: ninguno previsto.
- Lock:

  ```sh
  grep -cF 'if (latestPlan.aiExplanation !== null) return latestPlan;' src/modules/nutrition/application/use-cases/generate-nutrition-plan.use-case.ts  # 0
  ```

## R16 y R17 (e2e) — Contrato HTTP de punta a punta

- [ ] (1) Rojo: añadir al e2e nuevo los cinco its de R16 y el de R17. Aplicar M3 y M5 en los e2e heredados.
  - Si todo lo anterior está verde, estos its nacen verdes. Se demuestra que muerden con una mutación local que **no** se commitea: `copyWithMealTimes` copiando `aiProposal` tumba el it de R17, y `NUTRITION_AI_DAILY_LIMIT = 4` tumba el cuarto `generate`. La mutación y el rojo observado se anotan en `progress/impl_nutrition-ai-structured-plan.md`.
  - Revertir con `git checkout HEAD -- <fichero>`; `git diff --quiet -- src` sale con 0 antes del commit.
  - Riesgo conocido: el e2e no controla el `now` del servidor (el controlador llama a `execute` sin `now`, que cae en `new Date()`) y calcula `<hoy UTC + 30>` por su cuenta. Si la corrida cruza la medianoche UTC entre el `generate` y ese cálculo, el it de R16 falla sin defecto; se repite la corrida y se anota en `progress/impl_nutrition-ai-structured-plan.md`.
  - Commit: `test(nutrition-ai-structured-plan): end-to-end proposal contract (R16,R17)`.
- [ ] (2) Verde: nada, si nacieron verdes. Si alguno falla, el arreglo va en `feat(nutrition-ai-structured-plan): <desc> (R16)`.
- [ ] (3) Refactor: ninguno previsto.

## R18 — Enmienda del brief y del plan 009

- [ ] **D1.** En `docs/brief.md`, sustituir la frase de A17 por:

  > La IA deberá explicar el plan en lenguaje sencillo y podrá proponer, dentro de las cotas que fije el motor de reglas (kcal diarias, gramos totales con una tolerancia de ±10 % y número de comidas), el reparto de gramos por comida, recomendaciones de seguimiento y una fecha de revisión; nunca modificará automáticamente una dieta veterinaria ni recomendará tratamientos clínicos (enmienda #212, 2026-10-26).

  En `plans/009-alimentacion-ia.md`, sustituir la parte en negrita de A18, de modo que la línea quede:

  > Mandato explícito (§16): **las reglas determinísticas calculan y fijan las cotas; la IA explica y propone dentro de ellas** (enmienda #212, 2026-10-26)

  El resto de esa línea no cambia.
  - Commit: `docs(nutrition-ai-structured-plan): amend brief and plan 009 for the hybrid AI (R18)`.
- Lock (desde la raíz del repo):

  ```sh
  grep -cF 'La IA deberá explicar el plan en lenguaje sencillo, pero no modificar automáticamente una dieta veterinaria ni recomendar tratamientos clínicos.' docs/brief.md  # 0
  grep -cF 'nunca modificará automáticamente una dieta veterinaria ni recomendará tratamientos clínicos (enmienda #212, 2026-10-26).' docs/brief.md                    # 1
  grep -cF '**las reglas determinísticas calculan, la IA solo explica**' plans/009-alimentacion-ia.md                                                                   # 0
  grep -cF '**las reglas determinísticas calculan y fijan las cotas; la IA explica y propone dentro de ellas** (enmienda #212, 2026-10-26)' plans/009-alimentacion-ia.md  # 1
  ```

## R19 — Modelo de datos y prueba de humo

- [ ] **D2.** Cambios en `docs/data-model.md`:
  - En la fila `nutrition_plans`, sustituir `` `ai_explanation text NULL`, `` por `` `ai_explanation text NULL`, `ai_proposal jsonb NULL`, ``.
  - Justo debajo de esa fila, añadir:

    ```text
    | `nutrition_ai_generations` | `pet_id uuid FK NOT NULL`, `local_day date NOT NULL`, `count integer NOT NULL CHECK (> 0)` | `nutrition-ai-structured-plan` (#212). PK `(pet_id, local_day)`; FK a `pets(id)` con `ON DELETE CASCADE`; una fila por mascota y día local del dueño con IA; `count` llega como mucho a 3 (`NUTRITION_AI_DAILY_LIMIT`) |
    ```

  - En el diagrama, debajo de `pets ||--o{ meal_servings : "has"`, añadir `  pets ||--o{ nutrition_ai_generations : "has"`.
  - En el párrafo que empieza por `Las tablas de nutricion se crean en la migracion`, sustituir el final `(#103).` por el texto de abajo, de modo que el párrafo acabe así:

    ```text
    `engine_meals_per_day` en `0018_nutrition_plans_engine_meals.sql` (#103); `ai_proposal` y `nutrition_ai_generations` en la migración `nutrition_ai_structured_plan` (#212).
    ```
- [ ] **D3.** En `docs/verification.md`, justo antes de `## Notas para el implementer`, insertar la sección de abajo, con una línea en blanco antes y después:

  ````text
  ### Feature 212 — nutrition-ai-structured-plan

  Prueba de humo con clave real: la ejecuta exclusivamente un humano tras la revisión. R20 permanece pendiente hasta que marque su casilla en la spec.

  ```
  0. Pre-vuelo: el mismo de "Feature 18 — nutrition-ai-explainer" (NODE_ENV, ANTHROPIC_* exportadas,
     mascota con collar y suscripcion vigente).
  1. .env y servidor: el paso 1 de Feature 18 (ANTHROPIC_ENABLED=true, clave real,
     ANTHROPIC_MODEL=claude-haiku-5-5) y reiniciar el servidor.
  2. API_BASE y AUTH_TOKEN como en el paso 2 de Feature 18. Cambiar kcalPer100g para forzar un hash nuevo.
  3. POST $API_BASE/pets/<petId>/nutrition-plan/generate -> 200 con aiStatus "proposed",
     aiProposal.mealGrams con una entrada por cada hora de mealTimes y suma de grams
     dentro de dailyGrams ±10 %, de 1 a 3 recomendaciones sin alimentos toxicos,
     reviewDate entre hoy+7 y hoy+90 y aiExplanation en español.
     GET $API_BASE/pets/<petId>/nutrition-plan -> la misma aiProposal y sin aiStatus.
  4. El mismo POST sin tocar nada -> mismo id, aiStatus "proposed" y la IA NO se llama
     (no aparece un warn nuevo ni sube el contador).
  5. Cambiar kcalPer100g y POST generate dos veces mas, con un kcalPer100g distinto
     cada vez -> "proposed" las dos. Cambiarlo una cuarta vez y POST generate ->
     aiStatus "limit_reached", aiProposal null y la IA NO se llama.
  6. En la BD local: SELECT count FROM nutrition_ai_generations WHERE pet_id = '<petId>'
     ORDER BY local_day DESC LIMIT 1;  -> 3
  7. Dejar ANTHROPIC_API_KEY=PENDING y ANTHROPIC_ENABLED=false en .env y reiniciar el servidor.
  ```

  Y esta tabla de diagnóstico, para cuando el paso 3 no devuelva "proposed":

  | aiStatus o salida del servidor | Significa |
  |---|---|
  | `not_tracked` | mascota sin collar o sin suscripción (`isPetTracked` falso) |
  | `limit_reached` | ya hubo 3 generaciones con IA hoy (día local del dueño) |
  | `unavailable` + `ai explanation disabled` | IA apagada: ver la tabla de Feature 18 |
  | `unavailable` + `ai proposal unusable` + `stopReason` / `usage` | la respuesta no cumple el esquema o se cortó |
  | `rejected` + `ai proposal out of bounds` | franjas distintas de mealTimes o gramos fuera de ±10 % |

  **Coste estimado** (Haiku 5.5, $0.10 y $0.50 por millón de tokens de entrada y salida):
  ≈ $0.0004 por llamada y ≤ ~$0.0011 en el peor caso con `max_tokens` 2000. La prueba completa
  hace **tres** llamadas facturadas (pasos 3 y 5), menos de $0.01.
  ````

  - Commit: `docs(nutrition-ai-structured-plan): data model and smoke test for the hybrid AI (R19)`.
- Lock (desde la raíz del repo):

  ```sh
  grep -cF '`ai_explanation text NULL`, `ai_proposal jsonb NULL`,' docs/data-model.md                   # 1
  grep -cF '| `nutrition_ai_generations` |' docs/data-model.md                                          # 1
  grep -cF 'pets ||--o{ nutrition_ai_generations : "has"' docs/data-model.md                            # 1
  grep -cF 'en la migración `nutrition_ai_structured_plan` (#212).' docs/data-model.md                  # 1
  grep -cF '### Feature 212 — nutrition-ai-structured-plan' docs/verification.md                        # 1
  grep -cF '`rejected` + `ai proposal out of bounds`' docs/verification.md                              # 1
  grep -cF '`unavailable` + `ai proposal unusable`' docs/verification.md                                # 1
  awk '/^### Feature 212 — nutrition-ai-structured-plan/{a=NR} /^## Notas para el implementer/{b=NR} END{print (a>0 && a<b)}' docs/verification.md  # 1
  ```

## R20 — Prueba de humo humana

- [ ] El humano ejecuta `docs/verification.md` §Feature 212 y marca la casilla R20 en [[requirements]]. Ninguna IA la corre.

## Cierre de la cadena

- [ ] Suites completas, sin filtro de ficheros:

  ```sh
  cd backend-pet-tracker
  pnpm exec tsc --noEmit -p tsconfig.json
  pnpm exec jest --config package.json
  pnpm exec jest --config ./test/jest-e2e.json
  pnpm exec eslint "{src,test}/**/*.ts"
  ```

- [ ] Locks globales:

  ```sh
  grep -rn "setAiExplanation" src test | wc -l   # 0
  ```

  Cada R-id se comprueba en [[traceability]]: el test (archivo::nombre) y el hash del commit verde.
- [ ] Si `git ls-tree origin/dev backend-pet-tracker/src/db/migrations/` muestra una 0020 o posterior que esta branch no tiene, aplicar [[design]] §Migración antes de la PR.
- [ ] Rellenar [[traceability]] en el commit `docs(nutrition-ai-structured-plan): fill traceability`.
- [ ] Escribir `progress/impl_nutrition-ai-structured-plan.md` con los hashes, las mutaciones de R16/R17 y las cifras de las suites.

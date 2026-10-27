---
feature: "nutrition-ai-structured-plan"
status: approved     # draft | approved
tags: [harness, spec, backend, nutrition, ai]
---

# Diseño — [[nutrition-ai-structured-plan]]

> [[requirements]] tiene los requisitos que este diseño implementa y
> [[../../docs/architecture|architecture]] las reglas de capas. Las rutas de
> código son relativas a `backend-pet-tracker/`.

## Decisiones

- **D1. Salida estructurada con `output_config`, no con tool use** (R6, R7).
  `output_config.format = { type: 'json_schema', schema }` hace que el API
  devuelva un único bloque de texto con JSON que cumple el esquema. Así no hace
  falta un bucle de herramientas y el adaptador de #18 sigue leyendo bloques
  `text`. El esquema del API no admite `minimum`, `maximum`, `minItems`,
  `maxItems`, `minLength` ni `maxLength`, así que esas cotas viven en zod (tabla
  §R7) y el prompt las repite en lenguaje natural. El SDK fijado `0.128.0` ya
  tipa `output_config`.
- **D2. `thinking: { type: 'disabled' }` y `max_tokens: 2000`** (R6). Haiku 5.5
  tiene el pensamiento adaptativo activo por defecto, y con él los tokens de
  pensamiento cuentan contra `max_tokens`. La tarea es acotada (repartir gramos y
  redactar), así que el pensamiento no aporta y sube el coste y la latencia
  hacia el corte de 29 s de API Gateway. El modelo admite `disabled` con effort
  `high` o menor; no se envía `effort`, así que vale el default, `medium`.
  2000 tokens cubren una explicación de 180 palabras, tres recomendaciones y
  el JSON. El timeout de 15 s y los 0 reintentos de #18 no cambian.
- **D3. Tolerancia del 10 % en aritmética entera** (R9). Con `dailyGrams = 300`,
  `300 * 0.1` da `30.000000000000004` en coma flotante. La comparación
  `Math.abs(suma - dailyGrams) * 100 > dailyGrams * 10` no tiene ese error.
- **D4. La IA devuelve `reviewInDays` y el sistema calcula `reviewDate`** (R11, R14).
  Así la fecha de hoy no entra en el prompt ni en el hash, y un acierto de caché
  sigue siendo válido al día siguiente. `reviewDate` se fija al aceptar la
  propuesta, con el día local del dueño de ese momento, y no se recalcula.
- **D5. Propuesta en `ai_proposal jsonb`, explicación en `ai_explanation`** (R16).
  La explicación ya tiene columna y consumidores (#18). Los tres campos nuevos
  solo se leen juntos, así que van en un único jsonb y no en tres columnas.
- **D6. Contador en una tabla aparte con un upsert condicional** (R12).
  `INSERT … ON CONFLICT (pet_id, local_day) DO UPDATE SET count = count + 1 WHERE count < limit RETURNING count`
  es una sola sentencia. Postgres bloquea la fila en conflicto, así que con
  llamadas concurrentes `count` nunca pasa de `limit` y no hace falta una
  transacción explícita. Si no vuelve fila, el límite está agotado.
- **D7. Se consume antes de llamar a la IA** (R13, R14). Un `'unavailable'` o un
  `'rejected'` pueden haber costado tokens, así que cuentan. El adaptador nulo
  también consume: es el precio de no añadir al puerto una bandera `enabled`
  que solo usaría este caso.
- **D8. Sin propuesta, se descarta también la explicación** (R13). Si la salida
  no cumple R8 o R9, la explicación describe un reparto que no se sirve, así
  que no se guarda ninguna de las dos.
- **D9. El filtro de tóxicos actúa por recomendación** (R10, R11). Descartar una
  recomendación es más seguro que descartar la propuesta entera, que tiene
  gramos válidos. La comparación por tokens enteros evita encontrar «ajo» dentro
  de «trabajo».
- **D10. `aiStatus` solo en `generate`** (R16). GET no sabe por qué no hay
  propuesta, salvo que guardara el estado. #215 muestra el estado justo después
  de generar y, en GET, solo si hay propuesta o no.
- **D11. Copiar el horario borra la propuesta** (R17). La propuesta está atada a
  las franjas de su plan. Tras mover o añadir una franja, el `generate` siguiente
  reintenta sobre la copia (R15), con su horario.
- **D12. Tendencia de 5 pesos** (R2, R3, R5). Cinco puntos bastan para ver la
  tendencia y mantienen el prompt corto.

## Símbolos por capa (nombres exactos)

### Dominio

`src/modules/nutrition/domain/nutrition-ai-proposal.ts` (nuevo, función pura, importa `shiftDay` de `@/pipeline/local-day`, como hace el dominio de actividad):

```ts
export const NUTRITION_AI_DAILY_LIMIT = 3;
export const NUTRITION_AI_GRAMS_TOLERANCE_PERCENT = 10;
export const NUTRITION_AI_WEIGHT_TREND_POINTS = 5;
export interface NutritionMealGrams { mealTime: string; grams: number }
export interface NutritionAiOutput { mealGrams: NutritionMealGrams[]; recommendations: string[]; reviewInDays: number; explanation: string }
export interface NutritionAiProposal { mealGrams: NutritionMealGrams[]; recommendations: string[]; reviewDate: string }
export type NutritionAiStatus = 'proposed' | 'not_tracked' | 'limit_reached' | 'unavailable' | 'rejected';
export function acceptAiOutput(
  output: NutritionAiOutput,
  plan: { dailyGrams: number; mealTimes: string[] },
  localDay: string,
): { explanation: string; proposal: NutritionAiProposal } | null;
```

`src/modules/nutrition/domain/nutrition-toxic-foods.ts` (nuevo):

```ts
export const NUTRITION_TOXIC_FOODS: readonly string[]; // §G2.2 literal
export function mentionsToxicFood(text: string): boolean;
```

Normalización (R10): `text.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().split(/[^a-z0-9]+/).filter(Boolean)`.
El resultado es `true` si `' ' + tokens.join(' ') + ' '` contiene `' ' + term + ' '` para algún término.

`src/modules/nutrition/domain/ports/nutrition-weight-reader.ts` (nuevo):

```ts
export const NUTRITION_WEIGHT_READER = Symbol('NutritionWeightReader');
export interface NutritionWeightPoint { measuredAt: string; weightKg: number }
export interface NutritionWeightReader {
  /** Los `limit` pesos más recientes, del más antiguo al más reciente. */
  listRecent(petId: string, limit: number): Promise<NutritionWeightPoint[]>;
}
```

`src/modules/nutrition/domain/ports/nutrition-explainer.ts` (cambia la firma):

```ts
explain(input: NutritionEngineInput, result: NutritionPlanResult, weightTrend: NutritionWeightPoint[], ctx: NutritionExplainerContext): Promise<NutritionAiOutput | null>;
```

`src/modules/nutrition/domain/entities/nutrition-plan.entity.ts`:
- `NutritionPlanProps` y la clase ganan `aiProposal: NutritionAiProposal | null`. `NewNutritionPlan` la hereda.
- `copyWithMealTimes` pone `aiProposal: null` y sigue copiando `aiExplanation` (R17).

`src/modules/nutrition/domain/repositories/nutrition.repository.ts`:
- `setAiExplanation` desaparece. En su lugar, `setAiResult(planId: string, explanation: string, proposal: NutritionAiProposal): Promise<NutritionPlan>;`.
- Nuevo: `consumeAiGeneration(petId: string, localDay: string, limit: number): Promise<boolean>;`.

### Aplicación

`src/modules/nutrition/application/nutrition-input-hash.ts`:
`nutritionInputHash(input: NutritionEngineInput, weightTrend: NutritionWeightPoint[]): string`.
Añade `weightTrend: weightTrend.map((p) => ({ measuredAt: p.measuredAt, weightKg: Number(p.weightKg) }))` como **última** clave del objeto canónico. Las diez claves de antes no cambian.

`src/modules/nutrition/application/dto/nutrition-profile.dto.ts`:
`allergies: z.array(z.string().max(100)).max(20).default([]),`, y lo mismo para `diseases` (R1). Las cifras coinciden con `NUTRITION_AI_MAX_ITEM_CHARS` y `NUTRITION_AI_MAX_LIST_ITEMS`, pero la DTO no las importa: la aplicación no importa infraestructura. Se escriben como literales.

`src/modules/nutrition/application/use-cases/generate-nutrition-plan.use-case.ts`:

```ts
export interface GenerateNutritionPlanResult { plan: NutritionPlan; aiStatus: NutritionAiStatus }
// constructor: los cuatro parámetros actuales, y al final:
//   @Inject(NUTRITION_WEIGHT_READER) private readonly weights: NutritionWeightReader
execute(petId: string, now: Date = new Date()): Promise<GenerateNutritionPlanResult>;
```

La edad se calcula con `now` en vez de `new Date()`.

El `warn` de `'rejected'` usa `private readonly logger = new Logger(GenerateNutritionPlanUseCase.name)` de `@nestjs/common`, igual que el adaptador, con el objeto exacto de R13 (d). `scope` es el literal `'nutrition-ai'`, porque la aplicación no importa `NUTRITION_AI_SCOPE` de infraestructura.

### Infraestructura

`src/modules/nutrition/infrastructure/ai/nutrition-prompt.ts`:
- `NUTRITION_AI_SYSTEM_PROMPT` pasa a ser el texto de §G2.1, con el comentario de §G2.1 en la línea anterior.
- `buildUserPrompt(input, result, weightTrend)` devuelve `JSON.stringify({ input: <igual que hoy>, result: <igual que hoy>, weightTrend: weightTrend.map((p) => ({ measuredAt: p.measuredAt, weightKg: p.weightKg })) })`.
- Nuevo `NUTRITION_AI_OUTPUT_JSON_SCHEMA`, el literal de §C-2.
- Nuevo `NutritionAiOutputSchema`, de zod (§C-3).

`src/modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.ts`:
- `NUTRITION_AI_MAX_OUTPUT_TOKENS = 2_000`.
- `AnthropicMessageParams` gana `thinking: { type: 'disabled' }` y `output_config: { format: { type: 'json_schema'; schema: Record<string, unknown> } }`.
- La normalización pasa a ser: si `stop_reason === 'end_turn'` y el texto recortado no está vacío, `JSON.parse` dentro de `try` y luego `NutritionAiOutputSchema.safeParse`. Si sale bien, devuelve `data`. En cualquier otro caso, `warn` con `message: 'ai proposal unusable'` (mismos campos que hoy) y `null`. Un `JSON.parse` fallido va por esa rama, no por el `catch` de errores de red.
- El `catch` de errores y la carga perezosa del SDK no cambian.

`src/modules/nutrition/infrastructure/ai/null-nutrition-explainer.ts`: solo cambia la firma de `explain` (cuatro parámetros). Sigue devolviendo `null` con su `warn`.

`src/db/schema/nutrition.schema.ts`:
- En `nutritionPlans`: `aiProposal: jsonb('ai_proposal').$type<NutritionAiProposal>(),`, nullable y justo después de `aiExplanation`.
- Tabla nueva `nutritionAiGenerations = pgTable('nutrition_ai_generations', …)`:
  - `petId: uuid('pet_id').notNull().references(() => pets.id, { onDelete: 'cascade' })`;
  - `localDay: date('local_day').notNull()`;
  - `count: integer('count').notNull()`;
  - `primaryKey({ columns: [t.petId, t.localDay] })`;
  - `check('nutrition_ai_generations_count_check', sql\`${t.count} > 0\`)`.

`src/modules/nutrition/infrastructure/repositories/nutrition.drizzle.repository.ts`:
- `setAiResult`: `update(nutritionPlans).set({ aiExplanation: explanation, aiProposal: proposal }).where(eq(nutritionPlans.id, planId)).returning()`, mapeado como hoy.
- `consumeAiGeneration`:
  - `insert(nutritionAiGenerations).values({ petId, localDay, count: 1 })`;
  - `.onConflictDoUpdate({ target: [t.petId, t.localDay], set: { count: sql\`${t.count} + 1\` }, setWhere: sql\`${t.count} < ${limit}\` })`;
  - `.returning({ count: t.count })`;
  - devuelve `rows.length === 1`.

  Con `limit` igual a 0 el INSERT inicial concedería uno; el único llamador pasa 3.
- El mapper de filas añade `aiProposal: row.aiProposal ?? null`.

`src/modules/health/infrastructure/repositories/nutrition-weight.drizzle-reader.ts` (nuevo): `NutritionWeightDrizzleReader implements NutritionWeightReader`, con `@Inject(DRIZZLE) private readonly db: NodePgDatabase`, como `PetVaccineDrizzleReader`.
- Consulta: `select({ measuredAt, weightKg }).from(weights).where(eq(weights.petId, petId)).orderBy(desc(weights.measuredAt), desc(weights.id)).limit(limit)`.
- Después invierte el orden y convierte `weightKg` con `Number`.

`src/modules/health/nutrition-weight-read.module.ts` (nuevo): `NutritionWeightReadModule`, que provee `{ provide: NUTRITION_WEIGHT_READER, useClass: NutritionWeightDrizzleReader }` y exporta `NUTRITION_WEIGHT_READER`. Es el mismo patrón que `pet-vaccine-read.module.ts`.

`src/modules/nutrition/nutrition.module.ts`: `imports: [PetsModule, SubscriptionsModule, ConfigModule, NutritionWeightReadModule],`.

`src/modules/nutrition/infrastructure/mappers/nutrition.mapper.ts`:
- `NutritionPlanResponse` gana `aiProposal: NutritionAiProposal | null;` justo después de `aiExplanation`. Son 12 claves, y `NutritionPlanTodayResponse` tiene 14.
- `toNutritionPlanResponse` mapea `aiProposal: plan.aiProposal,`.
- Nuevo `NutritionPlanGenerateResponse extends NutritionPlanResponse { aiStatus: NutritionAiStatus }` (13 claves).
- Nuevo `toNutritionPlanGenerateResponse(result: GenerateNutritionPlanResult): NutritionPlanGenerateResponse`, que devuelve `{ ...toNutritionPlanResponse(result.plan), aiStatus: result.aiStatus }`.

`src/modules/nutrition/infrastructure/nutrition.controller.ts`: `generate` devuelve `toNutritionPlanGenerateResponse(await this.generatePlan.execute(request.petMembership.petId))` y su tipo es `Promise<NutritionPlanGenerateResponse>`. Las demás rutas no cambian.

`createNutritionExplainer` (`nutrition-explainer.factory.ts`) no cambia: la selección entre el adaptador real y el nulo es la de #18.

## Flujo de `execute(petId, now)` (R13–R15)

1. Perfil y mascota, igual que hoy, con los mismos errores.
2. Se arma `input` con la edad calculada a `now`.
3. `trend = await weights.listRecent(petId, NUTRITION_AI_WEIGHT_TREND_POINTS)`.
4. `hash = nutritionInputHash(input, trend)` y `latest = findLatestPlan(petId)`.
5. Si `latest?.inputsHash === hash`:
   - con `latest.aiProposal !== null`, devuelve `{ plan: latest, aiStatus: 'proposed' }`. No llama a nada más (R15).
   - si no, pasa a la fase de IA con `plan = latest` (R15).
6. Si no coincide: `computePlan(input)`, luego `insertPlan({ petId, ...result, ...carriedSchedule(latest, result), engineMealsPerDay, aiExplanation: null, aiProposal: null, inputsHash: hash })`, luego la fase de IA con el plan insertado.
7. Fase de IA, sobre `plan`:
   1. Si `!(await subscriptions.isPetTracked(petId))`, devuelve `{ plan, aiStatus: 'not_tracked' }`.
   2. `day = await ownerLocalDay(pets, petId, now)`.
   3. Si `!(await nutrition.consumeAiGeneration(petId, day, NUTRITION_AI_DAILY_LIMIT))`, devuelve `'limit_reached'`.
   4. `output = await explainer.explain(input, toPlanResult(plan), trend, { petId, planId: plan.id })`. Si es `null`, devuelve `'unavailable'`.
   5. `accepted = acceptAiOutput(output, plan, day)`. Si es `null`, `warn` exacto y devuelve `'rejected'`.
   6. `updated = await nutrition.setAiResult(plan.id, accepted.explanation, accepted.proposal)` y devuelve `{ plan: updated, aiStatus: 'proposed' }`.

## Fixtures

Literales para los tests. Cada fichero de test los escribe; no se importan de producción.

`VALID_OUTPUT`, para los unitarios del adaptador y del caso de uso. Encaja con
el plan insertado del doble del caso de uso: `dailyGrams` 305 y
`mealTimes: ['08:00', '14:00', '22:00']`, constante `projected` de
`generate-nutrition-plan.use-case.spec.ts`.

```ts
const VALID_OUTPUT = {
  mealGrams: [
    { mealTime: '08:00', grams: 100 },
    { mealTime: '14:00', grams: 100 },
    { mealTime: '22:00', grams: 105 },
  ],
  recommendations: ['Pésala cada dos semanas.'],
  reviewInDays: 30,
  explanation: 'Tu perro necesita...',
};
```

- Fuera de cota para R13 (d): `{ ...VALID_OUTPUT, mealGrams: [{ mealTime: '08:00', grams: 50 }, { mealTime: '14:00', grams: 50 }, { mealTime: '22:00', grams: 50 }] }`.
- Para R15, con horario editado: `{ ...VALID_OUTPUT, mealGrams: [{ mealTime: '08:15', grams: 150 }, { mealTime: '19:30', grams: 155 }] }`.

`E2E_OUTPUT`, para el e2e. El perro del fixture, de 20 kg, adulto, esterilizado, actividad media y 350 kcal/100 g, da 305 g y `['07:30', '19:30']`. La suma de 310 está dentro de la tolerancia:

```ts
const E2E_OUTPUT = {
  mealGrams: [
    { mealTime: '07:30', grams: 150 },
    { mealTime: '19:30', grams: 160 },
  ],
  recommendations: ['Pésala cada dos semanas.', 'Evita darle chocolate.'],
  reviewInDays: 30,
  explanation: 'Explicación de prueba.',
};
```

- La propuesta persistida esperada tiene `recommendations: ['Pésala cada dos semanas.']`, porque el filtro quita la segunda.
- Fuera de cota: `mealGrams` con 100 y 100.
- R17, tras mover: `mealGrams` con `08:15`/150 y `19:30`/160.

`reviewDate` esperado en e2e: el usuario del fixture tiene `timezone: 'UTC'`.
- Se calcula `before = shiftDay(new Date().toISOString().slice(0, 10), 30)` antes de la petición y `after` igual después.
- La aserción acepta `before` o `after`, para que no falle al cruzar la medianoche.

`PLAN_300 = { dailyGrams: 300, mealTimes: ['07:30', '12:00', '19:30'] }` y
`PLAN_305 = { dailyGrams: 305, mealTimes: ['07:30', '19:30'] }`, para el dominio.
En las filas de R9 los gramos se reparten con enteros: por ejemplo, 269 es
`90, 90, 89` y 274 es `137, 137`.

## §C-2 — `NUTRITION_AI_OUTPUT_JSON_SCHEMA` (literal)

```json
{"type":"object","properties":{"mealGrams":{"type":"array","items":{"type":"object","properties":{"mealTime":{"type":"string"},"grams":{"type":"integer"}},"required":["mealTime","grams"],"additionalProperties":false}},"recommendations":{"type":"array","items":{"type":"string"}},"reviewInDays":{"type":"integer"},"explanation":{"type":"string"}},"required":["mealGrams","recommendations","reviewInDays","explanation"],"additionalProperties":false}
```

## §C-3 — `NutritionAiOutputSchema` (zod 4)

- `z.strictObject` en los dos niveles.
- `mealGrams`: `z.array(z.strictObject({ mealTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/), grams: z.number().int().min(1) })).min(1).max(6)`.
- `recommendations`: `z.array(z.string().trim().min(1).max(200)).min(1).max(3)`.
- `reviewInDays`: `z.number().int().min(7).max(90)`.
- `explanation`: `z.string().trim().min(1).max(1500)`.

`.trim()` va antes de `.min`/`.max`, así que la longitud se mide después de recortar y `data` sale recortado (R7).

## Migración y coordinación con #210 y #211

Hay **una** migración, que genera drizzle-kit en el commit verde de R12:

```sh
cd backend-pet-tracker && pnpm exec drizzle-kit generate --name nutrition_ai_structured_plan
```

En la base medida (`1316410f`) salía `0020_…`. En `4cf5846d`, con `0020_pet_invites` y
`0021_reminders_recurrence` ya mergeadas desde dev, sale `0022_nutrition_ai_structured_plan.sql`
y el journal pasa de 22 a 23 tags. Debe contener
`ALTER TABLE "nutrition_plans" ADD COLUMN "ai_proposal" jsonb;` y
`CREATE TABLE "nutrition_ai_generations"`. El SQL generado no se edita a mano.
La migración se cita **por nombre**, no por número.

Las features #210 y #211 también generan migraciones contra `dev`. Si
`git ls-tree origin/dev backend-pet-tracker/src/db/migrations/` muestra una 0020
o posterior que esta branch no tiene, antes de la PR se aplica esta receta, común
a #210, #211 y #212. Se respetan el orden y los comandos literales. Nunca se
renumera a mano.

1. `git merge origin/dev`. Nunca rebase: invalida los hashes de [[traceability]].
2. `git checkout origin/dev -- backend-pet-tracker/src/db/migrations/meta` (journal y snapshots quedan los de dev).
3. `git rm backend-pet-tracker/src/db/migrations/00NN_nutrition_ai_structured_plan.sql` (00NN = número que tenga en ese momento).
4. `git diff --name-status origin/dev -- backend-pet-tracker/src/db/migrations | wc -l` debe dar `0`. Si no, restaurar con `git checkout origin/dev -- <ruta>` o borrar el artefacto propio.
5. `git commit --no-edit`, que cierra el merge.
6. `cd backend-pet-tracker && pnpm exec drizzle-kit generate --name nutrition_ai_structured_plan`. Requiere `../.env` con `DATABASE_URL`. El `.sql` nuevo solo contiene `ALTER TABLE "nutrition_plans" ADD COLUMN "ai_proposal" jsonb;` y `CREATE TABLE "nutrition_ai_generations"` (más sus índices o FKs propios). Si trae cualquier otra tabla, PARAR.
7. `grep -cF '"tag"' src/db/migrations/meta/_journal.json` = cuenta de `origin/dev` + 1. La cuenta base se mide con `git show origin/dev:backend-pet-tracker/src/db/migrations/meta/_journal.json | grep -cF '"tag"'`.
8. Commit propio `chore(nutrition-ai-structured-plan): regenerate migration after merging dev (R12,R16)`.
9. Recrear la base del worktree antes del siguiente `db:migrate`: `docker exec pet-tracker-postgres psql -U pet_tracker -d postgres -c 'DROP DATABASE pet_tracker_wt212;'`, luego `docker exec pet-tracker-postgres psql -U pet_tracker -d postgres -c 'CREATE DATABASE pet_tracker_wt212 OWNER pet_tracker;'` y luego `pnpm run db:migrate`. Nunca psql crudo sobre el journal.
10. Volver a correr las suites unitaria y e2e.

## Reglas de adaptación mecánica de tests heredados (M1–M7)

Estos cambios no son requisitos nuevos. Son el ajuste mínimo para que los tests
de #17, #18 y #103 compilen con las firmas nuevas. Van en el mismo commit que
el cambio de firma que los obliga.

- **M1.** Las llamadas a `explain`, `buildUserPrompt` o `explainer.explain`
  reciben `[]` como tercer argumento, y el `ctx` pasa al índice `[3]` (por
  ejemplo, `explain.mock.calls[0][3]`). `nutritionInputHash` recibe `[]` como
  segundo argumento.
- **M2.** Los dobles de `explain` en e2e devuelven un `NutritionAiOutput` válido
  (`E2E_OUTPUT`) en vez de un string. Las aserciones de texto comparan contra
  `E2E_OUTPUT.explanation`.
- **M3.** Las seis listas de claves de A21 ganan `'aiProposal'` justo después de
  `'aiExplanation'`. La de `generate` (en `test/nutrition.e2e-spec.ts`, el it
  `recorre el ancla del perro de 20 kg y no expone inputsHash`) gana además
  `'aiStatus'`. En los nombres de `it`, `once claves` pasa a `doce claves` y
  `trece claves` a `catorce claves`.
- **M4.** En `anthropic-nutrition-explainer.spec.ts`, los dobles de éxito que se
  quedan (R11 y E1.3 de #18) devuelven `text: JSON.stringify(VALID_OUTPUT)` y
  las aserciones pasan de `.resolves.toBe('Tu perro necesita...')` a
  `.resolves.toEqual(VALID_OUTPUT)`.
- **M5.** El e2e R13 de #18 (`UPDATE solo de la segunda fila por id`) excluye
  `aiProposal` junto a `aiExplanation` al comparar filas.
- **M6.** Todo literal de `NutritionPlan` o `NewNutritionPlan` gana
  `aiProposal: null`, también el `toStrictEqual` de R3 de #103 en
  `nutrition-plan.entity.spec.ts`.
- **M7.** Los dobles del caso de uso ganan:
  - `findOwnerTimezone`, resuelto a `'UTC'`, salvo en R14;
  - `consumeAiGeneration`, resuelto a `true`;
  - `setAiResult` en vez de `setAiExplanation`;
  - `weights: { listRecent }`, resuelto a `[]` salvo en R14, como quinto argumento del constructor.

  Cualquier aserción exacta sobre el cuerpo de `generate` o de GET en otros e2e gana las mismas claves.

Prueba de que no queda nada del contrato viejo, al final de la cadena:

```sh
grep -rn "setAiExplanation" backend-pet-tracker/src backend-pet-tracker/test  # 0 líneas
```

## Tests de #18 sustituidos o conservados

| Fichero | Describe o it de #18 | Destino |
|---|---|---|
| `anthropic-nutrition-explainer.spec.ts` | `R9 (nutrition-ai-explainer #18): parametros exactos de la llamada` | se borra; lo sustituye R6 |
| `anthropic-nutrition-explainer.spec.ts` | `R10 (nutrition-ai-explainer #18): normaliza respuestas a texto o null con warn` | se borra; lo sustituye R7 |
| `anthropic-nutrition-explainer.spec.ts` | `R11 (nutrition-ai-explainer #18): cualquier fallo degrada con un warn` y `… E1.3: la carga perezosa del SDK tambien degrada a null` | se quedan, con M1 y M4 |
| `null-nutrition-explainer.spec.ts` | R5 de #18 | se queda, con M1 |
| `nutrition-prompt.spec.ts` | `R6 (nutrition-ai-explainer #18): system prompt literal y versionado` | se borra; lo sustituye R4 |
| `nutrition-prompt.spec.ts` | its `serializa exactamente dos objetos con diez y siete claves` y `tiene dos parametros y no recibe ctx` | se borran; los sustituye R5 |
| `nutrition-prompt.spec.ts` | it `no filtra foodType, nombre, email ni UUID del perfil o plan` y el describe `R8 (nutrition-ai-explainer #18): cotas del texto libre en JSON` | se quedan, con M1 |
| `generate-nutrition-plan.use-case.spec.ts` | describes `R12`, `R14`, `R15` y `R16 (nutrition-ai-explainer #18)` | se borran; los sustituyen R13–R15. El it `toPlanResult proyecta exactamente las siete claves sin identificadores` se mueve tal cual a un describe propio |
| `nutrition.drizzle.repository.spec.ts` | `R13 (nutrition-ai-explainer #18): UPDATE exclusivo por id y returning mapeado` | se borra; lo sustituye R16 |
| `nutrition-explainer.factory.spec.ts` | R3 y R5 de #18 | sin cambios |
| `test/nutrition-ai-explainer.e2e-spec.ts` | R18, R13 y R16 de #18 | se quedan, con M1, M2 y M5 |

## Archivos afectados

| Capa | Archivo | Cambio |
|---|---|---|
| domain | `src/modules/nutrition/domain/nutrition-ai-proposal.ts` | nuevo |
| domain | `src/modules/nutrition/domain/nutrition-toxic-foods.ts` | nuevo |
| domain | `src/modules/nutrition/domain/ports/nutrition-weight-reader.ts` | nuevo |
| domain | `src/modules/nutrition/domain/ports/nutrition-explainer.ts` | firma de `explain` |
| domain | `src/modules/nutrition/domain/entities/nutrition-plan.entity.ts` | `aiProposal`; `copyWithMealTimes` |
| domain | `src/modules/nutrition/domain/repositories/nutrition.repository.ts` | `setAiResult`, `consumeAiGeneration` |
| application | `src/modules/nutrition/application/nutrition-input-hash.ts` | `weightTrend` |
| application | `src/modules/nutrition/application/dto/nutrition-profile.dto.ts` | `.max()` |
| application | `src/modules/nutrition/application/use-cases/generate-nutrition-plan.use-case.ts` | fase de IA y resultado `{ plan, aiStatus }` |
| infrastructure | `src/modules/nutrition/infrastructure/ai/nutrition-prompt.ts` | prompt G2, `buildUserPrompt`, esquemas |
| infrastructure | `src/modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.ts` | parámetros y normalización |
| infrastructure | `src/modules/nutrition/infrastructure/ai/null-nutrition-explainer.ts` | firma |
| infrastructure | `src/db/schema/nutrition.schema.ts` | columna y tabla |
| infrastructure | `src/db/migrations/<generada>_nutrition_ai_structured_plan.sql` y `meta/` | generadas por drizzle-kit |
| infrastructure | `src/modules/nutrition/infrastructure/repositories/nutrition.drizzle.repository.ts` | `setAiResult`, `consumeAiGeneration`, mapper de filas |
| infrastructure | `src/modules/nutrition/infrastructure/mappers/nutrition.mapper.ts` | `aiProposal`, respuesta de `generate` |
| infrastructure | `src/modules/nutrition/infrastructure/nutrition.controller.ts` | `generate` |
| infrastructure | `src/modules/nutrition/nutrition.module.ts` | importa `NutritionWeightReadModule` |
| infrastructure | `src/modules/health/infrastructure/repositories/nutrition-weight.drizzle-reader.ts` | nuevo |
| infrastructure | `src/modules/health/nutrition-weight-read.module.ts` | nuevo |
| docs | `docs/brief.md`, `plans/009-alimentacion-ia.md`, `docs/data-model.md`, `docs/verification.md` | R18 y R19 |

Tests nuevos:
- `src/modules/nutrition/application/dto/nutrition-profile.dto.spec.ts`;
- `src/modules/nutrition/domain/nutrition-ai-proposal.spec.ts`;
- `src/modules/nutrition/domain/nutrition-toxic-foods.spec.ts`;
- `test/nutrition-ai-structured-plan.e2e-spec.ts`.

El e2e nuevo copia el `fixture()` de `test/nutrition-ai-explainer.e2e-spec.ts`
(usuario en UTC, perro esterilizado nacido el 2021-01-15, `currentWeightKg` 20,
perfil a 350 kcal) y añade `userId` al objeto que devuelve, para `weights.createdBy`.
- Sobrescribe `NUTRITION_EXPLAINER` y `SUBSCRIPTION_REPOSITORY`, como ese fichero.
- **No** sobrescribe `NUTRITION_WEIGHT_READER` ni `NUTRITION_REPOSITORY`: R2 y R12 prueban los reales, que se obtienen con `app.get(...)`.
- Los pesos de R2 se insertan con `db.insert(weights).values(...)`, como hace `test/health-weights.e2e-spec.ts`.

**Dependencias nuevas: ninguna.** `zod`, `drizzle-orm`, `drizzle-kit` y `@anthropic-ai/sdk` ya están instalados.

## Coste

- Por llamada, unos 700 tokens de entrada (prompt de sistema, JSON y esquema) y unos 700 de salida.
- A 0,10 y 0,50 USD por millón de tokens (Haiku 5.5), son unos 0,0004 USD por llamada. El peor caso, a `max_tokens`, es de unos 0,0011 USD.
- Con el límite de 3 por mascota y día, el peor caso es de unos 0,0032 USD por mascota con collar y día.
- No se crean recursos AWS.
- La prueba R20 cuesta menos de 0,01 USD.

## Consecuencias declaradas

- **Invalidación masiva de planes.** El hash cambia para todos los planes (R3). El
  siguiente `generate` de cada mascota inserta un plan nuevo; `carriedSchedule`
  conserva los horarios editados. El primer `generate` con collar tras el
  despliegue consume una unidad del límite.
- **Un peso nuevo cambia el hash**, aunque tenga el mismo valor que el anterior.
  Es el comportamiento buscado: la tendencia es parte de la entrada.
- **El adaptador nulo consume del límite** (D7). Sin clave no hay coste, pero el
  contador sube.
- **`kcalConsumedToday`** sigue con el reparto del motor.
- Codex debe correr las suites unitaria y e2e completas, no solo los ficheros
  tocados: cualquier e2e que publique pesos o compare cuerpos de nutrición puede
  moverse.

## Alternativas descartadas

- **Tool use con `strict: true`.** Necesita un bucle o forzar `tool_choice`, y
  devuelve un bloque `tool_use` que obliga a reescribir la normalización. Ofrece
  la misma garantía de esquema que `output_config`.
- **Tres columnas** (`ai_meal_grams`, `ai_recommendations`, `ai_review_date`).
  Se leen siempre juntas y nadie filtra por ellas. Un jsonb basta.
- **Una bandera `enabled` en el puerto** para no consumir con el adaptador nulo.
  Añade superficie al puerto para ahorrar un contador sin coste real.
- **Que la IA devuelva la fecha de revisión.** Haría falta poner la fecha de hoy
  en el prompt y en el hash, y el caché caducaría cada día.
- **Tolerancia del 5 %.** Con 2 o 3 franjas y gramos enteros deja poco margen
  para repartir por edad o tendencia. El 10 % sigue dentro de lo que el motor
  considera mantenimiento.
- **Contador como columna en `nutrition_plans`.** El límite es por mascota y día,
  no por plan: varios planes del mismo día comparten el límite.
- **Pensamiento adaptativo.** Sube coste y latencia sin mejorar una tarea acotada.
- **Conservar la explicación cuando se rechaza la propuesta.** La explicación
  describe un reparto que no se sirve (D8).

---
feature: "nutrition-ai-explainer"
status: draft        # draft | approved
tags: [harness, spec]
---

# Tareas — [[nutrition-ai-explainer]]

> Disciplina TDD (`docs/verification.md`). Cada tarea corresponde a un requisito
> de [[requirements]] y tiene siempre los mismos 3 sub-items, en este orden.
> Rutas `src/...` y `test/...` relativas a `backend-pet-tracker/`.
>
> **Cada test nombra su requisito con el sufijo de feature**:
> `describe('R<n> (nutrition-ai-explainer #18): ...')`. #17 ya escribió R1..R27
> en estos mismos archivos y #103 los suyos en `test/meal-times.e2e-spec.ts`.
>
> **Commits test-primero (RP-1).** Un commit `test(nutrition-ai-explainer): ...
> (R<n>)` que compila y falla **por aserción**, y después un commit
> `feat(nutrition-ai-explainer): ... (R<n>)` que lo pone verde. Tests +
> implementación en un solo commit es motivo de rechazo (C4; precedente #19).
> Si el test necesita un símbolo que aún no existe, el commit de test MAY añadir
> su firma mínima (tipo, constante con valor incorrecto, método que lanza).
> Antes de cada commit de test: `pnpm -C backend-pet-tracker exec tsc --noEmit`.
>
> **Una fila por rama.** Cada cláusula universal de [[requirements]] ("cualquier
> otro valor", "cualquier motivo", "en cada caso") tiene un candado por rama,
> enumerado abajo. Un `it.each` vale si cada fila es una de las ramas listadas;
> lo que no vale es cubrir la cláusula con un solo caso representativo.
>
> **Guardas: rojo visto + anti-vacío.** Para cada guarda (R3, R5, R7, R8, R10,
> R11, R14, R15, R16): (a) el test se ve fallar antes de implementar, y (b)
> incluye su aserción anti-vacío (el camino que sí debe producir texto lo
> produce). Las guardas de texto negativo que nacen verdes porque el árbol ya
> las cumple (aserciones 1–5, 8, 11, 12 y 13 de R1a) se prueban con una **sonda de
> mutación** local: plantar el texto prohibido, ver el rojo, deshacer con
> `git checkout HEAD -- <ruta>` y comprobar `git diff --cached --quiet`. La
> salida del rojo se pega en `progress/impl_nutrition-ai-explainer.md`; la
> sonda **no** se commitea.
>
> **R1 deja la suite roja a propósito** (única excepción a RP-1(b), declarada
> en [[requirements]] R1).
>
> **Ningún test toca la red** (R3). Es dinero real.
>
> **Orden de trabajo** (cada bloque solo asevera sujetos que ya existen):
> R1 → R4 → dependencia → R6/R7/R8 (prompt puro) → R9/R10/R11 (adaptador
> Anthropic, con doble) → R5/R3 (factory + adaptador nulo + módulo) → R17
> (mapper) → R13 unitario (repositorio) → R12/R14/R15/R16 (use-case) → e2e de
> R13/R16/R18 (archivo nuevo) → R2 (verificación final) → R19 (gate humano).
> Los e2e necesitan Docker levantado (`docker compose up -d`).
>
> **Un solo escritor sobre el working tree.** Mientras se implementa #18 nadie
> más toca `backend-pet-tracker/`.

---

## Derogación de #17 y régimen de tests

## R1 — Derogación de R26 de #17 (commit propio, suite roja a propósito)

- [ ] (1) Escribir test que falla para R1 — un solo commit
  `test(nutrition-ai-explainer): derogate R26 of #17 (R1)` con:
  - `src/modules/nutrition/nutrition-scope.spec.ts`: renombrar el `describe` al
    literal de R1(a); conservar las aserciones 1–5; añadir las aserciones 6–13
    de la tabla de R1(a), cada una en su `it` con el prefijo del R-id que
    cierra. La aguja de la aserción 11 se construye como
    `['claude', '-'].join('')`.
  - `test/nutrition.e2e-spec.ts`: renombrar la primera mitad del bloque R26 de
    #17 al literal de R1(b) y borrar la segunda mitad (`'must not leak while
    feature 17 is active'`).
  - `test/meal-times.e2e-spec.ts`: en el bloque R12 de #103, cambiar
    `toHaveProperty('aiExplanation', null)` por
    `toHaveProperty('aiExplanation', 'explicacion previa')`.
  - Rojo esperado: aserción 6 (sin dependencia), 7 y 9 (sin variables), 10
    (sin factory) y R1(c) (mapper con literal). Verdes desde el principio: 1–5,
    8, 11, 12 y 13 (sonda de mutación para 8, 11, 12 y 13; para 8, plantar
    `ANTHROPIC_API_KEY=sk-x` en `.env.example`).
- [ ] (2) Implementación mínima que lo pasa — no hay implementación propia: se
  pone verde por partes con R4 (7 y 9), la dependencia (6), R5 (10) y R17
  (R1(c)).
- [ ] (3) Refactor con tests verdes — anclas A38–A41, A43, A44 de
  [[requirements]] §E-5 con el valor "tras #18".

## R4 — Las tres variables en `.env.example` y `docs/conventions.md`

- [ ] (1) Escribir test que falla para R4 — ya escrito en R1: aserciones 7, 8 y
  9. Ramas: `ANTHROPIC_ENABLED=false`, `ANTHROPIC_API_KEY=PENDING`,
  `ANTHROPIC_MODEL=<no vacío>` (tres `expect`), clave sin `sk-`, y las tres
  filas en `docs/conventions.md` (tres `expect`).
- [ ] (2) Implementación mínima que lo pasa — un commit
  `feat(nutrition-ai-explainer): add Anthropic env vars (R4)` con el bloque
  literal de C-4 al final de `.env.example`, las tres filas literales de C-4
  tras la fila de `PUSH_ENABLED` en `docs/conventions.md`, y en
  `env-drift.test.mjs` la línea `assert.equal(keys.length, 24);` cambiada a
  `27`.
- [ ] (3) Refactor con tests verdes — `node --test env-drift.test.mjs` verde;
  `git diff <base>..HEAD -- env-drift.mjs` vacío; el diff de
  `env-drift.test.mjs` es una línea quitada y una añadida; anclas A1–A7.

## Dependencia

- [ ] `pnpm -C backend-pet-tracker add --save-exact @anthropic-ai/sdk@0.128.0`;
  `package.json` y `pnpm-lock.yaml` en el mismo commit
  `build(nutrition-ai-explainer): add @anthropic-ai/sdk 0.128.0 (R1)` (RP-4).
  Pone verde la aserción 6 de R1. Ancla A15.

## Prompt (puro, sin SDK, sin red, sin BD)

## R6 — System prompt literal y versionado

- [ ] (1) Escribir test que falla para R6 — `nutrition-prompt.spec.ts`:
  `expect(NUTRITION_AI_SYSTEM_PROMPT).toBe('<literal de C-1>')` con el literal
  escrito en el test; el texto fuente de `nutrition-prompt.ts` contiene
  `2026-08-18`. Firma mínima permitida: la constante con `''`.
- [ ] (2) Implementación mínima que lo pasa — constante y comentario de C-1.
- [ ] (3) Refactor con tests verdes — no reescribir, resumir ni "mejorar" el
  texto.

## R7 — El user prompt solo lleva input + resultado (GUARDA de privacidad)

- [ ] (1) Escribir test que falla para R7 — `nutrition-prompt.spec.ts`, una
  aserción por cláusula:
  - claves de primer nivel exactamente `['input', 'result']`;
  - `input` exactamente las diez claves de C-5, literales en el test;
  - `result` exactamente las siete claves de C-5, literales en el test;
  - el string no contiene `'foodType'`;
  - el string no contiene `'Firulais'` (nombre de un perfil de prueba);
  - el string no cumple `/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i`;
  - `buildUserPrompt.length === 2` (no recibe `ctx`).
- [ ] (2) Implementación mínima que lo pasa — `buildUserPrompt()` puro con
  `JSON.stringify`.
- [ ] (3) Refactor con tests verdes —
  `git diff <base>..HEAD -- src/modules/nutrition/application/nutrition-input-hash.ts`
  vacío.

## R8 — Cota dura de `allergies` y `diseases` (GUARDA)

- [ ] (1) Escribir test que falla para R8 — `nutrition-prompt.spec.ts`, una fila
  por rama y por array (`allergies` y `diseases`, las mismas filas en los dos):
  - 25 elementos ⇒ 20, y son los 20 primeros en orden;
  - un elemento de 500 caracteres ⇒ 100 caracteres;
  - longitud total del prompt con los dos arrays al máximo < 8 000;
  - texto de inyección en `diseases` ⇒ aparece como valor de
    `parsed.input.diseases[0]`, idéntico;
  - **anti-vacío**: `['pollo', 'res']` ⇒ llegan los dos enteros.
- [ ] (2) Implementación mínima que lo pasa — `slice(0, NUTRITION_AI_MAX_LIST_ITEMS)`
  y `slice(0, NUTRITION_AI_MAX_ITEM_CHARS)` por elemento.
- [ ] (3) Refactor con tests verdes — **no** tocar el DTO de #17 (ancla A28).

## Adaptador Anthropic (con doble, sin red)

## R9 — Parámetros de la llamada

- [ ] (1) Escribir test que falla para R9 —
  `anthropic-nutrition-explainer.spec.ts`, con un doble
  `AnthropicMessagesClient` que captura `params`:
  - (a) `NUTRITION_AI_TIMEOUT_MS === 15_000`, `NUTRITION_AI_MAX_RETRIES === 0`,
    `NUTRITION_AI_MAX_OUTPUT_TOKENS === 1_200`;
  - (b) `Object.keys(params).sort()` igual a
    `['max_tokens', 'messages', 'model', 'system']`; `model` es
    `'modelo-de-prueba'`; `max_tokens` es `1200`; `system` es el literal de C-1
    escrito en el test; `messages` tiene longitud 1, `role` `'user'` y
    `content` igual a `buildUserPrompt(input, result)`; `create` llamado una
    vez;
  - (c) texto fuente del adaptador: contiene `apiKey: this.apiKey`,
    `timeout: NUTRITION_AI_TIMEOUT_MS` y `maxRetries: NUTRITION_AI_MAX_RETRIES`;
    no contiene `maxRetries: 0`; contiene una vez
    `await import('@anthropic-ai/sdk')`; no contiene `from '@anthropic-ai/sdk'`.
  - Firma mínima permitida: el puerto de C-6
    (`src/modules/nutrition/domain/ports/nutrition-explainer.ts`) y la clase con
    `explain()` que lanza.
- [ ] (2) Implementación mínima que lo pasa — `AnthropicNutritionExplainer` de
  C-6, con el import perezoso cuando `client === null`. Anotar en
  `progress/impl_nutrition-ai-explainer.md` cómo se obtiene el export por
  defecto del import dinámico bajo el `tsconfig` del repo y la respuesta a P5.
- [ ] (3) Refactor con tests verdes — anclas A48, A49, A50.

## R10 — Normalización de la respuesta (GUARDA)

- [ ] (1) Escribir test que falla para R10 — una fila por rama:
  - `stop_reason` distinto de `end_turn`, con texto válido en `content`:
    `'max_tokens'`, `'refusal'`, `'stop_sequence'`, `'tool_use'`,
    `'pause_turn'`, `null`, `'valor_futuro'` (siete filas) ⇒ `null`;
  - `end_turn` con contenido inútil: `[]`, solo `thinking`, `text: ''`,
    `text: '   '`, `content: null` (cinco filas) ⇒ `null`;
  - en las doce: `warn` una vez y `toEqual` el objeto completo de R10 (con
    `message: 'ai explanation unusable'`, `stopReason`, `usage`); al menos una
    fila sin `usage` en el doble ⇒ `usage: null` en el log;
  - **anti-vacío**: `thinking` + `text` ⇒ el texto; dos bloques `text` ⇒
    concatenados sin separador; texto con espacios alrededor ⇒ recortado; en
    las tres, `warn` no llamado.
- [ ] (2) Implementación mínima que lo pasa.
- [ ] (3) Refactor con tests verdes — nunca devolver `''`; solo `trim()`, sin
  recorte por longitud.

## R11 — Degradación siempre a `null` + `warn` (GUARDA)

- [ ] (1) Escribir test que falla para R11 — doble `create` que rechaza, una
  fila por rama, con `Error` planos y `status` asignado a mano (sin importar el
  SDK): `401`, `429`, `529`, `500`, conexión sin `status`, timeout sin
  `status`, y el string `'boom'`. En las siete:
  `await expect(explain(...)).resolves.toBeNull()`; `create` una vez; `warn`
  una vez y `toEqual({ scope: 'nutrition-ai', petId, planId, message })` con el
  `message` de la fila (`'boom'` para el no-`Error`);
  `JSON.stringify(warn.mock.calls)` no contiene `'clave-de-prueba'` ni
  `'pollo'`. **Anti-vacío**: el éxito de R10 no emite `warn`.
- [ ] (2) Implementación mínima que lo pasa — `try/catch` general que devuelve
  `null`, sin depender de clases de error del SDK y sin reintentar.
- [ ] (3) Refactor con tests verdes — N2: riesgo residual declarado, sin
  redacción propia.

## Configuración y selección del adaptador

## R5 — Selección del adaptador en un solo sitio (GUARDA)

- [ ] (1) Escribir test que falla para R5 — dos archivos:
  - `nutrition-explainer.factory.spec.ts`, doble de `ConfigService`
    (`{ get: (key) => values[key] }`), una fila por rama, cada una con las
    demás condiciones cumplidas, aseverando clase **y** `reason`:
    - `NODE_ENV='test'` ⇒ `node-env-test`;
    - `ANTHROPIC_ENABLED` = `undefined`, `'false'`, `'TRUE'`, `'1'`, `' true'`
      ⇒ `not-enabled` (cinco filas);
    - `ANTHROPIC_API_KEY` = `undefined`, `''`, `'   '`, `'PENDING'`,
      `' PENDING '` ⇒ `key-missing` (cinco filas);
    - `ANTHROPIC_MODEL` = `undefined`, `''`, `'   '` ⇒ `model-missing` (tres
      filas);
    - orden: `NODE_ENV='test'` + clave `'PENDING'` ⇒ `node-env-test`;
    - positiva: las cuatro cumplidas ⇒ `AnthropicNutritionExplainer`.
    - Sin `.explain(` en este archivo (ancla A52).
  - `null-nutrition-explainer.spec.ts`, una fila por cada `reason` (cuatro):
    resuelve `null`; `warn` una vez y
    `toEqual({ scope: 'nutrition-ai', petId, planId, message: 'ai explanation disabled', reason })`.
  - `test/nutrition.e2e-spec.ts`: el bloque renombrado en R1(b),
    `R5 (nutrition-ai-explainer #18): con la IA apagada generate responde 200 con aiExplanation null`
    (criterio de aceptación 1), sin overrides.
- [ ] (2) Implementación mínima que lo pasa — `createNutritionExplainer` con el
  orden de R5 y `ANTHROPIC_API_KEY_PENDING`; `NullNutritionExplainer(reason)`;
  en `nutrition.module.ts`, `imports: [PetsModule, SubscriptionsModule, ConfigModule],`
  y el provider `NUTRITION_EXPLAINER` con `useFactory`. Pone verde la aserción
  10 de R1.
- [ ] (3) Refactor con tests verdes — ni el use-case ni los adaptadores
  inyectan `ConfigService`; anclas A14, A22, A23, A51, A53.

## R3 — Ningún test llega a la red (GUARDA)

- [ ] (1) Escribir test que falla para R3 — `nutrition-explainer.factory.spec.ts`:
  con `ANTHROPIC_ENABLED='true'`, clave y modelo de prueba y `NODE_ENV='test'`
  ⇒ `NullNutritionExplainer` con `reason` `node-env-test`; **anti-vacío**: lo
  mismo con `NODE_ENV='development'` ⇒ `AnthropicNutritionExplainer`. Ver el
  rojo con un factory que no mira `NODE_ENV`.
- [ ] (2) Implementación mínima que lo pasa — la guarda es la primera
  condición del factory; en `test/nutrition.e2e-spec.ts`,
  `process.env.ANTHROPIC_ENABLED = 'false'` a nivel de módulo, antes de
  `Test.createTestingModule`.
- [ ] (3) Refactor con tests verdes — aserciones 12 y 13 de R1 verdes (sonda de
  mutación: plantar `new AnthropicNutritionExplainer('m', 'k', null)` en un
  spec y ver el rojo); anclas A47, A52.

## Persistencia y lectura

## R17 — El mapper devuelve la explicación persistida

- [ ] (1) Escribir test que falla para R17 — dos archivos, un `it` por rama:
  - `src/modules/nutrition/infrastructure/mappers/nutrition.mapper.spec.ts`
    (nuevo): `toNutritionPlanResponse` con `'texto'` ⇒ `'texto'`, con `null` ⇒
    `null`; `toNutritionPlanTodayResponse` con `'texto'` ⇒ `'texto'`.
  - `test/nutrition.e2e-spec.ts` (app sin overrides, mascota sin collar a
    propósito, N3): tras `UPDATE` de la fila a `'texto sembrado'`,
    `GET nutrition-plan` devuelve el texto y exactamente trece claves;
    `POST meal-times` devuelve `'texto sembrado'`; con la fila en NULL, `GET`
    devuelve `null`.
- [ ] (2) Implementación mínima que lo pasa — `aiExplanation: plan.aiExplanation,`
  en `nutrition.mapper.ts` (anclas A19, A20). Pone verde R1(c).
- [ ] (3) Refactor con tests verdes — **no saltarse este bloque**: sin él todo
  lo demás puede estar verde escribiendo en una columna que nadie lee.

## R13 — `setAiExplanation` en el puerto y en el repositorio Drizzle (unitario)

- [ ] (1) Escribir test que falla para R13 —
  `nutrition.drizzle.repository.spec.ts` (nuevo), doble de la base que captura
  `update`, `set`, `where`: `update(nutritionPlans)`; `set` exactamente
  `{ aiExplanation: texto }`; `where` igual a `eq(nutritionPlans.id, planId)`;
  el método devuelve la fila mapeada. Firma mínima permitida: el método en la
  interfaz y uno que lanza en la clase.
- [ ] (2) Implementación mínima que lo pasa — `update ... set ... where ...
  returning()` + mapeo de filas existente.
- [ ] (3) Refactor con tests verdes — ancla A16 (6 métodos); los tres specs
  con `as unknown as NutritionRepository` (A17) siguen compilando. El e2e de
  R13 va en el bloque de e2e, cuando el use-case ya llama al explainer.

## Flujo del use-case

> Archivo nuevo `generate-nutrition-plan.use-case.spec.ts`, con dobles del
> repositorio (`as unknown as NutritionRepository`), `PetRepository`,
> `SubscriptionRepository` y explainer. `toPlanResult` se añade en el commit de
> test de R12 como firma mínima si hace falta.

## R12 — INSERT primero, IA después

- [ ] (1) Escribir test que falla para R12 — una fila por rama:
  - entitlement `true` + texto ⇒ orden `insertPlan` < `isPetTracked` <
    `explain` < `setAiExplanation` (por `mock.invocationCallOrder`);
    `insertPlan` con `aiExplanation: null`; `setAiExplanation(plan.id, texto)`;
    devuelve lo que devuelve `setAiExplanation`;
  - entitlement `true` + `null` ⇒ `setAiExplanation` no llamado; devuelve el
    plan insertado;
  - proyección: el plan insertado del doble tiene `mealTimes` y `mealsPerDay`
    distintos de los de `computePlan`; el segundo argumento de `explain`
    `toEqual` las siete claves de ese plan, literales; el tercero es
    `{ petId, planId: plan.id }`.
- [ ] (2) Implementación mínima que lo pasa — los seis pasos de R12; la llamada
  a `insertPlan` sin cambios (ancla A25); `toPlanResult` (ancla A27).
- [ ] (3) Refactor con tests verdes — nada de `void`, `setImmediate` ni trabajo
  en background.

## R14 — Gate de entitlement (GUARDA)

- [ ] (1) Escribir test que falla para R14 — `isPetTracked` `false`: `explain` y
  `setAiExplanation` no llamados; `aiExplanation` `null`; espías de
  `Logger.prototype.warn` **y** `Logger.prototype.error` no llamados (dos
  aserciones). **Anti-vacío**: con `true`, `explain` una vez y el plan trae el
  texto.
- [ ] (2) Implementación mínima que lo pasa — `@Inject(SUBSCRIPTION_REPOSITORY)`
  como en `claim-device.use-case.ts` (ancla A30).
- [ ] (3) Refactor con tests verdes — bloque R25 de #17 verde (ancla A42); sin
  `PetTrackingGuard` en las rutas de nutrición.

## R15 — Reintento sobre la misma fila (GUARDA)

- [ ] (1) Escribir test que falla para R15 — hash hit con `aiExplanation: null`,
  una fila por rama:
  - entitlement `true` + texto ⇒ `explain` una vez con las siete claves del
    `latestPlan` (`mealTimes` distintos del motor), `setAiExplanation` con
    `latestPlan.id`, `insertPlan` no llamado, mismo `id`;
  - entitlement `true` + `null` ⇒ `setAiExplanation` e `insertPlan` no
    llamados; devuelve `latestPlan`;
  - entitlement `false` ⇒ `explain`, `setAiExplanation` e `insertPlan` no
    llamados.
  - En las tres: `computePlan` no interviene en el prompt (la aserción de
    proyección lo prueba).
- [ ] (2) Implementación mínima que lo pasa — rama de hash hit con
  `latestPlan.aiExplanation === null`.
- [ ] (3) Refactor con tests verdes — bloque R21 de #17 verde.

## R16 — El hash hit con explicación no re-llama (GUARDA)

- [ ] (1) Escribir test que falla para R16 — hash hit con texto: `explain`,
  `isPetTracked`, `setAiExplanation` e `insertPlan` no llamados (cuatro
  aserciones); devuelve `latestPlan`.
- [ ] (2) Implementación mínima que lo pasa.
- [ ] (3) Refactor con tests verdes.

## e2e por HTTP + Postgres (archivo nuevo)

> `test/nutrition-ai-explainer.e2e-spec.ts`, `imports: [AppModule]`,
> `process.env.ANTHROPIC_ENABLED = 'false'` antes de
> `Test.createTestingModule`, y **exactamente dos** overrides:
> `NUTRITION_EXPLAINER` y `SUBSCRIPTION_REPOSITORY` (este último solo con
> `isPetTracked`). Sin override de `NUTRITION_REPOSITORY`, sin llamar al
> use-case directamente, sin `describe.each` sobre R-ids (B1). Solo rutas que
> no necesitan otros métodos de `SubscriptionRepository`.

## R18 — La explicación llega de punta a punta (anti-vacío global)

- [ ] (1) Escribir test que falla para R18 — `generate` devuelve el texto del
  doble; la fila de `nutrition_plans` (Drizzle) tiene el texto; `GET` devuelve
  el texto; el doble recibió `ctx.planId` igual al `id` de la respuesta.
- [ ] (2) Implementación mínima que lo pasa — debería estar verde con R12 +
  R13 + R17; si no, el fallo señala la pieza.
- [ ] (3) Refactor con tests verdes — sin R18 verde la feature no está
  implementada.

## R13 (e2e) — `setAiExplanation` actualiza la fila correcta

- [ ] (1) Escribir test que falla para R13 — doble del explainer `null` y luego
  `'texto B'`; `generate` (P1); `PUT` del perfil con otro `kcalPer100g`;
  `generate` (P2). Exactamente dos filas; P1 con NULL; P2 con `'texto B'`, su
  `generated_at` el de la respuesta y su `inputs_hash` sin cambios.
- [ ] (2) Implementación mínima que lo pasa — ya implementado en R13 unitario.
- [ ] (3) Refactor con tests verdes.

## R16 (e2e) — El hash hit no vuelve a pagar

- [ ] (1) Escribir test que falla para R16 — dos `generate` con el mismo perfil:
  mismo `id`, mismo texto, una fila, el doble llamado una vez.
- [ ] (2) Implementación mínima que lo pasa — ya implementado en R16.
- [ ] (3) Refactor con tests verdes.

> Los tres bloques e2e nacen verdes si el use-case ya está bien: el rojo se ve
> con una sonda de mutación local (por ejemplo, `where` por `petId` para R13,
> quitar la rama de hash hit para R16, devolver el plan insertado en vez del
> de `setAiExplanation` para R18), con la salida pegada en
> `progress/impl_nutrition-ai-explainer.md`.

## Cierre

## R2 — Cero literales de modelo en `src/` (verificación final)

- [ ] (1) Escribir test que falla para R2 — aserciones 5 y 11 de R1 (ya
  escritas). Sonda de mutación: plantar `claude-` en un comentario de un
  `.spec.ts` y `gpt-` en un comentario de producción; ver los dos rojos.
- [ ] (2) Implementación mínima que lo pasa — el modelo llega por
  `ANTHROPIC_MODEL`; los tests usan `'modelo-de-prueba'`.
- [ ] (3) Refactor con tests verdes — anclas A12, A13; repasar JSDoc y
  comentarios de los archivos nuevos.

## R19 — Prueba de humo con clave real (GATE HUMANO)

- [ ] (1) Sin test automático: escribir la sección
  `### Feature 18 — nutrition-ai-explainer` en `docs/verification.md` con los
  pasos 0–6, la tabla de diagnóstico, la condición de STOP y el coste
  estimado de R19 (anclas A9, A10).
- [ ] (2) La ejecuta **un humano**, con su clave en el `.env` local. Ninguna IA
  la corre.
- [ ] (3) El humano marca la casilla de R19 en [[requirements]] §Aprobación y
  deja la clave en `PENDING` con `ANTHROPIC_ENABLED=false`.

## Enmienda E1 — ronda 2 (candados de R3, R5, R10 y R11)

Fuente: [[requirements]] §Enmienda E1, apartados E1.0–E1.8, en su revisión 2
del 2026-10-08. Esta sección es el orden **literal** de commits de la ronda 2.
Se ejecuta después de la firma de E1 en §Aprobación y antes del cierre de R19.
Los demás bloques de este archivo ya se cumplieron en la ronda 1 y no se
rehacen.

**Convenciones de la ronda.**

- Rutas: `AI=backend-pet-tracker/src/modules/nutrition/infrastructure/ai`. Los
  comandos `pnpm exec` se lanzan desde `backend-pet-tracker/`.
- **Rojo legítimo** (CHECKPOINTS C4). Hay dos clases de rojo:
  - **Producción ya correcta.** Es el caso de todos los commits `test(...)`
    salvo E1-c3. El commit versiona **una mutación de producción**, y el
    `fix(...)` siguiente la revierte.
  - **Cambio de conducta, D-E1-a.** E1-c3 cambia solo el spec, y su rojo es
    la producción de `c09ee51c` tal como está, sin recortar. E1-c4 es el
    `feat(...)` que lo pone en verde.

  Nunca se muta un doble de test. Ningún rojo puede ser de compilación ni un
  `ReferenceError`.
- **Gate de un commit rojo.** Se mide sin pipe:
  `pnpm exec jest <spec> > <log> 2>&1; echo $?`. Se exigen tres cosas:
  - el exit es distinto de 0;
  - la línea `Tests:` es exactamente la indicada;
  - los `it` rojos son los nombrados.

  Si alguna no coincide, **se para** y no se commitea.
- **Gate de un commit verde.** El exit de jest es 0 con la línea `Tests:`
  indicada, y `pnpm exec eslint <archivos del commit>` sale con exit 0.
- **Base de tipos.** Al arrancar, en el HEAD del handoff, se mide
  `pnpm exec tsc --noEmit -p tsconfig.json; echo $?` y se anota el recuento de
  errores. Ni E1-c7 ni el HEAD final pueden añadir ninguno.
- **Sondas.** Se hacen con el árbol en E1-c17, y por cada una:
  1. Se aplica en el árbol de trabajo y se corre.
  2. Su salida (`Tests:` más el nombre de cada `it` rojo) se pega en
     `progress/impl_nutrition-ai-explainer.md` §Sondas E1.
  3. Se revierte con `git checkout HEAD -- <ruta>`.
  4. Se verifica que `git status --porcelain` y
     `git diff --cached --name-only` salen vacíos.

  Nunca se commitea una sonda.
- **Anclas.** En la tabla de [[requirements]] §Cifras y alcance, `\|` es el
  escape markdown de `|`. Se sustituye al copiar el comando.

### E1.1 — R5: argumentos de la rama positiva y recorte (D-E1-a)

- [ ] **E1-c1** `test(nutrition-ai-explainer): lock factory constructor arguments (R5, E1.1)`
  - Archivos:
    - `$AI/nutrition-explainer.factory.spec.ts`: el helper
      `constructorArgs` y el `toEqual` en los dos anti-vacíos (puntos 1 y 2
      de E1.1). El `it` del punto 3 **no** entra aquí.
    - `$AI/nutrition-explainer.factory.ts`: la mutación versionada
      `return new AnthropicNutritionExplainer(key, model, null);`.
  - Gate rojo sobre `src/modules/nutrition/infrastructure/ai/nutrition-explainer.factory.spec.ts`:
    `Tests: 2 failed, 16 passed, 18 total`. Los rojos son
    `anti-vacio: development selecciona Anthropic sin invocarlo` y
    `anti-vacio: todas cumplidas seleccionan el adaptador real sin invocarlo`,
    los dos por `toEqual`.
- [ ] **E1-c2** `fix(nutrition-ai-explainer): restore factory constructor argument order (R5, E1.1)`
  - Archivo: `$AI/nutrition-explainer.factory.ts`, restaurado con
    `git checkout c09ee51c -- <ruta>`.
  - Gate verde: `Tests: 18 passed, 18 total`. E1-A25 da 0.
  - Mutación que lo pone rojo: la F1 del veredicto (el intercambio de
    argumentos). Sonda pendiente: S-E1.1a.
- [ ] **E1-c3** `test(nutrition-ai-explainer): expect trimmed key and model from factory (R5, E1.1, D-E1-a)`
  - Archivo: solo `$AI/nutrition-explainer.factory.spec.ts`, con el `it`
    nuevo `'pasa clave y modelo recortados (E1.1)'` al final del describe R5
    (punto 3 de E1.1).
  - No versiona ninguna mutación. El rojo es la producción de `c09ee51c`, que
    aún pasa los valores sin recortar.
  - Gate rojo: `Tests: 1 failed, 18 passed, 19 total`. El rojo es
    `pasa clave y modelo recortados (E1.1)`, por `toEqual` (llegan los valores
    con espacios).
- [ ] **E1-c4** `feat(nutrition-ai-explainer): pass trimmed key and model to Anthropic explainer (R5, E1.1, D-E1-a)`
  - Archivo: `$AI/nutrition-explainer.factory.ts`. La línea
    `return new AnthropicNutritionExplainer(model, key, null);` pasa a ser
    `return new AnthropicNutritionExplainer(model.trim(), key.trim(), null);`.
    No cambia nada más.
  - Gate verde: `Tests: 19 passed, 19 total`. E1-A9 = 0, E1-A29 = 1 y
    E1-A25 = 2.
  - Sondas pendientes: S-E1.1b (rama de la clave) y S-E1.1c (rama del
    modelo).

### E1.2 — R3.1 y R5: orden entre pares

- [ ] **E1-c5** `test(nutrition-ai-explainer): lock pairwise order of explainer guards (R3, R5, E1.2)`
  - Archivos:
    - `$AI/nutrition-explainer.factory.spec.ts`: el
      `it.each(...)('%s y %s fallan: gana %s')` de 6 filas.
    - `$AI/nutrition-explainer.factory.ts`: la mutación versionada. El
      bloque `not-enabled` se mueve detrás del bloque `model-missing`.
  - Gate rojo: `Tests: 2 failed, 23 passed, 25 total`. Los rojos son
    `ANTHROPIC_ENABLED y ANTHROPIC_API_KEY fallan: gana not-enabled` y
    `ANTHROPIC_ENABLED y ANTHROPIC_MODEL fallan: gana not-enabled`, por `toBe`.
- [ ] **E1-c6** `fix(nutrition-ai-explainer): restore explainer guard order (R3, R5, E1.2)`
  - Archivo: `$AI/nutrition-explainer.factory.ts`, restaurado con
    `git checkout <hash de E1-c4> -- <ruta>`.
  - Gate verde: `Tests: 25 passed, 25 total`. Además,
    `git diff <hash de E1-c4> HEAD -- $AI/nutrition-explainer.factory.ts | wc -l`
    da 0, E1-A25 = 2 y E1-A29 = 1.
  - Mutación que lo pone rojo: «ANTHROPIC_ENABLED al final», de la F2 del
    veredicto. Sondas pendientes: S-E1.2a, S-E1.2b y S-E1.2c, que son las
    otras tres mutaciones de F2.

### E1.3 — R11: carga perezosa del SDK

- [ ] **E1-c7** `refactor(nutrition-ai-explainer): inject SDK loader into Anthropic explainer (R11, E1.3)`
  - Archivo: `$AI/anthropic-nutrition-explainer.ts`, con el cambio de E1.3:
    - `AnthropicClientOptions` y `AnthropicSdkLoader`;
    - el cuarto parámetro `loadSdk` con su default;
    - `await this.loadSdk()` dentro del `try`.
  - Commit sin cambio de conducta. Va **antes** que su test para que el test
    nuevo compile: queda declarado aquí, por escrito, antes del handoff.
  - Gates verdes:
    - `anthropic-nutrition-explainer.spec.ts`: `Tests: 25 passed, 25 total`.
    - `nutrition-explainer.factory.spec.ts`: `Tests: 25 passed, 25 total`.
    - `nutrition-scope.spec.ts`: verde.
    - `tsc` sin errores nuevos.
    - Anclas: E1-A1 = 1, E1-A2 = 0, E1-A3 = 1, E1-A4 = 1, E1-A5 = 1 y
      E1-A6 = 1.
- [ ] **E1-c8** `test(nutrition-ai-explainer): lock lazy SDK load inside degradation (R11, E1.3)`
  - Archivos:
    - `$AI/anthropic-nutrition-explainer.spec.ts`: el describe
      `R11 (nutrition-ai-explainer #18) E1.3: …` y sus 3 `it`. Cada `it`
      declara su `const loadSdk: AnthropicSdkLoader` y construye el
      adaptador con `null, loadSdk` (nota 2 del veredicto).
    - `$AI/anthropic-nutrition-explainer.ts`: la mutación versionada. El
      bloque `if (this.client === null) { … }` se mueve entero encima del
      `try`.
  - Gate rojo sobre `src/modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.spec.ts`:
    `Tests: 2 failed, 26 passed, 28 total`. Los rojos son
    `fallo del import del SDK: null y un warn sin relanzar` y
    `el constructor del SDK lanza: null y un warn sin relanzar`, por
    `resolves.toBeNull()`.
  - El tercer `it`,
    `anti-vacio: el SDK cargado construye el cliente con clave y constantes`,
    nace verde. Lo acredita S-E1.3c.
- [ ] **E1-c9** `fix(nutrition-ai-explainer): load SDK inside the degradation try (R11, E1.3)`
  - Archivo: `$AI/anthropic-nutrition-explainer.ts`, restaurado con
    `git checkout <hash de E1-c7> -- <ruta>`.
  - Gate verde: `Tests: 28 passed, 28 total`. Además,
    `git diff <hash de E1-c7> HEAD -- $AI/anthropic-nutrition-explainer.ts | wc -l`
    da 0, y E1-A34 = E1-A35 = E1-A36 = 3.
  - Mutación que lo pone rojo: la F3 del veredicto. Sondas pendientes:
    S-E1.3a, S-E1.3b y S-E1.3c.

### E1.4 — R10: `content` que no es un array

- [ ] **E1-c10** `test(nutrition-ai-explainer): lock non-array content as unusable (R10, E1.4)`
  - Archivos:
    - `$AI/anthropic-nutrition-explainer.spec.ts`: las 5 filas de E1.4 al
      final de `unusable`, en el orden de su tabla.
    - `$AI/anthropic-nutrition-explainer.ts`: la mutación versionada
      `Array.isArray(response.content)` → `response.content != null`.
  - Gate rojo: `Tests: 4 failed, 29 passed, 33 total`. Los rojos son
    `degrada content string …`, `degrada content objeto …`,
    `degrada content numero …` y `degrada content array-like …`, por
    `toEqual` del `warn`.
  - La fila `content undefined` nace verde. La acredita S-E1.4a.
- [ ] **E1-c11** `fix(nutrition-ai-explainer): restore array check on response content (R10, E1.4)`
  - Restaurado desde el hash de E1-c7.
  - Gate verde: `Tests: 33 passed, 33 total`, y el diff contra E1-c7 da 0.
  - Mutación que lo pone rojo: la F4 del veredicto. Sondas pendientes:
    S-E1.4a, S-E1.4b, S-E1.4c y S-E1.4d.

### E1.5 — R10: bloques ajenos con campo `text`

- [ ] **E1-c12** `test(nutrition-ai-explainer): lock text-only block filter (R10, E1.5)`
  - Archivos:
    - `$AI/anthropic-nutrition-explainer.spec.ts`: la fila
      `'bloque no-text con text'` en el anti-vacío y la fila
      `'solo bloque no-text con text'` (con `type: 'texto-futuro'`) al final
      de `unusable`.
    - `$AI/anthropic-nutrition-explainer.ts`: la mutación versionada. Se
      borra `.filter((block) => block.type === 'text')`.
  - Gate rojo: `Tests: 2 failed, 33 passed, 35 total`. Los rojos son:
    - `anti-vacio: bloque no-text con text …`, por `toBe`;
    - `degrada solo bloque no-text con text …`, por `resolves.toBeNull()`.
- [ ] **E1-c13** `fix(nutrition-ai-explainer): restore text block filter (R10, E1.5)`
  - Restaurado desde el hash de E1-c7.
  - Gate verde: `Tests: 35 passed, 35 total`, y el diff contra E1-c7 da 0.
  - Mutación que lo pone rojo: la F5 del veredicto. Sondas pendientes:
    S-E1.5a, S-E1.5b y S-E1.5c.

### E1.7 — R10: `stopReason` nulo sin `stop_reason`

- [ ] **E1-c14** `test(nutrition-ai-explainer): lock null stopReason when stop_reason is missing (R10, E1.7)`
  - Archivos:
    - `$AI/anthropic-nutrition-explainer.spec.ts`: la fila
      `'sin stop_reason'` al final de `unusable`.
    - `$AI/anthropic-nutrition-explainer.ts`: la mutación versionada
      `stopReason: response.stop_reason ?? null,` →
      `stopReason: response.stop_reason,`.
  - Gate rojo: `Tests: 1 failed, 35 passed, 36 total`. El rojo es
    `degrada sin stop_reason con exactamente un warn completo`, por `toEqual`
    del `warn`.
- [ ] **E1-c15** `fix(nutrition-ai-explainer): restore null default for stopReason (R10, E1.7)`
  - Restaurado desde el hash de E1-c7.
  - Gate verde: `Tests: 36 passed, 36 total`, y el diff contra E1-c7 da 0.
  - Mutación que lo pone rojo: la de E1-c14 (N3 del veredicto).

### E1.8 — R11: valor rechazado que no es `Error` con `message`

- [ ] **E1-c16** `test(nutrition-ai-explainer): lock String() message for non-Error rejections (R11, E1.8)`
  - Archivos:
    - `$AI/anthropic-nutrition-explainer.spec.ts`: la fila
      `['objeto', '[object Object]']` al final del `it.each` de R11, y la
      rama `status === 'objeto'` del cuerpo, que rechaza
      `{ message: 'no soy Error' }`.
    - `$AI/anthropic-nutrition-explainer.ts`: la mutación versionada
      `message: error instanceof Error ? error.message : String(error),` →
      `message: (error as { message?: string } | null)?.message ?? String(error),`.
  - Gate rojo: `Tests: 1 failed, 36 passed, 37 total`. El rojo es
    `degrada objeto: [object Object]`, por `toEqual` del `warn` (llega
    `'no soy Error'`).
- [ ] **E1-c17** `fix(nutrition-ai-explainer): restore instanceof Error check in failure warn (R11, E1.8)`
  - Restaurado desde el hash de E1-c7.
  - Gate verde: `Tests: 37 passed, 37 total`, y el diff contra E1-c7 da 0.
  - Mutación que lo pone rojo: la de E1-c16 (N2 del veredicto).

### Sondas (sin commit, con el árbol en E1-c17)

Los recuentos son sobre los archivos completos: factory 25 tests, adaptador 37.
S-E1.3c se corre con `ANTHROPIC_BASE_URL=http://127.0.0.1:9` delante del
comando, como red de seguridad.

**Sondas del factory** (`nutrition-explainer.factory.ts`):

| Sonda | Mutación | `Tests:` esperado | `it` rojos |
|---|---|---|---|
| S-E1.1a | `return new AnthropicNutritionExplainer(model.trim() + 'x', key.trim(), null);` | `3 failed, 22 passed, 25 total` | los dos anti-vacíos y `pasa clave y modelo recortados (E1.1)` |
| S-E1.1b | `return new AnthropicNutritionExplainer(model.trim(), key, null);` | `1 failed, 24 passed, 25 total` | `pasa clave y modelo recortados (E1.1)` |
| S-E1.1c | `return new AnthropicNutritionExplainer(model, key.trim(), null);` | `1 failed, 24 passed, 25 total` | `pasa clave y modelo recortados (E1.1)` |
| S-E1.2a | bloque `node-env-test` detrás del bloque `not-enabled` | `1 failed, 24 passed, 25 total` | `NODE_ENV y ANTHROPIC_ENABLED fallan: gana node-env-test` |
| S-E1.2b | bloque `key-missing` delante del bloque `not-enabled` | `1 failed, 24 passed, 25 total` | `ANTHROPIC_ENABLED y ANTHROPIC_API_KEY fallan: gana not-enabled` |
| S-E1.2c | bloque `model-missing` delante del bloque `key-missing` | `1 failed, 24 passed, 25 total` | `ANTHROPIC_API_KEY y ANTHROPIC_MODEL fallan: gana key-missing` |

**Sondas del adaptador** (`anthropic-nutrition-explainer.ts`):

| Sonda | Mutación | `Tests:` esperado | `it` rojos |
|---|---|---|---|
| S-E1.3a | el fallo de `this.loadSdk()` se captura en el sitio y `explain()` devuelve `null` sin `warn` | `1 failed, 36 passed, 37 total` | `fallo del import del SDK: …` |
| S-E1.3b | `new Anthropic(…)` dentro de su propio `try` que devuelve `null` sin `warn` | `1 failed, 36 passed, 37 total` | `el constructor del SDK lanza: …` |
| S-E1.3c | en `explain()`, `await this.loadSdk()` → `await import('@anthropic-ai/sdk')`; el default no se toca | `4 failed, 33 passed, 37 total` | los 3 de E1.3 y `construye el cliente perezoso con clave explicita y constantes` (R9) |
| S-E1.4a | `Array.isArray(response.content)` → `response.content !== null` | `5 failed, 32 passed, 37 total` | las 5 filas de E1.4 |
| S-E1.4b | → `typeof response.content === 'object' && response.content !== null` | `2 failed, 35 passed, 37 total` | `degrada content objeto …` y `degrada content array-like …` |
| S-E1.4c | toda la expresión de `blocks` → `Array.from((response.content ?? []) as ArrayLike<{ type: string; text?: string }>)` | `1 failed, 36 passed, 37 total` | `degrada content array-like …` |
| S-E1.4d | toda la expresión de `blocks` → `Object.values((response.content ?? {}) as Record<string, { type: string; text?: string }>)` | `1 failed, 36 passed, 37 total` | `degrada content array-like …` |
| S-E1.5a | filtro → `block.type !== 'thinking'` | `1 failed, 36 passed, 37 total` | `degrada solo bloque no-text con text …` |
| S-E1.5b | filtro → `block.type.startsWith('text')` | `1 failed, 36 passed, 37 total` | `degrada solo bloque no-text con text …` |
| S-E1.5c | filtro → `block.type.includes('text')` | `1 failed, 36 passed, 37 total` | `degrada solo bloque no-text con text …` |

Si una sonda no da exactamente lo indicado, no se ajusta la tabla: se para y se
anota en `progress/impl_nutrition-ai-explainer.md` §Bloqueos.

### Cierre de la ronda

- [ ] **E1-c18** `docs(nutrition-ai-explainer): #18 traceability and probes for amendment E1`
  - Archivos:
    - `specs/nutrition-ai-explainer/traceability.md`: las filas E1.1–E1.5,
      E1.7 y E1.8, cada una con sus hashes y la sonda citada.
    - `progress/impl_nutrition-ai-explainer.md`: §Sondas E1, la base de
      `tsc` y las anclas E1-A1…E1-A37 medidas en el HEAD final.
  - Las anclas deben coincidir con la columna «tras E1» de [[requirements]]
    §Enmienda E1 §Cifras y alcance.
  - El diff de la ronda contra el commit de handoff, sin contar
    `progress/review_nutrition-ai-explainer.md`, toca solo los 6 archivos de
    la lista cerrada.

**Checklist del reviewer para E1** (además de C2–C7):

- [ ] Cada gate rojo de E1-c1…E1-c16 se reproduce con `git checkout` del
  commit, y su rojo es de aserción.
- [ ] **Nota 2: cargador de test siempre presente.** E1-A34 = E1-A35 =
  E1-A36 = 3 y E1-A37 = 1 en el HEAD final.
  - Ninguna construcción del adaptador con cliente `null` en un spec omite el
    cuarto argumento ni pasa `undefined`.
  - El cargador real por defecto no se ejecuta en ningún test.
- [ ] El diff neto del factory contra `c09ee51c` es exactamente la línea de
  D-E1-a (E1-A25 = 2, E1-A29 = 1).

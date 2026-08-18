# review: nutrition-ai-explainer (#18)

Fecha: 2026-08-18
Rango revisado: `d4e4e73..HEAD` (58 commits) en `feature/18-nutrition-ai-explainer`
Veredicto: **RECHAZADO**

> Rechazo por **cuatro** defectos concretos (B1..B4). Ninguno es de estilo y
> ninguno se arregla con una nota: falta la evidencia end-to-end que la propia
> spec declara como su aserción anti-vacío global (B1), falta una constante que
> C-2/C-6 exigen y cuyo test asevera justo lo contrario (B2), falta el campo
> `message` en los tres `warn` (B3) y falta uno de los cuatro pasos obligatorios
> de la prueba de humo de R19 (B4).
>
> El trabajo **no está lejos**: la lógica de producto es correcta, las dos
> enmiendas se respetaron al pie de la letra, la derogación de R26 de #17 es
> impecable aserción por aserción, y ningún test puede llegar a la red. Lo que
> falla es la capa de evidencia, que en esta feature es justamente lo que la
> spec blindó por escrito.

---

## Verificación independiente

- `docker port pet-tracker-postgres` → `5432/tcp -> 0.0.0.0:5432` y `[::]:5432`.
  Postgres publica puerto: los e2e **no** se saltaron en silencio.
- `./init.sh` ejecutado por el `reviewer`, con salida redirigida a archivo y
  `$?` leído de ahí (no por tubería). **`INIT_EXIT=0`**.
  - e2e: `Test Suites: 2 skipped, 20 passed, 20 of 22 total` / `Tests: 6 skipped, 323 passed, 329 total`.
  - Lint (backend + infra) y typecheck verdes.
  - Apareció el log FK `23503` de `pet_users` ya conocido, sin fallar suite.
  - **No** se reprodujo el flake de R12 de `health-vaccines.e2e-spec.ts` en esta corrida.
- Tras la corrida, `git status --short` vacío: `init.sh` corre `eslint --fix`
  pero ya no deja nada sin commitear (lo arregló `1dbe4e8`).

---

## Checklist C2 — Estado coherente

- [x] Solo 1 feature `in_progress` en `feature_list.json` (#18)
- [x] `progress/current.md` actualizado y con bitácora completa de la sesión
- [x] #18 sigue en `in_progress` — Codex **no** cerró la feature

## Checklist C3 — Arquitectura

- [x] `domain/` sin imports de `infrastructure/` ni de `application/` (grep vacío)
- [x] `domain/ports/nutrition-explainer.ts` es interfaz pura + `Symbol`, solo
      depende de `domain/nutrition-engine`
- [x] `domain/repositories/nutrition.repository.ts` sigue siendo interfaz pura
      con el método nuevo `setAiExplanation`
- [x] `application/` depende del token `NUTRITION_EXPLAINER` y del tipo
      `NutritionExplainer`, nunca de los adaptadores (grep de `infrastructure`
      en `application/` vacío)
- [x] `infrastructure/` sin lógica de negocio: el gate de entitlement vive en el
      use-case, como exige R14

## Checklist C4 — TDD

- [x] Cada R1..R18 tiene al menos un test que lo nombra con el sufijo
      `(nutrition-ai-explainer #18)`
- [x] El commit de la derogación (`7cadd2c`) es propio y deja la suite roja a
      propósito, como R1 autorizaba por escrito
- [ ] **El historial rojo→verde es fiel** — ver O1: los hashes "verde" de
      R9..R16 no podían estar verdes
- [!] R2 y R4 no tienen test que los nombre; la spec aprobada se los asigna
      explícitamente al `describe` de R1. Excepción sancionada por la spec, no
      defecto de la implementación.

## Checklist C5 — Trazabilidad

- [x] Las 18 filas R1..R18 traen **dos** hashes; los 29 hashes citados resuelven
      a commits reales (`git cat-file -t` → `commit` en los 29)
- [x] Commits siguen `feat|test|docs|fix(nutrition-ai-explainer): <desc> (R-ids)`
- [!] La fila R19 dice "pendiente"; es el gate humano que la propia
      trazabilidad declara como no cerrable por Codex ni por el `reviewer`. **No**
      cuenta como fila pendiente en el sentido de C5.

## Checklist C6 — Spec aprobada

- [x] `requirements.md` con `status: approved` y `- [X] Aprobado por humano (fecha: 2026-08-18)`
- [x] Las dos enmiendas posteriores están fechadas dentro de la spec y son las
      únicas modificaciones de `requirements.md` en el rango (`8dcc371`, `d7a965c`)
- [x] `- [ ] Prueba de humo con clave real ejecutada por humano` sigue **sin marcar**

## Checklist C7 — Sin código huérfano

- [x] El bloque R26 de #17 fue derogado, no duplicado: `nutrition-scope.spec.ts`
      reconvertido, mitad del bloque e2e renombrada y mitad borrada
- [x] El literal `'must not leak while feature 17 is active'` no aparece en
      ningún archivo del backend
- [x] No quedan tests ni helpers huérfanos de la conducta reemplazada

---

## Auditoría de los ocho puntos

### 1. Las dos enmiendas posteriores a la aprobación — **CUMPLIDAS**

**(a) `ctx` solo para trazas.** `buildUserPrompt(input, result)` sigue siendo de
**dos** parámetros (`infrastructure/ai/nutrition-prompt.ts`) y no recibe `ctx`.
El puerto declara el tercer parámetro y los tres adaptadores lo usan solo dentro
de `logger.warn`. La aserción anti-fuga de R7 (`expect(prompt).not.toMatch(/[0-9a-f]{8}-[0-9a-f-]{27}/i)`)
está viva. Separación verificable, no prometida.

**(b) `env-drift.test.mjs`.** El diff del rango sobre ese archivo es **una sola
línea**:

```
-    assert.equal(keys.length, 21);
+    assert.equal(keys.length, 24);
```

La segunda aserción del mismo `it`
(`keys.some(key => key.startsWith('DRIFT') || key.startsWith('ENV_DRIFT')) === false`)
sigue intacta en la línea siguiente. `git diff d4e4e73..HEAD -- env-drift.mjs`
está **vacío**: el script no se tocó.

### 2. Derogación de R26 de #17 — **CUMPLIDA, aserción por aserción**

`src/modules/nutrition/nutrition-scope.spec.ts`, contrastado contra la tabla:

| # | Acción exigida | Resultado real |
|---|---|---|
| 1 | borrar `not.toMatch(/"openai"\s*:/i)` | borrada, y con ella la lectura de `package.json` |
| 2 | invertir a las tres `toMatch` de `.env.example` | las tres, literales exactos |
| 3 | invertir a las tres `toContain` con backticks | las tres |
| 4 | invertir y estrechar (R5) | `expect(openAiConfigFiles).toEqual(['modules/nutrition/infrastructure/ai/nutrition-explainer.factory.ts'])` |
| 5 | conservar `not.toContain('gpt-')` **intacta** | intacta, última línea del `it` |

`describe` renombrado exactamente a
`R1 (nutrition-ai-explainer #18): la IA esta cableada y sin literales de modelo`;
helper `sourceFiles()` conservado; archivo no borrado. Además se añadió la guarda
de R4 `expect(envExample).not.toMatch(/^OPENAI_API_KEY=sk-/m)`.

**Verificado por mí, no por el reporte:** `grep -rn 'gpt-' backend-pet-tracker/src/`
devuelve **una sola** línea, y es la propia aserción dentro de
`nutrition-scope.spec.ts:36` — que el helper excluye por terminar en `.spec.ts`.
Cero literales en código de producción: **R2 sigue siendo cierto**.

`test/nutrition.e2e-spec.ts`: la primera mitad sobrevive renombrada a
`R5 (nutrition-ai-explainer #18): IA apagada persiste aiExplanation null`
(líneas 580-603) y la segunda mitad (UPDATE manual + GET esperando `null`) está
borrada. El literal `'must not leak while feature 17 is active'` no aparece en
ningún archivo del backend. Los bloques R19, R21 y R25 de #17 siguen sin tocar.

### 3. Ningún test llega a la red — **CUMPLIDO, garantía triple verificada**

1. **Guarda de entorno.** `createNutritionExplainer` evalúa
   `config.get<string>('NODE_ENV') === 'test'` como **primera** rama, antes de
   leer `OPENAI_ENABLED`, la clave o el modelo. Devuelve `NullNutritionExplainer`.
2. **Doble por el puerto.** Unitarios: `new OpenAiNutritionExplainer(model, key, double)`.
   E2e: `.overrideProvider(NUTRITION_EXPLAINER).useValue({ explain })`.
3. **Entorno explícito.** `process.env.OPENAI_ENABLED = 'false'` es la **primera
   sentencia** de `test/nutrition.e2e-spec.ts`, antes de los imports y mucho
   antes de crear el testing module.

Cero imports estáticos de `openai` en todo el backend (`from 'openai'` no aparece
en ningún `.ts`). La carga es perezosa: `const { default: OpenAI } = await import('openai')`
dentro de `getClient()`, y solo si el cliente inyectado es `null`.
`nutrition-explainer.factory.spec.ts` añade la aserción de texto que recorre
`src/` y `test/` filtrando por `.endsWith('.spec.ts')` — que **sí** captura los
`*.e2e-spec.ts` — y exige cero ocurrencias de `from 'openai'`.

**No encontré ningún camino por el que una suite pueda facturar**, ni siquiera
con `OPENAI_ENABLED=true` y una clave real en el `.env` del desarrollador.

### 4. R18, la aserción anti-vacío global — **INCUMPLIDO (B1)**

Ver B1 abajo. Es el motivo principal del rechazo.

### 5. El mapper — **CUMPLIDO en código, débil en test**

`toNutritionPlanResponse` devuelve `aiExplanation: plan.aiExplanation`
(`infrastructure/mappers/nutrition.mapper.ts`). El shape conserva las **once**
claves de R19 de #17 (`id`, `petId`, `rerKcal`, `merKcal`, `dailyGrams`,
`mealsPerDay`, `mealTimes`, `objective`, `warnings`, `aiExplanation`,
`generatedAt`) y sigue **sin** `inputsHash`. Correcto.

Pero su único test propio (`nutrition.mapper.spec.ts`) es una aserción de **texto
fuente** (`expect(source).toContain('aiExplanation: plan.aiExplanation')`), no de
conducta, y la mitad anti-vacío que R17 pedía —`GET` con `NULL` devolviendo
`null` y las once claves exactas— no existe. Se traga dentro de B1.

### 6. Los tres commits de arreglo — **NINGUNO AFLOJÓ NADA**

- **`221c172` (lint).** Convierte `async () => x` en `() => Promise.resolve(x)`
  en los dobles y en `NullNutritionExplainer.explain`. Semánticamente idéntico.
  De hecho **refuerza** una cosa: cambia `explainer as never` por `explainer` en
  el constructor del use-case, así que el doble pasa a estar type-checked contra
  el puerto. Ninguna aserción tocada, ningún caso borrado.
- **`29e53c3` (fixtures).** Arregla fixtures que no compilaban:
  `activityLevel: 'moderate'` → `'medium'`, `hasChronicDisease` → `kcalPer100g`,
  `gramsPerMeal`/`schedule` → `mealTimes`, y `execute('pet-1', now)` →
  `execute('pet-1')`. **Borra una aserción**: `expect(latestPlan?.aiExplanation).toBe('Generated explanation')`
  en el e2e. La pérdida de cobertura es pequeña —lo que quedaba
  (`setAiExplanation` llamado una vez + `response.aiExplanation`) la solapa— pero
  es una aserción borrada en un commit rotulado "align test fixtures". Anotado,
  no bloqueante. Lo importante de este commit es lo que revela: ver O1.
- **`1dbe4e8` (tuyo).** **Confirmado tal cual lo describes**: reflow de Prettier
  en cuatro archivos (la firma de `setAiExplanation` a una línea, la tabla de
  casos de `factory.spec.ts`, dos líneas en blanco sobrantes, un `.map()` de
  `nutrition-scope.spec.ts`) **más** la eliminación del cast redundante
  `as Promise<OpenAiChatResponse>` en `openai-nutrition-explainer.ts`. Sin cambio
  de conducta. La tabla de R5 conserva sus diez filas negativas y la positiva.

### 7. Los caminos a `null` avisan — **PARCIAL (B3)**

- Los cuatro casos (contenido `null`, `''`, `'   '`, `finish_reason: 'length'`)
  devuelven `null` y emiten `warn` con `finishReason` y `usage` en el objeto.
  Verificado en código y en el `it.each` de R10.
- En el caso de éxito **no** se emite ningún `warn` (dos tests lo aseveran).
- **Redacción correcta**: el objeto logueado no lleva la clave de API, ni el user
  prompt, ni alergias ni enfermedades. El test lo comprueba serializando
  `warn.mock.calls` y buscando `SECRET_API_KEY` / `SECRET_ALLERGY` / `SECRET_DISEASE`.
- **Pero falta `message` en los tres sitios** → B3.

### 8. R19 sigue abierto — **CORRECTO, salvo la documentación (B4)**

- Codex **no** ejecutó la prueba de humo (lo declara y nada en el rango la
  contradice).
- **Sin clave real en ningún archivo versionado.** `git log -p d4e4e73..HEAD`
  filtrado por `^\+.*sk-[A-Za-z0-9_-]{8,}` devuelve **una** línea:
  `OPENAI_API_KEY: 'sk-real-looking-key'`, el fixture que la propia R3 prescribe
  literalmente. Las únicas asignaciones de `OPENAI_API_KEY` añadidas son
  `PENDING` y las dos aserciones que lo vigilan.
- `.env.example` lleva el bloque de C-4 exacto, con `OPENAI_API_KEY=PENDING`.
- La casilla de la prueba de humo sigue **sin marcar**. **Yo tampoco la he
  marcado ni he ejecutado la prueba**: cuesta dinero y es del humano.
- Existe `### Feature 18 — nutrition-ai-explainer` en `docs/verification.md:291`
  — pero con tres de los cuatro pasos → B4.
- `docs/conventions.md` gana las tres filas en el formato pedido.

---

## Defectos bloqueantes

### B1 — La evidencia end-to-end de R13, R16, R17 y R18 no existe

Los cuatro requisitos comparten **un solo test**, un `describe.each` sobre cuatro
cadenas de R-id en `test/nutrition.e2e-spec.ts:633-715`. Ese test:

- sustituye `NUTRITION_REPOSITORY` por un mock de jest ⇒ **la tabla
  `nutrition_plans` no se escribe ni se lee nunca**;
- **no hace ninguna petición HTTP**: llama
  `moduleRef.get(GenerateNutritionPlanUseCase).execute('pet-1')` y después
  `toNutritionPlanResponse(plan)` a mano;
- por tanto no hay respuesta del `generate`, no hay fila en la BD y no hay `GET`.

Evidencia dura: en ese archivo el último `await db` está en la **línea 600** y la
última llamada `api()` en la **616**; el bloque de #18 empieza en la **633**. Del
633 al final no hay ni un acceso a base de datos ni una petición HTTP.

Lo que cada requisito pedía y no está:

- **R18** — *"se asevera el texto en la respuesta del `generate`, en la fila de
  `nutrition_plans` y en el `GET`"*. Las tres observaciones ausentes. Y R18 se
  autodefine: *"Este requisito es la **aserción anti-vacío global** de la
  feature... Sin R18 en verde, la feature no está implementada."*
- **R13** — `SELECT count(*) FROM nutrition_plans WHERE pet_id = ...` sigue en 1,
  la fila trae el texto en `ai_explanation`, y `generated_at` idéntico al del
  `generate`. Nada de esto se ejecuta contra Postgres.
- **R16** — dos `generate` consecutivos, `count(*)` sigue en 1. El `count(*)` no
  existe (el repositorio es un mock).
- **R17** — sembrar `ai_explanation = 'texto sembrado'` en la BD y leerlo por el
  `GET`, más la mitad anti-vacío (plan con `NULL` ⇒ `GET` devuelve `null` y las
  once claves exactas). Nada de esto existe.

**Consecuencia concreta y comprobable:**
`NutritionDrizzleRepository.setAiExplanation` **no se ejecuta nunca contra una
base de datos real en ninguna suite**. Su único test
(`nutrition.drizzle.repository.spec.ts`) mockea la cadena entera del query
builder (`update`/`set`/`where`/`returning`) y **no asevera el argumento de
`where`**: cambiar `eq(nutritionPlans.id, planId)` por
`eq(nutritionPlans.petId, planId)` dejaría toda la suite verde. Lo mismo para el
camino de lectura HTTP con `aiExplanation` no nulo: nunca se recorre.

(Intenté confirmarlo por mutación revirtiendo con `git checkout --`, como
autorizaba el encargo; el sistema de permisos bloqueó la escritura y **no lo
rodeé**. La evidencia estática de arriba es concluyente por sí sola: el árbol
quedó limpio, `git status --short` vacío.)

**Además, el `describe.each` es inflado de R-ids**: hace que el grep de C4
encuentre R13, R16, R17 y R18 cuando en realidad hay un único cuerpo de test. Un
fallo en él no distingue qué requisito se rompió, y su nombre interno
(`'returns and persists a non-empty explanation through the module flow'`) no
nombra ningún R-id.

### B2 — `NUTRITION_AI_MAX_RETRIES` no existe y el test asevera lo contrario de lo pedido

C-2 y C-6 exigen la constante exportada `NUTRITION_AI_MAX_RETRIES = 0` en
`infrastructure/ai/openai-nutrition-explainer.ts`. R9 exige, textualmente, una
aserción de texto fuente de que el archivo contiene
`maxRetries: NUTRITION_AI_MAX_RETRIES` *"(los números no se escriben a mano en el
sitio de la llamada)"*, y aseverar *"los tres valores exactos de las constantes
exportadas (`15_000`, `0`, `1_200`)"*.

Real:
- `openai-nutrition-explainer.ts:91` → `maxRetries: 0`, número escrito a mano.
- `NUTRITION_AI_MAX_RETRIES` **no aparece en ningún archivo del repositorio**.
- `openai-nutrition-explainer.spec.ts:68` → `expect(source).toContain('maxRetries: 0')`,
  exactamente la aserción inversa a la que la spec pide.
- Solo dos de los tres valores se aseveran (`NUTRITION_AI_TIMEOUT_MS`,
  `NUTRITION_AI_MAX_OUTPUT_TOKENS`); el `0` no puede aseverarse porque no hay
  constante.

No es cosmético: C-2 dedica un párrafo entero a por qué `maxRetries: 0` es
load-bearing (sin él, 3 × 15 s cruza el corte de 29 s de API Gateway y convierte
la degradación limpia en un `504`, rompiendo *"jamás 5xx por la IA"*). El test
que debía protegerlo protege la cadena literal, no la constante.

**Desviación asociada:** `NUTRITION_AI_TIMEOUT_MS` y
`NUTRITION_AI_MAX_OUTPUT_TOKENS` viven en `nutrition-prompt.ts`, no en
`openai-nutrition-explainer.ts` como los colocan C-2 y C-6.

### B3 — Falta el campo `message` en los tres `warn`

R11 exige el objeto `{ scope, petId, planId, message }` con `message` = el
mensaje del error. R10 exige *"además de los campos de R11, `finishReason` y el
`usage`"*, y lo escribe explícito: `{ scope, petId, planId, message, finishReason, usage }`.
La rama apagada exige `message: 'ai explanation disabled'`.

Real:

| Sitio | Objeto logueado | Falta |
|---|---|---|
| `openai-nutrition-explainer.ts` camino R10 | `{scope, petId, planId, finishReason, usage}` | `message` |
| `openai-nutrition-explainer.ts` camino R11 (`catch`) | `{scope, petId, planId, finishReason: null, usage: null, errorName}` | `message` sustituido por `errorName`; el mensaje del error **nunca** se loguea |
| `null-nutrition-explainer.ts` | `{scope, petId, planId, reason: 'disabled'}` | `message: 'ai explanation disabled'` sustituido por `reason: 'disabled'` |

Ningún test lo detecta porque los tres usan `expect.objectContaining` sin
mencionar `message`.

Esto muerde justo donde la enmienda de R10 quería morder: el diagnóstico de la
prueba de humo de R19. Con un `401` por clave mal puesta, el humano verá
`errorName: 'AuthenticationError'` pero no el mensaje del proveedor; y en el
camino de R10 no verá **ningún** texto, solo `finishReason` y `usage`. La
sustitución no está documentada ni en la spec ni en `progress/impl_*.md`: es
deriva silenciosa sobre un campo normativo.

### B4 — `docs/verification.md` se deja uno de los cuatro pasos de R19

R19 dice *"SHALL incluir estos cuatro pasos"* y los transcribe. La sección
`docs/verification.md:291-298` tiene cuatro puntos, pero **no son esos cuatro**:
funde los pasos 1-2 de la spec y **omite por completo el paso 3**:

```
3. Devolver OPENAI_API_KEY=PENDING y repetir -> 200, aiExplanation null y un
   warning en el log del servidor.
```

Es precisamente el paso que prueba la degradación y el `warn` con el cableado
real — el único que habría hecho visible B3. Además, el cierre de R19 exige
*"`OPENAI_API_KEY` SHALL volver a `PENDING` en el `.env` local para que las
corridas siguientes de `init.sh` no facturen"*, y el paso 4 escrito dice volver a
`OPENAI_ENABLED=false`, que deja la clave real puesta en el `.env`.

---

## Observaciones no bloqueantes

- **O1 — El historial rojo→verde es estructuralmente correcto pero los hashes
  "verde" de R9..R16 no estaban verdes.** Cada R tiene su commit de test antes
  del de implementación, y `7cadd2c` es propio como R1 exigía. Pero en
  `77e719d` (marcado verde para R12, R14, R15, R16),
  `generate-nutrition-plan.use-case.spec.ts` llama `execute('pet-1', now)` contra
  `async execute(petId: string)` — un argumento de más—, y
  `openai-nutrition-explainer.spec.ts` usaba `gramsPerMeal`, `schedule`,
  `hasChronicDisease` y `activityLevel: 'moderate'`, campos inexistentes en los
  tipos de dominio. Ninguna de las dos configuraciones de jest
  (`package.json` y `test/jest-e2e.json`) desactiva los diagnósticos de
  `ts-jest`, así que esas suites no compilaban. La suite solo pasó a verde en
  `29e53c3`. Los hashes de la trazabilidad documentan "el commit que escribió la
  implementación", no "el commit que puso el test en verde".
- **O2 — `29e53c3` borra una aserción** (`expect(latestPlan?.aiExplanation)...`).
  Solapada por las que quedan; anotado por higiene.
- **O3 — Estilo fuera de la convención del repo, sin efecto funcional:**
  `nutrition-prompt.ts` y `openai-nutrition-explainer.ts` colocan una sentencia
  `import` **al final del archivo**. Es legal y pasa el lint, pero no se parece a
  nada más del repositorio.
- **O4 — `OPENAI_API_KEY_PENDING` se exporta y no se usa.**
  `nutrition-explainer.factory.ts` la declara (C-6 la pide) y luego compara
  contra el literal `'PENDING'` dos líneas más abajo.
- **O5 — R10 devuelve el contenido recortado.** El código hace
  `content = choice?.message.content?.trim()` y devuelve `content`; R10 dice *"El
  texto devuelto SHALL entregarse tal cual, sin `trim` destructivo más allá de
  descartar el caso vacío"*. El test lo fija en su título
  (`'returns trimmed content...'`) y asevera `'  Complete explanation  '` →
  `'Complete explanation'`. Desviación menor de una frase normativa; decidir si
  se acepta o se corrige la frase.
- **O6 — R2 y R4 no tienen test que los nombre.** La spec aprobada se los asigna
  a las aserciones (5) y (2)(3) del `describe` de R1. Excepción sancionada por
  escrito; lo dejo constando para que el grep de C4 no se lea como fallo.
- **O7 — La fila R19 de `traceability.md` dice "pendiente"** y así debe seguir:
  es el gate humano que la propia tabla declara no cerrable por el `reviewer`.

---

## Correcciones concretas para el siguiente handoff

1. **Escribir de verdad los e2e de R13, R16, R17 y R18** en
   `test/nutrition.e2e-spec.ts`, usando la maquinaria que el archivo ya tiene
   (`seedUser`, `seedPet`, `putProfile`, `postWeight`, `generatePlan`, `api()`,
   `db`), **sin** sobrescribir `NUTRITION_REPOSITORY`. Solo se sobrescriben
   `NUTRITION_EXPLAINER` (con `{ explain: async () => 'texto...' }`) y
   `SUBSCRIPTION_REPOSITORY` (con `{ isPetTracked: async () => true }`), que es
   literalmente lo que R18 prescribe.
   - **R18**: un `describe('R18 (nutrition-ai-explainer #18): ...')` propio que
     asevere el texto (a) en el body del `POST .../generate`, (b) en
     `nutrition_plans.ai_explanation` leído con `db`, y (c) en el `GET
     /v1/pets/:petId/nutrition-plan` posterior.
   - **R13**: `count(*)` sigue en 1 y `generated_at` idéntico al del `generate`.
   - **R16**: dos `generate` consecutivos ⇒ mismo `id`, `count(*)` sigue en 1, el
     doble registró **una sola** llamada.
   - **R17**: sembrar `ai_explanation = 'texto sembrado'` con `db.update` y
     leerlo por el `GET`; más la mitad anti-vacío (plan con `NULL` ⇒ `GET`
     devuelve `null` y `Object.keys(body)` son exactamente las once de R19 de #17).
   - **Deshacer el `describe.each`**: un `describe` por R-id, cada uno con su
     propio cuerpo. Nada de cuatro R-ids compartiendo un test.
2. **Añadir `expect(where).toHaveBeenCalledWith(eq(nutritionPlans.id, planId))`**
   —o equivalente— a `nutrition.drizzle.repository.spec.ts`, para que el
   predicado del `UPDATE` deje de estar sin vigilar aunque los e2e lo cubran.
3. **Crear y usar `NUTRITION_AI_MAX_RETRIES = 0`**, exportada desde
   `openai-nutrition-explainer.ts`; sustituir `maxRetries: 0` por
   `maxRetries: NUTRITION_AI_MAX_RETRIES` en el sitio de la llamada; cambiar la
   aserción del test a `expect(source).toContain('maxRetries: NUTRITION_AI_MAX_RETRIES')`
   y añadir `expect(NUTRITION_AI_MAX_RETRIES).toBe(0)` para completar los tres
   valores que R9 pide. Mover `NUTRITION_AI_TIMEOUT_MS` y
   `NUTRITION_AI_MAX_OUTPUT_TOKENS` a ese mismo archivo, donde C-2 y C-6 los
   colocan (o dejar una nota razonada si se prefiere no moverlos).
4. **Añadir `message` a los tres `warn`**:
   - camino R10: `message` describiendo el caso (contenido vacío / truncado),
     junto a `finishReason` y `usage` que ya están;
   - camino R11 (`catch`): `message: error instanceof Error ? error.message : String(error)`
     — se puede conservar `errorName` además, pero `message` es el campo que la
     spec exige;
   - `NullNutritionExplainer`: `message: 'ai explanation disabled'` en lugar de
     `reason: 'disabled'`.
   Y **aseverarlo**: cambiar los `expect.objectContaining` para que incluyan
   `message`, manteniendo las tres aserciones de redacción que ya existen.
5. **Completar `docs/verification.md`** con los cuatro pasos de R19 tal como los
   transcribe la spec, recuperando el paso omitido (`OPENAI_API_KEY=PENDING` ⇒
   `200`, `aiExplanation` null y warning en el log) y cerrando con
   `OPENAI_API_KEY` de vuelta a `PENDING`, no solo `OPENAI_ENABLED=false`.
6. **Opcionales (O3, O4, O5)**: subir los `import` al principio de los dos
   archivos; usar `OPENAI_API_KEY_PENDING` en la comparación del factory; y
   decidir entre devolver el texto sin recortar o enmendar la frase de R10.

Nada de esto toca `nutrition-input-hash.ts`, `NutritionEngineInput` ni el DTO de
#17, que siguen —correctamente— con diff cero en todo el rango (OV2 respetada).

---

## Nota de cierre

Aunque estas cinco correcciones queden verdes, **la aprobación del `reviewer` no
cerrará la feature**: R19 es un gate humano. Falta que un humano ejecute la
prueba de humo con la clave real y marque
`- [ ] Prueba de humo con clave real ejecutada por humano` en
`specs/nutrition-ai-explainer/requirements.md`. Ni Codex ni yo podemos hacerlo:
cuesta dinero real. #18 se queda en `in_progress`.

---

## Output de `./init.sh`

```
Test Suites: 2 skipped, 20 passed, 20 of 22 total
Tests:       6 skipped, 323 passed, 329 total
Snapshots:   0 total
Time:        68.832 s, estimated 96 s
Ran all test suites.
✅ Tests e2e pasados

→ Lint...
> backend-pet-tracker@0.0.1 lint
> eslint "{src,apps,libs,test}/**/*.ts" --fix
> pet-tracker-infra@0.0.1 lint
> eslint "{bin,lib,test}/**/*.ts"
✅ Lint sin errores

→ Typecheck...
✅ Typecheck sin errores

══════════════════════════════════════════
✅ Todo verde. Listo para trabajar.

  Features: 29/30 completadas | 0 pendientes
```

Exit code real (leído de archivo, no por tubería): **`INIT_EXIT=0`**.
Apareció en el log el error FK `23503` de `pet_users` ya conocido, sin fallar
ninguna suite. El flake de R12 de `health-vaccines.e2e-spec.ts` no se reprodujo.

# Handoff a Codex CLI — nutrition-ai-explainer (#18), ronda 2 (correcciones)

> Generado por el `leader` el 2026-08-18, tras el veredicto **rechazado** del
> `reviewer` (`progress/review_nutrition-ai-explainer.md`).
> El humano copia el bloque de abajo en su terminal de Codex CLI.

---

```
Feature: nutrition-ai-explainer, id 18, branch: feature/18-nutrition-ai-explainer (ya estás en ella)
Ronda 2: el reviewer RECHAZÓ la entrega. Veredicto completo y evidencia:
progress/review_nutrition-ai-explainer.md

Contexto honesto antes de empezar: la lógica de producto está bien, las dos enmiendas
de la spec se respetaron al pie de la letra, la derogación de R26 de #17 es impecable
aserción por aserción, y ningún test puede llegar a la red. Lo que falla es la capa de
EVIDENCIA — justo lo que esta spec blindó por escrito. No hay que rehacer la feature:
hay que probarla de verdad.

No reescribas historia. Los arreglos van en commits nuevos, con su R-id.

## B1 — Los e2e de R13, R16, R17 y R18 no existen (el defecto grave)

Hoy los cuatro requisitos comparten UN SOLO test: un `describe.each` en
test/nutrition.e2e-spec.ts:633-715 que sustituye NUTRITION_REPOSITORY por un mock de
jest, llama al use-case a mano (`moduleRef.get(GenerateNutritionPlanUseCase).execute(...)`)
y después `toNutritionPlanResponse(plan)` directamente. Del 633 al final del archivo no
hay ni un acceso a base de datos ni una sola petición HTTP.

Consecuencia comprobable: `NutritionDrizzleRepository.setAiExplanation` NUNCA se ejecuta
contra una base de datos en ninguna suite, y su test unitario mockea toda la cadena del
query builder sin aseverar el argumento de `where` — cambiar `eq(nutritionPlans.id, planId)`
por `eq(nutritionPlans.petId, planId)` deja la suite entera verde.

Qué hacer: escribir los cuatro e2e DE VERDAD, con la maquinaria que el archivo ya tiene
(`seedUser`, `seedPet`, `putProfile`, `postWeight`, `generatePlan`, `api()`, `db`).
NO sobrescribas NUTRITION_REPOSITORY. Se sobrescriben solo dos providers, que es
literalmente lo que R18 prescribe:
  .overrideProvider(NUTRITION_EXPLAINER).useValue({ explain: async () => 'texto...' })
  .overrideProvider(SUBSCRIPTION_REPOSITORY).useValue({ isPetTracked: async () => true })

- **R18** — `describe` propio. Asevera el texto en los TRES sitios: (a) el body del
  `POST /v1/pets/:petId/nutrition-plan/generate`, (b) `nutrition_plans.ai_explanation`
  leído con `db`, (c) el `GET /v1/pets/:petId/nutrition-plan` posterior.
- **R13** — `SELECT count(*)` sigue en 1, la fila trae el texto, y `generated_at` es
  idéntico al de la respuesta del generate.
- **R16** — dos `generate` consecutivos: mismo `id`, `count(*)` sigue en 1, y el doble
  del explainer registró UNA sola llamada.
- **R17** — sembrar `ai_explanation = 'texto sembrado'` con `db` y leerlo por el `GET`;
  más la mitad anti-vacío: un plan con `ai_explanation` NULL sigue devolviendo `null` y
  la respuesta conserva exactamente las once claves de R19 de #17.

**Un `describe` por requisito, no un `describe.each` sobre cuatro cadenas de R-id.** Ese
patrón infla el grep de C4 (encuentra cuatro R-ids donde hay un solo cuerpo de test) y un
fallo no dice qué requisito se rompió. Además su nombre interno no nombra ningún R-id.

## B2 — `NUTRITION_AI_MAX_RETRIES` no existe y el test asevera lo contrario

C-2 y C-6 exigen la constante exportada `NUTRITION_AI_MAX_RETRIES = 0` en
infrastructure/ai/openai-nutrition-explainer.ts. Hoy: `maxRetries: 0` escrito a mano en
la línea 91, la constante no aparece en ningún archivo del repo, y
openai-nutrition-explainer.spec.ts:68 asevera `toContain('maxRetries: 0')` — exactamente
la aserción inversa a la que pide R9, que exige `toContain('maxRetries: NUTRITION_AI_MAX_RETRIES')`
para que los números no se escriban a mano en el sitio de la llamada.

No es cosmético: C-2 dedica un párrafo a por qué ese 0 es load-bearing (sin él, 3 x 15 s
cruza el corte de 29 s de API Gateway y convierte la degradación limpia en un 504,
rompiendo "jamás 5xx por la IA"). El test que debía protegerlo protege una cadena literal.

Qué hacer: crear la constante, usarla en la llamada, corregir el test para que asevere
los TRES valores exportados (`15_000`, `0`, `1_200`) y la referencia por nombre. Y mover
`NUTRITION_AI_TIMEOUT_MS` y `NUTRITION_AI_MAX_OUTPUT_TOKENS` de nutrition-prompt.ts a
openai-nutrition-explainer.ts, que es donde C-2 y C-6 las colocan.

## B3 — Falta el campo `message` en los tres `warn`

R11 exige `{ scope, petId, planId, message }` y R10 exige ese objeto más `finishReason` y
`usage`. Real:

  camino R10          -> {scope, petId, planId, finishReason, usage}          falta message
  camino R11 (catch)  -> {..., errorName} en vez de message                   el mensaje del error NO se loguea
  null-explainer      -> {..., reason: 'disabled'} en vez de message          falta message: 'ai explanation disabled'

Ningún test lo detecta porque los tres usan `expect.objectContaining` sin mencionar
`message`. Esto muerde justo donde la enmienda de R10 quería morder: con un 401 por clave
mal puesta, el humano de la prueba de humo verá `errorName` pero nunca el mensaje del
proveedor. Añade `message` en los tres sitios y haz que los tests lo aseveren.

## B4 — docs/verification.md omite un paso de R19

La sección tiene cuatro puntos pero no son los cuatro de R19: funde los pasos 1-2 y
**omite entero el paso 3** — el de devolver la clave a PENDING y comprobar que responde
200 con aiExplanation null y warning en el log. Es justo el paso que prueba la
degradación con el cableado real, el único que habría hecho visible B3.
Además, el paso 4 escrito dice volver a `OPENAI_ENABLED=false`, que deja la clave real
puesta en el .env; R19 exige devolver `OPENAI_API_KEY=PENDING` para que las corridas
siguientes de init.sh no facturen. Transcribe los cuatro pasos tal como están en R19.

## Menores (arréglalos en el mismo barrido)

- **O4**: `OPENAI_API_KEY_PENDING` se exporta y no se usa — el factory compara contra el
  literal `'PENDING'` dos líneas más abajo. Usa la constante.
- **O3**: nutrition-prompt.ts y openai-nutrition-explainer.ts tienen una sentencia
  `import` AL FINAL del archivo. Es legal, pero no se parece a nada más del repo. Súbela.
- **O1**: la trazabilidad marca como "verde" commits que no compilaban
  (`77e719d` y compañía: `execute('pet-1', now)` contra una firma de un solo parámetro, y
  fixtures con campos inexistentes; la suite solo pasó a verde en `29e53c3`). NO reescribas
  historia: añade una nota al pie de traceability.md diciendo en qué commit quedó
  realmente verde cada uno de R9..R16. La trazabilidad tiene que describir lo que pasó.

## Decidido por el leader, no lo cambies

- **O5 — el `trim` se queda.** R10 decía "sin trim destructivo"; recortar espacios
  alrededor no es destructivo y evita pintar una tarjeta con espacios colgando. La frase de
  la spec se enmienda para permitirlo explícitamente; tu implementación y su test son
  correctos tal como están.
- **O2** — la aserción que borró `29e53c3` está cubierta por las que quedan. No la repongas.

## Antes de terminar

- `./init.sh` verde, corrido entero. No midas el exit code a través de una tubería:
  `./init.sh | tail` devuelve el código de `tail`. Redirige a archivo y lee `$?`.
- **Commitea TODO**: la corrida de init.sh pasa `eslint --fix` y reescribe archivos. La
  vez pasada dejaste esa pasada sin commitear y el árbol llegó sucio a la revisión.
  Termina con `git status --short` vacío.
- Actualiza specs/nutrition-ai-explainer/traceability.md y
  progress/impl_nutrition-ai-explainer.md con lo que cambió en esta ronda.
- Sigue sin cerrar la feature: no toques feature_list.json ni STATUS.md, no abras PR.
- Sigue sin ejecutar R19 y sin poner ninguna clave real en ningún archivo. Esa prueba
  cuesta dinero y es del humano.
```

---

## Estado en el momento del handoff r2

- Veredicto de la ronda 1: **rechazado**, cuatro defectos B1..B4 y siete
  observaciones. `progress/review_nutrition-ai-explainer.md`, 491 líneas.
- El `reviewer` corrió `./init.sh` él mismo: `INIT_EXIT=0`, 323 e2e pasados, lint
  y typecheck verdes, Postgres publicando puerto. **La suite está verde y aun
  así se rechaza**: el problema es que lo que está verde no prueba lo que dice
  probar.
- #18 sigue `in_progress`; la casilla de la prueba de humo de R19 sigue sin
  marcar.

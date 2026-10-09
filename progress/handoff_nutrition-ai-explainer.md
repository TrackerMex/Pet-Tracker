# Handoff a Codex CLI — #18 nutrition-ai-explainer (proveedor Anthropic)

> Pega el bloque de abajo en Codex CLI. La spec esta firmada: enmienda del
> 2026-10-08, aprobada via Notion, commit de firma 1837ab0a de esta branch.
> Solo backend: no hay gate de dispositivo ni skills de expo. La prueba de humo
> con clave real (R19) es del humano y ninguna IA la corre.

---

```
Worktree: /home/claude/sites/Pet-Tracker-wt-18   <- PRIMERA LINEA. Trabaja AQUI y en ningun otro sitio
Antes de tocar nada, ejecuta `pwd`, `git branch --show-current`,
`git rev-parse HEAD` y `git status --short` y pega las cuatro salidas al
principio de progress/impl_nutrition-ai-explainer.md (§Base). El hash es H0:
el commit que anade este fichero. Para si la branch no es
feature/18-nutrition-ai-explainer-claude o si el status no esta vacio.
No toques ningun otro worktree (Pet-Tracker, -wt-157, -wt-backend, -wt-118,
-wt-146, -wt-148, -wt-152, -wt-153, -wt-155, -wt-ui, pet-tracker-43,
pt-skills) ni cambies de branch en ninguno. NO uses la branch vieja
feature/18-nutrition-ai-explainer (OpenAI): no se mergeo y no es base de nada.

Feature: nutrition-ai-explainer (#18)
Branch: feature/18-nutrition-ai-explainer-claude
Spec aprobada: specs/nutrition-ai-explainer/requirements.md (status: approved)
Lee tambien, enteros: specs/nutrition-ai-explainer/design.md, tasks.md y
traceability.md. Los literales (system prompt C-1, bloque de .env.example y
filas de conventions C-4, claves del prompt C-5, puerto y adaptadores C-6,
textos de log de R5/R10/R11, pasos de R19) estan en requirements.md: copialos,
no los reescribas. tasks.md da los ficheros y los rojos de cada R.

== QUE HACES ==

Cuando se genera un plan de nutricion, el backend pide a Claude (modelo por
env, `claude-haiku-5-5` solo en .env.example y conventions) una explicacion en
espanol y la guarda en nutrition_plans.ai_explanation. Cualquier fallo da
aiExplanation null con 200. Ningun test toca la red.
  R1  deroga R26 de #17 aserción por aserción (commit rojo propio)
  R2  cero literales de modelo en src/ (`claude-` en ningun .ts, `gpt-` en
      ningun .ts de produccion)
  R3  NODE_ENV=test apaga la IA antes que nada; ningun test construye cliente
  R4  ANTHROPIC_ENABLED / ANTHROPIC_API_KEY / ANTHROPIC_MODEL en .env.example,
      docs/conventions.md y env-drift.test.mjs (24 -> 27)
  R5  createNutritionExplainer(config) elige adaptador en un solo sitio;
      NullNutritionExplainer(reason) con warn
  R6-R8   prompt: system literal versionado, user prompt solo input+result,
          cotas de allergies/diseases
  R9-R11  AnthropicNutritionExplainer: parametros, normalizacion, degradacion
  R12-R16 use-case: INSERT -> entitlement -> IA -> UPDATE; reintento en hash
          hit con null; no re-llama con texto
  R17 el mapper devuelve la explicacion persistida
  R18 de punta a punta por HTTP + Postgres
  R19 seccion de docs/verification.md (la prueba la corre el humano)
No uses numeros de linea: localiza todo con grep por contenido.

Decisiones abiertas que la spec deja al implementador, ya cerradas:
  P4: NO envies `thinking` ni `output_config`. Las claves de `params` son
      exactamente ['max_tokens', 'messages', 'model', 'system'] (R9 b).
  P5: verifica contra node_modules/@anthropic-ai/sdk (0.128.0) si un `apiKey`
      explicito impide leer ANTHROPIC_AUTH_TOKEN y ANTHROPIC_BASE_URL del
      entorno. Escribe la respuesta, con fichero y simbolo del SDK que la
      prueban, en el impl §P5. No cambia el codigo pedido.
  R9: anota en el impl como obtienes el export por defecto del
      `await import('@anthropic-ai/sdk')` bajo el tsconfig del backend
      (module/moduleResolution nodenext, esModuleInterop true), con la
      salida de tsc que lo respalda.

== BASE ==

H0 desciende de origin/main fca7c399 (merge 04b4bb8c). Compruebalo:
  git merge-base --is-ancestor fca7c399 HEAD; echo "exit=$?"   -> exit=0
Anclas de la base, ejecutalas en H0 desde la raiz del worktree y pega la
salida (cada una debe dar exactamente lo indicado; si alguna no, PARA):
  grep -cF 'assert.equal(keys.length, 24);' env-drift.test.mjs                    -> 1
  grep -cE '^[A-Z_]+=' .env.example                                               -> 24
  grep -cE '^ANTHROPIC_' .env.example                                             -> 0
  grep -c '^. `PUSH_ENABLED` ' docs/conventions.md                                -> 1
  grep -c '^### Feature ' docs/verification.md                                    -> 18
  grep -cF '"@anthropic-ai/sdk"' backend-pet-tracker/package.json                 -> 0
  grep -cE '^  [a-zA-Z]+\(' backend-pet-tracker/src/modules/nutrition/domain/repositories/nutrition.repository.ts   -> 5
  grep -cF 'aiExplanation: null,' backend-pet-tracker/src/modules/nutrition/infrastructure/mappers/nutrition.mapper.ts   -> 1
  grep -cF 'imports: [PetsModule],' backend-pet-tracker/src/modules/nutrition/nutrition.module.ts   -> 1
  grep -cF "describe('R26 (nutrition-profile-engine #17): sin dependencia openai ni env OPENAI_'" backend-pet-tracker/src/modules/nutrition/nutrition-scope.spec.ts   -> 1
  grep -cF "describe('R26 (nutrition-profile-engine #17): aiExplanation es null'" backend-pet-tracker/test/nutrition.e2e-spec.ts   -> 1
  grep -rlF 'must not leak while feature 17 is active' backend-pet-tracker/test/   -> backend-pet-tracker/test/nutrition.e2e-spec.ts
  grep -cF "toHaveProperty('aiExplanation', null)" backend-pet-tracker/test/meal-times.e2e-spec.ts   -> 1
  grep -rF 'claude-' backend-pet-tracker/src/ | wc -l                             -> 0
  test -e backend-pet-tracker/src/modules/nutrition/infrastructure/ai; echo "exit=$?"   -> exit=1
Despues ejecuta la tabla ENTERA de anclas A1-A53 de requirements.md §E-5
(sustituyendo $BE y $NUT como dice esa seccion) y pega cada valor junto al
declarado como «base». El leader las midio en 1837ab0a: todas coinciden;
A48-A53 dan «No such file», que es lo esperado. Al cierre repites la tabla
contra la columna «tras #18».

== COMMITS ==

Orden y mensajes LITERALES. Es el orden de tasks.md con UN cambio, decidido
por el leader: R3 va ANTES que R5. Con R5 primero, su fila NODE_ENV='test'
ya implanta la guarda y el rojo de R3 no podria existir (RP-1 b). Con R3
primero, el rojo de R3 es real: firma minima del factory que devuelve siempre
`new NullNutritionExplainer('not-enabled')` y clase nula con `reason` y
`explain()` que resuelve null sin warn; el verde de R3 es la guarda
NODE_ENV y, si no, `new AnthropicNutritionExplainer(model, key, null)`; R5
completa las ramas 2-4, el warn del nulo y el cableado del modulo.

   1 test(nutrition-ai-explainer): derogate R26 of #17 (R1)
   2 feat(nutrition-ai-explainer): add Anthropic env vars (R4)
   3 build(nutrition-ai-explainer): add @anthropic-ai/sdk 0.128.0 (R1)
   4 test(nutrition-ai-explainer): lock versioned system prompt (R6)
   5 feat(nutrition-ai-explainer): add versioned nutrition system prompt (R6)
   6 test(nutrition-ai-explainer): lock user prompt to input and result (R7)
   7 feat(nutrition-ai-explainer): build user prompt from input and result only (R7)
   8 test(nutrition-ai-explainer): lock caps on allergies and diseases (R8)
   9 feat(nutrition-ai-explainer): cap allergies and diseases in the user prompt (R8)
  10 test(nutrition-ai-explainer): lock Anthropic call parameters (R9)
  11 feat(nutrition-ai-explainer): add Anthropic nutrition explainer (R9)
  12 test(nutrition-ai-explainer): lock response normalization (R10)
  13 feat(nutrition-ai-explainer): normalize Anthropic response to text or null (R10)
  14 test(nutrition-ai-explainer): lock degradation to null on any failure (R11)
  15 feat(nutrition-ai-explainer): degrade to null with one warn on any failure (R11)
  16 test(nutrition-ai-explainer): lock NODE_ENV test guard in explainer factory (R3)
  17 feat(nutrition-ai-explainer): guard NODE_ENV test first and pin AI off in e2e (R3)
  18 test(nutrition-ai-explainer): lock explainer selection and null adapter (R5)
  19 feat(nutrition-ai-explainer): select explainer in one factory and wire NUTRITION_EXPLAINER (R5)
  20 test(nutrition-ai-explainer): lock mapper returning persisted explanation (R17)
  21 feat(nutrition-ai-explainer): return persisted aiExplanation from mapper (R17)
  22 test(nutrition-ai-explainer): lock setAiExplanation on repository (R13)
  23 feat(nutrition-ai-explainer): add setAiExplanation to nutrition repository (R13)
  24 test(nutrition-ai-explainer): lock insert-then-explain flow (R12)
  25 feat(nutrition-ai-explainer): explain persisted plan after insert (R12)
  26 test(nutrition-ai-explainer): lock entitlement gate before explain (R14)
  27 feat(nutrition-ai-explainer): gate explanation on pet tracking entitlement (R14)
  28 test(nutrition-ai-explainer): lock retry on hash hit without explanation (R15)
  29 feat(nutrition-ai-explainer): retry explanation on same row when null (R15)
  30 test(nutrition-ai-explainer): lock no re-call on hash hit with explanation (R16)
  31 feat(nutrition-ai-explainer): skip explainer on hash hit with explanation (R16)
  32 test(nutrition-ai-explainer): lock explanation end to end over HTTP and Postgres (R18)
  33 test(nutrition-ai-explainer): lock setAiExplanation row targeting over HTTP (R13)
  34 test(nutrition-ai-explainer): lock hash hit not paying twice over HTTP (R16)
  35 docs(nutrition-ai-explainer): add feature 18 smoke test procedure (R19)
  36 docs(nutrition-ai-explainer): fill #18 traceability

Ficheros por commit: los de tasks.md para ese R. El 3 lleva SOLO
backend-pet-tracker/package.json y pnpm-lock.yaml (RP-4), con
`pnpm -C backend-pet-tracker add --save-exact @anthropic-ai/sdk@0.128.0`.
El 17 lleva, ademas del factory, `process.env.ANTHROPIC_ENABLED = 'false'` a
nivel de modulo en test/nutrition.e2e-spec.ts, antes de
Test.createTestingModule. El 19 lleva el modulo: `imports: [PetsModule,
SubscriptionsModule, ConfigModule],` y el provider NUTRITION_EXPLAINER con
useFactory. El 35 copia de requirements.md R19 los pasos 0-6, la tabla de
diagnostico, la condicion de STOP y el coste estimado, en la seccion
`### Feature 18 — nutrition-ai-explainer` de docs/verification.md. El 36 lleva
SOLO traceability.md y progress/impl_nutrition-ai-explainer.md.

R2 no tiene commit: se verifica al final (aserciones 5 y 11 verdes) y con la
sonda de tasks.md R2.

ROJOS. R1 deja la suite roja A PROPOSITO (unica excepcion a RP-1 b): rojas
las aserciones 6, 7, 9 y 10 de nutrition-scope.spec.ts y el bloque R12 de
meal-times.e2e-spec.ts (R1 c); verdes 1-5, 8, 11, 12 y 13. Esos rojos se
apagan, y solo esos, en: 7 y 9 con el commit 2; 6 con el 3; 10 con el 17
(primer fichero de produccion con ANTHROPIC_); R1(c) con el 21. Entre el
commit 1 y el 21 `pnpm test` y <e2e-nut> NO estan verdes: anota en cada
commit cuales de esos rojos quedan y que no hay ningun otro.
El resto de commits `test(...)` compila (`pnpm exec tsc --noEmit`, exit 0) y
falla por ASERCION (matcher) o por el `throw` de una firma minima que RP-1 b
permite (mensaje reconocible, p. ej. `not implemented (R13)`). Nunca por
ReferenceError, TypeError, import que falta, timeout ni error de consulta del
propio test. Los `it` que tasks.md declara verdes en un rojo salen verdes.

GUARDAS QUE NACEN VERDES. Si un commit `test(...)` nace verde porque la base o
un verde anterior ya cumple el test (seguro en 32, 33 y 34; posible en 26 o
30 segun como dejes el verde anterior), NO hagas un `feat` vacio ni lo
fuerces a rojo: commitea solo el test, provoca el rojo con la sonda de
mutacion que tasks.md da para ese R, pega la salida en el impl (§Sondas) y
omite el `feat` correspondiente. Dilo en el impl con el numero del commit
omitido. Asi lo preve traceability.md («el rojo se acredita con la sonda»).
La lista de arriba es el MAXIMO; no anadas commits.

SONDAS (ninguna se commitea): las de tasks.md para R1 (aserciones 8, 11, 12,
13; para la 8, `ANTHROPIC_API_KEY=sk-x` en .env.example), R2, R3, las tres
del e2e (R13 where por petId, R16 sin rama de hash hit, R18 devolviendo el
plan insertado) y cualquier guarda nacida verde. Una cada vez, sobre el arbol
verde. Restaura SIEMPRE con `git checkout HEAD -- <ruta>`, nunca con
`git checkout <commit> -- <ruta>`, git stash ni rm. Tras cada sonda:
  git diff --exit-code; echo "exit=$?"            -> exit=0
  git diff --cached --exit-code; echo "exit=$?"   -> exit=0
  git status --short                              -> vacio
Si una sonda no da el rojo esperado, PARA y reportalo con el log. No ajustes
ni la sonda ni el test.

== REGLAS CRITICAS ==

- Arquitectura: docs/architecture.md. Convenciones: docs/conventions.md.
- Skills: ninguna. Es solo backend; no cargues skills de expo. Dilo en el
  reporte.
- TEST PRIMERO (C4 de CHECKPOINTS.md): por R, commit rojo y commit verde
  separados. Tests + implementacion + docs en un solo commit incumple C4 (paso
  en #19).
- Titulos con sufijo: `describe('R<n> (nutrition-ai-explainer #18): ...')`.
  #17 ya escribio R1..R27 en los mismos ficheros: sin el sufijo, C4 no se
  verifica por grep.
- Imports arriba (RP-2). El unico import dentro de una funcion es el
  `await import('@anthropic-ai/sdk')` del adaptador.
- NINGUN TEST TOCA LA RED: cuesta dinero real. Ningun test importa
  @anthropic-ai/sdk ni construye AnthropicNutritionExplainer con cliente null
  (aserciones 12 y 13 de R1). Dobles con modelo 'modelo-de-prueba' y clave
  'clave-de-prueba'.
- No escribas `claude-` en ningun fichero de backend-pet-tracker/src/, ni en
  comentarios ni en specs (R2). La aguja de la aserción 11 se construye como
  `['claude', '-'].join('')`.
- No hay migracion nueva: la columna existe desde 0013 (A29). No toques
  src/db/migrations/, nutrition-input-hash.ts, nutrition-engine.ts,
  nutrition-profile.dto.ts, src/modules/subscriptions/**, env-drift.mjs ni
  plans/presupuesto-produccion.md (design.md §Intocables).
- `pnpm lint` lleva --fix: correlo ANTES de cada commit y commitea el formato
  con su paso. `pnpm exec tsc --noEmit` antes de cada commit, rojo o verde.
- Rellena specs/nutrition-ai-explainer/traceability.md SOLO en el commit 36:
  dos hashes por fila (rojo y verde), o hash del test + «sonda §<seccion del
  impl>» si nacio verde. R1: hash del rojo y del ultimo verde que lo apaga
  (21). R19 queda «pendiente — gate humano». No rebasees despues de escribir
  hashes.
- NO son tuyos, no los toques: .env (tampoco para probar R19),
  progress/history.md, progress/current.md, STATUS.md, feature_list.json, y
  en requirements.md el frontmatter y las casillas de §Aprobacion y de las P.
  Todo lo que tengas que contar va en progress/impl_nutrition-ai-explainer.md.
- No crees recursos AWS ni corras cdk. No ejecutes la prueba de humo R19 ni
  ninguna llamada real a la API de Anthropic.
- Si el sandbox te deniega un comando, PARA y reportalo. No lo sustituyas por
  otro que haga lo mismo con otra herramienta.
- NO hagas push ni abras ni edites la PR: lo hace el leader al cerrar.

== FICHEROS ==

Lista cerrada, medida al final con
  git diff --name-only H0 HEAD
Bajo backend-pet-tracker/:
  package.json
  pnpm-lock.yaml
  src/modules/nutrition/nutrition-scope.spec.ts
  src/modules/nutrition/nutrition.module.ts
  src/modules/nutrition/domain/ports/nutrition-explainer.ts                       (nuevo)
  src/modules/nutrition/domain/entities/nutrition-plan.entity.ts
  src/modules/nutrition/domain/repositories/nutrition.repository.ts
  src/modules/nutrition/application/use-cases/generate-nutrition-plan.use-case.ts
  src/modules/nutrition/application/use-cases/generate-nutrition-plan.use-case.spec.ts   (nuevo)
  src/modules/nutrition/infrastructure/ai/nutrition-prompt.ts                    (nuevo)
  src/modules/nutrition/infrastructure/ai/nutrition-prompt.spec.ts               (nuevo)
  src/modules/nutrition/infrastructure/ai/null-nutrition-explainer.ts            (nuevo)
  src/modules/nutrition/infrastructure/ai/null-nutrition-explainer.spec.ts       (nuevo)
  src/modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.ts       (nuevo)
  src/modules/nutrition/infrastructure/ai/anthropic-nutrition-explainer.spec.ts  (nuevo)
  src/modules/nutrition/infrastructure/ai/nutrition-explainer.factory.ts         (nuevo)
  src/modules/nutrition/infrastructure/ai/nutrition-explainer.factory.spec.ts    (nuevo)
  src/modules/nutrition/infrastructure/mappers/nutrition.mapper.ts
  src/modules/nutrition/infrastructure/mappers/nutrition.mapper.spec.ts          (nuevo)
  src/modules/nutrition/infrastructure/repositories/nutrition.drizzle.repository.ts
  src/modules/nutrition/infrastructure/repositories/nutrition.drizzle.repository.spec.ts   (nuevo)
  test/nutrition.e2e-spec.ts
  test/meal-times.e2e-spec.ts
  test/nutrition-ai-explainer.e2e-spec.ts                                         (nuevo)
Fuera de backend-pet-tracker/:
  .env.example
  env-drift.test.mjs                 (exactamente una linea: 24 -> 27)
  docs/conventions.md                (tres filas tras PUSH_ENABLED)
  docs/verification.md               (seccion Feature 18)
  specs/nutrition-ai-explainer/traceability.md
  progress/impl_nutrition-ai-explainer.md      (nuevo)
Nada mas. Si tsc te obliga a tocar otro fichero, PARA y reportalo: el
leader verifico que los tres specs con `as unknown as NutritionRepository`
(A17) compilan al anadir el sexto metodo y que no hay MockOf en nutrition
(A18).

== ENTORNO ==

- Todo con pnpm desde backend-pet-tracker/. Atajos:
    <e2e-nut> pnpm exec jest --config ./test/jest-e2e.json test/nutrition.e2e-spec.ts test/meal-times.e2e-spec.ts test/meals.e2e-spec.ts
    <e2e-ai>  pnpm exec jest --config ./test/jest-e2e.json test/nutrition-ai-explainer.e2e-spec.ts
  Donde tasks.md dice `pnpm test:e2e`, usa estos.
- Postgres: base `pet_tracker` (contenedor pet-tracker-postgres, puerto 5433,
  via el .env de la raiz). Los contenedores ya estan arriba: no corras
  `docker compose up` ni pares ni levantes nada. Nunca `export DATABASE_URL`,
  nunca psql para escribir, no toques .env. Lecturas con
  `docker exec pet-tracker-postgres psql -U pet_tracker -d pet_tracker -Atc "..."`.
  Si un comando falla sin llegar a correr tests (ECONNREFUSED, relacion
  inexistente), PARA y pide al humano.
- La sesion de #157 (worktree -wt-157) usa la MISMA base `pet_tracker`.
  Antes de CADA corrida e2e:
    pgrep -af 'init\.sh|test:e2e|jest-e2e' | grep -v pgrep
  no debe listar nada. Si lista algo, espera a que termine o PARA y avisa al
  humano. Nunca lances dos e2e a la vez.
- NO lances ./init.sh ni `pnpm test:e2e` entero: comparten LocalStack y
  Postgres con otras sesiones. Los hace el LEADER al cierre. En el impl
  escribe «delegado al leader» donde tasks.md los pida. Tu linea base y tus
  medidas son `pnpm test`, tsc, lint, `node --test env-drift.test.mjs`
  (desde la raiz), <e2e-nut> y <e2e-ai>.
- Mide SIN pipe: `cmd > fichero 2>&1; echo "exit=$?"`. `cmd | tail` devuelve
  el codigo de tail. Los logs de /tmp no se versionan: copia al reporte sus
  lineas de resumen (Test Suites / Tests) y el exit.
- Linea base en H0, antes del commit 1: `pnpm test`, tsc, lint, <e2e-nut> y
  `node --test env-drift.test.mjs`, todo verde. Si algo de la base falla,
  PARA.
- El leader no toca este arbol mientras trabajas.

Criterios de aceptacion: R1-R18 de requirements.md con sus tests y anclas;
R19 solo su seccion de docs (la prueba es del humano).

Al terminar, progress/impl_nutrition-ai-explainer.md tiene: pwd, branch, H0 y
status; skills cargadas (ninguna); el pgrep inicial; §Base con las 15 anclas
de == BASE ==, la tabla A1-A53 en H0 y la linea base con exit; los commits con
hash, numero de la lista y R-id, y los omitidos con su motivo; cada rojo con
sus cuentas, exit, sus `it`, su matcher, `Expected` y `Received`, y cada
verde con sus cuentas y exit; entre los commits 1 y 21, los rojos de R1 que
quedan en cada uno; §P5 y la nota del export por defecto (R9); §Sondas con
cada sonda, su rojo y los tres comandos de limpieza en 0; la tabla A1-A53
final contra «tras #18»; tsc, lint, `pnpm test`, <e2e-nut>, <e2e-ai> y
env-drift finales con exit, y el `git status --short` posterior;
`git diff --stat H0..HEAD` y `git diff --name-only H0 HEAD` contra la lista
cerrada; init.sh y test:e2e entero «delegado al leader»; y cualquier decision
que la spec no cerrara literalmente.
```

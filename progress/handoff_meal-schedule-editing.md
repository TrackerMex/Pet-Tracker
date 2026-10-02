# Handoff a Codex CLI — #103 meal-schedule-editing

> Pega el bloque de abajo en Codex CLI. La spec está firmada (commit de firma
> 2b74cd62 de esta branch, aprobada vía Notion el 2026-10-02). Solo backend:
> no hay gate de dispositivo ni skills de expo. La mitad móvil es #147.

---

```
Worktree: /home/claude/sites/Pet-Tracker   <- PRIMERA LINEA. Trabaja AQUI y en ningun otro sitio
Antes de tocar nada, ejecuta `pwd`, `git branch --show-current` y
`git rev-parse HEAD` y pega las tres salidas al principio de
progress/impl_meal-schedule-editing.md (§Base). El hash es H0, el «hash del
handoff» de tasks.md §0: el commit que anade este fichero. Para si la branch
no es feature/103-meal-schedule-editing.
No toques /home/claude/sites/Pet-Tracker-wt-backend (es de otra sesion; otro
Codex implementa alli #41), Pet-Tracker-wt-146, Pet-Tracker-wt-ui,
pet-tracker-43 ni pt-skills, ni cambies de branch en ningun worktree.

Feature: meal-schedule-editing (#103)
Branch: feature/103-meal-schedule-editing
Spec aprobada: specs/meal-schedule-editing/requirements.md (status: approved)
Lee tambien, enteros: specs/meal-schedule-editing/design.md, tasks.md y
traceability.md. tasks.md es tu guion paso a paso: el orden (§Orden), los
ficheros de cada commit, los rojos esperados de cada R, la secuencia de la
migracion en R1, las sondas S1-S20 (§Sondas) y la evidencia de R13. Los
bloques de test estan en requirements.md; los helpers del e2e, en design.md
§E2E; el texto de docs, literal, en design.md §Docs.

== QUE HACES ==

Mitad backend de la edicion del horario de comidas. Editar = insertar una
copia nueva del plan con el mismo inputsHash y aiExplanation; nada se
actualiza en nutrition_plans.
  R1  columna engine_meals_per_day (migracion 0018) y lectura en la entidad
  R2  generate conserva el horario editado mientras el motor no cambie el
      numero de comidas (engineMealCount, carriedSchedule)
  R3  POST /v1/pets/:petId/meal-times anade una franja como copia nueva
  R4  PATCH /v1/pets/:petId/meal-times/:mealTime mueve una franja como copia
  R5  la servida de hoy se mueve con su franja en la misma transaccion; los
      dias pasados no (puerto insertPlanAndMoveServing)
  R6  si el destino ya tiene servida hoy, gana la del destino
  R7  auditoria meal_time.add / meal_time.move despues de escribir
  R8  body invalido: 400 antes de leer el plan (STRICT_MEAL_TIME_PATTERN)
  R9  422 MEAL_TIME_DUPLICATE y MEAL_TIMES_LIMIT_REACHED (MAX_MEALS_PER_DAY
      = 6), en orden y sin persistir
  R10 solo el owner edita (@RequirePetRole('owner'))
  R11 verificacion: servir, deshacer, GET del plan y perfil leen el plan
      editado (rojo con mutacion versionada en pet-meals.drizzle-reader.ts)
  R12 verificacion: la copia conserva inputsHash y aiExplanation (rojo con
      mutacion versionada en copyWithMealTimes)
  R13 verificacion: migracion aplicada e idempotente, arbol verde, docs
No uses numeros de linea: localiza todo con grep por contenido.

Ficheros que TU cambias, medidos desde H0 (`git diff --name-only H0 HEAD`),
la lista cerrada de design.md §Archivos afectados. Bajo backend-pet-tracker/:
  src/db/schema/nutrition.schema.ts
  src/db/schema/nutrition.schema.spec.ts
  src/db/schema/meal-servings.schema.spec.ts
  src/db/migrations/0018_nutrition_plans_engine_meals.sql          (nuevo)
  src/db/migrations/meta/0018_snapshot.json                         (nuevo)
  src/db/migrations/meta/_journal.json
  src/modules/nutrition/domain/entities/nutrition-plan.entity.ts
  src/modules/nutrition/domain/entities/nutrition-plan.entity.spec.ts   (nuevo)
  src/modules/nutrition/domain/repositories/nutrition.repository.ts
  src/modules/nutrition/domain/errors/nutrition.errors.ts
  src/modules/nutrition/domain/nutrition.constants.ts
  src/modules/nutrition/application/dto/meal.dto.ts
  src/modules/nutrition/application/use-cases/generate-nutrition-plan.use-case.ts
  src/modules/nutrition/application/use-cases/add-meal-time.use-case.ts        (nuevo)
  src/modules/nutrition/application/use-cases/add-meal-time.use-case.spec.ts   (nuevo)
  src/modules/nutrition/application/use-cases/move-meal-time.use-case.ts       (nuevo)
  src/modules/nutrition/application/use-cases/move-meal-time.use-case.spec.ts  (nuevo)
  src/modules/nutrition/application/use-cases/serve-meal.use-case.spec.ts      (solo el fixture)
  src/modules/nutrition/infrastructure/nutrition.controller.ts
  src/modules/nutrition/infrastructure/mappers/nutrition-error.mapper.ts
  src/modules/nutrition/infrastructure/repositories/nutrition.drizzle.repository.ts
  src/modules/nutrition/infrastructure/repositories/pet-meals.drizzle-reader.ts (diff neto CERO)
  src/modules/nutrition/nutrition.module.ts
  test/meal-times.e2e-spec.ts                                       (nuevo)
Fuera de backend-pet-tracker/:
  docs/data-model.md
  docs/conventions.md
  specs/meals-served-tracking/design.md
  specs/meal-schedule-editing/traceability.md
  progress/impl_meal-schedule-editing.md
Nada mas. El leader verifico que no hay dobles completos de
NutritionRepository (solo `as unknown as`) ni otros constructores de
NutritionPlan que los tres de tasks.md R1: anadir el metodo al puerto no
rompe otros ficheros.

Orden EXACTO de tasks.md §Orden: R1 -> aplicar 0018 -> R2 ... R12 ->
§Sondas -> R13. Mensajes de commit, LITERALES y en este orden (26 commits):
  test(meal-schedule-editing): lock engine_meals_per_day column and 0018 migration (R1)
  feat(meal-schedule-editing): add engine_meals_per_day column and migration 0018 (R1)
  test(meal-schedule-editing): lock carried meal schedule across generate (R2)
  feat(meal-schedule-editing): carry edited meal schedule while engine meal count holds (R2)
  test(meal-schedule-editing): lock POST meal-times append-only copy (R3)
  feat(meal-schedule-editing): add POST meal-times endpoint (R3)
  test(meal-schedule-editing): lock PATCH meal-times move copy (R4)
  feat(meal-schedule-editing): add PATCH meal-times endpoint (R4)
  test(meal-schedule-editing): lock today's serving moving with its slot (R5)
  feat(meal-schedule-editing): move today's serving with its slot in one transaction (R5)
  test(meal-schedule-editing): lock destination-wins merge on slot collision (R6)
  feat(meal-schedule-editing): merge serving into destination slot on collision (R6)
  test(meal-schedule-editing): lock meal_time audit after write (R7)
  feat(meal-schedule-editing): audit meal_time.add and meal_time.move (R7)
  test(meal-schedule-editing): lock strict HH:MM validation on meal-times (R8)
  feat(meal-schedule-editing): validate meal-times body with strict HH:MM (R8)
  test(meal-schedule-editing): lock meal-times 422 codes and order (R9)
  feat(meal-schedule-editing): reject duplicate and seventh meal times (R9)
  test(meal-schedule-editing): lock owner-only meal-times edits (R10)
  feat(meal-schedule-editing): restrict meal-times edits to owner (R10)
  test(meal-schedule-editing): lock readers on edited plan (R11)
  feat(meal-schedule-editing): restore pet-meals reader order after R11 lock (R11)
  test(meal-schedule-editing): lock inputsHash and aiExplanation on edited copy (R12)
  feat(meal-schedule-editing): restore copyWithMealTimes after R12 lock (R12)
  docs(meal-schedule-editing): document engine_meals_per_day and amend #83 D4 (R13)
  docs(meal-schedule-editing): fill #103 traceability
El ultimo lleva traceability.md y progress/impl_meal-schedule-editing.md.

== CIFRAS ==

El arbol de backend-pet-tracker/ y docs/ en H0 es identico al de
origin/main 4e8d6cc3 (el leader midio `git diff --quiet origin/main HEAD --
backend-pet-tracker docs` con exit=0 el 2026-10-02). Bases medidas por el
leader:
  ./init.sh sobre 4e8d6cc3 (2026-10-02, 04:41-04:46Z), exit=0:
    backend unit 171 suites / 1307 tests;
    e2e 30 ficheros (27 corren + 3 aws-real skipped), 407 tests
    (399 pasan + 8 skipped). Es la P16 de requirements.md.
  <e2e-nut> sobre 2b74cd62: 2 suites / 45 tests, exit=0.
  Postgres, base `pet_tracker` (la del .env de la raiz):
    drizzle.__drizzle_migrations = 18; _journal.json = 18 entradas.
Finales esperados (tasks.md R13): unit 174 suites / 1335 tests (+3 / +28);
meal-times.e2e-spec.ts 1 suite / 22 tests; <e2e-nut> sigue 2 / 45;
migraciones 19. Tu medida manda: si tu base no cuadra, anota la tuya y
aplica el mismo delta.
Los rojos son SOLO los que nombra tasks.md para cada R, y POR ASERCION
(matcher), nunca por ReferenceError, TypeError, import que falta, timeout
ni error de consulta del propio test. Unica excepcion declarada: el `it` 2
de R1 cae por consulta (`Engine meals migration not found`). Los `it` que
tasks.md declara verdes en un rojo tienen que salir verdes. Si falla
cualquier test de la base, PARA.
Todo rojo e2e se registra CON 0018 YA APLICADA (tasks.md, «Migracion antes
de cualquier e2e»): un `column "engine_meals_per_day" does not exist` no
vale como rojo.

Sondas: S1-S20 de requirements.md §Sondas exigidas, sobre el arbol verde de R12, UNA
cada vez (tasks.md §Sondas). Si alguna no da exactamente su «Exigido», PARA
y reportalo con el log. No ajustes ni la sonda ni el test. Ninguna sonda se
commitea.

== REGLAS CRITICAS ==

- Arquitectura: docs/architecture.md. Convenciones: docs/conventions.md.
- Skills: ninguna. Es solo backend; no cargues skills de expo. Dilo en el
  reporte.
- TEST PRIMERO (C4 de CHECKPOINTS.md): por R, un commit ROJO y un commit
  VERDE, separados. 26 commits, no uno: tests + implementacion + docs en un
  solo commit incumple C4 (paso en #19). R13 no tiene commit de test.
- Titulos con sufijo: `describe('R<n> (meal-schedule-editing #103): ...')`,
  copiados literalmente de requirements.md.
- Sujeto presente: el rojo solo nombra simbolos que ya existen o que su
  propio commit rojo trae como esqueleto de produccion (design.md D3).
- Cada helper del e2e entra en el commit rojo del PRIMER R que lo usa: el
  lint marca como error una funcion sin usar.
- Los verdes que cambian la firma del puerto o de la entidad llevan todos
  los ficheros que tsc exige en el MISMO commit (ts-jest no lo ve:
  isolatedModules). Corre `pnpm exec tsc --noEmit` antes de cada commit
  verde.
- R1 paso 2: si `pnpm db:generate` produce cualquier sentencia distinta de
  `ALTER TABLE "nutrition_plans" ADD COLUMN "engine_meals_per_day" integer;`,
  PARA, como dice tasks.md.
- R11 y R12 (mutaciones versionadas): el verde devuelve el fichero al padre
  del commit rojo con `git show <padre del rojo>:<ruta> > <ruta>` o a mano.
  NUNCA `git checkout <hash> -- <ruta>` (deja la mutacion en el indice).
  Comprueba `git diff <padre del rojo> HEAD -- <ruta>; echo "exit=$?"` sin
  salida tras el verde, y en R11 ademas `git diff H0 HEAD -- <ruta>` vacio.
- Sin dependencias nuevas, sin tocar package.json, pnpm-lock.yaml, infra/,
  mobile-pet-tracker/ ni ningun fichero fuera de la lista. Ningun `it` ni
  `describe` existente se edita salvo los dos que tasks.md R1 nombra (R15
  de nutrition.schema.spec.ts y C8 de meal-servings.schema.spec.ts).
- `pnpm lint` lleva --fix: correlo ANTES de cada commit y commitea el
  formato con su paso.
- Rellena specs/meal-schedule-editing/traceability.md con los hashes, sin
  ninguna fila «pendiente», solo en el ultimo commit. No rebasees despues
  de escribir hashes.
- No crees recursos AWS ni corras cdk.
- NO son tuyos, no los toques: progress/history.md, progress/current.md,
  STATUS.md y feature_list.json. Son del leader. Todo lo que tengas que
  contar va en progress/impl_meal-schedule-editing.md.
- Si el sandbox te deniega un comando, PARA y reportalo. No lo sustituyas por
  otro que haga lo mismo con otra herramienta.
- NO abras la PR ni hagas push: lo hace el leader al cerrar.

== ENTORNO ==

- Todo con pnpm desde backend-pet-tracker/, como en tasks.md. Atajos:
    <e2e-mt>  pnpm exec jest --config ./test/jest-e2e.json test/meal-times.e2e-spec.ts
    <e2e-nut> pnpm exec jest --config ./test/jest-e2e.json test/meals.e2e-spec.ts test/nutrition.e2e-spec.ts
  Donde tasks.md dice `pnpm test:e2e -- meal-times.e2e-spec`, usa <e2e-mt>.
  Corre <e2e-nut> en cada verde desde R2 y en el rojo de R11 (tasks.md pide
  anotar si R11 arrastra algun e2e de #83).
- Postgres: la base de este arbol es `pet_tracker` (contenedor
  pet-tracker-postgres, puerto 5433, via el .env de la raiz que lee
  drizzle.config.ts). La de wt-backend es `pet_tracker_wt` y NO es tuya.
  `pnpm db:migrate` SOLO desde este arbol. Nunca `export DATABASE_URL`,
  nunca psql para escribir, no toques .env, no levantes ni pares
  contenedores. Las lecturas con
  `docker exec pet-tracker-postgres psql -U pet_tracker -d pet_tracker -Atc "..."`.
  Si un comando falla sin llegar a correr tests (ECONNREFUSED, relacion
  inexistente antes de R1), PARA y pide al humano.
- Antes de empezar: `pgrep -af 'init\.sh|test:e2e|jest-e2e' | grep -v pgrep`
  no debe listar nada. Si lista algo, PARA y avisa al humano.
- NO lances ./init.sh ni `pnpm test:e2e` entero: comparten LocalStack con
  la sesion de #41, y otro Codex trabaja alli. Eso cambia tres pasos de
  tasks.md, que hace el LEADER al cierre:
    §0 «Linea base» paso 2 (./init.sh): ya medida, ver == CIFRAS ==.
      Tu linea base es `pnpm test`, tsc, lint y <e2e-nut> en H0.
    R13 (a) 8 (`pnpm test:e2e` completo) y 9 (./init.sh): escribe
      «delegado al leader» en el impl §R13. El resto de R13 (a), 1-7, si
      es tuyo.
  Se mide con <e2e-mt>, <e2e-nut>, `pnpm test`, tsc y lint.
- Mide SIN pipe: `cmd > fichero 2>&1; echo "exit=$?"`. `cmd | tail` devuelve
  el codigo de tail. Los logs de /tmp no se versionan: copia sus lineas de
  resumen al reporte.
- En las SONDAS restaura SIEMPRE con `git checkout HEAD -- <ruta>`, nunca con
  `git checkout <commit> -- <ruta>`, ni git stash ni rm -f. Tras cada sonda,
  `git diff --exit-code` y `git diff --cached --exit-code` en 0, y
  `git status --short` vacio.
- El leader no toca este arbol mientras trabajas.

Criterios de aceptacion: R1-R13 de requirements.md, con los greps y la
evidencia de tasks.md R13 y §Cierre.

Al terminar, progress/impl_meal-schedule-editing.md tiene: pwd, branch y
H0; skills cargadas (ninguna); el pgrep inicial; §Base con la base de
Postgres, su recuento de migraciones y tus medidas de linea base con exit;
la salida de `pnpm db:migrate` de §Orden; los 26 commits con hash y R-id;
cada rojo con sus cuentas, exit, sus `it`, su matcher, `Expected` y
`Received`, y cada verde con sus cuentas y exit; el `cat` del .sql de 0018;
los diffs de R11 y R12 contra el padre del rojo (y R11 contra H0); la tabla
de §Sondas S1-S20; R13 (a) 1-7 con su salida y 8-9 «delegado al leader»;
tsc y lint con su exit y el `git status --short` posterior;
`git diff --stat H0..HEAD`; los recuentos finales y el delta sobre tu base;
y cualquier decision que la spec no cerrara literalmente.
```

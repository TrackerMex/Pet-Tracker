---
feature: "meal-schedule-editing"
status: approved     # draft | approved
tags: [harness, spec]
---

# Tareas — [[meal-schedule-editing]]

> Disciplina TDD. Cada tarea corresponde a un requisito de [[requirements]] y
> tiene siempre los mismos 3 sub-items, en este orden.
>
> **Commits test-primero, obligatorio** (C4 de `CHECKPOINTS.md`):
> - el (1) de cada R es su propio commit
>   `test(meal-schedule-editing): … (R<n>)` y se deja en **rojo**;
> - el (2) es el commit `feat(meal-schedule-editing): … (R<n>)` que lo pone
>   verde;
> - el (3), si hay docs, es `docs(meal-schedule-editing): … (R<n>)`.
>
> Los mensajes de abajo son **literales**. Un solo commit con test +
> implementación + docs incumple C4 (pasó en #19). R13 es un requisito de
> verificación (C4 vía (b)): no tiene commit de test.
>
> **Títulos de test con sufijo de feature**:
> `describe('R<n> (meal-schedule-editing #103): …')`, copiados literalmente
> de [[requirements]]. El módulo `nutrition` ya acumula R-ids de #17 y #83;
> sin sufijo, C4 no es verificable por grep.
>
> **Sujeto presente**: cada test rojo nombra solo símbolos que ya existen en
> el árbol, o que su propio commit rojo trae como esqueleto de producción
> ([[design]] D3). Ningún rojo puede venir de un `ReferenceError`, de un
> import que falta ni de mutar un doble.
>
> **Helpers del e2e**: cada helper de `test/meal-times.e2e-spec.ts` entra en
> el commit rojo del **primer** R que lo usa, y no antes, porque `lint`
> rechaza funciones sin usar. El fichero lo crea el commit rojo de R2, y cada
> R siguiente añade su `describe`.
>
> **Migración antes de cualquier e2e**: hasta que R1 esté verde **y** `0018`
> esté aplicada a la base del árbol (§Orden), todo e2e que lea
> `nutrition_plans` cae por `column "engine_meals_per_day" does not exist`.
> Ese no es el rojo que demuestra nada. El rojo legítimo de cada R se registra
> con la migración ya aplicada.
>
> **Suites**, desde `backend-pet-tracker/`:
> - `pnpm test` (unit), `pnpm exec tsc --noEmit`, `pnpm lint`;
> - `pnpm test:e2e` (Postgres; `meal-times` no toca LocalStack, pero la suite
>   completa sí).
>
> Para un fichero: `pnpm test -- nutrition-plan.entity`,
> `pnpm test:e2e -- meal-times.e2e-spec`. El cierre es `./init.sh` desde la
> raíz, con el exit code medido **sin pipe**.
>
> **Base de Postgres**: se mide en §0 y no se supone. Consultas con
> `docker exec pet-tracker-postgres psql -U pet_tracker -d <BASE> -Atc "…"`.
> Nunca `psql` para escribir, nunca `export DATABASE_URL`: `drizzle.config.ts`
> lee `../.env`.
>
> Antes de `pnpm test:e2e` completo o de `./init.sh`, este comando tiene que
> salir limpio:
> `pgrep -af 'init\.sh|test:e2e|jest-e2e' | grep -v pgrep`.
> LocalStack `:4566` se comparte, y quizá también la base.

---

## §0 — Antes de la primera tarea

- [ ] Verificar la branch: `git branch --show-current` =
      `feature/103-meal-schedule-editing`, con HEAD en el commit de firma de
      la spec o en un hijo. Anotar ese hash en el impl §Base como **hash del
      handoff**: la lista cerrada de ficheros de [[design]] se mide con
      `git diff --stat <hash del handoff>..HEAD`.
- [ ] Leer [[requirements]] completo y, en especial:
  - §0.2: C2, no hay spec unitaria de `generate`; C8, el candado de
    `meal-servings` que se mueve;
  - §Contrato HTTP;
  - §Sondas.

  De [[design]], leer D1-D12 y §E2E.
- [ ] Medir la base sin imprimir credenciales. Desde la raíz del árbol:
      `grep -o '^DATABASE_URL=[^ ]*' .env | sed 's#.*/##; s#?.*##'` → `<BASE>`.
      Luego:
      `docker exec pet-tracker-postgres psql -U pet_tracker -d <BASE> -Atc "select count(*) from drizzle.__drizzle_migrations"`.
      El resultado debe ser **18**, el número de entradas de
      `meta/_journal.json`. Anotar `<BASE>` y el recuento en el impl §Base. Si
      no son 18, **parar** y avisar: la base está desincronizada y no es cosa
      de esta feature.
- [ ] Crear `progress/impl_meal-schedule-editing.md` con las secciones §Base,
      R1…R13 y §Sondas vacías.
- [ ] Línea base:
  1. `pgrep` limpio;
  2. `./init.sh` desde la raíz, exit 0 sin pipe;
  3. anotar los recuentos unit (suites y tests) y e2e (ficheros y tests).

  La referencia es 171 / 1307 y 30 ficheros / 407 tests (P16). Si difieren,
  mandan los medidos, y R13 se compara contra ellos + el delta. Tiene que
  estar verde antes de tocar nada.

## §Orden

R1 → **aplicar `0018`** (`pnpm db:migrate` desde `backend-pet-tracker/`;
anotar la salida en el impl §R13, sin el resto de la evidencia todavía) → R2
→ R3 → R4 → R5 → R6 → R7 → R8 → R9 → R10 → R11 → R12 → §Sondas → R13.

Por qué este orden:

- R2 necesita la columna (inserta `engineMealsPerDay` directamente).
- R3 y R4 crean las rutas que usan los R siguientes.
- R5 y R6 escalonan la transacción ([[design]] D5).
- R7 a R10 endurecen sobre rutas que ya existen.
- R11 y R12 son candados sobre código correcto: van al final para que su
  mutación de rojo no tape otro trabajo.

---

## R1 — columna `engine_meals_per_day`, migración `0018` y lectura en la entidad

- [ ] (1) Escribir test que falla para R1 — commit
      `test(meal-schedule-editing): lock engine_meals_per_day column and 0018 migration (R1)`.
      Solo dos ficheros:
  - `src/db/schema/nutrition.schema.spec.ts`: el `describe` R1, con el helper
    `findEngineMealsMigration`, y `'engine_meals_per_day'` en la lista de
    columnas del `it` de R15;
  - `src/db/schema/meal-servings.schema.spec.ts`: el `it` de C8, reescrito
    como en [[requirements]] §Candados.

  Rojo esperado en `pnpm test -- nutrition.schema`:
  - `it` 1 y R15 por matcher;
  - `it` 2 por consulta (`Engine meals migration not found`).

  `pnpm test -- meal-servings.schema` sigue **verde**. Pegar los fragmentos
  en el impl §R1.
- [ ] (2) Implementación mínima que lo pasa — commit
      `feat(meal-schedule-editing): add engine_meals_per_day column and migration 0018 (R1)`,
      en este orden:
      1. `src/db/schema/nutrition.schema.ts`:
         `engineMealsPerDay: integer('engine_meals_per_day'),` justo después
         de `mealTimes`.
      2. `pnpm db:generate` desde `backend-pet-tracker/`. Comprobar:
         - `git status --porcelain src/db/migrations` muestra **un** `.sql`
           nuevo, `meta/0018_snapshot.json` y `meta/_journal.json`;
         - `cat` del `.sql` da solo
           `ALTER TABLE "nutrition_plans" ADD COLUMN "engine_meals_per_day" integer;`.

         **Si sale cualquier otra sentencia, PARAR**: ejecutar
         `git checkout HEAD -- src/db/migrations`, borrar los no rastreados
         que generó y reportar en el impl §R1.
      3. `git mv src/db/migrations/0018_<generado>.sql src/db/migrations/0018_nutrition_plans_engine_meals.sql`.
         En `meta/_journal.json`, la entrada `idx: 18` pasa a
         `"tag": "0018_nutrition_plans_engine_meals"`; el `when` se deja y
         `meta/0018_snapshot.json` no se toca. Si el journal no acababa en
         17, se usa el número real en todo el paso, y también en la regex del
         test, que no lo fija.
      4. `nutrition-plan.entity.ts`: `engineMealsPerDay: number | null` en
         `NutritionPlanProps` y su `readonly` en la clase.
      5. `nutrition.drizzle.repository.ts`, `toPlan`:
         `engineMealsPerDay: row.engineMealsPerDay ?? null`.
      6. `generate-nutrition-plan.use-case.ts`: `engineMealsPerDay: result.mealsPerDay`
         en el insert (forzado por `tsc`; [[design]] D4, clave 4).
      7. `serve-meal.use-case.spec.ts`, fixture `plan(mealTimes)`:
         `engineMealsPerDay: null` (forzado por `tsc`).
      8. Verde: `pnpm test -- nutrition.schema meal-servings.schema serve-meal`,
         `pnpm exec tsc --noEmit` y `pnpm lint`.
- [ ] (3) Refactor con tests verdes — sin commit; R1 no tiene docs propias
      (van en R13). Luego se aplica `0018` según §Orden.

## R2 — `generate` conserva el horario editado mientras el motor no cambie el número de comidas

- [ ] (1) Escribir test que falla para R2 — commit
      `test(meal-schedule-editing): lock carried meal schedule across generate (R2)`.
      Ficheros:
  - `nutrition-plan.entity.ts`: los esqueletos de `engineMealCount` y
    `carriedSchedule` ([[design]] D3), exportados;
  - `domain/entities/nutrition-plan.entity.spec.ts` (**nuevo**), con el
    `describe` R2 y la tabla de 8 filas;
  - `test/meal-times.e2e-spec.ts` (**nuevo**), con la base del fichero
    ([[design]] §E2E), los helpers que usa R2 (`seedUser`, `seedPet` con
    `species`, `putProfile` con overrides, `postWeight` con `weightKg`,
    `generatePlan`, `seedPlan`, `plansOf` e `insertPlanRow`) y el `describe`
    R2.

  Rojo esperado:
  - unit, filas 1, 4, 6 y 7 por matcher;
  - e2e, `it` 1 por matcher;
  - e2e `it` 2 verde (declarado en [[requirements]] R2).

  Pegar las salidas en el impl §R2.
- [ ] (2) Implementación mínima que lo pasa — commit
      `feat(meal-schedule-editing): carry edited meal schedule while engine meal count holds (R2)`:
  - `engineMealCount` y `carriedSchedule` reales;
  - `generate` con `...carriedSchedule(latestPlan, result)` ([[design]] D4,
    clave 3).

  Verde: `pnpm test -- nutrition-plan.entity`,
  `pnpm test:e2e -- meal-times.e2e-spec`, `tsc` y `lint`.
- [ ] (3) Refactor con tests verdes — sin commit si no hay nada que
      refactorizar.

## R3 — `POST /v1/pets/:petId/meal-times` añade una franja como copia nueva del plan

- [ ] (1) Escribir test que falla para R3 — commit
      `test(meal-schedule-editing): lock POST meal-times append-only copy (R3)`:
  - `nutrition-plan.entity.ts`: el esqueleto de `copyWithMealTimes`
    ([[design]] D3);
  - `nutrition-plan.entity.spec.ts`: el `describe` R3;
  - e2e: el helper `addMealTime` y el `describe` R3.

  Rojo: unit `it` 1 por matcher (el `it` 2 puede salir verde: el esqueleto no
  muta); e2e por matcher (`404`).
- [ ] (2) Implementación mínima que lo pasa — commit
      `feat(meal-schedule-editing): add POST meal-times endpoint (R3)`:
  - `copyWithMealTimes` real;
  - `meal.dto.ts`: `EditMealTimeSchema = z.strictObject({ mealTime: z.string() })`
    y `EditMealTimeDto` (la regex llega en R8);
  - `add-meal-time.use-case.ts` (**nuevo**), con el constructor definitivo y
    los pasos 1 y 4 de [[design]] D6;
  - `nutrition.controller.ts`: el handler `addMealTime`, **sin**
    `@RequirePetRole`;
  - `nutrition.module.ts`: el provider.

  Verde: unit, e2e R2-R3, `tsc` y `lint`.
- [ ] (3) Refactor con tests verdes — sin commit si no hay nada que
      refactorizar.

## R4 — `PATCH /v1/pets/:petId/meal-times/:mealTime` mueve una franja como copia nueva del plan

- [ ] (1) Escribir test que falla para R4 — commit
      `test(meal-schedule-editing): lock PATCH meal-times move copy (R4)`.
      En el e2e, el helper `moveMealTime` y el `describe` R4. Rojo por matcher
      (`404`).
- [ ] (2) Implementación mínima que lo pasa — commit
      `feat(meal-schedule-editing): add PATCH meal-times endpoint (R4)`:
  - `move-meal-time.use-case.ts` (**nuevo**), con el constructor definitivo
    `(nutrition, pets, audit)` y los pasos 1 y 5 de [[design]] D6, usando
    `insertPlan`;
  - el handler `moveMealTime`, **sin** `@RequirePetRole`;
  - el provider.

  Verde: e2e R2-R4, `tsc` y `lint`.
- [ ] (3) Refactor con tests verdes — sin commit si no hay nada que
      refactorizar.

## R5 — la servida de hoy se mueve con su franja; los días pasados no

- [ ] (1) Escribir test que falla para R5 — commit
      `test(meal-schedule-editing): lock today's serving moving with its slot (R5)`:
  - `application/use-cases/move-meal-time.use-case.spec.ts` (**nuevo**), con
    el `describe` R5 y la tabla de 5 fechas. Los dobles son objetos con
    `jest.fn()`, con `as unknown as`; el puerto **no** se toca en este commit;
  - e2e: los helpers `serveMeal`, `getPlan`, `addMember`, `insertServing` y
    `servingsOf`, y el `describe` R5. `GET /v1/pets/:id` se llama inline:
    [[design]] §E2E no le da helper.

  Rojo: unit por matcher (se llamó `insertPlan`); e2e `it` 1 por matcher;
  `it` 2 verde (declarado).
- [ ] (2) Implementación mínima que lo pasa — commit
      `feat(meal-schedule-editing): move today's serving with its slot in one transaction (R5)`:
  - `nutrition.repository.ts`: `MealTimeMove` e `insertPlanAndMoveServing`;
  - `nutrition.drizzle.repository.ts`: la transacción de [[design]] D5, con
    los pasos 1, 2 **sin** `notExists`, y 4;
  - `MoveMealTimeUseCase`: los pasos 4 y 5.

  Verde: unit, e2e R2-R5, `tsc` y `lint`.
- [ ] (3) Refactor con tests verdes — sin commit si no hay nada que
      refactorizar.

## R6 — si el destino ya tiene servida hoy, gana la del destino

- [ ] (1) Escribir test que falla para R6 — commit
      `test(meal-schedule-editing): lock destination-wins merge on slot collision (R6)`.
      El `describe` R6 en el e2e. Rojo: `it` 1 por matcher (`500`); `it` 2 y
      3 verdes (declarado).
- [ ] (2) Implementación mínima que lo pasa — commit
      `feat(meal-schedule-editing): merge serving into destination slot on collision (R6)`.
      El `notExists` del paso 2 y el `DELETE` del paso 3 de [[design]] D5.
      Verde: e2e R2-R6.
- [ ] (3) Refactor con tests verdes — sin commit si no hay nada que
      refactorizar.

## R7 — auditoría después de escribir, nunca si falla

- [ ] (1) Escribir test que falla para R7 — commit
      `test(meal-schedule-editing): lock meal_time audit after write (R7)`:
  - `add-meal-time.use-case.spec.ts` (**nuevo**), con el `describe` R7;
  - `move-meal-time.use-case.spec.ts`, con el `describe` R7;
  - e2e: el `describe` R7, que lee `auditLog` con `db.select` inline (sin
    helper nuevo).

  Rojo por matcher en los tres.
- [ ] (2) Implementación mínima que lo pasa — commit
      `feat(meal-schedule-editing): audit meal_time.add and meal_time.move (R7)`.
      El paso de auditoría de [[design]] D6 y D7 en los dos use cases.
- [ ] (3) Refactor con tests verdes — sin commit si no hay nada que
      refactorizar.

## R8 — body inválido responde 400 antes de leer el plan

- [ ] (1) Escribir test que falla para R8 — commit
      `test(meal-schedule-editing): lock strict HH:MM validation on meal-times (R8)`.
      El `describe` R8 en el e2e. Rojo por matcher (E1 de [[requirements]]):
      `'7:30'` da `201` en el `it` 1, `200` en el `it` 2 y `422` en el `it` 3.
- [ ] (2) Implementación mínima que lo pasa — commit
      `feat(meal-schedule-editing): validate meal-times body with strict HH:MM (R8)`.
      `STRICT_MEAL_TIME_PATTERN` y la regex en `EditMealTimeSchema`
      ([[design]] D8).
- [ ] (3) Refactor con tests verdes — sin commit si no hay nada que
      refactorizar.

## R9 — 422 con código propio, en orden y sin persistir

- [ ] (1) Escribir test que falla para R9 — commit
      `test(meal-schedule-editing): lock meal-times 422 codes and order (R9)`.
      El `describe` R9 en los dos specs de use case (por `name`, sin importar
      clases que aún no existen) y en el e2e. Rojo por matcher; los casos sin
      plan salen verdes (declarado).
- [ ] (2) Implementación mínima que lo pasa — commit
      `feat(meal-schedule-editing): reject duplicate and seventh meal times (R9)`:
  - los dos errores de [[design]] D9;
  - `MAX_MEALS_PER_DAY` (D11);
  - los pasos 2-3 de los dos use cases (D6);
  - las dos ramas del mapper.
- [ ] (3) Refactor con tests verdes — sin commit si no hay nada que
      refactorizar.

## R10 — solo el owner edita; el guard responde antes que el body

- [ ] (1) Escribir test que falla para R10 — commit
      `test(meal-schedule-editing): lock owner-only meal-times edits (R10)`.
      El `describe` R10 en el e2e, con `addMember` ampliado con `'vet'`.
      Rojo: `it` 1 por matcher (family `201`); `it` 2 verde (declarado).
- [ ] (2) Implementación mínima que lo pasa — commit
      `feat(meal-schedule-editing): restrict meal-times edits to owner (R10)`.
      `@RequirePetRole('owner')` en los dos handlers.
- [ ] (3) Refactor con tests verdes — sin commit si no hay nada que
      refactorizar.

## R11 — servir, deshacer, el GET del plan y el perfil leen el plan editado (verificación)

- [ ] (1) Escribir test que falla para R11 — commit
      `test(meal-schedule-editing): lock readers on edited plan (R11)`:
  - el `describe` R11 en el e2e (helper `unserveMeal`);
  - **la mutación de producción versionada**: en
    `pet-meals.drizzle-reader.ts`, los dos `desc(` del `orderBy` pasan a
    `asc(`, y el import se ajusta para que `lint` pase.

  Rojo: R11 por matcher (`mealsToday {0,2}`). Arrastra también al rojo
  (E2 de [[requirements]]), todos por matcher sobre `mealsToday`:
  - R5 `it` 1 y R6 `it` 1, 2 y 3 de `test/meal-times.e2e-spec.ts`;
  - R10 `it` 4 de `test/meals.e2e-spec.ts` (#83).

  Correr los dos ficheros y anotar en el impl cada `it` que cae, con su
  línea decisiva. Si cae alguno más, o alguno de estos no cae por matcher,
  parar y reportar.
- [ ] (2) Implementación mínima que lo pasa — commit
      `feat(meal-schedule-editing): restore pet-meals reader order after R11 lock (R11)`.
      Revierte exactamente la mutación. Comprobar
      `git diff <hash del handoff> HEAD -- src/modules/nutrition/infrastructure/repositories/pet-meals.drizzle-reader.ts`
      **vacío**.
- [ ] (3) Refactor con tests verdes — sin commit.

## R12 — la copia conserva `inputsHash` y `aiExplanation`, y `generate` la devuelve (verificación)

- [ ] (1) Escribir test que falla para R12 — commit
      `test(meal-schedule-editing): lock inputsHash and aiExplanation on edited copy (R12)`:
  - el `describe` R12 en el e2e;
  - **la mutación de producción versionada**: en `copyWithMealTimes`,
    `inputsHash: '0'.repeat(64)` y `aiExplanation: null`.

  Rojo: R12 por matcher, y el unit R3 `it` 1 también (declarado).
- [ ] (2) Implementación mínima que lo pasa — commit
      `feat(meal-schedule-editing): restore copyWithMealTimes after R12 lock (R12)`.
      Revierte exactamente la mutación: el diff de `nutrition-plan.entity.ts`
      entre el padre del commit rojo y este verde está vacío.
- [ ] (3) Refactor con tests verdes — sin commit.

## §Sondas — antes de R13

- [ ] Sobre el árbol verde de R12, con `git status --porcelain` vacío, correr
      S1-S20 de [[requirements]] §Sondas **una a una**. Para cada una:
  1. aplicar la mutación;
  2. correr solo los ficheros de su «Exigido»;
  3. anotar la línea decisiva;
  4. revertir con `git checkout HEAD -- <fichero>`;
  5. comprobar `git status --porcelain` y `git diff --cached` vacíos.

  En el impl §Sondas, una tabla `| Sonda | Mutación | Ficheros corridos | Resultado | Exigido cumplido | Otros rojos |`.
  El «Exigido» es un mínimo (E2 de [[requirements]]). Un rojo por matcher
  en otro `it` va a «Otros rojos» y no para el trabajo. Hay que **parar y
  reportar**, sin ajustar la sonda ni el test, si pasa cualquiera de estas
  tres cosas (criterio al pie de [[requirements]] §Sondas):
  - falta un rojo exigido, o no es por matcher;
  - cae un verde declarado (S3, S8);
  - aparece cualquier rojo que no sea por matcher.

  Ninguna sonda se commitea.

## R13 — la migración se aplica, es idempotente, y el árbol queda verde y documentado (verificación)

- [ ] (a) Evidencia, desde `backend-pet-tracker/`, todo pegado en el impl
      §R13:
  1. `pnpm db:migrate`, exit 0. Si ya se aplicó en §Orden, la salida dice
     que no hay nada pendiente.
  2. `pnpm db:migrate` otra vez: exit 0, sin aplicar nada.
  3. `docker exec pet-tracker-postgres psql -U pet_tracker -d <BASE> -Atc "select column_name, data_type, is_nullable from information_schema.columns where table_name = 'nutrition_plans' and column_name = 'engine_meals_per_day'"`
     → `engine_meals_per_day|integer|YES`.
  4. `… -Atc "select count(*) from drizzle.__drizzle_migrations"` → el
     recuento de §0 + 1 (19).
  5. `pnpm db:generate`, y luego `git status --porcelain src/db/migrations`
     → vacío.
  6. `node -e "console.log(require('./src/db/migrations/meta/_journal.json').entries.length)"`
     → 19, frente a
     `git show origin/main:backend-pet-tracker/src/db/migrations/meta/_journal.json | node -e "let s='';process.stdin.on('data',d=>s+=d).on('end',()=>console.log(JSON.parse(s).entries.length))"`
     → 18.
  7. `pnpm test`: **174** suites y la línea base + 28 tests (1335 sobre
     1307).
  8. `pgrep` limpio, `pnpm test:e2e`: **31** ficheros (28 corren + 3 skipped)
     y la línea base + 22 tests (429 sobre 407).
  9. `pgrep` limpio, `./init.sh` desde la raíz, exit 0 medido **sin pipe**.
- [ ] (b) Commit
      `docs(meal-schedule-editing): document engine_meals_per_day and amend #83 D4 (R13)`,
      con el texto literal de [[design]] §Docs en `docs/data-model.md`,
      `docs/conventions.md` y `specs/meals-served-tracking/design.md`.
- [ ] (c) Commit `docs(meal-schedule-editing): fill #103 traceability`:
      todas las filas de [[traceability]] con sus hashes rojo, verde y docs.
      **No rebasear** después: invalida los hashes.

## Cierre

- [ ] `git diff --stat <hash del handoff>..HEAD` solo toca ficheros de la
      lista cerrada de [[design]] §Archivos afectados. Cualquier otro se
      justifica en el impl o se revierte.
- [ ] `progress/impl_meal-schedule-editing.md` completo: §Base, R1-R13 (rojos
      y verdes con su línea decisiva) y §Sondas. Es su propio commit
      `docs(meal-schedule-editing): add implementation report`, o va en el de
      (c).
- [ ] **No** abrir PR ni mergear: lo hace el leader tras el veredicto del
      `reviewer`. Nota para el cuerpo de la PR: tras el merge, el leader
      aplica `0018` con `pnpm db:migrate` a la otra base Postgres del VPS
      ([[design]] §Aplicación de la migración en dos bases).

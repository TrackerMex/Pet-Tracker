---
feature: "meals-served-tracking"
status: draft        # draft | approved
tags: [harness, spec]
---

# Tareas — [[meals-served-tracking]]

> Disciplina TDD. Cada tarea corresponde a un requisito de [[requirements]] y
> tiene siempre los mismos 3 sub-items, en este orden.
>
> **Commits test-primero, obligatorio** (C4 de `CHECKPOINTS.md`): el (1) de
> cada R es su propio commit `test(meals-served-tracking): … (R<n>)` y se
> deja en **rojo**; el (2) es el commit `feat(meals-served-tracking): … (R<n>)`
> que lo pone verde; el (3), si hay docs, es `docs(meals-served-tracking): … (R<n>)`.
> Un solo commit con test + implementación + docs incumple C4 (pasó en #19).
> R12 es requisito de verificación (C4 vía (b)) declarado en [[requirements]]:
> no tiene commit de test.
>
> **Títulos de test con sufijo de feature**: `describe('R<n> (meals-served-tracking #83): …')`,
> literalmente los de [[requirements]]. El módulo `nutrition` ya acumula
> R15-R27 de #17 y `pets` R1-R16 de #5; sin sufijo, C4 no es verificable por
> grep (`docs/conventions.md:157-178`).
>
> **Sujeto presente**: cada test rojo nombra solo helpers y símbolos que
> existen en `fba736f9` o el artefacto que su propio verde crea (el fichero
> de schema/entidad/use case bajo prueba: precedente #44 R12, #93 R1). Los
> e2e de R2-R10 se escriben **todos** contra `test/meals.e2e-spec.ts` y
> necesitan la tabla en `pet_tracker_wt`: el commit rojo de R2 crea el fichero
> con los fixtures de [[design]] §E2E y el `describe` de R2; cada R siguiente
> añade su `describe`. Hasta que R1 esté verde **y** la migración aplicada
> (R12 paso c, que se adelanta justo después de R1: ver §Orden) la suite cae
> por `relation "meal_servings" does not exist`; ese no es el rojo que
> demuestra el candado. **El rojo legítimo de cada R e2e es el `404`
> (ruta inexistente) o la aserción sobre la clave ausente**, y se registra en
> el impl con la migración ya aplicada y R1 verde.
>
> **Suites**: desde `backend-pet-tracker/`: `pnpm test` (unit), `pnpm exec tsc
> --noEmit`, `pnpm lint`, `pnpm test:e2e` (Postgres; `meals` no toca
> LocalStack pero la suite completa sí). Un fichero: `pnpm test -- meal-servings.schema`,
> `pnpm test:e2e -- meals.e2e-spec`. `./init.sh` desde la raíz es el cierre;
> exit code medido **sin pipe** (memoria `exit-code-tras-pipe`).
>
> **Postgres propio, LocalStack compartido**: este worktree usa
> `pet_tracker_wt` (`DATABASE_URL` del `.env` del worktree), así que
> `pnpm db:migrate` y `pnpm test:e2e -- meals.e2e-spec` no necesitan aviso.
> Antes de `pnpm test:e2e` completo o `./init.sh`:
> `pgrep -af 'init\.sh|test:e2e|jest-e2e' | grep -v pgrep` limpio (la otra
> sesión comparte LocalStack `:4566`). Consultas a la base:
> `docker exec pet-tracker-postgres psql -U pet_tracker -d pet_tracker_wt -Atc "…"`
> (no `docker compose exec`: no funciona desde el worktree).

---

## §0 — Antes de la primera tarea

- [ ] Verificar branch y worktree: `git branch --show-current` =
      `feature/83-meals-served-tracking` en
      `/home/claude/sites/Pet-Tracker-wt-backend` (HEAD `fba736f9` o hijo).
      **No** tocar `/home/claude/sites/Pet-Tracker` (otra sesión).
- [ ] Leer [[requirements]] §0 (C1: seis listas de claves; C2: sin índice
      `(pet_id, served_on)`; C4/C5: `servedToday` solo en el `GET`, por el
      repositorio propio; C6: 422 antes que 409), §Contrato HTTP y [[design]]
      D1-D12.
- [ ] Verificar la base propia: desde `backend-pet-tracker/`,
      `grep -c 'localhost:5433/pet_tracker_wt' ../.env` → `1` (sin imprimir
      la línea), y
      `docker exec pet-tracker-postgres psql -U pet_tracker -d pet_tracker_wt -Atc "select count(*), max(created_at) from drizzle.__drizzle_migrations"`
      → el `max` es el `when` de la última entrada de `meta/_journal.json`
      (`0016_drop_devices_connectivity`). Si no cuadra, **parar** y avisar.
- [ ] Crear `progress/impl_meals-served-tracking.md` con secciones R1…R12
      vacías.
- [ ] Línea base: `pgrep` de cabecera limpio → `./init.sh` desde la raíz,
      exit 0 sin pipe. Debe ser verde antes de tocar nada.

## §Orden

R1 → (aplicar migración a `pet_tracker_wt`: paso c de R12, sin evidencia
todavía) → R11 → R2 → R6 → R4 → R5 → R7 → R3 → R8 → R9 → R10 → R12
(evidencia completa). R11 va antes que R2 porque `servedInPlan` es sujeto de
R9/R10 y el entity file también define `MealServing`, sujeto de R2. R7 va
antes que R3 porque R3 asevera el `DELETE` del `walker` (`204`) y ese handler
lo crea R7.

---

## R1 — tabla `meal_servings`, migración nueva y fila en `docs/data-model.md`

- [ ] (1) Escribir test que falla para R1 — commit
      `test(meals-served-tracking): lock meal_servings schema and migration (R1)`,
      solo `src/db/schema/meal-servings.schema.spec.ts` (nuevo, calcado de
      `weights.schema.spec.ts:1-91`; contenido en [[requirements]] R1). Rojo
      esperado en `pnpm test -- meal-servings.schema`: `mealServings` no se
      exporta de `./nutrition.schema` (falla el import) y no hay migración.
      Pegar el fragmento en el impl §R1.
- [ ] (2) Implementación mínima que lo pasa — commit
      `feat(meals-served-tracking): add meal_servings table and migration (R1)`,
      en este orden:
      1. `src/db/schema/nutrition.schema.ts`: imports `date`, `uniqueIndex`
         (de `drizzle-orm/pg-core`) y `users` (`./users.schema`); `export
         const mealServings` literal de [[design]] D5, al final del fichero.
      2. `pnpm db:generate` desde `backend-pet-tracker/`. Comprobar:
         `ls src/db/migrations/0017_*.sql` → **un** fichero; `cat` → solo
         `CREATE TABLE "meal_servings" (...)`, dos `ALTER TABLE "meal_servings"
         ADD CONSTRAINT … FOREIGN KEY`, `CREATE UNIQUE INDEX
         "meal_servings_pet_id_served_on_meal_time_idx"`, `CREATE INDEX
         "meal_servings_created_by_idx"`. **Cualquier otra sentencia: PARAR**,
         `git checkout -- src/db/migrations`, reportar en el impl §R1.
      3. `git mv src/db/migrations/0017_<generado>.sql src/db/migrations/0017_meal_servings.sql`;
         en `meta/_journal.json`, la entrada `idx: 17` pasa a
         `"tag": "0017_meal_servings"` (el `when` se deja). `meta/0017_snapshot.json`
         no se toca. (Si el journal ya no acaba en 16, usar el número real en
         todo el paso.)
      4. Verde: `pnpm test -- meal-servings.schema`, `pnpm exec tsc --noEmit`,
         `pnpm lint`. `nutrition.schema.spec.ts` sigue verde sin tocarlo.
- [ ] (3) Refactor con tests verdes — commit
      `docs(meals-served-tracking): add meal_servings to data-model (R1)`:
      `docs/data-model.md:37` (ERD), fila tras `:63` y `:68` con el texto
      literal de [[design]] §Docs. Fila R1 de [[traceability]] con los tres
      hashes.
- [ ] **Aplicar la migración ahora** (adelanto del paso c de R12, sin
      evidencia formal todavía): `pnpm db:migrate` desde `backend-pet-tracker/`
      → exit 0. Sin esto la suite e2e de R2-R10 no puede ponerse en rojo
      legítimo.

## R11 — D4 en una función pura: `servedInPlan(mealTimes, served)`

- [ ] (1) Escribir test que falla para R11 — commit
      `test(meals-served-tracking): lock servedInPlan order and exclusion (R11)`,
      `src/modules/nutrition/domain/entities/meal-serving.entity.spec.ts`
      (cuatro `it` de [[requirements]] R11). Rojo: el módulo no existe.
- [ ] (2) Implementación mínima que lo pasa — commit
      `feat(meals-served-tracking): add MealServing entity and servedInPlan (R11)`:
      `meal-serving.entity.ts` con `MealServingProps`, `MealServing`
      (`Object.assign`, como `weight.entity.ts:9-19`) y `servedInPlan`
      ([[design]] D8). Verde: `pnpm test -- meal-serving.entity`.
- [ ] (3) Refactor con tests verdes — ninguno. Fila R11 de [[traceability]].

## R2 — `POST …/meals` inserta con el día civil del owner y responde el shape congelado

- [ ] (1) Escribir test que falla para R2 — commit
      `test(meals-served-tracking): require POST meals with owner local day (R2)`:
      `test/meals.e2e-spec.ts` **nuevo** con cabecera, fixtures y helpers de
      [[design]] §E2E y el `describe` de R2 (dos `it`). Rojo esperado en
      `pnpm test:e2e -- meals.e2e-spec` (migración ya aplicada): `404` de
      Nest (ruta inexistente) en vez de `201`. Pegar en el impl §R2.
- [ ] (2) Implementación mínima que lo pasa — commit
      `feat(meals-served-tracking): serve meal endpoint (R2)`:
      - `src/modules/nutrition/domain/repositories/meal-serving.repository.ts`
        (token, `NewMealServing`, interface con `create`, `deleteOne`,
        `listTimesServedOn`).
      - `src/modules/nutrition/domain/errors/nutrition.errors.ts`: las cuatro
        clases de [[design]] D7 (aunque R2 solo necesita el camino feliz, van
        juntas: son el contrato del repositorio).
      - `src/modules/nutrition/application/dto/meal.dto.ts` (D6).
      - `src/modules/nutrition/application/use-cases/serve-meal.use-case.ts`
        (D7, completo: plan, pertenencia, día, create, auditoría — los R
        siguientes lo **prueban**, no lo amplían).
      - `src/modules/nutrition/infrastructure/repositories/meal-serving.drizzle.repository.ts`
        (D11: `create` con `onConflictDoNothing` + `returning`, `deleteOne`,
        `listTimesServedOn`, `toDomain`).
      - `src/modules/nutrition/infrastructure/mappers/nutrition.mapper.ts`:
        `MealServingResponse` + `toMealServingResponse`.
      - `src/modules/nutrition/infrastructure/mappers/nutrition-error.mapper.ts`:
        los cuatro `if` nuevos (D7).
      - `src/modules/nutrition/infrastructure/meals.controller.ts`
        (`MealsController` **solo** con `@Post()`; el `@Delete(':mealTime')`
        lo añade R7 — así el rojo de R7 es la ruta ausente, sin mutación).
      - `src/modules/nutrition/nutrition.module.ts`: controller, use case,
        provider del repositorio.
      Verde: `pnpm test:e2e -- meals.e2e-spec` (solo el `describe` R2),
      `tsc`, `lint`, `pnpm test`.
- [ ] (3) Refactor con tests verdes — ninguno. Fila R2 de [[traceability]].

## R6 — body inválido: 400 sin persistir ni consultar el plan

- [ ] (1) Escribir test que falla para R6 — commit
      `test(meals-served-tracking): require 400 on invalid meal body (R6)`:
      `describe` R6 en `test/meals.e2e-spec.ts`. **Rojo legítimo**: si R2 ya
      dejó `z.strictObject` con la regex, este test nace verde. Para que el
      rojo sea real, el commit rojo lleva la **mutación de producción**
      (C4, quinto punto): en `meal.dto.ts` sustituir temporalmente
      `z.strictObject` por `z.object` y la regex por `z.string()`; el verde la
      revierte. Registrar ambos hashes en el impl §R6.
- [ ] (2) Implementación mínima que lo pasa — commit
      `feat(meals-served-tracking): strict meal body validation (R6)`:
      revertir la mutación (deja `meal.dto.ts` como D6). Verde.
- [ ] (3) Refactor con tests verdes — ninguno. Fila R6.

## R4 — sin plan o franja fuera del plan: 422 sin persistir ni auditar

- [ ] (1) Escribir test que falla para R4 — commit
      `test(meals-served-tracking): require 422 without plan or off-plan meal time (R4)`:
      `src/modules/nutrition/application/use-cases/serve-meal.use-case.spec.ts`
      (nuevo; dobles de [[requirements]] R4; `describe` R4) y `describe` R4
      en `test/meals.e2e-spec.ts`. Rojo legítimo por **mutación de
      producción** en el commit rojo: en `serve-meal.use-case.ts` quitar
      temporalmente las dos comprobaciones (`if (!plan)` y `includes`) — sin
      ellas el insert sigue y el unit espera `rejects`; el verde las
      restaura.
- [ ] (2) Implementación mínima que lo pasa — commit
      `feat(meals-served-tracking): validate plan and meal time before serving (R4)`:
      restaurar D7. Verde: `pnpm test -- serve-meal.use-case`,
      `pnpm test:e2e -- meals.e2e-spec`.
- [ ] (3) Refactor con tests verdes — ninguno. Fila R4.

## R5 — misma franja el mismo día: 409; otro día sí

- [ ] (1) Escribir test que falla para R5 — commit
      `test(meals-served-tracking): require 409 on duplicate serving per day (R5)`:
      `describe` R5 en `test/meals.e2e-spec.ts`. Mutación de producción para
      el rojo: en `meal-serving.drizzle.repository.ts` quitar temporalmente el
      `if (!row) throw …` y devolver `toDomain(row)` con `row` indefinido
      **no** sirve (explota con otro error); la mutación honesta es quitar
      `.onConflictDoNothing(...)`: el segundo insert lanza `23505` sin
      traducir → `500`, y el `it` que espera `409` con `code` cae por su
      aserción. El verde lo restaura.
- [ ] (2) Implementación mínima que lo pasa — commit
      `feat(meals-served-tracking): translate duplicate serving to 409 (R5)`:
      restaurar D11. Verde.
- [ ] (3) Refactor con tests verdes — ninguno. Fila R5.

## R7 — `DELETE …/meals/:mealTime` deshace la franja de hoy o responde 404

- [ ] (1) Escribir test que falla para R7 — commit
      `test(meals-served-tracking): require DELETE of today's serving (R7)`:
      `src/modules/nutrition/application/use-cases/unserve-meal.use-case.spec.ts`
      (nuevo; `describe` R7) y `describe` R7 en `test/meals.e2e-spec.ts`.
      Rojo legítimo sin mutación: el use case no existe (falla el import del
      unit) y la ruta responde `404` de Nest en vez de `204` (R2 solo creó el
      `@Post()`).
- [ ] (2) Implementación mínima que lo pasa — commit
      `feat(meals-served-tracking): unserve meal endpoint (R7)`:
      `unserve-meal.use-case.ts` (D7), `@Delete(':mealTime') @HttpCode(HttpStatus.NO_CONTENT)`
      en `MealsController` (D12), provider en el módulo. Verde:
      `pnpm test -- unserve-meal.use-case`, `pnpm test:e2e -- meals.e2e-spec`.
- [ ] (3) Refactor con tests verdes — ninguno. Fila R7.

## R3 — cualquier miembro activo sirve y deshace; 404 del guard precede

- [ ] (1) Escribir test que falla para R3 — commit
      `test(meals-served-tracking): require any active member can serve and undo (R3)`:
      `describe` R3 en `test/meals.e2e-spec.ts`. Los dos handlers ya existen
      sin `@RequirePetRole` (D2 desde R2/R7), así que el rojo legítimo es por
      **mutación de producción** (C4, quinto punto): en el commit rojo añadir
      temporalmente `@RequirePetRole('owner')` a `serve` y a `unserve` en
      `meals.controller.ts` → `family` recibe `403` en `POST` y `walker` `403`
      en `DELETE`; el `it` (a) cae por su aserción. El `it` (b) (outsider y
      `not-a-uuid` → `404`) nace verde: es el guard existente. Registrar ambos
      hashes en el impl §R3.
- [ ] (2) Implementación mínima que lo pasa — commit
      `feat(meals-served-tracking): open meals routes to every active member (R3)`:
      revertir la mutación (quitar los dos `@RequirePetRole`). Verde.
- [ ] (3) Refactor con tests verdes — ninguno. Fila R3.

## R8 — auditoría `meal.serve` y `meal.unserve` tras escribir

- [ ] (1) Escribir test que falla para R8 — commit
      `test(meals-served-tracking): require meal.serve and meal.unserve audit (R8)`:
      `describe` R8 en `serve-meal.use-case.spec.ts`, en
      `unserve-meal.use-case.spec.ts` y en `test/meals.e2e-spec.ts`. Mutación
      de producción en el rojo: cambiar temporalmente `action: 'meal.serve'`
      por `'meal.create'` y `'meal.unserve'` por `'meal.delete'` (el `record`
      exacto y el `toMatchObject` del e2e caen por su aserción). El verde lo
      restaura.
- [ ] (2) Implementación mínima que lo pasa — commit
      `feat(meals-served-tracking): audit meal serve and unserve (R8)`. Verde.
- [ ] (3) Refactor con tests verdes — ninguno. Fila R8.

## R9 — `GET nutrition-plan` devuelve `servedToday`; `generate` no cambia

- [ ] (1) Escribir test que falla para R9 — commit
      `test(meals-served-tracking): require servedToday on GET nutrition-plan (R9)`:
      `describe` R9 en `test/meals.e2e-spec.ts` **y** el delta de
      `test/nutrition.e2e-spec.ts:478` (`{ ...second.body, servedToday: [] }`).
      Rojo legítimo: el `GET` no devuelve la clave (aserción de claves y el
      `toEqual` de `:478` caen).
- [ ] (2) Implementación mínima que lo pasa — commit
      `feat(meals-served-tracking): expose servedToday on nutrition plan (R9)`:
      `get-nutrition-plan.use-case.ts` (`execute(petId, now)`, `NutritionPlanToday`,
      inyecta `MEAL_SERVING_REPOSITORY` y `PET_REPOSITORY`),
      `nutrition.mapper.ts` (`NutritionPlanTodayResponse`,
      `toNutritionPlanTodayResponse`), `nutrition.controller.ts:86-97`
      (`latestPlan`). `generate` **no** se toca. Verde:
      `pnpm test:e2e -- meals.e2e-spec` y `pnpm test:e2e -- nutrition.e2e-spec`
      (R19 intacto, R24 con el delta).
- [ ] (3) Refactor con tests verdes — ninguno. Fila R9.

## R10 — `GET /v1/pets/:petId` devuelve `mealsToday`; el listado no se enriquece

- [ ] (1) Escribir test que falla para R10 — un solo commit
      `test(meals-served-tracking): require mealsToday on pet profile (R10)`
      con **todo** lo de [[requirements]] R10 §Test: mapper spec (`:34`,
      `:37-64`, `:67-74`), `get-pet.use-case.spec.ts` (`buildDeps`, diez
      constructores, `describe` R10), `pets.controller.spec.ts` (`:164-191`,
      `:195`), las cuatro listas e2e (`pets`, `devices` + comentario `:794`,
      `device-subscriptions`, `pet-lost-mode`) y el `describe` R10 en
      `test/meals.e2e-spec.ts`. Rojo legítimo: `toEqual` de claves recibe 24
      y espera 25; `PetMealsReader` no existe (`tsc`). El fichero
      `src/modules/pets/domain/ports/pet-meals-reader.ts` es artefacto bajo
      prueba: **no** se crea en el rojo.
- [ ] (2) Implementación mínima que lo pasa — commit
      `feat(meals-served-tracking): add mealsToday to pet profile via PET_MEALS_READER (R10)`:
      `pet-meals-reader.ts` (D9), `pet-meals.drizzle-reader.ts`,
      `pet-meals-read.module.ts`, `pets.module.ts` (import),
      `get-pet.use-case.ts` (quinto puerto, `PetProfile.mealsToday`),
      `pet-profile-response.mapper.ts` (clave + séptimo parámetro),
      `pets.controller.ts:101-113` (`mealsToday` al mapper). Verde:
      `pnpm test` (mapper, use case, controller), `tsc`, `lint`, y con el
      `pgrep` limpio `pnpm test:e2e` **completo** (las cuatro listas y
      `meals`).
- [ ] (3) Refactor con tests verdes — ninguno. Fila R10.

## R12 — migración aplicada, idempotente, árbol verde y documentado (verificación, C4 vía (b))

- [ ] (1) Escribir test que falla para R12 — no aplica (verificación; D10).
- [ ] (2) Implementación mínima que lo pasa — desde `backend-pet-tracker/`;
      pegar **cada salida** en el impl §R12. (Si el adelanto tras R1 ya aplicó
      la migración, a) y e) muestran el estado posterior: anotar que c) ya se
      corrió tras R1 y repetirlo aquí como idempotencia.)
      ```sh
      # a) journal (esperado: <n>|<when de la última entrada del journal>)
      docker exec pet-tracker-postgres psql -U pet_tracker -d pet_tracker_wt -Atc "select count(*), max(created_at) from drizzle.__drizzle_migrations"
      # b) tabla (esperado: 0 antes de aplicar; 1 después)
      docker exec pet-tracker-postgres psql -U pet_tracker -d pet_tracker_wt -Atc "select count(*) from information_schema.tables where table_schema='public' and table_name='meal_servings'"
      # c) aplicar; exit 0 medido sin pipe
      pnpm db:migrate
      # d) repetir (b) → 1;  e) repetir (a) → una fila más, max = when de 0017_meal_servings
      # f) idempotencia: exit 0, (a) y (b) iguales
      pnpm db:migrate
      # g) snapshot y schema coinciden: sin salida
      pnpm db:generate && git status --porcelain src/db/migrations
      ```
      Luego, con el `pgrep` de cabecera limpio: `pnpm test:e2e` completo
      verde (30 suites, `meals.e2e-spec` en la lista, 3 `aws-real` skipped) y
      `./init.sh` desde la raíz, exit 0 **sin pipe**. Si (g) crea algo,
      `git clean -f src/db/migrations`, reportar y parar.
- [ ] (3) Refactor con tests verdes — commit
      `docs(meals-served-tracking): count meals e2e suite in conventions (R12)`:
      `docs/conventions.md:295` "14 de las **30** suites e2e lo tocan" y
      `:303` "Las otras **16** solo tocan Postgres". Fila R12 de
      [[traceability]] apunta a §R12 del impl.

---

## Cierre

- [ ] [[traceability]] sin filas "pendiente"; `feature_list.json` #83 sigue
      `in_progress` (lo pasa a `done` el leader con el veredicto del reviewer,
      R12 cerrado **y** el smoke del §Gate humano registrado).
- [ ] `progress/impl_meals-served-tracking.md` completo: hashes rojo/verde
      por R, qué rojo (ruta ausente / aserción / mutación revertida) se usó en
      cada e2e, salida de `db:generate` (R1), salidas a-g + e2e + `init.sh`
      (R12).
- [ ] `git log --oneline origin/main..HEAD`: por cada R un `test(...)` antes
      de su `feat(...)`; `docs(...)` en R1 y R12; nada más de código.
- [ ] `git diff --stat origin/main` lista solo los ficheros de [[design]]
      §Archivos afectados. `mobile-pet-tracker/` sin cambios.
- [ ] Push de la branch y `gh pr create` hacia `main`. El PR avisa en su body:
      "migración `0017_meal_servings` **aditiva**; aplicar en la base
      compartida `pet_tracker` con `pnpm db:migrate` desde el tree principal
      tras el merge (`specs/meals-served-tracking/design.md` §Aplicación de la
      migración en dos bases); #98 la necesita aplicada antes de su smoke".

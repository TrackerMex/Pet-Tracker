# review: meals-served-tracking (#83)

Fecha: 2026-09-15T19:05Z
Veredicto: **APROBADO**

Revisado sobre el worktree `/home/claude/sites/Pet-Tracker-wt-backend`, rama
`feature/83-meals-served-tracking`, HEAD `4a1713c3`, base `origin/main`
`0e4aa810` (ya mergeada en la rama), árbol limpio antes y después de la
revisión (`git status --porcelain` vacío al final). Base propia
`pet_tracker_wt` (Postgres 5433); la base compartida `pet_tracker` no se tocó.
El reviewer no editó código: las sondas de mutación se hicieron con copia en
el scratchpad y `cp` de vuelta, y los commits rojos se ejecutaron en un
worktree temporal desechable (`git worktree add … <hash>` + `remove`).

## Checklist C2 — Estado coherente

- [x] Solo 1 feature `in_progress`: `feature_list.json` → `[(83, 'meals-served-tracking')]`
- [x] `progress/current.md` describe la sesión activa (#83, worktree, base
      `pet_tracker_wt`, fase in_progress, siguiente paso "lanzar reviewer")

## Checklist C3 — Arquitectura

- [x] domain sin imports de infrastructure: `meal-serving.entity.ts` no
      importa nada; `meal-serving.repository.ts` solo `import type` de la
      entidad; `pet-meals-reader.ts` sin imports; las 4 clases nuevas de
      `nutrition.errors.ts` extienden `Error`
- [x] contratos en domain son interfaces puras (`MealServingRepository`,
      `PetMealsReader`, `NewMealServing`, `PetMealsToday`)
- [x] application depende de tokens/interfaces: `ServeMealUseCase`,
      `UnserveMealUseCase` y `GetNutritionPlanUseCase` inyectan
      `NUTRITION_REPOSITORY`, `MEAL_SERVING_REPOSITORY`, `PET_REPOSITORY`,
      `AUDIT_LOGGER` y usan `ownerLocalDay` (application de pets), sin
      Drizzle ni HTTP
- [x] infrastructure implementa domain: `MealServingDrizzleRepository
      implements MealServingRepository`, `PetMealsDrizzleReader implements
      PetMealsReader`; `MealsController` solo parsea, delega y mapea errores
- [x] `PetMealsReadModule` no importa `PetsModule` ni `NutritionModule` (sin
      ciclo); `PetsModule` lo importa junto a `PetVaccineReadModule`

## Checklist C4 — TDD

- [x] Cada R1..R11 tiene `describe('R<n> (meals-served-tracking #83): …')`
      con el título literal de requirements.md: R1
      `meal-servings.schema.spec.ts:21`; R2/R6/R4/R5/R7/R3/R8/R9/R10
      `test/meals.e2e-spec.ts:149,198,228,281,340,390,425,469,508`; R4/R8
      `serve-meal.use-case.spec.ts:57,79`; R7/R8
      `unserve-meal.use-case.spec.ts:11,29`; R10 `get-pet.use-case.spec.ts`
      (describe nuevo) + mapper spec y controller spec (listas a 25 claves);
      R11 `meal-serving.entity.spec.ts:3`. R12 es de verificación (C4 vía b),
      declarado en la spec antes del handoff.
- [x] Historial test-primero: 25 commits en `e73dcd7b..HEAD`, un
      `test(...)` antes de cada `feat(...)` para los 11 R, `docs(...)` en R1
      y R12. Todos los hashes de traceability.md existen y son ancestros de
      HEAD (26/26 `git merge-base --is-ancestor` OK, firma `84804302`
      incluida).
- [x] Rojos ejecutados por mí en worktree temporal (jest con `node_modules`
      enlazado):
  - R1 `4a0e3d8c`: `TypeError: Cannot read properties of undefined (reading 'Symbol(drizzle:Columns)')`, `Tests: 0 total`, exit 1 (artefacto bajo prueba: `mealServings` no exportado; permitido).
  - R11 `28bf18c1`: `Cannot find module './meal-serving.entity'`, exit 1 (módulo inexistente; permitido).
  - R4 `da648574`: `Received promise resolved instead of rejected` ×2, `Tests: 2 failed, 2 total` — rojo por aserción con la mutación de producción versionada (las dos comprobaciones quitadas; `54ec03e0` las restaura, 5+/1-).
  - R7 `7045bd74`: unit `Cannot find module './unserve-meal.use-case'`; en ese commit no existe `unserve-meal.use-case.ts` y `meals.controller.ts` no tiene `@Delete` (0 coincidencias) → el e2e cae por `404` de ruta ausente, como declara el impl.
  - R8 `1c75a22c`: `Tests: 2 failed, 4 passed` con `"action": "meal.create"` / `"meal.delete"` recibidos — mutación de literales versionada en el rojo, `20af799b` la revierte (2+/2-).
  - R10 `e7b89ccd`: `Tests: 5 failed, 32 passed, 37 total` (mapper "serializa las 25 claves", "…mealsToday estan presentes con null"; controller "mantiene exactamente las 25 claves…"; get-pet R10 ×2 con `Expected: PET_ID, "2026-08-09" / Received: undefined`), y **`pnpm exec tsc --noEmit` exit 0 en ese mismo commit**: rojo por aserciones, no por tipos, gracias al alias tipado del constructor que `fdabd079` sustituye por el puerto real.
- [x] Rojos evidentes por inspección del árbol en el commit test:
  - R2 `11d35b0a`: solo añade `test/meals.e2e-spec.ts`; `meals.controller.ts` no existe en ese commit (0 en `git ls-tree`) → `404` en vez de `201`.
  - R5 `4c565d9d`: quita `.onConflictDoNothing({...})` del repositorio (7-) → el segundo insert lanza `23505` sin traducir (`500` ≠ `409`); `1648120f` lo restaura (7+).
  - R6 `a832d69b`: `z.strictObject` + regex → `z.object` + `z.string()`; `ef070cbb` revierte.
  - R3 `1581848a`: añade `@RequirePetRole('owner')` a `serve` y `unserve`; `e0c84837` los quita (3-).
  - R9 `1f006d8a`: añade el describe R9 y el delta de `nutrition.e2e-spec.ts:478` (`{ ...second.body, servedToday: [] }`); en ese commit `nutrition.controller.ts` y `get-nutrition-plan.use-case.ts` no contienen `servedToday` (0 coincidencias).
- [x] Ningún rojo por `ReferenceError` de helper ni por mutación del doble:
      las mutaciones de R3/R4/R5/R6/R8 son de producción y viven en el commit rojo.
- [x] Los `feat` que tocan ficheros de test (`d77745fe`, `fdabd079`) solo
      reformatean (prettier via `lint --fix`) y, en R10, cambian el alias
      `GetPetUseCaseWithMeals` por `GetPetUseCase` + `PetMealsReader` real;
      ninguna aserción cambia.

## Checklist C5 — Trazabilidad

- [x] `traceability.md` sin filas "pendiente" (la única aparición es la frase de la regla, línea 28)
- [x] 12 filas con test y commit; formato `test|feat|docs(meals-served-tracking): … (R<n>)` en los 25 commits

## Checklist C6 — Spec aprobada

- [x] `requirements.md` `status: approved`, casilla `[X] Aprobado por humano (fecha: 2026-09-15)`, firma `84804302`
- [x] Después de la firma solo cambió el frontmatter `draft → approved` de
      requirements/design/tasks en `e73dcd7b` (leader); ningún requisito editado

## Checklist C7 — Sin código huérfano

- [ ] N/A — la feature no reemplaza nada existente (`GET nutrition-plan` gana una clave por un tipo derivado; `generate` intacto)

## Drift (punto 2 del encargo)

`git diff --stat e73dcd7b HEAD` (rango de Codex): 41 ficheros, todos dentro
de design.md §Archivos afectados más `progress/impl_meals-served-tracking.md`
y `traceability.md`. Grep de rutas prohibidas (`mobile-pet-tracker/`,
`init.sh`, `init.config.sh`, `.github/`, `.env.example`, migraciones
`0000..0016`, `pet.repository.ts`, `pet.drizzle.repository.ts`,
`generate-nutrition-plan.use-case.ts`, `nutrition.drizzle.repository.ts`,
`nutrition.repository.ts`, `app.module.ts`, `src/workers`, `schema/index.ts`)
→ `(none)`. Los ficheros de harness que aparecen en `git diff origin/main`
(`STATUS.md`, `feature_list.json`, `progress/current.md`, explore, handoff,
specs) son de los commits del leader previos a `e73dcd7b`, no de Codex.

Migración: exactamente `0017_meal_servings.sql` + `meta/0017_snapshot.json` +
entrada `{idx: 17, tag: "0017_meal_servings", when: 1789493838553}` (journal
con 18 entradas). El `.sql` contiene `CREATE TABLE "meal_servings"`, dos
`ALTER TABLE "meal_servings" ADD CONSTRAINT … FOREIGN KEY`, `CREATE UNIQUE
INDEX "meal_servings_pet_id_served_on_meal_time_idx"` y `CREATE INDEX
"meal_servings_created_by_idx"`; ningún `ALTER TABLE` de `pets`,
`nutrition_plans` ni `nutrition_profiles`. El schema literal coincide con
design.md D5 (imports `date`, `uniqueIndex`, `users`).

## Candados (punto 3)

Se movieron solo los de la tabla "Se mueven": las seis listas de claves del
perfil a 25 (`pet-profile-response.mapper.spec.ts`, `pets.controller.spec.ts`,
`test/pets.e2e-spec.ts`, `test/devices.e2e-spec.ts` con su comentario "25
claves", `test/device-subscriptions.e2e-spec.ts`,
`test/pet-lost-mode.e2e-spec.ts`), las aserciones `toBeNull()` de
`mealsToday` en mapper y controller spec, los dobles de
`get-pet.use-case.spec.ts` (`findMealsToday`/`mealsReader` + quinto argumento
en las diez construcciones), `test/nutrition.e2e-spec.ts` con **un solo
hunk** en `:478`, `docs/conventions.md` "14 de las 30" / "Las otras 16" y
`docs/data-model.md` (ERD, fila `meal_servings`, frase de `:68`).

Los de "Siguen verdes" quedan intactos: `nutrition.schema.spec.ts`,
`weights/health/devices/*.schema.spec.ts`, `schema/index.ts`,
`health-weights.e2e-spec.ts`, `owner-local-day.spec.ts`, `local-day.spec.ts`,
`alerts-engine-consumer.service.spec.ts`, `nutrition-scope.spec.ts` y
`mobile-pet-tracker/**` no aparecen en el diff. `generate` sigue usando
`toNutritionPlanResponse` (`nutrition.controller.ts:80`) y solo `latestPlan`
usa `toNutritionPlanTodayResponse` (`:93`); `generate-nutrition-plan.use-case.ts`
sin cambios.

Observación no bloqueante: además de lo declarado, dos **títulos** de test
pasaron de "24 claves" a "25 claves" (`test/pets.e2e-spec.ts:415` y
`pets.controller.spec.ts:151`), coherentes con el cambio declarado del título
del mapper spec `:34`. Son cadenas de título; ninguna aserción cambia.

## R12 contra `pet_tracker_wt` (punto 4)

```
select count(*), max(created_at) from drizzle.__drizzle_migrations   → 18|1789493838553
   (= when de 0017_meal_servings en _journal.json)
select count(*) from information_schema.tables … 'meal_servings'      → 1
pg_indexes: meal_servings_created_by_idx (btree created_by)
            meal_servings_pet_id_served_on_meal_time_idx UNIQUE (pet_id, served_on, meal_time)
            meal_servings_pkey
pg_constraint: pet_id → pets(id) ON DELETE CASCADE; created_by → users(id) (no action); PK id
columnas: id uuid NN, pet_id uuid NN, served_on date NN, meal_time varchar(5) NN,
          served_at timestamptz NN DEFAULT now(), created_by uuid NN
pnpm db:migrate (segunda vez, tras el db:migrate de init.sh) → EXIT=0, "migrations applied successfully!",
          journal sigue 18|1789493838553, tabla sigue 1 (idempotente)
pnpm db:generate → EXIT=0, "21 tables … No schema changes, nothing to migrate";
          git status --porcelain src/db/migrations → vacío (no creó ficheros)
```

## Sondas de mutación en zona ciega (punto 5) — las cinco cayeron

Cada sonda: `cp` de respaldo → edición → suite dirigida → `cp` de vuelta →
`git diff --quiet` limpio ("restored (x) clean" en las cinco).

- (a) `servedInPlan` devuelve `served` sin filtrar: `pnpm test -- meal-serving.entity` → `Tests: 4 failed, 4 total` (R11, los cuatro `it`); `pnpm test:e2e -- meals.e2e-spec` → `Tests: 2 failed, 15 passed, 17 total`: R9 "devuelve solo las franjas servidas, ordenadas por el plan" (orden `['19:30','07:30']` recibido) y R10 "excluye las franjas del plan anterior tras regenerar" (`"served": 2` recibido, esperado 1).
- (b) `ServeMealUseCase` sin la comprobación `mealTime ∈ plan.mealTimes`: `pnpm test -- serve-meal.use-case` → `Tests: 1 failed, 5 passed`: R4 "lanza MealTimeNotInPlanError antes de escribir".
- (c) `UnserveMealUseCase` con `served_on = now.toISOString().slice(0,10)` (UTC): `pnpm test -- unserve-meal.use-case` → `Tests: 2 failed, 2 total`: R7 `Expected: PET_ID, "2026-08-11", "07:30" / Received: PET_ID, "2026-08-10", "07:30"` (Pacific/Kiritimati) y R8 (`servedOn` del meta).
- (d) mapper con `mealsToday = { served: 0, total: 0 }` por defecto: `pnpm test -- pet-profile-response.mapper pets.controller` → `Tests: 2 failed, 23 passed` (las dos aserciones `toBeNull()` de `mealsToday`); `pnpm test:e2e -- meals.e2e-spec` → `Tests: 1 failed, 16 passed`: R10 "mantiene mealsToday presente y null en el listado" (`Received value: {"served": 0, "total": 0}` en `:545`).
- (e) `@RequirePetRole('owner')` en `MealsController`: `pnpm test:e2e -- meals.e2e-spec` → `Tests: 1 failed, 16 passed`: R3 "family sirve y walker deshace…" con `expected 201 "Created", got 403 "Forbidden"`.

## D2/D3/D4/D6/D11 en el código (punto 6)

- `meals.controller.ts`: `@Controller('pets/:petId/meals')` + `@UseGuards(PetAccessGuard)`, **sin** `@RequirePetRole` (grep 0); `@Post()` sin `@HttpCode` (201) y `@Delete(':mealTime') @HttpCode(HttpStatus.NO_CONTENT)`; `now = new Date()` en cada handler; `parseBody`/`validationError` copiados del molde.
- D6: `ServeMealSchema = z.strictObject({ mealTime: z.string().regex(MEAL_TIME_PATTERN, …) })` → `servedOn` y claves extra responden 400 (R6 e2e con los cinco bodies).
- D11: `create` = `insert … .onConflictDoNothing({ target: [petId, servedOn, mealTime] }).returning()` y `if (!row) throw new MealAlreadyServedError(...)`; no hay `findPgError`, `cause` ni `23505` en el repositorio; el mapper traduce a `ConflictException` 409 `MEAL_ALREADY_SERVED`.
- Orden en `serve`: `findLatestPlan` → `NutritionPlanRequiredError` → `includes` → `MealTimeNotInPlanError` → `ownerLocalDay` → `create` → `audit.record` (después del `await` de `create`; si `create` rechaza no se audita: R8 unit "no audita cuando create falla").
- R7: `UnserveMealUseCase` no inyecta `NUTRITION_REPOSITORY` ni consulta el plan; `ownerLocalDay` → `deleteOne` → 404 → `audit.record` solo tras borrar.
- C5: `servedToday` solo en `GetNutritionPlanUseCase.execute(petId, now)` + `toNutritionPlanTodayResponse`; `generate` intacto (R9 e2e asevera `not.toHaveProperty('servedToday')` en el body de `generate`).
- D9: `PET_MEALS_READER` en `pets/domain/ports`, adaptador con dos consultas (plan proyectado con `orderBy(desc(generatedAt), desc(id)).limit(1)` y `mealServings` por `(petId, servedOn)`), `served = servedInPlan(...).length`, `total = mealsPerDay`; listado sin lectura extra (default `null` del mapper, séptimo parámetro).

## Output de ./init.sh (primer plano, desde la raíz del worktree, sin pipe)

`pgrep -af 'init\.sh|test:e2e|jest-e2e'` limpio antes de lanzar.
`./init.sh > scratchpad/review-83-init.log 2>&1; echo EXIT=$?` → **EXIT=0**.
Líneas decisivas del log (15350 líneas):

```
✅ Build exitoso
Test Suites: 170 passed, 170 total
Tests:       1295 passed, 1295 total          (backend unit; baseline 166/1279 → +4 suites, +16 tests)
Test Suites: 2 passed, 2 total
Tests:       14 passed, 14 total              (harness)
Test Suites: 73 passed, 73 total
Tests:       1275 passed, 1275 total
Snapshots:   1 passed, 1 total                (móvil; PASS src/screens/alerts/index.test.tsx y add-pet/index.test.tsx a la primera, sin flake)
✅ Tests pasados
[✓] migrations applied successfully!          (db:migrate contra pet_tracker_wt)
✅ Esquema y recursos e2e listos
Test Suites: 3 skipped, 27 passed, 27 of 30 total
Tests:       8 skipped, 384 passed, 392 total (30 ficheros e2e en disco, 3 aws-real skipped → meals.e2e-spec entre los 27)
✅ Tests e2e pasados
✅ Lint sin errores
✅ Typecheck sin errores
✅ Todo verde. Listo para trabajar.
  Features: 81/98 completadas | 16 pendientes
```

Las dos líneas `ECONNREFUSED 127.0.0.1:4566` del log son los literales de
`poller.service.spec.ts`, no infra caída. Además, suite nueva sola en el
árbol limpio: `pnpm test:e2e -- meals.e2e-spec` → `Test Suites: 1 passed,
Tests: 17 passed, 17 total`, exit 0.

## graphify (punto 7)

`graphify update .` desde la raíz del worktree tras validar: exit 0,
"Rebuilt: 13044 nodes, 19546 edges, 816 communities"; `graphify-out/`
gitignorado, árbol sigue limpio.

## Observaciones

Ninguna bloqueante. Para el cierre del leader, no del reviewer:

1. Queda el **§Gate humano** de requirements.md (smoke con `curl` contra el
   backend del worktree) por registrar en `progress/current.md`; la spec dice
   que sin ese registro no se marca `done`.
2. La migración `0017_meal_servings` es aditiva y está aplicada solo en
   `pet_tracker_wt`; la base compartida `pet_tracker` se migra tras el merge
   con `pnpm db:migrate` desde el tree principal (design.md §Aplicación de la
   migración en dos bases). #98 la necesita antes de su smoke.
3. Cosmético, no requiere acción: dos títulos de test fuera del delta
   declarado pasaron de "24" a "25 claves" (`test/pets.e2e-spec.ts:415`,
   `pets.controller.spec.ts:151`); ninguna aserción cambió.

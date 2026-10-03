# Implementación — meals-served-tracking (#83)

- Rama: `feature/83-meals-served-tracking`
- Worktree: `/home/claude/sites/Pet-Tracker-wt-backend`
- Base propia: `pet_tracker_wt` (`localhost:5433`)
- Inicio: 2026-09-15
- Baseline: `./init.sh` exit 0 antes de modificar código; backend 166 suites / 1279 tests, e2e 26 de 29 suites (3 `aws-real` omitidas), lint y typecheck verdes.
- Precondición DB: `.env` contiene una coincidencia de `localhost:5433/pet_tracker_wt`; journal físico `17|1789440631931`, igual a `0016_drop_devices_connectivity` (`when: 1789440631931`).

## R1

Rojo `4a0e3d8c` — `test(meals-served-tracking): lock meal_servings schema and migration (R1)`.

```text
$ pnpm test -- meal-servings.schema
FAIL src/db/schema/meal-servings.schema.spec.ts
TypeError: Cannot read properties of undefined (reading 'Symbol(drizzle:Columns)')
  22 |   const config = getTableConfig(mealServings);
Test Suites: 1 failed, 1 total
Tests:       0 total
Time:        0.568 s
exit 1
```

Rojo legítimo: `mealServings` es el artefacto bajo prueba y todavía no se exporta.

Verde `ad85e3e9` — `feat(meals-served-tracking): add meal_servings table and migration (R1)`.

Salida literal de generación:

```text
$ pnpm db:generate
> backend-pet-tracker@0.0.1 db:generate /home/claude/sites/Pet-Tracker-wt-backend/backend-pet-tracker
> drizzle-kit generate

No config path provided, using default 'drizzle.config.ts'
Reading config file '/home/claude/sites/Pet-Tracker-wt-backend/backend-pet-tracker/drizzle.config.ts'
◇ injected env (21) from ../.env // tip: ◈ secrets for agents [www.dotenvx.com]
21 tables
activity_daily 11 columns 0 indexes 1 fks
alert_events 9 columns 3 indexes 2 fks
audit_log 7 columns 2 indexes 1 fks
devices 14 columns 0 indexes 0 fks
pet_devices 5 columns 4 indexes 2 fks
email_verification_tokens 6 columns 1 indexes 1 fks
geofences 9 columns 2 indexes 1 fks
pet_vaccines 11 columns 3 indexes 3 fks
vaccine_catalog 4 columns 1 indexes 0 fks
weights 6 columns 2 indexes 2 fks
pet_documents 8 columns 1 indexes 2 fks
meal_servings 6 columns 2 indexes 2 fks
nutrition_plans 12 columns 1 indexes 1 fks
nutrition_profiles 10 columns 0 indexes 1 fks
password_reset_tokens 6 columns 1 indexes 1 fks
pet_users 6 columns 1 indexes 2 fks
pets 18 columns 0 indexes 0 fks
push_tokens 6 columns 1 indexes 1 fks
reminders 11 columns 3 indexes 2 fks
device_subscriptions 6 columns 0 indexes 1 fks
users 12 columns 0 indexes 0 fks

[✓] Your SQL migration file ➜ src/db/migrations/0017_rainy_stark_industries.sql 🚀
exit 0
```

El SQL generado contenía solo `CREATE TABLE "meal_servings"`, sus dos FKs y sus dos índices. Se renombraron únicamente el SQL y el `tag`; `when: 1789493838553` y `meta/0017_snapshot.json` quedaron generados sin edición.

```text
$ pnpm test -- meal-servings.schema nutrition.schema
Test Suites: 2 passed, 2 total
Tests:       7 passed, 7 total
Time:        0.72 s
exit 0

$ pnpm exec tsc --noEmit
exit 0

$ pnpm lint
exit 0
```

Docs `22fdd4da` — `docs(meals-served-tracking): add meal_servings to data-model (R1)`.

## R2

Rojo `11d35b0a` — `test(meals-served-tracking): require POST meals with owner local day (R2)`.

```text
$ pnpm test:e2e -- meals.e2e-spec
FAIL test/meals.e2e-spec.ts
expected 201 "Created", got 404 "Not Found"
Test Suites: 1 failed, 1 total
Tests:       2 failed, 2 total
Time:        2.093 s
exit 1
```

Rojo legítimo: la migración ya estaba aplicada y las dos aserciones recibieron `404` porque la ruta `POST /v1/pets/:petId/meals` no existía.

Verde `d77745fe` — `feat(meals-served-tracking): serve meal endpoint (R2)`.

```text
$ pnpm test:e2e -- meals.e2e-spec
Test Suites: 1 passed, 1 total
Tests:       2 passed, 2 total
Time:        2.254 s
exit 0

$ pnpm test
Test Suites: 168 passed, 168 total
Tests:       1287 passed, 1287 total
Time:        13.211 s
exit 0

$ pnpm exec tsc --noEmit
exit 0

$ pnpm lint
exit 0
```

## R3

Rojo `1581848a` — `test(meals-served-tracking): require any active member can serve and undo (R3)`.

```text
$ pnpm test:e2e -- meals.e2e-spec
FAIL test/meals.e2e-spec.ts
expected 201 "Created", got 403 "Forbidden"
Test Suites: 1 failed, 1 total
Tests:       1 failed, 10 passed, 11 total
Time:        2.464 s
exit 1
```

Rojo legítimo por mutación de producción versionada: ambos handlers recibieron `@RequirePetRole('owner')`; family obtuvo 403. Las aserciones de outsider y `not-a-uuid` siguieron verdes con 404, demostrando precedencia del guard. El verde elimina ambos decoradores.

Verde `e0c84837` — `feat(meals-served-tracking): open meals routes to every active member (R3)`.

```text
$ pnpm test:e2e -- meals.e2e-spec
Test Suites: 1 passed, 1 total
Tests:       11 passed, 11 total
Time:        2.739 s
exit 0
```

## R4

Rojo `da648574` — `test(meals-served-tracking): require 422 without plan or off-plan meal time (R4)`.

```text
$ pnpm test -- serve-meal.use-case
FAIL src/modules/nutrition/application/use-cases/serve-meal.use-case.spec.ts
Received promise resolved instead of rejected
Test Suites: 1 failed, 1 total
Tests:       2 failed, 2 total
Time:        0.855 s
exit 1

$ pnpm test:e2e -- meals.e2e-spec
FAIL test/meals.e2e-spec.ts
expected 422 "Unprocessable Entity", got 201 "Created"
Test Suites: 1 failed, 1 total
Tests:       2 failed, 3 passed, 5 total
Time:        2.028 s
exit 1
```

Rojo legítimo por mutación de producción versionada: se quitaron las dos comprobaciones de plan y ambos caminos escribieron/respondieron 201. El verde las restaura en el orden plan → pertenencia.

Verde `54ec03e0` — `feat(meals-served-tracking): validate plan and meal time before serving (R4)`.

```text
$ pnpm test -- serve-meal.use-case
Test Suites: 1 passed, 1 total
Tests:       2 passed, 2 total
Time:        0.693 s
exit 0

$ pnpm test:e2e -- meals.e2e-spec
Test Suites: 1 passed, 1 total
Tests:       5 passed, 5 total
Time:        2.138 s
exit 0
```

## R5

Rojo `4c565d9d` — `test(meals-served-tracking): require 409 on duplicate serving per day (R5)`.

```text
$ pnpm test:e2e -- meals.e2e-spec
FAIL test/meals.e2e-spec.ts
duplicate key value violates unique constraint "meal_servings_pet_id_served_on_meal_time_idx"
expected 409 "Conflict", got 500 "Internal Server Error"
Test Suites: 1 failed, 1 total
Tests:       1 failed, 6 passed, 7 total
Time:        2.384 s
exit 1
```

Rojo legítimo por mutación de producción versionada: se quitó `onConflictDoNothing`; Postgres mantuvo la unicidad pero el error `23505` llegó como 500. El verde restaura `onConflictDoNothing` + `returning` vacío, sin parsear errores de pg.

Verde `1648120f` — `feat(meals-served-tracking): translate duplicate serving to 409 (R5)`.

```text
$ pnpm test:e2e -- meals.e2e-spec
Test Suites: 1 passed, 1 total
Tests:       7 passed, 7 total
Time:        2.262 s
exit 0
```

## R6

Rojo `a832d69b` — `test(meals-served-tracking): require 400 on invalid meal body (R6)`.

```text
$ pnpm test:e2e -- meals.e2e-spec
FAIL test/meals.e2e-spec.ts
expected 400 "Bad Request", got 422 "Unprocessable Entity"
Test Suites: 1 failed, 1 total
Tests:       1 failed, 2 passed, 3 total
Time:        2.392 s
exit 1
```

Rojo legítimo por mutación de producción versionada: `z.strictObject` + regex se sustituyeron por `z.object` + `z.string`; una entrada inválida alcanzó el use case y devolvió 422. El verde revierte esa mutación.

Verde `ef070cbb` — `feat(meals-served-tracking): strict meal body validation (R6)`.

```text
$ pnpm test:e2e -- meals.e2e-spec
Test Suites: 1 passed, 1 total
Tests:       3 passed, 3 total
Time:        2.079 s
exit 0
```

## R7

Rojo `7045bd74` — `test(meals-served-tracking): require DELETE of today's serving (R7)`.

```text
$ pnpm test -- unserve-meal.use-case
FAIL src/modules/nutrition/application/use-cases/unserve-meal.use-case.spec.ts
Cannot find module './unserve-meal.use-case'
Test Suites: 1 failed, 1 total
Tests:       0 total
Time:        0.518 s
exit 1

$ pnpm test:e2e -- meals.e2e-spec
FAIL test/meals.e2e-spec.ts
expected 204 "No Content", got 404 "Not Found"
Test Suites: 1 failed, 1 total
Tests:       1 failed, 8 passed, 9 total
Time:        2.612 s
exit 1
```

Rojo legítimo: tanto el use case bajo prueba como la ruta DELETE estaban ausentes. La aserción `servedToday` posterior al borrado se añade con R9, cuando esa vista entra por TDD.

Verde `b4a42dda` — `feat(meals-served-tracking): unserve meal endpoint (R7)`.

```text
$ pnpm test -- unserve-meal.use-case
Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Time:        0.678 s
exit 0

$ pnpm test:e2e -- meals.e2e-spec
Test Suites: 1 passed, 1 total
Tests:       9 passed, 9 total
Time:        2.51 s
exit 0
```

## R8

Rojo `1c75a22c` — `test(meals-served-tracking): require meal.serve and meal.unserve audit (R8)`.

```text
$ pnpm test -- serve-meal.use-case unserve-meal.use-case
FAIL src/modules/nutrition/application/use-cases/serve-meal.use-case.spec.ts
Expected action: "meal.serve"; Received action: "meal.create"
FAIL src/modules/nutrition/application/use-cases/unserve-meal.use-case.spec.ts
Expected action: "meal.unserve"; Received action: "meal.delete"
Test Suites: 2 failed, 2 total
Tests:       2 failed, 4 passed, 6 total
Time:        1.035 s
exit 1

$ pnpm test:e2e -- meals.e2e-spec
FAIL test/meals.e2e-spec.ts
Expected: ["meal.serve", "meal.unserve"]
Received: ["meal.create", "meal.delete"]
Test Suites: 1 failed, 1 total
Tests:       2 failed, 10 passed, 12 total
Time:        3.25 s
exit 1
```

Rojo legítimo por mutación de producción versionada: solo cambiaron los literales de acción a `meal.create`/`meal.delete`; los tests unitarios y la lectura real de `audit_log` detectaron ambos.

Verde `20af799b` — `feat(meals-served-tracking): audit meal serve and unserve (R8)`.

```text
$ pnpm test -- serve-meal.use-case unserve-meal.use-case
Test Suites: 2 passed, 2 total
Tests:       6 passed, 6 total
Time:        0.742 s
exit 0

$ pnpm test:e2e -- meals.e2e-spec
Test Suites: 1 passed, 1 total
Tests:       12 passed, 12 total
Time:        2.555 s
exit 0
```

## R9

Rojo `1f006d8a` — `test(meals-served-tracking): require servedToday on GET nutrition-plan (R9)`.

```text
$ pnpm test:e2e -- meals.e2e-spec nutrition.e2e-spec
FAIL test/meals.e2e-spec.ts
Expected key/value: "servedToday": []
Received: respuesta de 11 claves sin servedToday
FAIL test/nutrition.e2e-spec.ts
Expected: { ...second.body, servedToday: [] }
Received: second.body sin servedToday
Test Suites: 2 failed, 2 total
Tests:       3 failed, 33 passed, 36 total
Time:        4.798 s
exit 1
```

Rojo legítimo por aserción: el GET aún devolvía 11 claves. El `generate` se mantuvo sin `servedToday`; también quedó candado el GET posterior al DELETE de R7.

Verde `97b0944b` — `feat(meals-served-tracking): expose servedToday on nutrition plan (R9)`.

```text
$ pnpm exec tsc --noEmit
exit 0

$ pnpm test:e2e -- meals.e2e-spec nutrition.e2e-spec
Test Suites: 2 passed, 2 total
Tests:       36 passed, 36 total
Time:        4.505 s
exit 0
```

`POST …/nutrition-plan/generate` sigue usando `toNutritionPlanResponse` y conserva las 11 claves sin `servedToday`.

## R10

Rojo `e7b89ccd` — `test(meals-served-tracking): require mealsToday on pet profile (R10)`.

```text
$ pnpm test -- pet-profile-response.mapper get-pet.use-case pets.controller
FAIL src/modules/pets/infrastructure/pets.controller.spec.ts
Expected key "mealsToday"; respuesta de 24 claves
FAIL src/modules/pets/application/use-cases/get-pet.use-case.spec.ts
Expected findMealsToday(PET_ID, "2026-08-09"); Number of calls: 0
Expected mealsToday null; Received undefined
FAIL src/modules/pets/infrastructure/mappers/pet-profile-response.mapper.spec.ts
Expected key "mealsToday"; respuesta de 24 claves
Expected mealsToday null; Received undefined
Test Suites: 3 failed, 3 total
Tests:       5 failed, 32 passed, 37 total
Time:        1.48 s
exit 1

$ pnpm test:e2e -- meals.e2e-spec
FAIL test/meals.e2e-spec.ts
Expected mealsToday null / { served, total }; Received propiedad ausente
Test Suites: 1 failed, 1 total
Tests:       4 failed, 13 passed, 17 total
Time:        3.823 s
exit 1

$ pnpm exec tsc --noEmit
exit 0
```

Rojo legítimo solo de aserciones: el doble estructural del quinto puerto vive en el test rojo y el constructor se invoca mediante un alias tipado de cinco argumentos; producción aún ignora ese argumento. Así se probaron las diez construcciones y los dos casos nuevos sin convertir el rojo en un fallo de tipos. El verde sustituye el alias por el puerto real.

Verde `fdabd079` — `feat(meals-served-tracking): add mealsToday to pet profile via PET_MEALS_READER (R10)`.

```text
$ pnpm test -- pet-profile-response.mapper get-pet.use-case pets.controller
Test Suites: 3 passed, 3 total
Tests:       37 passed, 37 total
Time:        1.322 s
exit 0

$ pnpm test:e2e -- meals.e2e-spec
Test Suites: 1 passed, 1 total
Tests:       17 passed, 17 total
Time:        3.61 s
Ran all test suites matching meals.e2e-spec.
exit 0

$ pnpm test
Test Suites: 170 passed, 170 total
Tests:       1295 passed, 1295 total
Time:        12.247 s
exit 0

$ pnpm exec tsc --noEmit
exit 0

$ pnpm lint
> eslint "{src,apps,libs,test}/**/*.ts" --fix
exit 0

$ pgrep -af 'init\.sh|test:e2e|jest-e2e' | grep -v pgrep
(sin procesos)

$ pnpm test:e2e
Test Suites: 3 skipped, 27 passed, 27 of 30 total
Tests:       8 skipped, 384 passed, 392 total
Time:        88.065 s
Ran all test suites.
exit 0
```

El listado conserva el mapper sin lectura adicional: su séptimo argumento usa el default `null`. `PetRepository` no cambió.

## R11

Rojo `28bf18c1` — `test(meals-served-tracking): lock servedInPlan order and exclusion (R11)`.

```text
$ pnpm test -- meal-serving.entity
FAIL src/modules/nutrition/domain/entities/meal-serving.entity.spec.ts
Cannot find module './meal-serving.entity'
Test Suites: 1 failed, 1 total
Tests:       0 total
Time:        0.541 s
exit 1
```

Rojo legítimo: el módulo de dominio bajo prueba todavía no existía.

Verde `a8f6d73b` — `feat(meals-served-tracking): add MealServing entity and servedInPlan (R11)`.

```text
$ pnpm test -- meal-serving.entity
Test Suites: 1 passed, 1 total
Tests:       4 passed, 4 total
Time:        0.509 s
exit 0
```

## R12

Aplicación adelantada tras R1 para habilitar los rojos E2E posteriores:

```text
$ docker exec pet-tracker-postgres psql -U pet_tracker -d pet_tracker_wt -Atc "select count(*) from information_schema.tables where table_schema='public' and table_name='meal_servings'"
0

$ pnpm db:migrate
> backend-pet-tracker@0.0.1 db:migrate /home/claude/sites/Pet-Tracker-wt-backend/backend-pet-tracker
> drizzle-kit migrate

No config path provided, using default 'drizzle.config.ts'
Reading config file '/home/claude/sites/Pet-Tracker-wt-backend/backend-pet-tracker/drizzle.config.ts'
◇ injected env (21) from ../.env // tip: ⌘ suppress logs { quiet: true }
Using 'pg' driver for database querying
[✓] migrations applied successfully!
exit 0

$ docker exec pet-tracker-postgres psql -U pet_tracker -d pet_tracker_wt -Atc "select count(*) from information_schema.tables where table_schema='public' and table_name='meal_servings'"
1

$ docker exec pet-tracker-postgres psql -U pet_tracker -d pet_tracker_wt -Atc "select count(*), max(created_at) from drizzle.__drizzle_migrations"
18|1789493838553
```

La aplicación se adelantó únicamente para habilitar el TDD E2E. El cierre R12
repitió la migración dos veces y comprobó el estado posterior en cada paso.

### Evidencia a–f — aplicación e idempotencia

```text
$ docker exec pet-tracker-postgres psql -U pet_tracker -d pet_tracker_wt -Atc "select count(*), max(created_at) from drizzle.__drizzle_migrations"
18|1789493838553
exit 0

$ docker exec pet-tracker-postgres psql -U pet_tracker -d pet_tracker_wt -Atc "select count(*) from information_schema.tables where table_schema='public' and table_name='meal_servings'"
1
exit 0

$ pnpm db:migrate
> backend-pet-tracker@0.0.1 db:migrate /home/claude/sites/Pet-Tracker-wt-backend/backend-pet-tracker
> drizzle-kit migrate

No config path provided, using default 'drizzle.config.ts'
Reading config file '/home/claude/sites/Pet-Tracker-wt-backend/backend-pet-tracker/drizzle.config.ts'
◇ injected env (21) from ../.env // tip: ◈ secrets for agents [www.dotenvx.com]
Using 'pg' driver for database querying
[✓] migrations applied successfully!
exit 0

$ docker exec pet-tracker-postgres psql -U pet_tracker -d pet_tracker_wt -Atc "select count(*) from information_schema.tables where table_schema='public' and table_name='meal_servings'"
1
exit 0

$ docker exec pet-tracker-postgres psql -U pet_tracker -d pet_tracker_wt -Atc "select count(*), max(created_at) from drizzle.__drizzle_migrations"
18|1789493838553
exit 0

$ pnpm db:migrate
> backend-pet-tracker@0.0.1 db:migrate /home/claude/sites/Pet-Tracker-wt-backend/backend-pet-tracker
> drizzle-kit migrate

No config path provided, using default 'drizzle.config.ts'
Reading config file '/home/claude/sites/Pet-Tracker-wt-backend/backend-pet-tracker/drizzle.config.ts'
◇ injected env (21) from ../.env // tip: ⌘ enable debugging { debug: true }
Using 'pg' driver for database querying
[✓] migrations applied successfully!
exit 0

$ docker exec pet-tracker-postgres psql -U pet_tracker -d pet_tracker_wt -Atc "select count(*), max(created_at) from drizzle.__drizzle_migrations"
18|1789493838553
exit 0

$ docker exec pet-tracker-postgres psql -U pet_tracker -d pet_tracker_wt -Atc "select count(*) from information_schema.tables where table_schema='public' and table_name='meal_servings'"
1
exit 0
```

Las dos repeticiones fueron no-op: el journal conservó 18 filas y el mismo
`max(created_at)`; la tabla siguió siendo única. La base compartida
`pet_tracker` no se consultó ni migró.

### Evidencia g — schema y snapshot sincronizados

```text
$ pnpm db:generate
> backend-pet-tracker@0.0.1 db:generate /home/claude/sites/Pet-Tracker-wt-backend/backend-pet-tracker
> drizzle-kit generate

No config path provided, using default 'drizzle.config.ts'
Reading config file '/home/claude/sites/Pet-Tracker-wt-backend/backend-pet-tracker/drizzle.config.ts'
◇ injected env (21) from ../.env // tip: ⌁ auth for agents [www.vestauth.com]
21 tables
activity_daily 11 columns 0 indexes 1 fks
alert_events 9 columns 3 indexes 2 fks
audit_log 7 columns 2 indexes 1 fks
devices 14 columns 0 indexes 0 fks
pet_devices 5 columns 4 indexes 2 fks
email_verification_tokens 6 columns 1 indexes 1 fks
geofences 9 columns 2 indexes 1 fks
pet_vaccines 11 columns 3 indexes 3 fks
vaccine_catalog 4 columns 1 indexes 0 fks
weights 6 columns 2 indexes 2 fks
pet_documents 8 columns 1 indexes 2 fks
meal_servings 6 columns 2 indexes 2 fks
nutrition_plans 12 columns 1 indexes 1 fks
nutrition_profiles 10 columns 0 indexes 1 fks
password_reset_tokens 6 columns 1 indexes 1 fks
pet_users 6 columns 1 indexes 2 fks
pets 18 columns 0 indexes 0 fks
push_tokens 6 columns 1 indexes 1 fks
reminders 11 columns 3 indexes 2 fks
device_subscriptions 6 columns 0 indexes 1 fks
users 12 columns 0 indexes 0 fks

No schema changes, nothing to migrate 😴
exit 0

$ git status --porcelain backend-pet-tracker/src/db/migrations
(sin salida)
exit 0
```

### Gates finales

```text
$ pnpm test
Test Suites: 170 passed, 170 total
Tests:       1295 passed, 1295 total
Snapshots:   0 total
Time:        12.352 s
Ran all test suites.
exit 0

$ pnpm exec tsc --noEmit
(sin salida)
exit 0

$ pnpm lint
> backend-pet-tracker@0.0.1 lint /home/claude/sites/Pet-Tracker-wt-backend/backend-pet-tracker
> eslint "{src,apps,libs,test}/**/*.ts" --fix
exit 0

$ pgrep -af 'init\.sh|test:e2e|jest-e2e' | grep -v pgrep
(sin procesos)

$ pnpm test:e2e
Test Suites: 3 skipped, 27 passed, 27 of 30 total
Tests:       8 skipped, 384 passed, 392 total
Snapshots:   0 total
Time:        79.663 s, estimated 87 s
Ran all test suites.
exit 0
```

La ejecución concreta de la suite nueva también está registrada en R10:
`pnpm test:e2e -- meals.e2e-spec` → 1 suite y 17 tests verdes.

Antes del gate integral, el mismo `pgrep` volvió a quedar sin salida. El
proceso se ejecutó directamente desde la raíz, sin pipe; cierres literales:

```text
$ ./init.sh
✅ Build exitoso

Test Suites: 170 passed, 170 total
Tests:       1295 passed, 1295 total
✅ Tests pasados

Test Suites: 2 passed, 2 total
Tests:       14 passed, 14 total

Test Suites: 73 passed, 73 total
Tests:       1275 passed, 1275 total
Snapshots:   1 passed, 1 total
✅ Tests pasados

Test Suites: 3 skipped, 27 passed, 27 of 30 total
Tests:       8 skipped, 384 passed, 392 total
Snapshots:   0 total
Time:        86.407 s
Ran all test suites.
✅ Tests e2e pasados

✅ Lint sin errores
✅ Typecheck sin errores
✅ Todo verde. Listo para trabajar.

  Features: 81/98 completadas | 16 pendientes

  Próxima feature:
  [#18] nutrition-ai-explainer (P3)
exit 0
```

El aviso ya existente de tres claves opcionales ausentes en `.env` no abortó
el gate; #83 no añadió variables ni modificó `.env.example`.

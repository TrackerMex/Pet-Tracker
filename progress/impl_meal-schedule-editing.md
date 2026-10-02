# Implementación — meal-schedule-editing #103

## §Base

Salidas iniciales, antes de tocar el árbol:

```text
/home/claude/sites/Pet-Tracker
feature/103-meal-schedule-editing
2ae639562b03e838f4cb83e13f8e233c97f130f0
```

H0 / hash del handoff: `2ae639562b03e838f4cb83e13f8e233c97f130f0`.
Skills cargadas: ninguna (solo backend; sin skills de Expo).
`pgrep -af 'init\.sh|test:e2e|jest-e2e' | grep -v pgrep`: salida vacía, exit=1 (ningún proceso).
`git status --short` inicial: vacío.
No se ejecuta `./init.sh` ni E2E completo: delegado al leader por instrucción del humano (LocalStack compartido con #41).

Base Postgres: `pet_tracker`; `select count(*) from drizzle.__drizzle_migrations` → `18`; journal → `18`.
Línea base medida en H0:

| Comando (backend) | Resultado | Exit |
|---|---|---|
| `pnpm test` | 171 suites / 1307 tests, todos pasan | 0 |
| `pnpm exec tsc --noEmit` | sin salida | 0 |
| `pnpm lint` | sin errores | 0 |
| `<e2e-nut>` | 2 suites / 45 tests, todos pasan | 0 |

Comandos exactos de los logs (desde `backend-pet-tracker/`):

| Sufijo / etiqueta | Comando |
|---|---|
| `*-mt` | `pnpm exec jest --config ./test/jest-e2e.json test/meal-times.e2e-spec.ts` |
| `*-nut` | `pnpm exec jest --config ./test/jest-e2e.json test/meals.e2e-spec.ts test/nutrition.e2e-spec.ts` |
| `*-tsc` | `pnpm exec tsc --noEmit` |
| `*-lint` | `pnpm lint` (incluye `--fix`) |
| `r1-red-unit` | `pnpm test -- nutrition.schema` |
| `r1-red-serving` | `pnpm test -- meal-servings.schema` |
| `r1-green-unit` | `pnpm test -- nutrition.schema meal-servings.schema serve-meal` |
| `r2-*-unit`, `r3-*-unit` | `pnpm test -- nutrition-plan.entity` |
| `r5-*-unit` | `pnpm test -- move-meal-time` |
| `r7-*-unit`, `r9-*-unit` | `pnpm test -- add-meal-time move-meal-time` |
| `handoff-unit`, `handoff-r10-unit` | `pnpm test` |
| `order-migrate` | `pnpm db:migrate` |

Cada comando se mide sin pipe: redirección a `/tmp/meal103-<etiqueta>.log`, captura inmediata de `$?` y `echo "exit=$meal103_exit"`. Sus resúmenes y matchers se copian abajo. Todos los E2E nuevos se ejecutaron con 0018 aplicada.

## R1

`r1-red-unit`: exit=1.

```text
FAIL src/db/schema/nutrition.schema.spec.ts
  ● R15 (nutrition-profile-engine #17): tablas de nutricion y migracion 0013 nueva › declara nutrition_plans con historial, checks, cascade e indice

    expect(received).toEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 0

    @@ -1,9 +1,8 @@
      Array [
        "ai_explanation",
        "daily_grams",
    -   "engine_meals_per_day",
        "generated_at",
        "id",
        "inputs_hash",
        "meal_times",
        "meals_per_day",

  ● R1 (meal-schedule-editing #103): columna engine_meals_per_day y migracion 0018 › declara engine_meals_per_day integer, nullable y sin default

    expect(received).toBe(expected) // Object.is equality

    Expected: "integer"
    Received: undefined

  ● R1 (meal-schedule-editing #103): columna engine_meals_per_day y migracion 0018 › 0018 renombrada, registrada en el journal y con el ADD COLUMN exacto

    Engine meals migration not found

Test Suites: 1 failed, 1 total
Tests:       3 failed, 2 passed, 5 total
```

`r1-red-serving`: exit=0.

```text
Test Suites: 1 passed, 1 total
Tests:       4 passed, 4 total
```

`r1-red-lint`: exit=0.

```text
> backend-pet-tracker@0.0.1 lint /home/claude/sites/Pet-Tracker/backend-pet-tracker
> eslint "{src,apps,libs,test}/**/*.ts" --fix
```

`r1-generate`: exit=0.

```text
> backend-pet-tracker@0.0.1 db:generate /home/claude/sites/Pet-Tracker/backend-pet-tracker
> drizzle-kit generate

No config path provided, using default 'drizzle.config.ts'
Reading config file '/home/claude/sites/Pet-Tracker/backend-pet-tracker/drizzle.config.ts'
◇ injected env (21) from ../.env // tip: ⌘ multiple files { path: ['.env.local', '.env'] }
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
nutrition_plans 13 columns 1 indexes 1 fks
nutrition_profiles 10 columns 0 indexes 1 fks
password_reset_tokens 6 columns 1 indexes 1 fks
pet_users 6 columns 1 indexes 2 fks
pets 18 columns 0 indexes 0 fks
push_tokens 6 columns 1 indexes 1 fks
reminders 11 columns 3 indexes 2 fks
device_subscriptions 6 columns 0 indexes 1 fks
users 12 columns 0 indexes 0 fks

[✓] Your SQL migration file ➜ src/db/migrations/0018_stale_aqueduct.sql 🚀
```

`r1-green-unit`: exit=0.

```text
Test Suites: 4 passed, 4 total
Tests:       15 passed, 15 total
```

`r1-green-tsc`: exit=0.

```text
(sin salida)
```

`r1-green-lint`: exit=0.

```text
> backend-pet-tracker@0.0.1 lint /home/claude/sites/Pet-Tracker/backend-pet-tracker
> eslint "{src,apps,libs,test}/**/*.ts" --fix
```

SQL generado: solo `0018_stale_aqueduct.sql`, `meta/0018_snapshot.json` y journal; renombrado mediante `git mv` a 0018_nutrition_plans_engine_meals.sql. Snapshot sin edición manual y `when` conservado.

`cat backend-pet-tracker/src/db/migrations/0018_nutrition_plans_engine_meals.sql`:

```sql
ALTER TABLE "nutrition_plans" ADD COLUMN "engine_meals_per_day" integer;
```

## R2

`r2-red-unit`: exit=1.

```text
FAIL src/modules/nutrition/domain/entities/nutrition-plan.entity.spec.ts
  ● R2 (meal-schedule-editing #103): engineMealCount y carriedSchedule deciden el horario del plan nuevo › editado

    expect(received).toEqual(expected) // deep equality

    Expected: 2
    Received: 3

  ● R2 (meal-schedule-editing #103): engineMealCount y carriedSchedule deciden el horario del plan nuevo › anadida, motor igual

    expect(received).toEqual(expected) // deep equality

    - Expected  - 2
    + Received  + 1

      Object {
        "mealTimes": Array [
          "07:30",
    -     "12:00",
          "19:30",
        ],
    -   "mealsPerDay": 3,
    +   "mealsPerDay": 2,
      }

  ● R2 (meal-schedule-editing #103): engineMealCount y carriedSchedule deciden el horario del plan nuevo › movida, motor igual

    expect(received).toEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 1

      Object {
        "mealTimes": Array [
    -     "08:15",
    +     "07:30",
          "19:30",
        ],
        "mealsPerDay": 2,
      }

  ● R2 (meal-schedule-editing #103): engineMealCount y carriedSchedule deciden el horario del plan nuevo › legado, motor igual

    expect(received).toEqual(expected) // deep equality

    - Expected  - 2
    + Received  + 2

      Object {
        "mealTimes": Array [
    -     "08:00",
    -     "20:00",
    +     "07:30",
    +     "19:30",
        ],
        "mealsPerDay": 2,
      }

Test Suites: 1 failed, 1 total
Tests:       4 failed, 4 passed, 8 total
```

`r2-red-mt`: exit=1.

```text
FAIL test/meal-times.e2e-spec.ts
  ● Meal schedule editing (e2e) › R2 (meal-schedule-editing #103): generate conserva el horario editado mientras el motor no cambie el numero de comidas › perro: cambian las kcal, el motor sigue en 2 y el horario editado se conserva

    expect(received).toEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 0

      Array [
        "07:30",
    -   "12:00",
        "19:30",
      ]

Test Suites: 1 failed, 1 total
Tests:       1 failed, 1 passed, 2 total
```

`r2-red-lint`: exit=0.

```text
> backend-pet-tracker@0.0.1 lint /home/claude/sites/Pet-Tracker/backend-pet-tracker
> eslint "{src,apps,libs,test}/**/*.ts" --fix
```

`r2-green-unit`: exit=0.

```text
Test Suites: 1 passed, 1 total
Tests:       8 passed, 8 total
```

`r2-green-mt`: exit=0.

```text
Test Suites: 1 passed, 1 total
Tests:       2 passed, 2 total
```

`r2-green-nut`: exit=0.

```text
Test Suites: 2 passed, 2 total
Tests:       45 passed, 45 total
```

`r2-green-tsc`: exit=0.

```text
(sin salida)
```

`r2-green-lint`: exit=0.

```text
> backend-pet-tracker@0.0.1 lint /home/claude/sites/Pet-Tracker/backend-pet-tracker
> eslint "{src,apps,libs,test}/**/*.ts" --fix
```

## R3

`r3-red-unit`: exit=1.

```text
FAIL src/modules/nutrition/domain/entities/nutrition-plan.entity.spec.ts
  ● R3 (meal-schedule-editing #103): copyWithMealTimes ordena, recuenta y resuelve el numero del motor › copia los campos completos, ordena, recuenta y resuelve el motor

    expect(received).toStrictEqual(expected) // deep equality

    - Expected  - 3
    + Received  + 3

    @@ -1,16 +1,16 @@
      Object {
        "aiExplanation": "texto",
        "dailyGrams": 305,
    -   "engineMealsPerDay": 2,
    +   "engineMealsPerDay": null,
        "inputsHash": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
        "mealTimes": Array [
    +     "19:30",
          "07:30",
          "12:00",
    -     "19:30",
        ],
    -   "mealsPerDay": 3,
    +   "mealsPerDay": 2,
        "merKcal": 1059,
        "objective": "maintenance",
        "petId": "pet",
        "rerKcal": 662,
        "warnings": Array [],

Test Suites: 1 failed, 1 total
Tests:       1 failed, 9 passed, 10 total
```

`r3-red-mt`: exit=1.

```text
FAIL test/meal-times.e2e-spec.ts
  ● Meal schedule editing (e2e) › R3 (meal-schedule-editing #103): POST meal-times anade una franja como copia nueva del plan › anade 12:00 a P0, ordena y deja P0 intacto

    expected 201 "Created", got 404 "Not Found"

  ● Meal schedule editing (e2e) › R3 (meal-schedule-editing #103): POST meal-times anade una franja como copia nueva del plan › un plan anterior a 0018 resuelve el numero del motor con meals_per_day

    expected 201 "Created", got 404 "Not Found"

Test Suites: 1 failed, 1 total
Tests:       2 failed, 2 passed, 4 total
```

`r3-red-lint`: exit=0.

```text
> backend-pet-tracker@0.0.1 lint /home/claude/sites/Pet-Tracker/backend-pet-tracker
> eslint "{src,apps,libs,test}/**/*.ts" --fix
```

`r3-green-unit`: exit=0.

```text
Test Suites: 1 passed, 1 total
Tests:       10 passed, 10 total
```

`r3-green-mt`: exit=0.

```text
Test Suites: 1 passed, 1 total
Tests:       4 passed, 4 total
```

`r3-green-nut`: exit=0.

```text
Test Suites: 2 passed, 2 total
Tests:       45 passed, 45 total
```

`r3-green-tsc`: exit=0.

```text
(sin salida)
```

`r3-green-lint`: exit=0.

```text
> backend-pet-tracker@0.0.1 lint /home/claude/sites/Pet-Tracker/backend-pet-tracker
> eslint "{src,apps,libs,test}/**/*.ts" --fix
```

## R4

`r4-red-mt`: exit=1.

```text
FAIL test/meal-times.e2e-spec.ts
  ● Meal schedule editing (e2e) › R4 (meal-schedule-editing #103): PATCH meal-times mueve una franja como copia nueva del plan › mueve dos franjas seguidas y reordena

    expected 200 "OK", got 404 "Not Found"

Test Suites: 1 failed, 1 total
Tests:       1 failed, 4 passed, 5 total
```

`r4-red-lint`: exit=0.

```text
> backend-pet-tracker@0.0.1 lint /home/claude/sites/Pet-Tracker/backend-pet-tracker
> eslint "{src,apps,libs,test}/**/*.ts" --fix
```

`r4-green-mt`: exit=0.

```text
Test Suites: 1 passed, 1 total
Tests:       5 passed, 5 total
```

`r4-green-nut`: exit=0.

```text
Test Suites: 2 passed, 2 total
Tests:       45 passed, 45 total
```

`r4-green-tsc`: exit=0.

```text
(sin salida)
```

`r4-green-lint`: exit=0.

```text
> backend-pet-tracker@0.0.1 lint /home/claude/sites/Pet-Tracker/backend-pet-tracker
> eslint "{src,apps,libs,test}/**/*.ts" --fix
```

## R5

`r5-red-unit`: exit=1.

```text
FAIL src/modules/nutrition/application/use-cases/move-meal-time.use-case.spec.ts
  ● R5 (meal-schedule-editing #103): el use case mueve la servida del dia civil del owner › 2026-12-31T10:30:00Z en Pacific/Kiritimati mueve el dia 2027-01-01

    expect(jest.fn()).toHaveBeenCalledWith(...expected)

    Expected: ObjectContaining {"mealTimes": ["08:15", "19:30"]}, {"from": "07:30", "servedOn": "2027-01-01", "to": "08:15"}

    Number of calls: 0

  ● R5 (meal-schedule-editing #103): el use case mueve la servida del dia civil del owner › 2026-12-31T10:30:00Z en America/Mexico_City mueve el dia 2026-12-31

    expect(jest.fn()).toHaveBeenCalledWith(...expected)

    Expected: ObjectContaining {"mealTimes": ["08:15", "19:30"]}, {"from": "07:30", "servedOn": "2026-12-31", "to": "08:15"}

    Number of calls: 0

  ● R5 (meal-schedule-editing #103): el use case mueve la servida del dia civil del owner › 2027-01-01T03:00:00Z en America/Mexico_City mueve el dia 2026-12-31

    expect(jest.fn()).toHaveBeenCalledWith(...expected)

    Expected: ObjectContaining {"mealTimes": ["08:15", "19:30"]}, {"from": "07:30", "servedOn": "2026-12-31", "to": "08:15"}

    Number of calls: 0

  ● R5 (meal-schedule-editing #103): el use case mueve la servida del dia civil del owner › 2027-01-01T03:00:00Z en UTC mueve el dia 2027-01-01

    expect(jest.fn()).toHaveBeenCalledWith(...expected)

    Expected: ObjectContaining {"mealTimes": ["08:15", "19:30"]}, {"from": "07:30", "servedOn": "2027-01-01", "to": "08:15"}

    Number of calls: 0

  ● R5 (meal-schedule-editing #103): el use case mueve la servida del dia civil del owner › 2026-11-30T23:30:00Z en Asia/Tokyo mueve el dia 2026-12-01

    expect(jest.fn()).toHaveBeenCalledWith(...expected)

    Expected: ObjectContaining {"mealTimes": ["08:15", "19:30"]}, {"from": "07:30", "servedOn": "2026-12-01", "to": "08:15"}

    Number of calls: 0

Test Suites: 1 failed, 1 total
Tests:       5 failed, 5 total
```

`r5-red-mt`: exit=1.

```text
FAIL test/meal-times.e2e-spec.ts
  ● Meal schedule editing (e2e) › R5 (meal-schedule-editing #103): la servida de hoy se mueve con su franja y los dias pasados no › mueve la de hoy en los dos extremos de zona y deja la de ayer

    expect(received).toEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 1

    @@ -8,11 +8,11 @@
          "servedOn": "2026-10-02",
        },
        Object {
          "createdBy": "01a0fd7e-13c8-77cd-8813-26cf57a1bee5",
          "id": "01a0fd7e-1401-7b8b-a71e-7c3154bdb85e",
    -     "mealTime": "08:15",
    +     "mealTime": "07:30",
          "petId": "01a0fd7e-13cf-77e7-86ce-ffeb1737db73",
          "servedAt": 2026-10-02T16:41:33.442Z,
          "servedOn": "2026-10-03",
        },
      ]

Test Suites: 1 failed, 1 total
Tests:       1 failed, 6 passed, 7 total
```

`r5-red-lint`: exit=0.

```text
> backend-pet-tracker@0.0.1 lint /home/claude/sites/Pet-Tracker/backend-pet-tracker
> eslint "{src,apps,libs,test}/**/*.ts" --fix
```

`r5-green-unit`: exit=0.

```text
Test Suites: 1 passed, 1 total
Tests:       5 passed, 5 total
```

`r5-green-mt`: exit=0.

```text
Test Suites: 1 passed, 1 total
Tests:       7 passed, 7 total
```

`r5-green-nut`: exit=0.

```text
Test Suites: 2 passed, 2 total
Tests:       45 passed, 45 total
```

`r5-green-tsc`: exit=0.

```text
(sin salida)
```

`r5-green-lint`: exit=0.

```text
> backend-pet-tracker@0.0.1 lint /home/claude/sites/Pet-Tracker/backend-pet-tracker
> eslint "{src,apps,libs,test}/**/*.ts" --fix
```

## R6

`r6-red-mt`: exit=1.

```text
FAIL test/meal-times.e2e-spec.ts
  ● Meal schedule editing (e2e) › R6 (meal-schedule-editing #103): si el destino ya tiene servida hoy, gana la del destino › fusiona: queda la fila del destino y se borra la del origen

    expected 200 "OK", got 500 "Internal Server Error"

Test Suites: 1 failed, 1 total
Tests:       1 failed, 9 passed, 10 total
```

`r6-red-lint`: exit=0.

```text
> backend-pet-tracker@0.0.1 lint /home/claude/sites/Pet-Tracker/backend-pet-tracker
> eslint "{src,apps,libs,test}/**/*.ts" --fix
```

`r6-green-mt`: exit=0.

```text
Test Suites: 1 passed, 1 total
Tests:       10 passed, 10 total
```

`r6-green-nut`: exit=0.

```text
Test Suites: 2 passed, 2 total
Tests:       45 passed, 45 total
```

`r6-green-tsc`: exit=0.

```text
(sin salida)
```

`r6-green-lint`: exit=0.

```text
> backend-pet-tracker@0.0.1 lint /home/claude/sites/Pet-Tracker/backend-pet-tracker
> eslint "{src,apps,libs,test}/**/*.ts" --fix
```

## R7

Incidencia de preparación (sin commit; no cuenta como rojo C4): al copiar el fixture se dejó un fragmento `findOwnerTimezone` del doble de pets en el spec de add. Primera corrida unit: exit=1, TS1109/TS1434/TS1128 (suite add no ejecutada), 1 failed / 6 passed de move. Lint: exit=1, Parsing error: Expression expected. Se eliminó el fragmento sobrante antes de medir el rojo válido, sin cambiar aserciones ni producción. Logs diagnósticos en `/tmp/meal103-r7-diagnostic-unit.log` y `/tmp/meal103-r7-diagnostic-lint.log`.

`r7-red-unit`: exit=1.

```text
FAIL src/modules/nutrition/application/use-cases/move-meal-time.use-case.spec.ts
  ● R7 (meal-schedule-editing #103): meal_time.move se audita despues de escribir y nunca si falla › audita el id nuevo despues de resolver la escritura

    expect(jest.fn()).toHaveBeenCalledTimes(expected)

    Expected number of calls: 1
    Received number of calls: 0

FAIL src/modules/nutrition/application/use-cases/add-meal-time.use-case.spec.ts
  ● R7 (meal-schedule-editing #103): meal_time.add se audita despues de escribir y nunca si falla › audita el id nuevo despues de resolver la escritura

    expect(jest.fn()).toHaveBeenCalledTimes(expected)

    Expected number of calls: 1
    Received number of calls: 0

Test Suites: 2 failed, 2 total
Tests:       2 failed, 7 passed, 9 total
```

`r7-red-mt`: exit=1.

```text
FAIL test/meal-times.e2e-spec.ts
  ● Meal schedule editing (e2e) › R7 (meal-schedule-editing #103): POST y PATCH dejan filas meal_time.add y meal_time.move en audit_log › POST audita actor, plan nuevo y hora anadida

    expect(received).toEqual(expected) // deep equality

    - Expected  - 11
    + Received  +  1

    - Array [
    -   Object {
    -     "entity": "nutrition_plan",
    -     "entityId": "01a0fd82-203e-78f2-9e7f-b77c8042c01b",
    -     "meta": Object {
    -       "mealTime": "12:00",
    -       "petId": "01a0fd82-200b-780c-8eb1-89d35f2282b0",
    -     },
    -     "userId": "01a0fd82-2004-73f9-9382-c3f67c0abf06",
    -   },
    - ]
    + Array []

  ● Meal schedule editing (e2e) › R7 (meal-schedule-editing #103): POST y PATCH dejan filas meal_time.add y meal_time.move en audit_log › PATCH audita actor, plan nuevo, origen, destino y dia

    expect(received).toEqual(expected) // deep equality

    - Expected  - 13
    + Received  +  1

    - Array [
    -   Object {
    -     "entity": "nutrition_plan",
    -     "entityId": "01a0fd82-2092-730a-a340-127bb389136f",
    -     "meta": Object {
    -       "from": "07:30",
    -       "petId": "01a0fd82-2051-7caf-9922-d98e217033a6",
    -       "servedOn": "2026-10-02",
    -       "to": "08:15",
    -     },
    -     "userId": "01a0fd82-204a-765a-8d16-71ee0c798555",
    -   },
    - ]
    + Array []

Test Suites: 1 failed, 1 total
Tests:       2 failed, 10 passed, 12 total
```

`r7-red-lint`: exit=0.

```text
> backend-pet-tracker@0.0.1 lint /home/claude/sites/Pet-Tracker/backend-pet-tracker
> eslint "{src,apps,libs,test}/**/*.ts" --fix
```

`r7-green-unit`: exit=0.

```text
Test Suites: 2 passed, 2 total
Tests:       9 passed, 9 total
```

`r7-green-mt`: exit=0.

```text
Test Suites: 1 passed, 1 total
Tests:       12 passed, 12 total
```

`r7-green-nut`: exit=0.

```text
Test Suites: 2 passed, 2 total
Tests:       45 passed, 45 total
```

`r7-green-tsc`: exit=0.

```text
(sin salida)
```

`r7-green-lint`: exit=0.

```text
> backend-pet-tracker@0.0.1 lint /home/claude/sites/Pet-Tracker/backend-pet-tracker
> eslint "{src,apps,libs,test}/**/*.ts" --fix
```

## R8

Reanudación autorizada por el humano con la enmienda E1. Sin skills cargadas.

Salidas exigidas al reanudar:

```text
feature/103-meal-schedule-editing
d5cdede081c84fdeca5e82410cf674c24d1a4222
d5cdede0 docs(spec): amend #103 R8 red to include it 2 (E1)
78a85563 feat(meal-schedule-editing): audit meal_time.add and meal_time.move (R7)
ffb56bd1 test(meal-schedule-editing): lock meal_time audit after write (R7)
```

Padre de HEAD: `78a855637692764811c364701215f40d0df5a3d0` (R7 verde), comprobado. H0 se mantiene en `2ae639562b03e838f4cb83e13f8e233c97f130f0`. E1 corrige solo el rojo declarado: los tres it deben caer por matcher, Received 201 / 200 / 422, Expected 400. El pgrep de reanudación salió vacío, exit=1.

`r8-red-mt`: exit=1.

```text
FAIL test/meal-times.e2e-spec.ts
  ● Meal schedule editing (e2e) › R8 (meal-schedule-editing #103): body invalido responde 400 antes de leer el plan › POST rechaza cada body de la lista

    expected 400 "Bad Request", got 201 "Created"

  ● Meal schedule editing (e2e) › R8 (meal-schedule-editing #103): body invalido responde 400 antes de leer el plan › PATCH rechaza cada body de la lista

    expected 400 "Bad Request", got 200 "OK"

  ● Meal schedule editing (e2e) › R8 (meal-schedule-editing #103): body invalido responde 400 antes de leer el plan › sin plan tambien es 400 y meals conserva su patron

    expected 400 "Bad Request", got 422 "Unprocessable Entity"

Test Suites: 1 failed, 1 total
Tests:       3 failed, 12 passed, 15 total
```

`r8-red-lint`: exit=0.

```text
> backend-pet-tracker@0.0.1 lint /home/claude/sites/Pet-Tracker/backend-pet-tracker
> eslint "{src,apps,libs,test}/**/*.ts" --fix
```

`r8-green-mt`: exit=0.

```text
Test Suites: 1 passed, 1 total
Tests:       15 passed, 15 total
```

`r8-green-nut`: exit=0.

```text
Test Suites: 2 passed, 2 total
Tests:       45 passed, 45 total
```

`r8-green-tsc`: exit=0.

```text
(sin salida)
```

`r8-green-lint`: exit=0.

```text
> backend-pet-tracker@0.0.1 lint /home/claude/sites/Pet-Tracker/backend-pet-tracker
> eslint "{src,apps,libs,test}/**/*.ts" --fix
```

## R9

En curso tras R8 verde y E1.

`r9-red-unit`: exit=1.

```text
FAIL src/modules/nutrition/application/use-cases/add-meal-time.use-case.spec.ts
  ● R9 (meal-schedule-editing #103): el POST lanza en orden sin escribir ni auditar › el duplicado gana al limite de seis

    expect(received).rejects.toMatchObject()

    Received promise resolved instead of rejected
    Resolved to value: {"aiExplanation": null, "dailyGrams": 305, "engineMealsPerDay": 2, "generatedAt": 2026-10-02T00:00:00.000Z, "id": "created", "inputsHash": "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff", "mealTimes": ["08:15", "19:30"], "mealsPerDay": 2, "merKcal": 1059, "objective": "maintenance", "petId": "pet", "rerKcal": 662, "warnings": []}

  ● R9 (meal-schedule-editing #103): el POST lanza en orden sin escribir ni auditar › una hora nueva con seis comidas lanza MealTimesLimitReachedError

    expect(received).rejects.toMatchObject()

    Received promise resolved instead of rejected
    Resolved to value: {"aiExplanation": null, "dailyGrams": 305, "engineMealsPerDay": 2, "generatedAt": 2026-10-02T00:00:00.000Z, "id": "created", "inputsHash": "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff", "mealTimes": ["08:15", "19:30"], "mealsPerDay": 2, "merKcal": 1059, "objective": "maintenance", "petId": "pet", "rerKcal": 662, "warnings": []}

FAIL src/modules/nutrition/application/use-cases/move-meal-time.use-case.spec.ts
  ● R9 (meal-schedule-editing #103): el PATCH lanza en orden sin escribir ni auditar › el origen fuera gana al destino duplicado

    expect(received).rejects.toMatchObject()

    Received promise resolved instead of rejected
    Resolved to value: {"aiExplanation": null, "dailyGrams": 305, "engineMealsPerDay": 2, "generatedAt": 2026-10-02T00:00:00.000Z, "id": "created", "inputsHash": "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff", "mealTimes": ["08:15", "19:30"], "mealsPerDay": 2, "merKcal": 1059, "objective": "maintenance", "petId": "pet", "rerKcal": 662, "warnings": []}

  ● R9 (meal-schedule-editing #103): el PATCH lanza en orden sin escribir ni auditar › origen igual al destino lanza MealTimeDuplicateError

    expect(received).rejects.toMatchObject()

    Received promise resolved instead of rejected
    Resolved to value: {"aiExplanation": null, "dailyGrams": 305, "engineMealsPerDay": 2, "generatedAt": 2026-10-02T00:00:00.000Z, "id": "created", "inputsHash": "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff", "mealTimes": ["08:15", "19:30"], "mealsPerDay": 2, "merKcal": 1059, "objective": "maintenance", "petId": "pet", "rerKcal": 662, "warnings": []}

  ● R9 (meal-schedule-editing #103): el PATCH lanza en orden sin escribir ni auditar › destino ya en el plan lanza MealTimeDuplicateError

    expect(received).rejects.toMatchObject()

    Received promise resolved instead of rejected
    Resolved to value: {"aiExplanation": null, "dailyGrams": 305, "engineMealsPerDay": 2, "generatedAt": 2026-10-02T00:00:00.000Z, "id": "created", "inputsHash": "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff", "mealTimes": ["08:15", "19:30"], "mealsPerDay": 2, "merKcal": 1059, "objective": "maintenance", "petId": "pet", "rerKcal": 662, "warnings": []}

Test Suites: 2 failed, 2 total
Tests:       5 failed, 11 passed, 16 total
```

`r9-red-mt`: exit=1.

```text
FAIL test/meal-times.e2e-spec.ts
  ● Meal schedule editing (e2e) › R9 (meal-schedule-editing #103): 422 con code propio y sin persistir › PATCH: origen fuera del plan, destino repetido o igual

    expected 422 "Unprocessable Entity", got 200 "OK"

  ● Meal schedule editing (e2e) › R9 (meal-schedule-editing #103): 422 con code propio y sin persistir › POST: duplicado y limite de seis

    expected 422 "Unprocessable Entity", got 201 "Created"

Test Suites: 1 failed, 1 total
Tests:       2 failed, 16 passed, 18 total
```

`r9-red-lint`: exit=0.

```text
> backend-pet-tracker@0.0.1 lint /home/claude/sites/Pet-Tracker/backend-pet-tracker
> eslint "{src,apps,libs,test}/**/*.ts" --fix
```

`r9-green-unit`: exit=0.

```text
Test Suites: 2 passed, 2 total
Tests:       16 passed, 16 total
```

`r9-green-mt`: exit=0.

```text
Test Suites: 1 passed, 1 total
Tests:       18 passed, 18 total
```

`r9-green-nut`: exit=0.

```text
Test Suites: 2 passed, 2 total
Tests:       45 passed, 45 total
```

`r9-green-tsc`: exit=0.

```text
(sin salida)
```

`r9-green-lint`: exit=0.

```text
> backend-pet-tracker@0.0.1 lint /home/claude/sites/Pet-Tracker/backend-pet-tracker
> eslint "{src,apps,libs,test}/**/*.ts" --fix
```

## R10

Reanudado tras R9 verde: rojo de owner-only y verde con ambos decoradores.

`r10-red-mt`: exit=1.

```text
FAIL test/meal-times.e2e-spec.ts
  ● Meal schedule editing (e2e) › R10 (meal-schedule-editing #103): solo el owner edita; 404 del guard precede › family, walker y vet reciben 403 incluso con body vacio

    expected 403 "Forbidden", got 201 "Created"

Test Suites: 1 failed, 1 total
Tests:       1 failed, 19 passed, 20 total
```

`r10-red-lint`: exit=0.

```text
> backend-pet-tracker@0.0.1 lint /home/claude/sites/Pet-Tracker/backend-pet-tracker
> eslint "{src,apps,libs,test}/**/*.ts" --fix
```

`r10-green-mt`: exit=0.

```text
Test Suites: 1 passed, 1 total
Tests:       20 passed, 20 total
```

`r10-green-nut`: exit=0.

```text
Test Suites: 2 passed, 2 total
Tests:       45 passed, 45 total
```

`r10-green-tsc`: exit=0.

```text
(sin salida)
```

`r10-green-lint`: exit=0.

```text
> backend-pet-tracker@0.0.1 lint /home/claude/sites/Pet-Tracker/backend-pet-tracker
> eslint "{src,apps,libs,test}/**/*.ts" --fix
```

## R11

Reanudación autorizada por el handoff R11 y la enmienda E2 del leader. Skills cargadas: ninguna.

```text
$ pwd
/home/claude/sites/Pet-Tracker
$ git branch --show-current
feature/103-meal-schedule-editing
$ git rev-parse HEAD
9c7a358b889cdb3a50d446dc0d721f7454cb0fca
$ git log --oneline -3
9c7a358b docs(spec): amend #103 R11 red drag and probe criterion (E2)
7b44b604 feat(meal-schedule-editing): restrict meal-times edits to owner (R10)
9c32efc4 test(meal-schedule-editing): lock owner-only meal-times edits (R10)
$ git rev-parse HEAD^
7b44b6040cb855beb504cd105bfd5faed99c33db
$ pgrep -af 'init\.sh|test:e2e|jest-e2e' | grep -v pgrep
(sin salida); exit=1
```

La E2 declara el arrastre de R5 it 1 y R6 it 1–3 de #103, R11 propio y R10 it 4 de #83. La medida del rojo se añade debajo.

`r11-red-mt`: exit=1.

```text
FAIL test/meal-times.e2e-spec.ts
  ● Meal schedule editing (e2e) › R5 (meal-schedule-editing #103): la servida de hoy se mueve con su franja y los dias pasados no › mueve la de hoy en los dos extremos de zona y deja la de ayer

    expect(received).toHaveProperty(path, value)

    Expected path: "mealsToday"

    - Expected value  - 1
    + Received value  + 1

      Object {
    -   "served": 1,
    +   "served": 0,
        "total": 2,
      }

  ● Meal schedule editing (e2e) › R6 (meal-schedule-editing #103): si el destino ya tiene servida hoy, gana la del destino › fusiona: queda la fila del destino y se borra la del origen

    expect(received).toHaveProperty(path, value)

    Expected path: "mealsToday"

    - Expected value  - 1
    + Received value  + 1

      Object {
    -   "served": 1,
    +   "served": 0,
        "total": 2,
      }

  ● Meal schedule editing (e2e) › R6 (meal-schedule-editing #103): si el destino ya tiene servida hoy, gana la del destino › mover a una hora con huerfana la revive

    expect(received).toHaveProperty(path, value)

    Expected path: "mealsToday"

    - Expected value  - 1
    + Received value  + 1

      Object {
    -   "served": 1,
    +   "served": 0,
        "total": 2,
      }

  ● Meal schedule editing (e2e) › R6 (meal-schedule-editing #103): si el destino ya tiene servida hoy, gana la del destino › anadir una hora con huerfana la revive

    expect(received).toHaveProperty(path, value)

    Expected path: "mealsToday"

    - Expected value  - 2
    + Received value  + 2

      Object {
    -   "served": 1,
    -   "total": 3,
    +   "served": 0,
    +   "total": 2,
      }

  ● Meal schedule editing (e2e) › R11 (meal-schedule-editing #103): servir, deshacer, GET del plan y perfil leen el plan editado › servir, mover y deshacer usan las franjas del plan editado

    expect(received).toHaveProperty(path, value)

    Expected path: "mealsToday"

    - Expected value  - 2
    + Received value  + 2

      Object {
    -   "served": 1,
    -   "total": 3,
    +   "served": 0,
    +   "total": 2,
      }

Test Suites: 1 failed, 1 total
Tests:       5 failed, 16 passed, 21 total
```

`r11-red-nut`: exit=1.

```text
FAIL test/meals.e2e-spec.ts
  ● Meals served tracking (e2e) › R10 (meals-served-tracking #83): GET perfil devuelve mealsToday y el listado lo deja en null › excluye las franjas del plan anterior tras regenerar

    expect(received).toEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 1

      Object {
        "served": 1,
    -   "total": 3,
    +   "total": 2,
      }

Test Suites: 1 failed, 1 passed, 2 total
Tests:       1 failed, 44 passed, 45 total
```

`r11-red-lint`: exit=0.

```text
> backend-pet-tracker@0.0.1 lint /home/claude/sites/Pet-Tracker/backend-pet-tracker
> eslint "{src,apps,libs,test}/**/*.ts" --fix
```

`r11-green-mt`: exit=0.

```text
Test Suites: 1 passed, 1 total
Tests:       21 passed, 21 total
```

`r11-green-nut`: exit=0.

```text
Test Suites: 2 passed, 2 total
Tests:       45 passed, 45 total
```

`r11-green-tsc`: exit=0.

```text
(sin salida)
```

`r11-green-lint`: exit=0.

```text
> backend-pet-tracker@0.0.1 lint /home/claude/sites/Pet-Tracker/backend-pet-tracker
> eslint "{src,apps,libs,test}/**/*.ts" --fix
```

R11 verde: reader restaurado con `git show 9c7a358b889cdb3a50d446dc0d721f7454cb0fca:backend-pet-tracker/src/modules/nutrition/infrastructure/repositories/pet-meals.drizzle-reader.ts > <ruta>`. Tras el commit verde, ambos diffs contra el padre del rojo y H0 están vacíos, exit=0.

| Arrastre medido E2 | Matcher | Expected mealsToday | Received mealsToday |
|---|---|---|---|
| R5 it 1: mueve la de hoy en los dos extremos de zona y deja la de ayer | toHaveProperty | {served:1,total:2} | {served:0,total:2} |
| R6 it 1: fusiona: queda la fila del destino y se borra la del origen | toHaveProperty | {served:1,total:2} | {served:0,total:2} |
| R6 it 2: mover a una hora con huerfana la revive | toHaveProperty | {served:1,total:2} | {served:0,total:2} |
| R6 it 3: anadir una hora con huerfana la revive | toHaveProperty | {served:1,total:3} | {served:0,total:2} |
| R11: servir, mover y deshacer usan las franjas del plan editado | toHaveProperty | {served:1,total:3} | {served:0,total:2} |
| R10 it 4 #83: excluye las franjas del plan anterior tras regenerar | toEqual | {served:1,total:3} | {served:1,total:2} |

## R12

R12 rojo y verde completados tras la reanudación E2; mutación y restauración versionadas, evidencia debajo.

`r12-red-mt`: exit=1.

```text
FAIL test/meal-times.e2e-spec.ts
  ● Meal schedule editing (e2e) › R12 (meal-schedule-editing #103): la copia conserva inputsHash y aiExplanation y generate la devuelve › hereda la explicacion y el hash y generate devuelve la misma copia

    expect(received).toBe(expected) // Object.is equality

    Expected: "explicacion previa"
    Received: null

Test Suites: 1 failed, 1 total
Tests:       1 failed, 21 passed, 22 total
```

`r12-red-unit`: exit=1.

```text
FAIL src/modules/nutrition/domain/entities/nutrition-plan.entity.spec.ts
  ● R3 (meal-schedule-editing #103): copyWithMealTimes ordena, recuenta y resuelve el numero del motor › copia los campos completos, ordena, recuenta y resuelve el motor

    expect(received).toStrictEqual(expected) // deep equality

    - Expected  - 2
    + Received  + 2

    @@ -1,10 +1,10 @@
      Object {
    -   "aiExplanation": "texto",
    +   "aiExplanation": null,
        "dailyGrams": 305,
        "engineMealsPerDay": 2,
    -   "inputsHash": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    +   "inputsHash": "0000000000000000000000000000000000000000000000000000000000000000",
        "mealTimes": Array [
          "07:30",
          "12:00",
          "19:30",
        ],

Test Suites: 1 failed, 1 total
Tests:       1 failed, 9 passed, 10 total
```

`r12-red-lint`: exit=0.

```text
> backend-pet-tracker@0.0.1 lint /home/claude/sites/Pet-Tracker/backend-pet-tracker
> eslint "{src,apps,libs,test}/**/*.ts" --fix
```

`r12-green-mt`: exit=0.

```text
Test Suites: 1 passed, 1 total
Tests:       22 passed, 22 total
```

`r12-green-nut`: exit=0.

```text
Test Suites: 2 passed, 2 total
Tests:       45 passed, 45 total
```

`r12-green-unit`: exit=0.

```text
Test Suites: 1 passed, 1 total
Tests:       10 passed, 10 total
```

`r12-green-tsc`: exit=0.

```text
(sin salida)
```

`r12-green-lint`: exit=0.

```text
> backend-pet-tracker@0.0.1 lint /home/claude/sites/Pet-Tracker/backend-pet-tracker
> eslint "{src,apps,libs,test}/**/*.ts" --fix
```

R12 verde: `git show caa769d2c584552646429aa24ac63ccb0813222e:backend-pet-tracker/src/modules/nutrition/domain/entities/nutrition-plan.entity.ts > <ruta>` restaura la entidad exactamente al padre del rojo. Tras el commit verde, `git diff caa769d2c584552646429aa24ac63ccb0813222e HEAD -- backend-pet-tracker/src/modules/nutrition/domain/entities/nutrition-plan.entity.ts` sin salida, exit=0.

## R13

Solo se ejecutó la aplicación inicial de 0018 exigida por §Orden, antes de R2 (salida abajo). Recuento posterior: 19 migraciones.
(a) 1–7: medidos tras R12 y S1–S20; salida completa debajo. (a) 8: `pnpm test:e2e` completo — **delegado al leader**. (a) 9: `./init.sh` — **delegado al leader**.
(a) 8 y 9: **delegado al leader** (E2E completo e init.sh, por instrucción del humano).
(b) Docs literales: no iniciadas.
(c) Traceability: sin editar; se reserva para el último commit, como pidió el humano.

`order-migrate`: exit=0.

```text
> backend-pet-tracker@0.0.1 db:migrate /home/claude/sites/Pet-Tracker/backend-pet-tracker
> drizzle-kit migrate

No config path provided, using default 'drizzle.config.ts'
Reading config file '/home/claude/sites/Pet-Tracker/backend-pet-tracker/drizzle.config.ts'
◇ injected env (21) from ../.env // tip: ⌘ custom filepath { path: '/custom/path/.env' }
Using 'pg' driver for database querying
[⣷] applying migrations...[✓] migrations applied successfully!
```

`r13-a1-migrate`: exit=0.

```text
> backend-pet-tracker@0.0.1 db:migrate /home/claude/sites/Pet-Tracker/backend-pet-tracker
> drizzle-kit migrate

No config path provided, using default 'drizzle.config.ts'
Reading config file '/home/claude/sites/Pet-Tracker/backend-pet-tracker/drizzle.config.ts'
◇ injected env (21) from ../.env // tip: ⌘ multiple files { path: ['.env.local', '.env'] }
Using 'pg' driver for database querying
[⣷] applying migrations...[✓] migrations applied successfully!
```

`r13-a2-migrate`: exit=0.

```text
> backend-pet-tracker@0.0.1 db:migrate /home/claude/sites/Pet-Tracker/backend-pet-tracker
> drizzle-kit migrate

No config path provided, using default 'drizzle.config.ts'
Reading config file '/home/claude/sites/Pet-Tracker/backend-pet-tracker/drizzle.config.ts'
◇ injected env (21) from ../.env // tip: ⌘ custom filepath { path: '/custom/path/.env' }
Using 'pg' driver for database querying
[⣷] applying migrations...[✓] migrations applied successfully!
```

`r13-a3-column`: exit=0.

```text
engine_meals_per_day|integer|YES
```

`r13-a4-count`: exit=0.

```text
19
```

`r13-a5-generate`: exit=0.

```text
> backend-pet-tracker@0.0.1 db:generate /home/claude/sites/Pet-Tracker/backend-pet-tracker
> drizzle-kit generate

No config path provided, using default 'drizzle.config.ts'
Reading config file '/home/claude/sites/Pet-Tracker/backend-pet-tracker/drizzle.config.ts'
◇ injected env (21) from ../.env // tip: ⌘ suppress logs { quiet: true }
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
nutrition_plans 13 columns 1 indexes 1 fks
nutrition_profiles 10 columns 0 indexes 1 fks
password_reset_tokens 6 columns 1 indexes 1 fks
pet_users 6 columns 1 indexes 2 fks
pets 18 columns 0 indexes 0 fks
push_tokens 6 columns 1 indexes 1 fks
reminders 11 columns 3 indexes 2 fks
device_subscriptions 6 columns 0 indexes 1 fks
users 12 columns 0 indexes 0 fks

No schema changes, nothing to migrate 😴
```

`r13-a5-status`: exit=0.

```text
(sin salida)
```

`r13-a6-journal`: exit=0.

```text
19
```

`r13-a6-main`: exit=0.

```text
18
```

`r13-a7-unit`: exit=0.

```text
Test Suites: 174 passed, 174 total
Tests:       1335 passed, 1335 total
```

`r13-mt`: exit=0.

```text
Test Suites: 1 passed, 1 total
Tests:       22 passed, 22 total
```

`r13-nut`: exit=0.

```text
Test Suites: 2 passed, 2 total
Tests:       45 passed, 45 total
```

`r13-tsc`: exit=0.

```text
(sin salida)
```

`r13-lint`: exit=0.

```text
> backend-pet-tracker@0.0.1 lint /home/claude/sites/Pet-Tracker/backend-pet-tracker
> eslint "{src,apps,libs,test}/**/*.ts" --fix
```

`r13-sql`: exit=0.

```text
ALTER TABLE "nutrition_plans" ADD COLUMN "engine_meals_per_day" integer;
```

## §Sondas

Sobre R12 verde, una mutación a la vez; restauración siempre con `git checkout HEAD -- <ruta>`. E2: los rojos exigidos son mínimos; los adicionales por matcher se registran. El informe sigue sin versionar hasta el último commit: se mueve temporalmente a `/tmp/meal103-impl.md` para poder medir `git status --short` vacío antes/después de cada sonda. Se devuelve al mismo sitio tras S20.

S12 adelanta la auditoría utilizando el id del plan origen: todavía no existe el id de la copia. Permite medir el orden sin introducir ReferenceError ni modificar los tests.

<!-- tabla-sondas -->
| Sonda | Mutacion | Ficheros corridos | Resultado | Exigido cumplido | Otros rojos |
|---|---|---|---|---|---|
| S1 | engineMealsPerDay.notNull() | src/db/schema/nutrition.schema.spec.ts | unit: exit=1; Test Suites: 1 failed, 1 total; Tests:       1 failed, 4 passed, 5 total | Sí, todos por matcher | Ninguno |
| S2 | 0018 integer → bigint | src/db/schema/nutrition.schema.spec.ts | unit: exit=1; Test Suites: 1 failed, 1 total; Tests:       1 failed, 4 passed, 5 total | Sí, todos por matcher | Ninguno |
| S3 | carriedSchedule compara latest.mealsPerDay | src/modules/nutrition/domain/entities/nutrition-plan.entity.spec.ts, test/meal-times.e2e-spec.ts | unit: exit=1; Test Suites: 1 failed, 1 total; Tests:       2 failed, 8 passed, 10 total; mt: exit=1; Test Suites: 1 failed, 1 total; Tests:       2 failed, 20 passed, 22 total | Sí, todos por matcher; restantes unit verdes | Ninguno |
| S4 | toPlan engineMealsPerDay:null | test/meal-times.e2e-spec.ts | mt: exit=1; Test Suites: 1 failed, 1 total; Tests:       2 failed, 20 passed, 22 total | Sí, todos por matcher | R2 (meal-schedule-editing #103): generate conserva el horario editado mientras el motor no cambie el numero de comidas › gato: pasa a actividad alta, el motor sube a 3 y vuelve el horario del motor; expect(received).toMatchObject(expected) - Expected  - 1 + Received  + 1 Object { "mealTimes": Array [ "07:30", -     "14:00", +     "12:00", "19:30", ], "mealsPerDay": 3, } |
| S5 | copyWithMealTimes sin sort | src/modules/nutrition/domain/entities/nutrition-plan.entity.spec.ts, test/meal-times.e2e-spec.ts | unit: exit=1; Test Suites: 1 failed, 1 total; Tests:       1 failed, 9 passed, 10 total; mt: exit=1; Test Suites: 1 failed, 1 total; Tests:       3 failed, 19 passed, 22 total | Sí, todos por matcher | R3 (meal-schedule-editing #103): POST meal-times anade una franja como copia nueva del plan › un plan anterior a 0018 resuelve el numero del motor con meals_per_day; expect(received).toMatchObject(expected) - Expected  - 1 + Received  + 1 Object { "mealTimes": Array [ "08:00", -     "13:00", "20:00", +     "13:00", ], }<br>R4 (meal-schedule-editing #103): PATCH meal-times mueve una franja como copia nueva del plan › mueve dos franjas seguidas y reordena; expect(received).toMatchObject(expected) - Expected  - 1 + Received  + 1 Object { "mealTimes": Array [ -     "06:00", "08:15", +     "06:00", ], } |
| S6 | copy engineMealsPerDay sin fallback | src/modules/nutrition/domain/entities/nutrition-plan.entity.spec.ts, test/meal-times.e2e-spec.ts | unit: exit=1; Test Suites: 1 failed, 1 total; Tests:       1 failed, 9 passed, 10 total; mt: exit=1; Test Suites: 1 failed, 1 total; Tests:       1 failed, 21 passed, 22 total | Sí, todos por matcher | Ninguno |
| S7 | append destino en lugar de reemplazar origen | test/meal-times.e2e-spec.ts | mt: exit=1; Test Suites: 1 failed, 1 total; Tests:       6 failed, 16 passed, 22 total | Sí, todos por matcher | R5 (meal-schedule-editing #103): la servida de hoy se mueve con su franja y los dias pasados no › mueve la de hoy en los dos extremos de zona y deja la de ayer; expect(received).toHaveProperty(path, value) Expected path: "mealsToday" - Expected value  - 1 + Received value  + 1 Object { "served": 1, -   "total": 2, +   "total": 3, }<br>R6 (meal-schedule-editing #103): si el destino ya tiene servida hoy, gana la del destino › fusiona: queda la fila del destino y se borra la del origen; expect(received).toHaveProperty(path, value) Expected path: "mealsToday" - Expected value  - 1 + Received value  + 1 Object { "served": 1, -   "total": 2, +   "total": 3, }<br>R6 (meal-schedule-editing #103): si el destino ya tiene servida hoy, gana la del destino › mover a una hora con huerfana la revive; expect(received).toHaveProperty(path, value) Expected path: "mealsToday" - Expected value  - 1 + Received value  + 1 Object { "served": 1, -   "total": 2, +   "total": 3, }<br>R11 (meal-schedule-editing #103): servir, deshacer, GET del plan y perfil leen el plan editado › servir, mover y deshacer usan las franjas del plan editado; expected 422 "Unprocessable Entity", got 201 "Created"<br>R12 (meal-schedule-editing #103): la copia conserva inputsHash y aiExplanation y generate la devuelve › hereda la explicacion y el hash y generate devuelve la misma copia; expect(received).toMatchObject(expected) - Expected  - 0 + Received  + 1 Object { "id": "01a0fda0-85f9-7141-bddd-0fb65b459a4b", "mealTimes": Array [ +     "07:30", "08:15", "19:30", ], } |
| S8 | día UTC en lugar del día del owner | src/modules/nutrition/application/use-cases/move-meal-time.use-case.spec.ts, test/meal-times.e2e-spec.ts | unit: exit=1; Test Suites: 1 failed, 1 total; Tests:       3 failed, 8 passed, 11 total; mt: exit=1; Test Suites: 1 failed, 1 total; Tests:       1 failed, 21 passed, 22 total | Sí, todos por matcher; filas unit 2 y 4 verdes | Ninguno |
| S9 | UPDATE sin filtro servedOn | test/meal-times.e2e-spec.ts | mt: exit=1; Test Suites: 1 failed, 1 total; Tests:       1 failed, 21 passed, 22 total | Sí, todos por matcher | Ninguno |
| S10 | UPDATE sin NOT EXISTS | test/meal-times.e2e-spec.ts | mt: exit=1; Test Suites: 1 failed, 1 total; Tests:       1 failed, 21 passed, 22 total | Sí, todos por matcher | Ninguno |
| S11 | DELETE antes del UPDATE | test/meal-times.e2e-spec.ts | mt: exit=1; Test Suites: 1 failed, 1 total; Tests:       1 failed, 21 passed, 22 total | Sí, todos por matcher | Ninguno |
| S12 | audit antes de escritura (add y move) | src/modules/nutrition/application/use-cases/add-meal-time.use-case.spec.ts, src/modules/nutrition/application/use-cases/move-meal-time.use-case.spec.ts | unit: exit=1; Test Suites: 2 failed, 2 total; Tests:       4 failed, 12 passed, 16 total | Sí, todos por matcher | Ninguno |
| S13 | audit move sin meta.servedOn | src/modules/nutrition/application/use-cases/move-meal-time.use-case.spec.ts, test/meal-times.e2e-spec.ts | unit: exit=1; Test Suites: 1 failed, 1 total; Tests:       1 failed, 10 passed, 11 total; mt: exit=1; Test Suites: 1 failed, 1 total; Tests:       1 failed, 21 passed, 22 total | Sí, todos por matcher | Ninguno |
| S14 | EditMealTimeSchema con MEAL_TIME_PATTERN | test/meal-times.e2e-spec.ts | mt: exit=1; Test Suites: 1 failed, 1 total; Tests:       3 failed, 19 passed, 22 total | Sí, todos por matcher | Ninguno |
| S15 | límite antes de duplicado | src/modules/nutrition/application/use-cases/add-meal-time.use-case.spec.ts, test/meal-times.e2e-spec.ts | unit: exit=1; Test Suites: 1 failed, 1 total; Tests:       1 failed, 4 passed, 5 total; mt: exit=1; Test Suites: 1 failed, 1 total; Tests:       1 failed, 21 passed, 22 total | Sí, todos por matcher | Ninguno |
| S16 | duplicado antes de origen fuera | src/modules/nutrition/application/use-cases/move-meal-time.use-case.spec.ts, test/meal-times.e2e-spec.ts | unit: exit=1; Test Suites: 1 failed, 1 total; Tests:       1 failed, 10 passed, 11 total; mt: exit=1; Test Suites: 1 failed, 1 total; Tests:       1 failed, 21 passed, 22 total | Sí, todos por matcher | Ninguno |
| S17 | PATCH sin RequirePetRole owner | test/meal-times.e2e-spec.ts | mt: exit=1; Test Suites: 1 failed, 1 total; Tests:       1 failed, 21 passed, 22 total | Sí, todos por matcher | Ninguno |
| S18 | serve contra MEAL_TIMES_BY_COUNT | test/meal-times.e2e-spec.ts | mt: exit=1; Test Suites: 1 failed, 1 total; Tests:       1 failed, 21 passed, 22 total | Sí, todos por matcher | Ninguno |
| S19 | copy aiExplanation:null | src/modules/nutrition/domain/entities/nutrition-plan.entity.spec.ts, test/meal-times.e2e-spec.ts | unit: exit=1; Test Suites: 1 failed, 1 total; Tests:       1 failed, 9 passed, 10 total; mt: exit=1; Test Suites: 1 failed, 1 total; Tests:       1 failed, 21 passed, 22 total | Sí, todos por matcher | Ninguno |
| S20 | copy inputsHash ceros | src/modules/nutrition/domain/entities/nutrition-plan.entity.spec.ts, test/meal-times.e2e-spec.ts | unit: exit=1; Test Suites: 1 failed, 1 total; Tests:       1 failed, 9 passed, 10 total; mt: exit=1; Test Suites: 1 failed, 1 total; Tests:       1 failed, 21 passed, 22 total | Sí, todos por matcher | Ninguno |
<!-- fin-tabla-sondas -->

S8: el clasificador del auxiliar de reporte solo reconocía `expect(received)`, y clasificó mal `expect(jest.fn()).toHaveBeenCalledWith`. La inspección del log confirma tres rojos por ese matcher, ocho unit verdes (incluidas filas 2 y 4) y un e2e rojo por `toEqual`. Se corrigió únicamente el clasificador y la tabla, sin repetir la sonda, ni tocar tests o mutación.


`S1-unit`: exit=1.

```text
FAIL src/db/schema/nutrition.schema.spec.ts
  ● R1 (meal-schedule-editing #103): columna engine_meals_per_day y migracion 0018 › declara engine_meals_per_day integer, nullable y sin default

    expect(received).toBe(expected) // Object.is equality

    Expected: false
    Received: true

Test Suites: 1 failed, 1 total
Tests:       1 failed, 4 passed, 5 total
```

Restauración S1: `git checkout HEAD -- backend-pet-tracker/src/db/schema/nutrition.schema.ts`.

```text
$ git diff --exit-code
(sin salida)
exit=0
$ git diff --cached --exit-code
(sin salida)
exit=0
$ git status --short
(sin salida)
exit=0
```

`S2-unit`: exit=1.

```text
FAIL src/db/schema/nutrition.schema.spec.ts
  ● R1 (meal-schedule-editing #103): columna engine_meals_per_day y migracion 0018 › 0018 renombrada, registrada en el journal y con el ADD COLUMN exacto

    expect(received).toBe(expected) // Object.is equality

    Expected: "ALTER TABLE \"nutrition_plans\" ADD COLUMN \"engine_meals_per_day\" integer;"
    Received: "ALTER TABLE \"nutrition_plans\" ADD COLUMN \"engine_meals_per_day\" bigint;"

Test Suites: 1 failed, 1 total
Tests:       1 failed, 4 passed, 5 total
```

Restauración S2: `git checkout HEAD -- backend-pet-tracker/src/db/migrations/0018_nutrition_plans_engine_meals.sql`.

```text
$ git diff --exit-code
(sin salida)
exit=0
$ git diff --cached --exit-code
(sin salida)
exit=0
$ git status --short
(sin salida)
exit=0
```

`S3-unit`: exit=1.

```text
FAIL src/modules/nutrition/domain/entities/nutrition-plan.entity.spec.ts
  ● R2 (meal-schedule-editing #103): engineMealCount y carriedSchedule deciden el horario del plan nuevo › anadida, motor igual

    expect(received).toEqual(expected) // deep equality

    - Expected  - 2
    + Received  + 1

      Object {
        "mealTimes": Array [
          "07:30",
    -     "12:00",
          "19:30",
        ],
    -   "mealsPerDay": 3,
    +   "mealsPerDay": 2,
      }

  ● R2 (meal-schedule-editing #103): engineMealCount y carriedSchedule deciden el horario del plan nuevo › anadida, motor cambia

    expect(received).toEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 1

      Object {
        "mealTimes": Array [
          "07:30",
    -     "14:00",
    +     "12:00",
          "19:30",
        ],
        "mealsPerDay": 3,
      }

Test Suites: 1 failed, 1 total
Tests:       2 failed, 8 passed, 10 total
```

`S3-mt`: exit=1.

```text
FAIL test/meal-times.e2e-spec.ts
  ● Meal schedule editing (e2e) › R2 (meal-schedule-editing #103): generate conserva el horario editado mientras el motor no cambie el numero de comidas › perro: cambian las kcal, el motor sigue en 2 y el horario editado se conserva

    expect(received).toEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 0

      Array [
        "07:30",
    -   "12:00",
        "19:30",
      ]

  ● Meal schedule editing (e2e) › R2 (meal-schedule-editing #103): generate conserva el horario editado mientras el motor no cambie el numero de comidas › gato: pasa a actividad alta, el motor sube a 3 y vuelve el horario del motor

    expect(received).toMatchObject(expected)

    - Expected  - 1
    + Received  + 1

      Object {
        "mealTimes": Array [
          "07:30",
    -     "14:00",
    +     "12:00",
          "19:30",
        ],
        "mealsPerDay": 3,
      }

Test Suites: 1 failed, 1 total
Tests:       2 failed, 20 passed, 22 total
```

Restauración S3: `git checkout HEAD -- backend-pet-tracker/src/modules/nutrition/domain/entities/nutrition-plan.entity.ts`.

```text
$ git diff --exit-code
(sin salida)
exit=0
$ git diff --cached --exit-code
(sin salida)
exit=0
$ git status --short
(sin salida)
exit=0
```

`S4-mt`: exit=1.

```text
FAIL test/meal-times.e2e-spec.ts
  ● Meal schedule editing (e2e) › R2 (meal-schedule-editing #103): generate conserva el horario editado mientras el motor no cambie el numero de comidas › perro: cambian las kcal, el motor sigue en 2 y el horario editado se conserva

    expect(received).toEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 0

      Array [
        "07:30",
    -   "12:00",
        "19:30",
      ]

  ● Meal schedule editing (e2e) › R2 (meal-schedule-editing #103): generate conserva el horario editado mientras el motor no cambie el numero de comidas › gato: pasa a actividad alta, el motor sube a 3 y vuelve el horario del motor

    expect(received).toMatchObject(expected)

    - Expected  - 1
    + Received  + 1

      Object {
        "mealTimes": Array [
          "07:30",
    -     "14:00",
    +     "12:00",
          "19:30",
        ],
        "mealsPerDay": 3,
      }

Test Suites: 1 failed, 1 total
Tests:       2 failed, 20 passed, 22 total
```

Restauración S4: `git checkout HEAD -- backend-pet-tracker/src/modules/nutrition/infrastructure/repositories/nutrition.drizzle.repository.ts`.

```text
$ git diff --exit-code
(sin salida)
exit=0
$ git diff --cached --exit-code
(sin salida)
exit=0
$ git status --short
(sin salida)
exit=0
```

`S5-unit`: exit=1.

```text
FAIL src/modules/nutrition/domain/entities/nutrition-plan.entity.spec.ts
  ● R3 (meal-schedule-editing #103): copyWithMealTimes ordena, recuenta y resuelve el numero del motor › copia los campos completos, ordena, recuenta y resuelve el motor

    expect(received).toStrictEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 1

    @@ -2,13 +2,13 @@
        "aiExplanation": "texto",
        "dailyGrams": 305,
        "engineMealsPerDay": 2,
        "inputsHash": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
        "mealTimes": Array [
    +     "19:30",
          "07:30",
          "12:00",
    -     "19:30",
        ],
        "mealsPerDay": 3,
        "merKcal": 1059,
        "objective": "maintenance",
        "petId": "pet",

Test Suites: 1 failed, 1 total
Tests:       1 failed, 9 passed, 10 total
```

`S5-mt`: exit=1.

```text
FAIL test/meal-times.e2e-spec.ts
  ● Meal schedule editing (e2e) › R3 (meal-schedule-editing #103): POST meal-times anade una franja como copia nueva del plan › anade 12:00 a P0, ordena y deja P0 intacto

    expect(received).toMatchObject(expected)

    - Expected  - 1
    + Received  + 1

      Object {
        "dailyGrams": 305,
        "mealTimes": Array [
          "07:30",
    -     "12:00",
          "19:30",
    +     "12:00",
        ],
        "mealsPerDay": 3,
        "merKcal": 1059,
        "rerKcal": 662,
      }

  ● Meal schedule editing (e2e) › R3 (meal-schedule-editing #103): POST meal-times anade una franja como copia nueva del plan › un plan anterior a 0018 resuelve el numero del motor con meals_per_day

    expect(received).toMatchObject(expected)

    - Expected  - 1
    + Received  + 1

      Object {
        "mealTimes": Array [
          "08:00",
    -     "13:00",
          "20:00",
    +     "13:00",
        ],
      }

  ● Meal schedule editing (e2e) › R4 (meal-schedule-editing #103): PATCH meal-times mueve una franja como copia nueva del plan › mueve dos franjas seguidas y reordena

    expect(received).toMatchObject(expected)

    - Expected  - 1
    + Received  + 1

      Object {
        "mealTimes": Array [
    -     "06:00",
          "08:15",
    +     "06:00",
        ],
      }

Test Suites: 1 failed, 1 total
Tests:       3 failed, 19 passed, 22 total
```

Restauración S5: `git checkout HEAD -- backend-pet-tracker/src/modules/nutrition/domain/entities/nutrition-plan.entity.ts`.

```text
$ git diff --exit-code
(sin salida)
exit=0
$ git diff --cached --exit-code
(sin salida)
exit=0
$ git status --short
(sin salida)
exit=0
```

`S6-unit`: exit=1.

```text
FAIL src/modules/nutrition/domain/entities/nutrition-plan.entity.spec.ts
  ● R3 (meal-schedule-editing #103): copyWithMealTimes ordena, recuenta y resuelve el numero del motor › copia los campos completos, ordena, recuenta y resuelve el motor

    expect(received).toStrictEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 1

    @@ -1,9 +1,9 @@
      Object {
        "aiExplanation": "texto",
        "dailyGrams": 305,
    -   "engineMealsPerDay": 2,
    +   "engineMealsPerDay": null,
        "inputsHash": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
        "mealTimes": Array [
          "07:30",
          "12:00",
          "19:30",

Test Suites: 1 failed, 1 total
Tests:       1 failed, 9 passed, 10 total
```

`S6-mt`: exit=1.

```text
FAIL test/meal-times.e2e-spec.ts
  ● Meal schedule editing (e2e) › R3 (meal-schedule-editing #103): POST meal-times anade una franja como copia nueva del plan › un plan anterior a 0018 resuelve el numero del motor con meals_per_day

    expect(received).toBe(expected) // Object.is equality

    Expected: 2
    Received: null

Test Suites: 1 failed, 1 total
Tests:       1 failed, 21 passed, 22 total
```

Restauración S6: `git checkout HEAD -- backend-pet-tracker/src/modules/nutrition/domain/entities/nutrition-plan.entity.ts`.

```text
$ git diff --exit-code
(sin salida)
exit=0
$ git diff --cached --exit-code
(sin salida)
exit=0
$ git status --short
(sin salida)
exit=0
```

`S7-mt`: exit=1.

```text
FAIL test/meal-times.e2e-spec.ts
  ● Meal schedule editing (e2e) › R4 (meal-schedule-editing #103): PATCH meal-times mueve una franja como copia nueva del plan › mueve dos franjas seguidas y reordena

    expect(received).toMatchObject(expected)

    - Expected  - 1
    + Received  + 2

      Object {
        "mealTimes": Array [
    +     "07:30",
          "08:15",
          "19:30",
        ],
    -   "mealsPerDay": 2,
    +   "mealsPerDay": 3,
      }

  ● Meal schedule editing (e2e) › R5 (meal-schedule-editing #103): la servida de hoy se mueve con su franja y los dias pasados no › mueve la de hoy en los dos extremos de zona y deja la de ayer

    expect(received).toHaveProperty(path, value)

    Expected path: "mealsToday"

    - Expected value  - 1
    + Received value  + 1

      Object {
        "served": 1,
    -   "total": 2,
    +   "total": 3,
      }

  ● Meal schedule editing (e2e) › R6 (meal-schedule-editing #103): si el destino ya tiene servida hoy, gana la del destino › fusiona: queda la fila del destino y se borra la del origen

    expect(received).toHaveProperty(path, value)

    Expected path: "mealsToday"

    - Expected value  - 1
    + Received value  + 1

      Object {
        "served": 1,
    -   "total": 2,
    +   "total": 3,
      }

  ● Meal schedule editing (e2e) › R6 (meal-schedule-editing #103): si el destino ya tiene servida hoy, gana la del destino › mover a una hora con huerfana la revive

    expect(received).toHaveProperty(path, value)

    Expected path: "mealsToday"

    - Expected value  - 1
    + Received value  + 1

      Object {
        "served": 1,
    -   "total": 2,
    +   "total": 3,
      }

  ● Meal schedule editing (e2e) › R11 (meal-schedule-editing #103): servir, deshacer, GET del plan y perfil leen el plan editado › servir, mover y deshacer usan las franjas del plan editado

    expected 422 "Unprocessable Entity", got 201 "Created"

  ● Meal schedule editing (e2e) › R12 (meal-schedule-editing #103): la copia conserva inputsHash y aiExplanation y generate la devuelve › hereda la explicacion y el hash y generate devuelve la misma copia

    expect(received).toMatchObject(expected)

    - Expected  - 0
    + Received  + 1

      Object {
        "id": "01a0fda0-85f9-7141-bddd-0fb65b459a4b",
        "mealTimes": Array [
    +     "07:30",
          "08:15",
          "19:30",
        ],
      }

Test Suites: 1 failed, 1 total
Tests:       6 failed, 16 passed, 22 total
```

Restauración S7: `git checkout HEAD -- backend-pet-tracker/src/modules/nutrition/application/use-cases/move-meal-time.use-case.ts`.

```text
$ git diff --exit-code
(sin salida)
exit=0
$ git diff --cached --exit-code
(sin salida)
exit=0
$ git status --short
(sin salida)
exit=0
```

`S8-unit`: exit=1.

```text
FAIL src/modules/nutrition/application/use-cases/move-meal-time.use-case.spec.ts
  ● R5 (meal-schedule-editing #103): el use case mueve la servida del dia civil del owner › 2026-12-31T10:30:00Z en Pacific/Kiritimati mueve el dia 2027-01-01

    expect(jest.fn()).toHaveBeenCalledWith(...expected)

    - Expected
    + Received

      {"aiExplanation": null, "dailyGrams": 305, "engineMealsPerDay": 2, "inputsHash": "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff", "mealTimes": ["08:15", "19:30"], "mealsPerDay": 2, "merKcal": 1059, "objective": "maintenance", "petId": "pet", "rerKcal": 662, "warnings": []},
      Object {
        "from": "07:30",
    -   "servedOn": "2027-01-01",
    +   "servedOn": "2026-12-31",
        "to": "08:15",
      },

    Number of calls: 1

  ● R5 (meal-schedule-editing #103): el use case mueve la servida del dia civil del owner › 2027-01-01T03:00:00Z en America/Mexico_City mueve el dia 2026-12-31

    expect(jest.fn()).toHaveBeenCalledWith(...expected)

    - Expected
    + Received

      {"aiExplanation": null, "dailyGrams": 305, "engineMealsPerDay": 2, "inputsHash": "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff", "mealTimes": ["08:15", "19:30"], "mealsPerDay": 2, "merKcal": 1059, "objective": "maintenance", "petId": "pet", "rerKcal": 662, "warnings": []},
      Object {
        "from": "07:30",
    -   "servedOn": "2026-12-31",
    +   "servedOn": "2027-01-01",
        "to": "08:15",
      },

    Number of calls: 1

  ● R5 (meal-schedule-editing #103): el use case mueve la servida del dia civil del owner › 2026-11-30T23:30:00Z en Asia/Tokyo mueve el dia 2026-12-01

    expect(jest.fn()).toHaveBeenCalledWith(...expected)

    - Expected
    + Received

      {"aiExplanation": null, "dailyGrams": 305, "engineMealsPerDay": 2, "inputsHash": "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff", "mealTimes": ["08:15", "19:30"], "mealsPerDay": 2, "merKcal": 1059, "objective": "maintenance", "petId": "pet", "rerKcal": 662, "warnings": []},
      Object {
        "from": "07:30",
    -   "servedOn": "2026-12-01",
    +   "servedOn": "2026-11-30",
        "to": "08:15",
      },

    Number of calls: 1

Test Suites: 1 failed, 1 total
Tests:       3 failed, 8 passed, 11 total
```

`S8-mt`: exit=1.

```text
FAIL test/meal-times.e2e-spec.ts
  ● Meal schedule editing (e2e) › R5 (meal-schedule-editing #103): la servida de hoy se mueve con su franja y los dias pasados no › mueve la de hoy en los dos extremos de zona y deja la de ayer

    expect(received).toEqual(expected) // deep equality

    - Expected  - 2
    + Received  + 2

      Array [
        Object {
          "createdBy": "01a0fda0-a8f1-712e-9fe7-3e6a3eaaa90f",
          "id": "01a0fda0-a93d-7ecf-b455-29a7b6df8eb2",
    -     "mealTime": "07:30",
    +     "mealTime": "08:15",
          "petId": "01a0fda0-a8f9-75c5-8c00-53d020777767",
          "servedAt": 2026-10-02T17:19:19.870Z,
          "servedOn": "2026-10-02",
        },
        Object {
          "createdBy": "01a0fda0-a8f3-71b2-8fa1-7a3b64272fb6",
          "id": "01a0fda0-a935-7c02-be08-9c49c3f0a01d",
    -     "mealTime": "08:15",
    +     "mealTime": "07:30",
          "petId": "01a0fda0-a8f9-75c5-8c00-53d020777767",
          "servedAt": 2026-10-02T17:19:19.863Z,
          "servedOn": "2026-10-03",
        },
      ]

Test Suites: 1 failed, 1 total
Tests:       1 failed, 21 passed, 22 total
```

Restauración S8: `git checkout HEAD -- backend-pet-tracker/src/modules/nutrition/application/use-cases/move-meal-time.use-case.ts`.

```text
$ git diff --exit-code
(sin salida)
exit=0
$ git diff --cached --exit-code
(sin salida)
exit=0
$ git status --short
(sin salida)
exit=0
```

`S9-mt`: exit=1.

```text
FAIL test/meal-times.e2e-spec.ts
  ● Meal schedule editing (e2e) › R5 (meal-schedule-editing #103): la servida de hoy se mueve con su franja y los dias pasados no › mueve la de hoy en los dos extremos de zona y deja la de ayer

    expect(received).toEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 1

    @@ -1,10 +1,10 @@
      Array [
        Object {
          "createdBy": "01a0fda1-05df-753d-950f-1e839dbe9d47",
          "id": "01a0fda1-0630-7e0c-a0c9-6ef04f25026c",
    -     "mealTime": "07:30",
    +     "mealTime": "08:15",
          "petId": "01a0fda1-05ec-7aa1-a8ba-2f1493f22b51",
          "servedAt": 2026-10-02T17:19:43.665Z,
          "servedOn": "2026-10-02",
        },
        Object {

Test Suites: 1 failed, 1 total
Tests:       1 failed, 21 passed, 22 total
```

Restauración S9: `git checkout HEAD -- backend-pet-tracker/src/modules/nutrition/infrastructure/repositories/nutrition.drizzle.repository.ts`.

```text
$ git diff --exit-code
(sin salida)
exit=0
$ git diff --cached --exit-code
(sin salida)
exit=0
$ git status --short
(sin salida)
exit=0
```

`S10-mt`: exit=1.

```text
FAIL test/meal-times.e2e-spec.ts
  ● Meal schedule editing (e2e) › R6 (meal-schedule-editing #103): si el destino ya tiene servida hoy, gana la del destino › fusiona: queda la fila del destino y se borra la del origen

    expected 200 "OK", got 500 "Internal Server Error"

Test Suites: 1 failed, 1 total
Tests:       1 failed, 21 passed, 22 total
```

Restauración S10: `git checkout HEAD -- backend-pet-tracker/src/modules/nutrition/infrastructure/repositories/nutrition.drizzle.repository.ts`.

```text
$ git diff --exit-code
(sin salida)
exit=0
$ git diff --cached --exit-code
(sin salida)
exit=0
$ git status --short
(sin salida)
exit=0
```

`S11-mt`: exit=1.

```text
FAIL test/meal-times.e2e-spec.ts
  ● Meal schedule editing (e2e) › R5 (meal-schedule-editing #103): la servida de hoy se mueve con su franja y los dias pasados no › mueve la de hoy en los dos extremos de zona y deja la de ayer

    expect(received).toEqual(expected) // deep equality

    - Expected  - 8
    + Received  + 0

    @@ -5,14 +5,6 @@
          "mealTime": "07:30",
          "petId": "01a0fda1-4015-7fef-8ae6-8e14d4c70f4d",
          "servedAt": 2026-10-02T17:19:58.545Z,
          "servedOn": "2026-10-02",
        },
    -   Object {
    -     "createdBy": "01a0fda1-400f-7978-a40c-bddcc402ac5c",
    -     "id": "01a0fda1-4047-7ef9-9e71-6b4adf6745f4",
    -     "mealTime": "08:15",
    -     "petId": "01a0fda1-4015-7fef-8ae6-8e14d4c70f4d",
    -     "servedAt": 2026-10-02T17:19:58.536Z,
    -     "servedOn": "2026-10-03",
    -   },
      ]

Test Suites: 1 failed, 1 total
Tests:       1 failed, 21 passed, 22 total
```

Restauración S11: `git checkout HEAD -- backend-pet-tracker/src/modules/nutrition/infrastructure/repositories/nutrition.drizzle.repository.ts`.

```text
$ git diff --exit-code
(sin salida)
exit=0
$ git diff --cached --exit-code
(sin salida)
exit=0
$ git status --short
(sin salida)
exit=0
```

`S12-unit`: exit=1.

```text
FAIL src/modules/nutrition/application/use-cases/move-meal-time.use-case.spec.ts
  ● R7 (meal-schedule-editing #103): meal_time.move se audita despues de escribir y nunca si falla › audita el id nuevo despues de resolver la escritura

    expect(jest.fn()).toHaveBeenCalledWith(...expected)

    - Expected
    + Received

    @@ -1,9 +1,9 @@
      Object {
        "action": "meal_time.move",
        "entity": "nutrition_plan",
    -   "entityId": "created",
    +   "entityId": "original",
        "meta": Object {
          "from": "07:30",
          "petId": "pet",
          "servedOn": "2026-10-02",
          "to": "08:15",,

    Number of calls: 1

  ● R7 (meal-schedule-editing #103): meal_time.move se audita despues de escribir y nunca si falla › no audita cuando la escritura falla

    expect(jest.fn()).not.toHaveBeenCalled()

    Expected number of calls: 0
    Received number of calls: 1

    1: {"action": "meal_time.move", "entity": "nutrition_plan", "entityId": "original", "meta": {"from": "07:30", "petId": "pet", "servedOn": "2026-10-02", "to": "08:15"}, "userId": "user"}

FAIL src/modules/nutrition/application/use-cases/add-meal-time.use-case.spec.ts
  ● R7 (meal-schedule-editing #103): meal_time.add se audita despues de escribir y nunca si falla › audita el id nuevo despues de resolver la escritura

    expect(jest.fn()).toHaveBeenCalledWith(...expected)

    - Expected
    + Received

    @@ -1,9 +1,9 @@
      Object {
        "action": "meal_time.add",
        "entity": "nutrition_plan",
    -   "entityId": "created",
    +   "entityId": "original",
        "meta": Object {
          "mealTime": "12:00",
          "petId": "pet",
        },
        "userId": "user",,

    Number of calls: 1

  ● R7 (meal-schedule-editing #103): meal_time.add se audita despues de escribir y nunca si falla › no audita cuando la escritura falla

    expect(jest.fn()).not.toHaveBeenCalled()

    Expected number of calls: 0
    Received number of calls: 1

    1: {"action": "meal_time.add", "entity": "nutrition_plan", "entityId": "original", "meta": {"mealTime": "12:00", "petId": "pet"}, "userId": "user"}

Test Suites: 2 failed, 2 total
Tests:       4 failed, 12 passed, 16 total
```

Restauración S12: `git checkout HEAD -- backend-pet-tracker/src/modules/nutrition/application/use-cases/add-meal-time.use-case.ts, backend-pet-tracker/src/modules/nutrition/application/use-cases/move-meal-time.use-case.ts`.

```text
$ git diff --exit-code
(sin salida)
exit=0
$ git diff --cached --exit-code
(sin salida)
exit=0
$ git status --short
(sin salida)
exit=0
```

`S13-unit`: exit=1.

```text
FAIL src/modules/nutrition/application/use-cases/move-meal-time.use-case.spec.ts
  ● R7 (meal-schedule-editing #103): meal_time.move se audita despues de escribir y nunca si falla › audita el id nuevo despues de resolver la escritura

    expect(jest.fn()).toHaveBeenCalledWith(...expected)

    - Expected
    + Received

    @@ -3,10 +3,9 @@
        "entity": "nutrition_plan",
        "entityId": "created",
        "meta": Object {
          "from": "07:30",
          "petId": "pet",
    -     "servedOn": "2026-10-02",
          "to": "08:15",
        },
        "userId": "user",
      },

    Number of calls: 1

Test Suites: 1 failed, 1 total
Tests:       1 failed, 10 passed, 11 total
```

`S13-mt`: exit=1.

```text
FAIL test/meal-times.e2e-spec.ts
  ● Meal schedule editing (e2e) › R7 (meal-schedule-editing #103): POST y PATCH dejan filas meal_time.add y meal_time.move en audit_log › PATCH audita actor, plan nuevo, origen, destino y dia

    expect(received).toEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 0

    @@ -3,11 +3,10 @@
          "entity": "nutrition_plan",
          "entityId": "01a0fda1-7f8e-7e49-a2bb-a82d5614f0ef",
          "meta": Object {
            "from": "07:30",
            "petId": "01a0fda1-7f3f-7db8-bb89-017378338d4f",
    -       "servedOn": "2026-10-02",
            "to": "08:15",
          },
          "userId": "01a0fda1-7f34-79d8-9236-3d1337f3dcbb",
        },
      ]

Test Suites: 1 failed, 1 total
Tests:       1 failed, 21 passed, 22 total
```

Restauración S13: `git checkout HEAD -- backend-pet-tracker/src/modules/nutrition/application/use-cases/move-meal-time.use-case.ts`.

```text
$ git diff --exit-code
(sin salida)
exit=0
$ git diff --cached --exit-code
(sin salida)
exit=0
$ git status --short
(sin salida)
exit=0
```

`S14-mt`: exit=1.

```text
FAIL test/meal-times.e2e-spec.ts
  ● Meal schedule editing (e2e) › R8 (meal-schedule-editing #103): body invalido responde 400 antes de leer el plan › POST rechaza cada body de la lista

    expected 400 "Bad Request", got 201 "Created"

  ● Meal schedule editing (e2e) › R8 (meal-schedule-editing #103): body invalido responde 400 antes de leer el plan › PATCH rechaza cada body de la lista

    expected 400 "Bad Request", got 200 "OK"

  ● Meal schedule editing (e2e) › R8 (meal-schedule-editing #103): body invalido responde 400 antes de leer el plan › sin plan tambien es 400 y meals conserva su patron

    expected 400 "Bad Request", got 422 "Unprocessable Entity"

Test Suites: 1 failed, 1 total
Tests:       3 failed, 19 passed, 22 total
```

Restauración S14: `git checkout HEAD -- backend-pet-tracker/src/modules/nutrition/application/dto/meal.dto.ts`.

```text
$ git diff --exit-code
(sin salida)
exit=0
$ git diff --cached --exit-code
(sin salida)
exit=0
$ git status --short
(sin salida)
exit=0
```

`S15-unit`: exit=1.

```text
FAIL src/modules/nutrition/application/use-cases/add-meal-time.use-case.spec.ts
  ● R9 (meal-schedule-editing #103): el POST lanza en orden sin escribir ni auditar › el duplicado gana al limite de seis

    expect(received).rejects.toMatchObject(expected)

    - Expected  - 1
    + Received  + 1

      Object {
    -   "name": "MealTimeDuplicateError",
    +   "name": "MealTimesLimitReachedError",
      }

Test Suites: 1 failed, 1 total
Tests:       1 failed, 4 passed, 5 total
```

`S15-mt`: exit=1.

```text
FAIL test/meal-times.e2e-spec.ts
  ● Meal schedule editing (e2e) › R9 (meal-schedule-editing #103): 422 con code propio y sin persistir › POST: duplicado y limite de seis

    expect(received).toEqual(expected) // deep equality

    - Expected  - 2
    + Received  + 2

      Object {
    -   "code": "MEAL_TIME_DUPLICATE",
    -   "message": "mealTime is already part of the current nutrition plan",
    +   "code": "MEAL_TIMES_LIMIT_REACHED",
    +   "message": "The nutrition plan already has the maximum of 6 meal times",
        "statusCode": 422,
      }

Test Suites: 1 failed, 1 total
Tests:       1 failed, 21 passed, 22 total
```

Restauración S15: `git checkout HEAD -- backend-pet-tracker/src/modules/nutrition/application/use-cases/add-meal-time.use-case.ts`.

```text
$ git diff --exit-code
(sin salida)
exit=0
$ git diff --cached --exit-code
(sin salida)
exit=0
$ git status --short
(sin salida)
exit=0
```

`S16-unit`: exit=1.

```text
FAIL src/modules/nutrition/application/use-cases/move-meal-time.use-case.spec.ts
  ● R9 (meal-schedule-editing #103): el PATCH lanza en orden sin escribir ni auditar › el origen fuera gana al destino duplicado

    expect(received).rejects.toMatchObject(expected)

    - Expected  - 1
    + Received  + 1

      Object {
    -   "name": "MealTimeNotInPlanError",
    +   "name": "MealTimeDuplicateError",
      }

Test Suites: 1 failed, 1 total
Tests:       1 failed, 10 passed, 11 total
```

`S16-mt`: exit=1.

```text
FAIL test/meal-times.e2e-spec.ts
  ● Meal schedule editing (e2e) › R9 (meal-schedule-editing #103): 422 con code propio y sin persistir › PATCH: origen fuera del plan, destino repetido o igual

    expect(received).toEqual(expected) // deep equality

    - Expected  - 2
    + Received  + 2

      Object {
    -   "code": "MEAL_TIME_NOT_IN_PLAN",
    -   "message": "mealTime is not part of the current nutrition plan",
    +   "code": "MEAL_TIME_DUPLICATE",
    +   "message": "mealTime is already part of the current nutrition plan",
        "statusCode": 422,
      }

Test Suites: 1 failed, 1 total
Tests:       1 failed, 21 passed, 22 total
```

Restauración S16: `git checkout HEAD -- backend-pet-tracker/src/modules/nutrition/application/use-cases/move-meal-time.use-case.ts`.

```text
$ git diff --exit-code
(sin salida)
exit=0
$ git diff --cached --exit-code
(sin salida)
exit=0
$ git status --short
(sin salida)
exit=0
```

`S17-mt`: exit=1.

```text
FAIL test/meal-times.e2e-spec.ts
  ● Meal schedule editing (e2e) › R10 (meal-schedule-editing #103): solo el owner edita; 404 del guard precede › family, walker y vet reciben 403 incluso con body vacio

    expected 403 "Forbidden", got 200 "OK"

Test Suites: 1 failed, 1 total
Tests:       1 failed, 21 passed, 22 total
```

Restauración S17: `git checkout HEAD -- backend-pet-tracker/src/modules/nutrition/infrastructure/nutrition.controller.ts`.

```text
$ git diff --exit-code
(sin salida)
exit=0
$ git diff --cached --exit-code
(sin salida)
exit=0
$ git status --short
(sin salida)
exit=0
```

`S18-mt`: exit=1.

```text
FAIL test/meal-times.e2e-spec.ts
  ● Meal schedule editing (e2e) › R11 (meal-schedule-editing #103): servir, deshacer, GET del plan y perfil leen el plan editado › servir, mover y deshacer usan las franjas del plan editado

    expected 201 "Created", got 422 "Unprocessable Entity"

Test Suites: 1 failed, 1 total
Tests:       1 failed, 21 passed, 22 total
```

Restauración S18: `git checkout HEAD -- backend-pet-tracker/src/modules/nutrition/application/use-cases/serve-meal.use-case.ts`.

```text
$ git diff --exit-code
(sin salida)
exit=0
$ git diff --cached --exit-code
(sin salida)
exit=0
$ git status --short
(sin salida)
exit=0
```

`S19-unit`: exit=1.

```text
FAIL src/modules/nutrition/domain/entities/nutrition-plan.entity.spec.ts
  ● R3 (meal-schedule-editing #103): copyWithMealTimes ordena, recuenta y resuelve el numero del motor › copia los campos completos, ordena, recuenta y resuelve el motor

    expect(received).toStrictEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 1

    @@ -1,7 +1,7 @@
      Object {
    -   "aiExplanation": "texto",
    +   "aiExplanation": null,
        "dailyGrams": 305,
        "engineMealsPerDay": 2,
        "inputsHash": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
        "mealTimes": Array [
          "07:30",

Test Suites: 1 failed, 1 total
Tests:       1 failed, 9 passed, 10 total
```

`S19-mt`: exit=1.

```text
FAIL test/meal-times.e2e-spec.ts
  ● Meal schedule editing (e2e) › R12 (meal-schedule-editing #103): la copia conserva inputsHash y aiExplanation y generate la devuelve › hereda la explicacion y el hash y generate devuelve la misma copia

    expect(received).toBe(expected) // Object.is equality

    Expected: "explicacion previa"
    Received: null

Test Suites: 1 failed, 1 total
Tests:       1 failed, 21 passed, 22 total
```

Restauración S19: `git checkout HEAD -- backend-pet-tracker/src/modules/nutrition/domain/entities/nutrition-plan.entity.ts`.

```text
$ git diff --exit-code
(sin salida)
exit=0
$ git diff --cached --exit-code
(sin salida)
exit=0
$ git status --short
(sin salida)
exit=0
```

`S20-unit`: exit=1.

```text
FAIL src/modules/nutrition/domain/entities/nutrition-plan.entity.spec.ts
  ● R3 (meal-schedule-editing #103): copyWithMealTimes ordena, recuenta y resuelve el numero del motor › copia los campos completos, ordena, recuenta y resuelve el motor

    expect(received).toStrictEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 1

    @@ -1,10 +1,10 @@
      Object {
        "aiExplanation": "texto",
        "dailyGrams": 305,
        "engineMealsPerDay": 2,
    -   "inputsHash": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    +   "inputsHash": "0000000000000000000000000000000000000000000000000000000000000000",
        "mealTimes": Array [
          "07:30",
          "12:00",
          "19:30",
        ],

Test Suites: 1 failed, 1 total
Tests:       1 failed, 9 passed, 10 total
```

`S20-mt`: exit=1.

```text
FAIL test/meal-times.e2e-spec.ts
  ● Meal schedule editing (e2e) › R12 (meal-schedule-editing #103): la copia conserva inputsHash y aiExplanation y generate la devuelve › hereda la explicacion y el hash y generate devuelve la misma copia

    expect(received).toBe(expected) // Object.is equality

    Expected: "0ee0a687dcf405feb41a04a67e444e77034372cfa7c81a98f5495195b2b17672"
    Received: "0000000000000000000000000000000000000000000000000000000000000000"

Test Suites: 1 failed, 1 total
Tests:       1 failed, 21 passed, 22 total
```

Restauración S20: `git checkout HEAD -- backend-pet-tracker/src/modules/nutrition/domain/entities/nutrition-plan.entity.ts`.

```text
$ git diff --exit-code
(sin salida)
exit=0
$ git diff --cached --exit-code
(sin salida)
exit=0
$ git status --short
(sin salida)
exit=0
```

## §Handoff tras R7 (histórico)


`handoff-unit`: exit=0.

```text
Test Suites: 174 passed, 174 total
Tests:       1328 passed, 1328 total
```

Punto de parada solicitado por el humano: **R7 verde; R8 sin iniciar**. R8–R13 y las sondas siguen pendientes. No se marca la feature done ni se edita el bookkeeping del leader. No push, PR, rebase, cambio de branch ni acceso a otros worktrees.

Recuentos del handoff parcial (no son el cierre final R13):

| Medida | Base H0 | Handoff tras R7 | Delta |
|---|---|---|---|
| Unit suites | 171 | 174 | +3 |
| Unit tests | 1307 | 1328 | +21 |
| meal-times E2E | inexistente | 1 suite / 12 tests, todos pasan | +12 |
| e2e-nut | 2 suites / 45 tests | 2 suites / 45 tests, todos pasan | 0 |
| Migraciones Postgres / journal | 18 / 18 | 19 / 19 | +1 / +1 |

`pnpm exec tsc --noEmit` y `pnpm lint`: exit=0, evidencia en R7. La suite unit completa del handoff tiene exit=0 (arriba). Las cifras finales exigidas (1335 unit / 22 meal-times) se comprobarán después de R12.

Commits realizados: **14 de los 26 previstos**, sin alterar su orden ni mensajes. Los 12 restantes se reservan para R8–R13 y la traceability final.

| # | R-id | Hash | Mensaje literal |
|---|---|---|---|
| 1 | R1 | `1e4cb9630b07b17c532977fd3fccac5987565d5c` | `test(meal-schedule-editing): lock engine_meals_per_day column and 0018 migration (R1)` |
| 2 | R1 | `18fd98c40f9e60d73a4434730abd4c7f1b5088c9` | `feat(meal-schedule-editing): add engine_meals_per_day column and migration 0018 (R1)` |
| 3 | R2 | `02fee95d3715bee9f0195f491fe8572b7409ec31` | `test(meal-schedule-editing): lock carried meal schedule across generate (R2)` |
| 4 | R2 | `2798aa364911f07581839e3d37598c115d2add4c` | `feat(meal-schedule-editing): carry edited meal schedule while engine meal count holds (R2)` |
| 5 | R3 | `21bf4b2b1dfeeb95960d26efc6eab60c12df54d1` | `test(meal-schedule-editing): lock POST meal-times append-only copy (R3)` |
| 6 | R3 | `71ca28125c3ff9daf1f51ce7bae61ee528c77f89` | `feat(meal-schedule-editing): add POST meal-times endpoint (R3)` |
| 7 | R4 | `a9475cf8bc97c1265a80606d5ef893d631c5d65d` | `test(meal-schedule-editing): lock PATCH meal-times move copy (R4)` |
| 8 | R4 | `b2689215dfbfe049339f509bad6457b5a2750d2c` | `feat(meal-schedule-editing): add PATCH meal-times endpoint (R4)` |
| 9 | R5 | `80694b44bd59880c3b7f72e97de08f2db93e3bf1` | `test(meal-schedule-editing): lock today's serving moving with its slot (R5)` |
| 10 | R5 | `9070f970d70f320a7c791908558f1b82fd238c81` | `feat(meal-schedule-editing): move today's serving with its slot in one transaction (R5)` |
| 11 | R6 | `16a719d46c644d11ef8b12bbfabb9aead0df722c` | `test(meal-schedule-editing): lock destination-wins merge on slot collision (R6)` |
| 12 | R6 | `f1c23818ac3cf2a6ee74f9d8278c7b827e4b794f` | `feat(meal-schedule-editing): merge serving into destination slot on collision (R6)` |
| 13 | R7 | `ffb56bd1df166eb6041cc6569e4bd593ee75b615` | `test(meal-schedule-editing): lock meal_time audit after write (R7)` |
| 14 | R7 | `78a855637692764811c364701215f40d0df5a3d0` | `feat(meal-schedule-editing): audit meal_time.add and meal_time.move (R7)` |

Estado posterior al último tsc/lint y al verde de R7 (`git status --short` desde raíz):

```text
?? progress/impl_meal-schedule-editing.md
```

`git diff --exit-code`: salida vacía, exit=0. `git diff --cached --exit-code`: salida vacía, exit=0. `git diff --check H0..HEAD`: salida vacía, exit=0. El único archivo sin commit es el reporte: se conserva así porque la instrucción lo reserva para el commit 26, y no se introduce un commit adicional al parar. El reporte no existía en H0.

`git diff --stat H0..HEAD`:

```text
 .../0018_nutrition_plans_engine_meals.sql          |    1 +
 .../src/db/migrations/meta/0018_snapshot.json      | 2495 ++++++++++++++++++++
 .../src/db/migrations/meta/_journal.json           |    9 +-
 .../src/db/schema/meal-servings.schema.spec.ts     |    8 +-
 .../src/db/schema/nutrition.schema.spec.ts         |   40 +
 .../src/db/schema/nutrition.schema.ts              |    1 +
 .../modules/nutrition/application/dto/meal.dto.ts  |    3 +
 .../use-cases/add-meal-time.use-case.spec.ts       |   70 +
 .../use-cases/add-meal-time.use-case.ts            |   39 +
 .../use-cases/generate-nutrition-plan.use-case.ts  |    3 +
 .../use-cases/move-meal-time.use-case.spec.ts      |  106 +
 .../use-cases/move-meal-time.use-case.ts           |   50 +
 .../use-cases/serve-meal.use-case.spec.ts          |    1 +
 .../domain/entities/nutrition-plan.entity.spec.ts  |  126 +
 .../domain/entities/nutrition-plan.entity.ts       |   39 +
 .../domain/repositories/nutrition.repository.ts    |   10 +
 .../infrastructure/nutrition.controller.ts         |   49 +
 .../repositories/nutrition.drizzle.repository.ts   |   53 +-
 .../src/modules/nutrition/nutrition.module.ts      |    4 +
 backend-pet-tracker/test/meal-times.e2e-spec.ts    |  577 +++++
 20 files changed, 3678 insertions(+), 6 deletions(-)
```

Ficheros medidos desde H0 (todos en la lista cerrada; no se tocaron package.json, lockfiles, infra, móvil ni docs ajenos):

```text
backend-pet-tracker/src/db/migrations/0018_nutrition_plans_engine_meals.sql
backend-pet-tracker/src/db/migrations/meta/0018_snapshot.json
backend-pet-tracker/src/db/migrations/meta/_journal.json
backend-pet-tracker/src/db/schema/meal-servings.schema.spec.ts
backend-pet-tracker/src/db/schema/nutrition.schema.spec.ts
backend-pet-tracker/src/db/schema/nutrition.schema.ts
backend-pet-tracker/src/modules/nutrition/application/dto/meal.dto.ts
backend-pet-tracker/src/modules/nutrition/application/use-cases/add-meal-time.use-case.spec.ts
backend-pet-tracker/src/modules/nutrition/application/use-cases/add-meal-time.use-case.ts
backend-pet-tracker/src/modules/nutrition/application/use-cases/generate-nutrition-plan.use-case.ts
backend-pet-tracker/src/modules/nutrition/application/use-cases/move-meal-time.use-case.spec.ts
backend-pet-tracker/src/modules/nutrition/application/use-cases/move-meal-time.use-case.ts
backend-pet-tracker/src/modules/nutrition/application/use-cases/serve-meal.use-case.spec.ts
backend-pet-tracker/src/modules/nutrition/domain/entities/nutrition-plan.entity.spec.ts
backend-pet-tracker/src/modules/nutrition/domain/entities/nutrition-plan.entity.ts
backend-pet-tracker/src/modules/nutrition/domain/repositories/nutrition.repository.ts
backend-pet-tracker/src/modules/nutrition/infrastructure/nutrition.controller.ts
backend-pet-tracker/src/modules/nutrition/infrastructure/repositories/nutrition.drizzle.repository.ts
backend-pet-tracker/src/modules/nutrition/nutrition.module.ts
backend-pet-tracker/test/meal-times.e2e-spec.ts
```

R11/R12: no iniciados; no hay commits de mutación ni padres rojos contra los que medir el diff aún. `git diff H0 HEAD -- backend-pet-tracker/src/modules/nutrition/infrastructure/repositories/pet-meals.drizzle-reader.ts` está vacío (exit=0).

Decisiones no cerradas literalmente: la discrepancia de R8 se elevó al humano y éste ordenó detenerse antes de R8 para corregirla. No se resolvió por cuenta del implementador. Se reutilizaron los patrones existentes de controller, auditoría, fixtures y ownerLocalDay, sin dependencias nuevas. Las etiquetas de los dos it unitarios de R3 y los it de R7 (sin texto literal fijado por la spec) describen las aserciones normativas.

Reanudación: corregir primero tasks.md R8 para declarar los tres rojos por matcher (o devolver la spec a su autor con el cambio acordado). Después seguir R8 rojo / verde, R9–R12, S1–S20 y R13, con 0018 ya aplicada. La corrección de requirements.md/tasks.md corresponde al leader: esos archivos no están en la lista cerrada de esta implementación.

## §Handoff tras R10 (histórico)

Handoff parcial tras R10; no se declara terminado #103.


`handoff-r10-unit`: exit=0.

```text
Test Suites: 174 passed, 174 total
Tests:       1335 passed, 1335 total
```

Estado actual: **R1–R10 verdes; detenido antes de R11 por instrucción expresa del humano**. HEAD: `7b44b6040cb855beb504cd105bfd5faed99c33db`.
La enmienda E1 se aplicó tal como estaba aprobada: R8 tuvo tres rojos por matcher y luego verde. No se cargaron skills. Se conserva H0 y todas las restricciones de worktree/infra. No se ha aplicado ninguna mutación de R11, R12 o las sondas, ni se ha editado traceability. No push ni PR.

Recuentos del segundo handoff parcial:

| Medida | Base H0 | Tras R10 | Delta |
|---|---|---|---|
| Unit suites | 171 | 174, todas pasan | +3 |
| Unit tests | 1307 | 1335, todos pasan | +28 |
| meal-times E2E | inexistente | 1 suite / 20 tests, todos pasan | +20 |
| e2e-nut | 2 suites / 45 tests | 2 suites / 45 tests, todos pasan | 0 |
| Migraciones Postgres / journal | 18 / 18 | 19 / 19 (medido al aplicar 0018) | +1 / +1 |

Tsc y lint, exit=0 (R10); unit completa, exit=0 (arriba). Quedan los dos E2E de R11/R12 para llegar a los 22 finales. E2E completo e init.sh siguen **delegados al leader**. No se adelantan ni se sustituyen las evidencias de R13.

**20 de los 26 commits de implementación**, mensajes literales y orden conservado. Hay además un commit del leader entre R7 y R8: `d5cdede081c84fdeca5e82410cf674c24d1a4222` — `docs(spec): amend #103 R8 red to include it 2 (E1)`. Faltan seis commits (R11 rojo/verde, R12 rojo/verde, docs R13 y traceability).

| # | R-id | Hash | Mensaje literal |
|---|---|---|---|
| 1 | R1 | `1e4cb9630b07b17c532977fd3fccac5987565d5c` | `test(meal-schedule-editing): lock engine_meals_per_day column and 0018 migration (R1)` |
| 2 | R1 | `18fd98c40f9e60d73a4434730abd4c7f1b5088c9` | `feat(meal-schedule-editing): add engine_meals_per_day column and migration 0018 (R1)` |
| 3 | R2 | `02fee95d3715bee9f0195f491fe8572b7409ec31` | `test(meal-schedule-editing): lock carried meal schedule across generate (R2)` |
| 4 | R2 | `2798aa364911f07581839e3d37598c115d2add4c` | `feat(meal-schedule-editing): carry edited meal schedule while engine meal count holds (R2)` |
| 5 | R3 | `21bf4b2b1dfeeb95960d26efc6eab60c12df54d1` | `test(meal-schedule-editing): lock POST meal-times append-only copy (R3)` |
| 6 | R3 | `71ca28125c3ff9daf1f51ce7bae61ee528c77f89` | `feat(meal-schedule-editing): add POST meal-times endpoint (R3)` |
| 7 | R4 | `a9475cf8bc97c1265a80606d5ef893d631c5d65d` | `test(meal-schedule-editing): lock PATCH meal-times move copy (R4)` |
| 8 | R4 | `b2689215dfbfe049339f509bad6457b5a2750d2c` | `feat(meal-schedule-editing): add PATCH meal-times endpoint (R4)` |
| 9 | R5 | `80694b44bd59880c3b7f72e97de08f2db93e3bf1` | `test(meal-schedule-editing): lock today's serving moving with its slot (R5)` |
| 10 | R5 | `9070f970d70f320a7c791908558f1b82fd238c81` | `feat(meal-schedule-editing): move today's serving with its slot in one transaction (R5)` |
| 11 | R6 | `16a719d46c644d11ef8b12bbfabb9aead0df722c` | `test(meal-schedule-editing): lock destination-wins merge on slot collision (R6)` |
| 12 | R6 | `f1c23818ac3cf2a6ee74f9d8278c7b827e4b794f` | `feat(meal-schedule-editing): merge serving into destination slot on collision (R6)` |
| 13 | R7 | `ffb56bd1df166eb6041cc6569e4bd593ee75b615` | `test(meal-schedule-editing): lock meal_time audit after write (R7)` |
| 14 | R7 | `78a855637692764811c364701215f40d0df5a3d0` | `feat(meal-schedule-editing): audit meal_time.add and meal_time.move (R7)` |
| 15 | R8 | `8bf834b0cc567a923a893931c81ba7be01cd9916` | `test(meal-schedule-editing): lock strict HH:MM validation on meal-times (R8)` |
| 16 | R8 | `d4d6d9c5efbbb12114e22cb2a3b2a17e9552feb4` | `feat(meal-schedule-editing): validate meal-times body with strict HH:MM (R8)` |
| 17 | R9 | `72d51b7ff82886efed27fc3d96928cdcffc577c6` | `test(meal-schedule-editing): lock meal-times 422 codes and order (R9)` |
| 18 | R9 | `0e03cd0faa1fa98ed24742d672e96e2b9f7a80ab` | `feat(meal-schedule-editing): reject duplicate and seventh meal times (R9)` |
| 19 | R10 | `9c32efc4f04b1889edb16de77c95588f44b30e92` | `test(meal-schedule-editing): lock owner-only meal-times edits (R10)` |
| 20 | R10 | `7b44b6040cb855beb504cd105bfd5faed99c33db` | `feat(meal-schedule-editing): restrict meal-times edits to owner (R10)` |

`git status --short` posterior a tsc/lint y al commit verde de R10:

```text
?? progress/impl_meal-schedule-editing.md
```

Índice y archivos rastreados limpios. `git diff --exit-code`, `git diff --cached --exit-code` y `git diff --check H0..HEAD`: salida vacía, exit=0 cada uno. El único archivo sin commit sigue siendo el reporte, reservado al último commit según la instrucción original.

`git diff H0 HEAD -- backend-pet-tracker/src/modules/nutrition/infrastructure/repositories/pet-meals.drizzle-reader.ts`: vacío, exit=0. R11 no se inició; no hay todavía padre rojo contra el que medir su restauración. R12 tampoco se inició.

`git diff --stat H0..HEAD` actual:

```text
 .../0018_nutrition_plans_engine_meals.sql          |    1 +
 .../src/db/migrations/meta/0018_snapshot.json      | 2495 ++++++++++++++++++++
 .../src/db/migrations/meta/_journal.json           |    9 +-
 .../src/db/schema/meal-servings.schema.spec.ts     |    8 +-
 .../src/db/schema/nutrition.schema.spec.ts         |   40 +
 .../src/db/schema/nutrition.schema.ts              |    1 +
 .../modules/nutrition/application/dto/meal.dto.ts  |    8 +
 .../use-cases/add-meal-time.use-case.spec.ts       |  111 +
 .../use-cases/add-meal-time.use-case.ts            |   48 +
 .../use-cases/generate-nutrition-plan.use-case.ts  |    3 +
 .../use-cases/move-meal-time.use-case.spec.ts      |  149 ++
 .../use-cases/move-meal-time.use-case.ts           |   58 +
 .../use-cases/serve-meal.use-case.spec.ts          |    1 +
 .../domain/entities/nutrition-plan.entity.spec.ts  |  126 +
 .../domain/entities/nutrition-plan.entity.ts       |   39 +
 .../nutrition/domain/errors/nutrition.errors.ts    |   18 +
 .../nutrition/domain/nutrition.constants.ts        |    1 +
 .../domain/repositories/nutrition.repository.ts    |   10 +
 .../mappers/nutrition-error.mapper.ts              |   16 +
 .../infrastructure/nutrition.controller.ts         |   51 +
 .../repositories/nutrition.drizzle.repository.ts   |   53 +-
 .../src/modules/nutrition/nutrition.module.ts      |    4 +
 backend-pet-tracker/test/meal-times.e2e-spec.ts    |  812 +++++++
 progress/current.md                                |    1 +
 progress/handoff_meal-schedule-editing_r8.md       |   39 +
 specs/meal-schedule-editing/requirements.md        |   24 +-
 specs/meal-schedule-editing/tasks.md               |    4 +-
 27 files changed, 4120 insertions(+), 10 deletions(-)
```

Ficheros afectados desde H0:

```text
backend-pet-tracker/src/db/migrations/0018_nutrition_plans_engine_meals.sql
backend-pet-tracker/src/db/migrations/meta/0018_snapshot.json
backend-pet-tracker/src/db/migrations/meta/_journal.json
backend-pet-tracker/src/db/schema/meal-servings.schema.spec.ts
backend-pet-tracker/src/db/schema/nutrition.schema.spec.ts
backend-pet-tracker/src/db/schema/nutrition.schema.ts
backend-pet-tracker/src/modules/nutrition/application/dto/meal.dto.ts
backend-pet-tracker/src/modules/nutrition/application/use-cases/add-meal-time.use-case.spec.ts
backend-pet-tracker/src/modules/nutrition/application/use-cases/add-meal-time.use-case.ts
backend-pet-tracker/src/modules/nutrition/application/use-cases/generate-nutrition-plan.use-case.ts
backend-pet-tracker/src/modules/nutrition/application/use-cases/move-meal-time.use-case.spec.ts
backend-pet-tracker/src/modules/nutrition/application/use-cases/move-meal-time.use-case.ts
backend-pet-tracker/src/modules/nutrition/application/use-cases/serve-meal.use-case.spec.ts
backend-pet-tracker/src/modules/nutrition/domain/entities/nutrition-plan.entity.spec.ts
backend-pet-tracker/src/modules/nutrition/domain/entities/nutrition-plan.entity.ts
backend-pet-tracker/src/modules/nutrition/domain/errors/nutrition.errors.ts
backend-pet-tracker/src/modules/nutrition/domain/nutrition.constants.ts
backend-pet-tracker/src/modules/nutrition/domain/repositories/nutrition.repository.ts
backend-pet-tracker/src/modules/nutrition/infrastructure/mappers/nutrition-error.mapper.ts
backend-pet-tracker/src/modules/nutrition/infrastructure/nutrition.controller.ts
backend-pet-tracker/src/modules/nutrition/infrastructure/repositories/nutrition.drizzle.repository.ts
backend-pet-tracker/src/modules/nutrition/nutrition.module.ts
backend-pet-tracker/test/meal-times.e2e-spec.ts
progress/current.md
progress/handoff_meal-schedule-editing_r8.md
specs/meal-schedule-editing/requirements.md
specs/meal-schedule-editing/tasks.md
```

Los cambios de esta implementación permanecen dentro de la lista cerrada. El diff desde H0 incluye los tres archivos de E1 autorizados para el leader (requirements.md, tasks.md y handoff_meal-schedule-editing_r8.md) y **también progress/current.md**, con una línea añadida por el mismo commit `d5cdede081c84fdeca5e82410cf674c24d1a4222` (`git show --stat` y diff contra su padre, verificado). Ese cuarto archivo no figura en la ampliación de la lista del handoff R8; se informa al leader para corregir la declaración de §Cierre. No se revierte ni se modifica porque es suyo. Esta sesión no editó progress/current.md, progress/history.md, STATUS.md, feature_list.json, package.json, pnpm-lock.yaml, infra, móvil ni otros worktrees.

Próximo paso: el leader amplía la declaración del rojo de R11 antes de reanudar. Además de R11 y el posible arrastre de #83, hay que declarar R5 it 1 y los tres it de R6 de #103, por sus aserciones de mealsToday (tabla de R11). La observación se basa en lectura; no se ha corrido ni versionado el rojo de R11. Después se sigue R11 → R12 → S1–S20 → R13, sin modificar los tests ni aplicar sondas antes de R12.

## §Cierre

Implementación R1–R12 verde; R13 (a) 1–7 y (b) completados. S1–S20 cumplen los mínimos de E2, con los verdes expresamente declarados conservados. Otros rojos por matcher: S4 (R2 gato), S5 (R3 legado y R4), S7 (R5, R6 it 1–2, R11 y R12). No se versiona ninguna sonda. Skills cargadas: ninguna.

| Medida | Base H0 | Final medido | Delta |
|---|---|---|---|
| Unit suites | 171 | 174, todas pasan | +3 |
| Unit tests | 1307 | 1335, todos pasan | +28 |
| meal-times E2E | inexistente | 1 suite / 22 tests, todos pasan | +1 / +22 |
| e2e-nut | 2 suites / 45 tests | 2 suites / 45 tests, todos pasan | 0 |
| Migraciones Postgres / journal | 18 / 18 | 19 / 19 | +1 / +1 |

Tsc y lint: exit=0 tras las sondas, en R13. E2E completo e init.sh: **delegado al leader**, no ejecutados en este árbol. No push ni PR, ni cambios de branch o acceso a otros worktrees.

26 commits de implementación con mensajes literales, en orden, incluidos los dos de documentación. Los 25 primeros hashes se fijan debajo; el último se identifica por `HEAD` al cerrar, porque su propio hash no puede escribirse dentro de su contenido. El hash literal del commit 26 se entrega en la respuesta final y se obtiene con `git rev-parse HEAD`; no se enmienda ni rebasea después de fijar trazabilidad.

| # | R-id | Hash | Mensaje literal |
|---|---|---|---|
| 1 | R1 | `1e4cb9630b07b17c532977fd3fccac5987565d5c` | `test(meal-schedule-editing): lock engine_meals_per_day column and 0018 migration (R1)` |
| 2 | R1 | `18fd98c40f9e60d73a4434730abd4c7f1b5088c9` | `feat(meal-schedule-editing): add engine_meals_per_day column and migration 0018 (R1)` |
| 3 | R2 | `02fee95d3715bee9f0195f491fe8572b7409ec31` | `test(meal-schedule-editing): lock carried meal schedule across generate (R2)` |
| 4 | R2 | `2798aa364911f07581839e3d37598c115d2add4c` | `feat(meal-schedule-editing): carry edited meal schedule while engine meal count holds (R2)` |
| 5 | R3 | `21bf4b2b1dfeeb95960d26efc6eab60c12df54d1` | `test(meal-schedule-editing): lock POST meal-times append-only copy (R3)` |
| 6 | R3 | `71ca28125c3ff9daf1f51ce7bae61ee528c77f89` | `feat(meal-schedule-editing): add POST meal-times endpoint (R3)` |
| 7 | R4 | `a9475cf8bc97c1265a80606d5ef893d631c5d65d` | `test(meal-schedule-editing): lock PATCH meal-times move copy (R4)` |
| 8 | R4 | `b2689215dfbfe049339f509bad6457b5a2750d2c` | `feat(meal-schedule-editing): add PATCH meal-times endpoint (R4)` |
| 9 | R5 | `80694b44bd59880c3b7f72e97de08f2db93e3bf1` | `test(meal-schedule-editing): lock today's serving moving with its slot (R5)` |
| 10 | R5 | `9070f970d70f320a7c791908558f1b82fd238c81` | `feat(meal-schedule-editing): move today's serving with its slot in one transaction (R5)` |
| 11 | R6 | `16a719d46c644d11ef8b12bbfabb9aead0df722c` | `test(meal-schedule-editing): lock destination-wins merge on slot collision (R6)` |
| 12 | R6 | `f1c23818ac3cf2a6ee74f9d8278c7b827e4b794f` | `feat(meal-schedule-editing): merge serving into destination slot on collision (R6)` |
| 13 | R7 | `ffb56bd1df166eb6041cc6569e4bd593ee75b615` | `test(meal-schedule-editing): lock meal_time audit after write (R7)` |
| 14 | R7 | `78a855637692764811c364701215f40d0df5a3d0` | `feat(meal-schedule-editing): audit meal_time.add and meal_time.move (R7)` |
| 15 | R8 | `8bf834b0cc567a923a893931c81ba7be01cd9916` | `test(meal-schedule-editing): lock strict HH:MM validation on meal-times (R8)` |
| 16 | R8 | `d4d6d9c5efbbb12114e22cb2a3b2a17e9552feb4` | `feat(meal-schedule-editing): validate meal-times body with strict HH:MM (R8)` |
| 17 | R9 | `72d51b7ff82886efed27fc3d96928cdcffc577c6` | `test(meal-schedule-editing): lock meal-times 422 codes and order (R9)` |
| 18 | R9 | `0e03cd0faa1fa98ed24742d672e96e2b9f7a80ab` | `feat(meal-schedule-editing): reject duplicate and seventh meal times (R9)` |
| 19 | R10 | `9c32efc4f04b1889edb16de77c95588f44b30e92` | `test(meal-schedule-editing): lock owner-only meal-times edits (R10)` |
| 20 | R10 | `7b44b6040cb855beb504cd105bfd5faed99c33db` | `feat(meal-schedule-editing): restrict meal-times edits to owner (R10)` |
| 21 | R11 | `fd735a33161890ae75260c3fd11197028f3ea448` | `test(meal-schedule-editing): lock readers on edited plan (R11)` |
| 22 | R11 | `caa769d2c584552646429aa24ac63ccb0813222e` | `feat(meal-schedule-editing): restore pet-meals reader order after R11 lock (R11)` |
| 23 | R12 | `9545c71cf81d9a3fa52c228630a464683f43fca3` | `test(meal-schedule-editing): lock inputsHash and aiExplanation on edited copy (R12)` |
| 24 | R12 | `924fd21d5273028b2a348b39f06a0511131e3704` | `feat(meal-schedule-editing): restore copyWithMealTimes after R12 lock (R12)` |
| 25 | R13 | `95f66de660c9205ca564c069117afb5f23ec7923` | `docs(meal-schedule-editing): document engine_meals_per_day and amend #83 D4 (R13)` |
| 26 | R13 / C5 | `HEAD` (hash con `git rev-parse HEAD` al cerrar) | `docs(meal-schedule-editing): fill #103 traceability` |

Los dos commits del leader, fuera de estos 26: `d5cdede081c84fdeca5e82410cf674c24d1a4222` (E1) y `9c7a358b889cdb3a50d446dc0d721f7454cb0fca` (E2). Sus cinco ficheros autorizados por el handoff R11: `specs/meal-schedule-editing/requirements.md`, `specs/meal-schedule-editing/tasks.md`, `progress/handoff_meal-schedule-editing_r8.md`, `progress/handoff_meal-schedule-editing_r11.md`, `progress/current.md`. Esta implementación no los editó.

Decisiones operativas no cerradas literalmente: los dos migrates de R13 imprimen “migrations applied successfully” incluso sin cambios; la idempotencia se confirma por el recuento estable de 19 (medido al aplicar 0018 y después de las dos ejecuciones). Para comprobar el journal de origin/main se lee su blob a un fichero temporal y se cuenta con Node, sin pipe. El informe se movió temporalmente a /tmp durante las sondas para mantener los status vacíos; se restauró al terminar S20. El clasificador del informe se corrigió para reconocer matchers de mocks y separar el nombre del it de su describe; no se repitieron sondas ni se modificaron sus mutaciones o tests.

R11: diffs contra el padre del rojo y H0 vacíos; R12: diff de la entidad contra el padre del rojo vacío (salidas en sus secciones). Archivos temporales y logs en /tmp no se versionan. El techo de concurrencia descrito en D5 sigue vigente.

Comprobaciones por contenido y alcance:

```text
Lista cerrada: 33 archivos, incluidos cinco del leader; ninguno fuera de la lista ampliada.
Títulos describe: 19 coinciden literalmente con requirements.md; R1–R12 presentes.
R11 reader: diff neto cero; backend sin mutaciones residuales; traceability R1–R13 sin filas pendientes.
25/26 mensajes de commit literales comprobados, en orden; el último es el de trazabilidad.
rg '\.update\(nutritionPlans\)|UPDATE.*nutrition_plans' backend-pet-tracker/src
(sin salida); exit=1: no UPDATE de planes en producción.
rg '^\| R[0-9]+.*pendiente' specs/meal-schedule-editing/traceability.md
(sin salida); exit=1: ninguna fila pendiente.
rg '14 de las 31|Las otras 17' docs/conventions.md
lo separa. **14 de las 31 suites e2e lo tocan** y siguen necesitando aviso a la
Las otras 17 solo tocan Postgres: con base propia, se solapan sin avisar.
exit=0
```

Los greps de la fila de nutrition_plans y de su línea de migraciones, y de la enmienda #103 en D4, devolvieron íntegro el texto literal de design.md §Docs, exit=0. `git diff --check` sin salida, exit=0. Las comprobaciones finales del reader contra H0 y contra 9c7a358b, y de la entidad contra caa769d2: sin salida, exit=0; `git diff -- backend-pet-tracker` vacío, exit=0.

`git status --short` después de tsc/lint y del commit docs R13, antes de versionar el informe y la trazabilidad:

```text
 M specs/meal-schedule-editing/traceability.md
?? progress/impl_meal-schedule-editing.md
```

Para comprobar el cierre real, se ejecuta `git status --short` inmediatamente después del commit 26 y se entrega su resultado en la respuesta final. No se modifica el reporte después, para conservar los 26 commits y los hashes.

Comandos adicionales de los logs: `r12-*-unit` = `pnpm test -- nutrition-plan.entity`; `r13-a7-unit` = `pnpm test`; S*-unit = `pnpm exec jest --runInBand --runTestsByPath <ficheros unit de la tabla>`; S*-mt = `<e2e-mt>`. Todos desde backend. Los comandos R13 (a) 1–6 son los de tasks.md, con la lectura de origin/main sin pipe descrita arriba.

Diffstat del árbol final preparado: se mide con `git diff --cached --stat H0` una vez staged ambos ficheros del último commit; equivale al `git diff --stat H0..HEAD` tras ese commit. Se verifica esa igualdad al cerrar, sin añadir commits.

<!-- evidencia-cierre -->
<!-- stat-final -->

```text
 .../0018_nutrition_plans_engine_meals.sql          |    1 +
 .../src/db/migrations/meta/0018_snapshot.json      | 2495 +++++++++++++++++
 .../src/db/migrations/meta/_journal.json           |    9 +-
 .../src/db/schema/meal-servings.schema.spec.ts     |    8 +-
 .../src/db/schema/nutrition.schema.spec.ts         |   40 +
 .../src/db/schema/nutrition.schema.ts              |    1 +
 .../modules/nutrition/application/dto/meal.dto.ts  |    8 +
 .../use-cases/add-meal-time.use-case.spec.ts       |  111 +
 .../use-cases/add-meal-time.use-case.ts            |   48 +
 .../use-cases/generate-nutrition-plan.use-case.ts  |    3 +
 .../use-cases/move-meal-time.use-case.spec.ts      |  149 +
 .../use-cases/move-meal-time.use-case.ts           |   58 +
 .../use-cases/serve-meal.use-case.spec.ts          |    1 +
 .../domain/entities/nutrition-plan.entity.spec.ts  |  126 +
 .../domain/entities/nutrition-plan.entity.ts       |   39 +
 .../nutrition/domain/errors/nutrition.errors.ts    |   18 +
 .../nutrition/domain/nutrition.constants.ts        |    1 +
 .../domain/repositories/nutrition.repository.ts    |   10 +
 .../mappers/nutrition-error.mapper.ts              |   16 +
 .../infrastructure/nutrition.controller.ts         |   51 +
 .../repositories/nutrition.drizzle.repository.ts   |   53 +-
 .../src/modules/nutrition/nutrition.module.ts      |    4 +
 backend-pet-tracker/test/meal-times.e2e-spec.ts    |  894 ++++++
 docs/conventions.md                                |    4 +-
 docs/data-model.md                                 |    4 +-
 progress/current.md                                |    2 +
 progress/handoff_meal-schedule-editing_r11.md      |   60 +
 progress/handoff_meal-schedule-editing_r8.md       |   39 +
 progress/impl_meal-schedule-editing.md             | 2921 ++++++++++++++++++++
 specs/meal-schedule-editing/requirements.md        |   81 +-
 specs/meal-schedule-editing/tasks.md               |   27 +-
 specs/meal-schedule-editing/traceability.md        |   26 +-
 specs/meals-served-tracking/design.md              |    7 +
 33 files changed, 7278 insertions(+), 37 deletions(-)
```
<!-- fin-stat-final -->

`r13-c-lint`: exit=0.

```text
> backend-pet-tracker@0.0.1 lint /home/claude/sites/Pet-Tracker/backend-pet-tracker
> eslint "{src,apps,libs,test}/**/*.ts" --fix
```

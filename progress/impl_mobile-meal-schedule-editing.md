# Implementación #147 — mobile-meal-schedule-editing

## Identidad inicial

```text
$ pwd
/home/claude/sites/Pet-Tracker
$ git branch --show-current
feature/147-mobile-meal-schedule-editing
$ git rev-parse --short HEAD
b367ed44
$ git rev-parse --short HEAD~1
86771e3e
```

H0 (hash del handoff): `b367ed44`. Ambas guardas de arranque cumplen.

## Estado de la entrega

Implementación R1-R9 completa. La parada inicial quedó resuelta por la Enmienda E1 aprobada: Reanudación 1 cierra con 88 suites / 1759 tests, lint y typecheck verdes y tres grep-clean vacíos. Las sondas originales y las tres de E1 se documentan abajo. Prueba de humo Android a cargo del humano; revisión e init.sh a cargo del leader.

## Arranque y skills cargadas

`test ! -e mobile-pet-tracker/.expo/types/router.d.ts`: exit 0.

```text
56:      260 + 16 + 1 + 4 + 7 + 14 + 2 + 1 + 4 - 6 + 1 + 2 + 3 + 11,
142:    expect(R6_FOOD).toHaveLength(35 + 3 + 1 - 2 + 1); // +1 #95 R4, -2 #95 R5, +1 #113 R3
3:  'common.cannotReachServer': 'Cannot reach server',
4:  'common.somethingWentWrong': 'Something went wrong',
328:  'common.cannotReachServer': 'No se pudo conectar con el servidor',
329:  'common.somethingWentWrong': 'Algo salió mal',
common.somethingWentWrong en ui-copy-table.ts: 4
common.cannotReachServer en ui-copy-table.ts: 1
```

Lecturas completas: requirements.md (approved y firma humana), design.md, tasks.md, traceability.md. Arquitectura, convenciones y carta de UI consultadas. Sin choque con #146; §2.16 libre.

Skills cargadas de verdad:

- `/home/claude/.codex/plugins/cache/openai-curated/expo/11c74d6b/skills/building-native-ui/SKILL.md`
- `/home/claude/.codex/plugins/cache/openai-curated/expo/11c74d6b/skills/native-data-fetching/SKILL.md`
- `/home/claude/.codex/plugins/cache/openai-curated/expo/11c74d6b/skills/expo-ui-jetpack-compose/SKILL.md`
- `.agents/skills/appllama-app-design-skill/SKILL.md`
- `/home/claude/.codex/plugins/cache/ponytail/ponytail/4.10.0/skills/ponytail/SKILL.md` (modo full activo).

Gana la carta: tokens/Uniwind/HeroUI, wrapper community con guion, selector dentro de Host. Sin optimista (D6/R7). La prueba de humo Android es humana y queda pendiente. API del picker confirmada contra los tipos instalados de @expo/ui SDK 57; no se usa la API SDK 55 de la skill.

### Incidencia previa al primer rojo

La primera invocación de `bunx jest src/providers/__tests__/language-provider.test.tsx src/__tests__/ui-language.test.ts` se lanzó por error desde la raíz. Exit 1: `Could not find a config file`, 0 suites ejecutadas. Bunx descargó Jest en su caché temporal `/tmp/bunx-1002-jest@latest`; no se usa esa versión para verificar. Se corrige el cwd a `mobile-pet-tracker/` antes de medir el rojo. Ningún commit se basó en esa corrida.

### R1 rojo

Desde `mobile-pet-tracker/`: `bunx jest src/providers/__tests__/language-provider.test.tsx src/__tests__/ui-language.test.ts > /tmp/147-r1-red.log 2>&1; echo "exit=$?"`. Exit 1.

```text
Test Suites: 1 failed, 1 passed, 2 total
Tests:       2 failed, 37 passed, 39 total
Snapshots:   0 total
Time:        2.778 s
Ran all test suites matching /src\/providers\/__tests__\/language-provider.test.tsx|src\/__tests__\/ui-language.test.ts/i.
```

```text
  ● #65 R12: el catálogo tiene los dos idiomas y t resuelve claves y parámetros › mantiene la base más las claves de #68 y los mismos marcadores en ambos idiomas

    expect(received).toHaveLength(expected)

    Expected length: 329
    Received length: 320
    Received array:  ["addPet.addPet", "addPet.age", "addPet.approxMonths", "addPet.avatarPreview", "addPet.basicDetails", "addPet.birthDate", "addPet.breed", "addPet.cat", "addPet.checkPetDetails", "addPet.chooseBirthDate", …]

      53 |     const spanishKeys = Object.keys(es).sort();
      54 |
    > 55 |     expect(englishKeys).toHaveLength(
         |                         ^
      56 |       260 + 16 + 1 + 4 + 7 + 14 + 2 + 1 + 4 - 6 + 1 + 2 + 3 + 11 + 9,
      57 |     );
      58 |     expect(spanishKeys).toEqual(englishKeys);

      at Object.toHaveLength (src/providers/__tests__/language-provider.test.tsx:55:25)
```

```text
  ● #147 R1: el catálogo trae las nueve claves del horario editable › registra las nueve claves en los dos idiomas y en la tabla de la spec de idioma

    expect(received).toBe(expected) // Object.is equality

    Expected: "Add meal"
    Received: undefined

      321 |
      322 |     for (const [key, englishValue, spanishValue] of translations) {
    > 323 |       expect(english[key]).toBe(englishValue);
          |                            ^
      324 |       expect(spanish[key]).toBe(spanishValue);
      325 |       expect(languageDesign).toMatch(
      326 |         new RegExp(

      at Object.toBe (src/providers/__tests__/language-provider.test.tsx:323:28)
```

Comprobación de literales antes del commit rojo R1:

```text
$ grep -nF -- 'Add meal' specs/mobile-meal-schedule-editing/requirements.md
65:| `mealSchedule.addMeal` | `Añadir comida` | `Add meal` | etiqueta del botón bajo la lista (R4) |
$ grep -nF -- 'Añadir comida' specs/mobile-meal-schedule-editing/requirements.md
65:| `mealSchedule.addMeal` | `Añadir comida` | `Add meal` | etiqueta del botón bajo la lista (R4) |
$ grep -nF -- 'Edit' specs/mobile-meal-schedule-editing/requirements.md
34:- `application/dto/meal.dto.ts`: `EditMealTimeSchema` aplica
$ grep -nF -- 'Editar' specs/mobile-meal-schedule-editing/requirements.md
66:| `mealSchedule.editTime` | `Editar` | `Edit` | etiqueta visible del botón de cada fila (R4) |
$ grep -nF -- 'Edit {{time}} meal time' specs/mobile-meal-schedule-editing/requirements.md
67:| `mealSchedule.editTimeLabel` **(param)** | `Editar horario de las {{time}}` | `Edit {{time}} meal time` | `accessibilityLabel` del botón de cada fila (R4) |
$ grep -nF -- 'Editar horario de las {{time}}' specs/mobile-meal-schedule-editing/requirements.md
67:| `mealSchedule.editTimeLabel` **(param)** | `Editar horario de las {{time}}` | `Edit {{time}} meal time` | `accessibilityLabel` del botón de cada fila (R4) |
$ grep -nF -- 'That time is not valid' specs/mobile-meal-schedule-editing/requirements.md
68:| `mealSchedule.errorInvalidTime` | `La hora no es válida` | `That time is not valid` | `400` (R8) |
$ grep -nF -- 'La hora no es válida' specs/mobile-meal-schedule-editing/requirements.md
68:| `mealSchedule.errorInvalidTime` | `La hora no es válida` | `That time is not valid` | `400` (R8) |
$ grep -nF -- 'Only the owner can change meal times' specs/mobile-meal-schedule-editing/requirements.md
69:| `mealSchedule.errorEditForbidden` | `Solo el dueño puede cambiar los horarios` | `Only the owner can change meal times` | `403` (R8) |
$ grep -nF -- 'Solo el dueño puede cambiar los horarios' specs/mobile-meal-schedule-editing/requirements.md
69:| `mealSchedule.errorEditForbidden` | `Solo el dueño puede cambiar los horarios` | `Only the owner can change meal times` | `403` (R8) |
$ grep -nF -- 'Generate a meal plan first' specs/mobile-meal-schedule-editing/requirements.md
70:| `mealSchedule.errorPlanRequired` | `Primero genera un plan de alimentación` | `Generate a meal plan first` | `422 NUTRITION_PLAN_REQUIRED` (R8) |
$ grep -nF -- 'Primero genera un plan de alimentación' specs/mobile-meal-schedule-editing/requirements.md
70:| `mealSchedule.errorPlanRequired` | `Primero genera un plan de alimentación` | `Generate a meal plan first` | `422 NUTRITION_PLAN_REQUIRED` (R8) |
$ grep -nF -- 'That meal time is no longer in the plan' specs/mobile-meal-schedule-editing/requirements.md
71:| `mealSchedule.errorTimeNotInPlan` | `Ese horario ya no está en el plan` | `That meal time is no longer in the plan` | `422 MEAL_TIME_NOT_IN_PLAN` (R8) |
$ grep -nF -- 'Ese horario ya no está en el plan' specs/mobile-meal-schedule-editing/requirements.md
71:| `mealSchedule.errorTimeNotInPlan` | `Ese horario ya no está en el plan` | `That meal time is no longer in the plan` | `422 MEAL_TIME_NOT_IN_PLAN` (R8) |
$ grep -nF -- 'There is already a meal at that time' specs/mobile-meal-schedule-editing/requirements.md
72:| `mealSchedule.errorDuplicateTime` | `Ya hay una comida a esa hora` | `There is already a meal at that time` | `422 MEAL_TIME_DUPLICATE` (R8) |
$ grep -nF -- 'Ya hay una comida a esa hora' specs/mobile-meal-schedule-editing/requirements.md
72:| `mealSchedule.errorDuplicateTime` | `Ya hay una comida a esa hora` | `There is already a meal at that time` | `422 MEAL_TIME_DUPLICATE` (R8) |
$ grep -nF -- 'The plan already has the maximum of 6 meals' specs/mobile-meal-schedule-editing/requirements.md
73:| `mealSchedule.errorMealLimit` | `El plan ya tiene el máximo de 6 comidas` | `The plan already has the maximum of 6 meals` | `422 MEAL_TIMES_LIMIT_REACHED` (R8) |
$ grep -nF -- 'El plan ya tiene el máximo de 6 comidas' specs/mobile-meal-schedule-editing/requirements.md
73:| `mealSchedule.errorMealLimit` | `El plan ya tiene el máximo de 6 comidas` | `The plan already has the maximum of 6 meals` | `422 MEAL_TIMES_LIMIT_REACHED` (R8) |
```

### R1 verde

Desde `mobile-pet-tracker/`: `bunx jest src/providers/__tests__/language-provider.test.tsx src/__tests__/ui-language.test.ts > /tmp/147-r1-green.log 2>&1; echo "exit=$?"`. Exit 0.

```text
Test Suites: 2 passed, 2 total
Tests:       39 passed, 39 total
Snapshots:   0 total
Time:        3.069 s
Ran all test suites matching /src\/providers\/__tests__\/language-provider.test.tsx|src\/__tests__\/ui-language.test.ts/i.
```

### R2 rojo

Desde `mobile-pet-tracker/`: `bunx jest src/api/__tests__/nutrition.test.ts > /tmp/147-r2-red.log 2>&1; echo "exit=$?"`. Exit 1.

```text
Test Suites: 1 failed, 1 total
Tests:       15 failed, 40 passed, 55 total
Snapshots:   0 total
Time:        2.101 s
Ran all test suites matching /src\/api\/__tests__\/nutrition.test.ts/i.
```

```text
  ● #147 R2: addMealTime publica la franja y mapea por kind › publica POST /meal-times con el token y el body exacto, y 201 es ok

    TypeError: (0 , _nutrition.addMealTime) is not a function

      412 |     const fetchFn = jest.fn().mockResolvedValue(response(201, makePlan())) as unknown as typeof fetch;
      413 |
    > 414 |     await expect(addMealTime(baseUrl, 'jwt-token', 'pet-1', '08:05', fetchFn)).resolves.toEqual({ kind: 'ok' });
          |                             ^
      415 |     expect(fetchFn).toHaveBeenCalledTimes(1);
      416 |     expect(fetchFn).toHaveBeenCalledWith('http://example.test/v1/pets/pet-1/meal-times', {
      417 |       method: 'POST',

      at Object.<anonymous> (src/api/__tests__/nutrition.test.ts:414:29)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
      at node_modules/@babel/runtime/helpers/asyncToGenerator.js:22:7
      at Object.<anonymous> (node_modules/@babel/runtime/helpers/asyncToGenerator.js:14:12)
```

```text
  ● #147 R2: addMealTime publica la franja y mapea por kind › mapea 400 a invalid

    TypeError: (0 , _nutrition.addMealTime) is not a function

      433 |   ])('mapea $label a $kind', async ({ backend, expected }) => {
      434 |     const fetchFn = jest.fn().mockResolvedValue(backend) as unknown as typeof fetch;
    > 435 |     await expect(addMealTime(baseUrl, 'jwt-token', 'pet-1', '08:05', fetchFn)).resolves.toEqual(expected);
          |                             ^
      436 |   });
      437 |
      438 |   it('devuelve unreachable con el mensaje si fetch rechaza', async () => {

      at src/api/__tests__/nutrition.test.ts:435:29
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
      at node_modules/@babel/runtime/helpers/asyncToGenerator.js:22:7
      at node_modules/@babel/runtime/helpers/asyncToGenerator.js:14:12
      at apply (src/api/__tests__/nutrition.test.ts:436:4)
```

```text
  ● #147 R2: addMealTime publica la franja y mapea por kind › mapea 403 a forbidden

    TypeError: (0 , _nutrition.addMealTime) is not a function

      433 |   ])('mapea $label a $kind', async ({ backend, expected }) => {
      434 |     const fetchFn = jest.fn().mockResolvedValue(backend) as unknown as typeof fetch;
    > 435 |     await expect(addMealTime(baseUrl, 'jwt-token', 'pet-1', '08:05', fetchFn)).resolves.toEqual(expected);
          |                             ^
      436 |   });
      437 |
      438 |   it('devuelve unreachable con el mensaje si fetch rechaza', async () => {

      at src/api/__tests__/nutrition.test.ts:435:29
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
      at node_modules/@babel/runtime/helpers/asyncToGenerator.js:22:7
      at node_modules/@babel/runtime/helpers/asyncToGenerator.js:14:12
      at apply (src/api/__tests__/nutrition.test.ts:436:4)
```

```text
  ● #147 R2: addMealTime publica la franja y mapea por kind › mapea 422 NUTRITION_PLAN_REQUIRED a unprocessable

    TypeError: (0 , _nutrition.addMealTime) is not a function

      433 |   ])('mapea $label a $kind', async ({ backend, expected }) => {
      434 |     const fetchFn = jest.fn().mockResolvedValue(backend) as unknown as typeof fetch;
    > 435 |     await expect(addMealTime(baseUrl, 'jwt-token', 'pet-1', '08:05', fetchFn)).resolves.toEqual(expected);
          |                             ^
      436 |   });
      437 |
      438 |   it('devuelve unreachable con el mensaje si fetch rechaza', async () => {

      at src/api/__tests__/nutrition.test.ts:435:29
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
      at node_modules/@babel/runtime/helpers/asyncToGenerator.js:22:7
      at node_modules/@babel/runtime/helpers/asyncToGenerator.js:14:12
      at apply (src/api/__tests__/nutrition.test.ts:436:4)
```

```text
  ● #147 R2: addMealTime publica la franja y mapea por kind › mapea 422 MEAL_TIME_NOT_IN_PLAN a unprocessable

    TypeError: (0 , _nutrition.addMealTime) is not a function

      433 |   ])('mapea $label a $kind', async ({ backend, expected }) => {
      434 |     const fetchFn = jest.fn().mockResolvedValue(backend) as unknown as typeof fetch;
    > 435 |     await expect(addMealTime(baseUrl, 'jwt-token', 'pet-1', '08:05', fetchFn)).resolves.toEqual(expected);
          |                             ^
      436 |   });
      437 |
      438 |   it('devuelve unreachable con el mensaje si fetch rechaza', async () => {

      at src/api/__tests__/nutrition.test.ts:435:29
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
      at node_modules/@babel/runtime/helpers/asyncToGenerator.js:22:7
      at node_modules/@babel/runtime/helpers/asyncToGenerator.js:14:12
      at apply (src/api/__tests__/nutrition.test.ts:436:4)
```

```text
  ● #147 R2: addMealTime publica la franja y mapea por kind › mapea 422 MEAL_TIME_DUPLICATE a unprocessable

    TypeError: (0 , _nutrition.addMealTime) is not a function

      433 |   ])('mapea $label a $kind', async ({ backend, expected }) => {
      434 |     const fetchFn = jest.fn().mockResolvedValue(backend) as unknown as typeof fetch;
    > 435 |     await expect(addMealTime(baseUrl, 'jwt-token', 'pet-1', '08:05', fetchFn)).resolves.toEqual(expected);
          |                             ^
      436 |   });
      437 |
      438 |   it('devuelve unreachable con el mensaje si fetch rechaza', async () => {

      at src/api/__tests__/nutrition.test.ts:435:29
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
      at node_modules/@babel/runtime/helpers/asyncToGenerator.js:22:7
      at node_modules/@babel/runtime/helpers/asyncToGenerator.js:14:12
      at apply (src/api/__tests__/nutrition.test.ts:436:4)
```

```text
  ● #147 R2: addMealTime publica la franja y mapea por kind › mapea 422 MEAL_TIMES_LIMIT_REACHED a unprocessable

    TypeError: (0 , _nutrition.addMealTime) is not a function

      433 |   ])('mapea $label a $kind', async ({ backend, expected }) => {
      434 |     const fetchFn = jest.fn().mockResolvedValue(backend) as unknown as typeof fetch;
    > 435 |     await expect(addMealTime(baseUrl, 'jwt-token', 'pet-1', '08:05', fetchFn)).resolves.toEqual(expected);
          |                             ^
      436 |   });
      437 |
      438 |   it('devuelve unreachable con el mensaje si fetch rechaza', async () => {

      at src/api/__tests__/nutrition.test.ts:435:29
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
      at node_modules/@babel/runtime/helpers/asyncToGenerator.js:22:7
      at node_modules/@babel/runtime/helpers/asyncToGenerator.js:14:12
      at apply (src/api/__tests__/nutrition.test.ts:436:4)
```

```text
  ● #147 R2: addMealTime publica la franja y mapea por kind › mapea 422 SOMETHING_ELSE a error

    TypeError: (0 , _nutrition.addMealTime) is not a function

      433 |   ])('mapea $label a $kind', async ({ backend, expected }) => {
      434 |     const fetchFn = jest.fn().mockResolvedValue(backend) as unknown as typeof fetch;
    > 435 |     await expect(addMealTime(baseUrl, 'jwt-token', 'pet-1', '08:05', fetchFn)).resolves.toEqual(expected);
          |                             ^
      436 |   });
      437 |
      438 |   it('devuelve unreachable con el mensaje si fetch rechaza', async () => {

      at src/api/__tests__/nutrition.test.ts:435:29
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
      at node_modules/@babel/runtime/helpers/asyncToGenerator.js:22:7
      at node_modules/@babel/runtime/helpers/asyncToGenerator.js:14:12
      at apply (src/api/__tests__/nutrition.test.ts:436:4)
```

```text
  ● #147 R2: addMealTime publica la franja y mapea por kind › mapea 422 JSON inválido a error

    TypeError: (0 , _nutrition.addMealTime) is not a function

      433 |   ])('mapea $label a $kind', async ({ backend, expected }) => {
      434 |     const fetchFn = jest.fn().mockResolvedValue(backend) as unknown as typeof fetch;
    > 435 |     await expect(addMealTime(baseUrl, 'jwt-token', 'pet-1', '08:05', fetchFn)).resolves.toEqual(expected);
          |                             ^
      436 |   });
      437 |
      438 |   it('devuelve unreachable con el mensaje si fetch rechaza', async () => {

      at src/api/__tests__/nutrition.test.ts:435:29
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
      at node_modules/@babel/runtime/helpers/asyncToGenerator.js:22:7
      at node_modules/@babel/runtime/helpers/asyncToGenerator.js:14:12
      at apply (src/api/__tests__/nutrition.test.ts:436:4)
```

```text
  ● #147 R2: addMealTime publica la franja y mapea por kind › mapea 401 a unauthorized

    TypeError: (0 , _nutrition.addMealTime) is not a function

      433 |   ])('mapea $label a $kind', async ({ backend, expected }) => {
      434 |     const fetchFn = jest.fn().mockResolvedValue(backend) as unknown as typeof fetch;
    > 435 |     await expect(addMealTime(baseUrl, 'jwt-token', 'pet-1', '08:05', fetchFn)).resolves.toEqual(expected);
          |                             ^
      436 |   });
      437 |
      438 |   it('devuelve unreachable con el mensaje si fetch rechaza', async () => {

      at src/api/__tests__/nutrition.test.ts:435:29
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
      at node_modules/@babel/runtime/helpers/asyncToGenerator.js:22:7
      at node_modules/@babel/runtime/helpers/asyncToGenerator.js:14:12
      at apply (src/api/__tests__/nutrition.test.ts:436:4)
```

```text
  ● #147 R2: addMealTime publica la franja y mapea por kind › mapea 200 a error

    TypeError: (0 , _nutrition.addMealTime) is not a function

      433 |   ])('mapea $label a $kind', async ({ backend, expected }) => {
      434 |     const fetchFn = jest.fn().mockResolvedValue(backend) as unknown as typeof fetch;
    > 435 |     await expect(addMealTime(baseUrl, 'jwt-token', 'pet-1', '08:05', fetchFn)).resolves.toEqual(expected);
          |                             ^
      436 |   });
      437 |
      438 |   it('devuelve unreachable con el mensaje si fetch rechaza', async () => {

      at src/api/__tests__/nutrition.test.ts:435:29
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
      at node_modules/@babel/runtime/helpers/asyncToGenerator.js:22:7
      at node_modules/@babel/runtime/helpers/asyncToGenerator.js:14:12
      at apply (src/api/__tests__/nutrition.test.ts:436:4)
```

```text
  ● #147 R2: addMealTime publica la franja y mapea por kind › mapea 404 a error

    TypeError: (0 , _nutrition.addMealTime) is not a function

      433 |   ])('mapea $label a $kind', async ({ backend, expected }) => {
      434 |     const fetchFn = jest.fn().mockResolvedValue(backend) as unknown as typeof fetch;
    > 435 |     await expect(addMealTime(baseUrl, 'jwt-token', 'pet-1', '08:05', fetchFn)).resolves.toEqual(expected);
          |                             ^
      436 |   });
      437 |
      438 |   it('devuelve unreachable con el mensaje si fetch rechaza', async () => {

      at src/api/__tests__/nutrition.test.ts:435:29
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
      at node_modules/@babel/runtime/helpers/asyncToGenerator.js:22:7
      at node_modules/@babel/runtime/helpers/asyncToGenerator.js:14:12
      at apply (src/api/__tests__/nutrition.test.ts:436:4)
```

```text
  ● #147 R2: addMealTime publica la franja y mapea por kind › mapea 500 a error

    TypeError: (0 , _nutrition.addMealTime) is not a function

      433 |   ])('mapea $label a $kind', async ({ backend, expected }) => {
      434 |     const fetchFn = jest.fn().mockResolvedValue(backend) as unknown as typeof fetch;
    > 435 |     await expect(addMealTime(baseUrl, 'jwt-token', 'pet-1', '08:05', fetchFn)).resolves.toEqual(expected);
          |                             ^
      436 |   });
      437 |
      438 |   it('devuelve unreachable con el mensaje si fetch rechaza', async () => {

      at src/api/__tests__/nutrition.test.ts:435:29
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
      at node_modules/@babel/runtime/helpers/asyncToGenerator.js:22:7
      at node_modules/@babel/runtime/helpers/asyncToGenerator.js:14:12
      at apply (src/api/__tests__/nutrition.test.ts:436:4)
```

```text
  ● #147 R2: addMealTime publica la franja y mapea por kind › devuelve unreachable con el mensaje si fetch rechaza

    TypeError: (0 , _nutrition.addMealTime) is not a function

      438 |   it('devuelve unreachable con el mensaje si fetch rechaza', async () => {
      439 |     const fetchFn = jest.fn().mockRejectedValue(new Error('network down')) as unknown as typeof fetch;
    > 440 |     await expect(addMealTime(baseUrl, 'jwt-token', 'pet-1', '08:05', fetchFn)).resolves.toEqual({ kind: 'unreachable', message: 'network down' });
          |                             ^
      441 |   });
      442 |
      443 |   it('devuelve missing-config sin llamar a fetch si falta la URL base', async () => {

      at Object.<anonymous> (src/api/__tests__/nutrition.test.ts:440:29)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
      at node_modules/@babel/runtime/helpers/asyncToGenerator.js:22:7
      at Object.<anonymous> (node_modules/@babel/runtime/helpers/asyncToGenerator.js:14:12)
```

```text
  ● #147 R2: addMealTime publica la franja y mapea por kind › devuelve missing-config sin llamar a fetch si falta la URL base

    TypeError: (0 , _nutrition.addMealTime) is not a function

      443 |   it('devuelve missing-config sin llamar a fetch si falta la URL base', async () => {
      444 |     const fetchFn = jest.fn() as unknown as typeof fetch;
    > 445 |     await expect(addMealTime(undefined, 'jwt-token', 'pet-1', '08:05', fetchFn)).resolves.toEqual({ kind: 'missing-config' });
          |                             ^
      446 |     expect(fetchFn).not.toHaveBeenCalled();
      447 |   });
      448 | });

      at Object.<anonymous> (src/api/__tests__/nutrition.test.ts:445:29)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
      at node_modules/@babel/runtime/helpers/asyncToGenerator.js:22:7
      at Object.<anonymous> (node_modules/@babel/runtime/helpers/asyncToGenerator.js:14:12)
```

Comprobación de literales antes del commit rojo R2:

```text
Sin literales de copy nuevos en este rojo; solo contrato, claves, horas o testID.
```

### R2 verde

Desde `mobile-pet-tracker/`: `bunx jest src/api/__tests__/nutrition.test.ts > /tmp/147-r2-green.log 2>&1; echo "exit=$?"`. Exit 0.

```text
Test Suites: 1 passed, 1 total
Tests:       55 passed, 55 total
Snapshots:   0 total
Time:        1.935 s, estimated 2 s
Ran all test suites matching /src\/api\/__tests__\/nutrition.test.ts/i.
```

### R3 rojo

Desde `mobile-pet-tracker/`: `bunx jest src/api/__tests__/nutrition.test.ts > /tmp/147-r3-red.log 2>&1; echo "exit=$?"`. Exit 1.

```text
Test Suites: 1 failed, 1 total
Tests:       3 failed, 55 passed, 58 total
Snapshots:   0 total
Time:        2.097 s
Ran all test suites matching /src\/api\/__tests__\/nutrition.test.ts/i.
```

```text
  ● #147 R3: moveMealTime publica el PATCH y mapea por kind › publica PATCH /meal-times/:from con body { mealTime: to }, y 200 es ok

    TypeError: (0 , _nutrition.moveMealTime) is not a function

      453 |   it('publica PATCH /meal-times/:from con body { mealTime: to }, y 200 es ok', async () => {
      454 |     const fetchFn = jest.fn().mockResolvedValue(response(200, makePlan())) as unknown as typeof fetch;
    > 455 |     await expect(moveMealTime(baseUrl, 'jwt-token', 'pet-1', '19:30', '20:05', fetchFn)).resolves.toEqual({ kind: 'ok' });
          |                              ^
      456 |     expect(fetchFn).toHaveBeenCalledTimes(1);
      457 |     expect(fetchFn).toHaveBeenCalledWith('http://example.test/v1/pets/pet-1/meal-times/19:30', {
      458 |       method: 'PATCH',

      at Object.<anonymous> (src/api/__tests__/nutrition.test.ts:455:30)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
      at node_modules/@babel/runtime/helpers/asyncToGenerator.js:22:7
      at Object.<anonymous> (node_modules/@babel/runtime/helpers/asyncToGenerator.js:14:12)
```

```text
  ● #147 R3: moveMealTime publica el PATCH y mapea por kind › trata un 201 como error

    TypeError: (0 , _nutrition.moveMealTime) is not a function

      464 |   it('trata un 201 como error', async () => {
      465 |     const fetchFn = jest.fn().mockResolvedValue(response(201, {})) as unknown as typeof fetch;
    > 466 |     await expect(moveMealTime(baseUrl, 'jwt-token', 'pet-1', '19:30', '20:05', fetchFn)).resolves.toEqual({ kind: 'error' });
          |                              ^
      467 |   });
      468 |
      469 |   it('comparte el mapeo de errores de addMealTime', async () => {

      at Object.<anonymous> (src/api/__tests__/nutrition.test.ts:466:30)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
      at node_modules/@babel/runtime/helpers/asyncToGenerator.js:22:7
      at Object.<anonymous> (node_modules/@babel/runtime/helpers/asyncToGenerator.js:14:12)
```

```text
  ● #147 R3: moveMealTime publica el PATCH y mapea por kind › comparte el mapeo de errores de addMealTime

    TypeError: (0 , _nutrition.moveMealTime) is not a function

      479 |     ] as const) {
      480 |       fetchMock.mockResolvedValueOnce(backend);
    > 481 |       await expect(moveMealTime(baseUrl, 'jwt-token', 'pet-1', '19:30', '20:05', fetchFn)).resolves.toEqual(expected);
          |                                ^
      482 |     }
      483 |     fetchMock.mockRejectedValueOnce(new Error('network down'));
      484 |     await expect(moveMealTime(baseUrl, 'jwt-token', 'pet-1', '19:30', '20:05', fetchFn)).resolves.toEqual({ kind: 'unreachable', message: 'network down' });

      at Object.<anonymous> (src/api/__tests__/nutrition.test.ts:481:32)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
      at node_modules/@babel/runtime/helpers/asyncToGenerator.js:22:7
      at Object.<anonymous> (node_modules/@babel/runtime/helpers/asyncToGenerator.js:14:12)
```

Comprobación de literales antes del commit rojo R3:

```text
Sin literales de copy nuevos en este rojo; solo contrato, claves, horas o testID.
```

### R3 verde

Desde `mobile-pet-tracker/`: `bunx jest src/api/__tests__/nutrition.test.ts > /tmp/147-r3-green.log 2>&1; echo "exit=$?"`. Exit 0.

```text
Test Suites: 1 passed, 1 total
Tests:       58 passed, 58 total
Snapshots:   0 total
Time:        1.823 s, estimated 2 s
Ran all test suites matching /src\/api\/__tests__\/nutrition.test.ts/i.
```

### R4 rojo

Desde `mobile-pet-tracker/`: `bunx jest src/screens/meal-schedule > /tmp/147-r4-red.log 2>&1; echo "exit=$?"`. Exit 1.

```text
Test Suites: 1 failed, 1 total
Tests:       6 failed, 22 passed, 28 total
Snapshots:   0 total
Time:        10.639 s
Ran all test suites matching /src\/screens\/meal-schedule/i.
```

```text
  ● #147 R4: solo el owner ve Editar y Añadir comida › el owner ve Editar en cada fila y Añadir comida bajo la lista

    expect(received).toEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 0

      Array [
        undefined,
        undefined,
        undefined,
    -   "meal-time-edit-1",
      ]

      514 |     mockGetPet.mockResolvedValue(petState('owner'));
      515 |     await renderMealSchedule();
    > 516 |     await waitFor(() => expect(childTestIds(screen.getByTestId('meal-time-row-1'))).toEqual([undefined, undefined, undefined, 'meal-time-edit-1']));
          |                  ^
      517 |     expect(childTestIds(screen.getByTestId('meal-time-row-0'))).toEqual([undefined, undefined, undefined, 'meal-time-edit-0']);
      518 |     expect(mockGetPet).toHaveBeenCalledWith('http://example.test/v1', 'jwt-token', 'pet-1');
      519 |     expect(childTestIds(screen.getByTestId('meal-times-section'))).toEqual([undefined, 'meal-time-row-0', 'meal-time-row-1', 'add-meal-time-button']);

      at Object.<anonymous> (src/screens/meal-schedule/index.test.tsx:516:18)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

```text
  ● #147 R4: solo el owner ve Editar y Añadir comida › family no ve controles de edición

    expect(received).toEqual(expected) // deep equality

    Expected: {"kind": "ok", "pet": {"activitySummary": null, "ageMonths": 30, "approxAgeMonths": null, "birthDate": null, "breed": null, "color": null, "createdAt": "2026-10-01T12:00:00.000Z", "currentWeightKg": null, "device": null, "id": "pet-1", "lastCommunicationAt": null, "lastPosition": null, "lostMode": false, "mealsToday": null, "microchip": null, "myRole": "family", "name": "Luna", "nextReminder": null, "nextVaccine": null, "photoUrl": null, "sex": null, "size": null, "species": "dog", "sterilized": null, "updatedAt": "2026-10-01T12:00:00.000Z"}}
    Received: undefined

      534 |     mockGetPet.mockResolvedValue(petState(role));
      535 |     const { queryClient } = await renderMealSchedule();
    > 536 |     await waitFor(() => {
          |                  ^
      537 |       expect(queryClient.getQueryData(['pets', 'detail', 'pet-1'])).toEqual(petState(role));
      538 |       expect(childTestIds(screen.getByTestId('meal-times-section'))).toEqual([undefined, 'meal-time-row-0', 'meal-time-row-1']);
      539 |       for (const index of [0, 1]) {

      at src/screens/meal-schedule/index.test.tsx:536:18
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

```text
  ● #147 R4: solo el owner ve Editar y Añadir comida › walker no ve controles de edición

    expect(received).toEqual(expected) // deep equality

    Expected: {"kind": "ok", "pet": {"activitySummary": null, "ageMonths": 30, "approxAgeMonths": null, "birthDate": null, "breed": null, "color": null, "createdAt": "2026-10-01T12:00:00.000Z", "currentWeightKg": null, "device": null, "id": "pet-1", "lastCommunicationAt": null, "lastPosition": null, "lostMode": false, "mealsToday": null, "microchip": null, "myRole": "walker", "name": "Luna", "nextReminder": null, "nextVaccine": null, "photoUrl": null, "sex": null, "size": null, "species": "dog", "sterilized": null, "updatedAt": "2026-10-01T12:00:00.000Z"}}
    Received: undefined

      534 |     mockGetPet.mockResolvedValue(petState(role));
      535 |     const { queryClient } = await renderMealSchedule();
    > 536 |     await waitFor(() => {
          |                  ^
      537 |       expect(queryClient.getQueryData(['pets', 'detail', 'pet-1'])).toEqual(petState(role));
      538 |       expect(childTestIds(screen.getByTestId('meal-times-section'))).toEqual([undefined, 'meal-time-row-0', 'meal-time-row-1']);
      539 |       for (const index of [0, 1]) {

      at src/screens/meal-schedule/index.test.tsx:536:18
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

```text
  ● #147 R4: solo el owner ve Editar y Añadir comida › vet no ve controles de edición

    expect(received).toEqual(expected) // deep equality

    Expected: {"kind": "ok", "pet": {"activitySummary": null, "ageMonths": 30, "approxAgeMonths": null, "birthDate": null, "breed": null, "color": null, "createdAt": "2026-10-01T12:00:00.000Z", "currentWeightKg": null, "device": null, "id": "pet-1", "lastCommunicationAt": null, "lastPosition": null, "lostMode": false, "mealsToday": null, "microchip": null, "myRole": "vet", "name": "Luna", "nextReminder": null, "nextVaccine": null, "photoUrl": null, "sex": null, "size": null, "species": "dog", "sterilized": null, "updatedAt": "2026-10-01T12:00:00.000Z"}}
    Received: undefined

      534 |     mockGetPet.mockResolvedValue(petState(role));
      535 |     const { queryClient } = await renderMealSchedule();
    > 536 |     await waitFor(() => {
          |                  ^
      537 |       expect(queryClient.getQueryData(['pets', 'detail', 'pet-1'])).toEqual(petState(role));
      538 |       expect(childTestIds(screen.getByTestId('meal-times-section'))).toEqual([undefined, 'meal-time-row-0', 'meal-time-row-1']);
      539 |       for (const index of [0, 1]) {

      at src/screens/meal-schedule/index.test.tsx:536:18
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

```text
  ● #147 R4: solo el owner ve Editar y Añadir comida › sin el detalle de la mascota resuelto no hay controles

    Unable to find an element with testID: meal-times-section

    <RNCSafeAreaProvider>
      <RCTScrollView
        testID="screen-meal-schedule"
      >
        <View>
          <View>
            <View
              testID="meal-schedule-summary"
            >
              <View>
                <View>
                  <Text>
                    Objetivo diario
                  </Text>
                  <Text>
                    656
                     kcal
                  </Text>
                  <Text>
                    187 g / día
                  </Text>
                </View>
                <View>
                  <View
                    testID="meal-schedule-icon-fork-knife"
                  />
                  <Text>
                    2 comidas / día
                  </Text>
                </View>
              </View>
            </View>
            <View>
              <Text>
                Horarios y porciones
              </Text>
              <View
                testID="meal-time-row-0"
              >
                <View>
                  <View
                    testID="meal-schedule-icon-clock"
                  />
                </View>
                <Text>
                  07:30
                </Text>
                <Text>
                  94
                   g
                </Text>
              </View>
              <View
                testID="meal-time-row-1"
              >
                <View>
                  <View
                    testID="meal-schedule-icon-clock"
                  />
                </View>
                <Text>
                  19:30
                </Text>
                <Text>
                  94
                   g
                </Text>
              </View>
            </View>
            <View>
              <View
                accessibilityRole="button"
                accessibilityState={
                  {
                    "disabled": false,
                  }
                }
                accessible={true}
                testID="generate-plan-button"
              >
                <View
                  pointerEvents="none"
                  style={
                    {
                      "opacity": 0,
                    }
                  }
                />
                <Text>
                  Generar plan
                </Text>
              </View>
            </View>
            <View
              testID="nutrition-profile-section"
            >
              <Text
                testID="nutrition-profile-title"
              >
                Perfil nutricional
              </Text>
              <View>
                <Text>
                  dry
                </Text>
                <Text>
                  350
                   kcal / 100 g
                </Text>
                <Text>
                  medium
                </Text>
              </View>
              <Text
                testID="profile-allergies"
              >
                chicken, soy
              </Text>
              <Text
                testID="profile-diseases"
              >
                arthritis
              </Text>
            </View>
          </View>
        </View>
      </RCTScrollView>
    </RNCSafeAreaProvider>

      548 |     mockGetPet.mockReturnValue(pending<PetState>());
      549 |     await renderMealSchedule();
    > 550 |     await waitFor(() => {
          |                  ^
      551 |       expect(childTestIds(screen.getByTestId('meal-times-section'))).toEqual([undefined, 'meal-time-row-0', 'meal-time-row-1']);
      552 |       expect(screen.getByTestId('meal-time-row-1')).toBeVisible();
      553 |       expect(mockGetPet).toHaveBeenCalled();

      at Object.<anonymous> (src/screens/meal-schedule/index.test.tsx:550:18)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

```text
  ● #147 R4: solo el owner ve Editar y Añadir comida › con el detalle de la mascota en error no hay controles

    expect(received).toEqual(expected) // deep equality

    Expected: {"kind": "error"}
    Received: undefined

      563 |     mockGetPet.mockResolvedValue({ kind: 'error' });
      564 |     const { queryClient } = await renderMealSchedule();
    > 565 |     await waitFor(() => {
          |                  ^
      566 |       expect(queryClient.getQueryData(['pets', 'detail', 'pet-1'])).toEqual({ kind: 'error' });
      567 |       expect(childTestIds(screen.getByTestId('meal-times-section'))).toEqual([undefined, 'meal-time-row-0', 'meal-time-row-1']);
      568 |       for (const index of [0, 1]) {

      at Object.<anonymous> (src/screens/meal-schedule/index.test.tsx:565:18)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

Comprobación de literales antes del commit rojo R4:

```text
$ grep -nF -- '`Add meal`' specs/mobile-meal-schedule-editing/requirements.md
65:| `mealSchedule.addMeal` | `Añadir comida` | `Add meal` | etiqueta del botón bajo la lista (R4) |
$ grep -nF -- '`Añadir comida`' specs/mobile-meal-schedule-editing/requirements.md
65:| `mealSchedule.addMeal` | `Añadir comida` | `Add meal` | etiqueta del botón bajo la lista (R4) |
$ grep -nF -- '`Edit`' specs/mobile-meal-schedule-editing/requirements.md
66:| `mealSchedule.editTime` | `Editar` | `Edit` | etiqueta visible del botón de cada fila (R4) |
$ grep -nF -- '`Editar`' specs/mobile-meal-schedule-editing/requirements.md
66:| `mealSchedule.editTime` | `Editar` | `Edit` | etiqueta visible del botón de cada fila (R4) |
$ grep -nF -- '`Edit {{time}} meal time`' specs/mobile-meal-schedule-editing/requirements.md
67:| `mealSchedule.editTimeLabel` **(param)** | `Editar horario de las {{time}}` | `Edit {{time}} meal time` | `accessibilityLabel` del botón de cada fila (R4) |
$ grep -nF -- '`Editar horario de las {{time}}`' specs/mobile-meal-schedule-editing/requirements.md
67:| `mealSchedule.editTimeLabel` **(param)** | `Editar horario de las {{time}}` | `Edit {{time}} meal time` | `accessibilityLabel` del botón de cada fila (R4) |
```

### R4 verde

Desde `mobile-pet-tracker/`: `bunx jest src/screens/meal-schedule > /tmp/147-r4-green.log 2>&1; echo "exit=$?"`. Exit 0.

```text
Test Suites: 1 passed, 1 total
Tests:       28 passed, 28 total
Snapshots:   0 total
Time:        5.196 s, estimated 11 s
Ran all test suites matching /src\/screens\/meal-schedule/i.
```

### R5 rojo

Desde `mobile-pet-tracker/`: `bunx jest src/screens/meal-schedule > /tmp/147-r5-red.log 2>&1; echo "exit=$?"`. Exit 1.

```text
Test Suites: 1 failed, 1 total
Tests:       4 failed, 28 passed, 32 total
Snapshots:   0 total
Time:        5.45 s, estimated 6 s
Ran all test suites matching /src\/screens\/meal-schedule/i.
```

```text
  ● #147 R5: Editar abre el selector en la hora de la fila y publica el PATCH › abre un único selector de hora con la hora local de la fila

    expect(received).not.toBeNull()

    Received: null

      625 |       await renderMealSchedule();
      626 |       await fireEvent.press(await screen.findByTestId('meal-time-edit-1'));
    > 627 |       expect(screen.queryByTestId('meal-time-picker')).not.toBeNull();
          |                                                            ^
      628 |       expect(screen.getAllByTestId('meal-time-picker')).toHaveLength(1);
      629 |       expect(screen.getAllByTestId('expo-ui-picker-host')).toHaveLength(1);
      630 |       const picker = screen.getByTestId('meal-time-picker');

      at Object.toBeNull (src/screens/meal-schedule/index.test.tsx:627:60)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

```text
  ● #147 R5: Editar abre el selector en la hora de la fila y publica el PATCH › al elegir una hora nueva llama a moveMealTime con la hora local y cierra el selector

    expect(received).not.toBeNull()

    Received: null

      643 |     await renderMealSchedule();
      644 |     await fireEvent.press(await screen.findByTestId('meal-time-edit-1'));
    > 645 |     expect(screen.queryByTestId('meal-time-picker')).not.toBeNull();
          |                                                          ^
      646 |     const chosen = Object.assign(new Date(2026, 9, 2, 20, 5), { getUTCHours: () => 3, getUTCMinutes: () => 7, toISOString: () => '2026-10-03T03:07:00.000Z' });
      647 |     await fireEvent(screen.getByTestId('meal-time-picker'), 'onValueChange', {}, chosen);
      648 |     await waitFor(() => {

      at Object.toBeNull (src/screens/meal-schedule/index.test.tsx:645:58)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

```text
  ● #147 R5: Editar abre el selector en la hora de la fila y publica el PATCH › al cerrar el selector sin elegir no llama a nada

    expect(received).not.toBeNull()

    Received: null

      659 |     await renderMealSchedule();
      660 |     await fireEvent.press(await screen.findByTestId('meal-time-edit-1'));
    > 661 |     expect(screen.queryByTestId('meal-time-picker')).not.toBeNull();
          |                                                          ^
      662 |     await fireEvent(screen.getByTestId('meal-time-picker'), 'onDismiss');
      663 |     await waitFor(() => {
      664 |       expect(screen.getByTestId('meal-time-edit-0')).toBeVisible();

      at Object.toBeNull (src/screens/meal-schedule/index.test.tsx:661:58)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

```text
  ● #147 R5: Editar abre el selector en la hora de la fila y publica el PATCH › elegir la misma hora de la fila no llama a nada

    expect(received).not.toBeNull()

    Received: null

      673 |     await renderMealSchedule();
      674 |     await fireEvent.press(await screen.findByTestId('meal-time-edit-1'));
    > 675 |     expect(screen.queryByTestId('meal-time-picker')).not.toBeNull();
          |                                                          ^
      676 |     await fireEvent(screen.getByTestId('meal-time-picker'), 'onValueChange', {}, new Date(2026, 9, 2, 19, 30));
      677 |     await waitFor(() => {
      678 |       expect(screen.getByTestId('meal-time-edit-0')).toBeVisible();

      at Object.toBeNull (src/screens/meal-schedule/index.test.tsx:675:58)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

Comprobación de literales antes del commit rojo R5:

```text
Sin literales de copy nuevos en este rojo; solo contrato, claves, horas o testID.
```

### R5 verde

Desde `mobile-pet-tracker/`: `bunx jest src/screens/meal-schedule > /tmp/147-r5-green.log 2>&1; echo "exit=$?"`. Exit 0.

```text
Test Suites: 1 passed, 1 total
Tests:       32 passed, 32 total
Snapshots:   0 total
Time:        7.798 s
Ran all test suites matching /src\/screens\/meal-schedule/i.
```

### R6 rojo

Desde `mobile-pet-tracker/`: `bunx jest src/screens/meal-schedule > /tmp/147-r6-red.log 2>&1; echo "exit=$?"`. Exit 1.

```text
Test Suites: 1 failed, 1 total
Tests:       3 failed, 32 passed, 35 total
Snapshots:   0 total
Time:        5.919 s, estimated 8 s
Ran all test suites matching /src\/screens\/meal-schedule/i.
```

```text
  ● #147 R6: Añadir comida abre el selector a las 12:00 y publica el POST › abre el selector a las 12:00 locales

    expect(received).not.toBeNull()

    Received: null

      703 |       await renderMealSchedule();
      704 |       await fireEvent.press(await screen.findByTestId('add-meal-time-button'));
    > 705 |       expect(screen.queryByTestId('meal-time-picker')).not.toBeNull();
          |                                                            ^
      706 |       const picker = screen.getByTestId('meal-time-picker');
      707 |       expect([picker.props.value.getHours(), picker.props.value.getMinutes()]).toEqual([12, 0]);
      708 |       expect(picker.props.mode).toBe('time');

      at Object.toBeNull (src/screens/meal-schedule/index.test.tsx:705:60)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

```text
  ● #147 R6: Añadir comida abre el selector a las 12:00 y publica el POST › al elegir una hora llama a addMealTime con la hora local rellenada a dos dígitos

    expect(received).not.toBeNull()

    Received: null

      719 |     await renderMealSchedule();
      720 |     await fireEvent.press(await screen.findByTestId('add-meal-time-button'));
    > 721 |     expect(screen.queryByTestId('meal-time-picker')).not.toBeNull();
          |                                                          ^
      722 |     const chosen = Object.assign(new Date(2026, 9, 2, 8, 5), { getUTCHours: () => 14, getUTCMinutes: () => 7, toISOString: () => '2026-10-02T14:07:00.000Z' });
      723 |     await fireEvent(screen.getByTestId('meal-time-picker'), 'onValueChange', {}, chosen);
      724 |     await waitFor(() => {

      at Object.toBeNull (src/screens/meal-schedule/index.test.tsx:721:58)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

```text
  ● #147 R6: Añadir comida abre el selector a las 12:00 y publica el POST › al cerrar el selector sin elegir no llama a nada

    expect(received).not.toBeNull()

    Received: null

      735 |     await renderMealSchedule();
      736 |     await fireEvent.press(await screen.findByTestId('add-meal-time-button'));
    > 737 |     expect(screen.queryByTestId('meal-time-picker')).not.toBeNull();
          |                                                          ^
      738 |     await fireEvent(screen.getByTestId('meal-time-picker'), 'onDismiss');
      739 |     await waitFor(() => {
      740 |       expect(screen.getByTestId('meal-time-edit-0')).toBeVisible();

      at Object.toBeNull (src/screens/meal-schedule/index.test.tsx:737:58)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

Comprobación de literales antes del commit rojo R6:

```text
Sin literales de copy nuevos en este rojo; solo contrato, claves, horas o testID.
```

### R6 verde

Desde `mobile-pet-tracker/`: `bunx jest src/screens/meal-schedule > /tmp/147-r6-green.log 2>&1; echo "exit=$?"`. Exit 0.

```text
Test Suites: 1 passed, 1 total
Tests:       35 passed, 35 total
Snapshots:   0 total
Time:        5.914 s, estimated 6 s
Ran all test suites matching /src\/screens\/meal-schedule/i.
```

### R7 rojo

Desde `mobile-pet-tracker/`: `bunx jest src/screens/meal-schedule > /tmp/147-r7-red.log 2>&1; echo "exit=$?"`. Exit 1.

```text
Test Suites: 1 failed, 1 total
Tests:       3 failed, 36 passed, 39 total
Snapshots:   0 total
Time:        9.294 s
Ran all test suites matching /src\/screens\/meal-schedule/i.
```

```text
  ● #147 R7: tras un éxito refetchea plan y mascota, sin estado optimista › tras ok refetchea el plan y el detalle de la mascota y repinta con la hora nueva

    expect(received).not.toBeNull()

    Received: null

      764 |     await fireEvent.press(await screen.findByTestId('meal-time-edit-1'));
      765 |     await fireEvent(screen.getByTestId('meal-time-picker'), 'onValueChange', {}, new Date(2026, 9, 2, 20, 5));
    > 766 |     await waitFor(() => {
          |                  ^
      767 |       expect(within(screen.getByTestId('meal-time-row-1')).queryByText('20:05')).not.toBeNull();
      768 |       expect(screen.getByTestId('meal-time-edit-0').props.accessibilityState).not.toEqual(expect.objectContaining({ disabled: true }));
      769 |     });

      at Object.<anonymous> (src/screens/meal-schedule/index.test.tsx:766:18)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

```text
  ● #147 R7: tras un éxito refetchea plan y mascota, sin estado optimista › mientras la edición vuela, todos los controles están deshabilitados y la lista no cambia

    expect(received).toEqual(expected) // deep equality

    - Expected  - 2
    + Received  + 6

    - ObjectContaining {
    -   "disabled": true,
    + Object {
    +   "busy": undefined,
    +   "checked": undefined,
    +   "disabled": false,
    +   "expanded": undefined,
    +   "selected": undefined,
      }

      779 |     await fireEvent.press(await screen.findByTestId('meal-time-edit-1'));
      780 |     await fireEvent(screen.getByTestId('meal-time-picker'), 'onValueChange', {}, new Date(2026, 9, 2, 20, 5));
    > 781 |     await waitFor(() => {
          |                  ^
      782 |       expect(mockMoveMealTime).toHaveBeenCalledTimes(1);
      783 |       for (const id of ['meal-time-edit-0', 'meal-time-edit-1', 'add-meal-time-button']) {
      784 |         expect(screen.getByTestId(id).props.accessibilityState).toEqual(expect.objectContaining({ disabled: true }));

      at Object.<anonymous> (src/screens/meal-schedule/index.test.tsx:781:18)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

```text
  ● #147 R7: tras un éxito refetchea plan y mascota, sin estado optimista › los controles siguen deshabilitados hasta que termina el refetch

    expect(received).toEqual(expected) // deep equality

    - Expected  - 2
    + Received  + 6

    - ObjectContaining {
    -   "disabled": true,
    + Object {
    +   "busy": undefined,
    +   "checked": undefined,
    +   "disabled": false,
    +   "expanded": undefined,
    +   "selected": undefined,
      }

      798 |     await fireEvent.press(await screen.findByTestId('meal-time-edit-1'));
      799 |     await fireEvent(screen.getByTestId('meal-time-picker'), 'onValueChange', {}, new Date(2026, 9, 2, 20, 5));
    > 800 |     await waitFor(() => {
          |                  ^
      801 |       for (const id of ['meal-time-edit-0', 'meal-time-edit-1', 'add-meal-time-button']) {
      802 |         expect(screen.getByTestId(id).props.accessibilityState).toEqual(expect.objectContaining({ disabled: true }));
      803 |       }

      at Object.<anonymous> (src/screens/meal-schedule/index.test.tsx:800:18)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

Comprobación de literales antes del commit rojo R7:

```text
Sin literales de copy nuevos en este rojo; solo contrato, claves, horas o testID.
```

### R7 verde

Desde `mobile-pet-tracker/`: `bunx jest src/screens/meal-schedule > /tmp/147-r7-green.log 2>&1; echo "exit=$?"`. Exit 0.

```text
Test Suites: 1 passed, 1 total
Tests:       39 passed, 39 total
Snapshots:   0 total
Time:        6.555 s, estimated 10 s
Ran all test suites matching /src\/screens\/meal-schedule/i.
```

### Sonda R7 vía b: refetch en finally

Desde `mobile-pet-tracker/`: `bunx jest src/screens/meal-schedule -t '#147 R7:.*un resultado que no es ok' > /tmp/147-r7-finally.log 2>&1; echo "exit=$?"`. Exit 1.

```text
Test Suites: 1 failed, 1 total
Tests:       1 failed, 38 skipped, 39 total
Snapshots:   0 total
Time:        3.138 s, estimated 7 s
Ran all test suites matching /src\/screens\/meal-schedule/i with tests matching "#147 R7:.*un resultado que no es ok".
```

```text
  ● #147 R7: tras un éxito refetchea plan y mascota, sin estado optimista › un resultado que no es ok no refetchea

    expect(jest.fn()).toHaveBeenCalledTimes(expected)

    Expected number of calls: 1
    Received number of calls: 2

      817 |       expect(screen.getByTestId('meal-time-edit-0').props.accessibilityState).not.toEqual(expect.objectContaining({ disabled: true }));
      818 |     });
    > 819 |     expect(mockGetNutritionPlan).toHaveBeenCalledTimes(1);
          |                                  ^
      820 |     expect(mockGetPet).toHaveBeenCalledTimes(1);
      821 |     await waitFor(() => expect(screen.getByTestId('meal-time-edit-0').props.accessibilityState).not.toEqual(expect.objectContaining({ disabled: true })));
      822 |   });

      at Object.toHaveBeenCalledTimes (src/screens/meal-schedule/index.test.tsx:819:34)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

### R8 rojo

Desde `mobile-pet-tracker/`: `bunx jest src/screens/meal-schedule src/providers/__tests__/language-provider.test.tsx src/__tests__/ui-language.test.ts > /tmp/147-r8-red.log 2>&1; echo "exit=$?"`. Exit 1.

```text
Test Suites: 2 failed, 1 passed, 3 total
Tests:       14 failed, 76 passed, 90 total
Snapshots:   0 total
Time:        20.772 s
Ran all test suites matching /src\/screens\/meal-schedule|src\/providers\/__tests__\/language-provider.test.tsx|src\/__tests__\/ui-language.test.ts/i.
```

```text
  ● #65 R6: Food resuelve su copy por clave › resuelve las 41 ocurrencias normativas

    expect(received).toEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 1

      Object {
        "file": "src/screens/meal-schedule/index.tsx",
        "key": "common.somethingWentWrong",
    -   "uses": 6,
    +   "uses": 4,
      }

      58 |       (directCalls?.length ?? 0) + (keyedConstants?.length ?? 0);
      59 |
    > 60 |     expect({ file, key, uses: resolvedUses }).toEqual({
         |                                               ^
      61 |       file,
      62 |       key,
      63 |       uses: expected,

      at toEqual (src/__tests__/ui-language.test.ts:60:47)
      at Object.checkUses (src/__tests__/ui-language.test.ts:143:5)
```

```text
  ● #65 R18: los sitios resuelven por clave y no queda copy suelta › resuelve cada ocurrencia de la tabla contra la clave exacta

    expect(received).toEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 1

      Object {
        "file": "src/screens/meal-schedule/index.tsx",
        "key": "common.somethingWentWrong",
    -   "uses": 6,
    +   "uses": 4,
      }

      58 |       (directCalls?.length ?? 0) + (keyedConstants?.length ?? 0);
      59 |
    > 60 |     expect({ file, key, uses: resolvedUses }).toEqual({
         |                                               ^
      61 |       file,
      62 |       key,
      63 |       uses: expected,

      at toEqual (src/__tests__/ui-language.test.ts:60:47)
      at Object.checkUses (src/__tests__/ui-language.test.ts:475:5)
```

```text
  ● #147 R8: cada error del contrato tiene su mensaje › invalid muestra «La hora no es válida»

    Unable to find an element with testID: meal-time-error

    <RNCSafeAreaProvider>
      <RCTScrollView
        testID="screen-meal-schedule"
      >
        <View>
          <View>
            <View
              testID="meal-schedule-summary"
            >
              <View>
                <View>
                  <Text>
                    Objetivo diario
                  </Text>
                  <Text>
                    656
                     kcal
                  </Text>
                  <Text>
                    187 g / día
                  </Text>
                </View>
                <View>
                  <View
                    testID="meal-schedule-icon-fork-knife"
                  />
                  <Text>
                    2 comidas / día
                  </Text>
                </View>
              </View>
            </View>
            <View
              testID="meal-times-section"
            >
              <Text>
                Horarios y porciones
              </Text>
              <View
                testID="meal-time-row-0"
              >
                <View>
                  <View
                    testID="meal-schedule-icon-clock"
                  />
                </View>
                <Text>
                  07:30
                </Text>
                <Text>
                  94
                   g
                </Text>
                <View
                  accessibilityLabel="Editar horario de las 07:30"
                  accessibilityRole="button"
                  accessibilityState={
                    {
                      "disabled": false,
                    }
                  }
                  accessible={true}
                  testID="meal-time-edit-0"
                >
                  <View
                    pointerEvents="none"
                    style={
                      {
                        "opacity": 0,
                      }
                    }
                  />
                  <Text>
                    Editar
                  </Text>
                </View>
              </View>
              <View
                testID="meal-time-row-1"
              >
                <View>
                  <View
                    testID="meal-schedule-icon-clock"
                  />
                </View>
                <Text>
                  19:30
                </Text>
                <Text>
                  94
                   g
                </Text>
                <View
                  accessibilityLabel="Editar horario de las 19:30"
                  accessibilityRole="button"
                  accessibilityState={
                    {
                      "disabled": false,
                    }
                  }
                  accessible={true}
                  testID="meal-time-edit-1"
                >
                  <View
                    pointerEvents="none"
                    style={
                      {
                        "opacity": 0,
                      }
                    }
                  />
                  <Text>
                    Editar
                  </Text>
                </View>
              </View>
              <View
                accessibilityRole="button"
                accessibilityState={
                  {
                    "disabled": false,
                  }
                }
                accessible={true}
                testID="add-meal-time-button"
              >
                <View
                  pointerEvents="none"
                  style={
                    {
                      "opacity": 0,
                    }
                  }
                />
                <Text>
                  Añadir comida
                </Text>
              </View>
            </View>
            <View>
              <View
                accessibilityRole="button"
                accessibilityState={
                  {
                    "disabled": false,
                  }
                }
                accessible={true}
                testID="generate-plan-button"
              >
                <View
                  pointerEvents="none"
                  style={
                    {
                      "opacity": 0,
                    }
                  }
                />
                <Text>
                  Generar plan
                </Text>
              </View>
            </View>
            <View
              testID="nutrition-profile-section"
            >
              <Text
                testID="nutrition-profile-title"
              >
                Perfil nutricional
              </Text>
              <View>
                <Text>
                  dry
                </Text>
                <Text>
                  350
                   kcal / 100 g
                </Text>
                <Text>
                  medium
                </Text>
              </View>
              <Text
                testID="profile-allergies"
              >
                chicken, soy
              </Text>
              <Text
                testID="profile-diseases"
              >
                arthritis
              </Text>
            </View>
          </View>
        </View>
      </RCTScrollView>
    </RNCSafeAreaProvider>

      849 |     await fireEvent.press(await screen.findByTestId(flow === 'add' ? 'add-meal-time-button' : 'meal-time-edit-1'));
      850 |     await fireEvent(screen.getByTestId('meal-time-picker'), 'onValueChange', {}, flow === 'add' ? new Date(2026, 9, 2, 8, 5) : new Date(2026, 9, 2, 20, 5));
    > 851 |     await waitFor(() => expect(screen.getByTestId('meal-time-error').props.children).toBe(literal));
          |                  ^
      852 |     const error = screen.getByTestId('meal-time-error');
      853 |     expect(error.props.selectable).toBe(true);
      854 |     expect(error.props.className).toBe('text-danger');

      at src/screens/meal-schedule/index.test.tsx:851:18
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

```text
  ● #147 R8: cada error del contrato tiene su mensaje › forbidden muestra «Solo el dueño puede cambiar los horarios»

    Unable to find an element with testID: meal-time-error

    <RNCSafeAreaProvider>
      <RCTScrollView
        testID="screen-meal-schedule"
      >
        <View>
          <View>
            <View
              testID="meal-schedule-summary"
            >
              <View>
                <View>
                  <Text>
                    Objetivo diario
                  </Text>
                  <Text>
                    656
                     kcal
                  </Text>
                  <Text>
                    187 g / día
                  </Text>
                </View>
                <View>
                  <View
                    testID="meal-schedule-icon-fork-knife"
                  />
                  <Text>
                    2 comidas / día
                  </Text>
                </View>
              </View>
            </View>
            <View
              testID="meal-times-section"
            >
              <Text>
                Horarios y porciones
              </Text>
              <View
                testID="meal-time-row-0"
              >
                <View>
                  <View
                    testID="meal-schedule-icon-clock"
                  />
                </View>
                <Text>
                  07:30
                </Text>
                <Text>
                  94
                   g
                </Text>
                <View
                  accessibilityLabel="Editar horario de las 07:30"
                  accessibilityRole="button"
                  accessibilityState={
                    {
                      "disabled": false,
                    }
                  }
                  accessible={true}
                  testID="meal-time-edit-0"
                >
                  <View
                    pointerEvents="none"
                    style={
                      {
                        "opacity": 0,
                      }
                    }
                  />
                  <Text>
                    Editar
                  </Text>
                </View>
              </View>
              <View
                testID="meal-time-row-1"
              >
                <View>
                  <View
                    testID="meal-schedule-icon-clock"
                  />
                </View>
                <Text>
                  19:30
                </Text>
                <Text>
                  94
                   g
                </Text>
                <View
                  accessibilityLabel="Editar horario de las 19:30"
                  accessibilityRole="button"
                  accessibilityState={
                    {
                      "disabled": false,
                    }
                  }
                  accessible={true}
                  testID="meal-time-edit-1"
                >
                  <View
                    pointerEvents="none"
                    style={
                      {
                        "opacity": 0,
                      }
                    }
                  />
                  <Text>
                    Editar
                  </Text>
                </View>
              </View>
              <View
                accessibilityRole="button"
                accessibilityState={
                  {
                    "disabled": false,
                  }
                }
                accessible={true}
                testID="add-meal-time-button"
              >
                <View
                  pointerEvents="none"
                  style={
                    {
                      "opacity": 0,
                    }
                  }
                />
                <Text>
                  Añadir comida
                </Text>
              </View>
            </View>
            <View>
              <View
                accessibilityRole="button"
                accessibilityState={
                  {
                    "disabled": false,
                  }
                }
                accessible={true}
                testID="generate-plan-button"
              >
                <View
                  pointerEvents="none"
                  style={
                    {
                      "opacity": 0,
                    }
                  }
                />
                <Text>
                  Generar plan
                </Text>
              </View>
            </View>
            <View
              testID="nutrition-profile-section"
            >
              <Text
                testID="nutrition-profile-title"
              >
                Perfil nutricional
              </Text>
              <View>
                <Text>
                  dry
                </Text>
                <Text>
                  350
                   kcal / 100 g
                </Text>
                <Text>
                  medium
                </Text>
              </View>
              <Text
                testID="profile-allergies"
              >
                chicken, soy
              </Text>
              <Text
                testID="profile-diseases"
              >
                arthritis
              </Text>
            </View>
          </View>
        </View>
      </RCTScrollView>
    </RNCSafeAreaProvider>

      849 |     await fireEvent.press(await screen.findByTestId(flow === 'add' ? 'add-meal-time-button' : 'meal-time-edit-1'));
      850 |     await fireEvent(screen.getByTestId('meal-time-picker'), 'onValueChange', {}, flow === 'add' ? new Date(2026, 9, 2, 8, 5) : new Date(2026, 9, 2, 20, 5));
    > 851 |     await waitFor(() => expect(screen.getByTestId('meal-time-error').props.children).toBe(literal));
          |                  ^
      852 |     const error = screen.getByTestId('meal-time-error');
      853 |     expect(error.props.selectable).toBe(true);
      854 |     expect(error.props.className).toBe('text-danger');

      at src/screens/meal-schedule/index.test.tsx:851:18
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

```text
  ● #147 R8: cada error del contrato tiene su mensaje › NUTRITION_PLAN_REQUIRED muestra «Primero genera un plan de alimentación»

    Unable to find an element with testID: meal-time-error

    <RNCSafeAreaProvider>
      <RCTScrollView
        testID="screen-meal-schedule"
      >
        <View>
          <View>
            <View
              testID="meal-schedule-summary"
            >
              <View>
                <View>
                  <Text>
                    Objetivo diario
                  </Text>
                  <Text>
                    656
                     kcal
                  </Text>
                  <Text>
                    187 g / día
                  </Text>
                </View>
                <View>
                  <View
                    testID="meal-schedule-icon-fork-knife"
                  />
                  <Text>
                    2 comidas / día
                  </Text>
                </View>
              </View>
            </View>
            <View
              testID="meal-times-section"
            >
              <Text>
                Horarios y porciones
              </Text>
              <View
                testID="meal-time-row-0"
              >
                <View>
                  <View
                    testID="meal-schedule-icon-clock"
                  />
                </View>
                <Text>
                  07:30
                </Text>
                <Text>
                  94
                   g
                </Text>
                <View
                  accessibilityLabel="Editar horario de las 07:30"
                  accessibilityRole="button"
                  accessibilityState={
                    {
                      "disabled": false,
                    }
                  }
                  accessible={true}
                  testID="meal-time-edit-0"
                >
                  <View
                    pointerEvents="none"
                    style={
                      {
                        "opacity": 0,
                      }
                    }
                  />
                  <Text>
                    Editar
                  </Text>
                </View>
              </View>
              <View
                testID="meal-time-row-1"
              >
                <View>
                  <View
                    testID="meal-schedule-icon-clock"
                  />
                </View>
                <Text>
                  19:30
                </Text>
                <Text>
                  94
                   g
                </Text>
                <View
                  accessibilityLabel="Editar horario de las 19:30"
                  accessibilityRole="button"
                  accessibilityState={
                    {
                      "disabled": false,
                    }
                  }
                  accessible={true}
                  testID="meal-time-edit-1"
                >
                  <View
                    pointerEvents="none"
                    style={
                      {
                        "opacity": 0,
                      }
                    }
                  />
                  <Text>
                    Editar
                  </Text>
                </View>
              </View>
              <View
                accessibilityRole="button"
                accessibilityState={
                  {
                    "disabled": false,
                  }
                }
                accessible={true}
                testID="add-meal-time-button"
              >
                <View
                  pointerEvents="none"
                  style={
                    {
                      "opacity": 0,
                    }
                  }
                />
                <Text>
                  Añadir comida
                </Text>
              </View>
            </View>
            <View>
              <View
                accessibilityRole="button"
                accessibilityState={
                  {
                    "disabled": false,
                  }
                }
                accessible={true}
                testID="generate-plan-button"
              >
                <View
                  pointerEvents="none"
                  style={
                    {
                      "opacity": 0,
                    }
                  }
                />
                <Text>
                  Generar plan
                </Text>
              </View>
            </View>
            <View
              testID="nutrition-profile-section"
            >
              <Text
                testID="nutrition-profile-title"
              >
                Perfil nutricional
              </Text>
              <View>
                <Text>
                  dry
                </Text>
                <Text>
                  350
                   kcal / 100 g
                </Text>
                <Text>
                  medium
                </Text>
              </View>
              <Text
                testID="profile-allergies"
              >
                chicken, soy
              </Text>
              <Text
                testID="profile-diseases"
              >
                arthritis
              </Text>
            </View>
          </View>
        </View>
      </RCTScrollView>
    </RNCSafeAreaProvider>

      849 |     await fireEvent.press(await screen.findByTestId(flow === 'add' ? 'add-meal-time-button' : 'meal-time-edit-1'));
      850 |     await fireEvent(screen.getByTestId('meal-time-picker'), 'onValueChange', {}, flow === 'add' ? new Date(2026, 9, 2, 8, 5) : new Date(2026, 9, 2, 20, 5));
    > 851 |     await waitFor(() => expect(screen.getByTestId('meal-time-error').props.children).toBe(literal));
          |                  ^
      852 |     const error = screen.getByTestId('meal-time-error');
      853 |     expect(error.props.selectable).toBe(true);
      854 |     expect(error.props.className).toBe('text-danger');

      at src/screens/meal-schedule/index.test.tsx:851:18
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

```text
  ● #147 R8: cada error del contrato tiene su mensaje › MEAL_TIME_NOT_IN_PLAN muestra «Ese horario ya no está en el plan»

    Unable to find an element with testID: meal-time-error

    <RNCSafeAreaProvider>
      <RCTScrollView
        testID="screen-meal-schedule"
      >
        <View>
          <View>
            <View
              testID="meal-schedule-summary"
            >
              <View>
                <View>
                  <Text>
                    Objetivo diario
                  </Text>
                  <Text>
                    656
                     kcal
                  </Text>
                  <Text>
                    187 g / día
                  </Text>
                </View>
                <View>
                  <View
                    testID="meal-schedule-icon-fork-knife"
                  />
                  <Text>
                    2 comidas / día
                  </Text>
                </View>
              </View>
            </View>
            <View
              testID="meal-times-section"
            >
              <Text>
                Horarios y porciones
              </Text>
              <View
                testID="meal-time-row-0"
              >
                <View>
                  <View
                    testID="meal-schedule-icon-clock"
                  />
                </View>
                <Text>
                  07:30
                </Text>
                <Text>
                  94
                   g
                </Text>
                <View
                  accessibilityLabel="Editar horario de las 07:30"
                  accessibilityRole="button"
                  accessibilityState={
                    {
                      "disabled": false,
                    }
                  }
                  accessible={true}
                  testID="meal-time-edit-0"
                >
                  <View
                    pointerEvents="none"
                    style={
                      {
                        "opacity": 0,
                      }
                    }
                  />
                  <Text>
                    Editar
                  </Text>
                </View>
              </View>
              <View
                testID="meal-time-row-1"
              >
                <View>
                  <View
                    testID="meal-schedule-icon-clock"
                  />
                </View>
                <Text>
                  19:30
                </Text>
                <Text>
                  94
                   g
                </Text>
                <View
                  accessibilityLabel="Editar horario de las 19:30"
                  accessibilityRole="button"
                  accessibilityState={
                    {
                      "disabled": false,
                    }
                  }
                  accessible={true}
                  testID="meal-time-edit-1"
                >
                  <View
                    pointerEvents="none"
                    style={
                      {
                        "opacity": 0,
                      }
                    }
                  />
                  <Text>
                    Editar
                  </Text>
                </View>
              </View>
              <View
                accessibilityRole="button"
                accessibilityState={
                  {
                    "disabled": false,
                  }
                }
                accessible={true}
                testID="add-meal-time-button"
              >
                <View
                  pointerEvents="none"
                  style={
                    {
                      "opacity": 0,
                    }
                  }
                />
                <Text>
                  Añadir comida
                </Text>
              </View>
            </View>
            <View>
              <View
                accessibilityRole="button"
                accessibilityState={
                  {
                    "disabled": false,
                  }
                }
                accessible={true}
                testID="generate-plan-button"
              >
                <View
                  pointerEvents="none"
                  style={
                    {
                      "opacity": 0,
                    }
                  }
                />
                <Text>
                  Generar plan
                </Text>
              </View>
            </View>
            <View
              testID="nutrition-profile-section"
            >
              <Text
                testID="nutrition-profile-title"
              >
                Perfil nutricional
              </Text>
              <View>
                <Text>
                  dry
                </Text>
                <Text>
                  350
                   kcal / 100 g
                </Text>
                <Text>
                  medium
                </Text>
              </View>
              <Text
                testID="profile-allergies"
              >
                chicken, soy
              </Text>
              <Text
                testID="profile-diseases"
              >
                arthritis
              </Text>
            </View>
          </View>
        </View>
      </RCTScrollView>
    </RNCSafeAreaProvider>

      849 |     await fireEvent.press(await screen.findByTestId(flow === 'add' ? 'add-meal-time-button' : 'meal-time-edit-1'));
      850 |     await fireEvent(screen.getByTestId('meal-time-picker'), 'onValueChange', {}, flow === 'add' ? new Date(2026, 9, 2, 8, 5) : new Date(2026, 9, 2, 20, 5));
    > 851 |     await waitFor(() => expect(screen.getByTestId('meal-time-error').props.children).toBe(literal));
          |                  ^
      852 |     const error = screen.getByTestId('meal-time-error');
      853 |     expect(error.props.selectable).toBe(true);
      854 |     expect(error.props.className).toBe('text-danger');

      at src/screens/meal-schedule/index.test.tsx:851:18
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

```text
  ● #147 R8: cada error del contrato tiene su mensaje › MEAL_TIME_DUPLICATE muestra «Ya hay una comida a esa hora»

    Unable to find an element with testID: meal-time-error

    <RNCSafeAreaProvider>
      <RCTScrollView
        testID="screen-meal-schedule"
      >
        <View>
          <View>
            <View
              testID="meal-schedule-summary"
            >
              <View>
                <View>
                  <Text>
                    Objetivo diario
                  </Text>
                  <Text>
                    656
                     kcal
                  </Text>
                  <Text>
                    187 g / día
                  </Text>
                </View>
                <View>
                  <View
                    testID="meal-schedule-icon-fork-knife"
                  />
                  <Text>
                    2 comidas / día
                  </Text>
                </View>
              </View>
            </View>
            <View
              testID="meal-times-section"
            >
              <Text>
                Horarios y porciones
              </Text>
              <View
                testID="meal-time-row-0"
              >
                <View>
                  <View
                    testID="meal-schedule-icon-clock"
                  />
                </View>
                <Text>
                  07:30
                </Text>
                <Text>
                  94
                   g
                </Text>
                <View
                  accessibilityLabel="Editar horario de las 07:30"
                  accessibilityRole="button"
                  accessibilityState={
                    {
                      "disabled": false,
                    }
                  }
                  accessible={true}
                  testID="meal-time-edit-0"
                >
                  <View
                    pointerEvents="none"
                    style={
                      {
                        "opacity": 0,
                      }
                    }
                  />
                  <Text>
                    Editar
                  </Text>
                </View>
              </View>
              <View
                testID="meal-time-row-1"
              >
                <View>
                  <View
                    testID="meal-schedule-icon-clock"
                  />
                </View>
                <Text>
                  19:30
                </Text>
                <Text>
                  94
                   g
                </Text>
                <View
                  accessibilityLabel="Editar horario de las 19:30"
                  accessibilityRole="button"
                  accessibilityState={
                    {
                      "disabled": false,
                    }
                  }
                  accessible={true}
                  testID="meal-time-edit-1"
                >
                  <View
                    pointerEvents="none"
                    style={
                      {
                        "opacity": 0,
                      }
                    }
                  />
                  <Text>
                    Editar
                  </Text>
                </View>
              </View>
              <View
                accessibilityRole="button"
                accessibilityState={
                  {
                    "disabled": false,
                  }
                }
                accessible={true}
                testID="add-meal-time-button"
              >
                <View
                  pointerEvents="none"
                  style={
                    {
                      "opacity": 0,
                    }
                  }
                />
                <Text>
                  Añadir comida
                </Text>
              </View>
            </View>
            <View>
              <View
                accessibilityRole="button"
                accessibilityState={
                  {
                    "disabled": false,
                  }
                }
                accessible={true}
                testID="generate-plan-button"
              >
                <View
                  pointerEvents="none"
                  style={
                    {
                      "opacity": 0,
                    }
                  }
                />
                <Text>
                  Generar plan
                </Text>
              </View>
            </View>
            <View
              testID="nutrition-profile-section"
            >
              <Text
                testID="nutrition-profile-title"
              >
                Perfil nutricional
              </Text>
              <View>
                <Text>
                  dry
                </Text>
                <Text>
                  350
                   kcal / 100 g
                </Text>
                <Text>
                  medium
                </Text>
              </View>
              <Text
                testID="profile-allergies"
              >
                chicken, soy
              </Text>
              <Text
                testID="profile-diseases"
              >
                arthritis
              </Text>
            </View>
          </View>
        </View>
      </RCTScrollView>
    </RNCSafeAreaProvider>

      849 |     await fireEvent.press(await screen.findByTestId(flow === 'add' ? 'add-meal-time-button' : 'meal-time-edit-1'));
      850 |     await fireEvent(screen.getByTestId('meal-time-picker'), 'onValueChange', {}, flow === 'add' ? new Date(2026, 9, 2, 8, 5) : new Date(2026, 9, 2, 20, 5));
    > 851 |     await waitFor(() => expect(screen.getByTestId('meal-time-error').props.children).toBe(literal));
          |                  ^
      852 |     const error = screen.getByTestId('meal-time-error');
      853 |     expect(error.props.selectable).toBe(true);
      854 |     expect(error.props.className).toBe('text-danger');

      at src/screens/meal-schedule/index.test.tsx:851:18
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

```text
  ● #147 R8: cada error del contrato tiene su mensaje › MEAL_TIMES_LIMIT_REACHED muestra «El plan ya tiene el máximo de 6 comidas»

    Unable to find an element with testID: meal-time-error

    <RNCSafeAreaProvider>
      <RCTScrollView
        testID="screen-meal-schedule"
      >
        <View>
          <View>
            <View
              testID="meal-schedule-summary"
            >
              <View>
                <View>
                  <Text>
                    Objetivo diario
                  </Text>
                  <Text>
                    656
                     kcal
                  </Text>
                  <Text>
                    187 g / día
                  </Text>
                </View>
                <View>
                  <View
                    testID="meal-schedule-icon-fork-knife"
                  />
                  <Text>
                    2 comidas / día
                  </Text>
                </View>
              </View>
            </View>
            <View
              testID="meal-times-section"
            >
              <Text>
                Horarios y porciones
              </Text>
              <View
                testID="meal-time-row-0"
              >
                <View>
                  <View
                    testID="meal-schedule-icon-clock"
                  />
                </View>
                <Text>
                  07:30
                </Text>
                <Text>
                  94
                   g
                </Text>
                <View
                  accessibilityLabel="Editar horario de las 07:30"
                  accessibilityRole="button"
                  accessibilityState={
                    {
                      "disabled": false,
                    }
                  }
                  accessible={true}
                  testID="meal-time-edit-0"
                >
                  <View
                    pointerEvents="none"
                    style={
                      {
                        "opacity": 0,
                      }
                    }
                  />
                  <Text>
                    Editar
                  </Text>
                </View>
              </View>
              <View
                testID="meal-time-row-1"
              >
                <View>
                  <View
                    testID="meal-schedule-icon-clock"
                  />
                </View>
                <Text>
                  19:30
                </Text>
                <Text>
                  94
                   g
                </Text>
                <View
                  accessibilityLabel="Editar horario de las 19:30"
                  accessibilityRole="button"
                  accessibilityState={
                    {
                      "disabled": false,
                    }
                  }
                  accessible={true}
                  testID="meal-time-edit-1"
                >
                  <View
                    pointerEvents="none"
                    style={
                      {
                        "opacity": 0,
                      }
                    }
                  />
                  <Text>
                    Editar
                  </Text>
                </View>
              </View>
              <View
                accessibilityRole="button"
                accessibilityState={
                  {
                    "disabled": false,
                  }
                }
                accessible={true}
                testID="add-meal-time-button"
              >
                <View
                  pointerEvents="none"
                  style={
                    {
                      "opacity": 0,
                    }
                  }
                />
                <Text>
                  Añadir comida
                </Text>
              </View>
            </View>
            <View>
              <View
                accessibilityRole="button"
                accessibilityState={
                  {
                    "disabled": false,
                  }
                }
                accessible={true}
                testID="generate-plan-button"
              >
                <View
                  pointerEvents="none"
                  style={
                    {
                      "opacity": 0,
                    }
                  }
                />
                <Text>
                  Generar plan
                </Text>
              </View>
            </View>
            <View
              testID="nutrition-profile-section"
            >
              <Text
                testID="nutrition-profile-title"
              >
                Perfil nutricional
              </Text>
              <View>
                <Text>
                  dry
                </Text>
                <Text>
                  350
                   kcal / 100 g
                </Text>
                <Text>
                  medium
                </Text>
              </View>
              <Text
                testID="profile-allergies"
              >
                chicken, soy
              </Text>
              <Text
                testID="profile-diseases"
              >
                arthritis
              </Text>
            </View>
          </View>
        </View>
      </RCTScrollView>
    </RNCSafeAreaProvider>

      849 |     await fireEvent.press(await screen.findByTestId(flow === 'add' ? 'add-meal-time-button' : 'meal-time-edit-1'));
      850 |     await fireEvent(screen.getByTestId('meal-time-picker'), 'onValueChange', {}, flow === 'add' ? new Date(2026, 9, 2, 8, 5) : new Date(2026, 9, 2, 20, 5));
    > 851 |     await waitFor(() => expect(screen.getByTestId('meal-time-error').props.children).toBe(literal));
          |                  ^
      852 |     const error = screen.getByTestId('meal-time-error');
      853 |     expect(error.props.selectable).toBe(true);
      854 |     expect(error.props.className).toBe('text-danger');

      at src/screens/meal-schedule/index.test.tsx:851:18
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

```text
  ● #147 R8: cada error del contrato tiene su mensaje › unreachable muestra «No se pudo conectar con el servidor»

    Unable to find an element with testID: meal-time-error

    <RNCSafeAreaProvider>
      <RCTScrollView
        testID="screen-meal-schedule"
      >
        <View>
          <View>
            <View
              testID="meal-schedule-summary"
            >
              <View>
                <View>
                  <Text>
                    Objetivo diario
                  </Text>
                  <Text>
                    656
                     kcal
                  </Text>
                  <Text>
                    187 g / día
                  </Text>
                </View>
                <View>
                  <View
                    testID="meal-schedule-icon-fork-knife"
                  />
                  <Text>
                    2 comidas / día
                  </Text>
                </View>
              </View>
            </View>
            <View
              testID="meal-times-section"
            >
              <Text>
                Horarios y porciones
              </Text>
              <View
                testID="meal-time-row-0"
              >
                <View>
                  <View
                    testID="meal-schedule-icon-clock"
                  />
                </View>
                <Text>
                  07:30
                </Text>
                <Text>
                  94
                   g
                </Text>
                <View
                  accessibilityLabel="Editar horario de las 07:30"
                  accessibilityRole="button"
                  accessibilityState={
                    {
                      "disabled": false,
                    }
                  }
                  accessible={true}
                  testID="meal-time-edit-0"
                >
                  <View
                    pointerEvents="none"
                    style={
                      {
                        "opacity": 0,
                      }
                    }
                  />
                  <Text>
                    Editar
                  </Text>
                </View>
              </View>
              <View
                testID="meal-time-row-1"
              >
                <View>
                  <View
                    testID="meal-schedule-icon-clock"
                  />
                </View>
                <Text>
                  19:30
                </Text>
                <Text>
                  94
                   g
                </Text>
                <View
                  accessibilityLabel="Editar horario de las 19:30"
                  accessibilityRole="button"
                  accessibilityState={
                    {
                      "disabled": false,
                    }
                  }
                  accessible={true}
                  testID="meal-time-edit-1"
                >
                  <View
                    pointerEvents="none"
                    style={
                      {
                        "opacity": 0,
                      }
                    }
                  />
                  <Text>
                    Editar
                  </Text>
                </View>
              </View>
              <View
                accessibilityRole="button"
                accessibilityState={
                  {
                    "disabled": false,
                  }
                }
                accessible={true}
                testID="add-meal-time-button"
              >
                <View
                  pointerEvents="none"
                  style={
                    {
                      "opacity": 0,
                    }
                  }
                />
                <Text>
                  Añadir comida
                </Text>
              </View>
            </View>
            <View>
              <View
                accessibilityRole="button"
                accessibilityState={
                  {
                    "disabled": false,
                  }
                }
                accessible={true}
                testID="generate-plan-button"
              >
                <View
                  pointerEvents="none"
                  style={
                    {
                      "opacity": 0,
                    }
                  }
                />
                <Text>
                  Generar plan
                </Text>
              </View>
            </View>
            <View
              testID="nutrition-profile-section"
            >
              <Text
                testID="nutrition-profile-title"
              >
                Perfil nutricional
              </Text>
              <View>
                <Text>
                  dry
                </Text>
                <Text>
                  350
                   kcal / 100 g
                </Text>
                <Text>
                  medium
                </Text>
              </View>
              <Text
                testID="profile-allergies"
              >
                chicken, soy
              </Text>
              <Text
                testID="profile-diseases"
              >
                arthritis
              </Text>
            </View>
          </View>
        </View>
      </RCTScrollView>
    </RNCSafeAreaProvider>

      849 |     await fireEvent.press(await screen.findByTestId(flow === 'add' ? 'add-meal-time-button' : 'meal-time-edit-1'));
      850 |     await fireEvent(screen.getByTestId('meal-time-picker'), 'onValueChange', {}, flow === 'add' ? new Date(2026, 9, 2, 8, 5) : new Date(2026, 9, 2, 20, 5));
    > 851 |     await waitFor(() => expect(screen.getByTestId('meal-time-error').props.children).toBe(literal));
          |                  ^
      852 |     const error = screen.getByTestId('meal-time-error');
      853 |     expect(error.props.selectable).toBe(true);
      854 |     expect(error.props.className).toBe('text-danger');

      at src/screens/meal-schedule/index.test.tsx:851:18
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

```text
  ● #147 R8: cada error del contrato tiene su mensaje › error muestra «Algo salió mal»

    Unable to find an element with testID: meal-time-error

    <RNCSafeAreaProvider>
      <RCTScrollView
        testID="screen-meal-schedule"
      >
        <View>
          <View>
            <View
              testID="meal-schedule-summary"
            >
              <View>
                <View>
                  <Text>
                    Objetivo diario
                  </Text>
                  <Text>
                    656
                     kcal
                  </Text>
                  <Text>
                    187 g / día
                  </Text>
                </View>
                <View>
                  <View
                    testID="meal-schedule-icon-fork-knife"
                  />
                  <Text>
                    2 comidas / día
                  </Text>
                </View>
              </View>
            </View>
            <View
              testID="meal-times-section"
            >
              <Text>
                Horarios y porciones
              </Text>
              <View
                testID="meal-time-row-0"
              >
                <View>
                  <View
                    testID="meal-schedule-icon-clock"
                  />
                </View>
                <Text>
                  07:30
                </Text>
                <Text>
                  94
                   g
                </Text>
                <View
                  accessibilityLabel="Editar horario de las 07:30"
                  accessibilityRole="button"
                  accessibilityState={
                    {
                      "disabled": false,
                    }
                  }
                  accessible={true}
                  testID="meal-time-edit-0"
                >
                  <View
                    pointerEvents="none"
                    style={
                      {
                        "opacity": 0,
                      }
                    }
                  />
                  <Text>
                    Editar
                  </Text>
                </View>
              </View>
              <View
                testID="meal-time-row-1"
              >
                <View>
                  <View
                    testID="meal-schedule-icon-clock"
                  />
                </View>
                <Text>
                  19:30
                </Text>
                <Text>
                  94
                   g
                </Text>
                <View
                  accessibilityLabel="Editar horario de las 19:30"
                  accessibilityRole="button"
                  accessibilityState={
                    {
                      "disabled": false,
                    }
                  }
                  accessible={true}
                  testID="meal-time-edit-1"
                >
                  <View
                    pointerEvents="none"
                    style={
                      {
                        "opacity": 0,
                      }
                    }
                  />
                  <Text>
                    Editar
                  </Text>
                </View>
              </View>
              <View
                accessibilityRole="button"
                accessibilityState={
                  {
                    "disabled": false,
                  }
                }
                accessible={true}
                testID="add-meal-time-button"
              >
                <View
                  pointerEvents="none"
                  style={
                    {
                      "opacity": 0,
                    }
                  }
                />
                <Text>
                  Añadir comida
                </Text>
              </View>
            </View>
            <View>
              <View
                accessibilityRole="button"
                accessibilityState={
                  {
                    "disabled": false,
                  }
                }
                accessible={true}
                testID="generate-plan-button"
              >
                <View
                  pointerEvents="none"
                  style={
                    {
                      "opacity": 0,
                    }
                  }
                />
                <Text>
                  Generar plan
                </Text>
              </View>
            </View>
            <View
              testID="nutrition-profile-section"
            >
              <Text
                testID="nutrition-profile-title"
              >
                Perfil nutricional
              </Text>
              <View>
                <Text>
                  dry
                </Text>
                <Text>
                  350
                   kcal / 100 g
                </Text>
                <Text>
                  medium
                </Text>
              </View>
              <Text
                testID="profile-allergies"
              >
                chicken, soy
              </Text>
              <Text
                testID="profile-diseases"
              >
                arthritis
              </Text>
            </View>
          </View>
        </View>
      </RCTScrollView>
    </RNCSafeAreaProvider>

      849 |     await fireEvent.press(await screen.findByTestId(flow === 'add' ? 'add-meal-time-button' : 'meal-time-edit-1'));
      850 |     await fireEvent(screen.getByTestId('meal-time-picker'), 'onValueChange', {}, flow === 'add' ? new Date(2026, 9, 2, 8, 5) : new Date(2026, 9, 2, 20, 5));
    > 851 |     await waitFor(() => expect(screen.getByTestId('meal-time-error').props.children).toBe(literal));
          |                  ^
      852 |     const error = screen.getByTestId('meal-time-error');
      853 |     expect(error.props.selectable).toBe(true);
      854 |     expect(error.props.className).toBe('text-danger');

      at src/screens/meal-schedule/index.test.tsx:851:18
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

```text
  ● #147 R8: cada error del contrato tiene su mensaje › missing-config muestra «Algo salió mal»

    Unable to find an element with testID: meal-time-error

    <RNCSafeAreaProvider>
      <RCTScrollView
        testID="screen-meal-schedule"
      >
        <View>
          <View>
            <View
              testID="meal-schedule-summary"
            >
              <View>
                <View>
                  <Text>
                    Objetivo diario
                  </Text>
                  <Text>
                    656
                     kcal
                  </Text>
                  <Text>
                    187 g / día
                  </Text>
                </View>
                <View>
                  <View
                    testID="meal-schedule-icon-fork-knife"
                  />
                  <Text>
                    2 comidas / día
                  </Text>
                </View>
              </View>
            </View>
            <View
              testID="meal-times-section"
            >
              <Text>
                Horarios y porciones
              </Text>
              <View
                testID="meal-time-row-0"
              >
                <View>
                  <View
                    testID="meal-schedule-icon-clock"
                  />
                </View>
                <Text>
                  07:30
                </Text>
                <Text>
                  94
                   g
                </Text>
                <View
                  accessibilityLabel="Editar horario de las 07:30"
                  accessibilityRole="button"
                  accessibilityState={
                    {
                      "disabled": false,
                    }
                  }
                  accessible={true}
                  testID="meal-time-edit-0"
                >
                  <View
                    pointerEvents="none"
                    style={
                      {
                        "opacity": 0,
                      }
                    }
                  />
                  <Text>
                    Editar
                  </Text>
                </View>
              </View>
              <View
                testID="meal-time-row-1"
              >
                <View>
                  <View
                    testID="meal-schedule-icon-clock"
                  />
                </View>
                <Text>
                  19:30
                </Text>
                <Text>
                  94
                   g
                </Text>
                <View
                  accessibilityLabel="Editar horario de las 19:30"
                  accessibilityRole="button"
                  accessibilityState={
                    {
                      "disabled": false,
                    }
                  }
                  accessible={true}
                  testID="meal-time-edit-1"
                >
                  <View
                    pointerEvents="none"
                    style={
                      {
                        "opacity": 0,
                      }
                    }
                  />
                  <Text>
                    Editar
                  </Text>
                </View>
              </View>
              <View
                accessibilityRole="button"
                accessibilityState={
                  {
                    "disabled": false,
                  }
                }
                accessible={true}
                testID="add-meal-time-button"
              >
                <View
                  pointerEvents="none"
                  style={
                    {
                      "opacity": 0,
                    }
                  }
                />
                <Text>
                  Añadir comida
                </Text>
              </View>
            </View>
            <View>
              <View
                accessibilityRole="button"
                accessibilityState={
                  {
                    "disabled": false,
                  }
                }
                accessible={true}
                testID="generate-plan-button"
              >
                <View
                  pointerEvents="none"
                  style={
                    {
                      "opacity": 0,
                    }
                  }
                />
                <Text>
                  Generar plan
                </Text>
              </View>
            </View>
            <View
              testID="nutrition-profile-section"
            >
              <Text
                testID="nutrition-profile-title"
              >
                Perfil nutricional
              </Text>
              <View>
                <Text>
                  dry
                </Text>
                <Text>
                  350
                   kcal / 100 g
                </Text>
                <Text>
                  medium
                </Text>
              </View>
              <Text
                testID="profile-allergies"
              >
                chicken, soy
              </Text>
              <Text
                testID="profile-diseases"
              >
                arthritis
              </Text>
            </View>
          </View>
        </View>
      </RCTScrollView>
    </RNCSafeAreaProvider>

      849 |     await fireEvent.press(await screen.findByTestId(flow === 'add' ? 'add-meal-time-button' : 'meal-time-edit-1'));
      850 |     await fireEvent(screen.getByTestId('meal-time-picker'), 'onValueChange', {}, flow === 'add' ? new Date(2026, 9, 2, 8, 5) : new Date(2026, 9, 2, 20, 5));
    > 851 |     await waitFor(() => expect(screen.getByTestId('meal-time-error').props.children).toBe(literal));
          |                  ^
      852 |     const error = screen.getByTestId('meal-time-error');
      853 |     expect(error.props.selectable).toBe(true);
      854 |     expect(error.props.className).toBe('text-danger');

      at src/screens/meal-schedule/index.test.tsx:851:18
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

```text
  ● #147 R8: cada error del contrato tiene su mensaje › rechazo muestra «Algo salió mal»

    boom

      844 |   ])('$label muestra «$literal»', async ({ flow, result, rejects, literal }) => {
      845 |     const request = flow === 'add' ? mockAddMealTime : mockMoveMealTime;
    > 846 |     if (rejects) request.mockRejectedValue(new Error('boom'));
          |                                            ^
      847 |     else request.mockResolvedValue(result!);
      848 |     await renderMealSchedule();
      849 |     await fireEvent.press(await screen.findByTestId(flow === 'add' ? 'add-meal-time-button' : 'meal-time-edit-1'));

      at src/screens/meal-schedule/index.test.tsx:846:44
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
      at node_modules/@babel/runtime/helpers/asyncToGenerator.js:22:7
      at node_modules/@babel/runtime/helpers/asyncToGenerator.js:14:12
      at apply (src/screens/meal-schedule/index.test.tsx:857:4)
```

```text
  ● #147 R8: cada error del contrato tiene su mensaje › rechazo muestra «Algo salió mal»

    Unable to find an element with testID: meal-time-error

    <RNCSafeAreaProvider>
      <RCTScrollView
        testID="screen-meal-schedule"
      >
        <View>
          <View>
            <View
              testID="meal-schedule-summary"
            >
              <View>
                <View>
                  <Text>
                    Objetivo diario
                  </Text>
                  <Text>
                    656
                     kcal
                  </Text>
                  <Text>
                    187 g / día
                  </Text>
                </View>
                <View>
                  <View
                    testID="meal-schedule-icon-fork-knife"
                  />
                  <Text>
                    2 comidas / día
                  </Text>
                </View>
              </View>
            </View>
            <View
              testID="meal-times-section"
            >
              <Text>
                Horarios y porciones
              </Text>
              <View
                testID="meal-time-row-0"
              >
                <View>
                  <View
                    testID="meal-schedule-icon-clock"
                  />
                </View>
                <Text>
                  07:30
                </Text>
                <Text>
                  94
                   g
                </Text>
                <View
                  accessibilityLabel="Editar horario de las 07:30"
                  accessibilityRole="button"
                  accessibilityState={
                    {
                      "disabled": false,
                    }
                  }
                  accessible={true}
                  testID="meal-time-edit-0"
                >
                  <View
                    pointerEvents="none"
                    style={
                      {
                        "opacity": 0,
                      }
                    }
                  />
                  <Text>
                    Editar
                  </Text>
                </View>
              </View>
              <View
                testID="meal-time-row-1"
              >
                <View>
                  <View
                    testID="meal-schedule-icon-clock"
                  />
                </View>
                <Text>
                  19:30
                </Text>
                <Text>
                  94
                   g
                </Text>
                <View
                  accessibilityLabel="Editar horario de las 19:30"
                  accessibilityRole="button"
                  accessibilityState={
                    {
                      "disabled": false,
                    }
                  }
                  accessible={true}
                  testID="meal-time-edit-1"
                >
                  <View
                    pointerEvents="none"
                    style={
                      {
                        "opacity": 0,
                      }
                    }
                  />
                  <Text>
                    Editar
                  </Text>
                </View>
              </View>
              <View
                accessibilityRole="button"
                accessibilityState={
                  {
                    "disabled": false,
                  }
                }
                accessible={true}
                testID="add-meal-time-button"
              >
                <View
                  pointerEvents="none"
                  style={
                    {
                      "opacity": 0,
                    }
                  }
                />
                <Text>
                  Añadir comida
                </Text>
              </View>
            </View>
            <View>
              <View
                accessibilityRole="button"
                accessibilityState={
                  {
                    "disabled": false,
                  }
                }
                accessible={true}
                testID="generate-plan-button"
              >
                <View
                  pointerEvents="none"
                  style={
                    {
                      "opacity": 0,
                    }
                  }
                />
                <Text>
                  Generar plan
                </Text>
              </View>
            </View>
            <View
              testID="nutrition-profile-section"
            >
              <Text
                testID="nutrition-profile-title"
              >
                Perfil nutricional
              </Text>
              <View>
                <Text>
                  dry
                </Text>
                <Text>
                  350
                   kcal / 100 g
                </Text>
                <Text>
                  medium
                </Text>
              </View>
              <Text
                testID="profile-allergies"
              >
                chicken, soy
              </Text>
              <Text
                testID="profile-diseases"
              >
                arthritis
              </Text>
            </View>
          </View>
        </View>
      </RCTScrollView>
    </RNCSafeAreaProvider>

      849 |     await fireEvent.press(await screen.findByTestId(flow === 'add' ? 'add-meal-time-button' : 'meal-time-edit-1'));
      850 |     await fireEvent(screen.getByTestId('meal-time-picker'), 'onValueChange', {}, flow === 'add' ? new Date(2026, 9, 2, 8, 5) : new Date(2026, 9, 2, 20, 5));
    > 851 |     await waitFor(() => expect(screen.getByTestId('meal-time-error').props.children).toBe(literal));
          |                  ^
      852 |     const error = screen.getByTestId('meal-time-error');
      853 |     expect(error.props.selectable).toBe(true);
      854 |     expect(error.props.className).toBe('text-danger');

      at src/screens/meal-schedule/index.test.tsx:851:18
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

```text
  ● #147 R8: cada error del contrato tiene su mensaje › 401 cierra sesión sin mensaje

    expect(jest.fn()).toHaveBeenCalledTimes(expected)

    Expected number of calls: 1
    Received number of calls: 0

      864 |     await fireEvent.press(await screen.findByTestId('meal-time-edit-1'));
      865 |     await fireEvent(screen.getByTestId('meal-time-picker'), 'onValueChange', {}, new Date(2026, 9, 2, 20, 5));
    > 866 |     await waitFor(() => {
          |                  ^
      867 |       expect(signOut).toHaveBeenCalledTimes(1);
      868 |       expect(screen.getByTestId('meal-time-edit-0').props.accessibilityState).not.toEqual(expect.objectContaining({ disabled: true }));
      869 |     });

      at Object.<anonymous> (src/screens/meal-schedule/index.test.tsx:866:18)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

```text
  ● #147 R8: cada error del contrato tiene su mensaje › una nueva edición retira el error anterior

    Unable to find an element with testID: meal-time-error

    <RNCSafeAreaProvider>
      <RCTScrollView
        testID="screen-meal-schedule"
      >
        <View>
          <View>
            <View
              testID="meal-schedule-summary"
            >
              <View>
                <View>
                  <Text>
                    Objetivo diario
                  </Text>
                  <Text>
                    656
                     kcal
                  </Text>
                  <Text>
                    187 g / día
                  </Text>
                </View>
                <View>
                  <View
                    testID="meal-schedule-icon-fork-knife"
                  />
                  <Text>
                    2 comidas / día
                  </Text>
                </View>
              </View>
            </View>
            <View
              testID="meal-times-section"
            >
              <Text>
                Horarios y porciones
              </Text>
              <View
                testID="meal-time-row-0"
              >
                <View>
                  <View
                    testID="meal-schedule-icon-clock"
                  />
                </View>
                <Text>
                  07:30
                </Text>
                <Text>
                  94
                   g
                </Text>
                <View
                  accessibilityLabel="Editar horario de las 07:30"
                  accessibilityRole="button"
                  accessibilityState={
                    {
                      "disabled": false,
                    }
                  }
                  accessible={true}
                  testID="meal-time-edit-0"
                >
                  <View
                    pointerEvents="none"
                    style={
                      {
                        "opacity": 0,
                      }
                    }
                  />
                  <Text>
                    Editar
                  </Text>
                </View>
              </View>
              <View
                testID="meal-time-row-1"
              >
                <View>
                  <View
                    testID="meal-schedule-icon-clock"
                  />
                </View>
                <Text>
                  19:30
                </Text>
                <Text>
                  94
                   g
                </Text>
                <View
                  accessibilityLabel="Editar horario de las 19:30"
                  accessibilityRole="button"
                  accessibilityState={
                    {
                      "disabled": false,
                    }
                  }
                  accessible={true}
                  testID="meal-time-edit-1"
                >
                  <View
                    pointerEvents="none"
                    style={
                      {
                        "opacity": 0,
                      }
                    }
                  />
                  <Text>
                    Editar
                  </Text>
                </View>
              </View>
              <View
                accessibilityRole="button"
                accessibilityState={
                  {
                    "disabled": false,
                  }
                }
                accessible={true}
                testID="add-meal-time-button"
              >
                <View
                  pointerEvents="none"
                  style={
                    {
                      "opacity": 0,
                    }
                  }
                />
                <Text>
                  Añadir comida
                </Text>
              </View>
            </View>
            <View>
              <View
                accessibilityRole="button"
                accessibilityState={
                  {
                    "disabled": false,
                  }
                }
                accessible={true}
                testID="generate-plan-button"
              >
                <View
                  pointerEvents="none"
                  style={
                    {
                      "opacity": 0,
                    }
                  }
                />
                <Text>
                  Generar plan
                </Text>
              </View>
            </View>
            <View
              testID="nutrition-profile-section"
            >
              <Text
                testID="nutrition-profile-title"
              >
                Perfil nutricional
              </Text>
              <View>
                <Text>
                  dry
                </Text>
                <Text>
                  350
                   kcal / 100 g
                </Text>
                <Text>
                  medium
                </Text>
              </View>
              <Text
                testID="profile-allergies"
              >
                chicken, soy
              </Text>
              <Text
                testID="profile-diseases"
              >
                arthritis
              </Text>
            </View>
          </View>
        </View>
      </RCTScrollView>
    </RNCSafeAreaProvider>

      879 |     await fireEvent.press(await screen.findByTestId('add-meal-time-button'));
      880 |     await fireEvent(screen.getByTestId('meal-time-picker'), 'onValueChange', {}, new Date(2026, 9, 2, 8, 5));
    > 881 |     await waitFor(() => expect(screen.getByTestId('meal-time-error').props.children).toBe('Ya hay una comida a esa hora'));
          |                  ^
      882 |     await waitFor(() => expect(screen.getByTestId('meal-time-edit-0').props.accessibilityState).not.toEqual(expect.objectContaining({ disabled: true })));
      883 |     await fireEvent.press(screen.getByTestId('meal-time-edit-1'));
      884 |     await fireEvent(screen.getByTestId('meal-time-picker'), 'onValueChange', {}, new Date(2026, 9, 2, 20, 5));

      at Object.<anonymous> (src/screens/meal-schedule/index.test.tsx:881:18)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

Comprobación de literales antes del commit rojo R8:

```text
$ grep -nF -- '`That time is not valid`' specs/mobile-meal-schedule-editing/requirements.md
68:| `mealSchedule.errorInvalidTime` | `La hora no es válida` | `That time is not valid` | `400` (R8) |
$ grep -nF -- '`La hora no es válida`' specs/mobile-meal-schedule-editing/requirements.md
68:| `mealSchedule.errorInvalidTime` | `La hora no es válida` | `That time is not valid` | `400` (R8) |
$ grep -nF -- '`Only the owner can change meal times`' specs/mobile-meal-schedule-editing/requirements.md
69:| `mealSchedule.errorEditForbidden` | `Solo el dueño puede cambiar los horarios` | `Only the owner can change meal times` | `403` (R8) |
$ grep -nF -- '`Solo el dueño puede cambiar los horarios`' specs/mobile-meal-schedule-editing/requirements.md
69:| `mealSchedule.errorEditForbidden` | `Solo el dueño puede cambiar los horarios` | `Only the owner can change meal times` | `403` (R8) |
$ grep -nF -- '`Generate a meal plan first`' specs/mobile-meal-schedule-editing/requirements.md
70:| `mealSchedule.errorPlanRequired` | `Primero genera un plan de alimentación` | `Generate a meal plan first` | `422 NUTRITION_PLAN_REQUIRED` (R8) |
$ grep -nF -- '`Primero genera un plan de alimentación`' specs/mobile-meal-schedule-editing/requirements.md
70:| `mealSchedule.errorPlanRequired` | `Primero genera un plan de alimentación` | `Generate a meal plan first` | `422 NUTRITION_PLAN_REQUIRED` (R8) |
$ grep -nF -- '`That meal time is no longer in the plan`' specs/mobile-meal-schedule-editing/requirements.md
71:| `mealSchedule.errorTimeNotInPlan` | `Ese horario ya no está en el plan` | `That meal time is no longer in the plan` | `422 MEAL_TIME_NOT_IN_PLAN` (R8) |
$ grep -nF -- '`Ese horario ya no está en el plan`' specs/mobile-meal-schedule-editing/requirements.md
71:| `mealSchedule.errorTimeNotInPlan` | `Ese horario ya no está en el plan` | `That meal time is no longer in the plan` | `422 MEAL_TIME_NOT_IN_PLAN` (R8) |
$ grep -nF -- '`There is already a meal at that time`' specs/mobile-meal-schedule-editing/requirements.md
72:| `mealSchedule.errorDuplicateTime` | `Ya hay una comida a esa hora` | `There is already a meal at that time` | `422 MEAL_TIME_DUPLICATE` (R8) |
$ grep -nF -- '`Ya hay una comida a esa hora`' specs/mobile-meal-schedule-editing/requirements.md
72:| `mealSchedule.errorDuplicateTime` | `Ya hay una comida a esa hora` | `There is already a meal at that time` | `422 MEAL_TIME_DUPLICATE` (R8) |
$ grep -nF -- '`The plan already has the maximum of 6 meals`' specs/mobile-meal-schedule-editing/requirements.md
73:| `mealSchedule.errorMealLimit` | `El plan ya tiene el máximo de 6 comidas` | `The plan already has the maximum of 6 meals` | `422 MEAL_TIMES_LIMIT_REACHED` (R8) |
$ grep -nF -- '`El plan ya tiene el máximo de 6 comidas`' specs/mobile-meal-schedule-editing/requirements.md
73:| `mealSchedule.errorMealLimit` | `El plan ya tiene el máximo de 6 comidas` | `The plan already has the maximum of 6 meals` | `422 MEAL_TIMES_LIMIT_REACHED` (R8) |
$ grep -nF -- 'No se pudo conectar con el servidor' specs/mobile-meal-schedule-editing/requirements.md
77:- `common.cannotReachServer`: `No se pudo conectar con el servidor` / `Cannot reach server`
$ grep -nF -- 'Algo salió mal' specs/mobile-meal-schedule-editing/requirements.md
78:- `common.somethingWentWrong`: `Algo salió mal` / `Something went wrong`
```

### R8 verde

Desde `mobile-pet-tracker/`: `bunx jest src/screens/meal-schedule src/providers/__tests__/language-provider.test.tsx src/__tests__/ui-language.test.ts > /tmp/147-r8-green.log 2>&1; echo "exit=$?"`. Exit 0.

```text
Test Suites: 3 passed, 3 total
Tests:       90 passed, 90 total
Snapshots:   0 total
Time:        8.069 s, estimated 21 s
Ran all test suites matching /src\/screens\/meal-schedule|src\/providers\/__tests__\/language-provider.test.tsx|src\/__tests__\/ui-language.test.ts/i.
```

### R9 rojo

Desde `mobile-pet-tracker/`: `bunx jest src/providers/__tests__/language-provider.test.tsx src/__tests__/ui-language.test.ts > /tmp/147-r9-red.log 2>&1; echo "exit=$?"`. Exit 1.

```text
Test Suites: 1 failed, 1 passed, 2 total
Tests:       2 failed, 38 passed, 40 total
Snapshots:   0 total
Time:        2.855 s, estimated 3 s
Ran all test suites matching /src\/providers\/__tests__\/language-provider.test.tsx|src\/__tests__\/ui-language.test.ts/i.
```

```text
  ● #65 R6: Food resuelve su copy por clave › resuelve las 50 ocurrencias normativas

    expect(received).toHaveLength(expected)

    Expected length: 50
    Received length: 41
    Received array:  [{"file": "src/app/_layout.tsx", "key": "mealSchedule.mealSchedule"}, {"file": "src/app/(tabs)/food.tsx", "key": "food.food"}, {"file": "src/app/(tabs)/food.tsx", "key": "common.somethingWentWrong"}, {"file": "src/app/(tabs)/food.tsx", "key": "common.retry"}, {"file": "src/app/(tabs)/food.tsx", "key": "common.noPetsYet"}, {"file": "src/app/(tabs)/food.tsx", "key": "food.dailyTarget"}, {"file": "src/app/(tabs)/food.tsx", "key": "food.dailyKcal"}, {"file": "src/app/(tabs)/food.tsx", "key": "food.dailyGrams"}, {"file": "src/app/(tabs)/food.tsx", "key": "food.kcalConsumedOfTarget"}, {"file": "src/app/(tabs)/food.tsx", "key": "food.mealsToday"}, …]

      140 | describe('#65 R6: Food resuelve su copy por clave', () => {
      141 |   it('resuelve las 50 ocurrencias normativas', () => {
    > 142 |     expect(R6_FOOD).toHaveLength(35 + 3 + 1 - 2 + 1 + 3 + 9); // +1 #95 R4, -2 #95 R5, +1 #113 R3, +3 #147 R8, +9 #147 R9
          |                     ^
      143 |     checkUses(R6_FOOD);
      144 |   });
      145 | });

      at Object.toHaveLength (src/__tests__/ui-language.test.ts:142:21)
```

```text
  ● #147 R9: el copy del horario editable queda registrado › nombra las nueve ocurrencias nuevas y las resuelve en su fichero

    expect(received).toEqual(expected) // deep equality

    - Expected  - 11
    + Received  +  1

    - Array [
    -   "mealSchedule.addMeal",
    -   "mealSchedule.editTime",
    -   "mealSchedule.editTimeLabel",
    -   "mealSchedule.errorInvalidTime",
    -   "mealSchedule.errorEditForbidden",
    -   "mealSchedule.errorPlanRequired",
    -   "mealSchedule.errorTimeNotInPlan",
    -   "mealSchedule.errorDuplicateTime",
    -   "mealSchedule.errorMealLimit",
    - ]
    + Array []

      505 |     ];
      506 |     const rows = R6_FOOD.filter(({ key }) => keys.includes(key));
    > 507 |     expect(rows.map(({ key }) => key)).toEqual(keys);
          |                                        ^
      508 |     expect(rows.every(({ file }) => file === 'src/screens/meal-schedule/index.tsx')).toBe(true);
      509 |     checkUses(rows);
      510 |   });

      at Object.toEqual (src/__tests__/ui-language.test.ts:507:40)
```

Comprobación de literales antes del commit rojo R9:

```text
Sin literales de copy nuevos en este rojo; solo contrato, claves, horas o testID.
```

### R9 verde

Desde `mobile-pet-tracker/`: `bunx jest src/providers/__tests__/language-provider.test.tsx src/__tests__/ui-language.test.ts > /tmp/147-r9-green.log 2>&1; echo "exit=$?"`. Exit 0.

```text
Test Suites: 2 passed, 2 total
Tests:       40 passed, 40 total
Snapshots:   0 total
Time:        2.594 s, estimated 3 s
Ran all test suites matching /src\/providers\/__tests__\/language-provider.test.tsx|src\/__tests__\/ui-language.test.ts/i.
```

### Sonda R5 setUTCHours: mutación no detectada

Desde `mobile-pet-tracker/`: `bunx jest src/screens/meal-schedule -t '#147 R5:.*abre un único selector' > /tmp/147-r5-tz.log 2>&1; echo "exit=$?"`. Exit 0.

```text
Test Suites: 1 passed, 1 total
Tests:       50 skipped, 1 passed, 51 total
Snapshots:   0 total
Time:        2.962 s, estimated 8 s
Ran all test suites matching /src\/screens\/meal-schedule/i with tests matching "#147 R5:.*abre un único selector".
```

## Corrección autorizada de la preparación TZ

La sonda R5 `setUTCHours` quedó verde con la técnica original. Jest 29 construye una copia de `process.env` en `jest-runtime/node_modules/jest-util/build/createProcessObject.js`; su setter modifica el objeto copiado, no el entorno que consulta Date. La ruta `node:process` también devuelve esa copia (`jest-runtime/build/index.js`, `_requireCoreModule`), así que no sirve cambiar el import.

El humano autorizó «la corrección de la preparación TZ» mediante la pregunta asíncrona de esta sesión. Se usa `process.getBuiltinModule('process').env` (disponible en Node v20.20.2 y en los tipos instalados) solo en los dos tests de apertura. Se conservan sus aserciones, try/finally y la eliminación de TZ cuando el valor previo es undefined. No se cambia producción ni el número de tests. Va en un commit de refactor propio después del verde.

### Sonda TZ corregida: setUTCHours detectado en R5 y R6

Desde `mobile-pet-tracker/`: `bunx jest src/screens/meal-schedule -t '#147 R5:.*abre un único selector|#147 R6:.*abre el selector a las' > /tmp/147-tz-fixed-probe.log 2>&1; echo "exit=$?"`. Exit 1.

```text
Test Suites: 1 failed, 1 total
Tests:       2 failed, 47 skipped, 2 passed, 51 total
Snapshots:   0 total
Time:        3.505 s
Ran all test suites matching /src\/screens\/meal-schedule/i with tests matching "#147 R5:.*abre un único selector|#147 R6:.*abre el selector a las".
```

```text
  ● #147 R5: Editar abre el selector en la hora de la fila y publica el PATCH › abre un único selector de hora con la hora local de la fila

    expect(received).toEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 1

      Array [
    -   19,
    +   13,
        30,
      ]

      639 |       expect(picker.props.mode).toBe('time');
      640 |       expect(picker.props.presentation).toBe('dialog');
    > 641 |       expect([picker.props.value.getHours(), picker.props.value.getMinutes()]).toEqual([19, 30]);
          |                                                                                ^
      642 |       await fireEvent(picker, 'onDismiss');
      643 |       await waitFor(() => expect(screen.getByTestId('meal-time-edit-0').props.accessibilityState).not.toEqual(expect.objectContaining({ disabled: true })));
      644 |     } finally {

      at Object.toEqual (src/screens/meal-schedule/index.test.tsx:641:80)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

```text
  ● #147 R6: Añadir comida abre el selector a las 12:00 y publica el POST › abre el selector a las 12:00 locales

    expect(received).toEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 1

      Array [
    -   12,
    +   6,
        0,
      ]

      709 |       expect(screen.queryByTestId('meal-time-picker')).not.toBeNull();
      710 |       const picker = screen.getByTestId('meal-time-picker');
    > 711 |       expect([picker.props.value.getHours(), picker.props.value.getMinutes()]).toEqual([12, 0]);
          |                                                                                ^
      712 |       expect(picker.props.mode).toBe('time');
      713 |       expect(picker.props.presentation).toBe('dialog');
      714 |       await fireEvent(picker, 'onDismiss');

      at Object.toEqual (src/screens/meal-schedule/index.test.tsx:711:80)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

### Preparación TZ corregida: verde

Desde `mobile-pet-tracker/`: `bunx jest src/screens/meal-schedule > /tmp/147-tz-fixed-green.log 2>&1; echo "exit=$?"`. Exit 0.

```text
Test Suites: 1 passed, 1 total
Tests:       51 passed, 51 total
Snapshots:   0 total
Time:        6.691 s
Ran all test suites matching /src\/screens\/meal-schedule/i.
```

#### Sonda R1 — literal es errorMealLimit

`bunx jest src/providers/__tests__/language-provider.test.tsx src/__tests__/ui-language.test.ts -t '#147 R1:' > /tmp/147-probe-0.log 2>&1; echo "exit=$?"`: exit 1.

```text
Test Suites: 1 failed, 1 skipped, 1 of 2 total
Tests:       1 failed, 39 skipped, 40 total
● #147 R1: el catálogo trae las nueve claves del horario editable › registra las nueve claves en los dos idiomas y en la tabla de la spec de idioma
```

Restauración: `git checkout HEAD -- mobile-pet-tracker/src/i18n/catalog.ts`; `git diff --cached --stat`: salida vacía.

#### Sonda R1 — marcador time por hour solo es

`bunx jest src/providers/__tests__/language-provider.test.tsx src/__tests__/ui-language.test.ts -t '#147 R1:|#65 R12:' > /tmp/147-probe-1.log 2>&1; echo "exit=$?"`: exit 1.

```text
Test Suites: 1 failed, 1 skipped, 1 of 2 total
Tests:       2 failed, 35 skipped, 3 passed, 40 total
● #65 R12: el catálogo tiene los dos idiomas y t resuelve claves y parámetros › mantiene la base más las claves de #68 y los mismos marcadores en ambos idiomas
● #147 R1: el catálogo trae las nueve claves del horario editable › registra las nueve claves en los dos idiomas y en la tabla de la spec de idioma
```

Restauración: `git checkout HEAD -- mobile-pet-tracker/src/i18n/catalog.ts`; `git diff --cached --stat`: salida vacía.

#### Sonda R1 — sin marca en design

`bunx jest src/providers/__tests__/language-provider.test.tsx src/__tests__/ui-language.test.ts -t '#147 R1:' > /tmp/147-probe-2.log 2>&1; echo "exit=$?"`: exit 1.

```text
Test Suites: 1 failed, 1 skipped, 1 of 2 total
Tests:       1 failed, 39 skipped, 40 total
● #147 R1: el catálogo trae las nueve claves del horario editable › registra las nueve claves en los dos idiomas y en la tabla de la spec de idioma
```

Restauración: `git checkout HEAD -- specs/mobile-ui-language/design.md`; `git diff --cached --stat`: salida vacía.

#### Sonda R1 — sin clave en en

`bunx jest src/providers/__tests__/language-provider.test.tsx src/__tests__/ui-language.test.ts -t '#147 R1:|#65 R12:' > /tmp/147-probe-3.log 2>&1; echo "exit=$?"`: exit 1.

```text
Test Suites: 1 failed, 1 skipped, 1 of 2 total
Tests:       2 failed, 35 skipped, 3 passed, 40 total
● #65 R12: el catálogo tiene los dos idiomas y t resuelve claves y parámetros › mantiene la base más las claves de #68 y los mismos marcadores en ambos idiomas
● #147 R1: el catálogo trae las nueve claves del horario editable › registra las nueve claves en los dos idiomas y en la tabla de la spec de idioma
```

Restauración: `git checkout HEAD -- mobile-pet-tracker/src/i18n/catalog.ts`; `git diff --cached --stat`: salida vacía.

#### Sonda R2 — metodo PUT

`bunx jest src/api/__tests__/nutrition.test.ts -t '#147 R2:' > /tmp/147-probe-4.log 2>&1; echo "exit=$?"`: exit 1.

```text
Test Suites: 1 failed, 1 total
Tests:       1 failed, 43 skipped, 14 passed, 58 total
● #147 R2: addMealTime publica la franja y mapea por kind › publica POST /meal-times con el token y el body exacto, y 201 es ok
```

Restauración: `git checkout HEAD -- mobile-pet-tracker/src/api/nutrition.ts`; `git diff --cached --stat`: salida vacía.

#### Sonda R2 — ruta singular

`bunx jest src/api/__tests__/nutrition.test.ts -t '#147 R2:' > /tmp/147-probe-5.log 2>&1; echo "exit=$?"`: exit 1.

```text
Test Suites: 1 failed, 1 total
Tests:       1 failed, 43 skipped, 14 passed, 58 total
● #147 R2: addMealTime publica la franja y mapea por kind › publica POST /meal-times con el token y el body exacto, y 201 es ok
```

Restauración: `git checkout HEAD -- mobile-pet-tracker/src/api/nutrition.ts`; `git diff --cached --stat`: salida vacía.

#### Sonda R2 — body time

`bunx jest src/api/__tests__/nutrition.test.ts -t '#147 R2:' > /tmp/147-probe-6.log 2>&1; echo "exit=$?"`: exit 1.

```text
Test Suites: 1 failed, 1 total
Tests:       1 failed, 43 skipped, 14 passed, 58 total
● #147 R2: addMealTime publica la franja y mapea por kind › publica POST /meal-times con el token y el body exacto, y 201 es ok
```

Restauración: `git checkout HEAD -- mobile-pet-tracker/src/api/nutrition.ts`; `git diff --cached --stat`: salida vacía.

#### Sonda R2 — sin Authorization

`bunx jest src/api/__tests__/nutrition.test.ts -t '#147 R2:' > /tmp/147-probe-7.log 2>&1; echo "exit=$?"`: exit 1.

```text
Test Suites: 1 failed, 1 total
Tests:       1 failed, 43 skipped, 14 passed, 58 total
● #147 R2: addMealTime publica la franja y mapea por kind › publica POST /meal-times con el token y el body exacto, y 201 es ok
```

Restauración: `git checkout HEAD -- mobile-pet-tracker/src/api/nutrition.ts`; `git diff --cached --stat`: salida vacía.

#### Sonda R2 — okStatus 200

`bunx jest src/api/__tests__/nutrition.test.ts -t '#147 R2:' > /tmp/147-probe-8.log 2>&1; echo "exit=$?"`: exit 1.

```text
Test Suites: 1 failed, 1 total
Tests:       2 failed, 43 skipped, 13 passed, 58 total
● #147 R2: addMealTime publica la franja y mapea por kind › publica POST /meal-times con el token y el body exacto, y 201 es ok
● #147 R2: addMealTime publica la franja y mapea por kind › mapea 200 a error
```

Restauración: `git checkout HEAD -- mobile-pet-tracker/src/api/nutrition.ts`; `git diff --cached --stat`: salida vacía.

#### Sonda R2 — 400 a error

`bunx jest src/api/__tests__/nutrition.test.ts -t '#147 R2:' > /tmp/147-probe-9.log 2>&1; echo "exit=$?"`: exit 1.

```text
Test Suites: 1 failed, 1 total
Tests:       1 failed, 43 skipped, 14 passed, 58 total
● #147 R2: addMealTime publica la franja y mapea por kind › mapea 400 a invalid
```

Restauración: `git checkout HEAD -- mobile-pet-tracker/src/api/nutrition.ts`; `git diff --cached --stat`: salida vacía.

#### Sonda R2 — 403 a error

`bunx jest src/api/__tests__/nutrition.test.ts -t '#147 R2:' > /tmp/147-probe-10.log 2>&1; echo "exit=$?"`: exit 1.

```text
Test Suites: 1 failed, 1 total
Tests:       1 failed, 43 skipped, 14 passed, 58 total
● #147 R2: addMealTime publica la franja y mapea por kind › mapea 403 a forbidden
```

Restauración: `git checkout HEAD -- mobile-pet-tracker/src/api/nutrition.ts`; `git diff --cached --stat`: salida vacía.

#### Sonda R2 — sin codigo NUTRITION_PLAN_REQUIRED

`bunx jest src/api/__tests__/nutrition.test.ts -t '#147 R2:' > /tmp/147-probe-11.log 2>&1; echo "exit=$?"`: exit 1.

```text
Test Suites: 1 failed, 1 total
Tests:       1 failed, 43 skipped, 14 passed, 58 total
● #147 R2: addMealTime publica la franja y mapea por kind › mapea 422 NUTRITION_PLAN_REQUIRED a unprocessable
```

Restauración: `git checkout HEAD -- mobile-pet-tracker/src/api/nutrition.ts`; `git diff --cached --stat`: salida vacía.

#### Sonda R2 — sin codigo MEAL_TIME_NOT_IN_PLAN

`bunx jest src/api/__tests__/nutrition.test.ts -t '#147 R2:' > /tmp/147-probe-12.log 2>&1; echo "exit=$?"`: exit 1.

```text
Test Suites: 1 failed, 1 total
Tests:       1 failed, 43 skipped, 14 passed, 58 total
● #147 R2: addMealTime publica la franja y mapea por kind › mapea 422 MEAL_TIME_NOT_IN_PLAN a unprocessable
```

Restauración: `git checkout HEAD -- mobile-pet-tracker/src/api/nutrition.ts`; `git diff --cached --stat`: salida vacía.

#### Sonda R2 — sin codigo MEAL_TIME_DUPLICATE

`bunx jest src/api/__tests__/nutrition.test.ts -t '#147 R2:' > /tmp/147-probe-13.log 2>&1; echo "exit=$?"`: exit 1.

```text
Test Suites: 1 failed, 1 total
Tests:       1 failed, 43 skipped, 14 passed, 58 total
● #147 R2: addMealTime publica la franja y mapea por kind › mapea 422 MEAL_TIME_DUPLICATE a unprocessable
```

Restauración: `git checkout HEAD -- mobile-pet-tracker/src/api/nutrition.ts`; `git diff --cached --stat`: salida vacía.

#### Sonda R2 — sin codigo MEAL_TIMES_LIMIT_REACHED

`bunx jest src/api/__tests__/nutrition.test.ts -t '#147 R2:' > /tmp/147-probe-14.log 2>&1; echo "exit=$?"`: exit 1.

```text
Test Suites: 1 failed, 1 total
Tests:       1 failed, 43 skipped, 14 passed, 58 total
● #147 R2: addMealTime publica la franja y mapea por kind › mapea 422 MEAL_TIMES_LIMIT_REACHED a unprocessable
```

Restauración: `git checkout HEAD -- mobile-pet-tracker/src/api/nutrition.ts`; `git diff --cached --stat`: salida vacía.

#### Sonda R2 — cualquier code aceptado

`bunx jest src/api/__tests__/nutrition.test.ts -t '#147 R2:' > /tmp/147-probe-15.log 2>&1; echo "exit=$?"`: exit 1.

```text
Test Suites: 1 failed, 1 total
Tests:       2 failed, 43 skipped, 13 passed, 58 total
● #147 R2: addMealTime publica la franja y mapea por kind › mapea 422 SOMETHING_ELSE a error
● #147 R2: addMealTime publica la franja y mapea por kind › mapea 422 JSON inválido a error
```

Restauración: `git checkout HEAD -- mobile-pet-tracker/src/api/nutrition.ts`; `git diff --cached --stat`: salida vacía.

#### Sonda R2 — body.error en vez de body.code

`bunx jest src/api/__tests__/nutrition.test.ts -t '#147 R2:' > /tmp/147-probe-16.log 2>&1; echo "exit=$?"`: exit 1.

```text
Test Suites: 1 failed, 1 total
Tests:       4 failed, 43 skipped, 11 passed, 58 total
● #147 R2: addMealTime publica la franja y mapea por kind › mapea 422 NUTRITION_PLAN_REQUIRED a unprocessable
● #147 R2: addMealTime publica la franja y mapea por kind › mapea 422 MEAL_TIME_NOT_IN_PLAN a unprocessable
● #147 R2: addMealTime publica la franja y mapea por kind › mapea 422 MEAL_TIME_DUPLICATE a unprocessable
● #147 R2: addMealTime publica la franja y mapea por kind › mapea 422 MEAL_TIMES_LIMIT_REACHED a unprocessable
```

Restauración: `git checkout HEAD -- mobile-pet-tracker/src/api/nutrition.ts`; `git diff --cached --stat`: salida vacía.

#### Sonda R2 — 401 a error

`bunx jest src/api/__tests__/nutrition.test.ts -t '#147 R2:' > /tmp/147-probe-17.log 2>&1; echo "exit=$?"`: exit 1.

```text
Test Suites: 1 failed, 1 total
Tests:       1 failed, 43 skipped, 14 passed, 58 total
● #147 R2: addMealTime publica la franja y mapea por kind › mapea 401 a unauthorized
```

Restauración: `git checkout HEAD -- mobile-pet-tracker/src/api/nutrition.ts`; `git diff --cached --stat`: salida vacía.

#### Sonda R2 — rechazo a error

`bunx jest src/api/__tests__/nutrition.test.ts -t '#147 R2:' > /tmp/147-probe-18.log 2>&1; echo "exit=$?"`: exit 1.

```text
Test Suites: 1 failed, 1 total
Tests:       1 failed, 43 skipped, 14 passed, 58 total
● #147 R2: addMealTime publica la franja y mapea por kind › devuelve unreachable con el mensaje si fetch rechaza
```

Restauración: `git checkout HEAD -- mobile-pet-tracker/src/api/nutrition.ts`; `git diff --cached --stat`: salida vacía.

#### Sonda R3 — postJson en lugar de patchJson

`bunx jest src/api/__tests__/nutrition.test.ts -t '#147 R3:' > /tmp/147-probe-19.log 2>&1; echo "exit=$?"`: exit 1.

```text
Test Suites: 1 failed, 1 total
Tests:       1 failed, 55 skipped, 2 passed, 58 total
● #147 R3: moveMealTime publica el PATCH y mapea por kind › publica PATCH /meal-times/:from con body { mealTime: to }, y 200 es ok
```

Restauración: `git checkout HEAD -- mobile-pet-tracker/src/api/nutrition.ts`; `git diff --cached --stat`: salida vacía.

#### Sonda R3 — from y to intercambiados

`bunx jest src/api/__tests__/nutrition.test.ts -t '#147 R3:' > /tmp/147-probe-20.log 2>&1; echo "exit=$?"`: exit 1.

```text
Test Suites: 1 failed, 1 total
Tests:       1 failed, 55 skipped, 2 passed, 58 total
● #147 R3: moveMealTime publica el PATCH y mapea por kind › publica PATCH /meal-times/:from con body { mealTime: to }, y 200 es ok
```

Restauración: `git checkout HEAD -- mobile-pet-tracker/src/api/nutrition.ts`; `git diff --cached --stat`: salida vacía.

#### Sonda R3 — from codificado

`bunx jest src/api/__tests__/nutrition.test.ts -t '#147 R3:' > /tmp/147-probe-21.log 2>&1; echo "exit=$?"`: exit 1.

```text
Test Suites: 1 failed, 1 total
Tests:       1 failed, 55 skipped, 2 passed, 58 total
● #147 R3: moveMealTime publica el PATCH y mapea por kind › publica PATCH /meal-times/:from con body { mealTime: to }, y 200 es ok
```

Restauración: `git checkout HEAD -- mobile-pet-tracker/src/api/nutrition.ts`; `git diff --cached --stat`: salida vacía.

#### Sonda R3 — okStatus 201

`bunx jest src/api/__tests__/nutrition.test.ts -t '#147 R3:' > /tmp/147-probe-22.log 2>&1; echo "exit=$?"`: exit 1.

```text
Test Suites: 1 failed, 1 total
Tests:       2 failed, 55 skipped, 1 passed, 58 total
● #147 R3: moveMealTime publica el PATCH y mapea por kind › publica PATCH /meal-times/:from con body { mealTime: to }, y 200 es ok
● #147 R3: moveMealTime publica el PATCH y mapea por kind › trata un 201 como error
```

Restauración: `git checkout HEAD -- mobile-pet-tracker/src/api/nutrition.ts`; `git diff --cached --stat`: salida vacía.

#### Sonda R3 — mapeo propio 403 error

`bunx jest src/api/__tests__/nutrition.test.ts -t '#147 R3:' > /tmp/147-probe-23.log 2>&1; echo "exit=$?"`: exit 1.

```text
Test Suites: 1 failed, 1 total
Tests:       1 failed, 55 skipped, 2 passed, 58 total
● #147 R3: moveMealTime publica el PATCH y mapea por kind › comparte el mapeo de errores de addMealTime
```

Restauración: `git checkout HEAD -- mobile-pet-tracker/src/api/nutrition.ts`; `git diff --cached --stat`: salida vacía.

#### Sonda R4 — isOwner true

`bunx jest src/screens/meal-schedule -t '#147 R4:' > /tmp/147-probe-24.log 2>&1; echo "exit=$?"`: exit 1.

```text
Test Suites: 1 failed, 1 total
Tests:       5 failed, 45 skipped, 1 passed, 51 total
● #147 R4: solo el owner ve Editar y Añadir comida › family no ve controles de edición
● #147 R4: solo el owner ve Editar y Añadir comida › walker no ve controles de edición
● #147 R4: solo el owner ve Editar y Añadir comida › vet no ve controles de edición
● #147 R4: solo el owner ve Editar y Añadir comida › sin el detalle de la mascota resuelto no hay controles
● #147 R4: solo el owner ve Editar y Añadir comida › con el detalle de la mascota en error no hay controles
```

Restauración: `git checkout HEAD -- mobile-pet-tracker/src/screens/meal-schedule/index.tsx`; `git diff --cached --stat`: salida vacía.

#### Sonda R4 — rol ignorado

`bunx jest src/screens/meal-schedule -t '#147 R4:' > /tmp/147-probe-25.log 2>&1; echo "exit=$?"`: exit 1.

```text
Test Suites: 1 failed, 1 total
Tests:       3 failed, 45 skipped, 3 passed, 51 total
● #147 R4: solo el owner ve Editar y Añadir comida › family no ve controles de edición
● #147 R4: solo el owner ve Editar y Añadir comida › walker no ve controles de edición
● #147 R4: solo el owner ve Editar y Añadir comida › vet no ve controles de edición
```

Restauración: `git checkout HEAD -- mobile-pet-tracker/src/screens/meal-schedule/index.tsx`; `git diff --cached --stat`: salida vacía.

#### Sonda R4 — getPet token vacio

`bunx jest src/screens/meal-schedule -t '#147 R4:' > /tmp/147-probe-26.log 2>&1; echo "exit=$?"`: exit 1.

```text
Test Suites: 1 failed, 1 total
Tests:       1 failed, 45 skipped, 5 passed, 51 total
● #147 R4: solo el owner ve Editar y Añadir comida › el owner ve Editar en cada fila y Añadir comida bajo la lista
```

Restauración: `git checkout HEAD -- mobile-pet-tracker/src/screens/meal-schedule/index.tsx`; `git diff --cached --stat`: salida vacía.

#### Sonda R4 — label con hora fila 0

`bunx jest src/screens/meal-schedule -t '#147 R4:' > /tmp/147-probe-27.log 2>&1; echo "exit=$?"`: exit 1.

```text
Test Suites: 1 failed, 1 total
Tests:       1 failed, 45 skipped, 5 passed, 51 total
● #147 R4: solo el owner ve Editar y Añadir comida › el owner ve Editar en cada fila y Añadir comida bajo la lista
```

Restauración: `git checkout HEAD -- mobile-pet-tracker/src/screens/meal-schedule/index.tsx`; `git diff --cached --stat`: salida vacía.

#### Sonda R4 — editar antes de la hora

`bunx jest src/screens/meal-schedule -t '#147 R4:' > /tmp/147-probe-28.log 2>&1; echo "exit=$?"`: exit 1.

```text
Test Suites: 1 failed, 1 total
Tests:       1 failed, 45 skipped, 5 passed, 51 total
● #147 R4: solo el owner ve Editar y Añadir comida › el owner ve Editar en cada fila y Añadir comida bajo la lista
```

Restauración: `git checkout HEAD -- mobile-pet-tracker/src/screens/meal-schedule/index.tsx`; `git diff --cached --stat`: salida vacía.

#### Sonda R4 — anadir dentro ultima Card

`bunx jest src/screens/meal-schedule -t '#147 R4:' > /tmp/147-probe-29.log 2>&1; echo "exit=$?"`: exit 1.

```text
Test Suites: 1 failed, 1 total
Tests:       1 failed, 45 skipped, 5 passed, 51 total
● #147 R4: solo el owner ve Editar y Añadir comida › el owner ve Editar en cada fila y Añadir comida bajo la lista
```

Restauración: `git checkout HEAD -- mobile-pet-tracker/src/screens/meal-schedule/index.tsx`; `git diff --cached --stat`: salida vacía.

#### Sonda R4 — edit raiz sin min-h-11

`bunx jest src/screens/meal-schedule -t '#147 R4:' > /tmp/147-probe-30.log 2>&1; echo "exit=$?"`: exit 1.

```text
Test Suites: 1 failed, 1 total
Tests:       1 failed, 45 skipped, 5 passed, 51 total
● #147 R4: solo el owner ve Editar y Añadir comida › el owner ve Editar en cada fila y Añadir comida bajo la lista
```

Restauración: `git checkout HEAD -- mobile-pet-tracker/src/screens/meal-schedule/index.tsx`; `git diff --cached --stat`: salida vacía.

#### Sonda R4 — edit raiz sin rounded-xl

`bunx jest src/screens/meal-schedule -t '#147 R4:' > /tmp/147-probe-31.log 2>&1; echo "exit=$?"`: exit 1.

```text
Test Suites: 1 failed, 1 total
Tests:       1 failed, 45 skipped, 5 passed, 51 total
● #147 R4: solo el owner ve Editar y Añadir comida › el owner ve Editar en cada fila y Añadir comida bajo la lista
```

Restauración: `git checkout HEAD -- mobile-pet-tracker/src/screens/meal-schedule/index.tsx`; `git diff --cached --stat`: salida vacía.

#### Sonda R4 — edit raiz sin bg-accent-soft

`bunx jest src/screens/meal-schedule -t '#147 R4:' > /tmp/147-probe-32.log 2>&1; echo "exit=$?"`: exit 1.

```text
Test Suites: 1 failed, 1 total
Tests:       1 failed, 45 skipped, 5 passed, 51 total
● #147 R4: solo el owner ve Editar y Añadir comida › el owner ve Editar en cada fila y Añadir comida bajo la lista
```

Restauración: `git checkout HEAD -- mobile-pet-tracker/src/screens/meal-schedule/index.tsx`; `git diff --cached --stat`: salida vacía.

#### Sonda R4 — edit etiqueta sin font-semibold

`bunx jest src/screens/meal-schedule -t '#147 R4:' > /tmp/147-probe-33.log 2>&1; echo "exit=$?"`: exit 1.

```text
Test Suites: 1 failed, 1 total
Tests:       1 failed, 45 skipped, 5 passed, 51 total
● #147 R4: solo el owner ve Editar y Añadir comida › el owner ve Editar en cada fila y Añadir comida bajo la lista
```

Restauración: `git checkout HEAD -- mobile-pet-tracker/src/screens/meal-schedule/index.tsx`; `git diff --cached --stat`: salida vacía.

#### Sonda R4 — edit etiqueta sin text-accent-strong

`bunx jest src/screens/meal-schedule -t '#147 R4:' > /tmp/147-probe-34.log 2>&1; echo "exit=$?"`: exit 1.

```text
Test Suites: 1 failed, 1 total
Tests:       1 failed, 45 skipped, 5 passed, 51 total
● #147 R4: solo el owner ve Editar y Añadir comida › el owner ve Editar en cada fila y Añadir comida bajo la lista
```

Restauración: `git checkout HEAD -- mobile-pet-tracker/src/screens/meal-schedule/index.tsx`; `git diff --cached --stat`: salida vacía.

#### Sonda R4 — add raiz sin rounded-xl

`bunx jest src/screens/meal-schedule -t '#147 R4:' > /tmp/147-probe-35.log 2>&1; echo "exit=$?"`: exit 1.

```text
Test Suites: 1 failed, 1 total
Tests:       1 failed, 45 skipped, 5 passed, 51 total
● #147 R4: solo el owner ve Editar y Añadir comida › el owner ve Editar en cada fila y Añadir comida bajo la lista
```

Restauración: `git checkout HEAD -- mobile-pet-tracker/src/screens/meal-schedule/index.tsx`; `git diff --cached --stat`: salida vacía.

#### Sonda R4 — add raiz sin bg-accent-soft

`bunx jest src/screens/meal-schedule -t '#147 R4:' > /tmp/147-probe-36.log 2>&1; echo "exit=$?"`: exit 1.

```text
Test Suites: 1 failed, 1 total
Tests:       1 failed, 45 skipped, 5 passed, 51 total
● #147 R4: solo el owner ve Editar y Añadir comida › el owner ve Editar en cada fila y Añadir comida bajo la lista
```

Restauración: `git checkout HEAD -- mobile-pet-tracker/src/screens/meal-schedule/index.tsx`; `git diff --cached --stat`: salida vacía.

#### Sonda R4 — add etiqueta sin font-bold

`bunx jest src/screens/meal-schedule -t '#147 R4:' > /tmp/147-probe-37.log 2>&1; echo "exit=$?"`: exit 1.

```text
Test Suites: 1 failed, 1 total
Tests:       1 failed, 45 skipped, 5 passed, 51 total
● #147 R4: solo el owner ve Editar y Añadir comida › el owner ve Editar en cada fila y Añadir comida bajo la lista
```

Restauración: `git checkout HEAD -- mobile-pet-tracker/src/screens/meal-schedule/index.tsx`; `git diff --cached --stat`: salida vacía.

#### Sonda R4 — add etiqueta sin text-accent-strong

`bunx jest src/screens/meal-schedule -t '#147 R4:' > /tmp/147-probe-38.log 2>&1; echo "exit=$?"`: exit 1.

```text
Test Suites: 1 failed, 1 total
Tests:       1 failed, 45 skipped, 5 passed, 51 total
● #147 R4: solo el owner ve Editar y Añadir comida › el owner ve Editar en cada fila y Añadir comida bajo la lista
```

Restauración: `git checkout HEAD -- mobile-pet-tracker/src/screens/meal-schedule/index.tsx`; `git diff --cached --stat`: salida vacía.

#### Sonda R5 — setUTCHours

`bunx jest src/screens/meal-schedule -t '#147 R5:' > /tmp/147-probe-39.log 2>&1; echo "exit=$?"`: exit 1.

```text
Test Suites: 1 failed, 1 total
Tests:       1 failed, 47 skipped, 3 passed, 51 total
● #147 R5: Editar abre el selector en la hora de la fila y publica el PATCH › abre un único selector de hora con la hora local de la fila
```

Restauración: `git checkout HEAD -- mobile-pet-tracker/src/screens/meal-schedule/index.tsx`; `git diff --cached --stat`: salida vacía.

#### Sonda R5 — mode date

`bunx jest src/screens/meal-schedule -t '#147 R5:' > /tmp/147-probe-40.log 2>&1; echo "exit=$?"`: exit 1.

```text
Test Suites: 1 failed, 1 total
Tests:       1 failed, 47 skipped, 3 passed, 51 total
● #147 R5: Editar abre el selector en la hora de la fila y publica el PATCH › abre un único selector de hora con la hora local de la fila
```

Restauración: `git checkout HEAD -- mobile-pet-tracker/src/screens/meal-schedule/index.tsx`; `git diff --cached --stat`: salida vacía.

#### Sonda R5 — sin presentation

`bunx jest src/screens/meal-schedule -t '#147 R5:' > /tmp/147-probe-41.log 2>&1; echo "exit=$?"`: exit 1.

```text
Test Suites: 1 failed, 1 total
Tests:       1 failed, 47 skipped, 3 passed, 51 total
● #147 R5: Editar abre el selector en la hora de la fila y publica el PATCH › abre un único selector de hora con la hora local de la fila
```

Restauración: `git checkout HEAD -- mobile-pet-tracker/src/screens/meal-schedule/index.tsx`; `git diff --cached --stat`: salida vacía.

#### Sonda R5 — un selector por fila

`bunx jest src/screens/meal-schedule -t '#147 R5:' > /tmp/147-probe-42.log 2>&1; echo "exit=$?"`: exit 1.

```text
Test Suites: 1 failed, 1 total
Tests:       4 failed, 47 skipped, 51 total
● #147 R5: Editar abre el selector en la hora de la fila y publica el PATCH › abre un único selector de hora con la hora local de la fila
● #147 R5: Editar abre el selector en la hora de la fila y publica el PATCH › al elegir una hora nueva llama a moveMealTime con la hora local y cierra el selector
● #147 R5: Editar abre el selector en la hora de la fila y publica el PATCH › al cerrar el selector sin elegir no llama a nada
● #147 R5: Editar abre el selector en la hora de la fila y publica el PATCH › elegir la misma hora de la fila no llama a nada
```

Restauración: `git checkout HEAD -- mobile-pet-tracker/src/screens/meal-schedule/index.tsx`; `git diff --cached --stat`: salida vacía.

#### Sonda R5 — getters UTC

`bunx jest src/screens/meal-schedule -t '#147 R5:' > /tmp/147-probe-43.log 2>&1; echo "exit=$?"`: exit 1.

```text
Test Suites: 1 failed, 1 total
Tests:       1 failed, 47 skipped, 3 passed, 51 total
● #147 R5: Editar abre el selector en la hora de la fila y publica el PATCH › al elegir una hora nueva llama a moveMealTime con la hora local y cierra el selector
```

Restauración: `git checkout HEAD -- mobile-pet-tracker/src/screens/meal-schedule/index.tsx`; `git diff --cached --stat`: salida vacía.

#### Sonda R5 — toISOString

`bunx jest src/screens/meal-schedule -t '#147 R5:' > /tmp/147-probe-44.log 2>&1; echo "exit=$?"`: exit 1.

```text
Test Suites: 1 failed, 1 total
Tests:       1 failed, 47 skipped, 3 passed, 51 total
● #147 R5: Editar abre el selector en la hora de la fila y publica el PATCH › al elegir una hora nueva llama a moveMealTime con la hora local y cierra el selector
```

Restauración: `git checkout HEAD -- mobile-pet-tracker/src/screens/meal-schedule/index.tsx`; `git diff --cached --stat`: salida vacía.

#### Sonda R5 — from fila 0

`bunx jest src/screens/meal-schedule -t '#147 R5:' > /tmp/147-probe-45.log 2>&1; echo "exit=$?"`: exit 1.

```text
Test Suites: 1 failed, 1 total
Tests:       1 failed, 47 skipped, 3 passed, 51 total
● #147 R5: Editar abre el selector en la hora de la fila y publica el PATCH › al elegir una hora nueva llama a moveMealTime con la hora local y cierra el selector
```

Restauración: `git checkout HEAD -- mobile-pet-tracker/src/screens/meal-schedule/index.tsx`; `git diff --cached --stat`: salida vacía.

#### Sonda R5 — from y to intercambiados

`bunx jest src/screens/meal-schedule -t '#147 R5:' > /tmp/147-probe-46.log 2>&1; echo "exit=$?"`: exit 1.

```text
Test Suites: 1 failed, 1 total
Tests:       1 failed, 47 skipped, 3 passed, 51 total
● #147 R5: Editar abre el selector en la hora de la fila y publica el PATCH › al elegir una hora nueva llama a moveMealTime con la hora local y cierra el selector
```

Restauración: `git checkout HEAD -- mobile-pet-tracker/src/screens/meal-schedule/index.tsx`; `git diff --cached --stat`: salida vacía.

#### Sonda R5 — sin cerrar al elegir

`bunx jest src/screens/meal-schedule -t '#147 R5:' > /tmp/147-probe-47.log 2>&1; echo "exit=$?"`: exit 1.

```text
Test Suites: 1 failed, 1 total
Tests:       2 failed, 47 skipped, 2 passed, 51 total
● #147 R5: Editar abre el selector en la hora de la fila y publica el PATCH › al elegir una hora nueva llama a moveMealTime con la hora local y cierra el selector
● #147 R5: Editar abre el selector en la hora de la fila y publica el PATCH › elegir la misma hora de la fila no llama a nada
```

Restauración: `git checkout HEAD -- mobile-pet-tracker/src/screens/meal-schedule/index.tsx`; `git diff --cached --stat`: salida vacía.

#### Sonda R5 — move en onDismiss

`bunx jest src/screens/meal-schedule -t '#147 R5:' > /tmp/147-probe-48.log 2>&1; echo "exit=$?"`: exit 1.

```text
Test Suites: 1 failed, 1 total
Tests:       1 failed, 47 skipped, 3 passed, 51 total
● #147 R5: Editar abre el selector en la hora de la fila y publica el PATCH › al cerrar el selector sin elegir no llama a nada
```

Restauración: `git checkout HEAD -- mobile-pet-tracker/src/screens/meal-schedule/index.tsx`; `git diff --cached --stat`: salida vacía.

#### Sonda R5 — sin guarda misma hora

`bunx jest src/screens/meal-schedule -t '#147 R5:' > /tmp/147-probe-49.log 2>&1; echo "exit=$?"`: exit 1.

```text
Test Suites: 1 failed, 1 total
Tests:       1 failed, 47 skipped, 3 passed, 51 total
● #147 R5: Editar abre el selector en la hora de la fila y publica el PATCH › elegir la misma hora de la fila no llama a nada
```

Restauración: `git checkout HEAD -- mobile-pet-tracker/src/screens/meal-schedule/index.tsx`; `git diff --cached --stat`: salida vacía.

#### Sonda R6 — inicial 09:00

`bunx jest src/screens/meal-schedule -t '#147 R6:' > /tmp/147-probe-50.log 2>&1; echo "exit=$?"`: exit 1.

```text
Test Suites: 1 failed, 1 total
Tests:       1 failed, 48 skipped, 2 passed, 51 total
● #147 R6: Añadir comida abre el selector a las 12:00 y publica el POST › abre el selector a las 12:00 locales
```

Restauración: `git checkout HEAD -- mobile-pet-tracker/src/screens/meal-schedule/index.tsx`; `git diff --cached --stat`: salida vacía.

#### Sonda R6 — setUTCHours 12:00

`bunx jest src/screens/meal-schedule -t '#147 R6:' > /tmp/147-probe-51.log 2>&1; echo "exit=$?"`: exit 1.

```text
Test Suites: 1 failed, 1 total
Tests:       1 failed, 48 skipped, 2 passed, 51 total
● #147 R6: Añadir comida abre el selector a las 12:00 y publica el POST › abre el selector a las 12:00 locales
```

Restauración: `git checkout HEAD -- mobile-pet-tracker/src/screens/meal-schedule/index.tsx`; `git diff --cached --stat`: salida vacía.

#### Sonda R6 — add llama move

`bunx jest src/screens/meal-schedule -t '#147 R6:' > /tmp/147-probe-52.log 2>&1; echo "exit=$?"`: exit 1.

```text
Test Suites: 1 failed, 1 total
Tests:       1 failed, 48 skipped, 2 passed, 51 total
● #147 R6: Añadir comida abre el selector a las 12:00 y publica el POST › al elegir una hora llama a addMealTime con la hora local rellenada a dos dígitos
```

Restauración: `git checkout HEAD -- mobile-pet-tracker/src/screens/meal-schedule/index.tsx`; `git diff --cached --stat`: salida vacía.

#### Sonda R6 — sin padStart

`bunx jest src/screens/meal-schedule -t '#147 R6:' > /tmp/147-probe-53.log 2>&1; echo "exit=$?"`: exit 1.

```text
Test Suites: 1 failed, 1 total
Tests:       1 failed, 48 skipped, 2 passed, 51 total
● #147 R6: Añadir comida abre el selector a las 12:00 y publica el POST › al elegir una hora llama a addMealTime con la hora local rellenada a dos dígitos
```

Restauración: `git checkout HEAD -- mobile-pet-tracker/src/screens/meal-schedule/index.tsx`; `git diff --cached --stat`: salida vacía.

#### Sonda R6 — getters UTC

`bunx jest src/screens/meal-schedule -t '#147 R6:' > /tmp/147-probe-54.log 2>&1; echo "exit=$?"`: exit 1.

```text
Test Suites: 1 failed, 1 total
Tests:       1 failed, 48 skipped, 2 passed, 51 total
● #147 R6: Añadir comida abre el selector a las 12:00 y publica el POST › al elegir una hora llama a addMealTime con la hora local rellenada a dos dígitos
```

Restauración: `git checkout HEAD -- mobile-pet-tracker/src/screens/meal-schedule/index.tsx`; `git diff --cached --stat`: salida vacía.

#### Sonda R6 — add en onDismiss

`bunx jest src/screens/meal-schedule -t '#147 R6:' > /tmp/147-probe-55.log 2>&1; echo "exit=$?"`: exit 1.

```text
Test Suites: 1 failed, 1 total
Tests:       1 failed, 48 skipped, 2 passed, 51 total
● #147 R6: Añadir comida abre el selector a las 12:00 y publica el POST › al cerrar el selector sin elegir no llama a nada
```

Restauración: `git checkout HEAD -- mobile-pet-tracker/src/screens/meal-schedule/index.tsx`; `git diff --cached --stat`: salida vacía.

#### Sonda R7 — sin plan.refetch

`bunx jest src/screens/meal-schedule -t '#147 R7:' > /tmp/147-probe-56.log 2>&1; echo "exit=$?"`: exit 1.

```text
Test Suites: 1 failed, 1 total
Tests:       2 failed, 47 skipped, 2 passed, 51 total
● #147 R7: tras un éxito refetchea plan y mascota, sin estado optimista › tras ok refetchea el plan y el detalle de la mascota y repinta con la hora nueva
● #147 R7: tras un éxito refetchea plan y mascota, sin estado optimista › los controles siguen deshabilitados hasta que termina el refetch
```

Restauración: `git checkout HEAD -- mobile-pet-tracker/src/screens/meal-schedule/index.tsx`; `git diff --cached --stat`: salida vacía.

#### Sonda R7 — sin refetchQueries pet

`bunx jest src/screens/meal-schedule -t '#147 R7:' > /tmp/147-probe-57.log 2>&1; echo "exit=$?"`: exit 1.

```text
Test Suites: 1 failed, 1 total
Tests:       1 failed, 47 skipped, 3 passed, 51 total
● #147 R7: tras un éxito refetchea plan y mascota, sin estado optimista › tras ok refetchea el plan y el detalle de la mascota y repinta con la hora nueva
```

Restauración: `git checkout HEAD -- mobile-pet-tracker/src/screens/meal-schedule/index.tsx`; `git diff --cached --stat`: salida vacía.

#### Sonda R7 — estado optimista

`bunx jest src/screens/meal-schedule -t '#147 R7:' > /tmp/147-probe-58.log 2>&1; echo "exit=$?"`: exit 1.

```text
Test Suites: 1 failed, 1 total
Tests:       1 failed, 47 skipped, 3 passed, 51 total
● #147 R7: tras un éxito refetchea plan y mascota, sin estado optimista › mientras la edición vuela, todos los controles están deshabilitados y la lista no cambia
```

Restauración: `git checkout HEAD -- mobile-pet-tracker/src/screens/meal-schedule/index.tsx`; `git diff --cached --stat`: salida vacía.

#### Sonda R7 — sin disabled edit 0

`bunx jest src/screens/meal-schedule -t '#147 R7:' > /tmp/147-probe-59.log 2>&1; echo "exit=$?"`: exit 1.

```text
Test Suites: 1 failed, 1 total
Tests:       2 failed, 47 skipped, 2 passed, 51 total
● #147 R7: tras un éxito refetchea plan y mascota, sin estado optimista › mientras la edición vuela, todos los controles están deshabilitados y la lista no cambia
● #147 R7: tras un éxito refetchea plan y mascota, sin estado optimista › los controles siguen deshabilitados hasta que termina el refetch
```

Restauración: `git checkout HEAD -- mobile-pet-tracker/src/screens/meal-schedule/index.tsx`; `git diff --cached --stat`: salida vacía.

#### Sonda R7 — sin disabled edit 1

`bunx jest src/screens/meal-schedule -t '#147 R7:' > /tmp/147-probe-60.log 2>&1; echo "exit=$?"`: exit 1.

```text
Test Suites: 1 failed, 1 total
Tests:       2 failed, 47 skipped, 2 passed, 51 total
● #147 R7: tras un éxito refetchea plan y mascota, sin estado optimista › mientras la edición vuela, todos los controles están deshabilitados y la lista no cambia
● #147 R7: tras un éxito refetchea plan y mascota, sin estado optimista › los controles siguen deshabilitados hasta que termina el refetch
```

Restauración: `git checkout HEAD -- mobile-pet-tracker/src/screens/meal-schedule/index.tsx`; `git diff --cached --stat`: salida vacía.

#### Sonda R7 — sin disabled add

`bunx jest src/screens/meal-schedule -t '#147 R7:' > /tmp/147-probe-61.log 2>&1; echo "exit=$?"`: exit 1.

```text
Test Suites: 1 failed, 1 total
Tests:       2 failed, 47 skipped, 2 passed, 51 total
● #147 R7: tras un éxito refetchea plan y mascota, sin estado optimista › mientras la edición vuela, todos los controles están deshabilitados y la lista no cambia
● #147 R7: tras un éxito refetchea plan y mascota, sin estado optimista › los controles siguen deshabilitados hasta que termina el refetch
```

Restauración: `git checkout HEAD -- mobile-pet-tracker/src/screens/meal-schedule/index.tsx`; `git diff --cached --stat`: salida vacía.

#### Sonda R7 — rehabilitar antes refetch

`bunx jest src/screens/meal-schedule -t '#147 R7:' > /tmp/147-probe-62.log 2>&1; echo "exit=$?"`: exit 1.

```text
Test Suites: 1 failed, 1 total
Tests:       1 failed, 47 skipped, 3 passed, 51 total
● #147 R7: tras un éxito refetchea plan y mascota, sin estado optimista › los controles siguen deshabilitados hasta que termina el refetch
```

Restauración: `git checkout HEAD -- mobile-pet-tracker/src/screens/meal-schedule/index.tsx`; `git diff --cached --stat`: salida vacía.

#### Sonda R8 — clave cambiada errorInvalidTime

`bunx jest src/screens/meal-schedule -t '#147 R8:' > /tmp/147-probe-63.log 2>&1; echo "exit=$?"`: exit 1.

```text
Test Suites: 1 failed, 1 total
Tests:       1 failed, 39 skipped, 11 passed, 51 total
● #147 R8: cada error del contrato tiene su mensaje › invalid muestra «La hora no es válida»
```

Restauración: `git checkout HEAD -- mobile-pet-tracker/src/screens/meal-schedule/index.tsx`; `git diff --cached --stat`: salida vacía.

#### Sonda R8 — clave cambiada errorEditForbidden

`bunx jest src/screens/meal-schedule -t '#147 R8:' > /tmp/147-probe-64.log 2>&1; echo "exit=$?"`: exit 1.

```text
Test Suites: 1 failed, 1 total
Tests:       1 failed, 39 skipped, 11 passed, 51 total
● #147 R8: cada error del contrato tiene su mensaje › forbidden muestra «Solo el dueño puede cambiar los horarios»
```

Restauración: `git checkout HEAD -- mobile-pet-tracker/src/screens/meal-schedule/index.tsx`; `git diff --cached --stat`: salida vacía.

#### Sonda R8 — clave cambiada errorPlanRequired

`bunx jest src/screens/meal-schedule -t '#147 R8:' > /tmp/147-probe-65.log 2>&1; echo "exit=$?"`: exit 1.

```text
Test Suites: 1 failed, 1 total
Tests:       1 failed, 39 skipped, 11 passed, 51 total
● #147 R8: cada error del contrato tiene su mensaje › NUTRITION_PLAN_REQUIRED muestra «Primero genera un plan de alimentación»
```

Restauración: `git checkout HEAD -- mobile-pet-tracker/src/screens/meal-schedule/index.tsx`; `git diff --cached --stat`: salida vacía.

#### Sonda R8 — clave cambiada errorTimeNotInPlan

`bunx jest src/screens/meal-schedule -t '#147 R8:' > /tmp/147-probe-66.log 2>&1; echo "exit=$?"`: exit 1.

```text
Test Suites: 1 failed, 1 total
Tests:       1 failed, 39 skipped, 11 passed, 51 total
● #147 R8: cada error del contrato tiene su mensaje › MEAL_TIME_NOT_IN_PLAN muestra «Ese horario ya no está en el plan»
```

Restauración: `git checkout HEAD -- mobile-pet-tracker/src/screens/meal-schedule/index.tsx`; `git diff --cached --stat`: salida vacía.

#### Sonda R8 — clave cambiada errorDuplicateTime

`bunx jest src/screens/meal-schedule -t '#147 R8:' > /tmp/147-probe-67.log 2>&1; echo "exit=$?"`: exit 1.

```text
Test Suites: 1 failed, 1 total
Tests:       2 failed, 39 skipped, 10 passed, 51 total
● #147 R8: cada error del contrato tiene su mensaje › MEAL_TIME_DUPLICATE muestra «Ya hay una comida a esa hora»
● #147 R8: cada error del contrato tiene su mensaje › una nueva edición retira el error anterior
```

Restauración: `git checkout HEAD -- mobile-pet-tracker/src/screens/meal-schedule/index.tsx`; `git diff --cached --stat`: salida vacía.

#### Sonda R8 — clave cambiada errorMealLimit

`bunx jest src/screens/meal-schedule -t '#147 R8:' > /tmp/147-probe-68.log 2>&1; echo "exit=$?"`: exit 1.

```text
Test Suites: 1 failed, 1 total
Tests:       1 failed, 39 skipped, 11 passed, 51 total
● #147 R8: cada error del contrato tiene su mensaje › MEAL_TIMES_LIMIT_REACHED muestra «El plan ya tiene el máximo de 6 comidas»
```

Restauración: `git checkout HEAD -- mobile-pet-tracker/src/screens/meal-schedule/index.tsx`; `git diff --cached --stat`: salida vacía.

#### Sonda R8 — unreachable clave cambiada

`bunx jest src/screens/meal-schedule -t '#147 R8:' > /tmp/147-probe-69.log 2>&1; echo "exit=$?"`: exit 1.

```text
Test Suites: 1 failed, 1 total
Tests:       1 failed, 39 skipped, 11 passed, 51 total
● #147 R8: cada error del contrato tiene su mensaje › unreachable muestra «No se pudo conectar con el servidor»
```

Restauración: `git checkout HEAD -- mobile-pet-tracker/src/screens/meal-schedule/index.tsx`; `git diff --cached --stat`: salida vacía.

#### Sonda R8 — error y missing-config clave cambiada

`bunx jest src/screens/meal-schedule -t '#147 R8:' > /tmp/147-probe-70.log 2>&1; echo "exit=$?"`: exit 1.

```text
Test Suites: 1 failed, 1 total
Tests:       2 failed, 39 skipped, 10 passed, 51 total
● #147 R8: cada error del contrato tiene su mensaje › error muestra «Algo salió mal»
● #147 R8: cada error del contrato tiene su mensaje › missing-config muestra «Algo salió mal»
```

Restauración: `git checkout HEAD -- mobile-pet-tracker/src/screens/meal-schedule/index.tsx`; `git diff --cached --stat`: salida vacía.

#### Sonda R8 — catch clave cambiada

`bunx jest src/screens/meal-schedule -t '#147 R8:' > /tmp/147-probe-71.log 2>&1; echo "exit=$?"`: exit 1.

```text
Test Suites: 1 failed, 1 total
Tests:       1 failed, 39 skipped, 11 passed, 51 total
● #147 R8: cada error del contrato tiene su mensaje › rechazo muestra «Algo salió mal»
```

Restauración: `git checkout HEAD -- mobile-pet-tracker/src/screens/meal-schedule/index.tsx`; `git diff --cached --stat`: salida vacía.

#### Sonda R8 — missing-config cannotReachServer

`bunx jest src/screens/meal-schedule -t '#147 R8:' > /tmp/147-probe-72.log 2>&1; echo "exit=$?"`: exit 1.

```text
Test Suites: 1 failed, 1 total
Tests:       2 failed, 39 skipped, 10 passed, 51 total
● #147 R8: cada error del contrato tiene su mensaje › error muestra «Algo salió mal»
● #147 R8: cada error del contrato tiene su mensaje › missing-config muestra «Algo salió mal»
```

Restauración: `git checkout HEAD -- mobile-pet-tracker/src/screens/meal-schedule/index.tsx`; `git diff --cached --stat`: salida vacía.

#### Sonda R8 — sin catch

`bunx jest src/screens/meal-schedule -t '#147 R8:' > /tmp/147-probe-73.log 2>&1; echo "exit=$?"`: exit 1.

```text
Test Suites: 1 failed, 1 total
Tests:       1 failed, 39 skipped, 11 passed, 51 total
● #147 R8: cada error del contrato tiene su mensaje › rechazo muestra «Algo salió mal»
● #147 R8: cada error del contrato tiene su mensaje › rechazo muestra «Algo salió mal»
```

Restauración: `git checkout HEAD -- mobile-pet-tracker/src/screens/meal-schedule/index.tsx`; `git diff --cached --stat`: salida vacía.

#### Sonda R8 — error fuera seccion

`bunx jest src/screens/meal-schedule -t '#147 R8:' > /tmp/147-probe-74.log 2>&1; echo "exit=$?"`: exit 1.

```text
Test Suites: 1 failed, 1 total
Tests:       10 failed, 39 skipped, 2 passed, 51 total
● #147 R8: cada error del contrato tiene su mensaje › invalid muestra «La hora no es válida»
● #147 R8: cada error del contrato tiene su mensaje › forbidden muestra «Solo el dueño puede cambiar los horarios»
● #147 R8: cada error del contrato tiene su mensaje › NUTRITION_PLAN_REQUIRED muestra «Primero genera un plan de alimentación»
● #147 R8: cada error del contrato tiene su mensaje › MEAL_TIME_NOT_IN_PLAN muestra «Ese horario ya no está en el plan»
● #147 R8: cada error del contrato tiene su mensaje › MEAL_TIME_DUPLICATE muestra «Ya hay una comida a esa hora»
● #147 R8: cada error del contrato tiene su mensaje › MEAL_TIMES_LIMIT_REACHED muestra «El plan ya tiene el máximo de 6 comidas»
● #147 R8: cada error del contrato tiene su mensaje › unreachable muestra «No se pudo conectar con el servidor»
● #147 R8: cada error del contrato tiene su mensaje › error muestra «Algo salió mal»
● #147 R8: cada error del contrato tiene su mensaje › missing-config muestra «Algo salió mal»
● #147 R8: cada error del contrato tiene su mensaje › rechazo muestra «Algo salió mal»
```

Restauración: `git checkout HEAD -- mobile-pet-tracker/src/screens/meal-schedule/index.tsx`; `git diff --cached --stat`: salida vacía.

#### Sonda R8 — error debajo add

`bunx jest src/screens/meal-schedule -t '#147 R8:' > /tmp/147-probe-75.log 2>&1; echo "exit=$?"`: exit 1.

```text
Test Suites: 1 failed, 1 total
Tests:       10 failed, 39 skipped, 2 passed, 51 total
● #147 R8: cada error del contrato tiene su mensaje › invalid muestra «La hora no es válida»
● #147 R8: cada error del contrato tiene su mensaje › forbidden muestra «Solo el dueño puede cambiar los horarios»
● #147 R8: cada error del contrato tiene su mensaje › NUTRITION_PLAN_REQUIRED muestra «Primero genera un plan de alimentación»
● #147 R8: cada error del contrato tiene su mensaje › MEAL_TIME_NOT_IN_PLAN muestra «Ese horario ya no está en el plan»
● #147 R8: cada error del contrato tiene su mensaje › MEAL_TIME_DUPLICATE muestra «Ya hay una comida a esa hora»
● #147 R8: cada error del contrato tiene su mensaje › MEAL_TIMES_LIMIT_REACHED muestra «El plan ya tiene el máximo de 6 comidas»
● #147 R8: cada error del contrato tiene su mensaje › unreachable muestra «No se pudo conectar con el servidor»
● #147 R8: cada error del contrato tiene su mensaje › error muestra «Algo salió mal»
● #147 R8: cada error del contrato tiene su mensaje › missing-config muestra «Algo salió mal»
● #147 R8: cada error del contrato tiene su mensaje › rechazo muestra «Algo salió mal»
```

Restauración: `git checkout HEAD -- mobile-pet-tracker/src/screens/meal-schedule/index.tsx`; `git diff --cached --stat`: salida vacía.

#### Sonda R8 — sin selectable

`bunx jest src/screens/meal-schedule -t '#147 R8:' > /tmp/147-probe-76.log 2>&1; echo "exit=$?"`: exit 1.

```text
Test Suites: 1 failed, 1 total
Tests:       10 failed, 39 skipped, 2 passed, 51 total
● #147 R8: cada error del contrato tiene su mensaje › invalid muestra «La hora no es válida»
● #147 R8: cada error del contrato tiene su mensaje › forbidden muestra «Solo el dueño puede cambiar los horarios»
● #147 R8: cada error del contrato tiene su mensaje › NUTRITION_PLAN_REQUIRED muestra «Primero genera un plan de alimentación»
● #147 R8: cada error del contrato tiene su mensaje › MEAL_TIME_NOT_IN_PLAN muestra «Ese horario ya no está en el plan»
● #147 R8: cada error del contrato tiene su mensaje › MEAL_TIME_DUPLICATE muestra «Ya hay una comida a esa hora»
● #147 R8: cada error del contrato tiene su mensaje › MEAL_TIMES_LIMIT_REACHED muestra «El plan ya tiene el máximo de 6 comidas»
● #147 R8: cada error del contrato tiene su mensaje › unreachable muestra «No se pudo conectar con el servidor»
● #147 R8: cada error del contrato tiene su mensaje › error muestra «Algo salió mal»
● #147 R8: cada error del contrato tiene su mensaje › missing-config muestra «Algo salió mal»
● #147 R8: cada error del contrato tiene su mensaje › rechazo muestra «Algo salió mal»
```

Restauración: `git checkout HEAD -- mobile-pet-tracker/src/screens/meal-schedule/index.tsx`; `git diff --cached --stat`: salida vacía.

#### Sonda R8 — error en unauthorized

`bunx jest src/screens/meal-schedule -t '#147 R8:' > /tmp/147-probe-77.log 2>&1; echo "exit=$?"`: exit 1.

```text
Test Suites: 1 failed, 1 total
Tests:       1 failed, 39 skipped, 11 passed, 51 total
● #147 R8: cada error del contrato tiene su mensaje › 401 cierra sesión sin mensaje
```

Restauración: `git checkout HEAD -- mobile-pet-tracker/src/screens/meal-schedule/index.tsx`; `git diff --cached --stat`: salida vacía.

#### Sonda R8 — sin limpiar error

`bunx jest src/screens/meal-schedule -t '#147 R8:' > /tmp/147-probe-78.log 2>&1; echo "exit=$?"`: exit 1.

```text
Test Suites: 1 failed, 1 total
Tests:       1 failed, 39 skipped, 11 passed, 51 total
● #147 R8: cada error del contrato tiene su mensaje › una nueva edición retira el error anterior
```

Restauración: `git checkout HEAD -- mobile-pet-tracker/src/screens/meal-schedule/index.tsx`; `git diff --cached --stat`: salida vacía.

#### Sonda R8 — tercer somethingWentWrong

`bunx jest src/__tests__/ui-language.test.ts -t '#65 R6:|#65 R18:' > /tmp/147-probe-79.log 2>&1; echo "exit=$?"`: exit 1.

```text
Test Suites: 1 failed, 1 total
Tests:       2 failed, 23 skipped, 3 passed, 28 total
● #65 R6: Food resuelve su copy por clave › resuelve las 50 ocurrencias normativas
● #65 R18: los sitios resuelven por clave y no queda copy suelta › resuelve cada ocurrencia de la tabla contra la clave exacta
```

Restauración: `git checkout HEAD -- mobile-pet-tracker/src/screens/meal-schedule/index.tsx`; `git diff --cached --stat`: salida vacía.

#### Sonda R9 — sin fila editTimeLabel

`bunx jest src/providers/__tests__/language-provider.test.tsx src/__tests__/ui-language.test.ts -t '#147 R9:|#65 R6:' > /tmp/147-probe-80.log 2>&1; echo "exit=$?"`: exit 1.

```text
Test Suites: 1 failed, 1 skipped, 1 of 2 total
Tests:       2 failed, 38 skipped, 40 total
● #65 R6: Food resuelve su copy por clave › resuelve las 50 ocurrencias normativas
● #147 R9: el copy del horario editable queda registrado › nombra las nueve ocurrencias nuevas y las resuelve en su fichero
```

Restauración: `git checkout HEAD -- mobile-pet-tracker/src/__tests__/ui-copy-table.ts`; `git diff --cached --stat`: salida vacía.

#### Sonda R9 — fila duplicada

`bunx jest src/providers/__tests__/language-provider.test.tsx src/__tests__/ui-language.test.ts -t '#147 R9:|#65 R6:|#65 R18:' > /tmp/147-probe-81.log 2>&1; echo "exit=$?"`: exit 1.

```text
Test Suites: 1 failed, 1 skipped, 1 of 2 total
Tests:       3 failed, 34 skipped, 3 passed, 40 total
● #65 R6: Food resuelve su copy por clave › resuelve las 50 ocurrencias normativas
● #65 R18: los sitios resuelven por clave y no queda copy suelta › resuelve cada ocurrencia de la tabla contra la clave exacta
● #147 R9: el copy del horario editable queda registrado › nombra las nueve ocurrencias nuevas y las resuelve en su fichero
```

Restauración: `git checkout HEAD -- mobile-pet-tracker/src/__tests__/ui-copy-table.ts`; `git diff --cached --stat`: salida vacía.

#### Sonda R9 — fila en R3_HOME

`bunx jest src/providers/__tests__/language-provider.test.tsx src/__tests__/ui-language.test.ts -t '#147 R9:' > /tmp/147-probe-82.log 2>&1; echo "exit=$?"`: exit 1.

```text
Test Suites: 1 failed, 1 skipped, 1 of 2 total
Tests:       1 failed, 39 skipped, 40 total
● #147 R9: el copy del horario editable queda registrado › nombra las nueve ocurrencias nuevas y las resuelve en su fichero
```

Restauración: `git checkout HEAD -- mobile-pet-tracker/src/__tests__/ui-copy-table.ts`; `git diff --cached --stat`: salida vacía.

### Corrección del formato de §2.16

La revisión final encontró los nueve pares de literales sin los backticks del formato de §2.15 exigido por design.md. Se corrige únicamente esa tabla, sin cambiar ningún valor, clave ni aserción. Commit de refactor R1 propio posterior a su verde, conservando los hashes C4.

### Formato §2.16: verde

Desde `mobile-pet-tracker/`: `bunx jest src/providers/__tests__/language-provider.test.tsx src/__tests__/ui-language.test.ts > /tmp/147-table-format-green.log 2>&1; echo "exit=$?"`. Exit 0.

```text
Test Suites: 2 passed, 2 total
Tests:       40 passed, 40 total
Snapshots:   0 total
Time:        2.289 s, estimated 3 s
Ran all test suites matching /src\/providers\/__tests__\/language-provider.test.tsx|src\/__tests__\/ui-language.test.ts/i.
```

### Cierre detenido: bun run test

Desde `mobile-pet-tracker/`: `bun run test > /tmp/147-full-test.log 2>&1; echo "exit=$?"`. Exit 1.

```text
Test Suites: 2 failed, 86 passed, 88 total
Tests:       3 failed, 1756 passed, 1759 total
Snapshots:   1 passed, 1 total
Time:        42.35 s
Ran all test suites.
```

```text
  ● #87 R19: use-api no deja huella › preserves every mutation sign-out with zero delta

    expect(received).toEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 1

    @@ -5,11 +5,11 @@
        "screens/docs/index.tsx": 0,
        "screens/geofences/index.tsx": 1,
        "screens/health/index.tsx": 0,
        "screens/home/index.tsx": 0,
        "screens/map/index.tsx": 0,
    -   "screens/meal-schedule/index.tsx": 1,
    +   "screens/meal-schedule/index.tsx": 2,
        "screens/pairing/index.tsx": 2,
        "screens/profile/index.tsx": 2,
        "screens/reminders/index.tsx": 1,
        "screens/weight-log/index.tsx": 1,
      }

      521 |     );
      522 |
    > 523 |     expect(actual).toEqual(screenSignOutCalls);
          |                    ^
      524 |   });
      525 | });
      526 |

      at Object.toEqual (src/__tests__/design-drift.test.ts:523:20)
```

```text
  ● #98 R10: los candados que esta feature no mueve › deja CONTINUOUS_CORNER, bg-accent-soft y el acento donde estaban

    expect(received).toBe(expected) // Object.is equality

    Expected: 16
    Received: 18

      396 |     expect(count(/style=\{CONTINUOUS_CORNER\}/g)).toBe(31 + 1); // #41 R9: geofences-link
      397 |     expect(count(/rounded-xl bg-accent(?=[\s'"`])/g)).toBe(13);
    > 398 |     expect(count(/bg-accent-soft/g)).toBe(16);
          |                                      ^
      399 |     expect(home.match(/text-accent-strong\b/g)).toHaveLength(2);
      400 |     expect(food.match(/text-accent-strong\b/g)).toHaveLength(1);
      401 |     expect(filesMatching(/\brounded-(?:2xl|lg|md|sm)\b/)).toEqual([]);

      at Object.toBe (src/__tests__/consistency-classnames.test.ts:398:38)
```

```text
  ● #64 R9: el color categórico solo se nombra en el módulo de paleta › conserva los dieciséis usos de bg-accent-soft que sí son acento

    expect(received).toBe(expected) // Object.is equality

    Expected: 16
    Received: 18

      461 |     const docs = readSource(join('screens', 'docs', 'index.tsx'));
      462 |
    > 463 |     expect(accentSoftCount).toBe(16);
          |                             ^
      464 |     expect(reminders.match(/bg-accent-soft/g)).toHaveLength(1);
      465 |     expect(docs.match(/bg-accent-soft/g)).toBeNull();
      466 |   });

      at Object.toBe (src/__tests__/consistency-classnames.test.ts:463:29)
```

## Commits realizados

```text
0cbb155e test(mobile-meal-schedule-editing): lock nine meal schedule editing catalog keys (R1)
a131c0cc feat(mobile-meal-schedule-editing): add meal schedule editing copy in es and en (R1)
f559d77a test(mobile-meal-schedule-editing): lock addMealTime request and state mapping (R2)
35ed6ada feat(mobile-meal-schedule-editing): add addMealTime api client (R2)
befe2220 test(mobile-meal-schedule-editing): lock moveMealTime request and state mapping (R3)
0438799b feat(mobile-meal-schedule-editing): add moveMealTime api client (R3)
9c88290b test(mobile-meal-schedule-editing): lock owner-only meal time controls (R4)
3c497607 feat(mobile-meal-schedule-editing): show edit and add meal controls to owners (R4)
4a9c91d5 test(mobile-meal-schedule-editing): lock edit time picker and PATCH call (R5)
fc2c792a feat(mobile-meal-schedule-editing): edit a meal time with the native time picker (R5)
2860d495 test(mobile-meal-schedule-editing): lock add meal picker and POST call (R6)
fd48f9c3 feat(mobile-meal-schedule-editing): add a meal time with the native time picker (R6)
13363d1b test(mobile-meal-schedule-editing): lock refetch after success without optimistic state (R7)
a6a85313 feat(mobile-meal-schedule-editing): refetch plan and pet after a meal time edit (R7)
b343c919 test(mobile-meal-schedule-editing): lock meal time edit error messages (R8)
3d79a82c feat(mobile-meal-schedule-editing): show inline errors for meal time edits (R8)
f134d9d4 test(mobile-meal-schedule-editing): lock meal schedule editing copy registration (R9)
ddd0ba67 feat(mobile-meal-schedule-editing): register meal schedule editing copy uses (R9)
2c873c47 refactor(mobile-meal-schedule-editing): apply picker test timezone to Node process (R5,R6)
b5d46054 refactor(mobile-meal-schedule-editing): match language spec table format (R1)
```

18 commits C4 en el orden y con los mensajes literales de tasks.md, más dos refactors posteriores a sus verdes (TZ autorizado, R5/R6; formato de la tabla, R1). No se escribieron hashes en traceability.md: el commit final de docs todavía no se ejecuta porque el cierre está bloqueado.

## Sondas: cobertura de las tablas

Se ejecutaron las 83 variantes registradas arriba y la sonda R7 «refetch en finally» (vía b). Tras la corrección de TZ, todas dan rojo por los candados observados. Incluyen cada código 422, cada clase propia de los dos controles, cada control deshabilitado y cada caso de error. No quedó ninguna sonda de las tablas sin ejecutar. La primera sonda TZ que no detectaba la mutación está conservada como evidencia; se resolvió con autorización del humano y el refactor `2c873c47`. Todas las mutaciones se restauraron con `git checkout HEAD -- <ruta>` y el índice quedó vacío.

## Decisiones y detalles de ejecución

- R4 pendiente: la sección se observa primero dentro del único waitFor conjunto, seguido de la fila visible y el mock. Así la ausencia inicial de la sección da el rojo por consulta prescrito; la espera correcta incluye ambos anclajes positivos.
- R5: el mock de addMealTime se añade a la factoría únicamente en R6, como exige §Mocks. Las ausencias en R5 comprueban `jest.mocked(addMealTime)?.mock.calls ?? []`; desde R6 ese mismo candado cuenta las llamadas del mock real, sin cambiar aserciones.
- Los tests que necesitan resolver una petición diferida usan Promise con su resolver local; el helper pending de la base no expone resolver y se conserva para el rol pendiente.
- La preparación TZ original y la corrección autorizada están documentadas arriba. No hay otras decisiones nuevas de producto; producción sigue D1-D10.
- SDK 57: también se consultaron `@expo/ui/build/universal/Host/index.d.ts` y `types.d.ts`; Host acepta matchContents. Los dobles de @expo/ui se copiaron de add-reminder y petState/childTestIds de geofences, contrastando imports, props del picker y PetState con el destino.

## Bloqueo en §Cierre

Este apartado conserva la parada inicial sobre b5d46054. El bloqueo se resuelve más abajo en «Reanudación 1», tras la Enmienda E1 aprobada.

Antes de la suite completa:

```text
$ pgrep -af 'init\.sh|test:e2e|jest-e2e' | grep -v pgrep
(salida vacía; exit 1 de grep significa que no hay procesos coincidentes)
```

`bun run test` ejecutó exactamente **88 suites / 1759 tests** (+49 sobre la base), con **3 fallos y exit 1**. Los tres proceden de candados globales no previstos por la lista cerrada:

| Archivo | Candado | Expected | Received | Causa |
|---|---|---|---|---|
| `mobile-pet-tracker/src/__tests__/design-drift.test.ts:523` | #87 R19: preserves every mutation sign-out with zero delta | meal-schedule: 1 | meal-schedule: 2 | El signOut de R8 se suma al de generar plan existente. |
| `mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts:398` | #98 R10: deja CONTINUOUS_CORNER, bg-accent-soft y el acento donde estaban | 16 | 18 | Los dos sitios JSX de botones de R4 añaden bg-accent-soft. |
| `mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts:463` | #64 R9: conserva los dieciséis usos de bg-accent-soft que sí son acento | 16 | 18 | Mismo delta de dos sitios. |

Estos dos archivos **no** están entre los once de design.md §Archivos afectados. Se aplica la orden del handoff «Si falla otro it, PARA y repórtalo». No se modifican los candados ni se cambia producción para eludirlos. El leader necesita ampliar/corregir ese alcance antes de ajustar los inventarios (delta +1 de signOut y +2 de bg-accent-soft).

Pendientes por la parada: `bun run lint`, `test ! -e .expo/types/router.d.ts && bun run typecheck` (sin exit ni cifras; no ejecutados), los tres grep-clean de §Cierre paso 2, relleno de traceability.md y el commit final literal de docs. Tampoco se ejecutó init.sh, E2E, smoke humano, push ni PR. No se cambió ningún fichero de los worktrees, backend o bookkeeping excluidos.

Diff actual, antes del commit final que agregaría traceability y este informe:

```text
$ git diff --name-only b367ed44..HEAD
mobile-pet-tracker/src/__tests__/ui-copy-table.ts
mobile-pet-tracker/src/__tests__/ui-language.test.ts
mobile-pet-tracker/src/api/__tests__/nutrition.test.ts
mobile-pet-tracker/src/api/nutrition.ts
mobile-pet-tracker/src/i18n/catalog.ts
mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx
mobile-pet-tracker/src/screens/meal-schedule/index.test.tsx
mobile-pet-tracker/src/screens/meal-schedule/index.tsx
specs/mobile-ui-language/design.md
```

Son los nueve ficheros de código/test/spec ya comprometidos de la lista cerrada. Este informe todavía está sin trackear; traceability.md permanece sin tocar. No se afirma que el diff final de once archivos esté cerrado.

```text
$ git status --short
?? progress/impl_mobile-meal-schedule-editing.md
```

No quedan mutaciones temporales de sondas ni archivos de código pendientes. Este informe se deja para el cierre del leader/continuación; no se anticipa el commit final de trazabilidad con el gate global rojo.

## Reanudación 1

La Enmienda E1 está aprobada por humano. Se leyeron requirements.md §Enmienda E1, tasks.md §Enmienda E1 y la nota E1.2 de §Técnica TZ, y la sección «Reanudación 1» del handoff. E1 documenta los inventarios globales y la corrección TZ ya autorizada; no cambia producción. H0 sigue siendo `b367ed44`.

### Paso 0: identidad y estado

```text
$ pwd
/home/claude/sites/Pet-Tracker
$ git branch --show-current
feature/147-mobile-meal-schedule-editing
$ git rev-parse --short HEAD
d8edb20e
$ git rev-parse --short HEAD~1
98cc1154
$ git rev-parse --short HEAD~2
b5d46054
$ git status --short
?? progress/impl_mobile-meal-schedule-editing.md
```

Las cuatro condiciones de parada no se cumplen. `98cc1154` contiene la enmienda y `d8edb20e` la firma y reanudación del leader.

### Paso 1: rojo de partida E1

Desde `mobile-pet-tracker/`: `bunx jest src/__tests__/consistency-classnames.test.ts src/__tests__/design-drift.test.ts > /tmp/147-e1-base.txt 2>&1; echo "exit=$?"`. Exit 1.

```text
Test Suites: 2 failed, 2 total
Tests:       3 failed, 105 passed, 108 total
Snapshots:   0 total
Time:        1.913 s, estimated 2 s
Ran all test suites matching /src\/__tests__\/consistency-classnames.test.ts|src\/__tests__\/design-drift.test.ts/i.
```

```text
  ● #87 R19: use-api no deja huella › preserves every mutation sign-out with zero delta

    expect(received).toEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 1

    @@ -5,11 +5,11 @@
        "screens/docs/index.tsx": 0,
        "screens/geofences/index.tsx": 1,
        "screens/health/index.tsx": 0,
        "screens/home/index.tsx": 0,
        "screens/map/index.tsx": 0,
    -   "screens/meal-schedule/index.tsx": 1,
    +   "screens/meal-schedule/index.tsx": 2,
        "screens/pairing/index.tsx": 2,
        "screens/profile/index.tsx": 2,
        "screens/reminders/index.tsx": 1,
        "screens/weight-log/index.tsx": 1,
      }

      521 |     );
      522 |
    > 523 |     expect(actual).toEqual(screenSignOutCalls);
          |                    ^
      524 |   });
      525 | });
      526 |

      at Object.toEqual (src/__tests__/design-drift.test.ts:523:20)
```

```text
  ● #98 R10: los candados que esta feature no mueve › deja CONTINUOUS_CORNER, bg-accent-soft y el acento donde estaban

    expect(received).toBe(expected) // Object.is equality

    Expected: 16
    Received: 18

      396 |     expect(count(/style=\{CONTINUOUS_CORNER\}/g)).toBe(31 + 1); // #41 R9: geofences-link
      397 |     expect(count(/rounded-xl bg-accent(?=[\s'"`])/g)).toBe(13);
    > 398 |     expect(count(/bg-accent-soft/g)).toBe(16);
          |                                      ^
      399 |     expect(home.match(/text-accent-strong\b/g)).toHaveLength(2);
      400 |     expect(food.match(/text-accent-strong\b/g)).toHaveLength(1);
      401 |     expect(filesMatching(/\brounded-(?:2xl|lg|md|sm)\b/)).toEqual([]);

      at Object.toBe (src/__tests__/consistency-classnames.test.ts:398:38)
```

```text
  ● #64 R9: el color categórico solo se nombra en el módulo de paleta › conserva los dieciséis usos de bg-accent-soft que sí son acento

    expect(received).toBe(expected) // Object.is equality

    Expected: 16
    Received: 18

      461 |     const docs = readSource(join('screens', 'docs', 'index.tsx'));
      462 |
    > 463 |     expect(accentSoftCount).toBe(16);
          |                             ^
      464 |     expect(reminders.match(/bg-accent-soft/g)).toHaveLength(1);
      465 |     expect(docs.match(/bg-accent-soft/g)).toBeNull();
      466 |   });

      at Object.toBe (src/__tests__/consistency-classnames.test.ts:463:29)
```

### Paso 2: E1-a, inventario de acentos verde

Desde `mobile-pet-tracker/`: `bunx jest src/__tests__/consistency-classnames.test.ts src/__tests__/design-drift.test.ts > /tmp/147-e1-a.txt 2>&1; echo "exit=$?"`. Exit 1.

```text
Test Suites: 1 failed, 1 passed, 2 total
Tests:       1 failed, 107 passed, 108 total
Snapshots:   0 total
Time:        2.2 s
Ran all test suites matching /src\/__tests__\/consistency-classnames.test.ts|src\/__tests__\/design-drift.test.ts/i.
```

```text
  ● #87 R19: use-api no deja huella › preserves every mutation sign-out with zero delta

    expect(received).toEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 1

    @@ -5,11 +5,11 @@
        "screens/docs/index.tsx": 0,
        "screens/geofences/index.tsx": 1,
        "screens/health/index.tsx": 0,
        "screens/home/index.tsx": 0,
        "screens/map/index.tsx": 0,
    -   "screens/meal-schedule/index.tsx": 1,
    +   "screens/meal-schedule/index.tsx": 2,
        "screens/pairing/index.tsx": 2,
        "screens/profile/index.tsx": 2,
        "screens/reminders/index.tsx": 1,
        "screens/weight-log/index.tsx": 1,
      }

      521 |     );
      522 |
    > 523 |     expect(actual).toEqual(screenSignOutCalls);
          |                    ^
      524 |   });
      525 | });
      526 |

      at Object.toEqual (src/__tests__/design-drift.test.ts:523:20)
```

### Commit E1-a (R4)

Las cuatro ediciones son las literales de tasks.md; las otras aserciones se conservan. No añade copy a tests.

```text
$ git show --stat HEAD
commit 1526db05d0a478341ab471646fc5f29a35725627
Author: Claude <claude@srv1178023.hstgr.cloud>
Date:   Fri Oct 2 21:40:53 2026 +0000

    test(mobile-meal-schedule-editing): count the meal time controls among accent-soft uses (R4)

 mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts | 7 ++++---
 1 file changed, 4 insertions(+), 3 deletions(-)
exit=0
```

Verificado: un único fichero, consistency-classnames.test.ts.

### Paso 3: E1-b, ambos inventarios verdes

Desde `mobile-pet-tracker/`: `bunx jest src/__tests__/consistency-classnames.test.ts src/__tests__/design-drift.test.ts > /tmp/147-e1-b.txt 2>&1; echo "exit=$?"`. Exit 0.

```text
Test Suites: 2 passed, 2 total
Tests:       108 passed, 108 total
Snapshots:   0 total
Time:        2.315 s
Ran all test suites matching /src\/__tests__\/consistency-classnames.test.ts|src\/__tests__\/design-drift.test.ts/i.
```

### Commit E1-b (R8)

La única edición es la entrada literal de screenSignOutCalls prescrita en tasks.md. No añade copy a tests.

```text
$ git show --stat HEAD
commit e87896288cc1862e5afbc366fcffcc6a79926ba0
Author: Claude <claude@srv1178023.hstgr.cloud>
Date:   Fri Oct 2 21:41:15 2026 +0000

    test(mobile-meal-schedule-editing): count the meal schedule 401 sign-out (R8)

 mobile-pet-tracker/src/__tests__/design-drift.test.ts | 2 +-
 1 file changed, 1 insertion(+), 1 deletion(-)
exit=0
```

Verificado: un único fichero, design-drift.test.ts.

### Paso 4: sondas E1 sobre el verde

Las tres sondas se ejecutan sobre producción temporal; cada una se restaura antes de la siguiente.

#### Sonda E1-a.1: tercer bg-accent-soft en el error

```diff
diff --git a/mobile-pet-tracker/src/screens/meal-schedule/index.tsx b/mobile-pet-tracker/src/screens/meal-schedule/index.tsx
index cb77bf55..314c77eb 100644
--- a/mobile-pet-tracker/src/screens/meal-schedule/index.tsx
+++ b/mobile-pet-tracker/src/screens/meal-schedule/index.tsx
@@ -300,7 +300,7 @@ function MealScheduleContent({ petId }: { petId: string }) {
               );
             })}
             {isOwner && editError !== null ? (
-              <Text testID="meal-time-error" selectable className="text-danger">
+              <Text testID="meal-time-error" selectable className="text-danger bg-accent-soft">
                 {editError}
               </Text>
             ) : null}
```

### Resultado sonda E1-a.1

Desde `mobile-pet-tracker/`: `bunx jest src/__tests__/consistency-classnames.test.ts src/__tests__/design-drift.test.ts src/screens/meal-schedule/index.test.tsx > /tmp/147-e1-probe-accent-extra.txt 2>&1; echo "exit=$?"`. Exit 1.

```text
Test Suites: 2 failed, 1 passed, 3 total
Tests:       12 failed, 147 passed, 159 total
Snapshots:   0 total
Time:        7.8 s, estimated 8 s
Ran all test suites matching /src\/__tests__\/consistency-classnames.test.ts|src\/__tests__\/design-drift.test.ts|src\/screens\/meal-schedule\/index.test.tsx/i.
```

```text
  ● #98 R10: los candados que esta feature no mueve › deja CONTINUOUS_CORNER, bg-accent-soft y el acento donde estaban

    expect(received).toBe(expected) // Object.is equality

    Expected: 18
    Received: 19

      396 |     expect(count(/style=\{CONTINUOUS_CORNER\}/g)).toBe(31 + 1); // #41 R9: geofences-link
      397 |     expect(count(/rounded-xl bg-accent(?=[\s'"`])/g)).toBe(13);
    > 398 |     expect(count(/bg-accent-soft/g)).toBe(16 + 2); // #147 R4: meal-time-edit y add-meal-time-button
          |                                      ^
      399 |     expect(home.match(/text-accent-strong\b/g)).toHaveLength(2);
      400 |     expect(food.match(/text-accent-strong\b/g)).toHaveLength(1);
      401 |     expect(filesMatching(/\brounded-(?:2xl|lg|md|sm)\b/)).toEqual([]);

      at Object.toBe (src/__tests__/consistency-classnames.test.ts:398:38)
```

```text
  ● #64 R9: el color categórico solo se nombra en el módulo de paleta › conserva los usos de bg-accent-soft que sí son acento

    expect(received).toBe(expected) // Object.is equality

    Expected: 18
    Received: 19

      462 |     const docs = readSource(join('screens', 'docs', 'index.tsx'));
      463 |
    > 464 |     expect(accentSoftCount).toBe(16 + 2); // #147 R4
          |                             ^
      465 |     expect(reminders.match(/bg-accent-soft/g)).toHaveLength(1);
      466 |     expect(docs.match(/bg-accent-soft/g)).toBeNull();
      467 |   });

      at Object.toBe (src/__tests__/consistency-classnames.test.ts:464:29)
```

```text
  ● #147 R8: cada error del contrato tiene su mensaje › invalid muestra «La hora no es válida»

    expect(received).toBe(expected) // Object.is equality

    Expected: "text-danger"
    Received: "text-danger bg-accent-soft"

      854 |     const error = screen.getByTestId('meal-time-error');
      855 |     expect(error.props.selectable).toBe(true);
    > 856 |     expect(error.props.className).toBe('text-danger');
          |                                   ^
      857 |     expect(childTestIds(screen.getByTestId('meal-times-section'))).toEqual([undefined, 'meal-time-row-0', 'meal-time-row-1', 'meal-time-error', 'add-meal-time-button']);
      858 |     await waitFor(() => expect(screen.getByTestId('meal-time-edit-0').props.accessibilityState).not.toEqual(expect.objectContaining({ disabled: true })));
      859 |   });

      at toBe (src/screens/meal-schedule/index.test.tsx:856:35)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

```text
  ● #147 R8: cada error del contrato tiene su mensaje › forbidden muestra «Solo el dueño puede cambiar los horarios»

    expect(received).toBe(expected) // Object.is equality

    Expected: "text-danger"
    Received: "text-danger bg-accent-soft"

      854 |     const error = screen.getByTestId('meal-time-error');
      855 |     expect(error.props.selectable).toBe(true);
    > 856 |     expect(error.props.className).toBe('text-danger');
          |                                   ^
      857 |     expect(childTestIds(screen.getByTestId('meal-times-section'))).toEqual([undefined, 'meal-time-row-0', 'meal-time-row-1', 'meal-time-error', 'add-meal-time-button']);
      858 |     await waitFor(() => expect(screen.getByTestId('meal-time-edit-0').props.accessibilityState).not.toEqual(expect.objectContaining({ disabled: true })));
      859 |   });

      at toBe (src/screens/meal-schedule/index.test.tsx:856:35)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

```text
  ● #147 R8: cada error del contrato tiene su mensaje › NUTRITION_PLAN_REQUIRED muestra «Primero genera un plan de alimentación»

    expect(received).toBe(expected) // Object.is equality

    Expected: "text-danger"
    Received: "text-danger bg-accent-soft"

      854 |     const error = screen.getByTestId('meal-time-error');
      855 |     expect(error.props.selectable).toBe(true);
    > 856 |     expect(error.props.className).toBe('text-danger');
          |                                   ^
      857 |     expect(childTestIds(screen.getByTestId('meal-times-section'))).toEqual([undefined, 'meal-time-row-0', 'meal-time-row-1', 'meal-time-error', 'add-meal-time-button']);
      858 |     await waitFor(() => expect(screen.getByTestId('meal-time-edit-0').props.accessibilityState).not.toEqual(expect.objectContaining({ disabled: true })));
      859 |   });

      at toBe (src/screens/meal-schedule/index.test.tsx:856:35)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

```text
  ● #147 R8: cada error del contrato tiene su mensaje › MEAL_TIME_NOT_IN_PLAN muestra «Ese horario ya no está en el plan»

    expect(received).toBe(expected) // Object.is equality

    Expected: "text-danger"
    Received: "text-danger bg-accent-soft"

      854 |     const error = screen.getByTestId('meal-time-error');
      855 |     expect(error.props.selectable).toBe(true);
    > 856 |     expect(error.props.className).toBe('text-danger');
          |                                   ^
      857 |     expect(childTestIds(screen.getByTestId('meal-times-section'))).toEqual([undefined, 'meal-time-row-0', 'meal-time-row-1', 'meal-time-error', 'add-meal-time-button']);
      858 |     await waitFor(() => expect(screen.getByTestId('meal-time-edit-0').props.accessibilityState).not.toEqual(expect.objectContaining({ disabled: true })));
      859 |   });

      at toBe (src/screens/meal-schedule/index.test.tsx:856:35)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

```text
  ● #147 R8: cada error del contrato tiene su mensaje › MEAL_TIME_DUPLICATE muestra «Ya hay una comida a esa hora»

    expect(received).toBe(expected) // Object.is equality

    Expected: "text-danger"
    Received: "text-danger bg-accent-soft"

      854 |     const error = screen.getByTestId('meal-time-error');
      855 |     expect(error.props.selectable).toBe(true);
    > 856 |     expect(error.props.className).toBe('text-danger');
          |                                   ^
      857 |     expect(childTestIds(screen.getByTestId('meal-times-section'))).toEqual([undefined, 'meal-time-row-0', 'meal-time-row-1', 'meal-time-error', 'add-meal-time-button']);
      858 |     await waitFor(() => expect(screen.getByTestId('meal-time-edit-0').props.accessibilityState).not.toEqual(expect.objectContaining({ disabled: true })));
      859 |   });

      at toBe (src/screens/meal-schedule/index.test.tsx:856:35)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

```text
  ● #147 R8: cada error del contrato tiene su mensaje › MEAL_TIMES_LIMIT_REACHED muestra «El plan ya tiene el máximo de 6 comidas»

    expect(received).toBe(expected) // Object.is equality

    Expected: "text-danger"
    Received: "text-danger bg-accent-soft"

      854 |     const error = screen.getByTestId('meal-time-error');
      855 |     expect(error.props.selectable).toBe(true);
    > 856 |     expect(error.props.className).toBe('text-danger');
          |                                   ^
      857 |     expect(childTestIds(screen.getByTestId('meal-times-section'))).toEqual([undefined, 'meal-time-row-0', 'meal-time-row-1', 'meal-time-error', 'add-meal-time-button']);
      858 |     await waitFor(() => expect(screen.getByTestId('meal-time-edit-0').props.accessibilityState).not.toEqual(expect.objectContaining({ disabled: true })));
      859 |   });

      at toBe (src/screens/meal-schedule/index.test.tsx:856:35)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

```text
  ● #147 R8: cada error del contrato tiene su mensaje › unreachable muestra «No se pudo conectar con el servidor»

    expect(received).toBe(expected) // Object.is equality

    Expected: "text-danger"
    Received: "text-danger bg-accent-soft"

      854 |     const error = screen.getByTestId('meal-time-error');
      855 |     expect(error.props.selectable).toBe(true);
    > 856 |     expect(error.props.className).toBe('text-danger');
          |                                   ^
      857 |     expect(childTestIds(screen.getByTestId('meal-times-section'))).toEqual([undefined, 'meal-time-row-0', 'meal-time-row-1', 'meal-time-error', 'add-meal-time-button']);
      858 |     await waitFor(() => expect(screen.getByTestId('meal-time-edit-0').props.accessibilityState).not.toEqual(expect.objectContaining({ disabled: true })));
      859 |   });

      at toBe (src/screens/meal-schedule/index.test.tsx:856:35)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

```text
  ● #147 R8: cada error del contrato tiene su mensaje › error muestra «Algo salió mal»

    expect(received).toBe(expected) // Object.is equality

    Expected: "text-danger"
    Received: "text-danger bg-accent-soft"

      854 |     const error = screen.getByTestId('meal-time-error');
      855 |     expect(error.props.selectable).toBe(true);
    > 856 |     expect(error.props.className).toBe('text-danger');
          |                                   ^
      857 |     expect(childTestIds(screen.getByTestId('meal-times-section'))).toEqual([undefined, 'meal-time-row-0', 'meal-time-row-1', 'meal-time-error', 'add-meal-time-button']);
      858 |     await waitFor(() => expect(screen.getByTestId('meal-time-edit-0').props.accessibilityState).not.toEqual(expect.objectContaining({ disabled: true })));
      859 |   });

      at toBe (src/screens/meal-schedule/index.test.tsx:856:35)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

```text
  ● #147 R8: cada error del contrato tiene su mensaje › missing-config muestra «Algo salió mal»

    expect(received).toBe(expected) // Object.is equality

    Expected: "text-danger"
    Received: "text-danger bg-accent-soft"

      854 |     const error = screen.getByTestId('meal-time-error');
      855 |     expect(error.props.selectable).toBe(true);
    > 856 |     expect(error.props.className).toBe('text-danger');
          |                                   ^
      857 |     expect(childTestIds(screen.getByTestId('meal-times-section'))).toEqual([undefined, 'meal-time-row-0', 'meal-time-row-1', 'meal-time-error', 'add-meal-time-button']);
      858 |     await waitFor(() => expect(screen.getByTestId('meal-time-edit-0').props.accessibilityState).not.toEqual(expect.objectContaining({ disabled: true })));
      859 |   });

      at toBe (src/screens/meal-schedule/index.test.tsx:856:35)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

```text
  ● #147 R8: cada error del contrato tiene su mensaje › rechazo muestra «Algo salió mal»

    expect(received).toBe(expected) // Object.is equality

    Expected: "text-danger"
    Received: "text-danger bg-accent-soft"

      854 |     const error = screen.getByTestId('meal-time-error');
      855 |     expect(error.props.selectable).toBe(true);
    > 856 |     expect(error.props.className).toBe('text-danger');
          |                                   ^
      857 |     expect(childTestIds(screen.getByTestId('meal-times-section'))).toEqual([undefined, 'meal-time-row-0', 'meal-time-row-1', 'meal-time-error', 'add-meal-time-button']);
      858 |     await waitFor(() => expect(screen.getByTestId('meal-time-edit-0').props.accessibilityState).not.toEqual(expect.objectContaining({ disabled: true })));
      859 |   });

      at toBe (src/screens/meal-schedule/index.test.tsx:856:35)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

Caen exactamente #98 R10 y #64 R9 (Expected 18, Received 19) y las diez filas de R8 (Expected text-danger, Received text-danger bg-accent-soft), como prescribe E1-a.

```text
$ git checkout HEAD -- mobile-pet-tracker/src/screens/meal-schedule/index.tsx
exit=0
$ git diff --cached --stat
(salida vacía)
exit=0
```

#### Sonda E1-a.2: quitar bg-accent-soft de Añadir comida

```diff
diff --git a/mobile-pet-tracker/src/screens/meal-schedule/index.tsx b/mobile-pet-tracker/src/screens/meal-schedule/index.tsx
index cb77bf55..6feb6f5e 100644
--- a/mobile-pet-tracker/src/screens/meal-schedule/index.tsx
+++ b/mobile-pet-tracker/src/screens/meal-schedule/index.tsx
@@ -309,7 +309,7 @@ function MealScheduleContent({ petId }: { petId: string }) {
                 testID="add-meal-time-button"
                 isDisabled={editing}
                 variant="secondary"
-                className="rounded-xl bg-accent-soft"
+                className="rounded-xl"
                 onPress={() => setPicker({ from: null })}
               >
                 <Button.Label className="font-bold text-accent-strong">
```

### Resultado sonda E1-a.2

Desde `mobile-pet-tracker/`: `bunx jest src/__tests__/consistency-classnames.test.ts src/__tests__/design-drift.test.ts src/screens/meal-schedule/index.test.tsx > /tmp/147-e1-probe-accent-remove.txt 2>&1; echo "exit=$?"`. Exit 1.

```text
Test Suites: 2 failed, 1 passed, 3 total
Tests:       3 failed, 156 passed, 159 total
Snapshots:   0 total
Time:        7.362 s, estimated 8 s
Ran all test suites matching /src\/__tests__\/consistency-classnames.test.ts|src\/__tests__\/design-drift.test.ts|src\/screens\/meal-schedule\/index.test.tsx/i.
```

```text
  ● #98 R10: los candados que esta feature no mueve › deja CONTINUOUS_CORNER, bg-accent-soft y el acento donde estaban

    expect(received).toBe(expected) // Object.is equality

    Expected: 18
    Received: 17

      396 |     expect(count(/style=\{CONTINUOUS_CORNER\}/g)).toBe(31 + 1); // #41 R9: geofences-link
      397 |     expect(count(/rounded-xl bg-accent(?=[\s'"`])/g)).toBe(13);
    > 398 |     expect(count(/bg-accent-soft/g)).toBe(16 + 2); // #147 R4: meal-time-edit y add-meal-time-button
          |                                      ^
      399 |     expect(home.match(/text-accent-strong\b/g)).toHaveLength(2);
      400 |     expect(food.match(/text-accent-strong\b/g)).toHaveLength(1);
      401 |     expect(filesMatching(/\brounded-(?:2xl|lg|md|sm)\b/)).toEqual([]);

      at Object.toBe (src/__tests__/consistency-classnames.test.ts:398:38)
```

```text
  ● #64 R9: el color categórico solo se nombra en el módulo de paleta › conserva los usos de bg-accent-soft que sí son acento

    expect(received).toBe(expected) // Object.is equality

    Expected: 18
    Received: 17

      462 |     const docs = readSource(join('screens', 'docs', 'index.tsx'));
      463 |
    > 464 |     expect(accentSoftCount).toBe(16 + 2); // #147 R4
          |                             ^
      465 |     expect(reminders.match(/bg-accent-soft/g)).toHaveLength(1);
      466 |     expect(docs.match(/bg-accent-soft/g)).toBeNull();
      467 |   });

      at Object.toBe (src/__tests__/consistency-classnames.test.ts:464:29)
```

```text
  ● #147 R4: solo el owner ve Editar y Añadir comida › el owner ve Editar en cada fila y Añadir comida bajo la lista

    expect(received).toEqual(expected) // deep equality

    Expected: ArrayContaining ["rounded-xl", "bg-accent-soft"]
    Received: ["pressable-feedback__root", "button__root", "button__root--variant-secondary", "button__root--size-md", "rounded-xl"]

      571 |     const add = screen.getByTestId('add-meal-time-button');
      572 |     expect(within(add).getByText('Añadir comida')).toBeVisible();
    > 573 |     expect(add.props.className.split(' ')).toEqual(expect.arrayContaining(['rounded-xl', 'bg-accent-soft']));
          |                                            ^
      574 |     expect(within(add).getByText('Añadir comida').props.className.split(' ')).toEqual(expect.arrayContaining(['font-bold', 'text-accent-strong']));
      575 |   });
      576 |

      at Object.toEqual (src/screens/meal-schedule/index.test.tsx:573:44)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

Caen exactamente #98 R10 y #64 R9 (Expected 18, Received 17) y el it owner de #147 R4 por la clase ausente, como prescribe E1-a.

```text
$ git checkout HEAD -- mobile-pet-tracker/src/screens/meal-schedule/index.tsx
exit=0
$ git diff --cached --stat
(salida vacía)
exit=0
```

#### Sonda E1-b.1: quitar signOut del 401 de editar franjas

```diff
diff --git a/mobile-pet-tracker/src/screens/meal-schedule/index.tsx b/mobile-pet-tracker/src/screens/meal-schedule/index.tsx
index cb77bf55..1dac1832 100644
--- a/mobile-pet-tracker/src/screens/meal-schedule/index.tsx
+++ b/mobile-pet-tracker/src/screens/meal-schedule/index.tsx
@@ -122,7 +122,6 @@ function MealScheduleContent({ petId }: { petId: string }) {
           }
           return;
         case 'unauthorized':
-          await signOut();
           return;
         case 'unreachable':
           setEditError(t('common.cannotReachServer'));
```

### Resultado sonda E1-b.1

Desde `mobile-pet-tracker/`: `bunx jest src/__tests__/consistency-classnames.test.ts src/__tests__/design-drift.test.ts src/screens/meal-schedule/index.test.tsx > /tmp/147-e1-probe-signout.txt 2>&1; echo "exit=$?"`. Exit 1.

```text
Test Suites: 2 failed, 1 passed, 3 total
Tests:       2 failed, 157 passed, 159 total
Snapshots:   0 total
Time:        8.637 s
Ran all test suites matching /src\/__tests__\/consistency-classnames.test.ts|src\/__tests__\/design-drift.test.ts|src\/screens\/meal-schedule\/index.test.tsx/i.
```

```text
  ● #87 R19: use-api no deja huella › preserves every mutation sign-out with zero delta

    expect(received).toEqual(expected) // deep equality

    - Expected  - 1
    + Received  + 1

    @@ -5,11 +5,11 @@
        "screens/docs/index.tsx": 0,
        "screens/geofences/index.tsx": 1,
        "screens/health/index.tsx": 0,
        "screens/home/index.tsx": 0,
        "screens/map/index.tsx": 0,
    -   "screens/meal-schedule/index.tsx": 2,
    +   "screens/meal-schedule/index.tsx": 1,
        "screens/pairing/index.tsx": 2,
        "screens/profile/index.tsx": 2,
        "screens/reminders/index.tsx": 1,
        "screens/weight-log/index.tsx": 1,
      }

      521 |     );
      522 |
    > 523 |     expect(actual).toEqual(screenSignOutCalls);
          |                    ^
      524 |   });
      525 | });
      526 |

      at Object.toEqual (src/__tests__/design-drift.test.ts:523:20)
```

```text
  ● #147 R8: cada error del contrato tiene su mensaje › 401 cierra sesión sin mensaje

    expect(jest.fn()).toHaveBeenCalledTimes(expected)

    Expected number of calls: 1
    Received number of calls: 0

      866 |     await fireEvent.press(await screen.findByTestId('meal-time-edit-1'));
      867 |     await fireEvent(screen.getByTestId('meal-time-picker'), 'onValueChange', {}, new Date(2026, 9, 2, 20, 5));
    > 868 |     await waitFor(() => {
          |                  ^
      869 |       expect(signOut).toHaveBeenCalledTimes(1);
      870 |       expect(screen.getByTestId('meal-time-edit-0').props.accessibilityState).not.toEqual(expect.objectContaining({ disabled: true }));
      871 |     });

      at Object.<anonymous> (src/screens/meal-schedule/index.test.tsx:868:18)
      at asyncGeneratorStep (node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:17)
      at _next (node_modules/@babel/runtime/helpers/asyncToGenerator.js:17:9)
```

Caen exactamente #87 R19 (meal-schedule Expected 2, Received 1) y #147 R8 «401 cierra sesión sin mensaje» (Expected 1 llamada, Received 0), como prescribe E1-b.

```text
$ git checkout HEAD -- mobile-pet-tracker/src/screens/meal-schedule/index.tsx
exit=0
$ git diff --cached --stat
(salida vacía)
exit=0
```

Se ejecutaron las tres sondas de E1. No queda ninguna omitida; el índice está vacío y producción coincide con el verde anterior a E1.

### Paso 5: §Cierre completo, en orden

```sh
pgrep -af 'init\.sh|test:e2e|jest-e2e' | grep -v pgrep > /tmp/147-e1-close-pgrep.txt 2>&1; echo "exit=$?"
```

```text
(salida vacía)
exit=1
```

El exit 1 de grep significa que no hay procesos coincidentes; se cumple el gate previo. Es la tubería de inspección prescrita por tasks.md, no una medición de tests a través de tail.

### Cierre: bun run test

Desde `mobile-pet-tracker/`: `bun run test > /tmp/147-e1-close-test.txt 2>&1; echo "exit=$?"`. Exit 0.

```text
Test Suites: 88 passed, 88 total
Tests:       1759 passed, 1759 total
Snapshots:   1 passed, 1 total
Time:        40.263 s, estimated 41 s
Ran all test suites.
```

#### Cierre: bun run lint

```sh
bun run lint > /tmp/147-e1-close-lint.txt 2>&1; echo "exit=$?"
```

Exit 0. Sin errores ni avisos de lint.

```text
$ expo lint
```

#### Cierre: typecheck con guarda de router

```sh
test ! -e .expo/types/router.d.ts && bun run typecheck > /tmp/147-e1-close-typecheck.txt 2>&1; echo "exit=$?"
```

Exit 0: la guarda confirma que router.d.ts no existe; tsc no informa errores.

```text
$ tsc --noEmit
```

#### Cierre: los tres grep-clean

Desde mobile-pet-tracker/, usando H0 = b367ed44.

```sh
git diff b367ed44 -- src/screens/meal-schedule/index.tsx src/api/nutrition.ts | grep '^+' | grep -nE "#[0-9a-fA-F]{3,8}\b|className=\"[^\"]*\[|StyleSheet\.create|rounded-(2xl|lg|md|sm)\b|elevation|shadow(Color|Offset|Opacity|Radius)" > /tmp/147-e1-close-grep-ui.txt 2>&1; echo "exit=$?"
```

```text
(salida vacía)
exit=1
```

```sh
git diff b367ed44 -- src/screens/meal-schedule/index.tsx | grep -nE "^[-+].*(contentContainerStyle|padding: 24|gap: 16|insets\.bottom \+ 24)" > /tmp/147-e1-close-grep-dimensions.txt 2>&1; echo "exit=$?"
```

```text
(salida vacía)
exit=1
```

```sh
git diff b367ed44 --stat -- package.json bun.lock > /tmp/147-e1-close-grep-deps.txt 2>&1; echo "exit=$?"
```

```text
(salida vacía)
exit=0
```

Los dos grep terminan con exit 1 porque no encuentran coincidencias; ambas salidas están vacías. El diff de dependencias termina con exit 0 y salida vacía. Cumplen los tres gates: tokens, dimensiones y dependencias. Son las tuberías literales prescritas de §Cierre paso 2.

El cierre técnico está verde: test 88/1759, lint y typecheck con exit 0, sin dependencias nuevas. E1 resuelve la parada previa y amplía la lista propia a trece ficheros. La prueba de humo Android sigue reservada al humano; no se marca. init.sh lo ejecutará el leader según el handoff.

### Paso 6: trazabilidad y lista de commits propios

traceability.md contiene R1-R9 con sus tests y los dos hashes/mensajes del par C4. R4 añade `1526db05` (E1-a); R8 añade `e8789628` (E1-b). Se citan los dos refactors y la sonda de vía (b) de R7. Ninguna fila queda pendiente.

```text
0cbb155e test(mobile-meal-schedule-editing): lock nine meal schedule editing catalog keys (R1)
a131c0cc feat(mobile-meal-schedule-editing): add meal schedule editing copy in es and en (R1)
f559d77a test(mobile-meal-schedule-editing): lock addMealTime request and state mapping (R2)
35ed6ada feat(mobile-meal-schedule-editing): add addMealTime api client (R2)
befe2220 test(mobile-meal-schedule-editing): lock moveMealTime request and state mapping (R3)
0438799b feat(mobile-meal-schedule-editing): add moveMealTime api client (R3)
9c88290b test(mobile-meal-schedule-editing): lock owner-only meal time controls (R4)
3c497607 feat(mobile-meal-schedule-editing): show edit and add meal controls to owners (R4)
4a9c91d5 test(mobile-meal-schedule-editing): lock edit time picker and PATCH call (R5)
fc2c792a feat(mobile-meal-schedule-editing): edit a meal time with the native time picker (R5)
2860d495 test(mobile-meal-schedule-editing): lock add meal picker and POST call (R6)
fd48f9c3 feat(mobile-meal-schedule-editing): add a meal time with the native time picker (R6)
13363d1b test(mobile-meal-schedule-editing): lock refetch after success without optimistic state (R7)
a6a85313 feat(mobile-meal-schedule-editing): refetch plan and pet after a meal time edit (R7)
b343c919 test(mobile-meal-schedule-editing): lock meal time edit error messages (R8)
3d79a82c feat(mobile-meal-schedule-editing): show inline errors for meal time edits (R8)
f134d9d4 test(mobile-meal-schedule-editing): lock meal schedule editing copy registration (R9)
ddd0ba67 feat(mobile-meal-schedule-editing): register meal schedule editing copy uses (R9)
2c873c47 refactor(mobile-meal-schedule-editing): apply picker test timezone to Node process (R5,R6)
b5d46054 refactor(mobile-meal-schedule-editing): match language spec table format (R1)
1526db05 test(mobile-meal-schedule-editing): count the meal time controls among accent-soft uses (R4)
e8789628 test(mobile-meal-schedule-editing): count the meal schedule 401 sign-out (R8)
HEAD docs(mobile-meal-schedule-editing): fill #147 traceability
```

Son 23 commits propios al incluir el único commit de docs que contiene este informe: 18 C4, 2 refactors, E1-a, E1-b y docs. El último se identifica con HEAD porque su hash depende de este propio archivo; se obtiene con `git log -1 --format="%h %s"` tras crear el commit. Los hashes de los 22 commits anteriores son literales, contrastados con git log, y no se rebasean.

Los commits del leader `98cc1154` y `d8edb20e` se excluyen del recuento propio. Las rutas de todos los commits propios, incluidas las dos del cierre, coinciden exactamente con los trece ficheros de design.md §Archivos afectados:

```text
mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts
mobile-pet-tracker/src/__tests__/design-drift.test.ts
mobile-pet-tracker/src/__tests__/ui-copy-table.ts
mobile-pet-tracker/src/__tests__/ui-language.test.ts
mobile-pet-tracker/src/api/__tests__/nutrition.test.ts
mobile-pet-tracker/src/api/nutrition.ts
mobile-pet-tracker/src/i18n/catalog.ts
mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx
mobile-pet-tracker/src/screens/meal-schedule/index.test.tsx
mobile-pet-tracker/src/screens/meal-schedule/index.tsx
progress/impl_mobile-meal-schedule-editing.md
specs/mobile-meal-schedule-editing/traceability.md
specs/mobile-ui-language/design.md
```

`git diff d8edb20e HEAD -- mobile-pet-tracker/src/screens/meal-schedule/index.tsx mobile-pet-tracker/src/api/nutrition.ts` sale vacío: la reanudación no cambia producción. Las mutaciones de las sondas se restauraron.

### Diff completo desde H0 y atribución

Inventario completo de `git diff --name-only b367ed44..HEAD` al cerrar el commit de docs. Para incluir el propio informe y traceability sin crear otro commit, se obtuvo desde el árbol preparado con `git diff --name-only b367ed44` (exit 0); después del commit se contrasta la salida de H0..HEAD contra este inventario, sin modificar ni rebasear los documentos.

```text
mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts
mobile-pet-tracker/src/__tests__/design-drift.test.ts
mobile-pet-tracker/src/__tests__/ui-copy-table.ts
mobile-pet-tracker/src/__tests__/ui-language.test.ts
mobile-pet-tracker/src/api/__tests__/nutrition.test.ts
mobile-pet-tracker/src/api/nutrition.ts
mobile-pet-tracker/src/i18n/catalog.ts
mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx
mobile-pet-tracker/src/screens/meal-schedule/index.test.tsx
mobile-pet-tracker/src/screens/meal-schedule/index.tsx
progress/current.md
progress/handoff_mobile-meal-schedule-editing.md
progress/impl_mobile-meal-schedule-editing.md
specs/mobile-meal-schedule-editing/design.md
specs/mobile-meal-schedule-editing/requirements.md
specs/mobile-meal-schedule-editing/tasks.md
specs/mobile-meal-schedule-editing/traceability.md
specs/mobile-ui-language/design.md
```

Son 18 rutas: 13 de commits propios y estas cinco exclusivamente del leader (`98cc1154` y/o `d8edb20e`), que no cuentan como propias:

- `specs/mobile-meal-schedule-editing/requirements.md`
- `specs/mobile-meal-schedule-editing/design.md`
- `specs/mobile-meal-schedule-editing/tasks.md`
- `progress/current.md`
- `progress/handoff_mobile-meal-schedule-editing.md`

No se tocaron las cinco rutas del leader durante la implementación ni la reanudación. El commit final de docs incluye solo traceability.md y este informe. La comprobación posterior al commit debe confirmar 23 commits propios, 13 rutas propias, este diff completo y worktree limpio.

### Decisiones de Reanudación 1

No se toman decisiones de producto nuevas. Se aplican únicamente las ediciones literales de E1-a y E1-b. E1.2 ratifica la preparación TZ autorizada, sin introducir cambios adicionales. Se conservan los mensajes, el conteo de tests y la producción. La prueba de humo no se ejecuta ni se marca; init.sh, push y PR quedan a cargo del leader según el handoff.

## Reanudación 2

2026-10-02. Enmienda E2 aprobada por humano y firmada por el leader en `f26f85fd`, después de la trazabilidad `d05d8725`. H0 permanece en `b367ed44`. Se aplican únicamente E2-a y E2-b, vía (b) de C4, y su documentación. Los comandos móviles se ejecutan desde `/home/claude/sites/Pet-Tracker/mobile-pet-tracker`, sin pipes.

### Paso 0: identidad y estado inicial

```text
$ pwd
/home/claude/sites/Pet-Tracker
$ git branch --show-current
feature/147-mobile-meal-schedule-editing
$ git rev-parse --short HEAD
f26f85fd
$ git rev-parse --short HEAD~1
d05d8725
$ git status --short
(salida vacía)
```

Las cinco comprobaciones terminan con exit 0. Se cumplen las tres condiciones de arranque: branch correcta, padre d05d8725 y árbol limpio. Ningún commit previo se rebasea ni se enmienda.

Lecturas: requirements.md §Enmienda E2 (casilla humana marcada), tasks.md §Enmienda E2, §Esperas y §Cierre, review §Observaciones 1 y handoff original y §Reanudación 2; además, arquitectura, convenciones, carta de UI y verificación. El informe anterior conserva las decisiones y evidencia de la implementación original y de E1.

Skills cargadas de verdad en esta reanudación:

- `/home/claude/.codex/plugins/cache/ponytail/ponytail/4.10.0/skills/ponytail/SKILL.md` (full).
- `/home/claude/.codex/plugins/cache/openai-curated/expo/11c74d6b/skills/building-native-ui/SKILL.md`.
- `/home/claude/.codex/plugins/cache/openai-curated/expo/11c74d6b/skills/native-data-fetching/SKILL.md`.
- `/home/claude/.codex/plugins/cache/openai-curated/expo/11c74d6b/skills/expo-ui-jetpack-compose/SKILL.md`.
- `.agents/skills/appllama-app-design-skill/SKILL.md`.

Se consultó también la [referencia versionada de Expo SDK 57](https://docs.expo.dev/versions/v57.0.0/), como pide mobile-pet-tracker/AGENTS.md. La carta y el handoff rigen el alcance: sin cambios permanentes de producción y sin estado optimista; smoke Android reservado al humano.

### Paso 1: base verde

```sh
bunx jest src/screens/meal-schedule > /tmp/147-e2-base.txt 2>&1; echo "exit=$?"
```

```text
Test Suites: 1 passed, 1 total
Tests:       51 passed, 51 total
Snapshots:   0 total
Time:        7.872 s, estimated 8 s
Ran all test suites matching /src\/screens\/meal-schedule/i.
exit=0
```

### Paso 2: E2-a, ningún refetch tras error

```sh
bunx jest src/screens/meal-schedule > /tmp/147-e2-a.txt 2>&1; echo "exit=$?"
```

```text
Test Suites: 1 passed, 1 total
Tests:       51 passed, 51 total
Snapshots:   0 total
Time:        12.264 s
Ran all test suites matching /src\/screens\/meal-schedule/i.
exit=0
```

Se localizaron por contenido las diez filas del it.each de R8 y el 401. En los dos sitios se añadieron literalmente, después de la espera final sobre meal-time-edit-0, las dos líneas de tasks.md E2-a:

```ts
    expect(mockGetNutritionPlan).toHaveBeenCalledTimes(1); // #147 E2.2: ningún refetch si no es ok
    expect(mockGetPet).toHaveBeenCalledTimes(1);
```

No se movió ninguna aserción ni se introdujo copy. El recuento permanece en 51/51; la premisa de E2-a se cumple.

```sh
git add -- mobile-pet-tracker/src/screens/meal-schedule/index.test.tsx
git commit -m 'test(mobile-meal-schedule-editing): lock no refetch on every failed meal time edit (R7)'
git show --stat HEAD > /tmp/147-e2-a-stat.txt 2>&1; echo "exit=$?"
```

```text
commit e277b8102c4f1cb84a8c6736b7ac2aa8a42a4b33
Author: Claude <claude@srv1178023.hstgr.cloud>
Date:   Fri Oct 2 23:10:32 2026 +0000

    test(mobile-meal-schedule-editing): lock no refetch on every failed meal time edit (R7)

 mobile-pet-tracker/src/screens/meal-schedule/index.test.tsx | 4 ++++
 1 file changed, 4 insertions(+)
exit=0
```

El commit `e277b810` contiene un solo fichero. El status posterior queda vacío.

### Paso 3: E2-b, R7 sobre Añadir

```sh
bunx jest src/screens/meal-schedule > /tmp/147-e2-b.txt 2>&1; echo "exit=$?"
```

```text
Test Suites: 1 passed, 1 total
Tests:       54 passed, 54 total
Snapshots:   0 total
Time:        7.476 s, estimated 13 s
Ran all test suites matching /src\/screens\/meal-schedule/i.
exit=0
```

Se insertaron los tres it literales de tasks.md E2-b al final del describe de R7, después de «un resultado que no es ok no refetchea». Se comprobó por igualdad de texto que el bloque coincide con el prescrito. Mantiene las esperas conjuntas, las ausencias ancladas en nodos observados y las esperas de cierre. No añade copy nueva. La suite pasa de 51 a 54 tests.

```sh
git add -- mobile-pet-tracker/src/screens/meal-schedule/index.test.tsx
git commit -m 'test(mobile-meal-schedule-editing): lock refetch and disabled controls for added meal times (R7)'
git show --stat HEAD > /tmp/147-e2-b-stat.txt 2>&1; echo "exit=$?"
```

```text
commit bf81642ab16907d02c3384e8f36532fadbcb3a72
Author: Claude <claude@srv1178023.hstgr.cloud>
Date:   Fri Oct 2 23:11:10 2026 +0000

    test(mobile-meal-schedule-editing): lock refetch and disabled controls for added meal times (R7)

 .../src/screens/meal-schedule/index.test.tsx       | 55 ++++++++++++++++++++++
 1 file changed, 55 insertions(+)
exit=0
```

El commit `bf81642a` contiene un solo fichero. El status posterior queda vacío. Entre ambos commits se añaden 59 líneas al test y ninguna a producción.

### Paso 4: las 13 sondas y el control, por separado sobre el verde

Cada sonda parte de HEAD `bf81642a` limpio y modifica temporalmente solo src/screens/meal-schedule/index.tsx. Después de cada ejecución se usa esta restauración, desde mobile-pet-tracker/:

```sh
git checkout HEAD -- src/screens/meal-schedule/index.tsx
git diff --cached --stat
git status --short
```

Las salidas y los códigos se registraron para cada sonda en `/tmp/147-e2-probe-<n>-restore.txt`, `-cached.txt` y `-status.txt`. Las tres salidas son vacías, con exit 0, en todas las sondas. Se contrastó cada lista de it rojos, la cifra de fallos y el matcher con la tabla de E2. Ninguna caída se produce por consulta «Unable to find».

#### Sonda 1: Añadido optimista antes de addMealTime, con rollback al snapshot

```diff
diff --git a/mobile-pet-tracker/src/screens/meal-schedule/index.tsx b/mobile-pet-tracker/src/screens/meal-schedule/index.tsx
index cb77bf55..2e0dec35 100644
--- a/mobile-pet-tracker/src/screens/meal-schedule/index.tsx
+++ b/mobile-pet-tracker/src/screens/meal-schedule/index.tsx
@@ -330,7 +330,23 @@ function MealScheduleContent({ petId }: { petId: string }) {
                   setPicker(null);
                   const mealTime = toMealTime(selected);
                   if (from === null) {
-                    void runMealTimeEdit(() => addMealTime(baseUrl, token ?? '', petId, mealTime));
+                    const snapshot = queryClient.getQueryData<NutritionPlanState>(nutritionKeys.plan(petId));
+                    if (snapshot?.kind === 'ok') {
+                      queryClient.setQueryData(nutritionKeys.plan(petId), {
+                        ...snapshot,
+                        plan: { ...snapshot.plan, mealTimes: [...snapshot.plan.mealTimes, mealTime].sort() },
+                      });
+                    }
+                    void runMealTimeEdit(async () => {
+                      try {
+                        const result = await addMealTime(baseUrl, token ?? '', petId, mealTime);
+                        if (result.kind !== 'ok') queryClient.setQueryData(nutritionKeys.plan(petId), snapshot);
+                        return result;
+                      } catch (error) {
+                        queryClient.setQueryData(nutritionKeys.plan(petId), snapshot);
+                        throw error;
+                      }
+                    });
                   } else if (mealTime !== from) {
                     void runMealTimeEdit(() => moveMealTime(baseUrl, token ?? '', petId, from, mealTime));
                   }
```

```sh
bunx jest src/screens/meal-schedule > /tmp/147-e2-probe-1.txt 2>&1; echo "exit=$?"
```

```text
  ● #147 R7: tras un éxito refetchea plan y mascota, sin estado optimista › mientras Añadir vuela, todos los controles están deshabilitados y no aparece la fila nueva
  ● #147 R7: tras un éxito refetchea plan y mascota, sin estado optimista › tras ok de Añadir los controles siguen deshabilitados y sin fila nueva hasta que termina el refetch
Test Suites: 1 failed, 1 total
Tests:       2 failed, 52 passed, 54 total
Snapshots:   0 total
Time:        7.316 s, estimated 8 s
Ran all test suites matching /src\/screens\/meal-schedule/i.
exit=1
```

E2-b it 2 e it 3: por matcher `toBeNull()` sobre `queryByTestId('meal-time-row-2')`; reciben una fila host en vez de null. El rollback cubre tanto kind no ok como rechazo.

Restauración desde HEAD: exit 0 y salida vacía; `git diff --cached --stat`: exit 0 y vacío; `git status --short`: exit 0 y vacío. Coinciden exactamente los it y el modo prescritos.

#### Sonda 2: Rehabilitar justo después de lanzar runMealTimeEdit para Añadir

```diff
diff --git a/mobile-pet-tracker/src/screens/meal-schedule/index.tsx b/mobile-pet-tracker/src/screens/meal-schedule/index.tsx
index cb77bf55..4c0f4ca3 100644
--- a/mobile-pet-tracker/src/screens/meal-schedule/index.tsx
+++ b/mobile-pet-tracker/src/screens/meal-schedule/index.tsx
@@ -331,6 +331,7 @@ function MealScheduleContent({ petId }: { petId: string }) {
                   const mealTime = toMealTime(selected);
                   if (from === null) {
                     void runMealTimeEdit(() => addMealTime(baseUrl, token ?? '', petId, mealTime));
+                    setEditing(false);
                   } else if (mealTime !== from) {
                     void runMealTimeEdit(() => moveMealTime(baseUrl, token ?? '', petId, from, mealTime));
                   }
```

```sh
bunx jest src/screens/meal-schedule > /tmp/147-e2-probe-2.txt 2>&1; echo "exit=$?"
```

```text
  ● #147 R7: tras un éxito refetchea plan y mascota, sin estado optimista › mientras Añadir vuela, todos los controles están deshabilitados y no aparece la fila nueva
  ● #147 R7: tras un éxito refetchea plan y mascota, sin estado optimista › tras ok de Añadir los controles siguen deshabilitados y sin fila nueva hasta que termina el refetch
Test Suites: 1 failed, 1 total
Tests:       2 failed, 52 passed, 54 total
Snapshots:   0 total
Time:        8.83 s
Ran all test suites matching /src\/screens\/meal-schedule/i.
exit=1
```

E2-b it 2 e it 3: por matcher `toEqual(expect.objectContaining({ disabled: true }))` en sus waitFor; reciben controles habilitados.

Restauración desde HEAD: exit 0 y salida vacía; `git diff --cached --stat`: exit 0 y vacío; `git status --short`: exit 0 y vacío. Coinciden exactamente los it y el modo prescritos.

#### Sonda 3: addMealTime fuera de runMealTimeEdit, delegando solo errores y rechazos

```diff
diff --git a/mobile-pet-tracker/src/screens/meal-schedule/index.tsx b/mobile-pet-tracker/src/screens/meal-schedule/index.tsx
index cb77bf55..d3a4a9d8 100644
--- a/mobile-pet-tracker/src/screens/meal-schedule/index.tsx
+++ b/mobile-pet-tracker/src/screens/meal-schedule/index.tsx
@@ -330,7 +330,11 @@ function MealScheduleContent({ petId }: { petId: string }) {
                   setPicker(null);
                   const mealTime = toMealTime(selected);
                   if (from === null) {
-                    void runMealTimeEdit(() => addMealTime(baseUrl, token ?? '', petId, mealTime));
+                    void addMealTime(baseUrl, token ?? '', petId, mealTime)
+                      .then((result) => {
+                        if (result.kind !== 'ok') void runMealTimeEdit(() => Promise.resolve(result));
+                      })
+                      .catch((error) => { void runMealTimeEdit(() => Promise.reject(error)); });
                   } else if (mealTime !== from) {
                     void runMealTimeEdit(() => moveMealTime(baseUrl, token ?? '', petId, from, mealTime));
                   }
```

```sh
bunx jest src/screens/meal-schedule > /tmp/147-e2-probe-3.txt 2>&1; echo "exit=$?"
```

```text
  ● #147 R7: tras un éxito refetchea plan y mascota, sin estado optimista › tras ok de Añadir refetchea el plan y el detalle de la mascota y repinta con la fila nueva
  ● #147 R7: tras un éxito refetchea plan y mascota, sin estado optimista › mientras Añadir vuela, todos los controles están deshabilitados y no aparece la fila nueva
  ● #147 R7: tras un éxito refetchea plan y mascota, sin estado optimista › tras ok de Añadir los controles siguen deshabilitados y sin fila nueva hasta que termina el refetch
Test Suites: 1 failed, 1 total
Tests:       3 failed, 51 passed, 54 total
Snapshots:   0 total
Time:        10.703 s
Ran all test suites matching /src\/screens\/meal-schedule/i.
exit=1
```

E2-b it 1: por matcher `not.toBeNull()` sobre la hora 08:05 de la fila 1; recibe null. E2-b it 2 e it 3: por matcher de `disabled: true` en sus waitFor; reciben controles habilitados.

Restauración desde HEAD: exit 0 y salida vacía; `git diff --cached --stat`: exit 0 y vacío; `git status --short`: exit 0 y vacío. Coinciden exactamente los it y el modo prescritos.

#### Sonda 4: Refetch de plan en invalid

```diff
diff --git a/mobile-pet-tracker/src/screens/meal-schedule/index.tsx b/mobile-pet-tracker/src/screens/meal-schedule/index.tsx
index cb77bf55..706dcc8a 100644
--- a/mobile-pet-tracker/src/screens/meal-schedule/index.tsx
+++ b/mobile-pet-tracker/src/screens/meal-schedule/index.tsx
@@ -100,6 +100,7 @@ function MealScheduleContent({ petId }: { petId: string }) {
           await queryClient.refetchQueries({ queryKey: petKeys.detail(petId) });
           return;
         case 'invalid':
+          await plan.refetch();
           setEditError(t('mealSchedule.errorInvalidTime'));
           return;
         case 'forbidden':
```

```sh
bunx jest src/screens/meal-schedule > /tmp/147-e2-probe-4.txt 2>&1; echo "exit=$?"
```

```text
  ● #147 R8: cada error del contrato tiene su mensaje › invalid muestra «La hora no es válida»
Test Suites: 1 failed, 1 total
Tests:       1 failed, 53 passed, 54 total
Snapshots:   0 total
Time:        6.816 s, estimated 11 s
Ran all test suites matching /src\/screens\/meal-schedule/i.
exit=1
```

Fila invalid de R8: por matcher `mockGetNutritionPlan.toHaveBeenCalledTimes(1)`; se observan 2 llamadas.

Restauración desde HEAD: exit 0 y salida vacía; `git diff --cached --stat`: exit 0 y vacío; `git status --short`: exit 0 y vacío. Coinciden exactamente los it y el modo prescritos.

#### Sonda 5: Refetch de plan en forbidden

```diff
diff --git a/mobile-pet-tracker/src/screens/meal-schedule/index.tsx b/mobile-pet-tracker/src/screens/meal-schedule/index.tsx
index cb77bf55..bbf48982 100644
--- a/mobile-pet-tracker/src/screens/meal-schedule/index.tsx
+++ b/mobile-pet-tracker/src/screens/meal-schedule/index.tsx
@@ -103,6 +103,7 @@ function MealScheduleContent({ petId }: { petId: string }) {
           setEditError(t('mealSchedule.errorInvalidTime'));
           return;
         case 'forbidden':
+          await plan.refetch();
           setEditError(t('mealSchedule.errorEditForbidden'));
           return;
         case 'unprocessable':
```

```sh
bunx jest src/screens/meal-schedule > /tmp/147-e2-probe-5.txt 2>&1; echo "exit=$?"
```

```text
  ● #147 R8: cada error del contrato tiene su mensaje › forbidden muestra «Solo el dueño puede cambiar los horarios»
Test Suites: 1 failed, 1 total
Tests:       1 failed, 53 passed, 54 total
Snapshots:   0 total
Time:        7.122 s
Ran all test suites matching /src\/screens\/meal-schedule/i.
exit=1
```

Fila forbidden de R8: por matcher `mockGetNutritionPlan.toHaveBeenCalledTimes(1)`; se observan 2 llamadas.

Restauración desde HEAD: exit 0 y salida vacía; `git diff --cached --stat`: exit 0 y vacío; `git status --short`: exit 0 y vacío. Coinciden exactamente los it y el modo prescritos.

#### Sonda 6: Refetch de plan en NUTRITION_PLAN_REQUIRED

```diff
diff --git a/mobile-pet-tracker/src/screens/meal-schedule/index.tsx b/mobile-pet-tracker/src/screens/meal-schedule/index.tsx
index cb77bf55..723a23b2 100644
--- a/mobile-pet-tracker/src/screens/meal-schedule/index.tsx
+++ b/mobile-pet-tracker/src/screens/meal-schedule/index.tsx
@@ -108,6 +108,7 @@ function MealScheduleContent({ petId }: { petId: string }) {
         case 'unprocessable':
           switch (result.code) {
             case 'NUTRITION_PLAN_REQUIRED':
+              await plan.refetch();
               setEditError(t('mealSchedule.errorPlanRequired'));
               break;
             case 'MEAL_TIME_NOT_IN_PLAN':
```

```sh
bunx jest src/screens/meal-schedule > /tmp/147-e2-probe-6.txt 2>&1; echo "exit=$?"
```

```text
  ● #147 R8: cada error del contrato tiene su mensaje › NUTRITION_PLAN_REQUIRED muestra «Primero genera un plan de alimentación»
Test Suites: 1 failed, 1 total
Tests:       1 failed, 53 passed, 54 total
Snapshots:   0 total
Time:        6.987 s, estimated 7 s
Ran all test suites matching /src\/screens\/meal-schedule/i.
exit=1
```

Fila NUTRITION_PLAN_REQUIRED de R8: por matcher `mockGetNutritionPlan.toHaveBeenCalledTimes(1)`; se observan 2 llamadas.

Restauración desde HEAD: exit 0 y salida vacía; `git diff --cached --stat`: exit 0 y vacío; `git status --short`: exit 0 y vacío. Coinciden exactamente los it y el modo prescritos.

#### Sonda 7: Refetch de plan en MEAL_TIME_NOT_IN_PLAN

```diff
diff --git a/mobile-pet-tracker/src/screens/meal-schedule/index.tsx b/mobile-pet-tracker/src/screens/meal-schedule/index.tsx
index cb77bf55..17d464d0 100644
--- a/mobile-pet-tracker/src/screens/meal-schedule/index.tsx
+++ b/mobile-pet-tracker/src/screens/meal-schedule/index.tsx
@@ -111,6 +111,7 @@ function MealScheduleContent({ petId }: { petId: string }) {
               setEditError(t('mealSchedule.errorPlanRequired'));
               break;
             case 'MEAL_TIME_NOT_IN_PLAN':
+              await plan.refetch();
               setEditError(t('mealSchedule.errorTimeNotInPlan'));
               break;
             case 'MEAL_TIME_DUPLICATE':
```

```sh
bunx jest src/screens/meal-schedule > /tmp/147-e2-probe-7.txt 2>&1; echo "exit=$?"
```

```text
  ● #147 R8: cada error del contrato tiene su mensaje › MEAL_TIME_NOT_IN_PLAN muestra «Ese horario ya no está en el plan»
Test Suites: 1 failed, 1 total
Tests:       1 failed, 53 passed, 54 total
Snapshots:   0 total
Time:        6.738 s, estimated 7 s
Ran all test suites matching /src\/screens\/meal-schedule/i.
exit=1
```

Fila MEAL_TIME_NOT_IN_PLAN de R8: por matcher `mockGetNutritionPlan.toHaveBeenCalledTimes(1)`; se observan 2 llamadas.

Restauración desde HEAD: exit 0 y salida vacía; `git diff --cached --stat`: exit 0 y vacío; `git status --short`: exit 0 y vacío. Coinciden exactamente los it y el modo prescritos.

#### Sonda 8: Refetch de plan en MEAL_TIMES_LIMIT_REACHED

```diff
diff --git a/mobile-pet-tracker/src/screens/meal-schedule/index.tsx b/mobile-pet-tracker/src/screens/meal-schedule/index.tsx
index cb77bf55..c6ac2c23 100644
--- a/mobile-pet-tracker/src/screens/meal-schedule/index.tsx
+++ b/mobile-pet-tracker/src/screens/meal-schedule/index.tsx
@@ -117,6 +117,7 @@ function MealScheduleContent({ petId }: { petId: string }) {
               setEditError(t('mealSchedule.errorDuplicateTime'));
               break;
             case 'MEAL_TIMES_LIMIT_REACHED':
+              await plan.refetch();
               setEditError(t('mealSchedule.errorMealLimit'));
               break;
           }
```

```sh
bunx jest src/screens/meal-schedule > /tmp/147-e2-probe-8.txt 2>&1; echo "exit=$?"
```

```text
  ● #147 R8: cada error del contrato tiene su mensaje › MEAL_TIMES_LIMIT_REACHED muestra «El plan ya tiene el máximo de 6 comidas»
Test Suites: 1 failed, 1 total
Tests:       1 failed, 53 passed, 54 total
Snapshots:   0 total
Time:        6.683 s, estimated 7 s
Ran all test suites matching /src\/screens\/meal-schedule/i.
exit=1
```

Fila MEAL_TIMES_LIMIT_REACHED de R8: por matcher `mockGetNutritionPlan.toHaveBeenCalledTimes(1)`; se observan 2 llamadas.

Restauración desde HEAD: exit 0 y salida vacía; `git diff --cached --stat`: exit 0 y vacío; `git status --short`: exit 0 y vacío. Coinciden exactamente los it y el modo prescritos.

#### Sonda 9: Refetch de plan en unauthorized

```diff
diff --git a/mobile-pet-tracker/src/screens/meal-schedule/index.tsx b/mobile-pet-tracker/src/screens/meal-schedule/index.tsx
index cb77bf55..1e6074c6 100644
--- a/mobile-pet-tracker/src/screens/meal-schedule/index.tsx
+++ b/mobile-pet-tracker/src/screens/meal-schedule/index.tsx
@@ -122,6 +122,7 @@ function MealScheduleContent({ petId }: { petId: string }) {
           }
           return;
         case 'unauthorized':
+          await plan.refetch();
           await signOut();
           return;
         case 'unreachable':
```

```sh
bunx jest src/screens/meal-schedule > /tmp/147-e2-probe-9.txt 2>&1; echo "exit=$?"
```

```text
  ● #147 R8: cada error del contrato tiene su mensaje › 401 cierra sesión sin mensaje
Test Suites: 1 failed, 1 total
Tests:       1 failed, 53 passed, 54 total
Snapshots:   0 total
Time:        6.912 s, estimated 7 s
Ran all test suites matching /src\/screens\/meal-schedule/i.
exit=1
```

It «401 cierra sesión sin mensaje»: por matcher `mockGetNutritionPlan.toHaveBeenCalledTimes(1)`; se observan 2 llamadas.

Restauración desde HEAD: exit 0 y salida vacía; `git diff --cached --stat`: exit 0 y vacío; `git status --short`: exit 0 y vacío. Coinciden exactamente los it y el modo prescritos.

#### Sonda 10: Refetch de plan en unreachable

```diff
diff --git a/mobile-pet-tracker/src/screens/meal-schedule/index.tsx b/mobile-pet-tracker/src/screens/meal-schedule/index.tsx
index cb77bf55..51682246 100644
--- a/mobile-pet-tracker/src/screens/meal-schedule/index.tsx
+++ b/mobile-pet-tracker/src/screens/meal-schedule/index.tsx
@@ -125,6 +125,7 @@ function MealScheduleContent({ petId }: { petId: string }) {
           await signOut();
           return;
         case 'unreachable':
+          await plan.refetch();
           setEditError(t('common.cannotReachServer'));
           return;
         case 'error':
```

```sh
bunx jest src/screens/meal-schedule > /tmp/147-e2-probe-10.txt 2>&1; echo "exit=$?"
```

```text
  ● #147 R8: cada error del contrato tiene su mensaje › unreachable muestra «No se pudo conectar con el servidor»
Test Suites: 1 failed, 1 total
Tests:       1 failed, 53 passed, 54 total
Snapshots:   0 total
Time:        6.945 s, estimated 7 s
Ran all test suites matching /src\/screens\/meal-schedule/i.
exit=1
```

Fila unreachable de R8: por matcher `mockGetNutritionPlan.toHaveBeenCalledTimes(1)`; se observan 2 llamadas.

Restauración desde HEAD: exit 0 y salida vacía; `git diff --cached --stat`: exit 0 y vacío; `git status --short`: exit 0 y vacío. Coinciden exactamente los it y el modo prescritos.

#### Sonda 11: Refetch de plan en error/missing-config

```diff
diff --git a/mobile-pet-tracker/src/screens/meal-schedule/index.tsx b/mobile-pet-tracker/src/screens/meal-schedule/index.tsx
index cb77bf55..56369cec 100644
--- a/mobile-pet-tracker/src/screens/meal-schedule/index.tsx
+++ b/mobile-pet-tracker/src/screens/meal-schedule/index.tsx
@@ -129,6 +129,7 @@ function MealScheduleContent({ petId }: { petId: string }) {
           return;
         case 'error':
         case 'missing-config':
+          await plan.refetch();
           setEditError(t('common.somethingWentWrong'));
       }
     } catch {
```

```sh
bunx jest src/screens/meal-schedule > /tmp/147-e2-probe-11.txt 2>&1; echo "exit=$?"
```

```text
  ● #147 R8: cada error del contrato tiene su mensaje › error muestra «Algo salió mal»
  ● #147 R8: cada error del contrato tiene su mensaje › missing-config muestra «Algo salió mal»
Test Suites: 1 failed, 1 total
Tests:       2 failed, 52 passed, 54 total
Snapshots:   0 total
Time:        6.715 s, estimated 7 s
Ran all test suites matching /src\/screens\/meal-schedule/i.
exit=1
```

Filas error y missing-config de R8: por matcher `mockGetNutritionPlan.toHaveBeenCalledTimes(1)`; ambas observan 2 llamadas.

Restauración desde HEAD: exit 0 y salida vacía; `git diff --cached --stat`: exit 0 y vacío; `git status --short`: exit 0 y vacío. Coinciden exactamente los it y el modo prescritos.

#### Sonda 12: Refetch de plan en catch

```diff
diff --git a/mobile-pet-tracker/src/screens/meal-schedule/index.tsx b/mobile-pet-tracker/src/screens/meal-schedule/index.tsx
index cb77bf55..74d21ca2 100644
--- a/mobile-pet-tracker/src/screens/meal-schedule/index.tsx
+++ b/mobile-pet-tracker/src/screens/meal-schedule/index.tsx
@@ -132,6 +132,7 @@ function MealScheduleContent({ petId }: { petId: string }) {
           setEditError(t('common.somethingWentWrong'));
       }
     } catch {
+      await plan.refetch();
       setEditError(t('common.somethingWentWrong'));
     } finally {
       setEditing(false);
```

```sh
bunx jest src/screens/meal-schedule > /tmp/147-e2-probe-12.txt 2>&1; echo "exit=$?"
```

```text
  ● #147 R8: cada error del contrato tiene su mensaje › rechazo muestra «Algo salió mal»
Test Suites: 1 failed, 1 total
Tests:       1 failed, 53 passed, 54 total
Snapshots:   0 total
Time:        7.109 s
Ran all test suites matching /src\/screens\/meal-schedule/i.
exit=1
```

Fila rechazo de R8: por matcher `mockGetNutritionPlan.toHaveBeenCalledTimes(1)`; se observan 2 llamadas.

Restauración desde HEAD: exit 0 y salida vacía; `git diff --cached --stat`: exit 0 y vacío; `git status --short`: exit 0 y vacío. Coinciden exactamente los it y el modo prescritos.

#### Sonda 13: Refetch de mascota en forbidden

```diff
diff --git a/mobile-pet-tracker/src/screens/meal-schedule/index.tsx b/mobile-pet-tracker/src/screens/meal-schedule/index.tsx
index cb77bf55..93ec3da5 100644
--- a/mobile-pet-tracker/src/screens/meal-schedule/index.tsx
+++ b/mobile-pet-tracker/src/screens/meal-schedule/index.tsx
@@ -103,6 +103,7 @@ function MealScheduleContent({ petId }: { petId: string }) {
           setEditError(t('mealSchedule.errorInvalidTime'));
           return;
         case 'forbidden':
+          await queryClient.refetchQueries({ queryKey: petKeys.detail(petId) });
           setEditError(t('mealSchedule.errorEditForbidden'));
           return;
         case 'unprocessable':
```

```sh
bunx jest src/screens/meal-schedule > /tmp/147-e2-probe-13.txt 2>&1; echo "exit=$?"
```

```text
  ● #147 R8: cada error del contrato tiene su mensaje › forbidden muestra «Solo el dueño puede cambiar los horarios»
Test Suites: 1 failed, 1 total
Tests:       1 failed, 53 passed, 54 total
Snapshots:   0 total
Time:        6.78 s, estimated 7 s
Ran all test suites matching /src\/screens\/meal-schedule/i.
exit=1
```

Fila forbidden de R8: por matcher `mockGetPet.toHaveBeenCalledTimes(1)`; se observan 2 llamadas.

Restauración desde HEAD: exit 0 y salida vacía; `git diff --cached --stat`: exit 0 y vacío; `git status --short`: exit 0 y vacío. Coinciden exactamente los it y el modo prescritos.

#### Sonda C: Control: refetch de plan en MEAL_TIME_DUPLICATE

```diff
diff --git a/mobile-pet-tracker/src/screens/meal-schedule/index.tsx b/mobile-pet-tracker/src/screens/meal-schedule/index.tsx
index cb77bf55..d7d77d50 100644
--- a/mobile-pet-tracker/src/screens/meal-schedule/index.tsx
+++ b/mobile-pet-tracker/src/screens/meal-schedule/index.tsx
@@ -114,6 +114,7 @@ function MealScheduleContent({ petId }: { petId: string }) {
               setEditError(t('mealSchedule.errorTimeNotInPlan'));
               break;
             case 'MEAL_TIME_DUPLICATE':
+              await plan.refetch();
               setEditError(t('mealSchedule.errorDuplicateTime'));
               break;
             case 'MEAL_TIMES_LIMIT_REACHED':
```

```sh
bunx jest src/screens/meal-schedule > /tmp/147-e2-probe-C.txt 2>&1; echo "exit=$?"
```

```text
  ● #147 R7: tras un éxito refetchea plan y mascota, sin estado optimista › un resultado que no es ok no refetchea
  ● #147 R8: cada error del contrato tiene su mensaje › MEAL_TIME_DUPLICATE muestra «Ya hay una comida a esa hora»
Test Suites: 1 failed, 1 total
Tests:       2 failed, 52 passed, 54 total
Snapshots:   0 total
Time:        6.8 s, estimated 7 s
Ran all test suites matching /src\/screens\/meal-schedule/i.
exit=1
```

R7 it 4 y fila MEAL_TIME_DUPLICATE de R8: por matcher `mockGetNutritionPlan.toHaveBeenCalledTimes(1)`; ambos observan 2 llamadas.

Restauración desde HEAD: exit 0 y salida vacía; `git diff --cached --stat`: exit 0 y vacío; `git status --short`: exit 0 y vacío. Coinciden exactamente los it y el modo prescritos.

Se ejecutaron las 13 sondas y el control. Todas las mutaciones fueron detectadas y restauradas; ninguna sonda se omite. Antes del cierre, el árbol y el índice vuelven a estar limpios.

### Paso 5: §Cierre completo, en orden

Para respetar «sin pipe», los filtros de pgrep y de los dos grep-clean se ejecutan como comandos separados sobre ficheros intermedios. Se conservan los patrones de tasks.md y se registra el exit de cada comando.

#### 5.1 Gate de procesos

```sh
pgrep -af 'init\.sh|test:e2e|jest-e2e' > /tmp/147-e2-close-pgrep-raw.txt 2>&1; echo "exit=$?"
grep -v pgrep /tmp/147-e2-close-pgrep-raw.txt > /tmp/147-e2-close-pgrep.txt 2>&1; echo "exit=$?"
```

```text
pgrep: exit=0 (solo procesos de la propia inspección)
filtro grep -v pgrep: exit=1
(salida filtrada vacía)
```

No hay init.sh ni E2E en vuelo. El exit 1 del filtro expresa ausencia de coincidencias y cumple el gate.

#### 5.2 Suite móvil completa

```sh
bun run test > /tmp/147-e2-close-test.txt 2>&1; echo "exit=$?"
```

```text
Test Suites: 88 passed, 88 total
Tests:       1762 passed, 1762 total
Snapshots:   1 passed, 1 total
Time:        41.831 s, estimated 46 s
Ran all test suites.
exit=0
```

#### 5.3 Lint

```sh
bun run lint > /tmp/147-e2-close-lint.txt 2>&1; echo "exit=$?"
```

```text
$ expo lint
exit=0
```

#### 5.4 Typecheck, con la guarda de router

```sh
{ test ! -e .expo/types/router.d.ts && bun run typecheck; } > /tmp/147-e2-close-typecheck.txt 2>&1; echo "exit=$?"
```

```text
$ tsc --noEmit
exit=0
```

La guarda confirma que router.d.ts no existe; no se borra ningún fichero. El grupo de shell captura también la salida y el exit si la guarda falla.

#### 5.5 Los tres grep-clean

```sh
git diff b367ed44 -- src/screens/meal-schedule/index.tsx src/api/nutrition.ts > /tmp/147-e2-close-ui-diff.txt 2>&1; echo "exit=$?"
grep '^+' /tmp/147-e2-close-ui-diff.txt > /tmp/147-e2-close-ui-added.txt 2>&1; echo "exit=$?"
grep -nE "#[0-9a-fA-F]{3,8}\b|className=\"[^\"]*\[|StyleSheet\.create|rounded-(2xl|lg|md|sm)\b|elevation|shadow(Color|Offset|Opacity|Radius)" /tmp/147-e2-close-ui-added.txt > /tmp/147-e2-close-grep-ui.txt 2>&1; echo "exit=$?"
```

```text
git diff: exit=0
grep '^+': exit=0
grep-clean UI: exit=1
(salida vacía)
```

```sh
git diff b367ed44 -- src/screens/meal-schedule/index.tsx > /tmp/147-e2-close-dimensions-diff.txt 2>&1; echo "exit=$?"
grep -nE "^[-+].*(contentContainerStyle|padding: 24|gap: 16|insets\.bottom \+ 24)" /tmp/147-e2-close-dimensions-diff.txt > /tmp/147-e2-close-grep-dimensions.txt 2>&1; echo "exit=$?"
```

```text
git diff: exit=0
grep-clean dimensiones: exit=1
(salida vacía)
```

```sh
git diff b367ed44 --stat -- package.json bun.lock > /tmp/147-e2-close-grep-deps.txt 2>&1; echo "exit=$?"
```

```text
(salida vacía)
exit=0
```

Los exit 1 de grep significan que no hay coincidencias. Los tres gates salen vacíos: sin violaciones de tokens, sin cambios de dimensiones y sin dependencias nuevas. El cierre termina verde con 88/1762; no se ajusta ninguna aserción.

### Paso 6: trazabilidad y commits propios

La fila R7 de traceability.md cita `e277b810` (E2-a), las diez filas del it.each de R8 y el 401 con los dos contadores, y `bf81642a` (E2-b) con los tres it nuevos de Añadir. Conserva los dos hashes del par C4 original y la sonda de vía (b). Se añade la evidencia de las 13 sondas y el control y del cierre 88/1762. Ninguna fila de la tabla queda pendiente.

Lista de commits propios, en orden desde H0:

```text
0cbb155e test(mobile-meal-schedule-editing): lock nine meal schedule editing catalog keys (R1)
a131c0cc feat(mobile-meal-schedule-editing): add meal schedule editing copy in es and en (R1)
f559d77a test(mobile-meal-schedule-editing): lock addMealTime request and state mapping (R2)
35ed6ada feat(mobile-meal-schedule-editing): add addMealTime api client (R2)
befe2220 test(mobile-meal-schedule-editing): lock moveMealTime request and state mapping (R3)
0438799b feat(mobile-meal-schedule-editing): add moveMealTime api client (R3)
9c88290b test(mobile-meal-schedule-editing): lock owner-only meal time controls (R4)
3c497607 feat(mobile-meal-schedule-editing): show edit and add meal controls to owners (R4)
4a9c91d5 test(mobile-meal-schedule-editing): lock edit time picker and PATCH call (R5)
fc2c792a feat(mobile-meal-schedule-editing): edit a meal time with the native time picker (R5)
2860d495 test(mobile-meal-schedule-editing): lock add meal picker and POST call (R6)
fd48f9c3 feat(mobile-meal-schedule-editing): add a meal time with the native time picker (R6)
13363d1b test(mobile-meal-schedule-editing): lock refetch after success without optimistic state (R7)
a6a85313 feat(mobile-meal-schedule-editing): refetch plan and pet after a meal time edit (R7)
b343c919 test(mobile-meal-schedule-editing): lock meal time edit error messages (R8)
3d79a82c feat(mobile-meal-schedule-editing): show inline errors for meal time edits (R8)
f134d9d4 test(mobile-meal-schedule-editing): lock meal schedule editing copy registration (R9)
ddd0ba67 feat(mobile-meal-schedule-editing): register meal schedule editing copy uses (R9)
2c873c47 refactor(mobile-meal-schedule-editing): apply picker test timezone to Node process (R5,R6)
b5d46054 refactor(mobile-meal-schedule-editing): match language spec table format (R1)
1526db05 test(mobile-meal-schedule-editing): count the meal time controls among accent-soft uses (R4)
e8789628 test(mobile-meal-schedule-editing): count the meal schedule 401 sign-out (R8)
d05d8725 docs(mobile-meal-schedule-editing): fill #147 traceability
e277b810 test(mobile-meal-schedule-editing): lock no refetch on every failed meal time edit (R7)
bf81642a test(mobile-meal-schedule-editing): lock refetch and disabled controls for added meal times (R7)
HEAD docs(mobile-meal-schedule-editing): cite amendment E2 in #147 traceability
```

Son 26 al incluir el único commit de documentación que contiene este informe: los 23 anteriores, E2-a, E2-b y el cierre documental. El último se identifica como HEAD porque su hash depende del propio informe; se obtiene después con `git log -1 --format="%h %s"`, sin enmendar ni rebasear. Los otros 25 hashes se contrastaron con git log.

El último commit lleva SOLO specs/mobile-meal-schedule-editing/traceability.md y progress/impl_mobile-meal-schedule-editing.md, con este mensaje literal:

```sh
git commit -m 'docs(mobile-meal-schedule-editing): cite amendment E2 in #147 traceability'
```

Las rutas que cambian los commits propios se calcularon con git diff-tree para cada hash propio, excluyendo `98cc1154`, `d8edb20e` y `f26f85fd` del leader. Coinciden exactamente con los mismos 13 ficheros de design.md §Archivos afectados:

```text
mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts
mobile-pet-tracker/src/__tests__/design-drift.test.ts
mobile-pet-tracker/src/__tests__/ui-copy-table.ts
mobile-pet-tracker/src/__tests__/ui-language.test.ts
mobile-pet-tracker/src/api/__tests__/nutrition.test.ts
mobile-pet-tracker/src/api/nutrition.ts
mobile-pet-tracker/src/i18n/catalog.ts
mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx
mobile-pet-tracker/src/screens/meal-schedule/index.test.tsx
mobile-pet-tracker/src/screens/meal-schedule/index.tsx
progress/impl_mobile-meal-schedule-editing.md
specs/mobile-meal-schedule-editing/traceability.md
specs/mobile-ui-language/design.md
```

### Diff completo H0..HEAD y los seis ficheros del leader

```sh
git diff --name-only b367ed44..HEAD
```

```text
mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts
mobile-pet-tracker/src/__tests__/design-drift.test.ts
mobile-pet-tracker/src/__tests__/ui-copy-table.ts
mobile-pet-tracker/src/__tests__/ui-language.test.ts
mobile-pet-tracker/src/api/__tests__/nutrition.test.ts
mobile-pet-tracker/src/api/nutrition.ts
mobile-pet-tracker/src/i18n/catalog.ts
mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx
mobile-pet-tracker/src/screens/meal-schedule/index.test.tsx
mobile-pet-tracker/src/screens/meal-schedule/index.tsx
progress/current.md
progress/handoff_mobile-meal-schedule-editing.md
progress/impl_mobile-meal-schedule-editing.md
progress/review_mobile-meal-schedule-editing.md
specs/mobile-meal-schedule-editing/design.md
specs/mobile-meal-schedule-editing/requirements.md
specs/mobile-meal-schedule-editing/tasks.md
specs/mobile-meal-schedule-editing/traceability.md
specs/mobile-ui-language/design.md
exit=0
```

Son 19 rutas: las 13 propias y estas seis de los commits del leader (`98cc1154`, `d8edb20e` y `f26f85fd`), que NO cuentan como propias:

- `specs/mobile-meal-schedule-editing/requirements.md`.
- `specs/mobile-meal-schedule-editing/design.md`.
- `specs/mobile-meal-schedule-editing/tasks.md`.
- `progress/current.md`.
- `progress/handoff_mobile-meal-schedule-editing.md`.
- `progress/review_mobile-meal-schedule-editing.md`.

La salida se obtuvo antes del último commit documental; ambos documentos ya estaban incluidos desde d05d8725. Se contrasta de nuevo después del commit contra este inventario, sin modificar el informe ni crear otro commit.

```sh
git diff f26f85fd HEAD -- mobile-pet-tracker/src/screens/meal-schedule/index.tsx mobile-pet-tracker/src/api/nutrition.ts
```

```text
(salida vacía)
exit=0
```

### Decisiones y entrega

Solo se añaden las aserciones y los tests literales de E2, más trazabilidad e informe. Las sondas de producción se restauraron todas. No se ejecuta init.sh ni E2E, no se hace push ni se abre PR. No se modifica el estado de la feature ni se marca el smoke Android. El leader conserva el cierre de lifecycle y la revisión posterior. Se comprobarán tras el último commit los 26 commits propios, los 13 ficheros propios, el diff completo de 19 rutas y el árbol limpio.

## Reanudación 3

2026-10-03. E3 aprobada por humano y firmada en `39174fe7`, tras el borrador del leader `65b7434b` y la trazabilidad de E2 `c918e756`. H0 permanece en `b367ed44`. Se aplica E3-a por vía (b) de C4 y se documentan sus dos sondas y el cierre. Los comandos móviles se ejecutan desde `/home/claude/sites/Pet-Tracker/mobile-pet-tracker`, sin pipes.

### Paso 0: identidad y estado inicial

```text
$ pwd
/home/claude/sites/Pet-Tracker
$ git branch --show-current
feature/147-mobile-meal-schedule-editing
$ git log --oneline -3
39174fe7 Approve amendment E3 of #147 and resume Codex (firma en chat)
65b7434b Draft amendment E3 of #147 after the round 2 rejection
c918e756 docs(mobile-meal-schedule-editing): cite amendment E2 in #147 traceability
$ git status --short
(salida vacía)
```

Las cuatro comprobaciones terminan con exit 0. La branch es la prescrita, el tercer commit es c918e756 y el árbol está limpio. Se leyeron requirements.md §Enmienda E3 (casilla humana marcada), tasks.md §Enmienda E3, §Esperas y §Cierre, review §Ronda 2 (incluida la pre-verificación del borrador) y handoff §Reanudación 3. Siguen las reglas y las skills ya cargadas del handoff original, registradas en el arranque y en Reanudación 2; no se carga una skill nueva. No se rebasea ni se enmienda ningún commit previo.

### Paso 1: base verde

```sh
bunx jest src/screens/meal-schedule > /tmp/147-e3-base.txt 2>&1; echo "exit=$?"
```

```text
Test Suites: 1 passed, 1 total
Tests:       54 passed, 54 total
Snapshots:   0 total
Time:        11.677 s
Ran all test suites matching /src\/screens\/meal-schedule/i.
exit=0
```

### Paso 2: E3-a verde

```sh
bunx jest src/screens/meal-schedule > /tmp/147-e3-a.txt 2>&1; echo "exit=$?"
```

```text
Test Suites: 1 passed, 1 total
Tests:       56 passed, 56 total
Snapshots:   0 total
Time:        7.115 s, estimated 12 s
Ran all test suites matching /src\/screens\/meal-schedule/i.
exit=0
```

Se extrajo literalmente el bloque ts de tasks.md E3-a y se insertó dentro del describe de R7, después de «tras ok de Añadir los controles siguen deshabilitados y sin fila nueva hasta que termina el refetch». La ubicación se localizó por contenido. Se comprobó la igualdad del bloque con la spec. No se cambió ningún test anterior, import ni literal de copy. PetState ya estaba importado; se reutilizan los mocks existentes.

Los dos it retienen la segunda llamada a getPet, esperan conjuntamente el árbol deshabilitado y las dos llamadas, observan el plan repintado y mantienen todos los controles deshabilitados hasta resolver la mascota. Ambos terminan con la espera de cierre prescrita. El test de Añadir también comprueba el nuevo meal-time-edit-2.

```sh
git add -- mobile-pet-tracker/src/screens/meal-schedule/index.test.tsx
git commit -m 'test(mobile-meal-schedule-editing): lock disabled controls until the pet detail refetch ends (R7)'
git show --stat HEAD > /tmp/147-e3-a-stat.txt 2>&1; echo "exit=$?"
```

```text
commit e184ab68ef4603f8c3b784e06a08b10ce8e127a1
Author: Claude <claude@srv1178023.hstgr.cloud>
Date:   Sat Oct 3 03:32:59 2026 +0000

    test(mobile-meal-schedule-editing): lock disabled controls until the pet detail refetch ends (R7)

 .../src/screens/meal-schedule/index.test.tsx       | 48 ++++++++++++++++++++++
 1 file changed, 48 insertions(+)
exit=0
```

El commit `e184ab68` lleva un solo fichero: index.test.tsx, con 48 líneas añadidas y dos tests. El status posterior sale vacío. La producción correcta permanece intacta.

### Paso 3: las dos sondas, por separado sobre el verde

Cada sonda parte de HEAD e184ab68 limpio y modifica temporalmente solo src/screens/meal-schedule/index.tsx. Las dos mutaciones se aplican en la rama ok de runMealTimeEdit. Tras cada una se restaura desde el mismo HEAD y se comprueban el índice y el status.

#### Sonda 1: Rehabilitar entre el refetch del plan y el de la mascota

```diff
diff --git a/mobile-pet-tracker/src/screens/meal-schedule/index.tsx b/mobile-pet-tracker/src/screens/meal-schedule/index.tsx
index cb77bf55..49f9dd9f 100644
--- a/mobile-pet-tracker/src/screens/meal-schedule/index.tsx
+++ b/mobile-pet-tracker/src/screens/meal-schedule/index.tsx
@@ -97,6 +97,7 @@ function MealScheduleContent({ petId }: { petId: string }) {
       switch (result.kind) {
         case 'ok':
           await plan.refetch();
+          setEditing(false);
           await queryClient.refetchQueries({ queryKey: petKeys.detail(petId) });
           return;
         case 'invalid':
```

```sh
bunx jest src/screens/meal-schedule > /tmp/147-e3-probe-1.txt 2>&1; echo "exit=$?"
```

```text
  ● #147 R7: tras un éxito refetchea plan y mascota, sin estado optimista › los controles siguen deshabilitados hasta que termina también el refetch de la mascota
  ● #147 R7: tras un éxito refetchea plan y mascota, sin estado optimista › tras ok de Añadir los controles siguen deshabilitados hasta que termina también el refetch de la mascota
Test Suites: 1 failed, 1 total
Tests:       2 failed, 54 passed, 56 total
Snapshots:   0 total
Time:        9.311 s
Ran all test suites matching /src\/screens\/meal-schedule/i.
exit=1
```

Caen exactamente E3-a it 1 (Editar) e it 2 (Añadir), por matcher `toEqual(expect.objectContaining({ disabled: true }))` en el primer waitFor de cada uno: se espera disabled true y se recibe false. No hay caída por consulta «Unable to find» y los otros 54 tests permanecen verdes.

```sh
git checkout HEAD -- src/screens/meal-schedule/index.tsx > /tmp/147-e3-probe-1-restore.txt 2>&1; echo "exit=$?"
git diff --cached --stat > /tmp/147-e3-probe-1-cached.txt 2>&1; echo "exit=$?"
git status --short > /tmp/147-e3-probe-1-status.txt 2>&1; echo "exit=$?"
```

```text
checkout: exit=0, salida vacía
diff --cached --stat: exit=0, salida vacía
status --short: exit=0, salida vacía
```

#### Sonda 2: Lanzar el refetch de la mascota con void en lugar de await

```diff
diff --git a/mobile-pet-tracker/src/screens/meal-schedule/index.tsx b/mobile-pet-tracker/src/screens/meal-schedule/index.tsx
index cb77bf55..ff45d0bb 100644
--- a/mobile-pet-tracker/src/screens/meal-schedule/index.tsx
+++ b/mobile-pet-tracker/src/screens/meal-schedule/index.tsx
@@ -97,7 +97,7 @@ function MealScheduleContent({ petId }: { petId: string }) {
       switch (result.kind) {
         case 'ok':
           await plan.refetch();
-          await queryClient.refetchQueries({ queryKey: petKeys.detail(petId) });
+          void queryClient.refetchQueries({ queryKey: petKeys.detail(petId) });
           return;
         case 'invalid':
           setEditError(t('mealSchedule.errorInvalidTime'));
```

```sh
bunx jest src/screens/meal-schedule > /tmp/147-e3-probe-2.txt 2>&1; echo "exit=$?"
```

```text
  ● #147 R7: tras un éxito refetchea plan y mascota, sin estado optimista › los controles siguen deshabilitados hasta que termina también el refetch de la mascota
  ● #147 R7: tras un éxito refetchea plan y mascota, sin estado optimista › tras ok de Añadir los controles siguen deshabilitados hasta que termina también el refetch de la mascota
Test Suites: 1 failed, 1 total
Tests:       2 failed, 54 passed, 56 total
Snapshots:   0 total
Time:        9.182 s, estimated 10 s
Ran all test suites matching /src\/screens\/meal-schedule/i.
exit=1
```

Caen exactamente E3-a it 1 (Editar) e it 2 (Añadir), por matcher `toEqual(expect.objectContaining({ disabled: true }))` en el primer waitFor de cada uno: se espera disabled true y se recibe false. No hay caída por consulta «Unable to find» y los otros 54 tests permanecen verdes.

```sh
git checkout HEAD -- src/screens/meal-schedule/index.tsx > /tmp/147-e3-probe-2-restore.txt 2>&1; echo "exit=$?"
git diff --cached --stat > /tmp/147-e3-probe-2-cached.txt 2>&1; echo "exit=$?"
git status --short > /tmp/147-e3-probe-2-status.txt 2>&1; echo "exit=$?"
```

```text
checkout: exit=0, salida vacía
diff --cached --stat: exit=0, salida vacía
status --short: exit=0, salida vacía
```

Las dos sondas se ejecutaron y detectaron exactamente el fallo prescrito. Ninguna se omite. Antes del cierre, la producción vuelve al verde y el índice y el árbol quedan limpios.

### Paso 4: §Cierre completo, en orden

Como en E2, pgrep y los dos grep-clean se miden con filtros separados sobre ficheros, conservando los patrones de tasks.md y el exit de cada comando, sin pipes.

#### 4.1 Gate de procesos

```sh
pgrep -af 'init\.sh|test:e2e|jest-e2e' > /tmp/147-e3-close-pgrep-raw.txt 2>&1; echo "exit=$?"
grep -v pgrep /tmp/147-e3-close-pgrep-raw.txt > /tmp/147-e3-close-pgrep.txt 2>&1; echo "exit=$?"
```

```text
pgrep: exit=0 (procesos de la propia inspección)
grep -v pgrep: exit=1
(salida filtrada vacía)
```

El gate está vacío: ningún init.sh ni E2E en vuelo. El exit 1 del filtro significa que no hay coincidencias.

#### 4.2 Suite móvil completa

```sh
bun run test > /tmp/147-e3-close-test.txt 2>&1; echo "exit=$?"
```

```text
Test Suites: 88 passed, 88 total
Tests:       1764 passed, 1764 total
Snapshots:   1 passed, 1 total
Time:        59.905 s
Ran all test suites.
exit=0
```

#### 4.3 Lint

```sh
bun run lint > /tmp/147-e3-close-lint.txt 2>&1; echo "exit=$?"
```

```text
$ expo lint
exit=0
```

#### 4.4 Typecheck con guarda de router

```sh
{ test ! -e .expo/types/router.d.ts && bun run typecheck; } > /tmp/147-e3-close-typecheck.txt 2>&1; echo "exit=$?"
```

```text
$ tsc --noEmit
exit=0
```

La guarda confirma que router.d.ts no existe. El grupo de shell captura también el exit y cualquier salida de la guarda. No se borra ningún fichero.

#### 4.5 Los tres grep-clean

```sh
git diff b367ed44 -- src/screens/meal-schedule/index.tsx src/api/nutrition.ts > /tmp/147-e3-close-ui-diff.txt 2>&1; echo "exit=$?"
grep '^+' /tmp/147-e3-close-ui-diff.txt > /tmp/147-e3-close-ui-added.txt 2>&1; echo "exit=$?"
grep -nE "#[0-9a-fA-F]{3,8}\b|className=\"[^\"]*\[|StyleSheet\.create|rounded-(2xl|lg|md|sm)\b|elevation|shadow(Color|Offset|Opacity|Radius)" /tmp/147-e3-close-ui-added.txt > /tmp/147-e3-close-grep-ui.txt 2>&1; echo "exit=$?"
```

```text
git diff: exit=0
grep '^+': exit=0
grep-clean UI: exit=1
(salida vacía)
```

```sh
git diff b367ed44 -- src/screens/meal-schedule/index.tsx > /tmp/147-e3-close-dimensions-diff.txt 2>&1; echo "exit=$?"
grep -nE "^[-+].*(contentContainerStyle|padding: 24|gap: 16|insets\.bottom \+ 24)" /tmp/147-e3-close-dimensions-diff.txt > /tmp/147-e3-close-grep-dimensions.txt 2>&1; echo "exit=$?"
```

```text
git diff: exit=0
grep-clean dimensiones: exit=1
(salida vacía)
```

```sh
git diff b367ed44 --stat -- package.json bun.lock > /tmp/147-e3-close-grep-deps.txt 2>&1; echo "exit=$?"
```

```text
(salida vacía)
exit=0
```

Los exit 1 de grep indican ausencia de coincidencias. Los tres gates salen vacíos: tokens, dimensiones y dependencias. El cierre pasa con 88 suites / 1764 tests, lint y typecheck en exit 0. No se ajusta ninguna aserción.

### Paso 5: trazabilidad y listas del cierre

La fila R7 de traceability.md añade `e184ab68` y los dos it literales de E3-a, conservando el par C4 original y las enmiendas anteriores. El cierre de E3 documenta la vía (b), ambas sondas y 88/1764. Ninguna fila de la tabla queda pendiente.

Commits propios, en orden desde H0:

```text
0cbb155e test(mobile-meal-schedule-editing): lock nine meal schedule editing catalog keys (R1)
a131c0cc feat(mobile-meal-schedule-editing): add meal schedule editing copy in es and en (R1)
f559d77a test(mobile-meal-schedule-editing): lock addMealTime request and state mapping (R2)
35ed6ada feat(mobile-meal-schedule-editing): add addMealTime api client (R2)
befe2220 test(mobile-meal-schedule-editing): lock moveMealTime request and state mapping (R3)
0438799b feat(mobile-meal-schedule-editing): add moveMealTime api client (R3)
9c88290b test(mobile-meal-schedule-editing): lock owner-only meal time controls (R4)
3c497607 feat(mobile-meal-schedule-editing): show edit and add meal controls to owners (R4)
4a9c91d5 test(mobile-meal-schedule-editing): lock edit time picker and PATCH call (R5)
fc2c792a feat(mobile-meal-schedule-editing): edit a meal time with the native time picker (R5)
2860d495 test(mobile-meal-schedule-editing): lock add meal picker and POST call (R6)
fd48f9c3 feat(mobile-meal-schedule-editing): add a meal time with the native time picker (R6)
13363d1b test(mobile-meal-schedule-editing): lock refetch after success without optimistic state (R7)
a6a85313 feat(mobile-meal-schedule-editing): refetch plan and pet after a meal time edit (R7)
b343c919 test(mobile-meal-schedule-editing): lock meal time edit error messages (R8)
3d79a82c feat(mobile-meal-schedule-editing): show inline errors for meal time edits (R8)
f134d9d4 test(mobile-meal-schedule-editing): lock meal schedule editing copy registration (R9)
ddd0ba67 feat(mobile-meal-schedule-editing): register meal schedule editing copy uses (R9)
2c873c47 refactor(mobile-meal-schedule-editing): apply picker test timezone to Node process (R5,R6)
b5d46054 refactor(mobile-meal-schedule-editing): match language spec table format (R1)
1526db05 test(mobile-meal-schedule-editing): count the meal time controls among accent-soft uses (R4)
e8789628 test(mobile-meal-schedule-editing): count the meal schedule 401 sign-out (R8)
d05d8725 docs(mobile-meal-schedule-editing): fill #147 traceability
e277b810 test(mobile-meal-schedule-editing): lock no refetch on every failed meal time edit (R7)
bf81642a test(mobile-meal-schedule-editing): lock refetch and disabled controls for added meal times (R7)
c918e756 docs(mobile-meal-schedule-editing): cite amendment E2 in #147 traceability
e184ab68 test(mobile-meal-schedule-editing): lock disabled controls until the pet detail refetch ends (R7)
HEAD docs(mobile-meal-schedule-editing): cite amendment E3 in #147 traceability
```

Son 28 al incluir el único commit documental que contiene este informe: los 26 anteriores, E3-a y su trazabilidad. El último se identifica como HEAD porque su hash depende del informe; se obtiene después con `git log -1 --format="%h %s"`, sin enmendar ni rebasear. Los otros 27 hashes se contrastaron con git log.

Ese commit lleva SOLO specs/mobile-meal-schedule-editing/traceability.md y progress/impl_mobile-meal-schedule-editing.md, con este mensaje literal:

```sh
git commit -m 'docs(mobile-meal-schedule-editing): cite amendment E3 in #147 traceability'
```

Las rutas que cambian los commits propios se calcularon con git diff-tree por hash, excluyendo los cinco commits del leader. Coinciden exactamente con los mismos 13 ficheros de design.md §Archivos afectados:

```text
mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts
mobile-pet-tracker/src/__tests__/design-drift.test.ts
mobile-pet-tracker/src/__tests__/ui-copy-table.ts
mobile-pet-tracker/src/__tests__/ui-language.test.ts
mobile-pet-tracker/src/api/__tests__/nutrition.test.ts
mobile-pet-tracker/src/api/nutrition.ts
mobile-pet-tracker/src/i18n/catalog.ts
mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx
mobile-pet-tracker/src/screens/meal-schedule/index.test.tsx
mobile-pet-tracker/src/screens/meal-schedule/index.tsx
progress/impl_mobile-meal-schedule-editing.md
specs/mobile-meal-schedule-editing/traceability.md
specs/mobile-ui-language/design.md
```

### Diff completo H0..HEAD y atribución de los seis ficheros del leader

```sh
git diff --name-only b367ed44..HEAD
```

```text
mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts
mobile-pet-tracker/src/__tests__/design-drift.test.ts
mobile-pet-tracker/src/__tests__/ui-copy-table.ts
mobile-pet-tracker/src/__tests__/ui-language.test.ts
mobile-pet-tracker/src/api/__tests__/nutrition.test.ts
mobile-pet-tracker/src/api/nutrition.ts
mobile-pet-tracker/src/i18n/catalog.ts
mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx
mobile-pet-tracker/src/screens/meal-schedule/index.test.tsx
mobile-pet-tracker/src/screens/meal-schedule/index.tsx
progress/current.md
progress/handoff_mobile-meal-schedule-editing.md
progress/impl_mobile-meal-schedule-editing.md
progress/review_mobile-meal-schedule-editing.md
specs/mobile-meal-schedule-editing/design.md
specs/mobile-meal-schedule-editing/requirements.md
specs/mobile-meal-schedule-editing/tasks.md
specs/mobile-meal-schedule-editing/traceability.md
specs/mobile-ui-language/design.md
exit=0
```

Son 19 rutas: 13 propias y estas seis de los commits del leader (`98cc1154`, `d8edb20e`, `f26f85fd`, `65b7434b` y `39174fe7`), que NO cuentan como propias:

- `specs/mobile-meal-schedule-editing/requirements.md`.
- `specs/mobile-meal-schedule-editing/design.md`.
- `specs/mobile-meal-schedule-editing/tasks.md`.
- `progress/current.md`.
- `progress/handoff_mobile-meal-schedule-editing.md`.
- `progress/review_mobile-meal-schedule-editing.md`.

La salida se obtuvo antes del último commit documental; ambos documentos ya estaban incluidos. Se contrasta de nuevo después del commit contra este inventario sin modificar el informe ni crear otro commit.

```sh
git diff 39174fe7 HEAD -- mobile-pet-tracker/src/screens/meal-schedule/index.tsx mobile-pet-tracker/src/api/nutrition.ts
```

```text
(salida vacía)
exit=0
```

### Decisiones y entrega

Solo se insertan los dos it literales de E3-a y se actualizan trazabilidad e informe. Las dos mutaciones de producción se restauraron. No se ejecuta init.sh ni E2E, no se hace push ni se abre PR, no se modifica el estado de la feature ni se marca el smoke Android. El leader conserva el lifecycle y la revisión posterior. Tras el commit documental se comprobarán los 28 commits propios, los 13 ficheros propios, las 19 rutas totales y el árbol limpio.

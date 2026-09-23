---
feature: "nutrition-kcal-consumed"
status: approved     # draft | approved
tags: [harness, spec]
---

# Requisitos — [[nutrition-kcal-consumed]] (#104)

> Notación EARS. Cada requisito tiene id único R\<n\>, inmutable una vez aprobado.
> Ver [[design]] para las decisiones técnicas y [[../../docs/architecture|architecture]]
> para las reglas de arquitectura que la implementación debe respetar.
>
> Fuente: `feature_list.json` #104 (`description` + criterios 1 y 2, los que
> conserva tras la partición D1) y la spec de #83
> (`specs/meals-served-tracking/`), de la que esta hereda la definición de
> "el día" y la regla D4 del plan regenerado. Cada premisa de la entrada se
> verificó contra el árbol antes de escribir un requisito (§0); las que no
> cuadraban se corrigen en §0.2.
>
> Feature **backend puro** (`backend-pet-tracker/`). **Cero migraciones, cero
> dependencias nuevas, cero variables de entorno nuevas, cero métodos nuevos
> en puertos o repositorios.** La parte móvil (la tarjeta «Objetivo diario»
> de `food.tsx`) es la feature **#113** `mobile-kcal-consumed-bar`, bloqueada
> por esta (D1, firmada el 2026-09-23).
>
> Commit base `2be1b023` (= `origin/main`), branch
> `feature/104-nutrition-kcal-consumed`, worktree
> `/home/claude/sites/Pet-Tracker-wt-backend`. Rutas relativas a
> `backend-pet-tracker/` salvo que empiecen por `docs/`, `specs/`,
> `progress/` o `mobile-pet-tracker/`; `test/` es `backend-pet-tracker/test/`.
> **Ninguna cita usa número de línea**: todo ancla es un texto literal que se
> encuentra con `grep -n` (los números caducan cuando mergea otra sesión).

---

## §0. Verificación de premisas contra el árbol

### §0.1 Premisas confirmadas

| # | Premisa | Veredicto | Evidencia (comando o ancla grepeable) |
|---|---|---|---|
| P1 | Hoy el backend no calcula kcal consumidas | **cierta** | `grep -rniE "consumed" backend-pet-tracker/src backend-pet-tracker/test` → 0 coincidencias |
| P2 | El plan no desglosa kcal por franja | **cierta** | Engine: `NutritionPlanResult` en `src/modules/nutrition/domain/nutrition-engine.ts` tiene `merKcal`, `dailyGrams`, `mealsPerDay`, `mealTimes` y nada por franja. Entidad `src/modules/nutrition/domain/entities/nutrition-plan.entity.ts`: mismas claves. Tabla `nutritionPlans` en `src/db/schema/nutrition.schema.ts`: `merKcal: integer('mer_kcal')`, sin columna por franja. `get-nutrition-plan.use-case.ts` solo añade `servedToday`. `grep -rn -e mealKcal -e kcalPerMeal backend-pet-tracker/src` → 0. Las horas son constantes: `/** C-6: horarios locales fijos, no repartidos algorítmicamente. */` en `nutrition.constants.ts` |
| P3 | `merKcal` es entero | **cierta** | `const merKcal = Math.round(rerRaw * factor);` en `nutrition-engine.ts`; columna `integer('mer_kcal')` |
| P4 | `mealTimes.length === mealsPerDay` siempre | **cierta por construcción** (P2 de #83) | `mealTimes: [...MEAL_TIMES_BY_COUNT[mealsPerDay]],` en `nutrition-engine.ts`; `check('nutrition_plans_meals_per_day_check', … between 1 and 6)` en el schema. Por eso `servedToday.length ≤ mealsPerDay` y `mealsPerDay ≥ 1` (sin división por cero) |
| P5 | "El día" de una comida servida, según #83 | **cierta; se hereda sin cambios** | Escritura: `const servedOn = await ownerLocalDay(this.pets, petId, now);` en `serve-meal.use-case.ts` y `unserve-meal.use-case.ts`, con `const now = new Date();` en `meals.controller.ts`. Lectura: `const day = await ownerLocalDay(this.pets, petId, now);` en `get-nutrition-plan.use-case.ts`, con `this.getPlan.execute(request.petMembership.petId, new Date())` en `nutrition.controller.ts`. `ownerLocalDay` (`src/modules/pets/application/owner-local-day.ts`) = `localDayOf(now, <zona IANA del owner>)`, con **UTC si la zona falta o no es IANA** (`falling back to UTC`). El cliente **no** envía fecha en ningún verbo (#83 R6 rechaza `servedOn` en el body; el `GET` no tiene parámetros). Las filas guardan la fecha civil y no se recalculan si el owner cambia de zona (#83 §Fuera de alcance) |
| P6 | El móvil ya reparte la ración diaria **a partes iguales** entre franjas | **cierta** | `loadedPlan.dailyGrams / loadedPlan.mealsPerDay,` en `mobile-pet-tracker/src/app/(tabs)/food.tsx` y en `mobile-pet-tracker/src/screens/meal-schedule/index.tsx` (gramos por fila). Base de D2 |
| P7 | El cliente móvil tolera claves nuevas en el plan | **cierta** | `getNutritionPlan` en `mobile-pet-tracker/src/api/nutrition.ts` solo comprueba `isObjectBody(body)`. Añadir una clave al `GET` no rompe la app desplegada; #113 la tipa y la pinta |
| P8 | Solo dos candados congelan la forma exacta del `GET` del plan | **cierta** | `grep -rn "servedToday" backend-pet-tracker/test`: (a) la lista de claves del `describe('R9 (meals-served-tracking #83): …')` en `test/meals.e2e-spec.ts` (el array que contiene `'servedToday',` dentro de `Object.keys(empty.body as object).sort()`); (b) `expect(latest.body).toEqual({ ...second.body, servedToday: [] });` en `test/nutrition.e2e-spec.ts` (R24 de #17). El resto de coincidencias son `toMatchObject` o aserciones sobre el campo `servedToday` y no cambian |
| P9 | Esta feature no toca puertos: no hay dobles que actualizar | **cierta** | Solo cambian una función pura de dominio, un use case y un mapper (ver [[design]] §Archivos afectados). `grep -rn -e "implements MealServingRepository" -e "implements NutritionRepository" -e "implements PetMealsReader" -e "MockOf<MealServingRepository>" -e "MockOf<NutritionRepository>" backend-pet-tracker/src backend-pet-tracker/test` → 3 coincidencias, las tres clases Drizzle; ninguna cambia. `GetNutritionPlanUseCase` no tiene spec unitario (no existe `get-nutrition-plan.use-case.spec.ts`) y su constructor no cambia |
| P10 | La mascota del fixture e2e de #83 da `merKcal: 1059`, `mealsPerDay: 2`, `mealTimes: ['07:30','19:30']` | **cierta** (cálculo a mano) | `seedPet` (perro, `birthDate: '2021-01-15'`, `sterilized: true` ⇒ adulto) + `putProfile` (`medium`, `kcalPer100g: 350`) + `postWeight` (`weightKg: 20`) en `test/meals.e2e-spec.ts`. RER = 70 · 20^0,75 = 662,02 → 662; MER = 662,02 · 1,6 = 1059,23 → **1059**. #83 ya lo usa (`rerKcal: 662,` / `merKcal: 1059,` en su `describe('R10 …')`). R2 lo asevera como precondición |
| P11 | La base propia del worktree ya tiene `meal_servings` | **cierta según la bitácora** (memoria `db-por-worktree-pet-tracker-wt`: `pet_tracker_wt` en journal 18 desde 2026-09-17; #83 mergeada) | No verificado con `psql` en esta spec (el spec_author no toca Postgres). [[tasks]] §0 lo comprueba antes del primer e2e |

### §0.2 Premisas corregidas (nadie construye sobre la versión anterior)

| # | Premisa (origen) | Corrección | Evidencia |
|---|---|---|---|
| C1 | "La spec de #98 lo llamó anillo y es falso: es una **BARRA**" (`description` de #104, copiada de §Fuera de alcance de #98) | **Falsa a medias.** La tarjeta «Objetivo diario» de `FoodScreen` en el Make pinta **las dos cosas**: una **barra** horizontal blanca bajo el número de kcal (con `{pet.caloriesConsumed} kcal` a la izquierda y `{pct}%` a la derecha) **y** un **anillo** SVG a la derecha de la tarjeta (dos `<circle … r="29">`, el segundo con `strokeDasharray` proporcional, y `{pct}%` en el centro). Ambos salen del mismo `const pct = Math.round((pet.caloriesConsumed / pet.calories) * 100)`. No afecta al backend (el dato es el mismo para los dos); sí a #113, cuya spec decide barra, anillo o ambos | `grep -n "const pct = Math.round((pet.caloriesConsumed" specs/mobile-figma-polish/design-src/App.tsx`, `grep -n "h-2 rounded-full overflow-hidden" …` (barra), `grep -n "2 \* Math.PI \* 29 \* pct" …` (anillo); los datos: `calories: 1420, caloriesConsumed: 890` y `calories: 320, caloriesConsumed: 240` en el mismo fichero (último commit que lo toca: `cbde08ae`) |
| C2 | "Necesita saber cuánto vale en kcal cada franja" (`description` de #104) | Para el dato que pinta el Make **no** hace falta un valor entero por franja: la barra y el anillo leen **un solo número**, las kcal consumidas del día. Basta con **declarar el reparto** (criterio 1, segunda rama) y derivar ese número en dominio, sin persistir nada ni exponer una lista por franja (D2, D3) | Las filas de comida del Make pintan hora y porción en gramos, no kcal: `grep -n "meal.time} · {meal.portion" specs/mobile-figma-polish/design-src/App.tsx` |

---

## Decisiones (detalle en [[design]])

| Id | Decisión | Estado |
|---|---|---|
| **D1** | **#104 = backend; la tarjeta móvil va en #113** `mobile-kcal-consumed-bar` (`pending`, P3, bloqueada hasta que #104 esté en `main`). Mismo corte que #83/#98 | **Firmada por el humano el 2026-09-23 (Notion)** |
| D2 | **Reparto uniforme**: cada franja vale `merKcal / mealsPerDay` (sin redondear); las kcal consumidas son `Math.round(merKcal · servidas / mealsPerDay)`, redondeo **único** sobre el agregado, mitad hacia arriba | firmar = aceptar |
| D3 | **Un solo campo nuevo** en el `GET` del plan: `kcalConsumedToday: number`, tras `servedToday`. Sin lista por franja, sin tocar `generate` ni el perfil | firmar = aceptar |
| D4 | **Derivado al leer, nunca guardado**: siempre con el plan vigente y las franjas de `servedToday`; si el plan cambia a mitad de día, las franjas servidas se revalúan con el plan nuevo y las que ya no están en él dejan de contar | firmar = aceptar |
| D5 | **"El día" es el de #83, sin redefinirlo**: `kcalConsumedToday` se calcula en la misma llamada y con la misma lista `servedToday` que ya usa `ownerLocalDay` | firmar = aceptar |

---

## Contrato HTTP (resumen; el detalle normativo está en cada R)

| Verbo y ruta | Cambio | Valor de `kcalConsumedToday` |
|---|---|---|
| `GET /v1/pets/:petId/nutrition-plan` con plan | clave nueva `kcalConsumedToday: number` (entero ≥ 0), la última del objeto, tras `servedToday` | `Math.round(merKcal · servedToday.length / mealsPerDay)` con el plan devuelto; `0` si `servedToday` es `[]`; `merKcal` exacto si están todas servidas; nunca mayor que `merKcal` |
| `GET /v1/pets/:petId/nutrition-plan` sin plan | sin cambios: `404 NUTRITION_PLAN_NOT_FOUND` | no hay cuerpo de plan, así que no hay clave |
| `POST /v1/pets/:petId/nutrition-plan/generate` | sin cambios (11 claves, R19 de #17) | **ausente** |
| `POST …/meals`, `DELETE …/meals/:mealTime` | sin cambios | el siguiente `GET` refleja la franja servida o deshecha |
| `GET /v1/pets/:petId`, `GET /v1/pets` | sin cambios (`mealsToday` sigue siendo `{ served, total } \| null`) | no se añade |

---

## Requisitos funcionales

### R1 — `kcalConsumed` reparte `merKcal` a partes iguales y redondea una sola vez el agregado

**WHEN** se invoca
`kcalConsumed(merKcal: number, mealsPerDay: number, servedCount: number): number`
(exportada desde `src/modules/nutrition/domain/entities/meal-serving.entity.ts`,
junto a `servedInPlan`, sin IO ni imports de framework),
**THE SYSTEM SHALL** devolver `Math.round((merKcal * servedCount) / mealsPerDay)`,
de modo que: `servedCount = 0` da `0`; `servedCount = mealsPerDay` da
**exactamente** `merKcal`; el valor solo depende del **número** de franjas
servidas (no de cuáles); y una mitad exacta se redondea hacia arriba
(`Math.round` sobre positivos).

**Casos literales, calculados a mano** (ninguno se obtiene llamando a código
de producción):

| `merKcal` | `mealsPerDay` | `servedCount` 0…n | Esperado | Cuenta |
|---|---|---|---|---|
| 1059 | 2 | 0, 1, 2 | `[0, 530, 1059]` | 1059/2 = 529,5 → 530 (mitad hacia arriba) |
| 1000 | 3 | 0, 1, 2, 3 | `[0, 333, 667, 1000]` | 333,33 → 333; 666,67 → 667; incrementos 333 + 334 + 333 = 1000 |
| 1001 | 4 | 0, 1, 2, 3, 4 | `[0, 250, 501, 751, 1001]` | 250,25 → 250; 500,5 → 501; 750,75 → 751 |

**Test (rojo primero)** —
`src/modules/nutrition/domain/entities/meal-serving.entity.spec.ts`
(existente; se añade un `describe` **después** del de R11 de #83, sin tocar
este):
`describe('R1 (nutrition-kcal-consumed #104): kcalConsumed reparte merKcal a partes iguales y redondea una sola vez el agregado')`
con tres `it`, uno por fila de la tabla, cada uno con
`expect([0, 1, …, n].map((served) => kcalConsumed(<merKcal>, <n>, served))).toEqual(<literal>)`:
`it('reparte 1059 kcal en 2 franjas redondeando la mitad hacia arriba')`,
`it('reparte 1000 kcal en 3 franjas y la suma de incrementos es el total')`,
`it('reparte 1001 kcal en 4 franjas')`. Rojo: `kcalConsumed` no se exporta
todavía (artefacto bajo prueba, precedente #83 R11); el candado real son los
literales.

### R2 — `GET /v1/pets/:petId/nutrition-plan` devuelve `kcalConsumedToday`; `generate` no

**WHEN** un miembro activo solicita `GET /v1/pets/:petId/nutrition-plan` y la
mascota tiene plan,
**THE SYSTEM SHALL** responder `200` con **exactamente** las 12 claves que
devuelve hoy (las 11 de `NutritionPlanResponse` más `servedToday`) **más**
`kcalConsumedToday`, cuyo valor es
`kcalConsumed(plan.merKcal, plan.mealsPerDay, servedToday.length)` (R1) con
el plan y la lista `servedToday` **de esa misma respuesta**: `0` si
`servedToday` es `[]`, y el valor recalculado en el siguiente `GET` tras cada
`POST …/meals` (sube) o `DELETE …/meals/:mealTime` (baja);

**AND** `POST /v1/pets/:petId/nutrition-plan/generate` **SHALL NOT** incluir
`kcalConsumedToday` (R19 de #17 intacto, como `servedToday` en #83 C5); el
`404 NUTRITION_PLAN_NOT_FOUND` del `GET` sin plan **SHALL** seguir igual.

**Deltas declarados sobre candados ajenos** (en el **mismo commit rojo**;
ninguno más cambia):

1. `test/meals.e2e-spec.ts`, dentro de
   `describe('R9 (meals-served-tracking #83): …')`, el array de claves que
   contiene `'servedToday',` gana `'kcalConsumedToday',` justo después
   (12 → 13 claves).
2. `test/nutrition.e2e-spec.ts`: la línea
   `expect(latest.body).toEqual({ ...second.body, servedToday: [] });` pasa a
   `expect(latest.body).toEqual({ ...second.body, servedToday: [], kcalConsumedToday: 0 });`
   (Prettier puede partirla en varias líneas; el contenido es ese).

**Test (rojo primero)** — `test/meals.e2e-spec.ts` (existente; `describe`
nuevo **al final** del `describe('Meals served tracking (e2e)', …)`
exterior, tras el `describe('R10 (meals-served-tracking #83): …')`, reusando
sus helpers `seedUser`, `seedPet`, `seedPlan`, `serveMeal`, `unserveMeal`,
`getPlan`, que ya existen):
`describe('R2 (nutrition-kcal-consumed #104): GET nutrition-plan devuelve kcalConsumedToday de las franjas servidas hoy y generate no')`,
`it('vale 0 sin servidas, sube al servir, baja al deshacer y no aparece en generate')`:
`owner = await seedUser('kcal-r2')`, `pet = await seedPet(owner)`,
`generated = await seedPlan(owner, pet.id)`;
precondición `expect(generated.body).toMatchObject({ merKcal: 1059, mealsPerDay: 2, mealTimes: ['07:30', '19:30'] })`
(P10) y `expect(generated.body).not.toHaveProperty('kcalConsumedToday')`;
luego, cada paso seguido de `getPlan(owner, pet.id).expect(200)` y
`toMatchObject`:

| Paso | `servedToday` | `kcalConsumedToday` |
|---|---|---|
| (ninguno) | `[]` | `0` |
| `serveMeal '07:30'` → 201 | `['07:30']` | `530` |
| `serveMeal '19:30'` → 201 | `['07:30', '19:30']` | `1059` |
| `unserveMeal '19:30'` → 204 | `['07:30']` | `530` |
| `unserveMeal '07:30'` → 204 | `[]` | `0` |

Rojo legítimo: la clave no existe, así que `toMatchObject` falla por
`kcalConsumedToday` (y también la lista de claves del delta 1 y el `toEqual`
del delta 2).

### R3 — `kcalConsumedToday` usa el mismo día civil del owner que `servedToday` (requisito de verificación, vía (a))

**WHEN** el owner está en `Pacific/Kiritimati` (UTC+14) o en
`Pacific/Pago_Pago` (UTC-11) y se sirve una franja,
**THE SYSTEM SHALL** contarla en `kcalConsumedToday` del `GET` inmediato
(`servedToday: ['07:30']`, `kcalConsumedToday: 530`): el día de la lectura es
el mismo `ownerLocalDay` con el que #83 guardó `served_on`, nunca el día UTC
del servidor ni uno que mande el cliente (D5);

**AND WHEN** la única fila de la mascota es de **ayer** del owner,
**THE SYSTEM SHALL** responder `servedToday: []` y `kcalConsumedToday: 0`.

Con los dos extremos, a cualquier hora UTC a la que se corra el test uno de
los dos días civiles difiere del día UTC (Kiritimati desde las 10:00 UTC,
Pago_Pago antes de las 11:00 UTC): el caso detecta a cualquier hora una
lectura con el día equivocado.

**Requisito de verificación, vía (a) de C4** (declarado aquí, antes del
handoff): asevera una propiedad que implementa el verde de R2. Su test se
commitea en **rojo antes** de ese verde ([[tasks]] §Orden), así que su rojo es
real (la clave no existe).

**Test** — `test/meals.e2e-spec.ts`,
`describe('R3 (nutrition-kcal-consumed #104): kcalConsumedToday usa el mismo dia civil del owner que servedToday')`,
dos `it`:
(a) `it('cuenta la franja servida hoy en los dos extremos de zona horaria')`:
bucle sobre `['Pacific/Kiritimati', 'Pacific/Pago_Pago'].entries()` con
`seedUser(\`kcal-r3-tz-${index}\`, timezone)`, `seedPet`,
`seedPlan(owner, pet.id, timezone)`, `serveMeal '07:30'` → `201` con
`servedOn === localDayOf(Date.now(), timezone)`, y `getPlan` →
`toMatchObject({ servedToday: ['07:30'], kcalConsumedToday: 530 })`;
(b) `it('no cuenta una franja servida ayer')`: owner `UTC`, `seedPlan`,
`db.insert(mealServings).values({ id: uuidv7(), petId: pet.id, servedOn: shiftDay(localDayOf(Date.now(), 'UTC'), -1), mealTime: '07:30', createdBy: owner.id })`
(mismo molde que el R5 de #83) y `getPlan` →
`toMatchObject({ servedToday: [], kcalConsumedToday: 0 })`. `localDayOf`,
`shiftDay`, `uuidv7` y `mealServings` ya se importan en el fichero.

### R4 — tras cambiar el plan, `kcalConsumedToday` se recalcula con el plan vigente (requisito de verificación, vía (a))

**WHILE** hay franjas servidas hoy y existe un plan más reciente que aquel
con el que se sirvieron (fila más reciente en `nutrition_plans`, la que
devuelve `findLatestPlan`),
**THE SYSTEM SHALL** calcular `kcalConsumedToday` con `merKcal` y
`mealsPerDay` **del plan nuevo** y con `servedToday` del plan nuevo (D4 de
#83: solo cuentan las franjas que están en su `mealTimes`):

- mismas franjas, `merKcal` distinto ⇒ las servidas se **revalúan** con el
  `merKcal` nuevo (no se conserva el valor de cuando se sirvieron);
- otras franjas y otro `mealsPerDay` ⇒ las servidas del plan anterior dejan
  de contar (`0` hasta servir alguna del nuevo) y el reparto usa el
  `mealsPerDay` nuevo.

**Requisito de verificación, vía (a) de C4**, igual que R3.

**Test** — `test/meals.e2e-spec.ts`,
`describe('R4 (nutrition-kcal-consumed #104): tras cambiar el plan kcalConsumedToday se recalcula con el plan vigente')`,
dos `it`. El plan nuevo se inserta directo, como en el R10 de #83
(`generated_at DEFAULT now()` lo hace vigente):
(a) `it('revalua las franjas servidas cuando cambia merKcal con las mismas franjas')`:
`seedPlan` → `serveMeal '07:30'` → `getPlan` `kcalConsumedToday: 530` →
`db.insert(nutritionPlans).values({ id: uuidv7(), petId: pet.id, rerKcal: 500, merKcal: 800, dailyGrams: 230, mealsPerDay: 2, mealTimes: ['07:30', '19:30'], objective: 'maintenance', warnings: [], aiExplanation: null, inputsHash: 'e'.repeat(64) })`
→ `getPlan` → `toMatchObject({ merKcal: 800, servedToday: ['07:30'], kcalConsumedToday: 400 })`
(800 · 1 / 2 = 400);
(b) `it('excluye las franjas fuera del plan vigente y reparte con su mealsPerDay')`:
`seedPlan` → `serveMeal '07:30'` →
`db.insert(nutritionPlans).values({ id: uuidv7(), petId: pet.id, rerKcal: 625, merKcal: 1000, dailyGrams: 285, mealsPerDay: 3, mealTimes: ['08:00', '13:00', '20:00'], objective: 'maintenance', warnings: [], aiExplanation: null, inputsHash: 'f'.repeat(64) })`
→ `getPlan` → `toMatchObject({ servedToday: [], kcalConsumedToday: 0 })` →
`serveMeal '08:00'` → `getPlan` → `333` → `serveMeal '13:00'` → `667` →
`serveMeal '20:00'` → `1000` (cada `serveMeal` con `.expect(201)` y cada
`getPlan` con `toMatchObject` sobre `kcalConsumedToday`; los tres valores
son la fila 1000/3 de R1). `nutritionPlans` ya se importa en el fichero.

---

## Candados

### Se mueven (delta declarado; ninguno más)

| Fichero (ancla grepeable) | Antes | Después | Por | Commit |
|---|---|---|---|---|
| `test/meals.e2e-spec.ts`, array con `'servedToday',` en `describe('R9 (meals-served-tracking #83): …')` | 12 claves | + `'kcalConsumedToday'` (13) | R2 | rojo de R2 |
| `test/nutrition.e2e-spec.ts`, `expect(latest.body).toEqual({ ...second.body, servedToday: [] });` | `{ ...second.body, servedToday: [] }` | `{ ...second.body, servedToday: [], kcalConsumedToday: 0 }` | R2 | rojo de R2 |

Los `describe` nuevos (R1 en `meal-serving.entity.spec.ts`, R2-R4 en
`test/meals.e2e-spec.ts`) se **añaden**; no cambian ningún test existente.
El número de suites no cambia (ningún fichero de test nuevo), así que
`docs/conventions.md` (recuento de suites e2e) no se toca.

### Siguen verdes sin tocarlos (si alguno se pone rojo, la implementación está mal, no el candado)

| Candado | Qué fija |
|---|---|
| `describe('R11 (meals-served-tracking #83): …')` en `meal-serving.entity.spec.ts` | `servedInPlan` no cambia |
| Resto de `test/meals.e2e-spec.ts` (R2-R10 de #83, salvo la lista de R9) | POST/DELETE, 409/422/404, `servedToday`, `mealsToday` |
| Resto de `test/nutrition.e2e-spec.ts` (R16-R27 de #17, salvo el `toEqual` de R24) | `generate` con 11 claves (R19), 404 sin plan, guard, `aiExplanation` |
| Las seis listas de claves del perfil (con `'mealsToday'`: `pet-profile-response.mapper.spec.ts`, `pets.controller.spec.ts`, `test/pets.e2e-spec.ts`, `test/devices.e2e-spec.ts`, `test/device-subscriptions.e2e-spec.ts`, `test/pet-lost-mode.e2e-spec.ts`) | el perfil no gana claves (D3) |
| `serve-meal.use-case.spec.ts`, `unserve-meal.use-case.spec.ts` | escritura y "el día" de #83 no cambian |
| `src/modules/pets/application/owner-local-day.spec.ts`, `src/pipeline/local-day.spec.ts` | helpers de día civil, sin cambios |
| `src/db/schema/*.schema.spec.ts`, `src/db/migrations/` | cero migraciones |
| `src/modules/nutrition/nutrition-scope.spec.ts` | nada nuevo introduce `OPENAI_`/`gpt-` |
| `mobile-pet-tracker/**` | no se toca (P7; la UI es #113) |

---

## Cobertura de los criterios de aceptación de `feature_list.json` #104

| Criterio (tras D1) | Cubierto por | Nota |
|---|---|---|
| 1. El plan desglosa kcal por franja, **o la spec declara por escrito qué reparto usa y por qué** | D2 ([[design]]) + R1 | Segunda rama: reparto uniforme, declarado y probado con literales; sin lista por franja (C2) |
| 2. `GET` del plan devuelve las kcal consumidas del día derivadas de las comidas servidas, con test e2e | R2, R3, R4 (e2e en `test/meals.e2e-spec.ts`) | "Del día" = definición de #83 (P5, D5) |
| (antes 3 y 4: tarjeta «Objetivo diario», dependencias, suite móvil) | **#113** | D1, firmada el 2026-09-23 |

Sin gate humano propio: todo lo observable lo cubren los e2e, y el reviewer
corre `./init.sh`. El smoke con la tarjeta pintada es el gate de #113 (dev
build de Android).

---

## Fuera de alcance (cada viñeta clasificada y con su premisa verificada)

- **Pintar el progreso en `food.tsx`, tipo `NutritionPlan` móvil, copy i18n**
  — *delimitación* (D1): es **#113** `mobile-kcal-consumed-bar`. Verificado:
  hoy `food-plan-card` en `food.tsx` pinta `food-plan-kcal`, `food-plan-grams`
  y un tile con `<ForkKnife`, sin barra ni anillo.
- **Exponer kcal por franja (`number[]`)** — *delimitación*: ningún consumidor
  la lee; las filas del Make muestran gramos, no kcal (C2).
- **kcal consumidas en `GET /v1/pets/:petId` (`mealsToday`)** —
  *delimitación*: la Home del Make no pinta kcal (verificado:
  `grep -n "calories" specs/mobile-figma-polish/design-src/App.tsx` solo cae
  en los datos de las mascotas, en `FoodScreen` y en `MealScheduleScreen`).
- **kcal consumidas en `generate`** — *delimitación*: R19 de #17 congela sus
  11 claves (mismo criterio que `servedToday`, #83 C5).
- **kcal de días anteriores o `GET` con fecha** — *deuda ya registrada*:
  **#105** `meals-history` (`pending`); el puerto solo lee un día
  (`listTimesServedOn(petId, servedOn)` en `meal-serving.repository.ts`).
- **Porción realmente comida (sobras)** — *delimitación*: el backend solo
  sabe qué franja se **sirvió**; "consumida" = ración de la franja servida,
  entera ([[design]] D3). Nadie lo ha pedido; si aparece, feature con id.
- **Reparto no uniforme (desayuno más grande, etc.)** — *delimitación*: el
  repo no tiene constante clínica para eso (P2: las horas son fijas y "no
  repartidas algorítmicamente") y la app ya pinta la ración a partes iguales
  (P6).
- **Snacks o comidas fuera del plan** — *delimitación*: `POST …/meals` solo
  acepta franjas del plan vigente (`MEAL_TIME_NOT_IN_PLAN`, #83 R4).
- **Migraciones, cambios de puerto, `docs/data-model.md`** — *delimitación*:
  no cambia ninguna tabla (D4). Ningún doc describe la respuesta del `GET`
  del plan (`grep -rln "nutrition-plan" docs/` → 0), así que no hay doc que
  actualizar.

---

## Aprobación

Firmar sin editar = aprobar **D1** (partición backend/móvil, con #113 ya
creada en `feature_list.json`) y aceptar D2-D5 de [[design]] tal cual, en
particular **D2** (reparto uniforme con un solo redondeo) y **D4** (si el plan
cambia a mitad de día, las franjas servidas se revalúan con el plan nuevo).

- [x] Aprobado por humano (fecha: 2026-09-23, vía Notion) ← gate obligatorio antes de implementar

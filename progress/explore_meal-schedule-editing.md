# explore: meal-schedule-editing
Fecha: 2026-10-02 · base `4e8d6cc3` (origin/main, branch `feature/103-meal-schedule-editing`)

> Esto es una hipótesis de trabajo para el `spec_author`, no una spec. Toda
> evidencia cita ruta y contenido grepeable a `4e8d6cc3`, no números de línea.
> No se ha corrido nada (ni init.sh, ni jest, ni e2e, ni drizzle-kit).

## 0. Premisas de `feature_list.json` que ya no son ciertas

La entrada #103 (`"name": "meal-schedule-editing"`) arrastra cuatro premisas
que la spec no debe copiar:

1. **"(324 lineas …)"**: `mobile-pet-tracker/src/screens/meal-schedule/index.tsx`
   tiene hoy **302** líneas (`wc -l`). La afirmación de fondo sigue siendo cierta:
   la pantalla es de solo lectura y el fichero no tiene ni `postJson`, ni `deleteJson`,
   ni `method:`. Lo mismo vale para `specs/mobile-meals-served-ui/requirements.md`,
   que cita "sus 324 líneas".
2. **"una decision de diseno que #83 dejo abierta en su D4"**: #83 **no** dejó
   abierta la D4. La decidió, pero sobre una premisa que #103 rompe (ver §2).
3. **`specs/mobile-food/requirements.md:306-309`**: es un número de línea que
   caduca. El ancla grepeable es `Añadir comida` del diseño no son implementables
   sin backend nuevo.~~` (hoy en la 309), tachada por
   `**Retirado por la Enmienda #98:**`.
4. **`files_affected`** solo lista `backend-pet-tracker/src/modules/nutrition/`
   y la pantalla. Faltan como mínimo:
   - `mobile-pet-tracker/src/api/nutrition.ts`;
   - `src/api/http.ts`, que no tiene helper PATCH/PUT, ver §3.4;
   - `src/i18n/catalog.ts` y sus candados;
   - `src/screens/meal-schedule/index.test.tsx`;
   - `backend-pet-tracker/test/` (e2e);
   - `docs/data-model.md`.

Además hay una tensión dentro de la propia entrada:
- La descripción habla de "una franja que el usuario **borra** o mueve".
- El criterio 1 dice "editada o **borrada**".
- El criterio 2 solo pide "**editar y anadir** franja".
- El diseño no dibuja botón de borrar (§3.2).

Esa tensión es la decisión 3.

---

## Contexto encontrado

### 1. Backend: modelo actual

**1.1 De dónde sale `mealTimes`**

- `backend-pet-tracker/src/modules/nutrition/domain/nutrition.constants.ts`
  - Lleva el comentario `/** C-6: horarios locales fijos, no repartidos algorítmicamente. */`
    y la tabla `MEAL_TIMES_BY_COUNT`:
    - 2 comidas: `['07:30','19:30']`;
    - 3 comidas: `['07:30','14:00','19:30']`;
    - 4 comidas: `['07:00','11:00','15:00','19:00']`.
- `domain/nutrition-engine.ts` contiene `mealTimes: [...MEAL_TIMES_BY_COUNT[mealsPerDay]]`.
  Los horarios se derivan **solo** de `mealsPerDay`, y `mealsPerDay` lo calcula
  el motor.
- `src/db/schema/nutrition.schema.ts`, tabla `nutritionPlans`:
  - `mealTimes: jsonb('meal_times').$type<string[]>()`;
  - `mealsPerDay` con check `nutrition_plans_meals_per_day_check`, entre 1 y 6;
  - `inputsHash: char('inputs_hash', { length: 64 })`;
  - `generatedAt` con `.defaultNow()`;
  - `id: uuid('id')`, generado con `uuidv7()` en
    `infrastructure/repositories/nutrition.drizzle.repository.ts`, así que el
    id ordena por tiempo.
- `docs/data-model.md`, fila `nutrition_plans`: `meals_per_day integer NOT NULL CHECK (1..6)`
  y "sin UNIQUE por hash".
- `specs/meals-served-tracking/requirements.md`, propiedad **P2**:
  "`mealTimes.length === mealsPerDay` siempre | **cierta por construcción**".
  Hoy nada la defiende en la base: no hay check de longitud del jsonb. La
  sostiene solo el motor.

**1.2 Regeneración y hash**

- `application/nutrition-input-hash.ts`: `mealTimes` **no** entra en el hash.
- `application/use-cases/generate-nutrition-plan.use-case.ts`:
  - si `if (latestPlan?.inputsHash === inputsHash) return latestPlan;`, devuelve
    el plan existente;
  - si no, llama a `insertPlan`.
  - `calculateAgeMonths(pet, new Date())` mete la edad en el input, así que el
    hash puede cambiar solo con el paso del tiempo.
- El plan es **append-only**:
  - el puerto `domain/ports/nutrition.repository.ts` tiene `findProfile`,
    `upsertProfile`, `findLatestPlan` e `insertPlan`, y **ningún** `update`;
  - `findLatestPlan` ordena con
    `.orderBy(desc(nutritionPlans.generatedAt), desc(nutritionPlans.id))`.
- `test/nutrition.e2e-spec.ts` R21, `'mismo input devuelve el mismo plan sin fila nueva'`,
  asevera que se devuelve el mismo id.
- **Choque con #18.** En `feature_list.json`, #18 `nutrition-ai-explainer` está
  pending con el criterio `"Hash hit no re-llama a la IA"`. Su rama remota
  `origin/feature/18-nutrition-ai-explainer` está obsoleta: es de 2026-08-18,
  anterior a #83. Aun así enseña la intención:
  - `nutrition.repository.ts` gana `setAiExplanation(planId, explanation)`;
  - en un hash hit con `aiExplanation === null` llama a
    `enrich(latestPlan, input, computePlan(input))`;
  - `infrastructure/ai/nutrition-prompt.ts` envía `mealTimes: result.mealTimes`,
    o sea los del motor, no los guardados.

  Ver riesgo R1.

**1.3 `meal_servings`**

- `nutrition.schema.ts`, tabla `mealServings`:
  - `servedOn` es una `date`, el día civil del owner;
  - `mealTime varchar(5)`;
  - `uniqueIndex('meal_servings_pet_id_served_on_meal_time_idx')`.
- **No hay FK al plan ni a la franja.** Una servida se liga a la franja solo por
  igualdad de texto `HH:MM` dentro del mismo `servedOn`.
- `docs/data-model.md`, fila `meal_servings`: "Cualquier miembro activo escribe (D2 de #83)".
- El día civil sale de `ownerLocalDay` en
  `src/modules/pets/application/owner-local-day.ts`. Lo usan
  `serve-meal.use-case.ts`, `unserve-meal.use-case.ts`,
  `get-nutrition-plan.use-case.ts` y `pets/.../get-pet.use-case.ts`
  (`const today = await ownerLocalDay(this.pets, petId, now);`).

**1.4 Puertos que leen franjas: todos tendrán que ver los horarios editados**

| Lector | Qué hace con `mealTimes` |
|---|---|
| `domain/ports/meal-serving.repository.ts` | `create`, `deleteOne`, `listTimesServedOn`. No sabe nada del plan |
| `domain/entities/meal-serving.entity.ts` | `servedInPlan` hace `mealTimes.filter(m => served.includes(m))` y **duplica** la cuenta si `mealTimes` tiene repetidos. `kcalConsumed` hace `Math.round(merKcal*servedCount/mealsPerDay)` |
| `application/use-cases/get-nutrition-plan.use-case.ts` | `ownerLocalDay`, después `listTimesServedOn`, después `servedInPlan(plan.mealTimes, served)` y `kcalConsumed(plan.merKcal, plan.mealsPerDay, …)` |
| `application/use-cases/serve-meal.use-case.ts` | `!plan.mealTimes.includes(dto.mealTime)` lanza `MealTimeNotInPlanError` (422) |
| `application/use-cases/unserve-meal.use-case.ts` | **No** consulta el plan (R7 de #83: "el `DELETE` **no** consulta el plan") |
| `infrastructure/repositories/pet-meals.drizzle-reader.ts` (puerto `pets/domain/ports/pet-meals-reader.ts`, `findMealsToday(petId, day)`) | Lee **directo de la tabla** `nutritionPlans` con su propio `orderBy(desc(generatedAt), desc(id))`, sin pasar por `findLatestPlan`. Devuelve `served: servedInPlan(...).length` y `total: plan.mealsPerDay` |

Consecuencia: si los horarios editados vivieran fuera de la fila del plan
(modelo M3, §Decisiones), habría que tocar los cinco puntos, incluido el
reader, que esquiva el repositorio.

**1.5 Patrón de endpoint**

- Controladores:
  - `nutrition.controller.ts` usa `@Controller('pets/:petId')`. `@Put('nutrition-profile')`
    y `POST nutrition-plan/generate` son owner-only, con
    `PetAccessGuard` y `@RequirePetRole('owner')`;
  - `meals.controller.ts` usa `@Controller('pets/:petId/meals')` **sin**
    `@RequirePetRole`, con `POST` y `@Delete(':mealTime')` que devuelve 204. Es
    la excepción deliberada de la D2 de #83:
    `specs/meals-served-tracking/design.md`, "**excepción deliberada** al patrón owner-only".
- DTO y validación:
  - `meal.dto.ts` declara `MEAL_TIME_PATTERN = /^\d{2}:\d{2}$/`, que **acepta
    `99:99`**. "Validar `HH:MM` como hora real" quedó fuera de alcance de #83;
  - el cuerpo se valida con `z.strictObject` y un `parseBody` local, que responde
    400 `Validation failed`.
- Errores: `nutrition-error.mapper.ts` traduce a 422, 409 o 404 con su `code`.
  Por ejemplo `MEAL_ALREADY_SERVED`, `MEAL_SERVING_NOT_FOUND`,
  `MEAL_TIME_NOT_IN_PLAN` y `NUTRITION_PLAN_REQUIRED`.
- Auditoría: solo `serve-meal` y `unserve-meal` inyectan `AUDIT_LOGGER`
  (`action: 'meal.serve'` / `action: 'meal.unserve'`). Generar plan y PUT perfil
  **no** auditan.
- Sin entitlement: en `test/nutrition.e2e-spec.ts` R25 existe el test
  `'anti-vacio: el owner genera sin suscripcion'`, y
  `'permite lectura al miembro y rechaza sus escrituras con 403'`.
- Precedentes de rutas `@Patch`:
  - `vaccines.controller.ts @Patch(':vaccineId')`;
  - `pets.controller.ts @Patch(':petId')`;
  - `geofences.controller.ts @Patch(':geofenceId')`;
  - `users.controller.ts @Patch()`;
  - `reminders.controller.ts @Patch(':id')`.
- Precedente de escritura en dos tablas dentro de una transacción:
  `geofences/infrastructure/repositories/geofence.drizzle.repository.ts`, cuyo
  `async update(` hace `this.db.transaction(async (tx) =>` y resetea el
  `geofenceState` (#145).

**1.6 Patrón e2e**

`test/meals.e2e-spec.ts`, `describe('Meals served tracking (e2e)'`:
- monta `AppModule` contra Postgres real (`DRIZZLE`);
- firma tokens con `TOKEN_SERVICE`;
- siembra con `seedUser`, `seedPet` y `seedPlan(owner, petId, timezone = 'UTC')`;
- calcula días con `localDayOf` y `shiftDay` de `@/pipeline/local-day`;
- asevera filas en `auditLog`;
- un describe por R-id, con prefijo `R<n> (meals-served-tracking #83)` o
  `R<n> (nutrition-kcal-consumed #104)`.

Tests que #103 toca de lleno:
- `'R10 … excluye las franjas del plan anterior tras regenerar'` inserta un
  plan con `inputsHash: 'f'.repeat(64)`;
- `'R4 (nutrition-kcal-consumed #104): tras cambiar el plan kcalConsumedToday se recalcula con el plan vigente'`.

Lo natural es un e2e nuevo para #103 sobre este mismo patrón de siembra.

**1.7 Migraciones**

- `backend-pet-tracker/src/db/migrations/meta/_journal.json` tiene 18 entradas.
  La última es idx 17, `0017_meal_servings`, con fichero `0017_meal_servings.sql`.
  origin/main es idéntico.
- Si hiciera falta una migración, sería la **0018**.
- `docs/conventions.md` exige dos cosas:
  - "Nunca apliques una migración con `psql` crudo";
  - la sección "Migraciones destructivas".

### 2. D4 de #83: qué decidió y por qué #103 la reabre

Cita grepeable en `specs/meals-served-tracking/design.md`:

> **D4 — Plan regenerado: cuenta solo lo que está en el plan vigente** — …
> `mealTimes` solo cambia si cambia `mealsPerDay` (P2), pero puede pasar a mitad
> de día. Las servidas "huérfanas" quedan guardadas (auditoría, historial) y
> fuera del conteo, así `served ≤ total` siempre.

`specs/meals-served-tracking/requirements.md` lleva la fila de tabla
"**Plan regenerado.**".

La D4 está decidida, pero **sobre la premisa "mealTimes solo cambia si cambia
`mealsPerDay`"**. #103 la invalida: con edición, una franja puede moverse sin
que cambie `mealsPerDay`, y lo puede hacer el usuario, a mitad de día y con una
servida hecha.

Qué pasa hoy si `mealTimes` cambia y se aplica la D4 tal cual (opción A de la
decisión 2):
- **Conteo de hoy.** La servida de `07:30` movida a `08:00` queda huérfana:
  `servedToday` pierde una franja, `kcalConsumedToday` baja y `mealsToday.served`
  del perfil baja. `served ≤ total` se mantiene.
- **UI de #98.** `src/app/(tabs)/food.tsx` pinta la franja `08:00` como
  **pendiente**, y el usuario puede volver a servir la misma comida. La huérfana
  `07:30` desaparece de la UI, así que solo se puede deshacer por API.
- **Resurrección.** Si después se añade o se mueve otra franja **a** `07:30` el
  mismo día, la huérfana vuelve a contar como servida sin que nadie la sirva.
- **Zona horaria.** "Hoy" es `ownerLocalDay`, que depende de la zona del **owner**
  y no de quien edita. Migrar una servida "de hoy" (opción B) tiene que usar el
  mismo día, o un miembro en otra zona movería la fila equivocada. Los días
  pasados no se tocan en ninguna opción razonable: son historial.

### 3. Móvil

**3.1 Estado de la pantalla**

- El route delgado es `mobile-pet-tracker/src/app/meal-schedule.tsx`:
  `export default function MealScheduleRoute() { return <MealScheduleScreen />; }`.
- `src/app/_layout.tsx` declara
  `<Stack.Screen name="meal-schedule" options={{ ...headerOptions, title: t('mealSchedule.mealSchedule') }} />`.
  No hay `headerRight` en ningún sitio de `src/`.
- `src/screens/meal-schedule/index.tsx` (302 líneas):
  - `MealScheduleScreen` redirige a `/food` sin mascota seleccionada;
  - `MealScheduleContent` usa `useQuery` con `nutritionKeys.plan(petId)` y
    `nutritionKeys.profile(petId)`;
  - las filas salen de `loadedPlan.mealTimes.map((mealTime, index) =>`, cada una
    un `Card` con `key={`${mealTime}-${index}`}` y `testID={`meal-time-row-${index}`}`,
    con disco `Clock`, hora y `portionGrams = Math.round(loadedPlan.dailyGrams / loadedPlan.mealsPerDay)`;
  - **no** pinta servida ni toggle. Eso vive en Food (#98);
  - la única escritura es `handleGenerate`, que en `'ok'` llama a `plan.refetch()`
    y traduce 403 a `mealSchedule.errorForbidden`;
  - el padding sigue la Enmienda A11 de `docs/ui-guidelines.md`:
    `padding: 24`, `gap: 16`, `paddingBottom: insets.bottom + 24`.
- Su test es `src/screens/meal-schedule/index.test.tsx`:
  - mockea `jest.mock('../../api/nutrition', () => ({ generateNutritionPlan, getNutritionPlan, getNutritionProfile }))`,
    así que **toda función nueva del cliente hay que añadirla a ese mock**;
  - cuenta filas con `getAllByTestId(/^meal-time-row-/)`.

**3.2 Botones del diseño**

**Figma MCP:** `get_design_context` sobre el Make devolvió solo enlaces de
recurso `file://figma/make/source/...`. En esta sesión no hay herramienta para
leer recursos MCP, así que **no se pudo leer el Make actual**.

Fallback: el volcado `specs/mobile-figma-polish/design-src/App.tsx` del
2026-08-23, función `function MealScheduleScreen`. **Puede diferir del Make
vigente**, y conviene que el humano lo confirme. En ese volcado:

- El botón de cabecera, sobre la foto, es `<Plus size={11} /> Añadir comida`.
- Cada fila lleva:
  - un badge `✓ Servido` / `Pendiente`;
  - el botón `✏️ Editar horario`;
  - el botón `✓ Marcar servido`.
- **No hay botón de borrar**, y **no hay formulario ni diálogo** de edición
  dibujado.
- Las comidas tienen **nombre** (Desayuno 07:00, Comida 12:00, Cena 18:00) y
  **porciones distintas** (200, 200 y 180 g). El backend no modela ni lo uno ni
  lo otro.
- También hay:
  - un resumen "Raciones {meals.length} comidas/día";
  - un select "Alimento principal";
  - una tarjeta "Recordatorios activos".

  Los tres quedan fuera de #103 salvo que se decida lo contrario.

Dónde irían:
- **Añadir comida**: hoy la pantalla no tiene cabecera propia (#95 R5, describe
  `'#95 R5: la pantalla no dibuja cabecera propia'`) y no hay precedente de
  `headerRight`. El sitio sin precedente nuevo es el cuerpo, después de la lista
  `meal-time-row-*` y antes o junto a `generate-plan-button`.
- **Editar horario**: va por fila, dentro del `Card` `meal-time-row-${index}`.
  Abre el selector de hora (§3.4).
- **Marcar servido**: ya existe en Food (#98). Duplicarlo en meal-schedule **no**
  está en los criterios de #103.

**3.3 Patrón de refetch de #98**

En `src/app/(tabs)/food.tsx`, `async function toggleMeal(mealTime: string, served: boolean)`:
- guarda contra doble pulsación con `pendingMealTime`;
- llama a `(served ? unserveMeal : serveMeal)(...)`;
- después hace `await plan.refetch();` y
  `await queryClient.refetchQueries({ queryKey: petKeys.detail(selectedPetId) });`;
- da háptica con `Haptics.notificationAsync(...)`.

No usa estado optimista ni `useMutation` (TanStack Query 5.102.8 está instalado,
pero no hay `useMutation` en producción).

#103 necesita los **dos** refetch, por dos motivos:
- cambia la lista y la porción, que salen de `nutritionKeys.plan`;
- cambian el total y lo servido de la barra de Home, que salen de
  `petKeys.detail`, por `mealsToday`.

**3.4 Cliente HTTP, componentes y selector de hora**

- `src/api/http.ts` exporta `GetResult`, `apiUrl`, `getJson`, `postJson`,
  `deleteJson(…, body?)` y `readJson`.
  - **No hay `patchJson` ni `putJson`.**
  - El único `method: 'PUT'` está en `src/api/media.ts`, y es para S3.
  - #41 va a añadir `patchJson` (§Riesgos R2).
- `src/api/nutrition.ts` modela cada escritura como una unión de estados:
  - `serveMeal` traduce 201 a `ok` y 409 `MEAL_ALREADY_SERVED` a `already-served`;
  - `unserveMeal` traduce 204 a `ok` y 404 `MEAL_SERVING_NOT_FOUND` a `not-served`.

  #103 seguiría ese patrón.
- `src/api/types.ts`, `NutritionPlan`: el móvil no usa ni `id` ni `generatedAt`,
  así que cambiar el id del plan no rompe la UI.
- El rol: `myRole: 'owner' | 'family' | 'walker' | 'vet'`.
  - El precedente de ocultar por rol es
    `canSetLostMode = selectedPet?.myRole === 'owner'`, en `src/screens/map/index.tsx`.
  - #41 hace lo mismo con su D5 en `origin/feature/41-mobile-geofences`: oculta
    al no dueño y deja que el backend decida con 403.
- El selector de hora ya existe en `src/screens/add-reminder/index.tsx`:
  - `import { Host } from '@expo/ui'; import ExpoDateTimePicker from '@expo/ui/community/datetime-picker';`;
  - `<ExpoDateTimePicker testID="time-picker" mode="time" presentation="dialog" … />`;
  - va detrás de un `Pressable testID="time-field"`.
  - El test `add-reminder/index.test.tsx` mockea `@expo/ui` y `@expo/ui/community/datetime-picker`.
  - `src/screens/add-pet/index.tsx` usa el mismo selector.
- Si se borra, el precedente de confirmación es `src/screens/reminders/index.tsx`,
  con `BottomSheet, BottomSheetView` de `@expo/ui/community/bottom-sheet` y
  testID `reminders-delete-confirm`.
- `docs/ui-guidelines.md`:
  - decisión fija 5: base heroui y por defecto la capa `@expo/ui/community/*`;
    la capa raíz de `@expo/ui` se cae en Expo Go Android;
  - decisión fija 12: `rounded-xl` en botones y controles;
  - touch target de al menos 44pt;
  - checklist de la Enmienda #70 para elementos repetidos, aplicable a las filas.
- **No hace falta ninguna dependencia nueva.** `package.json` ya trae
  `@expo/ui ~57.0.11`, `heroui-native 1.0.8`, `expo-haptics` y
  `reicon-react-native`.

**3.5 i18n y candados**

- `src/i18n/catalog.ts` tiene las claves `mealSchedule.*` en `en` y `es`.
- El candado de longitud está en `src/providers/__tests__/language-provider.test.tsx`,
  describe `'#65 R12: el catálogo tiene los dos idiomas…'`. El ancla es
  `expect(englishKeys).toHaveLength(` con
  `260 + 16 + 1 + 4 + 7 + 14 + 2 + 1 + 4 - 6 + 1 + 2 + 3`, que suma **309** en `4e8d6cc3`.
- La tabla de uso es `src/__tests__/ui-copy-table.ts`. Las filas de meal-schedule
  viven en `R6_FOOD`, por ejemplo `{ file: 'src/screens/meal-schedule/index.tsx', key: 'mealSchedule.dailyTarget' }`.
  - `src/__tests__/ui-language.test.ts` hace `expect(R6_FOOD).toHaveLength(35 + 3 + 1 - 2 + 1)`.
  - `checkUses` cuenta las apariciones de `t('key')` por fichero.
- La copy nueva también va a la tabla de `specs/mobile-ui-language/design.md` §2,
  con una sección §2.x propia como hace #41.

---

## Riesgos / ambigüedades

- **R1. #18 (IA) choca con cualquier modelo que guarde los horarios en la fila del plan.**
  - Si editar inserta una fila nueva (M2), esa fila nace con `aiExplanation`
    null. Con la lógica de la rama obsoleta de #18, el siguiente hash hit
    llamaría otra vez a la IA, lo que cuesta dinero.
  - Si se actualiza en sitio (M1), la explicación ya guardada describe horarios
    que ya no existen.
  - En cualquier modelo, el prompt de #18 manda `result.mealTimes` del motor,
    no los editados.

  #18 sigue pending y su rama está obsoleta (anterior a #83), así que hoy no
  rompe nada. Pero la spec de #103 debería dejar escrita la regla que #18 tendrá
  que respetar. `progress/current.md` dice "Backend no toma #18".
- **R2. #41 en vuelo pisa los mismos ficheros móviles.**
  - #41 está `in_progress` en `origin/feature/41-mobile-geofences` (cabeza
    `04cf1c1c` "chore(harness): handoff de #41 a Codex"). Codex lo implementa
    en otra sesión. Leído solo con `git show origin/feature/41-mobile-geofences:`.
  - Su `design.md` coloca **`patchJson`** en `src/api/http.ts`, "entre `postJson`
    y `deleteJson`, con la misma forma que `postJson`. Es un helper genérico".
  - Suma once claves al catálogo: "El candado de longitud pasa de 309 a 320 (`+ 11`)".
  - Toca `ui-language.test.ts` y `ui-copy-table.ts`.

  Si #103 móvil arranca antes de que #41 mergee, choca en `http.ts`,
  `catalog.ts`, el candado 309 y las tablas de copy. Pasó igual en #94/#98:
  "Reparto de ficheros caduca al mergear". Si arranca después, reutiliza
  `patchJson` y parte de 320.
- **R3. Migración.** Solo hace falta si el modelo elegido añade tabla o columna
  (M3, o M4 con bandera). Sería la `0018`. No es destructiva si solo añade.
  La otra sesión (#41) es móvil, así que no hay carrera de journal conocida.
  Aun así, hay que comprobar contra `origin/main` al arrancar
  ("ids siempre contra origin/main").
- **R4. P2 deja de ser "cierta por construcción".**
  - Añadir o borrar obliga a mover `mealsPerDay`, y el check de la base lo
    limita a 1..6.
  - `portionGrams`, en el móvil, y `kcalConsumed`, en el backend, dividen entre
    `mealsPerDay`. El total diario se conserva y la porción por comida se
    reparte. Es coherente, pero hay que decirlo en la spec.
  - Si nada defiende P2 en la base, un `PUT` mal validado podría romperla.
- **R5. Duplicados.** `servedInPlan` cuenta doble si `mealTimes` repite una hora.
  Con validación débil, `served` podría superar a `total`, y caería la garantía
  de la D4.
- **R6. Orden e índice.**
  - Las filas móviles usan `index` en `key` y `testID`
    (`meal-time-row-${index}`, y `meal-row-${index}` y `meal-toggle-${index}` en Food).
  - Si el backend no ordena al escribir, mover `07:30` a `22:00` deja la lista
    desordenada y los testID cambian de hora entre renders.
- **R7. `MEAL_TIME_PATTERN` acepta `99:99`.** Si #103 reutiliza el DTO sin
  endurecerlo, se pueden guardar horas imposibles en el plan, y luego servirlas.
- **R8. Regenerar borra la edición, en silencio.**
  - Con M1 o M2, cualquier cambio de input genera una fila nueva con
    `MEAL_TIMES_BY_COUNT`. Por ejemplo un peso nuevo, un cumpleaños que cambia
    `ageMonths`, o el PUT perfil.
  - El usuario pierde su horario sin aviso, y la D4 deja huérfanas las servidas
    de hoy.
  - El criterio "el plan generado deja de ser la unica fuente de mealTimes"
    sugiere que la edición **sobreviva** a regenerar, pero no lo dice explícito.
- **R9. Gate humano.** El smoke "editando una franja con comida ya servida"
  solo tiene resultado esperado cuando se cierre la decisión 2. La spec debe
  escribir qué ve el humano en Food y en Home tras mover una franja servida.
- **R10. Mocks y candados móviles.** Hay que añadir la función nueva al
  `jest.mock('../../api/nutrition', …)` de `index.test.tsx` y declarar los
  deltas exactos del catálogo y de `R6_FOOD`. Ya se olvidó dos veces ("Candado
  de catálogo omitido en specs").

---

## Cómo quedaría partida (no se parte aquí)

Mismo corte que #83/#98: backend primero, móvil después, y el móvil bloqueado
hasta que mergee el backend.

**Mitad backend** (módulo `nutrition`):
- endpoint o endpoints de edición, según la decisión 5;
- DTO zod con HH:MM estricto;
- caso de uso o casos de uso;
- método nuevo de repositorio, transaccional si se migran servidas (decisión 2);
- errores en `nutrition-error.mapper.ts`;
- auditoría si se decide;
- ajuste de `pet-meals.drizzle-reader.ts`, `get-nutrition-plan`, `serve-meal`
  y `generate`, según el modelo (decisión 1);
- migración 0018 solo si M3 o M4;
- e2e nuevo sobre el patrón de `meals.e2e-spec.ts`;
- `docs/data-model.md`, que hoy dice que la D4 y P2 son por construcción;
- la regla escrita para #18.

**Mitad móvil:**
- cliente en `src/api/nutrition.ts`, con su unión de estados;
- `patchJson`/`putJson` en `http.ts`, o reutilizar el de #41;
- en `src/screens/meal-schedule/index.tsx`:
  - botón Añadir;
  - Editar por fila con `ExpoDateTimePicker`;
  - quizá Borrar con `BottomSheet`;
  - refetch de `nutritionKeys.plan` y `petKeys.detail`;
  - háptica;
  - visibilidad por `myRole` o 403;
- catálogo en/es más candados (`language-provider.test.tsx`, `ui-copy-table.ts`
  y `ui-language.test.ts`);
- `specs/mobile-ui-language/design.md` §2.x;
- tests de pantalla;
- smoke en dev build de Android.

---

## Decisiones abiertas para el humano

Son 11. Cada una va con sus opciones y consecuencias. La recomendación es solo
eso, una recomendación: la decisión es del humano o del `spec_author`.

**1. ¿Dónde viven los horarios editados y sobreviven a regenerar el plan?**
- **M1.** UPDATE en sitio de la última fila de `nutrition_plans`.
  - Rompe append-only.
  - Necesita un `update` nuevo en el puerto.
  - Al regenerar se pierde la edición (R8).
  - Con #18, la explicación queda vieja.
- **M2.** INSERT de una copia del plan con los `mealTimes`/`mealsPerDay` nuevos
  y el mismo `inputsHash`.
  - Mantiene append-only y no necesita migración.
  - `findLatestPlan` y el reader la eligen solos (uuidv7 ordena).
  - Un hash hit la devuelve, y R21 sigue verde.
  - `generatedAt` pasa a significar "última edición".
  - Al regenerar con input distinto se pierde la edición (R8).
  - Con #18, cada edición es una fila sin explicación, y puede costar otra
    llamada a la IA (R1).
- **M3.** Tabla aparte de horario por mascota (migración 0018) que se impone
  al plan.
  - Sobrevive a regenerar.
  - Hay que unirla en todos los lectores de §1.4, incluido el reader directo.
  - Choca si el motor cambia `mealsPerDay` por edad: hay que decidir quién manda.
- **M4.** Como M2, pero `generate` arrastra los horarios del último plan si
  `mealsPerDay` no cambia, y resetea si cambia.
  - Sin tabla nueva.
  - La edición sobrevive a cambios de peso o perfil, pero no a un cambio de
    `mealsPerDay`.
  - Para distinguir "editado" de "por defecto" puede bastar comparar con
    `MEAL_TIMES_BY_COUNT`, o hacer falta una bandera (migración).
  - *Recomendación:* M2 para el primer corte, más la regla de M4 si el humano
    quiere que la edición sobreviva a regenerar. Es lo que menos toca y no
    necesita migración. M3 solo si se quiere un horario totalmente
    independiente del motor.

**2. ¿Qué pasa con la servida de hoy de una franja que se mueve?** Resuelve la
D4 de #83.
- **A.** Queda huérfana (D4 tal cual).
  - Baja el conteo de hoy.
  - Food muestra la franja nueva como Pendiente y deja servir dos veces.
  - Solo se deshace por API.
  - Puede "resucitar" si otra franja ocupa luego esa hora (§2).
- **B.** Se migra la servida de **hoy** (`servedOn` = `ownerLocalDay`) a la
  hora nueva, en la misma transacción.
  - Precedente: la transacción de `geofence.drizzle.repository.ts`.
  - El conteo se conserva.
  - Puede chocar con `meal_servings_pet_id_served_on_meal_time_idx` si ya hay
    una huérfana a la hora destino. La spec debe decidir: fusionar o 409.
  - Los días pasados no se tocan.
  - El método de repositorio toca dos tablas.
- **C.** Se bloquea con 409 si la franja está servida hoy.
  - Simple.
  - Obliga a deshacer, mover y volver a servir.
  - El smoke del gate se convierte en "ver el bloqueo".
  - *Recomendación:* B. Es la única opción que conserva `served ≤ total` y el
    conteo sin que el usuario haga nada, y su precedente transaccional ya existe.

**3. ¿Borrar franja entra en #103?** Si entra, ¿qué pasa con su servida?
- **Sí, con DELETE.** Hay que decidir su servida de hoy: huérfana (A) o borrada
  junto con la franja. También el mínimo de 1 franja (check de 1..6) y la
  confirmación con `BottomSheet`.
- **No.** Se respeta el diseño, que no dibuja borrar, y el criterio 2 ("editar y
  anadir"). El criterio 1 ("editada o borrada") se enmienda a "editada".
  - *Recomendación:* que lo decida el humano según el Make actual. Si el Make
    vigente no tiene borrar, dejarlo fuera y enmendar el criterio 1.

**4. ¿`mealsPerDay` sigue a `mealTimes.length`?**
- **Sí.** Se mantiene P2, ahora defendida por el caso de uso. Se aplica el
  límite 1..6 del check. La porción y `kcalConsumed` se reparten entre las
  franjas nuevas, con el mismo total diario.
- **No**, se desacoplan: hay que rehacer `kcalConsumed`, `portionGrams` y
  `total` de Home, y eso es mucho más alcance.
  - *Recomendación:* sí. ¿Y añadir un check en la base que defienda P2? Sería
    otra migración, para valorar junto con la decisión 1.

**5. ¿Qué forma tiene el contrato HTTP?**
- **E1.** `PUT /pets/:petId/meal-times` (o similar) con la lista completa.
  - Un endpoint y validación global: duplicados, orden y longitud.
  - No distingue "mover" de "borrar + añadir", así que la decisión 2B tiene que
    inferirlo o no aplicarse.
- **E2.** Granular:
  - `POST` añade;
  - `PATCH /:mealTime` mueve, con el segmento `HH:MM` en la ruta como en la D3
    de #83;
  - `DELETE /:mealTime` borra, si la decisión 3 lo incluye.
  - El "mover" es explícito y la 2B es trivial.
  - Más e2e.
  - Ojo con `@Delete(':mealTime')` de `meals.controller.ts`: ya existe para
    *deshacer servida*. Las rutas nuevas necesitan un prefijo distinto.
- Subpreguntas:
  - ¿se audita como `meal.serve`, por ejemplo `meal.schedule.update`?
  - ¿qué códigos de error se usan (`MEAL_TIME_DUPLICATE`, `MEAL_TIME_NOT_IN_PLAN`,
    `NUTRITION_PLAN_REQUIRED`)?
  - *Recomendación:* E2 con `PATCH`. Encaja con el diseño (Editar horario y
    Añadir comida), hace explícito el movimiento para la 2B y reutiliza el
    `patchJson` de #41.

**6. ¿Quién puede editar, y cómo lo enseña el móvil?**
- **Owner-only** (`@RequirePetRole('owner')`), como generar plan y PUT perfil.
- **Cualquier miembro activo**, como servir (D2 de #83).
- En el móvil:
  - ocultar los controles por `myRole`, como `canSetLostMode` y #41 D5;
  - o mostrarlos y traducir el 403 a `mealSchedule.errorForbidden`, como
    `handleGenerate`.
  - *Recomendación:* owner-only, porque cambia el plan y no un registro
    diario, y ocultar por `myRole` con el 403 como red.

**7. ¿Cómo se valida la hora?**
- `HH:MM` estricto (00–23:00–59) solo en los endpoints nuevos, o también se
  endurece `MEAL_TIME_PATTERN` de serve y unserve. Esto último cambia el
  contrato de #83.
- Duplicados: 409 o 422.
- Orden: ordenar al escribir o respetar el orden del usuario.
  - *Recomendación:* estricto en los nuevos, rechazar duplicados con 422, y
    ordenar al escribir. Así se cierran R5, R6 y R7. Endurecer serve y unserve
    se deja para otra feature.

**8. Nombres y porciones distintas por comida (diseño: Desayuno/Comida/Cena, 200/200/180 g).**
- Fuera de #103: las filas siguen siendo "hora + porción repartida".
- Dentro: hay que añadir modelo nuevo (nombre y gramos por franja), y eso
  cambia `kcalConsumed`.
  - *Recomendación:* fuera, registrado como deuda si el humano lo quiere.

**9. ¿Dónde van los controles en la pantalla?**
- "Añadir comida":
  - en el cuerpo, bajo la lista de franjas, sin precedente nuevo;
  - o en `headerRight` del `Stack.Screen`, sin precedente en `src/` y en
    choque con #95 R5.
- "Editar horario": por fila, abriendo `ExpoDateTimePicker` (`mode="time"`,
  `presentation="dialog"`).
- ¿Se edita también desde Food/Home (#98) o solo desde meal-schedule?
  - *Recomendación:* Añadir en el cuerpo, Editar por fila, y solo en
    meal-schedule, que es lo que pide el criterio 3.

**10. ¿Cómo se ordena con #41?**
- Esperar a que #41 mergee y reutilizar su `patchJson` y su candado de 320.
- O que #103 añada su propio helper y rebase después, con conflicto seguro en
  `http.ts`, `catalog.ts` y los candados.
- La mitad backend de #103 **no** choca con #41 y puede ir antes.
  - *Recomendación:* backend de #103 ya; móvil de #103 después del merge de #41.

**11. ¿Qué regla queda escrita para #18?**
- Que la spec de #103 obligue a #18 a:
  - usar los `mealTimes` guardados en el prompt;
  - no re-llamar a la IA en filas creadas por edición, o copiar la
    `aiExplanation` al copiar el plan (M2).
- O no decir nada y que #18 lo resuelva cuando se especifique.
  - *Recomendación:* si se elige M2, que la copia herede `aiExplanation`. Es
    una línea y evita el coste. Y dejar una nota en la entrada de #18 en
    `feature_list.json`.

---

## Recomendación

*Recomendación, no decisión:*
- Especificar #103 como dos mitades.
- El **backend** va primero, porque no choca con #41:
  - modelo M2 (más la regla M4 si el humano quiere que la edición sobreviva a
    regenerar);
  - contrato E2 con `PATCH`, owner-only;
  - migrar la servida de hoy en transacción (2B);
  - HH:MM estricto, sin duplicados y ordenado;
  - P2 mantenida por el caso de uso;
  - nombres y porciones fuera.
- El **móvil** va después del merge de #41:
  - reutiliza `patchJson`;
  - usa `ExpoDateTimePicker` ya instalado, sin dependencias nuevas;
  - refetch de `nutritionKeys.plan` y `petKeys.detail` como `toggleMeal` de #98;
  - visibilidad por `myRole`.
- Antes de escribir la spec, el humano debería confirmar en el Make vigente si
  existe "borrar" (decisión 3), porque aquí solo se pudo leer el volcado del
  2026-08-23.

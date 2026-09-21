---
feature: "mobile-meals-served-ui"
status: spec_ready       # draft | spec_ready | approved  ← el gate humano lo pasa a approved
tags: [harness, spec, mobile]
---

# Requisitos — [[mobile-meals-served-ui]] (#98)

> Mitad móvil de #83 `meals-served-tracking`. Notación EARS. Cada R-id nombra el
> test que lo prueba con ruta y **título literal**. Ver [[design]] para el
> contrato del backend, los tokens y el flujo de refresco; [[tasks]] para el
> orden TDD; [[traceability]] para la tabla R → test → commit.
>
> **Ancla de todas las cifras de esta spec: commit `914905b8`** (merge del PR
> #142, base de `feature/98-mobile-meals-served-ui`). Todo recuento se da como
> *viejo → nuevo* medido en ese árbol. Medición de referencia ejecutada el
> 2026-09-21: `bunx jest --runTestsByPath` sobre las siete suites afectadas →
> **7 suites, 303 tests, todo verde**.

## Contexto fijo (no reabrir)

- **#83 está mergeada en `main`.** El contrato de red se lee del código, no de
  la descripción: `backend-pet-tracker/src/modules/nutrition/infrastructure/meals.controller.ts`,
  `.../application/dto/meal.dto.ts`,
  `.../infrastructure/mappers/nutrition.mapper.ts`,
  `.../infrastructure/mappers/nutrition-error.mapper.ts` y
  `backend-pet-tracker/test/meals.e2e-spec.ts`. Transcrito literal en
  [[design]] §1.
- **Sin estado optimista** (decisión del humano, 2026-09-15). Tras cada
  POST/DELETE se refresca y la UI pinta lo que devuelve el servidor. No se
  copia el patrón `acked` de alerts: allí el servidor solo **supera** la acción
  del usuario; aquí puede **invalidarla** (D4 de #83: plan regenerado sin esa
  franja).
- **Sin `useMutation` ni `invalidateQueries` en `src/`.** El patrón del repo es
  `src/app/(tabs)/weight-log.tsx:98-111` (`createWeight` → `switch (result.kind)`
  → `weights.refetch()`), verificado en el árbol.
- **Cero dependencias nuevas.** `@tanstack/react-query` y `reicon-react-native`
  ya están instaladas; no se añade nada.
- **`bun`, nunca `npx`/`npm`** (`docs/conventions.md` §Convenciones de la app
  móvil). Expo SDK 57 (`expo ~57.0.14`); docs pinchadas en
  `https://docs.expo.dev/versions/v57.0.0/`, nunca `latest`.
- **Prefijo `#98` obligatorio en todo título de test** (`docs/conventions.md`
  §Prefijo de feature): los siete ficheros que esta feature toca ya acumulan
  R-ids de otras specs (#38, #61, #62, #64, #65, #69, #70, #71, #78, #79, #85,
  #87, #90).

## Correcciones a la entrada de `feature_list.json` (verificadas en `914905b8`)

La entrada de #98 cita `ruta:línea`. Se abrieron todas. Tres no coinciden:

| La entrada dice | El árbol dice | Consecuencia |
|---|---|---|
| `nextReminder` y `activitySummary` siguen `unknown` — `index.test.tsx:3200-3210` | La aserción vive en **`src/screens/home/index.test.tsx:2964-2965`**, dentro de `describe('#70 R2: contrato nextVaccine')` (`:2947`). `:3200-3210` es el final de `#70 R9` y el arranque de `#70 R10` | R1 apunta a `:2964-2965` |
| «las **11** fixtures tipadas `PetProfile` … ganan `mealsToday: null`» | Son **10** literales completos. `src/hooks/use-pet-selection.test.tsx:63` hace `return { id } as PetProfile` — una aserción de tipo, no un literal: un campo requerido nuevo **no** la rompe | R1 enumera las 10 y declara por qué la undécima queda fuera |
| El Make en `App.tsx:438-446` | El bloque real es **`specs/mobile-figma-polish/design-src/App.tsx:437-445`** (`🍽️` en `:439`, contador en `:441`, relleno `#2AB87C` en `:443`) | [[design]] §4 cita `:437-445` |

Todo lo demás de la entrada se verificó cierto: `food.tsx:24-29/:52/:61-64/:185-188/:193/:221-225`,
`home/index.tsx:626` (`reminders-section-body`) y `:636` (`reminders-next-vaccine`),
`index.test.tsx:2331-2345/:2365/:2400/:2430-2433/:2814-2846/:3459-3474`,
`language-provider.test.tsx:55`, `ui-copy-table.ts:166`,
`weight-log.tsx:98-111`, `api/pets.ts:48-55`, `api/nutrition.ts:103-106`.

## Las siete preguntas de la Home (carta §Dirección de arte 3)

Obligatorio declararlo en toda spec que toque la Home. Esta feature responde
**una** pregunta nueva y no toca las otras seis:

| Pregunta | ¿La responde #98? |
|---|---|
| ¿Está segura? | No — la responde el hero (#67) y el modo perdido |
| ¿Dónde está? | No — `last-position-card` |
| ¿El collar está conectado? | No — `collar-card` (#68, #73) |
| ¿Tiene batería? | No — `collar-card` |
| ¿Tiene algún recordatorio pendiente? | No cambia — la sección de recordatorios (#70, #85) sigue igual; la barra **se suma** a ella, no la sustituye |
| ¿Cómo fue su actividad hoy? | No — `weekly-activity-card` (#68, #69) |
| ¿Hay alguna alerta? | No — la campana (#78) |
| **¿Ha comido hoy?** (nueva) | **Sí** — `reminders-meals`: `served/total` y barra proporcional, solo si la mascota tiene plan |

## Requisitos funcionales

### R1 — Los tipos del cliente ganan `servedToday` y `mealsToday`

**WHEN** el móvil tipa la respuesta de `GET /v1/pets/:petId/nutrition-plan` y
la de `GET /v1/pets/:petId`, **THE SYSTEM SHALL** declarar en
`mobile-pet-tracker/src/api/types.ts`:

- en `interface NutritionPlan` (hoy `:184-196`), el campo
  `servedToday: string[];` **después** de `generatedAt: string;`, dejando la
  interfaz en **11 → 12 campos**;
- una `interface MealsToday { served: number; total: number }` exportada;
- en `interface PetProfile` (hoy `:58-82`), el campo
  `mealsToday: MealsToday | null;` **después** de `activitySummary: unknown;`,
  dejando la interfaz en **24 → 25 campos**;

**AND SHALL** dejar `nextReminder: unknown;` y `activitySummary: unknown;`
**sin tocar** (`src/screens/home/index.test.tsx:2964-2965` sigue verde tal
cual);

**AND SHALL** añadir `mealsToday: null` a las **diez** fixtures que construyen
un `PetProfile` literal completo — `src/app/(tabs)/__tests__/food.test.tsx:74`,
`src/app/(tabs)/__tests__/health.test.tsx:92`,
`src/app/(tabs)/__tests__/map.test.tsx:117`,
`src/screens/home/index.test.tsx:224`,
`src/screens/profile/index.test.tsx:159`,
`src/screens/reminders/index.test.tsx:83`,
`src/screens/pairing/index.test.tsx:68`,
`src/screens/docs/index.test.tsx:39`,
`src/components/__tests__/pet-switcher.test.tsx:11`,
`src/components/__tests__/pet-hero-header.test.tsx:99` —, y **SHALL NOT** tocar
`src/hooks/use-pet-selection.test.tsx:62-63`, que usa `{ id } as PetProfile` y
por tanto no exige el campo nuevo;

**AND SHALL NOT** endurecer el guard `isPetProfile` (`src/api/pets.ts:48-55`):
sigue comprobando solo `id` y `name` (P16 de #83).

*Test:* `src/screens/home/index.test.tsx` →
`describe('#98 R1: los tipos del cliente declaran servedToday y mealsToday')`,
`it('añade los dos campos sin tocar nextReminder ni activitySummary')` — lee
`src/api/types.ts` con `readFileSync` (mismo patrón que `#70 R2`, `:2949-2966`),
extrae los bloques `export interface NutritionPlan \{[\s\S]*?\n\}` y
`export interface PetProfile \{[\s\S]*?\n\}` y asevera: la lista de campos de
`NutritionPlan` termina en `['…','generatedAt','servedToday']`, la de
`PetProfile` en `['…','activitySummary','mealsToday']`, `toHaveLength(12)` y
`toHaveLength(25)` respectivamente, y que el bloque de `PetProfile` sigue
conteniendo `'nextReminder: unknown;'` y `'activitySummary: unknown;'`. El
`mealsToday: null` de las diez fixtures se prueba solo: sin él, `tsc` y las diez
suites fallan en compilación.

### R2 — El cliente API expone `serveMeal` y `unserveMeal`

**WHEN** la app marca o desmarca una franja, **THE SYSTEM SHALL** exponer desde
`mobile-pet-tracker/src/api/nutrition.ts` dos funciones con la firma del repo
(`baseUrl: string | undefined, token: string, petId: string, mealTime: string,
fetchFn: typeof fetch = fetch`), construidas sobre `postJson` / `deleteJson` de
`src/api/http.ts` (nunca `fetch` a pelo), y **SHALL** mapear los estados así:

`serveMeal` → `POST /pets/:petId/meals`, cuerpo **exacto** `{ mealTime }`:

| Respuesta | `kind` |
|---|---|
| `201` | `'ok'` |
| `409` con `code === 'MEAL_ALREADY_SERVED'` | `'already-served'` |
| `401` | `'unauthorized'` |
| cualquier otro estado (`400`, `404`, `422`, `5xx`) | `'error'` |
| excepción de red | `'unreachable'` con `message` |
| `baseUrl` ausente | `'missing-config'` |

`unserveMeal` → `DELETE /pets/:petId/meals/:mealTime`, sin cuerpo:

| Respuesta | `kind` |
|---|---|
| `204` | `'ok'` |
| `404` con `code === 'MEAL_SERVING_NOT_FOUND'` | `'not-served'` |
| `401` | `'unauthorized'` |
| cualquier otro estado (incluido un `404` **sin** ese `code`, que es el del `PetAccessGuard`) | `'error'` |
| excepción de red | `'unreachable'` con `message` |
| `baseUrl` ausente | `'missing-config'` |

**AND SHALL NOT** tocar `getNutritionPlan`, `getNutritionProfile` ni
`generateNutritionPlan`.

*Test:* `src/api/__tests__/nutrition.test.ts` →
`describe('#98 R2: serveMeal y unserveMeal mapean la respuesta por kind')`,
con `it('serveMeal publica mealTime y distingue el 409 del error')` y
`it('unserveMeal borra la franja de hoy y distingue el 404 de la franja del 404 del guard')`.
Usa los helpers `response(status, body)` e `invalidJsonResponse(status)` que ya
viven en ese fichero (`:14-26`) y un `fetchFn` `jest.fn()`; asevera la URL
completa (`http://example.test/v1/pets/pet-1/meals` y
`http://example.test/v1/pets/pet-1/meals/07:30`), el `method`, el header
`Authorization: Bearer <token>` y `body: JSON.stringify({ mealTime: '07:30' })`.

### R3 — El catálogo gana cuatro claves en los dos idiomas

**WHEN** la UI de comidas necesita copy nueva, **THE SYSTEM SHALL** añadir a
`mobile-pet-tracker/src/i18n/catalog.ts` estas **cuatro** claves —y ninguna
más— en `en` y en `es`, en el bloque `food.*` y en el mismo orden relativo en
los dos idiomas:

| Clave | `en` | `es` | Dónde se usa |
|---|---|---|---|
| `food.markServed` **(param `time`)** | `Mark {{time}} as served` | `Marcar {{time}} como servida` | nombre accesible del botón cuando la franja está pendiente (R5) |
| `food.undoServed` **(param `time`)** | `Undo {{time}}` | `Deshacer {{time}}` | nombre accesible del botón cuando la franja está servida (R5) |
| `food.couldNotUpdateMeal` | `Could not update the meal` | `No se pudo actualizar la comida` | error en línea de Food (R6) |
| `food.mealsServedOfTotal` **(params `served`, `total`)** | `{{served}} of {{total}} meals served` | `{{served}} de {{total}} comidas servidas` | nombre accesible del contador de la Home (R7) |

**AND SHALL** reutilizar, sin duplicarlas, `food.mealsToday` (`:135` en `en`,
`:445` en `es`) como título de la barra de la Home, y `food.served` / `food.pending`
(`:136-137` / `:446-447`) como texto visible del badge por franja;

**AND** el candado de longitud del catálogo
(`src/providers/__tests__/language-provider.test.tsx:55`) **SHALL** pasar de
`260 + 16 + 1 + 4 + 7 + 14 + 2 + 1` (**305**, medido en `914905b8`: 305 claves
en `en` y 305 en `es`) a `260 + 16 + 1 + 4 + 7 + 14 + 2 + 1 + 4` (**309**), con
el comentario de `:50` ampliado con `+ 4 de #98`;

**AND** `specs/mobile-ui-language/design.md` §2 **SHALL** ganar una fila por
clave con el formato normativo
`| — | \`<clave>\` | \`<en>\` | \`<es>\` | ← añadida por #98 (R3)` —las tres de
`food.*` de Food en §2.6 y `food.mealsServedOfTotal` en §2.6 también, porque su
ámbito es `food` (D1 de esa spec: el ámbito es el del módulo, no el de la
pantalla que la pinta)—, y los rótulos de sección **SHALL** pasar de
`### §2.6 — R6 — Food y Meal schedule (35 ocurrencias, 29 claves)` a
`(38 ocurrencias, 33 claves)`.

*Test:* `src/providers/__tests__/language-provider.test.tsx` →
`describe('#98 R3: el catálogo trae las cuatro claves de comidas servidas')`,
`it('registra las cuatro claves en los dos idiomas y en la tabla de la spec de idioma')`,
calcado en **intención** (no en literal) del `#73 R5` que ya vive en ese fichero
(`:63-...`): tabla `[clave, en, es]` de cuatro filas, `expect(english[key]).toBe(...)`,
`expect(spanish[key]).toBe(...)` y `expect(languageDesign).toMatch(...)` contra
`../specs/mobile-ui-language/design.md` con el sufijo `← añadida por #98 \(R3\)`.
La longitud 309 la cierra el `it` ya existente de `:51`.

### R4 — Food deriva el estado servido de `servedToday`, no del reloj

**WHILE** Food tiene un plan cargado (`plan.data.kind === 'ok'`), **THE SYSTEM
SHALL** derivar el estado de cada franja de `plan.servedToday`:

- el contador `testID="food-meals-progress"` **SHALL** mostrar
  `${loadedPlan.servedToday.length}/${loadedPlan.mealsPerDay}`;
- la fila `testID="meal-row-<index>"` **SHALL** considerarse servida
  **si y solo si** `loadedPlan.servedToday.includes(mealTime)`, y pintar
  `testID="meal-served-<index>"` con `t('food.served')` o
  `testID="meal-pending-<index>"` con `t('food.pending')` según eso;
- el fondo de la fila (`bg-surface-secondary` servida / `bg-default` pendiente)
  y la tinta del `Clock` (`accent-strong` servida / `muted` pendiente)
  **SHALL** seguir la misma condición;

**AND** `src/app/(tabs)/food.tsx` **SHALL NOT** contener `localTimeHhmm`, ni
`new Date()`, ni ninguna comparación `mealTime <= hhmm`: la función de `:24-29`,
la constante de `:52` y el `filter` de `:61-64` se **borran** (C7 — no queda
código huérfano de la decisión D7 de #38 que esta feature reemplaza);

**AND** `describe('R5: plan del día con horarios y warnings')` de
`src/app/(tabs)/__tests__/food.test.tsx` **SHALL** perder su
`jest.useFakeTimers` (`:263`), su `jest.setSystemTime` (`:264`) y su
`afterEach(() => jest.useRealTimers())` (`:268-270`): existían **solo** por D7
de #38. Si algún `it` de ese bloque se vuelve inestable sin el reloj falso, el
arreglo es un `waitFor` sobre el árbol (`docs/conventions.md` §Esperas sobre el
árbol renderizado), **nunca** volver a congelar el reloj.

**Deltas declarados en `food.test.tsx` (viejo → nuevo, medidos en `914905b8`):**

| Línea | Viejo | Nuevo |
|---|---|---|
| `:263-264` | `useFakeTimers` + `setSystemTime('2026-08-23T13:00:00')` | eliminadas |
| `:268-270` | `afterEach(() => { jest.useRealTimers(); })` | eliminado |
| `:301` | `'1/2'` derivado del reloj | `'1/2'` derivado de `makePlan({ servedToday: ['07:30'] })` |
| `:310` | `meal-served-0` por `07:30 <= 13:00` | `meal-served-0` por `servedToday: ['07:30']` |
| `:315` | `meal-pending-1` por `19:30 > 13:00` | `meal-pending-1` porque `'19:30'` no está en `servedToday` |
| `:327-334` | `'2/3'` por reloj con `['06:00','12:00','18:00']` | `'2/3'` por `servedToday: ['06:00','12:00']` |
| `makePlan` (`:104-119`) | 11 campos | 12 campos: `servedToday: []` por defecto |

*Test:* `src/app/(tabs)/__tests__/food.test.tsx` →
`describe('#98 R4: el estado servido sale de servedToday, no del reloj')` con
`it('pinta badges y contador desde servedToday con el reloj del dispositivo en cualquier hora')`
—dos renders con el **mismo** plan y `servedToday` distinto (`[]` y
`['07:30','19:30']`) dando `'0/2'` con dos `meal-pending-*` y `'2/2'` con dos
`meal-served-*`— y
`it('no deja rastro del reloj en el fuente de Food')`, que lee
`src/app/(tabs)/food.tsx` con `readFileSync` y asevera
`expect(source).not.toContain('localTimeHhmm')`,
`expect(source).not.toContain('new Date(')` y
`expect(source).not.toMatch(/mealTime\s*<=\s*hhmm/)`.

### R5 — Cada franja tiene un botón que sirve o deshace y refresca

**WHEN** el usuario pulsa el control de una franja en Food, **THE SYSTEM
SHALL**:

- si la franja está **pendiente**, llamar
  `serveMeal(baseUrl, token ?? '', selectedPetId, mealTime)`;
- si está **servida**, llamar
  `unserveMeal(baseUrl, token ?? '', selectedPetId, mealTime)`;
- en ambos casos y **sea cual sea el `kind` del resultado**, refrescar, en este
  orden: `plan.refetch()` (la query de `nutritionKeys.plan(selectedPetId)` que
  la pantalla ya monta en `food.tsx:47-51`) y
  `queryClient.refetchQueries({ queryKey: petKeys.detail(selectedPetId) })`
  con el `queryClient` de `useQueryClient()` de `@tanstack/react-query`
  (**no** `invalidateQueries`, **no** `useMutation`);

**AND WHILE** una llamada está en vuelo **SHALL** dejar el control de esa
franja `disabled` e ignorar cualquier pulsación sobre **cualquier** franja
(un único `pendingMealTime: string | null` en estado local), de modo que dos
pulsaciones seguidas produzcan **una sola** llamada de red;

**AND** el control **SHALL** ser el badge de la franja convertido en
`Pressable` (`testID="meal-toggle-<index>"`) que envuelve al `Text` del badge
—`meal-served-<index>` / `meal-pending-<index>` conservan su `testID`, su copy
y su `className`—, con `accessibilityRole="button"`,
`accessibilityLabel={t(served ? 'food.undoServed' : 'food.markServed', { time: mealTime })}`,
`className="min-h-11 justify-center"` (objetivo táctil ≥ 44 pt, C8) y
`style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}` — la misma receta de
pulsado que `reminders-see-all` en `src/screens/home/index.tsx:613-618`, ya
candada por `src/screens/home/index.test.tsx:188-190`.

*Test:* `src/app/(tabs)/__tests__/food.test.tsx` →
`describe('#98 R5: cada franja sirve, deshace y refresca')` con
`it('sirve una franja pendiente y refresca el plan y el perfil')`,
`it('deshace una franja servida y refresca el plan y el perfil')` y
`it('ignora la segunda pulsación mientras la primera está en vuelo')`.
El refresco del perfil se asevera con
`const refetchQueries = jest.spyOn(view.queryClient, 'refetchQueries')`
instalado sobre el `queryClient` que devuelve `renderWithProviders`
(`test/render-with-providers.tsx:16-19`) **antes** del `fireEvent.press`, y
`expect(refetchQueries).toHaveBeenCalledWith({ queryKey: petKeys.detail('pet-1') })`;
el del plan, con `expect(mockGetNutritionPlan).toHaveBeenCalledTimes(2)`.
El tercer `it` usa un `serveMeal` que devuelve una promesa pendiente y asevera
`expect(mockServeMeal).toHaveBeenCalledTimes(1)` tras dos `press`.
`jest.mock('../../../api/nutrition', ...)` (hoy `:26-28`) **SHALL** ampliarse a
`{ getNutritionPlan: jest.fn(), serveMeal: jest.fn(), unserveMeal: jest.fn() }`.

### R6 — Los conflictos se resuelven refrescando; el resto avisa

**IF** `serveMeal` devuelve `'ok'` o `'already-served'`, **OR** `unserveMeal`
devuelve `'ok'` o `'not-served'`, **THEN THE SYSTEM SHALL** refrescar (R5) y
**no** mostrar ningún error: el servidor ya está en el estado que el usuario
pedía;

**IF** devuelve `'unauthorized' | 'error' | 'unreachable' | 'missing-config'`,
**THEN THE SYSTEM SHALL** refrescar igualmente **y** mostrar
`testID="food-meal-error"` con `t('food.couldNotUpdateMeal')` y
`selectable` (carta §Micro-reglas), dentro de la card
`food-meals-section`, como **último** hijo;

**AND** el error **SHALL** limpiarse al inicio de la siguiente pulsación, de
modo que un reintento con éxito lo borre sin recargar la pantalla;

**AND** la pantalla **SHALL NOT** mostrar `food-meal-error` mientras no haya
habido un fallo: `queryByTestId('food-meal-error')` es `null` en el render
inicial.

*Test:* `src/app/(tabs)/__tests__/food.test.tsx` →
`describe('#98 R6: el conflicto se resuelve refrescando y el fallo avisa')` con
`it('no muestra error cuando el servidor ya estaba en el estado pedido')`
(recorre `'already-served'` para serve y `'not-served'` para unserve, y asevera
`queryByTestId('food-meal-error')` `null` con
`expect(mockGetNutritionPlan).toHaveBeenCalledTimes(2)`) y
`it('muestra el aviso ante un fallo y lo borra en el reintento con éxito')`
(`'error'` → texto visible → segunda pulsación `'ok'` → `queryByTestId` `null`).

### R7 — La Home pinta la barra de comidas con todas sus decisiones candadas

**WHEN** el detalle de la mascota resuelve `kind === 'ok'` **y**
`pet.mealsToday !== null`, **THE SYSTEM SHALL** renderizar dentro de
`reminders-section-body` (`src/screens/home/index.tsx:626`), **inmediatamente
después** de `reminders-next-vaccine` (`:636`) y **antes** de
`reminders-none-upcoming` (`:673`) y de las filas `reminders-item-*` (`:699`),
un `Card` compartido (`src/components/card.tsx`) con
`testID="reminders-meals"`, y **SHALL NOT** renderizarlo en ningún otro caso.

Esta es la **enumeración completa** de sus decisiones (carta §Enmienda #70):
cruzar **cualquiera** de ellas con otro elemento de la sección pone la suite
roja, observado con `within(reminders-meals)`.

| # | Decisión | Valor |
|---|---|---|
| 1 | **Dato** | `detail.data.pet.mealsToday.served` y `.total`. Ninguna otra fuente |
| 2 | **Icono** | `ForkKnife` de `reicon-react-native`, `size={20}` |
| 3 | **Etiqueta / clave de copy** | `t('food.mealsToday')` en `testID="reminders-meals-title"` |
| 4 | **Nombre accesible** | `accessibilityLabel={t('food.mealsServedOfTotal', { served, total })}` en `testID="reminders-meals-count"` |
| 5 | **Fondo del disco del icono** | `CATEGORY_SLOTS.rose.surface` (`bg-category-rose`) — el hueco que la carta asigna al tipo `food` |
| 6 | **Tinta del icono** | `mealsInk`, resuelto con `useThemeColors([... , 'category-rose-strong'])` |
| 7 | **Receta tipográfica** | título `text-sm font-semibold text-foreground` (idéntica a `reminders-next-vaccine-name`); contador `text-xs font-normal text-muted` (idéntica a `reminders-next-vaccine-date`) |
| 8 | **Destino de navegación** | **ninguno**: el `Card` no lleva `onPress`, igual que las filas de #85 R8. `reminders-meals.props.onPress` es `undefined` |
| 9 | **Condición de render** | `detail.data?.kind === 'ok' && detail.data.pet.mealsToday !== null` |
| 10 | **Forma del contenedor** | `flex-row items-center gap-3` sobre la receta de `Card` (`rounded-card border border-border bg-surface p-4 shadow-sm`) |
| 11 | **Envoltorios de agrupación** | `children[1]` de la fila es `flex-1 gap-1.5`; dentro, la cabecera es `flex-row items-center justify-between` |
| 12 | **Orden de los hijos** | fila: `[0]` disco del icono, `[1]` columna `flex-1`. Columna: `[0]` cabecera, `[1]` carril. Cabecera: `[0]` título, `[1]` contador. Carril: `[0]` relleno |

**Estructurales**, cerrados con `children.length` y **nunca** contando
coincidencias de `testID`: `reminders-meals.children` → **2**;
la columna `flex-1` → **2**; la cabecera → **2**;
`testID="reminders-meals-track"` → **1**.

**Invariantes compartidos, cada uno con su `expect`:** `size={20}` del icono
leído de `props.size` del mock (no de un recuento de literales en el fuente);
disco `size-9 items-center justify-center rounded-full`; carril
`h-1.5 overflow-hidden rounded-full bg-default`; relleno
`h-full rounded-full bg-accent` (fondo ⇒ `--accent`, carta §Decisiones fijas 11)
con `style={{ width: \`${pct}%\` }}` y
`pct = total > 0 ? Math.round((served / total) * 100) : 0`; ninguna esquina
`CONTINUOUS_CORNER` porque **todas** las del elemento son cápsulas
(`rounded-full`) o las dibuja `Card` (carta §Decisiones fijas 12).

**AND** el mock de `reicon-react-native` de `src/screens/home/index.test.tsx:100-128`
**SHALL** ganar `ForkKnife: mockIcon('icon-fork-knife')`. Ese mock hace
`React.createElement(View, { testID, ...props })`: reenvía `size` y `color`, así
que la decisión 2 y el invariante de tamaño son observables. **Ojo:** el mock de
`food.test.tsx:45-62` es **otro** —`function MockIcon({ color })`, descarta
`size`—; esta feature no añade iconos a Food, así que no hace falta tocarlo.

*Test:* `src/screens/home/index.test.tsx` →
`describe('#98 R7: la barra de comidas y todas sus decisiones')` con
`it('pinta dato, icono, copy, nombre accesible, huecos, tintas y tipografía')`,
`it('reparte el espacio y fija el orden de los hijos por posición')` y
`it('calcula el ancho del relleno con served/total')` (tres escenarios:
`{served:0,total:2}` → `0%`, `{served:1,total:2}` → `50%`,
`{served:3,total:3}` → `100%`).

### R8 — Cardinalidad, orden y ausencia de llamadas nuevas en la Home

**WHILE** la mascota **no** tiene plan (`mealsToday === null`, el valor por
defecto de `makePet`), **THE SYSTEM SHALL** dejar `reminders-section-body`
**exactamente** como en `914905b8`. Recuentos por escenario, viejo → nuevo:

| Escenario | Fixture | Test | Viejo | Nuevo |
|---|---|---|---|---|
| Cargando (`detail` pendiente) | — | `:2827-2828`, `:3176-3183` | 1 (skeleton) | **1** |
| Detalle en error | `{ kind: 'error' }` | `:3147-3149`, `:3191-3196` | 0 | **0** |
| Sin plan, con vacuna, sin recordatorios | `makePet({ nextVaccine })` | `:2365` (`[[], 1]`), `:2814-2816`, `:2844-2846`, `:3166-3170` | 1 | **1** |
| Sin plan, con vacuna, 1 recordatorio | ídem | `:2365` (`[[reminderFixture[0]], 2]`) | 2 | **2** |
| Sin plan, con vacuna, 3 recordatorios | ídem | `:2365` (`[reminderFixture, 4]`), `:2431` | 4 | **4** |
| Sin plan, sin vacuna, sin recordatorios | `makePet()` | `:2400` (`childCount: 1`) | 1 | **1** |
| Sin plan, sin vacuna, 3 recordatorios | `makePet()` | `:2400` (`childCount: 3`) | 3 | **3** |

**Ningún número de esa tabla se mueve**, y esa es la decisión: el campo nuevo
entra en las fixtures como `mealsToday: null` (R1), así que la barra no se
pinta en los escenarios heredados;

**AND WHEN** `mealsToday !== null`, **THE SYSTEM SHALL** añadir **exactamente
un** hijo al cuerpo, en la posición inmediatamente posterior a
`reminders-next-vaccine`:

| Escenario nuevo | Viejo | Nuevo |
|---|---|---|
| Con plan, con vacuna, sin recordatorios | 1 | **2**, orden `['reminders-next-vaccine','reminders-meals']` |
| Con plan, con vacuna, 3 recordatorios | 4 | **5**, orden `['reminders-next-vaccine','reminders-meals','reminders-item-rem-b','reminders-item-rem-a','reminders-item-rem-c']` |
| Con plan, sin vacuna, sin recordatorios | 1 (`reminders-none-upcoming`) | **2**, orden `['reminders-meals','reminders-none-upcoming']` |

**AND** el candado `#70 R3` (`src/screens/home/index.test.tsx:3459-3474`)
**SHALL** reescribirse así: sus dos primeras aserciones —`:3471`
`expect(body.children).toHaveLength(1)` y `:3472`
`expect(within(section).queryByText(/\d+\s*\/\s*\d+/)).toBeNull()`— se
**sustituyen** por sus contrarias bajo `mealsToday: { served: 1, total: 2 }`
(`toHaveLength(2)` y `getByText('1/2')` visible), y su tercera aserción
—`:3473` `expect(source).not.toContain("../../api/nutrition")`— **se conserva
literal**; el `describe` pasa a llamarse
`describe('#98 R8: la barra de comidas entra sin traerse el cliente de nutrición')`;

**AND** `#70 R15` (`:3444-3457`) **SHALL** seguir verde **sin cambiar una
línea**: `{ pets: 1, detail: 1, activity: 1, reminders: 1 }`. `mealsToday` viaja
dentro de `detail.data.pet`; la Home no monta ninguna query nueva ni importa
`../../api/nutrition`.

*Test:* `src/screens/home/index.test.tsx` →
`describe('#98 R8: la barra de comidas entra sin traerse el cliente de nutrición')`
con `it('suma un solo hijo y lo coloca tras la vacuna en tres escenarios')`
(la tabla de escenarios nuevos, contando `body.children` y mapeando
`child.props.testID`, con `unmount()` entre renders como hacen `:2348-2370` y
`:2375-2412`) y
`it('no importa el cliente de nutrición ni añade llamadas')` (la tercera
aserción conservada más el recuento de `#70 R15`).

### R9 — La tabla de uso de copy registra las ocurrencias nuevas

**WHEN** Food y la Home resuelven su copy nueva, **THE SYSTEM SHALL** registrar
cada ocurrencia en `mobile-pet-tracker/src/__tests__/ui-copy-table.ts`:

- `R6_FOOD` (hoy `:158-195`, **35** filas) **SHALL** ganar **tres** filas de
  `src/app/(tabs)/food.tsx` —`food.markServed`, `food.undoServed`,
  `food.couldNotUpdateMeal`—, quedando en **38**, y el candado de
  `src/__tests__/ui-language.test.ts:140` **SHALL** pasar de
  `expect(R6_FOOD).toHaveLength(35)` a `toHaveLength(35 + 3)` con el rótulo
  `it('resuelve las 38 ocurrencias normativas')`;
- `R3_HOME` (hoy `:45-98`, **51** filas) **SHALL** ganar **dos** filas de
  `src/screens/home/index.tsx` —`food.mealsToday` y `food.mealsServedOfTotal`—,
  quedando en **53**, y el candado de `src/__tests__/ui-language.test.ts:85`
  **SHALL** pasar de `21 + 15 + 1 + 4 + 7 + 2 + 1` a
  `21 + 15 + 1 + 4 + 7 + 2 + 1 + 2`;
- `ALL_USES` (`:420-433`) **SHALL NOT** tocarse: su candado
  (`ui-copy-table.ts:435-452`) ya es de consistencia interna.

*Test:* `src/__tests__/ui-language.test.ts` → además de los dos `toHaveLength`
anteriores, `describe('#98 R9: el copy de comidas servidas queda registrado')`,
`it('nombra las cinco ocurrencias nuevas y las resuelve en su fichero')`, que
filtra `R6_FOOD` y `R3_HOME` por las cinco claves y llama al helper `checkUses`
ya existente (`:38-64`).

### R10 — Los candados de estilo se mueven solo donde esta spec lo declara

> **Requisito de verificación** (CHECKPOINTS C4, tercer punto): R10 solo
> *asevera una propiedad* de artefactos que R7 ya dejó en el árbol. Se elige la
> **vía (a)**: su test se escribe **antes** que el `style={TABULAR_NUMS}` que
> verifica, y su rojo es real (7 medidos ≠ 8 esperados). Para que esa vía sea
> posible, **R7 no asevera el `style` del contador** —solo su `className`, su
> `testID` y su `accessibilityLabel`—: el `fontVariant` es de R10, entero. Ver
> [[tasks]] §Orden y §R10.

**WHEN** la Home gana el contador `reminders-meals-count`, **THE SYSTEM SHALL**
darle `style={TABULAR_NUMS}` (carta §Micro-reglas: «Contadores/números
alineados»), y los cuatro candados de `#62 R15` en
`src/__tests__/consistency-classnames.test.ts` **SHALL** moverse así:

| Sitio | Viejo | Nuevo |
|---|---|---|
| `:335-338` constantes | `HOME_TABULAR_AT_9358CC7 = 4`, `_DELTA_69 = 1`, `_DELTA_70 = 1`, `_DELTA_85 = 1` | + `const HOME_TABULAR_DELTA_98 = 1;` |
| `:342-347` fila de `home/index.tsx` en `counters` | `4 + 1 + 1 + 1` = **7** (medido: 7) | `4 + 1 + 1 + 1 + 1` = **8** |
| `:363-367` `#69 R10` suma total | `14 + 4 + 1 + 1 + 1` = **21** | `14 + 4 + 1 + 1 + 1 + 1` = **22** |
| `:369-376` `#69 R14` | `measured - 4` = `1 + 1 + 1` | `measured - 4` = `1 + 1 + 1 + 1` |
| `:378-385` `#70 R18` | `measured - 4 - 1` = `1 + 1` | `measured - 4 - 1` = `1 + 1 + 1` |

**AND** estos candados **SHALL** quedar **en su valor actual**, sin delta —cada
uno es una decisión de diseño de esta spec, no una casualidad—:

| Candado | Sitio | Valor | Por qué no se mueve |
|---|---|---|---|
| `style={CONTINUOUS_CORNER}` en `home/index.tsx` | `consistency-classnames.test.ts:273` | **2** | todas las esquinas nuevas son cápsula (`rounded-full`) o las dibuja `Card` |
| `style={CONTINUOUS_CORNER}` en `food.tsx` | `:276` | **2** | el control nuevo es una cápsula |
| suma de `CONTINUOUS_CORNER` | `:328-330` | `33 + 1 + 1` = **35** | consecuencia de los dos anteriores |
| `rounded-xl bg-accent` | `:97-104` | **13** | el relleno usa `rounded-full bg-accent`, que ese regex no casa |
| `bg-accent-soft` | `:437-449` | **16** | el disco usa `bg-category-rose`, no `bg-accent-soft` |
| `text-accent-strong` en `home/index.tsx` / `food.tsx` | `legibility-classnames.test.ts:123` / `:125`, suma `:136-139` = `13 + 1 + 1` | **2** / **1** / **15** | ni la barra ni el botón usan el acento como tinta |
| `rounded-2xl\|lg\|md\|sm` prohibidos | `:149-155` | **0** | la escala de radios se respeta |

**AND** los ficheros de esta feature **SHALL** pasar el grep-clean de
`src/__tests__/design-drift.test.ts` —cero hex fuera de `src/theme/`, cero
clases arbitrarias `[...]`, cero `StyleSheet`, cero shadow/elevation legacy—,
para lo cual **SHALL** añadirse
`describe('#98 R10: la barra de comidas no mete drift de estilo')` con la lista
`['api/nutrition.ts', 'api/types.ts', 'i18n/catalog.ts', 'app/(tabs)/food.tsx',
'screens/home/index.tsx']`, calcado en intención del `#85 R12` de `:310-329`.

*Test:* `src/__tests__/consistency-classnames.test.ts` (los cinco sitios de la
primera tabla, más `describe('#98 R10: los candados que esta feature no mueve')`
con `it('deja CONTINUOUS_CORNER, bg-accent-soft y el acento donde estaban')`) y
`src/__tests__/design-drift.test.ts` (el `describe` nuevo).

### R11 — Las dos specs que esta feature enmienda quedan enmendadas

**WHEN** #98 reemplaza una decisión ya aprobada por un humano, **THE SYSTEM
SHALL** dejarlo escrito donde vive esa decisión, sin auto-aprobarse:

- **`docs/ui-guidelines.md`** **SHALL** ganar, al final del fichero (tras
  §Enmienda #70, que hoy acaba en `:361`), una sección
  `## Enmienda #98 — la barra de comidas de la Home`, con la enumeración de las
  doce decisiones de R7 en el formato de la §Enmienda #70, el hueco `rose` para
  el tipo `food`, la regla `fondo ⇒ bg-accent` para el relleno, y la línea de
  firma `- [ ] Enmienda aprobada por humano`;
- **`specs/mobile-food/requirements.md`** **SHALL** ganar
  `## Enmienda #98 — la comida servida deja de derivarse del reloj`, que retira
  **D7** («Served/Pending por hora local», §Decisiones del gate `:323-327`) y la
  viñeta de §Fuera de alcance `:306-309` («Marcar comida como servida /
  tracking de raciones consumidas»), declara que R5 de #38 sigue vigente en todo
  lo demás, y lleva su propia línea `- [ ] Enmienda aprobada por humano`;
- **`specs/mobile-food/design.md`** §D7 (`:185-195`) **SHALL** tacharse con
  `~~…~~` y remitir a esta spec, exactamente como §D8 de ese mismo fichero ya
  hace con la enmienda de #65 (`:197-199`).

*Test:* `src/__tests__/consistency-classnames.test.ts` →
`describe('#98 R11: la carta y la spec de Food registran la enmienda')`,
`it('declara la barra de comidas en la carta y retira D7 de mobile-food')`, que
lee `../docs/ui-guidelines.md` y `../specs/mobile-food/requirements.md` con
`readFileSync` (mismo patrón que `#62 R1` en `:73-88` y `#64 R10` en `:452-486`)
y asevera los rótulos literales de las dos enmiendas más la presencia de la
línea de firma, **marcada o no** (`/- \[[ xX]\] Enmienda aprobada por humano/`,
como hace `ui-language.test.ts:295-303`).

## Prueba de humo del humano (no delegable a IA)

Runtime: **dev build de Android**. **Nunca Expo Go** — la app monta módulos
nativos propios (`expo-maps` desde #46, `expo-notifications` desde #79) y la
carta lo fija en §Animación («el runtime de smoke del humano es el dev build de
Android desde 2026-08-27»).

Requisitos de entorno, todos verificables antes de empezar:

1. Backend en marcha con la migración **`0017_meal_servings`** aplicada
   (`backend-pet-tracker/src/db/migrations/0017_meal_servings.sql`), vía
   `pnpm db:migrate` desde `backend-pet-tracker/` — **nunca `psql` crudo**
   (`docs/conventions.md` §Nunca apliques una migración con `psql` crudo).
2. `EXPO_PUBLIC_API_URL` apuntando a la IP LAN del backend, no a `localhost`.
3. Una mascota del usuario con **perfil nutricional** y **plan generado**
   (`PUT /v1/pets/:id/nutrition-profile` + un peso + `POST …/nutrition-plan/generate`);
   sin plan, `mealsToday` es `null` y la barra no se pinta — eso también se
   comprueba.
4. Dev build reconstruido si cambió algo nativo; si no, `bunx expo start --dev-client`.

- [ ] Con plan: en Food, una franja pendiente → pulsar → queda **Servido** y el
      contador sube
- [ ] Ir a Home: la barra `Comidas hoy` aparece bajo la vacuna con el contador y
      el relleno proporcional
- [ ] Volver a Food, pulsar la misma franja → queda **Pendiente**; Home: la
      barra baja
- [ ] Segunda mascota **sin** plan: la barra **no** aparece en la Home
- [ ] Con el backend apagado: pulsar una franja → aparece `No se pudo actualizar
      la comida`; al volver el backend, reintentar la borra
- [ ] Modo oscuro: el relleno verde y el disco rosa siguen legibles
- [ ] Smoke ejecutado por el humano (fecha: ____)

## Decisiones (cerradas por escrito, para Codex)

- **D1 — `servedToday` es la única fuente del estado servido.** No se cachea, no
  se deriva, no se mezcla con el reloj. Si el servidor devuelve
  `servedToday: []` tras un `201`, la UI pinta `0/N` — y eso es correcto, porque
  el plan pudo regenerarse (D4 de #83).
- **D2 — Sin estado optimista, y por eso sin `acked`.** El overlay local de
  alerts (#78) es cierto un rato porque allí el servidor solo *supera* la
  acción; en comidas puede *invalidarla*. La espera entre el `press` y el
  repintado es el precio, aceptado por el humano el 2026-09-15.
- **D3 — El refresco del perfil va por `refetchQueries`, no por
  `invalidateQueries`.** `useQueryClient` no se usa hoy en `src/` de producción;
  esta feature lo introduce con **un solo** uso. Red de seguridad ya existente:
  la Home refresca `detail` al recuperar el foco
  (`src/screens/home/index.tsx:247-252`, candado `R10: refetch al foco` en
  `index.test.tsx:1049`), así que aunque el `refetchQueries` no alcance una
  query inactiva, la Home nunca enseña un `mealsToday` viejo.
- **D4 — El control es el badge que ya existía, ascendido a `Pressable`.** No se
  añade un `Button` de heroui: habría movido el candado `rounded-xl bg-accent`
  (13) y habría metido un segundo tratamiento visual en una fila que ya tiene su
  píldora. El badge conserva `testID`, copy y `className`; solo gana un padre
  pulsable con objetivo táctil de 44 pt.
- **D5 — El hueco de la barra es `rose`.** Es el que `docs/ui-guidelines.md`
  §Dirección de arte 1 asigna al tipo `food`, y el que ya usa
  `REMINDER_TYPE_META.food` (`src/utils/reminder-meta.ts:34-38`). El icono es
  `ForkKnife` —el mismo que Food usa en su tile de plan, `food.tsx:168`— y no
  `Bone`, porque `Bone` es el icono de los **recordatorios** de tipo `food` y
  cruzarlos rompería la decisión 2 de la §Enmienda #70.
- **D6 — El relleno es `bg-accent`, no `bg-accent-strong`.** Regla mecánica de
  la carta §Decisiones fijas 11: *fondo ⇒ `--accent`; encima de otra cosa ⇒
  `--accent-strong`*. El `#2AB87C` del Make es la desviación declarada de #61:
  en claro el relleno sale `#178255` y **no** coincide con el Make; es esperado.
- **D7 — El título de la barra es `food.mealsToday` («Comidas hoy»), no
  «Alimentación» del Make.** La entrada de #98 pide reutilizar claves antes que
  inventarlas, y «Comidas hoy» dice lo mismo con el vocabulario que la app ya
  usa en Food. Es una desviación consciente del Make y está en §Decisiones
  abiertas por si el humano prefiere la palabra del diseño.
- **D8 — Un solo `pendingMealTime` para toda la pantalla.** Bloquear solo la
  franja pulsada permitiría dos POST simultáneos y dos refetch cruzados; el plan
  es un único recurso, así que la serialización es total.
- **D9 — Sin animación.** La barra aparece con el `Card`; no se añade
  `Reanimated` ni transición de ancho. Si el humano la quiere, es feature aparte
  con su entrada en `progress/audit_animations_mobile.md`.

## Decisiones abiertas — las cierra el humano en el gate

1. **Título de la barra** (D7): `food.mealsToday` («Comidas hoy») vs.
   «Alimentación» del Make. Si el humano elige la del Make, R3 gana una quinta
   clave `home.mealsBarTitle` y los totales pasan a 310 / R3_HOME 53.
2. **`refetchQueries` sobre `petKeys.detail`** (D3): ¿basta con el refetch al
   foco de la Home, y entonces Food solo refresca su plan? Eso quitaría el único
   `useQueryClient` de producción y simplificaría R5.
3. **Las dos enmiendas de R11** (`docs/ui-guidelines.md` y
   `specs/mobile-food/`): cada una lleva su propia casilla
   `- [ ] Enmienda aprobada por humano` y el gate las firma **aparte** de esta
   spec.

## Fuera de alcance

- **Reestructurar `src/app/(tabs)/food.tsx` a route delgado + `src/screens/`.**
  Es una ruta gorda y contradice la convención vigente desde #39
  (`docs/conventions.md` §Estructura Expo oficial), pero esa misma convención
  dice que las pantallas anteriores a #39 «no se migran en frío». Queda **fuera
  de alcance** y se declara aquí para que el humano decida si abre feature
  aparte. #98 edita `food.tsx` en el sitio.
- Extraer la barra a `src/components/`: la regla de extracción de la carta
  (§Decisiones fijas 4) pide ≥2 pantallas; hoy es una.
- `POST /v1/pets/:petId/meals` desde la Home: la Home no escribe, solo lee.
- Editar horarios, añadir comidas o el anillo de kcal consumidas del Make: sin
  dato en backend, igual que declaró #38.
- Historial de comidas servidas de días anteriores (el backend las guarda; nadie
  las pide).
- Traducir los mensajes del backend (`MEAL_ALREADY_SERVED`, …): la UI nunca los
  enseña, muestra su propio copy.
- Cambios en `backend-pet-tracker/`, `infra/`, `init.config.sh` o CI.
- Animación de la barra, haptics (`expo-haptics` no está instalado) y cualquier
  dependencia nueva.

## Aprobación

- [X] Aprobado por humano (fecha: 2026-09-21) ← gate obligatorio antes de implementar

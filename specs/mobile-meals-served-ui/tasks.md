---
feature: "mobile-meals-served-ui"
status: spec_ready
tags: [harness, spec, mobile]
---

# Tareas — [[mobile-meals-served-ui]] (#98)

> Disciplina TDD: **(1) test rojo → (2) implementación mínima → (3) refactor**,
> requisito por requisito. Cada tarea corresponde a un R de [[requirements]].
> Commits **test-primero**: el rojo se versiona en su propio commit
> (CHECKPOINTS C4). Ningún commit rojo puede fallar por `ReferenceError` de un
> helper que aún no existe, ni por mutar un doble de test.

## Antes de empezar

- [ ] `rm -f mobile-pet-tracker/.expo/types/router.d.ts` (gitignorado; sus rutas
      fantasma rompen `tsc`)
- [ ] `git log -1` → confirmar que la base es `914905b8`. Si hubo rebase, las
      cifras de [[requirements]] se re-miden antes de usarlas
- [ ] **No lanzar `./init.sh`**: Postgres y LocalStack son compartidos con los
      worktrees vecinos. Los comandos de verificación son los de
      [[design]] §7, con `--runTestsByPath`

## Orden y por qué es ese (candado §2.d — sujeto ausente)

Recorrido requisito a requisito: **ningún test asevera un nodo que su propio
orden no haya creado todavía**.

| # | R | Sujeto que asevera | ¿Existe ya cuando se asevera? |
|---|---|---|---|
| 1 | R1 | `src/api/types.ts`, 10 fixtures `PetProfile` y 2 fixtures `NutritionPlan` | Sí — los crea R1 |
| 2 | R2 | `serveMeal` / `unserveMeal` | Sí — los crea R2 |
| 3 | R3 | las 4 claves de `catalog.ts` y las filas de `specs/mobile-ui-language/design.md` | Sí — los crea R3. Va **antes** de R4-R7 porque `TranslationKey` no compila si una pantalla llama a una clave que no existe |
| 4 | R4 | `food-meals-progress`, `meal-served-*`, `meal-pending-*` | Sí — ya existen desde #38; R4 solo cambia de dónde sale su valor. Necesita `servedToday` (R1) |
| 5 | R5 | `meal-toggle-<i>` | Sí — lo crea R5. Necesita R2 (las funciones), R3 (las claves) y R4 (el `served` del que depende la rama) |
| 6 | R6 | `food-meal-error` | Sí — lo crea R6. Necesita R5 (la pulsación que lo dispara) |
| 7 | R7 | `reminders-meals` y sus cuatro descendientes | Sí — los crea R7. Necesita R1 (`mealsToday`) y R3 (`food.mealsServedOfTotal`) |
| 8 | R8 | `reminders-section-body.children` con la barra dentro | Sí — R7 ya la pintó. **Aquí estaba el riesgo**: R8 cuenta un hijo que R7 crea, por eso R8 va detrás |
| 9 | R9 | las llamadas `t('food.markServed')`… en `food.tsx` y `home/index.tsx` | Sí — R5, R6 y R7 ya las escribieron. `checkUses` cuenta ocurrencias en el **fuente**: adelantar R9 lo dejaría rojo para siempre |
| 10 | R10 | `style={TABULAR_NUMS}` del contador de la Home | El **nodo** existe (R7), el **`style` no**: R7 lo deja deliberadamente sin `TABULAR_NUMS` para que el rojo de R10 sea real (vía (a) de C4). Ver §R10 |
| 11 | R11 | los rótulos de las dos enmiendas | Sí — los crea R11 |

---

## R1 — Los tipos del cliente ganan `servedToday` y `mealsToday`

- [x] **(1) Rojo.** En `src/screens/home/index.test.tsx`, añadir
      `describe('#98 R1: los tipos del cliente declaran servedToday y mealsToday')`
      con `it('añade los dos campos sin tocar nextReminder ni activitySummary')`,
      junto al `#70 R2` que ya lee `types.ts` (`:2947-2966`). Falla porque los
      bloques de interfaz no tienen los campos.
- [x] **(2) Verde.** Añadir `servedToday: string[]` a `NutritionPlan`,
      `export interface MealsToday { served: number; total: number }` y
      `mealsToday: MealsToday | null` a `PetProfile`. Añadir `mealsToday: null`
      a las **diez** fixtures `makePet` que [[requirements]] R1 enumera y
      `servedToday: []` a los `makePlan` de `food.test.tsx:104-119` y
      `meal-schedule.test.tsx:95-108` (corrección de alcance autorizada por el
      humano el 2026-09-21). **No** tocar `src/hooks/use-pet-selection.test.tsx`.
- [x] **(3) Refactor.** `bunx tsc --noEmit` + los dos lotes de jest de
      [[design]] §7 (8 + 8 suites). Verificar que el número de suites que
      imprime jest coincide con el de rutas.

## R2 — `serveMeal` y `unserveMeal`

- [x] **(1) Rojo.** En `src/api/__tests__/nutrition.test.ts`,
      `describe('#98 R2: serveMeal y unserveMeal mapean la respuesta por kind')`
      con los dos `it` de [[requirements]] R2. Importar las dos funciones desde
      `../nutrition`: el rojo es de compilación y de aserción, no un
      `ReferenceError` de helper — los helpers `response` e
      `invalidJsonResponse` ya viven en ese fichero (`:14-26`).
- [x] **(2) Verde.** Escribir `ServeMealState`, `UnserveMealState`, `serveMeal`
      y `unserveMeal` en `src/api/nutrition.ts`, con `postJson`/`deleteJson` de
      `./http` y `readJson` solo donde hay que leer el `code`. Modelo estructural:
      `deleteReminder` en `src/api/reminders.ts:122-155`.
- [x] **(3) Refactor.** `bunx jest --runTestsByPath 'src/api/__tests__/nutrition.test.ts'`.

## R3 — Cuatro claves nuevas en el catálogo

- [x] **(1) Rojo.** En `src/providers/__tests__/language-provider.test.tsx`:
      subir `:55` a `260 + 16 + 1 + 4 + 7 + 14 + 2 + 1 + 4`, ampliar el
      comentario de `:50` con `+ 4 de #98`, y añadir
      `describe('#98 R3: el catálogo trae las cuatro claves de comidas servidas')`.
      Falla con `305 !== 309` y con las cuatro claves ausentes.
- [x] **(2) Verde.** Añadir las cuatro claves a `en` y a `es` de
      `src/i18n/catalog.ts` con los valores literales de la tabla de
      [[requirements]] R3, en el bloque `food.*` y en el **mismo orden** en los
      dos idiomas. Añadir las cuatro filas a `specs/mobile-ui-language/design.md`
      §2.6 con el sufijo `← añadida por #98 (R3)` y actualizar el rótulo de la
      sección a `(38 ocurrencias, 33 claves)`.
- [x] **(3) Refactor.** `bunx jest --runTestsByPath 'src/providers/__tests__/language-provider.test.tsx'`.
      Comprobar que `Object.keys(en).length === Object.keys(es).length === 309`.

## R4 — El estado servido sale de `servedToday`

- [x] **(1) Rojo.** En `src/app/(tabs)/__tests__/food.test.tsx`: añadir
      `describe('#98 R4: el estado servido sale de servedToday, no del reloj')`
      con sus dos `it`, y **en el mismo commit** aplicar los deltas de la tabla
      de [[requirements]] R4 a `describe('R5: …')`: fuera `jest.useFakeTimers`
      (`:263`), `jest.setSystemTime` (`:264`) y el `afterEach` de `:268-270`;
      `:301`, `:310`, `:315` y `:327-334` pasan a nacer de
      `makePlan({ servedToday: [...] })`. Rojo porque producción sigue mirando
      el reloj.
- [x] **(2) Verde.** En `src/app/(tabs)/food.tsx`: borrar `localTimeHhmm`
      (`:24-29`), `const hhmm` (`:52`) y el `filter` de `:61-64`;
      `servedMeals` pasa a `loadedPlan.servedToday.length` y
      `const served = loadedPlan.servedToday.includes(mealTime)`.
- [x] **(3) Refactor.** `bunx jest --runTestsByPath 'src/app/(tabs)/__tests__/food.test.tsx'`.
      Confirmar que el fuente ya no contiene `new Date(`.

## R5 — Botón por franja: sirve, deshace y refresca

- [x] **(1) Rojo.** En `food.test.tsx`: ampliar
      `jest.mock('../../../api/nutrition', …)` (`:26-28`) a
      `{ getNutritionPlan: jest.fn(), serveMeal: jest.fn(), unserveMeal: jest.fn() }`,
      declarar `mockServeMeal` / `mockUnserveMeal` con `jest.mocked`, y añadir
      `describe('#98 R5: cada franja sirve, deshace y refresca')` con sus tres
      `it`. El `jest.spyOn(view.queryClient, 'refetchQueries')` se instala tras
      el render y **antes** del `press`.
- [x] **(2) Verde.** En `food.tsx`: `useQueryClient` de `@tanstack/react-query`;
      `const [pendingMealTime, setPendingMealTime] = useState<string | null>(null)`;
      `toggleMeal(mealTime, served)` con el flujo de [[design]] §3; el badge
      envuelto en el `Pressable` de [[design]] §5.
- [x] **(3) Refactor.** `bunx jest --runTestsByPath 'src/app/(tabs)/__tests__/food.test.tsx'`.
      Si alguna aserción heredada se apoyaba en la posición del badge dentro de
      `meal-row-<i>`, reapuntarla al `Pressable` y buscar el `Text` con
      `within(toggle)`.

## R6 — Conflicto silencioso, fallo con aviso

- [x] **(1) Rojo.** `describe('#98 R6: el conflicto se resuelve refrescando y el fallo avisa')`
      en `food.test.tsx`, con los dos `it` de [[requirements]] R6. Rojo: hoy
      ningún `kind` pinta nada.
- [x] **(2) Verde.** `const [mealError, setMealError] = useState<string | null>(null)`;
      `setMealError(null)` al inicio de `toggleMeal`; `setMealError(t('food.couldNotUpdateMeal'))`
      en los cuatro `kind` de fallo; `<Text testID="food-meal-error" selectable className="text-danger">`
      como **último** hijo de `food-meals-section`, renderizado solo si
      `mealError !== null`.
- [x] **(3) Refactor.** Comprobar que `food-meals-section` mantiene el número de
      hijos esperado en cada rama y que el aviso convive con las filas (no las
      sustituye).

## R7 — La barra de comidas en la Home

- [x] **(1) Rojo.** En `src/screens/home/index.test.tsx`: añadir
      `ForkKnife: mockIcon('icon-fork-knife')` al mock de reicon (`:100-128`) y
      `describe('#98 R7: la barra de comidas y todas sus decisiones')` con sus
      tres `it`. Rojo por `reminders-meals` ausente.
- [x] **(2) Verde.** En `src/screens/home/index.tsx`: importar `ForkKnife`;
      ampliar `useThemeColors` de `:167-173` con `'category-rose-strong'` →
      `mealsInk`; insertar el bloque de [[design]] §4 **entre**
      `reminders-next-vaccine` (acaba en `:667`) y `reminders-none-upcoming`
      (`:669`), con la condición
      `detail.data?.kind === 'ok' && detail.data.pet.mealsToday !== null`.
      **Sin `style={TABULAR_NUMS}` en el contador** — eso es R10.
- [x] **(3) Refactor.** `bunx jest --runTestsByPath 'src/screens/home/index.test.tsx'`.
      Esperar rojo **solo** en los tests que R8 y R10 aún no han tocado; si algo
      más cae, es un candado no declarado: **parar y reportarlo**, no ajustar la
      cifra.

## R8 — Cardinalidad, orden y ausencia de llamadas nuevas

- [x] **(1) Rojo por mutación de producción (vía (b), autorizada por el humano
      el 2026-09-21).** Reescribir `describe('#70 R3: la barra de comidas queda
      fuera')` (`:3459-3475`) como
      `describe('#98 R8: la barra de comidas entra sin traerse el cliente de nutrición')`
      con los dos `it` de [[requirements]] R8: sustituir `:3471` y `:3472` por
      sus contrarias bajo `mealsToday: { served: 1, total: 2 }` y **conservar
      literal** `:3473`. Añadir el `it` de los tres escenarios nuevos. Mover
      temporalmente el bloque `reminders-meals` después de las filas de
      recordatorio: el rojo debe ser de orden en R8, no de un doble de test.
- [x] **(2) Verde.** Restaurar el bloque inmediatamente después de
      `reminders-next-vaccine`. Si algún
      recuento heredado de la tabla «viejo → nuevo» de [[requirements]] R8 se
      movió, el defecto está en la **condición de render** o en una fixture a la
      que le falta `mealsToday: null` — se arregla ahí, nunca cambiando el
      número.
- [x] **(3) Refactor.** Confirmar que `#70 R15` (`:3444-3457`) sigue verde **sin
      una sola línea tocada** y que `#70 R1`, `R6`, `R7`, `R8`, `R9`, `R11`,
      `R12`, `R13`, `R14` y los `#85 R*` siguen verdes.

## R9 — La tabla de uso de copy

- [x] **(1) Rojo.** En `src/__tests__/ui-language.test.ts`: `:85` pasa a
      `21 + 15 + 1 + 4 + 7 + 2 + 1 + 2`; `:140` pasa a `35 + 3` con el rótulo
      `it('resuelve las 38 ocurrencias normativas')`; añadir
      `describe('#98 R9: el copy de comidas servidas queda registrado')`. Rojo:
      `51 !== 53` y `35 !== 38`.
- [x] **(2) Verde.** Añadir a `src/__tests__/ui-copy-table.ts` las tres filas de
      `src/app/(tabs)/food.tsx` en `R6_FOOD` y las dos de
      `src/screens/home/index.tsx` en `R3_HOME`. **No** tocar `ALL_USES`.
      Desdoblar el ternario de R5 en dos llamadas directas `t('clave')` para
      que `checkUses` pueda resolverlas (corrección autorizada por el humano el
      2026-09-21), sin alterar la condición ni el resultado.
- [x] **(3) Refactor.** `bunx jest --runTestsByPath 'src/__tests__/ui-language.test.ts'`.
      `checkUses` compara ocurrencia a ocurrencia: si sale un descuadre, es que
      una clave se usa más o menos veces de lo que la tabla dice.

## R10 — Los candados de estilo (requisito de verificación, vía (a))

> **Por qué su rojo es honesto.** R7 dejó el contador **sin**
> `style={TABULAR_NUMS}` a propósito y su test no asevera el `style`. R10
> escribe primero las aserciones (medido 7, esperado 8) y luego añade el
> `style`. Es la vía **(a)** de CHECKPOINTS C4: el test se escribe antes que la
> implementación que verifica. Si por lo que sea el orden se rompe y el
> `style` ya estuviera puesto, el cierre pasa a la vía **(b)**: quitarlo,
> versionar el rojo por la aserción de `#62 R15`, y restaurarlo en el verde —
> mutación de **producción**, nunca de un doble.

- [x] **(1) Rojo.** En `src/__tests__/consistency-classnames.test.ts`: añadir
      `const HOME_TABULAR_DELTA_98 = 1;` junto a las otras tres (`:335-338`) y
      aplicar los cuatro deltas de la tabla de [[requirements]] R10 (`:342-347`,
      `:363-367`, `:369-376`, `:378-385`). Añadir
      `describe('#98 R10: los candados que esta feature no mueve')`. En
      `src/__tests__/design-drift.test.ts`, añadir
      `describe('#98 R10: la barra de comidas no mete drift de estilo')` con la
      lista de cinco ficheros de [[requirements]] R10. Rojo: 7 ≠ 8.
- [x] **(2) Verde.** Añadir `style={TABULAR_NUMS}` a `reminders-meals-count` en
      `src/screens/home/index.tsx`, y en `#98 R7` añadir la aserción
      `expect(count.props.style).toEqual(TABULAR_NUMS)`.
- [x] **(3) Refactor.** `bunx jest --runTestsByPath 'src/__tests__/consistency-classnames.test.ts'
      'src/__tests__/legibility-classnames.test.ts' 'src/__tests__/design-drift.test.ts'`.
      **Sonda de mutación, obligatoria y documentada en
      `progress/impl_mobile-meals-served-ui.md`:** (a) cambiar `bg-accent` del
      relleno por `bg-accent-strong` → rojo por `#98 R7`; (b) intercambiar el
      `accessibilityLabel` del contador con el del badge de la vacuna → rojo por
      `#98 R7`; (c) poner `size={28}` en `ForkKnife` → rojo por `#98 R7`;
      (d) quitar `style={TABULAR_NUMS}` → rojo por `#62 R15`. Restaurar con
      `git checkout` y comprobar `git diff` vacío. Un candado que nadie vio
      fallar no es un candado.

## R11 — Las dos enmiendas

- [x] **(1) Rojo.** En `src/__tests__/consistency-classnames.test.ts`,
      `describe('#98 R11: la carta y la spec de Food registran la enmienda')`
      con `it('declara la barra de comidas en la carta y retira D7 de mobile-food')`.
      Rojo: los rótulos no existen.
- [ ] **(2) Verde.** Escribir `## Enmienda #98 — la barra de comidas de la Home`
      al final de `docs/ui-guidelines.md`;
      `## Enmienda #98 — la comida servida deja de derivarse del reloj` en
      `specs/mobile-food/requirements.md`; tachar §D7 de
      `specs/mobile-food/design.md:185-195` con `~~…~~` + remisión a esta spec.
      Las dos enmiendas llevan `- [ ] Enmienda aprobada por humano` **sin
      marcar**: las firma el humano, no el implementador.
- [ ] **(3) Refactor.** Releer las dos enmiendas contra el formato de las que ya
      existen (§Enmienda #67 y §Enmienda #70 de la carta) y contra
      `ui-language.test.ts:295-303`, que exige la línea de firma marcada o no.

## Cierre (antes de abrir el PR)

- [ ] Los dos lotes de jest de [[design]] §7 en verde, con el recuento de suites
      comprobado (8 y 8)
- [ ] `bunx tsc --noEmit` limpio
- [ ] Suite móvil completa en verde. Si jest repite primero un fichero que
      estaba rojo, **borrar la perf-cache entre repeticiones**: la segunda
      corrida verde es el control más favorable, no una absolución
- [ ] `progress/impl_mobile-meals-served-ui.md` con: los cuatro resultados de la
      sonda de mutación, el `git diff` vacío tras restaurar, y la traza de cada
      commit rojo→verde
- [ ] [[traceability]] sin ninguna fila «pendiente»
- [ ] Commits con el formato `feat(mobile): <desc> (R1,R2)` y con historial
      **test-primero** visible
- [ ] **No** marcar #98 como `done`, **no** mergear, **no** firmar las
      enmiendas de R11

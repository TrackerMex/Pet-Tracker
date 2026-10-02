---
feature: "mobile-meal-schedule-editing"
status: draft        # draft | approved
tags: [harness, spec, mobile]
---

# Tareas — [[mobile-meal-schedule-editing]] (#147)

> Disciplina TDD. Cada requisito de [[requirements]] lleva **un par de commits**:
> primero `test(...)`, que debe estar rojo por el motivo declarado aquí, y
> después `feat(...)`, que lo pone verde. El refactor, si hace falta, va en el
> `feat` o en un `refactor(...)` aparte, nunca mezclado con el test.
> Prohibido meter implementación, tests y docs en un mismo commit (C4 de
> `CHECKPOINTS.md`; fue lo que pasó en #19).

## §Arranque (antes del primer commit, todo desde la raíz del worktree)

1. `git rev-parse --short HEAD` debe dar el hash del handoff que el leader
   escriba en el prompt. Si no coincide, **PARA** y avisa.
2. `test ! -e mobile-pet-tracker/.expo/types/router.d.ts`. Si devuelve un
   código distinto de 0, el fichero existe: **PARA** y avisa al leader. No lo
   borres: tu sandbox deniega `rm -f` sobre él (#121).
3. Mide la base y escribe lo que salga en `progress/impl_mobile-meal-schedule-editing.md`:
   - `grep -n "260 + 16 + 1 + 4 + 7 + 14 + 2 + 1 + 4 - 6 + 1 + 2 + 3 + 11," mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx`
     debe dar **una** línea. Si da cero, #146 ya mergeó: aplica
     [[design]] §Conflicto previsto con #146 y añade solo `+ 9` a la suma que encuentres.
   - `grep -n "toHaveLength(35 + 3 + 1 - 2 + 1)" mobile-pet-tracker/src/__tests__/ui-language.test.ts`
     debe dar una línea.
   - `grep -n "'common.cannotReachServer'\|'common.somethingWentWrong'" mobile-pet-tracker/src/i18n/catalog.ts`
     debe confirmar `No se pudo conectar con el servidor` y `Algo salió mal` en `es`.
   - `grep -c "file: 'src/screens/meal-schedule/index.tsx', key: 'common.somethingWentWrong'" mobile-pet-tracker/src/__tests__/ui-copy-table.ts`
     debe dar `4`, y la misma búsqueda con `common.cannotReachServer` debe dar `1`.
4. Skills. Carga `building-native-ui`, `native-data-fetching`,
   `expo-ui-jetpack-compose` **y** `appllama-app-design-skill` (esta última
   está en `.agents/skills/`). Escribe en `impl` cuáles cargaste de verdad.
   Si la carta (`docs/ui-guidelines.md`) choca con una skill, gana la carta.
   La regla de appllama «Optimistic by default» **no aplica**, ver [[design]] §Skills cargadas al escribir la spec.
5. Instala y ejecuta con **bun**: `bunx jest …`, nunca `npx`. Los filtros de
   esta feature no llevan paréntesis. Si alguna vez filtras Food, escápalo:
   `bunx jest 'src/app/\(tabs\)/__tests__/food.test.tsx'`. Sin escapar se salta
   el fichero y devuelve exit 0 (`docs/conventions.md` §Filtros de jest con rutas que llevan paréntesis).

Comandos de cada ciclo, desde `mobile-pet-tracker/`:

- R1 y R9: `bunx jest src/providers/__tests__/language-provider.test.tsx src/__tests__/ui-language.test.ts`
- R2 y R3: `bunx jest src/api/__tests__/nutrition.test.ts`
- R4 a R8: `bunx jest src/screens/meal-schedule` (en R8 también los dos ficheros de R1/R9)

## §Esperas (resume `docs/conventions.md` §Esperas sobre el árbol renderizado, que es obligatoria)

- Espera sobre **la misma observación del árbol** que van a hacer las
  aserciones posteriores. Cuando la condición mezcla un mock y el árbol, la
  espera es **conjunta**: un solo `waitFor` con las dos aserciones. Nunca
  esperes solo a que un contador de mock cambie para luego consultar el árbol
  (eso paró #146 en R7).
- Toda ausencia (`queryBy… toBeNull()`) se ancla en un nodo **positivo** ya
  observado en el mismo estado.
- **Espera de cierre**: todo `it` que dispara una llamada de R5 o R6 termina con
  `await waitFor(...)` hasta que `meal-time-edit-0` deje de estar
  deshabilitado (`accessibilityState` sin `disabled: true`). Así ningún
  refetch de R7 se escapa del test. Antes de R7 esa espera pasa al instante, y
  es correcto que pase.
- Ancla de rol resuelto, para las ausencias de R4. `await renderMealSchedule()`
  devuelve el resultado de `renderWithProviders`, que incluye `queryClient`.
  Espera a que `queryClient.getQueryData(['pets', 'detail', 'pet-1'])` sea
  igual al estado que devolvió el mock. Usa la clave **literal**, no
  `petKeys.detail`.

## §Mocks de la suite de meal-schedule (intención, comprobada contra el fichero destino)

`src/screens/meal-schedule/index.test.tsx` en `cb14497c` no mockea ni
`../../api/pets` ni `@expo/ui`. Su mock de `../../api/nutrition` es una
factoría con `generateNutritionPlan`, `getNutritionPlan` y
`getNutritionProfile`.

- **R4 (commit de test)**:
  - añade `jest.mock('../../api/pets', () => ({ getPet: jest.fn() }))`;
  - añade un helper `petState(myRole)` que construya un `PetState` `ok`
    completo, con la misma forma que el de `src/screens/geofences/index.test.tsx`
    (`grep -n "function petState"`);
  - añade un helper `childTestIds(node)` igual que el de ese fichero;
  - en el `beforeEach`, **después** del reset que ya existe, pon el valor por
    defecto `getPet → petState('family')`. Así las suites R7/R8/#62/#87/#95 que
    ya existen no ven controles y no cambian.
- **R5 (commit de test)**:
  - añade `moveMealTime: jest.fn()` a la factoría de `../../api/nutrition`;
  - el valor por defecto en `beforeEach` es `{ kind: 'ok' }`;
  - añade dos mocks, que puedes calcar de `src/screens/add-reminder/index.test.tsx`
    (`grep -n "jest.mock('@expo/ui"`):
    1. `@expo/ui`: `Host` pinta un `View` con `testID="expo-ui-picker-host"` y
       pasa los `children`;
    2. `@expo/ui/community/datetime-picker`: el default export pinta un `View`
       con **todas** las props, para que el test lea
       `value`/`mode`/`presentation` y dispare
       `fireEvent(picker, 'onValueChange', {}, fecha)` y
       `fireEvent(picker, 'onDismiss')`.
- **R6 (commit de test)**: añade `addMealTime: jest.fn()` a la misma factoría,
  con valor por defecto `{ kind: 'ok' }`.
- Para el plan, usa `makePlan` y la forma de `NutritionPlanState` que ya usa la
  suite. Las franjas por defecto son `['07:30', '19:30']`.
- Pulsa los controles con el mismo `fireEvent` (y el mismo `await`) que ya
  usa la suite.

## §Técnica TZ (R5 y R6)

El host de jest corre en UTC, así que leer la hora con getters UTC o con
getters locales da lo mismo: un test que no lo controle no ve el error. Se
usan dos técnicas, cada una con su precedente:

1. **Valor de apertura**: `process.env.TZ = 'America/Mexico_City'` (UTC-6 sin
   horario de verano) dentro de `try/finally`, envolviendo el render, la
   pulsación y la aserción. Precedente: `src/screens/home/weekly-activity-chart.test.tsx`
   (`grep -n "process.env.TZ = 'America/Mexico_City'"`). En el `finally`,
   restaura así:
   - si el valor previo era `undefined`, `delete process.env.TZ`;
   - si no, reasigna el valor previo.
   No asignes `undefined`: guardaría la cadena `"undefined"`.
   La aserción es `[value.getHours(), value.getMinutes()]`.
2. **Valor elegido**: un `Date` local con los getters UTC y `toISOString`
   **cruzados**, al estilo de `wallClock` en
   `src/screens/add-reminder/index.test.tsx`:
   `Object.assign(new Date(2026, 9, 2, 20, 5), { getUTCHours: () => 3, getUTCMinutes: () => 7, toISOString: () => '2026-10-03T03:07:00.000Z' })`.
   Si la implementación lee los getters UTC o corta `toISOString`, el test
   recibe `03:07` y se pone rojo.

## §Cifras

La base, medida por el leader en `cb14497c`, es **88 suites / 1710 tests**. No
se añade ninguna suite.

| Tras el `feat` de | Tests nuevos | Total acumulado |
|---|---|---|
| R1 | +1 | 1711 |
| R2 | +15 | 1726 |
| R3 | +3 | 1729 |
| R4 | +6 | 1735 |
| R5 | +4 | 1739 |
| R6 | +3 | 1742 |
| R7 | +4 | 1746 |
| R8 | +12 | 1758 |
| R9 | +1 | **1759** |

Lo que esperas al final es **88 suites / 1759 tests** en `bun run test`
desde `mobile-pet-tracker/`. Si da otra cifra, explica la diferencia en `impl`
antes de cerrar. `./init.sh` **no es tuyo**: comparte Postgres y LocalStack con
otra sesión. Lo corre el leader antes del reviewer.

---

## R1 — catálogo: nueve claves en es y en

- [ ] (1) **Test**, en `src/providers/__tests__/language-provider.test.tsx`:
  - a la suma que empieza por `260 + 16 + 1 + 4 + 7 + 14 + 2 + 1 + 4 - 6 + 1 + 2 + 3 + 11`
    añádele `+ 9` y amplía el comentario de encima con
    `+ 9 de #147 R1 (mealSchedule.* del horario editable)`;
  - añade `describe('#147 R1: el catálogo trae las nueve claves del horario editable')`
    con `it('registra las nueve claves en los dos idiomas y en la tabla de la spec de idioma')`.
    Calca el `#41 R1`: un array de 9 tuplas `[clave, en, es]` con los literales
    de [[requirements]] §Copy nueva y la regex
    `'\\| — \\| `' + escapeRegExp(key) + '`[^\\n]*← añadida por #147 \\(R1\\)'`.
  - Commit: `test(mobile-meal-schedule-editing): lock nine meal schedule editing catalog keys (R1)`
  - **Rojo esperado, por matcher**: `expect(english[key]).toBe('Add meal')`
    recibe `undefined`, y `toHaveLength` recibe 320 cuando espera 329.
- [ ] (2) **Implementación**:
  - las 9 claves en `en` y en `es`, justo después de `'mealSchedule.noNutritionProfileYet'`;
  - la sección `§2.16 — Añadidos por #147 — Horario de comidas editable` en
    `specs/mobile-ui-language/design.md`, antes de `## 3.`.
  - Commit: `feat(mobile-meal-schedule-editing): add meal schedule editing copy in es and en (R1)`
- [ ] (3) Refactor: ninguno previsto.

| Sonda (mutación en verde, una por condición) | Debe ponerse rojo |
|---|---|
| Cambiar el literal `es` de una de las nueve claves (prueba con `mealSchedule.errorMealLimit`) | `#147 R1`, por matcher |
| Cambiar `{{time}}` por `{{hour}}` solo en `es` | `#65 R12` (marcadores), por matcher |
| Quitar la marca `← añadida por #147 (R1)` de una fila de design.md | `#147 R1` (regex), por matcher |
| Quitar una clave en `en` | `#147 R1` y la suma, por matcher |

## R2 — `addMealTime`

- [ ] (1) **Test**, en `src/api/__tests__/nutrition.test.ts`, con los helpers
  `response(status, body)` e `invalidJsonResponse(status)` que ya existen y con
  `baseUrl = 'http://example.test/v1/'`, que ya lleva barra final:
  `describe('#147 R2: addMealTime publica la franja y mapea por kind')`. Contiene:
  - `it('publica POST /meal-times con el token y el body exacto, y 201 es ok')`:
    - una llamada a `fetchFn` con `'http://example.test/v1/pets/pet-1/meal-times'`;
    - `method: 'POST'`;
    - las cabeceras `{ Authorization: 'Bearer jwt-token', 'Content-Type': 'application/json' }`;
    - `body: '{"mealTime":"08:05"}'`;
    - el resultado es `{ kind: 'ok' }`.
  - `it.each`, 12 filas, título `'mapea $label a $kind'`:

    | Respuesta | Resultado esperado |
    |---|---|
    | 400 | `invalid` |
    | 403 | `forbidden` |
    | 422 `NUTRITION_PLAN_REQUIRED` | `unprocessable` con ese `code` |
    | 422 `MEAL_TIME_NOT_IN_PLAN` | `unprocessable` con ese `code` |
    | 422 `MEAL_TIME_DUPLICATE` | `unprocessable` con ese `code` |
    | 422 `MEAL_TIMES_LIMIT_REACHED` | `unprocessable` con ese `code` |
    | 422 `{ code: 'SOMETHING_ELSE' }` | `error` |
    | 422 con JSON inválido | `error` |
    | 401 | `unauthorized` |
    | 200 | `error` |
    | 404 | `error` |
    | 500 | `error` |

    La aserción usa `toEqual` sobre el objeto completo.
  - `it('devuelve unreachable con el mensaje si fetch rechaza')`: `Error('network down')`.
  - `it('devuelve missing-config sin llamar a fetch si falta la URL base')`.
  - Commit: `test(mobile-meal-schedule-editing): lock addMealTime request and state mapping (R2)`
  - **Rojo esperado, por ausencia del export**:
    `TypeError: (0 , _nutrition.addMealTime) is not a function` en los 15
    tests. El typecheck también falla (no existe el export). Se acepta porque
    el sujeto es la propia función. Copia la primera línea decisiva en `impl`.
- [ ] (2) **Implementación**: los tipos, `addMealTime` y el helper privado
  `editMealTimeState(response, okStatus)` ([[design]] §API móvil).
  - Commit: `feat(mobile-meal-schedule-editing): add addMealTime api client (R2)`
- [ ] (3) Refactor: ninguno previsto.

| Sonda | Debe ponerse rojo |
|---|---|
| `method: 'PUT'` | it 1 |
| Ruta `/meal-time` (en singular) | it 1 |
| Body `{ time }` | it 1 |
| Sin `Authorization` (usando `fetch` directo y sin `postJson`) | it 1 |
| `okStatus` 200 | it 1 y la fila 200 |
| 400 mapeado a `error` | fila 400 |
| 403 mapeado a `error` | fila 403 |
| Quitar `NUTRITION_PLAN_REQUIRED` de los códigos conocidos | su fila. Repite la sonda con **cada uno** de los cuatro códigos |
| Aceptar cualquier `code` | fila `SOMETHING_ELSE` |
| Leer `body.error` en vez de `body.code` | las cuatro filas `unprocessable` |
| 401 mapeado a `error` | fila 401 |
| Devolver `error` cuando `fetch` rechaza | it `unreachable` |

## R3 — `moveMealTime`

- [ ] (1) **Test**: `describe('#147 R3: moveMealTime publica el PATCH y mapea por kind')`. Contiene:
  - `it('publica PATCH /meal-times/:from con body { mealTime: to }, y 200 es ok')`:
    - URL `'http://example.test/v1/pets/pet-1/meal-times/19:30'`, sin codificar;
    - `method: 'PATCH'`;
    - las cabeceras de R2;
    - `body: '{"mealTime":"20:05"}'`;
    - el resultado es `{ kind: 'ok' }`.
  - `it('trata un 201 como error')`.
  - `it('comparte el mapeo de errores de addMealTime')`: un bucle dentro del
    mismo `it` con estos casos:
    - 400 → `invalid`;
    - 403 → `forbidden`;
    - 422 `MEAL_TIME_NOT_IN_PLAN` → `unprocessable`;
    - 422 `MEAL_TIME_DUPLICATE` → `unprocessable`;
    - 401 → `unauthorized`;
    - 500 → `error`;
    - rechazo → `unreachable`;
    - `baseUrl` `undefined` → `missing-config`.
  - Commit: `test(mobile-meal-schedule-editing): lock moveMealTime request and state mapping (R3)`
  - **Rojo esperado, por ausencia del export**:
    `TypeError: (0 , _nutrition.moveMealTime) is not a function`.
- [ ] (2) **Implementación**: `moveMealTime`, que reutiliza `editMealTimeState(response, 200)`.
  - Commit: `feat(mobile-meal-schedule-editing): add moveMealTime api client (R3)`
- [ ] (3) Refactor: ninguno previsto.

| Sonda | Debe ponerse rojo |
|---|---|
| `postJson` en vez de `patchJson` | it 1 |
| `to` en la ruta y `from` en el body | it 1 |
| `encodeURIComponent(from)` | it 1 (`19%3A30`) |
| `okStatus` 201 | it 1 y it 2 |
| Un mapeo propio en el que 403 da `error` | it 3 |

## R4 — controles solo para el owner

- [ ] (1) **Test**, en `src/screens/meal-schedule/index.test.tsx`, con los
  mocks de §Mocks R4: `describe('#147 R4: solo el owner ve Editar y Añadir comida')`.
  - `it('el owner ve Editar en cada fila y Añadir comida bajo la lista')`, con `getPet → petState('owner')`:
    - **espera**: `childTestIds(getByTestId('meal-time-row-1'))` igual a
      `[undefined, undefined, undefined, 'meal-time-edit-1']`;
    - lo mismo para la fila 0, con `'meal-time-edit-0'`;
    - `getPet` llamado con `('http://example.test/v1', 'jwt-token', 'pet-1')`;
    - `childTestIds(getByTestId('meal-times-section'))` igual a
      `[undefined, 'meal-time-row-0', 'meal-time-row-1', 'add-meal-time-button']`;
    - en **cada** fila, el botón:
      - tiene `accessibilityLabel` `Editar horario de las 07:30` o `… 19:30`
        (la hora de **su** fila);
      - su texto visible es `Editar`;
      - `className.split(' ')` contiene `['min-h-11', 'rounded-xl', 'bg-accent-soft']`;
      - el `className` de su `Editar` contiene `['font-semibold', 'text-accent-strong']`;
    - el botón de añadir:
      - su texto visible es `Añadir comida`;
      - `className` contiene `['rounded-xl', 'bg-accent-soft']`;
      - el `className` de la etiqueta contiene `['font-bold', 'text-accent-strong']`.
  - `it.each(['family', 'walker', 'vet'])('%s no ve controles de edición')`:
    - ancla: `getQueryData(['pets', 'detail', 'pet-1'])` igual a `petState(rol)`;
    - después, la sección es igual a `[undefined, 'meal-time-row-0', 'meal-time-row-1']`;
    - ninguna fila tiene 4 hijos;
    - `queryByTestId('add-meal-time-button')` es null.
  - `it('sin el detalle de la mascota resuelto no hay controles')`:
    - `getPet` devuelve una promesa que no resuelve;
    - ancla: la fila 1 visible **y** `getPet` llamado, en una sola espera conjunta;
    - la misma ausencia que en el caso anterior.
  - `it('con el detalle de la mascota en error no hay controles')`:
    - `getPet → { kind: 'error' }`;
    - ancla: `getQueryData` igual a `{ kind: 'error' }`;
    - la misma ausencia.
  - Commit: `test(mobile-meal-schedule-editing): lock owner-only meal time controls (R4)`
  - **Rojo esperado**:
    - owner: **por matcher**. `childTestIds` da 3 `undefined` y se espera el 4.º hijo;
    - los otros cinco: **por matcher en el ancla**. `getQueryData` es
      `undefined` porque la pantalla aún no consulta la mascota. En el caso
      pendiente el rojo es **por consulta** en `getByTestId('meal-times-section')`.
- [ ] (2) **Implementación**:
  - la query de la mascota y `isOwner` (D1);
  - `testID="meal-times-section"`;
  - el botón por fila y el botón de añadir según [[design]] §Decisiones de cada control;
  - `onPress` todavía sin efecto (lo conectan R5 y R6).
  - Commit: `feat(mobile-meal-schedule-editing): show edit and add meal controls to owners (R4)`
- [ ] (3) Refactor: ninguno previsto.

| Sonda | Debe ponerse rojo |
|---|---|
| `isOwner = true` | las 5 ausencias |
| `isOwner = pet.data?.kind === 'ok'` (sin mirar el rol) | las 3 del `it.each` |
| `getPet(baseUrl, '', petId)` | it owner (`toHaveBeenCalledWith`) |
| `accessibilityLabel` con `mealTimes[0]` en todas las filas | it owner (fila 1) |
| Botón de editar antes de la hora | it owner (orden de hijos) |
| `add-meal-time-button` dentro de la última `Card` | it owner (hijos de la sección) |
| Quitar `min-h-11` | it owner. Repite la sonda con **cada** clase propia de la tabla |

## R5 — Editar abre el selector y publica el PATCH

- [ ] (1) **Test**, con los mocks de §Mocks R5 y `getPet → petState('owner')`:
  `describe('#147 R5: Editar abre el selector en la hora de la fila y publica el PATCH')`.
  Cada `it` empieza con
  `await screen.findByTestId('meal-time-edit-1')` y lo pulsa. Después, la
  primera aserción es `expect(screen.queryByTestId('meal-time-picker')).not.toBeNull()`.
  - `it('abre un único selector de hora con la hora local de la fila')`:
    - en TZ `America/Mexico_City` (§Técnica TZ 1);
    - `getAllByTestId('meal-time-picker')` tiene longitud 1;
    - `getAllByTestId('expo-ui-picker-host')` tiene longitud 1;
    - `mode === 'time'`;
    - `presentation === 'dialog'`;
    - `[value.getHours(), value.getMinutes()]` es igual a `[19, 30]`.
  - `it('al elegir una hora nueva llama a moveMealTime con la hora local y cierra el selector')`:
    - elige con la fecha cruzada de §Técnica TZ 2 (20:05 local, 03:07 UTC);
    - espera conjunta: `moveMealTime` llamado una vez con
      `('http://example.test/v1', 'jwt-token', 'pet-1', '19:30', '20:05')`
      **y** el selector desmontado;
    - `addMealTime` no se llama;
    - termina con la espera de cierre.
  - `it('al cerrar el selector sin elegir no llama a nada')`:
    - `fireEvent(picker, 'onDismiss')`;
    - el selector desaparece;
    - ni `moveMealTime` ni `addMealTime` se llaman.
  - `it('elegir la misma hora de la fila no llama a nada')`:
    - elige `new Date(2026, 9, 2, 19, 30)`;
    - el selector desaparece;
    - no se llama a nada.
  - Commit: `test(mobile-meal-schedule-editing): lock edit time picker and PATCH call (R5)`
  - **Rojo esperado, por matcher** en los 4: `queryByTestId('meal-time-picker')` es `null`.
- [ ] (2) **Implementación**:
  - el estado `picker`;
  - `Host` + `ExpoDateTimePicker` como hermano posterior de la sección;
  - `pickerValue` y `toMealTime`;
  - en `onValueChange` con `from` distinto de la hora elegida, `void moveMealTime(...)`.
    Todavía no hay estado de ocupado ni refetch (eso es R7).
  - Commit: `feat(mobile-meal-schedule-editing): edit a meal time with the native time picker (R5)`
- [ ] (3) Refactor: ninguno previsto.

| Sonda | Debe ponerse rojo |
|---|---|
| `setUTCHours(h, m)` en `pickerValue` | it 1 (da 13:30 en TZ -6) |
| `mode="date"` o sin `presentation` | it 1 |
| Un selector por fila, montados a la vez | it 1 (longitud 1) |
| `getUTCHours`/`getUTCMinutes` en `toMealTime` | it 2 (`03:07`) |
| `toISOString().slice(11, 16)` | it 2 (`03:07`) |
| `from` igual a `mealTimes[0]` | it 2 (`07:30`) |
| `from` y `to` intercambiados | it 2 |
| No cerrar el selector tras elegir | it 2 |
| Llamar a `moveMealTime` en `onDismiss` | it 3 |
| Sin la guarda de misma hora | it 4 |

## R6 — Añadir comida abre el selector y publica el POST

- [ ] (1) **Test**, con `addMealTime` en la factoría (§Mocks R6):
  `describe('#147 R6: Añadir comida abre el selector a las 12:00 y publica el POST')`.
  Cada `it` espera a `add-meal-time-button`, lo pulsa y asevera que el
  selector no es null.
  - `it('abre el selector a las 12:00 locales')`:
    - en TZ `America/Mexico_City`;
    - `[getHours(), getMinutes()]` es igual a `[12, 0]`;
    - `mode` y `presentation` como en R5.
  - `it('al elegir una hora llama a addMealTime con la hora local rellenada a dos dígitos')`:
    - elige `Object.assign(new Date(2026, 9, 2, 8, 5), { getUTCHours: () => 14, getUTCMinutes: () => 7, toISOString: () => '2026-10-02T14:07:00.000Z' })`;
    - espera conjunta: `addMealTime` llamado una vez con
      `('http://example.test/v1', 'jwt-token', 'pet-1', '08:05')` **y** el selector desmontado;
    - `moveMealTime` no se llama;
    - termina con la espera de cierre.
  - `it('al cerrar el selector sin elegir no llama a nada')`.
  - Commit: `test(mobile-meal-schedule-editing): lock add meal picker and POST call (R6)`
  - **Rojo esperado, por matcher**: el selector es `null`, porque el `onPress` de
    `add-meal-time-button` no hace nada desde R4.
- [ ] (2) **Implementación**: `onPress` hace `setPicker({ from: null })`, el
  valor inicial es `pickerValue('12:00')` y en `onValueChange` con `from === null`
  se llama a `void addMealTime(...)`.
  - Commit: `feat(mobile-meal-schedule-editing): add a meal time with the native time picker (R6)`
- [ ] (3) Refactor: ninguno previsto.

| Sonda | Debe ponerse rojo |
|---|---|
| Hora inicial 09:00, o `setUTCHours(12, 0)` | it 1 |
| Añadir llama a `moveMealTime` | it 2 |
| Sin `padStart` | it 2 (`8:5`) |
| `getUTCHours` | it 2 (`14:07`) |
| Llamar en `onDismiss` | it 3 |

## R7 — refetch tras un éxito, sin estado optimista y con los controles bloqueados

- [ ] (1) **Test**: `describe('#147 R7: tras un éxito refetchea plan y mascota, sin estado optimista')`,
  con owner. Para el refetch se encadena `getNutritionPlan.mockResolvedValueOnce`
  (plan base y luego plan con `mealTimes: ['07:30', '20:05']`).
  - `it('tras ok refetchea el plan y el detalle de la mascota y repinta con la hora nueva')`:
    - edita la fila 1 a 20:05;
    - espera conjunta: `within(meal-time-row-1).getByText('20:05')` **y**
      `meal-time-edit-0` habilitado;
    - después, `getNutritionPlan` y `getPet` se llaman 2 veces cada uno.
  - `it('mientras la edición vuela, todos los controles están deshabilitados y la lista no cambia')`:
    - `moveMealTime` devuelve `pending()`;
    - espera conjunta: `moveMealTime` llamado **y** `meal-time-edit-0`,
      `meal-time-edit-1` y `add-meal-time-button` con
      `accessibilityState` que contiene `{ disabled: true }`;
    - la fila 1 sigue mostrando `19:30` y `queryByText('20:05')` es null;
    - resuelve con `{ kind: 'ok' }` y termina con la espera de cierre.
  - `it('los controles siguen deshabilitados hasta que termina el refetch')`:
    - `moveMealTime` devuelve ok y la segunda llamada a `getNutritionPlan`
      devuelve `pending()`;
    - espera conjunta: `getNutritionPlan` llamado 2 veces **y** los tres
      controles deshabilitados;
    - resuelve el refetch y termina con la espera de cierre.
  - `it('un resultado que no es ok no refetchea')`:
    - `moveMealTime → { kind: 'unprocessable', code: 'MEAL_TIME_DUPLICATE' }`;
    - espera conjunta: `moveMealTime` llamado **y** `meal-time-edit-0` habilitado;
    - después, `getNutritionPlan` y `getPet` se llaman 1 vez cada uno.
  - Commit: `test(mobile-meal-schedule-editing): lock refetch after success without optimistic state (R7)`
  - **Rojo esperado**:
    - its 1-3: **por matcher**. El 1 no ve `20:05` (sin refetch). El 2 y el 3
      ven que `accessibilityState` no contiene `disabled: true`;
    - it 4: **verde por construcción** en el commit de test, porque en R6
      nunca hay refetch. Es **vía (b)** de C4: su cierre se demuestra con la
      sonda «refetch en `finally`», que debe ponerlo rojo por matcher (2 llamadas
      frente a 1). Escribe en `impl` el resultado de esa sonda.
- [ ] (2) **Implementación**:
  - `runMealTimeEdit` con `editing`, `try/finally` (sin `catch` todavía) y el
    caso `ok` con los dos refetch;
  - `isDisabled={editing}` en los tres controles;
  - R5 y R6 pasan a llamar a `runMealTimeEdit(() => …)`.
  - Commit: `feat(mobile-meal-schedule-editing): refetch plan and pet after a meal time edit (R7)`
- [ ] (3) Refactor: ninguno previsto.

| Sonda | Debe ponerse rojo |
|---|---|
| Sin `plan.refetch()` | it 1 (`getNutritionPlan` 1 de 2) |
| Sin `refetchQueries` de `['pets', 'detail', petId]` | it 1 (`getPet` 1 de 2) |
| `setQueryData` optimista con la hora nueva | it 2 (`20:05` visible) |
| Quitar `isDisabled` de un control | it 2. Repite la sonda con **cada uno** de los tres |
| `setEditing(false)` antes de los refetch | it 3 |
| Refetch en `finally`, es decir, siempre | it 4 (vía b) |

## R8 — mensajes de error

- [ ] (1) **Test**:
  - en `src/__tests__/ui-copy-table.ts`, añade al final de `R6_FOOD` tres
    filas, en este orden y todas con `file: 'src/screens/meal-schedule/index.tsx'`:
    1. `common.cannotReachServer`;
    2. `common.somethingWentWrong`;
    3. `common.somethingWentWrong`;
  - en `src/__tests__/ui-language.test.ts`, el `it` pasa a
    `'resuelve las 41 ocurrencias normativas'` y su longitud a
    `35 + 3 + 1 - 2 + 1 + 3`, con el comentario `+3 #147 R8`;
  - en la suite de meal-schedule:
    `describe('#147 R8: cada error del contrato tiene su mensaje')`. Contiene:
    - `it.each` de 10 filas, título `'$label muestra «$literal»'`. Cada fila
      dispara el flujo indicado (añadir elige 08:05, editar lleva la fila 1 a
      20:05):

      | label | flujo | mock | literal |
      |---|---|---|---|
      | `invalid` | añadir | `{ kind: 'invalid' }` | `La hora no es válida` |
      | `forbidden` | editar | `{ kind: 'forbidden' }` | `Solo el dueño puede cambiar los horarios` |
      | `NUTRITION_PLAN_REQUIRED` | añadir | `unprocessable` | `Primero genera un plan de alimentación` |
      | `MEAL_TIME_NOT_IN_PLAN` | editar | `unprocessable` | `Ese horario ya no está en el plan` |
      | `MEAL_TIME_DUPLICATE` | editar | `unprocessable` | `Ya hay una comida a esa hora` |
      | `MEAL_TIMES_LIMIT_REACHED` | añadir | `unprocessable` | `El plan ya tiene el máximo de 6 comidas` |
      | `unreachable` | editar | `{ kind: 'unreachable', message: 'network down' }` | `No se pudo conectar con el servidor` |
      | `error` | añadir | `{ kind: 'error' }` | `Algo salió mal` |
      | `missing-config` | editar | `{ kind: 'missing-config' }` | `Algo salió mal` |
      | `rechazo` | añadir | `mockRejectedValue(new Error('boom'))` | `Algo salió mal` |

      Cada fila comprueba:
      - espera: `getByTestId('meal-time-error').props.children` es igual al
        literal, con comparación exacta y no `toHaveTextContent`;
      - `props.selectable === true`;
      - `props.className === 'text-danger'`;
      - `childTestIds(meal-times-section)` es igual a
        `[undefined, 'meal-time-row-0', 'meal-time-row-1', 'meal-time-error', 'add-meal-time-button']`;
      - termina con la espera de cierre.
    - `it('401 cierra sesión sin mensaje')`:
      - pon en `mockUseAuth.mockReturnValue` un `signOut = jest.fn()` propio;
      - edita con `{ kind: 'unauthorized' }`;
      - espera conjunta: `signOut` llamado una vez **y** `meal-time-edit-0` habilitado;
      - `queryByTestId('meal-time-error')` es null.
    - `it('una nueva edición retira el error anterior')`:
      - añade con `MEAL_TIME_DUPLICATE` y espera a ver el error;
      - edita la fila 1 con `moveMealTime → pending()`;
      - espera conjunta: los tres controles deshabilitados **y**
        `queryByTestId('meal-time-error')` null;
      - resuelve con ok y termina con la espera de cierre.
  - Commit: `test(mobile-meal-schedule-editing): lock meal time edit error messages (R8)`
  - **Rojo esperado**:
    - las 10 filas y el último `it`: **por consulta**. `getByTestId('meal-time-error')`
      no encuentra el nodo dentro del `waitFor`. La fila `rechazo` puede
      además avisar de una promesa rechazada sin manejar, porque R7 no tiene `catch`;
    - `401`: **por matcher**, porque `signOut` se llama 0 veces;
    - `#65 R6` y `checkUses(ALL_USES)`: **por matcher**, `{ uses: 4 }` frente a
      `{ uses: 6 }` (`common.somethingWentWrong`) y `{ uses: 1 }` frente a
      `{ uses: 2 }` (`common.cannotReachServer`). Es el efecto de mover esos
      candados en el commit de test.
- [ ] (2) **Implementación**:
  - el `switch` completo de [[design]] §Estado y handler, con las llamadas
    `t('…')` literales: **1** `common.cannotReachServer` y **2**
    `common.somethingWentWrong` (el `case` y el `catch`);
  - el `catch`;
  - `setEditError(null)` al empezar;
  - el `Text` `meal-time-error`, como penúltimo hijo de la sección.
  - Commit: `feat(mobile-meal-schedule-editing): show inline errors for meal time edits (R8)`
- [ ] (3) Refactor: ninguno previsto. Si extraes un mapa clave→literal, se
  rompen los candados de conteo: está prohibido.

| Sonda | Debe ponerse rojo |
|---|---|
| Cambiar la clave de un caso, por ejemplo `errorDuplicateTime` por `errorMealLimit` | su fila. Repite la sonda con **cada** caso |
| `missing-config` mostrando `cannotReachServer` | fila `missing-config` |
| Quitar el `catch` | fila `rechazo` |
| Error fuera de la sección, al final del `ScrollView` | todas las filas (hijos de la sección) |
| Error debajo de `Añadir comida` | todas las filas (orden) |
| Sin `selectable` | todas las filas |
| Mostrar el error en `unauthorized` | `401` |
| Sin `setEditError(null)` al empezar | `una nueva edición retira…` |
| Un tercer `t('common.somethingWentWrong')` | `#65 R6` (6 frente a 7) |

## R9 — registro del copy nuevo

- [ ] (1) **Test**, en `src/__tests__/ui-language.test.ts`:
  - el `it` de `#65 R6` pasa a `'resuelve las 50 ocurrencias normativas'` y su
    longitud a `35 + 3 + 1 - 2 + 1 + 3 + 9`, con el comentario `+9 #147 R9`;
  - añade `describe('#147 R9: el copy del horario editable queda registrado')` con
    `it('nombra las nueve ocurrencias nuevas y las resuelve en su fichero')`,
    modelado sobre `#98 R9`:
    - filtra `R6_FOOD` por las nueve claves (`TranslationKey[]`, en el orden de
      [[requirements]] §Copy nueva);
    - asevera que las claves salen en ese orden;
    - asevera que todos los `file` son `'src/screens/meal-schedule/index.tsx'`;
    - termina con `checkUses(rows)`.
  - Commit: `test(mobile-meal-schedule-editing): lock meal schedule editing copy registration (R9)`
  - **Rojo esperado, por matcher**: el filtro devuelve `[]` cuando se esperan
    las nueve claves, y la longitud es 41 cuando se espera 50.
- [ ] (2) **Implementación**: las 9 filas al final de `R6_FOOD`, detrás de las 3 de R8.
  - Commit: `feat(mobile-meal-schedule-editing): register meal schedule editing copy uses (R9)`
- [ ] (3) Refactor: ninguno previsto.

| Sonda | Debe ponerse rojo |
|---|---|
| Quitar la fila de `mealSchedule.editTimeLabel` | `#147 R9` y `#65 R6` |
| Duplicar una fila | `checkUses` (2 frente a 1) |
| Poner la fila en `R3_HOME` | `#147 R9` |

---

## §Cierre

Todo se ejecuta sin pipe, para medir el exit code real.

1. Desde `mobile-pet-tracker/`, cada comando por separado y sin pipe, con su exit code en `impl`:
   - antes, `pgrep -af 'init\.sh|test:e2e|jest-e2e' | grep -v pgrep` debe salir vacío.
     Si no lo está, espera a que acabe: la suite entera con `init.sh` en vuelo da
     rojos falsos por carga (#133);
   - `bun run test`: **exit 0** y **88 suites / 1759 tests**;
   - `bun run lint`: exit 0;
   - `test ! -e .expo/types/router.d.ts && bun run typecheck`: exit 0. Si el
     `test` falla, **PARA** (§Arranque paso 2).
   No lances `./init.sh` ni los e2e del backend.
2. Grep-clean, desde `mobile-pet-tracker/`. Cada comando debe salir vacío:
   - `git diff <hash-del-handoff> -- src/screens/meal-schedule/index.tsx src/api/nutrition.ts | grep '^+' | grep -nE "#[0-9a-fA-F]{3,8}\b|className=\"[^\"]*\[|StyleSheet\.create|rounded-(2xl|lg|md|sm)\b|elevation|shadow(Color|Offset|Opacity|Radius)"`
   - `git diff <hash-del-handoff> -- src/screens/meal-schedule/index.tsx | grep -nE "^[-+].*(contentContainerStyle|padding: 24|gap: 16|insets\.bottom \+ 24)"`
     (las dimensiones no cambian)
   - `git diff <hash-del-handoff> --stat -- package.json bun.lock`
3. `git diff --name-only <hash-del-handoff>..HEAD` debe coincidir **exactamente**
   con la lista cerrada de [[design]] §Archivos afectados.
4. Rellena [[traceability]] con un commit propio:
   `docs(mobile-meal-schedule-editing): fill #147 traceability`. **No rebases**
   después: un rebase invalida los hashes.
5. En `progress/impl_mobile-meal-schedule-editing.md` deja:
   - las skills que cargaste;
   - las medidas de §Arranque;
   - la primera línea roja de cada commit de test;
   - el resultado de cada sonda (o cuáles no corriste y por qué);
   - la sonda de vía (b) de R7;
   - el exit code y las cifras de los tres comandos del paso 1.

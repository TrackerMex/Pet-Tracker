---
feature: "mobile-meal-schedule-editing"
status: approved     # draft | approved
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
   **Enmienda E1.2**: en jest, `process.env` es una copia y asignarle `TZ` no
   cambia la zona de `Date`. Asigna y restaura sobre
   `process.getBuiltinModule('process').env` (hecho en `2c873c47`).
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

---

## §Enmienda E1 — los dos inventarios globales ([[requirements]] §Enmienda E1)

Va **después** de `b5d46054` y **antes** de §Cierre. Son dos commits de test,
uno por fichero. Cada uno lleva **solo** su fichero. La producción no cambia.

El rojo de los dos ya está medido en el informe (§Cierre detenido): son los
tres `it` del `bun run test` sobre `b5d46054`. Cada commit lo vuelve verde.

Comando de los dos ciclos, desde `mobile-pet-tracker/`:
`bunx jest src/__tests__/consistency-classnames.test.ts src/__tests__/design-drift.test.ts`.
Antes de E1-a da 3 rojos de 108. Después de E1-a, 1 rojo. Después de E1-b, 0.

### E1-a — `bg-accent-soft` (R4)

En `src/__tests__/consistency-classnames.test.ts`, localiza cada sitio por su
contenido, no por número de línea:

1. En el `it` de `#98 R10` que asevera el recuento de `bg-accent-soft`, la
   línea `expect(count(/bg-accent-soft/g)).toBe(16);` pasa a
   `expect(count(/bg-accent-soft/g)).toBe(16 + 2); // #147 R4: meal-time-edit y add-meal-time-button`.
2. En `#64 R9`, cambian tres sitios:
   - el comentario de encima del `it`
     (el que empieza por `// 17 en` y menciona `PetHero` y `#67 R6`)
     gana debajo la línea `// + 2 de #147 R4: meal-time-edit y add-meal-time-button.`;
   - el título `'conserva los dieciséis usos de bg-accent-soft que sí son acento'`
     pasa a `'conserva los usos de bg-accent-soft que sí son acento'`;
   - `expect(accentSoftCount).toBe(16);` pasa a
     `expect(accentSoftCount).toBe(16 + 2); // #147 R4`.

No toques las otras aserciones de esos dos `it`.

- Commit: `test(mobile-meal-schedule-editing): count the meal time controls among accent-soft uses (R4)`

| Sonda (sobre el verde, en `src/screens/meal-schedule/index.tsx`) | Debe ponerse rojo |
|---|---|
| Un tercer `bg-accent-soft` (por ejemplo en el `className` del error) | `#98 R10` y `#64 R9`, por matcher (19 frente a 18). También caen las filas de R8 que miran `className === 'text-danger'` |
| Quitar `bg-accent-soft` del botón de añadir | `#98 R10` y `#64 R9` (17 frente a 18), y el `it` owner de R4 |

### E1-b — `signOut(` (R8)

En `src/__tests__/design-drift.test.ts`, dentro de `screenSignOutCalls` del
`describe` de `#87 R19`, la entrada
`'screens/meal-schedule/index.tsx': 1,` pasa a
`'screens/meal-schedule/index.tsx': 2, // #147 R8: el 401 de la edición de franjas`.
No toques nada más.

- Commit: `test(mobile-meal-schedule-editing): count the meal schedule 401 sign-out (R8)`

| Sonda (sobre el verde) | Debe ponerse rojo |
|---|---|
| Quitar el `await signOut()` del `case 'unauthorized'` | `#87 R19` (1 frente a 2) y el `it` `401 cierra sesión sin mensaje` de R8 |

Restaura cada sonda con `git checkout HEAD -- <ruta>`; después
`git diff --cached --stat` debe salir vacío.

### Lo que cambia en §Cierre

- Las cifras no cambian: **88 suites / 1759 tests**.
- La lista de `git diff --name-only <hash-del-handoff>..HEAD` es la de
  [[design]] §Archivos afectados: **13** ficheros.
- [[traceability]] cita los dos commits nuevos en sus filas, R4 y R8, junto a
  los que ya cita.


---

## §Enmienda E2 — las dos cláusulas de R7 sin candado ([[requirements]] §Enmienda E2)

Va **después** de `d05d8725` (tu trazabilidad) y no reescribe nada anterior:
**no rebases ni enmiendes** commits previos. Son dos commits de test, y los dos
tocan **solo** `mobile-pet-tracker/src/screens/meal-schedule/index.test.tsx`.
La producción no cambia.

Los dos son **vía (b)** de C4: nacen verdes porque la producción ya cumple R7, y
su cierre se demuestra con las sondas de la tabla de abajo, que hoy pasan en
verde (las midió el reviewer) y tienen que ponerse rojas.

Comando de los dos ciclos, desde `mobile-pet-tracker/`, sin pipe:
`bunx jest src/screens/meal-schedule > /tmp/147-e2-<paso>.txt 2>&1; echo "exit=$?"`.
Antes de E2-a da 1 suite, 51/51, exit 0. Después de E2-a, 51/51. Después de
E2-b, **54/54**. Si algún `it` sale rojo sobre la producción sin mutar, **PARA**:
la premisa de la enmienda es falsa y lo decide el leader.

### E2-a — ningún refetch en los kinds que no son ok (E2.2)

En `src/screens/meal-schedule/index.test.tsx`, localiza por contenido, no por
número de línea:

1. En el `it.each` de `describe('#147 R8: cada error del contrato tiene su mensaje')`
   (el `it` cuyo título es `'$label muestra «$literal»'`), después de su
   **última** línea (la espera de cierre sobre `meal-time-edit-0`), añade:
   ```ts
       expect(mockGetNutritionPlan).toHaveBeenCalledTimes(1); // #147 E2.2: ningún refetch si no es ok
       expect(mockGetPet).toHaveBeenCalledTimes(1);
   ```
2. En `it('401 cierra sesión sin mensaje')`, después de su **última** línea
   (también la espera de cierre), añade las mismas dos líneas.

No toques nada más. El recuento no cambia: 51 tests.

- Commit: `test(mobile-meal-schedule-editing): lock no refetch on every failed meal time edit (R7)`

### E2-b — R7 sobre el flujo Añadir (E2.1)

En el mismo fichero, dentro de
`describe('#147 R7: tras un éxito refetchea plan y mascota, sin estado optimista')`,
**después** de `it('un resultado que no es ok no refetchea')` y antes del `});`
que cierra el `describe`, añade estos tres `it` literales. Usan los mismos
mocks del `beforeEach` de ese `describe` y los defaults del `beforeEach` global
(`mockAddMealTime` resuelve `{ kind: 'ok' }`). Siguen §Esperas: espera conjunta,
ausencias tras un nodo positivo observado y espera de cierre.

```ts
  it('tras ok de Añadir refetchea el plan y el detalle de la mascota y repinta con la fila nueva', async () => {
    mockGetNutritionPlan
      .mockResolvedValueOnce({ kind: 'ok', plan: makePlan() })
      .mockResolvedValueOnce({ kind: 'ok', plan: makePlan({ mealTimes: ['07:30', '08:05', '19:30'] }) });
    await renderMealSchedule();
    await fireEvent.press(await screen.findByTestId('add-meal-time-button'));
    await fireEvent(screen.getByTestId('meal-time-picker'), 'onValueChange', {}, new Date(2026, 9, 2, 8, 5));
    await waitFor(() => {
      expect(within(screen.getByTestId('meal-time-row-1')).queryByText('08:05')).not.toBeNull();
      expect(screen.getByTestId('meal-time-edit-0').props.accessibilityState).not.toEqual(expect.objectContaining({ disabled: true }));
    });
    expect(mockAddMealTime).toHaveBeenCalledTimes(1);
    expect(mockGetNutritionPlan).toHaveBeenCalledTimes(2);
    expect(mockGetPet).toHaveBeenCalledTimes(2);
    await waitFor(() => expect(screen.getByTestId('meal-time-edit-0').props.accessibilityState).not.toEqual(expect.objectContaining({ disabled: true })));
  });

  it('mientras Añadir vuela, todos los controles están deshabilitados y no aparece la fila nueva', async () => {
    let resolve!: (state: EditMealTimeState) => void;
    mockAddMealTime.mockReturnValue(new Promise((done) => { resolve = done; }));
    await renderMealSchedule();
    await fireEvent.press(await screen.findByTestId('add-meal-time-button'));
    await fireEvent(screen.getByTestId('meal-time-picker'), 'onValueChange', {}, new Date(2026, 9, 2, 8, 5));
    await waitFor(() => {
      expect(mockAddMealTime).toHaveBeenCalledTimes(1);
      for (const id of ['meal-time-edit-0', 'meal-time-edit-1', 'add-meal-time-button']) {
        expect(screen.getByTestId(id).props.accessibilityState).toEqual(expect.objectContaining({ disabled: true }));
      }
    });
    expect(screen.queryByTestId('meal-time-row-2')).toBeNull();
    expect(within(screen.getByTestId('meal-time-row-1')).getByText('19:30')).toBeVisible();
    expect(screen.queryByText('08:05')).toBeNull();
    await act(async () => resolve({ kind: 'ok' }));
    await waitFor(() => expect(screen.getByTestId('meal-time-edit-0').props.accessibilityState).not.toEqual(expect.objectContaining({ disabled: true })));
  });

  it('tras ok de Añadir los controles siguen deshabilitados y sin fila nueva hasta que termina el refetch', async () => {
    let resolve!: (state: NutritionPlanState) => void;
    mockGetNutritionPlan.mockResolvedValueOnce({ kind: 'ok', plan: makePlan() })
      .mockReturnValueOnce(new Promise((done) => { resolve = done; }));
    await renderMealSchedule();
    await fireEvent.press(await screen.findByTestId('add-meal-time-button'));
    await fireEvent(screen.getByTestId('meal-time-picker'), 'onValueChange', {}, new Date(2026, 9, 2, 8, 5));
    await waitFor(() => {
      for (const id of ['meal-time-edit-0', 'meal-time-edit-1', 'add-meal-time-button']) {
        expect(screen.getByTestId(id).props.accessibilityState).toEqual(expect.objectContaining({ disabled: true }));
      }
      expect(mockGetNutritionPlan).toHaveBeenCalledTimes(2);
    });
    expect(screen.queryByTestId('meal-time-row-2')).toBeNull();
    expect(within(screen.getByTestId('meal-time-row-1')).getByText('19:30')).toBeVisible();
    await act(async () => resolve({ kind: 'ok', plan: makePlan({ mealTimes: ['07:30', '08:05', '19:30'] }) }));
    await waitFor(() => expect(screen.getByTestId('meal-time-edit-0').props.accessibilityState).not.toEqual(expect.objectContaining({ disabled: true })));
  });
```

`makePlan()` trae `mealTimes: ['07:30', '19:30']`, así que la fila nueva de
08:05 cae en la fila 1 tras el refetch y la fila 2 solo existe si alguien pinta
la fila nueva antes de tiempo.

- Commit: `test(mobile-meal-schedule-editing): lock refetch and disabled controls for added meal times (R7)`

### Sondas de E2 (sobre el verde, en `src/screens/meal-schedule/index.tsx`)

Son las 13 de `progress/review_mobile-meal-schedule-editing.md` §Observaciones 1,
más un control. Mide cada una con el comando de arriba. Restaura con
`git checkout HEAD -- src/screens/meal-schedule/index.tsx`, y después
`git diff --cached --stat` y `git status --short` deben salir vacíos (salvo el
informe sin trackear). «Por matcher» es un `expect` que falla. «Por consulta»
es un `getBy…` que no encuentra el nodo (`Unable to find`).

| # | Sonda | Debe ponerse rojo |
|---|---|---|
| 1 | En la rama `from === null` de `onValueChange`, `queryClient.setQueryData(nutritionKeys.plan(petId), …)` añade la hora nueva **antes** de `addMealTime`, con rollback al snapshot si el kind no es ok o si rechaza | E2-b it 2 y it 3, por matcher en `queryByTestId('meal-time-row-2')` |
| 2 | `setEditing(false)` justo después de `void runMealTimeEdit(...)` en esa rama | E2-b it 2 y it 3, por matcher en el `waitFor` de `disabled: true` |
| 3 | Llamar a `addMealTime` fuera de `runMealTimeEdit` y delegar en él solo los kinds no ok y el rechazo (sin refetch tras el ok) | E2-b it 1 (por matcher: la fila 1 no muestra `08:05`), it 2 y it 3 (por matcher en `disabled: true`) |
| 4 | `await plan.refetch()` en la rama `invalid` de `runMealTimeEdit` | fila `invalid` de R8, por matcher (2 frente a 1) |
| 5 | Lo mismo en `forbidden` | fila `forbidden` de R8 |
| 6 | Lo mismo en `NUTRITION_PLAN_REQUIRED` | fila `NUTRITION_PLAN_REQUIRED` de R8 |
| 7 | Lo mismo en `MEAL_TIME_NOT_IN_PLAN` | fila `MEAL_TIME_NOT_IN_PLAN` de R8 |
| 8 | Lo mismo en `MEAL_TIMES_LIMIT_REACHED` | fila `MEAL_TIMES_LIMIT_REACHED` de R8 |
| 9 | Lo mismo en `unauthorized` | `it('401 cierra sesión sin mensaje')` |
| 10 | Lo mismo en `unreachable` | fila `unreachable` de R8 |
| 11 | Lo mismo en `error`/`missing-config` | filas `error` y `missing-config` de R8 |
| 12 | Lo mismo en el `catch` | fila `rechazo` de R8 |
| 13 | `await queryClient.refetchQueries({ queryKey: petKeys.detail(petId) })` en `forbidden` | fila `forbidden` de R8, por matcher en `mockGetPet` (2 frente a 1) |
| C | Control: `await plan.refetch()` en `MEAL_TIME_DUPLICATE` | R7 it 4 **y** fila `MEAL_TIME_DUPLICATE` de R8 |

Si una sonda sale verde, o roja por otro `it` o por consulta donde la tabla
dice matcher, apúntalo en `impl` con la primera línea roja y **PARA**.

### Lo que cambia en §Cierre

- Las cifras pasan a **88 suites / 1762 tests** (+3 de E2-b).
- La lista de `git diff --name-only <hash-del-handoff>..HEAD` **de tus commits**
  sigue siendo la de [[design]] §Archivos afectados: **13** ficheros.
- [[traceability]] cita en la fila R7 los dos commits nuevos y los tests que
  añaden, junto a los que ya cita. Va en un commit propio:
  `docs(mobile-meal-schedule-editing): cite amendment E2 in #147 traceability`.

## §Enmienda E3 — los controles esperan también al refetch de la mascota ([[requirements]] §Enmienda E3)

Va **después** de `c918e756` (tu trazabilidad de E2) y no reescribe nada
anterior: **no rebases ni enmiendes** commits previos. Es un commit de test que
toca **solo** `mobile-pet-tracker/src/screens/meal-schedule/index.test.tsx`. La
producción no cambia.

Es **vía (b)** de C4: nace verde porque la producción ya cumple R7. Su cierre
se demuestra con las sondas de la tabla de abajo, que hoy pasan en verde (las
midió el reviewer) y tienen que ponerse rojas.

Comando, desde `mobile-pet-tracker/`, sin pipe:
`bunx jest src/screens/meal-schedule > /tmp/147-e3-<paso>.txt 2>&1; echo "exit=$?"`.
Antes de E3-a da 1 suite, 54/54, exit 0. Después, **56/56**. Si algún `it` sale
rojo sobre la producción sin mutar, **PARA**: la premisa de la enmienda es falsa
y lo decide el leader.

### E3-a — dos `it` que retienen la segunda llamada a `getPet` (E3.1)

En `src/screens/meal-schedule/index.test.tsx`, dentro de
`describe('#147 R7: tras un éxito refetchea plan y mascota, sin estado optimista')`,
**después** de `it('tras ok de Añadir los controles siguen deshabilitados y sin fila nueva hasta que termina el refetch')`
y antes del `});` que cierra el `describe`, añade estos dos `it` literales.
Localiza por contenido, no por número de línea. Usan los mocks del `beforeEach`
de ese `describe`. El `mockResolvedValueOnce` de `getPet` cubre la carga
inicial, y el `mockReturnValueOnce` retiene el refetch.

Siguen §Esperas:

- espera conjunta de `disabled: true` y de la segunda llamada a `getPet`;
- espera del repintado del plan, que demuestra que el refetch del plan ya
  terminó;
- después, aserción síncrona de `disabled: true` y espera de cierre tras
  resolver.

```ts
  it('los controles siguen deshabilitados hasta que termina también el refetch de la mascota', async () => {
    let resolvePet!: (state: PetState) => void;
    mockGetNutritionPlan
      .mockResolvedValueOnce({ kind: 'ok', plan: makePlan() })
      .mockResolvedValueOnce({ kind: 'ok', plan: makePlan({ mealTimes: ['07:30', '20:05'] }) });
    mockGetPet.mockResolvedValueOnce(petState('owner'))
      .mockReturnValueOnce(new Promise((done) => { resolvePet = done; }));
    await renderMealSchedule();
    await fireEvent.press(await screen.findByTestId('meal-time-edit-1'));
    await fireEvent(screen.getByTestId('meal-time-picker'), 'onValueChange', {}, new Date(2026, 9, 2, 20, 5));
    await waitFor(() => {
      for (const id of ['meal-time-edit-0', 'meal-time-edit-1', 'add-meal-time-button']) {
        expect(screen.getByTestId(id).props.accessibilityState).toEqual(expect.objectContaining({ disabled: true }));
      }
      expect(mockGetPet).toHaveBeenCalledTimes(2);
    });
    await waitFor(() => expect(within(screen.getByTestId('meal-time-row-1')).queryByText('20:05')).not.toBeNull());
    for (const id of ['meal-time-edit-0', 'meal-time-edit-1', 'add-meal-time-button']) {
      expect(screen.getByTestId(id).props.accessibilityState).toEqual(expect.objectContaining({ disabled: true }));
    }
    await act(async () => resolvePet(petState('owner')));
    await waitFor(() => expect(screen.getByTestId('meal-time-edit-0').props.accessibilityState).not.toEqual(expect.objectContaining({ disabled: true })));
  });

  it('tras ok de Añadir los controles siguen deshabilitados hasta que termina también el refetch de la mascota', async () => {
    let resolvePet!: (state: PetState) => void;
    mockGetNutritionPlan
      .mockResolvedValueOnce({ kind: 'ok', plan: makePlan() })
      .mockResolvedValueOnce({ kind: 'ok', plan: makePlan({ mealTimes: ['07:30', '08:05', '19:30'] }) });
    mockGetPet.mockResolvedValueOnce(petState('owner'))
      .mockReturnValueOnce(new Promise((done) => { resolvePet = done; }));
    await renderMealSchedule();
    await fireEvent.press(await screen.findByTestId('add-meal-time-button'));
    await fireEvent(screen.getByTestId('meal-time-picker'), 'onValueChange', {}, new Date(2026, 9, 2, 8, 5));
    await waitFor(() => {
      for (const id of ['meal-time-edit-0', 'meal-time-edit-1', 'add-meal-time-button']) {
        expect(screen.getByTestId(id).props.accessibilityState).toEqual(expect.objectContaining({ disabled: true }));
      }
      expect(mockGetPet).toHaveBeenCalledTimes(2);
    });
    await waitFor(() => expect(within(screen.getByTestId('meal-time-row-1')).queryByText('08:05')).not.toBeNull());
    for (const id of ['meal-time-edit-0', 'meal-time-edit-1', 'meal-time-edit-2', 'add-meal-time-button']) {
      expect(screen.getByTestId(id).props.accessibilityState).toEqual(expect.objectContaining({ disabled: true }));
    }
    await act(async () => resolvePet(petState('owner')));
    await waitFor(() => expect(screen.getByTestId('meal-time-edit-0').props.accessibilityState).not.toEqual(expect.objectContaining({ disabled: true })));
  });
```

`PetState` ya está importado en el fichero (`import { getPet, type PetState } from '../../api/pets'`).
`isOwner` lee `pet.data`, que TanStack Query conserva mientras el refetch está
en vuelo, así que los controles siguen montados y la consulta no falla. R7 fija
el orden: primero el plan y después la mascota. Por eso el plan ya se ha
repintado cuando la segunda llamada a `getPet` sigue retenida.

- Commit: `test(mobile-meal-schedule-editing): lock disabled controls until the pet detail refetch ends (R7)`

### Sondas de E3 (sobre el verde, en `src/screens/meal-schedule/index.tsx`)

Son las 2 de `progress/review_mobile-meal-schedule-editing.md`
§R2-Observaciones 1, las dos en la rama `case 'ok':` de `runMealTimeEdit`.
Mídelas con el comando de arriba y restaura con
`git checkout HEAD -- src/screens/meal-schedule/index.tsx`. Después,
`git diff --cached --stat` y `git status --short` deben salir vacíos (salvo el
informe sin trackear). «Por matcher» y «por consulta» significan lo mismo que
en §Enmienda E2.

| # | Sonda | Debe ponerse rojo |
|---|---|---|
| 1 | `setEditing(false);` entre `await plan.refetch();` y `await queryClient.refetchQueries({ queryKey: petKeys.detail(petId) });` | E3-a it 1 y it 2, por matcher en `disabled: true` |
| 2 | `void queryClient.refetchQueries({ queryKey: petKeys.detail(petId) });` en lugar de `await …` | E3-a it 1 y it 2, por matcher en `disabled: true` |

Si una sonda sale verde, o roja por otro `it` o por consulta, apúntalo en `impl`
con la primera línea roja y **PARA**.

### Lo que cambia en §Cierre

- Las cifras pasan a **88 suites / 1764 tests** (+2 de E3-a).
- La lista de `git diff --name-only <hash-del-handoff>..HEAD` **de tus commits**
  sigue siendo la de [[design]] §Archivos afectados: **13** ficheros.
- [[traceability]] cita en la fila R7 el commit nuevo y sus dos tests, junto a
  los que ya cita. Va en un commit propio:
  `docs(mobile-meal-schedule-editing): cite amendment E3 in #147 traceability`.

## §Enmienda E4 — cinco candados por rama en R3, R5, R7 y R8 ([[requirements]] §Enmienda E4)

Va **después** de `0b0f856c` (tu trazabilidad de E3) y no reescribe nada
anterior: **no rebases ni enmiendes** commits previos.

Son cinco commits de test, en este orden: E4-a, E4-b, E4-c, E4-d y E4-e. Solo
tocan dos ficheros:

- `mobile-pet-tracker/src/screens/meal-schedule/index.test.tsx`;
- `mobile-pet-tracker/src/api/__tests__/nutrition.test.ts`.

La producción no cambia. Todos son **vía (b)** de C4: nacen verdes porque la
producción ya cumple R3, R5, R7 y R8. Su cierre se demuestra con las sondas de
la tabla de abajo, que hoy pasan en verde (las midió el reviewer) y tienen que
ponerse rojas.

Cada `it` nuevo va precedido de **una línea en blanco**, como el resto del
fichero.

Comandos, desde `mobile-pet-tracker/`, sin pipe:

- pantalla: `bunx jest src/screens/meal-schedule > /tmp/147-e4-<paso>.txt 2>&1; echo "exit=$?"`;
- API: `bunx jest src/api/__tests__/nutrition.test.ts > /tmp/147-e4-<paso>.txt 2>&1; echo "exit=$?"`.

Antes de E4-a dan 56/56 y 58/58, exit 0. Se espera:

| Después de | Pantalla | API |
|---|---|---|
| E4-a | 56 | 58 |
| E4-b | 57 | 58 |
| E4-c | 57 | **62** |
| E4-d | 58 | 62 |
| E4-e | **59** | 62 |

Si algún `it` sale rojo sobre la producción sin mutar, **PARA**: la premisa de
la enmienda es falsa y lo decide el leader.

### E4-a — Editar no repinta la lista con el refetch del plan retenido (E4.1)

En `src/screens/meal-schedule/index.test.tsx`, dentro de
`describe('#147 R7: tras un éxito refetchea plan y mascota, sin estado optimista')`,
localiza por contenido `it('los controles siguen deshabilitados hasta que termina el refetch', async () => {`.
Ojo: no es el de E2-b («…sin fila nueva hasta que termina el refetch») ni el de
E3-a («…hasta que termina también el refetch de la mascota»).

En ese `it`, **después** del `});` que cierra su primer `await waitFor(() => {`
(la espera conjunta de `disabled: true` y `toHaveBeenCalledTimes(2)`) y
**antes** de `await act(async () => resolve({ kind: 'ok', plan: makePlan({ mealTimes: ['07:30', '20:05'] }) }));`,
añade estas dos líneas literales, **en este orden**:

```ts
    expect(screen.queryByText('20:05')).toBeNull(); // #147 E4.1: ni la hora nueva antes del refetch
    expect(within(screen.getByTestId('meal-time-row-1')).getByText('19:30')).toBeVisible();
```

El orden importa. Con el `getByText('19:30')` primero, la sonda 1 cae por
consulta («Unable to find») en vez de por matcher. No toques nada más. El
recuento no cambia: 56 tests.

- Commit: `test(mobile-meal-schedule-editing): lock unchanged list while the edit refetch is in flight (R7)`

### E4-b — una nueva llamada de Añadir retira el error (E4.2)

En el mismo fichero, dentro de
`describe('#147 R8: cada error del contrato tiene su mensaje')`, **después** de
`it('una nueva edición retira el error anterior')`, añade este `it` literal. Es
el espejo del anterior: el error lo provoca Editar y lo retira Añadir.

Sigue §Esperas, en este orden:

1. espera a ver el error;
2. espera de cierre;
3. espera conjunta de `disabled: true` y de la ausencia del error;
4. tras resolver, espera de cierre.

```ts
  it('una nueva llamada de Añadir retira el error anterior', async () => {
    mockMoveMealTime.mockResolvedValue({ kind: 'unprocessable', code: 'MEAL_TIME_DUPLICATE' });
    let resolve!: (state: EditMealTimeState) => void;
    mockAddMealTime.mockReturnValue(new Promise((done) => { resolve = done; }));
    await renderMealSchedule();
    await fireEvent.press(await screen.findByTestId('meal-time-edit-1'));
    await fireEvent(screen.getByTestId('meal-time-picker'), 'onValueChange', {}, new Date(2026, 9, 2, 20, 5));
    await waitFor(() => expect(screen.getByTestId('meal-time-error').props.children).toBe('Ya hay una comida a esa hora'));
    await waitFor(() => expect(screen.getByTestId('meal-time-edit-0').props.accessibilityState).not.toEqual(expect.objectContaining({ disabled: true })));
    await fireEvent.press(screen.getByTestId('add-meal-time-button'));
    await fireEvent(screen.getByTestId('meal-time-picker'), 'onValueChange', {}, new Date(2026, 9, 2, 8, 5));
    await waitFor(() => {
      for (const id of ['meal-time-edit-0', 'meal-time-edit-1', 'add-meal-time-button']) {
        expect(screen.getByTestId(id).props.accessibilityState).toEqual(expect.objectContaining({ disabled: true }));
      }
      expect(screen.queryByTestId('meal-time-error')).toBeNull();
    });
    await act(async () => resolve({ kind: 'ok' }));
    await waitFor(() => expect(screen.getByTestId('meal-time-edit-0').props.accessibilityState).not.toEqual(expect.objectContaining({ disabled: true })));
  });
```

- Commit: `test(mobile-meal-schedule-editing): lock error clearing when a new add starts (R8)`

### E4-c — `moveMealTime` recorre las filas de R2 que faltaban (E4.3)

En `src/api/__tests__/nutrition.test.ts`, dentro de
`describe('#147 R3: moveMealTime publica el PATCH y mapea por kind')`, añade
este `it.each` literal **después** de
`it('comparte el mapeo de errores de addMealTime')`. Usa los helpers
`response`, `invalidJsonResponse` y `baseUrl`, que ya existen en el fichero.

```ts
  it.each([
    { label: '422 NUTRITION_PLAN_REQUIRED', backend: response(422, { code: 'NUTRITION_PLAN_REQUIRED' }), expected: { kind: 'unprocessable', code: 'NUTRITION_PLAN_REQUIRED' } },
    { label: '422 MEAL_TIMES_LIMIT_REACHED', backend: response(422, { code: 'MEAL_TIMES_LIMIT_REACHED' }), expected: { kind: 'unprocessable', code: 'MEAL_TIMES_LIMIT_REACHED' } },
    { label: '422 SOMETHING_ELSE', backend: response(422, { code: 'SOMETHING_ELSE' }), expected: { kind: 'error' } },
    { label: '422 JSON inválido', backend: invalidJsonResponse(422), expected: { kind: 'error' } },
  ])('PATCH mapea $label como la tabla de R2', async ({ backend, expected }) => {
    const fetchFn = jest.fn().mockResolvedValue(backend) as unknown as typeof fetch;
    await expect(moveMealTime(baseUrl, 'jwt-token', 'pet-1', '19:30', '20:05', fetchFn)).resolves.toEqual(expected);
  });
```

- Commit: `test(mobile-meal-schedule-editing): lock the remaining R2 table rows on the PATCH mapping (R3)`

### E4-d — Editar en la primera fila (E4.4)

En `src/screens/meal-schedule/index.test.tsx`, dentro de
`describe('#147 R5: Editar abre el selector en la hora de la fila y publica el PATCH')`,
añade este `it` literal **después** de
`it('elegir la misma hora de la fila no llama a nada')`:

```ts
  it('Editar en la primera fila abre el selector con su hora y la publica como origen', async () => {
    await renderMealSchedule();
    await fireEvent.press(await screen.findByTestId('meal-time-edit-0'));
    const picker = screen.getByTestId('meal-time-picker');
    expect([picker.props.value.getHours(), picker.props.value.getMinutes()]).toEqual([7, 30]);
    await fireEvent(picker, 'onValueChange', {}, new Date(2026, 9, 2, 8, 5));
    await waitFor(() => expect(mockMoveMealTime).toHaveBeenCalledWith('http://example.test/v1', 'jwt-token', 'pet-1', '07:30', '08:05'));
    await waitFor(() => expect(screen.getByTestId('meal-time-edit-0').props.accessibilityState).not.toEqual(expect.objectContaining({ disabled: true })));
  });
```

- Commit: `test(mobile-meal-schedule-editing): lock the first row's time as the edit origin (R5)`

### E4-e — 401 en Añadir (E4.5)

En el mismo fichero, dentro de
`describe('#147 R8: cada error del contrato tiene su mensaje')`, añade este
`it` literal **después** del `it` de E4-b,
`it('una nueva llamada de Añadir retira el error anterior')`. Debe quedar como
el último `it` del `describe`.

```ts
  it('401 en Añadir cierra sesión sin mensaje', async () => {
    const signOut = jest.fn();
    mockUseAuth.mockReturnValue({ status: 'authenticated', token: 'jwt-token', signIn: jest.fn(), signOut });
    mockAddMealTime.mockResolvedValue({ kind: 'unauthorized' });
    await renderMealSchedule();
    await fireEvent.press(await screen.findByTestId('add-meal-time-button'));
    await fireEvent(screen.getByTestId('meal-time-picker'), 'onValueChange', {}, new Date(2026, 9, 2, 8, 5));
    await waitFor(() => {
      expect(signOut).toHaveBeenCalledTimes(1);
      expect(screen.getByTestId('meal-time-edit-0').props.accessibilityState).not.toEqual(expect.objectContaining({ disabled: true }));
    });
    expect(screen.queryByTestId('meal-time-error')).toBeNull();
    expect(mockGetNutritionPlan).toHaveBeenCalledTimes(1);
    expect(mockGetPet).toHaveBeenCalledTimes(1);
  });
```

Este `it` no cambia el recuento de `signOut(` de `design-drift`, porque ese
inventario solo cuenta producción.

- Commit: `test(mobile-meal-schedule-editing): lock sign-out on 401 from add (R8)`

### Sondas de E4 (sobre el verde)

Las 8 vienen de `progress/review_mobile-meal-schedule-editing.md`:

- la 1 y la 2, de §R3-Observaciones 1;
- de la 3 a la 8, de §Pre-verificación del borrador E4 y barrido de cláusulas,
  §4.

Mídelas con el comando de su fichero, después del commit de E4-e. Restaura cada
una con `git checkout HEAD -- <fichero de producción>`.

Al final, `git diff --cached --stat` y `git status --short` deben salir vacíos,
salvo el informe sin trackear. «Por matcher» y «por consulta» significan lo
mismo que en §Enmienda E2.

| # | Fichero | Sonda | Debe ponerse rojo, solo él y por matcher |
|---|---|---|---|
| 1 | `src/screens/meal-schedule/index.tsx` | En `onValueChange`, rama `mealTime !== from`, envuelve la petición de Editar: `() => moveMealTime(...).then((r) => { if (r.kind === 'ok') queryClient.setQueryData(nutritionKeys.plan(petId), …); return r; })`. El parche sustituye en `mealTimes` la hora `from` por `mealTime`, así que la caché cambia tras el ok y antes de `plan.refetch()` | `los controles siguen deshabilitados hasta que termina el refetch`, en `queryByText('20:05')).toBeNull()` |
| 2 | `src/screens/meal-schedule/index.tsx` | Quita `setEditError(null);` de `runMealTimeEdit` y llámalo solo justo antes de `void runMealTimeEdit(() => moveMealTime(...))` en `onValueChange` | `una nueva llamada de Añadir retira el error anterior`, en `queryByTestId('meal-time-error')).toBeNull()` |
| 3 | `src/api/nutrition.ts` | En `moveMealTime`, cambia `: editMealTimeState(result.response, 200);` por `: editMealTimeState(result.response, 200).then((s): EditMealTimeState => (s.kind === 'unprocessable' && s.code === 'NUTRITION_PLAN_REQUIRED' ? { kind: 'error' } : s));` | la fila `422 NUTRITION_PLAN_REQUIRED` de `PATCH mapea $label como la tabla de R2` |
| 4 | `src/api/nutrition.ts` | Lo mismo que la 3, con `'MEAL_TIMES_LIMIT_REACHED'` | la fila `422 MEAL_TIMES_LIMIT_REACHED` |
| 5 | `src/api/nutrition.ts` | En `editMealTimeState`, dentro de `if (response.status === 422) {`, justo después del `}` que cierra el `if` de los cuatro códigos: `if (okStatus === 200 && isObjectBody(body)) return { kind: 'invalid' };` | la fila `422 SOMETHING_ELSE` |
| 6 | `src/api/nutrition.ts` | Lo mismo que la 5, con `!isObjectBody(body)` | la fila `422 JSON inválido` |
| 7 | `src/screens/meal-schedule/index.tsx` | Cambia `onPress={() => setPicker({ from: mealTime })}` por `onPress={() => setPicker({ from: loadedPlan.mealTimes[loadedPlan.mealTimes.length - 1] })}` | `Editar en la primera fila abre el selector con su hora y la publica como origen`, en `toEqual([7, 30])` |
| 8 | `src/screens/meal-schedule/index.tsx` | En `onValueChange`, envuelve la petición de Añadir: `() => addMealTime(...).then((r) => (r.kind === 'unauthorized' ? ({ kind: 'error' } as const) : r))` | `401 en Añadir cierra sesión sin mensaje`, en `expect(signOut).toHaveBeenCalledTimes(1)` |

Si una sonda sale verde, o roja por otro `it` o por consulta, apúntalo en `impl`
con la primera línea roja y **PARA**.

### Lo que cambia en §Cierre

- Las cifras pasan a **88 suites / 1771 tests**: +1 de E4-b, +4 de E4-c, +1 de
  E4-d y +1 de E4-e.
- La lista de `git diff --name-only <hash-del-handoff>..HEAD` **de tus commits**
  sigue siendo la de [[design]] §Archivos afectados: **13** ficheros.
- [[traceability]] cita, junto a lo que ya cita en cada fila:
  - E4-c en la fila R3;
  - E4-d en la fila R5;
  - E4-a en la fila R7;
  - E4-b y E4-e en la fila R8.

  Va en un commit propio:
  `docs(mobile-meal-schedule-editing): cite amendment E4 in #147 traceability`.

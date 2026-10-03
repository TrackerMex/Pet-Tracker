---
feature: "mobile-meal-schedule-editing"
status: approved     # draft | approved
tags: [harness, spec, mobile]
---

# Requisitos — [[mobile-meal-schedule-editing]] (#147)

> Notación EARS. Cada requisito tiene id único R<n>, inmutable una vez aprobado.
> Ver [[design]] para las decisiones técnicas, [[tasks]] para el orden
> test-primero, los rojos esperados y las sondas, y
> [[../../docs/ui-guidelines|ui-guidelines]] para la carta de UI que rige la
> pantalla.
>
> **Base congelada**: `cb14497c` (origin/main tras el merge de #103, PR #185).
> Todos los hechos de esta spec se comprobaron contra ese árbol. Las anclas
> son contenido que se puede buscar con grep, nunca números de línea.

## §0. Contrato del backend (comprobado contra el árbol, no contra la entrada)

| Endpoint (relativo a `EXPO_PUBLIC_API_URL`, que ya incluye `/v1`) | Éxito | Errores |
|---|---|---|
| `POST /pets/:petId/meal-times`, body `{ "mealTime": "HH:MM" }` | `201` con el plan | `400`, `403`, `422 NUTRITION_PLAN_REQUIRED`, `422 MEAL_TIME_DUPLICATE`, `422 MEAL_TIMES_LIMIT_REACHED` |
| `PATCH /pets/:petId/meal-times/:mealTime` (la hora de origen va en la ruta), body `{ "mealTime": "HH:MM" }` (la hora de destino) | `200` con el plan | `400`, `403`, `422 NUTRITION_PLAN_REQUIRED`, `422 MEAL_TIME_NOT_IN_PLAN`, `422 MEAL_TIME_DUPLICATE` (también cuando destino = origen) |

Pruebas (grep dentro de `backend-pet-tracker/src/modules/nutrition/`):

- `infrastructure/nutrition.controller.ts` contiene `@Post('meal-times')` y
  `@Patch('meal-times/:mealTime')`. Los dos llevan `@RequirePetRole('owner')`
  y ninguno lleva `@HttpCode`, así que Nest responde 201 al POST y 200 al
  PATCH por defecto. El único `@HttpCode` del fichero es el de
  `nutrition-plan/generate`. Los dos endpoints devuelven el plan sin
  `servedToday`.
- `application/dto/meal.dto.ts`: `EditMealTimeSchema` aplica
  `STRICT_MEAL_TIME_PATTERN`, y un body que no lo cumple da `400`.
- `application/use-cases/add-meal-time.use-case.ts` y
  `move-meal-time.use-case.ts` lanzan los errores de la tabla. El movimiento
  arrastra la porción servida hoy junto con la franja.
- `infrastructure/mappers/nutrition-error.mapper.ts` contiene `code: 'MEAL_TIME_NOT_IN_PLAN'`,
  `code: 'MEAL_TIME_DUPLICATE'`, `code: 'MEAL_TIMES_LIMIT_REACHED'` y
  `code: 'NUTRITION_PLAN_REQUIRED'`, todos como `422`.
- El backend guarda las horas **ordenadas**. Por eso, tras mover una franja, las
  filas pueden cambiar de índice ([[../meal-schedule-editing/requirements|#103]]).

El móvil **descarta** el cuerpo de la respuesta `201`/`200`. La pantalla se
repinta con el refetch de R7, no con lo que devuelve la escritura.

## §Discrepancias (gana el árbol)

| # | La entrada #147 dice | El árbol en `cb14497c` dice | Prueba |
|---|---|---|---|
| D1 | «reutiliza el `patchJson` que #41 añade a `src/api/http.ts` en su R3 (en origin/main aún no existe)» | `patchJson` **ya existe**, porque #41 ya está mergeada. `http.ts` no se toca | `grep -n "export async function patchJson" mobile-pet-tracker/src/api/http.ts` devuelve una línea |
| D2 | `files_affected` no incluye los tests de la API | `src/api/__tests__/nutrition.test.ts` recibe los tests de R2 y R3 y entra en la lista cerrada | `grep -n "describe('R3: generateNutritionPlan" mobile-pet-tracker/src/api/__tests__/nutrition.test.ts` |
| D3 | `progress/explore_meal-schedule-editing.md` §3.4: «No hay `patchJson` ni `putJson`» | Era verdad cuando se escribió el explore y dejó de serlo (ver D1). El resto de premisas del explore que usa esta spec se comprobaron y siguen siendo ciertas | ídem D1 |
| D4 | «El catálogo […] queda en 320 tras #41» | Coincide: en `cb14497c` la suma literal da 320 | `grep -n "260 + 16 + 1 + 4 + 7 + 14 + 2 + 1 + 4 - 6 + 1 + 2 + 3 + 11," mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx` |
| D5 | La entrada no dice de dónde sale `myRole` | `src/screens/meal-schedule/index.tsx` todavía no consulta `petKeys.detail`, así que hay que añadir esa query. El precedente literal es #41: `const isOwner = pet.data?.kind === 'ok' && pet.data.pet.myRole === 'owner';` | `grep -n "isOwner = pet.data" mobile-pet-tracker/src/screens/geofences/index.tsx` |
| D6 | La skill `expo-ui` cita `@expo/ui/community/datetimepicker` | El repo importa `@expo/ui/community/datetime-picker`, con guion, y se usa así desde #123. Gana el repo | `grep -n "community/datetime-picker" mobile-pet-tracker/src/screens/add-reminder/index.tsx` |

## Copy nueva (literales exactos, que Codex no traduce)

Se añaden nueve claves a `src/i18n/catalog.ts`, en los dos idiomas:

| Clave | `es` | `en` | Uso |
|---|---|---|---|
| `mealSchedule.addMeal` | `Añadir comida` | `Add meal` | etiqueta del botón bajo la lista (R4) |
| `mealSchedule.editTime` | `Editar` | `Edit` | etiqueta visible del botón de cada fila (R4) |
| `mealSchedule.editTimeLabel` **(param)** | `Editar horario de las {{time}}` | `Edit {{time}} meal time` | `accessibilityLabel` del botón de cada fila (R4) |
| `mealSchedule.errorInvalidTime` | `La hora no es válida` | `That time is not valid` | `400` (R8) |
| `mealSchedule.errorEditForbidden` | `Solo el dueño puede cambiar los horarios` | `Only the owner can change meal times` | `403` (R8) |
| `mealSchedule.errorPlanRequired` | `Primero genera un plan de alimentación` | `Generate a meal plan first` | `422 NUTRITION_PLAN_REQUIRED` (R8) |
| `mealSchedule.errorTimeNotInPlan` | `Ese horario ya no está en el plan` | `That meal time is no longer in the plan` | `422 MEAL_TIME_NOT_IN_PLAN` (R8) |
| `mealSchedule.errorDuplicateTime` | `Ya hay una comida a esa hora` | `There is already a meal at that time` | `422 MEAL_TIME_DUPLICATE` (R8) |
| `mealSchedule.errorMealLimit` | `El plan ya tiene el máximo de 6 comidas` | `The plan already has the maximum of 6 meals` | `422 MEAL_TIMES_LIMIT_REACHED` (R8) |

Estas claves existentes se reutilizan sin cambios:

- `common.cannotReachServer`: `No se pudo conectar con el servidor` / `Cannot reach server`
- `common.somethingWentWrong`: `Algo salió mal` / `Something went wrong`

## Requisitos funcionales

### R1: el catálogo trae las nueve claves en los dos idiomas

**WHEN** se carga `src/i18n/catalog.ts` **THE SYSTEM SHALL**:

- exponer en `es` y en `en` las nueve claves de §Copy nueva, con esos valores exactos;
- tener en cada idioma el total de claves de la base más 9 (320 en `cb14497c`, 329 al terminar);
- usar los mismos marcadores `{{…}}` en los dos idiomas.

`specs/mobile-ui-language/design.md` **SHALL** listar cada clave nueva con sus dos
literales y la marca `← añadida por #147 (R1)`.

### R2: `addMealTime` publica la franja y traduce la respuesta por `kind`

**WHEN** se llama `addMealTime(baseUrl, token, petId, mealTime, fetchFn)`
**THE SYSTEM SHALL** hacer **un solo** `fetch`:

- método `POST`;
- URL `${baseUrl sin barra final}/pets/${petId}/meal-times`;
- cabeceras `Authorization: Bearer ${token}` y `Content-Type: application/json`;
- body `JSON.stringify({ mealTime })`.

Y **SHALL** devolver:

| Respuesta | `EditMealTimeState` |
|---|---|
| `201` | `{ kind: 'ok' }` |
| `400` | `{ kind: 'invalid' }` |
| `403` | `{ kind: 'forbidden' }` |
| `422` con `code` igual a `NUTRITION_PLAN_REQUIRED`, `MEAL_TIME_NOT_IN_PLAN`, `MEAL_TIME_DUPLICATE` o `MEAL_TIMES_LIMIT_REACHED` | `{ kind: 'unprocessable', code }` |
| `422` con otro `code`, o con un cuerpo que no es JSON | `{ kind: 'error' }` |
| `401` | `{ kind: 'unauthorized' }` |
| cualquier otro estado, incluidos `200`, `404` y `500` | `{ kind: 'error' }` |
| `fetch` rechaza con `Error('network down')` | `{ kind: 'unreachable', message: 'network down' }` |
| `baseUrl` es `undefined` | `{ kind: 'missing-config' }`, **sin** llamar a `fetch` |

### R3: `moveMealTime` mueve la franja y traduce la respuesta por `kind`

**WHEN** se llama `moveMealTime(baseUrl, token, petId, from, to, fetchFn)`
**THE SYSTEM SHALL** hacer **un solo** `fetch`:

- método `PATCH`;
- URL `${baseUrl sin barra final}/pets/${petId}/meal-times/${from}`;
- las mismas cabeceras que R2;
- body `JSON.stringify({ mealTime: to })`.

Devuelve la misma tabla de R2, con una diferencia: el único estado `ok` es
**`200`**. Un `201` devuelve `{ kind: 'error' }`.

### R4: solo el owner ve los controles y los demás ven la pantalla en solo lectura

La pantalla añade la query `petKeys.detail(petId)` mediante `getPet`.

**WHILE** el plan está cargado, **IF** esa query resuelve `{ kind: 'ok' }` con
`pet.myRole === 'owner'`, **THEN THE SYSTEM SHALL**:

1. pintar en **cada** fila `meal-time-row-${index}` un heroui `Button` como
   **cuarto y último hijo**, detrás del icono, la hora y los gramos, que no
   cambian. El botón lleva:
   - `testID="meal-time-edit-${index}"`;
   - la etiqueta visible `Editar`;
   - `accessibilityLabel` `Editar horario de las ${hora de esa fila}`.
2. pintar un botón con `testID="add-meal-time-button"` y la etiqueta
   `Añadir comida` como **último hijo** de la sección de horarios, es decir,
   debajo de la última fila. La sección es el `View` que ya contiene el título
   `Horarios y porciones` y las filas, y pasa a llevar
   `testID="meal-times-section"`.

**IF** se da cualquiera de estas condiciones:

- `getPet` resuelve `{ kind: 'ok' }` con `myRole` igual a `family`, `walker` o `vet`;
- `getPet` resuelve con un `kind` distinto de `ok`;
- `getPet` todavía no ha resuelto;

**THEN THE SYSTEM SHALL NOT** pintar ningún `meal-time-edit-*` ni
`add-meal-time-button`. Cada fila conserva sus tres hijos de la base y la
sección contiene solo el título y las filas. El `403` del backend se queda como
red de seguridad (R8).

### R5: Editar abre el selector con la hora de la fila y publica el `PATCH`

**WHEN** el owner pulsa `meal-time-edit-${i}` **THE SYSTEM SHALL** montar un
único `ExpoDateTimePicker` de `@expo/ui/community/datetime-picker`, dentro de un
`Host` de `@expo/ui`, con:

- `testID="meal-time-picker"`;
- `mode="time"`;
- `presentation="dialog"`;
- un `value` cuyas `getHours()` y `getMinutes()` **locales** coinciden con la
  hora de la fila `i`.

**WHEN** el selector emite `onValueChange(event, fecha)` **THE SYSTEM SHALL**
desmontar el selector. Si `HH:MM` es distinto de la hora de la fila, **SHALL**
llamar **una vez** a `moveMealTime(baseUrl, token, petId, horaDeLaFila, HH:MM)`.
`HH:MM` se calcula con `fecha.getHours()` y `fecha.getMinutes()` (hora
**local**), cada uno con dos dígitos.

**IF** `HH:MM` es igual a la hora de la fila, **OR** el selector emite
`onDismiss`, **THEN THE SYSTEM SHALL** desmontar el selector sin llamar a
`moveMealTime` ni a `addMealTime`.

### R6: Añadir comida abre el selector a las 12:00 y publica el `POST`

**WHEN** el owner pulsa `add-meal-time-button` **THE SYSTEM SHALL** montar el
mismo selector de R5 (`testID="meal-time-picker"`, `mode="time"`,
`presentation="dialog"`) con un `value` cuya hora local es **12:00**.

**WHEN** el selector emite `onValueChange(event, fecha)` **THE SYSTEM SHALL**
desmontarlo y llamar **una vez** a `addMealTime(baseUrl, token, petId, HH:MM)`,
con `HH:MM` calculado igual que en R5. **IF** el selector emite `onDismiss`,
**THEN THE SYSTEM SHALL** desmontarlo sin llamar a ninguna de las dos funciones.

### R7: tras un éxito, refetch de plan y mascota, sin estado optimista y con los controles bloqueados mientras dura

**WHILE** una llamada de R5 o R6 está en curso (desde `onValueChange` hasta que
terminan los refetch), **THE SYSTEM SHALL**:

- pintar **todos** los `meal-time-edit-*` y `add-meal-time-button` con
  `accessibilityState.disabled === true`;
- seguir pintando las horas del plan que había en caché. Ni la hora nueva ni la
  fila nueva aparecen antes de que el refetch resuelva.

**WHEN** la llamada devuelve `{ kind: 'ok' }` **THE SYSTEM SHALL**:

1. `await plan.refetch()`;
2. `await queryClient.refetchQueries({ queryKey: petKeys.detail(petId) })`;
3. rehabilitar los controles solo cuando hayan terminado los dos.

Es el mismo par de refetch que hace `toggleMeal` en `src/app/(tabs)/food.tsx` (#98).

**IF** la llamada devuelve cualquier otro `kind`, **THEN THE SYSTEM SHALL NOT**
refetchear ninguna de las dos claves.

### R8: cada error del contrato tiene su mensaje

**WHEN** la llamada de R5 o R6 termina en error, **THE SYSTEM SHALL** pintar un
único `Text` dentro de `meal-times-section`, **justo antes** de
`add-meal-time-button` (es el penúltimo hijo de la sección), con:

- `testID="meal-time-error"`;
- `selectable`;
- `className="text-danger"`;
- el literal de esta tabla:

| Resultado | Literal `es` |
|---|---|
| `{ kind: 'invalid' }` (400) | `La hora no es válida` |
| `{ kind: 'forbidden' }` (403) | `Solo el dueño puede cambiar los horarios` |
| `unprocessable` con `NUTRITION_PLAN_REQUIRED` | `Primero genera un plan de alimentación` |
| `unprocessable` con `MEAL_TIME_NOT_IN_PLAN` | `Ese horario ya no está en el plan` |
| `unprocessable` con `MEAL_TIME_DUPLICATE` | `Ya hay una comida a esa hora` |
| `unprocessable` con `MEAL_TIMES_LIMIT_REACHED` | `El plan ya tiene el máximo de 6 comidas` |
| `{ kind: 'unreachable' }` | `No se pudo conectar con el servidor` |
| `{ kind: 'error' }` | `Algo salió mal` |
| `{ kind: 'missing-config' }` | `Algo salió mal` |
| la promesa rechaza | `Algo salió mal` |

**IF** la llamada devuelve `{ kind: 'unauthorized' }`, **THEN THE SYSTEM SHALL**
llamar a `signOut()` y no pintar `meal-time-error`.

**WHEN** empieza una nueva llamada de R5 o R6 **THE SYSTEM SHALL** quitar el
`meal-time-error` anterior.

### R9: la copy nueva queda registrada en los candados de idioma

**THE SYSTEM SHALL** registrar en el bloque `R6_FOOD` de
`src/__tests__/ui-copy-table.ts` una fila por cada `t('…')` nuevo de
`src/screens/meal-schedule/index.tsx`:

- una fila por cada una de las nueve claves de §Copy nueva;
- 1 fila más de `common.cannotReachServer`;
- 2 filas más de `common.somethingWentWrong`.

En total son 12 filas nuevas, y `R6_FOOD` pasa de 38 a 50 filas. Las 3 filas de
`common.*` se mueven en el commit de test de R8, porque sin ellas los candados
existentes se pondrían rojos (ver [[tasks]] §R8).

## Criterios no funcionales (los comprueba el reviewer y no tienen R-id)

- **Grep-clean de la carta** (`docs/ui-guidelines.md` §Decisiones fijas, C8 de
  `CHECKPOINTS.md`) sobre los ficheros de producción tocados. Cero ocurrencias de:
  - hex fuera de `src/theme/`;
  - clases arbitrarias `[...]`;
  - `StyleSheet.create`;
  - `rounded-2xl|lg|md|sm`;
  - `shadow`/`elevation` legacy.
  Los comandos están en [[tasks]] §Cierre.
- **Dimensiones**: el `contentContainerStyle` de `screen-meal-schedule` no cambia
  (excepción A11 de #95: `padding: 24`, `gap: 16`,
  `paddingBottom: insets.bottom + 24`).
- **Componentes**:
  - las filas siguen usando el `Card` compartido;
  - los dos controles son el `Button` de heroui-native;
  - el selector es `ExpoDateTimePicker` de la capa community;
  - el botón de cada fila mide `min-h-11` (≥ 44 pt).
- **Sin dependencias nuevas**: `git diff <hash-del-handoff> -- mobile-pet-tracker/package.json mobile-pet-tracker/bun.lock` sale vacío.
- **Suite**: `./init.sh` termina con exit 0, medido **sin pipe**. La base son
  **88 suites / 1710 tests** en `cb14497c`. Al final se esperan
  **88 suites / 1759 tests**: +0 suites y **+49 tests** (desglose en [[tasks]] §Cifras).

## Fuera de alcance

| Punto | Tipo | Nota y premisa comprobada |
|---|---|---|
| Borrar una franja | deuda candidata, sin id | El backend de #103 no tiene ruta de borrado de franjas. `grep -rn "meal-times" backend-pet-tracker/src/modules/nutrition/infrastructure/*.controller.ts` devuelve solo el `@Post` y el `@Patch`. El `@Delete(':mealTime')` de `meals.controller.ts` es desmarcar una comida servida (#98), no borrar una franja |
| Marcar una comida como servida desde meal-schedule | delimitación | Ya existe en Food (#98). meal-schedule no pinta el estado de servida y esta feature no lo añade |
| Deshabilitar `Añadir comida` cuando ya hay 6 franjas | delimitación | El límite lo decide el backend (`422 MEAL_TIMES_LIMIT_REACHED`, R8). El cliente no duplica la regla (ver [[design]] D7) |
| Feedback háptico al editar o añadir | delimitación | `toggleMeal` lo tiene, pero ningún criterio de la entrada #147 lo pide |
| Refetch tras un error, por ejemplo con la lista desfasada tras `MEAL_TIME_NOT_IN_PLAN` | deuda candidata, sin id | R7 solo refetchea si la llamada tiene éxito (ver [[design]] D6) |
| Traducir el `message` de los `400` del backend | delimitación | El móvil muestra su propio literal según el `kind` y nunca enseña el `message` de Zod |
| Regenerar el plan borra las ediciones | delimitación | Es conducta del backend (#103), no del móvil |
| Controles de edición en Food o en Home | delimitación | Decisión cerrada en la entrada: solo meal-schedule tiene controles |
| `useMutation` de TanStack | delimitación | Se sigue el patrón imperativo de `toggleMeal` y `handleGenerate`. `grep -rn "useMutation" mobile-pet-tracker/src --include=*.tsx` sale vacío en la base |

## Decisiones tomadas por el spec_author que el humano debe revisar en el gate

Cada una está detallada en [[design]] §Decisiones (D1-D10).

## Aprobación

- [x] Spec aprobada por humano (fecha: 2026-10-02, commit de firma: el que marca esta casilla). Es un gate
      obligatorio antes del handoff a Codex.

## Prueba de humo (gate humano propio, después del veredicto del reviewer)

**Dónde**: en el teléfono del humano, con un **dev build de Android**, nunca con
Expo Go.

**Precondiciones de entorno**. Si falta alguna, la prueba no vale:

1. El backend local está arrancado y la migración
   `0018_nutrition_plans_engine_meals.sql` está aplicada en la base a la que
   apunta su `DATABASE_URL` (`<base: pet_tracker | pet_tracker_wt>`). Se aplica
   con `drizzle-kit`, nunca con `psql` a mano.
2. El `EXPO_PUBLIC_API_URL` del dev build apunta a ese backend:
   `<http://ip-del-backend:puerto/v1>`.
3. La cuenta owner `<email-owner>` tiene la mascota `<nombre-mascota>` con un
   **plan de nutrición** generado, de modo que meal-schedule muestra al menos dos filas.
4. Una segunda cuenta `<email-no-owner>` tiene el rol `<family | walker | vet>`
   sobre esa misma mascota.
5. `adb devices -l` puede listar el teléfono **dos veces** (por IP y por mDNS).
   Por eso todos los comandos usan `adb -s <ip:puerto>`.

**Pasos**. Todos con la cuenta owner, salvo el 6:

1. En Food, marca como servida hoy la franja `<HH:MM-origen>`. Anota el contador
   de comidas de la Home: `<servidas>/<total>`.
2. Abre Horario de comidas. Cada fila muestra `Editar` y debajo de la lista
   aparece `Añadir comida`.
3. Pulsa `Editar` en `<HH:MM-origen>` y elige una hora libre, `<HH:MM-destino>`.
   Comprueba que:
   - la lista se repinta con `<HH:MM-destino>` en su sitio dentro del orden;
   - en Food, la franja marcada como servida es ahora `<HH:MM-destino>`;
   - la Home sigue mostrando `<servidas>/<total>`.
4. Pulsa `Añadir comida` y elige una hora libre, `<HH:MM-nueva>`. Aparece una
   fila más, los gramos de cada comida bajan y la Home pasa a
   `<servidas>/<total+1>`.
5. Pulsa `Editar` en una franja y elige la hora de **otra** franja que ya
   existe. Bajo la lista aparece `Ya hay una comida a esa hora` y la lista no cambia.
6. Cierra sesión, entra con `<email-no-owner>`, selecciona `<nombre-mascota>` y
   abre Horario de comidas. Ninguna fila muestra `Editar` y no aparece
   `Añadir comida`.

- [X] Prueba de humo superada en dev build de Android (fecha: 2026-10-02,
      dispositivo: OnePlus Nord 5, firmado por: AlexisSM377)

## Enmienda E1 — dos candados globales que la spec no movía, y la técnica TZ

> Escrita el 2026-10-02 sobre la spec firmada (`86771e3e`), después de que Codex
> parara en §Cierre con HEAD `b5d46054`
> (`progress/impl_mobile-meal-schedule-editing.md` §Bloqueo en §Cierre).
> No toca D1-D10, ni R1-R9, ni la producción. Solo amplía la lista cerrada
> de ficheros con dos tests de candado y corrige una técnica de tasks.md.
> Su casilla va **sin marcar**: el humano reabre el gate solo para esta
> enmienda.

### El hecho medido

`bun run test` sobre `b5d46054` da 88 suites / 1759 tests, exit 1. Los tres
`it` rojos son candados globales que ya existían; el leader los reproduce con
`bunx jest src/__tests__/design-drift.test.ts src/__tests__/consistency-classnames.test.ts`,
que da 3 rojos de 108:

| Candado | Fichero | Expected | Received | Origen en la spec |
|---|---|---|---|---|
| `#87 R19` › `preserves every mutation sign-out with zero delta` | `src/__tests__/design-drift.test.ts` | meal-schedule `1` | `2` | el `await signOut()` del `case 'unauthorized'` de R8 ([[design]] §Estado y handler) |
| `#98 R10` › `deja CONTINUOUS_CORNER, bg-accent-soft y el acento donde estaban` | `src/__tests__/consistency-classnames.test.ts` | `16` | `18` | el `bg-accent-soft` de `meal-time-edit-*` y el de `add-meal-time-button` (R4, [[design]] §Decisiones de cada control) |
| `#64 R9` › `conserva los dieciséis usos de bg-accent-soft que sí son acento` | `src/__tests__/consistency-classnames.test.ts` | `16` | `18` | lo mismo |

La producción cumple la spec: los dos `bg-accent-soft` y el `signOut()` los
exige la propia spec. El hueco es que la spec no listó los inventarios
globales que esos tres sitios mueven.

### E1.1 — los dos inventarios se mueven en commits de test propios

**WHEN** se cierra #147, **THE SYSTEM SHALL**:

- contar en `#87 R19` **2** llamadas a `signOut(` en `screens/meal-schedule/index.tsx`;
- contar en `#98 R10` y en `#64 R9` **16 + 2** usos de `bg-accent-soft` en `src/`.

El título de `#64 R9` deja de llevar el número, como hizo #146 con el `it`
de los «trece botones primarios». Las ediciones literales y los mensajes de
commit están en [[tasks]] §Enmienda E1. La lista cerrada de [[design]]
§Archivos afectados pasa de 11 a 13 ficheros. Las cifras no cambian: siguen
siendo 88 suites / 1759 tests, porque solo cambian aserciones existentes.

### E1.2 — la técnica TZ de tasks.md era ciega en jest

La sonda `setUTCHours` de R5 quedó verde con `process.env.TZ`. Jest 29 da
a cada test una copia de `process.env`
(`jest-util/build/createProcessObject.js`), así que asignarle `TZ` no cambia
la zona que lee `Date`. Codex lo corrigió en `2c873c47` con
`process.getBuiltinModule('process').env`, y la sonda pasó a rojo en R5 y R6
(informe §Sonda TZ corregida). El humano confirmó en el chat del
leader, el 2026-10-02, que se lo autorizó a Codex en su sesión. Esta
enmienda lo deja por escrito. [[tasks]] §Técnica TZ 1 se
lee con ese cambio. Los dos refactors de Codex, `2c873c47` (TZ) y `b5d46054`
(formato de §2.16), se quedan; el reviewer los juzga.

El precedente que citaba la spec, `src/screens/home/weekly-activity-chart.test.tsx`
(`process.env.TZ = 'America/Mexico_City'`), usa la misma técnica y
probablemente es igual de ciego. Es una deuda candidata, **sin medir** y
fuera de #147.

- [x] Enmienda E1 aprobada por humano (fecha: 2026-10-02, en el chat del leader; commit de firma: el que marca esta casilla)

## Enmienda E2 — dos cláusulas de R7 sin candado

El reviewer rechazó #147 en `d05d8725`
(`progress/review_mobile-meal-schedule-editing.md` §Observaciones 1). La
producción cumple R7. El hueco está en [[tasks]] §R7, que prescribió los
cuatro `it` solo sobre el flujo Editar, y en su tabla de sondas, que solo
pedía «refetch en `finally`». Con cada una de estas 13 mutaciones,
`src/screens/meal-schedule` queda en 51/51 verde:

| Cláusula de R7 | Mutaciones que hoy pasan en verde |
|---|---|
| **WHILE** una llamada de **R6** está en curso: controles deshabilitados y ninguna fila nueva antes del refetch. **WHEN** ok: los dos refetch y rehabilitar al final | 3: añadido optimista con rollback; `setEditing(false)` justo después de lanzar el añadido; `addMealTime` fuera de `runMealTimeEdit`, sin refetch tras el ok |
| **IF** cualquier otro `kind` **THEN** ningún refetch | 10: `await plan.refetch()` en `invalid`, `forbidden`, `NUTRITION_PLAN_REQUIRED`, `MEAL_TIME_NOT_IN_PLAN`, `MEAL_TIMES_LIMIT_REACHED`, `unauthorized`, `unreachable`, `error`/`missing-config` y el `catch`; y `refetchQueries(petKeys.detail)` en `forbidden`. Solo `MEAL_TIME_DUPLICATE` está candado |

R7 no cambia. Esta enmienda solo añade los candados que le faltaban.

### E2.1 — R7 se candada también sobre el flujo Añadir

**WHEN** se cierra #147, **THE SYSTEM SHALL** tener en
`describe('#147 R7: …')` tres `it` más que hacen sobre `add-meal-time-button`
lo mismo que los tres primeros hacen sobre `meal-time-edit-1`: refetch y
repintado tras el ok, controles deshabilitados sin fila nueva mientras vuela
`addMealTime`, y controles deshabilitados sin fila nueva mientras vuela el
refetch.

### E2.2 — «ningún refetch» se candada en todos los kinds que no son ok

**WHEN** se cierra #147, **THE SYSTEM SHALL** comprobar en cada fila del
`it.each` de `#147 R8` y en `it('401 cierra sesión sin mensaje')` que
`getNutritionPlan` y `getPet` se llamaron **1** vez cada uno al terminar el
test.

Las ediciones literales, los mensajes de commit y las sondas están en
[[tasks]] §Enmienda E2. Las cifras pasan de 88 suites / 1759 tests a
**88 suites / 1762** (+3 de E2.1; E2.2 solo añade aserciones). La lista cerrada
de [[design]] §Archivos afectados no cambia: siguen siendo 13 ficheros, porque
los dos commits tocan solo `src/screens/meal-schedule/index.test.tsx`.

- [x] Enmienda E2 aprobada por humano (fecha: 2026-10-02, en el chat del leader; commit de firma: el que marca esta casilla)

## Enmienda E3 — «rehabilitar solo cuando hayan terminado los dos» sin candado

El reviewer rechazó #147 por segunda vez en `c918e756`
(`progress/review_mobile-meal-schedule-editing.md` §Ronda 2, R2-Observaciones 1).
E2 cerró las 13 sondas de la ronda 1, pero queda una tercera cláusula de R7 sin
candado: el paso 3 del **WHEN** ok («rehabilitar los controles solo cuando hayan
terminado los dos») y el **WHILE** «hasta que terminan los refetch». Con
cualquiera de estas dos mutaciones en la rama `ok` de `runMealTimeEdit`,
`src/screens/meal-schedule` queda en 54/54 verde:

| Mutación | Qué rompe |
|---|---|
| `setEditing(false)` entre `await plan.refetch()` y `await queryClient.refetchQueries({ queryKey: petKeys.detail(petId) })` | rehabilita antes de que termine el refetch del detalle de la mascota |
| `void queryClient.refetchQueries({ queryKey: petKeys.detail(petId) })` (sin `await`) | no espera al refetch del detalle de la mascota |

Los `it` que retienen algo tras el ok (R7 it 3 y E2-b it 3) solo retienen la
segunda llamada a `getNutritionPlan`. Ningún test retiene la segunda llamada a
`getPet`, así que la ventana entre el fin de un refetch y el del otro no la mira
nadie. La producción cumple R7. El hueco vuelve a estar en [[tasks]] §R7 y
§Enmienda E2, que solo prescribieron retener el refetch del plan.

R7 no cambia. Esta enmienda solo añade el candado que falta.

### E3.1 — los controles esperan también al refetch de la mascota

**WHEN** se cierra #147, **THE SYSTEM SHALL** tener en
`describe('#147 R7: …')` dos `it` más, uno por flujo (Editar sobre
`meal-time-edit-1` y Añadir sobre `add-meal-time-button`). Cada uno retiene la
**segunda** llamada a `getPet` y comprueba tres cosas:

- con el plan ya repintado, todos los controles siguen con
  `accessibilityState.disabled === true`;
- `getPet` se llamó 2 veces;
- los controles se rehabilitan al resolver esa llamada.

Las ediciones literales, el mensaje de commit y las sondas están en [[tasks]]
§Enmienda E3. Las cifras pasan de 88 suites / 1762 tests a **88 suites / 1764**.
La lista cerrada de [[design]] §Archivos afectados no cambia: siguen siendo 13
ficheros, porque el commit toca solo `src/screens/meal-schedule/index.test.tsx`.

- [x] Enmienda E3 aprobada por humano (fecha: 2026-10-03, en el chat del leader; commit de firma: el que marca esta casilla)

## Enmienda E4 — cinco ramas sin candado en R3, R5, R7 y R8, con barrido completo

El reviewer rechazó #147 por tercera vez en `57757499`
(`progress/review_mobile-meal-schedule-editing.md` §Ronda 3, R3-Observaciones 1)
por dos ramas sin candado. Antes de firmar esta enmienda se le pidió un
**barrido exhaustivo** de R1–R9 y E1–E3: cada cláusula que cuantifica sobre
varios casos, con su candado por rama. El barrido está en el mismo fichero,
§Pre-verificación del borrador E4 y barrido de cláusulas, y encontró 3 ramas
más. Las cinco son de la misma familia: un «o», una tabla heredada o una fila
`i` candados en un solo miembro. Con cada una de estas mutaciones, la suite
dirigida queda en verde:

| # | Cláusula | Rama candada | Rama ciega | Mutación que hoy pasa en verde |
|---|---|---|---|---|
| E4.1 | R7 **WHILE**: «ni la hora nueva ni la fila nueva aparecen antes de que el refetch resuelva» | Añadir | Editar | tras el ok de `moveMealTime`, `setQueryData` del plan cambia `19:30` por `20:05` antes del refetch |
| E4.2 | R8: «**WHEN** empieza una nueva llamada de R5 **o** R6 … quitar el `meal-time-error` anterior» | R5 | R6 | `setEditError(null)` solo antes de la llamada de Editar |
| E4.3 | R3: `moveMealTime` mapea con «la misma tabla de R2» | 400, 403, 401, 422 `MEAL_TIME_NOT_IN_PLAN`, 422 `MEAL_TIME_DUPLICATE`, otro status, rechazo, sin `baseUrl` | 422 `NUTRITION_PLAN_REQUIRED`, 422 `MEAL_TIMES_LIMIT_REACHED`, 422 con otro código, 422 con body no JSON | una envoltura del retorno de `moveMealTime`, o una rama `okStatus === 200` dentro del bloque 422 de `editMealTimeState` |
| E4.4 | R5: el selector se abre con la hora de la **fila i**, y esa hora es el `from` del PATCH | i = 1 (la última fila) | cualquier otra fila | `onPress` abre el selector con la última franja del plan, sea cual sea la fila |
| E4.5 | R8: «**IF** la llamada devuelve `unauthorized`» (la llamada de R5 o R6): `signOut()` sin mensaje | R5 | R6 | el callsite de Añadir convierte `unauthorized` en `{ kind: 'error' }` |

La producción cumple las cinco. El hueco está en [[tasks]], que prescribió un
solo miembro en cada caso. R1–R9 no cambian. Esta enmienda solo añade los
candados que faltan.

Según el barrido, con estos cinco candados no queda ninguna otra rama sin
candado en R1–R9 y E1–E4. El reviewer clasificó como **no bloqueantes** cuatro
puntos y se comprometió a no bloquear por ellos en la ronda 4:

- R1: los literales de design.md;
- R4: un solo representante de `kind` distinto de `ok`;
- R7: la hora nueva en Añadir durante el refetch del plan;
- R7: el orden plan → mascota frente a `Promise.all`. La letra de R7 solo exige
  «rehabilitar cuando hayan terminado los dos», y eso ya está candado.

### E4.1 — Editar no repinta la lista mientras el refetch del plan sigue retenido

**WHEN** se cierra #147, **THE SYSTEM SHALL** comprobar en
`it('los controles siguen deshabilitados hasta que termina el refetch')` del
`describe('#147 R7: …')` dos cosas mientras la segunda llamada a
`getNutritionPlan` sigue retenida:

- `20:05` no aparece;
- la fila 1 sigue mostrando `19:30`.

### E4.2 — una nueva llamada de Añadir también retira el error

**WHEN** se cierra #147, **THE SYSTEM SHALL** tener en
`describe('#147 R8: …')` un `it` espejo de
`it('una nueva edición retira el error anterior')`. Provoca el error con
Editar, lo retira con una nueva llamada de Añadir y comprueba que
`meal-time-error` desaparece mientras esa llamada vuela.

### E4.3 — `moveMealTime` recorre las cuatro filas de R2 que faltaban

**WHEN** se cierra #147, **THE SYSTEM SHALL** tener en
`describe('#147 R3: …')` de `src/api/__tests__/nutrition.test.ts` un
`it.each` sobre `moveMealTime` con cuatro filas:

| Respuesta | Resultado |
|---|---|
| 422 `NUTRITION_PLAN_REQUIRED` | `unprocessable` con ese código |
| 422 `MEAL_TIMES_LIMIT_REACHED` | `unprocessable` con ese código |
| 422 con otro código | `error` |
| 422 con body no JSON | `error` |

### E4.4 — Editar en la primera fila

**WHEN** se cierra #147, **THE SYSTEM SHALL** tener en
`describe('#147 R5: …')` un `it` que pulsa `meal-time-edit-0` y comprueba dos
cosas:

- el selector se abre a las 07:30;
- al elegir otra hora, `moveMealTime` recibe `'07:30'` como `from`.

### E4.5 — 401 en Añadir

**WHEN** se cierra #147, **THE SYSTEM SHALL** tener en
`describe('#147 R8: …')` un `it` en el que `addMealTime` devuelve
`unauthorized`. Debe comprobar cuatro cosas:

- `signOut()` se llama una vez;
- los controles se rehabilitan;
- no hay `meal-time-error`;
- no hay refetch.

Las ediciones literales, los mensajes de commit y las sondas están en [[tasks]]
§Enmienda E4.

- **Cifras.** Pasan de 88 suites / 1764 tests a **88 suites / 1771**: +1 de
  E4.2, +4 de E4.3, +1 de E4.4 y +1 de E4.5. E4.1 solo añade aserciones.
- **Lista cerrada.** La de [[design]] §Archivos afectados no cambia: siguen
  siendo 13 ficheros. Los commits tocan solo
  `src/screens/meal-schedule/index.test.tsx` y
  `src/api/__tests__/nutrition.test.ts`, que ya están en ella.

- [x] Enmienda E4 aprobada por humano (fecha: 2026-10-03, en el chat del leader; commit de firma: el que marca esta casilla)

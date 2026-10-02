---
feature: "mobile-meal-schedule-editing"
status: approved     # draft | approved
tags: [harness, spec, mobile]
---

# Diseño — [[mobile-meal-schedule-editing]] (#147)

> Ver [[requirements]] para los requisitos y [[tasks]] para el orden
> test-primero. Las reglas de capas vienen de
> [[../../docs/architecture|architecture]] y las de UI de
> [[../../docs/ui-guidelines|ui-guidelines]]. Si algo de este documento choca
> con la carta, gana la carta.

## Skills cargadas al escribir la spec

| Nuestra skill (plugin `expo` 1.13.6) | Nombre en Codex (`leader.md` §Catálogo real) | Qué se tomó de ella |
|---|---|---|
| `expo:expo-overview` | (es un enrutador y no tiene equivalente) | Usar la documentación de la SDK fijada (57) y no instalar nada (no hay dependencias nuevas) |
| `expo:expo-ui` | `expo-ui-jetpack-compose` (la prueba de humo es en Android) | El selector de hora es el wrapper community de `@expo/ui` dentro de `Host`. Su ruta en el repo lleva guion (`datetime-picker`), ver §Discrepancias D6 |
| `expo:expo-native-ui` | `building-native-ui` | `<Text selectable>` en los errores, `gap` y no márgenes, `ScrollView` existente con `contentInsetAdjustmentBehavior="automatic"` |
| `expo:expo-data-fetching` | `native-data-fetching` | Mientras se guarda, desactivar el reenvío. Si falla, error en línea. Los refetch conservan el contenido de caché (R7, R8) |
| `appllama-app-design-skill` (`.agents/skills/`, obligatoria según la carta) | igual | Native fidelity law 2 (selector nativo). Anti-slop law 8 (errores en línea y concretos). Su ley «Optimistic by default» se **descarta**: la entrada #147 cierra «sin estado optimista» y la carta gana a la skill (`ui-guidelines.md`, primer límite). Su simulator loop no aplica: la verificación es §Prueba de humo en Android |

Al hacer el handoff, el leader debe nombrar a Codex `building-native-ui`,
`native-data-fetching`, `expo-ui-jetpack-compose` **y**
`appllama-app-design-skill`, no solo las del plugin. Ver `leader.md` §Los huecos.

## Decisiones técnicas

Las marcadas con **(gate)** las tomó el spec_author y no estaban cerradas en la
entrada. Son las que el humano debe mirar.

- **D1. Origen del rol: query `petKeys.detail(petId)` vía `getPet`, como en
  geofences (#41).** Se descartó leer `myRole` de `useSelectedPet()`: la
  pantalla ya recibe `petId`, y `refetchQueries(petKeys.detail)` de R7 refresca
  justo esa query, que es la misma que lee la Home. La pantalla usa
  `const isOwner = pet.data?.kind === 'ok' && pet.data.pet.myRole === 'owner';`,
  copiado literalmente de `src/screens/geofences/index.tsx`. Sirve a R4 y R7.
- **D2. Un único selector para editar y añadir.** El estado local es
  `picker: { from: string | null } | null`, donde `from === null` significa
  añadir. Se descartó tener un selector por fila: dejaría varios
  `meal-time-picker` montados y complicaría R5. Sirve a R5 y R6.
- **D3. Al elegir la misma hora no se llama al backend. (gate)** El backend
  respondería `422 MEAL_TIME_DUPLICATE` (destino igual a origen), y enseñar
  «Ya hay una comida a esa hora» por no haber cambiado nada sería un error
  falso. Sirve a R5.
- **D4. El selector de Añadir comida arranca a las 12:00 locales. (gate)**
  add-reminder arranca a las 09:00. Para una comida nueva, el mediodía es el
  punto neutro entre las dos franjas típicas (07:30 y 19:30). Sirve a R6.
- **D5. La hora se lee en local (`getHours`/`getMinutes`) y se escribe con dos
  dígitos.** Las horas del plan son de pared, no instantes (#103), así que
  nunca se usa `toISOString` ni los getters UTC. Los tests lo fijan con
  `TZ=America/Mexico_City` y con getters UTC cruzados (ver [[tasks]] §Técnica TZ).
  Sirve a R5 y R6.
- **D6. Solo se refetchea cuando la llamada tiene éxito. (gate)** `toggleMeal`
  refetchea siempre, incluso cuando falla. Aquí no se hace porque un refetch
  tras un `unreachable` fallaría igual y cambiaría la lista por el estado de
  error global de la pantalla, borrando el mensaje en línea de R8. El coste es
  que, tras `MEAL_TIME_NOT_IN_PLAN` (otra persona movió la franja), la lista
  queda desfasada hasta el siguiente montaje. Queda en §Fuera de alcance como
  deuda candidata. Sirve a R7.
- **D7. `Añadir comida` no se desactiva con 6 franjas. (gate)** El límite es
  regla del backend y el cliente no la duplica: con 6 franjas, el `422` da
  «El plan ya tiene el máximo de 6 comidas». Sirve a R8.
- **D8. La etiqueta visible de cada fila es `Editar` y la hora va solo en el
  `accessibilityLabel`. (gate)** La hora ya está visible en la misma fila.
  Repetirla en el botón haría la fila demasiado ancha en 360 dp. El lector de
  pantalla necesita la hora para distinguir los botones. Sirve a R4.
- **D9. Un solo mensaje de error para toda la sección, justo encima de
  `Añadir comida`, en texto y no en `Alert`. (gate)** Es coherente con
  `generate-plan-error`, que también va encima de su botón, y con
  `geofences-action-error`. Se descartó un error por fila porque los errores
  de añadir no pertenecen a ninguna fila. Sirve a R8.
- **D10. No hay háptica ni estado de «servida» en meal-schedule. (gate)**
  Ningún criterio de la entrada los pide, y la servida vive en Food (#98).

## API móvil (`src/api/nutrition.ts`)

Firmas exactas que hay que exportar:

```ts
export type MealTimeErrorCode =
  | 'NUTRITION_PLAN_REQUIRED'
  | 'MEAL_TIME_NOT_IN_PLAN'
  | 'MEAL_TIME_DUPLICATE'
  | 'MEAL_TIMES_LIMIT_REACHED';

export type EditMealTimeState =
  | { kind: 'ok' }
  | { kind: 'invalid' }
  | { kind: 'forbidden' }
  | { kind: 'unprocessable'; code: MealTimeErrorCode }
  | { kind: 'unauthorized' }
  | { kind: 'error' }
  | { kind: 'unreachable'; message: string }
  | { kind: 'missing-config' };

export function addMealTime(
  baseUrl: string | undefined, token: string, petId: string,
  mealTime: string, fetchFn?: typeof fetch,
): Promise<EditMealTimeState>;

export function moveMealTime(
  baseUrl: string | undefined, token: string, petId: string,
  from: string, to: string, fetchFn?: typeof fetch,
): Promise<EditMealTimeState>;
```

- `fetchFn` vale `fetch` por defecto, como en `serveMeal`.
- Se reutilizan `postJson` y `patchJson` de `src/api/http.ts`. Hay que añadir
  `patchJson` al `import` de `nutrition.ts`, que hoy importa
  `{ deleteJson, getJson, postJson, readJson }`.
- El estado de transporte (`missing-config`, `unreachable`) sale del resultado
  de `postJson`/`patchJson`, igual que en `serveMeal`.
- La traducción del `Response` vive en un **único helper privado**,
  `editMealTimeState(response: Response, okStatus: 200 | 201): Promise<EditMealTimeState>`.
  Se modela sobre `writeState(response, okStatus)` de `src/api/geofences.ts`,
  añadiendo el `422` con lectura de `code` mediante `readJson` y el
  `isObjectBody` que ya existe en el fichero.
- Un `422` cuyo `code` no está entre los cuatro conocidos devuelve `error`.

Es lo mismo que hace `geofences.ts` (#41): un estado de escritura con forma de
unión discriminada, un helper privado con `okStatus` y ninguna clase de error.

## Pantalla (`src/screens/meal-schedule/index.tsx`)

### Estado y handler

- `const queryClient = useQueryClient();` y
  `const pet = useQuery({ queryKey: petKeys.detail(petId), queryFn: () => getPet(baseUrl, token ?? '', petId) });`,
  igual que en geofences.
- Estado local:
  - `editing: boolean`;
  - `editError: string | null`;
  - `picker: { from: string | null } | null`.
- `async function runMealTimeEdit(request: () => Promise<EditMealTimeState>)` sigue
  la forma de `write` en geofences:
  1. `setEditing(true)` y `setEditError(null)`.
  2. Dentro de `try`, un `switch (result.kind)`:
     - `ok`: `await plan.refetch(); await queryClient.refetchQueries({ queryKey: petKeys.detail(petId) });`;
     - `invalid`: `t('mealSchedule.errorInvalidTime')`;
     - `forbidden`: `t('mealSchedule.errorEditForbidden')`;
     - `unprocessable`: un `switch (result.code)` con **cuatro** llamadas
       literales a `t('mealSchedule.error…')`;
     - `unauthorized`: `await signOut()`;
     - `unreachable`: `t('common.cannotReachServer')`;
     - `error` y `missing-config`: **una** llamada `t('common.somethingWentWrong')`.
  3. En el `catch`, **otra** llamada `t('common.somethingWentWrong')`.
  4. En el `finally`, `setEditing(false)`.

  Todas las claves se llaman como `t('literal')`. No se usa un mapa de claves,
  porque los candados de `ui-language.test.ts` cuentan con la regex
  `\bt\(\s*['"]key['"]`.
- Dos funciones puras privadas a nivel de módulo:
  - `pickerValue(mealTime: string): Date` devuelve `new Date()` con
    `setHours(h, m, 0, 0)`;
  - `toMealTime(date: Date): string` devuelve `HH:MM` con
    `String(...).padStart(2, '0')` sobre `getHours()` y `getMinutes()`.
  `Añadir comida` usa `pickerValue('12:00')`.
- `onValueChange(_event, selected)`:
  1. guarda el `picker` actual y llama a `setPicker(null)`;
  2. calcula `toMealTime(selected)`;
  3. si `from === null`, llama a `runMealTimeEdit(() => addMealTime(...))`;
  4. si no, y la hora es distinta de `from`, llama a
     `runMealTimeEdit(() => moveMealTime(..., from, hora))`;
  5. si es la misma hora, no hace nada más.
- `onDismiss` hace `setPicker(null)`.

### Anatomía: hijos de `meal-times-section` (se cuentan por `children`, no por testID)

| # | Hijo | Condición |
|---|---|---|
| 1 | `Text` del título `t('mealSchedule.timesAndPortions')`, sin cambios y sin testID | siempre |
| 2..n+1 | `Card` `meal-time-row-${index}`, una por franja | siempre |
| n+2 | `Text` `meal-time-error` | `isOwner && editError !== null` (solo puede existir siendo owner) |
| último | `Button` `add-meal-time-button` | `isOwner` |

Con 2 franjas, la sección tiene estos hijos:

- owner sin error: 4;
- owner con error: 5;
- cualquier otro caso: 3.

El `Host` del selector **no** va dentro de la sección. Es su hermano
inmediatamente posterior, dentro del mismo fragmento, para que abrir el
selector no cambie la cuenta de hijos.

### Anatomía: hijos de cada fila `meal-time-row-${index}`

| # | Hijo | Cambia con #147 |
|---|---|---|
| 1 | `View` del icono `Clock` | no |
| 2 | `Text` `{mealTime}` con `flex-1 font-bold text-foreground` | no |
| 3 | `Text` `{portionGrams} g` con `font-semibold text-muted` | no |
| 4 | `Button` `meal-time-edit-${index}` | **nuevo**, solo si `isOwner` |

### Decisiones de cada control (todas, por elemento repetido)

| Decisión | `meal-time-edit-${index}` (por fila) | `add-meal-time-button` | `meal-time-error` |
|---|---|---|---|
| Componente | heroui `Button` | heroui `Button` | RN `Text` |
| Dato | `mealTime` de **su** fila (a11y y `from`) | ninguno | el literal de R8 |
| Icono | ninguno | ninguno | ninguno |
| Etiqueta visible | `t('mealSchedule.editTime')` (`Editar`) | `t('mealSchedule.addMeal')` (`Añadir comida`) | — |
| Nombre a11y | `t('mealSchedule.editTimeLabel', { time: mealTime })` | la etiqueta visible | el texto |
| `variant` / `size` | `secondary` / `sm` | `secondary` / sin `size` | — |
| `className` del raíz | `min-h-11 rounded-xl bg-accent-soft` | `rounded-xl bg-accent-soft` (receta de `add-pet-photo`) | `text-danger` |
| `className` de `Button.Label` | `font-semibold text-accent-strong` | `font-bold text-accent-strong` | — |
| `selectable` | — | — | `true` |
| Deshabilitado | `isDisabled={editing}` | `isDisabled={editing}` | — |
| Condición de render | `isOwner` | `isOwner` | `editError !== null` |
| Posición | 4.º y último hijo de su `Card` | último hijo de la sección | penúltimo hijo de la sección |
| Feedback al pulsar | el de heroui (`pressable-feedback`) | ídem | — |

Los tests aseveran sobre las clases **propias** con
`expect.arrayContaining(className.split(' '))`, no sobre el `className` completo.
En la base no hay ningún test que fije cómo compone heroui las clases de
`variant="secondary"`, y no se inventa ese literal.

## Copy y candados de idioma

- **Catálogo**: se añaden 9 claves en `en` y 9 en `es`, justo después de
  `'mealSchedule.noNutritionProfileYet'` en cada bloque. Al terminar, cada
  idioma pasa de 320 a 329 claves.
- **`language-provider.test.tsx`**: a la línea de la suma que empieza por
  `260 + 16 + 1 + 4 + 7 + 14 + 2 + 1 + 4 - 6 + 1 + 2 + 3 + 11` se le añade
  `+ 9` al final. El comentario de encima suma `+ 9 de #147 R1 (mealSchedule.* del horario editable)`.
- **`specs/mobile-ui-language/design.md`**: se añade la sección
  `### §2.16 — Añadidos por #147 — Horario de comidas editable` justo antes de
  `## 3.`. Las filas siguen el formato de §2.15:
  `` | — | `clave` | `en` | `es` | ← añadida por #147 (R1) ``, y la clave
  paramétrica lleva **(param)**.
- **`ui-copy-table.ts`**: se añaden 12 filas al final de `R6_FOOD`:
  - 3 de `common.*`, en el commit de test de R8;
  - 9 de `mealSchedule.*`, en el commit de implementación de R9, en el orden
    de §Copy nueva.
  Todas llevan `file: 'src/screens/meal-schedule/index.tsx'`.
- **`ui-language.test.ts`**: `it('resuelve las 38 ocurrencias normativas')`
  pasa a 41 en R8 y a 50 en R9, y su `toHaveLength` suma `+ 3` y `+ 9` con
  comentario. Se añade un `describe('#147 R9: …')` modelado sobre
  `#98 R9`. `SCREEN_FILES` no cambia, porque meal-schedule ya está.

### Conflicto previsto con #146 (`origin/feature/146-mobile-geofence-editor`)

Medido con `git diff --name-only cb14497c...origin/feature/146-mobile-geofence-editor`.
#146 toca `catalog.ts`, `language-provider.test.tsx`, `ui-copy-table.ts`,
`ui-language.test.ts` y `specs/mobile-ui-language/design.md`. Los solapes reales son:

1. **La línea de la suma.** #146 la deja en `… + 11 + 12 + 2,`. Si #146 mergea
   antes, la suma de #147 se rehace sobre la base nueva añadiendo **solo**
   `+ 9`: `… + 11 + 12 + 2 + 9,` (343). El recuento se vuelve a medir sobre la
   base nueva y no se toma de esta spec.
2. **La sección de design.md.** #146 ocupa `§2.16 — Añadidos por #146`. Si
   mergea antes, la sección de #147 pasa a ser el siguiente §2.N libre. El
   número no lo asevera ningún test: las regex buscan `← añadida por #147 (R1)`.
3. **Los `describe` añadidos al final de `language-provider.test.tsx` y de
   `ui-language.test.ts`.** Es un conflicto textual de append. Se conservan
   los dos bloques.

4. **Enmienda E1.** #146 también toca los dos ficheros de E1.
   - En `consistency-classnames.test.ts` cambia la línea de
     `rounded-xl bg-accent`, que es la anterior a la de `bg-accent-soft`, así
     que el conflicto textual está garantizado. Se conservan las dos
     ediciones.
   - En `design-drift.test.ts` añade
     `'screens/geofence-editor/index.tsx': 1` al mismo objeto
     `screenSignOutCalls`. Se conservan las dos entradas.

#146 no toca `R6_FOOD` (añade su propio bloque `R15_GEOFENCE_EDITOR`), ni
`nutrition.ts`, ni la pantalla. La regla es la misma que la de la memoria
«Reparto de ficheros caduca al mergear»: el que mergea segundo rebasa y vuelve
a medir.

## Archivos afectados (lista cerrada, medida desde el hash del handoff)

El móvil es un cliente sin capas domain/application/infrastructure. Se sigue
`docs/conventions.md`: route delgado + `src/screens/`, y la API en `src/api/`.

| Fichero | Capa móvil | Cambio | R |
|---|---|---|---|
| `mobile-pet-tracker/src/api/nutrition.ts` | api | `MealTimeErrorCode`, `EditMealTimeState`, `addMealTime`, `moveMealTime`, helper privado y `patchJson` en el import | R2, R3 |
| `mobile-pet-tracker/src/api/__tests__/nutrition.test.ts` | test | `describe` de R2 y R3 | R2, R3 |
| `mobile-pet-tracker/src/screens/meal-schedule/index.tsx` | screen | query de la mascota, `isOwner`, controles, selector, handler y error | R4-R8 |
| `mobile-pet-tracker/src/screens/meal-schedule/index.test.tsx` | test | mocks de `pets` y `@expo/ui`, `addMealTime`/`moveMealTime` en el mock de `nutrition`, `describe` de R4-R8 | R4-R8 |
| `mobile-pet-tracker/src/i18n/catalog.ts` | i18n | 9 claves por idioma | R1 |
| `mobile-pet-tracker/src/providers/__tests__/language-provider.test.tsx` | test | `+ 9` en la suma y `describe('#147 R1')` | R1 |
| `mobile-pet-tracker/src/__tests__/ui-copy-table.ts` | test | 12 filas en `R6_FOOD` | R8, R9 |
| `mobile-pet-tracker/src/__tests__/ui-language.test.ts` | test | longitud de `R6_FOOD` y `describe('#147 R9')` | R8, R9 |
| `mobile-pet-tracker/src/__tests__/consistency-classnames.test.ts` | test | `bg-accent-soft` 16 → 16 + 2 en `#98 R10` y `#64 R9` (Enmienda E1) | R4 |
| `mobile-pet-tracker/src/__tests__/design-drift.test.ts` | test | `signOut(` de meal-schedule 1 → 2 en `#87 R19` (Enmienda E1) | R8 |
| `specs/mobile-ui-language/design.md` | spec | §2.16 con 9 filas | R1 |
| `specs/mobile-meal-schedule-editing/traceability.md` | spec | la rellena Codex | — |
| `progress/impl_mobile-meal-schedule-editing.md` | progress | el informe de Codex | — |

Son 13 ficheros desde la Enmienda E1; en la firma eran 11. No se toca nada más. En particular quedan fuera `src/api/http.ts`, `src/api/pets.ts`,
`src/api/query-keys.ts`, `src/app/**`, `package.json`, `bun.lock` y
`backend-pet-tracker/**`.

## Alternativas descartadas

- **`useMutation` de TanStack**: el repo no lo usa en ningún sitio, y
  `toggleMeal`/`handleGenerate`/geofences resuelven lo mismo con un handler
  imperativo y un estado `busy`. Meter el patrón ahora sería una segunda forma
  de hacer lo mismo.
- **Actualización optimista con `setQueryData`**: la entrada la prohíbe. Además,
  el backend reordena las horas y mueve la servida, y replicar eso en el cliente
  duplicaría la regla de #103.
- **Usar el plan de la respuesta `201`/`200` como nuevo dato de la query**: esa
  respuesta no trae `servedToday` (`toNutritionPlanResponse`), y la Home
  necesita el refetch de `petKeys.detail` de todas formas.
- **`Alert.alert` para los errores**: interrumpe y no se puede seleccionar. La
  carta pide `<Text selectable>` para los errores.
- **Un selector por fila**: ver D2.
- **Refetch también en los errores**: ver D6.
- **Desactivar `Añadir comida` con 6 franjas**: ver D7.
- **Un route nuevo (modal o sheet) para editar**: un selector nativo en diálogo
  ya es la «interrupción breve» que pide la navigation law de appllama, y un
  route nuevo obligaría a tocar `src/app/_layout.tsx`, que #146 también modifica.

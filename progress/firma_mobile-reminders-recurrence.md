# Auditoría de firma delegada — #213 mobile-reminders-recurrence

- Spec: `specs/mobile-reminders-recurrence/` @ 2dab13f3 (branch feature/213-mobile-reminders-recurrence)
- Base: origin/dev 8b4cb1bd (congelada: sin fetch ni checkout)
- Auditor: subagente de solo lectura (no firma; decide el leader)
- Estado: TERMINADO. 8 fallos bloqueantes (F1–F8) y 16 avisos (A1–A16).
  Veredicto del auditor: no firmable tal cual; firmable tras aplicar las erratas de F1–F8.
- Sin cambios en ficheros tracked salvo este informe. Las mutaciones van en
  `/tmp/claude-1002/-home-claude-sites-Pet-Tracker/54341eda-28f1-4262-9348-c2fbc9852939/scratchpad/audit213/`.
- Todos los `grep` se corren desde `mobile-pet-tracker/` del worktree
  `/home/claude/sites/Pet-Tracker-wt-213` (HEAD 2dab13f3, árbol de app = 8b4cb1bd).

## Resultados por punto

### 1. Checklist de firma (plan_canvas-parity §4 + plan_mejoras §4)

| Punto | Resultado |
|---|---|
| Anclas `grep -cF` con cifra, sin números de línea | Falla R19 (F1); las demás cuadran (§2) |
| Cada R-id tiene un test nombrado y una fila en traceability | OK: R1–R22 tienen al menos un `#213 R<n>:` con fichero exacto; traceability.md tiene 22 filas |
| Candados no tautológicos | Sin candados contra símbolos importados. La receta de chips de R4 no tiene candado (A13) |
| Clases y filas nuevas contadas contra los guards | Parcial. ui-copy-table, #194 R1, iconos y radios de design-drift están contados. F3, F6 y A7 cubren el resto (§4) |
| Copy literal desde el R-id y en Voz B | OK en R4–R18 (literales es-MX). El copy sin artboard queda fuera de G1 (A4) |
| Artboards congelados en `canvas/` | OK: 4 ficheros con sha256 que cuadran con design.md. Versión servida ≠ v140 (A3) |
| Ninguna decisión abierta | OK: sin TBD. «Copy sin artboard» y «Desviaciones del artboard» llevan su motivo |
| Ni costo ni dependencia nueva | OK (§12) |
| plan_mejoras: migración backend / 404 que delata existencia | No aplica: #213 es solo móvil y consume #210 (§11) |

### 2. Anclas grep

Medidas en la base (antes de implementar):

| Ancla de la spec | Esperado tras implementar | Base medida | Veredicto |
|---|---|---|---|
| R1 `grep -cF "recurrenceUntil: string \| null" src/api/types.ts` | 1 | 0 | OK (delta +1) |
| R3 `grep -cF "export async function cancelReminderSeries" src/api/reminders.ts` | 1 | 0 | OK (delta +1) |
| R5 `grep -cF "flex-row flex-wrap gap-2" src/screens/add-reminder/index.tsx` | 1 | 2 | OK (−2 Tipo/Aviso, +1 Repetición) |
| R15 `grep -cF "rounded-14 px-2.5" src/screens/reminders/index.tsx` | 1 | 1 | OK (un solo `<Button>`) |
| R19 `grep -cF "backgroundStyle" src/screens/reminders/index.tsx` | 1 tras merge de #218 | 0 en base; 1 en wt-218 HEAD e3def8e3 | OK |
| R19 `grep -cF "<BottomSheet" src/screens/reminders/index.tsx` | 1 tras merge de #218 | **2** en base y en wt-218 | **ROTA**: cuenta también `<BottomSheetView>` (ver F1) |
| R22 `grep -cF "// #213 R22" src/__tests__/ui-copy-table.ts` | 56 | 0 (56 en la semilla) | La cifra cuadra con +56, pero esas 56 filas no cubren el handler calcado (F3) |

### 3. Rutas

- `src/api/types.ts`, `src/api/reminders.ts`, `src/api/http.ts` (`patchJson`),
  `src/api/query-keys.ts` (`petKeys.list`, `reminderKeys.list`),
  `src/utils/civil-date.ts` (`localDateToIso`, `isoToLocalDate`),
  `src/utils/reminder-dates.ts` (`daysUntil(from, to)`),
  `src/hooks/use-push-registration.ts`, `src/screens/add-reminder/index.tsx`,
  `src/screens/reminders/index.tsx` y sus tests existen en la base. OK.
- Ficheros de test nuevos: ninguno; todos los `it` van a ficheros existentes. OK.

### 4. Inventarios y candados agregados

- `checkUses` (`src/__tests__/ui-language.test.ts`:44) cuenta por par
  (fichero, clave) las llamadas `t('<clave>'` más las `labelKey: '<clave>'`.
  Cada fila de `R8_REMINDERS` es una ocurrencia. Ver F3.

**Semilla.** Copia `git archive 8b4cb1bd` en el scratchpad (`audit213/seed/`).
Lleva una implementación mínima que sigue la spec al pie de la letra:
- las clases y recetas de design.md:70-90;
- la hoja de cancelar «con la receta» del borrado;
- un handler calcado del borrado (R18);
- las 56 filas de R22.

Se le aplicaron solo las enmiendas que `tasks.md` §R22 prescribe (`amend.py`).

Comando, sin pipe:
```
timeout 590 bunx jest src/__tests__ src/providers/__tests__/language-provider.test.tsx \
  src/screens/add-reminder src/screens/reminders src/hooks/use-push-registration.test.tsx
Test Suites: 7 failed, 32 passed, 39 total
Tests:       25 failed, 1154 passed, 1179 total
```
En la base estas suites están verdes. Los rojos se reparten así:

| Suite:línea | `it` | Base → semilla | Causa en la spec | ¿Listado en tasks.md? |
|---|---|---|---|---|
| ui-language:180 y :502 | `#186 R5` y `#65 R18` | `common.somethingWentWrong` en reminders 4 → 5 | handler de R18 calcado del borrado | No: contradice +56 (F3) |
| add-reminder.test:206 y :292 | `renders all reminder types…`, `renders alert choices…` | 7 → 8, 4 → 5 | testID `*-chip-row` | No (F6) |
| reminders.test | 6 `it` de R16 | badge | R16 | Sí (tasks.md:123-128) |
| reminders.test:1338 | `#178 R7 … reserva el pop para la fila próxima y lo omite en la lejana` | `Unable to find … reminder-upcoming-pop-a` (fixture `a` vence el 2 ene y hoy es el 30 dic: 3 días) | R16 | No nombrado; sí lo cubre la regla genérica tasks.md:129 (A6) |
| consistency-classnames:300 | `#62 R14 … add-reminder importa y aplica sus 2 esquinas` | 2 → 3 | design.md:75 `style={CONTINUOUS_CORNER}` | Regla genérica tasks.md:171 (A7) |
| consistency-classnames:326 | `#62 R14 … fusiona la esquina…` | 55 → 56 | ídem | ídem |
| consistency-classnames:426 | `#98 R10 … deja CONTINUOUS_CORNER…` | 53 → 54 | ídem | ídem |
| consistency-classnames:661 | `#166 R3 … cinco secundarios neutros` | `+ reminders-cancel-series-keep` | R17 «receta del cancel de borrar» | ídem |
| consistency-classnames:184 | `#62 R6 … variantes de posición` | `[] → ['screens/add-reminder/index.tsx']` | `\blast:` casa con `t('addReminder.dosesJoin', { …, last: … })` (design.md:226 `{{last}}`) | No (A8) |
| design-drift:666 | `#87 R19 … mutation sign-out with zero delta` | `signOut(` en reminders 1 → 2 | R18 `unauthorized` → `signOut` | Regla genérica (A7) |
| design-drift:1234 | `#179 R13 … limita text-22…` | `+ screens/add-reminder/index.tsx` | design.md:79 `text-22` | Sí, como «inventarios de text-*» |
| alerts-canvas-fidelity:245 | `#174 R12 … limita text-15…` | `+ screens/add-reminder/index.tsx` | design.md:75 `text-15` | Sí, ídem |
| chunky-cta:147 | `#177 R4.3 … nueve secundarios neutros` | `+ reminders-cancel-series-keep` | R17 | Regla genérica (A7) |
| chunky-cta:169 | `#177 R6.2 recuentos de etiquetas` (`text-17`) | 30 → 32 | hoja R17 calcada | ídem; los `expect` siguientes del mismo `it` no se midieron |
| chunky-cta:178 | `#177 R7.1` `border-lip-gray` | 12 → 15 | stepper (design.md:77, ×2) + keep | ídem |
| chunky-cta:185 | `#177 R7.3` mapa `radii` | add-reminder 1 → 2, reminders 5 → 7 | mismo delta que tasks.md:170 enmienda en design-drift, pero esta es otra constante | No nombrado (A7) |
| chunky-cta:194 | `#177 R7.5` estilos | reminders 1 → 2 | keep con `chunkyLip.neutral` | Regla genérica (A7) |
| chunky-cta:203 | `#177 R8.1 solo la tabla recibe chunkyLip.neutral` | `+ reminders-cancel-series-keep` | ídem | ídem |

Verde con la semilla:
- `language-provider` (#194 R1 `+ 54`);
- `ui-copy-table`;
- design-drift de iconos y radios (las enmiendas de tasks.md:169-170);
- `use-push-registration`;
- `legibility`, `forms-validation-global`, `profile`, `routine` y `no-pets-states`.

La semilla no es la implementación de Codex. Las cifras de clases dependen de
cómo se calque la hoja, pero las causas sí son de la spec.

### 5. Selectores por prefijo o regex

- `/^type-chip-/` y `/^advance-chip-/` (add-reminder.test:206 y :292) casan
  con los testID nuevos de R5. La semilla lo confirma: 7 → 8 y 4 → 5 (F6).
- No casan con los testID nuevos de R4, R6, R7, R14, R15 o R17:
  - reminders.test:670 `/^reminder-row-/`;
  - :1790 (conjunto exacto);
  - :1832 `startsWith('reminders-entry-')`;
  - home `/^reminders-item-/`.

  La semilla deja verdes sus `it`.

### 6. Clases de color

- La semilla, con las clases de design.md:70-90, deja verdes:
  - `legibility-classnames`;
  - `design-drift` #193 R11 (grep-clean de Recordatorios);
  - `forms-validation-global`;
  - `canvas-foundations`.

  `-mr-5` está solo en add-reminder, fuera del alcance de #193 R11. OK.
- `useThemeColors`: la spec pide añadir `'accent-strong'` y nunca `'accent'`. OK.
  Quedan dos huecos:
  - los iconos `Minus`/`Plus` del stepper son `foreground` en el canvas, y la spec no dice de dónde sale ese color;
  - «el `useThemeColors` existente» es ambiguo tras #218 (A11).

### 7. Copy y ui-copy-table

- design.md §Copy:
  - 32 filas `addReminder.*` (195–226);
  - 22 filas `reminders.*` (227–248);
  - total 54, más `reminders.upcoming`, que cambia de valor.

  Cuadra con R22 y con `#194 R1 + 54` (verde en la semilla).
- #213 no crea bloque: añade filas a `R8_REMINDERS`, así que no choca con `R18_DATE_FIELD` (#220),
  `R19_VACCINE_CREATE` (#208), `R20_NUTRITION_QUESTIONNAIRE` (#209) ni
  `R21_PET_MEMBERS` (#214). OK.
- `checkUses` por bloque: la clave común `somethingWentWrong` cae (F3).

### 8. Choques con specs paralelas (#208, #209, #214, #218)

- #208 (wt-208 26a271b8, sin implementar):
  - llama `createReminder(baseUrl, token, petId, input)` con 4 claves (requirements.md:571). Sigue siendo válido porque R2 hace opcionales `recurrence`/`recurrenceUntil`;
  - su ancla `grep -cF 'className="rounded-xl bg-accent h-10 gap-1.5 px-3.5" style={chunkyLip.primaryCompact}' screens/reminders/index.tsx` = 1 sigue en 1 en la semilla. OK.
  - Riesgo: los fixtures `Reminder` tipados que #208 añada a sus tests romperán `tsc` cuando entre #213, porque R1 hace obligatorios los campos (A16).
- #209: solo comparte agregados (ui-copy-table, #194 R1, #186 R5, chunky-cta, consistency, design-drift). design.md:166-174 lo cubre: el segundo en mergear suma los deltas. OK.
- #214 (wt-214 02711b1e) comparte con #213 cuatro agregados, y design.md:166-174 no lo nombra:
  - `ui-copy-table` (bloque `R21_PET_MEMBERS`);
  - `ui-language`;
  - `consistency-classnames`: esquinas de `profile/index.tsx` `3 + 1 + 4 - 7`, que mueven los mismos totales 55 y 53 que #213 sube en +1 (§4);
  - `src/screens/home/index.test.tsx` (#213 añade `recurrence: null, recurrenceUntil: null` a sus fixtures).

  Ver A9.

- #218 (wt-218 HEAD e3def8e3, ya implementada): añade a
  `src/screens/reminders/index.tsx` `const [surface] = useThemeColors(['surface']);`
  (línea 63) y `backgroundStyle={{ backgroundColor: surface }}` (línea 417).
  Su guarda `src/__tests__/sheet-surface-background.test.ts`:49 cuenta
  `/<BottomSheet(?![A-Za-z])/g` = 1 y `split('backgroundStyle={{ backgroundColor: surface }}')` = 2.
  La hoja compartida de #213 R17 respeta esa guarda. Lo que no la respeta es
  el ancla grep de R19 (F1).

### 9. Tests (R-id ↔ it, candados, TZ, esperas)

- R3: la rama `fetch` que lanza → `{kind:'unreachable', message}` no tiene candado (F2).
- R13: de las tres ramas de la cláusula, solo «falla» tiene candado (F4).
- R18: la rama «la llamada lanza» no tiene fila (F5).
- R5: «5 chips de tipo» contra 7 reales (F7).
- R1: el `it` nace verde en jest (F8).
- Fechas: las tablas de R11 (a–j), R12 (a–h) y R14 (a–j) y el test de R16 cruzan mes y año
  (30/31 dic → 1/2 ene 2027). OK.
- TZ con `process.getBuiltinModule('process')` y `America/Mexico_City` (patrón de
  `#178 R12`, reminders.test:191 y add-reminder). OK.
- Literales `Intl` (node v20.20.2, ICU 78.2, es-MX): «2 ene 2027», «6 ene 2027»,
  «2 ene 2030», «30 jun 2027», «miércoles», «31 dic», «ene 2027», «abr 2027»,
  «20:00» y «04:00» salen tal cual. Falta una opción `Intl` (A2).
- Esperas: con timers falsos y TanStack, los nombres de mascota de R12, R13 y R17
  necesitan `findBy`/`waitFor` sobre el árbol (A5). R20 copia un patrón que espera
  al contador del mock (A14).
- Hay `it` que nacen verdes, aparte de R1 (A12).

### 10. Comentarios y títulos `#213 R<n>`

- Los 42 nombres `#213 R<n>:` de requirements.md llevan el R-id de su
  requisito. Las únicas referencias a otro R-id (`#194 R1`, `#178 R13`) están en R22
  y son guardas, no nombres. OK.
- Comentarios prescritos: solo `// #213 R22` (56 en la semilla). Ninguno lleva
  `#NNN` suelto que el `HEX_LITERAL` de design-drift tome por color: la
  semilla deja verde design-drift salvo :666 y :1234. OK.
- Las enmiendas se nombran «(enmendado por #213 R16)» / «(enmendado por #213 R22)». OK.

### 11. Backend #210

- `backend-pet-tracker/src/modules/reminders/infrastructure/reminders.controller.ts`:
  `@Controller('reminders')` + `@Patch(':id')` → coincide con `PATCH /reminders/${reminderId}` de R3.
- `application/dto/reminder.dto.ts`: `CancelReminderSchema` = `{status: literal 'cancelled'}` estricto
  → coincide con el cuerpo exacto `{"status":"cancelled"}`.
- `RecurrenceSchema`: hour 1–24, month 1–12 → coincide con los límites de R6 y R7.
  day/week/year se envían con `every: 1` (R10) → dentro de rango.
- `CreateReminderSchema`: `recurrence`/`recurrenceUntil` nullable y opcionales → el cuerpo de 4 claves de «Una vez» es válido.
- Mapper de respuesta: `recurrence {unit, every} | null` y `recurrenceUntil: … ?? null` → coincide con R1.
- Errores: 404, 403, 409 'Reminder is not editable', 400 'Invalid recurrence' → coinciden con el mapeo de R3.
- Push: `notifier-consumer.service.ts` envía `{petId, reminderId, kind:'reminder'}` → coincide con R20.
- plan_mejoras §4 (migración, 404 que delata existencia): #213 es solo móvil; no aplica.

### 12. Dependencias nuevas

- `node_modules/reicon-react-native/index.d.ts` exporta `Repeat`, `Minus` y `Plus`
  (2 apariciones cada uno). No hay paquete nuevo ni `expo-linear-gradient`.
  `BottomSheet` ya es `@expo/ui` y no añade módulo nativo, así que no hay gate de rebuild (G3).
  design.md:298 lo dice. OK.

### 13. Canvas (G1 v140)

- sha256 de los 4 ficheros de `canvas/` = los de design.md. OK.
- Copy y medidas presentes en el canvas congelado:
  - botones de 44px;
  - «Cada» 15px/800;
  - «8 horas» 22px/900;
  - ayuda 13px/600 muted;
  - min-width 84px;
  - radio 16;
  - «Cancelar<br>serie»;
  - «Se repite cada mes · hasta abr 2027»;
  - «Se repite cada 8 horas · hasta el 13 oct».

  OK.
- Versión: se pidió la v140 (`1793036268-d302`) y se sirvió una posterior
  (`1793050244-92d7` / `1793051574-af80`), design.md:16-19 (A3).

### 14. Literales, mocks y dobles

- Los mocks de `reicon-react-native` en add-reminder.test:30 y reminders.test:56
  hacen spread de `requireActual`, así que son abiertos: `Repeat`, `Minus` y `Plus`
  resuelven sin enmendar el doble. OK.
- `api/reminders` gana `cancelReminderSeries`. Los tests de R17 y R18 lo
  mockean, y la semilla con un stub tipa salvo por el propio stub. OK.
- R13 usa `useQuery(petKeys.list)` en add-reminder. Las rutas de
  `src/app/__tests__` montan el `RootLayout` real con `QueryProvider`
  (`src/app/_layout.tsx`:14 y 63-68), así que no cae ninguna. Usan el `listPets` real (A10).
- `useLocalSearchParams` / `petId` (R21): hoy no está ni en reminders/index.tsx
  ni en su test. tasks.md:157 prescribe que el doble de `expo-router` gane
  `useLocalSearchParams: () => mockSearchParams` con su reinicio en `beforeEach`. OK.

## Fallos bloqueantes

### F1. El ancla de R19 `grep -cF "<BottomSheet"` = 1 da 2

Cita (requirements.md:342-343):
> Ancla (tras el merge): `grep -cF "backgroundStyle" src/screens/reminders/index.tsx` = 1
> y `grep -cF "<BottomSheet" src/screens/reminders/index.tsx` = 1.

Comando y salida en la base:
```
$ grep -nF "<BottomSheet" src/screens/reminders/index.tsx
411:        <BottomSheet
417:          <BottomSheetView>
$ grep -cF "<BottomSheet" src/screens/reminders/index.tsx
2
```
En wt-218 (e3def8e3, #218 ya implementada) salen las líneas 412 y 419: también 2.
`-F` es una subcadena y cuenta `<BottomSheetView>`. Codex mediría 2 contra un 1
esperado y no sabría si parar. La guarda real de #218
(`sheet-surface-background.test.ts`:49) usa `/<BottomSheet(?![A-Za-z])/g`.
Errata: `grep -cE "<BottomSheet([^A-Za-z]|$)"` = 1, o «= 2 (`BottomSheet` + `BottomSheetView`)».

### F2. R3: la rama `fetch` que lanza no tiene candado

Cita (requirements.md:57 y 60):
> `fetch` que lanza → `{kind:'unreachable', message}`, …
> `#213 R3: cancelReminderSeries mapea %i a %s` (it.each de los siete estados)

Los «siete estados» con `%i` son siete códigos HTTP: 200, 404, 409, 403, 401,
400, 500. Los otros dos `it` de R3 cubren el PATCH y `missing-config`. Ningún
`it` hace que `fetchFn` lance. Un `switch` con `default: return {kind:'error'}`
que absorbiera el `unreachable` de `patchJson` pasaría los tres `it`. Los tests
de R18 mockean `cancelReminderSeries`, así que tampoco lo verían.
Errata: añadir `#213 R3: cancelReminderSeries devuelve unreachable si fetch lanza`
(fetchFn que rechaza; `toEqual({kind:'unreachable', message: <mensaje>})`).

### F3. R22 cuenta +2 ocurrencias comunes, pero el handler de R18 calcado del borrado da +3

Cita (requirements.md:377-379):
> `R8_REMINDERS` de `src/__tests__/ui-copy-table.ts` +56 filas (54
> claves nuevas + 2 ocurrencias nuevas de `common.cannotReachServer` y
> `common.somethingWentWrong` en `src/screens/reminders/index.tsx`)

Cita (design.md:137-138):
> Mapeo de errores con las mismas claves que el borrado, salvo `forbidden`,
> que tiene su propia clave.

Cita (R18, requirements.md:322-323):
> IF es `error` o `missing-config` o la llamada lanza THEN el texto de
> `common.somethingWentWrong`.

El borrado de la base escribe `somethingWentWrong` dos veces (rama del `switch` y `catch`):
```
$ grep -n "somethingWentWrong\|cannotReachServer\|catch" src/screens/reminders/index.tsx
121:            setActionError(t('common.cannotReachServer'));
128:            setActionError(t('common.somethingWentWrong'));
130:      } catch {
131:        setActionError(t('common.somethingWentWrong'));
228:            {t('common.somethingWentWrong')}
```
`checkUses` cuenta cada `t('common.somethingWentWrong'` del fichero. Calcar el
borrado añade 1 `cannotReachServer` y 2 `somethingWentWrong`: +3, no +2. La
cifra cerrada de R22 (+56, «56 → 112») queda roja. Para que dé +2, Codex
tendría que fundir el `catch` con la rama `error`, y la spec no lo prescribe.
Errata: fijar +57 filas (3 comunes) y «56 → 113», o prescribir una sola
llamada a `somethingWentWrong` en el handler de cancelar.

### F4. R13: una cláusula de tres ramas, un solo candado

Cita (requirements.md:213-214 y 223-226):
> IF la consulta no ha resuelto, falla o no contiene `petId` THEN THE SYSTEM
> SHALL usar la variante sin nombre …
> `#213 R13: sin nombre de mascota la nota usa la variante sin nombre`
> (`listPets` resuelve `{ kind: 'unreachable', message: 'x' }`; …)

Solo la rama «falla» tiene candado. Una implementación `pets?.[0]?.name` pasa
el único test y los de R12 (donde `pet-1` es la primera), y rompe la rama «no
contiene `petId`». Errata: convertir el `it` en it.each con al menos la fila
«`listPets` ok sin `pet-1`» (p. ej. solo `pet-2` «Luna»). La rama «no ha
resuelto» se puede cubrir con una aserción síncrona antes de `findBy` en la
misma fila, o declararla cubierta por diseño.

### F5. R18: la rama «la llamada lanza» no tiene fila

Cita (requirements.md:322-323 y 329-330):
> IF es `error` o `missing-config` o la llamada lanza THEN el texto de
> `common.somethingWentWrong`.
> `#213 R18: confirmar con %s muestra su error` (it.each `forbidden`,
> `unreachable`, `error`, `missing-config`; …)

Ninguna fila hace que `cancelReminderSeries` rechace. Un handler sin `catch`
pasa los cuatro casos y deja una promesa rechazada sin manejar. Errata:
añadir la fila `throws` (`mockRejectedValue(new Error('x'))`). Esto también
decide F3, porque el `catch` es la tercera ocurrencia.

### F6. `type-chip-row` y `advance-chip-row` caen bajo selectores por prefijo existentes

Cita (requirements.md:88-89):
> testID `type-chip-row` y
> `advance-chip-row` respectivamente

Comando y salida:
```
$ grep -rnE "(TestId|testID)\(\s*/" src --include=*.test.* | grep -E "type-chip|advance-chip"
src/screens/add-reminder/index.test.tsx:206:    expect(screen.getAllByTestId(/^type-chip-/)).toHaveLength(7);
src/screens/add-reminder/index.test.tsx:292:    expect(screen.getAllByTestId(/^advance-chip-/)).toHaveLength(4);
```
La `ScrollView` con testID `type-chip-row` casa con `/^type-chip-/`, y
`advance-chip-row` casa con `/^advance-chip-/`: los recuentos pasan de 7 a 8 y
de 4 a 5. Ni `tasks.md` §R5 ni §R22 enmiendan esos dos `it`
(`renders all reminder types and selects vaccine by default`,
`renders alert choices and selects seven days by default`). Medición en la
semilla: §4 (7 → 8 y 4 → 5, los dos `it` en rojo).
Errata: renombrar los testID (p. ej. `type-chips-row` / `advance-chips-row`),
o listar las dos enmiendas (`/^type-chip-(?!row$)/` …) con «(enmendado por #213 R5)».

### F7. R5 cuenta «5 chips de tipo» y hay 7

Cita (requirements.md:94-95):
> (aserta `props.horizontal === true` y que los 5 chips de tipo y los 4 de
> aviso son descendientes de su fila).

`REMINDER_TYPES = Object.entries(REMINDER_TYPE_META)` (add-reminder/index.tsx:39)
y `REMINDER_TYPE_META` tiene 7 entradas (vaccine, deworming, medication,
appointment, weight, food, other). El test existente de la línea 206 ya
aserta `toHaveLength(7)`. Un `it` escrito con 5 nace rojo y no se pone verde
con ninguna implementación correcta. Errata: «los 7 chips de tipo».

### F8. R1: el «test rojo» nace verde en jest

Cita (tasks.md:30 y requirements.md:36-37):
> (1) Test rojo `#213 R1: listReminders conserva recurrence y recurrenceUntil del backend`
> (filas `{unit:'month',every:1}` + `'2027-04-10'` y `null` + `null`).

`listReminders` de la base no mapea campos: devuelve el JSON tal cual.
```
$ sed -n 67-70p src/api/reminders.ts
  const body = await readJson(result.response);
  return Array.isArray(body)
    ? { kind: 'ok', reminders: body as Reminder[] }
    : { kind: 'error' };
```
El preset es `jest-expo` (package.json:71). Es babel, que no comprueba tipos. Un
`toEqual` con `recurrence` y `recurrenceUntil` pasa en la base antes de tocar
`types.ts`, así que el commit «rojo» de R1 sale verde e incumple C4. Codex
pararía o escribiría un rojo artificial. El único rojo real es de tipos
(`tsc --noEmit` si el test lee `.recurrence` de un `Reminder` tipado).
Errata: declarar que el rojo de R1 es `bunx tsc --noEmit` y que el test
lee los campos tipados. Otra salida: admitir que nace verde, anotarlo en el impl y
dejar que el rojo de R1 lo den los fixtures tipados de R2/R3.

## Avisos

- **A1.** R16 (requirements.md:279) escribe `daysUntil(dueAt, now) === 0`, pero
  la firma es `daysUntil(from, to)` (`src/utils/reminder-dates.ts`:15) y la base
  la llama `daysUntil(new Date(), due)` (reminders/index.tsx:331). Con `=== 0` el
  orden no cambia el resultado. Si Codex copia el orden y lo reutiliza para la
  píldora, el signo sale invertido. Prescribir `daysUntil(now, dueAt)`.
- **A2.** R14 (requirements.md:238) pide «MMM yyyy» sin dar las opciones `Intl`.
  `{ month: 'short', year: 'numeric' }` da «abr 2027» (medido en node). Otras
  combinaciones dan «abr de 2027». Prescribir las opciones, como R11 hace con las suyas.
- **A3.** design.md:16-19 congela el canvas desde una versión posterior
  (`1793050244-92d7` / `1793051574-af80`), no desde la v140 (`1793036268-d302`)
  que aprobó G1. El copy y las medidas citados en §13 están en el congelado,
  pero falta la prueba de que la v140 dibuja lo mismo. Es el mismo caso que A17 de #209.
- **A4.** design.md §Copy sin artboard (256-269) propone copy que la v140 no
  dibuja:
  - `hoursValueOne`;
  - `monthsValueOne`;
  - `monthLess`/`monthMore`;
  - `untilPlaceholder`;
  - cuatro `summary*`;
  - `summaryHoursDosesNoPet`;
  - `summaryHours`/`summaryHourly`;
  - las cadencias sin dibujar;
  - `cancelSeriesBodyNoPet`;
  - `errorCancelForbidden`.

  G1 («artboards y copy») no está delegado, según plan_mejoras §5 y CLAUDE.md. Decide el leader si la aprobación «G1 aprobado, v140…» cubre ese copy o si lo consulta al humano.
- **A5.** Con timers falsos, TanStack notifica con `setTimeout(0)`. Los textos que
  dependen de `listPets` deben esperarse con `findBy`/`waitFor` sobre el árbol:
  - la nota con «Rocky» de R12 y R13;
  - el cuerpo de R17.

  La spec no lo dice. El handoff debe citar §Esperas.
- **A6.** `#178 R7 … reserva el pop para la fila próxima y lo omite en la lejana`
  (reminders.test:1338) cae por R16 y no figura en tasks.md:123-128. Lo cubre la
  regla genérica de tasks.md:129. El fixture compartido `canvasReminders`
  (reminders.test:186; `a` vence el 2027-01-02T15:00Z y hoy es el 2026-12-30T15:00Z)
  lo usan varios `describe`. Mover su `dueAt` en vez de enmendar el `it` arrastra
  a los demás. Prescribir enmendar la expectativa, no el fixture.
- **A7.** Hay guardas que caen y que tasks.md §R22 no nombra. Las cubre la regla
  genérica de tasks.md:171. Las cifras base → semilla están en la tabla de §4:
  - `consistency-classnames`:300 (2 → 3), :326 (55 → 56), :426 (53 → 54) y :661;
  - `design-drift`:666 (`signOut(` en reminders 1 → 2);
  - `chunky-cta`:147, :169 (`text-17` 30 → 32), :178 (`border-lip-gray` 12 → 15),
    :185 (mapa `radii`: add-reminder 1 → 2, reminders 5 → 7), :194 y :203.

  Recomendación: listarlas con su cifra para que el diff sea una lista cerrada.
- **A8.** `addReminder.dosesJoin` = «{{list}} y {{last}}» (design.md:226).
  `t('addReminder.dosesJoin', { list: …, last: … })` casa con
  `consistency-classnames`:184 `/\b(?:last|first|odd|even):/` y la tumba (semilla:
  `[] → ['screens/add-reminder/index.tsx']`). Prescribir la forma corta
  `{ list, last }` o renombrar el parámetro.
- **A9.** design.md §Orden de merge (166-174) solo nombra #208 y #209. #214 mueve
  los mismos agregados: `ui-copy-table`, `ui-language`, los totales de esquinas de
  `consistency-classnames` (55 y 53) y los fixtures de
  `src/screens/home/index.test.tsx`. #218 mueve `reminders/index.tsx`. La regla
  «el segundo suma los deltas» debe nombrarlas.
- **A10.** La corrida final de tasks.md:176 no incluye `src/app/__tests__`. Ahí
  están las rutas que montan add-reminder y reminders con el `RootLayout` real
  (`reminders-alerts-stack.navigation`) y su `listPets` sin mockear. R13 añade una
  consulta a esa pantalla. Añadir la carpeta.
- **A11.** Dos huecos de `useThemeColors`:
  - los iconos `Minus`/`Plus` del stepper son `foreground` en el canvas y la spec no prescribe de dónde sale ese color;
  - design.md:162-164 dice «añade `'accent-strong'` al array del `useThemeColors` existente». Tras #218 hay dos llamadas en reminders/index.tsx (`useThemeColors(['surface'])` en wt-218:63), y la spec no dice cuál.
- **A12.** `it` que nacen verdes, aparte de F8:
  - R19: tasks.md:146 lo admite;
  - R21 con `petId` desconocido;
  - el `it` negativo de R14;
  - las filas `cancelled`/`sent` de R15.

  Las filas verdes dentro de un `it.each` que ya cae por otras filas no cuentan (R2 fila 1, R7 `once`, R8 y R10 «Una vez»). Anotarlo en el impl.
- **A13.** R4 prescribe la receta del chip:
  - `SELECTED_CHIP` + `chunkyLip.primaryCompact`;
  - en no seleccionado, `h-9.5 … bg-default`.

  Ningún `it` de R4 la aserta. Si se añade, que compare contra el literal, no contra `SELECTED_CHIP` importado.
- **A14.** R20 copia de `use-push-registration.test.tsx` un patrón que espera al
  contador del mock del router. En un test de hook es aceptable. El handoff
  debe dejar claro que en pantallas se espera al árbol.
- **A15.** R12 recorre las filas a–h pulsando `repeat-every-less`/`-more` desde 8
  (requirements.md:208-209), hasta 16 pulsaciones por fila con `await fireEvent`.
  Puede acercarse al timeout bajo carga (jest concurrente). Valorar
  `jest.setTimeout` local o un salto directo.
- **A16.** R1 hace obligatorios `recurrence` y `recurrenceUntil`. Cualquier
  fixture `Reminder` tipado que añadan #208 o #214 rompe `tsc` cuando la segunda de
  las dos mergee en `dev`. Añadirlo a la regla de A9.

## Veredicto

No firmable tal cual. Firmable tras aplicar las erratas de F1–F8. Los avisos
A1–A16 no bloquean, salvo A4, que es una decisión de gate (G1) del leader o del
humano.

Sin revisar: el contenido de las skills que nombra la carta, más allá de
`expo:expo-overview`, y una segunda corrida de la semilla con `--one-sww` para
aislar F3. F3 ya se confirma con la semilla: `common.somethingWentWrong` 4 → 5.

## Erratas aplicadas (spec_author, 2026-10-26)

Terminado. Base congelada: wt-213 HEAD 2dab13f3 (árbol de app = origin/dev 8b4cb1bd).
Solo se tocó texto de spec (los cuatro ficheros de `specs/mobile-reminders-recurrence/`)
y este informe; sin commit.
Semilla: `audit213/seed/` (scratchpad de la sesión). Logs nuevos en `audit213/`.

### Mediciones

- F1. `grep -cE "<BottomSheet([^A-Za-z]|$)" src/screens/reminders/index.tsx`
  desde `mobile-pet-tracker/`:
  - wt-218 (HEAD a9b0ad93, #218 implementada; el informe citaba e3def8e3) → `1` (línea 412 `<BottomSheet`);
  - base wt-213 → `1`; semilla → `1`.
  - `grep -cF "backgroundStyle"` en wt-218 → `1`.
- F2. `patchJson` (`src/api/http.ts`) captura y devuelve
  `message: error instanceof Error ? error.message : String(error)`. El patrón del
  fichero de tests (`deleteReminder` › `maps a fetch rejection to unreachable`) usa
  `mockRejectedValue(new Error('network down'))` → `message: 'network down'`.
- F3. En la semilla, tras `errata.py` (handler calcado: `switch` + `catch`):
  - `grep -cF "t('common.somethingWentWrong'" src/screens/reminders/index.tsx` → `5` (base `3` + 2);
  - `grep -cF "t('common.cannotReachServer'" src/screens/reminders/index.tsx` → `2` (base `1` + 1);
  - `grep -cF "// #213 R22" src/__tests__/ui-copy-table.ts` → `57` (54 claves + 3 comunes);
  - `#186 R5` y `#65 R18` de `ui-language.test.ts` verdes con `+ 57`.
- F6. Selectores regex de testID en tests, desde la semilla:
  `grep -rhoE "(TestId|testID)\(\s*/[^/]+/[a-z]*" src --include=*.test.*` →
  51 expresiones distintas. Probadas con `node` contra `type-chips-row` y
  `advance-chips-row`: `coincidencias: 0`. Los `it` con `/^type-chip-/`
  (`toHaveLength(7)`) y `/^advance-chip-/` (`toHaveLength(4)`) quedan verdes en
  `seed.errata1.log` y `seed.errata2.log`.
- F7. `REMINDER_TYPE_META` tiene 7 entradas (vaccine, deworming, medication,
  appointment, weight, food, other); el `it` de la línea 206 de la base ya
  aserta `toHaveLength(7)`.
- A1. `grep -nF "export function daysUntil" src/utils/reminder-dates.ts` →
  `15:export function daysUntil(from: Date, to: Date): number {`; la base llama
  `daysUntil(new Date(), due)`.
- A2. `node -e 'console.log(new Intl.DateTimeFormat("es-MX",{month:"short",year:"numeric"}).format(new Date(2027,3,10)))'`
  → `abr 2027`.
- A8. En la semilla tras `errata.py`:
  `grep -cE "\b(last|first|odd|even):" src/screens/add-reminder/index.tsx` → `0`;
  `#62 R6 … variantes de posición` verde en `seed.errata1.log`.
- F8. Sonda de tipos en la semilla con los tipos de la base (sin R1): un fichero
  temporal `src/api/probe-r1.ts` que lee `reminder.recurrence` y
  `reminder.recurrenceUntil` de un `Reminder`; luego se borró.
  `bunx tsc --noEmit; echo "exit=$?"` → `exit=2`, log `audit213/tsc-probe-r1.log`:
  - `src/api/probe-r1.ts(5,17): error TS2339: Property 'recurrence' does not exist on type 'Reminder'.`
  - `src/api/probe-r1.ts(6,17): error TS2339: Property 'recurrenceUntil' does not exist on type 'Reminder'.`
  - Los otros 12 errores salen de la propia semilla, que lleva la pantalla de R14–R18
    sin los tipos de R1. No los produce el test de R1.
- #218, solo lectura sobre wt-218 (HEAD `dce08a78`; antes `e3def8e3` y
  `a9b0ad93`), desde `mobile-pet-tracker/`:
  - `grep -cF "useThemeColors(" src/screens/reminders/index.tsx` → `2`;
  - `grep -cE "<BottomSheet([^A-Za-z]|$)" …` → `1`;
  - `grep -cF "backgroundStyle" …` → `1`.
- `signOut(` en `src/screens/reminders/index.tsx`: base `1`, semilla `2`.
- Base del somethingWentWrong de F3: el informe decía 4 → 5 (cuenta de
  `ui-copy-table`). Con `grep -cF "t('common.somethingWentWrong'"` sobre la
  pantalla, la base es `3` y la semilla `5`. La spec usa las cifras del grep: +2.
- A7, base `8b4cb1bd`: los 18 literales «base» de `tasks.md` §R22 (3), contados
  con `grep -cF` en su fichero. Cada uno da `1`, salvo
  `      + 1 - 1 - 2 // #220 R4; #220 R14; #220 R15` en `consistency-classnames`,
  que da `2` (uno por `it`).
  Los `it` que leen las constantes de nivel de fichero se localizaron por uso:
  - `NEUTRAL_ROWS`: `#177 R4.1`, `#177 R4.2`, `#177 R7.5`;
  - `neutralIds`: `#177 R8.1`;
  - `neutralInventory`: `#177 R4.3`;
  - `radii`: `#177 R7.3`;
  - `screenSignOutCalls`: `preserves every mutation sign-out…`;
  - `directUses`: el `it.each` de esquinas y `fusiona la esquina…`.

### Corridas de la semilla

Todas desde `audit213/seed/mobile-pet-tracker/`, con `timeout 590`, sin pipe y sin
otro jest mío en paralelo. En las de `errata2` y `final` había jest de otras
sesiones (wt-208, wt-214, audit214).

| Log | Comando | Resultado |
|---|---|---|
| `seed.log` | suite del §4 | 7 suites y 25 tests rojos / 1179 |
| `seed.errata1.log` | suite del §4, tras `errata.py` | 5 suites y 20 tests rojos / 1179 |
| `seed.errata2.log` | suite del §4, tras `guards.py` | 1 rojo / 1181: `#155 R6 … queda en el sitio del vacío que sustituye (enmendado por #204 R4)`, timeout de 5000 ms con jest ajeno en paralelo |
| `seed.errata3.log` | `bunx jest src/screens/reminders` | `exit=0`; 1 suite, 81/81 verdes (incluido `#155 R6`) |
| `seed.final.log` | `bunx jest src/__tests__ src/providers/__tests__/language-provider.test.tsx src/screens/add-reminder src/screens/reminders src/hooks/use-push-registration.test.tsx` | `exit=0`; `Test Suites: 39 passed, 39 total`, `Tests: 1181 passed, 1181 total` |
| `seed.app.log` | `bunx jest src/app/__tests__` (A10) | `exit=0`; `Test Suites: 10 passed, 10 total`, `Tests: 85 passed, 85 total` |

El rojo de `seed.errata2.log` no se repite en `seed.errata3.log` ni en
`seed.final.log`. Se registra como timeout bajo carga, no como errata.

### Tabla de erratas y avisos aplicados

| Errata / aviso | R-id | Qué queda escrito |
|---|---|---|
| F1 | R17, R19 | Ancla ERE `grep -cE "<BottomSheet([^A-Za-z]\|$)"` = 1 (requirements R17, tasks §R17); `grep -cF "<BottomSheet"` declarado no ancla |
| F2 | R3 | `it` nuevo `#213 R3: cancelReminderSeries devuelve unreachable si fetch lanza` con `mockRejectedValue(new Error(…))` → `{ kind: 'unreachable', message }` (requirements, tasks §R3, traceability) |
| F3 | R18, R22 | Handler calcado de `handleDelete`: `try` + `switch` + `catch`. Anclas `cannotReachServer` 1 + 1 = 2, `somethingWentWrong` 3 + 2 = 5, `signOut(` 1 + 1 = 2. `R8_REMINDERS` +57, `#186 R5` 56 → 113 con `+ 57 // #213 R22`, `#65 R18` sin cifra (requirements R18 y R22, design, tasks §R18 y §R22) |
| F4 | R13 | it.each `#213 R13: sin nombre de mascota (%s) la nota usa la variante sin nombre`, tres filas: `falla` (unreachable), `sin la mascota` (solo pet-2 «Luna»), `sin resolver` (promesa que no resuelve, aserción síncrona) (requirements, tasks §R13, traceability) |
| F5 | R18 | Fila `throws` (`mockCancelReminderSeries.mockRejectedValue(new Error('x'))` → `common.somethingWentWrong`) en el it.each de errores; cinco filas (requirements, tasks §R18, traceability) |
| F6 | R5 | testIDs `type-chips-row` / `advance-chips-row`; nota de los selectores `/^type-chip-/` y `/^advance-chip-/` (51 regex, 0 coincidencias) (requirements, design, tasks §R5) |
| F7 | R5 | «los 7 chips de tipo» (requirements R5) |
| F8 | R1 | Rojo de R1 = `bunx tsc --noEmit` ≠ 0 con `TS2339`, jest nace verde. El test lee los campos tipados del resultado y el commit cita el error (tasks §R1, «`it` que nacen verdes») |
| A1 | R16 | `daysUntil(now, dueAt) === 0`, firma `daysUntil(from, to)` (requirements R16, design) |
| A2 | R14 | `Intl.DateTimeFormat(locale, { month: 'short', year: 'numeric' })` (requirements R14) |
| A3 | — | Párrafo del canvas: «verificados idénticos a la v140 (id de versión `1793036268-d302`, la que aprobó G1) el 2026-10-26 por el leader, sha256 a sha256» (design) |
| A4 | R22 | Registro en design.md §Copy sin artboard: aprobado «tal cual» por el humano en G1, 2026-10-26 22:44 UTC, en la sesión del leader. Sin cambiar literales |
| A5 | R12, R13, R17, R18, R21 | Esperas sobre el árbol (`findByTestId` / `waitFor` sobre el nodo) con los literales de cada `it` (requirements) |
| A6 | R16 | Lista cerrada de 7 `it` « (enmendado por #213 R16)». El punto 7 (`reserva el pop…`) enmienda la expectativa, no el fixture. Constante `todayCanvasReminders`; anclas 7, 5, 4 y `¡Próximo!` 0 (tasks §R16) |
| A7 | R22 | Lista cerrada de 18 enmiendas con literal base → nuevo y cifra base + delta, incluidas `#177 R6.2` (30 → 32 y 8 → 9), `#177 R7.1` (12 → 15), `#177 R7.3` (42 → 45), `#177 R7.5`, `#62 R14` (2 → 3, 55 → 56, 53 → 54) y `#166 R3`. «Si cae otra guarda, parar y anotarla» (tasks §R22) |
| A8 | R12 | `t('addReminder.dosesJoin', { list, last })` en forma corta; ancla `grep -cE "\b(last\|first\|odd\|even):"` = 0; `#62 R6` verde (design, tasks §R12) |
| A9 | — | design.md §Orden de merge con #208, #209, #214 y #218. #214 aporta `ui-copy-table`, `ui-language`, los totales 55/53 y los fixtures de `home/index.test.tsx`; #218 aporta `reminders/index.tsx`. Recogido en Paso 0 de tasks |
| A10 | — | Corrida final de tasks con `src/app/__tests__` |
| A11 | R6, R14 | Stepper: `useThemeColors(['muted', 'accent-strong', 'foreground'])`. Reminders: `accentStrong` al final de la llamada `'category-blue-strong'…'danger'`, nunca en `useThemeColors(['surface'])`; ancla `useThemeColors(` 1 → 2 tras el merge de #218 (design) |
| A12 | R1, R14, R15, R19, R21 | Sección «`it` que nacen verdes» de tasks, lista cerrada de 5 con la frase del impl |
| A13 | R4 | Ya aplicado; sin cambios en esta pasada |
| A14 | R20 | La excepción de esperar al doble del router queda en el `it` de hook de R20; no cubre pantallas (requirements R20) |
| A15 | R12 | `15000` como tercer argumento del it.each de R12 (requirements, tasks §R12) |
| A16 | R1 | Regla de fixtures: `recurrence: null, recurrenceUntil: null` en todo fixture `Reminder` tipado que traiga el merge (design §Orden de merge, tasks Paso 0) |

### Pendiente

Ninguna errata ni aviso queda sin escribir. Fuera del texto de la spec quedan:
- la firma y el commit (leader);
- re-medir en el Paso 0 las anclas de #218 contra `origin/dev` si wt-218 vuelve a
  moverse. Lo escrito está medido en `dce08a78`.

### Progreso

- requirements.md: F1, F2, F4, F5, F6, F7, A1, A2, A5, A13, A14, A15 y la
  cifra de F3 (R22 +57) escritos. R21 también espera sobre el árbol
  (`pet-chip-pet-2` seleccionado) antes de asertar el argumento de
  `listReminders`.
- design.md: A3, A4 (registro de G1), A8, A9, A11, A16, F3 (forma del handler)
  y la sección de #218 re-medida escritos.
- tasks.md: Paso 0 (A9, A16), §R1 (F8), §R3 (F2), §R5 (F6), §R12 (A8, A15),
  §R13 (F4), §R14, §R16 (A6, lista cerrada de 7), §R17 (F1), §R18 (F3, F5),
  §R22 (F3, A7: lista cerrada de 18 enmiendas), «`it` que nacen verdes» (A12)
  y la corrida final con `src/app/__tests__` (A10) escritos.
- traceability.md: tabla nueva con los `it` añadidos o renombrados (R3, R13,
  R18 `throws`, R16, R22).

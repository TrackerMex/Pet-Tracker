---
feature: "mobile-reminders-recurrence"
status: approved     # draft | approved
tags: [mobile, reminders, recurrence, spec]
---

# Requisitos — [[mobile-reminders-recurrence]] (#213)

> Notación EARS. Cada requisito tiene id único R<n>, inmutable una vez aprobado.
> Ver [[design]] para las decisiones técnicas, el inventario de copy, los
> artboards congelados en `canvas/` y el orden de merge con #218, #208 y #209.
> Todas las rutas de código son relativas a `mobile-pet-tracker/` salvo que se
> diga otra cosa. Contrato de backend: `specs/reminders-recurrence/` (#210, ya
> en `dev`).

**Fecha base de los tests de formulario.** Salvo que el requisito diga otra
cosa, los tests nuevos de `src/screens/add-reminder/index.test.tsx` corren con
`TZ=America/Mexico_City` mediante `process.getBuiltinModule('process')` y
`jest.useFakeTimers({ now: new Date(2026, 11, 20, 10, 0) })` (20 dic 2026,
10:00 local), igual que el `describe('#178 R12: chips de aviso y vista previa')`
del mismo fichero. Los tests eligen fecha con el helper `pickDate(date)` y hora
con `pickTime(hours, minutes)` que ya existen en ese fichero. «Rocky» es el
nombre de la mascota `pet-1` que devuelve el doble de `listPets` (R13).

## Requisitos funcionales

### Datos y API

- **R1**: WHEN `listReminders` recibe del backend un recordatorio con
  `recurrence` y `recurrenceUntil` THE SYSTEM SHALL conservarlos tal cual en el
  `Reminder` resultante; el tipo `Reminder` de `src/api/types.ts` declara
  `recurrence: Recurrence | null` y `recurrenceUntil: string | null` como
  campos obligatorios, y `src/api/types.ts` exporta
  `export type Recurrence = { unit: 'hour' | 'day' | 'week' | 'month' | 'year'; every: number };`.
  Test: `src/api/__tests__/reminders.test.ts` ::
  `#213 R1: listReminders conserva recurrence y recurrenceUntil del backend`
  (filas `{unit:'month',every:1}` + `'2027-04-10'` y `null` + `null`).
  Ancla: `grep -cF "recurrenceUntil: string | null" src/api/types.ts` = 1.

- **R2**: WHEN `createReminder` recibe un `CreateReminderInput` con
  `recurrence` (y opcionalmente `recurrenceUntil`) THE SYSTEM SHALL enviar el
  cuerpo con las cuatro claves de siempre más esas claves; WHEN no las recibe
  THE SYSTEM SHALL enviar exactamente las cuatro claves `type`, `title`,
  `dueAt`, `advanceMinutes` (ninguna clave con valor `undefined` ni `null`).
  Test: `src/api/__tests__/reminders.test.ts` ::
  `#213 R2: createReminder envía el cuerpo %s` (it.each con tres filas: sin
  recurrencia → 4 claves; `{unit:'hour',every:8}` sin `recurrenceUntil` → 5
  claves; `{unit:'month',every:3}` + `'2027-06-30'` → 6 claves; aserción con
  `Object.keys(JSON.parse(body)).sort()` y `toEqual` del cuerpo entero).

- **R3**: WHEN se llama `cancelReminderSeries(baseUrl, token, reminderId, fetchFn)`
  THE SYSTEM SHALL hacer `PATCH ${baseUrl}/reminders/${reminderId}` vía
  `patchJson` con cuerpo exactamente `{"status":"cancelled"}` y devolver
  `CancelReminderSeriesState`: 200 → `{kind:'ok'}`, 404 → `{kind:'not-found'}`,
  409 → `{kind:'not-editable'}`, 403 → `{kind:'forbidden'}`, 401 →
  `{kind:'unauthorized'}`, cualquier otro estado (400, 500) → `{kind:'error'}`,
  `fetch` que lanza → `{kind:'unreachable', message}`, `baseUrl` vacío o
  `undefined` → `{kind:'missing-config'}` sin llamar a `fetchFn`.
  Test: `src/api/__tests__/reminders.test.ts` ::
  `#213 R3: cancelReminderSeries mapea %i a %s` (it.each de los siete códigos
  HTTP 200, 404, 409, 403, 401, 400 y 500),
  `#213 R3: cancelReminderSeries hace PATCH a /reminders/:id con status cancelled`,
  `#213 R3: cancelReminderSeries sin baseUrl no llama a fetch` y
  `#213 R3: cancelReminderSeries devuelve unreachable si fetch lanza`
  (`fetchFn = jest.fn().mockRejectedValue(new Error('network down')) as unknown as typeof fetch`;
  `resolves.toEqual({ kind: 'unreachable', message: 'network down' })`, el
  mensaje que `patchJson` copia de `error.message`; mismo patrón que
  `deleteReminder` › `maps a fetch rejection to unreachable` del fichero).
  Ancla: `grep -cF "export async function cancelReminderSeries" src/api/reminders.ts` = 1.

### Formulario «Agregar recordatorio»

- **R4**: WHEN se abre «Agregar recordatorio» THE SYSTEM SHALL mostrar, entre
  la fila Fecha/Hora y la sección Aviso, la sección «Repetición» con seis chips
  en este orden y con estos testID y textos: `repeat-chip-once` «Una vez»,
  `repeat-chip-day` «Diario», `repeat-chip-week` «Semanal»,
  `repeat-chip-month` «Mensual», `repeat-chip-year` «Anual»,
  `repeat-chip-hour` «Cada N horas»; «Una vez» nace con
  `accessibilityState.selected === true` y los otros cinco con `false`; al
  pulsar un chip pasa a seleccionado y el anterior deja de estarlo. El chip
  seleccionado usa `SELECTED_CHIP` + `chunkyLip.primaryCompact` y el no
  seleccionado `h-9.5 items-center justify-center rounded-full px-3.5 bg-default`
  (la receta de los chips de Aviso). Los chips de Repetición van en
  `flex-row flex-wrap gap-2` (pueden ocupar dos líneas).
  Test: `src/screens/add-reminder/index.test.tsx` ::
  `#213 R4: Repetición ofrece seis chips con Una vez seleccionado` (además de
  textos y `selected`, aserta la receta con literales escritos en el test, nunca
  con `SELECTED_CHIP` importado de producción: `repeat-chip-once` tiene
  `props.className` `toBe('h-9.5 items-center justify-center rounded-full px-3.5 bg-accent')`
  y `props.style` `toEqual(mockChunkyLip.primaryCompact)`; cada uno de los
  otros cinco tiene `props.className`
  `toBe('h-9.5 items-center justify-center rounded-full px-3.5 bg-default')` y
  `props.style` `toBeUndefined()`) y
  `#213 R4: pulsar un chip de repetición mueve la selección` y
  `#213 R4: Repetición va después de Hora y antes de Aviso` (orden por
  `screen.toJSON()` o por índice de los textos en el árbol).

- **R5**: THE SYSTEM SHALL pintar los chips de Tipo y de Aviso en una sola fila
  horizontal que no salta de línea y que se corta en el borde derecho de la
  pantalla: cada fila es un `ScrollView` con `horizontal`,
  `showsHorizontalScrollIndicator={false}`, testID `type-chips-row` y
  `advance-chips-row` respectivamente, `className="-mr-5"` y
  `contentContainerStyle={{ gap: 8, paddingRight: 20 }}`; ninguna de las dos
  filas lleva `flex-wrap`. Los testID llevan `chips` en plural para que no
  casen con los selectores por prefijo `/^type-chip-/` y `/^advance-chip-/`
  de los `it` existentes del fichero, que siguen contando 7 y 4.
  Test: `src/screens/add-reminder/index.test.tsx` ::
  `#213 R5: Tipo y Aviso son filas horizontales sin salto de línea`
  (aserta `props.horizontal === true` y que los 7 chips de tipo y los 4 de
  aviso son descendientes de su fila).
  Ancla: `grep -cF "flex-row flex-wrap gap-2" src/screens/add-reminder/index.tsx` = 1
  (solo la fila de Repetición).

- **R6**: WHILE el chip seleccionado es «Cada N horas» THE SYSTEM SHALL mostrar
  el stepper `repeat-stepper` con la etiqueta «Cada», el valor
  `repeat-every-value` (nace «8 horas»; «1 hora» cuando vale 1; «N horas» en
  otro caso), los botones `repeat-every-less` (accessibilityLabel
  «Una hora menos») y `repeat-every-more` (accessibilityLabel «Una hora más»)
  y la ayuda `repeat-every-help` «De 1 a 24 horas.»; cada pulsación resta o
  suma 1; el valor no baja de 1 ni sube de 24, y el botón del extremo
  alcanzado queda `disabled` (`accessibilityState.disabled === true`).
  Test: `src/screens/add-reminder/index.test.tsx` ::
  `#213 R6: el stepper de horas nace en 8 y muestra su ayuda`,
  `#213 R6: el stepper de horas se detiene en 1 con «1 hora» y deshabilita menos`,
  `#213 R6: el stepper de horas se detiene en 24 y deshabilita más`.

- **R7**: WHILE el chip seleccionado es «Mensual» THE SYSTEM SHALL mostrar el
  mismo stepper `repeat-stepper` con «Cada», valor que nace «1 mes» («N meses»
  si N > 1), botones con accessibilityLabel «Un mes menos» y «Un mes más»,
  ayuda «De 1 a 12 meses.», límites 1 y 12 con el botón del extremo
  `disabled`. WHILE el chip es «Una vez», «Diario», «Semanal» o «Anual» THE
  SYSTEM SHALL no renderizar `repeat-stepper`. Cada unidad recuerda su propio
  valor al cambiar de chip y volver.
  Test: `src/screens/add-reminder/index.test.tsx` ::
  `#213 R7: el stepper de meses nace en 1 mes y se detiene en 12`,
  `#213 R7: sin stepper con %s` (it.each `once`, `day`, `week`, `year`),
  `#213 R7: cada unidad conserva su valor al cambiar de chip`.

- **R8**: WHILE el chip seleccionado no es «Una vez» THE SYSTEM SHALL mostrar
  la sección «Hasta» con «Opcional» a la derecha de su etiqueta y un
  `DateField` con `testID="until-field"`, `pickerTestID="until-picker"`,
  `allowClear`, placeholder «Sin fecha de fin» y `minDate` = la fecha elegida
  (o hoy si no hay fecha). WHILE el chip es «Una vez» THE SYSTEM SHALL no
  renderizar `until-field`. WHEN el usuario cambia la Fecha a un día posterior
  al «Hasta» elegido THE SYSTEM SHALL vaciar «Hasta». WHEN el usuario pulsa
  `until-field-clear` THE SYSTEM SHALL vaciar «Hasta» y dejar de mostrar la
  frase de hasta en la nota (R11).
  Test: `src/screens/add-reminder/index.test.tsx` ::
  `#213 R8: Hasta aparece con la repetición y es opcional`,
  `#213 R8: Hasta no aparece con Una vez`,
  `#213 R8: mover la fecha más allá de Hasta lo vacía`,
  `#213 R8: borrar Hasta lo quita del cuerpo y de la nota`.

- **R9**: WHILE el chip seleccionado es «Cada N horas» THE SYSTEM SHALL no
  renderizar la sección Aviso (ni su etiqueta `addReminder.alert` ni ningún
  `advance-chip-*`) y enviar `advanceMinutes: 0`; con cualquier otro chip la
  sección Aviso y su regla de `effectiveAdvance` siguen como hoy.
  Test: `src/screens/add-reminder/index.test.tsx` ::
  `#213 R9: Cada N horas oculta Aviso y envía advanceMinutes 0`.

- **R10**: WHEN el usuario guarda con un chip de repetición THE SYSTEM SHALL
  llamar `createReminder(baseUrl, token, petId, input)` con: «Una vez» →
  exactamente `{type, title, dueAt, advanceMinutes}` (sin claves de
  recurrencia); «Diario» → `recurrence: {unit:'day', every:1}`; «Semanal» →
  `{unit:'week', every:1}`; «Mensual» → `{unit:'month', every:<stepper>}`;
  «Anual» → `{unit:'year', every:1}`; «Cada N horas» →
  `{unit:'hour', every:<stepper>}`; y `recurrenceUntil: 'YYYY-MM-DD'` (fecha
  civil local del «Hasta») solo cuando hay «Hasta» y la repetición no es
  «Una vez».
  Test: `src/screens/add-reminder/index.test.tsx` ::
  `#213 R10: guarda %s con su cuerpo exacto` (it.each de siete filas: las seis
  unidades sin Hasta, con Mensual en 3 y Horas en 12, más Diario con Hasta
  2 ene 2027 → `recurrenceUntil: '2027-01-02'`).

- **R11**: WHILE hay fecha elegida THE SYSTEM SHALL mostrar en
  `add-reminder-preview-text` la frase de la unidad, calculada sobre
  `notifyAt = dueAt − aviso efectivo` (con «Cada N horas», `notifyAt = dueAt`),
  con hora `HH:mm` en `hourCycle: 'h23'` y sufijo de hasta
  «, hasta el <d MMM yyyy>» cuando hay «Hasta»; el icono de la nota es
  `Repeat` (20, `accent-strong`) cuando la repetición no es «Una vez» y `Bell`
  cuando lo es («Una vez» conserva la frase de `addReminder.notifyPreview`).
  La tabla exacta (fecha base de este documento, aviso «El mismo día» salvo
  que se diga otra cosa, hora 09:00 salvo que se diga otra cosa):

  | Fila | Chip / stepper | Fecha | Aviso | Hasta | Texto exacto |
  |---|---|---|---|---|---|
  | a | Diario | 31 dic 2026 | mismo día | — | `Te aviso cada día a las 09:00.` |
  | b | Diario | 31 dic 2026 | mismo día | 2 ene 2027 | `Te aviso cada día a las 09:00, hasta el 2 ene 2027.` |
  | c | Semanal | 30 dic 2026 | mismo día | — | `Te aviso cada miércoles a las 09:00.` |
  | d | Semanal | 30 dic 2026 | mismo día | 6 ene 2027 | `Te aviso cada miércoles a las 09:00, hasta el 6 ene 2027.` |
  | e | Mensual · 1 | 31 dic 2026 | mismo día | — | `Te aviso el día 31 de cada mes a las 09:00.` |
  | f | Mensual · 1 | 1 ene 2027 | 1 día antes | 31 ene 2027 | `Te aviso el día 31 de cada mes a las 09:00, hasta el 31 ene 2027.` |
  | g | Mensual · 3 | 31 dic 2026 | mismo día | — | `Te aviso el día 31 cada 3 meses a las 09:00.` |
  | h | Mensual · 3 | 31 dic 2026 | mismo día | 30 jun 2027 | `Te aviso el día 31 cada 3 meses a las 09:00, hasta el 30 jun 2027.` |
  | i | Anual | 2 ene 2027 | mismo día | — | `Te aviso cada año el 2 ene a las 09:00.` |
  | j | Anual | 2 ene 2027 | mismo día | 2 ene 2030 | `Te aviso cada año el 2 ene a las 09:00, hasta el 2 ene 2030.` |

  Test: `src/screens/add-reminder/index.test.tsx` ::
  `#213 R11: la nota de %s dice «%s»` (it.each de las filas a–j) y
  `#213 R11: la nota usa Repeat con repetición y Bell con Una vez`.

- **R12**: WHILE el chip es «Cada N horas» y hay fecha THE SYSTEM SHALL
  aplicar esta regla exacta: si `24 % N === 0` y `N >= 6` (N ∈ {6, 8, 12, 24})
  la nota lista las tomas del día, `dueAt + k·N h` para `k = 0 … 24/N − 1`, en
  hora local `HH:mm` h23, unidas con «, » y la última con « y » (una sola toma
  sin unión); si N = 1, «Te aviso cada hora desde las <HH:mm>…»; en cualquier
  otro N, «Te aviso cada N horas desde las <HH:mm>…»; con el mismo sufijo de
  hasta que R11. Tabla exacta (fecha 31 dic 2026, hora 20:00 con
  `pickTime(20, 0)`):

  | Fila | N | Hasta | Texto exacto |
  |---|---|---|---|
  | a | 8 | — | `Te aviso en cada toma de Rocky: 20:00, 04:00 y 12:00.` |
  | b | 8 | 2 ene 2027 | `Te aviso en cada toma de Rocky: 20:00, 04:00 y 12:00, hasta el 2 ene 2027.` |
  | c | 6 | — | `Te aviso en cada toma de Rocky: 20:00, 02:00, 08:00 y 14:00.` |
  | d | 12 | — | `Te aviso en cada toma de Rocky: 20:00 y 08:00.` |
  | e | 24 | — | `Te aviso en cada toma de Rocky: 20:00.` |
  | f | 5 | — | `Te aviso cada 5 horas desde las 20:00.` |
  | g | 7 | 2 ene 2027 | `Te aviso cada 7 horas desde las 20:00, hasta el 2 ene 2027.` |
  | h | 1 | — | `Te aviso cada hora desde las 20:00.` |

  Test: `src/screens/add-reminder/index.test.tsx` ::
  `#213 R12: con %i horas la nota dice «%s»` (it.each de las filas a–h; el N
  se alcanza pulsando `repeat-every-less` / `repeat-every-more` desde 8; el
  `it.each` lleva `15000` como tercer argumento, el timeout por fila, porque una
  fila hace hasta 16 pulsaciones con `await fireEvent`; el texto con «Rocky» se
  espera sobre el árbol con
  `await waitFor(() => expect(screen.getByTestId('add-reminder-preview-text')).toHaveTextContent(<texto>))`,
  nunca sobre el contador de `listPets`).

- **R13**: THE SYSTEM SHALL leer el nombre de la mascota seleccionada de
  `useQuery({ queryKey: petKeys.list(), queryFn: () => listPets(baseUrl, token ?? '') })`;
  IF la consulta no ha resuelto, falla o no contiene `petId` THEN THE SYSTEM
  SHALL usar la variante sin nombre «Te aviso en cada toma: <tomas><hasta>.»
  sin esperar ni mostrar error. El render de los tests de
  `src/screens/add-reminder/index.test.tsx` pasa a envolver la pantalla en un
  `QueryClientProvider` con un `QueryClient` nuevo por render
  (`retry: false`), y el fichero añade
  `jest.mock('../../api/pets', () => ({ listPets: jest.fn() }))` con un
  `beforeEach` de nivel superior que resuelve
  `{ kind: 'ok', pets: [<mascota id 'pet-1', name 'Rocky'>] }` (misma forma que
  `makePet` de `src/screens/reminders/index.test.tsx`).
  Test: `src/screens/add-reminder/index.test.tsx` ::
  `#213 R13: sin nombre de mascota (%s) la nota usa la variante sin nombre`
  (it.each de tres filas, una por rama de la cláusula IF; en las tres, «Cada
  N horas» con N = 8, fecha 31 dic 2026 y `pickTime(20, 0)`, como R12 fila a, y
  texto exacto `Te aviso en cada toma: 20:00, 04:00 y 12:00.`):

  | Fila | `listPets` | Espera |
  |---|---|---|
  | `falla` | `mockResolvedValue({ kind: 'unreachable', message: 'x' })` | sobre el árbol: `await waitFor(() => expect(screen.getByTestId('add-reminder-preview-text')).toHaveTextContent(<texto>))`, nunca sobre el contador de `listPets` |
  | `sin la mascota` | `mockResolvedValue({ kind: 'ok', pets: [<mascota id 'pet-2', name 'Luna'>] })` (la seleccionada es `pet-1`, `selectPet('pet-1')` del fichero) | igual que `falla`, sobre el árbol |
  | `sin resolver` | `mockReturnValue(new Promise(() => {}))` (no resuelve nunca) | aserción síncrona `expect(screen.getByTestId('add-reminder-preview-text')).toHaveTextContent(<texto>)` justo después de elegir N, fecha y hora, sin `waitFor` ni `findBy` |

  La fila `sin la mascota` es la que tumba una implementación que lee
  `pets[0]?.name` en vez de buscar `petId`.

### Lista «Recordatorios»

- **R14**: WHILE un recordatorio tiene `status === 'scheduled'` y
  `recurrence !== null` THE SYSTEM SHALL pintar en su fila, bajo la línea de
  fecha, una línea `reminder-repeats-${id}` con el icono `Repeat` (14,
  `accent-strong`) y el texto `text-13 font-bold text-accent-strong`
  «Se repite <cadencia><hasta>», donde la cadencia es «cada hora» /
  «cada N horas», «cada día» / «cada N días», «cada semana» /
  «cada N semanas», «cada mes» / «cada N meses», «cada año» / «cada N años»
  (singular cuando `every === 1`), y el hasta es « · hasta el <d MMM>» cuando
  el año de `recurrenceUntil` es el año local actual, « · hasta <MMM yyyy>»
  cuando es otro año, y nada cuando es `null`. «MMM yyyy» se formatea con
  `Intl.DateTimeFormat(locale, { month: 'short', year: 'numeric' })`, que da
  «abr 2027» en es-MX (otras combinaciones de opciones dan «abr de 2027»). WHILE `recurrence === null` o
  el estado no es `scheduled` THE SYSTEM SHALL no pintar esa línea. Tabla
  exacta (hoy 30 dic 2026, 10:00 local):

  | Fila | recurrence | recurrenceUntil | Texto exacto |
  |---|---|---|---|
  | a | `{hour, 8}` | `'2026-12-31'` | `Se repite cada 8 horas · hasta el 31 dic` |
  | b | `{hour, 1}` | `null` | `Se repite cada hora` |
  | c | `{day, 1}` | `'2027-01-02'` | `Se repite cada día · hasta ene 2027` |
  | d | `{day, 3}` | `null` | `Se repite cada 3 días` |
  | e | `{week, 1}` | `null` | `Se repite cada semana` |
  | f | `{week, 2}` | `null` | `Se repite cada 2 semanas` |
  | g | `{month, 1}` | `'2027-04-10'` | `Se repite cada mes · hasta abr 2027` |
  | h | `{month, 3}` | `null` | `Se repite cada 3 meses` |
  | i | `{year, 1}` | `null` | `Se repite cada año` |
  | j | `{year, 2}` | `null` | `Se repite cada 2 años` |

  Test: `src/screens/reminders/index.test.tsx` ::
  `#213 R14: la fila recurrente dice «%s»` (it.each a–j, `dueAt` 31 dic 2026
  12:00 local) y
  `#213 R14: sin línea de repetición si no hay recurrencia o la serie no está programada`
  (filas `recurrence: null` scheduled, y `{month,1}` con `status` `'cancelled'`
  y `'sent'`).

- **R15**: WHILE un recordatorio tiene `status === 'scheduled'` y
  `recurrence !== null` THE SYSTEM SHALL ofrecer como acción de la fila
  `reminder-cancel-series-${id}` con el texto «Cancelar\nserie» y
  accessibilityLabel «Cancelar la serie <título>», con la misma receta que
  Eliminar (`h-11 rounded-14 px-2.5 ${CATEGORY_SLOTS.rose.surface}`, variante
  `danger-soft`, texto `text-13 font-extrabold text-danger`), y no renderizar
  `reminder-delete-${id}`; en cualquier otro caso la fila conserva
  `reminder-delete-${id}` «Eliminar» como hoy. Ambas acciones son el mismo
  elemento `<Button>` con testID, texto, etiqueta y `onPress` según el caso.
  Test: `src/screens/reminders/index.test.tsx` ::
  `#213 R15: la serie programada ofrece Cancelar serie y el puntual Eliminar`
  y `#213 R15: una serie cancelada o enviada conserva Eliminar`.
  Ancla: `grep -cF "rounded-14 px-2.5" src/screens/reminders/index.tsx` = 1.

- **R16**: THE SYSTEM SHALL mostrar el badge `reminder-upcoming-${id}` con el
  texto «Hoy» (en-US «Today») y el borde `border-2 border-category-amber` solo
  cuando `status === 'scheduled'` y `daysUntil(now, dueAt) === 0` (firma
  `daysUntil(from, to)` de `src/utils/reminder-dates.ts`); con 1 o más
  días, o con días negativos, la fila no lleva badge y lleva
  `border border-border`. El valor de `reminders.upcoming` pasa de «¡Próximo!»
  a «Hoy». Los tests existentes que asertaban el badge con el umbral de 10
  días se enmiendan (lista exacta en `tasks.md` §R16) añadiendo
  «(enmendado por #213 R16)» a su nombre.
  Test: `src/screens/reminders/index.test.tsx` ::
  `#213 R16: el badge Hoy y el borde ámbar solo marcan el día de hoy`
  (hoy 31 dic 2026 08:00 local: `dueAt` 31 dic 20:00 → badge; 1 ene 2027
  09:00 → sin badge; 30 dic 2026 09:00 → sin badge).

### Hoja «Cancelar serie»

- **R17**: WHEN el usuario pulsa `reminder-cancel-series-${id}` THE SYSTEM
  SHALL abrir el mismo `BottomSheet` de la pantalla (un único
  `community-bottom-sheet` en el host `reminders-delete-host`) con
  `reminders-cancel-series-sheet` y sin `reminders-delete-sheet`, que contiene
  en orden: `reminders-cancel-series-icon` (icono `Repeat` 26 en el tile rosa
  de la hoja de borrar), el título «¿Cancelar la serie?», la referencia
  `reminders-cancel-series-reference` «<título> · <cadencia>» (cadencia de
  R14, sin hasta), el cuerpo «No volveré a avisarte de <título> de <mascota>.
  Si cambias de idea, puedes crear el recordatorio otra vez.» (sin mascota
  conocida: «No volveré a avisarte de <título>. Si cambias de idea, puedes
  crear el recordatorio otra vez.»), el botón `reminders-cancel-series-confirm`
  «Cancelar la serie» con la receta del confirm de borrar y el botón
  `reminders-cancel-series-keep` «Mantener la serie» con la receta del cancel
  de borrar. WHEN el usuario pulsa `reminder-delete-${id}` THE SYSTEM SHALL
  seguir abriendo `reminders-delete-sheet` sin `reminders-cancel-series-sheet`.
  Test: `src/screens/reminders/index.test.tsx` ::
  `#213 R17: Cancelar serie abre la hoja con su copy` (fixture «Pipeta
  antipulgas», `{month,1}`, mascota «Rocky»: referencia exacta
  `Pipeta antipulgas · cada mes`, cuerpo exacto
  `No volveré a avisarte de Pipeta antipulgas de Rocky. Si cambias de idea, puedes crear el recordatorio otra vez.`),
  `#213 R17: sin nombre de mascota el cuerpo omite la mascota`,
  `#213 R17: las dos hojas comparten un solo BottomSheet`.
  Esperas: la fila se espera con `await screen.findByTestId('reminder-cancel-series-<id>')`
  y el cuerpo con el nombre de la mascota con
  `await waitFor(() => expect(<cuerpo>).toHaveTextContent(<texto>))`, sobre el
  árbol, nunca sobre el contador de `listPets` ni de `listReminders`.

- **R18**: WHEN el usuario pulsa `reminders-cancel-series-confirm` THE SYSTEM
  SHALL llamar una vez `cancelReminderSeries(baseUrl, token, reminderId)`,
  cerrar la hoja y, con `ok`, `not-found` o `not-editable`, invalidar
  `reminderKeys.list(petId)` (observable como una nueva llamada a
  `listReminders`); IF el resultado es `forbidden` THEN mostrar en
  `reminders-action-error` «Solo el dueño puede cancelar la serie»; IF es
  `unreachable` THEN el texto de `common.cannotReachServer`; IF es `unauthorized` THEN llamar `signOut`;
  IF es `error` o `missing-config` o la llamada lanza THEN el texto de
  `common.somethingWentWrong`. El handler es el del borrado calcado: un
  `switch` sobre `result.kind` dentro de `try` y un `catch` que escribe
  `common.somethingWentWrong`, de modo que el fichero gana una llamada
  `t('common.cannotReachServer'` y dos `t('common.somethingWentWrong'` (rama
  `error`/`missing-config` y `catch`; ver R22). WHEN el usuario pulsa
  `reminders-cancel-series-keep` o cierra la hoja THE SYSTEM SHALL cerrarla sin
  llamar `cancelReminderSeries`. No existe «cancelar solo esta vez».
  Test: `src/screens/reminders/index.test.tsx` ::
  `#213 R18: confirmar cancela la serie e invalida la lista con %s` (it.each
  `ok`, `not-found`, `not-editable`),
  `#213 R18: confirmar con %s muestra su error` (it.each de cinco filas,
  `forbidden`, `unreachable`, `error`, `missing-config` con
  `mockResolvedValue({ kind: <fila> … })` y `throws` con
  `mockRejectedValue(new Error('x'))`; texto exacto del catálogo es-MX:
  `throws`, `error` y `missing-config` →
  el valor es-MX de `common.somethingWentWrong`, `unreachable` → el de
  `common.cannotReachServer`, `forbidden` → «Solo el dueño puede cancelar la
  serie»),
  `#213 R18: confirmar con unauthorized cierra sesión`,
  `#213 R18: Mantener la serie cierra sin llamar a la API`.
  Esperas, sobre el árbol: el error con
  `await waitFor(() => expect(screen.getByTestId('reminders-action-error')).toHaveTextContent(<texto>))`;
  la invalidación con el patrón de `refetches and removes the row after $kind`
  del mismo fichero: `mockListReminders` encadena
  `.mockResolvedValueOnce({ kind: 'ok', reminders: [<la serie>] })` y
  `.mockResolvedValueOnce({ kind: 'ok', reminders: [] })`, el test espera
  `await waitFor(() => expect(screen.queryByTestId('reminder-row-<id>')).toBeNull())`
  y solo después aserta `expect(mockListReminders).toHaveBeenCalledTimes(2)`.

- **R19**: WHILE la hoja «Cancelar serie» está abierta THE SYSTEM SHALL pasar
  al `BottomSheet` el mismo `backgroundStyle` que #218 fija para la hoja de
  borrar, es decir `flat(sheet.props.backgroundStyle)` igual a
  `{ backgroundColor: 'color:surface' }` con el doble de `useThemeColors` del
  fichero. Precondición: #218 está mergeada en `origin/dev` y la rama de #213
  la incorpora con `git merge origin/dev` (ver `design.md` §Orden de merge).
  Test: `src/screens/reminders/index.test.tsx` ::
  `#213 R19: la hoja Cancelar serie hereda el fondo surface de #218`.
  Ancla (tras el merge): `grep -cF "backgroundStyle" src/screens/reminders/index.tsx` = 1
  y `grep -cE "<BottomSheet([^A-Za-z]|$)" src/screens/reminders/index.tsx` = 1
  (la expresión no cuenta `<BottomSheetView>`; es la misma regla que
  `/<BottomSheet(?![A-Za-z])/g` de `src/__tests__/sheet-surface-background.test.ts`
  de #218; medida = 1 en wt-218 con #218 implementada).

### Push

- **R20**: WHEN el usuario toca una notificación cuyo `data.kind === 'reminder'`
  THE SYSTEM SHALL navegar (en caliente y en frío) a
  `{ pathname: '/reminders', params: { petId } }` cuando `data.petId` es un
  string no vacío, y a `'/reminders'` en otro caso; los datos sin
  `kind === 'reminder'` conservan las rutas de #100 R7 (la fila
  `{ reminderId: 'r-1' }` sigue yendo a `'/alerts'`).
  Test: `src/hooks/use-push-registration.test.tsx` ::
  `#213 R20: el toque de un recordatorio abre Recordatorios con data %p en modo %s`
  (it.each: `{petId:'pet-2', reminderId:'r-1', kind:'reminder'}` →
  `{pathname:'/reminders', params:{petId:'pet-2'}}`; `{kind:'reminder'}`,
  `{kind:'reminder', petId:''}` y `{kind:'reminder', petId:7}` →
  `'/reminders'`; cada fila en `hot` y `cold`). Este `it` es de un hook sin
  árbol, así que espera al doble del router como los `it` de #100 R7 del mismo
  fichero; esa excepción no vale para los `it` de pantalla (R12, R13, R17,
  R18, R21), que esperan sobre el árbol.

- **R21**: WHEN «Recordatorios» se abre con el parámetro de ruta `petId` y esa
  mascota está en `listPets` THE SYSTEM SHALL seleccionarla con
  `selectPet(petId)` y listar sus recordatorios; IF `petId` no está en la
  lista THEN la selección sigue la regla actual de `usePetSelection` (primera
  mascota).
  Test: `src/screens/reminders/index.test.tsx` ::
  `#213 R21: el parámetro petId selecciona su mascota` (mascotas `pet-1`
  «Luna» y `pet-2` «Rocky», params `{petId:'pet-2'}`: espera sobre el árbol
  con `await waitFor(() => expect(screen.getByTestId('pet-chip-pet-2').props.accessibilityState).toEqual({ selected: true }))`,
  el patrón del `it` de carga del mismo fichero, y después aserta que la
  última llamada a `listReminders` recibe `'pet-2'`) y
  `#213 R21: un petId desconocido deja la primera mascota` (misma espera con
  `pet-chip-pet-1`).

### Catálogo y guardas

- **R22**: THE SYSTEM SHALL añadir al catálogo es-MX y en-US las 54 claves
  nuevas de `design.md` §Copy (32 `addReminder.*` y 22 `reminders.*`) con los
  mismos marcadores `{{…}}` en ambos idiomas, cambiar el valor de
  `reminders.upcoming`, y mantener verdes las guardas con estos deltas
  exactos: `R8_REMINDERS` de `src/__tests__/ui-copy-table.ts` +57 filas (54
  claves nuevas + 3 ocurrencias nuevas en `src/screens/reminders/index.tsx`
  del handler de R18: 1 `common.cannotReachServer` y 2
  `common.somethingWentWrong`), el recuento de `#194 R1` +54, los iconos de
  `#178 R13`, los radios de `design-drift` y la lista cerrada de guardas de
  `design-drift`, `alerts-canvas-fidelity`, `consistency-classnames` y
  `chunky-cta-canvas-fidelity` según `tasks.md` §R22; `SCREEN_FILES` no cambia.
  Test: `src/providers/__tests__/language-provider.test.tsx` ::
  `#213 R22: claves de recurrencia en ambos idiomas` (it.each de las 54
  claves más `reminders.upcoming` con su valor es-MX y en-US exacto) y los
  tests enmendados que lista `tasks.md` §R22.

## Fuera de alcance

- La hora relativa «Hoy, 16:00 · en 2 horas» del artboard: la línea de fecha
  de la fila conserva su formato actual.
- El icono de repetición tachado de la hoja: reicon no lo tiene; se usa
  `Repeat` (ver `design.md` §Desviaciones).
- Editar una serie (cambiar cadencia, hasta o aviso) y «cancelar solo esta
  vez»: no existen en el backend #210 ni en esta feature.
- Aviso anticipado en «Cada N horas»: el aviso se oculta y vale 0.
- Ajuste de horario de verano en «Cada N horas»: el backend suma horas
  absolutas (#210); la nota calcula igual y no corrige cambios de horario.
- Días 29, 30 y 31 en «Mensual»: el backend los recorta al último día del mes
  (#210); la nota dice el día elegido sin advertir el recorte.
- Mensaje específico para el 400 «Invalid recurrence» de `createReminder`:
  sigue mapeado a `invalid` y a su texto actual.
- Mostrar en la lista series con estado distinto de `scheduled` de forma
  especial: se pintan como cualquier recordatorio inactivo.

## Aprobación

- [x] Aprobado por humano (fecha: 2026-10-26) ← gate obligatorio antes de implementar
- [ ] Smoke de #213 en dev build por el humano (fecha: ____): crear un recordatorio recurrente,
      recibir el push real de dos ocurrencias seguidas (`PUSH_ENABLED=true`), deslizar las filas
      de chips de tipo y de aviso, y cancelar la serie desde la hoja de Recordatorios.
      Va en el lote G4 de `progress/smoke_mejoras-producto.md`. No bloquea tareas; bloquea `done`.

## Errata del leader tras la parada en R6 (2026-10-27)

- **E1 — Nombre del `it` del punto 9 de `tasks.md` §R22.** La lista de `text-15`
  no vive en `declara el secundario compacto y el reintento sin labio …`
  (`alerts-canvas-fidelity.test.ts`, que solo comprueba la carta), sino en el
  `it.each` `limita $token a su inventario de producción …` del `describe`
  `#174 R12`, caso `token: 'text-15'`. Ancla:
  `grep -cF "])('limita \$token a su inventario de producción" __tests__/alerts-canvas-fidelity.test.ts` → 1.
  El sufijo ` (enmendado por #213 R22)` va al final del título del `it.each`.
  La fila nueva (`'screens/add-reminder/index.tsx', // #213 R6`), su sitio y el
  delta no cambian. La intención no cambia. Lo detectó Codex en R6
  (`progress/impl_mobile-reminders-recurrence.md` §Discrepancia de R22 punto 9).
- **E2 — Orden de la consulta de mascotas en `tasks.md` §R12 y §R13.** La tabla
  de R12 ya pinta «Rocky», así que su verde necesita el nombre de la mascota.
  El `QueryClientProvider`, el doble de `listPets` con `beforeEach` de nivel
  superior y `useQuery(petKeys.list())` pasan de R13 a R12. R13 conserva su
  `it.each` de tres filas y la variante `summaryHoursDosesNoPet`. Ningún
  requisito, literal ni candado cambia. Lo preguntó Codex antes de R12.

## Errata del leader tras el rechazo del reviewer (2026-10-27)

- **E3 — R21 aplica el parámetro una vez por valor.** La revisión de `44644e48`
  (`progress/review_mobile-reminders-recurrence.md`, B1) mostró que el efecto de
  R21 vuelve a llamar a `selectPet(petId)` cada vez que cambia `selectedPetId`.
  Con `petId` en la ruta, el usuario no puede cambiar de mascota. La intención
  de R21 no cambia: seleccionar la mascota del parámetro cuando llega, no
  fijarla. Se añade un tercer test a R21:
  `#213 R21: tras abrir con petId se puede elegir otra mascota` (mascotas
  `pet-1` «Luna» y `pet-2` «Rocky», params `{petId:'pet-2'}`: misma espera a
  `pet-chip-pet-2` seleccionada, `await fireEvent.press` sobre `pet-chip-pet-1`,
  espera a `pet-chip-pet-1` con `accessibilityState` `{ selected: true }` y
  aserta que la última llamada a `listReminders` recibe `'pet-1'`). El efecto
  no depende de `selectedPetId`, y un `petId` desconocido no provoca un bucle
  de render.

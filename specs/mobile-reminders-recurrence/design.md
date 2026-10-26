---
feature: "mobile-reminders-recurrence"
status: draft        # draft | approved
tags: [mobile, reminders, recurrence, spec]
---

# Diseño — [[mobile-reminders-recurrence]] (#213)

> Ver [[requirements]] para los requisitos. Capa única: presentación móvil
> (`mobile-pet-tracker/`), regida por `docs/ui-guidelines.md`. El contrato de
> backend es el de #210 (`specs/reminders-recurrence/`), ya en `dev`. Rutas
> relativas a `mobile-pet-tracker/`.

## Artboards congelados (`canvas/`)

Canvas https://claude.ai/artifact/VqaQQsRTtis9Dbttqy3z7j. Los cuatro ficheros
de `canvas/` están verificados idénticos a la v140 (id de versión
`1793036268-d302`, la que aprobó G1) el 2026-10-26 por el leader, sha256 a
sha256. El copy de los cuatro artboards coincide con la tabla aprobada en G1
(design doc de la ola 0, §Artboards nuevos). Hashes de lo congelado:

| Fichero | sha256 |
|---|---|
| `canvas/NuevoRecordatorioRepeticion.dc.html` | `1672998c207affae6f5f55562f0339ef342e8167cba819f76dfb340540be0860` |
| `canvas/NuevoRecordatorioCadaNHoras.dc.html` | `f99062f1763d25b4c30293bc10bbb8ca8b918d7865fb1f0c58ffa62cfc8147e6` |
| `canvas/RecordatoriosRecurrentes.dc.html` | `84c7835e63442e4ba6419f804aae383e29d2e3e2a937e79ad3d1c21f86e6c496` |
| `canvas/RecordatoriosCancelarSerie.dc.html` | `c4c6f809fe79eac2c71b70683620fb77cb9f29abe4e6bf3bb6c977b6f43e503a` |

## Decisiones técnicas

### Datos y API (R1–R3)

- `src/api/types.ts`: `Recurrence` exportado; `Reminder` gana
  `recurrence: Recurrence | null` y `recurrenceUntil: string | null`
  obligatorios. Obligatorios porque el backend #210 siempre los devuelve; al
  serlo, typecheck obliga a actualizar los fixtures tipados `Reminder`
  (`recurrence: null, recurrenceUntil: null`): `src/api/__tests__/reminders.test.ts`,
  `src/screens/home/format.test.ts`, `src/screens/home/index.test.tsx`,
  `src/screens/add-reminder/index.test.tsx` (`makeReminder`) y
  `src/screens/reminders/index.test.tsx` (`makeReminder`). Codex corre
  `bunx tsc --noEmit` para encontrar cualquier otro.
- `CreateReminderInput` gana `recurrence?: Recurrence` y
  `recurrenceUntil?: string`. `createReminder` añade cada clave al cuerpo solo
  si está definida (spread condicional), para que los cuerpos de «Una vez»
  sigan siendo de cuatro claves y los tests existentes con cuerpo exacto no
  cambien.
- `cancelReminderSeries(baseUrl, token, reminderId, fetchFn = fetch)` en
  `src/api/reminders.ts`, calcado de `deleteReminder` pero con `patchJson`
  (`src/api/http.ts`) y ruta `/reminders/${reminderId}` (la ruta de #210, sin
  `petId`). Estado exportado `CancelReminderSeriesState` = `ok | not-found |
  not-editable | forbidden | unauthorized | error | unreachable(message) |
  missing-config`. 409 («Reminder is not editable») se trata como éxito en la
  pantalla: la serie ya no está programada, y refrescar la lista es lo
  correcto.

### Formulario (R4–R13)

- Estado nuevo en `AddReminderContent`: `repeat: 'once' | Recurrence['unit']`
  (nace `'once'`), `hourEvery` (nace 8), `monthEvery` (nace 1),
  `until: Date | null`. Cada unidad guarda su valor (R7).
- `REPEAT_OPTIONS` constante al estilo de `ADVANCE_OPTIONS`:
  `{ key: 'once' | 'day' | 'week' | 'month' | 'year' | 'hour', labelKey }`, con
  `labelKey: 'addReminder.repeatOnce'` … `'addReminder.repeatHourly'`. Así cada
  clave aparece una sola vez como `labelKey:` y `checkUses` la cuenta.
- Orden de secciones: Tipo, Título, Fecha/Hora, Repetición, stepper (solo
  `hour` y `month`), Hasta (no `once`), Aviso (no `hour`), nota, Guardar.
  La guarda de design-drift «sitúa la vista previa después de Aviso y antes de
  Guardar» sigue verde porque compara posiciones en el fuente.
- Filas de Tipo y Aviso (R5): `ScrollView horizontal` con `-mr-5` y
  `paddingRight: 20`, para sangrar hasta el borde derecho como el artboard
  (la `ScrollView` del formulario tiene `paddingHorizontal: 20`). `-mr-5` es
  clase estándar (20 px), no valor arbitrario: `#193 R11` no la veta.
  testID `type-chips-row` y `advance-chips-row`, con `chips` en plural:
  `type-chip-row` casaría con el selector `/^type-chip-/` del `it`
  `renders all reminder types and selects vaccine by default` (7 → 8) y
  `advance-chip-row` con `/^advance-chip-/` de
  `renders alert choices and selects seven days by default` (4 → 5). Medido:
  ninguna de las 51 expresiones regex de testID de los tests de `src/` casa con
  los dos nombres nuevos.
- Stepper (R6, R7): un solo bloque JSX para las dos unidades, receta del
  artboard: fila `flex-row items-center gap-3 rounded-16 bg-default p-2` con
  `style={CONTINUOUS_CORNER}`; «Cada» `text-15 font-extrabold text-foreground`;
  botones `Pressable` (no `Button` de HeroUI, para no caer en twMerge)
  `size-11 items-center justify-center rounded-full border-2 border-lip-gray bg-surface`
  con iconos `Minus` y `Plus` de reicon (20, color `foreground`) y
  `hitSlop={TOUCH_SLOP}`; el color sale de la llamada existente
  `useThemeColors(['muted', 'accent-strong'])` de `AddReminderContent`, que
  pasa a `useThemeColors(['muted', 'accent-strong', 'foreground'])` con
  `const [muted, accentStrong, foreground] = …` (no se añade una segunda
  llamada a `useThemeColors(`); valor `text-22 font-black text-foreground` con
  `accessibilityLiveRegion="polite"` y `min-w-21 text-center`; ayuda
  `repeat-every-help` `text-13 font-semibold text-muted` bajo la fila. Botón en
  extremo: `disabled` + `opacity-50`. Las claves singulares/plurales se usan
  con ternario de llamadas completas (`every === 1 ? t('addReminder.hoursValueOne') : t('addReminder.hoursValue', { count: every })`)
  para que cada clave aparezca una vez como `t('…'`.
- Hasta (R8): `DateField` existente con `allowClear`; etiqueta en
  `flex-row items-center justify-between` con «Hasta»
  (`text-sm font-extrabold text-foreground`) y «Opcional»
  (`text-13 font-semibold text-muted`). Al cambiar la Fecha, si `until` es
  anterior a la nueva fecha se vacía. El cuerpo lleva
  `recurrenceUntil: localDateToIso(until)`.
- Aviso con «Cada N horas» (R9): no se renderiza y `advanceMinutes` es 0; el
  cálculo de `notifyAt` usa 0.
- Nota (R11, R12): reutiliza el contenedor `add-reminder-preview` actual
  (`rounded-tile bg-surface-secondary`); solo cambian el icono (`Repeat` con
  repetición, `Bell` con «Una vez») y el texto. Una función pura en el mismo
  fichero, `summaryText(...)`, elige la clave según la unidad. Formatos:
  hora `toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })`;
  día del mes `notifyAt.getDate()`; día de la semana
  `toLocaleDateString(locale, { weekday: 'long' })`; fecha anual
  `{ day: 'numeric', month: 'short' }`; hasta
  `{ day: 'numeric', month: 'short', year: 'numeric' }` (el mismo que muestra
  `DateField`). Verificado en node con ICU del repo: `10 abr 2027`,
  `miércoles` (30 dic 2026), `31 dic`.
- Regla de tomas (R12): N ∈ {6, 8, 12, 24} lista tomas; el resto, frase de
  intervalo. Motivo: con N < 6 la lista pasa de cuatro tomas y no cabe en la
  nota; con N que no divide 24 las tomas no se repiten cada día y la lista
  engaña. La unión se llama con la forma corta de propiedades:
  `const list = doses.slice(0, -1).join(', ');`,
  `const last = doses[doses.length - 1];` y
  `t('addReminder.dosesJoin', { list, last })`. La forma `last: …` casa con
  `/\b(?:last|first|odd|even):/` de `#62 R6 … variantes de posición`
  (`src/__tests__/consistency-classnames.test.ts`) y la tumba. Ancla:
  `grep -cE "\b(last|first|odd|even):" src/screens/add-reminder/index.tsx` = 0.
- Nombre de mascota (R13): `useQuery(petKeys.list())` comparte caché con
  Recordatorios (que ya la cargó), así que en la app no hay petición extra.
  Los tests del fichero ganan `QueryClientProvider` y el doble de `listPets`.
  Ojo: el `afterEach` de `#178 R12` llama `jest.restoreAllMocks`, por eso el
  valor por defecto de `listPets` se fija en un `beforeEach` de nivel
  superior, no en la fábrica.

### Lista y hoja (R14–R19)

- Cadencia: una función pura `cadenceText(recurrence, t)` en
  `src/screens/reminders/index.tsx`, usada por la línea de la fila (R14) y por
  la referencia de la hoja (R17). Cada clave `reminders.cadence*` aparece una
  vez.
- `recurrenceUntil` se convierte con `isoToLocalDate` (fecha civil local),
  nunca con `new Date('YYYY-MM-DD')`, que es medianoche UTC y en
  `America/Mexico_City` cae el día anterior.
- Acción de fila (R15): un único `<Button>`, para no sumar un `rounded-14`
  más al inventario de radios.
- Badge «Hoy» (R16): la variable `upcoming` pasa a
  `!inactive && days === 0`; el artboard pinta badge y borde ámbar solo en la
  fila de hoy y deja sin ellos la fila a cuatro días.
- Badge: `daysUntil(now, dueAt)` con la firma `daysUntil(from, to)` de
  `src/utils/reminder-dates.ts`, el mismo orden que la llamada actual
  `daysUntil(new Date(), due)`.
- Hoja compartida (R17): un único `BottomSheet`. `index` es 0 cuando
  `deleteCandidate` o `cancelCandidate` no es `null`; `onClose` y la limpieza
  de `useFocusEffect` vacían los dos. Dentro de `BottomSheetView` se pinta
  `reminders-cancel-series-sheet` o `reminders-delete-sheet`. La hoja de
  cancelar es un `View` hermano con la misma receta de contenedor
  (`items-center gap-3 bg-surface px-5 pb-9 pt-3`) y botones con las mismas
  clases que confirm/cancel de borrar (dos `rounded-16` nuevos).
- Invalidación (R18): `useQueryClient().invalidateQueries({ queryKey: reminderKeys.list(petId) })`.
  Mapeo de errores con las mismas claves que el borrado, salvo `forbidden`,
  que tiene su propia clave. El handler es el del borrado calcado: `try` con
  `switch` sobre `result.kind` y `catch` con `common.somethingWentWrong`. Deja
  en `reminders/index.tsx` una llamada `t('common.cannotReachServer'` más (base
  1 → 2) y dos `t('common.somethingWentWrong'` más (base 3 → 5): +3 filas
  comunes en `R8_REMINDERS` (R22). Fundir el `catch` con la rama `error` no
  está permitido: cambiaría la cifra de R22.

### Fondo de la hoja y orden de merge con #218 (R19)

Verificado en `/home/claude/sites/Pet-Tracker-wt-218` (HEAD `3859b70f`, solo
spec; re-medido el 2026-10-26 en HEAD `dce08a78`, con #218 implementada, y
sigue igual): #218 añade a `src/screens/reminders/index.tsx`
`const [surface] = useThemeColors(['surface']);` y
`backgroundStyle={{ backgroundColor: surface }}` en el `BottomSheet`, y trae
`src/__tests__/sheet-surface-background.test.ts` con
`it.each(importers)('#218 R3: %s monta un BottomSheet con backgroundStyle surface')`,
que exige **un** `<BottomSheet` por fichero y **una** aparición de esa
`backgroundStyle`. Por eso la hoja «Cancelar serie» no declara un
`BottomSheet` ni un `backgroundStyle` propios (rompería #218 R3): reutiliza el
único `BottomSheet`, hereda su fondo y R19 lo canda en tiempo de ejecución.

- **Orden previsto: #218 primero** (ya firmada y en Codex). El Codex de #213
  empieza con `git merge origin/dev` y comprueba
  `grep -cF "backgroundStyle" mobile-pet-tracker/src/screens/reminders/index.tsx`
  = 1. Si da 0, #218 aún no está en `dev`: Codex para y lo anota en
  `progress/impl_mobile-reminders-recurrence.md`; no escribe R19 por su cuenta.
- **Si #213 mergeara primero** (no previsto), #213 se mergea sin R19 y el
  leader mueve R19 a #218 como enmienda al mergear: #218 añade a su R1 el caso
  de la hoja de cancelar. El candado estático de #218 R3 ya cubre el fichero
  porque sigue habiendo un solo `BottomSheet`.
- Efecto en inventarios de #218: ninguno. #213 no añade `useThemeColors(` ni
  `backgroundStyle` ni `<BottomSheet` a `reminders/index.tsx`. El color
  `accent-strong` del icono `Repeat` de R14 se añade al final de la llamada
  cuyo array empieza por `'category-blue-strong'` y acaba en `'danger'`:
  `const [blueInk, amberInk, greenInk, violetInk, roseInk, muted, accentForeground, danger, accentStrong] = useThemeColors([`
  … `'muted', 'accent-foreground', 'danger', 'accent-strong',`. Nunca a
  `useThemeColors(['surface'])` de #218, que su guarda lee tal cual. Ancla
  (tras el merge con #218):
  `grep -cF "useThemeColors(" src/screens/reminders/index.tsx` = 2, la misma
  cifra que en `dev` con #218 (base sin #218: 1).

### Orden de merge con #208, #209, #214 y #218

Regla: quien mergee después hace `git merge origin/dev` (nunca rebase), suma
los deltas de los demás en las expresiones de mano y re-mide con los tests;
el delta propio de #213 es el de R22 y su lista cerrada de `tasks.md` §R22.
Lo que comparte #213 con cada una:

- **#208** y **#209**: `src/__tests__/ui-copy-table.ts` y el recuento de
  `#194 R1`. #208 reserva `R19_VACCINE_CREATE` (+1 `SCREEN_FILES`) y #209
  `R20_NUTRITION_QUESTIONNAIRE`. #213 no crea bloque: añade filas a
  `R8_REMINDERS`. Las tres suman en `#194 R1` y `#186 R5`. #209 comparte
  además los agregados de `chunky-cta-canvas-fidelity`,
  `consistency-classnames` y `design-drift`.
- **#214**: `src/__tests__/ui-copy-table.ts` (bloque `R21_PET_MEMBERS`),
  `src/__tests__/ui-language.test.ts` (`#186 R5`, `#65 R18`), los totales de
  esquinas de `src/__tests__/consistency-classnames.test.ts` que #213 sube en
  +1 (el de `fusiona la esquina…` 55 → 56 y el de `#98 R10 … deja
  CONTINUOUS_CORNER…` 53 → 54; #214 los mueve con la fila de
  `profile/index.tsx`) y los fixtures de `src/screens/home/index.test.tsx`
  (#213 les añade `recurrence: null, recurrenceUntil: null`).
- **#218**: `src/screens/reminders/index.tsx` (la llamada
  `useThemeColors(['surface'])` y el `backgroundStyle` del `BottomSheet`); ver
  §Fondo de la hoja.
- **Fixtures `Reminder` tipados (A16)**: R1 hace obligatorios `recurrence` y
  `recurrenceUntil`. Cuando la segunda de #213 y #208, o de #213 y #214,
  mergee en `dev`, todo fixture `Reminder` tipado que haya añadido #208 o #214
  gana `recurrence: null, recurrenceUntil: null`; quien mergea segundo lo hace
  en su rama y lo encuentra con `bunx tsc --noEmit`.

### Push (R20, R21)

- `notificationHref` en `src/hooks/use-push-registration.ts`: si
  `data.kind === 'reminder'`, devuelve
  `{ pathname: '/reminders', params: { petId } }` con `petId` string no vacío,
  o `'/reminders'`; si no, la lógica de alertas de hoy. El payload viene de
  `backend-pet-tracker/src/workers/notifier/notifier-consumer.service.ts`
  (`{ petId, reminderId, kind: 'reminder' }`).
- `RemindersScreen` lee `useLocalSearchParams<{ petId?: string }>()` y, en un
  efecto, llama `selectPet(petId)` cuando `petId` está en la lista de
  mascotas cargada y difiere de `selectedPetId`.

## Copy

Valores literales. Las 54 claves son nuevas salvo la última fila. Cada clave
aparece exactamente una vez en el código (como `t('…'` o `labelKey: '…'`).

| Clave | es-MX | en-US | Origen |
|---|---|---|---|
| `addReminder.repeat` | Repetición | Repeat | artboard |
| `addReminder.repeatOnce` | Una vez | Once | artboard |
| `addReminder.repeatDaily` | Diario | Daily | artboard |
| `addReminder.repeatWeekly` | Semanal | Weekly | artboard |
| `addReminder.repeatMonthly` | Mensual | Monthly | artboard |
| `addReminder.repeatYearly` | Anual | Yearly | artboard |
| `addReminder.repeatHourly` | Cada N horas | Every N hours | artboard |
| `addReminder.every` | Cada | Every | artboard |
| `addReminder.hoursValue` | {{count}} horas | {{count}} hours | artboard |
| `addReminder.hoursValueOne` | 1 hora | 1 hour | sin artboard |
| `addReminder.monthsValue` | {{count}} meses | {{count}} months | decisión 7–10 |
| `addReminder.monthsValueOne` | 1 mes | 1 month | sin artboard |
| `addReminder.hoursRange` | De 1 a 24 horas. | From 1 to 24 hours. | artboard |
| `addReminder.monthsRange` | De 1 a 12 meses. | From 1 to 12 months. | decisión 7–10 |
| `addReminder.hourLess` | Una hora menos | One hour less | artboard |
| `addReminder.hourMore` | Una hora más | One hour more | artboard |
| `addReminder.monthLess` | Un mes menos | One month less | sin artboard |
| `addReminder.monthMore` | Un mes más | One month more | sin artboard |
| `addReminder.until` | Hasta | Until | artboard |
| `addReminder.optional` | Opcional | Optional | artboard |
| `addReminder.untilPlaceholder` | Sin fecha de fin | No end date | sin artboard |
| `addReminder.summaryDaily` | Te aviso cada día a las {{time}}{{until}}. | I'll remind you every day at {{time}}{{until}}. | sin artboard |
| `addReminder.summaryWeekly` | Te aviso cada {{weekday}} a las {{time}}{{until}}. | I'll remind you every {{weekday}} at {{time}}{{until}}. | sin artboard |
| `addReminder.summaryMonthly` | Te aviso el día {{day}} de cada mes a las {{time}}{{until}}. | I'll remind you on day {{day}} of every month at {{time}}{{until}}. | artboard |
| `addReminder.summaryMonthlyN` | Te aviso el día {{day}} cada {{count}} meses a las {{time}}{{until}}. | I'll remind you on day {{day}} every {{count}} months at {{time}}{{until}}. | sin artboard |
| `addReminder.summaryYearly` | Te aviso cada año el {{date}} a las {{time}}{{until}}. | I'll remind you every year on {{date}} at {{time}}{{until}}. | sin artboard |
| `addReminder.summaryHoursDoses` | Te aviso en cada toma de {{pet}}: {{doses}}{{until}}. | I'll remind you at each of {{pet}}'s doses: {{doses}}{{until}}. | artboard |
| `addReminder.summaryHoursDosesNoPet` | Te aviso en cada toma: {{doses}}{{until}}. | I'll remind you at each dose: {{doses}}{{until}}. | sin artboard |
| `addReminder.summaryHours` | Te aviso cada {{count}} horas desde las {{time}}{{until}}. | I'll remind you every {{count}} hours from {{time}}{{until}}. | sin artboard |
| `addReminder.summaryHourly` | Te aviso cada hora desde las {{time}}{{until}}. | I'll remind you every hour from {{time}}{{until}}. | sin artboard |
| `addReminder.summaryUntil` | , hasta el {{date}} | , until {{date}} | artboard |
| `addReminder.dosesJoin` | {{list}} y {{last}} | {{list}} and {{last}} | artboard |
| `reminders.repeatsEvery` | Se repite {{cadence}}{{until}} | Repeats {{cadence}}{{until}} | artboard |
| `reminders.cadenceHour` | cada hora | every hour | sin artboard |
| `reminders.cadenceHours` | cada {{count}} horas | every {{count}} hours | artboard |
| `reminders.cadenceDay` | cada día | every day | sin artboard |
| `reminders.cadenceDays` | cada {{count}} días | every {{count}} days | sin artboard |
| `reminders.cadenceWeek` | cada semana | every week | sin artboard |
| `reminders.cadenceWeeks` | cada {{count}} semanas | every {{count}} weeks | sin artboard |
| `reminders.cadenceMonth` | cada mes | every month | artboard |
| `reminders.cadenceMonths` | cada {{count}} meses | every {{count}} months | sin artboard |
| `reminders.cadenceYear` | cada año | every year | artboard |
| `reminders.cadenceYears` | cada {{count}} años | every {{count}} years | sin artboard |
| `reminders.untilDay` | ` · hasta el {{date}}` | ` · until {{date}}` | artboard |
| `reminders.untilMonth` | ` · hasta {{date}}` | ` · until {{date}}` | artboard |
| `reminders.cancelSeries` | Cancelar\nserie | Cancel\nseries | artboard |
| `reminders.cancelSeriesA11y` | Cancelar la serie {{title}} | Cancel the {{title}} series | artboard |
| `reminders.cancelSeriesTitle` | ¿Cancelar la serie? | Cancel the series? | artboard |
| `reminders.cancelSeriesReference` | {{title}} · {{cadence}} | {{title}} · {{cadence}} | artboard |
| `reminders.cancelSeriesBody` | No volveré a avisarte de {{title}} de {{pet}}. Si cambias de idea, puedes crear el recordatorio otra vez. | I won't remind you about {{title}} for {{pet}} again. If you change your mind, you can create the reminder again. | artboard (con variables) |
| `reminders.cancelSeriesBodyNoPet` | No volveré a avisarte de {{title}}. Si cambias de idea, puedes crear el recordatorio otra vez. | I won't remind you about {{title}} again. If you change your mind, you can create the reminder again. | sin artboard |
| `reminders.cancelSeriesConfirm` | Cancelar la serie | Cancel the series | artboard |
| `reminders.keepSeries` | Mantener la serie | Keep the series | artboard |
| `reminders.errorCancelForbidden` | Solo el dueño puede cancelar la serie | Only the owner can cancel the series | sin artboard |
| `reminders.upcoming` (valor cambia) | Hoy | Today | artboard |

`\n` es el salto de línea literal del valor (como «Cancelar<br>serie» del
artboard). Las celdas entre comillas invertidas empiezan con espacio.
Los apóstrofos en-US se escapan en `src/i18n/catalog.ts` como el resto del
catálogo.

### Copy sin artboard

**Decisión G1 (2026-10-26, 22:44 UTC).** El humano aprobó «tal cual» el copy
de esta tabla. La decisión se tomó en la sesión del leader. Ningún literal
cambia.

| Clave | Propuesta | Motivo |
|---|---|---|
| `hoursValueOne`, `monthsValueOne` | «1 hora», «1 mes» | el i18n no tiene plurales; el stepper llega a 1 |
| `monthLess`, `monthMore` | «Un mes menos», «Un mes más» | espejo de las etiquetas del stepper de horas |
| `untilPlaceholder` | «Sin fecha de fin» | `DateField` vacío necesita texto; dice qué pasa si no se elige |
| `summaryDaily`, `summaryWeekly`, `summaryMonthlyN`, `summaryYearly` | ver tabla | el artboard solo dibuja Mensual; mismo arranque «Te aviso…» en voz B |
| `summaryHoursDosesNoPet` | «Te aviso en cada toma: …» | el nombre de la mascota puede no estar en caché |
| `summaryHours`, `summaryHourly` | «cada N horas desde las…» | N que no da tomas diarias (R12) |
| cadencias sin dibujar | «cada día», «cada 3 días»… | el artboard dibuja horas, mes y año; mismo patrón |
| `cancelSeriesBody` | «No volveré a avisarte de {{title}} de {{pet}}…» | el artboard dice «de la pipeta de Rocky»; la decisión fija título y mascota como variables. El título se muestra tal cual lo escribió el usuario («de Pipeta antipulgas de Rocky») |
| `cancelSeriesBodyNoPet` | sin «de {{pet}}» | mascota desconocida |
| `errorCancelForbidden` | «Solo el dueño puede cancelar la serie» | espejo de `reminders.errorForbidden` para 403 |

## Desviaciones del artboard

- Icono tachado de la hoja: reicon-react-native exporta `Repeat`,
  `RepeatCircle` y `RepeatOne`, sin variante tachada. Se usa `Repeat` 26 en el
  tile rosa de la hoja de borrar.
- Stepper de meses: el artboard «Repetición» marca Mensual sin dibujar
  stepper; las respuestas 7–10 del design doc lo añaden con «3 meses» y
  «De 1 a 12 meses.». Se reutiliza la receta del stepper de horas.
- «Hoy, 16:00 · en 2 horas»: fuera de alcance; la fecha de la fila no cambia.

## Archivos afectados

- `src/api/types.ts` — `Recurrence`, campos de `Reminder` (R1).
- `src/api/reminders.ts` — `CreateReminderInput`, `createReminder`,
  `cancelReminderSeries` y `CancelReminderSeriesState` (R2, R3).
- `src/screens/add-reminder/index.tsx` — R4–R13.
- `src/screens/reminders/index.tsx` — R14–R19, R21.
- `src/hooks/use-push-registration.ts` — R20.
- `src/i18n/catalog.ts` — R22.
- Tests: `src/api/__tests__/reminders.test.ts`,
  `src/screens/add-reminder/index.test.tsx`,
  `src/screens/reminders/index.test.tsx`,
  `src/hooks/use-push-registration.test.tsx`,
  `src/providers/__tests__/language-provider.test.tsx`,
  `src/__tests__/ui-copy-table.ts`, `src/__tests__/ui-language.test.ts`,
  `src/__tests__/design-drift.test.ts`,
  `src/__tests__/alerts-canvas-fidelity.test.ts`,
  `src/__tests__/consistency-classnames.test.ts`,
  `src/__tests__/chunky-cta-canvas-fidelity.test.ts` (lista cerrada en
  `tasks.md` §R22), y los fixtures de
  `src/screens/home/format.test.ts` y `src/screens/home/index.test.tsx`.
- Sin ficheros nuevos de producción, sin dependencias nuevas, sin coste ni
  recursos AWS.

## Alternativas descartadas

- Segundo `BottomSheet` con su `backgroundStyle` para «Cancelar serie»:
  rompe #218 R3 (un `<BottomSheet` y una `backgroundStyle` por fichero).
- `recurrence` opcional en `Reminder`: evitaría tocar fixtures, pero el
  backend siempre lo envía y un campo opcional esconde el `null` real.
- Pantalla o util nuevo para las frases: añadiría filas de otro fichero al
  copy table y un fichero más a `SCREEN_FILES`; las frases viven en sus
  pantallas.
- Pasar el nombre de la mascota por parámetro de ruta a «Agregar
  recordatorio»: cambiaría las llamadas `router.push('/add-reminder')` y sus
  tests; la caché de `petKeys.list()` ya lo tiene.
- Badge con el umbral de 10 días y texto «Hoy»: contradice el artboard (fila a
  cuatro días sin badge) y diría «Hoy» de algo que no es hoy.

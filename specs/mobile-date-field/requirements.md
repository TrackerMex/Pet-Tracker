---
feature: "mobile-date-field"
status: approved
tags: [harness, spec]
---

# Requisitos — [[mobile-date-field]]

> Notación EARS. Cada requisito tiene id único R<n>, inmutable una vez aprobado.
> Ver [[design]] para las decisiones técnicas y el inventario cerrado de candados, y
> [[../../docs/architecture|architecture]] para las reglas de arquitectura.
> Origen: `progress/plan_ui-2026-10-26.md` §2, entrada #220 (punto 10 del plan de
> mejoras de UI) y `progress/explore_ui-heroui-fechas-2026-10-26.md`.
> Todas las rutas son relativas a `mobile-pet-tracker/src/` salvo que se diga otra cosa.

## Contexto y decisiones del humano (cerradas, plan §1)

- Componente propio hecho con piezas de `heroui-native` (`InputGroup`, `Label`) más
  el selector nativo de `@expo/ui`. Cero dependencias nuevas. Una sola feature que
  cubre las cuatro pantallas. `meal-schedule` queda sin cambio. `global.css` no se
  toca. Va antes que #208 y #213 (que lo consumen).
- Hoy hay cinco puntos de fecha/hora con selector nativo (Alta de mascota,
  Recordatorio fecha y hora, Horario de comidas) y dos campos de texto `YYYY-MM-DD`
  (Registro de peso y Documentos). Esta feature unifica los cuatro formularios y deja
  el Horario de comidas como está.

## Contrato público de `DateField`

Fichero: `mobile-pet-tracker/src/components/date-field.tsx`. Export nombrado
`DateField`. Cuando la spec se firma, el leader entrega a Backend este nombre y esta
ruta para las specs de #208 y #213.

| Prop | Tipo | Defecto | Significado |
|---|---|---|---|
| `testID` | `string` (obligatoria) | — | testID del disparador (nodo raíz). |
| `pickerTestID` | `string` | `` `${testID}-picker` `` | testID del selector nativo. |
| `mode` | `'date' \| 'time'` | `'date'` | Calendario o reloj. |
| `value` | `string \| null` | — (obligatoria) | `YYYY-MM-DD` en modo `date`, `HH:mm` (24 h) en modo `time`, o `null` (vacío). Un valor no analizable se trata como `null`. |
| `onChange` | `(next: string \| null) => void` | — (obligatoria) | Recibe el valor elegido en el mismo formato que `value`. Solo recibe `null` desde el botón de borrar. |
| `label` | `string` | sin etiqueta | Si se da, se pinta una etiqueta encima del disparador. |
| `placeholder` | `string` | `t('dateField.placeholderDate')` / `t('dateField.placeholderTime')` | Texto del estado vacío. |
| `minDate` | `string` (`YYYY-MM-DD`) | sin mínimo | Solo modo `date`. Día civil mínimo elegible. |
| `maxDate` | `string` (`YYYY-MM-DD`) | sin máximo | Solo modo `date`. Día civil máximo elegible. |
| `isInvalid` | `boolean` | `false` | Pinta el borde de error. El componente no pinta el mensaje. |
| `allowClear` | `boolean` | `false` | Muestra el botón de borrar cuando hay valor (para la segunda fecha opcional de #208 y el «Hasta» de #213). |

Sin `isDisabled` (YAGNI: ninguna pantalla lo pide). El componente devuelve un
Fragment sin contenedor propio: el padre del nodo `testID` es el contenedor de la
pantalla, y el `FieldErrorMessage` de la pantalla sigue siendo su hermano.

## Requisitos funcionales

### Utilidades de fecha civil

- **R1**: THE SYSTEM SHALL exponer en `utils/civil-date.ts` cuatro funciones puras
  con estas firmas y comportamientos, y WHEN reciben una entrada mal formada THEN
  THE SYSTEM SHALL devolver `null` en las dos que analizan:
  - `localDateToIso(date: Date): string` → `YYYY-MM-DD` con los campos **locales**
    `getFullYear/getMonth/getDate`, con relleno de ceros
    (`new Date(2026, 0, 5, 23, 59)` → `'2026-01-05'`; `new Date(2026, 11, 31)` →
    `'2026-12-31'`).
  - `isoToLocalDate(iso: string): Date | null` → `new Date(y, m - 1, d)` (medianoche
    local) si `iso` casa con `^\d{4}-\d{2}-\d{2}$` **y** `localDateToIso` del
    resultado devuelve el mismo texto; si no (`''`, `'bad'`, `'2026-9-4'`,
    `'2026-02-30'`, `'2026-13-01'`), `null`.
  - `timeToHhmm(date: Date): string` → `HH:mm` con `getHours/getMinutes` locales y
    relleno (`new Date(2026, 8, 24, 7, 5)` → `'07:05'`).
  - `hhmmToLocalDate(hhmm: string): Date | null` → el **día local de hoy** a esa hora
    y minuto, con segundos y milisegundos a 0, si `hhmm` casa con
    `^([01]\d|2[0-3]):[0-5]\d$`; si no (`''`, `'24:00'`, `'9:00'`, `'09:60'`),
    `null`. «Hoy» se lee del reloj (`new Date()`) dentro de la función.
  - Test: `utils/civil-date.test.ts`, `it('#220 R1: ...')`: tabla con los casos de
    arriba más el cruce de mes y de año, y para `hhmmToLocalDate` con
    `jest.useFakeTimers()` y `jest.setSystemTime(new Date(2026, 8, 24, 20, 0))`:
    `hhmmToLocalDate('09:05')` tiene `getTime()` igual a
    `new Date(2026, 8, 24, 9, 5).getTime()`.

### Disparador de `DateField` (modo fecha)

- **R2**: WHEN `mode` es `'date'` y `value` es un `YYYY-MM-DD` válido THE SYSTEM
  SHALL mostrar en el nodo `` `${testID}-value` `` (prop `value`) la etiqueta
  `date.toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' })`
  del día civil local, con `locale` de `useLocale()`. Literales (jest corre con
  `es-MX` y `en-US`): en español `'2026-09-24'` → `'24 sep 2026'`,
  `'2026-10-01'` → `'1 oct 2026'`, `'2027-01-01'` → `'1 ene 2027'`,
  `'2024-04-09'` → `'9 abr 2024'`; en inglés `'2026-09-24'` → `'Sep 24, 2026'`.
  La etiqueta no depende de la zona del dispositivo (se construye desde el día
  civil, nunca desde un instante UTC).
  - Test: `components/__tests__/date-field.test.tsx`,
    `it.each('#220 R2: ...')` con esos cinco casos leyendo
    `screen.getByTestId('field-value').props.value`.

- **R3**: IF `value` es `null` o no se puede analizar (modo `date`: `''`, `'bad'`,
  `'2026-02-30'`; modo `time`: `''`, `'24:00'`, `'9:00'`) THEN THE SYSTEM SHALL
  mostrar el nodo `-value` con `value === ''` y la prop `placeholder` igual a la
  prop `placeholder` si se pasó, o si no a `t('dateField.placeholderDate')` (modo
  `date`) o `t('dateField.placeholderTime')` (modo `time`). Literales: en español
  `'Elige una fecha'` y `'Elige una hora'`; en inglés `'Select a date'` y
  `'Select a time'`. WHEN `mode` es `'time'` y `value` es `'09:05'` THE SYSTEM SHALL
  mostrar `'09:05'` tal cual.
  - Test: `components/__tests__/date-field.test.tsx`, `it('#220 R3: ...')` (vacío y
    no analizable en ambos modos, idiomas, placeholder propio) y
    `it('#220 R3: la hora se muestra tal cual')`.

- **R4**: THE SYSTEM SHALL pintar el disparador como un `Pressable` raíz con
  `testID={testID}`, `accessibilityRole="button"`, `className="h-12 rounded-xl bg-default"`
  y `style={CONTINUOUS_CORNER}` (import de `theme/native-styles`), que contiene un
  `InputGroup` de `heroui-native` con: un `InputGroup.Prefix isDecorative` con el
  icono `Calendar` (modo `date`) o `Clock` (modo `time`) de `reicon-react-native`,
  `size={18}` y `color` del token `muted` (`useThemeColors`), y un
  `InputGroup.Input` con `testID={`${testID}-value`}`, `editable={false}`,
  `pointerEvents="none"`, `className="h-12 rounded-xl bg-default"` y la etiqueta de
  R2/R3. `accessibilityLabel` del raíz es `label` si se dio o, si no, la etiqueta
  mostrada (o el placeholder si está vacío). THE SYSTEM SHALL NOT importar
  `FieldError` ni pintar ningún nodo `` `${testID}-message` ``; el padre host del
  nodo raíz SHALL ser el contenedor del llamador (el componente no añade
  contenedor).
  - Test: `components/__tests__/date-field.test.tsx`, `it('#220 R4: ...')` (raíz:
    className exacto, `StyleSheet.flatten(style).borderCurve === 'continuous'`,
    rol, `accessibilityLabel` en los dos casos; icono por modo con testID de doble
    `icon-calendar`/`icon-clock`, `size` 18, `color` `'color:muted'` dentro del
    raíz; nodo `-value`: `editable === false`, `pointerEvents === 'none'`, tokens
    `h-12`, `rounded-xl`, `bg-default`; `queryByTestId('field-message')` es `null`;
    `getByTestId('field').parent` es el nodo `parent` del arnés) y
    `it('#220 R4: el fichero no importa FieldError ni TextInput')` (lectura de
    fuente, ver R17).

- **R5**: WHILE `isInvalid` es `true` THE SYSTEM SHALL pasar `isInvalid` a
  `InputGroup.Input` de modo que su `className` contenga el token
  `android:border-danger` (el mismo observable que ya usan los tests de #186 R6),
  y WHILE es `false` u omitido THE SYSTEM SHALL NOT incluirlo. WHEN se pasa `label`
  THE SYSTEM SHALL pintar antes del disparador un `Label` de `heroui-native` con
  `testID={`${testID}-label`}` y un `Label.Text` cuyo `className` es exactamente
  `'text-sm font-extrabold text-foreground'`; WHEN no se pasa, THE SYSTEM SHALL NOT
  pintar etiqueta alguna.
  - Test: `components/__tests__/date-field.test.tsx`, `it('#220 R5: ...')` (token
    de error presente/ausente en `-value`; etiqueta con su className exacto y
    posición anterior al disparador en `parent.children`; sin etiqueta no hay
    `field-label`).

### Selector nativo

- **R6**: WHEN el usuario pulsa el disparador THE SYSTEM SHALL montar, como hermano
  posterior del disparador, `<Host>` de `@expo/ui` con un `ExpoDateTimePicker` de
  `@expo/ui/community/datetime-picker` con `testID` igual a `pickerTestID` (o
  `` `${testID}-picker` ``), `mode` igual al de `DateField`, `presentation="dialog"`,
  `locale` de `useLocale()`, `accentColor` igual al token `accent`
  (`useThemeColors`), `themeVariant` igual a `useUniwind().theme === 'dark' ? 'dark' : 'light'`,
  `positiveButton={{ label: t('dateField.ok') }}` y
  `negativeButton={{ label: t('dateField.cancel') }}`; y WHILE no está abierto THE
  SYSTEM SHALL NOT montar ni el `Host` ni el selector. Los dos imports son
  exactamente `import { Host } from '@expo/ui'` y
  `import ExpoDateTimePicker from '@expo/ui/community/datetime-picker'` (los dobles
  de los tests de las pantallas siguen interceptando). Literales de botones: en
  español `'Aceptar'` y `'Cancelar'`; en inglés `'OK'` y `'Cancel'`.
  - Test: `components/__tests__/date-field.test.tsx`, `it('#220 R6: ...')`
    (cerrado: sin host ni selector; abierto: host `expo-ui-picker-host` con el
    selector dentro, índice del host posterior al del disparador; `pickerTestID`
    por defecto y propio; las siete props en español e inglés; `themeVariant` con
    `uniwind` doblado a `light` y a `dark`).

- **R7**: WHEN `mode` es `'date'` THE SYSTEM SHALL pasar al selector
  `value = toPickerValue(isoToLocalDate(value))` y, WHEN el usuario elige un día,
  llamar `onChange(localDateToIso(fromPickerValue(pickedDate)))` y cerrar el
  selector, usando `toPickerValue` y `fromPickerValue` de
  `utils/date-picker-value.ts` (la conversión de Android, donde el diálogo devuelve
  medianoche UTC, queda encapsulada aquí y las pantallas no la importan).
  - Tests (`components/__tests__/date-field.test.tsx`), con el módulo
    `../../utils/date-picker-value` envuelto por
    `jest.mock(..., () => { const actual = jest.requireActual(...); return { toPickerValue: jest.fn(actual.toPickerValue), fromPickerValue: jest.fn(actual.fromPickerValue) }; })`
    (sin la opción de modo no real, ver `jest-virtual-mock-lock`) y `mockClear()` en `beforeEach`:
    1. `it('#220 R7: toPickerValue entrega el valor del selector')`: con
       `toPickerValue.mockReturnValueOnce(SENTINEL)` donde
       `SENTINEL = new Date(Date.UTC(1999, 0, 2))`, el selector recibe
       `value.getTime() === SENTINEL.getTime()`; `toPickerValue` se llamó **una
       sola vez** y su argumento tiene `getFullYear() === 2026`, `getMonth() === 8`,
       `getDate() === 24` y `getHours() === 0` para `value='2026-09-24'`. Esta
       prueba no depende de la zona del host: si el componente deja de llamar a
       `toPickerValue`, el selector recibe medianoche local, distinta del centinela.
    2. `it('#220 R7: fromPickerValue convierte lo elegido')`: con
       `fromPickerValue.mockReturnValueOnce(new Date(2031, 2, 5))`, elegir cualquier
       fecha llama `onChange('2031-03-05')` una vez y `fromPickerValue` recibió
       exactamente la fecha elegida.
    3. `it.each('#220 R7: en Android el día UTC del diálogo es el día elegido')`
       con `setPlatform('android')` (`Object.defineProperty(Platform, 'OS', { configurable: true, value })`)
       y el helper de test `wallClock(local, utc)` copiado de
       `utils/date-picker-value.test.ts` (no importado). Cuatro casos, cada uno con
       `fireEvent(picker, 'onValueChange', {}, wallClock(...))` y la aserción de
       `onChange`: CDMX `[2026, 8, 23, 18, 0]` / `[2026, 8, 24]` → `'2026-09-24'`;
       cruce de mes `[2026, 8, 30, 18, 0]` / `[2026, 9, 1]` → `'2026-10-01'`; cruce
       de año `[2026, 11, 31, 18, 0]` / `[2027, 0, 1]` → `'2027-01-01'`; Kiritimati
       `[2026, 8, 24, 14, 0]` / `[2026, 8, 24]` → `'2026-09-24'`.
    4. `it('#220 R7: en iOS el día local del selector es el día elegido')` con
       `setPlatform('ios')`: `wallClock([2026, 8, 24, 10, 0], [2026, 8, 25])` →
       `onChange('2026-09-24')`.
    5. `it('#220 R7: el valor inicial en Android y en iOS')`: `value='2026-09-24'`,
       Android → `value.toISOString() === '2026-09-24T00:00:00.000Z'`; iOS →
       `value.getTime() === new Date(2026, 8, 24).getTime()`.
    6. `it('#220 R7: al elegir se cierra el selector')`: tras la elección no existe
       `field-picker` ni el host.

- **R8**: WHEN `mode` es `'date'` y se pasan `minDate` o `maxDate` THE SYSTEM SHALL
  pasar al selector `minimumDate`/`maximumDate` como el **mediodía local** del día
  civil, `new Date(y, m - 1, d, 12)`, **sin** pasar por `toPickerValue` (regla C6 de
  `specs/mobile-date-picker-utc-day-shift`: el código nativo toma el día local del
  instante, así que se entregan crudos); WHEN no se pasan THE SYSTEM SHALL dejar la
  prop `undefined`. WHEN `value` es `null` THE SYSTEM SHALL abrir el selector en el
  día de hoy limitado al rango (`hoy`, y si hay `maxDate` anterior a hoy, `maxDate`;
  si hay `minDate` posterior a hoy, `minDate`), calculado con la comparación
  lexicográfica de los textos `YYYY-MM-DD`. «Hoy» se lee del reloj **en el manejador
  del toque**, no durante el render (la regla `react-hooks/purity` veta `Date.now()`
  en render).
  - Tests (`date-field.test.tsx`, con `jest.useFakeTimers()` y
    `jest.setSystemTime(new Date(2026, 8, 24, 20, 0))`):
    1. `it('#220 R8: mínimo y máximo van crudos a mediodía local')`:
       `minDate='2026-09-24'`, `maxDate='2026-12-31'` →
       `minimumDate.getTime() === new Date(2026, 8, 24, 12, 0).getTime()` y
       `maximumDate.getTime() === new Date(2026, 11, 31, 12, 0).getTime()`; y
       `toPickerValue` se llamó una sola vez (solo por el valor, nunca por el
       mínimo ni el máximo). El mediodía es deliberado: la mutación «pasar el límite
       por `toPickerValue`» da las 00:00Z, distinto de las 12:00 en un jest en UTC,
       y la mutación «medianoche local» también difiere.
    2. `it('#220 R8: sin límites las props van undefined')`.
    3. `it.each('#220 R8: valor nulo abre en hoy limitado al rango')`: sin límites
       abre en el 24 (Android: `'2026-09-24T00:00:00.000Z'`); con
       `maxDate='2026-09-20'` en el 20; con `minDate='2026-10-05'` en el 5 de octubre.
    4. `it('#220 R8: en modo hora no hay mínimo ni máximo aunque se pasen')`.

- **R9**: WHEN `mode` es `'time'` THE SYSTEM SHALL pasar al selector
  `value = hhmmToLocalDate(value)` (hoy a esa hora, **sin** conversión UTC, decisión
  D3 de `mobile-date-picker-utc-day-shift`) o, si `value` es `null`, el instante de
  la pulsación, y WHEN el usuario elige una hora THE SYSTEM SHALL llamar
  `onChange(timeToHhmm(pickedDate))` y cerrar el selector, sin llamar a
  `toPickerValue` ni a `fromPickerValue`.
  - Test: `date-field.test.tsx`, `it('#220 R9: ...')` (con la hora del sistema a
    las 20:00 del 24 de septiembre: `value='09:05'` →
    `picker.props.value.getTime() === new Date(2026, 8, 24, 9, 5).getTime()` en
    Android y en iOS; `value=null` → `new Date(2026, 8, 24, 20, 0).getTime()`;
    `onValueChange` con `new Date(2026, 8, 24, 21, 30)` → `onChange('21:30')` y con
    `new Date(2026, 8, 24, 7, 5)` → `'07:05'`; las dos funciones espía con
    `mock.calls` de longitud 0).

- **R10**: WHEN el usuario descarta el selector (`onDismiss`) THE SYSTEM SHALL
  cerrarlo sin llamar a `onChange`.
  - Test: `date-field.test.tsx`, `it('#220 R10: descartar no cambia el valor')`
    (`fireEvent(picker, 'onDismiss')`; `onChange` con 0 llamadas; sin selector).

- **R11**: WHERE `allowClear` es `true` y `value` es válido THE SYSTEM SHALL pintar
  en `InputGroup.Suffix` un `Pressable` con `testID={`${testID}-clear`}`,
  `accessibilityRole="button"`, `accessibilityLabel={t('dateField.clear')}`
  (`'Borrar'` / `'Clear'`), `className="size-11 items-center justify-center"` y el
  icono `X` (`size={18}`, color `muted`); WHEN se pulsa THE SYSTEM SHALL llamar
  `onChange(null)` una vez, sin abrir el selector; y WHILE `allowClear` es `false` u
  omitido, o `value` es `null` o inválido, THE SYSTEM SHALL NOT pintar ese botón.
  - Test: `date-field.test.tsx`, `it('#220 R11: ...')` (presente solo con
    `allowClear` y valor; nombre accesible en ambos idiomas con `getByRole('button',
    { name })`; pulsar da `onChange` con `null` exactamente una vez y no monta
    `expo-ui-picker-host`; icono `icon-x`, tamaño 18, `'color:muted'`).

### Migración de las cuatro pantallas

En las cuatro, la pantalla conserva su propia etiqueta y su `FieldErrorMessage`
hermano (candado #186 R9: los recuentos de `FieldErrorMessage` no cambian), sus
validaciones y el mapeo de errores del servidor. `DateField` reemplaza solo el
control. En ninguna se pasa `label` (las pantallas pintan la suya); #208 y #213 sí
pueden pasarla.

- **R12**: Registro de peso (`screens/weight-log/index.tsx`). THE SYSTEM SHALL
  sustituir el `<Input testID="weight-date-input" .../>` por
  `<DateField testID="weight-date-input" value={measuredAt} onChange={(next) => { if (next !== null) setMeasuredAtDraft(next); }} maxDate={civilTodayIso(profileTimeZone)} isInvalid={Boolean(fieldErrors.measuredAt)} />`
  dentro del mismo `TextField className="flex-1 gap-1.5"`, con su `Label` y su
  `<FieldErrorMessage testID="weight-date-input" .../>`. THE SYSTEM SHALL conservar
  `measuredAt = measuredAtDraft ?? civilTodayIso(profileTimeZone)`, la validación
  `validateWeight` (con `isIsoDate` privado de `utils/form-rules.ts`) y el mapeo del
  400 de fecha futura a `weight-date-input-message`. El nodo `weight-date-input`
  conserva los tokens `h-12`, `rounded-xl`, `bg-default` (candado #199 R7). El
  selector queda como `weight-date-picker`. Se retira el uso de
  `t('weightLog.yyyyMmDd')`.
  - Test: `screens/weight-log/index.test.tsx` (inventario de enmiendas en
    [[design]] §Candados). `it('#220 R12: el campo de fecha muestra hoy en la zona del perfil y se elige con el selector')`
    (etiqueta inicial del `-value`; pulsar, elegir
    `new Date(2026, 7, 20)` y enviar → `createWeight` con `measuredAt: '2026-08-20'`;
    `maximumDate.getTime()` igual al mediodía local del día de hoy de la zona del
    perfil), más las reescrituras de los `it` que hoy escriben o leen el campo como
    texto.

- **R13**: Documentos (`screens/docs-upload-form/index.tsx`). THE SYSTEM SHALL
  sustituir el `<Input testID="docs-date-input" .../>` por
  `<DateField testID="docs-date-input" value={date} onChange={(next) => { if (next !== null) setDate(next); }} isInvalid={Boolean(fieldErrors.date)} />`
  (sin `maxDate`; valor inicial `civilTodayIso(undefined)` sin cambio), dentro del
  mismo `TextField`, con su `Label` y su `FieldErrorMessage testID="docs-date-input"`.
  THE SYSTEM SHALL conservar `validateDocument` y `docs.errorInvalidForm`. El
  selector queda como `docs-date-picker`. Se retira `t('docs.datePlaceholder')`.
  - Test: `screens/docs-upload-form/index.test.tsx`.
    `it('#220 R13: la fecha del documento se elige con el selector y se envía recortada de tiempo')`
    (etiqueta inicial; elegir `new Date(2026, 9, 1)` → la subida lleva
    `date: '2026-10-01'`), más las reescrituras del inventario.

- **R14**: Alta de mascota (`screens/add-pet/index.tsx`). WHILE `ageMode` es
  `'birthDate'` THE SYSTEM SHALL pintar
  `<DateField testID="birth-date-field" pickerTestID="birth-date-picker" value={birthDate === null ? null : localDateToIso(birthDate)} onChange={(next) => setBirthDate(next === null ? null : isoToLocalDate(next))} maxDate={localDateToIso(new Date())} placeholder={t('addPet.selectBirthDate')} isInvalid={Boolean(fieldErrors.birthDate)} />`
  (el estado `birthDate: Date | null` y `validateAddPet` no cambian; se elimina el
  `dateToIso` privado en favor de `localDateToIso`; se retiran `Calendar`,
  `Host`, `ExpoDateTimePicker`, `toPickerValue`, `fromPickerValue`, `showDatePicker`
  y los imports que queden sin uso). La pantalla conserva su
  `<FieldErrorMessage testID="birth-date-field" .../>` hermano y el `FieldLabel`.
  La etiqueta de la fecha elegida pasa de la forma numérica de hoy (`'9/4/2024'`) a
  la de R2 (`'9 abr 2024'`); el vacío sigue mostrando el literal real
  `'Elige una fecha de nacimiento'` (clave `addPet.selectBirthDate`, ya en el catálogo).
  - Test: `screens/add-pet/index.test.tsx`: `it('#220 R14: ...')` (elegir una
    fecha con `wallClock` en Android guarda el día local; `maximumDate` es el
    mediodía de hoy; vacío muestra `'Elige una fecha de nacimiento'` en el `placeholder` del nodo
    `birth-date-field-value`, y la fecha elegida `'9 abr 2024'` en su `value`) y las reescrituras del
    inventario (`#191 R13`).

- **R15**: Nuevo recordatorio (`screens/add-reminder/index.tsx`). THE SYSTEM SHALL
  sustituir los dos `Pressable` y sus selectores por
  `<DateField testID="date-field" pickerTestID="date-picker" value={date === null ? null : localDateToIso(date)} onChange={(next) => { setDate(next === null ? null : isoToLocalDate(next)); setNow(Date.now()); }} minDate={localDateToIso(new Date())} placeholder={t('addReminder.selectDate')} />`
  y
  `<DateField testID="time-field" pickerTestID="time-picker" mode="time" value={timeToHhmm(time)} onChange={(next) => { if (next !== null) { const picked = hhmmToLocalDate(next); if (picked !== null) setTime(picked); } setNow(Date.now()); }} />`,
  cada uno dentro de su contenedor actual (`flex-3 gap-1.5` y `flex-2 gap-1.5`),
  con su etiqueta `Text className="text-sm font-extrabold text-foreground"`; el
  `FieldErrorMessage testID="date-field"` sigue siendo hermano del campo de fecha y
  el campo de hora sigue sin mensaje. THE SYSTEM SHALL conservar los estados
  `date: Date | null` y `time: Date`, `combineDateAndTime`, `validateReminder` y el
  `setNow(Date.now())` tras cada elección. Se retiran `Calendar`, `Clock`, `Host`,
  `ExpoDateTimePicker`, `toPickerValue`, `fromPickerValue`, `showDatePicker`,
  `showTimePicker` y cualquier import o variable (`muted`, `useLocale`) que quede
  sin uso. `Bell` sigue importado.
  - Test: `screens/add-reminder/index.test.tsx`: `it('#220 R15: ...')` (elegir fecha
    y hora y guardar → mismo `dueAt` que antes; `date-field-message` sigue siendo
    hermano del campo; `time-field` sin mensaje) y las reescrituras del inventario
    (`#123 R4`, `#123 R5`, `#178`).

### Copy

- **R16**: THE SYSTEM SHALL añadir al catálogo `i18n/catalog.ts`, en inglés y
  español, exactamente estas cinco claves, cada una usada **una vez** con
  `t('...')` en `components/date-field.tsx`:

  | Clave | en | es |
  |---|---|---|
  | `dateField.placeholderDate` | `Select a date` | `Elige una fecha` |
  | `dateField.placeholderTime` | `Select a time` | `Elige una hora` |
  | `dateField.ok` | `OK` | `Aceptar` |
  | `dateField.cancel` | `Cancel` | `Cancelar` |
  | `dateField.clear` | `Clear` | `Borrar` |

  y retirar `weightLog.yyyyMmDd` y `docs.datePlaceholder` (catálogo en/es y filas de
  `__tests__/ui-copy-table.ts`) en el mismo cambio en que cada pantalla deja de usarlas. Las
  claves `validation.invalidDate`, `docs.errorInvalidForm`, `addReminder.date`,
  `addReminder.time`, `addReminder.selectDate` y `addPet.selectBirthDate` se
  conservan (siguen en uso).
  - Tests: `providers/__tests__/language-provider.test.tsx` (la aritmética del
    recuento de claves suma `+ 5 - 2 // #220` y el `it('#158 R1: declara los 13 pares exactos y su registro')`
    pasa a 12 pares sin `docs.datePlaceholder`), `__tests__/ui-copy-table.ts`
    (bloque nuevo `R18_DATE_FIELD` con las cinco filas, añadido a `ALL_USES` y a la
    lista `blocks` de `it('#194 R5: cuadra ALL_USES con la suma de sus bloques')`) y
    `__tests__/ui-language.test.ts` (`expect(R18_DATE_FIELD).toHaveLength(5)` con
    `checkUses(R18_DATE_FIELD)`; `R5_HEALTH` `- 1`, `R7_PROFILE` `- 1`; `SCREEN_FILES`
    `+ 1 // #220 R16: components/date-field.tsx`).

### Candados y alcance

- **R17**: THE SYSTEM SHALL mantener verdes, con las enmiendas exactas del
  inventario de [[design]] §Candados, los candados que leen las fuentes que esta
  feature toca, y `components/date-field.tsx` SHALL ser grep-limpio: cero literales
  hex (los comentarios citan el id con la forma `#220 R<n>`, la única que exime el
  detector), cero clases arbitrarias `x-[...]`, cero `StyleSheet.create`, cero
  `text-NN` de la escala propia sobre elementos de heroui (solo `text-sm`), cero
  `text-accent` ni `text-warning` sueltos, cero `tracking-*`, cero `rounded-16`,
  `rounded-14`, `text-17`, `text-22`, cero emoji, ningún `FieldError` ni `TextInput`
  crudo, y todo `className` de un elemento de heroui es una cadena literal sin
  expresión.
  - Test: `components/__tests__/date-field.test.tsx`,
    `it('#220 R17: date-field.tsx es grep-limpio')` (lectura de fuente con
    `readFileSync`; cada patrón se prueba contra una mutación plantada en una
    cadena de prueba, no solo contra el fichero real) y las nueve enmiendas del
    inventario (la novena, `legibility-classnames`, entra por la Enmienda 1), verificadas con `bun run test` completo.

- **R18**: THE SYSTEM SHALL dejar sin cambio `screens/meal-schedule/index.tsx`
  (sigue importando `ExpoDateTimePicker` directamente, dos apariciones del símbolo, y
  no importa `date-field`) y `global.css`.
  - Test: `components/__tests__/date-field.test.tsx`,
    `it('#220 R18: el horario de comidas conserva su selector propio')` (lectura de
    fuente: `meal-schedule/index.tsx` contiene `import ExpoDateTimePicker from '@expo/ui/community/datetime-picker'`,
    el símbolo `ExpoDateTimePicker` aparece exactamente 2 veces y la cadena
    `date-field` aparece 0). `global.css` se verifica en el reporte con
    `git diff --stat origin/dev -- mobile-pet-tracker/global.css` vacío.

## Fuera de alcance

- `screens/meal-schedule/index.tsx` y su `meal-time-picker` (decisión del humano).
- `global.css` (el aspecto de campo ya es global, tokens `--field-*`).
- `heroui-native-pro` y el `DateField` web de `@heroui/react` (ver [[design]] §Alternativas).
- Los contenidos de #208 (dos fechas, una opcional) y #213 («Hasta»): esta feature
  solo les deja el contrato (`allowClear`, `minDate`, `maxDate`, `label`, `isInvalid`).
- Una enmienda a `docs/ui-guidelines.md` que nombre `date-field.tsx` (no hay casilla
  humana en este plan para ella; queda anotada en el reporte como seguimiento).
- El calendario del historial de peso y cualquier selector de rango.
- Cambiar los mensajes de validación (`validation.invalidDate`,
  `docs.errorInvalidForm` conserva su texto «AAAA-MM-DD»).
- La prueba en dispositivo (gate G2 del plan, `progress/smoke_ui.md`): el tap sobre
  `pointerEvents="none"`, el diálogo nativo, el tema y el diseño en iOS no se
  pueden probar en jest.

## Aprobación

- [x] Aprobado por humano (fecha: 2026-10-26)
  Firma delegada en el leader por mandato del humano del 2026-10-23, ampliado el
  2026-10-26 (`progress/plan_canvas-parity-2026-10-23.md` §4 y
  `progress/plan_ui-2026-10-26.md` §4, checklist de firma pasada). F2 (alto único
  `h-12` en Recordatorio) y F3 (etiqueta `9 abr 2024` en Alta de mascota) quedan
  aceptadas como están en la spec; si el humano las rechaza en el smoke G2, es otra spec.
- [ ] Smoke de `DateField` en dev build Android hecho y aprobado por el humano (cierre, no gate de implementación)
  Va en `progress/smoke_ui.md` (plan §5, G2): toque sobre el campo, diálogo nativo, tema oscuro, Peso, Documentos, Alta de mascota, Recordatorio fecha y hora.

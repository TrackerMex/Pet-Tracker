---
feature: "mobile-date-field"
status: approved
tags: [harness, spec]
---

# Diseño — [[mobile-date-field]]

> Ver [[requirements]] para los requisitos que este diseño implementa y
> [[../../docs/architecture|architecture]] para las reglas de capas del proyecto.
> Solo toca `mobile-pet-tracker/` (capa de presentación y utilidades puras). No hay
> cambios de backend, de contrato ni de base de datos.
> Rutas relativas a `mobile-pet-tracker/src/` salvo que se diga otra cosa.
> Skills: en Claude Code `expo:expo-overview` y las que indique `docs/ui-guidelines.md`;
> en Codex (plugin `expo@openai-curated`, v1.0.2) se nombran las de Codex, ver el handoff
> (deuda B5 de `CLAUDE.md`).

## Decisiones técnicas

- **Un componente propio, `components/date-field.tsx`, con export nombrado `DateField`** (R2..R11).
  Construido con `InputGroup`, `InputGroup.Prefix`, `InputGroup.Input`,
  `InputGroup.Suffix` y `Label` de `heroui-native` 1.0.8, más `Host` de `@expo/ui` y
  `ExpoDateTimePicker` de `@expo/ui/community/datetime-picker` 57.0.11. Cero
  dependencias nuevas (decisión del humano, plan §1). Precedente de estructura:
  `components/password-input.tsx` (`InputGroup`, `InputGroup.Input` con `testID` y
  `className="h-13 rounded-xl bg-default"`, `InputGroup.Suffix` con un `Pressable size-11`,
  `useThemeColors`, `useTranslate`).
- **Valor como texto civil, no como `Date`** (R1, R2, R7, R9). `value`/`onChange` hablan
  `YYYY-MM-DD` o `HH:mm`. Razón: las cuatro pantallas ya validan texto
  (`validateWeight`, `validateDocument`, `isIsoDate`) y el servidor recibe texto; un
  tipo `Date` obligaría a convertir en el borde de cada pantalla y reintroduce el bug
  del cambio de día por zona horaria (`specs/mobile-date-picker-utc-day-shift`). Las
  dos pantallas que hoy guardan `Date` (Alta de mascota y Recordatorio) convierten con
  `localDateToIso`/`isoToLocalDate`/`timeToHhmm`/`hhmmToLocalDate` en el borde, y
  conservan su estado y sus validadores (`validateAddPet`, `validateReminder`,
  `combineDateAndTime`) sin tocarlos.
- **Utilidades puras en `utils/civil-date.ts`** (R1), nuevas, sin dependencias. Se
  reutilizan en las pantallas y en #208/#213. `isIsoDate` de `utils/form-rules.ts`
  sigue privado: no se exporta, la validación de texto de `validateWeight` y
  `validateDocument` no cambia. `utils/civil-today-iso.ts` se reutiliza tal cual para
  el valor inicial y el tope de Peso.
- **La conversión de Android queda encapsulada** (R7). El diálogo de Android devuelve
  medianoche UTC; `toPickerValue`/`fromPickerValue` de `utils/date-picker-value.ts` ya
  convierten solo en Android. `DateField` es el único consumidor tras la migración
  (más `meal-schedule`, sin cambio); las pantallas dejan de importarlas. Jest corre en
  UTC, donde el bug es invisible: por eso R7 prueba la dirección de cada llamada con
  espías que envuelven la función real y valores centinela, y la conversión de Android
  con el helper `wallClock`, nunca con `process.env.TZ` (que no cambia `Date` en jest).
- **Límites crudos a mediodía local** (R8). La regla C6 de
  `mobile-date-picker-utc-day-shift` dice que `minimumDate`/`maximumDate` van sin
  convertir (el código nativo toma el día local del instante). Se construyen como
  `new Date(y, m - 1, d, 12)`: a mediodía, tanto la mutación «pasar por
  `toPickerValue`» (00:00Z) como la mutación «medianoche local» (00:00 local) dan un
  `getTime()` distinto aunque jest corra en UTC. A medianoche local el test no podría
  distinguir la mutación en UTC (zona ciega).
- **«Hoy» fuera del render** (R8, R9). `react-hooks/purity` veta `Date.now()` en
  render. El valor inicial del selector con `value === null`, y el de modo hora, se
  calculan en el manejador del toque y se guardan en un estado del componente
  (`pickerSeed`) junto con `open`. `maxDate`/`minDate` los calcula cada pantalla:
  `civilTodayIso(profileTimeZone)` en Peso (ya existe); `localDateToIso(new Date())`
  en Alta y Recordatorio, igual que ya hacían `maximumDate={new Date()}` y
  `minimumDate` hoy. Si una de esas llamadas dispara el lint de pureza en la pantalla,
  se sustituye por el mismo patrón de estado ya usado allí (el `now` de
  `add-reminder`); el handoff lo indica.
- **Disparador = `Pressable` con un `InputGroup.Input` no editable** (R4). El `Pressable`
  raíz lleva el `testID` del campo, el rol de botón y la esquina continua
  (`CONTINUOUS_CORNER`, patrón #62 R14); el `Input` interno
  (`editable={false}`, `pointerEvents="none"`) pinta el texto con la fuente y el
  padding de campo de HeroUI, y su `testID` `-value` es donde los tests leen
  la etiqueta (`.props.value`). Alto único `h-12` para los cuatro usos (ver «Efecto
  visible» abajo). No se añade `global.css`: el aspecto de campo es global (tokens `--field-*`).
- **`isInvalid` en el `Input`, no en `InputGroup`** (R5): en heroui-native 1.0.8 es
  prop de `InputGroup.Input`, y el observable es el token `android:border-danger` en
  su `className`. (Premisa corregida frente a un borrador del explorador.)
- **Mensaje de error fuera del componente** (R4, R12..R15). `DateField` no importa
  `FieldError`. Cada pantalla conserva su `<FieldErrorMessage testID="...">`
  hermano, de modo que los recuentos de `forms-validation-global` (#186 R9) y los
  nodos `*-message` de las pantallas no cambian. Pasar `isInvalid` desde
  `Boolean(fieldErrors.x)`.
- **Una sola `Host` por campo, montado al abrir** (R6). Hoy cada pantalla monta su
  `Host`/selector condicionalmente; `DateField` conserva ese comportamiento (nada
  montado mientras está cerrado), de modo que los dobles de los tests siguen
  interceptando los mismos módulos y los tests de ruta que importan la pantalla real
  (`app/(tabs)/__tests__/layout.test.tsx`) no ganan un módulo nativo nuevo.
- **Copy** (R16): cinco claves `dateField.*` y retirada de dos claves de placeholder
  que ya no tienen uso. El resto de claves de fecha se conserva. Los botones del
  diálogo se pasan en `positiveButton`/`negativeButton` (props que `ExpoDateTimePicker`
  ya acepta) para que el diálogo salga en el idioma de la app y no en el del sistema.
- **`meal-schedule` no cambia** (R18): su selector es de otra naturaleza (hora de una
  comida con edición en línea) y el humano lo dejó fuera.
- **Sin `isDisabled`, sin `size`, sin rango** (YAGNI): ninguna de las cuatro pantallas
  ni #208/#213 lo pide.

## Efecto visible (para el leader; no hay artboard)

El plan no trae artboards para #220 (nota en la entrada del plan). Efectos visibles de
la migración, todos intencionales y mínimos:

1. Peso y Documentos: el campo de texto pasa a un campo con icono de calendario y
   etiqueta de fecha formateada («24 sep 2026») que abre el diálogo nativo.
2. Alta de mascota: el icono se conserva; la fecha elegida pasa de la forma numérica
   `birthDate.toLocaleDateString(locale)` (hoy `'9/4/2024'` en los tests) a la forma de
   R2 (`'9 abr 2024'`, la que Recordatorio ya usa), y el color del texto lo da el `Input`
   de HeroUI en lugar de `text-foreground`/`text-muted` a mano. Ver FLAG F3 del reporte.
3. Recordatorio: los campos de fecha y hora pasan de `h-13` a `h-12` (el título
   conserva `h-13`). Ver FLAG F2 del reporte.

## Archivos afectados

Capa de presentación y utilidades (todo bajo `mobile-pet-tracker/src/`):

- `utils/civil-date.ts` (nuevo) — R1.
- `utils/civil-date.test.ts` (nuevo) — R1.
- `components/date-field.tsx` (nuevo) — R2..R11, R16, R17.
- `components/__tests__/date-field.test.tsx` (nuevo) — R2..R11, R17, R18.
- `i18n/catalog.ts` — R16: +5 claves en inglés y +5 en español; -`weightLog.yyyyMmDd`,
  -`docs.datePlaceholder` en ambos idiomas.
- `screens/weight-log/index.tsx` — R12.
- `screens/docs-upload-form/index.tsx` — R13.
- `screens/add-pet/index.tsx` — R14.
- `screens/add-reminder/index.tsx` — R15.
- Tests de pantalla: `screens/weight-log/index.test.tsx`,
  `screens/docs-upload-form/index.test.tsx`, `screens/add-pet/index.test.tsx`,
  `screens/add-reminder/index.test.tsx`.
- Candados a enmendar (ver siguiente sección): `__tests__/add-pet-two-steps.test.ts`,
  `__tests__/consistency-classnames.test.ts`, `__tests__/design-drift.test.ts`,
  `__tests__/ui-copy-table.ts`, `__tests__/ui-language.test.ts`,
  `providers/__tests__/language-provider.test.tsx`, `__tests__/legibility-classnames.test.ts` (Enmienda 1).

Sin cambio (verificado por medida): `screens/meal-schedule/index.tsx`, `global.css`,
`utils/form-rules.ts`, `utils/date-picker-value.ts`, `utils/reminder-dates.ts`,
`utils/civil-today-iso.ts`, `__tests__/forms-validation-global.test.ts` (sus recuentos
cuentan `FieldErrorMessage` y las pantallas lo conservan), `__tests__/heroui-text-size-merge.test.ts`
(`opaque` solo `password-input`; `date-field.tsx` no tiene `className` no literal), los tests
de las pantallas de detalle (dobles) y `app/(tabs)/__tests__/layout.test.tsx`.

## Candados: inventario cerrado y enmiendas exactas

Cada enmienda de un candado cita `#220 R<n>` y el cambio. Las cifras son las de `dev`
en `fb1b2e67`; el handoff las re-mide con las anclas de abajo antes de editar, porque
las cuentas caducan si otra feature de la ola merge antes.

### 1. `__tests__/add-pet-two-steps.test.ts` (línea 20)

`expect(screenSource.match(/style=\{CONTINUOUS_CORNER\}/g)).toHaveLength(6)` pasa a
`.toHaveLength(5)`. Razón: `birth-date-field` deja de ser un `Pressable` con
esquina directa. Ancla antes: `grep -cF "style={CONTINUOUS_CORNER}" screens/add-pet/index.tsx` da `6`
(el `import` no contiene esa cadena); después, `5`.

### 2. `__tests__/consistency-classnames.test.ts`

Todas en `describe('#62 R14: ...')`:

- `directUses`: `[join('screens', 'add-pet', 'index.tsx'), 6]` pasa a `5` con
  `// #220 R14`; `[join('screens', 'add-reminder', 'index.tsx'), 3 + 1]` pasa a
  `3 + 1 - 2 // #178 R12; #220 R15`; y una fila nueva
  `[join('components', 'date-field.tsx'), 1], // #220 R4`.
- Total de `it('fusiona la esquina una vez y la entrega a las dos ramas de Card ...')`
  (línea ~324): se añade `- 2 // #220` (-1 add-pet, -2 add-reminder, +1 date-field)
  al final de la suma.
- Total global `count(/style=\{CONTINUOUS_CORNER\}/g)` (línea ~424): `- 2 // #220`
  igual.
- Los recuentos de `TextInput` y los de `rounded-xl bg-accent`, `bg-accent-soft`,
  `border-lip-gray` y `border-b-4` no cambian: `date-field.tsx` no usa ninguno.

Mutación a plantar para cada cifra: en `date-field.tsx`, quitar el
`style={CONTINUOUS_CORNER}` del raíz debe romper `directUses` de `date-field.tsx`.

### 3. `__tests__/design-drift.test.ts` (#178 R13, línea ~1074)

`'screens/add-reminder/index.tsx': ['Bell', 'Calendar', 'Clock']` pasa a `['Bell']`
con comentario `// #220 R15`. Razón: Calendar y Clock pasan a `date-field.tsx`. El
resto del `describe` sigue leyendo `add-reminder`: no hay emoji, ni radios vetados, ni
`text-accent` suelto, y no cambia. Se añade en `date-field.test.tsx` (R17) un candado
equivalente para el nuevo fichero. Los inventarios de radios (línea ~1139,
`'screens/add-reminder/index.tsx': 1`) y de `rounded-16`/`text-17` no cambian: el
`rounded-16` de add-reminder es el del CTA, no el de los campos (verificar con
`grep -c "rounded-16" screens/add-reminder/index.tsx`, esperado sin cambio).

### 4. `__tests__/ui-copy-table.ts`

- Retirar la fila `{ file: 'src/screens/weight-log/index.tsx', key: 'weightLog.yyyyMmDd' }`
  de `R5_HEALTH` (línea ~188).
- Retirar la fila `{ file: 'src/screens/docs-upload-form/index.tsx', key: 'docs.datePlaceholder' }`
  de `R7_PROFILE` (línea ~337).
- Añadir `export const R18_DATE_FIELD: UseRow[]` con cinco filas, todas en
  `src/components/date-field.tsx`: `dateField.placeholderDate`,
  `dateField.placeholderTime`, `dateField.ok`, `dateField.cancel`, `dateField.clear`.
- `ALL_USES` suma `...R18_DATE_FIELD` y el `blocks` de
  `it('#194 R5: cuadra ALL_USES con la suma de sus bloques')` incluye `R18_DATE_FIELD`.
  (Nombre de bloque: si al implementar ya existe otro `R18_*` por una feature
  mergeada antes, se usa el siguiente libre y se anota; el nombre no es un candado.)

### 5. `__tests__/ui-language.test.ts`

- `expect(R5_HEALTH).toHaveLength(...)` (línea 138): se añade `- 1 // #220 R16`.
- `expect(R7_PROFILE).toHaveLength(...)` (línea 171): se añade `- 1 // #220 R16`.
- Bloque nuevo: `expect(R18_DATE_FIELD).toHaveLength(5); checkUses(R18_DATE_FIELD);`
  (más su import desde `./ui-copy-table`).
- `SCREEN_FILES` (línea ~498): se añade `+ 1 // #220 R16: components/date-field.tsx`.
  El escaneo de literales enteros recorre `date-field.tsx`: no debe contener como
  literal entero ningún valor fijo del catálogo (por ejemplo `'OK'`, `'Cancel'`).

### 6. `providers/__tests__/language-provider.test.tsx`

- Aritmética de `englishKeys` (línea ~89): se añade `+ 5 - 2 // #220 R16` antes del
  cierre (cinco claves nuevas, dos retiradas), y `(enmendado por #220 R16)` en el título.
- `describe('#158 R1 ...')`, `it('#158 R1: declara los 13 pares exactos y su registro')`:
  se retira la fila `["docs.datePlaceholder", ...]` (línea ~624) y el título pasa a «12 pares».
  Se revisan las demás aserciones del `it` que cuenten pares o lean
  `specs/mobile-ui-language/design.md` (si ese design.md lista la clave retirada, no se
  edita: es una spec firmada; se ajusta la aserción para que no la exija, y se anota).

### 7. Tests de las cuatro pantallas (no son candados globales)

- `screens/weight-log/index.test.tsx`: 20 apariciones de `weight-date-input` en ~15
  `it`. Cada escritura `fireEvent.changeText(date-input, 'X')` pasa a abrir el selector
  (`fireEvent.press(getByTestId('weight-date-input'))`), elegir la fecha
  (`fireEvent(getByTestId('weight-date-picker'), 'onValueChange', {}, new Date(...))`) y
  leer `weight-date-input-value` (`.props.value`) donde antes se leía `.props.value`
  del input. Los `it.each` que escriben texto inválido (`'2026-02-30'`, `'bad-date'`,
  `' 2026-08-20 '`) dejan de poder expresar el caso por el campo (el selector nunca
  entrega texto): esos casos de validación ya están cubiertos por
  `utils/form-rules.test.ts` (`#186 R2: fecha del peso` y `fecha de documento`, con
  `'2026-02-30'`, `' 2026-10-09 '`, `''`, `'2026-13-01'`, verificado), así que se
  eliminan de la pantalla y la traza lo anota. En la pantalla quedan el caso del
  `maximumDate` y el de la fecha futura que el servidor rechaza con 400
  (`weight-date-input-message`), y un caso de error local que se alcanza por el
  selector (peso fuera de rango con fecha válida, que ya existe).
- `screens/docs-upload-form/index.test.tsx`: 17 apariciones, misma regla.
- `screens/add-pet/index.test.tsx`: los `it` que fijan el `className` exacto del
  `birth-date-field` (líneas ~191, ~200, ~1075) pasan a la forma de R4
  (`'h-12 rounded-xl bg-default'`); los que simulan el diálogo con `wallClock` siguen
  funcionando (el doble del selector no cambia de módulo).
- `screens/add-reminder/index.test.tsx`: el `it` de la línea ~1013 (className exacto
  `h-13 flex-row ...` de `date-field` y `time-field`) pasa a `'h-12 rounded-xl bg-default'`;
  los de etiquetas y de instantes de mediodía se reescriben sobre `DateField`.

Cada reescritura conserva el nombre original del `it` y le añade
`(enmendado por #220 R<n>)`; no se borra ninguna aserción sin sustituto o sin una
fila en `traceability.md`.

### 8. `__tests__/legibility-classnames.test.ts` (Enmienda 1, 2026-10-26)

Omitido por el spec_author y detectado por Codex en C6 (suite completa roja,
persistente aislada). En `describe('#61 R4: ...')`,
`it('reserva las peticiones de accent a las huellas de EmptyState ...')`: la lista
esperada `['components/empty-state.tsx', 'components/toggle-switch.tsx', 'theme/shadows.ts']`
pasa a `['components/date-field.tsx', 'components/empty-state.tsx', 'components/toggle-switch.tsx', 'theme/shadows.ts']`
(orden alfabético), con comentario `// (enmendado por #220 R6)` y el sufijo
` (enmendado por #220 R6)` en el título del `it`. Razón: R6 exige `accentColor`
igual al token `accent` de `useThemeColors`, y `date-field.tsx` lo pide con
`useThemeColors(['muted', 'accent'])`; es la tinta del diálogo nativo, no texto
(`text-accent`), así que el espíritu del candado se conserva. El `it` hermano
`no deja ningún text-accent suelto` no cambia. Va en un commit `test(#220)` propio
antes del `feat` de C6 (el rojo existe desde C4; ver la Reanudación 2 del handoff).
Mutación: quitar `'accent'` de la petición en `date-field.tsx` debe poner en rojo
el `it` enmendado.

## Anclas de medición para el handoff (con salida esperada)

Las cifras son las de `dev` antes de empezar; la cifra esperada después es la base más
el delta indicado (se mide antes de cada commit, no se copia):

| Comando (desde `mobile-pet-tracker/src`) | Antes | Después de la cadena |
|---|---|---|
| `grep -cF "style={CONTINUOUS_CORNER}" screens/add-pet/index.tsx` | 6 | 5 |
| `grep -cF "style={CONTINUOUS_CORNER}" screens/add-reminder/index.tsx` | 4 | 2 |
| `grep -cF "style={CONTINUOUS_CORNER}" components/date-field.tsx` | n/a | 1 |
| `grep -cF "ExpoDateTimePicker" screens/add-pet/index.tsx` | 2 | 0 |
| `grep -cF "ExpoDateTimePicker" screens/add-reminder/index.tsx` | 3 | 0 |
| `grep -cF "ExpoDateTimePicker" screens/meal-schedule/index.tsx` | 2 | 2 |
| `grep -rF "weightLog.yyyyMmDd" . \| wc -l` | 4 (catálogo x2, tabla, pantalla) | 0 |
| `grep -rF "docs.datePlaceholder" . \| wc -l` | 5 (catálogo x2, tabla, pantalla, language-provider) | 0 |
| `git diff --stat origin/dev -- ../global.css` | vacío | vacío |

Si alguna cifra «Antes» no coincide en el momento del handoff, la spec caducó y se
reabre el gate solo para esa cifra (memorias «Constantes congeladas en specs» y «Spec
aprobada caduca al mergear»).

## Alternativas descartadas

- **`heroui-native-pro`**: dependencia nueva y de pago; vetada por el humano (plan §1).
- **`DateField` web de `@heroui/react`**: es un componente de DOM (react-aria); no corre
  en React Native.
- **Un `TimeField` en otro fichero**: el modo hora comparte disparador, icono, etiqueta,
  estado `open` y cierre con el de fecha; separar duplicaría ~80% del fichero y los
  cuatro usos de #208/#213 solo necesitan el modo fecha.
- **Un `Pressable` + `Text` a mano**: es lo que ya hace `add-pet` y justo lo que el
  humano quiere unificar con la pieza de HeroUI; pierde el borde de error y la fuente de
  campo gratis.
- **Valor `Date`**: ver arriba; reintroduce el cambio de día por zona.
- **Tocar `global.css`**: no hace falta, el aspecto de campo ya es global; vetado.
- **Prop `size` (`h-12`/`h-13`)**: obligaría a un `className` condicional en un elemento
  de heroui, que `heroui-text-size-merge` vetaría (`opaque`). Se prefiere alto único.
- **Mutar `meal-schedule`** para que use `DateField`: fuera de alcance por decisión
  del humano.

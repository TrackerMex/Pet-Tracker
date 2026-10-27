# explore: ui-heroui-fechas
Fecha: 2026-10-26
Rama / worktree: `docs/ui-ola0-mejoras` en `/home/claude/sites/Pet-Tracker-wt-ui` (base origin/main). Solo lectura de código.

Petición del humano: «En registro de peso, en la fecha de medición, usa el componente de HeroUI DateField. Debe ser global: lo mismo para inputs de tipo date, DatePicker, etc. Navega los componentes de HeroUI y si es necesario cambia el estilo global de los componentes HeroUI».

Método y límites:
- Cargada la skill `expo:expo-overview` (el trabajo es de UI de formulario: enruta a `expo-ui` y `expo-design-system`). Leídos `docs/ui-guidelines.md` y `docs/conventions.md`.
- El worktree no tiene `node_modules` ni `graphify-out/graph.json`, así que `graphify query` no está disponible aquí. Todo lo leído sale de `src/` del worktree, del paquete `heroui-native@1.0.8` (caché de bun `~/.bun/install/cache/heroui-native@1.0.8@@@1`, la versión de `package.json:44`), del tarball `heroui-native@1.0.11` (la última en npm) y de `@expo/ui@57.0.11` leído en `/home/claude/sites/Pet-Tracker-wt-210/mobile-pet-tracker/node_modules` (solo lectura; mismo lockfile, mismas versiones).
- Rutas `file:line` relativas a `mobile-pet-tracker/` salvo que diga `docs/`, `specs/` o `progress/`.

---

## 1. Qué es «HeroUI» aquí y si existe DateField

### Hallazgo central
**`heroui-native` (OSS) NO tiene DateField, DatePicker, Calendar ni TimeField, ni en la 1.0.8 instalada ni en la 1.0.11 (la última).** Existen en el producto de pago **`heroui-native-pro`**, que es otro paquete.

Evidencia:
- Instalada: `package.json:44` `"heroui-native": "1.0.8"`. Estilos importados en `src/theme/global.css:3` (`@import 'heroui-native/styles'`).
- Carpeta `src/components/` de `heroui-native@1.0.8` (caché de bun) y de `1.0.11` (tarball npm, descargado con `npm pack`): `accordion alert avatar bottom-sheet button card checkbox chip close-button control-field description dialog field-error glass-view input input-group input-otp label link-button list-group menu popover pressable-feedback radio radio-group scroll-shadow search-field select separator skeleton skeleton-group slider spinner sub-menu surface switch tabs tag-group text text-area text-field theme-background toast`. Idéntica en las dos versiones. `grep -rli "datefield|datepicker|calendar"` sobre `src/` y `README.md` de ambas: cero resultados.
- Documentación oficial de HeroUI Native (`heroui.com/docs/native/components`): 38 componentes, sin ninguno de fecha. `npm view heroui-native dist-tags` → `latest: 1.0.11` (publicada 2026-10-20). No hay versión posterior ni «1.1».
- `DateField` de la documentación abierta de HeroUI (`heroui.com/docs/react/components/date-field`) es de **`@heroui/react` (web)**, sobre React Aria y `@internationalized/date`: anatomía `DateField.Group / Input / Segment`. No se puede usar en React Native. Es probablemente el origen del nombre en la petición.
- Existe `DateField` y `DatePicker` en **HeroUI Native Pro** (`heroui.pro/docs/native/components/date-field` y `/date-picker`):
  - Import `from 'heroui-native-pro'`. Último publicado en npm: `1.0.0-beta.11` (2026-10-01). **Es beta.**
  - Instalación (`heroui.pro/docs/native/getting-started/installation`): `npx heroui-pro@latest login` (GitHub, sesión de 180 días) y `npx heroui-pro@latest install`, que «descarga los componentes Pro desde la CDN usando tu licencia». En CI exige `HEROUI_AUTH_TOKEN`. Hay que añadir a `global.css` `@import 'heroui-native-pro/styles'` y un `@source`. Requiere además `@internationalized/date` (3.12.4 en npm). El precio y los términos de licencia **no constan** en las páginas leídas (remiten al dashboard de heroui.pro).
  - `DateField`: «input de fecha con máscara `dd/mm/yyyy` y calendario opcional». Valor `{ value: 'YYYY-MM-DD', label: 'dd/mm/yyyy' }`, `onValueChange`, `inputMode` `'masked' | 'loose'`, `locale`. `minValue`/`maxValue` se pasan al `DateField.Calendar`, no a la raíz. Presentación `popover | dialog | bottom-sheet`. **Solo fechas: no documenta hora.**
  - `DatePicker`: trigger + calendario; `dateDisplayFormat` (`short|medium|long|full`), `locale`, `formatDate`.
  - La máscara fija `dd/mm/yyyy` no sigue el formato de `es`/`en` de la app.

### Alternativa más cercana con lo ya instalado (rung «ya instalado»)
Ninguna pieza OSS pinta una fecha, pero los bloques para construir un campo igual de HeroUI sí están:
- `TextField` + `Label` + `Input` / `InputGroup` (`InputGroup.Prefix`/`Suffix`, `isDecorative` deja pasar el toque al input) + `FieldError` ya se usan en el repo: precedente directo `src/components/password-input.tsx:1-47` (envuelve `InputGroup` con `InputGroup.Input className="h-13 rounded-xl bg-default"` y un `Suffix` con `Pressable` de 44).
- El selector de fecha/hora nativo ya lo da `@expo/ui/community/datetime-picker` (`ui-guidelines.md:96-109`, decisión fija 5): `mode: 'date' | 'time' | 'datetime'`, `minimumDate`, `maximumDate`, `presentation: 'dialog' | 'inline'` (Android; iOS siempre inline), `display`, `accentColor`, `themeVariant` (iOS), `locale` (iOS), `positiveButton`/`negativeButton` `{label}` (Android), `onValueChange`, `onDismiss`. Tipos: `@expo/ui/build/community/datetime-picker/types.d.ts`.
- **Regla que el humano debe conocer**: lo que se ve al elegir (diálogo de Material 3 en Android, calendario/rueda de SwiftUI en iOS) es **nativo del sistema** y ningún estilo global de HeroUI ni de `global.css` lo cambia. Solo se controlan `accentColor`, `themeVariant` y las etiquetas de los botones. Lo que sí se unifica es el **campo disparador** (la caja con su icono y su texto) y el estado de error.

---

## 2. Inventario exhaustivo de entradas de fecha y hora (hoy)

Barrido: `grep` de `datetime-picker|DateTimePicker|DatePicker|TimePicker|DateField|date-picker-value|mode="…"|maximumDate|minimumDate|yyyy|AAAA|birthDate|datePlaceholder`, y de todo `<Input|<TextInput|<TextField` (12 pantallas/componentes; el resto de inputs son texto/contraseña/teléfono, sin fecha). No hay `@react-native-community/datetimepicker` en `package.json` (solo `@expo/ui`). No existe ningún `type="date"` (RN).

| # | Pantalla | Fichero:línea | Tipo | Cómo se pide hoy | Restricción | testID(s) |
|---|---|---|---|---|---|---|
| 1 | **Registro de peso** — Fecha de medición | `src/screens/weight-log/index.tsx:242-254` (`Input` en `TextField`) | Fecha (ISO `AAAA-MM-DD`) | **Texto libre**, `placeholder` `weightLog.yyyyMmDd`; valor `measuredAt = measuredAtDraft ?? civilTodayIso(profileTimeZone)` (`:103`), `onChangeText={setMeasuredAtDraft}` | No futuro. Cliente: `isIsoDate` (`src/utils/form-rules.ts:16-19`, usado en `:82`). Servidor: 400 con `MEASURED_AT_IN_FUTURE_MESSAGE` mapeado a `weightLog.dateCannotBeAfterToday` (`:146-150`). «Hoy» = día civil en la zona del perfil (`src/utils/civil-today-iso.ts`) | `weight-date-input`, error `weight-date-input-error/-message/-message-row` |
| 2 | **Alta de mascota** — Fecha de nacimiento | `src/screens/add-pet/index.tsx:404-418` (`Pressable` + icono `Calendar`), picker en `:437-453` | Fecha | Disparador `Pressable` `h-12 rounded-xl border-2 border-transparent bg-default px-3.5` + `ExpoDateTimePicker` `mode="date"` `presentation="dialog"` dentro de `<Host>`. Estado `Date \| null`. Etiqueta con `toLocaleDateString(locale)` (`:415`) | `maximumDate={new Date()}` (no futuro); obligatoria si `ageMode==='birthDate'` (`form-rules.ts:33-34`). Alterna con edad aproximada en meses (`TextInput` `approx-age-input`, `:420`, no es fecha) | `birth-date-field`, `birth-date-picker`, error `birth-date-field-*` |
| 3 | **Nuevo recordatorio** — Fecha | `src/screens/add-reminder/index.tsx:210-227`, picker `:251-267` | Fecha | Igual que 2: `Pressable` `h-13 rounded-xl bg-default` + icono `Calendar`; etiqueta `toLocaleDateString(locale,{day:'numeric',month:'short',year:'numeric'})` (`:222`) | `minimumDate={new Date()}` (no pasado); `validateReminder` exige `dueAt` futuro (`form-rules.ts:44-52`) | `date-field`, `date-picker`, error `date-field-*` |
| 4 | **Nuevo recordatorio** — Hora | `src/screens/add-reminder/index.tsx:230-248`, picker `:269-285` | Hora | `Pressable` `h-13 rounded-xl bg-default` + icono `Clock`; `toLocaleTimeString(locale,{hh:mm,hourCycle:'h23'})` (`:241`); `ExpoDateTimePicker mode="time"` | Sin límites propios; el instante combinado (`combineDateAndTime`, `utils/reminder-dates.ts`) debe ser futuro | `time-field`, `time-picker` (sin `FieldErrorMessage` propio) |
| 5 | **Horario de comidas** — Hora de la franja (editar y añadir) | `src/screens/meal-schedule/index.tsx:310` («Editar» → `setPicker({from})`), `:372` («Añadir comida» → `setPicker({from:null})`), picker `:326-346` | Hora (`HH:mm`) | **Sin campo disparador**: el picker lo abren dos `Button`; `<Host matchContents>` `mode="time"`; `pickerValue`/`toMealTime` (`:43-52`) | Duplicados y 401 los resuelve el servidor/`runMealTimeEdit` | `meal-time-picker` |
| 6 | **Subida de documento** — Fecha del documento | `src/screens/docs-upload-form/index.tsx:176-190` (`Input` en `TextField`) | Fecha (ISO) | **Texto libre**, `placeholder` `docs.datePlaceholder` (`AAAA-MM-DD`), por defecto `civilTodayIso(undefined)` (`:41`) | `validateDocument` → `isIsoDate` (`form-rules.ts:56-64`); sin tope de futuro | `docs-date-input`, error `docs-date-input-*` |
| 7 | Historial de comidas — calendario de mes | `src/screens/meals-history/index.tsx:114-170` con `utils/month-grid.ts` | Selección de día (lectura, **no formulario**) | Rejilla propia de `DayCell` | — | Fuera del alcance: es una vista, no un input |

Notas:
- Solo hay **5 puntos de selector `ExpoDateTimePicker`** hoy (add-pet, add-reminder ×2, meal-schedule; el #5 cuenta una vez) y **2 campos de texto** que piden una fecha (peso y documentos). El «registro de peso» de la petición NO tiene picker hoy: es texto.
- El spec `specs/mobile-date-picker-utc-day-shift/requirements.md` (aprobada) documenta el bug de Android: el diálogo devuelve **medianoche UTC** del día tocado. `src/utils/date-picker-value.ts` (`toPickerValue`/`fromPickerValue`) lo corrige y hoy se llama a mano en add-pet (`:36,444,448`) y add-reminder (`:24,…`). `minimumDate`/`maximumDate` se pasan con el instante crudo (no se convierten). **Un componente compartido debe encapsular esto o se reintroduce el bug.** En el comportamiento de #5 (hora) no se convierte.
- Formatos de etiqueta incoherentes hoy: add-pet `toLocaleDateString(locale)` (numérico), add-reminder con mes corto. Peso/documentos muestran el ISO crudo.
- Dos ajustes de diálogo Android no se hacen hoy: ninguno pasa `positiveButton`/`negativeButton`, así que los botones del diálogo siguen el idioma del dispositivo, no el de la app (`useLocale()`/`useTranslate()`); y ninguno pasa `accentColor`. Y en iOS el picker es siempre inline: se pinta en el flujo, debajo del formulario, al pulsar (no hay hoja modal).
- Precedente de inputs de formulario con tamaños no unificados: `h-12` (peso, add-pet), `h-13` (add-reminder, edit-profile, password-input), sin alto explícito (docs-upload: cae al `min-height` de `.input__input`). Ver §3.

### Adelanto de features sin spec que añadirán más entradas de fecha
Del plan `progress/plan_mejoras-producto-2026-10-26.md` (todas `pending`, sin spec):
- **#208 `mobile-vaccine-create`** (`:76-78`): `appliedAt` no futuro «con `ExpoDateTimePicker` como en `add-reminder`» y `nextDoseAt` opcional (**dos fechas, una opcional/borrable**).
- **#213 `mobile-reminders-recurrence`** (`:188`): campo **«Hasta»** opcional en `add-reminder` (fecha opcional, con mínimo = la fecha del recordatorio).
- Indirectas: #209 (cuestionario de nutrición; no pide fecha) y #212/#215 (fecha de revisión que **muestra**, no pide). 
Consecuencia: el componente compartido debe nacer con **valor opcional/borrable**, `minDate`/`maxDate` y estado vacío, o #208 y #213 lo reabrirán. Y la spec de esta UI debería ir **antes** que las de #208/#213 (o ellas la citan), para que no instancien `ExpoDateTimePicker` a mano por quinta y sexta vez.

---

## 3. Estado del tema global de HeroUI

- **Entrada única**: `src/theme/global.css` (195 líneas): `@import 'tailwindcss'; @import 'uniwind'; @import 'heroui-native/styles'` (`:1-3`), `@source` del paquete y de `src` (`:5-6`), `@theme` con tokens propios (fuentes Inter, radios `--radius-card/-14/-16/-22/-24/…`, escalas `--text-13/15/17/…`), y los tokens semánticos por tema en `@layer theme { :root { @variant light {…} @variant dark {…} } }`.
- **Tokens de campo ya sobrescritos globalmente** (`global.css:~118-123` light y `:~190-194` dark): `--focus: #178255`, `--field-background: var(--default)`, `--field-foreground: var(--foreground)`, `--field-placeholder: var(--muted)`, `--field-border: transparent`, `--field-radius: 0.75rem` (12 px = `rounded-xl`). Es decir, el look de campo **ya es global**: todo `Input` de HeroUI sale con fondo `--default`, sin borde y radio 12.
- Receta base de `Input` (paquete): `styles/components/input.css` → `.input__input { min-height: calc(var(--spacing)*12) (48px); padding-inline: 3; border-radius: var(--radius-field); border-width: var(--border-width-field-width); border-color: var(--color-field-border) }`, `variant-primary { background-color: var(--color-field) }`. `input.styles.ts`: iOS `outline` accent al foco, Android `border-[1.5px] focus:border-accent`, `isInvalid` → danger. **Las clases `h-12 rounded-xl bg-default` que cada pantalla pasa al `Input` son redundantes con el global** (y con el `min-height`), pero un candado las exige (§4).
- Proveedor: `src/app/_layout.tsx:60` `<HeroUINativeProvider>` sin `config`.
- Color imperativo: `src/theme/use-theme-colors.ts` (`useThemeColors([...tokens])`); es la única vía permitida (candado #62 R13 prohíbe `useThemeColor` de heroui). Imprescindible para `accentColor`/`themeVariant` del picker nativo y para iconos.
- Esquinas continuas: `CONTINUOUS_CORNER` en `src/theme/native-styles.ts:9` en toda superficie redondeada no cápsula.
- Reglas de la carta que condicionan un campo nuevo: Tailwind v4 + uniwind + heroui-native y **cero hex, cero clases arbitrarias, cero `StyleSheet.create`** (`ui-guidelines.md:63-77`); enmienda #187 (`ui-guidelines.md:690-696`): **nunca `text-<n>` de la escala propia en un componente de heroui-native** (twMerge lo toma por color y cae a `text-base`), usar `Label.Text` y clases estándar; `Label` de heroui: el `className` va al `Pressable` raíz, texto por `Label.Text` (memoria `heroui-label-classname-inerte`). Radio de control: `rounded-xl` (`ui-guidelines.md:170-172`).

### Qué se podría cambiar globalmente para unificar inputs (opciones, sin decidir)
- **G0 (mínimo, recomendada):** no tocar `global.css`. El look de campo ya es global; el componente nuevo reutiliza `bg-default`, `rounded-xl` y la altura. La unificación que falta es de **alto** (`h-12` vs `h-13`) y de **estado de foco** (el `TextInput` crudo de add-reminder pinta `border-2 border-accent` a mano en `:196`, add-pet usa `border-2 border-transparent` en `:407,421`) — eso se arregla en el componente, no en CSS.
- **G1:** subir el alto base del campo a 52 (`h-13`) tocando `.input__input min-height` vía una clase propia en `@layer components` de `global.css`. Riesgo: uniwind no parsea prefijos de plataforma dentro de clases custom (nota en `input.styles.ts`); y el candado #199 R7 espera `h-12` en los tres inputs de Peso.
- **G2:** añadir tokens `--field-*` nuevos (p. ej. alto) en `@theme`. Cualquier token nuevo repetido 2+ veces es obligatorio por la carta, pero **no hay valor que se repita hoy** que justifique uno.
- Importante: **ningún cambio global afecta al diálogo nativo** (§1).

---

## 4. Candados y tests que cubren hoy estos inputs, y qué romperían

Ficheros en `src/__tests__/` (jest-expo + RNTL 14; nada de `import` real de picker: se doblan).

| Candado | Qué mira | Efecto de la migración |
|---|---|---|
| `screens/weight-log/index.test.tsx` (47 refs a `weight-date-input`) | `:380,433,656,672,701,717,733,949,1422` leen `.props.value` (ISO) del nodo; `:413,529,548,568,584` hacen `fireEvent.changeText` (3 son `it.each`); `:478,551,589,599` leen `weight-date-input-message/-message-row`; `:1322` `within(row)`; **`:1333-1340` (#199 R7): el nodo `weight-date-input` debe tener las clases `h-12 rounded-xl bg-default`**; `:1327-1331` la etiqueta `Fecha de medición` con `className` `'text-13 font-extrabold text-foreground'` | Los `changeText` (≈5 sitios) hay que reescribirlos a eventos del picker; los `.props.value` sobreviven **si el nodo con ese testID sigue exponiendo `value` ISO**. La prop de clases y la etiqueta hay que conservarlas. El resto de tests de TZ (`#90 R3/R4`) siguen válidos si el valor por defecto sigue saliendo de `civilTodayIso(profileTimeZone)` |
| `screens/docs-upload-form/index.test.tsx` | `:214,289,303,322,333,343,379,389` (changeText, placeholder `AAAA-MM-DD`, error de formato, valor inicial) | Reescribir si el texto libre se sustituye por picker; `:303` (`placeholder`) y los dos de «fecha sin formato ISO» (`:343,379,389`) dejan de aplicar si ya no se puede teclear |
| `screens/add-pet/index.test.tsx` | `jest.mock('@expo/ui', …Host testID 'expo-ui-picker-host')` y `jest.mock('@expo/ui/community/datetime-picker', …)` (`:50-64`), lee `birth-date-picker.props.{value,maximumDate}` y dispara `onValueChange` | Los dobles de módulo siguen valiendo **si el componente compartido importa exactamente esos dos módulos**. Si importa otra ruta, los dobles dejan de interceptar y el nativo real revienta en jest |
| `screens/add-reminder/index.test.tsx` | mismos dobles (`:66-96`), `date-field`/`time-field` (pulsar), `date-picker`/`time-picker` (`props.minimumDate`, `onValueChange`), `date-field-message` **hijo del padre del field, no del field** (`:351-355`: `within(field.parent!).queryByTestId('date-field-message')` y `within(field).…` es null) | Estructura de nodos del test depende de que el error sea **hermano**, no hijo, del disparador |
| `screens/meal-schedule/index.test.tsx` (38 refs) | `meal-time-picker` y flujos editar/añadir | Si la hora pasa por el componente, conservar `meal-time-picker` |
| `__tests__/forms-validation-global.test.ts:76` (#186 R9) | `source.split('FieldErrorMessage').length-1`: add-pet **4**, add-reminder **3**, docs-upload **4**, weight-log **4**; y `:60-63`: **solo `components/field-error-message.tsx` importa `FieldError` de heroui-native** | El `DateField` no debe renderizar ni importar `FieldError` (si lo hace, bajan los recuentos de pantalla y/o se añade un importador). **Las pantallas siguen pintando su `FieldErrorMessage`** |
| `__tests__/add-pet-two-steps.test.ts:18-24` (#191 R11) | en `add-pet/index.tsx`: `style={CONTINUOUS_CORNER}` **exactamente 6**, `rounded-16` **2**, `FieldErrorMessage` **4** | Mover el `Pressable` de fecha de nacimiento (lleva `CONTINUOUS_CORNER` en `:409`) a un componente baja el recuento a 5: hay que enmendar (6 → 5) |
| `__tests__/consistency-classnames.test.ts:203-228` (#62 R12) | `TextInput` crudos: **6 en total**, 5 con placeholder (deben llevar `placeholderTextColor={muted}`), ninguno con `border border-border` | No afecta si el componente no usa `TextInput` crudo; si lo usa cuenta como el 7.º y rompe |
| `__tests__/heroui-text-size-merge.test.ts` (#187 R1) | ningún `text-NN` escala-propia en JSX de heroui/`Card`; **`opaque` debe ser exactamente `['components/password-input.tsx InputGroup.Input']`** (:136); y cotas inferiores ≥28 ficheros, ≥197 elementos heroui, ≥163 con `className` | El componente nuevo debe pasar `className` **literal** (sin spread ni expresión opaca) a `InputGroup.Input`/`Label`; si no, entra en `opaque` y rompe. Quitar `Input`/`TextField` de peso y docs resta elementos heroui: revisar que el total no cae bajo 197/163 (las cotas están calculadas al milímetro) |
| `__tests__/design-drift.test.ts` | Regex de escapes (`FEATURE_STYLE_ESCAPES`: `text-[10px]`, hex, `StyleSheet`) aplicada por lista de ficheros de cada feature: el #68 R18 (home, pairing) **no cubre estos ficheros**, pero es el mismo patrón que cualquier componente nuevo debe cumplir (`R9` cubre `screens/add-pet/index.tsx` `:260`). **Inventarios exactos** de radios por fichero (`:1119-1170`): `rounded-16` por fichero (peso 1, add-pet 2, add-reminder 1, docs-upload 2…), lista de ficheros con `rounded-14` y `text-17`/`text-22` (`:1237-1262`). `'weight-log'` y `'meal-schedule'` deben importar `components/card` (`:229-244`) | Un `components/date-field.tsx` que use `rounded-16`, `rounded-14`, `text-17` **se añade a esos inventarios y los rompe**: usar `rounded-xl` y escala estándar, o enmendar. Los contadores por fichero de `rounded-16`/`text-17` de las pantallas no cambian si no se tocan esas clases |
| `__tests__/ui-copy-table.ts` + `ui-language.test.ts` | Filas `{file,key}`: `weight-log weightLog.yyyyMmDd` (`ui-copy-table.ts:188`), `docs-upload-form docs.date` y `docs.datePlaceholder` (`:336-337`), `add-reminder addReminder.date`/`selectDate` (`:402-403`), `add-pet addPet.birthDate`/`selectBirthDate` (`:444,446`). `checkUses(ALL_USES)` exige que el **fichero nombrado resuelva esa clave**; `SCREEN_FILES` es la lista de ficheros distintos de la tabla y su **recuento está fijado** (`ui-language.test.ts:498-516`, cuenta aritmética con comentarios por feature) y cada uno se escanea contra copy suelta | (a) Si el copy (`placeholder`, «Seleccionar fecha», etiquetas de botones del diálogo) se mueve a `components/date-field.tsx`, las filas se mueven con él y ese fichero **suma +1** al recuento (precedente: `#172 R16` suma `back-button` y `password-input`). (b) Si el componente recibe el texto por props desde la pantalla, las filas se quedan. (c) Si desaparece el placeholder `AAAA-MM-DD` (picker), la clave queda sin uso: hay que retirarla del catálogo y de la tabla en el mismo cambio. Y `validation.invalidDate` (`form-rules.ts:10`, tabla `:160`) sigue en uso mientras exista una validación ISO |
| `components/__tests__/*` | No hay test de un campo de fecha; hay patrón de test de componente compartido (`password-input.test.tsx`, `field-error-message.test.tsx`, `toggle-switch.test.tsx`) | El componente nuevo necesita su `date-field.test.tsx` (convención `conventions.md:37-67`/ya practicada) |
| `utils/date-picker-value.test.ts`, `utils/civil-today-iso.test.ts`, `utils/form-rules.test.ts` | Contrato de las conversiones UTC y de `isIsoDate` | Sin cambio si se mantienen las utilidades; se reutilizan desde el componente |
| `specs/mobile-date-picker-utc-day-shift` (aprobada) | P5/C6: pasar `minimumDate`/`maximumDate` con instantes crudos, no con `toPickerValue` | El componente compartido debe respetar C6 o reabre el bug del día corrido en UTC−6 |

Nota de entorno que muerde: jest corre en UTC (VPS y CI): **el bug de zona es invisible en test** (`P10` del spec). Cualquier prueba de la conversión debe usar `process.getBuiltinModule` o doblar `Platform.OS`, no `process.env.TZ` (memoria `jest-process-env-tz-ciego`).

---

## 5. Propuesta de componente compartido y plan de migración

### Reglas que habilitan extraer (`ui-guidelines.md:88-91`)
«≥2 pantallas + rol nombrable + API menor que implementación»: se cumple de sobra (4 pantallas, 5 puntos, y #208/#213 vendrán). Promoción permitida: inline → `src/components/`.

### Opción de forma (propuesta, no decisión)
Dos componentes hermanos, **uno por fichero** (kebab-case, `conventions.md:11-36`), cada uno con su test colocado en `src/components/__tests__/`:
- `src/components/date-field.tsx` → `DateField` (fecha civil). Es el nombre que pide el humano.
- `src/components/time-field.tsx` → `TimeField` (hora). Comparte con `DateField` un helper privado `src/components/picker-field.tsx`? **No** (YAGNI): dos disparadores casi idénticos se pueden resolver con un único `DateField` con `mode: 'date' | 'time'`; ver decisión D2.

Anatomía del componente (todo con piezas ya instaladas, sin dependencia nueva):
- Disparador: `Pressable` (alto uniforme, `bg-default`, `rounded-xl`, `CONTINUOUS_CORNER`, icono `Calendar`/`Clock` de reicon vía `useThemeColors`) o `InputGroup` con `InputGroup.Input editable={false}` + `Prefix isDecorative` (precedente `password-input.tsx`). Con `InputGroup` el foco/error/disabled los pinta HeroUI (outline accent/danger) sin código propio y se hereda `--field-*` global: es lo más cercano a «usa el componente de HeroUI».
- `Label` de heroui con `Label.Text` (`text-13 font-extrabold text-foreground` hoy en Peso; **sin** `text-NN` sobre el elemento heroui: `Label.Text` es Text de RN, regla #187).
- Picker: `ExpoDateTimePicker` dentro de `<Host>` (mismo import que hoy: `@expo/ui` y `@expo/ui/community/datetime-picker`, para que los dobles de los tests sigan interceptando), montado solo al abrir.
- Encapsulados dentro: `toPickerValue/fromPickerValue` (bug Android), `minimumDate/maximumDate` crudos (C6), `accentColor` y `themeVariant` desde `useThemeColors`, `positiveButton/negativeButton` desde `useTranslate()`, formato de etiqueta con `useLocale()`.
- API mínima (propuesta): `{ testID: string; pickerTestID: string; label: string; value: string | null /* 'YYYY-MM-DD' | 'HH:mm' */; onChange(next: string | null): void; mode?: 'date' | 'time'; minDate?: string; maxDate?: string; placeholder: string; isInvalid?: boolean; allowClear?: boolean }`. **El error NO lo pinta el componente**: la pantalla sigue con `<FieldErrorMessage testID={…} issue={…} />` como hermano (candados #186 R9 y el `within(field.parent!)` de add-reminder).
- `pickerTestID` explícito porque los ids actuales no se derivan por sufijo (`birth-date-field`/`birth-date-picker`, `date-field`/`date-picker`, `time-field`/`time-picker`, `meal-time-picker`).

### Plan de migración por pantalla (orden sugerido; cada paso conserva testIDs)
1. **Registro de peso** (lo pedido). Sustituir `Input` por `DateField` con `value={measuredAt}` (ISO), `maxDate={civilTodayIso(profileTimeZone)}` (el picker impone «no futuro» en el día civil de la zona del perfil, que el tope nativo del dispositivo no sabe). Se **conserva** la validación `isIsoDate` y el mapeo del 400 de fecha futura (defensa; tests `#186 R7`). Conservar `weight-date-input` con clases `h-12 rounded-xl bg-default` y `.props.value` ISO. `weightLog.yyyyMmDd` pasa a ser el texto de relleno del disparador si hace falta (o se retira de catálogo y tabla).
2. **Documento** (`docs-upload-form`): mismo componente, sin `maxDate` (hoy sin tope); valor inicial `civilTodayIso(undefined)`. Retirar `docs.datePlaceholder`, `docs.errorInvalidForm` ya cita formato AAAA-MM-DD (`catalog.ts:306,766`): el copy cambia si ya no se teclea.
3. **Alta de mascota**: el `Pressable` `birth-date-field` pasa a `DateField` con `maxDate=hoy`. Convertir `Date`↔ISO (ya existe `dateToIso`, `add-pet/index.tsx:46`). Enmienda del recuento `CONTINUOUS_CORNER` 6 → 5 en `add-pet-two-steps.test.ts:20`.
4. **Nuevo recordatorio**: `date-field` (`minDate=hoy`) y `time-field` (`mode="time"`). La fecha+hora se combinan con `combineDateAndTime` (sigue necesitando `Date`): el componente devuelve ISO/`HH:mm` y la pantalla construye el `Date`, o expone el `Date` (ver D3).
5. **Horario de comidas**: hoy no hay campo; solo el picker. Migrar con la misma API **solo si** se acepta mostrar un campo; si no, queda fuera (D5).
6. **Siguientes**: #208 (dos fechas, una opcional con `allowClear`) y #213 («Hasta», `minDate` = fecha del recordatorio) nacen ya sobre el componente.

Cada paso es una pieza TDD: test rojo del componente (R-id propio) primero, luego pantalla. Handoff a Codex: nombrar sus skills, no las nuestras (`CLAUDE.md` §UI móvil, B5): para `@expo/ui` el nombre de su plugin v1.0.2 está en `.claude/agents/leader.md` §Catálogo real de skills de Codex.

---

## Riesgos

1. **La premisa de la petición no se cumple con el paquete instalado.** Prometer «HeroUI DateField» sin D1 cerrada llevaría a una spec imposible o a una dependencia de pago/beta.
2. **Heroui Native Pro**: licencia de pago (términos no verificados), beta (`1.0.0-beta.11`), instalación por CLI con login GitHub y descarga desde CDN con **postinstall** (ver memoria «Dependencias nuevas autorizadas» y «Decisiones de costo: no inferir»), `HEROUI_AUTH_TOKEN` en CI, `@import 'heroui-native-pro/styles'` en `global.css`, posible fricción con `init.sh`/Codex (worktree nuevo sin `node_modules`). Su `DateField` solo cubre fecha, con máscara `dd/mm/yyyy` fija, calendario propio (no el nativo) y valor `{value,label}`; **no resuelve la hora** ni los 3 de #208/#213 por sí solo. Cambia además el patrón fijo «`@expo/ui/community/*` por defecto» (`ui-guidelines.md:96-109`).
3. **Bug UTC de Android** si el componente no encapsula `toPickerValue/fromPickerValue` y los límites crudos (spec `mobile-date-picker-utc-day-shift`).
4. **El estilo del diálogo nativo no es global ni de HeroUI**: el humano puede esperar un look que solo se logra con `accentColor`/`themeVariant`; Material 3 / SwiftUI mandan.
5. **iOS**: el picker es inline y siempre visible al montarse; en el smoke (Android, dev build) no se ve. Si `DateField` se usa en iOS la spec debe decidir dónde pinta (hoy se mete bajo el formulario).
6. **Candados exactos** (§4): `FieldErrorMessage` por pantalla, `CONTINUOUS_CORNER` de add-pet, `opaque` de #187, inventarios de `rounded-14/16/text-17`, recuento de `SCREEN_FILES` y filas de `ui-copy-table`. Cada uno es una enmienda de candado nombrada en la spec, con casilla humana propia si toca `docs/ui-guidelines.md`/`conventions.md`.
7. **Peso pasa de «teclear» a «tocar»**: se pierde el atajo de teclear una fecha lejana en Android (el diálogo de Material 3 sí ofrece su modo texto con `display="spinner"` según el tipo); y pasar a `maxDate` en el cliente cambia qué casos del servidor llegan (el 400 de futuro sigue pudiendo salir por desfase de zona).
8. **Tests de zona ciegos en jest** (UTC): una conversión mal hecha pasa verde.
9. **Dos pantallas con el mismo copy** (`addReminder.selectDate`, `addPet.selectBirthDate`, `weightLog.yyyyMmDd`, `docs.datePlaceholder`): quien mueva el texto debe mover las filas de `ui-copy-table.ts` y verificar la clave en el catálogo en/es.
10. **Premisas del explore sin verificar contra el árbol vivo** (memoria `premisas-de-explore-sin-verificar`): los números de línea citados caducan al mergear #208-#216 (todas tocan `add-reminder`/Salud/Perfil). Anclar por contenido, no por línea, en la spec.

## Decisiones abiertas (opciones cerradas)

- **D1 — Librería del DateField.**
  - **A.** Componente propio `DateField` con piezas OSS ya instaladas (`TextField`/`InputGroup`/`Label` de `heroui-native` + `@expo/ui/community/datetime-picker`). Cero dependencia nueva, cero coste, conserva la decisión fija 5. *(la que menos rompe)*
  - **B.** `heroui-native-pro` (`DateField`/`DatePicker`). Coste y beta; solo fecha; máscara fija; cambia la decisión fija 5.
  - **C.** B para fechas y A para horas.
  Si el humano elige B o C hay que preguntar **la frase literal de coste** (licencia) antes de la spec; no se infiere.
- **D2 — Nombre y forma.** (i) un `DateField` con `mode: 'date'|'time'` en `components/date-field.tsx`; (ii) `DateField` + `TimeField` en dos ficheros. Recomendación del explorador: (i), un solo componente, API menor que implementación.
- **D3 — Tipo del valor.** (i) ISO string civil (`'YYYY-MM-DD'`, `'HH:mm'`; casa con peso, documentos y con `civilTodayIso`); (ii) `Date`. Con (i) add-pet/add-reminder convierten en la pantalla. Recomendación: (i).
- **D4 — Documentos.** (i) migrar también el campo de documento; (ii) dejarlo como texto. Recomendación: (i), porque «global» lo pide el humano y evita dos recetas.
- **D5 — Horario de comidas.** (i) sin cambio (no hay campo); (ii) migrar y mostrar un campo de hora. Recomendación: (i), porque el flujo actual es de botones y la petición habla de campos de fecha.
- **D6 — Alto del campo.** (i) `h-12` para todos; (ii) `h-13` para todos; (iii) prop `size`. Hoy mandan `h-12` en Peso por candado #199 R7; unificarlo a 13 enmienda varios tests de Peso/add-pet.
- **D7 — Estilo global.** G0 (no tocar `global.css`) frente a G1/G2. Recomendación: G0; el look de campo ya es global y lo que cambia lo hace el componente.
- **D8 — Pro con `Calendar` propio (si D1=B/C):** `presentation` `popover` | `dialog` | `bottom-sheet` (la app usa bottom-sheet de `community/bottom-sheet`).
- **D9 — Ámbito de la spec.** Una sola feature «campo de fecha compartido» que migre Peso, Documentos, Alta de mascota y Recordatorio, **antes** de #208/#213; o dos (componente + Peso, luego el resto). Se necesita feature id nuevo contra `origin/main` (memoria «Ids de feature: asignación única»).
- **D10 — Tope «no futuro» en Peso.** (i) el picker lo impone con `maxDate` y se conserva la validación cliente/servidor; (ii) solo validación como hoy. Recomendación: (i).

## Recomendación
- Cerrar D1 primero con el humano: la petición supone una pieza de HeroUI que **solo existe en el producto de pago y en beta**; sin eso no se puede especificar. Si la respuesta es «lo más cercano sin pagar», la ruta es A + D2(i) + D3(i) + G0.
- Hacer un único componente compartido `src/components/date-field.tsx` sobre `InputGroup` de `heroui-native` y `@expo/ui/community/datetime-picker`, que encapsule: conversión UTC de Android, límites crudos, `accentColor`/`themeVariant`, botones del diálogo traducidos y formato por `useLocale()`; sin pintar el error (queda en `FieldErrorMessage` de la pantalla).
- Migrar por pantalla en el orden del §5, empezando por Peso, con TDD y enmiendas nombradas de los candados de §4.
- Colocar la spec de esta UI antes de #208 y #213, porque ambas añaden entradas de fecha y hoy su texto manda usar `ExpoDateTimePicker` «como en `add-reminder`».
- No cambiar `global.css` salvo decisión explícita: el tema de campo ya es global.

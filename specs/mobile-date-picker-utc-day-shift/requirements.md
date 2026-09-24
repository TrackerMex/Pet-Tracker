---
feature: "mobile-date-picker-utc-day-shift"
status: approved         # draft | spec_ready | approved
tags: [harness, spec, mobile]
---

# Requisitos — [[mobile-date-picker-utc-day-shift]] (#123)

> Notación EARS. Cada requisito tiene id único R\<n\>, inmutable una vez aprobado.
> Ver [[design]] para las decisiones técnicas, [[tasks]] para el orden de
> commits y [[traceability]] para la trazabilidad.
>
> Fuente: `feature_list.json` #123 (description + cinco criterios). Cada
> premisa del encargo se verificó contra el árbol y contra el código instalado
> de `@expo/ui` 57.0.11 antes de escribir un requisito (§0); las que no
> cuadraban se corrigen en §0.2.
>
> Feature **solo móvil**, bug P1. Cambia dos líneas en cada una de dos
> pantallas y añade un módulo de dos funciones en `src/utils/`. **Cero
> cambios de vista, cero claves de catálogo, cero dependencias, cero parches a
> `node_modules`, cero cambios nativos** (no hace falta regenerar el dev build).
>
> Base: `70f841f3` (= `origin/main` el 2026-09-24). Branch
> `feature/123-mobile-date-picker-utc-day-shift`, worktree
> `/home/claude/sites/Pet-Tracker-wt-backend`. Rutas relativas a
> `mobile-pet-tracker/` salvo las que empiezan por `docs/`, `specs/` o
> `progress/`. Rutas de `@expo/ui` relativas a `node_modules/@expo/ui/`.
> **Ninguna cita usa número de línea**: todo ancla es un texto literal que se
> encuentra con `grep -n`.

---

## §0. Verificación de premisas contra el árbol

### §0.1 Premisas confirmadas

| # | Premisa | Evidencia (ancla grepeable, medida en `70f841f3`) |
|---|---|---|
| P1 | La app resuelve el picker al código fuente del paquete, sin build intermedio | `package.json` de `@expo/ui` (versión `"57.0.11"`): `"./community/datetime-picker"` → `"default": "./src/community/datetime-picker/index.tsx"`. En Android carga `src/community/datetime-picker/DateTimePicker.android.tsx` |
| P2 | Con `presentation="dialog"` y `mode="date"` el wrapper monta el diálogo de fecha de Compose y le pasa el valor como ISO | `DateTimePicker.android.tsx`: `initialDate: value.toISOString(),` dentro de `dialogProps`, y `<AndroidDatePickerDialog` con `variant={displayToAndroidVariant(display)}`. `onDateSelected` llama a `onValueChange(buildChangeEvent(date), date)` |
| P3 | La capa JS convierte ida y vuelta sin tocar la zona | `src/jetpack-compose/DatePicker/index.tsx`, en `export function DatePickerDialog(`: `initialDate: initialDate ? new Date(initialDate).getTime() : null,` y `props.onDateSelected?.(new Date(date));` |
| P4 | El nativo abre con el instante crudo y devuelve `selectedDateMillis` tal cual | `android/src/main/java/expo/modules/ui/DatePickerView.kt`, en `fun ExpoDatePickerDialogContent(`: `initialSelectedDateMillis = initialDate,` y el botón OK: `onDateSelected(DatePickerResult(date = state.selectedDateMillis))`. En Material3, `initialSelectedDateMillis` y `selectedDateMillis` son «UTC milliseconds» y designan el **día UTC** (medianoche UTC). Resultado: el `Date` que recibe la pantalla es la medianoche UTC del día tocado, y el diálogo abre en el día UTC del instante recibido. El síntoma del humano (24 → 23 en UTC−6) es exactamente eso |
| P5 | `minimumDate`/`maximumDate` **sí** se convierten bien en el nativo | `DatePickerView.kt`: `private fun toUtcDayMillis(localMillis: Long): Long {` toma año, mes y día con `Calendar.getInstance()` (zona del dispositivo) y los fija a medianoche UTC; lo usa `rememberSelectableDates`. Por eso la pantalla debe seguir pasando el instante actual crudo (C6) |
| P6 | El picker de hora es correcto en cualquier zona | `DatePickerView.kt`, en `fun ExpoTimePickerDialogContent(`: `val cal = Calendar.getInstance()`, `cal.timeInMillis = initialDate`, `cal.set(Calendar.HOUR_OF_DAY, state.hour)`, `cal.set(Calendar.MINUTE, state.minute)`. Hora inicial y resultado en la zona del dispositivo, sobre el día local de `value`. `combineDateAndTime` de `src/utils/reminder-dates.ts` lee `time.getHours()` y `time.getMinutes()`: coincide. **No entra en el alcance** |
| P7 | Hay exactamente dos call sites con `mode="date"`, ambos en diálogo y sin `display` | `git grep -n "datetime-picker" -- src` → solo `src/screens/add-reminder/index.tsx`, `src/screens/add-pet/index.tsx` y sus dos tests. En add-reminder: `testID="date-picker"`, `minimumDate={new Date()}`, `value={date ?? new Date()}`, `setDate(selectedDate);`. En add-pet: `testID="birth-date-picker"`, `maximumDate={new Date()}`, `value={birthDate ?? new Date()}`, `setBirthDate(selectedDate);`. El tercero es `testID="time-picker"` (`mode="time"`, `value={time}`). Sin `display` → `'default'` → variante `'picker'` |
| P8 | Lo que muestra y lo que manda cada pantalla | add-reminder: `date.toLocaleDateString(locale)` en `date-field`; `const dueAt = combineDateAndTime(date, time);` → `dueAt: dueAt.toISOString(),` en `createReminder`. add-pet: `birthDate.toLocaleDateString(locale)` en `birth-date-field`; `ageInput = { birthDate: dateToIso(birthDate) };` con `function dateToIso(date: Date): string {` sobre getters **locales** |
| P9 | En jest, `Platform.OS` es `'ios'` salvo que el test lo cambie | `"preset": "jest-expo"` en `package.json`; `bunx jest --showConfig` → `"defaultPlatform": "ios"`. Precedente de cambio: `function setPlatform(os: string): void {` con `Object.defineProperty(Platform, 'OS', { configurable: true, value: os });` en `src/hooks/use-push-registration.test.tsx`. Medido con una sonda en el scratchpad (fuera del repo): las dos pantallas renderizan y funcionan con `Platform.OS = 'android'` |
| P10 | No se puede forzar la zona desde un test | Medido en #84 (`specs/reminder-dates-days-until-drift/requirements.md` §0.2 C3). VPS y CI corren en UTC, donde el bug es **invisible** con `Date` reales: la medianoche UTC es la medianoche local |
| P11 | Ningún helper existente hace esta conversión | `civilTodayIso` (`src/utils/civil-today-iso.ts`) devuelve `'YYYY-MM-DD'` de una zona; `combineDateAndTime`/`daysUntil` (`src/utils/reminder-dates.ts`) combinan y cuentan; `localDayOf`/`calendarDaysUntil` (`src/screens/home/format.ts`) leen `'YYYY-MM-DD'` y cuentan. Ninguno pasa de «instante del diálogo» a «día local» ni al revés. Dos call sites × dos direcciones justifican un módulo propio ([[design]] D1) |
| P12 | Los dos tests dejan leer y disparar el picker | Los dos ficheros hacen `jest.mock('@expo/ui/community/datetime-picker', …)` con un `function MockDateTimePicker(props: Record<string, unknown>)` que pinta un `View` con **todas** las props, y `jest.mock('@expo/ui', …)` con un `Host` de `testID: 'expo-ui-picker-host'`. Se leen `picker.props.value`, `.minimumDate`, `.maximumDate`, y `fireEvent(picker, 'onValueChange', <evento>, <fecha>)` invoca el callback de la pantalla. add-reminder ya tiene `async function pickDate(date: Date) {` y `function makeReminder(` |
| P13 | Bases medidas | Suite móvil **82 suites / 1471 tests** (init.sh del leader en `70f841f3`, exit 0, sin pipe; y `bunx jest` del spec_author, exit 0). `src/screens/add-reminder/index.test.tsx`: **21**. `src/screens/add-pet/index.test.tsx`: **20** |

### §0.2 Premisas corregidas (nadie construye sobre la versión anterior)

| # | Qué decía el encargo | Lo que dice el árbol | Evidencia |
|---|---|---|---|
| C1 | «Introducido con los pickers nativos de Expo UI (commit `02f02ae4`)» | Solo para **add-reminder**. `02f02ae4` toca `add-reminder/index.tsx`, `app.json`, `package.json` y `bun.lock`. **add-pet** nació ya con el picker de Expo UI en `f44f8dc5` (`feat(mobile-pets-profile): add pet creation flow (R6)`), el mismo día | `git show --stat 02f02ae4`; `git log -S"@expo/ui/community/datetime-picker" -- mobile-pet-tracker/src/screens/add-pet/index.tsx` |
| C2 | «convertir en un único helper la fecha devuelta (`getUTCFullYear`/`getUTCMonth`/`getUTCDate` a un `Date` local) y la inicial» | Cierto **en Android**, falso en iOS. El `DateTimePicker.tsx` no-Android monta el `DatePicker` de SwiftUI (`ios/DatePickerView.swift`), enlazado a `selection` como **instante**: con `.date` conserva la hora del valor y devuelve un instante **local**. Leer sus `getUTC*` daría **mañana** en UTC−6 después de las 18:00 y **ayer** de madrugada en zonas UTC+. (`DateTimePicker.web.tsx` devuelve `null`.) Decisión: la conversión va **solo en Android**, dentro del helper ([[design]] D2) | `ios/DatePickerView.swift`: `DatePicker(title, selection: $date, …)` y `props.onDateChange(["date": newDate.timeIntervalSince1970 * 1000])` |
| C3 | (implícito) nada en el repo contradice el arreglo | **Un candado de #90 fija la premisa contraria**: `describe('#90 R6: birthDate manda el día civil local del picker, no el UTC'` en `src/screens/add-pet/index.test.tsx` asume que el picker entrega un `Date` cuyo día **local** es el elegido. En el diálogo de Android es falso (P4). Sigue verde porque jest corre como `'ios'` (P9) y en iOS el helper no convierte (D2): desde #123 es el **candado de pantalla de la rama iOS** de add-pet. **No se toca**. Si alguien quitara la puerta de plataforma, se pone rojo (su doble tiene día UTC 18 → mandaría `'2026-09-18'`) | Su doble: `Object.assign(new Date(2026, 8, 17, 23, 30), {` con `getUTCDate: () => 18,` |
| C4 | `files_affected`: las dos pantallas y sus dos tests | Faltan el módulo nuevo y su test: `src/utils/date-picker-value.ts` y `src/utils/date-picker-value.test.ts` | [[design]] §Archivos afectados |
| C5 | «Pasa con CUALQUIER día» | Cierto en offsets **negativos** para el día devuelto (a toda hora) y, para el día inicial, a partir de la hora en que UTC cambia de día (18:00 en Ciudad de México). En offsets **positivos** el día devuelto es correcto (medianoche UTC = madrugada local del mismo día) y solo falla el inicial entre las 00:00 y la hora del offset (Madrid: de 00:00 a 02:00 abre en **ayer**). El arreglo cubre los dos casos (R2 fila 5). Nota: en add-pet después de las 18:00, pulsar OK **sin tocar ningún día** guarda hoy, porque los dos defectos se cancelan (abre en mañana UTC → vuelve medianoche UTC de mañana → 18:00 locales de hoy); el defecto aparece al tocar un día | Sonda en el scratchpad con `TZ=America/Mexico_City` y `TZ=Europe/Madrid` |
| C6 | (no lo mencionaba) | **`minimumDate` y `maximumDate` no se convierten.** El nativo ya los lleva al día local (P5). Si la pantalla los pasara por el helper, en Ciudad de México por la noche add-reminder dejaría elegir **ayer** y add-pet **no** dejaría elegir hoy. R5 y R7 lo candan | `toUtcDayMillis` en `DatePickerView.kt` |
| C7 | Smoke: «verificar lo que muestra el detalle de la mascota» | La app **no muestra `birthDate`** en ningún sitio: el Perfil pinta `t('profile.ageMonths', { months: pet.ageMonths })` en `src/screens/profile/index.tsx`, y el backend calcula `ageMonths` en UTC (`function completeMonthsSince(` en `backend-pet-tracker/src/modules/pets/domain/entities/pet.entity.ts`). La prueba de humo elige una fecha de nacimiento para la que el día correcto y el desplazado dan edades distintas (§Prueba de humo, paso 5) | `git grep -ln "birthDate" -- src` sin tests → solo `api/`, `i18n/catalog.ts` y `add-pet` |

---

## Qué firma el humano al aprobar esta spec

Firmar sin editar = aceptar **D1-D9** de [[design]] tal cual. Aquí, una línea
por las decisiones que fijan comportamiento o alcance; D5-D8 son de arnés de
test.

| Id | Decisión | En una línea |
|---|---|---|
| **D1** | **Un módulo, dos funciones** | `src/utils/date-picker-value.ts` exporta `toPickerValue(day: Date): Date` (lo que se le pasa al diálogo: medianoche UTC del día local, `new Date(Date.UTC(getFullYear(), getMonth(), getDate()))`) y `fromPickerValue(picked: Date): Date` (lo que la pantalla guarda: medianoche local del día UTC, `new Date(getUTCFullYear(), getUTCMonth(), getUTCDate())`). Las dos pantallas lo usan en sus dos direcciones. Nada en `node_modules`, nada nativo |
| **D2** | **Solo Android convierte** | Si `Platform.OS !== 'android'`, las dos funciones devuelven su argumento (el mismo objeto). iOS (#60, sin build hoy) y web quedan como están |
| **D3** | **El mínimo, el máximo y la hora no se tocan** | `minimumDate={new Date()}`, `maximumDate={new Date()}` y todo el picker de hora siguen igual (P5, P6) |
| D4 | **Zona negativa por dobles, no por `TZ`** | Un `Date` real construido con la **hora de pared de Ciudad de México** y los tres getters UTC sesgados al día UTC real (la forma del doble de `#90 R6`). Fiel en cualquier host en lo que lee la app |
| D9 | **Copy intacto** | Sin claves nuevas: **+0** en el candado del catálogo |

Si el humano **no** firma D2 y quiere la conversión incondicional, esta spec
se reabre: R3 cambia de sentido y `#90 R6` pasa a moverse (C3).

---

## Contrato (normativo)

- **En Android** (`Platform.OS === 'android'`):
  - `fromPickerValue(picked)` devuelve un `Date` **nuevo** a medianoche local
    cuyo `getFullYear()`, `getMonth()` y `getDate()` son el
    `getUTCFullYear()`, `getUTCMonth()` y `getUTCDate()` de `picked`.
  - `toPickerValue(day)` devuelve un `Date` **nuevo** cuyo instante es
    `Date.UTC(day.getFullYear(), day.getMonth(), day.getDate())`.
  - Ninguna de las dos lee `getTime`, `getTimezoneOffset`, `toISOString` ni la
    hora del argumento.
- **Fuera de Android**, las dos devuelven su argumento (`toBe`).
- **Pantallas**: el diálogo de fecha recibe
  `value={toPickerValue(<estado> ?? new Date())}` y su `onValueChange` guarda
  `fromPickerValue(selectedDate)`. `minimumDate` / `maximumDate` siguen siendo
  `new Date()`. El picker de hora no cambia.

---

## Requisitos funcionales

Todas las `describe` nuevas llevan el prefijo canónico `#123 R<n>:`
(`docs/conventions.md` §Prefijo de feature: los dos ficheros de pantalla ya
tienen R-ids de otras specs).

**Dobles de zona** (D4). En los tres ficheros de test, un helper local
`wallClock(local, utc)`: `Object.assign(new Date(local[0], local[1], local[2], local[3], local[4]), { getUTCFullYear: () => utc[0], getUTCMonth: () => utc[1], getUTCDate: () => utc[2] })`.
`local` = `[año, mesIndex, día, hora, minuto]` del reloj de pared de la zona
simulada; `utc` = `[año, mesIndex, día]` del instante real en UTC. Así el doble
lee, **en cualquier host**, lo que leería un teléfono en esa zona: sus getters
locales, `getHours()` y `toLocaleDateString()` dan la hora de pared, y sus
getters UTC el día UTC real. Ciudad de México es UTC−6 todo el año (sin horario
de verano desde 2022): la medianoche UTC del día D es D−1 a las 18:00.

### R1 — En Android, `fromPickerValue` convierte el día UTC del diálogo en día local

**WHILE** `Platform.OS` es `'android'`,
**WHEN** `fromPickerValue(picked)` recibe el `Date` del diálogo de fecha
(medianoche UTC del día tocado),
**THE SYSTEM SHALL** devolver un `Date` cuyo año, mes y día **locales** son el
año, mes y día **UTC** de `picked`, sea cual sea el día local de `picked`.

- **Test**: `src/utils/date-picker-value.test.ts` (nuevo),
  `describe('#123 R1: en Android, fromPickerValue convierte el día UTC del diálogo en día local'`
  → `it.each(<tabla>)('%s', …)` con
  `const r = fromPickerValue(wallClock(local, utc));` y
  `expect([r.getFullYear(), r.getMonth(), r.getDate()]).toEqual(esperado)`.
  `Platform.OS = 'android'` en `beforeEach`, restaurado en `afterEach`
  ([[design]] D6).

| # | Título de la fila (`%s`) | `local` (reloj de pared) | `utc` | Esperado |
|---|---|---|---|---|
| 1 | `elegido el 24 de septiembre: en CDMX son las 18:00 del 23` | `[2026, 8, 23, 18, 0]` | `[2026, 8, 24]` | `[2026, 8, 24]` |
| 2 | `elegido el 1 de octubre: en CDMX son las 18:00 del 30 de septiembre (cruce de mes)` | `[2026, 8, 30, 18, 0]` | `[2026, 9, 1]` | `[2026, 9, 1]` |
| 3 | `elegido el 1 de enero de 2027: en CDMX son las 18:00 del 31 de diciembre (cruce de año)` | `[2026, 11, 31, 18, 0]` | `[2027, 0, 1]` | `[2027, 0, 1]` |
| 4 | `elegido el 24 de septiembre: en Honolulu son las 14:00 del 23` | `[2026, 8, 23, 14, 0]` | `[2026, 8, 24]` | `[2026, 8, 24]` |
| 5 | `elegido el 24 de septiembre: en Kiritimati son las 14:00 del 24` | `[2026, 8, 24, 14, 0]` | `[2026, 8, 24]` | `[2026, 8, 24]` |

Las filas 4 y 5 cierran los atajos de offset fijo sobre el instante. La 4
simula otra zona negativa (Honolulu, UTC−10 todo el año); la 5, la zona más
positiva (Kiritimati, UTC+14 todo el año), donde la medianoche UTC ya es la
tarde del **mismo** día y lo de hoy es correcto. Con las cinco filas, ningún
offset fijo entre −48 h y +48 h (en pasos de 15 min) pasa la tabla en las
cinco zonas medidas.

- **Rojo natural** (esqueleto identidad, [[tasks]] R1): filas 1-4, por
  aserción, en cualquier host (medido en las 418 zonas IANA del Node del VPS
  más `UTC`: 419 zonas). La fila 5 queda **verde** con la identidad: su día
  local y su día UTC coinciden, y es una fila de regresión (el arreglo no
  puede romper las zonas donde hoy funciona). El arreglo pone verdes las
  cinco en las 419 zonas.
- **Qué fila se pone roja si se cae cada componente** (sondas del reviewer,
  medidas en el scratchpad con `TZ=UTC`, `America/Mexico_City`,
  `Europe/Madrid`, `Pacific/Kiritimati` y `Pacific/Pago_Pago`, mismos
  resultados en todos):

| Id | Mutación en `fromPickerValue` | Filas rojas |
|---|---|---|
| F0 | devolver `picked` (lo de hoy) | 1, 2, 3, 4 |
| F0b | devolver `new Date(picked)` (copia del instante) | 1, 2, 3, 4 |
| F1 | día UTC → `getDate()` local | 1, 2, 3, 4 |
| F2 | mes UTC → `getMonth()` local | 2, 3 |
| F3 | año UTC → `getFullYear()` local | 3 |
| F4 | los tres locales | 1, 2, 3, 4 |
| F5 | día → constante `1` | 1, 4, 5 |
| F6 | mes → constante `8` | 2, 3 |
| F7 | año → constante `2026` | 3 |
| F8 | sumar 6 h fijas al instante (`new Date(picked.getTime() + 6 * 3600e3)`, arreglo «solo para México») | 4 |
| F9 | sumar 12 h fijas al instante (`+ 12 * 3600e3`, «mediodía UTC y leer local») | 5 |

  Día: filas 1 y 4. Mes: fila 2. Año: fila 3. Offset fijo de −48 h a +48 h:
  fila 4 o fila 5 (cero supervivientes, [[design]] D8).

### R2 — En Android, `toPickerValue` abre el diálogo en el día local

**WHILE** `Platform.OS` es `'android'`,
**WHEN** `toPickerValue(day)` recibe el valor con el que se abrirá el diálogo,
**THE SYSTEM SHALL** devolver el instante de la medianoche UTC del día civil
**local** de `day`, sea cual sea la hora de `day` y su día en UTC.

- **Test**: mismo fichero,
  `describe('#123 R2: en Android, toPickerValue abre el diálogo en el día local'`
  → `it.each(<tabla>)('%s', …)` con
  `expect(toPickerValue(wallClock(local, utc)).toISOString()).toBe(esperado)`.
  Literales con `Z`: el resultado se construye solo con los getters locales
  del doble, así que es el mismo en cualquier host.

| # | Título de la fila (`%s`) | `local` | `utc` | Esperado |
|---|---|---|---|---|
| 1 | `24 de septiembre a las 20:00 en CDMX (en UTC ya es el 25)` | `[2026, 8, 24, 20, 0]` | `[2026, 8, 25]` | `'2026-09-24T00:00:00.000Z'` |
| 2 | `30 de septiembre a las 20:00 en CDMX (en UTC ya es 1 de octubre)` | `[2026, 8, 30, 20, 0]` | `[2026, 9, 1]` | `'2026-09-30T00:00:00.000Z'` |
| 3 | `31 de diciembre a las 20:00 en CDMX (en UTC ya es 2027)` | `[2026, 11, 31, 20, 0]` | `[2027, 0, 1]` | `'2026-12-31T00:00:00.000Z'` |
| 4 | `1 de enero de 2027 a medianoche en CDMX (valor ya elegido, al reabrir)` | `[2027, 0, 1, 0, 0]` | `[2027, 0, 1]` | `'2027-01-01T00:00:00.000Z'` |
| 5 | `24 de septiembre a las 00:30 en Madrid (en UTC aún es el 23)` | `[2026, 8, 24, 0, 30]` | `[2026, 8, 23]` | `'2026-09-24T00:00:00.000Z'` |

- **Rojo natural** (esqueleto identidad): filas 1, 2, 3 y 5 en cualquier
  host. La fila 4 también, **salvo** en hosts con offset 0 en enero (27 zonas,
  entre ellas `UTC`: **VPS y CI**), donde la medianoche local del doble ya es
  medianoche UTC. Esperado en el VPS: 4 filas rojas, 1 verde.
- **Qué fila se pone roja si se cae cada componente** (mismas sondas y zonas
  que R1):

| Id | Mutación en `toPickerValue` | Filas rojas |
|---|---|---|
| T0 | devolver `day` (lo de hoy) | 1, 2, 3, 5 (+4 fuera de UTC) |
| T1 | día local → `getUTCDate()` | 1, 2, 3, 5 |
| T2 | mes local → `getUTCMonth()` | 2, 3 |
| T3 | año local → `getUTCFullYear()` | 3 |
| T4 | los tres UTC | 1, 2, 3, 5 |
| T5 | día → constante `1` | 1, 2, 3, 5 |
| T6 | mes → constante `8` | 3, 4 |
| T7 | año → constante `2026` | 4 |
| T9 | restar 6 h fijas y leer UTC (arreglo «solo para México») | 4, 5 en el VPS y en Madrid; 1, 2, 3 en `Pacific/Pago_Pago`; verde en un host de Ciudad de México, donde es correcto |

  T1-T7 dan las mismas filas en las cinco zonas medidas. Día: fila 1. Mes:
  fila 2. Año: fila 3 (y la 4 para la constante). Offset fijo: filas 4 y 5 en
  el VPS y en CI. **Techo conocido**: devolver la medianoche **local**
  (`new Date(año, mes, día)` sin `Date.UTC`) es verde en un host UTC y rojo en
  todos los demás; lo impide el grep de cierre (un `Date.UTC(`).

### R3 — Fuera de Android las dos conversiones devuelven el mismo objeto

**WHERE** `Platform.OS` no es `'android'`,
**THE SYSTEM SHALL** devolver desde `fromPickerValue` y desde `toPickerValue`
el mismo objeto `Date` recibido, sin convertirlo.

- **Test**: mismo fichero,
  `describe('#123 R3: fuera de Android las dos conversiones devuelven el mismo objeto'`,
  con `Platform.OS = 'ios'` en su `beforeEach` (explícito, no heredado del
  preset) y restaurado en `afterEach`, y **dos** `it`:
  - `it('ios: fromPickerValue devuelve el mismo Date')`:
    `const picked = wallClock([2026, 8, 23, 18, 0], [2026, 8, 24]);`
    `expect(fromPickerValue(picked)).toBe(picked)`.
  - `it('ios: toPickerValue devuelve el mismo Date')`:
    `const day = wallClock([2026, 8, 24, 20, 0], [2026, 8, 25]);`
    `expect(toPickerValue(day)).toBe(day)`.
- **Rojo natural**: tras los verdes de R1 y R2 las dos funciones convierten sin
  mirar la plataforma; los dos `it` fallan por `toBe` (otro objeto).
- **Mutaciones que deben dejarlo rojo**: quitar la puerta en una sola función
  (su `it`); `Platform.OS === 'ios'` como condición de no convertir (equivalente
  para `'ios'`; solo cambiaría web, que pinta `null`: mutación equivalente,
  aceptada).

### R4 — Nuevo recordatorio muestra y guarda el día elegido

**WHILE** `Platform.OS` es `'android'`,
**WHEN** el usuario elige un día en `date-picker` de Nuevo recordatorio,
**THE SYSTEM SHALL** mostrar ese día en `date-field` y llamar a
`createReminder` con `dueAt` = ese día a la hora elegida en `time-picker`.

- **Test**: `src/screens/add-reminder/index.test.tsx`, **al final del
  fichero**, dentro de un `describe` padre
  `describe('#123: pickers de fecha de Nuevo recordatorio en Android a las 20:00 del 24 de septiembre'`
  con el arnés de [[design]] D7, un `describe` hijo
  `describe('#123 R4: Nuevo recordatorio muestra y guarda el día elegido'`
  → `it.each(<tabla>)('%s', …)`:
  1. `await renderAddReminder()`; esperar `title-input` visible;
     `changeText` a `'Rabies'`.
  2. `await pickDate(wallClock(local, utc))` (el helper existente).
  3. Pulsar `time-field` y disparar `onValueChange` en
     `within(getByTestId('expo-ui-picker-host')).getByTestId('time-picker')`
     con `new Date(2026, 8, 24, 21, 30)` (como hace
     `it('opens the time picker with 09:00 and reflects a new time'`).
  4. `within(getByTestId('date-field')).getByText(etiqueta)`.
  5. Pulsar `add-reminder-submit` y
     `await waitFor(() => expect(mockCreateReminder).toHaveBeenCalledWith('http://example.test/v1', 'jwt-token', 'pet-1', { type: 'vaccine', title: 'Rabies', dueAt: <dueAt>, advanceMinutes: 10080 }))`.
- `dueAt` se escribe `new Date(año, mes, día, 21, 30).toISOString()`: los
  componentes civiles son literales; el `Z` resultante depende de la zona del
  host por definición (es un instante), igual que el
  `dueAt: new Date(2026, 7, 25, 9, 0).toISOString(),` existente en R9.

| # | Título de la fila (`%s`) | Doble `wallClock(local, utc)` | Etiqueta | `dueAt` |
|---|---|---|---|---|
| 1 | `elegir hoy (24 de septiembre) guarda hoy` | `[2026, 8, 23, 18, 0]`, `[2026, 8, 24]` | `'24/9/2026'` | `new Date(2026, 8, 24, 21, 30).toISOString()` |
| 2 | `elegir el 1 de octubre guarda el 1 de octubre (cruce de mes)` | `[2026, 8, 30, 18, 0]`, `[2026, 9, 1]` | `'1/10/2026'` | `new Date(2026, 9, 1, 21, 30).toISOString()` |
| 3 | `elegir el 1 de enero de 2027 guarda el 1 de enero (cruce de año)` | `[2026, 11, 31, 18, 0]`, `[2027, 0, 1]` | `'1/1/2027'` | `new Date(2027, 0, 1, 21, 30).toISOString()` |

- **Rojo natural** (medido con la sonda contra la pantalla actual, host UTC):
  las 3 filas, por la etiqueta (`'23/9/2026'`, `'30/9/2026'`,
  `'31/12/2026'`). Sin la aserción de etiqueta, el envío también falla: fila
  1 no llama a `createReminder` y pinta `La fecha debe ser futura`; filas 2 y
  3 mandan el 30 de septiembre y el 31 de diciembre a las 21:30.
- **Mutaciones que deben dejarlo rojo** (sondas del reviewer): la pantalla sin
  `fromPickerValue` (el rojo natural); `toPickerValue` en lugar de
  `fromPickerValue` en el `onValueChange` (3 filas); aplicar además
  `fromPickerValue` a la hora (`setTime`) → la hora cae a 00:00 (3 filas); y
  F1-F7 de R1 en el helper, que ponen rojas las mismas filas que las filas
  1-3 de R1 (mismas fechas).

### R5 — El calendario de Nuevo recordatorio abre en el día local; el mínimo y la hora no se convierten

**WHILE** `Platform.OS` es `'android'` y son las 20:00 locales del 24 de
septiembre de 2026 sin fecha elegida,
**WHEN** el usuario abre `date-picker` y después `time-picker`,
**THE SYSTEM SHALL** pasar a `date-picker` `value` = medianoche UTC del 24 de
septiembre, `minimumDate` = el instante actual sin convertir, y pasar a
`time-picker` `value` = las 09:00 locales de ese día sin convertir.

- **Test**: mismo `describe` padre de R4, `describe` hijo
  `describe('#123 R5: el calendario de Nuevo recordatorio abre en el día local; el mínimo y la hora no se convierten'`
  con **un** `it`:
  `it('abre en el 24, con el mínimo en el instante actual y la hora a las 09:00')`:
  1. `await renderAddReminder()`; esperar `date-field` visible; pulsarlo.
  2. `const picker = within(getByTestId('expo-ui-picker-host')).getByTestId('date-picker');`
     `expect((picker.props.value as Date).toISOString()).toBe('2026-09-24T00:00:00.000Z')`;
     `expect((picker.props.minimumDate as Date).getTime()).toBe(new Date(2026, 8, 24, 20, 0).getTime())`.
  3. `fireEvent(picker, 'onDismiss')`; pulsar `time-field`;
     `expect((within(getByTestId('expo-ui-picker-host')).getByTestId('time-picker').props.value as Date).getTime()).toBe(new Date(2026, 8, 24, 9, 0).getTime())`.
- El literal `'2026-09-24T00:00:00.000Z'` sale de un `Date` real (el
  `new Date()` de la pantalla bajo relojes falsos) y es el mismo en las 419
  zonas medidas; el valor crudo nunca lo iguala. La mitad «de noche en UTC−6
  el día UTC ya es mañana» la prueba R2 fila 1 ([[design]] D5).
- **Rojo natural**: `value` es el instante crudo
  (`'2026-09-24T20:00:00.000Z'` en el VPS), por aserción.
- **Mutaciones que deben dejarlo rojo** (sondas del reviewer, sin versionar):
  `minimumDate={toPickerValue(new Date())}` (rojo en cualquier host);
  `value={toPickerValue(time)}` en `time-picker` (rojo en el VPS; equivalente
  en hosts UTC+9, donde la medianoche UTC son las 09:00 locales).

### R6 — Añadir mascota muestra y manda el día de nacimiento elegido

**WHILE** `Platform.OS` es `'android'`,
**WHEN** el usuario elige una fecha en `birth-date-picker` de Añadir mascota,
**THE SYSTEM SHALL** mostrar ese día en `birth-date-field` y llamar a
`createPet` con `birthDate` = ese día en formato `'YYYY-MM-DD'`.

- **Test**: `src/screens/add-pet/index.test.tsx`, **al final del fichero**
  (después de `describe('#95 R6: métricas bajo cabecera nativa'`), dentro de
  un `describe` padre
  `describe('#123: picker de nacimiento de Añadir mascota en Android a las 20:00 del 24 de septiembre'`
  con el arnés de [[design]] D7, un `describe` hijo
  `describe('#123 R6: Añadir mascota muestra y manda el día de nacimiento elegido'`
  → `it.each(<tabla>)('%s', …)`:
  1. `await renderAddPet()`; `changeText` de `name-input` a `'Nala'`.
  2. Pulsar `birth-date-field`; disparar `onValueChange` en
     `within(getByTestId('expo-ui-picker-host')).getByTestId('birth-date-picker')`
     con `{}` y `wallClock(local, utc)` (como
     `it('uses Host + community DateTimePicker and keeps exactly birthDate'`).
  3. `within(getByTestId('birth-date-field')).getByText(etiqueta)`.
  4. Pulsar `add-pet-submit` y
     `await waitFor(() => expect(mockCreatePet).toHaveBeenCalledWith('http://example.test/v1', 'jwt-token', { name: 'Nala', species: 'dog', birthDate: <literal> }))`.
- **No** pulsa `add-pet-photo` (#72 R4, `PICKER_MOCK_UNARMED`).

| # | Título de la fila (`%s`) | Doble `wallClock(local, utc)` | Etiqueta | `birthDate` |
|---|---|---|---|---|
| 1 | `elegir hoy (24 de septiembre de 2026) manda 2026-09-24` | `[2026, 8, 23, 18, 0]`, `[2026, 8, 24]` | `'24/9/2026'` | `'2026-09-24'` |
| 2 | `elegir el 1 de octubre de 2025 manda 2025-10-01 (cruce de mes)` | `[2025, 8, 30, 18, 0]`, `[2025, 9, 1]` | `'1/10/2025'` | `'2025-10-01'` |
| 3 | `elegir el 1 de enero de 2026 manda 2026-01-01 (cruce de año)` | `[2025, 11, 31, 18, 0]`, `[2026, 0, 1]` | `'1/1/2026'` | `'2026-01-01'` |

- **Rojo natural** (medido con la sonda, host UTC): las 3 filas por la
  etiqueta; sin ella, el envío manda `'2026-09-23'`, `'2025-09-30'` y
  `'2025-12-31'`.
- **Mutaciones que deben dejarlo rojo**: la pantalla sin `fromPickerValue`;
  `toPickerValue` en su lugar; F1-F7 de R1 (las filas que ponen rojas en las
  filas 1-3 de R1; las fechas de R6 son un año antes, mismo patrón).

### R7 — El calendario de nacimiento abre en el día local y el máximo no se convierte

**WHILE** `Platform.OS` es `'android'` y son las 20:00 locales del 24 de
septiembre de 2026 sin fecha elegida,
**WHEN** el usuario abre `birth-date-picker`,
**THE SYSTEM SHALL** pasarle `value` = medianoche UTC del 24 de septiembre y
`maximumDate` = el instante actual sin convertir.

- **Test**: mismo `describe` padre de R6, `describe` hijo
  `describe('#123 R7: el calendario de nacimiento abre en el día local y el máximo no se convierte'`
  con **un** `it`:
  `it('abre en el 24, con el máximo en el instante actual')`: pulsar
  `birth-date-field`;
  `expect((picker.props.value as Date).toISOString()).toBe('2026-09-24T00:00:00.000Z')`;
  `expect((picker.props.maximumDate as Date).getTime()).toBe(new Date(2026, 8, 24, 20, 0).getTime())`.
- **Rojo natural**: `value` crudo, por aserción.
- **Mutación que debe dejarlo rojo**: `maximumDate={toPickerValue(new Date())}`
  (en Ciudad de México prohibiría elegir hoy, C6).

### R8 — Gate humano: smoke en dev build de Android en México

**WHEN** R1-R7 están en verde y el `reviewer` aprobó,
**THE SYSTEM SHALL** superar la prueba de humo de §Prueba de humo, corrida por
el humano en un **dev build de Android** (nunca Expo Go) con el teléfono en la
zona de Ciudad de México. **No delegable a IA.** Se firma en su propia casilla,
no en §Aprobación.

---

## Candados

### Se mueven (delta declarado; ninguno más)

| Fichero · ancla grepeable | Delta | R · commit |
|---|---|---|
| `src/utils/date-picker-value.test.ts` (nuevo) | **+1 suite, +12 tests** (R1 5 + R2 5 + R3 2) | R1, R2, R3 · rojos |
| Recuento de `src/screens/add-reminder/index.test.tsx` | **+4** (R4 3 + R5 1) sobre la base medida al arrancar (21 en `70f841f3`) | R4, R5 · rojos |
| Recuento de `src/screens/add-pet/index.test.tsx` | **+4** (R6 3 + R7 1) sobre la base medida al arrancar (20 en `70f841f3`) | R6, R7 · rojos |
| Suite móvil | **+1 suite, +20 tests** sobre la base medida al arrancar: con `70f841f3`, **82 / 1471 → 83 / 1491** | — |
| `src/providers/__tests__/language-provider.test.tsx` · `expect(englishKeys).toHaveLength(` | **+0** (ninguna clave nueva) | — |
| `src/__tests__/ui-copy-table.ts` | **+0** (ninguna llamada `t(` nueva) | — |

### Siguen verdes sin tocarlos (si uno se pone rojo, la implementación está mal)

| Candado | Qué fija que esta feature no puede mover |
|---|---|
| `add-pet/index.test.tsx` · `describe('#90 R6: birthDate manda el día civil local del picker, no el UTC'` | La rama iOS de add-pet (C3): corre como `'ios'` y el helper no convierte. Rojo = puerta de plataforma rota o `Platform.OS` filtrado desde un `describe` de #123 |
| `add-pet/index.test.tsx` · `it('uses Host + community DateTimePicker and keeps exactly birthDate'` | `'2024-04-09'` sigue saliendo de `dateToIso`, que no cambia |
| `add-reminder/index.test.tsx` · `it('opens the date picker and reflects the selected date'`, `it('opens the time picker with 09:00 and reflects a new time'`, `it('posts the exact trimmed input and navigates back on success'` | En iOS el flujo es idéntico al de hoy (mode, presentation, `minimumDate` `Date`, 09:00, `dueAt` del 25 de agosto) |
| `src/utils/reminder-dates.test.ts` · `it('combines the local calendar date and local time without seconds'` | `combineDateAndTime` no se toca |
| `src/__tests__/design-drift.test.ts` · `describe('C8: la UI no usa clases arbitrarias'` | Recorre también los tests colocados: el código de test nuevo no puede contener `<palabra>-[` |
| `src/__tests__/design-drift.test.ts` · `describe('R9: mobile-pets-profile sin drift'` | `screens/add-pet/index.tsx` sin hex, texto arbitrario ni `StyleSheet` |
| `src/__tests__/consistency-classnames.test.ts` · `describe('#62 R14: toda esquina no-cápsula que dibuja el repo es continua'` (filas `add-pet` 5 y `add-reminder` 3) y `src/app/__tests__/detail-stack.test.tsx` · `describe('#95 R7: el reset de #63 queda solo donde no lo cubre el Stack'` | Ni los `style={CONTINUOUS_CORNER}` ni los `useFocusEffect` de las pantallas cambian |

---

## Prueba de humo del humano (no delegable a IA) — R8

Runtime: **dev build de Android**, nunca Expo Go. No hace falta regenerarlo:
cero cambios nativos; basta recargar el JS desde Metro. Backend en `main`.
Teléfono con zona automática en **Ciudad de México** e idioma de la app
**Español**. Una mascota **sin otros recordatorios programados** (la Home solo
pinta los tres más próximos).

Hacerla **después de las 18:00** locales. Anotar la hora del teléfono, **H**;
si H + 1 h pasa de medianoche, hacerla otro día.

1. **Nuevo recordatorio → Fecha.** El calendario abre con **hoy**
   seleccionado. (Antes: mañana.) Elegir hoy → OK: el botón dice la fecha de
   hoy. (Antes: la de ayer.) **Hora** → H + 1 h. **Guardar**: se guarda sin
   «La fecha debe ser futura». (Antes: ese error.) En **Recordatorios** la
   fila dice la fecha de hoy y `· en 0 días`; en la **Home** dice «Hoy».
2. **Nuevo recordatorio → Fecha → el día 1 del mes siguiente.** El botón
   dice ese día 1. (Antes: el último día del mes en curso.) Volver a pulsar
   **Fecha**: el calendario resalta el día 1. Guardar con la hora por defecto
   (09:00). La fila de Recordatorios dice el día 1 del mes siguiente.
3. **Nuevo recordatorio → Fecha → el último día del mes en curso.** El botón
   y, tras guardar, la fila dicen ese día. (Antes: el penúltimo.)
4. **Añadir mascota → Fecha de nacimiento.** El calendario abre con **hoy**
   seleccionado y elegible. (Antes: mañana, en gris.) Elegir hoy → OK: el
   botón dice hoy. (Antes: ayer.)
5. En el mismo formulario, volver a **Fecha de nacimiento** y elegir, **en el
   mes pasado, el día de hoy + 2** (el 24 por la noche: el 26 del mes pasado).
   El botón dice ese día. Nombre `Smoke 123`, **Guardar**. En **Perfil**, con
   esa mascota seleccionada, la edad dice **`0 meses`**. (Antes: `1 meses`,
   porque se guardaba un día antes y el backend cuenta en UTC, donde después
   de las 18:00 ya es mañana: C7.) Si el día de hoy + 2 no existe en el mes
   pasado, hacer este paso otro día.
6. Borrar los tres recordatorios de prueba. La mascota `Smoke 123` puede
   quedarse.

- [ ] Prueba de humo de R8 superada por el humano (fecha: ____, dispositivo: ____)

---

## Cobertura de los criterios de aceptación de `feature_list.json` #123

| Criterio | Cubierto por |
|---|---|
| 1. Elegir un día en Nuevo recordatorio muestra y guarda ese día en UTC−6, incluido hoy después de las 18:00 | R1 (conversión), R4 (etiqueta y `dueAt`, fila 1 = hoy a las 20:00), R8 pasos 1-3 |
| 2. El calendario abre con el día local actual, no con mañana, después de las 18:00 | R2 (conversión, fila 1), R5 (pantalla a las 20:00), R7 (idem en add-pet), R8 pasos 1 y 4 |
| 3. La fecha de nacimiento se envía como el día elegido en UTC−6 | R6, R8 pasos 4-5 |
| 4. Dobles de offset negativo que cruzan mes y año; rojo por mutación versionada si el código ya fuera correcto; suite verde sin pipe; cero dependencias y cero parches | D4 y las tablas de R1, R2, R4, R6 (filas de cruce de mes y de año). Todos los rojos de #123 son **naturales** (el código de hoy es el defecto), así que no hay mutación versionada ([[design]] D8); las sondas por componente están nombradas por fila. Suite sin pipe y grep de dependencias en [[tasks]] §Cierre |
| 5. Gate humano: smoke en dev build de Android en México | R8 |

---

## Fuera de alcance (cada viñeta clasificada y con su premisa verificada)

**Delimitaciones — no son features, no se registran:**

- **Parchear `@expo/ui`** (`DatePickerView.kt` o el wrapper JS) o usar
  `patch-package`. Lo excluye la entrada, y un parche nativo obligaría a
  regenerar el dev build. Avisar a `expo/expo` del comportamiento es opcional
  y en prosa, no un requisito.
- **Cambiar `presentation`, `display` o pasar a la capa
  `@expo/ui/jetpack-compose`.** `docs/ui-guidelines.md` §Decisiones fijas 5
  mantiene `community/datetime-picker`; no se cambia de paso.
- **El picker de hora.** Es correcto en cualquier zona (P6). R5 solo canda que
  no se le aplique la conversión.
- **Convertir `minimumDate` / `maximumDate`.** Ya son correctos (P5); R5 y R7
  candan que sigan así (C6).
- **iOS.** El build y su smoke son #60 (decisión de costo abierta). El helper
  deja iOS como está (D2), leído del código Swift instalado, no verificado en
  dispositivo.
- **Backend** (validación de `birthDate` contra la zona del requester, #89/#90;
  `ageMonths` en UTC). No cambia.
- **Corregir datos ya guardados** con el día desplazado (recordatorios y
  fechas de nacimiento creados en Android con offset negativo desde el 24 de
  agosto). No hay forma de distinguir en el servidor cuáles se eligieron mal;
  si el humano quiere revisarlos, es a mano o en otra feature.
- **Otras entradas de fecha** (`weight-date-input` de texto, vacunas): no usan
  el picker (`git grep -n "datetime-picker" -- src`, P7).
- **Cambios en `docs/ui-guidelines.md`, `global.css`, `infra/` o CI.**

**Deuda preexistente, ya nombrada, que esta feature no ejecuta:**

- **Helpers de día civil repartidos** (#84 §Fuera de alcance, #85 E2):
  `toPickerValue` comparte aritmética (`Date.UTC(getFullYear(), getMonth(), getDate())`)
  con `daysUntil` y `calendarDaysUntil`, pero devuelve un instante, no un
  número. No se unifica aquí.

---

## Aprobación

- [x] Spec aprobada por humano (fecha: 2026-09-24, vía Notion)

---
feature: "mobile-date-picker-utc-day-shift"
status: spec_ready       # draft | spec_ready | approved
tags: [harness, spec, mobile]
---

# Diseño — [[mobile-date-picker-utc-day-shift]] (#123)

> Ver [[requirements]] para los requisitos y las premisas verificadas (§0), y
> [[../../docs/architecture|architecture]] para las capas. Rutas relativas a
> `mobile-pet-tracker/`; las de `@expo/ui`, a `node_modules/@expo/ui/`. Anclas
> por contenido, nunca por número de línea.

## Carta de UI (`docs/ui-guidelines.md`, gate C8)

Esta feature **no cambia ninguna vista**: ni nodos, ni clases, ni copy, ni
dimensiones, ni animación. Cambia **qué `Date`** guarda y pasa cada pantalla.
De C8 aplica el **grep-clean**, que se cumple por no tocar marcado; el código
de test nuevo cae bajo el guard de clases arbitrarias de
`src/__tests__/design-drift.test.ts` (nada de la forma `<palabra>-[`). La
Enmienda #70 no aplica (no hay elementos repetidos). §Decisiones fijas 5 se
respeta: se sigue usando `@expo/ui/community/datetime-picker` en diálogo.

Skills: `expo:expo-overview` → `expo:expo-ui` (referencia
`drop-in-replacements.md`: la fuente de verdad de las props es el paquete
instalado, `@expo/ui` 57.0.11, leído en `src/community/datetime-picker/`,
`src/jetpack-compose/DatePicker/index.tsx`,
`android/src/main/java/expo/modules/ui/DatePickerView.kt` y
`ios/DatePickerView.swift`).

---

## El defecto, de punta a punta

| Paso | Dónde | Qué pasa en Ciudad de México (UTC−6) |
|---|---|---|
| 1 | pantalla: `value={date ?? new Date()}` | a las 20:00 del 24 pasa el instante `2026-09-25T02:00Z` |
| 2 | `DateTimePicker.android.tsx`: `initialDate: value.toISOString(),` → `DatePickerDialog`: `new Date(initialDate).getTime()` | llega al nativo sin cambios |
| 3 | `DatePickerView.kt`: `initialSelectedDateMillis = initialDate,` | Material3 lo lee como día **UTC** → abre en el **25** |
| 4 | usuario toca el 24 → OK → `DatePickerResult(date = state.selectedDateMillis)` | devuelve `2026-09-24T00:00Z` (medianoche UTC del 24) |
| 5 | `props.onDateSelected?.(new Date(date))` → `onValueChange(…, date)` | la pantalla recibe ese instante |
| 6 | pantalla: `setDate(selectedDate)`, luego `toLocaleDateString`, `combineDateAndTime` / `dateToIso` con getters **locales** | son las 18:00 del **23**: el botón dice 23 y se guarda el 23 |

`minimumDate`/`maximumDate` no sufren esto: el nativo los lleva al día local
con `toUtcDayMillis` antes de compararlos con el día UTC de cada celda. El
picker de hora tampoco: usa `Calendar.getInstance()` en la zona del
dispositivo ([[requirements]] P5, P6).

---

## Decisiones técnicas

### D1 — Un módulo con dos funciones puras en `src/utils/` (R1, R2, R4-R7)

- **Fichero nuevo**: `src/utils/date-picker-value.ts`, con su test colocado
  `src/utils/date-picker-value.test.ts` (`docs/conventions.md`: «Helpers
  sueltos nuevos van en `src/utils/` con su test colocado al lado»).
- **Exporta exactamente dos funciones** (nombres normativos; Codex escribe el
  cuerpo según esta semántica):
  - `export function toPickerValue(day: Date): Date` — en Android devuelve
    `new Date(Date.UTC(day.getFullYear(), day.getMonth(), day.getDate()))`.
  - `export function fromPickerValue(picked: Date): Date` — en Android
    devuelve `new Date(picked.getUTCFullYear(), picked.getUTCMonth(), picked.getUTCDate())`.
- **Import único**: `import { Platform } from 'react-native';`. Sin tipos
  nuevos, sin constantes, sin comentarios.
- **Por qué medianoche local y no «mediodía local» ni la hora de antes**: los
  tres consumidores (`toLocaleDateString`, `combineDateAndTime`, `dateToIso`)
  solo leen año, mes y día; la medianoche es la forma canónica y la que el
  resto del repo usa para un día civil (`new Date(year, month - 1, day)` en
  `src/screens/home/format.ts`).
- **Por qué un módulo y no inline**: dos pantallas × dos direcciones = cuatro
  usos, y la puerta de plataforma (D2) debe vivir en **un** sitio. Ningún
  helper existente sirve ([[requirements]] P11).
- **Pantallas** (dos líneas cada una, más el import):
  - `src/screens/add-reminder/index.tsx`: `value={date ?? new Date()}` →
    `value={toPickerValue(date ?? new Date())}` y `setDate(selectedDate);` →
    `setDate(fromPickerValue(selectedDate));`, ambos dentro del
    `<ExpoDateTimePicker` con `testID="date-picker"`.
  - `src/screens/add-pet/index.tsx`: `value={birthDate ?? new Date()}` →
    `value={toPickerValue(birthDate ?? new Date())}` y
    `setBirthDate(selectedDate);` → `setBirthDate(fromPickerValue(selectedDate));`.
  - Import en las dos:
    `import { fromPickerValue, toPickerValue } from '../../utils/date-picker-value';`
    junto a los demás imports de `../../utils/` o `../../theme/`.
- **Reabrir el diálogo** tras elegir funciona por construcción: el estado
  guarda la medianoche local del día elegido y `toPickerValue` la devuelve a
  medianoche UTC del mismo día (sonda: reabrir tras elegir el 1 de octubre
  pasa `'2026-10-01T00:00:00.000Z'`).

### D2 — La conversión solo corre en Android, dentro del helper (R3)

- Primera línea de cada función: si `Platform.OS !== 'android'`, devolver el
  argumento tal cual (mismo objeto).
- **Por qué**: en iOS el `DatePicker` de SwiftUI devuelve un instante local
  que conserva la hora del valor ([[requirements]] C2). Leer sus `getUTC*`
  rompería iOS en offsets negativos por la noche y en positivos de madrugada;
  pasarle una medianoche UTC lo abriría en el día anterior en offsets
  negativos. En web el wrapper pinta `null`.
- **Por qué dentro del helper y no en las pantallas**: una sola puerta, dos
  sitios de lectura (`Platform.OS` se lee al llamar, no al importar, así que
  los tests pueden cambiarlo por `it`, D6).

| Alternativa | Por qué no |
|---|---|
| Conversión incondicional (lo que sugería la entrada) | Rompe iOS (C2) y pone rojo `#90 R6` (C3) |
| Heurística sin plataforma: «si es medianoche UTC exacta, es del diálogo de Android» | Lista, no aburrida: un instante local puede caer en medianoche UTC (usuario en UTC+0 al guardar a las 00:00; o el propio valor ya convertido al reabrir). Ambigua por construcción |
| `Platform.OS === 'android' ? … : …` en cada pantalla | Cuatro ternarios en dos ficheros para una sola regla |
| Ficheros por plataforma (`date-picker-value.android.ts` + `.ts`) | jest resuelve con `defaultPlatform: "ios"`: la variante Android no se cargaría en los tests sin tocar la config de haste para toda la suite |

### D3 — `minimumDate`, `maximumDate` y el picker de hora no se tocan (R5, R7)

- `minimumDate={new Date()}` (add-reminder) y `maximumDate={new Date()}`
  (add-pet) siguen pasando el instante actual: `toUtcDayMillis` en el nativo
  ya toma su día **local**. Pasarlos por `toPickerValue` desplazaría el límite
  un día en offsets negativos por la noche (C6).
- `value={time}` y `setTime(selectedTime)` del picker de hora no cambian
  ([[requirements]] P6).

### D4 — Zona negativa por dobles «reloj de pared + getters UTC sesgados» (R1, R2, R4, R6)

- **No se puede forzar `TZ`** desde un test ([[requirements]] P10), y en un
  host UTC la medianoche UTC **es** la medianoche local: con `Date` reales el
  defecto es invisible en el VPS y en CI.
- **El doble**: `wallClock(local, utc)` =
  `Object.assign(new Date(local[0], local[1], local[2], local[3], local[4]), { getUTCFullYear: () => utc[0], getUTCMonth: () => utc[1], getUTCDate: () => utc[2] })`.
  Un `Date` **real** construido con la hora de pared de la zona simulada, con
  los tres getters UTC sustituidos por el día UTC real. Es la forma del doble
  de `describe('#90 R6: birthDate manda el día civil local del picker, no el UTC'`
  (`Object.assign(new Date(2026, 8, 17, 23, 30), {` …), no la de `#84 R2`
  (objeto `as unknown as Date`), porque las pantallas llaman a
  `toLocaleDateString` y el helper `pickDate` a `getTime`: un objeto plano
  daría `TypeError`.
- **Qué es fiel en cualquier host**: `getFullYear`, `getMonth`, `getDate`,
  `getHours`, `toLocaleDateString` (hora de pared, por construcción) y los
  tres `getUTC*` (sustituidos). Es exactamente lo que leen las pantallas y el
  helper según el contrato. En un host de Ciudad de México el doble coincide
  al 100 % con el `Date` real del teléfono.
- **Qué no es fiel**: `getTime`, `toISOString`, `getTimezoneOffset` y
  `new Date(doble)` son la lectura que el host hace de la hora de pared (en el
  VPS, `'2026-09-23T18:00:00.000Z'` en vez de `'2026-09-24T00:00:00.000Z'`).
  Por eso el contrato prohíbe que el helper los lea y ningún test asevera el
  instante del doble. Una implementación alternativa que sí los leyera
  (`picked.getTime() + picked.getTimezoneOffset() * 60000`) sería correcta en
  el teléfono y roja aquí: queda fuera del contrato a propósito, y el grep de
  cierre de [[tasks]] lo vigila.
- **Por qué el doble también prueba la etiqueta**: su `toLocaleDateString` es
  el real y lee la hora de pared, así que, sin conversión, el botón dice el
  día anterior **en cualquier host** (sonda: `'23/9/2026'` en el VPS).
- **Determinismo medido** en las 418 zonas IANA del Node del VPS (v20.20.2)
  más `UTC` (419 zonas): los esperados de R1 y R2 y las etiquetas `es-MX` de R4 y R6 son
  los mismos en todas; el único cambio por zona es la fila 4 de R2 bajo la
  identidad (verde en las 27 zonas con offset 0 en enero), declarado en su
  rojo.

### D5 — El valor inicial en pantalla se asevera con un `Date` real y un literal `Z` (R5, R7)

- El `new Date()` de la pantalla no se puede sustituir por un doble sin espiar
  el constructor de `Date`. Con relojes falsos a `new Date(2026, 8, 24, 20, 0)`
  (componentes locales), `toPickerValue` devuelve
  `'2026-09-24T00:00:00.000Z'` en las 419 zonas medidas, y el valor crudo
  **nunca** lo iguala (haría falta un offset de +20 h). Así el literal prueba
  en cualquier host que la pantalla **pasa por** `toPickerValue`.
- La otra mitad —que `toPickerValue` lee el día local y no el UTC cuando
  difieren— no se ve con un `Date` real en un host UTC; la prueba R2 con
  dobles. Pantalla (enrutado) + helper (semántica) cierran el caso.

### D6 — `Platform.OS` en los tests

- Mismo mecanismo que `function setPlatform(os: string): void {` de
  `src/hooks/use-push-registration.test.tsx`:
  `Object.defineProperty(Platform, 'OS', { configurable: true, value: os })`,
  con `const originalPlatform = Platform.OS;` a nivel de módulo y restauración
  en `afterEach`. Cada fichero declara su propio helper (no se importa de otro
  test).
- `src/utils/date-picker-value.test.ts`: `'android'` en los `describe` de R1 y
  R2; `'ios'` **explícito** en el de R3 (no depender del preset).
- En los dos ficheros de pantalla los `describe` de #123 van **al final** y
  restauran en `afterEach`: `#90 R6` y el resto de `describe` corren antes y
  como `'ios'`.
- Medido con una sonda (copias de las pantallas en el scratchpad): con
  `'android'` las dos pantallas renderizan, abren los dos pickers y envían sin
  errores ni avisos nuevos.

### D7 — Arnés de los tests de pantalla (R4-R7)

Un `describe` padre por fichero, con dos `describe` hijos (uno por R), para no
duplicar el arnés:

- **add-reminder**: `beforeEach` con `jest.useFakeTimers()`,
  `jest.setSystemTime(new Date(2026, 8, 24, 20, 0))`, `jest.clearAllMocks()`,
  `process.env.EXPO_PUBLIC_API_URL = 'http://example.test/v1'`,
  `mockUseAuth.mockReturnValue(…)` como `describe('R9: guardar con validación y degradación por kind'`,
  `mockCreateReminder.mockResolvedValue({ kind: 'ok', reminder: makeReminder() })`
  y `setPlatform('android')`; `afterEach` restaura `Platform.OS` y
  `jest.useRealTimers()`. R9 ya prueba en este fichero que `waitFor` funciona
  con relojes falsos. Se reutilizan `renderAddReminder()` (selecciona
  `'pet-1'`) y `pickDate(…)` tal cual.
- **add-pet**: el armado de `describe('#90 R6: …'` (relojes falsos,
  `EXPO_PUBLIC_API_URL`, `mockUseAuth`, `mockUseSelectedPet` con
  `{ selectedPetId: 'pet-1', selectPet }`) con hora
  `new Date(2026, 8, 24, 20, 0)`,
  `mockCreatePet.mockResolvedValue({ kind: 'ok', pet: { id: 'pet-new', name: 'Nala' } as never })`
  y `setPlatform('android')`; `afterEach` restaura. Hereda el `beforeEach`
  raíz que rearma `launchImageLibraryAsync` y **no** pulsa `add-pet-photo`.
- Los mocks de `@expo/ui` y `@expo/ui/community/datetime-picker` de cada
  fichero se usan **como están** (verificados contra el fichero:
  [[requirements]] P12). No se copia ningún mock de otra suite.

### D8 — Orden y rojos (C4)

Todos los rojos son **naturales** (vía (a) de C4): el código de hoy **es** el
defecto, así que no hace falta ninguna mutación versionada.

| R | Rojo | Por qué es legítimo |
|---|---|---|
| R1 | esqueleto `fromPickerValue` = identidad (lo que hace hoy la app) | falla por aserción, no por `Cannot find module` |
| R2 | esqueleto `toPickerValue` = identidad | idem |
| R3 | los verdes de R1 y R2 convierten sin mirar la plataforma | la puerta aún no existe |
| R4, R6 | la pantalla aún no llama a `fromPickerValue` | es el defecto reportado |
| R5, R7 | la pantalla aún no llama a `toPickerValue` | es el defecto simétrico |

Los esqueletos son el comportamiento actual (devolver el argumento), no un
stub inventado: el rojo demuestra que el test ve el defecto real. Las
propiedades sobre código ya correcto (mínimo, máximo y hora sin convertir)
viajan dentro de `it` con rojo natural y se prueban con sondas del reviewer
sin versionar, como hizo #84 R3.

**Techo conocido** (verde en un host UTC, rojo en los demás; lo cierra el grep
de [[tasks]] §Cierre, igual que #84 D1): `toPickerValue` devolviendo la
medianoche **local** (`new Date(y, m, d)` sin `Date.UTC`).

**Offset fijo en `fromPickerValue`, cerrado por tabla**: sumar al instante
cualquier offset fijo entre −48 h y +48 h (medido en pasos de 15 min) pone roja
la fila 4 (Honolulu, 14:00 del día anterior) o la fila 5 (Kiritimati, 14:00
del mismo día) de R1 en `UTC`, `America/Mexico_City`, `Europe/Madrid`,
`Pacific/Kiritimati` y `Pacific/Pago_Pago`: +6 h cae en la 4, +12 h en la 5.

### D9 — Copy intacto

Sin claves ni textos nuevos. Etiquetas y errores existentes
(`'addReminder.dateMustBeFuture'`, `toLocaleDateString(locale)`) no cambian.

### Nota: el rango de años del diálogo

`rememberDatePickerYearRange` (Kotlin) toma el año **local** de `initialDate`.
Con el arreglo, al abrir el 1 de enero en Ciudad de México su medianoche UTC
es el 31 de diciembre local, así que el rango puede empezar un año antes.
Inofensivo: solo ensancha el calendario hacia atrás, y `selectableDates`
sigue marcando qué días se pueden elegir. No se toca.

---

## Archivos afectados

| Fichero | Capa | Cambio |
|---|---|---|
| `src/utils/date-picker-value.ts` | util (móvil) | **nuevo**: `toPickerValue`, `fromPickerValue` (D1, D2) |
| `src/utils/date-picker-value.test.ts` | test | **nuevo**: `#123 R1` (5), `#123 R2` (5), `#123 R3` (2) |
| `src/screens/add-reminder/index.tsx` | pantalla | import + `value={toPickerValue(…)}` + `setDate(fromPickerValue(…))` |
| `src/screens/add-reminder/index.test.tsx` | test | `describe` padre `#123` al final con `#123 R4` (3) y `#123 R5` (1); `import { Platform } from 'react-native'` |
| `src/screens/add-pet/index.tsx` | pantalla | import + `value={toPickerValue(…)}` + `setBirthDate(fromPickerValue(…))` |
| `src/screens/add-pet/index.test.tsx` | test | `describe` padre `#123` al final con `#123 R6` (3) y `#123 R7` (1); `import { Platform } from 'react-native'` |

**No cambian**: `node_modules/` (ni `patches/`), `package.json`, `bun.lock`,
`src/utils/reminder-dates.ts`, `src/i18n/catalog.ts`, `src/__tests__/*`,
`docs/`, `backend-pet-tracker/`.

---

## Alternativas descartadas

- **Parchear `DatePickerView.kt`** para devolver el día local: toca
  `node_modules` y obliga a regenerar el dev build ([[requirements]] §Fuera de
  alcance).
- **Conversión incondicional, heurística de medianoche UTC, ternarios en las
  pantallas, ficheros por plataforma**: D2.
- **Convertir también `minimumDate`/`maximumDate`**: D3, C6.
- **Forzar `TZ`** en el test o en la config de jest: D4 y #84 D3.
- **Espiar el constructor de `Date`** (como `#70 R5`) para inyectar un doble
  en el `new Date()` de la pantalla: ata el test a la implementación; D5 cubre
  el caso con un literal que no depende del host.
- **Reutilizar `civilTodayIso`**: devuelve `'YYYY-MM-DD'` para una zona IANA
  dada, no un `Date`, y la pantalla necesita un `Date` para el diálogo y la
  etiqueta.

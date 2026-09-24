---
feature: "reminder-advance-already-past"
status: spec_ready       # draft | spec_ready | approved
tags: [harness, spec, backend, mobile]
---

# Diseño — [[reminder-advance-already-past]] (#125)

> Ver [[requirements]] para los requisitos y las premisas verificadas (§0), y
> [[../../docs/architecture|architecture]] para las capas. Anclas por
> contenido, nunca por número de línea. Todo lo que aquí dice «medido» se midió
> en una copia del árbol en el scratchpad (fuera del repo) con un borrador de
> la implementación: suites completas verdes (backend `171 / 1307`, móvil
> `83 / 1503`, exit 0), `tsc --noEmit` y lint limpios en los dos proyectos.

## El defecto, de punta a punta

| Paso | Dónde | Qué pasa hoy (24 de septiembre, 20:00, Ciudad de México) |
|---|---|---|
| 1 | `add-reminder/index.tsx`: `useState(10080)` | «7 días antes» viene seleccionado |
| 2 | el usuario elige el 1 de octubre a las 09:00 y guarda | se crea con `advanceMinutes: 10080`: momento del aviso = 24 de septiembre, 09:00 → **ya pasó** |
| 3 | `findDue`: `dueAt - advanceMinutes * interval '1 minute' <= now` | el siguiente tick (≤ 60 s) lo encola |
| 4 | dispatcher: `` body: `Recordatorio: ${reminder.title}` `` | el push llega al momento y no dice para cuándo es: parece que salta sin motivo |

C (móvil) ataca el paso 1-2: el aviso que ya pasó no se puede elegir. A
(backend) ataca el paso 4: aunque un aviso salga al instante (vencimientos
cercanos con «Mismo día», o un `PATCH` sin cliente), el cuerpo dice cuándo
vence.

---

## Carta de UI (`docs/ui-guidelines.md`, gate C8)

Skills: `expo:expo-overview` → `expo:expo-native-ui` (estilo y estados) y
`expo:expo-design-system` (tokens). La carta gana sobre las skills.

- **Grep-clean**: ningún hex, ninguna clase arbitraria, ningún
  `StyleSheet.create`. `opacity-50` es una utilidad estándar de Tailwind, ya
  usada en el repo para lo inactivo (`src/screens/reminders/index.tsx`,
  [[requirements]] P10); no es un valor nuevo que pida token.
- **Tokens y componentes**: el chip sigue siendo el `Pressable` con
  `rounded-full` (cápsula, §Decisiones fijas 12) y las mismas clases de
  seleccionado / no seleccionado. No se crea componente.
- **Accesibilidad**: el estado desactivado lo publica el propio `Pressable`
  (`disabled` → `accessibilityState.disabled`, [[requirements]] P8); TalkBack
  lo anuncia como no disponible. El contraste reducido de un control inactivo
  está exento de WCAG 1.4.3.
- **Objetivo táctil**: `hitSlop={TOUCH_SLOP}` no cambia; el chip no cambia de
  tamaño al desactivarse (sin salto de layout).
- **Dimensiones de pantalla, Skeleton, animación**: no aplica (no cambian).
- **Enmienda #70** (elementos repetidos): las decisiones **nuevas** del chip
  —estado accesible `disabled`, `onPress` inerte y la clase ` opacity-50`— se
  candan **por chip** en cada fila de R3 con `expectAdvanceChips`, que recorre
  los cuatro chips en orden y asevera la clase **exacta** y el estado accesible
  **exacto** de cada uno: cruzar cualquiera de las dos entre dos chips pone la
  fila roja. Las decisiones que no cambian (etiqueta, `testID`, orden) quedan
  con sus candados de hoy.
- **Copy**: ninguna clave nueva (D8).

---

## Decisiones técnicas

### D1 — Una sola spec, requisitos ordenados backend → móvil

- #83/#98 se partieron porque cada mitad podía salir sola y tenía su propio
  riesgo. Aquí las dos mitades son pequeñas (un módulo puro + una inyección;
  una regla de chips), no comparten fichero, y la prueba de humo necesita las
  dos a la vez para leerse: el paso 4 de R5 mira el chip seleccionado **y** el
  texto del push que ese chip produce.
- Orden: R1 (función pura) → R2 (la usa el dispatcher) → R3 (chips) → R4
  (instante de evaluación). Backend primero porque R2 depende de R1; el móvil
  no depende de nada del backend y podría ir en cualquier orden.

### D2 — Copy del cuerpo: `Recordatorio: <título> · <día> de <mes> a las <HH>:<mm>`, español fijo (R1)

- **Español fijo** porque no existe un idioma de usuario en el backend
  ([[requirements]] C2) y todos los pushes del backend van ya en español. Una
  columna de idioma más su sincronización desde Profile es otra feature; se
  nombra en §Fuera de alcance y no se registra salvo que el humano la pida.
- **Se conserva el prefijo** `Recordatorio: <título>`: el cambio es añadir el
  cuándo, no reescribir el copy. El título del push sigue siendo el título del
  recordatorio.
- **`·` (U+00B7)** como separador: el mismo punto medio con el que la app
  separa fecha y cuenta atrás en la lista (`'reminders.dueInDays': '· en {{days}} días'`).
- **Sin año ni día de la semana**: el push sale como mucho 7 días antes del
  vencimiento (`reminders_advance_minutes_check` `between 0 and 10080`); el año
  no desambigua nada y el día de la semana alarga una línea que Android recorta.
- **24 h con dos dígitos** (`09:00`, `00:30`, `23:30`): sin ambigüedad a. m. /
  p. m. y sin los espacios especiales que ICU mete en `es-MX` en formato de
  12 h (medido: `'09:00 a.m.'`).

### D3 — La zona sale del puerto que ya existe, una lectura por recordatorio (R2)

- **Qué**: `RemindersDispatchService` recibe
  `@Inject(PET_REPOSITORY) private readonly pets: PetRepository` como cuarto
  parámetro de constructor y, dentro del `try` de cada recordatorio, llama a
  `this.pets.findOwnerTimezone(reminder.petId)` antes del `SendMessageCommand`.
- **Por qué ese puerto**: da exactamente «el owner» que ya usan #83, #89 y #90
  (primer `pet_users` con `role = 'owner'` y `status = 'active'` por
  `created_at`), está exportado por `PetsModule` y `RemindersModule` ya lo
  importa ([[requirements]] P5). **Ningún módulo, puerto ni repositorio
  cambia**; los demás dobles de `PetRepository` no se rompen porque el puerto
  no gana métodos.
- **Capas**: el dispatcher es `infrastructure` y depende de una **interfaz de
  dominio** (`PetRepository`) y de una función de `application`
  (`reminderPushBody`). Dependencias hacia dentro, como pide
  `docs/architecture.md`.
- **Por qué dentro del `try`**: si la lectura falla, esa fila queda sin marcar
  y se reintenta en el tick siguiente, igual que hoy un `send` fallido
  (`it('un send fallido queda sin marcar y no frena las filas siguientes'`).
  Mandar el push con una hora inventada (`'UTC'`) sería peor que mandarlo 60 s
  tarde.
- **N+1, aceptado con su techo**: una consulta por recordatorio vencido en cada
  tick. En régimen normal un tick de 60 s trae cero o pocas filas. El camino
  para cuando no sea así es una subconsulta correlacionada en `findDue` que
  devuelva la zona junto a cada fila; eso cambia el contrato de
  `ReminderRepository.findDue`, su implementación Drizzle y pide un test contra
  Postgres. No compensa hoy.

| Alternativa | Por qué no |
|---|---|
| Join en `findDue` | Cambia el puerto de recordatorios para meter un dato de otro módulo, más SQL y más test de BD para ahorrar consultas que hoy son pocas (techo arriba) |
| Leer `users.timezone` de `createdBy` | Hoy solo el owner crea (`describe('R4: POST usa PetAccessGuard y exige owner'`), pero la semántica de «owner» del repo es la de `findOwnerTimezone`; dos definiciones divergirían en cuanto cambie la propiedad |
| Memoizar la zona por mascota dentro del tick | Optimización sin medida que la pida |

### D4 — `reminderPushBody`: función pura en `application`, compuesta desde `formatToParts` (R1)

- **Dónde**: `src/modules/reminders/application/reminder-push-body.ts`, con su
  spec al lado. Mismo sitio y forma que `src/modules/pets/application/owner-local-day.ts`
  (helper puro de `application`). Sin Nest, sin BD: se prueba con literales.
- **Firma normativa**:
  `export function reminderPushBody(title: string, dueAt: Date, timeZone: string | null): string`.
- **Zona efectiva**: `timeZone !== null && isSupportedTimeZone(timeZone) ? timeZone : 'UTC'`,
  con `isSupportedTimeZone` importado de `@/pipeline/local-day` (reutilizado,
  no copiado). Es la misma condición de `localDayInZone`. Sin `logger.warn`:
  una zona inválida es un dato del registro, no un evento del dispatcher.
- **Formato**: `new Intl.DateTimeFormat('es-MX', { timeZone: <efectiva>, day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(dueAt)`,
  y el texto se compone con **literales propios** (`' de '`, `' a las '`,
  `':'`) sobre las partes `day`, `month`, `hour` y `minute`.
- **Por qué `formatToParts` y no `.format()`**: en el Node del VPS (ICU 78.2)
  `.format()` ya da `'31 de diciembre a las 23:30'`, pero ese pegamento entre
  fecha y hora es dato de CLDR, y los literales de CLDR cambian entre
  versiones de ICU (el caso conocido: ICU 72 cambió en `en-US` el espacio
  antes de AM/PM por U+202F y rompió tests de fechas en medio mundo). Las
  partes numéricas y los nombres de mes no cambian; el pegamento es nuestro. No se verificó en otras versiones de ICU: la
  composición es precisamente para no depender de ello.
- **`hourCycle: 'h23'`** y no `hour12: false`: `local-day.ts` ya documenta que
  `hour12: false` puede dar `24` a medianoche; la fila 5 de R1 (`00:30`) lo
  vigila.
- **Por qué `'es-MX'`**: es el locale de fechas de la app en español (carta
  §Dirección de arte 6).

### D5 — «Igual» cuenta como pasado (R3, R4)

`isAdvancePast` usa `<=`: es el mismo operador de `findDue` (un momento igual a
`now` sale en ese tick), del formulario (`dueAt.getTime() <= Date.now()`) y,
invertido, del DTO (`> Date.now()`). Un chip «igual a ahora» que se dejara
activo produciría exactamente el push inmediato que la feature quita. Las
filas 1, 5, 6 y 7 de R3 están en la frontera exacta de cada aviso.

### D6 — La selección se deriva de la preferencia (R3)

- **Estado**: `advanceMinutes` (el de hoy, sin renombrar) pasa a ser **la
  preferencia**: 10080 al abrir, y el último chip activo que pulsó el usuario.
  Lo que se ve seleccionado es
  `effectiveAdvance(<vencimiento>, advanceMinutes, now)`: el mayor aviso activo
  que no supera la preferencia. Como la validez es monótona (si un aviso es
  válido, todos los menores también), eso es «la preferencia si sigue activa;
  si no, el mayor activo».
- **Por qué derivada y no «pegajosa»** (la sugerencia del leader era: si lo
  elegido se desactiva, bajar al mayor activo y **quedarse** ahí aunque vuelva
  a ser válido):
  1. **Lo enviado depende solo del formulario final.** Con la pegajosa depende
     del **orden** de los cambios. Medido: en `#123 R4` fila 2 (1 de octubre a
     las 21:30, a las 20:00 del 24) el usuario elige la fecha **antes** que la
     hora; mientras la hora sigue en 09:00, «7 días» está pasado y la pegajosa
     baja a «3 días»; al poner las 21:30 «7 días» vuelve a ser válido pero se
     queda en «3 días». La derivada manda «7 días». El usuario nunca eligió
     «3 días».
  2. **Menos código**: ningún handler escribe la selección; no hay efecto.
  3. **Respeta la elección explícita**: si el usuario eligió «1 día» y un
     cambio intermedio lo desactivó, al volver a una hora válida vuelve «1 día»
     (paso e de la secuencia de R3), que es lo que había elegido.
- **Todos desactivados**: `effectiveAdvance` devuelve la preferencia (el chip
  se ve seleccionado **y** atenuado) y Guardar lo rechaza con la validación de
  siempre (fila 7 de R3). Elegir `0` en su lugar no evitaría el rechazo y
  cambiaría lo que el usuario ve sin motivo.
- **Pulsar un chip desactivado** no hace nada: `disabled` en el `Pressable`
  corta `onPress` (P8).

### D7 — «Ahora» es estado: se fija al montar, al elegir fecha y al elegir hora; Guardar usa el reloj (R4)

- **Por qué no `Date.now()` en render** ([[requirements]] C6, medido):
  `react-hooks/purity` lo marca como **error** de lint, y React Compiler lo
  memoiza por `[advanceMinutes, date, time]` en el teléfono pero no en jest,
  así que test y dispositivo evaluarían con relojes distintos.
- **Qué**: `const [now, setNow] = useState(Date.now);` (se pasa la función, no
  se llama: el lint lo acepta) y `setNow(Date.now());` en el `onValueChange`
  del picker de fecha y en el del de hora. Los chips se evalúan con `now`; en
  el teléfono y en jest es el mismo instante.
- **Guardar**: `advanceMinutes: effectiveAdvance(dueAt, advanceMinutes, Date.now())`
  en `handleSubmit` (un manejador: fuera de la regla de pureza; el
  `Date.now()` que ya estaba ahí no se marca). Si el formulario se queda
  abierto y el aviso elegido cruza la frontera, se envía el mayor aún futuro:
  el criterio 2 se cumple aunque la pantalla muestre, durante ese minuto, lo
  evaluado en el último cambio.
- **Pulsar un chip no refresca `now`**: no cambia el vencimiento, y Guardar
  recalcula igual.

| Alternativa | Por qué no |
|---|---|
| `Date.now()` (o `new Date().getTime()`) en render | Lint en rojo (o esquivarlo a sabiendas) y relojes distintos en jest y en el teléfono |
| Intervalo que refresque cada minuto | Temporizador, limpieza y un test más para cambiar solo lo que se ve en el minuto de la frontera |
| `'use no memo'` en la pantalla | Apaga el compilador en toda la pantalla y el lint sigue en rojo |

### D8 — Chip desactivado: `Pressable disabled` + la misma clase + ` opacity-50`, sin copy (R3)

- `disabled={disabled}` en el `Pressable`; `accessibilityState={{ selected }}`
  **no** cambia: el `Pressable` añade `disabled` al estado accesible (P8). Por
  eso el estado accesible de todos los chips gana `disabled: false` cuando no
  están desactivados (candado movido de `renders alert choices…`).
- Clase: la de hoy (seleccionado o no) seguida de `' opacity-50'` si está
  desactivado, en un template literal:
  `` `${selected ? '<seleccionado>' : '<no seleccionado>'}${disabled ? ' opacity-50' : ''}` ``.
- Sin texto que explique la desactivación: +0 claves; la lista de avisos es
  corta y el atenuado se entiende al lado de la fecha que se acaba de elegir.

### D9 — Arnés de los tests móviles (R3, R4)

- Un `describe` padre `#125:` al final del fichero con `beforeEach`:
  `jest.useFakeTimers()`, `jest.clearAllMocks()`,
  `process.env.EXPO_PUBLIC_API_URL = 'http://example.test/v1'`,
  `mockUseAuth.mockReturnValue(…)` como `describe('R9: guardar con validación y degradación por kind'`,
  `mockCreateReminder.mockResolvedValue({ kind: 'ok', reminder: makeReminder() })`;
  `afterEach`: `jest.useRealTimers()`. Cada `it` fija su reloj con
  `jest.setSystemTime(new Date(<componentes locales>))`.
- **Plataforma**: la del preset (`'ios'`); no se toca `Platform.OS`. La regla
  de chips no depende de la plataforma: lee `date` ya convertido por
  `fromPickerValue`, que fuera de Android es la identidad (#123 D2).
- **Mocks**: los del fichero, tal cual (`jest.mock('../../api/reminders'`, el
  `Host` de `@expo/ui` con `testID: 'expo-ui-picker-host'` y el
  `MockDateTimePicker`). Se reutilizan `renderAddReminder()`, `pickDate(…)` y
  `makeReminder()`. No se copia ningún mock de otra suite. Verificado con la
  sonda contra este mismo fichero.
- **Fechas de frontera de 7 días en junio → julio** ([[requirements]] C8): la
  ventana de septiembre → octubre cruza el cambio de hora de Nueva Zelanda. Con
  las fechas elegidas, las filas de R3, R4, los candados movidos y la
  secuencia dan lo mismo en las 419 zonas medidas; el fichero pasó completo
  con `TZ=UTC`, `TZ=America/Mexico_City` y `TZ=Pacific/Auckland`.
- **Guard C8**: nada de la forma `<palabra>-[` en el código de test (lo lee
  `describe('C8: la UI no usa clases arbitrarias'`).

### D10 — Orden y rojos (C4)

Todos los rojos son **naturales** (vía (a) de C4): el código de hoy **es** el
defecto, o el verde anterior aún no hace lo que pide el siguiente requisito.
Ninguna mutación versionada.

| R | Estado de producción en el commit rojo | Por qué el rojo es legítimo |
|---|---|---|
| R1 | esqueleto `reminderPushBody` que devuelve `` `Recordatorio: ${title}` `` (el cuerpo de hoy) | 7 filas fallan por aserción, no por `Cannot find module` |
| R2 | el cuarto parámetro de constructor ya inyectado, **sin usar** | los tests compilan y llaman con cuatro argumentos; fallan por aserción (cuerpo sin fecha, `findOwnerTimezone` sin llamar) |
| R3 | la pantalla de `40ec1b46` | ningún chip se desactiva: es el defecto |
| R4 | el verde de R3: `const [now] = useState(Date.now);` (sin setter) y Guardar con `effectiveAdvance(dueAt, advanceMinutes, now)` | los chips y Guardar usan el instante del montaje |

El verde de R3 guarda con el `now` del estado y no con lo seleccionado en
pantalla a propósito: con `advanceMinutes: selectedAdvance` el lint marca como
impuro el `Date.now()` que ya había en `handleSubmit` (medido); con `now` del
estado el lint queda limpio en cada commit.

---

## Archivos afectados

| Fichero | Capa | Cambio |
|---|---|---|
| `backend-pet-tracker/src/modules/reminders/application/reminder-push-body.ts` | application | **nuevo**: `reminderPushBody` (D2, D4) |
| `backend-pet-tracker/src/modules/reminders/application/reminder-push-body.spec.ts` | test | **nuevo**: `#125 R1` (7 filas) |
| `backend-pet-tracker/src/modules/reminders/infrastructure/reminders-dispatch.service.ts` | infrastructure | cuarto parámetro `PET_REPOSITORY`, lectura de zona dentro del `try`, `body: reminderPushBody(…)` (D3) |
| `backend-pet-tracker/src/modules/reminders/infrastructure/reminders-dispatch.service.spec.ts` | test | `petsStub`, cuarto argumento en R5/R6, literal de R6, `#125 R2` (2) |
| `mobile-pet-tracker/src/screens/add-reminder/index.tsx` | pantalla | `isAdvancePast`, `effectiveAdvance`, estado `now`, `disabled` y clase de los chips, `advanceMinutes` de `createReminder` (D5-D8) |
| `mobile-pet-tracker/src/screens/add-reminder/index.test.tsx` | test | tres candados movidos, helpers, `#125 R3` (9) y `#125 R4` (3) |

**No cambian**: `reminders.module.ts`, `pets.module.ts`, `pet.repository.ts`,
`reminder.repository.ts`, `reminder.drizzle.repository.ts`, `src/db/`
(ni migraciones), `test/` (e2e), `src/workers/notifier/`,
`mobile-pet-tracker/src/i18n/catalog.ts`, `src/__tests__/*`,
`src/utils/reminder-dates.ts`, `package.json`, `pnpm-lock.yaml`, `bun.lock`,
`docs/`, `infra/`.

---

## Alternativas descartadas

- **B, omitir el aviso pasado en el backend**: decisión del humano.
- **Join en `findDue`**, **leer la zona de `createdBy`**, **memoizar por
  mascota**: D3.
- **`.format()` de `Intl`**: D4.
- **Selección pegajosa**: D6.
- **`Date.now()` en render, intervalo, `'use no memo'`**: D7.
- **Helper de avisos en `src/utils/`**: `ADVANCE_OPTIONS` vive en la pantalla y
  nadie más lo usa; dos funciones de una línea junto a él no justifican un
  módulo ni un fichero de test más (la regla de extracción de la carta pide
  ≥ 2 usuarios).
- **Columna de idioma para el push**: D2.

---
feature: "reminder-advance-already-past"
status: approved         # draft | spec_ready | approved
tags: [harness, spec, backend, mobile]
---

# Requisitos — [[reminder-advance-already-past]] (#125)

> Notación EARS. Cada requisito tiene id único R\<n\>, inmutable una vez aprobado.
> Ver [[design]] para las decisiones técnicas, [[tasks]] para el orden de
> commits y [[traceability]] para la trazabilidad.
>
> Fuente: `feature_list.json` #125 (description, cinco criterios y la
> **decisión del humano del 2026-09-24: opciones C + A, no B**). Cada premisa
> del encargo se verificó contra el árbol antes de escribir un requisito (§0);
> las que no cuadraban se corrigen en §0.2. Cada rojo, cada verde y cada
> mutación de las tablas se **midió** con una sonda del spec_author en el
> scratchpad (copia del árbol fuera del repo), no se supuso.
>
> Feature **backend + móvil**, P2. Backend: un módulo puro nuevo (el cuerpo
> del push) y el dispatcher lo usa con la zona del owner. Móvil: los chips de
> aviso de Nuevo recordatorio. **Cero dependencias, cero migraciones, cero
> cambios de puerto, cero claves de catálogo, cero cambios nativos** (no hace
> falta regenerar el dev build).
>
> Base: `40ec1b46` (= `origin/main` el 2026-09-24). Branch
> `feature/125-reminder-advance-already-past`, worktree
> `/home/claude/sites/Pet-Tracker-wt-backend`. Rutas con prefijo
> `backend-pet-tracker/` o `mobile-pet-tracker/` cuando no es obvio; dentro de
> cada requisito, relativas a su proyecto. **Ninguna cita usa número de
> línea**: todo ancla es un texto literal que se encuentra con `grep -n`.

---

## §0. Verificación de premisas contra el árbol

### §0.1 Premisas confirmadas

| # | Premisa | Evidencia (ancla grepeable, medida en `40ec1b46`) |
|---|---|---|
| P1 | Nuevo recordatorio preselecciona 7 días y ofrece cuatro avisos | `mobile-pet-tracker/src/screens/add-reminder/index.tsx`: `const [advanceMinutes, setAdvanceMinutes] = useState(10080);` y `const ADVANCE_OPTIONS = [` con `minutes: 0`, `1440`, `4320`, `10080`, en ese orden (ascendente) |
| P2 | El backend encola cuando el momento del aviso es menor **o igual** que ahora | `reminder.drizzle.repository.ts`, en `async findDue(now: Date)`: `` sql`${reminders.dueAt} - (${reminders.advanceMinutes} * interval '1 minute') <= ${now}` ``. El dispatcher corre cada `REMINDERS_INTERVAL_MS = 60_000` y el notifier cada `NOTIFIER_INTERVAL_MS = 60_000` |
| P3 | El cuerpo del push no dice cuándo vence | `reminders-dispatch.service.ts`: `` body: `Recordatorio: ${reminder.title}`, ``. El título del push es `title: reminder.title` |
| P4 | El formulario ya rechaza un vencimiento que no es futuro, con el mismo `<=` | `add-reminder/index.tsx`, en `async function handleSubmit()`: `if (dueAt.getTime() <= Date.now()) {` → `t('addReminder.dateMustBeFuture')`. El backend lo repite: `reminder.dto.ts` `.refine((value) => new Date(value).getTime() > Date.now(), {` (`'Due date must be in the future'`), que el móvil pinta con la misma clave vía `case 'invalid':`. `minimumDate={new Date()}` solo limita el **día**: hoy a una hora pasada es elegible |
| P5 | Ya existe un puerto que da la zona del owner, con la semántica de #83/#89/#90 | `pet.repository.ts`: `findOwnerTimezone(petId: string): Promise<string \| null>;` («Primer owner activo por created_at; columna cruda o null sin owner»). Lo usa `ownerLocalDay` en `src/modules/pets/application/owner-local-day.ts`. `pets.module.ts` hace `exports: [PET_REPOSITORY, PetAccessGuard],` y `reminders.module.ts` hace `imports: [ConfigModule, PetsModule],`: el dispatcher lo puede inyectar **sin tocar ningún módulo** |
| P6 | `users.timezone` puede no ser IANA, y ya hay un validador | `users.schema.ts`: `timezone: varchar('timezone', { length: 64 }).notNull().default('UTC'),`; `register-user.dto.ts`: `timezone: z.string().trim().min(1).max(64).optional(),` (sin validar contra IANA). `src/pipeline/local-day.ts` exporta `export function isSupportedTimeZone(timeZone: string): boolean {` (catálogo de `Intl` + `'UTC'`), y `localDayInZone` de #83 cae a `'UTC'` con esa misma condición. El móvil registra la zona del teléfono: `timezone: deviceTimezone(),` en `src/app/(auth)/register.tsx` |
| P7 | Node trae ICU completo | Medido: `node -v` → `v20.20.2`, `process.versions.icu` → `78.2`, `Intl.supportedValuesOf('timeZone').length` → `418` |
| P8 | `Pressable` con `disabled` publica el estado accesible y deja de disparar `onPress` en los tests | `node_modules/react-native/Libraries/Components/Pressable/Pressable.js` (RN 0.86.2): `disabled != null ? {..._accessibilityState, disabled} : _accessibilityState;`. Medido con la sonda: con RNTL 14.0.1, `fireEvent.press` sobre un `Pressable` con `disabled` no llama a `onPress` (mutación MU2 de R3) |
| P9 | En los tests de backend ts-jest **no** comprueba tipos | `tsconfig.json` de backend: `"isolatedModules": true`; ts-jest 29.4.12. Medido: un constructor llamado con un argumento de más compila y pasa. El candado de tipos es `pnpm exec tsc --noEmit` ([[tasks]] §Cierre) |
| P10 | Hay un precedente de «inactivo» con la misma utilidad | `src/screens/reminders/index.tsx`: `` className={`min-h-20 flex-row items-center gap-3${inactive ? ' opacity-50' : ''}`} `` |
| P11 | Bases | init.sh del leader en `40ec1b46` (exit 0, sin pipe): backend unit **170 suites / 1298 tests**, infra **2 / 14**, móvil **83 / 1491**, e2e **27 suites + 3 skipped (389 tests + 8 skipped)**. Del spec_author (jest enfocado, exit 0): `src/screens/add-reminder/index.test.tsx` **25**; `src/modules/reminders/infrastructure/reminders-dispatch.service.spec.ts` **4**; `src/modules/reminders` **6 suites / 48 tests** |

### §0.2 Premisas corregidas o precisadas (nadie construye sobre la versión anterior)

| # | Qué decía el encargo | Lo que dice el árbol | Evidencia |
|---|---|---|---|
| C1 | «el push en la zona del owner» (implícito: le llega al owner) | Le llega a **todos los miembros activos** de la mascota, con el **mismo** cuerpo. La hora sale en la zona del owner para todos | `notifier-consumer.service.ts`: `const tokens = await this.pushTokens.findActiveMembersTokens(petId);` y `body: message.body,`. Un cuidador en otra zona ve la hora del owner: §Fuera de alcance |
| C2 | «el push va en español fijo, la app tiene i18n es/en» (¿hay locale de usuario en backend?) | **No hay** idioma de usuario en el backend. `git grep -in "locale\|language" -- backend-pet-tracker/src` solo da un `localeCompare` de un test de schema y un comentario; `users.schema.ts` no tiene columna de idioma, y el idioma de la app vive en el teléfono (carta §Dirección de arte 6: «elección explícita del usuario en Profile»). Todo push del backend va hoy en español fijo: también `buildCopy` de `alerts-engine-consumer.service.ts` | [[design]] D2 |
| C3 | `files_affected`: tres ficheros | Faltan el módulo nuevo del cuerpo y su spec (`src/modules/reminders/application/reminder-push-body.ts` y `.spec.ts`) y la spec del dispatcher (`reminders-dispatch.service.spec.ts`). `reminders.module.ts` **no** cambia (P5) | [[design]] §Archivos afectados |
| C4 | «¿hay un e2e de dispatch cuyo cuerpo tenga que moverse?» | **No.** `git grep -n "Recordatorio" -- backend-pet-tracker/test` no da nada. `describe('R7: create, dispatch y notifier dejan sent sin duplicar push'` de `test/pet-reminders.e2e-spec.ts` solo asevera `expect.objectContaining({ data: { petId: pet.id, reminderId } })`. E2e: **+0** | — |
| C5 | (implícito) el literal `'Recordatorio: '` solo vive en el dispatcher | También en `src/workers/notifier/notifier-consumer.service.spec.ts` (`body: 'Recordatorio: Desparasitación',`), pero como **entrada** del consumidor, que reenvía el cuerpo sin mirarlo. **No se mueve** | — |
| C6 | «¿cuándo se evalúa "ahora" (en render con el `Date` actual)?» | **No sirve «en render»**, por dos hechos medidos: (1) `bunx eslint` sobre un borrador con `const now = Date.now();` en el cuerpo del componente da `react-hooks/purity` («Cannot call impure function during render»), error; (2) la app compila con React Compiler (`"reactCompiler": true` en `app.json`) y el compilador mete ese `Date.now()` en un bloque memoizado por `[advanceMinutes, date, time]` (salida de `babel-plugin-react-compiler` 1.0.0 medida en el scratchpad), mientras que jest **no** lo aplica (`getReactCompiler` de `babel-preset-expo` lee `caller?.supportsReactCompiler`, que babel-jest no pone). Test y teléfono verían relojes distintos | [[design]] D7 |
| C7 | (implícito) los tests actuales de Nuevo recordatorio siguen verdes | **Tres se mueven** con cualquier implementación de C (medido con la sonda): `it('renders alert choices and selects seven days by default'` (el estado accesible gana `disabled: false`), `it('posts the exact trimmed input and navigates back on success'` (pulsa «1 día antes» para mañana a las 09:00 cuando son las 10:00: es exactamente el defecto) y la fila 1 de `describe('#123 R4: Nuevo recordatorio muestra y guarda el día elegido'` (hoy a las 21:30 cuando son las 20:00 con aviso de 7 días: también el defecto) | §Candados |
| C8 | «tablas de fecha que crucen mes» con el caso del humano (fin de septiembre) | Una ventana de 7 días del 24 de septiembre al 1 de octubre **cruza el inicio del horario de verano de Nueva Zelanda** (27-09-2026) y la fila «7 días y 1 minuto» cambia de resultado en 3 de 419 zonas (`Pacific/Auckland`, `Pacific/Chatham`, `Antarctica/McMurdo`). Las filas de frontera de 7 días usan **24 de junio → 1 de julio** (también cruce de mes), que da el mismo resultado en las 419 zonas medidas. El caso literal del humano (1 del mes siguiente, último día del mes) queda en las filas 4 y 5 de R3 | Sonda con `TZ=<zona>` sobre las 418 zonas de `Intl` + `UTC` |
| C9 | «¿hay pantalla para editar el aviso?» | **No** en la app: `src/api/reminders.ts` solo exporta `listReminders`, `createReminder` y `deleteReminder`. El backend sí tiene `PATCH /v1/reminders/:id` (`update-reminder.use-case.ts`), sin cliente | §Fuera de alcance |

---

## Qué firma el humano al aprobar esta spec

Firmar sin editar = aceptar **D1-D10** de [[design]] tal cual. Aquí, una línea
por las que fijan comportamiento, copy o alcance; D4 (dónde vive y cómo se
compone el cuerpo) es técnica, y D9 y D10 son de arnés de test.

| Id | Decisión | En una línea |
|---|---|---|
| **D1** | **Una sola spec** | Las dos mitades son pequeñas, no comparten fichero, y la prueba de humo las valida juntas (chips y texto del push en la misma sesión). Partirla daría dos gates y dos humos sin ganar nada |
| **D2** | **Copy del cuerpo, en español fijo** | `Recordatorio: <título> · <día> de <mes> a las <HH>:<mm>`, p. ej. `Recordatorio: Vacuna antirrábica · 1 de octubre a las 09:00`. Mes en español y minúsculas, reloj de 24 h con dos dígitos, sin año ni día de la semana. Se conserva el prefijo de hoy; solo se añade el cuándo. **No** se añade una columna de idioma (C2): eso sería otra feature |
| **D3** | **Zona: el puerto que ya existe, una lectura por recordatorio** | El dispatcher inyecta `PET_REPOSITORY` y llama a `findOwnerTimezone(reminder.petId)` (primer owner activo, la misma semántica de #83/#89/#90). Si devuelve `null` o una zona que no es IANA, la hora sale en `'UTC'`. Si la lectura **falla**, esa fila no se encola (se reintenta en el tick siguiente, 60 s), igual que hoy un envío fallido. Sin join en `findDue`: [[design]] D3 explica el techo |
| **D5** | **«Igual» cuenta como pasado** | Un chip se desactiva cuando `dueAt − aviso ≤ ahora`. Es el mismo `<=` de `findDue` (P2) y del formulario (P4): un aviso cuyo momento es exactamente ahora saldría en el tick en curso |
| **D6** | **La selección se deriva, no se guarda** | Lo seleccionado es **el mayor aviso activo que no supera el último que eligió el usuario** (7 días si no eligió ninguno). Si un cambio de fecha u hora desactiva lo elegido, baja al mayor activo; si otro cambio lo reactiva, **vuelve lo que eligió el usuario**. Si todos están desactivados, no cambia nada y Guardar lo rechaza la validación de P4. **Se aparta de la sugerencia del leader** («si vuelve a ser válido, se queda el actual»): la variante «pegajosa» hace que lo enviado dependa del **orden** de los cambios, no del formulario final ([[design]] D6) |
| **D7** | **Cuándo es «ahora»** | Los chips se evalúan con el instante del **último cambio de fecha u hora** (estado `now`, inicializado al montar). Guardar recalcula con el instante **del envío**, así que nunca se manda un aviso que ya pasó salvo que también haya pasado el vencimiento, y eso ya lo rechaza P4 |
| **D8** | **Chip desactivado sin copy nuevo** | `Pressable` con `disabled` (estado accesible `disabled: true`, no pulsable), la misma clase de siempre más ` opacity-50`, el mismo `hitSlop`. **+0 claves** de catálogo |

Si el humano **no** firma D6 y prefiere la variante pegajosa, esta spec se
reabre: cambia el `it` de secuencia de R3 (tras volver a las 09:00 se esperaría
«Mismo día», no «1 día antes») y la fila 2 de `#123 R4` pasaría a mandar `4320`.

---

## Contrato (normativo)

**Backend** (`backend-pet-tracker/`):

- `src/modules/reminders/application/reminder-push-body.ts` exporta **una**
  función pura,
  `export function reminderPushBody(title: string, dueAt: Date, timeZone: string | null): string`,
  que devuelve exactamente
  `` `Recordatorio: ${title} · ${día} de ${mes} a las ${hora}:${minuto}` ``,
  con `día` (sin cero a la izquierda), `mes` (nombre largo en español, en
  minúsculas), `hora` (`00`-`23`, dos dígitos) y `minuto` (dos dígitos) de
  `dueAt` en la zona efectiva. Zona efectiva: `timeZone` si no es `null` y
  `isSupportedTimeZone(timeZone)`; si no, `'UTC'`. El separador es
  espacio + `·` (U+00B7) + espacio, el mismo punto medio de
  `'reminders.dueInDays'`.
- `RemindersDispatchService` recibe un cuarto parámetro de constructor
  `@Inject(PET_REPOSITORY) private readonly pets: PetRepository` y, **dentro
  del `try` de cada recordatorio y antes del `SendMessageCommand`**, llama a
  `this.pets.findOwnerTimezone(reminder.petId)` y publica
  `body: reminderPushBody(reminder.title, reminder.dueAt, <esa zona>)`. El
  resto del mensaje no cambia.

**Móvil** (`mobile-pet-tracker/src/screens/add-reminder/index.tsx`):

- `isAdvancePast(dueAt, minutes, now)` es `true` si y solo si `dueAt` no es
  `null` y `dueAt.getTime() - minutes * 60_000 <= now`.
- `effectiveAdvance(dueAt, preferred, now)` devuelve el mayor
  `ADVANCE_OPTIONS[i].minutes` que cumple `minutes <= preferred` y
  `!isAdvancePast(dueAt, minutes, now)`; si ninguno cumple, `preferred`.
- La pantalla guarda `now` en estado (`useState(Date.now)`) y lo refresca con
  `Date.now()` en el `onValueChange` del picker de fecha y en el del de hora.
- Cada chip: `selected = effectiveAdvance(<vencimiento elegido>, advanceMinutes, now) === option.minutes`,
  `disabled = isAdvancePast(<vencimiento elegido>, option.minutes, now)`, con
  `<vencimiento elegido>` = `combineDateAndTime(date, time)` o `null` sin fecha.
- `createReminder` recibe
  `advanceMinutes: effectiveAdvance(dueAt, advanceMinutes, Date.now())`,
  calculado en `handleSubmit`.

---

## Requisitos funcionales

Todas las `describe` nuevas llevan el prefijo `#125 R<n>:` (o `#125:` el
padre), también en los ficheros nuevos (`docs/conventions.md` §Prefijo de
feature: `add-reminder/index.test.tsx` y la spec del dispatcher ya tienen R-ids
de otras specs). En backend los tests viven en `src/` (`"rootDir": "src"`,
`"testRegex": ".*\\.spec\\.ts$"`); en móvil, colocados.

### R1 — El cuerpo del push dice cuándo vence, en la zona del owner

**WHEN** el dispatcher arma el cuerpo de un push de recordatorio con
`reminderPushBody(title, dueAt, timeZone)`,
**THE SYSTEM SHALL** devolver exactamente
`Recordatorio: <title> · <día> de <mes> a las <HH>:<mm>` con la fecha y la
hora de `dueAt` en `timeZone`,
**AND IF** `timeZone` es `null` o no es una zona que `isSupportedTimeZone`
reconoce, **THEN THE SYSTEM SHALL** usar `'UTC'`.

- **Test**: `backend-pet-tracker/src/modules/reminders/application/reminder-push-body.spec.ts`
  (nuevo),
  `describe('#125 R1: el cuerpo del push dice cuándo vence, en la zona del owner'`
  → `it.each(<tabla>)('%s', …)` con
  `expect(reminderPushBody('Vacuna antirrábica', new Date(dueAt), timeZone)).toBe(esperado)`.

| # | Título de la fila (`%s`) | `dueAt` | `timeZone` | Esperado |
|---|---|---|---|---|
| 1 | `1 de octubre a las 09:00 en Ciudad de México (UTC-6)` | `'2026-10-01T15:00:00.000Z'` | `'America/Mexico_City'` | `'Recordatorio: Vacuna antirrábica · 1 de octubre a las 09:00'` |
| 2 | `en UTC ya es 1 de octubre y en Ciudad de México sigue siendo 30 de septiembre (cruce de mes)` | `'2026-10-01T03:30:00.000Z'` | `'America/Mexico_City'` | `'Recordatorio: Vacuna antirrábica · 30 de septiembre a las 21:30'` |
| 3 | `en UTC ya es 2027 y en Ciudad de México sigue siendo 31 de diciembre (cruce de año)` | `'2027-01-01T05:30:00.000Z'` | `'America/Mexico_City'` | `'Recordatorio: Vacuna antirrábica · 31 de diciembre a las 23:30'` |
| 4 | `el mismo instante en una zona UTC` | `'2027-01-01T05:30:00.000Z'` | `'UTC'` | `'Recordatorio: Vacuna antirrábica · 1 de enero a las 05:30'` |
| 5 | `en Kiritimati (UTC+14) ya es 1 de enero a las 00:30 (cruce de año hacia delante)` | `'2026-12-31T10:30:00.000Z'` | `'Pacific/Kiritimati'` | `'Recordatorio: Vacuna antirrábica · 1 de enero a las 00:30'` |
| 6 | `sin owner (zona null) cae a UTC` | `'2026-10-01T15:00:00.000Z'` | `null` | `'Recordatorio: Vacuna antirrábica · 1 de octubre a las 15:00'` |
| 7 | `zona que no es IANA cae a UTC` | `'2026-10-01T15:00:00.000Z'` | `'Not/A/Zone'` | `'Recordatorio: Vacuna antirrábica · 1 de octubre a las 15:00'` |

Ciudad de México es UTC−6 todo el año (sin horario de verano desde 2022);
Kiritimati, UTC+14 todo el año. Los esperados son los mismos con el host en
`UTC` y en `America/Mexico_City` (medido).

- **Rojo natural** (esqueleto que devuelve el cuerpo de hoy,
  `` `Recordatorio: ${title}` ``, [[tasks]] R1): las 7 filas, por aserción.
- **Mutaciones que deben dejarlo rojo** (medidas en el scratchpad con host
  `UTC` y `America/Mexico_City`; mismas filas en los dos salvo M1):

| Id | Mutación en `reminderPushBody` | Filas rojas |
|---|---|---|
| M1 | no pasar `timeZone` a `Intl` (zona del host) | 1, 2, 3, 5 con host UTC; 4, 5, 6, 7 con host Ciudad de México |
| M2 | `hour12: true` en vez de `hourCycle: 'h23'` | 2, 3, 5, 6, 7 |
| M3 | `hourCycle: 'h24'` | 5 (`24:30`) |
| M4 | `month: 'numeric'` | 1-7 |
| M5 | día con `dueAt.getUTCDate()` | 2, 3, 5 |
| M6 | sin caída a UTC (la zona cruda a `Intl`) | 6, 7 (`RangeError`) |
| M7 | `hourCycle: 'h11'` | 2, 3, 6, 7 |

  **Techo conocido**: caer a la zona **del host** en vez de a `'UTC'` es
  verde en un host UTC (VPS y CI) y rojo en Ciudad de México (filas 6 y 7).
  Lo cierra el grep de [[tasks]] §Cierre (un único `'UTC'` en el fichero).

### R2 — El dispatcher publica el cuerpo con la zona del owner de cada mascota

**WHEN** `dispatchOnce()` publica un recordatorio vencido,
**THE SYSTEM SHALL** leer la zona con
`PetRepository.findOwnerTimezone(reminder.petId)` y publicar
`body = reminderPushBody(reminder.title, reminder.dueAt, <esa zona>)`,
**AND IF** esa lectura falla, **THEN THE SYSTEM SHALL** no publicar ni marcar
`enqueuedAt` en esa fila, registrar el error con `logger.error` y seguir con
las siguientes.

- **Test**: `backend-pet-tracker/src/modules/reminders/infrastructure/reminders-dispatch.service.spec.ts`,
  al final,
  `describe('#125 R2: el dispatcher escribe en el cuerpo cuándo vence, en la zona del owner de cada mascota'`
  con el mismo `beforeEach`/`afterEach` que `describe('R5: dispatcher encola vencidos una sola vez'`
  (relojes falsos en `NOW`, espía de `Logger.prototype.error`, restauración) y
  **dos** `it`. Recordatorios con `new Reminder({ ...reminder(<id>, '2026-10-01T03:30:00.000Z'), petId: <PET_A | PET_B> })`
  (dos UUID literales nuevos, uno por mascota); cuerpos leídos con
  `JSON.parse(command.input.MessageBody).body` de los `SendMessageCommand`, en
  orden:
  - `it('dos mascotas con owners en zonas distintas: cada cuerpo con la suya')`:
    `PET_A` → `'America/Mexico_City'`, `PET_B` → `'Asia/Tokyo'`. Asevera
    `pets.findOwnerTimezone.mock.calls` `toEqual([[PET_A], [PET_B]])` y los
    cuerpos `toEqual(['Recordatorio: Reminder first · 30 de septiembre a las 21:30', 'Recordatorio: Reminder second · 1 de octubre a las 12:30'])`.
  - `it('si la zona del owner no se puede leer, esa fila no se encola y las siguientes sí')`:
    `PET_A` → rechaza con `new Error('db down')`, `PET_B` →
    `'America/Mexico_City'`. Asevera los cuerpos
    `toEqual(['Recordatorio: Reminder sent · 30 de septiembre a las 21:30'])`,
    `repository.markEnqueued.mock.calls` `toEqual([[sent.id, NOW]])` y
    `logError` llamado.
- **Doble del puerto** (en el mismo fichero, junto a `repositoryStub`):
  `petsStub(zones: Record<string, string | null | Error> = {})` con
  `findOwnerTimezone = jest.fn((petId: string) => …)` que resuelve
  `zones[petId]` si la mascota está en el mapa (rechaza si es un `Error`) y
  `'America/Mexico_City'` si no; devuelve
  `{ client: { findOwnerTimezone } as unknown as PetRepository, findOwnerTimezone }`.
  Cast al puerto, como `repositoryStub`: el puerto no gana métodos, así que
  ningún otro doble de `PetRepository` se rompe.
- **Rojo natural** (esqueleto: el parámetro de constructor ya inyectado, sin
  usar, [[tasks]] R2): los dos `it` nuevos y el candado movido de R6
  (§Candados), por aserción. Los tres `it` de R5 siguen verdes.
- **Mutaciones que deben dejarlo rojo** (medidas):

| Id | Mutación en el dispatcher | Tests rojos |
|---|---|---|
| D1 | zona constante `'UTC'` | R6 movido y los dos `it` de #125 R2 |
| D2 | `findOwnerTimezone(reminder.id)` | los dos `it` de #125 R2 |
| D3 | la lectura de zona **fuera** del `try` | `si la zona del owner no se puede leer…` (la promesa de `dispatchOnce` rechaza) |
| D4 | una sola lectura por tick, reutilizada para todas las filas | `dos mascotas con owners en zonas distintas…` |
| D5 | lectura fallida → `'UTC'` y se publica igual | `si la zona del owner no se puede leer…` |

### R3 — Los chips de aviso que ya pasaron se desactivan y la selección baja al mayor aviso aún futuro

**WHILE** hay una fecha elegida en Nuevo recordatorio,
**THE SYSTEM SHALL** desactivar cada chip de aviso cuyo momento
(fecha y hora elegidas menos el aviso) sea **menor o igual** que el instante
de evaluación —estado accesible `disabled: true`, `onPress` inerte, su clase
de siempre más ` opacity-50`— y marcar como seleccionado el **mayor aviso no
desactivado que no supere el último elegido por el usuario** (7 días si no
eligió ninguno); **IF** todos están desactivados, **THEN THE SYSTEM SHALL**
mantener la selección y dejar que Guardar lo rechace con
`La fecha debe ser futura`. Con el reloj detenido, Guardar envía ese mismo
aviso en `advanceMinutes`. Sin fecha elegida ningún chip se desactiva.

- **Test**: `mobile-pet-tracker/src/screens/add-reminder/index.test.tsx`,
  **al final del fichero**, después de
  `describe('#123: pickers de fecha de Nuevo recordatorio en Android a las 20:00 del 24 de septiembre'`,
  dentro de un `describe` padre
  `describe('#125: avisos que ya pasaron en Nuevo recordatorio'` con el arnés
  de [[design]] D9, el hijo
  `describe('#125 R3: los chips de aviso cuyo momento ya pasó quedan desactivados y la selección baja al mayor aviso aún futuro'`
  con **un** `it.each` y **dos** `it`.
- **Helpers de módulo** (antes del `describe` padre, junto a los de #123):
  `const ADVANCES = [0, 1440, 4320, 10080] as const;`,
  `const CHIP_SELECTED = 'rounded-full border border-accent bg-accent-soft px-3 py-2';`,
  `const CHIP_IDLE = 'rounded-full border border-border bg-default px-3 py-2';`,
  `function expectAdvanceChips(disabled: boolean[], selected: number)` que, para
  cada `minutes` de `ADVANCES` en orden, asevera
  `screen.getByTestId(\`advance-chip-${minutes}\`).props.accessibilityState`
  `toEqual({ selected: minutes === selected, disabled: disabled[i] })` y su
  `props.className` `toBe(<CHIP_SELECTED o CHIP_IDLE> + (disabled[i] ? ' opacity-50' : ''))`;
  y `async function pickTime(hours: number, minutes: number)` que pulsa
  `time-field` y dispara `onValueChange` en
  `within(screen.getByTestId('expo-ui-picker-host')).getByTestId('time-picker')`
  con `{}` y `new Date(2026, 0, 1, hours, minutes)` (como la fila de
  `#123 R4`).
- **`it.each`** (título `'%s'`), columnas `[título, ahora, día, desactivados, seleccionado, enviado]`:
  1. `jest.setSystemTime(new Date(...ahora))` con componentes **locales**;
     `await renderAddReminder()`; esperar `title-input` visible;
     `changeText` a `'Rabies'`.
  2. `await pickDate(new Date(día[0], día[1], día[2], 12, 0))` (hora por
     defecto: 09:00).
  3. `expectAdvanceChips(desactivados, seleccionado)`.
  4. Pulsar `add-reminder-submit`. Si `enviado` es un número:
     `await waitFor(() => expect(mockCreateReminder).toHaveBeenCalledWith('http://example.test/v1', 'jwt-token', 'pet-1', { type: 'vaccine', title: 'Rabies', dueAt: new Date(día[0], día[1], día[2], 9, 0).toISOString(), advanceMinutes: enviado }))`.
     Si es `null`: `add-reminder-error` `toHaveTextContent('La fecha debe ser futura')`
     y `mockCreateReminder` no llamado.

| # | Título de la fila (`%s`) | Ahora (local) | Día | Desactivados `[0, 1440, 4320, 10080]` | Seleccionado | Enviado |
|---|---|---|---|---|---|---|
| 1 | `a 7 días justos del 1 de julio, el aviso de 7 días cae en el instante actual y cuenta como pasado (cruce de mes)` | `[2026, 5, 24, 9, 0]` | `[2026, 6, 1]` | `[false, false, false, true]` | `4320` | `4320` |
| 2 | `a 7 días y 1 minuto del 1 de julio, el aviso de 7 días sigue en el futuro (cruce de mes)` | `[2026, 5, 24, 8, 59]` | `[2026, 6, 1]` | `[false, false, false, false]` | `10080` | `10080` |
| 3 | `el 1 de enero de 2027 desde el mediodía del 29 de diciembre queda el aviso de 1 día (cruce de año)` | `[2026, 11, 29, 12, 0]` | `[2027, 0, 1]` | `[false, false, true, true]` | `1440` | `1440` |
| 4 | `el 1 de octubre desde la noche del 30 de septiembre solo queda el mismo día (cruce de mes)` | `[2026, 8, 30, 20, 0]` | `[2026, 9, 1]` | `[false, true, true, true]` | `0` | `0` |
| 5 | `el 30 de septiembre a 3 días justos, el aviso de 3 días cuenta como pasado` | `[2026, 8, 27, 9, 0]` | `[2026, 8, 30]` | `[false, false, true, true]` | `1440` | `1440` |
| 6 | `el 1 de enero de 2027 a 1 día justo, el aviso de 1 día cuenta como pasado (cruce de año)` | `[2026, 11, 31, 9, 0]` | `[2027, 0, 1]` | `[false, true, true, true]` | `0` | `0` |
| 7 | `a la hora exacta del recordatorio todos cuentan como pasados y el formulario lo rechaza` | `[2026, 9, 1, 9, 0]` | `[2026, 9, 1]` | `[true, true, true, true]` | `10080` | `null` |

  Filas 1, 5, 6 y 7: la frontera exacta (momento == ahora) de 7 días, 3 días,
  1 día y 0. Fila 2: un minuto antes de la frontera. Filas 4 y 5: el caso del
  humano (1 del mes siguiente, último día del mes). Mismos resultados en las
  419 zonas medidas (C8).

- **`it('pulsar un chip desactivado no cambia la selección')`**: ahora
  `new Date(2026, 5, 24, 9, 0)`, título `'Rabies'`, `pickDate(new Date(2026, 6, 1, 12, 0))`,
  pulsar `advance-chip-0`, pulsar `advance-chip-10080` (desactivado),
  `expectAdvanceChips([false, false, false, true], 0)`, Guardar y
  `advanceMinutes: 0` con `dueAt: new Date(2026, 6, 1, 9, 0).toISOString()`.
  Pulsar primero «Mismo día» es necesario: con la preferencia en 7 días,
  pulsar el chip de 7 días desactivado no cambiaría nada aunque respondiera.
- **`it('al cambiar fecha u hora se recalcula: la elección explícita se conserva mientras siga en el futuro y vuelve cuando deja de estar en el pasado')`**:
  ahora `new Date(2026, 8, 24, 8, 0)` (constante), título `'Rabies'`, y en orden:

| Paso | Acción | `expectAdvanceChips(…)` |
|---|---|---|
| a | `pickDate(new Date(2026, 9, 10, 12, 0))` | `[false, false, false, false], 10080` |
| b | pulsar `advance-chip-1440` | `[false, false, false, false], 1440` |
| c | `pickDate(new Date(2026, 8, 25, 12, 0))` | `[false, false, true, true], 1440` (se conserva) |
| d | `pickTime(7, 0)` | `[false, true, true, true], 0` (1 día antes = el 24 a las 07:00, ya pasó) |
| e | `pickTime(9, 0)` | `[false, false, true, true], 1440` (vuelve la elección, D6) |
| f | Guardar | `advanceMinutes: 1440`, `dueAt: new Date(2026, 8, 25, 9, 0).toISOString()` |

- **Rojo natural** (medido contra la pantalla de `40ec1b46`): las 7 filas, los
  dos `it` y los dos candados movidos que dependen del cambio (§Candados:
  `renders alert choices…` y la fila 1 de `#123 R4`), **11 rojos** por
  aserción; los otros 23 tests del fichero verdes.
- **Mutaciones que deben dejarlo rojo** (medidas sobre el borrador verde de
  R4, con el fichero completo; F = fila de la tabla, P = `it` del chip
  desactivado, S = `it` de secuencia; entre paréntesis lo que cae además en
  otros R o candados):

| Id | Mutación en la pantalla | Rojos |
|---|---|---|
| MU1 | `< now` en vez de `<= now` | F1, F5, F6, F7, P (+3 de R4) |
| MU2 | sin `disabled` en el `Pressable`, solo `accessibilityState={{ selected, disabled }}` | P |
| MU3 | `effectiveAdvance` ignora la preferencia (siempre el mayor activo) | P, S (+ `renders alert choices…`, `posts the exact…`) |
| MU5 | sin ` opacity-50` | F1, F3-F7, P, S (+2 de R4) |
| MU6 | el vencimiento ignora la hora elegida | S |
| MU8 | Guardar manda la preferencia cruda (`advanceMinutes`) | F1, F3-F6 (+ `#123 R4` fila 1, +1 de R4) |
| MU9 | el **menor** aviso activo en vez del mayor | F1-F3, F5, S (+3 de R4, + `renders alert choices…`, `posts the exact…`, `#123 R4` filas 2 y 3) |
| MU10 | `minutes * 3_600_000` (horas en vez de minutos) | F1-F3, F5, P, S (+3 de R4, + `posts the exact…`, `#123 R4` filas 2 y 3) |
| MU11 | sin ningún activo, seleccionar `0` en vez de mantener | F7 |
| MU16 | ` opacity-50` en el seleccionado en vez de en el desactivado | F1-F7, P, S (+3 de R4) |

### R4 — Los chips se evalúan con el instante del último cambio de fecha u hora, y Guardar recalcula con el del envío

**WHEN** el usuario elige una fecha o una hora en Nuevo recordatorio,
**THE SYSTEM SHALL** reevaluar los chips (desactivados y seleccionado) con el
instante de ese cambio,
**AND WHEN** el usuario pulsa Guardar, **THE SYSTEM SHALL** enviar en
`advanceMinutes` el aviso que resulta de aplicar la regla de R3 con el
instante del envío.

- **Test**: mismo `describe` padre de R3, hijo
  `describe('#125 R4: los chips se evalúan con el instante del último cambio de fecha u hora y guardar recalcula con el del envío'`
  con un helper local `async function openAt(now: number[])` que fija el
  reloj en `now` (componentes locales), renderiza, escribe `'Rabies'`, hace
  `pickDate(new Date(2026, 6, 1, 12, 0))`, asevera
  `expectAdvanceChips([false, false, false, false], 10080)` y **después**
  mueve el reloj a `new Date(2026, 5, 24, 9, 0)` sin volver a renderizar. Tres
  `it`, todos con `await openAt([2026, 5, 24, 8, 58])`:
  - `it('cambiar la hora reevalúa los chips con el instante del cambio')`:
    `pickTime(9, 0)` (la misma hora) →
    `expectAdvanceChips([false, false, false, true], 4320)`.
  - `it('volver a elegir la fecha reevalúa los chips con el instante del cambio')`:
    `pickDate(new Date(2026, 6, 1, 12, 0))` (el mismo día) →
    `expectAdvanceChips([false, false, false, true], 4320)`.
  - `it('guardar envía el mayor aviso aún futuro en el instante del envío')`:
    pulsar Guardar →
    `advanceMinutes: 4320`, `dueAt: new Date(2026, 6, 1, 9, 0).toISOString()`.
- A las 08:58 el aviso de 7 días (24 de junio, 09:00) está en el futuro; a las
  09:00 es la frontera exacta (D5).
- **Rojo natural** (medido sobre el verde de R3, que evalúa con el instante
  del montaje y guarda con ese mismo instante, [[tasks]] R3): los tres `it`,
  por aserción.
- **Mutaciones que deben dejarlo rojo** (medidas):

| Id | Mutación | Rojo |
|---|---|---|
| MU12 | sin `setNow(Date.now())` en el picker de hora | `cambiar la hora…` |
| MU13 | sin `setNow(Date.now())` en el picker de fecha | `volver a elegir la fecha…` |
| MU14 | Guardar manda lo seleccionado en pantalla | `guardar envía…` |
| MU15 | Guardar recalcula con el `now` del estado en vez de `Date.now()` | `guardar envía…` |

### R5 — Gate humano: smoke en dev build de Android

**WHEN** R1-R4 están en verde y el `reviewer` aprobó,
**THE SYSTEM SHALL** superar la prueba de humo de §Prueba de humo, corrida por
el humano en un **dev build de Android** (nunca Expo Go) con el teléfono en la
zona de Ciudad de México y el backend de esta branch con el dispatcher y el
notifier encendidos. **No delegable a IA.** Se firma en su propia casilla, no
en §Aprobación.

---

## Candados

### Se mueven (delta declarado; ninguno más)

| Fichero · ancla grepeable | Delta | R · commit |
|---|---|---|
| `backend-pet-tracker/src/modules/reminders/application/reminder-push-body.spec.ts` (nuevo) | **+1 suite, +7 tests** | R1 · rojo |
| `reminders-dispatch.service.spec.ts` · `describe('R6: dispatcher publica el mensaje reminder exacto'` | `` body: `Recordatorio: ${due.title}`, `` → `` body: `Recordatorio: ${due.title} · 13 de agosto a las 11:00`, `` (`dueAt` `'2026-08-13T17:00:00.000Z'` en la zona por defecto del doble, `'America/Mexico_City'`) | R2 · rojo |
| `reminders-dispatch.service.spec.ts` · las **cuatro** llamadas `new RemindersDispatchService(` de `R5` (3) y `R6` (1) | cuarto argumento `petsStub().client`. Sin él, el verde de R2 lanza `TypeError` dentro del `try` y los tres `it` de R5 se ponen rojos | R2 · rojo |
| Recuento de `reminders-dispatch.service.spec.ts` | **4 → 6** (+2) | R2 · rojo |
| Backend unit | **+1 suite, +9 tests**: `170 / 1298 → 171 / 1307` (medido en el scratchpad, exit 0) | — |
| `add-reminder/index.test.tsx` · `it('renders alert choices and selects seven days by default'` | las dos aserciones `.toEqual({ selected: true })` de los chips de aviso (`advance-chip-10080` y `advance-chip-1440`) → `.toEqual({ selected: true, disabled: false })`. Las de `type-chip-*` del `it` anterior **no** cambian | R3 · rojo |
| `add-reminder/index.test.tsx` · `it('posts the exact trimmed input and navigates back on success'` | `pickDate(new Date(2026, 7, 25, 12, 0))` → `pickDate(new Date(2026, 7, 28, 12, 0))` y `dueAt: new Date(2026, 7, 25, 9, 0).toISOString(),` → `dueAt: new Date(2026, 7, 28, 9, 0).toISOString(),`, **solo en ese `it`** (el mismo `pickDate` aparece en otros dos). Con el 25, «1 día antes» cae el 24 a las 09:00 cuando son las 10:00 y el test pulsaría un chip desactivado; con el 28, la selección por defecto es «3 días antes» y pulsar «1 día antes» la cambia de verdad | R3 · rojo |
| `add-reminder/index.test.tsx` · `describe('#123 R4: Nuevo recordatorio muestra y guarda el día elegido'` | sexta columna `aviso` (tipo `[string, number[], number[], string, string, number][]`, parámetro `aviso` del callback) con `0`, `10080`, `10080`, y `advanceMinutes: 10080` → `advanceMinutes: aviso`. Fila 1: hoy 24 de septiembre a las 21:30 cuando son las 20:00 → solo queda «Mismo día». `specs/mobile-date-picker-utc-day-shift/` **no** se edita (spec cerrada; su R4 queda como registro de lo aprobado) | R3 · rojo |
| Recuento de `add-reminder/index.test.tsx` | **25 → 37** (+12: R3 9, R4 3) | R3, R4 · rojos |
| Suite móvil | **+0 suites, +12 tests**: `83 / 1491 → 83 / 1503` (medido en el scratchpad, exit 0) | — |
| `src/providers/__tests__/language-provider.test.tsx` · `expect(englishKeys).toHaveLength(` | **+0** (ninguna clave nueva) | — |
| `src/__tests__/ui-copy-table.ts` | **+0** (ninguna llamada `t(` nueva) | — |
| E2e (`test/pet-reminders.e2e-spec.ts` y el resto) | **+0** (C4) | — |

### Siguen verdes sin tocarlos (si uno se pone rojo, la implementación está mal)

| Candado | Qué fija que esta feature no puede mover |
|---|---|
| `test/pet-reminders.e2e-spec.ts` · `describe('R7: create, dispatch y notifier dejan sent sin duplicar push'` y `describe('R8: PATCH reprograma e invalida el mensaje anterior'` | La cadena real con el `PET_REPOSITORY` de verdad inyectado (arranque de Nest) y un solo push por recordatorio |
| `src/workers/notifier/notifier-consumer.service.spec.ts` (los `body: 'Recordatorio: Desparasitación',`) | El consumidor reenvía el cuerpo sin mirarlo (C5) |
| `src/modules/pets/application/owner-local-day.spec.ts` y los dobles de `findOwnerTimezone` de `health`, `nutrition`, `activity` y `alerts-engine` | El puerto no cambia |
| `src/modules/reminders/infrastructure/reminders-scheduler.service.spec.ts` | Dobla el dispatcher entero (`{ dispatchOnce } as unknown as RemindersDispatchService`) |
| `add-reminder/index.test.tsx` · `describe('#61 R10: los controles táctiles declaran TOUCH_SLOP'` | `advance-chip-1440` sigue con `hitSlop={TOUCH_SLOP}` |
| `add-reminder/index.test.tsx` · `it('rejects a combined date-time that is not in the future'`, `it('renders all reminder types and selects vaccine by default'`, `describe('#123 R5: …'` | La validación de P4, los chips de tipo y los pickers no cambian |
| `src/__tests__/design-drift.test.ts` · `describe('C8: la UI no usa clases arbitrarias'` y `src/__tests__/consistency-classnames.test.ts` (fila `add-reminder`, `3`) | Nada de `<palabra>-[` en código nuevo (también en tests) y los `CONTINUOUS_CORNER` no cambian |

---

## Prueba de humo del humano (no delegable a IA) — R5

**Entorno** (el mismo con el que llegó el push del smoke de #123):

- Backend de **esta branch** (`pnpm -C backend-pet-tracker start:dev`) con
  `REMINDERS_ENABLED=true`, `NOTIFIER_ENABLED=true` y `PUSH_ENABLED=true` en su
  `.env`. El dispatcher y el notifier corren cada 60 s: un push debido llega
  en **menos de 3 minutos**.
- **Dev build de Android**, nunca Expo Go. No hace falta regenerarlo: cero
  cambios nativos; basta recargar el JS desde Metro.
- Teléfono con zona automática en **Ciudad de México** e idioma de la app
  **Español**, con la cuenta registrada desde el teléfono (su `timezone` es
  la del teléfono, P6). Una mascota seleccionada.
- Anotar la hora del teléfono, **H** (hh:mm). Si H + 10 min pasa de
  medianoche, hacerla otro día.

**Pasos:**

1. **Nuevo recordatorio**, sin tocar Fecha: los cuatro chips de Aviso se ven
   normales y «7 días antes» está seleccionado. (Igual que antes.)
2. **Fecha = hoy + 2 días**, hora por defecto (09:00). «7 días antes» y
   «3 días antes» se ven **atenuados**; «1 día antes» queda seleccionado.
   Tocar «7 días antes»: **no pasa nada**. Título `Smoke 125 A`, **Guardar**.
   Esperar 3 minutos: **no llega ningún push** de `Smoke 125 A`. (Antes: el
   push saltaba al guardar.)
3. **Nuevo recordatorio → Fecha = hoy + 10 días**: los cuatro chips normales,
   «7 días antes» seleccionado. No guardar; volver atrás.
4. **Nuevo recordatorio → Fecha = mañana, Hora = H + 3 min**. «7 días antes» y
   «3 días antes» atenuados, «1 día antes» seleccionado (su momento es hoy a
   H + 3). Título `Smoke 125 C`, **Guardar**. En menos de 5 minutos llega un
   push con título `Smoke 125 C` y cuerpo
   **`Recordatorio: Smoke 125 C · <día de mañana> de <mes de mañana> a las <H + 3, en 24 h>`**
   (por ejemplo, `Recordatorio: Smoke 125 C · 25 de septiembre a las 20:43`).
   La fecha es la de **mañana** (el vencimiento, no el aviso) y la hora es la
   que se eligió. Si la hora sale 6 h desplazada, la cuenta no tiene la zona
   de México: **parar y reportarlo** (no es un fallo de #125, pero invalida
   el paso).
5. **Nuevo recordatorio → Fecha = hoy, Hora = H − 1 h**: los cuatro chips
   atenuados. **Guardar** → «La fecha debe ser futura» y no se crea nada.
6. Borrar `Smoke 125 A` y `Smoke 125 C`.

- [ ] Prueba de humo de R5 superada por el humano (fecha: ____, dispositivo: ____)

---

## Cobertura de los criterios de aceptación de `feature_list.json` #125

| Criterio | Cubierto por |
|---|---|
| 1. Chip cuyo momento ya pasó: desactivado y no seleccionable; la selección pasa al mayor aviso aún futuro y se recalcula al cambiar fecha u hora | R3 (tabla, chip desactivado, secuencia), R4 (instante del cambio), R5 pasos 2, 4 y 5 |
| 2. Crear con menos de 7 días de margen no dispara un push inmediato por el aviso preseleccionado | R3 (filas 1, 3-6: se envía el mayor aviso aún futuro), R4 (Guardar recalcula con el instante del envío), R5 paso 2 |
| 3. El cuerpo del push dice cuándo vence (fecha y hora en la zona del owner), con tests en una zona de offset negativo | R1 (filas 1-3 en Ciudad de México, cruce de mes y de año), R2 (zona leída por mascota), R5 paso 4 |
| 4. Suites móvil y backend verdes medidas sin pipe; cero dependencias nuevas | [[tasks]] §Cierre (comandos sin pipe, `git diff --stat` sin `package.json`, `pnpm-lock.yaml` ni `bun.lock`) |
| 5. Gate humano: smoke en dev build de Android | R5 |

---

## Fuera de alcance (cada viñeta clasificada y con su premisa verificada)

**Delimitaciones — no son features, no se registran:**

- **Opción B** (omitir en el backend un aviso cuyo momento ya pasó, o
  rechazarlo en el `POST`). Descartada por el humano el 2026-09-24.
- **Editar el aviso de un recordatorio existente.** La app no tiene pantalla
  de edición (C9). El `PATCH` del backend acepta `advanceMinutes` sin mirar si
  el momento ya pasó; sin cliente que lo use, no se toca (sería B).
- **Recordatorios ya creados o ya enviados** con un aviso pasado (los del
  smoke de #123, por ejemplo): no se corrigen ni se reenvían.
- **El título del push** (`title: reminder.title`) y los pushes de alertas
  (`buildCopy` de `alerts-engine-consumer.service.ts`): no cambian.
- **Un reloj que refresque los chips con el formulario quieto.** Los chips se
  reevalúan en cada cambio de fecha u hora (R4) y Guardar recalcula (R4); un
  intervalo solo cambiaría lo que se **ve** en el minuto de la frontera.
- **Texto que explique por qué un chip está atenuado.** Sería copy nueva en
  dos idiomas; D8 lo deja en +0 claves.
- **Cambios en `docs/ui-guidelines.md`, `global.css`, `infra/`, migraciones o
  CI.**

**Deuda o limitación conocida que esta feature no ejecuta:**

- **Hora por destinatario.** El push va a todos los miembros activos con la
  hora en la zona del owner y sin rótulo de zona (C1). Un cuidador en otra
  zona ve la hora del owner. Resolverlo exige formatear por token en el
  notifier: otra feature, si el humano la quiere.
- **Idioma del push.** Español fijo, como todos los pushes del backend (C2).
  Llevar el idioma de la app al backend es columna nueva + sincronización
  desde Profile: otra feature, si el humano la quiere.
- **Feedback de pulsado de los chips** (C8 lo pide para todo tappable). Ni los
  chips de tipo ni los de aviso lo tienen hoy; es la deuda transversal ya
  anotada en `progress/history.md` («los tiles son `Pressable` pelados **sin
  feedback de pulsado**»). #125 no la introduce ni la amplía.

---

## Aprobación

- [x] Spec aprobada por humano (fecha: 2026-09-24 hora de México, vía Notion)

---

## Enmienda E1 — R6: la elección explícita del aviso se conserva al cambiar fecha u hora

> Escrita el 2026-09-25 sobre la spec aprobada (firma `699e90cf`), tras la
> revisión **aprobada** (`progress/review_reminder-advance-already-past.md`,
> commit `5134d165`, sobre la punta de Codex `97054568`), por su hallazgo H1
> (media) y H2 (baja), a petición del humano. No toca D1-D10, ni R1-R5, ni sus
> tests, ni la firma original. Añade **R6**, **solo tests**: la producción no
> cambia. Su casilla va **sin marcar**: el humano reabre el gate solo para
> esta enmienda.

### El hecho medido (H1 y H2 del reviewer)

El código de `97054568` es **correcto**. El hueco está en los tests que la
spec prescribió:

| Id | Mutación en `src/screens/add-reminder/index.tsx` | Qué rompe en producción | Estado |
|---|---|---|---|
| X10 | `setAdvanceMinutes(10080);` en el `onValueChange` del picker de fecha | cambiar la fecha tira la elección explícita y vuelve a «7 días antes» | **verde** 37/37 |
| X11 | lo mismo en el picker de fecha **y** en el de hora | cambiar fecha u hora tira la elección explícita | **verde** 37/37 |
| X1 | con todos los chips desactivados, marcar `10080` fijo en vez de la preferencia | con el formulario ya inválido, se ve marcado «7 días antes» aunque el usuario eligiera otro | **verde** 37/37 |

Por qué: en los pasos c y e del `it` de secuencia de R3, `1440` es a la vez
la elección del usuario **y** el mayor aviso activo, así que «conservar la
elección» (D6) y «resetear a 7 días y bajar al mayor activo» dan lo mismo. Y
en la fila 7 de R3 (todos desactivados) la preferencia es la de por defecto,
`10080`, así que «mantener la preferencia» y «marcar 10080 fijo» coinciden.

### Decisión: E1 añade **R6**, no reescribe R3

R3 está firmado, su secuencia es literal y sus pares rojo→verde están en
traceability. R6 asevera la misma propiedad de D6 en casos donde la elección
del usuario **no** coincide con el mayor aviso activo, en un `describe` propio.

### R6 — La elección explícita del aviso se conserva al cambiar fecha u hora

*(requisito de verificación sobre código ya correcto: su rojo es una
**mutación de producción** versionada en el commit rojo y revertida en el
verde, CHECKPOINTS.md C4 quinto punto; nunca una mutación del doble)*

**WHILE** el usuario eligió explícitamente un aviso en Nuevo recordatorio,
**WHEN** cambia la fecha o la hora,
**THE SYSTEM SHALL** seguir marcando esa elección mientras esté activa aunque
haya avisos mayores activos, **AND IF** todos los chips quedan desactivados,
**THE SYSTEM SHALL** seguir marcando esa elección (no un valor fijo).

- **Test**: `mobile-pet-tracker/src/screens/add-reminder/index.test.tsx`, un
  `describe` hijo **nuevo al final** del `describe` padre
  `describe('#125: avisos que ya pasaron en Nuevo recordatorio'` (mismo
  `beforeEach`/`afterEach`), después de
  `describe('#125 R4: los chips se evalúan con el instante del último cambio de fecha u hora y guardar recalcula con el del envío'`:
  `describe('#125 R6: la elección explícita del aviso se conserva al cambiar fecha u hora (Enmienda E1)'`
  con **dos** `it`. Reloj fijo en `new Date(2026, 8, 24, 8, 0)` (componentes
  locales), título `'Rabies'`, y los helpers de módulo que ya existen
  (`pickDate`, `pickTime`, `expectAdvanceChips`).

`it('con avisos mayores activos, cambiar fecha u hora conserva el aviso elegido')`:

| Paso | Acción | `expectAdvanceChips(…)` / aserción |
|---|---|---|
| a | `pickDate(new Date(2026, 9, 10, 12, 0))` | `[false, false, false, false], 10080` |
| b | pulsar `advance-chip-1440` | `[false, false, false, false], 1440` |
| c | `pickDate(new Date(2026, 9, 5, 12, 0))` | `[false, false, false, false], 1440` (7 días antes = 28 de septiembre a las 09:00, activo: la elección se conserva aunque 10080 esté activo) |
| d | `pickTime(10, 0)` | `[false, false, false, false], 1440` |
| e | Guardar | `mockCreateReminder` con `{ type: 'vaccine', title: 'Rabies', dueAt: new Date(2026, 9, 5, 10, 0).toISOString(), advanceMinutes: 1440 }` |

`it('con todos los chips desactivados sigue marcada la elección, no un valor fijo')`:

| Paso | Acción | `expectAdvanceChips(…)` / aserción |
|---|---|---|
| a | `pickDate(new Date(2026, 9, 10, 12, 0))` | `[false, false, false, false], 10080` |
| b | pulsar `advance-chip-1440` | `[false, false, false, false], 1440` |
| c | `pickDate(new Date(2026, 8, 24, 12, 0))` (hoy) | `[false, true, true, true], 0` (hoy a las 09:00: solo queda «Mismo día») |
| d | `pickTime(8, 0)` | `[true, true, true, true], 1440` (hoy a las 08:00 = ahora: todos pasados, D5) |
| e | Guardar | `add-reminder-error` `toHaveTextContent('La fecha debe ser futura')` y `mockCreateReminder` no llamado |

- **Rojo versionado**: X11 — en `src/screens/add-reminder/index.tsx`, añadir
  `setAdvanceMinutes(10080);` en el `onValueChange` de `testID="date-picker"`
  (después de `setDate(fromPickerValue(selectedDate));`) y en el de
  `testID="time-picker"` (después de `setTime(selectedTime);`). Pone rojos
  los **dos** `it` por aserción (el primero en el paso c; el segundo en el
  paso d, porque en su paso c «Mismo día» es a la vez la elección rebajada y
  el único activo); los 37 tests previos
  siguen verdes. El verde lo revierte:
  `git diff b10b7f1e -- mobile-pet-tracker/src/screens/add-reminder/index.tsx`
  vacío.
- **Mutaciones que deben dejarlo rojo** (sondas del reviewer, sin versionar):
  X10 (solo en el picker de fecha: primer `it`, paso c; segundo `it`, paso d);
  X1 (todos desactivados → `10080` fijo: segundo `it`, paso d); resetear solo
  en el picker de hora (primer `it`, paso d).
- **Recuentos**: `add-reminder/index.test.tsx` **37 → 39**; suite móvil
  **83 / 1503 → 83 / 1505**; backend, e2e, catálogo y `ui-copy-table.ts`
  **+0**. Ningún test existente cambia.

### Aprobación de la Enmienda E1

- [ ] Enmienda E1 aprobada por humano (fecha: ____) ← gate obligatorio antes de la ronda 2 de Codex

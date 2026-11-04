---
feature: "mobile-reminder-date-year"
status: draft        # draft | approved
tags: [mobile, ui, spec]
---

# Requisitos — [[mobile-reminder-date-year]] (#240)

> Notación EARS. Capa: móvil (`mobile-pet-tracker/`). El backend **no
> cambia**. Diseño, archivos y alternativas en [[design]]; plan TDD en
> [[tasks]]; trazabilidad en [[traceability]].

## Contexto

En Recordatorios, cada fila pinta su fecha con
`due.toLocaleDateString(locale, { day: 'numeric', month: 'short' })`, sin año.
Un recordatorio del año que viene se lee como uno de este año: «Rabia, 4 nov,
09:00 · en 365 días» es el 4 nov de 2027 y parece de hoy.

Diagnóstico del leader contra `dev` tras el smoke del 2026-11-04
(`progress/plan_arreglos-smoke-2026-11-04.md` §1, punto 2, texto literal):

> **«Desorden» en Recordatorios.** El orden es ascendente y correcto, pero la
> fila pinta la fecha sin año (`reminders/index.tsx`,
> `toLocaleDateString(locale, { day, month })`). «Rabia, 4 nov, 09:00 · en 365
> días» es el 4 nov de 2027 y parece la de hoy.

Respuesta literal del humano (mismo §1, tabla de respuestas):

| Pregunta | Respuesta literal | Lo que significa |
|---|---|---|
| «En Recordatorios, ¿cómo mostramos la fecha para que no parezca desordenada?» | «Año si no es este año» | «4 nov 2027, 09:00 · en 365 días». Las fechas del año en curso no cambian. |

Esta feature:

- añade el año a la fecha de la fila **solo** cuando su año local no es el año
  local de hoy, en Próximos y en Pasados;
- no cambia la hora, la cuenta «en N días», el estado «Enviado»/«Cancelado»,
  la sección, el orden, el copy ni el API;
- deja el «hasta» de las series como está, porque ya sigue esa regla (R4).

## Fuentes

- `progress/plan_arreglos-smoke-2026-11-04.md` §1 (punto 2 y tabla de
  respuestas) y §2 «240».
- `specs/mobile-routine-canvas-fidelity/requirements.md` (#178) **R6**: fija
  hoy `date = due.toLocaleDateString(locale, { day: 'numeric', month: 'short' })`
  y sus candados `'2 ene, 09:00'` y `'20 ene, 20:05'`. Esta spec lo enmienda
  (sección «Enmienda #240» de esa spec).
- `specs/mobile-ui-language/requirements.md` (#65) **R15**: el locale va
  explícito (`es-MX` / `en-US`). Esta spec **no** lo enmienda; solo fija el
  reloj de su candado (ver «Tabla de enmiendas»).
- `specs/mobile-reminders-recurrence/requirements.md` (#213) **R14**: el
  «hasta» de las series. No cambia (R4).
- `docs/ui-guidelines.md` regla 6: las fechas siguen al idioma elegido
  (`es-MX` / `en-US`), no al locale del sistema. La feature no la toca.
- Sin canvas: no hay artboard nuevo ni cambia ninguno (sin G1). El literal del
  ejemplo lo dio el humano.

## Evidencia (medida en la base `0f1ab26f`, `origin/dev`)

Cuentas de **ocurrencias** desde `mobile-pet-tracker/src/`:
`grep -oF -- "<literal>" <ruta> | wc -l`.

Producción, `screens/reminders/index.tsx`:

| Literal | Cuenta | Tras el cambio |
|---|---|---|
| `const date = due.toLocaleDateString(locale, { day: 'numeric', month: 'short' });` | 1 | 0 |
| `const time = due.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });` | 1 | 1 |
| `due.getFullYear() === new Date(now).getFullYear()` | 0 | 1 |
| `until.getFullYear() === new Date(now).getFullYear()` | 1 | 1 |
| `toLocaleDateString(` | 2 | 2 |
| `getFullYear()` | 2 | 4 |
| `year: 'numeric'` | 1 | 2 |
| `new Date(now)` | 4 | 5 |
| `getUTCFullYear` | 0 | 0 |
| `#240` | 0 | 0 |

Tests, `screens/reminders/index.test.tsx` (`grep -cF`):

| Literal | Cuenta en la base |
|---|---|
| `it('formatea la fecha y hora próxima y conserva sus días en text-13'` | 1 |
| `it('formatea la hora lejana y la meta inactiva con su estado (enmendado por #227 R13)'` | 1 |
| `'2 ene, 09:00'` | 1 |
| `'20 ene, 20:05'` | 1 |
| `'3 dic, 11:30'` | 1 |
| `describe('#65 R15: la fecha del recordatorio se formatea con el locale del idioma'` | 1 |
| `it('passes es-MX explicitly to the date formatter'` | 1 |
| `#240` | 0 |

Ningún test estático de `src/__tests__/` cuenta `toLocaleDateString`,
`getFullYear`, `year: 'numeric'` ni `new Date(now)` en la pantalla (medido con
`grep -lE "numeric|toLocale|getFullYear|DateTimeFormat" src/__tests__/*`: solo
sale `geofences-canvas-fidelity.test.ts`, que no lee Recordatorios). El
inventario `#228 R11` no cuenta ninguno de esos literales.

## Convenciones de esta spec

- Rutas relativas a `mobile-pet-tracker/src/` salvo que se diga otra cosa.
- Cada test nuevo empieza por `#240 R<n>`.
- **Términos.**
  - «año local» de una fecha es `fecha.getFullYear()` en la zona del
    dispositivo. Nunca `getUTCFullYear()`.
  - `now` es el estado `now` de la pantalla (`useState(Date.now)`, que se
    refresca al enfocar). «Hoy» es `new Date(now)`.
  - `due` es `new Date(reminder.dueAt)`, la variable que ya existe en
    `renderRow`.
  - «fila de fecha» es el `Text` `text-13 font-normal text-muted` con
    `t('reminders.dueAt', { date, time })`.
  - «sufijo» es el `Text` hermano que sigue: `t('reminders.dueInDays', { days })`
    o, si la fila está inactiva, `reminder-status-<id>` («Enviado» /
    «Cancelado»).
- **Zona y reloj.** jest ignora `process.env.TZ` (memoria del proyecto). La
  técnica es la que ya usa el fichero:
  - la zona se fija con `hostProcess.env.TZ = 'America/Mexico_City'` en
    `beforeEach` (las constantes `hostProcess` y `originalTimezone` ya existen
    al principio del fichero) y se restaura en `afterEach` con
    `if (originalTimezone === undefined) delete hostProcess.env.TZ; else hostProcess.env.TZ = originalTimezone;`;
  - el reloj se fija **dentro de cada caso**, antes del render, con
    `jest.useFakeTimers({ now: new Date('<ISO con Z>') })`; el `afterEach`
    llama a `jest.clearAllTimers(); jest.useRealTimers();`;
  - en esta spec los instantes van en ISO con `Z` a propósito: las filas de R3
    necesitan que el año UTC y el local difieran. Con `America/Mexico_City`
    (UTC−6 todo el año, sin horario de verano desde 2022) la hora local es la
    UTC menos 6.
- **Relojes de las tablas** (hora local de Ciudad de México):

  | Nombre | ISO | Local | Año UTC | Año local |
  |---|---|---|---|---|
  | `NOV` | `2026-11-04T15:00:00.000Z` | 4 nov 2026, 09:00 | 2026 | 2026 |
  | `DIC` | `2026-12-31T14:00:00.000Z` | 31 dic 2026, 08:00 | 2026 | 2026 |
  | `DIC_NOCHE` | `2027-01-01T02:00:00.000Z` | 31 dic 2026, 20:00 | 2027 | 2026 |
  | `ENE` | `2027-01-01T15:00:00.000Z` | 1 ene 2027, 09:00 | 2027 | 2027 |

  Las tablas cruzan el cambio de año (31 dic ↔ 1 ene) con reloj en diciembre
  y en enero, y cruzan mes (30 oct ↔ 4 nov, 3 dic ↔ 1 ene).
- **RNTL 14.** Todo `fireEvent`, `act` y render va con `await`. `within(x)` no
  incluye a `x`.
- **Literales.** Todos los literales esperados de esta spec se midieron con
  `node -e` en Node v20.20.2 con ICU 78.2 (el mismo que corre jest),
  `TZ=America/Mexico_City`. Los separadores son espacios U+0020: sin espacio
  duro, sin punto tras «nov» y sin «de». Codex no recalcula ni inventa
  literales: copia los de las tablas.
- Jest se corre por prefijo de ruta, sin paréntesis: `src/screens/reminders`.
- **Skills que Codex carga antes de tocar la pantalla** (nombres de nuestro
  catálogo; el leader los traduce a los de Codex en el handoff):
  `expo-overview` y `expo-native-ui`.

## Copy

**Sin copy nuevo.** No se añade, retira ni cambia ninguna clave de
`i18n/catalog.ts`. Se siguen usando, con su literal de hoy:

| Clave | es | en |
|---|---|---|
| `reminders.dueAt` | `{{date}}, {{time}}` | `{{date}}, {{time}}` |
| `reminders.dueInDays` | `· en {{days}} días` | `· in {{days}} days` |
| `reminders.untilDay` | ` · hasta el {{date}}` | ` · until {{date}}` |
| `reminders.untilMonth` | ` · hasta {{date}}` | ` · until {{date}}` |

`__tests__/ui-copy-table.ts` no cambia y el recuento de `SCREEN_FILES` no
cambia: `screens/reminders/index.tsx` ya figura y no gana ni pierde claves.

## Formato resultante por locale

Medido con `node -e` (ver Convenciones). `date` es la salida de
`toLocaleDateString`; la fila completa es `t('reminders.dueAt', { date, time })`.

| Caso | Opciones | es-MX | en-US |
|---|---|---|---|
| año local de `due` = año local de hoy | `{ day: 'numeric', month: 'short' }` | `4 nov` → `4 nov, 09:00` | `Nov 4` → `Nov 4, 09:00` |
| año local de `due` ≠ año local de hoy | `{ day: 'numeric', month: 'short', year: 'numeric' }` | `4 nov 2027` → `4 nov 2027, 09:00` | `Nov 4, 2027` → `Nov 4, 2027, 09:00` |

El ejemplo del humano, «4 nov 2027, 09:00 · en 365 días», es la fila 1 de la
tabla de R1. En inglés la fila lleva dos comas («Nov 4, 2027, 09:00»): una es
del formato de `en-US` y la otra de `reminders.dueAt`. Se acepta tal cual; no
hay copy nuevo para evitarla.

## Requisitos funcionales

Todas las tablas viven en un `describe('#240: año en la fecha de la fila')`
nuevo de `screens/reminders/index.test.tsx` (receta en [[tasks]] §T1). Cada
caso:

1. fija el reloj (`jest.useFakeTimers({ now: new Date(<reloj>) })`);
2. sirve una sola mascota dueña y un solo recordatorio
   `makeReminder({ id: 'r', dueAt, status, recurrence, recurrenceUntil })`
   (`recurrence` y `recurrenceUntil` a `null` salvo en R4);
3. pinta en el idioma de la columna (es con `RemindersWrapper`; en con un
   envoltorio igual pero `LanguageProvider initial="en"`);
4. si la sección es «pasados», `await expandPast()`;
5. busca `reminder-row-r` **dentro** de la lista de su sección
   (`reminders-upcoming-list` o `reminders-past-list`) y, dentro de la fila,
   el texto exacto de la columna «Fila de fecha» y el de la columna «Sufijo»
   con `getByText`.

### R1 — Año cuando la fecha es de otro año

- **R1**: WHEN el año local de `due` es distinto del año local de hoy THE
  SYSTEM SHALL pintar la fila de fecha con
  `toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' })`
  y la misma hora de hoy, en Próximos y en Pasados, AND THE SYSTEM SHALL dejar
  el sufijo y la sección como hoy.
  - Test: `screens/reminders/index.test.tsx::#240 R1: %s`
    (`it.each`, cuatro filas):

    | Caso (`%s`) | Idioma | Reloj | `dueAt` | `status` | Sección | Fila de fecha | Sufijo |
    |---|---|---|---|---|---|---|---|
    | `próximo del año que viene (ejemplo del humano)` | es | `NOV` | `2027-11-04T15:00:00.000Z` | `scheduled` | próximos | `4 nov 2027, 09:00` | `· en 365 días` |
    | `mañana 1 ene visto el 31 dic` | es | `DIC` | `2027-01-01T15:00:00.000Z` | `scheduled` | próximos | `1 ene 2027, 09:00` | `· en 1 días` |
    | `enviado de diciembre visto el 1 ene` | es | `ENE` | `2026-12-03T17:30:00.000Z` | `sent` | pasados | `3 dic 2026, 11:30` | `Enviado` |
    | `inglés, próximo del año que viene` | en | `NOV` | `2027-11-04T15:00:00.000Z` | `scheduled` | próximos | `Nov 4, 2027, 09:00` | `· in 365 days` |

  - Y los dos `it` enmendados de `#178 R6: fila del canvas` (ver «Tabla de
    enmiendas»).
  - **Nace rojo**: las cuatro filas y los dos `it` enmendados.

### R2 — Sin año cuando la fecha es de este año

- **R2**: WHEN el año local de `due` es igual al año local de hoy THE SYSTEM
  SHALL pintar la fila de fecha con exactamente
  `toLocaleDateString(locale, { day: 'numeric', month: 'short' })`, como hoy,
  en Próximos y en Pasados, AND THE SYSTEM SHALL dejar el sufijo y la sección
  como hoy.
  - Test: `screens/reminders/index.test.tsx::#240 R2: %s`
    (`it.each`, cuatro filas):

    | Caso (`%s`) | Idioma | Reloj | `dueAt` | `status` | Sección | Fila de fecha | Sufijo |
    |---|---|---|---|---|---|---|---|
    | `próximo de este año` | es | `NOV` | `2026-11-20T15:00:00.000Z` | `scheduled` | próximos | `20 nov, 09:00` | `· en 16 días` |
    | `hoy 1 ene por la noche visto el 1 ene` | es | `ENE` | `2027-01-02T02:00:00.000Z` | `scheduled` | próximos | `1 ene, 20:00` | `· en 0 días` |
    | `pasado programado de este año` | es | `NOV` | `2026-10-30T15:00:00.000Z` | `scheduled` | pasados | `30 oct, 09:00` | `· en -5 días` |
    | `inglés, próximo de este año` | en | `NOV` | `2026-11-20T15:00:00.000Z` | `scheduled` | próximos | `Nov 20, 09:00` | `· in 16 days` |

  - **Nace verde** (las cuatro filas): la base nunca pinta año. Es el candado
    que impide «año siempre».

### R3 — La comparación es en hora local y con el `now` de la pantalla

- **R3**: THE SYSTEM SHALL decidir R1 o R2 comparando
  `due.getFullYear()` con `new Date(now).getFullYear()` (año local de los dos,
  con el `now` de la pantalla), nunca con años UTC ni con un año fijo, AND THE
  SYSTEM SHALL dejar el sufijo y la sección como hoy.
  - Test: `screens/reminders/index.test.tsx::#240 R3: %s`
    (`it.each`, cinco filas):

    | Caso (`%s`) | Idioma | Reloj | `dueAt` | `status` | Sección | Fila de fecha | Sufijo |
    |---|---|---|---|---|---|---|---|
    | `31 dic 20:00 local, ya 2027 en UTC, visto el 31 dic` | es | `DIC` | `2027-01-01T02:00:00.000Z` | `scheduled` | próximos | `31 dic, 20:00` | `· en 0 días` |
    | `31 dic 22:00 local con reloj y fecha ya en 2027 UTC` | es | `DIC_NOCHE` | `2027-01-01T04:00:00.000Z` | `scheduled` | próximos | `31 dic, 22:00` | `· en 0 días` |
    | `31 dic 18:00 local, ya 2027 en UTC, visto el 1 ene` | es | `ENE` | `2027-01-01T00:00:00.000Z` | `scheduled` | pasados | `31 dic 2026, 18:00` | `· en -1 días` |
    | `inglés, 31 dic 20:00 local visto el 31 dic` | en | `DIC` | `2027-01-01T02:00:00.000Z` | `scheduled` | próximos | `Dec 31, 20:00` | `· in 0 days` |
    | `inglés, 31 dic 18:00 local visto el 1 ene` | en | `ENE` | `2027-01-01T00:00:00.000Z` | `scheduled` | pasados | `Dec 31, 2026, 18:00` | `· in -1 days` |

  - **Nace rojo**: filas 3 y 5. **Nace verde**: filas 1, 2 y 4 (la base no
    pinta año); existen para cazar las mutaciones de [[tasks]] §Sondas.

### R4 — El «hasta» de las series no cambia

- **R4**: WHILE una serie programada tiene `recurrenceUntil` THE SYSTEM SHALL
  seguir pintando su «hasta» como hoy: si el año local de `recurrenceUntil` es
  el año local de hoy, `t('reminders.untilDay', { date })` con
  `{ day: 'numeric', month: 'short' }`; si no,
  `t('reminders.untilMonth', { date })` con
  `Intl.DateTimeFormat(locale, { month: 'short', year: 'numeric' })`.
  - Decisión: ver «Decisiones» §1.
  - Test: `screens/reminders/index.test.tsx::#240 R4: %s`
    (`it.each`, cinco filas). Todas con
    `dueAt: '2027-01-15T15:00:00.000Z'`, `status: 'scheduled'`,
    `recurrence: { unit: 'month', every: 1 }`, sección próximos. La aserción es
    `within(within(row).getByTestId('reminder-repeats-r')).getByText(<línea>)`:

    | Caso (`%s`) | Idioma | Reloj | `recurrenceUntil` | Línea |
    |---|---|---|---|---|
    | `hasta este año visto el 1 ene` | es | `ENE` | `2027-01-31` | `Se repite cada mes · hasta el 31 ene` |
    | `hasta otro año visto el 1 ene` | es | `ENE` | `2028-02-10` | `Se repite cada mes · hasta feb 2028` |
    | `hasta enero visto el 31 dic local con 2027 en UTC` | es | `DIC_NOCHE` | `2027-01-31` | `Se repite cada mes · hasta ene 2027` |
    | `inglés, hasta este año visto el 1 ene` | en | `ENE` | `2027-01-31` | `Repeats every month · until Jan 31` |
    | `inglés, hasta otro año visto el 1 ene` | en | `ENE` | `2028-02-10` | `Repeats every month · until Feb 2028` |

  - **Nace verde** (las cinco filas): candado del comportamiento de #213 R14
    con reloj de enero, que el `it.each` de #213 R14 (solo reloj de diciembre)
    no tiene.

### R5 — La llamada al formateador

- **R5**: THE SYSTEM SHALL formatear la fecha de la fila con una sola llamada
  a `Date.prototype.toLocaleDateString` sobre `due`, con el locale del idioma
  explícito (`es-MX` / `en-US`, #65 R15) y con un objeto de opciones que es
  exactamente `{ day: 'numeric', month: 'short' }` (R2) o exactamente
  `{ day: 'numeric', month: 'short', year: 'numeric' }` (R1).
  - Test nuevo: `screens/reminders/index.test.tsx::#240 R5: pasa es-MX y el año a toLocaleDateString para una fecha de otro año`.
    Reloj `NOV`, un recordatorio `dueAt: '2027-11-04T15:00:00.000Z'`, espía
    `jest.spyOn(Date.prototype, 'toLocaleDateString')` creado antes del render
    y restaurado en `finally`;
    `expect(spy).toHaveBeenCalledWith('es-MX', { day: 'numeric', month: 'short', year: 'numeric' })`.
    **Nace rojo.**
  - Test enmendado: `screens/reminders/index.test.tsx::passes es-MX explicitly to the date formatter (enmendado por #240 R5)`
    (ver «Tabla de enmiendas»). **Nace verde.**

## Tabla de enmiendas

Medida contra `0f1ab26f`. Los `it` se citan por contenido, sin número de
línea. Sufijo de título, al final y detrás de los sufijos que ya tenga:
` (enmendado por #240 R1)` en los dos `it` de `#178 R6` (cambian por el año de
R1) y ` (enmendado por #240 R5)` en el de `#65 R15` (candado de la llamada,
R5). Nada más cambia en cada `it`.

| `describe` | `it` (localizador, `grep -cF` = 1) | Cambio | Antes del verde |
|---|---|---|---|
| `#178 R6: fila del canvas` | `formatea la fecha y hora próxima y conserva sus días en text-13` | `'2 ene, 09:00'` pasa a `'2 ene 2027, 09:00'` (reloj `2026-12-30T15:00:00.000Z`, fixture `a` = 2 ene 2027) | rojo |
| `#178 R6: fila del canvas` | `formatea la hora lejana y la meta inactiva con su estado (enmendado por #227 R13)` | `'20 ene, 20:05'` pasa a `'20 ene 2027, 20:05'`; `'3 dic, 11:30'` **no** cambia (fixture `c` es de 2026) | rojo |
| `#65 R15: la fecha del recordatorio se formatea con el locale del idioma` | `passes es-MX explicitly to the date formatter` | El `beforeEach` del `describe` empieza por `jest.useFakeTimers({ now: new Date(2026, 7, 24, 9, 0) });` y el `describe` gana `afterEach(() => { jest.clearAllTimers(); jest.useRealTimers(); });`. La aserción no cambia. | verde |

Por qué se fija el reloj de `#65 R15`: el `it` usa el reloj real y
`makeReminder()` pone `dueAt` a `Date.now() + 3` días. Con R1, si la suite
corre del 29 al 31 de diciembre la fecha cae en el año siguiente, la llamada
lleva `year` y la aserción
`toHaveBeenCalledWith('es-MX', { day: 'numeric', month: 'short' })` se pone
roja según el día. El reloj fijo la quita de esa lotería.

Tras las enmiendas, en `screens/reminders/index.test.tsx`:
`grep -cF -- "(enmendado por #240 R1)"` = 2 y
`grep -cF -- "(enmendado por #240 R5)"` = 1.

Candados que **no** cambian, medidos:

- `R6: lista con pills, badges y refetch on focus` → `renders summaries and reminder rows by section …`:
  calcula su fecha con `{ day: 'numeric', month: 'short' }` sobre un `dueAt`
  del 27 ago 2026 con reloj `2026-08-24T09:00:00.000Z`. Mismo año: sigue verde.
- `#178 R6` → `'3 dic, 11:30'` (fixture `c`, 2026, reloj de 2026).
- `#213 R14` → `la fila recurrente dice «%s»`: solo mira la línea
  `reminder-repeats-series`, que no cambia.
- `#213 R16`, `#227: próximos y pasados` y
  `Acciones de deslizar en Recordatorios (#228 R2 a R9)`: no asertan el texto
  de la fecha.

### Specs enmendadas

- `specs/mobile-routine-canvas-fidelity/requirements.md` (#178), **R6**: la
  línea `date = due.toLocaleDateString(locale, { day: 'numeric', month: 'short' })`
  y los candados `'2 ene, 09:00'` y `'20 ene, 20:05'`. Lleva la sección
  `## Enmienda #240 — Año en la fecha de Recordatorios` con su casilla.
- `specs/mobile-ui-language/requirements.md` (#65) **R15** no se enmienda: su
  texto (locale explícito) se cumple igual. Solo su candado gana reloj fijo.

## Paso de smoke nuevo (G2)

El leader lo añade a `progress/smoke_arreglos-smoke.md` al mergear, bajo
`## #240 mobile-reminder-date-year`. Reproduce la fila del hallazgo.

1. En el dev build de Android, en español y con el reloj del teléfono en la
   fecha real, crea con Nuevo recordatorio, para una mascota de la que eres
   dueño:
   - uno para **dentro de un año exacto** a las 09:00 (p. ej. hoy 4 nov 2026 →
     4 nov 2027);
   - uno para **este año**, dentro de unos días;
   - uno **en serie** («cada mes») con fin («hasta») en este año, y otro con
     fin en el año siguiente.
2. Abre Recordatorios. En «PRÓXIMOS»:
   - el del año que viene dice «4 nov 2027, 09:00 · en 365 días» (con su fecha
     real), con año;
   - el de este año, sin año (p. ej. «20 nov, 09:00 · en 16 días»);
   - las series dicen «· hasta el <día> <mes>» (este año) y
     «· hasta <mes> <año>» (otro año), como antes.
3. Un recordatorio **pasado del año anterior**: si la cuenta no tiene ninguno,
   se acepta comprobarlo en el paso 5. Si lo tiene, toca «PASADOS»: su fila
   lleva año (p. ej. «3 dic 2025, 11:30 Enviado»). Los pasados de este año,
   sin año.
4. Cambia el idioma a inglés en Perfil y vuelve: el del año que viene dice
   «Nov 4, 2027, 09:00 · in 365 days»; el de este año, «Nov 20, 09:00 · in 16
   days».
5. Si no hubo pasado del año anterior en el paso 3: pon el reloj del teléfono
   en el 1 ene del año siguiente (sin hora automática), vuelve a Recordatorios
   y abre «PASADOS»: los recordatorios ya vencidos del año anterior llevan año.
   Vuelve a poner la hora automática.
6. El formato en el teléfono es el de Hermes, no el de Node. Si sale distinto
   de los literales de arriba (p. ej. «4 nov. 2027»), anótalo tal cual en
   `progress/smoke_arreglos-smoke.md`: es aceptable si lleva el año solo
   donde toca.
7. Repite 2 y 4 en tema claro y oscuro.

## Fuera de alcance

- El formato del «hasta» de las series (R4 lo deja como está).
- Otras pantallas con fecha, que el hallazgo no nombra:
  - Inicio (`screens/home/index.tsx`): sus filas de recordatorio
    (`reminders-item-<id>-date`) usan `fmtDate` de `screens/home/format.ts`,
    que ya lleva siempre `year: 'numeric'`;
  - la vista previa de Nuevo recordatorio (`screens/add-reminder/index.tsx`,
    `notifyAt` con `{ day: 'numeric', month: 'short' }`);
  - `utils/pet-members.ts`;
  - el registro de peso (`screens/home/format.ts`, `fmtDayMonth`);
  - Perfil (`screens/profile/index.tsx`), que ya aplica la misma regla.
- Un helper compartido de «año si no es este año» entre Recordatorios y Perfil
  (ver [[design]] §Alternativas descartadas).
- El plural de «1 días» / «1 days» (`reminders.dueInDays`): es copy de hoy y
  esta feature no cambia copy.
- La doble coma de la fila en inglés («Nov 4, 2027, 09:00»).
- La franja rosa de Pasados (#239), aunque toca el mismo fichero.
- El orden y las secciones, que no cambian (los fijan #227 R2 y R3).
- Backend, API y `docs/ui-guidelines.md` (sin G4).
- El smoke en dispositivo (G2), que corre el humano.

## Decisiones

1. **El «hasta» no cambia (R4).** Ya sigue la regla del humano:
   - compara `until.getFullYear()` con `new Date(now).getFullYear()`, la misma
     comparación local que R3;
   - en el año en curso dice «hasta el 31 ene» / «until Jan 31», sin año;
   - en otro año dice «hasta feb 2028» / «until Feb 2028», con año.

   Le falta el día cuando es de otro año, pero eso lo firmó #213 R14 y el
   humano no lo pidió. Cambiarlo a «hasta el 10 feb 2028» tocaría
   `reminders.untilMonth`, que es copy, y su candado de #213. R4 solo añade el
   candado con reloj de enero que #213 no tenía.
2. **Ternaria en línea, sin helper.** Es la misma forma que ya usan el «hasta»
   de la propia fila y `screens/profile/index.tsx`. Un helper compartido
   tocaría Perfil, que está fuera del hallazgo.
3. **Se mantiene `toLocaleDateString`.** No se cambia a `Intl.DateTimeFormat`,
   porque el candado de #65 R15 espía `Date.prototype.toLocaleDateString`.
   R5 lo fija para las dos ramas.
4. **Dos objetos de opciones literales, no `year: undefined`.** Así la rama de
   este año pasa exactamente el objeto de hoy, y la intención se lee sin
   conocer cómo trata `Intl` un `undefined`.
5. **Literales de Node, no de Hermes.** Jest corre en Node (ICU 78.2). El
   teléfono puede formatear distinto; lo comprueba G2 (paso 6).

No queda ninguna decisión abierta.

## Aprobación

- [ ] Aprobado por humano (fecha: ____) ← gate obligatorio antes de implementar
  (firma delegada del leader con la checklist de
  `progress/plan_canvas-parity-2026-10-23.md` §4, los tres puntos del §4 de
  `progress/plan_ui-2026-10-26.md` y los dos de
  `progress/plan_mejoras-smoke-2026-11-03.md` §4; mandato del humano
  2026-10-23, ampliado 2026-11-04)
- [ ] **G2**: smoke en el dev build de Android (pasos de «Paso de smoke
  nuevo», tema claro y oscuro) (fecha: ____) ← gate humano, por lote al final;
  lo registra `progress/smoke_arreglos-smoke.md`
- Base congelada: `0f1ab26f` (`origin/dev`).

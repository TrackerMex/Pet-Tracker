---
feature: "mobile-reminders-upcoming-past"
status: draft        # draft | approved
tags: [mobile, ui, spec]
---

# Requisitos — [[mobile-reminders-upcoming-past]] (#227)

> Notación EARS. Capa: móvil (`mobile-pet-tracker/`). El backend **no
> cambia**. Diseño, archivos y alternativas en [[design]]; plan TDD en
> [[tasks]]; trazabilidad en [[traceability]].

## Contexto

Recordatorios pinta hoy una sola lista en el orden en que llega del API
(`dueAt` ascendente). Las filas `sent` y `cancelled` salen atenuadas, pero
mezcladas con las que siguen pendientes: lo ya pasado ocupa la parte de arriba
y empuja hacia abajo lo que viene.

Hallazgo del smoke G2, en palabras del plan
(`progress/plan_mejoras-smoke-2026-11-03.md` §2 «227»):

> Captura del humano (2026-11-03): arriba salen los pasados atenuados
> («Enviado», «Cancelado») y debajo los próximos; el resumen dice «3
> Inactivos», que son justo los que irían a «Pasados».

Decisión del humano (cuestionario de opción cerrada, plan §1, respuesta
literal): **«Próximos + Pasados colapsado (Recommended)»**. El plan la concreta
así: «"Próximos" arriba (no cancelados con `dueAt` de hoy en adelante,
ascendente) y una sección "Pasados" colapsada al final, con el mismo patrón que
Alertas atendidas (#223).»

Esta feature:

- parte la lista en **Próximos** (arriba, ascendente) y **Pasados** (al final,
  colapsada por defecto, con contador, de la más reciente a la más antigua y
  con filas al 50 % de opacidad);
- pinta la caja «Nada pendiente por ahora» en lugar de la lista de Próximos
  cuando no queda ninguno;
- conserva Eliminar y Cancelar serie en su fila, en las dos secciones.

## Fuentes

- **Canvas congelado** en `specs/mobile-reminders-upcoming-past/canvas/`.
  Son artboards del canvas v167, aprobados en G1 el 2026-11-03 (plan §5,
  casilla G1: «Si apruebo G1»).
  - `RecordatoriosProximosPasados.dc.html`: sha256 empieza por `058489eb`
    (Próximos y Pasados colapsada).
  - `RecordatoriosPasadosExpandida.dc.html`: `b65c69fa`.
  - `RecordatoriosSinProximos.dc.html`: `63721912`.
  - `Recordatorios.dc.html`: `82b3b70e`. Es la pantalla previa, solo como
    referencia; ningún requisito la cita.
- `progress/plan_mejoras-smoke-2026-11-03.md` §1, §2 «227», §4 (checklist) y
  §5 (gates).
- `progress/plan_canvas-parity-2026-10-23.md` §4 y `progress/plan_ui-2026-10-26.md`
  §4 (checklist de firma).
- `docs/ui-guidelines.md` (rige toda la UI móvil) y `docs/conventions.md`.
- Patrón de referencia, que se copia sin importarlo: `screens/alerts/index.tsx`
  de #223, ya en `dev` (ver [[design]] §D9).

## Evidencia (medida en la base `230f1c9f`, `origin/dev`)

Todas las cuentas se miden con `grep -cF -- "<literal>" <ruta>` desde
`mobile-pet-tracker/src/`. Las del canvas se miden desde
`specs/mobile-reminders-upcoming-past/canvas/`.

Producción antes del cambio, `screens/reminders/index.tsx`:

| Literal | Cuenta | Tras el cambio |
|---|---|---|
| `{reminders.data.reminders.map((reminder, i) => {` | 1 | 0 |
| `${inactive ? ' opacity-50' : ''}` | 1 | 0 |
| `${past ? ' opacity-50' : ''}` | 0 | 1 |
| `import { Plus, Repeat, Trash } from 'reicon-react-native';` | 1 | 0 |
| `import { ScrollView, Text, View } from 'react-native';` | 1 | 0 |
| `import { MOTION_REMINDERS_STAGGER_MS } from '../../theme/motion';` | 1 | 0 |
| `import { daysUntil } from '../../utils/reminder-dates';` | 1 | 0 |
| `<EmptyState` | 2 | 2 |
| `touch-target` | 0 | 1 |
| `style={CONTINUOUS_CORNER}` | 5 | 6 |
| `style={TABULAR_NUMS}` | 3 | 4 |
| `rounded-22` | 1 | 2 |
| `t('` | 46 | 50 |
| `className="gap-3"` | 2 | 4 |
| `tracking-caps` | 0 | 2 |
| `text-15` | 0 | 1 |
| `bg-default` | 1 | 4 |
| `hitSlop={TOUCH_SLOP}` | 0 | 1 |
| `delayMs={i * MOTION_REMINDERS_STAGGER_MS}` | 1 | 1 |
| `delayMs={index * MOTION_REMINDERS_PAST_STAGGER_MS}` | 0 | 1 |
| `splitReminders(` | 0 | 1 |

Otros ficheros:

| Ruta | Literal | Cuenta |
|---|---|---|
| `theme/motion.ts` | `export const MOTION_REMINDERS_STAGGER_MS = 70;` | 1 |
| `screens/home/format.ts` | `export function upcomingReminders` | 1 |
| `screens/home/format.ts` | `.slice(0, 3)` | 1 |
| `i18n/catalog.ts` | `'reminders.errorCancelForbidden': 'Only the owner can cancel the series',` | 1 |
| `i18n/catalog.ts` | `'reminders.errorCancelForbidden': 'Solo el dueño puede cancelar la serie',` | 1 |
| `screens/reminders/index.test.tsx` | `dueAt: '2026-08-27T09:00:00.000Z',` | 1 |
| `screens/reminders/index.test.tsx` | `    Trash: mockIcon('reminders-icon-trash'),` | 1 |
| `__tests__/ui-copy-table.ts` | `export const R8_REMINDERS: UseRow[] = [` | 1 |
| `../../specs/mobile-ui-language/design.md` | `### §2.39 — Añadidos por #225 — Orbit renombrado y su pose de actividad` | 1 |
| `../../specs/mobile-ui-language/design.md` | `### §2.40` | 0 |

Canvas. Columnas: ProximosPasados / PasadosExpandida / SinProximos.

| Literal | PP | Exp | SinP |
|---|---|---|---|
| `.sec{margin: 4px 0 0; font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: .06em; color: var(--muted)}` | 1 | 1 | 1 |
| `.tog{margin: 4px 0 0; padding: 0; border: 0; background: none; color: inherit; font: inherit; width: 100%; height: 40px; flex: none; display: flex; align-items: center; gap: 8px; text-align: left}` | 1 | 1 | 1 |
| `.cnt{padding: 2px 8px; border-radius: 999px; background: var(--default); color: var(--muted); font-size: 12px; font-weight: 800}` | 1 | 1 | 1 |
| `.chev{width: 32px; height: 32px; border-radius: 50%; background: var(--default); color: var(--muted); display: flex; align-items: center; justify-content: center}` | 1 | 1 | 1 |
| `.past{opacity: .5}` | 0 | 1 | 0 |
| `border-radius: 22px; background: var(--default); padding: 20px 16px; display: flex; flex-direction: column; align-items: center; gap: 4px; text-align: center` | 0 | 0 | 1 |
| `<span style="font-size: 15px; font-weight: 800">Nada pendiente por ahora</span>` | 0 | 0 | 1 |
| `<span style="font-size: 13px; color: var(--muted)">Los recordatorios nuevos aparecerán aquí.</span>` | 0 | 0 | 1 |
| `<article class="card" style="animation-delay: 70ms">` | 1 | 0 | 0 |
| `<article class="card" style="animation-delay: 140ms">` | 1 | 0 | 0 |
| `<article class="card past">` | 0 | 1 | 0 |
| `<article class="card past" style="animation-delay: 30ms">` | 0 | 1 | 0 |
| `<article class="card past" style="animation-delay: 60ms">` | 0 | 1 | 0 |
| `aria-expanded="false"` | 1 | 0 | 1 |
| `aria-expanded="true"` | 0 | 1 | 0 |
| `class="cnt">3<` | 1 | 1 | 1 |
| `>Próximos<` | 1 | 1 | 1 |
| `>Pasados<` | 1 | 1 | 1 |
| `¡Próximo!` | 1 | 1 | 0 |

El badge «¡Próximo!» del canvas **no** se adopta. Voz B no admite `¡` ni `!`,
y la fila de hoy conserva el badge «Hoy» (`reminders.upcoming`) que ya tiene
(ver [[design]] §D7).

## Convenciones de esta spec

- Rutas relativas a `mobile-pet-tracker/src/` salvo que se diga otra cosa.
- Cada test nuevo empieza por `#227 R<n>`.
- **Copy literal.** R1 fija los literales en es y en. Codex no inventa copy.
  El español es el del canvas aprobado en G1. **El inglés no viene del
  canvas**: lo fija esta spec como traducción directa en Voz B.
- **Términos.**
  - «próximo» es un recordatorio con `status !== 'cancelled'` y
    `daysUntil(now, new Date(dueAt)) >= 0`, es decir, de hoy en adelante por
    día civil local.
  - «pasado» es cualquier otro.
  - `now` es el estado `now` de la pantalla (`useState(Date.now)`, que se
    refresca al enfocar).
- **Relojes.** Todo `describe` nuevo fija el reloj con
  `jest.useFakeTimers({ now: new Date(<año>, <mes>, <día>, <h>, <min>) })` en
  `beforeEach`, y en `afterEach` llama a `jest.clearAllTimers();
  jest.useRealTimers();`. Las fechas de los fixtures se construyen en hora
  local (`new Date(y, m, d, h, min).toISOString()`), así que la prueba no
  depende de `TZ`.
- **Tablas de fechas.** Las tablas de fechas cruzan mes y año (fila 31 dic ↔
  1 ene y fila 30 sep ↔ 1 oct).
- **RNTL 14.** Todo `fireEvent`, `act` y render va con `await`. `within(x)`
  no incluye a `x`.
- **Iconos doblados.** El doble de `reicon-react-native` de
  `screens/reminders/index.test.tsx` pinta un `View` con el `testID` del doble,
  pero `props.testID` lo pisa. Por eso el chevron de producción **no** lleva
  `testID`, y los tests lo buscan por el `testID` del doble dentro de
  `reminders-past-toggle`.
- Jest se corre por prefijo de ruta, sin paréntesis: `src/screens/reminders`,
  `src/utils`, `src/theme`, `src/__tests__`, `src/providers`.
- **Skills que Codex carga antes de tocar UI** (nombres de nuestro catálogo;
  el leader los traduce a los de Codex en el handoff):
  `appllama-app-design-skill`, `expo-design-system`, `expo-native-ui` y
  `expo-animation`.

## Copy nuevo (es / en)

Cuatro claves nuevas en `i18n/catalog.ts`. Van en `en` y en `es` (que está
tipado `Record<TranslationKey, string>`), justo después de la línea
`'reminders.errorCancelForbidden': …` de cada idioma, en este orden:

| Clave | es | en |
|---|---|---|
| `reminders.sectionUpcoming` | `Próximos` | `Upcoming` |
| `reminders.sectionPast` | `Pasados` | `Past` |
| `reminders.upcomingEmptyTitle` | `Nada pendiente por ahora` | `Nothing pending for now` |
| `reminders.upcomingEmptyBody` | `Los recordatorios nuevos aparecerán aquí.` | `New reminders will show up here.` |

Claves **existentes que se reutilizan sin cambio**:

- `reminders.upcoming` (badge «Hoy» / `Today`), `reminders.sent`,
  `reminders.cancelled` y `reminders.dueInDays`;
- `reminders.dueAt`, `reminders.delete`, `reminders.cancelSeries` y
  `reminders.cancelSeriesA11y`;
- las tres píldoras: `reminders.active`, `reminders.thisWeek` y
  `reminders.inactive`.

## Requisitos funcionales

### Copy

- **R1**: THE SYSTEM SHALL declarar las cuatro claves de «Copy nuevo» con sus
  literales exactos en `es` y en `en`, y invocar cada una desde exactamente un
  `t('<clave>'` de `screens/reminders/index.tsx`. También SHALL registrar:
  - una fila por clave en `R8_REMINDERS` de `__tests__/ui-copy-table.ts`, de
    la forma
    `{ file: 'src/screens/reminders/index.tsx', key: '<clave>' }, // #227 R1`,
    añadida al final del arreglo;
  - una sección nueva al final de `specs/mobile-ui-language/design.md` con
    esta cabecera y estas filas exactas:

    ```text
    ### §2.40 — Añadidos por #227 — Recordatorios próximos y pasados

    | Diseño | Clave | en | es | Cambio |
    |---|---|---|---|---|
    | — | `reminders.sectionUpcoming` | `Upcoming` | `Próximos` | ← añadida por #227 (R1) |
    | — | `reminders.sectionPast` | `Past` | `Pasados` | ← añadida por #227 (R1) |
    | — | `reminders.upcomingEmptyTitle` | `Nothing pending for now` | `Nada pendiente por ahora` | ← añadida por #227 (R1) |
    | — | `reminders.upcomingEmptyBody` | `New reminders will show up here.` | `Los recordatorios nuevos aparecerán aquí.` | ← añadida por #227 (R1) |
    ```
  - Test: `__tests__/reminders-upcoming-past-canvas-fidelity.test.ts::#227 R1: las cuatro claves existen en es y en con su literal, una invocación cada una y su fila en §2.40`.
    - Lee `es` y `en` de `../i18n/catalog` y los compara contra **literales
      escritos en el test**, no contra el símbolo de producción.
    - Cuenta `source.split("t('<clave>'").length - 1` igual a 1 por clave.
    - Aserta que `R8_REMINDERS` (importado de `./ui-copy-table`) contiene
      `{ file: 'src/screens/reminders/index.tsx', key: '<clave>' }` por clave.
    - Recorta de `design.md` el texto desde `### §2.40 — Añadidos por #227` hasta
      el siguiente `\n### ` (o el final) y aserta que contiene cada una de las
      cuatro filas con `toContain`.

### Partición y orden

- **R2**: WHEN `splitReminders(reminders, now)` (nuevo, en
  `utils/reminder-dates.ts`) recibe una lista, THE SYSTEM SHALL poner en
  `upcoming` cada recordatorio con `status !== 'cancelled'` y
  `daysUntil(now, new Date(dueAt)) >= 0`, y en `past` todos los demás, sin
  perder ni duplicar ninguno.
  - Test: `utils/reminder-dates.test.ts::#227 R2: %s` (`it.each` sobre la tabla
    de abajo). Cada caso llama a `splitReminders([r], now)` y aserta
    `upcoming.map(id)` y `past.map(id)` exactos (uno vacío y el otro
    `[r.id]`).

  | # | Nombre del caso (`%s`) | `now` | Recordatorio | Sección |
  |---|---|---|---|---|
  | 1 | `programado hoy más tarde es próximo` | `new Date(2026, 11, 30, 8, 0)` | `scheduled`, `new Date(2026, 11, 30, 23, 0)` | upcoming |
  | 2 | `programado hoy más temprano sigue siendo próximo` | `new Date(2026, 11, 30, 10, 0)` | `scheduled`, `new Date(2026, 11, 30, 7, 0)` | upcoming |
  | 3 | `programado ayer es pasado` | `new Date(2026, 11, 30, 8, 0)` | `scheduled`, `new Date(2026, 11, 29, 9, 0)` | past |
  | 4 | `el 31 de diciembre es pasado el 1 de enero` | `new Date(2027, 0, 1, 8, 0)` | `scheduled`, `new Date(2026, 11, 31, 23, 0)` | past |
  | 5 | `el 1 de enero es próximo el 31 de diciembre` | `new Date(2026, 11, 31, 22, 0)` | `scheduled`, `new Date(2027, 0, 1, 0, 30)` | upcoming |
  | 6 | `enviado el 30 de septiembre es pasado el 1 de octubre` | `new Date(2026, 9, 1, 8, 0)` | `sent`, `new Date(2026, 8, 30, 20, 0)` | past |
  | 7 | `cancelado mañana es pasado` | `new Date(2026, 11, 30, 8, 0)` | `cancelled`, `new Date(2026, 11, 31, 9, 0)` | past |
  | 8 | `cancelado hoy es pasado` | `new Date(2026, 11, 30, 8, 0)` | `cancelled`, `new Date(2026, 11, 30, 23, 0)` | past |
  | 9 | `enviado con fecha de mañana es próximo` | `new Date(2026, 11, 30, 8, 0)` | `sent`, `new Date(2026, 11, 31, 9, 0)` | upcoming |

  El test construye cada recordatorio con un ayudante local del fichero,
  `reminder(id, status, due: Date): Reminder`, que rellena todos los campos de
  `Reminder` (`petId: 'pet-1'`, `type: 'vaccine'`, `title: id`,
  `dueAt: due.toISOString()`, `advanceMinutes: 0`, `recurrence: null`,
  `recurrenceUntil: null`).

- **R3**: WHEN `splitReminders` devuelve sus dos listas, THE SYSTEM SHALL
  ordenar `upcoming` por `Date.parse(dueAt)` ascendente y `past` por
  `Date.parse(dueAt)` descendente. Los empates se resuelven en los dos casos
  por `id` ascendente (`a.id.localeCompare(b.id)`), y la función SHALL NOT
  mutar el arreglo recibido.
  - Test: `utils/reminder-dates.test.ts::#227 R3: ordena próximos ascendente y pasados descendente, con empate por id`.
  - `now = new Date(2026, 11, 30, 8, 0)`.
  - Entrada, en este orden: `p-c`, `u-b`, `p-a`, `u-c`, `p-b`, `u-a2`, `p-0`,
    `u-a`. Las fechas son:
    - `u-a`: `scheduled`, `new Date(2026, 11, 30, 23, 0)`.
    - `u-c`: `sent`, `new Date(2027, 0, 1, 0, 30)`.
    - `u-a2` y `u-b`: `scheduled`, `new Date(2027, 0, 2, 9, 0)`, empatados.
    - `p-b`: `cancelled`, `new Date(2027, 0, 21, 9, 0)`.
    - `p-0` y `p-c`: `scheduled`, `new Date(2026, 11, 29, 9, 0)`, empatados.
    - `p-a`: `sent`, `new Date(2026, 11, 3, 9, 0)`.
  - Aserta `upcoming.map(id)` = `['u-a', 'u-c', 'u-a2', 'u-b']` y
    `past.map(id)` = `['p-b', 'p-0', 'p-c', 'p-a']`.
  - Aserta que la entrada conserva su orden original, comparando contra una
    copia (`[...input]`) tomada antes de la llamada.

### Pantalla

Fixture común de los `it` de pantalla de R4 a R7, R10 y R12: el `describe`
nuevo `#227: próximos y pasados` de `screens/reminders/index.test.tsx`.

- Reloj: `jest.useFakeTimers({ now: new Date(2026, 11, 31, 8, 0) })`.
- La mascota es `makePet()` (rol `owner`).
- `listReminders` devuelve estos seis, **en este orden**, que es el ascendente
  del backend:

| id | `status` | `dueAt` | Otros | Sección esperada |
|---|---|---|---|---|
| `oldsent` | `sent` | `new Date(2026, 10, 30, 9, 0)` | — | Pasados |
| `yesterday` | `scheduled` | `new Date(2026, 11, 30, 9, 0)` | `recurrence: { unit: 'month', every: 1 }` | Pasados |
| `today` | `scheduled` | `new Date(2026, 11, 31, 20, 0)` | — | Próximos |
| `newyear` | `scheduled` | `new Date(2027, 0, 1, 0, 30)` | — | Próximos |
| `cancelled` | `cancelled` | `new Date(2027, 0, 5, 9, 0)` | — | Pasados |
| `later` | `sent` | `new Date(2027, 0, 10, 9, 0)` | — | Próximos |

Próximos esperado: `today`, `newyear`, `later`. Pasados esperado:
`cancelled`, `yesterday`, `oldsent`.

Ayudante del fichero de test:
`async function expandPast() { await fireEvent.press(screen.getByTestId('reminders-past-toggle')); }`.

- **R4**: WHEN la lista de la mascota tiene al menos un recordatorio, THE
  SYSTEM SHALL pintar, debajo de las píldoras de resumen, la cabecera
  `reminders-upcoming-heading` con `t('reminders.sectionUpcoming')`. La
  cabecera lleva `accessibilityRole="header"` y
  `className="mt-1 text-13 font-extrabold uppercase tracking-caps text-muted"`.
  Debajo, la pantalla SHALL pintar `reminders-upcoming-list` con las filas
  próximas en el orden de R3.
  - Test: `screens/reminders/index.test.tsx::#227 R4: pinta «Próximos» y debajo sus filas en orden ascendente`.
  - Aserta texto `Próximos`, `props.accessibilityRole === 'header'` y el
    `className` exacto (`toBe`).
  - Aserta
    `within(list).getAllByTestId(/^reminder-row-/).map(testID)` =
    `['reminder-row-today', 'reminder-row-newyear', 'reminder-row-later']`.
  - Aserta que
    `screen.getAllByTestId(/^reminders-(pills|upcoming-heading|upcoming-list|past)$/).map(testID)`
    = `['reminders-pills', 'reminders-upcoming-heading', 'reminders-upcoming-list', 'reminders-past']`
    (orden en el árbol).

- **R5**: WHEN hay al menos un recordatorio pasado, THE SYSTEM SHALL pintar
  al final la sección `reminders-past`, **colapsada por defecto**, con:
  - el encabezado pulsable `reminders-past-toggle` (`Pressable`,
    `accessibilityRole="button"`,
    `accessibilityState={{ expanded: pastExpanded }}`,
    `hitSlop={TOUCH_SLOP}`);
  - la etiqueta `reminders-past-label` con `t('reminders.sectionPast')`;
  - el contador `reminders-past-count` con el número de pasados y
    `style={TABULAR_NUMS}`;
  - un disco con el icono `ChevronDown` (`size={18}`, `color={muted}`).

  WHILE está colapsada, la pantalla SHALL NOT montar `reminders-past-list` ni
  ninguna fila pasada. IF no hay ningún pasado THEN la pantalla SHALL NOT
  pintar `reminders-past`.
  - Test: `screens/reminders/index.test.tsx::#227 R5: «Pasados» empieza colapsada con su contador y el chevron abajo`.
    - Aserta texto `Pasados`; `reminders-past-count` con texto `3` y
      `props.style` igual a `{ fontVariant: ['tabular-nums'] }` (literal);
      `toggle.props.accessibilityState?.expanded === false` y
      `toggle.props.hitSlop` igual a `{ top: 6, bottom: 6, left: 6, right: 6 }`
      (literal).
    - Aserta
      `within(toggle).getByTestId('reminders-icon-chevron-down', { includeHiddenElements: true })`
      con `props.size === 18` y `props.color === 'color:muted'`, y
      `within(toggle).queryByTestId('reminders-icon-chevron-up', { includeHiddenElements: true })`
      nulo.
    - Aserta que `reminders-past-list`, `reminder-row-cancelled`,
      `reminder-row-yesterday` y `reminder-row-oldsent` son `null`.
  - Test: `screens/reminders/index.test.tsx::#227 R5: sin pasados no pinta la sección`.
    - Fixture: solo `today` y `newyear`. Aserta
      `queryByTestId('reminders-past')` y
      `queryByTestId('reminders-past-toggle')` nulos, y
      `reminders-upcoming-list` presente.

- **R6**: WHEN el usuario pulsa `reminders-past-toggle`, THE SYSTEM SHALL
  alternar la sección entre colapsada y expandida. Expandida, SHALL:
  - pintar `reminders-past-list` debajo del encabezado, con las filas pasadas
    en el orden de R3 (de la más reciente a la más antigua);
  - terminar el `className` de cada fila pasada en ` opacity-50`;
  - mostrar el icono `ChevronUp`, con
    `accessibilityState.expanded === true`.
  - Test: `screens/reminders/index.test.tsx::#227 R6: el encabezado alterna «Pasados» y sus filas van atenuadas de la más reciente a la más antigua`.
  - Tras `expandPast()`, aserta:
    - `within(screen.getByTestId('reminders-past-list')).getAllByTestId(/^reminder-row-/).map(testID)`
      = `['reminder-row-cancelled', 'reminder-row-yesterday', 'reminder-row-oldsent']`;
    - que cada una tiene un `className` que termina en ` opacity-50`;
    - `reminders-icon-chevron-up` dentro del toggle y `-chevron-down` ausente;
    - `expanded === true`.
  - Un segundo `expandPast()` vuelve a dejar `reminders-past-list` nulo y
    `expanded === false`.

- **R7**: WHEN la pantalla pinta una fila, THE SYSTEM SHALL decidir **solo por
  su sección** si lleva ` opacity-50` (pasada sí, próxima no). Todo lo demás
  sigue decidido por `status`, como hoy:
  - el borde: `border-2 border-category-amber` si `status === 'scheduled'` y
    el día es hoy, `border border-border` en otro caso;
  - el badge «Hoy»;
  - el texto de estado («Enviado» / «Cancelado») o `· en N días`;
  - la línea de repetición y el botón de la fila (R12).
  - Test: `screens/reminders/index.test.tsx::#227 R7: la opacidad sigue a la sección y el resto de la fila sigue al status`.
  - Aserta con `toBe`, tras `expandPast()`:

  | Fila | `className` exacto | Además |
  |---|---|---|
  | `today` | `flex-row items-center gap-3 rounded-22 bg-surface p-3.5 border-2 border-category-amber` | `reminder-upcoming-today` con texto `Hoy` |
  | `newyear` | `flex-row items-center gap-3 rounded-22 bg-surface p-3.5 border border-border` | sin `reminder-upcoming-newyear` |
  | `later` | `flex-row items-center gap-3 rounded-22 bg-surface p-3.5 border border-border` | `reminder-status-later` con texto `Enviado`; sin badge |
  | `cancelled` | `flex-row items-center gap-3 rounded-22 bg-surface p-3.5 border border-border opacity-50` | `reminder-status-cancelled` con texto `Cancelado` |
  | `yesterday` | `flex-row items-center gap-3 rounded-22 bg-surface p-3.5 border border-border opacity-50` | sin badge; `within(row).getByText('· en -1 días')`; `reminder-repeats-yesterday` presente |
  | `oldsent` | `flex-row items-center gap-3 rounded-22 bg-surface p-3.5 border border-border opacity-50` | `reminder-status-oldsent` con texto `Enviado` |

- **R8**: WHEN la lista tiene recordatorios pero ninguno es próximo, THE
  SYSTEM SHALL pintar, en lugar de `reminders-upcoming-list`, la caja
  `reminders-upcoming-empty`, entre la cabecera «Próximos» y la sección
  «Pasados». La caja es un `View` con
  `className="items-center gap-1 rounded-22 bg-default px-4 py-5"` y
  `style={CONTINUOUS_CORNER}`, con dos `Text`:
  - `reminders-upcoming-empty-title`, con
    `className="text-center text-15 font-extrabold text-foreground"` y
    `t('reminders.upcomingEmptyTitle')`;
  - `reminders-upcoming-empty-body`, con
    `className="text-center text-13 text-muted"` y
    `t('reminders.upcomingEmptyBody')`.
  - Test: `screens/reminders/index.test.tsx::#227 R8: sin próximos pinta la caja «Nada pendiente por ahora» encima de «Pasados»`.
  - Fixture: solo `oldsent`, `yesterday` y `cancelled` del fixture común.
  - Aserta:
    - textos `Nada pendiente por ahora` y
      `Los recordatorios nuevos aparecerán aquí.`;
    - los tres `className` con `toBe`;
    - `queryByTestId('reminders-upcoming-list')` nulo;
    - `reminders-past-count` con texto `3` y la sección colapsada;
    - `screen.getAllByTestId(/^reminders-(upcoming-heading|upcoming-empty|past)$/).map(testID)`
      = `['reminders-upcoming-heading', 'reminders-upcoming-empty', 'reminders-past']`.

- **R9**: WHEN la lista de la mascota está vacía, THE SYSTEM SHALL conservar
  el vacío actual (`reminders-empty`, `EmptyState` sin cambio) y SHALL NOT
  pintar la cabecera, la caja de R8 ni la sección «Pasados».
  - Test: `screens/reminders/index.test.tsx::#227 R9: sin recordatorios conserva el vacío sin secciones`.
  - Fixture: `reminders: []`. Aserta `reminders-empty` presente y
    `reminders-upcoming-heading`, `reminders-upcoming-empty` y
    `reminders-past` nulos.

### Movimiento

- **R10**: WHEN la pantalla pinta las filas, THE SYSTEM SHALL envolver cada
  una en `RiseIn` con `testID={`reminders-entry-${reminder.id}`}`:
  - las próximas con `delayMs={i * MOTION_REMINDERS_STAGGER_MS}`, con `i` su
    posición en Próximos (0, 70, 140…);
  - las pasadas con `delayMs={index * MOTION_REMINDERS_PAST_STAGGER_MS}`, con
    `index` su posición en Pasados, desde 0 (0, 30, 60…).

  `theme/motion.ts` SHALL exportar `MOTION_REMINDERS_PAST_STAGGER_MS = 30`,
  el paso que dibuja el canvas expandido (`animation-delay: 30ms` y `60ms`).
  - Test: `theme/__tests__/motion.test.ts::#227 R10: declara el paso de 30 ms de las filas pasadas`
    (`it` de primer nivel, como `#204 R3: …`). Aserta
    `require('../motion').MOTION_REMINDERS_PAST_STAGGER_MS` igual a `30`.
  - Test: `screens/reminders/index.test.tsx::#227 R10: escalona los próximos cada 70 ms y los pasados cada 30 ms desde 0`.
    - Tras `expandPast()`, construye el `Map` `testID → delayMs` de
      `mockRiseIn.mock.calls` (filtrado por `reminders-entry-`), como en
      `#204 R6`.
    - Aserta que es exactamente
      `[['reminders-entry-today', 0], ['reminders-entry-newyear', 70], ['reminders-entry-later', 140], ['reminders-entry-cancelled', 0], ['reminders-entry-yesterday', 30], ['reminders-entry-oldsent', 60]]`.

### Fidelidad al canvas

- **R11**: THE SYSTEM SHALL pintar los elementos nuevos con las clases fijadas
  por el canvas (tabla abajo). No usa hex, corchetes en `className`, emoji,
  `StyleSheet` ni claves de sombra, y lleva `style={CONTINUOUS_CORNER}` en todo
  radio que no sea cápsula.
  - Test: `__tests__/reminders-upcoming-past-canvas-fidelity.test.ts::#227 R11: %s` (`it.each` sobre las filas de la tabla).
    - Cada fila lee su artboard
      (`join(process.cwd(), '..', 'specs', 'mobile-reminders-upcoming-past', 'canvas', <fichero>)`)
      y aserta que contiene el literal de canvas una vez
      (`split(literal).length - 1 === 1`).
    - Después aserta que el fuente de `screens/reminders/index.tsx` contiene
      el literal de producción **exactamente una vez**.
  - Test: `__tests__/reminders-upcoming-past-canvas-fidelity.test.ts::#227 R11: inventario del fuente`.
    Aserta sobre `screens/reminders/index.tsx`:
    - `style={CONTINUOUS_CORNER}` 6, `style={TABULAR_NUMS}` 4 y
      `hitSlop={TOUCH_SLOP}` 1;
    - `delayMs={i * MOTION_REMINDERS_STAGGER_MS}` 1 y
      `delayMs={index * MOTION_REMINDERS_PAST_STAGGER_MS}` 1;
    - `${inactive ? ' opacity-50' : ''}` 0 y `splitReminders(` 1.

    El grep-limpio de la pantalla ya lo vigilan `#204 R17`, `#193 R11` y
    `#181 R8.3`; este test no lo duplica.

  | # | Elemento (testID) | Artboard | Literal de canvas | Literal de producción |
  |---|---|---|---|---|
  | 1 | Cabecera (`reminders-upcoming-heading`) | ProximosPasados | `.sec{margin: 4px 0 0; font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: .06em; color: var(--muted)}` | `className="mt-1 text-13 font-extrabold uppercase tracking-caps text-muted"` |
  | 2 | Encabezado (`reminders-past-toggle`) | ProximosPasados | `.tog{margin: 4px 0 0; padding: 0; border: 0; background: none; color: inherit; font: inherit; width: 100%; height: 40px; flex: none; display: flex; align-items: center; gap: 8px; text-align: left}` | `className="mt-1 h-10 w-full flex-row items-center gap-2"` |
  | 3 | Etiqueta (`reminders-past-label`) | ProximosPasados | `.sec{margin: 4px 0 0; font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: .06em; color: var(--muted)}` | `className="text-13 font-extrabold uppercase tracking-caps text-muted"` |
  | 4 | Contador (`reminders-past-count`) | ProximosPasados | `.cnt{padding: 2px 8px; border-radius: 999px; background: var(--default); color: var(--muted); font-size: 12px; font-weight: 800}` | `className="rounded-full bg-default px-2 py-0.5 text-xs font-extrabold text-muted"` |
  | 5 | Disco del chevron | ProximosPasados | `.chev{width: 32px; height: 32px; border-radius: 50%; background: var(--default); color: var(--muted); display: flex; align-items: center; justify-content: center}` | `className="size-8 items-center justify-center rounded-full bg-default"` |
  | 6 | Fila pasada | PasadosExpandida | `.past{opacity: .5}` | `${past ? ' opacity-50' : ''}` |
  | 7 | Paso de las pasadas | PasadosExpandida | `<article class="card past" style="animation-delay: 30ms">` | `delayMs={index * MOTION_REMINDERS_PAST_STAGGER_MS}` |
  | 8 | Caja sin próximos (`reminders-upcoming-empty`) | SinProximos | `border-radius: 22px; background: var(--default); padding: 20px 16px; display: flex; flex-direction: column; align-items: center; gap: 4px; text-align: center` | `className="items-center gap-1 rounded-22 bg-default px-4 py-5"` |
  | 9 | Título de la caja | SinProximos | `<span style="font-size: 15px; font-weight: 800">Nada pendiente por ahora</span>` | `className="text-center text-15 font-extrabold text-foreground"` |
  | 10 | Cuerpo de la caja | SinProximos | `<span style="font-size: 13px; color: var(--muted)">Los recordatorios nuevos aparecerán aquí.</span>` | `className="text-center text-13 text-muted"` |

  Dianas táctiles: el encabezado mide `h-10` más `hitSlop={TOUCH_SLOP}`, es
  decir 40 + 12 = 52 pt, por encima de 44. Las listas
  (`reminders-upcoming-list`, `reminders-past-list`) y el contenedor
  `reminders-past` llevan `className="gap-3"`, el mismo hueco de 12 que las
  filas tienen hoy.

### Acciones de fila

- **R12**: WHILE una fila está montada, en cualquiera de las dos secciones,
  THE SYSTEM SHALL conservar su botón de acción **dentro de la fila** y con la
  regla de hoy:
  - si el usuario es dueño y la fila es una serie `scheduled`, ofrece
    `reminder-cancel-series-<id>`;
  - si es dueño y no lo es, ofrece `reminder-delete-<id>`;
  - si no es dueño, no ofrece ninguno.
  - Test: `screens/reminders/index.test.tsx::#227 R12: Eliminar y Cancelar serie siguen en su fila en las dos secciones y solo para el dueño`.
  - Con el fixture común y tras `expandPast()`, aserta:
    - `within(row('today')).getByTestId('reminder-delete-today')` y
      `within(row('later')).getByTestId('reminder-delete-later')`, en
      Próximos;
    - `within(row('yesterday')).getByTestId('reminder-cancel-series-yesterday')`,
      con `reminder-delete-yesterday` nulo, en Pasados;
    - `within(row('cancelled')).getByTestId('reminder-delete-cancelled')` y
      `within(row('oldsent')).getByTestId('reminder-delete-oldsent')`.

    Aquí `row(id)` es `screen.getByTestId(`reminder-row-${id}`)`.
  - Después, con `mockListPets` devolviendo `makePet({ myRole: 'family' })`
    (como en `#216 R5`), vuelve a renderizar, expande y aserta que
    `screen.queryAllByTestId(/^reminder-(delete|cancel-series)-/)` está vacío
    y que las seis filas siguen montadas.

### Enmiendas

- **R13**: THE SYSTEM SHALL mantener en verde todos los candados existentes,
  enmendando **solo** los de la «Tabla de enmiendas» y los que caigan bajo la
  «Regla de cierre». Cada uno lleva su ruta y el título de su `it`, recibe el
  sufijo ` (enmendado por #227 R13)` al final del título y conserva su
  intención. Además, las tres specs enmendadas SHALL llevar una sola vez la
  sección `## Enmienda #227 — Recordatorios próximos y pasados`, con su
  casilla.
  - Test: `__tests__/reminders-upcoming-past-canvas-fidelity.test.ts::#227 R13: los candados enmendados nombran su enmienda y las specs enmendadas llevan su casilla`.
    - Recorre la constante `AMENDED` del test: pares `[ruta, localizador]`,
      uno por fila de las dos tablas de enmiendas. La lista literal está en
      [[tasks]] §R13. Por cada par, lee el fichero y aserta dos cosas:
      exactamente **una** línea contiene el localizador, y esa línea contiene
      `(enmendado por #227 R13)`.
    - El localizador es el título tras la enmienda, sin sufijo, con su
      `describe('` o `it('` delante cuando el título solo no es único en el
      fichero. Por ejemplo, `#204 R9: Eliminar de la hoja` sale dos veces
      (`grep -cF` → 2: el `describe` y su `it`).
    - Para cada spec de «Specs enmendadas», aserta que
      `## Enmienda #227 — Recordatorios próximos y pasados` aparece una vez y
      que el texto casa con
      `/- \[[ xX]\] Enmienda #227 aprobada por humano/`, tolerante a la
      firma.
  - Más la suite completa de `mobile-pet-tracker/` en verde (`./init.sh`, que
    corre el leader, no Codex).

## Tabla de enmiendas

Medida contra `230f1c9f`. Los títulos se citan por contenido, sin número de
línea. Las cifras de los guards se **recomputan en T0** y se enmiendan con el
delta exacto. La columna «Cambio» es la intención; los literales de cada
cambio están en [[tasks]].

Ficheros de producción, relativos a `mobile-pet-tracker/src/`:

| Fichero | Cambio |
|---|---|
| `utils/reminder-dates.ts` | `splitReminders` (R2, R3) |
| `theme/motion.ts` | `MOTION_REMINDERS_PAST_STAGGER_MS = 30` (R10) |
| `i18n/catalog.ts` | cuatro claves en `es` y `en` (R1) |
| `screens/reminders/index.tsx` | partición, cabecera, caja, sección «Pasados» y `renderRow` (R4 a R12) |
| `../specs/mobile-ui-language/design.md` | §2.40 (R1) |

### Candados en `screens/reminders/index.test.tsx`

Antes de cualquier test, en T0:

- el doble de `reicon-react-native` suma
  `ChevronDown: mockIcon('reminders-icon-chevron-down'),` y
  `ChevronUp: mockIcon('reminders-icon-chevron-up'),`;
- el `dueAt` por defecto de `makeReminder` pasa de
  `'2026-08-27T09:00:00.000Z'` a
  `new Date(Date.now() + 3 * 86_400_000).toISOString()`. Así un recordatorio
  sin fecha explícita es próximo bajo cualquier reloj, y bajo el reloj de
  `R6: lista…` (`2026-08-24T09:00Z`) vale exactamente lo de antes. Ver
  [[design]] §D10.

| `describe` · título tras la enmienda | Enmienda |
|---|---|
| `R6: lista con pills, badges y refetch on focus` · `renders summaries and reminder rows by section (enmendado por #213 R16)` | Se renombra desde `renders summaries and reminder rows in API order (enmendado por #213 R16)`. Colapsada: `getAllByTestId(/^reminder-row-/)` = `['reminder-row-upcoming', 'reminder-row-later']`. Tras `expandPast()`: `['reminder-row-upcoming', 'reminder-row-later', 'reminder-row-cancelled', 'reminder-row-sent']`. Las aserciones de opacidad, «Enviado» y «Cancelado» se mueven detrás de `expandPast()`. Las píldoras (2 / 1 / 2) y el resto no cambian. |
| `#178 R6: fila del canvas` · `distingue las recetas de fila próxima, lejana e inactiva (enmendado por #204 R7) (enmendado por #213 R16)` | `expandPast()` antes de leer la fila `c`. Su `className` sigue terminando en `border border-border opacity-50`. |
| `#178 R6: fila del canvas` · `ordena mosaico, columna y borrar con la anatomía exacta de cada fila` | `expandPast()` antes de recorrer `a`, `b`, `c`. |
| `#178 R6: fila del canvas` · `da a cada mosaico su único icono, tamaño, superficie y tinta` | ídem |
| `#178 R6: fila del canvas` · `pinta tipo y título con sus tintas y pesos propios` | ídem |
| `#178 R6: fila del canvas` · `formatea la hora lejana y la meta inactiva con su estado` | `expandPast()` antes de leer `c` |
| `#178 R6: fila del canvas` · `sustituye los emoji de todas las filas por iconos` | `expandPast()` antes de recorrer las filas |
| `#178 R7: entrada escalonada y badge` · `asigna a cada entrada su índice dentro de su sección (enmendado por #204 R6)` | Se renombra desde `asigna a cada entrada su índice en el orden del fixture (enmendado por #204 R6)`. Tras `expandPast()`: `a` 0, `b` 70, `c` 0. |
| `#178 R7: entrada escalonada y badge` · `envuelve cada fila en su propia entrada` | `expandPast()` antes del bucle |
| `#178 R8: sheet de borrado del canvas` (todos sus `it`) | Solo reloj: `jest.useFakeTimers({ now: new Date('2026-12-30T15:00:00.000Z') })` en su `beforeEach` y `afterEach(() => { jest.clearAllTimers(); jest.useRealTimers(); })`. Sin reloj, `a` (`2027-01-02`) pasaría a Pasados el 3 de enero de 2027. El sufijo va en el `describe`. |
| `#218 R1: el cajón de borrar pinta su contenedor con el token surface` | ídem (solo reloj; sufijo en el `describe`) |
| `#204 R6: entrada de las filas` · `#204 R6: escalona las filas próximas cada 70 ms y la pasada desde 0` | Se renombra desde `#204 R6: escalona las filas 0, 70 y 140 ms con RiseIn`. Reloj fijo `2026-12-30T15:00:00.000Z` y `afterEach` como arriba; `expandPast()`. Espera `[['reminders-entry-a', 0], ['reminders-entry-b', 70], ['reminders-entry-c', 0]]`. |
| `#204 R8: Eliminar de la fila` | Solo reloj, como `#178 R8`; sufijo en el `describe`. |
| `#204 R9: Eliminar de la hoja` | ídem |
| `R7: borrar recordatorio con confirmación` · `shows a delete action for reminders in every status` | `expandPast()` antes de leer `reminder-delete-cancelled` |
| `#84 R3: …` · `08:00 del 10 de septiembre: ayer a las 09:00 no es de esta semana ni próximo` | `expandPast()` antes de leer la fila. Se conserva `· en -1 días`. |
| `#213 R14: series en Recordatorios` · `#213 R14: sin línea de repetición si no hay recurrencia o la serie no está programada` | `expandPast()` tras la primera espera. Antes del bucle, aserta que las tres filas `reminder-row-once`, `-cancelled` y `-sent` están montadas, para que la ausencia de la línea no sea trivial. |
| `#213 R14: series en Recordatorios` · `#213 R15: una serie cancelada o enviada conserva Eliminar (%s)` | El fixture fija `dueAt: new Date(2026, 11, 28, 9, 0).toISOString()` (local, dos días antes del reloj del `describe` en cualquier `TZ`; con el `dueAt` relativo de D10 la rama `sent` caería en Próximos), así que las dos ramas caen en Pasados, y llama a `expandPast()` antes de leer el botón. |
| `#213 R14: series en Recordatorios` · `#213 R16: el badge Hoy y el borde ámbar solo marcan el día de hoy` | `expandPast()`. El bucle se parte: `tomorrow` conserva `… border border-border`, y `yesterday` (Pasados) pasa a `flex-row items-center gap-3 rounded-22 bg-surface p-3.5 border border-border opacity-50`. Los dos siguen sin badge. |

### Candados de guards y de recuento

Rutas relativas a `mobile-pet-tracker/src/`.

| Fichero · título tras la enmienda (prefijo) | Enmienda |
|---|---|
| `providers/__tests__/language-provider.test.tsx` · `#194 R1: mantiene la base más las claves de #68` | La última línea de la suma, `+ 1, // #225 R1`, pasa a `+ 1 // #225 R1`, y debajo se añade `+ 4, // #227 R1`. |
| `__tests__/ui-language.test.ts` · `#186 R5: resuelve las 113 ocurrencias normativas (enmendado por #213 R22)` | `+ 57, // #213 R22` pasa a `+ 57 // #213 R22`, y debajo se añade `+ 4, // #227 R1`. El «113» del título no cambia. |
| `__tests__/design-drift.test.ts` · `importa exactamente los iconos prescritos desde un único import de reicon` | `'screens/reminders/index.tsx': ['Plus', 'Repeat', 'Trash'],` pasa a `'screens/reminders/index.tsx': ['ChevronDown', 'ChevronUp', 'Plus', 'Repeat', 'Trash'],` |
| `__tests__/design-drift.test.ts` · `reserva los radios 14, 16 y 22 a Recordatorios con su inventario exacto` | `[/\brounded-22\b/g, 1]` pasa a `[/\brounded-22\b/g, 1 + 1]`. `outsideReminders(/\brounded-22\b/)` sigue en `['screens/pairing/index.tsx']`. |
| `__tests__/consistency-classnames.test.ts` · `%s importa y aplica sus %i esquinas` | `[join('screens', 'reminders', 'index.tsx'), 4 + 1], // #178 R6 fila sin Card` pasa a `[join('screens', 'reminders', 'index.tsx'), 4 + 1 + 1], // #178 R6 fila sin Card; #227 R8 caja sin próximos` |
| `__tests__/consistency-classnames.test.ts` · `fusiona la esquina una vez y la entrega a las dos ramas de Card` | Tras su `+ 3 // #215 R20`, se añade la línea `+ 1 // #227 R8`. |
| `__tests__/consistency-classnames.test.ts` · `#98 R10: los candados que esta feature no mueve` › `deja CONTINUOUS_CORNER, bg-accent-soft y el acento donde estaban` | Tras su `+ 3 // #215 R20`, se añade la línea `+ 1 // #227 R8`. El literal `+ 3 // #215 R20` sale dos veces (`grep -cF` → 2): hay que anclar por el `it`. |
| `__tests__/consistency-classnames.test.ts` · `%s aplica TABULAR_NUMS a sus %i valores` | `[join('screens', 'reminders', 'index.tsx'), 3],` pasa a `[join('screens', 'reminders', 'index.tsx'), 3 + 1], // #227 R5` |
| `__tests__/consistency-classnames.test.ts` · `#69 R10: mantiene la base cerrada más los deltas medidos` | Se añade ` + 1` al final de la suma `14 + 4 + … + 1` (antes de la coma), y `; #227 R5` al final de su comentario. |
| `__tests__/alerts-canvas-fidelity.test.ts` · `limita $token a su inventario de producción` | En la fila `tracking-caps`, la línea `files: [...]` suma `'screens/reminders/index.tsx'` tras `'screens/meal-schedule/index.tsx'` y `; #227 R4` en su comentario. En la fila `text-15`, se añade `'screens/reminders/index.tsx', // #227 R8` entre `'screens/register/index.tsx',` y `'screens/reset-password/index.tsx',`. |
| `theme/__tests__/motion.test.ts` · `no exporta nada más` | La lista ordenada suma `'MOTION_REMINDERS_PAST_STAGGER_MS',` justo antes de `'MOTION_REMINDERS_STAGGER_MS',` (orden verificado con `Array.prototype.sort`). |

Todas estas filas reciben el sufijo ` (enmendado por #227 R13)` al final de
su título. En las filas con `describe` (`#178 R8`, `#218 R1`, `#204 R8` y
`#204 R9`), el sufijo va en el título del `describe`.

**Regla de cierre.** En T0, Codex corre `src/screens/reminders`, `src/utils`,
`src/theme`, `src/__tests__` y `src/providers`. Un `it` que falle **solo** por
una de estas causas se enmienda igual que los de la tabla: misma intención,
mismo sufijo y anotado en `progress/impl_mobile-reminders-upcoming-past.md`
con su ruta y su título.

- (a) Sus filas pasadas están colapsadas.
- (b) El orden pasa a ser por sección.
- (c) El `dueAt` por defecto de D10.
- (d) Un reloj real que cruza el fixture.
- (e) Uno de los deltas de inventario de esta spec: una esquina, un tabular,
  un `rounded-22`, un `tracking-caps`, un `text-15`, dos iconos o cuatro
  claves.

Un rojo **fuera** de esas rutas, o por otra causa, **se reporta y no se toca**.

Candados que **no** cambian y que la implementación debe respetar:

- `#204 R4`: el marco y su `gap` de 14.
- `#204 R5`: las píldoras.
- `#204 R7`: el ámbar de la fila de hoy.
- `#204 R17`, `#193 R11` y `#181 R8.3`: grep-limpio y `#NNN` seguido de
  ` R<n>` en comentarios.
- `#213 R17` a `#213 R21`: la hoja de Cancelar serie y `petId`.
- `#216 R4` y `#216 R5`: dueño.
- `#155 R6` y `#178 R9`: el vacío con `EmptyState`.
- `#65 R15`: el locale.
- `#218 R3`: la superficie de la hoja.
- La lista de `text-13` de `#174 R12` (`screens/reminders/index.tsx` ya
  figura) y los radios de `chunky-cta-canvas-fidelity.test.ts` (solo
  `rounded-16`).

### Specs enmendadas

Cada una recibe, desde el commit de esta spec, la sección
`## Enmienda #227 — Recordatorios próximos y pasados`: al final del fichero,
salvo en `specs/mobile-reminders/requirements.md`, donde va justo antes de
`## Aprobación`. La sección lleva «Spec enmendada»,
«Qué cambia», «Qué no cambia» y la casilla
`- [ ] Enmienda #227 aprobada por humano`. Las otras, ya listadas arriba,
cambian solo por reloj, recuento o colapso; su requisito no cambia de texto y
llevan solo el sufijo.

| Spec (ruta) | R-id | Qué cambia |
|---|---|---|
| `specs/mobile-reminders/requirements.md` | `#39 R6` | «una fila por reminder en el orden recibido» pasa a dos secciones (R4 a R6). La opacidad 0,5 la decide la sección, no `sent` / `cancelled` (R7). |
| `specs/mobile-routine-canvas-fidelity/requirements.md` | `#178 R6`, `#178 R7` | En R6, `${inactive ? ' opacity-50' : ''}` pasa a `${past ? ' opacity-50' : ''}`. En R7, «`i` la posición en la lista» pasa a la posición dentro de su sección. |
| `specs/mobile-canvas-routine/requirements.md` | `#204 R6` | Los retardos 0 / 70 / 140 «en el orden de la lista» pasan a `i * 70` en Próximos e `index * 30` en Pasados, los dos desde 0. |

## Paso de smoke nuevo (G2)

El leader lo añade a `progress/smoke_mejoras-smoke.md` al mergear, bajo
`## #227 mobile-reminders-upcoming-past`. Reproduce la captura original:

1. En el dev build de Android, con una mascota que tenga un recordatorio
   enviado de días pasados, uno cancelado, uno programado de ayer y dos
   futuros (uno de hoy), abre Recordatorios. Arriba sale «PRÓXIMOS» con los
   futuros en orden ascendente; el de hoy lleva borde ámbar y «Hoy». Ninguna
   fila atenuada sale arriba.
2. Al final sale «PASADOS» con el contador `3` y el chevron abajo, sin filas.
3. Toca «PASADOS»: se abren las tres filas atenuadas, de la más reciente a la
   más antigua, y el chevron mira arriba. Vuelve a tocar: se cierran.
4. Elimina los recordatorios futuros: en su lugar sale la caja «Nada
   pendiente por ahora / Los recordatorios nuevos aparecerán aquí.», encima
   de «PASADOS».
5. Repite 1 a 4 en tema claro y oscuro.

## Fuera de alcance

- El deslizar para borrar de #228: va detrás de esta feature, en el mismo
  fichero.
- Las píldoras de resumen («Activos», «Esta semana», «Inactivos»), su copy y
  sus reglas.
- El copy del badge «Hoy» y el «¡Próximo!» del canvas (Voz B).
- Backend: ni orden en el servidor ni filtros por sección.
- La animación `rise` de la caja sin próximos, que el canvas sí anima.
- El `gap` del marco (14 en producción, 12 en el canvas; ver Preguntas
  abiertas).
- El smoke en dispositivo (G2), que corre el humano.
- Enmiendas de `docs/ui-guidelines.md` o `docs/conventions.md`: no hay
  ninguna (sin G4).

## Preguntas abiertas (con valor por defecto aplicado)

1. La píldora «Inactivos» cuenta `sent` y `cancelled`, y «Pasados» cuenta
   además los `scheduled` de días pasados y excluye los `sent` futuros, así
   que pueden diferir. Por defecto, las píldoras no cambian.
2. Una fila `scheduled` en Pasados sigue mostrando `· en -N días`. Por
   defecto, sin cambio de copy.
3. El canvas separa las secciones con un `gap` de 12 y el marco de
   producción usa 14 (`#204 R4`). Por defecto se queda en 14.
4. Un `sent` con `dueAt` de hoy en adelante va a Próximos con opacidad
   completa y «Enviado». Por defecto, sí.
5. Expandir «Pasados» se conserva al cambiar de mascota mientras la pantalla
   sigue montada. Por defecto, sí: un solo `useState`.
6. El inglés de R1 no se dibujó en G1. Por defecto, los valores de R1.

## Aprobación

- [ ] Aprobado por humano (fecha: ____) ← gate obligatorio antes de implementar
  (firma delegada del leader con la checklist de
  `progress/plan_canvas-parity-2026-10-23.md` §4, los tres puntos del §4 de
  `progress/plan_ui-2026-10-26.md` y los dos de
  `progress/plan_mejoras-smoke-2026-11-03.md` §4; mandato del 2026-10-23,
  ampliado el 2026-11-03)
- [ ] **G2**: smoke en el dev build de Android (pasos de «Paso de smoke
  nuevo», tema claro y oscuro) (fecha: ____) ← gate humano, por lote al final;
  lo registra `progress/smoke_mejoras-smoke.md`
- Base congelada: `230f1c9f` (`origin/dev`).

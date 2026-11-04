---
feature: "mobile-health-vaccines-upcoming-past"
status: approved        # draft | approved
tags: [mobile, ui, spec]
---

# Requisitos — [[mobile-health-vaccines-upcoming-past]] (#241)

> Notación EARS. Capa: móvil (`mobile-pet-tracker/`). El backend **no
> cambia**. Diseño, archivos y alternativas en [[design]]; plan TDD en
> [[tasks]]; trazabilidad en [[traceability]].

## Contexto

Salud pinta hoy la lista de Vacunas tal como llega del API, ordenada por
`appliedAt` descendente (`vaccine.drizzle.repository.ts`). No separa las
vacunas que vienen de las que ya pasaron: una dosis que toca hoy sigue mezclada
con las futuras, y las futuras no van de la más cercana a la más lejana.

Hallazgo 3 del smoke G2 del 2026-11-04, en palabras del humano
(`progress/plan_arreglos-smoke-2026-11-04.md` §1):

> En salud en el listado de Vacunas los que ya fueron aplicadas como la
> identificamos que son la proxima a aplicarse, siguen en el listado pero
> supongamos que hoy el es el proximo a aplicarse, entonces se debe de quitar
> de la lista de PROXIMOS y pasar a PASADOS
> Igual note que no estan en orden las vacunas en la lista de PROXIMOS y
> PASADOS es decir hay vacunas que estan para el dia de hoy y toma los de de
> otra fecha

Respuesta del humano a «En Salud, ¿cómo debe quedar la lista de Vacunas?»
(plan §1, respuesta literal): **«Próximas y Pasadas»**. El plan la concreta así:
«Arriba "PRÓXIMAS": las que tienen la próxima dosis después de hoy, de la más
cercana a la más lejana. Abajo "PASADAS", colapsada: las que tienen la próxima
dosis hoy o antes, o no tienen próxima dosis. El humano aceptó que una vacuna
vencida quede en Pasadas.»

Esta feature:

- parte la lista de Vacunas en **Próximas** (arriba, ascendente por
  `nextDoseAt`) y **Pasadas** (al final, colapsada al entrar, con contador y
  chevron, descendente por su fecha);
- copia la cabecera de sección, el contador y el chevron de Recordatorios
  (#227) sin cambiarlos;
- no cambia las filas (mismo tile, icono y color) ni la tarjeta «Próxima dosis».

## Fuentes

- `progress/plan_arreglos-smoke-2026-11-04.md` §1 (texto y respuestas del
  humano), §2 «241», §4 (ciclo y checklist), §5 (gates) y §6 (fuera de
  alcance).
- `progress/plan_mejoras-smoke-2026-11-03.md` §4, `progress/plan_canvas-parity-2026-10-23.md`
  §4 y `progress/plan_ui-2026-10-26.md` §4 (checklist de firma).
- Patrón que se copia sin importarlo: la cabecera «Pasados» de
  `screens/reminders/index.tsx` (#227, ya en `dev`) y su spec
  `specs/mobile-reminders-upcoming-past/` (canvas v167, aprobado en G1 el
  2026-11-03).
- `docs/ui-guidelines.md` (rige toda la UI móvil) y `docs/conventions.md`
  (§Esperas).
- Spec que se enmienda: `specs/mobile-health/requirements.md` (#37), R5.

## Evidencia (medida en la base `0f1ab26f`, `origin/dev`)

Todas las cuentas son **ocurrencias**, no líneas: se miden con
`node -e "const s=require('fs').readFileSync('<ruta>','utf8'); console.log(s.split('<literal>').length - 1)"`
desde `mobile-pet-tracker/src/`. `grep -c` cuenta líneas y da otra cifra en
`t('` (27 líneas, 30 ocurrencias).

Producción, `screens/health/index.tsx`:

| Literal | Base | Tras el cambio |
|---|---|---|
| `style={TABULAR_NUMS}` | 3 | 4 |
| `hitSlop={TOUCH_SLOP}` | 1 | 2 |
| `style={CONTINUOUS_CORNER}` | 7 | 7 |
| `accessibilityRole="header"` | 2 | 3 |
| `className="gap-2.5"` | 1 | 4 |
| `tracking-caps` | 1 | 3 |
| `uppercase` | 1 | 3 |
| `bg-default` | 1 | 3 |
| `<Pressable` | 2 | 3 |
| `rounded-full` | 4 | 6 |
| `t('` | 30 | 32 |
| `useState(false)` | 0 | 1 |
| `import { useState } from 'react';` | 0 | 1 |
| `splitVaccines(` | 0 | 1 |
| `sections.upcoming.map(renderVaccineRow)` | 0 | 1 |
| `sections.past.map(renderVaccineRow)` | 0 | 1 |
| `vaccines.data.vaccines.map(` | 1 | 0 |
| `delayMs={80 + 60 * Math.min(index, 2)}` | 1 | 1 |
| `nextDoseAt >= today` | 1 | 1 |
| `accessibilityState` | 0 | 1 |

Anclas de producción (cada una aparece 1 vez en la base):

- `import { Button, Skeleton } from 'heroui-native';`
- `import { Pressable, ScrollView, Text, View } from 'react-native';`
- `import { BellOff, Check, ChevronRight, Clock, Plus, Syringe } from 'reicon-react-native';`
- `import { healthKeys, petKeys } from '../../api/query-keys';`
- `import { CATEGORY_SLOTS } from '../../utils/category-palette';`
- `const today = localTodayIso();`
- `<View testID="vaccines-section" className="gap-2.5">`
- `{vaccines.data?.kind === 'ok'` seguido, en la línea siguiente, de
  `? vaccines.data.vaccines.map((vaccine, index) => {`

Receta de #227: los diez literales de R11 aparecen **1 vez** en
`screens/reminders/index.tsx` y **0** en `screens/health/index.tsx`.

Otros ficheros (cada literal aparece 1 vez salvo que se diga otra cosa):

| Ruta | Literal | Cuenta |
|---|---|---|
| `i18n/catalog.ts` | `  'health.createReminderNow': 'Create now',` | 1 |
| `i18n/catalog.ts` | `  'health.createReminderNow': 'Crear ahora',` | 1 |
| `i18n/catalog.ts` | `'health.sectionUpcoming'` | 0 |
| `i18n/catalog.ts` | `'health.sectionPast'` | 0 |
| `__tests__/ui-copy-table.ts` | `  { file: 'src/screens/health/index.tsx', key: 'tabHeader.petsScroll' }, // #222 R8` | 1 |
| `providers/__tests__/language-provider.test.tsx` | `        + 4, // #227 R1` | 1 |
| `__tests__/ui-language.test.ts` | `expect(R5_HEALTH).toHaveLength(32 + 1 + 1 - 2 + 3 + 2 + 1 + 1 + 4 - 1 + 1 + 7 - 1 + 1 + 1); // #222 R8` | 1 |
| `__tests__/consistency-classnames.test.ts` | `    [join('screens', 'health', 'index.tsx'), 2 + 1], // #115 R6` | 1 |
| `__tests__/consistency-classnames.test.ts` | `      14 + 4 + 1 + 1 + 1 + 1 + 1 + 2 + 1 + 1 + 2 + 1 + 1 + 1 + 1, // #208 R21` | 1 |
| `screens/health/index.test.tsx` | `    ChevronRight: icon('health-icon-chevron-right'),` | 1 |
| `screens/health/index.test.tsx` | `function elementChild(node: TestInstance, index: number): TestInstance {` | 1 |
| `screens/health/index.test.tsx` | `async function renderDates199(overrides: Partial<Vaccine>) {` | 1 |
| `screens/health/index.test.tsx` | `(enmendado por #241 R12)` | 0 |
| `utils/vaccine-dates.ts` | `export function addCalendarMonthsIso` | 1 |
| `utils/__tests__/vaccine-dates.test.ts` | `import { addCalendarMonthsIso } from '../vaccine-dates';` | 1 |
| `../../specs/mobile-ui-language/design.md` | `### §2.40` | 1 |
| `../../specs/mobile-ui-language/design.md` | `### §2.41` | 0 |
| `../../specs/mobile-health/requirements.md` | `## Enmienda #241` | 1 (la añade el commit de esta spec) |

Ningún selector por regex de `screens/health/index.test.tsx` ni de los guards
(`__tests__/`) empieza por `vaccines-`, así que los testIDs nuevos no caen bajo
ningún candado existente. Ninguna clase nueva es de color fuera de los tokens
que ya usa Salud (`text-muted`, `bg-default`).

## Convenciones de esta spec

- Rutas relativas a `mobile-pet-tracker/src/` salvo que se diga otra cosa.
- Cada test nuevo empieza por `#241 R<n>`. Los comentarios nuevos en
  producción que citen esta feature se escriben `#241 R<n>` (los guards de hex
  de `#222 R10` solo eximen `#NNN R<n>`).
- **Copy literal.** R1 fija los literales en es y en. Codex no inventa copy.
  El español es el que eligió el humano en G1 («Próximas y Pasadas»). **El
  inglés no lo dio el humano**: lo fija esta spec como traducción directa,
  igual que hizo #227 con `Upcoming` / `Past`. La mayúscula la pone la clase
  `uppercase`, no el literal.
- **Términos.** `today` es el `string` `YYYY-MM-DD` que ya calcula la pantalla
  con `localTodayIso()` (día civil **local** del dispositivo).
  - «próxima» es una vacuna con `nextDoseAt !== null` y `nextDoseAt > today`;
  - «pasada» es cualquier otra: `nextDoseAt <= today` o `nextDoseAt === null`;
  - la «fecha de orden» de una pasada es `nextDoseAt` y, si es `null`,
    `appliedAt`.
- **Relojes.** El `describe` nuevo de pantalla fija el reloj con
  `jest.useFakeTimers({ now: new Date(2026, 11, 31, 12, 0) })` en `beforeEach`
  y llama a `jest.useRealTimers()` en `afterEach`. Las fechas se construyen con
  el constructor local `new Date(y, m, d, h, min)`, nunca con una cadena `Z`.
- **Zona horaria.** R10 cambia la zona con el patrón de la tabla `fila $row`
  del mismo fichero: `const hostProcess = process.getBuiltinModule('process');`,
  guardar `hostProcess.env.TZ`, fijarla dentro de `try` y restaurarla en
  `finally` (borrar la variable si no existía). `process.env.TZ` a secas no
  cambia `Date` dentro de jest.
- **Tablas de fechas.** Las tablas de R2 y R10 cruzan mes y año (31 dic ↔ 1 ene
  y 30 sep ↔ 1 oct).
- **RNTL 14.** Todo `fireEvent`, `act` y render va con `await`. `within(x)` no
  incluye a `x`. Los iconos van dentro de nodos con
  `accessibilityElementsHidden`, así que se buscan con
  `{ includeHiddenElements: true }`.
- **Esperas** (`docs/conventions.md` §Esperas): cada `it` espera con `findBy…`
  o `waitFor` al nodo que aserta, no a otro.
- **Orden de hijos.** Se compara por testID
  (`node.children.map(c => typeof c === 'string' ? c : c.props.testID)`),
  nunca con `toBe` entre nodos.
- **Iconos doblados.** El doble de `reicon-react-native` de
  `screens/health/index.test.tsx` pinta un `View` con `size`, `strokeWidth`,
  `testID` del doble y `style={{ color }}`. El chevron de producción **no**
  lleva `testID`; los tests lo buscan por el `testID` del doble dentro de
  `vaccines-past-toggle`.
- Jest se corre por prefijo de ruta, sin paréntesis: `src/screens/health`,
  `src/utils`, `src/__tests__`, `src/providers`.
- **Skills que Codex carga antes de tocar UI** (nombres de nuestro catálogo;
  el leader los traduce a los de Codex en el handoff):
  `appllama-app-design-skill`, `expo-design-system`, `expo-native-ui` y
  `expo-animation`.

## Copy nuevo (es / en)

Dos claves nuevas en `i18n/catalog.ts`. Van en `en` y en `es` (que está tipado
`Record<TranslationKey, string>`), justo después de la línea
`'health.createReminderNow': …` de cada idioma, en este orden:

| Clave | es | en |
|---|---|---|
| `health.sectionUpcoming` | `Próximas` | `Upcoming` |
| `health.sectionPast` | `Pasadas` | `Past` |

No se reutiliza `reminders.sectionUpcoming` / `reminders.sectionPast`: su
español es masculino («Próximos», «Pasados») y «vacunas» es femenino.

Ninguna otra clave nueva. Ninguna clave se retira. Si Próximas queda vacía no
se pinta caja de vacío (R9), así que no hace falta copy de vacío.

## Requisitos funcionales

### Copy

- **R1**: THE SYSTEM SHALL declarar las dos claves de «Copy nuevo» con sus
  literales exactos en `es` y en `en`, invocar cada una desde exactamente un
  `t('<clave>'` de `screens/health/index.tsx`, registrar cada una en
  `R5_HEALTH` de `__tests__/ui-copy-table.ts` con la fila
  `{ file: 'src/screens/health/index.tsx', key: '<clave>' }`, y añadir al final
  de `specs/mobile-ui-language/design.md` la sección `§2.41` con una fila por
  clave (texto exacto en [[design]] §Archivos afectados).
  - Test: `__tests__/health-vaccines-upcoming-past.test.ts::#241 R1: las dos claves existen en es y en con su literal, una invocación cada una y su fila en §2.41`.
  - Aserta, por clave: `es[key]` y `en[key]` iguales al literal; el número de
    ocurrencias de `` t('${key}' `` en el fuente es 1; `R5_HEALTH`
    `toContainEqual` la fila; y el trozo de `design.md` entre
    `### §2.41 — Añadidos por #241` y el siguiente `\n### ` contiene una fila
    con `` `${key}` ``, `` `${en}` `` y `` `${es}` ``.

### Partición y orden (`utils/vaccine-dates.ts`)

- **R2**: WHEN `splitVaccines(vaccines, today)` recibe una vacuna THE SYSTEM
  SHALL ponerla en `upcoming` si `nextDoseAt !== null && nextDoseAt > today`, y
  en `past` en cualquier otro caso (`nextDoseAt <= today` o `null`). Cada
  vacuna sale en exactamente una de las dos listas.
  - Test: `utils/__tests__/vaccine-dates.test.ts::#241 R2: hoy %s, próxima dosis %s, va a %s`
    (`it.each` con columnas `[today, nextDoseAt, section]`). Cada fila llama a
    `splitVaccines([vaccine('v', nextDoseAt)], today)` y aserta que la lista
    nombrada tiene `['v']` y la otra `[]` (comparando ids).

    | today | nextDoseAt | section |
    |---|---|---|
    | `2026-12-31` | `2027-01-01` | `upcoming` |
    | `2026-12-31` | `2026-12-31` | `past` |
    | `2027-01-01` | `2026-12-31` | `past` |
    | `2026-12-31` | `null` | `past` |
    | `2026-09-30` | `2026-10-01` | `upcoming` |
    | `2026-10-01` | `2026-09-30` | `past` |
    | `2026-12-31` | `2027-12-31` | `upcoming` |
    | `2027-02-01` | `2026-12-15` | `past` |
    | `2026-12-15` | `2027-02-01` | `upcoming` |

- **R3**: WHEN `splitVaccines` devuelve sus listas THE SYSTEM SHALL ordenar
  `upcoming` por `nextDoseAt` ascendente y `past` por su fecha de orden
  (`nextDoseAt ?? appliedAt`) descendente, desempatar las dos por `id`
  ascendente (comparación de cadenas con `<` / `>`, no `localeCompare`), y no
  mutar el array de entrada.
  - Test: `utils/__tests__/vaccine-dates.test.ts::#241 R3: ordena próximas ascendente y pasadas descendente por su fecha, con empate por id`.
  - `today = '2026-12-31'`. Entrada, en este orden (`id`, `nextDoseAt`,
    `appliedAt`):

    | id | nextDoseAt | appliedAt |
    |---|---|---|
    | `u3` | `2027-03-01` | `2026-03-01` |
    | `p5` | `null` | `2026-10-01` |
    | `u2` | `2027-01-02` | `2026-01-02` |
    | `p1` | `2026-12-31` | `2025-12-31` |
    | `p3` | `2026-11-30` | `2025-11-30` |
    | `u1` | `2027-01-02` | `2026-01-05` |
    | `p4` | `2026-10-01` | `2025-10-01` |
    | `p2` | `null` | `2026-12-01` |

  - Espera `upcoming` = `['u1', 'u2', 'u3']` y `past` =
    `['p1', 'p2', 'p3', 'p4', 'p5']`, y que la entrada siga igual a una copia
    `[...input]` tomada antes de llamar (`toEqual`).
  - Por qué esta tabla: `u1`/`u2` y `p4`/`p5` empatan en fecha y llegan en
    orden inverso al esperado, así que un orden sin desempate por `id` falla;
    `p2` (sin próxima dosis, aplicada el 1 dic) va entre `p1` y `p3`, así que
    mandar los `null` al final falla.

### Pantalla (`screens/health/index.tsx`)

Fixture de pantalla `FIXTURE_241` (en el orden del API, `appliedAt`
descendente), con `makeVaccine({ id, name, appliedAt, nextDoseAt })` y el reloj
en `new Date(2026, 11, 31, 12, 0)` (hoy = `2026-12-31`):

| id | name | appliedAt | nextDoseAt | Sección | Tile |
|---|---|---|---|---|---|
| `none` | `Bordetella` | `2026-12-15` | `null` | Pasadas | verde |
| `later` | `Leptospirosis` | `2026-03-01` | `2027-03-01` | Próximas | verde |
| `future` | `Moquillo` | `2026-01-02` | `2027-01-02` | Próximas | verde |
| `today` | `Rabia` | `2025-12-31` | `2026-12-31` | Pasadas | ámbar (es la de la tarjeta) |
| `overdue` | `Parvovirus` | `2025-11-30` | `2026-11-30` | Pasadas | rosa |

Orden esperado: Próximas `future`, `later`; Pasadas `today`, `none`,
`overdue`. Los dos difieren del orden del API.

- **R4**: WHEN la lista de vacunas carga con al menos una próxima THE SYSTEM
  SHALL pintar, dentro de `vaccines-section` y justo después de
  `vaccines-header`, un `Text` `testID="vaccines-upcoming-heading"` con
  `accessibilityRole="header"`, className exacta
  `mt-1 text-13 font-extrabold uppercase tracking-caps text-muted` y texto
  `t('health.sectionUpcoming')`, seguido de un `View`
  `testID="vaccines-upcoming-list"` con className `gap-2.5` que contiene las
  filas próximas en el orden de R3.
  - Test: `screens/health/index.test.tsx::#241: vacunas próximas y pasadas > #241 R4: pinta «Próximas» y debajo sus filas de la más cercana a la más lejana`.
  - Espera con `findByTestId('vaccines-upcoming-list')`. Aserta: cabecera con
    texto exacto `Próximas`, rol y className; hijos de `vaccines-section` por
    testID = `['vaccines-header', 'vaccines-upcoming-heading', 'vaccines-upcoming-list', 'vaccines-past']`;
    className de la lista `gap-2.5`; filas
    `within(list).getAllByTestId(/^vaccine-row-/)` por testID =
    `['vaccine-row-future', 'vaccine-row-later']`.

- **R5**: WHEN la lista de vacunas carga con al menos una pasada THE SYSTEM
  SHALL pintar, después de la lista de Próximas (o de `vaccines-header` si no
  hay próximas), un `View` `testID="vaccines-past"` con className `gap-2.5`
  cuyo único hijo al entrar es el `Pressable` `testID="vaccines-past-toggle"`
  (className `mt-1 h-10 w-full flex-row items-center gap-2`,
  `accessibilityRole="button"`, `accessibilityState={{ expanded: false }}`,
  `hitSlop={TOUCH_SLOP}`), con dentro la etiqueta
  `testID="vaccines-past-label"` (className
  `text-13 font-extrabold uppercase tracking-caps text-muted`, texto
  `t('health.sectionPast')`), el contador `testID="vaccines-past-count"`
  (className `rounded-full bg-default px-2 py-0.5 text-xs font-extrabold text-muted`,
  `style={TABULAR_NUMS}`, texto = número de pasadas) y el chevron
  `ChevronDown` de 18 en `muted` dentro de un círculo
  `size-8 items-center justify-center rounded-full bg-default`. Las filas
  pasadas **no** se pintan al entrar. IF no hay ninguna pasada THEN THE SYSTEM
  SHALL no pintar `vaccines-past`.
  - Test: `screens/health/index.test.tsx::#241: vacunas próximas y pasadas > #241 R5: «Pasadas» empieza colapsada con su contador y el chevron abajo`.
    Espera con `findByTestId('vaccines-past-toggle')`. Aserta:
    `accessibilityRole` `button`; `accessibilityState?.expanded` `false`;
    `hitSlop` `toEqual({ top: 6, bottom: 6, left: 6, right: 6 })` (literal, no
    el símbolo importado); etiqueta con texto exacto `Pasadas` y su className;
    contador con texto exacto `3` y `style` `toEqual({ fontVariant: ['tabular-nums'] })`;
    `within(toggle).getByTestId('health-icon-chevron-down', { includeHiddenElements: true })`
    con `size` 18 y `style` `toEqual({ color: 'muted' })`;
    `health-icon-chevron-up` ausente; `vaccines-past-list` y las filas
    `vaccine-row-today`, `vaccine-row-none` y `vaccine-row-overdue` ausentes;
    `vaccines-past` con className `gap-2.5` e hijos por testID
    `['vaccines-past-toggle']`.
  - Test: `screens/health/index.test.tsx::#241: vacunas próximas y pasadas > #241 R5: sin pasadas no pinta la sección`.
    Fixture: solo `future` y `later`. Espera con
    `findByTestId('vaccines-upcoming-list')` y aserta `vaccines-past` y
    `vaccines-past-toggle` ausentes.

- **R6**: WHEN el usuario pulsa `vaccines-past-toggle` THE SYSTEM SHALL
  alternar Pasadas: expandida pinta, como segundo hijo de `vaccines-past`, un
  `View` `testID="vaccines-past-list"` con className `gap-2.5` y las filas
  pasadas en el orden de R3, pone `accessibilityState.expanded` a `true` y
  cambia el chevron a `ChevronUp`; otra pulsación vuelve al estado de R5.
  - Test: `screens/health/index.test.tsx::#241: vacunas próximas y pasadas > #241 R6: el encabezado alterna «Pasadas» y sus filas van de la más reciente a la más antigua`.
  - Tras `await expandVaccinesPast()` espera con
    `findByTestId('vaccines-past-list')`. Aserta: `expanded` `true`;
    `health-icon-chevron-up` presente y `health-icon-chevron-down` ausente
    dentro del toggle; hijos de `vaccines-past` =
    `['vaccines-past-toggle', 'vaccines-past-list']`; lista `gap-2.5`; filas
    por testID = `['vaccine-row-today', 'vaccine-row-none', 'vaccine-row-overdue']`.
    Segunda pulsación (`await fireEvent.press(toggle)`): espera con `waitFor` a
    que `vaccines-past-list` desaparezca y aserta `expanded` `false`.

- **R7**: WHILE una fila se pinta en Próximas o en Pasadas THE SYSTEM SHALL
  conservar su tile, icono y color de hoy (rosa con `Clock` si
  `nextDoseAt < today`; ámbar con `Clock` si es la vacuna de la tarjeta
  «Próxima dosis»; verde con `Check` en otro caso) y envolverla en `RiseIn` con
  `delayMs={80 + 60 * Math.min(index, 2)}`, donde `index` es su posición
  **dentro de su sección**.
  - Test: `screens/health/index.test.tsx::#241: vacunas próximas y pasadas > #241 R7: $id conserva su tile en $list y entra a los $delay ms`
    (`it.each`). Cada caso expande Pasadas primero, espera con
    `findByTestId('vaccines-past-list')`, comprueba que la fila está dentro de
    `vaccines-${list}-list`, y aserta la className del tile
    `vaccine-tile-${id}` (con `includeHiddenElements`), el icono del doble
    dentro del tile con `style` `toEqual({ color })`, y
    `riseDelayOf(row)` = `delay`.

    | id | list | surface (className del tile) | icon | color | delay |
    |---|---|---|---|---|---|
    | `future` | `upcoming` | `size-10 items-center justify-center rounded-xl bg-category-green` | `health-icon-check` | `category-green-strong` | 80 |
    | `later` | `upcoming` | `size-10 items-center justify-center rounded-xl bg-category-green` | `health-icon-check` | `category-green-strong` | 140 |
    | `today` | `past` | `size-10 items-center justify-center rounded-xl bg-category-amber` | `health-icon-clock` | `category-amber-strong` | 80 |
    | `none` | `past` | `size-10 items-center justify-center rounded-xl bg-category-green` | `health-icon-check` | `category-green-strong` | 140 |
    | `overdue` | `past` | `size-10 items-center justify-center rounded-xl bg-category-rose` | `health-icon-clock` | `category-rose-strong` | 200 |

- **R8**: WHILE una vacuna tiene `nextDoseAt === today` THE SYSTEM SHALL
  seguir destacándola en `next-vaccine-card` (el filtro de la tarjeta sigue
  siendo `nextDoseAt >= today`) y, a la vez, pintarla en Pasadas y no en
  Próximas.
  - Test: `screens/health/index.test.tsx::#241: vacunas próximas y pasadas > #241 R8: la dosis de hoy sale en «Próxima dosis» y en «Pasadas», no en «Próximas»`.
  - Espera con `findByTestId('next-vaccine-card')`. Aserta: dentro de la
    tarjeta, `getByText('Rabia')`; `next-vaccine-date` con texto exacto
    `31 de diciembre · hoy`; `next-vaccine-days` con texto exacto `Hoy`;
    `within(vaccines-upcoming-list).queryByTestId('vaccine-row-today')` nulo.
    Tras expandir y esperar a `vaccines-past-list`, su primera fila es
    `vaccine-row-today`.

- **R9**: IF la lista carga sin ninguna próxima THEN THE SYSTEM SHALL no pintar
  `vaccines-upcoming-heading` ni `vaccines-upcoming-list` (ni caja de vacío),
  y `vaccines-past` va justo después de `vaccines-header`. IF la lista carga
  vacía THEN THE SYSTEM SHALL conservar el vacío actual (`vaccines-empty-card`
  para el dueño, `vaccines-empty` para el resto) sin pintar ninguna de las dos
  secciones.
  - Test: `screens/health/index.test.tsx::#241: vacunas próximas y pasadas > #241 R9: sin próximas no pinta su cabecera ni su lista`.
    Fixture: `today`, `none` y `overdue`. Espera con
    `findByTestId('vaccines-past-count')` y aserta texto exacto `3`; cabecera
    y lista de Próximas ausentes; hijos de `vaccines-section` =
    `['vaccines-header', 'vaccines-past']`.
  - Test: `screens/health/index.test.tsx::#241: vacunas próximas y pasadas > #241 R9: sin vacunas conserva el vacío sin secciones`.
    Fixture: `vaccines: []` (la mascota es `owner`). Espera con
    `findByTestId('vaccines-empty-card')` y aserta
    `vaccines-upcoming-heading`, `vaccines-upcoming-list` y `vaccines-past`
    ausentes. Nace verde: lleva sonda de mutación (ver [[tasks]]).

- **R10**: WHEN el reloj cruza medianoche en hora local THE SYSTEM SHALL
  decidir la sección con el día civil **local** (`localTodayIso()`), no con el
  día UTC.
  - Test: `screens/health/index.test.tsx::#241: vacunas próximas y pasadas > #241 R10: a las $hora en $tz la dosis del $dosis va a $seccion`
    (`it.each`), con una sola vacuna `makeVaccine({ id: 'edge', nextDoseAt: dosis })`
    y el patrón de zona horaria de «Convenciones».
  - Casos `upcoming`: espera con `findByTestId('vaccines-upcoming-list')` y
    aserta que contiene `vaccine-row-edge`. Casos `past`: espera con
    `findByTestId('vaccines-past-count')`, aserta texto exacto `1`, expande y
    aserta que `vaccines-past-list` contiene `vaccine-row-edge`.

    | tz | hora local (`new Date(…)`) | dosis | sección | Instante UTC |
    |---|---|---|---|---|
    | `America/Mexico_City` | `(2026, 11, 31, 23, 59)` | `2027-01-01` | `upcoming` | `2027-01-01T05:59Z` |
    | `Pacific/Auckland` | `(2027, 0, 1, 0, 1)` | `2027-01-01` | `past` | `2026-12-31T11:01Z` |
    | `America/Mexico_City` | `(2026, 8, 30, 23, 59)` | `2026-10-01` | `upcoming` | `2026-10-01T05:59Z` |
    | `Pacific/Auckland` | `(2026, 9, 1, 0, 1)` | `2026-10-01` | `past` | `2026-09-30T11:01Z` |

    Con un «hoy» UTC las cuatro filas cambiarían de sección.

### Fidelidad a #227 e inventario

- **R11**: THE SYSTEM SHALL pintar la cabecera de Pasadas con la misma receta
  que la de Recordatorios: cada uno de estos diez literales aparece
  exactamente una vez en `screens/health/index.tsx` y está contenido en
  `screens/reminders/index.tsx`.
  1. `className="mt-1 text-13 font-extrabold uppercase tracking-caps text-muted"`
  2. `className="mt-1 h-10 w-full flex-row items-center gap-2"`
  3. `className="flex-1 flex-row items-center gap-2"`
  4. `className="text-13 font-extrabold uppercase tracking-caps text-muted"`
  5. `className="rounded-full bg-default px-2 py-0.5 text-xs font-extrabold text-muted" style={TABULAR_NUMS}`
  6. `className="size-8 items-center justify-center rounded-full bg-default"`
  7. `<PastChevron size={18} color={muted} />`
  8. `accessibilityRole="button" accessibilityState={{ expanded: pastExpanded }} hitSlop={TOUCH_SLOP} style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })} onPress={() => setPastExpanded((current) => !current)}`
  9. `const PastChevron = pastExpanded ? ChevronUp : ChevronDown;`
  10. `const [pastExpanded, setPastExpanded] = useState(false);`

  Además THE SYSTEM SHALL dejar el fuente de Salud con las cuentas de la
  columna «Tras el cambio» de §Evidencia.
  - Test: `__tests__/health-vaccines-upcoming-past.test.ts::#241 R11: %s` (`it.each`
    sobre los diez literales; aserta ocurrencias en Salud = 1 y
    `reminders.includes(literal)`).
  - Test: `__tests__/health-vaccines-upcoming-past.test.ts::#241 R11: inventario del fuente`
    (aserta cada fila de la tabla de producción de §Evidencia con
    `source.split(literal).length - 1`).
  - Ningún literal de la lista es subcadena de otro (todos empiezan por
    `className="`, `<`, `accessibilityRole` o `const` y difieren desde el
    primer atributo), así que cada cuenta mide un solo nodo.
  - Los atributos del `Pressable` (literal 8) van en una sola línea y en ese
    orden, como en Recordatorios. Móvil no tiene prettier que los reparta.

### Enmiendas

- **R12**: WHEN un candado existente cambia por esta feature THE SYSTEM SHALL
  llevar en su título (del `it`, del `it.each` o del `describe`) el sufijo
  ` (enmendado por #241 R12)`, y la spec enmendada
  `specs/mobile-health/requirements.md` SHALL llevar la sección
  `## Enmienda #241 — Salud: vacunas próximas y pasadas` una vez y su casilla.
  - Test: `__tests__/health-vaccines-upcoming-past.test.ts::#241 R12: los candados enmendados nombran su enmienda y la spec enmendada lleva su casilla`.
  - Recorre `AMENDED`, una lista de pares `[ruta relativa a src, localizador]`.
    Por cada par, exactamente una línea del fichero contiene el localizador, y
    esa línea contiene `(enmendado por #241 R12)`. `AMENDED` es la de la
    §Tabla de enmiendas más los candados que añada la Regla de cierre.
  - Lee `../specs/mobile-health/requirements.md` (desde `process.cwd()`, que es
    `mobile-pet-tracker/`): la cabecera aparece 1 vez y el texto casa con
    `/- \[[ xX]\] Enmienda #241 aprobada por humano/` (tolerante: sigue verde
    cuando se firma).

## Tabla de enmiendas

### Candados en `screens/health/index.test.tsx`

Doble y ayudante (no son candados, no llevan sufijo):

- En el doble de `reicon-react-native`, después de
  `    ChevronRight: icon('health-icon-chevron-right'),`, añadir
  `    ChevronDown: icon('health-icon-chevron-down'),` y
  `    ChevronUp: icon('health-icon-chevron-up'),`.
- Después de la función `elementChild`, añadir:
  `async function expandVaccinesPast() { await fireEvent.press(await screen.findByTestId('vaccines-past-toggle')); }`

| Localizador (para `AMENDED`) | Por qué cambia | Cambio |
|---|---|---|
| `highlights the nearest future dose and sorts upcoming rows by next dose` | (b) el orden es por sección | Se renombra desde `highlights the nearest future dose and keeps row order (enmendado por #199 R14)` a `highlights the nearest future dose and sorts upcoming rows by next dose (enmendado por #199 R14) (enmendado por #241 R12)`. Las filas esperadas pasan a `['vaccine-row-vaccine-1', 'vaccine-row-vaccine-2']`. |
| `omits the next card when every dose is past or null` | (a) las dos filas quedan colapsadas en Pasadas | El `waitFor` pasa a `await waitFor(() => expect(screen.getByTestId('vaccines-past-count')).toHaveTextContent('2', { exact: true }));`. |
| `marks an overdue next-dose date with the danger token` | (a) la fila vencida está en Pasadas | `await expandVaccinesPast();` justo después de `await renderHealth();`. |
| `pinta el estado de $id con su icono y textos` (#168 R3) | (a) `overdue`, `next` y `completed` están en Pasadas | Cada fila del `it.each` gana `past` (`overdue: true`, `next: true`, `future: false`, `completed: true`), se desestructura, y tras `await renderHealth();` va `if (past) await expandVaccinesPast();`. |
| `describe('#199 R16: filas de vacunas` | (a) las cuatro (sin próxima dosis) están en Pasadas | Los dos `it` llevan `await expandVaccinesPast();` tras `await renderHealth();`. El sufijo va en el título del `describe`. Los retrasos 80/140/200/200 no cambian (empatan en `appliedAt` y salen por id). |
| `describe('#199 R17: subtítulo de vacunas` | (a) tres de sus cuatro casos están en Pasadas | `renderDates199(overrides: Partial<Vaccine>, past = true)` llama a `if (past) await expandVaccinesPast();` tras `await renderHealth();`. Solo `#199 R17 una dosis vigente no pinta text-danger` pasa `false`. El sufijo va en el título del `describe`. |

Que la línea del localizador sea única se comprueba en R12; las seis lo son en
la base (medido).

### Candados de guards y de recuento

| Fichero | Localizador (para `AMENDED`) | Por qué | Cambio |
|---|---|---|---|
| `__tests__/consistency-classnames.test.ts` | `%s aplica TABULAR_NUMS a sus %i valores` | (d) +1 `TABULAR_NUMS` en Salud | `    [join('screens', 'health', 'index.tsx'), 2 + 1], // #115 R6` pasa a `    [join('screens', 'health', 'index.tsx'), 2 + 1 + 1], // #115 R6; #241 R5`. Sufijo en el título. |
| `__tests__/consistency-classnames.test.ts` | `#69 R10: mantiene la base cerrada más los deltas medidos` | (d) la misma unidad en el total | A la suma `      14 + 4 + 1 + 1 + 1 + 1 + 1 + 2 + 1 + 1 + 2 + 1 + 1 + 1 + 1, // #208 R21; …; #227 R5` se le añade ` + 1` antes de la coma y `; #241 R5` al final del comentario. Sufijo en el título. |
| `providers/__tests__/language-provider.test.tsx` | `#194 R1: mantiene la base más las claves de #68` | (d) dos claves nuevas | `        + 4, // #227 R1` pasa a `        + 4 // #227 R1` y debajo va la línea nueva `        + 2, // #241 R1`. Sufijo en el título. |
| `__tests__/ui-language.test.ts` | `#186 R7: resuelve las 43 ocurrencias normativas` | (d) dos filas nuevas en `R5_HEALTH` | En `expect(R5_HEALTH).toHaveLength(32 + … + 1 + 1); // #222 R8 // …` se añade ` + 2` antes de `);` y `// #241 R1 ` antes de `// #222 R8`. El 43 del título no cambia (cuenta otra cosa). Sufijo en el título. |

No llevan sufijo porque su fichero no es un candado: `i18n/catalog.ts` (dos
claves por idioma), `__tests__/ui-copy-table.ts` (dos filas tras
`  { file: 'src/screens/health/index.tsx', key: 'tabHeader.petsScroll' }, // #222 R8`,
con comentario `// #241 R1`) y `specs/mobile-ui-language/design.md` (§2.41).

### Candados que se comprobaron y no cambian

- `screens/health/index.test.tsx`: la tabla `fila $row` (#199 R14/R25), `re-resolves the syringe token…`,
  vacío y error, `#168 R1`, `#168 R2`, `#181 R6`, `#199 R13` (fechas 2099, en
  Próximas), `#199 R14`, `#199 R15`, `#199 R18`, `#199 R19`, `#208` y `#222`.
- `__tests__/design-drift.test.ts`: guard de `reicon-react-native`,
  `rounded-16`, los conteos de `#87 R19`.
- `__tests__/alerts-canvas*.test.ts`: las listas de `tracking-caps` y
  `text-15` ya incluyen Salud.
- Los guards de `hitSlop`, legibilidad, `tab-headers` (`#222 R14` y el guard de
  hex `#222 R10`), `chunky-cta`, `profile-canvas`, `empty-state`,
  `#194 R5` y `health-weight-canvas` (que solo pide
  `toContain('80 + 60 * Math.min(')`).
- `SCREEN_FILES` no cambia (Salud ya está). Ninguna clave se retira.

### Regla de cierre

Codex mide la línea base antes de tocar nada (T0 de [[tasks]]). Si al final
algún test **existente** sale rojo y la causa es solo una de estas:

- (a) una fila que ahora está colapsada en Pasadas;
- (b) el orden, que ahora es por sección;
- (c) el índice del retraso, que ahora cuenta por sección;
- (d) un delta de inventario de esta spec (+1 `TABULAR_NUMS`, +1
  `hitSlop={TOUCH_SLOP}`, los dos iconos nuevos, las dos claves nuevas),

Codex lo enmienda con el sufijo, añade su par a `AMENDED` y lo anota en
`progress/impl_mobile-health-vaccines-upcoming-past.md` con la causa. Cualquier
otro rojo se reporta y **no** se toca. Flakes conocidos que no se enmiendan
(rerun y anotar): Salud `#168 R2`, Inicio `#152 R8`, Nutrición `#200 R9` y
`#200 R10`.

### Specs enmendadas

- `specs/mobile-health/requirements.md` (#37), **R5**: «listar todas las vacunas
  en el orden recibido (descendente por `appliedAt`)» pasa a dos secciones.
  La sección `## Enmienda #241 — Salud: vacunas próximas y pasadas` (antes de
  `## Aprobación`) la añade el commit de esta spec, con su casilla sin marcar.
- `specs/mobile-health/requirements.md` R1 (contrato del API, orden descendente
  por `appliedAt`) **no** cambia: el orden nuevo se hace en el móvil.
- #199 R16 (filas) y #199 R14 (tarjeta) no cambian de texto: lo que se toca son
  sus tests, por la Tabla de enmiendas.

## Paso de smoke nuevo (G2)

En el dev build de Android, con una mascota que tenga cuatro vacunas: una con
próxima dosis **hoy**, una con próxima dosis **futura**, una con próxima dosis
**vencida** y una **sin** próxima dosis. Se recorre en tema claro y en tema
oscuro.

1. Abrir Salud. La tarjeta «PRÓXIMA DOSIS» muestra la vacuna de hoy con «hoy»
   y «Hoy».
2. Debajo de «Vacunas», «PRÓXIMAS» lista solo la futura.
3. «PASADAS» sale colapsada, con contador 3 y el chevron hacia abajo.
4. Pulsar «PASADAS»: se abre con la de hoy (ámbar) primero y el resto de la más
   reciente a la más antigua por su fecha (próxima dosis o, si no tiene,
   fecha de aplicación): la vencida en rosa y la que no tiene próxima dosis en
   verde. El chevron apunta hacia arriba.
5. Pulsar otra vez: se colapsa.
6. Repetir 1 a 5 en el otro tema.

El leader lo registra en `progress/smoke_arreglos-smoke.md` bajo
`## #241 mobile-health-vaccines-upcoming-past`.

## Artboard

**No hace falta artboard.** La cabecera, el contador y el chevron son la receta
de Recordatorios (#227, canvas v167) sin cambios (R11 lo comprueba literal a
literal). Las filas no cambian. Lo único propio de Salud es el espacio entre
filas (`gap-2.5`, el ritmo que ya tiene `vaccines-section`, en lugar del
`gap-3` de Recordatorios) y que Próximas vacía no pinta nada en vez de una caja
(R9). Ninguna de las dos cosas añade un elemento nuevo que dibujar. La casilla
«G1 de #241, artboard» del plan §5 se tacha.

## Fuera de alcance

- Una sección propia para las vencidas o un aviso de ellas: el humano aceptó
  que queden en Pasadas (plan §6).
- Atenuar las filas de Pasadas en Salud como en Recordatorios (plan §6).
- Deslizar para borrar en Salud (plan §6).
- Extraer un componente compartido de cabecera de sección entre Recordatorios,
  Alertas y Salud.
- Recordar el estado expandido de Pasadas entre sesiones o por mascota.
- #230 iOS (su casilla sigue abierta en su spec).
- Ordenar en el backend o cambiar el contrato de `GET /vaccines`.
- Enmiendas de `docs/ui-guidelines.md` o `docs/conventions.md` (no hay G4).

## Decisiones

Cerradas en [[design]]: D1 (la partición vive en `utils/vaccine-dates.ts`), D2
(la receta se copia, no se extrae), D3 (una sola `renderVaccineRow`), D4
(`gap-2.5`), D5 (Próximas vacía se omite), D6 (`>=` en la tarjeta, `>` en
Próximas), D7 (solo se enmienda #37 R5) y D8 (el retraso de entrada cuenta por
sección).

`pastExpanded` vive en el estado de la pantalla y no se reinicia al cambiar de
mascota, igual que en #227. No lleva test.

## Aprobación

- [X] Aprobado por humano (fecha: 2026-11-04; firma delegada del leader, mandato del humano 2026-10-23 ampliado 2026-11-04) ← gate obligatorio antes de implementar (firma delegada del leader con la checklist de `progress/plan_canvas-parity-2026-10-23.md` §4, los tres puntos del §4 de `progress/plan_ui-2026-10-26.md` y los dos de `progress/plan_mejoras-smoke-2026-11-03.md` §4; mandato del humano 2026-10-23, ampliado el 2026-11-04)
- [ ] **G2**: smoke en el dev build de Android (pasos de «Paso de smoke nuevo», tema claro y oscuro) (fecha: ____) ← gate humano, por lote al final; lo registra `progress/smoke_arreglos-smoke.md`
- Base congelada: `0f1ab26f` (`origin/dev`).

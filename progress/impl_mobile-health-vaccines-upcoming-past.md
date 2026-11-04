# Reporte de implementación — #241 mobile-health-vaccines-upcoming-past

R1–R12 implementados y verificados. `./init.sh` corresponde al leader; no se ejecuta. Sin PR ni cambios de estado de feature. G2 sigue reservado al humano.

## Comprobación inicial

```text
/home/claude/sites/Pet-Tracker-wt-241
feature/241-mobile-health-vaccines-upcoming-past
7fe02383 docs(progress): #241 codex handoff
2313669a chore(spec): firma delegada #241 (mandato del humano 2026-10-23, ampliado 2026-11-04)
74a98a5a docs(spec): split health vaccines into upcoming and past sections (#241)
0f1ab26f Merge pull request #306 from TrackerMex/docs/plan-arreglos-smoke-2026-11-04
```

La comprobación prescrita se ejecutó tras leer el handoff y el estado del árbol, no fue el primer comando material de la sesión. Árbol inicial limpio. H0: `2313669a`; base del diff: `7fe02383`. T0 (1) ya preparado, sin instalaciones.

## Skills y reglas

Cargadas: `ponytail` y `building-native-ui` (`/home/claude/.codex/plugins/cache/openai-curated/expo/11c74d6b/skills/building-native-ui/SKILL.md`). La spec y la carta del repo prevalecen. Leídos architecture, conventions (incluida §Esperas), ui-guidelines, verification, CHECKPOINTS y los cuatro documentos de la spec. Consultada la documentación de Expo SDK 57 exigida por mobile-pet-tracker/AGENTS.md: https://docs.expo.dev/versions/v57.0.0/.

## T0 — Anclas y cuentas

Medidas por ocurrencias desde `mobile-pet-tracker/src/` con el `node -e` prescrito. Todas coinciden.

| Ruta | Literal | Esperado | Medido |
|---|---|---:|---:|
| `screens/health/index.tsx` | `style={TABULAR_NUMS}` | 3 | 3 |
| `screens/health/index.tsx` | `hitSlop={TOUCH_SLOP}` | 1 | 1 |
| `screens/health/index.tsx` | `style={CONTINUOUS_CORNER}` | 7 | 7 |
| `screens/health/index.tsx` | `accessibilityRole="header"` | 2 | 2 |
| `screens/health/index.tsx` | `className="gap-2.5"` | 1 | 1 |
| `screens/health/index.tsx` | `tracking-caps` | 1 | 1 |
| `screens/health/index.tsx` | `uppercase` | 1 | 1 |
| `screens/health/index.tsx` | `bg-default` | 1 | 1 |
| `screens/health/index.tsx` | `<Pressable` | 2 | 2 |
| `screens/health/index.tsx` | `rounded-full` | 4 | 4 |
| `screens/health/index.tsx` | `t('` | 30 | 30 |
| `screens/health/index.tsx` | `useState(false)` | 0 | 0 |
| `screens/health/index.tsx` | `import { useState } from 'react';` | 0 | 0 |
| `screens/health/index.tsx` | `splitVaccines(` | 0 | 0 |
| `screens/health/index.tsx` | `sections.upcoming.map(renderVaccineRow)` | 0 | 0 |
| `screens/health/index.tsx` | `sections.past.map(renderVaccineRow)` | 0 | 0 |
| `screens/health/index.tsx` | `vaccines.data.vaccines.map(` | 1 | 1 |
| `screens/health/index.tsx` | `delayMs={80 + 60 * Math.min(index, 2)}` | 1 | 1 |
| `screens/health/index.tsx` | `nextDoseAt >= today` | 1 | 1 |
| `screens/health/index.tsx` | `accessibilityState` | 0 | 0 |
| `screens/health/index.tsx` | `import { Button, Skeleton } from 'heroui-native';` | 1 | 1 |
| `screens/health/index.tsx` | `import { Pressable, ScrollView, Text, View } from 'react-native';` | 1 | 1 |
| `screens/health/index.tsx` | `import { BellOff, Check, ChevronRight, Clock, Plus, Syringe } from 'reicon-react-native';` | 1 | 1 |
| `screens/health/index.tsx` | `import { healthKeys, petKeys } from '../../api/query-keys';` | 1 | 1 |
| `screens/health/index.tsx` | `import { CATEGORY_SLOTS } from '../../utils/category-palette';` | 1 | 1 |
| `screens/health/index.tsx` | `const today = localTodayIso();` | 1 | 1 |
| `screens/health/index.tsx` | `<View testID="vaccines-section" className="gap-2.5">` | 1 | 1 |
| `screens/health/index.tsx` | `{vaccines.data?.kind === 'ok' ↵                   ? vaccines.data.vaccines.map((vaccine, index) => {` | 1 | 1 |
| `screens/reminders/index.tsx` | `className="mt-1 text-13 font-extrabold uppercase tracking-caps text-muted"` | 1 | 1 |
| `screens/health/index.tsx` | `className="mt-1 text-13 font-extrabold uppercase tracking-caps text-muted"` | 0 | 0 |
| `screens/reminders/index.tsx` | `className="mt-1 h-10 w-full flex-row items-center gap-2"` | 1 | 1 |
| `screens/health/index.tsx` | `className="mt-1 h-10 w-full flex-row items-center gap-2"` | 0 | 0 |
| `screens/reminders/index.tsx` | `className="flex-1 flex-row items-center gap-2"` | 1 | 1 |
| `screens/health/index.tsx` | `className="flex-1 flex-row items-center gap-2"` | 0 | 0 |
| `screens/reminders/index.tsx` | `className="text-13 font-extrabold uppercase tracking-caps text-muted"` | 1 | 1 |
| `screens/health/index.tsx` | `className="text-13 font-extrabold uppercase tracking-caps text-muted"` | 0 | 0 |
| `screens/reminders/index.tsx` | `className="rounded-full bg-default px-2 py-0.5 text-xs font-extrabold text-muted" style={TABULAR_NUMS}` | 1 | 1 |
| `screens/health/index.tsx` | `className="rounded-full bg-default px-2 py-0.5 text-xs font-extrabold text-muted" style={TABULAR_NUMS}` | 0 | 0 |
| `screens/reminders/index.tsx` | `className="size-8 items-center justify-center rounded-full bg-default"` | 1 | 1 |
| `screens/health/index.tsx` | `className="size-8 items-center justify-center rounded-full bg-default"` | 0 | 0 |
| `screens/reminders/index.tsx` | `<PastChevron size={18} color={muted} />` | 1 | 1 |
| `screens/health/index.tsx` | `<PastChevron size={18} color={muted} />` | 0 | 0 |
| `screens/reminders/index.tsx` | `accessibilityRole="button" accessibilityState={{ expanded: pastExpanded }} hitSlop={TOUCH_SLOP} style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })} onPress={() => setPastExpanded((current) => !current)}` | 1 | 1 |
| `screens/health/index.tsx` | `accessibilityRole="button" accessibilityState={{ expanded: pastExpanded }} hitSlop={TOUCH_SLOP} style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })} onPress={() => setPastExpanded((current) => !current)}` | 0 | 0 |
| `screens/reminders/index.tsx` | `const PastChevron = pastExpanded ? ChevronUp : ChevronDown;` | 1 | 1 |
| `screens/health/index.tsx` | `const PastChevron = pastExpanded ? ChevronUp : ChevronDown;` | 0 | 0 |
| `screens/reminders/index.tsx` | `const [pastExpanded, setPastExpanded] = useState(false);` | 1 | 1 |
| `screens/health/index.tsx` | `const [pastExpanded, setPastExpanded] = useState(false);` | 0 | 0 |
| `i18n/catalog.ts` | `  'health.createReminderNow': 'Create now',` | 1 | 1 |
| `i18n/catalog.ts` | `  'health.createReminderNow': 'Crear ahora',` | 1 | 1 |
| `i18n/catalog.ts` | `'health.sectionUpcoming'` | 0 | 0 |
| `i18n/catalog.ts` | `'health.sectionPast'` | 0 | 0 |
| `__tests__/ui-copy-table.ts` | `  { file: 'src/screens/health/index.tsx', key: 'tabHeader.petsScroll' }, // #222 R8` | 1 | 1 |
| `providers/__tests__/language-provider.test.tsx` | `        + 4, // #227 R1` | 1 | 1 |
| `__tests__/ui-language.test.ts` | `expect(R5_HEALTH).toHaveLength(32 + 1 + 1 - 2 + 3 + 2 + 1 + 1 + 4 - 1 + 1 + 7 - 1 + 1 + 1); // #222 R8` | 1 | 1 |
| `__tests__/consistency-classnames.test.ts` | `    [join('screens', 'health', 'index.tsx'), 2 + 1], // #115 R6` | 1 | 1 |
| `__tests__/consistency-classnames.test.ts` | `      14 + 4 + 1 + 1 + 1 + 1 + 1 + 2 + 1 + 1 + 2 + 1 + 1 + 1 + 1, // #208 R21` | 1 | 1 |
| `screens/health/index.test.tsx` | `    ChevronRight: icon('health-icon-chevron-right'),` | 1 | 1 |
| `screens/health/index.test.tsx` | `function elementChild(node: TestInstance, index: number): TestInstance {` | 1 | 1 |
| `screens/health/index.test.tsx` | `async function renderDates199(overrides: Partial<Vaccine>) {` | 1 | 1 |
| `screens/health/index.test.tsx` | `(enmendado por #241 R12)` | 0 | 0 |
| `utils/vaccine-dates.ts` | `export function addCalendarMonthsIso` | 1 | 1 |
| `utils/__tests__/vaccine-dates.test.ts` | `import { addCalendarMonthsIso } from '../vaccine-dates';` | 1 | 1 |
| `../../specs/mobile-ui-language/design.md` | `### §2.40` | 1 | 1 |
| `../../specs/mobile-ui-language/design.md` | `### §2.41` | 0 | 0 |
| `../../specs/mobile-health/requirements.md` | `## Enmienda #241` | 1 | 1 |

T0: **P = 1746 pasados, 0 fallidos; 68 suites; exit 0**. Log: `progress/t0_mobile-health-vaccines-upcoming-past.log`. 68 suites incluyen `ui-copy-table.ts`, que Jest selecciona bajo `__tests__`.

Los `●` de T0 (2):
- `● Console`
- `● Console`


## Cadena TDD

- `4e312a3a` — `test(mobile): splitVaccines puts each vaccine on its side of today (R2)`: **9 fallidos, 1746 pasados**. Rojo legítimo: TypeError, splitVaccines is not a function; las nueve filas ejercitan el módulo existente. Log: `/tmp/r2-red-241.log`.
  - `● Console`
  - `● #241 R2: hoy 2026-12-31, próxima dosis 2027-01-01, va a upcoming`
  - `● #241 R2: hoy 2026-12-31, próxima dosis 2026-12-31, va a past`
  - `● #241 R2: hoy 2027-01-01, próxima dosis 2026-12-31, va a past`
  - `● #241 R2: hoy 2026-12-31, próxima dosis null, va a past`
  - `● #241 R2: hoy 2026-09-30, próxima dosis 2026-10-01, va a upcoming`
  - `● #241 R2: hoy 2026-10-01, próxima dosis 2026-09-30, va a past`
  - `● #241 R2: hoy 2026-12-31, próxima dosis 2027-12-31, va a upcoming`
  - `● #241 R2: hoy 2027-02-01, próxima dosis 2026-12-15, va a past`
  - `● #241 R2: hoy 2026-12-15, próxima dosis 2027-02-01, va a upcoming`
  - `● Console`
  - `● #241 R2: hoy 2026-12-31, próxima dosis 2027-01-01, va a upcoming`
  - `● #241 R2: hoy 2026-12-31, próxima dosis 2026-12-31, va a past`
  - `● #241 R2: hoy 2027-01-01, próxima dosis 2026-12-31, va a past`
  - `● #241 R2: hoy 2026-12-31, próxima dosis null, va a past`
  - `● #241 R2: hoy 2026-09-30, próxima dosis 2026-10-01, va a upcoming`
  - `● #241 R2: hoy 2026-10-01, próxima dosis 2026-09-30, va a past`
  - `● #241 R2: hoy 2026-12-31, próxima dosis 2027-12-31, va a upcoming`
  - `● #241 R2: hoy 2027-02-01, próxima dosis 2026-12-15, va a past`
  - `● #241 R2: hoy 2026-12-15, próxima dosis 2027-02-01, va a upcoming`
- `97def26e` — `feat(mobile): splitVaccines partitions vaccines around today (R2)`: **0 fallidos, 1755 pasados**. Verde: P + 9; partición sin ordenar. Log: `/tmp/r2-green-241.log`.
  - `● Console`
  - `● Console`
- `df70c6f0` — `test(mobile): splitVaccines orders both sections with an id tie-break (R3)`: **1 fallidos, 1755 pasados**. Rojo legítimo de aserción: el array upcoming conserva u3,u2,u1 en vez de u1,u2,u3. Log: `/tmp/r3-red-241.log`.
  - `● Console`
  - `● #241 R3: ordena próximas ascendente y pasadas descendente por su fecha, con empate por id`
  - `● Console`
  - `● #241 R3: ordena próximas ascendente y pasadas descendente por su fecha, con empate por id`
- `5d46f1b6` — `feat(mobile): splitVaccines sorts upcoming ascending and past descending (R3)`: **0 fallidos, 1756 pasados**. Verde: P + 10; fechas e id ordenados sin mutar el array de entrada. Log: `/tmp/r3-green-241.log`.
  - `● Console`
  - `● Console`

### Diferencia de recuento explicada desde R1/R11

La corrida mide 12 fallidos y **1758 pasados**, frente a 1756 previstos. El import prescrito `import { R5_HEALTH } from './ui-copy-table'` ejecuta los dos `it` que el propio módulo declara bajo `describe('#65: la tabla de uso de copy está disponible al runner')`: `expone al menos el primer lote normativo` y `#194 R5: cuadra ALL_USES con la suma de sus bloques (...)`. Se vuelven a registrar en la suite nueva, igual que en otros consumidores. No hay tests extra escritos ni cambios de spec. Se mantiene P = 1746 y se aplica **+2** a todos los totales posteriores: T-verde = P + 39 = 1785, vacío = P + 40 = 1786 y final = P + 41 = 1787. El número de fallidos sigue exactamente la cadena del handoff. No es un PARA: causa identificada en el fuente de ui-copy-table.ts, al final del fichero.

- `9d7e5874` — `test(mobile): copy and #227 recipe locks for the health sections (R1, R11)`: **12 fallidos, 1758 pasados**. Rojo legítimo de aserción: faltan claves y receta; inventario aún en la base. +2 pasados por los tests importados de ui-copy-table. Log: `/tmp/r1-r11-red-241.log`.
  - `● #241 R1: las dos claves existen en es y en con su literal, una invocación cada una y su fila en §2.41`
  - `● #241 R11: className="mt-1 text-13 font-extrabold uppercase tracking-caps text-muted"`
  - `● #241 R11: className="mt-1 h-10 w-full flex-row items-center gap-2"`
  - `● #241 R11: className="flex-1 flex-row items-center gap-2"`
  - `● #241 R11: className="text-13 font-extrabold uppercase tracking-caps text-muted"`
  - `● #241 R11: className="rounded-full bg-default px-2 py-0.5 text-xs font-extrabold text-muted" style={TABULAR_NUMS}`
  - `● #241 R11: className="size-8 items-center justify-center rounded-full bg-default"`
  - `● #241 R11: <PastChevron size={18} color={muted} />`
  - `● #241 R11: accessibilityRole="button" accessibilityState={{ expanded: pastExpanded }} hitSlop={TOUCH_SLOP} style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })} onPress={() => setPastExpanded((current) => !current)}`
  - `● #241 R11: const PastChevron = pastExpanded ? ChevronUp : ChevronDown;`
  - `● #241 R11: const [pastExpanded, setPastExpanded] = useState(false);`
  - `● #241 R11: inventario del fuente`
  - `● Console`
  - `● Console`
  - `● #241 R1: las dos claves existen en es y en con su literal, una invocación cada una y su fila en §2.41`
  - `● #241 R11: className="mt-1 text-13 font-extrabold uppercase tracking-caps text-muted"`
  - `● #241 R11: className="mt-1 h-10 w-full flex-row items-center gap-2"`
  - `● #241 R11: className="flex-1 flex-row items-center gap-2"`
  - `● #241 R11: className="text-13 font-extrabold uppercase tracking-caps text-muted"`
  - `● #241 R11: className="rounded-full bg-default px-2 py-0.5 text-xs font-extrabold text-muted" style={TABULAR_NUMS}`
  - `● #241 R11: className="size-8 items-center justify-center rounded-full bg-default"`
  - `● #241 R11: <PastChevron size={18} color={muted} />`
  - `● #241 R11: accessibilityRole="button" accessibilityState={{ expanded: pastExpanded }} hitSlop={TOUCH_SLOP} style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })} onPress={() => setPastExpanded((current) => !current)}`
  - `● #241 R11: const PastChevron = pastExpanded ? ChevronUp : ChevronDown;`
  - `● #241 R11: const [pastExpanded, setPastExpanded] = useState(false);`
  - `● #241 R11: inventario del fuente`
- `fe73ae05` — `test(mobile): health paints Upcoming with its rows nearest first (R4)`: **13 fallidos, 1758 pasados**. Rojo legítimo: no existe vaccines-upcoming-list al esperar el nodo positivo. Log: `/tmp/r4-red-241.log`.
  - `● #241 R1: las dos claves existen en es y en con su literal, una invocación cada una y su fila en §2.41`
  - `● #241 R11: className="mt-1 text-13 font-extrabold uppercase tracking-caps text-muted"`
  - `● #241 R11: className="mt-1 h-10 w-full flex-row items-center gap-2"`
  - `● #241 R11: className="flex-1 flex-row items-center gap-2"`
  - `● #241 R11: className="text-13 font-extrabold uppercase tracking-caps text-muted"`
  - `● #241 R11: className="rounded-full bg-default px-2 py-0.5 text-xs font-extrabold text-muted" style={TABULAR_NUMS}`
  - `● #241 R11: className="size-8 items-center justify-center rounded-full bg-default"`
  - `● #241 R11: <PastChevron size={18} color={muted} />`
  - `● #241 R11: accessibilityRole="button" accessibilityState={{ expanded: pastExpanded }} hitSlop={TOUCH_SLOP} style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })} onPress={() => setPastExpanded((current) => !current)}`
  - `● #241 R11: const PastChevron = pastExpanded ? ChevronUp : ChevronDown;`
  - `● #241 R11: const [pastExpanded, setPastExpanded] = useState(false);`
  - `● #241 R11: inventario del fuente`
  - `● Console`
  - `● Console`
  - `● #241: vacunas próximas y pasadas › #241 R4: pinta «Próximas» y debajo sus filas de la más cercana a la más lejana`
  - `● #241 R1: las dos claves existen en es y en con su literal, una invocación cada una y su fila en §2.41`
  - `● #241 R11: className="mt-1 text-13 font-extrabold uppercase tracking-caps text-muted"`
  - `● #241 R11: className="mt-1 h-10 w-full flex-row items-center gap-2"`
  - `● #241 R11: className="flex-1 flex-row items-center gap-2"`
  - `● #241 R11: className="text-13 font-extrabold uppercase tracking-caps text-muted"`
  - `● #241 R11: className="rounded-full bg-default px-2 py-0.5 text-xs font-extrabold text-muted" style={TABULAR_NUMS}`
  - `● #241 R11: className="size-8 items-center justify-center rounded-full bg-default"`
  - `● #241 R11: <PastChevron size={18} color={muted} />`
  - `● #241 R11: accessibilityRole="button" accessibilityState={{ expanded: pastExpanded }} hitSlop={TOUCH_SLOP} style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })} onPress={() => setPastExpanded((current) => !current)}`
  - `● #241 R11: const PastChevron = pastExpanded ? ChevronUp : ChevronDown;`
  - `● #241 R11: const [pastExpanded, setPastExpanded] = useState(false);`
  - `● #241 R11: inventario del fuente`
  - `● #241: vacunas próximas y pasadas › #241 R4: pinta «Próximas» y debajo sus filas de la más cercana a la más lejana`
- `7b3506b7` — `test(mobile): health Past starts collapsed with its count (R5)`: **15 fallidos, 1758 pasados**. Rojo legítimo: vaccines-past-toggle y vaccines-upcoming-list ausentes; incluye los dos dobles de chevron. Log: `/tmp/r5-red-241.log`.
  - `● #241 R1: las dos claves existen en es y en con su literal, una invocación cada una y su fila en §2.41`
  - `● #241 R11: className="mt-1 text-13 font-extrabold uppercase tracking-caps text-muted"`
  - `● #241 R11: className="mt-1 h-10 w-full flex-row items-center gap-2"`
  - `● #241 R11: className="flex-1 flex-row items-center gap-2"`
  - `● #241 R11: className="text-13 font-extrabold uppercase tracking-caps text-muted"`
  - `● #241 R11: className="rounded-full bg-default px-2 py-0.5 text-xs font-extrabold text-muted" style={TABULAR_NUMS}`
  - `● #241 R11: className="size-8 items-center justify-center rounded-full bg-default"`
  - `● #241 R11: <PastChevron size={18} color={muted} />`
  - `● #241 R11: accessibilityRole="button" accessibilityState={{ expanded: pastExpanded }} hitSlop={TOUCH_SLOP} style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })} onPress={() => setPastExpanded((current) => !current)}`
  - `● #241 R11: const PastChevron = pastExpanded ? ChevronUp : ChevronDown;`
  - `● #241 R11: const [pastExpanded, setPastExpanded] = useState(false);`
  - `● #241 R11: inventario del fuente`
  - `● Console`
  - `● Console`
  - `● #241: vacunas próximas y pasadas › #241 R4: pinta «Próximas» y debajo sus filas de la más cercana a la más lejana`
  - `● #241: vacunas próximas y pasadas › #241 R5: «Pasadas» empieza colapsada con su contador y el chevron abajo`
  - `● #241: vacunas próximas y pasadas › #241 R5: sin pasadas no pinta la sección`
  - `● #241 R1: las dos claves existen en es y en con su literal, una invocación cada una y su fila en §2.41`
  - `● #241 R11: className="mt-1 text-13 font-extrabold uppercase tracking-caps text-muted"`
  - `● #241 R11: className="mt-1 h-10 w-full flex-row items-center gap-2"`
  - `● #241 R11: className="flex-1 flex-row items-center gap-2"`
  - `● #241 R11: className="text-13 font-extrabold uppercase tracking-caps text-muted"`
  - `● #241 R11: className="rounded-full bg-default px-2 py-0.5 text-xs font-extrabold text-muted" style={TABULAR_NUMS}`
  - `● #241 R11: className="size-8 items-center justify-center rounded-full bg-default"`
  - `● #241 R11: <PastChevron size={18} color={muted} />`
  - `● #241 R11: accessibilityRole="button" accessibilityState={{ expanded: pastExpanded }} hitSlop={TOUCH_SLOP} style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })} onPress={() => setPastExpanded((current) => !current)}`
  - `● #241 R11: const PastChevron = pastExpanded ? ChevronUp : ChevronDown;`
  - `● #241 R11: const [pastExpanded, setPastExpanded] = useState(false);`
  - `● #241 R11: inventario del fuente`
  - `● #241: vacunas próximas y pasadas › #241 R4: pinta «Próximas» y debajo sus filas de la más cercana a la más lejana`
  - `● #241: vacunas próximas y pasadas › #241 R5: «Pasadas» empieza colapsada con su contador y el chevron abajo`
  - `● #241: vacunas próximas y pasadas › #241 R5: sin pasadas no pinta la sección`
- `99642b5b` — `test(mobile): health Past toggles and sorts most recent first (R6)`: **16 fallidos, 1758 pasados**. Rojo legítimo: vaccines-past-toggle ausente; expandVaccinesPast ya está definido. Log: `/tmp/r6-red-241.log`.
  - `● #241 R1: las dos claves existen en es y en con su literal, una invocación cada una y su fila en §2.41`
  - `● #241 R11: className="mt-1 text-13 font-extrabold uppercase tracking-caps text-muted"`
  - `● #241 R11: className="mt-1 h-10 w-full flex-row items-center gap-2"`
  - `● #241 R11: className="flex-1 flex-row items-center gap-2"`
  - `● #241 R11: className="text-13 font-extrabold uppercase tracking-caps text-muted"`
  - `● #241 R11: className="rounded-full bg-default px-2 py-0.5 text-xs font-extrabold text-muted" style={TABULAR_NUMS}`
  - `● #241 R11: className="size-8 items-center justify-center rounded-full bg-default"`
  - `● #241 R11: <PastChevron size={18} color={muted} />`
  - `● #241 R11: accessibilityRole="button" accessibilityState={{ expanded: pastExpanded }} hitSlop={TOUCH_SLOP} style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })} onPress={() => setPastExpanded((current) => !current)}`
  - `● #241 R11: const PastChevron = pastExpanded ? ChevronUp : ChevronDown;`
  - `● #241 R11: const [pastExpanded, setPastExpanded] = useState(false);`
  - `● #241 R11: inventario del fuente`
  - `● Console`
  - `● Console`
  - `● #241: vacunas próximas y pasadas › #241 R4: pinta «Próximas» y debajo sus filas de la más cercana a la más lejana`
  - `● #241: vacunas próximas y pasadas › #241 R5: «Pasadas» empieza colapsada con su contador y el chevron abajo`
  - `● #241: vacunas próximas y pasadas › #241 R5: sin pasadas no pinta la sección`
  - `● #241: vacunas próximas y pasadas › #241 R6: el encabezado alterna «Pasadas» y sus filas van de la más reciente a la más antigua`
  - `● #241 R1: las dos claves existen en es y en con su literal, una invocación cada una y su fila en §2.41`
  - `● #241 R11: className="mt-1 text-13 font-extrabold uppercase tracking-caps text-muted"`
  - `● #241 R11: className="mt-1 h-10 w-full flex-row items-center gap-2"`
  - `● #241 R11: className="flex-1 flex-row items-center gap-2"`
  - `● #241 R11: className="text-13 font-extrabold uppercase tracking-caps text-muted"`
  - `● #241 R11: className="rounded-full bg-default px-2 py-0.5 text-xs font-extrabold text-muted" style={TABULAR_NUMS}`
  - `● #241 R11: className="size-8 items-center justify-center rounded-full bg-default"`
  - `● #241 R11: <PastChevron size={18} color={muted} />`
  - `● #241 R11: accessibilityRole="button" accessibilityState={{ expanded: pastExpanded }} hitSlop={TOUCH_SLOP} style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })} onPress={() => setPastExpanded((current) => !current)}`
  - `● #241 R11: const PastChevron = pastExpanded ? ChevronUp : ChevronDown;`
  - `● #241 R11: const [pastExpanded, setPastExpanded] = useState(false);`
  - `● #241 R11: inventario del fuente`
  - `● #241: vacunas próximas y pasadas › #241 R4: pinta «Próximas» y debajo sus filas de la más cercana a la más lejana`
  - `● #241: vacunas próximas y pasadas › #241 R5: «Pasadas» empieza colapsada con su contador y el chevron abajo`
  - `● #241: vacunas próximas y pasadas › #241 R5: sin pasadas no pinta la sección`
  - `● #241: vacunas próximas y pasadas › #241 R6: el encabezado alterna «Pasadas» y sus filas van de la más reciente a la más antigua`

Flake conocido en primera corrida de R7: 22 fallidos / 1757 pasados. Salud `#168 R2 ... pone el PetSwitcher como primer hijo de health-content`: esperaba `vaccines-section` y recibió `undefined` al consultar health-content antes de sus datos de vacunas. Fuente de producción todavía intacto. Se repite una vez aislado, sin enmendar. Log: `/tmp/r7-flake-rerun-241.log`.

- `8d0230db` — `test(mobile): vaccine rows keep their tile and per-section delay (R7)`: **21 fallidos, 1758 pasados**. Rojo legítimo: cinco filas esperan el toggle aún ausente. Repetición completa tras el flake conocido: cifras esperadas. Log: `/tmp/r7-red-repeat-241.log`.
  - `● #241 R1: las dos claves existen en es y en con su literal, una invocación cada una y su fila en §2.41`
  - `● #241 R11: className="mt-1 text-13 font-extrabold uppercase tracking-caps text-muted"`
  - `● #241 R11: className="mt-1 h-10 w-full flex-row items-center gap-2"`
  - `● #241 R11: className="flex-1 flex-row items-center gap-2"`
  - `● #241 R11: className="text-13 font-extrabold uppercase tracking-caps text-muted"`
  - `● #241 R11: className="rounded-full bg-default px-2 py-0.5 text-xs font-extrabold text-muted" style={TABULAR_NUMS}`
  - `● #241 R11: className="size-8 items-center justify-center rounded-full bg-default"`
  - `● #241 R11: <PastChevron size={18} color={muted} />`
  - `● #241 R11: accessibilityRole="button" accessibilityState={{ expanded: pastExpanded }} hitSlop={TOUCH_SLOP} style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })} onPress={() => setPastExpanded((current) => !current)}`
  - `● #241 R11: const PastChevron = pastExpanded ? ChevronUp : ChevronDown;`
  - `● #241 R11: const [pastExpanded, setPastExpanded] = useState(false);`
  - `● #241 R11: inventario del fuente`
  - `● Console`
  - `● Console`
  - `● #241: vacunas próximas y pasadas › #241 R4: pinta «Próximas» y debajo sus filas de la más cercana a la más lejana`
  - `● #241: vacunas próximas y pasadas › #241 R5: «Pasadas» empieza colapsada con su contador y el chevron abajo`
  - `● #241: vacunas próximas y pasadas › #241 R5: sin pasadas no pinta la sección`
  - `● #241: vacunas próximas y pasadas › #241 R6: el encabezado alterna «Pasadas» y sus filas van de la más reciente a la más antigua`
  - `● #241: vacunas próximas y pasadas › #241 R7: future conserva su tile en upcoming y entra a los 80 ms`
  - `● #241: vacunas próximas y pasadas › #241 R7: later conserva su tile en upcoming y entra a los 140 ms`
  - `● #241: vacunas próximas y pasadas › #241 R7: today conserva su tile en past y entra a los 80 ms`
  - `● #241: vacunas próximas y pasadas › #241 R7: none conserva su tile en past y entra a los 140 ms`
  - `● #241: vacunas próximas y pasadas › #241 R7: overdue conserva su tile en past y entra a los 200 ms`
  - `● #241 R1: las dos claves existen en es y en con su literal, una invocación cada una y su fila en §2.41`
  - `● #241 R11: className="mt-1 text-13 font-extrabold uppercase tracking-caps text-muted"`
  - `● #241 R11: className="mt-1 h-10 w-full flex-row items-center gap-2"`
  - `● #241 R11: className="flex-1 flex-row items-center gap-2"`
  - `● #241 R11: className="text-13 font-extrabold uppercase tracking-caps text-muted"`
  - `● #241 R11: className="rounded-full bg-default px-2 py-0.5 text-xs font-extrabold text-muted" style={TABULAR_NUMS}`
  - `● #241 R11: className="size-8 items-center justify-center rounded-full bg-default"`
  - `● #241 R11: <PastChevron size={18} color={muted} />`
  - `● #241 R11: accessibilityRole="button" accessibilityState={{ expanded: pastExpanded }} hitSlop={TOUCH_SLOP} style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })} onPress={() => setPastExpanded((current) => !current)}`
  - `● #241 R11: const PastChevron = pastExpanded ? ChevronUp : ChevronDown;`
  - `● #241 R11: const [pastExpanded, setPastExpanded] = useState(false);`
  - `● #241 R11: inventario del fuente`
  - `● #241: vacunas próximas y pasadas › #241 R4: pinta «Próximas» y debajo sus filas de la más cercana a la más lejana`
  - `● #241: vacunas próximas y pasadas › #241 R5: «Pasadas» empieza colapsada con su contador y el chevron abajo`
  - `● #241: vacunas próximas y pasadas › #241 R5: sin pasadas no pinta la sección`
  - `● #241: vacunas próximas y pasadas › #241 R6: el encabezado alterna «Pasadas» y sus filas van de la más reciente a la más antigua`
  - `● #241: vacunas próximas y pasadas › #241 R7: future conserva su tile en upcoming y entra a los 80 ms`
  - `● #241: vacunas próximas y pasadas › #241 R7: later conserva su tile en upcoming y entra a los 140 ms`
  - `● #241: vacunas próximas y pasadas › #241 R7: today conserva su tile en past y entra a los 80 ms`
  - `● #241: vacunas próximas y pasadas › #241 R7: none conserva su tile en past y entra a los 140 ms`
  - `● #241: vacunas próximas y pasadas › #241 R7: overdue conserva su tile en past y entra a los 200 ms`

Repetición aislada del flake #168 R2: **8 pasados, 131 omitidos, exit 0** (el filtro selecciona sus ocho casos). Repetición completa de R7: **21 fallidos / 1758 pasados**, todos los rojos pertenecen a #241.

- `dd56132d` — `test(mobile): a dose due today shows in the hero and in Past (R8)`: **22 fallidos, 1758 pasados**. Rojo legítimo: el hero pasa y falta vaccines-upcoming-list. Log: `/tmp/r8-red-241.log`.
  - `● #241 R1: las dos claves existen en es y en con su literal, una invocación cada una y su fila en §2.41`
  - `● #241 R11: className="mt-1 text-13 font-extrabold uppercase tracking-caps text-muted"`
  - `● #241 R11: className="mt-1 h-10 w-full flex-row items-center gap-2"`
  - `● #241 R11: className="flex-1 flex-row items-center gap-2"`
  - `● #241 R11: className="text-13 font-extrabold uppercase tracking-caps text-muted"`
  - `● #241 R11: className="rounded-full bg-default px-2 py-0.5 text-xs font-extrabold text-muted" style={TABULAR_NUMS}`
  - `● #241 R11: className="size-8 items-center justify-center rounded-full bg-default"`
  - `● #241 R11: <PastChevron size={18} color={muted} />`
  - `● #241 R11: accessibilityRole="button" accessibilityState={{ expanded: pastExpanded }} hitSlop={TOUCH_SLOP} style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })} onPress={() => setPastExpanded((current) => !current)}`
  - `● #241 R11: const PastChevron = pastExpanded ? ChevronUp : ChevronDown;`
  - `● #241 R11: const [pastExpanded, setPastExpanded] = useState(false);`
  - `● #241 R11: inventario del fuente`
  - `● Console`
  - `● Console`
  - `● #241: vacunas próximas y pasadas › #241 R4: pinta «Próximas» y debajo sus filas de la más cercana a la más lejana`
  - `● #241: vacunas próximas y pasadas › #241 R5: «Pasadas» empieza colapsada con su contador y el chevron abajo`
  - `● #241: vacunas próximas y pasadas › #241 R5: sin pasadas no pinta la sección`
  - `● #241: vacunas próximas y pasadas › #241 R6: el encabezado alterna «Pasadas» y sus filas van de la más reciente a la más antigua`
  - `● #241: vacunas próximas y pasadas › #241 R7: future conserva su tile en upcoming y entra a los 80 ms`
  - `● #241: vacunas próximas y pasadas › #241 R7: later conserva su tile en upcoming y entra a los 140 ms`
  - `● #241: vacunas próximas y pasadas › #241 R7: today conserva su tile en past y entra a los 80 ms`
  - `● #241: vacunas próximas y pasadas › #241 R7: none conserva su tile en past y entra a los 140 ms`
  - `● #241: vacunas próximas y pasadas › #241 R7: overdue conserva su tile en past y entra a los 200 ms`
  - `● #241: vacunas próximas y pasadas › #241 R8: la dosis de hoy sale en «Próxima dosis» y en «Pasadas», no en «Próximas»`
  - `● #241 R1: las dos claves existen en es y en con su literal, una invocación cada una y su fila en §2.41`
  - `● #241 R11: className="mt-1 text-13 font-extrabold uppercase tracking-caps text-muted"`
  - `● #241 R11: className="mt-1 h-10 w-full flex-row items-center gap-2"`
  - `● #241 R11: className="flex-1 flex-row items-center gap-2"`
  - `● #241 R11: className="text-13 font-extrabold uppercase tracking-caps text-muted"`
  - `● #241 R11: className="rounded-full bg-default px-2 py-0.5 text-xs font-extrabold text-muted" style={TABULAR_NUMS}`
  - `● #241 R11: className="size-8 items-center justify-center rounded-full bg-default"`
  - `● #241 R11: <PastChevron size={18} color={muted} />`
  - `● #241 R11: accessibilityRole="button" accessibilityState={{ expanded: pastExpanded }} hitSlop={TOUCH_SLOP} style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })} onPress={() => setPastExpanded((current) => !current)}`
  - `● #241 R11: const PastChevron = pastExpanded ? ChevronUp : ChevronDown;`
  - `● #241 R11: const [pastExpanded, setPastExpanded] = useState(false);`
  - `● #241 R11: inventario del fuente`
  - `● #241: vacunas próximas y pasadas › #241 R4: pinta «Próximas» y debajo sus filas de la más cercana a la más lejana`
  - `● #241: vacunas próximas y pasadas › #241 R5: «Pasadas» empieza colapsada con su contador y el chevron abajo`
  - `● #241: vacunas próximas y pasadas › #241 R5: sin pasadas no pinta la sección`
  - `● #241: vacunas próximas y pasadas › #241 R6: el encabezado alterna «Pasadas» y sus filas van de la más reciente a la más antigua`
  - `● #241: vacunas próximas y pasadas › #241 R7: future conserva su tile en upcoming y entra a los 80 ms`
  - `● #241: vacunas próximas y pasadas › #241 R7: later conserva su tile en upcoming y entra a los 140 ms`
  - `● #241: vacunas próximas y pasadas › #241 R7: today conserva su tile en past y entra a los 80 ms`
  - `● #241: vacunas próximas y pasadas › #241 R7: none conserva su tile en past y entra a los 140 ms`
  - `● #241: vacunas próximas y pasadas › #241 R7: overdue conserva su tile en past y entra a los 200 ms`
  - `● #241: vacunas próximas y pasadas › #241 R8: la dosis de hoy sale en «Próxima dosis» y en «Pasadas», no en «Próximas»`
- `8c20896c` — `test(mobile): health omits Upcoming when nothing is ahead (R9)`: **23 fallidos, 1758 pasados**. Rojo legítimo: vaccines-past-count ausente. Log: `/tmp/r9-red-241.log`.
  - `● #241 R1: las dos claves existen en es y en con su literal, una invocación cada una y su fila en §2.41`
  - `● #241 R11: className="mt-1 text-13 font-extrabold uppercase tracking-caps text-muted"`
  - `● #241 R11: className="mt-1 h-10 w-full flex-row items-center gap-2"`
  - `● #241 R11: className="flex-1 flex-row items-center gap-2"`
  - `● #241 R11: className="text-13 font-extrabold uppercase tracking-caps text-muted"`
  - `● #241 R11: className="rounded-full bg-default px-2 py-0.5 text-xs font-extrabold text-muted" style={TABULAR_NUMS}`
  - `● #241 R11: className="size-8 items-center justify-center rounded-full bg-default"`
  - `● #241 R11: <PastChevron size={18} color={muted} />`
  - `● #241 R11: accessibilityRole="button" accessibilityState={{ expanded: pastExpanded }} hitSlop={TOUCH_SLOP} style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })} onPress={() => setPastExpanded((current) => !current)}`
  - `● #241 R11: const PastChevron = pastExpanded ? ChevronUp : ChevronDown;`
  - `● #241 R11: const [pastExpanded, setPastExpanded] = useState(false);`
  - `● #241 R11: inventario del fuente`
  - `● Console`
  - `● Console`
  - `● #241: vacunas próximas y pasadas › #241 R4: pinta «Próximas» y debajo sus filas de la más cercana a la más lejana`
  - `● #241: vacunas próximas y pasadas › #241 R5: «Pasadas» empieza colapsada con su contador y el chevron abajo`
  - `● #241: vacunas próximas y pasadas › #241 R5: sin pasadas no pinta la sección`
  - `● #241: vacunas próximas y pasadas › #241 R6: el encabezado alterna «Pasadas» y sus filas van de la más reciente a la más antigua`
  - `● #241: vacunas próximas y pasadas › #241 R7: future conserva su tile en upcoming y entra a los 80 ms`
  - `● #241: vacunas próximas y pasadas › #241 R7: later conserva su tile en upcoming y entra a los 140 ms`
  - `● #241: vacunas próximas y pasadas › #241 R7: today conserva su tile en past y entra a los 80 ms`
  - `● #241: vacunas próximas y pasadas › #241 R7: none conserva su tile en past y entra a los 140 ms`
  - `● #241: vacunas próximas y pasadas › #241 R7: overdue conserva su tile en past y entra a los 200 ms`
  - `● #241: vacunas próximas y pasadas › #241 R8: la dosis de hoy sale en «Próxima dosis» y en «Pasadas», no en «Próximas»`
  - `● #241: vacunas próximas y pasadas › #241 R9: sin próximas no pinta su cabecera ni su lista`
  - `● #241 R1: las dos claves existen en es y en con su literal, una invocación cada una y su fila en §2.41`
  - `● #241 R11: className="mt-1 text-13 font-extrabold uppercase tracking-caps text-muted"`
  - `● #241 R11: className="mt-1 h-10 w-full flex-row items-center gap-2"`
  - `● #241 R11: className="flex-1 flex-row items-center gap-2"`
  - `● #241 R11: className="text-13 font-extrabold uppercase tracking-caps text-muted"`
  - `● #241 R11: className="rounded-full bg-default px-2 py-0.5 text-xs font-extrabold text-muted" style={TABULAR_NUMS}`
  - `● #241 R11: className="size-8 items-center justify-center rounded-full bg-default"`
  - `● #241 R11: <PastChevron size={18} color={muted} />`
  - `● #241 R11: accessibilityRole="button" accessibilityState={{ expanded: pastExpanded }} hitSlop={TOUCH_SLOP} style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })} onPress={() => setPastExpanded((current) => !current)}`
  - `● #241 R11: const PastChevron = pastExpanded ? ChevronUp : ChevronDown;`
  - `● #241 R11: const [pastExpanded, setPastExpanded] = useState(false);`
  - `● #241 R11: inventario del fuente`
  - `● #241: vacunas próximas y pasadas › #241 R4: pinta «Próximas» y debajo sus filas de la más cercana a la más lejana`
  - `● #241: vacunas próximas y pasadas › #241 R5: «Pasadas» empieza colapsada con su contador y el chevron abajo`
  - `● #241: vacunas próximas y pasadas › #241 R5: sin pasadas no pinta la sección`
  - `● #241: vacunas próximas y pasadas › #241 R6: el encabezado alterna «Pasadas» y sus filas van de la más reciente a la más antigua`
  - `● #241: vacunas próximas y pasadas › #241 R7: future conserva su tile en upcoming y entra a los 80 ms`
  - `● #241: vacunas próximas y pasadas › #241 R7: later conserva su tile en upcoming y entra a los 140 ms`
  - `● #241: vacunas próximas y pasadas › #241 R7: today conserva su tile en past y entra a los 80 ms`
  - `● #241: vacunas próximas y pasadas › #241 R7: none conserva su tile en past y entra a los 140 ms`
  - `● #241: vacunas próximas y pasadas › #241 R7: overdue conserva su tile en past y entra a los 200 ms`
  - `● #241: vacunas próximas y pasadas › #241 R8: la dosis de hoy sale en «Próxima dosis» y en «Pasadas», no en «Próximas»`
  - `● #241: vacunas próximas y pasadas › #241 R9: sin próximas no pinta su cabecera ni su lista`
- `b70a43fa` — `test(mobile): health splits vaccines by the local day (R10)`: **27 fallidos, 1758 pasados**. Rojo legítimo: faltan vaccines-upcoming-list / vaccines-past-count en las cuatro zonas/fechas. Log: `/tmp/r10-red-241.log`.
  - `● #241 R1: las dos claves existen en es y en con su literal, una invocación cada una y su fila en §2.41`
  - `● #241 R11: className="mt-1 text-13 font-extrabold uppercase tracking-caps text-muted"`
  - `● #241 R11: className="mt-1 h-10 w-full flex-row items-center gap-2"`
  - `● #241 R11: className="flex-1 flex-row items-center gap-2"`
  - `● #241 R11: className="text-13 font-extrabold uppercase tracking-caps text-muted"`
  - `● #241 R11: className="rounded-full bg-default px-2 py-0.5 text-xs font-extrabold text-muted" style={TABULAR_NUMS}`
  - `● #241 R11: className="size-8 items-center justify-center rounded-full bg-default"`
  - `● #241 R11: <PastChevron size={18} color={muted} />`
  - `● #241 R11: accessibilityRole="button" accessibilityState={{ expanded: pastExpanded }} hitSlop={TOUCH_SLOP} style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })} onPress={() => setPastExpanded((current) => !current)}`
  - `● #241 R11: const PastChevron = pastExpanded ? ChevronUp : ChevronDown;`
  - `● #241 R11: const [pastExpanded, setPastExpanded] = useState(false);`
  - `● #241 R11: inventario del fuente`
  - `● Console`
  - `● Console`
  - `● #241: vacunas próximas y pasadas › #241 R4: pinta «Próximas» y debajo sus filas de la más cercana a la más lejana`
  - `● #241: vacunas próximas y pasadas › #241 R5: «Pasadas» empieza colapsada con su contador y el chevron abajo`
  - `● #241: vacunas próximas y pasadas › #241 R5: sin pasadas no pinta la sección`
  - `● #241: vacunas próximas y pasadas › #241 R6: el encabezado alterna «Pasadas» y sus filas van de la más reciente a la más antigua`
  - `● #241: vacunas próximas y pasadas › #241 R7: future conserva su tile en upcoming y entra a los 80 ms`
  - `● #241: vacunas próximas y pasadas › #241 R7: later conserva su tile en upcoming y entra a los 140 ms`
  - `● #241: vacunas próximas y pasadas › #241 R7: today conserva su tile en past y entra a los 80 ms`
  - `● #241: vacunas próximas y pasadas › #241 R7: none conserva su tile en past y entra a los 140 ms`
  - `● #241: vacunas próximas y pasadas › #241 R7: overdue conserva su tile en past y entra a los 200 ms`
  - `● #241: vacunas próximas y pasadas › #241 R8: la dosis de hoy sale en «Próxima dosis» y en «Pasadas», no en «Próximas»`
  - `● #241: vacunas próximas y pasadas › #241 R9: sin próximas no pinta su cabecera ni su lista`
  - `● #241: vacunas próximas y pasadas › #241 R10: a las 23:59 en America/Mexico_City la dosis del 2027-01-01 va a upcoming`
  - `● #241: vacunas próximas y pasadas › #241 R10: a las 00:01 en Pacific/Auckland la dosis del 2027-01-01 va a past`
  - `● #241: vacunas próximas y pasadas › #241 R10: a las 23:59 en America/Mexico_City la dosis del 2026-10-01 va a upcoming`
  - `● #241: vacunas próximas y pasadas › #241 R10: a las 00:01 en Pacific/Auckland la dosis del 2026-10-01 va a past`
  - `● #241 R1: las dos claves existen en es y en con su literal, una invocación cada una y su fila en §2.41`
  - `● #241 R11: className="mt-1 text-13 font-extrabold uppercase tracking-caps text-muted"`
  - `● #241 R11: className="mt-1 h-10 w-full flex-row items-center gap-2"`
  - `● #241 R11: className="flex-1 flex-row items-center gap-2"`
  - `● #241 R11: className="text-13 font-extrabold uppercase tracking-caps text-muted"`
  - `● #241 R11: className="rounded-full bg-default px-2 py-0.5 text-xs font-extrabold text-muted" style={TABULAR_NUMS}`
  - `● #241 R11: className="size-8 items-center justify-center rounded-full bg-default"`
  - `● #241 R11: <PastChevron size={18} color={muted} />`
  - `● #241 R11: accessibilityRole="button" accessibilityState={{ expanded: pastExpanded }} hitSlop={TOUCH_SLOP} style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })} onPress={() => setPastExpanded((current) => !current)}`
  - `● #241 R11: const PastChevron = pastExpanded ? ChevronUp : ChevronDown;`
  - `● #241 R11: const [pastExpanded, setPastExpanded] = useState(false);`
  - `● #241 R11: inventario del fuente`
  - `● #241: vacunas próximas y pasadas › #241 R4: pinta «Próximas» y debajo sus filas de la más cercana a la más lejana`
  - `● #241: vacunas próximas y pasadas › #241 R5: «Pasadas» empieza colapsada con su contador y el chevron abajo`
  - `● #241: vacunas próximas y pasadas › #241 R5: sin pasadas no pinta la sección`
  - `● #241: vacunas próximas y pasadas › #241 R6: el encabezado alterna «Pasadas» y sus filas van de la más reciente a la más antigua`
  - `● #241: vacunas próximas y pasadas › #241 R7: future conserva su tile en upcoming y entra a los 80 ms`
  - `● #241: vacunas próximas y pasadas › #241 R7: later conserva su tile en upcoming y entra a los 140 ms`
  - `● #241: vacunas próximas y pasadas › #241 R7: today conserva su tile en past y entra a los 80 ms`
  - `● #241: vacunas próximas y pasadas › #241 R7: none conserva su tile en past y entra a los 140 ms`
  - `● #241: vacunas próximas y pasadas › #241 R7: overdue conserva su tile en past y entra a los 200 ms`
  - `● #241: vacunas próximas y pasadas › #241 R8: la dosis de hoy sale en «Próxima dosis» y en «Pasadas», no en «Próximas»`
  - `● #241: vacunas próximas y pasadas › #241 R9: sin próximas no pinta su cabecera ni su lista`
  - `● #241: vacunas próximas y pasadas › #241 R10: a las 23:59 en America/Mexico_City la dosis del 2027-01-01 va a upcoming`
  - `● #241: vacunas próximas y pasadas › #241 R10: a las 00:01 en Pacific/Auckland la dosis del 2027-01-01 va a past`
  - `● #241: vacunas próximas y pasadas › #241 R10: a las 23:59 en America/Mexico_City la dosis del 2026-10-01 va a upcoming`
  - `● #241: vacunas próximas y pasadas › #241 R10: a las 00:01 en Pacific/Auckland la dosis del 2026-10-01 va a past`

T-verde: primera corrida y primera repetición completa dan **1 fallido / 1784 pasados**, exclusivamente el mismo flake conocido `#168 R2 ... pone el PetSwitcher ...`. La repetición aislada dio **8 pasados / 137 omitidos, exit 0** (`/tmp/t-green-flake-rerun-241.log`). No se cambia el candado. Logs completos `/tmp/t-green-241.log` y `/tmp/t-green-repeat-241.log`. Se vuelve a medir el conjunto para obtener la evidencia verde requerida.

- `f3207c10` — `feat(mobile): split health vaccines into Upcoming and collapsed Past (R1, R4, R5, R6, R7, R8, R9, R10, R11)`: **0 fallidos, 1785 pasados**. Verde: P + 37 + 2. Sin enmiendas adicionales por la Regla de cierre; solo los diez candados previstos, todavía sin sufijo. Log: `/tmp/t-green-repeat-2-241.log`.
  - `● Console`
  - `● Console`

## Sonda de R9

Tras T-verde `f3207c10`, test de vacío escrito sin commitear. Mutación literal `{sections && sections.upcoming.length > 0 ? (` → `{sections ? (`.

La primera invocación se lanzó por error desde la raíz y respondió `Script not found "jest"` (0 tests); se repitió desde `mobile-pet-tracker/`. La corrida válida `bun run jest src/screens/health` dio exit 1:

```text
  ● #241: vacunas próximas y pasadas › #241 R9: sin próximas no pinta su cabecera ni su lista
  ● #241: vacunas próximas y pasadas › #241 R9: sin vacunas conserva el vacío sin secciones
Test Suites: 1 failed, 1 total
Tests:       2 failed, 144 passed, 146 total
Time:        15.41 s, estimated 18 s
```

Los dos R9 fallan por aserción de ausencia: aparece la cabecera de Próximas al no haber próximas, también con cero vacunas. Restauración prescrita desde `mobile-pet-tracker/`: `git checkout HEAD -- src/screens/health/index.tsx`. Verificación `git diff --quiet HEAD -- src/screens/health/index.tsx && git diff --cached --quiet`: **exit 0**. La mutación no se commitea.

- `c67d5531` — `test(mobile): empty vaccines keep the empty state without sections (R9)`: **0 fallidos, 1786 pasados**. Verde tras la sonda y la restauración: P + 38 + 2. Log: `/tmp/r9-empty-green-241.log`.
  - `● Console`
  - `● Console`
- `cedba517` — `test(mobile): amended locks name their amendment (R12)`: **1 fallidos, 1786 pasados**. Rojo legítimo de aserción: los diez títulos enmendados aún no contienen el sufijo de R12; la spec original conserva su casilla aprobada. Log: `/tmp/r12-red-241.log`.
  - `● Console`
  - `● Console`
  - `● #241 R12: los candados enmendados nombran su enmienda y la spec enmendada lleva su casilla`
  - `● #241 R12: los candados enmendados nombran su enmienda y la spec enmendada lleva su casilla`

## Corrección de tipado de la tabla R10

El primer typecheck salió 2: `src/screens/health/index.test.tsx(1848,35): TS2556`, porque la tabla escrita con `as const` infería una unión de tuplas y TypeScript rechazaba el spread en `new Date(...now)`. Se tipa explícitamente la tabla mediante el genérico de `it.each`, con `now: [number, number, number, number, number]`; se conserva exactamente `jest.setSystemTime(new Date(...now))`, las cuatro filas y su comportamiento. No cambia la spec. Se añade un commit correctivo R10 antes del verde R12, que queda limitado exclusivamente a sufijos. Es una desviación del listado de commits del handoff causada por este error de implementación.

Primera corrida final bajo carga: 3 fallidos / 1784 pasados, 69 suites, 215.566 s. `#168 R2 ... pone el PetSwitcher ...` es el flake conocido; los casos R7 `none` y `overdue` excedieron el timeout de 5000 ms. No se cambia su timeout ni su lógica; se repiten aislados. Log preservado en `/tmp/final-first-241.log`.

- `14627906` — `test(mobile): type the local-date fixture as a tuple (R10)`: **1 fallidos, 1786 pasados**. Corrección adicional de tipado: tsc exit 0 y log vacío. La corrida mantiene solo el rojo esperado de R12 (1/1786). Los dos timeouts de R7 y #168 R2 pasan aislados: 10 pasados, 136 omitidos, exit 0. Log: `/tmp/r10-types-r12-red-241.log`.
  - `● Console`
  - `● #241 R12: los candados enmendados nombran su enmienda y la spec enmendada lleva su casilla`
  - `● Console`
  - `● #241 R12: los candados enmendados nombran su enmienda y la spec enmendada lleva su casilla`
- `722d4f26` — `test(mobile): suffix amended locks with #241 R12 (R12)`: **0 fallidos, 1787 pasados**. Verde final: P + 39 + 2 = 1787; este commit cambia solo los diez títulos, seis en Salud y cuatro en guards. Log: `/home/claude/sites/Pet-Tracker-wt-241/progress/final_mobile-health-vaccines-upcoming-past.log`.
  - `● Console`
  - `● Console`

## Regla de cierre

No hubo candados adicionales por las causas (a)–(d). AMENDED conserva exactamente los diez pares prescritos: seis localizadores de Salud y cuatro de guards. El flake conocido #168 R2 no se enmendó. La corrección de tipado pertenece al test nuevo R10, no a un candado anterior.

## Anclas finales

Medidas por ocurrencias desde `mobile-pet-tracker/src/`, con el mismo `node -e` de T0:

| Literal en screens/health/index.tsx | Tras el cambio | Medido |
|---|---:|---:|
| `style={TABULAR_NUMS}` | 4 | 4 |
| `hitSlop={TOUCH_SLOP}` | 2 | 2 |
| `style={CONTINUOUS_CORNER}` | 7 | 7 |
| `accessibilityRole="header"` | 3 | 3 |
| `className="gap-2.5"` | 4 | 4 |
| `tracking-caps` | 3 | 3 |
| `uppercase` | 3 | 3 |
| `bg-default` | 3 | 3 |
| `<Pressable` | 3 | 3 |
| `rounded-full` | 6 | 6 |
| `t('` | 32 | 32 |
| `useState(false)` | 1 | 1 |
| `import { useState } from 'react';` | 1 | 1 |
| `splitVaccines(` | 1 | 1 |
| `sections.upcoming.map(renderVaccineRow)` | 1 | 1 |
| `sections.past.map(renderVaccineRow)` | 1 | 1 |
| `vaccines.data.vaccines.map(` | 0 | 0 |
| `delayMs={80 + 60 * Math.min(index, 2)}` | 1 | 1 |
| `nextDoseAt >= today` | 1 | 1 |
| `accessibilityState` | 1 | 1 |

`grep -cF "(enmendado por #241 R12)"`:

```text
screens/health/index.test.tsx:6
__tests__/consistency-classnames.test.ts:2
providers/__tests__/language-provider.test.tsx:1
__tests__/ui-language.test.ts:1
```

`git log --format=%h 7fe02383..HEAD -- mobile-pet-tracker/src/screens/health/index.tsx | wc -l`: **1**, correspondiente a T-verde `f3207c10`. El resto de commits no modifica esa pantalla.

## Verificación final

Corrida completa prescrita desde `mobile-pet-tracker/`, sin flags ni filtros adicionales:

```text
Test Suites: 69 passed, 69 total
Tests:       1787 passed, 1787 total
Snapshots:   0 total
Time:        16.255 s, estimated 18 s
Ran all test suites matching /src\/screens\/health|src\/utils|src\/__tests__|src\/providers/i.
```

Log final: `progress/final_mobile-health-vaccines-upcoming-past.log`. Exit **0**. Los `●` finales (2, igual que T0):

- `● Console`
- `● Console`

- TypeScript: comando prescrito con guarda de `.expo/types/router.d.ts`, salida **0**, `/tmp/tsc-241.log` vacío (0 bytes). El archivo de rutas no existe; no se borró nada. El chequeo verde se hizo tras tipar la tabla R10; los cambios posteriores solo añadieron los sufijos a los títulos.
- Lint: `bunx expo lint --no-cache > /tmp/lint-241.log 2>&1 && test ! -s /tmp/lint-241.log && echo LINT_OK`, exit **0**, salida **LINT_OK**, log vacío (0 bytes). Se repitió tras corregir el tipo de R10.
- `git diff --check`: exit **0**.
- Sin SIGKILL, «failed to run», import roto ni error de sintaxis en ninguna evidencia de la cadena.
- Las dos invocaciones auxiliares lanzadas desde la raíz (sonda R9 e aislamiento final) respondieron `Script not found "jest"`, contaron cero tests y se repitieron desde `mobile-pet-tracker/`. No son evidencia roja ni verde.

## Flakes y repeticiones

- R7 rojo: primera corrida 22 fallidos / 1757 pasados por el flake conocido #168 R2; aislado 8 pasados / 131 omitidos; repetición completa 21 fallidos / 1758 pasados, solo los rojos previstos de #241.
- T-verde: primera corrida y primera repetición completa 1 fallido / 1784 pasados, el mismo #168 R2; aislado 8 pasados / 137 omitidos; segunda repetición completa 1785 pasados, 0 fallidos.
- Primer intento final: #168 R2 y dos timeouts de R7 (`none`, `overdue`) bajo carga, 3 fallidos / 1784 pasados; log conservado en `/tmp/final-first-241.log`. Repetición aislada de los casos afectados: **10 pasados, 136 omitidos**, exit 0, `/tmp/final-isolated-241.log`. Corrida completa final: **1787 pasados, 0 fallidos**.
- No se alteraron esperas, timeouts ni lógica por estos flakes. No aparecieron los otros flakes enumerados por el handoff.

## Cierre y límites

Se conservan los literales de copy, la receta #227, las filas y la tarjeta de próxima dosis. No hay dependencias, colores ni variables de entorno nuevas. No se tocaron backend, Recordatorios, theme, docs, la spec anterior ni archivos de bookkeeping. La trazabilidad contiene ambos hashes de cada ciclo y la sonda de vacío; este reporte y la tabla se guardan juntos en `docs(spec): traceability for #241`.

No se ejecutaron `./init.sh`, instalaciones, fetch, merge ni rebase. No se abrió ni editó PR. El leader corre el arnés completo y gestiona la integración en `dev`; el humano conserva G2. Los dos logs prescritos y el marcador `.done` se dejan sin commitear.

No hay un PARA abierto: no hubo denegación del sandbox ni contradicción de spec. Las desviaciones registradas son la comprobación inicial posterior a la lectura del handoff, el +2 de tests importados y el commit correctivo de tipado R10. Los 17 commits de código/tests anteriores al cierre están registrados arriba con hashes, cifras y causas.

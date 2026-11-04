---
feature: "mobile-health-vaccines-upcoming-past"
status: approved        # draft | approved
tags: [mobile, ui, spec]
---

# Diseño — [[mobile-health-vaccines-upcoming-past]] (#241)

> Ver [[requirements]] para los requisitos que este diseño implementa y
> [[../../docs/architecture|architecture]] para las reglas de capas del proyecto.
> Todo es capa de presentación móvil; no hay dominio ni infraestructura nuevos.

## Decisiones técnicas

- **D1 — La partición vive en `utils/vaccine-dates.ts` (R2, R3, R10).** Es
  lógica pura de fechas y ya hay un fichero de utilidades de vacunas con su
  test. La función recibe `today` como `string` (el que ya da
  `localTodayIso()` en la pantalla) en vez de leer el reloj, así que el test
  unitario no necesita relojes falsos y R10 prueba en pantalla que el «hoy» es
  local.

  ```ts
  export function splitVaccines(vaccines: Vaccine[], today: string): { upcoming: Vaccine[]; past: Vaccine[] }
  ```

  - `upcoming`: `nextDoseAt !== null && nextDoseAt > today`, ordenadas por
    `nextDoseAt` ascendente.
  - `past`: el resto, ordenadas por `nextDoseAt ?? appliedAt` descendente.
  - Desempate en las dos: `id` ascendente con `<` / `>`.
  - No muta la entrada (`filter` devuelve arrays nuevos y se ordenan esos).
  - Import nuevo en el fichero: `import type { Vaccine } from '../api/types';`.

- **D2 — La receta de #227 se copia, no se extrae (R5, R6, R11).** Extraer un
  componente compartido obligaría a enmendar los candados de #223 y #227, que
  asertan el fuente de Alertas y de Recordatorios. Copiar diez literales y
  fijarlos con R11 contra Recordatorios da la misma garantía de fidelidad sin
  tocar otra pantalla. Si un día cambia la receta en Recordatorios, R11 se pone
  rojo y obliga a decidir.

- **D3 — Una sola `renderVaccineRow` (R7).** El cuerpo del `map` actual pasa a
  una función local `function renderVaccineRow(vaccine: Vaccine, index: number)`
  sin cambiar ni una línea de su JSX (slot, `Icon`, `color`, `RiseIn` con
  `delayMs={80 + 60 * Math.min(index, 2)}` y la `Card`). Las dos listas la
  llaman con `.map(renderVaccineRow)`, así que `index` es la posición dentro de
  la sección (D8).

- **D4 — `gap-2.5` en las listas y en `vaccines-past` (R4, R5, R6).** Es el
  ritmo que ya tiene `vaccines-section` (#199 R15) entre sus hijos. Usar el
  `gap-3` de Recordatorios abriría más las filas dentro de una sección que la
  sección respecto a su título. No cambia la cabecera, solo el espacio entre
  filas.

- **D5 — Próximas vacía no pinta nada (R9).** Recordatorios pinta una caja
  «Nada pendiente por ahora», pero su copy es masculino y habla de
  recordatorios. `home.noUpcomingVaccine` («Sin vacuna próxima») existe, pero
  es el estado de la tarjeta de Inicio y nadie lo aprobó para esta lista.
  Una caja nueva necesitaría copy nuevo que nadie ha aprobado. Sin próximas, lo
  más probable es que la tarjeta «Próxima dosis» ya esté contando hoy o que no
  haya dosis pendientes; la cabecera «Pasadas» con su contador basta. Queda
  como pregunta abierta para G1.

- **D6 — `>=` en la tarjeta y `>` en Próximas (R8).** La tarjeta «Próxima
  dosis» no cambia (plan §2: «sigue contando hoy»). Próximas usa `>` porque el
  humano pidió que la de hoy pase a Pasadas. La de hoy sale por eso en los dos
  sitios; su tile es ámbar (es la vacuna de la tarjeta) en Pasadas.

- **D7 — Solo se enmienda #37 R5 (Specs enmendadas).** Es el único requisito
  que fija el orden de la lista. #199 R16 fija la fila y su retraso por índice,
  y los dos siguen valiendo dentro de cada sección.

- **D8 — El retraso de entrada cuenta por sección (R7).** Al expandir Pasadas,
  sus filas entran con el mismo `RiseIn` (80, 140, 200 ms) que las de Próximas.
  No se añade una constante de escalonado nueva como en #227: Salud ya tiene la
  suya en línea y `health-weight-canvas` la busca con
  `toContain('80 + 60 * Math.min(')`.

## Código prescrito en `screens/health/index.tsx`

Imports (anclas en [[requirements]] §Evidencia):

- entre `import { Button, Skeleton } from 'heroui-native';` y
  `import { Pressable, ScrollView, Text, View } from 'react-native';`:
  `import { useState } from 'react';`;
- la línea de `reicon-react-native` pasa a
  `import { BellOff, Check, ChevronDown, ChevronRight, ChevronUp, Clock, Plus, Syringe } from 'reicon-react-native';`;
- después de `import { healthKeys, petKeys } from '../../api/query-keys';`:
  `import type { Vaccine } from '../../api/types';`;
- después de `import { CATEGORY_SLOTS } from '../../utils/category-palette';`:
  `import { splitVaccines } from '../../utils/vaccine-dates';`.

Estado y derivados:

- justo antes de `const today = localTodayIso();`:
  `const [pastExpanded, setPastExpanded] = useState(false);`;
- después de la sentencia `const days = …;`:
  `const sections = vaccines.data?.kind === 'ok' ? splitVaccines(vaccines.data.vaccines, today) : undefined;`
  y debajo `const PastChevron = pastExpanded ? ChevronUp : ChevronDown;`;
- `function renderVaccineRow(vaccine: Vaccine, index: number)` con el cuerpo
  actual del `map` (D3), declarada en el componente, después de
  `PastChevron`.

El bloque `{vaccines.data?.kind === 'ok' ? vaccines.data.vaccines.map(…) : null}`
se sustituye por:

```tsx
{sections && sections.upcoming.length > 0 ? (
  <>
    <Text testID="vaccines-upcoming-heading" accessibilityRole="header" className="mt-1 text-13 font-extrabold uppercase tracking-caps text-muted">
      {t('health.sectionUpcoming')}
    </Text>
    <View testID="vaccines-upcoming-list" className="gap-2.5">
      {sections.upcoming.map(renderVaccineRow)}
    </View>
  </>
) : null}

{sections && sections.past.length > 0 ? (
  <View testID="vaccines-past" className="gap-2.5">
    <Pressable testID="vaccines-past-toggle" className="mt-1 h-10 w-full flex-row items-center gap-2" accessibilityRole="button" accessibilityState={{ expanded: pastExpanded }} hitSlop={TOUCH_SLOP} style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })} onPress={() => setPastExpanded((current) => !current)}>
      <View className="flex-1 flex-row items-center gap-2">
        <Text testID="vaccines-past-label" className="text-13 font-extrabold uppercase tracking-caps text-muted">
          {t('health.sectionPast')}
        </Text>
        <Text testID="vaccines-past-count" className="rounded-full bg-default px-2 py-0.5 text-xs font-extrabold text-muted" style={TABULAR_NUMS}>
          {sections.past.length}
        </Text>
      </View>
      <View className="size-8 items-center justify-center rounded-full bg-default">
        <PastChevron size={18} color={muted} />
      </View>
    </Pressable>
    {pastExpanded ? (
      <View testID="vaccines-past-list" className="gap-2.5">
        {sections.past.map(renderVaccineRow)}
      </View>
    ) : null}
  </View>
) : null}
```

El chevron no lleva `testID`. `muted`, `TOUCH_SLOP`, `TABULAR_NUMS` y
`Pressable` ya están en el fichero. El fragmento `<>` no añade un nodo host:
la cabecera y la lista quedan como hijos directos de `vaccines-section` (R4).

## Archivos afectados

Todos en `mobile-pet-tracker/` salvo que se diga otra cosa. Capa: presentación
móvil.

| Ruta | Qué cambia | R |
|---|---|---|
| `src/utils/vaccine-dates.ts` | `splitVaccines` (D1) | R2, R3 |
| `src/utils/__tests__/vaccine-dates.test.ts` | import pasa a `import { addCalendarMonthsIso, splitVaccines } from '../vaccine-dates';`, más `import type { Vaccine } from '../../api/types';`; ayudante local `vaccine(id, nextDoseAt, appliedAt = '2026-01-01'): Vaccine` (`petId: 'pet-1'`, `catalogId: null`, `name: id`, `vetName`/`clinic`/`notes`/`documentKey` `null`); `it` de R2 y R3 al final del fichero, a nivel raíz | R2, R3 |
| `src/screens/health/index.tsx` | código prescrito arriba | R1, R4–R11 |
| `src/screens/health/index.test.tsx` | dobles `ChevronDown`/`ChevronUp`, `expandVaccinesPast`, `FIXTURE_241`, `describe('#241: vacunas próximas y pasadas'` al final del fichero, y la Tabla de enmiendas | R4–R10, R12 |
| `src/i18n/catalog.ts` | dos claves por idioma tras `'health.createReminderNow'` | R1 |
| `src/__tests__/ui-copy-table.ts` | dos filas en `R5_HEALTH` con `// #241 R1` | R1 |
| `src/__tests__/health-vaccines-upcoming-past.test.ts` | **nuevo**: R1, R11 y R12 | R1, R11, R12 |
| `src/__tests__/consistency-classnames.test.ts` | +1 `TABULAR_NUMS` en Salud y en el total | R12 |
| `src/providers/__tests__/language-provider.test.tsx` | `+ 2, // #241 R1` | R12 |
| `src/__tests__/ui-language.test.ts` | `+ 2` en `R5_HEALTH` | R12 |
| `specs/mobile-ui-language/design.md` (raíz del repo) | sección §2.41 al final | R1 |
| `specs/mobile-health/requirements.md` (raíz del repo) | `## Enmienda #241` (en el commit de esta spec) | R12 |

Texto exacto de §2.41, que va al final de `specs/mobile-ui-language/design.md`
(después de §2.40, con una línea en blanco delante):

```
### §2.41 — Añadidos por #241 — Salud: vacunas próximas y pasadas

| Diseño | Clave | en | es | Cambio |
|---|---|---|---|---|
| — | `health.sectionUpcoming` | `Upcoming` | `Próximas` | ← añadida por #241 (R1) |
| — | `health.sectionPast` | `Past` | `Pasadas` | ← añadida por #241 (R1) |
```

Cabecera del test nuevo, igual que `__tests__/reminders-upcoming-past-canvas-fidelity.test.ts`:

```ts
import { en, es } from '../i18n/catalog';
import { R5_HEALTH } from './ui-copy-table';

declare function require(moduleName: 'fs'): { readFileSync: (path: string, encoding: 'utf8') => string };
declare function require(moduleName: 'path'): { join: (...paths: string[]) => string };
const { readFileSync } = require('fs');
const { join } = require('path');

const sourceRoot = join(process.cwd(), 'src');
const readSource = (path: string) => readFileSync(join(sourceRoot, path), 'utf8');
const uiLanguageDesign = () => readFileSync(join(process.cwd(), '..', 'specs', 'mobile-ui-language', 'design.md'), 'utf8');
```

El trozo de §2.41 se toma con
`design.split('### §2.41 — Añadidos por #241')[1]?.split('\n### ')[0] ?? ''`.
Para indexar `es` por una clave `string`, `const spanish: Record<string, string> = es;`
(igual en `en`).

No cambian: el backend, `api/health-records.ts`, `api/types.ts`,
`screens/reminders/`, `docs/`.

## Skills

Nombres de nuestro catálogo (el leader los traduce en el handoff):
`appllama-app-design-skill`, `expo-design-system`, `expo-native-ui`,
`expo-animation`. Ninguna dependencia nueva.

## Riesgos

- **#239 y #240 tocan `screens/reminders/index.tsx` en paralelo.** R11 lee ese
  fichero a propósito. Si una de ellas cambia un literal de la receta antes de
  que #241 mergee, R11 se pone rojo. Quien mergee detrás vuelve a medir los
  diez literales contra `dev` y, si el cambio es deliberado, lo replica en
  Salud dentro de su feature.
- **Tests existentes que esperan filas visibles al entrar.** La Tabla de
  enmiendas los lista todos los medidos; la Regla de cierre cubre los que se
  escapen, con causa nombrada.

## Alternativas descartadas

- **Ordenar en el backend.** El plan fija que el orden se hace en el móvil y
  el contrato de `GET /vaccines` (#37 R1) no cambia.
- **Extraer `SectionToggle` compartido con Recordatorios y Alertas.** Ver D2.
- **Reutilizar `reminders.sectionUpcoming` / `reminders.sectionPast`.** Son
  masculinos («Próximos», «Pasados»).
- **Caja de vacío en Próximas** con `home.noUpcomingVaccine` o
  `reminders.upcomingEmptyTitle`. Ver D5.
- **Atenuar las filas pasadas al 50 %.** Fuera de alcance (plan §6).
- **Escalonado propio para Pasadas** (`MOTION_*_PAST_STAGGER_MS` como #227).
  Ver D8.
- **Pasar `new Date()` a `splitVaccines`.** Duplicaría el cálculo del día
  local que ya hace `localTodayIso()` y obligaría al test unitario a fijar
  relojes.

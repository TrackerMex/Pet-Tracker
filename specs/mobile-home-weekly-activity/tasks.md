---
feature: "mobile-home-weekly-activity"
status: spec_ready     # draft | spec_ready | approved
tags: [harness, spec]
---

# Tareas — [[mobile-home-weekly-activity]]

> Disciplina TDD. Cada tarea corresponde a un requisito de [[requirements]] y
> tiene siempre los mismos 3 sub-items, en este orden.
>
> **Orden obligatorio**:
> `R1 → R15 → R2 → R3 → R4 → R5 → R7 → R11 → R6 → R9 → R10 → R12 → R13 → R8 → R14 → R16 → R17 → R18 → R19 → R20`.
>
> Tres cosas de ese orden no son negociables y conviene entender por qué:
> - **R1 va primero** porque el paquete es ESM y, sin tocar
>   `transformIgnorePatterns`, ninguna suite que monte la gráfica arranca: el
>   rojo sería un `SyntaxError` del runner y no probaría nada.
> - **R15 (la migración) va segunda**, antes de escribir una sola línea de la
>   gráfica. Si se migra al final, todos los ficheros, todos los `jest.mock` y
>   cuatro candados por ruta cambian de sitio en el último commit y el diff deja
>   de ser legible.
> - **R17 (copy) va casi al final** a propósito: los deltas de los candados de
>   copy solo se pueden medir cuando ya existen todas las llamadas a `t()`.
>
> **Commits test-primero, obligatorio** (`CHECKPOINTS.md` C4). Cada requisito
> deja **al menos dos commits**: uno con el test rojo y otro con la
> implementación que lo pone verde. Un único commit con test + implementación +
> docs incumple C4 y el reviewer lo rechaza; ya pasó en #19. El mensaje sigue
> `docs/conventions.md` §Commits:
> `feat(mobile-home-weekly-activity): <desc> (R5)`.
>
> **Ningún rojo puede fallar por `ReferenceError`** de un helper de test que
> todavía no existe (C4). Cada fichero de tests se crea con sus mocks y sus
> factorías completos desde el primer commit; lo que falta es el componente, no
> el andamio.
>
> **Antes de tocar nada**:
> - Carga las skills: `expo:expo-overview` → `expo:expo-native-ui`,
>   `expo:expo-design-system`, `expo:expo-animation` y `expo:expo-ui`, más
>   `appllama-app-design-skill`. Obligatorio en trabajo móvil (carta §Skills). La
>   carta gana sobre la skill en todo conflicto. SDK del proyecto: **Expo 57**;
>   documentación fijada a esa versión, nunca `latest`.
> - Borra `mobile-pet-tracker/.expo/types/router.d.ts` si existe: está
>   gitignorado y rompe el typecheck con rutas fantasma.
> - Comprueba que no hay otro `init.sh` corriendo en un worktree hermano
>   (`pgrep -f init.sh`): comparten el Postgres de docker y se pisan.
> - Trabaja en `feature/68-mobile-home-weekly-activity`. Nunca en `main`.

---

## Andamio común del fichero de tests de la gráfica

Se escribe **una vez**, en el primer commit rojo de R2, y no vuelve a tocarse:

```ts
import { fireEvent, render, screen } from '@testing-library/react-native';
import { HeroUINativeProvider } from 'heroui-native';

import type { DayEntry, WeekComparison } from '../../api/types';
import { LanguageProvider } from '../../providers/language-provider';
import {
  WeeklyActivityChart,
  WEEKLY_METRICS,
  weekdayLabel,
  CHART_PAD_LEFT,
  CHART_PAD_RIGHT,
  BAR_ENTRY_DURATION_MS,
  BAR_ENTRY_STAGGER_MS,
} from './weekly-activity-chart';

jest.mock('@expo/ui/community/segmented-control', () => {
  // Mismo patrón que src/screens/reminders/index.test.tsx:39 para
  // @expo/ui/community/bottom-sheet: un View con el testID y las props.
});

function makeDay(overrides: Partial<DayEntry> = {}): DayEntry { /* como el de la Home */ }
function makeWeek(from: string, minutes: (number | null)[]): DayEntry[] { /* fechas consecutivas desde `from` */ }
const NO_COMPARISON: WeekComparison = { distanceM: null, activeMinutes: null, walkCount: null };
function renderChart(
  days: DayEntry[],
  weekComparison: WeekComparison = NO_COMPARISON,
  language: 'es' | 'en' = 'es',
) { /* envuelve en LanguageProvider + HeroUINativeProvider y dispara onLayout con un ancho fijo */ }
```

Dos detalles que **no** son opcionales:

- `makeWeek` genera fechas consecutivas **descomponiendo la cadena**, con la
  misma aritmética que exige R4: si el helper de test parseara con
  `new Date(cadena)`, arrastraría el mismo bug que el test persigue.
- `renderChart` **dispara `onLayout`** con un ancho fijo y conocido (por ejemplo
  295, el ancho interior de la tarjeta en una pantalla de 375 px). Sin eso, R11
  hace que el `BarChart` no se monte y todos los demás tests fallan por la razón
  equivocada.

---

## R1 — La dependencia entra pinneada, por `/v2`, y el runner la transforma

- [ ] (1) Escribir test que falla para R1 —
      `src/screens/home/weekly-activity-chart.test.tsx`,
      `describe('R1: la gráfica entra por el subpath v2 y por ningún otro')`:
      un `it` que lee `package.json` y espera
      `dependencies['react-native-chart-kit'] === '7.0.4'` y que
      `jest.transformIgnorePatterns[0]` contenga `react-native-chart-kit` y
      `paths-js`; y un `it` que lee el fuente del componente con `readFileSync`
      —patrón de `src/__tests__/consistency-classnames.test.ts`— y espera que
      contenga `from 'react-native-chart-kit/v2'` y **no** contenga
      `from 'react-native-chart-kit'` ni `react-native-chart-kit/dist`.
- [ ] (2) Implementación mínima que lo pasa —
      `npx expo install react-native-chart-kit@7.0.4` desde
      `mobile-pet-tracker/`, fijar la versión **sin rango** en `package.json`, y
      añadir `react-native-chart-kit` y `paths-js` a la alternancia de
      `jest.transformIgnorePatterns` (junto a `react-native-svg`).
- [ ] (3) Refactor con tests verdes. **Comprueba aquí, antes de seguir**, que
      `bun run test` sigue verde entero: si el paquete no se transforma, todo lo
      demás fallará por `SyntaxError` y no por conducta.

## R1b — La versión queda pinneada porque la geometría depende de sus constantes

- [ ] (1) Escribir test que falla para R1b — mismo `describe` →
      `it('pinea 7.0.4 porque la geometría del eje depende de sus constantes')`.
- [ ] (2) Implementación mínima que lo pasa — el assert de versión exacta y el
      comentario en el fuente que enumera las cinco constantes acopladas de
      [[design]] §3 D6.
- [ ] (3) Refactor con tests verdes.

## R15 — La Home se migra a `src/screens/home/` con route delgado

- [ ] (1) Escribir test que falla para R15 — en
      `src/__tests__/design-drift.test.ts`, añadir `'app/(tabs)/home.tsx'` a la
      lista de `routes` del `it('keeps the three Expo Router entrypoints thin')`
      (renombrando el `it` a cuatro). Con `home.tsx` en sus 373 líneas, el
      `toBeLessThan(10)` se pone rojo.
- [ ] (2) Implementación mínima que lo pasa — mover el cuerpo a
      `src/screens/home/index.tsx` (`export function HomeScreen()`), dejar
      `src/app/(tabs)/home.tsx` en la forma exacta de
      `src/app/(tabs)/pairing.tsx`, mover
      `src/app/(tabs)/__tests__/home.test.tsx` a
      `src/screens/home/index.test.tsx` ajustando **solo** rutas relativas de
      `import` y `jest.mock`, y sacar `fmtMinutes`/`fmtKm`/`fmtCount` a
      `src/screens/home/format.ts`.
      **Reubicar** en el mismo commit las cuatro filas por ruta que enumera
      [[requirements]] R19 (a): `#62 R14`, `#62 R15`, `#61 R4` y las filas
      `R3_HOME` de `ui-copy-table.ts`. Las cifras **no cambian**; si alguna
      cambia, para y repórtalo.
- [ ] (3) Refactor con tests verdes. **Ningún assert de
      `src/screens/home/index.test.tsx` se debilita ni se borra en este paso.**

## R2 — El componente existe con su API exacta y no habla con la red

- [ ] (1) Escribir test que falla para R2 —
      `describe('R2: WeeklyActivityChart recibe los días y no habla con la red')`:
      monta con siete días medidos y espera `testID="weekly-activity-card"`; y
      lee el fuente para asertar que **no** contiene `from '../../api/activity'`,
      ni `use-api`, ni `fetch(`, ni `expo-router`, y que su única importación de
      `../../api/types` es `import type`.
- [ ] (2) Implementación mínima que lo pasa — crear
      `src/screens/home/weekly-activity-chart.tsx` con la firma de R2, las
      constantes exportadas, la `Card` compartida y la cabecera (título
      `text-base font-bold text-foreground`, subtítulo a la derecha).
- [ ] (3) Refactor con tests verdes.

## R3 / R4 — La letra del eje sale de la fecha y sobrevive a la zona horaria

- [ ] (1) Escribir test que falla —
      `describe('R3: la letra del eje sale de la fecha, no del índice')`, dos
      `it`:
      - `it('usa el día real de cada fecha en los dos idiomas')`: rango
        `2026-09-02 … 2026-09-08` (miércoles a martes: **no** empieza en lunes y
        **cruza el fin de semana**); espera
        `['mié','jue','vie','sáb','dom','lun','mar']` con `language='es'` y
        `['Wed','Thu','Fri','Sat','Sun','Mon','Tue']` con `language='en'`, y que
        los siete `testID` sean `weekly-activity-day-<fecha>` en ese orden. Una
        implementación por índice devolvería siempre la misma secuencia
        empezando en lunes y muere aquí.
      - `it('no se desplaza un día en una zona horaria negativa')` (R4): guarda
        `process.env.TZ`, lo pone a `'America/Mexico_City'`, llama a
        `weekdayLabel('2026-09-06', 'es-MX', 'short')`, espera `'dom'`, y
        restaura la variable en un `finally`. Con `new Date('2026-09-06')`
        devuelve `'sáb'` — comprobado en Node 20.
- [ ] (2) Implementación mínima que lo pasa — `weekdayLabel` con
      `const [year, month, day] = date.split('-').map(Number)` y
      `new Date(year, month - 1, day).toLocaleDateString(locale, { weekday: style })`;
      la fila de siete columnas con su etiqueta en
      `text-2xs font-semibold text-muted`; `showXAxisLabels={false}` en el
      `BarChart`.
- [ ] (3) Refactor con tests verdes.

## R5 — "Sin dato" y "cero confirmado" no se confunden

- [ ] (1) Escribir test que falla para R5 —
      `describe('R5: un día sin dato no es una barra de altura cero')`, tres
      `it`: una semana con un día `{ source: 'missing', activeMinutes: null }` y
      otro `{ source: 'stored', activeMinutes: 0 }` espera
      `weekly-activity-missing-<fecha>` presente y
      `weekly-activity-value-<esa fecha>` ausente, y a la inversa para el día de
      cero; un `it` que comprueba que el valor que se le pasa al `BarChart` para
      el día `missing` es `null` y no `0`; y un `it` con
      `{ source: 'stored', activeMinutes: null }` —combinación que el backend no
      produce hoy pero que el tipo permite— que comprueba que se pinta **valor**,
      no guion. Ese último es el que fija `source` como discriminante.
- [ ] (2) Implementación mínima que lo pasa — la rama por `day.source`, el
      `null` hacia el `BarChart`, el glifo `'—'` en
      `text-2xs font-normal text-muted` y el mínimo de `BAR_MIN_HEIGHT` dentro de
      `renderBar`.
- [ ] (3) Refactor con tests verdes.

## R7 — Eje Y, rejilla y línea de media

- [ ] (1) Escribir test que falla para R7 —
      `describe('R7: la gráfica dibuja eje Y, rejilla y línea de media')`, tres
      `it`: que `formatYLabel` devuelve **exactamente cuatro caracteres** para
      `0`, `45`, `1440` y `12.3`; que `weekly-activity-average` existe y su
      etiqueta usa `TABULAR_NUMS`; y que la media **ignora los días `missing`**
      (una semana con tres medidos y cuatro huecos promedia sobre tres).
- [ ] (2) Implementación mínima que lo pasa — `showYAxisLabels`,
      `showHorizontalGridLines`, `yTickCount={4}`, `formatYLabel` con `padStart`,
      y la línea de media dibujada desde `renderBar` con la geometría del propio
      `bar` ([[design]] §3 D6).
- [ ] (3) Refactor con tests verdes.

## R11 — La gráfica se dimensiona por `onLayout`

- [ ] (1) Escribir test que falla para R11 —
      `describe('R11: la gráfica se dimensiona por onLayout, no por porcentaje')`,
      dos `it`: sin `onLayout` disparado, el `BarChart` no se monta y el
      envoltorio conserva su altura; tras un `onLayout` de 295 px, el `BarChart`
      recibe `width` numérico y `height` igual a
      `CHART_PAD_TOP + CHART_PLOT_HEIGHT + CHART_PAD_BOTTOM`.
- [ ] (2) Implementación mínima que lo pasa — el estado de ancho y el guard de
      montaje.
- [ ] (3) Refactor con tests verdes.

## R6 — El selector cambia de métrica sin volver a pedir nada

- [ ] (1) Escribir test que falla para R6 —
      `describe('R6: el selector cambia de métrica sin volver a pedir nada')`:
      que existe `weekly-activity-metric` con las tres etiquetas del catálogo en
      el orden de `WEEKLY_METRICS`; que al disparar
      `onChange({nativeEvent:{selectedSegmentIndex:1, value:…}})` los valores por
      columna pasan a distancia; y que el fuente **no** llama a
      `useThemeColors(['accent'])`.
- [ ] (2) Implementación mínima que lo pasa — el `SegmentedControl` de
      `@expo/ui/community/segmented-control`, el estado local de métrica y el
      `tintColor` de `useThemeColors(['accent-strong'])`.
- [ ] (3) Refactor con tests verdes.

## R9 — Cada columna se anuncia por separado

- [ ] (1) Escribir test que falla para R9 —
      `describe('R9: cada columna se anuncia por separado')`: que la columna de
      un día de 45 minutos tiene `accessibilityLabel`
      `'sábado: 45 minutos activos'` en `es` y `'Saturday: 45 active minutes'` en
      `en`; que la del día `missing` tiene `'domingo: sin datos'`; que el
      contenedor de las siete **no** tiene `accessibilityLabel`; que el
      `BarChart` recibe un `accessibilityLabel` que sale de `t()`; y que el
      fuente **no** menciona `getBarChartAccessibilitySummary`.
- [ ] (2) Implementación mínima que lo pasa — `accessible`,
      `accessibilityRole="button"` y `accessibilityLabel` en cada columna,
      resueltos con `t()` y `weekdayLabel(..., 'long')`, con área táctil ≥44 pt.
- [ ] (3) Refactor con tests verdes.

## R10 — Las barras entran animadas y respetan `reduced motion`

- [ ] (1) Escribir test que falla para R10 —
      `describe('R10: las barras entran animadas y respetan reduced motion')`,
      dos `it`: con `useReducedMotion()` mockeado a `true`, la barra sale con su
      altura final desde el primer render y **no** se llama a `withTiming`; con
      `false`, `withDelay` recibe `index * BAR_ENTRY_STAGGER_MS` y `withTiming`
      la duración `BAR_ENTRY_DURATION_MS`. El mock del hook sigue el patrón de
      `src/theme/__tests__/theme-transition.test.tsx:11,22`.
- [ ] (2) Implementación mínima que lo pasa — el componente de barra animada con
      `Animated.createAnimatedComponent(Rect)` y `useAnimatedProps`, devuelto
      desde `renderBar`.
- [ ] (3) Refactor con tests verdes.

## R12 — La tendencia sigue a la métrica y se calla sin base

- [ ] (1) Escribir test que falla para R12 —
      `describe('R12: la tendencia sigue a la métrica y se calla sin base')`,
      cinco `it`: `activeMinutes: 12.5` pinta `weekly-activity-trend` con
      `'+12,5'` (`es-MX`) y `TrendUp`; `-8.3` pinta `TrendDown`; `0` pinta la
      fila sin icono; `null` **no** pinta la fila (`queryByTestId` devuelve
      `null`); y al cambiar a distancia la fila pasa a leer
      `weekComparison.distanceM`. Un `it` más comprueba `TABULAR_NUMS` y la
      ausencia de `text-success` y `text-danger`.
- [ ] (2) Implementación mínima que lo pasa — la fila con `TrendUp`/`TrendDown`
      de `reicon-react-native`, color de `useThemeColors(['muted'])`,
      `Intl.NumberFormat(locale, { signDisplay: 'exceptZero', maximumFractionDigits: 1 })`
      y `TABULAR_NUMS`.
- [ ] (3) Refactor con tests verdes.

## R13 — La semana entera sin dato es un mensaje

- [ ] (1) Escribir test que falla para R13 —
      `describe('R13: la semana entera sin dato se resuelve con un mensaje')`:
      siete días `missing` ⇒ `weekly-activity-empty` presente, ningún
      `weekly-activity-day-*` y **sin** `weekly-activity-metric`; `days: []` ⇒
      igual; y con **un** día medido y seis `missing` ⇒ las siete columnas
      presentes y `weekly-activity-empty` ausente. En los tres casos la cabecera
      sigue.
- [ ] (2) Implementación mínima que lo pasa — la rama de vacío con el `Text` de
      `weeklyActivity.noDataYet`.
- [ ] (3) Refactor con tests verdes.

## R8 — Tocar un día abre su detalle, y el mapa solo se ofrece para hoy

- [ ] (1) Escribir test que falla para R8 — en el fichero de la gráfica,
      `describe('R8: tocar un día abre su detalle')`: al pulsar una columna
      aparecen `weekly-activity-tooltip` y `weekly-activity-detail` con las
      cuatro métricas del día; al pulsar un día `missing` el panel muestra
      `weeklyActivity.noDataForDay`; y `onSelectDay` recibe la `DayEntry`
      completa. En `src/screens/home/index.test.tsx`,
      `it('ofrece el mapa solo para el día de hoy')`: seleccionando la última
      entrada aparece `weekly-activity-day-map` y pulsarlo llama a
      `mockRouter.push` con `'/map'`; seleccionando cualquier otra, el testID
      **no** existe.
- [ ] (2) Implementación mínima que lo pasa — el estado de selección, el
      `interaction={{ mode: 'tap', onSelect }}` del `BarChart`, el tooltip propio
      anclado en `event.position.x` y recortado a los bordes, el panel de
      detalle, y en la pantalla la acción condicionada.
- [ ] (3) Refactor con tests verdes.

## R14 / R14b — La Home la monta, en su sitio, sin pedir nada nuevo

- [ ] (1) Escribir test que falla para R14 — `src/screens/home/index.test.tsx`,
      `describe('R14: la Home monta la actividad semanal sin pedir nada nuevo')`,
      cuatro `it`: la tarjeta aparece con los siete días del mock; el orden de
      hijos de `home-content` es `summary-card` → `weekly-activity-card` →
      `last-position-card` (leído del árbol, no del texto);
      `mockGetDailyActivity` se llama el mismo número de veces que en el
      escenario equivalente ya existente, **también después de cambiar de
      métrica**; y (R14b) con `getDailyActivity` pendiente aparece
      `weekly-activity-skeleton`, y con `kind: 'error'` no aparece ni la tarjeta
      ni el skeleton mientras `summary-note` sí.
- [ ] (2) Implementación mínima que lo pasa — el `import` y el bloque en
      `src/screens/home/index.tsx` entre `summary-card` y `last-position-card`.
      **Solo eso**: no se toca `today`, ni `summary-card`, ni `collar-card`, ni
      el hero, ni el `contentContainerStyle`.
- [ ] (3) Refactor con tests verdes.

## R16 — El enum de conectividad se traduce por catálogo

- [ ] (1) Escribir test que falla para R16 —
      `src/utils/device-connectivity.test.ts`,
      `describe('R16: la conectividad se traduce por catálogo')`, tres `it`:
      `'online'` → `'deviceConnectivity.online'`; `'LTE'` →
      `'deviceConnectivity.unknown'`; `null` → `null`. Y en
      `src/screens/pairing/index.test.tsx`, cambiar el assert de `:511` para
      esperar la etiqueta traducida en lugar de `'LTE'`, **dejando intactos** los
      de `:531,:543`.
- [ ] (2) Implementación mínima que lo pasa — crear
      `src/utils/device-connectivity.ts` con `DEVICE_CONNECTIVITY_META` y
      `connectivityLabelKey`, y cambiar **solo**
      `src/screens/pairing/index.tsx:422`. No se toca `home.tsx:208,220`.
- [ ] (3) Refactor con tests verdes.

## R17 — Copy en los dos idiomas, registrada donde toca

- [ ] (1) Escribir test que falla para R17 — añadir las filas nuevas a
      `src/__tests__/ui-copy-table.ts` (las `weeklyActivity.*` a `R3_HOME`, las
      `deviceConnectivity.*` a `R10_PAIRING` con
      `file: 'src/utils/device-connectivity.ts'`) y subir los tres
      `toHaveLength` por el delta de [[requirements]] R19 (b). Con el catálogo
      todavía sin las claves, el fichero **no compila** (`TranslationKey` no las
      conoce): ése es el rojo, y es el candado preexistente de #65 haciendo su
      trabajo.
- [ ] (2) Implementación mínima que lo pasa — las dieciséis claves en `en` y en `es`
      de la tabla de [[requirements]] R17, con los valores exactos, y el registro
      en `specs/mobile-ui-language/design.md` §2.
- [ ] (3) Refactor con tests verdes.

## R18 — Cero hex, cero clases arbitrarias, cero `StyleSheet`

- [ ] (1) Escribir test que falla para R18 — en
      `src/__tests__/design-drift.test.ts`, un `describe` nuevo
      `'#68 R18: la actividad semanal no mete drift de estilo'` con la lista
      nominal de ficheros nuevos y tocados de esta feature y el mismo patrón que
      usa el bloque `R9` (`/text-\[10px\]|#[\da-f]{3,8}\b|StyleSheet/i`).
- [ ] (2) Implementación mínima que lo pasa — pasar los colores del gráfico por
      `theme` desde `useThemeColors`, como fija [[design]] §3 D7, y quitar
      cualquier literal que el candado encuentre. **No se añade ninguna
      excepción al candado**: si algún color no se puede expresar sin literal,
      **para y repórtalo** — es un hallazgo, no algo que se resuelva relajando el
      test.
- [ ] (3) Refactor con tests verdes.

## R19 — Los candados se mueven por delta declarado

- [ ] (1) Medir con `grep` los dos deltas reales de
      `consistency-classnames.test.ts` (`#62 R14` y `#62 R15` para
      `screens/home/weekly-activity-chart.tsx`) y añadir la fila y el total en el
      mismo commit. Comprobar que `#61 R4` (13) sigue **sin cambio** y que las
      cuatro reubicaciones de R15 no movieron ninguna cifra. Si algún total se
      mueve por una causa que [[requirements]] R19 no prevé: **para y repórtalo**,
      no lo absorbas subiendo el número.
- [ ] (2) Añadir a `design-drift.test.ts` el assert de dependencia
      (`react-native-chart-kit === '7.0.4'`) junto a los de #40.
- [ ] (3) Refactor con tests verdes.

## R20 — Verificación y prueba de mutación

- [ ] (1) Suite completa verde: `bun run test` desde `mobile-pet-tracker/`, con
      `design-drift.test.ts`, `consistency-classnames.test.ts`,
      `legibility-classnames.test.ts`, `global-css.test.ts` y
      `ui-language.test.ts` incluidos. Ningún assert de conducta debilitado,
      ningún `testID` existente renombrado.
- [ ] (2) `npm run typecheck` (o `bun run typecheck`) en verde: el `.d.ts` de la
      v2 es genérico (`BarChart<TData extends Record<string, unknown>>`) y un
      `any` colado ahí se lo traga el runtime pero no el compilador.
- [ ] (3) **Prueba de mutación** — plantar las cinco, de una en una, correr la
      suite, comprobar que se pone **roja**, revertir, y dejar la evidencia
      (mutación, test que la mata, salida) en
      `progress/impl_mobile-home-weekly-activity.md` §prueba de mutación:

      | # | Mutación | Debe matarla |
      |---|---|---|
      | 1 | la etiqueta del eje pasa a salir del índice (`['lun','mar',…][index]`) | R3, `it` de los dos idiomas |
      | 2 | `new Date(year, month - 1, day)` → `new Date(date)` | R4, `it` de TZ, y **solo** ése |
      | 3 | la rama `missing` pasa a decidirse por `valor === null` | R5, `it` de `source:'stored'` con métrica `null`, y **solo** ése |
      | 4 | desaparece el `accessibilityLabel` de la columna `missing` | R9 |
      | 5 | el import pasa a `from 'react-native-chart-kit'` | R1 |

      Las importantes son la **2** y la **3**: las dos pasan la suite entera si su
      candado está mal escrito. Si al plantar cualquiera de las dos la suite
      sigue verde, el `it` correspondiente está mal escrito y hay que arreglarlo
      **antes** de seguir — es exactamente el fallo que se coló en #65.

---

## Cierre

- [ ] Trazabilidad completa: [[traceability]] sin ninguna fila "pendiente".
- [ ] `progress/impl_mobile-home-weekly-activity.md` escrito, con los deltas
      medidos por `grep` (no copiados de esta spec) y la prueba de mutación.
- [ ] PR abierto con `gh pr create` desde
      `feature/68-mobile-home-weekly-activity`. **No se mergea**: lo hace el
      humano.
- [ ] **Gate humano, no delegable a IA**: smoke en dev build de Android, tema
      claro y oscuro, con una mascota que tenga al menos un día sin dato y al
      menos un día de cero minutos. Guion completo en [[requirements]]
      §Aprobación.

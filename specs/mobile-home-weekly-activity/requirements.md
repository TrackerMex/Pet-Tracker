---
feature: "mobile-home-weekly-activity"
status: approved       # draft | spec_ready | approved
tags: [harness, spec]
---

# Requisitos — [[mobile-home-weekly-activity]]

> Notación EARS. Cada requisito tiene id único R\<n\>, inmutable una vez aprobado.
> Ver [[design]] para las decisiones técnicas, las premisas verificadas y las
> alternativas descartadas; [[../../docs/ui-guidelines|ui-guidelines]] para la
> carta de UI que gobierna todo trabajo móvil (gana sobre cualquier skill) y
> [[../../docs/architecture|architecture]] para las reglas de capas.
>
> **REESCRITA EL 2026-09-07.** La versión anterior se firmó en `a1fa09e` para un
> alcance estrecho —siete barras estáticas, sin librería, sin interacción—. El
> humano amplió el alcance el mismo día y esa firma **ya no cubre lo que aquí se
> pide**: la casilla de §Aprobación vuelve sin marcar y hace falta **una firma
> nueva**. Lo que sobrevive de la versión anterior son los hallazgos verificados
> (§0), no sus requisitos.
>
> **Fuente de diseño** (versionada, no de memoria):
> `specs/mobile-figma-polish/design-src/App.tsx:411-424` — la gráfica de
> actividad semanal de la Home del Figma Make. Informe de origen:
> `progress/explore_design-gap-vs-make.md` §7 (Bloque 1).
>
> **Base de medición**: todo delta de esta spec se mide contra el commit base de
> la branch, `4a5f6dd` (merge del PR #112, #67). Ningún requisito congela un
> recuento absoluto: se fijan **deltas** y **consistencias internas**, porque un
> número absoluto caduca entre que se escribe la spec y se implementa. Es la
> cuarta vez que se dice; las tres anteriores costaron una sesión cada una.
>
> **Skills obligatorias antes de tocar código** (carta §Skills):
> `expo:expo-overview` → `expo:expo-native-ui`, `expo:expo-design-system`,
> `expo:expo-animation` y `expo:expo-ui`, más `appllama-app-design-skill`. En
> Codex CLI, las equivalentes del plugin `expo`. La carta gana sobre la skill en
> todo conflicto de estilo. SDK del proyecto: **Expo 57** (`package.json`); usar
> la documentación fijada a esa versión, nunca `latest`.

---

## 0. Premisas, verificadas una por una contra el árbol

Las premisas del enunciado de #68 y las del encargo de reescritura se han
comprobado **contra el árbol y contra el tarball del paquete**, no contra
documentación ni contra `progress/`. El detalle con `fichero:línea` vigente está
en [[design]] §1. **Cuatro premisas salieron falsas** y están en [[design]] §2.

| # | Premisa | Veredicto |
|---|---|---|
| 1 | Una entrada por día sin huecos; 7 días por defecto terminando hoy en la tz del dueño | **Cierta** |
| 2 | El cliente llama sin parámetros (`src/api/activity.ts:26-31`) | **Cierta** |
| 3 | La Home descarta seis de siete y se queda con la última (`home.tsx:100-103`) | **Cierta** |
| 4 | El discriminante de "sin dato" es `source` y **nunca** `null` | **Cierta** (§0.1) |
| 5 | El array es cronológico terminando hoy, no lunes a domingo | **Cierta** |
| 6 | `weekComparison` es delta porcentual de la media diaria a un decimal, sin `restMinutes` | **Cierta** (§0.2) |
| 7 | `react-native-chart-kit/v2` modela `number \| null`; la v1 no | **Cierta** (§0.3) |
| 8 | `src/screens/pairing/index.tsx:421-422` pinta `connectivity` en bruto y su test lo fija en `index.test.tsx:511` | **Cierta** (§0.4) |
| 9 | *"Los colores de chart-kit entran por `chartConfig` / `Dataset.color(opacity)`"* | **FALSA para la v2** ([[design]] §2 C1) |
| 10 | *"Navegación a `/trips` por la ruta que ya existe"* | **FALSA: `/trips` no existe** ([[design]] §2 C2) |
| 11 | *"`getBarChartAccessibilitySummary` sirve como etiqueta del gráfico"* | **Cierta a medias**: existe, pero devuelve **inglés fijo** ([[design]] §2 C3) |
| 12 | *"`emptyActivity()` está en `pipeline/activity.ts:83-91`"* | **Cierta con línea corta**: la función va de `:83` a `:93` ([[design]] §2 C4) |

### 0.1 El discriminante es `source`, nunca `activeMinutes === null`

`missingEntry()`
(`backend-pet-tracker/src/modules/activity/application/use-cases/get-daily-activity.use-case.ts:194-207`)
pone las nueve métricas a `null` y `source: 'missing'`. Pero **ningún día medido
vuelve con `null`**: un día `stored` lo trae de una columna no nula
(`daily-activity.entity.ts`) y un día `computed` lo calcula
`computeDailyActivity`, que devuelve **ceros** cuando no hay posiciones
(`backend-pet-tracker/src/pipeline/activity.ts:83-93`, `emptyActivity()`).

Consecuencia normativa: `null` y `missing` coinciden **hoy**, y por eso una
implementación que ramifique por `activeMinutes === null` pasaría todos los tests
siendo semánticamente falsa. La rama de "sin dato" se decide por
**`day.source === 'missing'`** y por nada más (R5), y la mutación 3 de R20 planta
exactamente ese cambio para demostrar que el candado lo ve.

### 0.2 `weekComparison` es un **delta porcentual de la media diaria**

`backend-pet-tracker/src/modules/activity/domain/week-comparison.ts:24-51`
devuelve, por métrica, `round(((media del rango − media de la base) / media de la
base) × 1000) / 10` —porcentaje a un decimal— y `null` cuando alguna ventana no
tiene muestras o la media base vale 0 (`:39-46`). Cubre **tres** métricas:
`distanceM`, `activeMinutes` y `walkCount` (`:12-16`). **`restMinutes` no tiene
comparación.**

Eso decide el alcance del selector de métrica (R6): las tres métricas
seleccionables son **exactamente** las tres que `weekComparison` cubre, de modo
que la fila de tendencia (R12) existe para las tres y no hay una cuarta pestaña
muda.

### 0.3 `react-native-chart-kit@7.0.4`: la v1 pierde el `null`, la v2 no

Verificado desempaquetando el tarball (`npm pack react-native-chart-kit@7.0.4`),
no leyendo la documentación:

- **v1 (raíz)**: `dist/shared/types.d.ts:3-21` — `Dataset.data: number[]`, sin
  `null`. Un día sin dato tendría que entrar como `0` y la gráfica **mentiría**.
  Colores por `Dataset.color?: (opacity: number) => string` y
  `ChartConfig.backgroundGradientFrom?: string` (`:28-40`).
- **v2 (`react-native-chart-kit/v2`)**: `dist/v2/core/data/types.d.ts` —
  `ChartYValue = number | null`; `normalizeNumberValue`
  (`dist/v2/core/data/normalizeValues.js`) devuelve `null` para `null` **sin
  warning**, y `buildGroupedBars` (`dist/v2/core/geometry/barRects.js:76-82`)
  **no emite rect** para un punto no numérico. `BarChartDataTableRow.values` es
  `Record<string, number | null>` (`dist/v2/react-native/charts/bar/accessibility.d.ts`).
- El `exports` del paquete expone **solo** `.`, `./v2` y `./package.json`: no hay
  deep import legal a `dist/`.

De ahí R1: **import obligatorio por `react-native-chart-kit/v2`, y un candado que
prohíbe el import de la raíz.**

### 0.4 El enum crudo: qué se pinta hoy y dónde

`src/screens/pairing/index.tsx:421-422`:

```
421                testID="device-connectivity"
422                value={selectedPet.device.connectivity ?? '—'}
```

y su test lo fija en `src/screens/pairing/index.test.tsx:511`
(`toHaveTextContent('LTE')`, con la fixture en `:103`) y en `:531,:543` para el
caso `null → '—'`. **El test vive en `src/screens/pairing/index.test.tsx`, no en
un `__tests__/`.**

El tipo es **`connectivity: string | null`** (`src/api/types.ts:47`), no una
unión cerrada, y el backend solo escribe **un** valor:
`connectivity: 'online'` en
`backend-pet-tracker/src/workers/ingestion.drizzle.store.ts:97`, sobre una
columna `varchar(20)` nullable (`db/schema/devices.schema.ts:38`). Por eso el
catálogo de R16 es un mapa **con rama por defecto**, no un `Record` exhaustivo:
cualquier valor no conocido se traduce a "desconocida", jamás se pinta crudo
(carta §Dirección de arte 4, jerga del proveedor).

---

## Requisitos

### R1 — La dependencia se declara, se instala pinneada y entra **solo** por `/v2`

- **R1**: WHEN esta feature añade su dependencia THE SYSTEM SHALL declararla en
  `mobile-pet-tracker/package.json` como **`"react-native-chart-kit": "7.0.4"`**
  (versión exacta, sin `^` ni `~`), instalada con
  `npx expo install react-native-chart-kit@7.0.4` desde `mobile-pet-tracker/`;
  AND THE SYSTEM SHALL **no** añadir ninguna otra dependencia nueva; AND ningún
  fuente de `mobile-pet-tracker/src/` SHALL importar
  `from 'react-native-chart-kit'` (la raíz, API v1) ni
  `from 'react-native-chart-kit/dist/...'` (deep import ilegal): **el único
  import permitido es `from 'react-native-chart-kit/v2'`**.
  - Peers verificados contra `mobile-pet-tracker/package.json`, los tres se
    cumplen y **ninguno hay que instalar**: `react >=19.1.0 <20` (hay `19.2.3`),
    `react-native >=0.81 <1` (hay `0.86.2`), `react-native-svg >=15.12.1 <16`
    (hay `15.15.4`). Arrastra una dependencia transitiva, `paths-js@^0.4.11`,
    JS puro, sin módulo nativo: **no hay que reconstruir el dev build**.
  - **Jest**: el paquete se publica en **ESM** (`v2/index.js` es
    `export * from "../dist/v2/index.js"`). El preset `jest-expo` de este repo
    ignora `node_modules` salvo la lista blanca de
    `package.json` → `jest.transformIgnorePatterns`. THE SYSTEM SHALL añadir
    `react-native-chart-kit` y `paths-js` a esa lista blanca, junto a
    `react-native-svg`, o **ninguna suite que monte la gráfica arranca**.
  - Test: `src/screens/home/weekly-activity-chart.test.tsx` ::
    `describe('R1: la gráfica entra por el subpath v2 y por ningún otro')` —
    lee el fuente con `readFileSync` (patrón de
    `src/__tests__/consistency-classnames.test.ts`) y asserta el import exacto,
    la ausencia del import de raíz y la ausencia de `dist/`; más un `it` que lee
    `package.json` y asserta `dependencies['react-native-chart-kit'] === '7.0.4'`
    y las dos entradas nuevas de `transformIgnorePatterns`.

- **R1b**: WHEN alguien suba la versión del paquete THE SYSTEM SHALL fallar un
  test, porque esta spec depende de **constantes internas de layout** de la 7.0.4
  ([[design]] §3 D6) que una versión nueva puede mover sin avisar.
  - Test: mismo `describe` que R1 →
    `it('pinea 7.0.4 porque la geometría del eje depende de sus constantes')`,
    que asserta la versión exacta **y** deja el comentario que enumera las cinco
    constantes acopladas.

### R2 — El componente existe, con su API exacta, y no habla con la red

- **R2**: WHEN la app monta `WeeklyActivityChart` THE SYSTEM SHALL exponerlo
  desde `mobile-pet-tracker/src/screens/home/weekly-activity-chart.tsx` con la
  firma exacta

  ```ts
  export type WeeklyMetric = 'activeMinutes' | 'distanceM' | 'walkCount';

  export interface WeeklyActivityChartProps {
    days: DayEntry[];
    weekComparison: WeekComparison;
  }

  export function WeeklyActivityChart(
    props: WeeklyActivityChartProps,
  ): JSX.Element;
  ```

  AND SHALL exportar además, **para los tests y para nadie más**:
  `WEEKLY_METRICS: readonly WeeklyMetric[]` (en el orden
  `['activeMinutes', 'distanceM', 'walkCount']`),
  `weekdayLabel(date: string, locale: string, style: 'short' | 'long'): string`,
  `CHART_PAD_LEFT`, `CHART_PAD_RIGHT`, `CHART_PAD_TOP`, `CHART_PAD_BOTTOM`,
  `CHART_PLOT_HEIGHT`, `CHART_AXIS_LABEL_SIZE`, `Y_LABEL_CHARS`,
  `BAR_ENTRY_DURATION_MS` y `BAR_ENTRY_STAGGER_MS`;
  AND el fuente del componente SHALL **no** importar nada de `src/api/` que no
  sea un tipo (`import type`), ni `src/hooks/use-api`, ni `fetch`, ni
  `expo-router` (la navegación la decide la pantalla, R8).
  - Test: `src/screens/home/weekly-activity-chart.test.tsx` ::
    `describe('R2: WeeklyActivityChart recibe los días y no habla con la red')`

### R3 — Una columna por día, en el orden recibido, y la letra sale de la fecha

- **R3**: WHEN `WeeklyActivityChart` recibe `days` THE SYSTEM SHALL construir el
  `data` del `BarChart` **en el mismo orden del array** (cronológico ascendente,
  §0 premisa 5), sin reordenar, sin rellenar y sin recortar, con `xKey: 'date'`;
  AND SHALL renderizar bajo el gráfico **una columna táctil por entrada**
  (R9), cada una con `testID={`weekly-activity-day-${day.date}`}` — el `testID`
  es **la fecha, nunca el índice**; AND la etiqueta visible de cada columna SHALL
  derivarse de `day.date` mediante `weekdayLabel(day.date, locale, 'short')`,
  con el `locale` de `useLocale()` de `src/providers/language-provider.tsx:82`
  (`'es-MX'` o `'en-US'`); AND THE SYSTEM SHALL **no** derivar la etiqueta del
  índice del array ni de una tabla fija de siete letras; AND THE SYSTEM SHALL
  pasar `showXAxisLabels={false}` al `BarChart`, porque la fila de columnas
  táctiles **es** el eje X (D5).
  - Test: `src/screens/home/weekly-activity-chart.test.tsx` ::
    `describe('R3: la letra del eje sale de la fecha, no del índice')` →
    `it('usa el día real de cada fecha en los dos idiomas')`, que monta el rango
    `2026-09-02 … 2026-09-08` —que **no** empieza en lunes y **cruza el fin de
    semana**— y espera exactamente `['mié','jue','vie','sáb','dom','lun','mar']`
    en `es` y `['Wed','Thu','Fri','Sat','Sun','Mon','Tue']` en `en`. Una
    implementación por índice devuelve siempre la misma secuencia empezando en
    lunes y muere aquí.

### R4 — La letra del eje sobrevive a una zona horaria de offset negativo

- **R4**: WHEN se convierte `day.date` en etiqueta THE SYSTEM SHALL construir la
  fecha **descomponiendo la cadena `'YYYY-MM-DD'` en año, mes y día**
  (`new Date(year, month - 1, day)`) y formatearla con
  `toLocaleDateString(locale, { weekday: style })`; AND THE SYSTEM SHALL **no**
  pasar nunca la cadena cruda a `new Date(...)`; AND WHEN el proceso corre en una
  zona horaria de offset negativo THE SYSTEM SHALL devolver la misma etiqueta que
  en UTC para la misma fecha de calendario.
  - Motivo medido, no estimado: bajo `TZ=America/Mexico_City`,
    `new Date('2026-09-06').toLocaleDateString('es-MX', {weekday:'short'})`
    devuelve `'sáb'` y lo correcto es `'dom'` — un día entero de desfase que en
    un runner en UTC **no se ve**.
  - Test: mismo `describe` que R3 →
    `it('no se desplaza un día en una zona horaria negativa')`: guarda
    `process.env.TZ`, lo fija a `'America/Mexico_City'`, llama a
    `weekdayLabel('2026-09-06', 'es-MX', 'short')`, espera `'dom'`, y lo
    restaura en un `finally`. Es el **único** candado que mata la mutación 2 de
    R20; si con esa mutación plantada la suite sigue verde, este `it` está mal
    escrito y hay que arreglarlo antes de seguir.

### R5 — "Sin dato" y "cero confirmado" son distintos, y el discriminante es `source`

- **R5**: WHEN una entrada tiene `source === 'missing'` THE SYSTEM SHALL pasar al
  `BarChart` el valor **`null`** para esa fila —de modo que la librería no dibuje
  rect alguno (§0.3)— y SHALL renderizar en su columna táctil el glifo `'—'` con
  `testID={`weekly-activity-missing-${day.date}`}` y clase
  `text-2xs font-normal text-muted`;
  AND WHEN una entrada tiene `source !== 'missing'` THE SYSTEM SHALL pasar el
  valor numérico de la métrica seleccionada, **incluido el `0`**, y SHALL
  renderizar en su columna táctil el valor formateado con
  `testID={`weekly-activity-value-${day.date}`}`;
  AND WHEN el valor de un día medido es `0` THE SYSTEM SHALL dibujar igualmente
  una barra visible, de altura **`BAR_MIN_HEIGHT = 3` px**, aplicando el mínimo
  dentro de `renderBar` (D4) — porque un rect de altura 0 es invisible y un
  descanso confirmado es información real;
  AND THE SYSTEM SHALL decidir esa rama **por `day.source`**, nunca por
  `día[metric] === null`;
  AND en una misma gráfica con un día `missing` y un día de cero THE SYSTEM SHALL
  dejar que los dos `testID` coexistan y sean distintos, de forma que ningún
  assert pueda confundirlos.
  - Test: `src/screens/home/weekly-activity-chart.test.tsx` ::
    `describe('R5: un día sin dato no es una barra de altura cero')`, con un `it`
    que monta `{ source: 'stored', <metric>: null }` —combinación que el backend
    no produce hoy pero que el tipo permite— y comprueba que se pinta **valor**,
    no guion: es lo que fija `source` como discriminante y lo que mata la
    mutación 3 de R20.

### R6 — Selector de métrica: tres métricas, cero peticiones nuevas

- **R6**: WHEN se renderiza la tarjeta THE SYSTEM SHALL ofrecer un selector con
  **exactamente las tres métricas que `weekComparison` cubre** (§0.2), en el
  orden de `WEEKLY_METRICS`: minutos activos, distancia y paseos; AND SHALL
  implementarlo con `SegmentedControl` de
  `@expo/ui/community/segmented-control` (carta §Decisiones fijas 5: capa
  `community`, nunca la raíz de `@expo/ui`), con
  `testID="weekly-activity-metric"`, `values` resueltos por catálogo (R17),
  `selectedIndex` del estado local y `onChange` leyendo
  `event.nativeEvent.selectedSegmentIndex` —**el índice, no la etiqueta**, para
  no depender del idioma—, y `tintColor` de
  `useThemeColors(['accent-strong'])`;
  AND WHEN el usuario cambia de métrica THE SYSTEM SHALL repintar barras, eje Y,
  línea de media, valores por columna y fila de tendencia **sin ninguna llamada
  nueva a la API**: las tres métricas viajan en el mismo payload que la Home ya
  descargó;
  AND la métrica inicial SHALL ser `'activeMinutes'`.
  - **Prohibido** pedir `useThemeColors(['accent'])`: el candado de #61 R4
    (`legibility-classnames.test.ts:145`) lo rechaza en cualquier fuente.
  - Test: `src/screens/home/weekly-activity-chart.test.tsx` ::
    `describe('R6: el selector cambia de métrica sin volver a pedir nada')`, y en
    `src/screens/home/index.test.tsx` un `it` que cambia de métrica y comprueba
    que `mockGetDailyActivity` **no** suma llamadas.

### R7 — Eje Y, rejilla y línea de media

- **R7**: WHEN se renderiza la gráfica THE SYSTEM SHALL pasar al `BarChart`
  `showYAxisLabels={true}` y `showHorizontalGridLines={true}`, con
  `yTickCount={4}`, `formatYLabel` propio y `theme.typography.axisLabelSize`
  igual a `CHART_AXIS_LABEL_SIZE = 10` (el mismo valor que el token
  `--text-2xs`);
  AND `formatYLabel` SHALL devolver **siempre exactamente `Y_LABEL_CHARS = 4`
  caracteres**, rellenando por la izquierda con espacios (`padStart`), porque el
  ancho del canalón izquierdo del gráfico se calcula a partir de la longitud de
  esas cadenas y de él depende la alineación de las columnas táctiles (D6);
  AND THE SYSTEM SHALL dibujar una **línea de media** horizontal, discontinua, en
  `useThemeColors(['muted'])`, con `testID="weekly-activity-average"`, situada en
  la media aritmética de los días **medidos** (los `missing` no promedian, igual
  que hace el backend en `samplesOfRange`);
  AND WHEN no hay ningún día medido con valor mayor que 0 THE SYSTEM SHALL
  **no** dibujar la línea de media, sin dejar hueco;
  AND la fila de la media SHALL ir acompañada de su valor formateado en la
  cabecera de la tarjeta, con `testID="weekly-activity-average-label"` y
  `style={TABULAR_NUMS}` de `src/theme/native-styles.ts` (#62 R15).
  - Test: `src/screens/home/weekly-activity-chart.test.tsx` ::
    `describe('R7: la gráfica dibuja eje Y, rejilla y línea de media')`, con un
    `it` que asserta que `formatYLabel` devuelve longitud 4 para `0`, `45`,
    `1440` y `12.3`, y un `it` que asserta que la media ignora los `missing`.

### R8 — Detalle por día al tocar, con tooltip, y navegación **solo** a rutas que existen

- **R8**: WHEN el usuario toca una columna o una barra THE SYSTEM SHALL marcar
  ese día como seleccionado y renderizar:
  (a) un **tooltip** propio, con `testID="weekly-activity-tooltip"`, anclado
  horizontalmente en la `x` que devuelve el evento de selección de la librería y
  recortado a los bordes de la tarjeta; y
  (b) un **panel de detalle**, con `testID="weekly-activity-detail"`, bajo la
  gráfica, con el día largo (`weekdayLabel(date, locale, 'long')`) y las cuatro
  métricas del día (`activeMinutes`, `distanceM`, `walkCount`, `restMinutes`),
  cada una con `style={TABULAR_NUMS}`;
  AND para un día `source === 'missing'` el panel SHALL mostrar
  `t('weeklyActivity.noDataForDay')` en lugar de las cuatro métricas;
  AND THE SYSTEM SHALL exponer la selección hacia la pantalla mediante la prop
  opcional `onSelectDay?: (day: DayEntry) => void`, **sin importar `expo-router`
  dentro del componente** (R2);
  AND la pantalla SHALL renderizar la acción de navegación
  (`testID="weekly-activity-day-map"`, texto `t('home.viewOnMap')`,
  `router.push('/map')`) **únicamente cuando el día seleccionado sea la última
  entrada del array —hoy—**, y **no** renderizarla para ningún otro día;
  AND THE SYSTEM SHALL **no** crear ninguna ruta nueva.
  - Motivo, no negociable y verificado: **la ruta `/trips` no existe** —el árbol
    de `src/app/` no la tiene ([[design]] §2 C2)—, y `/map` es la única pantalla
    que enseña recorridos, pero `getDayRoute` (`src/api/trips.ts:24-39`) pide
    `GET /pets/:petId/trips` **sin parámetro de día**: solo sabe enseñar el día
    en curso. Ofrecer "ver los paseos" para un martes de la semana pasada
    llevaría a los paseos de hoy, que es una mentira. Se aplica el criterio que
    el repo ya fijó en #71: *un destino que no existe no se dibuja*.
  - Test: `src/screens/home/weekly-activity-chart.test.tsx` ::
    `describe('R8: tocar un día abre su detalle')` (tooltip, panel, día
    `missing`) y `src/screens/home/index.test.tsx` ::
    `it('ofrece el mapa solo para el día de hoy')`.

### R9 — Cada columna se anuncia por separado; el gráfico no habla inglés

- **R9**: WHEN se renderiza una columna THE SYSTEM SHALL declarar en ella
  `accessible`, `accessibilityRole="button"` y un `accessibilityLabel` resuelto
  por catálogo —`t('weeklyActivity.dayLabel<Metric>', { day, value })` para un
  día medido y `t('weeklyActivity.dayLabelMissing', { day })` para un día
  `missing`, con `day = weekdayLabel(date, locale, 'long')`—, de modo que el
  lector de pantalla anuncie **siete elementos y no uno**;
  AND cada columna SHALL tener un área táctil de **al menos 44 pt** de alto
  (#61 R10);
  AND THE SYSTEM SHALL pasar al `BarChart` un `accessibilityLabel` **propio y
  traducido**, `t('weeklyActivity.chartSummary', { metric })`;
  AND THE SYSTEM SHALL **no** usar `getBarChartAccessibilitySummary`, porque
  devuelve **una sola cadena en inglés fijo** —`"Bar chart with 7 bars. Highest
  value is …"`, `dist/v2/react-native/charts/bar/accessibility.js`— y la carta
  §Dirección de arte 6 prohíbe texto de UI fuera del catálogo;
  AND THE SYSTEM SHALL **no** declarar `accessibilityLabel` en el contenedor de
  las siete columnas.
  - Hecho de la librería que obliga a esto, verificado en el tarball: el
    `BarChart` renderiza su raíz como
    `<View accessible accessibilityRole="image" accessibilityLabel={…}>`
    (`dist/v2/react-native/charts/bar/BarChart.js:182`). Un `accessible` en el
    contenedor **colapsa a un solo nodo** todo lo que hay debajo, así que
    **ningún hijo del gráfico puede anunciarse por separado**: las siete
    columnas tienen que vivir fuera del gráfico. Eso es lo que resuelve D5.
  - Test: `src/screens/home/weekly-activity-chart.test.tsx` ::
    `describe('R9: cada columna se anuncia por separado')`

### R10 — Las barras animan al entrar y respetan `prefers-reduced-motion`

- **R10**: WHEN la gráfica monta o cambia de métrica THE SYSTEM SHALL animar cada
  barra creciendo desde la línea base hasta su altura final, con
  `BAR_ENTRY_DURATION_MS = 250` y un escalonado de
  `BAR_ENTRY_STAGGER_MS = 40` por `dataIndex`, implementado con
  **Reanimated sobre el `<Rect>` que devuelve `renderBar`**
  (`Animated.createAnimatedComponent(Rect)` + `useAnimatedProps`), en el UI
  thread;
  AND WHEN `useReducedMotion()` de `react-native-reanimated` devuelve `true` THE
  SYSTEM SHALL renderizar las barras **directamente en su geometría final**, sin
  animación, sin retardo y sin transición de opacidad;
  AND THE SYSTEM SHALL **no** pasar variables CSS ni `PlatformColor` a estilos de
  Reanimated (carta §Animación): el color se resuelve antes con
  `useThemeColors`.
  - Precedente en el repo: `src/theme/theme-transition.ts:46` ya usa
    `useReducedMotion()`; `src/components/floating-tab-bar.tsx:60` usa
    `ReduceMotion.System`. Ninguno de los dos se toca.
  - Test: `src/screens/home/weekly-activity-chart.test.tsx` ::
    `describe('R10: las barras entran animadas y respetan reduced motion')`, con
    dos `it`: con `useReducedMotion()` mockeado a `true` la barra sale con su
    altura final desde el primer render; con `false`, `withDelay` recibe
    `index * BAR_ENTRY_STAGGER_MS` y `withTiming` la duración configurada.

### R11 — Ancho y alto en píxeles: `onLayout`, nunca `100%`

- **R11**: WHEN se renderiza la gráfica THE SYSTEM SHALL medir el ancho
  disponible con `onLayout` sobre el envoltorio y pasar al `BarChart`
  `width={anchoMedido}` y `height={CHART_PAD_TOP + CHART_PLOT_HEIGHT + CHART_PAD_BOTTOM}`
  como **números**, porque `BarChartProps.width` y `.height` son `number`
  obligatorios (`dist/v2/react-native/charts/bar/types.d.ts`) y la librería no
  acepta `'100%'`;
  AND WHILE el ancho medido sea `0` o `undefined` THE SYSTEM SHALL renderizar el
  envoltorio con su altura final reservada y **no** montar el `BarChart`, para
  que la tarjeta no salte de tamaño en el primer frame;
  AND THE SYSTEM SHALL volver a pasar el ancho nuevo cuando `onLayout` cambie
  (rotación, pantalla estrecha), sin remontar el componente.
  - Test: `src/screens/home/weekly-activity-chart.test.tsx` ::
    `describe('R11: la gráfica se dimensiona por onLayout, no por porcentaje')`

### R12 — La tendencia sigue a la métrica seleccionada y se calla sin base

- **R12**: WHEN `weekComparison[métrica seleccionada]` es un número THE SYSTEM
  SHALL renderizar una fila con `testID="weekly-activity-trend"`, con el icono
  `TrendUp` de `reicon-react-native` si el valor es `> 0` y `TrendDown` si es
  `< 0` —icono real, nunca un glifo tipográfico (#62 R7)—, el color del icono de
  `useThemeColors(['muted'])`, y el texto `t('weeklyActivity.trend', { percent })`
  con `percent` formateado por
  `new Intl.NumberFormat(locale, { signDisplay: 'exceptZero', maximumFractionDigits: 1 })`;
  AND ese `Text` SHALL declarar `style={TABULAR_NUMS}` (#62 R15);
  AND WHEN el valor es exactamente `0` THE SYSTEM SHALL pintar la fila **sin
  icono**; AND WHEN es `null` THE SYSTEM SHALL **no** renderizar la fila en
  absoluto, sin hueco ni texto de relleno;
  AND THE SYSTEM SHALL **no** colorear la tendencia con `success` ni con
  `danger` ([[design]] §3 D9).
  - Test: `src/screens/home/weekly-activity-chart.test.tsx` ::
    `describe('R12: la tendencia sigue a la métrica y se calla sin base')`

### R13 — La semana entera sin datos es un mensaje, no siete guiones

- **R13**: WHEN **todas** las entradas de `days` tienen `source === 'missing'`, o
  `days` está vacío, THE SYSTEM SHALL renderizar en lugar de la gráfica y de las
  columnas un único `Text` con `testID="weekly-activity-empty"` y el texto
  `t('weeklyActivity.noDataYet')`, conservando la cabecera de la tarjeta y
  **ocultando el selector de métrica**; AND WHEN al menos una entrada está medida
  THE SYSTEM SHALL renderizar la gráfica y las siete columnas —las medidas y las
  `missing`— y **no** el mensaje.
  - Test: `src/screens/home/weekly-activity-chart.test.tsx` ::
    `describe('R13: la semana entera sin dato se resuelve con un mensaje')`

### R14 — La Home la monta en su sitio y **sin una sola petición nueva**

- **R14**: WHEN la Home resuelve `activity.data?.kind === 'ok'` THE SYSTEM SHALL
  renderizar `<WeeklyActivityChart days={activity.data.days}
  weekComparison={activity.data.weekComparison} onSelectDay={…} />` dentro de una
  `Card` compartida con `testID="weekly-activity-card"`, colocada dentro del
  envoltorio `testID="home-content"` **inmediatamente después de `summary-card` y
  antes de `last-position-card`**; AND SHALL alimentarla con el mismo
  `useApi(activityFn)` que ya existe, sin añadir ninguna llamada a la API, sin
  parámetros nuevos en `getDailyActivity` y sin tocar `activityFn`; AND THE
  SYSTEM SHALL **no** modificar `summary-card`, ni `collar-card`, ni
  `last-position-card`, ni el hero, ni la derivación de `today`, que sigue
  alimentando al hero y a las tres celdas del resumen.
  - Test: `src/screens/home/index.test.tsx` ::
    `describe('R14: la Home monta la actividad semanal sin pedir nada nuevo')`,
    con tres `it`: que la tarjeta aparece con los siete días del mock; que
    `mockGetDailyActivity` se llama el mismo número de veces que en el escenario
    equivalente sin gráfica; y que el orden de los hijos de `home-content` es
    `summary-card` → `weekly-activity-card` → `last-position-card`.

- **R14b**: WHILE `activity.data === undefined` THE SYSTEM SHALL renderizar en
  ese hueco un `Skeleton` de heroui con `testID="weekly-activity-skeleton"`,
  clase `w-full rounded-card` y la altura del contenido final declarada por
  `style` (carta §Decisiones fijas 7 y §12); AND WHEN `activity.data` resuelve a
  `no-tracking`, `error`, `unreachable` o `missing-config` THE SYSTEM SHALL
  **no** renderizar ni la tarjeta ni el skeleton, porque `summary-card` ya
  muestra esos mensajes y duplicarlos es ruido.
  - Test: mismo `describe` que R14 →
    `it('carga con skeleton y se calla cuando la actividad falla')`

### R15 — La Home se migra a `src/screens/home/` con route delgado

- **R15**: WHEN esta feature toque la Home THE SYSTEM SHALL migrarla al patrón de
  #39 (`docs/conventions.md` §Convenciones de la app móvil → *Estructura Expo
  oficial*), moviendo el cuerpo a
  `mobile-pet-tracker/src/screens/home/index.tsx` con la firma
  `export function HomeScreen()` —**named export**, como
  `src/screens/pairing/index.tsx`— y dejando
  `mobile-pet-tracker/src/app/(tabs)/home.tsx` como route delgado de **menos de
  10 líneas**, exactamente en la forma de `src/app/(tabs)/pairing.tsx`:

  ```tsx
  import { HomeScreen } from '../../screens/home';

  export default function HomeRoute() {
    return <HomeScreen />;
  }
  ```

  AND THE SYSTEM SHALL mover el test de pantalla de
  `src/app/(tabs)/__tests__/home.test.tsx` a
  `src/screens/home/index.test.tsx` (colocado junto al cuerpo, como exige la
  convención), reajustando **solo** las rutas relativas de sus `import` y sus
  `jest.mock`, **sin debilitar ni borrar ningún assert existente**;
  AND SHALL mover los tres formateadores privados de `home.tsx` —`fmtMinutes`,
  `fmtKm`, `fmtCount`— a `mobile-pet-tracker/src/screens/home/format.ts`,
  exportados, porque la gráfica los necesita y duplicarlos sería drift;
  AND SHALL añadir `app/(tabs)/home.tsx` a la lista de entrypoints delgados de
  `src/__tests__/design-drift.test.ts` (hoy son tres, R19);
  AND THE SYSTEM SHALL **no** migrar ninguna otra pantalla anterior a #39: la
  convención dice "solo cuando una feature las toque de fondo", y #68 solo toca
  ésta.
  - Test: `src/__tests__/design-drift.test.ts` (entrypoint delgado) +
    `src/screens/home/index.test.tsx` completo en verde tras el movimiento.

### R16 — El enum crudo de la API se traduce por catálogo, y solo ese

- **R16**: WHEN la pantalla de emparejado pinta la conectividad del collar THE
  SYSTEM SHALL resolverla por catálogo y **nunca** en bruto, sustituyendo
  `src/screens/pairing/index.tsx:422`
  (`value={selectedPet.device.connectivity ?? '—'}`) por el valor traducido; AND
  SHALL centralizar el reparto en un módulo nuevo
  `mobile-pet-tracker/src/utils/device-connectivity.ts` con la forma exacta

  ```ts
  import type { TranslationKey } from '../i18n/catalog';

  export const DEVICE_CONNECTIVITY_META: Record<
    string,
    { labelKey: TranslationKey }
  > = {
    online: { labelKey: 'deviceConnectivity.online' },
  };

  export function connectivityLabelKey(
    value: string | null,
  ): TranslationKey | null;
  ```

  donde `connectivityLabelKey` devuelve `null` para `null` —la pantalla sigue
  pintando `'—'`, que no es copy— y
  `'deviceConnectivity.unknown'` para **cualquier valor no listado**;
  AND THE SYSTEM SHALL actualizar `src/screens/pairing/index.test.tsx:511` para
  esperar la etiqueta traducida en lugar de `'LTE'`, conservando el `it` de
  `null → '—'` de `:531,:543` **intacto**;
  AND THE SYSTEM SHALL **no** tocar ningún otro enum crudo —`pet.sex`,
  `document.type`, `foodType`, `activityLevel`— ni la condición
  `connectivity === 'online'` de la Home (`home.tsx:208,220`), que es lógica de
  la píldora de estado y territorio de **#73**.
  - **Por qué el único valor conocido es `'online'`**: `connectivity` está tipado
    como `string | null` (`src/api/types.ts:47`) y el backend solo escribe
    `'online'` (`workers/ingestion.drizzle.store.ts:97`). El `'LTE'` de la
    fixture del test es jerga del proveedor inventada en el fixture, y la carta
    §Dirección de arte 4 la prohíbe: se traduce a "desconocida", no se enseña.
  - **Enmienda a spec aprobada**: esto contradice el tercer corolario de la carta
    §Dirección de arte 6 y se firma como enmienda en §Enmiendas de este mismo
    documento.
  - Test: `src/utils/device-connectivity.test.ts` ::
    `describe('R16: la conectividad se traduce por catálogo')` (los tres casos:
    conocido, desconocido, `null`) + el `it` actualizado de
    `src/screens/pairing/index.test.tsx`.

### R17 — Copy en los dos idiomas, resuelta por clave y registrada

- **R17**: WHEN esta feature introduce copy THE SYSTEM SHALL añadir a
  `mobile-pet-tracker/src/i18n/catalog.ts` las **dieciséis** claves nuevas —catorce de `weeklyActivity.*` y dos de `deviceConnectivity.*`—, en
  **`en` y en `es`**, con estos valores exactos:

  | Clave | `es` | `en` |
  |---|---|---|
  | `weeklyActivity.title` | `Actividad semanal` | `Weekly activity` |
  | `weeklyActivity.lastSevenDays` | `últimos 7 días` | `last 7 days` |
  | `weeklyActivity.noDataYet` | `Aún no hay actividad registrada` | `No activity recorded yet` |
  | `weeklyActivity.noDataForDay` | `Sin datos de este día` | `No data for this day` |
  | `weeklyActivity.metricActiveMinutes` | `Minutos activos` | `Active minutes` |
  | `weeklyActivity.metricDistance` | `Distancia recorrida` | `Distance` |
  | `weeklyActivity.metricWalks` | `Paseos` | `Walks` |
  | `weeklyActivity.dayLabelActiveMinutes` | `{{day}}: {{value}} minutos activos` | `{{day}}: {{value}} active minutes` |
  | `weeklyActivity.dayLabelDistance` | `{{day}}: {{value}} de recorrido` | `{{day}}: {{value}} travelled` |
  | `weeklyActivity.dayLabelWalks` | `{{day}}: {{value}} paseos` | `{{day}}: {{value}} walks` |
  | `weeklyActivity.dayLabelMissing` | `{{day}}: sin datos` | `{{day}}: no data` |
  | `weeklyActivity.chartSummary` | `Gráfica de {{metric}} de los últimos 7 días` | `Chart of {{metric}} over the last 7 days` |
  | `weeklyActivity.average` | `Media {{value}}` | `Average {{value}}` |
  | `weeklyActivity.trend` | `{{percent}} % frente a la semana previa` | `{{percent}}% vs. previous week` |
  | `deviceConnectivity.online` | `En línea` | `Online` |
  | `deviceConnectivity.unknown` | `Desconocida` | `Unknown` |

  AND THE SYSTEM SHALL resolverlas **dentro** de los componentes con
  `useTranslate()`, sin dejar ningún literal de copy en el fuente; AND SHALL
  añadir las filas correspondientes a `src/__tests__/ui-copy-table.ts` —las de
  `weeklyActivity.*` al bloque `R3_HOME`, las de `deviceConnectivity.*` al bloque
  `R10_PAIRING`, con `file: 'src/utils/device-connectivity.ts'` y la forma
  `labelKey:` que `checkUses` ya acepta (precedente literal:
  `src/utils/reminder-meta.ts` en `ui-copy-table.ts:225-231`)—; AND SHALL
  registrar las dieciséis en la tabla de `specs/mobile-ui-language/design.md` §2,
  como exige la carta §Dirección de arte 6.
  - Notas: `'—'` **no** es copy —es el mismo símbolo que ya usan `home.tsx` y
    `pet-hero-header.tsx` para "sin dato"— y no entra al catálogo. La acción de
    R8 **reutiliza `home.viewOnMap`**, que ya existe: no se crea clave nueva.
  - Test: `src/__tests__/ui-language.test.ts` (candados preexistentes: una clave
    presente en un idioma y ausente en el otro no compila, y
    `checkUses(ALL_USES)` exige una fila por llamada) + los deltas de R19.

### R18 — Los colores del gráfico salen de tokens: cero hex, grep-clean intacto

- **R18**: WHEN se configuran los colores del `BarChart` THE SYSTEM SHALL
  pasarlos por su prop `theme` como **cadenas ya resueltas por
  `useThemeColors`**, con este reparto exacto:

  | Campo de `CartesianChartTheme` | Token |
  |---|---|
  | `series` | `['accent-strong']` |
  | `grid` | `border` |
  | `axis` | `border` |
  | `text` | `foreground` |
  | `mutedText` | `muted` |
  | `background` / `plotBackground` | `surface` |

  AND SHALL fijar `typography: { axisLabelSize: CHART_AXIS_LABEL_SIZE }`;
  AND THE SYSTEM SHALL **no** escribir ningún literal hexadecimal, ninguna clase
  arbitraria `[...]`, ningún `StyleSheet.create` y ninguna clase de radio fuera
  de la escala de #62 R4 en ningún fichero nuevo o tocado;
  AND THE SYSTEM SHALL **no** usar `preset` ni los presets de fábrica de la
  librería, que traen su propia paleta hexadecimal.
  - Aclaración necesaria porque el encargo dice lo contrario: **la v2 no tiene
    `chartConfig`**. `BarChartProps` no declara ese campo y no hay ninguna
    función `(opacity) => string`; todos los colores son `string` planos
    ([[design]] §2 C1). El choque con el grep-clean que el encargo temía **no
    existe en la v2**, y no hace falta ninguna excepción al candado.
  - Test: `src/__tests__/design-drift.test.ts` ::
    `describe('#68 R18: la actividad semanal no mete drift de estilo')`, con la
    lista de ficheros nuevos y tocados de esta feature y el mismo patrón que ya
    usa el bloque `R9` (`/text-\[10px\]|#[\da-f]{3,8}\b|StyleSheet/i`).

### R19 — Los candados se mueven por delta declarado, nunca por cifra a mano

- **R19**: WHEN los candados de recuento se actualicen THE SYSTEM SHALL
  registrar **deltas contra `4a5f6dd`**, no números nuevos escritos a mano. Dos
  clases de movimiento, y hay que distinguirlas:

  **(a) Reubicación por la migración de R15 — la ruta cambia, la cifra no.** En
  cada uno de estos candados, la fila cuyo `path` es
  `join('app', '(tabs)', 'home.tsx')` pasa a
  `join('screens', 'home', 'index.tsx')`, **con el mismo número**, y los totales
  cerrados **no se mueven por esta causa**:

  | Candado | Fichero | Fila que se reubica |
  |---|---|---|
  | `#62 R14` esquinas continuas | `consistency-classnames.test.ts:269-284` | `home.tsx`, 1 |
  | `#62 R15` cifras tabulares | `consistency-classnames.test.ts:333-340` | `home.tsx`, 4 |
  | `#61 R4` acento como tinta | `legibility-classnames.test.ts:118-129` | `home.tsx`, 1 |
  | tabla de copy `R3_HOME` | `ui-copy-table.ts:45…` | todas las filas con `file: 'src/app/(tabs)/home.tsx'` → `'src/screens/home/index.tsx'` |

  **(b) Deltas de verdad, que el implementer mide con `grep` y el reviewer
  rehace**:

  | Candado | Fichero del candado | Delta | Motivo |
  |---|---|---|---|
  | filas de `R3_HOME` y su `toHaveLength` | `ui-language.test.ts:82`, `ui-copy-table.ts` | **+una fila por cada llamada a `t()`** que introduzca `weekly-activity-chart.tsx`, medida con `grep`; **como mínimo 14**, una por cada clave `weeklyActivity.*` de R17 | `checkUses` cuenta ocurrencias, no claves: una clave usada dos veces son dos filas |
  | filas de `R10_PAIRING` y su `toHaveLength` | `ui-language.test.ts:130`, `ui-copy-table.ts` | **+2** | `deviceConnectivity.online` y `.unknown`, una fila `labelKey:` cada una en `device-connectivity.ts` |
  | `SCREEN_FILES` y su `toHaveLength` | `ui-language.test.ts:355` | **+2** | `weekly-activity-chart.tsx` y `device-connectivity.ts` entran en `ALL_USES`; `home.tsx` **no suma**, solo cambia de ruta |
  | `ALL_USES` vs. suma de los once bloques | `ui-copy-table.ts:385-394` | **cuadra solo** | el candado ya es consistencia interna |
  | `#62 R15` cifras tabulares | `consistency-classnames.test.ts:333-355` | **+1 fila** para `screens/home/weekly-activity-chart.tsx`, con el número que devuelva el grep, **y el total cerrado sube exactamente esa cantidad** | media, tendencia y las cuatro métricas del detalle son cifras que se recomparan |
  | `#62 R14` esquinas continuas | `consistency-classnames.test.ts:269-331` | **+1 fila** para `screens/home/weekly-activity-chart.tsx`, con el número que devuelva el grep, **y el total cerrado sube exactamente esa cantidad** | el panel de detalle y el tooltip son superficies `rounded-xl` que el repo dibuja por su cuenta |
  | `#61 R4` acento como tinta | `legibility-classnames.test.ts:117-138` | **sin cambio** | el acento entra como color imperativo del `theme` del gráfico, no como clase `text-accent-strong` |
  | entrypoints delgados | `design-drift.test.ts:112-133` | **+1** (`app/(tabs)/home.tsx`) | R15 |
  | dependencias declaradas | `design-drift.test.ts:135-145` | **+1 assert** (`react-native-chart-kit === '7.0.4'`) | R1 |

  El implementer sustituye cada número por el que devuelva el propio `grep`; el
  reviewer comprueba el **delta**, no el valor. Si un total cerrado se mueve por
  una causa que esta tabla no prevé, **para y repórtalo**: no lo absorbas
  subiendo el número.

### R20 — Verificación: suite verde, grep-clean y prueba de mutación

- **R20**: WHEN el reviewer valida la feature THE SYSTEM SHALL presentar la suite
  móvil completa en verde —`bun run test` desde `mobile-pet-tracker/`— sin
  debilitar ni eliminar ningún assert de conducta y sin renombrar ningún `testID`
  existente; AND SHALL mantener el grep-clean de la carta §Decisiones fijas 3
  intacto: **cero** hex fuera de `src/theme/`, **cero** clases arbitrarias
  `[...]`, **cero** `StyleSheet.create`, **cero** shadow/elevation legacy y
  **cero** clases de radio fuera de la escala de #62 R4.

- **R20b**: WHEN el implementer cierre la feature THE SYSTEM SHALL demostrar, con
  las **cinco** mutaciones plantadas de una en una y la evidencia en
  `progress/impl_mobile-home-weekly-activity.md` §prueba de mutación, que la
  suite se pone **roja** con cada una:
  1. la etiqueta del eje pasa a salir del índice en vez de la fecha (mata R3);
  2. `new Date(year, month - 1, day)` pasa a `new Date(date)` — **la mutación de
     zona ciega**: verde en un runner en UTC, roja **solo** por el `it` de TZ de
     R4;
  3. la rama `missing` pasa a decidirse por `valor === null` en vez de por
     `day.source` (mata R5, y **solo** el `it` de `source:'stored'` con métrica
     `null`);
  4. desaparece el `accessibilityLabel` de la columna `missing` (mata R9);
  5. el import pasa de `react-native-chart-kit/v2` a `react-native-chart-kit`
     (mata R1).
  - La 2 y la 3 son las importantes: las dos pasan la suite entera si su candado
    está mal escrito, y las dos son la lección de
    `prueba-de-mutacion-en-zona-ciega` aplicada por adelantado.
  - Test: requisito de verificación (C4 vía (b)); la evidencia es el informe.

---

## Enmiendas a specs aprobadas

Esta feature **sí** necesita una enmienda, y se firma en el mismo gate que la
spec (mismo procedimiento que las enmiendas A8/A9 de #67).

### E1 — `docs/ui-guidelines.md` §Dirección de arte 6, tercer corolario

- **Spec enmendada**: `docs/ui-guidelines.md`, §Dirección de arte, punto 6,
  tercer corolario (`:281-285`).
- **Qué dice hoy**: *"Los valores de enum que la API devuelve se pintan crudos:
  `pet.sex`, `device.connectivity`, `document.type`, `foodType`,
  `activityLevel`. Siguen en inglés en los dos idiomas, y `connectivity` además
  enseña jerga del proveedor, contra el punto 4 de esta misma sección. Mapearlos
  es cambio de conducta y va a feature propia."*
- **Qué pasa a decir**: lo mismo, **menos `device.connectivity`**, que deja de
  pintarse crudo y se resuelve por catálogo en
  `src/utils/device-connectivity.ts` (feature #68, R16). Los otros cuatro enum
  siguen crudos y siguen esperando feature propia.
- **Qué NO cambia**: ningún otro punto de la carta, ni su estado de aprobación,
  ni los tests que la cubren. En particular, la condición
  `connectivity === 'online'` de la Home no es "pintar el enum": es lógica de
  estado, y sigue donde está hasta que **#73** la revise.
- [X] Enmienda aprobada por humano

---

### D1 — el botón de mapa de R8 quedó en `variant="secondary"`

**No es una enmienda a otra spec: es una desviación del diseño aprobado de
ESTA, descubierta durante la implementación.** La firma va aquí porque el
reviewer la marcó como decisión visual sin firmar (observación 3 de
`progress/review_mobile-home-weekly-activity.md`).

- **Qué decía el diseño**: el botón que abre el mapa desde el detalle del día
  se pintaba como acción acentuada, `className="rounded-xl bg-accent"` con
  `text-accent-foreground`.
- **Qué pasó**: eso habría subido de doce a trece el inventario de botones
  primarios que **#62 R1 dejó cerrado**
  (`src/__tests__/consistency-classnames.test.ts:102`), un total que la tabla
  de R19 no autoriza. R19 manda literalmente *"para y repórtalo: no lo
  absorbas subiendo el número"*. Codex no subió el número —bien— pero tampoco
  paró: degradó el botón a `variant="secondary"` con `text-foreground`, y
  después le añadió `bg-default` siguiendo el precedente de Profile.
- **Qué NO cambia en ninguna de las dos opciones**: el `testID`, el copy y el
  `router.push('/map')` de R8 siguen intactos, y el botón solo aparece para el
  día de hoy. El área táctil sigue en `min-h-11`.

Marca **una sola** de las dos:

- [ ] **(a) Se queda en `secondary` con `bg-default`.** El inventario de #62
      sigue cerrado en doce y no se toca ninguna spec más. Es lo que está
      implementado hoy, así que aprobar esto no cuesta un solo commit de código.
- [ ] **(b) Vuelve a acción acentuada** (`bg-accent` + `text-accent-foreground`).
      Entonces el inventario de #62 R1 pasa a trece y **hace falta una enmienda
      firmada a `specs/mobile-figma-polish/`** además de esta casilla, porque
      ese total es un candado aprobado. Añade trabajo: un commit de código, otro
      de candado y una firma más.

## Fuera de alcance

Todo lo de esta lista queda **explícitamente fuera** y ninguna decisión de aquí
lo habilita de paso.

- **La tira de 4 celdas sobre el hero** (`design-src/App.tsx:366-384`,
  Peso/Activo/Paseos/Distancia). Es la feature **#69**. #68 no toca
  `summary-card` y deja su hueco abierto: la gráfica se ancla *después* de
  `summary-card`, así que cuando #69 lo sustituya o lo suba bajo el hero, la
  gráfica conserva su posición relativa sin reescribirse.
- **Los accesos rápidos** (`design-src/App.tsx:396-412`). Feature **#71**, que
  además depende de los tokens de #64.
- **La píldora "En línea"**, el pestillo de conectividad roto y el umbral de
  silencio. Es la feature **#73**, creada el 2026-09-07, y es la única de esta
  lista que no se resuelve solo en móvil. #68 traduce la **etiqueta** del enum en
  la pantalla de emparejado (R16) y **no toca** la lógica de estado que #73
  tendrá que arreglar.
- **Cualquier llamada nueva a la API.** Es el criterio de aceptación 1 del
  enunciado y R14 lo fija. Si durante la implementación aparece un dato que
  obliga a una petición nueva —por ejemplo, los paseos de un día pasado para el
  detalle de R8—, **la feature se para** y se reporta: no se añade.
- **Backend.** Cero. Ni un fichero de `backend-pet-tracker/`.
- **Una ruta `/trips` nueva**, o un parámetro de día en `/map`, o un `from`/`to`
  en `getDayRoute`. Los tres son llamada nueva o ruta nueva (R8).
- **Los otros cuatro enum crudos** (`pet.sex`, `document.type`, `foodType`,
  `activityLevel`): la enmienda E1 es deliberadamente estrecha.
- **Migrar cualquier otra pantalla anterior a #39.** R15 migra la Home y nada
  más.
- **Adoptar la capa root/universal de `@expo/ui`.** Carta §Decisiones fijas 5: el
  selector usa `@expo/ui/community/segmented-control`, y cambiar de capa es una
  feature separada.
- **Cambiar la escala de radios, la paleta o los tokens.** #68 no añade ningún
  token a `global.css`: los que necesita ya existen.
- **`restMinutes` como métrica del selector.** No tiene `weekComparison`
  (§0.2), así que su pestaña quedaría sin tendencia. Sigue mostrándose donde ya
  se mostraba —la celda "Sueño" de `summary-card`— y aparece en el panel de
  detalle de R8, así que no se pierde ningún dato (carta §Dirección de arte 5).

---

## Aprobación

- [X] Aprobado por humano (fecha: 2026-09-07) ← gate obligatorio antes de implementar

> La firma de `a1fa09e` **no vale para esta spec**: cubría un alcance estrecho
> que esta reescritura sustituye. Hace falta una firma nueva.

Al aprobar, el humano ratifica además:

1. Las **cuatro correcciones** de [[design]] §2: que la v2 de chart-kit **no
   tiene `chartConfig`** y sus colores son cadenas planas; que **`/trips` no
   existe** y por eso la navegación solo se ofrece para hoy y hacia `/map`; que
   `getBarChartAccessibilitySummary` **habla inglés fijo** y por eso no se usa; y
   que `emptyActivity()` va de `pipeline/activity.ts:83` a `:93`.
2. La **enmienda E1** a `docs/ui-guidelines.md`, que saca `device.connectivity`
   de la lista de enum que se pintan crudos.
3. Que las tres métricas del selector son **exactamente** las tres que
   `weekComparison` cubre, y que `restMinutes` se queda fuera del selector por
   esa razón técnica.
4. Que el **acoplamiento a constantes internas** de `react-native-chart-kit@7.0.4`
   ([[design]] §3 D6) es aceptable a cambio de la versión pinneada y del candado
   de R1b, y que una subida de versión obliga a re-derivarlas.
5. Que la gráfica responde **una** de las siete preguntas de la Home
   (carta §Dirección de arte 3): *¿cómo fue su actividad?*, ensanchándola de hoy
   a la semana. Las otras seis siguen exactamente como las dejó #67.
6. La **desviación declarada respecto al Make** en dos puntos, ambos por decisión
   ya cerrada del repo y no re-litigable aquí:
   - la letra del eje es `mié` (formato `short` del locale) y no la `X` del Make,
     porque `narrow` es ambiguo en los dos idiomas y la `X` solo existe en
     español;
   - las barras son cápsulas y no el radio `[5,5,0,0]` del Make, porque #62 fijó
     tres radios y un cuarto es drift.

**Gate humano de verificación, no delegable a IA**: smoke en **dev build de
Android** (nunca Expo Go), en tema **claro** y **oscuro**, con una mascota que
tenga **al menos un día sin dato** y **al menos un día de cero minutos**. Se
comprueba: que el día sin dato y el día de cero se distinguen a simple vista; que
las letras del eje corresponden a los días reales y el último es hoy; que las
siete columnas quedan alineadas con sus barras; que el selector cambia de métrica
sin parpadeo de carga; que el tooltip y el detalle salen al tocar y que el enlace
al mapa solo aparece en hoy; que las barras animan al entrar y **no** animan con
"reducir movimiento" activado en el sistema; que la gráfica no desborda
horizontalmente en pantalla estrecha; que en emparejado la conexión ya no dice
`LTE`; y que TalkBack anuncia las siete columnas por separado, cada una con su
día y su valor.

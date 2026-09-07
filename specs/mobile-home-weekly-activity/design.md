---
feature: "mobile-home-weekly-activity"
status: spec_ready     # draft | spec_ready | approved
tags: [harness, spec]
---

# Diseño — [[mobile-home-weekly-activity]]

> Decisiones técnicas de alto nivel. Los requisitos verificables viven en
> [[requirements]]; el orden de trabajo, en [[tasks]].
>
> **Todo lo de §1 se ha comprobado contra el árbol en `4a5f6dd`** y contra el
> **tarball** de `react-native-chart-kit@7.0.4` (`npm pack`, `.d.ts` y `.js`
> leídos), no contra documentación ni contra `progress/`. Un informe de
> exploración es una hipótesis fechada: el del 2026-09-04 metió cuatro premisas
> falsas en #67 y cada una se propagó a tres sitios. Aquí han vuelto a salir
> cuatro falsas (§2), tres de ellas en el encargo mismo.

---

## 1. Premisas verificadas

### P1 — Una entrada por día sin huecos, 7 días por defecto en la tz del dueño — **CIERTA**

`backend-pet-tracker/src/modules/activity/application/use-cases/get-daily-activity.use-case.ts:84-98`
recorre `listDays(fromDay, toDay)` y empuja una entrada por cada día del rango:
la fila almacenada si existe, el cómputo al vuelo si el día es hoy, y
`missingEntry(day)` (`:97`) en cualquier otro caso. No hay rama que salte un día.
El rango por defecto sale de `ACTIVITY_DEFAULT_RANGE_DAYS = 7` y la zona horaria
es la del **dueño**, no la del dispositivo ni la del servidor.

### P2 — El cliente llama sin parámetros — **CIERTA**

`mobile-pet-tracker/src/api/activity.ts:26-31`:
`getJson(baseUrl, `/pets/${petId}/activity/daily`, token, fetchFn)`. Sin query
string, sin `from`, sin `to`.

### P3 — La Home descarta seis de siete — **CIERTA**

`mobile-pet-tracker/src/app/(tabs)/home.tsx:100-103`:

```
100  const today =
101    activity.data?.kind === 'ok'
102      ? activity.data.days[activity.data.days.length - 1]
103      : undefined;
```

Ese `today` tiene hoy **tres** consumidores: el hero (`:133-137`, el `highlight`
con `fmtCount(today.walkCount)` que fijó #67 R7) y las tres celdas de
`summary-card` (`:311`, `:324`, `:337`). **No se toca.** La gráfica consume
`activity.data.days` entero en paralelo.

### P4 — El discriminante es `source`, y `null` coincide con `missing` **por casualidad** — **CIERTA**

- `get-daily-activity.use-case.ts:194-207` — `missingEntry(day)` construye la
  entrada con las **nueve** métricas a `null` y `source: 'missing'`.
- `get-daily-activity.use-case.ts:95-96` — el comentario que lo declara: *"un dia
  pasado sin fila es `missing` con metricas null, nunca ceros — un cero significa
  'reposo confirmado' y mentiria"*.
- **La implicación no es reversible**: `emptyActivity()`
  (`backend-pet-tracker/src/pipeline/activity.ts:83-93`) devuelve **ceros**
  cuando no hay posiciones, y `DailyActivityRow.activeMinutes` no es nula. Es
  decir: hoy `métrica === null` ⟺ `source === 'missing'`, y una implementación
  que ramifique por el `null` pasaría todos los tests siendo semánticamente
  falsa.

Por eso [[requirements]] R5 obliga a ramificar por `source` y R20b planta la
mutación 3 que lo comprueba.

### P5 — Cronológico terminando hoy, no lunes a domingo — **CIERTA**

`backend-pet-tracker/src/pipeline/local-day.ts` recorre `for (let day = fromDay;
day <= toDay; day = shiftDay(day, 1))`. Ascendente desde `fromDay`, y `toDay` es
hoy cuando el cliente no manda `to`. La semana **no** empieza en lunes: empieza
el día que toque seis días antes de hoy. De ahí R3 y R4.

### P6 — `weekComparison`: delta porcentual de la media diaria, tres métricas — **CIERTA**

`backend-pet-tracker/src/modules/activity/domain/week-comparison.ts`:

- `:12-16` — `WeekComparison` tiene **tres** campos: `distanceM`,
  `activeMinutes`, `walkCount`, todos `number | null`. **No hay `restMinutes`.**
- `:24-51` — `compareWeek` devuelve el **delta porcentual a un decimal de la
  media diaria** (`Math.round(ratio * 1000) / 10`), y `null` si alguna ventana no
  tiene muestras o la media base es 0 (`:39-46`).
- El cliente ya lo tipa (`mobile-pet-tracker/src/api/types.ts:92-96`) y
  `getDailyActivity` ya lo devuelve (`src/api/activity.ts:5`). La Home no lo lee
  en ningún sitio.

Esto es lo que fija el alcance del selector (D2): **tres métricas, ni una más.**

### P7 — `react-native-chart-kit@7.0.4`: dos APIs, y solo una modela el hueco — **CIERTA**

Verificado desempaquetando el tarball. `package.json` → `exports` expone
exactamente `.`, `./v2` y `./package.json`.

| | v1 (raíz) | v2 (`/v2`) |
|---|---|---|
| Forma de los datos | `Dataset.data: number[]` (`dist/shared/types.d.ts:3-5`) | `data: TData[]` + `xKey`/`yKey`, con `ChartYValue = number \| null` |
| Día sin dato | **imposible**: entraría como `0` | `null`, y `buildGroupedBars` no emite rect (`dist/v2/core/geometry/barRects.js:76-82`) |
| Colores | `(opacity) => string` y `ChartConfig.backgroundGradientFrom` | **cadenas planas** en `theme` y `series[].color` |
| Accesibilidad | — | `getBarChartDataTable` / `getBarChartAccessibilitySummary` |

`normalizeNumberValue` (`dist/v2/core/data/normalizeValues.js`) devuelve `null`
para `null` **sin warning**, y warnea `missing-value` para `undefined`: pasar
`null` es el camino declarado, pasar `undefined` es un accidente.

### P8 — El enum crudo, dónde se pinta y qué valores tiene — **CIERTA**

`src/screens/pairing/index.tsx:421-422` pinta `selectedPet.device.connectivity`
sin traducir; su test lo fija en `src/screens/pairing/index.test.tsx:511`
(fixture `'LTE'` en `:103`) y el caso `null → '—'` en `:531,:543`. El tipo es
`connectivity: string | null` (`src/api/types.ts:47`) —**no una unión cerrada**—
y el único valor que el backend escribe es `'online'`
(`backend-pet-tracker/src/workers/ingestion.drizzle.store.ts:97`, columna
`varchar(20)` nullable). La Home lo usa como **condición**, no lo pinta
(`home.tsx:208,220`).

### P9 — Los candados que esta feature mueve — **CIERTOS, y con una sorpresa**

- `consistency-classnames.test.ts:269-331` (#62 R14) y `:333-355` (#62 R15) y
  `legibility-classnames.test.ts:117-138` (#61 R4) son inventarios **por ruta de
  fichero**: migrar la Home (R15) los mueve aunque no cambie ni una cifra.
- `design-drift.test.ts:112-133` fija que los **tres** entrypoints de Expo Router
  migrados tienen menos de 10 líneas. `app/(tabs)/home.tsx` pasa a ser el cuarto.
- **La sorpresa**: no existe ningún candado global de "cero hex fuera de
  `src/theme/`". El único que persigue hexadecimales es
  `design-drift.test.ts:101`, y está acotado a la lista nominal de ocho ficheros
  de #40 (`R9`). El grep-clean de la carta se cumplía **por revisión**, no por
  test, en todo fichero nuevo. Por eso R18 añade su propio bloque en vez de
  confiar en un candado que no cubre lo que esta feature escribe.
- `legibility-classnames.test.ts:145` prohíbe **cualquier**
  `useThemeColors([… 'accent' …])` en fuentes de producción: el `tintColor` del
  selector y el color de la barra tienen que pedir `'accent-strong'`.
- `ui-language.test.ts:37-60` (`checkUses`) cuenta `t('clave')` **y**
  `labelKey: 'clave'`: la segunda forma es la que permite que un catálogo de
  enum viva en `src/utils/` (precedente literal: `src/utils/reminder-meta.ts`,
  registrado en `ui-copy-table.ts:225-231`).

---

## 2. Correcciones — premisas del encargo que salieron falsas

Ninguna corrección de aquí toca una spec aprobada; la única enmienda que sí la
toca es **E1** y vive en [[requirements]] §Enmiendas.

| # | Dice el encargo (o el enunciado) | Lo que hay en el árbol / en el paquete | Consecuencia |
|---|---|---|---|
| **C1** | *"Los colores de chart-kit entran por config (`Dataset.color?: (opacity) => string`, `ChartConfig.backgroundGradientFrom?: string`), y eso choca de frente con el grep-clean"* | Eso es la **v1**. `BarChartProps` de la **v2** no declara `chartConfig` en absoluto (`dist/v2/react-native/charts/bar/types.d.ts`); los colores son `string` planos en `theme` (`CartesianChartTheme`: `background`, `plotBackground`, `grid`, `axis`, `text`, `mutedText`, `series: string[]`, `tooltip`) y en `series[].color` | **El choque no existe.** Los valores de `useThemeColors` son cadenas ya resueltas y entran tal cual. Cero hex, cero excepciones al candado. La restricción se resuelve por construcción (D7) |
| **C2** | *"navegación a `/trips` por la ruta que ya existe (nada de ruta nueva)"* | **No existe ninguna ruta `/trips`.** El árbol de `src/app/` tiene `(tabs)/{home,map,food,health,profile,pairing,reminders,weight-log,meal-schedule,add-reminder}`, `(tabs)/pets/add`, `(tabs)/pets/[petId]/docs`, `(auth)/{login,register,forgot}`, `index` y `reset-password`. `trips` es solo un **módulo de API** (`src/api/trips.ts`), consumido por `map.tsx:14,110`. Y `getDayRoute` (`src/api/trips.ts:24-39`) pide `GET /pets/:petId/trips` **sin día**: solo sabe el día en curso | El detalle de día ofrece **`/map` y solo para hoy** (D3). Para cualquier otro día no hay acción, porque llevaría a los paseos de hoy: sería una mentira. Es el criterio que el repo ya fijó en #71 |
| **C3** | *"`getBarChartAccessibilitySummary` devuelve una cadena para el gráfico entero"* | Cierto, **y además esa cadena es inglés fijo**: `"Bar chart with N bars. Highest value is X at Y. Lowest value is …"`, con `"No value"` para los huecos (`dist/v2/react-native/charts/bar/accessibility.js`). Solo `formatXLabel`/`formatYLabel` son nuestros; el armazón no | **No se usa.** El gráfico recibe un `accessibilityLabel` propio por catálogo, y las siete columnas viven fuera (D5, R9). Usarlo metería inglés en una UI que la carta obliga a resolver por catálogo en dos idiomas |
| **C4** | *"`emptyActivity()` en `pipeline/activity.ts:83-91`"* | La función va de `:83` a `:93`; los ceros están en `:85-89` y `firstWalkAt`/`lastWalkAt` a `null` en `:90-91` | Cita corregida. El fondo del hallazgo es idéntico y sigue en pie |

Corrección adicional, menor, que no cambia nada de lo que hay que implementar: el
test de la pantalla de emparejado está en `src/screens/pairing/index.test.tsx`,
**no** en un directorio `__tests__/`.

---

## 3. Decisiones técnicas

### D1 — Qué hace la librería y qué nos toca a nosotros

Es la decisión que ordena todas las demás, y sale de leer el paquete, no de
confiar en él:

| Requisito | ¿Lo da chart-kit v2? |
|---|---|
| Barras, escalado, banda | **Sí** |
| Eje Y con ticks y rejilla horizontal | **Sí** (`showYAxisLabels`, `showHorizontalGridLines`, `yTickCount`) |
| Distinguir hueco de cero en el modelo | **Sí** (`null` no emite rect) |
| Selección por toque, con `dataIndex`, `value` y `position` | **Sí** (`interaction: {mode:'tap', onSelect}`) |
| Altura mínima para un cero | **No** — un rect de altura 0 es invisible. Lo ponemos en `renderBar` (D4) |
| Marca visible de "sin dato" | **No** — no hay rect que dibujar. Va en la fila de columnas (D5) |
| Línea de media | **No** — las líneas de referencia existen para `LineChart`, no para `BarChart` |
| Animación de entrada | **No** — solo anima la **selección** y la posición del tooltip |
| Anuncio por columna | **No, e imposible desde dentro** (D5) |
| Texto accesible traducido | **No** — su resumen es inglés fijo (C3) |

Conclusión: la librería aporta la **geometría y los ejes**, que es exactamente lo
caro y lo que la primera spec no podía pagar con siete `View`. Todo lo demás lo
seguimos poniendo nosotros. El reparto no es un defecto de la librería: es lo que
hay que escribir en la spec para que Codex no descubra a mitad de camino que
`showAverageLine` no existe.

### D2 — Tres métricas, y son exactamente las tres que tienen tendencia

El selector ofrece `activeMinutes`, `distanceM` y `walkCount` —**las tres que
`weekComparison` cubre** (P6)—, en ese orden. No es una lista de gusto: si
entrara `restMinutes`, su pestaña se quedaría **sin fila de tendencia**, porque
el backend no la compara, y tendríamos una cuarta pestaña que se comporta
distinto que las otras tres sin que el usuario sepa por qué.

`restMinutes` **no se pierde** (carta §Dirección de arte 5): sigue en la celda
"Sueño" de `summary-card` y aparece en el panel de detalle de día (R8), junto a
las otras tres. Lo que no tiene es barra propia.

Las tres métricas viajan **en el mismo payload**: cambiar de pestaña es leer otra
clave del mismo array. De ahí el "sin refetch" de R6, que se prueba contando
llamadas a `getDailyActivity`.

### D3 — El detalle de día, el tooltip y la única navegación honesta

Al tocar una columna o una barra:

1. **Tooltip propio**, no el de la librería. `BarChartSelectEvent` trae
   `position: {x, y}`, así que anclarlo es aritmética nuestra sobre el ancho
   medido. Se hace así por dos razones: su texto tiene que salir del catálogo en
   los dos idiomas (carta §Dirección de arte 6) y su superficie tiene que llevar
   tokens y `CONTINUOUS_CORNER` como cualquier otra del repo. El tooltip de fábrica
   compone su texto a partir de `seriesLabel`/`formattedValue` y se estiliza con
   su propio bloque de config: dos sistemas de estilo en la misma tarjeta.
2. **Panel de detalle** bajo la gráfica, con el día largo y las **cuatro**
   métricas del día. Es el sitio donde `restMinutes` y `avgWalkMinutes` dejan de
   ser datos que se tiran.
3. **Navegación**: `router.push('/map')`, y **solo cuando el día seleccionado es
   hoy**. Motivo en C2: `/trips` no existe y `/map` solo sabe pintar el día en
   curso. Dibujar el enlace para un martes anterior llevaría a los paseos de hoy.
   El repo ya tiene el criterio escrito para este caso exacto, en el enunciado de
   **#71**: *"omite el tile de cualquier destino que no exista todavía"*.

La navegación la decide **la pantalla**, no el componente: el componente expone
`onSelectDay` y no importa `expo-router`. Así se puede probar aislado y así la
regla de capas de `docs/architecture.md` no se dobla.

### D4 — El cero se dibuja, el hueco no, y el discriminante sigue siendo `source`

| Caso | Qué se manda al `BarChart` | Qué se ve | Portador no cromático |
|---|---|---|---|
| medido, valor > 0 | el número | barra proporcional | altura |
| medido, valor = 0 | `0` | barra de `BAR_MIN_HEIGHT = 3` px, aplicada en `renderBar` | **hay** barra + el valor `0` bajo la columna |
| `source === 'missing'` | **`null`** | ninguna barra; `'—'` en la columna | **no** hay barra + glifo distinto + `testID` distinto |

`renderBar` recibe `{bar, fill, radius, selected, strokeColor, strokeOpacity,
strokeWidth, theme}` y su retorno **sustituye** al `<Rect>` por defecto
(`dist/v2/react-native/charts/bar/BarChartSurface.js:58-72`), así que el mínimo
se aplica ahí: `h = Math.max(bar.height, BAR_MIN_HEIGHT)`,
`y = bar.baselineY - h`. Es el mismo sitio donde vive la animación (D8) y el
radio de cápsula (`rx = Math.min(bar.width, h) / 2`).

Los tres portadores son independientes del color: presencia o ausencia de barra,
`testID` distinto y `accessibilityLabel` distinto. Quien mire en escala de
grises, quien lea el árbol de tests y quien use TalkBack distinguen los tres
casos sin depender del verde.

Descartado el borde discontinuo como marca de "sin dato": sobre esquina
redondeada, Android renderiza `borderStyle: 'dashed'` de forma inconsistente y
sería un fallo que solo aparece en el smoke.

### D5 — Las siete columnas viven **fuera** del gráfico, y no es una preferencia

`BarChart` renderiza su raíz como

```jsx
<View accessible accessibilityRole="image" accessibilityLabel={…} style={{width, height}} testID={…}>
```

(`dist/v2/react-native/charts/bar/BarChart.js:182`). Un `accessible` en un
contenedor **colapsa en un solo nodo** todo lo que cuelga de él, en iOS y en
Android. No hay prop para desactivarlo y no hay hueco de render que escape: el
`renderBar` devuelve nodos SVG **dentro** de ese `View`. Por lo tanto **ninguna
implementación puede anunciar siete columnas desde dentro del gráfico**, use la
API que use.

De ahí la forma de la tarjeta: bajo el gráfico va una **fila de siete columnas
táctiles**, cada una `accessible`, con su `accessibilityLabel` traducido, su
`testID` por fecha, su etiqueta de día, su valor (o su `'—'`), y ≥44 pt de alto
(#61 R10). Esa fila hace **cuatro** trabajos a la vez y por eso vale la pena:

1. es el eje X (por eso `showXAxisLabels={false}`, para no duplicar la letra);
2. es la marca de "sin dato" (D4);
3. es el objetivo táctil del detalle (D3) — mucho mejor que una barra de 20 px;
4. es la accesibilidad por columna (R9).

El `accessibilityLabel` del gráfico se mantiene, pero traducido y escrito por
nosotros: un lector de pantalla que caiga sobre el SVG oye *"Gráfica de minutos
activos de los últimos 7 días"*, y el detalle lo da la fila de abajo.

### D6 — La alineación entre las columnas y las barras: por qué se puede calcular

Es la parte incómoda de la decisión y hay que dejarla escrita, porque el
implementer no la va a poder deducir del `.d.ts`.

La caja de dibujo del `BarChart` es **determinista** y sale de tres sitios del
paquete:

- `dist/v2/react-native/charts/bar/model.js:91-111` — padding base
  `{ top: 18, right: 14, bottom: 12, left: 10 }`, `leftLabels = yLabelSizes`,
  `bottomLabels = [max(xLabelSizes)]`, `gap = 8`.
- `dist/v2/core/layout/autoPadding.js` —
  `padding.left += leftLabelWidth > 0 ? leftLabelWidth + gap : 0`, e igual por
  abajo con la **altura**.
- `dist/v2/react-native/charts/bar/modelUtils.js:2-8` —
  `measureBarChartText(text, {fontSize}) = { width: text.length * fontSize * 0.56, height: 14 }`.

De ahí, con `CHART_AXIS_LABEL_SIZE = 10` y **etiquetas de eje Y de longitud fija
`Y_LABEL_CHARS = 4`**:

```
CHART_PAD_LEFT   = 10 + (4 × 10 × 0.56) + 8 = 40.4
CHART_PAD_RIGHT  = 14
CHART_PAD_TOP    = 18
CHART_PAD_BOTTOM = 12 + 14 + 8 = 34        (la altura medida es 14 siempre)
```

`CHART_PAD_BOTTOM` vale 34 aunque `showXAxisLabels` sea `false`, porque el
padding se calcula antes de decidir si se pintan: `measureBarChartText` devuelve
`height: 14` para cualquier texto. Es espacio que se paga y se declara.

La longitud fija se consigue con `padStart`: `formatYLabel` devuelve siempre
cuatro caracteres. Con `textAnchor="end"` —que es como la librería pinta esas
etiquetas— los espacios de relleno quedan a la izquierda del número y no mueven
nada visible.

Y la alineación sale de la escala de banda
(`dist/v2/core/scales/band.js:1-18`, con `paddingInner: 0.12` y
`paddingOuter: 0.08` fijados en `model.js:119-120`):

```
step      = W / (7 − 0.12 + 2×0.08) = W / 7.04
centro_i  = plot.x + step × (0.08 + i + 0.44) = plot.x + step × (i + 0.52)
```

Y siete columnas `flex: 1` dentro de una fila con
`paddingLeft: CHART_PAD_LEFT` y `paddingRight: CHART_PAD_RIGHT`:

```
centro_i  = plot.x + W × (i + 0.5) / 7 = plot.x + step × (1.00571·i + 0.50286)
```

La diferencia es `step × (0.017143 − 0.005714·i)`: máxima en los extremos y
**acotada por `0.0172 × step`**. En una pantalla de 375 px la tarjeta deja
`375 − 48 (padding de pantalla) − 32 (p-4 del Card) = 295` px, el área de dibujo
mide `295 − 40.4 − 14 = 240,6` px, `step ≈ 34,2` px y el desvío máximo es
**0,59 px**. Sub-píxel: alineado.

**El precio, declarado**: cinco constantes internas de la librería
—`{18,14,12,10}`, `gap 8`, `0.56`, `height 14`, `{0.12, 0.08}`— de las que no hay
API pública. Por eso R1 pinea la versión a `7.0.4` **exacta** y R1b pone un test
que se pone rojo si alguien la sube. Una versión nueva obliga a re-derivar estos
cuatro números; no a rehacer la feature.

Alternativas descartadas y por qué, para que nadie las reabra: leer la geometría
desde `renderBar` obliga a escribir estado durante el render y no da nada para
los días sin barra; importar `calculateAutoPadding` desde `core` es un deep
import que el `exports` del paquete prohíbe; y dejar la fila sin alinear pone
cada etiqueta a más de media columna de su barra.

### D7 — Los tokens llegan al gráfico como cadenas, y el grep-clean no se entera

Contra lo que temía el encargo (C1), en la v2 no hay `chartConfig` ni funciones
de opacidad. El gráfico recibe:

```tsx
const [accentStrong, muted, border, foreground, surface] = useThemeColors([
  'accent-strong', 'muted', 'border', 'foreground', 'surface',
]);

<BarChart
  theme={{
    series: [accentStrong],
    grid: border,
    axis: border,
    text: foreground,
    mutedText: muted,
    background: surface,
    plotBackground: surface,
    typography: { axisLabelSize: CHART_AXIS_LABEL_SIZE },
  }}
  …
/>
```

Cero hexadecimales, cero clases arbitrarias, cero `StyleSheet.create`. Los
`preset` de fábrica de la librería **no se usan**: traen su propia paleta
hexadecimal y serían un segundo sistema de color, justo lo que prohíbe la carta
§Decisiones fijas 1.

Dos precauciones que el candado ya vigila y conviene no pisar:
`useThemeColors(['accent'])` está **prohibido** en cualquier fuente
(`legibility-classnames.test.ts:145`), así que tanto la barra como el `tintColor`
del selector piden `'accent-strong'`; y `text-accent-strong` como **clase** no se
usa en ningún sitio nuevo, para no mover el inventario cerrado de #61 R4.

El contraste ya está calculado por #61 y no se re-litiga: `accent-strong`
(`#107148` claro / `#2AB87C` oscuro) da **6,04:1** y **6,79:1** contra
`--surface`, muy por encima del 3:1 que WCAG 1.4.11 pide a un objeto gráfico; y
`muted` (`#667085` / `#9CA3AF`) da **4,97:1** y **6,81:1**, que es AA de texto
normal, el listón correcto para 10 px.

### D8 — La animación de entrada vive en `renderBar`, y muere con `reduced motion`

La librería solo anima la selección. La entrada la ponemos nosotros en el único
sitio donde tenemos el rect: `renderBar` devuelve un componente propio que
mantiene un `useSharedValue(0)`, lo lleva a `1` con
`withDelay(dataIndex × BAR_ENTRY_STAGGER_MS, withTiming(1, {duration: BAR_ENTRY_DURATION_MS}))`
y proyecta `y`/`height` con `useAnimatedProps` sobre
`Animated.createAnimatedComponent(Rect)` de `react-native-svg`. UI thread, sin
tocar el JS thread, como pide la carta §Animación.

`useReducedMotion()` de `react-native-reanimated` —el mismo que ya usa
`src/theme/theme-transition.ts:46`— cortocircuita el valor a `1`: la barra sale
en su geometría final desde el primer frame, sin retardo y sin opacidad. No es un
`if` cosmético: es lo que hace que R10 sea verificable con un mock del hook.

Duraciones de la carta: 250 ms para una transición, y un escalonado de 40 ms que
en siete barras suma 240 ms — la última empieza justo cuando la primera acaba.
Ninguna de las dos se repite en otro sitio, así que **no** se promueven a tokens
`--motion-*` todavía.

### D9 — La tendencia entra, sigue a la métrica, y no editorializa

El dato ya está descargado y tipado (P6) y responde a la pregunta que la Home
hace peor. Entra con estas cuatro reglas:

- **Una sola** fila, la de la métrica seleccionada. La tarjeta habla de una
  métrica cada vez; tres flechas pedirían tres gráficas.
- Icono **real** de `reicon-react-native` (`TrendUp` / `TrendDown`), nunca un
  glifo tipográfico: #62 R7 lo prohíbe y tiene test.
- **Sin color semántico.** Ni `success` al subir ni `danger` al bajar. Una semana
  con menos actividad no es un error —puede ser una mascota convaleciente, un
  dueño de viaje o mal tiempo— y el rojo en una tarjeta de la Home alarma. El
  signo (`+`/`−`, vía `signDisplay: 'exceptZero'`) es el portador de dirección;
  el color es `text-muted` en toda la fila.
- `null` ⇒ **la fila no existe**. Sin hueco, sin `—`, sin texto de relleno. Una
  mascota nueva no tiene semana previa y no debe ver un cero falso.

### D10 — Dónde vive todo, y por qué la Home **sí** se migra ahora

`docs/conventions.md` §Estructura dice que las pantallas anteriores a #39 se
migran "solo cuando una feature las toque de fondo". La versión estrecha de esta
spec añadía seis líneas y por eso no migraba. **Esta versión ya no**: mete una
tarjeta con estado, un selector, un panel de detalle, un tooltip y una
navegación condicionada. Eso es tocarla de fondo, y el humano lo pidió
explícitamente.

Reparto final, con el patrón de `src/screens/pairing/`:

| Fichero | Qué es |
|---|---|
| `src/app/(tabs)/home.tsx` | route delgado, <10 líneas, `export default function HomeRoute()` |
| `src/screens/home/index.tsx` | el cuerpo, `export function HomeScreen()` |
| `src/screens/home/index.test.tsx` | el test de pantalla, movido y colocado al lado |
| `src/screens/home/weekly-activity-chart.tsx` | la tarjeta entera: gráfica, selector, columnas, tooltip, detalle |
| `src/screens/home/weekly-activity-chart.test.tsx` | su test |
| `src/screens/home/format.ts` | `fmtMinutes`, `fmtKm`, `fmtCount`, sacados de `home.tsx` |

La gráfica **no** va a `src/components/`: la regla de extracción de la carta
§Decisiones fijas 4 pide "≥2 pantallas", y esto es una. La convención de #39 dice
literalmente que los sub-componentes privados de una pantalla van en su carpeta,
"NO en `src/components/`". `weight-chart.tsx` está en `src/components/` porque su
pantalla nunca se migró; la Home sí se migra, así que aquí no hay excusa.

El catálogo de conectividad, en cambio, **sí** va a `src/utils/`
(`device-connectivity.ts`): tiene un consumidor hoy y otros mañana —la píldora de
#73 es el primero—, y el precedente exacto es `src/utils/reminder-meta.ts`, que
`checkUses` ya sabe leer por su forma `labelKey:`.

### D11 — Las siete preguntas de la Home

Declaración obligatoria de la carta §Dirección de arte 3 para toda spec que toque
la Home:

| Pregunta del brief | ¿La responde #68? |
|---|---|
| ¿Está segura? | **No.** Sigue sin responderse; depende de geocercas y alertas |
| ¿Dónde está? | **No.** La responde `last-position-card`, intacta |
| ¿El collar está conectado? | **No.** La responde `collar-card`, intacta. #68 traduce la etiqueta en **emparejado**, no cambia el estado de la Home; eso es #73 |
| ¿Tiene batería? | **No.** La responde `collar-card`, intacta |
| ¿Tiene recordatorio pendiente? | **No.** Sigue sin responderse en la Home |
| **¿Cómo fue su actividad hoy?** | **Sí, y la ensancha mucho**: de "hoy" a "los siete días", en tres métricas, con la media, la tendencia y el detalle por día |
| ¿Hay alguna alerta? | **No.** Sigue sin responderse, como declaró #67 |

#68 mejora una de las siete y no degrada ninguna.

---

## 4. Archivos afectados por capa

`mobile-pet-tracker/` es la única raíz tocada. **Cero ficheros de
`backend-pet-tracker/`**, cero infraestructura, cero configuración de Expo más
allá de la dependencia.

**Presentación — pantalla migrada (R15)**
- `src/app/(tabs)/home.tsx` — **reescrito** a route delgado (<10 líneas).
- `src/screens/home/index.tsx` — **nuevo** (cuerpo movido de `home.tsx`), con el
  montaje de la tarjeta y la navegación condicionada de R8.
- `src/screens/home/index.test.tsx` — **movido** desde
  `src/app/(tabs)/__tests__/home.test.tsx`, con un `describe` nuevo.
- `src/screens/home/format.ts` — **nuevo**: `fmtMinutes`, `fmtKm`, `fmtCount`.

**Presentación — componente de la feature**
- `src/screens/home/weekly-activity-chart.tsx` — **nuevo**.
- `src/screens/home/weekly-activity-chart.test.tsx` — **nuevo**.

**Contenido y catálogo**
- `src/i18n/catalog.ts` — **editado**: dieciséis claves en `en` y dieciséis en `es`.
- `src/utils/device-connectivity.ts` — **nuevo**: `DEVICE_CONNECTIVITY_META`,
  `connectivityLabelKey`.
- `src/utils/device-connectivity.test.ts` — **nuevo**.
- `src/screens/pairing/index.tsx` — **editado**: solo `:421-422`.
- `src/screens/pairing/index.test.tsx` — **editado**: solo el `it` de `:511`.
- `specs/mobile-ui-language/design.md` §2 — **editado**: registro de las claves.

**Candados**
- `src/__tests__/ui-copy-table.ts` — filas nuevas y rutas reubicadas (R19).
- `src/__tests__/ui-language.test.ts` — tres `toHaveLength` por delta (R19).
- `src/__tests__/consistency-classnames.test.ts` — dos filas nuevas, dos filas
  reubicadas, dos totales por delta (R19).
- `src/__tests__/legibility-classnames.test.ts` — una fila **reubicada**, cifra
  sin cambio (R19).
- `src/__tests__/design-drift.test.ts` — cuarto entrypoint delgado, assert de
  dependencia, y el bloque nuevo de R18.

**Configuración**
- `package.json` — `react-native-chart-kit: "7.0.4"` y dos entradas en
  `jest.transformIgnorePatterns`.

**Sin tocar, y es deliberado**: `src/api/*` (el contrato ya sirve),
`src/theme/global.css` (no hace falta ningún token nuevo),
`src/components/card.tsx`, `src/components/weight-chart.tsx`,
`src/components/pet-hero-header.tsx`, `src/hooks/use-api.ts`,
`src/app/(tabs)/map.tsx`.

---

## 5. Alternativas descartadas

| Alternativa | Por qué no |
|---|---|
| Importar `react-native-chart-kit` por la raíz (v1) | `Dataset.data: number[]` sin `null`: un día sin dato entraría como 0 y la gráfica mentiría. R1 lo prohíbe con candado |
| Deep import a `react-native-chart-kit/dist/v2/core/...` para reusar `calculateAutoPadding` | El `exports` del paquete solo publica `.`, `./v2` y `./package.json`: el import ni resuelve ni es legal |
| `victory-native` | Peer `@shopify/react-native-skia`: módulo nativo, obliga a reconstruir el dev build de Android en cada máquina |
| `react-native-gifted-charts` | Peers `expo-linear-gradient` y `react-native-linear-gradient`: reabriría el veto nominal de #46, ratificado en la enmienda A4 de #67 |
| Seguir sin librería, con siete `View` | Era lo correcto para el alcance estrecho. Con eje Y, rejilla, tooltip y selección, escribir a mano la escala de banda y los ticks es más código y más frágil que pinear una versión |
| Usar el tooltip de fábrica de la librería | Su texto se compone dentro y su estilo va por su propio bloque de config: dos sistemas de estilo y copy fuera del catálogo (D3) |
| Usar `getBarChartAccessibilitySummary` | Inglés fijo, contra la carta §Dirección de arte 6 (C3) |
| Anunciar las columnas desde dentro del gráfico | Imposible: su raíz es `accessible` y colapsa el subárbol (D5) |
| Dejar la fila de columnas sin alinear | El desvío sería el canalón entero del eje Y (~40 px), más de media columna |
| Alinear leyendo la geometría en `renderBar` | Obliga a escribir estado durante el render y no da nada para los días sin barra |
| Navegar a `/trips` | **No existe** (C2) |
| Añadir un día a `getDayRoute` para navegar al mapa de un día pasado | Es una llamada nueva a la API: fuera de alcance por criterio de aceptación |
| Ofrecer el enlace al mapa para cualquier día | Llevaría a los paseos de hoy: un enlace que miente |
| `restMinutes` como cuarta métrica del selector | Sin `weekComparison`, su pestaña se quedaría sin tendencia (D2) |
| Animar la tarjeta entera con `entering` en vez de las barras | El encargo pide que animen **las barras**; y una tarjeta que aparece de golpe compite con el hero de #67 |
| Tres tendencias a la vez | La tarjeta habla de una métrica cada vez |
| Tendencia en `success` / `danger` | D9: una semana menos activa no es un error y el rojo alarma |
| Día `missing` con barra gris de altura fija | Una barra gris sigue siendo una barra: a distancia se lee como "poca actividad", que es justo la mentira que P4 quiere evitar |
| Día `missing` con borde discontinuo | Android renderiza mal `borderStyle: 'dashed'` sobre esquina redondeada: fallo que solo aparece en el smoke |
| `weekday: 'narrow'` para el eje | Ambiguo en los dos idiomas (`M J V S D L M` en español, `S M T W T F S` en inglés) y el eje no es lunes-a-domingo, así que la posición no desambigua |
| Tabla de siete letras `L M X J V S D` del Make | Catorce entradas a mano en dos idiomas, y la `X` solo existe en español, para sustituir una llamada de una línea |
| La gráfica en `src/components/` | Una sola pantalla, y la convención de #39 manda los sub-componentes privados a `src/screens/<x>/` (D10) |
| No migrar la Home | El humano lo pidió, y con este alcance ya es "tocarla de fondo" según la propia convención |
| Traducir los cinco enum crudos de una vez | La enmienda E1 se mantiene estrecha a propósito: `connectivity` es el que la carta señala como jerga del proveedor, y los otros cuatro no bloquean nada |
| Un `Record` exhaustivo de valores de `connectivity` | El tipo es `string`, no una unión: inventar `'LTE' \| '3G' \| …` sería construir sobre una premisa que el árbol no sostiene |
| Reutilizar `home.online` para la etiqueta de emparejado | Cruza ámbitos del catálogo; `deviceConnectivity.*` deja el mapa listo para que #73 lo consuma |

---

## 6. Riesgos y cómo se cierran

| Riesgo | Cierre |
|---|---|
| La suite no arranca porque el paquete es ESM y `jest-expo` no lo transforma | R1 obliga a añadir `react-native-chart-kit` y `paths-js` a `transformIgnorePatterns`, con test que lo lee del `package.json`. Es el primer rojo de [[tasks]] |
| Una subida de versión mueve las constantes de layout y descoloca la fila de columnas | R1b pinea `7.0.4` exacta y falla si cambia; D6 enumera las cinco constantes acopladas para que re-derivarlas sea mecánico |
| El desfase de zona horaria pasa desapercibido porque el runner del VPS está en UTC | El `it` de R4 fuerza `process.env.TZ` a offset negativo; es la mutación 2 de R20b |
| Ramificar por `valor === null` en vez de por `source` pasa los tests | Mutación 3 de R20b, y R5 lo escribe como obligación explícita |
| El anuncio por columna se "resuelve" poniendo el `accessibilityLabel` en el gráfico | D5 lo declara imposible con la línea del fuente que lo demuestra; R9 exige siete y prohíbe el del contenedor |
| Reanimated sobre nodos SVG se comporta distinto en el runner que en dispositivo | El contrato del test es la rama de `reduced motion` (determinista) más los argumentos de `withDelay`/`withTiming`; el movimiento real lo verifica el smoke en dev build |
| La migración de la Home mueve candados y alguien "arregla" un total | R19 separa **reubicación de ruta** (cifra intacta) de **delta real**, y ordena parar y reportar si un total se mueve por otra causa |
| Se rompe el candado de copy de #65 al no registrar los ficheros nuevos | R17 fija las dieciséis claves y R19 los tres `toHaveLength` como **delta** |
| El smoke ve barras de color distinto al Make | Consecuencia asumida y ya declarada de #61: en tema claro la barra es `#107148`, no el `#2AB87C` del Make. Es esperado, no un defecto |
| Aparece un dato que exige una llamada nueva a la API | [[requirements]] §Fuera de alcance: **la feature se para y se reporta**. No se añade la llamada |

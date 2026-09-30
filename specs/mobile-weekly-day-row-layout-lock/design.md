---
feature: "mobile-weekly-day-row-layout-lock"
status: spec_ready       # draft | spec_ready | approved
tags: [spec, mobile, test, deuda]
---

# Diseño — [[mobile-weekly-day-row-layout-lock]] (#131 y #135)

> Ver [[requirements]] para los requisitos y [[../../docs/architecture|architecture]]
> para las capas. Esta feature solo añade tests a la capa de presentación móvil
> (`src/screens/home/`): no hay dominio, aplicación ni infraestructura
> implicados.

## Decisiones técnicas

- **D1. Un ciclo, dos entradas, R-ids seguidos.** #131 (forma y reparto de la
  fila) y #135 (los hijos de la tarjeta) tocan el mismo fichero de test, añaden
  sus bloques en el mismo sitio y se prueban con las mismas cuatro acciones.
  Como en #137 y #139, los requisitos se numeran seguidos (R1 a R3 de #131, R4
  de #135 y R5 de las dos), y cada título y comentario lleva el prefijo de su
  entrada: `#131 R1`, `#135 R4`.

- **D2. R1: la clase exacta de la fila, con `toBe('flex-row')`.** Es una sola
  clase, y el `toBe` falla con `flex-col`, con `flex-row-reverse` y con
  cualquier clase añadida (`flex-row items-end`). Se asevera en los cuatro
  estados que la gráfica alcanza en el test: antes de medir, tras medir a 295,
  con la segunda métrica y con un día seleccionado. Cada paso lleva primero una
  guarda que prueba que el estado se alcanzó (`weekly-activity-bar-chart` en
  pantalla, el `accessibilityState` de la opción pulsada y
  `weekly-activity-tooltip` en pantalla), como pide la lección de #132: un
  candado que solo mira el primer render deja pasar lo que aparece después.

- **D3. R2: el `padding` de la fila, relacional con la línea de media.**
  `ActivityBar` dibuja la línea de media (`weekly-activity-average`) de
  `x1={CHART_PAD_LEFT}` a `x2={chartWidth - CHART_PAD_RIGHT}`, es decir, de
  borde a borde del área de barras tal como la define la gráfica. El
  `BarChart` recibe `width={chartWidth}`. Así que la fila está alineada con las
  barras si y solo si:

  - `paddingLeft` es `x1` de la línea;
  - `paddingRight` es el `width` del `BarChart` menos `x2` de la línea.

  El test lee los dos términos del árbol pintado (`getByTestId('weekly-activity-average').props`
  y `latestBarChartProps().width`) y compara el estilo **entero** de la fila,
  fusionado con el helper `mergeObjectStyles` que ya existe, con `toEqual`
  contra ese objeto de dos claves. No hay literal (`40.4`, `14`) ni import de
  `CHART_PAD_*`, que es lo que pide el criterio 2 de #131: un esperado
  importado de producción es un candado tautológico.

  Se asevera tras medir, con la segunda métrica y con un día seleccionado.
  **Antes de medir no se puede**: no hay `BarChart` ni línea de media, así que
  la relación no tiene segundo término (sonda `padlayout`, (D) en
  [[requirements]]).

  La relación corta en los dos sentidos: mover la línea sin mover la fila
  también la pone en rojo (sonda `avgx1`). Hoy nada mira `x1` ni `x2` de la
  línea (`R7` de #68 solo asevera `strokeDasharray`, `y1` e `y2`), así que R2
  es también el primer candado sobre los extremos de la línea. Lo que R2 no ve
  es que la gráfica entera se desalinee de la librería: si `CHART_PAD_LEFT`
  cambia, fila y línea se mueven juntas (sonda `padconst`). Eso es otro
  contrato, «gráfica frente a `react-native-chart-kit`», y queda como (F).

- **D4. R3: la clase exacta de cada columna, por posición.** Los `className`
  de `row.children` (hijos host, no recuento por `testID`), con `toEqual`
  contra siete literales, en los mismos cuatro estados de R1. En reposo, las
  siete son `'min-h-11 flex-1 items-center justify-end'`; con el cuarto día
  seleccionado, la cuarta es la misma cadena más
  `' border-t-2 border-accent-strong'`. Fija las decisiones 10 y 11 de la
  carta (forma del contenedor y envoltorio que reparte el espacio) en las dos
  ramas del ternario. El coste: la cadena entera queda fijada, incluidos
  `min-h-11` (que `#68 R9` ya mira con `toContain`) y los dos tokens del borde
  del día seleccionado. Un cambio legítimo de cualquiera de ellos pasa por
  tocar este candado a sabiendas ([[requirements]] §Qué firma el humano).

- **D5. R4: la lista cerrada de los hijos host de la tarjeta.** Los `testID`
  de `getByTestId('weekly-activity-card').children`, con `toEqual` contra una
  lista literal. Fija identidad, orden y cardinalidad de golpe, y un hijo sin
  `testID` (un envoltorio) sale como `undefined` en la lista y la pone en rojo.
  Es el remedio que apuntaron #130 R2 (para la fila) y la spec de #132 (para
  el selector). La tarjeta cambia de hijos según el estado, así que R4 los
  recorre todos:

  | Estado | Hijos host de la tarjeta, en orden |
  |---|---|
  | con días medidos, sin comparación, antes o después de medir, con cualquier métrica | `header`, `metric`, `chart-layout`, `day-row` |
  | lo mismo con un día seleccionado | los cuatro y `detail` |
  | con comparación (`trend !== null`) | `header`, `metric`, `trend`, `chart-layout`, `day-row` |
  | sin ningún día medido | `header`, `empty` |

  (Todos con el prefijo `weekly-activity-`.) Son tres `it`, porque la
  comparación y el estado vacío son props de montaje y no se alcanzan pulsando.

- **D6. Rojos por mutación de producción versionada (C4, vía b).** Las cuatro
  mutaciones son de una sola decisión cada una: `flex-col` en la fila (R1),
  `paddingLeft: 0` (R2), la rama de reposo de la columna sin `flex-1` (R3) y un
  `<View accessible>` alrededor de `<MetricSelector` (R4). La de R4 es
  **exactamente** la sonda `wrapmetric` de la spec de #132: dos líneas
  insertadas, el selector sin reindentar, blob
  `d053148a654bb15abf0e75c2d056d94bea7b930a`, el mismo que cita la entrada de
  #135. Cada verde las revierte con `git checkout HEAD~1 --`, y la gráfica
  acaba en su blob de base.

- **D7. Formato a mano, sin prettier.** El test no está formateado con
  prettier (pasarlo cambiaría 135 líneas de la base) y `mobile-pet-tracker/`
  no tiene configuración de prettier. Los bloques de [[tasks]] ya vienen en el
  estilo del fichero; se pegan tal cual y no se formatea el fichero.

## Archivos afectados

- `mobile-pet-tracker/src/screens/home/weekly-activity-chart.test.tsx`
  (presentación, tests): cuatro `describe` nuevos al final, con seis `it`. Pasa
  de 47 a 53 tests.
- `mobile-pet-tracker/src/screens/home/weekly-activity-chart.tsx`
  (presentación): **solo** en los cuatro commits rojos, con la mutación que el
  verde siguiente revierte. Diff acumulado vacío.
- `progress/impl_mobile-weekly-day-row-layout-lock.md` y
  `specs/mobile-weekly-day-row-layout-lock/traceability.md`: la evidencia.

## Coordinación

- **#138 `mobile-collar-pair-link-pressed-feedback`** (otra sesión, branch
  `feature/138-mobile-collar-pair-link-pressed-feedback`) toca
  `src/screens/home/index.tsx`, `index.test.tsx` y
  `src/__tests__/consistency-classnames.test.ts`, ninguno de esta feature.
  Según el `leader`, añade 2 tests a la suite. Si mergea antes, la base de la
  suite sube a 86 / 1613: el delta exigido sigue siendo +6 tests y +0 suites
  sobre lo que Codex mida al arrancar, y los «N failed de M» de los rojos se
  desplazan igual.
- `index.test.tsx` (la Home) pinta la gráfica y la lee en sus `it` de orden,
  pero ninguna de las cuatro mutaciones la pone en rojo (medido con las cuatro
  sobre su etapa, [[requirements]] §Premisas). Medido también con los tres
  ficheros de #138 tal como están en su branch en `1e5ace63`: la Home sigue
  verde con los cuatro rojos, y los rojos siguen siendo solo de la gráfica.
  Esa predicción depende de ficheros que esta feature no controla: si #138 u
  otra feature cambia la Home después de `1e5ace63` de forma que la vea, el
  rojo de la suite dejaría de ser único, y Codex **para**.

## Alternativas descartadas

- **R1 con `toContain('flex-row')`.** `'flex-row-reverse'` contiene
  `'flex-row'` (sonda `flexrev`), y deja pasar cualquier clase añadida.
- **R1 partiendo la clase en tokens y comparando el conjunto.** Con una sola
  clase no gana nada frente al `toBe` y se lee peor.
- **R1 y R3 midiendo posiciones.** RNTL no calcula layout (no hay Yoga en el
  test): no hay `x` ni anchos que medir.
- **R2 con literales (`40.4`, `14`).** Los prohíbe el criterio 2 de #131, y
  fijaría la geometría de la librería en el test.
- **R2 importando `CHART_PAD_LEFT` y `CHART_PAD_RIGHT`.** Los prohíbe el mismo
  criterio. Es un candado tautológico: el esperado se mueve con el valor
  observado.
- **R2 contra la geometría real de `react-native-chart-kit`.** Es factible: en
  la medida del spec_author, con
  `Object.defineProperty(jest.requireMock('react-native-svg'), '__esModule', { value: true })`
  y `mockBarChart.mockImplementation(jest.requireActual('react-native-chart-kit/v2').BarChart)`,
  el `BarChart` real se pinta en el test y su área de trazado sale en
  `x 40.400000000000006`, ancho `240.6`, y la rejilla de `x1 40.4…` a `x2 281`.
  Se descarta porque:
  - muta en tiempo de ejecución el mock de `react-native-svg` de #68 y cambia
    la implementación de `mockBarChart`, que el resto del fichero comparte y
    que hay que restaurar en un `finally`;
  - los bordes del área de trazado no tienen `testID`: el test dependería del
    árbol interno de la librería y de un `toBeCloseTo`;
  - lo que añade sobre la línea de media es otro contrato (la gráfica frente a
    la librería, sonda `padconst`), no el de #131 (la fila frente a la
    gráfica). Queda como (F).
- **R2 contra el tooltip.** `handleColumnPress` calcula `tooltipX` con los
  mismos `CHART_PAD_*`, pero en una columna central el test solo vería la
  diferencia `paddingLeft − paddingRight`, las columnas de los extremos las
  recorta el `clamp` del tooltip, y el esperado se calcularía con la fórmula de
  producción.
- **R4 con `metric.parent` `toBe` la tarjeta.** Cierra el selector, pero no
  los envoltorios de la cabecera, la tendencia, el gráfico, el detalle ni el
  mensaje vacío (sondas `wrapheader`, `wraptrend`, `wraplayout`, `wrapdetail`
  y `wrapempty`), ni un hijo nuevo sin `testID` (`siblingcard`) ni el orden
  (`swaporder`).
- **R4 contando hijos por `testID`.** Es el recuento por prefijo que la carta
  prohíbe: no ve un hijo sin `testID`.
- **Extender `#130 R2` o `#132 R1` en vez de bloques nuevos.** Son `describe`
  firmados y cerrados; los criterios 3 de #131 y #135 los quieren sin cambios.
- **Un gate de dispositivo.** El árbol de producción acaba idéntico al de
  `origin/main`: no hay nada nuevo que ver ni que oír.

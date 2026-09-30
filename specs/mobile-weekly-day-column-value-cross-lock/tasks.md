---
feature: "mobile-weekly-day-column-value-cross-lock"
status: approved         # draft | spec_ready | approved
tags: [spec, mobile, test, deuda]
---

# Tareas — [[mobile-weekly-day-column-value-cross-lock]] (#141, #142 y #143)

> Orden TDD por requisito: (1) test rojo, (2) implementación mínima,
> (3) refactor. R1, R2 y R3 se escriben sobre código que ya cumple, así que su
> rojo es una **mutación de producción versionada** en el commit rojo, que el
> verde revierte con `git checkout HEAD~1 --` (C4, vía **b**). Nunca un
> `ReferenceError` ni un doble de test mutado.
>
> Cada requisito crea su sujeto antes de aseverarlo. La tarjeta, la fila, sus
> siete columnas y los hijos de cada columna ya existen en la base. El día
> `missing`, la comparación y la semana vacía los crea el montaje del propio
> `it`, y el día seleccionado, la pulsación del propio `it`. Cada bloque usa
> solo helpers que ya existen en el test. Ningún bloque depende de otro, y el
> orden R1, R2, R3 es el orden en el fichero.
>
> Las rutas son relativas a `mobile-pet-tracker/` salvo que empiecen por
> `docs/`, `specs/` o `progress/`, o se diga «desde la raíz». Los números de
> línea **no son anclas**: todo se localiza por contenido, con el `grep` que se
> cita, y cada ancla da 1 en la base. «La gráfica» es
> `src/screens/home/weekly-activity-chart.tsx` y «el test» es
> `src/screens/home/weekly-activity-chart.test.tsx`. Ninguna ruta de este
> ciclo lleva paréntesis.

## Antes de tocar nada

1. `git branch --show-current` da `feature/141-mobile-weekly-day-column-value-cross-lock`.
   Si no, **para**.
2. Lee la casilla de [[requirements]] §Aprobación. Si no está marcada, **para**.
3. `cd mobile-pet-tracker && test ! -e .expo/types/router.d.ts; echo "exit=$?"`
   da `exit=0`. Si da 1, **para** y avisa al humano: el fichero está gitignorado
   y rompe `tsc` con rutas fantasma. No lo borres tú, porque tu sandbox lo
   deniega (#121).
4. **No cargues ninguna skill de expo.** Este ciclo no cambia UI: todo lo que
   necesitas está escrito aquí. Todo se corre con `bun` y `bunx`, nunca con
   `npm` ni `npx`. No instales nada. No corras `./init.sh` ni los e2e.
5. Blobs de base, con `git hash-object <ruta>`:

   | Ruta | Blob |
   |---|---|
   | `src/screens/home/weekly-activity-chart.tsx` | `c258abedde92d2be981be8507d3d898f13c612cb` |
   | `src/screens/home/weekly-activity-chart.test.tsx` | `2f3828f4c039e9f3794c739e831c6402e138d6a9` |

   Si alguno no coincide, **para**: la base se movió, y los blobs y las sondas de
   esta spec ya no valen.
6. Mide la base con los dos comandos canónicos, **sin pipe**:

   ```bash
   bunx jest --runTestsByPath src/screens/home/weekly-activity-chart.test.tsx > /tmp/141_chart.log 2>&1; echo "exit=$?"
   bunx jest > /tmp/141_full.log 2>&1; echo "exit=$?"
   grep -E "^(Tests|Test Suites|Snapshots):" /tmp/141_chart.log /tmp/141_full.log
   ```

   Esperado: la gráfica da 55 passed de 55, `exit=0`. La suite da 86 passed de
   86 suites y 1621 passed de 1621 tests, `exit=0`. **Esa cifra de la suite la
   relató el `leader` y el spec_author no la midió**: la tuya manda. Si la suite
   da otra cifra con `exit=0`, **anota la medida** y úsala como base: el delta
   exigido es +5 tests y +0 suites sobre lo medido, y los «N failed de M» de los
   rojos se desplazan igual. Nunca pongas `| tail` ni `| grep` detrás de
   `jest`, porque el `exit` sería el del último comando. Los bloques
   `● Console` del log son ruido y no cuentan como fallo. Los rojos se cuentan
   por la línea `Tests:`.
7. **Reglas de literales en los bloques nuevos**, comentarios incluidos:
   - un `#` solo puede ir seguido de dígitos, un espacio y `R<n>` (`#141 R1`,
     `#142 R2`, `#143 R3`), por `#68 R18` (`src/__tests__/design-drift.test.ts`).
     Nada de `#141`, `#142` ni `#143` sueltos: medido, rompe `#68 R18` (sonda
     `hexbare`);
   - ni `StyleSheet` ni `text-[10px]`, en ningún caso;
   - ni `use-api` ni `useApi` (`#87 R19`);
   - los textos, los `testID` y las clases esperados son **literales** del test:
     no importes `formatMetricValue`, `metricValue`, `weekdayLabel` ni nada de
     la gráfica, ni leas su fuente.
8. **Pega los bloques tal cual, sin prettier.** El test no está formateado con
   prettier y `mobile-pet-tracker/` no tiene configuración de prettier:
   formatearlo cambiaría líneas de la base. Aquí los bloques llevan 3 espacios
   de sangría por estar dentro de una lista; en el test, `describe(` va en la
   columna 0 y las líneas en blanco van vacías. El blob que se cita tras cada
   bloque te dice si lo pegaste bien. No añadas ningún import: `fireEvent`,
   `within`, `renderChart`, `renderChartWithProps`, `makeWeek` y
   `NO_COMPARISON` ya están en el test.

## R1 — Cada columna muestra el valor de su propio día (#141)

### (1) Rojo

1. Al final del test, después del `});` que cierra
   `describe('#140 R2: la etiqueta, el valor y la raya de cada columna llevan su receta exacta'`
   (es el último `describe` del fichero: `grep -n "^describe(" src/screens/home/weekly-activity-chart.test.tsx | tail -1`),
   añade una línea en blanco y este bloque:

   ```tsx
   describe('#141 R1: cada columna muestra el valor de su propio día', () => {
     it('el texto de los dos hijos de cada columna, por posición, antes de medir y, ya medido, en las tres métricas sin día seleccionado, con un día medido y con el día sin datos', async () => {
       const result = await renderChartWithProps(
         {
           days: makeWeek('2026-09-02', [10, 20, 30, 40, 50, null, 70]),
           weekComparison: NO_COMPARISON,
         },
         'es',
         false,
       );
       const minutes = [
         ['mié', '10m'],
         ['jue', '20m'],
         ['vie', '30m'],
         ['sáb', '40m'],
         ['dom', '50m'],
         ['lun', '—'],
         ['mar', '1h 10m'],
       ];
       const kilometres = [
         ['mié', '1.0 km'],
         ['jue', '2.0 km'],
         ['vie', '3.0 km'],
         ['sáb', '4.0 km'],
         ['dom', '5.0 km'],
         ['lun', '—'],
         ['mar', '7.0 km'],
       ];
       const walks = [
         ['mié', '0'],
         ['jue', '1'],
         ['vie', '2'],
         ['sáb', '3'],
         ['dom', '4'],
         ['lun', '—'],
         ['mar', '6'],
       ];
       const columnTexts = () =>
         result
           .getByTestId('weekly-activity-day-row')
           .children.map((column) =>
             typeof column === 'string'
               ? column
               : column.children.map((child) =>
                   typeof child === 'string' ? child : child.children.join(''),
                 ),
           );

       // #141 R1: the text of each column by position, written out in the test and
       // different on every day, so a column that shows the value of another day,
       // in any metric and with or without a selected day, turns the lock red.
       expect(columnTexts()).toStrictEqual(minutes);

       const layout = result.getByTestId('weekly-activity-chart-layout');

       await fireEvent(layout, 'layout', {
         nativeEvent: {
           layout: { width: 295, height: 0, x: 0, y: 0 },
         },
       });

       expect(result.getByTestId('weekly-activity-bar-chart')).toBeOnTheScreen();
       expect(columnTexts()).toStrictEqual(minutes);

       await fireEvent.press(
         result.getByTestId('weekly-activity-metric-distanceM'),
       );

       expect(
         result.getByTestId('weekly-activity-metric-distanceM').props
           .accessibilityState,
       ).toEqual({ selected: true });
       expect(columnTexts()).toStrictEqual(kilometres);

       await fireEvent.press(
         result.getByTestId('weekly-activity-metric-walkCount'),
       );

       expect(
         result.getByTestId('weekly-activity-metric-walkCount').props
           .accessibilityState,
       ).toEqual({ selected: true });
       expect(columnTexts()).toStrictEqual(walks);

       await fireEvent.press(result.getByTestId('weekly-activity-day-2026-09-05'));

       expect(result.getByTestId('weekly-activity-tooltip')).toBeOnTheScreen();
       expect(columnTexts()).toStrictEqual(walks);

       await fireEvent.press(result.getByTestId('weekly-activity-day-2026-09-07'));

       expect(
         within(result.getByTestId('weekly-activity-detail')).getByText(
           'Sin datos de este día',
         ),
       ).toBeOnTheScreen();
       expect(columnTexts()).toStrictEqual(walks);

       await fireEvent.press(
         result.getByTestId('weekly-activity-metric-distanceM'),
       );

       expect(
         result.getByTestId('weekly-activity-metric-distanceM').props
           .accessibilityState,
       ).toEqual({ selected: true });
       expect(columnTexts()).toStrictEqual(kilometres);

       await fireEvent.press(
         result.getByTestId('weekly-activity-metric-activeMinutes'),
       );

       expect(
         result.getByTestId('weekly-activity-metric-activeMinutes').props
           .accessibilityState,
       ).toEqual({ selected: true });
       expect(columnTexts()).toStrictEqual(minutes);

       await fireEvent.press(result.getByTestId('weekly-activity-day-2026-09-05'));

       expect(
         result.getByTestId('weekly-activity-day-2026-09-05').props
           .accessibilityState,
       ).toEqual({ selected: true });
       expect(columnTexts()).toStrictEqual(minutes);

       await fireEvent.press(
         result.getByTestId('weekly-activity-metric-distanceM'),
       );

       expect(
         result.getByTestId('weekly-activity-metric-distanceM').props
           .accessibilityState,
       ).toEqual({ selected: true });
       expect(columnTexts()).toStrictEqual(kilometres);
     });
   });
   ```

   El test da el blob `b4474f3660fbbcf1c350ff6e8d22e3420f377d5c`, con 2129
   líneas y 26 `describe` de primer nivel.
2. En la gráfica, aplica `P1red` (la sonda `valuecross` de #141). La línea

   ```tsx
                     metricValue(day, selectedMetric),
   ```

   (18 espacios; `grep -c '^                  metricValue(day, selectedMetric),$'`
   da 1) pasa a

   ```tsx
                     metricValue(dataIndex === 6 ? days[0] : day, selectedMetric),
   ```

   La gráfica da el blob `9f3c5bfd2b929c80b2d08370ed3f1e9edec5e07b`.
3. La gráfica da `exit=1`: 1 failed y 55 passed de 56. El **único** rojo es
   `#141 R1: cada columna muestra el valor de su propio día › el texto de los dos hijos de cada columna, por posición, antes de medir y, ya medido, en las tres métricas sin día seleccionado, con un día medido y con el día sin datos`,
   por `expect(received).toStrictEqual(expected)`, en la primera aserción (la
   de justo debajo del comentario `// #141 R1:`).
4. La suite da `exit=1`: 1 failed y 1621 passed de 1622; 1 suite failed y 85
   passed de 86. El único rojo es el mismo. Si falla otro test, o este falla por
   otra cosa, **para**.
5. Commit rojo, con los dos ficheros (desde la raíz):

   ```bash
   git add mobile-pet-tracker/src/screens/home/weekly-activity-chart.test.tsx mobile-pet-tracker/src/screens/home/weekly-activity-chart.tsx
   git commit -m "test(mobile): expose the weekly day value cross with a versioned mutation (R1)"
   ```

### (2) Verde

1. `git checkout HEAD~1 -- mobile-pet-tracker/src/screens/home/weekly-activity-chart.tsx`
   (desde la raíz). La gráfica vuelve a `c258abedde92d2be981be8507d3d898f13c612cb`.
2. La gráfica da 56 de 56, `exit=0`.
3. Commit verde, solo con la gráfica:

   ```bash
   git add mobile-pet-tracker/src/screens/home/weekly-activity-chart.tsx
   git commit -m "test(mobile): lock each weekly day column to its own value in every metric (R1)"
   ```

### (3) Refactor

Ninguno. `columnTexts` se queda dentro de su `it`, y las tres listas se quedan
escritas par a par: un esperado generado (`days.map(...)`) sería la gráfica
comparada consigo misma ([[design]] D3).

## R2 — La lista de hijos de la tarjeta es cerrada (#142)

### (1) Rojo

1. Al final del test, después del `});` que cierra el `describe` de `#141 R1`,
   añade una línea en blanco y este bloque:

   ```tsx
   describe('#142 R2: la lista de hijos de la tarjeta es cerrada, sin ningún nodo de más al final', () => {
     it('sin comparación: antes y después de medir, en las tres métricas y con un día seleccionado, medido o sin datos, también con la primera métrica', async () => {
       const result = await renderChartWithProps(
         {
           days: makeWeek('2026-09-02', [10, 20, 30, 40, 50, null, 70]),
           weekComparison: NO_COMPARISON,
         },
         'es',
         false,
       );
       const withoutDetail = [
         'weekly-activity-header',
         'weekly-activity-metric',
         'weekly-activity-chart-layout',
         'weekly-activity-day-row',
       ];
       const withDetail = [
         'weekly-activity-header',
         'weekly-activity-metric',
         'weekly-activity-chart-layout',
         'weekly-activity-day-row',
         'weekly-activity-detail',
       ];
       const cardChildren = () =>
         result
           .getByTestId('weekly-activity-card')
           .children.map((child) =>
             typeof child === 'string' ? child : child.props.testID,
           );

       // #142 R2: toStrictEqual, because toEqual skips a trailing undefined: a last
       // child of the card without testID would pass, in any of these states.
       expect(cardChildren()).toStrictEqual(withoutDetail);

       const layout = result.getByTestId('weekly-activity-chart-layout');

       await fireEvent(layout, 'layout', {
         nativeEvent: {
           layout: { width: 295, height: 0, x: 0, y: 0 },
         },
       });

       expect(result.getByTestId('weekly-activity-bar-chart')).toBeOnTheScreen();
       expect(cardChildren()).toStrictEqual(withoutDetail);

       await fireEvent.press(
         result.getByTestId('weekly-activity-metric-distanceM'),
       );

       expect(
         result.getByTestId('weekly-activity-metric-distanceM').props
           .accessibilityState,
       ).toEqual({ selected: true });
       expect(cardChildren()).toStrictEqual(withoutDetail);

       await fireEvent.press(result.getByTestId('weekly-activity-day-2026-09-05'));

       expect(result.getByTestId('weekly-activity-tooltip')).toBeOnTheScreen();
       expect(cardChildren()).toStrictEqual(withDetail);

       await fireEvent.press(
         result.getByTestId('weekly-activity-metric-activeMinutes'),
       );

       expect(
         result.getByTestId('weekly-activity-metric-activeMinutes').props
           .accessibilityState,
       ).toEqual({ selected: true });
       expect(cardChildren()).toStrictEqual(withDetail);

       await fireEvent.press(result.getByTestId('weekly-activity-day-2026-09-07'));

       expect(
         within(result.getByTestId('weekly-activity-detail')).getByText(
           'Sin datos de este día',
         ),
       ).toBeOnTheScreen();
       expect(cardChildren()).toStrictEqual(withDetail);

       await fireEvent.press(
         result.getByTestId('weekly-activity-metric-walkCount'),
       );

       expect(
         result.getByTestId('weekly-activity-metric-walkCount').props
           .accessibilityState,
       ).toEqual({ selected: true });
       expect(cardChildren()).toStrictEqual(withDetail);
     });

     it('con comparación: la tendencia entre el selector y el gráfico, sin día seleccionado y con uno', async () => {
       const result = await renderChart(
         makeWeek('2026-09-02', [10, 20, 30, 40, 50, 60, 70]),
         { ...NO_COMPARISON, activeMinutes: 12.5 },
       );
       const cardChildren = () =>
         result
           .getByTestId('weekly-activity-card')
           .children.map((child) =>
             typeof child === 'string' ? child : child.props.testID,
           );

       // #142 R2: the trend only exists with a comparison, and with it the card
       // reaches its longest list of children once a day is selected.
       expect(result.getByTestId('weekly-activity-trend')).toBeOnTheScreen();
       expect(cardChildren()).toStrictEqual([
         'weekly-activity-header',
         'weekly-activity-metric',
         'weekly-activity-trend',
         'weekly-activity-chart-layout',
         'weekly-activity-day-row',
       ]);

       await fireEvent.press(result.getByTestId('weekly-activity-day-2026-09-05'));

       expect(result.getByTestId('weekly-activity-tooltip')).toBeOnTheScreen();
       expect(cardChildren()).toStrictEqual([
         'weekly-activity-header',
         'weekly-activity-metric',
         'weekly-activity-trend',
         'weekly-activity-chart-layout',
         'weekly-activity-day-row',
         'weekly-activity-detail',
       ]);
     });

     it('sin ningún día medido: la cabecera y el mensaje, y nada más', async () => {
       const result = await renderChart(
         makeWeek('2026-09-02', [null, null, null, null, null, null, null]),
       );

       // #142 R2: the empty branch of the card is closed as well.
       expect(result.getByTestId('weekly-activity-empty')).toBeOnTheScreen();
       expect(
         result
           .getByTestId('weekly-activity-card')
           .children.map((child) =>
             typeof child === 'string' ? child : child.props.testID,
           ),
       ).toStrictEqual(['weekly-activity-header', 'weekly-activity-empty']);
     });
   });
   ```

   El test da el blob `5e4c690506b110a099ad88734c569e6f33e9cb69`, con 2272
   líneas y 27 `describe` de primer nivel.
2. En la gráfica, aplica `P2red` (la sonda `cardtail` de #142): añade la línea

   ```tsx
         <View />
   ```

   (6 espacios) justo encima de `    </Card>` (4 espacios;
   `grep -c '^    </Card>$'` da 1), es decir, entre el `      )}` que cierra el
   ternario de `hasMeasuredDay` y ese `    </Card>`.

   La gráfica da el blob `0ac97f3562e39a98a3128047bfb5489f091167c2`.
3. La gráfica da `exit=1`: 3 failed y 56 passed de 59. Los **únicos** rojos son
   los tres `it` de `#142 R2: la lista de hijos de la tarjeta es cerrada, sin ningún nodo de más al final`,
   los tres por `expect(received).toStrictEqual(expected)` y en su primera
   aserción de lista:
   - `› sin comparación: antes y después de medir, en las tres métricas y con un día seleccionado, medido o sin datos, también con la primera métrica`;
   - `› con comparación: la tendencia entre el selector y el gráfico, sin día seleccionado y con uno`;
   - `› sin ningún día medido: la cabecera y el mensaje, y nada más`.

   `#135 R4` sigue verde: usa `toEqual`, y eso es justo lo que este ciclo
   cierra al lado.
4. La suite da `exit=1`: 3 failed y 1622 passed de 1625; 1 suite failed y 85
   passed de 86. Si falla otro test, o uno de estos falla por otra cosa,
   **para**.
5. Commit rojo:

   ```bash
   git add mobile-pet-tracker/src/screens/home/weekly-activity-chart.test.tsx mobile-pet-tracker/src/screens/home/weekly-activity-chart.tsx
   git commit -m "test(mobile): expose a trailing card child with a versioned mutation (R2)"
   ```

### (2) Verde

1. `git checkout HEAD~1 -- mobile-pet-tracker/src/screens/home/weekly-activity-chart.tsx`.
   La gráfica vuelve a `c258abedde92d2be981be8507d3d898f13c612cb`.
2. La gráfica da 59 de 59, `exit=0`.
3. Commit verde:

   ```bash
   git add mobile-pet-tracker/src/screens/home/weekly-activity-chart.tsx
   git commit -m "test(mobile): lock the weekly card children with toStrictEqual (R2)"
   ```

### (3) Refactor

Ninguno. `cardChildren` se repite en los dos primeros `it` y va en línea en el
tercero, como en `#135 R4`. Un helper del fichero sería un símbolo nuevo que
ningún `describe` previo usa, y el candado de un `it` debe leerse solo.

## R3 — Con la primera métrica y un día seleccionado, cada columna conserva su forma (#143)

### (1) Rojo

1. Al final del test, después del `});` que cierra el `describe` de `#142 R2`,
   añade una línea en blanco y este bloque:

   ```tsx
   describe('#143 R3: con la primera métrica y un día seleccionado, cada columna conserva su forma y sus recetas', () => {
     it('la clase de cada columna y el testID y la clase de sus dos hijos, por posición, con un día medido seleccionado y con el día sin datos seleccionado', async () => {
       const result = await renderChart(
         makeWeek('2026-09-02', [10, 20, 30, 40, 50, null, 70]),
       );
       const resting = 'min-h-11 flex-1 items-center justify-end';
       const selected =
         'min-h-11 flex-1 items-center justify-end border-t-2 border-accent-strong';
       const label = [
         'weekly-activity-day-label',
         'text-2xs font-semibold text-muted',
       ];
       const value = 'text-2xs font-semibold text-foreground';
       const dash = 'text-2xs font-normal text-muted';
       const columns = () =>
         result
           .getByTestId('weekly-activity-day-row')
           .children.map((column) =>
             typeof column === 'string'
               ? column
               : [
                   column.props.className,
                   column.children.map((child) =>
                     typeof child === 'string'
                       ? child
                       : [child.props.testID, child.props.className],
                   ),
                 ],
           );

       await fireEvent.press(result.getByTestId('weekly-activity-day-2026-09-05'));

       // #143 R3: the chart opens on the first metric, and a day selected there is
       // the first thing a user does; the column, its label and its value or dash,
       // by position, keep the class they have with any other metric.
       expect(
         result.getByTestId('weekly-activity-metric-activeMinutes').props
           .accessibilityState,
       ).toEqual({ selected: true });
       expect(result.getByTestId('weekly-activity-tooltip')).toBeOnTheScreen();
       expect(columns()).toStrictEqual([
         [resting, [label, ['weekly-activity-value-2026-09-02', value]]],
         [resting, [label, ['weekly-activity-value-2026-09-03', value]]],
         [resting, [label, ['weekly-activity-value-2026-09-04', value]]],
         [selected, [label, ['weekly-activity-value-2026-09-05', value]]],
         [resting, [label, ['weekly-activity-value-2026-09-06', value]]],
         [resting, [label, ['weekly-activity-missing-2026-09-07', dash]]],
         [resting, [label, ['weekly-activity-value-2026-09-08', value]]],
       ]);

       await fireEvent.press(result.getByTestId('weekly-activity-day-2026-09-07'));

       expect(
         within(result.getByTestId('weekly-activity-detail')).getByText(
           'Sin datos de este día',
         ),
       ).toBeOnTheScreen();
       expect(columns()).toStrictEqual([
         [resting, [label, ['weekly-activity-value-2026-09-02', value]]],
         [resting, [label, ['weekly-activity-value-2026-09-03', value]]],
         [resting, [label, ['weekly-activity-value-2026-09-04', value]]],
         [resting, [label, ['weekly-activity-value-2026-09-05', value]]],
         [resting, [label, ['weekly-activity-value-2026-09-06', value]]],
         [selected, [label, ['weekly-activity-missing-2026-09-07', dash]]],
         [resting, [label, ['weekly-activity-value-2026-09-08', value]]],
       ]);
     });
   });
   ```

   El test da el blob `3e0ff4a3ea2acdeac0efe0818fa617ebe72089a2`, con 2341
   líneas y 28 `describe` de primer nivel. Es el blob final.
2. En la gráfica, aplica `P3red` (la sonda `z_labelselfirstmetric` del
   reviewer de #140). La línea de clase de la etiqueta,

   ```tsx
                 className="text-2xs font-semibold text-muted"
   ```

   (14 espacios, justo debajo de `              testID="weekly-activity-day-label"`;
   `grep -c '^              className="text-2xs font-semibold text-muted"$'`
   da 1), pasa a

   ```tsx
                 className={selection !== null && selectedMetricIndex === 0 ? 'text-2xs font-semibold text-foreground' : 'text-2xs font-semibold text-muted'}
   ```

   La gráfica da el blob `6eda3dd1609b2be8d4820ab4d8e39e6f3abdb5c7`.
3. La gráfica da `exit=1`: 1 failed y 59 passed de 60. El **único** rojo es
   `#143 R3: con la primera métrica y un día seleccionado, cada columna conserva su forma y sus recetas › la clase de cada columna y el testID y la clase de sus dos hijos, por posición, con un día medido seleccionado y con el día sin datos seleccionado`,
   por `expect(received).toStrictEqual(expected)`, en su primera aserción de
   lista (la de `2026-09-05`). `#140 R1` y `#140 R2` siguen verdes: no pasan por
   esta combinación.
4. La suite da `exit=1`: 1 failed y 1625 passed de 1626; 1 suite failed y 85
   passed de 86. Si falla otro test, o este falla por otra cosa, **para**.
5. Commit rojo:

   ```bash
   git add mobile-pet-tracker/src/screens/home/weekly-activity-chart.test.tsx mobile-pet-tracker/src/screens/home/weekly-activity-chart.tsx
   git commit -m "test(mobile): expose the first-metric selected label colour with a versioned mutation (R3)"
   ```

### (2) Verde

1. `git checkout HEAD~1 -- mobile-pet-tracker/src/screens/home/weekly-activity-chart.tsx`.
   La gráfica vuelve a `c258abedde92d2be981be8507d3d898f13c612cb`.
2. La gráfica da 60 de 60, `exit=0`.
3. Commit verde:

   ```bash
   git add mobile-pet-tracker/src/screens/home/weekly-activity-chart.tsx
   git commit -m "test(mobile): lock the weekly columns with a day selected on the first metric (R3)"
   ```

### (3) Refactor

Ninguno. `columns` se queda dentro de su `it`. Las siete filas de cada
esperado se quedan escritas una a una: la columna seleccionada es la única
que cambia entre las dos aserciones, y escrita a mano se ve dónde está.

## Sondas

Sobre el árbol final, **una sonda cada vez**:

1. Aplica la mutación de la tabla en la gráfica (en `loose` y `hexbare`, en el
   test; en `h_tilerowtail` y `h_reminderstail`, en `src/screens/home/index.tsx`).
2. Comprueba con `git hash-object` que el fichero mutado da el blob de la tabla.
   Si no coincide, la mutación no es la de la spec: corrígela antes de medir.
3. Corre el comando de la columna «Comando»: `gráfica` es el canónico de la
   gráfica; `6 suites` es el canónico con estas seis rutas detrás de
   `--runTestsByPath`: `src/screens/home/weekly-activity-chart.test.tsx`,
   `src/screens/home/index.test.tsx`, `src/__tests__/design-drift.test.ts`,
   `src/__tests__/consistency-classnames.test.ts`,
   `src/__tests__/legibility-classnames.test.ts` y
   `src/__tests__/ui-language.test.ts`; `-t` es el de la gráfica con
   `-t "#14[13] R"` detrás (solo `z_labelnested`: la corrida entera agota el
   heap de jest en `#68 R3`, ver [[requirements]] §Fuera de alcance).
4. Anota `exit`, las cuentas, cada `it` rojo, **la primera línea de su error** y
   en qué aserción falla: `expect(received).<matcher>` es un rojo **por
   aserción**, y `Unable to find an element with testID: …` es un rojo **por
   consulta**. La aserción se lee en el marco de código del log.
5. Restaura con `git checkout HEAD -- mobile-pet-tracker/src/screens/home/weekly-activity-chart.tsx mobile-pet-tracker/src/screens/home/weekly-activity-chart.test.tsx mobile-pet-tracker/src/screens/home/index.tsx`
   (con `HEAD`: sin él, un fichero que hubieras añadido al índice conservaría
   la mutación).
6. `git diff --exit-code -- mobile-pet-tracker/src` y
   `git diff --cached --exit-code -- mobile-pet-tracker/src` dan 0 los dos.

**Nada de esto se commitea.** La tabla medida va al reporte, con la columna
«medido» rellena por ti.

Convenciones de la tabla:

- «R1», «R2.1», «R2.2», «R2.3» y «R3» son los `it` de `#141 R1`, de
  `#142 R2` (en el orden del fichero: sin comparación, con comparación, sin
  ningún día medido) y de `#143 R3`. «aN» es su N-ésima aserción con
  `toStrictEqual`, en el orden de las tablas de estados de [[requirements]]
  §Requisitos. Las guardas no cuentan.
- «La línea del valor» es `                  metricValue(day, selectedMetric),`
  (18 espacios). «La línea del valor con `X`» es esa línea con `day`
  sustituido por `X`: `                  metricValue(X, selectedMetric),`.
- «Una línea al final de la tarjeta» es una línea con 6 espacios de sangría
  justo encima de `    </Card>`, como `P2red`.
- «La línea de clase de la etiqueta» es
  `              className="text-2xs font-semibold text-muted"` (14 espacios),
  justo debajo de `              testID="weekly-activity-day-label"`. «La línea
  de clase del valor» es
  `                className="text-2xs font-semibold text-foreground"`
  (16 espacios), justo debajo de
  ``                testID={`weekly-activity-value-${day.date}`}``. «La línea de
  clase de la raya» es `                className="text-2xs font-normal text-muted"`
  (16 espacios), justo debajo de
  ``                testID={`weekly-activity-missing-${day.date}`}``. Las tres
  dan 1 con `grep -c`.
- «El cierre de la columna» es el hueco entre el `            )}` que cierra el
  ternario de `day.source` y el `          </Pressable>` de justo encima de
  `        ))}` (`grep -c '^        ))}$'` da 1).
- «Hoy» es la misma mutación sobre la base (55 tests), para que el `reviewer`
  vea qué hueco cierra cada candado. «(6 suites)» quiere decir que el
  spec_author lo midió también con las seis: 384 tests en la base y 389 al
  final. Tú corres lo que diga «Comando».

| Sonda | Mutación | Blob | Comando | Hoy (55) | Exigido tras este ciclo (60) |
|---|---|---|---|---|---|
| `valuecross` | la línea del valor con `dataIndex === 6 ? days[0] : day` (es `P1red`) | `9f3c5bfd` | 6 suites | verde, 384/384 | rojo 1 de 389: R1, por `toStrictEqual`, a1 |
| `valuecrossmid` | la línea del valor con `selectedMetricIndex === 2 && dataIndex === 1 ? days[2] : day` | `7741d69f` | gráfica | verde | rojo 1: R1, por `toStrictEqual`, a4 |
| `valuecrosssel` | la línea del valor con `selection?.dataIndex === dataIndex ? days[0] : day` | `68fccd05` | gráfica | verde | rojo 1: R1, por `toStrictEqual`, a5 |
| `valuecrossdistsel` | la línea del valor con `selection !== null && selectedMetricIndex === 1 && dataIndex === 6 ? days[0] : day` | `73025937` | gráfica | verde | rojo 1: R1, por `toStrictEqual`, a7 |
| `valuecrossfirstsel` | la línea del valor con `selection !== null && selectedMetricIndex === 0 && dataIndex === 6 ? days[0] : day` | `497fe887` | gráfica | verde | rojo 1: R1, por `toStrictEqual`, a8 |
| `valuecrosstrend` | la línea del valor con `trend !== null && dataIndex === 6 ? days[0] : day` | `328d6c59` | 6 suites | verde | **verde**, 389/389: (D) |
| `valuecrossnomissing` | la línea del valor con `days.every((entry) => entry.source !== 'missing') && dataIndex === 6 ? days[0] : day` | `0484f58d` | 6 suites | verde | **verde**, 389/389: (D) |
| `valuenested` | las cuatro líneas de `                {formatMetricValue(` a `                )}` pasan a ir entre `                <Text>` y `                </Text>`, con 2 espacios más de sangría cada una | `fc8c1142` | gráfica | verde | rojo 1: R1, por `toStrictEqual`, a1 (`'[object Object]'`) |
| `labelcross` | `              {weekdayLabel(day.date, locale, 'short')}` pasa a `              {weekdayLabel(dataIndex === 6 ? days[0].date : day.date, locale, 'short')}` | `54f60928` | gráfica | rojo 1: `R3: la letra del eje sale de la fecha, no del índice › usa el día real de cada fecha en los dos idiomas`, por `toEqual` | rojo 2: ese, igual, y R1, por `toStrictEqual`, a1 |
| `dashtext` | la línea `                —` (16 espacios; `grep -c '^                —$'` da 1) pasa a `                -` | `2e0bb8f2` | gráfica | rojo 1: `R5: un día sin dato no es una barra de altura cero › separa el guion del día ausente y el valor cero medido`, por `toHaveTextContent` | rojo 2: ese, igual, y R1, por `toStrictEqual`, a1 |
| `z_labelnested` | `              {weekdayLabel(day.date, locale, 'short')}` pasa a `              <Text className="text-foreground">{weekdayLabel(day.date, locale, 'short')}</Text>` | `93f3e415` | `-t` | no aplica (sin `-t`, la gráfica agota el heap en `#68 R3`) | rojo 1: R1, por `toStrictEqual`, a1; R3 verde: (D) |
| `rowtail` | la línea `        <View />` justo debajo de `        ))}` (8 espacios) | `333d4e0c` | gráfica | rojo 2: `#140 R1` y `#140 R2`, por `toStrictEqual`, a1 | rojo 4: esos, igual, R1 (a1) y R3 (a1), por `toStrictEqual` |
| `cardtail` | una línea al final de la tarjeta: `      <View />` (es `P2red`) | `0ac97f35` | 6 suites | verde, 384/384 | rojo 3 de 389: R2.1, R2.2 y R2.3, por `toStrictEqual`, a1 |
| `cardtailunmeasured` | una línea al final de la tarjeta: `      {chartWidth > 0 ? null : <View />}` | `f56344a0` | gráfica | verde | rojo 2: R2.1 (a1) y R2.3 (a1), por `toStrictEqual` |
| `cardtaildist` | … `      {selectedMetricIndex === 1 ? <View /> : null}` | `a9cb1d46` | gráfica | verde | rojo 1: R2.1, por `toStrictEqual`, a3 |
| `cardtailsel` | … `      {selectedDay ? <View /> : null}` | `0a2ac3ca` | gráfica | verde | rojo 2: R2.1 (a4) y R2.2 (a2), por `toStrictEqual` |
| `cardtailfirstsel` | … `      {selectedDay && selectedMetricIndex === 0 ? <View /> : null}` | `eafa0a44` | gráfica | verde | rojo 2: R2.1 (a5) y R2.2 (a2), por `toStrictEqual` |
| `cardtailwalks` | … `      {selectedMetricIndex === 2 ? <View /> : null}` | `42546360` | gráfica | verde | rojo 1: R2.1, por `toStrictEqual`, a7 |
| `cardtailtrend` | … `      {trend !== null ? <View /> : null}` | `62e5e054` | gráfica | verde | rojo 1: R2.2, por `toStrictEqual`, a1 |
| `cardtailnomissing` | … `      {days.every((entry) => entry.source !== 'missing') ? <View /> : null}` | `8eaaa7be` | gráfica | verde | rojo 1: R2.2, por `toStrictEqual`, a1 |
| `cardtailempty` | … `      {hasMeasuredDay ? null : <View />}` | `4ef6f4da` | gráfica | verde | rojo 1: R2.3, por `toStrictEqual`, a1 |
| `cardtailen` | … `      {locale === 'en' ? <View /> : null}` | `684bc56d` | 6 suites | verde | **verde**, 389/389: (D) |
| `z_labelselfirstmetric` | la línea de clase de la etiqueta pasa a `              className={selection !== null && selectedMetricIndex === 0 ? 'text-2xs font-semibold text-foreground' : 'text-2xs font-semibold text-muted'}` (es `P3red`) | `6eda3dd1` | 6 suites | verde, 384/384 | rojo 1 de 389: R3, por `toStrictEqual`, a1 |
| `z_labelselmissingfirst` | … pasa a `              className={selectedDay?.source === 'missing' && selectedMetricIndex === 0 ? 'text-2xs font-semibold text-foreground' : 'text-2xs font-semibold text-muted'}` | `46c5bd8c` | gráfica | verde | rojo 1: R3, por `toStrictEqual`, a2 |
| `z_labelselwalks` | … pasa a `              className={selection !== null && selectedMetricIndex === 2 ? 'text-2xs font-semibold text-foreground' : 'text-2xs font-semibold text-muted'}` | `d3694f11` | 6 suites | verde | **verde**, 389/389: (D) |
| `z_valueselfirstmetric` | la línea de clase del valor pasa a `                className={selection !== null && selectedMetricIndex === 0 ? 'text-2xs font-semibold text-muted' : 'text-2xs font-semibold text-foreground'}` | `d9a8fe6a` | 6 suites | verde, 384/384 | rojo 1 de 389: R3, por `toStrictEqual`, a1 |
| `z_dashselfirstmetric` | la línea de clase de la raya pasa a `                className={selection !== null && selectedMetricIndex === 0 ? 'text-2xs font-normal text-foreground' : 'text-2xs font-normal text-muted'}` | `e48b0d18` | 6 suites | verde, 384/384 | rojo 1 de 389: R3, por `toStrictEqual`, a1 |
| `z_colselfirstmetric` | la línea `              selection?.dataIndex === dataIndex` (14 espacios, la de justo encima de `                ? 'min-h-11 flex-1 items-center justify-end border-t-2 border-accent-strong'`) pasa a `              selection?.dataIndex === dataIndex && selectedMetricIndex !== 0` | `ea54258d` | 6 suites | verde, 384/384 | rojo 1 de 389: R3, por `toStrictEqual`, a1 |
| `z_childselfirstmetric` | en el cierre de la columna, la línea `            {selection?.dataIndex === dataIndex && selectedMetricIndex === 0 ? <View className="h-1 w-1" /> : null}` | `098f89f4` | 6 suites | verde, 384/384 | rojo 2 de 389: R1 (a8) y R3 (a1), por `toStrictEqual` |
| `loose` | **en el test**: dentro del `describe` de `#142 R2`, cada `toStrictEqual` pasa a `toEqual` (las diez aserciones y la mención del comentario); la gráfica sin tocar | test `70a87d0e` | gráfica | no aplica | verde, 60/60 |
| `loose` + `cardtail` | la mutación de `loose` en el test y la de `cardtail` en la gráfica | test `70a87d0e`, gráfica `0ac97f35` | gráfica | no aplica | **verde**, 60/60: por eso R2 usa `toStrictEqual` |
| `hexbare` | **en el test**: el comentario `    // #141 R1: the text of each column by position, written out in the test and` pasa a `    // #141: the text of each column by position, written out in the test and` | test `e80d30ba` | `bunx jest --runTestsByPath src/__tests__/design-drift.test.ts` | no aplica | `exit=1`, 1 failed de 55: `#68 R18: la actividad semanal no mete drift de estilo › keeps arbitrary text, hex colors, and StyleSheet out of feature sources` |
| `h_tilerowtail` | **en `src/screens/home/index.tsx`** (base `0d439ebc`): la línea `              <View />` justo encima del `            </View>` que cierra `quick-actions-row`, es decir, debajo del `              )}` que cierra `{QUICK_ACTIONS.map(` | `e63d7fdf` | `bunx jest --runTestsByPath src/screens/home/index.test.tsx` | rojo 3 de 169: `#71 R1: la Home dibuja la rejilla de accesos rápidos › dibuja el rótulo y los tres tiles en orden` y dos de `#81 R6` | igual: (N) |
| `h_reminderstail` | **en `src/screens/home/index.tsx`**: la línea `              <View />` justo debajo de `              })}` (`grep -c '^              })}$'` da 1), dentro de `reminders-section-body` | `29ff7910` | `bunx jest --runTestsByPath src/screens/home/index.test.tsx` | rojo 11 de 169: en `#70 R9`, `#85 R5` y `#85 R9` | igual: (N) |

## R4 — Cierre

1. Suite completa, sin pipe: 86 suites y 1626 tests, `exit=0`, o la base que
   mediste en §Antes de tocar nada más 5 tests y 0 suites. La gráfica, 60 de 60.
   Declara el delta en el reporte.
2. `test ! -e .expo/types/router.d.ts && bunx tsc --noEmit > /tmp/141_tsc.log 2>&1; echo "exit=$?"`
   da `exit=0`.
3. `bunx eslint src/screens/home/weekly-activity-chart.tsx src/screens/home/weekly-activity-chart.test.tsx > /tmp/141_lint.log 2>&1; echo "exit=$?"`
   da `exit=0`.
4. Las cifras de candado. En la gráfica, igual que en la base:
   - `grep -c "style={CONTINUOUS_CORNER}"` da 1;
   - `grep -c "style={TABULAR_NUMS}"` da 4;
   - `grep -c 'accessibilityRole="radiogroup"'` da 1;
   - `grep -c "Platform"` da 0.

   En los dos ficheros,
   `grep -ciE "stylesheet|text-\[10px\]" src/screens/home/weekly-activity-chart.tsx src/screens/home/weekly-activity-chart.test.tsx`
   da 0.

   En el test, de la base al final:
   - `grep -c "use-api"` da 1 y 1 (la línea que `#87 R19` espera como única
     huella); `grep -c "useApi"` da 0 y 0; `grep -c "CHART_PAD"` da 10 y 10;
   - `grep -c "^describe("` pasa de 25 a 28; `grep -c "^describe('#141 R1"`,
     `grep -c "^describe('#142 R2"` y `grep -c "^describe('#143 R3"`, de 0 a 1
     cada uno;
   - `grep -c "#141"` y `grep -c "#141 R1"` dan 2 los dos; `grep -c "#142"` y
     `grep -c "#142 R2"`, 4 los dos; `grep -c "#143"` y `grep -c "#143 R3"`, 2
     los dos: ningún id suelto;
   - `grep -c "toStrictEqual"` pasa de 12 a 35 (22 aserciones nuevas y la
     mención del comentario de R2);
   - `grep -c "toEqual({ selected: true })"` pasa de 9 a 19;
   - `grep -c "weekly-activity-day-row"` pasa de 10 a 16;
     `grep -c "weekly-activity-card"`, de 10 a 13;
     `grep -c "weekly-activity-day-label"`, de 3 a 4;
   - `grep -c "Sin datos de este día"` pasa de 4 a 7, y `grep -c "within("`,
     de 12 a 15.
5. Desde la raíz del repo:
   - `git diff --stat origin/main...HEAD -- mobile-pet-tracker/` lista **solo**
     el test, con 350 líneas añadidas y 0 borradas;
   - `git diff --exit-code origin/main...HEAD -- mobile-pet-tracker/src/screens/home/weekly-activity-chart.tsx mobile-pet-tracker/package.json mobile-pet-tracker/bun.lock mobile-pet-tracker/src/i18n/catalog.ts`
     da 0;
   - `git show origin/main:mobile-pet-tracker/src/screens/home/weekly-activity-chart.test.tsx | cmp -n "$(git show origin/main:mobile-pet-tracker/src/screens/home/weekly-activity-chart.test.tsx | wc -c)" - mobile-pet-tracker/src/screens/home/weekly-activity-chart.test.tsx; echo "exit=$?"`
     da `exit=0`: el test de base es un prefijo exacto del final (R4.3).
6. Blobs finales:

   | Ruta | Blob |
   |---|---|
   | `src/screens/home/weekly-activity-chart.tsx` | `c258abedde92d2be981be8507d3d898f13c612cb` (el de base) |
   | `src/screens/home/weekly-activity-chart.test.tsx` | `3e0ff4a3ea2acdeac0efe0818fa617ebe72089a2` |

7. Escribe `progress/impl_mobile-weekly-day-column-value-cross-lock.md` con:
   - la base medida y el delta;
   - las salidas de cada rojo y cada verde (cuentas, `exit` y los `it` rojos con
     su matcher);
   - la tabla de §Sondas, con la columna «medido»;
   - los blobs y los números de este cierre.

   Rellena los hashes en [[traceability]]. La fila de R4 cita el hash del
   **verde de R3**, que es el último commit de código, no el de este commit.
   Commitea solo esos dos ficheros:

   ```bash
   git add progress/impl_mobile-weekly-day-column-value-cross-lock.md specs/mobile-weekly-day-column-value-cross-lock/traceability.md
   git commit -m "docs(mobile): record the weekly value cross, card and first-metric evidence (R1,R2,R3,R4)"
   ```

   No rebasees después: los hashes de la tabla dejarían de valer.

## Lo que NO hay que tocar

- La gráfica, salvo en los tres commits rojos, y siempre revertida en el verde
  siguiente.
- Los `describe` previos del test (#68, #74, #130, #131, #132, #135 y #140), y
  sus helpers y mocks (`renderChart`, `renderChartWithProps`, `makeWeek`,
  `makeDay`, `NO_COMPARISON`, `latestBarChartProps`, `mergeObjectStyles`,
  `mockBarChart`, `mockTheme` y el resto). Ni los imports del test. En
  particular, no cambies `toEqual` por `toStrictEqual` en `#135 R4`, ni añadas
  estados a `#140 R1` ni a `#140 R2`.
- `src/screens/home/index.tsx` y `src/screens/home/index.test.tsx`, salvo la
  mutación temporal de las dos sondas `h_*`, que no se commitea.
- `src/__tests__/design-drift.test.ts`, `consistency-classnames.test.ts`,
  `legibility-classnames.test.ts` y `ui-language.test.ts`.
- `src/i18n/catalog.ts`, `src/providers/__tests__/language-provider.test.tsx` y
  `src/__tests__/ui-copy-table.ts`: no hay copy nueva.
- `package.json` y `bun.lock`: no hay dependencia nueva.
- `feature_list.json`, `progress/current.md`, `progress/history.md` y
  `STATUS.md`: son del `leader`.
- Los punteros `specs/mobile-weekly-card-children-strict-lock/requirements.md`
  y `specs/mobile-weekly-day-selected-first-metric-lock/requirements.md`.

---
feature: "mobile-weekly-day-row-layout-lock"
status: approved         # draft | spec_ready | approved
tags: [spec, mobile, test, deuda]
---

# Tareas — [[mobile-weekly-day-row-layout-lock]] (#131 y #135)

> Orden TDD por requisito: (1) test rojo, (2) implementación mínima,
> (3) refactor. R1 a R4 se escriben sobre código que ya cumple, así que su rojo
> es una **mutación de producción versionada** en el commit rojo, que el verde
> revierte con `git checkout HEAD~1 --` (C4, vía **b**). Nunca un
> `ReferenceError` ni un doble de test mutado.
>
> Cada requisito crea su sujeto antes de aseverarlo: la fila, sus siete
> columnas, la tarjeta y todos sus hijos ya existen en la base, y cada bloque
> usa solo helpers que ya existen en el test. Ningún requisito depende del
> bloque de otro; el orden R1, R2, R3, R4 es el orden en el fichero.
>
> Las rutas son relativas a `mobile-pet-tracker/` salvo que empiecen por
> `docs/`, `specs/` o `progress/`, o se diga «desde la raíz». Los números de
> línea **no son anclas**: todo se localiza por contenido, con el `grep` que se
> cita, y cada ancla da 1 en la base. «La gráfica» es
> `src/screens/home/weekly-activity-chart.tsx` y «el test» es
> `src/screens/home/weekly-activity-chart.test.tsx`. Ninguna ruta de esta
> feature lleva paréntesis.
>
> **Dos entradas, una branch, un reporte.** #135 (R4) no tiene branch, reporte
> ni trazabilidad propios: todo va con #131.

## Antes de tocar nada

1. `git branch --show-current` da `feature/131-mobile-weekly-day-row-layout-lock`.
   Si no, **para**.
2. Lee la casilla de [[requirements]] §Aprobación. Si no está marcada, **para**.
3. `cd mobile-pet-tracker && test ! -e .expo/types/router.d.ts; echo "exit=$?"`
   da `exit=0`. Si da 1, **para** y avisa al humano: el fichero está gitignorado
   y rompe `tsc` con rutas fantasma. No lo borres tú, porque tu sandbox lo
   deniega (#121).
4. **No cargues ninguna skill de expo.** Esta feature no cambia UI: todo lo que
   necesitas está escrito aquí. Todo se corre con `bun` y `bunx`, nunca con
   `npm` ni `npx`. No instales nada. No corras `./init.sh` ni los e2e.
5. Blobs de base, con `git hash-object <ruta>`:

   | Ruta | Blob |
   |---|---|
   | `src/screens/home/weekly-activity-chart.tsx` | `c258abedde92d2be981be8507d3d898f13c612cb` |
   | `src/screens/home/weekly-activity-chart.test.tsx` | `d7f938da18fc038d309d75505e3582dd4ae4b0be` |

   Si alguno no coincide, **para**: la base se movió, y los blobs y las sondas de
   esta spec ya no valen.
6. Mide la base con los dos comandos canónicos, **sin pipe**:

   ```bash
   bunx jest --runTestsByPath src/screens/home/weekly-activity-chart.test.tsx > /tmp/131_chart.log 2>&1; echo "exit=$?"
   bunx jest > /tmp/131_full.log 2>&1; echo "exit=$?"
   grep -E "^(Tests|Test Suites|Snapshots):" /tmp/131_chart.log /tmp/131_full.log
   ```

   Esperado: la gráfica da 47 passed de 47, `exit=0`. La suite da 86 passed de
   86 suites y 1611 passed de 1611 tests, `exit=0`. **Esa cifra de la suite la
   relató el `leader` y el spec_author no la midió**: la tuya manda. Si la suite
   da otra cifra con `exit=0` (por ejemplo, 86 / 1613 porque #138 mergeó antes y
   la branch lo incorpora), **anota la medida** y úsala como base: el delta
   exigido es +6 tests y +0 suites sobre lo medido, y los «N failed de M» de los
   rojos se desplazan igual. Nunca pongas `| tail` ni `| grep` detrás de
   `jest`, porque el `exit` sería el del último comando. Los bloques
   `● Console` del log son ruido y no cuentan como fallo. Los rojos se cuentan
   por la línea `Tests:`.
7. **Reglas de literales en los bloques nuevos**, comentarios incluidos:
   - un `#` solo puede ir seguido de dígitos, un espacio y `R<n>` (`#131 R1`,
     `#135 R4`), por `#68 R18` (`src/__tests__/design-drift.test.ts`). Nada de
     `#131` ni `#135` sueltos: medido, rompe `#68 R18` (sonda `hexbare`);
   - ni `StyleSheet` ni `text-[10px]`, en ningún caso;
   - ni `use-api` ni `useApi` (`#87 R19`);
   - ni `40.4`, ni `14`, ni `CHART_PAD_LEFT` o `CHART_PAD_RIGHT`: el test ya los
     importa para otros `describe`, pero R2 no puede usarlos (criterio 2 de
     #131). `grep -c "CHART_PAD" src/screens/home/weekly-activity-chart.test.tsx`
     da 10 antes y después.
8. **Pega los bloques tal cual, sin prettier.** El test no está formateado con
   prettier y `mobile-pet-tracker/` no tiene configuración de prettier:
   formatearlo cambiaría líneas de la base. Aquí los bloques llevan 3 espacios
   de sangría por estar dentro de una lista; en el test, `describe(` va en la
   columna 0. El blob que se cita tras cada bloque te dice si lo pegaste bien.
   No añadas ningún import: `fireEvent`, `renderChart`, `renderChartWithProps`,
   `makeWeek`, `NO_COMPARISON`, `latestBarChartProps` y `mergeObjectStyles` ya
   están en el test.

## R1 (#131) — La fila es una fila

### (1) Rojo

1. Al final del test, después del `});` que cierra
   `describe('#132 R1: la tarjeta es la raíz host de lo que pinta la gráfica'`
   (es el último `describe` del fichero: `grep -n "^describe(" src/screens/home/weekly-activity-chart.test.tsx | tail -1`),
   añade una línea en blanco y este bloque:

   ```tsx
   describe('#131 R1: la fila de las siete columnas es una fila', () => {
     it('la fila solo lleva flex-row antes y después de medir, con otra métrica y con un día seleccionado', async () => {
       const result = await renderChartWithProps(
         {
           days: makeWeek('2026-09-02', [10, 20, 30, 40, 50, 60, 70]),
           weekComparison: NO_COMPARISON,
         },
         'es',
         false,
       );
       const rowClassName = () =>
         result.getByTestId('weekly-activity-day-row').props.className;

       // #131 R1: the exact class, so flex-col, flex-row-reverse or any added class
       // turns the lock red, in each state the chart reaches inside this test.
       expect(rowClassName()).toBe('flex-row');

       const layout = result.getByTestId('weekly-activity-chart-layout');

       await fireEvent(layout, 'layout', {
         nativeEvent: {
           layout: { width: 295, height: 0, x: 0, y: 0 },
         },
       });

       expect(result.getByTestId('weekly-activity-bar-chart')).toBeOnTheScreen();
       expect(rowClassName()).toBe('flex-row');

       await fireEvent.press(
         result.getByTestId('weekly-activity-metric-distanceM'),
       );

       expect(
         result.getByTestId('weekly-activity-metric-distanceM').props
           .accessibilityState,
       ).toEqual({ selected: true });
       expect(rowClassName()).toBe('flex-row');

       await fireEvent.press(result.getByTestId('weekly-activity-day-2026-09-05'));

       expect(result.getByTestId('weekly-activity-tooltip')).toBeOnTheScreen();
       expect(rowClassName()).toBe('flex-row');
     });
   });
   ```

   El test da el blob `3cc1c7d8e7197a1cd72b99f152e549ba70e13530`. El fichero
   acaba en `});` y un salto de línea, sin línea en blanco final.
2. **La mutación `P1red`**, en la gráfica: la línea `        className="flex-row"`
   que va justo debajo de `        testID="weekly-activity-day-row"` (8 espacios;
   `grep -c '^        testID="weekly-activity-day-row"$'` da 1) pasa a
   `        className="flex-col"`, con la misma sangría.

   La gráfica da el blob `99ec492be5163fe00494ebc247a84535b68cbb66`.
3. La gráfica da `exit=1`: 1 failed y 47 passed de 48. El **único** rojo es
   `#131 R1: la fila de las siete columnas es una fila › la fila solo lleva flex-row antes y después de medir, con otra métrica y con un día seleccionado`,
   por `expect(received).toBe(expected)`.
4. La suite da `exit=1`: 1 failed y 1611 passed de 1612; 1 suite failed y 85
   passed de 86. El único rojo es el mismo. Si falla otro test, o este falla por
   otra cosa, **para**.
5. Commit rojo, con los dos ficheros (desde la raíz):

   ```bash
   git add mobile-pet-tracker/src/screens/home/weekly-activity-chart.test.tsx mobile-pet-tracker/src/screens/home/weekly-activity-chart.tsx
   git commit -m "test(mobile): expose the weekly day row direction with a versioned mutation (R1)"
   ```

### (2) Verde

1. `git checkout HEAD~1 -- mobile-pet-tracker/src/screens/home/weekly-activity-chart.tsx`.
   La gráfica vuelve a `c258abedde92d2be981be8507d3d898f13c612cb`.
2. La gráfica da 48 de 48, `exit=0`.
3. Commit verde, solo con la gráfica:

   ```bash
   git add mobile-pet-tracker/src/screens/home/weekly-activity-chart.tsx
   git commit -m "test(mobile): lock the weekly day row as a single flex-row (R1)"
   ```

### (3) Refactor

Ninguno. `rowClassName` se queda dentro de su `it`.

## R2 (#131) — La fila deja a cada lado el hueco del gráfico

### (1) Rojo

1. Al final del test, después del `});` que cierra el `describe` de `#131 R1`,
   añade una línea en blanco y este bloque:

   ```tsx
   describe('#131 R2: la fila deja a cada lado el mismo hueco que el gráfico', () => {
     it('el padding de la fila son los dos huecos de la línea de media, también con otra métrica y con un día seleccionado', async () => {
       const result = await renderChart(
         makeWeek('2026-09-02', [10, 20, 30, 40, 50, 60, 70]),
       );
       const expectRowOnPlotEdges = () => {
         const average = result.getByTestId('weekly-activity-average').props;

         // #131 R2: the chart draws the average line from the left edge of the plot
         // to its right edge, so the row pads by exactly those two gaps and by
         // nothing else. No literal from the chart and no imported constant.
         expect(
           mergeObjectStyles(
             result.getByTestId('weekly-activity-day-row').props.style,
           ),
         ).toEqual({
           paddingLeft: average.x1,
           paddingRight: (latestBarChartProps().width as number) - average.x2,
         });
       };

       expectRowOnPlotEdges();

       await fireEvent.press(
         result.getByTestId('weekly-activity-metric-distanceM'),
       );

       expect(
         result.getByTestId('weekly-activity-metric-distanceM').props
           .accessibilityState,
       ).toEqual({ selected: true });
       expectRowOnPlotEdges();

       await fireEvent.press(result.getByTestId('weekly-activity-day-2026-09-05'));

       expect(result.getByTestId('weekly-activity-tooltip')).toBeOnTheScreen();
       expectRowOnPlotEdges();
     });
   });
   ```

   El test da el blob `38e49d89bfeea8d95a70e1b6fc0e7db0808e9a34`. El esperado
   se lee del árbol pintado: `x1` y `x2` de `weekly-activity-average` y el
   `width` de la última llamada al `BarChart` mockeado. No lo cambies por
   literales ni por `CHART_PAD_*`.
2. **La mutación `P2red`**, en la gráfica: la línea
   `          paddingLeft: CHART_PAD_LEFT,` (10 espacios;
   `grep -c '^          paddingLeft: CHART_PAD_LEFT,$'` da 1) pasa a
   `          paddingLeft: 0,`.

   La gráfica da el blob `9cb811796c2424dd25296505a589950d16bf0436`.
3. La gráfica da `exit=1`: 1 failed y 48 passed de 49. El **único** rojo es
   `#131 R2: la fila deja a cada lado el mismo hueco que el gráfico › el padding de la fila son los dos huecos de la línea de media, también con otra métrica y con un día seleccionado`,
   por `expect(received).toEqual(expected)`. R1 sigue verde: la clase no cambia.
4. La suite da `exit=1`: 1 failed y 1612 passed de 1613; 1 suite failed y 85
   passed de 86. Si falla otro test, **para**.
5. Commit rojo:

   ```bash
   git add mobile-pet-tracker/src/screens/home/weekly-activity-chart.test.tsx mobile-pet-tracker/src/screens/home/weekly-activity-chart.tsx
   git commit -m "test(mobile): expose the weekly day row padding with a versioned mutation (R2)"
   ```

### (2) Verde

1. `git checkout HEAD~1 -- mobile-pet-tracker/src/screens/home/weekly-activity-chart.tsx`.
   La gráfica vuelve a `c258abedde92d2be981be8507d3d898f13c612cb`.
2. La gráfica da 49 de 49, `exit=0`.
3. Commit verde:

   ```bash
   git add mobile-pet-tracker/src/screens/home/weekly-activity-chart.tsx
   git commit -m "test(mobile): lock the weekly day row padding to the average line ends (R2)"
   ```

### (3) Refactor

Ninguno. `expectRowOnPlotEdges` se queda dentro de su `it`.

## R3 (#131) — Cada columna reparte la fila a partes iguales

### (1) Rojo

1. Al final del test, después del `});` que cierra el `describe` de `#131 R2`,
   añade una línea en blanco y este bloque:

   ```tsx
   describe('#131 R3: cada columna reparte la fila a partes iguales', () => {
     it('las siete columnas llevan flex-1 y centran su contenido antes y después de medir, con otra métrica y con un día seleccionado', async () => {
       const result = await renderChartWithProps(
         {
           days: makeWeek('2026-09-02', [10, 20, 30, 40, 50, 60, 70]),
           weekComparison: NO_COMPARISON,
         },
         'es',
         false,
       );
       const resting = 'min-h-11 flex-1 items-center justify-end';
       const selected =
         'min-h-11 flex-1 items-center justify-end border-t-2 border-accent-strong';
       const allResting = [
         resting,
         resting,
         resting,
         resting,
         resting,
         resting,
         resting,
       ];
       const columnClassNames = () =>
         result
           .getByTestId('weekly-activity-day-row')
           .children.map((column) =>
             typeof column === 'string' ? column : column.props.className,
           );

       // #131 R3: the exact class of each column by position, so a column without
       // flex-1 or without its centring, selected or not, turns the lock red.
       expect(columnClassNames()).toEqual(allResting);

       const layout = result.getByTestId('weekly-activity-chart-layout');

       await fireEvent(layout, 'layout', {
         nativeEvent: {
           layout: { width: 295, height: 0, x: 0, y: 0 },
         },
       });

       expect(result.getByTestId('weekly-activity-bar-chart')).toBeOnTheScreen();
       expect(columnClassNames()).toEqual(allResting);

       await fireEvent.press(
         result.getByTestId('weekly-activity-metric-distanceM'),
       );

       expect(
         result.getByTestId('weekly-activity-metric-distanceM').props
           .accessibilityState,
       ).toEqual({ selected: true });
       expect(columnClassNames()).toEqual(allResting);

       await fireEvent.press(result.getByTestId('weekly-activity-day-2026-09-05'));

       expect(result.getByTestId('weekly-activity-tooltip')).toBeOnTheScreen();
       expect(columnClassNames()).toEqual([
         resting,
         resting,
         resting,
         selected,
         resting,
         resting,
         resting,
       ]);
     });
   });
   ```

   El test da el blob `6cf0706d4ecf5a4632ff302fedce963f543a3962`.
2. **La mutación `P3red`**, en la gráfica: la línea
   `                : 'min-h-11 flex-1 items-center justify-end'` (16 espacios;
   `grep -c ": 'min-h-11 flex-1 items-center justify-end'$"` da 1), que es la
   rama de reposo del `className` de la columna, pasa a
   `                : 'min-h-11 items-center justify-end'`.

   La gráfica da el blob `9668ac80f4ffc3c857546fa1c56e778042ddae05`.
3. La gráfica da `exit=1`: 1 failed y 49 passed de 50. El **único** rojo es
   `#131 R3: cada columna reparte la fila a partes iguales › las siete columnas llevan flex-1 y centran su contenido antes y después de medir, con otra métrica y con un día seleccionado`,
   por `expect(received).toEqual(expected)`. R1, R2 y `#68 R9` (que mira
   `min-h-11` con `toContain`) siguen verdes.
4. La suite da `exit=1`: 1 failed y 1613 passed de 1614; 1 suite failed y 85
   passed de 86. Si falla otro test, **para**.
5. Commit rojo:

   ```bash
   git add mobile-pet-tracker/src/screens/home/weekly-activity-chart.test.tsx mobile-pet-tracker/src/screens/home/weekly-activity-chart.tsx
   git commit -m "test(mobile): expose the weekly day column share with a versioned mutation (R3)"
   ```

### (2) Verde

1. `git checkout HEAD~1 -- mobile-pet-tracker/src/screens/home/weekly-activity-chart.tsx`.
   La gráfica vuelve a `c258abedde92d2be981be8507d3d898f13c612cb`.
2. La gráfica da 50 de 50, `exit=0`.
3. Commit verde:

   ```bash
   git add mobile-pet-tracker/src/screens/home/weekly-activity-chart.tsx
   git commit -m "test(mobile): lock each weekly day column to an equal share of the row (R3)"
   ```

### (3) Refactor

Ninguno. Las siete clases se quedan escritas una a una: la cardinalidad es parte
del candado, y generarla (`Array(7).fill`) la escondería.

## R4 (#135) — Entre la tarjeta y cada uno de sus hijos no hay otro nodo

### (1) Rojo

1. Al final del test, después del `});` que cierra el `describe` de `#131 R3`,
   añade una línea en blanco y este bloque:

   ```tsx
   describe('#135 R4: entre la tarjeta y cada uno de sus hijos no hay otro nodo', () => {
     it('sin comparación: cabecera, selector, gráfico y fila antes y después de medir y con otra métrica, y el detalle al final con un día seleccionado', async () => {
       const result = await renderChartWithProps(
         {
           days: makeWeek('2026-09-02', [10, 20, 30, 40, 50, 60, 70]),
           weekComparison: NO_COMPARISON,
         },
         'es',
         false,
       );
       const withoutTrend = [
         'weekly-activity-header',
         'weekly-activity-metric',
         'weekly-activity-chart-layout',
         'weekly-activity-day-row',
       ];
       const cardChildren = () =>
         result
           .getByTestId('weekly-activity-card')
           .children.map((child) =>
             typeof child === 'string' ? child : child.props.testID,
           );

       // #135 R4: a wrapper around the metric selector, or around any other child
       // of the card, accessible or not, turns the lock red in the state where it
       // shows up.
       expect(cardChildren()).toEqual(withoutTrend);

       const layout = result.getByTestId('weekly-activity-chart-layout');

       await fireEvent(layout, 'layout', {
         nativeEvent: {
           layout: { width: 295, height: 0, x: 0, y: 0 },
         },
       });

       expect(result.getByTestId('weekly-activity-bar-chart')).toBeOnTheScreen();
       expect(cardChildren()).toEqual(withoutTrend);

       await fireEvent.press(
         result.getByTestId('weekly-activity-metric-distanceM'),
       );

       expect(
         result.getByTestId('weekly-activity-metric-distanceM').props
           .accessibilityState,
       ).toEqual({ selected: true });
       expect(cardChildren()).toEqual(withoutTrend);

       await fireEvent.press(result.getByTestId('weekly-activity-day-2026-09-05'));

       expect(result.getByTestId('weekly-activity-tooltip')).toBeOnTheScreen();
       expect(cardChildren()).toEqual([
         ...withoutTrend,
         'weekly-activity-detail',
       ]);
     });

     it('con comparación, la tendencia va entre el selector y el gráfico', async () => {
       const result = await renderChart(
         makeWeek('2026-09-02', [10, 20, 30, 40, 50, 60, 70]),
         { ...NO_COMPARISON, activeMinutes: 12.5 },
       );

       // #135 R4: the trend only exists with a comparison, so its place among the
       // children of the card needs a render of its own.
       expect(result.getByTestId('weekly-activity-trend')).toBeOnTheScreen();
       expect(
         result
           .getByTestId('weekly-activity-card')
           .children.map((child) =>
             typeof child === 'string' ? child : child.props.testID,
           ),
       ).toEqual([
         'weekly-activity-header',
         'weekly-activity-metric',
         'weekly-activity-trend',
         'weekly-activity-chart-layout',
         'weekly-activity-day-row',
       ]);
     });

     it('sin ningún día medido, la tarjeta solo tiene la cabecera y el mensaje', async () => {
       const result = await renderChart(
         makeWeek('2026-09-02', [null, null, null, null, null, null, null]),
       );

       // #135 R4: the empty branch of the card is locked as well.
       expect(
         result
           .getByTestId('weekly-activity-card')
           .children.map((child) =>
             typeof child === 'string' ? child : child.props.testID,
           ),
       ).toEqual(['weekly-activity-header', 'weekly-activity-empty']);
     });
   });
   ```

   El test da el blob `416bf8b296b34d795a11d5d9f4d901a8b1a40fcb`, que es el
   blob final.
2. **La mutación `P4red`**, en la gráfica. Es exactamente la sonda `wrapmetric`
   de la spec de #132, la que cita la entrada de #135:
   - justo encima de `          <MetricSelector` (10 espacios;
     `grep -c '^          <MetricSelector$'` da 1), la línea
     `          <View accessible>`;
   - justo debajo del `          />` que cierra el selector, que es la línea
     siguiente a `            onSelect={setSelectedMetricIndex}` (da 1 con
     `grep -c '^            onSelect={setSelectedMetricIndex}$'`), la línea
     `          </View>`.

   No reindentes el selector. La gráfica da el blob
   `d053148a654bb15abf0e75c2d056d94bea7b930a`.
3. La gráfica da `exit=1`: 2 failed y 51 passed de 53. Los **únicos** rojos son
   dos `it` de `#135 R4: entre la tarjeta y cada uno de sus hijos no hay otro nodo`,
   los dos por `expect(received).toEqual(expected)`:
   - `› sin comparación: cabecera, selector, gráfico y fila antes y después de medir y con otra métrica, y el detalle al final con un día seleccionado`;
   - `› con comparación, la tendencia va entre el selector y el gráfico`.

   El tercero, `› sin ningún día medido, la tarjeta solo tiene la cabecera y el mensaje`,
   sigue verde: sin días medidos no hay selector. R1 a R3, `#74 R2` y
   `#132 R1` siguen verdes.
4. La suite da `exit=1`: 2 failed y 1615 passed de 1617; 1 suite failed y 85
   passed de 86. Si falla otro test, **para**.
5. Commit rojo:

   ```bash
   git add mobile-pet-tracker/src/screens/home/weekly-activity-chart.test.tsx mobile-pet-tracker/src/screens/home/weekly-activity-chart.tsx
   git commit -m "test(mobile): expose a wrapper around the metric selector with a versioned mutation (R4)"
   ```

### (2) Verde

1. `git checkout HEAD~1 -- mobile-pet-tracker/src/screens/home/weekly-activity-chart.tsx`.
   La gráfica vuelve a `c258abedde92d2be981be8507d3d898f13c612cb`.
2. La gráfica da 53 de 53, `exit=0`.
3. Commit verde:

   ```bash
   git add mobile-pet-tracker/src/screens/home/weekly-activity-chart.tsx
   git commit -m "test(mobile): lock the weekly card children as a closed list (R4)"
   ```

### (3) Refactor

Ninguno. La lectura de los hijos de la tarjeta se repite en los tres `it` y no
se extrae a un helper del fichero: cada `it` se lee solo.

## Sondas

Sobre el árbol final, **una sonda cada vez**:

1. Aplica la mutación de la tabla en la gráfica (o, en `hexbare`, en el test).
2. Comprueba con `git hash-object` que el fichero mutado da el blob de la tabla.
   Si no coincide, la mutación no es la de la spec: corrígela antes de medir.
3. Corre el comando canónico de la gráfica (en `hexbare`, el de la columna
   «Exigido»).
4. Anota `exit`, las cuentas, cada `it` rojo y **la primera línea de su error**:
   `expect(received).<matcher>` es un rojo **por aserción**, y
   `Unable to find an element with testID: …` o
   `Found multiple elements with testID: …` es un rojo **por consulta**.
5. Restaura con `git checkout HEAD -- mobile-pet-tracker/src/screens/home/weekly-activity-chart.tsx mobile-pet-tracker/src/screens/home/weekly-activity-chart.test.tsx`
   (con `HEAD`: sin él, un fichero que hubieras añadido al índice conservaría
   la mutación).
6. `git diff --exit-code -- mobile-pet-tracker/src` y
   `git diff --cached --exit-code -- mobile-pet-tracker/src` dan 0 los dos.

**Nada de esto se commitea.** La tabla medida va al reporte, con la columna
«medido» rellena por ti.

Convenciones de la tabla:

- «R1», «R2» y «R3» son los `it` de #131. «R4 1», «R4 2» y «R4 3» son los tres
  `it` de `#135 R4`, en el orden del fichero: sin comparación, con comparación
  y sin ningún día medido.
- «La línea de clase de la fila» es `        className="flex-row"`, justo debajo
  de `        testID="weekly-activity-day-row"`. «La rama de reposo» y «la
  rama seleccionada» son las dos líneas del ternario del `className` de la
  columna (16 espacios): `                : 'min-h-11 flex-1 items-center justify-end'`
  y `                ? 'min-h-11 flex-1 items-center justify-end border-t-2 border-accent-strong'`.
- «Envolver el selector con `<X>`» es poner `          <X>` justo encima de
  `          <MetricSelector` y `          </X>` justo debajo de su
  `          />`, sin reindentar el selector (como `P4red`).
- «El selector solo envuelto si `<cond>`» es cambiar las seis líneas del
  selector (de `          <MetricSelector` a su `          />`) por:
  `          {<cond> ? (`, `            <View>`, las seis líneas del selector sin
  tocar, `            </View>`, `          ) : (`, otra vez las seis líneas sin
  tocar y `          )}`.
- «El `<View` de X» es la línea `<View` (o `<Text`) de justo encima del
  `testID` de X.
- Se mide sobre 53 tests. «Hoy» es la misma mutación sobre la base (47 tests):
  va para que el `reviewer` vea qué hueco cierra cada candado. «(5 suites)»
  quiere decir que el spec_author lo midió también con la Home y las tres
  suites de guards (`index.test.tsx`, `design-drift`, `consistency-classnames`
  y `ui-language`), 348 tests en la base; tú solo corres la gráfica.

| Sonda | Mutación | Blob | Hoy (47) | Exigido tras esta feature (53) |
|---|---|---|---|---|
| `flexcol` | la línea de clase de la fila pasa a `        className="flex-col"` (es `P1red`) | `99ec492b` | verde | rojo 1: R1, por `toBe` |
| `flexrev` | … pasa a `        className="flex-row-reverse"` | `9543c7f4` | verde | rojo 1: R1, por `toBe` |
| `rowextra` | … pasa a `        className="flex-row items-end"` | `1bbb5194` | verde | rojo 1: R1, por `toBe` |
| `flexcollayout` | … pasa a `        className={chartWidth > 0 ? 'flex-row' : 'flex-col'}` | `485b806c` | verde | rojo 1: R1, por `toBe` |
| `flexcolmetric` | … pasa a `        className={selectedMetricIndex === 0 ? 'flex-row' : 'flex-col'}` | `eb7fe0ba` | verde | rojo 1: R1, por `toBe` |
| `flexcolsel` | … pasa a `        className={selection === null ? 'flex-row' : 'flex-col'}` | `5e7cfa45` | verde | rojo 1: R1, por `toBe` |
| `flexcoltrend` | … pasa a `        className={trend === null ? 'flex-row' : 'flex-col'}` | `7275ea97` | verde | **verde**, 53/53: (D) |
| `nopad` | `          paddingLeft: CHART_PAD_LEFT,` pasa a `          paddingLeft: 0,` (es `P2red`) | `9cb81179` | verde | rojo 1: R2, por `toEqual` |
| `padright` | `          paddingRight: CHART_PAD_RIGHT,` pasa a `          paddingRight: 0,` | `f778b1d7` | verde | rojo 1: R2, por `toEqual` |
| `padsym` | las dos pasan a `          paddingLeft: CHART_PAD_LEFT + 5,` y `          paddingRight: CHART_PAD_RIGHT + 5,` | `6f539289` | verde | rojo 1: R2, por `toEqual` |
| `padswap` | las dos pasan a `          paddingLeft: CHART_PAD_RIGHT,` y `          paddingRight: CHART_PAD_LEFT,` | `8cb8a60f` | verde | rojo 1: R2, por `toEqual` |
| `padextra` | justo debajo de `          paddingRight: CHART_PAD_RIGHT,`, la línea `          marginLeft: 4,` | `e654ce1a` | verde | rojo 1: R2, por `toEqual` |
| `padmetric` | `          paddingLeft: CHART_PAD_LEFT,` pasa a `          paddingLeft: selectedMetricIndex === 0 ? CHART_PAD_LEFT : 0,` | `9d078fa9` | verde | rojo 1: R2, por `toEqual` |
| `padsel` | … pasa a `          paddingLeft: selection === null ? CHART_PAD_LEFT : 0,` | `53a07e7a` | verde | rojo 1: R2, por `toEqual` |
| `avgx1` | en la línea de media, `          x1={CHART_PAD_LEFT}` (da 1 con `grep -c '^          x1={CHART_PAD_LEFT}$'`) pasa a `          x1={0}` | `f6e0e449` | verde | rojo 1: R2, por `toEqual` |
| `padlayout` | `          paddingLeft: CHART_PAD_LEFT,` pasa a `          paddingLeft: chartWidth > 0 ? CHART_PAD_LEFT : 0,` | `b3b17cb0` | verde | **verde**, 53/53: (D) |
| `padconst` | `export const CHART_PAD_LEFT = 40.4;` pasa a `export const CHART_PAD_LEFT = 30;` | `bef286f8` | verde | **verde**, 53/53: (F) |
| `colnoflex` | la rama de reposo pasa a `                : 'min-h-11 items-center justify-end'` (es `P3red`) | `9668ac80` | verde | rojo 1: R3, por `toEqual` |
| `selnoflex` | la rama seleccionada pasa a `                ? 'min-h-11 items-center justify-end border-t-2 border-accent-strong'` | `e132960d` | verde | rojo 1: R3, por `toEqual` (solo la última aserción) |
| `colnocenter` | las dos ramas pierden ` items-center`: `                ? 'min-h-11 flex-1 justify-end border-t-2 border-accent-strong'` y `                : 'min-h-11 flex-1 justify-end'` | `12868522` | verde | rojo 1: R3, por `toEqual` |
| `colextra` | la rama de reposo pasa a `                : 'min-h-11 flex-1 items-center justify-end px-1'` | `3c03e2aa` | verde | rojo 1: R3, por `toEqual` |
| `colnoflexlayout` | la rama de reposo pasa a `                : chartWidth > 0 ? 'min-h-11 flex-1 items-center justify-end' : 'min-h-11 items-center justify-end'` | `2bed0ea8` | verde | rojo 1: R3, por `toEqual` |
| `colnoflexmetric` | la rama de reposo pasa a `                : selectedMetricIndex === 0 ? 'min-h-11 flex-1 items-center justify-end' : 'min-h-11 items-center justify-end'` | `eadbd619` | verde | rojo 1: R3, por `toEqual` |
| `colswap` | las seis líneas de la etiqueta del día (de su `            <Text` a su `            </Text>`, 12 espacios; su `testID` es `weekly-activity-day-label`) salen de encima de `            {day.source === 'missing' ? (` y van justo encima del `          </Pressable>` que cierra la columna (el de justo encima de `        ))}`) | `6214543c` | verde (5 suites) | **verde**, 53/53: (F) |
| `labelcolor` | `              className="text-2xs font-semibold text-muted"`, justo debajo de `              testID="weekly-activity-day-label"`, pasa a `              className="text-2xs font-semibold text-foreground"` | `f58f4903` | verde (5 suites) | **verde**, 53/53: (F) |
| `valuecolor` | `                className="text-2xs font-semibold text-foreground"`, justo debajo del `testID` de `weekly-activity-value-`, pasa a `                className="text-2xs font-semibold text-muted"` | `bc902097` | verde (5 suites) | **verde**, 53/53: (F) |
| `wrapmetric` | envolver el selector con `<View accessible>` (es `P4red`) | `d053148a` | verde (5 suites) | rojo 2: R4 1 y R4 2, por `toEqual` |
| `presmetric` | envolver el selector con `<Pressable>` | `1daf94fb` | verde | rojo 2: R4 1 y R4 2, por `toEqual` |
| `metricwraplayout` | el selector solo envuelto si `chartWidth > 0` | `349a845b` | verde | rojo 2: R4 1 y R4 2, por `toEqual` |
| `metricwraplayoutctl` | el selector solo envuelto si `chartWidth === 0` | `af4c7ac8` | verde | rojo 1: R4 1, por `toEqual` (solo la primera aserción) |
| `metricwrapmetric` | el selector solo envuelto si `selectedMetricIndex !== 0` | `2acda850` | rojo 1: `R6: el selector cambia de métrica sin volver a pedir nada › desliza una única píldora entre las medidas reales de las pestañas`, por `toHaveBeenNthCalledWith` | rojo 2: ese, igual, y R4 1, por `toEqual` |
| `metricwrapsel` | el selector solo envuelto si `selection !== null` | `a1b21e66` | verde | rojo 1: R4 1, por `toEqual` (solo la última aserción) |
| `metricwraptrend` | el selector solo envuelto si `trend !== null` | `be44716c` | verde | rojo 1: R4 2, por `toEqual` |
| `metricwrapmissing` | el selector solo envuelto si `days.some((day) => day.source === 'missing')` | `d4ca8bba` | verde | **verde**, 53/53: (D) |
| `wrapmetricid` | envolver el selector con `<View testID="weekly-activity-metric">` y `</View>` | `eec9735e` | rojo 4, **por consulta** (`Found multiple elements with testID: weekly-activity-metric`): `#74 R1 › declara el rol radiogroup en el contenedor de las tres opciones`, `#74 R2 › el contenedor solo lleva su rol, su testID, su clase y sus hijos`, `R6 › ofrece tres opciones accesibles y mantiene cada etiqueta en una línea` y `R13 › mantiene las siete columnas si al menos un día está medido` | igual, rojo 4 y R4 verde: (N) |
| `fragmetric` | envolver el selector con `<>` y `</>` | `46343b10` | verde | **verde**, 53/53: (N) |
| `wrapheader` | `      <View>` justo encima del `<View` de `weekly-activity-header`, y `      </View>` justo encima de `      {hasMeasuredDay ? (` | `a5dabc39` | verde | rojo 3: R4 1, 2 y 3, por `toEqual` |
| `wraptrend` | `            <View>` justo encima del `<View` de `weekly-activity-trend`, y `            </View>` justo encima del `          ) : null}` que cierra la tendencia (el de justo encima del `<View` de `weekly-activity-chart-layout`) | `36e03dc6` | verde | rojo 1: R4 2, por `toEqual` |
| `wraplayout` | `          <View>` justo encima del `<View` de `weekly-activity-chart-layout`, y `          </View>` justo encima del `<View` de `weekly-activity-day-row` | `e80e814f` | verde | rojo 2: R4 1 y R4 2, por `toEqual` |
| `wraprow` | `          <View>` justo encima del `<View` de `weekly-activity-day-row`, y `          </View>` justo debajo del `          </View>` que sigue a `        ))}` | `c8054b77` | rojo 1: `#130 R2 › las siete columnas cuelgan de la fila, y la fila, de la tarjeta`, por `toBe` | rojo 3: ese, igual, y R4 1 y R4 2, por `toEqual` |
| `wrapdetail` | `            <View>` justo encima del `<View` de `weekly-activity-detail`, y `            </View>` justo encima del `          ) : null}` que va antes de `        </>` | `2d7cd52b` | verde | rojo 1: R4 1, por `toEqual` (solo la última aserción) |
| `wrapempty` | `        <View>` justo encima del `<Text` de `weekly-activity-empty`, y `        </View>` justo debajo de su `        </Text>` | `5d294a3d` | verde | rojo 1: R4 3, por `toEqual` |
| `siblingcard` | `      <View className="h-px bg-border" />` justo encima de `      {hasMeasuredDay ? (` | `3eb06d52` | verde | rojo 3: R4 1, 2 y 3, por `toEqual` |
| `swaporder` | las seis líneas del selector salen de su sitio y van justo encima del `<View` de `weekly-activity-chart-layout` (detrás de la tendencia) | `3d759564` | verde | rojo 1: R4 2, por `toEqual` |
| `wrapoptions` | en `MetricSelector`, `      <View className="flex-row gap-1">` justo encima de `      {WEEKLY_METRICS.map((metric, index) => {`, y `      </View>` justo debajo del `      })}` que lo cierra | `932027b6` | verde | **verde**, 53/53: (F) |
| `cardgap` | `<Card testID="weekly-activity-card" className="gap-2">` pasa a `<Card testID="weekly-activity-card" className="gap-4">` | `e910626e` | verde (5 suites) | **verde**, 53/53: (D) |
| `hexbare` | **en el test**, `    // #131 R1: the exact class,` pasa a `    // #131: the exact class,` | `f18ea25d` (el test) | no aplica | `bunx jest --runTestsByPath src/__tests__/design-drift.test.ts`: `exit=1`, 1 failed de 55, `#68 R18: la actividad semanal no mete drift de estilo › keeps arbitrary text, hex colors, and StyleSheet out of feature sources` |

Si una fila da otro veredicto, **para** y repórtalo con el log. No ajustes la
aserción para que case.

## R5 (#131 y #135) — Cierre

1. Suite completa, sin pipe: 86 suites y 1617 tests, `exit=0`, o la base que
   mediste en §Antes de tocar nada más 6 tests y 0 suites. La gráfica, 53 de 53.
   Declara el delta en el reporte.
2. `test ! -e .expo/types/router.d.ts && bunx tsc --noEmit > /tmp/131_tsc.log 2>&1; echo "exit=$?"`
   da `exit=0`.
3. `bunx eslint src/screens/home/weekly-activity-chart.tsx src/screens/home/weekly-activity-chart.test.tsx > /tmp/131_lint.log 2>&1; echo "exit=$?"`
   da `exit=0`.
4. Las cifras de candado. En la gráfica, igual que en la base:
   - `grep -c "style={CONTINUOUS_CORNER}"` da 1;
   - `grep -c "style={TABULAR_NUMS}"` da 4;
   - `grep -c 'accessibilityRole="radiogroup"'` da 1;
   - `grep -c "Platform"` da 0.

   En los dos ficheros,
   `grep -ciE "stylesheet|text-\[10px\]" src/screens/home/weekly-activity-chart.tsx src/screens/home/weekly-activity-chart.test.tsx`
   da 0.

   En el test (base, y tras esta feature):
   - `grep -c "use-api"` da 1 y 1: la línea `expect(source).not.toContain('use-api');`
     que ya estaba, y que `#87 R19` espera como única huella; `grep -c "useApi"`
     da 0;
   - `grep -c "CHART_PAD"` da 10 y 10, y `grep -c "40.4"`, 0 y 0: R2 no usa
     constantes ni literales de la gráfica;
   - `grep -c "weekly-activity-day-row"` pasa de 3 a 8, y
     `grep -c "weekly-activity-card"`, de 7 a 10;
   - `grep -c "^describe("` pasa de 19 a 23;
   - `grep -c "^describe('#131 R"` da 3, y `grep -c "^describe('#135 R"`, 1;
   - `grep -c "#131"` y `grep -c "#131 R[123]:"` dan 6 los dos (tres títulos y
     tres comentarios), y `grep -c "#135"` y `grep -c "#135 R4:"`, 4 los dos (un
     título y tres comentarios): ningún `#131` ni `#135` suelto.
5. Desde la raíz del repo:
   - `git diff --stat origin/main...HEAD -- mobile-pet-tracker/` lista **solo**
     el test, con 252 líneas añadidas y 0 borradas;
   - `git diff --exit-code origin/main...HEAD -- mobile-pet-tracker/src/screens/home/weekly-activity-chart.tsx mobile-pet-tracker/package.json mobile-pet-tracker/bun.lock mobile-pet-tracker/src/i18n/catalog.ts mobile-pet-tracker/src/components/card.tsx`
     da 0.
6. Blobs finales:

   | Ruta | Blob |
   |---|---|
   | `src/screens/home/weekly-activity-chart.tsx` | `c258abedde92d2be981be8507d3d898f13c612cb` (el de base) |
   | `src/screens/home/weekly-activity-chart.test.tsx` | `416bf8b296b34d795a11d5d9f4d901a8b1a40fcb` |

7. Escribe `progress/impl_mobile-weekly-day-row-layout-lock.md` con:
   - la base medida y el delta;
   - las salidas de cada rojo y cada verde (cuentas, `exit` y los `it` rojos con
     su matcher);
   - la tabla de §Sondas, con la columna «medido»;
   - los blobs y los números de este cierre.

   Rellena los hashes en [[traceability]]. La fila de R5 cita el hash del
   **verde de R4**, que es el último commit de código, no el de este commit.
   Commitea solo esos dos ficheros:

   ```bash
   git add progress/impl_mobile-weekly-day-row-layout-lock.md specs/mobile-weekly-day-row-layout-lock/traceability.md
   git commit -m "docs(mobile): record the weekly day row layout and card children evidence (R1,R2,R3,R4,R5)"
   ```

   No rebasees después: los hashes de la tabla dejarían de valer.

## Lo que NO hay que tocar

- La gráfica, salvo en los cuatro commits rojos, y siempre revertida en el verde
  siguiente.
- Los `describe` de #68, #74, #130 y #132 del test, y sus helpers y mocks
  (`renderChart`, `renderChartWithProps`, `makeWeek`, `makeDay`,
  `NO_COMPARISON`, `latestBarChartProps`, `mergeObjectStyles`, `mockBarChart`,
  `mockTheme` y el resto). Ni los imports del test.
- `src/components/card.tsx`.
- `src/screens/home/index.tsx`, `src/screens/home/index.test.tsx` y
  `src/__tests__/consistency-classnames.test.ts`: los toca #138, en otra sesión.
- `src/__tests__/design-drift.test.ts` y `src/__tests__/ui-language.test.ts`.
- `src/i18n/catalog.ts`, `src/providers/__tests__/language-provider.test.tsx` y
  `src/__tests__/ui-copy-table.ts`: no hay copy nueva.
- `package.json` y `bun.lock`: no hay dependencia nueva.
- `feature_list.json` y `specs/mobile-weekly-chart-metric-selector-parent-lock/requirements.md`
  (el puntero de #135): son del `leader`.

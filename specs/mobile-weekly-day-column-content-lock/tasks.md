---
feature: "mobile-weekly-day-column-content-lock"
status: spec_ready       # draft | spec_ready | approved
tags: [spec, mobile, test, deuda]
---

# Tareas — [[mobile-weekly-day-column-content-lock]] (#140)

> Orden TDD por requisito: (1) test rojo, (2) implementación mínima,
> (3) refactor. R1 y R2 se escriben sobre código que ya cumple, así que su rojo
> es una **mutación de producción versionada** en el commit rojo, que el verde
> revierte con `git checkout HEAD~1 --` (C4, vía **b**). Nunca un
> `ReferenceError` ni un doble de test mutado.
>
> Cada requisito crea su sujeto antes de aseverarlo: la fila, sus siete
> columnas, la etiqueta, el valor y la raya ya existen en la base, y el día
> `missing` lo crea la semana que monta el propio `it`. Cada bloque usa solo
> helpers que ya existen en el test. R2 no depende del bloque de R1; el orden
> R1, R2 es el orden en el fichero.
>
> Las rutas son relativas a `mobile-pet-tracker/` salvo que empiecen por
> `docs/`, `specs/` o `progress/`, o se diga «desde la raíz». Los números de
> línea **no son anclas**: todo se localiza por contenido, con el `grep` que se
> cita, y cada ancla da 1 en la base. «La gráfica» es
> `src/screens/home/weekly-activity-chart.tsx` y «el test» es
> `src/screens/home/weekly-activity-chart.test.tsx`. Ninguna ruta de esta
> feature lleva paréntesis.

## Antes de tocar nada

1. `git branch --show-current` da `feature/140-mobile-weekly-day-column-content-lock`.
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
   | `src/screens/home/weekly-activity-chart.test.tsx` | `416bf8b296b34d795a11d5d9f4d901a8b1a40fcb` |

   Si alguno no coincide, **para**: la base se movió, y los blobs y las sondas de
   esta spec ya no valen.
6. Mide la base con los dos comandos canónicos, **sin pipe**:

   ```bash
   bunx jest --runTestsByPath src/screens/home/weekly-activity-chart.test.tsx > /tmp/140_chart.log 2>&1; echo "exit=$?"
   bunx jest > /tmp/140_full.log 2>&1; echo "exit=$?"
   grep -E "^(Tests|Test Suites|Snapshots):" /tmp/140_chart.log /tmp/140_full.log
   ```

   Esperado: la gráfica da 53 passed de 53, `exit=0`. La suite da 86 passed de
   86 suites y 1619 passed de 1619 tests, `exit=0`. **Esa cifra de la suite la
   relató el `leader` y el spec_author no la midió**: la tuya manda. Si la suite
   da otra cifra con `exit=0`, **anota la medida** y úsala como base: el delta
   exigido es +2 tests y +0 suites sobre lo medido, y los «N failed de M» de los
   rojos se desplazan igual. Nunca pongas `| tail` ni `| grep` detrás de
   `jest`, porque el `exit` sería el del último comando. Los bloques
   `● Console` del log son ruido y no cuentan como fallo. Los rojos se cuentan
   por la línea `Tests:`.
7. **Reglas de literales en los bloques nuevos**, comentarios incluidos:
   - un `#` solo puede ir seguido de dígitos, un espacio y `R<n>` (`#140 R1`),
     por `#68 R18` (`src/__tests__/design-drift.test.ts`). Nada de `#140`
     suelto: medido, rompe `#68 R18` (sonda `hexbare`);
   - ni `StyleSheet` ni `text-[10px]`, en ningún caso;
   - ni `use-api` ni `useApi` (`#87 R19`);
   - las tres clases esperadas de R2 son **literales** del test: no las importes
     ni las leas del fuente de la gráfica.
8. **Pega los bloques tal cual, sin prettier.** El test no está formateado con
   prettier y `mobile-pet-tracker/` no tiene configuración de prettier:
   formatearlo cambiaría líneas de la base. Aquí los bloques llevan 3 espacios
   de sangría por estar dentro de una lista; en el test, `describe(` va en la
   columna 0. El blob que se cita tras cada bloque te dice si lo pegaste bien.
   No añadas ningún import: `fireEvent`, `within`, `renderChartWithProps`,
   `makeWeek` y `NO_COMPARISON` ya están en el test.

## R1 — Cada columna tiene la etiqueta y, debajo, su valor o su raya

### (1) Rojo

1. Al final del test, después del `});` que cierra
   `describe('#135 R4: entre la tarjeta y cada uno de sus hijos no hay otro nodo'`
   (es el último `describe` del fichero: `grep -n "^describe(" src/screens/home/weekly-activity-chart.test.tsx | tail -1`),
   añade una línea en blanco y este bloque:

   ```tsx
   describe('#140 R1: cada columna tiene la etiqueta del día y, debajo, su valor o su raya', () => {
     it('las siete columnas tienen dos hijos, la etiqueta primero, antes y después de medir, con otra métrica y con un día seleccionado, medido o sin datos', async () => {
       const result = await renderChartWithProps(
         {
           days: makeWeek('2026-09-02', [10, 20, 30, 40, 50, null, 70]),
           weekComparison: NO_COMPARISON,
         },
         'es',
         false,
       );
       const label = 'weekly-activity-day-label';
       const expected = [
         [label, 'weekly-activity-value-2026-09-02'],
         [label, 'weekly-activity-value-2026-09-03'],
         [label, 'weekly-activity-value-2026-09-04'],
         [label, 'weekly-activity-value-2026-09-05'],
         [label, 'weekly-activity-value-2026-09-06'],
         [label, 'weekly-activity-missing-2026-09-07'],
         [label, 'weekly-activity-value-2026-09-08'],
       ];
       const columnChildren = () =>
         result
           .getByTestId('weekly-activity-day-row')
           .children.map((column) =>
             typeof column === 'string'
               ? column
               : column.children.map((child) =>
                   typeof child === 'string' ? child : child.props.testID,
                 ),
           );

       // #140 R1: the host children of each column by position, so a swap, a wrapper
       // or an extra node in any column turns the lock red, in each state the chart
       // reaches inside this test. toStrictEqual, because toEqual skips a trailing
       // undefined: a last child without testID would pass.
       expect(columnChildren()).toStrictEqual(expected);

       const layout = result.getByTestId('weekly-activity-chart-layout');

       await fireEvent(layout, 'layout', {
         nativeEvent: {
           layout: { width: 295, height: 0, x: 0, y: 0 },
         },
       });

       expect(result.getByTestId('weekly-activity-bar-chart')).toBeOnTheScreen();
       expect(columnChildren()).toStrictEqual(expected);

       await fireEvent.press(
         result.getByTestId('weekly-activity-metric-distanceM'),
       );

       expect(
         result.getByTestId('weekly-activity-metric-distanceM').props
           .accessibilityState,
       ).toEqual({ selected: true });
       expect(columnChildren()).toStrictEqual(expected);

       await fireEvent.press(result.getByTestId('weekly-activity-day-2026-09-05'));

       expect(result.getByTestId('weekly-activity-tooltip')).toBeOnTheScreen();
       expect(columnChildren()).toStrictEqual(expected);

       await fireEvent.press(result.getByTestId('weekly-activity-day-2026-09-07'));

       expect(
         within(result.getByTestId('weekly-activity-detail')).getByText(
           'Sin datos de este día',
         ),
       ).toBeOnTheScreen();
       expect(columnChildren()).toStrictEqual(expected);
     });
   });
   ```

   El test da el blob `32405e4cec45643c5a09253a71b1900caa8bb1bd`. El fichero
   acaba en `});` y un salto de línea, sin línea en blanco final. Deja los cinco
   `toStrictEqual(expected)` como están: con `toEqual`, un hijo sin `testID` al
   final de la columna pasaría ([[design]] D4).
2. **La mutación `P1red`**, en la gráfica. Es la sonda `colswap` de la entrada:
   las seis líneas de la etiqueta del día, de su `            <Text` a su
   `            </Text>` (12 espacios), que son estas:

   ```tsx
               <Text
                 testID="weekly-activity-day-label"
                 className="text-2xs font-semibold text-muted"
               >
                 {weekdayLabel(day.date, locale, 'short')}
               </Text>
   ```

   salen de justo encima de `            {day.source === 'missing' ? (`
   (`grep -c "^            {day.source === 'missing' ? ($"` da 1) y van, sin
   cambiar su sangría, justo encima del `          </Pressable>` que cierra la
   columna, es decir, entre el `            )}` que cierra el ternario y ese
   `          </Pressable>` (el de justo encima de `        ))}`;
   `grep -c '^        ))}$'` da 1).

   La gráfica da el blob `6214543c5bdd14f94ab65046e156d4ed71331e05`.
3. La gráfica da `exit=1`: 1 failed y 53 passed de 54. El **único** rojo es
   `#140 R1: cada columna tiene la etiqueta del día y, debajo, su valor o su raya › las siete columnas tienen dos hijos, la etiqueta primero, antes y después de medir, con otra métrica y con un día seleccionado, medido o sin datos`,
   por `expect(received).toStrictEqual(expected)`, en la primera aserción.
   `#68 R3` (la letra del eje, que busca la etiqueta dentro de cada columna),
   `#130 R2` y `#131 R3` siguen verdes.
4. La suite da `exit=1`: 1 failed y 1619 passed de 1620; 1 suite failed y 85
   passed de 86. El único rojo es el mismo. Si falla otro test, o este falla por
   otra cosa, **para**.
5. Commit rojo, con los dos ficheros (desde la raíz):

   ```bash
   git add mobile-pet-tracker/src/screens/home/weekly-activity-chart.test.tsx mobile-pet-tracker/src/screens/home/weekly-activity-chart.tsx
   git commit -m "test(mobile): expose the weekly day column content order with a versioned mutation (R1)"
   ```

### (2) Verde

1. `git checkout HEAD~1 -- mobile-pet-tracker/src/screens/home/weekly-activity-chart.tsx`.
   La gráfica vuelve a `c258abedde92d2be981be8507d3d898f13c612cb`.
2. La gráfica da 54 de 54, `exit=0`.
3. Commit verde, solo con la gráfica:

   ```bash
   git add mobile-pet-tracker/src/screens/home/weekly-activity-chart.tsx
   git commit -m "test(mobile): lock each weekly day column to its label and value in order (R1)"
   ```

### (3) Refactor

Ninguno. `columnChildren` se queda dentro de su `it`, y los siete pares se
quedan escritos uno a uno: la cardinalidad es parte del candado, y generarla
(`days.map`) la escondería.

## R2 — La etiqueta, el valor y la raya llevan su receta exacta

### (1) Rojo

1. Al final del test, después del `});` que cierra el `describe` de `#140 R1`,
   añade una línea en blanco y este bloque:

   ```tsx
   describe('#140 R2: la etiqueta, el valor y la raya de cada columna llevan su receta exacta', () => {
     it('la clase de los dos hijos de cada columna, por posición, antes y después de medir, con otra métrica y con un día seleccionado, medido o sin datos', async () => {
       const result = await renderChartWithProps(
         {
           days: makeWeek('2026-09-02', [10, 20, 30, 40, 50, null, 70]),
           weekComparison: NO_COMPARISON,
         },
         'es',
         false,
       );
       const label = 'text-2xs font-semibold text-muted';
       const value = 'text-2xs font-semibold text-foreground';
       const dash = 'text-2xs font-normal text-muted';
       const expected = [
         [label, value],
         [label, value],
         [label, value],
         [label, value],
         [label, value],
         [label, dash],
         [label, value],
       ];
       const columnClassNames = () =>
         result
           .getByTestId('weekly-activity-day-row')
           .children.map((column) =>
             typeof column === 'string'
               ? column
               : column.children.map((child) =>
                   typeof child === 'string' ? child : child.props.className,
                 ),
           );

       // #140 R2: the exact class of the label, the value and the dash by position,
       // so another colour, weight or size on any of them, in any column, turns the
       // lock red, in each state the chart reaches inside this test. toStrictEqual,
       // for the same reason as in #140 R1.
       expect(columnClassNames()).toStrictEqual(expected);

       const layout = result.getByTestId('weekly-activity-chart-layout');

       await fireEvent(layout, 'layout', {
         nativeEvent: {
           layout: { width: 295, height: 0, x: 0, y: 0 },
         },
       });

       expect(result.getByTestId('weekly-activity-bar-chart')).toBeOnTheScreen();
       expect(columnClassNames()).toStrictEqual(expected);

       await fireEvent.press(
         result.getByTestId('weekly-activity-metric-distanceM'),
       );

       expect(
         result.getByTestId('weekly-activity-metric-distanceM').props
           .accessibilityState,
       ).toEqual({ selected: true });
       expect(columnClassNames()).toStrictEqual(expected);

       await fireEvent.press(result.getByTestId('weekly-activity-day-2026-09-05'));

       expect(result.getByTestId('weekly-activity-tooltip')).toBeOnTheScreen();
       expect(columnClassNames()).toStrictEqual(expected);

       await fireEvent.press(result.getByTestId('weekly-activity-day-2026-09-07'));

       expect(
         within(result.getByTestId('weekly-activity-detail')).getByText(
           'Sin datos de este día',
         ),
       ).toBeOnTheScreen();
       expect(columnClassNames()).toStrictEqual(expected);
     });
   });
   ```

   El test da el blob `2f3828f4c039e9f3794c739e831c6402e138d6a9`, que es el
   blob final.
2. **La mutación `P2red`**, en la gráfica. Es la sonda `labelcolor` de la
   entrada: la línea `              className="text-2xs font-semibold text-muted"`
   (14 espacios; `grep -c '^              className="text-2xs font-semibold text-muted"$'`
   da 1), que va justo debajo de `              testID="weekly-activity-day-label"`,
   pasa a `              className="text-2xs font-semibold text-foreground"`,
   con la misma sangría.

   La gráfica da el blob `f58f4903851ea448b4421fadc163e6dd83a361a6`.
3. La gráfica da `exit=1`: 1 failed y 54 passed de 55. El **único** rojo es
   `#140 R2: la etiqueta, el valor y la raya de cada columna llevan su receta exacta › la clase de los dos hijos de cada columna, por posición, antes y después de medir, con otra métrica y con un día seleccionado, medido o sin datos`,
   por `expect(received).toStrictEqual(expected)`, en la primera aserción. R1
   sigue verde: los `testID` no cambian.
4. La suite da `exit=1`: 1 failed y 1620 passed de 1621; 1 suite failed y 85
   passed de 86. Si falla otro test, **para**.
5. Commit rojo:

   ```bash
   git add mobile-pet-tracker/src/screens/home/weekly-activity-chart.test.tsx mobile-pet-tracker/src/screens/home/weekly-activity-chart.tsx
   git commit -m "test(mobile): expose the weekly day label colour with a versioned mutation (R2)"
   ```

### (2) Verde

1. `git checkout HEAD~1 -- mobile-pet-tracker/src/screens/home/weekly-activity-chart.tsx`.
   La gráfica vuelve a `c258abedde92d2be981be8507d3d898f13c612cb`.
2. La gráfica da 55 de 55, `exit=0`.
3. Commit verde:

   ```bash
   git add mobile-pet-tracker/src/screens/home/weekly-activity-chart.tsx
   git commit -m "test(mobile): lock the weekly day label, value and dash recipes (R2)"
   ```

### (3) Refactor

Ninguno. `columnClassNames` se queda dentro de su `it`. No se extrae un helper
común con `columnChildren` de R1: cada `it` se lee solo, y un helper del fichero
sería un símbolo nuevo que ningún otro `describe` usa.

## Sondas

Sobre el árbol final, **una sonda cada vez**:

1. Aplica la mutación de la tabla en la gráfica (o, en `loose` y `hexbare`, en
   el test).
2. Comprueba con `git hash-object` que el fichero mutado da el blob de la tabla.
   Si no coincide, la mutación no es la de la spec: corrígela antes de medir.
3. Corre el comando canónico de la gráfica (en `hexbare`, el de la columna
   «Exigido»).
4. Anota `exit`, las cuentas, cada `it` rojo, **la primera línea de su error** y
   en qué aserción falla: `expect(received).<matcher>` es un rojo **por
   aserción**, y `Unable to find an element with testID: …` es un rojo **por
   consulta**. La aserción se lee en el marco de código del log: la primera es
   la de justo debajo del comentario `// #140 R<n>:`, la quinta, la última del
   `it`.
5. Restaura con `git checkout HEAD -- mobile-pet-tracker/src/screens/home/weekly-activity-chart.tsx mobile-pet-tracker/src/screens/home/weekly-activity-chart.test.tsx`
   (con `HEAD`: sin él, un fichero que hubieras añadido al índice conservaría
   la mutación).
6. `git diff --exit-code -- mobile-pet-tracker/src` y
   `git diff --cached --exit-code -- mobile-pet-tracker/src` dan 0 los dos.

**Nada de esto se commitea.** La tabla medida va al reporte, con la columna
«medido» rellena por ti.

Convenciones de la tabla:

- «R1» y «R2» son los `it` de `#140 R1` y `#140 R2`. «a1» a «a5» son sus cinco
  aserciones, en el orden de los estados de [[requirements]] §Requisitos: sin
  medir, medido, segunda métrica, día medido seleccionado (`2026-09-05`) y día
  `missing` seleccionado (`2026-09-07`).
- «La etiqueta» son las seis líneas de `P1red`. «La línea de clase de la
  etiqueta» es `              className="text-2xs font-semibold text-muted"`
  (14 espacios), justo debajo de `              testID="weekly-activity-day-label"`.
- «La línea de clase del valor» es
  `                className="text-2xs font-semibold text-foreground"`
  (16 espacios), justo debajo de
  ``                testID={`weekly-activity-value-${day.date}`}``
  (`grep -cF` de esa línea da 1). «La línea de clase de la raya» es
  `                className="text-2xs font-normal text-muted"` (16 espacios),
  justo debajo de ``                testID={`weekly-activity-missing-${day.date}`}``.
- «El cierre de la columna» es el hueco entre el `            )}` que cierra el
  ternario y el `          </Pressable>` de justo encima de `        ))}`. «Una
  línea en el cierre de la columna» va ahí, con 12 espacios.
- «Envolver X con `<View>`» es poner `            <View>` justo encima de la
  primera línea de X y `            </View>` justo debajo de la última, sin
  reindentar X.
- «Un punto si `<cond>`» es la línea
  `            {<cond> ? <View className="h-1 w-1" /> : null}` en el cierre de
  la columna.
- Se mide sobre 55 tests. «Hoy» es la misma mutación sobre la base (53 tests):
  va para que el `reviewer` vea qué hueco cierra cada candado. «(6 suites)»
  quiere decir que el spec_author lo midió también con las otras cinco suites
  que leen la gráfica (`src/screens/home/index.test.tsx`,
  `src/__tests__/design-drift.test.ts`, `consistency-classnames`,
  `legibility-classnames` y `ui-language`), 382 tests en la base y 384 al
  final; tú solo corres la gráfica, salvo en `valuetabular`, `valuecross` y
  `cardtail`, que piden las seis (su rojo o su verde está fuera de la gráfica).
  Con las seis, el comando es el canónico con las seis rutas detrás de
  `--runTestsByPath`.

| Sonda | Mutación | Blob | Hoy (53) | Exigido tras esta feature (55) |
|---|---|---|---|---|
| `colswap` | la etiqueta pasa al cierre de la columna (es `P1red`) | `6214543c` | verde (6 suites) | rojo 2: R1 y R2, por `toStrictEqual`, a1 |
| `wraplabel` | envolver la etiqueta con `<View>` | `566186b6` | verde | rojo 2: R1 y R2, por `toStrictEqual`, a1 |
| `wrapcontent` | envolver el ternario con `<View>`: `            <View>` justo encima de `            {day.source === 'missing' ? (` y `            </View>` en el cierre de la columna | `1736b079` | verde | rojo 2: R1 y R2, por `toStrictEqual`, a1 |
| `coltail` | la línea `            <View />` en el cierre de la columna | `2eea7fb9` | verde | rojo 2: R1 y R2, por `toStrictEqual`, a1 |
| `dotmissing` | un punto si `day.source === 'missing'` | `68d3d60f` | verde | rojo 2: R1 y R2, por `toStrictEqual`, a1 |
| `dotsel` | un punto si `selection?.dataIndex === dataIndex` | `5519c456` | verde | rojo 2: R1 y R2, por `toStrictEqual`, a4 |
| `dotselmissing` | un punto si `selection?.dataIndex === dataIndex && day.source === 'missing'` | `6440f4ed` | verde | rojo 2: R1 y R2, por `toStrictEqual`, a5 |
| `rowtail` | la línea `        <View />` justo debajo de `        ))}` (8 espacios) | `333d4e0c` | verde | rojo 2: R1 y R2, por `toStrictEqual`, a1 |
| `nolabel` | se borra la etiqueta | `355c52f3` | rojo 1 **por consulta** (`Unable to find an element with testID: weekly-activity-day-label`): `R3: la letra del eje sale de la fecha, no del índice › usa el día real de cada fecha en los dos idiomas` | rojo 3: ese, igual, y R1 y R2, por `toStrictEqual`, a1 |
| `labelcolor` | la línea de clase de la etiqueta pasa a `              className="text-2xs font-semibold text-foreground"` (es `P2red`) | `f58f4903` | verde (6 suites) | rojo 1: R2, por `toStrictEqual`, a1 |
| `labelsize` | … pasa a `              className="text-xs font-semibold text-muted"` | `8304e9db` | verde | rojo 1: R2, por `toStrictEqual`, a1 |
| `labelextra` | … pasa a `              className="text-2xs font-semibold text-muted uppercase"` | `c2087e4a` | verde | rojo 1: R2, por `toStrictEqual`, a1 |
| `labelcolorday` | … pasa a `              className={dataIndex === 6 ? 'text-2xs font-semibold text-foreground' : 'text-2xs font-semibold text-muted'}` | `4cf21be6` | verde | rojo 1: R2, por `toStrictEqual`, a1 |
| `labelcolorsel` | … pasa a `              className={selection?.dataIndex === dataIndex ? 'text-2xs font-semibold text-foreground' : 'text-2xs font-semibold text-muted'}` | `33c57671` | verde | rojo 1: R2, por `toStrictEqual`, a4 |
| `labelcolornomissing` | … pasa a `              className={days.some((entry) => entry.source === 'missing') ? 'text-2xs font-semibold text-muted' : 'text-2xs font-semibold text-foreground'}` | `a4ed6b68` | verde | **verde**, 55/55: (D) |
| `labellines` | la línea `              numberOfLines={1}` justo debajo de la línea de clase de la etiqueta | `7c5dc4f6` | verde | **verde**, 55/55: (D) |
| `valuecolor` | la línea de clase del valor pasa a `                className="text-2xs font-semibold text-muted"` | `bc902097` | verde (6 suites) | rojo 1: R2, por `toStrictEqual`, a1 |
| `valueweight` | … pasa a `                className="text-2xs font-bold text-foreground"` | `ee3d54db` | verde | rojo 1: R2, por `toStrictEqual`, a1 |
| `valuecolorlayout` | … pasa a `                className={chartWidth > 0 ? 'text-2xs font-semibold text-foreground' : 'text-2xs font-semibold text-muted'}` | `72e0c004` | verde | rojo 1: R2, por `toStrictEqual`, a1 |
| `valuecolormetric` | … pasa a `                className={selectedMetricIndex === 0 ? 'text-2xs font-semibold text-foreground' : 'text-2xs font-semibold text-muted'}` | `f3b67039` | verde | rojo 1: R2, por `toStrictEqual`, a3 |
| `valuecolorwalks` | … pasa a `                className={selectedMetricIndex === 2 ? 'text-2xs font-semibold text-muted' : 'text-2xs font-semibold text-foreground'}` | `0cce686b` | verde | **verde**, 55/55: (D) |
| `valuecolortrend` | … pasa a `                className={trend === null ? 'text-2xs font-semibold text-foreground' : 'text-2xs font-semibold text-muted'}` | `644cdeb3` | verde | **verde**, 55/55: (D) |
| `valuetabular` | la línea `                style={TABULAR_NUMS}` justo debajo de la línea de clase del valor | `7736123e` | la gráfica verde; en las 6 suites, rojo 1: `#62 R15: todo contador usa cifras tabulares › screens/home/weekly-activity-chart.tsx aplica TABULAR_NUMS a sus 4 valores`, por `toHaveLength` | igual, y R1 y R2 verdes: (N) |
| `valuecross` | `                  metricValue(day, selectedMetric),` pasa a `                  metricValue(dataIndex === 6 ? days[0] : day, selectedMetric),` | `9f3c5bfd` | verde | **verde**, 55/55, y 384/384 en las 6 suites: (F) |
| `dashcolor` | la línea de clase de la raya pasa a `                className="text-2xs font-normal text-foreground"` | `af98ef4e` | verde (6 suites) | rojo 1: R2, por `toStrictEqual`, a1 |
| `dashweight` | … pasa a `                className="text-2xs font-semibold text-muted"` | `ff47e312` | verde | rojo 1: R2, por `toStrictEqual`, a1 |
| `dashcolorsel` | … pasa a `                className={selection?.dataIndex === dataIndex ? 'text-2xs font-normal text-foreground' : 'text-2xs font-normal text-muted'}` | `b9e25bb8` | verde | rojo 1: R2, por `toStrictEqual`, a5 |
| `dashtext` | la línea `                —` (16 espacios; da 1 con `grep -c '^                —$'`) pasa a `                -` | `2e0bb8f2` | rojo 1: `R5: un día sin dato no es una barra de altura cero › separa el guion del día ausente y el valor cero medido`, por `toHaveTextContent` | igual, y R1 y R2 verdes: (N) |
| `labelcross` | `              {weekdayLabel(day.date, locale, 'short')}` pasa a `              {weekdayLabel(dataIndex === 6 ? days[0].date : day.date, locale, 'short')}` | `54f60928` | rojo 1: `R3: la letra del eje sale de la fecha, no del índice › usa el día real de cada fecha en los dos idiomas`, por `toEqual` | igual, y R1 y R2 verdes: (N) |
| `labeltag` | la primera y la última línea de la etiqueta pasan a `            <View` y `            </View>` | `0805634f` | rojo 45 (`Invariant Violation: Text strings must be rendered within a <Text> component`) | rojo 47, igual: (N) |
| `cardtail` | la línea `      <View />` justo encima de `    </Card>` (4 espacios; da 1 con `grep -c '^    </Card>$'`) | `0ac97f35` | verde | **verde**, 55/55, y 384/384 en las 6 suites: (F) |
| `loose` | **en el test**: los diez `toStrictEqual(expected)` de R1 y R2 pasan a `toEqual(expected)`; la gráfica sin tocar | test `b62db88a` | no aplica | verde, 55/55 |
| `loose` + `coltail` | la mutación de `loose` en el test y la de `coltail` en la gráfica | test `b62db88a`, gráfica `2eea7fb9` | no aplica | **verde**, 55/55: por eso R1 y R2 usan `toStrictEqual` |
| `loose` + `dotsel` | la de `loose` y la de `dotsel` | test `b62db88a`, gráfica `5519c456` | no aplica | rojo 1: solo R2, a4 (R1 no lo ve) |
| `hexbare` | **en el test**: el comentario `    // #140 R1: the host children of each column by position, so a swap, a wrapper` pasa a `    // #140: the host children of each column by position, so a swap, a wrapper` | test `d82f923a` | no aplica | `bunx jest --runTestsByPath src/__tests__/design-drift.test.ts`: `exit=1`, 1 failed de 55, `#68 R18: la actividad semanal no mete drift de estilo › keeps arbitrary text, hex colors, and StyleSheet out of feature sources` |

## R3 — Cierre

1. Suite completa, sin pipe: 86 suites y 1621 tests, `exit=0`, o la base que
   mediste en §Antes de tocar nada más 2 tests y 0 suites. La gráfica, 55 de 55.
   Declara el delta en el reporte.
2. `test ! -e .expo/types/router.d.ts && bunx tsc --noEmit > /tmp/140_tsc.log 2>&1; echo "exit=$?"`
   da `exit=0`.
3. `bunx eslint src/screens/home/weekly-activity-chart.tsx src/screens/home/weekly-activity-chart.test.tsx > /tmp/140_lint.log 2>&1; echo "exit=$?"`
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
     da 0 y 0;
   - `grep -c "CHART_PAD"` da 10 y 10;
   - `grep -c "^describe("` pasa de 23 a 25, y `grep -c "^describe('#140 R"`,
     de 0 a 2;
   - `grep -c "#140"` y `grep -c "#140 R[12]"` pasan de 0 a 5 los dos (dos
     títulos, dos comentarios de apertura y la mención a `#140 R1` en el
     comentario de R2): ningún `#140` suelto;
   - `grep -c "toStrictEqual"` pasa de 0 a 12 (diez aserciones y una mención en
     cada comentario);
   - `grep -c "weekly-activity-day-row"` pasa de 8 a 10;
   - `grep -c "weekly-activity-day-label"` pasa de 2 a 3;
   - `grep -c "Sin datos de este día"` pasa de 2 a 4, y `grep -c "within("`, de
     10 a 12.
5. Desde la raíz del repo:
   - `git diff --stat origin/main...HEAD -- mobile-pet-tracker/` lista **solo**
     el test, con 150 líneas añadidas y 0 borradas;
   - `git diff --exit-code origin/main...HEAD -- mobile-pet-tracker/src/screens/home/weekly-activity-chart.tsx mobile-pet-tracker/package.json mobile-pet-tracker/bun.lock mobile-pet-tracker/src/i18n/catalog.ts`
     da 0.
6. Blobs finales:

   | Ruta | Blob |
   |---|---|
   | `src/screens/home/weekly-activity-chart.tsx` | `c258abedde92d2be981be8507d3d898f13c612cb` (el de base) |
   | `src/screens/home/weekly-activity-chart.test.tsx` | `2f3828f4c039e9f3794c739e831c6402e138d6a9` |

7. Escribe `progress/impl_mobile-weekly-day-column-content-lock.md` con:
   - la base medida y el delta;
   - las salidas de cada rojo y cada verde (cuentas, `exit` y los `it` rojos con
     su matcher);
   - la tabla de §Sondas, con la columna «medido»;
   - los blobs y los números de este cierre.

   Rellena los hashes en [[traceability]]. La fila de R3 cita el hash del
   **verde de R2**, que es el último commit de código, no el de este commit.
   Commitea solo esos dos ficheros:

   ```bash
   git add progress/impl_mobile-weekly-day-column-content-lock.md specs/mobile-weekly-day-column-content-lock/traceability.md
   git commit -m "docs(mobile): record the weekly day column content evidence (R1,R2,R3)"
   ```

   No rebasees después: los hashes de la tabla dejarían de valer.

## Lo que NO hay que tocar

- La gráfica, salvo en los dos commits rojos, y siempre revertida en el verde
  siguiente.
- Los `describe` de #68, #74, #130, #131, #132 y #135 del test, y sus helpers y
  mocks (`renderChart`, `renderChartWithProps`, `makeWeek`, `makeDay`,
  `NO_COMPARISON`, `latestBarChartProps`, `mergeObjectStyles`, `mockBarChart`,
  `mockTheme` y el resto). Ni los imports del test. En particular, no cambies
  `toEqual` por `toStrictEqual` en `#130 R2`, `#131 R3` ni `#135 R4`.
- `src/screens/home/index.tsx` y `src/screens/home/index.test.tsx`.
- `src/__tests__/design-drift.test.ts`, `consistency-classnames.test.ts`,
  `legibility-classnames.test.ts` y `ui-language.test.ts`.
- `src/i18n/catalog.ts`, `src/providers/__tests__/language-provider.test.tsx` y
  `src/__tests__/ui-copy-table.ts`: no hay copy nueva.
- `package.json` y `bun.lock`: no hay dependencia nueva.
- `feature_list.json`: es del `leader`.

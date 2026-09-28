---
feature: "mobile-weekly-day-row-accessible-lock"
status: approved         # draft | spec_ready | approved
tags: [spec, mobile, a11y, deuda]
---

# Tareas — [[mobile-weekly-day-row-accessible-lock]] (#130)

> Orden TDD por requisito: (1) test rojo, (2) implementación mínima,
> (3) refactor. R1 y R2 se escriben sobre código que ya cumple, así que su rojo
> es una **mutación de producción versionada** en el commit rojo, que el verde
> revierte con `git checkout HEAD~1 --` (C4, vía **b**). Nunca un
> `ReferenceError` ni un doble de test mutado.
>
> Cada requisito crea su sujeto antes de aseverarlo: la fila, la tarjeta y las
> siete columnas ya existen en la base.
>
> Las rutas son relativas a `mobile-pet-tracker/` salvo que empiecen por
> `docs/`, `specs/` o `progress/`, o se diga «desde la raíz». Los números de
> línea **no son anclas**: todo se localiza por contenido, con el `grep` que se
> cita. «La gráfica» es `src/screens/home/weekly-activity-chart.tsx` y «el
> test» es `src/screens/home/weekly-activity-chart.test.tsx`. Ninguna ruta de
> esta feature lleva paréntesis.

## Antes de tocar nada

1. `git branch --show-current` da `feature/130-mobile-weekly-day-row-accessible-lock`.
   Si no, **para**.
2. Lee la casilla de [[requirements]] §Aprobación. Si no está marcada, **para**.
3. `cd mobile-pet-tracker && test ! -e .expo/types/router.d.ts; echo "exit=$?"`
   da `exit=0`. Si da 1, **para** y avisa al humano: el fichero está gitignorado
   y rompe `tsc` con rutas fantasma. No lo borres tú, porque tu sandbox lo
   deniega (#121).
4. Carga la skill `building-native-ui` de tu plugin `expo`. Esta feature no
   cambia UI: todo lo que necesitas está escrito aquí. Todo se corre con `bun` y
   `bunx`, nunca con `npm` ni `npx`. No instales nada. No corras `./init.sh` ni
   los e2e.
5. Blobs de base, con `git hash-object <ruta>`:

   | Ruta | Blob |
   |---|---|
   | `src/screens/home/weekly-activity-chart.tsx` | `c258abedde92d2be981be8507d3d898f13c612cb` |
   | `src/screens/home/weekly-activity-chart.test.tsx` | `d9687b162d20a2905b20f3c06158c619cb440d7a` |

   Si alguno no coincide, **para**: la base se movió, y los blobs y las sondas de
   esta spec ya no valen.
6. Mide la base con los dos comandos canónicos, **sin pipe**:

   ```bash
   bunx jest --runTestsByPath src/screens/home/weekly-activity-chart.test.tsx > /tmp/130_chart.log 2>&1; echo "exit=$?"
   bunx jest > /tmp/130_full.log 2>&1; echo "exit=$?"
   grep -E "^(Tests|Test Suites|Snapshots):" /tmp/130_chart.log /tmp/130_full.log
   ```

   Esperado: la gráfica da 41 passed de 41, `exit=0`. La suite da 83 passed de
   83 suites, 1550 passed de 1550 tests y 1 snapshot, `exit=0`. Si la suite da
   otra cifra con `exit=0` (por ejemplo, porque #100 mergeó antes), **anota la
   medida** y úsala como base: el delta exigido es +2 tests y +0 suites sobre lo
   medido, y los «N failed de M» de los rojos se desplazan igual. Nunca pongas
   `| tail` ni `| grep` detrás de `jest`, porque el `exit` sería el del último
   comando. En el log de la suite aparecen bloques `● Console` (30 en la base).
   Son ruido y no cuentan como fallo. Si el log de la suite repite un `it` rojo
   en el resumen final, es el mismo rojo: los rojos se cuentan por la línea
   `Tests:`.
7. **Reglas de literales en el test**, comentarios incluidos, por `#68 R18`
   (`src/__tests__/design-drift.test.ts`):
   - un `#` solo puede ir seguido de dos o tres dígitos, un espacio y `R<n>`
     (`#130 R1`). Nada de `#130` suelto: medido, rompe `#68 R18`;
   - ni `StyleSheet` ni `text-[10px]`, en ningún caso;
   - ni `use-api` ni `useApi` en los bloques nuevos (`#87 R19`).

## R1 — La fila no se vuelve un nodo accesible

### (1) Rojo

1. Al final del test, después del `});` que cierra
   `describe('#74 R3: el ajuste y el suelo de las etiquetas del selector, por plataforma'`
   (es el último `describe` del fichero: `grep -n "^describe(" src/screens/home/weekly-activity-chart.test.tsx | tail -1`),
   añade una línea en blanco y este bloque:

   ```tsx
   describe('#130 R1: la fila de las siete columnas no se vuelve un nodo accesible', () => {
     it('la fila solo lleva su testID, su clase, su estilo y sus hijos', async () => {
       const result = await renderChart(
         makeWeek('2026-09-02', [10, 20, 30, 40, 50, 60, 70]),
       );

       // #130 R1: a closed key list, so accessible, accessibilityLabel, aria-label,
       // importantForAccessibility or any other new prop turns the lock red.
       expect(
         Object.keys(result.getByTestId('weekly-activity-day-row').props).sort(),
       ).toEqual(['children', 'className', 'style', 'testID']);
     });
   });
   ```

   El test da el blob `70312d8720abc530600a231d8638168a58c4a23f`. El fichero
   acaba en `});` y un salto de línea, sin línea en blanco final.
2. **La mutación `P1red`**, en la gráfica: justo debajo de la línea
   `        testID="weekly-activity-day-row"` (8 espacios;
   `grep -c 'testID="weekly-activity-day-row"'` da 1), la línea
   `        accessible`, con la misma sangría.

   La gráfica da el blob `7e1055207b4c675fc00bc60081ec83a08e75de8a`.
3. La gráfica da `exit=1`: 1 failed y 41 passed de 42.
4. La suite da `exit=1`: 1 failed y 1550 passed de 1551; 1 suite failed y 82
   passed de 83; 1 snapshot passed. El **único** rojo es
   `#130 R1: la fila de las siete columnas no se vuelve un nodo accesible › la fila solo lleva su testID, su clase, su estilo y sus hijos`,
   por `expect(received).toEqual(expected)`. Si falla otro test, o este falla
   por otra cosa, **para**.
5. Commit rojo, con los dos ficheros (desde la raíz):

   ```bash
   git add mobile-pet-tracker/src/screens/home/weekly-activity-chart.test.tsx mobile-pet-tracker/src/screens/home/weekly-activity-chart.tsx
   git commit -m "test(mobile): expose the weekly day row collapse with a versioned mutation (R1)"
   ```

### (2) Verde

1. `git checkout HEAD~1 -- mobile-pet-tracker/src/screens/home/weekly-activity-chart.tsx`.
   La gráfica vuelve a `c258abedde92d2be981be8507d3d898f13c612cb`.
2. La gráfica da 42 de 42, `exit=0`.
3. Commit verde:

   ```bash
   git add mobile-pet-tracker/src/screens/home/weekly-activity-chart.tsx
   git commit -m "test(mobile): lock the weekly day row out of the accessibility tree (R1)"
   ```

### (3) Refactor

Ninguno. La lista es un literal del test y no se extrae a un helper compartido
con `#74 R2`.

## R2 — Entre la tarjeta y cada columna no hay otro nodo

### (1) Rojo

1. Al final del test, después del `});` que cierra el `describe` de `#130 R1`,
   añade una línea en blanco y este bloque:

   ```tsx
   describe('#130 R2: entre la tarjeta y cada columna no hay otro nodo', () => {
     it('las siete columnas cuelgan de la fila, y la fila, de la tarjeta', async () => {
       const result = await renderChart(
         makeWeek('2026-09-02', [10, 20, 30, 40, 50, 60, 70]),
       );
       const row = result.getByTestId('weekly-activity-day-row');

       // #130 R2: a wrapper between the card and the columns, accessible or not,
       // turns the lock red, because it could fuse the seven columns into one.
       expect(
         row.children.map((child) =>
           typeof child === 'string' ? child : child.props.testID,
         ),
       ).toEqual([
         'weekly-activity-day-2026-09-02',
         'weekly-activity-day-2026-09-03',
         'weekly-activity-day-2026-09-04',
         'weekly-activity-day-2026-09-05',
         'weekly-activity-day-2026-09-06',
         'weekly-activity-day-2026-09-07',
         'weekly-activity-day-2026-09-08',
       ]);
       expect(row.parent?.props.testID).toBe('weekly-activity-card');
     });
   });
   ```

   El test da el blob `24a5c572d5f7f10f1a65dfd7ffd04a181bc47140`. No añadas
   ningún import: `children` y `parent` son del `TestInstance` que ya devuelve
   `getByTestId`.
2. **La mutación `P2red`**, en la gráfica, dentro de la fila:
   - justo encima de `        {days.map((day, dataIndex) => (` (8 espacios; da
     1 con `grep -c`), la línea `        <View accessible>`;
   - justo debajo de `        ))}`, que es la línea que cierra ese `map` y va
     inmediatamente antes del `          </View>` que cierra la fila, la línea
     `        </View>`.

   La gráfica da el blob `b2487b5380e8c87c463410061db5e27c3adc578f`.
3. La gráfica da `exit=1`: 1 failed y 42 passed de 43.
4. La suite da `exit=1`: 1 failed y 1551 passed de 1552; 1 suite failed y 82
   passed de 83; 1 snapshot passed. El **único** rojo es
   `#130 R2: entre la tarjeta y cada columna no hay otro nodo › las siete columnas cuelgan de la fila, y la fila, de la tarjeta`,
   por `expect(received).toEqual(expected)`. R1 sigue verde, porque las claves
   de la fila no cambian. Si falla otro test, **para**.
5. Commit rojo:

   ```bash
   git add mobile-pet-tracker/src/screens/home/weekly-activity-chart.test.tsx mobile-pet-tracker/src/screens/home/weekly-activity-chart.tsx
   git commit -m "test(mobile): expose a wrapper around the weekly day columns with a versioned mutation (R2)"
   ```

### (2) Verde

1. `git checkout HEAD~1 -- mobile-pet-tracker/src/screens/home/weekly-activity-chart.tsx`.
   La gráfica vuelve a `c258abedde92d2be981be8507d3d898f13c612cb`.
2. La gráfica da 43 de 43, `exit=0`.
3. Commit verde:

   ```bash
   git add mobile-pet-tracker/src/screens/home/weekly-activity-chart.tsx
   git commit -m "test(mobile): lock the weekly day columns as direct children of the row (R2)"
   ```

### (3) Refactor

Ninguno. Los siete `testID` se quedan escritos a mano: generarlos desde
`makeWeek` sería calcular el esperado con la lógica del fixture.

## Sondas

Sobre el árbol final, **una sonda cada vez**:

1. Aplica la mutación de la tabla en la gráfica (o, en `hexbare`, en el test).
2. Comprueba con `git hash-object` que el fichero mutado da el blob de la tabla.
   Si no coincide, la mutación no es la de la spec: corrígela antes de medir.
3. Corre el comando canónico de la gráfica (en `hexbare`, el de la columna
   «Exigido»).
4. Anota `exit`, las cuentas, cada `it` rojo y **la primera línea de su error**:
   `expect(received).<matcher>` es un rojo **por aserción**, y
   `Unable to find an element with testID: …` es un rojo **por consulta**.
5. `git checkout -- mobile-pet-tracker/src/screens/home/weekly-activity-chart.tsx mobile-pet-tracker/src/screens/home/weekly-activity-chart.test.tsx`.
6. `git diff --exit-code -- mobile-pet-tracker/src` da 0.

**Nada de esto se commitea.** La tabla medida va al reporte, con la columna
«medido» rellena por ti.

Convenciones de la tabla:

- «Debajo del `testID`» es justo debajo de `        testID="weekly-activity-day-row"`,
  con 8 espacios, como la línea insertada. «La apertura de la fila» es el
  `          <View` (10 espacios) de justo encima, y «el cierre de la fila», el
  `          </View>` (10 espacios) de justo debajo de `        ))}`. Las props de
  la columna llevan 12 espacios.
- «R1» y «R2» son los dos `it` de #130. «Huecos» es
  `R9: cada columna se anuncia por separado › anuncia los huecos sin colapsar las siete columnas`,
  «día medido» es `R9: … › anuncia el día medido en español e inglés con un botón de 44 pt`,
  «tooltip» es `R8: tocar un día abre su detalle › abre tooltip y panel con las cuatro métricas y propaga la DayEntry completa`
  y «tarjeta» es `#74 R2: … › la tarjeta que lo envuelve tampoco se vuelve un nodo accesible`.
- «Los 9 de #68» son: `R3 › usa el día real de cada fecha en los dos idiomas`
  (por `toEqual`), los dos de `R5` (`separa el guion…` y `usa source aunque…`),
  `R6 › repinta distancia desde la opción pulsada con los mismos datos`, los dos
  de `R9: cada columna…` (`anuncia el día medido…` y `anuncia los huecos…`),
  `R13 › mantiene las siete columnas si al menos un día está medido` (por
  `toHaveLength`) y los dos primeros de `R8` (`abre tooltip…` y `explica un día
  missing…`). Todos por consulta salvo los de `R3` y `R13`.
- Se mide sobre 43 tests. «Hoy» es la misma mutación sobre la base (41 tests):
  va para que el `reviewer` vea qué hueco cierra cada candado.

| Sonda | Mutación | Blob | Hoy (41) | Exigido tras #130 (43) |
|---|---|---|---|---|
| `accessible` | debajo del `testID`, `        accessible` (es `P1red`) | `7e105520` | verde | rojo 1: R1, por `toEqual` |
| `collapse` | debajo del `testID`, `        accessible` y `        accessibilityLabel="Semana"` | `5725c36e` | rojo 1: huecos, por `toBeUndefined` | rojo 2: huecos (`toBeUndefined`) y R1 (`toEqual`) |
| `label` | debajo del `testID`, `        accessibilityLabel="Semana"` | `50aec0de` | rojo 1: huecos | rojo 2: huecos y R1 |
| `arialabel` | debajo del `testID`, `        aria-label="Semana"` | `47a90532` | verde | rojo 1: R1, por `toEqual`. El diff enseña la clave `aria-label` |
| `ifano` | debajo del `testID`, `        importantForAccessibility="no"` | `e9b6534f` | verde | rojo 1: R1, por `toEqual` |
| `hide` | debajo del `testID`, `        importantForAccessibility="no-hide-descendants"` | `a0742870` | rojo 9: los 9 de #68 | rojo 11: los 9 de #68, y R1 y R2 **por consulta** (`Unable to find an element with testID: weekly-activity-day-row`) |
| `ariahidden` | debajo del `testID`, `        aria-hidden` | `d01ae732` | rojo 9: los 9 de #68 | rojo 11, como `hide` |
| `role` | debajo del `testID`, `        accessibilityRole="button"` | `753ff216` | verde | rojo 1: R1, por `toEqual` |
| `rolealias` | debajo del `testID`, `        role="button"` | `ace49dc2` | verde | rojo 1: R1, por `toEqual` |
| `rowpress` | la apertura de la fila pasa a `          <Pressable`; debajo del `testID`, `        onPress={() => undefined}`; el cierre de la fila pasa a `          </Pressable>` | `81ebf27b` | verde | rojo 1: R1, por `toEqual` |
| `wrapout` | encima de la apertura de la fila, `          <View accessible>`; debajo del cierre de la fila, `          </View>` | `cf839e32` | verde | rojo 1: R2, por `toBe` |
| `wrapin` | la de `P2red` ([[tasks]] §R2) | `b2487b53` | verde | rojo 1: R2, por `toEqual` |
| `extra` | encima de `        {days.map((day, dataIndex) => (`, `        <Text>Semana</Text>` | `5049a9a4` | verde | rojo 1: R2, por `toEqual` |
| `flexcol` | debajo del `testID`, `        className="flex-row"` pasa a `        className="flex-col"` | `99ec492b` | verde | **verde**, 43/43: hueco declarado, (F) |
| `nopad` | `          paddingLeft: CHART_PAD_LEFT,` pasa a `          paddingLeft: 0,` | `9cb81179` | verde | **verde**, 43/43: hueco declarado, (F) |
| `colnoacc` | en la columna, el `            accessible` de justo encima de `            accessibilityRole="button"` pasa a `            accessible={false}` | `b1655220` | rojo 1: día medido, por `toBe` | igual |
| `colnorole` | se borra `            accessibilityRole="button"` | `ed797d75` | rojo 1: día medido, por `toBe` | igual |
| `colnostate` | se borran las tres líneas de `            accessibilityState={{` a su `            }}` | `6b4aa45d` | rojo 1: tooltip, por `toEqual` | igual |
| `cardacc` | `<Card testID="weekly-activity-card" className="gap-2">` pasa a `<Card testID="weekly-activity-card" accessible className="gap-2">` | `8fc10f1c` | rojo 1: tarjeta | igual |
| `cardpress` | la misma línea pasa a `<Card testID="weekly-activity-card" className="gap-2" onPress={() => undefined}>` | `2a460368` | rojo 1: tarjeta | igual |
| `hexbare` | **en el test**, `// #130 R1: a closed key list` pasa a `// #130: a closed key list` | `658a4ee1` | no aplica | `bunx jest --runTestsByPath src/__tests__/design-drift.test.ts`: `exit=1`, 1 failed de 55, `#68 R18: la actividad semanal no mete drift de estilo › keeps arbitrary text, hex colors, and StyleSheet out of feature sources` |

Si una fila da otro veredicto, **para** y repórtalo con el log. No ajustes la
aserción para que case.

## R3 — Cierre

1. Suite completa, sin pipe: 83 suites / 1552 tests / 1 snapshot, `exit=0`, o
   la base que mediste en §Antes de tocar nada más 2 tests y 0 suites. La
   gráfica, 43 de 43. Los tres `it` de `R9: cada columna se anuncia por separado`,
   verdes.
2. `test ! -e .expo/types/router.d.ts && bunx tsc --noEmit > /tmp/130_tsc.log 2>&1; echo "exit=$?"`
   da `exit=0`.
3. `bunx eslint src/screens/home/weekly-activity-chart.tsx src/screens/home/weekly-activity-chart.test.tsx > /tmp/130_lint.log 2>&1; echo "exit=$?"`
   da `exit=0`.
4. Las cifras de candado:
   - `grep -c "style={CONTINUOUS_CORNER}" src/screens/home/weekly-activity-chart.tsx` da 1;
   - `grep -c "style={TABULAR_NUMS}" src/screens/home/weekly-activity-chart.tsx` da 4;
   - `grep -c 'accessibilityRole="radiogroup"' src/screens/home/weekly-activity-chart.tsx` da 1;
   - `grep -c "Platform" src/screens/home/weekly-activity-chart.tsx` da 0;
   - `grep -ciE "stylesheet|text-\[10px\]" src/screens/home/weekly-activity-chart.tsx src/screens/home/weekly-activity-chart.test.tsx`
     da 0 en los dos;
   - `grep -c "use-api" src/screens/home/weekly-activity-chart.test.tsx` da 1:
     la línea `expect(source).not.toContain('use-api');` que ya estaba, y que
     `#87 R19` espera como única huella;
   - `grep -c "weekly-activity-day-row" src/screens/home/weekly-activity-chart.test.tsx`
     pasa de 1 a 3;
   - `grep -c "^describe('#130 R" src/screens/home/weekly-activity-chart.test.tsx` da 2;
   - `grep -c "#130" src/screens/home/weekly-activity-chart.test.tsx` y
     `grep -c "#130 R[12]:" src/screens/home/weekly-activity-chart.test.tsx`
     dan 4 los dos: dos títulos y dos comentarios, ningún `#130` suelto.
5. Desde la raíz del repo:
   - `git diff --stat origin/main...HEAD -- mobile-pet-tracker/` lista **solo**
     el test;
   - `git diff --exit-code origin/main...HEAD -- mobile-pet-tracker/src/screens/home/weekly-activity-chart.tsx mobile-pet-tracker/package.json mobile-pet-tracker/bun.lock mobile-pet-tracker/src/i18n/catalog.ts mobile-pet-tracker/src/components/card.tsx`
     da 0.
6. Blobs finales:

   | Ruta | Blob |
   |---|---|
   | `src/screens/home/weekly-activity-chart.tsx` | `c258abedde92d2be981be8507d3d898f13c612cb` (el de base) |
   | `src/screens/home/weekly-activity-chart.test.tsx` | `24a5c572d5f7f10f1a65dfd7ffd04a181bc47140` |

7. Escribe `progress/impl_mobile-weekly-day-row-accessible-lock.md` con:
   - la base medida;
   - las salidas de cada rojo y cada verde (cuentas, `exit` y los `it` rojos con
     su matcher);
   - la tabla de §Sondas, con la columna «medido»;
   - los blobs y los números de R3.

   Rellena los hashes en [[traceability]]. La fila de R3 cita el hash del
   **verde de R2**, que es el último commit de código, no el de este commit.
   Commitea:

   ```bash
   git add progress/impl_mobile-weekly-day-row-accessible-lock.md specs/mobile-weekly-day-row-accessible-lock/traceability.md
   git commit -m "docs(mobile): record the weekly day row lock evidence (R3)"
   ```

   No rebasees después: los hashes de la tabla dejarían de valer.

## Lo que NO hay que tocar

- La gráfica, salvo en los dos commits rojos, y siempre revertida en el verde
  siguiente.
- Los `describe` de #68 y de #74 del test, incluido
  `R9: cada columna se anuncia por separado`, y sus helpers y mocks
  (`renderChart`, `makeWeek`, `makeDay`, `mockTheme` y el resto).
- `src/components/card.tsx`, `src/screens/home/index.tsx` e `index.test.tsx`.
- `src/__tests__/design-drift.test.ts` y `src/__tests__/consistency-classnames.test.ts`:
  la sesión Backend toca el primero en #100.
- `src/i18n/catalog.ts`, `src/providers/__tests__/language-provider.test.tsx` y
  `src/__tests__/ui-copy-table.ts`: no hay copy nueva.
- `package.json` y `bun.lock`: no hay dependencia nueva.

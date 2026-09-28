---
feature: "mobile-metric-selector-a11y"
status: spec_ready         # draft | spec_ready | approved
tags: [spec, mobile, a11y, deuda]
---

# Tareas — [[mobile-metric-selector-a11y]] (#74)

> Orden TDD por requisito: (1) test rojo, (2) implementación mínima,
> (3) refactor. R1, y R3 con la opción B, tienen rojo natural. R2, y R3 con la
> opción A, se escriben sobre código que ya cumple, así que su rojo es una
> **mutación de producción versionada** en el commit rojo, que el verde revierte
> con `git checkout HEAD~1 --` (C4, vía **b**). Nunca un `ReferenceError` ni un
> doble de test mutado.
>
> Cada requisito crea su sujeto antes de aseverarlo. El contenedor, la tarjeta y
> las etiquetas ya existen en la base. El rol que R2 incluye en su lista lo crea
> R1, que va antes.
>
> Las rutas son relativas a `mobile-pet-tracker/` salvo que empiecen por
> `docs/`, `specs/` o `progress/`. Los números de línea **no son anclas**: todo
> se localiza por contenido, con el `grep` que se cita. «La gráfica» es
> `src/screens/home/weekly-activity-chart.tsx` y «el test» es
> `src/screens/home/weekly-activity-chart.test.tsx`.

## Antes de tocar nada

1. `git branch --show-current` da `feature/74-mobile-metric-selector-a11y`. Si
   no, **para**.
2. Lee la casilla de [[requirements]] §Aprobación. Tiene que decir **A** o
   **B** en «opción de R3». Si está vacía o dice otra cosa, **para**. Todo lo
   que en este fichero va marcado «con A» o «con B» se aplica solo para esa
   opción.
3. `cd mobile-pet-tracker && test ! -e .expo/types/router.d.ts; echo "exit=$?"`
   da `exit=0`. Si da 1, **para** y avisa al humano: el fichero está gitignorado
   y rompe `tsc` con rutas fantasma. No lo borres tú, porque tu sandbox lo
   deniega (#121).
4. Carga la skill `building-native-ui` de tu plugin `expo`. Todo se instala y se
   corre con `bun` y `bunx`, nunca con `npm` ni `npx`. Esta feature no instala
   nada. No corras `./init.sh` ni los e2e.
5. Blobs de base, con `git hash-object <ruta>`:

   | Ruta | Blob |
   |---|---|
   | `src/screens/home/weekly-activity-chart.tsx` | `128c09bd9a6e5aa55bdcbedbd4a67e23f956044b` |
   | `src/screens/home/weekly-activity-chart.test.tsx` | `bc8e8fd93da7f4ec8a70291963ba7dfda97fe164` |
   | `src/components/card.tsx` | `ca32acdee8123e203405c4bffa78ad35c15be216` |

   Si alguno no coincide, **para**: la base se movió, y las cuentas, los blobs y
   las sondas de esta spec ya no valen.
6. Mide la base con los dos comandos canónicos, **sin pipe**:

   ```bash
   bunx jest --runTestsByPath src/screens/home/weekly-activity-chart.test.tsx > /tmp/74_chart.log 2>&1; echo "exit=$?"
   bunx jest > /tmp/74_full.log 2>&1; echo "exit=$?"
   grep -E "^(Tests|Test Suites|Snapshots):" /tmp/74_chart.log /tmp/74_full.log
   ```

   Esperado: la gráfica da 36 passed de 36, `exit=0`. La suite da 83 passed de
   83 suites, 1532 passed de 1532 tests y 1 snapshot, `exit=0`. Si la suite da
   otra cifra con `exit=0`, **anota la medida** y úsala como base: el delta
   exigido es +5 tests y +0 suites sobre lo medido. Nunca pongas `| tail` ni
   `| grep` detrás de `jest`, porque el `exit` sería el del último comando.
   En el log de la suite aparecen bloques `● Console` (30 en la base). Son
   ruido y no cuentan como fallo.

7. **Reglas de literales en los dos ficheros**, comentarios incluidos, por
   `#68 R18` ([[design]] §Los guards):
   - un `#` solo puede ir seguido de dos o tres dígitos, un espacio y `R<n>`
     (`#74 R3`). Nada de `#120`, `#123` ni `#add`;
   - ni `StyleSheet` ni `text-[10px]`, en ningún caso;
   - ni `use-api` ni `useApi` en los bloques nuevos (`#87 R19`).

## R1 — El contenedor del selector se anuncia como `radiogroup`

### (1) Rojo

1. Al final del test, después del `});` que cierra
   `describe('R8: tocar un día abre su detalle'`, añade una línea en blanco y
   este bloque:

   ```tsx
   describe('#74 R1: el contenedor del selector se anuncia como grupo de opciones', () => {
     it('declara el rol radiogroup en el contenedor de las tres opciones', async () => {
       const result = await renderChart(
         makeWeek('2026-09-02', [10, 20, 30, 40, 50, 60, 70]),
       );

       // #74 R1: getByRole skips a View that is not accessible, so the role is
       // read from the host props of the container.
       expect(
         result.getByTestId('weekly-activity-metric').props.accessibilityRole,
       ).toBe('radiogroup');
     });
   });
   ```

   El fichero acaba en un solo salto de línea. `git hash-object` del test da
   `567bc3732ce672e10fbd483c46e5659b6e548fcb`.
2. La gráfica da `exit=1`: 1 failed y 36 passed de 37.
3. La suite da `exit=1`: 1 failed y 1532 passed de 1533, 1 failed y 82 passed
   de 83 suites, 1 snapshot. El **único** test rojo es
   `#74 R1: el contenedor del selector se anuncia como grupo de opciones › declara el rol radiogroup en el contenedor de las tres opciones`,
   por `expect(received).toBe`. Si falla otro test, o este falla por otro
   matcher, **para**.
4. Commit rojo, solo el test:

   ```bash
   git add mobile-pet-tracker/src/screens/home/weekly-activity-chart.test.tsx
   git commit -m "test(mobile): expect the metric selector to be a radiogroup (R1)"
   ```

### (2) Verde

1. En la gráfica, localiza la línea con `grep -n 'testID="weekly-activity-metric"' src/screens/home/weekly-activity-chart.tsx`
   (una sola). Justo debajo, con la misma sangría de 6 espacios, inserta:

   ```tsx
         accessibilityRole="radiogroup"
   ```

   La gráfica da el blob `e8e6633b601a3fd52064593bd37bb61e942d4368`.
2. La gráfica da 37 de 37, `exit=0`.
3. Commit verde:

   ```bash
   git add mobile-pet-tracker/src/screens/home/weekly-activity-chart.tsx
   git commit -m "fix(mobile): announce the metric selector as a radiogroup (R1)"
   ```

### (3) Refactor

Ninguno.

## R2 — El grupo y la tarjeta no colapsan las tres opciones

### (1) Rojo

1. Al final del test, después del `});` del `describe` de R1, añade una línea en
   blanco y este bloque:

   ```tsx
   describe('#74 R2: el grupo del selector no colapsa sus tres opciones', () => {
     it('el contenedor solo lleva su rol, su testID, su clase y sus hijos', async () => {
       const result = await renderChart(
         makeWeek('2026-09-02', [10, 20, 30, 40, 50, 60, 70]),
       );

       // #74 R2: a closed key list, so accessible, accessibilityLabel, aria-label,
       // importantForAccessibility or any other new prop turns the lock red.
       expect(
         Object.keys(result.getByTestId('weekly-activity-metric').props).sort(),
       ).toEqual(['accessibilityRole', 'children', 'className', 'testID']);
     });

     it('la tarjeta que lo envuelve tampoco se vuelve un nodo accesible', async () => {
       const result = await renderChart(
         makeWeek('2026-09-02', [10, 20, 30, 40, 50, 60, 70]),
       );

       expect(
         Object.keys(result.getByTestId('weekly-activity-card').props).sort(),
       ).toEqual(['children', 'className', 'style', 'testID']);
     });
   });
   ```

   El test da el blob `c0ec0cb8a0a560962ac1dc7a5fe4120b2488bef2`.
2. **La mutación `P2red`**, en la gráfica:
   - justo debajo de `      accessibilityRole="radiogroup"`, con 6 espacios,
     las dos líneas `      accessible` y `      accessibilityLabel="Metrica"`;
   - `<Card testID="weekly-activity-card" className="gap-2">` pasa a
     `<Card testID="weekly-activity-card" accessible className="gap-2">`.

   La gráfica da el blob `e82cb3551816d24990cf24b8965f104df0775e0d`.
3. La gráfica da `exit=1`: 2 failed y 37 passed de 39.
4. La suite da `exit=1`: 2 failed y 1533 passed de 1535, 83 suites, 1 snapshot.
   Los **únicos** rojos son los dos `it` de
   `#74 R2: el grupo del selector no colapsa sus tres opciones`, los dos por
   `expect(received).toEqual`. Si falla otro test, **para**.
5. Commit rojo, con los dos ficheros:

   ```bash
   git add mobile-pet-tracker/src/screens/home/weekly-activity-chart.test.tsx mobile-pet-tracker/src/screens/home/weekly-activity-chart.tsx
   git commit -m "test(mobile): expose the metric selector collapse with a versioned mutation (R2)"
   ```

### (2) Verde

1. `git checkout HEAD~1 -- mobile-pet-tracker/src/screens/home/weekly-activity-chart.tsx`.
   La gráfica vuelve a `e8e6633b601a3fd52064593bd37bb61e942d4368`.
2. La gráfica da 39 de 39, `exit=0`.
3. Commit verde:

   ```bash
   git add mobile-pet-tracker/src/screens/home/weekly-activity-chart.tsx
   git commit -m "test(mobile): lock the metric selector group against collapsing (R2)"
   ```

### (3) Refactor

Ninguno. Las dos listas son literales del test y no se extraen a un helper.

## R3 — El ajuste y el suelo de las etiquetas, por plataforma

### (1) Rojo

1. En el test, justo debajo de `import type { ReactNode } from 'react';`,
   inserta:

   ```tsx
   import { Platform } from 'react-native';
   ```

2. Al final del test, después del `});` del `describe` de R2, añade una línea en
   blanco y este bloque. La primera fila del `it.each` depende de la opción:
   **con A** es `['android', true],` y **con B** es `['android', false],`.
   Aquí va escrita la de A:

   ```tsx
   describe('#74 R3: el ajuste y el suelo de las etiquetas del selector, por plataforma', () => {
     const originalPlatform = Platform.OS;

     afterEach(() => {
       Object.defineProperty(Platform, 'OS', {
         configurable: true,
         value: originalPlatform,
       });
     });

     it.each([
       ['android', true],
       ['ios', true],
     ])(
       '%s: ajuste %s, escala mínima 0.85 y tope 1.2 en las tres etiquetas',
       async (os, fits) => {
         Object.defineProperty(Platform, 'OS', { configurable: true, value: os });
         const result = await renderChart(
           makeWeek('2026-09-02', [10, 20, 30, 40, 50, 60, 70]),
         );

         expect(
           WEEKLY_METRICS.map((metric) => {
             const { props } = result.getByTestId(
               `weekly-activity-metric-label-${metric}`,
             );

             return [
               props.adjustsFontSizeToFit,
               props.minimumFontScale,
               props.maxFontSizeMultiplier,
             ];
           }),
         ).toEqual([
           [fits, 0.85, 1.2],
           [fits, 0.85, 1.2],
           [fits, 0.85, 1.2],
         ]);
       },
     );
   });
   ```

   `WEEKLY_METRICS` ya se importa en el test. El test da el blob
   `ce1685a5c52c88a15e6158774708e8753506f0fa` **con A** y
   `7409af1e6397f0918d6685e9315ea59b6603803e` **con B**.

3. **Con A**, aplica la mutación `P3redA` en la gráfica: borra la línea
   `              minimumFontScale={METRIC_LABEL_MIN_FONT_SCALE}` (una sola:
   `grep -c "minimumFontScale={METRIC_LABEL_MIN_FONT_SCALE}"` da 1). La gráfica
   da el blob `32de788668a0d8e88583550374d605cd3eeb3e5f`.

   **Con B**, la gráfica no cambia: sigue en `e8e6633b…`.

4. La gráfica da `exit=1`:
   - **con A**, 2 failed y 39 passed de 41. Los rojos son
     `… › android: ajuste true, escala mínima 0.85 y tope 1.2 en las tres etiquetas`
     y `… › ios: ajuste true, escala mínima 0.85 y tope 1.2 en las tres etiquetas`;
   - **con B**, 1 failed y 40 passed de 41. El rojo es
     `… › android: ajuste false, escala mínima 0.85 y tope 1.2 en las tres etiquetas`.
5. La suite da `exit=1`, con 83 suites y 1 snapshot: **con A**, 2 failed de
   1537, y **con B**, 1 failed de 1537. Los únicos rojos son los del paso 4,
   todos por `expect(received).toEqual`. Si falla otro test, **para**.
6. Commit rojo:

   ```bash
   # Con A: el test y la gráfica mutada.
   git add mobile-pet-tracker/src/screens/home/weekly-activity-chart.test.tsx mobile-pet-tracker/src/screens/home/weekly-activity-chart.tsx
   git commit -m "test(mobile): lock the metric label fit and floor per platform (R3)"

   # Con B: solo el test.
   git add mobile-pet-tracker/src/screens/home/weekly-activity-chart.test.tsx
   git commit -m "test(mobile): expect the metric labels not to shrink on Android (R3)"
   ```

### (2) Verde

**Con A:**

1. `git checkout HEAD~1 -- mobile-pet-tracker/src/screens/home/weekly-activity-chart.tsx`.
   La gráfica vuelve a `e8e6633b…`.
2. Justo encima de `const METRIC_LABEL_MIN_FONT_SCALE = 0.85;`, sin línea en
   blanco entre medias, inserta:

   ```tsx
   // Android ignores minimumFontScale: RN 0.86.2 only reads minimumFontSize, which
   // <Text> does not expose, so the shrink floor there is 4 dp (#74 R3).
   ```

   La gráfica da el blob `c258abedde92d2be981be8507d3d898f13c612cb`.
3. Commit: `fix(mobile): document the Android shrink floor of the metric labels (R3)`.

**Con B:**

1. En el import de `react-native` de la gráfica, añade `  Platform,` justo
   encima de `  Pressable,`.
2. Justo encima de `const METRIC_LABEL_MIN_FONT_SCALE = 0.85;`, sin línea en
   blanco entre medias, inserta:

   ```tsx
   // Android ignores minimumFontScale: RN 0.86.2 only reads minimumFontSize, which
   // <Text> does not expose, so labels truncate there instead of shrinking (#74 R3).
   ```

3. En el `Text` de la etiqueta, la línea `              adjustsFontSizeToFit`
   (sola: `grep -c "^              adjustsFontSizeToFit$"` da 1) pasa a
   `              adjustsFontSizeToFit={Platform.OS !== 'android'}`.

   La gráfica da el blob `8d051f1b86e6302286705a4fd9f95f9763e140d7`.
4. Commit: `fix(mobile): stop shrinking the metric labels on Android (R3)`.

En las dos opciones, la gráfica da 41 de 41, `exit=0`, y el commit lleva solo
la gráfica:

```bash
git add mobile-pet-tracker/src/screens/home/weekly-activity-chart.tsx
git commit -m "<el mensaje de tu opción>"
```

El `reviewer` verifica el comentario con
`grep -n "Android ignores minimumFontScale" src/screens/home/weekly-activity-chart.tsx`,
que da una línea. La siguiente es la segunda línea del comentario, y la de
después, `const METRIC_LABEL_MIN_FONT_SCALE = 0.85;`.

### (3) Refactor

Ninguno. **Con B**, no uses `process.env.EXPO_OS` en lugar de `Platform.OS`,
aunque tu skill lo prefiera: el test no podría cambiar la plataforma por fila
([[design]] §R3).

## R4 — Fuera el `jest.mock('uniwind')` muerto

1. En el test, borra el bloque de cuatro líneas que empieza en
   `jest.mock('uniwind', () => ({` y acaba en el `}));` siguiente, y la línea en
   blanco que lo sigue. Nada más.
2. Comprueba:
   - `grep -c "jest.mock('uniwind'" src/screens/home/weekly-activity-chart.test.tsx` da 0;
   - `grep -c "useUniwind" src/screens/home/weekly-activity-chart.test.tsx` da 0;
   - `grep -c "mockTheme" src/screens/home/weekly-activity-chart.test.tsx` da 5;
   - el test da el blob `d9687b162d20a2905b20f3c06158c619cb440d7a` **con A** y
     `ecba896bbdd4900ba135dc92887f9a2d6af3c5a8` **con B**.
3. La gráfica da 41 de 41, `exit=0`.
4. Commit:

   ```bash
   git add mobile-pet-tracker/src/screens/home/weekly-activity-chart.test.tsx
   git commit -m "test(mobile): drop the dead uniwind mock (R4)"
   ```

## Sondas

Sobre el árbol final, **una sonda cada vez**:

1. Aplica la mutación de la tabla en la gráfica.
2. Comprueba con `git hash-object src/screens/home/weekly-activity-chart.tsx` que
   da el blob de tu opción. Si no coincide, la mutación no es la de la spec:
   corrígela antes de medir.
3. Corre el comando canónico de la gráfica.
4. Anota `exit`, las cuentas y cada `it` rojo con su matcher.
5. `git checkout -- mobile-pet-tracker/src/screens/home/weekly-activity-chart.tsx`.
6. `git diff --exit-code -- mobile-pet-tracker/src` da 0.

**Nada de esto se commitea.** La tabla medida va al reporte, con la columna
«medido» rellena por ti.

Convenciones de la tabla:

- Las props del contenedor llevan 6 espacios de sangría y las de la etiqueta,
  14. Cada línea insertada lleva la sangría de su vecina.
- «Contenedor» es `#74 R2 … › el contenedor solo lleva su rol, su testID, su clase y sus hijos`.
  «Tarjeta» es `#74 R2 … › la tarjeta que lo envuelve tampoco se vuelve un nodo accesible`.
  «R1» es `#74 R1 … › declara el rol radiogroup en el contenedor de las tres opciones`.
  «Las dos filas» son las dos del `it.each` de `#74 R3`, y «la fila android», la
  primera.
- Todos los rojos de `#74` son por `toEqual`, salvo R1, que es por `toBe`.
- Se mide sobre 41 tests.

| Sonda | Mutación | Blob con A | Blob con B | Exigido |
|---|---|---|---|---|
| `collapse` | debajo de `accessibilityRole="radiogroup"`, las líneas `accessible` y `accessibilityLabel="Metrica"` | `7a89e8e7` | `d0370143` | rojo, 1: contenedor |
| `accessible` | debajo de `accessibilityRole="radiogroup"`, la línea `accessible` | `8ed18a4a` | `c9e7a329` | rojo, 1: contenedor |
| `arialabel` | debajo de `accessibilityRole="radiogroup"`, la línea `aria-label="Metrica"` | `43b2d1ac` | `0c1ce532` | rojo, 1: contenedor. El diff del `toEqual` enseña la clave `aria-label` |
| `rolealias` | `accessibilityRole="radiogroup"` pasa a `role="radiogroup"` | `010f7e73` | `896fa203` | rojo, 2: R1 y contenedor |
| `hide` | debajo de `accessibilityRole="radiogroup"`, la línea `importantForAccessibility="no-hide-descendants"` | `93a80942` | `dc0f3e67` | rojo, 10: R1, contenedor, las dos filas y seis de #68 (tres de `R6: el selector cambia de métrica sin volver a pedir nada`, `R9: el selector sigue el tema de la app`, `R12` y `R13`) |
| `noRole` | se borra la línea `accessibilityRole="radiogroup"` | `b34cc1ce` | `5408a2a7` | rojo, 2: R1 y contenedor |
| `cardacc` | `<Card testID="weekly-activity-card" className="gap-2">` pasa a `<Card testID="weekly-activity-card" accessible className="gap-2">` | `8fc10f1c` | `ca53cb0a` | rojo, 1: tarjeta |
| `cardpress` | la misma línea pasa a `<Card testID="weekly-activity-card" className="gap-2" onPress={() => undefined}>` | `2a460368` | `07eb0afe` | rojo, 1: tarjeta |
| `nomfs` | se borra la línea `minimumFontScale={METRIC_LABEL_MIN_FONT_SCALE}` | `19a29055` | `a6952ee9` | rojo, 2: las dos filas |
| `mfs05` | `const METRIC_LABEL_MIN_FONT_SCALE = 0.85;` pasa a `0.5` | `808d9db8` | `517ff5f6` | rojo, 2: las dos filas |
| `nomaxm` | se borra la línea `maxFontSizeMultiplier={METRIC_LABEL_MAX_FONT_SIZE_MULTIPLIER}` | `334e570a` | `adde08ed` | rojo, 2: las dos filas |
| `branch` (solo A) | la rama de B: `Platform` en el import y `adjustsFontSizeToFit={Platform.OS !== 'android'}`, sin el comentario | `8b9d19fa` | | rojo, 1: la fila android |
| `nobranch` (solo B) | se quitan `Platform` del import y la rama: `adjustsFontSizeToFit` a secas | | `454a50ee` | rojo, 1: la fila android |
| `inverted` (solo B) | `Platform.OS !== 'android'` pasa a `Platform.OS === 'android'` | | `f20f936b` | rojo, 3: las dos filas y `R6: … › ofrece tres opciones accesibles y mantiene cada etiqueta en una línea` |

Si una fila da otro veredicto, **para** y repórtalo con el log. No ajustes la
aserción para que case.

## R5 — Cierre

1. Suite completa, sin pipe: 83 suites / 1537 tests / 1 snapshot, `exit=0`, o
   la base que mediste en §Antes de tocar nada más 5 tests y 0 suites. La
   gráfica, 41 de 41.
2. `test ! -e .expo/types/router.d.ts && bunx tsc --noEmit > /tmp/74_tsc.log 2>&1; echo "exit=$?"`
   da `exit=0`.
3. `bunx eslint src/screens/home/weekly-activity-chart.tsx src/screens/home/weekly-activity-chart.test.tsx > /tmp/74_lint.log 2>&1; echo "exit=$?"`
   da `exit=0`.
4. Las cifras de candado, que no se mueven:
   - `grep -c "style={CONTINUOUS_CORNER}" src/screens/home/weekly-activity-chart.tsx` da 1;
   - `grep -c "style={TABULAR_NUMS}" src/screens/home/weekly-activity-chart.tsx` da 4;
   - `grep -c 'accessibilityRole="radiogroup"' src/screens/home/weekly-activity-chart.tsx` da 1;
   - `grep -c "Platform" src/screens/home/weekly-activity-chart.tsx` da 0 **con A**
     y 2 **con B**;
   - `grep -ciE "stylesheet|text-\[10px\]" src/screens/home/weekly-activity-chart.tsx src/screens/home/weekly-activity-chart.test.tsx`
     da 0 en los dos;
   - `grep -c "use-api" src/screens/home/weekly-activity-chart.test.tsx` da 1:
     la línea `expect(source).not.toContain('use-api');` que ya estaba, y que
     `#87 R19` espera como única huella.
5. Desde la raíz del repo:
   - `git diff --stat origin/main...HEAD -- mobile-pet-tracker/` lista solo los
     dos ficheros de la gráfica;
   - `git diff --exit-code origin/main...HEAD -- mobile-pet-tracker/package.json mobile-pet-tracker/bun.lock mobile-pet-tracker/src/i18n/catalog.ts mobile-pet-tracker/src/components/card.tsx`
     da 0.
6. Blobs finales:

   | Ruta | Con A | Con B |
   |---|---|---|
   | `src/screens/home/weekly-activity-chart.tsx` | `c258abedde92d2be981be8507d3d898f13c612cb` | `8d051f1b86e6302286705a4fd9f95f9763e140d7` |
   | `src/screens/home/weekly-activity-chart.test.tsx` | `d9687b162d20a2905b20f3c06158c619cb440d7a` | `ecba896bbdd4900ba135dc92887f9a2d6af3c5a8` |

7. Escribe `progress/impl_mobile-metric-selector-a11y.md` con:
   - la opción de R3 que aplicaste;
   - la base medida;
   - las salidas de cada rojo y cada verde (cuentas, `exit` y los `it` rojos);
   - la tabla de §Sondas, con la columna «medido»;
   - los blobs y los números de R5.

   Rellena los hashes en [[traceability]] y commitea:

   ```bash
   git add progress/impl_mobile-metric-selector-a11y.md specs/mobile-metric-selector-a11y/traceability.md
   git commit -m "docs(mobile): record the metric selector a11y evidence (R5)"
   ```

   No rebasees después: los hashes de la tabla dejarían de valer.

## R6 — Gate humano de TalkBack

No es tuyo. Lo corre el humano con los pasos de [[requirements]] §Prueba de humo
del humano, después del veredicto del `reviewer`.

## Lo que NO hay que tocar

- `src/screens/home/index.tsx` e `index.test.tsx`: la sesión Backend trabaja #77
  ahí.
- `src/components/card.tsx`.
- Los `describe` de #68 del test, incluidos los dos que se titulan «R9», y los
  mocks que no son el de `uniwind`: `mockTheme`, el de
  `../../theme/use-theme-colors` y el resto.
- `src/i18n/catalog.ts`, `src/providers/__tests__/language-provider.test.tsx` y
  `src/__tests__/ui-copy-table.ts`: no hay copy nueva.
- `src/__tests__/design-drift.test.ts` y `src/__tests__/consistency-classnames.test.ts`.
- `package.json` y `bun.lock`: no hay dependencia nueva.
- Los ficheros nativos y la configuración de la app: el gate R6 usa el dev
  build ya instalado.

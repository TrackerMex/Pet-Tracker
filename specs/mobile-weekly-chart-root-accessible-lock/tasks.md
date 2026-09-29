---
feature: "mobile-weekly-chart-root-accessible-lock"
status: approved         # draft | spec_ready | approved
tags: [spec, mobile, a11y, deuda]
---

# Tareas — [[mobile-weekly-chart-root-accessible-lock]] (#132)

> Orden TDD por requisito: (1) test rojo, (2) implementación mínima,
> (3) refactor. R1 se escribe sobre código que ya cumple, así que su rojo es
> una **mutación de producción versionada** en el commit rojo, que el verde
> revierte con `git checkout HEAD~1 --` (C4, vía **b**). Nunca un
> `ReferenceError` ni un doble de test mutado.
>
> R1 crea su sujeto antes de aseverarlo: el centinela `chart-parent` lo monta
> el propio `it`, y la tarjeta ya existe en la base.
>
> Las rutas son relativas a `mobile-pet-tracker/` salvo que empiecen por
> `docs/`, `specs/` o `progress/`, o se diga «desde la raíz». Los números de
> línea **no son anclas**: todo se localiza por contenido, con el `grep` que se
> cita. «La gráfica» es `src/screens/home/weekly-activity-chart.tsx`, «el
> test» es `src/screens/home/weekly-activity-chart.test.tsx` y «la Home» es
> `src/screens/home/index.test.tsx`. Ninguna ruta de esta feature lleva
> paréntesis.

## Antes de tocar nada

1. `git branch --show-current` da `feature/132-mobile-weekly-chart-root-accessible-lock`.
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
   | `src/screens/home/weekly-activity-chart.test.tsx` | `24a5c572d5f7f10f1a65dfd7ffd04a181bc47140` |

   Si alguno no coincide, **para**: la base se movió (por ejemplo, porque #131
   mergeó antes), y los blobs y las sondas de esta spec ya no valen.
6. Mide la base con los tres comandos canónicos, **sin pipe**:

   ```bash
   bunx jest --runTestsByPath src/screens/home/weekly-activity-chart.test.tsx > /tmp/132_chart.log 2>&1; echo "exit=$?"
   bunx jest --runTestsByPath src/screens/home/weekly-activity-chart.test.tsx src/screens/home/index.test.tsx > /tmp/132_probe.log 2>&1; echo "exit=$?"
   bunx jest > /tmp/132_full.log 2>&1; echo "exit=$?"
   grep -E "^(Tests|Test Suites|Snapshots):" /tmp/132_chart.log /tmp/132_probe.log /tmp/132_full.log
   ```

   Esperado:
   - la gráfica: `Test Suites: 1`, 43 passed de 43, `exit=0`;
   - la corrida de sondas: `Test Suites: 2`, 202 passed de 202 (43 de la gráfica
     y 159 de la Home), `exit=0`;
   - la suite: 83 passed de 83 suites, 1552 passed de 1552 tests y 1 snapshot,
     `exit=0`.

   Si la suite da otra cifra con `exit=0` (por ejemplo, porque #100 mergeó
   antes), **anota la medida** y úsala como base: el delta exigido es +1 test y
   +0 suites sobre lo medido, y los «N failed de M» del rojo se desplazan igual.
   Si la gráfica o la Home dan otra cifra, **para**. Nunca pongas `| tail` ni
   `| grep` detrás de `jest`, porque el `exit` sería el del último comando. En
   el log de la suite aparecen bloques `● Console` (30 en la base). Son ruido y
   no cuentan como fallo. Si el log repite una línea `FAIL` o un `it` rojo en el
   resumen final, es el mismo rojo: los rojos se cuentan por la línea `Tests:`.
7. **Reglas de literales en el test**, comentarios incluidos, por `#68 R18`
   (`src/__tests__/design-drift.test.ts`):
   - un `#` solo puede ir seguido de dos o tres dígitos, un espacio y `R<n>`
     (`#132 R1`). Nada de `#132` suelto: medido, rompe `#68 R18`;
   - ni `StyleSheet` ni `text-[10px]`, en ningún caso;
   - ni `use-api` ni `useApi` en el bloque nuevo (`#87 R19`).

## R1 — La tarjeta es la raíz host de lo que pinta la gráfica

### (1) Rojo

1. Al final del test, después del `});` que cierra
   `describe('#130 R2: entre la tarjeta y cada columna no hay otro nodo'`
   (es el último `describe` del fichero: `grep -n "^describe(" src/screens/home/weekly-activity-chart.test.tsx | tail -1`),
   añade una línea en blanco y este bloque:

   ```tsx
   describe('#132 R1: la tarjeta es la raíz host de lo que pinta la gráfica', () => {
     it('entre el nodo que monta la gráfica y la tarjeta no hay ningún otro', async () => {
       const { View } = jest.requireActual<typeof import('react-native')>(
         'react-native',
       );
       const result = await render(
         <ChartWrapper language="es">
           <View testID="chart-parent">
             <WeeklyActivityChart
               days={makeWeek('2026-09-02', [10, 20, 30, 40, 50, 60, 70])}
               weekComparison={NO_COMPARISON}
             />
           </View>
         </ChartWrapper>,
       );

       // #132 R1: the test mounts the chart inside a host of its own, so a wrapper
       // around the card, accessible or not, turns the lock red.
       expect(
         result.getByTestId('weekly-activity-card').parent?.props.testID,
       ).toBe('chart-parent');
     });
   });
   ```

   El test da el blob `326aa48242b28195849d4e9fe8179004162623d2`. El fichero
   acaba en `});` y un salto de línea, sin línea en blanco final. **No añadas
   ningún import**: `render`, `ChartWrapper`, `WeeklyActivityChart`, `makeWeek`
   y `NO_COMPARISON` ya están en el test, y `View` sale del `requireActual` del
   propio `it` ([[design]] §Decisiones). No uses `renderChart` aquí: no deja
   meter el centinela.
2. **La mutación `P1red`** (es la sonda `wrapcard`), en la gráfica:
   - justo encima de `    <Card testID="weekly-activity-card" className="gap-2">`
     (4 espacios; `grep -c '^    <Card testID="weekly-activity-card" className="gap-2">$'`
     da 1), la línea `    <View accessible>`;
   - justo debajo de `    </Card>` (4 espacios; `grep -c '^    </Card>$'` da 1),
     la línea `    </View>`.

   No cambies la sangría de las líneas de dentro. `View` ya está importado en la
   gráfica. La gráfica da el blob `cec8a26e4f276f0a0615702a03626d2b0f3acfcc`.
3. La gráfica da `exit=1`: 1 failed y 43 passed de 44. El rojo es
   `#132 R1: la tarjeta es la raíz host de lo que pinta la gráfica › entre el nodo que monta la gráfica y la tarjeta no hay ningún otro`,
   por `expect(received).toBe(expected) // Object.is equality`, con
   `Expected: "chart-parent"` y `Received: undefined`.
4. La suite da `exit=1`: **5 failed** y 1548 passed de 1553; **2 suites
   failed** y 81 passed de 83; 1 snapshot passed. Los rojos son exactamente:
   - en el test, el de R1, por `toBe`;
   - en la Home, «los 4 de orden», todos por `expect(received).toEqual(expected)`:
     - `R14: la Home monta la actividad semanal sin pedir nada nuevo › queda entre el resumen y la última posición en el árbol`;
     - `#69 R1: la tira de hoy tiene cuatro celdas con tres divisores › coloca la tira sobre la tarjeta del collar`;
     - `#71 R1: la Home dibuja la rejilla de accesos rápidos › coloca la rejilla entre el collar y la actividad semanal`;
     - `#70 R1: la Home dibuja la sección de recordatorios › #70 R14: posición y condición de la sección › coloca la sección entre la actividad semanal y la última posición`.

   Los 4 de la Home ya son rojos hoy con esta misma mutación: no los toques
   ([[requirements]] §Qué firma, punto 4). Si falla otro test, o alguno de estos
   falla por otra cosa, **para**.
5. Commit rojo, con los dos ficheros (desde la raíz):

   ```bash
   git add mobile-pet-tracker/src/screens/home/weekly-activity-chart.test.tsx mobile-pet-tracker/src/screens/home/weekly-activity-chart.tsx
   git commit -m "test(mobile): expose a wrapper around the weekly activity card with a versioned mutation (R1)"
   ```

### (2) Verde

1. `git checkout HEAD~1 -- mobile-pet-tracker/src/screens/home/weekly-activity-chart.tsx`.
   La gráfica vuelve a `c258abedde92d2be981be8507d3d898f13c612cb`.
2. La gráfica da 44 de 44, `exit=0`.
3. Commit verde:

   ```bash
   git add mobile-pet-tracker/src/screens/home/weekly-activity-chart.tsx
   git commit -m "test(mobile): lock the weekly activity card as the chart's host root (R1)"
   ```

### (3) Refactor

Ninguno. El centinela y sus dos literales se quedan en el `it`: no se extrae un
helper ni se toca `renderChart`.

## Sondas

Sobre el árbol final, **una sonda cada vez**:

1. Aplica la mutación de la tabla en la gráfica (o, en `hexbare`, en el test).
2. Comprueba con `git hash-object` que el fichero mutado da el blob de la tabla.
   Si no coincide, la mutación no es la de la spec: corrígela antes de medir.
3. Corre la corrida de sondas de §Antes de tocar nada, paso 6 (la gráfica y la
   Home juntas, `Test Suites: 2`). En `hexbare`, el comando de la columna
   «Exigido».
4. Anota `exit`, las cuentas, cada `it` rojo y **la primera línea de su error**:
   `expect(received).<matcher>` es un rojo **por aserción**, y
   `Unable to find an element with testID: …` es un rojo **por consulta**.
5. Restaura con `git checkout HEAD -- mobile-pet-tracker/src/screens/home/weekly-activity-chart.tsx mobile-pet-tracker/src/screens/home/weekly-activity-chart.test.tsx`
   (con `HEAD`, no `git checkout --` a secas: si hubieras hecho `git add`, este
   restaura también el índice).
6. `git diff --exit-code -- mobile-pet-tracker/src` y
   `git diff --cached --exit-code -- mobile-pet-tracker/src` dan 0 los dos.

**Nada de esto se commitea.** La tabla medida va al reporte, con la columna
«medido» rellena por ti.

Convenciones de la tabla:

- «La línea de la tarjeta» es `    <Card testID="weekly-activity-card" className="gap-2">`
  (4 espacios), y «el cierre de la tarjeta», `    </Card>` (4 espacios). Las
  líneas insertadas llevan la sangría que se indica entre las comillas.
- «R1» es el `it` de #132. «Tarjeta» es
  `#74 R2: el grupo del selector no colapsa sus tres opciones › la tarjeta que lo envuelve tampoco se vuelve un nodo accesible`,
  y «`#130 R2`» es
  `#130 R2: entre la tarjeta y cada columna no hay otro nodo › las siete columnas cuelgan de la fila, y la fila, de la tarjeta`.
- «Los 4 de orden» son los 4 `it` de la Home de §R1, paso 4, por `toEqual`.
- «Los 37 de la gráfica» son los rojos que `hidewrap` ya da hoy en el test: 29
  por consulta (entre ellos `#74 R1`, los dos de `#74 R2`, los dos de `#74 R3`,
  `#130 R1` y `#130 R2`) y 8 por aserción (5 `toBeDefined`, 1 `toBeOnTheScreen`,
  1 `toEqual` y 1 `toHaveBeenCalledWith`). «Los 9 de la Home» son, con
  `hidewrap`: por consulta, `R8: el mapa solo se ofrece para hoy › ofrece el mapa solo para el día de hoy`,
  `R14: … › muestra la tarjeta con los siete días recibidos`,
  `R14: … › no vuelve a pedir la actividad al cambiar de métrica`,
  `#69 R1: … › coloca la tira sobre la tarjeta del collar`,
  `#70 R1: … › #70 R15: sin llamadas nuevas › no añade ninguna llamada a la API` y
  `#70 R1: … › #98 R8: la barra de comidas entra sin traerse el cliente de nutrición › no importa el cliente de nutrición ni añade llamadas`;
  y por `toEqual`, `R14: … › queda entre el resumen…`, `#71 R1: … › coloca la rejilla…`
  y `#70 R1: … › #70 R14: … › coloca la sección…`.
- Se mide sobre 44 + 159 = 203 tests. «Hoy» es la misma mutación sobre la base
  (43 + 159 = 202): va para que el `reviewer` vea qué cierra el candado nuevo y
  qué cerraba ya la Home.

| Sonda | Mutación | Blob | Hoy (202) | Exigido tras #132 (203) |
|---|---|---|---|---|
| `wrapcard` | encima de la línea de la tarjeta, `    <View accessible>`; debajo del cierre de la tarjeta, `    </View>` (es `P1red`) | `cec8a26e4f276f0a0615702a03626d2b0f3acfcc` | rojo 4: los 4 de orden; la gráfica, verde | rojo 5: R1, por `toBe`, y los 4 de orden |
| `presscard` | encima, `    <Pressable>`; debajo, `    </Pressable>` | `330939c55f1e1ae6461c80b7ae832b5b478f5e72` | rojo 4: los 4 de orden | rojo 5: R1, por `toBe`, y los 4 de orden |
| `wrapplain` | encima, `    <View>`; debajo, `    </View>` | `063030360d7644506e3be9976a44688d870d3192` | rojo 4: los 4 de orden | rojo 5: R1, por `toBe`, y los 4 de orden |
| `hidewrap` | encima, `    <View importantForAccessibility="no-hide-descendants">`; debajo, `    </View>` | `a1864b0bc7ef7711092442465a11e9488b0a24ac` | rojo 46: los 37 de la gráfica y los 9 de la Home | rojo 47: los mismos 46 y R1, **por consulta** (`Unable to find an element with testID: weekly-activity-card`) |
| `fragment` | encima, `    <>`; debajo, `    </>` | `e3248830029f390df6e5f8dc0132112ef83a16cf` | verde | **verde**, 203/203: un fragmento no es un host |
| `sibling` | encima, `    <>`; debajo, dos líneas: `    <View accessible />` y `    </>` | `27969c056d5f4d7167793bd9591281a42edc279d` | verde | **verde**, 203/203: hueco declarado, (D) |
| `cardacc` | la línea de la tarjeta pasa a `    <Card testID="weekly-activity-card" accessible className="gap-2">` | `8fc10f1cec33e74740e1684bdad635a656af95cb` | rojo 1: tarjeta, por `toEqual` | igual; R1 y la Home, verdes |
| `cardpress` | la línea de la tarjeta pasa a `    <Card testID="weekly-activity-card" className="gap-2" onPress={() => undefined}>` | `2a460368e92f97e28c1e7e6dae849b81a157f729` | rojo 1: tarjeta, por `toEqual` | igual; R1 y la Home, verdes |
| `wrapinner` | justo debajo de la línea de la tarjeta, `      <View accessible>`; justo encima del cierre de la tarjeta, `      </View>` | `e2c6f4e6578e1b7b747c91db7f1ec54ea00d11df` | rojo 1: `#130 R2`, por `toBe` | igual; R1 y la Home, verdes |
| `wrapmetric` | encima de `          <MetricSelector` (10 espacios), `          <View accessible>`; debajo del `          />` que lo cierra (la línea siguiente a `            onSelect={setSelectedMetricIndex}`), `          </View>` | `d053148a654bb15abf0e75c2d056d94bea7b930a` | verde | **verde**, 203/203: hueco declarado, (F) |
| `hexbare` | **en el test**, `// #132 R1: the test mounts` pasa a `// #132: the test mounts` | `378edd757c0d8de04d60ef07d7687ebb579df5a4` | no aplica | `bunx jest --runTestsByPath src/__tests__/design-drift.test.ts`: `Test Suites: 1`, `exit=1`, 1 failed de 55, `#68 R18: la actividad semanal no mete drift de estilo › keeps arbitrary text, hex colors, and StyleSheet out of feature sources`, por `toEqual` |

Si una fila da otro veredicto, **para** y repórtalo con el log. No ajustes la
aserción para que case.

## R2 — Cierre

1. Suite completa, sin pipe: 83 suites / 1553 tests / 1 snapshot, `exit=0`, o
   la base que mediste en §Antes de tocar nada más 1 test y 0 suites. La
   gráfica, 44 de 44 (`Test Suites: 1`). La Home, 159 de 159.
2. `test ! -e .expo/types/router.d.ts && bunx tsc --noEmit > /tmp/132_tsc.log 2>&1; echo "exit=$?"`
   da `exit=0`.
3. `bunx eslint src/screens/home/weekly-activity-chart.tsx src/screens/home/weekly-activity-chart.test.tsx > /tmp/132_lint.log 2>&1; echo "exit=$?"`
   da `exit=0`.
4. Las cifras de candado:
   - en la gráfica, sin cambio: `grep -c "style={CONTINUOUS_CORNER}"` da 1,
     `grep -c "style={TABULAR_NUMS}"` da 4,
     `grep -c 'accessibilityRole="radiogroup"'` da 1 y `grep -c "Platform"` da 0;
   - `grep -ciE "stylesheet|text-\[10px\]" src/screens/home/weekly-activity-chart.tsx src/screens/home/weekly-activity-chart.test.tsx`
     da 0 en los dos;
   - `grep -c "use-api" src/screens/home/weekly-activity-chart.test.tsx` da 1:
     la línea `expect(source).not.toContain('use-api');` que ya estaba, y que
     `#87 R19` espera como única huella. `grep -c "useApi"` da 0;
   - en el test: `grep -c "#132"` y `grep -c "#132 R1:"` dan 2 los dos (el
     título y el comentario, ningún `#132` suelto);
     `grep -c "^describe('#132 R"` da 1; `grep -c "chart-parent"` da 2;
     `grep -c "requireActual"` pasa de 8 a 9; `grep -c "weekly-activity-card"`
     pasa de 3 a 4; `grep -c "#130"` sigue en 4 y `grep -c "#74"`, en 5.
5. Desde la raíz del repo:
   - `git diff --stat origin/main...HEAD -- mobile-pet-tracker/` lista **solo**
     el test;
   - `git diff --numstat origin/main...HEAD -- mobile-pet-tracker/src/screens/home/weekly-activity-chart.test.tsx`
     da `24`, `0` y la ruta: 24 líneas añadidas (la línea en blanco y el bloque)
     y **ninguna borrada**;
   - `git diff -U0 origin/main...HEAD -- mobile-pet-tracker/src/screens/home/weekly-activity-chart.test.tsx | grep -c "^@@"`
     da 1: un solo hunk, al final del fichero. Con los dos puntos anteriores,
     ningún `describe` de #68, #74 ni #130 ha cambiado;
   - `git diff --exit-code origin/main...HEAD -- mobile-pet-tracker/src/screens/home/weekly-activity-chart.tsx mobile-pet-tracker/src/screens/home/index.tsx mobile-pet-tracker/src/screens/home/index.test.tsx mobile-pet-tracker/src/components/card.tsx mobile-pet-tracker/src/i18n/catalog.ts mobile-pet-tracker/package.json mobile-pet-tracker/bun.lock`
     da 0.
6. Blobs finales:

   | Ruta | Blob |
   |---|---|
   | `src/screens/home/weekly-activity-chart.tsx` | `c258abedde92d2be981be8507d3d898f13c612cb` (el de base) |
   | `src/screens/home/weekly-activity-chart.test.tsx` | `326aa48242b28195849d4e9fe8179004162623d2` |

7. Escribe `progress/impl_mobile-weekly-chart-root-accessible-lock.md` con:
   - la base medida (los tres comandos de §Antes de tocar nada);
   - las salidas del rojo y del verde (cuentas, `exit` y los `it` rojos con su
     matcher);
   - la tabla de §Sondas, con la columna «medido»;
   - los blobs y los números de R2.

   Rellena los hashes en [[traceability]]. La fila de R2 cita el hash del
   **verde de R1**, que es el último commit de código, no el de este commit.
   Commitea:

   ```bash
   git add progress/impl_mobile-weekly-chart-root-accessible-lock.md specs/mobile-weekly-chart-root-accessible-lock/traceability.md
   git commit -m "docs(mobile): record the weekly chart root lock evidence (R2)"
   ```

   No rebasees después: los hashes de la tabla dejarían de valer.

## Lo que NO hay que tocar

- La gráfica, salvo en el commit rojo, y siempre revertida en el verde
  siguiente.
- Los `describe` de #68, #74 y #130 del test, y sus helpers y mocks
  (`renderChart`, `ChartWrapper`, `makeWeek`, `makeDay`, `NO_COMPARISON`,
  `mockTheme` y el resto). La cabecera de imports del test tampoco.
- `src/components/card.tsx`, `src/screens/home/index.tsx` e `index.test.tsx`.
  Los 4 de orden de la Home se ponen rojos en el commit rojo, y así debe ser.
- `src/__tests__/design-drift.test.ts` y `src/__tests__/consistency-classnames.test.ts`:
  la sesión Backend toca el primero en #100.
- `src/i18n/catalog.ts`, `src/providers/__tests__/language-provider.test.tsx` y
  `src/__tests__/ui-copy-table.ts`: no hay copy nueva.
- `package.json` y `bun.lock`: no hay dependencia nueva. Tampoco ficheros
  nativos.

## Enmienda 1 — R1 en tres estados

> Solo si la casilla de [[requirements]] §Enmienda 1 › Firma de la Enmienda 1
> está marcada. Es la ronda 2 de #132, **encima** de la historia de la ronda 1:
> `4fb4481c`, `99629c30` y `40e40dfe` se quedan, sin rebase ni amend. Mismo
> orden TDD y misma vía **b** que en R1: cada `it` nuevo tiene su commit rojo,
> con una mutación de producción versionada, y su verde, que la revierte con
> `git checkout HEAD~1 --`. Cuatro commits de código y uno de evidencia, en el
> orden de abajo y con los mensajes literales.
>
> Cada `it` nuevo crea su sujeto antes de aseverarlo: monta el centinela, llega
> a su estado y prueba que llegó (`toBeOnTheScreen`) antes de mirar la raíz.
> Todo se localiza por contenido, como en el resto de este fichero.
> «R1·1» es el `it` de la ronda 1, «R1·2» el de tras medir y «R1·3» el del día
> seleccionado, los tres en `describe('#132 R1: la tarjeta es la raíz host de lo que pinta la gráfica'`.

### E1 — Antes de tocar nada

1. `git branch --show-current` da `feature/132-mobile-weekly-chart-root-accessible-lock`.
   Si no, **para**.
2. Lee la casilla de [[requirements]] §Enmienda 1 › Firma de la Enmienda 1. Si
   no está marcada, **para**.
3. `cd mobile-pet-tracker && test ! -e .expo/types/router.d.ts; echo "exit=$?"`
   da `exit=0`. Si da 1, **para** y avisa al humano (#121: no lo borres tú).
4. Carga la skill `building-native-ui` de tu plugin `expo`. Esta enmienda no
   cambia UI. Todo con `bun` y `bunx`, nunca `npm` ni `npx`. No instales nada.
   No corras `./init.sh` ni los e2e.
5. Desde la raíz, cada uno de estos da `exit=0`:

   ```bash
   for c in 4fb4481c 99629c30 40e40dfe 02128a12; do git merge-base --is-ancestor $c HEAD; echo "$c exit=$?"; done
   ```

   Si alguno da 1, **para**: la historia de la ronda 1 ya no está. **No
   actualices la branch** con `origin/main` ni la rebasees: la base de esta
   enmienda es `02128a12`.
6. Blobs de base, con `git hash-object <ruta>`:

   | Ruta | Blob |
   |---|---|
   | `src/screens/home/weekly-activity-chart.tsx` | `c258abedde92d2be981be8507d3d898f13c612cb` |
   | `src/screens/home/weekly-activity-chart.test.tsx` | `326aa48242b28195849d4e9fe8179004162623d2` |

   Si alguno no coincide, **para**.
7. Mide la base con los tres comandos canónicos de §Antes de tocar nada, paso
   6, sin pipe. Esperado:
   - la gráfica: `Test Suites: 1`, 44 passed de 44, `exit=0`;
   - la corrida de sondas: `Test Suites: 2`, 203 passed de 203 (44 de la gráfica
     y 159 de la Home), `exit=0`;
   - la suite: 86 passed de 86 suites, 1598 passed de 1598 tests y 1 snapshot,
     `exit=0`, con 33 bloques `● Console` de ruido.

   Si la suite da otra cifra con `exit=0`, **anota la medida** y úsala como
   base: el delta exigido es +2 tests y +0 suites sobre lo medido, y los
   «N failed de M» de los rojos se desplazan igual. Si la gráfica o la Home dan
   otra cifra, **para**.
8. Las reglas de literales de §Antes de tocar nada, paso 7, valen igual. Los
   bloques de abajo ya las cumplen: sus comentarios empiezan por `// #132 R1:`.
   **No añadas ningún import**.

### E1.1 — R1·2, tras el layout

#### (1) Rojo

1. En el test, justo antes de la última línea del fichero (`tail -n 1` da
   `});`, el cierre del `describe` de `#132 R1`), añade una línea en blanco y
   este bloque:

   ```tsx
     it('tras medir el gráfico, entre el nodo que monta la gráfica y la tarjeta sigue sin haber otro', async () => {
       const { View } = jest.requireActual<typeof import('react-native')>(
         'react-native',
       );
       const result = await render(
         <ChartWrapper language="es">
           <View testID="chart-parent">
             <WeeklyActivityChart
               days={makeWeek('2026-09-02', [10, 20, 30, 40, 50, 60, 70])}
               weekComparison={NO_COMPARISON}
             />
           </View>
         </ChartWrapper>,
       );
       const layout = result.getByTestId('weekly-activity-chart-layout');

       await fireEvent(layout, 'layout', {
         nativeEvent: {
           layout: { width: 295, height: 0, x: 0, y: 0 },
         },
       });

       // #132 R1: the layout gives the chart its width, so a wrapper that only
       // shows up once the chart is measured turns the lock red here.
       expect(result.getByTestId('weekly-activity-bar-chart')).toBeOnTheScreen();
       expect(
         result.getByTestId('weekly-activity-card').parent?.props.testID,
       ).toBe('chart-parent');
     });
   ```

   Queda detrás del `  });` que cierra R1·1. El test da el blob
   `6be9934b5f9636095050e2bb94a6e1f00b5835ed` y sigue acabando en `});` y un
   salto de línea.
2. **La mutación `layoutwrap`**, en la gráfica. Son dos cambios:
   - la línea `  return (` que está **justo encima** de
     `    <Card testID="weekly-activity-card" className="gap-2">` pasa a
     `  const card = (`. Localízala con
     `grep -n -B1 '^    <Card testID="weekly-activity-card" className="gap-2">$' src/screens/home/weekly-activity-chart.tsx`.
     No toques los otros tres `  return (` del fichero
     (`grep -c '^  return ($'` da 4): son de `ActivityBar`, `DetailMetric` y
     `MetricSelector`;
   - justo debajo del `  );` que sigue a `    </Card>` (4 espacios;
     `grep -n -A1 '^    </Card>$'`), añade esta línea, con dos espacios de
     sangría:
     `  return chartWidth > 0 ? <View accessible>{card}</View> : card;`

   `View` ya está importado. La gráfica da el blob
   `bbf810f65e80843f005e7dc134bf094596bd5ae3`. `git diff --numstat` de la
   gráfica da `2 1`.
3. La gráfica da `exit=1`: 1 failed y 44 passed de 45. El rojo es
   `#132 R1: la tarjeta es la raíz host de lo que pinta la gráfica › tras medir el gráfico, entre el nodo que monta la gráfica y la tarjeta sigue sin haber otro`,
   por `expect(received).toBe(expected) // Object.is equality`, con
   `Expected: "chart-parent"` y `Received: undefined`.
4. La corrida de sondas da `exit=1`, `Test Suites: 1 failed, 1 passed, 2 total`
   y 1 failed y 203 passed de 204: la Home, verde. La suite da `exit=1`:
   **1 failed** y 1598 passed de 1599, **1 suite failed** y 85 passed de 86, y
   1 snapshot passed. Es el único rojo. Si falla otro test, **para**.
5. Commit rojo, con los dos ficheros (desde la raíz):

   ```bash
   git add mobile-pet-tracker/src/screens/home/weekly-activity-chart.test.tsx mobile-pet-tracker/src/screens/home/weekly-activity-chart.tsx
   git commit -m "test(mobile): expose a wrapper that appears after the weekly chart's layout with a versioned mutation (R1)"
   ```

#### (2) Verde

1. `git checkout HEAD~1 -- mobile-pet-tracker/src/screens/home/weekly-activity-chart.tsx`.
   La gráfica vuelve a `c258abedde92d2be981be8507d3d898f13c612cb`.
2. La gráfica da 45 de 45, `exit=0`.
3. Commit verde:

   ```bash
   git add mobile-pet-tracker/src/screens/home/weekly-activity-chart.tsx
   git commit -m "test(mobile): lock the weekly activity card as the chart's host root after layout (R1)"
   ```

#### (3) Refactor

Ninguno.

### E1.2 — R1·3, con un día seleccionado

#### (1) Rojo

1. En el test, otra vez justo antes de la última línea del fichero (`});`),
   detrás del `  });` que cierra R1·2, añade una línea en blanco y este bloque:

   ```tsx
     it('con un día seleccionado, entre el nodo que monta la gráfica y la tarjeta sigue sin haber otro', async () => {
       const { View } = jest.requireActual<typeof import('react-native')>(
         'react-native',
       );
       const result = await render(
         <ChartWrapper language="es">
           <View testID="chart-parent">
             <WeeklyActivityChart
               days={makeWeek('2026-09-02', [10, 20, 30, 40, 50, 60, 70])}
               weekComparison={NO_COMPARISON}
             />
           </View>
         </ChartWrapper>,
       );
       const layout = result.getByTestId('weekly-activity-chart-layout');

       await fireEvent(layout, 'layout', {
         nativeEvent: {
           layout: { width: 295, height: 0, x: 0, y: 0 },
         },
       });
       await fireEvent.press(result.getByTestId('weekly-activity-day-2026-09-02'));

       // #132 R1: selecting a day must not put a host between the chart's root and
       // the card either, not even one that closes the tooltip on a tap.
       expect(result.getByTestId('weekly-activity-tooltip')).toBeOnTheScreen();
       expect(
         result.getByTestId('weekly-activity-card').parent?.props.testID,
       ).toBe('chart-parent');
     });
   ```

   El test da el blob `6689cc26014993cf3de73245e0158b44215a3106`.
2. **La mutación `selwrap`**, en la gráfica: el mismo primer cambio que
   `layoutwrap` (`  return (` justo encima de la línea de la tarjeta pasa a
   `  const card = (`) y, justo debajo del `  );` que sigue a `    </Card>`,
   esta línea, con dos espacios de sangría:
   `  return selection !== null ? <Pressable onPress={() => setSelection(null)}>{card}</Pressable> : card;`

   `Pressable` ya está importado. La gráfica da el blob
   `c81f498f06157e866bda07a60956a79c83464e9a`, y `git diff --numstat` de la
   gráfica, `2 1`.
3. La gráfica da `exit=1`: 1 failed y 45 passed de 46. El rojo es
   `#132 R1: la tarjeta es la raíz host de lo que pinta la gráfica › con un día seleccionado, entre el nodo que monta la gráfica y la tarjeta sigue sin haber otro`,
   por `expect(received).toBe(expected) // Object.is equality`, con
   `Expected: "chart-parent"` y `Received: undefined`.
4. La corrida de sondas da `exit=1`, `Test Suites: 1 failed, 1 passed, 2 total`
   y 1 failed y 204 passed de 205. La suite da `exit=1`: **1 failed** y 1599
   passed de 1600, **1 suite failed** y 85 passed de 86, y 1 snapshot passed.
   Es el único rojo. Si falla otro test, o R1·2, **para**.
5. Commit rojo:

   ```bash
   git add mobile-pet-tracker/src/screens/home/weekly-activity-chart.test.tsx mobile-pet-tracker/src/screens/home/weekly-activity-chart.tsx
   git commit -m "test(mobile): expose a wrapper that appears with a selected day with a versioned mutation (R1)"
   ```

#### (2) Verde

1. `git checkout HEAD~1 -- mobile-pet-tracker/src/screens/home/weekly-activity-chart.tsx`.
   La gráfica vuelve a `c258abedde92d2be981be8507d3d898f13c612cb`.
2. La gráfica da 46 de 46, `exit=0`.
3. Commit verde:

   ```bash
   git add mobile-pet-tracker/src/screens/home/weekly-activity-chart.tsx
   git commit -m "test(mobile): lock the weekly activity card as the chart's host root with a selected day (R1)"
   ```

#### (3) Refactor

Ninguno. Los tres `it` montan a mano y se quedan así: no se extrae un helper
([[design]] §Enmienda 1).

### E1 — Sondas

Sobre el árbol final, una sonda cada vez, con los seis pasos de §Sondas: la
mutación, el blob, la corrida de sondas (en `hexbare`, la de su fila), las
cuentas con la primera línea de cada error, la restauración con
`git checkout HEAD --` de los dos ficheros, y `git diff --exit-code` y
`git diff --cached --exit-code` de `mobile-pet-tracker/src` en 0. **Nada de
esto se commitea.** Se mide sobre 46 + 159 = 205 tests.

Convenciones, además de las de §Sondas:

- **«Condicionar la raíz»** son los dos cambios de §E1.1, paso 2: el
  `  return (` justo encima de la línea de la tarjeta pasa a `  const card = (`,
  y justo debajo del `  );` que sigue al cierre de la tarjeta se añade la
  **línea de retorno** de la fila, literal y con sus dos espacios. En
  `motionwrap` hay además un tercer cambio: justo debajo de
  `  const t = useTranslate();` (`grep -c` da 1, en `WeeklyActivityChart`), la
  línea `  const reduceMotion = useReducedMotion();`. `useReducedMotion` ya está
  importado.
- **«Los 40 de la gráfica»**, con `hidewrap`, son los 37 de §Sondas más R1·1,
  R1·2 y R1·3, los tres por consulta: 32 por consulta y 8 por aserción. R1·1
  cae en `Unable to find an element with testID: weekly-activity-card`; R1·2 y
  R1·3, en su primera consulta,
  `Unable to find an element with testID: weekly-activity-chart-layout`.
- **«Rojo por»**: «aserción» es `expect(received).<matcher>` o
  `expect(jest.fn()).<matcher>`, y «consulta» es `Unable to find an element with testID: …`.

| Sonda | Mutación | Blob de la gráfica | Exigido (205) | Rojo por |
|---|---|---|---|---|
| `wrapcard` | la de su fila en §Sondas | `cec8a26e4f276f0a0615702a03626d2b0f3acfcc` | rojo 7, 2 suites: R1·1, R1·2 y R1·3, y los 4 de orden | aserción: `toBe` en los tres de R1, `toEqual` en la Home |
| `presscard` | la de su fila en §Sondas | `330939c55f1e1ae6461c80b7ae832b5b478f5e72` | rojo 7, como `wrapcard` | aserción, como `wrapcard` |
| `wrapplain` | la de su fila en §Sondas | `063030360d7644506e3be9976a44688d870d3192` | rojo 7, como `wrapcard` | aserción, como `wrapcard` |
| `hidewrap` | la de su fila en §Sondas | `a1864b0bc7ef7711092442465a11e9488b0a24ac` | rojo 49: los 40 de la gráfica y los 9 de la Home | los tres de R1, **por consulta** |
| `fragment` | la de su fila en §Sondas | `e3248830029f390df6e5f8dc0132112ef83a16cf` | **verde**, 205/205 | no aplica |
| `sibling` | la de su fila en §Sondas | `27969c056d5f4d7167793bd9591281a42edc279d` | **verde**, 205/205: (D) | no aplica |
| `cardacc` | la de su fila en §Sondas | `8fc10f1cec33e74740e1684bdad635a656af95cb` | rojo 1: tarjeta | aserción, `toEqual` |
| `cardpress` | la de su fila en §Sondas | `2a460368e92f97e28c1e7e6dae849b81a157f729` | rojo 1: tarjeta | aserción, `toEqual` |
| `wrapinner` | la de su fila en §Sondas | `e2c6f4e6578e1b7b747c91db7f1ec54ea00d11df` | rojo 1: `#130 R2` | aserción, `toBe` |
| `wrapmetric` | la de su fila en §Sondas | `d053148a654bb15abf0e75c2d056d94bea7b930a` | **verde**, 205/205: (F) | no aplica |
| `hexbare` | **en el test**, `// #132 R1: the test mounts` pasa a `// #132: the test mounts` (`grep -c` da 1) | la gráfica, sin tocar; **el test**, `f3dcd70b3decf04b5dac10a5f903a50fdbb05268` | con `bunx jest --runTestsByPath src/__tests__/design-drift.test.ts`: `Test Suites: 1`, `exit=1`, 1 failed de 55, `#68 R18: la actividad semanal no mete drift de estilo › keeps arbitrary text, hex colors, and StyleSheet out of feature sources` | aserción, `toEqual` |
| `layoutwrap` | condicionar la raíz: `  return chartWidth > 0 ? <View accessible>{card}</View> : card;` | `bbf810f65e80843f005e7dc134bf094596bd5ae3` | **rojo 2**, 1 suite: R1·2 y R1·3; la Home, verde | aserción, `toBe` |
| `layoutwrapctl` | condicionar la raíz: `  return chartWidth === 0 ? <View accessible>{card}</View> : card;` | `ebb667168df1b7985c0d394e896f71a09dc3240c` | rojo 5, 2 suites: R1·1 y los 4 de orden | aserción: `toBe` en R1·1, `toEqual` en la Home |
| `selwrap` | condicionar la raíz: `  return selection !== null ? <Pressable onPress={() => setSelection(null)}>{card}</Pressable> : card;` | `c81f498f06157e866bda07a60956a79c83464e9a` | **rojo 1**, 1 suite: R1·3; la Home, verde | aserción, `toBe` |
| `selwrapctl` | condicionar la raíz: `  return selection === null ? <View accessible>{card}</View> : card;` | `ed32f2baf17275b908d364bff8565032a614dbcb` | rojo 6, 2 suites: R1·1, R1·2 y los 4 de orden | aserción: `toBe` en R1, `toEqual` en la Home |
| `widewrap` | condicionar la raíz: `  return chartWidth > 400 ? <View accessible>{card}</View> : card;` | `e63e077bf1d234926d0e2277fcbd56c6dad255c4` | **verde**, 205/205: (D) | no aplica |
| `selidxwrap` | condicionar la raíz: `  return selection?.dataIndex === 6 ? <View accessible>{card}</View> : card;` | `9e886ebd7c23f824a1e9013a13f75f470bcc855a` | **verde**, 205/205: (D) | no aplica |
| `metricwrap` | condicionar la raíz: `  return selectedMetricIndex !== 0 ? <View accessible>{card}</View> : card;` | `35fe29993602bec41ec826d1ec3e074f2b346e29` | rojo 1, de rebote: `R6: el selector cambia de métrica sin volver a pedir nada › desliza una única píldora entre las medidas reales de las pestañas`. R1 y la Home, verdes: (D) | aserción, `toHaveBeenNthCalledWith` («Number of calls: 0») |
| `trendwrap` | condicionar la raíz: `  return trend !== null ? <View accessible>{card}</View> : card;` | `18d947ef655e164cdaecb599fc5efe0103cdac7f` | rojo 4, 1 suite: los 4 de orden; la gráfica, verde: (D) | aserción, `toEqual` |
| `zerowrap` | condicionar la raíz: `  return average === null ? <View accessible>{card}</View> : card;` | `e6e2594f4195faeadc4c37b05fea3c9150d57063` | **verde**, 205/205: (D) | no aplica |
| `missingwrap` | condicionar la raíz: `  return days.some((day) => day.source === 'missing') ? <View accessible>{card}</View> : card;` | `a3088d7e2a7f9fc308d7265ba5c6cf39a9af3d3f` | **verde**, 205/205: (D) | no aplica |
| `selmissingwrap` | condicionar la raíz: `  return selectedDay?.source === 'missing' ? <View accessible>{card}</View> : card;` | `cfb9d5480f7f554b64d256e12811415ec7809187` | **verde**, 205/205: (D) | no aplica |
| `emptywrap` | condicionar la raíz: `  return hasMeasuredDay ? card : <View accessible>{card}</View>;` | `69665259a1e586f393c0fbaefcb5d3ec85b8bf89` | **verde**, 205/205: fuera del WHILE | no aplica |
| `callbackwrap` | condicionar la raíz: `  return onSelectDay !== undefined ? <View accessible>{card}</View> : card;` | `e41851bb64d028233099b3644a990ca26a3960b9` | rojo 4, 1 suite: los 4 de orden; la gráfica, verde: (D) | aserción, `toEqual` |
| `localewrap` | condicionar la raíz: `  return locale.startsWith('es') ? card : <View accessible>{card}</View>;` | `ccec4f330be3a2e0aff5ab439ce235a244c8b12f` | **verde**, 205/205: (D) | no aplica |
| `motionwrap` | condicionar la raíz, con el tercer cambio: `  return reduceMotion ? card : <View accessible>{card}</View>;` | `eb91d5292527529944cf04cdbef8d7452527abc2` | rojo 4, 1 suite: los 4 de orden; la gráfica, verde: (D) | aserción, `toEqual` |
| `oswrap` | condicionar la raíz: `  return process.env.EXPO_OS === 'android' ? <View accessible>{card}</View> : card;` | `4cd9051b3518277fb5d6e39621cfa8b8117c978b` | **verde**, 205/205: (D) | no aplica |

Las filas exigidas, las que el candado tiene que ver, son las de `wrapcard` a
`selwrapctl`. Las de `widewrap` a `oswrap` documentan los huecos (D) de
[[requirements]] §Enmienda 1 › Zona ciega: se miden igual, y un rojo **nuevo**
en una de ellas no es un fallo, pero se reporta. Si una fila exigida da otro
veredicto, **para** y repórtalo con el log. No ajustes la aserción para que
case.

### E1 — Cierre (R2 enmendado)

1. Suite completa, sin pipe: 86 suites / 1600 tests / 1 snapshot, `exit=0`, o
   la base de §E1 — Antes de tocar nada más 2 tests y 0 suites. La gráfica, 46
   de 46 (`Test Suites: 1`). La corrida de sondas, 205 de 205. La Home, 159 de
   159.
2. `tsc` y `eslint`, con los comandos de §R2 — Cierre, pasos 2 y 3: `exit=0` los
   dos.
3. Las cifras de candado:
   - en la gráfica, sin cambio: las de §R2 — Cierre, paso 4;
   - `grep -ciE "stylesheet|text-\[10px\]"` da 0 en los dos ficheros;
     `grep -c "use-api"` da 1 y `grep -c "useApi"` da 0 en el test;
   - en el test, de la ronda 1 a la Enmienda 1: `grep -c "#132"` y
     `grep -c "#132 R1:"` pasan de 2 a 4 los dos (el título del `describe` y los
     tres comentarios); `grep -c "^describe('#132 R"` sigue en 1;
     `grep -c "chart-parent"` pasa de 2 a 6; `grep -c "requireActual"`, de 9 a
     11; `grep -c "weekly-activity-card"`, de 4 a 6; `grep -c "width: 295"`, de
     2 a 4; `grep -c "await fireEvent"`, de 12 a 15;
     `grep -c "// #132 R1: the test mounts"` sigue en 1; `grep -c "#130"` sigue
     en 4 y `grep -c "#74"`, en 5.
4. Desde la raíz del repo:
   - `git diff --stat origin/main...HEAD -- mobile-pet-tracker/` lista **solo**
     el test;
   - `git diff --numstat origin/main...HEAD -- mobile-pet-tracker/src/screens/home/weekly-activity-chart.test.tsx`
     da `85`, `0` y la ruta, y
     `git diff -U0 origin/main...HEAD -- mobile-pet-tracker/src/screens/home/weekly-activity-chart.test.tsx | grep -c "^@@"`
     da 1;
   - `git diff --numstat 40e40dfe HEAD -- mobile-pet-tracker/src/screens/home/weekly-activity-chart.test.tsx`
     da `61`, `0` y la ruta, y
     `git diff -U0 40e40dfe HEAD -- mobile-pet-tracker/src/screens/home/weekly-activity-chart.test.tsx | grep -c "^@@"`
     da 1. Con esto, R1·1 y los `describe` de #68, #74 y #130 no han cambiado;
   - el `git diff --exit-code origin/main...HEAD -- …` de §R2 — Cierre, paso 5,
     con la misma lista de rutas, da 0.
5. Blobs finales:

   | Ruta | Blob |
   |---|---|
   | `src/screens/home/weekly-activity-chart.tsx` | `c258abedde92d2be981be8507d3d898f13c612cb` (el de base) |
   | `src/screens/home/weekly-activity-chart.test.tsx` | `6689cc26014993cf3de73245e0158b44215a3106` |

6. Añade al final de `progress/impl_mobile-weekly-chart-root-accessible-lock.md`
   una sección `## Enmienda 1`, **sin tocar lo de la ronda 1**, con:
   - la base medida y el resultado de los pasos 5 y 6 de §E1 — Antes de tocar
     nada;
   - las salidas de los dos rojos y los dos verdes (cuentas, `exit` y los `it`
     rojos con su matcher);
   - la tabla de §E1 — Sondas, con una columna «medido»;
   - los blobs y los números de este cierre.

   Rellena en [[traceability]] las tres filas «(Enmienda 1)», sin tocar las de
   la ronda 1. La fila de R2 (Enmienda 1) cita el hash del **verde de E1.2**.
   Commitea:

   ```bash
   git add progress/impl_mobile-weekly-chart-root-accessible-lock.md specs/mobile-weekly-chart-root-accessible-lock/traceability.md
   git commit -m "docs(mobile): record the weekly chart root lock evidence after amendment 1 (R2)"
   ```

   No rebasees después.

### E1 — Lo que NO hay que tocar

Todo lo de §Lo que NO hay que tocar, y además:

- R1·1: su título, su cuerpo y su comentario. Los bloques nuevos van detrás.
- Las filas de la ronda 1 en [[traceability]] y las secciones de la ronda 1 del
  reporte.
- La historia: nada de `rebase`, `amend`, `reset` ni `merge` de `origin/main`.

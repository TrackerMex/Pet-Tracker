---
feature: "mobile-weekly-day-row-layout-lock"
status: spec_ready       # draft | spec_ready | approved
tags: [spec, mobile, test, deuda]
---

# Requisitos — [[mobile-weekly-day-row-layout-lock]] (#131 y #135)

> Notación EARS. Cada requisito lleva su id `R<n>`, inmutable una vez aprobado.
> Ver [[design]] para las decisiones y las alternativas descartadas, [[tasks]]
> para el orden TDD, el código exacto, los blobs y las sondas, y
> [[traceability]] para el cierre.
>
> **Dos entradas, un ciclo.** El humano decidió el 2026-09-30 especificar e
> implementar juntas #131 y #135: las dos son solo test, tocan el mismo fichero,
> añaden sus bloques al final del mismo sitio y se prueban con las mismas
> acciones sobre la gráfica. Esta es la spec de verdad de las dos; la de #135 es
> un puntero
> ([[../mobile-weekly-chart-metric-selector-parent-lock/requirements|specs/mobile-weekly-chart-metric-selector-parent-lock/requirements.md]]).
>
> Origen:
> - **#131**: el hallazgo **(F)** de `specs/mobile-weekly-day-row-accessible-lock/requirements.md`
>   §Fuera de alcance, «La forma y la alineación de la fila no tienen candado»,
>   registrado al cerrar #130.
> - **#135**: el hallazgo **(F)** de `specs/mobile-weekly-chart-root-accessible-lock/requirements.md`
>   §Fuera de alcance (la sonda `wrapmetric`) y la observación 1 de la ronda 2
>   de `progress/review_mobile-weekly-chart-root-accessible-lock.md`,
>   registrado al cerrar #132.
>
> **Base medida: `343e3fbe`** (`origin/main`, merge de la PR #177 de #137, y
> punto de partida de la branch `feature/131-mobile-weekly-day-row-layout-lock`),
> el 2026-09-30. **Los números de línea no son anclas**, ni los de esta spec ni
> los de las entradas de `feature_list.json`: todo se localiza con los `grep` o
> los títulos literales que se citan, y las cuentas se vuelven a medir al
> arrancar ([[tasks]] §Antes de tocar nada).

## Qué requisito es de qué entrada

| Entrada | Requisitos | Qué cierra |
|---|---|---|
| **#131** `mobile-weekly-day-row-layout-lock` | **R1, R2 y R3** | la forma de la fila (R1), su alineación con el gráfico (R2) y el reparto de la fila entre las siete columnas (R3) |
| **#135** `mobile-weekly-chart-metric-selector-parent-lock` | **R4** | la lista cerrada de hijos host de la tarjeta: nada envuelve al selector ni a ningún otro hijo |
| las dos | **R5** | cierre medido, sin test propio |

Los títulos y los comentarios nuevos llevan el prefijo de su entrada
(`#131 R1`, `#135 R4`), como pide `docs/conventions.md` §Prefijo de feature
cuando un fichero acumula R-ids de varias specs.

## Contexto mínimo para implementar sin más contexto

La feature toca **un fichero**,
`mobile-pet-tracker/src/screens/home/weekly-activity-chart.test.tsx` («el
test», 47 tests hoy). El fichero de producción
`mobile-pet-tracker/src/screens/home/weekly-activity-chart.tsx` («la gráfica»)
**solo se toca en los cuatro commits rojos**, para versionar una mutación que el
commit verde siguiente revierte. El diff acumulado de la gráfica contra
`origin/main` es **vacío**.

Lo que pinta la gráfica, en host (lo que ven las consultas de RNTL v14):

```
View testID="weekly-activity-card"            (el Card compartido, className con gap-2)
├─ View testID="weekly-activity-header"
│  … con al menos un día medido (hasMeasuredDay):
├─ View testID="weekly-activity-metric"        (el selector de métrica, #74)
├─ View testID="weekly-activity-trend"         (solo si trend !== null, es decir, con comparación)
├─ View testID="weekly-activity-chart-layout"  (onLayout; tras medir, dentro va el BarChart y la línea de media)
├─ View testID="weekly-activity-day-row"       (className="flex-row", style={{ paddingLeft: CHART_PAD_LEFT, paddingRight: CHART_PAD_RIGHT }})
│  └─ siete Pressable testID="weekly-activity-day-<fecha>", className por un ternario:
│       reposo:       'min-h-11 flex-1 items-center justify-end'
│       seleccionado: 'min-h-11 flex-1 items-center justify-end border-t-2 border-accent-strong'
└─ View testID="weekly-activity-detail"        (solo con un día seleccionado)
   … sin ningún día medido, en vez de todo lo anterior:
└─ Text testID="weekly-activity-empty"
```

El `<>` que envuelve selector, tendencia, gráfico, fila y detalle **no crea
nodo host**: todos cuelgan directamente de la tarjeta. `.children` de un
`TestInstance` de RNTL v14 lista solo hijos host y está tipado como
`(TestInstance | string)[]`.

La **línea de media** es el `<Line testID="weekly-activity-average"` de
`ActivityBar`, con `x1={CHART_PAD_LEFT}` y `x2={chartWidth - CHART_PAD_RIGHT}`
(`grep -n "x1={CHART_PAD_LEFT}" src/screens/home/weekly-activity-chart.tsx`
da 1). El `BarChart` recibe `width={chartWidth}`. Solo existe tras medir el
gráfico (`chartWidth > 0`).

En el test ya existen, y los bloques nuevos los usan sin tocarlos:

- `renderChart(days, weekComparison = NO_COMPARISON, language = 'es')`, que
  pinta la gráfica y dispara el `layout` a 295;
- `renderChartWithProps(props, language = 'es', fireLayout = true)`, que con
  `fireLayout = false` deja la gráfica sin medir;
- `makeWeek(from, minutes)`, con `minutes: (number | null)[]`, y
  `NO_COMPARISON`;
- `latestBarChartProps()` (las props de la última llamada al `BarChart`
  mockeado) y `mergeObjectStyles(style)`.

El último `describe` del test en la base es
`describe('#132 R1: la tarjeta es la raíz host de lo que pinta la gráfica'`.

## Premisas de las entradas, verificadas contra el árbol

Todas las medidas son de la gráfica con el comando canónico de [[tasks]]
§Antes de tocar nada, en un worktree de sondas sobre `343e3fbe`, salvo donde
dice «5 suites» (la gráfica más `src/screens/home/index.test.tsx`,
`src/__tests__/design-drift.test.ts`, `src/__tests__/consistency-classnames.test.ts`
y `src/__tests__/ui-language.test.ts`) o «suite».

| Premisa (`feature_list.json` #131 y #135, y el encargo del `leader`) | Veredicto | Evidencia |
|---|---|---|
| #131: con `className="flex-col"` en la fila, la gráfica sigue verde | **cierta, re-medida**; caduca la cifra | 47/47 hoy con el blob `99ec492be5163fe00494ebc247a84535b68cbb66` (sonda `flexcol`). El 43/43 de la entrada es de antes de #132, que añadió 4 tests. El blob es el mismo porque la gráfica no ha cambiado desde #130 |
| #131: con `paddingLeft: 0` en la fila, también verde | **cierta, re-medida** | 47/47 con `9cb811796c2424dd25296505a589950d16bf0436` (sonda `nopad`) |
| #131: `#130 R1` cierra las **claves** de las props de la fila, no sus valores | **cierta** | verdes (47/47): `flex-row-reverse`, `flex-row items-end`, `paddingRight: 0`, los dos `padding` con `+ 5`, los dos intercambiados y un `marginLeft: 4` añadido al `style` (sondas `flexrev`, `rowextra`, `padright`, `padsym`, `padswap` y `padextra`). Ninguna cambia las claves |
| #131: el candado honesto del `padding` es relacional con la geometría del gráfico | **cierta, y hay con qué** | la gráfica dibuja la línea de media de `x1={CHART_PAD_LEFT}` a `x2={chartWidth - CHART_PAD_RIGHT}` y pasa `width={chartWidth}` al `BarChart`; las dos cosas se leen del árbol pintado. Hoy **nada** mira `x1` ni `x2`: `grep -cE "x1|x2" src/screens/home/weekly-activity-chart.test.tsx` da 0 (`#68 R7` solo asevera `strokeDasharray`, `y1` e `y2`). Mover la línea sin mover la fila da verde hoy (sonda `avgx1`) |
| #131: la gráfica real de `react-native-chart-kit` se puede pintar en el test | **cierta, medida y descartada** | con el `__esModule` del mock de `react-native-svg` forzado y el `BarChart` real, el área de trazado sale en `x 40.400000000000006`, ancho `240.6`. [[design]] §Alternativas descartadas dice por qué no se usa |
| #131: las columnas no tienen candado de reparto | **cierta** | verdes (47/47): la rama de reposo sin `flex-1`, la seleccionada sin `flex-1`, las dos sin `items-center` y la de reposo con un `px-1` más (sondas `colnoflex`, `selnoflex`, `colnocenter` y `colextra`) |
| #135: un `<View accessible>` alrededor de `<MetricSelector` deja verdes la gráfica, la Home y las suites que leen la gráfica | **cierta, re-medida** | 5 suites, 348/348, con el blob `d053148a654bb15abf0e75c2d056d94bea7b930a`: es **exactamente** la sonda `wrapmetric` de la spec de #132, el mismo blob que cita la entrada |
| #135: también con un `Pressable` | **cierta** | 47/47 con el selector dentro de un `<Pressable>` (sonda `presmetric`) |
| #135: `#74 R2` cierra las props del contenedor del selector, no su padre; `#130 R2` solo la fila; `#132 R1` solo el padre de la tarjeta | **cierta** | verdes (47/47): un `View` alrededor de la cabecera, de la tendencia, del gráfico, del detalle o del mensaje vacío, un hijo nuevo sin `testID` en la tarjeta y el selector movido debajo de la tendencia (sondas `wrapheader`, `wraptrend`, `wraplayout`, `wrapdetail`, `wrapempty`, `siblingcard` y `swaporder`). El único hijo de la tarjeta con candado es la fila: un `View` a su alrededor ya da rojo 1 hoy, `#130 R2`, por `toBe` (sonda `wraprow`) |
| Los hijos host de la tarjeta, por estado | **medidos** | con el árbol final en verde: la tabla de [[design]] D5 y de R4 |
| Las cuatro mutaciones rojas solo ponen rojo el test de la gráfica | **cierta, medida** | cada una sobre su etapa (el test con los bloques hasta su R), en las 5 suites: solo fallan los `it` de la gráfica que dice [[tasks]]. Y con los tres ficheros que cambia #138 (`index.tsx`, `index.test.tsx` y `consistency-classnames.test.ts`, tomados de su branch en `1e5ace63`), igual: 1, 1, 1 y 2 rojos, todos de la gráfica. **Esta fila depende de ficheros que esta spec no controla**: si #138 cambia la Home después de `1e5ace63`, puede dejar de ser cierta ([[design]] §Coordinación) |
| El `#` en los títulos y comentarios nuevos no dispara los guards de hex | **cierta con ` R<n>` detrás, medida** | el test final en las 5 suites da verde salvo la gráfica mutada. Con `// #131: the exact class,` en vez de `// #131 R1: the exact class,` (blob del test `f18ea25d4f8d0b3693389fadfd65f392f5e0c62a`), `design-drift.test.ts` da 1 failed de 55: `#68 R18: la actividad semanal no mete drift de estilo › keeps arbitrary text, hex colors, and StyleSheet out of feature sources` |
| `files_affected` es solo el test | **cierta** | ningún requisito necesita otro fichero. La gráfica entra y sale en los rojos |
| Base del test | **medida sin pipe** | 47/47, `exit=0`, 19 `describe` de primer nivel (`grep -c "^describe(" …` da 19) |
| Suite de base | **relatada, no medida** | 86 suites / 1611 tests, cifra del `leader`. El spec_author no corrió la suite entera: la sesión Frontend tenía un `./init.sh` en vuelo sobre los servicios compartidos. Codex la mide al arrancar ([[tasks]] §Antes de tocar nada, paso 6) |
| Blobs de base | **medidos** | la gráfica `c258abedde92d2be981be8507d3d898f13c612cb` y el test `d7f938da18fc038d309d75505e3582dd4ae4b0be`. Iguales en `HEAD` y en `origin/main` |
| El árbol final compila y pasa el lint | **medido** | con el test final (`416bf8b296b34d795a11d5d9f4d901a8b1a40fcb`), `bunx tsc --noEmit` y `bunx eslint` de los dos ficheros, `exit=0` los dos |
| Entorno | **verificado** | `test ! -e .expo/types/router.d.ts` da `exit=0`. No hay hooks de git (`core.hooksPath` sin valor y ningún hook sin `.sample`) ni configuración de prettier en `mobile-pet-tracker/` |

## Requisitos funcionales

- **R1** (#131): WHILE `WeeklyActivityChart` pinte la fila de columnas (al
  menos un día medido), THE SYSTEM SHALL mantener el `className` del `View` con
  `testID="weekly-activity-day-row"` **exactamente** en `'flex-row'`: antes de
  medir el gráfico, tras medirlo, con la segunda métrica seleccionada y con un
  día seleccionado.

  `#131 R1: la fila de las siete columnas es una fila › la fila solo lleva flex-row antes y después de medir, con otra métrica y con un día seleccionado`

  asevera en esos cuatro estados, con `toBe` y un literal del test, el
  `className` de la fila. Antes de cada aserción, salvo la primera, una guarda
  prueba que el estado se alcanzó (`weekly-activity-bar-chart` en pantalla, el
  `accessibilityState` `{ selected: true }` de la opción pulsada y
  `weekly-activity-tooltip` en pantalla).

  IF la fila pasa a `flex-col`, a `flex-row-reverse` o gana cualquier otra
  clase, en cualquiera de esos cuatro estados, THEN ese `it` SHALL fallar **por
  aserción** (`expect(received).toBe(expected)`). El rojo es una mutación de
  producción versionada (C4, vía **b**): `className="flex-col"` en la fila. Con
  ella, el `it` de R1 SHALL ser el **único** rojo de la suite (1 failed de
  1612 sobre la base relatada).

- **R2** (#131): WHILE `WeeklyActivityChart` pinte la fila de columnas con el
  gráfico medido, THE SYSTEM SHALL mantener el `style` de la fila, fusionado,
  **exactamente** en `{ paddingLeft, paddingRight }`, con `paddingLeft` igual al
  `x1` de la línea de media (`weekly-activity-average`) y `paddingRight` igual
  al `width` del `BarChart` menos el `x2` de esa línea: tras medir, con la
  segunda métrica y con un día seleccionado.

  `#131 R2: la fila deja a cada lado el mismo hueco que el gráfico › el padding de la fila son los dos huecos de la línea de media, también con otra métrica y con un día seleccionado`

  asevera con `toEqual` que `mergeObjectStyles(fila.props.style)` es ese
  objeto de dos claves, con los dos términos leídos del árbol pintado
  (`getByTestId('weekly-activity-average').props` y
  `latestBarChartProps().width`). **Ningún literal de la gráfica** (`40.4`,
  `14`) **ni ningún símbolo importado de producción** (`CHART_PAD_LEFT`,
  `CHART_PAD_RIGHT`).

  IF el `padding` de la fila cambia por un lado, por los dos, se intercambia,
  depende de la métrica o de la selección, o el `style` gana otra clave, THEN
  el `it` SHALL fallar por `toEqual`. IF la línea de media se mueve y la fila
  no, THEN también. El rojo es una mutación versionada (vía **b**):
  `paddingLeft: 0`. Con ella, el `it` de R2 SHALL ser el **único** rojo de la
  suite (1 failed de 1613).

- **R3** (#131): WHILE `WeeklyActivityChart` pinte la fila de columnas, THE
  SYSTEM SHALL mantener el `className` de **cada uno de los siete hijos host de
  la fila, por posición**, exactamente en `'min-h-11 flex-1 items-center justify-end'`,
  y el del día seleccionado, exactamente en
  `'min-h-11 flex-1 items-center justify-end border-t-2 border-accent-strong'`:
  antes de medir, tras medir, con la segunda métrica y con el cuarto día
  seleccionado.

  `#131 R3: cada columna reparte la fila a partes iguales › las siete columnas llevan flex-1 y centran su contenido antes y después de medir, con otra métrica y con un día seleccionado`

  asevera con `toEqual` la lista de los siete `className` de `row.children`
  contra literales del test, con las mismas guardas que R1. Son las decisiones
  10 (forma del contenedor) y 11 (envoltorio que reparte el espacio) de
  `docs/ui-guidelines.md` §Enmienda #70, en **las dos ramas** del ternario.

  IF una columna pierde `flex-1` o su centrado, seleccionada o no, o gana otra
  clase, en cualquiera de los cuatro estados, THEN el `it` SHALL fallar por
  `toEqual`. El rojo es una mutación versionada (vía **b**): la rama de reposo
  sin `flex-1`. Con ella, el `it` de R3 SHALL ser el **único** rojo de la suite
  (1 failed de 1614).

- **R4** (#135): THE SYSTEM SHALL mantener **los hijos host de
  `weekly-activity-card`, en orden y sin ningún otro**, exactamente en:

  | Estado | `testID` de los hijos host, en orden (todos con el prefijo `weekly-activity-`) |
  |---|---|
  | días medidos, sin comparación, antes o después de medir y con la segunda métrica | `header`, `metric`, `chart-layout`, `day-row` |
  | lo mismo con un día seleccionado | `header`, `metric`, `chart-layout`, `day-row`, `detail` |
  | días medidos, con comparación | `header`, `metric`, `trend`, `chart-layout`, `day-row` |
  | ningún día medido | `header`, `empty` |

  `#135 R4: entre la tarjeta y cada uno de sus hijos no hay otro nodo`
  asevera cada estado con `toEqual` y listas literales del test, en tres `it`
  (la comparación y el estado vacío son props de montaje):

  1. `› sin comparación: cabecera, selector, gráfico y fila antes y después de medir y con otra métrica, y el detalle al final con un día seleccionado`
     (las cuatro aserciones con las guardas de R1);
  2. `› con comparación, la tendencia va entre el selector y el gráfico`;
  3. `› sin ningún día medido, la tarjeta solo tiene la cabecera y el mensaje`.

  IF un `<View accessible>`, un `Pressable` o cualquier otro nodo host envuelve
  el selector de métrica, o cualquier otro hijo de la tarjeta, o aparece un hijo
  nuevo, o cambia el orden, THEN al menos un `it` de R4 SHALL fallar **por
  aserción** (`toEqual`) en el estado donde aparece. El rojo es una mutación
  versionada (vía **b**): la sonda `wrapmetric` de #132, el `<View accessible>`
  alrededor de `<MetricSelector`. Con ella, los `it` 1 y 2 de R4 SHALL ser los
  **únicos** rojos de la suite (2 failed de 1617); el 3 sigue verde porque en
  el estado vacío no hay selector.

- **R5** (#131 y #135): THE SYSTEM SHALL cerrar con:

  1. **El delta declarado**: +0 suites y +6 tests. La gráfica pasa de 47 a 53,
     y la suite, de 86 / 1611 a 86 / 1617, medida sin pipe. Si la base medida al
     arrancar es otra (por ejemplo, 86 / 1613 si #138 mergea antes y la branch
     lo incorpora), el delta exigido sigue siendo +6 tests y +0 suites sobre lo
     medido.
  2. **Diff de producción vacío**: `git diff --exit-code origin/main...HEAD --
     mobile-pet-tracker/src/screens/home/weekly-activity-chart.tsx` da 0, y la
     gráfica acaba en su blob de base.
  3. **Ningún `describe` de #68, #74, #130 ni #132 editado**, y todos verdes: el
     diff del test contra `origin/main` son 252 líneas añadidas y 0 borradas
     (criterio 3 de las dos entradas).
  4. **Ninguna cifra de candado se mueve**, con los `grep` de [[tasks]] §R5.
  5. `bunx tsc --noEmit` con `exit=0` tras `test ! -e .expo/types/router.d.ts`,
     y `bunx eslint` de los dos ficheros con `exit=0`.
  6. **Ninguna dependencia nueva** ni copy nueva.
  7. La tabla de [[tasks]] §Sondas, re-medida sobre el árbol final, en
     `progress/impl_mobile-weekly-day-row-layout-lock.md`.

  No tiene test propio: es una propiedad del diff y de la suite. Lo cierra el
  `reviewer` por inspección.

## Decisiones por elemento

Por `docs/ui-guidelines.md` §Enmienda #70, contando por hijos host y no por
`testID`. «Hoy» es quién lo cierra en la base; «tras esta feature», quién lo
cierra al acabar.

**La fila** (`weekly-activity-day-row`, contenedor de las siete columnas):

| Decisión | Hoy | Tras esta feature |
|---|---|---|
| claves de sus props | `#130 R1` | igual |
| hijos (identidad, orden y cardinalidad, siete) y padre (la tarjeta) | `#130 R2` | igual |
| 10. forma del contenedor (`flex-row`) | **nadie** (`flexcol`) | **R1** |
| alineación con las barras (`padding`) | **nadie** (`nopad`) | **R2** |

**Cada columna** (`weekly-activity-day-<fecha>`, elemento repetido; sus hijos
host son la etiqueta del día y el valor o el guion):

| Decisión | Hoy | Tras esta feature |
|---|---|---|
| 1. dato que muestra | `#68 R5` y `#68 R6` | igual |
| 2. componente de icono | no aplica: la columna no tiene icono | — |
| 3. etiqueta visible | `#68 R3` | igual |
| 4. nombre accesible | `#68 R9` | igual |
| 5. fondo o hueco (el borde del día seleccionado) | **nadie** | **R3** (fija `border-t-2 border-accent-strong`) |
| 6. tinta del icono | no aplica | — |
| 7. color y receta de cada texto | **nadie** (`labelcolor`, `valuecolor`) | **nadie: (F)** |
| 8. acción (abre el detalle) | `#68 R8` | igual |
| 9. condición de render (las siete, también con huecos) | `#68 R13` y `#130 R2` | igual |
| 10. forma del contenedor | **nadie** (`colnocenter`) | **R3** |
| 11. envoltorio que reparte (`flex-1`) | **nadie** (`colnoflex`, `selnoflex`) | **R3** |
| 12. orden de sus hijos (etiqueta y valor) | **nadie** (`colswap`) | **nadie: (F)** |

**La tarjeta** (`weekly-activity-card`):

| Decisión | Hoy | Tras esta feature |
|---|---|---|
| claves de sus props | `#74 R2` | igual |
| padre (raíz host de la gráfica) | `#132 R1` | igual |
| hijos (identidad, orden y cardinalidad) | **nadie**, salvo la fila (`wrapmetric`, `swaporder`, `siblingcard`…) | **R4**, en los cuatro estados |
| su clase (`gap-2`) | **nadie** (`cardgap`) | **nadie: (D)** |

**Los demás hijos de la tarjeta** (cabecera, selector, tendencia, gráfico,
detalle y mensaje vacío): lo que deciden dentro lo cierran #68 y #74; su
**sitio** en la tarjeta, R4. La única decisión interna que queda abierta es un
envoltorio dentro del selector alrededor de sus tres opciones (`wrapoptions`,
(F)).

## Zona ciega: qué estado ve cada requisito

Las entradas de estado de la gráfica que cambian el árbol, y en cuáles asevera
cada requisito. Una casilla vacía es un hueco declarado, con su sonda.

| Entrada de estado | R1 | R2 | R3 | R4 |
|---|---|---|---|---|
| sin medir (`chartWidth` 0) | sí | **no**: no hay línea ni `BarChart` (sonda `padlayout`, (D)) | sí | sí (`it` 1) |
| medido a 295 | sí | sí | sí | sí (los tres `it`) |
| segunda métrica (`distanceM`) | sí | sí | sí | sí (`it` 1) |
| tercera métrica (`walkCount`) | no, (D) | no, (D) | no, (D) | no, (D) |
| un día seleccionado | sí | sí | sí (y la rama seleccionada) | sí (`it` 1) |
| con comparación (`trend !== null`) | **no** (sonda `flexcoltrend`, (D)) | no, (D) | no, (D) | sí (`it` 2) |
| ningún día medido | no hay fila | no hay fila | no hay fila | sí (`it` 3) |
| algún día `missing` entre los medidos | no, (D) | no, (D) | no, (D) | **no** (sonda `metricwrapmissing`, (D)) |
| idioma, tema, plataforma | no, (D) | no, (D) | no, (D) | no, (D) |

Las sondas de zona ciega **propias** de esta spec prueban que cada estado que sí
se recorre cuenta: un envoltorio del selector **solo antes de medir**
(`metricwraplayoutctl`) solo lo ve la primera aserción del `it` 1 de R4; **solo
con un día seleccionado** (`metricwrapsel`), la última; **solo con
comparación** (`metricwraptrend`) y el selector movido debajo de la tendencia
(`swaporder`), solo el `it` 2; y una columna seleccionada sin `flex-1`
(`selnoflex`), solo la última aserción de R3.

## Tabla de sondas, resumen

Las sondas, con el blob exacto de cada mutación y el `it` que falla, están en
[[tasks]] §Sondas. «Hoy» es la mutación sobre la base (el test en 47), y «tras
esta feature», sobre el árbol final (53). Todas son rojas **por aserción**
salvo `wrapmetricid`.

| Clase | Sondas | Hoy | Tras esta feature |
|---|---|---|---|
| La fila cambia de forma | `flexcol`, `flexrev`, `rowextra`, `flexcollayout`, `flexcolmetric`, `flexcolsel` | verde | **rojo 1**: R1, por `toBe` |
| La fila cambia de forma solo con comparación | `flexcoltrend` | verde | **verde**: (D) |
| La fila se desalinea del gráfico | `nopad`, `padright`, `padsym`, `padswap`, `padextra`, `padmetric`, `padsel`, `avgx1` | verde | **rojo 1**: R2, por `toEqual` |
| La fila se desalinea solo antes de medir | `padlayout` | verde | **verde**: (D) |
| Todo el gráfico se desalinea de la librería | `padconst` | verde | **verde**: (F) |
| Una columna deja de repartir o de centrar | `colnoflex`, `selnoflex`, `colnocenter`, `colextra`, `colnoflexlayout`, `colnoflexmetric` | verde | **rojo 1**: R3, por `toEqual` |
| El contenido de la columna cambia de orden o de color | `colswap`, `labelcolor`, `valuecolor` | verde (también en las 5 suites) | **verde**: (F) |
| Un nodo envuelve el selector | `wrapmetric`, `presmetric`, `metricwraplayout` | verde | **rojo 2**: R4 `it` 1 y 2 |
| … solo en un estado | `metricwraplayoutctl`, `metricwrapsel` / `metricwraptrend` | verde | **rojo 1**: R4 `it` 1 / `it` 2 |
| … solo con la segunda métrica | `metricwrapmetric` | rojo 1: `R6 › desliza una única píldora…` | **rojo 2**: ese y R4 `it` 1 |
| … solo con un día `missing` | `metricwrapmissing` | verde | **verde**: (D) |
| … con el mismo `testID` que el selector | `wrapmetricid` | rojo 4 **por consulta** (`Found multiple elements`) | igual: R4 verde, lo paran otros cuatro. (N) |
| … con un fragmento | `fragmetric` | verde | **verde**: (N), no hay nodo host |
| Un nodo envuelve otro hijo de la tarjeta | `wrapheader`, `wraptrend`, `wraplayout`, `wrapdetail`, `wrapempty` | verde | **rojo** en los `it` de R4 donde está el hijo (3, 1, 2, 1 y 1) |
| … la fila | `wraprow` | rojo 1: `#130 R2`, por `toBe` | **rojo 3**: ese y R4 `it` 1 y 2 |
| Un hijo nuevo o el orden cambia | `siblingcard`, `swaporder` | verde | **rojo 3** / **rojo 1** |
| Un envoltorio dentro del selector | `wrapoptions` | verde | **verde**: (F) |
| La clase de la tarjeta | `cardgap` | verde (también en las 5 suites) | **verde**: (D) |
| `#131` suelto en un comentario | `hexbare` (en el test) | no aplica | `design-drift.test.ts`: rojo 1 de 55, `#68 R18` |

## Qué firma el humano al aprobar esta spec

1. **Dos entradas, un ciclo, una sola casilla.** #131 (R1 a R3) y #135 (R4)
   se implementan en la branch `feature/131-mobile-weekly-day-row-layout-lock`,
   con una sola revisión. #135 se queda en `spec_ready` mientras #131 está
   `in_progress` (`init.sh` aborta con dos), y pasa a `done` con el mismo
   veredicto.
2. **R1 y R3 fijan clases enteras.** R1 compara la clase de la fila con
   `toBe('flex-row')`, y R3, la de cada columna con la cadena completa. El
   coste: cualquier cambio legítimo de esas clases obliga a tocar el candado a
   sabiendas. En particular, R3 fija también `min-h-11` (que `#68 R9` ya mira
   con `toContain`) y los dos tokens del borde del día seleccionado,
   `border-t-2 border-accent-strong`, que hoy no mira nadie.
3. **R2 es relacional con la línea de media, y es el primer candado sobre sus
   extremos.** El esperado se lee del árbol pintado, sin literales ni imports.
   Mover la línea sin mover la fila también lo pone rojo (`avgx1`). Lo que R2
   **no** ve es que todo el gráfico se desalinee de `react-native-chart-kit`:
   si `CHART_PAD_LEFT` cambia, fila y línea se mueven juntas (`padconst`,
   verde). Candarlo contra la librería real es **factible** (medido) pero se
   descarta aquí por las razones de [[design]]; queda como (F).
4. **R2 no mira antes de medir**: sin `BarChart` no hay segundo término
   (`padlayout`, (D)).
5. **R4 es una lista cerrada de los hijos de la tarjeta en sus cuatro
   estados**, no solo el padre del selector. Cierra también los envoltorios de
   la cabecera, la tendencia, el gráfico, el detalle y el mensaje vacío, un
   hijo nuevo y el orden. El coste: cualquier hijo o envoltorio nuevo y
   legítimo, accesible o no, obliga a tocar el candado a sabiendas.
6. **Las mutaciones versionadas**: `flex-col` en la fila (R1),
   `paddingLeft: 0` (R2), la columna en reposo sin `flex-1` (R3) y el
   `<View accessible>` alrededor del selector (R4), que es exactamente la
   `wrapmetric` de #132 (mismo blob, `d053148a`). Cada verde la revierte con
   `git checkout HEAD~1 --`. La historia toca la gráfica en ocho commits, pero
   el diff acumulado es vacío (R5.2).
7. **El delta es +0 suites y +6 tests**: 86 / 1611 antes y 86 / 1617 después,
   sobre la base **relatada por el `leader`** y no medida por el spec_author.
   Codex la mide al arrancar, y el delta se exige sobre lo medido.
8. **El contenido de cada columna queda abierto** como (F): el orden etiqueta
   y valor (`colswap`) y el color de cada texto (`labelcolor`, `valuecolor`)
   dan verde hoy, tras esta feature y en las otras cuatro suites que leen la
   gráfica. Son las decisiones 7 y 12 de la carta para la columna. No entran
   porque ninguna de las dos entradas las pide y ensancharían el ciclo; el
   humano decide si se registran como entrada nueva.
9. **Sin gate de dispositivo.** El árbol de producción acaba idéntico al de
   `origin/main`: en un dispositivo no hay nada nuevo que ver ni que oír. El
   único gate humano es la casilla de §Aprobación.
10. **Requisito sin test propio**: R5, que es una propiedad del diff y de la
    suite. Lo cierra el `reviewer` por inspección, y queda declarado aquí antes
    del handoff, como pide C4.

## Cobertura de los criterios de aceptación

**#131** (`feature_list.json`):

| Criterio | Cubierto por |
|---|---|
| 1. Con `className='flex-col'` en la fila, un `it` falla | R1 (sonda `flexcol`, que es su rojo) |
| 2. Con `paddingLeft: 0`, un `it` falla; el candado es relacional, sin importar símbolos de producción ni copiar su literal | R2 (sonda `nopad`, que es su rojo), con el esperado leído de la línea de media y del `BarChart` |
| 3. Los `describe` de #68, #74 y #130 siguen verdes y sin cambios | R5.3 |
| 4. Cero cambio en producción; suite verde medida sin pipe; delta declarado | R5.1 y R5.2 |

**#135** (`feature_list.json`):

| Criterio | Cubierto por |
|---|---|
| 1. Con un `View accessible` (o un `Pressable`) envolviendo el selector, un `it` falla por aserción | R4 (sondas `wrapmetric`, que es su rojo, y `presmetric`) |
| 2. Los esperados son literales del test | R4: las cuatro listas se escriben en el test; no se importa nada de la gráfica |
| 3. Los `describe` de #68, #74, #130 y #132 siguen verdes y sin cambios | R5.3 |
| 4. Cero cambio en producción; suite verde medida sin pipe; delta declarado | R5.1 y R5.2 |

## Fuera de alcance

Cada viñeta está clasificada: **(D)** delimitación de esta feature,
**(F)** hallazgo candidato a registrarse como otra feature (sin id: lo asigna
el `leader` contra `origin/main`) y **(N)** premisa verificada y descartada.

- **(D)** *R1 a R3 no varían la comparación, la tercera métrica, los días
  `missing`, el idioma, el tema ni la plataforma.* La clase de la fila es un
  literal (`grep -c 'className="flex-row"' src/screens/home/weekly-activity-chart.tsx`
  da 1), su `style` son dos constantes, y la clase de cada columna solo depende
  de `selected`. Una mutación que dependa de uno de esos estados pasa (sonda
  `flexcoltrend`, verde); hacerla es cambiar la gráfica a propósito, no un
  descuido que R1 a R3 deban prever.
- **(D)** *R2 no asevera antes de medir.* Sin `BarChart` ni línea de media, la
  relación no tiene segundo término (sonda `padlayout`, verde).
- **(D)** *R4 no varía los días `missing` ni la tercera métrica.* Los hijos de
  la tarjeta solo dependen de `hasMeasuredDay`, `trend !== null` y
  `selectedDay`, y los tres se recorren (sonda `metricwrapmissing`, verde).
- **(D)** *La clase de la tarjeta (`gap-2`) queda sin candado.* La tarjeta no
  es un elemento repetido, `#74 R2` cierra sus claves y `#132 R1` su padre.
  Medido: `gap-4` da verde hoy, en las 5 suites y tras esta feature (sonda
  `cardgap`, blob `e910626e`).
- **(D)** No se toca ningún `describe` de #68, #74, #130 ni #132, ni sus
  helpers, ni se añade copy: no se tocan `src/i18n/catalog.ts`,
  `src/providers/__tests__/language-provider.test.tsx` ni
  `src/__tests__/ui-copy-table.ts`. No se instala nada.
- **(D)** No se miran los ancestros de la tarjeta en la Home
  (`src/screens/home/index.tsx`). La Home no es de esta feature, y #138 la toca.
- **(F)** *Todo el gráfico puede desalinearse de `react-native-chart-kit` sin
  un rojo.* Con `CHART_PAD_LEFT = 30` (sonda `padconst`, blob `bef286f8`), la
  fila y la línea se mueven juntas y la suite sigue verde. Es el contrato «la
  gráfica frente a la librería», no el de #131 («la fila frente a la
  gráfica»). Medido factible con el `BarChart` real ([[design]]).
- **(F)** *El contenido de cada columna no tiene candado de orden ni de color.*
  Con la etiqueta debajo del valor (`colswap`, `6214543c`), la etiqueta en
  `text-foreground` (`labelcolor`, `f58f4903`) o el valor en `text-muted`
  (`valuecolor`, `bc902097`), verde hoy, en las 5 suites y tras esta feature.
  Son las decisiones 12 y 7 de la carta para la columna (§Qué firma el humano,
  punto 8).
- **(F)** *Un envoltorio dentro del selector, alrededor de sus tres opciones,
  pasa.* Con un `<View className="flex-row gap-1">` entre el contenedor del
  selector y sus opciones (sonda `wrapoptions`, `932027b6`), verde hoy y tras
  esta feature. `#74 R2` cierra las claves del contenedor, no sus hijos. Queda
  por debajo de la tarjeta, así que no es de #135.
- **(N)** *Que un fragmento alrededor del selector sea un hueco.* `<>` no crea
  nodo host; R4 sigue verde y es correcto (sonda `fragmetric`).
- **(N)** *Que un envoltorio con el mismo `testID` que el selector burle R4.*
  R4 lo ve como `weekly-activity-metric` y sigue verde, pero hoy ya lo paran
  cuatro tests **por consulta** (`Found multiple elements with testID: weekly-activity-metric`):
  `#74 R1`, `#74 R2`, `R6 › ofrece tres opciones accesibles…` y
  `R13 › mantiene las siete columnas…` (sonda `wrapmetricid`).

---

## Aprobación

- [ ] **Aprobado por humano** (fecha: ____) ← gate obligatorio antes de
      implementar. Al marcar esta casilla, el humano firma también los diez
      puntos de §Qué firma el humano al aprobar esta spec, y en particular el
      octavo (registrar o no como entrada nueva el contenido de la columna).

> **Esta feature tiene una sola casilla**: esta, que firma las dos entradas.
> No hay gate de dispositivo (§Qué firma el humano, punto 9).

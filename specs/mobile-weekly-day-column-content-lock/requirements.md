---
feature: "mobile-weekly-day-column-content-lock"
status: spec_ready       # draft | spec_ready | approved
tags: [spec, mobile, test, deuda]
---

# Requisitos — [[mobile-weekly-day-column-content-lock]] (#140)

> Notación EARS. Cada requisito lleva su id `R<n>`, inmutable una vez aprobado.
> Ver [[design]] para las decisiones y las alternativas descartadas, [[tasks]]
> para el orden TDD, el código exacto, los blobs y las sondas, y
> [[traceability]] para el cierre.
>
> Origen: el hallazgo **(F)** de `specs/mobile-weekly-day-row-layout-lock/requirements.md`
> §Fuera de alcance, «El contenido de cada columna no tiene candado de orden ni
> de color», registrado el 2026-09-30 al firmar la spec de #131 y #135 (punto 8
> de su §Qué firma el humano).
>
> **Base medida: `0af5d921`** (`origin/main`, merge de la PR #179 de #131 y
> #135). La branch `feature/140-mobile-weekly-day-column-content-lock` está en
> `c387a49d`, que sobre esa base solo cambia `progress/current.md`. Medido el
> 2026-09-30. **Los números de línea no son anclas**, ni los de esta spec ni los
> de la entrada de `feature_list.json`: todo se localiza con los `grep` o los
> títulos literales que se citan, y las cuentas se vuelven a medir al arrancar
> ([[tasks]] §Antes de tocar nada).
>
> Los títulos y los comentarios nuevos llevan el prefijo `#140 R<n>`, como pide
> `docs/conventions.md` §Prefijo de feature: el test ya acumula R-ids de #68,
> #74, #130, #131, #132 y #135.

## Contexto mínimo para implementar sin más contexto

La feature toca **un fichero**,
`mobile-pet-tracker/src/screens/home/weekly-activity-chart.test.tsx` («el
test», 53 tests hoy). El fichero de producción
`mobile-pet-tracker/src/screens/home/weekly-activity-chart.tsx` («la gráfica»)
**solo se toca en los dos commits rojos**, para versionar una mutación que el
commit verde siguiente revierte. El diff acumulado de la gráfica contra
`origin/main` es **vacío**.

Lo que pinta cada columna, en host (lo que ven las consultas de RNTL v14):

```
View testID="weekly-activity-day-row"                 (className="flex-row"; sus siete hijos host los fijan #130 R2 y #131 R3)
└─ Pressable testID="weekly-activity-day-<fecha>"     (la columna, siete veces)
   ├─ Text testID="weekly-activity-day-label"          className="text-2xs font-semibold text-muted"
   │    texto: weekdayLabel(day.date, locale, 'short'), p. ej. «mié»
   └─ según day.source:
      'missing':             Text testID="weekly-activity-missing-<fecha>"  className="text-2xs font-normal text-muted"
                               texto: «—» (la raya; #68 R5 la llama «guion»)
      'stored' o 'computed': Text testID="weekly-activity-value-<fecha>"    className="text-2xs font-semibold text-foreground"
                               texto: formatMetricValue(selectedMetric, metricValue(day, selectedMetric))
```

El ternario `{day.source === 'missing' ? (…) : (…)}` **no crea nodo host**: cada
columna tiene exactamente dos hijos host en todos los estados. La etiqueta lleva
el **mismo** `testID` en las siete columnas (`weekly-activity-day-label`); el
valor y la raya llevan la fecha. `.children` de un `TestInstance` de RNTL v14
lista solo hijos host y está tipado como `(TestInstance | string)[]`.

En el test ya existen, y los bloques nuevos los usan sin tocarlos:

- `renderChartWithProps(props, language = 'es', fireLayout = true)`, que con
  `fireLayout = false` deja la gráfica sin medir;
- `makeWeek(from, minutes)`, con `minutes: (number | null)[]`: un `null` da un
  día `missing`;
- `NO_COMPARISON`, y `fireEvent` y `within`, importados de
  `@testing-library/react-native`.

Al pulsar el día `missing`, el detalle (`weekly-activity-detail`) dice
«Sin datos de este día»: es copy que ya existe y que el test ya usa dos veces.

El último `describe` del test en la base es
`describe('#135 R4: entre la tarjeta y cada uno de sus hijos no hay otro nodo'`.

## Premisas de la entrada, verificadas contra el árbol

Todas las medidas son de la gráfica con el comando canónico de [[tasks]]
§Antes de tocar nada, en un worktree de sondas desacoplado sobre `c387a49d`,
salvo donde dice «6 suites»: la gráfica más `src/screens/home/index.test.tsx`,
`src/__tests__/design-drift.test.ts`, `src/__tests__/consistency-classnames.test.ts`,
`src/__tests__/legibility-classnames.test.ts` y `src/__tests__/ui-language.test.ts`,
382 tests en la base.

| Premisa (`feature_list.json` #140 y el encargo del `leader`) | Veredicto | Evidencia |
|---|---|---|
| Cada columna tiene dos hijos host: la etiqueta y, debajo, el valor o la raya, con las tres clases que cita la entrada | **cierta** | las tres líneas de clase dan 1 cada una con su sangría ([[tasks]] §Sondas, convenciones). El ternario no crea nodo host. Con el test final, R1 y R2 dan verde (55/55) aseverando exactamente eso |
| Con la etiqueta debajo del valor (`colswap`), la gráfica sigue verde | **cierta, re-medida** | 6 suites, 382/382, con el blob `6214543c5bdd14f94ab65046e156d4ed71331e05`: el mismo que cita la entrada, porque la gráfica tiene el mismo blob de base (`c258abed`) que cuando se escribió la spec de #131 |
| Con la etiqueta en `text-foreground` (`labelcolor`) o el valor en `text-muted` (`valuecolor`), también | **cierta, re-medida** | 6 suites, 382/382 cada una, con `f58f4903851ea448b4421fadc163e6dd83a361a6` y `bc902097b1e54c20f887aef673d645d47852a02c`, los blobs de la entrada |
| Verde «tras #131 y #135 (53/53)» | **cierta** | #131 y #135 ya están en la base (`0af5d921`): el test da 53/53 |
| Verde «en las otras cuatro suites que leen la gráfica» | **cierta, pero la lista es corta** | `src/__tests__/legibility-classnames.test.ts` también lee el fuente de la gráfica (recorre `src/` con `readdirSync`). Las tres sondas dan verde también ahí: las cifras de arriba son de las 6 suites. `src/hooks/use-pet-selection.test.tsx` recorre también todo `src/`, pero solo busca la cadena `selectionExists`, que ni la gráfica ni ninguna de las 31 mutaciones de §Sondas contienen (`grep -l selectionExists` da `exit=1`). El resto de lectores de ficheros leen rutas fijas que no son la gráfica, o solo `src/app/` |
| La clase de la raya del día `missing` no se probó; hay que medirla antes de decidir si entra | **cierta; medida y entra** | con la raya en `text-foreground` (sonda `dashcolor`, `af98ef4e`), 6 suites, 382/382; con `font-semibold` (`dashweight`), 53/53. Nadie la mira hoy. Entra en R2: es la decisión 7 de la carta («color y receta tipográfica de **cada** texto») en la rama `missing`, y la 10 pide la forma «en **todas** sus ramas, no solo la cargada». Cuesta un literal más en la misma aserción ([[design]] D3) |
| `#131 R3` fija la clase de la columna, no la de sus hijos; `#130 R2`, los hijos de la fila, no los de cada columna | **cierta** | `colswap`, `labelcolor`, `valuecolor` y `dashcolor` dan verde con los dos `describe` en el test |
| El test ya pinta algún día `missing` | **sí, pero nadie mira su columna** | `#68 R5`, `R8`, `R9` y `R13` montan semanas con `null`, y `#68 R5` asevera el texto de la raya (sonda `dashtext`, rojo). Ninguno mira el orden ni la clase de los hijos de la columna. R1 y R2 lo alcanzan como **prop de montaje** (`makeWeek('2026-09-02', [10, 20, 30, 40, 50, null, 70])`: el sexto día, `2026-09-07`, es `missing`) y lo **seleccionan** en su quinto estado |
| `toEqual` basta para una lista cerrada de hijos | **falsa, medida** | `toEqual` ignora un último elemento `undefined` de un array: un hijo host extra sin `testID` ni `className` al final de la columna pasa. Con los diez `toStrictEqual(expected)` de R1 y R2 cambiados a `toEqual(expected)` (test `b62db88a`), la sonda `coltail` da verde, 55/55, y `dotsel` solo pone rojo R2 (el punto tiene clase, no `testID`). Con `toStrictEqual`, las dos dan rojo 2 ([[design]] D4) |
| … y el mismo hueco en los candados hermanos | **medido** | con un `<View />` al final de la fila (sonda `rowtail`, `333d4e0c`), 53/53 hoy: `#130 R2` y `#131 R3` no lo ven. R1 y R2 lo cierran de paso. Con un `<View />` al final de la tarjeta (`cardtail`, `0ac97f35`), verde hoy y tras esta feature, en las 6 suites (384/384): `#135 R4` usa `toEqual`. Queda como (F) |
| Las dos mutaciones rojas solo ponen rojo el test de la gráfica | **cierta, medida** | cada una sobre su etapa (el test con los bloques hasta su R), en las 6 suites: `P1red` 1 failed de 383, solo `#140 R1`; `P2red` 1 failed de 384, solo `#140 R2` |
| El `#` en los títulos y comentarios nuevos no dispara los guards de hex | **cierta con ` R<n>` detrás, medida** | con `// #140: the host children…` en vez de `// #140 R1: the host children…` (test `d82f923a`), `design-drift.test.ts` da 1 failed de 55: `#68 R18: la actividad semanal no mete drift de estilo › keeps arbitrary text, hex colors, and StyleSheet out of feature sources` |
| `files_affected` es solo el test | **cierta** | ningún requisito necesita otro fichero. La gráfica entra y sale en los rojos |
| Base del test | **medida sin pipe** | 53/53, `exit=0`, 23 `describe` de primer nivel (`grep -c "^describe(" …` da 23) |
| Suite de base | **relatada, no medida** | 86 suites / 1619 tests, `exit=0`: el `./init.sh` del `leader` sobre `0af5d921`. El spec_author no corrió la suite entera, por encargo. Codex la mide al arrancar ([[tasks]] §Antes de tocar nada, paso 6) |
| Blobs de base | **medidos** | la gráfica `c258abedde92d2be981be8507d3d898f13c612cb` y el test `416bf8b296b34d795a11d5d9f4d901a8b1a40fcb`. Iguales en `c387a49d` y en `origin/main` |
| El árbol final compila y pasa el lint | **medido** | con el test final (`2f3828f4c039e9f3794c739e831c6402e138d6a9`), `bunx tsc --noEmit` y `bunx eslint` de los dos ficheros, `exit=0` los dos |
| Nadie más toca estos ficheros | **verificado** | ninguna branch local ni remota `feature/*` cambia la gráfica, su test, `index.test.tsx` ni `src/__tests__/` respecto de `origin/main` (incluida la de #60, en el worktree principal) |
| Entorno | **verificado** | `test ! -e .expo/types/router.d.ts` da `exit=0` en el worktree de la branch. No hay hooks de git (`core.hooksPath` sin valor y ningún hook sin `.sample`) ni configuración de prettier en `mobile-pet-tracker/` |

## Requisitos funcionales

Los dos candados aseveran en **los mismos cinco estados**, en este orden, cada
uno (salvo el primero) tras una guarda que prueba que se alcanzó:

| # | Estado | Guarda |
|---|---|---|
| 1 | montada sin medir (`fireLayout = false`) | ninguna |
| 2 | medida a 295 | `weekly-activity-bar-chart` en pantalla |
| 3 | segunda métrica (`distanceM`) | `accessibilityState` `{ selected: true }` de `weekly-activity-metric-distanceM` |
| 4 | día medido seleccionado (`2026-09-05`) | `weekly-activity-tooltip` en pantalla |
| 5 | día `missing` seleccionado (`2026-09-07`) | «Sin datos de este día» dentro de `weekly-activity-detail` |

La semana es la misma en los dos: `makeWeek('2026-09-02', [10, 20, 30, 40, 50, null, 70])`,
del `2026-09-02` al `2026-09-08`, con el sexto día `missing`.

- **R1**: WHILE `WeeklyActivityChart` pinte la fila de columnas (al menos un día
  medido), THE SYSTEM SHALL mantener los hijos host de **cada una de las siete
  columnas** `weekly-activity-day-<fecha>`, **en orden y sin ningún otro**,
  exactamente en: primero la etiqueta del día (`weekly-activity-day-label`) y
  después el valor del día (`weekly-activity-value-<fecha>`) o, si el día es
  `missing`, su raya (`weekly-activity-missing-<fecha>`), en los cinco estados.

  `#140 R1: cada columna tiene la etiqueta del día y, debajo, su valor o su raya › las siete columnas tienen dos hijos, la etiqueta primero, antes y después de medir, con otra métrica y con un día seleccionado, medido o sin datos`

  asevera en cada estado, con `toStrictEqual`, la lista de los `testID` de los
  hijos host de cada hijo host de la fila contra una lista literal del test
  (siete listas de dos). Es la decisión 12 (orden de los hijos) de
  `docs/ui-guidelines.md` §Enmienda #70, con identidad y cardinalidad de golpe,
  en las dos ramas del ternario.

  IF la etiqueta pasa debajo del valor o de la raya, un nodo host envuelve a
  cualquiera de los dos, o una columna gana o pierde un hijo host (con o sin
  `testID`, con o sin clase), en cualquier columna y en cualquiera de los cinco
  estados, THEN ese `it` SHALL fallar **por aserción**
  (`expect(received).toStrictEqual(expected)`). El rojo es una mutación de
  producción versionada (C4, vía **b**): la sonda `colswap` de la entrada, la
  etiqueta movida debajo del valor. Con ella, el `it` de R1 SHALL ser el
  **único** rojo de la suite (1 failed de 1620 sobre la base relatada).

- **R2**: WHILE `WeeklyActivityChart` pinte la fila de columnas, THE SYSTEM
  SHALL mantener el `className` de **los dos hijos host de cada columna, por
  posición**, exactamente en:
  - la etiqueta: `'text-2xs font-semibold text-muted'`;
  - el valor: `'text-2xs font-semibold text-foreground'`;
  - la raya del día `missing`: `'text-2xs font-normal text-muted'`;

  en los cinco estados.

  `#140 R2: la etiqueta, el valor y la raya de cada columna llevan su receta exacta › la clase de los dos hijos de cada columna, por posición, antes y después de medir, con otra métrica y con un día seleccionado, medido o sin datos`

  asevera en cada estado, con `toStrictEqual`, la lista de los `className` de
  los hijos host de cada columna contra tres literales del test. Es la decisión
  7 (color y receta tipográfica de cada texto) de la carta, en las dos ramas.

  IF el color, el peso, el tamaño o cualquier otra clase de la etiqueta, del
  valor o de la raya cambia, en todas las columnas o solo en una, siempre o
  solo en uno de los cinco estados, THEN ese `it` SHALL fallar **por aserción**
  (`toStrictEqual`). El rojo es una mutación versionada (vía **b**): la sonda
  `labelcolor` de la entrada, la etiqueta en `text-foreground`. Con ella, el
  `it` de R2 SHALL ser el **único** rojo de la suite (1 failed de 1621). R1
  sigue verde: los `testID` no cambian.

- **R3**: THE SYSTEM SHALL cerrar con:

  1. **El delta declarado**: +0 suites y +2 tests. El test pasa de 53 a 55, y
     la suite, de 86 / 1619 a 86 / 1621, medida sin pipe. Si la base medida al
     arrancar es otra, el delta exigido sigue siendo +2 tests y +0 suites sobre
     lo medido.
  2. **Diff de producción vacío**:
     `git diff --exit-code origin/main...HEAD -- mobile-pet-tracker/src/screens/home/weekly-activity-chart.tsx`
     da 0, y la gráfica acaba en su blob de base.
  3. **Ningún `describe` de #68, #74, #130, #131, #132 ni #135 editado**, y
     todos verdes: el diff del test contra `origin/main` son 150 líneas
     añadidas y 0 borradas (criterio 3 de la entrada).
  4. **Ninguna cifra de candado se mueve**, con los `grep` de [[tasks]] §R3.
  5. `bunx tsc --noEmit` con `exit=0` tras `test ! -e .expo/types/router.d.ts`,
     y `bunx eslint` de los dos ficheros con `exit=0`.
  6. **Ninguna dependencia nueva** ni copy nueva.
  7. La tabla de [[tasks]] §Sondas, re-medida sobre el árbol final, en
     `progress/impl_mobile-weekly-day-column-content-lock.md`.

  No tiene test propio: es una propiedad del diff y de la suite. Lo cierra el
  `reviewer` por inspección.

## Decisiones por elemento

Por `docs/ui-guidelines.md` §Enmienda #70, contando por hijos host y no por
`testID`. El elemento repetido es la columna (siete veces); lo que se decide
aquí es lo que hay **dentro** de ella. «Hoy» es quién lo cierra en la base;
«tras esta feature», quién lo cierra al acabar.

| Decisión | Hoy | Tras esta feature |
|---|---|---|
| 1. dato: la etiqueta dice el día de su fecha | `#68 R3` (sonda `labelcross`: la séptima columna con la letra de la primera da rojo) | igual |
| 1. dato: el valor es el de su día | **nadie** para un cruce entre columnas (sonda `valuecross`: la séptima con el valor de la primera da verde, también en las 6 suites) | **nadie: (F)** |
| 2. componente de icono | no aplica: la columna no tiene icono | — |
| 3. etiqueta visible: el texto de la raya | `#68 R5` (sonda `dashtext`: `-` en vez de `—` da rojo) | igual |
| 4. nombre accesible | de la columna, no de sus hijos: `#68 R9` | igual |
| 5. fondo | no aplica: los textos no tienen fondo | — |
| 6. tinta del icono | no aplica | — |
| 7. color y receta de cada texto: su `className` | **nadie** (`labelcolor`, `valuecolor`, `dashcolor`…) | **R2**, los tres textos |
| 7. … su `style` | `#62 R15`, que cuenta cuatro `style={TABULAR_NUMS}` en la gráfica (sonda `valuetabular`: rojo en `consistency-classnames`) | igual: (N) |
| 7. … otras props (`numberOfLines`) | **nadie** (`labellines`) | **nadie: (D)** |
| 8. destino de navegación | no aplica: la columna abre el detalle en la misma tarjeta (`#68 R8`), y sus hijos no tienen `onPress` | — |
| 9. condición de render (valor o raya según `source`) | `#68 R5` | también **R1**: el `testID` con fecha de cada rama, en su columna |
| 10. forma, «en **todas** sus ramas» | **nadie** | **R1** y **R2**, en la rama medida y en la `missing` |
| 11. envoltorio | **nadie** (`wraplabel`, `wrapcontent`) | **R1** y **R2** |
| 12. orden de sus hijos | **nadie** (`colswap`) | **R1** |
| estructural: cardinalidad (dos hijos host) | **nadie** (`coltail`, `dotmissing`, `dotsel`) | **R1** y **R2**, con `toStrictEqual` |
| etiqueta host (`Text`) | React Native: un texto suelto dentro de un `View` lanza `Invariant Violation` (sonda `labeltag`, 45 rojos hoy) | igual: (N) |

Los invariantes compartidos de la columna (objetivo táctil `min-h-11`,
reparto `flex-1`, rol y nombre accesibles, borde del día seleccionado) son de la
columna, no de su contenido, y ya los cierran `#68 R9` y `#131 R3`.

## Zona ciega: qué estado ve cada requisito

Las entradas de estado de la gráfica que cambian lo que hay dentro de una
columna, y en cuáles asevera cada requisito. Una casilla «no» es un hueco
declarado, con su sonda.

| Entrada de estado | R1 | R2 |
|---|---|---|
| sin medir (`chartWidth` 0) | sí (estado 1) | sí (estado 1) |
| medido a 295 | sí (2) | sí (2) |
| segunda métrica (`distanceM`) | sí (3) | sí (3) |
| tercera métrica (`walkCount`) | no, (D) | **no** (sonda `valuecolorwalks`, (D)) |
| un día medido seleccionado | sí (4) | sí (4) |
| el día `missing` seleccionado | sí (5) | sí (5) |
| un día `missing` entre los medidos | sí, los cinco estados | sí, los cinco estados |
| una semana sin ningún día `missing` | no, (D) | **no** (sonda `labelcolornomissing`, (D)) |
| con comparación (`trend !== null`) | no, (D) | **no** (sonda `valuecolortrend`, (D)) |
| ningún día medido | no hay fila | no hay fila |
| idioma, tema, plataforma | no, (D) | no, (D) |

Las sondas de zona ciega **propias** de esta spec prueban que cada estado que sí
se recorre cuenta, y que cada columna cuenta:

- **solo la columna seleccionada**: `dotsel` (un punto en la columna
  seleccionada) y `labelcolorsel` solo los ve la aserción 4;
- **solo el día `missing` seleccionado**: `dotselmissing` y `dashcolorsel`, solo
  la aserción 5;
- **solo con la segunda métrica**: `valuecolormetric`, solo la aserción 3;
- **solo antes de medir**: `valuecolorlayout` (el valor en `text-muted` mientras
  `chartWidth` es 0), la aserción 1;
- **solo una de las siete columnas**: `labelcolorday` (la séptima etiqueta en
  `text-foreground`), la aserción 1;
- **solo el día `missing`**: `dotmissing` (un punto en su columna), la aserción 1.

## Tabla de sondas, resumen

Las sondas, con el blob exacto de cada mutación y el `it` que falla, están en
[[tasks]] §Sondas. «Hoy» es la mutación sobre la base (el test en 53), y «tras
esta feature», sobre el árbol final (55). Todas son rojas **por aserción**
(`toStrictEqual`) salvo donde se dice.

| Clase | Sondas | Hoy | Tras esta feature |
|---|---|---|---|
| El orden de la columna cambia | `colswap` | verde (6 suites) | **rojo 2**: R1 y R2 |
| Un nodo envuelve a un hijo | `wraplabel`, `wrapcontent` | verde | **rojo 2**: R1 y R2 |
| Un hijo host de más al final de la columna | `coltail`, `dotmissing` | verde | **rojo 2**: R1 y R2 |
| … solo en la columna seleccionada | `dotsel` / `dotselmissing` | verde | **rojo 2**, en la aserción 4 / 5 |
| Un hijo host de más al final de la fila | `rowtail` | verde (`#130 R2` y `#131 R3` no lo ven) | **rojo 2**: R1 y R2 |
| La etiqueta desaparece | `nolabel` | rojo 1 **por consulta**: `#68 R3` | **rojo 3**: ese, igual, y R1 y R2 |
| La etiqueta cambia de color, tamaño o clase | `labelcolor`, `labelsize`, `labelextra` | verde (`labelcolor`: 6 suites) | **rojo 1**: R2 |
| … solo en una columna / solo seleccionada | `labelcolorday` / `labelcolorsel` | verde | **rojo 1**: R2, aserción 1 / 4 |
| … solo en una semana sin `missing` | `labelcolornomissing` | verde | **verde**: (D) |
| El valor cambia de color o de peso | `valuecolor`, `valueweight` | verde (`valuecolor`: 6 suites) | **rojo 1**: R2 |
| … solo antes de medir / solo con la segunda métrica | `valuecolorlayout` / `valuecolormetric` | verde | **rojo 1**: R2, aserción 1 / 3 |
| … solo con la tercera métrica o con comparación | `valuecolorwalks`, `valuecolortrend` | verde | **verde**: (D) |
| La raya cambia de color o de peso | `dashcolor`, `dashweight` | verde (`dashcolor`: 6 suites) | **rojo 1**: R2 |
| … solo con el día `missing` seleccionado | `dashcolorsel` | verde | **rojo 1**: R2, aserción 5 |
| Otra prop en la etiqueta | `labellines` | verde | **verde**: (D) |
| Cifras tabulares en el valor | `valuetabular` | la gráfica verde; en las 6 suites, rojo 1: `#62 R15` | igual: (N) |
| La etiqueta es un `View` | `labeltag` | rojo 45 (`Invariant Violation`) | rojo 47: (N) |
| La etiqueta o la raya cambian de texto | `labelcross` / `dashtext` | rojo 1: `#68 R3` / `#68 R5` | igual: (N) |
| El valor de una columna es el de otra | `valuecross` | verde | **verde** (6 suites): (F) |
| Un hijo host de más al final de la tarjeta | `cardtail` | verde | **verde** (6 suites): (F) |
| R1 y R2 con `toEqual` | `loose` (en el test) con `coltail` / `dotsel` | no aplica | **verde** / rojo 1, solo R2 |
| `#140` suelto en un comentario | `hexbare` (en el test) | no aplica | `design-drift.test.ts`: rojo 1 de 55, `#68 R18` |

## Qué firma el humano al aprobar esta spec

1. **La raya del día `missing` entra.** La entrada solo midió la etiqueta y el
   valor y dejó la raya a decisión de la spec. Medida: nadie mira su clase
   (`dashcolor`, verde en las 6 suites). Entra en R2 por las decisiones 7 y 10
   de la carta, al coste de un literal más en la misma aserción.
2. **`toStrictEqual`, no el `toEqual` de los candados hermanos.** `toEqual`
   ignora un último elemento `undefined`, así que un hijo sin `testID` ni clase
   al final de la columna pasaría (sonda `loose` con `coltail`, verde). R1 y
   R2 usan `toStrictEqual`, y lo dicen en su comentario.
3. **Un quinto estado.** Además de los cuatro de #131 (sin medir, medido,
   segunda métrica, día seleccionado), R1 y R2 seleccionan el día `missing`:
   es el único estado que pinta la columna `missing` seleccionada, y el que ve
   `dotselmissing` y `dashcolorsel`.
4. **R2 fija clases enteras.** Cada `className` se compara con la cadena
   completa. El coste: cualquier cambio legítimo de la receta de la etiqueta,
   del valor o de la raya obliga a tocar el candado a sabiendas.
5. **Las mutaciones versionadas**: `colswap` (R1) y `labelcolor` (R2), con los
   mismos blobs que cita la entrada (`6214543c` y `f58f4903`). Cada verde la
   revierte con `git checkout HEAD~1 --`. La historia toca la gráfica en cuatro
   commits, pero el diff acumulado es vacío (R3.2).
6. **El delta es +0 suites y +2 tests**: 86 / 1619 antes y 86 / 1621 después,
   sobre la base **relatada por el `leader`** y no medida por el spec_author.
   Codex la mide al arrancar, y el delta se exige sobre lo medido.
7. **R1 y R2 cierran de paso un hueco de #130 R2 y #131 R3**: un hijo host de
   más al final de la fila (`rowtail`) hoy pasa, y tras esta feature da rojo 2.
   No se tocan esos `describe`.
8. **Dos hallazgos (F) quedan abiertos**, y el humano decide si se registran
   como entrada nueva:
   - `valuecross`: la séptima columna con el valor de la primera da verde hoy,
     tras esta feature y en las 6 suites. Es la decisión 1 de la carta cruzada
     entre dos columnas;
   - `cardtail`: un `<View />` al final de la tarjeta da verde hoy y tras esta
     feature, porque `#135 R4` usa `toEqual`. Es el mismo hueco del punto 2, en
     la tarjeta.
9. **Huecos (D) declarados**: otras props de la etiqueta (`labellines`), la
   tercera métrica (`valuecolorwalks`), la comparación (`valuecolortrend`), una
   semana sin ningún día `missing` (`labelcolornomissing`), el idioma, el tema
   y la plataforma.
10. **Sin gate de dispositivo.** El árbol de producción acaba idéntico al de
    `origin/main`: en un dispositivo no hay nada nuevo que ver ni que oír. El
    único gate humano es la casilla de §Aprobación.
11. **Requisito sin test propio**: R3, que es una propiedad del diff y de la
    suite. Lo cierra el `reviewer` por inspección, y queda declarado aquí antes
    del handoff, como pide C4.

## Cobertura de los criterios de aceptación

| Criterio (`feature_list.json` #140) | Cubierto por |
|---|---|
| 1. Con la etiqueta debajo del valor (`colswap`), un `it` falla por aserción | R1 (sonda `colswap`, que es su rojo); tras esta feature también R2 |
| 2. Con la etiqueta en `text-foreground` (`labelcolor`) o el valor en `text-muted` (`valuecolor`), un `it` falla por aserción | R2 (sondas `labelcolor`, que es su rojo, y `valuecolor`), con los esperados como literales del test |
| 3. Los `describe` de #68, #74, #130, #131, #132 y #135 siguen verdes y sin cambios | R3.3 |
| 4. Cero cambio en producción; suite verde medida sin pipe; delta declarado | R3.1 y R3.2 |

## Fuera de alcance

Cada viñeta está clasificada: **(D)** delimitación de esta feature,
**(F)** hallazgo candidato a registrarse como otra feature (sin id: lo asigna
el `leader` contra `origin/main`) y **(N)** premisa verificada y descartada.

- **(D)** *R1 y R2 no varían la tercera métrica, la comparación, una semana sin
  ningún día `missing`, el idioma, el tema ni la plataforma.* Las tres clases
  son literales y el orden no depende de nada: una mutación que dependa de uno
  de esos estados pasa (sondas `valuecolorwalks`, `valuecolortrend` y
  `labelcolornomissing`, verdes); hacerla es cambiar la gráfica a propósito, no
  un descuido que R1 y R2 deban prever.
- **(D)** *R2 fija el `className`, no el resto de props de los textos.* Un
  `numberOfLines={1}` en la etiqueta pasa (sonda `labellines`, `7c5dc4f6`).
  El `style` del valor ya lo cierra `#62 R15` (ver (N)).
- **(D)** *No se asevera el texto de la etiqueta, del valor ni de la raya.* Lo
  hacen `#68 R3`, `#68 R5` y `#68 R6`; esta feature cierra dónde va cada texto
  y con qué receta, no qué dice.
- **(D)** La observación 1 de `progress/review_mobile-weekly-day-row-layout-lock.md`
  (sondas `z_selnoflexfirst` y `z_detailwraptrend`) no es de #140, por encargo
  del `leader`: habla de la clase de la columna y de los hijos de la tarjeta.
- **(D)** No se toca ningún `describe` de #68, #74, #130, #131, #132 ni #135, ni
  sus helpers, ni se añade copy: no se tocan `src/i18n/catalog.ts`,
  `src/providers/__tests__/language-provider.test.tsx` ni
  `src/__tests__/ui-copy-table.ts`. No se instala nada.
- **(F)** *El valor de una columna puede ser el de otra sin un rojo.* Con
  `metricValue(dataIndex === 6 ? days[0] : day, selectedMetric)` (sonda
  `valuecross`, blob `9f3c5bfd`), la séptima columna enseña el valor del
  primer día y todo sigue verde: hoy, tras esta feature y en las 6 suites
  (384/384). Es la decisión 1 de la carta («el dato que muestra — el más
  olvidado») cruzada entre dos columnas. No es de #140, que pide orden y
  receta, no dato.
- **(F)** *La lista cerrada de hijos de la tarjeta (`#135 R4`) no ve un hijo de
  más al final.* Con `      <View />` justo encima de `    </Card>` (sonda
  `cardtail`, blob `0ac97f35`), verde hoy, tras esta feature y en las 6 suites
  (384/384). `#135 R4` compara con `toEqual`, que ignora el `undefined` final.
  El remedio sería el de este ciclo, `toStrictEqual`, en un `describe` firmado
  de otra feature.
- **(N)** *Que la etiqueta pueda pasar a `View`.* React Native lanza
  `Invariant Violation: Text strings must be rendered within a <Text> component`
  al pintar el texto del día dentro de un `View`: 45 rojos hoy (sonda
  `labeltag`).
- **(N)** *Que las cifras tabulares del valor queden sin candado.* Un
  `style={TABULAR_NUMS}` en el valor pone rojo `#62 R15: todo contador usa cifras tabulares › screens/home/weekly-activity-chart.tsx aplica TABULAR_NUMS a sus 4 valores`,
  por `toHaveLength` (sonda `valuetabular`). Quitárselo a otro de los cuatro
  también lo ve ese recuento.
- **(N)** *Que la etiqueta pueda decir otro día o la raya otro carácter.* Los
  cierran `#68 R3` (sonda `labelcross`) y `#68 R5` (sonda `dashtext`).
- **(N)** *Que la etiqueta pueda desaparecer.* `#68 R3` ya da rojo **por
  consulta** (`Unable to find an element with testID: weekly-activity-day-label`,
  sonda `nolabel`); tras esta feature, también R1 y R2 por aserción.

---

## Aprobación

- [ ] **Aprobado por humano** (fecha: ____) ← gate obligatorio antes de
      implementar. Al marcar esta casilla, el humano firma también los once
      puntos de §Qué firma el humano al aprobar esta spec, y en particular el
      octavo (registrar o no como entrada nueva `valuecross` y `cardtail`).

> **Esta feature tiene una sola casilla**: esta. No hay gate de dispositivo
> (§Qué firma el humano, punto 10).

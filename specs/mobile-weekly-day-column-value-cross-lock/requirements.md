---
feature: "mobile-weekly-day-column-value-cross-lock"
status: approved         # draft | spec_ready | approved
tags: [spec, mobile, test, deuda]
---

# Requisitos — [[mobile-weekly-day-column-value-cross-lock]] (#141, #142 y #143)

> Notación EARS. Cada requisito lleva su id `R<n>`, inmutable una vez aprobado.
> Ver [[design]] para las decisiones y las alternativas descartadas, [[tasks]]
> para el orden TDD, el código exacto, los blobs y las sondas, y
> [[traceability]] para el cierre.
>
> **Tres entradas, un ciclo.** El humano decidió el 2026-09-30 especificar #141,
> #142 y #143 juntas: las tres son solo test, tocan el mismo fichero
> (`mobile-pet-tracker/src/screens/home/weekly-activity-chart.test.tsx`), añaden
> sus bloques al final de ese mismo fichero y se prueban con las mismas acciones
> sobre la gráfica. Esta es la spec de verdad de las tres. #142 y #143 tienen un
> puntero en `specs/mobile-weekly-card-children-strict-lock/requirements.md` y
> `specs/mobile-weekly-day-selected-first-metric-lock/requirements.md`, como
> #135 en el ciclo de #131.
>
> | Entrada | Origen | Requisitos que le pertenecen |
> |---|---|---|
> | **#141** `mobile-weekly-day-column-value-cross-lock` | hallazgo (F) `valuecross` de la spec de #140 | **R1** |
> | **#142** `mobile-weekly-card-children-strict-lock` | hallazgo (F) `cardtail` de la spec de #140 | **R2** |
> | **#143** `mobile-weekly-day-selected-first-metric-lock` | observación 1 de `progress/review_mobile-weekly-day-column-content-lock.md` (`z_labelselfirstmetric`) | **R3** |
> | las tres | — | **R4** (cierre medido) |
>
> **Base medida: `95a46292`**, en la branch
> `feature/141-mobile-weekly-day-column-value-cross-lock`: es `origin/main`
> (`4d536a43`, el merge de la PR #180 de #140) más el commit que registra #143,
> que no toca `mobile-pet-tracker/`. Medido el 2026-09-30. **Los números de
> línea no son anclas**, ni los de esta spec ni los de las entradas de
> `feature_list.json`: todo se localiza con los `grep` o los títulos literales
> que se citan, y las cuentas se vuelven a medir al arrancar ([[tasks]]
> §Antes de tocar nada).
>
> Los títulos y los comentarios nuevos llevan el prefijo `#141 R1`, `#142 R2` o
> `#143 R3`, como pide `docs/conventions.md` §Prefijo de feature. Nunca un id
> suelto: un `#` seguido de tres dígitos y de otra cosa que no sea ` R<n>` lo
> lee `#68 R18` como un color hex (sonda `hexbare`, medida).

## Contexto mínimo para implementar sin más contexto

La feature toca **un fichero**,
`mobile-pet-tracker/src/screens/home/weekly-activity-chart.test.tsx` («el
test», 55 tests hoy). El fichero de producción
`mobile-pet-tracker/src/screens/home/weekly-activity-chart.tsx` («la gráfica»)
**solo se toca en los tres commits rojos**, para versionar una mutación que el
commit verde siguiente revierte. El diff acumulado de la gráfica contra
`origin/main` es **vacío**.

Lo que pinta la tarjeta, en host (lo que ven las consultas de RNTL v14):

```
Card testID="weekly-activity-card"
├─ View testID="weekly-activity-header"
├─ si hay algún día medido (hasMeasuredDay):
│  ├─ View testID="weekly-activity-metric"          (el selector de métrica)
│  ├─ View testID="weekly-activity-trend"           solo si weekComparison[selectedMetric] !== null
│  ├─ View testID="weekly-activity-chart-layout"
│  ├─ View testID="weekly-activity-day-row"         (las siete columnas)
│  └─ View testID="weekly-activity-detail"          solo con un día seleccionado
└─ si no: Text testID="weekly-activity-empty"
```

Cada columna de la fila:

```
Pressable testID="weekly-activity-day-<fecha>"
   className: 'min-h-11 flex-1 items-center justify-end'                                  (en reposo)
              'min-h-11 flex-1 items-center justify-end border-t-2 border-accent-strong' (seleccionada)
├─ Text testID="weekly-activity-day-label"  className="text-2xs font-semibold text-muted"
│    texto: weekdayLabel(day.date, locale, 'short'), p. ej. «mié»
└─ según day.source:
   'missing': Text testID="weekly-activity-missing-<fecha>"  className="text-2xs font-normal text-muted"      texto «—»
   si no:     Text testID="weekly-activity-value-<fecha>"    className="text-2xs font-semibold text-foreground"
                texto: formatMetricValue(selectedMetric, metricValue(day, selectedMetric))
```

Tres hechos de la gráfica que los bloques usan, medidos en la base:

- **La selección de día sobrevive al cambio de métrica.** Con un día
  seleccionado se puede pulsar otra métrica y el día sigue seleccionado, así
  que la rejilla entera «métrica × selección» (3 × 3) se alcanza en un solo
  render.
- **El texto de un `Text` host** es `.children.join('')`: sus hijos son
  cadenas. Si alguien anida otro `Text` dentro, ese hijo es un `TestInstance`
  y el `join` da `'[object Object]'`, que es un rojo limpio por aserción (sonda
  `valuenested`). No se usa `props.children`: con `toEqual`, el diff de un
  elemento React agota el heap de jest (observación 2 del reviewer de #140).
- **El `accessibilityState` de un segmento del selector** lleva también
  `busy`, `checked`, `disabled` y `expanded` a `undefined`. Por eso las
  **guardas** (lo que prueba que se alcanzó un estado) usan
  `toEqual({ selected: true })`, igual que los `describe` previos, y los
  **candados** usan `toStrictEqual`. Medido: una guarda con `toStrictEqual`
  falla en la base.

En el test ya existen, y los bloques nuevos los usan sin tocarlos:

- `renderChart(days, weekComparison = NO_COMPARISON, language = 'es')`, que
  mide la gráfica a 295;
- `renderChartWithProps(props, language = 'es', fireLayout = true)`, que con
  `fireLayout = false` deja la gráfica sin medir;
- `makeWeek(from, minutes)`: el día `i` tiene `activeMinutes = minutes[i]`,
  `distanceM = minutes[i] * 100` y `walkCount = i`; un `null` da un día
  `missing`;
- `NO_COMPARISON`, y `fireEvent` y `within`, importados de
  `@testing-library/react-native`.

La semana de R1, R2.1 y R3 es `makeWeek('2026-09-02', [10, 20, 30, 40, 50, null, 70])`:
del miércoles `2026-09-02` al martes `2026-09-08`, con el sexto día
(`2026-09-07`, lunes) `missing`. Su valor es distinto en cada día y en cada
métrica. Al pulsar el día `missing`, el detalle dice «Sin datos de este día»,
copy que ya existe y que el test ya usa cuatro veces.

El último `describe` del test en la base es
`describe('#140 R2: la etiqueta, el valor y la raya de cada columna llevan su receta exacta'`.

## Premisas de las entradas, verificadas contra el árbol

Todas las medidas son del test de la gráfica con el comando canónico de
[[tasks]] §Antes de tocar nada, en un worktree de sondas desacoplado sobre
`95a46292`, salvo donde dice «6 suites»: el test de la gráfica más
`src/screens/home/index.test.tsx`, `src/__tests__/design-drift.test.ts`,
`src/__tests__/consistency-classnames.test.ts`,
`src/__tests__/legibility-classnames.test.ts` y
`src/__tests__/ui-language.test.ts`, que son 384 tests en la base.

| Premisa (`feature_list.json` #141, #142 y #143, y el encargo del `leader`) | Veredicto | Evidencia |
|---|---|---|
| #141: con la séptima columna enseñando el valor de la primera (`valuecross`, blob `9f3c5bfd`), todo sigue verde | **cierta, re-medida** | 6 suites, 384/384, con el mismo blob: la gráfica tiene el mismo blob de base (`c258abed`) que cuando se midió en la spec de #140 |
| #141: «el test consulta `weekly-activity-value-<fecha>` de tres fechas sueltas (grep da 2026-09-02, 2026-09-06 y 2026-09-07)» | **cambiada** | tras el merge de #140, `grep -o "weekly-activity-value-2026-09-0[0-9]"` da las siete fechas, pero `#140 R1` solo lee `testID`. Solo dos aserciones leen el **texto** de un valor, las dos en otro render: `R5: un día sin dato no es una barra de altura cero › separa el guion del día ausente y el valor cero medido` («0m» del `2026-09-07` en una semana de dos días) y `R6: el selector cambia de métrica sin volver a pedir nada › repinta distancia desde la opción pulsada con los mismos datos` («1.0 km» del `2026-09-02`, primera columna). `R5 › usa source aunque una métrica stored sea null` solo mira que el valor exista. Ninguna aserción lee el texto de la séptima columna de una semana |
| #141: «la spec debe medir qué columnas y qué métricas ve cada aserción existente» | **medido** | ver la fila anterior: ninguna ve una columna distinta de la primera en una semana completa, y solo `R6` ve una métrica que no es la primera. Por eso R1 lee **las siete** columnas en **las tres** métricas |
| #141: la semana debe tener un valor distinto por día | **cierta con `makeWeek`** | minutos 10 a 70 (con el sexto `missing`), kilómetros 1.0 a 7.0 y paseos 0 a 6: ningún par de columnas coincide en ninguna métrica |
| #142: con un `<View />` justo encima de `    </Card>` (`cardtail`, blob `0ac97f35`), todo sigue verde | **cierta, re-medida** | 6 suites, 384/384 |
| #142: «no se midió en qué ramas de la tarjeta aparece» | **medido** | sin comparación, con comparación y sin ningún día medido: `cardtail` pone un hijo de más al final en las tres. Con `toStrictEqual`, las tres ramas de R2 dan rojo (3 `it`) |
| #142: «ni si los hermanos `#130 R2` y `#131 R3` tienen el mismo hueco en otra parte» | **falsa: no lo tienen** | la fila la cierran ya `#140 R1` y `#140 R2` (sonda `rowtail`, rojo 2 hoy). Fuera de la gráfica, `grep -rn "children.map" --include=*.test.tsx src` solo da dos listas cerradas más, las dos en `src/screens/home/index.test.tsx`, y las dos ven un `<View />` de más al final: la fila de accesos rápidos (`h_tilerowtail`, rojo 3: `#71 R1` y dos de `#81 R6`) y el cuerpo de recordatorios (`h_reminderstail`, rojo 11: `#70 R9`, `#85 R5` y `#85 R9`). Ver §Fuera de alcance, (N) |
| #142: «la spec debe decidir entre editar `#135 R4` o añadir un hermano estricto» | **decidido: hermano** | R2 es un `describe` nuevo, `#142 R2`, y `#135 R4` no se toca ([[design]] D4) |
| #143: con `z_labelselfirstmetric` (blob `6eda3dd1`), todo sigue verde | **cierta, re-medida** | 6 suites, 384/384 |
| #143: «el valor, la raya y la columna en esa combinación no se probaron» | **cierta; medidos, y entran** | con la misma condición (`selection !== null && selectedMetricIndex === 0`), el valor en `text-muted` (`z_valueselfirstmetric`), la raya en `text-foreground` (`z_dashselfirstmetric`), la columna seleccionada sin su borde (`z_colselfirstmetric`) y un hijo de más en la columna seleccionada (`z_childselfirstmetric`) dan verde, en las 6 suites (384/384 cada una). Los cinco entran en R3 |
| #143: «`#140 R1` y `R2` solo seleccionan un día después de cambiar a `distanceM`» | **cierta** | es su estado 3 → 4 → 5. La combinación «día seleccionado × primera métrica» no la ejecuta ningún candado de clases |
| #143: «la spec decide si amplía `#140 R1` y `R2` o añade un `describe` nuevo» | **decidido: `describe` nuevo** | R3 es `#143 R3`, y `#140 R1` y `#140 R2` no se tocan ([[design]] D5) |
| Las tres mutaciones rojas solo ponen rojo el test de la gráfica | **cierta, medida** | cada una sobre su etapa (el test con los bloques hasta su R), en las 6 suites: `P1red` 1 failed de 385, solo `#141 R1`; `P2red` 3 failed de 388, solo los tres de `#142 R2`; `P3red` 1 failed de 389, solo `#143 R3` |
| El `#` en los títulos y comentarios nuevos no dispara los guards de hex | **cierta con ` R<n>` detrás, medida** | con `// #141: the text…` en vez de `// #141 R1: the text…` (test `e80d30ba`), `design-drift.test.ts` da 1 failed de 55: `#68 R18: la actividad semanal no mete drift de estilo › keeps arbitrary text, hex colors, and StyleSheet out of feature sources` |
| `files_affected` es solo el test | **cierta** | ningún requisito necesita otro fichero. La gráfica entra y sale en los rojos |
| Base del test | **medida sin pipe** | 55/55, `exit=0`, 25 `describe` de primer nivel |
| Suite de base | **relatada, no medida** | 86 suites / 1621 tests, `exit=0`: el `./init.sh` del `leader` sobre `047d319a` (`progress/review_mobile-weekly-day-column-content-lock.md` §Output de ./init.sh). `git diff --stat 047d319a 95a46292 -- mobile-pet-tracker/` es vacío. El spec_author no corrió la suite entera, por encargo. Codex la mide al arrancar ([[tasks]] §Antes de tocar nada, paso 6) |
| Blobs de base | **medidos** | la gráfica `c258abedde92d2be981be8507d3d898f13c612cb` y el test `2f3828f4c039e9f3794c739e831c6402e138d6a9`. Iguales en `95a46292` y en `origin/main` |
| El árbol final compila y pasa el lint | **medido** | con el test final (`3e0ff4a3ea2acdeac0efe0818fa617ebe72089a2`), `bunx tsc --noEmit` y `bunx eslint` de los dos ficheros, `exit=0` los dos |
| Nadie más toca estos ficheros | **verificado** | la branch de #60 (`feature/60-mobile-ios-support`, en el worktree principal) toca otros ficheros de `mobile-pet-tracker/`, pero ninguno de las 6 suites ni de esta feature |
| Entorno | **verificado** | `test ! -e .expo/types/router.d.ts` da `exit=0` en el worktree de la branch. No hay hooks de git ni configuración de prettier en `mobile-pet-tracker/` |

## Requisitos funcionales

- **R1** (#141): WHILE `WeeklyActivityChart` pinte la fila de columnas (al
  menos un día medido), THE SYSTEM SHALL mostrar en **cada una de las siete
  columnas**, por posición, **el texto de su propio día**: la etiqueta de su
  fecha y el valor de **su** día en la métrica seleccionada, o la raya «—» si
  el día es `missing`; antes de medir, y ya medida en las tres métricas, sin
  día seleccionado, con un día medido seleccionado y con el día `missing`
  seleccionado.

  `#141 R1: cada columna muestra el valor de su propio día › el texto de los dos hijos de cada columna, por posición, antes de medir y, ya medido, en las tres métricas sin día seleccionado, con un día medido y con el día sin datos`

  asevera con `toStrictEqual`, en cada uno de estos diez estados, la lista del
  texto de los hijos host de cada columna (siete pares) contra una de tres
  listas literales del test:

  | # | Estado | Guarda | Esperado |
  |---|---|---|---|
  | a1 | montada sin medir (`fireLayout = false`), primera métrica | ninguna | `minutes` |
  | a2 | medida a 295 | `weekly-activity-bar-chart` en pantalla | `minutes` |
  | a3 | `distanceM` | `accessibilityState` de `weekly-activity-metric-distanceM`, `toEqual({ selected: true })` | `kilometres` |
  | a4 | `walkCount` | lo mismo, de `weekly-activity-metric-walkCount` | `walks` |
  | a5 | `walkCount` con `2026-09-05` seleccionado | `weekly-activity-tooltip` en pantalla | `walks` |
  | a6 | `walkCount` con `2026-09-07` (`missing`) seleccionado | «Sin datos de este día» dentro de `weekly-activity-detail` | `walks` |
  | a7 | `distanceM` con `2026-09-07` | el de `distanceM` | `kilometres` |
  | a8 | `activeMinutes` con `2026-09-07` | el de `weekly-activity-metric-activeMinutes` | `minutes` |
  | a9 | `activeMinutes` con `2026-09-05` | `accessibilityState` de `weekly-activity-day-2026-09-05`, `toEqual({ selected: true })` | `minutes` |
  | a10 | `distanceM` con `2026-09-05` | el de `distanceM` | `kilometres` |

  Las tres listas, escritas en el test y no calculadas:

  | Columna | `minutes` | `kilometres` | `walks` |
  |---|---|---|---|
  | 1 (`2026-09-02`) | `['mié', '10m']` | `['mié', '1.0 km']` | `['mié', '0']` |
  | 2 | `['jue', '20m']` | `['jue', '2.0 km']` | `['jue', '1']` |
  | 3 | `['vie', '30m']` | `['vie', '3.0 km']` | `['vie', '2']` |
  | 4 (`2026-09-05`) | `['sáb', '40m']` | `['sáb', '4.0 km']` | `['sáb', '3']` |
  | 5 | `['dom', '50m']` | `['dom', '5.0 km']` | `['dom', '4']` |
  | 6 (`2026-09-07`, `missing`) | `['lun', '—']` | `['lun', '—']` | `['lun', '—']` |
  | 7 (`2026-09-08`) | `['mar', '1h 10m']` | `['mar', '7.0 km']` | `['mar', '6']` |

  Es la decisión 1 (el dato que muestra) de `docs/ui-guidelines.md`
  §Enmienda #70, cruzada entre columnas, en la rejilla completa 3 × 3 de
  métrica por selección más el estado sin medir.

  IF una columna enseña el valor de otro día, en cualquier columna, en
  cualquier métrica y con o sin día seleccionado, o el texto del valor deja de
  ser un texto plano (un `Text` anidado), THEN ese `it` SHALL fallar **por
  aserción** (`expect(received).toStrictEqual(expected)`). El rojo es una
  mutación de producción versionada (C4, vía **b**): la sonda `valuecross` de
  la entrada, la séptima columna con el valor de la primera. Con ella, el `it`
  de R1 SHALL ser el **único** rojo de la suite (1 failed de 1622 sobre la base
  relatada), en la aserción a1.

- **R2** (#142): WHILE `WeeklyActivityChart` esté montada, THE SYSTEM SHALL
  mantener **cerrada** la lista de hijos host de `weekly-activity-card`: sus
  `testID`, en este orden y **sin ningún otro nodo, tampoco al final**, en cada
  rama y estado:

  - sin comparación y sin día seleccionado: `header`, `metric`,
    `chart-layout`, `day-row`;
  - sin comparación y con un día seleccionado: los mismos y `detail`;
  - con comparación y sin día seleccionado: `header`, `metric`, `trend`,
    `chart-layout`, `day-row`;
  - con comparación y con un día seleccionado: los mismos y `detail`;
  - sin ningún día medido: `header` y `empty`;

  (todos con el prefijo `weekly-activity-`).

  `#142 R2: la lista de hijos de la tarjeta es cerrada, sin ningún nodo de más al final`
  tiene tres `it`, y todas sus aserciones de lista usan `toStrictEqual` contra
  listas literales del test:

  | `it` | Montaje | # | Estado | Guarda | Esperado |
  |---|---|---|---|---|---|
  | R2.1 `sin comparación: antes y después de medir, en las tres métricas y con un día seleccionado, medido o sin datos, también con la primera métrica` | la semana con el `missing`, `NO_COMPARISON`, sin medir | a1 | sin medir | ninguna | sin `detail` |
  | | | a2 | medida a 295 | `weekly-activity-bar-chart` | sin `detail` |
  | | | a3 | `distanceM` | su `accessibilityState` | sin `detail` |
  | | | a4 | `distanceM` con `2026-09-05` | `weekly-activity-tooltip` | con `detail` |
  | | | a5 | `activeMinutes` con `2026-09-05` | su `accessibilityState` | con `detail` |
  | | | a6 | `activeMinutes` con `2026-09-07` | «Sin datos de este día» | con `detail` |
  | | | a7 | `walkCount` con `2026-09-07` | su `accessibilityState` | con `detail` |
  | R2.2 `con comparación: la tendencia entre el selector y el gráfico, sin día seleccionado y con uno` | `makeWeek('2026-09-02', [10, 20, 30, 40, 50, 60, 70])`, `{ ...NO_COMPARISON, activeMinutes: 12.5 }`, medida | a1 | sin día | `weekly-activity-trend` | con `trend`, sin `detail` |
  | | | a2 | `2026-09-05` | `weekly-activity-tooltip` | con `trend` y `detail` |
  | R2.3 `sin ningún día medido: la cabecera y el mensaje, y nada más` | siete `null` | a1 | — | `weekly-activity-empty` | `header` y `empty` |

  Cubre las seis aserciones de `#135 R4` (sin comparación: sin medir, medida,
  `distanceM` y un día seleccionado; con comparación; vacía) y añade la primera
  y la tercera métrica con un día seleccionado, el día `missing` seleccionado y
  la comparación con un día seleccionado. Es la cardinalidad estructural de la
  tarjeta que pide la carta (§Enmienda #70), con identidad y orden de golpe.

  IF la tarjeta gana un hijo host de más, al final o en cualquier otro sitio,
  con o sin `testID`, en cualquiera de esas ramas y estados, THEN el `it` de esa
  rama SHALL fallar **por aserción** (`toStrictEqual`). El rojo es una mutación
  versionada (vía **b**): la sonda `cardtail` de la entrada, `      <View />`
  justo encima de `    </Card>`. Con ella, los **tres** `it` de R2 SHALL ser los
  **únicos** rojos de la suite (3 failed de 1625), cada uno en su aserción a1.

- **R3** (#143): WHILE `WeeklyActivityChart` esté medida con la **primera
  métrica** (`activeMinutes`, la que abre por defecto) y un día seleccionado,
  THE SYSTEM SHALL mantener, en **cada una de las siete columnas y por
  posición**:
  - el `className` de la columna: `'min-h-11 flex-1 items-center justify-end border-t-2 border-accent-strong'`
    en la seleccionada y `'min-h-11 flex-1 items-center justify-end'` en las
    demás;
  - exactamente dos hijos host, con su `testID` y su `className`: la etiqueta
    (`weekly-activity-day-label`, `'text-2xs font-semibold text-muted'`) y
    después el valor (`weekly-activity-value-<fecha>`,
    `'text-2xs font-semibold text-foreground'`) o, si el día es `missing`, la
    raya (`weekly-activity-missing-<fecha>`, `'text-2xs font-normal text-muted'`);

  con un día medido seleccionado y con el día `missing` seleccionado.

  `#143 R3: con la primera métrica y un día seleccionado, cada columna conserva su forma y sus recetas › la clase de cada columna y el testID y la clase de sus dos hijos, por posición, con un día medido seleccionado y con el día sin datos seleccionado`

  monta la semana con el `missing` con `renderChart` (medida, primera
  métrica) y asevera con `toStrictEqual`, en dos estados, la lista
  `[clase de la columna, [[testID, clase] de cada hijo]]` de las siete columnas
  contra una lista literal:

  | # | Estado | Guardas | Columna seleccionada |
  |---|---|---|---|
  | a1 | `2026-09-05` seleccionado | `accessibilityState` de `weekly-activity-metric-activeMinutes`, `toEqual({ selected: true })`, y `weekly-activity-tooltip` en pantalla | la cuarta |
  | a2 | `2026-09-07` (`missing`) seleccionado | «Sin datos de este día» dentro de `weekly-activity-detail` | la sexta |

  Son las decisiones 7 (receta de cada texto), 10 (forma en todas las ramas),
  11 (envoltorio) y 12 (orden) de la carta, más la cardinalidad, en la
  combinación que `#140 R1` y `#140 R2` no ejecutan.

  IF la etiqueta, el valor o la raya cambian de clase, la columna seleccionada
  pierde su borde, o una columna gana un hijo host, **solo** cuando hay un día
  seleccionado con la primera métrica, THEN ese `it` SHALL fallar **por
  aserción** (`toStrictEqual`). El rojo es una mutación versionada (vía
  **b**): la sonda `z_labelselfirstmetric` del reviewer de #140, con su blob
  `6eda3dd1`. Con ella, el `it` de R3 SHALL ser el **único** rojo de la suite
  (1 failed de 1626), en la aserción a1.

- **R4** (las tres): THE SYSTEM SHALL cerrar con:

  1. **El delta declarado**: +0 suites y +5 tests (R1 uno, R2 tres, R3 uno).
     El test pasa de 55 a 60, y la suite, de 86 / 1621 a 86 / 1626, medida sin
     pipe. Si la base medida al arrancar es otra, el delta exigido sigue siendo
     +5 tests y +0 suites sobre lo medido.
  2. **Diff de producción vacío**:
     `git diff --exit-code origin/main...HEAD -- mobile-pet-tracker/src/screens/home/weekly-activity-chart.tsx`
     da 0, y la gráfica acaba en su blob de base.
  3. **Ningún `describe` previo editado** (#68, #74, #130, #131, #132, #135 ni
     #140), y todos verdes: el test de la base es un prefijo exacto del final,
     y su diff contra `origin/main` son 350 líneas añadidas y 0 borradas. En
     particular, `#135 R4` sigue con `toEqual` y `#140 R1` y `#140 R2` con sus
     cinco estados.
  4. **Ninguna cifra de candado se mueve** y el grep-clean de la carta sigue
     en 0, con los `grep` de [[tasks]] §R4.
  5. `bunx tsc --noEmit` con `exit=0` tras `test ! -e .expo/types/router.d.ts`,
     y `bunx eslint` de los dos ficheros con `exit=0`.
  6. **Ninguna dependencia nueva** ni copy nueva.
  7. La tabla de [[tasks]] §Sondas, re-medida sobre el árbol final, en
     `progress/impl_mobile-weekly-day-column-value-cross-lock.md`.

  No tiene test propio: es una propiedad del diff y de la suite. Lo cierra el
  `reviewer` por inspección.

## Decisiones por elemento

Por `docs/ui-guidelines.md` §Enmienda #70, contando por hijos host y no por
`testID`. «Hoy» es quién lo cierra en la base (tras #140); «tras este ciclo»,
quién lo cierra al acabar.

**La columna** (el elemento repetido, siete veces). Solo las filas que este
ciclo cambia; el resto las fija la tabla de la spec de #140 y no se mueven.

| Decisión | Hoy | Tras este ciclo |
|---|---|---|
| 1. dato: el valor es el de su día | **nadie** para un cruce entre columnas (`valuecross`, verde en las 6 suites) | **R1**, en las siete columnas y en los diez estados |
| 1. dato: la etiqueta dice el día de su fecha | `#68 R3` (`labelcross`, rojo 1) | `#68 R3` y **R1** (`labelcross`, rojo 2) |
| 3. etiqueta visible: la raya dice «—» | `#68 R5`, en otro render (`dashtext`, rojo 1) | `#68 R5` y **R1** (`dashtext`, rojo 2) |
| 7. receta de la etiqueta, el valor y la raya con un día seleccionado y la primera métrica | **nadie** (`z_labelselfirstmetric`, `z_valueselfirstmetric`, `z_dashselfirstmetric`, verdes en las 6 suites) | **R3** |
| 7. … con un día seleccionado y la tercera métrica | **nadie** (`z_labelselwalks`) | **nadie: (D)** |
| clase de la columna seleccionada con la primera métrica (borde) | **nadie** (`z_colselfirstmetric`) | **R3** |
| 9. condición de render (valor o raya según `source`) | `#68 R5` y `#140 R1` | también **R1** (el texto) y **R3** |
| 10. forma en todas sus ramas, con la primera métrica y un día seleccionado | **nadie** | **R3**, con el día medido y con el `missing` seleccionados |
| 11. envoltorio: un `Text` anidado dentro del valor | **nadie** (`valuenested`) | **R1** (`'[object Object]'`) |
| 12. orden y cardinalidad con la primera métrica y un día seleccionado | **nadie** (`z_childselfirstmetric`) | **R3**, y también **R1** (a8) |

Las decisiones 2, 4, 5, 6 y 8 no cambian: la columna no tiene icono ni fondo
propio en sus textos, su nombre accesible lo cierra `#68 R9`, y sus hijos no
navegan.

**La tarjeta** (una lista cerrada de hijos, no un elemento repetido).

| Decisión | Hoy | Tras este ciclo |
|---|---|---|
| identidad y orden de sus hijos | `#135 R4`, en seis estados | `#135 R4` y **R2**, en diez |
| cardinalidad: ningún hijo de más al final | **nadie** (`cardtail`: `#135 R4` usa `toEqual`) | **R2**, con `toStrictEqual`, en las tres ramas |
| … solo con un día seleccionado / solo con la primera métrica y un día / solo con la tercera | **nadie** (`cardtailsel`, `cardtailfirstsel`, `cardtailwalks`) | **R2** (a4, a5, a7 de R2.1) |
| … solo con comparación / solo en una semana sin `missing` / solo vacía | **nadie** (`cardtailtrend`, `cardtailnomissing`, `cardtailempty`) | **R2** (R2.2 y R2.3) |
| … solo en inglés | **nadie** (`cardtailen`) | **nadie: (D)** |

## Zona ciega: qué estado ve cada requisito

Las entradas de estado de la gráfica, y en cuáles asevera cada requisito. Una
casilla «no» es un hueco declarado, con su sonda cuando la hay. Los estados que
ya cubren `#140 R1` y `#140 R2` se citan como tales.

| Entrada de estado | R1 | R2 | R3 |
|---|---|---|---|
| sin medir (`chartWidth` 0) | a1 | R2.1 a1 (y `cardtailunmeasured`) | no, (D); lo ven `#140 R1` y `R2` |
| medida, primera métrica, sin día | a2 | R2.1 a2, R2.2 a1 | no; lo ven `#140 R1` y `R2` |
| primera métrica, día medido | a9 | R2.1 a5 | **a1** |
| primera métrica, día `missing` | a8 | R2.1 a6 | **a2** (`z_labelselmissingfirst`) |
| segunda métrica, sin día | a3 | R2.1 a3 (`cardtaildist`) | no; `#140` a3 |
| segunda métrica, día medido | a10 | R2.1 a4 | no; `#140` a4 |
| segunda métrica, día `missing` | a7 | no, (D) | no; `#140` a5 |
| tercera métrica, sin día | a4 (`valuecrossmid`) | no, (D) | no, (D) |
| tercera métrica, día medido | a5 | no, (D) | **no** (`z_labelselwalks`, (D)) |
| tercera métrica, día `missing` | a6 | R2.1 a7 (`cardtailwalks`) | no, (D) |
| con comparación | **no** (`valuecrosstrend`, (D)) | R2.2 (`cardtailtrend`) | no, (D) |
| una semana sin ningún día `missing` | **no** (`valuecrossnomissing`, (D)) | R2.2 (`cardtailnomissing`) | no, (D) |
| ningún día medido | no hay fila | R2.3 (`cardtailempty`) | no hay fila |
| idioma, tema, plataforma | no, (D) | **no** (`cardtailen`, (D)) | no, (D) |

Las sondas de zona ciega **propias** de esta spec prueban que cada estado que sí
se recorre cuenta:

- R1: `valuecrossmid` (solo con `walkCount` y solo la segunda columna) cae en
  a4; `valuecrosssel` (solo la columna seleccionada) en a5; `valuecrossdistsel`
  (solo con `distanceM` y un día) en a7; `valuecrossfirstsel` (solo con la
  primera métrica y un día) en a8; `valuenested` (el valor dentro de otro
  `Text`) en a1;
- R2: `cardtaildist` (solo con `distanceM`) cae en R2.1 a3; `cardtailsel` en
  R2.1 a4 y R2.2 a2; `cardtailfirstsel` en R2.1 a5 y R2.2 a2; `cardtailwalks`
  en R2.1 a7; `cardtailunmeasured` (solo sin medir) en R2.1 a1 y R2.3 a1;
  `cardtailtrend` y `cardtailnomissing` en R2.2 a1; `cardtailempty` en R2.3 a1;
- R3: `z_valueselfirstmetric`, `z_dashselfirstmetric`, `z_colselfirstmetric` y
  `z_childselfirstmetric` caen en a1; `z_labelselmissingfirst` (solo con el día
  `missing` seleccionado) cae en a2, y solo ahí.

## Tabla de sondas, resumen

Las sondas, con el blob exacto de cada mutación y el `it` que falla, están en
[[tasks]] §Sondas. «Hoy» es la mutación sobre la base (el test en 55), y «tras
este ciclo», sobre el árbol final (60). Todas las rojas lo son **por aserción**,
por `toStrictEqual` salvo donde se dice.

| Clase | Sondas | Hoy | Tras este ciclo |
|---|---|---|---|
| El valor de una columna es el de otra | `valuecross` | verde (6 suites) | **rojo 1**: R1, a1 |
| … solo en un estado (métrica, selección) | `valuecrossmid`, `valuecrosssel`, `valuecrossdistsel`, `valuecrossfirstsel` | verde | **rojo 1**: R1, a4 / a5 / a7 / a8 |
| … solo con comparación o en una semana sin `missing` | `valuecrosstrend`, `valuecrossnomissing` | verde | **verde** (6 suites): (D) |
| El valor dentro de otro `Text` | `valuenested` | verde | **rojo 1**: R1, a1 |
| La etiqueta dice otro día | `labelcross` | rojo 1: `#68 R3`, por `toEqual` | **rojo 2**: ese y R1 |
| La raya dice otro carácter | `dashtext` | rojo 1: `#68 R5`, por `toHaveTextContent` | **rojo 2**: ese y R1 |
| Un hijo de más al final de la tarjeta | `cardtail` | verde (6 suites) | **rojo 3**: los tres de R2, a1 |
| … solo en un estado o una rama | `cardtaildist`, `cardtailsel`, `cardtailfirstsel`, `cardtailwalks`, `cardtailunmeasured`, `cardtailtrend`, `cardtailnomissing`, `cardtailempty` | verde | **rojo 1 o 2**: R2, en su aserción |
| … solo en inglés | `cardtailen` | verde | **verde** (6 suites): (D) |
| Un hijo de más al final de la fila | `rowtail` | rojo 2: `#140 R1` y `#140 R2` | **rojo 4**: esos, R1 y R3 |
| Con la primera métrica y un día: la etiqueta cambia de color | `z_labelselfirstmetric` | verde (6 suites) | **rojo 1**: R3, a1 |
| … el valor, la raya, el borde de la columna | `z_valueselfirstmetric`, `z_dashselfirstmetric`, `z_colselfirstmetric` | verde (6 suites) | **rojo 1**: R3, a1 |
| … un hijo de más en la columna seleccionada | `z_childselfirstmetric` | verde (6 suites) | **rojo 2**: R1 (a8) y R3 (a1) |
| … solo con el día `missing` seleccionado | `z_labelselmissingfirst` | verde | **rojo 1**: R3, a2 |
| Con la tercera métrica y un día: la etiqueta cambia de color | `z_labelselwalks` | verde | **verde** (6 suites): (D) |
| R2 con `toEqual` | `loose` (en el test), sola y con `cardtail` | no aplica | **verde** / **verde**: por eso R2 usa `toStrictEqual` |
| `#141` suelto en un comentario | `hexbare` (en el test) | no aplica | `design-drift.test.ts`: rojo 1 de 55, `#68 R18` |

## Qué firma el humano al aprobar esta spec

1. **Un ciclo y tres entradas.** R1 es de #141, R2 de #142, R3 de #143, y R4
   de las tres. Solo #141 pasa a `in_progress` (`init.sh` aborta con más de una:
   `grep -n 'fail "Más de 1 feature en in_progress' init.sh`). #142 y #143 se
   quedan en `spec_ready` con un puntero y pasan a `done` con el mismo
   veredicto. Una sola branch, un solo handoff, una sola revisión.
2. **#142 es un hermano estricto, no una enmienda a `#135 R4`.** `#135 R4` es
   un `describe` firmado de otra feature y sigue igual, con `toEqual`. R2 repite
   sus seis aserciones con `toStrictEqual` y añade cuatro estados. El coste es
   esa duplicación: si un día cambian los hijos legítimos de la tarjeta, hay
   que tocar los dos `describe` a sabiendas.
3. **#143 es un `describe` nuevo, no dos estados más en `#140 R1` y `R2`.**
   Esos dos `describe` no se tocan. R3 cubre la primera métrica con un día
   seleccionado, que es la combinación de la entrada. **La tercera métrica con
   un día seleccionado sigue sin candado de clases** (`z_labelselwalks`, verde
   en las 6 suites): queda como (D). Si el humano la quiere cerrada, es otra
   entrada o una enmienda a esta spec antes de firmar.
4. **R1 lee el texto de los dos hijos, no solo el del valor.** Así una
   aserción ve de golpe el valor, la etiqueta y la raya de cada columna, y se
   solapa a sabiendas con `#68 R3` y `#68 R5`: `labelcross` y `dashtext` pasan
   de rojo 1 a rojo 2. Recorre la rejilla completa de tres métricas por tres
   selecciones, más el estado sin medir: diez aserciones en un `it`.
5. **Guardas con `toEqual`, candados con `toStrictEqual`.** El
   `accessibilityState` de los segmentos lleva claves a `undefined`, así que una
   guarda estricta falla en la base (medido). Los candados son estrictos porque
   `toEqual` ignora un `undefined` al final de un array (sonda `loose` con
   `cardtail`, verde).
6. **Las mutaciones versionadas**: `valuecross` (R1, blob `9f3c5bfd`, el de
   la entrada), `cardtail` (R2, `0ac97f35`, el de la entrada) y
   `z_labelselfirstmetric` (R3, `6eda3dd1`, el del reviewer de #140). Cada verde
   la revierte con `git checkout HEAD~1 --`. La historia toca la gráfica en seis
   commits, pero el diff acumulado es vacío (R4.2).
7. **El rojo de R2 son tres `it` a la vez**: `cardtail` pone un hijo de más en
   las tres ramas de la tarjeta, y cada rama tiene su `it`. Siguen siendo los
   únicos rojos de su etapa.
8. **El delta es +0 suites y +5 tests**: 86 / 1621 antes y 86 / 1626
   después, sobre la base **relatada** (el `./init.sh` del `leader` en la
   revisión de #140) y no medida por el spec_author. Codex la mide al arrancar,
   y el delta se exige sobre lo medido.
9. **Una premisa de #141 cambió**: tras el merge de #140 el `grep` del valor
   da las siete fechas, no tres, pero solo por `testID`. Ninguna aserción leía
   el texto de la séptima columna de una semana.
10. **Huecos (D) declarados**: R1 sin comparación ni semana sin `missing`
    (`valuecrosstrend`, `valuecrossnomissing`); R2 en inglés (`cardtailen`) y
    en tres combinaciones de métrica y selección; R3 con la tercera métrica
    (`z_labelselwalks`), sin medir, con comparación y sin `missing`; el idioma,
    el tema y la plataforma en los tres.
11. **Sin gate de dispositivo.** El árbol de producción acaba idéntico al de
    `origin/main`: en un dispositivo no hay nada nuevo que ver ni que oír. No
    hay dimensiones de pantalla ni componentes compartidos que fijar, porque no
    cambia la UI. El único gate humano es la casilla de §Aprobación.
12. **Requisito sin test propio**: R4, que es una propiedad del diff y de la
    suite. Lo cierra el `reviewer` por inspección, y queda declarado aquí antes
    del handoff, como pide C4.

## Cobertura de los criterios de aceptación

| Criterio (`feature_list.json`) | Cubierto por |
|---|---|
| #141.1 Con la séptima columna mostrando el valor del primer día (`valuecross`), un `it` falla por aserción | R1 (sonda `valuecross`, que es su rojo) |
| #141.2 El texto esperado de cada columna es un literal del test, no el resultado de `formatMetricValue` ni de `metricValue` | R1: las tres listas `minutes`, `kilometres` y `walks` están escritas en el bloque ([[design]] D3) |
| #141.3 Los `describe` de #68, #74, #130, #131, #132, #135 y #140 siguen verdes y sin cambios | R4.3 |
| #141.4 Cero cambio en producción; suite verde medida sin pipe; delta declarado | R4.1 y R4.2 |
| #142.1 Con un `<View />` de más al final de la tarjeta (`cardtail`), un `it` falla por aserción | R2 (sonda `cardtail`, que es su rojo: los tres `it`) |
| #142.2 La lista cerrada de hijos de la tarjeta se compara con `toStrictEqual` en todas las ramas que hoy cubre `#135 R4` | R2: sus tres `it` cubren las seis aserciones de `#135 R4`, y todas sus aserciones de lista son `toStrictEqual` |
| #142.3 Los `describe` de #68, #74, #130, #131, #132 y #140 siguen verdes; cualquier cambio en `#135 R4` está declarado | R4.3: `#135 R4` no cambia (§Qué firma el humano, punto 2) |
| #142.4 Cero cambio en producción; suite verde medida sin pipe; delta declarado | R4.1 y R4.2 |
| #143.1 Con `z_labelselfirstmetric` (blob `6eda3dd1`) plantada, un `it` falla por aserción | R3 (sonda `z_labelselfirstmetric`, que es su rojo) |
| #143.2 Los esperados son literales del test, nunca importados de producción | R3: las cinco clases y los `testID` están escritos en el bloque |
| #143.3 Los `describe` previos siguen verdes; cualquier cambio en ellos está declarado | R4.3: ninguno cambia (§Qué firma el humano, punto 3) |
| #143.4 Cero cambio en producción; suite verde medida sin pipe; delta declarado | R4.1 y R4.2 |

## Fuera de alcance

Cada viñeta está clasificada: **(D)** delimitación de este ciclo, **(F)**
hallazgo candidato a registrarse como otra feature (sin id: lo asigna el
`leader` contra `origin/main`) y **(N)** premisa verificada y descartada.

- **(D)** *R1 no varía la comparación, una semana sin ningún día `missing`, el
  idioma, el tema ni la plataforma.* Un cruce de valores que dependa de uno de
  esos estados pasa (sondas `valuecrosstrend` y `valuecrossnomissing`, verdes
  en las 6 suites); hacerlo es cambiar la gráfica a propósito, no un descuido
  que R1 deba prever. El idioma cambia el formato de los valores, y cerrarlo
  pediría otra tabla de literales.
- **(D)** *R1 lee el texto visible de la columna, no su nombre accesible, ni
  los valores del tooltip ni del detalle.* No se midió ningún cruce en
  `dayAccessibilityLabel`, en `weekly-activity-tooltip` ni en
  `weekly-activity-detail`: son otros nodos, fuera de la columna.
- **(D)** *R2 no varía el idioma, el tema ni la plataforma*, ni recorre
  `distanceM` con el día `missing` ni `walkCount` sin día o con un día medido.
  Un hijo de más que dependa del idioma pasa (sonda `cardtailen`, verde en las
  6 suites).
- **(D)** *R3 cubre la primera métrica, no la tercera.* Con un día seleccionado
  y `walkCount`, una etiqueta en `text-foreground` pasa (sonda
  `z_labelselwalks`, verde en las 6 suites). La segunda métrica con un día la
  cubren `#140 R1` y `#140 R2`. R3 tampoco recorre el estado sin medir, la
  comparación ni una semana sin `missing`.
- **(D)** *R3 fija el `testID` y la clase de cada hijo, no el resto de sus
  props* (como `#140 R2`). Un `style` o un `numberOfLines` nuevos en la etiqueta,
  el valor o la raya no los ve R3; el recuento de `style={TABULAR_NUMS}` de la
  gráfica sigue cerrado por `#62 R15` (4, sin cambio en R4).
- **(D)** *El nieto dentro de la etiqueta* (observación 2 del reviewer de #140,
  `z_labelnested`, blob `93f3e415`). R1 lo ve por aserción: medido con
  `-t "#14[13] R"`, 1 failed, `#141 R1`, a1. Pero la corrida entera de la
  gráfica sigue sin dar un rojo limpio, porque
  `#68 R3` (`R3: la letra del eje sale de la fecha, no del índice`) compara
  `props.children` con `toEqual` y jest agota el heap al formatear el diff. No
  se toca ese `describe`.
- **(D)** No se toca ningún `describe` de #68, #74, #130, #131, #132, #135 ni
  #140, ni sus helpers, ni se añade copy: no se tocan `src/i18n/catalog.ts`,
  `src/providers/__tests__/language-provider.test.tsx` ni
  `src/__tests__/ui-copy-table.ts`. No se instala nada.
- **(N)** *Que `#130 R2` y `#131 R3` tengan el hueco de `#135 R4` en la fila.*
  Lo cierran `#140 R1` y `#140 R2`: un `<View />` al final de la fila
  (`rowtail`) da rojo 2 hoy, y rojo 4 tras este ciclo.
- **(N)** *Que otra lista cerrada de hijos tenga el mismo hueco fuera de la
  gráfica.* `grep -rn "children.map" --include=*.test.tsx src` fuera del test
  de la gráfica solo da dos, en `src/screens/home/index.test.tsx`, y las dos
  ven un hijo de más al final: la fila de accesos rápidos (sonda
  `h_tilerowtail`, `              <View />` tras el cierre del
  `QUICK_ACTIONS.map` dentro de `quick-actions-row`, blob `e63d7fdf`: rojo 3,
  `#71 R1: la Home dibuja la rejilla de accesos rápidos › dibuja el rótulo y los tres tiles en orden`
  y dos de `#81 R6`) y el cuerpo de recordatorios (sonda `h_reminderstail`,
  `              <View />` tras el `              })}` de
  `reminders-section-body`, blob `29ff7910`: rojo 11, en `#70 R9`, `#85 R5` y
  `#85 R9`).
- **(N)** *Que el test ya leyera el texto de los valores de una semana.* Solo
  lo leen `R5 › separa el guion…` (una semana de dos días) y
  `R6 › repinta distancia…` (la primera columna). Ver §Premisas.

---

## Aprobación

- [x] **Aprobado por humano** (fecha: 2026-09-30) ← gate obligatorio antes de
      implementar. Al marcar esta casilla, el humano firma también los doce
      puntos de §Qué firma el humano al aprobar esta spec, y en particular el
      tercero (dejar como (D) la tercera métrica con un día seleccionado).

> **Este ciclo tiene una sola casilla**: esta, que firma a la vez #141, #142 y
> #143. No hay gate de dispositivo (§Qué firma el humano, punto 11).

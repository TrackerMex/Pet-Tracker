---
feature: "mobile-weekly-day-column-value-cross-lock"
status: approved         # draft | spec_ready | approved
tags: [spec, mobile, test, deuda]
---

# Diseño — [[mobile-weekly-day-column-value-cross-lock]] (#141, #142 y #143)

> Ver [[requirements]] para los requisitos y [[../../docs/architecture|architecture]]
> para las capas. Este ciclo solo añade tests a la capa de presentación móvil
> (`src/screens/home/`): no hay dominio, aplicación ni infraestructura
> implicados, ni cambio de UI.

## Decisiones técnicas

### D1. Un ciclo, tres entradas, una numeración

#141, #142 y #143 son solo test, sobre el mismo fichero y el mismo componente,
y sus bloques van al final del test uno detrás de otro. Tres ciclos separados
serían tres branches que se pisan al final del mismo fichero (el reparto de
ficheros no protege la historia). Por eso hay una sola spec con una numeración
corrida, y el prefijo de cada `describe` dice de qué entrada es:

| R | Entrada | `describe` |
|---|---|---|
| R1 | #141 | `#141 R1: cada columna muestra el valor de su propio día` |
| R2 | #142 | `#142 R2: la lista de hijos de la tarjeta es cerrada, sin ningún nodo de más al final` |
| R3 | #143 | `#143 R3: con la primera métrica y un día seleccionado, cada columna conserva su forma y sus recetas` |
| R4 | las tres | sin test |

`#142 R2` y `#143 R3` no tienen un `R1`: la numeración es de la spec, no de cada
entrada, como `#135 R4` dentro del ciclo de #131. `init.sh` solo deja una
feature en `in_progress`, así que #142 y #143 tienen un puntero en su carpeta
de `specs/` y se quedan en `spec_ready` hasta el cierre.

### D2. R1 lee el texto de los dos hijos de cada columna

Para cada columna, R1 mapea sus hijos host a su texto con
`child.children.join('')`. En RNTL v14, los `.children` de un `Text` host son
las cadenas que pinta. El resultado es un par `[etiqueta, valor o raya]` por
columna.

- Leer **los dos hijos** y no solo el valor permite que una misma aserción
  vea también un cruce de etiquetas (`labelcross`) o una raya distinta
  (`dashtext`). El solape con `#68 R3` y `#68 R5` es a sabiendas y no los
  sustituye.
- `join('')` y no `props.children`: con `toEqual`, el diff de un elemento React
  agota el heap de jest (observación 2 del reviewer de #140). Con `.children`,
  un `Text` anidado sale como `'[object Object]'` y el rojo es por aserción
  (sonda `valuenested`).
- R1 **no** usa `within(...).getByText` ni `toHaveTextContent` por `testID`.
  El `testID` dice de qué fecha es el nodo, pero no en qué posición está. Una
  lista por posición ve a la vez el valor, el orden y la cardinalidad.

### D3. Esperados literales, nunca calculados

Las tres listas de R1 (`minutes`, `kilometres` y `walks`), las listas de hijos
de R2 y las clases de R3 están escritas en el test como cadenas. No se
importan `formatMetricValue`, `metricValue`, `weekdayLabel` ni ninguna clase de
producción. Un candado que compara la gráfica consigo misma es tautológico: si
alguien cambia el formato, el esperado cambia con él y el test sigue verde.

La semana de R1 (`makeWeek('2026-09-02', [10, 20, 30, 40, 50, null, 70])`)
hace que **ningún par de columnas comparta texto en ninguna métrica**, así que
cualquier cruce de valores cambia al menos un par:

- los minutos son 10 a 70;
- los kilómetros, 1.0 a 7.0;
- los paseos, el índice del día, de 0 a 6.

El 70 da `'1h 10m'`, el único valor con horas, y está en la séptima columna, la
que usa la sonda de la entrada.

### D4. #142 es un hermano estricto de `#135 R4`, no una enmienda

`#135 R4` es un `describe` firmado por otra feature. Editarlo mete a esta spec
en el alcance de #131 y rompe la regla de que el test de base sea un prefijo
exacto del final (R4.3). R2 es un `describe` nuevo que:

- repite los seis estados de `#135 R4` con `toStrictEqual`: sin medir,
  medida, `distanceM`, `distanceM` con un día, con comparación y vacía;
- añade el día `missing` seleccionado, la primera y la tercera métrica con un
  día seleccionado y la comparación con un día seleccionado.

Hay un `it` por rama de la tarjeta (sin comparación, con comparación, vacía).
Por eso el rojo de `cardtail` son tres `it`: la mutación mete el hijo en las
tres ramas, y cada `it` lo ve en su primera aserción.

### D5. #143 es un `describe` nuevo que incluye la clase de la columna

`#140 R1` fija el `testID` de los hijos de cada columna y `#140 R2` su clase,
los dos en cinco estados sin la combinación «primera métrica × día
seleccionado». Añadirles estados editaría `describe` firmados. R3 es un
`describe` nuevo que, en esa combinación, asevera de golpe:

- el `className` de cada columna, porque la seleccionada lleva el borde
  (`z_colselfirstmetric`);
- el `testID` y la clase de cada hijo, por posición, que fijan a la vez la
  receta, el orden y la cardinalidad (`z_labelselfirstmetric`,
  `z_valueselfirstmetric`, `z_dashselfirstmetric`, `z_childselfirstmetric`).

Los dos estados son el día medido `2026-09-05` y el día `missing` `2026-09-07`.
El segundo ve una mutación que solo actúa cuando el seleccionado es `missing`
(`z_labelselmissingfirst`).

La tercera métrica con un día seleccionado queda fuera (`z_labelselwalks`,
(D)): la entrada pide la primera métrica, que es con la que abre la gráfica.

### D6. Guardas con `toEqual`, candados con `toStrictEqual`

- **Guarda**: prueba que la acción llegó al estado antes de aseverar. Es un
  segmento o una columna con `accessibilityState` `toEqual({ selected: true })`,
  o un nodo en pantalla (`weekly-activity-bar-chart`,
  `weekly-activity-tooltip`, `weekly-activity-trend`, `weekly-activity-empty`,
  o «Sin datos de este día» dentro de `weekly-activity-detail`). La guarda
  del selector no puede ser estricta: su `accessibilityState` lleva `busy`,
  `checked`, `disabled` y `expanded` a `undefined`, y `toStrictEqual` falla en
  la base (medido).
- **Candado**: la lista aseverada, siempre con `toStrictEqual`. `toEqual`
  ignora un `undefined` al final de un array, y el `testID` de un `<View />`
  sin `testID` es `undefined`. Por eso `cardtail` pasa con `toEqual`: la sonda
  `loose` con `cardtail` da verde.

### D7. Estados y montajes

- **R1**: un solo render, montado sin medir (`fireLayout = false`, el tercer
  argumento de `renderChartWithProps`) y medido a mano con
  `fireEvent(chartLayout, 'layout', …)` a 295, igual que `#140 R1`. Después
  recorre la rejilla 3 × 3 de métrica por selección sin desmontar. La
  selección sobrevive al cambio de métrica. El orden de los diez estados hace
  que cada paso cambie una sola cosa (la métrica o el día), así que cada
  aserción aísla un estado.
- **R2**: tres montajes, uno por rama. La rama con comparación usa una semana
  **sin** `missing` y `{ ...NO_COMPARISON, activeMinutes: 12.5 }`, igual que
  `#135 R4`. Así ve también una mutación que solo actúa en semanas completas
  (`cardtailnomissing`).
- **R3**: `renderChart` con la semana de R1, ya medida y en la primera métrica,
  que es la de por defecto. No pulsa ninguna métrica: la guarda del segmento
  `activeMinutes` prueba que la gráfica abrió en la primera.

### D8. C4, vía b: una mutación versionada por requisito

Las tres entradas son candados sobre código ya correcto. El rojo de cada R es
un commit que añade su `describe` **y** una mutación de la gráfica. El verde
siguiente solo revierte la gráfica, con
`git checkout HEAD~1 -- mobile-pet-tracker/src/screens/home/weekly-activity-chart.tsx`.

| R | Mutación | Qué hace | Blob |
|---|---|---|---|
| R1 | `P1red` = `valuecross` | la séptima columna calcula su valor con `days[0]` | `9f3c5bfd2b929c80b2d08370ed3f1e9edec5e07b` |
| R2 | `P2red` = `cardtail` | un `<View />` como último hijo de la tarjeta | `0ac97f3562e39a98a3128047bfb5489f091167c2` |
| R3 | `P3red` = `z_labelselfirstmetric` | la etiqueta pasa a `text-foreground` con un día seleccionado y la primera métrica | `6eda3dd1609b2be8d4820ab4d8e39e6f3abdb5c7` |

Son las sondas de las tres entradas, tal cual: cada rojo prueba que el
`describe` nuevo ve justo el hueco que la entrada describe. Cada una es el
único rojo de su etapa en las 6 suites que leen la gráfica (medido).

### D9. Bloques al final, sin imports nuevos, sin tocar helpers

Los tres bloques se pegan al final del test, detrás del de `#140 R2`, en el
orden R1, R2 y R3. Solo usan lo que el test ya importa o define:

- `renderChart`, `renderChartWithProps`, `makeWeek` y `NO_COMPARISON`;
- `fireEvent` y `within`.

No se añade ni se cambia ningún helper, ni se toca ninguna línea previa. El
test de base es un prefijo exacto de cada etapa. Los bloques están en
[[tasks]] con su texto exacto, y el blob de cada etapa del test permite
comprobar que se pegaron byte a byte. No hay configuración de prettier en
`mobile-pet-tracker/` y no se pasa ningún formateador.

## Archivos afectados

| Capa | Archivo | Cambio |
|---|---|---|
| presentación (test) | `mobile-pet-tracker/src/screens/home/weekly-activity-chart.test.tsx` | +350 / −0 (+138 R1, +143 R2, +69 R3). Pasa de 1991 a 2341 líneas, de 25 a 28 `describe` de primer nivel y de 55 a 60 tests |
| presentación | `mobile-pet-tracker/src/screens/home/weekly-activity-chart.tsx` | ninguno en el diff acumulado. Entra y sale en los tres pares rojo/verde |
| harness | `progress/impl_mobile-weekly-day-column-value-cross-lock.md` | nuevo, en el commit de evidencia |
| harness | `specs/mobile-weekly-day-column-value-cross-lock/traceability.md` | rellenado en el commit de evidencia |

## Coordinación

- **#60** (`feature/60-mobile-ios-support`, en el worktree principal) toca
  otros ficheros de `mobile-pet-tracker/`, por ejemplo
  `src/__tests__/hosting-artifacts.test.ts`, pero ninguno de las 6 suites ni el
  test de la gráfica. Si mergea antes, la cuenta de base de la suite cambia y
  el delta exigido sigue siendo +5 tests y +0 suites sobre lo que se mida al
  arrancar.
- Ninguna otra branch abierta toca el test de la gráfica a la fecha de la
  medida. Si al arrancar su blob no es `2f3828f4…`, se para ([[tasks]]
  §Antes de tocar nada, paso 5).

## Alternativas descartadas

- **Editar `#135 R4` para pasarlo a `toStrictEqual`** (la otra opción que abría
  #142). Es el cambio más corto, pero edita un `describe` firmado por otra
  feature y rompe el «prefijo exacto» de R4.3. Tampoco añadiría los estados que
  `#135 R4` no recorre.
- **Añadir estados a `#140 R1` y `#140 R2`** (la otra opción que abría #143).
  Se descarta por la misma razón, y porque `#140 R1` no mira la clase de la
  columna.
- **Aseverar el valor por `testID` con `toHaveTextContent`**. Siete consultas
  por estado y no ven ni la posición ni un nodo de más. Una lista por posición
  ve las tres cosas.
- **Construir el esperado con `formatMetricValue(metric, metricValue(day, metric))`**.
  Es tautológico (D3).
- **Leer `props.children`**. Revienta el heap de jest ante un `Text` anidado
  (D2).
- **Un solo `it` para R2**. El rojo sería uno, pero una mutación que solo
  rompa una rama se vería en la primera aserción de otra y el mensaje no diría
  qué rama es. Un `it` por rama nombra la rama en el título.
- **Cubrir también la tercera métrica en R3**. Es más estados sin que la
  entrada lo pida. Queda como (D) declarado, y es decisión del humano al firmar
  ([[requirements]] §Qué firma el humano, punto 3).
- **Un gate de dispositivo**. La UI no cambia, así que en pantalla no hay nada
  que ver.

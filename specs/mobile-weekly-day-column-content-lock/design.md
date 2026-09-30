---
feature: "mobile-weekly-day-column-content-lock"
status: spec_ready       # draft | spec_ready | approved
tags: [spec, mobile, test, deuda]
---

# Diseño — [[mobile-weekly-day-column-content-lock]] (#140)

> Ver [[requirements]] para los requisitos y [[../../docs/architecture|architecture]]
> para las capas. Esta feature solo añade tests a la capa de presentación móvil
> (`src/screens/home/`): no hay dominio, aplicación ni infraestructura
> implicados.

## Decisiones técnicas

- **D1. Dos candados, uno por decisión de la carta.** El orden de los hijos
  (decisión 12) y su receta (decisión 7) son dos contratos distintos, y cada uno
  tiene su `describe`, su rojo y su commit: R1 y R2. Los dos van al final del
  test, detrás de `#135 R4`, con el prefijo `#140 R<n>` en el título y en el
  comentario. Ninguno depende del otro.

- **D2. R1: los `testID` de los hijos host de cada columna, por posición.** El
  test recorre `getByTestId('weekly-activity-day-row').children` (las siete
  columnas) y, de cada una, `.children` (sus hijos host), y saca el `testID` de
  cada hijo. Compara esa lista de listas con una literal de siete pares:
  `[label, 'weekly-activity-value-<fecha>']`, salvo en el sexto día, que es
  `[label, 'weekly-activity-missing-2026-09-07']`. Así fija de golpe identidad,
  orden y cardinalidad de cada columna, sin recontar por `testID`, que es lo que
  la carta prohíbe (un nodo sin `testID` no se contaría).

  Por qué no basta mirar el padre de cada texto: `colswap` deja a la etiqueta y
  al valor en su columna, solo cambia su orden. Y por qué no basta el orden de
  los `testID` en el árbol entero: la etiqueta repite `testID` en las siete
  columnas, así que hay que leerla por columna.

  El `typeof … === 'string'` de los dos `map` es el mismo que ya usan
  `#130 R2`, `#131 R3` y `#135 R4`: `.children` de RNTL v14 está tipado como
  `(TestInstance | string)[]`, y sin él `tsc` no compila.

- **D3. R2: la clase entera de cada hijo, por posición, con la raya dentro.**
  Mismo recorrido que R1, sacando `props.className`. Los esperados son tres
  literales del test, nunca importados de producción (un esperado importado es
  un candado tautológico):

  | Hijo | Clase |
  |---|---|
  | etiqueta | `'text-2xs font-semibold text-muted'` |
  | valor | `'text-2xs font-semibold text-foreground'` |
  | raya | `'text-2xs font-normal text-muted'` |

  La raya entra aunque la entrada solo midió la etiqueta y el valor: nadie mira
  su clase hoy (sonda `dashcolor`, verde en las 6 suites), y la carta pide la
  receta de **cada** texto (decisión 7) en **todas** sus ramas (decisión 10).
  Cuesta un literal más en la misma aserción, porque el día `missing` ya está en
  la semana de R1.

  Se compara la cadena completa, no `toContain` ni tokens sueltos: con
  `toContain('text-muted')`, `labelextra` (` uppercase` añadido) pasaría, y con
  tokens habría que decidir qué tokens cuentan. El coste: todo cambio legítimo de
  una de las tres recetas obliga a tocar R2 a sabiendas ([[requirements]] §Qué
  firma el humano, punto 4).

- **D4. `toStrictEqual`, no `toEqual`.** `toEqual` trata un elemento
  `undefined` al final de un array como si no estuviera. Un hijo host de más al
  final de una columna, sin `testID`, sale en R1 como `undefined` al final de su
  par, y sin `className`, en R2 igual. Medido: con los diez `toStrictEqual` de
  los dos bloques cambiados a `toEqual` (test `b62db88a`), un `<View />` al final
  de la columna (`coltail`) da verde, 55/55, y un punto con clase en la columna
  seleccionada (`dotsel`) solo pone rojo R2. Con `toStrictEqual`, los dos dan
  rojo 2.

  Es una diferencia deliberada con `#130 R2`, `#131 R3` y `#135 R4`, que usan
  `toEqual`. De paso, R1 y R2 cierran el hueco de la fila (`rowtail`, verde hoy):
  un `<View />` al final de la fila sale como `undefined` en la lista de columnas
  y `toStrictEqual` lo ve. El de la tarjeta (`cardtail`) no lo ven, porque R1 y
  R2 no leen la tarjeta: queda como (F). Los dos comentarios lo dicen, para que
  nadie lo «armonice» con los hermanos.

- **D5. Cinco estados, y el día `missing` como prop de montaje.** La semana es
  `makeWeek('2026-09-02', [10, 20, 30, 40, 50, null, 70])`: el `null` hace
  `missing` el sexto día (`2026-09-07`), y el resto son medidos. No hay forma de
  volver `missing` un día pulsando: es una prop de montaje, así que va en la
  semana desde el primer render y las cinco aserciones la ven.

  Los cuatro primeros estados son los de `#131 R3` (sin medir, medido a 295,
  segunda métrica, un día medido seleccionado), cada uno tras su guarda. El
  quinto selecciona el día `missing` pulsando su columna
  (`weekly-activity-day-2026-09-07`), y su guarda es la copy que ya existe del
  detalle, «Sin datos de este día», buscada dentro de `weekly-activity-detail`
  con `within`. Es el único estado que pinta la columna `missing` seleccionada:
  sin él, `dashcolorsel` y `dotselmissing` pasarían.

  Lo que no se recorre queda como (D) con su sonda: la tercera métrica
  (`valuecolorwalks`), la comparación (`valuecolortrend`, que es otra prop de
  montaje y otro render), una semana sin días `missing` (`labelcolornomissing`),
  el idioma y el tema.

- **D6. Rojos por mutación de producción versionada (C4, vía b).** R1 y R2 se
  escriben sobre código que ya cumple. Cada commit rojo lleva el bloque del test
  y una mutación de la gráfica; el verde la revierte con
  `git checkout HEAD~1 --`, y la gráfica acaba en su blob de base. Las dos
  mutaciones son las que cita la entrada, con sus mismos blobs:
  - `P1red` es `colswap` (`6214543c`): las seis líneas de la etiqueta pasan
    debajo del ternario;
  - `P2red` es `labelcolor` (`f58f4903`): la clase de la etiqueta pasa a
    `text-foreground`.

  `colswap` sobre el test final pone rojos R1 y R2 (el orden de las clases
  también cambia); por eso `P1red` se aplica cuando solo existe R1, y cada rojo
  es único en su etapa.

- **D7. Formato a mano, sin prettier.** El test no está formateado con prettier
  (pasarlo cambiaría líneas de la base) y `mobile-pet-tracker/` no tiene
  configuración de prettier. Los bloques de [[tasks]] ya vienen en el estilo del
  fichero; se pegan tal cual. No hace falta ningún import nuevo:
  `renderChartWithProps`, `makeWeek`, `NO_COMPARISON`, `fireEvent` y `within` ya
  están en el test.

## Archivos afectados

- `mobile-pet-tracker/src/screens/home/weekly-activity-chart.test.tsx`
  (presentación, tests): dos `describe` nuevos al final, con un `it` cada uno.
  Pasa de 53 a 55 tests; +150 líneas, −0.
- `mobile-pet-tracker/src/screens/home/weekly-activity-chart.tsx`
  (presentación): **solo** en los dos commits rojos, con la mutación que el verde
  siguiente revierte. Diff acumulado vacío.
- `progress/impl_mobile-weekly-day-column-content-lock.md` y
  `specs/mobile-weekly-day-column-content-lock/traceability.md`: la evidencia.

## Coordinación

- Ninguna branch local ni remota `feature/*` toca la gráfica, su test,
  `src/screens/home/index.test.tsx` ni `src/__tests__/` respecto de
  `origin/main` (medido el 2026-09-30). La de #60 (`feature/60-mobile-ios-support`,
  en el worktree principal) tampoco.
- Si otra feature mergea en `main` antes y la branch la incorpora, la base de la
  suite cambia: el delta exigido sigue siendo +2 tests y +0 suites sobre lo que
  Codex mida al arrancar, y los «N failed de M» de los rojos se desplazan igual.
  Si la base del test o de la gráfica cambia (sus blobs), **para**: las sondas y
  los blobs de esta spec dejan de valer.
- Seis suites leen la gráfica o la pintan: la suya, `index.test.tsx`,
  `design-drift`, `consistency-classnames`, `legibility-classnames` y
  `ui-language`. Las dos mutaciones rojas, cada una sobre su etapa, solo ponen
  rojo el `it` nuevo de su etapa en las seis ([[requirements]] §Premisas).

## Alternativas descartadas

- **Extender `#130 R2` o `#131 R3` en vez de bloques nuevos.** Son `describe`
  firmados y cerrados; el criterio 3 de la entrada los quiere sin cambios.
- **`toEqual`, como los hermanos.** Deja pasar un hijo de más al final de la
  columna (D4, sonda `loose` con `coltail`).
- **Un `it` por estado.** Cinco renders en vez de uno por requisito, y el paso
  de un estado al siguiente (medir, cambiar de métrica, seleccionar) es parte de
  lo que se prueba: el candado debe aguantar la transición, no solo el estado
  montado de cero.
- **R2 con `toContain` o por tokens.** Deja pasar clases añadidas
  (`labelextra`), y obliga a decidir qué tokens cuentan (D3).
- **R2 sin la raya.** Deja la rama `missing` sin receta: `dashcolor`,
  `dashweight` y `dashcolorsel` seguirían verdes.
- **Esperados importados de producción** (leer las clases del fuente, o
  exportarlas). Candado tautológico: el esperado se mueve con lo observado.
- **Cerrar aquí el cruce de valores entre columnas (`valuecross`).** Es la
  decisión 1 de la carta, no la 7 ni la 12; pediría aseverar el texto de cada
  valor contra su día, y el valor se formatea por métrica y por idioma. Queda
  como (F).
- **Cambiar `#135 R4` a `toStrictEqual` (`cardtail`).** Es un `describe`
  firmado de otra feature. Queda como (F).
- **Un gate de dispositivo.** El árbol de producción acaba idéntico al de
  `origin/main`: no hay nada nuevo que ver ni que oír.

---
feature: "mobile-weekly-day-column-value-cross-lock"
status: spec_ready       # draft | spec_ready | approved
tags: [spec, mobile, test, deuda]
---

# Trazabilidad — [[mobile-weekly-day-column-value-cross-lock]] (#141, #142 y #143)

Todos los tests viven en
`mobile-pet-tracker/src/screens/home/weekly-activity-chart.test.tsx`.

R1 es de #141, R2 de #142, R3 de #143 y R4 de las tres ([[requirements]],
tabla de entradas). R2 tiene tres `it` en el mismo `describe`: cada uno tiene
su fila, y las tres citan los mismos dos commits.

| Requisito | Test (archivo::nombre) | Commit rojo | Commit verde |
|---|---|---|---|
| R1 (#141) | `weekly-activity-chart.test.tsx::#141 R1: cada columna muestra el valor de su propio día › el texto de los dos hijos de cada columna, por posición, antes de medir y, ya medido, en las tres métricas sin día seleccionado, con un día medido y con el día sin datos` | pendiente | pendiente |
| R2 (#142) | `weekly-activity-chart.test.tsx::#142 R2: la lista de hijos de la tarjeta es cerrada, sin ningún nodo de más al final › sin comparación: antes y después de medir, en las tres métricas y con un día seleccionado, medido o sin datos, también con la primera métrica` | pendiente | pendiente |
| R2 (#142) | `weekly-activity-chart.test.tsx::#142 R2: la lista de hijos de la tarjeta es cerrada, sin ningún nodo de más al final › con comparación: la tendencia entre el selector y el gráfico, sin día seleccionado y con uno` | pendiente | pendiente |
| R2 (#142) | `weekly-activity-chart.test.tsx::#142 R2: la lista de hijos de la tarjeta es cerrada, sin ningún nodo de más al final › sin ningún día medido: la cabecera y el mensaje, y nada más` | pendiente | pendiente |
| R3 (#143) | `weekly-activity-chart.test.tsx::#143 R3: con la primera métrica y un día seleccionado, cada columna conserva su forma y sus recetas › la clase de cada columna y el testID y la clase de sus dos hijos, por posición, con un día medido seleccionado y con el día sin datos seleccionado` | pendiente | pendiente |
| R4 (las tres) | sin test: cierre medido ([[tasks]] §R4 y `progress/impl_mobile-weekly-day-column-value-cross-lock.md`) | no aplica | pendiente |

Regla: el reviewer no aprueba si alguna fila queda «pendiente».

## Convención de commit

Mensajes exactos, en este orden:

1. Rojo de R1: `test(mobile): expose the weekly day value cross with a versioned mutation (R1)`.
   Añade el `describe` de `#141 R1` y la mutación `P1red` en la gráfica.
2. Verde de R1: `test(mobile): lock each weekly day column to its own value in every metric (R1)`.
   Solo revierte la gráfica.
3. Rojo de R2: `test(mobile): expose a trailing card child with a versioned mutation (R2)`.
   Añade el `describe` de `#142 R2` y la mutación `P2red` en la gráfica.
4. Verde de R2: `test(mobile): lock the weekly card children with toStrictEqual (R2)`.
   Solo revierte la gráfica.
5. Rojo de R3: `test(mobile): expose the first-metric selected label colour with a versioned mutation (R3)`.
   Añade el `describe` de `#143 R3` y la mutación `P3red` en la gráfica.
6. Verde de R3: `test(mobile): lock the weekly columns with a day selected on the first metric (R3)`.
   Solo revierte la gráfica.
7. Evidencia: `docs(mobile): record the weekly value cross, card and first-metric evidence (R1,R2,R3,R4)`.
   Solo toca `progress/impl_mobile-weekly-day-column-value-cross-lock.md` y esta
   tabla.

## Notas

- R1, R2 y R3 son candados sobre código ya correcto (C4, vía **b**): su commit
  rojo lleva una mutación versionada de la gráfica y su verde la revierte con
  `git checkout HEAD~1 --` ([[design]] D8). Sus filas citan esos dos commits.
- **R4** se verifica con las medidas de [[tasks]] §R4. Su fila cita el verde de
  R3, no el de evidencia: el commit de evidencia no lleva código.
- #142 y #143 no tienen trazabilidad propia: sus punteros
  (`specs/mobile-weekly-card-children-strict-lock/requirements.md` y
  `specs/mobile-weekly-day-selected-first-metric-lock/requirements.md`) remiten
  aquí.

El implementer rellena esta tabla en el commit de evidencia y el reviewer la
valida al aprobar (ver [[../../docs/specs|specs]] y
[[../../CHECKPOINTS|CHECKPOINTS]] C5). **No rebasees** la branch después de
rellenarla: los hashes dejarían de valer. Si hace falta, reapunta cada hash y
comprueba con `git merge-base --is-ancestor <hash> HEAD` que sigue en la
historia.

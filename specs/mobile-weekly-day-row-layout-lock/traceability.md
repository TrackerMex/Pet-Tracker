---
feature: "mobile-weekly-day-row-layout-lock"
status: approved         # draft | spec_ready | approved
tags: [spec, mobile, test, deuda]
---

# Trazabilidad — [[mobile-weekly-day-row-layout-lock]] (#131 y #135)

Todos los tests viven en
`mobile-pet-tracker/src/screens/home/weekly-activity-chart.test.tsx`.

| Requisito | Entrada | Test (archivo::nombre) | Commit rojo | Commit verde |
|---|---|---|---|---|
| R1 | #131 | `weekly-activity-chart.test.tsx::#131 R1: la fila de las siete columnas es una fila › la fila solo lleva flex-row antes y después de medir, con otra métrica y con un día seleccionado` | `81251dfcc2918f71f385d4bac6528a2cd99448a9` | `1dfe1d223d11ac219bc8dd69f7319d68961925d3` |
| R2 | #131 | `weekly-activity-chart.test.tsx::#131 R2: la fila deja a cada lado el mismo hueco que el gráfico › el padding de la fila son los dos huecos de la línea de media, también con otra métrica y con un día seleccionado` | `6ccce2e71d5ffe2d7657bc85a1324e336b08fdde` | `c16ef7c36fabe17c5e2748c67eab41680f50e575` |
| R3 | #131 | `weekly-activity-chart.test.tsx::#131 R3: cada columna reparte la fila a partes iguales › las siete columnas llevan flex-1 y centran su contenido antes y después de medir, con otra métrica y con un día seleccionado` | `950b28a53324da57fc39ca5fd2775d2e5d31879e` | `5c22414fe9b0f466c915687d0bf88d946048332f` |
| R4 | #135 | `weekly-activity-chart.test.tsx::#135 R4: entre la tarjeta y cada uno de sus hijos no hay otro nodo`, sus tres `it`: `› sin comparación: cabecera, selector, gráfico y fila antes y después de medir y con otra métrica, y el detalle al final con un día seleccionado`, `› con comparación, la tendencia va entre el selector y el gráfico` y `› sin ningún día medido, la tarjeta solo tiene la cabecera y el mensaje` | `a6f4d676cf5b4bbb2135f1fc209b8180a4d7ba0c` | `3a85668fd4615a64fd321057a048e974c73c2160` |
| R5 | #131 y #135 | sin test: cierre medido ([[tasks]] §R5 y `progress/impl_mobile-weekly-day-row-layout-lock.md`) | no aplica | `3a85668fd4615a64fd321057a048e974c73c2160` |

Regla: el reviewer no aprueba si alguna fila queda «pendiente».

## Convención de commit

Mensajes exactos, en este orden:

1. Rojo de R1: `test(mobile): expose the weekly day row direction with a versioned mutation (R1)`.
   Añade el `describe` de `#131 R1` y la mutación `P1red` en la gráfica.
2. Verde de R1: `test(mobile): lock the weekly day row as a single flex-row (R1)`.
   Solo revierte la gráfica.
3. Rojo de R2: `test(mobile): expose the weekly day row padding with a versioned mutation (R2)`.
4. Verde de R2: `test(mobile): lock the weekly day row padding to the average line ends (R2)`.
5. Rojo de R3: `test(mobile): expose the weekly day column share with a versioned mutation (R3)`.
6. Verde de R3: `test(mobile): lock each weekly day column to an equal share of the row (R3)`.
7. Rojo de R4: `test(mobile): expose a wrapper around the metric selector with a versioned mutation (R4)`.
8. Verde de R4: `test(mobile): lock the weekly card children as a closed list (R4)`.
9. Evidencia: `docs(mobile): record the weekly day row layout and card children evidence (R1,R2,R3,R4,R5)`.
   Solo toca `progress/impl_mobile-weekly-day-row-layout-lock.md` y esta
   tabla.

## Notas

- R1 a R4 son candados sobre código ya correcto (C4, vía **b**): su commit
  rojo lleva una mutación versionada de la gráfica y su verde la revierte con
  `git checkout HEAD~1 --` ([[design]] D6). Sus filas citan esos dos commits.
- **R5** se verifica con las medidas de [[tasks]] §R5. Su fila cita el verde
  de R4, no el de evidencia: el commit de evidencia no lleva código.

El implementer rellena esta tabla en el commit de evidencia y el reviewer la
valida al aprobar (ver [[../../docs/specs|specs]] y
[[../../CHECKPOINTS|CHECKPOINTS]] C5). **No rebasees** la branch después de
rellenarla: los hashes dejarían de valer. Si hace falta, reapunta cada hash y
comprueba con `git merge-base --is-ancestor <hash> HEAD` que sigue en la
historia.

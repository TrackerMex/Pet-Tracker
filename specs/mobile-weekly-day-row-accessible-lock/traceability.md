---
feature: "mobile-weekly-day-row-accessible-lock"
status: spec_ready       # draft | spec_ready | approved
tags: [spec, mobile, a11y, deuda]
---

# Trazabilidad — [[mobile-weekly-day-row-accessible-lock]] (#130)

Todos los tests viven en
`mobile-pet-tracker/src/screens/home/weekly-activity-chart.test.tsx`.

| Requisito | Test (archivo::nombre) | Commit rojo | Commit verde |
|---|---|---|---|
| R1 | `weekly-activity-chart.test.tsx::#130 R1: la fila de las siete columnas no se vuelve un nodo accesible › la fila solo lleva su testID, su clase, su estilo y sus hijos` | pendiente | pendiente |
| R2 | `weekly-activity-chart.test.tsx::#130 R2: entre la tarjeta y cada columna no hay otro nodo › las siete columnas cuelgan de la fila, y la fila, de la tarjeta` | pendiente | pendiente |
| R3 | sin test: cierre medido ([[tasks]] §R3 y `progress/impl_mobile-weekly-day-row-accessible-lock.md`) | no aplica | pendiente: el hash del **verde de R2**, que es el último commit de código |

Regla: el reviewer no aprueba si alguna fila queda «pendiente».

## Convención de commit

- Rojo: `test(mobile): <desc> with a versioned mutation (R<n>)`. Lleva el test
  nuevo **y** la mutación de la gráfica.
- Verde: `test(mobile): <desc> (R<n>)`. Solo revierte la gráfica con
  `git checkout HEAD~1 --`.
- Evidencia: `docs(mobile): record the weekly day row lock evidence (R3)`.

Los mensajes exactos están en [[tasks]].

## Requisitos sin test propio

- **R3** se verifica con las medidas de [[tasks]] §R3: suite, `tsc`, `eslint`,
  cifras de candado, diff de producción vacío y blobs finales. Su fila cita el
  hash del verde de R2, no el de `HEAD`: el commit de evidencia solo toca
  `progress/` y esta tabla, y citarlo haría que la fila apuntara a un commit
  sin código.

El implementer rellena esta tabla en el commit de evidencia y el reviewer la
valida al aprobar (ver [[../../docs/specs|specs]] y
[[../../CHECKPOINTS|CHECKPOINTS]] C5). **No rebasees** la branch después de
rellenarla: los hashes dejarían de valer. Si hace falta, reapunta cada hash y
comprueba con `git merge-base --is-ancestor <hash> HEAD` que sigue en la
historia.

---
feature: "mobile-weekly-chart-root-accessible-lock"
status: approved         # draft | spec_ready | approved
tags: [spec, mobile, a11y, deuda]
---

# Trazabilidad — [[mobile-weekly-chart-root-accessible-lock]] (#132)

Todos los tests viven en
`mobile-pet-tracker/src/screens/home/weekly-activity-chart.test.tsx`.

| Requisito | Test (archivo::nombre) | Commit rojo | Commit verde |
|---|---|---|---|
| R1 | `weekly-activity-chart.test.tsx::#132 R1: la tarjeta es la raíz host de lo que pinta la gráfica › entre el nodo que monta la gráfica y la tarjeta no hay ningún otro` | pendiente | pendiente |
| R2 | sin test: cierre medido ([[tasks]] §R2 y `progress/impl_mobile-weekly-chart-root-accessible-lock.md`) | no aplica | pendiente |

Regla: el reviewer no aprueba si alguna fila queda «pendiente».

## Convención de commit

- Rojo: `test(mobile): <desc> with a versioned mutation (R1)`. Lleva el test
  nuevo **y** la mutación de la gráfica.
- Verde: `test(mobile): <desc> (R1)`. Solo revierte la gráfica con
  `git checkout HEAD~1 --`.
- Evidencia: `docs(mobile): record the weekly chart root lock evidence (R2)`.

Los mensajes exactos están en [[tasks]].

## Requisitos sin test propio

- **R2** se verifica con las medidas de [[tasks]] §R2: suite, `tsc`, `eslint`,
  cifras de candado, diff del test solo añadido, diff de producción vacío y
  blobs finales. Su fila cita el hash del verde de R1, no el de `HEAD`: el
  commit de evidencia solo toca `progress/` y esta tabla, y citarlo haría que
  la fila apuntara a un commit sin código.

El implementer rellena esta tabla en el commit de evidencia y el reviewer la
valida al aprobar (ver [[../../docs/specs|specs]] y
[[../../CHECKPOINTS|CHECKPOINTS]] C5). **No rebasees** la branch después de
rellenarla: los hashes dejarían de valer. Si hace falta, reapunta cada hash y
comprueba con `git merge-base --is-ancestor <hash> HEAD` que sigue en la
historia.

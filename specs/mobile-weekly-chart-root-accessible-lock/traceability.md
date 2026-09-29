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
| R1 | `weekly-activity-chart.test.tsx::#132 R1: la tarjeta es la raíz host de lo que pinta la gráfica › entre el nodo que monta la gráfica y la tarjeta no hay ningún otro` | `4fb4481c` | `99629c30` |
| R2 | sin test: cierre medido ([[tasks]] §R2 y `progress/impl_mobile-weekly-chart-root-accessible-lock.md`) | no aplica | `99629c30` |
| R1 (Enmienda 1) | `weekly-activity-chart.test.tsx::#132 R1: la tarjeta es la raíz host de lo que pinta la gráfica › tras medir el gráfico, entre el nodo que monta la gráfica y la tarjeta sigue sin haber otro` | `3a0022f6` | `061ca9ea` |
| R1 (Enmienda 1) | `weekly-activity-chart.test.tsx::#132 R1: la tarjeta es la raíz host de lo que pinta la gráfica › con un día seleccionado, entre el nodo que monta la gráfica y la tarjeta sigue sin haber otro` | `728ad1c6` | `be6ac464` |
| R1 (Enmienda 1) | `weekly-activity-chart.test.tsx::#132 R1: la tarjeta es la raíz host de lo que pinta la gráfica › con otra métrica seleccionada, entre el nodo que monta la gráfica y la tarjeta sigue sin haber otro` | `f27dd25d` | `97f8c18c` |
| R2 (Enmienda 1) | sin test: cierre medido ([[tasks]] §E1 — Cierre y la sección `## Enmienda 1` de `progress/impl_mobile-weekly-chart-root-accessible-lock.md`) | no aplica | `97f8c18c` |

Regla: el reviewer no aprueba si alguna fila queda «pendiente».

## Convención de commit

- Rojo: `test(mobile): <desc> with a versioned mutation (R1)`. Lleva el test
  nuevo **y** la mutación de la gráfica.
- Verde: `test(mobile): <desc> (R1)`. Solo revierte la gráfica con
  `git checkout HEAD~1 --`.
- Evidencia: `docs(mobile): record the weekly chart root lock evidence (R2)`.

Los mensajes exactos están en [[tasks]].

### Enmienda 1

Las filas de la ronda 1 **no se tocan**: sus hashes siguen en la historia. Las
cuatro filas «(Enmienda 1)» las rellena el implementer en el commit de evidencia
de [[tasks]] §E1 — Cierre, en este orden de commits:

1. rojo de E1.1: `test(mobile): expose a wrapper that appears after the weekly chart's layout with a versioned mutation (R1)`;
2. verde de E1.1: `test(mobile): lock the weekly activity card as the chart's host root after layout (R1)`;
3. rojo de E1.2: `test(mobile): expose a wrapper that appears with a selected day with a versioned mutation (R1)`;
4. verde de E1.2: `test(mobile): lock the weekly activity card as the chart's host root with a selected day (R1)`;
5. rojo de E1.3: `test(mobile): expose a wrapper that appears with another metric selected with a versioned mutation (R1)`;
6. verde de E1.3: `test(mobile): lock the weekly activity card as the chart's host root with another metric selected (R1)`;
7. evidencia: `docs(mobile): record the weekly chart root lock evidence after amendment 1 (R2)`.

La primera fila «(Enmienda 1)» cita los commits 1 y 2; la segunda, el 3 y el 4;
la tercera, el 5 y el 6; la de R2, el 6, por la misma razón que la fila de R2
de la ronda 1.

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

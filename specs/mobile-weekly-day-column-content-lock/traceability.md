---
feature: "mobile-weekly-day-column-content-lock"
status: approved         # draft | spec_ready | approved
tags: [spec, mobile, test, deuda]
---

# Trazabilidad — [[mobile-weekly-day-column-content-lock]] (#140)

Todos los tests viven en
`mobile-pet-tracker/src/screens/home/weekly-activity-chart.test.tsx`.

| Requisito | Test (archivo::nombre) | Commit rojo | Commit verde |
|---|---|---|---|
| R1 | `weekly-activity-chart.test.tsx::#140 R1: cada columna tiene la etiqueta del día y, debajo, su valor o su raya › las siete columnas tienen dos hijos, la etiqueta primero, antes y después de medir, con otra métrica y con un día seleccionado, medido o sin datos` | pendiente | pendiente |
| R2 | `weekly-activity-chart.test.tsx::#140 R2: la etiqueta, el valor y la raya de cada columna llevan su receta exacta › la clase de los dos hijos de cada columna, por posición, antes y después de medir, con otra métrica y con un día seleccionado, medido o sin datos` | pendiente | pendiente |
| R3 | sin test: cierre medido ([[tasks]] §R3 y `progress/impl_mobile-weekly-day-column-content-lock.md`) | no aplica | pendiente |

Regla: el reviewer no aprueba si alguna fila queda «pendiente».

## Convención de commit

Mensajes exactos, en este orden:

1. Rojo de R1: `test(mobile): expose the weekly day column content order with a versioned mutation (R1)`.
   Añade el `describe` de `#140 R1` y la mutación `P1red` en la gráfica.
2. Verde de R1: `test(mobile): lock each weekly day column to its label and value in order (R1)`.
   Solo revierte la gráfica.
3. Rojo de R2: `test(mobile): expose the weekly day label colour with a versioned mutation (R2)`.
   Añade el `describe` de `#140 R2` y la mutación `P2red` en la gráfica.
4. Verde de R2: `test(mobile): lock the weekly day label, value and dash recipes (R2)`.
   Solo revierte la gráfica.
5. Evidencia: `docs(mobile): record the weekly day column content evidence (R1,R2,R3)`.
   Solo toca `progress/impl_mobile-weekly-day-column-content-lock.md` y esta
   tabla.

## Notas

- R1 y R2 son candados sobre código ya correcto (C4, vía **b**): su commit rojo
  lleva una mutación versionada de la gráfica y su verde la revierte con
  `git checkout HEAD~1 --` ([[design]] D6). Sus filas citan esos dos commits.
- **R3** se verifica con las medidas de [[tasks]] §R3. Su fila cita el verde de
  R2, no el de evidencia: el commit de evidencia no lleva código.

El implementer rellena esta tabla en el commit de evidencia y el reviewer la
valida al aprobar (ver [[../../docs/specs|specs]] y
[[../../CHECKPOINTS|CHECKPOINTS]] C5). **No rebasees** la branch después de
rellenarla: los hashes dejarían de valer. Si hace falta, reapunta cada hash y
comprueba con `git merge-base --is-ancestor <hash> HEAD` que sigue en la
historia.

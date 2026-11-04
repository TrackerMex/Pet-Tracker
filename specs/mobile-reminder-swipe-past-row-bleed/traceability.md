---
feature: "mobile-reminder-swipe-past-row-bleed"
status: approved        # draft | approved
tags: [mobile, ui, spec]
---

# Trazabilidad — [[mobile-reminder-swipe-past-row-bleed]] (#239)

Rutas relativas a `mobile-pet-tracker/src/`.

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `screens/reminders/index.test.tsx::#239 R1: la fila pasada del dueño va sobre una base opaca dentro de su deslizable` | `85299804` — `feat(mobile): give past reminder rows an opaque base inside the swipeable (R1, R2, R5, R6)` |
| R2 | `screens/reminders/index.test.tsx::#239 R2: la base no envuelve el panel y la franja de Pasados es la de Próximos` | `85299804` — `feat(mobile): give past reminder rows an opaque base inside the swipeable (R1, R2, R5, R6)` |
| R3 | `screens/reminders/index.test.tsx::#239 R3: las filas de Próximos no llevan base` | `022fc871` — `test(mobile): opaque base under past reminder rows (R1, R2, R3, R4, R5, R6)`; sonda S1 en el reporte |
| R4 | `screens/reminders/index.test.tsx::#239 R4: quien no es dueño no lleva base en Pasados` | `022fc871` — `test(mobile): opaque base under past reminder rows (R1, R2, R3, R4, R5, R6)`; sonda S2 en el reporte |
| R5 | `screens/reminders/index.test.tsx::#239 R5: con el ReanimatedSwipeable real la fila pasada va sobre su base y el panel abre la hoja` | `85299804` — `feat(mobile): give past reminder rows an opaque base inside the swipeable (R1, R2, R5, R6)` |
| R6 | `__tests__/reminder-swipe-actions-canvas-fidelity.test.ts::#239 R6: inventario del fuente` | `85299804` — `feat(mobile): give past reminder rows an opaque base inside the swipeable (R1, R2, R5, R6)` |
| R7 | `__tests__/reminder-swipe-actions-canvas-fidelity.test.ts::#239 R7: los candados enmendados nombran su enmienda y la spec enmendada lleva su casilla`; suite completa reservada al leader (`./init.sh`) | `aae1b86d` — `test(mobile): suffix amended locks with #239 R7 (R7)` |

Regla: el reviewer no aprueba si alguna fila queda "pendiente".
Convención de commit: `feat(<scope>): <desc> (R1,R2)`.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).

Evidencia del implementador: `progress/impl_mobile-reminder-swipe-past-row-bleed.md`.
Test primero: rojo R1–R6 en `022fc871`, verde en `85299804`; rojo R7 en `10d67da1` (`test(mobile): amended locks name the past-row base amendment (R7)`), verde en `aae1b86d`. Sondas S1–S5 revertidas y sin commit.
G2 permanece sin marcar y corresponde al humano. El leader ejecuta `./init.sh` y registra la suite completa antes de revisar el cierre de la feature; el implementador no modifica su estado.

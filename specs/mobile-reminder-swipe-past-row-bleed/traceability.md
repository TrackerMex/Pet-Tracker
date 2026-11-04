---
feature: "mobile-reminder-swipe-past-row-bleed"
status: approved        # draft | approved
tags: [mobile, ui, spec]
---

# Trazabilidad — [[mobile-reminder-swipe-past-row-bleed]] (#239)

Rutas relativas a `mobile-pet-tracker/src/`.

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | pendiente: `screens/reminders/index.test.tsx::#239 R1: la fila pasada del dueño va sobre una base opaca dentro de su deslizable` | pendiente |
| R2 | pendiente: `screens/reminders/index.test.tsx::#239 R2: la base no envuelve el panel y la franja de Pasados es la de Próximos` | pendiente |
| R3 | pendiente: `screens/reminders/index.test.tsx::#239 R3: las filas de Próximos no llevan base` | pendiente |
| R4 | pendiente: `screens/reminders/index.test.tsx::#239 R4: quien no es dueño no lleva base en Pasados` | pendiente |
| R5 | pendiente: `screens/reminders/index.test.tsx::#239 R5: con el ReanimatedSwipeable real la fila pasada va sobre su base y el panel abre la hoja` | pendiente |
| R6 | pendiente: `__tests__/reminder-swipe-actions-canvas-fidelity.test.ts::#239 R6: inventario del fuente` | pendiente |
| R7 | pendiente: `__tests__/reminder-swipe-actions-canvas-fidelity.test.ts::#239 R7: los candados enmendados nombran su enmienda y la spec enmendada lleva su casilla` y la suite completa (`./init.sh`, la corre el leader) | pendiente |

Regla: el reviewer no aprueba si alguna fila queda "pendiente".
Convención de commit: `feat(<scope>): <desc> (R1,R2)`.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).

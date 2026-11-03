---
feature: "mobile-reminder-swipe-actions"
status: approved     # draft | approved
tags: [mobile, ui, spec]
---

# Trazabilidad — [[mobile-reminder-swipe-actions]] (#228)

Rutas relativas a `mobile-pet-tracker/src/`.

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `__tests__/reminder-swipe-actions-canvas-fidelity.test.ts::#228 R1: el panel reutiliza las tres claves con su literal y sus invocaciones` | pendiente |
| R2 | `screens/reminders/index.test.tsx::#228 R2: la fila del dueño va dentro de su deslizable con el panel a la derecha y sin rebote` | pendiente |
| R3 | `screens/reminders/index.test.tsx::#228 R3: el panel de %s pinta la receta del canvas y se oculta a los lectores de pantalla` | pendiente |
| R4 | `screens/reminders/index.test.tsx::#228 R4: pulsar el panel de un puntual cierra el deslizable y abre la hoja de borrar`; `screens/reminders/index.test.tsx::#228 R4: pulsar el panel de una serie cierra el deslizable y abre la hoja de Cancelar serie` | pendiente |
| R5 | `screens/reminders/index.test.tsx::#228 R5: la fila de %s expone su acción de accesibilidad y abre la misma hoja`; `screens/reminders/index.test.tsx::#228 R5: la fila retira su acción de accesibilidad mientras su borrado sigue pendiente` | pendiente |
| R6 | `screens/reminders/index.test.tsx::#228 R6: las filas pasadas también se deslizan y solo la fila va atenuada` | pendiente |
| R7 | `screens/reminders/index.test.tsx::#228 R7: quien no es dueño no tiene deslizable, panel ni acción de accesibilidad` | pendiente |
| R8 | `screens/reminders/index.test.tsx::#228 R8: la fila ya no lleva botón de texto` | pendiente |
| R9 | `screens/reminders/index.test.tsx::#228 R9: con el ReanimatedSwipeable real la fila y su panel se montan y el panel abre la hoja` | pendiente |
| R10 | `__tests__/reminder-swipe-actions-canvas-fidelity.test.ts::#228 R10: %s sigue al artboard %s`; `__tests__/reminder-swipe-actions-canvas-fidelity.test.ts::#228 R10: los tokens rosa y danger del canvas son los de global.css` | pendiente |
| R11 | `__tests__/reminder-swipe-actions-canvas-fidelity.test.ts::#228 R11: inventario del fuente` | pendiente |
| R12 | `__tests__/reminder-swipe-actions-canvas-fidelity.test.ts::#228 R12: la carta lleva una vez el bloque de su enmienda` | pendiente (bloqueado por G4) |
| R13 | `__tests__/reminder-swipe-actions-canvas-fidelity.test.ts::#228 R13: los candados enmendados nombran su enmienda y las specs enmendadas llevan su casilla` | pendiente |

Regla: el reviewer no aprueba si alguna fila queda "pendiente". R12 es la
excepción mientras la casilla G4 de [[requirements]] §Aprobación siga sin
marcar: su fila queda «pendiente (bloqueado por G4)» y la feature no pasa a
`done` hasta cerrarla.
Convención de commit: `feat(<scope>): <desc> (R1,R2)`.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).

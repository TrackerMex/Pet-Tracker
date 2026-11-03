---
feature: "mobile-reminder-swipe-actions"
status: approved     # draft | approved
tags: [mobile, ui, spec]
---

# Trazabilidad — [[mobile-reminder-swipe-actions]] (#228)

Rutas relativas a `mobile-pet-tracker/src/`.

Preparación T0: `114f54b0` — test(mobile): swipeable double and hidden-query option for reminders (T0).
Sondas S1–S9 y verificaciones en `progress/impl_mobile-reminder-swipe-actions.md`.
R12 entró tras G4 (aprobado por el humano el 2026-11-03, `c542a08d`): el rojo es de
Codex (`progress/impl_mobile-reminder-swipe-actions-r12.md`) y el bloque de la carta,
del leader. G2 corresponde al humano.
La suite completa y `./init.sh` los ejecuta el leader según el handoff.

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `__tests__/reminder-swipe-actions-canvas-fidelity.test.ts::#228 R1: el panel reutiliza las tres claves con su literal y sus invocaciones` | `8bd01469` test(mobile): copy, canvas fidelity and source inventory of reminder swipe actions (R1, R10, R11); `b28b74f6` feat(mobile): reveal reminder row actions by swiping (R2, R3, R4, R5, R6, R8, R9, R10, R11) |
| R2 | `screens/reminders/index.test.tsx::#228 R2: la fila del dueño va dentro de su deslizable con el panel a la derecha y sin rebote` | `0f4344d3` test(mobile): owner reminder rows sit inside a swipeable (R2); `b28b74f6` feat(mobile): reveal reminder row actions by swiping (R2, R3, R4, R5, R6, R8, R9, R10, R11) |
| R3 | `screens/reminders/index.test.tsx::#228 R3: el panel de %s pinta la receta del canvas y se oculta a los lectores de pantalla` | `96927b77` test(mobile): swipe panel follows the canvas recipe and hides from screen readers (R3); `b28b74f6` feat(mobile): reveal reminder row actions by swiping (R2, R3, R4, R5, R6, R8, R9, R10, R11) |
| R4 | `screens/reminders/index.test.tsx::#228 R4: pulsar el panel de un puntual cierra el deslizable y abre la hoja de borrar`; `screens/reminders/index.test.tsx::#228 R4: pulsar el panel de una serie cierra el deslizable y abre la hoja de Cancelar serie` | `69f758e7` test(mobile): pressing the swipe panel closes it and opens its sheet (R4); `b28b74f6` feat(mobile): reveal reminder row actions by swiping (R2, R3, R4, R5, R6, R8, R9, R10, R11) |
| R5 | `screens/reminders/index.test.tsx::#228 R5: la fila de %s expone su acción de accesibilidad y abre la misma hoja`; `screens/reminders/index.test.tsx::#228 R5: la fila retira su acción de accesibilidad mientras su borrado sigue pendiente` | `37ebaf21` test(mobile): reminder rows expose their action to accessibility (R5); `b28b74f6` feat(mobile): reveal reminder row actions by swiping (R2, R3, R4, R5, R6, R8, R9, R10, R11) |
| R6 | `screens/reminders/index.test.tsx::#228 R6: las filas pasadas también se deslizan y solo la fila va atenuada` | `7528a9d6` test(mobile): past reminder rows swipe too (R6); `b28b74f6` feat(mobile): reveal reminder row actions by swiping (R2, R3, R4, R5, R6, R8, R9, R10, R11) |
| R7 | `screens/reminders/index.test.tsx::#228 R7: quien no es dueño no tiene deslizable, panel ni acción de accesibilidad` | `2d9b5ced` test(mobile): non-owner rows have no swipe actions (R7) |
| R8 | `screens/reminders/index.test.tsx::#228 R8: la fila ya no lleva botón de texto` | `b5c90a30` test(mobile): reminder rows drop the text button (R8); `b28b74f6` feat(mobile): reveal reminder row actions by swiping (R2, R3, R4, R5, R6, R8, R9, R10, R11) |
| R9 | `screens/reminders/index.test.tsx::#228 R9: con el ReanimatedSwipeable real la fila y su panel se montan y el panel abre la hoja` | `cd5d19c7` test(mobile): real swipeable mounts the row and its panel (R9); `b28b74f6` feat(mobile): reveal reminder row actions by swiping (R2, R3, R4, R5, R6, R8, R9, R10, R11) |
| R10 | `__tests__/reminder-swipe-actions-canvas-fidelity.test.ts::#228 R10: %s sigue al artboard %s`; `__tests__/reminder-swipe-actions-canvas-fidelity.test.ts::#228 R10: los tokens rosa y danger del canvas son los de global.css` | `8bd01469` test(mobile): copy, canvas fidelity and source inventory of reminder swipe actions (R1, R10, R11); `b28b74f6` feat(mobile): reveal reminder row actions by swiping (R2, R3, R4, R5, R6, R8, R9, R10, R11) |
| R11 | `__tests__/reminder-swipe-actions-canvas-fidelity.test.ts::#228 R11: inventario del fuente` | `8bd01469` test(mobile): copy, canvas fidelity and source inventory of reminder swipe actions (R1, R10, R11); `b28b74f6` feat(mobile): reveal reminder row actions by swiping (R2, R3, R4, R5, R6, R8, R9, R10, R11) |
| R12 | `__tests__/reminder-swipe-actions-canvas-fidelity.test.ts::#228 R12: la carta lleva una vez el bloque de su enmienda` | `c3b0f7c2` test(mobile): charter carries the swipe actions amendment (R12); `3f07668d` docs(ui): add the swipe actions amendment to the charter (R12) |
| R13 | `__tests__/reminder-swipe-actions-canvas-fidelity.test.ts::#228 R13: los candados enmendados nombran su enmienda y las specs enmendadas llevan su casilla` | `85996775` test(mobile): amended locks name their amendment (R13); `a34a7bee` test(mobile): suffix amended locks with #228 R13 (R13) |

Regla: el reviewer no aprueba si alguna fila queda "pendiente". R12 es la
excepción mientras la casilla G4 de [[requirements]] §Aprobación siga sin
marcar: su fila queda «pendiente (bloqueado por G4)» y la feature no pasa a
`done` hasta cerrarla.
Convención de commit: `feat(<scope>): <desc> (R1,R2)`.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).

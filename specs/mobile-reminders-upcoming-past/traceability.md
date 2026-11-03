---
feature: "mobile-reminders-upcoming-past"
status: draft        # draft | approved
tags: [mobile, ui, spec]
---

# Trazabilidad — [[mobile-reminders-upcoming-past]] (#227)

Rutas relativas a `mobile-pet-tracker/src/`.

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | pendiente: `__tests__/reminders-upcoming-past-canvas-fidelity.test.ts::#227 R1: las cuatro claves existen en es y en con su literal, una invocación cada una y su fila en §2.40` | pendiente |
| R2 | pendiente: `utils/reminder-dates.test.ts::#227 R2: %s` | pendiente |
| R3 | pendiente: `utils/reminder-dates.test.ts::#227 R3: ordena próximos ascendente y pasados descendente, con empate por id` | pendiente |
| R4 | pendiente: `screens/reminders/index.test.tsx::#227 R4: pinta «Próximos» y debajo sus filas en orden ascendente` | pendiente |
| R5 | pendiente: `screens/reminders/index.test.tsx::#227 R5: «Pasados» empieza colapsada con su contador y el chevron abajo`; `screens/reminders/index.test.tsx::#227 R5: sin pasados no pinta la sección` | pendiente |
| R6 | pendiente: `screens/reminders/index.test.tsx::#227 R6: el encabezado alterna «Pasados» y sus filas van atenuadas de la más reciente a la más antigua` | pendiente |
| R7 | pendiente: `screens/reminders/index.test.tsx::#227 R7: la opacidad sigue a la sección y el resto de la fila sigue al status` | pendiente |
| R8 | pendiente: `screens/reminders/index.test.tsx::#227 R8: sin próximos pinta la caja «Nada pendiente por ahora» encima de «Pasados»` | pendiente |
| R9 | pendiente: `screens/reminders/index.test.tsx::#227 R9: sin recordatorios conserva el vacío sin secciones` (nace verde; sonda de mutación en el reporte) | pendiente |
| R10 | pendiente: `theme/__tests__/motion.test.ts::#227 R10: declara el paso de 30 ms de las filas pasadas`; `screens/reminders/index.test.tsx::#227 R10: escalona los próximos cada 70 ms y los pasados cada 30 ms desde 0` | pendiente |
| R11 | pendiente: `__tests__/reminders-upcoming-past-canvas-fidelity.test.ts::#227 R11: %s`; `__tests__/reminders-upcoming-past-canvas-fidelity.test.ts::#227 R11: inventario del fuente` | pendiente |
| R12 | pendiente: `screens/reminders/index.test.tsx::#227 R12: Eliminar y Cancelar serie siguen en su fila en las dos secciones y solo para el dueño` | pendiente |
| R13 | pendiente: `__tests__/reminders-upcoming-past-canvas-fidelity.test.ts::#227 R13: los candados enmendados nombran su enmienda y las specs enmendadas llevan su casilla`, más la suite completa en verde (`./init.sh`, la corre el leader) | pendiente |

Regla: el reviewer no aprueba si alguna fila queda "pendiente".
Convención de commit: `feat(<scope>): <desc> (R1,R2)`.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).

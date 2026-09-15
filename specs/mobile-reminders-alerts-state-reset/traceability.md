---
feature: "mobile-reminders-alerts-state-reset"
status: approved   # aprobada por humano en da957174 (gate de requirements.md)
tags: [harness, spec, mobile]
---

# Trazabilidad — [[mobile-reminders-alerts-state-reset]]

Commit base: `0e4aa810`
(`Merge pull request #136 … docs/97-reminders-alerts-state-reset`).

Los `describe` llevan el **prefijo de feature** porque los dos ficheros ya
acumulan R-ids de otras specs (`docs/conventions.md` §Prefijo de feature). Los
tests de `alerts` se referencian por título, **nunca por número de línea**: #72
va a mover ese fichero.

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `mobile-pet-tracker/src/screens/reminders/index.test.tsx::#97 R1: la confirmación de borrado no sobrevive a la pérdida de foco` | pendiente |
| R2 | `mobile-pet-tracker/src/screens/reminders/index.test.tsx::#97 R2: el error de acción no sobrevive a la pérdida de foco` | pendiente |
| R3 | `mobile-pet-tracker/src/screens/reminders/index.test.tsx::#97 R3: el guarda del borrado en vuelo sobrevive a la pérdida de foco` | pendiente |
| R4 | `mobile-pet-tracker/src/screens/alerts/index.test.tsx::#97 R4: el error del ack no sobrevive a la pérdida de foco` | pendiente |
| R5 | `mobile-pet-tracker/src/screens/alerts/index.test.tsx::#97 R5: el guarda del ack en vuelo sobrevive a la pérdida de foco` (dos `it`: comportamiento y fuente) | pendiente |
| R6 | `mobile-pet-tracker/src/screens/alerts/index.test.tsx::#97 R6: la alerta atendida sigue atendida al volver a la pantalla` | pendiente |
| R7 | `mobile-pet-tracker/src/screens/alerts/index.test.tsx::#97 R7: la lista se revalida al ganar el foco` | pendiente |
| R8 | `mobile-pet-tracker/src/screens/alerts/index.test.tsx::#97 R8: el overlay del ack caduca cuando la lista trae otro status` | pendiente |

Regla: el reviewer no aprueba si alguna fila queda "pendiente".
Convención de commit: `feat(reminders-alerts-state-reset): <desc> (R1,R2)`; el
commit rojo previo va como `test(reminders-alerts-state-reset): <desc> (R1)`.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida al
aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).

**R3, R5 y R6 son requisitos de verificación** ([[tasks]], vía de mutación de
C4): además del test y del commit, el reporte del reviewer debe recoger las
**cuatro** salidas de mutación de producción —`setDeletingId(null)` en el
cleanup de `RemindersScreen`; `setAckingId(null)` + `ackingIdRef.current = null`
y después **solo** `ackingIdRef.current = null` en el de `AlertsScreen`;
`setAcked({})` en el mismo— cada una con su rojo **por aserción** y su `git
diff` vacío tras revertir.

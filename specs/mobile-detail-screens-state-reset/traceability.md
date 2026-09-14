---
feature: "mobile-detail-screens-state-reset"
status: draft        # draft | approved
tags: [harness, spec, mobile]
---

# Trazabilidad — [[mobile-detail-screens-state-reset]]

Commit base: `f50b4203` (`chore(harness): registra baseline verde de #63`).

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | pendiente | pendiente |
| R2 | pendiente | pendiente |
| R3 | pendiente | pendiente |
| R4 | pendiente | pendiente |
| R5 | pendiente | pendiente |
| R6 | pendiente | pendiente |
| R7 | pendiente | pendiente |

Regla: el reviewer no aprueba si alguna fila queda "pendiente".
Convención de commit: `feat(<scope>): <desc> (R1,R2)`; el commit rojo previo va
como `test(<scope>): <desc> (R1)`.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).

**R7 es requisito de verificación** ([[tasks]] §R7, vía (b) de C4): su fila
registra el test y el commit que lo introduce, y el reporte del reviewer debe
recoger además la salida de las **dos** mutaciones de producción
(`setSubmitting(false)` en `AddReminderContent`, `setClaiming(false)` en
`resetPairingState`) con su rojo por aserción y su `git diff` vacío tras
revertir.

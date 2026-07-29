---
feature: "<feature-name>"
status: draft        # draft | approved
tags: [harness, spec]
---

# Trazabilidad — [[<feature-name>]]

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | pendiente | pendiente |

Regla: el reviewer no aprueba si alguna fila queda "pendiente".
Convención de commit: `feat(<scope>): <desc> (R1,R2)`.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).

---
feature: "reminders-api"
status: draft        # draft | approved
tags: [harness, spec, backend]
---

# Trazabilidad — [[reminders-api]]

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | pendiente | pendiente |
| R2 | pendiente | pendiente |
| R3 | verificación manual (lint/test/test:e2e/init.sh + grep de diff del reviewer) | pendiente |

Regla: el reviewer no aprueba si alguna fila queda "pendiente".
Convención de commit: `feat(reminders-api): <desc> (R1)`.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).

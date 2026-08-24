---
feature: "reminders-api"
status: draft        # draft | approved
tags: [harness, spec, backend]
---

# Trazabilidad — [[reminders-api]]

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `list-reminders.use-case.spec.ts::R1: ListRemindersUseCase delega en listByPet`; `pet-reminders.e2e-spec.ts::R1: GET lista todos los reminders de la mascota por dueAt` | `b469cf9 test(reminders-api): define reminder listing in red (R1)`; `c2fa98c feat(reminders-api): list reminders by pet (R1)` |
| R2 | pendiente | pendiente |
| R3 | verificación manual (lint/test/test:e2e/init.sh + grep de diff del reviewer) | pendiente |

Regla: el reviewer no aprueba si alguna fila queda "pendiente".
Convención de commit: `feat(reminders-api): <desc> (R1)`.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).

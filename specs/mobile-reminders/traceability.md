---
feature: "mobile-reminders"
status: draft        # draft | approved
tags: [harness, spec, mobile]
---

# Trazabilidad — [[mobile-reminders]]

> Renumerada el 2026-08-24 tras el gate humano (el antiguo R1 de GET
> backend se movió a #47 `specs/reminders-api/`; borrado por DELETE;
> entrada por Profile; picker nativo). La spec estaba en draft: la
> renumeración es válida (los R-id son inmutables solo tras aprobación).

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `src/api/__tests__/reminders.test.ts::R1: listReminders mapea la respuesta por kind` | `377cdef test(mobile-reminders): define reminder listing in red (R1)`; `8e6ae26 feat(mobile-reminders): list reminders by pet (R1)` |
| R2 | `src/api/__tests__/reminders.test.ts::R2: createReminder publica y mapea por kind` | `9ecd3c5 test(mobile-reminders): define reminder creation in red (R2)`; `e7b8c5c feat(mobile-reminders): create reminders (R2)` |
| R3 | pendiente | pendiente |
| R4 | pendiente | pendiente |
| R5 | pendiente | pendiente |
| R6 | pendiente | pendiente |
| R7 | pendiente | pendiente |
| R8 | pendiente | pendiente |
| R9 | pendiente | pendiente |
| R10 | pendiente | pendiente |
| R11 | verificación manual (typecheck/lint/tests/init.sh + greps del reviewer) | pendiente |
| R12 | smoke humano en Expo Go (checklist en requirements) | pendiente |

Regla: el reviewer no aprueba si alguna fila queda "pendiente".
Convención de commit: `feat(mobile-reminders): <desc> (R1,R2)`.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).

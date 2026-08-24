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
| R3 | `src/api/__tests__/reminders.test.ts::R3: deleteReminder borra y mapea por kind` | `0cac973 test(mobile-reminders): define reminder deletion in red (R3)`; `1bf95a9 feat(mobile-reminders): delete reminders (R3)` |
| R4 | `src/utils/reminder-dates.test.ts::R4: reminder-dates combina y cuenta días` | `4e39f3d test(mobile-reminders): define reminder dates in red (R4)`; `d0b9d92 feat(mobile-reminders): add reminder date helpers (R4)` |
| R5 | `src/screens/reminders/index.test.tsx::R5: reminders monta con métricas y estados` | `847996a test(mobile-reminders): define reminders screen states in red (R5)`; `bb40613 feat(mobile-reminders): add reminder list states (R5)` |
| R6 | `src/screens/reminders/index.test.tsx::R6: lista con pills, badges y refetch on focus` | `b6621a2 test(mobile-reminders): define reminder rows in red (R6)`; `16940ae feat(mobile-reminders): render reminder summaries and rows (R6)` |
| R7 | `src/screens/reminders/index.test.tsx::R7: borrar recordatorio con confirmación` | `70c645a test(mobile-reminders): define reminder deletion UI in red (R7)`; `c343cb8 feat(mobile-reminders): delete reminders from list (R7)` |
| R8 | `src/screens/add-reminder/index.test.tsx::R8: formulario de alta con chips y pickers` | `cb2b566 test(mobile-reminders): define add reminder form in red (R8)`; `50ec673 feat(mobile-reminders): add reminder form and native pickers (R8)` |
| R9 | pendiente | pendiente |
| R10 | pendiente | pendiente |
| R11 | verificación manual (typecheck/lint/tests/init.sh + greps del reviewer) | pendiente |
| R12 | smoke humano en Expo Go (checklist en requirements) | pendiente |

Regla: el reviewer no aprueba si alguna fila queda "pendiente".
Convención de commit: `feat(mobile-reminders): <desc> (R1,R2)`.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).

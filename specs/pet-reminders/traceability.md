---
feature: "pet-reminders"
status: draft        # draft | approved
tags: [harness, spec]
---

# Trazabilidad — [[pet-reminders]]

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `src/db/schema/reminders.schema.spec.ts::R1: tabla reminders y migracion 0011 aditiva` | rojo: `a834a82 test(pet-reminders): require reminders schema and migration (R1)`; verde: `9745aa8 feat(pet-reminders): add reminders table migration (R1)` |
| R2 | `test/pet-reminders.e2e-spec.ts::R2: POST crea reminder programado con shape exacto` | rojo: `5decc79 test(pet-reminders): require reminder creation endpoint (R2)`; verde: `aaf7788 feat(pet-reminders): create scheduled reminders (R2)` |
| R3 | `src/modules/reminders/application/dto/reminder.dto.spec.ts::R3: validacion estricta del POST de reminders` + `test/pet-reminders.e2e-spec.ts::R3: POST invalido responde 400 sin insertar` | rojo: `ef01906 test(pet-reminders): require strict creation validation (R3)`; verde: `a118440 feat(pet-reminders): validate reminder creation (R3)` |
| R4 | `test/pet-reminders.e2e-spec.ts::R4: POST usa PetAccessGuard y exige owner` | rojo: `f899527 test(pet-reminders): require owner access for creation (R4)`; verde: `713d285 feat(pet-reminders): enforce owner access on creation (R4)` |
| R5 | `src/modules/reminders/infrastructure/reminders-dispatch.service.spec.ts::R5: dispatcher encola vencidos una sola vez` | rojo: `0479f29 test(pet-reminders): require idempotent reminder dispatch (R5)`; verde: `c2e1e3e feat(pet-reminders): dispatch due reminders once (R5)` |
| R6 | `src/modules/reminders/infrastructure/reminders-dispatch.service.spec.ts::R6: dispatcher publica el mensaje reminder exacto` + `src/workers/notifier/notifier-consumer.service.spec.ts::R6 (pet-reminders #16): schema acepta el mensaje reminder` | rojo: `a58fbe3 test(pet-reminders): require reminder notification contract (R6)`; verde: `13f5859 feat(pet-reminders): add reminder notification contract (R6)` |
| R7 | `src/workers/notifier/notifier-consumer.service.spec.ts::R7 (pet-reminders #16): notifier procesa reminder idempotentemente` + `test/pet-reminders.e2e-spec.ts::R7: create, dispatch y notifier dejan sent sin duplicar push` | rojo: `355d5cc test(pet-reminders): require idempotent reminder delivery (R7)`; verde: `15b0274 feat(pet-reminders): deliver reminders idempotently (R7)`; compatibilidad de typecheck con tests alert congelados: `4f20037 fix(pet-reminders): preserve notifier alert compatibility (R7)` |
| R8 | `test/pet-reminders.e2e-spec.ts::R8: PATCH reprograma e invalida el mensaje anterior` | rojo: `1de5b67 test(pet-reminders): require safe reminder rescheduling (R8)`; verde: `f01d71a feat(pet-reminders): reschedule reminders safely (R8)` |
| R9 | `test/pet-reminders.e2e-spec.ts::R9: PATCH cancelled impide cualquier push` | rojo: `4179065 test(pet-reminders): require cancellation without delivery (R9)`; verde: `52821a3 feat(pet-reminders): cancel reminders safely (R9)` |
| R10 | `src/modules/reminders/application/use-cases/update-reminder.use-case.spec.ts::R10: UpdateReminderUseCase autoriza via reminder.petId` + `test/pet-reminders.e2e-spec.ts::R10: PATCH autoriza opacamente via reminder.petId` | rojo: `56fdd11 test(pet-reminders): require opaque update authorization (R10)`; verde: `7a29488 feat(pet-reminders): authorize reminder updates opaquely (R10)` |
| R11 | `src/modules/reminders/application/dto/reminder.dto.spec.ts::R11: validacion estricta del PATCH de reminders` + `src/modules/reminders/application/use-cases/update-reminder.use-case.spec.ts::R11: UpdateReminderUseCase rechaza reminders no editables` + `test/pet-reminders.e2e-spec.ts::R11: PATCH rechaza estado no editable y body invalido` | rojo: `e4fb8e4 test(pet-reminders): require strict safe reminder updates (R11)`; verde: `0e2419c feat(pet-reminders): reject invalid reminder updates (R11)` |
| R12 | `src/modules/reminders/infrastructure/reminders-scheduler.service.spec.ts::R12: scheduler gateado por REMINDERS_ENABLED y NODE_ENV` | rojo: `ef91e6c test(pet-reminders): require gated reminder scheduler (R12)`; verde: `6147f96 feat(pet-reminders): gate local reminder scheduling (R12)` |

Regla: el reviewer no aprueba si alguna fila queda "pendiente".
Convención de commit: `feat(pet-reminders): <desc> (R1,R2)`.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).
Los tests escritos en archivos de `src/workers/notifier/` nombran el requisito
como `R<n> (pet-reminders #16): ...` (colisión de R-ids con #13, ver
[[requirements]]).

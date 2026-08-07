---
feature: "alerts-engine"
status: draft        # draft | approved
tags: [harness, spec]
---

# Trazabilidad — [[alerts-engine]]

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | alerts.schema.spec.ts::R1 | b4448ca feat(alerts-engine): alert_events table with anti-spam unique index (R1,R2) |
| R2 | alerts.schema.spec.ts::R2 | b4448ca feat(alerts-engine): alert_events table with anti-spam unique index (R1,R2) |
| R3 | provisioning.geofence-events.spec.ts::R3 | 2ba4502 feat(alerts-engine): geofence-events queue, DLQ and EventBridge rule provisioning (R3,R4) |
| R4 | provisioning.geofence-events.spec.ts::R4 | 2ba4502 feat(alerts-engine): geofence-events queue, DLQ and EventBridge rule provisioning (R3,R4) |
| R5 | alerts-engine-consumer.service.spec.ts::R5 | 193ff9d feat(alerts-engine): geofence-events consumer, worker module and scheduler (R5-R17) |
| R6 | alerts-engine-consumer.service.spec.ts::R6 | 193ff9d feat(alerts-engine): geofence-events consumer, worker module and scheduler (R5-R17) |
| R7 | alerts-engine-consumer.service.spec.ts::R7 | 193ff9d feat(alerts-engine): geofence-events consumer, worker module and scheduler (R5-R17) |
| R8 | alerts-engine-consumer.service.spec.ts::R8 | 193ff9d feat(alerts-engine): geofence-events consumer, worker module and scheduler (R5-R17) |
| R9 | alerts-engine-consumer.service.spec.ts::R9 | 193ff9d feat(alerts-engine): geofence-events consumer, worker module and scheduler (R5-R17) |
| R10 | alerts-engine-consumer.service.spec.ts::R10 | 193ff9d feat(alerts-engine): geofence-events consumer, worker module and scheduler (R5-R17) |
| R11 | alerts-engine-consumer.service.spec.ts::R11 | 193ff9d feat(alerts-engine): geofence-events consumer, worker module and scheduler (R5-R17) |
| R12 | alerts-engine-consumer.service.spec.ts::R12 | 193ff9d feat(alerts-engine): geofence-events consumer, worker module and scheduler (R5-R17) |
| R13 | alerts-engine-consumer.service.spec.ts::R13 | 193ff9d feat(alerts-engine): geofence-events consumer, worker module and scheduler (R5-R17) |
| R14 | alerts-engine-consumer.service.spec.ts::R14 | 193ff9d feat(alerts-engine): geofence-events consumer, worker module and scheduler (R5-R17) |
| R15 | alerts-engine-consumer.service.spec.ts::R15 | 193ff9d feat(alerts-engine): geofence-events consumer, worker module and scheduler (R5-R17) |
| R16 | alerts-engine-consumer.service.spec.ts::R16 | 193ff9d feat(alerts-engine): geofence-events consumer, worker module and scheduler (R5-R17) |
| R17 | alerts-engine-scheduler.service.spec.ts::R17 | 193ff9d feat(alerts-engine): geofence-events consumer, worker module and scheduler (R5-R17) |
| R18 | test/alerts-engine.e2e-spec.ts::R18 | df1270f test(alerts-engine): e2e over Postgres/LocalStack and R19 static purity guard (R18,R19) |
| R19 | geofence-eval-untouched.spec.ts::R19 | df1270f test(alerts-engine): e2e over Postgres/LocalStack and R19 static purity guard (R18,R19) |
| R20 | verificado con `git diff main HEAD --name-only` (ver progress/impl_alerts-engine.md) | (verificación manual, sin commit de test — ver nota en tasks.md) |

Regla: el reviewer no aprueba si alguna fila queda "pendiente".
Convención de commit: `feat(<scope>): <desc> (R1,R2)`.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).

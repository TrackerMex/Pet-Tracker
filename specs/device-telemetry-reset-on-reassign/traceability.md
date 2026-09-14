---
feature: "device-telemetry-reset-on-reassign"
status: approved     # draft | approved
tags: [harness, spec]
---

# Trazabilidad — [[device-telemetry-reset-on-reassign]]

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | pendiente — esperado: `backend-pet-tracker/test/devices.e2e-spec.ts :: #92 R1: el claim deja battery_pct y last_message_at en NULL y el 201 refleja la fila persistida` (`it` (a) fila sembrada, `it` (b) ciclo A → release → B) + `backend-pet-tracker/src/modules/devices/application/use-cases/claim-device.use-case.spec.ts :: #92 R1: execute devuelve la entidad que claim() persistió, no el snapshot previo` | pendiente — rojo `test(device-telemetry-reset-on-reassign): … (R1)`; verde `feat(device-telemetry-reset-on-reassign): … (R1)`; docs `docs(device-telemetry-reset-on-reassign): … (R1)` |
| R2 | pendiente — requisito de verificación (C4 vía (b)): aserción final del `it` (a) de R1 (`batteryPct === 80`, `connectivity === 'online'`, `lastMessageAt` ISO) + sonda de mutación sobre `ingestion.drizzle.store.ts:104` en `progress/impl_device-telemetry-reset-on-reassign.md` §R2; candado hermano `test/ingestion.e2e-spec.ts:220` (#8 R19) | sin hash de test propio; evidencia en el impl §R2 |
| R3 | pendiente — requisito de verificación: `./init.sh` exit 0 sin pipe + `git diff --stat origin/main` limitado a [[design]] §Archivos afectados, en el impl §R3; delta único `claim-device.use-case.spec.ts:64` | sin hash de test propio; evidencia en el impl §R3 |

Regla: el reviewer no aprueba si alguna fila queda "pendiente".
Convención de commit: `feat(<scope>): <desc> (R1,R2)`; aquí
`test(device-telemetry-reset-on-reassign): … (Rn)` para el rojo y
`feat|docs(device-telemetry-reset-on-reassign): … (Rn)` para el verde.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).

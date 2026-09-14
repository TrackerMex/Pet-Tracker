---
feature: "device-telemetry-reset-on-reassign"
status: approved     # draft | approved
tags: [harness, spec]
---

# Trazabilidad — [[device-telemetry-reset-on-reassign]]

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `backend-pet-tracker/test/devices.e2e-spec.ts :: #92 R1: el claim deja battery_pct y last_message_at en NULL y el 201 refleja la fila persistida` (`it` (a) fila sembrada, `it` (b) ciclo A → release → B) + `backend-pet-tracker/src/modules/devices/application/use-cases/claim-device.use-case.spec.ts :: #92 R1: execute devuelve la entidad que claim() persistió, no el snapshot previo` | rojo `4160f514` — `test(device-telemetry-reset-on-reassign): claim clears inherited telemetry (R1)`; verde `f1f44880` — `feat(device-telemetry-reset-on-reassign): reset device telemetry on claim and return persisted row (R1)`; docs `3328c0dc` — `docs(device-telemetry-reset-on-reassign): note telemetry reset on claim (R1)` |
| R2 | Requisito de verificación (C4 vía (b)): aserción final del `it` (a) de R1 (`batteryPct === 80`, `connectivity === 'online'`, `lastMessageAt` ISO) + sonda de mutación sobre `ingestion.drizzle.store.ts:104` en `progress/impl_device-telemetry-reset-on-reassign.md` §R2; candado hermano `test/ingestion.e2e-spec.ts:220` (#8 R19) | Aserción versionada en el rojo `4160f514`; sin hash de test propio; sonda y restauración documentadas en el impl §R2 |
| R3 | Requisito de verificación: `./init.sh` exit 0 sin pipe + `git diff --stat` en `progress/impl_device-telemetry-reset-on-reassign.md` §R3; delta único de candado en `claim-device.use-case.spec.ts:64` | Sin hash de test propio; cierre verde y alcance documentados en el impl §R3. El delta de implementación contra el handoff `e753b19d` contiene solo los 10 ficheros de [[design]]; el diff contra `origin/main` añade los 6 ficheros de spec/handoff ya presentes |

Regla: el reviewer no aprueba si alguna fila queda "pendiente".
Convención de commit: `feat(<scope>): <desc> (R1,R2)`; aquí
`test(device-telemetry-reset-on-reassign): … (Rn)` para el rojo y
`feat|docs(device-telemetry-reset-on-reassign): … (Rn)` para el verde.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).

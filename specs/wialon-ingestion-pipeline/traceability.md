---
feature: "wialon-ingestion-pipeline"
status: spec_ready   # draft | spec_ready (pendiente gate humano) | approved
tags: [harness, spec]
---

# Trazabilidad — [[wialon-ingestion-pipeline]]

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | src/integrations/wialon/wialon.factory.spec.ts::R1: el factory resuelve WIALON_CLIENT con fake por default y http solo con SIM_MODE=false + token real | `8284a0f` feat(wialon-ingestion-pipeline): wialon client port and config-driven factory (R1) |
| R2 | src/integrations/wialon/fake-wialon.client.spec.ts::R2: fake determinista — misma semilla+intervalo => mismas posiciones; un punto por slot de 30 s; unitIds del seed | `0098847` feat(wialon-ingestion-pipeline): deterministic slot-indexed fake wialon client (R2) |
| R3 | src/integrations/wialon/fake-wialon.client.spec.ts::R3: paseo realista — arranque en casa, <=8 km/h salvo saltos, ruido ~10 m, duplicado exacto, salto >60 km/h y bateria decreciente | `9be3159` feat(wialon-ingestion-pipeline): realistic walk with injected anomalies and battery drain (R3) |
| R4 | pendiente | pendiente |
| R5 | pendiente | pendiente |
| R6 | pendiente | pendiente |
| R7 | pendiente | pendiente |
| R8 | pendiente | pendiente |
| R9 | pendiente | pendiente |
| R10 | pendiente | pendiente |
| R11 | pendiente | pendiente |
| R12 | pendiente | pendiente |
| R13 | pendiente | pendiente |
| R14 | pendiente | pendiente |
| R15 | pendiente | pendiente |
| R16 | pendiente | pendiente |
| R17 | pendiente | pendiente |
| R18 | pendiente | pendiente |
| R19 | pendiente | pendiente |

Regla: el reviewer no aprueba si alguna fila queda "pendiente".
Convención de commit: `feat(<scope>): <desc> (R1,R2)`.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).

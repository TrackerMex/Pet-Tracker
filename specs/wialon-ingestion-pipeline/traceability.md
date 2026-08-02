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
| R4 | src/integrations/wialon/wialon-http.client.spec.ts::R4: WialonHttpClient mapea la respuesta real (pos.y/x/s/c/sc) y {error: N} => WialonApiError tipado | `3eaecb5` feat(wialon-ingestion-pipeline): wialon http client with typed domain errors (R4) |
| R5 | src/pipeline/validate-positions.spec.ts::R5: normalize() descarta (0,0)/fuera de rango/sin ts/duplicados, ordena y reporta discarded; 100% puro | `59baab3` feat(wialon-ingestion-pipeline): pure normalize() with discard reasons and ordering (R5) |
| R6 | src/pipeline/validate-positions.spec.ts::R6: flags suspect_jump (>60 km/h, no descarta) y low_accuracy (>100 m o <4 sats) | `36fd6fd` feat(wialon-ingestion-pipeline): quality flags and named thresholds in pipeline core (R6) |
| R7 | src/pipeline/validate-positions.spec.ts::R7: fixture walk.json (~200 puntos del fake) + casos borde | `bc7b5fe` feat(wialon-ingestion-pipeline): walk.json fixture and pipeline edge cases (R7) |
| R8 | src/workers/ingestion-scheduler.service.spec.ts::R8: scheduling gated — cron solo con POLLER_ENABLED=true y NODE_ENV distinto de test; runOnce() invocable | `e178dee` feat(wialon-ingestion-pipeline): gated scheduling shell for ingestion workers (R8) |
| R9 | src/workers/poller.service.spec.ts::R9: poller — asignaciones activas -> getMessages(unitId, watermark, now) -> SQS {version:1,...} en lotes <=100 | `f5c643d` feat(wialon-ingestion-pipeline): poller cycle publishing raw positions to SQS (R9) |
| R10 | src/workers/poller.service.spec.ts::R10: watermark avanza tras publicar y solo si hubo mensajes; fallo de publicacion no avanza | `bc3144f` feat(wialon-ingestion-pipeline): advance watermark only after successful publish (R10) |
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

---
feature: "wialon-ingestion-pipeline"
status: spec_ready   # draft | spec_ready (pendiente gate humano) | approved
tags: [harness, spec]
---

# Tareas — [[wialon-ingestion-pipeline]]

> Disciplina TDD. Cada tarea corresponde a un requisito de [[requirements]] y
> tiene siempre los mismos 3 sub-items, en este orden.
> Cada test nombra su R-id (`describe('R5: ...')`, ver `docs/conventions.md` §Tests).
> Branch: `feature/8-wialon-ingestion-pipeline`.

## R1 — Factory resuelve WIALON_CLIENT: fake por default / WialonHttpClient solo con SIM_MODE=false + token real

- [ ] (1) Escribir test que falla para R1
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R2 — Fake determinista: misma semilla+intervalo ⇒ mismas posiciones; un punto por slot de 30 s; unitIds de SIMULATED_DEVICES

- [ ] (1) Escribir test que falla para R2
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R3 — Fake genera paseo realista con ≥1 duplicado exacto, ≥1 salto >60 km/h y batería decreciente

- [ ] (1) Escribir test que falla para R3
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R4 — WialonHttpClient mapea fixture real (pos.y/x/s/c/sc) y {error: N} → WialonApiError tipado

- [ ] (1) Escribir test que falla para R4
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R5 — normalize(): descarta (0,0)/fuera de rango/sin ts/duplicados, ordena, reporta discarded; 100% puro

- [ ] (1) Escribir test que falla para R5
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R6 — Flags suspect_jump (>60 km/h, no descarta) y low_accuracy (>100 m o <4 sats); umbrales en pipeline/constants.ts

- [ ] (1) Escribir test que falla para R6
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R7 — Fixture walk.json (~200 puntos) + bordes: vacía, un punto, todos inválidos

- [ ] (1) Escribir test que falla para R7
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R8 — Scheduling gated: cron 1 min solo con POLLER_ENABLED=true y NODE_ENV≠test; runOnce() invocable

- [ ] (1) Escribir test que falla para R8
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R9 — Poller: asignaciones activas → getMessages(unitId, watermark, now) → SQS body {version:1,...} en lotes ≤100; watermark NULL → lookback 10 min

- [ ] (1) Escribir test que falla para R9
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R10 — Watermark avanza tras publicar y solo si hubo mensajes; fallo de publicación no avanza

- [ ] (1) Escribir test que falla para R10
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R11 — Aislamiento: error por device no aborta el ciclo; LocalStack caído no tumba el proceso; sin solape de ciclos

- [ ] (1) Escribir test que falla para R11
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R12 — Consumer: long-polling batch ≤10, zod, delete por mensaje procesado; mensaje fallido no envenena el lote; drainOnce()

- [ ] (1) Escribir test que falla para R12
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R13 — Escritura DynamoDB: pk PET#<petId>, sk device_ts, atributos data-model, expires_at en segundos; dedupe por sk intra-batch; reproceso idempotente

- [ ] (1) Escribir test que falla para R13
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R14 — Caché devices + pets.last_position con la última aceptada, solo si ts entrante es más reciente

- [ ] (1) Escribir test que falla para R14
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R15 — Asignación liberada: escribe histórico en DynamoDB pero no toca caché ni emite eventos

- [ ] (1) Escribir test que falla para R15
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R16 — position.updated: un evento por mensaje, detail {version:1, petId, deviceId, position, batteryPct} (contrato congelado)

- [ ] (1) Escribir test que falla para R16
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R17 — battery.low solo en cruce descendente del umbral 20 (flanco vs devices.battery_pct previo)

- [ ] (1) Escribir test que falla para R17
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R18 — Malformado: log + no-delete → redrive (3 recepciones) lo mueve a la DLQ; DLQ en 0 en operación normal

- [ ] (1) Escribir test que falla para R18
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R19 — e2e: claim ACT-001 + SIM_MODE=true + runOnce() + drainOnce() → items en PET#<petId>, last_position actualizado, DLQ 0

- [ ] (1) Escribir test que falla para R19
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## Cierre (sin R-id, obligatorio antes del PR)

- [ ] Env vars de D11 en `docs/conventions.md` (tabla) y `.env.example` — en el mismo commit que las introduce en código
- [ ] `docs/wialon-module.md` creado (D1) con interfaz, API real, simulador, watermark y umbrales
- [ ] Evidencia manual en `progress/impl_wialon-ingestion-pipeline.md`: corrida real con cron (~2 min) y DLQ en 0
- [ ] `graphify update .` tras los cambios de código

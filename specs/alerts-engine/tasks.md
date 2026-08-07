---
feature: "alerts-engine"
status: approved     # draft | approved
tags: [harness, spec]
---

# Tareas — [[alerts-engine]]

> Disciplina TDD. Cada tarea corresponde a un requisito de [[requirements]] y
> tiene siempre los mismos 3 sub-items, en este orden. Ver [[design]] para
> el orden de capas sugerido (schema → infra AWS → store → consumer →
> scheduler → e2e) — no es obligatorio implementar los R en orden numérico,
> pero R1/R2 (schema) y R3/R4 (infra) son prerequisito natural del resto.

## R1 — Tabla `alert_events` (columnas, FK, CHECK)

- [ ] (1) Escribir test que falla para R1
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R2 — Índice único parcial anti-spam

- [ ] (1) Escribir test que falla para R2
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R3 — Cola SQS `geofence-events` + DLQ, aprovisionamiento idempotente

- [ ] (1) Escribir test que falla para R3
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R4 — Regla EventBridge + target SQS, aprovisionamiento idempotente

- [ ] (1) Escribir test que falla para R4
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R5 — Recepción y parseo del sobre EventBridge (malformado → sin delete)

- [ ] (1) Escribir test que falla para R5
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R6 — Despacho por `detail-type`

- [ ] (1) Escribir test que falla para R6
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R7 — Evaluación por geocerca activa (evaluate(), guard de ts más reciente)

- [ ] (1) Escribir test que falla para R7
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R8 — `exit`: INSERT anti-spam → notifica solo si tomó efecto → persiste estado

- [ ] (1) Escribir test que falla para R8
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R9 — `enter`: UPDATE condicional a closed → notifica solo si afectó fila

- [ ] (1) Escribir test que falla para R9
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R10 — `event: null` (incluye unknown→estado inicial y low_accuracy): solo persiste estado

- [ ] (1) Escribir test que falla para R10
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R11 — Cierre de `battery_low` con batería ≥30 en `position.updated`

- [ ] (1) Escribir test que falla para R11
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R12 — Apertura de `battery_low` desde mensaje `battery.low`

- [ ] (1) Escribir test que falla para R12
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R13 — Escenario completo exit/exit/enter → 1 open, 1 resolved

- [ ] (1) Escribir test que falla para R13
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R14 — Idempotencia ante redelivery del mismo mensaje

- [ ] (1) Escribir test que falla para R14
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R15 — Shape congelado del mensaje `notifications`

- [ ] (1) Escribir test que falla para R15
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R16 — Error no controlado: mensaje sin borrar, redelivery vía DLQ

- [ ] (1) Escribir test que falla para R16
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R17 — Scheduler gateado por `ALERTS_ENGINE_ENABLED` (+ NODE_ENV=test)

- [ ] (1) Escribir test que falla para R17
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R18 — e2e determinista: salida simulada → open + mensaje en ≤2 ciclos

- [ ] (1) Escribir test que falla para R18
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R19 — Pureza: `geofence-eval.ts` sin modificar; `pipeline/constants.ts` solo +1

- [ ] (1) Escribir test que falla para R19 (verificación estática: diff/imports)
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R20 — No regresión: límites de archivos tocados

- [ ] (1) Escribir test que falla para R20 (o verificación con `git diff main --name-only`)
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

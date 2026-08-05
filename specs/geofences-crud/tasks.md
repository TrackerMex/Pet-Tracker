---
feature: "geofences-crud"
status: draft        # draft | approved
tags: [harness, spec]
---

# Tareas — [[geofences-crud]]

> Disciplina TDD. Cada tarea corresponde a un requisito de [[requirements]] y
> tiene siempre los mismos 3 sub-items, en este orden.
> Cada test nombra su R-id (`describe('R4: ...')`, ver `docs/conventions.md` §Tests).

## R1 — Migración crea `geofences` con CHECK de `type` restringido e índices `pet_id` / único `(pet_id, name)`

- [ ] (1) Escribir test que falla para R1
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R2 — Guard uniforme: mascota ajena/inexistente/malformada → 404 en las cinco rutas

- [ ] (1) Escribir test que falla para R2
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R3 — Rol distinto de owner en POST/PATCH/DELETE → 403 (404 de membresía precede); GET sin restricción de rol

- [ ] (1) Escribir test que falla para R3
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R4 — POST feliz: inserta con geofence_state unknown/null, audita geofence.create, responde 201

- [ ] (1) Escribir test que falla para R4
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R5 — POST inválido (radio fuera de 20-2000, type≠safe_circle, lat/lng fuera de rango, clave desconocida) → 400 sin persistir

- [ ] (1) Escribir test que falla para R5
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R6 — Sexta geocerca (activas+inactivas cuentan) → 400 MAX_GEOFENCES_REACHED sin persistir

- [ ] (1) Escribir test que falla para R6
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R7 — Nombre duplicado para la misma mascota → 409 GEOFENCE_NAME_TAKEN; carrera concurrente respaldada por índice único (23505 → 409)

- [ ] (1) Escribir test que falla para R7
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R8 — GET list → 200 array ordenado por created_at (incl. [] si no hay geocercas)

- [ ] (1) Escribir test que falla para R8
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R9 — GET detail → 200 con shape completo (incl. state anidado); id inexistente/malformado/ajeno → 404 GEOFENCE_NOT_FOUND

- [ ] (1) Escribir test que falla para R9
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R10 — PATCH parcial válido: merge de campos, audit geofence.update (solo nombres de campo), responde 200

- [ ] (1) Escribir test que falla para R10
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R11 — PATCH inválido (mismos límites que R5, incluida clave type) → 400 sin persistir

- [ ] (1) Escribir test que falla para R11
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R12 — PATCH sobre id inexistente/malformado/ajeno → 404 GEOFENCE_NOT_FOUND

- [ ] (1) Escribir test que falla para R12
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R13 — PATCH sin campos reconocidos → 200 no-op, sin escribir ni auditar (404 de R12 precede si no existe)

- [ ] (1) Escribir test que falla para R13
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R14 — DELETE → 204, hard delete, audit geofence.delete

- [ ] (1) Escribir test que falla para R14
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R15 — DELETE sobre id inexistente/malformado/ajeno → 404 GEOFENCE_NOT_FOUND sin auditar

- [ ] (1) Escribir test que falla para R15
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R16 — isInside círculo: haversine ≤ radiusM (borde inclusive)

- [ ] (1) Escribir test que falla para R16
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R17 — isInside polígono: ray-casting correcto para punto claramente dentro/fuera

- [ ] (1) Escribir test que falla para R17
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R18 — evaluate: estado previo unknown transiciona silenciosamente (event null) a inside/outside

- [ ] (1) Escribir test que falla para R18
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R19 — evaluate: inside→outside emite exit solo si distance≥radius×1.1 Y accuracy≤50m (o accuracy indefinida)

- [ ] (1) Escribir test que falla para R19
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R20 — evaluate: borde distance<radius×1.1 (ej. ×1.05) no dispara, sigue inside

- [ ] (1) Escribir test que falla para R20
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R21 — evaluate: accuracy>50m (no low_accuracy-flagged) bloquea el exit aunque distance≥radius×1.1

- [ ] (1) Escribir test que falla para R21
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R22 — evaluate: low_accuracy flagged congela state completo (incl. updatedAt), event null, cualquier estado previo

- [ ] (1) Escribir test que falla para R22
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R23 — evaluate: outside→outside (distance>radius×0.9) no re-emite, event null

- [ ] (1) Escribir test que falla para R23
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R24 — evaluate: outside→inside emite enter si distance≤radius×0.9, sin condición de accuracy

- [ ] (1) Escribir test que falla para R24
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R25 — geofence-eval.ts sin imports de framework/ORM/SDK; evaluate determinista (nowMs inyectado)

- [ ] (1) Escribir test que falla para R25
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R26 — No regresión: una sola migración, constants.ts solo añade, ningún otro módulo tocado, docs actualizados

- [ ] (1) Escribir test que falla para R26
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

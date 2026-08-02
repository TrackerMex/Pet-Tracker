---
feature: "devices-claim"
status: approved     # draft | approved
tags: [harness, spec]
---

# Tareas — [[devices-claim]]

> Disciplina TDD. Cada tarea corresponde a un requisito de [[requirements]] y
> tiene siempre los mismos 3 sub-items, en este orden.
> Cada test nombra su R-id (`describe('R3: ...')`, ver `docs/conventions.md` §Tests).

## R1 — Migración crea `devices` y `pet_devices` con índices parciales, sin tocar otras tablas

- [ ] (1) Escribir test que falla para R1
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R2 — `pnpm run seed:devices` siembra SIM-001..003 y es idempotente sin resetear devices asignados

- [ ] (1) Escribir test que falla para R2
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R3 — Claim feliz: transacción pet_devices + status 'assigned' + watermark now−10min → 201

- [ ] (1) Escribir test que falla para R3
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R4 — Body inválido (petId no-UUID, identificadores ≠ exactamente uno, >64 chars) → 400 sin efectos

- [ ] (1) Escribir test que falla para R4
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R5 — Claim sobre mascota inexistente o ajena → 404 genérico antes de consultar devices

- [ ] (1) Escribir test que falla para R5
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R6 — Claim de miembro con rol ≠ owner → 403 (404 de membresía precede)

- [ ] (1) Escribir test que falla para R6
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R7 — Identificador sin device → 404 DEVICE_NOT_FOUND

- [ ] (1) Escribir test que falla para R7
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R8 — Device con fila activa o 'inactive' → 409 DEVICE_ALREADY_ASSIGNED; carrera concurrente respaldada por índice único (23505 → 409)

- [ ] (1) Escribir test que falla para R8
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R9 — Mascota con collar activo → 409 PET_ALREADY_HAS_DEVICE

- [ ] (1) Escribir test que falla para R9
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R10 — Audit 'device.claim' tras commit (meta {petId}, nunca el identificador); sin audit si falla

- [ ] (1) Escribir test que falla para R10
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R11 — GET /v1/pets/:petId/device → 200 {model,batteryPct,connectivity,lastMessageAt,esn} | null; guard #5 en la ruta

- [ ] (1) Escribir test que falla para R11
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R12 — Perfil GET /v1/pets/:petId rellena la clave `device` (objeto de R11 o null) sin cambiar el contrato

- [ ] (1) Escribir test que falla para R12
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R13 — DELETE cierra released_at + status 'available' → 204, audit 'device.release', y el device es reclamable de nuevo

- [ ] (1) Escribir test que falla para R13
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R14 — DELETE sin collar activo → 404 DEVICE_NOT_ASSIGNED; rol ≠ owner → 403; sin membresía → 404 genérico

- [ ] (1) Escribir test que falla para R14
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R15 — Borrar mascota con collar activo deja el device reclamable (claim posterior → 201, e2e)

- [ ] (1) Escribir test que falla para R15
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

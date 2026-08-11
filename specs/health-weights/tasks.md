---
feature: "health-weights"
status: draft        # draft | approved
tags: [harness, spec]
---

# Tareas — [[health-weights]]

> Disciplina TDD (`docs/verification.md`). Cada tarea corresponde a un requisito
> de [[requirements]] y tiene siempre los mismos 3 sub-items, en este orden.
>
> **Cada test nombra su requisito con el sufijo de feature**:
> `describe('R<n> (health-weights #15): ...')`. El módulo `health` ya contiene
> R1..R13 de `health-vaccines` (#14); sin el sufijo, C4 de `CHECKPOINTS.md` no
> es verificable por grep.
>
> **Commits test-primero, uno por bloque rojo→verde.** `CHECKPOINTS.md` C4 exige
> que el historial muestre el patrón; meter tests + implementación + docs en un
> solo commit es motivo de rechazo del reviewer.
>
> El archivo e2e `test/health-weights.e2e-spec.ts` necesita Docker levantado
> (`docker compose up -d`).

## R1 — Tabla `weights`, índices y migración nueva

- [ ] (1) Escribir test que falla para R1 — `src/db/schema/weights.schema.spec.ts`
      (`getTableConfig(weights)`: columnas exactas, check
      `weights_body_condition_check`, índices; y que la migración que contiene
      `CREATE TABLE "weights"` no contiene `ALTER TABLE "pets"`)
- [ ] (2) Implementación mínima que lo pasa (`health.schema.ts` + `db:generate`)
- [ ] (3) Refactor con tests verdes — confirmar que
      `src/db/schema/health.schema.spec.ts` sigue verde (la migración `0009` no
      se toca)

## R2 — POST inserta y responde 201 con el shape congelado

- [ ] (1) Escribir test que falla para R2 — `test/health-weights.e2e-spec.ts`
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R3 — `current_weight_kg` solo si es la medición más reciente

- [ ] (1) Escribir test que falla para R3 — `test/health-weights.e2e-spec.ts`
      (tres casos: primera medición actualiza; retroactiva no pisa; empate de
      `measuredAt` sí pisa — verificados leyendo `GET /v1/pets/:petId`)
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R4 — Insert y update de `pets` en una sola transacción

- [ ] (1) Escribir test que falla para R4 —
      `src/modules/health/infrastructure/repositories/weight.drizzle.repository.spec.ts`
      (doble de Drizzle que captura que ambas sentencias corren dentro del
      callback de `db.transaction`; patrón de `pet.drizzle.repository.spec.ts`)
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R5 — Historial ordenado con `variation`

- [ ] (1) Escribir test que falla para R5 —
      `src/modules/health/application/weight-variation.spec.ts` (casos 0/1/2
      mediciones, `null` en la más antigua, redondeo a 2 decimales, desempate
      por id el mismo día) + `test/health-weights.e2e-spec.ts` (orden desc y
      `variation` no nula con `?limit=1` sobre 2 mediciones)
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R6 — `?limit=` con default 50, tope 100 y 400 en inválidos

- [ ] (1) Escribir test que falla para R6 — `test/health-weights.e2e-spec.ts`
      (`limit` ausente, `1`, `0`, `101`, `abc`, vacío, y parámetro desconocido)
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R7 — Validación del body: 400 sin persistir (fecha futura: tolerancia de 1 día)

- [ ] (1) Escribir test que falla para R7 — `test/health-weights.e2e-spec.ts`
      (`weightKg` 0 / negativo / 1000, `bodyCondition` 0 / 10 / 4.5,
      `measuredAt` `2026-02-30`, clave desconocida; en cada caso comprobar que
      no se creó fila ni cambió `currentWeightKg`). **Los tres bordes de fecha
      futura, con la fecha de hoy en UTC como referencia y sin fechas
      literales**: `hoy` → `201`, `hoy + 1` → `201`, `hoy + 2` → `400`
      (`MEASURED_AT_MAX_FUTURE_DAYS`, ver [[design]] D5)
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R8 — `PetAccessGuard` bloquea IDOR con 404 en POST y GET

- [ ] (1) Escribir test que falla para R8 — `test/health-weights.e2e-spec.ts`
      (usuario B sobre mascota de A, y `:petId` no-UUID)
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R9 — Owner muta, cualquier miembro activo lee

- [ ] (1) Escribir test que falla para R9 — `test/health-weights.e2e-spec.ts`
      (miembro `family` → 403 en POST, 200 en GET; no-miembro → 404 en ambas)
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R10 — Auditoría `weight.create`

- [ ] (1) Escribir test que falla para R10 —
      `src/modules/health/application/use-cases/create-weight.use-case.spec.ts`
      (una escritura fallida nunca audita) + `test/health-weights.e2e-spec.ts`
      (fila en `audit_log` con action/entity/entityId/meta.petId)
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## Cierre

- [ ] `./init.sh` verde (incluye e2e con Docker levantado)
- [ ] `specs/health-weights/traceability.md` sin filas "pendiente"
- [ ] `docs/data-model.md` fila `weights`: anotar la migración `0010`
- [ ] `progress/impl_health-weights.md` escrito

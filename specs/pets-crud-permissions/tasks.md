---
feature: "pets-crud-permissions"
status: approved        # draft | approved
tags: [harness, spec]
---

# Tareas — [[pets-crud-permissions]]

> Disciplina TDD. Cada tarea corresponde a un requisito de [[requirements]] y
> tiene siempre los mismos 3 sub-items, en este orden.

## Setup previo (no ligado a un único requisito)

No es TDD de un requisito puntual, pero bloquea a todos los R1-R16:

- [x] Crear el esqueleto de `modules/pets/` (capas de [[design]]) e
  importar `PetsModule` en `app.module.ts`
- [x] Definir `PET_REPOSITORY` + interface `PetRepository` en
  `domain/repositories/pet.repository.ts` y el tipo `PetRole` en
  `domain/entities/pet-membership.ts`
- [x] `pets.module.ts`: registrar providers (use cases, `{ provide:
  PET_REPOSITORY, useClass: PetDrizzleRepository }`, `PetAccessGuard`) y
  **exportar** guard, decorador y `PET_REPOSITORY` para features futuras

## R1 — Migración crea pets y pet_users (sin tocar audit_log)

- [x] (1) Escribir test que falla para R1
- [x] (2) Implementación mínima que lo pasa (schema + `drizzle-kit generate`)
- [x] (3) Refactor con tests verdes

## R2 — POST /v1/pets responde 201 con transacción pets + pet_users(owner)

- [x] (1) Escribir test que falla para R2 (incluye el caso de rollback:
  fallo del segundo insert no deja fila en pets)
- [x] (2) Implementación mínima que lo pasa
- [x] (3) Refactor con tests verdes

## R3 — Creación exitosa audita 'pet.create' vía AuditLogger

- [x] (1) Escribir test que falla para R3
- [x] (2) Implementación mínima que lo pasa
- [x] (3) Refactor con tests verdes

## R4 — Body inválido en POST /v1/pets responde 400 sin persistir

- [x] (1) Escribir test que falla para R4
- [x] (2) Implementación mínima que lo pasa
- [x] (3) Refactor con tests verdes

## R5 — birthDate XOR approxAgeMonths: ambos o ninguno responde 400

- [x] (1) Escribir test que falla para R5
- [x] (2) Implementación mínima que lo pasa
- [x] (3) Refactor con tests verdes

## R6 — ageMonths calculado (birth_date, o approx anclada a created_at)

- [x] (1) Escribir test que falla para R6 (función pura, fechas fijas,
  bordes de cumplemes)
- [x] (2) Implementación mínima que lo pasa
- [x] (3) Refactor con tests verdes

## R7 — GET /v1/pets lista solo mascotas con membresía activa, con myRole

- [x] (1) Escribir test que falla para R7
- [x] (2) Implementación mínima que lo pasa
- [x] (3) Refactor con tests verdes

## R8 — GET /v1/pets/:petId devuelve el contrato completo con placeholders null

- [x] (1) Escribir test que falla para R8 (asserta las 24 claves exactas y
  los null de device/nextVaccine/nextReminder/activitySummary)
- [x] (2) Implementación mínima que lo pasa
- [x] (3) Refactor con tests verdes

## R9 — Sin membresía (o mascota inexistente) → 404 indistinguible (e2e IDOR obligatorio)

- [x] (1) Escribir test que falla para R9 (e2e: usuario B sobre mascota de
  A → 404 en GET, PATCH y DELETE; mismo body que petId inexistente)
- [x] (2) Implementación mínima que lo pasa
- [x] (3) Refactor con tests verdes

## R10 — :petId no-UUID responde 404 sin consultar la base

- [x] (1) Escribir test que falla para R10
- [x] (2) Implementación mínima que lo pasa
- [x] (3) Refactor con tests verdes

## R11 — Rol insuficiente con @RequirePetRole('owner') responde 403 (y 404 precede a 403)

- [x] (1) Escribir test que falla para R11 (sembrar membresía family/walker/
  vet directo en pet_users; PATCH y DELETE → 403; no-miembro → 404)
- [x] (2) Implementación mínima que lo pasa
- [x] (3) Refactor con tests verdes

## R12 — Handler sin @RequirePetRole acepta cualquier rol activo

- [x] (1) Escribir test que falla para R12
- [x] (2) Implementación mínima que lo pasa
- [x] (3) Refactor con tests verdes

## R13 — PATCH parcial por owner actualiza solo campos presentes (validación atómica)

- [x] (1) Escribir test que falla para R13
- [x] (2) Implementación mínima que lo pasa
- [x] (3) Refactor con tests verdes

## R14 — Exclusividad de edad en PATCH: ambos → 400; uno → el otro queda NULL

- [x] (1) Escribir test que falla para R14
- [x] (2) Implementación mínima que lo pasa
- [x] (3) Refactor con tests verdes

## R15 — PATCH exitoso audita 'pet.update' con nombres de campos; body vacío es no-op sin auditoría

- [x] (1) Escribir test que falla para R15
- [x] (2) Implementación mínima que lo pasa
- [x] (3) Refactor con tests verdes

## R16 — DELETE por owner responde 204, cascade en pet_users, audita 'pet.delete'

- [x] (1) Escribir test que falla para R16 (incluye: tras el delete, GET
  detalle → 404 y la mascota no aparece en el listado)
- [x] (2) Implementación mínima que lo pasa
- [x] (3) Refactor con tests verdes

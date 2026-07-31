---
feature: "auth-registration"
status: approved     # draft | approved
tags: [harness, spec]
---

# Tareas — [[auth-registration]]

> Disciplina TDD. Cada tarea corresponde a un requisito de [[requirements]] y
> tiene siempre los mismos 3 sub-items, en este orden.

## Setup previo (no ligado a un único requisito)

No es TDD de un requisito puntual, pero bloquea a todos los R1-R15:

- [X] Agregar dependencias `argon2` y `uuidv7` a `package.json`
  (`backend-pet-tracker/`)
- [X] Crear `src/db/schema/users.schema.ts`,
  `src/db/schema/email-verification-tokens.schema.ts`,
  `src/db/schema/audit-log.schema.ts` (columnas exactas de
  `docs/data-model.md`)
- [X] Actualizar `src/db/schema/index.ts`: quitar `schemaBootstrap`, agregar
  las 3 tablas nuevas (ver comentario de deprecación ya presente en ese
  archivo)
- [X] `pnpm run db:generate` → migración versionada en `src/db/migrations/`
- [X] Agregar `EMAIL_ENABLED=false` a `.env.example` (raíz del repo) y su
  fila correspondiente en la tabla de variables de entorno de
  `docs/conventions.md`, en el mismo commit que introduce el código que la
  consume (regla dura `AGENTS.md` §4)
- [X] Crear `src/audit/` (`audit-log.repository.ts` con interface
  `AuditLogger` + token `AUDIT_LOGGER`, `audit-log.drizzle.repository.ts`,
  `audit.module.ts` `@Global()`) e importarlo en `app.module.ts`

## R1 — Registro válido crea usuario con 201

- [X] (1) Escribir test que falla para R1
- [X] (2) Implementación mínima que lo pasa
- [X] (3) Refactor con tests verdes

## R2 — Email duplicado responde 409

- [X] (1) Escribir test que falla para R2
- [X] (2) Implementación mínima que lo pasa
- [X] (3) Refactor con tests verdes

## R3 — passwordConfirmation distinto de password responde 400

- [X] (1) Escribir test que falla para R3
- [X] (2) Implementación mínima que lo pasa
- [X] (3) Refactor con tests verdes

## R4 — termsAccepted ausente o false responde 400

- [X] (1) Escribir test que falla para R4
- [X] (2) Implementación mínima que lo pasa
- [X] (3) Refactor con tests verdes

## R5 — Payload inválido (schema zod) responde 400

- [X] (1) Escribir test que falla para R5
- [X] (2) Implementación mínima que lo pasa
- [X] (3) Refactor con tests verdes

## R6 — Registro genera token de verificación con expiración y lo loguea

- [X] (1) Escribir test que falla para R6
- [X] (2) Implementación mínima que lo pasa
- [X] (3) Refactor con tests verdes

## R7 — Token de verificación nunca viaja en la respuesta HTTP de registro

- [X] (1) Escribir test que falla para R7
- [X] (2) Implementación mínima que lo pasa
- [X] (3) Refactor con tests verdes

## R8 — Verificación con token válido y vigente responde 200 y setea email_verified_at

- [X] (1) Escribir test que falla para R8
- [X] (2) Implementación mínima que lo pasa
- [X] (3) Refactor con tests verdes

## R9 — Token inexistente responde 400

- [X] (1) Escribir test que falla para R9
- [X] (2) Implementación mínima que lo pasa
- [X] (3) Refactor con tests verdes

## R10 — Token expirado responde 410

- [X] (1) Escribir test que falla para R10
- [X] (2) Implementación mínima que lo pasa
- [X] (3) Refactor con tests verdes

## R11 — Token ya usado responde 400 y no duplica auditoría

- [X] (1) Escribir test que falla para R11
- [X] (2) Implementación mínima que lo pasa
- [X] (3) Refactor con tests verdes

## R12 — audit_log registra 'user.register'

- [X] (1) Escribir test que falla para R12
- [X] (2) Implementación mínima que lo pasa
- [X] (3) Refactor con tests verdes

## R13 — audit_log registra 'user.email_verified'

- [X] (1) Escribir test que falla para R13
- [X] (2) Implementación mínima que lo pasa
- [X] (3) Refactor con tests verdes

## R14 — Ninguna respuesta serializada expone password_hash

- [X] (1) Escribir test que falla para R14
- [X] (2) Implementación mínima que lo pasa
- [X] (3) Refactor con tests verdes

## R15 — passwordConfirmation nunca se persiste

- [X] (1) Escribir test que falla para R15
- [X] (2) Implementación mínima que lo pasa
- [X] (3) Refactor con tests verdes

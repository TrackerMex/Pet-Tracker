---
feature: "pet-reminders"
status: draft        # draft | approved
tags: [harness, spec]
---

# Tareas — [[pet-reminders]]

> Disciplina TDD. Cada tarea corresponde a un requisito de [[requirements]] y
> tiene siempre los mismos 3 sub-items, en este orden. **Commits
> test-primero**: el historial debe mostrar rojo→verde por requisito
> (CHECKPOINTS C4) — no un solo commit con todo.
>
> Test previsto por requisito: es el test canónico que la fila de
> [[traceability]] debe terminar nombrando (pueden añadirse más).

## R1 — Tabla `reminders` (migración 0011)

Test: `backend-pet-tracker/src/db/schema/reminders.schema.spec.ts`
(patrón de `weights.schema.spec.ts`: columnas, CHECKs, índices, FKs).

- [x] (1) Escribir test que falla para R1
- [x] (2) Implementación mínima que lo pasa (schema + `drizzle-kit generate` → `0011_*.sql`)
- [x] (3) Refactor con tests verdes

## R2 — POST crea reminder programado (201, shape exacto)

Test: `backend-pet-tracker/test/pet-reminders.e2e-spec.ts` → `describe('R2: ...')`.

- [x] (1) Escribir test que falla para R2
- [x] (2) Implementación mínima que lo pasa
- [x] (3) Refactor con tests verdes

## R3 — Validación del POST (400 sin insertar)

Test: `backend-pet-tracker/src/modules/reminders/application/dto/reminder.dto.spec.ts`.

- [x] (1) Escribir test que falla para R3
- [x] (2) Implementación mínima que lo pasa
- [x] (3) Refactor con tests verdes

## R4 — Autorización del POST (404 guard / 403 rol)

Test: `backend-pet-tracker/test/pet-reminders.e2e-spec.ts` → `describe('R4: ...')`.

- [x] (1) Escribir test que falla para R4
- [x] (2) Implementación mínima que lo pasa
- [x] (3) Refactor con tests verdes

## R5 — Dispatcher encola vencidos una sola vez

Test: `backend-pet-tracker/src/modules/reminders/infrastructure/reminders-dispatch.service.spec.ts`
(SQS y repo mockeados: encola el elegible, marca `enqueued_at`, no re-encola,
fallo de un send no frena a los demás). La cadena completa la cubre el e2e de R7.

- [x] (1) Escribir test que falla para R5
- [x] (2) Implementación mínima que lo pasa
- [x] (3) Refactor con tests verdes

## R6 — Mensaje exacto + extensión del schema del notifier

Test: `reminders-dispatch.service.spec.ts` (cuerpo JSON exacto) y
`backend-pet-tracker/src/workers/notifier/notifier-consumer.service.spec.ts` →
`describe('R6 (pet-reminders #16): ...')` (el schema acepta el mensaje reminder;
los tests de #13 de la rama alert siguen verdes **sin editarse**).

- [x] (1) Escribir test que falla para R6
- [x] (2) Implementación mínima que lo pasa
- [x] (3) Refactor con tests verdes

## R7 — Notifier procesa `kind:'reminder'` (push + `sent`, skips idempotentes)

Test: `backend-pet-tracker/src/workers/notifier/notifier-consumer.service.spec.ts` →
`describe('R7 (pet-reminders #16): ...')` (envía y marca `sent`; skip por
`not_found` / `not_scheduled` / `stale_schedule`; duplicado → un solo push).
Cadena real: `test/pet-reminders.e2e-spec.ts` → `describe('R7: ...')`
(create elegible → `dispatchOnce()` → mensaje en cola → `drainOnce()` →
`status='sent'`; segundo `dispatchOnce()` no encola nada).

- [x] (1) Escribir test que falla para R7
- [x] (2) Implementación mínima que lo pasa
- [x] (3) Refactor con tests verdes

## R8 — PATCH reprograma sin duplicar envíos

Test: `backend-pet-tracker/test/pet-reminders.e2e-spec.ts` → `describe('R8: ...')`
(create elegible → `dispatchOnce()` → PATCH `{dueAt}` → `dispatchOnce()` →
`drainOnce()` procesa ambos mensajes → exactamente un push, `status='sent'`).

- [x] (1) Escribir test que falla para R8
- [x] (2) Implementación mínima que lo pasa
- [x] (3) Refactor con tests verdes

## R9 — PATCH cancela y nunca se envía

Test: `backend-pet-tracker/test/pet-reminders.e2e-spec.ts` → `describe('R9: ...')`
(cancel antes del encolado → `dispatchOnce()` no encola; cancel después del
encolado → `drainOnce()` no pushea y el status queda `'cancelled'`).

- [x] (1) Escribir test que falla para R9
- [x] (2) Implementación mínima que lo pasa
- [x] (3) Refactor con tests verdes

## R10 — Autorización del PATCH vía `reminder.pet_id` (404/403)

Test: `backend-pet-tracker/test/pet-reminders.e2e-spec.ts` → `describe('R10: ...')`
(usuario B sobre reminder de A → 404; id no-UUID → 404; miembro activo
no-owner → 403) + unit en
`src/modules/reminders/application/use-cases/update-reminder.use-case.spec.ts`.

- [x] (1) Escribir test que falla para R10
- [x] (2) Implementación mínima que lo pasa
- [x] (3) Refactor con tests verdes

## R11 — PATCH sobre sent/cancelled → 409; body inválido → 400

Test: `backend-pet-tracker/src/modules/reminders/application/use-cases/update-reminder.use-case.spec.ts`
(409 con fila intacta) y `reminder.dto.spec.ts` (formas 400 del body).

- [x] (1) Escribir test que falla para R11
- [x] (2) Implementación mínima que lo pasa
- [x] (3) Refactor con tests verdes

## R12 — Gating `REMINDERS_ENABLED` / `NODE_ENV=test`

Test: `backend-pet-tracker/src/modules/reminders/infrastructure/reminders-scheduler.service.spec.ts`
(`shouldSchedule()` en las 4 combinaciones).

- [x] (1) Escribir test que falla para R12
- [x] (2) Implementación mínima que lo pasa
- [x] (3) Refactor con tests verdes

## Cierre (mismo PR, sin R-id)

- [ ] Actualizar `docs/data-model.md` (fila `reminders`: `enqueued_at`, doble
      uso de `schedule_name`, mecanismo local — [[design]] D2/D3)
- [x] `REMINDERS_ENABLED` en `.env.example` (=true) y tabla de
      `docs/conventions.md` (R12, mismo commit que la introduce)
- [ ] `traceability.md` sin filas "pendiente"; `init.sh` verde

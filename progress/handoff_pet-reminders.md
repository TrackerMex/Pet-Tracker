# Handoff a Codex CLI — pet-reminders (#16)

> Escrito por el leader (Claude Code) el 2026-08-11. El humano copia el prompt
> de abajo en una terminal con Codex CLI, con el repo en la branch
> `feature/16-pet-reminders`. Codex no tiene acceso a la conversación que
> originó la spec: toda decisión está cerrada por escrito en
> `specs/pet-reminders/`.

---

## Prompt para Codex

```
Feature: pet-reminders (#16), branch: feature/16-pet-reminders
Spec aprobada: specs/pet-reminders/requirements.md (status: approved, R1-R12)
Lee también: specs/pet-reminders/design.md (D1-D11) y specs/pet-reminders/tasks.md
La spec es la autoridad: si algo parece ambiguo, la respuesta está en design.md,
no se improvisa.

Archivos a crear/modificar:
  - backend-pet-tracker/src/db/schema/reminders.schema.ts (nuevo, export `reminders`)
  - backend-pet-tracker/src/db/schema/index.ts (re-export)
  - backend-pet-tracker/src/db/migrations/0011_*.sql (generada con drizzle-kit,
    archivo nuevo, sin alterar tablas existentes — R1)
  - backend-pet-tracker/src/modules/reminders/ (módulo completo: controller con
    POST /v1/pets/:petId/reminders y PATCH /v1/reminders/:id,
    application/dto/reminder.dto.ts con REMINDER_TITLE_MAX_LENGTH y
    REMINDER_MAX_ADVANCE_MINUTES exportadas, UpdateReminderUseCase,
    RemindersDispatchService, RemindersSchedulerService)
  - backend-pet-tracker/src/workers/notifier/notification-message.schema.ts
    (extender a z.discriminatedUnion('kind', [alertMessageSchema,
    reminderMessageSchema]) — la rama alert queda byte-idéntica, sus tests NO
    se editan — R6) y el handler del notifier para kind 'reminder' (R7; rutas
    exactas en design.md)
  - .env.example y docs/conventions.md (tabla de variables): REMINDERS_ENABLED
    en el mismo commit que la introduce (R12)
  - specs/pet-reminders/traceability.md (actualizar tras cada commit)

Reglas críticas:
  - Seguir la arquitectura de docs/architecture.md y las convenciones de
    docs/conventions.md
  - TDD por requisito: test rojo → verde → refactor (orden en tasks.md)
  - UN COMMIT POR REQUISITO como mínimo, con el test rojo commiteado ANTES que
    su implementación. Historial rojo→verde verificable: un único commit con
    todo incumple C4 de CHECKPOINTS.md y el reviewer lo rechaza (pasó en #19)
  - Colisión de R-ids: tests que escriban en archivos de src/workers/notifier/
    nombran su requisito como "R<n> (pet-reminders #16): ..." (los R1..R15 de
    #13 ya viven ahí); archivos nuevos del módulo reminders usan R<n> a secas
  - Autorización: POST vía PetAccessGuard + @RequirePetRole('owner') (404
    precede a 403); PATCH no lleva :petId — UpdateReminderUseCase carga el
    reminder y consulta PetRepository.findMembership(reminder.petId, userId),
    404 opaco en los tres casos de R10
  - Idempotencia: enqueued_at (no re-encolar entre ticks) + schedule_name como
    token vigente (create/PATCH regeneran token reminder-<uuidv7>; mensajes en
    vuelo con token viejo caen en 'stale_schedule'/'not_scheduled' y NUNCA van
    a la DLQ — R5, R7, R8, R9)
  - No crear recursos AWS reales ni correr cdk deploy/bootstrap: humano lo hace
  - No tocar nada fuera de los archivos listados; PetProfileResponse es
    contrato congelado (nextReminder queda fuera de alcance)

Criterios de aceptación: R1-R12 de specs/pet-reminders/requirements.md; cada
R-id con su test nombrándolo (mapa test↔R-id en traceability.md).

Al terminar: escribir el resultado en progress/impl_pet-reminders.md (qué se
hizo, commits, estado de init.sh, desviaciones si las hubo) y parar. NO abrir
PR ni mergear: eso lo coordina el leader al cierre.
```

---

## Notas para el leader (no van a Codex)

- Verificación local completa requiere infra: `docker compose up -d` antes de
  los e2e (puerto 4566 y Postgres). Ver memoria: contenedor Postgres viejo
  puede tener PortBindings roto — verificar con `docker port` si init.sh salta
  los e2e en silencio.
- Al confirmar el humano que Codex terminó: leer progress/impl_pet-reminders.md
  y lanzar reviewer (progress/review_pet-reminders.md, veredicto contra
  CHECKPOINTS C2-C7 y la spec).

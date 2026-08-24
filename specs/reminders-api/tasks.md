---
feature: "reminders-api"
status: draft        # draft | approved
tags: [harness, spec, backend]
---

# Tareas — [[reminders-api]]

> Disciplina TDD (C4): test ROJO commiteado antes de la implementación de
> cada requisito; nunca test + implementación + docs en un solo commit.
> Esta feature BLOQUEA el handoff de #39 (mobile-reminders): debe quedar
> `done` (reviewer aprobado + merge) antes de que Codex arranque #39.

## R1 — GET /pets/:petId/reminders (listado por capas)

- [x] (1) Escribir test que falla para R1 (list-reminders.use-case.spec.ts + casos e2e)
- [x] (2) Implementación mínima que lo pasa (listByPet domain+drizzle, use case, @Get, module)
- [x] (3) Refactor con tests verdes

## R2 — DELETE /pets/:petId/reminders/:id (borrado real)

- [ ] (1) Escribir test que falla para R2 (delete-reminder.use-case.spec.ts + casos e2e)
- [ ] (2) Implementación mínima que lo pasa (deleteByPetAndId, use case, @Delete 204, module)
- [ ] (3) Refactor con tests verdes

## R3 — Regresión y contención

- [ ] (1) Ejecutar lint, test, test:e2e y ./init.sh
- [ ] (2) Corregir lo que falle sin tocar fuera del alcance
- [ ] (3) Anotar resultados en progress/impl_reminders-api.md

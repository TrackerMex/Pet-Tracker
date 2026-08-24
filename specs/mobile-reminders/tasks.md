---
feature: "mobile-reminders"
status: draft        # draft | approved
tags: [harness, spec, mobile]
---

# Tareas — [[mobile-reminders]]

> Disciplina TDD (C4): cada requisito con su test ROJO commiteado antes de
> la implementación. Commits test-primero explícitos, nunca test +
> implementación + docs en un solo commit. Orden recomendado: R1 (backend)
> → R2–R5 (clientes y utils) → R6–R10 (pantallas) → R11 (navegación) →
> R12 → R13 (humano).

## R1 — GET /pets/:petId/reminders (backend, por capas)

- [ ] (1) Escribir test que falla para R1 (use-case spec + e2e)
- [ ] (2) Implementación mínima que lo pasa (repo domain+drizzle, use case, controller, module)
- [ ] (3) Refactor con tests verdes

## R2 — listReminders en src/api/reminders.ts

- [ ] (1) Escribir test que falla para R2
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R3 — createReminder (POST 201, body strict)

- [ ] (1) Escribir test que falla para R3
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R4 — cancelReminder + patchJson en http.ts

- [ ] (1) Escribir test que falla para R4
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R5 — parseDueAt / daysUntil en src/utils/reminder-dates.ts

- [ ] (1) Escribir test que falla para R5
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R6 — RemindersScreen: montaje, métricas, estados de carga

- [ ] (1) Escribir test que falla para R6
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R7 — Lista: pills, filas, badge Upcoming, refetch on focus

- [ ] (1) Escribir test que falla para R7
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R8 — Cancelación con confirmación y degradación por kind

- [ ] (1) Escribir test que falla para R8
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R9 — AddReminderScreen: formulario y chips

- [ ] (1) Escribir test que falla para R9
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R10 — Guardar: validación local, POST y degradación

- [ ] (1) Escribir test que falla para R10
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R11 — Rutas delgadas + link desde Health

- [ ] (1) Escribir test que falla para R11 (extensión de health.test.tsx)
- [ ] (2) Implementación mínima que lo pasa (route files + Pressable)
- [ ] (3) Refactor con tests verdes

## R12 — Typecheck, lint, contención de diff

- [ ] (1) Ejecutar typecheck/lint/tests móvil y backend + init.sh
- [ ] (2) Corregir lo que falle (sin tocar fuera del alcance)
- [ ] (3) Anotar resultados en progress/impl_mobile-reminders.md

## R13 — Smoke humano en Expo Go

- [ ] Pasos 1–10 de [[requirements]] R13 ejecutados por el humano

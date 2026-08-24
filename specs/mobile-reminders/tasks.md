---
feature: "mobile-reminders"
status: draft        # draft | approved
tags: [harness, spec, mobile]
---

# Tareas — [[mobile-reminders]]

> Disciplina TDD (C4): cada requisito con su test ROJO commiteado antes de
> la implementación. Commits test-primero explícitos, nunca test +
> implementación + docs en un solo commit.
>
> **Gate previo: #47 (reminders-api) debe estar `done` en
> `feature_list.json` antes del handoff de esta feature a Codex** — el
> cliente móvil consume GET y DELETE que hoy no existen. Orden
> recomendado: instalar el picker (paso 0) → R1–R4 (clientes y utils) →
> R5–R9 (pantallas) → R10 (navegación) → R11 → R12 (humano).

## Paso 0 — Dependencia del picker (sin R-id, previo a R8)

- [ ] `bunx expo install @react-native-community/datetimepicker` desde
      `mobile-pet-tracker/` (única dep nueva permitida, [[design]] §D6)

## R1 — listReminders en src/api/reminders.ts

- [x] (1) Escribir test que falla para R1
- [x] (2) Implementación mínima que lo pasa
- [x] (3) Refactor con tests verdes

## R2 — createReminder (POST 201, body strict)

- [x] (1) Escribir test que falla para R2
- [x] (2) Implementación mínima que lo pasa
- [x] (3) Refactor con tests verdes

## R3 — deleteReminder + deleteJson en http.ts

- [x] (1) Escribir test que falla para R3
- [x] (2) Implementación mínima que lo pasa
- [x] (3) Refactor con tests verdes

## R4 — combineDateAndTime / daysUntil en src/utils/reminder-dates.ts

- [ ] (1) Escribir test que falla para R4
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R5 — RemindersScreen: montaje, métricas, estados de carga

- [ ] (1) Escribir test que falla para R5
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R6 — Lista: pills, filas, badge Upcoming, refetch on focus

- [ ] (1) Escribir test que falla para R6
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R7 — Borrado con confirmación y degradación por kind

- [ ] (1) Escribir test que falla para R7
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R8 — AddReminderScreen: formulario, chips y pickers nativos

- [ ] (1) Escribir test que falla para R8
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R9 — Guardar: validación local, POST y degradación

- [ ] (1) Escribir test que falla para R9
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R10 — Rutas delgadas + link mínimo en Profile (contrato con #40)

- [ ] (1) Escribir test que falla para R10 (describe nuevo en profile.test.tsx)
- [ ] (2) Implementación mínima que lo pasa (route files + Pressable en placeholder)
- [ ] (3) Refactor con tests verdes

## R11 — Typecheck, lint, contención de diff

- [ ] (1) Ejecutar typecheck/lint/tests móvil + init.sh
- [ ] (2) Corregir lo que falle (backend sin diff; package.json solo el picker)
- [ ] (3) Anotar resultados en progress/impl_mobile-reminders.md

## R12 — Smoke humano en Expo Go

- [ ] Pasos 1–10 de [[requirements]] R12 ejecutados por el humano

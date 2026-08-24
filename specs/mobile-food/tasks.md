---
feature: "mobile-food"
status: draft        # draft | approved
tags: [harness, spec, mobile]
---

# Tareas — [[mobile-food]]

> Disciplina TDD. Cada tarea corresponde a un requisito de [[requirements]] y
> tiene siempre los mismos 3 sub-items, en este orden. Commits test-primero
> explícitos (lección de #19: sin historial rojo→verde no pasa C4).

## R1 — `getNutritionProfile` mapea la respuesta por kind

- [ ] (1) Escribir test que falla para R1 (`src/api/__tests__/nutrition.test.ts`)
- [ ] (2) Implementación mínima que lo pasa (`src/api/nutrition.ts` + tipos D4 en `types.ts`)
- [ ] (3) Refactor con tests verdes

## R2 — `getNutritionPlan` mapea la respuesta por kind (aiExplanation incluido)

- [ ] (1) Escribir test que falla para R2 (fixtures con `aiExplanation` null y string)
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R3 — `generateNutritionPlan` publica y mapea por kind (403/422 con code)

- [ ] (1) Escribir test que falla para R3
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R4 — Hub Food: selector y estados

- [ ] (1) Escribir test que falla para R4 (`src/app/(tabs)/__tests__/food.test.tsx`)
- [ ] (2) Implementación mínima que lo pasa (`food.tsx` reescrito; quitar la
      fila de Food en `screens.test.tsx` — excepción C4 documentada)
- [ ] (3) Refactor con tests verdes

## R5 — Plan del día: card, horarios Served/Pending y warnings

- [ ] (1) Escribir test que falla para R5 (hora congelada, §D7)
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R6 — aiExplanation nullable con gracia

- [ ] (1) Escribir test que falla para R6 (null → sin card; string → card)
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R7 — MealSchedule: horarios, perfil y estados

- [ ] (1) Escribir test que falla para R7 (`meal-schedule.test.tsx`)
- [ ] (2) Implementación mínima que lo pasa (`meal-schedule.tsx`)
- [ ] (3) Refactor con tests verdes

## R8 — Generate plan con degradación por kind

- [ ] (1) Escribir test que falla para R8
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R9 — typecheck y lint

- [ ] (1) Ejecutar `bun run typecheck` y `bun run lint` (fallan si hay deuda)
- [ ] (2) Corregir hasta exit 0 en ambos
- [ ] (3) Anotar resultado en `progress/impl_mobile-food.md`

## R10 — Contención

- [ ] (1) `git diff --stat main...HEAD -- backend-pet-tracker/ infra/ init.config.sh .github/` vacío
- [ ] (2) `./init.sh` exit 0 y `bun run test` verde (suites #33–#37 y #46 incluidas)
- [ ] (3) `grep -rn "expo-secure-store\|from 'react'" mobile-pet-tracker/src/api/` sin resultados nuevos

## R11 — Smoke humano en Expo Go (lo ejecuta el humano)

- [ ] (1) Preparar datos (peso + perfil vía curl, pasos en [[requirements]] R11)
- [ ] (2) Ejecutar los 9 pasos del smoke
- [ ] (3) Marcar la casilla de R11 en [[requirements]] con fecha

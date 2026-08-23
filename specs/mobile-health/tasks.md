---
feature: "mobile-health"
status: draft        # draft | approved
tags: [harness, spec, mobile]
---

# Tareas — [[mobile-health]]

> Disciplina TDD. Cada tarea corresponde a un requisito de [[requirements]] y
> tiene siempre los mismos 3 sub-items, en este orden. Commits test-primero
> explícitos (lección de #19: sin historial rojo→verde no pasa C4).

## R1 — `listVaccines` mapea la respuesta por kind

- [ ] (1) Escribir test que falla para R1 (`src/api/__tests__/health-records.test.ts`)
- [ ] (2) Implementación mínima que lo pasa (`src/api/health-records.ts` + tipos D2)
- [ ] (3) Refactor con tests verdes

## R2 — `listWeights` con limit opcional

- [ ] (1) Escribir test que falla para R2
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R3 — `createWeight` publica y mapea por kind (+ `postJson` en http.ts)

- [ ] (1) Escribir test que falla para R3
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R4 — Hub Health: selector y estados

- [ ] (1) Escribir test que falla para R4 (`health.test.tsx` reescrito)
- [ ] (2) Implementación mínima que lo pasa (`health.tsx` hub)
- [ ] (3) Refactor con tests verdes

## R5 — Sección Vaccines con la próxima destacada

- [ ] (1) Escribir test que falla para R5
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R6 — Card Weight enlaza a WeightLog

- [ ] (1) Escribir test que falla para R6
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R7 — WeightLog lista el historial

- [ ] (1) Escribir test que falla para R7 (`weight-log.test.tsx`)
- [ ] (2) Implementación mínima que lo pasa (`weight-log.tsx`)
- [ ] (3) Refactor con tests verdes

## R8 — WeightChart degrada con <2 puntos

- [ ] (1) Escribir test que falla para R8 (`weight-chart.test.tsx`)
- [ ] (2) Implementación mínima que lo pasa (`weight-chart.tsx` + montaje en WeightLog)
- [ ] (3) Refactor con tests verdes

## R9 — Alta de peso con degradación por kind

- [ ] (1) Escribir test que falla para R9
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R10 — Health-check + theme toggle a Profile (excepción C4 parcial)

- [ ] (1) Trasladar los casos de la suite vieja a `profile.test.tsx`
      (rojos contra el Profile actual) — cobertura movida, no TDD nuevo
- [ ] (2) Implementación mínima que los pasa (`profile.tsx` sección App;
      retirar el check del hub)
- [ ] (3) Refactor con tests verdes (incl. `screens.test.tsx` intacta y verde)

## R11 — typecheck y lint

- [ ] (1) Ejecutar `bun run typecheck` y `bun run lint` (fallan si hay deuda)
- [ ] (2) Corregir hasta exit 0 en ambos
- [ ] (3) Anotar resultado en `progress/impl_mobile-health.md`

## R12 — Contención

- [ ] (1) `git diff --stat main...HEAD -- backend-pet-tracker/ infra/ init.config.sh .github/` vacío
- [ ] (2) `./init.sh` exit 0 y `bun run test` verde (suites #33–#36 incluidas)
- [ ] (3) `grep -rn "expo-secure-store\|from 'react'" mobile-pet-tracker/src/api/` sin resultados nuevos

## R13 — Smoke humano en Expo Go (lo ejecuta el humano)

- [ ] (1) Preparar datos (seed:vaccines + vacunas vía API, pasos en [[requirements]] R13)
- [ ] (2) Ejecutar los 10 pasos del smoke
- [ ] (3) Marcar la casilla de R13 en [[requirements]] con fecha

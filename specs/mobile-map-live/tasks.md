---
feature: "mobile-map-live"
status: approved     # draft | approved
tags: [harness, spec, mobile]
---

# Tareas — [[mobile-map-live]]

> Disciplina TDD. Cada tarea corresponde a un requisito de [[requirements]] y
> tiene siempre los mismos 3 sub-items, en este orden. **Commits
> test-primero explícitos**: el historial debe mostrar rojo → verde por
> requisito (C4 de CHECKPOINTS.md).
>
> Tarea 0 (previa, sin TDD): `bunx expo install react-native-maps` desde
> `mobile-pet-tracker/` (pin 1.27.2 de SDK 57) y añadir los tipos D3 a
> `src/api/types.ts` — los consume R1.

## R1 — `getLastPosition` mapea la respuesta por kind

- [ ] (1) Escribir test que falla para R1 (`src/api/__tests__/positions.test.ts`)
- [ ] (2) Implementación mínima que lo pasa (`src/api/positions.ts`)
- [ ] (3) Refactor con tests verdes

## R2 — `listPositions` mapea la respuesta por kind

- [ ] (1) Escribir test que falla para R2 (mismo archivo de test)
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R3 — `getDayRoute` compone lista + detalles de trips

- [ ] (1) Escribir test que falla para R3 (`src/api/__tests__/trips.test.ts`)
- [ ] (2) Implementación mínima que lo pasa (`src/api/trips.ts`)
- [ ] (3) Refactor con tests verdes

## R4 — Map resuelve la mascota (default, loading, no-pets, error)

- [ ] (1) Escribir test que falla para R4 (`src/app/(tabs)/__tests__/map.test.tsx`)
- [ ] (2) Implementación mínima que lo pasa (`src/app/(tabs)/map.tsx`)
- [ ] (3) Refactor con tests verdes

## R5 — Mascota free (402) degrada sin mapa ni polling

- [ ] (1) Escribir test que falla para R5
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R6 — MapView + Marker con la última posición (y estado sin posición)

- [ ] (1) Escribir test que falla para R6
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R7 — Ruta del día como Polylines (0..n trips, degradación)

- [ ] (1) Escribir test que falla para R7
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R8 — Stats: speed / distance / last update / GPS status

- [ ] (1) Escribir test que falla para R8
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R9 — Polling cada 15 s con foco; se detiene sin foco

- [ ] (1) Escribir test que falla para R9 (fake timers + cleanup de useFocusEffect)
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R10 — Botón Activate Lost Mode stub deshabilitado

- [ ] (1) Escribir test que falla para R10
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R11 — typecheck y lint verdes (verificación, sin TDD)

- [ ] `bun run typecheck` exit 0 en `mobile-pet-tracker/`
- [ ] `bun run lint` exit 0
- [ ] Anotado en `progress/impl_mobile-map-live.md`

## R12 — Contención (verificación, sin TDD)

- [ ] `./init.sh` exit 0
- [ ] `bun run test` verde completo (único diff permitido: caso `map` fuera
      de `screens.test.tsx`, excepción C4)
- [ ] `git diff --stat main...HEAD -- backend-pet-tracker/ infra/ init.config.sh .github/` vacío
- [ ] `grep -rn "expo-secure-store\|from 'react'" mobile-pet-tracker/src/api/` sin resultados nuevos

## R13 — Smoke humano en Expo Go (gate humano, no lo cierra ninguna IA)

- [ ] Pasos 1–9 de [[requirements]] §R13 con collar real (401775970) o SIM_MODE
- [ ] Casilla de R13 marcada con fecha

---
feature: "mobile-design-drift"
status: draft        # draft | approved
tags: [harness, spec]
---

# Tareas — [[mobile-design-drift]]

> Disciplina TDD. Cada tarea corresponde a un requisito de [[requirements]] y
> tiene siempre los mismos 3 sub-items, en este orden. **Commits
> test-primero**: el test rojo se commitea (o al menos se escribe) antes de
> la implementación; historial rojo→verde visible (CHECKPOINTS C4).
> Comandos desde `mobile-pet-tracker/`: `bun run test`, `bun run lint`,
> `bun run typecheck`.
> Orden sugerido (audit §Orden de adopción): R1 → R2 → R3 empezando por
> `home.tsx` como patrón, resto de pantallas por commit → R4 → R5-R8.

## R1 — Tokens `--radius-card` y `--text-2xs` en `@theme`

- [ ] (1) Escribir test que falla para R1 (`global-css.test.ts`)
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R2 — Componente compartido `src/components/card.tsx`

- [ ] (1) Escribir test que falla para R2 (`card.test.tsx`)
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R3 — Adopción del Card en las 7 pantallas + cero `rounded-[20px]`

- [ ] (1) Escribir test que falla para R3 (`design-drift.test.ts`)
- [ ] (2) Implementación mínima que lo pasa (tabla [[design]] §Adopción,
      una pantalla por commit; `home.tsx` primero)
- [ ] (3) Refactor con tests verdes (suites RTL existentes incluidas)

## R4 — Cero `text-[10px]`, reemplazo por `text-2xs`

- [ ] (1) Escribir test que falla para R4 (assert en `design-drift.test.ts`)
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R5 — `paddingTop: insets.top + 12` en health y weight-log

- [ ] (1) Escribir test que falla para R5 (`health.test.tsx`, `weight-log.test.tsx`)
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R6 — `profile.tsx` con la convención de dimensiones completa

- [ ] (1) Escribir test que falla para R6 (`profile.test.tsx` + mock insets
      también en `screens.test.tsx`)
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R7 — Overlay de map con `insets.top + 12`

- [ ] (1) Escribir test que falla para R7 (`map.test.tsx`)
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R8 — Skeleton dimensionado en vez de Spinner (health, weight-log, map)

- [ ] (1) Escribir test que falla para R8 (asserts de `className` en las 3 suites)
- [ ] (2) Implementación mínima que lo pasa (mismos testID; borrar imports
      `Spinner` sin uso)
- [ ] (3) Refactor con tests verdes

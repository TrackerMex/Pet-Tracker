---
feature: "pet-online-pill"
issue: 73
branch: "feature/73-pet-online-pill"
date: 2026-09-14
status: in_progress
---

# Implementación — pet-online-pill (#73)

## Línea base y alcance

- `./init.sh`: exit 0 antes de editar; build, tests, e2e, lint y typecheck verdes.
- Branch y worktree verificados: `feature/73-pet-online-pill` en
  `/home/claude/sites/Pet-Tracker-wt-backend`.
- `mobile-pet-tracker/.expo/types/router.d.ts`: ausente.
- Skills aplicadas: `ponytail`, `expo:building-native-ui`,
  `appllama-app-design-skill` y `animate-expo`. Los nombres antiguos del
  handoff (`expo-overview`, `expo-native-ui`, `expo-animation`) no están
  disponibles en el catálogo; se usaron sus equivalentes activos.
- Documentación oficial consultada: Expo SDK 57 y Reanimated 4.5.1.

## R1 — umbral y derivación pura

- Rojo `b9026577`: `pnpm test -- connectivity` terminó exit 1; la primera
  aserción mostró `Expected: 120000`, `Received: 0`, y las otras cinco
  alcanzaron el stub `not implemented`.
- Implementación: umbral inclusivo `2 * 60_000`, documentado con E1, y función
  pura que conserva `null`, considera online el límite y los timestamps futuros.
- Verde: `pnpm test` en backend, exit 0. `connectivity.ts` solo importa la
  constante pura de `@/pipeline/constants`.

## R2 — contrato derivado en lectura

- Rojo preparado: el mapper ya recibe `now`, su fuente ya no acepta
  `connectivity` y los tres controllers pasan el reloj, pero el cuerpo conserva
  el placeholder `connectivity: null`.
- `pnpm test -- device-status pets.controller`: exit 1, cuatro aserciones
  fallaron con `Expected: online|offline`, `Received: null`; `pnpm build`: exit 0.

## R3 — tres estados por API contra Postgres

- Rojo preparado con Postgres real, sin sleeps ni `device_subscriptions`.
- `pnpm test:e2e -- device-connectivity`: exit 1; el caso `null` pasó y las
  aserciones de perfil para `offline` (`:163`) y `online` (`:175`) recibieron
  `null`, el placeholder de R2.

## R4 — eliminación del pestillo

Pendiente.

## R5 — catálogo bilingüe

Pendiente.

## R6 — helper único y Pairing offline

Pendiente.

## R7 — cuatro estados en `collar-status`

Pendiente.

## R8 — píldora y pulso accesible

Pendiente.

## R9 — Home monta la píldora desde el mismo estado

Pendiente.

## R10 — candados y verificación final

Pendiente.

## R11 — smoke humano en dev build Android

Pendiente de preparar; no ejecutable por IA.

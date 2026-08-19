---
feature: "mobile-app-scaffold"
status: draft        # draft | approved
tags: [harness, spec, mobile]
---

# Tareas — [[mobile-app-scaffold]]

> Disciplina TDD para R2–R7 (test rojo → verde → refactor, commits
> separados test-primero — en #19 todo cayó en un commit y incumplió C4; no
> repetir). R1 y R8–R12 son scaffold/config/docs: no nacen por TDD, cada uno
> lleva su verificación explícita. Orden de ejecución: R1 → R2..R6 → R7 →
> R8 → R9 → R10 → R11 → (R12 es invariante continua) → R13 (humano).
> Actualizar [[traceability]] tras cada commit.

## R1 — Scaffold Expo SDK 57 (excepción C4: generado, sin TDD)

- [ ] (1) `bun create expo-app mobile-pet-tracker` (plantilla default TS + expo-router)
- [ ] (2) `echo n | bun run reset-project` dentro de la app (interactivo; `n` borra el ejemplo `src/` y `scripts/`)
      (si la plantilla no trae el script: reducir `app/` a `_layout.tsx` +
      `index.tsx` a mano)
- [ ] (3) Verificar isla: sin `package.json`/lockfile en la raíz del repo;
      `bun.lock` presente en la app; correr `bun pm untrusted` y anotar el
      output en `progress/impl_mobile-app-scaffold.md` (riesgo
      trustedDependencies)
- [ ] (4) Commit aislado SOLO con el scaffold: `chore(mobile): scaffold expo sdk 57 app via bun create expo-app (R1)`
- [ ] (5) Instalar tooling de test (D6): `jest-expo` >= 57.0.4, `jest@~29.7.0`,
      `@testing-library/react-native`, `@types/jest`; scripts `test`/`typecheck`
      y `"jest": { "preset": "jest-expo" }` según [[design]]; commit
      `chore(mobile): add jest-expo test tooling (R1)`

## R2 — `healthUrl` maneja la barra final

- [ ] (1) Test rojo en `src/api/__tests__/health.test.ts` (`describe('R2: ...')`) — commit `test(mobile): red test for healthUrl (R2)`
- [ ] (2) Implementación mínima en `src/api/health.ts` — commit `feat(mobile): healthUrl builder (R2)`
- [ ] (3) Refactor con tests verdes

## R3 — `fetchHealth` → `ok` con 200 + `postgres: 'ok'`

- [ ] (1) Test rojo (`describe('R3: ...')`, `fetchFn` mockeado) + crear `api/types.ts` con `HealthResponse`
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R4 — `fetchHealth` → `error` con 503 / body inválido

- [ ] (1) Test rojo (`describe('R4: ...')` — caso 503 y caso 200 con body no parseable)
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R5 — `fetchHealth` → `unreachable` cuando fetch lanza

- [ ] (1) Test rojo (`describe('R5: ...')` — `fetchFn` que rechaza; asegurar que no propaga la excepción)
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor con tests verdes

## R6 — `missing-config` sin fetch y sin URL hardcodeada

- [ ] (1) Test rojo (`describe('R6: ...')` — `baseUrl` undefined y `''`; assert de que `fetchFn` NO fue llamado)
- [ ] (2) Implementación mínima que lo pasa
- [ ] (3) Refactor + `grep -rn "3000" mobile-pet-tracker/src` limpio (solo `.env.example`/docs)

## R7 — Pantalla inicial con los 4 estados + retry

- [ ] (1) Test rojo en `src/app/__tests__/index.test.tsx` (`describe('R7: ...')`,
      `jest.mock` de `../../api/health`, un caso por `kind` + retry) —
      **verlo rojo es obligatorio** (pantalla sin cablear); commit test-primero
- [ ] (2) Implementación mínima de `src/app/index.tsx` (testIDs `health-state`, `health-retry`)
- [ ] (3) Refactor con tests verdes

## R8 — `.env` / `.env.example` (config, sin TDD)

- [ ] (1) Crear `.env.example` con `EXPO_PUBLIC_API_URL=http://192.168.x.x:3000/v1`
- [ ] (2) Asegurar `.env` en el `.gitignore` de la app
- [ ] (3) Verificar: `git ls-files mobile-pet-tracker` incluye `.env.example` y no `.env`

## R9 — init.config.sh (config, sin TDD)

- [ ] (1) Editar `init.config.sh` según [[design]] §Harness (REQUIRED_TOOLS + 4 comandos `--cwd`; BUILD_CMD intacto)
- [ ] (2) Correr `./init.sh` completo → exit 0
- [ ] (3) Verificar que NO hay guardas silenciosas (`command -v bun` prohibido)

## R10 — ci.yml (config, sin TDD)

- [ ] (1) Añadir `oven-sh/setup-bun@v2` (bun-version "1.3.14") + `actions/cache@v4` sobre `mobile-pet-tracker/bun.lock` según [[design]]
- [ ] (2) Mismo PR que R9 (D9)
- [ ] (3) Verificar CI verde en el PR

## R11 — Fila en AGENTS.md §2 (docs, sin TDD)

- [ ] (1) Añadir fila `mobile-pet-tracker/` a la tabla del mapa (skill docs-readme-sync)
- [ ] (2) Verificar que la tabla queda consistente

## R12 — backend intocable (invariante continua)

- [ ] (1) Antes del PR: `git diff --stat main...HEAD -- backend-pet-tracker/` → vacío

## R13 — Smoke del humano (gate humano, no lo cierra ninguna IA)

- [ ] (1) Humano ejecuta los 7 pasos de [[requirements]] R13 y marca la casilla con fecha

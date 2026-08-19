---
feature: "mobile-app-scaffold"
status: draft        # draft | approved
tags: [harness, spec, mobile]
---

# Trazabilidad — [[mobile-app-scaffold]]

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | verificación estructural del reviewer (excepción C4: scaffold generado) | `ee29ed1 chore(mobile): scaffold expo sdk 57 app via bun create expo-app (R1)`<br>`f22721c chore(mobile): add jest-expo test tooling (R1)` |
| R2 | `src/api/__tests__/health.test.ts::R2: healthUrl` | `1893f1c test(mobile): add red test for healthUrl (R2)`<br>`db52ee1 feat(mobile): add health URL builder (R2)` |
| R3 | `src/api/__tests__/health.test.ts::R3: fetchHealth ok state` | `2f036c5 test(mobile): add red health success test (R3)`<br>`aa261c8 feat(mobile): return healthy backend state (R3)` |
| R4 | `src/api/__tests__/health.test.ts::R4: fetchHealth error state` | `8daae39 test(mobile): add red degraded health tests (R4)`<br>`1032fac feat(mobile): return degraded backend state (R4)` |
| R5 | `src/api/__tests__/health.test.ts::R5: fetchHealth unreachable state` | `b57763b test(mobile): add red unreachable health test (R5)`<br>`04219b5 feat(mobile): return unreachable backend state (R5)` |
| R6 | pendiente (`src/api/__tests__/health.test.ts::R6`) | pendiente |
| R7 | pendiente (`src/app/__tests__/index.test.tsx::R7`) | pendiente |
| R8 | pendiente (verificación reviewer: `.env.example` tracked, `.env` ignorado) | pendiente |
| R9 | pendiente (verificación reviewer: `./init.sh` exit 0 + diff init.config.sh) | pendiente |
| R10 | pendiente (verificación: CI verde del PR) | pendiente |
| R11 | pendiente (verificación reviewer: fila en AGENTS.md §2) | pendiente |
| R12 | pendiente (verificación reviewer: diff de backend-pet-tracker/ vacío) | pendiente |
| R13 | pendiente (gate humano: casilla de smoke en requirements.md con fecha) | pendiente |

Regla: el reviewer no aprueba si alguna fila queda "pendiente".
Convención de commit: `feat(<scope>): <desc> (R1,R2)` — scope `mobile` para
la app, `harness` para R9–R11.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).

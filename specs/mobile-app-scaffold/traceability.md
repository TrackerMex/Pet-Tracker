---
feature: "mobile-app-scaffold"
status: draft        # draft | approved
tags: [harness, spec, mobile]
---

# Trazabilidad — [[mobile-app-scaffold]]

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | pendiente (excepción C4: scaffold generado — verificación estructural del reviewer) | pendiente |
| R2 | pendiente (`src/api/__tests__/health.test.ts::R2`) | pendiente |
| R3 | pendiente (`src/api/__tests__/health.test.ts::R3`) | pendiente |
| R4 | pendiente (`src/api/__tests__/health.test.ts::R4`) | pendiente |
| R5 | pendiente (`src/api/__tests__/health.test.ts::R5`) | pendiente |
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

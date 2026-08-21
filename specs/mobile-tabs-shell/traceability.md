---
feature: "mobile-tabs-shell"
status: draft        # draft | approved
tags: [harness, spec, mobile]
---

# Trazabilidad — [[mobile-tabs-shell]]

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `mobile-pet-tracker/src/app/(tabs)/__tests__/layout.test.tsx::R1: (tabs) exige sesión` | `929d6b2` test rojo → `0822ba7` feat verde |
| R2 | `mobile-pet-tracker/src/app/(auth)/__tests__/layout.test.tsx::R2: (auth) expulsa sesiones activas` | `c1dc47d` test rojo → `b3028d1` feat verde |
| R3 | pendiente | pendiente |
| R4 | pendiente | pendiente |
| R5 | pendiente | pendiente |
| R6 | pendiente | pendiente |
| R7 | pendiente | pendiente |
| R8 | pendiente | pendiente |
| R9 | pendiente (verificación por comando, sin test) | pendiente |
| R10 | pendiente (verificación del reviewer) | pendiente |
| R11 | pendiente (checkbox humano en requirements.md) | pendiente |

Regla: el reviewer no aprueba si alguna fila queda "pendiente".
Convención de commit: `feat(mobile): <desc> (R1,R2)`.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).

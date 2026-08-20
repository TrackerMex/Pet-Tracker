---
feature: "mobile-ui-foundation"
status: draft        # draft | approved
tags: [harness, spec, mobile]
---

# Trazabilidad — [[mobile-ui-foundation]]

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | estructural (reviewer: diff package.json/bun.lock + `bun install` exit 0) — cubierto por el rojo→verde de R6 | pendiente |
| R2 | estructural (reviewer vs [[design]] §D2) — cubierto por el rojo→verde de R6 | pendiente |
| R3 | estructural (reviewer vs [[design]] §D6) + smoke R12 | pendiente |
| R4 | `bun run --cwd mobile-pet-tracker typecheck` exit 0 sin Metro (CI) | pendiente |
| R5 | estructural (reviewer vs [[design]] §D3) + suite de #31 verde + smoke R12 | pendiente |
| R6 | `mobile-pet-tracker/src/components/__tests__/heroui-smoke.test.tsx`::`describe('R6: ...')` — **commit rojo previo obligatorio** | pendiente |
| R7 | `mobile-pet-tracker/src/app/__tests__/index.test.tsx`::`describe('R7: ...')` (guarda de #31, asserts intactos) + grep `StyleSheet` vacío | pendiente |
| R8 | suite completa verde (`bun run --cwd mobile-pet-tracker test`) tras el rojo del spike | pendiente |
| R9 | estructural (reviewer vs [[design]] §D8) | pendiente |
| R10 | reviewer: sección "Convenciones de la app móvil" en `docs/conventions.md` con el contenido mínimo de R10 | pendiente |
| R11 | `git diff --stat main...HEAD -- backend-pet-tracker/` vacío | pendiente |
| R12 | checklist del gate humano en [[requirements]] §R12 (fecha + firma) | pendiente — humano |

Regla: el reviewer no aprueba si alguna fila queda "pendiente" (R12 la cierra
el humano, no Codex).
Convención de commit: `feat(mobile-ui-foundation): <desc> (R1,R2)`.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C4/C5).
Nota C4: R1–R3, R8 (config) trazan al ciclo rojo→verde del spike R6; R9 es
config sin test posible (excepción declarada en [[requirements]]); R7 es
refactor bajo la guarda verde heredada de #31.

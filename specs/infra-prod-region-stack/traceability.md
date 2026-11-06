---
feature: "infra-prod-region-stack"
status: approved     # draft | approved
tags: [harness, spec, infra, produccion]
---

# Trazabilidad — [[infra-prod-region-stack]]

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | pendiente | pendiente |
| R2 | pendiente | pendiente |
| R3 | pendiente | pendiente |
| R4 | pendiente | pendiente |
| R5 | pendiente | pendiente |
| R6 | pendiente | pendiente |
| R7 | pendiente | pendiente |
| R8 | pendiente | pendiente |
| R9 | pendiente | pendiente |
| R10 | pendiente | pendiente |
| R11 | pendiente | pendiente |
| R12 | pendiente | pendiente |
| R13 | pendiente | pendiente |
| R14 | pendiente | pendiente |
| R15 | pendiente | pendiente |
| R16 | pendiente | pendiente |
| R17 | pendiente | pendiente |
| R18 | pendiente | pendiente |
| R19 | pendiente | pendiente |
| R20 | pendiente | pendiente |

Regla: el reviewer no aprueba si alguna fila queda "pendiente".
Convención de commit: rojo `test(infra-prod-region-stack): <desc> (R<n>)`,
verde `feat(infra-prod-region-stack): <desc> (R<n>)`.
Cada fila lista todos los `it` del requisito (prefijo `#246 R<n>:`) en
`infra/test/build-app.test.ts` o `infra/test/pet-tracker-prod-stack.test.ts`,
y los hashes del rojo y del verde con el mensaje del verde.
El implementer rellena esta tabla en el cierre ([[tasks]] §Cierre paso 7); el
reviewer la valida al aprobar (ver [[../../docs/specs|specs]] y
[[../../CHECKPOINTS|CHECKPOINTS]] C5).

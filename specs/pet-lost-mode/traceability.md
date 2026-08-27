---
feature: "pet-lost-mode"
status: draft        # draft | approved
tags: [harness, spec, backend, mobile]
---

# Trazabilidad — [[pet-lost-mode]]

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | pendiente | pendiente |
| R2 | pendiente | pendiente |
| R3 | pendiente | pendiente |
| R4 | pendiente | pendiente |
| R5 | pendiente | pendiente |
| R6 | pendiente | pendiente |
| R7 | pendiente | pendiente |
| R8 | pendiente (verificación de comandos, sin test propio) | pendiente |
| R9 | pendiente (smoke humano — registra el humano) | pendiente |

Regla: el reviewer no aprueba si alguna fila queda "pendiente" — para R8
la fila registra los comandos ejecutados y para R9 el smoke lo registra el
humano en `progress/impl_pet-lost-mode.md` antes de que la feature pase a
`done` (ver [[requirements]] §Aprobación, segunda casilla).
Convención de commit: `feat(<scope>): <desc> (R1,R2)`.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).

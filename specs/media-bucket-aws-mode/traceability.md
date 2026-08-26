---
feature: "media-bucket-aws-mode"
status: draft        # draft | approved
tags: [harness, spec, backend]
---

# Trazabilidad — [[media-bucket-aws-mode]]

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | pendiente | pendiente |
| R2 | pendiente | pendiente |
| R3 | pendiente | pendiente |
| R4 | pendiente | pendiente |
| R5 | pendiente (skip local verificable por IA; round-trip real solo humano) | pendiente |

Regla: el reviewer no aprueba si alguna fila queda "pendiente" — para R5 la
fila del implementer cubre la suite gated y su skip en modo local; el
round-trip real lo registra el humano en
`progress/impl_media-bucket-aws-mode.md` antes de que la feature pase a
`done` (ver [[requirements]] §Aprobación, segunda casilla).
Convención de commit: `feat(<scope>): <desc> (R1,R2)`.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).

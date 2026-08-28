---
feature: "auth-forgot-password"
status: approved     # draft | approved
tags: [harness, spec, backend]
---

# Trazabilidad — [[auth-forgot-password]]

Rutas de test relativas a `backend-pet-tracker/` (`src/…` para unitarios,
`test/…` para e2e).

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
| R12 | `src/db/schema/password-reset-tokens.schema.spec.ts::R12: password_reset_tokens espeja el patron de email_verification_tokens` | `64230ee` rojo → `9cd8473 feat(auth-forgot-password): add reset token table and migration (R12)` |
| R13 | pendiente | pendiente |

Regla: el reviewer no aprueba si alguna fila queda "pendiente".
Convención de commit: `feat(<scope>): <desc> (R1,R2)`.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).

Los nombres exactos de cada `describe` están fijados en [[requirements]] y
repetidos en [[tasks]]: al rellenar una fila se copian literalmente, no se
reescriben.

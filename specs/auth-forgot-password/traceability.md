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
| R1 | `src/modules/auth/application/use-cases/request-password-reset.use-case.spec.ts::R1: la solicitud con cuenta existente emite un token hasheado con expiracion de una hora`; `src/modules/auth/infrastructure/auth.controller.spec.ts::R1: POST /v1/auth/forgot-password responde 200 con requested true` | `a40ceb2` rojo → `b3e0aaf feat(auth-forgot-password): issue hashed reset token for existing account (R1)` |
| R2 | `src/modules/auth/application/use-cases/request-password-reset.use-case.spec.ts::R2: la solicitud con email inexistente no emite token ni revela la ausencia de cuenta`; `src/modules/auth/infrastructure/auth.controller.spec.ts::R2: POST /v1/auth/forgot-password responde igual exista o no la cuenta`; `test/auth-forgot-password.e2e-spec.ts::R2: forgot-password responde identico para cuenta existente e inexistente` | `97e2c4b` rojo → `bfa3f8c feat(auth-forgot-password): return uniform response for unknown email (R2)` |
| R3 | `src/modules/auth/infrastructure/auth.controller.spec.ts::R3: POST /v1/auth/forgot-password con payload invalido responde 400` | `080817e` rojo → `9d1f7e7 feat(auth-forgot-password): validate forgot request payload (R3)` |
| R4 | `src/modules/auth/application/use-cases/request-password-reset.use-case.spec.ts::R4: una nueva solicitud invalida los tokens de reset anteriores del usuario`; `test/auth-forgot-password.e2e-spec.ts::R4: el token anterior deja de servir cuando se pide uno nuevo` | `25abbdd` rojo → `721c580 feat(auth-forgot-password): invalidate prior reset tokens before issue (R4)` |
| R5 | `src/modules/auth/application/use-cases/reset-password.use-case.spec.ts::R5: el token vigente cambia el password y consume todos los tokens del usuario`; `src/modules/auth/infrastructure/auth.controller.spec.ts::R5: POST /v1/auth/reset-password con token valido responde 200`; `test/auth-forgot-password.e2e-spec.ts::R5: el reset persiste un password_hash nuevo y consume el token` | `e36de77` rojo → `e531f63 feat(auth-forgot-password): reset password and verify login round-trip (R5,R9)` |
| R6 | `src/modules/auth/application/use-cases/reset-password.use-case.spec.ts::R6: un token inexistente o ya consumido no cambia ningun password`; `src/modules/auth/infrastructure/auth.controller.spec.ts::R6: POST /v1/auth/reset-password con token invalido o usado responde 400` | `1e62765` rojo → `ff042c0 feat(auth-forgot-password): reject invalid and used reset tokens (R6)` |
| R7 | `src/modules/auth/application/use-cases/reset-password.use-case.spec.ts::R7: un token expirado no cambia el password`; `src/modules/auth/infrastructure/auth.controller.spec.ts::R7: POST /v1/auth/reset-password con token expirado responde 410` | `ac3af27` rojo → `e1bc6cf feat(auth-forgot-password): reject expired reset tokens with 410 (R7)` |
| R8 | `src/modules/auth/infrastructure/auth.controller.spec.ts::R8: POST /v1/auth/reset-password con payload invalido responde 400` | `56054ce` rojo → `2142d49 feat(auth-forgot-password): validate reset password payload (R8)` |
| R9 | `test/auth-forgot-password.e2e-spec.ts::R9: tras el reset el login viejo falla y el nuevo funciona` | `106349c` rojo → `e531f63 feat(auth-forgot-password): reset password and verify login round-trip (R5,R9)` |
| R10 | `src/modules/auth/infrastructure/email/console-password-reset-sender.spec.ts::R10: con EMAIL_ENABLED=false el token de reset se loguea en vez de enviarse`; `src/modules/auth/infrastructure/email/console-password-reset-sender.spec.ts::R10: con EMAIL_ENABLED=true avisa de que no hay proveedor real cableado`; `src/modules/auth/infrastructure/auth.controller.spec.ts::R10: la respuesta de forgot-password nunca incluye el token`; `test/auth-forgot-password.e2e-spec.ts::R10: la base guarda el SHA-256 del token, nunca el valor en claro` | `f699540` rojo → `44fecd5 feat(auth-forgot-password): deliver reset token through structured log (R10)` |
| R11 | `src/modules/auth/application/use-cases/request-password-reset.use-case.spec.ts::R11: la solicitud con cuenta existente audita user.password_reset_requested y la inexistente no audita nada`; `src/modules/auth/application/use-cases/reset-password.use-case.spec.ts::R11: el reset exitoso audita user.password_reset` | `4e05906` rojo → `4324e31 feat(auth-forgot-password): audit reset request and completion (R11)` |
| R12 | `src/db/schema/password-reset-tokens.schema.spec.ts::R12: password_reset_tokens espeja el patron de email_verification_tokens` | `64230ee` rojo → `9cd8473 feat(auth-forgot-password): add reset token table and migration (R12)` |
| R13 | pendiente | pendiente |

Regla: el reviewer no aprueba si alguna fila queda "pendiente".
Convención de commit: `feat(<scope>): <desc> (R1,R2)`.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).

Los nombres exactos de cada `describe` están fijados en [[requirements]] y
repetidos en [[tasks]]: al rellenar una fila se copian literalmente, no se
reescriben.

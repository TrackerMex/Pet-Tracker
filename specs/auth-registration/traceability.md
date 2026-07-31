---
feature: "auth-registration"
status: approved     # draft | approved
tags: [harness, spec]
---

# Trazabilidad — [[auth-registration]]

Rutas de test relativas a `backend-pet-tracker/src/`.

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `modules/auth/application/use-cases/register-user.use-case.spec.ts::R1: el registro valido crea el usuario con los datos del payload`; `modules/auth/infrastructure/auth.controller.spec.ts::R1: POST /v1/auth/register responde 201 con el usuario creado`; `modules/auth/infrastructure/repositories/user.drizzle.repository.spec.ts::R1: el repositorio genera el id del usuario como UUIDv7 en la app`; `modules/auth/infrastructure/security/argon2-password-hasher.spec.ts::R1: el password se persiste hasheado con argon2id, nunca en claro` | `92dbda4` feat(auth-registration): POST /v1/auth/register with argon2id hashing (R1,R2,R3,R4,R5,R14,R15) |
| R2 | `modules/auth/application/use-cases/register-user.use-case.spec.ts::R2: el email ya registrado no crea otro usuario`; `modules/auth/infrastructure/auth.controller.spec.ts::R2: POST /v1/auth/register con email duplicado responde 409` | `92dbda4` feat(auth-registration): POST /v1/auth/register with argon2id hashing (R1,R2,R3,R4,R5,R14,R15) |
| R3 | `modules/auth/infrastructure/auth.controller.spec.ts::R3: POST /v1/auth/register con passwordConfirmation distinta responde 400`; `modules/auth/application/dto/register-user.dto.spec.ts::R3: passwordConfirmation distinto de password es invalido` | `92dbda4` feat(auth-registration): POST /v1/auth/register with argon2id hashing (R1,R2,R3,R4,R5,R14,R15) |
| R4 | `modules/auth/infrastructure/auth.controller.spec.ts::R4: POST /v1/auth/register sin termsAccepted responde 400`; `modules/auth/application/dto/register-user.dto.spec.ts::R4: termsAccepted ausente o false es invalido` | `92dbda4` feat(auth-registration): POST /v1/auth/register with argon2id hashing (R1,R2,R3,R4,R5,R14,R15) |
| R5 | `modules/auth/infrastructure/auth.controller.spec.ts::R5: POST /v1/auth/register con payload invalido responde 400 con el detalle de validacion`; `modules/auth/application/dto/register-user.dto.spec.ts::R5: el payload que no valida contra el schema zod es invalido` | `92dbda4` feat(auth-registration): POST /v1/auth/register with argon2id hashing (R1,R2,R3,R4,R5,R14,R15) |
| R6 | `modules/auth/application/use-cases/register-user.use-case.spec.ts::R6: el registro emite un token de verificacion con expiracion y lo entrega al sender`; `modules/auth/application/verification-token.spec.ts::R6: el token de verificacion es opaco, aleatorio y se guarda hasheado`; `modules/auth/infrastructure/email/console-email-verification-sender.spec.ts::R6: con EMAIL_ENABLED=false el token se loguea en vez de enviarse por email` | `870f253` feat(auth-registration): issue single-use email verification token on register (R6,R7) |
| R7 | `modules/auth/infrastructure/auth.controller.spec.ts::R7: la respuesta de registro nunca incluye el token de verificacion`; `modules/auth/application/use-cases/register-user.use-case.spec.ts::R7: el token de verificacion no viaja en el resultado del registro`; `modules/auth/infrastructure/email/console-email-verification-sender.spec.ts::R7: el token solo es observable en el log del servidor` | `870f253` feat(auth-registration): issue single-use email verification token on register (R6,R7) |
| R8 | `modules/auth/application/use-cases/verify-email.use-case.spec.ts::R8: el token valido y vigente verifica el email y queda consumido`; `modules/auth/infrastructure/auth.controller.spec.ts::R8: POST /v1/auth/verify-email con token valido responde 200` | `c21ce31` feat(auth-registration): POST /v1/auth/verify-email single-use token flow (R8,R9,R10,R11,R13) |
| R9 | `modules/auth/application/use-cases/verify-email.use-case.spec.ts::R9: un token inexistente no verifica ningun email`; `modules/auth/infrastructure/auth.controller.spec.ts::R9: POST /v1/auth/verify-email con token inexistente responde 400` | `c21ce31` feat(auth-registration): POST /v1/auth/verify-email single-use token flow (R8,R9,R10,R11,R13) |
| R10 | `modules/auth/application/use-cases/verify-email.use-case.spec.ts::R10: un token expirado no verifica el email`; `modules/auth/infrastructure/auth.controller.spec.ts::R10: POST /v1/auth/verify-email con token expirado responde 410` | `c21ce31` feat(auth-registration): POST /v1/auth/verify-email single-use token flow (R8,R9,R10,R11,R13) |
| R11 | `modules/auth/application/use-cases/verify-email.use-case.spec.ts::R11: un token ya usado no se puede reutilizar`; `modules/auth/infrastructure/auth.controller.spec.ts::R11: POST /v1/auth/verify-email con token ya usado responde 400` | `c21ce31` feat(auth-registration): POST /v1/auth/verify-email single-use token flow (R8,R9,R10,R11,R13) |
| R12 | `modules/auth/application/use-cases/register-user.use-case.spec.ts::R12: el registro exitoso deja una entrada user.register en audit_log` | `e964260` feat(auth-registration): audit successful registrations (R12) |
| R13 | `modules/auth/application/use-cases/verify-email.use-case.spec.ts::R13: la verificacion exitosa deja una entrada user.email_verified en audit_log` | `c21ce31` feat(auth-registration): POST /v1/auth/verify-email single-use token flow (R8,R9,R10,R11,R13) |
| R14 | `modules/auth/infrastructure/mappers/user-response.mapper.spec.ts::R14: la serializacion de un usuario excluye password_hash`; `modules/auth/infrastructure/auth.controller.spec.ts::R14: la respuesta de registro nunca expone password_hash` | `92dbda4` feat(auth-registration): POST /v1/auth/register with argon2id hashing (R1,R2,R3,R4,R5,R14,R15) |
| R15 | `modules/auth/application/use-cases/register-user.use-case.spec.ts::R15: passwordConfirmation nunca se persiste`; `modules/auth/infrastructure/repositories/user.drizzle.repository.spec.ts::R15: passwordConfirmation nunca se persiste` | `92dbda4` feat(auth-registration): POST /v1/auth/register with argon2id hashing (R1,R2,R3,R4,R5,R14,R15) |

Regla: el reviewer no aprueba si alguna fila queda "pendiente".
Convención de commit: `feat(<scope>): <desc> (R1,R2)`.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).

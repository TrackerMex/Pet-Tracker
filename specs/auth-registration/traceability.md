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
| R6 | pendiente | pendiente |
| R7 | pendiente | pendiente |
| R8 | pendiente | pendiente |
| R9 | pendiente | pendiente |
| R10 | pendiente | pendiente |
| R11 | pendiente | pendiente |
| R12 | pendiente | pendiente |
| R13 | pendiente | pendiente |
| R14 | `modules/auth/infrastructure/mappers/user-response.mapper.spec.ts::R14: la serializacion de un usuario excluye password_hash`; `modules/auth/infrastructure/auth.controller.spec.ts::R14: la respuesta de registro nunca expone password_hash` | `92dbda4` feat(auth-registration): POST /v1/auth/register with argon2id hashing (R1,R2,R3,R4,R5,R14,R15) |
| R15 | `modules/auth/application/use-cases/register-user.use-case.spec.ts::R15: passwordConfirmation nunca se persiste`; `modules/auth/infrastructure/repositories/user.drizzle.repository.spec.ts::R15: passwordConfirmation nunca se persiste` | `92dbda4` feat(auth-registration): POST /v1/auth/register with argon2id hashing (R1,R2,R3,R4,R5,R14,R15) |

Regla: el reviewer no aprueba si alguna fila queda "pendiente".
Convención de commit: `feat(<scope>): <desc> (R1,R2)`.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).

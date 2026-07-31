---
feature: "auth-login-me"
status: draft        # draft | approved
tags: [harness, spec]
---

# Trazabilidad — [[auth-login-me]]

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `application/use-cases/login-user.use-case.spec.ts::R1`, `infrastructure/auth.controller.spec.ts::R1 (auth-login-me)`, `infrastructure/repositories/user.drizzle.repository.spec.ts::R1 (auth-login-me)`, `infrastructure/security/jwt-token-service.spec.ts::R1/R8` | `501bd01` |
| R2 | `application/use-cases/login-user.use-case.spec.ts::R2`, `infrastructure/auth.controller.spec.ts::R2 (auth-login-me)` | `501bd01` |
| R3 | `application/dto/login-user.dto.spec.ts::R3`, `infrastructure/auth.controller.spec.ts::R3 (auth-login-me)` | `501bd01` |
| R4 | `application/use-cases/login-user.use-case.spec.ts::R4`, `infrastructure/security/jwt-token-service.spec.ts::R4` | `501bd01` |
| R5 | `infrastructure/guards/auth.guard.spec.ts::R5` | `42310f6` |
| R6 | `infrastructure/guards/auth.guard.spec.ts::R6` | `42310f6` |
| R7 | `infrastructure/guards/auth.guard.spec.ts::R7`, `infrastructure/decorators/public.decorator.spec.ts::R7`, `modules/health/infrastructure/health.controller.spec.ts::R7` | `42310f6` |
| R8 | `infrastructure/guards/auth.guard.spec.ts::R8`, `infrastructure/decorators/current-user.decorator.spec.ts::R8` | `42310f6` |
| R9 | pendiente | pendiente |
| R10 | pendiente | pendiente |
| R11 | pendiente | pendiente |
| R12 | pendiente | pendiente |
| R13 | pendiente | pendiente |
| R14 | pendiente | pendiente |
| R15 | `infrastructure/auth.controller.spec.ts::R15 (auth-login-me)` (login) — pendiente de completar con GET/PATCH /v1/me | pendiente |

Regla: el reviewer no aprueba si alguna fila queda "pendiente".
Convención de commit: `feat(<scope>): <desc> (R1,R2)`.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).

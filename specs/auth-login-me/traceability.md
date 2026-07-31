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
| R9 | `application/use-cases/get-profile.use-case.spec.ts::R9`, `infrastructure/mappers/profile-response.mapper.spec.ts::R9`, `infrastructure/users.controller.spec.ts::R9` | `4c37f52` |
| R10 | `application/dto/update-profile.dto.spec.ts::R10`, `application/use-cases/update-profile.use-case.spec.ts::R10`, `infrastructure/users.controller.spec.ts::R10` | `f87f45b` |
| R11 | `application/dto/update-profile.dto.spec.ts::R11`, `infrastructure/users.controller.spec.ts::R11` | `f87f45b` |
| R12 | `application/dto/country.schema.spec.ts::R12`, `application/dto/update-profile.dto.spec.ts::R12`, `infrastructure/users.controller.spec.ts::R12` | `f87f45b` |
| R13 | `application/dto/update-profile.dto.spec.ts::R13`, `application/use-cases/update-profile.use-case.spec.ts::R13`, `infrastructure/users.controller.spec.ts::R13` | `f87f45b` |
| R14 | `application/use-cases/update-profile.use-case.spec.ts::R14` | `f87f45b` |
| R15 | `infrastructure/auth.controller.spec.ts::R15 (auth-login-me)` (login), `infrastructure/mappers/profile-response.mapper.spec.ts::R15` (GET), `infrastructure/users.controller.spec.ts::R15` (PATCH) | `501bd01`, `4c37f52`, `f87f45b` |

Regla: el reviewer no aprueba si alguna fila queda "pendiente".
Convención de commit: `feat(<scope>): <desc> (R1,R2)`.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).

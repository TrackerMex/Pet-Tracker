---
feature: "auth-login-me"
status: draft        # draft | approved
tags: [harness, spec]
---

# Trazabilidad — [[auth-login-me]]

| Requisito | Test (archivo::nombre) | Commit (hash + mensaje) |
|---|---|---|
| R1 | `application/use-cases/login-user.use-case.spec.ts::R1`, `infrastructure/auth.controller.spec.ts::R1 (auth-login-me)`, `infrastructure/repositories/user.drizzle.repository.spec.ts::R1 (auth-login-me)`, `infrastructure/security/jwt-token-service.spec.ts::R1/R8` | `c54c43d` |
| R2 | `application/use-cases/login-user.use-case.spec.ts::R2`, `infrastructure/auth.controller.spec.ts::R2 (auth-login-me)` | `c54c43d` |
| R3 | `application/dto/login-user.dto.spec.ts::R3`, `infrastructure/auth.controller.spec.ts::R3 (auth-login-me)` | `c54c43d` |
| R4 | `application/use-cases/login-user.use-case.spec.ts::R4`, `infrastructure/security/jwt-token-service.spec.ts::R4` | `c54c43d` |
| R5 | `infrastructure/guards/auth.guard.spec.ts::R5`, `auth.module.spec.ts::R5` | `ab4972e`, `c8ab4d6` |
| R6 | `infrastructure/guards/auth.guard.spec.ts::R6` | `ab4972e` |
| R7 | `infrastructure/guards/auth.guard.spec.ts::R7`, `infrastructure/decorators/public.decorator.spec.ts::R7`, `modules/health/infrastructure/health.controller.spec.ts::R7` | `ab4972e` |
| R8 | `infrastructure/guards/auth.guard.spec.ts::R8`, `infrastructure/decorators/current-user.decorator.spec.ts::R8` | `ab4972e` |
| R9 | `application/use-cases/get-profile.use-case.spec.ts::R9`, `infrastructure/mappers/profile-response.mapper.spec.ts::R9`, `infrastructure/users.controller.spec.ts::R9` | `23c35eb` |
| R10 | `application/dto/update-profile.dto.spec.ts::R10`, `application/use-cases/update-profile.use-case.spec.ts::R10`, `infrastructure/users.controller.spec.ts::R10` | `bc59aa6` |
| R11 | `application/dto/update-profile.dto.spec.ts::R11`, `infrastructure/users.controller.spec.ts::R11` | `bc59aa6` |
| R12 | `application/dto/country.schema.spec.ts::R12`, `application/dto/update-profile.dto.spec.ts::R12`, `infrastructure/users.controller.spec.ts::R12` | `bc59aa6` |
| R13 | `application/dto/update-profile.dto.spec.ts::R13`, `application/use-cases/update-profile.use-case.spec.ts::R13`, `infrastructure/users.controller.spec.ts::R13` | `bc59aa6` |
| R14 | `application/use-cases/update-profile.use-case.spec.ts::R14` | `bc59aa6` |
| R15 | `infrastructure/auth.controller.spec.ts::R15 (auth-login-me)` (login), `infrastructure/mappers/profile-response.mapper.spec.ts::R15` (GET), `infrastructure/users.controller.spec.ts::R15` (PATCH) | `c54c43d`, `23c35eb`, `bc59aa6` |

Regla: el reviewer no aprueba si alguna fila queda "pendiente".
Convención de commit: `feat(<scope>): <desc> (R1,R2)`.
El implementer actualiza esta tabla tras cada commit; el reviewer la valida
al aprobar (ver [[../../docs/specs|specs]] y [[../../CHECKPOINTS|CHECKPOINTS]] C5).

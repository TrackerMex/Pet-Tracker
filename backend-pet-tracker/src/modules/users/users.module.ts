import { Module } from '@nestjs/common';
import { PetsModule } from '@/modules/pets/pets.module';
import { DeleteAccountUseCase } from '@/modules/users/application/use-cases/delete-account.use-case';
import { ACCOUNT_DELETION_REPOSITORY } from '@/modules/users/domain/repositories/account-deletion.repository';
import { AccountDeletionDrizzleRepository } from '@/modules/users/infrastructure/repositories/account-deletion.drizzle.repository';
import { AuthModule } from '@/modules/auth/auth.module';
import { DeletePushTokenUseCase } from './application/use-cases/delete-push-token.use-case';
import { GetProfileUseCase } from './application/use-cases/get-profile.use-case';
import { RegisterPushTokenUseCase } from './application/use-cases/register-push-token.use-case';
import { UpdateProfileUseCase } from './application/use-cases/update-profile.use-case';
import { PUSH_TOKEN_REPOSITORY } from './domain/repositories/push-token.repository';
import { PushTokenDrizzleRepository } from './infrastructure/repositories/push-token.drizzle.repository';
import { UsersController } from './infrastructure/users.controller';

/**
 * GET/PATCH /v1/me (auth-login-me R9-R14) y POST/DELETE /v1/me/push-tokens
 * (alerts-center-notifier R3-R6). Importa AuthModule para reutilizar el
 * USER_REPOSITORY que este exporta (design.md — mismo principio que
 * AuditLogger compartido, evita duplicar interface/token). AUDIT_LOGGER
 * (usado por UpdateProfileUseCase) no se declara aca: lo resuelve
 * AuditModule, que es @Global() (src/audit/audit.module.ts).
 *
 * PUSH_TOKEN_REPOSITORY se exporta para que NotifierModule lo inyecte (R8,
 * R12) sin duplicar el contrato de `push_tokens` en dos puertos — mismo
 * mecanismo por el que AlertsEngineModule importa PetsModule.
 */
@Module({
  imports: [AuthModule, PetsModule],
  controllers: [UsersController],
  providers: [
    DeleteAccountUseCase,
    {
      provide: ACCOUNT_DELETION_REPOSITORY,
      useClass: AccountDeletionDrizzleRepository,
    },
    GetProfileUseCase,
    UpdateProfileUseCase,
    RegisterPushTokenUseCase,
    DeletePushTokenUseCase,
    { provide: PUSH_TOKEN_REPOSITORY, useClass: PushTokenDrizzleRepository },
  ],
  exports: [PUSH_TOKEN_REPOSITORY],
})
export class UsersModule {}

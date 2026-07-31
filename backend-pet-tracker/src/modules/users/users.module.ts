import { Module } from '@nestjs/common';
import { AuthModule } from '@/modules/auth/auth.module';
import { GetProfileUseCase } from './application/use-cases/get-profile.use-case';
import { UsersController } from './infrastructure/users.controller';

/**
 * GET/PATCH /v1/me (auth-login-me R9-R14). Importa AuthModule para
 * reutilizar el USER_REPOSITORY que este exporta (design.md — mismo
 * principio que AuditLogger compartido, evita duplicar interface/token).
 */
@Module({
  imports: [AuthModule],
  controllers: [UsersController],
  providers: [GetProfileUseCase],
})
export class UsersModule {}

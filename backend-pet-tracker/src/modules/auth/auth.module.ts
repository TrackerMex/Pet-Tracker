import { Module } from '@nestjs/common';
import { RegisterUserUseCase } from './application/use-cases/register-user.use-case';
import { PASSWORD_HASHER } from './domain/ports/password-hasher';
import { USER_REPOSITORY } from './domain/repositories/user.repository';
import { AuthController } from './infrastructure/auth.controller';
import { UserDrizzleRepository } from './infrastructure/repositories/user.drizzle.repository';
import { Argon2PasswordHasher } from './infrastructure/security/argon2-password-hasher';

@Module({
  controllers: [AuthController],
  providers: [
    RegisterUserUseCase,
    {
      provide: USER_REPOSITORY,
      useClass: UserDrizzleRepository,
    },
    {
      provide: PASSWORD_HASHER,
      useClass: Argon2PasswordHasher,
    },
  ],
})
export class AuthModule {}

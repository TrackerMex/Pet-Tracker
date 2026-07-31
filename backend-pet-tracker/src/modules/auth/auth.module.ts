import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RegisterUserUseCase } from './application/use-cases/register-user.use-case';
import { EMAIL_VERIFICATION_SENDER } from './domain/ports/email-verification-sender';
import { PASSWORD_HASHER } from './domain/ports/password-hasher';
import { EMAIL_VERIFICATION_TOKEN_REPOSITORY } from './domain/repositories/email-verification-token.repository';
import { USER_REPOSITORY } from './domain/repositories/user.repository';
import { AuthController } from './infrastructure/auth.controller';
import { ConsoleEmailVerificationSender } from './infrastructure/email/console-email-verification-sender';
import { EmailVerificationTokenDrizzleRepository } from './infrastructure/repositories/email-verification-token.drizzle.repository';
import { UserDrizzleRepository } from './infrastructure/repositories/user.drizzle.repository';
import { Argon2PasswordHasher } from './infrastructure/security/argon2-password-hasher';

@Module({
  imports: [ConfigModule],
  controllers: [AuthController],
  providers: [
    RegisterUserUseCase,
    {
      provide: USER_REPOSITORY,
      useClass: UserDrizzleRepository,
    },
    {
      provide: EMAIL_VERIFICATION_TOKEN_REPOSITORY,
      useClass: EmailVerificationTokenDrizzleRepository,
    },
    {
      provide: PASSWORD_HASHER,
      useClass: Argon2PasswordHasher,
    },
    {
      provide: EMAIL_VERIFICATION_SENDER,
      useClass: ConsoleEmailVerificationSender,
    },
  ],
})
export class AuthModule {}

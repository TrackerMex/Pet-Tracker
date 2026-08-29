import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { LoginUserUseCase } from './application/use-cases/login-user.use-case';
import { RegisterUserUseCase } from './application/use-cases/register-user.use-case';
import { RequestPasswordResetUseCase } from './application/use-cases/request-password-reset.use-case';
import { ResetPasswordUseCase } from './application/use-cases/reset-password.use-case';
import { VerifyEmailUseCase } from './application/use-cases/verify-email.use-case';
import { EMAIL_VERIFICATION_SENDER } from './domain/ports/email-verification-sender';
import { PASSWORD_HASHER } from './domain/ports/password-hasher';
import { PASSWORD_RESET_SENDER } from './domain/ports/password-reset-sender';
import { TOKEN_SERVICE } from './domain/ports/token-service';
import { EMAIL_VERIFICATION_TOKEN_REPOSITORY } from './domain/repositories/email-verification-token.repository';
import { PASSWORD_RESET_TOKEN_REPOSITORY } from './domain/repositories/password-reset-token.repository';
import { USER_REPOSITORY } from './domain/repositories/user.repository';
import { AuthController } from './infrastructure/auth.controller';
import { ConsoleEmailVerificationSender } from './infrastructure/email/console-email-verification-sender';
import { ConsolePasswordResetSender } from './infrastructure/email/console-password-reset-sender';
import { AuthGuard } from './infrastructure/guards/auth.guard';
import { EmailVerificationTokenDrizzleRepository } from './infrastructure/repositories/email-verification-token.drizzle.repository';
import { PasswordResetTokenDrizzleRepository } from './infrastructure/repositories/password-reset-token.drizzle.repository';
import { UserDrizzleRepository } from './infrastructure/repositories/user.drizzle.repository';
import { Argon2PasswordHasher } from './infrastructure/security/argon2-password-hasher';
import { JwtTokenService } from './infrastructure/security/jwt-token-service';

@Module({
  imports: [ConfigModule],
  controllers: [AuthController],
  providers: [
    RegisterUserUseCase,
    VerifyEmailUseCase,
    LoginUserUseCase,
    RequestPasswordResetUseCase,
    ResetPasswordUseCase,
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
      provide: PASSWORD_RESET_TOKEN_REPOSITORY,
      useClass: PasswordResetTokenDrizzleRepository,
    },
    {
      provide: EMAIL_VERIFICATION_SENDER,
      useClass: ConsoleEmailVerificationSender,
    },
    {
      provide: PASSWORD_RESET_SENDER,
      useClass: ConsolePasswordResetSender,
    },
    {
      provide: TOKEN_SERVICE,
      useClass: JwtTokenService,
    },
    // APP_GUARD: token especial de Nest que aplica el guard a nivel de toda
    // la app sin necesitar @Global() (design.md `auth-login-me` R5-R7).
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  // USER_REPOSITORY se reexporta para que UsersModule (GET/PATCH /v1/me) lo
  // reutilice sin duplicar la interface ni el token (docs/architecture.md).
  exports: [USER_REPOSITORY],
})
export class AuthModule {}

import 'reflect-metadata';
import { Global, Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import { AUDIT_LOGGER } from '@/audit/audit-log.repository';
import { DRIZZLE } from '@/db/drizzle.constants';
import { LoginUserUseCase } from './application/use-cases/login-user.use-case';
import { RegisterUserUseCase } from './application/use-cases/register-user.use-case';
import { RequestPasswordResetUseCase } from './application/use-cases/request-password-reset.use-case';
import { ResetPasswordUseCase } from './application/use-cases/reset-password.use-case';
import { VerifyEmailUseCase } from './application/use-cases/verify-email.use-case';
import { EMAIL_VERIFICATION_SENDER } from './domain/ports/email-verification-sender';
import { PASSWORD_RESET_SENDER } from './domain/ports/password-reset-sender';
import { AuthModule } from './auth.module';
import { AuthController } from './infrastructure/auth.controller';
import { ConsoleEmailVerificationSender } from './infrastructure/email/console-email-verification-sender';
import { ConsolePasswordResetSender } from './infrastructure/email/console-password-reset-sender';
import { ResendEmailVerificationSender } from './infrastructure/email/resend-email-verification-sender';
import { ResendPasswordResetSender } from './infrastructure/email/resend-password-reset-sender';
import { AuthGuard } from './infrastructure/guards/auth.guard';

// Sustituye a DrizzleModule y AuditModule (ambos @Global en la app real) para
// compilar AuthModule sin Postgres.
@Global()
@Module({
  providers: [
    { provide: DRIZZLE, useValue: {} },
    { provide: AUDIT_LOGGER, useValue: { record: jest.fn() } },
  ],
  exports: [DRIZZLE, AUDIT_LOGGER],
})
class FakeSharedInfrastructureModule {}

describe('AuthModule: la inyeccion de dependencias resuelve todos los tokens', () => {
  const previousJwtSecret = process.env.JWT_SECRET;

  beforeAll(() => {
    process.env.JWT_SECRET = 'test-jwt-secret';
  });

  afterAll(() => {
    process.env.JWT_SECRET = previousJwtSecret;
  });

  it('instancia el controller y los cinco casos de uso', async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [FakeSharedInfrastructureModule, AuthModule],
    }).compile();

    expect(moduleRef.get(AuthController)).toBeInstanceOf(AuthController);
    expect(moduleRef.get(RegisterUserUseCase)).toBeInstanceOf(
      RegisterUserUseCase,
    );
    expect(moduleRef.get(VerifyEmailUseCase)).toBeInstanceOf(
      VerifyEmailUseCase,
    );
    expect(moduleRef.get(LoginUserUseCase)).toBeInstanceOf(LoginUserUseCase);
    expect(moduleRef.get(RequestPasswordResetUseCase)).toBeInstanceOf(
      RequestPasswordResetUseCase,
    );
    expect(moduleRef.get(ResetPasswordUseCase)).toBeInstanceOf(
      ResetPasswordUseCase,
    );

    await moduleRef.close();
  });

  // APP_GUARD nunca es recuperable via moduleRef.get(APP_GUARD): Nest
  // reempaqueta esos providers bajo tokens unicos internos del core module.
  // El wiring se verifica sobre la metadata del decorador @Module, que es
  // exactamente lo que Nest lee al registrar el guard global (R5).
  it('R5: registra AuthGuard como guard global via APP_GUARD', () => {
    const providers = Reflect.getMetadata('providers', AuthModule) as unknown[];

    expect(providers).toContainEqual({
      provide: APP_GUARD,
      useClass: AuthGuard,
    });
  });
});

describe('R3 (auth-email-delivery): EMAIL_ENABLED selecciona los adaptadores Resend para los dos puertos', () => {
  const previousEnv = {
    emailEnabled: process.env.EMAIL_ENABLED,
    jwtSecret: process.env.JWT_SECRET,
    resendApiKey: process.env.RESEND_API_KEY,
    resendFrom: process.env.RESEND_FROM,
  };

  afterAll(() => {
    restoreEnv('EMAIL_ENABLED', previousEnv.emailEnabled);
    restoreEnv('JWT_SECRET', previousEnv.jwtSecret);
    restoreEnv('RESEND_API_KEY', previousEnv.resendApiKey);
    restoreEnv('RESEND_FROM', previousEnv.resendFrom);
  });

  it('resuelve los dos puertos con Resend solo para el valor literal true', async () => {
    process.env.JWT_SECRET = 'test-jwt-secret';
    process.env.EMAIL_ENABLED = 'true';
    process.env.RESEND_API_KEY = 'api-key-for-r3';
    process.env.RESEND_FROM = 'sender@example.com';

    const enabledModule = await Test.createTestingModule({
      imports: [FakeSharedInfrastructureModule, AuthModule],
    }).compile();

    expect(enabledModule.get(PASSWORD_RESET_SENDER)).toBeInstanceOf(
      ResendPasswordResetSender,
    );
    expect(enabledModule.get(EMAIL_VERIFICATION_SENDER)).toBeInstanceOf(
      ResendEmailVerificationSender,
    );
    await enabledModule.close();

    process.env.EMAIL_ENABLED = 'false';
    const disabledModule = await Test.createTestingModule({
      imports: [FakeSharedInfrastructureModule, AuthModule],
    }).compile();

    expect(disabledModule.get(PASSWORD_RESET_SENDER)).toBeInstanceOf(
      ConsolePasswordResetSender,
    );
    expect(disabledModule.get(EMAIL_VERIFICATION_SENDER)).toBeInstanceOf(
      ConsoleEmailVerificationSender,
    );
    await disabledModule.close();
  });
});

function restoreEnv(name: string, value: string | undefined): void {
  if (value === undefined) {
    delete process.env[name];
  } else {
    process.env[name] = value;
  }
}

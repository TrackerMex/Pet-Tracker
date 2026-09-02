import 'reflect-metadata';
import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
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
import { MissingResendConfigError } from './infrastructure/email/resend-client';
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

type AuthTestConfig = Record<string, string | undefined>;

function compileAuthModule(config: AuthTestConfig) {
  return Test.createTestingModule({
    imports: [FakeSharedInfrastructureModule, AuthModule],
  })
    .overrideProvider(ConfigService)
    .useValue({
      get: (key: string): string | undefined => config[key],
      getOrThrow: (key: string): string => {
        const value = config[key];
        if (value === undefined) {
          throw new Error(`Missing test config: ${key}`);
        }
        return value;
      },
    })
    .compile();
}

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
  it('resuelve los dos puertos con Resend solo para el valor literal true', async () => {
    const enabledModule = await compileAuthModule({
      EMAIL_ENABLED: 'true',
      JWT_SECRET: 'test-jwt-secret',
      RESEND_API_KEY: 'api-key-for-r3',
      RESEND_FROM: 'sender@example.com',
    });

    expect(enabledModule.get(PASSWORD_RESET_SENDER)).toBeInstanceOf(
      ResendPasswordResetSender,
    );
    expect(enabledModule.get(EMAIL_VERIFICATION_SENDER)).toBeInstanceOf(
      ResendEmailVerificationSender,
    );
    await enabledModule.close();

    const disabledModule = await compileAuthModule({
      EMAIL_ENABLED: 'false',
      JWT_SECRET: 'test-jwt-secret',
    });

    expect(disabledModule.get(PASSWORD_RESET_SENDER)).toBeInstanceOf(
      ConsolePasswordResetSender,
    );
    expect(disabledModule.get(EMAIL_VERIFICATION_SENDER)).toBeInstanceOf(
      ConsoleEmailVerificationSender,
    );
    await disabledModule.close();
  });
});

describe('R4 (auth-email-delivery): EMAIL_ENABLED=true sin RESEND_API_KEY aborta el arranque', () => {
  it('rechaza la compilacion cuando falta RESEND_API_KEY', async () => {
    const compilation = compileAuthModule({
      EMAIL_ENABLED: 'true',
      JWT_SECRET: 'test-jwt-secret',
      RESEND_FROM: 'sender@example.com',
    });

    await expect(compilation).rejects.toThrow(MissingResendConfigError);
  });

  it('rechaza la compilacion cuando falta RESEND_FROM', async () => {
    const compilation = compileAuthModule({
      EMAIL_ENABLED: 'true',
      JWT_SECRET: 'test-jwt-secret',
      RESEND_API_KEY: 'api-key-for-r4',
    });

    await expect(compilation).rejects.toThrow(MissingResendConfigError);
  });
});

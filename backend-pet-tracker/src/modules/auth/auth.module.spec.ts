import 'reflect-metadata';
import { Global, Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import { AUDIT_LOGGER } from '@/audit/audit-log.repository';
import { DRIZZLE } from '@/db/drizzle.constants';
import { LoginUserUseCase } from './application/use-cases/login-user.use-case';
import { RegisterUserUseCase } from './application/use-cases/register-user.use-case';
import { VerifyEmailUseCase } from './application/use-cases/verify-email.use-case';
import { AuthModule } from './auth.module';
import { AuthController } from './infrastructure/auth.controller';
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

  it('instancia el controller y los tres casos de uso', async () => {
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

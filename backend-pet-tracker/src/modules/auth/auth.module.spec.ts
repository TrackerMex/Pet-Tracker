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

// SEGFAULT CONOCIDO EN ESTE SANDBOX (no en CI de GitHub, ver
// progress/impl_auth-login-me.md): AuthModule declara Argon2PasswordHasher
// como provider real; con solo importar este archivo, `require('argon2')`
// hace segfaultear el proceso de Jest. No se pudo confirmar en ejecucion
// local que auth-login-me R1/R4/R5/R7/R8 (guard/TokenService/LoginUserUseCase
// via DI real) queden correctamente resueltos por Nest — se verifico
// manualmente leyendo el modulo y por los tests unitarios con dobles
// (login-user.use-case.spec.ts, auth.guard.spec.ts, etc.) que si corren.
describe('AuthModule: la inyeccion de dependencias resuelve todos los tokens', () => {
  const previousJwtSecret = process.env.JWT_SECRET;

  beforeAll(() => {
    process.env.JWT_SECRET = 'test-jwt-secret';
  });

  afterAll(() => {
    process.env.JWT_SECRET = previousJwtSecret;
  });

  it('instancia el controller, los tres casos de uso y el guard global', async () => {
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
    // APP_GUARD, no AuthGuard: es el token bajo el que Nest lo resuelve
    // cuando se registra { provide: APP_GUARD, useClass: AuthGuard }.
    expect(moduleRef.get(APP_GUARD)).toBeInstanceOf(AuthGuard);

    await moduleRef.close();
  });
});

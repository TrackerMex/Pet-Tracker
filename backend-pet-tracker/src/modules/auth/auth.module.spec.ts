import { Global, Module } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AUDIT_LOGGER } from '@/audit/audit-log.repository';
import { DRIZZLE } from '@/db/drizzle.constants';
import { RegisterUserUseCase } from './application/use-cases/register-user.use-case';
import { VerifyEmailUseCase } from './application/use-cases/verify-email.use-case';
import { AuthModule } from './auth.module';
import { AuthController } from './infrastructure/auth.controller';

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
  it('instancia el controller y los dos casos de uso', async () => {
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

    await moduleRef.close();
  });
});

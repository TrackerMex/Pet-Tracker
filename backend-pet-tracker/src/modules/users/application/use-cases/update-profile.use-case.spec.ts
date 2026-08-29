import { AuditLogEntry, AuditLogger } from '@/audit/audit-log.repository';
import { User } from '@/modules/auth/domain/entities/user.entity';
import { UserRepository } from '@/modules/auth/domain/repositories/user.repository';
import { UpdateProfileUseCase } from './update-profile.use-case';

const USER_ID = '0198a1f0-3d5c-7f21-b0a1-6f1c9e2d4b77';

function buildUser(overrides: Partial<User> = {}): User {
  return new User({
    id: USER_ID,
    email: 'ada@example.com',
    passwordHash: '$argon2id$stored-hash',
    firstName: 'Ada',
    lastName: 'Lovelace',
    phone: '+525512345678',
    country: 'MX',
    timezone: 'UTC',
    termsAcceptedAt: new Date('2026-07-30T10:00:00.000Z'),
    emailVerifiedAt: null,
    createdAt: new Date('2026-07-30T10:00:00.000Z'),
    updatedAt: new Date('2026-07-30T10:00:00.000Z'),
    ...overrides,
  });
}

function buildScenario(options?: {
  findById?: jest.Mock;
  updateProfile?: jest.Mock;
}) {
  const findById =
    options?.findById ?? jest.fn().mockResolvedValue(buildUser());
  const updateProfile =
    options?.updateProfile ??
    jest.fn().mockResolvedValue(buildUser({ firstName: 'Grace' }));
  const users: UserRepository = {
    existsByEmail: jest.fn(),
    create: jest.fn(),
    markEmailVerified: jest.fn(),
    updatePasswordHash: jest.fn(),
    findByEmail: jest.fn(),
    findById,
    updateProfile,
  };
  const record = jest.fn<Promise<void>, [AuditLogEntry]>(() =>
    Promise.resolve(),
  );
  const auditLogger: AuditLogger = { record };

  return {
    useCase: new UpdateProfileUseCase(users, auditLogger),
    findById,
    updateProfile,
    record,
  };
}

describe('R10: PATCH /v1/me actualiza solo los campos presentes en el body', () => {
  it('llama a updateProfile con exactamente los campos provistos', async () => {
    const { useCase, updateProfile } = buildScenario();

    await useCase.execute(USER_ID, { firstName: 'Grace' });

    expect(updateProfile).toHaveBeenCalledWith(USER_ID, {
      firstName: 'Grace',
    });
  });

  it('devuelve el perfil actualizado', async () => {
    const { useCase } = buildScenario();

    const user = await useCase.execute(USER_ID, { firstName: 'Grace' });

    expect(user.firstName).toBe('Grace');
  });
});

describe('R13: body vacio es un no-op (sin persistir, sin auditar)', () => {
  it('no llama a updateProfile ni a record si no hay campos presentes', async () => {
    const { useCase, updateProfile, record } = buildScenario();

    await useCase.execute(USER_ID, {});

    expect(updateProfile).not.toHaveBeenCalled();
    expect(record).not.toHaveBeenCalled();
  });

  it('devuelve el perfil actual sin cambios', async () => {
    const { useCase, findById } = buildScenario();

    const user = await useCase.execute(USER_ID, {});

    expect(findById).toHaveBeenCalledWith(USER_ID);
    expect(user.firstName).toBe('Ada');
  });
});

describe('R14: PATCH /v1/me exitoso audita user.update con los campos modificados', () => {
  it('registra action=user.update, entity=user, y meta.fields con los nombres (no valores)', async () => {
    const { useCase, record } = buildScenario();

    await useCase.execute(USER_ID, { firstName: 'Grace', country: 'US' });

    expect(record).toHaveBeenCalledWith({
      userId: USER_ID,
      action: 'user.update',
      entity: 'user',
      entityId: USER_ID,
      meta: { fields: ['firstName', 'country'] },
    });
  });

  it('meta.fields nunca contiene los valores nuevos ni anteriores', async () => {
    const { useCase, record } = buildScenario();

    await useCase.execute(USER_ID, { firstName: 'Grace' });

    const entry = record.mock.calls[0][0];
    expect(JSON.stringify(entry)).not.toContain('Grace');
  });
});

import { AuditLogEntry, AuditLogger } from '@/audit/audit-log.repository';
import { User } from '@/modules/auth/domain/entities/user.entity';
import {
  PasswordResetMessage,
  PasswordResetSender,
} from '@/modules/auth/domain/ports/password-reset-sender';
import {
  NewPasswordResetToken,
  PasswordResetTokenRepository,
} from '@/modules/auth/domain/repositories/password-reset-token.repository';
import { UserRepository } from '@/modules/auth/domain/repositories/user.repository';
import {
  hashVerificationToken,
  PASSWORD_RESET_TOKEN_TTL_MS,
} from '../verification-token';
import { RequestPasswordResetUseCase } from './request-password-reset.use-case';

const USER_ID = '0198a1f0-3d5c-7f21-b0a1-6f1c9e2d4b77';
const ISSUED_AT = new Date('2026-08-28T20:00:00.000Z');

function buildUser(): User {
  return new User({
    id: USER_ID,
    email: 'ada@example.com',
    passwordHash: '$argon2id$old-hash',
    firstName: 'Ada',
    lastName: 'Lovelace',
    phone: '+525512345678',
    country: 'MX',
    timezone: 'UTC',
    termsAcceptedAt: new Date('2026-07-30T10:00:00.000Z'),
    emailVerifiedAt: new Date('2026-07-30T10:01:00.000Z'),
    createdAt: new Date('2026-07-30T10:00:00.000Z'),
    updatedAt: new Date('2026-07-30T10:01:00.000Z'),
  });
}

function buildScenario(storedUser: User | null = buildUser()) {
  const findByEmail = jest.fn<Promise<User | null>, [string]>(() =>
    Promise.resolve(storedUser),
  );
  const users = { findByEmail } as unknown as UserRepository;

  const create = jest.fn<Promise<void>, [NewPasswordResetToken]>(() =>
    Promise.resolve(),
  );
  const invalidateAllForUser = jest.fn<Promise<void>, [string, Date]>(() =>
    Promise.resolve(),
  );
  const tokens = {
    create,
    findByTokenHash: jest.fn(),
    invalidateAllForUser,
  } as unknown as PasswordResetTokenRepository;

  const send = jest.fn<Promise<void>, [PasswordResetMessage]>(() =>
    Promise.resolve(),
  );
  const sender: PasswordResetSender = { send };

  const record = jest.fn<Promise<void>, [AuditLogEntry]>(() =>
    Promise.resolve(),
  );
  const auditLogger: AuditLogger = { record };

  return {
    useCase: new RequestPasswordResetUseCase(
      users,
      tokens,
      sender,
      auditLogger,
    ),
    findByEmail,
    create,
    invalidateAllForUser,
    send,
    record,
  };
}

describe('R1: la solicitud con cuenta existente emite un token hasheado con expiracion de una hora', () => {
  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(ISSUED_AT);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('normaliza el email y persiste solo el SHA-256 con TTL exacto', async () => {
    const { useCase, findByEmail, create, send } = buildScenario();

    await useCase.execute({ email: '  ADA@Example.COM  ' });

    expect(findByEmail).toHaveBeenCalledWith('ada@example.com');
    expect(create).toHaveBeenCalledTimes(1);
    expect(send).toHaveBeenCalledTimes(1);

    const stored = create.mock.calls[0][0];
    const delivered = send.mock.calls[0][0];
    expect(stored).toEqual({
      userId: USER_ID,
      tokenHash: hashVerificationToken(delivered.token),
      expiresAt: new Date(ISSUED_AT.getTime() + PASSWORD_RESET_TOKEN_TTL_MS),
    });
    expect(stored.tokenHash).toMatch(/^[a-f0-9]{64}$/);
    expect(stored.tokenHash).not.toBe(delivered.token);
    expect(delivered).toEqual({
      userId: USER_ID,
      email: 'ada@example.com',
      token: expect.any(String),
      expiresAt: stored.expiresAt,
    });
  });
});

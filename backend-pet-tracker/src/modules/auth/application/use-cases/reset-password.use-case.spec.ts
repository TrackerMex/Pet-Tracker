import { AuditLogEntry, AuditLogger } from '@/audit/audit-log.repository';
import { PasswordResetToken } from '@/modules/auth/domain/entities/password-reset-token.entity';
import {
  InvalidPasswordResetTokenError,
  PasswordResetTokenExpiredError,
} from '@/modules/auth/domain/errors/password-reset.errors';
import { PasswordHasher } from '@/modules/auth/domain/ports/password-hasher';
import {
  NewPasswordResetToken,
  PasswordResetTokenRepository,
} from '@/modules/auth/domain/repositories/password-reset-token.repository';
import { UserRepository } from '@/modules/auth/domain/repositories/user.repository';
import { hashVerificationToken } from '../verification-token';
import { ResetPasswordUseCase } from './reset-password.use-case';

const TOKEN_ID = '0198a1f0-4e6d-7c33-9f12-77aa2b4c8d90';
const USER_ID = '0198a1f0-3d5c-7f21-b0a1-6f1c9e2d4b77';
const PLAIN_TOKEN = 'kQ8s0Zr4Vv1nT7yQ2bXpL9dW3fH6jM0aC5eR8uY1oI4';
const NEW_PASSWORD = 'NewPassword1!';
const NEW_PASSWORD_HASH = '$argon2id$new-hash';
const RESET_AT = new Date('2026-08-28T21:00:00.000Z');

function buildToken(
  overrides: Partial<{ expiresAt: Date; usedAt: Date | null }> = {},
): PasswordResetToken {
  return new PasswordResetToken({
    id: TOKEN_ID,
    userId: USER_ID,
    tokenHash: hashVerificationToken(PLAIN_TOKEN),
    expiresAt: new Date(RESET_AT.getTime() + 60 * 60 * 1000),
    usedAt: null,
    createdAt: new Date('2026-08-28T20:00:00.000Z'),
    ...overrides,
  });
}

function buildScenario(storedToken: PasswordResetToken | null = buildToken()) {
  const findByTokenHash = jest.fn<Promise<PasswordResetToken | null>, [string]>(
    () => Promise.resolve(storedToken),
  );
  const invalidateAllForUser = jest.fn<Promise<void>, [string, Date]>(() =>
    Promise.resolve(),
  );
  const tokens = {
    create: jest.fn<Promise<void>, [NewPasswordResetToken]>(),
    findByTokenHash,
    invalidateAllForUser,
  } as unknown as PasswordResetTokenRepository;

  const updatePasswordHash = jest.fn<Promise<void>, [string, string, Date]>(
    () => Promise.resolve(),
  );
  const users = { updatePasswordHash } as unknown as UserRepository;

  const hash = jest.fn<Promise<string>, [string]>(() =>
    Promise.resolve(NEW_PASSWORD_HASH),
  );
  const passwordHasher = {
    hash,
    verify: jest.fn(),
  } as unknown as PasswordHasher;

  const record = jest.fn<Promise<void>, [AuditLogEntry]>(() =>
    Promise.resolve(),
  );
  const auditLogger: AuditLogger = { record };

  return {
    useCase: new ResetPasswordUseCase(
      users,
      tokens,
      passwordHasher,
      auditLogger,
    ),
    findByTokenHash,
    invalidateAllForUser,
    updatePasswordHash,
    hash,
    record,
  };
}

const validDto = {
  token: PLAIN_TOKEN,
  password: NEW_PASSWORD,
  passwordConfirmation: NEW_PASSWORD,
};

describe('R5: el token vigente cambia el password y consume todos los tokens del usuario', () => {
  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(RESET_AT);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('busca por SHA-256, hashea el password y actualiza antes de invalidar', async () => {
    const {
      useCase,
      findByTokenHash,
      hash,
      updatePasswordHash,
      invalidateAllForUser,
    } = buildScenario();

    await useCase.execute(validDto);

    expect(findByTokenHash).toHaveBeenCalledWith(
      hashVerificationToken(PLAIN_TOKEN),
    );
    expect(findByTokenHash).not.toHaveBeenCalledWith(PLAIN_TOKEN);
    expect(hash).toHaveBeenCalledWith(NEW_PASSWORD);
    expect(updatePasswordHash).toHaveBeenCalledWith(
      USER_ID,
      NEW_PASSWORD_HASH,
      RESET_AT,
    );
    expect(invalidateAllForUser).toHaveBeenCalledWith(USER_ID, RESET_AT);
    expect(updatePasswordHash.mock.invocationCallOrder[0]).toBeLessThan(
      invalidateAllForUser.mock.invocationCallOrder[0],
    );
  });
});

describe('R6: un token inexistente o ya consumido no cambia ningun password', () => {
  it.each([
    ['inexistente', null],
    ['ya usado', buildToken({ usedAt: new Date('2026-08-28T20:30:00.000Z') })],
  ])(
    'trata el token %s como invalido sin ninguna escritura',
    async (_case, token) => {
      const {
        useCase,
        hash,
        updatePasswordHash,
        invalidateAllForUser,
        record,
      } = buildScenario(token);

      await expect(useCase.execute(validDto)).rejects.toBeInstanceOf(
        InvalidPasswordResetTokenError,
      );
      expect(hash).not.toHaveBeenCalled();
      expect(updatePasswordHash).not.toHaveBeenCalled();
      expect(invalidateAllForUser).not.toHaveBeenCalled();
      expect(record).not.toHaveBeenCalled();
    },
  );
});

describe('R7: un token expirado no cambia el password', () => {
  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(RESET_AT);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it.each([
    ['anterior a now', new Date(RESET_AT.getTime() - 1)],
    ['exactamente igual a now', RESET_AT],
  ])(
    'rechaza expires_at %s sin consumir ni modificar',
    async (_case, expiresAt) => {
      const {
        useCase,
        hash,
        updatePasswordHash,
        invalidateAllForUser,
        record,
      } = buildScenario(buildToken({ expiresAt }));

      await expect(useCase.execute(validDto)).rejects.toBeInstanceOf(
        PasswordResetTokenExpiredError,
      );
      expect(hash).not.toHaveBeenCalled();
      expect(updatePasswordHash).not.toHaveBeenCalled();
      expect(invalidateAllForUser).not.toHaveBeenCalled();
      expect(record).not.toHaveBeenCalled();
    },
  );
});

describe('R11: el reset exitoso audita user.password_reset', () => {
  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(RESET_AT);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('registra la accion sobre el usuario despues de consumir sus tokens', async () => {
    const { useCase, invalidateAllForUser, record } = buildScenario();

    await useCase.execute(validDto);

    expect(record).toHaveBeenCalledWith({
      userId: USER_ID,
      action: 'user.password_reset',
      entity: 'user',
      entityId: USER_ID,
    });
    expect(invalidateAllForUser.mock.invocationCallOrder[0]).toBeLessThan(
      record.mock.invocationCallOrder[0],
    );
  });
});

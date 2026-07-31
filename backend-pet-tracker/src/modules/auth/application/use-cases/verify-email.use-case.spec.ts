import { AuditLogEntry, AuditLogger } from '@/audit/audit-log.repository';
import { EmailVerificationToken } from '../../domain/entities/email-verification-token.entity';
import {
  InvalidVerificationTokenError,
  VerificationTokenExpiredError,
} from '../../domain/errors/email-verification.errors';
import {
  EmailVerificationTokenRepository,
  NewEmailVerificationToken,
} from '../../domain/repositories/email-verification-token.repository';
import { UserRepository } from '../../domain/repositories/user.repository';
import { hashVerificationToken } from '../verification-token';
import { VerifyEmailUseCase } from './verify-email.use-case';

const TOKEN_ID = '0198a1f0-4e6d-7c33-9f12-77aa2b4c8d90';
const USER_ID = '0198a1f0-3d5c-7f21-b0a1-6f1c9e2d4b77';
const PLAIN_TOKEN = 'kQ8s0Zr4Vv1nT7yQ2bXpL9dW3fH6jM0aC5eR8uY1oI4';

function buildToken(
  overrides: Partial<{ expiresAt: Date; usedAt: Date | null }> = {},
): EmailVerificationToken {
  return new EmailVerificationToken({
    id: TOKEN_ID,
    userId: USER_ID,
    tokenHash: hashVerificationToken(PLAIN_TOKEN),
    expiresAt: new Date(Date.now() + 60 * 60 * 1000),
    usedAt: null,
    createdAt: new Date('2026-07-30T10:00:00.000Z'),
    ...overrides,
  });
}

function buildScenario(storedToken: EmailVerificationToken | null) {
  const findByTokenHash = jest.fn<
    Promise<EmailVerificationToken | null>,
    [string]
  >(() => Promise.resolve(storedToken));
  const markUsed = jest.fn<Promise<void>, [string, Date]>(() =>
    Promise.resolve(),
  );
  const createToken = jest.fn<Promise<void>, [NewEmailVerificationToken]>(() =>
    Promise.resolve(),
  );
  const tokens: EmailVerificationTokenRepository = {
    create: createToken,
    findByTokenHash,
    markUsed,
  };

  const markEmailVerified = jest.fn<Promise<void>, [string, Date]>(() =>
    Promise.resolve(),
  );
  const users = {
    existsByEmail: jest.fn(),
    create: jest.fn(),
    markEmailVerified,
  } as unknown as UserRepository;

  const record = jest.fn<Promise<void>, [AuditLogEntry]>(() =>
    Promise.resolve(),
  );
  const auditLogger: AuditLogger = { record };

  const useCase = new VerifyEmailUseCase(users, tokens, auditLogger);

  return { useCase, findByTokenHash, markUsed, markEmailVerified, record };
}

describe('R8: el token valido y vigente verifica el email y queda consumido', () => {
  it('busca por el hash del token, nunca por el token en claro', async () => {
    const { useCase, findByTokenHash } = buildScenario(buildToken());

    await useCase.execute({ token: PLAIN_TOKEN });

    expect(findByTokenHash).toHaveBeenCalledWith(
      hashVerificationToken(PLAIN_TOKEN),
    );
    expect(findByTokenHash).not.toHaveBeenCalledWith(PLAIN_TOKEN);
  });

  it('setea email_verified_at del usuario asociado y marca el token como usado', async () => {
    const { useCase, markEmailVerified, markUsed } =
      buildScenario(buildToken());
    const before = Date.now();

    await useCase.execute({ token: PLAIN_TOKEN });

    expect(markEmailVerified).toHaveBeenCalledTimes(1);
    const [verifiedUserId, verifiedAt] = markEmailVerified.mock.calls[0];
    expect(verifiedUserId).toBe(USER_ID);
    expect(verifiedAt.getTime()).toBeGreaterThanOrEqual(before);
    expect(verifiedAt.getTime()).toBeLessThanOrEqual(Date.now());

    expect(markUsed).toHaveBeenCalledTimes(1);
    expect(markUsed.mock.calls[0][0]).toBe(TOKEN_ID);
    expect(markUsed.mock.calls[0][1]).toEqual(verifiedAt);
  });
});

describe('R9: un token inexistente no verifica ningun email', () => {
  it('lanza InvalidVerificationTokenError sin tocar al usuario', async () => {
    const { useCase, markEmailVerified, markUsed } = buildScenario(null);

    await expect(
      useCase.execute({ token: PLAIN_TOKEN }),
    ).rejects.toBeInstanceOf(InvalidVerificationTokenError);
    expect(markEmailVerified).not.toHaveBeenCalled();
    expect(markUsed).not.toHaveBeenCalled();
  });
});

describe('R10: un token expirado no verifica el email', () => {
  it('lanza VerificationTokenExpiredError sin setear email_verified_at', async () => {
    const { useCase, markEmailVerified, markUsed } = buildScenario(
      buildToken({ expiresAt: new Date(Date.now() - 1000) }),
    );

    await expect(
      useCase.execute({ token: PLAIN_TOKEN }),
    ).rejects.toBeInstanceOf(VerificationTokenExpiredError);
    expect(markEmailVerified).not.toHaveBeenCalled();
    expect(markUsed).not.toHaveBeenCalled();
  });
});

describe('R11: un token ya usado no se puede reutilizar', () => {
  it('lanza InvalidVerificationTokenError y no vuelve a auditar ni a verificar', async () => {
    const { useCase, markEmailVerified, record } = buildScenario(
      buildToken({ usedAt: new Date('2026-07-30T11:00:00.000Z') }),
    );

    await expect(
      useCase.execute({ token: PLAIN_TOKEN }),
    ).rejects.toBeInstanceOf(InvalidVerificationTokenError);
    expect(markEmailVerified).not.toHaveBeenCalled();
    expect(record).not.toHaveBeenCalled();
  });

  it('trata el token usado como invalido incluso si tambien expiro', async () => {
    const { useCase } = buildScenario(
      buildToken({
        usedAt: new Date('2026-07-30T11:00:00.000Z'),
        expiresAt: new Date(Date.now() - 1000),
      }),
    );

    await expect(
      useCase.execute({ token: PLAIN_TOKEN }),
    ).rejects.toBeInstanceOf(InvalidVerificationTokenError);
  });
});

describe('R13: la verificacion exitosa deja una entrada user.email_verified en audit_log', () => {
  it('audita la accion con entity user y el id del usuario verificado', async () => {
    const { useCase, record } = buildScenario(buildToken());

    await useCase.execute({ token: PLAIN_TOKEN });

    expect(record).toHaveBeenCalledWith({
      userId: USER_ID,
      action: 'user.email_verified',
      entity: 'user',
      entityId: USER_ID,
    });
  });

  it('no audita cuando el token no existe', async () => {
    const { useCase, record } = buildScenario(null);

    await expect(
      useCase.execute({ token: PLAIN_TOKEN }),
    ).rejects.toBeInstanceOf(InvalidVerificationTokenError);
    expect(record).not.toHaveBeenCalled();
  });
});

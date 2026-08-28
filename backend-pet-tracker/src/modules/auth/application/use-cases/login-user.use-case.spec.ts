import { User } from '@/modules/auth/domain/entities/user.entity';
import { InvalidCredentialsError } from '@/modules/auth/domain/errors/user.errors';
import { PasswordHasher } from '@/modules/auth/domain/ports/password-hasher';
import { TokenService } from '@/modules/auth/domain/ports/token-service';
import { UserRepository } from '@/modules/auth/domain/repositories/user.repository';
import { LoginUserUseCase } from './login-user.use-case';

const STORED_USER_ID = '0198a1f0-3d5c-7f21-b0a1-6f1c9e2d4b77';

function buildStoredUser(): User {
  return new User({
    id: STORED_USER_ID,
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
  });
}

/**
 * Devuelve las referencias sueltas de cada jest.fn() (nunca `objeto.metodo`
 * en las aserciones) para no disparar @typescript-eslint/unbound-method.
 */
function buildUseCase(overrides?: {
  findByEmail?: jest.Mock;
  verify?: jest.Mock;
  sign?: jest.Mock;
}) {
  const findByEmail =
    overrides?.findByEmail ?? jest.fn().mockResolvedValue(buildStoredUser());
  const verify = overrides?.verify ?? jest.fn().mockResolvedValue(true);
  const sign = overrides?.sign ?? jest.fn().mockReturnValue('signed.jwt.token');

  const users: UserRepository = {
    existsByEmail: jest.fn(),
    create: jest.fn(),
    markEmailVerified: jest.fn(),
    updatePasswordHash: jest.fn(),
    findByEmail,
    findById: jest.fn(),
    updateProfile: jest.fn(),
  };
  const passwordHasher: PasswordHasher = { hash: jest.fn(), verify };
  const tokenService: TokenService = { sign, verify: jest.fn() };

  return {
    useCase: new LoginUserUseCase(users, passwordHasher, tokenService),
    findByEmail,
    verify,
    sign,
  };
}

describe('R1: login valido responde con un access_token', () => {
  it('verifica el password contra el hash almacenado y devuelve el token firmado', async () => {
    const { useCase, verify } = buildUseCase();

    const result = await useCase.execute({
      email: 'ADA@example.com',
      password: 'sup3rsecret',
    });

    expect(verify).toHaveBeenCalledWith('sup3rsecret', '$argon2id$stored-hash');
    expect(result.accessToken).toBe('signed.jwt.token');
  });

  it('compara el email de forma case-insensitive', async () => {
    const { useCase, findByEmail } = buildUseCase();

    await useCase.execute({
      email: 'ADA@Example.com',
      password: 'sup3rsecret',
    });

    expect(findByEmail).toHaveBeenCalledWith('ada@example.com');
  });
});

describe('R2: credenciales invalidas responden con el mismo error generico', () => {
  it('lanza InvalidCredentialsError si el email no corresponde a ningun usuario', async () => {
    const { useCase } = buildUseCase({
      findByEmail: jest.fn().mockResolvedValue(null),
    });

    await expect(
      useCase.execute({ email: 'ghost@example.com', password: 'whatever1' }),
    ).rejects.toThrow(InvalidCredentialsError);
  });

  it('lanza InvalidCredentialsError si el password no verifica contra el hash', async () => {
    const { useCase } = buildUseCase({
      verify: jest.fn().mockResolvedValue(false),
    });

    await expect(
      useCase.execute({ email: 'ada@example.com', password: 'wrong-pass' }),
    ).rejects.toThrow(InvalidCredentialsError);
  });
});

describe('R4: el access_token se firma con los claims sub/email del usuario', () => {
  it('llama a tokenService.sign con sub = id y email del usuario', async () => {
    const { useCase, sign } = buildUseCase();

    await useCase.execute({
      email: 'ada@example.com',
      password: 'sup3rsecret',
    });

    expect(sign).toHaveBeenCalledWith({
      sub: STORED_USER_ID,
      email: 'ada@example.com',
    });
  });
});

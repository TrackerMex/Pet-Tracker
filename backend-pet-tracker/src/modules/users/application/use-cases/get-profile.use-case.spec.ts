import { User } from '@/modules/auth/domain/entities/user.entity';
import { UserNotFoundError } from '@/modules/auth/domain/errors/user.errors';
import { UserRepository } from '@/modules/auth/domain/repositories/user.repository';
import { GetProfileUseCase } from './get-profile.use-case';

const USER_ID = '0198a1f0-3d5c-7f21-b0a1-6f1c9e2d4b77';

function buildUser(): User {
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
  });
}

function buildUseCase(findById: jest.Mock) {
  const users: UserRepository = {
    existsByEmail: jest.fn(),
    create: jest.fn(),
    markEmailVerified: jest.fn(),
    updatePasswordHash: jest.fn(),
    findByEmail: jest.fn(),
    findById,
    updateProfile: jest.fn(),
  };

  return new GetProfileUseCase(users);
}

describe('R9: GET /v1/me devuelve el perfil del usuario autenticado', () => {
  it('devuelve la entidad de dominio del usuario', async () => {
    const findById = jest.fn().mockResolvedValue(buildUser());
    const useCase = buildUseCase(findById);

    const user = await useCase.execute(USER_ID);

    expect(findById).toHaveBeenCalledWith(USER_ID);
    expect(user.id).toBe(USER_ID);
    expect(user.email).toBe('ada@example.com');
  });

  it('lanza UserNotFoundError si el usuario del token ya no existe', async () => {
    const findById = jest.fn().mockResolvedValue(null);
    const useCase = buildUseCase(findById);

    await expect(useCase.execute(USER_ID)).rejects.toThrow(UserNotFoundError);
  });
});

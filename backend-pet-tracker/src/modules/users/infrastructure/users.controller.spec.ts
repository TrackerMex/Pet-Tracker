import { HttpException, NotFoundException } from '@nestjs/common';
import { User } from '@/modules/auth/domain/entities/user.entity';
import { UserNotFoundError } from '@/modules/auth/domain/errors/user.errors';
import { GetProfileUseCase } from '../application/use-cases/get-profile.use-case';
import { UsersController } from './users.controller';

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
    timezone: 'America/Mexico_City',
    termsAcceptedAt: new Date('2026-07-30T10:00:00.000Z'),
    emailVerifiedAt: null,
    createdAt: new Date('2026-07-30T10:00:00.000Z'),
    updatedAt: new Date('2026-07-30T10:00:00.000Z'),
  });
}

function buildController(
  behaviour: () => Promise<User> = () => Promise.resolve(buildUser()),
) {
  const execute = jest.fn(behaviour);
  const controller = new UsersController({
    execute,
  } as unknown as GetProfileUseCase);

  return { controller, execute };
}

describe('R9: GET /v1/me responde 200 con el perfil del usuario autenticado', () => {
  it('invoca GetProfileUseCase con el id del token y devuelve el perfil serializado', async () => {
    const { controller, execute } = buildController();

    const body = await controller.me({ id: USER_ID, email: 'ada@example.com' });

    expect(execute).toHaveBeenCalledWith(USER_ID);
    expect(body).toEqual({
      id: USER_ID,
      email: 'ada@example.com',
      firstName: 'Ada',
      lastName: 'Lovelace',
      phone: '+525512345678',
      country: 'MX',
      timezone: 'America/Mexico_City',
      createdAt: '2026-07-30T10:00:00.000Z',
      updatedAt: '2026-07-30T10:00:00.000Z',
    });
  });
});

describe('caso borde (sin R-id): usuario del token ya no existe en users', () => {
  it('mapea UserNotFoundError a NotFoundException 404 en vez de dejarlo crudo', async () => {
    const { controller } = buildController(() =>
      Promise.reject(new UserNotFoundError(USER_ID)),
    );

    let caught: unknown;
    await controller
      .me({ id: USER_ID, email: 'ada@example.com' })
      .catch((error: unknown) => {
        caught = error;
      });

    expect(caught).toBeInstanceOf(NotFoundException);
    expect((caught as HttpException).getStatus()).toBe(404);
  });
});

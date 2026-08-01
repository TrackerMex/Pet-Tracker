import {
  BadRequestException,
  HttpException,
  NotFoundException,
} from '@nestjs/common';
import { User } from '@/modules/auth/domain/entities/user.entity';
import { UserNotFoundError } from '@/modules/auth/domain/errors/user.errors';
import { GetProfileUseCase } from '@/modules/users/application/use-cases/get-profile.use-case';
import { UpdateProfileUseCase } from '@/modules/users/application/use-cases/update-profile.use-case';
import { UsersController } from './users.controller';

const USER_ID = '0198a1f0-3d5c-7f21-b0a1-6f1c9e2d4b77';
const CURRENT_USER = { id: USER_ID, email: 'ada@example.com' };

function buildUser(overrides: Partial<User> = {}): User {
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
    ...overrides,
  });
}

function buildController(options?: {
  getProfile?: () => Promise<User>;
  updateProfile?: () => Promise<User>;
}) {
  const getProfileExecute = jest.fn(
    options?.getProfile ?? (() => Promise.resolve(buildUser())),
  );
  const updateProfileExecute = jest.fn(
    options?.updateProfile ?? (() => Promise.resolve(buildUser())),
  );
  const controller = new UsersController(
    { execute: getProfileExecute } as unknown as GetProfileUseCase,
    { execute: updateProfileExecute } as unknown as UpdateProfileUseCase,
  );

  return { controller, getProfileExecute, updateProfileExecute };
}

describe('R9: GET /v1/me responde 200 con el perfil del usuario autenticado', () => {
  it('invoca GetProfileUseCase con el id del token y devuelve el perfil serializado', async () => {
    const { controller, getProfileExecute } = buildController();

    const body = await controller.me(CURRENT_USER);

    expect(getProfileExecute).toHaveBeenCalledWith(USER_ID);
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
    const { controller } = buildController({
      getProfile: () => Promise.reject(new UserNotFoundError(USER_ID)),
    });

    let caught: unknown;
    await controller.me(CURRENT_USER).catch((error: unknown) => {
      caught = error;
    });

    expect(caught).toBeInstanceOf(NotFoundException);
    expect((caught as HttpException).getStatus()).toBe(404);
  });
});

describe('R10: PATCH /v1/me actualiza los campos provistos y responde 200', () => {
  it('invoca UpdateProfileUseCase con el dto validado y devuelve el perfil actualizado', async () => {
    const { controller, updateProfileExecute } = buildController({
      updateProfile: () => Promise.resolve(buildUser({ firstName: 'Grace' })),
    });

    const body = await controller.updateMe(CURRENT_USER, {
      firstName: 'Grace',
    });

    expect(updateProfileExecute).toHaveBeenCalledWith(USER_ID, {
      firstName: 'Grace',
    });
    expect(body.firstName).toBe('Grace');
  });
});

describe('R11: PATCH /v1/me con timezone invalida responde 400 sin invocar el caso de uso', () => {
  it('lanza BadRequestException', async () => {
    const { controller, updateProfileExecute } = buildController();

    let caught: unknown;
    await controller
      .updateMe(CURRENT_USER, { timezone: 'Not/A_Timezone' })
      .catch((error: unknown) => {
        caught = error;
      });

    expect(caught).toBeInstanceOf(BadRequestException);
    expect(updateProfileExecute).not.toHaveBeenCalled();
  });
});

describe('R12: PATCH /v1/me con country invalido responde 400 sin invocar el caso de uso', () => {
  it('lanza BadRequestException', async () => {
    const { controller, updateProfileExecute } = buildController();

    let caught: unknown;
    await controller
      .updateMe(CURRENT_USER, { country: 'mx' })
      .catch((error: unknown) => {
        caught = error;
      });

    expect(caught).toBeInstanceOf(BadRequestException);
    expect(updateProfileExecute).not.toHaveBeenCalled();
  });
});

describe('R13: PATCH /v1/me con body vacio responde 200 (no-op)', () => {
  it('invoca el caso de uso con un objeto vacio y no lanza', async () => {
    const { controller, updateProfileExecute } = buildController();

    const body = await controller.updateMe(CURRENT_USER, {});

    expect(updateProfileExecute).toHaveBeenCalledWith(USER_ID, {});
    expect(body.id).toBe(USER_ID);
  });
});

describe('R15: la respuesta de PATCH /v1/me nunca expone password_hash', () => {
  it('serializa solo la lista explicita de campos permitidos', async () => {
    const { controller } = buildController();

    const body = await controller.updateMe(CURRENT_USER, {
      firstName: 'Grace',
    });

    expect(Object.keys(body)).not.toContain('passwordHash');
    expect(JSON.stringify(body)).not.toContain('argon2id');
  });
});

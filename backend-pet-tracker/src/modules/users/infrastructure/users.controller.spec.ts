import {
  HttpStatus,
  RequestMethod,
  ForbiddenException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import {
  HTTP_CODE_METADATA,
  METHOD_METADATA,
  PATH_METADATA,
} from '@nestjs/common/constants';
import {
  InvalidCredentialsError,
  UserNotFoundError,
} from '@/modules/auth/domain/errors/user.errors';
import type { DeleteAccountUseCase } from '@/modules/users/application/use-cases/delete-account.use-case';
import { IS_PUBLIC_KEY } from '@/modules/auth/infrastructure/decorators/public.decorator';
import type { CurrentUserPayload } from '@/modules/auth/infrastructure/decorators/current-user.decorator';
import type { DeletePushTokenUseCase } from '@/modules/users/application/use-cases/delete-push-token.use-case';
import type { GetProfileUseCase } from '@/modules/users/application/use-cases/get-profile.use-case';
import type { RegisterPushTokenUseCase } from '@/modules/users/application/use-cases/register-push-token.use-case';
import type { UpdateProfileUseCase } from '@/modules/users/application/use-cases/update-profile.use-case';
import { UsersController } from './users.controller';

const USER: CurrentUserPayload = { id: 'user-1', email: 'a@example.com' };
const EXPO_TOKEN = 'ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]';
const CREATED_AT = new Date('2026-08-01T00:00:00.000Z');
const LAST_SEEN_AT = new Date('2026-08-07T10:00:00.000Z');

function controller(overrides: {
  register?: jest.Mock;
  remove?: jest.Mock;
  deleteAccount?: jest.Mock;
}): UsersController {
  return new UsersController(
    {} as GetProfileUseCase,
    {} as UpdateProfileUseCase,
    {
      execute:
        overrides.register ??
        jest.fn().mockResolvedValue({
          id: 'token-row-1',
          platform: 'ios',
          createdAt: CREATED_AT,
          lastSeenAt: LAST_SEEN_AT,
        }),
    } as unknown as RegisterPushTokenUseCase,
    {
      execute: overrides.remove ?? jest.fn().mockResolvedValue(undefined),
    } as unknown as DeletePushTokenUseCase,
    {
      execute:
        overrides.deleteAccount ?? jest.fn().mockResolvedValue(undefined),
    } as unknown as DeleteAccountUseCase,
  );
}

/**
 * Handler como objeto opaco: los decoradores de Nest cuelgan su metadata del
 * propio metodo. Se lee por descriptor y no como `Clase.prototype.metodo` para
 * no arrastrar el `this` sin ligar que @typescript-eslint/unbound-method
 * (con razon) prohibe.
 */
function handlerOf(
  name: 'registerPushToken' | 'deletePushToken' | 'deleteMe',
): object {
  const descriptor = Object.getOwnPropertyDescriptor(
    UsersController.prototype,
    name,
  );
  return descriptor?.value as object;
}

describe('R6: ambas rutas de push-tokens exigen JWT (sin @Public, las cubre el AuthGuard global)', () => {
  it('ni el controller ni sus handlers llevan la metadata de @Public()', () => {
    expect(Reflect.getMetadata(IS_PUBLIC_KEY, UsersController)).toBeUndefined();

    for (const name of ['registerPushToken', 'deletePushToken'] as const) {
      expect(
        Reflect.getMetadata(IS_PUBLIC_KEY, handlerOf(name)),
      ).toBeUndefined();
    }
  });

  it('las rutas cuelgan de @Controller("me") con el path push-tokens', () => {
    expect(Reflect.getMetadata(PATH_METADATA, UsersController)).toBe('me');

    for (const name of ['registerPushToken', 'deletePushToken'] as const) {
      expect(Reflect.getMetadata(PATH_METADATA, handlerOf(name))).toBe(
        'push-tokens',
      );
    }

    expect(
      Reflect.getMetadata(METHOD_METADATA, handlerOf('registerPushToken')),
    ).toBe(RequestMethod.POST);
    expect(
      Reflect.getMetadata(METHOD_METADATA, handlerOf('deletePushToken')),
    ).toBe(RequestMethod.DELETE);
  });
});

describe('R3/R5: codigos de respuesta del contrato (D5: 200 en POST, 204 en DELETE)', () => {
  it('el POST responde 200 y no 201 — el upsert idempotente no crea nada la segunda vez', () => {
    expect(
      Reflect.getMetadata(HTTP_CODE_METADATA, handlerOf('registerPushToken')),
    ).toBe(HttpStatus.OK);
  });

  it('el DELETE responde 204 sin body', () => {
    expect(
      Reflect.getMetadata(HTTP_CODE_METADATA, handlerOf('deletePushToken')),
    ).toBe(HttpStatus.NO_CONTENT);
  });
});

describe('R13: ninguna respuesta HTTP de push-tokens contiene el token completo', () => {
  it('el body del POST son exactamente {id, platform, createdAt, lastSeenAt}', async () => {
    const response = await controller({}).registerPushToken(USER, {
      expoToken: EXPO_TOKEN,
      platform: 'ios',
    });

    expect(Object.keys(response).sort()).toEqual(
      ['id', 'platform', 'createdAt', 'lastSeenAt'].sort(),
    );
    expect(JSON.stringify(response)).not.toContain(EXPO_TOKEN);
    expect(JSON.stringify(response)).not.toContain(USER.id);
  });

  it('el DELETE no devuelve body', async () => {
    const response = await controller({}).deletePushToken(USER, {
      expoToken: EXPO_TOKEN,
    });

    expect(response).toBeUndefined();
  });
});

describe('R4: el body invalido es 400 antes de tocar la base', () => {
  it('no invoca el caso de uso cuando el schema falla', async () => {
    const register = jest.fn();
    const remove = jest.fn();
    const target = controller({ register, remove });

    await expect(
      target.registerPushToken(USER, { expoToken: 'nope', platform: 'ios' }),
    ).rejects.toMatchObject({ status: HttpStatus.BAD_REQUEST });
    await expect(
      target.deletePushToken(USER, { expoToken: 'nope' }),
    ).rejects.toMatchObject({ status: HttpStatus.BAD_REQUEST });

    expect(register).not.toHaveBeenCalled();
    expect(remove).not.toHaveBeenCalled();
  });
});

describe('#247 R3: DELETE /v1/me exige JWT y responde 204', () => {
  it('#247 R3: ni el controller ni deleteMe llevan @Public()', () => {
    expect(Reflect.getMetadata(IS_PUBLIC_KEY, UsersController)).toBeUndefined();
    expect(
      Reflect.getMetadata(IS_PUBLIC_KEY, handlerOf('deleteMe')),
    ).toBeUndefined();
  });
  it('#247 R3: deleteMe es DELETE en la raíz de me con 204', () => {
    expect(Reflect.getMetadata(PATH_METADATA, handlerOf('deleteMe'))).toBe('/');
    expect(Reflect.getMetadata(METHOD_METADATA, handlerOf('deleteMe'))).toBe(
      RequestMethod.DELETE,
    );
    expect(Reflect.getMetadata(HTTP_CODE_METADATA, handlerOf('deleteMe'))).toBe(
      HttpStatus.NO_CONTENT,
    );
  });
  it('#247 R3: delega en DeleteAccountUseCase con el id y la contraseña', async () => {
    const deleteAccount = jest.fn().mockResolvedValue(undefined);
    await expect(
      controller({ deleteAccount }).deleteMe(USER, { password: 'secret' }),
    ).resolves.toBeUndefined();
    expect(deleteAccount).toHaveBeenCalledWith('user-1', 'secret');
  });
});
describe('#247 R6: InvalidCredentialsError del borrado es 403 Invalid password', () => {
  it('#247 R6: responde ForbiddenException con el body exacto', async () => {
    const result = controller({
      deleteAccount: jest.fn().mockRejectedValue(new InvalidCredentialsError()),
    }).deleteMe(USER, { password: 'secret' });
    await expect(result).rejects.toBeInstanceOf(ForbiddenException);
    const error: unknown = await result.catch((error: unknown) => error);
    expect((error as ForbiddenException).getResponse()).toEqual({
      statusCode: 403,
      message: 'Invalid password',
      error: 'Forbidden',
    });
  });
});
describe('#247 R7: UserNotFoundError del borrado es 401', () => {
  it('#247 R7: responde UnauthorizedException, nunca NotFoundException', async () => {
    const result = controller({
      deleteAccount: jest
        .fn()
        .mockRejectedValue(new UserNotFoundError('user-1')),
    }).deleteMe(USER, { password: 'secret' });
    await expect(result).rejects.toBeInstanceOf(UnauthorizedException);
    await expect(result).rejects.not.toBeInstanceOf(NotFoundException);
    const error: unknown = await result.catch((error: unknown) => error);
    expect((error as UnauthorizedException).getResponse()).toEqual({
      statusCode: 401,
      message: 'Unauthorized',
    });
  });
});

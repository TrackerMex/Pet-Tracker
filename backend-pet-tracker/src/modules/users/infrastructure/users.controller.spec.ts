import { HttpStatus, RequestMethod } from '@nestjs/common';
import {
  HTTP_CODE_METADATA,
  METHOD_METADATA,
  PATH_METADATA,
} from '@nestjs/common/constants';
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
  );
}

/**
 * Handler como objeto opaco: los decoradores de Nest cuelgan su metadata del
 * propio metodo. Se lee por descriptor y no como `Clase.prototype.metodo` para
 * no arrastrar el `this` sin ligar que @typescript-eslint/unbound-method
 * (con razon) prohibe.
 */
function handlerOf(name: 'registerPushToken' | 'deletePushToken'): object {
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

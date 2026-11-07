import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User } from '@/modules/auth/domain/entities/user.entity';
import { UserRepository } from '@/modules/auth/domain/repositories/user.repository';
import { TokenService } from '@/modules/auth/domain/ports/token-service';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { AuthGuard } from './auth.guard';

function buildContext(options: {
  authorizationHeader?: string;
}): ExecutionContext {
  const request = {
    headers: options.authorizationHeader
      ? { authorization: options.authorizationHeader }
      : {},
  };

  return {
    getHandler: () => ({}) as unknown,
    getClass: () => ({}) as unknown,
    switchToHttp: () => ({
      getRequest: () => request,
    }),
  } as unknown as ExecutionContext;
}

/** Devuelve el mock suelto (getAllAndOverride) para no disparar unbound-method. */
function buildReflector(isPublic: boolean | undefined) {
  const getAllAndOverride = jest.fn().mockReturnValue(isPublic);
  const reflector = { getAllAndOverride } as unknown as Reflector;

  return { reflector, getAllAndOverride };
}

function buildTokenService(overrides?: Partial<TokenService>): TokenService {
  return {
    sign: jest.fn(),
    verify: jest.fn(),
    ...overrides,
  };
}

describe('R5: ruta protegida sin Authorization responde 401', () => {
  it('lanza UnauthorizedException si no hay header Authorization', async () => {
    const { reflector } = buildReflector(false);
    const guard = new AuthGuard(
      reflector,
      buildTokenService(),
      buildUsers().users,
    );
    const context = buildContext({});

    await expect(guard.canActivate(context)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('lanza UnauthorizedException si el header no trae esquema Bearer', async () => {
    const { reflector } = buildReflector(false);
    const guard = new AuthGuard(
      reflector,
      buildTokenService(),
      buildUsers().users,
    );
    const context = buildContext({ authorizationHeader: 'Basic abc123' });

    await expect(guard.canActivate(context)).rejects.toThrow(
      UnauthorizedException,
    );
  });
});

describe('R6: ruta protegida con token invalido o expirado responde 401', () => {
  it('lanza UnauthorizedException si tokenService.verify lanza (firma invalida)', async () => {
    const { reflector } = buildReflector(false);
    const verify = jest.fn(() => {
      throw new Error('invalid signature');
    });
    const guard = new AuthGuard(
      reflector,
      buildTokenService({ verify }),
      buildUsers().users,
    );
    const context = buildContext({ authorizationHeader: 'Bearer bad.token' });

    await expect(guard.canActivate(context)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('lanza UnauthorizedException si tokenService.verify lanza (expirado)', async () => {
    const { reflector } = buildReflector(false);
    const verify = jest.fn(() => {
      throw new Error('token expired');
    });
    const guard = new AuthGuard(
      reflector,
      buildTokenService({ verify }),
      buildUsers().users,
    );
    const context = buildContext({
      authorizationHeader: 'Bearer expired.token',
    });

    await expect(guard.canActivate(context)).rejects.toThrow(
      UnauthorizedException,
    );
  });
});

describe('R7: rutas @Public() no exigen token', () => {
  it('deja pasar sin Authorization cuando el handler es @Public()', async () => {
    const { reflector } = buildReflector(true);
    const guard = new AuthGuard(
      reflector,
      buildTokenService(),
      buildUsers().users,
    );
    const context = buildContext({});

    await expect(guard.canActivate(context)).resolves.toBe(true);
  });

  it('lee la metadata IS_PUBLIC_KEY desde handler y clase', async () => {
    const { reflector, getAllAndOverride } = buildReflector(true);
    const guard = new AuthGuard(
      reflector,
      buildTokenService(),
      buildUsers().users,
    );
    const context = buildContext({});

    await guard.canActivate(context);

    expect(getAllAndOverride).toHaveBeenCalledWith(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
  });

  it('deja pasar una ruta @Public() aunque venga con un token invalido (no exige ni valida)', async () => {
    const { reflector } = buildReflector(true);
    const verify = jest.fn(() => {
      throw new Error('invalid');
    });
    const guard = new AuthGuard(
      reflector,
      buildTokenService({ verify }),
      buildUsers().users,
    );
    const context = buildContext({ authorizationHeader: 'Bearer bad.token' });

    await expect(guard.canActivate(context)).resolves.toBe(true);
    expect(verify).not.toHaveBeenCalled();
  });
});

describe('R8: token valido adjunta { id, email } a request.user', () => {
  it('popula request.user con sub/email del payload verificado', async () => {
    const { reflector } = buildReflector(false);
    const verify = jest
      .fn()
      .mockReturnValue({ sub: 'user-1', email: 'ada@example.com' });
    const guard = new AuthGuard(
      reflector,
      buildTokenService({ verify }),
      buildUsers().users,
    );
    const request: { headers: Record<string, string>; user?: unknown } = {
      headers: { authorization: 'Bearer good.token' },
    };
    const context = {
      getHandler: () => ({}) as unknown,
      getClass: () => ({}) as unknown,
      switchToHttp: () => ({ getRequest: () => request }),
    } as unknown as ExecutionContext;

    const result = await guard.canActivate(context);

    expect(result).toBe(true);
    expect(request.user).toEqual({ id: 'user-1', email: 'ada@example.com' });
    expect(verify).toHaveBeenCalledWith('good.token');
  });
});

function buildUsers(found: User | null = { id: 'user-1' } as unknown as User) {
  const findById = jest.fn().mockResolvedValue(found);
  return { users: { findById } as unknown as UserRepository, findById };
}

function buildContextWithRequest(authorization?: string) {
  const request: { headers: Record<string, string>; user?: unknown } = {
    headers: authorization ? { authorization } : {},
  };
  const context = {
    getHandler: () => ({}) as unknown,
    getClass: () => ({}) as unknown,
    switchToHttp: () => ({ getRequest: () => request }),
  } as unknown as ExecutionContext;
  return { context, request };
}

describe('#247 R2: el guard exige que el usuario del token exista', () => {
  const payload = { sub: 'user-1', email: 'ada@example.com' };
  it('#247 R2: consulta findById con el sub y adjunta request.user si el usuario existe', async () => {
    const { users, findById } = buildUsers();
    const { context, request } = buildContextWithRequest('Bearer good.token');
    const guard = new AuthGuard(
      buildReflector(false).reflector,
      buildTokenService({ verify: jest.fn().mockReturnValue(payload) }),
      users,
    );
    await expect(guard.canActivate(context)).resolves.toBe(true);
    expect(findById).toHaveBeenCalledTimes(1);
    expect(findById).toHaveBeenCalledWith('user-1');
    expect(request.user).toEqual({ id: 'user-1', email: 'ada@example.com' });
  });
  it('#247 R2: responde 401 y no adjunta request.user si el usuario ya no existe', async () => {
    const { context, request } = buildContextWithRequest('Bearer good.token');
    const guard = new AuthGuard(
      buildReflector(false).reflector,
      buildTokenService({ verify: jest.fn().mockReturnValue(payload) }),
      buildUsers(null).users,
    );
    await expect(guard.canActivate(context)).rejects.toThrow(
      UnauthorizedException,
    );
    expect(request.user).toBeUndefined();
  });
  it('#247 R2: una ruta @Public() no consulta users', async () => {
    const { users, findById } = buildUsers();
    const guard = new AuthGuard(
      buildReflector(true).reflector,
      buildTokenService({ verify: jest.fn().mockReturnValue(payload) }),
      users,
    );
    await expect(
      guard.canActivate(buildContextWithRequest('Bearer good.token').context),
    ).resolves.toBe(true);
    expect(findById).not.toHaveBeenCalled();
  });
  it.each([
    ['sin Authorization', undefined],
    ['token inválido', 'Bearer bad.token'],
  ])('#247 R2: %s responde 401 sin consultar users', async (_label, header) => {
    const { users, findById } = buildUsers();
    const verify = jest.fn(() => {
      throw new Error('invalid signature');
    });
    const guard = new AuthGuard(
      buildReflector(false).reflector,
      buildTokenService({ verify }),
      users,
    );
    await expect(
      guard.canActivate(buildContextWithRequest(header).context),
    ).rejects.toThrow(UnauthorizedException);
    expect(findById).not.toHaveBeenCalled();
  });
  it('#247 R2: un error de la consulta se propaga y no se convierte en 401', async () => {
    const { users, findById } = buildUsers();
    findById.mockRejectedValue(new Error('db down 247'));
    const guard = new AuthGuard(
      buildReflector(false).reflector,
      buildTokenService({ verify: jest.fn().mockReturnValue(payload) }),
      users,
    );
    const result = guard.canActivate(
      buildContextWithRequest('Bearer good.token').context,
    );
    await expect(result).rejects.toThrow('db down 247');
    await expect(result).rejects.not.toBeInstanceOf(UnauthorizedException);
  });
});

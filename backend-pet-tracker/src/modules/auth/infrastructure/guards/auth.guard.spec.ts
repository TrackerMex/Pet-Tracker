import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { TokenService } from '../../domain/ports/token-service';
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
  it('lanza UnauthorizedException si no hay header Authorization', () => {
    const { reflector } = buildReflector(false);
    const guard = new AuthGuard(reflector, buildTokenService());
    const context = buildContext({});

    expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
  });

  it('lanza UnauthorizedException si el header no trae esquema Bearer', () => {
    const { reflector } = buildReflector(false);
    const guard = new AuthGuard(reflector, buildTokenService());
    const context = buildContext({ authorizationHeader: 'Basic abc123' });

    expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
  });
});

describe('R6: ruta protegida con token invalido o expirado responde 401', () => {
  it('lanza UnauthorizedException si tokenService.verify lanza (firma invalida)', () => {
    const { reflector } = buildReflector(false);
    const verify = jest.fn(() => {
      throw new Error('invalid signature');
    });
    const guard = new AuthGuard(reflector, buildTokenService({ verify }));
    const context = buildContext({ authorizationHeader: 'Bearer bad.token' });

    expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
  });

  it('lanza UnauthorizedException si tokenService.verify lanza (expirado)', () => {
    const { reflector } = buildReflector(false);
    const verify = jest.fn(() => {
      throw new Error('token expired');
    });
    const guard = new AuthGuard(reflector, buildTokenService({ verify }));
    const context = buildContext({
      authorizationHeader: 'Bearer expired.token',
    });

    expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
  });
});

describe('R7: rutas @Public() no exigen token', () => {
  it('deja pasar sin Authorization cuando el handler es @Public()', () => {
    const { reflector } = buildReflector(true);
    const guard = new AuthGuard(reflector, buildTokenService());
    const context = buildContext({});

    expect(guard.canActivate(context)).toBe(true);
  });

  it('lee la metadata IS_PUBLIC_KEY desde handler y clase', () => {
    const { reflector, getAllAndOverride } = buildReflector(true);
    const guard = new AuthGuard(reflector, buildTokenService());
    const context = buildContext({});

    guard.canActivate(context);

    expect(getAllAndOverride).toHaveBeenCalledWith(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
  });

  it('deja pasar una ruta @Public() aunque venga con un token invalido (no exige ni valida)', () => {
    const { reflector } = buildReflector(true);
    const verify = jest.fn(() => {
      throw new Error('invalid');
    });
    const guard = new AuthGuard(reflector, buildTokenService({ verify }));
    const context = buildContext({ authorizationHeader: 'Bearer bad.token' });

    expect(guard.canActivate(context)).toBe(true);
    expect(verify).not.toHaveBeenCalled();
  });
});

describe('R8: token valido adjunta { id, email } a request.user', () => {
  it('popula request.user con sub/email del payload verificado', () => {
    const { reflector } = buildReflector(false);
    const verify = jest
      .fn()
      .mockReturnValue({ sub: 'user-1', email: 'ada@example.com' });
    const guard = new AuthGuard(reflector, buildTokenService({ verify }));
    const request: { headers: Record<string, string>; user?: unknown } = {
      headers: { authorization: 'Bearer good.token' },
    };
    const context = {
      getHandler: () => ({}) as unknown,
      getClass: () => ({}) as unknown,
      switchToHttp: () => ({ getRequest: () => request }),
    } as unknown as ExecutionContext;

    const result = guard.canActivate(context);

    expect(result).toBe(true);
    expect(request.user).toEqual({ id: 'user-1', email: 'ada@example.com' });
    expect(verify).toHaveBeenCalledWith('good.token');
  });
});

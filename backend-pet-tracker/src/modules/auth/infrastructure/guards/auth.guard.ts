import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { TOKEN_SERVICE } from '@/modules/auth/domain/ports/token-service';
import type {
  TokenService,
  TokenPayload,
} from '@/modules/auth/domain/ports/token-service';
import { USER_REPOSITORY } from '@/modules/auth/domain/repositories/user.repository';
import type { UserRepository } from '@/modules/auth/domain/repositories/user.repository';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

export interface AuthenticatedRequest extends Request {
  user: { id: string; email: string };
}

/**
 * Guard global (registrado como APP_GUARD en auth.module.ts, design.md
 * `auth-login-me`): si el handler/clase tiene @Public(), deja pasar sin
 * verificar (R7); si no, exige `Authorization: Bearer <token>` valido y
 * vigente (R5, R6) y adjunta `request.user = { id, email }` desde los claims
 * del JWT, tras comprobar que el usuario existe en `users` (#247 R2).
 */
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @Inject(TOKEN_SERVICE) private readonly tokenService: TokenService,
    @Inject(USER_REPOSITORY) private readonly users: UserRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const token = extractBearerToken(request.headers.authorization);
    if (!token) throw new UnauthorizedException();
    let payload: TokenPayload;
    try {
      payload = this.tokenService.verify(token);
    } catch {
      throw new UnauthorizedException();
    }
    const user = await this.users.findById(payload.sub);
    if (!user) throw new UnauthorizedException();
    request.user = { id: payload.sub, email: payload.email };
    return true;
  }
}

function extractBearerToken(header: string | undefined): string | null {
  if (!header) {
    return null;
  }

  const [scheme, token] = header.split(' ');

  return scheme === 'Bearer' && token ? token : null;
}

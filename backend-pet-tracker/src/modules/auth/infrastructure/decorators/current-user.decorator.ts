import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthenticatedRequest } from '../guards/auth.guard';

export interface CurrentUserPayload {
  id: string;
  email: string;
}

/**
 * Lee `request.user` ya poblado por AuthGuard (auth-login-me R8) — no vuelve
 * a tocar la base de datos ni el token. Los handlers que necesitan el
 * perfil completo (GET/PATCH /v1/me) hacen su propio findById explicito.
 */
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): CurrentUserPayload => {
    const request = ctx.switchToHttp().getRequest<AuthenticatedRequest>();
    return request.user;
  },
);

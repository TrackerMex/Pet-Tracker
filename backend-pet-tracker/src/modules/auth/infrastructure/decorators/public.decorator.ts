import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

/**
 * Marca una ruta como accesible sin `Authorization: Bearer <token>`, leida
 * por AuthGuard (guards/auth.guard.ts). Aplica a `POST /v1/auth/register`,
 * `POST /v1/auth/verify-email`, `POST /v1/auth/login` y `GET /v1/health`
 * (auth-login-me R7).
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

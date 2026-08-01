import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import {
  TokenPayload,
  TokenService,
} from '@/modules/auth/domain/ports/token-service';

/**
 * TTL del access_token: constante de aplicacion, no env var (design.md
 * `auth-login-me` — refresh tokens fuera de alcance de esta feature, un TTL
 * configurable es prematuro sin ese flujo).
 */
export const ACCESS_TOKEN_TTL_SECONDS = 24 * 60 * 60;

/**
 * Unica pieza del proyecto que conoce el paquete `jsonwebtoken`. Lee
 * JWT_SECRET vía ConfigService (nunca process.env directo,
 * docs/conventions.md §Variables de entorno).
 */
@Injectable()
export class JwtTokenService implements TokenService {
  private readonly secret: string;

  constructor(configService: ConfigService) {
    this.secret = configService.getOrThrow<string>('JWT_SECRET');
  }

  sign(payload: TokenPayload): string {
    return jwt.sign(payload, this.secret, {
      algorithm: 'HS256',
      expiresIn: ACCESS_TOKEN_TTL_SECONDS,
    });
  }

  verify(token: string): TokenPayload {
    const decoded = jwt.verify(token, this.secret, { algorithms: ['HS256'] });

    if (typeof decoded === 'string' || !decoded.sub || !decoded.email) {
      throw new Error('Invalid token payload');
    }

    return { sub: decoded.sub, email: decoded.email as string };
  }
}

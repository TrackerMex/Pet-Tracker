export const TOKEN_SERVICE = Symbol('TokenService');

/** Claims minimos que viajan en el JWT (auth-login-me R4, R8). */
export interface TokenPayload {
  sub: string;
  email: string;
}

/**
 * Puerto de firma/verificacion de tokens: mantiene la libreria concreta
 * (jsonwebtoken, ver infrastructure/security/jwt-token-service.ts) fuera del
 * dominio, mismo patron que PasswordHasher.
 */
export interface TokenService {
  sign(payload: TokenPayload): string;
  /** Lanza si la firma no verifica o el token esta expirado. */
  verify(token: string): TokenPayload;
}

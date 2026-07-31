import { createHash, randomBytes } from 'node:crypto';

const TOKEN_BYTES = 32;

/**
 * Vigencia del token de verificacion: 24 h fijas. Es un valor de producto, no
 * de infraestructura desplegable, por eso es constante y no variable de
 * entorno (specs/auth-registration/design.md).
 */
export const VERIFICATION_TOKEN_TTL_MS = 24 * 60 * 60 * 1000;

/** Token opaco de 256 bits en base64url; solo viaja al usuario. */
export function generateVerificationToken(): string {
  return randomBytes(TOKEN_BYTES).toString('base64url');
}

/**
 * Lo unico que se persiste. SHA-256 (no argon2) porque el token ya es
 * aleatorio de alta entropia: no necesita un hash lento, solo evitar que un
 * dump de la tabla contenga tokens usables.
 */
export function hashVerificationToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

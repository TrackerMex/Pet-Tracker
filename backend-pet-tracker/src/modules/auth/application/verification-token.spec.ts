import { createHash } from 'node:crypto';
import {
  generateVerificationToken,
  hashVerificationToken,
  VERIFICATION_TOKEN_TTL_MS,
} from './verification-token';

describe('R6: el token de verificacion es opaco, aleatorio y se guarda hasheado', () => {
  it('genera un token base64url de al menos 256 bits de entropia', () => {
    const token = generateVerificationToken();

    expect(token).toMatch(/^[A-Za-z0-9_-]{43,}$/);
  });

  it('genera un token distinto en cada llamada', () => {
    expect(generateVerificationToken()).not.toBe(generateVerificationToken());
  });

  it('hashea con SHA-256 en hexadecimal, de forma determinista', () => {
    const token = generateVerificationToken();

    expect(hashVerificationToken(token)).toBe(
      createHash('sha256').update(token).digest('hex'),
    );
    expect(hashVerificationToken(token)).toHaveLength(64);
    expect(hashVerificationToken(token)).not.toContain(token);
  });

  it('expira 24 horas despues de la emision', () => {
    expect(VERIFICATION_TOKEN_TTL_MS).toBe(24 * 60 * 60 * 1000);
  });
});

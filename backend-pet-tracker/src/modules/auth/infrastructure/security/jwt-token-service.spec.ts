import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { JwtTokenService } from './jwt-token-service';

const SECRET = 'test-jwt-secret';

function buildConfigService(): ConfigService {
  return {
    getOrThrow: (key: string) => {
      if (key === 'JWT_SECRET') return SECRET;
      throw new Error(`Unexpected config key: ${key}`);
    },
  } as unknown as ConfigService;
}

describe('R4: sign() firma un JWT HS256 con claims sub/email y expiracion de 24h', () => {
  const service = new JwtTokenService(buildConfigService());

  it('el token decodifica con algoritmo HS256 y claims sub/email', () => {
    const token = service.sign({ sub: 'user-1', email: 'ada@example.com' });
    const decoded = jwt.decode(token, { complete: true });

    expect(decoded?.header.alg).toBe('HS256');
    expect((decoded?.payload as jwt.JwtPayload).sub).toBe('user-1');
    expect((decoded?.payload as jwt.JwtPayload).email).toBe('ada@example.com');
  });

  it('exp - iat es exactamente 86400 segundos (24h)', () => {
    const token = service.sign({ sub: 'user-1', email: 'ada@example.com' });
    const payload = jwt.decode(token) as jwt.JwtPayload;

    expect(payload.exp! - payload.iat!).toBe(86400);
  });

  it('el token verifica contra el mismo secreto (JWT_SECRET)', () => {
    const token = service.sign({ sub: 'user-1', email: 'ada@example.com' });

    expect(() => jwt.verify(token, SECRET)).not.toThrow();
  });
});

describe('R1/R8: verify() devuelve los claims sub/email de un token valido', () => {
  const service = new JwtTokenService(buildConfigService());

  it('devuelve { sub, email } para un token firmado por sign()', () => {
    const token = service.sign({ sub: 'user-1', email: 'ada@example.com' });

    expect(service.verify(token)).toEqual({
      sub: 'user-1',
      email: 'ada@example.com',
    });
  });
});

describe('R6: verify() lanza para firma invalida o token expirado', () => {
  const service = new JwtTokenService(buildConfigService());

  it('lanza si el token fue firmado con otro secreto', () => {
    const tokenWithOtherSecret = jwt.sign(
      { sub: 'user-1', email: 'ada@example.com' },
      'another-secret',
      { algorithm: 'HS256' },
    );

    expect(() => service.verify(tokenWithOtherSecret)).toThrow();
  });

  it('lanza si el token ya expiro', () => {
    const expiredToken = jwt.sign(
      { sub: 'user-1', email: 'ada@example.com' },
      SECRET,
      { algorithm: 'HS256', expiresIn: -10 },
    );

    expect(() => service.verify(expiredToken)).toThrow();
  });

  it('lanza para un string que no es un JWT valido', () => {
    expect(() => service.verify('not-a-jwt')).toThrow();
  });
});

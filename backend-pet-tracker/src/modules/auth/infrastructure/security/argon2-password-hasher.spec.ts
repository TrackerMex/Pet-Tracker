import { Argon2PasswordHasher } from './argon2-password-hasher';

describe('R1: el password se persiste hasheado con argon2id, nunca en claro', () => {
  const hasher = new Argon2PasswordHasher();

  it('devuelve un string PHC de argon2id distinto del password recibido', async () => {
    const hash = await hasher.hash('sup3rsecret');

    expect(hash.startsWith('$argon2id$')).toBe(true);
    expect(hash).not.toContain('sup3rsecret');
  });

  it('genera un salt distinto por llamada (dos hashes del mismo password difieren)', async () => {
    const [first, second] = await Promise.all([
      hasher.hash('sup3rsecret'),
      hasher.hash('sup3rsecret'),
    ]);

    expect(first).not.toBe(second);
  });
});

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

describe('R1 (auth-login-me): verify() confirma un password correcto contra su hash', () => {
  const hasher = new Argon2PasswordHasher();

  it('devuelve true cuando el password coincide con el hash almacenado', async () => {
    const hash = await hasher.hash('sup3rsecret');

    await expect(hasher.verify('sup3rsecret', hash)).resolves.toBe(true);
  });
});

describe('R2 (auth-login-me): verify() rechaza un password incorrecto', () => {
  const hasher = new Argon2PasswordHasher();

  it('devuelve false cuando el password no coincide con el hash almacenado', async () => {
    const hash = await hasher.hash('sup3rsecret');

    await expect(hasher.verify('wrong-password', hash)).resolves.toBe(false);
  });
});

import { LoginUserSchema } from './login-user.dto';

describe('R3: el payload de login invalido no pasa el schema zod', () => {
  it('rechaza un email con formato invalido', () => {
    const result = LoginUserSchema.safeParse({
      email: 'not-an-email',
      password: 'sup3rsecret',
    });

    expect(result.success).toBe(false);
  });

  it('rechaza un password vacio', () => {
    const result = LoginUserSchema.safeParse({
      email: 'ada@example.com',
      password: '',
    });

    expect(result.success).toBe(false);
  });

  it('rechaza un payload sin password', () => {
    const result = LoginUserSchema.safeParse({ email: 'ada@example.com' });

    expect(result.success).toBe(false);
  });

  it('acepta un payload valido', () => {
    const result = LoginUserSchema.safeParse({
      email: 'ada@example.com',
      password: 'sup3rsecret',
    });

    expect(result.success).toBe(true);
  });
});

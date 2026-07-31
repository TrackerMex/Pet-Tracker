import { UpdateProfileSchema } from './update-profile.dto';

describe('R10: UpdateProfileSchema acepta cualquier subconjunto de campos', () => {
  it('acepta solo firstName', () => {
    const result = UpdateProfileSchema.safeParse({ firstName: 'Grace' });

    expect(result.success).toBe(true);
  });

  it('acepta todos los campos reconocidos', () => {
    const result = UpdateProfileSchema.safeParse({
      firstName: 'Grace',
      lastName: 'Hopper',
      phone: '+525512345678',
      country: 'US',
      timezone: 'America/New_York',
    });

    expect(result.success).toBe(true);
  });
});

describe('R11: timezone invalida no pasa el schema', () => {
  it('rechaza un valor que no esta en Intl.supportedValuesOf("timeZone")', () => {
    const result = UpdateProfileSchema.safeParse({
      timezone: 'Not/A_Timezone',
    });

    expect(result.success).toBe(false);
  });

  it('acepta un timezone IANA valido', () => {
    const result = UpdateProfileSchema.safeParse({
      timezone: 'America/Mexico_City',
    });

    expect(result.success).toBe(true);
  });
});

describe('R12: country invalido no pasa el schema', () => {
  it('rechaza minusculas', () => {
    const result = UpdateProfileSchema.safeParse({ country: 'mx' });

    expect(result.success).toBe(false);
  });

  it('rechaza longitud distinta de 2', () => {
    const result = UpdateProfileSchema.safeParse({ country: 'MEX' });

    expect(result.success).toBe(false);
  });
});

describe('R13: body vacio es valido (no-op)', () => {
  it('un objeto vacio valida contra el schema', () => {
    const result = UpdateProfileSchema.safeParse({});

    expect(result.success).toBe(true);
  });
});

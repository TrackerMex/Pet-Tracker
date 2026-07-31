import { RegisterUserSchema } from './register-user.dto';

const validPayload = {
  firstName: 'Ada',
  lastName: 'Lovelace',
  email: 'ada@example.com',
  phone: '+525512345678',
  password: 'sup3rsecret',
  passwordConfirmation: 'sup3rsecret',
  country: 'MX',
  timezone: 'America/Mexico_City',
  termsAccepted: true,
};

function payloadWithout(field: string): Record<string, unknown> {
  const payload: Record<string, unknown> = { ...validPayload };
  delete payload[field];

  return payload;
}

function issuePaths(payload: unknown): string[] {
  const result = RegisterUserSchema.safeParse(payload);
  if (result.success) {
    return [];
  }
  return result.error.issues.map((issue) => issue.path.join('.'));
}

describe('R1: el schema de registro acepta el payload completo y valido', () => {
  it('parsea el payload valido, con y sin timezone', () => {
    expect(RegisterUserSchema.safeParse(validPayload).success).toBe(true);

    expect(
      RegisterUserSchema.safeParse(payloadWithout('timezone')).success,
    ).toBe(true);
  });
});

describe('R3: passwordConfirmation distinto de password es invalido', () => {
  it('rechaza el payload y senala passwordConfirmation', () => {
    expect(
      issuePaths({ ...validPayload, passwordConfirmation: 'otracosa123' }),
    ).toContain('passwordConfirmation');
  });
});

describe('R4: termsAccepted ausente o false es invalido', () => {
  it('rechaza termsAccepted = false', () => {
    expect(issuePaths({ ...validPayload, termsAccepted: false })).toContain(
      'termsAccepted',
    );
  });

  it('rechaza el payload sin termsAccepted', () => {
    expect(issuePaths(payloadWithout('termsAccepted'))).toContain(
      'termsAccepted',
    );
  });
});

describe('R5: el payload que no valida contra el schema zod es invalido', () => {
  it('rechaza un email con formato invalido', () => {
    expect(issuePaths({ ...validPayload, email: 'no-es-un-email' })).toContain(
      'email',
    );
  });

  it('rechaza un password de menos de 8 caracteres', () => {
    expect(
      issuePaths({
        ...validPayload,
        password: 'corta7',
        passwordConfirmation: 'corta7',
      }),
    ).toContain('password');
  });

  it.each([
    'firstName',
    'lastName',
    'email',
    'phone',
    'password',
    'passwordConfirmation',
    'country',
  ])('rechaza el payload sin el campo requerido %s', (field) => {
    expect(issuePaths(payloadWithout(field))).toContain(field);
  });

  it('rechaza un country que no es ISO 3166-1 alpha-2 en mayusculas', () => {
    expect(issuePaths({ ...validPayload, country: 'mx' })).toContain('country');
    expect(issuePaths({ ...validPayload, country: 'MEX' })).toContain(
      'country',
    );
  });
});

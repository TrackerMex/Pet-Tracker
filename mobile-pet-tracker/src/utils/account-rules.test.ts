import {
  EMAIL_PATTERN,
  validateLogin,
  validateRegister,
  validateProfile,
  validateForgot,
  validateResetPassword,
} from './account-rules';

const VALID = {
  firstName: 'A', lastName: 'S', email: 'alex@example.com',
  phone: '+525555555555', country: 'MX', password: 'correct horse',
  passwordConfirmation: 'correct horse',
};
const invalidEmail = { labelKey: 'forgot.invalidEmail' };
const firstNameRequired = { labelKey: 'validation.firstNameRequired' };
const lastNameRequired = { labelKey: 'validation.lastNameRequired' };
const passwordRequired = { labelKey: 'validation.passwordRequired' };
const mismatch = { labelKey: 'validation.passwordsDontMatch' };
const countryLength = { labelKey: 'validation.countryLength' };
const countryLetters = { labelKey: 'validation.countryLetters' };
const tooShort = (min: number) => ({ labelKey: 'validation.tooShort', params: { min } });
const tooLong = (max: number) => ({ labelKey: 'validation.tooLong', params: { max } });
const bothPasswords = (value: string) => ({ password: value, passwordConfirmation: value });

describe('#183 R2: reglas de cuenta iguales a los DTO', () => {
  it.each<[string, boolean]>([
    ['alex@example.com', true],
    ['Ana@Example.com', true],
    ["o'neil+tag@mail.example.co", true],
    ['alex@example.c', false],
    ['alex.@example.com', false],
    ['.alex@example.com', false],
    ['a..b@example.com', false],
    ['ñu@example.com', false],
    ['alex@-example.com', false],
    ['alex@example.co1', false],
    ['alex@example', false],
    ['alex @example.com', false],
    ['alex.example.com', false],
    [' alex@example.com', false],
    ['', false],
    ['a_1-b.c_@x2-y.example.technology', true],
    ['z9@1x.io', true],
    ['+@b.co', true],
    ['a-@b.co', true],
    ['a@b_c.co', false],
  ])('#183 R2: EMAIL_PATTERN decide «%s» como z.email() de zod 4.4.3 (%s)', (value, expected) => {
    expect(EMAIL_PATTERN.test(value)).toStrictEqual(expected);
  });

  it.each<[string, { email?: string; password?: string }, Record<string, unknown>]>([
    ['L1', {}, {}],
    ['L2', { password: ' ' }, {}],
    ['L3', { email: 'alex.example.com' }, { email: invalidEmail }],
    ['L4', { password: '' }, { password: passwordRequired }],
    ['L5', { email: 'alex.example.com', password: '' }, { email: invalidEmail, password: passwordRequired }],
    ['L6', { email: 'a'.repeat(309) + '@example.com' }, {}],
  ])('#183 R2: validateLogin %s', (_label, changes, expected) => {
    expect(validateLogin({ email: 'alex@example.com', password: 'correct horse', ...changes })).toStrictEqual(expected);
  });

  it.each<[string, Partial<typeof VALID>, Record<string, unknown>]>([
    ['G1', {}, {}],
    ['G2', { firstName: '' }, { firstName: firstNameRequired }],
    ['G3', { firstName: '   ' }, { firstName: firstNameRequired }],
    ['G4', { firstName: ' ' + 'a'.repeat(120) + ' ' }, {}],
    ['G5', { firstName: 'a'.repeat(121) }, { firstName: tooLong(120) }],
    ['G6', { lastName: '' }, { lastName: lastNameRequired }],
    ['G7', { lastName: '   ' }, { lastName: lastNameRequired }],
    ['G8', { lastName: ' ' + 'a'.repeat(120) + ' ' }, {}],
    ['G9', { lastName: 'a'.repeat(121) }, { lastName: tooLong(120) }],
    ['G10', { email: 'alex.example.com' }, { email: invalidEmail }],
    ['G11', { email: 'alex@example.c' }, { email: invalidEmail }],
    ['G12', { email: 'a'.repeat(308) + '@example.com' }, {}],
    ['G13', { email: 'a'.repeat(309) + '@example.com' }, { email: tooLong(320) }],
    ['G14', { email: 'a'.repeat(321) }, { email: invalidEmail }],
    ['G15', { phone: '123456' }, { phone: tooShort(7) }],
    ['G16', { phone: '  123456  ' }, { phone: tooShort(7) }],
    ['G17', { phone: '1234567' }, {}],
    ['G18', { phone: '55 1234' }, {}],
    ['G19', { phone: '1'.repeat(21) }, { phone: tooLong(20) }],
    ['G20', { phone: ' ' + '1'.repeat(20) + ' ' }, {}],
    ['G21', { country: '' }, { country: countryLength }],
    ['G22', { country: 'M' }, { country: countryLength }],
    ['G23', { country: 'MX ' }, { country: countryLength }],
    ['G24', { country: 'm' }, { country: countryLength }],
    ['G25', { country: 'mx' }, { country: countryLetters }],
    ['G26', { country: 'M1' }, { country: countryLetters }],
    ['G27', { country: 'ÑA' }, { country: countryLetters }],
    ['G28', bothPasswords('1234567'), { password: tooShort(8) }],
    ['G29', bothPasswords(' '.repeat(8)), {}],
    ['G30', bothPasswords('a'.repeat(128)), {}],
    ['G31', bothPasswords('a'.repeat(129)), { password: tooLong(128) }],
    ['G32', { passwordConfirmation: 'correct horsE' }, { passwordConfirmation: mismatch }],
    ['G33', { password: '1234567', passwordConfirmation: 'x' }, { password: tooShort(8), passwordConfirmation: mismatch }],
  ])('#183 R2: validateRegister %s', (_label, changes, expected) => {
    expect(validateRegister({ ...VALID, ...changes })).toStrictEqual(expected);
  });

  it.each<[string, string, Record<string, unknown>]>([
    ['F1', 'alex@example.com', {}],
    ['F2', 'alex.example.com', { email: invalidEmail }],
    ['F3', 'a'.repeat(308) + '@example.com', {}],
    ['F4', 'a'.repeat(309) + '@example.com', { email: tooLong(320) }],
    ['F5', 'a'.repeat(321), { email: invalidEmail }],
  ])('#183 R2: validateForgot %s', (_label, email, expected) => {
    expect(validateForgot({ email })).toStrictEqual(expected);
  });

  it.each<[string, string, string, Record<string, unknown>]>([
    ['N1', 'new-password-123', 'new-password-123', {}],
    ['N2', '1234567', '1234567', { password: tooShort(8) }],
    ['N3', ' '.repeat(8), ' '.repeat(8), {}],
    ['N4', 'a'.repeat(128), 'a'.repeat(128), {}],
    ['N5', 'a'.repeat(128) + ' ', 'a'.repeat(128) + ' ', { password: tooLong(128) }],
    ['N6', 'new-password-123', 'new-password-123 ', { passwordConfirmation: mismatch }],
    ['N7', '1234567', 'x', { password: tooShort(8), passwordConfirmation: mismatch }],
  ])('#183 R2: validateResetPassword %s', (_label, password, passwordConfirmation, expected) => {
    expect(validateResetPassword({ password, passwordConfirmation })).toStrictEqual(expected);
  });
});


describe('#194 R2: validateProfile comparte las reglas de registro', () => {
  const profile = { firstName: 'Ada', lastName: 'Lovelace', phone: '+525500000000', country: 'MX' };
  const allInvalid = { firstName: '   ', lastName: '', phone: ' 123456 ', country: 'M1' };
  const allIssues = {
    firstName: { labelKey: 'validation.firstNameRequired' },
    lastName: { labelKey: 'validation.lastNameRequired' },
    phone: { labelKey: 'validation.tooShort', params: { min: 7 } },
    country: { labelKey: 'validation.countryLetters' },
  };

  it.each<[string, { values: Partial<typeof profile>; expected: Record<string, unknown> }[]]>([
    ['valid values', [{ values: {}, expected: {} }]],
    ['required names', [
      { values: { firstName: '   ' }, expected: { firstName: { labelKey: 'validation.firstNameRequired' } } },
      { values: { lastName: '' }, expected: { lastName: { labelKey: 'validation.lastNameRequired' } } },
    ]],
    ['name boundaries', [
      { values: { firstName: ' ' + 'a'.repeat(120) + ' ' }, expected: {} },
      { values: { firstName: 'a'.repeat(121) }, expected: { firstName: { labelKey: 'validation.tooLong', params: { max: 120 } } } },
      { values: { lastName: 'a'.repeat(120) }, expected: {} },
      { values: { lastName: 'a'.repeat(121) }, expected: { lastName: { labelKey: 'validation.tooLong', params: { max: 120 } } } },
    ]],
    ['trimmed phone boundaries', [
      { values: { phone: ' 123456 ' }, expected: { phone: { labelKey: 'validation.tooShort', params: { min: 7 } } } },
      { values: { phone: '1234567' }, expected: {} },
      { values: { phone: '1'.repeat(20) }, expected: {} },
      { values: { phone: '1'.repeat(21) }, expected: { phone: { labelKey: 'validation.tooLong', params: { max: 20 } } } },
    ]],
    ['country length and letters', [
      { values: { country: '' }, expected: { country: { labelKey: 'validation.countryLength' } } },
      { values: { country: 'M' }, expected: { country: { labelKey: 'validation.countryLength' } } },
      { values: { country: 'mx' }, expected: { country: { labelKey: 'validation.countryLetters' } } },
      { values: { country: 'M1' }, expected: { country: { labelKey: 'validation.countryLetters' } } },
      { values: { country: 'MEX' }, expected: { country: { labelKey: 'validation.countryLength' } } },
    ]],
    ['all invalid fields', [{ values: allInvalid, expected: allIssues }]],
  ])('#194 R2: validates %s', (_name, cases) => {
    for (const { values, expected } of cases) {
      expect(validateProfile({ ...profile, ...values })).toEqual(expected);
    }
  });

  it('#194 R2: validateRegister conserva las issues de perfil', () => {
    expect(validateRegister({ ...VALID, ...allInvalid })).toEqual(allIssues);
  });
});

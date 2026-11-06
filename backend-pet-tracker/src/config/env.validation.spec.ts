import { EnvValidationError, validateEnv } from './env.validation';
const base = {
  NODE_ENV: 'production',
  SIM_MODE: 'true',
  JWT_SECRET: 'jwt-sentinel-245',
};
describe('R12: validateEnv aborta en producción ante configuración incompleta', () => {
  it.each(['test', 'development', undefined])(
    'R12: con NODE_ENV %p devuelve el mismo objeto sin validar',
    (nodeEnv) => {
      const config = { NODE_ENV: nodeEnv };
      expect(validateEnv(config)).toBe(config);
    },
  );
  it('R12: en producción con configuración válida devuelve el mismo objeto', () => {
    for (const config of [
      base,
      { ...base, SIM_MODE: 'false', WIALON_TOKEN: 'wialon-tok' },
      {
        ...base,
        EMAIL_ENABLED: 'true',
        RESEND_API_KEY: 'resend-key',
        RESEND_FROM: 'sender@example.com',
        RESET_LINK_HOST: 'reset.example.com',
      },
      {
        ...base,
        ANTHROPIC_ENABLED: 'true',
        ANTHROPIC_API_KEY: 'anthropic-key',
        ANTHROPIC_MODEL: 'model',
      },
      { ...base, PUSH_ENABLED: 'true', POLLER_ENABLED: 'true' },
    ])
      expect(validateEnv(config)).toBe(config);
  });
  it.each<[string, Record<string, unknown>, string[]]>([
    ['SIM_MODE ausente', { SIM_MODE: undefined }, ['SIM_MODE']],
    ['SIM_MODE ambiguo', { SIM_MODE: 'yes' }, ['SIM_MODE']],
    ['Wialon sin token', { SIM_MODE: 'false' }, ['WIALON_TOKEN']],
    [
      'Wialon PENDING',
      { SIM_MODE: 'false', WIALON_TOKEN: 'PENDING' },
      ['WIALON_TOKEN'],
    ],
    [
      'Email sin claves',
      { EMAIL_ENABLED: 'true' },
      ['RESEND_API_KEY', 'RESEND_FROM', 'RESET_LINK_HOST'],
    ],
    [
      'IA incompleta',
      {
        ANTHROPIC_ENABLED: 'true',
        ANTHROPIC_API_KEY: 'PENDING',
        ANTHROPIC_MODEL: '  ',
      },
      ['ANTHROPIC_API_KEY', 'ANTHROPIC_MODEL'],
    ],
    ['JWT en blanco', { JWT_SECRET: '   ' }, ['JWT_SECRET']],
  ])(
    'R12: %s lanza EnvValidationError que nombra las variables',
    (_label, changes, keys) => {
      let caught: unknown;
      try {
        validateEnv({ ...base, ...changes });
      } catch (error) {
        caught = error;
      }
      expect(caught).toBeInstanceOf(EnvValidationError);
      expect((caught as Error).name).toBe('EnvValidationError');
      for (const key of keys) expect((caught as Error).message).toContain(key);
    },
  );
  it('R12: varias violaciones salen en un único error que las nombra todas y no reproduce valores', () => {
    const config = {
      NODE_ENV: 'production',
      SIM_MODE: 'sim-sentinel-245',
      EMAIL_ENABLED: 'true',
      RESEND_API_KEY: 'resend-sentinel-245',
      RESEND_FROM: '',
      ANTHROPIC_ENABLED: 'true',
      ANTHROPIC_API_KEY: 'anthropic-sentinel-245',
      ANTHROPIC_MODEL: '',
      JWT_SECRET: '',
    };
    let caught: unknown;
    try {
      validateEnv(config);
    } catch (error) {
      caught = error;
    }
    expect(caught).toBeInstanceOf(EnvValidationError);
    const message = (caught as Error).message;
    for (const key of [
      'SIM_MODE',
      'RESEND_FROM',
      'RESET_LINK_HOST',
      'ANTHROPIC_MODEL',
      'JWT_SECRET',
    ])
      expect(message).toContain(key);
    for (const value of [
      'sim-sentinel-245',
      'resend-sentinel-245',
      'anthropic-sentinel-245',
    ])
      expect(message).not.toContain(value);
  });
});

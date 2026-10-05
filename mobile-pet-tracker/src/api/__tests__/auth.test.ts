import { forgotPassword, type ForgotPasswordState, login, register, resetPassword } from '../auth';

const baseUrl = 'http://example.test/v1/';
const loginEndpoint = 'http://example.test/v1/auth/login';
const registerEndpoint = 'http://example.test/v1/auth/register';
const resetPasswordEndpoint =
  'http://example.test/v1/auth/reset-password';

function response(status: number, body: unknown): Response {
  return {
    status,
    json: jest.fn().mockResolvedValue(body),
  } as unknown as Response;
}

function invalidJsonResponse(status: number): Response {
  return {
    status,
    json: jest.fn().mockRejectedValue(new SyntaxError('invalid json')),
  } as unknown as Response;
}

describe('R1: login mapea la respuesta por kind', () => {
  const body = { email: 'alex@example.com', password: 'correct horse' };

  it('posts credentials and maps a successful access token', async () => {
    const fetchFn = jest
      .fn()
      .mockResolvedValue(response(200, { access_token: 'jwt-token' })) as unknown as typeof fetch;

    await expect(login(baseUrl, body, fetchFn)).resolves.toEqual({
      kind: 'ok',
      accessToken: 'jwt-token',
    });
    expect(fetchFn).toHaveBeenCalledWith(loginEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  });

  it('maps invalid credentials without depending on the response body', async () => {
    const fetchFn = jest.fn().mockResolvedValue(response(401, {})) as unknown as typeof fetch;

    await expect(login(baseUrl, body, fetchFn)).resolves.toEqual({
      kind: 'invalid-credentials',
    });
  });

  it('maps backend field validation errors', async () => {
    const errors = [{ path: 'email', message: 'Invalid email address' }];
    const fetchFn = jest
      .fn()
      .mockResolvedValue(response(400, { errors })) as unknown as typeof fetch;

    await expect(login(baseUrl, body, fetchFn)).resolves.toEqual({
      kind: 'validation',
      errors,
    });
  });

  it.each([
    ['an unexpected status', response(500, { message: 'failure' })],
    ['invalid JSON', invalidJsonResponse(200)],
    ['a malformed success body', response(200, { access_token: 42 })],
    ['malformed validation errors', response(400, { errors: [{ path: 1 }] })],
  ])('maps %s to error', async (_case, backendResponse) => {
    const fetchFn = jest.fn().mockResolvedValue(backendResponse) as unknown as typeof fetch;

    await expect(login(baseUrl, body, fetchFn)).resolves.toEqual({ kind: 'error' });
  });

  it('maps a fetch rejection to unreachable', async () => {
    const fetchFn = jest
      .fn()
      .mockRejectedValue(new Error('network down')) as unknown as typeof fetch;

    await expect(login(baseUrl, body, fetchFn)).resolves.toEqual({
      kind: 'unreachable',
      message: 'network down',
    });
  });

  it.each([undefined, ''])('maps missing base URL %p without fetching', async (missingUrl) => {
    const fetchFn = jest.fn() as unknown as typeof fetch;

    await expect(login(missingUrl, body, fetchFn)).resolves.toEqual({
      kind: 'missing-config',
    });
    expect(fetchFn).not.toHaveBeenCalled();
  });
});

describe('R2: register mapea la respuesta por kind', () => {
  const body = {
    firstName: 'Alex',
    lastName: 'Smith',
    email: 'alex@example.com',
    phone: '+525555555555',
    password: 'correct horse',
    passwordConfirmation: 'correct horse',
    country: 'MX',
    timezone: 'America/Mexico_City',
    termsAccepted: true as const,
  };
  const user = {
    id: '0198d3d1-0000-7000-8000-000000000001',
    email: body.email,
    firstName: body.firstName,
    lastName: body.lastName,
    phone: body.phone,
    country: body.country,
    timezone: body.timezone,
    createdAt: '2026-08-21T00:00:00.000Z',
  };

  it('posts the complete request and maps the registered user', async () => {
    const fetchFn = jest
      .fn()
      .mockResolvedValue(response(201, user)) as unknown as typeof fetch;

    await expect(register(baseUrl, body, fetchFn)).resolves.toEqual({
      kind: 'ok',
      user,
    });
    expect(fetchFn).toHaveBeenCalledWith(registerEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  });

  it('maps a duplicate email', async () => {
    const fetchFn = jest.fn().mockResolvedValue(response(409, {})) as unknown as typeof fetch;

    await expect(register(baseUrl, body, fetchFn)).resolves.toEqual({
      kind: 'email-taken',
    });
  });

  it('maps backend field validation errors', async () => {
    const errors = [{ path: 'country', message: 'Country must be an ISO code' }];
    const fetchFn = jest
      .fn()
      .mockResolvedValue(response(400, { errors })) as unknown as typeof fetch;

    await expect(register(baseUrl, body, fetchFn)).resolves.toEqual({
      kind: 'validation',
      errors,
    });
  });

  it.each([
    ['an unexpected status', response(500, { message: 'failure' })],
    ['invalid JSON', invalidJsonResponse(201)],
    ['a malformed success body', response(201, { ...user, id: 7 })],
    ['malformed validation errors', response(400, { errors: 'invalid' })],
  ])('maps %s to error', async (_case, backendResponse) => {
    const fetchFn = jest.fn().mockResolvedValue(backendResponse) as unknown as typeof fetch;

    await expect(register(baseUrl, body, fetchFn)).resolves.toEqual({ kind: 'error' });
  });

  it('maps a fetch rejection to unreachable', async () => {
    const fetchFn = jest.fn().mockRejectedValue('offline') as unknown as typeof fetch;

    await expect(register(baseUrl, body, fetchFn)).resolves.toEqual({
      kind: 'unreachable',
      message: 'offline',
    });
  });

  it.each([undefined, ''])('maps missing base URL %p without fetching', async (missingUrl) => {
    const fetchFn = jest.fn() as unknown as typeof fetch;

    await expect(register(missingUrl, body, fetchFn)).resolves.toEqual({
      kind: 'missing-config',
    });
    expect(fetchFn).not.toHaveBeenCalled();
  });
});

describe('R7 (auth-reset-deep-link): resetPassword mapea la respuesta por kind', () => {
  const body = {
    token: 'reset-token-r7',
    password: 'new correct horse',
    passwordConfirmation: 'new correct horse',
  };

  it('hace POST con el payload completo y mapea 200 a ok', async () => {
    const fetchFn = jest
      .fn()
      .mockResolvedValue(response(200, { reset: true })) as unknown as typeof fetch;

    await expect(resetPassword(baseUrl, body, fetchFn)).resolves.toEqual({
      kind: 'ok',
    });
    expect(fetchFn).toHaveBeenCalledWith(resetPasswordEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  });

  it('mapea 410 a expired', async () => {
    const fetchFn = jest.fn().mockResolvedValue(response(410, {})) as unknown as typeof fetch;

    await expect(resetPassword(baseUrl, body, fetchFn)).resolves.toEqual({
      kind: 'expired',
    });
  });

  it('mapea un 400 con errors de zod a validation', async () => {
    const errors = [
      { path: 'password', message: 'Password must contain 8 characters' },
    ];
    const fetchFn = jest
      .fn()
      .mockResolvedValue(response(400, { errors })) as unknown as typeof fetch;

    await expect(resetPassword(baseUrl, body, fetchFn)).resolves.toEqual({
      kind: 'validation',
      errors,
    });
  });

  it('mapea un 400 sin errors a invalid-token', async () => {
    const fetchFn = jest
      .fn()
      .mockResolvedValue(response(400, { message: 'Invalid reset token' })) as unknown as typeof fetch;

    await expect(resetPassword(baseUrl, body, fetchFn)).resolves.toEqual({
      kind: 'invalid-token',
    });
  });

  it('mapea un rechazo de fetch a unreachable', async () => {
    const fetchFn = jest
      .fn()
      .mockRejectedValue(new Error('network down')) as unknown as typeof fetch;

    await expect(resetPassword(baseUrl, body, fetchFn)).resolves.toEqual({
      kind: 'unreachable',
      message: 'network down',
    });
  });

  it.each([undefined, ''])(
    'mapea base URL ausente %p sin hacer fetch',
    async (missingUrl) => {
      const fetchFn = jest.fn() as unknown as typeof fetch;

      await expect(resetPassword(missingUrl, body, fetchFn)).resolves.toEqual({
        kind: 'missing-config',
      });
      expect(fetchFn).not.toHaveBeenCalled();
    },
  );

  it.each([
    ['status inesperado', response(500, { message: 'failure' })],
    ['status de éxito inesperado', response(201, { reset: true })],
  ])('mapea %s a error', async (_case, backendResponse) => {
    const fetchFn = jest
      .fn()
      .mockResolvedValue(backendResponse) as unknown as typeof fetch;

    await expect(resetPassword(baseUrl, body, fetchFn)).resolves.toEqual({
      kind: 'error',
    });
  });
});


describe('#117 R2: forgotPassword mapea la respuesta por kind', () => {
  const body = { email: 'ana@example.com' };
  const forgotPasswordEndpoint = 'http://example.test/v1/auth/forgot-password';

  it('hace POST a /auth/forgot-password con { email } y mapea 200 a ok sin leer el body', async () => {
    const res = response(200, { requested: true });
    const fetchFn = jest.fn().mockResolvedValue(res) as unknown as typeof fetch;

    const state: ForgotPasswordState = await forgotPassword(baseUrl, body, fetchFn);

    expect(state).toEqual({ kind: 'ok' });
    expect(fetchFn).toHaveBeenCalledWith(forgotPasswordEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    expect(res.json).not.toHaveBeenCalled();
  });

  it('mapea 429 a rate-limited sin leer el body', async () => {
    const res = response(429, { statusCode: 429, message: 'Too Many Requests' });
    const fetchFn = jest.fn().mockResolvedValue(res) as unknown as typeof fetch;

    await expect(forgotPassword(baseUrl, body, fetchFn)).resolves.toEqual({ kind: 'rate-limited' });
    expect(res.json).not.toHaveBeenCalled();
  });

  it('mapea un 400 con errors de zod a validation', async () => {
    const errors = [{ path: 'email', message: 'Invalid email' }];
    const fetchFn = jest.fn().mockResolvedValue(response(400, { errors })) as unknown as typeof fetch;

    await expect(forgotPassword(baseUrl, body, fetchFn)).resolves.toEqual({ kind: 'validation', errors });
  });

  it('mapea un 400 sin errors a error', async () => {
    const fetchFn = jest.fn().mockResolvedValueOnce(response(400, {}))
      .mockResolvedValueOnce(invalidJsonResponse(400)) as unknown as typeof fetch;

    await expect(forgotPassword(baseUrl, body, fetchFn)).resolves.toEqual({ kind: 'error' });
    await expect(forgotPassword(baseUrl, body, fetchFn)).resolves.toEqual({ kind: 'error' });
  });

  it('mapea 500 a error', async () => {
    const fetchFn = jest.fn().mockResolvedValue(response(500, {})) as unknown as typeof fetch;

    await expect(forgotPassword(baseUrl, body, fetchFn)).resolves.toEqual({ kind: 'error' });
  });

  it('mapea un rechazo de fetch a unreachable', async () => {
    const fetchFn = jest.fn().mockRejectedValue(new Error('network down')) as unknown as typeof fetch;

    await expect(forgotPassword(baseUrl, body, fetchFn)).resolves.toEqual({ kind: 'unreachable', message: 'network down' });
  });

  it.each([undefined, ''])('mapea base URL ausente %p a missing-config sin hacer fetch', async (missingUrl) => {
    const fetchFn = jest.fn() as unknown as typeof fetch;

    await expect(forgotPassword(missingUrl, body, fetchFn)).resolves.toEqual({ kind: 'missing-config' });
    expect(fetchFn).not.toHaveBeenCalled();
  });
});


describe('#117 R11: ok no depende del cuerpo', () => {
  const body = { email: 'ana@example.com' };

  it.each([{ requested: false }, {}])('mapea 200 con body %p a ok sin leer el body', async (responseBody) => {
    const res = response(200, responseBody);
    const fetchFn = jest.fn().mockResolvedValue(res) as unknown as typeof fetch;

    await expect(forgotPassword(baseUrl, body, fetchFn)).resolves.toEqual({ kind: 'ok' });
    expect(res.json).not.toHaveBeenCalled();
  });

  it('mapea 200 con JSON inválido a ok', async () => {
    const res = invalidJsonResponse(200);
    const fetchFn = jest.fn().mockResolvedValue(res) as unknown as typeof fetch;

    await expect(forgotPassword(baseUrl, body, fetchFn)).resolves.toEqual({ kind: 'ok' });
    expect(res.json).not.toHaveBeenCalled();
  });
});

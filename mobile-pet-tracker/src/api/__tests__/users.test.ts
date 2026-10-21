import { getMe, updateMe } from '../users';

const baseUrl = 'http://example.test/v1/';
const endpoint = 'http://example.test/v1/me';

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

describe('R1: getMe mapea users/me por kind', () => {
  const me = {
    id: 'user-1',
    email: 'luna@example.test',
    firstName: 'Ada',
    lastName: 'Lovelace',
    phone: '+525500000000',
    country: 'MX',
    timezone: 'America/Mexico_City',
    createdAt: '2026-08-20T00:00:00.000Z',
    updatedAt: '2026-08-21T00:00:00.000Z',
  };

  it('gets the active user with the bearer token', async () => {
    const fetchFn = jest
      .fn()
      .mockResolvedValue(response(200, me)) as unknown as typeof fetch;

    await expect(getMe(baseUrl, 'jwt-token', fetchFn)).resolves.toEqual({
      kind: 'ok',
      me,
    });
    expect(fetchFn).toHaveBeenCalledWith(endpoint, {
      headers: { Authorization: 'Bearer jwt-token' },
    });
  });

  it('maps unauthorized', async () => {
    const fetchFn = jest
      .fn()
      .mockResolvedValue(response(401, {})) as unknown as typeof fetch;

    await expect(getMe(baseUrl, 'expired', fetchFn)).resolves.toEqual({
      kind: 'unauthorized',
    });
  });

  it.each([
    ['unexpected status', response(500, {})],
    ['invalid JSON', invalidJsonResponse(200)],
    ['malformed success', response(200, { ...me, email: null })],
  ])('maps %s to error', async (_case, backendResponse) => {
    const fetchFn = jest
      .fn()
      .mockResolvedValue(backendResponse) as unknown as typeof fetch;

    await expect(getMe(baseUrl, 'jwt-token', fetchFn)).resolves.toEqual({
      kind: 'error',
    });
  });

  it('maps a fetch rejection to unreachable', async () => {
    const fetchFn = jest
      .fn()
      .mockRejectedValue(new Error('offline')) as unknown as typeof fetch;

    await expect(getMe(baseUrl, 'jwt-token', fetchFn)).resolves.toEqual({
      kind: 'unreachable',
      message: 'offline',
    });
  });

  it.each([undefined, ''])('maps missing base URL %p without fetching', async (url) => {
    const fetchFn = jest.fn() as unknown as typeof fetch;

    await expect(getMe(url, 'jwt-token', fetchFn)).resolves.toEqual({
      kind: 'missing-config',
    });
    expect(fetchFn).not.toHaveBeenCalled();
  });
});


describe('#194 R3: updateMe maps profile updates by kind', () => {
  const me = {
    id: 'user-1', email: 'ada@example.test', firstName: 'Ada', lastName: 'Lovelace',
    phone: '+525500000000', country: 'MX', timezone: 'America/Mexico_City',
    createdAt: '2026-08-20T00:00:00.000Z', updatedAt: '2026-08-21T00:00:00.000Z',
  };

  it('#194 R3: sends only the changes with PATCH and both headers', async () => {
    const fetchFn = jest.fn().mockResolvedValue(response(200, me));
    await updateMe(baseUrl, 'jwt-token', { firstName: 'Grace' }, fetchFn);
    expect(fetchFn).toHaveBeenCalledWith(endpoint, {
      method: 'PATCH',
      headers: { Authorization: 'Bearer jwt-token', 'Content-Type': 'application/json' },
      body: JSON.stringify({ firstName: 'Grace' }),
    });
  });

  it('#194 R3: returns a complete successful profile', async () => {
    const fetchFn = jest.fn().mockResolvedValue(response(200, me));
    await expect(updateMe(baseUrl, 'jwt-token', {}, fetchFn)).resolves.toEqual({ kind: 'ok', me });
  });

  it('#194 R3: rejects malformed profiles and invalid JSON', async () => {
    const incomplete: Partial<typeof me> = { ...me };
    delete incomplete.timezone;
    for (const body of [response(200, incomplete), invalidJsonResponse(200)]) {
      const fetchFn = jest.fn().mockResolvedValue(body);
      await expect(updateMe(baseUrl, 'jwt-token', {}, fetchFn)).resolves.toEqual({ kind: 'error' });
    }
  });

  it('#194 R3: maps authentication and validation without returning server text', async () => {
    for (const [status, expected] of [[401, { kind: 'unauthorized' }], [400, { kind: 'validation' }]] as const) {
      const fetchFn = jest.fn().mockResolvedValue(response(status, { message: 'Validation failed' }));
      await expect(updateMe(baseUrl, 'jwt-token', {}, fetchFn)).resolves.toEqual(expected);
    }
  });

  it('#194 R3: maps other statuses to error', async () => {
    for (const status of [404, 403, 500]) {
      const fetchFn = jest.fn().mockResolvedValue(response(status, {}));
      await expect(updateMe(baseUrl, 'jwt-token', {}, fetchFn)).resolves.toEqual({ kind: 'error' });
    }
  });

  it('#194 R3: maps fetch rejections to unreachable', async () => {
    const fetchFn = jest.fn().mockRejectedValue(new Error('offline'));
    await expect(updateMe(baseUrl, 'jwt-token', {}, fetchFn)).resolves.toEqual({ kind: 'unreachable', message: 'offline' });
  });

  it('#194 R3: skips fetching without configuration', async () => {
    for (const url of [undefined, '']) {
      const fetchFn = jest.fn();
      await expect(updateMe(url, 'jwt-token', {}, fetchFn)).resolves.toEqual({ kind: 'missing-config' });
      expect(fetchFn).not.toHaveBeenCalled();
    }
  });
});

import { getMe } from '../users';

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

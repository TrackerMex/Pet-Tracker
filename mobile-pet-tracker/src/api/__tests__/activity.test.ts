import { getDailyActivity } from '../activity';

const baseUrl = 'http://example.test/v1/';
const endpoint = 'http://example.test/v1/pets/pet-1/activity/daily';

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

describe('R3: getDailyActivity mapea la respuesta por kind', () => {
  const days = [
    {
      date: '2026-08-21',
      distanceM: null,
      activeMinutes: null,
      restMinutes: null,
      walkCount: null,
      avgWalkMinutes: null,
      firstWalkAt: null,
      lastWalkAt: null,
      timeAwayMinutes: null,
      source: 'missing',
    },
  ];
  const weekComparison = {
    distanceM: null,
    activeMinutes: null,
    walkCount: null,
  };

  it('gets the seven-day response with the bearer token and no query string', async () => {
    const fetchFn = jest
      .fn()
      .mockResolvedValue(response(200, { days, weekComparison })) as unknown as typeof fetch;

    await expect(
      getDailyActivity(baseUrl, 'jwt-token', 'pet-1', fetchFn),
    ).resolves.toEqual({ kind: 'ok', days, weekComparison });
    expect(fetchFn).toHaveBeenCalledWith(endpoint, {
      headers: { Authorization: 'Bearer jwt-token' },
    });
  });

  it('maps a collar subscription response to no-tracking', async () => {
    const fetchFn = jest
      .fn()
      .mockResolvedValue(
        response(402, { code: 'DEVICE_SUBSCRIPTION_REQUIRED' }),
      ) as unknown as typeof fetch;

    await expect(
      getDailyActivity(baseUrl, 'jwt-token', 'pet-1', fetchFn),
    ).resolves.toEqual({ kind: 'no-tracking' });
  });

  it('maps an unauthorized response', async () => {
    const fetchFn = jest
      .fn()
      .mockResolvedValue(response(401, {})) as unknown as typeof fetch;

    await expect(
      getDailyActivity(baseUrl, 'expired', 'pet-1', fetchFn),
    ).resolves.toEqual({ kind: 'unauthorized' });
  });

  it.each([
    ['an unexpected status', response(500, { message: 'failure' })],
    ['invalid JSON', invalidJsonResponse(200)],
    ['a malformed days field', response(200, { days: {}, weekComparison })],
  ])('maps %s to error', async (_case, backendResponse) => {
    const fetchFn = jest
      .fn()
      .mockResolvedValue(backendResponse) as unknown as typeof fetch;

    await expect(
      getDailyActivity(baseUrl, 'jwt-token', 'pet-1', fetchFn),
    ).resolves.toEqual({ kind: 'error' });
  });

  it('maps a fetch rejection to unreachable', async () => {
    const fetchFn = jest
      .fn()
      .mockRejectedValue(new Error('network down')) as unknown as typeof fetch;

    await expect(
      getDailyActivity(baseUrl, 'jwt-token', 'pet-1', fetchFn),
    ).resolves.toEqual({ kind: 'unreachable', message: 'network down' });
  });

  it.each([undefined, ''])('maps missing base URL %p without fetching', async (missingUrl) => {
    const fetchFn = jest.fn() as unknown as typeof fetch;

    await expect(
      getDailyActivity(missingUrl, 'jwt-token', 'pet-1', fetchFn),
    ).resolves.toEqual({ kind: 'missing-config' });
    expect(fetchFn).not.toHaveBeenCalled();
  });
});

import { getLastPosition, listPositions } from '../positions';

const baseUrl = 'http://example.test/v1/';
const lastEndpoint = 'http://example.test/v1/pets/pet-1/positions/last';
const positionsEndpoint = 'http://example.test/v1/pets/pet-1/positions';

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

describe('R1: getLastPosition mapea la respuesta por kind', () => {
  const position = {
    lat: 19.4326,
    lng: -99.1332,
    ts: 1787353200000,
    accuracy: 4.5,
    battery: 82,
    staleSeconds: 15,
  };

  it('gets the last position with the bearer token', async () => {
    const fetchFn = jest
      .fn()
      .mockResolvedValue(response(200, position)) as unknown as typeof fetch;

    await expect(
      getLastPosition(baseUrl, 'jwt-token', 'pet-1', fetchFn),
    ).resolves.toEqual({ kind: 'ok', position });
    expect(fetchFn).toHaveBeenCalledWith(lastEndpoint, {
      headers: { Authorization: 'Bearer jwt-token' },
    });
  });

  it('maps a null success body to a valid empty position', async () => {
    const fetchFn = jest
      .fn()
      .mockResolvedValue(response(200, null)) as unknown as typeof fetch;

    await expect(
      getLastPosition(baseUrl, 'jwt-token', 'pet-1', fetchFn),
    ).resolves.toEqual({ kind: 'ok', position: null });
  });

  it('maps a collar subscription response to no-tracking', async () => {
    const fetchFn = jest
      .fn()
      .mockResolvedValue(
        response(402, { code: 'DEVICE_SUBSCRIPTION_REQUIRED' }),
      ) as unknown as typeof fetch;

    await expect(
      getLastPosition(baseUrl, 'jwt-token', 'pet-1', fetchFn),
    ).resolves.toEqual({ kind: 'no-tracking' });
  });

  it('maps an unauthorized response', async () => {
    const fetchFn = jest
      .fn()
      .mockResolvedValue(response(401, {})) as unknown as typeof fetch;

    await expect(
      getLastPosition(baseUrl, 'expired', 'pet-1', fetchFn),
    ).resolves.toEqual({ kind: 'unauthorized' });
  });

  it.each([
    ['an unexpected status', response(500, { message: 'failure' })],
    ['invalid JSON', invalidJsonResponse(200)],
    ['a malformed latitude', response(200, { ...position, lat: '19.4' })],
    ['a malformed longitude', response(200, { ...position, lng: null })],
  ])('maps %s to error', async (_case, backendResponse) => {
    const fetchFn = jest
      .fn()
      .mockResolvedValue(backendResponse) as unknown as typeof fetch;

    await expect(
      getLastPosition(baseUrl, 'jwt-token', 'pet-1', fetchFn),
    ).resolves.toEqual({ kind: 'error' });
  });

  it('maps a fetch rejection to unreachable', async () => {
    const fetchFn = jest
      .fn()
      .mockRejectedValue(new Error('network down')) as unknown as typeof fetch;

    await expect(
      getLastPosition(baseUrl, 'jwt-token', 'pet-1', fetchFn),
    ).resolves.toEqual({ kind: 'unreachable', message: 'network down' });
  });

  it.each([undefined, ''])(
    'maps missing base URL %p without fetching',
    async (missingUrl) => {
      const fetchFn = jest.fn() as unknown as typeof fetch;

      await expect(
        getLastPosition(missingUrl, 'jwt-token', 'pet-1', fetchFn),
      ).resolves.toEqual({ kind: 'missing-config' });
      expect(fetchFn).not.toHaveBeenCalled();
    },
  );
});

describe('R2: listPositions mapea la respuesta por kind', () => {
  const items = [
    {
      ts: 1787353200000,
      lat: 19.4326,
      lng: -99.1332,
      speedKmh: 4.2,
      course: 90,
      altitude: 2240,
      sats: 9,
      accuracyM: 4.5,
      batteryPct: 82,
      flags: [],
    },
  ];

  it('gets the default position window with no query string', async () => {
    const fetchFn = jest
      .fn()
      .mockResolvedValue(
        response(200, { items, nextCursor: null }),
      ) as unknown as typeof fetch;

    await expect(
      listPositions(baseUrl, 'jwt-token', 'pet-1', fetchFn),
    ).resolves.toEqual({ kind: 'ok', items, nextCursor: null });
    expect(fetchFn).toHaveBeenCalledWith(positionsEndpoint, {
      headers: { Authorization: 'Bearer jwt-token' },
    });
    expect((fetchFn as jest.Mock).mock.calls[0][0]).not.toContain('?');
  });

  it('preserves a backend cursor in the typed state', async () => {
    const fetchFn = jest
      .fn()
      .mockResolvedValue(
        response(200, { items, nextCursor: 'next-page' }),
      ) as unknown as typeof fetch;

    await expect(
      listPositions(baseUrl, 'jwt-token', 'pet-1', fetchFn),
    ).resolves.toEqual({ kind: 'ok', items, nextCursor: 'next-page' });
  });

  it('maps a collar subscription response to no-tracking', async () => {
    const fetchFn = jest
      .fn()
      .mockResolvedValue(
        response(402, { code: 'DEVICE_SUBSCRIPTION_REQUIRED' }),
      ) as unknown as typeof fetch;

    await expect(
      listPositions(baseUrl, 'jwt-token', 'pet-1', fetchFn),
    ).resolves.toEqual({ kind: 'no-tracking' });
  });

  it('maps an unauthorized response', async () => {
    const fetchFn = jest
      .fn()
      .mockResolvedValue(response(401, {})) as unknown as typeof fetch;

    await expect(
      listPositions(baseUrl, 'expired', 'pet-1', fetchFn),
    ).resolves.toEqual({ kind: 'unauthorized' });
  });

  it.each([
    ['a bad request', response(400, { message: 'bad query' })],
    ['an unexpected status', response(500, { message: 'failure' })],
    ['invalid JSON', invalidJsonResponse(200)],
    ['a malformed items field', response(200, { items: {}, nextCursor: null })],
  ])('maps %s to error', async (_case, backendResponse) => {
    const fetchFn = jest
      .fn()
      .mockResolvedValue(backendResponse) as unknown as typeof fetch;

    await expect(
      listPositions(baseUrl, 'jwt-token', 'pet-1', fetchFn),
    ).resolves.toEqual({ kind: 'error' });
  });

  it('maps a fetch rejection to unreachable', async () => {
    const fetchFn = jest.fn().mockRejectedValue('offline') as unknown as typeof fetch;

    await expect(
      listPositions(baseUrl, 'jwt-token', 'pet-1', fetchFn),
    ).resolves.toEqual({ kind: 'unreachable', message: 'offline' });
  });

  it.each([undefined, ''])(
    'maps missing base URL %p without fetching',
    async (missingUrl) => {
      const fetchFn = jest.fn() as unknown as typeof fetch;

      await expect(
        listPositions(missingUrl, 'jwt-token', 'pet-1', fetchFn),
      ).resolves.toEqual({ kind: 'missing-config' });
      expect(fetchFn).not.toHaveBeenCalled();
    },
  );
});

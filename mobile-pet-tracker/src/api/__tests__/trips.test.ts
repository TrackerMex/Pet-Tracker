import { getDayRoute } from '../trips';

const baseUrl = 'http://example.test/v1/';
const listEndpoint = 'http://example.test/v1/pets/pet-1/trips';
const trip0Endpoint = 'http://example.test/v1/pets/pet-1/trips/0';
const trip1Endpoint = 'http://example.test/v1/pets/pet-1/trips/1';

const summaries = [
  {
    index: 1,
    startTs: 1787356800000,
    endTs: 1787358600000,
    distanceM: 1200,
    durationMin: 30,
    pointCount: 2,
  },
  {
    index: 0,
    startTs: 1787353200000,
    endTs: 1787355000000,
    distanceM: 800,
    durationMin: 30,
    pointCount: 2,
  },
];

const trips = summaries.map((summary) => ({
  ...summary,
  path: [
    { lat: 19.4326 + summary.index * 0.01, lng: -99.1332, ts: summary.startTs },
    { lat: 19.433, lng: -99.1328, ts: summary.endTs },
  ],
}));

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

function routeFetch(overrides: Partial<Record<string, Response>> = {}) {
  const responses: Record<string, Response> = {
    [listEndpoint]: response(200, { date: '2026-08-21', items: summaries }),
    [trip0Endpoint]: response(200, { date: '2026-08-21', trip: trips[1] }),
    [trip1Endpoint]: response(200, { date: '2026-08-21', trip: trips[0] }),
    ...overrides,
  };

  return jest.fn((url: string) => Promise.resolve(responses[url])) as unknown as typeof fetch;
}

describe('R3: getDayRoute compone lista y detalles por kind', () => {
  it('gets the unfiltered list and composes ordered trip details', async () => {
    const fetchFn = routeFetch();

    await expect(
      getDayRoute(baseUrl, 'jwt-token', 'pet-1', fetchFn),
    ).resolves.toEqual({
      kind: 'ok',
      date: '2026-08-21',
      trips: [trips[1], trips[0]],
    });

    expect(fetchFn).toHaveBeenCalledWith(listEndpoint, {
      headers: { Authorization: 'Bearer jwt-token' },
    });
    expect((fetchFn as jest.Mock).mock.calls[0][0]).not.toContain('?');
    expect(fetchFn).toHaveBeenCalledWith(trip0Endpoint, {
      headers: { Authorization: 'Bearer jwt-token' },
    });
    expect(fetchFn).toHaveBeenCalledWith(trip1Endpoint, {
      headers: { Authorization: 'Bearer jwt-token' },
    });
  });

  it('starts every detail request before waiting for one to finish', async () => {
    const detailResolvers: Array<(value: Response) => void> = [];
    const fetchFn = jest.fn((url: string) => {
      if (url === listEndpoint) {
        return Promise.resolve(
          response(200, { date: '2026-08-21', items: summaries }),
        );
      }

      return new Promise<Response>((resolve) => detailResolvers.push(resolve));
    }) as unknown as typeof fetch;

    const routePromise = getDayRoute(baseUrl, 'jwt-token', 'pet-1', fetchFn);
    await Promise.resolve();
    await Promise.resolve();

    expect(fetchFn).toHaveBeenCalledTimes(3);
    detailResolvers[0](response(200, { trip: trips[0] }));
    detailResolvers[1](response(200, { trip: trips[1] }));
    await expect(routePromise).resolves.toEqual(
      expect.objectContaining({ kind: 'ok' }),
    );
  });

  it('returns an empty day without requesting details', async () => {
    const fetchFn = routeFetch({
      [listEndpoint]: response(200, { date: '2026-08-21', items: [] }),
    });

    await expect(
      getDayRoute(baseUrl, 'jwt-token', 'pet-1', fetchFn),
    ).resolves.toEqual({ kind: 'ok', date: '2026-08-21', trips: [] });
    expect(fetchFn).toHaveBeenCalledTimes(1);
  });

  it('maps a collar subscription response on the list to no-tracking', async () => {
    const fetchFn = routeFetch({
      [listEndpoint]: response(402, { code: 'DEVICE_SUBSCRIPTION_REQUIRED' }),
    });

    await expect(
      getDayRoute(baseUrl, 'jwt-token', 'pet-1', fetchFn),
    ).resolves.toEqual({ kind: 'no-tracking' });
  });

  it.each([
    ['the list', { [listEndpoint]: response(401, {}) }],
    ['a detail', { [trip0Endpoint]: response(401, {}) }],
  ])('maps unauthorized from %s', async (_case, overrides) => {
    const fetchFn = routeFetch(overrides);

    await expect(
      getDayRoute(baseUrl, 'expired', 'pet-1', fetchFn),
    ).resolves.toEqual({ kind: 'unauthorized' });
  });

  it.each([
    ['an unexpected list status', { [listEndpoint]: response(500, {}) }],
    ['invalid list JSON', { [listEndpoint]: invalidJsonResponse(200) }],
    ['a malformed list date', { [listEndpoint]: response(200, { date: null, items: [] }) }],
    ['malformed list items', { [listEndpoint]: response(200, { date: '2026-08-21', items: {} }) }],
    ['an unexpected detail status', { [trip0Endpoint]: response(404, {}) }],
    ['invalid detail JSON', { [trip0Endpoint]: invalidJsonResponse(200) }],
    ['a malformed detail path', { [trip0Endpoint]: response(200, { trip: { ...trips[1], path: null } }) }],
  ])('maps %s to error', async (_case, overrides) => {
    const fetchFn = routeFetch(overrides);

    await expect(
      getDayRoute(baseUrl, 'jwt-token', 'pet-1', fetchFn),
    ).resolves.toEqual({ kind: 'error' });
  });

  it.each([listEndpoint, trip0Endpoint])(
    'maps a fetch rejection at %s to unreachable',
    async (failingEndpoint) => {
      const normalFetch = routeFetch();
      const fetchFn = jest.fn((url: string, init?: RequestInit) =>
        url === failingEndpoint
          ? Promise.reject(new Error('network down'))
          : normalFetch(url, init),
      ) as unknown as typeof fetch;

      await expect(
        getDayRoute(baseUrl, 'jwt-token', 'pet-1', fetchFn),
      ).resolves.toEqual({ kind: 'unreachable', message: 'network down' });
    },
  );

  it.each([undefined, ''])(
    'maps missing base URL %p without fetching',
    async (missingUrl) => {
      const fetchFn = jest.fn() as unknown as typeof fetch;

      await expect(
        getDayRoute(missingUrl, 'jwt-token', 'pet-1', fetchFn),
      ).resolves.toEqual({ kind: 'missing-config' });
      expect(fetchFn).not.toHaveBeenCalled();
    },
  );
});

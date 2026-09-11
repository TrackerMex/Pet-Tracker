import { listAlerts } from '../alerts';

const baseUrl = 'http://example.test/v1/';

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

function makeAlert(id: string) {
  return {
    id,
    petId: 'pet-1',
    petName: 'Luna',
    type: 'geofence_exit',
    status: 'open',
    geofenceId: 'geofence-1',
    payload: {},
    openedAt: '2026-09-11T12:00:00.000Z',
    ackedAt: null,
    closedAt: null,
  };
}

describe('#78 R1: listAlerts mapea la respuesta por kind', () => {
  it('gets alerts with both query parameters in backend order', async () => {
    const items = [makeAlert('alert-2'), makeAlert('alert-1')];
    const fetchFn = jest
      .fn()
      .mockResolvedValue(response(200, { items, nextCursor: 'next' })) as unknown as typeof fetch;

    await expect(
      listAlerts(baseUrl, 'jwt-token', 'open', 'abc', fetchFn),
    ).resolves.toEqual({ kind: 'ok', items, nextCursor: 'next' });
    expect(fetchFn).toHaveBeenCalledWith(
      'http://example.test/v1/alerts?status=open&cursor=abc',
      { headers: { Authorization: 'Bearer jwt-token' } },
    );
  });

  it.each([
    [undefined, 'http://example.test/v1/alerts'],
    ['open', 'http://example.test/v1/alerts?status=open'],
  ] as const)('uses the exact URL for status %p', async (status, endpoint) => {
    const fetchFn = jest
      .fn()
      .mockResolvedValue(response(200, { items: [], nextCursor: null })) as unknown as typeof fetch;

    await listAlerts(baseUrl, 'jwt-token', status, undefined, fetchFn);

    expect(fetchFn).toHaveBeenCalledWith(endpoint, {
      headers: { Authorization: 'Bearer jwt-token' },
    });
  });

  it('uses the exact URL for a cursor without a status', async () => {
    const fetchFn = jest
      .fn()
      .mockResolvedValue(response(200, { items: [], nextCursor: null })) as unknown as typeof fetch;

    await listAlerts(baseUrl, 'jwt-token', undefined, 'abc', fetchFn);

    expect(fetchFn).toHaveBeenCalledWith(
      'http://example.test/v1/alerts?cursor=abc',
      { headers: { Authorization: 'Bearer jwt-token' } },
    );
  });

  it.each([undefined, null, 1, {}])(
    'normalizes nextCursor %p to null',
    async (nextCursor) => {
      const fetchFn = jest
        .fn()
        .mockResolvedValue(response(200, { items: [], nextCursor })) as unknown as typeof fetch;

      await expect(
        listAlerts(baseUrl, 'jwt-token', undefined, undefined, fetchFn),
      ).resolves.toEqual({ kind: 'ok', items: [], nextCursor: null });
    },
  );

  it('maps an unauthorized response', async () => {
    const fetchFn = jest
      .fn()
      .mockResolvedValue(response(401, {})) as unknown as typeof fetch;

    await expect(
      listAlerts(baseUrl, 'expired', undefined, undefined, fetchFn),
    ).resolves.toEqual({ kind: 'unauthorized' });
  });

  it.each([
    ['invalid JSON', invalidJsonResponse(200)],
    ['a malformed success body', response(200, { items: {} })],
    ['an unexpected status', response(500, {})],
    ['HTTP 402', response(402, {})],
  ])('maps %s to error', async (_case, backendResponse) => {
    const fetchFn = jest
      .fn()
      .mockResolvedValue(backendResponse) as unknown as typeof fetch;

    await expect(
      listAlerts(baseUrl, 'jwt-token', undefined, undefined, fetchFn),
    ).resolves.toEqual({ kind: 'error' });
  });

  it('maps a fetch rejection to unreachable', async () => {
    const fetchFn = jest
      .fn()
      .mockRejectedValue(new Error('network down')) as unknown as typeof fetch;

    await expect(
      listAlerts(baseUrl, 'jwt-token', undefined, undefined, fetchFn),
    ).resolves.toEqual({ kind: 'unreachable', message: 'network down' });
  });

  it.each([undefined, ''])(
    'maps missing base URL %p without fetching',
    async (missingUrl) => {
      const fetchFn = jest.fn() as unknown as typeof fetch;

      await expect(
        listAlerts(missingUrl, 'jwt-token', undefined, undefined, fetchFn),
      ).resolves.toEqual({ kind: 'missing-config' });
      expect(fetchFn).not.toHaveBeenCalled();
    },
  );
});

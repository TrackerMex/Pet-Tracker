import { getPetTracking } from '../subscriptions';

const baseUrl = 'http://example.test/v1/';
const trackingEndpoint =
  'http://example.test/v1/pets/pet-1/positions/last';

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

describe('R3: getPetTracking deriva tracked/free del gate 402 de positions/last', () => {
  const position = {
    lat: 19.4326,
    lng: -99.1332,
    ts: 1788436800000,
    accuracy: 4.5,
    battery: 82,
    staleSeconds: 15,
  };

  it.each([
    ['a null 200 body', null],
    ['a valid position 200 body', position],
  ])('maps %s to tracked', async (_case, body) => {
    const fetchFn = jest
      .fn()
      .mockResolvedValue(response(200, body)) as unknown as typeof fetch;

    await expect(
      getPetTracking(baseUrl, 'jwt-token', 'pet-1', fetchFn),
    ).resolves.toEqual({ kind: 'ok', tracked: true });
    expect(fetchFn).toHaveBeenCalledTimes(1);
    expect(fetchFn).toHaveBeenCalledWith(trackingEndpoint, {
      headers: { Authorization: 'Bearer jwt-token' },
    });
  });

  it('maps the subscription gate 402 to free', async () => {
    const fetchFn = jest
      .fn()
      .mockResolvedValue(
        response(402, { code: 'DEVICE_SUBSCRIPTION_REQUIRED' }),
      ) as unknown as typeof fetch;

    await expect(
      getPetTracking(baseUrl, 'jwt-token', 'pet-1', fetchFn),
    ).resolves.toEqual({ kind: 'ok', tracked: false });
  });

  it('maps 401 to unauthorized', async () => {
    const fetchFn = jest
      .fn()
      .mockResolvedValue(response(401, {})) as unknown as typeof fetch;

    await expect(
      getPetTracking(baseUrl, 'expired', 'pet-1', fetchFn),
    ).resolves.toEqual({ kind: 'unauthorized' });
  });

  it.each([
    ['an unexpected status', response(500, { message: 'failure' })],
    ['a malformed 200 body', response(200, { lat: '19.4', lng: -99.1 })],
    ['invalid 200 JSON', invalidJsonResponse(200)],
  ])('maps %s to error', async (_case, backendResponse) => {
    const fetchFn = jest
      .fn()
      .mockResolvedValue(backendResponse) as unknown as typeof fetch;

    await expect(
      getPetTracking(baseUrl, 'jwt-token', 'pet-1', fetchFn),
    ).resolves.toEqual({ kind: 'error' });
  });

  it('maps a fetch rejection to unreachable', async () => {
    const fetchFn = jest
      .fn()
      .mockRejectedValue(new Error('network down')) as unknown as typeof fetch;

    await expect(
      getPetTracking(baseUrl, 'jwt-token', 'pet-1', fetchFn),
    ).resolves.toEqual({ kind: 'unreachable', message: 'network down' });
  });

  it.each([undefined, ''])(
    'maps missing base URL %p without fetching',
    async (missingUrl) => {
      const fetchFn = jest.fn() as unknown as typeof fetch;

      await expect(
        getPetTracking(missingUrl, 'jwt-token', 'pet-1', fetchFn),
      ).resolves.toEqual({ kind: 'missing-config' });
      expect(fetchFn).not.toHaveBeenCalled();
    },
  );
});

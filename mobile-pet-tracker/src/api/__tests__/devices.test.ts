import { claimDevice } from '../devices';

const baseUrl = 'http://example.test/v1/';
const claimEndpoint = 'http://example.test/v1/devices/claim';

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

describe('R1: claimDevice publica el claim y mapea la respuesta por kind', () => {
  const input = { petId: 'pet-1', activationCode: 'ACT-001' };
  const device = {
    model: 'sim-collar',
    batteryPct: 82,
    connectivity: 'online',
    lastMessageAt: '2026-09-03T12:00:00.000Z',
    esn: 'SIM-001',
  };

  it('posts only petId and activationCode and accepts a valid 201 device', async () => {
    const fetchFn = jest
      .fn()
      .mockResolvedValue(response(201, device)) as unknown as typeof fetch;

    await expect(
      claimDevice(baseUrl, 'jwt-token', input, fetchFn),
    ).resolves.toEqual({ kind: 'ok', device });
    expect(fetchFn).toHaveBeenCalledTimes(1);
    expect(fetchFn).toHaveBeenCalledWith(claimEndpoint, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer jwt-token',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        petId: 'pet-1',
        activationCode: 'ACT-001',
      }),
    });
  });

  it.each([
    [
      'a success body without model',
      response(201, {
        batteryPct: device.batteryPct,
        connectivity: device.connectivity,
        lastMessageAt: device.lastMessageAt,
        esn: device.esn,
      }),
    ],
    [
      'a success body without esn',
      response(201, {
        model: device.model,
        batteryPct: device.batteryPct,
        connectivity: device.connectivity,
        lastMessageAt: device.lastMessageAt,
      }),
    ],
    ['invalid success JSON', invalidJsonResponse(201)],
  ])('maps %s to error', async (_case, backendResponse) => {
    const fetchFn = jest
      .fn()
      .mockResolvedValue(backendResponse) as unknown as typeof fetch;

    await expect(
      claimDevice(baseUrl, 'jwt-token', input, fetchFn),
    ).resolves.toEqual({ kind: 'error' });
  });

  it.each([
    [400, {}, { kind: 'invalid' }],
    [401, {}, { kind: 'unauthorized' }],
    [402, { code: 'DEVICE_SUBSCRIPTION_REQUIRED' }, { kind: 'subscription-required' }],
    [403, {}, { kind: 'forbidden' }],
    [404, { code: 'DEVICE_NOT_FOUND' }, { kind: 'not-found' }],
    [404, {}, { kind: 'error' }],
    [409, { code: 'DEVICE_ALREADY_ASSIGNED' }, { kind: 'already-claimed' }],
    [409, { code: 'PET_ALREADY_HAS_DEVICE' }, { kind: 'pet-has-device' }],
    [409, { code: 'UNKNOWN_CONFLICT' }, { kind: 'error' }],
    [409, {}, { kind: 'error' }],
    [500, {}, { kind: 'error' }],
  ])('maps status %s with body %p', async (status, body, expected) => {
    const fetchFn = jest
      .fn()
      .mockResolvedValue(response(status, body)) as unknown as typeof fetch;

    await expect(
      claimDevice(baseUrl, 'jwt-token', input, fetchFn),
    ).resolves.toEqual(expected);
  });

  it('maps a fetch rejection to unreachable', async () => {
    const fetchFn = jest
      .fn()
      .mockRejectedValue(new Error('network down')) as unknown as typeof fetch;

    await expect(
      claimDevice(baseUrl, 'jwt-token', input, fetchFn),
    ).resolves.toEqual({ kind: 'unreachable', message: 'network down' });
  });

  it.each([undefined, ''])(
    'maps missing base URL %p without fetching',
    async (missingUrl) => {
      const fetchFn = jest.fn() as unknown as typeof fetch;

      await expect(
        claimDevice(missingUrl, 'jwt-token', input, fetchFn),
      ).resolves.toEqual({ kind: 'missing-config' });
      expect(fetchFn).not.toHaveBeenCalled();
    },
  );
});

import { registerPushToken } from '../push-tokens';

const baseUrl = 'http://example.test/v1/';
const endpoint = 'http://example.test/v1/me/push-tokens';

function response(status: number, body: unknown = {}): Response {
  return {
    status,
    json: jest.fn().mockResolvedValue(body),
  } as unknown as Response;
}

describe('R3: registerPushToken mapea POST me/push-tokens por kind', () => {
  const pushToken = {
    expoToken: 'ExpoPushToken[xxx]',
    platform: 'android' as const,
  };

  it('envía el token con bearer y mapea 200 a ok', async () => {
    const fetchFn = jest
      .fn()
      .mockResolvedValue(response(200)) as unknown as typeof fetch;

    await expect(
      registerPushToken(baseUrl, 'jwt-token', pushToken, fetchFn),
    ).resolves.toEqual({ kind: 'ok' });
    expect(fetchFn).toHaveBeenCalledWith(endpoint, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer jwt-token',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(pushToken),
    });
  });

  it.each([
    [401, { kind: 'unauthorized' }],
    [500, { kind: 'error' }],
  ])('mapea el status %i', async (status, expected) => {
    const fetchFn = jest
      .fn()
      .mockResolvedValue(response(status)) as unknown as typeof fetch;

    await expect(
      registerPushToken(baseUrl, 'jwt-token', pushToken, fetchFn),
    ).resolves.toEqual(expected);
  });

  it('mapea baseUrl ausente sin llamar a fetch', async () => {
    const fetchFn = jest.fn() as unknown as typeof fetch;

    await expect(
      registerPushToken(undefined, 'jwt-token', pushToken, fetchFn),
    ).resolves.toEqual({ kind: 'missing-config' });
    expect(fetchFn).not.toHaveBeenCalled();
  });

  it('mapea un rechazo de fetch a unreachable', async () => {
    const fetchFn = jest
      .fn()
      .mockRejectedValue(new Error('offline')) as unknown as typeof fetch;

    await expect(
      registerPushToken(baseUrl, 'jwt-token', pushToken, fetchFn),
    ).resolves.toEqual({ kind: 'unreachable', message: 'offline' });
  });
});

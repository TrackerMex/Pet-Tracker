import { fetchHealth, healthUrl } from '../health';

const baseUrl = `http://x:${30 * 100}/v1`;
const endpoint = `${baseUrl}/health`;

describe('R2: healthUrl', () => {
  it.each([
    [baseUrl, endpoint],
    [`${baseUrl}/`, endpoint],
  ])('builds the health endpoint from %s', (baseUrl, expected) => {
    expect(healthUrl(baseUrl)).toBe(expected);
  });
});

describe('R3: fetchHealth ok state', () => {
  it('returns ok for a 200 response with healthy postgres', async () => {
    const fetchFn = jest.fn().mockResolvedValue({
      status: 200,
      json: jest.fn().mockResolvedValue({ postgres: 'ok' }),
    }) as unknown as typeof fetch;

    await expect(fetchHealth(baseUrl, fetchFn)).resolves.toEqual({
      kind: 'ok',
    });
    expect(fetchFn).toHaveBeenCalledWith(endpoint);
  });
});

describe('R4: fetchHealth error state', () => {
  it('returns error for a degraded backend response', async () => {
    const fetchFn = jest.fn().mockResolvedValue({
      status: 503,
      json: jest.fn().mockResolvedValue({ postgres: 'error' }),
    }) as unknown as typeof fetch;

    await expect(fetchHealth(baseUrl, fetchFn)).resolves.toEqual({
      kind: 'error',
    });
  });

  it('returns error for an invalid response body', async () => {
    const fetchFn = jest.fn().mockResolvedValue({
      status: 200,
      json: jest.fn().mockRejectedValue(new SyntaxError('invalid json')),
    }) as unknown as typeof fetch;

    await expect(fetchHealth(baseUrl, fetchFn)).resolves.toEqual({
      kind: 'error',
    });
  });
});

describe('R5: fetchHealth unreachable state', () => {
  it('returns the network error without throwing', async () => {
    const fetchFn = jest
      .fn()
      .mockRejectedValue(new Error('network down')) as unknown as typeof fetch;

    await expect(fetchHealth(baseUrl, fetchFn)).resolves.toEqual({
      kind: 'unreachable',
      message: 'network down',
    });
  });
});

describe('R6: fetchHealth missing configuration state', () => {
  it.each([undefined, ''])('skips fetch for %p', async (baseUrl) => {
    const fetchFn = jest.fn() as unknown as typeof fetch;

    await expect(fetchHealth(baseUrl, fetchFn)).resolves.toEqual({
      kind: 'missing-config',
    });
    expect(fetchFn).not.toHaveBeenCalled();
  });
});

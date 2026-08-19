import { fetchHealth, healthUrl } from '../health';

describe('R2: healthUrl', () => {
  it.each([
    ['http://x:3000/v1', 'http://x:3000/v1/health'],
    ['http://x:3000/v1/', 'http://x:3000/v1/health'],
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

    await expect(fetchHealth('http://x:3000/v1', fetchFn)).resolves.toEqual({
      kind: 'ok',
    });
    expect(fetchFn).toHaveBeenCalledWith('http://x:3000/v1/health');
  });
});

describe('R4: fetchHealth error state', () => {
  it('returns error for a degraded backend response', async () => {
    const fetchFn = jest.fn().mockResolvedValue({
      status: 503,
      json: jest.fn().mockResolvedValue({ postgres: 'error' }),
    }) as unknown as typeof fetch;

    await expect(fetchHealth('http://x:3000/v1', fetchFn)).resolves.toEqual({
      kind: 'error',
    });
  });

  it('returns error for an invalid response body', async () => {
    const fetchFn = jest.fn().mockResolvedValue({
      status: 200,
      json: jest.fn().mockRejectedValue(new SyntaxError('invalid json')),
    }) as unknown as typeof fetch;

    await expect(fetchHealth('http://x:3000/v1', fetchFn)).resolves.toEqual({
      kind: 'error',
    });
  });
});

describe('R5: fetchHealth unreachable state', () => {
  it('returns the network error without throwing', async () => {
    const fetchFn = jest
      .fn()
      .mockRejectedValue(new Error('network down')) as unknown as typeof fetch;

    await expect(fetchHealth('http://x:3000/v1', fetchFn)).resolves.toEqual({
      kind: 'unreachable',
      message: 'network down',
    });
  });
});

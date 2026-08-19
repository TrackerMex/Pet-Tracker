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

import { healthUrl } from '../health';

describe('R2: healthUrl', () => {
  it.each([
    ['http://x:3000/v1', 'http://x:3000/v1/health'],
    ['http://x:3000/v1/', 'http://x:3000/v1/health'],
  ])('builds the health endpoint from %s', (baseUrl, expected) => {
    expect(healthUrl(baseUrl)).toBe(expected);
  });
});

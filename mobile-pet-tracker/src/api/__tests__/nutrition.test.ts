import { getNutritionProfile } from '../nutrition';

const baseUrl = 'http://example.test/v1/';
const profileEndpoint =
  'http://example.test/v1/pets/pet-1/nutrition-profile';

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

function makeProfile(overrides: Record<string, unknown> = {}) {
  return {
    petId: 'pet-1',
    activityLevel: 'medium',
    bodyCondition: 5,
    targetWeightKg: 12,
    foodType: 'dry',
    kcalPer100g: 350,
    allergies: ['chicken'],
    diseases: [],
    updatedAt: '2026-08-23T12:00:00.000Z',
    ...overrides,
  };
}

describe('R1: getNutritionProfile mapea la respuesta por kind', () => {
  it('gets the profile with a normalized URL and bearer token', async () => {
    const profile = makeProfile();
    const fetchFn = jest
      .fn()
      .mockResolvedValue(response(200, profile)) as unknown as typeof fetch;

    await expect(
      getNutritionProfile(baseUrl, 'jwt-token', 'pet-1', fetchFn),
    ).resolves.toEqual({ kind: 'ok', profile });
    expect(fetchFn).toHaveBeenCalledWith(profileEndpoint, {
      headers: { Authorization: 'Bearer jwt-token' },
    });
  });

  it.each([
    [404, { kind: 'not-found' }],
    [401, { kind: 'unauthorized' }],
    [403, { kind: 'error' }],
    [500, { kind: 'error' }],
  ])('maps status %i', async (status, expected) => {
    const fetchFn = jest
      .fn()
      .mockResolvedValue(response(status, {})) as unknown as typeof fetch;

    await expect(
      getNutritionProfile(baseUrl, 'jwt-token', 'pet-1', fetchFn),
    ).resolves.toEqual(expected);
  });

  it.each([
    ['invalid JSON', invalidJsonResponse(200)],
    ['a null body', response(200, null)],
    ['an array body', response(200, [makeProfile()])],
  ])('maps %s on success to error', async (_case, backendResponse) => {
    const fetchFn = jest
      .fn()
      .mockResolvedValue(backendResponse) as unknown as typeof fetch;

    await expect(
      getNutritionProfile(baseUrl, 'jwt-token', 'pet-1', fetchFn),
    ).resolves.toEqual({ kind: 'error' });
  });

  it('maps a fetch rejection to unreachable', async () => {
    const fetchFn = jest
      .fn()
      .mockRejectedValue(new Error('network down')) as unknown as typeof fetch;

    await expect(
      getNutritionProfile(baseUrl, 'jwt-token', 'pet-1', fetchFn),
    ).resolves.toEqual({ kind: 'unreachable', message: 'network down' });
  });

  it.each([undefined, ''])(
    'maps missing base URL %p without fetching',
    async (missingUrl) => {
      const fetchFn = jest.fn() as unknown as typeof fetch;

      await expect(
        getNutritionProfile(missingUrl, 'jwt-token', 'pet-1', fetchFn),
      ).resolves.toEqual({ kind: 'missing-config' });
      expect(fetchFn).not.toHaveBeenCalled();
    },
  );
});

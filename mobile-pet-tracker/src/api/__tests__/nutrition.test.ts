import {
  generateNutritionPlan,
  getNutritionPlan,
  getNutritionProfile,
} from '../nutrition';

const baseUrl = 'http://example.test/v1/';
const profileEndpoint =
  'http://example.test/v1/pets/pet-1/nutrition-profile';
const planEndpoint = 'http://example.test/v1/pets/pet-1/nutrition-plan';
const generateEndpoint =
  'http://example.test/v1/pets/pet-1/nutrition-plan/generate';

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

function makePlan(overrides: Record<string, unknown> = {}) {
  return {
    id: 'plan-1',
    petId: 'pet-1',
    rerKcal: 410,
    merKcal: 656,
    dailyGrams: 187,
    mealsPerDay: 2,
    mealTimes: ['07:30', '19:30'],
    objective: 'maintenance',
    warnings: [],
    aiExplanation: null,
    generatedAt: '2026-08-23T12:00:00.000Z',
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

describe('R2: getNutritionPlan mapea la respuesta por kind', () => {
  it.each([
    ['a nullable AI explanation', makePlan()],
    [
      'an AI explanation string',
      makePlan({ aiExplanation: 'Split the daily amount into two meals.' }),
    ],
  ])('gets a plan with %s', async (_case, plan) => {
    const fetchFn = jest
      .fn()
      .mockResolvedValue(response(200, plan)) as unknown as typeof fetch;

    await expect(
      getNutritionPlan(baseUrl, 'jwt-token', 'pet-1', fetchFn),
    ).resolves.toEqual({ kind: 'ok', plan });
    expect(fetchFn).toHaveBeenCalledWith(planEndpoint, {
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
      getNutritionPlan(baseUrl, 'jwt-token', 'pet-1', fetchFn),
    ).resolves.toEqual(expected);
  });

  it.each([
    ['invalid JSON', invalidJsonResponse(200)],
    ['a null body', response(200, null)],
    ['an array body', response(200, [makePlan()])],
  ])('maps %s on success to error', async (_case, backendResponse) => {
    const fetchFn = jest
      .fn()
      .mockResolvedValue(backendResponse) as unknown as typeof fetch;

    await expect(
      getNutritionPlan(baseUrl, 'jwt-token', 'pet-1', fetchFn),
    ).resolves.toEqual({ kind: 'error' });
  });

  it('maps a fetch rejection to unreachable', async () => {
    const fetchFn = jest
      .fn()
      .mockRejectedValue('offline') as unknown as typeof fetch;

    await expect(
      getNutritionPlan(baseUrl, 'jwt-token', 'pet-1', fetchFn),
    ).resolves.toEqual({ kind: 'unreachable', message: 'offline' });
  });

  it.each([undefined, ''])(
    'maps missing base URL %p without fetching',
    async (missingUrl) => {
      const fetchFn = jest.fn() as unknown as typeof fetch;

      await expect(
        getNutritionPlan(missingUrl, 'jwt-token', 'pet-1', fetchFn),
      ).resolves.toEqual({ kind: 'missing-config' });
      expect(fetchFn).not.toHaveBeenCalled();
    },
  );
});

describe('R3: generateNutritionPlan publica y mapea por kind', () => {
  it('posts an empty body with authentication and JSON headers', async () => {
    const plan = makePlan();
    const fetchFn = jest
      .fn()
      .mockResolvedValue(response(200, plan)) as unknown as typeof fetch;

    await expect(
      generateNutritionPlan(baseUrl, 'jwt-token', 'pet-1', fetchFn),
    ).resolves.toEqual({ kind: 'ok', plan });
    expect(fetchFn).toHaveBeenCalledWith(generateEndpoint, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer jwt-token',
        'Content-Type': 'application/json',
      },
      body: '{}',
    });
  });

  it.each([
    [403, {}, { kind: 'forbidden' }],
    [401, {}, { kind: 'unauthorized' }],
    [404, {}, { kind: 'error' }],
    [500, {}, { kind: 'error' }],
    [
      422,
      { code: 'NUTRITION_PROFILE_REQUIRED' },
      { kind: 'unprocessable', code: 'NUTRITION_PROFILE_REQUIRED' },
    ],
    [
      422,
      { code: 'PET_WEIGHT_REQUIRED' },
      { kind: 'unprocessable', code: 'PET_WEIGHT_REQUIRED' },
    ],
    [
      422,
      { code: 'UNKNOWN_NUTRITION_ERROR' },
      { kind: 'unprocessable', code: null },
    ],
    [422, null, { kind: 'unprocessable', code: null }],
  ])('maps status %i with body %p', async (status, body, expected) => {
    const fetchFn = jest
      .fn()
      .mockResolvedValue(response(status, body)) as unknown as typeof fetch;

    await expect(
      generateNutritionPlan(baseUrl, 'jwt-token', 'pet-1', fetchFn),
    ).resolves.toEqual(expected);
  });

  it.each([
    ['invalid JSON', invalidJsonResponse(200)],
    ['a null body', response(200, null)],
    ['an array body', response(200, [makePlan()])],
  ])('maps %s on success to error', async (_case, backendResponse) => {
    const fetchFn = jest
      .fn()
      .mockResolvedValue(backendResponse) as unknown as typeof fetch;

    await expect(
      generateNutritionPlan(baseUrl, 'jwt-token', 'pet-1', fetchFn),
    ).resolves.toEqual({ kind: 'error' });
  });

  it('maps a fetch rejection to unreachable', async () => {
    const fetchFn = jest
      .fn()
      .mockRejectedValue(new Error('network down')) as unknown as typeof fetch;

    await expect(
      generateNutritionPlan(baseUrl, 'jwt-token', 'pet-1', fetchFn),
    ).resolves.toEqual({ kind: 'unreachable', message: 'network down' });
  });

  it.each([undefined, ''])(
    'maps missing base URL %p without fetching',
    async (missingUrl) => {
      const fetchFn = jest.fn() as unknown as typeof fetch;

      await expect(
        generateNutritionPlan(missingUrl, 'jwt-token', 'pet-1', fetchFn),
      ).resolves.toEqual({ kind: 'missing-config' });
      expect(fetchFn).not.toHaveBeenCalled();
    },
  );
});

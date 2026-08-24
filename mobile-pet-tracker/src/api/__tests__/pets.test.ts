import { createPet, getPet, listPets } from '../pets';

const baseUrl = 'http://example.test/v1/';
const petsEndpoint = 'http://example.test/v1/pets';
const petEndpoint = 'http://example.test/v1/pets/pet-1';

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

describe('R1: listPets mapea la respuesta por kind', () => {
  const pets = [
    {
      id: 'pet-1',
      name: 'Luna',
      breed: null,
      device: null,
      photoUrl: null,
    },
  ];

  it('gets the ordered pets with the bearer token', async () => {
    const fetchFn = jest
      .fn()
      .mockResolvedValue(response(200, pets)) as unknown as typeof fetch;

    await expect(listPets(baseUrl, 'jwt-token', fetchFn)).resolves.toEqual({
      kind: 'ok',
      pets,
    });
    expect(fetchFn).toHaveBeenCalledWith(petsEndpoint, {
      headers: { Authorization: 'Bearer jwt-token' },
    });
  });

  it('maps an unauthorized response', async () => {
    const fetchFn = jest
      .fn()
      .mockResolvedValue(response(401, {})) as unknown as typeof fetch;

    await expect(listPets(baseUrl, 'expired', fetchFn)).resolves.toEqual({
      kind: 'unauthorized',
    });
  });

  it.each([
    ['an unexpected status', response(500, { message: 'failure' })],
    ['invalid JSON', invalidJsonResponse(200)],
    ['a malformed success body', response(200, { pets: [] })],
  ])('maps %s to error', async (_case, backendResponse) => {
    const fetchFn = jest
      .fn()
      .mockResolvedValue(backendResponse) as unknown as typeof fetch;

    await expect(listPets(baseUrl, 'jwt-token', fetchFn)).resolves.toEqual({
      kind: 'error',
    });
  });

  it('maps a fetch rejection to unreachable', async () => {
    const fetchFn = jest
      .fn()
      .mockRejectedValue(new Error('network down')) as unknown as typeof fetch;

    await expect(listPets(baseUrl, 'jwt-token', fetchFn)).resolves.toEqual({
      kind: 'unreachable',
      message: 'network down',
    });
  });

  it.each([undefined, ''])('maps missing base URL %p without fetching', async (missingUrl) => {
    const fetchFn = jest.fn() as unknown as typeof fetch;

    await expect(listPets(missingUrl, 'jwt-token', fetchFn)).resolves.toEqual({
      kind: 'missing-config',
    });
    expect(fetchFn).not.toHaveBeenCalled();
  });
});

describe('R2: getPet mapea la respuesta por kind', () => {
  const pet = {
    id: 'pet-1',
    name: 'Luna',
    breed: 'Mixed',
    device: null,
    photoUrl: 'http://example.test/luna.jpg',
    nextVaccine: null,
    lastCommunicationAt: null,
  };

  it('gets the pet detail with the bearer token', async () => {
    const fetchFn = jest
      .fn()
      .mockResolvedValue(response(200, pet)) as unknown as typeof fetch;

    await expect(getPet(baseUrl, 'jwt-token', 'pet-1', fetchFn)).resolves.toEqual({
      kind: 'ok',
      pet,
    });
    expect(fetchFn).toHaveBeenCalledWith(petEndpoint, {
      headers: { Authorization: 'Bearer jwt-token' },
    });
  });

  it('maps an unauthorized response', async () => {
    const fetchFn = jest
      .fn()
      .mockResolvedValue(response(401, {})) as unknown as typeof fetch;

    await expect(getPet(baseUrl, 'expired', 'pet-1', fetchFn)).resolves.toEqual({
      kind: 'unauthorized',
    });
  });

  it.each([
    ['not found', response(404, { message: 'Not found' })],
    ['an unexpected status', response(500, { message: 'failure' })],
    ['invalid JSON', invalidJsonResponse(200)],
    ['a malformed id', response(200, { ...pet, id: 7 })],
    ['a malformed name', response(200, { ...pet, name: null })],
  ])('maps %s to error', async (_case, backendResponse) => {
    const fetchFn = jest
      .fn()
      .mockResolvedValue(backendResponse) as unknown as typeof fetch;

    await expect(getPet(baseUrl, 'jwt-token', 'pet-1', fetchFn)).resolves.toEqual({
      kind: 'error',
    });
  });

  it('maps a fetch rejection to unreachable', async () => {
    const fetchFn = jest.fn().mockRejectedValue('offline') as unknown as typeof fetch;

    await expect(getPet(baseUrl, 'jwt-token', 'pet-1', fetchFn)).resolves.toEqual({
      kind: 'unreachable',
      message: 'offline',
    });
  });

  it.each([undefined, ''])('maps missing base URL %p without fetching', async (missingUrl) => {
    const fetchFn = jest.fn() as unknown as typeof fetch;

    await expect(getPet(missingUrl, 'jwt-token', 'pet-1', fetchFn)).resolves.toEqual({
      kind: 'missing-config',
    });
    expect(fetchFn).not.toHaveBeenCalled();
  });
});

describe('R6: createPet publica el contrato exacto por kind', () => {
  const input = {
    name: 'Luna',
    species: 'dog' as const,
    breed: 'Mixed',
    approxAgeMonths: 18,
    sex: 'female' as const,
    size: 'medium' as const,
    sterilized: true,
    microchip: 'CHIP-001',
  };
  const pet = {
    id: 'pet-new',
    ...input,
    birthDate: null,
    ageMonths: 18,
    currentWeightKg: null,
    color: null,
    photoUrl: null,
  };

  it('posts only the supplied CreatePet fields and accepts 201', async () => {
    const fetchFn = jest
      .fn()
      .mockResolvedValue(response(201, pet)) as unknown as typeof fetch;

    await expect(createPet(baseUrl, 'jwt-token', input, fetchFn)).resolves.toEqual({
      kind: 'ok',
      pet,
    });
    expect(fetchFn).toHaveBeenCalledWith(petsEndpoint, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer jwt-token',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    });
  });

  it.each([
    [400, { kind: 'invalid' }],
    [401, { kind: 'unauthorized' }],
    [403, { kind: 'forbidden' }],
    [500, { kind: 'error' }],
  ])('maps status %s', async (status, expected) => {
    const fetchFn = jest
      .fn()
      .mockResolvedValue(response(status, {})) as unknown as typeof fetch;

    await expect(createPet(baseUrl, 'jwt-token', input, fetchFn)).resolves.toEqual(
      expected,
    );
  });

  it('maps malformed success, missing config, and network failures', async () => {
    const malformedFetch = jest
      .fn()
      .mockResolvedValue(response(201, { name: 'Missing id' })) as unknown as typeof fetch;
    const offlineFetch = jest
      .fn()
      .mockRejectedValue(new Error('offline')) as unknown as typeof fetch;

    await expect(
      createPet(baseUrl, 'jwt-token', input, malformedFetch),
    ).resolves.toEqual({ kind: 'error' });
    await expect(
      createPet(undefined, 'jwt-token', input, malformedFetch),
    ).resolves.toEqual({ kind: 'missing-config' });
    await expect(
      createPet(baseUrl, 'jwt-token', input, offlineFetch),
    ).resolves.toEqual({ kind: 'unreachable', message: 'offline' });
  });
});

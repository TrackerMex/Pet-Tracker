import { listPets } from '../pets';

const baseUrl = 'http://example.test/v1/';
const petsEndpoint = 'http://example.test/v1/pets';

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

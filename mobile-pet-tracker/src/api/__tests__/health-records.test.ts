import { listVaccines } from '../health-records';

const baseUrl = 'http://example.test/v1/';
const vaccinesEndpoint = 'http://example.test/v1/pets/pet-1/vaccines';

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

function makeVaccine(overrides: Record<string, unknown> = {}) {
  return {
    id: 'vaccine-1',
    petId: 'pet-1',
    catalogId: null,
    name: 'Rabies',
    appliedAt: '2026-08-01',
    nextDoseAt: '2027-08-01',
    vetName: null,
    clinic: null,
    notes: null,
    documentKey: null,
    ...overrides,
  };
}

describe('R1: listVaccines mapea la respuesta por kind', () => {
  it('gets the ordered vaccines with the bearer token', async () => {
    const vaccines = [makeVaccine(), makeVaccine({ id: 'vaccine-2' })];
    const fetchFn = jest
      .fn()
      .mockResolvedValue(response(200, vaccines)) as unknown as typeof fetch;

    await expect(
      listVaccines(baseUrl, 'jwt-token', 'pet-1', fetchFn),
    ).resolves.toEqual({ kind: 'ok', vaccines });
    expect(fetchFn).toHaveBeenCalledWith(vaccinesEndpoint, {
      headers: { Authorization: 'Bearer jwt-token' },
    });
  });

  it('maps an unauthorized response', async () => {
    const fetchFn = jest
      .fn()
      .mockResolvedValue(response(401, {})) as unknown as typeof fetch;

    await expect(
      listVaccines(baseUrl, 'expired', 'pet-1', fetchFn),
    ).resolves.toEqual({ kind: 'unauthorized' });
  });

  it.each([
    ['not found', response(404, { message: 'Not found' })],
    ['an unexpected status', response(500, { message: 'failure' })],
    ['invalid JSON', invalidJsonResponse(200)],
    ['a malformed success body', response(200, { vaccines: [] })],
  ])('maps %s to error', async (_case, backendResponse) => {
    const fetchFn = jest
      .fn()
      .mockResolvedValue(backendResponse) as unknown as typeof fetch;

    await expect(
      listVaccines(baseUrl, 'jwt-token', 'pet-1', fetchFn),
    ).resolves.toEqual({ kind: 'error' });
  });

  it('maps a fetch rejection to unreachable', async () => {
    const fetchFn = jest
      .fn()
      .mockRejectedValue(new Error('network down')) as unknown as typeof fetch;

    await expect(
      listVaccines(baseUrl, 'jwt-token', 'pet-1', fetchFn),
    ).resolves.toEqual({ kind: 'unreachable', message: 'network down' });
  });

  it.each([undefined, ''])(
    'maps missing base URL %p without fetching',
    async (missingUrl) => {
      const fetchFn = jest.fn() as unknown as typeof fetch;

      await expect(
        listVaccines(missingUrl, 'jwt-token', 'pet-1', fetchFn),
      ).resolves.toEqual({ kind: 'missing-config' });
      expect(fetchFn).not.toHaveBeenCalled();
    },
  );
});

import { listReminders } from '../reminders';

const baseUrl = 'http://example.test/v1/';
const endpoint = 'http://example.test/v1/pets/pet-1/reminders';

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

function makeReminder(overrides: Record<string, unknown> = {}) {
  return {
    id: 'reminder-1',
    petId: 'pet-1',
    type: 'vaccine',
    title: 'Rabies booster',
    dueAt: '2026-09-01T09:00:00.000Z',
    advanceMinutes: 10080,
    status: 'scheduled',
    ...overrides,
  };
}

describe('R1: listReminders mapea la respuesta por kind', () => {
  it('gets reminders with the bearer token', async () => {
    const reminders = [makeReminder(), makeReminder({ id: 'reminder-2' })];
    const fetchFn = jest
      .fn()
      .mockResolvedValue(response(200, reminders)) as unknown as typeof fetch;

    await expect(
      listReminders(baseUrl, 'jwt-token', 'pet-1', fetchFn),
    ).resolves.toEqual({ kind: 'ok', reminders });
    expect(fetchFn).toHaveBeenCalledWith(endpoint, {
      headers: { Authorization: 'Bearer jwt-token' },
    });
  });

  it.each([
    [404, { kind: 'not-found' }],
    [401, { kind: 'unauthorized' }],
    [500, { kind: 'error' }],
  ])('maps HTTP %i', async (status, expected) => {
    const fetchFn = jest
      .fn()
      .mockResolvedValue(response(status, {})) as unknown as typeof fetch;

    await expect(
      listReminders(baseUrl, 'jwt-token', 'pet-1', fetchFn),
    ).resolves.toEqual(expected);
  });

  it.each([
    ['invalid JSON', invalidJsonResponse(200)],
    ['a malformed success body', response(200, { reminders: [] })],
  ])('maps %s to error', async (_case, backendResponse) => {
    const fetchFn = jest
      .fn()
      .mockResolvedValue(backendResponse) as unknown as typeof fetch;

    await expect(
      listReminders(baseUrl, 'jwt-token', 'pet-1', fetchFn),
    ).resolves.toEqual({ kind: 'error' });
  });

  it('maps a fetch rejection to unreachable', async () => {
    const fetchFn = jest
      .fn()
      .mockRejectedValue(new Error('network down')) as unknown as typeof fetch;

    await expect(
      listReminders(baseUrl, 'jwt-token', 'pet-1', fetchFn),
    ).resolves.toEqual({ kind: 'unreachable', message: 'network down' });
  });

  it.each([undefined, ''])(
    'maps missing base URL %p without fetching',
    async (missingUrl) => {
      const fetchFn = jest.fn() as unknown as typeof fetch;

      await expect(
        listReminders(missingUrl, 'jwt-token', 'pet-1', fetchFn),
      ).resolves.toEqual({ kind: 'missing-config' });
      expect(fetchFn).not.toHaveBeenCalled();
    },
  );
});

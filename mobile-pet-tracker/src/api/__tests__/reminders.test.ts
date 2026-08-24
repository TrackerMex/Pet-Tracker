import { createReminder, deleteReminder, listReminders } from '../reminders';

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

describe('R2: createReminder publica y mapea por kind', () => {
  const input = {
    type: 'vaccine' as const,
    title: 'Rabies booster',
    dueAt: '2026-09-01T09:00:00.000Z',
    advanceMinutes: 10080,
  };

  it('posts exactly the four supported fields', async () => {
    const reminder = makeReminder();
    const fetchFn = jest
      .fn()
      .mockResolvedValue(response(201, reminder)) as unknown as typeof fetch;

    await expect(
      createReminder(baseUrl, 'jwt-token', 'pet-1', input, fetchFn),
    ).resolves.toEqual({ kind: 'ok', reminder });
    expect(fetchFn).toHaveBeenCalledWith(endpoint, {
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
    [403, { kind: 'forbidden' }],
    [401, { kind: 'unauthorized' }],
    [200, { kind: 'error' }],
    [500, { kind: 'error' }],
  ])('maps HTTP %i', async (status, expected) => {
    const fetchFn = jest
      .fn()
      .mockResolvedValue(response(status, {})) as unknown as typeof fetch;

    await expect(
      createReminder(baseUrl, 'jwt-token', 'pet-1', input, fetchFn),
    ).resolves.toEqual(expected);
  });

  it.each([
    ['invalid JSON', invalidJsonResponse(201)],
    ['an array success body', response(201, [])],
  ])('maps %s to error', async (_case, backendResponse) => {
    const fetchFn = jest
      .fn()
      .mockResolvedValue(backendResponse) as unknown as typeof fetch;

    await expect(
      createReminder(baseUrl, 'jwt-token', 'pet-1', input, fetchFn),
    ).resolves.toEqual({ kind: 'error' });
  });

  it('maps a fetch rejection to unreachable', async () => {
    const fetchFn = jest
      .fn()
      .mockRejectedValue('offline') as unknown as typeof fetch;

    await expect(
      createReminder(baseUrl, 'jwt-token', 'pet-1', input, fetchFn),
    ).resolves.toEqual({ kind: 'unreachable', message: 'offline' });
  });

  it('maps a missing base URL without fetching', async () => {
    const fetchFn = jest.fn() as unknown as typeof fetch;

    await expect(
      createReminder(undefined, 'jwt-token', 'pet-1', input, fetchFn),
    ).resolves.toEqual({ kind: 'missing-config' });
    expect(fetchFn).not.toHaveBeenCalled();
  });
});

describe('R3: deleteReminder borra y mapea por kind', () => {
  const deleteEndpoint = `${endpoint}/reminder-1`;

  it('deletes without a body and does not parse the 204 response', async () => {
    const backendResponse = response(204, undefined);
    const fetchFn = jest
      .fn()
      .mockResolvedValue(backendResponse) as unknown as typeof fetch;

    await expect(
      deleteReminder(
        baseUrl,
        'jwt-token',
        'pet-1',
        'reminder-1',
        fetchFn,
      ),
    ).resolves.toEqual({ kind: 'ok' });
    expect(fetchFn).toHaveBeenCalledWith(deleteEndpoint, {
      method: 'DELETE',
      headers: { Authorization: 'Bearer jwt-token' },
    });
    expect(fetchFn).toHaveBeenCalledWith(
      deleteEndpoint,
      expect.not.objectContaining({ body: expect.anything() }),
    );
    expect(backendResponse.json).not.toHaveBeenCalled();
  });

  it.each([
    [404, { kind: 'not-found' }],
    [403, { kind: 'forbidden' }],
    [401, { kind: 'unauthorized' }],
    [200, { kind: 'error' }],
    [500, { kind: 'error' }],
  ])('maps HTTP %i', async (status, expected) => {
    const fetchFn = jest
      .fn()
      .mockResolvedValue(response(status, {})) as unknown as typeof fetch;

    await expect(
      deleteReminder(
        baseUrl,
        'jwt-token',
        'pet-1',
        'reminder-1',
        fetchFn,
      ),
    ).resolves.toEqual(expected);
  });

  it('maps a fetch rejection to unreachable', async () => {
    const fetchFn = jest
      .fn()
      .mockRejectedValue(new Error('network down')) as unknown as typeof fetch;

    await expect(
      deleteReminder(
        baseUrl,
        'jwt-token',
        'pet-1',
        'reminder-1',
        fetchFn,
      ),
    ).resolves.toEqual({ kind: 'unreachable', message: 'network down' });
  });

  it('maps a missing base URL without fetching', async () => {
    const fetchFn = jest.fn() as unknown as typeof fetch;

    await expect(
      deleteReminder(
        undefined,
        'jwt-token',
        'pet-1',
        'reminder-1',
        fetchFn,
      ),
    ).resolves.toEqual({ kind: 'missing-config' });
    expect(fetchFn).not.toHaveBeenCalled();
  });
});

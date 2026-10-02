import { deleteGeofence, listGeofences, setGeofenceActive, type Geofence } from '../geofences';

const baseUrl = 'http://example.test/v1/';

function response(status: number, body: unknown): Response {
  return { status, json: jest.fn().mockResolvedValue(body) } as unknown as Response;
}

function invalidJsonResponse(status: number): Response {
  return {
    status,
    json: jest.fn().mockRejectedValue(new SyntaxError('invalid json')),
  } as unknown as Response;
}

function makeGeofence(id: string, active = true): Geofence {
  return {
    id, petId: 'pet-1', name: id, type: 'safe_circle',
    centerLat: 19.4, centerLng: -99.1, radiusM: 150, active,
    state: { value: 'unknown', updatedAt: null },
    createdAt: '2026-10-01T12:00:00.000Z', updatedAt: '2026-10-01T12:00:00.000Z',
  };
}

describe('#41 R2: listGeofences mapea la lista por kind', () => {
  it('gets the pet geofences with the bearer token and returns them in backend order', async () => {
    const geofences = [makeGeofence('zone-2'), makeGeofence('zone-1', false)];
    const fetchFn = jest.fn().mockResolvedValue(response(200, geofences));
    await expect(listGeofences(baseUrl, 'jwt-token', 'pet-1', fetchFn)).resolves.toEqual({ kind: 'ok', geofences });
    expect(fetchFn).toHaveBeenCalledTimes(1);
    expect(fetchFn).toHaveBeenCalledWith('http://example.test/v1/pets/pet-1/geofences', {
      headers: { Authorization: 'Bearer jwt-token' },
    });
  });

  it('maps an empty array to ok with no geofences', async () => {
    const fetchFn = jest.fn().mockResolvedValue(response(200, []));
    await expect(listGeofences(baseUrl, 'jwt-token', 'pet-1', fetchFn)).resolves.toEqual({ kind: 'ok', geofences: [] });
  });

  it.each([
    [402, 'no-tracking'], [401, 'unauthorized'], [403, 'error'], [404, 'error'], [500, 'error'],
  ])('maps HTTP %i', async (status, kind) => {
    const fetchFn = jest.fn().mockResolvedValue(response(status as number, {}));
    await expect(listGeofences(baseUrl, 'jwt-token', 'pet-1', fetchFn)).resolves.toEqual({ kind });
  });

  it.each([
    ['invalid JSON', invalidJsonResponse(200)],
    ['an object instead of an array', response(200, {})],
    ['an item without name', response(200, [{ id: 'zone-1', radiusM: 150, active: true }])],
    ['a string radiusM', response(200, [{ ...makeGeofence('zone-1'), radiusM: '150' }])],
    ['a string active', response(200, [{ ...makeGeofence('zone-1'), active: 'true' }])],
    ['a null item', response(200, [null])],
  ])('maps %s to error', async (_name, backendResponse) => {
    const fetchFn = jest.fn().mockResolvedValue(backendResponse);
    await expect(listGeofences(baseUrl, 'jwt-token', 'pet-1', fetchFn)).resolves.toEqual({ kind: 'error' });
  });

  it('maps a fetch rejection to unreachable', async () => {
    const fetchFn = jest.fn().mockRejectedValue(new Error('network down'));
    await expect(listGeofences(baseUrl, 'jwt-token', 'pet-1', fetchFn)).resolves.toEqual({ kind: 'unreachable', message: 'network down' });
  });

  it.each([undefined, ''])('maps missing base URL %p without fetching', async (missingUrl) => {
    const fetchFn = jest.fn();
    await expect(listGeofences(missingUrl, 'jwt-token', 'pet-1', fetchFn)).resolves.toEqual({ kind: 'missing-config' });
    expect(fetchFn).not.toHaveBeenCalled();
  });
});

describe('#41 R3: setGeofenceActive y deleteGeofence mapean la escritura por kind', () => {
  it.each([true, false])('patches only the active flag %p', async (active) => {
    const fetchFn = jest.fn().mockResolvedValue(response(200, makeGeofence('zone-1', active)));
    await expect(setGeofenceActive(baseUrl, 'jwt-token', 'pet-1', 'zone-1', active, fetchFn)).resolves.toEqual({ kind: 'ok' });
    expect(fetchFn).toHaveBeenCalledTimes(1);
    expect(fetchFn).toHaveBeenCalledWith('http://example.test/v1/pets/pet-1/geofences/zone-1', {
      method: 'PATCH',
      headers: { Authorization: 'Bearer jwt-token', 'Content-Type': 'application/json' },
      body: active ? '{"active":true}' : '{"active":false}',
    });
  });

  it('deletes without a body and maps 204 to ok', async () => {
    const fetchFn = jest.fn().mockResolvedValue(response(204, undefined));
    await expect(deleteGeofence(baseUrl, 'jwt-token', 'pet-1', 'zone-1', fetchFn)).resolves.toEqual({ kind: 'ok' });
    expect(fetchFn).toHaveBeenCalledTimes(1);
    expect(fetchFn).toHaveBeenCalledWith('http://example.test/v1/pets/pet-1/geofences/zone-1', {
      method: 'DELETE', headers: { Authorization: 'Bearer jwt-token' },
    });
  });

  it.each([
    [404, 'not-found'], [402, 'no-tracking'], [401, 'unauthorized'],
    [403, 'error'], [400, 'error'], [500, 'error'], [204, 'error'],
  ] as const)('setGeofenceActive maps HTTP %i', async (status, kind) => {
    const fetchFn = jest.fn().mockResolvedValue(response(status, {}));
    await expect(setGeofenceActive(baseUrl, 'jwt-token', 'pet-1', 'zone-1', false, fetchFn)).resolves.toEqual({ kind });
  });

  it.each([
    [404, 'not-found'], [402, 'no-tracking'], [401, 'unauthorized'],
    [403, 'error'], [500, 'error'], [200, 'error'],
  ] as const)('deleteGeofence maps HTTP %i', async (status, kind) => {
    const fetchFn = jest.fn().mockResolvedValue(response(status, {}));
    await expect(deleteGeofence(baseUrl, 'jwt-token', 'pet-1', 'zone-1', fetchFn)).resolves.toEqual({ kind });
  });

  it('maps fetch rejections to unreachable', async () => {
    const fetchFn = jest.fn().mockRejectedValue(new Error('network down'));
    await expect(setGeofenceActive(baseUrl, 'jwt-token', 'pet-1', 'zone-1', false, fetchFn)).resolves.toEqual({ kind: 'unreachable', message: 'network down' });
    await expect(deleteGeofence(baseUrl, 'jwt-token', 'pet-1', 'zone-1', fetchFn)).resolves.toEqual({ kind: 'unreachable', message: 'network down' });
  });

  it.each([undefined, ''])('maps missing base URL %p without fetching', async (missingUrl) => {
    const fetchFn = jest.fn();
    await expect(setGeofenceActive(missingUrl, 'jwt-token', 'pet-1', 'zone-1', false, fetchFn)).resolves.toEqual({ kind: 'missing-config' });
    await expect(deleteGeofence(missingUrl, 'jwt-token', 'pet-1', 'zone-1', fetchFn)).resolves.toEqual({ kind: 'missing-config' });
    expect(fetchFn).not.toHaveBeenCalled();
  });
});

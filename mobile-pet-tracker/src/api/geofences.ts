import { deleteJson, getJson, patchJson, readJson } from './http';

export interface Geofence {
  id: string;
  petId: string;
  name: string;
  type: 'safe_circle';
  centerLat: number;
  centerLng: number;
  radiusM: number;
  active: boolean;
  state: { value: 'unknown' | 'inside' | 'outside'; updatedAt: string | null };
  createdAt: string;
  updatedAt: string;
}

export type GeofenceListState =
  | { kind: 'ok'; geofences: Geofence[] }
  | { kind: 'no-tracking' }
  | { kind: 'unauthorized' }
  | { kind: 'error' }
  | { kind: 'unreachable'; message: string }
  | { kind: 'missing-config' };

function isGeofence(value: unknown): value is Geofence {
  if (typeof value !== 'object' || value === null) return false;
  const item = value as Record<string, unknown>;
  return typeof item.id === 'string' && typeof item.name === 'string' &&
    typeof item.radiusM === 'number' && typeof item.active === 'boolean';
}

export async function listGeofences(
  baseUrl: string | undefined,
  token: string,
  petId: string,
  fetchFn: typeof fetch = fetch,
): Promise<GeofenceListState> {
  if (!baseUrl) return { kind: 'missing-config' };
  const result = await getJson(baseUrl, `/pets/${petId}/geofences`, token, fetchFn);
  if (result.kind === 'unreachable') return result;
  if (result.response.status === 402) return { kind: 'no-tracking' };
  if (result.response.status === 401) return { kind: 'unauthorized' };
  if (result.response.status !== 200) return { kind: 'error' };
  const body = await readJson(result.response);
  return Array.isArray(body) && body.every(isGeofence)
    ? { kind: 'ok', geofences: body }
    : { kind: 'error' };
}

export type GeofenceWriteState =
  | { kind: 'ok' }
  | { kind: 'not-found' }
  | { kind: 'no-tracking' }
  | { kind: 'unauthorized' }
  | { kind: 'error' }
  | { kind: 'unreachable'; message: string }
  | { kind: 'missing-config' };

function writeState(response: Response, okStatus: number): GeofenceWriteState {
  if (response.status === okStatus) return { kind: 'ok' };
  if (response.status === 404) return { kind: 'not-found' };
  if (response.status === 402) return { kind: 'no-tracking' };
  if (response.status === 401) return { kind: 'unauthorized' };
  return { kind: 'error' };
}

export async function setGeofenceActive(
  baseUrl: string | undefined,
  token: string,
  petId: string,
  geofenceId: string,
  active: boolean,
  fetchFn: typeof fetch = fetch,
): Promise<GeofenceWriteState> {
  if (!baseUrl) return { kind: 'missing-config' };
  const result = await patchJson(
    baseUrl, `/pets/${petId}/geofences/${geofenceId}`, token, { active }, fetchFn,
  );
  return result.kind === 'unreachable' ? result : writeState(result.response, 200);
}

export async function deleteGeofence(
  baseUrl: string | undefined,
  token: string,
  petId: string,
  geofenceId: string,
  fetchFn: typeof fetch = fetch,
): Promise<GeofenceWriteState> {
  if (!baseUrl) return { kind: 'missing-config' };
  const result = await deleteJson(
    baseUrl, `/pets/${petId}/geofences/${geofenceId}`, token, fetchFn,
  );
  return result.kind === 'unreachable' ? result : writeState(result.response, 204);
}

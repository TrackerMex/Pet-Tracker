import { deleteJson, getJson, patchJson, postJson, readJson } from './http';

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

/** Espejo de GEOFENCE_MAX_PER_PET de backend-pet-tracker/src/modules/geofences/geofences.constants.ts. */
export const GEOFENCE_MAX_PER_PET = 5;

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
    typeof item.radiusM === 'number' && typeof item.active === 'boolean' &&
    typeof item.centerLat === 'number' && typeof item.centerLng === 'number';
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

export type GeofenceDraft = { name: string; centerLat: number; centerLng: number; radiusM: number };
export type GeofenceSaveState = GeofenceWriteState
  | { kind: 'name-taken' } | { kind: 'limit-reached' } | { kind: 'invalid' };

async function saveState(response: Response, okStatus: number): Promise<GeofenceSaveState> {
  if (response.status === 409 || response.status === 400) {
    const code = (await readJson(response) as { code?: string } | undefined)?.code;
    if (response.status === 409 && code === 'GEOFENCE_NAME_TAKEN') return { kind: 'name-taken' };
    if (response.status === 400) {
      return { kind: code === 'MAX_GEOFENCES_REACHED' ? 'limit-reached' : 'invalid' };
    }
  }
  return writeState(response, okStatus);
}

export async function createGeofence(
  baseUrl: string | undefined, token: string, petId: string,
  draft: GeofenceDraft, fetchFn: typeof fetch = fetch,
): Promise<GeofenceSaveState> {
  if (!baseUrl) return { kind: 'missing-config' };
  const result = await postJson(baseUrl, `/pets/${petId}/geofences`, token, { ...draft, type: 'safe_circle' }, fetchFn);
  return result.kind === 'unreachable' ? result : saveState(result.response, 201);
}

export async function updateGeofence(
  baseUrl: string | undefined, token: string, petId: string, geofenceId: string,
  draft: GeofenceDraft, fetchFn: typeof fetch = fetch,
): Promise<GeofenceSaveState> {
  if (!baseUrl) return { kind: 'missing-config' };
  const result = await patchJson(baseUrl, `/pets/${petId}/geofences/${geofenceId}`, token, draft, fetchFn);
  return result.kind === 'unreachable' ? result : saveState(result.response, 200);
}

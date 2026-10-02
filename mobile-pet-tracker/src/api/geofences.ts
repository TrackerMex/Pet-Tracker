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

export async function listGeofences(
  _baseUrl: string | undefined,
  _token: string,
  _petId: string,
  _fetchFn: typeof fetch = fetch,
): Promise<GeofenceListState> {
  return { kind: 'missing-config' };
}

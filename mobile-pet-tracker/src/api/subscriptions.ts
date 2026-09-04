import { getLastPosition } from './positions';

export type PetTrackingState =
  | { kind: 'ok'; tracked: boolean }
  | { kind: 'unauthorized' }
  | { kind: 'error' }
  | { kind: 'unreachable'; message: string }
  | { kind: 'missing-config' };

export async function getPetTracking(
  baseUrl: string | undefined,
  token: string,
  petId: string,
  fetchFn: typeof fetch = fetch,
): Promise<PetTrackingState> {
  // ponytail: sonda sobre positions/last; cuando exista GET /pets/:id/subscription se cambia aquí sin tocar pantallas
  const result = await getLastPosition(baseUrl, token, petId, fetchFn);

  if (result.kind === 'ok') {
    return { kind: 'ok', tracked: true };
  }
  if (result.kind === 'no-tracking') {
    return { kind: 'ok', tracked: false };
  }

  return result;
}

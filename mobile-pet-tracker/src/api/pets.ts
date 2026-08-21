import { getJson, readJson } from './http';
import type { PetProfile } from './types';

export type PetsState =
  | { kind: 'ok'; pets: PetProfile[] }
  | { kind: 'unauthorized' }
  | { kind: 'error' }
  | { kind: 'unreachable'; message: string }
  | { kind: 'missing-config' };

export async function listPets(
  baseUrl: string | undefined,
  token: string,
  fetchFn: typeof fetch = fetch,
): Promise<PetsState> {
  if (!baseUrl) {
    return { kind: 'missing-config' };
  }

  const result = await getJson(baseUrl, '/pets', token, fetchFn);
  if (result.kind === 'unreachable') {
    return result;
  }

  if (result.response.status === 401) {
    return { kind: 'unauthorized' };
  }

  if (result.response.status !== 200) {
    return { kind: 'error' };
  }

  const body = await readJson(result.response);
  return Array.isArray(body)
    ? { kind: 'ok', pets: body as PetProfile[] }
    : { kind: 'error' };
}

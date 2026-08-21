import { getJson, readJson } from './http';
import type { PetProfile } from './types';

export type PetsState =
  | { kind: 'ok'; pets: PetProfile[] }
  | { kind: 'unauthorized' }
  | { kind: 'error' }
  | { kind: 'unreachable'; message: string }
  | { kind: 'missing-config' };

export type PetState =
  | { kind: 'ok'; pet: PetProfile }
  | { kind: 'unauthorized' }
  | { kind: 'error' }
  | { kind: 'unreachable'; message: string }
  | { kind: 'missing-config' };

function isPetProfile(value: unknown): value is PetProfile {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as Record<string, unknown>).id === 'string' &&
    typeof (value as Record<string, unknown>).name === 'string'
  );
}

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

export async function getPet(
  baseUrl: string | undefined,
  token: string,
  petId: string,
  fetchFn: typeof fetch = fetch,
): Promise<PetState> {
  if (!baseUrl) {
    return { kind: 'missing-config' };
  }

  const result = await getJson(baseUrl, `/pets/${petId}`, token, fetchFn);
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
  return isPetProfile(body) ? { kind: 'ok', pet: body } : { kind: 'error' };
}

import { getJson, readJson } from './http';
import type { Vaccine, WeightEntry } from './types';

export type VaccinesState =
  | { kind: 'ok'; vaccines: Vaccine[] }
  | { kind: 'unauthorized' }
  | { kind: 'error' }
  | { kind: 'unreachable'; message: string }
  | { kind: 'missing-config' };

export type WeightsState =
  | { kind: 'ok'; weights: WeightEntry[] }
  | { kind: 'unauthorized' }
  | { kind: 'error' }
  | { kind: 'unreachable'; message: string }
  | { kind: 'missing-config' };

export async function listVaccines(
  baseUrl: string | undefined,
  token: string,
  petId: string,
  fetchFn: typeof fetch = fetch,
): Promise<VaccinesState> {
  if (!baseUrl) {
    return { kind: 'missing-config' };
  }

  const result = await getJson(
    baseUrl,
    `/pets/${petId}/vaccines`,
    token,
    fetchFn,
  );
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
    ? { kind: 'ok', vaccines: body as Vaccine[] }
    : { kind: 'error' };
}

export async function listWeights(
  baseUrl: string | undefined,
  token: string,
  petId: string,
  fetchFn: typeof fetch = fetch,
  limit?: number,
): Promise<WeightsState> {
  if (!baseUrl) {
    return { kind: 'missing-config' };
  }

  const query = limit === undefined ? '' : `?limit=${limit}`;
  const result = await getJson(
    baseUrl,
    `/pets/${petId}/weights${query}`,
    token,
    fetchFn,
  );
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
    ? { kind: 'ok', weights: body as WeightEntry[] }
    : { kind: 'error' };
}

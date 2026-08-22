import { getJson, postJson, readJson } from './http';
import type { FieldError, Vaccine, WeightEntry } from './types';

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

export interface CreateWeightInput {
  weightKg: number;
  measuredAt: string;
  bodyCondition?: number;
}

export type CreateWeightState =
  | { kind: 'ok'; weight: WeightEntry }
  | { kind: 'validation'; errors: FieldError[] }
  | { kind: 'forbidden' }
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

export async function createWeight(
  baseUrl: string | undefined,
  token: string,
  petId: string,
  input: CreateWeightInput,
  fetchFn: typeof fetch = fetch,
): Promise<CreateWeightState> {
  if (!baseUrl) {
    return { kind: 'missing-config' };
  }

  const body = {
    weightKg: input.weightKg,
    measuredAt: input.measuredAt,
    ...(input.bodyCondition === undefined
      ? {}
      : { bodyCondition: input.bodyCondition }),
  };
  const result = await postJson(
    baseUrl,
    `/pets/${petId}/weights`,
    token,
    body,
    fetchFn,
  );
  if (result.kind === 'unreachable') {
    return result;
  }

  if (result.response.status === 400) {
    const validationBody = await readJson(result.response);
    const errors =
      typeof validationBody === 'object' &&
      validationBody !== null &&
      Array.isArray((validationBody as Record<string, unknown>).errors)
        ? ((validationBody as Record<string, unknown>).errors as FieldError[])
        : [];
    return { kind: 'validation', errors };
  }

  if (result.response.status === 403) {
    return { kind: 'forbidden' };
  }

  if (result.response.status === 401) {
    return { kind: 'unauthorized' };
  }

  if (result.response.status !== 201) {
    return { kind: 'error' };
  }

  const responseBody = await readJson(result.response);
  return typeof responseBody === 'object' &&
    responseBody !== null &&
    !Array.isArray(responseBody)
    ? { kind: 'ok', weight: responseBody as WeightEntry }
    : { kind: 'error' };
}

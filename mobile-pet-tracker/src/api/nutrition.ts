import { getJson, readJson } from './http';
import type { NutritionPlan, NutritionProfile } from './types';

export type NutritionProfileState =
  | { kind: 'ok'; profile: NutritionProfile }
  | { kind: 'not-found' }
  | { kind: 'unauthorized' }
  | { kind: 'error' }
  | { kind: 'unreachable'; message: string }
  | { kind: 'missing-config' };

export type NutritionPlanState =
  | { kind: 'ok'; plan: NutritionPlan }
  | { kind: 'not-found' }
  | { kind: 'unauthorized' }
  | { kind: 'error' }
  | { kind: 'unreachable'; message: string }
  | { kind: 'missing-config' };

function isObjectBody(body: unknown): body is Record<string, unknown> {
  return typeof body === 'object' && body !== null && !Array.isArray(body);
}

export async function getNutritionProfile(
  baseUrl: string | undefined,
  token: string,
  petId: string,
  fetchFn: typeof fetch = fetch,
): Promise<NutritionProfileState> {
  if (!baseUrl) {
    return { kind: 'missing-config' };
  }

  const result = await getJson(
    baseUrl,
    `/pets/${petId}/nutrition-profile`,
    token,
    fetchFn,
  );
  if (result.kind === 'unreachable') {
    return result;
  }

  if (result.response.status === 404) {
    return { kind: 'not-found' };
  }

  if (result.response.status === 401) {
    return { kind: 'unauthorized' };
  }

  if (result.response.status !== 200) {
    return { kind: 'error' };
  }

  const body = await readJson(result.response);
  return isObjectBody(body)
    ? { kind: 'ok', profile: body as unknown as NutritionProfile }
    : { kind: 'error' };
}

export async function getNutritionPlan(
  baseUrl: string | undefined,
  token: string,
  petId: string,
  fetchFn: typeof fetch = fetch,
): Promise<NutritionPlanState> {
  if (!baseUrl) {
    return { kind: 'missing-config' };
  }

  const result = await getJson(
    baseUrl,
    `/pets/${petId}/nutrition-plan`,
    token,
    fetchFn,
  );
  if (result.kind === 'unreachable') {
    return result;
  }

  if (result.response.status === 404) {
    return { kind: 'not-found' };
  }

  if (result.response.status === 401) {
    return { kind: 'unauthorized' };
  }

  if (result.response.status !== 200) {
    return { kind: 'error' };
  }

  const body = await readJson(result.response);
  return isObjectBody(body)
    ? { kind: 'ok', plan: body as unknown as NutritionPlan }
    : { kind: 'error' };
}

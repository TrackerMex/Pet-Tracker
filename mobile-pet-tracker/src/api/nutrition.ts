import { deleteJson, getJson, patchJson, postJson, readJson } from './http';
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

export type GeneratePlanState =
  | { kind: 'ok'; plan: NutritionPlan }
  | { kind: 'forbidden' }
  | { kind: 'unprocessable'; code: string | null }
  | { kind: 'unauthorized' }
  | { kind: 'error' }
  | { kind: 'unreachable'; message: string }
  | { kind: 'missing-config' };

export type ServeMealState =
  | { kind: 'ok' }
  | { kind: 'already-served' }
  | { kind: 'unauthorized' }
  | { kind: 'error' }
  | { kind: 'unreachable'; message: string }
  | { kind: 'missing-config' };

export type UnserveMealState =
  | { kind: 'ok' }
  | { kind: 'not-served' }
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

export async function generateNutritionPlan(
  baseUrl: string | undefined,
  token: string,
  petId: string,
  fetchFn: typeof fetch = fetch,
): Promise<GeneratePlanState> {
  if (!baseUrl) {
    return { kind: 'missing-config' };
  }

  const result = await postJson(
    baseUrl,
    `/pets/${petId}/nutrition-plan/generate`,
    token,
    {},
    fetchFn,
  );
  if (result.kind === 'unreachable') {
    return result;
  }

  if (result.response.status === 403) {
    return { kind: 'forbidden' };
  }

  if (result.response.status === 422) {
    const body = await readJson(result.response);
    const value = isObjectBody(body) ? body.code : undefined;
    const code =
      value === 'NUTRITION_PROFILE_REQUIRED' || value === 'PET_WEIGHT_REQUIRED'
        ? value
        : null;
    return { kind: 'unprocessable', code };
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

export async function serveMeal(
  baseUrl: string | undefined,
  token: string,
  petId: string,
  mealTime: string,
  fetchFn: typeof fetch = fetch,
): Promise<ServeMealState> {
  if (!baseUrl) {
    return { kind: 'missing-config' };
  }

  const result = await postJson(
    baseUrl,
    `/pets/${petId}/meals`,
    token,
    { mealTime },
    fetchFn,
  );
  if (result.kind === 'unreachable') {
    return result;
  }

  if (result.response.status === 201) {
    return { kind: 'ok' };
  }
  if (result.response.status === 409) {
    const body = await readJson(result.response);
    return isObjectBody(body) && body.code === 'MEAL_ALREADY_SERVED'
      ? { kind: 'already-served' }
      : { kind: 'error' };
  }
  if (result.response.status === 401) {
    return { kind: 'unauthorized' };
  }
  return { kind: 'error' };
}

export async function unserveMeal(
  baseUrl: string | undefined,
  token: string,
  petId: string,
  mealTime: string,
  fetchFn: typeof fetch = fetch,
): Promise<UnserveMealState> {
  if (!baseUrl) {
    return { kind: 'missing-config' };
  }

  const result = await deleteJson(
    baseUrl,
    `/pets/${petId}/meals/${mealTime}`,
    token,
    fetchFn,
  );
  if (result.kind === 'unreachable') {
    return result;
  }

  if (result.response.status === 204) {
    return { kind: 'ok' };
  }
  if (result.response.status === 404) {
    const body = await readJson(result.response);
    return isObjectBody(body) && body.code === 'MEAL_SERVING_NOT_FOUND'
      ? { kind: 'not-served' }
      : { kind: 'error' };
  }
  if (result.response.status === 401) {
    return { kind: 'unauthorized' };
  }
  return { kind: 'error' };
}

export type MealTimeErrorCode =
  | 'NUTRITION_PLAN_REQUIRED'
  | 'MEAL_TIME_NOT_IN_PLAN'
  | 'MEAL_TIME_DUPLICATE'
  | 'MEAL_TIMES_LIMIT_REACHED';

export type EditMealTimeState =
  | { kind: 'ok' }
  | { kind: 'invalid' }
  | { kind: 'forbidden' }
  | { kind: 'unprocessable'; code: MealTimeErrorCode }
  | { kind: 'unauthorized' }
  | { kind: 'error' }
  | { kind: 'unreachable'; message: string }
  | { kind: 'missing-config' };

async function editMealTimeState(
  response: Response,
  okStatus: 200 | 201,
): Promise<EditMealTimeState> {
  if (response.status === okStatus) return { kind: 'ok' };
  if (response.status === 400) return { kind: 'invalid' };
  if (response.status === 403) return { kind: 'forbidden' };
  if (response.status === 401) return { kind: 'unauthorized' };
  if (response.status === 422) {
    const body = await readJson(response);
    const code = isObjectBody(body) ? body.code : undefined;
    if (
      code === 'NUTRITION_PLAN_REQUIRED' ||
      code === 'MEAL_TIME_NOT_IN_PLAN' ||
      code === 'MEAL_TIME_DUPLICATE' ||
      code === 'MEAL_TIMES_LIMIT_REACHED'
    ) {
      return { kind: 'unprocessable', code };
    }
  }
  return { kind: 'error' };
}

export async function addMealTime(
  baseUrl: string | undefined,
  token: string,
  petId: string,
  mealTime: string,
  fetchFn: typeof fetch = fetch,
): Promise<EditMealTimeState> {
  if (!baseUrl) return { kind: 'missing-config' };
  const result = await postJson(
    baseUrl, `/pets/${petId}/meal-times`, token, { mealTime }, fetchFn,
  );
  return result.kind === 'unreachable'
    ? result
    : editMealTimeState(result.response, 201);
}


export async function moveMealTime(
  baseUrl: string | undefined,
  token: string,
  petId: string,
  from: string,
  to: string,
  fetchFn: typeof fetch = fetch,
): Promise<EditMealTimeState> {
  if (!baseUrl) return { kind: 'missing-config' };
  const result = await patchJson(
    baseUrl, `/pets/${petId}/meal-times/${from}`, token, { mealTime: to }, fetchFn,
  );
  return result.kind === 'unreachable'
    ? result
    : editMealTimeState(result.response, 200);
}

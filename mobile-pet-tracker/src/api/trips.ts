import { getJson, readJson } from './http';
import type { TripDetail } from './types';

export type DayRouteState =
  | { kind: 'ok'; date: string; trips: TripDetail[] }
  | { kind: 'no-tracking' }
  | { kind: 'unauthorized' }
  | { kind: 'error' }
  | { kind: 'unreachable'; message: string }
  | { kind: 'missing-config' };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function hasTripIndex(value: unknown): value is { index: number } {
  return isRecord(value) && typeof value.index === 'number';
}

function isTripDetail(value: unknown): value is TripDetail {
  return isRecord(value) && Array.isArray(value.path);
}

export async function getDayRoute(
  baseUrl: string | undefined,
  token: string,
  petId: string,
  fetchFn: typeof fetch = fetch,
): Promise<DayRouteState> {
  if (!baseUrl) {
    return { kind: 'missing-config' };
  }

  const listResult = await getJson(
    baseUrl,
    `/pets/${petId}/trips`,
    token,
    fetchFn,
  );
  if (listResult.kind === 'unreachable') {
    return listResult;
  }

  if (listResult.response.status === 402) {
    return { kind: 'no-tracking' };
  }

  if (listResult.response.status === 401) {
    return { kind: 'unauthorized' };
  }

  if (listResult.response.status !== 200) {
    return { kind: 'error' };
  }

  const listBody = await readJson(listResult.response);
  if (
    !isRecord(listBody) ||
    typeof listBody.date !== 'string' ||
    !Array.isArray(listBody.items) ||
    !listBody.items.every(hasTripIndex)
  ) {
    return { kind: 'error' };
  }

  if (listBody.items.length === 0) {
    return { kind: 'ok', date: listBody.date, trips: [] };
  }

  const detailResults = await Promise.all(
    listBody.items.map(({ index }) =>
      getJson(baseUrl, `/pets/${petId}/trips/${index}`, token, fetchFn),
    ),
  );
  const trips: TripDetail[] = [];

  for (const result of detailResults) {
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
    if (!isRecord(body) || !isTripDetail(body.trip)) {
      return { kind: 'error' };
    }

    trips.push(body.trip);
  }

  trips.sort((left, right) => left.index - right.index);
  return { kind: 'ok', date: listBody.date, trips };
}

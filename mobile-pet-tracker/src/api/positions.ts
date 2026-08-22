import { getJson, readJson } from './http';
import type { LastPosition, StoredPosition } from './types';

export type LastPositionState =
  | { kind: 'ok'; position: LastPosition | null }
  | { kind: 'no-tracking' }
  | { kind: 'unauthorized' }
  | { kind: 'error' }
  | { kind: 'unreachable'; message: string }
  | { kind: 'missing-config' };

export type PositionsState =
  | { kind: 'ok'; items: StoredPosition[]; nextCursor: string | null }
  | { kind: 'no-tracking' }
  | { kind: 'unauthorized' }
  | { kind: 'error' }
  | { kind: 'unreachable'; message: string }
  | { kind: 'missing-config' };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isLastPosition(value: unknown): value is LastPosition {
  return (
    isRecord(value) &&
    typeof value.lat === 'number' &&
    typeof value.lng === 'number'
  );
}

export async function getLastPosition(
  baseUrl: string | undefined,
  token: string,
  petId: string,
  fetchFn: typeof fetch = fetch,
): Promise<LastPositionState> {
  if (!baseUrl) {
    return { kind: 'missing-config' };
  }

  const result = await getJson(
    baseUrl,
    `/pets/${petId}/positions/last`,
    token,
    fetchFn,
  );
  if (result.kind === 'unreachable') {
    return result;
  }

  if (result.response.status === 402) {
    return { kind: 'no-tracking' };
  }

  if (result.response.status === 401) {
    return { kind: 'unauthorized' };
  }

  if (result.response.status !== 200) {
    return { kind: 'error' };
  }

  const body = await readJson(result.response);
  if (body === null) {
    return { kind: 'ok', position: null };
  }

  return isLastPosition(body)
    ? { kind: 'ok', position: body }
    : { kind: 'error' };
}

export async function listPositions(
  baseUrl: string | undefined,
  token: string,
  petId: string,
  fetchFn: typeof fetch = fetch,
): Promise<PositionsState> {
  if (!baseUrl) {
    return { kind: 'missing-config' };
  }

  const result = await getJson(
    baseUrl,
    `/pets/${petId}/positions`,
    token,
    fetchFn,
  );
  if (result.kind === 'unreachable') {
    return result;
  }

  if (result.response.status === 402) {
    return { kind: 'no-tracking' };
  }

  if (result.response.status === 401) {
    return { kind: 'unauthorized' };
  }

  if (result.response.status !== 200) {
    return { kind: 'error' };
  }

  const body = await readJson(result.response);
  if (!isRecord(body) || !Array.isArray(body.items)) {
    return { kind: 'error' };
  }

  return {
    kind: 'ok',
    items: body.items as StoredPosition[],
    nextCursor: typeof body.nextCursor === 'string' ? body.nextCursor : null,
  };
}

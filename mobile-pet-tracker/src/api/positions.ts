import { getJson, readJson } from './http';
import type { LastPosition } from './types';

export type LastPositionState =
  | { kind: 'ok'; position: LastPosition | null }
  | { kind: 'no-tracking' }
  | { kind: 'unauthorized' }
  | { kind: 'error' }
  | { kind: 'unreachable'; message: string }
  | { kind: 'missing-config' };

function isLastPosition(value: unknown): value is LastPosition {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as Record<string, unknown>).lat === 'number' &&
    typeof (value as Record<string, unknown>).lng === 'number'
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

import type { HealthResponse } from './types';

export type HealthState =
  | { kind: 'ok' }
  | { kind: 'error' }
  | { kind: 'unreachable'; message: string }
  | { kind: 'missing-config' };

export function healthUrl(baseUrl: string): string {
  return `${baseUrl.replace(/\/+$/, '')}/health`;
}

export async function fetchHealth(
  baseUrl: string | undefined,
  fetchFn: typeof fetch = fetch,
): Promise<HealthState> {
  const response = await fetchFn(healthUrl(baseUrl!));
  const body = (await response.json()) as HealthResponse;

  return response.status === 200 && body.postgres === 'ok'
    ? { kind: 'ok' }
    : { kind: 'error' };
}

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
  let response: Response;

  try {
    response = await fetchFn(healthUrl(baseUrl!));
  } catch (error) {
    return {
      kind: 'unreachable',
      message: error instanceof Error ? error.message : String(error),
    };
  }

  let body: HealthResponse;

  try {
    body = (await response.json()) as HealthResponse;
  } catch {
    return { kind: 'error' };
  }

  return response.status === 200 && body.postgres === 'ok'
    ? { kind: 'ok' }
    : { kind: 'error' };
}

import { getJson, readJson } from './http';
import type { Alert, AlertStatus } from './types';

export type AlertsState =
  | { kind: 'ok'; items: Alert[]; nextCursor: string | null }
  | { kind: 'unauthorized' }
  | { kind: 'error' }
  | { kind: 'unreachable'; message: string }
  | { kind: 'missing-config' };

export async function listAlerts(
  baseUrl: string | undefined,
  token: string,
  status?: AlertStatus,
  cursor?: string,
  fetchFn: typeof fetch = fetch,
): Promise<AlertsState> {
  if (!baseUrl) return { kind: 'missing-config' };

  const params = new URLSearchParams();
  if (status !== undefined) params.set('status', status);
  if (cursor !== undefined) params.set('cursor', cursor);
  const query = params.toString();
  const result = await getJson(
    baseUrl,
    `/alerts${query ? `?${query}` : ''}`,
    token,
    fetchFn,
  );
  if (result.kind === 'unreachable') return result;
  if (result.response.status === 401) return { kind: 'unauthorized' };
  if (result.response.status !== 200) return { kind: 'error' };

  const body = await readJson(result.response);
  if (
    typeof body !== 'object' ||
    body === null ||
    !Array.isArray((body as { items?: unknown }).items)
  ) {
    return { kind: 'error' };
  }

  return {
    kind: 'ok',
    items: (body as { items: Alert[] }).items,
    nextCursor:
      typeof (body as { nextCursor?: unknown }).nextCursor === 'string'
        ? (body as { nextCursor: string }).nextCursor
        : null,
  };
}

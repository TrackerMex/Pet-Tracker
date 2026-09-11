export type AlertsState =
  | { kind: 'ok'; items: unknown[]; nextCursor: string | null }
  | { kind: 'unauthorized' }
  | { kind: 'error' }
  | { kind: 'unreachable'; message: string }
  | { kind: 'missing-config' };

export async function listAlerts(
  baseUrl: string | undefined,
  token: string,
  status?: string,
  cursor?: string,
  fetchFn: typeof fetch = fetch,
): Promise<AlertsState> {
  void baseUrl;
  void token;
  void status;
  void cursor;
  void fetchFn;
  throw new Error('not implemented');
}

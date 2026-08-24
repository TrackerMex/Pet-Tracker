import { getJson, readJson } from './http';
import type { Reminder } from './types';

export type RemindersState =
  | { kind: 'ok'; reminders: Reminder[] }
  | { kind: 'not-found' }
  | { kind: 'unauthorized' }
  | { kind: 'error' }
  | { kind: 'unreachable'; message: string }
  | { kind: 'missing-config' };

export async function listReminders(
  baseUrl: string | undefined,
  token: string,
  petId: string,
  fetchFn: typeof fetch = fetch,
): Promise<RemindersState> {
  if (!baseUrl) {
    return { kind: 'missing-config' };
  }

  const result = await getJson(
    baseUrl,
    `/pets/${petId}/reminders`,
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
  return Array.isArray(body)
    ? { kind: 'ok', reminders: body as Reminder[] }
    : { kind: 'error' };
}

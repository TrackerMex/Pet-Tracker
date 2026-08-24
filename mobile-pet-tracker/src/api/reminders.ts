import { getJson, postJson, readJson } from './http';
import type { Reminder, ReminderType } from './types';

export type RemindersState =
  | { kind: 'ok'; reminders: Reminder[] }
  | { kind: 'not-found' }
  | { kind: 'unauthorized' }
  | { kind: 'error' }
  | { kind: 'unreachable'; message: string }
  | { kind: 'missing-config' };

export interface CreateReminderInput {
  type: ReminderType;
  title: string;
  dueAt: string;
  advanceMinutes: number;
}

export type CreateReminderState =
  | { kind: 'ok'; reminder: Reminder }
  | { kind: 'invalid' }
  | { kind: 'forbidden' }
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

export async function createReminder(
  baseUrl: string | undefined,
  token: string,
  petId: string,
  input: CreateReminderInput,
  fetchFn: typeof fetch = fetch,
): Promise<CreateReminderState> {
  if (!baseUrl) {
    return { kind: 'missing-config' };
  }

  const body: CreateReminderInput = {
    type: input.type,
    title: input.title,
    dueAt: input.dueAt,
    advanceMinutes: input.advanceMinutes,
  };
  const result = await postJson(
    baseUrl,
    `/pets/${petId}/reminders`,
    token,
    body,
    fetchFn,
  );
  if (result.kind === 'unreachable') {
    return result;
  }

  if (result.response.status === 400) {
    return { kind: 'invalid' };
  }
  if (result.response.status === 403) {
    return { kind: 'forbidden' };
  }
  if (result.response.status === 401) {
    return { kind: 'unauthorized' };
  }
  if (result.response.status !== 201) {
    return { kind: 'error' };
  }

  const responseBody = await readJson(result.response);
  return typeof responseBody === 'object' &&
    responseBody !== null &&
    !Array.isArray(responseBody)
    ? { kind: 'ok', reminder: responseBody as Reminder }
    : { kind: 'error' };
}

import { deleteJson, getJson, patchJson, postJson, readJson } from './http';
import type { Recurrence, Reminder, ReminderType } from './types';

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
  recurrence?: Recurrence;
  recurrenceUntil?: string;
}

export type CreateReminderState =
  | { kind: 'ok'; reminder: Reminder }
  | { kind: 'invalid' }
  | { kind: 'forbidden' }
  | { kind: 'unauthorized' }
  | { kind: 'error' }
  | { kind: 'unreachable'; message: string }
  | { kind: 'missing-config' };

export type DeleteReminderState =
  | { kind: 'ok' }
  | { kind: 'not-found' }
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
    ...(input.recurrence === undefined ? {} : { recurrence: input.recurrence }),
    ...(input.recurrenceUntil === undefined ? {} : { recurrenceUntil: input.recurrenceUntil }),
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

export async function deleteReminder(
  baseUrl: string | undefined,
  token: string,
  petId: string,
  reminderId: string,
  fetchFn: typeof fetch = fetch,
): Promise<DeleteReminderState> {
  if (!baseUrl) {
    return { kind: 'missing-config' };
  }

  const result = await deleteJson(
    baseUrl,
    `/pets/${petId}/reminders/${reminderId}`,
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
    return { kind: 'not-found' };
  }
  if (result.response.status === 403) {
    return { kind: 'forbidden' };
  }
  if (result.response.status === 401) {
    return { kind: 'unauthorized' };
  }
  return { kind: 'error' };
}


export type CancelReminderSeriesState = DeleteReminderState | { kind: 'not-editable' };

export async function cancelReminderSeries(
  baseUrl: string | undefined,
  token: string,
  reminderId: string,
  fetchFn: typeof fetch = fetch,
): Promise<CancelReminderSeriesState> {
  if (!baseUrl) return { kind: 'missing-config' };

  const result = await patchJson(
    baseUrl,
    `/reminders/${reminderId}`,
    token,
    { status: 'cancelled' },
    fetchFn,
  );
  if (result.kind === 'unreachable') return result;

  switch (result.response.status) {
    case 200: return { kind: 'ok' };
    case 404: return { kind: 'not-found' };
    case 409: return { kind: 'not-editable' };
    case 403: return { kind: 'forbidden' };
    case 401: return { kind: 'unauthorized' };
    default: return { kind: 'error' };
  }
}

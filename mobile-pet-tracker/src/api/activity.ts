import { getJson, readJson } from './http';
import type { DayEntry, WeekComparison } from './types';

export type DailyActivityState =
  | { kind: 'ok'; days: DayEntry[]; weekComparison: WeekComparison }
  | { kind: 'no-tracking' }
  | { kind: 'unauthorized' }
  | { kind: 'error' }
  | { kind: 'unreachable'; message: string }
  | { kind: 'missing-config' };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

export async function getDailyActivity(
  baseUrl: string | undefined,
  token: string,
  petId: string,
  fetchFn: typeof fetch = fetch,
): Promise<DailyActivityState> {
  if (!baseUrl) {
    return { kind: 'missing-config' };
  }

  const result = await getJson(
    baseUrl,
    `/pets/${petId}/activity/daily`,
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
  if (!isRecord(body) || !Array.isArray(body.days) || !isRecord(body.weekComparison)) {
    return { kind: 'error' };
  }

  return {
    kind: 'ok',
    days: body.days as DayEntry[],
    weekComparison: body.weekComparison as unknown as WeekComparison,
  };
}

import { postJson } from './http';

export interface PushTokenPayload {
  expoToken: string;
  platform: 'android' | 'ios';
}

export type PushTokenState =
  | { kind: 'ok' }
  | { kind: 'unauthorized' }
  | { kind: 'error' }
  | { kind: 'unreachable'; message: string }
  | { kind: 'missing-config' };

export async function registerPushToken(
  baseUrl: string | undefined,
  token: string,
  pushToken: PushTokenPayload,
  fetchFn: typeof fetch = fetch,
): Promise<PushTokenState> {
  if (!baseUrl) return { kind: 'missing-config' };

  const result = await postJson(
    baseUrl,
    '/me/push-tokens',
    token,
    pushToken,
    fetchFn,
  );
  if (result.kind === 'unreachable') return result;
  if (result.response.status === 401) return { kind: 'unauthorized' };
  if (result.response.status !== 200) return { kind: 'error' };

  return { kind: 'ok' };
}

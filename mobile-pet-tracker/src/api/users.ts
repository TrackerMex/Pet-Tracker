import { getJson, readJson } from './http';

export interface ProfileResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  country: string;
  timezone: string;
  createdAt: string;
  updatedAt: string;
}

export type MeState =
  | { kind: 'ok'; me: ProfileResponse }
  | { kind: 'unauthorized' }
  | { kind: 'error' }
  | { kind: 'unreachable'; message: string }
  | { kind: 'missing-config' };

function isProfileResponse(value: unknown): value is ProfileResponse {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false;
  }

  const user = value as Record<string, unknown>;
  return [
    'id',
    'email',
    'firstName',
    'lastName',
    'phone',
    'country',
    'timezone',
    'createdAt',
    'updatedAt',
  ].every((field) => typeof user[field] === 'string');
}

export async function getMe(
  baseUrl: string | undefined,
  token: string,
  fetchFn: typeof fetch = fetch,
): Promise<MeState> {
  if (!baseUrl) {
    return { kind: 'missing-config' };
  }

  const result = await getJson(baseUrl, '/me', token, fetchFn);
  if (result.kind === 'unreachable') {
    return result;
  }

  if (result.response.status === 401) {
    return { kind: 'unauthorized' };
  }
  if (result.response.status !== 200) {
    return { kind: 'error' };
  }

  const body = await readJson(result.response);
  return isProfileResponse(body) ? { kind: 'ok', me: body } : { kind: 'error' };
}

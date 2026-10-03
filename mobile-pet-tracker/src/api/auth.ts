import type {
  FieldError,
  LoginRequest,
  RegisterRequest,
  ResetPasswordRequest,
  UserResponse,
} from './types';

export type LoginState =
  | { kind: 'ok'; accessToken: string }
  | { kind: 'invalid-credentials' }
  | { kind: 'validation'; errors: FieldError[] }
  | { kind: 'error' }
  | { kind: 'unreachable'; message: string }
  | { kind: 'missing-config' };

export type RegisterState =
  | { kind: 'ok'; user: UserResponse }
  | { kind: 'email-taken' }
  | { kind: 'validation'; errors: FieldError[] }
  | { kind: 'error' }
  | { kind: 'unreachable'; message: string }
  | { kind: 'missing-config' };

export type ResetPasswordState =
  | { kind: 'ok' }
  | { kind: 'invalid-token' }
  | { kind: 'expired' }
  | { kind: 'validation'; errors: FieldError[] }
  | { kind: 'error' }
  | { kind: 'unreachable'; message: string }
  | { kind: 'missing-config' };

type FetchResult =
  | { kind: 'response'; response: Response }
  | { kind: 'unreachable'; message: string };

function apiUrl(baseUrl: string, path: string): string {
  return `${baseUrl.replace(/\/+$/, '')}${path}`;
}

async function postJson(
  baseUrl: string,
  path: string,
  body: unknown,
  fetchFn: typeof fetch,
): Promise<FetchResult> {
  try {
    const response = await fetchFn(apiUrl(baseUrl, path), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    return { kind: 'response', response };
  } catch (error) {
    return {
      kind: 'unreachable',
      message: error instanceof Error ? error.message : String(error),
    };
  }
}

async function readJson(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    return undefined;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isFieldErrors(value: unknown): value is FieldError[] {
  return (
    Array.isArray(value) &&
    value.every(
      (error) =>
        isRecord(error) &&
        typeof error.path === 'string' &&
        typeof error.message === 'string',
    )
  );
}

function validationErrors(body: unknown): FieldError[] | undefined {
  return isRecord(body) && isFieldErrors(body.errors) ? body.errors : undefined;
}

function isUserResponse(value: unknown): value is UserResponse {
  return (
    isRecord(value) &&
    typeof value.id === 'string' &&
    typeof value.email === 'string' &&
    typeof value.firstName === 'string' &&
    typeof value.lastName === 'string' &&
    typeof value.phone === 'string' &&
    typeof value.country === 'string' &&
    typeof value.timezone === 'string' &&
    typeof value.createdAt === 'string'
  );
}

export async function login(
  baseUrl: string | undefined,
  body: LoginRequest,
  fetchFn: typeof fetch = fetch,
): Promise<LoginState> {
  if (!baseUrl) {
    return { kind: 'missing-config' };
  }

  const result = await postJson(baseUrl, '/auth/login', body, fetchFn);
  if (result.kind === 'unreachable') {
    return result;
  }

  if (result.response.status === 401) {
    return { kind: 'invalid-credentials' };
  }

  if (result.response.status !== 200 && result.response.status !== 400) {
    return { kind: 'error' };
  }

  const responseBody = await readJson(result.response);

  if (
    result.response.status === 200 &&
    isRecord(responseBody) &&
    typeof responseBody.access_token === 'string'
  ) {
    return { kind: 'ok', accessToken: responseBody.access_token };
  }

  if (result.response.status === 400) {
    const errors = validationErrors(responseBody);
    if (errors) {
      return { kind: 'validation', errors };
    }
  }

  return { kind: 'error' };
}

export async function register(
  baseUrl: string | undefined,
  body: RegisterRequest,
  fetchFn: typeof fetch = fetch,
): Promise<RegisterState> {
  if (!baseUrl) {
    return { kind: 'missing-config' };
  }

  const result = await postJson(baseUrl, '/auth/register', body, fetchFn);
  if (result.kind === 'unreachable') {
    return result;
  }

  if (result.response.status === 409) {
    return { kind: 'email-taken' };
  }

  if (result.response.status !== 201 && result.response.status !== 400) {
    return { kind: 'error' };
  }

  const responseBody = await readJson(result.response);

  if (result.response.status === 201 && isUserResponse(responseBody)) {
    return { kind: 'ok', user: responseBody };
  }

  if (result.response.status === 400) {
    const errors = validationErrors(responseBody);
    if (errors) {
      return { kind: 'validation', errors };
    }
  }

  return { kind: 'error' };
}

export async function resetPassword(
  baseUrl: string | undefined,
  body: ResetPasswordRequest,
  fetchFn: typeof fetch = fetch,
): Promise<ResetPasswordState> {
  if (!baseUrl) {
    return { kind: 'missing-config' };
  }

  const result = await postJson(
    baseUrl,
    '/auth/reset-password',
    body,
    fetchFn,
  );
  if (result.kind === 'unreachable') {
    return result;
  }

  if (result.response.status === 200) {
    return { kind: 'ok' };
  }

  if (result.response.status === 410) {
    return { kind: 'expired' };
  }

  if (result.response.status === 400) {
    const responseBody = await readJson(result.response);
    const errors = validationErrors(responseBody);

    return errors
      ? { kind: 'validation', errors }
      : { kind: 'invalid-token' };
  }

  return { kind: 'error' };
}

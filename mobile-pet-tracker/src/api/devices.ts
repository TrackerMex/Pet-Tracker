import { deleteJson, postJson, readJson } from './http';
import type { DeviceStatus } from './types';

export interface ClaimDeviceInput {
  petId: string;
  activationCode: string;
}

export type ClaimDeviceState =
  | { kind: 'ok'; device: DeviceStatus }
  | { kind: 'invalid' }
  | { kind: 'not-found' }
  | { kind: 'already-claimed' }
  | { kind: 'pet-has-device' }
  | { kind: 'subscription-required' }
  | { kind: 'forbidden' }
  | { kind: 'unauthorized' }
  | { kind: 'error' }
  | { kind: 'unreachable'; message: string }
  | { kind: 'missing-config' };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isDeviceStatus(value: unknown): value is DeviceStatus {
  return isRecord(value) && 'model' in value && 'esn' in value;
}

export async function claimDevice(
  baseUrl: string | undefined,
  token: string,
  input: ClaimDeviceInput,
  fetchFn: typeof fetch = fetch,
): Promise<ClaimDeviceState> {
  if (!baseUrl) {
    return { kind: 'missing-config' };
  }

  const result = await postJson(baseUrl, '/devices/claim', token, input, fetchFn);
  if (result.kind === 'unreachable') {
    return result;
  }

  const { response } = result;
  if (response.status === 201) {
    const body = await readJson(response);
    return isDeviceStatus(body)
      ? { kind: 'ok', device: body }
      : { kind: 'error' };
  }

  if (response.status === 400) {
    return { kind: 'invalid' };
  }
  if (response.status === 401) {
    return { kind: 'unauthorized' };
  }
  if (response.status === 402) {
    return { kind: 'subscription-required' };
  }
  if (response.status === 403) {
    return { kind: 'forbidden' };
  }

  if (response.status === 404 || response.status === 409) {
    const body = await readJson(response);
    const code = isRecord(body) ? body.code : undefined;

    if (response.status === 404 && code === 'DEVICE_NOT_FOUND') {
      return { kind: 'not-found' };
    }
    if (response.status === 409 && code === 'DEVICE_ALREADY_ASSIGNED') {
      return { kind: 'already-claimed' };
    }
    if (response.status === 409 && code === 'PET_ALREADY_HAS_DEVICE') {
      return { kind: 'pet-has-device' };
    }
  }

  return { kind: 'error' };
}

export type ReleaseDeviceState =
  | { kind: 'ok' }
  | { kind: 'not-assigned' }
  | { kind: 'forbidden' }
  | { kind: 'unauthorized' }
  | { kind: 'error' }
  | { kind: 'unreachable'; message: string }
  | { kind: 'missing-config' };

export async function releaseDevice(
  baseUrl: string | undefined,
  token: string,
  petId: string,
  fetchFn: typeof fetch = fetch,
): Promise<ReleaseDeviceState> {
  if (!baseUrl) {
    return { kind: 'missing-config' };
  }

  const result = await deleteJson(
    baseUrl,
    `/pets/${petId}/device`,
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
    return { kind: 'not-assigned' };
  }
  if (result.response.status === 403) {
    return { kind: 'forbidden' };
  }
  if (result.response.status === 401) {
    return { kind: 'unauthorized' };
  }

  return { kind: 'error' };
}

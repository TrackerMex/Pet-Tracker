import { postJson, readJson } from './http';

export type PhotoContentType = 'image/jpeg' | 'image/png' | 'image/webp';

export type PhotoUploadUrlState =
  | { kind: 'ok'; uploadUrl: string; expiresInSeconds: number }
  | { kind: 'invalid' }
  | { kind: 'not-found' }
  | { kind: 'forbidden' }
  | { kind: 'unauthorized' }
  | { kind: 'error' }
  | { kind: 'unreachable'; message: string }
  | { kind: 'missing-config' };

export type PhotoUploadState =
  | { kind: 'ok' }
  | { kind: 'error' }
  | { kind: 'unreachable'; message: string };

const PHOTO_CONTENT_TYPES = new Set<PhotoContentType>([
  'image/jpeg',
  'image/png',
  'image/webp',
]);

export function resolvePhotoContentType(
  mimeType: string | null | undefined,
  uri: string,
): PhotoContentType | null {
  const normalized = mimeType?.toLowerCase() as PhotoContentType | undefined;
  if (normalized && PHOTO_CONTENT_TYPES.has(normalized)) {
    return normalized;
  }

  const cleanUri = uri.toLowerCase().split(/[?#]/, 1)[0];
  if (cleanUri.endsWith('.jpg') || cleanUri.endsWith('.jpeg')) return 'image/jpeg';
  if (cleanUri.endsWith('.png')) return 'image/png';
  if (cleanUri.endsWith('.webp')) return 'image/webp';
  return null;
}

export async function requestPhotoUploadUrl(
  baseUrl: string | undefined,
  token: string,
  petId: string,
  contentType: PhotoContentType,
  fetchFn: typeof fetch = fetch,
): Promise<PhotoUploadUrlState> {
  if (!baseUrl) {
    return { kind: 'missing-config' };
  }

  const result = await postJson(
    baseUrl,
    `/pets/${petId}/photo-upload-url`,
    token,
    { contentType },
    fetchFn,
  );
  if (result.kind === 'unreachable') {
    return result;
  }

  if (result.response.status === 400) return { kind: 'invalid' };
  if (result.response.status === 401) return { kind: 'unauthorized' };
  if (result.response.status === 403) return { kind: 'forbidden' };
  if (result.response.status === 404) return { kind: 'not-found' };
  if (result.response.status !== 200) return { kind: 'error' };

  const body = await readJson(result.response);
  if (
    typeof body !== 'object' ||
    body === null ||
    typeof (body as Record<string, unknown>).uploadUrl !== 'string' ||
    typeof (body as Record<string, unknown>).expiresInSeconds !== 'number'
  ) {
    return { kind: 'error' };
  }

  return {
    kind: 'ok',
    uploadUrl: (body as Record<string, unknown>).uploadUrl as string,
    expiresInSeconds: (body as Record<string, unknown>).expiresInSeconds as number,
  };
}

export async function uploadPhotoToUrl(
  uploadUrl: string,
  body: Blob,
  contentType: PhotoContentType,
  fetchFn: typeof fetch = fetch,
): Promise<PhotoUploadState> {
  try {
    const response = await fetchFn(uploadUrl, {
      method: 'PUT',
      headers: { 'Content-Type': contentType },
      body,
    });

    return response.status >= 200 && response.status < 300
      ? { kind: 'ok' }
      : { kind: 'error' };
  } catch (error) {
    return {
      kind: 'unreachable',
      message: error instanceof Error ? error.message : String(error),
    };
  }
}

import { getJson, postJson, readJson } from './http';

export interface PetDocument {
  id: string;
  type: string;
  name: string;
  date: string;
  downloadUrl: string;
  vet?: string | null;
}

export type PetDocsState =
  | { kind: 'ok'; docs: PetDocument[] }
  | { kind: 'not-found' }
  | { kind: 'forbidden' }
  | { kind: 'unauthorized' }
  | { kind: 'error' }
  | { kind: 'unreachable'; message: string }
  | { kind: 'missing-config' };

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

function isPetDocument(value: unknown): value is PetDocument {
  if (typeof value !== 'object' || value === null) return false;
  const document = value as Record<string, unknown>;
  return (
    typeof document.id === 'string' &&
    typeof document.type === 'string' &&
    typeof document.name === 'string' &&
    typeof document.date === 'string' &&
    typeof document.downloadUrl === 'string'
  );
}

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
  contentType: PhotoContentType | DocumentContentType,
  fetchFn: typeof fetch = fetch,
): Promise<PhotoUploadState> {
  try {
    const response = await fetchFn(uploadUrl, {
      method: 'PUT',
      headers: { 'Content-Type': contentType },
      body: new Blob([body], { type: contentType }),
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

export async function listPetDocs(
  baseUrl: string | undefined,
  token: string,
  petId: string,
  fetchFn: typeof fetch = fetch,
): Promise<PetDocsState> {
  if (!baseUrl) {
    return { kind: 'missing-config' };
  }

  const result = await getJson(baseUrl, `/pets/${petId}/media`, token, fetchFn);
  if (result.kind === 'unreachable') {
    return result;
  }

  if (result.response.status === 401) return { kind: 'unauthorized' };
  if (result.response.status === 403) return { kind: 'forbidden' };
  if (result.response.status === 404) return { kind: 'not-found' };
  if (result.response.status !== 200) return { kind: 'error' };

  const body = await readJson(result.response);
  return Array.isArray(body) && body.every(isPetDocument)
    ? { kind: 'ok', docs: body }
    : { kind: 'error' };
}


export type DocumentContentType = 'application/pdf' | 'image/jpeg' | 'image/png';

export const DOCUMENT_MAX_BYTES = 10485760;

export interface CreatePetDocumentInput {
  type: string;
  name: string;
  date: string;
  vet?: string;
}

export type CreatePetDocumentState =
  | { kind: 'ok'; documentId: string; uploadUrl: string }
  | { kind: 'invalid' }
  | { kind: 'not-found' }
  | { kind: 'forbidden' }
  | { kind: 'unauthorized' }
  | { kind: 'error' }
  | { kind: 'unreachable'; message: string }
  | { kind: 'missing-config' };

export type ConfirmPetDocumentUploadState =
  | { kind: 'ok' }
  | { kind: 'not-uploaded' }
  | { kind: 'too-large' }
  | { kind: 'not-found' }
  | { kind: 'forbidden' }
  | { kind: 'unauthorized' }
  | { kind: 'error' }
  | { kind: 'unreachable'; message: string }
  | { kind: 'missing-config' };

export function resolveDocumentContentType(
  mimeType: string | undefined,
  fileName: string,
): DocumentContentType | null {
  const normalized = mimeType?.toLowerCase();
  if (normalized === 'application/pdf' || normalized === 'image/jpeg' || normalized === 'image/png') {
    return normalized;
  }
  if (normalized && normalized !== 'application/octet-stream') return null;
  const dot = fileName.lastIndexOf('.');
  if (dot < 0) return null;
  const extension = fileName.slice(dot + 1).toLowerCase();
  if (extension === 'pdf') return 'application/pdf';
  if (extension === 'jpg' || extension === 'jpeg') return 'image/jpeg';
  if (extension === 'png') return 'image/png';
  return null;
}

export async function createPetDocument(
  baseUrl: string | undefined,
  token: string,
  petId: string,
  input: CreatePetDocumentInput,
  fetchFn: typeof fetch = fetch,
): Promise<CreatePetDocumentState> {
  if (!baseUrl) return { kind: 'missing-config' };
  const result = await postJson(baseUrl, `/pets/${petId}/media`, token, input, fetchFn);
  if (result.kind === 'unreachable') return result;
  if (result.response.status === 400) return { kind: 'invalid' };
  if (result.response.status === 401) return { kind: 'unauthorized' };
  if (result.response.status === 403) return { kind: 'forbidden' };
  if (result.response.status === 404) return { kind: 'not-found' };
  if (result.response.status !== 201) return { kind: 'error' };
  const body = await readJson(result.response);
  if (typeof body !== 'object' || body === null) return { kind: 'error' };
  const { document, uploadUrl } = body as Record<string, unknown>;
  if (typeof document !== 'object' || document === null || typeof uploadUrl !== 'string') {
    return { kind: 'error' };
  }
  const { id } = document as Record<string, unknown>;
  return typeof id === 'string'
    ? { kind: 'ok', documentId: id, uploadUrl }
    : { kind: 'error' };
}

export async function confirmPetDocumentUpload(
  baseUrl: string | undefined,
  token: string,
  petId: string,
  documentId: string,
  fetchFn: typeof fetch = fetch,
): Promise<ConfirmPetDocumentUploadState> {
  if (!baseUrl) return { kind: 'missing-config' };
  const result = await postJson(
    baseUrl, `/pets/${petId}/media/${documentId}/confirm`, token, {}, fetchFn,
  );
  if (result.kind === 'unreachable') return result;
  if (result.response.status === 204) return { kind: 'ok' };
  if (result.response.status === 401) return { kind: 'unauthorized' };
  if (result.response.status === 403) return { kind: 'forbidden' };
  if (result.response.status === 404) return { kind: 'not-found' };
  if (result.response.status === 409) {
    const body = await readJson(result.response);
    const code = typeof body === 'object' && body !== null
      ? (body as Record<string, unknown>).code : undefined;
    if (code === 'PET_DOCUMENT_NOT_UPLOADED') return { kind: 'not-uploaded' };
    if (code === 'PET_DOCUMENT_TOO_LARGE') return { kind: 'too-large' };
  }
  return { kind: 'error' };
}

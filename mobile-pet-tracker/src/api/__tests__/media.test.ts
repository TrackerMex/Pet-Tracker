import {
  listPetDocs,
  requestPhotoUploadUrl,
  uploadPhotoToUrl,
} from '../media';

const baseUrl = 'http://example.test/v1/';
const endpoint = 'http://example.test/v1/pets/pet-1/photo-upload-url';

function response(status: number, body: unknown): Response {
  return {
    status,
    json: jest.fn().mockResolvedValue(body),
  } as unknown as Response;
}

describe('R7: media photo upload API', () => {
  it('requests a URL only for the confirmed image content type', async () => {
    const payload = {
      uploadUrl: 'http://localstack.test/upload',
      expiresInSeconds: 600,
    };
    const fetchFn = jest
      .fn()
      .mockResolvedValue(response(200, payload)) as unknown as typeof fetch;

    await expect(
      requestPhotoUploadUrl(baseUrl, 'jwt-token', 'pet-1', 'image/png', fetchFn),
    ).resolves.toEqual({ kind: 'ok', ...payload });
    expect(fetchFn).toHaveBeenCalledWith(endpoint, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer jwt-token',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ contentType: 'image/png' }),
    });
  });

  it.each([
    [400, { kind: 'invalid' }],
    [401, { kind: 'unauthorized' }],
    [403, { kind: 'forbidden' }],
    [404, { kind: 'not-found' }],
    [500, { kind: 'error' }],
  ])('maps request status %s', async (status, expected) => {
    const fetchFn = jest
      .fn()
      .mockResolvedValue(response(status, {})) as unknown as typeof fetch;

    await expect(
      requestPhotoUploadUrl(baseUrl, 'jwt-token', 'pet-1', 'image/jpeg', fetchFn),
    ).resolves.toEqual(expected);
  });

  it('maps malformed, missing-config, and unreachable requests', async () => {
    const malformed = jest
      .fn()
      .mockResolvedValue(response(200, { uploadUrl: 7 })) as unknown as typeof fetch;
    const offline = jest
      .fn()
      .mockRejectedValue(new Error('offline')) as unknown as typeof fetch;

    await expect(
      requestPhotoUploadUrl(baseUrl, 'jwt-token', 'pet-1', 'image/webp', malformed),
    ).resolves.toEqual({ kind: 'error' });
    await expect(
      requestPhotoUploadUrl(undefined, 'jwt-token', 'pet-1', 'image/webp', malformed),
    ).resolves.toEqual({ kind: 'missing-config' });
    await expect(
      requestPhotoUploadUrl(baseUrl, 'jwt-token', 'pet-1', 'image/webp', offline),
    ).resolves.toEqual({ kind: 'unreachable', message: 'offline' });
  });

  it('PUTs the raw body with Content-Type and without Authorization', async () => {
    const body = new Blob(['image bytes'], { type: 'image/png' });
    const fetchFn = jest
      .fn()
      .mockResolvedValue(response(200, undefined)) as unknown as typeof fetch;

    await expect(
      uploadPhotoToUrl(
        'http://localstack.test/upload?signature=abc',
        body,
        'image/png',
        fetchFn,
      ),
    ).resolves.toEqual({ kind: 'ok' });
    expect(fetchFn).toHaveBeenCalledWith(
      'http://localstack.test/upload?signature=abc',
      {
        method: 'PUT',
        headers: { 'Content-Type': 'image/png' },
        body,
      },
    );
  });

  it('maps PUT failures without adding an auth header', async () => {
    const body = new Blob(['bytes']);
    const failed = jest
      .fn()
      .mockResolvedValue(response(500, undefined)) as unknown as typeof fetch;
    const offline = jest
      .fn()
      .mockRejectedValue('network down') as unknown as typeof fetch;

    await expect(
      uploadPhotoToUrl('http://upload.test', body, 'image/jpeg', failed),
    ).resolves.toEqual({ kind: 'error' });
    await expect(
      uploadPhotoToUrl('http://upload.test', body, 'image/jpeg', offline),
    ).resolves.toEqual({ kind: 'unreachable', message: 'network down' });
  });
});

describe('R8: listPetDocs consume el contrato de media-docs-api', () => {
  const docs = [
    {
      id: 'doc-1',
      type: 'Vacunación',
      name: 'Antirrábica',
      date: '2026-07-12',
    },
  ];

  it('gets the ordered media list with the bearer token', async () => {
    const fetchFn = jest
      .fn()
      .mockResolvedValue(response(200, docs)) as unknown as typeof fetch;

    await expect(
      listPetDocs(baseUrl, 'jwt-token', 'pet-1', fetchFn),
    ).resolves.toEqual({ kind: 'ok', docs });
    expect(fetchFn).toHaveBeenCalledWith(
      'http://example.test/v1/pets/pet-1/media',
      { headers: { Authorization: 'Bearer jwt-token' } },
    );
  });

  it.each([
    [401, { kind: 'unauthorized' }],
    [403, { kind: 'forbidden' }],
    [404, { kind: 'not-found' }],
    [500, { kind: 'error' }],
  ])('maps docs status %s', async (status, expected) => {
    const fetchFn = jest
      .fn()
      .mockResolvedValue(response(status, {})) as unknown as typeof fetch;

    await expect(
      listPetDocs(baseUrl, 'jwt-token', 'pet-1', fetchFn),
    ).resolves.toEqual(expected);
  });

  it('rejects malformed collections and maps missing config or network', async () => {
    const malformed = jest
      .fn()
      .mockResolvedValue(response(200, [{ id: 'doc-1', name: null }])) as unknown as typeof fetch;
    const offline = jest
      .fn()
      .mockRejectedValue(new Error('offline')) as unknown as typeof fetch;

    await expect(
      listPetDocs(baseUrl, 'jwt-token', 'pet-1', malformed),
    ).resolves.toEqual({ kind: 'error' });
    await expect(
      listPetDocs(undefined, 'jwt-token', 'pet-1', malformed),
    ).resolves.toEqual({ kind: 'missing-config' });
    await expect(
      listPetDocs(baseUrl, 'jwt-token', 'pet-1', offline),
    ).resolves.toEqual({ kind: 'unreachable', message: 'offline' });
  });
});

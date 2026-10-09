import {
  confirmPetDocumentUpload,
  createPetDocument,
  DOCUMENT_MAX_BYTES,
  listPetDocs,
  resolveDocumentContentType,
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
      downloadUrl: 'http://download.test/doc-1.pdf',
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

describe('#158 R2: API de subida de documentos', () => {
  const input = { type: 'Vacunación', name: 'Antirrábica', date: '2026-10-01', vet: 'Dra. Pérez' };

  it.each([undefined, null, 42])('rechaza downloadUrl %s', async (downloadUrl) => {
    const document = { id: 'doc-1', type: 'Vacunación', name: 'Antirrábica', date: '2026-10-01' };
    const fetchFn = jest.fn().mockResolvedValue(response(200, [
      downloadUrl === undefined ? document : { ...document, downloadUrl },
    ]));
    await expect(listPetDocs(baseUrl, 'jwt-token', 'pet-1', fetchFn)).resolves.toEqual({ kind: 'error' });
  });

  it.each([
    ['application/pdf', 'a.bin', 'application/pdf'],
    ['image/jpeg', 'a.bin', 'image/jpeg'],
    ['image/png', 'a.bin', 'image/png'],
    ['IMAGE/PNG', 'a.bin', 'image/png'],
    ['image/png', 'x.pdf', 'image/png'],
    ['application/octet-stream', 'a.pdf', 'application/pdf'],
    ['APPLICATION/OCTET-STREAM', 'a.png', 'image/png'],
    ['', 'a.pdf', 'application/pdf'],
    ['image/heic', 'a.jpg', null],
    ['text/plain', 'a.png', null],
    [undefined, 'a.pdf', 'application/pdf'],
    [undefined, 'a.jpg', 'image/jpeg'],
    [undefined, 'a.jpeg', 'image/jpeg'],
    [undefined, 'a.png', 'image/png'],
    [undefined, 'A.PNG', 'image/png'],
    [undefined, 'a.pdf?v=1', null],
    [undefined, 'a.pdf#p', null],
    [undefined, 'Factura #12.pdf', 'application/pdf'],
    [undefined, 'informe.v2.pdf', 'application/pdf'],
    ['image/webp', 'a.webp', null],
    [undefined, 'a.heic', null],
    ['text/plain', 'a.txt', null],
    [undefined, 'a', null],
    [undefined, 'apdf', null],
  ] as const)('resuelve %s y %s como %s', (mimeType, fileName, expected) => {
    const actual = resolveDocumentContentType(mimeType, fileName);
    if (expected === null) expect(actual).toBeNull();
    else expect(actual).toBe(expected);
  });

  it('limita el documento a 10485760 bytes', () => {
    expect(DOCUMENT_MAX_BYTES).toBe(10485760);
  });

  it.each([
    { label: 'sin baseUrl', absent: true, status: 201, body: {}, expected: { kind: 'missing-config' } },
    { label: 'fetch rechaza', offline: true, status: 201, body: {}, expected: { kind: 'unreachable', message: 'offline' } },
    { label: '201 válido', status: 201, body: { document: { id: 'doc-2' }, uploadUrl: 'http://upload.test/doc-2' }, expected: { kind: 'ok', documentId: 'doc-2', uploadUrl: 'http://upload.test/doc-2' } },
    { label: '201 sin id string', status: 201, body: { document: { id: 42 }, uploadUrl: 'http://upload.test/doc-2' }, expected: { kind: 'error' } },
    { label: '201 sin URL string', status: 201, body: { document: { id: 'doc-2' } }, expected: { kind: 'error' } },
    { label: '400', status: 400, body: {}, expected: { kind: 'invalid' } },
    { label: '401', status: 401, body: {}, expected: { kind: 'unauthorized' } },
    { label: '403', status: 403, body: {}, expected: { kind: 'forbidden' } },
    { label: '404', status: 404, body: {}, expected: { kind: 'not-found' } },
    { label: '200 con body válido', status: 200, body: { document: { id: 'doc-2' }, uploadUrl: 'http://upload.test/doc-2' }, expected: { kind: 'error' } },
    { label: '500', status: 500, body: {}, expected: { kind: 'error' } },
  ])('crear: $label', async (row) => {
    const fetchFn = jest.fn().mockResolvedValue(response(row.status, row.body));
    if ('offline' in row) fetchFn.mockRejectedValue(new Error('offline'));
    await expect(createPetDocument('absent' in row ? undefined : baseUrl, 'jwt-token', 'pet-1', input, fetchFn)).resolves.toEqual(row.expected);
    if ('absent' in row) expect(fetchFn).not.toHaveBeenCalled();
  });

  it('crear manda POST, bearer y el input JSON exacto', async () => {
    const fetchFn = jest.fn().mockResolvedValue(response(201, { document: { id: 'doc-2' }, uploadUrl: 'http://upload.test/doc-2' }));
    await createPetDocument(baseUrl, 'jwt-token', 'pet-1', input, fetchFn);
    expect(fetchFn).toHaveBeenCalledWith('http://example.test/v1/pets/pet-1/media', {
      method: 'POST',
      headers: { Authorization: 'Bearer jwt-token', 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'Vacunación', name: 'Antirrábica', date: '2026-10-01', vet: 'Dra. Pérez' }),
    });
  });

  it.each([
    { label: 'sin baseUrl', absent: true, status: 204, body: undefined, expected: { kind: 'missing-config' } },
    { label: 'fetch rechaza', offline: true, status: 204, body: undefined, expected: { kind: 'unreachable', message: 'offline' } },
    { label: '204', status: 204, body: undefined, expected: { kind: 'ok' } },
    { label: '409 NOT_UPLOADED', status: 409, body: { code: 'PET_DOCUMENT_NOT_UPLOADED' }, expected: { kind: 'not-uploaded' } },
    { label: '409 TOO_LARGE', status: 409, body: { code: 'PET_DOCUMENT_TOO_LARGE' }, expected: { kind: 'too-large' } },
    { label: '409 otro code', status: 409, body: { code: 'OTHER' }, expected: { kind: 'error' } },
    { label: '409 sin body', status: 409, body: undefined, expected: { kind: 'error' } },
    { label: '401', status: 401, body: undefined, expected: { kind: 'unauthorized' } },
    { label: '403', status: 403, body: undefined, expected: { kind: 'forbidden' } },
    { label: '404', status: 404, body: undefined, expected: { kind: 'not-found' } },
    { label: '200', status: 200, body: undefined, expected: { kind: 'error' } },
    { label: '500', status: 500, body: undefined, expected: { kind: 'error' } },
  ])('confirmar: $label', async (row) => {
    const fetchFn = jest.fn().mockResolvedValue(response(row.status, row.body));
    if ('offline' in row) fetchFn.mockRejectedValue(new Error('offline'));
    await expect(confirmPetDocumentUpload('absent' in row ? undefined : baseUrl, 'jwt-token', 'pet-1', 'doc-2', fetchFn)).resolves.toEqual(row.expected);
    if ('absent' in row) expect(fetchFn).not.toHaveBeenCalled();
  });

  it('confirmar manda POST, bearer y body vacío', async () => {
    const fetchFn = jest.fn().mockResolvedValue(response(204, undefined));
    await confirmPetDocumentUpload(baseUrl, 'jwt-token', 'pet-1', 'doc-2', fetchFn);
    expect(fetchFn).toHaveBeenCalledWith('http://example.test/v1/pets/pet-1/media/doc-2/confirm', {
      method: 'POST',
      headers: { Authorization: 'Bearer jwt-token', 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });
  });

  it('uploadPhotoToUrl manda application/pdf sin Authorization', async () => {
    const body = new Blob(['PDF bytes']);
    const fetchFn = jest.fn().mockResolvedValue(response(200, undefined));
    await expect(uploadPhotoToUrl('http://upload.test/doc-2', body, 'application/pdf', fetchFn)).resolves.toEqual({ kind: 'ok' });
    expect(fetchFn).toHaveBeenCalledWith('http://upload.test/doc-2', {
      method: 'PUT', headers: { 'Content-Type': 'application/pdf' }, body,
    });
    expect(fetchFn.mock.calls[0][1].headers).not.toHaveProperty('Authorization');
  });
});

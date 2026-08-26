import { buildDocumentKey } from './document-key';

describe('R2: buildDocumentKey', () => {
  it('construye pets/<petId>/docs/<documentId> sin I/O', () => {
    const petId = '0198b2c3-4d5e-7a01-b234-56789abcdef0';
    const documentId = '0198b2c3-4d5e-7a01-b234-56789abcdef1';

    expect(buildDocumentKey(petId, documentId)).toBe(
      `pets/${petId}/docs/${documentId}`,
    );
  });
});

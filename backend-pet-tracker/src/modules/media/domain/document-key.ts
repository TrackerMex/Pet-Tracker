export function buildDocumentKey(petId: string, documentId: string): string {
  return `pets/${petId}/docs/${documentId}`;
}

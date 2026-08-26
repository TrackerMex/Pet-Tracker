import type { PetDocument } from '@/modules/media/domain/entities/pet-document.entity';

export interface PetDocumentResponse {
  id: string;
  type: string;
  name: string;
  date: string;
  vet: string | null;
  key: string;
}

export function toPetDocumentResponse(
  document: PetDocument,
): PetDocumentResponse {
  return {
    id: document.id,
    type: document.type,
    name: document.name,
    date: document.date,
    vet: document.vet,
    key: document.key,
  };
}

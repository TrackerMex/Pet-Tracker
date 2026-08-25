import type { PetDocument } from '@/modules/media/domain/entities/pet-document.entity';

export const PET_DOCUMENT_REPOSITORY = Symbol('PetDocumentRepository');

export interface PetDocumentRepository {
  listByPet(petId: string): Promise<PetDocument[]>;
}

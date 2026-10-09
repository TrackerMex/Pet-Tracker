import type { PetDocument } from '@/modules/media/domain/entities/pet-document.entity';

export const PET_DOCUMENT_REPOSITORY = Symbol('PetDocumentRepository');

export interface PetDocumentRepository {
  create(document: PetDocument): Promise<void>;
  listUploadedByPet(petId: string): Promise<PetDocument[]>;
  findByIdAndPet(id: string, petId: string): Promise<PetDocument | null>;
  markUploaded(id: string): Promise<void>;
}

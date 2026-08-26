import { Inject, Injectable } from '@nestjs/common';
import type { PetDocument } from '@/modules/media/domain/entities/pet-document.entity';
import { PET_DOCUMENT_REPOSITORY } from '@/modules/media/domain/repositories/pet-document.repository';
import type { PetDocumentRepository } from '@/modules/media/domain/repositories/pet-document.repository';

@Injectable()
export class ListPetDocumentsUseCase {
  constructor(
    @Inject(PET_DOCUMENT_REPOSITORY)
    private readonly documents: PetDocumentRepository,
  ) {}

  execute(petId: string): Promise<PetDocument[]> {
    return this.documents.listByPet(petId);
  }
}

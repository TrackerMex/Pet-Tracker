import { Inject, Injectable } from '@nestjs/common';
import { PHOTO_STORAGE } from '@/modules/media/domain/ports/photo-storage';
import type { PhotoStorage } from '@/modules/media/domain/ports/photo-storage';
import { PET_DOCUMENT_REPOSITORY } from '@/modules/media/domain/repositories/pet-document.repository';
import type { PetDocumentRepository } from '@/modules/media/domain/repositories/pet-document.repository';

@Injectable()
export class ConfirmPetDocumentUploadUseCase {
  constructor(
    @Inject(PET_DOCUMENT_REPOSITORY)
    private readonly documents: PetDocumentRepository,
    @Inject(PHOTO_STORAGE)
    private readonly storage: PhotoStorage,
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- stub rojo de #157 R5, lo retira el verde
  execute(petId: string, documentId: string): Promise<void> {
    return Promise.reject(
      new Error('ConfirmPetDocumentUploadUseCase not implemented'),
    );
  }
}

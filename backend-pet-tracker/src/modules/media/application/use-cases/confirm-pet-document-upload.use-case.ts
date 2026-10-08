import { Inject, Injectable } from '@nestjs/common';
import {
  PetDocumentNotFoundError,
  PetDocumentNotUploadedError,
} from '@/modules/media/domain/errors/pet-document.errors';
import { PHOTO_STORAGE } from '@/modules/media/domain/ports/photo-storage';
import type { PhotoStorage } from '@/modules/media/domain/ports/photo-storage';
import { PET_DOCUMENT_REPOSITORY } from '@/modules/media/domain/repositories/pet-document.repository';
import type { PetDocumentRepository } from '@/modules/media/domain/repositories/pet-document.repository';

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

@Injectable()
export class ConfirmPetDocumentUploadUseCase {
  constructor(
    @Inject(PET_DOCUMENT_REPOSITORY)
    private readonly documents: PetDocumentRepository,
    @Inject(PHOTO_STORAGE)
    private readonly storage: PhotoStorage,
  ) {}

  async execute(petId: string, documentId: string): Promise<void> {
    if (!UUID_PATTERN.test(documentId)) {
      throw new PetDocumentNotFoundError();
    }
    const document = await this.documents.findByIdAndPet(documentId, petId);
    if (!document) {
      throw new PetDocumentNotFoundError();
    }
    if (document.uploadedAt !== null) return;
    if (!(await this.storage.objectExists(document.key))) {
      throw new PetDocumentNotUploadedError();
    }
    await this.documents.markUploaded(document.id);
  }
}

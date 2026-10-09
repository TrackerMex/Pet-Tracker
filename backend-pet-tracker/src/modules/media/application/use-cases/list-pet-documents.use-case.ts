import { Inject, Injectable } from '@nestjs/common';
import type { PetDocument } from '@/modules/media/domain/entities/pet-document.entity';
import { PHOTO_STORAGE } from '@/modules/media/domain/ports/photo-storage';
import type { PhotoStorage } from '@/modules/media/domain/ports/photo-storage';
import { PET_DOCUMENT_REPOSITORY } from '@/modules/media/domain/repositories/pet-document.repository';
import type { PetDocumentRepository } from '@/modules/media/domain/repositories/pet-document.repository';

export const DOCUMENT_DOWNLOAD_URL_EXPIRES_IN_SECONDS = 3600;

export interface PetDocumentListItem {
  document: PetDocument;
  downloadUrl: string;
}

@Injectable()
export class ListPetDocumentsUseCase {
  constructor(
    @Inject(PET_DOCUMENT_REPOSITORY)
    private readonly documents: PetDocumentRepository,
    @Inject(PHOTO_STORAGE)
    private readonly storage: PhotoStorage,
  ) {}

  async execute(petId: string): Promise<PetDocumentListItem[]> {
    const documents = await this.documents.listUploadedByPet(petId);
    const items: PetDocumentListItem[] = [];
    await Promise.all(
      documents.map(async (document) => {
        const downloadUrl = await this.storage.createDownloadUrl(
          document.key,
          DOCUMENT_DOWNLOAD_URL_EXPIRES_IN_SECONDS,
        );
        items.push({ document, downloadUrl });
      }),
    );
    return items;
  }
}

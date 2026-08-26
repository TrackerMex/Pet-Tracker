import { Inject, Injectable } from '@nestjs/common';
import { uuidv7 } from 'uuidv7';
import { AUDIT_LOGGER } from '@/audit/audit-log.repository';
import type { AuditLogger } from '@/audit/audit-log.repository';
import type { CreatePetDocumentDto } from '@/modules/media/application/dto/create-pet-document.dto';
import { buildDocumentKey } from '@/modules/media/domain/document-key';
import type { PetDocument } from '@/modules/media/domain/entities/pet-document.entity';
import { PHOTO_STORAGE } from '@/modules/media/domain/ports/photo-storage';
import type { PhotoStorage } from '@/modules/media/domain/ports/photo-storage';
import { PET_DOCUMENT_REPOSITORY } from '@/modules/media/domain/repositories/pet-document.repository';
import type { PetDocumentRepository } from '@/modules/media/domain/repositories/pet-document.repository';

export const DOCUMENT_UPLOAD_URL_EXPIRES_IN_SECONDS = 600;

export interface PetDocumentUpload {
  document: PetDocument;
  uploadUrl: string;
  expiresInSeconds: number;
}

@Injectable()
export class CreatePetDocumentUseCase {
  constructor(
    @Inject(PET_DOCUMENT_REPOSITORY)
    private readonly documents: PetDocumentRepository,
    @Inject(PHOTO_STORAGE)
    private readonly storage: PhotoStorage,
    @Inject(AUDIT_LOGGER)
    private readonly auditLogger: AuditLogger,
  ) {}

  async execute(
    petId: string,
    userId: string,
    dto: CreatePetDocumentDto,
  ): Promise<PetDocumentUpload> {
    const id = uuidv7();
    const key = buildDocumentKey(petId, id);
    const document: PetDocument = {
      id,
      petId,
      type: dto.type,
      name: dto.name,
      date: dto.date,
      vet: dto.vet ?? null,
      key,
      createdBy: userId,
    };

    await this.documents.create(document);
    const uploadUrl = await this.storage.createUploadUrl(
      key,
      DOCUMENT_UPLOAD_URL_EXPIRES_IN_SECONDS,
    );
    await this.auditLogger.record({
      userId,
      action: 'pet.document_add',
      entity: 'pet',
      entityId: petId,
      meta: { key },
    });

    return {
      document,
      uploadUrl,
      expiresInSeconds: DOCUMENT_UPLOAD_URL_EXPIRES_IN_SECONDS,
    };
  }
}

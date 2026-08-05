import { Inject, Injectable } from '@nestjs/common';
import { AUDIT_LOGGER } from '@/audit/audit-log.repository';
import type { AuditLogger } from '@/audit/audit-log.repository';
import { PET_REPOSITORY } from '@/modules/pets/domain/repositories/pet.repository';
import type { PetRepository } from '@/modules/pets/domain/repositories/pet.repository';
import { buildPhotoKey } from '../../domain/photo-key';
import { PHOTO_STORAGE } from '../../domain/ports/photo-storage';
import type { PhotoStorage } from '../../domain/ports/photo-storage';

/** Vigencia del PUT prefirmado (R1): exactamente 10 minutos. */
export const PHOTO_UPLOAD_URL_EXPIRES_IN_SECONDS = 600;

export interface PhotoUploadUrl {
  uploadUrl: string;
  expiresInSeconds: number;
}

/**
 * POST /v1/pets/:petId/photo-upload-url (R1, R5). La validacion del
 * contentType (R2) ya corrio en el borde HTTP — este caso de uso no la
 * repite ni usa el contentType (D3): genera la clave, la persiste y firma
 * el PUT. Auditoria solo tras exito (R5); un error propagado desde el
 * repositorio o el storage deja la transaccion sin auditar.
 */
@Injectable()
export class RequestPhotoUploadUrlUseCase {
  constructor(
    @Inject(PET_REPOSITORY)
    private readonly pets: PetRepository,
    @Inject(PHOTO_STORAGE)
    private readonly photoStorage: PhotoStorage,
    @Inject(AUDIT_LOGGER)
    private readonly auditLogger: AuditLogger,
  ) {}

  async execute(
    petId: string,
    userId: string,
    now: Date = new Date(),
  ): Promise<PhotoUploadUrl> {
    const key = buildPhotoKey(petId, now);

    await this.pets.update(petId, { photoKey: key });

    const uploadUrl = await this.photoStorage.createUploadUrl(
      key,
      PHOTO_UPLOAD_URL_EXPIRES_IN_SECONDS,
    );

    await this.auditLogger.record({
      userId,
      action: 'pet.photo_update',
      entity: 'pet',
      entityId: petId,
      meta: { key },
    });

    return { uploadUrl, expiresInSeconds: PHOTO_UPLOAD_URL_EXPIRES_IN_SECONDS };
  }
}

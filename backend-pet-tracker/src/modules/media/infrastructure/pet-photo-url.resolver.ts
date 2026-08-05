import { Inject, Injectable } from '@nestjs/common';
import type { PetPhotoUrlResolver } from '@/modules/pets/domain/ports/pet-photo-url-resolver';
import { PHOTO_STORAGE } from '../domain/ports/photo-storage';
import type { PhotoStorage } from '../domain/ports/photo-storage';

/**
 * Implementacion del puerto PET_PHOTO_URL_RESOLVER de pets (R6). Vive en
 * media porque el storage es suyo, pero solo depende de PHOTO_STORAGE — se
 * registra en PetPhotoReadModule para que PetsModule la importe sin ciclo
 * (mismo mecanismo que PetDeviceDrizzleReader en devices).
 */
@Injectable()
export class PetPhotoUrlResolverImpl implements PetPhotoUrlResolver {
  constructor(
    @Inject(PHOTO_STORAGE) private readonly photoStorage: PhotoStorage,
  ) {}

  resolveDownloadUrl(
    photoKey: string,
    expiresInSeconds: number,
  ): Promise<string> {
    return this.photoStorage.createDownloadUrl(photoKey, expiresInSeconds);
  }
}

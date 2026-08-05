import { Module } from '@nestjs/common';
import { PET_PHOTO_URL_RESOLVER } from '@/modules/pets/domain/ports/pet-photo-url-resolver';
import { PHOTO_STORAGE } from './domain/ports/photo-storage';
import { PetPhotoUrlResolverImpl } from './infrastructure/pet-photo-url.resolver';
import { PhotoStorageS3Adapter } from './infrastructure/photo-storage.s3.adapter';

/**
 * Sub-modulo de solo lectura para la clave `photoUrl` del perfil (R6).
 * Depende unicamente de S3_CLIENT (@Global, de AwsModule) — NO importa
 * PetsModule ni MediaModule, asi el grafo queda aciclico:
 * MediaModule -> PetsModule -> PetPhotoReadModule y MediaModule ->
 * PetPhotoReadModule directamente (mismo mecanismo que PetDeviceReadModule).
 */
@Module({
  providers: [
    { provide: PHOTO_STORAGE, useClass: PhotoStorageS3Adapter },
    { provide: PET_PHOTO_URL_RESOLVER, useClass: PetPhotoUrlResolverImpl },
  ],
  exports: [PET_PHOTO_URL_RESOLVER, PHOTO_STORAGE],
})
export class PetPhotoReadModule {}

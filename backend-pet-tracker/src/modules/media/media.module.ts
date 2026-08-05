import { Module } from '@nestjs/common';
import { PetsModule } from '@/modules/pets/pets.module';
import { RequestPhotoUploadUrlUseCase } from './application/use-cases/request-photo-upload-url.use-case';
import { MediaController } from './infrastructure/media.controller';
import { PetPhotoReadModule } from './pet-photo-read.module';

/**
 * Fotos de mascota via S3 prefirmado (pet-photos-s3 #6). Importa PetsModule
 * por PET_REPOSITORY/PetAccessGuard (mismo mecanismo de reutilizacion que
 * DevicesModule) y PetPhotoReadModule por PHOTO_STORAGE. AUDIT_LOGGER y
 * S3_CLIENT los resuelven AuditModule/AwsModule (@Global()).
 */
@Module({
  imports: [PetsModule, PetPhotoReadModule],
  controllers: [MediaController],
  providers: [RequestPhotoUploadUrlUseCase],
})
export class MediaModule {}

import { Module } from '@nestjs/common';
import { CreatePetDocumentUseCase } from '@/modules/media/application/use-cases/create-pet-document.use-case';
import { ListPetDocumentsUseCase } from '@/modules/media/application/use-cases/list-pet-documents.use-case';
import { PET_DOCUMENT_REPOSITORY } from '@/modules/media/domain/repositories/pet-document.repository';
import { PetMediaController } from '@/modules/media/infrastructure/pet-media.controller';
import { PetDocumentDrizzleRepository } from '@/modules/media/infrastructure/repositories/pet-document.drizzle.repository';
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
  controllers: [MediaController, PetMediaController],
  providers: [
    RequestPhotoUploadUrlUseCase,
    CreatePetDocumentUseCase,
    ListPetDocumentsUseCase,
    {
      provide: PET_DOCUMENT_REPOSITORY,
      useClass: PetDocumentDrizzleRepository,
    },
  ],
})
export class MediaModule {}

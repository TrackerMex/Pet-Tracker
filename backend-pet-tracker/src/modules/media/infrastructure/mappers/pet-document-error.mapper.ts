import {
  ConflictException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import {
  PetDocumentNotFoundError,
  PetDocumentNotUploadedError,
} from '@/modules/media/domain/errors/pet-document.errors';

export function mapPetDocumentError(error: unknown): unknown {
  if (error instanceof PetDocumentNotFoundError) {
    return new NotFoundException({
      statusCode: HttpStatus.NOT_FOUND,
      code: 'PET_DOCUMENT_NOT_FOUND',
      message: 'Pet document not found',
    });
  }
  if (error instanceof PetDocumentNotUploadedError) {
    return new ConflictException({
      statusCode: HttpStatus.CONFLICT,
      code: 'PET_DOCUMENT_NOT_UPLOADED',
      message: 'Pet document file not found in storage',
    });
  }
  return error;
}

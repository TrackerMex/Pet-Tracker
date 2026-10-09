import { ConflictException } from '@nestjs/common';
import { PetDocumentTooLargeError } from '@/modules/media/domain/errors/pet-document.errors';
import { mapPetDocumentError } from './pet-document-error.mapper';

describe('#161 R2: mapPetDocumentError traduce PetDocumentTooLargeError a 409', () => {
  it('#161 R2 (b): devuelve ConflictException 409 con code PET_DOCUMENT_TOO_LARGE', () => {
    const mapped = mapPetDocumentError(new PetDocumentTooLargeError());

    expect(mapped).toBeInstanceOf(ConflictException);
    expect((mapped as ConflictException).getStatus()).toBe(409);
    expect((mapped as ConflictException).getResponse()).toEqual({
      statusCode: 409,
      code: 'PET_DOCUMENT_TOO_LARGE',
      message: 'Pet document file exceeds the size limit',
    });
  });
});

describe('#161 R3: mapPetDocumentError devuelve por identidad un error desconocido', () => {
  it('#161 R3: devuelve el mismo Error sin traducirlo', () => {
    const missing = new Error('HeadObject response has no ContentLength');

    expect(mapPetDocumentError(missing)).toBe(missing);
  });
});

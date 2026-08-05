import { AuditLogger } from '@/audit/audit-log.repository';
import { PetRepository } from '@/modules/pets/domain/repositories/pet.repository';
import { PhotoStorage } from '../../domain/ports/photo-storage';
import {
  PHOTO_UPLOAD_URL_EXPIRES_IN_SECONDS,
  RequestPhotoUploadUrlUseCase,
} from './request-photo-upload-url.use-case';

const PET_ID = '0198b2c3-4d5e-7a01-b234-56789abcdef0';
const USER_ID = '0198b2c3-4d5e-7a01-b234-56789abcdef1';
const NOW = new Date('2026-08-05T10:00:00.000Z');

function buildDeps() {
  const update = jest.fn().mockResolvedValue(undefined);
  const createUploadUrl = jest
    .fn()
    .mockResolvedValue('https://example.local/signed-put-url');
  const record = jest.fn().mockResolvedValue(undefined);

  const pets = { update } as unknown as PetRepository;
  const photoStorage: PhotoStorage = {
    createUploadUrl,
    createDownloadUrl: jest.fn(),
  };
  const auditLogger: AuditLogger = { record };

  return { pets, photoStorage, auditLogger, update, createUploadUrl, record };
}

describe('R1: RequestPhotoUploadUrlUseCase persiste la clave y emite un PUT prefirmado de 10 min', () => {
  it('persiste photoKey via PET_REPOSITORY.update y pide la URL a PHOTO_STORAGE con 600s', async () => {
    const deps = buildDeps();
    const useCase = new RequestPhotoUploadUrlUseCase(
      deps.pets,
      deps.photoStorage,
      deps.auditLogger,
    );

    const result = await useCase.execute(PET_ID, USER_ID, NOW);

    const expectedKey = `pets/${PET_ID}/photo-${NOW.getTime()}`;
    expect(deps.update).toHaveBeenCalledWith(PET_ID, { photoKey: expectedKey });
    expect(deps.createUploadUrl).toHaveBeenCalledWith(
      expectedKey,
      PHOTO_UPLOAD_URL_EXPIRES_IN_SECONDS,
    );
    expect(result).toEqual({
      uploadUrl: 'https://example.local/signed-put-url',
      expiresInSeconds: 600,
    });
  });
});

describe('R5: registra pet.photo_update en AuditLogger solo cuando la peticion tiene exito', () => {
  it('audita con action, entity, entityId, userId y meta.key', async () => {
    const deps = buildDeps();
    const useCase = new RequestPhotoUploadUrlUseCase(
      deps.pets,
      deps.photoStorage,
      deps.auditLogger,
    );

    await useCase.execute(PET_ID, USER_ID, NOW);

    const expectedKey = `pets/${PET_ID}/photo-${NOW.getTime()}`;
    expect(deps.record).toHaveBeenCalledWith({
      userId: USER_ID,
      action: 'pet.photo_update',
      entity: 'pet',
      entityId: PET_ID,
      meta: { key: expectedKey },
    });
  });
});

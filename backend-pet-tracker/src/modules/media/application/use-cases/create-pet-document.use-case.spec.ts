import type { AuditLogger } from '@/audit/audit-log.repository';
import type { PetDocumentRepository } from '@/modules/media/domain/repositories/pet-document.repository';
import type { PhotoStorage } from '@/modules/media/domain/ports/photo-storage';
import {
  CreatePetDocumentUseCase,
  DOCUMENT_UPLOAD_URL_EXPIRES_IN_SECONDS,
} from './create-pet-document.use-case';

const PET_ID = '0198b2c3-4d5e-7a01-b234-56789abcdef0';
const USER_ID = '0198b2c3-4d5e-7a01-b234-56789abcdef1';

function buildDeps() {
  const events: string[] = [];
  const create = jest.fn().mockImplementation(() => {
    events.push('create');
    return Promise.resolve();
  });
  const createUploadUrl = jest.fn().mockImplementation(() => {
    events.push('sign');
    return Promise.resolve('https://example.local/signed-document-put');
  });
  const record = jest.fn().mockImplementation(() => {
    events.push('audit');
    return Promise.resolve();
  });
  const documents = {
    create,
    listByPet: jest.fn(),
  } as unknown as PetDocumentRepository;
  const storage: PhotoStorage = {
    createUploadUrl,
    createDownloadUrl: jest.fn(),
  };
  const auditLogger: AuditLogger = { record };

  return {
    documents,
    storage,
    auditLogger,
    create,
    createUploadUrl,
    record,
    events,
  };
}

describe('R2: CreatePetDocumentUseCase persiste, firma y audita', () => {
  it('genera UUIDv7/key, persiste antes de firmar 600s y audita tras éxito', async () => {
    const deps = buildDeps();
    const useCase = new CreatePetDocumentUseCase(
      deps.documents,
      deps.storage,
      deps.auditLogger,
    );

    const result = await useCase.execute(PET_ID, USER_ID, {
      type: 'Vacunación',
      name: 'Cartilla anual',
      date: '2026-08-25',
    });

    expect(result.document.id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[0-9a-f]{4}-[0-9a-f]{12}$/,
    );
    const expectedKey = `pets/${PET_ID}/docs/${result.document.id}`;
    expect(result).toEqual({
      document: {
        id: result.document.id,
        petId: PET_ID,
        type: 'Vacunación',
        name: 'Cartilla anual',
        date: '2026-08-25',
        vet: null,
        key: expectedKey,
        createdBy: USER_ID,
      },
      uploadUrl: 'https://example.local/signed-document-put',
      expiresInSeconds: 600,
    });
    expect(deps.create).toHaveBeenCalledWith(result.document);
    expect(deps.createUploadUrl).toHaveBeenCalledWith(
      expectedKey,
      DOCUMENT_UPLOAD_URL_EXPIRES_IN_SECONDS,
    );
    expect(deps.record).toHaveBeenCalledWith({
      userId: USER_ID,
      action: 'pet.document_add',
      entity: 'pet',
      entityId: PET_ID,
      meta: { key: expectedKey },
    });
    expect(deps.events).toEqual(['create', 'sign', 'audit']);
  });

  it('no audita si falla la persistencia o la firma', async () => {
    const persistFailure = buildDeps();
    persistFailure.create.mockRejectedValueOnce(new Error('postgres down'));
    await expect(
      new CreatePetDocumentUseCase(
        persistFailure.documents,
        persistFailure.storage,
        persistFailure.auditLogger,
      ).execute(PET_ID, USER_ID, {
        type: 'Consulta',
        name: 'Control',
        date: '2026-08-25',
        vet: 'Dra. Rivera',
      }),
    ).rejects.toThrow('postgres down');
    expect(persistFailure.createUploadUrl).not.toHaveBeenCalled();
    expect(persistFailure.record).not.toHaveBeenCalled();

    const storageFailure = buildDeps();
    storageFailure.createUploadUrl.mockRejectedValueOnce(new Error('s3 down'));
    await expect(
      new CreatePetDocumentUseCase(
        storageFailure.documents,
        storageFailure.storage,
        storageFailure.auditLogger,
      ).execute(PET_ID, USER_ID, {
        type: 'Consulta',
        name: 'Control',
        date: '2026-08-25',
      }),
    ).rejects.toThrow('s3 down');
    expect(storageFailure.create).toHaveBeenCalledTimes(1);
    expect(storageFailure.record).not.toHaveBeenCalled();
  });
});

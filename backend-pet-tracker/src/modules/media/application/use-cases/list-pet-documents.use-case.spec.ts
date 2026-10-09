import type { PetDocument } from '@/modules/media/domain/entities/pet-document.entity';
import type { PhotoStorage } from '@/modules/media/domain/ports/photo-storage';
import type { PetDocumentRepository } from '@/modules/media/domain/repositories/pet-document.repository';
import { ListPetDocumentsUseCase } from './list-pet-documents.use-case';

const PET_ID = '0198b2c3-4d5e-7a01-b234-56789abcdef0';
const USER_ID = '0198b2c3-4d5e-7a01-b234-56789abcdef1';

function document(id: string, date: string): PetDocument {
  return {
    id,
    petId: PET_ID,
    type: 'Vacunación',
    name: `Documento ${id}`,
    date,
    vet: null,
    key: `pets/${PET_ID}/docs/${id}`,
    uploadedAt: new Date(),
    createdBy: USER_ID,
  };
}

describe('#157 R3: ListPetDocumentsUseCase delega en listUploadedByPet', () => {
  it('#157 R3: pide al repositorio solo los documentos subidos de la mascota', async () => {
    const expected = [
      document('0198b2c3-4d5e-7a01-b234-56789abcde02', '2026-08-25'),
      document('0198b2c3-4d5e-7a01-b234-56789abcde01', '2026-08-24'),
    ];
    const listUploadedByPet = jest.fn().mockResolvedValue(expected);
    const documents = { listUploadedByPet } as unknown as PetDocumentRepository;

    const storage = { createDownloadUrl: jest.fn() } as unknown as PhotoStorage;
    await new ListPetDocumentsUseCase(documents, storage).execute(PET_ID);
    expect(listUploadedByPet).toHaveBeenCalledTimes(1);
    expect(listUploadedByPet).toHaveBeenCalledWith(PET_ID);
  });
});

describe('#157 R4: ListPetDocumentsUseCase firma una URL de lectura de 3600 s por documento', () => {
  it('#157 R4: firma cada key con createDownloadUrl(key, 3600) y devuelve {document, downloadUrl} en el orden del repositorio', async () => {
    const a = document('0198b2c3-4d5e-7a01-b234-56789abcde02', '2026-08-25');
    const b = document('0198b2c3-4d5e-7a01-b234-56789abcde01', '2026-08-24');
    const keyA = a.key;
    const keyB = b.key;
    const listUploadedByPet = jest.fn().mockResolvedValue([a, b]);
    const documents = { listUploadedByPet } as unknown as PetDocumentRepository;
    const createDownloadUrl = jest
      .fn<Promise<string>, [string, number]>()
      .mockImplementation((key) => Promise.resolve(`signed:${key}`));
    const storage = { createDownloadUrl } as unknown as PhotoStorage;

    const result = await new ListPetDocumentsUseCase(
      documents,
      storage,
    ).execute(PET_ID);

    expect(createDownloadUrl.mock.calls).toEqual([
      [keyA, 3600],
      [keyB, 3600],
    ]);
    expect(result).toEqual([
      { document: a, downloadUrl: `signed:${keyA}` },
      { document: b, downloadUrl: `signed:${keyB}` },
    ]);
  });
});

describe('#162 R2: ListPetDocumentsUseCase conserva el orden del repositorio aunque las URLs resuelvan al revés', () => {
  it('#162 R2: la URL del segundo documento resuelve antes que la del primero y la lista sigue a, b', async () => {
    const a = document('0198b2c3-4d5e-7a01-b234-56789abcde02', '2026-08-25');
    const b = document('0198b2c3-4d5e-7a01-b234-56789abcde01', '2026-08-24');
    const listUploadedByPet = jest.fn().mockResolvedValue([a, b]);
    const documents = { listUploadedByPet } as unknown as PetDocumentRepository;
    let releaseA: (url: string) => void = () => undefined;
    let releaseB: (url: string) => void = () => undefined;
    const createDownloadUrl = jest
      .fn<Promise<string>, [string, number]>()
      .mockImplementation(
        (key) =>
          new Promise<string>((resolve) => {
            if (key === a.key) releaseA = resolve;
            else releaseB = resolve;
          }),
      );
    const storage = { createDownloadUrl } as unknown as PhotoStorage;
    const drain = () => new Promise((resolve) => setImmediate(resolve));
    const pending = new ListPetDocumentsUseCase(documents, storage).execute(
      PET_ID,
    );

    await drain();
    expect(createDownloadUrl.mock.calls).toEqual([
      [a.key, 3600],
      [b.key, 3600],
    ]);
    releaseB(`signed:${b.key}`);
    await drain();
    releaseA(`signed:${a.key}`);
    await expect(pending).resolves.toEqual([
      { document: a, downloadUrl: `signed:${a.key}` },
      { document: b, downloadUrl: `signed:${b.key}` },
    ]);
  });
});

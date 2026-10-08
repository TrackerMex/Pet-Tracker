import type { PetDocument } from '@/modules/media/domain/entities/pet-document.entity';
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

    await expect(
      new ListPetDocumentsUseCase(documents).execute(PET_ID),
    ).resolves.toBe(expected);
    expect(listUploadedByPet).toHaveBeenCalledTimes(1);
    expect(listUploadedByPet).toHaveBeenCalledWith(PET_ID);
  });
});

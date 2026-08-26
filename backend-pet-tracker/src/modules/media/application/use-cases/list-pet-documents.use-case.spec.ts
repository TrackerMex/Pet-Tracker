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
    createdBy: USER_ID,
  };
}

describe('R1: ListPetDocumentsUseCase delega en listByPet', () => {
  it('devuelve sin alterar la lista ordenada por el repositorio', async () => {
    const expected = [
      document('0198b2c3-4d5e-7a01-b234-56789abcde02', '2026-08-25'),
      document('0198b2c3-4d5e-7a01-b234-56789abcde01', '2026-08-24'),
    ];
    const listByPet = jest.fn().mockResolvedValue(expected);
    const documents = { listByPet } as unknown as PetDocumentRepository;

    await expect(
      new ListPetDocumentsUseCase(documents).execute(PET_ID),
    ).resolves.toBe(expected);
    expect(listByPet).toHaveBeenCalledTimes(1);
    expect(listByPet).toHaveBeenCalledWith(PET_ID);
  });
});

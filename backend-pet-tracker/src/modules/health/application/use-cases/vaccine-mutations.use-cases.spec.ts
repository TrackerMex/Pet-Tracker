import { PetVaccine } from '@/modules/health/domain/entities/vaccine.entity';
import type { VaccineRepository } from '@/modules/health/domain/repositories/vaccine.repository';
import type { PetRepository } from '@/modules/pets/domain/repositories/pet.repository';
import { CreateVaccineUseCase } from './create-vaccine.use-case';
import { DeleteVaccineUseCase } from './delete-vaccine.use-case';
import { UpdateVaccineUseCase } from './update-vaccine.use-case';

const PET_ID = '0198b2c3-4d5e-7a01-b234-56789abcdef0';
const USER_ID = '0198a1f0-3d5c-7f21-b0a1-6f1c9e2d4b77';
const VACCINE_ID = '0198dead-beef-7c23-d456-789abcdef012';

function vaccine() {
  return new PetVaccine({
    id: VACCINE_ID,
    petId: PET_ID,
    catalogId: null,
    name: 'Manual',
    appliedAt: '2025-01-01',
    nextDoseAt: null,
    vetName: null,
    clinic: null,
    notes: null,
    documentKey: null,
  });
}

describe('R12: una escritura fallida nunca se audita', () => {
  it('create no audita si el INSERT falla', async () => {
    const create = jest.fn().mockRejectedValue(new Error('insert failed'));
    const record = jest.fn();
    const useCase = new CreateVaccineUseCase(
      { create } as unknown as VaccineRepository,
      {} as PetRepository,
      { record },
    );

    await expect(
      useCase.execute(
        PET_ID,
        { name: 'Manual', appliedAt: '2025-01-01' },
        USER_ID,
      ),
    ).rejects.toThrow('insert failed');
    expect(record).not.toHaveBeenCalled();
  });

  it('update no audita si el UPDATE falla', async () => {
    const update = jest.fn().mockRejectedValue(new Error('update failed'));
    const record = jest.fn();
    const useCase = new UpdateVaccineUseCase(
      {
        findByIdAndPet: jest.fn().mockResolvedValue(vaccine()),
        update,
      } as unknown as VaccineRepository,
      { record },
    );

    await expect(
      useCase.execute(PET_ID, VACCINE_ID, { name: 'Nueva' }, USER_ID),
    ).rejects.toThrow('update failed');
    expect(record).not.toHaveBeenCalled();
  });

  it('delete no audita si el DELETE falla', async () => {
    const remove = jest.fn().mockRejectedValue(new Error('delete failed'));
    const record = jest.fn();
    const useCase = new DeleteVaccineUseCase(
      {
        findByIdAndPet: jest.fn().mockResolvedValue(vaccine()),
        delete: remove,
      } as unknown as VaccineRepository,
      { record },
    );

    await expect(useCase.execute(PET_ID, VACCINE_ID, USER_ID)).rejects.toThrow(
      'delete failed',
    );
    expect(record).not.toHaveBeenCalled();
  });
});

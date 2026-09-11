import { PetVaccine } from '@/modules/health/domain/entities/vaccine.entity';
import type { VaccineRepository } from '@/modules/health/domain/repositories/vaccine.repository';
import type { PetRepository } from '@/modules/pets/domain/repositories/pet.repository';
import { CreateVaccineUseCase } from './create-vaccine.use-case';
import { DeleteVaccineUseCase } from './delete-vaccine.use-case';
import { UpdateVaccineUseCase } from './update-vaccine.use-case';

const PET_ID = '0198b2c3-4d5e-7a01-b234-56789abcdef0';
const USER_ID = '0198a1f0-3d5c-7f21-b0a1-6f1c9e2d4b77';
const VACCINE_ID = '0198dead-beef-7c23-d456-789abcdef012';
const NOW_CDMX_EVENING = new Date('2026-08-11T02:00:00.000Z');
const NOW_KIRITIMATI_MORNING = new Date('2026-08-10T20:00:00.000Z');

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
      {
        findOwnerTimezone: jest.fn().mockResolvedValue('UTC'),
      } as unknown as PetRepository,
      { record },
    );

    await expect(
      useCase.execute(
        PET_ID,
        { name: 'Manual', appliedAt: '2025-01-01' },
        USER_ID,
        NOW_CDMX_EVENING,
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

describe('R1 (vaccine-applied-at-owner-timezone #88): create compara appliedAt con el dia civil del owner, no con el dia UTC', () => {
  let created: PetVaccine;
  let create: jest.Mock;
  let findOwnerTimezone: jest.Mock;
  let record: jest.Mock;
  let useCase: CreateVaccineUseCase;

  beforeEach(() => {
    created = vaccine();
    create = jest.fn().mockResolvedValue(created);
    findOwnerTimezone = jest
      .fn()
      .mockResolvedValue('America/Mexico_City');
    record = jest.fn();
    useCase = new CreateVaccineUseCase(
      { create } as unknown as VaccineRepository,
      {
        findOwnerTimezone,
        findById: jest.fn(),
      } as unknown as PetRepository,
      { record },
    );
  });

  it('acepta hoy local aunque UTC ya sea manana (America/Mexico_City, 20:00)', async () => {
    await expect(
      useCase.execute(
        PET_ID,
        { name: 'Manual', appliedAt: '2026-08-10' },
        USER_ID,
        NOW_CDMX_EVENING,
      ),
    ).resolves.toBe(created);
    expect(findOwnerTimezone).toHaveBeenCalledWith(PET_ID);
    expect(create).toHaveBeenCalledWith(
      expect.objectContaining({ appliedAt: '2026-08-10' }),
    );
  });

  it('rechaza manana local aunque UTC ya sea ese dia (America/Mexico_City, 20:00)', async () => {
    const promise = useCase.execute(
      PET_ID,
      { name: 'Manual', appliedAt: '2026-08-11' },
      USER_ID,
      NOW_CDMX_EVENING,
    );

    await expect(promise).rejects.toThrow(
      'Applied date cannot be in the future',
    );
    await expect(promise).rejects.toMatchObject({
      name: 'VaccineAppliedInFutureError',
    });
    expect(create).not.toHaveBeenCalled();
    expect(record).not.toHaveBeenCalled();
  });

  it('acepta hoy local aunque UTC todavia sea ayer (Pacific/Kiritimati, 10:00)', async () => {
    findOwnerTimezone.mockResolvedValue('Pacific/Kiritimati');

    await expect(
      useCase.execute(
        PET_ID,
        { name: 'Manual', appliedAt: '2026-08-11' },
        USER_ID,
        NOW_KIRITIMATI_MORNING,
      ),
    ).resolves.toBe(created);
    expect(findOwnerTimezone).toHaveBeenCalledWith(PET_ID);
    expect(create).toHaveBeenCalledWith(
      expect.objectContaining({ appliedAt: '2026-08-11' }),
    );
  });
});

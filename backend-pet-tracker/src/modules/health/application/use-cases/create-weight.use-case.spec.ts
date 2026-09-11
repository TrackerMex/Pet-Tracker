import { PetWeight } from '@/modules/health/domain/entities/weight.entity';
import type { WeightRepository } from '@/modules/health/domain/repositories/weight.repository';
import type { PetRepository } from '@/modules/pets/domain/repositories/pet.repository';
import { CreateWeightUseCase } from './create-weight.use-case';

const PET_ID = '0198b2c3-4d5e-7a01-b234-56789abcdef0';
const USER_ID = '0198a1f0-3d5c-7f21-b0a1-6f1c9e2d4b77';
const WEIGHT_ID = '0198dead-beef-7c23-d456-789abcdef012';
const NOW_CDMX_EVENING = new Date('2026-08-11T02:00:00.000Z');
const NOW_KIRITIMATI_MORNING = new Date('2026-08-10T20:00:00.000Z');

function persistedWeight(): PetWeight {
  return new PetWeight({
    id: WEIGHT_ID,
    petId: PET_ID,
    weightKg: 21.35,
    measuredAt: '2026-08-11',
    bodyCondition: null,
  });
}

function repository(overrides: Partial<WeightRepository>): WeightRepository {
  return {
    create: jest.fn(),
    listByPet: jest.fn(),
    findPrevious: jest.fn().mockResolvedValue(null),
    ...overrides,
  };
}

describe('R10 (health-weights #15): auditoria weight.create ocurre despues de escribir', () => {
  it('no audita cuando la escritura falla', async () => {
    const record = jest.fn();
    const pets = {
      findOwnerTimezone: jest.fn().mockResolvedValue('UTC'),
    } as unknown as PetRepository;
    const useCase = new CreateWeightUseCase(
      repository({
        create: jest.fn().mockRejectedValue(new Error('write failed')),
      }),
      pets,
      { record },
    );

    await expect(
      useCase.execute(
        PET_ID,
        { weightKg: 21.35, measuredAt: '2026-08-11' },
        USER_ID,
        NOW_CDMX_EVENING,
      ),
    ).rejects.toThrow('write failed');
    expect(record).not.toHaveBeenCalled();
  });

  it('audita el id creado con actor y petId tras resolver la escritura', async () => {
    const create = jest.fn().mockResolvedValue(persistedWeight());
    const record = jest.fn().mockResolvedValue(undefined);
    const pets = {
      findOwnerTimezone: jest.fn().mockResolvedValue('UTC'),
    } as unknown as PetRepository;
    const useCase = new CreateWeightUseCase(
      repository({ create }),
      pets,
      { record },
    );

    await useCase.execute(
      PET_ID,
      { weightKg: 21.35, measuredAt: '2026-08-11' },
      USER_ID,
      NOW_CDMX_EVENING,
    );

    expect(create).toHaveBeenCalledTimes(1);
    expect(record).toHaveBeenCalledWith({
      userId: USER_ID,
      action: 'weight.create',
      entity: 'weight',
      entityId: WEIGHT_ID,
      meta: { petId: PET_ID },
    });
    expect(create.mock.invocationCallOrder[0]).toBeLessThan(
      record.mock.invocationCallOrder[0],
    );
  });
});

describe('R1 (dto-dates-owner-timezone #89): create compara measuredAt con el dia civil del owner, sin margen', () => {
  it('acepta hoy local aunque UTC ya sea manana (America/Mexico_City, 20:00)', async () => {
    const create = jest.fn().mockResolvedValue(persistedWeight());
    const weights = repository({ create });
    const findOwnerTimezone = jest
      .fn()
      .mockResolvedValue('America/Mexico_City');
    const pets = { findOwnerTimezone } as unknown as PetRepository;
    const audit = { record: jest.fn().mockResolvedValue(undefined) };
    const useCase = new CreateWeightUseCase(weights, pets, audit);

    await expect(
      useCase.execute(
        PET_ID,
        { weightKg: 21.35, measuredAt: '2026-08-10' },
        USER_ID,
        NOW_CDMX_EVENING,
      ),
    ).resolves.toBeDefined();
    expect(findOwnerTimezone).toHaveBeenCalledWith(PET_ID);
    expect(create).toHaveBeenCalledWith(
      expect.objectContaining({ measuredAt: '2026-08-10' }),
    );
  });

  it('rechaza manana local aunque UTC ya sea ese dia (America/Mexico_City, 20:00)', async () => {
    const create = jest.fn().mockResolvedValue(persistedWeight());
    const weights = repository({ create });
    const pets = {
      findOwnerTimezone: jest.fn().mockResolvedValue('America/Mexico_City'),
    } as unknown as PetRepository;
    const record = jest.fn().mockResolvedValue(undefined);
    const useCase = new CreateWeightUseCase(weights, pets, { record });

    const execution = useCase.execute(
      PET_ID,
      { weightKg: 21.35, measuredAt: '2026-08-11' },
      USER_ID,
      NOW_CDMX_EVENING,
    );

    await expect(execution).rejects.toThrow(
      'measuredAt is too far in the future',
    );
    await expect(execution).rejects.toMatchObject({
      name: 'WeightMeasuredInFutureError',
    });
    expect(create).not.toHaveBeenCalled();
    expect(record).not.toHaveBeenCalled();
  });

  it('acepta hoy local aunque UTC todavia sea ayer (Pacific/Kiritimati, 10:00)', async () => {
    const create = jest.fn().mockResolvedValue(persistedWeight());
    const weights = repository({ create });
    const findOwnerTimezone = jest
      .fn()
      .mockResolvedValue('Pacific/Kiritimati');
    const pets = { findOwnerTimezone } as unknown as PetRepository;
    const audit = { record: jest.fn().mockResolvedValue(undefined) };
    const useCase = new CreateWeightUseCase(weights, pets, audit);

    await expect(
      useCase.execute(
        PET_ID,
        { weightKg: 21.35, measuredAt: '2026-08-11' },
        USER_ID,
        NOW_KIRITIMATI_MORNING,
      ),
    ).resolves.toBeDefined();
    expect(findOwnerTimezone).toHaveBeenCalledWith(PET_ID);
    expect(create).toHaveBeenCalledWith(
      expect.objectContaining({ measuredAt: '2026-08-11' }),
    );
  });
});

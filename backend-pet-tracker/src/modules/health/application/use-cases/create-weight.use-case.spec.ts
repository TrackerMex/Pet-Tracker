import type { AuditLogger } from '@/audit/audit-log.repository';
import { PetWeight } from '@/modules/health/domain/entities/weight.entity';
import type { WeightRepository } from '@/modules/health/domain/repositories/weight.repository';
import { CreateWeightUseCase } from './create-weight.use-case';

const PET_ID = '0198b2c3-4d5e-7a01-b234-56789abcdef0';
const USER_ID = '0198a1f0-3d5c-7f21-b0a1-6f1c9e2d4b77';
const WEIGHT_ID = '0198dead-beef-7c23-d456-789abcdef012';

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
    const useCase = new CreateWeightUseCase(
      repository({
        create: jest.fn().mockRejectedValue(new Error('write failed')),
      }),
      { record } as AuditLogger,
    );

    await expect(
      useCase.execute(
        PET_ID,
        { weightKg: 21.35, measuredAt: '2026-08-11' },
        USER_ID,
      ),
    ).rejects.toThrow('write failed');
    expect(record).not.toHaveBeenCalled();
  });

  it('audita el id creado con actor y petId tras resolver la escritura', async () => {
    const create = jest.fn().mockResolvedValue(persistedWeight());
    const record = jest.fn().mockResolvedValue(undefined);
    const useCase = new CreateWeightUseCase(
      repository({ create }),
      { record } as AuditLogger,
    );

    await useCase.execute(
      PET_ID,
      { weightKg: 21.35, measuredAt: '2026-08-11' },
      USER_ID,
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

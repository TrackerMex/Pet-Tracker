import type { AuditLogger } from '@/audit/audit-log.repository';
import { Pet } from '@/modules/pets/domain/entities/pet.entity';
import type {
  PetFieldChanges,
  PetRepository,
} from '@/modules/pets/domain/repositories/pet.repository';
import { SetLostModeUseCase } from './set-lost-mode.use-case';

const PET_ID = '0198b2c3-4d5e-7a01-b234-56789abcdef0';
const USER_ID = '0198a1f0-3d5c-7f21-b0a1-6f1c9e2d4b77';

function buildPet(lostMode: boolean): Pet {
  return new Pet({
    id: PET_ID,
    name: 'Luna',
    species: 'dog',
    breed: null,
    birthDate: '2024-01-15',
    approxAgeMonths: null,
    sex: null,
    currentWeightKg: null,
    size: null,
    color: null,
    sterilized: null,
    microchip: null,
    photoKey: null,
    lostMode,
    lastPosition: null,
    lastCommunicationAt: null,
    createdAt: new Date('2026-08-01T10:00:00.000Z'),
    updatedAt: new Date('2026-08-27T10:00:00.000Z'),
  });
}

describe('R1: set lost mode persiste y audita', () => {
  it.each([true, false])(
    'writes lostMode=%s, records the requested value, and returns the pet',
    async (enabled) => {
      const updated = buildPet(enabled);
      const update = jest.fn().mockResolvedValue(updated);
      const record = jest.fn().mockResolvedValue(undefined);
      const pets = { update } as unknown as PetRepository;
      const auditLogger: AuditLogger = { record };
      const useCase = new SetLostModeUseCase(pets, auditLogger);

      const result = await useCase.execute(PET_ID, USER_ID, enabled);

      const changes: PetFieldChanges = { lostMode: enabled };
      expect(update).toHaveBeenCalledWith(PET_ID, changes);
      expect(record).toHaveBeenCalledWith({
        userId: USER_ID,
        action: 'pet.lost_mode',
        entity: 'pet',
        entityId: PET_ID,
        meta: { enabled },
      });
      expect(result).toBe(updated);
    },
  );
});

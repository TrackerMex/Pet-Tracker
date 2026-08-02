import { AuditLogger } from '@/audit/audit-log.repository';
import { Pet } from '@/modules/pets/domain/entities/pet.entity';
import { PetRepository } from '@/modules/pets/domain/repositories/pet.repository';
import { CreatePetDto } from '../dto/create-pet.dto';
import { CreatePetUseCase } from './create-pet.use-case';

const OWNER_ID = '0198a1f0-3d5c-7f21-b0a1-6f1c9e2d4b77';
const PET_ID = '0198b2c3-4d5e-7a01-b234-56789abcdef0';

function buildPet(): Pet {
  return new Pet({
    id: PET_ID,
    name: 'Firulais',
    species: 'dog',
    breed: null,
    birthDate: '2024-01-15',
    approxAgeMonths: null,
    sex: null,
    currentWeightKg: 25.5,
    size: null,
    color: null,
    sterilized: null,
    microchip: null,
    photoKey: null,
    lostMode: false,
    lastPosition: null,
    lastCommunicationAt: null,
    createdAt: new Date('2026-08-01T10:00:00.000Z'),
    updatedAt: new Date('2026-08-01T10:00:00.000Z'),
  });
}

function buildDto(): CreatePetDto {
  return {
    name: 'Firulais',
    species: 'dog',
    birthDate: '2024-01-15',
    weightKg: 25.5,
  };
}

function buildDeps(overrides?: { createWithOwner?: jest.Mock }) {
  const calls: string[] = [];
  const createWithOwner =
    overrides?.createWithOwner ??
    jest.fn().mockImplementation(() => {
      calls.push('createWithOwner');
      return Promise.resolve(buildPet());
    });
  const record = jest.fn().mockImplementation(() => {
    calls.push('record');
    return Promise.resolve();
  });

  const pets = { createWithOwner } as unknown as PetRepository;
  const auditLogger: AuditLogger = { record };

  return { pets, auditLogger, createWithOwner, record, calls };
}

describe('R2: CreatePetUseCase crea la mascota con su membresia owner', () => {
  it('delega en createWithOwner con los campos mapeados y el ownerId', async () => {
    const { pets, auditLogger, createWithOwner } = buildDeps();
    const useCase = new CreatePetUseCase(pets, auditLogger);

    const pet = await useCase.execute(buildDto(), OWNER_ID);

    expect(createWithOwner).toHaveBeenCalledWith(
      {
        name: 'Firulais',
        species: 'dog',
        birthDate: '2024-01-15',
        currentWeightKg: 25.5,
      },
      OWNER_ID,
    );
    expect(pet.id).toBe(PET_ID);
  });
});

describe('R3: la creacion exitosa audita pet.create via AuditLogger', () => {
  it('registra la entrada despues de confirmar la transaccion', async () => {
    const { pets, auditLogger, record, calls } = buildDeps();
    const useCase = new CreatePetUseCase(pets, auditLogger);

    await useCase.execute(buildDto(), OWNER_ID);

    expect(record).toHaveBeenCalledWith({
      userId: OWNER_ID,
      action: 'pet.create',
      entity: 'pet',
      entityId: PET_ID,
    });
    expect(calls).toEqual(['createWithOwner', 'record']);
  });

  it('no audita nada si la transaccion falla', async () => {
    const failing = jest.fn().mockRejectedValue(new Error('tx aborted'));
    const { pets, auditLogger, record } = buildDeps({
      createWithOwner: failing,
    });
    const useCase = new CreatePetUseCase(pets, auditLogger);

    await expect(useCase.execute(buildDto(), OWNER_ID)).rejects.toThrow(
      'tx aborted',
    );
    expect(record).not.toHaveBeenCalled();
  });
});

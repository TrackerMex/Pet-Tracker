import { AuditLogger } from '@/audit/audit-log.repository';
import { User } from '@/modules/auth/domain/entities/user.entity';
import { UserRepository } from '@/modules/auth/domain/repositories/user.repository';
import { Pet } from '@/modules/pets/domain/entities/pet.entity';
import { PetRepository } from '@/modules/pets/domain/repositories/pet.repository';
import { CreatePetDto } from '../dto/create-pet.dto';
import { CreatePetUseCase } from './create-pet.use-case';

const OWNER_ID = '0198a1f0-3d5c-7f21-b0a1-6f1c9e2d4b77';
const PET_ID = '0198b2c3-4d5e-7a01-b234-56789abcdef0';
const NOW_CDMX_EVENING = new Date('2026-08-11T02:00:00.000Z');
const NOW_KIRITIMATI_MORNING = new Date('2026-08-10T20:00:00.000Z');

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
  const users = {
    findById: jest.fn().mockResolvedValue({ timezone: 'UTC' } as User),
  } as unknown as UserRepository;
  const auditLogger: AuditLogger = { record };

  return { pets, users, auditLogger, createWithOwner, record, calls };
}

describe('R2: CreatePetUseCase crea la mascota con su membresia owner', () => {
  it('delega en createWithOwner con los campos mapeados y el ownerId', async () => {
    const { pets, users, auditLogger, createWithOwner } = buildDeps();
    const useCase = new CreatePetUseCase(pets, users, auditLogger);

    const pet = await useCase.execute(buildDto(), OWNER_ID, NOW_CDMX_EVENING);

    expect(createWithOwner).toHaveBeenCalledWith(
      {
        name: 'Firulais',
        species: 'dog',
        birthDate: '2024-01-15',
      },
      OWNER_ID,
    );
    expect(pet.id).toBe(PET_ID);
  });
});

describe('R3: la creacion exitosa audita pet.create via AuditLogger', () => {
  it('registra la entrada despues de confirmar la transaccion', async () => {
    const { pets, users, auditLogger, record, calls } = buildDeps();
    const useCase = new CreatePetUseCase(pets, users, auditLogger);

    await useCase.execute(buildDto(), OWNER_ID, NOW_CDMX_EVENING);

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
    const { pets, users, auditLogger, record } = buildDeps({
      createWithOwner: failing,
    });
    const useCase = new CreatePetUseCase(pets, users, auditLogger);

    await expect(
      useCase.execute(buildDto(), OWNER_ID, NOW_CDMX_EVENING),
    ).rejects.toThrow('tx aborted');
    expect(record).not.toHaveBeenCalled();
  });
});

describe('R2 (dto-dates-owner-timezone #89): create compara birthDate con el dia civil del requester, no con el dia UTC', () => {
  function dependencies(timezone: string) {
    const createWithOwner = jest.fn().mockResolvedValue(buildPet());
    const pets = { createWithOwner } as unknown as PetRepository;
    const findById = jest.fn().mockResolvedValue({ timezone } as User);
    const users = { findById } as unknown as UserRepository;
    const record = jest.fn().mockResolvedValue(undefined);
    const auditLogger: AuditLogger = { record };

    return { pets, users, auditLogger, createWithOwner, findById, record };
  }

  it('acepta hoy local aunque UTC ya sea manana (America/Mexico_City, 20:00)', async () => {
    const { pets, users, auditLogger, createWithOwner, findById } =
      dependencies('America/Mexico_City');
    const useCase = new CreatePetUseCase(pets, users, auditLogger);

    await expect(
      useCase.execute(
        { name: 'Firulais', species: 'dog', birthDate: '2026-08-10' },
        OWNER_ID,
        NOW_CDMX_EVENING,
      ),
    ).resolves.toBeDefined();
    expect(findById).toHaveBeenCalledWith(OWNER_ID);
    expect(createWithOwner).toHaveBeenCalledWith(
      expect.objectContaining({ birthDate: '2026-08-10' }),
      OWNER_ID,
    );
  });

  it('rechaza manana local aunque UTC ya sea ese dia (America/Mexico_City, 20:00)', async () => {
    const { pets, users, auditLogger, createWithOwner, record } = dependencies(
      'America/Mexico_City',
    );
    const useCase = new CreatePetUseCase(pets, users, auditLogger);

    const execution = useCase.execute(
      { name: 'Firulais', species: 'dog', birthDate: '2026-08-11' },
      OWNER_ID,
      NOW_CDMX_EVENING,
    );

    await expect(execution).rejects.toThrow(
      'birthDate cannot be in the future',
    );
    await expect(execution).rejects.toMatchObject({
      name: 'PetBirthDateInFutureError',
    });
    expect(createWithOwner).not.toHaveBeenCalled();
    expect(record).not.toHaveBeenCalled();
  });

  it('acepta hoy local aunque UTC todavia sea ayer (Pacific/Kiritimati, 10:00)', async () => {
    const { pets, users, auditLogger, createWithOwner } =
      dependencies('Pacific/Kiritimati');
    const useCase = new CreatePetUseCase(pets, users, auditLogger);

    await expect(
      useCase.execute(
        { name: 'Firulais', species: 'dog', birthDate: '2026-08-11' },
        OWNER_ID,
        NOW_KIRITIMATI_MORNING,
      ),
    ).resolves.toBeDefined();
    expect(createWithOwner).toHaveBeenCalledWith(
      expect.objectContaining({ birthDate: '2026-08-11' }),
      OWNER_ID,
    );
  });

  it('sin birthDate (approxAgeMonths) no consulta la zona del requester', async () => {
    const { pets, users, auditLogger, createWithOwner, findById } =
      dependencies('America/Mexico_City');
    const useCase = new CreatePetUseCase(pets, users, auditLogger);
    const dto = { name: 'Michi', species: 'cat' as const, approxAgeMonths: 6 };

    await expect(
      useCase.execute(dto, OWNER_ID, NOW_CDMX_EVENING),
    ).resolves.toBeDefined();
    expect(findById).not.toHaveBeenCalled();
    expect(createWithOwner).toHaveBeenCalledWith(dto, OWNER_ID);
  });
});

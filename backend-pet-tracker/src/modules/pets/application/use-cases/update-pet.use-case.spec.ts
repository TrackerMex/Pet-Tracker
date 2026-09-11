import { AuditLogger } from '@/audit/audit-log.repository';
import { Pet } from '@/modules/pets/domain/entities/pet.entity';
import { PetNotFoundError } from '@/modules/pets/domain/errors/pet.errors';
import {
  PetFieldChanges,
  PetRepository,
} from '@/modules/pets/domain/repositories/pet.repository';
import { UpdatePetSchema } from '../dto/update-pet.dto';
import { UpdatePetUseCase } from './update-pet.use-case';

const PET_ID = '0198b2c3-4d5e-7a01-b234-56789abcdef0';
const USER_ID = '0198a1f0-3d5c-7f21-b0a1-6f1c9e2d4b77';
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
    currentWeightKg: null,
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

function buildDeps() {
  const update = jest.fn().mockResolvedValue(buildPet());
  const findById = jest.fn().mockResolvedValue(buildPet());
  const findOwnerTimezone = jest.fn().mockResolvedValue('UTC');
  const record = jest.fn().mockResolvedValue(undefined);
  const pets = {
    update,
    findById,
    findOwnerTimezone,
  } as unknown as PetRepository;
  const auditLogger: AuditLogger = { record };

  return {
    pets,
    auditLogger,
    update,
    findById,
    findOwnerTimezone,
    record,
  };
}

describe('R13: PATCH actualiza unicamente los campos presentes', () => {
  it('pasa al repositorio solo lo enviado', async () => {
    const { pets, auditLogger, update } = buildDeps();
    const useCase = new UpdatePetUseCase(pets, auditLogger);

    await useCase.execute(PET_ID, USER_ID, { name: 'Firu' }, NOW_CDMX_EVENING);

    expect(update).toHaveBeenCalledWith(PET_ID, { name: 'Firu' });
  });

  it('PetFieldChanges no permite currentWeightKg (R2 #22)', () => {
    const changes: PetFieldChanges = {
      // @ts-expect-error R2: el peso solo se escribe desde health-weights.
      currentWeightKg: 12.5,
    };

    expect(changes).toEqual({ currentWeightKg: 12.5 });
  });
});

describe('R14: persistir un campo de edad anula el otro', () => {
  it('enviar birthDate pone approxAgeMonths en NULL', async () => {
    const { pets, auditLogger, update } = buildDeps();
    const useCase = new UpdatePetUseCase(pets, auditLogger);

    await useCase.execute(
      PET_ID,
      USER_ID,
      { birthDate: '2024-01-15' },
      NOW_CDMX_EVENING,
    );

    expect(update).toHaveBeenCalledWith(PET_ID, {
      birthDate: '2024-01-15',
      approxAgeMonths: null,
    });
  });

  it('enviar approxAgeMonths pone birthDate en NULL', async () => {
    const { pets, auditLogger, update } = buildDeps();
    const useCase = new UpdatePetUseCase(pets, auditLogger);

    await useCase.execute(
      PET_ID,
      USER_ID,
      { approxAgeMonths: 18 },
      NOW_CDMX_EVENING,
    );

    expect(update).toHaveBeenCalledWith(PET_ID, {
      approxAgeMonths: 18,
      birthDate: null,
    });
  });
});

describe('R15: el PATCH con cambios audita pet.update con nombres de campos', () => {
  it('registra meta.fields con los nombres enviados, nunca los valores', async () => {
    const { pets, auditLogger, record } = buildDeps();
    const useCase = new UpdatePetUseCase(pets, auditLogger);

    await useCase.execute(PET_ID, USER_ID, { name: 'Firu' }, NOW_CDMX_EVENING);

    expect(record).toHaveBeenCalledWith({
      userId: USER_ID,
      action: 'pet.update',
      entity: 'pet',
      entityId: PET_ID,
      meta: { fields: ['name'] },
    });
  });
});

describe('R15: el body vacio es un no-op 200 sin escritura ni auditoria', () => {
  it('devuelve el perfil sin tocar update ni audit_log', async () => {
    const { pets, auditLogger, update, findById, record } = buildDeps();
    const useCase = new UpdatePetUseCase(pets, auditLogger);

    const pet = await useCase.execute(PET_ID, USER_ID, {}, NOW_CDMX_EVENING);

    expect(pet.id).toBe(PET_ID);
    expect(findById).toHaveBeenCalledWith(PET_ID);
    expect(update).not.toHaveBeenCalled();
    expect(record).not.toHaveBeenCalled();
  });

  it('trata weightKg descartado como no-op (R2 #22)', async () => {
    const { pets, auditLogger, update, findById, record } = buildDeps();
    const useCase = new UpdatePetUseCase(pets, auditLogger);

    const dto = UpdatePetSchema.parse({ weightKg: 99 });
    await useCase.execute(PET_ID, USER_ID, dto, NOW_CDMX_EVENING);

    expect(findById).toHaveBeenCalledWith(PET_ID);
    expect(update).not.toHaveBeenCalled();
    expect(record).not.toHaveBeenCalled();
  });

  it('lanza PetNotFoundError si la fila desaparecio (delete concurrente)', async () => {
    const { pets, auditLogger, findById } = buildDeps();
    findById.mockResolvedValue(null);
    const useCase = new UpdatePetUseCase(pets, auditLogger);

    await expect(
      useCase.execute(PET_ID, USER_ID, {}, NOW_CDMX_EVENING),
    ).rejects.toThrow(PetNotFoundError);
  });
});

describe('R4 (dto-dates-owner-timezone #89): update compara birthDate con el dia civil del owner solo cuando el body lo trae', () => {
  it('acepta hoy local aunque UTC ya sea manana (America/Mexico_City, 20:00)', async () => {
    const { pets, auditLogger, update, findOwnerTimezone } = buildDeps();
    findOwnerTimezone.mockResolvedValue('America/Mexico_City');
    const useCase = new UpdatePetUseCase(pets, auditLogger);

    await expect(
      useCase.execute(
        PET_ID,
        USER_ID,
        { birthDate: '2026-08-10' },
        NOW_CDMX_EVENING,
      ),
    ).resolves.toBeDefined();
    expect(findOwnerTimezone).toHaveBeenCalledWith(PET_ID);
    expect(update).toHaveBeenCalledWith(PET_ID, {
      birthDate: '2026-08-10',
      approxAgeMonths: null,
    });
  });

  it('rechaza manana local aunque UTC ya sea ese dia (America/Mexico_City, 20:00)', async () => {
    const { pets, auditLogger, update, findOwnerTimezone, record } =
      buildDeps();
    findOwnerTimezone.mockResolvedValue('America/Mexico_City');
    const useCase = new UpdatePetUseCase(pets, auditLogger);

    const execution = useCase.execute(
      PET_ID,
      USER_ID,
      { birthDate: '2026-08-11' },
      NOW_CDMX_EVENING,
    );

    await expect(execution).rejects.toThrow(
      'birthDate cannot be in the future',
    );
    await expect(execution).rejects.toMatchObject({
      name: 'PetBirthDateInFutureError',
    });
    expect(update).not.toHaveBeenCalled();
    expect(record).not.toHaveBeenCalled();
  });

  it('acepta hoy local aunque UTC todavia sea ayer (Pacific/Kiritimati, 10:00)', async () => {
    const { pets, auditLogger, update, findOwnerTimezone } = buildDeps();
    findOwnerTimezone.mockResolvedValue('Pacific/Kiritimati');
    const useCase = new UpdatePetUseCase(pets, auditLogger);

    await expect(
      useCase.execute(
        PET_ID,
        USER_ID,
        { birthDate: '2026-08-11' },
        NOW_KIRITIMATI_MORNING,
      ),
    ).resolves.toBeDefined();
    expect(findOwnerTimezone).toHaveBeenCalledWith(PET_ID);
    expect(update).toHaveBeenCalledWith(PET_ID, {
      birthDate: '2026-08-11',
      approxAgeMonths: null,
    });
  });

  it('sin birthDate en el body no consulta la zona del owner', async () => {
    const { pets, auditLogger, update, findOwnerTimezone } = buildDeps();
    const useCase = new UpdatePetUseCase(pets, auditLogger);

    await expect(
      useCase.execute(PET_ID, USER_ID, { name: 'Firu' }, NOW_CDMX_EVENING),
    ).resolves.toBeDefined();
    expect(findOwnerTimezone).not.toHaveBeenCalled();
    expect(update).toHaveBeenCalledWith(PET_ID, { name: 'Firu' });
  });
});

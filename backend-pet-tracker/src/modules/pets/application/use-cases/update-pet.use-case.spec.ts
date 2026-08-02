import { AuditLogger } from '@/audit/audit-log.repository';
import { Pet } from '@/modules/pets/domain/entities/pet.entity';
import { PetNotFoundError } from '@/modules/pets/domain/errors/pet.errors';
import { PetRepository } from '@/modules/pets/domain/repositories/pet.repository';
import { UpdatePetUseCase } from './update-pet.use-case';

const PET_ID = '0198b2c3-4d5e-7a01-b234-56789abcdef0';
const USER_ID = '0198a1f0-3d5c-7f21-b0a1-6f1c9e2d4b77';

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
  const record = jest.fn().mockResolvedValue(undefined);
  const pets = { update, findById } as unknown as PetRepository;
  const auditLogger: AuditLogger = { record };

  return { pets, auditLogger, update, findById, record };
}

describe('R13: PATCH actualiza unicamente los campos presentes', () => {
  it('pasa al repositorio solo lo enviado, con weightKg mapeado', async () => {
    const { pets, auditLogger, update } = buildDeps();
    const useCase = new UpdatePetUseCase(pets, auditLogger);

    await useCase.execute(PET_ID, USER_ID, { name: 'Firu', weightKg: 12.5 });

    expect(update).toHaveBeenCalledWith(PET_ID, {
      name: 'Firu',
      currentWeightKg: 12.5,
    });
  });
});

describe('R14: persistir un campo de edad anula el otro', () => {
  it('enviar birthDate pone approxAgeMonths en NULL', async () => {
    const { pets, auditLogger, update } = buildDeps();
    const useCase = new UpdatePetUseCase(pets, auditLogger);

    await useCase.execute(PET_ID, USER_ID, { birthDate: '2024-01-15' });

    expect(update).toHaveBeenCalledWith(PET_ID, {
      birthDate: '2024-01-15',
      approxAgeMonths: null,
    });
  });

  it('enviar approxAgeMonths pone birthDate en NULL', async () => {
    const { pets, auditLogger, update } = buildDeps();
    const useCase = new UpdatePetUseCase(pets, auditLogger);

    await useCase.execute(PET_ID, USER_ID, { approxAgeMonths: 18 });

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

    await useCase.execute(PET_ID, USER_ID, { name: 'Firu', weightKg: 12.5 });

    expect(record).toHaveBeenCalledWith({
      userId: USER_ID,
      action: 'pet.update',
      entity: 'pet',
      entityId: PET_ID,
      meta: { fields: ['name', 'weightKg'] },
    });
  });
});

describe('R15: el body vacio es un no-op 200 sin escritura ni auditoria', () => {
  it('devuelve el perfil sin tocar update ni audit_log', async () => {
    const { pets, auditLogger, update, findById, record } = buildDeps();
    const useCase = new UpdatePetUseCase(pets, auditLogger);

    const pet = await useCase.execute(PET_ID, USER_ID, {});

    expect(pet.id).toBe(PET_ID);
    expect(findById).toHaveBeenCalledWith(PET_ID);
    expect(update).not.toHaveBeenCalled();
    expect(record).not.toHaveBeenCalled();
  });

  it('lanza PetNotFoundError si la fila desaparecio (delete concurrente)', async () => {
    const { pets, auditLogger, findById } = buildDeps();
    findById.mockResolvedValue(null);
    const useCase = new UpdatePetUseCase(pets, auditLogger);

    await expect(useCase.execute(PET_ID, USER_ID, {})).rejects.toThrow(
      PetNotFoundError,
    );
  });
});

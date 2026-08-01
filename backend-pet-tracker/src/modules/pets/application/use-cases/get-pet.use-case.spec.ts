import { Pet } from '@/modules/pets/domain/entities/pet.entity';
import { PetNotFoundError } from '@/modules/pets/domain/errors/pet.errors';
import { PetRepository } from '@/modules/pets/domain/repositories/pet.repository';
import { GetPetUseCase } from './get-pet.use-case';

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

describe('R8: GetPetUseCase devuelve la mascota para el perfil de detalle', () => {
  it('delega en findById y devuelve la entidad', async () => {
    const findById = jest.fn().mockResolvedValue(buildPet());
    const useCase = new GetPetUseCase({ findById } as unknown as PetRepository);

    const pet = await useCase.execute(PET_ID);

    expect(findById).toHaveBeenCalledWith(PET_ID);
    expect(pet.id).toBe(PET_ID);
  });
});

describe('R9: si la fila desaparecio tras pasar el guard, el use case lanza PetNotFoundError', () => {
  it('lanza PetNotFoundError para un id sin fila (delete concurrente)', async () => {
    const useCase = new GetPetUseCase({
      findById: jest.fn().mockResolvedValue(null),
    } as unknown as PetRepository);

    await expect(useCase.execute(PET_ID)).rejects.toThrow(PetNotFoundError);
  });
});

import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Pet } from '@/modules/pets/domain/entities/pet.entity';
import { PetNotFoundError } from '@/modules/pets/domain/errors/pet.errors';
import { CreatePetUseCase } from '@/modules/pets/application/use-cases/create-pet.use-case';
import { GetPetUseCase } from '@/modules/pets/application/use-cases/get-pet.use-case';
import { ListPetsUseCase } from '@/modules/pets/application/use-cases/list-pets.use-case';
import { PetAccessRequest } from './guards/pet-access.guard';
import { PetsController } from './pets.controller';

const USER = { id: '0198a1f0-3d5c-7f21-b0a1-6f1c9e2d4b77', email: 'ada@example.com' };
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

function buildController() {
  const createExecute = jest.fn().mockResolvedValue(buildPet());
  const createPet = { execute: createExecute } as unknown as CreatePetUseCase;
  const listExecute = jest.fn().mockResolvedValue([]);
  const listPets = { execute: listExecute } as unknown as ListPetsUseCase;
  const getExecute = jest.fn().mockResolvedValue(buildPet());
  const getPet = { execute: getExecute } as unknown as GetPetUseCase;
  const controller = new PetsController(createPet, listPets, getPet);

  return { controller, createExecute, listExecute, getExecute };
}

function buildPetRequest(role: 'owner' | 'family' | 'walker' | 'vet') {
  return {
    user: USER,
    petMembership: { petId: PET_ID, role },
  } as unknown as PetAccessRequest;
}

describe('R2: POST /v1/pets responde el perfil creado con myRole owner', () => {
  it('delega el dto validado y el usuario autenticado al use case', async () => {
    const { controller, createExecute } = buildController();

    await controller.create(USER, {
      name: 'Firulais',
      species: 'dog',
      birthDate: '2024-01-15',
    });

    expect(createExecute).toHaveBeenCalledWith(
      { name: 'Firulais', species: 'dog', birthDate: '2024-01-15' },
      USER.id,
    );
  });

  it('devuelve el shape de perfil (R8) con myRole owner', async () => {
    const { controller } = buildController();

    const response = await controller.create(USER, {
      name: 'Firulais',
      species: 'dog',
      birthDate: '2024-01-15',
    });

    expect(response.id).toBe(PET_ID);
    expect(response.myRole).toBe('owner');
    expect(response.name).toBe('Firulais');
  });
});

describe('R7: GET /v1/pets lista las mascotas del usuario con myRole', () => {
  it('serializa cada membresia con el rol propio del usuario', async () => {
    const { controller, listExecute } = buildController();
    listExecute.mockResolvedValue([{ pet: buildPet(), role: 'family' }]);

    const response = await controller.list(USER);

    expect(listExecute).toHaveBeenCalledWith(USER.id);
    expect(response).toHaveLength(1);
    expect(response[0].id).toBe(PET_ID);
    expect(response[0].myRole).toBe('family');
  });

  it('responde array vacio si el usuario no tiene membresias', async () => {
    const { controller } = buildController();

    await expect(controller.list(USER)).resolves.toEqual([]);
  });
});

describe('R8: GET /v1/pets/:petId responde el perfil con el rol de la membresia', () => {
  it('usa el petId y el rol adjuntados por PetAccessGuard', async () => {
    const { controller, getExecute } = buildController();

    const response = await controller.detail(buildPetRequest('vet'));

    expect(getExecute).toHaveBeenCalledWith(PET_ID);
    expect(response.id).toBe(PET_ID);
    expect(response.myRole).toBe('vet');
  });
});

describe('R9: PetNotFoundError se mapea al mismo 404 generico del guard', () => {
  it('convierte el error de dominio en NotFoundException (delete concurrente)', async () => {
    const { controller, getExecute } = buildController();
    getExecute.mockRejectedValue(new PetNotFoundError(PET_ID));

    await expect(controller.detail(buildPetRequest('owner'))).rejects.toThrow(
      NotFoundException,
    );
  });
});

describe('R4: body invalido en POST /v1/pets responde 400 sin persistir', () => {
  it('lanza BadRequestException con el detalle del ZodError y no invoca el use case', async () => {
    const { controller, createExecute } = buildController();

    await expect(
      controller.create(USER, { name: '', species: 'dog', birthDate: '2024-01-15' }),
    ).rejects.toThrow(BadRequestException);
    expect(createExecute).not.toHaveBeenCalled();
  });
});

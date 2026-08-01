import { BadRequestException } from '@nestjs/common';
import { Pet } from '@/modules/pets/domain/entities/pet.entity';
import { CreatePetUseCase } from '@/modules/pets/application/use-cases/create-pet.use-case';
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
  const controller = new PetsController(createPet);

  return { controller, createExecute };
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

describe('R4: body invalido en POST /v1/pets responde 400 sin persistir', () => {
  it('lanza BadRequestException con el detalle del ZodError y no invoca el use case', async () => {
    const { controller, createExecute } = buildController();

    await expect(
      controller.create(USER, { name: '', species: 'dog', birthDate: '2024-01-15' }),
    ).rejects.toThrow(BadRequestException);
    expect(createExecute).not.toHaveBeenCalled();
  });
});

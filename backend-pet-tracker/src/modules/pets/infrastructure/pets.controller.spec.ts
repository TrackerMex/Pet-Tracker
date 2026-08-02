import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Pet } from '@/modules/pets/domain/entities/pet.entity';
import { PetNotFoundError } from '@/modules/pets/domain/errors/pet.errors';
import { CreatePetUseCase } from '@/modules/pets/application/use-cases/create-pet.use-case';
import { DeletePetUseCase } from '@/modules/pets/application/use-cases/delete-pet.use-case';
import { GetPetUseCase } from '@/modules/pets/application/use-cases/get-pet.use-case';
import { ListPetsUseCase } from '@/modules/pets/application/use-cases/list-pets.use-case';
import { UpdatePetUseCase } from '@/modules/pets/application/use-cases/update-pet.use-case';
import { PetAccessRequest } from './guards/pet-access.guard';
import { PetsController } from './pets.controller';

const USER = {
  id: '0198a1f0-3d5c-7f21-b0a1-6f1c9e2d4b77',
  email: 'ada@example.com',
};
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
  const getExecute = jest
    .fn()
    .mockResolvedValue({ pet: buildPet(), device: null });
  const getPet = { execute: getExecute } as unknown as GetPetUseCase;
  const updateExecute = jest.fn().mockResolvedValue(buildPet());
  const updatePet = { execute: updateExecute } as unknown as UpdatePetUseCase;
  const deleteExecute = jest.fn().mockResolvedValue(undefined);
  const deletePet = { execute: deleteExecute } as unknown as DeletePetUseCase;
  const controller = new PetsController(
    createPet,
    listPets,
    getPet,
    updatePet,
    deletePet,
  );

  return {
    controller,
    createExecute,
    listExecute,
    getExecute,
    updateExecute,
    deleteExecute,
  };
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

describe('R12 (devices-claim): el detalle serializa la clave device del use case', () => {
  it('mapea el collar activo a las 5 claves del contrato de device', async () => {
    const { controller, getExecute } = buildController();
    getExecute.mockResolvedValue({
      pet: buildPet(),
      device: {
        model: 'sim-collar',
        batteryPct: null,
        connectivity: null,
        lastMessageAt: new Date('2026-08-01T11:59:00.000Z'),
        esn: 'SIM-001',
      },
    });

    const response = await controller.detail(buildPetRequest('owner'));

    expect(response.device).toEqual({
      model: 'sim-collar',
      batteryPct: null,
      connectivity: null,
      lastMessageAt: '2026-08-01T11:59:00.000Z',
      esn: 'SIM-001',
    });
  });

  it('sin collar activo la clave device sigue en null', async () => {
    const { controller } = buildController();

    const response = await controller.detail(buildPetRequest('owner'));

    expect(response.device).toBeNull();
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

describe('R13: PATCH /v1/pets/:petId delega el subconjunto validado', () => {
  it('pasa petId, usuario y dto al use case y responde el perfil', async () => {
    const { controller, updateExecute } = buildController();

    const response = await controller.update(buildPetRequest('owner'), {
      name: 'Firu',
    });

    expect(updateExecute).toHaveBeenCalledWith(PET_ID, USER.id, {
      name: 'Firu',
    });
    expect(response.myRole).toBe('owner');
  });

  it('responde 400 sin invocar el use case si algun campo no valida (atomico)', async () => {
    const { controller, updateExecute } = buildController();

    await expect(
      controller.update(buildPetRequest('owner'), { name: '' }),
    ).rejects.toThrow(BadRequestException);
    expect(updateExecute).not.toHaveBeenCalled();
  });
});

describe('R14: PATCH con birthDate y approxAgeMonths a la vez responde 400', () => {
  it('rechaza el body en el borde HTTP sin invocar el use case', async () => {
    const { controller, updateExecute } = buildController();

    await expect(
      controller.update(buildPetRequest('owner'), {
        birthDate: '2024-01-15',
        approxAgeMonths: 6,
      }),
    ).rejects.toThrow(BadRequestException);
    expect(updateExecute).not.toHaveBeenCalled();
  });
});

describe('R16: DELETE /v1/pets/:petId borra y responde sin body', () => {
  it('delega el petId del guard y el usuario autenticado; no devuelve nada (204)', async () => {
    const { controller, deleteExecute } = buildController();

    const result = await controller.remove(buildPetRequest('owner'));

    expect(deleteExecute).toHaveBeenCalledWith(PET_ID, USER.id);
    expect(result).toBeUndefined();
  });
});

describe('R4: body invalido en POST /v1/pets responde 400 sin persistir', () => {
  it('lanza BadRequestException con el detalle del ZodError y no invoca el use case', async () => {
    const { controller, createExecute } = buildController();

    await expect(
      controller.create(USER, {
        name: '',
        species: 'dog',
        birthDate: '2024-01-15',
      }),
    ).rejects.toThrow(BadRequestException);
    expect(createExecute).not.toHaveBeenCalled();
  });
});

import { Pet } from '@/modules/pets/domain/entities/pet.entity';
import { PetPhotoUrlResolver } from '@/modules/pets/domain/ports/pet-photo-url-resolver';
import {
  PetRepository,
  PetWithRole,
} from '@/modules/pets/domain/repositories/pet.repository';
import { ListPetsUseCase } from './list-pets.use-case';

const USER_ID = '0198a1f0-3d5c-7f21-b0a1-6f1c9e2d4b77';

function buildPet(
  id: string,
  name: string,
  photoKey: string | null = null,
): Pet {
  return new Pet({
    id,
    name,
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
    photoKey,
    lostMode: false,
    lastPosition: null,
    lastCommunicationAt: null,
    createdAt: new Date('2026-08-01T10:00:00.000Z'),
    updatedAt: new Date('2026-08-01T10:00:00.000Z'),
  });
}

describe('R7: ListPetsUseCase devuelve solo las membresias activas del usuario', () => {
  it('delega en findAllByMember y devuelve cada mascota con su rol', async () => {
    const memberships: PetWithRole[] = [
      {
        pet: buildPet('0198b2c3-4d5e-7a01-b234-56789abcdef0', 'Firulais'),
        role: 'owner',
      },
      {
        pet: buildPet('0198b2c3-4d5e-7a01-b234-56789abcdef1', 'Michi'),
        role: 'family',
      },
    ];
    const findAllByMember = jest.fn().mockResolvedValue(memberships);
    const useCase = new ListPetsUseCase({
      findAllByMember,
    } as unknown as PetRepository);

    const result = await useCase.execute(USER_ID);

    expect(findAllByMember).toHaveBeenCalledWith(USER_ID);
    expect(result).toEqual(memberships);
  });

  it('devuelve array vacio para un usuario sin membresias (nunca error)', async () => {
    const useCase = new ListPetsUseCase({
      findAllByMember: jest.fn().mockResolvedValue([]),
    } as unknown as PetRepository);

    await expect(useCase.execute(USER_ID)).resolves.toEqual([]);
  });
});

describe('R1 (pets-list-response-enrichment #66): el listado resuelve photoUrl por mascota con foto y deja null sin foto', () => {
  it('conserva orden y rol, y firma una vez cada mascota con foto usando el TTL compartido', async () => {
    const memberships: PetWithRole[] = [
      {
        pet: buildPet(
          '0198b2c3-4d5e-7a01-b234-56789abcdef0',
          'A',
          'pets/a/photo-1',
        ),
        role: 'owner',
      },
      {
        pet: buildPet(
          '0198b2c3-4d5e-7a01-b234-56789abcdef1',
          'B',
          null,
        ),
        role: 'family',
      },
      {
        pet: buildPet(
          '0198b2c3-4d5e-7a01-b234-56789abcdef2',
          'C',
          'pets/c/photo-2',
        ),
        role: 'vet',
      },
    ];
    const findAllByMember = jest.fn().mockResolvedValue(memberships);
    const repo = { findAllByMember } as unknown as PetRepository;
    const resolveDownloadUrl = jest.fn((key: string) =>
      Promise.resolve(`https://signed.example/${key}`),
    );
    const resolver: PetPhotoUrlResolver = { resolveDownloadUrl };
    const useCase = new ListPetsUseCase(repo, resolver);

    const result = await useCase.execute(USER_ID);

    expect(result).toHaveLength(3);
    expect(result.map((item) => item.photoUrl)).toEqual([
      'https://signed.example/pets/a/photo-1',
      null,
      'https://signed.example/pets/c/photo-2',
    ]);
    expect(result.map((item) => item.role)).toEqual([
      'owner',
      'family',
      'vet',
    ]);
    expect(resolveDownloadUrl).toHaveBeenCalledTimes(2);
    expect(resolveDownloadUrl).toHaveBeenNthCalledWith(
      1,
      'pets/a/photo-1',
      3600,
    );
    expect(resolveDownloadUrl).toHaveBeenNthCalledWith(
      2,
      'pets/c/photo-2',
      3600,
    );
  });

  it('devuelve [] sin invocar el resolver cuando no hay membresias', async () => {
    const repo = {
      findAllByMember: jest.fn().mockResolvedValue([]),
    } as unknown as PetRepository;
    const resolveDownloadUrl = jest.fn();
    const resolver: PetPhotoUrlResolver = { resolveDownloadUrl };
    const useCase = new ListPetsUseCase(repo, resolver);

    await expect(useCase.execute(USER_ID)).resolves.toEqual([]);
    expect(resolveDownloadUrl).not.toHaveBeenCalled();
  });
});

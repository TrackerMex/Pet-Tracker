import { Pet } from '@/modules/pets/domain/entities/pet.entity';
import { PetNotFoundError } from '@/modules/pets/domain/errors/pet.errors';
import { PetDeviceReader } from '@/modules/pets/domain/ports/pet-device-reader';
import { PetPhotoUrlResolver } from '@/modules/pets/domain/ports/pet-photo-url-resolver';
import { PetVaccineReader } from '@/modules/pets/domain/ports/pet-vaccine-reader';
import { PetRepository } from '@/modules/pets/domain/repositories/pet.repository';
import { GetPetUseCase } from './get-pet.use-case';

const PET_ID = '0198b2c3-4d5e-7a01-b234-56789abcdef0';

function buildPet(overrides: Partial<{ photoKey: string | null }> = {}): Pet {
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
    photoKey: overrides.photoKey ?? null,
    lostMode: false,
    lastPosition: null,
    lastCommunicationAt: null,
    createdAt: new Date('2026-08-01T10:00:00.000Z'),
    updatedAt: new Date('2026-08-01T10:00:00.000Z'),
  });
}

function buildDeps(petOverrides: Partial<{ photoKey: string | null }> = {}) {
  const findById = jest.fn().mockResolvedValue(buildPet(petOverrides));
  const findActiveDevice = jest.fn().mockResolvedValue(null);
  const resolveDownloadUrl = jest
    .fn()
    .mockResolvedValue('https://example.local/signed-get-url');
  const pets = { findById } as unknown as PetRepository;
  const deviceReader: PetDeviceReader = { findActiveDevice };
  const photoUrlResolver: PetPhotoUrlResolver = { resolveDownloadUrl };
  const findNextVaccine = jest.fn().mockResolvedValue(null);
  const vaccineReader: PetVaccineReader = { findNextVaccine };

  return {
    pets,
    deviceReader,
    photoUrlResolver,
    vaccineReader,
    findById,
    findActiveDevice,
    resolveDownloadUrl,
    findNextVaccine,
  };
}

describe('R8: GetPetUseCase devuelve la mascota para el perfil de detalle', () => {
  it('delega en findById y devuelve la entidad', async () => {
    const deps = buildDeps();
    const useCase = new GetPetUseCase(
      deps.pets,
      deps.deviceReader,
      deps.photoUrlResolver,
      deps.vaccineReader,
    );

    const profile = await useCase.execute(PET_ID);

    expect(deps.findById).toHaveBeenCalledWith(PET_ID);
    expect(profile.pet.id).toBe(PET_ID);
  });
});

describe('R9: si la fila desaparecio tras pasar el guard, el use case lanza PetNotFoundError', () => {
  it('lanza PetNotFoundError para un id sin fila (delete concurrente)', async () => {
    const deps = buildDeps();
    deps.findById.mockResolvedValue(null);
    const useCase = new GetPetUseCase(
      deps.pets,
      deps.deviceReader,
      deps.photoUrlResolver,
      deps.vaccineReader,
    );

    await expect(useCase.execute(PET_ID)).rejects.toThrow(PetNotFoundError);
    expect(deps.findActiveDevice).not.toHaveBeenCalled();
    expect(deps.resolveDownloadUrl).not.toHaveBeenCalled();
  });
});

describe('R12 (devices-claim): el perfil incluye el collar activo del puerto', () => {
  it('devuelve el device que reporta PET_DEVICE_READER', async () => {
    const deps = buildDeps();
    deps.findActiveDevice.mockResolvedValue({
      model: 'sim-collar',
      batteryPct: null,
      connectivity: null,
      lastMessageAt: null,
      esn: 'SIM-001',
    });
    const useCase = new GetPetUseCase(
      deps.pets,
      deps.deviceReader,
      deps.photoUrlResolver,
      deps.vaccineReader,
    );

    const profile = await useCase.execute(PET_ID);

    expect(deps.findActiveDevice).toHaveBeenCalledWith(PET_ID);
    expect(profile.device).toEqual({
      model: 'sim-collar',
      batteryPct: null,
      connectivity: null,
      lastMessageAt: null,
      esn: 'SIM-001',
    });
  });

  it('sin collar activo la clave device sigue siendo null', async () => {
    const deps = buildDeps();
    const useCase = new GetPetUseCase(
      deps.pets,
      deps.deviceReader,
      deps.photoUrlResolver,
      deps.vaccineReader,
    );

    const profile = await useCase.execute(PET_ID);

    expect(profile.device).toBeNull();
  });
});

describe('R6 (pet-photos-s3 #6): con photoKey no nulo, photoUrl viene de PET_PHOTO_URL_RESOLVER (1 h)', () => {
  it('invoca resolveDownloadUrl con la clave y expiresInSeconds = 3600', async () => {
    const deps = buildDeps({ photoKey: 'pets/pet-id/photo-123' });
    const useCase = new GetPetUseCase(
      deps.pets,
      deps.deviceReader,
      deps.photoUrlResolver,
      deps.vaccineReader,
    );

    const profile = await useCase.execute(PET_ID);

    expect(deps.resolveDownloadUrl).toHaveBeenCalledWith(
      'pets/pet-id/photo-123',
      3600,
    );
    expect(profile.photoUrl).toBe('https://example.local/signed-get-url');
  });
});

describe('R7 (pet-photos-s3 #6): con photoKey nulo, photoUrl es null sin invocar el resolver', () => {
  it('no llama a PET_PHOTO_URL_RESOLVER cuando la mascota no tiene foto', async () => {
    const deps = buildDeps({ photoKey: null });
    const useCase = new GetPetUseCase(
      deps.pets,
      deps.deviceReader,
      deps.photoUrlResolver,
      deps.vaccineReader,
    );

    const profile = await useCase.execute(PET_ID);

    expect(deps.resolveDownloadUrl).not.toHaveBeenCalled();
    expect(profile.photoUrl).toBeNull();
  });
});

describe('R13 (health-vaccines #14): el perfil consulta la proxima vacuna futura', () => {
  it('devuelve el valor del PET_VACCINE_READER usando la fecha actual', async () => {
    jest.useFakeTimers({ now: new Date('2026-08-09T12:00:00.000Z') });
    const deps = buildDeps();
    deps.findNextVaccine.mockResolvedValue({
      id: '0198dead-beef-7c23-d456-789abcdef012',
      name: 'Rabia',
      nextDoseAt: '2026-08-10',
    });
    const useCase = new GetPetUseCase(
      deps.pets,
      deps.deviceReader,
      deps.photoUrlResolver,
      deps.vaccineReader,
    );

    const profile = await useCase.execute(PET_ID);

    expect(deps.findNextVaccine).toHaveBeenCalledWith(PET_ID, '2026-08-09');
    expect(profile.nextVaccine).toEqual({
      id: '0198dead-beef-7c23-d456-789abcdef012',
      name: 'Rabia',
      nextDoseAt: '2026-08-10',
    });
    jest.useRealTimers();
  });
});

import { Pet } from '@/modules/pets/domain/entities/pet.entity';
import { toPetProfileResponse } from './pet-profile-response.mapper';

const PET_ID = '0198b2c3-4d5e-7a01-b234-56789abcdef0';
const NOW = new Date('2026-08-01T12:00:00.000Z');

function buildPet(
  overrides: Partial<ConstructorParameters<typeof Pet>[0]> = {},
): Pet {
  return new Pet({
    id: PET_ID,
    name: 'Firulais',
    species: 'dog',
    breed: 'Labrador',
    birthDate: '2024-01-15',
    approxAgeMonths: null,
    sex: 'male',
    currentWeightKg: 25.5,
    size: 'large',
    color: 'golden',
    sterilized: true,
    microchip: '985112004567890',
    photoKey: null,
    lostMode: false,
    lastPosition: null,
    lastCommunicationAt: null,
    createdAt: new Date('2026-07-01T10:00:00.000Z'),
    updatedAt: new Date('2026-07-15T10:00:00.000Z'),
    ...overrides,
  });
}

describe('R8: el perfil de mascota expone exactamente las claves del contrato', () => {
  it('serializa las 24 claves fijadas, sin extras ni faltantes', () => {
    const response = toPetProfileResponse(buildPet(), 'owner', NOW);

    expect(Object.keys(response).sort()).toEqual(
      [
        'id',
        'name',
        'species',
        'breed',
        'sex',
        'birthDate',
        'approxAgeMonths',
        'ageMonths',
        'currentWeightKg',
        'size',
        'color',
        'sterilized',
        'microchip',
        'photoUrl',
        'lostMode',
        'lastPosition',
        'lastCommunicationAt',
        'myRole',
        'device',
        'nextVaccine',
        'nextReminder',
        'activitySummary',
        'createdAt',
        'updatedAt',
      ].sort(),
    );
  });

  it('device, nextVaccine, nextReminder y activitySummary estan presentes con null', () => {
    const response = toPetProfileResponse(buildPet(), 'owner', NOW);

    expect(response.device).toBeNull();
    expect(response.nextVaccine).toBeNull();
    expect(response.nextReminder).toBeNull();
    expect(response.activitySummary).toBeNull();
  });

  it('photoUrl es null por defecto; lastPosition y lastCommunicationAt son null mientras #8 no los alimente', () => {
    const response = toPetProfileResponse(buildPet(), 'owner', NOW);

    expect(response.photoUrl).toBeNull();
    expect(response.lastPosition).toBeNull();
    expect(response.lastCommunicationAt).toBeNull();
  });

  it('incluye ageMonths calculado (R6) y el myRole recibido', () => {
    const response = toPetProfileResponse(buildPet(), 'family', NOW);

    // 2024-01-15 -> 2026-08-01: 30 meses completos.
    expect(response.ageMonths).toBe(30);
    expect(response.myRole).toBe('family');
  });

  it('serializa los instantes como ISO strings', () => {
    const response = toPetProfileResponse(buildPet(), 'owner', NOW);

    expect(response.createdAt).toBe('2026-07-01T10:00:00.000Z');
    expect(response.updatedAt).toBe('2026-07-15T10:00:00.000Z');
  });
});

describe('R6 (pet-photos-s3 #6): photoUrl recibido se incluye tal cual', () => {
  it('con un photoUrl no nulo, el mapper lo devuelve sin transformar', () => {
    const response = toPetProfileResponse(
      buildPet(),
      'owner',
      NOW,
      null,
      'https://example.local/signed-get-url',
    );

    expect(response.photoUrl).toBe('https://example.local/signed-get-url');
  });
});

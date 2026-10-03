import { Logger } from '@nestjs/common';
import type { PetRepository } from '@/modules/pets/domain/repositories/pet.repository';
import { ownerLocalDay } from './owner-local-day';

const PET_ID = '0198b2c3-4d5e-7a01-b234-56789abcdef0';
const NOW = new Date('2026-08-11T02:00:00.000Z');

describe('R3 (vaccine-applied-at-owner-timezone #88): ownerLocalDay resuelve el dia civil del owner y degrada a UTC con un warn', () => {
  let warnSpy: jest.SpyInstance;

  beforeEach(() => {
    warnSpy = jest.spyOn(Logger.prototype, 'warn').mockImplementation();
  });

  afterEach(() => {
    warnSpy.mockRestore();
  });

  it('con zona IANA valida devuelve el dia local de now sin avisar', async () => {
    const findOwnerTimezone = jest
      .fn()
      .mockResolvedValue('America/Mexico_City');
    const pets = { findOwnerTimezone } as unknown as PetRepository;

    await expect(ownerLocalDay(pets, PET_ID, NOW)).resolves.toBe('2026-08-10');
    expect(findOwnerTimezone).toHaveBeenCalledWith(PET_ID);
    expect(warnSpy).not.toHaveBeenCalled();
  });

  it('sin owner activo (null) devuelve el dia UTC de now y avisa una vez', async () => {
    const findOwnerTimezone = jest.fn().mockResolvedValue(null);
    const pets = { findOwnerTimezone } as unknown as PetRepository;

    await expect(ownerLocalDay(pets, PET_ID, NOW)).resolves.toBe('2026-08-11');
    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(warnSpy).toHaveBeenCalledWith(
      expect.objectContaining({ petId: PET_ID, timezone: null }),
    );
  });

  it("con 'Not/A/Zone' devuelve el dia UTC de now y avisa una vez", async () => {
    const findOwnerTimezone = jest.fn().mockResolvedValue('Not/A/Zone');
    const pets = { findOwnerTimezone } as unknown as PetRepository;

    await expect(ownerLocalDay(pets, PET_ID, NOW)).resolves.toBe('2026-08-11');
    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(warnSpy).toHaveBeenCalledWith(
      expect.objectContaining({ petId: PET_ID, timezone: 'Not/A/Zone' }),
    );
  });
});

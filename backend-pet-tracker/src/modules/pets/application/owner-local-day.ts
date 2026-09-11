import type { PetRepository } from '@/modules/pets/domain/repositories/pet.repository';
import { localDayOf } from '@/pipeline/local-day';

export async function ownerLocalDay(
  pets: PetRepository,
  petId: string,
  now: Date,
): Promise<string> {
  const timezone = await pets.findOwnerTimezone(petId);
  return localDayOf(now.getTime(), timezone ?? 'UTC');
}

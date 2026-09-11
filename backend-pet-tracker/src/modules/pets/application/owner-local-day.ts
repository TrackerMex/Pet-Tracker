import { Logger } from '@nestjs/common';
import type { PetRepository } from '@/modules/pets/domain/repositories/pet.repository';
import { isSupportedTimeZone, localDayOf } from '@/pipeline/local-day';

const logger = new Logger('ownerLocalDay');

export async function ownerLocalDay(
  pets: PetRepository,
  petId: string,
  now: Date,
): Promise<string> {
  const raw = await pets.findOwnerTimezone(petId);
  const timezone = raw !== null && isSupportedTimeZone(raw) ? raw : 'UTC';

  if (timezone !== raw) {
    logger.warn({
      scope: 'owner-local-day',
      petId,
      timezone: raw,
      message: 'falling back to UTC: owner timezone missing or not a IANA zone',
    });
  }

  return localDayOf(now.getTime(), timezone);
}

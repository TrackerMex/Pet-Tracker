import { Logger } from '@nestjs/common';
import type { PetRepository } from '@/modules/pets/domain/repositories/pet.repository';
import { isSupportedTimeZone, localDayOf } from '@/pipeline/local-day';

const logger = new Logger('ownerLocalDay');

export async function ownerLocalDay(
  pets: PetRepository,
  petId: string,
  now: Date,
): Promise<string> {
  return localDayInZone(await pets.findOwnerTimezone(petId), now, {
    scope: 'owner-local-day',
    petId,
  });
}

export function localDayInZone(
  raw: string | null,
  now: Date,
  context: Record<string, unknown>,
): string {
  const timezone = raw !== null && isSupportedTimeZone(raw) ? raw : 'UTC';

  if (timezone !== raw) {
    logger.warn({
      ...context,
      timezone: raw,
      message: 'falling back to UTC: timezone missing or not a IANA zone',
    });
  }

  return localDayOf(now.getTime(), timezone);
}

import type { UserRepository } from '@/modules/auth/domain/repositories/user.repository';
import { localDayInZone } from './owner-local-day';

export async function requesterLocalDay(
  users: UserRepository,
  userId: string,
  now: Date,
): Promise<string> {
  const user = await users.findById(userId);
  return localDayInZone(user?.timezone ?? null, now, {
    scope: 'requester-local-day',
    userId,
  });
}

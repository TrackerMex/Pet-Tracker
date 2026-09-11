import type { UserRepository } from '@/modules/auth/domain/repositories/user.repository';
import { localDayOf } from '@/pipeline/local-day';

export async function requesterLocalDay(
  users: UserRepository,
  userId: string,
  now: Date,
): Promise<string> {
  const user = await users.findById(userId);
  return localDayOf(now.getTime(), user?.timezone ?? 'UTC');
}

import { Inject, Injectable } from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DRIZZLE } from '@/db/drizzle.constants';
import { users } from '@/db/schema/users.schema';
import { petUsers } from '@/db/schema/pets.schema';
import { auditLog } from '@/db/schema/audit-log.schema';
import { UserNotFoundError } from '@/modules/auth/domain/errors/user.errors';
import { deletePetsTx } from '@/modules/pets/infrastructure/repositories/delete-pets.tx';
import type { AccountDeletionRepository } from '@/modules/users/domain/repositories/account-deletion.repository';

@Injectable()
export class AccountDeletionDrizzleRepository implements AccountDeletionRepository {
  constructor(@Inject(DRIZZLE) private readonly db: NodePgDatabase) {}

  deleteAccount(userId: string): Promise<string[]> {
    return this.db.transaction(async (tx) => {
      const [user] = await tx
        .select({ id: users.id })
        .from(users)
        .where(eq(users.id, userId))
        .for('update');
      if (!user) throw new UserNotFoundError(userId);
      const owned = await tx
        .select({ petId: petUsers.petId })
        .from(petUsers)
        .where(and(eq(petUsers.userId, userId), eq(petUsers.role, 'owner')));
      const petIds = owned.map(({ petId }) => petId);
      await tx.insert(auditLog).values({
        userId,
        action: 'user.delete',
        entity: 'user',
        entityId: userId,
        meta: { petIds },
      });
      if (petIds.length > 0) await deletePetsTx(tx, petIds);
      await tx.delete(users).where(eq(users.id, userId));
      return petIds;
    });
  }
}

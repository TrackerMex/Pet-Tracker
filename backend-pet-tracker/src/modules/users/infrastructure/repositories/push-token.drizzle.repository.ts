import { Inject, Injectable } from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { uuidv7 } from 'uuidv7';
import { DRIZZLE } from '@/db/drizzle.constants';
import { petUsers } from '@/db/schema/pets.schema';
import { pushTokens } from '@/db/schema/push-tokens.schema';
import type {
  PushPlatform,
  PushTokenRepository,
  PushTokenRow,
  UpsertPushTokenInput,
} from '@/modules/users/domain/repositories/push-token.repository';

const ACTIVE_STATUS = 'active';

/**
 * Implementacion Drizzle del puerto de push tokens (R3, R5, R8, R12).
 * Cobertura contra Postgres real en test/alerts-center-notifier.e2e-spec.ts,
 * mismo criterio que el resto de repositorios del proyecto.
 */
@Injectable()
export class PushTokenDrizzleRepository implements PushTokenRepository {
  constructor(@Inject(DRIZZLE) private readonly db: NodePgDatabase) {}

  /**
   * R3: `id` y `created_at` solo entran en el INSERT — el `set` del conflicto
   * no los toca, asi que N llamadas dejan 1 fila con el mismo `id`.
   */
  async upsert(input: UpsertPushTokenInput): Promise<PushTokenRow> {
    const [row] = await this.db
      .insert(pushTokens)
      .values({
        id: uuidv7(),
        userId: input.userId,
        expoToken: input.expoToken,
        platform: input.platform,
        lastSeenAt: input.lastSeenAt,
      })
      .onConflictDoUpdate({
        target: pushTokens.expoToken,
        set: {
          userId: input.userId,
          platform: input.platform,
          lastSeenAt: input.lastSeenAt,
        },
      })
      .returning({
        id: pushTokens.id,
        platform: pushTokens.platform,
        createdAt: pushTokens.createdAt,
        lastSeenAt: pushTokens.lastSeenAt,
      });

    return { ...row, platform: row.platform as PushPlatform };
  }

  async deleteOwnedByUser(userId: string, expoToken: string): Promise<void> {
    await this.db
      .delete(pushTokens)
      .where(
        and(eq(pushTokens.userId, userId), eq(pushTokens.expoToken, expoToken)),
      );
  }

  /**
   * R8: INNER JOIN con `pet_users` activo, sin filtrar por `role`. La PK
   * compuesta (pet_id, user_id) impide que un usuario aparezca dos veces.
   */
  async findActiveMembersTokens(petId: string): Promise<string[]> {
    const rows = await this.db
      .select({ expoToken: pushTokens.expoToken })
      .from(pushTokens)
      .innerJoin(
        petUsers,
        and(
          eq(petUsers.userId, pushTokens.userId),
          eq(petUsers.petId, petId),
          eq(petUsers.status, ACTIVE_STATUS),
        ),
      );

    return rows.map((row) => row.expoToken);
  }

  async deleteByToken(expoToken: string): Promise<void> {
    await this.db.delete(pushTokens).where(eq(pushTokens.expoToken, expoToken));
  }
}

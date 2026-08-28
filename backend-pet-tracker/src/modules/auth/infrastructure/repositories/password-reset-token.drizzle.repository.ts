import { Inject, Injectable } from '@nestjs/common';
import { and, eq, isNull } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { uuidv7 } from 'uuidv7';
import { DRIZZLE } from '@/db/drizzle.constants';
import { passwordResetTokens } from '@/db/schema/password-reset-tokens.schema';
import {
  NewPasswordResetToken,
  PasswordResetTokenRepository,
} from '@/modules/auth/domain/repositories/password-reset-token.repository';

@Injectable()
export class PasswordResetTokenDrizzleRepository implements PasswordResetTokenRepository {
  constructor(@Inject(DRIZZLE) private readonly db: NodePgDatabase) {}

  async create(token: NewPasswordResetToken): Promise<void> {
    await this.db
      .insert(passwordResetTokens)
      .values({ id: uuidv7(), ...token });
  }

  async invalidateAllForUser(
    userId: string,
    invalidatedAt: Date,
  ): Promise<void> {
    await this.db
      .update(passwordResetTokens)
      .set({ usedAt: invalidatedAt })
      .where(
        and(
          eq(passwordResetTokens.userId, userId),
          isNull(passwordResetTokens.usedAt),
        ),
      );
  }
}

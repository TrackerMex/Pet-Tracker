import { Inject, Injectable } from '@nestjs/common';
import { and, eq, isNull } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { uuidv7 } from 'uuidv7';
import { DRIZZLE } from '@/db/drizzle.constants';
import { passwordResetTokens } from '@/db/schema/password-reset-tokens.schema';
import { PasswordResetToken } from '@/modules/auth/domain/entities/password-reset-token.entity';
import {
  NewPasswordResetToken,
  PasswordResetTokenRepository,
} from '@/modules/auth/domain/repositories/password-reset-token.repository';

type PasswordResetTokenRow = typeof passwordResetTokens.$inferSelect;

@Injectable()
export class PasswordResetTokenDrizzleRepository implements PasswordResetTokenRepository {
  constructor(@Inject(DRIZZLE) private readonly db: NodePgDatabase) {}

  async create(token: NewPasswordResetToken): Promise<void> {
    await this.db
      .insert(passwordResetTokens)
      .values({ id: uuidv7(), ...token });
  }

  async findByTokenHash(tokenHash: string): Promise<PasswordResetToken | null> {
    const [row] = await this.db
      .select()
      .from(passwordResetTokens)
      .where(eq(passwordResetTokens.tokenHash, tokenHash))
      .limit(1);

    return row ? toDomain(row) : null;
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

function toDomain(row: PasswordResetTokenRow): PasswordResetToken {
  return new PasswordResetToken({
    id: row.id,
    userId: row.userId,
    tokenHash: row.tokenHash,
    expiresAt: row.expiresAt,
    usedAt: row.usedAt,
    createdAt: row.createdAt,
  });
}

import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { uuidv7 } from 'uuidv7';
import { DRIZZLE } from '@/db/drizzle.constants';
import { emailVerificationTokens } from '@/db/schema/email-verification-tokens.schema';
import { EmailVerificationToken } from '../../domain/entities/email-verification-token.entity';
import {
  EmailVerificationTokenRepository,
  NewEmailVerificationToken,
} from '../../domain/repositories/email-verification-token.repository';

type EmailVerificationTokenRow = typeof emailVerificationTokens.$inferSelect;

@Injectable()
export class EmailVerificationTokenDrizzleRepository implements EmailVerificationTokenRepository {
  constructor(@Inject(DRIZZLE) private readonly db: NodePgDatabase) {}

  async create(token: NewEmailVerificationToken): Promise<void> {
    await this.db
      .insert(emailVerificationTokens)
      .values({ id: uuidv7(), ...token });
  }

  async findByTokenHash(
    tokenHash: string,
  ): Promise<EmailVerificationToken | null> {
    const [row] = await this.db
      .select()
      .from(emailVerificationTokens)
      .where(eq(emailVerificationTokens.tokenHash, tokenHash))
      .limit(1);

    return row ? toDomain(row) : null;
  }

  async markUsed(id: string, usedAt: Date): Promise<void> {
    await this.db
      .update(emailVerificationTokens)
      .set({ usedAt })
      .where(eq(emailVerificationTokens.id, id));
  }
}

function toDomain(row: EmailVerificationTokenRow): EmailVerificationToken {
  return new EmailVerificationToken({
    id: row.id,
    userId: row.userId,
    tokenHash: row.tokenHash,
    expiresAt: row.expiresAt,
    usedAt: row.usedAt,
    createdAt: row.createdAt,
  });
}

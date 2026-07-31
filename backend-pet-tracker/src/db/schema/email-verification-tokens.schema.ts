import { char, index, pgTable, timestamp, uuid } from 'drizzle-orm/pg-core';
import { users } from './users.schema';

// Token opaco de un solo uso para verificar el email del registro
// (specs/auth-registration/design.md). Solo se persiste el SHA-256 del token
// en hexadecimal (64 caracteres): el valor en claro nunca toca la base.
export const emailVerificationTokens = pgTable(
  'email_verification_tokens',
  {
    id: uuid('id').primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    tokenHash: char('token_hash', { length: 64 }).notNull().unique(),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    usedAt: timestamp('used_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [index('email_verification_tokens_user_id_idx').on(table.userId)],
);

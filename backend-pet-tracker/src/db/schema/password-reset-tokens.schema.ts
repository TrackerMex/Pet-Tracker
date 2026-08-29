import { char, index, pgTable, timestamp, uuid } from 'drizzle-orm/pg-core';
import { users } from './users.schema';

// Token opaco de un solo uso para recuperar una cuenta. Solo se persiste el
// SHA-256 hexadecimal; el token en claro se entrega al sender (R10).
export const passwordResetTokens = pgTable(
  'password_reset_tokens',
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
  (table) => [index('password_reset_tokens_user_id_idx').on(table.userId)],
);

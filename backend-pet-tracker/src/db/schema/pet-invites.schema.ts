import { sql } from 'drizzle-orm';
import {
  char,
  check,
  index,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { pets } from './pets.schema';
import { users } from './users.schema';

export const petInvites = pgTable(
  'pet_invites',
  {
    id: uuid('id').primaryKey(),
    petId: uuid('pet_id')
      .notNull()
      .references(() => pets.id, { onDelete: 'cascade' }),
    codeHash: char('code_hash', { length: 64 }).notNull().unique(),
    role: varchar('role', { length: 10 }).notNull(),
    createdBy: uuid('created_by')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    acceptedBy: uuid('accepted_by').references(() => users.id, {
      onDelete: 'set null',
    }),
    acceptedAt: timestamp('accepted_at', { withTimezone: true }),
    revokedAt: timestamp('revoked_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    check('pet_invites_role_check', sql`${table.role} in ('family')`),
    index('pet_invites_pet_id_idx').on(table.petId),
    index('pet_invites_created_by_idx').on(table.createdBy),
    index('pet_invites_accepted_by_idx').on(table.acceptedBy),
  ],
);

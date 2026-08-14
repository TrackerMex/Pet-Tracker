import { sql } from 'drizzle-orm';
import {
  check,
  index,
  integer,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { pets } from './pets.schema';
import { users } from './users.schema';

export const reminders = pgTable(
  'reminders',
  {
    id: uuid('id').primaryKey(),
    petId: uuid('pet_id')
      .notNull()
      .references(() => pets.id, { onDelete: 'cascade' }),
    type: varchar('type', { length: 20 }).notNull(),
    title: varchar('title', { length: 120 }).notNull(),
    dueAt: timestamp('due_at', { withTimezone: true }).notNull(),
    advanceMinutes: integer('advance_minutes').notNull().default(60),
    channel: varchar('channel', { length: 10 }).notNull().default('push'),
    status: varchar('status', { length: 10 }).notNull().default('scheduled'),
    scheduleName: varchar('schedule_name', { length: 64 }),
    enqueuedAt: timestamp('enqueued_at', { withTimezone: true }),
    createdBy: uuid('created_by')
      .notNull()
      .references(() => users.id),
  },
  (table) => [
    check(
      'reminders_type_check',
      sql`${table.type} in ('vaccine', 'deworming', 'medication', 'appointment', 'weight', 'food', 'custom')`,
    ),
    check(
      'reminders_advance_minutes_check',
      sql`${table.advanceMinutes} between 0 and 10080`,
    ),
    check('reminders_channel_check', sql`${table.channel} in ('push')`),
    check(
      'reminders_status_check',
      sql`${table.status} in ('scheduled', 'sent', 'cancelled')`,
    ),
    index('reminders_pet_id_idx').on(table.petId),
    index('reminders_created_by_idx').on(table.createdBy),
    index('reminders_due_at_scheduled_idx')
      .on(table.dueAt)
      .where(sql`${table.status} = 'scheduled'`),
  ],
);

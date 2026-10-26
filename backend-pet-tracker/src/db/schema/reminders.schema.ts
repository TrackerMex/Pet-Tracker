import { sql } from 'drizzle-orm';
import {
  check,
  date,
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
    recurrenceUnit: varchar('recurrence_unit', { length: 5 }),
    recurrenceEvery: integer('recurrence_every'),
    recurrenceUntil: date('recurrence_until'),
    recurrenceAnchorAt: timestamp('recurrence_anchor_at', {
      withTimezone: true,
    }),
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
    check(
      'reminders_recurrence_unit_check',
      sql`${table.recurrenceUnit} in ('hour', 'day', 'week', 'month', 'year')`,
    ),
    check(
      'reminders_recurrence_every_check',
      sql`case ${table.recurrenceUnit} when 'hour' then ${table.recurrenceEvery} between 1 and 24 when 'day' then ${table.recurrenceEvery} between 1 and 365 when 'week' then ${table.recurrenceEvery} between 1 and 52 when 'month' then ${table.recurrenceEvery} between 1 and 12 when 'year' then ${table.recurrenceEvery} between 1 and 10 else true end`,
    ),
    check(
      'reminders_recurrence_shape_check',
      sql`(${table.recurrenceUnit} is null and ${table.recurrenceEvery} is null and ${table.recurrenceUntil} is null and ${table.recurrenceAnchorAt} is null) or (${table.recurrenceUnit} is not null and ${table.recurrenceEvery} is not null and ${table.recurrenceAnchorAt} is not null)`,
    ),
    index('reminders_pet_id_idx').on(table.petId),
    index('reminders_created_by_idx').on(table.createdBy),
    index('reminders_due_at_scheduled_idx')
      .on(table.dueAt)
      .where(sql`${table.status} = 'scheduled'`),
  ],
);

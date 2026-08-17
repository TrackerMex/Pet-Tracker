import { sql } from 'drizzle-orm';
import { check, pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { devices } from './devices.schema';

// Una fila por collar: device_id es PK porque el MVP no conserva historial.
// No necesita indices extra; la PK cubre la FK y todos los accesos son por device_id.
export const deviceSubscriptions = pgTable(
  'device_subscriptions',
  {
    deviceId: uuid('device_id')
      .primaryKey()
      .references(() => devices.id),
    status: varchar('status', { length: 16 }).notNull(),
    planCode: varchar('plan_code', { length: 32 }).notNull(),
    currentPeriodEnd: timestamp('current_period_end', {
      withTimezone: true,
    }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    check(
      'device_subscriptions_status_check',
      sql`${table.status} in ('active', 'canceled')`,
    ),
    check(
      'device_subscriptions_plan_code_check',
      sql`${table.planCode} in ('track_monthly', 'grandfathered')`,
    ),
  ],
);

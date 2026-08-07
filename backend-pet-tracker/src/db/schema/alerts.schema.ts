import { sql } from 'drizzle-orm';
import {
  check,
  index,
  jsonb,
  pgTable,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { geofences } from './geofences.schema';
import { pets } from './pets.schema';

// Alertas (docs/data-model.md fila `alert_events`, alerts-engine R1/R2).
// `type` CHECK reducido a 'geofence_exit'/'battery_low' (unico criterio que
// esta feature produce, mismo patron que `geofences.type` de #11 — se
// amplia con ALTER TABLE cuando `device_offline`/`position_stale` tengan un
// productor real). `status` admite las 3 del doc ('open','acked','closed')
// aunque esta feature solo escribe 'open'/'closed' — 'acked' lo escribira
// alerts-center-notifier (#13) sin necesitar una migracion de CHECK nueva.
// `geofence_id` ON DELETE SET NULL (D1-A): la fila sobrevive al borrado de
// la geocerca que la origino; `payload` ya conserva su nombre al abrir.
// Indice unico parcial anti-spam: una alerta ACTIVA por (pet_id, type,
// geofence_id) — `coalesce` con el literal uuid_nil (D4, sin extension
// uuid-ossp) trata `geofence_id IS NULL` (alertas de bateria) como un slot
// propio. #13 (D1) amplio el predicado de `status = 'open'` a
// `status <> 'closed'`: en cuanto existe `acked`, "activa" dejo de ser
// sinonimo de `open` y un ack del usuario no debe reabrir el anti-spam.
export const alertEvents = pgTable(
  'alert_events',
  {
    id: uuid('id').primaryKey(),
    petId: uuid('pet_id')
      .notNull()
      .references(() => pets.id, { onDelete: 'cascade' }),
    geofenceId: uuid('geofence_id').references(() => geofences.id, {
      onDelete: 'set null',
    }),
    type: varchar('type', { length: 20 }).notNull(),
    status: varchar('status', { length: 10 }).notNull().default('open'),
    payload: jsonb('payload').notNull().$type<Record<string, unknown>>(),
    openedAt: timestamp('opened_at', { withTimezone: true }).notNull(),
    ackedAt: timestamp('acked_at', { withTimezone: true }),
    closedAt: timestamp('closed_at', { withTimezone: true }),
  },
  (table) => [
    check(
      'alert_events_type_check',
      sql`${table.type} in ('geofence_exit', 'battery_low')`,
    ),
    check(
      'alert_events_status_check',
      sql`${table.status} in ('open', 'acked', 'closed')`,
    ),
    index('alert_events_pet_id_idx').on(table.petId),
    index('alert_events_geofence_id_idx').on(table.geofenceId),
    uniqueIndex('alert_events_open_anti_spam_idx')
      .on(
        table.petId,
        table.type,
        sql`coalesce(${table.geofenceId}, '00000000-0000-0000-0000-000000000000'::uuid)`,
      )
      .where(sql`${table.status} <> 'closed'`),
  ],
);

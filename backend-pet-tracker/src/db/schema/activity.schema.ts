import { sql } from 'drizzle-orm';
import {
  check,
  date,
  integer,
  numeric,
  pgTable,
  primaryKey,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';
import { pets } from './pets.schema';

// KPIs diarios por mascota (docs/data-model.md fila `activity_daily`,
// trips-activity R10/D9). Unica tabla de la feature: cualquier otro cambio de
// modelo era condicion de STOP del plan 006.
//
// `date` es fecha de CALENDARIO en la timezone del owner con la que se
// computo la fila; si el owner cambia de zona, las filas historicas no se
// recomputan (decision D9, declarada fuera de alcance).
// `first_walk_at`/`last_walk_at` son INSTANTES ⇒ timestamptz, no `time`.
// `avg_walk_minutes` es numeric(6,2) y no `int` como decia el plan: con dos
// paseos de 5 y 6 min la media es 5,5 y redondearla inflaria el KPI un 9 %.
// `time_away_minutes` nace NULL y la rellena #13 desde `alert_events`; el
// upsert de esta feature la excluye del SET para no borrarla (R11).
// Sin indice manual para el FK `pet_id`: la PK compuesta ya lo cubre como
// primera columna (regla "toda FK lleva indice" de docs/data-model.md).
export const activityDaily = pgTable(
  'activity_daily',
  {
    petId: uuid('pet_id')
      .notNull()
      .references(() => pets.id, { onDelete: 'cascade' }),
    date: date('date').notNull(),
    distanceM: integer('distance_m').notNull(),
    activeMinutes: integer('active_minutes').notNull(),
    restMinutes: integer('rest_minutes').notNull(),
    walkCount: integer('walk_count').notNull(),
    avgWalkMinutes: numeric('avg_walk_minutes', {
      precision: 6,
      scale: 2,
    }).notNull(),
    firstWalkAt: timestamp('first_walk_at', { withTimezone: true }),
    lastWalkAt: timestamp('last_walk_at', { withTimezone: true }),
    timeAwayMinutes: integer('time_away_minutes'),
    computedAt: timestamp('computed_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    primaryKey({ columns: [table.petId, table.date] }),
    check('activity_daily_distance_m_check', sql`${table.distanceM} >= 0`),
    check(
      'activity_daily_active_minutes_check',
      sql`${table.activeMinutes} >= 0`,
    ),
    check('activity_daily_rest_minutes_check', sql`${table.restMinutes} >= 0`),
    check('activity_daily_walk_count_check', sql`${table.walkCount} >= 0`),
  ],
);

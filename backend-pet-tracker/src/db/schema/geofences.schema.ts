import { sql } from 'drizzle-orm';
import {
  boolean,
  check,
  index,
  jsonb,
  pgTable,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { pets } from './pets.schema';

/** Unico shape que el CRUD de esta feature produce (D1) — columna `geometry`. */
export interface GeofenceCircleColumn {
  shape: 'circle';
  centerLat: number;
  centerLng: number;
  radiusM: number;
}

/** Columna `geofence_state` (D2) — mismo shape que `GeofenceState` del entity. */
export interface GeofenceStateColumn {
  state: 'unknown' | 'inside' | 'outside';
  updatedAt: string | null;
}

// Geocercas (docs/data-model.md fila `geofences`, geofences-crud R1). `type`
// CHECK restringido a 'safe_circle' (D1/D5): el CRUD de esta feature no
// produce ningun otro valor todavia — se amplia con ALTER TABLE cuando una
// feature futura implemente el tipo correspondiente. `geometry` guarda
// {shape: 'circle', centerLat, centerLng, radiusM} (unico shape que el CRUD
// produce hoy; src/pipeline/geofence-eval.ts soporta ademas polygon a nivel
// de funcion pura). `geofence_state` = {state, updatedAt} (D2), default
// 'unknown'/null hasta que alerts-engine (#12) llame evaluate() — ningun
// caso de uso de esta feature escribe un valor distinto del default. Unico
// (pet_id, name) sirve a R7 (409 de nombre duplicado); btree sobre pet_id
// sirve a la regla "toda FK lleva indice" y ademas al COUNT de R6 y al
// listado ordenado de R8 (D5: un solo indice, tres usos).
export const geofences = pgTable(
  'geofences',
  {
    id: uuid('id').primaryKey(),
    petId: uuid('pet_id')
      .notNull()
      .references(() => pets.id, { onDelete: 'cascade' }),
    name: varchar('name', { length: 120 }).notNull(),
    type: varchar('type', { length: 20 }).notNull().default('safe_circle'),
    geometry: jsonb('geometry').notNull().$type<GeofenceCircleColumn>(),
    active: boolean('active').notNull().default(true),
    geofenceState: jsonb('geofence_state')
      .notNull()
      .$type<GeofenceStateColumn>()
      .default({ state: 'unknown', updatedAt: null }),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    check('geofences_type_check', sql`${table.type} in ('safe_circle')`),
    uniqueIndex('geofences_pet_id_name_idx').on(table.petId, table.name),
    index('geofences_pet_id_idx').on(table.petId),
  ],
);

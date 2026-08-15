import { sql } from 'drizzle-orm';
import {
  boolean,
  check,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { pets } from './pets.schema';

// Collares GPS (docs/data-model.md fila `devices`, devices-claim R1).
// Los 5 identificadores son UNIQUE NULL (decision D4); el claim solo busca
// por activation_code (#26), mientras los demas identifican inventario y
// permiten busquedas internas. `status` es cache de presentacion — la
// disponibilidad real
// se deriva de la fila activa en `pet_devices` (decision D3, R15).
// `battery_pct`/`connectivity`/`last_message_at` quedan NULL hasta que el
// pipeline de ingesta (#8) los alimente; `ingest_watermark` arranca en el
// claim (R3) y lo avanza el poller de #8. `wialon_unit_id` es text: id
// externo sin aritmetica, no se asume el formato de Wialon.
export const devices = pgTable(
  'devices',
  {
    id: uuid('id').primaryKey(),
    esn: varchar('esn', { length: 64 }).unique(),
    imei: varchar('imei', { length: 64 }).unique(),
    serialNumber: varchar('serial_number', { length: 64 }).unique(),
    activationCode: varchar('activation_code', { length: 64 }).unique(),
    wialonUnitId: text('wialon_unit_id').unique(),
    model: varchar('model', { length: 120 }),
    status: varchar('status', { length: 10 }).notNull().default('available'),
    batteryPct: integer('battery_pct'),
    connectivity: varchar('connectivity', { length: 20 }),
    lastMessageAt: timestamp('last_message_at', { withTimezone: true }),
    ingestWatermark: timestamp('ingest_watermark', { withTimezone: true }),
    isSimulated: boolean('is_simulated').notNull().default(false),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    check(
      'devices_status_check',
      sql`${table.status} in ('available', 'assigned', 'inactive')`,
    ),
  ],
);

// Historial de asignaciones collar-mascota (docs/data-model.md fila
// `pet_devices`): varias filas por par a lo largo del tiempo, a lo sumo una
// activa (`released_at IS NULL`). Los indices unicos parciales son el candado
// real de concurrencia del claim (R8): un device activo en una sola mascota,
// una mascota con un solo collar activo (decision D2). `device_id` sin
// CASCADE: los devices no se borran en el MVP. Las FKs llevan ademas indice
// btree normal (regla de docs/data-model.md) porque los parciales no cubren
// las consultas de historial.
export const petDevices = pgTable(
  'pet_devices',
  {
    id: uuid('id').primaryKey(),
    petId: uuid('pet_id')
      .notNull()
      .references(() => pets.id, { onDelete: 'cascade' }),
    deviceId: uuid('device_id')
      .notNull()
      .references(() => devices.id),
    assignedAt: timestamp('assigned_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    releasedAt: timestamp('released_at', { withTimezone: true }),
  },
  (table) => [
    uniqueIndex('pet_devices_active_device_id_idx')
      .on(table.deviceId)
      .where(sql`${table.releasedAt} is null`),
    uniqueIndex('pet_devices_active_pet_id_idx')
      .on(table.petId)
      .where(sql`${table.releasedAt} is null`),
    index('pet_devices_pet_id_idx').on(table.petId),
    index('pet_devices_device_id_idx').on(table.deviceId),
  ],
);

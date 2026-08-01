import { sql } from 'drizzle-orm';
import {
  boolean,
  check,
  date,
  index,
  integer,
  jsonb,
  numeric,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { users } from './users.schema';

// Columnas segun docs/data-model.md, fila `pets` (pets-crud-permissions R1).
// `birth_date` y `approx_age_months` son representaciones mutuamente
// excluyentes de la edad (R5/R14): el DTO garantiza el XOR, la base admite
// NULL en ambas solo como estado transitorio imposible via API.
// `last_position` / `last_communication_at` son cache desnormalizada que
// alimenta el pipeline de ingesta (#8); `photo_key` lo llena pet-photos-s3
// (#6); `lost_mode` queda para la feature que priorice el modo perdido.
export const pets = pgTable(
  'pets',
  {
    id: uuid('id').primaryKey(),
    name: varchar('name', { length: 120 }).notNull(),
    species: varchar('species', { length: 10 }).notNull(),
    breed: varchar('breed', { length: 120 }),
    birthDate: date('birth_date'),
    approxAgeMonths: integer('approx_age_months'),
    sex: varchar('sex', { length: 10 }),
    currentWeightKg: numeric('current_weight_kg', { precision: 5, scale: 2 }),
    size: varchar('size', { length: 10 }),
    color: varchar('color', { length: 60 }),
    sterilized: boolean('sterilized'),
    microchip: varchar('microchip', { length: 32 }),
    photoKey: text('photo_key'),
    lostMode: boolean('lost_mode').notNull().default(false),
    lastPosition: jsonb('last_position'),
    lastCommunicationAt: timestamp('last_communication_at', {
      withTimezone: true,
    }),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    check('pets_species_check', sql`${table.species} in ('dog', 'cat')`),
  ],
);

// Membresia usuario-mascota (docs/data-model.md, fila `pet_users`): toda
// autorizacion por mascota pasa por aqui (PetAccessGuard, R9-R12). PK
// compuesta (pet_id, user_id) — cubre el lookup del guard con pet_id como
// primera columna; user_id lleva indice propio para el listado (R7), regla
// "toda FK lleva indice" de docs/data-model.md. `permissions` se crea pero
// no se interpreta en el MVP (fuera de alcance de #5).
export const petUsers = pgTable(
  'pet_users',
  {
    petId: uuid('pet_id')
      .notNull()
      .references(() => pets.id, { onDelete: 'cascade' }),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    role: varchar('role', { length: 10 }).notNull(),
    permissions: jsonb('permissions'),
    status: varchar('status', { length: 20 }).notNull().default('active'),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    primaryKey({ columns: [table.petId, table.userId] }),
    check(
      'pet_users_role_check',
      sql`${table.role} in ('owner', 'family', 'walker', 'vet')`,
    ),
    index('pet_users_user_id_idx').on(table.userId),
  ],
);

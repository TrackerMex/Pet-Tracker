import { sql } from 'drizzle-orm';
import {
  check,
  date,
  index,
  integer,
  jsonb,
  numeric,
  pgTable,
  text,
  uniqueIndex,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { pets } from './pets.schema';
import { users } from './users.schema';
import type { VaccineScheme } from '@/modules/health/domain/entities/vaccine.entity';

export const vaccineCatalog = pgTable(
  'vaccine_catalog',
  {
    id: uuid('id').primaryKey(),
    species: varchar('species', { length: 10 }).notNull(),
    name: varchar('name', { length: 120 }).notNull(),
    scheme: jsonb('scheme').notNull().$type<VaccineScheme>(),
  },
  (table) => [
    check(
      'vaccine_catalog_species_check',
      sql`${table.species} in ('dog', 'cat')`,
    ),
    uniqueIndex('vaccine_catalog_species_name_idx').on(
      table.species,
      table.name,
    ),
  ],
);

export const petVaccines = pgTable(
  'pet_vaccines',
  {
    id: uuid('id').primaryKey(),
    petId: uuid('pet_id')
      .notNull()
      .references(() => pets.id, { onDelete: 'cascade' }),
    catalogId: uuid('catalog_id').references(() => vaccineCatalog.id),
    name: varchar('name', { length: 120 }).notNull(),
    appliedAt: date('applied_at').notNull(),
    nextDoseAt: date('next_dose_at'),
    vetName: varchar('vet_name', { length: 120 }),
    clinic: varchar('clinic', { length: 120 }),
    notes: text('notes'),
    documentKey: text('document_key'),
    createdBy: uuid('created_by')
      .notNull()
      .references(() => users.id),
  },
  (table) => [
    index('pet_vaccines_pet_id_applied_at_idx').on(
      table.petId,
      table.appliedAt.desc(),
    ),
    index('pet_vaccines_catalog_id_idx').on(table.catalogId),
    index('pet_vaccines_created_by_idx').on(table.createdBy),
  ],
);

export const weights = pgTable(
  'weights',
  {
    id: uuid('id').primaryKey(),
    petId: uuid('pet_id')
      .notNull()
      .references(() => pets.id, { onDelete: 'cascade' }),
    weightKg: numeric('weight_kg', { precision: 5, scale: 2 }).notNull(),
    bodyCondition: integer('body_condition'),
    measuredAt: date('measured_at').notNull(),
    createdBy: uuid('created_by')
      .notNull()
      .references(() => users.id),
  },
  (table) => [
    check(
      'weights_body_condition_check',
      sql`${table.bodyCondition} between 1 and 9`,
    ),
    index('weights_pet_id_measured_at_idx').on(
      table.petId,
      table.measuredAt.desc(),
    ),
    index('weights_created_by_idx').on(table.createdBy),
  ],
);

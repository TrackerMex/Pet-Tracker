import { sql } from 'drizzle-orm';
import {
  check,
  date,
  index,
  jsonb,
  pgTable,
  text,
  uniqueIndex,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { pets } from './pets.schema';
import { users } from './users.schema';

export interface VaccineScheme {
  firstDoseMonths: number;
  series?: number[];
  boosterMonths: number;
}

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

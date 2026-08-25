import { date, index, pgTable, text, uuid, varchar } from 'drizzle-orm/pg-core';
import { pets } from './pets.schema';
import { users } from './users.schema';

export const petDocuments = pgTable(
  'pet_documents',
  {
    id: uuid('id').primaryKey(),
    petId: uuid('pet_id')
      .notNull()
      .references(() => pets.id, { onDelete: 'cascade' }),
    type: varchar('type', { length: 40 }).notNull(),
    name: varchar('name', { length: 120 }).notNull(),
    date: date('date').notNull(),
    vet: varchar('vet', { length: 120 }),
    key: text('key').notNull(),
    createdBy: uuid('created_by')
      .notNull()
      .references(() => users.id),
  },
  (table) => [index('pet_documents_pet_id_idx').on(table.petId)],
);

import {
  bigint,
  index,
  jsonb,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { users } from './users.schema';

// Tabla transversal (docs/data-model.md, fila `audit_log`, brief §19). La crea
// esta feature porque es la primera que audita acciones; features futuras
// (pets-crud-permissions, devices-claim) reutilizan esta misma tabla.
// `user_id` es NULL-able: hay acciones de sistema sin actor y el usuario puede
// borrarse sin perder la traza.
export const auditLog = pgTable(
  'audit_log',
  {
    id: bigint('id', { mode: 'number' })
      .generatedAlwaysAsIdentity()
      .primaryKey(),
    userId: uuid('user_id').references(() => users.id, {
      onDelete: 'set null',
    }),
    action: varchar('action', { length: 100 }).notNull(),
    entity: varchar('entity', { length: 100 }).notNull(),
    entityId: uuid('entity_id').notNull(),
    meta: jsonb('meta'),
    at: timestamp('at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index('audit_log_user_id_idx').on(table.userId),
    index('audit_log_entity_idx').on(table.entity, table.entityId),
  ],
);

import { bigint, pgTable, timestamp } from 'drizzle-orm/pg-core';

// Tabla técnica de placeholder — ver comentario en ./index.ts. No es una
// tabla de dominio y no debe usarse desde ningún módulo de negocio.
export const schemaBootstrap = pgTable('schema_bootstrap', {
  id: bigint('id', { mode: 'number' }).generatedAlwaysAsIdentity().primaryKey(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

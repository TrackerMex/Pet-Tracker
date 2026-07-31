import {
  char,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

// Columnas segun docs/data-model.md, fila `users`. Adaptacion local: sin
// `cognito_sub`, la autenticacion es propia (password_hash argon2id).
// No existe columna para `passwordConfirmation`: es solo validacion de DTO.
export const users = pgTable('users', {
  id: uuid('id').primaryKey(),
  email: varchar('email', { length: 320 }).notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  firstName: varchar('first_name', { length: 120 }).notNull(),
  lastName: varchar('last_name', { length: 120 }).notNull(),
  phone: varchar('phone', { length: 20 }).notNull(),
  country: char('country', { length: 2 }).notNull(),
  timezone: varchar('timezone', { length: 64 }).notNull().default('UTC'),
  termsAcceptedAt: timestamp('terms_accepted_at', {
    withTimezone: true,
  }).notNull(),
  emailVerifiedAt: timestamp('email_verified_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

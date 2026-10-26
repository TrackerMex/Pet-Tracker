import { pgTable, uuid } from 'drizzle-orm/pg-core';

export const petInvites = pgTable('pet_invites', {
  id: uuid('id').primaryKey(),
});

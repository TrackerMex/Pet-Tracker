import { sql } from 'drizzle-orm';
import {
  check,
  index,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { users } from './users.schema';

// Tokens de Expo Push por instalacion (docs/data-model.md fila `push_tokens`,
// alerts-center-notifier R1). `expo_token` es UNIQUE GLOBAL y no
// (user_id, expo_token): un token identifica una instalacion en un dispositivo
// fisico, asi que dos usuarios no pueden tenerlo a la vez — es justo lo que
// hace posible el upsert idempotente de R3 y la reasignacion de D5(iv)
// (telefono compartido / re-login). `text` y no varchar(n): Expo no publica
// una longitud maxima. `platform` CHECK reducido a ('ios','android') (D5) —
// las dos unicas que Expo Push soporta y que la app MVP produce; se amplia con
// ALTER TABLE cuando exista otra, mismo criterio que `geofences.type` de #11.
// `id` uuid sin default, UUIDv7 generado en app (mismo criterio que el resto
// de tablas del proyecto).
export const pushTokens = pgTable(
  'push_tokens',
  {
    id: uuid('id').primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    expoToken: text('expo_token').notNull().unique(),
    platform: varchar('platform', { length: 10 }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    lastSeenAt: timestamp('last_seen_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    check(
      'push_tokens_platform_check',
      sql`${table.platform} in ('ios', 'android')`,
    ),
    // El UNIQUE de expo_token ya cubre el lookup del upsert de R3; este
    // indice sirve a la regla "toda FK lleva indice" de docs/data-model.md.
    index('push_tokens_user_id_idx').on(table.userId),
  ],
);

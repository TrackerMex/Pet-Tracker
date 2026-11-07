import type { NodePgDatabase } from 'drizzle-orm/node-postgres';

export type DrizzleTx = Parameters<
  Parameters<NodePgDatabase['transaction']>[0]
>[0];

import { ConfigService } from '@nestjs/config';
import type { PoolConfig } from 'pg';
export const DEFAULT_DB_POOL_MAX = 10;
export class DatabaseConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DatabaseConfigError';
  }
}
export function buildPoolConfig(config: ConfigService): PoolConfig {
  const raw = config.get<string>('DB_POOL_MAX')?.trim();
  if (raw && !/^[1-9]\d*$/.test(raw))
    throw new DatabaseConfigError(
      'Invalid database configuration: DB_POOL_MAX',
    );
  return {
    connectionString: config.get<string>('DATABASE_URL'),
    max: raw ? Number(raw) : DEFAULT_DB_POOL_MAX,
  };
}

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
  return { connectionString: config.get<string>('DATABASE_URL') };
}

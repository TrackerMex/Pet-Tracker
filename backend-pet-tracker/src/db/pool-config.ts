import { ConfigService } from '@nestjs/config';
import type { PoolConfig } from 'pg';
import { isProduction } from '@/config/environment';
export const DEFAULT_DB_POOL_MAX = 10;
export class DatabaseConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DatabaseConfigError';
  }
}
export function buildPoolConfig(config: ConfigService): PoolConfig {
  const rawMax = config.get<string>('DB_POOL_MAX')?.trim();
  const positive = (value: string | undefined): boolean =>
    !!value && /^[1-9]\d*$/.test(value);
  if (!isProduction(config.get<string>('NODE_ENV'))) {
    if (rawMax && !positive(rawMax))
      throw new DatabaseConfigError(
        'Invalid database configuration: DB_POOL_MAX',
      );
    return {
      connectionString: config.get<string>('DATABASE_URL'),
      max: rawMax ? Number(rawMax) : DEFAULT_DB_POOL_MAX,
    };
  }
  const host = config.get<string>('PGHOST');
  const port = config.get<string>('PGPORT')?.trim();
  const database = config.get<string>('PGDATABASE');
  const user = config.get<string>('PGUSER');
  const password = config.get<string>('PGPASSWORD');
  const problems: string[] = [];
  for (const [key, value] of Object.entries({
    PGHOST: host,
    PGDATABASE: database,
    PGUSER: user,
    PGPASSWORD: password,
  }))
    if (!value?.trim()) problems.push(key);
  if (!positive(port) || Number(port) > 65535) problems.push('PGPORT');
  if (!positive(rawMax)) problems.push('DB_POOL_MAX');
  if (problems.length)
    throw new DatabaseConfigError(
      `Invalid database configuration: ${problems.join(', ')}`,
    );
  return {
    host,
    port: Number(port),
    database,
    user,
    password,
    ssl: { rejectUnauthorized: true },
    max: Number(rawMax),
  };
}

import { ConfigService } from '@nestjs/config';
import { join } from 'node:path';
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { createAppLogger } from '@/app-setup';
import { buildPoolConfig } from './pool-config';
export const MIGRATIONS_FOLDER = join(__dirname, 'migrations');
export async function runMigrations(config: ConfigService): Promise<void> {
  const pool = new Pool(buildPoolConfig(config));
  try {
    await migrate(drizzle(pool), { migrationsFolder: MIGRATIONS_FOLDER });
  } finally {
    await pool.end();
  }
}
export async function runMigrationsCli(config: ConfigService): Promise<void> {
  const logger = createAppLogger(config.get<string>('NODE_ENV'));
  try {
    await runMigrations(config);
    logger.log('Migrations complete', 'Migrate');
  } catch (error) {
    logger.error(
      error instanceof Error ? error.message : String(error),
      'Migrate',
    );
    process.exitCode = 1;
  }
}
if (require.main === module) {
  void runMigrationsCli(new ConfigService());
}

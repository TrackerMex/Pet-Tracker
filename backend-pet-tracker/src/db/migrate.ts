import { ConfigService } from '@nestjs/config';
export const MIGRATIONS_FOLDER = '';
export function runMigrations(config: ConfigService): Promise<void> {
  void config;
  return Promise.resolve();
}
export function runMigrationsCli(config: ConfigService): Promise<void> {
  void config;
  return Promise.resolve();
}

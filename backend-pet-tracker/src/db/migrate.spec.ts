import { ConfigService } from '@nestjs/config';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { MIGRATIONS_FOLDER, runMigrations, runMigrationsCli } from './migrate';
jest.mock('pg', () => ({ Pool: jest.fn() }));
jest.mock('drizzle-orm/node-postgres', () => ({ drizzle: jest.fn() }));
jest.mock('drizzle-orm/node-postgres/migrator', () => ({ migrate: jest.fn() }));
const values: Record<string, string> = {
  NODE_ENV: 'production',
  DATABASE_URL: 'postgresql://ignorada@localhost/x',
  PGHOST: 'db.internal.example',
  PGPORT: '5432',
  PGDATABASE: 'pet_tracker',
  PGUSER: 'pet_tracker_app',
  PGPASSWORD: 'pass-sentinel-245',
  DB_POOL_MAX: '5',
};
const config = {
  get: (key: string) => values[key],
} as unknown as ConfigService;
function jsonLines(spy: jest.SpyInstance): unknown[] {
  return spy.mock.calls
    .flatMap((call: unknown[]) => String(call[0]).split('\n'))
    .flatMap((line) => {
      try {
        return [JSON.parse(line) as unknown];
      } catch {
        return [];
      }
    });
}
describe('R14: migrate.ts aplica las migraciones con el migrator de runtime', () => {
  const pool = { end: jest.fn<Promise<void>, []>() };
  const db = { sentinel: 'drizzle-245' };
  let stdout: jest.SpyInstance;
  let stderr: jest.SpyInstance;
  let exitCode: typeof process.exitCode;
  beforeEach(() => {
    jest.clearAllMocks();
    pool.end.mockResolvedValue(undefined);
    jest.mocked(Pool).mockImplementation(() => pool as unknown as Pool);
    jest
      .mocked(drizzle)
      .mockReturnValue(db as unknown as ReturnType<typeof drizzle>);
    jest.mocked(migrate).mockResolvedValue(undefined);
    stdout = jest.spyOn(process.stdout, 'write').mockImplementation(() => true);
    stderr = jest.spyOn(process.stderr, 'write').mockImplementation(() => true);
    exitCode = process.exitCode;
  });
  afterEach(() => {
    process.exitCode = exitCode;
    jest.restoreAllMocks();
  });
  function noPassword() {
    const text = [stdout, stderr]
      .map((spy) =>
        spy.mock.calls.map((call: unknown[]) => String(call[0])).join(''),
      )
      .join('');
    expect(text).not.toContain('pass-sentinel-245');
  }
  it('R14: MIGRATIONS_FOLDER es <dir>/migrations y contiene meta/_journal.json', () => {
    expect(MIGRATIONS_FOLDER).toBe(join(__dirname, 'migrations'));
    expect(existsSync(join(MIGRATIONS_FOLDER, 'meta', '_journal.json'))).toBe(
      true,
    );
  });
  it('R14: runMigrations construye el Pool con buildPoolConfig, migra una vez y cierra el pool', async () => {
    await runMigrations(config);
    expect(Pool).toHaveBeenCalledTimes(1);
    expect((jest.mocked(Pool).mock.calls[0] as unknown[])[0]).toStrictEqual({
      host: 'db.internal.example',
      port: 5432,
      database: 'pet_tracker',
      user: 'pet_tracker_app',
      password: 'pass-sentinel-245',
      ssl: { rejectUnauthorized: true },
      max: 5,
    });
    expect(drizzle).toHaveBeenCalledWith(pool);
    expect(migrate).toHaveBeenCalledTimes(1);
    expect(migrate).toHaveBeenCalledWith(db, {
      migrationsFolder: MIGRATIONS_FOLDER,
    });
    expect(pool.end).toHaveBeenCalledTimes(1);
  });
  it('R14: si migrate rechaza, runMigrations rechaza con el mismo error y cierra el pool', async () => {
    const error = new Error('boom-245');
    jest.mocked(migrate).mockRejectedValue(error);
    await expect(runMigrations(config)).rejects.toBe(error);
    expect(pool.end).toHaveBeenCalledTimes(1);
  });
  it('R14: runMigrationsCli en éxito registra en JSON y no toca exitCode', async () => {
    await runMigrationsCli(config);
    expect(jsonLines(stdout)).toEqual(
      expect.arrayContaining([expect.objectContaining({ level: 'log' })]),
    );
    expect(process.exitCode).toBe(exitCode);
    noPassword();
  });
  it('R14: runMigrationsCli en fallo deja exitCode 1, registra el error y no filtra PGPASSWORD', async () => {
    jest.mocked(migrate).mockRejectedValue(new Error('boom-245'));
    await runMigrationsCli(config);
    expect(process.exitCode).toBe(1);
    expect(jsonLines(stderr)).toEqual(
      expect.arrayContaining([expect.objectContaining({ level: 'error' })]),
    );
    expect(
      stderr.mock.calls.map((call: unknown[]) => String(call[0])).join(''),
    ).toContain('boom-245');
    expect(pool.end).toHaveBeenCalledTimes(1);
    noPassword();
  });
  it('R14: solo corre como CLI bajo require.main === module y no carga dotenv', () => {
    const source = readFileSync(join(__dirname, 'migrate.ts'), 'utf8');
    expect(source).toContain('if (require.main === module)');
    expect(source).toContain('runMigrationsCli(new ConfigService())');
    expect(source).not.toContain('dotenv');
    expect(source).not.toContain('envFilePath');
  });
});

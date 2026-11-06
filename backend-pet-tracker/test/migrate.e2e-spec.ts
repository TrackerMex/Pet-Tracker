import { config as loadDotenv } from 'dotenv';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';
import { runMigrations } from '@/db/migrate';
loadDotenv({ path: '../.env' });
describe('R15: el migrator de runtime reconoce la base migrada por drizzle-kit', () => {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  afterAll(async () => {
    await pool.end();
  });
  it('R15: runMigrations sobre la base ya migrada resuelve y no añade filas a drizzle.__drizzle_migrations', async () => {
    const before = await pool.query<{ n: number }>(
      'SELECT count(*)::int AS n FROM drizzle.__drizzle_migrations',
    );
    expect(before.rows[0].n).toBeGreaterThan(0);
    await expect(runMigrations(new ConfigService())).resolves.toBeUndefined();
    const after = await pool.query<{ n: number }>(
      'SELECT count(*)::int AS n FROM drizzle.__drizzle_migrations',
    );
    expect(after.rows[0].n).toBe(before.rows[0].n);
  });
});

import { config as loadDotenv } from 'dotenv';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { seedVaccineCatalog } from '@/db/seed/vaccine-catalog';

async function main(): Promise<void> {
  loadDotenv({ path: '../.env' });
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  try {
    await seedVaccineCatalog(drizzle(pool));
  } finally {
    await pool.end();
  }
}

if (require.main === module) {
  main().catch((error: unknown) => {
    // eslint-disable-next-line no-console
    console.error('seed-vaccines failed:', error);
    process.exitCode = 1;
  });
}

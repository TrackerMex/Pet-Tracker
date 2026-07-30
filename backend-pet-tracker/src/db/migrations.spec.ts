import { existsSync, readdirSync } from 'fs';
import { join } from 'path';

describe('R3: drizzle-kit generate produces versioned SQL migrations', () => {
  it('has at least one .sql migration file committed under src/db/migrations', () => {
    const migrationsDir = join(__dirname, 'migrations');

    expect(existsSync(migrationsDir)).toBe(true);

    const sqlFiles = readdirSync(migrationsDir).filter((file) =>
      file.endsWith('.sql'),
    );
    expect(sqlFiles.length).toBeGreaterThanOrEqual(1);
  });
});

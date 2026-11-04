import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { config as loadDotenv } from 'dotenv';
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import {
  cpSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { Pool } from 'pg';
import request from 'supertest';
import { App } from 'supertest/types';
import { uuidv7 } from 'uuidv7';
import { users } from '@/db/schema/users.schema';
import { seedVaccineCatalog } from '@/db/seed/vaccine-catalog';
import { TOKEN_SERVICE } from '@/modules/auth/domain/ports/token-service';
import type { TokenService } from '@/modules/auth/domain/ports/token-service';
import { AppModule } from '../src/app.module';

loadDotenv({ path: '../.env' });

interface JournalEntry {
  idx: number;
  tag: string;
  when: number;
}

interface MigrationJournal {
  version: string;
  dialect: string;
  entries: JournalEntry[];
}

interface CatalogRow {
  id: string;
  species: 'dog' | 'cat';
  name: string;
  scheme: {
    firstDoseMonths: number;
    series?: number[];
    boosterMonths: number;
  };
}

describe('#226 vaccine catalog migration (e2e)', () => {
  jest.setTimeout(180_000);

  const originalDatabaseUrl = process.env.DATABASE_URL;
  const runId = Date.now();
  const databaseA = `pet_tracker_226_a_${runId}`;
  const databaseB = `pet_tracker_226_b_${runId}`;
  const MIGRATIONS = join(__dirname, '..', 'src', 'db', 'migrations');
  let admin: Pool;
  let poolA: Pool;
  let poolB: Pool;
  let createdA = false;
  let createdB = false;
  let previousMigrations: string;
  let journal: MigrationJournal;
  let app: INestApplication<App>;
  let tokens: TokenService;
  let catalogToken: string;
  let countBeforeMigration: number;

  async function getCatalog(species: 'dog' | 'cat'): Promise<CatalogRow[]> {
    const response = await request(app.getHttpServer())
      .get(`/v1/vaccine-catalog?species=${species}`)
      .set('Authorization', `Bearer ${catalogToken}`)
      .expect(200);
    return response.body as CatalogRow[];
  }

  async function dropDatabase(name: string): Promise<void> {
    await admin.query(`DROP DATABASE IF EXISTS "${name}"`);
  }

  beforeAll(() => {
    if (!originalDatabaseUrl) throw new Error('DATABASE_URL is required');
    admin = new Pool({ connectionString: originalDatabaseUrl });
    journal = JSON.parse(
      readFileSync(join(MIGRATIONS, 'meta', '_journal.json'), 'utf8'),
    ) as MigrationJournal;
    const migration = journal.entries.find((entry) =>
      entry.tag.endsWith('_vaccine_catalog_data'),
    );
    previousMigrations = mkdtempSync(join(tmpdir(), 'pet-tracker-226-'));
    cpSync(MIGRATIONS, previousMigrations, { recursive: true });
    writeFileSync(
      join(previousMigrations, 'meta', '_journal.json'),
      JSON.stringify({
        ...journal,
        entries: migration
          ? journal.entries.filter((entry) => entry.idx < migration.idx)
          : journal.entries,
      }),
    );
  });

  afterAll(async () => {
    const cleanup: Array<() => void | Promise<unknown>> = [
      () => app?.close(),
      () => poolA?.end(),
      () => poolB?.end(),
      () => {
        if (originalDatabaseUrl === undefined) delete process.env.DATABASE_URL;
        else process.env.DATABASE_URL = originalDatabaseUrl;
      },
      async () => {
        if (createdA) await dropDatabase(databaseA);
      },
      async () => {
        if (createdB) await dropDatabase(databaseB);
      },
      () => admin?.end(),
      () => {
        if (previousMigrations)
          rmSync(previousMigrations, { recursive: true, force: true });
      },
    ];
    const errors: unknown[] = [];
    for (const release of cleanup) {
      try {
        await release();
      } catch (error) {
        errors.push(error);
      }
    }
    if (errors.length)
      throw new AggregateError(errors, 'Migration e2e cleanup');
  });

  describe('#226 R1: la migracion llena un catalogo vacio', () => {
    beforeAll(async () => {
      await admin.query(`CREATE DATABASE "${databaseA}"`);
      createdA = true;
      const urlA = new URL(originalDatabaseUrl!);
      urlA.pathname = `/${databaseA}`;
      poolA = new Pool({ connectionString: urlA.toString() });
      await migrate(drizzle(poolA), { migrationsFolder: previousMigrations });
      const { rows } = await poolA.query<{ count: string }>(
        'select count(*) from vaccine_catalog',
      );
      countBeforeMigration = Number(rows[0].count);
      await migrate(drizzle(poolA), { migrationsFolder: MIGRATIONS });
      process.env.DATABASE_URL = urlA.toString();
      const module = await Test.createTestingModule({
        imports: [AppModule],
      }).compile();
      app = module.createNestApplication();
      app.setGlobalPrefix('v1');
      await app.init();
      tokens = app.get<TokenService>(TOKEN_SERVICE);
      catalogToken = tokens.sign({
        sub: uuidv7(),
        email: `catalog-${runId}@example.com`,
      });
    });

    it('#226 R1: el journal registra una sola migracion _vaccine_catalog_data, posterior a la anterior', () => {
      const migrations = journal.entries.filter((entry) =>
        entry.tag.endsWith('_vaccine_catalog_data'),
      );
      expect(migrations).toHaveLength(1);
      const previous = journal.entries.find(
        (entry) => entry.idx === migrations[0].idx - 1,
      );
      expect(previous).toBeDefined();
      expect(migrations[0].when).toBeGreaterThan(previous!.when);
    });

    it('#226 R1: sin la migracion el catalogo queda vacio, como en la base del humano', () => {
      expect(countBeforeMigration).toBe(0);
    });

    it('#226 R1: GET dog devuelve las 4 vacunas con su esquema, por nombre', async () => {
      const rows = await getCatalog('dog');
      expect(rows).toHaveLength(4);
      expect(
        rows.map(({ species, name, scheme }) => ({ species, name, scheme })),
      ).toEqual([
        {
          species: 'dog',
          name: 'Leptospirosis',
          scheme: { firstDoseMonths: 3, boosterMonths: 12 },
        },
        {
          species: 'dog',
          name: 'Polivalente (DHPPi)',
          scheme: { firstDoseMonths: 2, series: [2, 3, 4], boosterMonths: 12 },
        },
        {
          species: 'dog',
          name: 'Rabia',
          scheme: { firstDoseMonths: 3, boosterMonths: 12 },
        },
        {
          species: 'dog',
          name: 'Tos de las perreras',
          scheme: { firstDoseMonths: 3, boosterMonths: 12 },
        },
      ]);
    });

    it('#226 R1: GET cat devuelve las 3 vacunas con su esquema, por nombre', async () => {
      const rows = await getCatalog('cat');
      expect(rows).toHaveLength(3);
      expect(
        rows.map(({ species, name, scheme }) => ({ species, name, scheme })),
      ).toEqual([
        {
          species: 'cat',
          name: 'Leucemia felina (FeLV)',
          scheme: { firstDoseMonths: 2, boosterMonths: 12 },
        },
        {
          species: 'cat',
          name: 'Rabia',
          scheme: { firstDoseMonths: 3, boosterMonths: 12 },
        },
        {
          species: 'cat',
          name: 'Triple felina (FVRCP)',
          scheme: { firstDoseMonths: 2, series: [2, 3], boosterMonths: 12 },
        },
      ]);
    });

    it('#226 R1: una vacuna del catalogo migrado se registra con 201', async () => {
      const rows = await getCatalog('dog');
      const rabia = rows.find((row) => row.name === 'Rabia');
      expect(rabia).toBeDefined();
      const id = uuidv7();
      const email = `vaccines-r1-${runId}@example.com`;
      await drizzle(poolA).insert(users).values({
        id,
        email,
        passwordHash: 'not-used',
        firstName: 'E2e',
        lastName: 'R1',
        phone: '+525512345678',
        country: 'MX',
        timezone: 'UTC',
        termsAcceptedAt: new Date(),
      });
      const token = tokens.sign({ sub: id, email });
      const petResponse = await request(app.getHttpServer())
        .post('/v1/pets')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: `Pet-${runId}`, species: 'dog', birthDate: '2024-01-15' })
        .expect(201);
      const pet = petResponse.body as { id: string };
      const response = await request(app.getHttpServer())
        .post(`/v1/pets/${pet.id}/vaccines`)
        .set('Authorization', `Bearer ${token}`)
        .send({ catalogId: rabia!.id, appliedAt: '2024-02-29' })
        .expect(201);
      const vaccine = response.body as { name: string; nextDoseAt: string };
      expect(vaccine.name).toBe('Rabia');
      expect(vaccine.nextDoseAt).toBe('2025-02-28');
    });
  });

  describe('#226 R2: la migracion no cambia una base ya sembrada', () => {
    it('#226 R2: migrar sobre una base sembrada no falla ni cambia ninguna fila', async () => {
      await admin.query(`CREATE DATABASE "${databaseB}"`);
      createdB = true;
      const urlB = new URL(originalDatabaseUrl!);
      urlB.pathname = `/${databaseB}`;
      poolB = new Pool({ connectionString: urlB.toString() });
      const db = drizzle(poolB);
      await migrate(db, { migrationsFolder: previousMigrations });
      await seedVaccineCatalog(db);
      await poolB.query(
        'update vaccine_catalog set scheme = $1::jsonb where species = $2 and name = $3',
        [
          JSON.stringify({ firstDoseMonths: 3, boosterMonths: 36 }),
          'dog',
          'Rabia',
        ],
      );
      const before = await poolB.query<CatalogRow>(
        'select id, species, name, scheme from vaccine_catalog order by species, name',
      );
      expect(before.rows).toHaveLength(7);
      await expect(
        migrate(db, { migrationsFolder: MIGRATIONS }),
      ).resolves.toBeUndefined();
      const after = await poolB.query<CatalogRow>(
        'select id, species, name, scheme from vaccine_catalog order by species, name',
      );
      expect(after.rows).toHaveLength(7);
      expect(after.rows).toEqual(before.rows);
      expect(
        after.rows.find((row) => row.species === 'dog' && row.name === 'Rabia')
          ?.scheme,
      ).toEqual({ firstDoseMonths: 3, boosterMonths: 36 });
    });
  });

  describe('#226 R3: el seed sigue funcionando despues de la migracion', () => {
    it('#226 R3: seed:vaccines sobre el catalogo migrado conserva las 7 filas y sus ids', async () => {
      const before = await poolA.query<CatalogRow>(
        'select id, species, name, scheme from vaccine_catalog order by species, name',
      );
      expect(before.rows).toHaveLength(7);
      await expect(seedVaccineCatalog(drizzle(poolA))).resolves.toBeUndefined();
      const after = await poolA.query<CatalogRow>(
        'select id, species, name, scheme from vaccine_catalog order by species, name',
      );
      expect(after.rows).toHaveLength(7);
      expect(after.rows).toEqual(before.rows);
    });
  });

  describe('#237: dropDatabase no termina sesiones ajenas', () => {
    it('#237 R1: con una sesion viva, dropDatabase rechaza con 55006, no borra la base y la sesion no recibe 57P01', async () => {
      const name = `pet_tracker_237_live_${runId}`;
      await admin.query(`CREATE DATABASE "${name}"`);
      const url = new URL(originalDatabaseUrl!);
      url.pathname = `/${name}`;
      const pool = new Pool({
        connectionString: url.toString(),
        idleTimeoutMillis: 0,
      });
      const errors: unknown[] = [];
      pool.on('error', (error) => {
        errors.push(error);
      });
      try {
        await pool.query('select 1');
        await expect(dropDatabase(name)).rejects.toMatchObject({
          code: '55006',
        });
        const { rows } = await admin.query<{ count: number }>(
          'select count(*)::int as count from pg_database where datname = $1',
          [name],
        );
        expect(rows[0].count).toBe(1);
        expect(errors).toEqual([]);
      } finally {
        if (!pool.ending) await pool.end();
        await dropDatabase(name);
      }
    });
  });
});

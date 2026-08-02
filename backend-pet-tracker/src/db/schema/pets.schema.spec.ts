import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { getTableConfig } from 'drizzle-orm/pg-core';
import { pets, petUsers } from '@/db/schema/pets.schema';

const MIGRATIONS_DIR = join(__dirname, '..', 'migrations');

/** SQL de la migracion nueva: el archivo .sql que crea la tabla pets. */
function readPetsMigrationSql(): string {
  const sqlFiles = readdirSync(MIGRATIONS_DIR).filter((file) =>
    file.endsWith('.sql'),
  );
  const petsMigration = sqlFiles
    .map((file) => readFileSync(join(MIGRATIONS_DIR, file), 'utf8'))
    .find((sql) => sql.includes('CREATE TABLE "pets"'));

  if (!petsMigration) {
    throw new Error('No migration creating "pets" found in src/db/migrations');
  }

  return petsMigration;
}

describe('R1: la migracion crea pets conforme a docs/data-model.md', () => {
  const config = getTableConfig(pets);
  const columns = new Map(config.columns.map((c) => [c.name, c]));

  it('se llama pets y tiene exactamente las columnas de la spec', () => {
    expect(config.name).toBe('pets');
    expect([...columns.keys()].sort()).toEqual(
      [
        'id',
        'name',
        'species',
        'breed',
        'birth_date',
        'approx_age_months',
        'sex',
        'current_weight_kg',
        'size',
        'color',
        'sterilized',
        'microchip',
        'photo_key',
        'lost_mode',
        'last_position',
        'last_communication_at',
        'created_at',
        'updated_at',
      ].sort(),
    );
  });

  it('id es uuid PK sin default de base (UUIDv7 generado en app)', () => {
    const id = columns.get('id');
    expect(id?.primary).toBe(true);
    expect(id?.getSQLType()).toBe('uuid');
    expect(id?.hasDefault).toBe(false);
  });

  it('name y species son NOT NULL; el resto de campos de ficha son NULL', () => {
    expect(columns.get('name')?.notNull).toBe(true);
    expect(columns.get('species')?.notNull).toBe(true);
    for (const nullable of [
      'breed',
      'birth_date',
      'approx_age_months',
      'sex',
      'current_weight_kg',
      'size',
      'color',
      'sterilized',
      'microchip',
      'photo_key',
      'last_position',
      'last_communication_at',
    ]) {
      expect(columns.get(nullable)?.notNull).toBe(false);
    }
  });

  it('species tiene CHECK en (dog, cat)', () => {
    const check = config.checks.find((c) => c.name === 'pets_species_check');
    expect(check).toBeDefined();
  });

  it('current_weight_kg es numeric(5,2) y birth_date es date', () => {
    expect(columns.get('current_weight_kg')?.getSQLType()).toBe(
      'numeric(5, 2)',
    );
    expect(columns.get('birth_date')?.getSQLType()).toBe('date');
  });

  it('lost_mode es NOT NULL DEFAULT false; timestamps con timezone y DEFAULT now()', () => {
    const lostMode = columns.get('lost_mode');
    expect(lostMode?.notNull).toBe(true);
    expect(lostMode?.hasDefault).toBe(true);
    for (const ts of ['created_at', 'updated_at']) {
      const column = columns.get(ts);
      expect(column?.notNull).toBe(true);
      expect(column?.hasDefault).toBe(true);
      expect(column?.getSQLType()).toBe('timestamp with time zone');
    }
    expect(columns.get('last_communication_at')?.getSQLType()).toBe(
      'timestamp with time zone',
    );
  });
});

describe('R1: la migracion crea pet_users conforme a docs/data-model.md', () => {
  const config = getTableConfig(petUsers);
  const columns = new Map(config.columns.map((c) => [c.name, c]));

  it('tiene PK compuesta (pet_id, user_id) sin id propio', () => {
    expect([...columns.keys()].sort()).toEqual(
      [
        'pet_id',
        'user_id',
        'role',
        'permissions',
        'status',
        'created_at',
      ].sort(),
    );
    const pk = config.primaryKeys[0];
    expect(pk).toBeDefined();
    expect(pk.columns.map((c) => c.name)).toEqual(['pet_id', 'user_id']);
  });

  it('pet_id y user_id son FKs con ON DELETE CASCADE', () => {
    const fks = config.foreignKeys.map((fk) => {
      const ref = fk.reference();
      return {
        column: ref.columns[0].name,
        foreignTable: getTableConfig(ref.foreignTable).name,
        onDelete: fk.onDelete,
      };
    });
    expect(fks).toEqual(
      expect.arrayContaining([
        { column: 'pet_id', foreignTable: 'pets', onDelete: 'cascade' },
        { column: 'user_id', foreignTable: 'users', onDelete: 'cascade' },
      ]),
    );
  });

  it('role es NOT NULL con CHECK en (owner, family, walker, vet)', () => {
    expect(columns.get('role')?.notNull).toBe(true);
    const check = config.checks.find((c) => c.name === 'pet_users_role_check');
    expect(check).toBeDefined();
  });

  it('status es NOT NULL DEFAULT active y created_at timestamptz DEFAULT now()', () => {
    const status = columns.get('status');
    expect(status?.notNull).toBe(true);
    expect(status?.hasDefault).toBe(true);
    const createdAt = columns.get('created_at');
    expect(createdAt?.notNull).toBe(true);
    expect(createdAt?.hasDefault).toBe(true);
    expect(createdAt?.getSQLType()).toBe('timestamp with time zone');
  });

  it('tiene indice manual sobre user_id (regla FK de docs/data-model.md)', () => {
    const index = config.indexes.find(
      (idx) => idx.config.name === 'pet_users_user_id_idx',
    );
    expect(index).toBeDefined();
  });
});

describe('R1: el SQL de la migracion nueva no toca audit_log', () => {
  it('crea pets y pet_users, el indice de user_id, y cero menciones a audit_log', () => {
    const sql = readPetsMigrationSql();

    expect(sql).toContain('CREATE TABLE "pets"');
    expect(sql).toContain('CREATE TABLE "pet_users"');
    expect(sql).toContain('pet_users_user_id_idx');
    expect(sql).not.toContain('audit_log');
  });
});

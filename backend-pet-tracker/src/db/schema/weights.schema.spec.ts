import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { getTableConfig } from 'drizzle-orm/pg-core';
import { weights } from './health.schema';

const MIGRATIONS_DIR = join(__dirname, '..', 'migrations');

function findWeightsMigration(): { file: string; sql: string } {
  const file = readdirSync(MIGRATIONS_DIR)
    .filter((name) => name.endsWith('.sql'))
    .find((name) =>
      readFileSync(join(MIGRATIONS_DIR, name), 'utf8').includes(
        'CREATE TABLE "weights"',
      ),
    );

  if (!file) throw new Error('Weights migration not found');
  return { file, sql: readFileSync(join(MIGRATIONS_DIR, file), 'utf8') };
}

describe('R1 (health-weights #15): tabla weights y migracion 0010 nueva', () => {
  const config = getTableConfig(weights);
  const columns = new Map(
    config.columns.map((column) => [column.name, column]),
  );

  it('declara exactamente las columnas, tipos y nulabilidad aprobados', () => {
    expect([...columns.keys()].sort()).toEqual(
      [
        'id',
        'pet_id',
        'weight_kg',
        'body_condition',
        'measured_at',
        'created_by',
      ].sort(),
    );
    expect(columns.get('id')?.primary).toBe(true);
    expect(columns.get('id')?.getSQLType()).toBe('uuid');
    expect(columns.get('pet_id')?.notNull).toBe(true);
    expect(columns.get('weight_kg')?.notNull).toBe(true);
    expect(columns.get('weight_kg')?.getSQLType()).toBe('numeric(5, 2)');
    expect(columns.get('body_condition')?.notNull).toBe(false);
    expect(columns.get('body_condition')?.getSQLType()).toBe('integer');
    expect(columns.get('measured_at')?.notNull).toBe(true);
    expect(columns.get('measured_at')?.getSQLType()).toBe('date');
    expect(columns.get('created_by')?.notNull).toBe(true);
  });

  it('aplica las FKs y el cascade solo a pet_id', () => {
    const foreignKeys = config.foreignKeys.map((foreignKey) => {
      const reference = foreignKey.reference();
      return {
        column: reference.columns[0].name,
        foreignTable: getTableConfig(reference.foreignTable).name,
        onDelete: foreignKey.onDelete,
      };
    });

    expect(foreignKeys).toEqual(
      expect.arrayContaining([
        { column: 'pet_id', foreignTable: 'pets', onDelete: 'cascade' },
        {
          column: 'created_by',
          foreignTable: 'users',
          onDelete: 'no action',
        },
      ]),
    );
  });

  it('declara el check y los dos indices exactos', () => {
    expect(config.checks.map((check) => check.name)).toContain(
      'weights_body_condition_check',
    );
    expect(config.indexes.map((index) => index.config.name)).toEqual(
      expect.arrayContaining([
        'weights_pet_id_measured_at_idx',
        'weights_created_by_idx',
      ]),
    );
  });

  it('usa una migracion 0010 nueva que no altera pets', () => {
    const migration = findWeightsMigration();

    expect(migration.file).toMatch(/^0010_.*\.sql$/);
    expect(migration.sql).toContain('CREATE TABLE "weights"');
    expect(migration.sql).not.toContain('ALTER TABLE "pets"');
  });
});

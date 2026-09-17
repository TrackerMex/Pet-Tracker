import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { getTableConfig } from 'drizzle-orm/pg-core';
import { mealServings } from './nutrition.schema';

const MIGRATIONS_DIR = join(__dirname, '..', 'migrations');

function findMealServingsMigration(): { file: string; sql: string } {
  const file = readdirSync(MIGRATIONS_DIR)
    .filter((name) => name.endsWith('.sql'))
    .find((name) =>
      readFileSync(join(MIGRATIONS_DIR, name), 'utf8').includes(
        'CREATE TABLE "meal_servings"',
      ),
    );

  if (!file) throw new Error('Meal servings migration not found');
  return { file, sql: readFileSync(join(MIGRATIONS_DIR, file), 'utf8') };
}

describe('R1 (meals-served-tracking #83): tabla meal_servings y migracion nueva', () => {
  const config = getTableConfig(mealServings);
  const columns = new Map(
    config.columns.map((column) => [column.name, column]),
  );

  it('declara exactamente las columnas, tipos y nulabilidad aprobados', () => {
    expect([...columns.keys()].sort()).toEqual(
      [
        'id',
        'pet_id',
        'served_on',
        'meal_time',
        'served_at',
        'created_by',
      ].sort(),
    );
    expect(columns.get('id')?.primary).toBe(true);
    expect(columns.get('id')?.getSQLType()).toBe('uuid');
    expect(columns.get('pet_id')?.notNull).toBe(true);
    expect(columns.get('pet_id')?.getSQLType()).toBe('uuid');
    expect(columns.get('served_on')?.notNull).toBe(true);
    expect(columns.get('served_on')?.getSQLType()).toBe('date');
    expect(columns.get('meal_time')?.notNull).toBe(true);
    expect(columns.get('meal_time')?.getSQLType()).toBe('varchar(5)');
    expect(columns.get('served_at')?.notNull).toBe(true);
    expect(columns.get('served_at')?.getSQLType()).toBe(
      'timestamp with time zone',
    );
    expect(columns.get('served_at')?.hasDefault).toBe(true);
    expect(columns.get('created_by')?.notNull).toBe(true);
    expect(columns.get('created_by')?.getSQLType()).toBe('uuid');
  });

  it('aplica las FKs y el cascade solo a pet_id', () => {
    const foreignKeys = config.foreignKeys
      .map((foreignKey) => {
        const reference = foreignKey.reference();
        return {
          column: reference.columns[0].name,
          foreignTable: getTableConfig(reference.foreignTable).name,
          onDelete: foreignKey.onDelete,
        };
      })
      .sort((a, b) => a.column.localeCompare(b.column));

    expect(foreignKeys).toEqual([
      {
        column: 'created_by',
        foreignTable: 'users',
        onDelete: 'no action',
      },
      { column: 'pet_id', foreignTable: 'pets', onDelete: 'cascade' },
    ]);
  });

  it('declara los dos indices exactos y ningun check', () => {
    expect(config.indexes.map((index) => index.config.name).sort()).toEqual(
      [
        'meal_servings_pet_id_served_on_meal_time_idx',
        'meal_servings_created_by_idx',
      ].sort(),
    );
    expect(config.checks).toHaveLength(0);
  });

  it('usa la ultima migracion renombrada y no altera otras tablas', () => {
    const migration = findMealServingsMigration();
    const journal = JSON.parse(
      readFileSync(join(MIGRATIONS_DIR, 'meta', '_journal.json'), 'utf8'),
    ) as { entries: Array<{ idx: number }> };

    expect(migration.file).toMatch(/^\d{4}_meal_servings\.sql$/);
    expect(Number(migration.file.slice(0, 4))).toBe(
      journal.entries.at(-1)?.idx,
    );
    expect(migration.sql).not.toContain('ALTER TABLE "pets"');
    expect(migration.sql).not.toContain('ALTER TABLE "nutrition_plans"');
    expect(migration.sql).not.toContain('ALTER TABLE "nutrition_profiles"');
  });
});

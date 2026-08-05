import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { getTableConfig } from 'drizzle-orm/pg-core';
import { activityDaily } from '@/db/schema/activity.schema';

const MIGRATIONS_DIR = join(
  __dirname,
  '..',
  '..',
  '..',
  '..',
  'db',
  'migrations',
);

/** Migraciones .sql versionadas, ordenadas por su prefijo numerico. */
function migrationFiles(): string[] {
  return readdirSync(MIGRATIONS_DIR)
    .filter((file) => file.endsWith('.sql'))
    .sort();
}

function migrationSql(file: string): string {
  return readFileSync(join(MIGRATIONS_DIR, file), 'utf8');
}

describe('R10: la migracion 0005 crea unicamente activity_daily', () => {
  const config = getTableConfig(activityDaily);
  const columns = new Map(
    config.columns.map((column) => [column.name, column]),
  );

  it('la tabla tiene exactamente las once columnas de la spec', () => {
    expect(config.name).toBe('activity_daily');
    expect([...columns.keys()].sort()).toEqual(
      [
        'pet_id',
        'date',
        'distance_m',
        'active_minutes',
        'rest_minutes',
        'walk_count',
        'avg_walk_minutes',
        'first_walk_at',
        'last_walk_at',
        'time_away_minutes',
        'computed_at',
      ].sort(),
    );
  });

  it('la PK es compuesta (pet_id, date) y cubre el FK como prefijo', () => {
    const primary = config.primaryKeys[0];

    expect(primary).toBeDefined();
    expect(primary.columns.map((column) => column.name)).toEqual([
      'pet_id',
      'date',
    ]);
    // Sin indice manual extra: la PK ya indexa pet_id como primera columna.
    expect(config.indexes).toEqual([]);
  });

  it('pet_id es FK a pets con ON DELETE CASCADE', () => {
    const references = config.foreignKeys.map((foreignKey) => {
      const reference = foreignKey.reference();
      return {
        column: reference.columns[0].name,
        foreignTable: getTableConfig(reference.foreignTable).name,
        onDelete: foreignKey.onDelete,
      };
    });

    expect(references).toEqual([
      { column: 'pet_id', foreignTable: 'pets', onDelete: 'cascade' },
    ]);
  });

  it('los tipos y la nulabilidad son los de D9', () => {
    expect(columns.get('date')?.getSQLType()).toBe('date');
    for (const integerColumn of [
      'distance_m',
      'active_minutes',
      'rest_minutes',
      'walk_count',
      'time_away_minutes',
    ]) {
      expect(columns.get(integerColumn)?.getSQLType()).toBe('integer');
    }
    expect(columns.get('avg_walk_minutes')?.getSQLType()).toBe('numeric(6, 2)');
    for (const instant of ['first_walk_at', 'last_walk_at', 'computed_at']) {
      expect(columns.get(instant)?.getSQLType()).toBe(
        'timestamp with time zone',
      );
    }

    for (const required of [
      'pet_id',
      'date',
      'distance_m',
      'active_minutes',
      'rest_minutes',
      'walk_count',
      'avg_walk_minutes',
      'computed_at',
    ]) {
      expect(columns.get(required)?.notNull).toBe(true);
    }
    for (const nullable of [
      'first_walk_at',
      'last_walk_at',
      'time_away_minutes',
    ]) {
      expect(columns.get(nullable)?.notNull).toBe(false);
    }
    expect(columns.get('computed_at')?.hasDefault).toBe(true);
    // time_away_minutes nace NULL y la rellena #13, nunca esta feature.
    expect(columns.get('time_away_minutes')?.hasDefault).toBe(false);
  });

  it('hay CHECK de no negatividad en las cuatro metricas contables', () => {
    expect(config.checks.map((check) => check.name).sort()).toEqual([
      'activity_daily_active_minutes_check',
      'activity_daily_distance_m_check',
      'activity_daily_rest_minutes_check',
      'activity_daily_walk_count_check',
    ]);
  });

  it('la 0005 es la unica migracion nueva y solo crea esa tabla', () => {
    const files = migrationFiles();
    const added = files.filter((file) => file.startsWith('0005_'));

    expect(added).toHaveLength(1);

    // Local a 0005: localiza la migracion por contenido (no por ser la
    // ultima del directorio) y confirma que no crea ninguna otra tabla.
    const activityMigrationSql = files
      .map((file) => migrationSql(file))
      .find((content) => content.includes('CREATE TABLE "activity_daily"'));
    expect(activityMigrationSql).not.toContain('CREATE TABLE "pets"');
    expect(activityMigrationSql).not.toContain('CREATE TABLE "pet_users"');
    expect(activityMigrationSql).not.toContain('CREATE TABLE "devices"');
    expect(activityMigrationSql).not.toContain('CREATE TABLE "pet_devices"');
    expect(activityMigrationSql).not.toContain('CREATE TABLE "users"');
    expect(activityMigrationSql).not.toContain('CREATE TABLE "audit_log"');

    const sql = migrationSql(added[0]);
    const createdTables = [...sql.matchAll(/CREATE TABLE "([^"]+)"/g)].map(
      (match) => match[1],
    );

    expect(createdTables).toEqual(['activity_daily']);
    expect(sql).not.toMatch(/DROP TABLE|ALTER TABLE "(?!activity_daily")/);
    expect(sql).toContain('CONSTRAINT "activity_daily_pet_id_date_pk"');
  });

  it('el barrel re-exporta activity.schema con una sola linea', () => {
    const barrel = readFileSync(
      join(__dirname, '..', '..', '..', '..', 'db', 'schema', 'index.ts'),
      'utf8',
    );

    expect(
      barrel
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line.includes('activity.schema')),
    ).toEqual(["export * from './activity.schema';"]);
  });
});

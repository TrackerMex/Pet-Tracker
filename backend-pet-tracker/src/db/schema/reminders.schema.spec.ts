import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { getTableConfig, getTableName } from 'drizzle-orm/pg-core';
import * as schema from './index';
import { reminders } from './reminders.schema';

const MIGRATIONS_DIR = join(__dirname, '..', 'migrations');

function findRemindersMigration(): { file: string; sql: string } {
  const file = readdirSync(MIGRATIONS_DIR)
    .filter((name) => name.endsWith('.sql'))
    .find((name) =>
      readFileSync(join(MIGRATIONS_DIR, name), 'utf8').includes(
        'CREATE TABLE "reminders"',
      ),
    );

  if (!file) throw new Error('Reminders migration not found');
  return { file, sql: readFileSync(join(MIGRATIONS_DIR, file), 'utf8') };
}

describe('R1: tabla reminders y migracion 0011 aditiva', () => {
  const config = getTableConfig(reminders);
  const columns = new Map(
    config.columns.map((column) => [column.name, column]),
  );

  it('exporta reminders con las columnas, tipos y nulabilidad aprobados', () => {
    expect(getTableName(schema.reminders)).toBe('reminders');
    expect([...columns.keys()].sort()).toEqual(
      [
        'id',
        'pet_id',
        'type',
        'title',
        'due_at',
        'advance_minutes',
        'channel',
        'status',
        'schedule_name',
        'enqueued_at',
        'created_by',
      ].sort(),
    );
    expect(columns.get('id')?.primary).toBe(true);
    expect(columns.get('id')?.hasDefault).toBe(false);
    expect(columns.get('pet_id')?.notNull).toBe(true);
    expect(columns.get('type')?.getSQLType()).toBe('varchar(20)');
    expect(columns.get('title')?.getSQLType()).toBe('varchar(120)');
    expect(columns.get('due_at')?.getSQLType()).toBe(
      'timestamp with time zone',
    );
    expect(columns.get('advance_minutes')?.hasDefault).toBe(true);
    expect(columns.get('channel')?.hasDefault).toBe(true);
    expect(columns.get('status')?.hasDefault).toBe(true);
    expect(columns.get('schedule_name')?.notNull).toBe(false);
    expect(columns.get('schedule_name')?.getSQLType()).toBe('varchar(64)');
    expect(columns.get('enqueued_at')?.notNull).toBe(false);
    expect(columns.get('created_by')?.notNull).toBe(true);
  });

  it('declara los CHECKs, FKs e indices exactos', () => {
    expect(config.checks.map((check) => check.name)).toEqual(
      expect.arrayContaining([
        'reminders_type_check',
        'reminders_advance_minutes_check',
        'reminders_channel_check',
        'reminders_status_check',
      ]),
    );

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

    const indexes = new Map(
      config.indexes.map((index) => [index.config.name, index]),
    );
    expect(indexes.has('reminders_pet_id_idx')).toBe(true);
    expect(indexes.has('reminders_created_by_idx')).toBe(true);
    expect(
      indexes.get('reminders_due_at_scheduled_idx')?.config.where,
    ).toBeDefined();
  });

  it('genera un archivo 0011 nuevo sin alterar tablas existentes', () => {
    const migration = findRemindersMigration();

    expect(migration.file).toMatch(/^0011_.*\.sql$/);
    expect(migration.sql).toContain('CREATE TABLE "reminders"');
    expect(migration.sql).not.toContain('ALTER TABLE "pets"');
    expect(migration.sql).not.toContain('ALTER TABLE "users"');
  });
});

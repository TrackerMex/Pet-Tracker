import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { getTableConfig } from 'drizzle-orm/pg-core';
import { alertEvents } from '@/db/schema/alerts.schema';

const MIGRATIONS_DIR = join(__dirname, '..', 'migrations');

/** SQL de la migracion nueva: el archivo .sql que crea alert_events. */
function readAlertEventsMigrationSql(): string {
  const sqlFiles = readdirSync(MIGRATIONS_DIR).filter((file) =>
    file.endsWith('.sql'),
  );
  const migration = sqlFiles
    .map((file) => readFileSync(join(MIGRATIONS_DIR, file), 'utf8'))
    .find((sql) => sql.includes('CREATE TABLE "alert_events"'));

  if (!migration) {
    throw new Error(
      'No migration creating "alert_events" found in src/db/migrations',
    );
  }

  return migration;
}

describe('R1: la migracion crea alert_events conforme a docs/data-model.md (D1/D4)', () => {
  const config = getTableConfig(alertEvents);
  const columns = new Map(config.columns.map((c) => [c.name, c]));

  it('se llama alert_events y tiene exactamente las columnas de la spec', () => {
    expect(config.name).toBe('alert_events');
    expect([...columns.keys()].sort()).toEqual(
      [
        'id',
        'pet_id',
        'geofence_id',
        'type',
        'status',
        'payload',
        'opened_at',
        'acked_at',
        'closed_at',
      ].sort(),
    );
  });

  it('id es uuid PK sin default de base (UUIDv7 generado en app)', () => {
    const id = columns.get('id');
    expect(id?.primary).toBe(true);
    expect(id?.getSQLType()).toBe('uuid');
    expect(id?.hasDefault).toBe(false);
  });

  it('pet_id cascadea al borrar la mascota; geofence_id SET NULL (D1-A)', () => {
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
        {
          column: 'geofence_id',
          foreignTable: 'geofences',
          onDelete: 'set null',
        },
      ]),
    );
    expect(columns.get('pet_id')?.notNull).toBe(true);
    expect(columns.get('geofence_id')?.notNull).toBe(false);
  });

  it('type es NOT NULL con CHECK reducido a geofence_exit/battery_low', () => {
    const type = columns.get('type');
    expect(type?.notNull).toBe(true);
    const check = config.checks.find(
      (c) => c.name === 'alert_events_type_check',
    );
    expect(check).toBeDefined();
  });

  it('status es NOT NULL DEFAULT open con CHECK de los 3 estados del doc', () => {
    const status = columns.get('status');
    expect(status?.notNull).toBe(true);
    expect(status?.hasDefault).toBe(true);
    const check = config.checks.find(
      (c) => c.name === 'alert_events_status_check',
    );
    expect(check).toBeDefined();
  });

  it('payload es jsonb NOT NULL', () => {
    const payload = columns.get('payload');
    expect(payload?.notNull).toBe(true);
    expect(payload?.getSQLType()).toBe('jsonb');
  });

  it('opened_at NOT NULL; acked_at/closed_at NULL — los tres timestamptz', () => {
    expect(columns.get('opened_at')?.notNull).toBe(true);
    expect(columns.get('acked_at')?.notNull).toBe(false);
    expect(columns.get('closed_at')?.notNull).toBe(false);
    for (const ts of ['opened_at', 'acked_at', 'closed_at']) {
      expect(columns.get(ts)?.getSQLType()).toBe('timestamp with time zone');
    }
  });

  it('indices btree normales sobre pet_id y geofence_id (regla toda FK lleva indice)', () => {
    const byName = new Map(config.indexes.map((idx) => [idx.config.name, idx]));

    const petIdIdx = byName.get('alert_events_pet_id_idx');
    expect(petIdIdx).toBeDefined();
    expect(petIdIdx?.config.unique).toBeFalsy();

    const geofenceIdIdx = byName.get('alert_events_geofence_id_idx');
    expect(geofenceIdIdx).toBeDefined();
    expect(geofenceIdIdx?.config.unique).toBeFalsy();
  });
});

describe('R2: indice unico parcial anti-spam (pet_id, type, coalesce(geofence_id, uuid_nil literal)) WHERE status=open', () => {
  const config = getTableConfig(alertEvents);

  it('existe alert_events_open_anti_spam_idx, unico y parcial sobre status=open', () => {
    const idx = config.indexes.find(
      (i) => i.config.name === 'alert_events_open_anti_spam_idx',
    );
    expect(idx).toBeDefined();
    expect(idx?.config.unique).toBe(true);
    expect(idx?.config.where).toBeDefined();
  });

  it('el SQL de la migracion usa el literal uuid_nil (D4) en vez de la funcion uuid_nil()', () => {
    const sql = readAlertEventsMigrationSql();
    expect(sql).toContain("'00000000-0000-0000-0000-000000000000'::uuid");
    expect(sql).not.toContain('uuid_nil()');
    expect(sql).toContain(
      'CREATE UNIQUE INDEX "alert_events_open_anti_spam_idx"',
    );
  });
});

describe('R1: el SQL de la migracion nueva no toca ninguna otra tabla', () => {
  it('crea alert_events con sus indices y cero CREATE/ALTER de otras tablas', () => {
    const sql = readAlertEventsMigrationSql();

    expect(sql).toContain('CREATE TABLE "alert_events"');
    expect(sql).toContain('CREATE INDEX "alert_events_pet_id_idx"');
    expect(sql).toContain('CREATE INDEX "alert_events_geofence_id_idx"');

    expect(sql).not.toContain('CREATE TABLE "pets"');
    expect(sql).not.toContain('CREATE TABLE "geofences"');
    expect(sql).not.toContain('CREATE TABLE "devices"');
    expect(sql).not.toContain('CREATE TABLE "pet_devices"');
    expect(sql).not.toContain('CREATE TABLE "users"');
    expect(sql).not.toContain('CREATE TABLE "audit_log"');
    expect(sql).not.toContain('ALTER TABLE "pets"');
    expect(sql).not.toContain('ALTER TABLE "geofences"');
  });
});

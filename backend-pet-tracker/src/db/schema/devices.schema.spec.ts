import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { getTableConfig } from 'drizzle-orm/pg-core';
import { devices, petDevices } from '@/db/schema/devices.schema';

const MIGRATIONS_DIR = join(__dirname, '..', 'migrations');

/** SQL de la migracion nueva: el archivo .sql que crea la tabla devices. */
function readDevicesMigrationSql(): string {
  const sqlFiles = readdirSync(MIGRATIONS_DIR).filter((file) =>
    file.endsWith('.sql'),
  );
  const devicesMigration = sqlFiles
    .map((file) => readFileSync(join(MIGRATIONS_DIR, file), 'utf8'))
    .find((sql) => sql.includes('CREATE TABLE "devices"'));

  if (!devicesMigration) {
    throw new Error(
      'No migration creating "devices" found in src/db/migrations',
    );
  }

  return devicesMigration;
}

describe('R1: la migracion crea devices conforme a docs/data-model.md', () => {
  const config = getTableConfig(devices);
  const columns = new Map(config.columns.map((c) => [c.name, c]));

  it('se llama devices y tiene exactamente las columnas de la spec', () => {
    expect(config.name).toBe('devices');
    expect([...columns.keys()].sort()).toEqual(
      [
        'id',
        'esn',
        'imei',
        'serial_number',
        'activation_code',
        'wialon_unit_id',
        'model',
        'status',
        'battery_pct',
        'connectivity',
        'last_message_at',
        'ingest_watermark',
        'is_simulated',
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

  it('los 5 identificadores de device son UNIQUE y NULL (D4)', () => {
    for (const identifier of [
      'esn',
      'imei',
      'serial_number',
      'activation_code',
      'wialon_unit_id',
    ]) {
      const column = columns.get(identifier);
      expect(column?.isUnique).toBe(true);
      expect(column?.notNull).toBe(false);
    }
  });

  it('status es NOT NULL DEFAULT available con CHECK de los 3 estados', () => {
    const status = columns.get('status');
    expect(status?.notNull).toBe(true);
    expect(status?.hasDefault).toBe(true);
    const check = config.checks.find((c) => c.name === 'devices_status_check');
    expect(check).toBeDefined();
  });

  it('telemetria NULL hasta #8: battery_pct integer, timestamps con timezone', () => {
    const batteryPct = columns.get('battery_pct');
    expect(batteryPct?.getSQLType()).toBe('integer');
    expect(batteryPct?.notNull).toBe(false);
    expect(columns.get('connectivity')?.notNull).toBe(false);
    for (const ts of ['last_message_at', 'ingest_watermark']) {
      const column = columns.get(ts);
      expect(column?.notNull).toBe(false);
      expect(column?.getSQLType()).toBe('timestamp with time zone');
    }
  });

  it('is_simulated NOT NULL DEFAULT false; created/updated_at timestamptz DEFAULT now()', () => {
    const isSimulated = columns.get('is_simulated');
    expect(isSimulated?.notNull).toBe(true);
    expect(isSimulated?.hasDefault).toBe(true);
    for (const ts of ['created_at', 'updated_at']) {
      const column = columns.get(ts);
      expect(column?.notNull).toBe(true);
      expect(column?.hasDefault).toBe(true);
      expect(column?.getSQLType()).toBe('timestamp with time zone');
    }
  });
});

describe('R1: la migracion crea pet_devices conforme a docs/data-model.md', () => {
  const config = getTableConfig(petDevices);
  const columns = new Map(config.columns.map((c) => [c.name, c]));

  it('tiene id uuid PK propio y exactamente las columnas de la spec', () => {
    expect(config.name).toBe('pet_devices');
    expect([...columns.keys()].sort()).toEqual(
      ['id', 'pet_id', 'device_id', 'assigned_at', 'released_at'].sort(),
    );
    const id = columns.get('id');
    expect(id?.primary).toBe(true);
    expect(id?.getSQLType()).toBe('uuid');
    expect(id?.hasDefault).toBe(false);
  });

  it('pet_id cascadea al borrar la mascota; device_id NO cascadea', () => {
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
          column: 'device_id',
          foreignTable: 'devices',
          onDelete: 'no action',
        },
      ]),
    );
    expect(columns.get('pet_id')?.notNull).toBe(true);
    expect(columns.get('device_id')?.notNull).toBe(true);
  });

  it('assigned_at NOT NULL DEFAULT now(); released_at NULL — ambos timestamptz', () => {
    const assignedAt = columns.get('assigned_at');
    expect(assignedAt?.notNull).toBe(true);
    expect(assignedAt?.hasDefault).toBe(true);
    expect(assignedAt?.getSQLType()).toBe('timestamp with time zone');
    const releasedAt = columns.get('released_at');
    expect(releasedAt?.notNull).toBe(false);
    expect(releasedAt?.getSQLType()).toBe('timestamp with time zone');
  });

  it('indices unicos parciales sobre device_id y pet_id activos (D2)', () => {
    const byName = new Map(config.indexes.map((idx) => [idx.config.name, idx]));

    const activeDevice = byName.get('pet_devices_active_device_id_idx');
    expect(activeDevice?.config.unique).toBe(true);
    expect(activeDevice?.config.where).toBeDefined();

    const activePet = byName.get('pet_devices_active_pet_id_idx');
    expect(activePet?.config.unique).toBe(true);
    expect(activePet?.config.where).toBeDefined();
  });

  it('indices btree normales sobre las dos FKs (regla de docs/data-model.md)', () => {
    const byName = new Map(config.indexes.map((idx) => [idx.config.name, idx]));

    const petIdIdx = byName.get('pet_devices_pet_id_idx');
    expect(petIdIdx).toBeDefined();
    expect(petIdIdx?.config.unique).toBeFalsy();

    const deviceIdIdx = byName.get('pet_devices_device_id_idx');
    expect(deviceIdIdx).toBeDefined();
    expect(deviceIdIdx?.config.unique).toBeFalsy();
  });
});

describe('R1: el SQL de la migracion nueva no toca ninguna otra tabla', () => {
  it('crea devices + pet_devices con sus indices y cero menciones a otras tablas', () => {
    const sql = readDevicesMigrationSql();

    expect(sql).toContain('CREATE TABLE "devices"');
    expect(sql).toContain('CREATE TABLE "pet_devices"');
    expect(sql).toContain(
      'CREATE UNIQUE INDEX "pet_devices_active_device_id_idx"',
    );
    expect(sql).toContain(
      'CREATE UNIQUE INDEX "pet_devices_active_pet_id_idx"',
    );
    expect(sql).toContain('CREATE INDEX "pet_devices_pet_id_idx"');
    expect(sql).toContain('CREATE INDEX "pet_devices_device_id_idx"');

    // Solo referencia a `pets` via FK — jamas ALTER/CREATE de otras tablas.
    expect(sql).not.toContain('audit_log');
    expect(sql).not.toContain('"pet_users"');
    expect(sql).not.toContain('"users"');
    expect(sql).not.toContain('ALTER TABLE "pets"');
    expect(sql).not.toContain('CREATE TABLE "pets"');
  });
});

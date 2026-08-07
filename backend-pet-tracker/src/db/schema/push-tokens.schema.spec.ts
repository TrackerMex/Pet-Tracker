import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { getTableConfig } from 'drizzle-orm/pg-core';
import { alertEvents } from '@/db/schema/alerts.schema';
import { pushTokens } from '@/db/schema/push-tokens.schema';

const MIGRATIONS_DIR = join(__dirname, '..', 'migrations');

/**
 * SQL de la migracion 0008 (R1 + R2). R2 vive en este archivo y no junto a
 * alerts.schema.spec.ts a proposito: ambos requisitos describen la MISMA
 * migracion, y los tests de #12 no se tocan (D1 no cambia su significado —
 * su assert es `where` definido, que sigue siendo cierto).
 */
function readMigration0008(): string {
  const file = readdirSync(MIGRATIONS_DIR).find(
    (name) => name.startsWith('0008_') && name.endsWith('.sql'),
  );

  if (!file) {
    throw new Error('No 0008_*.sql migration found in src/db/migrations');
  }

  return readFileSync(join(MIGRATIONS_DIR, file), 'utf8');
}

describe('R1: la migracion 0008 crea push_tokens conforme a docs/data-model.md (D5)', () => {
  const config = getTableConfig(pushTokens);
  const columns = new Map(config.columns.map((c) => [c.name, c]));

  it('se llama push_tokens y tiene exactamente las columnas de la spec', () => {
    expect(config.name).toBe('push_tokens');
    expect([...columns.keys()].sort()).toEqual(
      [
        'id',
        'user_id',
        'expo_token',
        'platform',
        'created_at',
        'last_seen_at',
      ].sort(),
    );
  });

  it('id es uuid PK sin default de base (UUIDv7 generado en app)', () => {
    const id = columns.get('id');
    expect(id?.primary).toBe(true);
    expect(id?.getSQLType()).toBe('uuid');
    expect(id?.hasDefault).toBe(false);
  });

  it('user_id es uuid NOT NULL con FK a users ON DELETE CASCADE', () => {
    expect(columns.get('user_id')?.notNull).toBe(true);
    expect(columns.get('user_id')?.getSQLType()).toBe('uuid');

    const fks = config.foreignKeys.map((fk) => {
      const ref = fk.reference();
      return {
        column: ref.columns[0].name,
        foreignTable: getTableConfig(ref.foreignTable).name,
        onDelete: fk.onDelete,
      };
    });
    expect(fks).toEqual([
      { column: 'user_id', foreignTable: 'users', onDelete: 'cascade' },
    ]);
  });

  it('expo_token es text NOT NULL UNIQUE — el UNIQUE habilita el upsert de R3', () => {
    const expoToken = columns.get('expo_token');
    expect(expoToken?.notNull).toBe(true);
    expect(expoToken?.getSQLType()).toBe('text');
    expect(expoToken?.isUnique).toBe(true);
  });

  it('platform es varchar(10) NOT NULL con CHECK reducido a ios/android (D5)', () => {
    const platform = columns.get('platform');
    expect(platform?.notNull).toBe(true);
    expect(platform?.getSQLType()).toBe('varchar(10)');
    expect(
      config.checks.find((c) => c.name === 'push_tokens_platform_check'),
    ).toBeDefined();

    const sql = readMigration0008();
    expect(sql).toContain("in ('ios', 'android')");
    expect(sql).not.toContain("'web'");
  });

  it('created_at y last_seen_at son timestamptz NOT NULL DEFAULT now()', () => {
    for (const name of ['created_at', 'last_seen_at']) {
      expect(columns.get(name)?.notNull).toBe(true);
      expect(columns.get(name)?.hasDefault).toBe(true);
      expect(columns.get(name)?.getSQLType()).toBe('timestamp with time zone');
    }
  });

  it('indice btree sobre user_id (regla "toda FK lleva indice")', () => {
    const idx = config.indexes.find(
      (i) => i.config.name === 'push_tokens_user_id_idx',
    );
    expect(idx).toBeDefined();
    expect(idx?.config.unique).toBeFalsy();
  });

  it('la migracion 0008 crea la tabla y sus constraints', () => {
    const sql = readMigration0008();
    expect(sql).toContain('CREATE TABLE "push_tokens"');
    expect(sql).toContain('CREATE INDEX "push_tokens_user_id_idx"');
    expect(sql).toContain(
      'REFERENCES "public"."users"("id") ON DELETE cascade',
    );
  });
});

describe('R2: la migracion 0008 redefine el indice anti-spam a WHERE status <> closed (D1)', () => {
  it('el .where() del schema pasa de status = open a status <> closed', () => {
    const idx = getTableConfig(alertEvents).indexes.find(
      (i) => i.config.name === 'alert_events_open_anti_spam_idx',
    );
    expect(idx).toBeDefined();
    expect(idx?.config.unique).toBe(true);

    const where = idx?.config.where?.queryChunks
      .map((chunk) =>
        typeof chunk === 'object' && chunk !== null && 'value' in chunk
          ? (chunk as { value: unknown[] }).value.join('')
          : '',
      )
      .join('');
    expect(where).toContain("<> 'closed'");
    expect(where).not.toContain("= 'open'");
  });

  it('la migracion 0008 hace DROP INDEX y CREATE UNIQUE INDEX con el predicado nuevo', () => {
    const sql = readMigration0008();

    expect(sql).toContain('DROP INDEX "alert_events_open_anti_spam_idx"');
    expect(sql).toContain(
      'CREATE UNIQUE INDEX "alert_events_open_anti_spam_idx"',
    );
    // Las tres columnas del indice se conservan intactas.
    expect(sql).toContain(
      `"pet_id","type",coalesce("geofence_id", '00000000-0000-0000-0000-000000000000'::uuid)`,
    );
    expect(sql).toContain(`WHERE "alert_events"."status" <> 'closed'`);
  });

  it('la migracion 0008 no crea ni altera ninguna otra tabla, columna, CHECK ni indice', () => {
    const sql = readMigration0008();

    for (const table of [
      'pets',
      'pet_users',
      'geofences',
      'devices',
      'pet_devices',
      'users',
      'audit_log',
      'activity_daily',
      'alert_events',
    ]) {
      expect(sql).not.toContain(`CREATE TABLE "${table}"`);
      expect(sql).not.toContain(`ALTER TABLE "${table}"`);
    }

    // El unico DROP admitido es el del indice anti-spam que se recrea.
    const drops = sql.match(/DROP\s+\w+/g) ?? [];
    expect(drops).toEqual(['DROP INDEX']);
  });
});

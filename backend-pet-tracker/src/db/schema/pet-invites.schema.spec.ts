import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { getTableConfig } from 'drizzle-orm/pg-core';
import { petInvites } from './pet-invites.schema';

const migrationsDir = join(__dirname, '..', 'migrations');

describe('#211 R1: pet_invites', () => {
  it('#211 R1: pet_invites tiene exactamente las 10 columnas declaradas', () => {
    expect(
      getTableConfig(petInvites)
        .columns.map((column) => column.name)
        .sort(),
    ).toEqual([
      'accepted_at',
      'accepted_by',
      'code_hash',
      'created_at',
      'created_by',
      'expires_at',
      'id',
      'pet_id',
      'revoked_at',
      'role',
    ]);
  });

  it('#211 R1: code_hash es char(64) NOT NULL único y role tiene su CHECK', () => {
    const config = getTableConfig(petInvites);
    const column = config.columns.find(
      (candidate) => candidate.name === 'code_hash',
    );
    expect(column).toBeDefined();
    expect(column?.getSQLType()).toBe('char(64)');
    expect(column?.notNull).toBe(true);
    expect(column?.isUnique).toBe(true);
    expect(config.checks.map((check) => check.name)).toContain(
      'pet_invites_role_check',
    );
  });

  it('#211 R1: la migración generada crea tabla, unique, check, FKs e índices', () => {
    const files = readdirSync(migrationsDir).filter((name) =>
      /^\d{4}_pet_invites\.sql$/.test(name),
    );
    expect(files).toHaveLength(1);
    const sql = readFileSync(join(migrationsDir, files[0]), 'utf8');
    for (const literal of [
      'CREATE TABLE "pet_invites"',
      '"code_hash" char(64) NOT NULL',
      'CONSTRAINT "pet_invites_code_hash_unique" UNIQUE("code_hash")',
      'CONSTRAINT "pet_invites_role_check" CHECK',
      '"pet_invites_pet_id_pets_id_fk"',
      '"pet_invites_created_by_users_id_fk"',
      '"pet_invites_accepted_by_users_id_fk"',
      'ON DELETE set null',
      'CREATE INDEX "pet_invites_pet_id_idx"',
      'CREATE INDEX "pet_invites_created_by_idx"',
      'CREATE INDEX "pet_invites_accepted_by_idx"',
    ])
      expect(sql).toContain(literal);
    const journal = JSON.parse(
      readFileSync(join(migrationsDir, 'meta', '_journal.json'), 'utf8'),
    ) as { entries: { tag: string }[] };
    expect(
      journal.entries.filter((entry) => /^\d{4}_pet_invites$/.test(entry.tag)),
    ).toHaveLength(1);
  });
});

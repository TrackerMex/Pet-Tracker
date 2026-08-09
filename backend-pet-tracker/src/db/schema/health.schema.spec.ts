import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { getTableConfig } from 'drizzle-orm/pg-core';
import { petVaccines, vaccineCatalog } from './health.schema';

const MIGRATIONS_DIR = join(__dirname, '..', 'migrations');

function readHealthMigrationSql(): string {
  const sql = readdirSync(MIGRATIONS_DIR)
    .filter((file) => file.endsWith('.sql'))
    .map((file) => readFileSync(join(MIGRATIONS_DIR, file), 'utf8'))
    .find((content) => content.includes('CREATE TABLE "vaccine_catalog"'));

  if (!sql) throw new Error('Health migration not found');
  return sql;
}

describe('R1: schema y migracion de vacunas', () => {
  it('crea vaccine_catalog con especie, nombre y esquema unicos', () => {
    const config = getTableConfig(vaccineCatalog);
    expect(config.columns.map((column) => column.name).sort()).toEqual(
      ['id', 'species', 'name', 'scheme'].sort(),
    );
    expect(config.checks.map((item) => item.name)).toContain(
      'vaccine_catalog_species_check',
    );
    expect(config.indexes.map((item) => item.config.name)).toContain(
      'vaccine_catalog_species_name_idx',
    );
  });

  it('crea pet_vaccines con sus FKs, campos e indices', () => {
    const config = getTableConfig(petVaccines);
    expect(config.columns.map((column) => column.name).sort()).toEqual(
      [
        'id',
        'pet_id',
        'catalog_id',
        'name',
        'applied_at',
        'next_dose_at',
        'vet_name',
        'clinic',
        'notes',
        'document_key',
        'created_by',
      ].sort(),
    );
    expect(config.indexes.map((item) => item.config.name)).toEqual(
      expect.arrayContaining([
        'pet_vaccines_pet_id_applied_at_idx',
        'pet_vaccines_catalog_id_idx',
        'pet_vaccines_created_by_idx',
      ]),
    );
  });

  it('la migracion solo crea las dos tablas de la feature', () => {
    const sql = readHealthMigrationSql();
    expect(sql).toContain('CREATE TABLE "vaccine_catalog"');
    expect(sql).toContain('CREATE TABLE "pet_vaccines"');
    expect(sql).not.toContain('ALTER TABLE "pets"');
    expect(sql).not.toContain('CREATE TABLE "weights"');
  });
});

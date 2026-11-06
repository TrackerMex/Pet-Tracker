import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { is } from 'drizzle-orm';
import { getTableConfig, PgTable } from 'drizzle-orm/pg-core';
import * as schema from '@/db/schema';
import { petVaccines, weights } from './health.schema';
import { mealServings } from './nutrition.schema';
import { reminders } from './reminders.schema';
import { petDocuments } from './media.schema';
import { users } from './users.schema';

const MIGRATIONS_DIR = join(__dirname, '..', 'migrations');
const tables = [petVaccines, weights, mealServings, reminders, petDocuments];
const names = [
  'pet_vaccines',
  'weights',
  'meal_servings',
  'reminders',
  'pet_documents',
];

describe('#247 R1: created_by nullable con ON DELETE SET NULL en las 5 tablas', () => {
  it('#247 R1: las 5 columnas created_by son nullable y su FK a users es set null', () => {
    for (const table of tables) {
      const config = getTableConfig(table);
      const column = config.columns.find(
        (column) => column.name === 'created_by',
      );
      expect(column).toBeDefined();
      expect(column?.notNull).toBe(false);
      const fk = config.foreignKeys.find(
        (fk) => fk.reference().columns[0].name === 'created_by',
      );
      expect(fk?.reference().foreignTable).toBe(users);
      expect(fk?.onDelete).toBe('set null');
    }
  });

  it('#247 R1: la migración 0024_created_by_set_null.sql solo suelta NOT NULL y rehace las 5 FKs', () => {
    expect(
      readdirSync(MIGRATIONS_DIR).filter((f) => f.startsWith('0024_')),
    ).toEqual(['0024_created_by_set_null.sql']);
    const sql = readFileSync(
      join(MIGRATIONS_DIR, '0024_created_by_set_null.sql'),
      'utf8',
    );
    for (const t of names) {
      expect(sql).toContain(
        `ALTER TABLE "${t}" ALTER COLUMN "created_by" DROP NOT NULL`,
      );
      expect(sql).toMatch(
        new RegExp(
          `ALTER TABLE "${t}" ADD CONSTRAINT "[^"]+" FOREIGN KEY \\("created_by"\\) REFERENCES "public"\\."users"\\("id"\\) ON DELETE set null`,
        ),
      );
    }
    expect(sql).not.toMatch(/DROP TABLE|DROP COLUMN|CREATE TABLE|ADD COLUMN/);
  });

  it('#247 R1: el journal registra 0024_created_by_set_null con idx 24', () => {
    const journal = JSON.parse(
      readFileSync(join(MIGRATIONS_DIR, 'meta', '_journal.json'), 'utf8'),
    ) as { entries: { tag: string; idx: number }[] };
    const entry = journal.entries.find(
      (e) => e.tag === '0024_created_by_set_null',
    );
    expect(entry).toBeDefined();
    expect(entry?.idx).toBe(24);
  });

  it('#247 R1: toda FK del esquema hacia users.id borra en cascada o pone NULL', () => {
    const fks = Object.values(schema)
      .filter((value) => is(value, PgTable))
      .flatMap((table) => {
        const config = getTableConfig(table);
        return config.foreignKeys
          .filter((fk) => fk.reference().foreignTable === users)
          .map(
            (fk) =>
              `${config.name}.${fk.reference().columns[0].name}:${String(fk.onDelete)}`,
          );
      });
    expect(
      fks.filter((fk) => !fk.endsWith(':cascade') && !fk.endsWith(':set null')),
    ).toEqual([]);
    for (const t of names) expect(fks).toContain(`${t}.created_by:set null`);
  });
});

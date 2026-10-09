import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { getTableConfig } from 'drizzle-orm/pg-core';
import { petDocuments } from '@/db/schema/media.schema';

const MIGRATIONS_DIR = join(__dirname, '..', 'migrations');

describe('#157 R1: columna uploaded_at y migración 0019', () => {
  it('#157 R1: pet_documents.uploaded_at es timestamptz nullable sin default', () => {
    const config = getTableConfig(petDocuments);
    const columnNames = config.columns.map((column) => column.name);

    expect(columnNames).toContain('uploaded_at');

    const column = config.columns.find(
      (candidate) => candidate.name === 'uploaded_at',
    );
    expect(column?.notNull).toBe(false);
    expect(column?.hasDefault).toBe(false);
    expect(column?.getSQLType()).toBe('timestamp with time zone');
  });

  it('#157 R1: la migración 0019_pet_documents_uploaded_at.sql es exactamente el ALTER', () => {
    expect(readdirSync(MIGRATIONS_DIR)).toContain(
      '0019_pet_documents_uploaded_at.sql',
    );
    const sql = readFileSync(
      join(MIGRATIONS_DIR, '0019_pet_documents_uploaded_at.sql'),
      'utf8',
    );

    expect(sql.trim()).toBe(
      'ALTER TABLE "pet_documents" ADD COLUMN "uploaded_at" timestamp with time zone;',
    );
  });

  it('#157 R1: el journal registra 0019_pet_documents_uploaded_at con idx 19', () => {
    const journal = JSON.parse(
      readFileSync(join(MIGRATIONS_DIR, 'meta', '_journal.json'), 'utf8'),
    ) as { entries: { idx: number; tag: string }[] };
    const entry = journal.entries.find(
      (candidate) => candidate.tag === '0019_pet_documents_uploaded_at',
    );

    expect(entry?.idx).toBe(19);
  });
});

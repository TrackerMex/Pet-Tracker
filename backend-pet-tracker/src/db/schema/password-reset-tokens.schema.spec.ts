import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { getTableConfig } from 'drizzle-orm/pg-core';
import { passwordResetTokens } from './password-reset-tokens.schema';

const MIGRATIONS_DIR = join(__dirname, '..', 'migrations');

function readMigration0015(): string {
  const file = readdirSync(MIGRATIONS_DIR).find(
    (name) => name === '0015_auth_password_reset_tokens.sql',
  );

  if (!file) {
    throw new Error(
      'No 0015_auth_password_reset_tokens.sql migration found in src/db/migrations',
    );
  }

  return readFileSync(join(MIGRATIONS_DIR, file), 'utf8');
}

describe('R12: password_reset_tokens espeja el patron de email_verification_tokens', () => {
  const config = getTableConfig(passwordResetTokens);
  const columns = new Map(config.columns.map((column) => [column.name, column]));

  it('declara exactamente las seis columnas del contrato', () => {
    expect(config.name).toBe('password_reset_tokens');
    expect([...columns.keys()].sort()).toEqual(
      [
        'id',
        'user_id',
        'token_hash',
        'expires_at',
        'used_at',
        'created_at',
      ].sort(),
    );
  });

  it('usa UUID de aplicacion, FK CASCADE y hash SHA-256 unico', () => {
    const id = columns.get('id');
    expect(id?.primary).toBe(true);
    expect(id?.notNull).toBe(true);
    expect(id?.getSQLType()).toBe('uuid');
    expect(id?.hasDefault).toBe(false);

    const userId = columns.get('user_id');
    expect(userId?.notNull).toBe(true);
    expect(userId?.getSQLType()).toBe('uuid');
    const foreignKeys = config.foreignKeys.map((foreignKey) => {
      const reference = foreignKey.reference();
      return {
        column: reference.columns[0].name,
        foreignTable: getTableConfig(reference.foreignTable).name,
        onDelete: foreignKey.onDelete,
      };
    });
    expect(foreignKeys).toEqual([
      { column: 'user_id', foreignTable: 'users', onDelete: 'cascade' },
    ]);

    const tokenHash = columns.get('token_hash');
    expect(tokenHash?.notNull).toBe(true);
    expect(tokenHash?.getSQLType()).toBe('char(64)');
    expect(tokenHash?.isUnique).toBe(true);
  });

  it('modela expiracion, consumo y creacion con timestamptz', () => {
    expect(columns.get('expires_at')?.notNull).toBe(true);
    expect(columns.get('expires_at')?.getSQLType()).toBe(
      'timestamp with time zone',
    );
    expect(columns.get('used_at')?.notNull).toBe(false);
    expect(columns.get('used_at')?.getSQLType()).toBe(
      'timestamp with time zone',
    );
    expect(columns.get('created_at')?.notNull).toBe(true);
    expect(columns.get('created_at')?.hasDefault).toBe(true);
    expect(columns.get('created_at')?.getSQLType()).toBe(
      'timestamp with time zone',
    );
  });

  it('indexa manualmente la FK user_id', () => {
    const index = config.indexes.find(
      (candidate) =>
        candidate.config.name === 'password_reset_tokens_user_id_idx',
    );

    expect(index).toBeDefined();
    expect(index?.config.unique).toBeFalsy();
  });

  it('la migracion 0015 crea la tabla, la FK y el indice', () => {
    const sql = readMigration0015();

    expect(sql).toContain('CREATE TABLE "password_reset_tokens"');
    expect(sql).toContain(
      '"token_hash" char(64) NOT NULL CONSTRAINT "password_reset_tokens_tokenHash_unique" UNIQUE',
    );
    expect(sql).toContain(
      'REFERENCES "public"."users"("id") ON DELETE cascade',
    );
    expect(sql).toContain(
      'CREATE INDEX "password_reset_tokens_user_id_idx"',
    );
  });
});

import { getTableName } from 'drizzle-orm';
import * as schema from './index';

describe('barrel de schema Drizzle: tablas de dominio de auth-registration', () => {
  it('exporta users, email_verification_tokens y audit_log', () => {
    expect(getTableName(schema.users)).toBe('users');
    expect(getTableName(schema.emailVerificationTokens)).toBe(
      'email_verification_tokens',
    );
    expect(getTableName(schema.auditLog)).toBe('audit_log');
  });

  it('ya no exporta el placeholder schemaBootstrap de db-setup-drizzle', () => {
    expect(Object.keys(schema)).not.toContain('schemaBootstrap');
  });
});

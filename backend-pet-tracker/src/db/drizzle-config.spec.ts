import config from '../../drizzle.config';

describe('R2: drizzle.config.ts points to schema barrel and migrations folder', () => {
  it('sets schema, out and dialect for drizzle-kit', () => {
    expect(config.schema).toBe('src/db/schema/index.ts');
    expect(config.out).toBe('src/db/migrations');
    expect(config.dialect).toBe('postgresql');
  });
});

describe('R2: drizzle.config.ts points to schema barrel and migrations folder', () => {
  it('sets schema, out and dialect for drizzle-kit', () => {
    // Loaded via require (not a static import) so this test can run without
    // drizzle.config.ts existing yet during the red phase.
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const config = require('../../drizzle.config').default;

    expect(config.schema).toBe('src/db/schema/index.ts');
    expect(config.out).toBe('src/db/migrations');
    expect(config.dialect).toBe('postgresql');
  });
});

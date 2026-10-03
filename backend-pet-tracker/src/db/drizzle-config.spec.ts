import type { Config } from 'drizzle-kit';

// drizzle.config.ts vive fuera de src/ (rootDir de jest): el require sube dos
// niveles. Se mockea dotenv para que ningún test dependa del .env real.
const CONFIG_PATH = '../../drizzle.config';
const TEST_DATABASE_URL = 'postgresql://u:p@localhost:5432/test_db';

function loadDrizzleConfig(): Config & { dbCredentials: { url: string } } {
  let loaded: Config | undefined;
  jest.isolateModules(() => {
    jest.doMock('dotenv', () => ({ config: jest.fn() }));
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    loaded = (require(CONFIG_PATH) as { default: Config }).default;
  });
  return loaded as Config & { dbCredentials: { url: string } };
}

const originalDatabaseUrl = process.env.DATABASE_URL;

afterEach(() => {
  if (originalDatabaseUrl === undefined) {
    delete process.env.DATABASE_URL;
  } else {
    process.env.DATABASE_URL = originalDatabaseUrl;
  }
});

describe('R2: drizzle.config.ts points to schema barrel and migrations folder', () => {
  it('sets schema, out and dialect for drizzle-kit', () => {
    process.env.DATABASE_URL = TEST_DATABASE_URL;

    const config = loadDrizzleConfig();

    expect(config.schema).toBe('src/db/schema/index.ts');
    expect(config.out).toBe('src/db/migrations');
    expect(config.dialect).toBe('postgresql');
  });
});

describe('drizzle.config: DATABASE_URL obligatoria al correr drizzle-kit', () => {
  it('aborta con un error que nombra DATABASE_URL cuando falta', () => {
    delete process.env.DATABASE_URL;

    expect(() => loadDrizzleConfig()).toThrow(/DATABASE_URL/);
  });

  it('expone dbCredentials.url con el valor de DATABASE_URL cuando está definida', () => {
    process.env.DATABASE_URL = TEST_DATABASE_URL;

    expect(loadDrizzleConfig().dbCredentials.url).toBe(TEST_DATABASE_URL);
  });
});

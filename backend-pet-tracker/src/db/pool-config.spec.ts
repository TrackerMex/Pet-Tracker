import { ConfigService } from '@nestjs/config';
import {
  buildPoolConfig,
  DatabaseConfigError,
  DEFAULT_DB_POOL_MAX,
} from './pool-config';
const url = 'postgresql://pet:pet@localhost/local';
function config(values: Record<string, string | undefined>): ConfigService {
  return { get: (key: string) => values[key] } as unknown as ConfigService;
}
describe('R2: buildPoolConfig fuera de producción usa DATABASE_URL y DB_POOL_MAX', () => {
  it('R2: sin DB_POOL_MAX devuelve { connectionString, max: 10 } sin ssl', () => {
    expect(DEFAULT_DB_POOL_MAX).toBe(10);
    expect(buildPoolConfig(config({ DATABASE_URL: url }))).toStrictEqual({
      connectionString: url,
      max: 10,
    });
  });
  it('R2: DB_POOL_MAX con espacios se recorta', () => {
    expect(
      buildPoolConfig(config({ DATABASE_URL: url, DB_POOL_MAX: '  7 ' })),
    ).toStrictEqual({ connectionString: url, max: 7 });
  });
  it('R2: DB_POOL_MAX en blanco usa el default', () => {
    expect(
      buildPoolConfig(config({ DATABASE_URL: url, DB_POOL_MAX: '   ' })),
    ).toStrictEqual({ connectionString: url, max: 10 });
  });
  it.each(['0', '-3', '2.5', 'diez', '07'])(
    'R2: DB_POOL_MAX %p lanza DatabaseConfigError que nombra DB_POOL_MAX',
    (value) => {
      let caught: unknown;
      try {
        buildPoolConfig(config({ DATABASE_URL: url, DB_POOL_MAX: value }));
      } catch (error) {
        caught = error;
      }
      expect(caught).toBeInstanceOf(DatabaseConfigError);
      expect((caught as Error).name).toBe('DatabaseConfigError');
      expect((caught as Error).message).toContain('DB_POOL_MAX');
    },
  );
  it.each(['test', 'development', undefined])(
    'R2: NODE_ENV %p no activa producción aunque haya PG*',
    (nodeEnv) => {
      expect(
        buildPoolConfig(
          config({
            NODE_ENV: nodeEnv,
            DATABASE_URL: url,
            PGHOST: 'host',
            PGPORT: '5432',
            PGDATABASE: 'db',
            PGUSER: 'user',
            PGPASSWORD: 'pass',
          }),
        ),
      ).toStrictEqual({ connectionString: url, max: 10 });
    },
  );
});

const productionValues = {
  NODE_ENV: 'production',
  DATABASE_URL: 'postgresql://ignorada@localhost/x',
  PGHOST: 'db.internal.example',
  PGPORT: '5432',
  PGDATABASE: 'pet_tracker',
  PGUSER: 'pet_tracker_app',
  PGPASSWORD: 'pass-sentinel-245',
  DB_POOL_MAX: '5',
};
function poolError(values: Record<string, string | undefined>): Error {
  let caught: unknown;
  try {
    buildPoolConfig(config(values));
  } catch (error) {
    caught = error;
  }
  expect(caught).toBeInstanceOf(DatabaseConfigError);
  expect((caught as Error).name).toBe('DatabaseConfigError');
  return caught as Error;
}
describe('R3: buildPoolConfig en producción usa PG* con TLS verificado', () => {
  it('R3: con PG* válidas devuelve la config por campos con ssl verificado e ignora DATABASE_URL', () => {
    expect(buildPoolConfig(config(productionValues))).toStrictEqual({
      host: 'db.internal.example',
      port: 5432,
      database: 'pet_tracker',
      user: 'pet_tracker_app',
      password: 'pass-sentinel-245',
      ssl: { rejectUnauthorized: true },
      max: 5,
    });
  });
  it('R3: sin PG* ni DB_POOL_MAX lanza un único DatabaseConfigError que nombra las seis', () => {
    const error = poolError({
      NODE_ENV: 'production',
      DATABASE_URL: productionValues.DATABASE_URL,
    });
    for (const key of [
      'PGHOST',
      'PGPORT',
      'PGDATABASE',
      'PGUSER',
      'PGPASSWORD',
      'DB_POOL_MAX',
    ])
      expect(error.message).toContain(key);
  });
  it.each(['0', '65536', 'abc', '54.3'])(
    'R3: PGPORT %p se rechaza nombrando PGPORT',
    (port) => {
      expect(
        poolError({ ...productionValues, PGPORT: port }).message,
      ).toContain('PGPORT');
    },
  );
  it('R3: un PGUSER en blanco cuenta como ausente', () => {
    expect(poolError({ ...productionValues, PGUSER: '   ' }).message).toContain(
      'PGUSER',
    );
  });
  it('R3: el mensaje no reproduce ningún valor', () => {
    const values = {
      ...productionValues,
      PGHOST: 'host-sentinel-245',
      PGPORT: '99999',
      DB_POOL_MAX: 'max-sentinel-245',
      PGPASSWORD: 'pass-sentinel-245',
    };
    const error = poolError(values);
    for (const value of [
      values.PGHOST,
      values.PGPORT,
      values.DB_POOL_MAX,
      values.PGPASSWORD,
    ])
      expect(error.message).not.toContain(value);
  });
});

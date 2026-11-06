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

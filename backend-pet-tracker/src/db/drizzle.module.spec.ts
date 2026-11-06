import { Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import type { Pool } from 'pg';
import { DrizzleModule } from './drizzle.module';
import { DRIZZLE, PG_POOL } from './drizzle.constants';

describe('R4: DrizzleModule exposes a Drizzle client under the DRIZZLE token', () => {
  let moduleRef: TestingModule;

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [DrizzleModule],
    })
      .overrideProvider(ConfigService)
      .useValue({
        get: (key: string) =>
          key === 'DATABASE_URL'
            ? 'postgresql://pet_tracker:pet_tracker@localhost:5432/pet_tracker'
            : undefined,
      })
      .compile();
  });

  afterAll(async () => {
    await moduleRef.close();
  });

  it('resolves a drizzle-orm/node-postgres client under DRIZZLE', () => {
    const db = moduleRef.get<NodePgDatabase>(DRIZZLE);

    expect(db).toBeDefined();
    expect(typeof db.select).toBe('function');
    expect(typeof db.execute).toBe('function');
  });
});

describe('#238: PG_POOL logs idle client errors instead of crashing', () => {
  let moduleRef: TestingModule;

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [DrizzleModule],
    })
      .overrideProvider(ConfigService)
      .useValue({
        get: (key: string) =>
          key === 'DATABASE_URL'
            ? 'postgresql://pet_tracker:pet_tracker@localhost:5432/pet_tracker'
            : undefined,
      })
      .compile();
  });

  afterAll(async () => {
    await moduleRef.close();
  });

  it('#238 R1: an error emitted by PG_POOL is logged with Logger.error and does not throw', () => {
    const errorSpy = jest.spyOn(Logger.prototype, 'error').mockImplementation();
    const pool = moduleRef.get<Pool>(PG_POOL);
    const error = new Error(
      'terminating connection due to administrator command',
    );

    try {
      expect(() => pool.emit('error', error)).not.toThrow();
      expect(errorSpy).toHaveBeenCalledTimes(1);
      expect(errorSpy).toHaveBeenCalledWith(
        'Idle client error: terminating connection due to administrator command',
        error.stack,
      );
    } finally {
      errorSpy.mockRestore();
    }
  });
});

describe('#245 R4: PG_POOL se construye con buildPoolConfig', () => {
  it('#245 R4: con DB_POOL_MAX=7 el pool tiene options.max 7', async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [DrizzleModule],
    })
      .overrideProvider(ConfigService)
      .useValue({
        get: (key: string) =>
          (
            ({
              DATABASE_URL:
                'postgresql://pet_tracker:pet_tracker@localhost:5432/pet_tracker',
              DB_POOL_MAX: '7',
            }) as Record<string, string>
          )[key],
      })
      .compile();
    try {
      expect(moduleRef.get<Pool>(PG_POOL, { strict: false }).options.max).toBe(
        7,
      );
    } finally {
      await moduleRef.close();
    }
  });
});

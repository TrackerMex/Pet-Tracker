import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { DrizzleModule } from './drizzle.module';
import { DRIZZLE } from './drizzle.constants';

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
    const db = moduleRef.get(DRIZZLE);

    expect(db).toBeDefined();
    expect(typeof db.select).toBe('function');
    expect(typeof db.execute).toBe('function');
  });
});

import {
  Global,
  Inject,
  Injectable,
  Module,
  OnModuleDestroy,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { DRIZZLE, PG_POOL } from './drizzle.constants';

@Injectable()
class DrizzlePoolLifecycle implements OnModuleDestroy {
  constructor(@Inject(PG_POOL) private readonly pool: Pool) {}

  async onModuleDestroy(): Promise<void> {
    await this.pool.end();
  }
}

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: PG_POOL,
      useFactory: (config: ConfigService) => {
        return new Pool({
          connectionString: config.get<string>('DATABASE_URL'),
        });
      },
      inject: [ConfigService],
    },
    {
      provide: DRIZZLE,
      useFactory: (pool: Pool) => drizzle(pool),
      inject: [PG_POOL],
    },
    DrizzlePoolLifecycle,
  ],
  exports: [DRIZZLE],
})
export class DrizzleModule {}

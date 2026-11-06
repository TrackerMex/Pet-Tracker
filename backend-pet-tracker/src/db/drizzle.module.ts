import {
  Global,
  Inject,
  Injectable,
  Logger,
  Module,
  OnApplicationShutdown,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { buildPoolConfig } from './pool-config';
import { DRIZZLE, PG_POOL } from './drizzle.constants';

const poolLogger = new Logger('PgPool');

@Injectable()
class DrizzlePoolLifecycle implements OnApplicationShutdown {
  constructor(@Inject(PG_POOL) private readonly pool: Pool) {}

  async onApplicationShutdown(): Promise<void> {
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
        const pool = new Pool(buildPoolConfig(config));
        pool.on('error', (error) => {
          poolLogger.error(`Idle client error: ${error.message}`, error.stack);
        });
        return pool;
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

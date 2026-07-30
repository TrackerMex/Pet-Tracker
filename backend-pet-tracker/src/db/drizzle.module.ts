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

// Cierra el pg.Pool cuando el módulo se destruye (shutdown de la app o
// app.close() en tests e2e) para no dejar sockets/timers colgados.
@Injectable()
class DrizzlePoolLifecycle implements OnModuleDestroy {
  constructor(@Inject(PG_POOL) private readonly pool: Pool) {}

  async onModuleDestroy(): Promise<void> {
    await this.pool.end();
  }
}

// Infraestructura Drizzle compartida por todo el proceso: un único
// pg.Pool + cliente drizzle-orm/node-postgres, expuesto bajo el token
// DRIZZLE (ver docs/architecture.md §Estructura de módulo). Global para
// que los repositorios Drizzle de cualquier módulo lo inyecten con
// @Inject(DRIZZLE) sin reimportar este módulo (sirve a R4).
@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: PG_POOL,
      useFactory: (config: ConfigService) => {
        // DATABASE_URL SIEMPRE vía ConfigService, nunca process.env directo
        // (R6) — la única excepción documentada es drizzle.config.ts.
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

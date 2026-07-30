import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { DRIZZLE } from './drizzle.constants';

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
      provide: DRIZZLE,
      useFactory: (config: ConfigService) => {
        // DATABASE_URL SIEMPRE vía ConfigService, nunca process.env directo
        // (R6) — la única excepción documentada es drizzle.config.ts.
        const pool = new Pool({
          connectionString: config.get<string>('DATABASE_URL'),
        });
        return drizzle(pool);
      },
      inject: [ConfigService],
    },
  ],
  exports: [DRIZZLE],
})
export class DrizzleModule {}

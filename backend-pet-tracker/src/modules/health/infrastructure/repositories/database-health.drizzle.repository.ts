import { Inject, Injectable } from '@nestjs/common';
import { sql } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DRIZZLE } from '../../../../db/drizzle.constants';
import { DatabaseHealthChecker } from '../../domain/repositories/database-health-checker.repository';

// Implementa DatabaseHealthChecker con el cliente Drizzle/pg compartido
// (token DRIZZLE, ver src/db/drizzle.module.ts). Único lugar del módulo
// health que conoce Drizzle (sirve a R7, R8).
@Injectable()
export class DatabaseHealthDrizzleRepository implements DatabaseHealthChecker {
  constructor(@Inject(DRIZZLE) private readonly db: NodePgDatabase) {}

  async ping(): Promise<boolean> {
    try {
      await this.db.execute(sql`SELECT 1`);
      return true;
    } catch {
      return false;
    }
  }
}

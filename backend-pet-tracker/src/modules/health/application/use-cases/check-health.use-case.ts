import { Inject, Injectable } from '@nestjs/common';
import { DATABASE_HEALTH_CHECKER } from '../../domain/repositories/database-health-checker.repository';
import type { DatabaseHealthChecker } from '../../domain/repositories/database-health-checker.repository';

export type PostgresHealthStatus = 'ok' | 'error';

export interface HealthCheckResult {
  postgres: PostgresHealthStatus;
}

// Orquesta la verificación de salud de Postgres. No sabe de HTTP ni de
// Drizzle — depende solo de la interface de domain (sirve a R7, R8).
@Injectable()
export class CheckHealthUseCase {
  constructor(
    @Inject(DATABASE_HEALTH_CHECKER)
    private readonly databaseHealthChecker: DatabaseHealthChecker,
  ) {}

  async execute(): Promise<HealthCheckResult> {
    const isUp = await this.databaseHealthChecker.ping().catch(() => false);
    return { postgres: isUp ? 'ok' : 'error' };
  }
}

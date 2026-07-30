import { Inject, Injectable } from '@nestjs/common';
import { DATABASE_HEALTH_CHECKER } from '../../domain/repositories/database-health-checker.repository';
import type { DatabaseHealthChecker } from '../../domain/repositories/database-health-checker.repository';

export type PostgresHealthStatus = 'ok' | 'error';

export interface HealthCheckResult {
  postgres: PostgresHealthStatus;
}

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

import { Module } from '@nestjs/common';
import { HealthController } from './infrastructure/health.controller';
import { CheckHealthUseCase } from './application/use-cases/check-health.use-case';
import { DATABASE_HEALTH_CHECKER } from './domain/repositories/database-health-checker.repository';
import { DatabaseHealthDrizzleRepository } from './infrastructure/repositories/database-health.drizzle.repository';

@Module({
  controllers: [HealthController],
  providers: [
    CheckHealthUseCase,
    {
      provide: DATABASE_HEALTH_CHECKER,
      useClass: DatabaseHealthDrizzleRepository,
    },
  ],
})
export class HealthModule {}

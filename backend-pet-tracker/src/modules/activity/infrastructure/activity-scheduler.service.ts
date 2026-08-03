import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SchedulerRegistry } from '@nestjs/schedule';
import {
  ACTIVITY_TICK_INTERVAL_MS,
  ACTIVITY_TICK_NAME,
} from '@/modules/activity/activity.constants';
import { AggregateDailyActivityUseCase } from '@/modules/activity/application/use-cases/aggregate-daily-activity.use-case';

/**
 * Cascara de scheduling del agregador (R15, calco de
 * IngestionSchedulerService de #8): registra el intervalo en
 * SchedulerRegistry SOLO con ACTIVITY_AGGREGATOR_ENABLED=true y NODE_ENV
 * distinto de 'test' — registro dinamico en codigo, nunca decorador
 * incondicional, para que los e2e que instancian AppModule completo jamas
 * arranquen el barrido.
 *
 * `addInterval` de 1 h y no `addCronJob`: con el tick horario de D2 no hace
 * falta una hora fija, asi que no se introduce el primer CronJob del repo ni
 * una expresion cron que revisar. El `ScheduleModule.forRoot()` ya esta en
 * app.module.ts desde #8 y no se repite.
 */
@Injectable()
export class ActivitySchedulerService implements OnApplicationBootstrap {
  private readonly logger = new Logger(ActivitySchedulerService.name);

  constructor(
    private readonly config: ConfigService,
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly aggregator: AggregateDailyActivityUseCase,
  ) {}

  onApplicationBootstrap(): void {
    if (!this.shouldSchedule()) {
      return;
    }

    this.schedulerRegistry.addInterval(
      ACTIVITY_TICK_NAME,
      setInterval(
        () => void this.aggregator.runOnce(new Date()),
        ACTIVITY_TICK_INTERVAL_MS,
      ),
    );

    this.logger.log(
      `activity aggregator scheduled (tick ${ACTIVITY_TICK_INTERVAL_MS} ms)`,
    );
  }

  /**
   * Gating de R15. Variable propia y no `POLLER_ENABLED`: acoplarlas ataria
   * el ciclo de vida de dos workers independientes (D7).
   */
  shouldSchedule(): boolean {
    return (
      this.config.get<string>('ACTIVITY_AGGREGATOR_ENABLED') === 'true' &&
      this.config.get<string>('NODE_ENV') !== 'test'
    );
  }
}

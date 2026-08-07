import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SchedulerRegistry } from '@nestjs/schedule';
import { NotifierConsumerService } from './notifier-consumer.service';
import {
  NOTIFIER_INTERVAL_MS,
  NOTIFIER_INTERVAL_NAME,
} from './notifier.constants';

/**
 * Cascara de scheduling del notifier (R15, D6): registra el intervalo en
 * SchedulerRegistry SOLO con `NOTIFIER_ENABLED='true'` y `NODE_ENV` distinto
 * de 'test' — registro dinamico (codigo), no decorador incondicional, mismo
 * patron exacto que AlertsEngineSchedulerService (#12) e
 * IngestionSchedulerService (#8).
 *
 * Variable propia y no `ALERTS_ENGINE_ENABLED`: el notifier se puede querer
 * apagado (para inspeccionar la cola a mano) con el motor encendido, y al
 * reves.
 */
@Injectable()
export class NotifierSchedulerService implements OnApplicationBootstrap {
  private readonly logger = new Logger(NotifierSchedulerService.name);

  constructor(
    private readonly config: ConfigService,
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly consumer: NotifierConsumerService,
  ) {}

  onApplicationBootstrap(): void {
    if (!this.shouldSchedule()) {
      return;
    }

    this.schedulerRegistry.addInterval(
      NOTIFIER_INTERVAL_NAME,
      setInterval(() => void this.consumer.drainOnce(), NOTIFIER_INTERVAL_MS),
    );

    this.logger.log(
      `notifier worker scheduled (consumer ${NOTIFIER_INTERVAL_MS} ms)`,
    );
  }

  /** Gating de R15: NOTIFIER_ENABLED === 'true' y NODE_ENV !== 'test'. */
  shouldSchedule(): boolean {
    return (
      this.config.get<string>('NOTIFIER_ENABLED') === 'true' &&
      this.config.get<string>('NODE_ENV') !== 'test'
    );
  }
}

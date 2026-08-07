import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SchedulerRegistry } from '@nestjs/schedule';
import { AlertsEngineConsumerService } from './alerts-engine-consumer.service';

// Cadencia como constante nombrada, no env (mismo criterio D11 de #8): los
// tests y el e2e invocan drainOnce() directamente y no necesitan acelerar
// el reloj.
export const ALERTS_ENGINE_INTERVAL_MS = 60_000;
export const ALERTS_ENGINE_INTERVAL_NAME = 'alerts-engine-consumer';

/**
 * Cascara de scheduling del worker (R17): registra el intervalo en
 * SchedulerRegistry SOLO con ALERTS_ENGINE_ENABLED='true' y NODE_ENV
 * distinto de 'test' — registro dinamico (codigo), no decorador
 * incondicional, mismo patron exacto que IngestionSchedulerService (#8).
 */
@Injectable()
export class AlertsEngineSchedulerService implements OnApplicationBootstrap {
  private readonly logger = new Logger(AlertsEngineSchedulerService.name);

  constructor(
    private readonly config: ConfigService,
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly consumer: AlertsEngineConsumerService,
  ) {}

  onApplicationBootstrap(): void {
    if (!this.shouldSchedule()) {
      return;
    }

    this.schedulerRegistry.addInterval(
      ALERTS_ENGINE_INTERVAL_NAME,
      setInterval(
        () => void this.consumer.drainOnce(),
        ALERTS_ENGINE_INTERVAL_MS,
      ),
    );

    this.logger.log(
      `alerts-engine worker scheduled (consumer ${ALERTS_ENGINE_INTERVAL_MS} ms)`,
    );
  }

  /** Gating de R17: ALERTS_ENGINE_ENABLED === 'true' y NODE_ENV !== 'test'. */
  shouldSchedule(): boolean {
    return (
      this.config.get<string>('ALERTS_ENGINE_ENABLED') === 'true' &&
      this.config.get<string>('NODE_ENV') !== 'test'
    );
  }
}

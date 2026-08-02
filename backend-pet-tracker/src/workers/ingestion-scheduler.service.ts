import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SchedulerRegistry } from '@nestjs/schedule';
import { PollerService } from './poller.service';
import { PositionsConsumerService } from './positions-consumer.service';

// Cadencias como constantes nombradas, no env (D11): los tests invocan
// runOnce()/drainOnce() directamente y no necesitan acelerar el reloj.
export const POLLER_INTERVAL_MS = 60_000;
export const CONSUMER_INTERVAL_MS = 15_000;

export const POLLER_INTERVAL_NAME = 'ingestion-poller';
export const CONSUMER_INTERVAL_NAME = 'ingestion-consumer';

/**
 * Cascara de scheduling de los workers (R8, D10): registra los intervalos en
 * SchedulerRegistry SOLO con POLLER_ENABLED=true y NODE_ENV distinto de
 * 'test' — registro dinamico (codigo), no decorador incondicional, para que
 * los e2e existentes que instancian AppModule completo jamas arranquen
 * cron ni consumidor.
 */
@Injectable()
export class IngestionSchedulerService implements OnApplicationBootstrap {
  private readonly logger = new Logger(IngestionSchedulerService.name);

  constructor(
    private readonly config: ConfigService,
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly poller: PollerService,
    private readonly consumer: PositionsConsumerService,
  ) {}

  onApplicationBootstrap(): void {
    if (!this.shouldSchedule()) {
      return;
    }

    this.schedulerRegistry.addInterval(
      POLLER_INTERVAL_NAME,
      setInterval(() => void this.poller.runOnce(), POLLER_INTERVAL_MS),
    );
    this.schedulerRegistry.addInterval(
      CONSUMER_INTERVAL_NAME,
      setInterval(() => void this.consumer.drainOnce(), CONSUMER_INTERVAL_MS),
    );

    this.logger.log(
      `ingestion workers scheduled (poller ${POLLER_INTERVAL_MS} ms, consumer ${CONSUMER_INTERVAL_MS} ms)`,
    );
  }

  /** Gating de R8: POLLER_ENABLED === 'true' y NODE_ENV !== 'test'. */
  shouldSchedule(): boolean {
    return (
      this.config.get<string>('POLLER_ENABLED') === 'true' &&
      this.config.get<string>('NODE_ENV') !== 'test'
    );
  }
}

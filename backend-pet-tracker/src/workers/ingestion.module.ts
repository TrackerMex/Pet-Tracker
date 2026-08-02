import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { WIALON_CLIENT } from '@/integrations/wialon/wialon-client.interface';
import { createWialonClient } from '@/integrations/wialon/wialon.factory';
import { IngestionSchedulerService } from './ingestion-scheduler.service';
import { PollerService } from './poller.service';
import { PositionsConsumerService } from './positions-consumer.service';

/**
 * Modulo de ingesta Wialon (D14): poller + consumidor como servicios
 * invocables y scheduling gated (R8). Exporta los workers para que el e2e
 * los invoque via runOnce()/drainOnce() sin esperas de reloj (R19).
 */
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: WIALON_CLIENT,
      useFactory: createWialonClient,
      inject: [ConfigService],
    },
    PollerService,
    PositionsConsumerService,
    IngestionSchedulerService,
  ],
  exports: [PollerService, PositionsConsumerService],
})
export class IngestionModule {}

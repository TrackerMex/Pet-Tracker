import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DYNAMODB_CLIENT } from '@/aws/aws.constants';
import { WIALON_CLIENT } from '@/integrations/wialon/wialon-client.interface';
import { createWialonClient } from '@/integrations/wialon/wialon.factory';
import { IngestionSchedulerService } from './ingestion-scheduler.service';
import { INGESTION_STORE } from './ingestion-store';
import { POSITIONS_DOC_CLIENT } from './ingestion.constants';
import { IngestionDrizzleStore } from './ingestion.drizzle.store';
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
    { provide: INGESTION_STORE, useClass: IngestionDrizzleStore },
    {
      // DocumentClient sobre el client low-level global de #2 (D13):
      // removeUndefinedValues evita ValidationException por opcionales.
      provide: POSITIONS_DOC_CLIENT,
      useFactory: (client: DynamoDBClient) =>
        DynamoDBDocumentClient.from(client, {
          marshallOptions: { removeUndefinedValues: true },
        }),
      inject: [DYNAMODB_CLIENT],
    },
    PollerService,
    PositionsConsumerService,
    IngestionSchedulerService,
  ],
  exports: [PollerService, PositionsConsumerService],
})
export class IngestionModule {}

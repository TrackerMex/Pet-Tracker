import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { Module } from '@nestjs/common';
import { DYNAMODB_CLIENT } from '@/aws/aws.constants';
import { PetsModule } from '@/modules/pets/pets.module';
import { GetLastPositionUseCase } from './application/use-cases/get-last-position.use-case';
import { ListPositionsUseCase } from './application/use-cases/list-positions.use-case';
import { LAST_POSITION_READER } from './domain/repositories/last-position.reader';
import { POSITION_HISTORY_READER } from './domain/repositories/position-history.reader';
import { PositionsController } from './infrastructure/positions.controller';
import { LastPositionDrizzleReader } from './infrastructure/repositories/last-position.drizzle.reader';
import { PositionHistoryDynamoReader } from './infrastructure/repositories/position-history.dynamo.reader';
import { POSITIONS_READ_DOC_CLIENT } from './positions.constants';

/**
 * Lectura de posiciones (positions-api R1-R15). Importa PetsModule por el
 * mecanismo de reutilizacion que #5 diseño: PetAccessGuard tal cual, sin
 * guard ni consulta de membresia propios. DRIZZLE y DYNAMODB_CLIENT los
 * resuelven DrizzleModule y AwsModule (@Global()).
 *
 * D6: DocumentClient propio en vez de importar IngestionModule — acoplar el
 * API de lectura a los workers arrastraria poller y consumidor a cualquier
 * proceso que solo quiera servir HTTP.
 */
@Module({
  imports: [PetsModule],
  controllers: [PositionsController],
  providers: [
    GetLastPositionUseCase,
    ListPositionsUseCase,
    { provide: LAST_POSITION_READER, useClass: LastPositionDrizzleReader },
    {
      provide: POSITION_HISTORY_READER,
      useClass: PositionHistoryDynamoReader,
    },
    {
      provide: POSITIONS_READ_DOC_CLIENT,
      useFactory: (client: DynamoDBClient) =>
        DynamoDBDocumentClient.from(client),
      inject: [DYNAMODB_CLIENT],
    },
  ],
})
export class PositionsModule {}

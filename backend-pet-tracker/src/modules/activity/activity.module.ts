import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { Module } from '@nestjs/common';
import { DYNAMODB_CLIENT } from '@/aws/aws.constants';
import { PetsModule } from '@/modules/pets/pets.module';
import { ACTIVITY_DAILY_DOC_CLIENT } from './activity.constants';
import { AggregateDailyActivityUseCase } from './application/use-cases/aggregate-daily-activity.use-case';
import { GetDailyActivityUseCase } from './application/use-cases/get-daily-activity.use-case';
import { ListTripsUseCase } from './application/use-cases/list-trips.use-case';
import { ACTIVITY_STORE } from './domain/repositories/activity-store';
import { DAILY_POSITIONS_READER } from './domain/repositories/daily-positions.reader';
import { ActivityController } from './infrastructure/activity.controller';
import { ActivitySchedulerService } from './infrastructure/activity-scheduler.service';
import { ActivityDrizzleStore } from './infrastructure/repositories/activity.drizzle.store';
import { DailyPositionsDynamoReader } from './infrastructure/repositories/daily-positions.dynamo.reader';
import { TripsController } from './infrastructure/trips.controller';

/**
 * Recorridos y actividad (trips-activity R11-R21). Importa PetsModule por el
 * mecanismo que #5 diseño: PetAccessGuard tal cual, sin guard ni consulta de
 * membresia propios. DRIZZLE y DYNAMODB_CLIENT los resuelven DrizzleModule y
 * AwsModule (@Global()).
 *
 * D1: DocumentClient propio en vez de importar PositionsModule — el
 * agregador es un @Injectable con tick horario y no debe depender de un
 * modulo HTTP ajeno; y PositionsModule (#9) queda intacto, sin `exports`
 * nuevos. El scheduler es un driving adapter mas, igual que un controller:
 * ambos invocan casos de uso de la capa application.
 */
@Module({
  imports: [PetsModule],
  controllers: [TripsController, ActivityController],
  providers: [
    ListTripsUseCase,
    GetDailyActivityUseCase,
    AggregateDailyActivityUseCase,
    ActivitySchedulerService,
    { provide: ACTIVITY_STORE, useClass: ActivityDrizzleStore },
    { provide: DAILY_POSITIONS_READER, useClass: DailyPositionsDynamoReader },
    {
      provide: ACTIVITY_DAILY_DOC_CLIENT,
      useFactory: (client: DynamoDBClient) =>
        DynamoDBDocumentClient.from(client),
      inject: [DYNAMODB_CLIENT],
    },
  ],
  exports: [AggregateDailyActivityUseCase],
})
export class ActivityModule {}

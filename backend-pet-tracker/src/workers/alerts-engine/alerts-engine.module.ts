import { Module } from '@nestjs/common';
import { PetsModule } from '@/modules/pets/pets.module';
import { AlertsEngineConsumerService } from './alerts-engine-consumer.service';
import { AlertsEngineSchedulerService } from './alerts-engine-scheduler.service';
import { ALERTS_ENGINE_STORE } from './alerts-engine-store';
import { AlertsEngineDrizzleStore } from './alerts-engine.drizzle.store';

/**
 * Worker de alerts-engine (R3-R18): consumidor de `geofence-events` +
 * cascara de scheduling gateada (R17). Importa PetsModule solo por
 * PET_REPOSITORY (R15, lectura pura del nombre de la mascota, sin metodos
 * nuevos) — mismo mecanismo que ActivityModule (#10). DRIZZLE y SQS_CLIENT
 * los resuelven DrizzleModule y AwsModule (@Global()).
 */
@Module({
  imports: [PetsModule],
  providers: [
    { provide: ALERTS_ENGINE_STORE, useClass: AlertsEngineDrizzleStore },
    AlertsEngineConsumerService,
    AlertsEngineSchedulerService,
  ],
  exports: [AlertsEngineConsumerService],
})
export class AlertsEngineModule {}

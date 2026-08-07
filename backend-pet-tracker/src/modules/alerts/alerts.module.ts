import { Module } from '@nestjs/common';
import { AckAlertUseCase } from './application/use-cases/ack-alert.use-case';
import { ListAlertsUseCase } from './application/use-cases/list-alerts.use-case';
import { ALERT_REPOSITORY } from './domain/repositories/alert.repository';
import { AlertsController } from './infrastructure/alerts.controller';
import { AlertDrizzleRepository } from './infrastructure/repositories/alert.drizzle.repository';

/**
 * Centro de alertas: GET /v1/alerts y POST /v1/alerts/:id/ack (R16-R22). No
 * importa PetsModule — no usa PetAccessGuard (ver alerts.controller.ts) y la
 * membresia se resuelve dentro de la consulta del repositorio. AUDIT_LOGGER y
 * DRIZZLE los resuelven los modulos @Global().
 */
@Module({
  controllers: [AlertsController],
  providers: [
    ListAlertsUseCase,
    AckAlertUseCase,
    { provide: ALERT_REPOSITORY, useClass: AlertDrizzleRepository },
  ],
})
export class AlertsModule {}

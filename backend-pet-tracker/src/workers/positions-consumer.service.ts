import { Injectable } from '@nestjs/common';

/**
 * Consumidor de positions-raw (R12-R18): toda la logica vive en drainOnce()
 * para que los tests y el e2e lo invoquen sin esperas de reloj (D10); el
 * scheduling es una cascara aparte (IngestionSchedulerService, R8).
 */
@Injectable()
export class PositionsConsumerService {
  drainOnce(): Promise<void> {
    // R12 implementa el drenado real.
    return Promise.resolve();
  }
}

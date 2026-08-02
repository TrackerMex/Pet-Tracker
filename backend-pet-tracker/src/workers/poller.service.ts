import { Injectable } from '@nestjs/common';

/**
 * Poller de ingesta (R9-R11): toda la logica vive en runOnce() para que los
 * tests y el e2e lo invoquen sin esperas de reloj (D10); el scheduling es
 * una cascara aparte (IngestionSchedulerService, R8).
 */
@Injectable()
export class PollerService {
  runOnce(): Promise<void> {
    // R9 implementa el ciclo real.
    return Promise.resolve();
  }
}

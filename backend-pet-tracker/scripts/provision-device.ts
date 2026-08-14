import { WialonHttpClient } from '@/integrations/wialon/wialon-http.client';
import type { WialonClient } from '@/integrations/wialon/wialon-client.interface';

export class SimulatedWialonClientError extends Error {
  constructor() {
    super(
      'provision-device exige la API real de Wialon: pon SIM_MODE=false y un WIALON_TOKEN real en .env',
    );
    this.name = 'SimulatedWialonClientError';
  }
}

export function assertRealWialonClient(client: WialonClient): void {
  if (!(client instanceof WialonHttpClient)) {
    throw new SimulatedWialonClientError();
  }
}

import type { RawPosition } from '@/pipeline/types';
import type { WialonClient, WialonUnit } from './wialon-client.interface';

/**
 * Cliente contra la API real de Wialon (R4). Se construye desde el factory
 * solo con SIM_MODE=false y token real (R1); ningun flujo de esta feature
 * toca la red en tests — el fetch es inyectable para mockearlo.
 */
export class WialonHttpClient implements WialonClient {
  constructor(
    private readonly baseUrl: string,
    private readonly token: string,
    private readonly fetchFn: typeof fetch = fetch,
  ) {}

  listUnits(): Promise<WialonUnit[]> {
    return Promise.reject(new Error('not implemented yet (R4)'));
  }

  getMessages(
    _unitId: string,
    _fromTs: number,
    _toTs: number,
  ): Promise<RawPosition[]> {
    return Promise.reject(new Error('not implemented yet (R4)'));
  }
}

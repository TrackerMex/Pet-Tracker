import type { RawPosition } from '@/pipeline/types';
import type { WialonClient, WialonUnit } from './wialon-client.interface';

/** Config del simulador — la resuelve el factory desde ConfigService (R1). */
export interface FakeWialonClientOptions {
  seed: number;
  homeLat: number;
  homeLng: number;
}

/**
 * Simulador determinista de Wialon (R2, R3): cada posicion es funcion pura
 * de (seed, unitId, slot de 30 s) — sin estado mutable entre llamadas.
 */
export class FakeWialonClient implements WialonClient {
  constructor(private readonly options: FakeWialonClientOptions) {}

  listUnits(): Promise<WialonUnit[]> {
    return Promise.reject(new Error('not implemented yet (R2)'));
  }

  getMessages(
    _unitId: string,
    _fromTs: number,
    _toTs: number,
  ): Promise<RawPosition[]> {
    return Promise.reject(new Error('not implemented yet (R2)'));
  }
}

import type { RawPosition } from '@/pipeline/types';

// Token junto a la interface — regla de docs/conventions.md §Tokens de
// inyeccion. El provider useFactory vive en IngestionModule (R1).
export const WIALON_CLIENT = Symbol('WialonClient');

/** Unidad (collar) visible en Wialon; `unitId` es el id externo como string. */
export interface WialonUnit {
  unitId: string;
  name: string;
}

/**
 * Puerto hacia Wialon (plan 005 §Paso 1). Dos implementaciones: el simulador
 * determinista FakeWialonClient (default dev, R2-R3) y WialonHttpClient
 * contra la API real (R4). `fromTs`/`toTs` en epoch ms.
 */
export interface WialonClient {
  listUnits(): Promise<WialonUnit[]>;
  getMessages(
    unitId: string,
    fromTs: number,
    toTs: number,
  ): Promise<RawPosition[]>;
}

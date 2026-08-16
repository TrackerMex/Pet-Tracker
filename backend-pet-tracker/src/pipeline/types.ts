// Tipos de telemetria del nucleo puro (design.md: viven con el pipeline
// porque normalize() es su primer consumidor; integrations/ y workers/ los
// importan en direccion infra -> nucleo). Cero imports de framework/SDK/ORM.

/** Posicion cruda tal como la entrega un WialonClient (R4). `ts` epoch ms. */
export interface RawPosition {
  lat: number;
  lng: number;
  ts: number;
  speedKmh?: number;
  course?: number;
  altitude?: number;
  sats?: number;
  accuracyM?: number;
  batteryPct?: number;
}

/** Posicion aceptada por normalize(): cruda + flags de calidad (R5, R6). */
export interface ProcessedPosition extends RawPosition {
  flags: string[];
}

/** Razones de descarte de normalize() (R5). */
export type DiscardReason =
  'invalid_coordinates' | 'missing_ts' | 'duplicate_ts' | 'future_ts';

/** Registro de un descarte: la razon y la posicion cruda descartada (R5). */
export interface DiscardedStat {
  reason: DiscardReason;
  position: Partial<RawPosition>;
}

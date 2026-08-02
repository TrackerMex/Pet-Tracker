// Tipos puros del dominio de lectura de posiciones: sin imports de
// framework, SDK ni ORM. Ambos espejan contratos congelados por
// wialon-ingestion-pipeline (#8), el unico escritor de estos datos.

/**
 * Cache desnormalizada `pets.last_position` tal como la escribe #8
 * (`{lat, lng, ts, accuracy, battery}`). `ts` es el `device_ts` en epoch ms.
 */
export interface CachedPosition {
  lat: number;
  lng: number;
  ts: number;
  accuracy: number | null;
  battery: number | null;
}

/**
 * Punto del historico ya proyectado al contrato publico (R11): camelCase y
 * sin los atributos internos del pipeline (`received_ts`, `processed_ts`,
 * `expires_at`). `ts` es el `sk`/`device_ts` en epoch ms.
 */
export interface StoredPosition {
  ts: number;
  lat: number;
  lng: number;
  speedKmh: number | null;
  course: number | null;
  altitude: number | null;
  sats: number | null;
  accuracyM: number | null;
  batteryPct: number | null;
  flags: string[];
}

// Tipos puros del dominio de actividad: sin imports de framework, ORM ni SDK.

/** Fila de `activity_daily` tal como la devuelve el store (R20). */
export interface DailyActivityRow {
  petId: string;
  /** Dia de calendario 'YYYY-MM-DD' en la timezone del owner. */
  date: string;
  distanceM: number;
  activeMinutes: number;
  restMinutes: number;
  walkCount: number;
  avgWalkMinutes: number;
  firstWalkAt: Date | null;
  lastWalkAt: Date | null;
  /** La rellena #13 desde `alert_events`; esta feature nunca la escribe. */
  timeAwayMinutes: number | null;
  computedAt: Date;
}

/**
 * Payload del upsert (R11). No lleva `timeAwayMinutes` — la columna se
 * preserva a proposito — ni `computedAt`, que fija el store.
 */
export interface DailyActivityUpsert {
  petId: string;
  date: string;
  distanceM: number;
  activeMinutes: number;
  restMinutes: number;
  walkCount: number;
  avgWalkMinutes: number;
  firstWalkAt: Date | null;
  lastWalkAt: Date | null;
}

/** Procedencia de cada dia de la respuesta de /activity/daily (R20). */
export type DayEntrySource = 'stored' | 'computed' | 'missing';

/** Entrada de `days`: exactamente estas diez claves (R20). */
export interface DayEntry {
  date: string;
  distanceM: number | null;
  activeMinutes: number | null;
  restMinutes: number | null;
  walkCount: number | null;
  avgWalkMinutes: number | null;
  /** ISO-8601: viene de una columna timestamptz o de un epoch ms derivado. */
  firstWalkAt: string | null;
  lastWalkAt: string | null;
  timeAwayMinutes: number | null;
  source: DayEntrySource;
}

/** Item de la lista de /trips: seis claves, sin `path` (R18). */
export interface TripSummary {
  index: number;
  startTs: number;
  endTs: number;
  distanceM: number;
  durationMin: number;
  pointCount: number;
}

/** Item de /trips/:n: las seis de R18 mas el trazado (R19). */
export interface TripDetail extends TripSummary {
  path: Array<{ lat: number; lng: number; ts: number }>;
}

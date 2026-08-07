import type { GeofenceState } from '@/pipeline/geofence-eval';

// Puerto propio del worker (D2, mismo criterio D14 de wialon-ingestion-
// pipeline): GeofenceRepository (#11) se deja intacto — su design.md ya
// descarto explicitamente un metodo updateState para este consumidor, y de
// hecho no expone forma alguna de tocar geofence_state. Token junto a la
// interface (docs/conventions.md §Tokens de inyeccion).
export const ALERTS_ENGINE_STORE = Symbol('AlertsEngineStore');

export type AlertEventType = 'geofence_exit' | 'battery_low';

/** Geocerca activa lista para evaluate() (R7) — aplana el jsonb `geometry`. */
export interface ActiveGeofenceForEval {
  id: string;
  name: string;
  centerLat: number;
  centerLng: number;
  radiusM: number;
  state: GeofenceState;
}

export interface OpenAlertInput {
  petId: string;
  type: AlertEventType;
  geofenceId: string | null;
  payload: Record<string, unknown>;
  openedAt: Date;
}

export interface CloseOpenAlertInput {
  petId: string;
  type: AlertEventType;
  geofenceId: string | null;
  closedAt: Date;
}

export interface AlertsEngineStore {
  /** Geocercas `active = true` de la mascota, con su geofence_state (R7). */
  listActiveGeofencesForPet(petId: string): Promise<ActiveGeofenceForEval[]>;

  /** Persiste el nuevo geofence_state devuelto por evaluate() (R8-R10). */
  updateGeofenceState(geofenceId: string, state: GeofenceState): Promise<void>;

  /** INSERT; null si el indice unico de R2 rechazo (anti-spam, R8/R12). */
  openAlert(input: OpenAlertInput): Promise<{ id: string } | null>;

  /**
   * UPDATE condicional sobre la alerta ACTIVA; null si cero filas (R9/R11).
   * "Activa" = `status IN ('open','acked')` desde #13 (R23/D1): un `ack` del
   * usuario es una anotacion, no una resolucion, y el regreso de la mascota
   * debe cerrar la alerta igualmente. Firma y contrato de retorno intactos.
   */
  closeOpenAlert(input: CloseOpenAlertInput): Promise<{ id: string } | null>;
}

// Tipos puros del dominio del centro de alertas: sin imports de framework,
// ORM ni SDK.

/** Los tres estados del CHECK de `alert_events` (migracion 0007, R21). */
export type AlertStatus = 'open' | 'acked' | 'closed';

/**
 * Alerta tal como la ve el centro de alertas (R16). Incluye `petName` porque
 * la lista cruza mascotas y sin el el cliente necesitaria N peticiones.
 */
export interface AlertEvent {
  id: string;
  petId: string;
  petName: string;
  type: string;
  status: AlertStatus;
  geofenceId: string | null;
  payload: Record<string, unknown>;
  openedAt: Date;
  ackedAt: Date | null;
  closedAt: Date | null;
}

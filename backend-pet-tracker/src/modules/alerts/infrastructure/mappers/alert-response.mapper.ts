import type { AlertEvent } from '@/modules/alerts/domain/entities/alert-event.entity';

/** Elemento de `GET /v1/alerts` y body del ack (R16, R20): exactamente estas
 * diez claves. */
export interface AlertResponse {
  id: string;
  petId: string;
  petName: string;
  type: string;
  status: string;
  geofenceId: string | null;
  payload: Record<string, unknown>;
  openedAt: string;
  ackedAt: string | null;
  closedAt: string | null;
}

export interface ListAlertsResponse {
  items: AlertResponse[];
  nextCursor: string | null;
}

/** Lista explicita de campos permitidos; los instantes salen en ISO-8601. */
export function toAlertResponse(alert: AlertEvent): AlertResponse {
  return {
    id: alert.id,
    petId: alert.petId,
    petName: alert.petName,
    type: alert.type,
    status: alert.status,
    geofenceId: alert.geofenceId,
    payload: alert.payload,
    openedAt: alert.openedAt.toISOString(),
    ackedAt: alert.ackedAt === null ? null : alert.ackedAt.toISOString(),
    closedAt: alert.closedAt === null ? null : alert.closedAt.toISOString(),
  };
}

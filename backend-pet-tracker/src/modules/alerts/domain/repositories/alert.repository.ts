import type { AlertEvent, AlertStatus } from '../entities/alert-event.entity';

export const ALERT_REPOSITORY = Symbol('AlertRepository');

/**
 * Entrada del listado (R16-R19). `userId` es el unico origen del conjunto de
 * mascotas: no hay ningun campo que lo amplie, por diseño.
 */
export interface ListAlertsForMemberInput {
  userId: string;
  status: AlertStatus | undefined;
  /** Keyset (R18): reanuda estrictamente despues de `(opened_at, id)`. */
  after: { openedAtMs: number; id: string } | null;
  limit: number;
}

/**
 * Puerto de lectura/ack del centro de alertas. **No** se reutiliza
 * `AlertsEngineStore` (#12): es un puerto de escritura interno del worker
 * (`openAlert`/`closeOpenAlert`/`updateGeofenceState`), sin ninguna operacion
 * de lectura ni de `ack`, y su contrato lo cerro una spec aprobada.
 */
export interface AlertRepository {
  /**
   * Alertas de todas las mascotas donde el usuario tiene membresia
   * `status='active'` (R16/R19), ordenadas `opened_at DESC, id DESC`. La
   * autorizacion **es** la consulta: no hay camino donde una alerta ajena
   * pueda colarse.
   */
  listForMember(input: ListAlertsForMemberInput): Promise<AlertEvent[]>;

  /** Alerta por id SOLO si el usuario es miembro activo de su mascota (R21). */
  findForMember(alertId: string, userId: string): Promise<AlertEvent | null>;

  /**
   * `UPDATE ... SET status='acked', acked_at=$2 WHERE id=$1 AND status='open'`
   * (R20). Devuelve el `acked_at` escrito, o `null` si no afecto ninguna fila
   * — el motor de #12 pudo cerrarla entre el SELECT y el UPDATE.
   */
  ack(alertId: string, ackedAt: Date): Promise<Date | null>;
}

import { Inject, Injectable } from '@nestjs/common';
import { AUDIT_LOGGER } from '@/audit/audit-log.repository';
import type { AuditLogger } from '@/audit/audit-log.repository';
import type { AlertEvent } from '@/modules/alerts/domain/entities/alert-event.entity';
import {
  AlertAlreadyClosedError,
  AlertNotFoundError,
} from '@/modules/alerts/domain/errors/alert.errors';
import { ALERT_REPOSITORY } from '@/modules/alerts/domain/repositories/alert.repository';
import type { AlertRepository } from '@/modules/alerts/domain/repositories/alert.repository';

/** UUID sintacticamente valido, cualquier version — mismo patron que PetAccessGuard. */
const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * POST /v1/alerts/:id/ack (R20-R22). PetAccessGuard no aplica —lee
 * `request.params.petId`, que en esta ruta no existe—, asi que la
 * autorizacion se resuelve aqui: `findForMember` ya acota por membresia
 * activa, y sus tres fallos (id malformado, alerta inexistente, sin
 * membresia) salen por el mismo 404 generico.
 *
 * Maquina de estados de R21, y ninguna otra transicion:
 *   open   + ack -> acked (acked_at fijado, closed_at sigue NULL), 200
 *   acked  + ack -> acked (idempotente: conserva acked_at, sin auditar), 200
 *   closed + ack -> 409
 */
@Injectable()
export class AckAlertUseCase {
  constructor(
    @Inject(ALERT_REPOSITORY) private readonly alerts: AlertRepository,
    @Inject(AUDIT_LOGGER) private readonly auditLogger: AuditLogger,
  ) {}

  async execute(
    alertId: string,
    userId: string,
    // El reloj entra por parametro para que el test fije `acked_at`.
    now: Date = new Date(),
  ): Promise<AlertEvent> {
    if (!UUID_PATTERN.test(alertId)) {
      // Un :id malformado ni siquiera toca la base (R21).
      throw new AlertNotFoundError();
    }

    const alert = await this.alerts.findForMember(alertId, userId);

    if (alert === null) {
      throw new AlertNotFoundError();
    }

    if (alert.status === 'closed') {
      throw new AlertAlreadyClosedError();
    }

    if (alert.status === 'acked') {
      // R21/R22: no-op idempotente — ni se reescribe `acked_at` ni se audita
      // una segunda vez.
      return alert;
    }

    const ackedAt = await this.alerts.ack(alertId, now);

    if (ackedAt === null) {
      // Carrera con el motor de #12: cerro la alerta entre el SELECT y el
      // UPDATE. El resultado observable es el mismo que si hubiera llegado
      // cerrada.
      throw new AlertAlreadyClosedError();
    }

    await this.auditLogger.record({
      userId,
      action: 'alert.ack',
      entity: 'alert_events',
      entityId: alertId,
      meta: { petId: alert.petId, type: alert.type },
    });

    return { ...alert, status: 'acked', ackedAt };
  }
}

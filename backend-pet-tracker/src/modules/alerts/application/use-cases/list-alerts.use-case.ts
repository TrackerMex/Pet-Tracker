import { Inject, Injectable } from '@nestjs/common';
import { ALERTS_PAGE_SIZE } from '@/modules/alerts/alerts.constants';
import {
  decodeAlertCursor,
  encodeAlertCursor,
} from '@/modules/alerts/domain/cursor';
import type {
  AlertEvent,
  AlertStatus,
} from '@/modules/alerts/domain/entities/alert-event.entity';
import { InvalidAlertCursorError } from '@/modules/alerts/domain/errors/alert.errors';
import { ALERT_REPOSITORY } from '@/modules/alerts/domain/repositories/alert.repository';
import type { AlertRepository } from '@/modules/alerts/domain/repositories/alert.repository';

export interface ListAlertsInput {
  /** Usuario del JWT (R19): nunca un parametro de la peticion. */
  userId: string;
  status?: AlertStatus;
  cursor?: string;
}

export interface ListAlertsResult {
  items: AlertEvent[];
  nextCursor: string | null;
}

/**
 * GET /v1/alerts (R16-R19). Pagina por keyset sobre `(opened_at, id)` y no
 * por OFFSET: con alertas llegando en tiempo real, una fila nueva desplazaria
 * el offset y el cliente veria duplicados o se saltaria alertas.
 */
@Injectable()
export class ListAlertsUseCase {
  constructor(
    @Inject(ALERT_REPOSITORY) private readonly alerts: AlertRepository,
  ) {}

  async execute(input: ListAlertsInput): Promise<ListAlertsResult> {
    const status = input.status;

    // R18: el cursor se valida ANTES de cualquier consulta.
    const after =
      input.cursor === undefined
        ? null
        : this.resolveAfter(input.cursor, status);

    // Una fila de sonda de mas: si vuelve, hay pagina siguiente.
    const rows = await this.alerts.listForMember({
      userId: input.userId,
      status,
      after,
      limit: ALERTS_PAGE_SIZE + 1,
    });

    const hasMore = rows.length > ALERTS_PAGE_SIZE;
    const items = hasMore ? rows.slice(0, ALERTS_PAGE_SIZE) : rows;
    const last = items[items.length - 1];

    return {
      items,
      nextCursor:
        hasMore && last !== undefined
          ? encodeAlertCursor({
              openedAtMs: last.openedAt.getTime(),
              id: last.id,
              status: status ?? null,
            })
          : null,
    };
  }

  private resolveAfter(
    cursor: string,
    status: AlertStatus | undefined,
  ): { openedAtMs: number; id: string } {
    const decoded = decodeAlertCursor(cursor);

    // Un cursor emitido con otro filtro describe otra lista: reanudar con el
    // saltaria o repetiria elementos (mismo criterio que la huella de #9).
    if (decoded.status !== (status ?? null)) {
      throw new InvalidAlertCursorError();
    }

    return { openedAtMs: decoded.openedAtMs, id: decoded.id };
  }
}

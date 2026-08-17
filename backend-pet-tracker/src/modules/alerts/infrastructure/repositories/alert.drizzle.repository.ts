import { Inject, Injectable } from '@nestjs/common';
import { and, desc, eq, isNull, sql } from 'drizzle-orm';
import type { SQL } from 'drizzle-orm';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DRIZZLE } from '@/db/drizzle.constants';
import { alertEvents } from '@/db/schema/alerts.schema';
import { petDevices } from '@/db/schema/devices.schema';
import { petUsers, pets } from '@/db/schema/pets.schema';
import { deviceSubscriptions } from '@/db/schema/subscriptions.schema';
import type {
  AlertEvent,
  AlertStatus,
} from '@/modules/alerts/domain/entities/alert-event.entity';
import type {
  AlertRepository,
  ListAlertsForMemberInput,
} from '@/modules/alerts/domain/repositories/alert.repository';
import { entitledDeviceSubscription } from '@/modules/subscriptions/infrastructure/entitlement.predicate';

const ACTIVE_STATUS = 'active';
const OPEN_STATUS = 'open';

const SELECTION = {
  id: alertEvents.id,
  petId: alertEvents.petId,
  petName: pets.name,
  type: alertEvents.type,
  status: alertEvents.status,
  geofenceId: alertEvents.geofenceId,
  payload: alertEvents.payload,
  openedAt: alertEvents.openedAt,
  ackedAt: alertEvents.ackedAt,
  closedAt: alertEvents.closedAt,
};

/**
 * Implementacion Drizzle del centro de alertas (R16-R21). Cobertura contra
 * Postgres real en test/alerts-center-notifier.e2e-spec.ts.
 *
 * La autorizacion **es** el `INNER JOIN pet_users` de ambas consultas: no hay
 * un camino de codigo por el que una alerta de una mascota ajena pueda
 * colarse, y un usuario sin membresias obtiene la lista vacia, no un error.
 */
@Injectable()
export class AlertDrizzleRepository implements AlertRepository {
  constructor(@Inject(DRIZZLE) private readonly db: NodePgDatabase) {}

  async listForMember(input: ListAlertsForMemberInput): Promise<AlertEvent[]> {
    const conditions: SQL[] = [];

    if (input.status !== undefined) {
      conditions.push(eq(alertEvents.status, input.status));
    }

    if (input.after !== null) {
      // Keyset sobre la tupla, en el mismo orden que el ORDER BY: reanuda
      // estrictamente despues del ultimo elemento devuelto (R18).
      conditions.push(
        sql`(${alertEvents.openedAt}, ${alertEvents.id}) < (${new Date(
          input.after.openedAtMs,
        )}::timestamptz, ${input.after.id}::uuid)`,
      );
    }

    const rows = await this.db
      .select(SELECTION)
      .from(alertEvents)
      .innerJoin(
        petUsers,
        and(
          eq(petUsers.petId, alertEvents.petId),
          eq(petUsers.userId, input.userId),
          eq(petUsers.status, ACTIVE_STATUS),
        ),
      )
      .innerJoin(
        petDevices,
        and(
          eq(petDevices.petId, alertEvents.petId),
          isNull(petDevices.releasedAt),
        ),
      )
      .innerJoin(
        deviceSubscriptions,
        and(
          eq(deviceSubscriptions.deviceId, petDevices.deviceId),
          entitledDeviceSubscription(),
        ),
      )
      .innerJoin(pets, eq(pets.id, alertEvents.petId))
      .where(conditions.length === 0 ? undefined : and(...conditions))
      // R16: desempate estable por id, imprescindible para el cursor de R18.
      .orderBy(desc(alertEvents.openedAt), desc(alertEvents.id))
      .limit(input.limit);

    return rows.map(toAlertEvent);
  }

  async findForMember(
    alertId: string,
    userId: string,
  ): Promise<AlertEvent | null> {
    const rows = await this.db
      .select(SELECTION)
      .from(alertEvents)
      .innerJoin(
        petUsers,
        and(
          eq(petUsers.petId, alertEvents.petId),
          eq(petUsers.userId, userId),
          eq(petUsers.status, ACTIVE_STATUS),
        ),
      )
      .innerJoin(
        petDevices,
        and(
          eq(petDevices.petId, alertEvents.petId),
          isNull(petDevices.releasedAt),
        ),
      )
      .innerJoin(
        deviceSubscriptions,
        and(
          eq(deviceSubscriptions.deviceId, petDevices.deviceId),
          entitledDeviceSubscription(),
        ),
      )
      .innerJoin(pets, eq(pets.id, alertEvents.petId))
      .where(eq(alertEvents.id, alertId))
      .limit(1);

    return rows[0] === undefined ? null : toAlertEvent(rows[0]);
  }

  /** R20: UPDATE condicional — `closed_at` no se toca, sigue NULL. */
  async ack(alertId: string, ackedAt: Date): Promise<Date | null> {
    const rows = await this.db
      .update(alertEvents)
      .set({ status: 'acked', ackedAt })
      .where(
        and(eq(alertEvents.id, alertId), eq(alertEvents.status, OPEN_STATUS)),
      )
      .returning({ ackedAt: alertEvents.ackedAt });

    return rows[0]?.ackedAt ?? null;
  }
}

function toAlertEvent(row: {
  id: string;
  petId: string;
  petName: string;
  type: string;
  status: string;
  geofenceId: string | null;
  payload: Record<string, unknown>;
  openedAt: Date;
  ackedAt: Date | null;
  closedAt: Date | null;
}): AlertEvent {
  return { ...row, status: row.status as AlertStatus };
}

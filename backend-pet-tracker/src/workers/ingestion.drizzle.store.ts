import { Inject, Injectable } from '@nestjs/common';
import { and, eq, isNotNull, isNull, lt, or } from 'drizzle-orm';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DRIZZLE } from '@/db/drizzle.constants';
import { devices, petDevices } from '@/db/schema/devices.schema';
import { pets } from '@/db/schema/pets.schema';
import { deviceSubscriptions } from '@/db/schema/subscriptions.schema';
import { entitledDeviceSubscription } from '@/modules/subscriptions/infrastructure/entitlement.predicate';
import type {
  ActiveAssignment,
  DeviceTelemetryUpdate,
  IngestionStore,
  PetLastPosition,
} from './ingestion-store';

/**
 * Implementacion Drizzle del puerto del worker (D14). Los updates de cache
 * llevan el guard "solo si el ts entrante es mas reciente" en el WHERE
 * (R14) — un mensaje viejo (redelivery/fuera de orden) no retrocede nada.
 * Cobertura contra Postgres real en test/ingestion.e2e-spec.ts (R19).
 */
@Injectable()
export class IngestionDrizzleStore implements IngestionStore {
  constructor(@Inject(DRIZZLE) private readonly db: NodePgDatabase) {}

  async listActiveAssignments(): Promise<ActiveAssignment[]> {
    const rows = await this.db
      .select({
        deviceId: petDevices.deviceId,
        petId: petDevices.petId,
        unitId: devices.wialonUnitId,
        ingestWatermark: devices.ingestWatermark,
      })
      .from(petDevices)
      .innerJoin(devices, eq(petDevices.deviceId, devices.id))
      .innerJoin(
        deviceSubscriptions,
        and(
          eq(deviceSubscriptions.deviceId, devices.id),
          entitledDeviceSubscription(),
        ),
      )
      .where(
        and(isNull(petDevices.releasedAt), isNotNull(devices.wialonUnitId)),
      );

    return rows.map((row) => ({
      deviceId: row.deviceId,
      petId: row.petId,
      // isNotNull en el WHERE garantiza el valor; Drizzle no lo estrecha.
      unitId: row.unitId as string,
      ingestWatermark: row.ingestWatermark,
    }));
  }

  async advanceWatermark(deviceId: string, ts: Date): Promise<void> {
    await this.db
      .update(devices)
      .set({ ingestWatermark: ts, updatedAt: new Date() })
      .where(eq(devices.id, deviceId));
  }

  async isAssignmentActive(deviceId: string, petId: string): Promise<boolean> {
    const rows = await this.db
      .select({ id: petDevices.id })
      .from(petDevices)
      .where(
        and(
          eq(petDevices.deviceId, deviceId),
          eq(petDevices.petId, petId),
          isNull(petDevices.releasedAt),
        ),
      )
      .limit(1);

    return rows.length > 0;
  }

  async getDeviceBattery(deviceId: string): Promise<number | null> {
    const rows = await this.db
      .select({ batteryPct: devices.batteryPct })
      .from(devices)
      .where(eq(devices.id, deviceId))
      .limit(1);

    return rows[0]?.batteryPct ?? null;
  }

  async updateDeviceTelemetry(
    deviceId: string,
    update: DeviceTelemetryUpdate,
  ): Promise<void> {
    await this.db
      .update(devices)
      .set({
        batteryPct: update.batteryPct,
        connectivity: 'online',
        lastMessageAt: update.lastMessageAt,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(devices.id, deviceId),
          or(
            isNull(devices.lastMessageAt),
            lt(devices.lastMessageAt, update.lastMessageAt),
          ),
        ),
      );
  }

  async updatePetLastPosition(
    petId: string,
    position: PetLastPosition,
    lastCommunicationAt: Date,
  ): Promise<void> {
    await this.db
      .update(pets)
      .set({
        lastPosition: position,
        lastCommunicationAt,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(pets.id, petId),
          or(
            isNull(pets.lastCommunicationAt),
            lt(pets.lastCommunicationAt, lastCommunicationAt),
          ),
        ),
      );
  }
}

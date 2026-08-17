import { Inject, Injectable } from '@nestjs/common';
import { and, eq, isNull } from 'drizzle-orm';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DRIZZLE } from '@/db/drizzle.constants';
import { petDevices } from '@/db/schema/devices.schema';
import { deviceSubscriptions } from '@/db/schema/subscriptions.schema';
import type { SubscriptionRepository } from '@/modules/subscriptions/domain/repositories/subscription.repository';
import { entitledDeviceSubscription } from '@/modules/subscriptions/infrastructure/entitlement.predicate';

@Injectable()
export class SubscriptionDrizzleRepository implements SubscriptionRepository {
  constructor(@Inject(DRIZZLE) private readonly db: NodePgDatabase) {}

  async isPetTracked(petId: string): Promise<boolean> {
    const rows = await this.db
      .select({ deviceId: petDevices.deviceId })
      .from(petDevices)
      .innerJoin(
        deviceSubscriptions,
        and(
          eq(deviceSubscriptions.deviceId, petDevices.deviceId),
          entitledDeviceSubscription(),
        ),
      )
      .where(and(eq(petDevices.petId, petId), isNull(petDevices.releasedAt)))
      .limit(1);

    return rows.length > 0;
  }

  async isDeviceEntitled(deviceId: string): Promise<boolean> {
    const rows = await this.db
      .select({ deviceId: deviceSubscriptions.deviceId })
      .from(deviceSubscriptions)
      .where(
        and(
          eq(deviceSubscriptions.deviceId, deviceId),
          entitledDeviceSubscription(),
        ),
      )
      .limit(1);

    return rows.length > 0;
  }
}

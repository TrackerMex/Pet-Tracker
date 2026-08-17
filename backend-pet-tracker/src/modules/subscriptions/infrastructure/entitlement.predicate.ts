import { sql, SQL } from 'drizzle-orm';
import { deviceSubscriptions } from '@/db/schema/subscriptions.schema';
import { DEVICE_SUBSCRIPTION_GRACE_DAYS } from '@/modules/subscriptions/domain/subscription.constants';

export function entitledDeviceSubscription(): SQL {
  return sql`${deviceSubscriptions.status} = 'active'
    and ${deviceSubscriptions.currentPeriodEnd}
      > now() - (${DEVICE_SUBSCRIPTION_GRACE_DAYS} * interval '1 day')`;
}

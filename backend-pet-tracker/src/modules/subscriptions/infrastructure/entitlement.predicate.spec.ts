import { PgDialect } from 'drizzle-orm/pg-core';
import { DEVICE_SUBSCRIPTION_GRACE_DAYS } from '@/modules/subscriptions/domain/subscription.constants';
import { entitledDeviceSubscription } from '@/modules/subscriptions/infrastructure/entitlement.predicate';

describe('R2 (device-subscriptions #25): single entitlement predicate', () => {
  it('interpolates the shared grace period and keeps timestamptz comparison', () => {
    const query = new PgDialect().sqlToQuery(entitledDeviceSubscription());

    expect(query.params).toContain(DEVICE_SUBSCRIPTION_GRACE_DAYS);
    expect(query.sql.toUpperCase()).not.toContain('AT TIME ZONE');
  });
});

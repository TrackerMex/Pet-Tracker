export const DEVICE_SUBSCRIPTION_GRACE_DAYS = 3;

export const DEVICE_SUBSCRIPTION_STATUSES = ['active', 'canceled'] as const;
export type DeviceSubscriptionStatus =
  (typeof DEVICE_SUBSCRIPTION_STATUSES)[number];

export const DEVICE_SUBSCRIPTION_PLAN_CODES = [
  'track_monthly',
  'grandfathered',
] as const;
export type DeviceSubscriptionPlanCode =
  (typeof DEVICE_SUBSCRIPTION_PLAN_CODES)[number];

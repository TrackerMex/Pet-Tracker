export const SUBSCRIPTION_REPOSITORY = Symbol('SubscriptionRepository');

export interface SubscriptionRepository {
  isPetTracked(petId: string): Promise<boolean>;
  isDeviceEntitled(deviceId: string): Promise<boolean>;
}

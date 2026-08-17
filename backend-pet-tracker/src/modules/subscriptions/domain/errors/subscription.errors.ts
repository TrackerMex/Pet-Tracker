export const DEVICE_SUBSCRIPTION_REQUIRED = 'DEVICE_SUBSCRIPTION_REQUIRED';

export class DeviceNotSubscribedError extends Error {
  constructor(deviceId: string) {
    super(`Device ${deviceId} requires an active subscription`);
    this.name = 'DeviceNotSubscribedError';
  }
}

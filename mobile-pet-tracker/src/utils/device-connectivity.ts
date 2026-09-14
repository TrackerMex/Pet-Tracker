import type { DeviceStatus } from '../api/types';
import type { TranslationKey } from '../i18n/catalog';

export type DeviceConnectionState = 'none' | 'unknown' | 'offline' | 'online';

export const DEVICE_CONNECTIVITY_META: Record<
  string,
  { labelKey: TranslationKey }
> = {
  online: { labelKey: 'deviceConnectivity.online' },
  offline: { labelKey: 'deviceConnectivity.offline' },
};

const UNKNOWN_CONNECTIVITY_META: { labelKey: TranslationKey } = {
  labelKey: 'deviceConnectivity.unknown',
};

export function connectivityLabelKey(
  value: string | null,
): TranslationKey | null {
  if (value === null) return null;

  return (
    DEVICE_CONNECTIVITY_META[value]?.labelKey ??
    UNKNOWN_CONNECTIVITY_META.labelKey
  );
}

export function deviceConnectionState(
  device: DeviceStatus | null,
): DeviceConnectionState {
  if (device === null) return 'none';
  if (device.connectivity === 'online') return 'online';
  if (device.connectivity === 'offline') return 'offline';
  return 'unknown';
}

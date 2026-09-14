import { DEVICE_ONLINE_THRESHOLD_MS } from '@/pipeline/constants';

export type DerivedConnectivity = 'online' | 'offline' | null;

export function deriveConnectivity(
  lastMessageAt: Date | null,
  now: Date,
): DerivedConnectivity {
  void lastMessageAt;
  void now;
  void DEVICE_ONLINE_THRESHOLD_MS;
  throw new Error('not implemented');
}

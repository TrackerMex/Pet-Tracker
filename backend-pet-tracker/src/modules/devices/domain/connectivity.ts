// Nucleo puro: aritmetica sin imports de framework, SDK ni ORM.

import { DEVICE_ONLINE_THRESHOLD_MS } from '@/pipeline/constants';

export type DerivedConnectivity = 'online' | 'offline' | null;

export function deriveConnectivity(
  lastMessageAt: Date | null,
  now: Date,
): DerivedConnectivity {
  if (lastMessageAt === null) {
    return null;
  }

  return now.getTime() - lastMessageAt.getTime() <=
    DEVICE_ONLINE_THRESHOLD_MS
    ? 'online'
    : 'offline';
}

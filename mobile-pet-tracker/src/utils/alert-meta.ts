import { BatteryLow, Bell, LocationSlash } from 'reicon-react-native';

import { CATEGORY_SLOTS } from './category-palette';

export const ALERT_TYPE_META = {
  geofence_exit: {
    Icon: LocationSlash,
    labelKey: 'alerts.typeGeofenceExit',
    surface: 'bg-danger-soft',
    disc: CATEGORY_SLOTS.rose.surface,
    ink: 'danger',
    border: 'border-danger',
  },
  battery_low: {
    Icon: BatteryLow,
    labelKey: 'alerts.typeBatteryLow',
    surface: 'bg-warning-soft',
    disc: CATEGORY_SLOTS.amber.surface,
    ink: 'warning-strong',
    border: 'border-warning-strong',
  },
} as const;

export const UNKNOWN_ALERT_META = {
  Icon: Bell,
  labelKey: 'alerts.typeUnknown',
  surface: 'bg-default',
  disc: CATEGORY_SLOTS.neutral.surface,
  ink: 'muted',
  border: 'border-muted',
} as const;

export type AlertTypeMeta =
  | (typeof ALERT_TYPE_META)[keyof typeof ALERT_TYPE_META]
  | typeof UNKNOWN_ALERT_META;

export function alertTypeMeta(type: string): AlertTypeMeta {
  return type in ALERT_TYPE_META
    ? ALERT_TYPE_META[type as keyof typeof ALERT_TYPE_META]
    : UNKNOWN_ALERT_META;
}

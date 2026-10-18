import { BatteryLow, Bell, LocationSlash } from 'reicon-react-native';

import { CATEGORY_SLOTS } from './category-palette';

export const ALERT_TYPE_META = {
  geofence_exit: {
    Icon: LocationSlash,
    labelKey: 'alerts.typeGeofenceExit',

    disc: CATEGORY_SLOTS.rose.surface,
    solid: 'bg-danger',
    onSolid: 'danger-foreground',
    onSolidText: 'text-danger-foreground',
    heroInk: CATEGORY_SLOTS.rose.ink,
    ring: 'bg-danger/20',
    ink: 'danger',
    border: 'border-danger',
  },
  battery_low: {
    Icon: BatteryLow,
    labelKey: 'alerts.typeBatteryLow',

    disc: CATEGORY_SLOTS.amber.surface,
    solid: 'bg-warning-strong',
    onSolid: 'background',
    onSolidText: 'text-background',
    heroInk: CATEGORY_SLOTS.amber.ink,
    ring: 'bg-warning-strong/20',
    ink: 'warning-strong',
    border: 'border-warning-strong',
  },
} as const;

export const UNKNOWN_ALERT_META = {
  Icon: Bell,
  labelKey: 'alerts.typeUnknown',

  disc: CATEGORY_SLOTS.neutral.surface,
  solid: 'bg-muted',
  onSolid: 'background',
  onSolidText: 'text-background',
  heroInk: CATEGORY_SLOTS.neutral.ink,
  ring: 'bg-muted/20',
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

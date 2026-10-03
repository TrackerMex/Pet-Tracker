import { BatteryLow, Bell, LocationSlash } from 'reicon-react-native';

export const ALERT_TYPE_META = {
  geofence_exit: {
    Icon: LocationSlash,
    labelKey: 'alerts.typeGeofenceExit',
    surface: 'bg-danger-soft',
    ink: 'danger',
  },
  battery_low: {
    Icon: BatteryLow,
    labelKey: 'alerts.typeBatteryLow',
    surface: 'bg-warning-soft',
    ink: 'warning-strong',
  },
} as const;

export const UNKNOWN_ALERT_META = {
  Icon: Bell,
  labelKey: 'alerts.typeUnknown',
  surface: 'bg-default',
  ink: 'muted',
} as const;

export function alertTypeMeta(type: string) {
  return type in ALERT_TYPE_META
    ? ALERT_TYPE_META[type as keyof typeof ALERT_TYPE_META]
    : UNKNOWN_ALERT_META;
}

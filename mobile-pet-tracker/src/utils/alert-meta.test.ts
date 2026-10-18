import { alertTypeMeta } from './alert-meta';

jest.mock('reicon-react-native', () => ({ BatteryLow: () => null, Bell: () => null, LocationSlash: () => null }));

const cases = [
  ['geofence_exit', { solid: 'bg-danger', onSolid: 'danger-foreground', onSolidText: 'text-danger-foreground', heroInk: 'text-category-rose-strong', ring: 'bg-danger/20' }],
  ['battery_low', { solid: 'bg-warning-strong', onSolid: 'background', onSolidText: 'text-background', heroInk: 'text-category-amber-strong', ring: 'bg-warning-strong/20' }],
  ['unknown', { solid: 'bg-muted', onSolid: 'background', onSolidText: 'text-background', heroInk: 'text-muted', ring: 'bg-muted/20' }],
] as const;

it.each(cases)('#180 R11.1: %s declara los cinco campos del héroe', (type, expected) => {
  expect(alertTypeMeta(type)).toMatchObject(expected);
});

it.each(cases)('#180 R3.1: %s ya no conserva surface', (type) => {
  expect(alertTypeMeta(type)).not.toHaveProperty('surface');
});

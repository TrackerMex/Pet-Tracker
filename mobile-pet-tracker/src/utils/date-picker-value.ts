import { Platform } from 'react-native';

export function fromPickerValue(picked: Date): Date {
  if (Platform.OS !== 'android') return picked;
  return new Date(picked.getUTCFullYear(), picked.getUTCMonth(), picked.getUTCDate());
}

export function toPickerValue(day: Date): Date {
  if (Platform.OS !== 'android') return day;
  return new Date(Date.UTC(day.getFullYear(), day.getMonth(), day.getDate()));
}

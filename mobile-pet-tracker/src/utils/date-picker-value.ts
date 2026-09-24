export function fromPickerValue(picked: Date): Date {
  return new Date(picked.getUTCFullYear(), picked.getUTCMonth(), picked.getUTCDate());
}

export function toPickerValue(day: Date): Date {
  return new Date(Date.UTC(day.getFullYear(), day.getMonth(), day.getDate()));
}

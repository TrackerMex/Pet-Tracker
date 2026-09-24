export function fromPickerValue(picked: Date): Date {
  return new Date(picked.getUTCFullYear(), picked.getUTCMonth(), picked.getUTCDate());
}

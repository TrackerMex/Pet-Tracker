import type { WeightEntry } from '../api/types';

export function monthlyWeightDelta(
  entries: WeightEntry[],
  todayIso: string,
): number | null {
  const monthStart = todayIso.slice(0, 7) + '-01';
  const inMonth = entries.filter((entry) => entry.measuredAt >= monthStart);
  if (inMonth.length === 0) return null;

  const newest = inMonth.reduce((a, b) => (b.weightKg > a.weightKg ? b : a));
  const baseline = entries
    .filter((entry) => entry.measuredAt < monthStart)
    .reduce<WeightEntry | undefined>((a, b) => (a && a.weightKg >= b.weightKg ? a : b), undefined)
    ?? inMonth.reduce((a, b) => (b.weightKg < a.weightKg ? b : a));
  if (baseline.measuredAt === newest.measuredAt) return null;

  return Math.round((newest.weightKg - baseline.weightKg) * 10) / 10;
}

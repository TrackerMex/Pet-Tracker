import type { WeightEntry } from '../api/types';

export function monthlyWeightDelta(
  entries: WeightEntry[],
  todayIso: string,
): number | null {
  const monthStart = todayIso.slice(0, 7) + '-01';
  const inMonth = entries.filter((entry) => entry.measuredAt >= monthStart);
  if (inMonth.length === 0) return null;

  const newest = inMonth[0];
  const baseline = entries.find((entry) => entry.measuredAt < monthStart)
    ?? inMonth[inMonth.length - 1];
  if (baseline === newest) return null;

  return Math.round((newest.weightKg - baseline.weightKg) * 100) / 100;
}

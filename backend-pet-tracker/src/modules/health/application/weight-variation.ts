import {
  PetWeight,
  PetWeightProps,
} from '@/modules/health/domain/entities/weight.entity';

export interface WeightEntry extends PetWeightProps {
  variation: number | null;
}

export function toWeightHistory(
  rowsNewestFirst: PetWeight[],
  limit: number,
): WeightEntry[] {
  return rowsNewestFirst.slice(0, limit).map((weight, index) => ({
    ...weight,
    variation: weightDelta(
      weight.weightKg,
      rowsNewestFirst[index + 1]?.weightKg ?? null,
    ),
  }));
}

export function weightDelta(
  current: number,
  previous: number | null,
): number | null {
  return previous === null
    ? null
    : Math.round((current - previous) * 100) / 100;
}

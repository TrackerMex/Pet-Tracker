import { WeightEntry } from '@/modules/health/application/weight-variation';

export interface WeightResponse {
  id: string;
  petId: string;
  weightKg: number;
  measuredAt: string;
  bodyCondition: number | null;
  variation: number | null;
}

export function toWeightResponse(entry: WeightEntry): WeightResponse {
  return {
    id: entry.id,
    petId: entry.petId,
    weightKg: entry.weightKg,
    measuredAt: entry.measuredAt,
    bodyCondition: entry.bodyCondition,
    variation: entry.variation,
  };
}

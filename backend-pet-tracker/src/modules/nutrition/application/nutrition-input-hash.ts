import { createHash } from 'node:crypto';
import type { NutritionEngineInput } from '@/modules/nutrition/domain/nutrition-engine';
import type { NutritionWeightPoint } from '@/modules/nutrition/domain/ports/nutrition-weight-reader';

export function nutritionInputHash(
  input: NutritionEngineInput,
  weightTrend: NutritionWeightPoint[],
): string {
  const canonicalInput = {
    species: input.species,
    weightKg: Number(input.weightKg),
    targetWeightKg:
      input.targetWeightKg == null ? null : Number(input.targetWeightKg),
    ageMonths: Number(input.ageMonths),
    sterilized: input.sterilized,
    activityLevel: input.activityLevel,
    bodyCondition:
      input.bodyCondition == null ? null : Number(input.bodyCondition),
    kcalPer100g: Number(input.kcalPer100g),
    allergies: [...input.allergies].sort(),
    diseases: [...input.diseases].sort(),
    weightTrend: weightTrend.map((p) => ({
      measuredAt: p.measuredAt,
      weightKg: Number(p.weightKg),
    })),
  };

  return createHash('sha256')
    .update(JSON.stringify(canonicalInput))
    .digest('hex');
}

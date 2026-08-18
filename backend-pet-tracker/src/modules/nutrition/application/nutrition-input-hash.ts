import type { NutritionEngineInput } from '@/modules/nutrition/domain/nutrition-engine';

export function nutritionInputHash(_input: NutritionEngineInput): string {
  return '0'.repeat(64);
}

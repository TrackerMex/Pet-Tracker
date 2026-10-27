export const NUTRITION_AI_DAILY_LIMIT = 3;
export const NUTRITION_AI_GRAMS_TOLERANCE_PERCENT = 10;
export const NUTRITION_AI_WEIGHT_TREND_POINTS = 5;

export interface NutritionMealGrams {
  mealTime: string;
  grams: number;
}

export interface NutritionAiOutput {
  mealGrams: NutritionMealGrams[];
  recommendations: string[];
  reviewInDays: number;
  explanation: string;
}

export interface NutritionAiProposal {
  mealGrams: NutritionMealGrams[];
  recommendations: string[];
  reviewDate: string;
}

export type NutritionAiStatus =
  'proposed' | 'not_tracked' | 'limit_reached' | 'unavailable' | 'rejected';

export function acceptAiOutput(
  output: NutritionAiOutput,
  plan: { dailyGrams: number; mealTimes: string[] },
  localDay: string,
): { explanation: string; proposal: NutritionAiProposal } | null {
  void output;
  void plan;
  void localDay;
  return null;
}

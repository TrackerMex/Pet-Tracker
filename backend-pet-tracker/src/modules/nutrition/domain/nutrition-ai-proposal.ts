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
  if (output.mealGrams.length !== plan.mealTimes.length) return null;
  const byTime = new Map(output.mealGrams.map((meal) => [meal.mealTime, meal]));
  if (
    byTime.size !== plan.mealTimes.length ||
    plan.mealTimes.some((time) => !byTime.has(time))
  ) {
    return null;
  }
  return {
    explanation: output.explanation,
    proposal: {
      mealGrams: plan.mealTimes.map((time) => byTime.get(time)!),
      recommendations: output.recommendations,
      reviewDate: shiftDay(localDay, output.reviewInDays),
    },
  };
}
import { shiftDay } from '@/pipeline/local-day';

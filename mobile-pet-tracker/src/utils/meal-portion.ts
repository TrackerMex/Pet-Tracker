import type { NutritionPlan } from '../api/types';

export function engineMealGrams(plan: NutritionPlan): number {
  return Math.round(plan.dailyGrams / plan.mealsPerDay);
}

export function mealPortionGrams(plan: NutritionPlan, mealTime: string): number {
  const proposed = plan.aiProposal?.mealGrams.find((meal) => meal.mealTime === mealTime);
  return proposed ? proposed.grams : engineMealGrams(plan);
}

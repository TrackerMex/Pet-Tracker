import type { NutritionProfile } from '@/modules/nutrition/domain/entities/nutrition-profile.entity';
import type { NutritionPlan } from '@/modules/nutrition/domain/entities/nutrition-plan.entity';
import type { NutritionPlanToday } from '@/modules/nutrition/application/use-cases/get-nutrition-plan.use-case';
import type { MealServing } from '@/modules/nutrition/domain/entities/meal-serving.entity';
import type {
  NutritionObjective,
  NutritionWarning,
} from '@/modules/nutrition/domain/nutrition-engine';

export interface NutritionProfileResponse {
  petId: string;
  activityLevel: string;
  bodyCondition: number | null;
  targetWeightKg: number | null;
  foodType: string;
  kcalPer100g: number;
  allergies: string[];
  diseases: string[];
  updatedAt: string;
}

export interface NutritionPlanResponse {
  id: string;
  petId: string;
  rerKcal: number;
  merKcal: number;
  dailyGrams: number;
  mealsPerDay: number;
  mealTimes: string[];
  objective: NutritionObjective;
  warnings: NutritionWarning[];
  aiExplanation: string | null;
  generatedAt: string;
}

export interface NutritionPlanTodayResponse extends NutritionPlanResponse {
  servedToday: string[];
  kcalConsumedToday: number;
}

export interface MealServingResponse {
  id: string;
  petId: string;
  servedOn: string;
  mealTime: string;
  servedAt: string;
  createdBy: string;
}

export function toNutritionProfileResponse(
  profile: NutritionProfile,
): NutritionProfileResponse {
  return {
    petId: profile.petId,
    activityLevel: profile.activityLevel,
    bodyCondition: profile.bodyCondition,
    targetWeightKg: profile.targetWeightKg,
    foodType: profile.foodType,
    kcalPer100g: profile.kcalPer100g,
    allergies: profile.allergies,
    diseases: profile.diseases,
    updatedAt: profile.updatedAt.toISOString(),
  };
}

export function toNutritionPlanResponse(
  plan: NutritionPlan,
): NutritionPlanResponse {
  return {
    id: plan.id,
    petId: plan.petId,
    rerKcal: plan.rerKcal,
    merKcal: plan.merKcal,
    dailyGrams: plan.dailyGrams,
    mealsPerDay: plan.mealsPerDay,
    mealTimes: plan.mealTimes,
    objective: plan.objective,
    warnings: plan.warnings,
    aiExplanation: null,
    generatedAt: plan.generatedAt.toISOString(),
  };
}

export function toNutritionPlanTodayResponse({
  plan,
  servedToday,
  kcalConsumedToday,
}: NutritionPlanToday): NutritionPlanTodayResponse {
  return { ...toNutritionPlanResponse(plan), servedToday, kcalConsumedToday };
}

export function toMealServingResponse(
  serving: MealServing,
): MealServingResponse {
  return {
    id: serving.id,
    petId: serving.petId,
    servedOn: serving.servedOn,
    mealTime: serving.mealTime,
    servedAt: serving.servedAt.toISOString(),
    createdBy: serving.createdBy,
  };
}

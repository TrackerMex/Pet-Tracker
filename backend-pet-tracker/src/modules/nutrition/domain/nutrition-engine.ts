import { NUTRITION_WARNING_ORDER } from './nutrition.constants';

export interface NutritionEngineInput {
  species: 'dog' | 'cat';
  weightKg: number;
  targetWeightKg: number | null;
  ageMonths: number;
  sterilized: boolean;
  activityLevel: 'low' | 'medium' | 'high';
  bodyCondition: number | null;
  kcalPer100g: number;
  allergies: string[];
  diseases: string[];
}

export type NutritionObjective = 'maintenance' | 'weight_loss' | 'growth';

export type NutritionWarningCode =
  | 'weight_loss_plan'
  | 'underweight_vet'
  | 'chronic_disease_vet'
  | 'check_food_allergens'
  | 'too_young_vet';

export interface NutritionWarning {
  code: NutritionWarningCode;
  message: string;
}

export interface NutritionPlanResult {
  rerKcal: number;
  merKcal: number;
  dailyGrams: number;
  mealsPerDay: number;
  mealTimes: string[];
  objective: NutritionObjective;
  warnings: NutritionWarning[];
}

/**
 * Calcula un plan sin reloj ni I/O. El algoritmo usa exclusivamente las
 * constantes clínicas nombradas de nutrition.constants.ts.
 */
export function computePlan(input: NutritionEngineInput): NutritionPlanResult {
  void input;
  void NUTRITION_WARNING_ORDER;
  throw new Error('Nutrition plan computation is not implemented');
}

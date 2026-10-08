import type {
  NutritionPlanResult,
  NutritionObjective,
  NutritionWarning,
} from '@/modules/nutrition/domain/nutrition-engine';

export interface NutritionPlanProps {
  id: string;
  petId: string;
  rerKcal: number;
  merKcal: number;
  dailyGrams: number;
  mealsPerDay: number;
  mealTimes: string[];
  engineMealsPerDay: number | null;
  objective: NutritionObjective;
  warnings: NutritionWarning[];
  aiExplanation: string | null;
  inputsHash: string;
  generatedAt: Date;
}

export type NewNutritionPlan = Omit<NutritionPlanProps, 'id' | 'generatedAt'>;

export class NutritionPlan implements NutritionPlanProps {
  readonly id: string;
  readonly petId: string;
  readonly rerKcal: number;
  readonly merKcal: number;
  readonly dailyGrams: number;
  readonly mealsPerDay: number;
  readonly mealTimes: string[];
  readonly engineMealsPerDay: number | null;
  readonly objective: NutritionObjective;
  readonly warnings: NutritionWarning[];
  readonly aiExplanation: string | null;
  readonly inputsHash: string;
  readonly generatedAt: Date;

  constructor(props: NutritionPlanProps) {
    Object.assign(this, props);
  }
}

export function engineMealCount(plan: NutritionPlan): number {
  return plan.engineMealsPerDay ?? plan.mealsPerDay;
}

export function carriedSchedule(
  latest: NutritionPlan | null,
  engine: { mealsPerDay: number; mealTimes: string[] },
): { mealsPerDay: number; mealTimes: string[] } {
  const schedule =
    latest !== null && engineMealCount(latest) === engine.mealsPerDay
      ? latest
      : engine;
  return {
    mealsPerDay: schedule.mealsPerDay,
    mealTimes: [...schedule.mealTimes],
  };
}

export function copyWithMealTimes(
  plan: NutritionPlan,
  mealTimes: string[],
): NewNutritionPlan {
  return {
    petId: plan.petId,
    rerKcal: plan.rerKcal,
    merKcal: plan.merKcal,
    dailyGrams: plan.dailyGrams,
    mealsPerDay: mealTimes.length,
    mealTimes: [...mealTimes].sort(),
    engineMealsPerDay: engineMealCount(plan),
    objective: plan.objective,
    warnings: plan.warnings,
    aiExplanation: plan.aiExplanation,
    inputsHash: plan.inputsHash,
  };
}

export function toPlanResult(plan: NutritionPlan): NutritionPlanResult {
  void plan;
  throw new Error('not implemented (R12)');
}

import type {
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
  return plan.mealsPerDay;
}

export function carriedSchedule(
  latest: NutritionPlan | null,
  engine: { mealsPerDay: number; mealTimes: string[] },
): { mealsPerDay: number; mealTimes: string[] } {
  if (latest)
    return { mealsPerDay: engine.mealsPerDay, mealTimes: engine.mealTimes };
  return { mealsPerDay: engine.mealsPerDay, mealTimes: engine.mealTimes };
}

import type {
  NutritionProfile,
  NutritionProfileData,
} from '@/modules/nutrition/domain/entities/nutrition-profile.entity';
import type {
  NewNutritionPlan,
  NutritionPlan,
} from '@/modules/nutrition/domain/entities/nutrition-plan.entity';

export const NUTRITION_REPOSITORY = Symbol('NutritionRepository');

export interface MealTimeMove {
  servedOn: string;
  from: string;
  to: string;
}

export interface NutritionRepository {
  setAiExplanation(planId: string, explanation: string): Promise<NutritionPlan>;
  findProfile(petId: string): Promise<NutritionProfile | null>;
  upsertProfile(
    petId: string,
    data: NutritionProfileData,
  ): Promise<NutritionProfile>;
  findLatestPlan(petId: string): Promise<NutritionPlan | null>;
  insertPlan(plan: NewNutritionPlan): Promise<NutritionPlan>;
  insertPlanAndMoveServing(
    plan: NewNutritionPlan,
    move: MealTimeMove,
  ): Promise<NutritionPlan>;
}

import type {
  NutritionProfile,
  NutritionProfileData,
} from '@/modules/nutrition/domain/entities/nutrition-profile.entity';
import type {
  NewNutritionPlan,
  NutritionPlan,
} from '@/modules/nutrition/domain/entities/nutrition-plan.entity';

export const NUTRITION_REPOSITORY = Symbol('NutritionRepository');

export interface NutritionRepository {
  findProfile(petId: string): Promise<NutritionProfile | null>;
  upsertProfile(
    petId: string,
    data: NutritionProfileData,
  ): Promise<NutritionProfile>;
  findLatestPlan(petId: string): Promise<NutritionPlan | null>;
  insertPlan(plan: NewNutritionPlan): Promise<NutritionPlan>;
  setAiExplanation(
    planId: string,
    explanation: string,
  ): Promise<NutritionPlan>;
}

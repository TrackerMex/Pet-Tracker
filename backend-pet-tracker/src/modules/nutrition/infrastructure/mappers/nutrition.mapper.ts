import type { NutritionProfile } from '@/modules/nutrition/domain/entities/nutrition-profile.entity';

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

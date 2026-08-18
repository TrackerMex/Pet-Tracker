export type NutritionActivityLevel = 'low' | 'medium' | 'high';
export type NutritionFoodType = 'dry' | 'wet' | 'mixed' | 'homemade';

export interface NutritionProfileData {
  activityLevel: NutritionActivityLevel;
  bodyCondition: number | null;
  targetWeightKg: number | null;
  foodType: NutritionFoodType;
  kcalPer100g: number;
  allergies: string[];
  diseases: string[];
}

export interface NutritionProfileProps extends NutritionProfileData {
  petId: string;
  updatedAt: Date;
}

export class NutritionProfile implements NutritionProfileProps {
  readonly petId: string;
  readonly activityLevel: NutritionActivityLevel;
  readonly bodyCondition: number | null;
  readonly targetWeightKg: number | null;
  readonly foodType: NutritionFoodType;
  readonly kcalPer100g: number;
  readonly allergies: string[];
  readonly diseases: string[];
  readonly updatedAt: Date;

  constructor(props: NutritionProfileProps) {
    Object.assign(this, props);
  }
}

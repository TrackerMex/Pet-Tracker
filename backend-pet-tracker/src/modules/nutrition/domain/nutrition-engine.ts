import {
  ACTIVITY_MODIFIER_CAT_HIGH,
  ACTIVITY_MODIFIER_CAT_LOW,
  ACTIVITY_MODIFIER_DOG_HIGH,
  ACTIVITY_MODIFIER_DOG_LOW,
  AGE_MONTHS_ADULT_MIN,
  AGE_MONTHS_PUPPY_MAX,
  BODY_CONDITION_OVERWEIGHT_MIN,
  MEALS_ADULT,
  MER_FACTOR_ADULT_CAT_INTACT,
  MER_FACTOR_ADULT_CAT_STERILIZED,
  MER_FACTOR_ADULT_DOG_INTACT,
  MER_FACTOR_ADULT_DOG_STERILIZED,
  MER_FACTOR_GROWTH_CAT,
  MER_FACTOR_PUPPY_DOG,
  MER_FACTOR_WEIGHT_LOSS_CAT,
  MER_FACTOR_WEIGHT_LOSS_DOG,
  MER_FACTOR_YOUNG_DOG,
  RER_COEFFICIENT,
  RER_EXPONENT,
} from './nutrition.constants';

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
  const isGrowth = input.ageMonths < AGE_MONTHS_ADULT_MIN;
  const isWeightLoss =
    !isGrowth &&
    input.bodyCondition !== null &&
    input.bodyCondition >= BODY_CONDITION_OVERWEIGHT_MIN;
  const baseWeightKg =
    isWeightLoss && input.targetWeightKg !== null
      ? input.targetWeightKg
      : input.weightKg;
  const rerRaw = RER_COEFFICIENT * Math.pow(baseWeightKg, RER_EXPONENT);
  const rerKcal = Math.round(rerRaw);

  let factor: number;
  if (isGrowth) {
    factor =
      input.species === 'dog'
        ? input.ageMonths < AGE_MONTHS_PUPPY_MAX
          ? MER_FACTOR_PUPPY_DOG
          : MER_FACTOR_YOUNG_DOG
        : MER_FACTOR_GROWTH_CAT;
  } else if (isWeightLoss) {
    factor =
      input.species === 'dog'
        ? MER_FACTOR_WEIGHT_LOSS_DOG
        : MER_FACTOR_WEIGHT_LOSS_CAT;
  } else {
    factor =
      input.species === 'dog'
        ? input.sterilized
          ? MER_FACTOR_ADULT_DOG_STERILIZED
          : MER_FACTOR_ADULT_DOG_INTACT
        : input.sterilized
          ? MER_FACTOR_ADULT_CAT_STERILIZED
          : MER_FACTOR_ADULT_CAT_INTACT;

    if (input.activityLevel === 'high') {
      factor +=
        input.species === 'dog'
          ? ACTIVITY_MODIFIER_DOG_HIGH
          : ACTIVITY_MODIFIER_CAT_HIGH;
    } else if (input.activityLevel === 'low') {
      factor +=
        input.species === 'dog'
          ? ACTIVITY_MODIFIER_DOG_LOW
          : ACTIVITY_MODIFIER_CAT_LOW;
    }
  }

  const merKcal = Math.round(rerRaw * factor);

  return {
    rerKcal,
    merKcal,
    dailyGrams: merKcal,
    mealsPerDay: MEALS_ADULT,
    mealTimes: [],
    objective: 'maintenance',
    warnings: [],
  };
}

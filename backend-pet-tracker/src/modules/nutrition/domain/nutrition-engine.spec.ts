import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  ACTIVITY_MODIFIER_CAT_HIGH,
  ACTIVITY_MODIFIER_CAT_LOW,
  ACTIVITY_MODIFIER_DOG_HIGH,
  ACTIVITY_MODIFIER_DOG_LOW,
  AGE_MONTHS_ADULT_MIN,
  AGE_MONTHS_PUPPY_MAX,
  AGE_MONTHS_TOO_YOUNG_MAX,
  BODY_CONDITION_OVERWEIGHT_MIN,
  BODY_CONDITION_UNDERWEIGHT_MAX,
  GRAMS_ROUNDING_STEP,
  MEALS_ADULT,
  MEALS_ADULT_CAT_HIGH_ACTIVITY,
  MEALS_PUPPY,
  MEALS_YOUNG,
  MEAL_TIMES_BY_COUNT,
  MER_FACTOR_ADULT_CAT_INTACT,
  MER_FACTOR_ADULT_CAT_STERILIZED,
  MER_FACTOR_ADULT_DOG_INTACT,
  MER_FACTOR_ADULT_DOG_STERILIZED,
  MER_FACTOR_GROWTH_CAT,
  MER_FACTOR_PUPPY_DOG,
  MER_FACTOR_WEIGHT_LOSS_CAT,
  MER_FACTOR_WEIGHT_LOSS_DOG,
  MER_FACTOR_YOUNG_DOG,
  NUTRITION_WARNING_MESSAGES,
  NUTRITION_WARNING_ORDER,
  RER_COEFFICIENT,
  RER_EXPONENT,
} from './nutrition.constants';
import { computePlan, NutritionEngineInput } from './nutrition-engine';

const BASE_INPUT: NutritionEngineInput = {
  species: 'dog',
  weightKg: 20,
  targetWeightKg: null,
  ageMonths: 60,
  sterilized: true,
  activityLevel: 'medium',
  bodyCondition: null,
  kcalPer100g: 350,
  allergies: [],
  diseases: [],
};

describe('R1 (nutrition-profile-engine #17): el motor es puro y sin literales', () => {
  it('expone computePlan y concentra todas las cifras y textos en constantes', () => {
    expect(typeof computePlan).toBe('function');
    expect({ RER_COEFFICIENT, RER_EXPONENT, GRAMS_ROUNDING_STEP }).toEqual({
      RER_COEFFICIENT: 70,
      RER_EXPONENT: 0.75,
      GRAMS_ROUNDING_STEP: 5,
    });
    expect([
      MER_FACTOR_PUPPY_DOG,
      MER_FACTOR_YOUNG_DOG,
      MER_FACTOR_GROWTH_CAT,
      MER_FACTOR_ADULT_DOG_STERILIZED,
      MER_FACTOR_ADULT_DOG_INTACT,
      MER_FACTOR_ADULT_CAT_STERILIZED,
      MER_FACTOR_ADULT_CAT_INTACT,
      MER_FACTOR_WEIGHT_LOSS_DOG,
      MER_FACTOR_WEIGHT_LOSS_CAT,
      ACTIVITY_MODIFIER_DOG_HIGH,
      ACTIVITY_MODIFIER_DOG_LOW,
      ACTIVITY_MODIFIER_CAT_HIGH,
      ACTIVITY_MODIFIER_CAT_LOW,
    ]).toEqual([3, 2, 2.5, 1.6, 1.8, 1.2, 1.4, 1, 0.8, 0.2, -0.2, 0.1, -0.1]);
    expect([
      AGE_MONTHS_PUPPY_MAX,
      AGE_MONTHS_ADULT_MIN,
      AGE_MONTHS_TOO_YOUNG_MAX,
      BODY_CONDITION_OVERWEIGHT_MIN,
      BODY_CONDITION_UNDERWEIGHT_MAX,
      MEALS_PUPPY,
      MEALS_YOUNG,
      MEALS_ADULT,
      MEALS_ADULT_CAT_HIGH_ACTIVITY,
    ]).toEqual([4, 12, 2, 7, 3, 4, 3, 2, 3]);
    expect(MEAL_TIMES_BY_COUNT).toEqual({
      2: ['07:30', '19:30'],
      3: ['07:30', '14:00', '19:30'],
      4: ['07:00', '11:00', '15:00', '19:00'],
    });
    expect(NUTRITION_WARNING_ORDER).toEqual([
      'weight_loss_plan',
      'underweight_vet',
      'chronic_disease_vet',
      'check_food_allergens',
      'too_young_vet',
    ]);
    expect(Object.values(NUTRITION_WARNING_MESSAGES)).toHaveLength(5);
  });

  it('no contiene dependencias impuras ni literales clinicos', () => {
    const source = readFileSync(join(__dirname, 'nutrition-engine.ts'), 'utf8');

    expect(source).toContain("from './nutrition.constants'");
    for (const forbidden of [
      '@nestjs/',
      'drizzle-orm',
      "from 'pg'",
      "from 'zod'",
      'Date.now',
      'new Date',
      '3.0',
      '1.6',
      '0.75',
      '70',
      '07:30',
      'La condicion corporal',
      'Plan general; tu veterinario',
      'Registraste alergias',
      'Es una mascota de menos',
    ]) {
      expect(source).not.toContain(forbidden);
    }
  });
});

describe('R2 (nutrition-profile-engine #17): RER y peso base', () => {
  it('calcula el RER sobre el peso actual en mantenimiento', () => {
    expect(computePlan(BASE_INPUT).rerKcal).toBe(
      Math.round(RER_COEFFICIENT * Math.pow(20, RER_EXPONENT)),
    );
  });

  it('usa targetWeightKg solo para un adulto en perdida de peso', () => {
    const result = computePlan({
      ...BASE_INPUT,
      weightKg: 30,
      targetWeightKg: 25,
      ageMonths: 72,
      bodyCondition: 8,
    });

    expect(result.rerKcal).toBe(
      Math.round(RER_COEFFICIENT * Math.pow(25, RER_EXPONENT)),
    );
  });

  it('OV2 usa weightKg en crecimiento aunque BCS y target esten informados', () => {
    const result = computePlan({
      ...BASE_INPUT,
      weightKg: 5,
      targetWeightKg: 4,
      ageMonths: 3,
      bodyCondition: 8,
    });

    expect(result.rerKcal).toBe(
      Math.round(RER_COEFFICIENT * Math.pow(5, RER_EXPONENT)),
    );
  });
});

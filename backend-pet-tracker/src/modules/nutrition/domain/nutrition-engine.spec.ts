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

describe('R3 (nutrition-profile-engine #17): tabla de factores MER y precedencia', () => {
  const expectedMer = (weightKg: number, factor: number) =>
    Math.round(
      RER_COEFFICIENT * Math.pow(weightKg, RER_EXPONENT) * factor,
    );

  it.each<Array<[string, Partial<NutritionEngineInput>, number]>>([
    ['cachorro perro', { species: 'dog', ageMonths: 3 }, 3],
    ['cachorro gato', { species: 'cat', ageMonths: 3 }, 2.5],
    ['joven perro', { species: 'dog', ageMonths: 6 }, 2],
    ['joven gato', { species: 'cat', ageMonths: 6 }, 2.5],
    [
      'adulto perro esterilizado',
      { species: 'dog', ageMonths: 24, sterilized: true },
      1.6,
    ],
    [
      'adulto gato esterilizado',
      { species: 'cat', ageMonths: 24, sterilized: true },
      1.2,
    ],
    [
      'adulto perro entero',
      { species: 'dog', ageMonths: 24, sterilized: false },
      1.8,
    ],
    [
      'adulto gato entero',
      { species: 'cat', ageMonths: 24, sterilized: false },
      1.4,
    ],
    [
      'perdida de peso perro',
      { species: 'dog', ageMonths: 24, bodyCondition: 8 },
      1,
    ],
    [
      'perdida de peso gato',
      { species: 'cat', ageMonths: 24, bodyCondition: 8 },
      0.8,
    ],
  ])('aplica el factor de %s', (_label, changes, factor) => {
    const input = { ...BASE_INPUT, weightKg: 10, ...changes };
    expect(computePlan(input).merKcal).toBe(expectedMer(10, factor));
  });

  it.each<Array<[string, Partial<NutritionEngineInput>, number]>>([
    ['perro high', { species: 'dog', activityLevel: 'high' }, 1.8],
    ['perro low', { species: 'dog', activityLevel: 'low' }, 1.4],
    ['gato high', { species: 'cat', activityLevel: 'high' }, 1.3],
    ['gato low', { species: 'cat', activityLevel: 'low' }, 1.1],
  ])('aplica el modificador adulto %s', (_label, changes, factor) => {
    const input = { ...BASE_INPUT, weightKg: 10, ...changes };
    expect(computePlan(input).merKcal).toBe(expectedMer(10, factor));
  });

  it('no aplica actividad a crecimiento ni perdida de peso', () => {
    for (const changes of [
      { ageMonths: 3 },
      { ageMonths: 24, bodyCondition: 8 },
    ]) {
      const medium = computePlan({ ...BASE_INPUT, ...changes });
      const high = computePlan({
        ...BASE_INPUT,
        ...changes,
        activityLevel: 'high',
      });
      expect(high.merKcal).toBe(medium.merKcal);
    }
  });

  it('trata sterilized null como entero', () => {
    const result = computePlan({
      ...BASE_INPUT,
      weightKg: 10,
      sterilized: null as unknown as boolean,
    });
    expect(result.merKcal).toBe(expectedMer(10, 1.8));
  });
});

describe('R4 (nutrition-profile-engine #17): redondeo de kcal y gramos', () => {
  it('deriva gramos del MER ya redondeado y devuelve enteros', () => {
    const result = computePlan({
      species: 'cat',
      weightKg: 1.2,
      targetWeightKg: null,
      ageMonths: 24,
      sterilized: true,
      activityLevel: 'medium',
      bodyCondition: null,
      kcalPer100g: 350,
      allergies: [],
      diseases: [],
    });

    expect(result).toMatchObject({
      rerKcal: 80,
      merKcal: 96,
      dailyGrams: 25,
    });
    expect(Number.isInteger(result.rerKcal)).toBe(true);
    expect(Number.isInteger(result.merKcal)).toBe(true);
    expect(Number.isInteger(result.dailyGrams)).toBe(true);
  });
});

describe('R5 (nutrition-profile-engine #17): comidas por dia', () => {
  it.each<Array<[string, Partial<NutritionEngineInput>, number]>>([
    ['cachorro', { ageMonths: 3 }, 4],
    ['joven', { ageMonths: 6 }, 3],
    ['adulto', { ageMonths: 24 }, 2],
    [
      'gato adulto high',
      { species: 'cat', ageMonths: 24, activityLevel: 'high' },
      3,
    ],
    [
      'perro adulto high',
      { species: 'dog', ageMonths: 24, activityLevel: 'high' },
      2,
    ],
  ])('asigna las comidas de %s', (_label, changes, expected) => {
    expect(computePlan({ ...BASE_INPUT, ...changes }).mealsPerDay).toBe(
      expected,
    );
  });
});

describe('R6 (nutrition-profile-engine #17): horarios por numero de comidas', () => {
  it.each<Array<[number, Partial<NutritionEngineInput>, string[]]>>([
    [2, { ageMonths: 24 }, ['07:30', '19:30']],
    [3, { ageMonths: 6 }, ['07:30', '14:00', '19:30']],
    [4, { ageMonths: 3 }, ['07:00', '11:00', '15:00', '19:00']],
  ])('devuelve la tabla fija para %i comidas', (_count, changes, expected) => {
    const result = computePlan({ ...BASE_INPUT, ...changes });
    expect(result.mealTimes).toEqual(expected);
    expect(result.mealTimes).toHaveLength(result.mealsPerDay);
  });
});

describe('R7 (nutrition-profile-engine #17): objective', () => {
  it.each<Array<[string, Partial<NutritionEngineInput>, string]>>([
    ['crecimiento', { ageMonths: 6 }, 'growth'],
    ['perdida de peso', { ageMonths: 24, bodyCondition: 8 }, 'weight_loss'],
    ['mantenimiento', { ageMonths: 24, bodyCondition: 5 }, 'maintenance'],
    [
      'edad sobre BCS',
      { ageMonths: 3, bodyCondition: 8 },
      'growth',
    ],
  ])('asigna %s', (_label, changes, expected) => {
    expect(computePlan({ ...BASE_INPUT, ...changes }).objective).toBe(expected);
  });
});

describe('R8 (nutrition-profile-engine #17): warning weight_loss_plan', () => {
  const hasWarning = (bodyCondition: number | null, ageMonths = 24) =>
    computePlan({ ...BASE_INPUT, bodyCondition, ageMonths }).warnings.some(
      (warning) => warning.code === 'weight_loss_plan',
    );

  it('aparece con BCS alto en adulto y crecimiento sin cambiar objective', () => {
    expect(hasWarning(8)).toBe(true);
    const growth = computePlan({
      ...BASE_INPUT,
      ageMonths: 3,
      bodyCondition: 8,
    });
    expect(growth.warnings).toContainEqual({
      code: 'weight_loss_plan',
      message: NUTRITION_WARNING_MESSAGES.weight_loss_plan,
    });
    expect(growth.objective).toBe('growth');
  });

  it('anti-vacio: no aparece con BCS normal o ausente', () => {
    expect(hasWarning(5)).toBe(false);
    expect(hasWarning(null)).toBe(false);
  });
});

describe('R9 (nutrition-profile-engine #17): warning underweight_vet', () => {
  const hasWarning = (bodyCondition: number | null) =>
    computePlan({ ...BASE_INPUT, bodyCondition }).warnings.some(
      (warning) => warning.code === 'underweight_vet',
    );

  it('aparece en el umbral y por debajo con el texto aprobado', () => {
    for (const bodyCondition of [3, 1]) {
      expect(
        computePlan({ ...BASE_INPUT, bodyCondition }).warnings,
      ).toContainEqual({
        code: 'underweight_vet',
        message: NUTRITION_WARNING_MESSAGES.underweight_vet,
      });
    }
  });

  it('anti-vacio: no aparece con BCS normal o ausente', () => {
    expect(hasWarning(5)).toBe(false);
    expect(hasWarning(null)).toBe(false);
  });
});

describe('R10 (nutrition-profile-engine #17): warning chronic_disease_vet', () => {
  it('aparece con enfermedad y texto literal', () => {
    expect(
      computePlan({ ...BASE_INPUT, diseases: ['diabetes'] }).warnings,
    ).toContainEqual({
      code: 'chronic_disease_vet',
      message: 'Plan general; tu veterinario debe ajustarlo.',
    });
  });

  it('anti-vacio: no aparece sin enfermedades', () => {
    expect(
      computePlan({ ...BASE_INPUT, diseases: [] }).warnings.some(
        (warning) => warning.code === 'chronic_disease_vet',
      ),
    ).toBe(false);
  });
});

describe('R11 (nutrition-profile-engine #17): warning check_food_allergens', () => {
  it('aparece con alergias y texto aprobado', () => {
    expect(
      computePlan({ ...BASE_INPUT, allergies: ['pollo'] }).warnings,
    ).toContainEqual({
      code: 'check_food_allergens',
      message: NUTRITION_WARNING_MESSAGES.check_food_allergens,
    });
  });

  it('anti-vacio: no aparece sin alergias', () => {
    expect(
      computePlan({ ...BASE_INPUT, allergies: [] }).warnings.some(
        (warning) => warning.code === 'check_food_allergens',
      ),
    ).toBe(false);
  });
});

import type { NutritionWarningCode } from './nutrition-engine';

/** C-1/C-10: RER y redondeo de gramos al múltiplo de 5 más cercano. */
export const RER_COEFFICIENT = 70;
export const RER_EXPONENT = 0.75;
export const GRAMS_ROUNDING_STEP = 5;

/** C-2: factores MER de crecimiento, adulto y pérdida de peso. */
export const MER_FACTOR_PUPPY_DOG = 3.0;
export const MER_FACTOR_YOUNG_DOG = 2.0;
export const MER_FACTOR_GROWTH_CAT = 2.5;
export const MER_FACTOR_ADULT_DOG_STERILIZED = 1.6;
export const MER_FACTOR_ADULT_DOG_INTACT = 1.8;
export const MER_FACTOR_ADULT_CAT_STERILIZED = 1.2;
export const MER_FACTOR_ADULT_CAT_INTACT = 1.4;
export const MER_FACTOR_WEIGHT_LOSS_DOG = 1.0;
export const MER_FACTOR_WEIGHT_LOSS_CAT = 0.8;

/** C-2: modificadores de actividad para adultos en mantenimiento. */
export const ACTIVITY_MODIFIER_DOG_HIGH = 0.2;
export const ACTIVITY_MODIFIER_DOG_LOW = -0.2;
export const ACTIVITY_MODIFIER_CAT_HIGH = 0.1;
export const ACTIVITY_MODIFIER_CAT_LOW = -0.1;

/** C-3/C-4: umbrales semiabiertos de edad y condición corporal BCS 1-9. */
export const AGE_MONTHS_PUPPY_MAX = 4;
export const AGE_MONTHS_ADULT_MIN = 12;
export const AGE_MONTHS_TOO_YOUNG_MAX = 2;
export const BODY_CONDITION_OVERWEIGHT_MIN = 7;
export const BODY_CONDITION_UNDERWEIGHT_MAX = 3;

/** C-5: comidas diarias por etapa y excepción de gato adulto activo. */
export const MEALS_PUPPY = 4;
export const MEALS_YOUNG = 3;
export const MEALS_ADULT = 2;
export const MEALS_ADULT_CAT_HIGH_ACTIVITY = 3;

/** C-6: horarios locales fijos, no repartidos algorítmicamente. */
export const MEAL_TIMES_BY_COUNT: Readonly<
  Record<2 | 3 | 4, readonly string[]>
> = {
  2: ['07:30', '19:30'],
  3: ['07:30', '14:00', '19:30'],
  4: ['07:00', '11:00', '15:00', '19:00'],
};

/** C-7: orden clínico estable y mensajes persistidos con cada plan. */
export const NUTRITION_WARNING_ORDER: readonly NutritionWarningCode[] = [
  'weight_loss_plan',
  'underweight_vet',
  'chronic_disease_vet',
  'check_food_allergens',
  'too_young_vet',
];

export const NUTRITION_WARNING_MESSAGES: Readonly<
  Record<NutritionWarningCode, string>
> = {
  weight_loss_plan:
    'La condición corporal indicada está por encima del rango ideal. Revisa con tu veterinario el peso objetivo y el ritmo de pérdida antes de ajustar la ración.',
  underweight_vet:
    'La condición corporal indicada está por debajo del rango ideal. Consulta a tu veterinario antes de cambiar la alimentación: un peso bajo puede tener causas que este plan no evalúa.',
  chronic_disease_vet: 'Plan general; tu veterinario debe ajustarlo.',
  check_food_allergens:
    'Registraste alergias alimentarias. Revisa la etiqueta del alimento y confirma con tu veterinario que ninguno de sus ingredientes está en esa lista.',
  too_young_vet:
    'Es una mascota de menos de 2 meses. A esta edad la alimentación la debe indicar tu veterinario; este plan no sustituye esa indicación.',
};

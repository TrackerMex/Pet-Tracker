import type {
  NutritionEngineInput,
  NutritionPlanResult,
} from '@/modules/nutrition/domain/nutrition-engine';

/** Producto, 2026-08-18 (plan 009 §Paso 3). Cambiarlo es decisión del humano, no del implementador. */
export const NUTRITION_AI_SYSTEM_PROMPT =
  'Eres el asistente de nutrición de Pet Tracker. Explica planes de alimentación de mascotas en español sencillo y cálido. Nunca des diagnósticos, nunca contradigas al veterinario, incluye siempre que es orientativo. Máximo 180 palabras.';

export const NUTRITION_AI_SCOPE = 'nutrition-ai';
export const NUTRITION_AI_MAX_LIST_ITEMS = 20;
export const NUTRITION_AI_MAX_ITEM_CHARS = 100;

export function buildUserPrompt(
  input: NutritionEngineInput,
  result: NutritionPlanResult,
): string {
  return JSON.stringify({
    input: {
      species: input.species,
      weightKg: input.weightKg,
      targetWeightKg: input.targetWeightKg,
      ageMonths: input.ageMonths,
      sterilized: input.sterilized,
      activityLevel: input.activityLevel,
      bodyCondition: input.bodyCondition,
      kcalPer100g: input.kcalPer100g,
      allergies: boundedList(input.allergies),
      diseases: boundedList(input.diseases),
    },
    result: {
      rerKcal: result.rerKcal,
      merKcal: result.merKcal,
      dailyGrams: result.dailyGrams,
      mealsPerDay: result.mealsPerDay,
      mealTimes: result.mealTimes,
      objective: result.objective,
      warnings: result.warnings,
    },
  });
}

function boundedList(values: string[]): string[] {
  return values
    .slice(0, NUTRITION_AI_MAX_LIST_ITEMS)
    .map((value) => value.slice(0, NUTRITION_AI_MAX_ITEM_CHARS));
}

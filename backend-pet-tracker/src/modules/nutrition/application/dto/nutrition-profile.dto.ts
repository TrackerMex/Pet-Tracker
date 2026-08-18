import { z } from 'zod';

export const KCAL_PER_100G_MIN = 80;
export const KCAL_PER_100G_MAX = 600;

export const UpsertNutritionProfileSchema = z.strictObject({
  activityLevel: z.enum(['low', 'medium', 'high']),
  bodyCondition: z.number().int().min(1).max(9).optional(),
  targetWeightKg: z.number().gt(0).max(999.99).optional(),
  foodType: z.enum(['dry', 'wet', 'mixed', 'homemade']),
  kcalPer100g: z.number().min(KCAL_PER_100G_MIN).max(KCAL_PER_100G_MAX),
  allergies: z.array(z.string()).default([]),
  diseases: z.array(z.string()).default([]),
});

export type UpsertNutritionProfileDto = z.infer<
  typeof UpsertNutritionProfileSchema
>;

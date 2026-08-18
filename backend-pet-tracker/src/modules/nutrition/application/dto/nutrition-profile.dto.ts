import { z } from 'zod';

export const UpsertNutritionProfileSchema = z.object({
  activityLevel: z.enum(['low', 'medium', 'high']),
  bodyCondition: z.number().optional(),
  targetWeightKg: z.number().optional(),
  foodType: z.enum(['dry', 'wet', 'mixed', 'homemade']),
  kcalPer100g: z.number(),
  allergies: z.array(z.string()).default([]),
  diseases: z.array(z.string()).default([]),
});

export type UpsertNutritionProfileDto = z.infer<
  typeof UpsertNutritionProfileSchema
>;

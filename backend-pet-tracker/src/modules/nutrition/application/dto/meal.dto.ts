import { z } from 'zod';

export const MEAL_TIME_PATTERN = /^\d{2}:\d{2}$/;

export const ServeMealSchema = z.strictObject({
  mealTime: z.string().regex(MEAL_TIME_PATTERN, 'mealTime must be HH:MM'),
});

export type ServeMealDto = z.infer<typeof ServeMealSchema>;

export const STRICT_MEAL_TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;
export const EditMealTimeSchema = z.strictObject({
  mealTime: z
    .string()
    .regex(STRICT_MEAL_TIME_PATTERN, 'mealTime must be a valid HH:MM time'),
});
export type EditMealTimeDto = z.infer<typeof EditMealTimeSchema>;

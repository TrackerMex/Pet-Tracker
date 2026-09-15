import { z } from 'zod';

export const MEAL_TIME_PATTERN = /^\d{2}:\d{2}$/;

export const ServeMealSchema = z.strictObject({
  mealTime: z.string().regex(MEAL_TIME_PATTERN, 'mealTime must be HH:MM'),
});

export type ServeMealDto = z.infer<typeof ServeMealSchema>;

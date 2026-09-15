import { z } from 'zod';

export const MEAL_TIME_PATTERN = /^\d{2}:\d{2}$/;

export const ServeMealSchema = z.object({
  mealTime: z.string(),
});

export type ServeMealDto = z.infer<typeof ServeMealSchema>;

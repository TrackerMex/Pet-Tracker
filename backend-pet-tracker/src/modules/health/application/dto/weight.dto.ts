import { z } from 'zod';
import { IsoDateSchema } from './iso-date';

export const WEIGHTS_DEFAULT_LIMIT = 50;
export const WEIGHTS_MAX_LIMIT = 100;
export const MEASURED_AT_MAX_FUTURE_DAYS = 1;

export const CreateWeightSchema = z.strictObject({
  weightKg: z.number(),
  measuredAt: IsoDateSchema,
  bodyCondition: z.number().optional(),
});

export const ListWeightsQuerySchema = z.strictObject({
  limit: z.coerce
    .number()
    .int()
    .min(1)
    .max(WEIGHTS_MAX_LIMIT)
    .default(WEIGHTS_DEFAULT_LIMIT),
});

export type CreateWeightDto = z.infer<typeof CreateWeightSchema>;
export type ListWeightsQueryDto = z.infer<typeof ListWeightsQuerySchema>;

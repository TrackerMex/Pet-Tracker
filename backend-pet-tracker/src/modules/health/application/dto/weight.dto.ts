import { z } from 'zod';
import { IsoDateSchema, todayIsoDateUtc } from './iso-date';

export const WEIGHTS_DEFAULT_LIMIT = 50;
export const WEIGHTS_MAX_LIMIT = 100;
export const MEASURED_AT_MAX_FUTURE_DAYS = 1;

export const CreateWeightSchema = z.strictObject({
  weightKg: z.number().gt(0).lte(999.99),
  measuredAt: IsoDateSchema.refine(
    (date) => date <= maxMeasuredAtIsoDate(),
    'measuredAt is too far in the future',
  ),
  bodyCondition: z.number().int().min(1).max(9).optional(),
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

function maxMeasuredAtIsoDate(): string {
  const date = new Date(`${todayIsoDateUtc()}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + MEASURED_AT_MAX_FUTURE_DAYS);
  return date.toISOString().slice(0, 10);
}

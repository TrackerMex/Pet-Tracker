import { z } from 'zod';
import { IsoDateSchema, todayIsoDateUtc } from './iso-date';

const NonEmptyText = (max: number) => z.string().trim().min(1).max(max);

export const VaccineSpeciesSchema = z.enum(['dog', 'cat']);

export const CreateVaccineSchema = z
  .object({
    catalogId: z.uuid().optional(),
    name: NonEmptyText(120).optional(),
    appliedAt: IsoDateSchema.refine(
      (date) => date <= todayIsoDateUtc(),
      'Applied date cannot be in the future',
    ),
    nextDoseAt: IsoDateSchema.optional(),
    vetName: NonEmptyText(120).optional(),
    clinic: NonEmptyText(120).optional(),
    notes: NonEmptyText(2000).optional(),
  })
  .strict()
  .refine((body) => Boolean(body.catalogId) !== Boolean(body.name), {
    message: 'Provide exactly one of catalogId or name',
  });

export const UpdateVaccineSchema = z
  .object({
    name: NonEmptyText(120).optional(),
    appliedAt: IsoDateSchema.refine(
      (date) => date <= todayIsoDateUtc(),
      'Applied date cannot be in the future',
    ).optional(),
    nextDoseAt: IsoDateSchema.nullable().optional(),
    vetName: NonEmptyText(120).nullable().optional(),
    clinic: NonEmptyText(120).nullable().optional(),
    notes: NonEmptyText(2000).nullable().optional(),
  })
  .strict();

export type CreateVaccineDto = z.infer<typeof CreateVaccineSchema>;
export type UpdateVaccineDto = z.infer<typeof UpdateVaccineSchema>;

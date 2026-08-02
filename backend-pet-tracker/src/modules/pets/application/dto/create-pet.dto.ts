import { z } from 'zod';

const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

/** `YYYY-MM-DD` real del calendario y no posterior a hoy (UTC) — R4. */
const BirthDateSchema = z
  .string()
  .regex(ISO_DATE_PATTERN, 'Expected an ISO date (YYYY-MM-DD)')
  .refine(isRealCalendarDate, { message: 'Invalid calendar date' })
  .refine((value) => value <= todayIsoDateUtc(), {
    message: 'birthDate cannot be in the future',
  });

/**
 * Campos de la ficha de mascota compartidos por POST (create) y PATCH
 * (update). Limites de R4: name 1-120, approxAgeMonths entero 0-480,
 * weightKg (0, 999.99] (tope de numeric(5,2)), microchip <= 32 — el numero
 * de chip veterinario de identificacion, sin relacion con el collar GPS
 * (#7/#8).
 */
export const PetFieldsSchema = z.object({
  name: z.string().trim().min(1).max(120),
  species: z.enum(['dog', 'cat']),
  breed: z.string().trim().min(1).max(120).optional(),
  birthDate: BirthDateSchema.optional(),
  approxAgeMonths: z.number().int().min(0).max(480).optional(),
  sex: z.enum(['male', 'female']).optional(),
  weightKg: z.number().gt(0).lte(999.99).optional(),
  size: z.enum(['small', 'medium', 'large']).optional(),
  color: z.string().trim().min(1).max(60).optional(),
  sterilized: z.boolean().optional(),
  microchip: z.string().trim().min(1).max(32).optional(),
});

/**
 * POST /v1/pets (R4, R5): obligatorios solo `name`, `species` y exactamente
 * uno de `birthDate` | `approxAgeMonths` (brief §7: "fecha de nacimiento o
 * edad aproximada").
 */
export const CreatePetSchema = PetFieldsSchema.superRefine((data, ctx) => {
  const hasBirthDate = data.birthDate !== undefined;
  const hasApproxAge = data.approxAgeMonths !== undefined;

  if (hasBirthDate === hasApproxAge) {
    ctx.addIssue({
      code: 'custom',
      path: ['birthDate'],
      message: 'Exactly one of birthDate or approxAgeMonths is required',
    });
  }
});

export type CreatePetDto = z.infer<typeof CreatePetSchema>;

function isRealCalendarDate(value: string): boolean {
  const [year, month, day] = value.split('-').map(Number);
  const parsed = new Date(Date.UTC(year, month - 1, day));

  return (
    parsed.getUTCFullYear() === year &&
    parsed.getUTCMonth() === month - 1 &&
    parsed.getUTCDate() === day
  );
}

function todayIsoDateUtc(): string {
  return new Date().toISOString().slice(0, 10);
}

import { z } from 'zod';

/**
 * Query string de `GET /v1/pets/:petId/activity/daily` (R17). Mismas reglas
 * que ListTripsQuerySchema: `strictObject` y fechas de calendario cuyo
 * formato valida el dominio para poder responder con `code`.
 */
export const GetDailyActivityQuerySchema = z.strictObject({
  from: z.string().optional(),
  to: z.string().optional(),
});

export type GetDailyActivityQueryDto = z.infer<
  typeof GetDailyActivityQuerySchema
>;

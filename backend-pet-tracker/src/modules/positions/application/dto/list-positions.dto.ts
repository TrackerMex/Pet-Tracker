import { z } from 'zod';

/**
 * Query string de `GET /v1/pets/:petId/positions` (R7). `z.strictObject` es
 * el `.strict()` de zod v4: un parametro desconocido es 400 en vez de
 * ignorarse en silencio — el cliente se entera de que su `?limit=` no hace
 * nada (D4 dejo el tamaño de pagina fijo).
 *
 * `from`/`to` exigen instante ISO-8601 completo (`2026-08-02T08:00:00.000Z`);
 * epoch ms no se acepta a proposito (ambiguo segundos/milisegundos).
 */
export const ListPositionsQuerySchema = z.strictObject({
  from: z.iso.datetime({ offset: true }).optional(),
  to: z.iso.datetime({ offset: true }).optional(),
  cursor: z.string().min(1).optional(),
  includeSuspect: z.enum(['true', 'false']).optional(),
});

export type ListPositionsQueryDto = z.infer<typeof ListPositionsQuerySchema>;

import { z } from 'zod';

/**
 * Query string de `GET /v1/alerts` (R17). `z.strictObject` es el `.strict()`
 * de zod v4: un parametro desconocido es 400 en vez de ignorarse en silencio
 * — el cliente se entera de que su `?limit=` no hace nada (R18 dejo el tamaño
 * de pagina fijo en `ALERTS_PAGE_SIZE`).
 */
export const ListAlertsQuerySchema = z.strictObject({
  status: z.enum(['open', 'acked', 'closed']).optional(),
  cursor: z.string().min(1).optional(),
});

export type ListAlertsQueryDto = z.infer<typeof ListAlertsQuerySchema>;

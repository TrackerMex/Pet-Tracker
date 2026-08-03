import { z } from 'zod';

/**
 * Query string de `GET /v1/pets/:petId/trips` y `.../trips/:n` (R17).
 * `z.strictObject` es el `.strict()` de zod v4: un parametro desconocido es
 * 400 en vez de ignorarse en silencio (precedente R7 de #9).
 *
 * `date` es una FECHA DE CALENDARIO 'YYYY-MM-DD', no un instante ISO-8601
 * como los `from`/`to` de #9. El formato no se valida aqui a proposito: un
 * `date` mal formado debe salir como 400 con `code: 'INVALID_DATE'`, y eso
 * lo produce el error de dominio, no el 400 generico de zod.
 */
export const ListTripsQuerySchema = z.strictObject({
  date: z.string().optional(),
});

export type ListTripsQueryDto = z.infer<typeof ListTripsQuerySchema>;

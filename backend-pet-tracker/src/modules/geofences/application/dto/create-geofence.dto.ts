import { z } from 'zod';

/**
 * Campos de geocerca compartidos por POST (create) y PATCH (update) — limites
 * de R5 inline (mismo estilo que PetFieldsSchema: sin constantes nombradas
 * para bounds de DTO que solo el propio schema consume): name 1-120,
 * centerLat [-90,90], centerLng [-180,180], radiusM [20,2000].
 */
export const GeofenceFieldsSchema = z.object({
  name: z.string().trim().min(1).max(120),
  centerLat: z.number().min(-90).max(90),
  centerLng: z.number().min(-180).max(180),
  radiusM: z.number().min(20).max(2000),
  active: z.boolean().optional(),
});

/**
 * POST /v1/pets/:petId/geofences (R4, R5): el CRUD MVP solo produce
 * `safe_circle` (D1) — cualquier otro `type` (incluido `safe_polygon`) cae
 * en el 400 generico de validacion, sin codigo de error dedicado.
 * `.strict()` rechaza claves desconocidas (mismo criterio que R17 de
 * trips-activity).
 */
export const CreateGeofenceSchema = GeofenceFieldsSchema.extend({
  type: z.literal('safe_circle'),
}).strict();

export type CreateGeofenceDto = z.infer<typeof CreateGeofenceSchema>;

/**
 * PATCH /v1/pets/:petId/geofences/:geofenceId (R10, R11, R13): todos los
 * campos opcionales, sin `type` — `.strict()` lo rechaza como clave
 * desconocida (la forma de una geocerca no se migra por PATCH, R11). Un
 * body vacio (u objeto sin las claves reconocidas) valida: es el no-op de R13.
 */
export const UpdateGeofenceSchema = GeofenceFieldsSchema.partial().strict();

export type UpdateGeofenceDto = z.infer<typeof UpdateGeofenceSchema>;

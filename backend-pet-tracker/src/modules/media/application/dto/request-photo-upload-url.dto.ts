import { z } from 'zod';

/**
 * POST /v1/pets/:petId/photo-upload-url (R1, R2): contentType exige
 * exactamente uno de los 3 tipos de imagen soportados. D3: esta validacion
 * es solo sobre el body del POST — no se fija ContentType en la firma del
 * PUT (ver requirements.md).
 */
export const RequestPhotoUploadUrlSchema = z.object({
  contentType: z.enum(['image/jpeg', 'image/png', 'image/webp']),
});

export type RequestPhotoUploadUrlDto = z.infer<
  typeof RequestPhotoUploadUrlSchema
>;

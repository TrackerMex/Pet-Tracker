import { z } from 'zod';

/**
 * Formato documentado de un token de Expo Push (R4). Un token con otra forma
 * jamas podria entregarse y solo ensuciaria la tabla, asi que es 400 y no una
 * fila muerta en `push_tokens`.
 */
export const EXPO_TOKEN_PATTERN = /^Expo(nent)?PushToken\[[^\]]+\]$/;

/**
 * Body de `POST /v1/me/push-tokens` (R4). `z.strictObject` es el `.strict()`
 * de zod v4, mismo criterio que `ListPositionsQuerySchema` de #9: una clave
 * desconocida es 400 en vez de ignorarse en silencio.
 */
export const RegisterPushTokenSchema = z.strictObject({
  expoToken: z.string().regex(EXPO_TOKEN_PATTERN),
  platform: z.enum(['ios', 'android']),
});

export type RegisterPushTokenDto = z.infer<typeof RegisterPushTokenSchema>;

/** Body de `DELETE /v1/me/push-tokens` (R5): el mismo sin `platform`. */
export const DeletePushTokenSchema = RegisterPushTokenSchema.pick({
  expoToken: true,
});

export type DeletePushTokenDto = z.infer<typeof DeletePushTokenSchema>;

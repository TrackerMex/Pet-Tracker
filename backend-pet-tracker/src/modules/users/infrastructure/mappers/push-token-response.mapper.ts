import type { PushTokenRow } from '@/modules/users/domain/repositories/push-token.repository';

/** Body de `POST /v1/me/push-tokens` (R3): exactamente estas cuatro claves. */
export interface PushTokenResponse {
  id: string;
  platform: string;
  createdAt: string;
  lastSeenAt: string;
}

/**
 * Lista explicita de campos permitidos. R13: `expoToken` y `userId` quedan
 * FUERA — el cliente ya conoce su token y devolverlo solo multiplicaria los
 * sitios donde puede filtrarse.
 */
export function toPushTokenResponse(row: PushTokenRow): PushTokenResponse {
  return {
    id: row.id,
    platform: row.platform,
    createdAt: row.createdAt.toISOString(),
    lastSeenAt: row.lastSeenAt.toISOString(),
  };
}

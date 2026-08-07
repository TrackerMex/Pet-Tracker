export const PUSH_TOKEN_REPOSITORY = Symbol('PushTokenRepository');

/** Las dos unicas plataformas que Expo Push soporta hoy (R1/R4, D5). */
export type PushPlatform = 'ios' | 'android';

/**
 * Fila de `push_tokens` tal como sale del repositorio. **No lleva
 * `expoToken`**: el token nunca vuelve al cliente (R13) y el unico consumidor
 * que lo necesita en claro es el notifier, que lo pide por separado
 * (`findActiveMembersTokens`).
 */
export interface PushTokenRow {
  id: string;
  platform: PushPlatform;
  createdAt: Date;
  lastSeenAt: Date;
}

export interface UpsertPushTokenInput {
  userId: string;
  expoToken: string;
  platform: PushPlatform;
  lastSeenAt: Date;
}

/**
 * Puerto unico sobre `push_tokens`, compartido por los endpoints de
 * `/v1/me/push-tokens` (R3-R6) y por el worker notifier (R8, R12) — un puerto
 * en vez de dos evita duplicar el contrato de la misma tabla. Nada aqui es
 * contrato cerrado por otra spec: lo crea esta misma feature.
 */
export interface PushTokenRepository {
  /**
   * `INSERT ... ON CONFLICT (expo_token) DO UPDATE` (R3): conserva `id` y
   * `created_at`, y actualiza `user_id`, `platform` y `last_seen_at`. Un token
   * registrado por otro usuario se **reasigna** (D5-iv), no da 409.
   */
  upsert(input: UpsertPushTokenInput): Promise<PushTokenRow>;

  /**
   * Borra la fila solo si es del usuario (R5). No informa cuantas filas
   * afecto a proposito: el 204 no debe filtrar la existencia de tokens ajenos.
   */
  deleteOwnedByUser(userId: string, expoToken: string): Promise<void>;

  /**
   * Tokens de TODOS los miembros con `pet_users.status = 'active'` de la
   * mascota, sin distincion de `role` (R8, plan 007: "MVP: todos los miembros").
   */
  findActiveMembersTokens(petId: string): Promise<string[]>;

  /** Borra la fila de ese token, sea de quien sea (R12: DeviceNotRegistered). */
  deleteByToken(expoToken: string): Promise<void>;
}

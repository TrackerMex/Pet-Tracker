export const PASSWORD_HASHER = Symbol('PasswordHasher');

/**
 * Puerto de hashing de passwords: mantiene el algoritmo concreto (argon2id,
 * ver infrastructure/security/) fuera del dominio y de los casos de uso.
 */
export interface PasswordHasher {
  hash(plainPassword: string): Promise<string>;
}

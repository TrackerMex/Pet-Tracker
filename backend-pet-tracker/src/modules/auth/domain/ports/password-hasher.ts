export const PASSWORD_HASHER = Symbol('PasswordHasher');

/**
 * Puerto de hashing de passwords: mantiene el algoritmo concreto (argon2id,
 * ver infrastructure/security/) fuera del dominio y de los casos de uso.
 */
export interface PasswordHasher {
  hash(plainPassword: string): Promise<string>;
  /**
   * Compara un password en claro contra un hash PHC almacenado (login R1/R2
   * de auth-login-me). La comparacion en tiempo constante y la validacion de
   * los parametros del hash quedan del lado del adaptador concreto.
   */
  verify(plainPassword: string, hash: string): Promise<boolean>;
}

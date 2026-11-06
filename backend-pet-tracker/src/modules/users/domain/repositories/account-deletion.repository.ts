export const ACCOUNT_DELETION_REPOSITORY = Symbol('AccountDeletionRepository');
export interface AccountDeletionRepository {
  /** Borra la cuenta y sus mascotas propias en una transacción; devuelve los ids de mascota borrados. */
  deleteAccount(userId: string): Promise<string[]>;
}

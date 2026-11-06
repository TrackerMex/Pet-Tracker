export const PET_DATA_PURGER = Symbol('PetDataPurger');
/** Borra los datos de una mascota fuera de Postgres. Best effort: nunca rechaza; los fallos van al log. */
export interface PetDataPurger {
  purge(petIds: readonly string[]): Promise<void>;
}

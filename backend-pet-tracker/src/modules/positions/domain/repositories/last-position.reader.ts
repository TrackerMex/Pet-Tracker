export const LAST_POSITION_READER = Symbol('LastPositionReader');

/**
 * Puerto de lectura de la cache `pets.last_position` (R3, R5). Devuelve el
 * jsonb **crudo**: la columna la tipa `unknown` la entidad `Pet` de #5, y
 * decidir que un jsonb corrupto degrada a "sin posicion" es regla de negocio
 * del caso de uso, no del adaptador.
 *
 * No se extiende `PetRepository`: su contrato lo cerro la spec aprobada de
 * #5 y el consumidor es otro (mismo criterio que `IngestionStore` en #8).
 */
export interface LastPositionReader {
  /** `null` si la mascota no existe o su cache esta vacia. */
  findLastPosition(petId: string): Promise<unknown>;
}

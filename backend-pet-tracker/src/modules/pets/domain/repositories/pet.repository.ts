import { Pet, PetSex, PetSize, PetSpecies } from '../entities/pet.entity';

export const PET_REPOSITORY = Symbol('PetRepository');

/** Datos de alta ya validados por el DTO (R4/R5); el id lo genera el repo. */
export interface NewPet {
  name: string;
  species: PetSpecies;
  breed?: string;
  birthDate?: string;
  approxAgeMonths?: number;
  sex?: PetSex;
  currentWeightKg?: number;
  size?: PetSize;
  color?: string;
  sterilized?: boolean;
  microchip?: string;
}

export interface PetRepository {
  /**
   * Inserta la fila `pets` y su membresia owner (`pet_users`) en una unica
   * transaccion de Postgres (R2): si cualquiera de los dos inserts falla,
   * ninguno persiste.
   */
  createWithOwner(data: NewPet, ownerId: string): Promise<Pet>;
}

import { Pet, PetSex, PetSize, PetSpecies } from '../entities/pet.entity';
import { PetMembership, PetRole } from '../entities/pet-membership';

export const PET_REPOSITORY = Symbol('PetRepository');

/** Mascota + rol del usuario consultante en ella (R7: myRole). */
export interface PetWithRole {
  pet: Pet;
  role: PetRole;
}

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

  /**
   * Mascotas con membresia `status = 'active'` del usuario (R7), cada una
   * con el `role` de esa membresia.
   */
  findAllByMember(userId: string): Promise<PetWithRole[]>;

  /**
   * Fila de `pet_users` para (petId, userId), cualquiera sea su status —
   * la unica consulta del PetAccessGuard (R9): sin fila, "no existe" y
   * "no eres miembro" son indistinguibles por diseño.
   */
  findMembership(petId: string, userId: string): Promise<PetMembership | null>;

  findById(petId: string): Promise<Pet | null>;

  /**
   * Actualiza solo las claves presentes en `changes` y refresca
   * `updated_at` (R13). `birthDate`/`approxAgeMonths` admiten `null`
   * explicito: persistir uno anula el otro (R14).
   */
  update(petId: string, changes: PetFieldChanges): Promise<Pet>;

  /**
   * Borra la fila de `pets` (R16); las membresias caen por el ON DELETE
   * CASCADE de `pet_users` (R1).
   */
  delete(petId: string): Promise<void>;
}

/** Subconjunto editable de la ficha (R13); claves ausentes no se tocan. */
export interface PetFieldChanges {
  name?: string;
  species?: PetSpecies;
  breed?: string;
  birthDate?: string | null;
  approxAgeMonths?: number | null;
  sex?: PetSex;
  currentWeightKg?: number;
  size?: PetSize;
  color?: string;
  sterilized?: boolean;
  microchip?: string;
  /** pet-photos-s3 (#6) R1: clave S3 generada al pedir la URL de subida. */
  photoKey?: string;
}

import { Geofence, GeofenceType } from '../entities/geofence.entity';

export const GEOFENCE_REPOSITORY = Symbol('GeofenceRepository');

/** Datos de alta ya validados por el DTO (R4/R5); el id lo genera el repo. */
export interface NewGeofence {
  petId: string;
  name: string;
  type: GeofenceType;
  centerLat: number;
  centerLng: number;
  radiusM: number;
  active: boolean;
}

/**
 * Subconjunto editable (R10); claves ausentes no se tocan.
 * `centerLat`/`centerLng`/`radiusM` viajan juntos porque comparten el jsonb
 * `geometry`: si el use case cambia cualquiera de los tres, resuelve el
 * geometry completo (mergeado contra el existente) antes de llamar update().
 */
export interface GeofenceFieldChanges {
  name?: string;
  active?: boolean;
  centerLat?: number;
  centerLng?: number;
  radiusM?: number;
}

export interface GeofenceRepository {
  /** Filas (activas e inactivas) de la mascota — sirve al tope de R6. */
  countByPet(petId: string): Promise<number>;

  /** Fila con ese nombre para esa mascota, o null (R7). */
  findByNameAndPet(petId: string, name: string): Promise<Geofence | null>;

  /**
   * Inserta la fila con `geofence_state` en el default `{unknown, null}`
   * (D2, un unico INSERT). IF el indice unico (pet_id, name) rechaza la
   * carrera (23505) THEN traduce a GeofenceNameTakenError (R7).
   */
  create(data: NewGeofence): Promise<Geofence>;

  /** Todas las geocercas de la mascota ordenadas por created_at asc (R8). */
  findAllByPet(petId: string): Promise<Geofence[]>;

  /** Geocerca de esa mascota por id, o null si no existe o es de otra (R9). */
  findByIdAndPet(id: string, petId: string): Promise<Geofence | null>;

  /** Actualiza solo las claves presentes en `changes` y refresca `updated_at` (R10). */
  update(id: string, changes: GeofenceFieldChanges): Promise<Geofence>;

  /** Hard delete (R14): nada referencia todavia a `geofences`. */
  delete(id: string): Promise<void>;
}

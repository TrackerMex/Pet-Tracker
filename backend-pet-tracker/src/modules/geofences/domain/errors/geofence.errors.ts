// Errores de dominio de geofences-crud. Sin imports de @nestjs/common (regla
// de docs/conventions.md); el controller los mapea a HTTP segun la tabla de
// specs/geofences-crud/design.md.

/** La mascota ya tiene GEOFENCE_MAX_PER_PET filas (R6) — 400 MAX_GEOFENCES_REACHED. */
export class MaxGeofencesReachedError extends Error {
  constructor(petId: string) {
    super(`Pet ${petId} already has the maximum number of geofences`);
    this.name = 'MaxGeofencesReachedError';
  }
}

/**
 * Ya existe una geocerca con el mismo nombre para la misma mascota (R7) — 409
 * GEOFENCE_NAME_TAKEN. Tambien la produce el repositorio al traducir la
 * violacion 23505 del indice unico (pet_id, name) en la carrera de creaciones.
 */
export class GeofenceNameTakenError extends Error {
  constructor(petId: string, name: string) {
    super(`Geofence name "${name}" already exists for pet ${petId}`);
    this.name = 'GeofenceNameTakenError';
  }
}

/**
 * `:geofenceId` no existe, es sintacticamente invalido o pertenece a otra
 * mascota (R9, R12, R15) — 404 GEOFENCE_NOT_FOUND.
 */
export class GeofenceNotFoundError extends Error {
  constructor(geofenceId: string) {
    super(`Geofence ${geofenceId} not found`);
    this.name = 'GeofenceNotFoundError';
  }
}

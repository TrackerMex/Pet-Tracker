// Errores de dominio de devices-claim. Sin imports de @nestjs/common
// (regla de docs/conventions.md); el controller los mapea a HTTP segun la
// tabla de specs/devices-claim/design.md.

/**
 * Mascota inexistente o sin membresia activa del actor (R5): el controller
 * lo traduce al MISMO 404 generico que emite PetAccessGuard — imposible
 * inferir existencia de la mascota ni del device.
 */
export class PetNotAccessibleError extends Error {
  constructor(petId: string) {
    super(`Pet ${petId} not accessible`);
    this.name = 'PetNotAccessibleError';
  }
}

/** Membresia activa confirmada pero rol distinto de owner (R6) — 403. */
export class InsufficientPetRoleError extends Error {
  constructor(petId: string) {
    super(`Insufficient role on pet ${petId}`);
    this.name = 'InsufficientPetRoleError';
  }
}

/** Ningun device matchea el identificador enviado (R7) — 404 DEVICE_NOT_FOUND. */
export class DeviceNotFoundError extends Error {
  constructor() {
    super('Device not found');
    this.name = 'DeviceNotFoundError';
  }
}

/**
 * Device con fila activa en pet_devices o status 'inactive' (R8) — 409
 * DEVICE_ALREADY_ASSIGNED. Tambien lo produce el repositorio al traducir la
 * violacion 23505 del indice unico parcial en la carrera de claims.
 */
export class DeviceAlreadyAssignedError extends Error {
  constructor(deviceId: string) {
    super(`Device ${deviceId} is not claimable`);
    this.name = 'DeviceAlreadyAssignedError';
  }
}

/** La mascota ya lleva un collar activo (R9, decision D2) — 409. */
export class PetAlreadyHasDeviceError extends Error {
  constructor(petId: string) {
    super(`Pet ${petId} already has an active device`);
    this.name = 'PetAlreadyHasDeviceError';
  }
}

/** DELETE sin collar activo para la mascota (R14) — 404 DEVICE_NOT_ASSIGNED. */
export class DeviceNotAssignedError extends Error {
  constructor(petId: string) {
    super(`Pet ${petId} has no active device`);
    this.name = 'DeviceNotAssignedError';
  }
}

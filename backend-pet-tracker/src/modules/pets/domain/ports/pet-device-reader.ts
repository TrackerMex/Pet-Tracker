export const PET_DEVICE_READER = Symbol('PetDeviceReader');

/**
 * Collar activo tal como el perfil lo necesita (devices-claim R12) —
 * tipos puros, sin dependencia del modulo devices.
 */
export interface ActivePetDeviceStatus {
  model: string | null;
  batteryPct: number | null;
  connectivity: string | null;
  lastMessageAt: Date | null;
  esn: string | null;
}

/**
 * Puerto de pets hacia el collar activo (devices-claim R12): "dame el
 * device activo de esta mascota o null". Pets es dueño de su necesidad; la
 * implementacion vive en modules/devices/ y llega via PetDeviceReadModule —
 * el sub-modulo sin dependencias de pets que rompe el ciclo
 * DevicesModule -> PetsModule (misma filosofia que llevo AuditLogger a
 * src/audit/).
 */
export interface PetDeviceReader {
  findActiveDevice(petId: string): Promise<ActivePetDeviceStatus | null>;
}

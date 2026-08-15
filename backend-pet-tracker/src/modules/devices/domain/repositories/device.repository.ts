import { Device } from '../entities/device.entity';

export const DEVICE_REPOSITORY = Symbol('DeviceRepository');

/**
 * Columnas UNIQUE de `devices` por las que el repositorio puede buscar. Son
 * capacidad interna; POST /v1/devices/claim solo acepta activationCode como
 * credencial (claim-activation-code-only #26, R1).
 */
export type DeviceIdentifierField =
  'esn' | 'imei' | 'serialNumber' | 'activationCode';

/** Identificador con el que se busca la fila de devices. */
export interface DeviceIdentifier {
  field: DeviceIdentifierField;
  value: string;
}

/** Fila activa de pet_devices (released_at IS NULL) con su device. */
export interface ActivePetDevice {
  assignmentId: string;
  device: Device;
}

export interface DeviceRepository {
  /** Busca por la columna UNIQUE del identificador (R7); null si no hay match. */
  findByIdentifier(identifier: DeviceIdentifier): Promise<Device | null>;

  /**
   * true si existe fila de pet_devices con ese device y released_at IS NULL
   * (R8) — la fuente de verdad de disponibilidad, decision D3.
   */
  hasActiveAssignment(deviceId: string): Promise<boolean>;

  /** Collar activo de la mascota o null (R9, R11, R13). */
  findActiveByPetId(petId: string): Promise<ActivePetDevice | null>;

  /**
   * Transaccion de claim (R3): INSERT pet_devices activo + UPDATE devices a
   * status 'assigned' con ingest_watermark. Si el indice unico parcial
   * rechaza el INSERT (carrera, 23505) traduce a DeviceAlreadyAssignedError
   * o PetAlreadyHasDeviceError segun el indice violado — nunca un 500 (R8).
   */
  claim(deviceId: string, petId: string, ingestWatermark: Date): Promise<void>;

  /**
   * Transaccion de release (R13): UPDATE released_at = now() de la fila
   * activa + UPDATE devices a status 'available'.
   */
  release(assignmentId: string, deviceId: string): Promise<void>;
}

import { Device } from '../entities/device.entity';

export const DEVICE_REPOSITORY = Symbol('DeviceRepository');

/**
 * Columnas por las que el claim puede buscar un device (R4/R7). Las cuatro
 * son UNIQUE en `devices` (decision D4): un identificador matchea a lo sumo
 * una fila, sin regla de desambiguacion.
 */
export const DEVICE_IDENTIFIER_FIELDS = [
  'esn',
  'imei',
  'serialNumber',
  'activationCode',
] as const;

export type DeviceIdentifierField = (typeof DEVICE_IDENTIFIER_FIELDS)[number];

/** El unico identificador presente en el body del claim (XOR de R4). */
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

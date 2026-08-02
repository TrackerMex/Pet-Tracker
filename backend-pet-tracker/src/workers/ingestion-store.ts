// Puerto propio del worker de ingesta (D14): NO se extienden
// DeviceRepository/PetRepository — sus contratos estan cerrados por specs
// aprobadas (#5/#7) y las consultas del worker son de otro consumidor.
// Token junto a la interface (docs/conventions.md §Tokens de inyeccion).

export const INGESTION_STORE = Symbol('IngestionStore');

/** Asignacion activa collar-mascota con unidad Wialon poleable (R9). */
export interface ActiveAssignment {
  deviceId: string;
  petId: string;
  unitId: string;
  ingestWatermark: Date | null;
}

/** Telemetria cacheada en `devices` por el consumidor (R14). */
export interface DeviceTelemetryUpdate {
  batteryPct: number | null;
  lastMessageAt: Date;
}

/** Shape de `pets.last_position` (jsonb) — contrato de #5/plan 005 (R14). */
export interface PetLastPosition {
  lat: number;
  lng: number;
  ts: number;
  accuracy: number | null;
  battery: number | null;
}

export interface IngestionStore {
  /** pet_devices.released_at IS NULL join devices con wialon_unit_id (R9). */
  listActiveAssignments(): Promise<ActiveAssignment[]>;

  /** Avanza devices.ingest_watermark — solo tras publicar (R10). */
  advanceWatermark(deviceId: string, ts: Date): Promise<void>;

  /** La asignacion (deviceId, petId) sigue activa (R14/R15). */
  isAssignmentActive(deviceId: string, petId: string): Promise<boolean>;

  /** devices.battery_pct previo — flanco de battery.low (R17). */
  getDeviceBattery(deviceId: string): Promise<number | null>;

  /**
   * Actualiza devices (battery_pct, connectivity 'online', last_message_at)
   * solo si lastMessageAt es mas reciente que el cacheado — el WHERE vive en
   * la implementacion (R14).
   */
  updateDeviceTelemetry(
    deviceId: string,
    update: DeviceTelemetryUpdate,
  ): Promise<void>;

  /**
   * Actualiza pets.last_position + last_communication_at solo si el ts
   * entrante es mas reciente que el cacheado (R14).
   */
  updatePetLastPosition(
    petId: string,
    position: PetLastPosition,
    lastCommunicationAt: Date,
  ): Promise<void>;
}

export type DeviceStatus = 'available' | 'assigned' | 'inactive';

interface DeviceProps {
  id: string;
  esn: string | null;
  imei: string | null;
  serialNumber: string | null;
  activationCode: string | null;
  wialonUnitId: string | null;
  model: string | null;
  /**
   * Cache de presentacion (decision D3): la disponibilidad real se deriva
   * de la fila activa en `pet_devices` — solo `'inactive'` veta el claim
   * por si mismo (R8/R15).
   */
  status: DeviceStatus;
  /** NULL hasta que el pipeline de ingesta (#8) lo alimente. */
  batteryPct: number | null;
  /** NULL hasta que el pipeline de ingesta (#8) lo alimente. */
  connectivity: string | null;
  /** NULL hasta que el pipeline de ingesta (#8) lo alimente. */
  lastMessageAt: Date | null;
  /** Arranca en el claim como now-10min (R3); lo avanza el poller de #8. */
  ingestWatermark: Date | null;
  isSimulated: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/** Collar GPS (docs/data-model.md fila `devices`). Clase pura, sin ORM. */
export class Device {
  readonly id: string;
  readonly esn: string | null;
  readonly imei: string | null;
  readonly serialNumber: string | null;
  readonly activationCode: string | null;
  readonly wialonUnitId: string | null;
  readonly model: string | null;
  readonly status: DeviceStatus;
  readonly batteryPct: number | null;
  readonly connectivity: string | null;
  readonly lastMessageAt: Date | null;
  readonly ingestWatermark: Date | null;
  readonly isSimulated: boolean;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  constructor(props: DeviceProps) {
    this.id = props.id;
    this.esn = props.esn;
    this.imei = props.imei;
    this.serialNumber = props.serialNumber;
    this.activationCode = props.activationCode;
    this.wialonUnitId = props.wialonUnitId;
    this.model = props.model;
    this.status = props.status;
    this.batteryPct = props.batteryPct;
    this.connectivity = props.connectivity;
    this.lastMessageAt = props.lastMessageAt;
    this.ingestWatermark = props.ingestWatermark;
    this.isSimulated = props.isSimulated;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}

import { deriveConnectivity } from '@/modules/devices/domain/connectivity';

/**
 * Contrato unico de estado de device (R3, R11, R12 de devices-claim; #73 R2):
 * lo devuelven el 201 del claim, GET /v1/pets/:petId/device y la clave `device`
 * del perfil. `connectivity` NO es passthrough de la columna: se deriva en
 * lectura de `lastMessageAt` contra `now` con `deriveConnectivity` (#73 G1/G2).
 */
export interface DeviceStatusSource {
  model: string | null;
  batteryPct: number | null;
  lastMessageAt: Date | null;
  esn: string | null;
}

export interface DeviceStatusResponse {
  model: string | null;
  batteryPct: number | null;
  connectivity: string | null;
  lastMessageAt: string | null;
  esn: string | null;
}

/** Lista explicita de claves — nunca se serializa la entidad completa. */
export function toDeviceStatusResponse(
  source: DeviceStatusSource,
  now: Date,
): DeviceStatusResponse {
  return {
    model: source.model,
    batteryPct: source.batteryPct,
    connectivity: deriveConnectivity(source.lastMessageAt, now),
    lastMessageAt: source.lastMessageAt
      ? source.lastMessageAt.toISOString()
      : null,
    esn: source.esn,
  };
}

/**
 * Contrato unico de estado de device (R3, R11, R12): lo devuelven el 201
 * del claim, GET /v1/pets/:petId/device y la clave `device` del perfil.
 * Cuando el pipeline (#8) escriba battery_pct/connectivity/last_message_at,
 * apareceran aqui sin tocar nada mas.
 */
export interface DeviceStatusSource {
  model: string | null;
  batteryPct: number | null;
  connectivity: string | null;
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
): DeviceStatusResponse {
  return {
    model: source.model,
    batteryPct: source.batteryPct,
    connectivity: source.connectivity,
    lastMessageAt: source.lastMessageAt
      ? source.lastMessageAt.toISOString()
      : null,
    esn: source.esn,
  };
}

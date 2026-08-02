import { TABLE_POSITIONS_SORT_KEY } from '@/aws/constants';
import type { StoredPosition } from '@/modules/positions/domain/entities/position.entity';

/**
 * Item de la tabla `positions` -> contrato publico (R11). La lista de campos
 * es explicita y **no** hay spread del item: `received_ts`, `processed_ts` y
 * `expires_at` son internos del pipeline, y un atributo nuevo que #8 empiece
 * a escribir no llega al cliente sin una decision de por medio.
 */
export function toStoredPosition(item: Record<string, unknown>): StoredPosition {
  return {
    ts: numberOr(item[TABLE_POSITIONS_SORT_KEY], 0),
    lat: numberOr(item.lat, 0),
    lng: numberOr(item.lng, 0),
    speedKmh: numberOrNull(item.speed_kmh),
    course: numberOrNull(item.course),
    altitude: numberOrNull(item.altitude),
    sats: numberOrNull(item.sats),
    accuracyM: numberOrNull(item.accuracy_m),
    batteryPct: numberOrNull(item.battery_pct),
    flags: Array.isArray(item.flags)
      ? item.flags.filter((flag): flag is string => typeof flag === 'string')
      : [],
  };
}

function numberOr(value: unknown, fallback: number): number {
  return typeof value === 'number' ? value : Number(value ?? fallback);
}

function numberOrNull(value: unknown): number | null {
  return typeof value === 'number' ? value : null;
}

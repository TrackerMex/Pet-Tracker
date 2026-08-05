// Evaluacion pura de geocercas (#11 geofences-crud R16-R25): sin imports de
// NestJS/SDK/ORM, sin reloj y sin red — misma regla de pureza que
// trips.ts/activity.ts. Los umbrales entran por ./constants, nunca como
// literal. Ningun caso de uso de esta feature llama a evaluate(): el
// consumidor real es el worker de alerts-engine (#12).
import {
  FLAG_LOW_ACCURACY,
  GEOFENCE_ENTER_RADIUS_MULTIPLIER,
  GEOFENCE_EXIT_MAX_ACCURACY_M,
  GEOFENCE_EXIT_RADIUS_MULTIPLIER,
} from './constants';
import { haversineMeters } from './geo';
import type { ProcessedPosition } from './types';

/** Geocerca circular — unica forma que el CRUD de esta feature produce (D1). */
export interface CircleGeometry {
  shape: 'circle';
  centerLat: number;
  centerLng: number;
  radiusM: number;
}

/** Geocerca poligonal — soportada por isInside(); ningun CRUD la produce todavia (D1). */
export interface PolygonGeometry {
  shape: 'polygon';
  points: Array<{ lat: number; lng: number }>;
}

export type GeofenceGeometry = CircleGeometry | PolygonGeometry;

export type GeofenceStateValue = 'unknown' | 'inside' | 'outside';

export interface GeofenceState {
  state: GeofenceStateValue;
  updatedAt: string | null;
}

export type GeofenceEvent = 'enter' | 'exit' | null;

export interface EvaluateResult {
  state: GeofenceState;
  event: GeofenceEvent;
}

/**
 * Pertenencia de `point` a `geometry` (R16, R17). Circulo: haversine <=
 * radiusM (borde inclusive). Poligono: ray-casting (crossing number, regla
 * par-impar) sobre `points` en orden.
 */
export function isInside(
  geometry: GeofenceGeometry,
  point: { lat: number; lng: number },
): boolean {
  if (geometry.shape === 'circle') {
    return (
      haversineMeters(
        geometry.centerLat,
        geometry.centerLng,
        point.lat,
        point.lng,
      ) <= geometry.radiusM
    );
  }

  return isInsidePolygon(geometry.points, point);
}

function isInsidePolygon(
  points: Array<{ lat: number; lng: number }>,
  point: { lat: number; lng: number },
): boolean {
  let inside = false;

  for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
    const vi = points[i];
    const vj = points[j];

    const straddles = vi.lat > point.lat !== vj.lat > point.lat;
    const crossesLng =
      straddles &&
      point.lng <
        ((vj.lng - vi.lng) * (point.lat - vi.lat)) / (vj.lat - vi.lat) + vi.lng;

    if (crossesLng) {
      inside = !inside;
    }
  }

  return inside;
}

/**
 * Maquina de estados con histeresis anti-parpadeo (R18-R24): salir de una
 * geocerca circular exige alejarse mas de lo que basta para entrar
 * (GEOFENCE_EXIT_RADIUS_MULTIPLIER > GEOFENCE_ENTER_RADIUS_MULTIPLIER), y
 * `exit` exige ademas mejor accuracy que el gate general de low_accuracy
 * (D3). `nowMs` llega siempre del caller — nunca Date.now() (R25).
 */
export function evaluate(
  previous: GeofenceState,
  geometry: CircleGeometry,
  position: Pick<ProcessedPosition, 'lat' | 'lng' | 'accuracyM' | 'flags'>,
  nowMs: number,
): EvaluateResult {
  // R22: low_accuracy corto-circuita antes de leer distancia o estado previo.
  if (position.flags.includes(FLAG_LOW_ACCURACY)) {
    return { state: previous, event: null };
  }

  const updatedAt = new Date(nowMs).toISOString();

  // R18: unknown nunca emite enter/exit — primera evaluacion silenciosa.
  if (previous.state === 'unknown') {
    const inside = isInside(geometry, position);
    return {
      state: { state: inside ? 'inside' : 'outside', updatedAt },
      event: null,
    };
  }

  const distanceM = haversineMeters(
    geometry.centerLat,
    geometry.centerLng,
    position.lat,
    position.lng,
  );

  if (previous.state === 'inside') {
    const accuracyOk =
      position.accuracyM === undefined ||
      position.accuracyM <= GEOFENCE_EXIT_MAX_ACCURACY_M;

    // R19: exit exige distancia Y accuracy; R20/R21: falta cualquiera de
    // las dos condiciones y el estado se queda en inside sin evento.
    if (
      distanceM >= geometry.radiusM * GEOFENCE_EXIT_RADIUS_MULTIPLIER &&
      accuracyOk
    ) {
      return { state: { state: 'outside', updatedAt }, event: 'exit' };
    }

    return { state: { state: 'inside', updatedAt }, event: null };
  }

  // previous.state === 'outside'. R24: enter sin condicion de accuracy;
  // R23: sigue fuera del radio de entrada y no re-emite.
  if (distanceM <= geometry.radiusM * GEOFENCE_ENTER_RADIUS_MULTIPLIER) {
    return { state: { state: 'inside', updatedAt }, event: 'enter' };
  }

  return { state: { state: 'outside', updatedAt }, event: null };
}

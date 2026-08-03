// Segmentacion de paseos del nucleo puro (#10 R2-R6): sin imports de
// NestJS/SDK/ORM, sin reloj y sin red — funcion de datos a datos, igual que
// validate-positions.ts. Los umbrales entran por ./constants, nunca como
// literal (R1).
import {
  FLAG_SUSPECT_JUMP,
  TRIP_IDLE_CLOSE_MINUTES,
  TRIP_MAX_GAP_MINUTES,
  TRIP_MIN_DISTANCE_M,
  TRIP_MIN_DURATION_MINUTES,
  TRIP_MIN_MOVING_POINTS,
  TRIP_MOVING_IMPLIED_MPS,
  TRIP_MOVING_SPEED_KMH,
} from './constants';
import { haversineMeters } from './geo';
import type { ProcessedPosition } from './types';

const MS_PER_MINUTE = 60_000;

/** Punto del trazado que se devuelve al cliente (R6). */
export interface TripPoint {
  lat: number;
  lng: number;
  ts: number;
}

/** Paseo cerrado: exactamente estas cinco claves (R6). */
export interface Trip {
  startTs: number;
  endTs: number;
  distanceM: number;
  durationMin: number;
  path: TripPoint[];
}

/**
 * Clasifica cada punto como en movimiento (R2): `speedKmh` por encima del
 * umbral, o velocidad implicita contra el punto anterior por encima del
 * suyo. Un punto `suspect_jump` no evalua la rama implicita — fue marcado
 * precisamente por superar 60 km/h implicitos y usarlo como prueba de
 * movimiento seria circular.
 */
export function movementFlags(positions: ProcessedPosition[]): boolean[] {
  return positions.map((position, index) => {
    if (
      typeof position.speedKmh === 'number' &&
      position.speedKmh > TRIP_MOVING_SPEED_KMH
    ) {
      return true;
    }

    if (index === 0 || position.flags.includes(FLAG_SUSPECT_JUMP)) {
      return false;
    }

    const previous = positions[index - 1];
    const seconds = (position.ts - previous.ts) / 1000;
    if (seconds <= 0) {
      return false;
    }

    const meters = haversineMeters(
      previous.lat,
      previous.lng,
      position.lat,
      position.lng,
    );

    return meters / seconds > TRIP_MOVING_IMPLIED_MPS;
  });
}

/**
 * Segmenta una serie ascendente por `ts` en paseos (R2-R6).
 *
 * Abre un paseo con TRIP_MIN_MOVING_POINTS puntos consecutivos en
 * movimiento (R2) y lo cierra por inactividad acumulada, por hueco de datos
 * o al agotarse la serie (R3). Los paseos por debajo del minimo de duracion
 * o de distancia se descartan como ruido (R4). Funcion determinista: la
 * misma entrada devuelve exactamente el mismo array, que es la condicion
 * del indice estable de /trips/:n (R19).
 */
export function groupTrips(positions: ProcessedPosition[]): Trip[] {
  const moving = movementFlags(positions);
  const trips: Trip[] = [];

  let open: OpenTrip | null = null;
  let runStart = -1;
  let runCount = 0;

  for (let index = 0; index < positions.length; index++) {
    const gapBefore =
      index > 0 &&
      positions[index].ts - positions[index - 1].ts >
        TRIP_MAX_GAP_MINUTES * MS_PER_MINUTE;

    if (gapBefore) {
      if (open !== null) {
        // R3: el hueco cierra en el punto ANTERIOR al gap.
        pushTrip(trips, closeTrip(open, positions[index - 1].ts));
        open = null;
      }
      runStart = -1;
      runCount = 0;
    }

    if (open !== null) {
      open.points.push(positions[index]);

      if (moving[index]) {
        open.lastMovingTs = positions[index].ts;
      } else if (
        positions[index].ts - open.lastMovingTs >=
        TRIP_IDLE_CLOSE_MINUTES * MS_PER_MINUTE
      ) {
        // R3: el cierre por inactividad se fija en el ultimo movimiento.
        pushTrip(trips, closeTrip(open, open.lastMovingTs));
        open = null;
        runStart = -1;
        runCount = 0;
      }
      continue;
    }

    if (!moving[index]) {
      runStart = -1;
      runCount = 0;
      continue;
    }

    if (runCount === 0) {
      runStart = index;
    }
    runCount += 1;

    if (runCount >= TRIP_MIN_MOVING_POINTS) {
      // R2: startTs es el ts del PRIMERO de los puntos en movimiento.
      open = {
        points: positions.slice(runStart, index + 1),
        lastMovingTs: positions[index].ts,
      };
      runStart = -1;
      runCount = 0;
    }
  }

  if (open !== null) {
    pushTrip(trips, closeTrip(open, open.lastMovingTs));
  }

  return trips;
}

interface OpenTrip {
  points: ProcessedPosition[];
  lastMovingTs: number;
}

/** Redondeo a `decimals` decimales, sin escribir la escala como literal. */
export function roundTo(value: number, decimals: number): number {
  const scale = 10 ** decimals;

  return Math.round(value * scale) / scale;
}

/** Recorta el paseo en `endTs` y calcula sus metricas (R5, R6). */
function closeTrip(open: OpenTrip, endTs: number): Trip {
  const points = open.points.filter((position) => position.ts <= endTs);
  const startTs = points[0].ts;

  return {
    startTs,
    endTs,
    distanceM: Math.round(pathDistanceMeters(points)),
    durationMin: roundTo((endTs - startTs) / MS_PER_MINUTE, 1),
    path: points.map((position) => ({
      lat: position.lat,
      lng: position.lng,
      ts: position.ts,
    })),
  };
}

/** R4: solo sobrevive el paseo que supera ambos minimos. */
function pushTrip(trips: Trip[], trip: Trip): void {
  if (
    trip.durationMin < TRIP_MIN_DURATION_MINUTES ||
    trip.distanceM < TRIP_MIN_DISTANCE_M
  ) {
    return;
  }

  trips.push(trip);
}

/**
 * R5: suma solo los pares en los que NINGUNO de los dos puntos lleva
 * suspect_jump — el salto absurdo no infla la distancia, pero el punto sigue
 * en el path y mantiene la continuidad temporal del paseo.
 */
export function pathDistanceMeters(positions: ProcessedPosition[]): number {
  let total = 0;

  for (let index = 1; index < positions.length; index++) {
    const previous = positions[index - 1];
    const current = positions[index];

    if (
      previous.flags.includes(FLAG_SUSPECT_JUMP) ||
      current.flags.includes(FLAG_SUSPECT_JUMP)
    ) {
      continue;
    }

    total += haversineMeters(
      previous.lat,
      previous.lng,
      current.lat,
      current.lng,
    );
  }

  return total;
}

// KPIs diarios del nucleo puro (#10 R8, R9): misma regla de pureza que
// trips.ts. Los siete umbrales de R1 entran por ./trips (movementFlags,
// groupTrips, pathDistanceMeters), que es quien los importa de ./constants:
// una sola fuente y cero literales aqui, en vez de una segunda copia de las
// reglas de R2 y R5.
import {
  groupTrips,
  movementFlags,
  pathDistanceMeters,
  roundTo,
} from './trips';
import type { ProcessedPosition } from './types';

const MS_PER_MINUTE = 60_000;

/** Ventana semiabierta [startMs, endMs) ya resuelta en la tz del owner (R8). */
export interface DailyRange {
  startMs: number;
  endMs: number;
}

/** Las siete metricas del dia (R8). */
export interface DailyActivity {
  distanceM: number;
  activeMinutes: number;
  restMinutes: number;
  walkCount: number;
  avgWalkMinutes: number;
  firstWalkAt: number | null;
  lastWalkAt: number | null;
}

/**
 * KPIs diarios sobre la ventana observada, nunca sobre 1 440 min fijos
 * (R8, R9). La firma recibe el rango ya resuelto en la tz del owner en vez
 * del `tzUserOffset` del plan 006: un offset fijo no describe un dia con
 * cambio de horario (D3).
 */
export function computeDailyActivity(
  positions: ProcessedPosition[],
  range: DailyRange,
): DailyActivity {
  // Rango semiabierto [startMs, endMs), el mismo que resuelve local-day.ts.
  const series = positions.filter(
    (position) => position.ts >= range.startMs && position.ts < range.endMs,
  );

  // R9: sin puntos, o con uno solo, no hay ventana observada que medir.
  if (series.length < 2) {
    return emptyActivity();
  }

  const moving = movementFlags(series);
  let activeMs = 0;
  for (let index = 1; index < series.length; index++) {
    if (moving[index]) {
      activeMs += series[index].ts - series[index - 1].ts;
    }
  }

  const observedMinutes =
    (series[series.length - 1].ts - series[0].ts) / MS_PER_MINUTE;
  const activeMinutes = Math.round(activeMs / MS_PER_MINUTE);
  const trips = groupTrips(series);
  const totalWalkMinutes = trips.reduce(
    (total, trip) => total + trip.durationMin,
    0,
  );

  return {
    // Misma regla de exclusion de suspect_jump que R5, sobre toda la serie.
    distanceM: Math.round(pathDistanceMeters(series)),
    activeMinutes,
    restMinutes: Math.max(0, Math.round(observedMinutes) - activeMinutes),
    walkCount: trips.length,
    avgWalkMinutes:
      trips.length === 0 ? 0 : roundTo(totalWalkMinutes / trips.length, 2),
    firstWalkAt: trips.length === 0 ? null : trips[0].startTs,
    lastWalkAt: trips.length === 0 ? null : trips[trips.length - 1].endTs,
  };
}

function emptyActivity(): DailyActivity {
  return {
    distanceM: 0,
    activeMinutes: 0,
    restMinutes: 0,
    walkCount: 0,
    avgWalkMinutes: 0,
    firstWalkAt: null,
    lastWalkAt: null,
  };
}

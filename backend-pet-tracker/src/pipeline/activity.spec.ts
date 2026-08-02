import { readFileSync } from 'fs';
import { join } from 'path';
import { computeDailyActivity } from './activity';
import { FLAG_LOW_ACCURACY, FLAG_SUSPECT_JUMP } from './constants';
import { groupTrips } from './trips';
import type { ProcessedPosition } from './types';

const BASE_TS = Date.UTC(2026, 7, 1, 8, 0, 0);
const BASE_LAT = 19.4326;
const BASE_LNG = -99.1332;
/** Grados de latitud a metros con el radio exacto de geo.ts. */
const METERS_PER_DEGREE_LAT = (6_371_000 * Math.PI) / 180;
const MINUTE_MS = 60_000;

interface TrackSegment {
  count: number;
  stepMs: number;
  stepMeters: number;
  speedKmh: number;
  leadMs?: number;
  leadMeters?: number;
  flags?: string[];
}

function makeTrack(segments: TrackSegment[]): ProcessedPosition[] {
  const points: ProcessedPosition[] = [];
  let ts = BASE_TS;
  let meters = 0;

  for (const segment of segments) {
    for (let index = 0; index < segment.count; index++) {
      if (points.length > 0) {
        ts += index === 0 ? (segment.leadMs ?? segment.stepMs) : segment.stepMs;
        meters +=
          index === 0
            ? (segment.leadMeters ?? segment.stepMeters)
            : segment.stepMeters;
      }
      points.push({
        lat: BASE_LAT + meters / METERS_PER_DEGREE_LAT,
        lng: BASE_LNG,
        ts,
        speedKmh: segment.speedKmh,
        accuracyM: 8,
        sats: 9,
        flags: [...(segment.flags ?? [])],
      });
    }
  }

  return points;
}

/**
 * Dos paseos de 6 min a 5 km/h separados por 15 min de reposo con deriva de
 * 2 m/min: 29 puntos a 1 min, ventana observada de 28 min.
 */
function twoWalkDay(): ProcessedPosition[] {
  const stepMs = MINUTE_MS;
  const stepMeters = (5 / 3.6) * 60;

  return makeTrack([
    { count: 7, stepMs, stepMeters, speedKmh: 5 },
    { count: 15, stepMs, stepMeters: 2, speedKmh: 0 },
    { count: 7, stepMs, stepMeters, speedKmh: 5, leadMeters: stepMeters },
  ]);
}

const WHOLE_DAY = {
  startMs: Date.UTC(2026, 7, 1, 0, 0, 0),
  endMs: Date.UTC(2026, 7, 2, 0, 0, 0),
};

describe('R8: computeDailyActivity devuelve siete metricas sobre la ventana observada', () => {
  it('un dia con dos paseos: walkCount, activos y reposo cuadran', () => {
    const positions = twoWalkDay();

    const activity = computeDailyActivity(positions, WHOLE_DAY);

    expect(activity.walkCount).toBe(2);
    expect(activity.activeMinutes).toBe(13);
    // observedMinutes = 28 (del primer al ultimo punto), nunca 1 440.
    expect(activity.restMinutes).toBe(15);
    expect(activity.restMinutes).toBe(
      Math.max(
        0,
        Math.round(
          (positions[positions.length - 1].ts - positions[0].ts) / MINUTE_MS,
        ) - activity.activeMinutes,
      ),
    );
  });

  it('devuelve exactamente las siete claves de R8', () => {
    const activity = computeDailyActivity(twoWalkDay(), WHOLE_DAY);

    expect(Object.keys(activity).sort()).toEqual([
      'activeMinutes',
      'avgWalkMinutes',
      'distanceM',
      'firstWalkAt',
      'lastWalkAt',
      'restMinutes',
      'walkCount',
    ]);
  });

  it('distanceM es la de toda la serie, no solo la de los paseos', () => {
    const positions = twoWalkDay();
    const activity = computeDailyActivity(positions, WHOLE_DAY);
    const walksOnly = groupTrips(positions).reduce(
      (total, trip) => total + trip.distanceM,
      0,
    );

    expect(Number.isInteger(activity.distanceM)).toBe(true);
    expect(activity.distanceM).toBeGreaterThan(walksOnly);
    expect(activity.distanceM).toBeGreaterThan(1_110);
    expect(activity.distanceM).toBeLessThan(1_116);
  });

  it('los pares con suspect_jump no suman a distanceM y los low_accuracy si', () => {
    const stepMs = MINUTE_MS;
    const stepMeters = (5 / 3.6) * 60;
    const clean = makeTrack([
      { count: 7, stepMs, stepMeters, speedKmh: 5 },
      { count: 1, stepMs, stepMeters: 5_000, speedKmh: 5 },
    ]);
    const jumped = makeTrack([
      { count: 7, stepMs, stepMeters, speedKmh: 5 },
      {
        count: 1,
        stepMs,
        stepMeters: 5_000,
        speedKmh: 5,
        flags: [FLAG_SUSPECT_JUMP],
      },
    ]);
    const lowAccuracy = makeTrack([
      { count: 7, stepMs, stepMeters, speedKmh: 5, flags: [FLAG_LOW_ACCURACY] },
      {
        count: 1,
        stepMs,
        stepMeters: 5_000,
        speedKmh: 5,
        flags: [FLAG_LOW_ACCURACY],
      },
    ]);

    expect(computeDailyActivity(clean, WHOLE_DAY).distanceM).toBeGreaterThan(
      5_000,
    );
    expect(computeDailyActivity(jumped, WHOLE_DAY).distanceM).toBeLessThan(600);
    expect(
      computeDailyActivity(lowAccuracy, WHOLE_DAY).distanceM,
    ).toBeGreaterThan(5_000);
  });

  it('avgWalkMinutes lleva dos decimales y los hitos son epoch ms', () => {
    const positions = twoWalkDay();
    const trips = groupTrips(positions);
    const activity = computeDailyActivity(positions, WHOLE_DAY);

    expect(activity.avgWalkMinutes).toBe(
      Math.round(((trips[0].durationMin + trips[1].durationMin) / 2) * 100) /
        100,
    );
    expect(activity.firstWalkAt).toBe(trips[0].startTs);
    expect(activity.lastWalkAt).toBe(trips[trips.length - 1].endTs);
  });

  it('el rango acota la serie: los puntos fuera de [startMs, endMs) no cuentan', () => {
    const positions = twoWalkDay();
    const firstWalkOnly = {
      startMs: positions[0].ts,
      endMs: positions[7].ts,
    };

    const activity = computeDailyActivity(positions, firstWalkOnly);

    expect(activity.walkCount).toBe(1);
    expect(activity.lastWalkAt).toBe(positions[6].ts);
  });

  it('activity.ts no importa framework, SDK, ORM, zod ni modulos', () => {
    const source = readFileSync(join(__dirname, 'activity.ts'), 'utf-8');
    const imports = [...source.matchAll(/from\s+'([^']+)'/g)].map(
      (match) => match[1],
    );

    expect([...new Set(imports)].sort()).toEqual(['./trips', './types']);
  });
});

describe('R9: dia vacio y dia de un solo punto dan ceros sin lanzar', () => {
  it('sin posiciones devuelve las siete metricas a cero', () => {
    expect(computeDailyActivity([], WHOLE_DAY)).toEqual({
      distanceM: 0,
      activeMinutes: 0,
      restMinutes: 0,
      walkCount: 0,
      avgWalkMinutes: 0,
      firstWalkAt: null,
      lastWalkAt: null,
    });
  });

  it('con un solo punto la ventana observada es 0 y todo vale cero', () => {
    const positions = makeTrack([
      { count: 1, stepMs: MINUTE_MS, stepMeters: 0, speedKmh: 12 },
    ]);

    expect(computeDailyActivity(positions, WHOLE_DAY)).toEqual({
      distanceM: 0,
      activeMinutes: 0,
      restMinutes: 0,
      walkCount: 0,
      avgWalkMinutes: 0,
      firstWalkAt: null,
      lastWalkAt: null,
    });
  });
});

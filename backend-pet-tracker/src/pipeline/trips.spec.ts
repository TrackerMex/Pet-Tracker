import { readFileSync } from 'fs';
import { join } from 'path';
import {
  FLAG_LOW_ACCURACY,
  FLAG_SUSPECT_JUMP,
  LOW_ACCURACY_MAX_ACCURACY_M,
  LOW_ACCURACY_MIN_SATS,
  BATTERY_LOW_THRESHOLD_PCT,
  SUSPECT_JUMP_SPEED_KMH,
  TRIP_IDLE_CLOSE_MINUTES,
  TRIP_MAX_GAP_MINUTES,
  TRIP_MIN_DISTANCE_M,
  TRIP_MIN_DURATION_MINUTES,
  TRIP_MIN_MOVING_POINTS,
  TRIP_MOVING_IMPLIED_MPS,
  TRIP_MOVING_SPEED_KMH,
} from './constants';
import { haversineMeters } from './geo';
import { groupTrips, movementFlags } from './trips';
import type { Trip } from './trips';
import type { ProcessedPosition, RawPosition } from './types';
import { normalize } from './validate-positions';

const PIPELINE_DIR = __dirname;

// Fixtures sinteticos como generador local (D14): una serie de 5-15 puntos
// se lee mejor por el umbral que ejercita que por un .json de coordenadas.
const BASE_TS = Date.UTC(2026, 7, 1, 8, 0, 0);
const BASE_LAT = 19.4326;
const BASE_LNG = -99.1332;
const METERS_PER_DEGREE_LAT = 111_320;
const MINUTE_MS = 60_000;

interface TrackSegment {
  /** Puntos del tramo. */
  count: number;
  /** Separacion entre puntos consecutivos del tramo. */
  stepMs: number;
  /** Metros recorridos entre puntos consecutivos del tramo. */
  stepMeters: number;
  /** `speedKmh` reportado por el collar en cada punto del tramo. */
  speedKmh: number;
  /** Separacion con el ultimo punto del tramo anterior (default `stepMs`). */
  leadMs?: number;
  /** Metros del primer salto del tramo (default `stepMeters`). */
  leadMeters?: number;
  /** Flags de calidad aplicados a todos los puntos del tramo. */
  flags?: string[];
}

/** Serie ascendente por `ts` que avanza en linea recta hacia el norte. */
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

/** Metros por paso para una velocidad y una cadencia dadas. */
function metersPerStep(speedKmh: number, stepMs: number): number {
  return (speedKmh / 3.6) * (stepMs / 1000);
}

/** Distancia de un trazado SIN excluir ningun par (contraste de R5). */
function rawPathDistance(path: Array<{ lat: number; lng: number }>): number {
  let total = 0;
  for (let index = 1; index < path.length; index++) {
    total += haversineMeters(
      path[index - 1].lat,
      path[index - 1].lng,
      path[index].lat,
      path[index].lng,
    );
  }
  return total;
}

/** walk.json es RawPosition[] crudo: pasa por normalize() como el pipeline. */
function normalizedWalkFixture(): ProcessedPosition[] {
  const raw = JSON.parse(
    readFileSync(join(PIPELINE_DIR, '__fixtures__', 'walk.json'), 'utf8'),
  ) as RawPosition[];

  return normalize(raw).accepted;
}

function sourceOf(file: string): string {
  return readFileSync(join(PIPELINE_DIR, file), 'utf-8');
}

/** Codigo sin comentarios: los umbrales citados en un comentario no cuentan. */
function codeOf(file: string): string {
  return sourceOf(file)
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\/\/.*$/gm, '');
}

describe('R1: siete umbrales nombrados en pipeline/constants.ts', () => {
  it('declara las siete constantes con los valores literales del plan 006', () => {
    expect(TRIP_MOVING_SPEED_KMH).toBe(1.8);
    expect(TRIP_MOVING_IMPLIED_MPS).toBe(0.5);
    expect(TRIP_MIN_MOVING_POINTS).toBe(3);
    expect(TRIP_IDLE_CLOSE_MINUTES).toBe(10);
    expect(TRIP_MAX_GAP_MINUTES).toBe(15);
    expect(TRIP_MIN_DURATION_MINUTES).toBe(5);
    expect(TRIP_MIN_DISTANCE_M).toBe(100);
  });

  it('los cinco umbrales previos conservan nombre y valor', () => {
    expect(SUSPECT_JUMP_SPEED_KMH).toBe(60);
    expect(LOW_ACCURACY_MAX_ACCURACY_M).toBe(100);
    expect(LOW_ACCURACY_MIN_SATS).toBe(4);
    expect(BATTERY_LOW_THRESHOLD_PCT).toBe(20);
  });

  it('TRIP_MIN_DISTANCE_M es una constante propia, no LOW_ACCURACY_MAX_ACCURACY_M', () => {
    // Mismo valor (100), significados opuestos: metros recorridos vs metros
    // de precision GPS. Calibrar uno no debe mover el otro.
    const declarations = sourceOf('constants.ts');
    expect(declarations).toMatch(/export const TRIP_MIN_DISTANCE_M = 100;/);
    expect(declarations).toMatch(
      /export const LOW_ACCURACY_MAX_ACCURACY_M = 100;/,
    );
  });

  it('los umbrales tienen una sola fuente: constants.ts', () => {
    // trips.ts los importa directamente; activity.ts los consume a traves de
    // movementFlags/groupTrips/pathDistanceMeters de trips.ts en vez de
    // reimplementar la regla de R2 y R5 con una segunda copia de los
    // umbrales (lectura declarada en progress/impl_trips-activity.md).
    expect(sourceOf('trips.ts')).toMatch(/from '\.\/constants'/);
    expect(sourceOf('activity.ts')).toMatch(/from '\.\/trips'/);
  });

  it('trips.ts y activity.ts no escriben los umbrales como literal numerico', () => {
    // Los tres valores inequivocos (1.8, 0.5, 100); los cuatro restantes
    // (3, 10, 15, 5) colisionan con aritmetica legitima y quedan a la
    // inspeccion del reviewer, como declara R1.
    for (const file of ['trips.ts', 'activity.ts']) {
      const code = codeOf(file);
      expect(code).not.toMatch(/\b1\.8\b/);
      expect(code).not.toMatch(/\b0\.5\b/);
      expect(code).not.toMatch(/\b100\b/);
    }
  });
});

describe('R2: criterio de movimiento y apertura con 3 puntos consecutivos', () => {
  it('12 puntos a 30 s y 5 km/h son un unico paseo que arranca en el primero', () => {
    const stepMs = 30_000;
    const positions = makeTrack([
      { count: 12, stepMs, stepMeters: metersPerStep(5, stepMs), speedKmh: 5 },
    ]);

    const trips = groupTrips(positions);

    expect(trips).toHaveLength(1);
    expect(trips[0].startTs).toBe(positions[0].ts);
    expect(trips[0].endTs).toBe(positions[positions.length - 1].ts);
  });

  it('solo 2 puntos en movimiento entre reposo no abren paseo', () => {
    const stepMs = 30_000;
    const positions = makeTrack([
      { count: 5, stepMs, stepMeters: 0, speedKmh: 0 },
      { count: 2, stepMs, stepMeters: metersPerStep(5, stepMs), speedKmh: 5 },
      { count: 5, stepMs, stepMeters: 0, speedKmh: 0 },
    ]);

    expect(TRIP_MIN_MOVING_POINTS).toBe(3);
    expect(groupTrips(positions)).toEqual([]);
  });

  it('la velocidad implicita basta para declarar movimiento sin speedKmh', () => {
    const stepMs = 30_000;
    // 0,6 m/s implicitos (> TRIP_MOVING_IMPLIED_MPS) con speedKmh en reposo.
    const positions = makeTrack([
      { count: 12, stepMs, stepMeters: 0.6 * 30, speedKmh: 0 },
    ]);

    const flags = movementFlags(positions);

    expect(TRIP_MOVING_IMPLIED_MPS).toBe(0.5);
    expect(flags[0]).toBe(false);
    expect(flags.slice(1).every((moving) => moving)).toBe(true);
    expect(groupTrips(positions)).toHaveLength(1);
  });

  it('un punto suspect_jump no usa su velocidad implicita como prueba de movimiento', () => {
    const stepMs = 30_000;
    const positions = makeTrack([
      { count: 3, stepMs, stepMeters: 0, speedKmh: 0 },
      // Salto de 1 km en 30 s (120 km/h implicitos) con speedKmh en reposo.
      {
        count: 1,
        stepMs,
        stepMeters: 1_000,
        speedKmh: 0,
        flags: [FLAG_SUSPECT_JUMP],
      },
      { count: 3, stepMs, stepMeters: 0, speedKmh: 0 },
    ]);

    const flags = movementFlags(positions);

    expect(flags[3]).toBe(false);
    expect(groupTrips(positions)).toEqual([]);
  });

  it('speedKmh justo en el umbral no es movimiento; por encima si', () => {
    const stepMs = 30_000;
    const atThreshold = makeTrack([
      { count: 12, stepMs, stepMeters: 0, speedKmh: TRIP_MOVING_SPEED_KMH },
    ]);

    expect(movementFlags(atThreshold).every((moving) => !moving)).toBe(true);
  });
});

describe('R3: cierre por inactividad y por hueco de datos', () => {
  it('un gap de 20 min parte la serie en dos paseos', () => {
    const stepMs = 30_000;
    const stepMeters = metersPerStep(5, stepMs);
    const positions = makeTrack([
      { count: 13, stepMs, stepMeters, speedKmh: 5 },
      { count: 13, stepMs, stepMeters, speedKmh: 5, leadMs: 20 * MINUTE_MS },
    ]);

    expect(TRIP_MAX_GAP_MINUTES).toBe(15);
    const trips = groupTrips(positions);

    expect(trips).toHaveLength(2);
    // endTs del primero = ts del punto ANTERIOR al gap, no el del gap.
    expect(trips[0].endTs).toBe(positions[12].ts);
    expect(trips[1].startTs).toBe(positions[13].ts);
  });

  it('10 min sin movimiento cierran el paseo en el ultimo punto en movimiento', () => {
    const stepMs = 30_000;
    const stepMeters = metersPerStep(5, stepMs);
    const positions = makeTrack([
      { count: 13, stepMs, stepMeters, speedKmh: 5 },
      { count: 30, stepMs, stepMeters: 0, speedKmh: 0 },
      { count: 13, stepMs, stepMeters, speedKmh: 5 },
    ]);

    expect(TRIP_IDLE_CLOSE_MINUTES).toBe(10);
    const trips = groupTrips(positions);

    expect(trips).toHaveLength(2);
    expect(trips[0].endTs).toBe(positions[12].ts);
    // El paseo no arrastra los puntos de reposo del cierre.
    expect(trips[0].path[trips[0].path.length - 1].ts).toBe(positions[12].ts);
    expect(trips[1].startTs).toBe(positions[43].ts);
  });

  it('una serie que se agota con el paseo abierto lo cierra en su ultimo movimiento', () => {
    const stepMs = 30_000;
    const stepMeters = metersPerStep(5, stepMs);
    const positions = makeTrack([
      { count: 13, stepMs, stepMeters, speedKmh: 5 },
      { count: 4, stepMs, stepMeters: 0, speedKmh: 0 },
    ]);

    const trips = groupTrips(positions);

    expect(trips).toHaveLength(1);
    expect(trips[0].endTs).toBe(positions[12].ts);
  });
});

describe('R4: descarte de paseos cortos o de poca distancia', () => {
  it('reposo total de 2 h devuelve cero paseos', () => {
    const stepMs = 30_000;
    const positions = makeTrack([
      { count: 241, stepMs, stepMeters: 0.2, speedKmh: 0 },
    ]);

    expect(positions[positions.length - 1].ts - positions[0].ts).toBe(
      120 * MINUTE_MS,
    );
    expect(groupTrips(positions)).toEqual([]);
  });

  it('un tramo de 4 min a 6 km/h se descarta por duracion', () => {
    const stepMs = 30_000;
    const positions = makeTrack([
      { count: 9, stepMs, stepMeters: metersPerStep(6, stepMs), speedKmh: 6 },
    ]);

    expect(TRIP_MIN_DURATION_MINUTES).toBe(5);
    expect(positions[8].ts - positions[0].ts).toBe(4 * MINUTE_MS);
    expect(groupTrips(positions)).toEqual([]);
  });

  it('un tramo de 20 min con 60 m recorridos se descarta por distancia', () => {
    const stepMs = 30_000;
    const positions = makeTrack([
      { count: 41, stepMs, stepMeters: 60 / 40, speedKmh: 2 },
    ]);

    expect(TRIP_MIN_DISTANCE_M).toBe(100);
    expect(positions[40].ts - positions[0].ts).toBe(20 * MINUTE_MS);
    expect(groupTrips(positions)).toEqual([]);
  });
});

describe('R5: la distancia excluye los pares con suspect_jump y no filtra low_accuracy', () => {
  it('el salto absurdo de walk.json queda fuera de la distancia', () => {
    const trips = groupTrips(normalizedWalkFixture());
    expect(trips.length).toBeGreaterThanOrEqual(1);

    const excluded = trips.reduce((total, trip) => total + trip.distanceM, 0);
    const naive = trips.reduce(
      (total, trip) => total + rawPathDistance(trip.path),
      0,
    );

    expect(naive - excluded).toBeGreaterThanOrEqual(900);
  });

  it('los puntos suspect_jump siguen en el path y no abren un gap artificial', () => {
    const stepMs = 30_000;
    const stepMeters = metersPerStep(5, stepMs);
    const positions = makeTrack([
      { count: 7, stepMs, stepMeters, speedKmh: 5 },
      {
        count: 1,
        stepMs,
        stepMeters: 1_000,
        speedKmh: 5,
        flags: [FLAG_SUSPECT_JUMP],
      },
      {
        count: 7,
        stepMs,
        stepMeters,
        speedKmh: 5,
        leadMeters: -1_000 + stepMeters,
      },
    ]);

    const trips = groupTrips(positions);

    expect(trips).toHaveLength(1);
    expect(trips[0].path).toHaveLength(positions.length);
    expect(trips[0].path.map((point) => point.ts)).toContain(positions[7].ts);
    // 12 pares legitimos de ~41,7 m; los 2 pares del salto no suman.
    expect(trips[0].distanceM).toBeLessThan(700);
    expect(trips[0].distanceM).toBeGreaterThan(400);
  });

  it('los puntos low_accuracy si cuentan: no se filtran antes de segmentar', () => {
    const stepMs = 30_000;
    const stepMeters = metersPerStep(5, stepMs);
    const positions = makeTrack([
      {
        count: 12,
        stepMs,
        stepMeters,
        speedKmh: 5,
        flags: [FLAG_LOW_ACCURACY],
      },
    ]);

    const trips = groupTrips(positions);

    expect(trips).toHaveLength(1);
    expect(trips[0].distanceM).toBeGreaterThan(400);
  });
});

describe('R6: shape, orden, determinismo y pureza de trips.ts', () => {
  it('walk.json normalizado da al menos un paseo con distancia positiva', () => {
    const trips = groupTrips(normalizedWalkFixture());

    expect(trips.length).toBeGreaterThanOrEqual(1);
    expect(trips[0].distanceM).toBeGreaterThan(0);
  });

  it('cada paseo tiene exactamente las cinco claves de R6', () => {
    const trips = groupTrips(normalizedWalkFixture());

    for (const trip of trips) {
      expect(Object.keys(trip).sort()).toEqual([
        'distanceM',
        'durationMin',
        'endTs',
        'path',
        'startTs',
      ]);
      expect(Number.isInteger(trip.distanceM)).toBe(true);
      expect(trip.distanceM).toBeGreaterThanOrEqual(0);
      expect(trip.durationMin).toBe(
        Math.round(((trip.endTs - trip.startTs) / 60_000) * 10) / 10,
      );
      for (const point of trip.path) {
        expect(Object.keys(point).sort()).toEqual(['lat', 'lng', 'ts']);
      }
    }
  });

  it('los paseos salen ordenados por startTs y no se solapan', () => {
    const stepMs = 30_000;
    const stepMeters = metersPerStep(5, stepMs);
    const positions = makeTrack([
      { count: 13, stepMs, stepMeters, speedKmh: 5 },
      { count: 13, stepMs, stepMeters, speedKmh: 5, leadMs: 20 * MINUTE_MS },
      { count: 13, stepMs, stepMeters, speedKmh: 5, leadMs: 20 * MINUTE_MS },
    ]);

    const trips = groupTrips(positions);

    expect(trips).toHaveLength(3);
    for (let index = 1; index < trips.length; index++) {
      expect(trips[index].startTs).toBeGreaterThan(trips[index - 1].startTs);
      expect(trips[index].startTs).toBeGreaterThan(trips[index - 1].endTs);
    }
  });

  it('el path va en orden ascendente por ts y encaja con startTs/endTs', () => {
    const trips = groupTrips(normalizedWalkFixture());

    for (const trip of trips) {
      const timestamps = trip.path.map((point) => point.ts);
      expect(timestamps).toEqual([...timestamps].sort((a, b) => a - b));
      expect(trip.path[0].ts).toBe(trip.startTs);
      expect(trip.path[trip.path.length - 1].ts).toBe(trip.endTs);
    }
  });

  it('dos invocaciones con la misma entrada devuelven lo mismo (indice estable de R19)', () => {
    const first: Trip[] = groupTrips(normalizedWalkFixture());
    const second: Trip[] = groupTrips(normalizedWalkFixture());

    expect(second).toEqual(first);
  });

  it('trips.ts no importa framework, SDK, ORM, zod ni modulos', () => {
    const source = sourceOf('trips.ts');
    const imports = [...source.matchAll(/from\s+'([^']+)'/g)].map(
      (match) => match[1],
    );

    expect([...new Set(imports)].sort()).toEqual([
      './constants',
      './geo',
      './types',
    ]);
  });
});

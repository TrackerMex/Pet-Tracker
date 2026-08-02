import { SIMULATED_DEVICES } from '@/db/seed/simulated-devices';
import type { RawPosition } from '@/pipeline/types';
import { FakeWialonClient, SIM_STEP_MS } from './fake-wialon.client';

// Intervalo base alineado a slots de 30 s (12:00:00.000 UTC es multiplo).
const T0 = Date.UTC(2026, 7, 1, 12, 0, 0);

const HOME_LAT = 19.4326;
const HOME_LNG = -99.1332;

function client(seed = 1): FakeWialonClient {
  return new FakeWialonClient({ seed, homeLat: HOME_LAT, homeLng: HOME_LNG });
}

/** Distancia equirectangular en metros — suficiente para distancias cortas. */
function distanceMeters(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const metersPerDegree = 111_320;
  const dLat = (lat2 - lat1) * metersPerDegree;
  const dLng =
    (lng2 - lng1) * metersPerDegree * Math.cos((lat1 * Math.PI) / 180);
  return Math.sqrt(dLat * dLat + dLng * dLng);
}

/** Velocidades implicitas (km/h) entre consecutivos con ts distinto. */
function impliedSpeedsKmh(list: RawPosition[]): number[] {
  const speeds: number[] = [];
  for (let i = 1; i < list.length; i++) {
    const dtSeconds = (list[i].ts - list[i - 1].ts) / 1000;
    if (dtSeconds <= 0) {
      continue;
    }
    const meters = distanceMeters(
      list[i - 1].lat,
      list[i - 1].lng,
      list[i].lat,
      list[i].lng,
    );
    speeds.push((meters / dtSeconds) * 3.6);
  }
  return speeds;
}

describe('R2: fake determinista — misma semilla+intervalo => mismas posiciones; un punto por slot de 30 s; unitIds del seed', () => {
  it('dos llamadas con la misma semilla y el mismo intervalo devuelven exactamente la misma lista', async () => {
    const interval = [T0, T0 + 100 * SIM_STEP_MS] as const;

    // Instancias distintas: simula un reinicio del proceso — sin estado
    // mutable acumulado entre llamadas.
    const first = await client().getMessages('900001', ...interval);
    const second = await client().getMessages('900001', ...interval);

    expect(first.length).toBeGreaterThan(0);
    expect(second).toEqual(first);
  });

  it('genera un punto por cada slot de 30 s del intervalo (ts distintos consecutivos)', async () => {
    const list = await client().getMessages(
      '900001',
      T0,
      T0 + 100 * SIM_STEP_MS,
    );

    const distinctTs = [...new Set(list.map((p) => p.ts))];
    expect(distinctTs).toHaveLength(100);
    distinctTs.forEach((ts, i) => {
      expect(ts).toBe(T0 + (i + 1) * SIM_STEP_MS);
    });
  });

  it('intervalos solapados devuelven posiciones identicas para los slots compartidos', async () => {
    const a = await client().getMessages('900001', T0, T0 + 60 * SIM_STEP_MS);
    const b = await client().getMessages(
      '900001',
      T0 + 30 * SIM_STEP_MS,
      T0 + 90 * SIM_STEP_MS,
    );

    const sharedFromA = a.filter((p) => p.ts > T0 + 30 * SIM_STEP_MS);
    const sharedFromB = b.filter((p) => p.ts <= T0 + 60 * SIM_STEP_MS);
    expect(sharedFromA.length).toBeGreaterThan(0);
    expect(sharedFromB).toEqual(sharedFromA);
  });

  it('semillas o unidades distintas producen paseos distintos', async () => {
    const base = await client(1).getMessages(
      '900001',
      T0,
      T0 + 20 * SIM_STEP_MS,
    );
    const otherSeed = await client(2).getMessages(
      '900001',
      T0,
      T0 + 20 * SIM_STEP_MS,
    );
    const otherUnit = await client(1).getMessages(
      '900002',
      T0,
      T0 + 20 * SIM_STEP_MS,
    );

    expect(otherSeed).not.toEqual(base);
    expect(otherUnit).not.toEqual(base);
  });

  it('listUnits devuelve las unidades de SIMULATED_DEVICES (importadas del seed de #7)', async () => {
    const units = await client().listUnits();

    expect(units).toEqual(
      SIMULATED_DEVICES.map((device) => ({
        unitId: device.wialonUnitId,
        name: device.esn,
      })),
    );
  });
});

describe('R3: paseo realista — arranque en casa, <=8 km/h salvo saltos, ruido ~10 m, duplicado exacto, salto >60 km/h y bateria decreciente', () => {
  // Inicio del dia simulado: el paseo rearranca en casa a las 00:00.
  const DAY_START = Date.UTC(2026, 7, 1, 0, 0, 0);
  const INTERVAL_SLOTS = 200;

  let walk: RawPosition[];

  beforeAll(async () => {
    walk = await client().getMessages(
      '900001',
      DAY_START,
      DAY_START + INTERVAL_SLOTS * SIM_STEP_MS,
    );
  });

  it('arranca en SIM_HOME_LAT/SIM_HOME_LNG (primer punto a <100 m de casa)', () => {
    const first = walk[0];
    expect(
      distanceMeters(first.lat, first.lng, HOME_LAT, HOME_LNG),
    ).toBeLessThan(100);
  });

  it('las velocidades implicitas son <=8 km/h salvo los saltos inyectados (>60 km/h, sin zona media)', () => {
    const speeds = impliedSpeedsKmh(walk);

    // Al menos un salto absurdo que supera el umbral suspect_jump.
    expect(speeds.some((s) => s > 60)).toBe(true);
    // Nada entre 8 y 60: o caminata suave o salto absurdo.
    expect(speeds.filter((s) => s > 8 && s <= 60)).toHaveLength(0);
  });

  it('el ruido de posicion es del orden de ~10 m (pausas con drift >0 y <=30 m)', () => {
    const pauseDistances: number[] = [];
    for (let i = 1; i < walk.length; i++) {
      if (
        walk[i].speedKmh === 0 &&
        walk[i - 1].speedKmh === 0 &&
        walk[i].ts !== walk[i - 1].ts
      ) {
        pauseDistances.push(
          distanceMeters(
            walk[i - 1].lat,
            walk[i - 1].lng,
            walk[i].lat,
            walk[i].lng,
          ),
        );
      }
    }

    const noiseDistances = pauseDistances.filter((d) => d <= 30);
    expect(noiseDistances.length).toBeGreaterThan(0);
    expect(noiseDistances.some((d) => d > 1)).toBe(true);
  });

  it('contiene al menos un duplicado exacto (mismo ts y coordenadas)', () => {
    const duplicates = walk.filter(
      (p, i) =>
        i > 0 &&
        p.ts === walk[i - 1].ts &&
        p.lat === walk[i - 1].lat &&
        p.lng === walk[i - 1].lng,
    );
    expect(duplicates.length).toBeGreaterThanOrEqual(1);
  });

  it('la bateria es monotonamente no creciente a ~1 % por cada 30 min simulados', () => {
    const batteries = walk.map((p) => p.batteryPct);
    expect(batteries.every((b) => typeof b === 'number')).toBe(true);

    for (let i = 1; i < batteries.length; i++) {
      expect(batteries[i]!).toBeLessThanOrEqual(batteries[i - 1]!);
    }

    // 200 slots = 100 min => ~3 % de caida (tolerancia de alineacion).
    const drop = batteries[0]! - batteries[batteries.length - 1]!;
    expect(drop).toBeGreaterThanOrEqual(2);
    expect(drop).toBeLessThanOrEqual(4);
  });
});

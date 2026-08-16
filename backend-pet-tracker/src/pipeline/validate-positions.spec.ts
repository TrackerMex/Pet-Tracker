import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  BATTERY_LOW_THRESHOLD_PCT,
  FLAG_LOW_ACCURACY,
  FLAG_SUSPECT_JUMP,
  FUTURE_TS_TOLERANCE_MS,
  LOW_ACCURACY_MAX_ACCURACY_M,
  LOW_ACCURACY_MIN_SATS,
  SUSPECT_JUMP_SPEED_KMH,
} from './constants';
import { haversineMeters } from './geo';
import type { RawPosition } from './types';
import { normalize } from './validate-positions';

function position(overrides: Partial<RawPosition>): RawPosition {
  return { lat: 19.4326, lng: -99.1332, ts: 1_000_000, ...overrides };
}

describe('R5: normalize() descarta (0,0)/fuera de rango/sin ts/duplicados, ordena y reporta discarded; 100% puro', () => {
  it('descarta lat/lng fuera de rango y exactamente (0,0) con razon invalid_coordinates', () => {
    const valid = position({ ts: 1000 });
    const result = normalize([
      valid,
      position({ lat: 0, lng: 0, ts: 2000 }),
      position({ lat: 91, ts: 3000 }),
      position({ lat: -91, ts: 4000 }),
      position({ lng: 181, ts: 5000 }),
      position({ lng: -181, ts: 6000 }),
    ]);

    expect(result.accepted).toHaveLength(1);
    expect(result.accepted[0].ts).toBe(1000);
    expect(result.discarded).toHaveLength(5);
    expect(
      result.discarded.every((d) => d.reason === 'invalid_coordinates'),
    ).toBe(true);
  });

  it('descarta posiciones sin ts con razon missing_ts', () => {
    const noTs = { lat: 19.4, lng: -99.1 } as RawPosition;
    const result = normalize([position({ ts: 1000 }), noTs]);

    expect(result.accepted).toHaveLength(1);
    expect(result.discarded).toEqual([
      { reason: 'missing_ts', position: noTs },
    ]);
  });

  it('descarta duplicados exactos por device_ts dejando la primera aparicion', () => {
    const first = position({ ts: 2000, lat: 19.1 });
    const duplicate = position({ ts: 2000, lat: 19.2 });
    const result = normalize([first, duplicate, position({ ts: 3000 })]);

    expect(result.accepted).toHaveLength(2);
    expect(result.accepted[0].lat).toBe(19.1);
    expect(result.discarded).toEqual([
      { reason: 'duplicate_ts', position: duplicate },
    ]);
  });

  it('devuelve accepted en orden cronologico ascendente aunque la entrada venga desordenada', () => {
    const result = normalize([
      position({ ts: 3000 }),
      position({ ts: 1000 }),
      position({ ts: 2000 }),
    ]);

    expect(result.accepted.map((p) => p.ts)).toEqual([1000, 2000, 3000]);
  });

  it('cada posicion aceptada lleva flags como array', () => {
    const result = normalize([position({ ts: 1000 })]);
    expect(Array.isArray(result.accepted[0].flags)).toBe(true);
  });

  it('R6/R17: los umbrales viven como constantes nombradas en pipeline/constants.ts', () => {
    expect(SUSPECT_JUMP_SPEED_KMH).toBe(60);
    expect(LOW_ACCURACY_MAX_ACCURACY_M).toBe(100);
    expect(LOW_ACCURACY_MIN_SATS).toBe(4);
    expect(BATTERY_LOW_THRESHOLD_PCT).toBe(20);
  });

  it('es una funcion pura: sin imports de NestJS/SDK/ORM, sin reloj ni red (inspeccion de imports)', () => {
    const source = readFileSync(
      join(__dirname, 'validate-positions.ts'),
      'utf8',
    );

    const importSpecifiers = [...source.matchAll(/from '([^']+)'/g)].map(
      (match) => match[1],
    );
    expect(importSpecifiers.length).toBeGreaterThan(0);
    // Solo imports relativos dentro del propio pipeline.
    expect(importSpecifiers.every((s) => s.startsWith('./'))).toBe(true);
    // Sin reloj ni aleatoriedad.
    expect(source).not.toMatch(/Date\.now|new Date\(|Math\.random/);
  });
});

describe('R6: flags suspect_jump (>60 km/h, no descarta) y low_accuracy (>100 m o <4 sats)', () => {
  // 30 s entre puntos; 0.01 grados de lat ~ 1113 m => ~133 km/h implicitos.
  const JUMP_DELTA_LAT = 0.01;

  it('marca suspect_jump en la posterior de un par que implica >60 km/h, sin descartarla', () => {
    const result = normalize([
      { lat: 19.4326, lng: -99.1332, ts: 0 },
      { lat: 19.4326 + JUMP_DELTA_LAT, lng: -99.1332, ts: 30_000 },
    ]);

    expect(result.accepted).toHaveLength(2);
    expect(result.discarded).toHaveLength(0);
    expect(result.accepted[0].flags).not.toContain(FLAG_SUSPECT_JUMP);
    expect(result.accepted[1].flags).toContain(FLAG_SUSPECT_JUMP);
  });

  it('no marca suspect_jump a velocidades de caminata', () => {
    const result = normalize([
      { lat: 19.4326, lng: -99.1332, ts: 0 },
      { lat: 19.4328, lng: -99.1332, ts: 30_000 },
    ]);

    expect(result.accepted[1].flags).not.toContain(FLAG_SUSPECT_JUMP);
  });

  it('marca low_accuracy con accuracyM > 100 o sats < 4, sin descartar', () => {
    const result = normalize([
      { lat: 19.4326, lng: -99.1332, ts: 0, accuracyM: 101 },
      { lat: 19.4326, lng: -99.1331, ts: 30_000, sats: 3 },
      { lat: 19.4326, lng: -99.133, ts: 60_000, accuracyM: 100, sats: 4 },
    ]);

    expect(result.accepted).toHaveLength(3);
    expect(result.accepted[0].flags).toContain(FLAG_LOW_ACCURACY);
    expect(result.accepted[1].flags).toContain(FLAG_LOW_ACCURACY);
    // En el umbral exacto (100 m / 4 sats) no hay flag.
    expect(result.accepted[2].flags).not.toContain(FLAG_LOW_ACCURACY);
  });

  it('una posicion puede llevar ambos flags a la vez', () => {
    const result = normalize([
      { lat: 19.4326, lng: -99.1332, ts: 0 },
      {
        lat: 19.4326 + JUMP_DELTA_LAT,
        lng: -99.1332,
        ts: 30_000,
        accuracyM: 150,
      },
    ]);

    expect(result.accepted[1].flags).toEqual(
      expect.arrayContaining([FLAG_SUSPECT_JUMP, FLAG_LOW_ACCURACY]),
    );
  });

  it('haversineMeters de pipeline/geo.ts da distancias correctas (~111.3 m por 0.001 grados de lat)', () => {
    const meters = haversineMeters(19.4326, -99.1332, 19.4336, -99.1332);
    expect(meters).toBeGreaterThan(105);
    expect(meters).toBeLessThan(118);
    expect(haversineMeters(19.4326, -99.1332, 19.4326, -99.1332)).toBe(0);
  });
});

describe('R7: fixture walk.json (~200 puntos del fake) + casos borde', () => {
  const walk = JSON.parse(
    readFileSync(join(__dirname, '__fixtures__', 'walk.json'), 'utf8'),
  ) as RawPosition[];

  it('el fixture trae ~200 puntos generados con el fake (R3)', () => {
    expect(walk.length).toBeGreaterThanOrEqual(200);
    expect(walk.length).toBeLessThanOrEqual(210);
  });

  it('descarta el (0,0) y los duplicados presentes en el fixture, cada uno con su razon', () => {
    const { accepted, discarded } = normalize(walk);

    const zeroDiscards = discarded.filter(
      (d) => d.reason === 'invalid_coordinates',
    );
    expect(zeroDiscards).toHaveLength(1);
    expect(zeroDiscards[0].position.lat).toBe(0);
    expect(zeroDiscards[0].position.lng).toBe(0);

    const duplicateDiscards = discarded.filter(
      (d) => d.reason === 'duplicate_ts',
    );
    expect(duplicateDiscards.length).toBeGreaterThanOrEqual(1);

    expect(accepted).toHaveLength(walk.length - discarded.length);
  });

  it('marca el salto del fixture como suspect_jump y conserva el orden cronologico', () => {
    const { accepted } = normalize(walk);

    expect(accepted.some((p) => p.flags.includes(FLAG_SUSPECT_JUMP))).toBe(
      true,
    );

    for (let i = 1; i < accepted.length; i++) {
      expect(accepted[i].ts).toBeGreaterThan(accepted[i - 1].ts);
    }
  });

  it('lista vacia => {accepted: [], discarded: []}', () => {
    expect(normalize([])).toEqual({ accepted: [], discarded: [] });
  });

  it('un solo punto => aceptado sin flags de velocidad', () => {
    const { accepted, discarded } = normalize([walk[0]]);

    expect(discarded).toHaveLength(0);
    expect(accepted).toHaveLength(1);
    expect(accepted[0].flags).not.toContain(FLAG_SUSPECT_JUMP);
  });

  it('todos invalidos => accepted vacio con discarded completo', () => {
    const invalid: RawPosition[] = [
      { lat: 0, lng: 0, ts: 1000 },
      { lat: 95, lng: -99.1, ts: 2000 },
      { lat: 19.4, lng: -99.1 } as RawPosition,
    ];

    const { accepted, discarded } = normalize(invalid);
    expect(accepted).toHaveLength(0);
    expect(discarded).toHaveLength(3);
  });
});

describe('R8 (reject-future-positions #27): FUTURE_TS_TOLERANCE_MS vive en pipeline/constants.ts', () => {
  it('define una tolerancia de 5 minutos', () => {
    expect(FUTURE_TS_TOLERANCE_MS).toBe(5 * 60_000);
  });

  it('validate-positions.ts usa la constante nombrada sin duplicar su valor', () => {
    const source = readFileSync(
      join(__dirname, 'validate-positions.ts'),
      'utf8',
    );

    expect(source).toContain('FUTURE_TS_TOLERANCE_MS');
    expect(source).not.toContain('300_000');
    expect(source).not.toContain('300000');
  });
});

describe('R1 (reject-future-positions #27): normalize() descarta el ts futuro fuera del margen de tolerancia', () => {
  const nowMs = 1_000_000;

  it('descarta una posicion posterior al margen con razon future_ts', () => {
    const future = position({
      ts: nowMs + FUTURE_TS_TOLERANCE_MS + 1,
    });

    const result = normalize([future], nowMs);

    expect(result.accepted).toHaveLength(0);
    expect(result.discarded).toEqual([
      { reason: 'future_ts', position: future },
    ]);
  });

  it('en un lote mixto descarta solo la posicion futura', () => {
    const past = position({ ts: nowMs - 1 });
    const future = position({
      ts: nowMs + FUTURE_TS_TOLERANCE_MS + 1,
    });

    const result = normalize([past, future], nowMs);

    expect(result.accepted.map(({ ts }) => ts)).toEqual([past.ts]);
    expect(result.discarded).toEqual([
      { reason: 'future_ts', position: future },
    ]);
  });
});

describe('R2 (reject-future-positions #27): un ts adelantado dentro del margen de tolerancia se acepta', () => {
  const nowMs = 1_000_000;

  it('acepta un ts adelantado por 1 ms', () => {
    const result = normalize([position({ ts: nowMs + 1 })], nowMs);

    expect(result.accepted).toHaveLength(1);
    expect(result.discarded).toHaveLength(0);
  });

  it('acepta el borde inclusivo del margen', () => {
    const result = normalize(
      [position({ ts: nowMs + FUTURE_TS_TOLERANCE_MS })],
      nowMs,
    );

    expect(result.accepted).toHaveLength(1);
    expect(result.discarded).toHaveLength(0);
  });

  it('descarta 1 ms despues del margen', () => {
    const result = normalize(
      [position({ ts: nowMs + FUTURE_TS_TOLERANCE_MS + 1 })],
      nowMs,
    );

    expect(result.accepted).toHaveLength(0);
    expect(result.discarded[0].reason).toBe('future_ts');
  });

  it('R3 (reject-future-positions #27): sin nowMs no se filtra nada', () => {
    const future = position({ ts: nowMs + 10 * 365 * 24 * 60 * 60_000 });

    const result = normalize([future]);

    expect(result.accepted).toHaveLength(1);
    expect(result.discarded).toHaveLength(0);
  });
});

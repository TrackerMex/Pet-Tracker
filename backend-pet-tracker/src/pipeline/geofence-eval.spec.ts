import { readFileSync } from 'fs';
import { join } from 'path';
import { FLAG_LOW_ACCURACY, FLAG_SUSPECT_JUMP } from './constants';
import { evaluate, isInside } from './geofence-eval';
import type {
  CircleGeometry,
  GeofenceState,
  PolygonGeometry,
} from './geofence-eval';
import { haversineMeters } from './geo';

// Debe coincidir con EARTH_RADIUS_M de ./geo — usado solo para construir
// puntos de prueba a una distancia exacta por diferencia pura de latitud
// (dLng=0 colapsa haversine a distance = EARTH_RADIUS_M * dLatRad).
const EARTH_RADIUS_M = 6_371_000;

const CIRCLE: CircleGeometry = {
  shape: 'circle',
  centerLat: 19.4326,
  centerLng: -99.1332,
  radiusM: 100,
};
const CENTER = { lat: CIRCLE.centerLat, lng: CIRCLE.centerLng };

/** Punto a `distanceM` metros al norte del centro (mismo dLng=0 que arriba). */
function pointAtDistance(
  center: { lat: number; lng: number },
  distanceM: number,
): { lat: number; lng: number } {
  const dLatDeg = (distanceM / EARTH_RADIUS_M) * (180 / Math.PI);
  return { lat: center.lat + dLatDeg, lng: center.lng };
}

describe('R16: isInside circulo — haversine <= radiusM, borde inclusive', () => {
  it('punto en el centro exacto es true', () => {
    expect(
      isInside(CIRCLE, { lat: CIRCLE.centerLat, lng: CIRCLE.centerLng }),
    ).toBe(true);
  });

  it('punto a radiusM + 1 m es false', () => {
    const point = pointAtDistance(CENTER, CIRCLE.radiusM + 1);
    expect(isInside(CIRCLE, point)).toBe(false);
  });

  it('punto a exactamente radiusM m es true (borde inclusive)', () => {
    // radiusM se fija al valor EXACTO que devuelve haversineMeters para este
    // punto — evita el redondeo de construir un punto por trigonometria
    // inversa y comparar contra un radio literal.
    const point = { lat: 19.434, lng: -99.1332 };
    const radiusM = haversineMeters(
      CIRCLE.centerLat,
      CIRCLE.centerLng,
      point.lat,
      point.lng,
    );
    const geometry: CircleGeometry = { ...CIRCLE, radiusM };

    expect(isInside(geometry, point)).toBe(true);
  });
});

describe('R17: isInside poligono — ray-casting par-impar', () => {
  const SQUARE: PolygonGeometry = {
    shape: 'polygon',
    points: [
      { lat: 0, lng: 0 },
      { lat: 0, lng: 10 },
      { lat: 10, lng: 10 },
      { lat: 10, lng: 0 },
    ],
  };

  it('punto claramente dentro de un poligono simple es true', () => {
    expect(isInside(SQUARE, { lat: 5, lng: 5 })).toBe(true);
  });

  it('punto claramente fuera de un poligono simple es false', () => {
    expect(isInside(SQUARE, { lat: 20, lng: 20 })).toBe(false);
  });
});

describe('R18: unknown transiciona silenciosamente (event null) a inside/outside', () => {
  const previous: GeofenceState = { state: 'unknown', updatedAt: null };
  const nowMs = Date.UTC(2026, 7, 5, 12, 0, 0);

  it('posicion claramente dentro pasa a inside con event null', () => {
    const position = {
      lat: CIRCLE.centerLat,
      lng: CIRCLE.centerLng,
      accuracyM: 10,
      flags: [],
    };

    expect(evaluate(previous, CIRCLE, position, nowMs)).toEqual({
      state: { state: 'inside', updatedAt: new Date(nowMs).toISOString() },
      event: null,
    });
  });

  it('posicion claramente fuera pasa a outside con event null', () => {
    const far = pointAtDistance(CENTER, 1000);
    const position = { lat: far.lat, lng: far.lng, accuracyM: 10, flags: [] };

    expect(evaluate(previous, CIRCLE, position, nowMs)).toEqual({
      state: { state: 'outside', updatedAt: new Date(nowMs).toISOString() },
      event: null,
    });
  });
});

describe('R19: inside -> outside emite exit si distance >= radius*1.1 y accuracy <= 50 (o indefinida)', () => {
  const previous: GeofenceState = {
    state: 'inside',
    updatedAt: '2026-08-05T11:00:00.000Z',
  };
  const nowMs = Date.UTC(2026, 7, 5, 12, 0, 0);

  it('115 m con accuracyM=10 emite exit', () => {
    const point = pointAtDistance(CENTER, 115);
    const position = {
      lat: point.lat,
      lng: point.lng,
      accuracyM: 10,
      flags: [],
    };

    expect(evaluate(previous, CIRCLE, position, nowMs)).toEqual({
      state: { state: 'outside', updatedAt: new Date(nowMs).toISOString() },
      event: 'exit',
    });
  });

  it('115 m con accuracyM indefinida tambien emite exit (fail-open)', () => {
    const point = pointAtDistance(CENTER, 115);
    const position = { lat: point.lat, lng: point.lng, flags: [] };

    expect(evaluate(previous, CIRCLE, position, nowMs).event).toBe('exit');
  });
});

describe('R20: borde distance < radius*1.1 no dispara, sigue inside', () => {
  it('105 m (radius*1.05) con accuracyM=10 no dispara', () => {
    const previous: GeofenceState = {
      state: 'inside',
      updatedAt: '2026-08-05T11:00:00.000Z',
    };
    const nowMs = Date.UTC(2026, 7, 5, 12, 0, 0);
    const point = pointAtDistance(CENTER, 105);
    const position = {
      lat: point.lat,
      lng: point.lng,
      accuracyM: 10,
      flags: [],
    };

    expect(evaluate(previous, CIRCLE, position, nowMs)).toEqual({
      state: { state: 'inside', updatedAt: new Date(nowMs).toISOString() },
      event: null,
    });
  });
});

describe('R21: accuracy > 50 m bloquea el exit aunque distance >= radius*1.1', () => {
  it('115 m con accuracyM=70 (no low_accuracy, < 100) no dispara, sigue inside', () => {
    const previous: GeofenceState = {
      state: 'inside',
      updatedAt: '2026-08-05T11:00:00.000Z',
    };
    const nowMs = Date.UTC(2026, 7, 5, 12, 0, 0);
    const point = pointAtDistance(CENTER, 115);
    const position = {
      lat: point.lat,
      lng: point.lng,
      accuracyM: 70,
      flags: [],
    };

    expect(evaluate(previous, CIRCLE, position, nowMs)).toEqual({
      state: { state: 'inside', updatedAt: new Date(nowMs).toISOString() },
      event: null,
    });
  });
});

describe('R22: low_accuracy congela el estado completo (incl. updatedAt), event null', () => {
  const nowMs = Date.UTC(2026, 7, 5, 12, 0, 0);

  it('previous inside + low_accuracy devuelve previous identico pese a estar claramente fuera', () => {
    const previous: GeofenceState = {
      state: 'inside',
      updatedAt: '2026-08-05T11:00:00.000Z',
    };
    const point = pointAtDistance(CENTER, 500);
    const position = {
      lat: point.lat,
      lng: point.lng,
      accuracyM: 10,
      flags: [FLAG_LOW_ACCURACY],
    };

    expect(evaluate(previous, CIRCLE, position, nowMs)).toEqual({
      state: previous,
      event: null,
    });
  });

  it('vale para previous unknown y outside tambien', () => {
    const position = {
      lat: CIRCLE.centerLat,
      lng: CIRCLE.centerLng,
      flags: [FLAG_LOW_ACCURACY],
    };

    const unknownPrev: GeofenceState = { state: 'unknown', updatedAt: null };
    expect(evaluate(unknownPrev, CIRCLE, position, nowMs)).toEqual({
      state: unknownPrev,
      event: null,
    });

    const outsidePrev: GeofenceState = {
      state: 'outside',
      updatedAt: '2026-08-05T10:00:00.000Z',
    };
    expect(evaluate(outsidePrev, CIRCLE, position, nowMs)).toEqual({
      state: outsidePrev,
      event: null,
    });
  });
});

describe('R1 (geofence-eval-full-batch #30): suspect_jump congela el estado igual que low_accuracy', () => {
  const nowMs = Date.UTC(2026, 7, 5, 12, 0, 0);

  it('con previous inside devuelve el mismo estado pese a estar fuera', () => {
    const previous: GeofenceState = {
      state: 'inside',
      updatedAt: '2026-08-05T11:00:00.000Z',
    };
    const point = pointAtDistance(CENTER, 115);

    const result = evaluate(
      previous,
      CIRCLE,
      {
        ...point,
        accuracyM: 10,
        flags: [FLAG_SUSPECT_JUMP],
      },
      nowMs,
    );

    expect(result.event).toBeNull();
    expect(result.state).toBe(previous);
  });

  it.each([
    { state: 'unknown', updatedAt: null },
    { state: 'outside', updatedAt: '2026-08-05T10:00:00.000Z' },
  ] satisfies GeofenceState[])('con previous $state devuelve el mismo estado', (previous) => {
    const result = evaluate(
      previous,
      CIRCLE,
      {
        lat: CIRCLE.centerLat,
        lng: CIRCLE.centerLng,
        flags: [FLAG_SUSPECT_JUMP],
      },
      nowMs,
    );

    expect(result.event).toBeNull();
    expect(result.state).toBe(previous);
  });

  it('con suspect_jump y low_accuracy devuelve el mismo estado', () => {
    const previous: GeofenceState = {
      state: 'inside',
      updatedAt: '2026-08-05T11:00:00.000Z',
    };
    const point = pointAtDistance(CENTER, 115);
    const result = evaluate(
      previous,
      CIRCLE,
      {
        ...point,
        accuracyM: 10,
        flags: [FLAG_SUSPECT_JUMP, FLAG_LOW_ACCURACY],
      },
      nowMs,
    );

    expect(result.event).toBeNull();
    expect(result.state).toBe(previous);
  });
});

describe('R23: outside -> outside (distance > radius*0.9) no re-emite', () => {
  it('dos llamadas consecutivas lejos del centro devuelven event null', () => {
    const previous: GeofenceState = {
      state: 'outside',
      updatedAt: '2026-08-05T11:00:00.000Z',
    };
    const nowMs = Date.UTC(2026, 7, 5, 12, 0, 0);
    const point = pointAtDistance(CENTER, 200);
    const position = {
      lat: point.lat,
      lng: point.lng,
      accuracyM: 10,
      flags: [],
    };

    const first = evaluate(previous, CIRCLE, position, nowMs);
    expect(first.event).toBeNull();
    expect(first.state.state).toBe('outside');

    const second = evaluate(first.state, CIRCLE, position, nowMs + 60_000);
    expect(second.event).toBeNull();
    expect(second.state.state).toBe('outside');
  });
});

describe('R24: outside -> inside emite enter si distance <= radius*0.9, sin condicion de accuracy', () => {
  it('85 m con accuracyM alta (70) igual emite enter', () => {
    const previous: GeofenceState = {
      state: 'outside',
      updatedAt: '2026-08-05T11:00:00.000Z',
    };
    const nowMs = Date.UTC(2026, 7, 5, 12, 0, 0);
    const point = pointAtDistance(CENTER, 85);
    const position = {
      lat: point.lat,
      lng: point.lng,
      accuracyM: 70,
      flags: [],
    };

    expect(evaluate(previous, CIRCLE, position, nowMs)).toEqual({
      state: { state: 'inside', updatedAt: new Date(nowMs).toISOString() },
      event: 'enter',
    });
  });
});

describe('R25: geofence-eval.ts sin imports de framework/ORM/SDK; evaluate determinista', () => {
  function source(): string {
    return readFileSync(join(__dirname, 'geofence-eval.ts'), 'utf-8');
  }

  /** Codigo sin comentarios: un token citado en un comentario no cuenta. */
  function withoutComments(text: string): string {
    return text.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
  }

  it('no importa @nestjs, @aws-sdk, drizzle-orm, zod ni src/modules', () => {
    const text = withoutComments(source());

    expect(text).not.toMatch(/@nestjs/);
    expect(text).not.toMatch(/@aws-sdk/);
    expect(text).not.toMatch(/drizzle-orm/);
    expect(text).not.toMatch(/from ['"]zod['"]/);
    expect(text).not.toMatch(/src\/modules/);
  });

  it('solo importa de ./geo, ./constants y opcionalmente ./types', () => {
    const importedFrom = [...source().matchAll(/from '([^']+)'/g)].map(
      (match) => match[1],
    );

    expect(importedFrom.length).toBeGreaterThan(0);
    for (const path of importedFrom) {
      expect(['./geo', './constants', './types']).toContain(path);
    }
  });

  it('no lee el reloj del sistema (Date.now() / new Date() sin argumento)', () => {
    const text = withoutComments(source());

    expect(text).not.toMatch(/Date\.now\(\)/);
    expect(text).not.toMatch(/new Date\(\)/);
  });

  it('dos invocaciones con el mismo input devuelven el mismo output', () => {
    const previous: GeofenceState = {
      state: 'outside',
      updatedAt: '2026-08-05T11:00:00.000Z',
    };
    const position = {
      lat: CIRCLE.centerLat,
      lng: CIRCLE.centerLng,
      accuracyM: 10,
      flags: [],
    };
    const nowMs = Date.UTC(2026, 7, 5, 12, 0, 0);

    expect(evaluate(previous, CIRCLE, position, nowMs)).toEqual(
      evaluate(previous, CIRCLE, position, nowMs),
    );
  });
});

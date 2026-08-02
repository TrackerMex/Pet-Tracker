import { readFileSync } from 'node:fs';
import { join } from 'node:path';
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

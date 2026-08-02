import { readFileSync } from 'fs';
import { join } from 'path';
import { compareWeek } from './week-comparison';

describe('R21: weekComparison es el delta % a un decimal contra la base', () => {
  it('base 1 000 m/dia y rango 1 120 m/dia dan +12 %', () => {
    const comparison = compareWeek(
      { distanceM: [1_100, 1_140], activeMinutes: [60], walkCount: [2] },
      { distanceM: [900, 1_100], activeMinutes: [50], walkCount: [2] },
    );

    expect(comparison.distanceM).toBe(12);
    expect(comparison.activeMinutes).toBe(20);
    expect(comparison.walkCount).toBe(0);
  });

  it('devuelve exactamente tres claves', () => {
    const comparison = compareWeek(
      { distanceM: [1], activeMinutes: [1], walkCount: [1] },
      { distanceM: [1], activeMinutes: [1], walkCount: [1] },
    );

    expect(Object.keys(comparison).sort()).toEqual([
      'activeMinutes',
      'distanceM',
      'walkCount',
    ]);
  });

  it('una base vacia deja la metrica en null, no en 0', () => {
    const comparison = compareWeek(
      { distanceM: [1_000], activeMinutes: [60], walkCount: [2] },
      { distanceM: [], activeMinutes: [], walkCount: [] },
    );

    expect(comparison).toEqual({
      distanceM: null,
      activeMinutes: null,
      walkCount: null,
    });
  });

  it('una base con media 0 tambien es null: no se divide entre cero', () => {
    const comparison = compareWeek(
      { distanceM: [1_000], activeMinutes: [60], walkCount: [2] },
      { distanceM: [0, 0], activeMinutes: [0], walkCount: [0] },
    );

    expect(comparison).toEqual({
      distanceM: null,
      activeMinutes: null,
      walkCount: null,
    });
  });

  it('un rango sin dias computados es null aunque haya base', () => {
    const comparison = compareWeek(
      { distanceM: [], activeMinutes: [], walkCount: [] },
      { distanceM: [1_000], activeMinutes: [60], walkCount: [2] },
    );

    expect(comparison).toEqual({
      distanceM: null,
      activeMinutes: null,
      walkCount: null,
    });
  });

  it('redondea a un decimal y admite deltas negativos', () => {
    const comparison = compareWeek(
      { distanceM: [887], activeMinutes: [37], walkCount: [1] },
      { distanceM: [1_000], activeMinutes: [40], walkCount: [3] },
    );

    expect(comparison.distanceM).toBe(-11.3);
    expect(comparison.activeMinutes).toBe(-7.5);
    expect(comparison.walkCount).toBe(-66.7);
  });

  it('week-comparison.ts es aritmetica pura, sin imports ni I/O', () => {
    const source = readFileSync(join(__dirname, 'week-comparison.ts'), 'utf-8');

    expect(source).not.toMatch(/^import\s/m);
  });
});

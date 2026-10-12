import type { WeightEntry } from '../api/types';
import { monthlyWeightDelta } from './monthly-weight-delta';

function w(measuredAt: string, weightKg: number): WeightEntry {
  return {
    id: `${measuredAt}-${weightKg}`,
    petId: 'pet-1',
    measuredAt,
    weightKg,
    bodyCondition: null,
    variation: null,
  };
}

describe('#169 R5: monthlyWeightDelta', () => {
  const cases: [number, string, WeightEntry[], number | null][] = [
    [1, '2027-01-05', [w('2027-01-04', 12.4), w('2026-12-31', 12.0), w('2026-12-01', 11.0)], 0.4],
    [2, '2027-01-05', [w('2027-01-04', 12.4), w('2027-01-02', 12.1)], 0.3],
    [3, '2027-01-05', [w('2027-01-04', 12.4)], null],
    [4, '2027-01-05', [w('2026-12-31', 12.0), w('2026-12-01', 11.0)], null],
    [5, '2027-01-05', [], null],
    [6, '2026-12-31', [w('2026-12-31', 12.0), w('2026-12-01', 11.5), w('2026-11-30', 11.0)], 1],
    [7, '2027-01-05', [w('2027-01-04', 11.7), w('2026-12-31', 12.0)], -0.3],
    [8, '2027-01-05', [w('2027-01-04', 12.0), w('2026-12-31', 12.0)], 0],
    [9, '2027-01-01', [w('2027-01-01', 12.2), w('2026-12-31', 12.0)], 0.2],
    [10, '2027-01-05', [w('2027-01-04', 12.4), w('2027-01-04', 12.3), w('2026-12-31', 12.0)], 0.4],
    [11, '2027-01-05', [w('2026-01-20', 12.4), w('2026-01-02', 12.0)], null],
    [12, '2027-01-05', [w('2027-01-04', 12.0), w('2027-01-02', 12.3), w('2027-01-01', 12.1)], -0.1],
    [13, '2027-01-05', [w('2027-01-04', 12.4), w('2026-12-31', 11.8), w('2026-12-10', 12.0)], 0.6],
    [14, '2027-01-05', [w('2027-01-04', 12.4), w('2027-01-04', 12.3)], 0.1],
    [15, '2027-01-05', [w('2027-01-04', 12.04), w('2026-12-31', 12.0)], 0.04],
  ];

  it.each(cases)('fila %i con hoy %s', (_row, todayIso, entries, expected) => {
    const delta = monthlyWeightDelta(entries, todayIso);
    if (expected === null) expect(delta).toBeNull();
    else expect(delta).toBe(expected);
  });
});

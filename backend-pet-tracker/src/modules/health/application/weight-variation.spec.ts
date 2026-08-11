import { PetWeight } from '@/modules/health/domain/entities/weight.entity';
import { toWeightHistory, weightDelta } from './weight-variation';

function weight(id: string, weightKg: number, measuredAt: string): PetWeight {
  return new PetWeight({
    id,
    petId: 'pet-1',
    weightKg,
    measuredAt,
    bodyCondition: null,
  });
}

describe('R5 (health-weights #15): variation usa el historial total ordenado', () => {
  it('cubre historiales de cero, una y dos mediciones', () => {
    const oldest = weight('a', 10, '2026-01-01');
    const newest = weight('b', 12.5, '2026-02-01');

    expect(toWeightHistory([], 50)).toEqual([]);
    expect(toWeightHistory([oldest], 50)).toEqual([
      { ...oldest, variation: null },
    ]);
    expect(toWeightHistory([newest, oldest], 50)).toEqual([
      { ...newest, variation: 2.5 },
      { ...oldest, variation: null },
    ]);
  });

  it('redondea la diferencia a dos decimales', () => {
    expect(weightDelta(70.2, 69.8)).toBe(0.4);
    expect(weightDelta(10, null)).toBeNull();
  });

  it('usa la fila de sonda para calcular el ultimo elemento de la pagina', () => {
    const newest = weight('b', 70.2, '2026-02-01');
    const probe = weight('a', 69.8, '2026-01-01');

    expect(toWeightHistory([newest, probe], 1)).toEqual([
      { ...newest, variation: 0.4 },
    ]);
  });

  it('respeta el desempate por id cuando measuredAt coincide', () => {
    const first = weight(
      '019ff000-0000-7000-8000-000000000001',
      20,
      '2026-01-01',
    );
    const second = weight(
      '019ff000-0000-7000-8000-000000000002',
      20.75,
      '2026-01-01',
    );

    expect(toWeightHistory([second, first], 50)).toEqual([
      { ...second, variation: 0.75 },
      { ...first, variation: null },
    ]);
  });
});

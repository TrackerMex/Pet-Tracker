import { kcalConsumed, servedInPlan } from './meal-serving.entity';

describe('R11 (meals-served-tracking #83): servedInPlan devuelve solo franjas del plan, en su orden y sin duplicados', () => {
  it('devuelve las franjas servidas en el orden del plan', () => {
    expect(servedInPlan(['07:30', '19:30'], ['19:30', '07:30'])).toEqual([
      '07:30',
      '19:30',
    ]);
  });

  it('excluye franjas que ya no pertenecen al plan vigente', () => {
    expect(
      servedInPlan(['08:00', '13:00', '20:00'], ['07:30', '08:00']),
    ).toEqual(['08:00']);
  });

  it('no duplica una franja aunque la lectura la repita', () => {
    expect(servedInPlan(['07:30', '19:30'], ['07:30', '07:30'])).toEqual([
      '07:30',
    ]);
  });

  it('devuelve vacio cuando el plan o las servidas estan vacios', () => {
    expect(servedInPlan([], ['07:30'])).toEqual([]);
    expect(servedInPlan(['07:30'], [])).toEqual([]);
  });
});

describe('R1 (nutrition-kcal-consumed #104): kcalConsumed reparte merKcal a partes iguales y redondea una sola vez el agregado', () => {
  it('reparte 1059 kcal en 2 franjas redondeando la mitad hacia arriba', () => {
    expect([0, 1, 2].map((served) => kcalConsumed(1059, 2, served))).toEqual([
      0, 530, 1059,
    ]);
  });

  it('reparte 1000 kcal en 3 franjas y la suma de incrementos es el total', () => {
    expect([0, 1, 2, 3].map((served) => kcalConsumed(1000, 3, served))).toEqual([
      0, 333, 667, 1000,
    ]);
  });

  it('reparte 1001 kcal en 4 franjas', () => {
    expect(
      [0, 1, 2, 3, 4].map((served) => kcalConsumed(1001, 4, served)),
    ).toEqual([0, 250, 501, 751, 1001]);
  });
});

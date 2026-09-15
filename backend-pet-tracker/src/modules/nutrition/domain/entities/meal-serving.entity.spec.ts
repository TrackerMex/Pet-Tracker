import { servedInPlan } from './meal-serving.entity';

describe('R11 (meals-served-tracking #83): servedInPlan devuelve solo franjas del plan, en su orden y sin duplicados', () => {
  it('devuelve las franjas servidas en el orden del plan', () => {
    expect(
      servedInPlan(['07:30', '19:30'], ['19:30', '07:30']),
    ).toEqual(['07:30', '19:30']);
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
